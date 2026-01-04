
import React from 'react';
import { useTranslation } from '../LanguageContext';

interface FooterProps {
  onOpenModal?: () => void;
  onToggleChat?: () => void;
  onNavigate?: (page: 'home' | 'price') => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenModal, onToggleChat, onNavigate }) => {
  const { t, isRTL } = useTranslation();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate('home');
    
    // Allow state update then scroll
    setTimeout(() => {
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
    }, 100);
  };

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onNavigate) onNavigate('price');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onToggleChat) onToggleChat();
  };

  return (
    <footer 
      className="relative w-full pt-24 pb-12 overflow-hidden bg-[#0B1120]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-emerald-500/0 opacity-70" />
      
      {/* Bottom Center Glow */}
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* COLUMN 1: Brand Identity (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-white">
              <h2 className="text-3xl font-['Negan_DEMO'] tracking-widest uppercase text-white drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                WOLFZ AI
              </h2>
            </div>
            
            <p className="text-slate-400 text-base leading-relaxed max-w-sm font-light">
              {t.footer.desc}
            </p>

            {/* Glass Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider uppercase">
                {t.footer.operational}
              </span>
            </div>
          </div>

          {/* COLUMN 2: Explore (Span 3) - Merged Links */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2 inline-block">Explore</h4>
            <ul className="space-y-4">
               <li>
                  <a href="#home" onClick={(e) => handleScrollTo(e, 'home')} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1">
                      {t.navbar.home}
                  </a>
               </li>
               <li>
                  <a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1">
                      {t.navbar.services}
                  </a>
               </li>
               <li>
                  <a href="/pricing" onClick={handlePricingClick} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1">
                      {t.navbar.pricing}
                  </a>
               </li>
               <li>
                  <a href="#integrations" onClick={(e) => handleScrollTo(e, 'integrations')} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1">
                      {t.navbar.integrations}
                  </a>
               </li>
               <li>
                  <a href="#languages" onClick={(e) => handleScrollTo(e, 'languages')} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1">
                      {t.navbar.languages}
                  </a>
               </li>
               <li>
                  <a href="#chat" onClick={handleChatClick} className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-300 block hover:translate-x-1 flex items-center gap-2">
                      AI Sales Bot <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 rounded border border-cyan-500/30">NEW</span>
                  </a>
               </li>
            </ul>
          </div>

           {/* COLUMN 3: Connect (Span 4) */}
           <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 w-full lg:text-right border-b border-white/5 pb-2 lg:inline-block">
                Ready to Scale?
              </h4>
              
              <div className="flex flex-col items-start lg:items-end gap-6 w-full">
                {/* CTA Button with Pulse */}
                <button 
                  onClick={onOpenModal}
                  className="relative group flex items-center gap-2 px-8 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-bold text-sm transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1"
                >
                  <span className="absolute inset-0 rounded-lg border border-cyan-400 opacity-50 animate-pulse"></span>
                  <span className="relative z-10">Book a Demo</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-950/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 group">
                    {/* LinkedIn */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-950/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 group">
                    {/* X / Twitter */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
           </div>

        </div>

        {/* Bottom Bar - Ghost Links */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </p>

          <div className="flex gap-8">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-default select-none">{t.footer.privacy}</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-default select-none">{t.footer.terms}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
