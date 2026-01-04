
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingSectionProps {
  onOpenModal: () => void;
}

// Modern Check Icon in Circle
const CheckIcon = ({ colorClass = "bg-cyan-100 text-cyan-600" }: { colorClass?: string }) => (
  <div className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-full ${colorClass} shrink-0`}>
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const PricingSection: React.FC<PricingSectionProps> = ({ onOpenModal }) => {
  const [showTip, setShowTip] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Show tip after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFeatureClick = (feature: string) => {
    const message = `Can you explain the '${feature}' feature?`;
    const event = new CustomEvent('trigger-chat-input', {
      detail: { message }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="relative w-full py-24 px-4 font-sans z-10" id="pricing">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 text-[11px] font-bold uppercase tracking-widest mb-6">
            Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Investment Plans
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            High-performance AI infrastructure for serious Real Estate groups.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ==========================================
                CARD 1: STARTER (High Contrast Polish)
               ========================================== */}
            <motion.div 
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative w-full flex flex-col bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
                {/* Header */}
                <div className="mb-8 border-b border-slate-100 pb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Starter</h3>
                    
                    <div className="flex items-start gap-1">
                        <span className="text-3xl font-bold text-slate-400 mt-1">$</span>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">2,999</span>
                        <span className="text-slate-500 font-bold self-end mb-2 ml-1">/ mo</span>
                    </div>

                    <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200 transition-colors duration-300 hover:border-emerald-400 group/fee">
                         <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover/fee:text-slate-600 transition-colors">Architecture Fee</span>
                         <span className="text-base font-black text-slate-900">$3,500 <span className="text-slate-400 font-medium text-xs">(One-time)</span></span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-5 mb-10 flex-1">
                    {[
                        "1 AI Voice Agent (Inbound/Outbound)",
                        "2,000 AI Minutes Included",
                        "Pro Web Chatbot (Capture & Booking)",
                        "Basic CRM Integration (HubSpot/Sheets)",
                        "Standard Email Support"
                    ].map((feature, i) => (
                        <li 
                            key={i} 
                            onClick={() => handleFeatureClick(feature)}
                            className="flex items-start gap-3 cursor-pointer group/item"
                        >
                            <CheckIcon colorClass="bg-slate-100 text-slate-600 group-hover/item:bg-cyan-100 group-hover/item:text-cyan-600 transition-colors" />
                            <span className="text-[15px] leading-snug text-slate-600 font-medium group-hover/item:text-slate-900 transition-colors">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <button 
                    onClick={onOpenModal}
                    className="w-full py-4 rounded-2xl font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 text-sm tracking-wide transition-all duration-300 focus:outline-none mt-auto"
                >
                    Get Started
                </button>
            </motion.div>

            {/* ==========================================
                CARD 2: GROWTH (Hero - Cyan/Emerald Tint)
               ========================================== */}
            <motion.div 
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative w-full z-10 lg:-mt-4 lg:mb-4"
            >
                <div className="relative w-full flex flex-col bg-gradient-to-b from-cyan-50/40 to-emerald-50/20 backdrop-blur-2xl border border-emerald-400/50 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-2xl shadow-emerald-500/20">
                    
                    {/* Badge */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full p-[1px] shadow-lg shadow-emerald-400/40">
                          <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-1.5">
                            <span className="text-xs font-bold text-white uppercase tracking-widest">
                                Most Popular
                            </span>
                          </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8 border-b border-emerald-200/50 pb-8 mt-2">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Growth</h3>
                        
                        <div className="flex items-start gap-1">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-emerald-500 mt-1">$</span>
                            <span className="text-7xl font-black text-slate-900 tracking-tighter">6,999</span>
                            <span className="text-slate-600 font-bold self-end mb-2 ml-1">/ mo</span>
                        </div>

                        <div className="mt-6 flex items-center justify-between bg-white/60 rounded-xl p-4 border border-emerald-100 shadow-sm transition-colors duration-300 hover:border-emerald-400 group/fee">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Architecture Fee</span>
                            <span className="text-lg font-black text-slate-900">$6,500 <span className="text-slate-500 font-medium text-xs">(One-time)</span></span>
                        </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-5 mb-10 flex-1">
                        {[
                            "3 AI Voice Agents (Sales, Qualify, Support)",
                            "5,000 AI Minutes Included",
                            "Omni-Channel Chatbot (Web + WhatsApp + Instagram)",
                            "Full CRM Sync (HubSpot, Salesforce, Zoho)",
                            "Priority Support (Dedicated Slack Channel)"
                        ].map((feature, i) => (
                            <li 
                                key={i} 
                                onClick={() => handleFeatureClick(feature)}
                                className="flex items-start gap-3 cursor-pointer group/item"
                            >
                                <CheckIcon colorClass="bg-gradient-to-br from-cyan-400 to-emerald-400 text-white shadow-md shadow-emerald-200" />
                                <span className="text-[15px] leading-snug text-slate-700 font-bold group-hover/item:text-emerald-700 transition-colors">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Button */}
                    <button 
                        onClick={onOpenModal}
                        className="group relative w-full py-4 rounded-2xl font-extrabold text-white text-sm tracking-wide uppercase overflow-hidden shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 group-hover:brightness-105" />
                        <span className="relative z-10">Get Started</span>
                    </button>
                </div>
            </motion.div>

             {/* ==========================================
                CARD 3: ENTERPRISE (High Contrast Polish)
               ========================================== */}
            <motion.div 
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative w-full flex flex-col bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
                {/* Header */}
                <div className="mb-8 border-b border-slate-100 pb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Enterprise</h3>
                    
                    <div className="flex items-start gap-1">
                        <div className="flex flex-col mt-1">
                             <span className="text-xs font-bold text-slate-400 uppercase">Starts at</span>
                             <span className="text-3xl font-bold text-slate-400">$</span>
                        </div>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">12,000</span>
                        <span className="text-slate-500 font-bold self-end mb-2 ml-1">/ mo</span>
                    </div>

                    <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200 transition-colors duration-300 hover:border-emerald-400 group/fee">
                         <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover/fee:text-slate-600 transition-colors">Architecture Fee</span>
                         <span className="text-base font-black text-slate-900">Custom</span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-5 mb-10 flex-1">
                    {[
                        "Unlimited AI Agents Configuration",
                        "10,000+ AI Minutes (Custom Volume)",
                        "Custom Development & API Access",
                        "Dedicated Account Manager",
                        "White-Label Options"
                    ].map((feature, i) => (
                        <li 
                            key={i} 
                            onClick={() => handleFeatureClick(feature)}
                            className="flex items-start gap-3 cursor-pointer group/item"
                        >
                             <CheckIcon colorClass="bg-slate-100 text-slate-600 group-hover/item:bg-slate-900 group-hover/item:text-white transition-colors" />
                            <span className="text-[15px] leading-snug text-slate-600 font-medium group-hover/item:text-slate-900 transition-colors">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <button 
                    onClick={onOpenModal}
                    className="w-full py-4 rounded-2xl font-bold text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm tracking-wide transition-all duration-300 focus:outline-none mt-auto"
                >
                    Contact Sales
                </button>
            </motion.div>

        </div>
        
        <div className="mt-20 text-center">
            <p className="text-sm text-slate-500 font-medium">
                Need a fully custom deployment? <button onClick={onOpenModal} className="text-slate-900 font-bold hover:underline underline-offset-4 decoration-cyan-400 decoration-2 transition-all">Talk to our Solutions Architect.</button>
            </p>
        </div>

        {/* Floating Pro Tip */}
        <AnimatePresence>
            {showTip && (
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="hidden md:flex fixed bottom-6 left-6 z-40 bg-white/80 backdrop-blur-md border border-cyan-100 shadow-xl shadow-slate-200/50 rounded-full pl-5 pr-3 py-3 items-center gap-3 max-w-[90vw] sm:max-w-sm"
                >
                    <div className="text-xl">💡</div>
                    <div className="text-sm text-slate-600 leading-tight">
                        <span className="font-bold text-slate-900">Pro Tip:</span> Click on any feature to ask our AI to explain it!
                    </div>
                    <button 
                        onClick={() => setShowTip(false)}
                        className="ml-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default PricingSection;
