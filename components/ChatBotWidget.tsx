
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
// PASTE YOUR NEW API KEY HERE IF NEEDED, OR USE THE ENV VARIABLE
const API_KEY = process.env.API_KEY;

const SYSTEM_INSTRUCTION = `
IDENTITY:
You are Sarah, Wolfz AI's Senior AI Consultant. You are professional, warm, and highly efficient.

GOAL:
Help users understand Wolfz AI (an AI agent for lead qualification) and encourage them to book a demo.

KEY FACTS:
- Wolfz AI works 24/7/365.
- Responds in < 10 seconds.
- Speaks 30+ languages.
- Integrates with HubSpot, Salesforce, etc.
- Secure (SOC2 compliant).

BEHAVIOR:
- Keep answers concise (2-3 sentences max).
- Be enthusiastic but professional.
- If you don't know an answer, suggest booking a demo.
- Always try to steer the conversation towards booking a demo.
`;

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
  const [error, setError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Initialize Chat Session
  useEffect(() => {
    if (isOpen && !chatSessionRef.current && API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });
      } catch (e) {
        console.error("Failed to initialize chat session", e);
        setError("System offline");
      }
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    
    // Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      if (!API_KEY) throw new Error("API Key missing");

      // Re-init session if needed (robustness)
      if (!chatSessionRef.current) {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
      }

      // Send to API
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text;

      // Add AI Response
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);

    } catch (err) {
      console.error("Chat Error:", err);
      // Fallback Message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm currently experiencing high traffic. Please try again later or book a demo directly to speak with our team!",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Close handler
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] max-w-[calc(100vw-48px)] h-[550px] max-h-[70vh] flex flex-col bg-[#0F172A] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-bottom-right">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-slate-900"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50 scroll-smooth">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 border border-slate-600 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 w-16">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-cyan-500/20">
            <form 
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-3 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white p-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-center">
              <button 
                onClick={onOpenModal}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                Book a Demo Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-105 transition-all duration-300 z-50"
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
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
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChatWidget;
