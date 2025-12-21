import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenModal: () => void;
  onToggleChat: () => void;
  currentPage: 'home' | 'price';
  onNavigate: (page: 'home' | 'price') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenModal, onToggleChat, currentPage, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const lastScrollY = useRef(0);
  const { t, language, setLanguage, isRTL } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flagCode: 'gb' },
    { code: 'ar', label: 'العربية', flagCode: 'sa' },
    { code: 'fr', label: 'Français', flagCode: 'fr' },
    { code: 'es', label: 'Español', flagCode: 'es' },
  ];

  // Scroll Handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle visibility (hide on scroll down)
      if (currentScrollY < 0) return;
      
      // Only hide if mobile menu is NOT open
      if (!isMobileMenuOpen) {
          if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
      }
      
      lastScrollY.current = currentScrollY;
      setIsTop(currentScrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Lock Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open
    
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate('price');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLang = languages.find(l => l.code === language);
  
  // Force background when on Pricing page or scrolled or Mobile Menu is open
  const isScrolled = !isTop || currentPage === 'price' || isMobileMenuOpen;

  return (
    <>
    {/* Explicit Mobile Font Fix */}
    <style>{`
      @media (max-width: 768px) {
        .logo-font-fix {
          font-family: 'Negan_DEMO', sans-serif !important;
          font-weight: 400 !important;
        }
      }
    `}</style>

    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 h-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(15, 23, 42, 0.05)' : 'none'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between relative z-50">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer text-slate-900 z-50"
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
          }}
        >
           <h1 className="logo-font-fix text-3xl font-['Negan_DEMO'] tracking-widest uppercase">WOLFZ AI</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" onClick={handleHomeClick} className={`text-sm font-medium transition-colors hover:text-cyan-500 ${currentPage === 'home' ? 'text-cyan-600 font-bold' : 'text-slate-900'}`}>
            {t.navbar.home}
          </a>
          <a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.services}
          </a>
          <a href="#integrations" onClick={(e) => handleScrollTo(e, 'integrations')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.integrations}
          </a>
          <a href="#pricing" onClick={handlePricingClick} className={`text-sm font-medium transition-colors hover:text-cyan-500 ${currentPage === 'price' ? 'text-cyan-600 font-bold' : 'text-slate-900'}`}>
            {t.navbar.pricing}
          </a>
          <a href="#languages" onClick={(e) => handleScrollTo(e, 'languages')} className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900">
            {t.navbar.languages}
          </a>
          
          <button 
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 ${
              !isScrolled 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#00FF41]' 
                : 'text-slate-900 hover:text-cyan-600'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-4 h-4 ${!isScrolled ? 'text-[#00D9FF]' : 'text-slate-900 group-hover:text-cyan-600'}`}
            >
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
            </svg>
            {t.navbar.ask_ai}
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4 z-50">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`
                flex items-center gap-2 pr-2 md:pr-3 pl-2 py-2 rounded-full border transition-all duration-300 group
                bg-transparent border-slate-200 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-slate-50
              `}
            >
              <img 
                src={`https://flagcdn.com/w40/${currentLang?.flagCode}.png`}
                alt={currentLang?.label}
                className="w-5 h-5 rounded-full object-cover shadow-sm"
              />
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''} text-slate-900 group-hover:text-cyan-500 hidden md:block`} 
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

          {/* CTA Button */}
          <button
            onClick={onOpenModal}
            className="hidden md:block px-6 py-2.5 rounded-full font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 15px rgba(0, 255, 65, 0.4)'
            }}
          >
            {t.navbar.get_demo}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 top-0 z-40 bg-slate-950/95 backdrop-blur-xl md:hidden flex flex-col pt-24 px-6"
        >
          <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center pb-20">
            {[
              { label: t.navbar.home, onClick: handleHomeClick, active: currentPage === 'home' },
              { label: t.navbar.services, onClick: (e: any) => handleScrollTo(e, 'services'), active: false },
              { label: t.navbar.integrations, onClick: (e: any) => handleScrollTo(e, 'integrations'), active: false },
              { label: t.navbar.pricing, onClick: handlePricingClick, active: currentPage === 'price' },
              { label: t.navbar.languages, onClick: (e: any) => handleScrollTo(e, 'languages'), active: false },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href="#"
                onClick={item.onClick}
                className={`text-2xl font-bold transition-all duration-300 ${
                  item.active 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400'
                    : 'text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-400 hover:to-emerald-400'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col items-center gap-6 w-full"
            >
              {/* Mobile Ask AI Button */}
               <button 
                onClick={() => {
                  onToggleChat();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-lg font-bold text-cyan-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                </svg>
                {t.navbar.ask_ai}
              </button>

              {/* Mobile CTA Button */}
              <button
                onClick={() => {
                  onOpenModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full max-w-xs px-8 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
                }}
              >
                {t.navbar.get_demo}
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;