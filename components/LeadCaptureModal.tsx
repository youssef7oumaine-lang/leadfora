import React, { useState, useEffect } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Reset form when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setFormState('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
    }, 1500);
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
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Calling you now...</h3>
            <p className="text-slate-500 font-medium">Watch your phone!</p>
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
                  placeholder="Full Name" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Email */}
              <div className="group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Phone Number */}
              <div className="group">
                <input 
                  type="tel" 
                  placeholder="Phone Number (+1 ...)" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border-2 border-transparent text-slate-900 placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full mt-2 py-3.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-[1.02] hover:brightness-110 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
                }}
              >
                {formState === 'submitting' ? 'CONNECTING...' : 'CALL ME NOW ⚡'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;