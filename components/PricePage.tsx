
import React from 'react';
import PricingSection from './PricingSection';

interface PricePageProps {
  onOpenModal: () => void;
}

const PricePage: React.FC<PricePageProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-20 min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Cyan Dot Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ 
            backgroundImage: 'radial-gradient(#06b6d4 1.5px, transparent 1.5px)', 
            backgroundSize: '24px 24px' 
        }} 
      />
      
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

      <PricingSection onOpenModal={onOpenModal} />
    </div>
  );
};

export default PricePage;
