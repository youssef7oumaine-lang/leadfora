
import React, { useState, useEffect } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Reset form when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setFormState('idle');
      setErrorMessage('');
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://mistakable-danyell-limpidly.ngrok-free.dev/webhook/187f55c9-e245-44de-90d0-779b073c86f8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: "LeadFora Website",
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Trigger immediate success flow if callback provided
        if (onSuccess) {
            onSuccess();
            // Quiet reset
            setFormState('idle');
            setFormData({ name: '', email: '', phone: '' });
            return; 
        }

        setFormState('success');
        // Clear form data
        setFormData({ name: '', email: '', phone: '' });
        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setFormState('error');
      setErrorMessage('Connection failed, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Dark Blurred Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{
          backdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.4)'
        }}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-md bg-[#F8FAFC] rounded-2xl p-8 transform transition-all duration-300 ease-out scale-100 opacity-100 shadow-2xl"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-slate-800 transition-colors focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {formState === 'success' ? (
          // Success State
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-green-400 rounded-full opacity-20 animate-ping"></div>
              <div className="relative bg-gradient-to-r from-[#00D9FF] to-[#00FF41] rounded-full p-5 text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Received!</h3>
            <p className="text-slate-500 font-medium">Our AI agent will call you shortly.</p>
          </div>
        ) : (
          // Form State
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Experience the Speed.</h2>
              <p className="text-gray-500 mt-2 text-sm font-medium">Enter your number. Our AI Agent will call you in exactly 30 seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Email */}
              <div className="group">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Phone Number */}
              <div className="group">
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number (+1 ...)" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Error Message */}
              {formState === 'error' && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full mt-2 py-3.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-[1.02] hover:brightness-110 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
                }}
              >
                {formState === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'CALL ME NOW ⚡'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
