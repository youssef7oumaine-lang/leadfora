
import React, { useState, useRef, useEffect } from 'react';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const N8N_WEBHOOK_URL = "https://n8n.srv1214325.hstgr.cloud/webhook/bf6e738c-d7a3-4dab-b740-65891b859949/chat";

const SUGGESTIONS = [
  { label: "💸 Price?", text: "How much does Wolfz AI cost?" },
  { label: "⚙️ How does it work?", text: "How does the AI qualification work?" },
  { label: "📅 Integrations", text: "What CRMs do you integrate with?" }
];

interface ChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenModal: () => void;
}

type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  isError?: boolean;
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, setIsOpen, onOpenModal }) => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! 👋 I'm Sarah. I can answer questions about Wolfz AI or help you book a demo. How can I help?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Engagement State
  const [showHook, setShowHook] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Auto-resize textarea logic
  useEffect(() => {
    if (inputRef.current) {
      // Reset height to auto to correctly calculate scrollHeight for shrinking content
      inputRef.current.style.height = 'auto';
      // Set height to scrollHeight to expand to fit content
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue, isOpen]);

  // Proactive Hook Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isOpen && !hasInteracted) {
      timer = setTimeout(() => {
        setShowHook(true);
      }, 3000);
    } else {
      setShowHook(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen, hasInteracted]);

  // Listener for 'Click-to-Ask' events from Pricing Section
  useEffect(() => {
    const handleTrigger = (e: CustomEvent) => {
      setIsOpen(true);
      setInputValue(e.detail.message);
      setHasInteracted(true);
      // Wait for the open animation/render to complete before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    };

    window.addEventListener('trigger-chat-input' as any, handleTrigger as any);
    return () => {
      window.removeEventListener('trigger-chat-input' as any, handleTrigger as any);
    };
  }, [setIsOpen]);


  const processMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);
    setHasInteracted(true);

    try {
      // 2. Call n8n Webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: text
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      
      // 3. Extract AI Response
      // n8n can return data in different structures depending on the workflow. 
      // We prioritize 'output', then 'text', then check if it's an array.
      let aiResponseText = "I received your message, but the system response was empty.";

      if (data.output) {
        aiResponseText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
      } else if (data.text) {
        aiResponseText = typeof data.text === 'string' ? data.text : JSON.stringify(data.text);
      } else if (Array.isArray(data) && data.length > 0) {
        // Handle case where n8n returns an array of items
        if (data[0].output) aiResponseText = data[0].output;
        else if (data[0].text) aiResponseText = data[0].text;
      } else if (typeof data === 'string') {
        aiResponseText = data;
      }

      // Add AI Response
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);

    } catch (err: any) {
      console.error("Chat API Error:", err);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble reaching our servers right now. Please check your connection or book a demo directly!",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false); 
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    processMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isTyping) {
        processMessage(inputValue);
      }
    }
  };

  const handleSuggestionClick = (text: string) => {
    processMessage(text);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasInteracted(true);
      setShowHook(false);
    }
  };

  return (
    <div 
      dir="ltr" 
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans pointer-events-none text-left"
    >
      
      {/* --- Feature 3: Proactive Hook Message --- */}
      {showHook && !isOpen && (
        <div className="chatbot-hook pointer-events-auto absolute bottom-20 right-0 mr-20 w-64 animate-fade-in-up origin-bottom-right text-left">
          <div className="relative bg-[#0F172A]/90 backdrop-blur-md border border-cyan-500/50 text-white p-4 rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(0,217,255,0.2)]">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowHook(false); setHasInteracted(true); }}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="text-sm font-medium pr-4">
              Have questions about Wolfz AI? <span className="text-cyan-400 font-bold cursor-pointer hover:underline" onClick={toggleChat}>Ask me here!</span>
            </p>
            {/* Triangle Tail */}
            <div className="absolute -right-2 bottom-0 w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-cyan-500/50 border-b-[5px] border-b-transparent transform rotate-12 filter drop-shadow-lg"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[360px] max-w-[calc(100vw-48px)] h-[550px] max-h-[70vh] flex flex-col bg-[#0F172A] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-bottom-right text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-slate-900"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  AI
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Wolfz AI Agent</h3>
                <p className="text-xs text-cyan-400 font-mono">● Online</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50 scroll-smooth text-left">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm text-left ${
                    msg.isError 
                      ? 'bg-red-900/90 border border-red-500 text-white rounded-tl-none font-mono text-xs'
                      : msg.sender === 'user' 
                        ? 'text-white font-medium rounded-tr-none shadow-[0_4px_15px_rgba(0,255,65,0.2)]'
                        : 'bg-[#0B1221] text-slate-200 rounded-tl-none border border-[#00FF41]/30 shadow-[0_0_10px_rgba(0,255,65,0.05)]'
                  }`}
                  style={msg.sender === 'user' && !msg.isError ? {
                    background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)'
                  } : undefined}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-message-in">
                <div className="bg-[#0B1221] border border-[#00FF41]/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 w-16">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-cyan-500/20 text-left">
            
            {/* --- Feature 1: Quick Suggestion Chips (Pinned to Bottom) --- */}
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              {SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(chip.text)}
                  disabled={isTyping}
                  className="text-xs font-medium text-cyan-100 bg-slate-800 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <form 
              onSubmit={handleSendMessage}
              className="flex items-end gap-3"
            >
              <textarea 
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-3 border-2 border-transparent focus:bg-slate-900 focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)] outline-none transition-all duration-300 placeholder-slate-400 text-left resize-none overflow-hidden min-h-[48px] max-h-[120px]"
                disabled={isTyping}
                style={{ height: 'auto' }}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="text-white h-[48px] w-[48px] flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(0,255,65,0.3)] shrink-0"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.51a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-center">
              <button 
                onClick={onOpenModal}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Book a Demo Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {/* --- Feature 2: Pulse Animation --- */}
      <button
        onClick={toggleChat}
        className={`pointer-events-auto group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-105 transition-all duration-300 z-50 ${!isOpen ? 'animate-pulse-ring' : ''}`}
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <>
            <span className="chatbot-badge absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </>
        )}
      </button>

      <style>{`
        @media (max-width: 768px) {
          .chatbot-hook, .chatbot-badge {
            display: none !important;
          }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        
        @keyframes message-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-message-in {
          animation: message-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0, 217, 255, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(0, 217, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 217, 255, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
