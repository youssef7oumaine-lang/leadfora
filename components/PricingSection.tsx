import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingSectionProps {
  onOpenModal: () => void;
}

// Consistent Check Icon (Cyan-500, Top-Aligned)
const CheckIcon = () => (
  <svg className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PricingSection: React.FC<PricingSectionProps> = ({ onOpenModal }) => {
  const [showTip, setShowTip] = useState(false);

  // Show tip after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (feature: string) => {
    const message = `Can you explain the '${feature}' feature?`;
    
    const event = new CustomEvent('trigger-chat-input', {
      detail: { message }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="relative w-full py-24 px-4 bg-[#F8FAFC] overflow-hidden font-sans" id="pricing">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Choose Your Power Pack
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Transparent pricing. High-impact results. No hidden fees.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* ==========================================
                CARD 1: STARTER 
               ========================================== */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
            >
                {/* Header */}
                <div className="mb-6">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entry Level</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">STARTER</h3>
                </div>

                {/* Pricing & Offer */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">$</span>
                        <span className="text-5xl font-extrabold text-slate-900 tracking-tight">2,499</span>
                        <span className="text-slate-500 font-semibold ml-1">/ mo</span>
                    </div>
                    {/* Setup Fee Badge - Pill Style */}
                    <div className="mt-4 inline-flex items-center justify-center w-full px-4 py-1.5 bg-emerald-50 rounded-full">
                        <span className="text-emerald-700 text-sm font-semibold tracking-tight">
                            🎁 SETUP FEE WAIVED (Save $3,000)
                        </span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                    {[
                        "1 AI Voice Agent (Trained on your Data)",
                        "1,500 AI Minutes Included",
                        "Pro Web Chatbot (Unlimited & Trained)",
                        "Full CRM Integration (HubSpot/Salesforce/Sheets)",
                        "Email Support"
                    ].map((feature, i) => (
                        <li 
                            key={i} 
                            onClick={() => handleFeatureClick(feature)}
                            className="flex items-start gap-3 cursor-pointer group"
                            title="Click to ask AI about this"
                        >
                            <CheckIcon />
                            <span className="text-[15px] leading-snug transition-colors duration-200 group-hover:text-cyan-600 text-slate-600 font-medium">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <button 
                    onClick={onOpenModal}
                    className="w-full h-14 rounded-xl font-bold text-slate-700 text-base bg-white border-2 border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-all duration-300 focus:outline-none mt-auto"
                >
                    Get Started
                </button>
            </motion.div>

            {/* ==========================================
                CARD 2: GROWTH (HERO)
               ========================================== */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full flex flex-col bg-white relative rounded-2xl p-8 md:p-10 shadow-2xl shadow-cyan-900/10 hover:-translate-y-1 transition-transform duration-300 lg:scale-105 z-10 border border-cyan-500/30"
            >
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full text-center">
                    <div className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
                        BEST SELLER
                    </div>
                </div>

                {/* Header */}
                <div className="mb-6 mt-2">
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">For Scaling Teams</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">GROWTH</h3>
                </div>

                {/* Pricing & Offer */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">$</span>
                        <span className="text-5xl font-extrabold text-slate-900 tracking-tight">5,499</span>
                        <span className="text-slate-500 font-semibold ml-1">/ mo</span>
                    </div>
                    {/* Setup Fee Badge */}
                    <div className="mt-4 inline-flex items-center justify-center w-full px-4 py-1.5 bg-emerald-50 rounded-full">
                        <span className="text-emerald-700 text-sm font-semibold tracking-tight">
                            🎁 SETUP FEE WAIVED (Save $5,000)
                        </span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                    {[
                        "3 AI Voice Agents (Trained on your Data)",
                        "3,000 AI Minutes Included",
                        "Omni-Channel Chatbot (Web + WhatsApp + Insta)",
                        "Full CRM Integration (HubSpot/Salesforce/Sheets)",
                        "Priority Support"
                    ].map((feature, i) => (
                        <li 
                            key={i} 
                            onClick={() => handleFeatureClick(feature)}
                            className="flex items-start gap-3 cursor-pointer group"
                            title="Click to ask AI about this"
                        >
                            <CheckIcon />
                            <span className="text-[15px] leading-snug transition-colors duration-200 group-hover:text-cyan-600 text-slate-600 font-medium">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <button 
                     onClick={onOpenModal}
                     className="w-full h-14 rounded-xl font-bold text-white text-base bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 focus:outline-none mt-auto"
                >
                    Get Started
                </button>
            </motion.div>

             {/* ==========================================
                CARD 3: ENTERPRISE (VIP)
               ========================================== */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex flex-col bg-slate-900 rounded-2xl p-8 md:p-10 shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/10"
            >
                {/* Header */}
                <div className="mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Volume</span>
                    <h3 className="text-2xl font-bold text-white mt-2">ENTERPRISE</h3>
                </div>

                {/* Pricing (Custom) */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-white tracking-tight">Custom</span>
                    </div>
                    {/* Placeholder Badge for alignment consistency */}
                     <div className="mt-4 inline-flex items-center justify-center w-full px-4 py-1.5 border border-slate-800 rounded-full">
                        <span className="text-slate-400 text-sm font-medium tracking-tight">
                            Tailored enterprise solutions
                        </span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                    {[
                        "Unlimited AI Voice Agents",
                        "Volume Minutes (10k+ Packages)",
                        "Custom Development & API",
                        "Dedicated Account Manager",
                        "White-Label Options"
                    ].map((feature, i) => (
                        <li 
                            key={i} 
                            onClick={() => handleFeatureClick(feature)}
                            className="flex items-start gap-3 cursor-pointer group"
                            title="Click to ask AI about this"
                        >
                            <CheckIcon />
                            <span className="text-[15px] leading-snug transition-colors duration-200 group-hover:text-cyan-400 text-slate-300 font-medium">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <button 
                    onClick={onOpenModal}
                    className="w-full h-14 rounded-xl font-bold text-slate-900 text-base bg-white hover:bg-slate-100 shadow-lg transition-all duration-300 focus:outline-none mt-auto"
                >
                    Contact Sales
                </button>
            </motion.div>

        </div>
        
        <div className="mt-16 text-center">
            <p className="text-sm text-slate-500 font-medium">
                Need a custom solution? <button onClick={onOpenModal} className="text-emerald-500 font-bold hover:underline underline-offset-2 decoration-emerald-500/30">Contact our sales team</button>
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
                    className="hidden md:flex fixed bottom-6 left-6 z-40 bg-white border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-full pl-5 pr-3 py-3 items-center gap-3 max-w-[90vw] sm:max-w-sm"
                >
                    <div className="text-xl">💡</div>
                    <div className="text-sm text-slate-700 leading-tight">
                        <span className="font-bold">Pro Tip:</span> Click on any feature to ask our AI to explain it!
                    </div>
                    <button 
                        onClick={() => setShowTip(false)}
                        className="ml-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
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