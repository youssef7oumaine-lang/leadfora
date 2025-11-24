
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
  const [chatMode, setChatMode] = useState<'chat' | 'voice'>('chat');
  const [leadData, setLeadData] = useState<{name: string} | null>(null);

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

  const handleFormSuccess = (data?: {name: string}) => {
    if (data) setLeadData(data);
    setIsModalOpen(false);
    setChatMode('voice');
    setIsChatOpen(true);
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
        mode={chatMode}
        setMode={setChatMode}
        leadData={leadData}
      />
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={handleFormSuccess}
      />
    </main>
  );
};

export default App;
