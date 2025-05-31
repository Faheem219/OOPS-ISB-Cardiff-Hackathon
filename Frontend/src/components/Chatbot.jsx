import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useChatbot } from "../hooks/useAPI";
import { Bot, Send, Loader2, ArrowLeft } from "lucide-react";

const Chatbot = () => {
  const { user } = useAuth();
  const { lowBandwidth } = useTheme();
  const { sendMessage, getHistory } = useChatbot();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transform, setTransform] = useState("");
  const [expandedSize, setExpandedSize] = useState({ width: 700, height: 700 });

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { chat_history } = await getHistory(user.id);
        setMessages(chat_history || []);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || lowBandwidth || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", message: userMessage, timestamp: new Date() },
    ]);

    setLoading(true);
    try {
      const response = await sendMessage(user.id, userMessage);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: response.result, timestamp: new Date() },
      ]);
      // Increase size after receiving response
      setExpandedSize({ width: 700, height: 700 });
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/student");
  };

  // Handle area hover for 3D effect
  const handleAreaHover = (index) => {
    if (isExpanded) return; // Disable 3D effect when expanded

    const transforms = [
      "rotateX(15deg) rotateY(-15deg)",
      "rotateX(15deg) rotateY(-7deg)",
      "rotateX(15deg) rotateY(0)",
      "rotateX(15deg) rotateY(7deg)",
      "rotateX(15deg) rotateY(15deg)",
      "rotateX(0) rotateY(-15deg)",
      "rotateX(0) rotateY(-7deg)",
      "rotateX(0) rotateY(0)",
      "rotateX(0) rotateY(7deg)",
      "rotateX(0) rotateY(15deg)",
      "rotateX(-15deg) rotateY(-15deg)",
      "rotateX(-15deg) rotateY(-7deg)",
      "rotateX(-15deg) rotateY(0)",
      "rotateX(-15deg) rotateY(7deg)",
      "rotateX(-15deg) rotateY(15deg)",
    ];

    if (index >= 0 && index < transforms.length) {
      setTransform(transforms[index]);
    }
  };

  const handleAreaLeave = () => {
    setTransform("");
  };

  // Calculate expanded dimensions
  const expandedWidth = expandedSize.width;
  const expandedHeight = expandedSize.height;

  // Format bot messages with markdown-style formatting
  const formatBotMessage = (text) => {
    if (!text) return null;

    // Split by lines and process each line
    return text.split("\n").map((line, idx) => {
      if (!line.trim()) return <br key={idx} />;

      // Check for bullet points
      if (
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        line.startsWith("• ")
      ) {
        return (
          <div key={idx} className="flex items-start mb-1">
            <span className="mr-2 mt-1">•</span>
            <span>{formatInlineText(line.substring(2))}</span>
          </div>
        );
      }

      // Check for numbered lists
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        return (
          <div key={idx} className="flex items-start mb-1">
            <span className="mr-2 mt-1">{numberedMatch[1]}.</span>
            <span>{formatInlineText(numberedMatch[2])}</span>
          </div>
        );
      }

      // Regular paragraph
      return (
        <div key={idx} className="mb-1">
          {formatInlineText(line)}
        </div>
      );
    });
  };

  // Format inline text with bold and italic
  const formatInlineText = (text) => {
    const segments = [];
    let currentIndex = 0;
    let boldRegex = /\*\*(.*?)\*\*/g;
    let italicRegex = /\*(.*?)\*/g;
    let match;

    // Process bold text
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        segments.push(text.substring(currentIndex, match.index));
      }

      // Add bold text
      segments.push(<strong key={`b-${match.index}`}>{match[1]}</strong>);
      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      segments.push(text.substring(currentIndex));
    }

    // Process italic in segments
    return segments.map((segment, idx) => {
      if (typeof segment === "string") {
        const italicSegments = [];
        let italicIndex = 0;
        let italicMatch;

        while ((italicMatch = italicRegex.exec(segment)) !== null) {
          // Add text before the match
          if (italicMatch.index > italicIndex) {
            italicSegments.push(
              segment.substring(italicIndex, italicMatch.index)
            );
          }

          // Add italic text
          italicSegments.push(
            <em key={`i-${idx}-${italicMatch.index}`}>{italicMatch[1]}</em>
          );
          italicIndex = italicMatch.index + italicMatch[0].length;
        }

        // Add remaining text
        if (italicIndex < segment.length) {
          italicSegments.push(segment.substring(italicIndex));
        }

        return <span key={`s-${idx}`}>{italicSegments}</span>;
      }
      return segment;
    });
  };

  return (
    <div className="min-h-screen bg-grey p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Areas */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="area transition-all duration-300 hover:bg-white/5"
            style={{ perspective: "1000px" }}
            onMouseEnter={() => handleAreaHover(i)}
            onMouseLeave={handleAreaLeave}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <style jsx>{`
          .container-ai-input {
            --perspective: 1000px;
            --translateY: 45px;
            position: relative;
            transform-style: preserve-3d;
          }

          .card {
            width: ${isExpanded ? expandedWidth + "px" : "12rem"};
            height: ${isExpanded ? expandedHeight + "px" : "12rem"};
            transform-style: preserve-3d;
            will-change: transform;
            transition: all 0.6s ease;
            border-radius: ${isExpanded ? "20px" : "3rem"};
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translateZ(50px) ${transform};
          }

          .card:hover {
            box-shadow: 0 10px 40px rgba(0, 0, 60, 0.25),
              inset 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .background-blur-balls {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            width: 100%;
            height: 100%;
            z-index: -10;
            border-radius: ${isExpanded ? "20px" : "3rem"};
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.8);
            overflow: hidden;
          }

          .balls {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            animation: rotate-background-balls 10s linear infinite;
          }

          .ball {
            width: 6rem;
            height: 6rem;
            position: absolute;
            border-radius: 50%;
            filter: blur(30px);
          }

          .ball.violet {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: #9147ff;
          }

          .ball.green {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: #34d399;
          }

          .ball.rosa {
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background-color: #ec4899;
          }

          .ball.cyan {
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background-color: #05e0f5;
          }

          .content-card {
            width: 100%;
            height: 100%;
            display: flex;
            border-radius: ${isExpanded ? "20px" : "3rem"};
            transition: all 0.3s ease;
            overflow: hidden;
          }

          .background-blur-card {
            width: 100%;
            height: 100%;
            backdrop-filter: blur(50px);
          }

          .eyes {
            position: absolute;
            left: 50%;
            bottom: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            gap: 2rem;
            transition: all 0.3s ease;
            opacity: ${isExpanded ? 0 : 1};
          }

          .eye {
            width: 26px;
            height: 52px;
            background-color: #fff;
            border-radius: 16px;
            animation: animate-eyes 10s infinite linear;
            transition: all 0.3s ease;
          }

          .eyes.happy {
            display: ${isExpanded ? "none" : "flex"};
            color: #fff;
            gap: 0;
          }

          .eyes.happy svg {
            width: 60px;
          }

          .container-ai-chat {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 6px;
            opacity: ${isExpanded ? 1 : 0};
            pointer-events: ${isExpanded ? "auto" : "none"};
            visibility: ${isExpanded ? "visible" : "hidden"};
            z-index: ${isExpanded ? 99999 : 1};
          }

          .chat {
            display: flex;
            flex-direction: column;
            border-radius: 15px;
            width: 100%;
            height: 100%;
            padding: 4px;
            overflow: hidden;
            background-color: #ffffff;
          }

          .chat-header {
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
          }

          .chat-input {
            padding: 1rem;
            border-top: 1px solid #f0f0f0;
          }

          .btn-submit {
            display: flex;
            padding: 2px;
            background-image: linear-gradient(
              to top,
              #ff4141,
              #9147ff,
              #3b82f6
            );
            border-radius: 10px;
            box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.5);
            cursor: pointer;
            border: none;
            outline: none;
            opacity: 0.7;
            transition: all 0.15s ease;
            min-width: 20px;
            min-height: 20px;
          }

          .btn-submit i {
            width: 30px;
            height: 30px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(3px);
            color: #cfcfcf;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .btn-submit:hover {
            opacity: 1;
          }

          .btn-submit:hover svg {
            color: #f3f6fd;
          }

          .message-container {
            margin-bottom: 1.5rem;
          }

          .user-message {
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            color: white;
            border-radius: 18px 18px 4px 18px;
            padding: 1rem;
            max-width: 80%;
            margin-left: auto;
          }

          .bot-message {
            background: #f3f4f6;
            color: #1f2937;
            border-radius: 18px 18px 18px 4px;
            padding: 1rem;
            max-width: 80%;
          }

          .initial-hint {
            position: absolute;
            bottom: -2rem;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            width: 100%;
            opacity: ${isExpanded ? 0 : 1};
            transition: opacity 0.3s ease;
          }

          @keyframes rotate-background-balls {
            from {
              transform: translateX(-50%) translateY(-50%) rotate(360deg);
            }
            to {
              transform: translateX(-50%) translateY(-50%) rotate(0);
            }
          }

          @keyframes animate-eyes {
            46% {
              height: 52px;
            }
            48% {
              height: 20px;
            }
            50% {
              height: 52px;
            }
            96% {
              height: 52px;
            }
            98% {
              height: 20px;
            }
            100% {
              height: 52px;
            }
          }
        `}</style>

        <div className="container-ai-input">
          <div
            className="card"
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
            {/* Animated Background */}
            <div className="background-blur-balls">
              <div className="balls">
                <span className="ball rosa" />
                <span className="ball violet" />
                <span className="ball green" />
                <span className="ball cyan" />
              </div>
            </div>

            <div className="content-card">
              <div className="background-blur-card">
                {/* Eyes - shown when collapsed */}
                <div className="eyes">
                  <span className="eye" />
                  <span className="eye" />
                </div>
              </div>
            </div>

            {/* Chat Interface - shown when expanded */}
            <div className="container-ai-chat">
              <div className="chat">
                {/* Header */}
                <div className="chat-header">
                  <div className="flex items-center gap-3">
                    <Bot className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      AI Security Assistant
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBackToDashboard();
                      }}
                      className="flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Dashboard
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {messages.map((msg, i) => (
                    <div key={i} className="message-container">
                      <div
                        className={
                          msg.sender === "user" ? "user-message" : "bot-message"
                        }
                      >
                        {msg.sender === "bot" ? (
                          <div className="message-content">
                            {formatBotMessage(msg.message)}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-container">
                      <div className="bot-message flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        <span className="text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Section */}
                <div className="chat-input ">
                  <div className="flex items-center gap-4">
                    {/* Input and Send */}
                    <div className="flex-1 flex gap-3">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={lowBandwidth || loading}
                        placeholder={
                          lowBandwidth
                            ? "Low bandwidth mode active"
                            : "Ask me Anything...✦˚"
                        }
                        className="flex-1 p-4 border rounded-2xl resize-none bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        rows="1"
                        style={{ maxHeight: "150px" }}
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={lowBandwidth || loading || !input.trim()}
                        className="btn-submit"
                        style={{ maxHeight: "35px", maxWidth: "50px" }}
                      >
                        <i>
                          <Send className="w-5 h-5" />
                        </i>
                      </button>
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          // 1) Ask for confirmation first
                          if (
                            !window.confirm(
                              "⚠️ Are you sure? Your entire chat history will be permanently deleted."
                            )
                          ) {
                            return;
                          }

                          // 2) Proceed with clearing history
                          setLoading(true);
                          try {
                            const { result } = await sendMessage(
                              user.id,
                              "CLEAR_HISTORY"
                            );
                            // Append both the user’s "CLEAR_HISTORY" and the bot’s confirmation
                            setMessages((prev) => [
                              ...prev,
                              {
                                sender: "user",
                                message: "CLEAR_HISTORY",
                                timestamp: new Date(),
                              },
                              {
                                sender: "bot",
                                message: result,
                                timestamp: new Date(),
                              },
                            ]);
                          } catch (err) {
                            console.error("Error clearing history:", err);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="mt-2 flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                          />
                        </svg>
                        Clear Chat History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
