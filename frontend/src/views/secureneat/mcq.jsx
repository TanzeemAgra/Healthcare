import React, { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge, Tabs, Tab, ListGroup } from "react-bootstrap";
import Card from "../../components/Card";
import SubscriptionGate from "../../components/SubscriptionGate";
import apiClient from "../../services/api";
import axios from 'axios';

const McqPractice = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [mcqGenerationType, setMcqGenerationType] = useState("full_book_wise");
  const [generatedMcqs, setGeneratedMcqs] = useState(null);
  const [isLoadingMcqs, setIsLoadingMcqs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mcqError, setMcqError] = useState("");
  const [s3UploadError, setS3UploadError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const fileInputRef = useRef(null);

 
  const [s3UploadResult, setS3UploadResult] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setMcqError("");
      setS3UploadError("");
      setGeneratedMcqs(null);
      setUserAnswers({});
      setShowResults(false);
      setTestSubmitted(false);
      setS3UploadResult(null);
    } else {
      setPdfFile(null);
      setMcqError(file ? "Please select a PDF file." : "");
      setS3UploadError("");
    }
  };

  const handleNumQuestionsChange = (event) => {
    const value = event.target.value;
    if (value === "" || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 50)) {
      setNumQuestions(value === "" ? "" : parseInt(value, 10));
    } else if (parseInt(value, 10) > 50) {
      setNumQuestions(50);
    } else if (parseInt(value, 10) < 1 && value !== "") {
      setNumQuestions(1);
    }
  };

  const handleGenerateMcqs = async () => {
    if (!pdfFile) {
      setMcqError("Please select a PDF file.");
      return;
    }
    const numQ = parseInt(numQuestions, 10);
    if (isNaN(numQ) || numQ < 1 || numQ > 50) {
      setMcqError("Please enter a valid number of questions (1-50).");
      return;
    }

   
    setIsLoadingMcqs(true);
    setIsUploading(true);
    setMcqError("");
    setS3UploadError("");
    setGeneratedMcqs(null);
    setUserAnswers({});
    setShowResults(false);
    setTestSubmitted(false);
    setS3UploadResult(null);

   
   
    const s3MetadataPayload = {
        filename: pdfFile.name,
        content_type: pdfFile.type,
        size: pdfFile.size,
    };

   
    apiClient.post("/secureneat/upload-s3/", s3MetadataPayload)
        .then(response => {
            const { url, fields } = response.data.presigned_post;
            const fileKey = response.data.file_key;
            const dbId = response.data.db_id;
            const fileUrl = response.data.file_url;

           
            const formData = new FormData();
           
            Object.keys(fields).forEach(key => {
                formData.append(key, fields[key]);
            });
           
            formData.append('file', pdfFile);

           
            return axios.post(url, formData, {
                 headers: {
                   
                   
                    'Content-Type': 'multipart/form-data'
                 },
                
            });
        })
        .then(s3UploadResponse => {
           
            if (s3UploadResponse.status === 204) {
                
                 const uploadedFileKey = s3UploadResponse.config.data.get('Key') || s3UploadResult?.file_key;
                 setS3UploadResult({ success: true, file_key: uploadedFileKey });
            } else {
                
                 setS3UploadError("S3 upload failed with unexpected status.");
            }
        })
        .catch(s3Error => {
           
            let errorMessage = "Background S3 upload failed.";
            if (s3Error.response) {
               
               
                errorMessage += ` Server responded with status ${s3Error.response.status}.`;
                if (s3Error.response.data) {
                    errorMessage += ` Details: ${JSON.stringify(s3Error.response.data)}`;
                }
            } else if (s3Error.request) {
               
                errorMessage += " No response received from S3.";
            } else {
               
                errorMessage += ` Error: ${s3Error.message}`;
            }
            setS3UploadError(errorMessage);
        })
        .finally(() => {
            setIsUploading(false);
        });


   
   
   
    const mcqFormData = new FormData();
    mcqFormData.append("file", pdfFile);
    mcqFormData.append("num_questions", numQ);
    mcqFormData.append("generation_type", mcqGenerationType);

    try {
      const mcqResponse = await apiClient.post("/secureneat/generate-mcq/", mcqFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGeneratedMcqs(mcqResponse.data);

    } catch (error) {
      setMcqError(
         error.response?.data?.error ||
         "Failed to generate MCQs. The AI might be busy or the PDF content is unsuitable."
      );
    } finally {
      setIsLoadingMcqs(false);
     
    }
  };

 

  const handleAnswerSelect = (questionGlobalIndex, selectedOptionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionGlobalIndex]: selectedOptionIndex,
    }));
  };

  const handleSubmitTest = () => {
    setTestSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!generatedMcqs) return { overall: { score: 0, total: 0 } };

    let overallScore = 0;
    let overallTotal = 0;
    const chapterResults = [];

    const allQuestions = getAllQuestionsWithChapterInfo();

    if (generatedMcqs.mcq_type === "chapter_wise" && generatedMcqs.chapters) {
      generatedMcqs.chapters.forEach(chapter => {
        let chapterScore = 0;
        const chapterQuestions = allQuestions.filter(q => q.chapterTitle === chapter.chapter_title);
        const chapterTotal = chapterQuestions.length;
        overallTotal += chapterTotal;

        chapterQuestions.forEach(question => {
           const globalIndex = question.globalIndex;
           if (globalIndex !== -1 && userAnswers[globalIndex] === question.correct_answer) {
             chapterScore++;
             overallScore++;
           }
        });
        chapterResults.push({
          title: chapter.chapter_title,
          score: chapterScore,
          total: chapterTotal,
        });
      });
      return { overall: { score: overallScore, total: overallTotal }, chapters: chapterResults };
    } else if (generatedMcqs.mcq_type === "full_book_wise" && generatedMcqs.questions) {
      overallTotal = generatedMcqs.questions.length;
      generatedMcqs.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
          overallScore++;
        }
      });
      return { overall: { score: overallScore, total: overallTotal } };
    }
    return { overall: { score: 0, total: 0 } };
  };

  const getAllQuestionsWithChapterInfo = () => {
    if (!generatedMcqs) return [];
    if (generatedMcqs.mcq_type === "chapter_wise" && generatedMcqs.chapters) {
      let globalIndex = 0;
      return generatedMcqs.chapters.flatMap(chapter =>
        chapter.questions.map(q => ({
          ...q,
          chapterTitle: chapter.chapter_title,
          globalIndex: globalIndex++
        }))
      );
    } else if (generatedMcqs.mcq_type === "full_book_wise" && generatedMcqs.questions) {
      return generatedMcqs.questions.map((q, index) => ({ ...q, globalIndex: index }));
    }
    return [];
  };


  const resetTest = () => {
    setPdfFile(null);
    setGeneratedMcqs(null);
    setUserAnswers({});
    setShowResults(false);
    setTestSubmitted(false);
    setMcqError("");
    setS3UploadError("");
    setS3UploadResult(null);
    setIsLoadingMcqs(false);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const retakeTest = () => {
    setUserAnswers({});
    setShowResults(false);
    setTestSubmitted(false);
  };

  const renderMCQTest = () => {
    if (!generatedMcqs) return null;

    const allQuestionsWithInfo = getAllQuestionsWithChapterInfo();
    const results = showResults ? calculateScore() : null;

    return (
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-primary">{generatedMcqs.document_title || "MCQ Test"}</h4>
          <div>
            <Button variant="outline-secondary" size="sm" onClick={retakeTest} className="me-2">
              Retake Test
            </Button>
            <Button variant="outline-primary" size="sm" onClick={resetTest}>
              New MCQs
            </Button>
          </div>
        </div>

        {generatedMcqs.mcq_type === "chapter_wise" && generatedMcqs.chapters ? (
          generatedMcqs.chapters.map((chapter, chapterIndex) => (
            <div key={`chapter-${chapterIndex}`} className="mb-5">
              <h5 className="text-info mb-3 border-bottom pb-2">Chapter: {chapter.chapter_title}</h5>
              {chapter.questions.map((question, questionIndexInChapter) => {
               
                const questionWithGlobalInfo = allQuestionsWithInfo.find(
                  q => q.question === question.question && q.chapterTitle === chapter.chapter_title
                      
                );
                const globalQuestionIndex = questionWithGlobalInfo ? questionWithGlobalInfo.globalIndex : -1;

                return renderQuestion(question, globalQuestionIndex, `${chapterIndex + 1}.${questionIndexInChapter + 1}`);
              })}
            </div>
          ))
        ) : generatedMcqs.mcq_type === "full_book_wise" && generatedMcqs.questions ? (
          generatedMcqs.questions.map((question, questionIndex) =>
             renderQuestion(question, questionIndex, questionIndex + 1)
          )
        ) : (
          <Alert variant="warning">No MCQs found in the expected format.</Alert>
        )}

        {!showResults && allQuestionsWithInfo.length > 0 && (
          <div className="text-center mt-4">
            <Button
              variant="success"
              size="lg"
              onClick={handleSubmitTest}
              disabled={
                Object.keys(userAnswers).length !== allQuestionsWithInfo.length
              }
            >
              Submit Test ({Object.keys(userAnswers).length}/{allQuestionsWithInfo.length})
            </Button>
          </div>
        )}

        {showResults && results && (
          <Card className="mt-5 shadow border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Test Results</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6} className="text-center border-end-md">
                    <h5 className="text-muted">Overall Score</h5>
                    <h2 className="text-primary display-5 fw-bold">
                      {results.overall.score}/{results.overall.total}
                    </h2>
                    <p className="mb-0 fs-4">
                      ({results.overall.total > 0 ? Math.round((results.overall.score / results.overall.total) * 100) : 0}%)
                    </p>
                </Col>
                <Col md={6} className="text-center mt-3 mt-md-0">
                    {generatedMcqs.mcq_type === "chapter_wise" && results.chapters && results.chapters.length > 0 ? (
                        <>
                            <h5 className="text-muted mb-3">Chapter-wise Performance</h5>
                            <ListGroup variant="flush" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                {results.chapters.map((chapResult, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-1 py-2">
                                        <span className="fw-semibold text-start me-2" style={{flexBasis: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={chapResult.title}>
                                            {chapResult.title}
                                        </span>
                                        <Badge bg="primary-subtle" text="primary" pill className="fs-6">
                                            {chapResult.score}/{chapResult.total}
                                            ({chapResult.total > 0 ? Math.round((chapResult.score / chapResult.total) * 100) : 0}%)
                                        </Badge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                             <p className="text-muted">Full book test completed.</p>
                        </div>
                    )}
                </Col>
              </Row>
              <hr />
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Button variant="primary" onClick={retakeTest}>
                  Retake Test
                </Button>
                <Button variant="outline-primary" onClick={resetTest}>
                  Generate New MCQs
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  };

  const renderQuestion = (question, globalQuestionIndex, displayQuestionNumber) => {
    if (globalQuestionIndex === -1) {
        console.warn("Could not determine global index for question:", question);
        return null;
    }
    return (
      <Card key={globalQuestionIndex} className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold">Question {displayQuestionNumber}</h6>
            {showResults && (
              <Badge
                bg={userAnswers[globalQuestionIndex] === question.correct_answer ? "success-subtle" : "danger-subtle"}
                text={userAnswers[globalQuestionIndex] === question.correct_answer ? "success" : "danger"}
              >
                {userAnswers[globalQuestionIndex] === question.correct_answer ? "Correct" : "Incorrect"}
              </Badge>
            )}
          </div>
          <p className="mb-4 fs-6">{question.question}</p>
          <div>
            {question.options.map((option, optionIndex) => {
              const optionLetter = String.fromCharCode(65 + optionIndex);
              const isSelected = userAnswers[globalQuestionIndex] === optionIndex;
              const isCorrect = question.correct_answer === optionIndex;

              let labelClass = "form-check-label d-flex align-items-center p-2 rounded border";
              let inputClass = "form-check-input me-2";

              if (showResults) {
                if (isCorrect) {
                  labelClass += " border-success bg-success-subtle text-success-emphasis fw-bold";
                  inputClass += " border-success";
                } else if (isSelected && !isCorrect) {
                  labelClass += " border-danger bg-danger-subtle text-danger-emphasis";
                  inputClass += " border-danger";
                } else {
                  labelClass += " border-light";
                }
              } else {
                 labelClass += isSelected ? " border-primary bg-primary-subtle" : " border-light";
              }

              return (
                <div key={optionIndex} className="form-check mb-2">
                  <input
                    className={inputClass}
                    type="radio"
                    name={`question_${globalQuestionIndex}`}
                    id={`q${globalQuestionIndex}_opt${optionIndex}`}
                    value={optionIndex}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(globalQuestionIndex, optionIndex)}
                    disabled={testSubmitted}
                  />
                  <label className={labelClass} htmlFor={`q${globalQuestionIndex}_opt${optionIndex}`}>
                    <span className="fw-bold me-2">{optionLetter}.</span> {option}
                    {showResults && isCorrect && (
                      <i className="ri-check-double-line ms-auto text-success ri-lg"></i>
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <i className="ri-close-line ms-auto text-danger ri-lg"></i>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
          {showResults && question.explanation && (
            <div className="mt-3 p-3 bg-light-subtle border-start border-info border-4 rounded">
              <p className="mb-0">
                <strong className="text-info">Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };


  return (
    <SubscriptionGate serviceName="Intelligent MCQ Generator">
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col xxl={8} xl={10} lg={10} md={12} sm={12}>
            {!generatedMcqs && (
              <Card className="shadow-sm">
                <Card.Header className="bg-white border-0">
                  <h3 className="text-primary mb-0">Generate MCQs from PDF</h3>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group controlId="pdfUpload" className="mb-4">
                      <Form.Label className="fw-semibold">Upload PDF Document</Form.Label>
                      <Form.Control
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isLoadingMcqs || isUploading}
                      />
                      {pdfFile && (
                        <small className="text-muted mt-2 d-block">
                          Selected: {pdfFile.name}
                        </small>
                      )}
                    </Form.Group>

                    <Form.Group controlId="numQuestions" className="mb-4">
                      <Form.Label className="fw-semibold">
                        Number of Questions (1-50)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={numQuestions}
                        onChange={handleNumQuestionsChange}
                        min="1"
                        max="50"
                        placeholder="Enter number of questions"
                        disabled={isLoadingMcqs || isUploading}
                      />
                    </Form.Group>

                    <Form.Group controlId="mcqGenerationType" className="mb-4">
                      <Form.Label className="fw-semibold">MCQ Generation Mode</Form.Label>
                      <Tabs
                        activeKey={mcqGenerationType}
                        onSelect={(k) => setMcqGenerationType(k)}
                        id="mcq-generation-type-tabs"
                        className="nav-tabs-bordered"
                        disabled={isLoadingMcqs || isUploading}
                      >
                        <Tab eventKey="full_book_wise" title="Full Book MCQs">
                          <p className="text-muted small mt-2 px-1 py-2 bg-light-subtle rounded">Generates MCQs based on the entire content of the uploaded document.</p>
                        </Tab>
                        <Tab eventKey="chapter_wise" title="Chapter-wise MCQs">
                           <p className="text-muted small mt-2 px-1 py-2 bg-light-subtle rounded">Attempts to identify chapters and generate MCQs for each chapter individually.</p>
                        </Tab>
                      </Tabs>
                    </Form.Group>


                    {mcqError && <Alert variant="danger">{mcqError}</Alert>}
                    {s3UploadError && <Alert variant="warning">S3 Upload Warning: {s3UploadError}</Alert>} {/* Show S3 error separately */}


                    <Button
                      variant="primary"
                      onClick={handleGenerateMcqs}
                      disabled={isLoadingMcqs || isUploading || !pdfFile || !numQuestions || numQuestions < 1 || numQuestions > 50}
                      className="w-100 mt-3"
                    >
                      {(isLoadingMcqs || isUploading) ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          {isUploading && isLoadingMcqs ? "Uploading & Generating..." :
                           isUploading ? "Uploading to S3..." :
                           isLoadingMcqs ? "Generating MCQs..." : "Processing..."}
                        </>
                      ) : (
                        "Generate MCQs"
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
            {generatedMcqs && renderMCQTest()}
          </Col>
        </Row>
      </Container>
    </SubscriptionGate>
  );
};

export default McqPractice;