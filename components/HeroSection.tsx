
import React from 'react';
import { useTranslation } from '../LanguageContext';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const { t, isRTL } = useTranslation();

  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #F8FAFC 0%, #E2E8F0 100%)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 z-0 w-full h-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
          <iframe 
            src="https://my.spline.design/nexbotrobotcharacterconcept-ttHpNRASgXnCFBdblF6dSka2/" 
            frameBorder="0" 
            width="100%" 
            height="100%" 
            className="w-full h-full object-cover"
            title="3D Robot Background"
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-[900px] mt-12 space-y-8">
        
        <h1 
          className="font-bold text-white leading-tight tracking-tight whitespace-pre-line"
          style={{ 
            fontSize: '3rem', 
            textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
          }}
        >
          {t.hero.headline}
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
