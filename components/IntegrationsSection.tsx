
import React from 'react';

const styles = `
  @keyframes scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scroll-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  @keyframes pulse-radial {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.5); opacity: 0.1; }
  }
  .animate-scroll-left {
    animation: scroll-left 40s linear infinite;
  }
  .animate-scroll-right {
    animation: scroll-right 45s linear infinite;
  }
  .animate-pulse-radial {
    animation: pulse-radial 8s ease-in-out infinite;
  }
  .marquee-container:hover .marquee-inner {
    animation-play-state: paused;
  }
`;

// --- Data: Tech Ecosystem (App Icons) ---
const techApps = [
  { 
    name: 'HubSpot', 
    color: 'bg-orange-500', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> 
  }, // Abstract Sprocket
  { 
    name: 'Salesforce', 
    color: 'bg-blue-500', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg> 
  }, // Cloud
  { 
    name: 'WhatsApp', 
    color: 'bg-green-500', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16.75 13.96c.25.13.68.2.3.74-.06.09-.37.28-.7.59-.52.5-1.52.53-2.8-.26-2.1-1.3-3.5-3.7-3.8-4.25-.26-.51-.54-.48-1.5-.7-.56-.13-.9-.5-1.36-.73-.8-.4-1.46-.58-1.76-.06-.4.67-1.03 1.46-1.23 1.7-.15.18-.33.16-.6-.06-.43-.34-1.95-.72-3.73-2.3-1.38-1.22-2.3-2.73-2.58-3.2-.2-.33-.02-.5.14-.64.14-.13.3-.33.45-.5.15-.16.2-.27.3-.45.1-.18.05-.34-.02-.48-.08-.14-.7-1.68-.96-2.3-.25-.62-.5-.54-.68-.54-.18 0-.4-.02-.6 0-.2 0-.54.08-.82.38-.28.3-1.08 1.06-1.08 2.58 0 1.52 1.1 2.98 1.25 3.18.15.2 2.18 3.32 5.28 4.66 3.1 1.34 3.1 1.34 4.2 1.22 1.1-.12 2.65-1.08 3.02-2.13.38-1.05.38-1.95.27-2.13-.1-.18-.4-.28-.65-.4z"/></svg> 
  }, // Phone
  { 
    name: 'Google Sheets', 
    color: 'bg-green-600', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg> 
  }, // Grid
  { 
    name: 'Zapier', 
    color: 'bg-orange-600', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> 
  }, // Bolt
  { 
    name: 'Calendly', 
    color: 'bg-blue-400', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/></svg> 
  }, // Calendar
  { 
    name: 'Slack', 
    color: 'bg-purple-500', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg> 
  }, // Chat
  { 
    name: 'Property Finder', 
    color: 'bg-red-500', 
    icon: <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> 
  } // House
];

// --- Data: Languages (Flag Pills) ---
const languages = [
  { name: 'Arabic (Khaleeji)', flag: '🇦🇪' },
  { name: 'Arabic (Darija)', flag: '🇲🇦' },
  { name: 'English (US)', flag: '🇺🇸' },
  { name: 'English (UK)', flag: '🇬🇧' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Mandarin', flag: '🇨🇳' },
  { name: 'Russian', flag: '🇷🇺' },
  { name: 'Portuguese', flag: '🇵🇹' },
  { name: 'Hindi', flag: '🇮🇳' },
];

const IntegrationsSection: React.FC = () => {
  return (
    <section 
      className="relative w-full py-32 px-4 overflow-hidden bg-transparent"
    >
      <style>{styles}</style>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* --- ROW 1: Tech Ecosystem --- */}
        <div>
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Seamless Integration With Your Favorite Tools.
              </h2>
           </div>

           <div className="marquee-container w-full overflow-hidden relative">
             {/* Side Fades */}
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none" />
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none" />

             <div className="marquee-inner flex gap-8 w-max animate-scroll-left py-4">
               {[...techApps, ...techApps, ...techApps].map((app, idx) => (
                 <div 
                   key={`app-${idx}`}
                   className="group w-[100px] h-[100px] flex flex-col items-center justify-center bg-[#0F172A]/60 backdrop-blur-md border border-slate-800 rounded-2xl transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] cursor-pointer relative overflow-hidden"
                 >
                   <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${app.color}`} />
                   <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center shadow-lg mb-2 transform group-hover:scale-110 transition-transform`}>
                      {app.icon}
                   </div>
                   <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">{app.name}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* --- ROW 2: Global Voice --- */}
        <div>
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Fluent in 30+ Languages & Dialects.
              </h2>
           </div>

           <div className="marquee-container w-full overflow-hidden relative">
             {/* Side Fades */}
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none" />
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none" />

             <div className="marquee-inner flex gap-6 w-max animate-scroll-right py-4">
               {[...languages, ...languages, ...languages].map((lang, idx) => (
                 <div 
                   key={`lang-${idx}`}
                   className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-default"
                 >
                   <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                     {lang.flag}
                   </div>
                   <span className="text-sm font-bold text-white tracking-wide">{lang.name}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default IntegrationsSection;
