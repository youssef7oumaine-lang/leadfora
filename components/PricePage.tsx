
import React from 'react';
import PricingSection from './PricingSection';

interface PricePageProps {
  onOpenModal: () => void;
}

const PricePage: React.FC<PricePageProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-20 min-h-screen bg-[#F8FAFC]">
      <PricingSection onOpenModal={onOpenModal} />
    </div>
  );
};

export default PricePage;
