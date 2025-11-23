
import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import LeadCaptureModal from './components/LeadCaptureModal';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import DatabaseReactivationSection from './components/DatabaseReactivationSection';
import IntegrationsHubSection from './components/IntegrationsHubSection';
import GlobalReachSection from './components/GlobalReachSection';
import ChatBotWidget from './components/ChatBotWidget';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
    <main className="bg-[#F8FAFC] min-h-screen">
      <Navbar 
        onOpenModal={handleOpenModal} 
        onToggleChat={toggleChat}
      />
      
      <HeroSection onOpenModal={handleOpenModal} />
      <ProblemSection onOpenModal={handleOpenModal} />
      <SolutionSection onOpenModal={handleOpenModal} />
      <DatabaseReactivationSection onOpenModal={handleOpenModal} />
      <IntegrationsHubSection />
      <GlobalReachSection onOpenModal={handleOpenModal} />
      
      <Footer />
      <ChatBotWidget 
        onOpenModal={handleOpenModal} 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
      <LeadCaptureModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
};

export default App;