
import React from 'react';
import { useTranslation } from '../LanguageContext';

const styles = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.04; transform: scale(1); }
    50% { opacity: 0.08; transform: scale(1.1); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 10s ease-in-out infinite;
  }
`;

const Footer: React.FC = () => {
  const { t, isRTL } = useTranslation();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="relative w-full pt-20 pb-10 overflow-hidden border-t border-white/10 bg-[#0F172A]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{styles}</style>

      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[150%] h-[100%] bg-cyan-500 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-light tracking-wide text-white">
              Wolfz AI
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-2 pt-2">
               <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-mono text-emerald-400">{t.footer.operational}</span>
            </div>
          </div>

          <div className={`flex flex-col ${isRTL ? 'md:items-start' : 'md:items-end'} gap-6`}>
            
            <nav className="flex flex-col md:flex-row gap-6 md:gap-8">
              <a 
                href="#" 
                onClick={(e) => handleScrollTo(e, 'home')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {t.navbar.home}
              </a>
              <a 
                href="#services" 
                onClick={(e) => handleScrollTo(e, 'services')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {t.navbar.services}
              </a>
              <a 
                href="#integrations" 
                onClick={(e) => handleScrollTo(e, 'integrations')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {t.navbar.integrations}
              </a>
              <a 
                href="#languages" 
                onClick={(e) => handleScrollTo(e, 'languages')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {t.navbar.languages}
              </a>
            </nav>

            <div className={`${isRTL ? 'md:text-left' : 'md:text-right'}`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t.footer.contact}</p>
              <a href="mailto:ceo@wolfzai.com" className="text-lg font-medium text-white hover:text-cyan-400 transition-colors">
                ceo@wolfzai.com
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </p>

          <div className="flex gap-6">
            <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{t.footer.privacy}</span>
            <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{t.footer.terms}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
