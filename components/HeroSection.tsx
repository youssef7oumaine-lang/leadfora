import React from 'react';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #F8FAFC 0%, #E2E8F0 100%)'
      }}
    >
      {/* 3D Spline Background Layer - Scaled to crop watermark */}
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

      {/* Foreground Content Layer */}
      {/* Adjusted vertical positioning: mt-12 moves content UP by ~48px */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-[900px] mt-12 space-y-8">
        
        {/* Headline */}
        <h1 
          className="font-bold text-white leading-tight tracking-tight"
          style={{ 
            fontSize: '3rem', 
            textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
          }}
        >
          A 24/7 AI Agent That Never Misses a Lead<br />
          100% Qualification Consistency
        </h1>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            onClick={onOpenModal}
            className="px-12 py-2.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 25px rgba(0, 255, 65, 0.6)'
            }}
          >
            TEST OUR AI NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;