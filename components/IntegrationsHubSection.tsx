
import React from 'react';
import { useTranslation } from '../LanguageContext';

interface IntegrationsHubSectionProps {
  id?: string;
}

const icons = {
  hubspot: (
    <svg viewBox="0 0 24 24" fill="#ff7a59">
      <path d="M21.2 13.2c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zM12.7 12.3c-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4 3.4-1.5 3.4-3.4-1.5-3.4-3.4-3.4zM4.2 11.9c-2 0-3.7 1.7-3.7 3.7s1.7 3.7 3.7 3.7 3.7-1.7 3.7-3.7-1.7-3.7-3.7-3.7zM12.7 4.1c-3.6 0-6.5 2.9-6.5 6.5 0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5c0-3.6-2.9-6.5-6.5-6.5z"/>
    </svg>
  ),
  salesforce: (
    <svg viewBox="0 0 24 24" fill="#00A1E0">
      <path d="M16.1 9c.1-.8.2-1.7.2-2.5C16.3 2.9 13.4 0 9.8 0 6.5 0 3.7 2.5 3.3 5.7c-.1 0-.2.1-.3.1C1.3 5.9 0 7.2 0 8.8c0 1.6 1.3 3 3 3h13c2.2 0 4-1.8 4-4s-1.8-4-3.9-4z"/>
    </svg>
  ),
  zoho: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h4v4H4V4zm6 6h4v4h-4v-4zm6 6h4v4h-4v-4zM4 14h4v4H4v-4zm12-4h4v4h-4v-4zM10 4h4v4h-4V4z" />
    </svg>
  ),
  pipedrive: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 5v14l6 3V2L2 5zm17 2h-9v10h9c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-2 6h-5v-2h5v2z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  zapier: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
};

const integrations = [
  { id: 'hubspot', name: 'HubSpot', color: 'text-[#FF7A59]', icon: icons.hubspot, latency: '24ms', type: '2-Way Sync' },
  { id: 'salesforce', name: 'Salesforce', color: 'text-[#00A1E0]', icon: icons.salesforce, latency: '18ms', type: 'Enterprise API' },
  { id: 'zoho', name: 'Zoho CRM', color: 'text-[#F0453D]', icon: icons.zoho, latency: '32ms', type: 'REST Hook' },
  { id: 'pipedrive', name: 'Pipedrive', color: 'text-[#26292C]', icon: icons.pipedrive, latency: '28ms', type: 'v1.4 Sync' },
  { id: 'outlook', name: 'Outlook', color: 'text-[#0078D4]', icon: icons.outlook, latency: '45ms', type: 'Cal-Sync' },
  { id: 'google', name: 'Google Workspace', color: 'text-[#4285F4]', icon: icons.google, latency: '12ms', type: 'OAuth 2.0' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'text-[#25D366]', icon: icons.whatsapp, latency: '8ms', type: 'Real-time' },
  { id: 'zapier', name: 'Zapier', color: 'text-[#FF4F00]', icon: icons.zapier, latency: '150ms', type: 'Webhook' },
];

const IntegrationCard = ({ item }: { item: any }) => (
  <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-300 flex flex-col justify-between h-36 relative overflow-hidden group">
    <div className="flex justify-between items-start z-10">
      <div className={`w-8 h-8 ${item.color} transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:drop-shadow-md`}>
        {item.icon}
      </div>
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active</span>
      </div>
    </div>
    <div className="z-10">
      <h4 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h4>
      <div className="flex items-center gap-3 border-t border-slate-100 pt-2">
         <span className="font-mono text-[9px] text-slate-400">LAT: <span className="text-slate-600">{item.latency}</span></span>
         <span className="font-mono text-[9px] text-slate-400">TYPE: <span className="text-slate-600">{item.type}</span></span>
      </div>
    </div>
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent -translate-x-full group-hover:animate-[scan-fast_1.5s_linear_infinite]" />
  </div>
);

const IntegrationsHubSection: React.FC<IntegrationsHubSectionProps> = () => {
  const { t, isRTL } = useTranslation();

  return (
    <section 
      id="integrations" 
      className="relative w-full py-28 bg-[#F8FAFC] scroll-mt-28"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{`
        @keyframes scan-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pipeline-flow {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
      
      <div className="relative max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t.integrations.headline}
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {t.integrations.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <IntegrationCard item={integrations[0]} />
          <IntegrationCard item={integrations[1]} />
          <IntegrationCard item={integrations[2]} />
          <IntegrationCard item={integrations[3]} />
          <IntegrationCard item={integrations[4]} />
          
          <div className="col-span-2 row-span-2 bg-white rounded-2xl border-2 border-slate-200 relative overflow-hidden shadow-xl flex flex-col items-center justify-center group">
            <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 transition-colors duration-500 rounded-2xl pointer-events-none z-20"></div>
            <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }}
            />
            <div className="relative z-10 flex flex-col items-center text-center p-8 w-full">
               <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">{t.integrations.engine_label}</h3>
               <div className="w-full max-w-[240px] h-16 relative flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center z-10">
                     <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                  </div>
                  <div className="absolute left-6 right-6 top-1/2 h-[2px] bg-slate-100 -z-0">
                     <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-[pipeline-flow_2s_linear_infinite]" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center z-10">
                     <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
               </div>
               <div className="px-4 py-2 bg-cyan-500/5 rounded-full border border-cyan-500/10">
                  <span className="text-sm font-bold text-cyan-500 tracking-wide">{t.integrations.zero_entry}</span>
               </div>
            </div>
          </div>

          <IntegrationCard item={integrations[5]} />
          <IntegrationCard item={integrations[6]} />
          <IntegrationCard item={integrations[7]} />
        </div>
      </div>
    </section>
  );
};

export default IntegrationsHubSection;
