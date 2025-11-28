
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../LanguageContext';

interface NavbarProps {
  onOpenModal: () => void;
  onToggleChat: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenModal, onToggleChat }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const lastScrollY = useRef(0);
  const { t, language, setLanguage, isRTL } = useTranslation();

  // Updated structure with country codes for flags
  const languages = [
    { code: 'en', label: 'English', flagCode: 'gb' },
    { code: 'ar', label: 'العربية', flagCode: 'sa' },
    { code: 'fr', label: 'Français', flagCode: 'fr' },
    { code: 'es', label: 'Español', flagCode: 'es' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle visibility (hide on scroll down)
      if (currentScrollY < 0) return;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;

      // Handle Top/Scrolled state
      setIsTop(currentScrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 h-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        background: isTop ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: isTop ? 'none' : 'blur(12px)',
        borderBottom: isTop ? 'none' : '1px solid rgba(15, 23, 42, 0.05)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo Text - Minimalist Luxury Update (Dark Text Forced) */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
           <h1 className="text-2xl font-light tracking-wide flex items-center gap-1.5 transition-colors duration-300 text-slate-900">
             <span>Wolfz</span>
             <span>AI</span>
           </h1>
        </div>

        {/* Navigation Links - Dark Text Forced */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" onClick={handleHomeClick} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.home}
          </a>
          <a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.services}
          </a>
          <a href="#integrations" onClick={(e) => handleScrollTo(e, 'integrations')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.integrations}
          </a>
          <a href="#languages" onClick={(e) => handleScrollTo(e, 'languages')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.languages}
          </a>
          
          <button 
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 ${
              isTop 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#00FF41]' 
                : 'text-slate-900 hover:text-cyan-600'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-4 h-4 ${isTop ? 'text-[#00D9FF]' : 'text-slate-900 group-hover:text-cyan-600'}`}
            >
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
            </svg>
            {t.navbar.ask_ai}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher - Refined Flag Style (Dark Text Forced) */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`
                flex items-center gap-2 pr-3 pl-2 py-2 rounded-full border transition-all duration-300 group
                bg-transparent border-slate-200 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-slate-50
              `}
            >
              <img 
                src={`https://flagcdn.com/w40/${currentLang?.flagCode}.png`}
                alt={currentLang?.label}
                className="w-5 h-5 rounded-full object-cover shadow-sm"
              />
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''} text-slate-900 group-hover:text-cyan-500`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLangMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-3 w-44 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up origin-top-right z-50"
                onMouseLeave={() => setIsLangMenuOpen(false)}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all hover:bg-slate-50 ${language === lang.code ? 'bg-cyan-50 text-cyan-700' : 'text-slate-700'}`}
                  >
                    <img 
                      src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                      alt={lang.label}
                      className="w-5 h-5 rounded-full object-cover shadow-sm"
                    />
                    <span className="group-hover:text-cyan-600 transition-colors">
                      {lang.label}
                    </span>
                    {language === lang.code && (
                       <svg className="w-4 h-4 text-cyan-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button - Preserved Gradient */}
          <button
            onClick={onOpenModal}
            className="px-6 py-2.5 rounded-full font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 15px rgba(0, 255, 65, 0.4)'
            }}
          >
            {t.navbar.get_demo}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
