
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../LanguageContext';

interface SmartSalesBotSectionProps {
  onOpenModal: () => void;
  onToggleChat: () => void;
}

// Types for chat messages
type Message = {
  id: number;
  type: 'bot' | 'user';
  text: string;
  time: string;
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex gap-1 p-1 items-center">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-1 h-1 bg-slate-400 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: dot * 0.15,
        }}
      />
    ))}
  </div>
);

// --- STATIC WHATSAPP CARD (Left) ---
const WhatsAppCard = () => (
  <div className="bg-[#E5DDD5] w-full h-full flex flex-col relative overflow-hidden rounded-[2rem] shadow-xl border border-slate-200">
    {/* WA Header */}
    <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
           <svg className="w-full h-full text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
           </svg>
        </div>
        <div>
          <h3 className="font-bold text-white text-xs">Wolfz AI (WA)</h3>
          <p className="text-[9px] text-white/80">online</p>
        </div>
      </div>
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
    </div>

    {/* WA Messages */}
    <div className="flex-1 p-4 space-y-3 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}></div>
      
      <div className="flex justify-start relative z-10">
        <div className="bg-white text-slate-800 px-3 py-1.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-[13px]">
          Hello! Here is the brochure 📄
          <span className="block text-[9px] text-slate-400 text-right mt-0.5">10:42 AM</span>
        </div>
      </div>
      <div className="flex justify-end relative z-10">
        <div className="bg-[#DCF8C6] text-slate-800 px-3 py-1.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-[13px]">
          Thanks, looking now.
          <span className="block text-[9px] text-slate-500 text-right mt-0.5">10:43 AM</span>
        </div>
      </div>
      <div className="flex justify-start relative z-10">
        <div className="bg-white text-slate-800 px-3 py-1.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-[13px]">
          Let me know if you want to book a viewing! 🏡
          <span className="block text-[9px] text-slate-400 text-right mt-0.5">10:43 AM</span>
        </div>
      </div>
    </div>
    
    {/* WA Input */}
    <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 shrink-0">
       <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-400 text-lg">+</div>
       <div className="flex-1 bg-white rounded-full h-8 px-3 text-xs text-slate-400 flex items-center">Type a message</div>
       <div className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center text-white">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
       </div>
    </div>
  </div>
);

// --- STATIC INSTAGRAM CARD (Right) ---
const InstagramCard = () => (
  <div className="bg-white w-full h-full flex flex-col relative overflow-hidden rounded-[2rem] shadow-xl border border-slate-200">
    {/* IG Header */}
    <div className="bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
           <img src="https://ui-avatars.com/api/?name=Wolfz+AI&background=random" alt="IG" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-white text-xs">wolfz.ai</h3>
          <p className="text-[9px] text-white/90">Active now</p>
        </div>
      </div>
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>

    {/* IG Messages */}
    <div className="flex-1 p-4 space-y-3 overflow-hidden bg-white">
      <div className="flex justify-end">
        <div className="bg-[#3797F0] text-white px-3 py-2 rounded-[1rem] rounded-br-sm max-w-[85%] text-[13px]">
          Hi, is the Villa still available?
        </div>
      </div>
      <div className="flex justify-start">
         <div className="bg-slate-100 text-slate-800 px-3 py-2 rounded-[1rem] rounded-bl-sm max-w-[85%] text-[13px]">
           Yes! Just listed today. 🔥
         </div>
      </div>
       <div className="flex justify-start">
         <div className="bg-slate-100 text-slate-800 px-3 py-2 rounded-[1rem] rounded-bl-sm max-w-[85%] text-[13px]">
           Would you like the floorplan?
         </div>
      </div>
      <div className="flex justify-center mt-3">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seen just now</span>
      </div>
    </div>

    {/* IG Input */}
    <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2.5 shrink-0">
       <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
       </div>
       <div className="flex-1 bg-slate-100 rounded-full h-8 px-3 text-xs text-slate-400 flex items-center">Message...</div>
       <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    </div>
  </div>
);

// --- MAIN WEB CHAT CARD (Center - Dynamic) ---
const WebChatCard = ({ messages, isTyping, showBadge, t }: any) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95 }
  };

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-300 border border-slate-100 h-full flex flex-col relative overflow-hidden">
      {/* 1. Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-white/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 p-[2px]">
                  <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-emerald-500">AI</span>
                  </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs leading-tight">Sarah</h3>
              <p className="text-[10px] text-slate-400 font-medium">Wolfz AI Agent</p>
            </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Online</span>
        </div>
      </div>

      {/* 2. Message Area */}
      <div className="flex-1 p-4 flex flex-col bg-slate-50/50 overflow-y-auto no-scrollbar relative">
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex justify-center mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">Today</span>
            </div>

            <AnimatePresence mode="popLayout">
              {messages.map((msg: any) => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`flex flex-col w-full ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl rounded-tr-sm shadow-cyan-500/10' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">
                    {msg.type === 'bot' ? 'Sarah • ' : 'You • '} {msg.time}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-start w-full"
              >
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
                  <TypingIndicator />
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">Sarah is typing...</span>
              </motion.div>
            )}
          </div>
      </div>

      {/* 3. Badge Overlay */}
      <AnimatePresence>
        {showBadge && (
          <div className="absolute bottom-20 left-4 right-4 flex items-center justify-center z-30">
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-emerald-100 flex items-center gap-3"
            >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{t.salesBot.badge}</h4>
                  <p className="text-[10px] text-slate-500">Synced to CRM. Agent notified.</p>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Fake Input */}
      <div className="shrink-0 p-3 bg-white border-t border-slate-100 z-20">
        <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 cursor-default">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-3 py-2">
              <span className="text-xs text-slate-400">Type a message...</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 cursor-default">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </div>
        </div>
      </div>
    </div>
  );
};

const SmartSalesBotSection: React.FC<SmartSalesBotSectionProps> = ({ onOpenModal, onToggleChat }) => {
  const { t, isRTL } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // To handle responsive layout
  
  const isMounted = useRef(true);

  // --- Responsive Check ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- AUTO-PLAY LOGIC ---
  useEffect(() => {
    isMounted.current = true;
    const runSequence = async () => {
      while (isMounted.current) {
        setMessages([]); setShowBadge(false); setIsTyping(false);
        await new Promise(r => setTimeout(r, 800)); if (!isMounted.current) break;

        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1200)); if (!isMounted.current) break;
        setIsTyping(false);
        setMessages(prev => [...prev, { id: 1, type: 'bot', text: t.salesBot.chat.q1, time: 'Now' }]);
        
        await new Promise(r => setTimeout(r, 1500)); if (!isMounted.current) break;
        setMessages(prev => [...prev, { id: 2, type: 'user', text: t.salesBot.chat.a1, time: 'Now' }]);

        await new Promise(r => setTimeout(r, 600)); if (!isMounted.current) break;
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1500)); if (!isMounted.current) break;
        setIsTyping(false);
        setMessages(prev => [...prev, { id: 3, type: 'bot', text: t.salesBot.chat.q2, time: 'Now' }]);

        await new Promise(r => setTimeout(r, 1500)); if (!isMounted.current) break;
        setMessages(prev => [...prev, { id: 4, type: 'user', text: t.salesBot.chat.a2, time: 'Now' }]);

        await new Promise(r => setTimeout(r, 600)); if (!isMounted.current) break;
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1500)); if (!isMounted.current) break;
        setIsTyping(false);
        setMessages(prev => [...prev, { id: 5, type: 'bot', text: t.salesBot.chat.closing, time: 'Now' }]);

        await new Promise(r => setTimeout(r, 800)); if (!isMounted.current) break;
        setShowBadge(true);

        await new Promise(r => setTimeout(r, 6000));
      }
    };
    runSequence();
    return () => { isMounted.current = false; };
  }, [t.salesBot]);

  // Animation values based on screen size
  // Mobile: tight (30px), Desktop: wide (150px for compact fan)
  const spread = isMobile ? 30 : 150;
  const rotate = isMobile ? 6 : 12;

  // Helper function to bold 'AI Sales Chatbot' in text
  const formatSubheadline = (text: string) => {
    const target = "AI Sales Chatbot";
    if (text.includes(target)) {
      const parts = text.split(target);
      return (
        <>
          {parts[0]}
          <span className="font-bold text-slate-900">{target}</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <section 
      className="relative w-full py-24 px-6 bg-slate-50 overflow-hidden font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Headlines */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 w-full max-w-6xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t.salesBot.headline}
          </h1>
          <h2 className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {formatSubheadline(t.salesBot.subheadline)}
          </h2>
        </motion.div>

        {/* --- 3-CARD DECK ANIMATION --- */}
        <motion.div 
          className="w-full mb-24 h-[500px] relative flex justify-center items-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Float Animation Wrapper */}
          <motion.div
            className="relative w-full max-w-sm h-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* 1. WhatsApp Card (Left/Behind) */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full z-10"
              initial={{ x: 0, rotate: 0, scale: 0.9, opacity: 0 }}
              whileInView={{ x: -spread, rotate: -rotate, scale: 0.9, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              style={{ transformOrigin: "bottom right" }}
            >
               <WhatsAppCard />
            </motion.div>

            {/* 2. Instagram Card (Right/Behind) */}
            <motion.div
              className="absolute top-0 right-0 w-full h-full z-10"
              initial={{ x: 0, rotate: 0, scale: 0.9, opacity: 0 }}
              whileInView={{ x: spread, rotate: rotate, scale: 0.9, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              style={{ transformOrigin: "bottom left" }}
            >
              <InstagramCard />
            </motion.div>

            {/* 3. Main Web Chat Card (Center/Front) */}
            <motion.div
               className="absolute top-0 left-0 w-full h-full z-30"
               initial={{ scale: 0.95, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
               <WebChatCard 
                 messages={messages} 
                 isTyping={isTyping} 
                 showBadge={showBadge} 
                 t={t} 
               />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={onToggleChat}
            className="group relative inline-flex items-center justify-center px-12 py-3.5 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 25px rgba(0, 255, 65, 0.6)'
            }}
          >
            <span className="relative z-10 flex items-center gap-2 tracking-wide">
              {t.salesBot.cta}
            </span>
          </button>
        </motion.div>

      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default SmartSalesBotSection;
