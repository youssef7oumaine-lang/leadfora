
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ChatBotWidgetProps {
  onOpenModal: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: 'chat' | 'voice';
  setMode: (mode: 'chat' | 'voice') => void;
  leadData?: { name: string } | null;
}

type Message = {
  id: number;
  text: string;
  sender: 'ai' | 'user';
};

// --- Persona ---

const getSarahPersona = (leadName?: string) => `IDENTITY:
You are Sarah, Wolfz AI's Senior AI Consultant. You are professional, warm, highly efficient, and persuasive.

CONTEXT:
User Name: ${leadName || "Guest"}

CORE OBJECTIVES:
1. Answer questions about Wolfz AI clearly.
2. Overcome objections regarding security and AI capabilities.
3. Guide the user to click the "Book Demo" button to see the AI in action.

KNOWLEDGE BASE & OBJECTION HANDLING:

1.  **Security & Privacy:**
    *   "We use enterprise-grade encryption (SOC2 compliant standards). Your data is yours—we never train public models on your private client info."

2.  **AI vs Human Reliability:**
    *   "Unlike human agents, I never sleep, take breaks, or have 'off' days. I respond to every lead within 10 seconds, 24/7/365, ensuring you never miss the 5-minute golden window for conversion."

3.  **Ease of Use:**
    *   "Setup takes minutes. I connect instantly with your existing tools (HubSpot, Salesforce, etc.) with zero manual data entry required."

4.  **Pricing:**
    *   "We offer flexible plans based on lead volume. The best way to see the value is to book a quick demo."

CONVERSATION FLOW:
*   Keep answers concise (max 2-3 sentences).
*   Be confident but approachable.
*   Always end with a subtle nudge towards the demo: "Would you like to see how it works live?" or "Shall I open the demo form for you?"
`;

const QUICK_REPLIES = [
  { id: 'pricing', label: '💰 Price?', question: 'How much does Wolfz AI cost?' },
  { id: 'integrations', label: '🔌 Integrations?', question: 'What integrations does Wolfz AI support?' },
  { id: 'languages', label: '🗣️ Languages?', question: 'What languages does Wolfz AI speak?' },
  { id: 'demo', label: '🚀 Test AI', question: 'I want to test the AI.' },
];

// --- Main Widget ---

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ onOpenModal, isOpen, setIsOpen, mode, setMode, leadData }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Salam! 👋 I'm Sarah, the Wolfz AI Agent. I can speak 30+ languages. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Greeting Bubble State
  const [showGreeting, setShowGreeting] = useState(false);
  const [hasDismissedGreeting, setHasDismissedGreeting] = useState(false);

  // Proactive Greeting Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isOpen && !hasDismissedGreeting) {
      timer = setTimeout(() => {
        setShowGreeting(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, hasDismissedGreeting]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Gemini Chat Session for Text Mode
  const [textChatSession, setTextChatSession] = useState<any>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
              model: 'gemini-3-pro-preview',
              config: {
                systemInstruction: getSarahPersona(leadData?.name),
              }
            });
            setTextChatSession(chat);
        } catch (error) {
            console.error("Failed to initialize Text AI", error);
        }
    }
  }, [leadData]);

  const handleSendMessage = async (text: string, isDemo: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (isDemo) {
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: Message = { 
          id: Date.now() + 1, 
          text: "Let's do it! Opening the demo form for you now...", 
          sender: 'ai' 
        };
        setMessages(prev => [...prev, aiMsg]);
        setTimeout(() => onOpenModal(), 1000);
      }, 1000);
      return;
    }

    try {
      if (textChatSession) {
        const result = await textChatSession.sendMessage({ message: text });
        const response = result.text;
        setIsTyping(false);
        const aiMsg: Message = { 
          id: Date.now() + 1, 
          text: response, 
          sender: 'ai' 
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
         setTimeout(() => {
            setIsTyping(false);
            const aiMsg: Message = { 
                id: Date.now() + 1, 
                text: "I'm connecting... please try again.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, aiMsg]);
         }, 1000);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const errorMsg: Message = { 
          id: Date.now() + 1, 
          text: "Connection error. Please try again.", 
          sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  const handleDismissGreeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGreeting(false);
    setHasDismissedGreeting(true);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[90] flex flex-col items-end"
      dir="ltr"
    >
      
      {/* Proactive Chat Invitation Bubble */}
      {!isOpen && showGreeting && (
        <div 
          onClick={() => setIsOpen(true)}
          className="mb-4 mr-2 w-64 bg-[#0F172A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl rounded-br-none p-4 shadow-[0_0_20px_rgba(0,217,255,0.2)] cursor-pointer animate-fade-in-up relative group transition-all hover:-translate-y-1"
        >
          {/* Close Button */}
          <button 
            onClick={handleDismissGreeting}
            className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex-shrink-0 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed pr-4">
              I'm Sarah, your AI Agent. Want to hear me speak Arabic or French? Click here. 🎙️
            </p>
          </div>

          {/* Triangle Pointer */}
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#0F172A]/90 border-r border-b border-cyan-500/30 transform rotate-45"></div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[550px] flex flex-col bg-[#0F172A]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-bottom-right transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-cyan-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 absolute bottom-0 right-0 bg-green-500 rounded-full ring-2 ring-slate-900"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sarah (AI Agent)</h3>
                <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Book Demo Button (Replaces Voice Call) */}
                <button 
                    onClick={onOpenModal}
                    className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30"
                    title="Book AI Demo"
                >
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.27-.27.36-.66.24-1.01-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.28 3 3.93 3 4.74c0 9.17 7.46 16.63 16.63 16.63.81 0 1.46-.65 1.46-1.19v-3.81c0-.54-.45-.99-.99-.99z"/></svg>
                </button>
                {/* Close */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gradient-to-b from-slate-900/50 to-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-2'}`}
              >
                {/* AI Avatar for messages */}
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)] mt-1">
                    <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}

                <div 
                  className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)] mt-1">
                  <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-slate-900/80 border-t border-cyan-500/20 shrink-0">
            
            {/* Quick Options (Horizontal Scroll) */}
            <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-slate-800">
              {QUICK_REPLIES.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSendMessage(option.question, option.id === 'demo')}
                  disabled={isTyping}
                  className="whitespace-nowrap text-xs py-1.5 px-3 rounded-full bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className="p-3 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a question..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowGreeting(false);
        }}
        className="relative group h-14 w-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-110 transition-all duration-300 focus:outline-none"
        style={{
          background: 'linear-gradient(135deg, #00D9FF 0%, #00FF41 100%)'
        }}
      >
        {/* Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping"></span>
        
        {isOpen ? (
           // Close Icon
           <svg className="w-6 h-6 text-slate-900 font-bold relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
           // Robot/Sparkle Icon
           <svg className="w-7 h-7 text-slate-900 relative z-10 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>
        )}
      </button>

      {/* Notification Badge (Only when closed and greeting not shown) */}
      {!isOpen && !showGreeting && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center animate-bounce">
          <span className="w-2 h-2 bg-white rounded-full"></span>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
