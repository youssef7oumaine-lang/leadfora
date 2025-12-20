
import React from 'react';
import { useTranslation } from '../LanguageContext';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const { t, isRTL } = useTranslation();
  
  // Split headline to control line spacing precisely
  const headlines = t.hero.headline.split('\n');

  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(to bottom, #F8FAFC 0%, #E2E8F0 100%)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mt-12 -translate-y-14 space-y-8">
        
        <h1 
          className="font-bold text-slate-900 tracking-tight"
        >
          {headlines.map((line, index) => (
            <span 
              key={index} 
              className={`block text-3xl md:text-5xl leading-tight ${index > 0 ? 'mt-2 md:mt-4' : ''}`}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="pt-4">
          <button
            onClick={onOpenModal}
            className="px-12 py-2.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 25px rgba(0, 255, 65, 0.6)'
            }}
          >
            {t.hero.cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
