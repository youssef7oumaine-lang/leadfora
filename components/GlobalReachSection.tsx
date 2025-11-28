
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../LanguageContext';

interface GlobalReachSectionProps {
  onOpenModal?: () => void;
}

const styles = `
  @keyframes scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scroll-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-scroll-left {
    animation: scroll-left 60s linear infinite;
  }
  .animate-scroll-right {
    animation: scroll-right 60s linear infinite;
  }
  .marquee-row:hover .marquee-inner {
    animation-play-state: paused;
  }
`;

const languagesRow1 = [
  { name: 'Arabic (Gulf)', flagCode: 'ae' },
  { name: 'Mandarin', flagCode: 'cn' },
  { name: 'Russian', flagCode: 'ru' },
  { name: 'French', flagCode: 'fr' },
  { name: 'Hindi', flagCode: 'in' },
  { name: 'Spanish', flagCode: 'es' },
  { name: 'Japanese', flagCode: 'jp' },
  { name: 'German', flagCode: 'de' },
  { name: 'Italian', flagCode: 'it' },
  { name: 'Portuguese', flagCode: 'pt' },
  { name: 'Korean', flagCode: 'kr' },
  { name: 'Urdu', flagCode: 'pk' },
];

const languagesRow2 = [
  { name: 'Thai', flagCode: 'th' },
  { name: 'Tagalog', flagCode: 'ph' },
  { name: 'Vietnamese', flagCode: 'vn' },
  { name: 'Indonesian', flagCode: 'id' },
  { name: 'Malay', flagCode: 'my' },
  { name: 'Turkish', flagCode: 'tr' },
  { name: 'Farsi', flagCode: 'ir' },
  { name: 'Swahili', flagCode: 'ke' },
  { name: 'Portuguese (BR)', flagCode: 'br' },
  { name: 'Greek', flagCode: 'gr' },
  { name: 'Khaleeji', flagCode: 'om' },
  { name: 'Emirati', flagCode: 'ae' },
];

const GlobalReachSection: React.FC<GlobalReachSectionProps> = ({ onOpenModal }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section 
      id="languages"
      ref={sectionRef}
      className="relative w-full py-24 px-4 overflow-hidden border-t border-slate-200 scroll-mt-28 bg-[#F8FAFC]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{styles}</style>

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 
            className={`text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {t.global.headline}
          </h2>
          <p 
            className={`text-lg md:text-xl text-slate-600 max-w-2xl mx-auto transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {t.global.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { val: '30+', label: t.global.stats.languages, color: 'text-[#06B6D4]' },
            { val: '$2.5B+', label: t.global.stats.sales, color: 'text-[#10B981]' },
            { val: '5s', label: t.global.stats.switching, color: 'text-[#06B6D4]' }
          ].map((stat, idx) => (
             <div 
               key={idx}
               className={`flex flex-col items-center justify-center p-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
               style={{ transitionDelay: `${400 + idx * 100}ms` }}
             >
               <span className={`text-5xl font-black mb-2 ${stat.color}`}>{stat.val}</span>
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
             </div>
          ))}
        </div>

        <div className="relative py-10 space-y-6">
           <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#F8FAFC] to-transparent z-20 pointer-events-none" />

           <div className="marquee-row overflow-hidden w-full">
             <div className="marquee-inner flex gap-6 w-max animate-scroll-left py-2">
               {[...languagesRow1, ...languagesRow1, ...languagesRow1].map((lang, idx) => (
                 <div 
                   key={`r1-${idx}`}
                   className="group flex flex-col items-center justify-center w-[160px] h-[120px] bg-white/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 hover:bg-white hover:border-cyan-500/50 transition-all duration-300 cursor-default"
                 >
                   <img 
                     src={`https://flagcdn.com/w80/${lang.flagCode}.png`}
                     alt={lang.name}
                     className="w-12 h-12 rounded-full object-cover shadow-md mb-3 group-hover:scale-110 transition-transform duration-300"
                   />
                   <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wide">{lang.name}</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="marquee-row overflow-hidden w-full">
             <div className="marquee-inner flex gap-6 w-max animate-scroll-right py-2">
               {[...languagesRow2, ...languagesRow2, ...languagesRow2].map((lang, idx) => (
                 <div 
                   key={`r2-${idx}`}
                   className="group flex flex-col items-center justify-center w-[160px] h-[120px] bg-white/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 hover:bg-white hover:border-cyan-500/50 transition-all duration-300 cursor-default"
                 >
                   <img 
                     src={`https://flagcdn.com/w80/${lang.flagCode}.png`}
                     alt={lang.name}
                     className="w-12 h-12 rounded-full object-cover shadow-md mb-3 group-hover:scale-110 transition-transform duration-300"
                   />
                   <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wide">{lang.name}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        <div 
          className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
           <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
             {t.global.bottom_text}
           </p>
        </div>
      </div>
    </section>
  );
};

export default GlobalReachSection;
