
import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import LeadCaptureModal from './components/LeadCaptureModal';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DatabaseReactivationSection from './components/DatabaseReactivationSection';
import IntegrationsHubSection from './components/IntegrationsHubSection';
import GlobalReachSection from './components/GlobalReachSection';
import SmartSalesBotSection from './components/SmartSalesBotSection';
import PricePage from './components/PricePage';
import ChatBotWidget from './components/ChatBotWidget';
import Footer from './components/Footer';
import { LanguageProvider } from './LanguageContext';

const AppContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'price'>('home');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen font-sans">
      <Navbar 
        onOpenModal={handleOpenModal} 
        onToggleChat={toggleChat}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {currentPage === 'home' ? (
        <>
          <HeroSection onOpenModal={handleOpenModal} />
          <ProblemSection onOpenModal={handleOpenModal} />
          <SolutionSection onOpenModal={handleOpenModal} />
          <DatabaseReactivationSection onOpenModal={handleOpenModal} />
          <IntegrationsHubSection />
          <GlobalReachSection onOpenModal={handleOpenModal} />
          <SmartSalesBotSection 
            onOpenModal={handleOpenModal} 
            onToggleChat={toggleChat}
          />
        </>
      ) : (
        <PricePage onOpenModal={handleOpenModal} />
      )}
      
      <Footer 
        onOpenModal={handleOpenModal} 
        onToggleChat={toggleChat}
        onNavigate={setCurrentPage}
      />
      <ChatBotWidget 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        onOpenModal={handleOpenModal}
      />
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
