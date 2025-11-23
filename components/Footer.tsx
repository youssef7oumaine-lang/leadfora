
import React from 'react';

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
    <footer className="relative w-full pt-20 pb-10 overflow-hidden border-t border-white/10 bg-[#0F172A]">
      <style>{styles}</style>

      {/* Radial Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[150%] h-[100%] bg-cyan-500 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* --- Main 2-Column Layout --- */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Left Side: Brand Identity */}
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">LeadFora</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              The AI-powered engine for modern Real Estate.
            </p>
            <div className="flex items-center gap-2 pt-2">
               <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-mono text-emerald-400">System Operational</span>
            </div>
          </div>

          {/* Right Side: Navigation & Contact */}
          <div className="flex flex-col md:items-end gap-6">
            
            {/* Functional Nav Links */}
            <nav className="flex flex-col md:flex-row gap-6 md:gap-8">
              <a 
                href="#" 
                onClick={(e) => handleScrollTo(e, 'home')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Home
              </a>
              <a 
                href="#services" 
                onClick={(e) => handleScrollTo(e, 'services')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Services
              </a>
              <a 
                href="#integrations" 
                onClick={(e) => handleScrollTo(e, 'integrations')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Integrations
              </a>
              <a 
                href="#languages" 
                onClick={(e) => handleScrollTo(e, 'languages')}
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Languages
              </a>
            </nav>

            {/* Contact Email */}
            <div className="md:text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Contact Us</p>
              <a href="mailto:hello@leadfora.com" className="text-lg font-medium text-white hover:text-cyan-400 transition-colors">
                hello@leadfora.com
              </a>
            </div>
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} LeadFora AI Inc. All rights reserved.
          </p>

          <div className="flex gap-6">
            <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
