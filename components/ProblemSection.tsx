
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from '../LanguageContext';

interface ProblemSectionProps {
  onOpenModal: () => void;
}

const styles = `
  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-10px, -20px); }
  }
  @keyframes float-medium {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(15px, -30px); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }
  @keyframes glitch-entry {
    0% { opacity: 0; transform: translateY(20px) skewX(-10deg); }
    60% { transform: translateY(-5px) skewX(5deg); }
    80% { transform: translateY(0) skewX(-2deg); }
    100% { opacity: 1; transform: translateY(0) skewX(0); }
  }
  @keyframes particle-rise {
    0% { transform: translateY(100px); opacity: 0; }
    20% { opacity: 0.6; }
    80% { opacity: 0.6; }
    100% { transform: translateY(-100px); opacity: 0; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
  .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }
`;

const useCounter = (end: number, duration: number = 2000, start: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
};

const useLiveLossCounter = () => {
  const [count, setCount] = useState(1420);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return count;
};

const BackgroundParticles = () => {
  const particles = useMemo(() => [...Array(25)].map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-1.5 h-1.5',
    color: Math.random() > 0.5 ? 'bg-cyan-400' : 'bg-emerald-400'
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-float-medium" />
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-0 ${p.size} ${p.color}`}
          style={{
            left: p.left,
            top: p.top,
            animation: `particle-rise ${p.duration} linear infinite`,
            animationDelay: p.delay
          }}
        />
      ))}
    </div>
  );
};

interface StatCardProps {
  item: any;
  index: number;
  isVisible: boolean;
  numberValue: number;
  suffix: string;
}

const StatCard: React.FC<StatCardProps> = ({ item, index, isVisible, numberValue, suffix }) => {
  const count = useCounter(numberValue, 2500, isVisible);
  const { isRTL } = useTranslation();
  
  return (
    <div 
      className="relative group flex flex-col w-full h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${index * 100}ms`,
        willChange: 'transform, opacity'
      }}
    >
      <div className="relative p-[1px] rounded-2xl overflow-hidden transition-transform duration-500 hover:-translate-y-2 will-change-transform h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-slate-800 to-emerald-500/30 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative h-full bg-[#0F172A]/90 backdrop-blur-xl rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-shadow duration-500">
          
          <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'}`}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-spin-slow group-hover:animate-[spin_2s_linear_infinite] transition-all"></div>
              <div className="relative text-cyan-400 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
          </div>

          <div className="mb-2 relative">
            <span 
              className="text-[64px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#00FF41]"
              style={{ 
                filter: 'drop-shadow(0 0 15px rgba(6,182,212,0.3))',
                fontFamily: 'Outfit, sans-serif' 
              }}
            >
              {count}{suffix}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
            {item.title}
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
            {item.text}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5">
             <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
               Insight: <span className="text-slate-400 normal-case font-normal italic">{item.insight}</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProblemSection: React.FC<ProblemSectionProps> = ({ onOpenModal }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const liveLoss = useLiveLossCounter();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const icons = [
      (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4 4-6 6" />
        </svg>
      )
  ];

  const cardData = t.problem.cards.map((card, index) => ({
    ...card,
    icon: icons[index]
  }));

  const cardStats = [
      { num: 100, suff: 'x' },
      { num: 80, suff: '%' },
      { num: 78, suff: '%' },
      { num: 21, suff: 'x' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full pt-16 pb-32 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #E2E8F0 0%, #F8FAFC 20%, #FFFFFF 100%)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{styles}</style>
      <BackgroundParticles />
      <div className="relative max-w-6xl mx-auto z-10">
        
        <div className="text-center mb-16 max-w-4xl mx-auto">
          
          <div className={`
            inline-flex items-center gap-2 bg-red-100 border border-red-200 px-4 py-1.5 rounded-full mb-8
            transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
          `}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <p className="text-xs font-mono font-bold text-red-600">
              {t.problem.live_loss}: {liveLoss.toLocaleString()}
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
             {t.problem.headline}
          </h2>

          <div 
            className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
             <p className="text-lg md:text-xl text-slate-600 font-medium relative inline-block">
               {t.problem.subheadline}
               <span className={`absolute -bottom-2 ${isRTL ? 'right-0' : 'left-0'} h-[2px] bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-[1500ms] ease-out ${isVisible ? 'w-full' : 'w-0'}`}></span>
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cardData.map((card, idx) => (
            <StatCard 
              key={idx} 
              item={card} 
              index={idx} 
              isVisible={isVisible} 
              numberValue={cardStats[idx].num}
              suffix={cardStats[idx].suff}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={onOpenModal}
            className="group relative inline-flex items-center justify-center px-20 py-3 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105 focus:outline-none overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 30px rgba(0, 255, 65, 0.5)'
            }}
          >
            <span className="relative z-10 group-hover:brightness-125 transition-all">{t.problem.cta}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
