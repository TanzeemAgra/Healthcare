import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { RiSendPlaneLine, RiRobotLine, RiUserLine, RiDeleteBinLine } from '@remixicon/react';

const NewSecureNeatChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Hello! I\'m Dr. Max AI, your medical learning assistant. I\'m here to help you with medical questions, case studies, and exam preparation. How can I assist you today?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    console.log('🤖 Dr. Max AI Chatbot - Initialized successfully without restrictions');
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = (userMessage) => {
    const responses = [
      "That's an excellent question about medical practice. Let me break this down for you...",
      "Based on current medical guidelines, here's what you should know...",
      "This is a common scenario in clinical practice. The key points to consider are...",
      "Great question! This relates to important diagnostic criteria. Here's the explanation...",
      "This is relevant for your medical studies. Let me provide a comprehensive answer...",
      "From a clinical perspective, this condition typically presents with...",
      "The pathophysiology behind this involves several key mechanisms...",
      "According to evidence-based medicine, the recommended approach is...",
      "This is an important topic for medical exams. The differential diagnosis includes...",
      "Treatment guidelines suggest the following approach..."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some specific content based on keywords
    if (userMessage.toLowerCase().includes('heart') || userMessage.toLowerCase().includes('cardiac')) {
      return `${randomResponse}\n\nFor cardiac conditions, remember to consider:\n• ECG changes and arrhythmias\n• Chest pain characteristics\n• Risk factors like hypertension, diabetes\n• Cardiac enzymes and biomarkers\n\nWould you like me to elaborate on any specific aspect?`;
    } else if (userMessage.toLowerCase().includes('diagnosis') || userMessage.toLowerCase().includes('differential')) {
      return `${randomResponse}\n\nWhen approaching differential diagnosis:\n• Start with chief complaint\n• Consider history and physical findings\n• Order appropriate investigations\n• Rule out life-threatening conditions first\n\nWhat specific case are you working on?`;
    } else {
      return `${randomResponse}\n\nThis connects to several important medical concepts. Would you like me to:\n• Provide more detailed explanations\n• Share relevant case studies\n• Discuss related exam topics\n• Offer practice questions`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: simulateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: 'Chat cleared! How can I help you with your medical studies today?',
      timestamp: new Date()
    }]);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <RiRobotLine className="me-2" />
            Dr. Max AI Chatbot
          </h1>
          <p className="text-muted mb-0">Your intelligent medical learning assistant</p>
        </div>
        <div>
          <Badge bg="success" pill className="me-2">
            ✅ Full Access
          </Badge>
          <Button variant="outline-danger" size="sm" onClick={clearChat}>
            <RiDeleteBinLine className="me-1" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      <Alert variant="success" className="mb-4">
        <div className="d-flex align-items-center">
          <div className="me-2">🎉</div>
          <div>
            <strong>Welcome to Dr. Max AI!</strong> You have unrestricted access to the AI chatbot. 
            Ask me anything about medical topics, case studies, or exam preparation.
          </div>
        </div>
      </Alert>

      {/* Chat Container */}
      <Card className="border-0 shadow-sm" style={{ height: '600px' }}>
        {/* Chat Messages */}
        <Card.Body className="d-flex flex-column p-0">
          <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '500px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`d-flex mb-3 ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className={`d-flex align-items-start max-width-75 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ms-2' : 'me-2'}`}>
                    <div className={`rounded-circle p-2 ${message.type === 'user' ? 'bg-primary' : 'bg-success'}`}>
                      {message.type === 'user' ? (
                        <RiUserLine className="text-white" size={16} />
                      ) : (
                        <RiRobotLine className="text-white" size={16} />
                      )}
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-grow-1 ${message.type === 'user' ? 'text-end' : 'text-start'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-light text-dark'
                      }`}
                      style={{ 
                        borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {message.content}
                    </div>
                    <small className="text-muted mt-1 d-block">
                      {formatTimestamp(message.timestamp)}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="d-flex align-items-start">
                  <div className="me-2">
                    <div className="rounded-circle p-2 bg-success">
                      <RiRobotLine className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="bg-light p-3 rounded-lg" style={{ borderRadius: '18px 18px 18px 4px' }}>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Dr. Max is thinking...
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-top p-3">
            <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <div className="d-flex gap-2">
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Ask Dr. Max anything about medical topics..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  style={{ resize: 'none', minHeight: '44px' }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!inputMessage.trim() || isLoading}
                  style={{ minWidth: '44px', height: '44px' }}
                >
                  <RiSendPlaneLine size={16} />
                </Button>
              </div>
            </Form>
            
            <div className="mt-2">
              <small className="text-muted">
                💡 Try asking: "Explain myocardial infarction", "What are the signs of pneumonia?", or "Help me with a case study"
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>

      <style>{`
        .max-width-75 {
          max-width: 75%;
        }
        .rounded-lg {
          border-radius: 0.5rem !important;
        }
      `}</style>
    </div>
  );
};

export default NewSecureNeatChatbot;
