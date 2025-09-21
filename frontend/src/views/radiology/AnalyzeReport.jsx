import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge, OverlayTrigger, Tooltip, Tabs, Tab, Image } from 'react-bootstrap';
import Card from '../../components/Card';
import SubscriptionGate from '../../components/SubscriptionGateBypass';
import apiClient from '../../services/api';
import { RADIOLOGY_ENDPOINTS } from '../../services/apiConstants';
import Chart from 'react-apexcharts';
import ReportChatInterface from './ReportChatInterface';
import { MessageSquare, File } from 'lucide-react';

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const AnalyzedTextDisplay = ({ originalText, highlights }) => {
    if (!originalText) {
        return <p className="text-muted">No report text to display.</p>;
    }

    const displayElements = useMemo(() => {
        if (!highlights || highlights.length === 0) {
            return [<span key="original-text-only">{originalText}</span>];
        }

        const elements = [];
        let currentIndex = 0;

        highlights.forEach((highlight) => {
            if (highlight.startIndex > currentIndex) {
                elements.push(
                    <span key={`text-before-${highlight.uniqueKey}`}>
                        {originalText.substring(currentIndex, highlight.startIndex)}
                    </span>
                );
            }

            const tooltipContent = (
                <Tooltip id={`tooltip-${highlight.uniqueKey}`} style={{ maxWidth: '450px', textAlign: 'left' }}>
                    <Badge bg="danger-subtle" text="danger-emphasis" className="me-2 text-capitalize mb-1">{highlight.issueData.type.replace(/_/g, ' ')}</Badge><br />
                    <strong>Suggestion:</strong> {highlight.issueData.suggestion}<br />
                    <small><strong>Original Text:</strong> "{highlight.text}"</small><br />
                    <small><strong>Description:</strong> {highlight.issueData.description}</small>
                </Tooltip>
            );

            elements.push(
                <OverlayTrigger
                    key={`highlight-${highlight.uniqueKey}`}
                    placement="top"
                    overlay={tooltipContent}
                >
                    <span
                        className="text-danger fw-bold"
                        style={{
                            cursor: 'pointer',
                            borderBottom: '1.5px dotted red',
                            backgroundColor: 'rgba(255, 0, 0, 0.07)',
                            padding: '0 1px',
                            margin: '0 -1px'
                        }}
                    >
                        {originalText.substring(highlight.startIndex, highlight.endIndex)}
                    </span>
                </OverlayTrigger>
            );
            currentIndex = highlight.endIndex;
        });

        if (currentIndex < originalText.length) {
            elements.push(
                <span key={`text-after-all`}>
                    {originalText.substring(currentIndex)}
                </span>
            );
        }
        return elements;

    }, [originalText, highlights]);

    return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1rem', fontFamily: 'Georgia, serif' }}>{displayElements}</div>;
};


const AnalyzeReport = () => {
    const [reportText, setReportText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const mainReportFileInputRef = useRef(null);
    const reportImageFileInputRef = useRef(null);

    const [correctedReportText, setCorrectedReportText] = useState('');
    const [processedHighlights, setProcessedHighlights] = useState([]);

    const [activeLeftTab, setActiveLeftTab] = useState('analysis');
    const [clearChatTrigger, setClearChatTrigger] = useState(0);
    const [newThreadTrigger, setNewThreadTrigger] = useState(0);

    const [reportImageFile, setReportImageFile] = useState(null);
    const [reportImagePreviewUrl, setReportImagePreviewUrl] = useState('');

    const [lastChatImageUploadTimestamp, setLastChatImageUploadTimestamp] = useState(null);
    const [lastChatReportUploadTimestamp, setLastChatReportUploadTimestamp] = useState(null);

    const [isChatReady, setIsChatReady] = useState(false);
    const [reportContextForChat, setReportContextForChat] = useState('');

    const handleReportImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file (PNG, JPG, etc.) for the XRay.');
                setReportImageFile(null);
                setReportImagePreviewUrl('');
                if (reportImageFileInputRef.current) reportImageFileInputRef.current.value = "";
                return;
            }
            setReportImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setReportImagePreviewUrl(previewUrl);
            setError('');
            setLastChatImageUploadTimestamp(Date.now());
            setIsChatReady(true); 
            setActiveLeftTab('chatbot');
        } else {
            setReportImageFile(null);
            setReportImagePreviewUrl('');
        }
    };

    const handleMainReportFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
                setError(`Unsupported file type for report. Please upload .txt, .pdf, or .docx.`);
                setSelectedFile(null);
                setReportText('');
                if (mainReportFileInputRef.current) mainReportFileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
            setReportText(''); 
            setError('');
            setAnalysisResult(null); 
            setCorrectedReportText('');
            setProcessedHighlights([]);
            setIsChatReady(!!reportImageFile); // Chat is ready if an image is already there, or becomes ready after analysis
        }
    };

    const computeNonOverlappingHighlights = useCallback((originalText, flaggedIssues) => {
        if (!originalText || !flaggedIssues || flaggedIssues.length === 0) {
            return [];
        }
        let foundHighlights = [];
        flaggedIssues.forEach((issue, issueIndex) => {
            if (issue.segment && typeof issue.segment === 'string' && issue.segment.trim() !== '') {
                const escapedSegment = escapeRegExp(issue.segment);
                const regex = new RegExp(escapedSegment, 'g');
                let match;
                while ((match = regex.exec(originalText)) !== null) {
                    foundHighlights.push({
                        startIndex: match.index,
                        endIndex: match.index + issue.segment.length,
                        text: issue.segment,
                        issueData: issue,
                        uniqueKey: `issue-${issueIndex}-match-${match.index}`
                    });
                }
            }
        });

        foundHighlights.sort((a, b) => {
            if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
            return b.endIndex - a.endIndex; 
        });

        const nonOverlappingHighlights = [];
        let lastProcessedEndIndex = 0;
        for (const highlight of foundHighlights) {
            if (highlight.startIndex >= lastProcessedEndIndex) {
                nonOverlappingHighlights.push(highlight);
                lastProcessedEndIndex = highlight.endIndex;
            }
        }
        return nonOverlappingHighlights;
    }, []);

    useEffect(() => {
        if (analysisResult && analysisResult.original_text) {
            const highlights = computeNonOverlappingHighlights(analysisResult.original_text, analysisResult.flagged_issues);
            setProcessedHighlights(highlights);

            let newText = "";
            let currentIndex = 0;
            if (highlights.length > 0) {
                highlights.forEach(highlight => {
                    if (highlight.startIndex > currentIndex) {
                        newText += analysisResult.original_text.substring(currentIndex, highlight.startIndex);
                    }
                    newText += highlight.issueData.suggestion;
                    currentIndex = highlight.endIndex;
                });
                if (currentIndex < analysisResult.original_text.length) {
                    newText += analysisResult.original_text.substring(currentIndex);
                }
            } else {
                newText = analysisResult.original_text;
            }
            setCorrectedReportText(newText);
        } else {
            setProcessedHighlights([]);
            setCorrectedReportText('');
        }
    }, [analysisResult, computeNonOverlappingHighlights]);


    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!selectedFile && !reportText.trim()) {
            setError('Please upload a report file or enter text to analyze.');
            return;
        }
        setIsAnalyzing(true);
        setError('');
        setAnalysisResult(null);
        setCorrectedReportText('');
        setProcessedHighlights([]);
        
        const formData = new FormData();
        if (selectedFile) {
            formData.append('file', selectedFile);
        } else if (reportText.trim()) {
            formData.append('text_content', reportText);
        }
        
        try {
            const response = await apiClient.post(RADIOLOGY_ENDPOINTS.ACTIONS.ANALYZE_REPORT, formData, {
                headers: selectedFile ? { 'Content-Type': 'multipart/form-data' } : {},
            });
            setAnalysisResult(response.data);
            if (response.data.original_text) {
                setReportText(response.data.original_text); 
            }
            setReportContextForChat(response.data.corrected_report_text || response.data.original_text);
            setIsChatReady(true); 
        } catch (err) {
            setError(err.response?.data?.error || 'Textual analysis failed. Please try again.');
            console.error("Textual analysis error:", err);
            setIsChatReady(!!reportImageFile); 
        } finally {
            setIsAnalyzing(false);
            if (mainReportFileInputRef.current && selectedFile) mainReportFileInputRef.current.value = "";
        }
    };

    const handlePassToChatbot = () => {
        let contextToPass = "";
        if (correctedReportText) {
            contextToPass = correctedReportText;
        } else if (analysisResult && analysisResult.original_text) {
            contextToPass = analysisResult.original_text;
        } else if (reportText.trim()) {
            contextToPass = reportText;
        }

        if (contextToPass || reportImageFile) {
            setReportContextForChat(contextToPass);
            setLastChatReportUploadTimestamp(contextToPass ? Date.now() : null);
            setActiveLeftTab('chatbot');
            setIsChatReady(true);
        } else {
            setError("No report text or image available to pass to chatbot.");
            setIsChatReady(false);
        }
    };
    
    const handleNewThread = () => {
        setSelectedFile(null);
        setReportImageFile(null);
        setReportImagePreviewUrl('');
        setReportText('');
        setAnalysisResult(null);
        setCorrectedReportText('');
        setProcessedHighlights([]);
        setError('');
    
        if (mainReportFileInputRef.current) {
            mainReportFileInputRef.current.value = "";
        }
        if (reportImageFileInputRef.current) {
            reportImageFileInputRef.current.value = "";
        }
    
        setIsChatReady(false);
        setReportContextForChat('');
        setLastChatImageUploadTimestamp(null);
        setLastChatReportUploadTimestamp(null);
        
        setNewThreadTrigger(prev => prev + 1); 
        
        setActiveLeftTab('analysis'); 
    };


    const handleCopyCorrectedText = () => {
        navigator.clipboard.writeText(correctedReportText)
            .then(() => alert('Corrected report copied to clipboard!'))
            .catch(err => {
                console.error('Failed to copy corrected report: ', err);
                alert('Failed to copy text. Please try manually.');
            });
    };

    const handleDownloadCorrectedText = () => {
        const blob = new Blob([correctedReportText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalFilename = analysisResult?.original_filename || selectedFile?.name || "report";
        const nameParts = originalFilename.split('.');
        const extension = nameParts.length > 1 ? nameParts.pop() : 'txt';
        const baseName = nameParts.join('.');
        link.download = `${baseName}_corrected.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const getErrorDistributionChartOptions = () => {
        if (!analysisResult || !analysisResult.error_distribution || typeof analysisResult.error_distribution !== 'object') {
            return null;
        }
        const categories = Object.keys(analysisResult.error_distribution);
        const dataValues = Object.values(analysisResult.error_distribution);

        if (categories.length === 0 || dataValues.length === 0) {
            return null;
        }
        let yAxisTickAmount;
        if (dataValues.length > 0) {
            const maxVal = Math.max(...dataValues);
            yAxisTickAmount = maxVal < 5 ? (maxVal > 0 ? maxVal + 1 : 2) : 5;
        } else {
            yAxisTickAmount = 2;
        }

        return {
            options: {
                chart: { type: 'bar', height: 180, toolbar: { show: false } },
                plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '60%' } },
                dataLabels: { enabled: false },
                xaxis: { categories, title: { text: 'Error Types', style: { fontSize: '10px' } }, labels: { style: { fontSize: '9px' } } },
                yaxis: {
                    title: { text: 'Count', style: { fontSize: '10px' } },
                    labels: { formatter: (val) => Math.floor(val), style: { fontSize: '9px' } },
                    min: 0,
                    tickAmount: yAxisTickAmount,
                },
                colors: ['#6f42c1'],
                tooltip: { y: { formatter: (val) => `${val} errors` } },
            },
            series: [{ name: 'Error Count', data: dataValues }],
        };
    };

    const getAccuracyChartOptions = () => {
        if (!analysisResult || typeof analysisResult.accuracy_score === 'undefined' || analysisResult.accuracy_score === null) {
            return null;
        }
        const score = Math.round(parseFloat(analysisResult.accuracy_score));
        if (isNaN(score)) return null;
        const scoreColor = '#6f42c1';

        return {
            options: {
                chart: { type: 'radialBar', height: 180, sparkline: { enabled: true } },
                plotOptions: {
                    radialBar: {
                        startAngle: -90, endAngle: 90, hollow: { margin: 5, size: '65%' },
                        track: { background: '#e7e7e7', strokeWidth: '97%', margin: 5 },
                        dataLabels: { name: { show: false }, value: { offsetY: -2, fontSize: '20px', fontWeight: 'bold', color: scoreColor } },
                    },
                },
                grid: { padding: { top: -10 } },
                fill: { type: 'solid', colors: [scoreColor] },
                labels: ['Accuracy'],
            },
            series: [score],
        };
    };

    const errorDistChartConfig = getErrorDistributionChartOptions();
    const accuracyChartConfig = getAccuracyChartOptions();
    const canPassToChat = (correctedReportText || (analysisResult && analysisResult.original_text) || reportText.trim() || reportImageFile);

    return (
        <SubscriptionGate serviceName="Radiology Report Analysis">
            <Container fluid>
                <Row>
                    <Col lg={8} className="mb-3 mb-lg-0">
                    <Tabs
                        activeKey={activeLeftTab}
                        onSelect={(k) => setActiveLeftTab(k)}
                        id="radiology-main-tabs"
                        className="mb-3"
                    >
                        <Tab eventKey="analysis" title="Analysis">
                            {isAnalyzing && !analysisResult && (
                                <Card>
                                    <Card.Body className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2">Analyzing report, please wait...</p> 
                                    </Card.Body>
                                </Card>
                            )}
                            {!isAnalyzing && !analysisResult && !reportImageFile && (
                                <Card>
                                    <Card.Body className="text-center py-5">
                                        <i className="ri-file-upload-line ri-3x text-muted mb-3"></i>
                                        <p className="text-muted">Please upload a report to analyze or an X-ray to discuss.</p>
                                    </Card.Body>
                                </Card>
                            )}
                             {!isAnalyzing && !analysisResult && reportImageFile && (
                                <Card>
                                    <Card.Body className="text-center py-5">
                                        <i className="ri-image-line ri-3x text-muted mb-3"></i>
                                        <p className="text-muted">X-ray image uploaded. You can now pass it to the chatbot or upload a report for analysis.</p>
                                    </Card.Body>
                                </Card>
                            )}
                            {analysisResult && (
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Card>
                                            <Card.Header><Card.Header.Title as="h6">Analyzed Report</Card.Header.Title></Card.Header>
                                            <Card.Body style={{ whiteSpace: 'pre-wrap' }}>
                                                <AnalyzedTextDisplay originalText={analysisResult.original_text} highlights={processedHighlights} />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Card>
                                            <Card.Header><Card.Header.Title as="h6">Corrected Report</Card.Header.Title></Card.Header>
                                            <Card.Body style={{ padding: '0' }}>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={10}
                                                    value={correctedReportText}
                                                    onChange={(e) => setCorrectedReportText(e.target.value)}
                                                    style={{ backgroundColor: 'transparent', border: 'none', resize: 'vertical', minHeight: '300px', whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', lineHeight: '1.8', fontSize: '1rem' }}
                                                />
                                            </Card.Body>
                                            <Card.Footer className="text-end bg-transparent border-top-0 pt-0">
                                                <Button variant="outline-secondary" size="sm" onClick={handleCopyCorrectedText} className="me-2">Copy</Button>
                                                <Button variant="outline-primary" size="sm" onClick={handleDownloadCorrectedText}>Download</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Card>
                                            <Card.Header><Card.Header.Title as="h6">Error Distribution</Card.Header.Title></Card.Header>
                                            <Card.Body>
                                                {errorDistChartConfig ? (
                                                    <Chart options={errorDistChartConfig.options} series={errorDistChartConfig.series} type="bar" height={280} width="100%" />
                                                ) : <p className="text-muted text-center m-0">Not available.</p>}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Card>
                                            <Card.Header><Card.Header.Title as="h6">Accuracy Score</Card.Header.Title></Card.Header>
                                            <Card.Body>
                                                {accuracyChartConfig ? (
                                                    <Chart options={accuracyChartConfig.options} series={accuracyChartConfig.series} type="radialBar" height={280} />
                                                ) : <p className="text-muted text-center m-0">Not available.</p>}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}
                             {(analysisResult || reportText.trim()) && (
                                <Col md={12} className="text-center mt-3 mb-3">
                                    <Card className="border-0 shadow-none">
                                        <Button variant="success" onClick={handlePassToChatbot} size="lg" disabled={!canPassToChat}>
                                            <i className="ri-send-plane-2-line me-2"></i>Pass Context to AI Chatbot
                                        </Button>
                                    </Card>
                                </Col>
                            )}
                        </Tab>
                        <Tab eventKey="chatbot" title={<><MessageSquare size={18} className="me-1" />Chatbot</>}>
                            <Card style={{ height: 'calc(100vh - 210px)', display: 'flex', flexDirection: 'column' }}>
                                <Card.Body className="p-0 flex-grow-1" style={{ overflow: 'hidden' }}>
                                    <ReportChatInterface
                                        reportId={analysisResult?.id || null}
                                        initialReportText={reportContextForChat}
                                        initialAssociatedImageFile={reportImageFile}
                                        initialAssociatedImagePreviewUrl={reportImagePreviewUrl}
                                        isChatDisabled={!isChatReady}
                                        chatImageToDisplay={lastChatImageUploadTimestamp ? { file: reportImageFile, previewUrl: reportImagePreviewUrl, timestamp: lastChatImageUploadTimestamp } : null}
                                        chatReportToDisplay={lastChatReportUploadTimestamp ? { file: selectedFile, text: reportContextForChat, timestamp: lastChatReportUploadTimestamp } : null}
                                        clearChatTrigger={clearChatTrigger}
                                        newThreadTrigger={newThreadTrigger}
                                    />
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>

                <Col lg={4}>
                    <Card>
                        <Card.Header className="bg-light-blue">
                            <Card.Header.Title>
                                <h5 className="card-title text-primary mb-0">Upload & Analyze</h5>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            {reportImagePreviewUrl && (
                                <div className="mt-2 text-center">
                                    <Image src={reportImagePreviewUrl} alt="XRay Preview" thumbnail style={{ maxHeight: '200px', border: '1px solid #dee2e6' }} />
                                    {reportImageFile && <p className="text-muted small mt-1 mb-0">{reportImageFile.name}</p>}
                                    <hr />
                                </div>
                            )}
                            {selectedFile &&
                                <div className="text-center mb-3">
                                    <File size={24} className="text-primary mb-1" />
                                    <p className="form-text text-muted mt-1 d-block text-center mb-0">Report for analysis: {selectedFile.name}</p>
                                    <hr />
                                </div>
                            }
                            <Form onSubmit={handleAnalyze}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <Form.Group controlId="reportImageFile" className="mb-2">
                                        <Button variant="info" className="w-100 mb-1" onClick={() => reportImageFileInputRef.current?.click()}>
                                            <i className="ri-image-add-line me-1"></i>Upload XRay
                                        </Button>
                                        <Form.Control type="file" onChange={handleReportImageFileChange} accept="image/*" ref={reportImageFileInputRef} style={{ display: 'none' }} />
                                    </Form.Group>
                                    <Form.Group controlId="reportFile" className="mb-2">
                                        <Button variant="info" className="w-100 mb-1" onClick={() => mainReportFileInputRef.current?.click()}>
                                            <i className="ri-file-upload-line me-1"></i>Upload Report
                                        </Button>
                                        <Form.Control type="file" onChange={handleMainReportFileChange} accept=".txt,.pdf,.docx" ref={mainReportFileInputRef} style={{ display: 'none' }} />
                                    </Form.Group>
                                </div>

                                {error && <Alert variant="danger" className="my-2 py-1 small">{error}</Alert>}

                                <Button variant="primary" type="submit" disabled={isAnalyzing || (!selectedFile && !reportText.trim())} className="w-100 mb-3">
                                    {isAnalyzing ? (
                                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Analyzing...</>
                                    ) : (
                                        <><i className="ri-search-eye-line me-2"></i>Analyze Report</>
                                    )}
                                </Button>
                            </Form>

                            <hr />
                            <p className="text-muted small mt-2">Chat Controls:</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <Button disabled={!isChatReady} variant="warning" className="w-100" onClick={() => setClearChatTrigger(prev => prev + 1)}>
                                    <i className="ri-chat-delete-line me-2"></i>Clear chat
                                </Button>
                                <Button variant="warning" className="w-100" onClick={handleNewThread}>
                                    <i className="ri-add-circle-line me-2"></i>New Thread
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </SubscriptionGate>
    );
};

export default AnalyzeReport;