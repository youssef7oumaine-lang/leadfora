
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onOpenModal: () => void;
  onToggleChat: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenModal, onToggleChat }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Prevent triggering on negative scroll (e.g. iOS bounce)
      if (currentScrollY < 0) return;

      // Hide if scrolling down and past the top area (50px buffer)
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        // Show if scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset calculation: Navbar height (80px) + Extra padding (20px) = 100px
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 h-20 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        background: window.scrollY < 50 ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: window.scrollY < 50 ? 'none' : 'blur(12px)',
        borderBottom: window.scrollY < 50 ? 'none' : '1px solid rgba(15, 23, 42, 0.05)'
      }}
    >
      {/* Container for Max Width and Centering */}
      <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo Text */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
           <h1 className={`font-extrabold text-2xl tracking-tight ${window.scrollY < 50 ? 'text-white' : 'text-slate-900'}`}>LeadFora</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#"
            onClick={handleHomeClick}
            className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900"
          >
            Home
          </a>
          {/* Scroll to Services Section */}
          <a 
            href="#services"
            onClick={(e) => handleScrollTo(e, 'services')}
            className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900"
          >
            Services
          </a>
          {/* Scroll to Integrations Section */}
          <a 
            href="#integrations"
            onClick={(e) => handleScrollTo(e, 'integrations')}
            className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900"
          >
            Integrations
          </a>
          {/* Scroll to Languages Section */}
          <a 
            href="#languages"
            onClick={(e) => handleScrollTo(e, 'languages')}
            className="text-sm font-medium transition-colors hover:text-cyan-500 text-slate-900"
          >
            Languages
          </a>
          
          <button 
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 ${window.scrollY < 50 ? 'text-cyan-300' : 'text-cyan-600'}`}
            style={{ textShadow: window.scrollY < 50 ? '0 0 10px rgba(6,182,212,0.5)' : 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
            </svg>
            Ask AI
          </button>
        </div>

        {/* Navbar CTA Button */}
        <button
          onClick={onOpenModal}
          className="px-10 py-2.5 rounded-full font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
            boxShadow: '0 0 15px rgba(0, 255, 65, 0.4)'
          }}
        >
          GET DEMO
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
