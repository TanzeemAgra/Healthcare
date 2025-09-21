import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, RotateCcw, Plus, History, Bot, Wifi, WifiOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SubscriptionGate from '../../components/SubscriptionGate';

const DrMaxBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const WS_HOST = "localhost";
  const WS_PORT = 5161
  const wsUrlBase = `ws://${WS_HOST}:${WS_PORT}`;
  const userId = "user123";
  const roomId = "room123";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!messages.some(msg => msg.isStreaming)) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: message.id || Date.now() + Math.random(),
        ...message,
        timestamp: message.timestamp || new Date(),
      },
    ]);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket connection attempt skipped, already open or connecting.");
      return;
    }

    setConnectionStatus("connecting");
    setError(null);

    try {
      const wsUrlWithParams = `${wsUrlBase}/?userId=${encodeURIComponent(
        userId
      )}&roomId=${encodeURIComponent(roomId)}`;
      wsRef.current = new WebSocket(wsUrlWithParams);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus("connected");
        setError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "message":
              addMessage({
                text: data.text,
                sender: data.sender,
              });
              setIsTyping(false);
              break;

            case "llm_response_start":
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  id: data.message_id,
                  text: data.initial_text || "",
                  sender: data.sender,
                  timestamp: new Date(),
                  isStreaming: true,
                },
              ]);
              setIsTyping(true);
              break;

            case "llm_response_chunk":
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === data.message_id && msg.isStreaming
                    ? { ...msg, text: msg.text + data.delta }
                    : msg
                )
              );
              scrollToBottom();
              break;

            case "llm_response_end":
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === data.message_id
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              setIsTyping(false);
              break;

            case "history":
              if (data.messages && Array.isArray(data.messages)) {
                const historyMessages = data.messages.map((msg, index) => ({
                  id: msg.id || `hist-${Date.now()}-${index}`,
                  text: msg.content || msg.text,
                  sender: msg.sender,
                  timestamp: new Date(msg.timestamp),
                }));
                setMessages(historyMessages);
              }
              break;

            case "status":
              addMessage({ text: `Status: ${data.text}`, sender: "bot" });
              break;

            case "error":
              setError(data.message || "An unspecified error occurred from server.");
              setIsTyping(false);
              break;

            default:
              console.warn("Unknown message type received from server:", data.type, data);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message or processing data:", err, "Raw data:", event.data);
          setError("Error processing server response. Expected JSON.");
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setConnectionStatus("disconnected");
        setIsTyping(false);
      };

      wsRef.current.onerror = (errorEvent) => {
        console.error("WebSocket error:", errorEvent);
        setConnectionStatus("error");
        setError("Connection error. Please check your network or try reconnecting.");
        setIsTyping(false);
      };
    } catch (err) {
      console.error("Error creating WebSocket:", err);
      setConnectionStatus("error");
      setError("Failed to establish WebSocket connection.");
    }
  }, [wsUrlBase, userId, roomId, addMessage, scrollToBottom]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "User initiated disconnect");
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
    reconnectAttempts.current = 0;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "" || connectionStatus !== "connected" || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("Cannot send message. Not connected.");
      if (connectionStatus !== "connected" && connectionStatus !== "connecting") {
        connectWebSocket();
      }
      return;
    }

    const messageText = input.trim();

    addMessage({
      text: messageText,
      sender: "user",
    });

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        message: messageText,
        roomId: roomId,
        userId: userId,
      })
    );
    setIsTyping(true);
    setInput("");
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "new_chat",
          roomId: roomId,
        })
      );
    }

    setMessages([]);
    setInput("");
    setIsTyping(false);
    setError(null);
  };

  const handleReconnect = () => {
    disconnectWebSocket();

    setTimeout(() => {
      setMessages([]);
      connectWebSocket();
    }, 250);
  };

  const formatTime = (timestamp) => {
    if (!(timestamp instanceof Date) || isNaN(timestamp)) {
        return "Invalid date";
    }
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="text-success" size={16} />;
      case "connecting":
        return <Wifi className="text-warning animate-pulse" size={16} />;
      default:
        return <WifiOff className="text-danger" size={16} />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Connection Error";
      default:
        return "Disconnected";
    }
  };

  return (
    <SubscriptionGate serviceName="Dr. Max AI Chatbot">
      <div className="container-fluid p-0" style={{ height: "70vh" }}>
        <div
          className="chat-container rounded shadow-lg overflow-hidden d-flex flex-column h-100"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            className="chat-header text-white p-3 shadow"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button className="btn btn-link text-white me-3 p-1" title="Chat History (Not Implemented)">
                  <History size={20} />
                </button>
                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                  }}
                >
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Dr. Max AI</h5>
                  <small className="text-white-75 d-flex align-items-center">
                    {getConnectionIcon()}
                    <span className="ms-1">{getConnectionText()}</span>
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <button
                  onClick={handleNewChat}
                  className="btn btn-link text-white me-2 p-1"
                  title="New Chat"
                  disabled={connectionStatus !== "connected"}
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={handleReconnect}
                  className="btn btn-link text-white p-1"
                  title="Reconnect"
                  disabled={connectionStatus === "connecting"}
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show m-3 mb-0" role="alert" style={{zIndex: 1050}}>
              <strong>Error:</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}

          <div
            className="messages-container flex-grow-1 overflow-auto p-3"
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-3 ${
                  msg.sender === "user" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div className="d-flex flex-column" style={{ maxWidth: "80%" }}>
                  <div
                    className={`p-3 rounded shadow-sm ${
                      msg.sender === "user" ? "text-white" : "text-dark"
                    }`}
                    style={{
                      backgroundColor: msg.sender === "user" ? "#667eea" : "#ffffff",
                      border: msg.sender === "bot" ? "1px solid #e0e0e0" : "none",
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {msg.text || ""}
                    </ReactMarkdown>
                  </div>
                  <small
                    className={`text-muted mt-1 ${
                      msg.sender === "user" ? "text-end" : "text-start"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </small>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div className="d-flex flex-column" style={{ maxWidth: "80%" }}>
                  <div
                    className="text-dark p-3 rounded shadow-sm"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="d-flex me-2">
                        <div
                          className="spinner-grow spinner-grow-sm text-primary me-1"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                        <div
                          className="spinner-grow spinner-grow-sm text-primary me-1"
                          style={{
                            width: "8px",
                            height: "8px",
                            animationDelay: "0.2s",
                          }}
                        ></div>
                        <div
                          className="spinner-grow spinner-grow-sm text-primary"
                          style={{
                            width: "8px",
                            height: "8px",
                            animationDelay: "0.4s",
                          }}
                        ></div>
                      </div>
                      <small className="text-muted">Dr. Max is thinking...</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-top p-3 shadow">
            <div className="d-flex align-items-center mb-2">
              {/* <button
                type="button"
                className="btn btn-outline-secondary me-3"
                style={{ width: "40px", height: "40px" }}
                title="Attach file (Not Implemented)"
              >
                <Paperclip size={20} />
              </button> */}

              <form onSubmit={handleSendMessage} className="d-flex flex-grow-1">
                <div className="flex-grow-1 me-3">
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    style={{
                      borderRadius: "20px",
                      border: "1px solid #e0e0e0",
                      padding: "10px 15px",
                    }}
                    placeholder="Ask Dr. Max anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={isTyping || connectionStatus !== "connected"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={input.trim() === "" || isTyping || connectionStatus !== "connected"}
                  className="btn text-white"
                  style={{
                    backgroundColor: "#667eea",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>

            <p className="text-muted text-center mb-0 small">
              Dr. Max provides general information only. Always consult healthcare professionals for
              medical advice.
            </p>
          </div>
        </div>
      </div>
    </SubscriptionGate>
  );
};

export default DrMaxBot;
