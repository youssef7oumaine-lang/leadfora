
import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- Mock Data Generators ---

const generateLog = () => {
  const actions = [
    { icon: "📞", text: "Incoming Call (Dubai Marina)", color: "text-cyan-400" },
    { icon: "🎤", text: "AI Greeting Played (English)", color: "text-emerald-400" },
    { icon: "❓", text: "Q1: Budget Asked (< 5s)", color: "text-emerald-400" },
    { icon: "📝", text: "Lead Responded ($500K-$1M)", color: "text-cyan-400" },
    { icon: "📍", text: "Location Captured (JBR)", color: "text-cyan-400" },
    { icon: "✅", text: "Lead Qualified (98%)", color: "text-emerald-400" },
    { icon: "📅", text: "Meeting Booked (10am)", color: "text-amber-400" },
    { icon: "📧", text: "SMS Sent + Calendar Upd.", color: "text-emerald-400" },
    { icon: "⏱️", text: "Call Duration: 47s", color: "text-purple-400" },
  ];
  return {
    ...actions[Math.floor(Math.random() * actions.length)],
    id: Date.now(),
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
  };
};

// --- Sub-Components ---

const MetricCard = ({ label, value, color, glowColor, subtext }: any) => (
  <div className="relative overflow-hidden bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 flex justify-between items-center group hover:bg-cyan-500/10 transition-colors duration-300 h-full w-full">
    <div className="flex flex-col justify-center">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse shadow-[0_0_8px_${glowColor}]`} />
        <span className={`text-xl font-bold font-mono ${color} drop-shadow-[0_0_10px_${glowColor}]`}>
          {value}
        </span>
      </div>
    </div>
    {subtext && <span className="text-xs font-mono text-slate-500 self-end mb-1">{subtext}</span>}
  </div>
);

const LiveDashboard: React.FC = () => {
  // --- State ---
  const [activeCalls, setActiveCalls] = useState(14);
  const [revenue, setRevenue] = useState(42500);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, time: '14:32:01', icon: '📞', text: 'System Initialized', color: 'text-cyan-400' },
    { id: 2, time: '14:32:05', icon: '✅', text: 'AI Agents Online', color: 'text-emerald-400' }
  ]);
  const [chartPoints, setChartPoints] = useState([10, 15, 12, 20, 25, 35, 30, 45, 50, 48, 55, 60]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // 1. Active Calls Fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls(prev => Math.max(8, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 2. Revenue Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 500) + 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 3. Logs Feed
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs(prev => {
        const updated = [...prev, newLog];
        if (updated.length > 15) updated.shift(); // Keep history manageable
        return updated;
      });
      
      // Auto-scroll to bottom
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  // 4. Chart Growth
  useEffect(() => {
    const interval = setInterval(() => {
      setChartPoints(prev => {
        const nextVal = prev[prev.length - 1] + (Math.random() * 10 - 3);
        const newPoints = [...prev.slice(1), Math.max(10, nextVal)];
        return newPoints;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- SVG Chart Logic ---
  const maxVal = Math.max(...chartPoints, 70);
  const points = chartPoints.map((val, i) => {
    const x = (i / (chartPoints.length - 1)) * 100;
    const y = 100 - (val / maxVal) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div 
      className="relative w-full max-w-[100vw] h-auto min-h-[600px] md:h-full md:min-h-[500px] bg-[#0F172A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform-gpu"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'subpixel-antialiased'
      }}
    >
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 animate-pulse" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 h-full p-4 md:p-8 gap-5 md:gap-8">
        
        {/* LEFT: Metrics (Stacked on Mobile, Column on Desktop) */}
        <div className="md:col-span-3 flex flex-col gap-3 md:gap-4 h-auto md:h-full md:justify-between shrink-0">
          <MetricCard 
            label="AVG RESPONSE"
            value="0.4s"
            color="text-emerald-400"
            glowColor="rgba(16,185,129,0.5)"
          />
          <MetricCard 
            label="ACTIVE CALLS"
            value={activeCalls}
            color="text-cyan-400"
            glowColor="rgba(6,182,212,0.5)"
            subtext="Global"
          />
          <MetricCard 
            label="REVENUE SAVED"
            value={`$${revenue.toLocaleString()}`}
            color="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400"
            glowColor="rgba(6,182,212,0.3)"
          />
        </div>

        {/* CENTER: System Logs (Scrollable, Fixed height on mobile) */}
        <div className="md:col-span-5 flex flex-col bg-[#0A0F1E] border border-cyan-500/20 rounded-xl overflow-hidden h-[300px] md:h-full">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-cyan-500/10 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest"> &gt; SYSTEM LOGS</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col justify-start gap-3 relative no-scrollbar">
             {/* Fade out top mask */}
             <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#0A0F1E] to-transparent z-10 pointer-events-none" />
             
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-[11px] font-mono animate-fade-in-up whitespace-nowrap overflow-hidden flex-shrink-0">
                <span className="opacity-50 text-slate-500 min-w-[50px]">[{log.time}]</span>
                <span className="text-lg leading-none">{log.icon}</span>
                <span className={`${log.color} opacity-90 truncate`}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Graph (Fixed height on mobile) */}
        <div className="md:col-span-4 flex flex-col bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6 relative overflow-hidden h-[250px] md:h-full">
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1"> &gt; LEAD VOLUME (24H)</div>
              <div className="text-3xl font-bold text-white">{Math.floor(chartPoints[chartPoints.length - 1])} <span className="text-sm font-normal text-slate-400">leads/hr</span></div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 w-full relative min-h-[100px]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area Fill */}
              <path 
                d={`M0,100 ${points} 100,100 Z`} 
                fill="url(#chartGradient)" 
                className="transition-all duration-1000 ease-linear"
              />
              {/* Stroke Line */}
              <path 
                d={`M0,100 ${points}`} 
                fill="none" 
                stroke="#06B6D4" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              />
            </svg>
            
            {/* Scanning Line Animation */}
            <div className="absolute top-0 right-0 h-full w-[1px] bg-white/50 shadow-[0_0_10px_white] animate-scan" />
          </div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
             <div className="w-full h-1/4 border-b border-cyan-500" />
             <div className="w-full h-1/4 border-b border-cyan-500 top-1/4 absolute" />
             <div className="w-full h-1/4 border-b border-cyan-500 top-2/4 absolute" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default LiveDashboard;
