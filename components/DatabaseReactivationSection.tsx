import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

interface DatabaseReactivationSectionProps {
  onOpenModal: () => void;
}

// --- Counter Hook ---
const Counter = ({ from, to, duration, format = 'number', delay = 0 }: { from: number; to: number; duration: number; format?: 'number' | 'currency'; delay?: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const node = nodeRef.current;
    if (!node) return;

    // Initial delay before counting starts
    const timeoutId = setTimeout(() => {
      const controls = animate(from, to, {
        duration: duration,
        ease: "circOut",
        onUpdate(value) {
          if (format === 'currency') {
            // Format as $1.2M for large numbers or standard currency
            if (value >= 1000000) {
              node.textContent = `$${(value / 1000000).toFixed(1)}M`;
            } else {
               node.textContent = `$${Math.floor(value).toLocaleString()}`;
            }
          } else {
            node.textContent = Math.floor(value).toLocaleString();
          }
        }
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [from, to, duration, format, isInView, delay]);

  return <span ref={nodeRef} />;
};

const DatabaseReactivationSection: React.FC<DatabaseReactivationSectionProps> = ({ onOpenModal }) => {
  return (
    <section 
      className="relative w-full py-24 bg-[#F8FAFC] overflow-hidden font-sans"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Headline */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Turn Your 'Dead' Lists Into Active Revenue.
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Upload your old CSVs. Our AI calls thousands of leads instantly to find the gold hidden in your database.
          </p>
        </div>

        {/* --- Process Cards (Flex Layout for perfect alignment) --- */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
          
          {/* CARD 1: INPUT */}
          <div className="flex-1 w-full bg-[#0F172A] rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Input</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Upload CSV</h3>
            <div className="text-3xl font-mono font-bold text-cyan-400 mb-1">
               <Counter from={0} to={10847} duration={2} />
            </div>
            <p className="text-sm text-slate-400 mb-8 font-medium">Dead leads loaded</p>

            {/* Visual: Lead List */}
            <div className="mt-auto space-y-3 opacity-30">
               <div className="w-full h-2 bg-slate-600 rounded-full" />
               <div className="w-3/4 h-2 bg-slate-600 rounded-full" />
               <div className="w-5/6 h-2 bg-slate-600 rounded-full" />
            </div>
          </div>

          {/* ARROW 1 (Desktop Only) - Animated */}
          <motion.div 
            className="hidden md:flex items-center justify-center px-2"
            animate={{ x: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>

          {/* CARD 2: ENGINE */}
          <div className="flex-1 w-full bg-[#0F172A] rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engine</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">AI Mass Dialing</h3>
             <div className="flex items-center gap-2 mb-8">
                 <span className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                 </span>
                 <span className="text-xs font-bold text-emerald-400 tracking-wide">PROCESSING</span>
             </div>

             {/* Visual: Stats Bars */}
             <div className="mt-auto space-y-4">
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-400">Attempts</span>
                       <span className="text-white font-mono">12,456</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-cyan-500 h-full w-[85%] animate-pulse"></div>
                   </div>
                </div>
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-400">Connects</span>
                       <span className="text-white font-mono">8,902</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full w-[65%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                   </div>
                </div>
             </div>
          </div>

          {/* ARROW 2 (Desktop Only) - Animated */}
          <motion.div 
            className="hidden md:flex items-center justify-center px-2"
            animate={{ x: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>

          {/* CARD 3: RESULT */}
          <div className="flex-1 w-full bg-[#0F172A] rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Result</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Revenue Unlocked</h3>
             <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
               <Counter from={0} to={54000} duration={2.5} format="currency" delay={0.5} />
            </div>
            <p className="text-sm text-slate-400 mb-8 font-medium">Saved per month</p>

            <div className="mt-auto">
               <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center group-hover:bg-emerald-500/20 transition-colors">
                  <span className="text-xs font-bold text-emerald-400 tracking-wide">ROI: 3,400%</span>
               </div>
            </div>
          </div>

        </div>

        {/* --- CTA --- */}
        <div className="text-center mt-16">
           <button
             onClick={onOpenModal}
             className="group relative inline-flex items-center justify-center px-12 py-3.5 rounded-full font-bold text-white text-base tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,255,0.4)] focus:outline-none overflow-hidden"
             style={{
               background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)'
             }}
           >
              <span className="relative z-10">Start Recovering Revenue</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
           </button>
        </div>

      </div>
    </section>
  );
};

export default DatabaseReactivationSection;