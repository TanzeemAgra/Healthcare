import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form, Button, Spinner, Alert, Image as BootstrapImage } from 'react-bootstrap';
import apiClient from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Send, Bot, User } from 'lucide-react';

const ReportChatInterface = ({
    reportId,
    initialReportText,
    initialAssociatedImageFile,
    initialAssociatedImagePreviewUrl,
    chatImageToDisplay,
    chatReportToDisplay,
    isChatDisabled,
    clearChatTrigger,
    newThreadTrigger
}) => {
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatError, setChatError] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [activeImageFile, setActiveImageFile] = useState(null);
    const [activeImagePreviewUrl, setActiveImagePreviewUrl] = useState('');
    const [activeReportText, setActiveReportText] = useState('');

    const initialContextProcessed = useRef(false);
    const lastProcessedChatImageTimestamp = useRef(null);
    const lastProcessedChatReportTimestamp = useRef(null);
    const lastProcessedNewThreadTriggerRef = useRef(0);

    useEffect(() => {
        setActiveImageFile(initialAssociatedImageFile || null);
        setActiveImagePreviewUrl(initialAssociatedImagePreviewUrl || '');
        setActiveReportText(initialReportText || '');
        if (!initialAssociatedImageFile && !initialAssociatedImagePreviewUrl && !initialReportText) {
            initialContextProcessed.current = false;
        }
    }, [initialAssociatedImageFile, initialAssociatedImagePreviewUrl, initialReportText]);

    useEffect(() => {
        if (!isChatDisabled && messages.length === 0 && !initialContextProcessed.current) {
            let welcomeText = "Hello! I'm ready to assist.";
            
            const hasImage = activeImagePreviewUrl || (chatImageToDisplay && chatImageToDisplay.previewUrl);
            const hasReport = activeReportText || (chatReportToDisplay && chatReportToDisplay.text);

            if (hasImage && hasReport) {
                welcomeText = "Report and image context loaded. How can I help?";
            } else if (hasImage) {
                welcomeText = "Image context loaded. What would you like to discuss about it?";
            } else if (hasReport) {
                welcomeText = "Report context loaded. Feel free to ask questions about the report.";
            } else {
                 welcomeText = "Hello! Upload an image or report to start the discussion.";
            }
            
            setMessages([{
                id: 'initial-context-msg-' + Date.now(),
                text: welcomeText,
                sender: 'ai',
                timestamp: new Date()
            }]);
            initialContextProcessed.current = true;
        }
    }, [isChatDisabled, activeImagePreviewUrl, activeReportText, chatImageToDisplay, chatReportToDisplay, messages.length]);


    useEffect(() => {
        if (chatImageToDisplay && chatImageToDisplay.timestamp && chatImageToDisplay.timestamp !== lastProcessedChatImageTimestamp.current) {
            setActiveImageFile(chatImageToDisplay.file);
            setActiveImagePreviewUrl(chatImageToDisplay.previewUrl);
            const imageMessageText = `Uploaded image"`;
            setMessages(prev => [...prev, {
                id: `chat-image-${chatImageToDisplay.timestamp}`,
                text: imageMessageText,
                sender: 'user',
                timestamp: new Date(),
                isImageUpload: true,
                imageUrl: chatImageToDisplay.previewUrl
            }]);
            lastProcessedChatImageTimestamp.current = chatImageToDisplay.timestamp;
        }
    }, [chatImageToDisplay]);


    useEffect(() => {
        if (chatReportToDisplay && chatReportToDisplay.timestamp && chatReportToDisplay.timestamp !== lastProcessedChatReportTimestamp.current) {
            const reportName = chatReportToDisplay.file ? chatReportToDisplay.file.name : 'the analyzed report';
            const newActiveReportText = chatReportToDisplay.text || `Analyzed report "${reportName}" is now part of our chat.`;
            setActiveReportText(newActiveReportText);
            const reportMessageText = `Uploaded report for discussion: "${reportName}".`;
            setMessages(prev => [...prev, {
                id: `chat-report-${chatReportToDisplay.timestamp}`,
                text: reportMessageText,
                sender: 'user',
                timestamp: new Date()
            }]);
            lastProcessedChatReportTimestamp.current = chatReportToDisplay.timestamp;
        }
    }, [chatReportToDisplay]);

    useEffect(() => {
        if (clearChatTrigger > 0 && clearChatTrigger !== lastProcessedNewThreadTriggerRef.current) {
            setMessages([{
                id: 'chat-cleared-' + Date.now(),
                text: "Chat messages cleared. The current context (image/report) is still active.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        }
    }, [clearChatTrigger]);

    useEffect(() => {
        if (newThreadTrigger > 0 && newThreadTrigger !== lastProcessedNewThreadTriggerRef.current) {
            setMessages([]);
            setActiveImageFile(null);
            setActiveImagePreviewUrl('');
            setActiveReportText('');
            initialContextProcessed.current = false;
            setMessages([{
                id: 'new-thread-' + Date.now(),
                text: "New thread started. Please provide new context by uploading an image or report.",
                sender: 'ai',
                timestamp: new Date()
            }]);
            lastProcessedNewThreadTriggerRef.current = newThreadTrigger;
        }
    }, [newThreadTrigger]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!currentInput.trim() || isChatDisabled) return;

        const userMessageText = currentInput;
        const newUserMessage = {
            id: Date.now(),
            text: userMessageText,
            sender: 'user',
            timestamp: new Date()
        };
        
        const currentMessagesForHistory = [...messages, newUserMessage];

        setMessages(prev => [...prev, newUserMessage]);
        setCurrentInput('');
        setIsLoading(true);
        setChatError('');

        const formData = new FormData();
        formData.append('query', userMessageText);

        if (activeImageFile) {
            formData.append('image', activeImageFile);
        }
        if (activeReportText) {
            formData.append('report_context_snippet', activeReportText.substring(0, 4000));
        }
        
        const historyForApi = currentMessagesForHistory
            .slice(-7)
            .filter(msg => !msg.isImageUpload && !msg.text.startsWith("Uploaded report for discussion"))
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
        
        if (historyForApi.length > 0) {
            formData.append('conversation_history_json', JSON.stringify(historyForApi));
        }
        
        try {
            const response = await apiClient.post('/radiology/multimodal-query/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: response.data.ai_response,
                sender: 'ai',
                timestamp: new Date()
            }]);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to get AI response.';
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `Error: ${errorMsg}`,
                sender: 'ai',
                isError: true,
                timestamp: new Date()
            }]);
            setChatError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!(timestamp instanceof Date) || isNaN(timestamp)) {
            return "";
        }
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getPlaceholderText = () => {
        if (isChatDisabled) return "Chat disabled. Upload context and pass to chatbot.";
        if (activeImageFile && activeReportText) return "Ask about the loaded report and image...";
        if (activeImageFile) return "Ask about the loaded image...";
        if (activeReportText) return "Ask about the loaded report...";
        return "Type your message...";
    };

    return (
        <div
            className="report-chat-interface d-flex flex-column border rounded"
            style={{
                height: '100%',
                maxHeight: 'calc(100vh - 230px)',
                backgroundColor: '#fff'
            }}
        >
            <div
                className="chat-messages flex-grow-1 p-3"
                style={{
                    backgroundColor: '#f8f9fa',
                    overflowY: 'auto',
                    minHeight: '0'
                }}
            >
                {messages.length === 0 && !isLoading && (
                    isChatDisabled ? (
                        <div className="text-center text-muted py-5">
                            <Bot size={48} className="mb-3 text-muted" />
                            <p>Chat is disabled. Upload an image or report and pass to chatbot to enable.</p>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-5">
                             <Bot size={48} className="mb-3 text-muted" />
                             <p>Context loaded. Ask me anything about it!</p>
                        </div>)
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`d-flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} align-items-start gap-2`} style={{ maxWidth: '85%' }}>
                            <div className={`flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle ${msg.sender === 'user'
                                    ? 'bg-primary'
                                    : msg.isError
                                        ? 'bg-danger'
                                        : (msg.text.toLowerCase().startsWith("hello!") ||
                                            msg.text.toLowerCase().startsWith("chat cleared") ||
                                            msg.text.toLowerCase().startsWith("new thread started") ||
                                            msg.text.toLowerCase().includes("context loaded"))
                                            ? 'bg-info'
                                            : 'bg-secondary'
                                }`} style={{ width: '32px', height: '32px' }}>
                                {msg.sender === 'user' ?
                                    <User size={16} className="text-white" /> :
                                    <Bot size={16} className="text-white" />
                                }
                            </div>
                            <div className="flex-grow-1">
                                <div
                                    className={`p-3 rounded-3 shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-white'
                                            : msg.isError
                                                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                                : (msg.text.toLowerCase().startsWith("hello!") ||
                                                    msg.text.toLowerCase().startsWith("chat cleared") ||
                                                    msg.text.toLowerCase().startsWith("new thread started") ||
                                                    msg.text.toLowerCase().includes("context loaded"))
                                                    ? 'bg-light border'
                                                    : 'bg-white border'
                                        }`}
                                    style={{
                                        borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            img: ({ node, ...props }) => <BootstrapImage fluid style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '8px', cursor: 'pointer' }} {...props} alt={props.alt || "Content image"} onClick={() => window.open(props.src, '_blank')} />
                                        }}
                                    >
                                        {msg.text || ""}
                                    </ReactMarkdown>

                                    {msg.isImageUpload && msg.imageUrl && (
                                        <BootstrapImage
                                            src={msg.imageUrl}
                                            alt={msg.text || "Uploaded XRay"}
                                            thumbnail
                                            style={{ maxWidth: '250px', maxHeight: '250px', marginTop: '10px', cursor: 'pointer', display: 'block' }}
                                            onClick={() => window.open(msg.imageUrl, '_blank')}
                                        />
                                    )}

                                    <div className={`small mt-1 ${msg.sender === 'user' ? 'text-white-50' : 'text-muted'}`}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="d-flex justify-content-start mb-3">
                        <div className="d-flex align-items-start gap-2" style={{ maxWidth: '85%' }}>
                            <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-secondary" style={{ width: '32px', height: '32px' }}>
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="bg-white border rounded-3 p-3 shadow-sm" style={{ borderRadius: '20px 20px 20px 5px' }}>
                                <div className="d-flex align-items-center gap-1">
                                    <Spinner size="sm" />
                                    <span className="text-muted small">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {chatError && !messages.find(m => m.isError && m.text.includes(chatError)) && (
                <div className="px-3 flex-shrink-0">
                    <Alert variant="danger" onClose={() => setChatError('')} dismissible className="mb-0 py-2 small">
                        {chatError}
                    </Alert>
                </div>
            )}

            <div className="chat-input border-top p-3 bg-white flex-shrink-0">
                <Form onSubmit={handleSendMessage}>
                    <div className="d-flex gap-2 align-items-end">
                        <div className="flex-grow-1">
                            <Form.Control
                                as="textarea"
                                rows={1}
                                placeholder={getPlaceholderText()}
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                disabled={isLoading || isChatDisabled}
                                style={{
                                    resize: 'none',
                                    minHeight: '40px',
                                    maxHeight: '120px',
                                    borderRadius: '20px',
                                    paddingLeft: '16px',
                                    paddingRight: '16px'
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </div>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading || !currentInput.trim() || isChatDisabled}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', margin: "0px", padding: "0px" }}
                        >
                            <i className="ri-send-plane-2-line"></i>
                        </Button>
                    </div>
                    <div className="small text-muted mt-1 px-2">
                        Shift+Enter for new line.
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ReportChatInterface;