
import React, { useEffect, useState, useRef } from 'react';
import LiveDashboard from './LiveDashboard';
import { useTranslation } from '../LanguageContext';
import { motion } from 'framer-motion';

interface SolutionSectionProps {
  onOpenModal: () => void;
  id?: string;
}

const styles = `
  @keyframes flow-dash {
    to { stroke-dashoffset: -100; }
  }
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes check-bounce {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-flow { animation: flow-dash 2s linear infinite; }
  .animate-ripple { animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
`;

const StepIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'phone') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ripple" />
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ripple" style={{ animationDelay: '1s' }} />
        <svg className="w-8 h-8 text-cyan-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
    );
  }
  if (type === 'brain') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute top-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <svg className="w-8 h-8 text-emerald-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-8 h-8 text-cyan-400 animate-[check-bounce_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 animate-[check-bounce_0.6s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards] opacity-0">
         <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
         </svg>
      </div>
    </div>
  );
};

const SolutionSection: React.FC<SolutionSectionProps> = ({ onOpenModal }) => {
  // Initialize visibility state based on screen size (Mobile = visible immediately)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useTranslation();
  
  useEffect(() => {
    // If already visible (e.g. mobile default), skip observer
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  const steps = [
    { id: 1, number: '01', iconType: 'phone' },
    { id: 2, number: '02', iconType: 'brain' },
    { id: 3, number: '03', iconType: 'calendar' }
  ].map((step, idx) => ({
    ...step,
    ...t.solution.steps[idx]
  }));

  return (
    <section 
      id="services"
      ref={sectionRef}
      className="relative w-full py-20 px-4 overflow-hidden scroll-mt-28"
      style={{
        background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFC 100%)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{styles}</style>
      <div className="absolute inset-0 pointer-events-none opacity-30">
         <div className="absolute inset-0" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6,182,212,0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px' 
              }} 
         />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t.solution.headline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">{t.solution.headline_highlight}</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.solution.subheadline}
          </p>
        </div>

        <div className="relative mb-32">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0">
            <div className={`h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-[2000ms] ease-out ${isVisible ? 'w-full' : 'w-0'}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div 
                key={step.id}
                className={`relative group`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 200}ms`
                }}
              >
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full border-l-2 border-dashed border-cyan-200/50 -z-10 h-[140%]" />

                <div className="h-full bg-[#0F172A]/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                  
                  <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.number}
                  </div>

                  <div className="w-16 h-16 mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                    <StepIcon type={step.iconType} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">{step.desc}</p>

                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-xs font-mono font-bold text-cyan-400">{step.stat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-20">
          <motion.div 
            className="w-full relative h-auto md:h-full min-h-[500px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40% 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl opacity-20 blur-lg"></div>
             <LiveDashboard />
          </motion.div>

          <div className="w-full pt-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">{t.solution.comparison_title}</h3>
            
            <div className="space-y-4">
              {t.solution.features.map((row, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100 group"
                >
                  <span className="font-medium text-slate-700">{row.feature}</span>
                  <div className="flex items-center gap-8 text-sm">
                    <span className="text-slate-400 line-through decoration-red-400/50">{row.human}</span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                      {row.ai}
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
               <button
                onClick={onOpenModal}
                className="w-full md:w-auto md:min-w-[300px] md:px-16 py-3.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:brightness-110 focus:outline-none shadow-[0_0_20px_rgba(0,255,65,0.3)] tracking-wide"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
                }}
               >
                 {t.solution.cta}
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
