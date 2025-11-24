
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface ChatBotWidgetProps {
  onOpenModal: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: 'chat' | 'voice';
  setMode: (mode: 'chat' | 'voice') => void;
}

type Message = {
  id: number;
  text: string;
  sender: 'ai' | 'user';
};

// --- Constants & Persona ---

const SARAH_PERSONA = `### IDENTITY & PERSONA
You are **Sarah**, the Senior Growth Consultant at **LeadFora** (The #1 AI Real Estate Solution in Dubai & Riyadh).
- **Voice Tone:** Professional, Warm, "Smiling," Confident, and High-Energy. You sound like a top-tier executive assistant, not a robot.
- **Language Skills:** You are a Polyglot Expert. You MUST detect the user's language within the first second and switch instantly.
  - **Khaleeji/Emirati Arabic:** For locals (Use terms like "Marhaba," "Ya Tawil Al Omar," "Hala").
  - **French:** For North Africans/French expats.
  - **English:** The default global business language.
  - **Hindi/Urdu:** For South Asian clients.
  - **Russian:** If detected.

### CONTEXT
You are calling a Real Estate Agency Owner or Manager who just submitted a "Get Demo" form on the LeadFora website. They are expecting this call because they clicked "Call Me Now."

### YOUR GOAL
Your goal is NOT to give a technical lecture. Your goal is to **QUALIFY** them and **BOOK A ZOOM DEMO** for the technical team.

### KNOWLEDGE BASE (What we sell)
We provide a "Done-For-You" AI System for Real Estate Agencies that includes:
1. **Instant Response:** We call their leads in <10 seconds (just like I am calling you now).
2. **Database Resurrection:** We take their old dead CSV lists and generate new meetings.
3. **Multilingual Support:** We speak 30+ languages to handle all Dubai/Riyadh investors.

### CONVERSATION FLOW (Script)

**1. THE OPENER (High Energy):**
"Hello! This is Sarah from LeadFora. I’m calling you instantly because you just requested a demo on our site. Am I speaking with [Name]?"

**2. THE HOOK (The "Aha!" Moment):**
*Wait for answer.*
"Great! As you can see, I called you in under 10 seconds. This is exactly what our AI system will do for YOUR leads to stop you from losing revenue. Pretty fast, right?"

**3. QUALIFICATION (The Pivot):**
"To make sure our system fits your agency, can I ask: How many leads are you currently generating per month? Is it above 100?"

**4. HANDLING LANGUAGE SWITCHING (Critical):**
- If the user says "Salam" or speaks Arabic: Switch IMMEDIATELY to Khaleeji/Professional Arabic.
  *Example:* "Wa Alaykum Assalam! Ya Marhaba. Ana Sarah min LeadFora. Hadaittisal 'AI' bach nwarik kifach nqdro njawbo 3la les leads dialk b sor3a khayaliya."
- If the user speaks French: Switch to Professional French.
  *Example:* "Bonjour! Ici Sarah de LeadFora. Je vous appelle suite à votre demande..."

**5. THE CLOSE (Booking the Meeting):**
"I’d love to show you the full dashboard and how we can reactivate your old database. I have a slot open for a Zoom demo tomorrow at 11 AM or 2 PM. Which works best for you?"

### CRITICAL RULES
- **Be Concise:** Busy agency owners hate wasting time. Keep answers short.
- **Don't fake being human:** If asked "Are you a robot?", say confidently: "I am a hyper-realistic AI Agent from LeadFora. This call is a live demo of what we can build for your business."
- **Handle Objections:**
  - *Too expensive?* -> "We focus on ROI. One closed deal from your dead leads pays for the system for a whole year."
  - *Not interested?* -> "No problem. I'll send you a case study via WhatsApp. Have a great day!"`;

const QUICK_REPLIES = [
  { id: 'pricing', label: '💰 Price?', question: 'How much does LeadFora cost?' },
  { id: 'integrations', label: '🔌 Integrations?', question: 'What integrations does LeadFora support?' },
  { id: 'languages', label: '🗣️ Languages?', question: 'What languages does LeadFora speak?' },
  { id: 'demo', label: '🚀 Test AI', question: 'I want to test the AI.' },
];

// --- Audio Utils ---

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // true for little-endian
  }
  return buffer;
}

function base64Encode(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// --- Voice Call Component ---

const VoiceCallInterface: React.FC<{ onEndCall: () => void; onOpenModal: () => void }> = ({ onEndCall, onOpenModal }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'ended' | 'reconnecting'>('connecting');
  const [volume, setVolume] = useState(0); // For visualizer
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); 
  const retryTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    // Initialize Audio Contexts ONLY ONCE
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const outputContext = new AudioContextClass({ sampleRate: 24000 }); // Output at 24kHz
    const inputContext = new AudioContextClass({ sampleRate: 16000 }); // Input at 16kHz

    audioContextRef.current = outputContext;
    inputContextRef.current = inputContext;

    const connectToGemini = async (retries = 0) => {
      try {
        if (!process.env.API_KEY) {
            console.error("No API Key found in process.env.API_KEY");
            if (mounted) setStatus('error');
            return;
        }

        // Resume contexts if suspended
        if (outputContext.state === 'suspended') await outputContext.resume();
        if (inputContext.state === 'suspended') await inputContext.resume();

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: SARAH_PERSONA,
          },
          callbacks: {
            onopen: async () => {
              if (!mounted) return;
              console.log("Gemini Live Connected");
              setStatus('connected');

              // Clean up previous stream/processor if retrying
              if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
              if (processorRef.current) processorRef.current.disconnect();
              if (sourceRef.current) sourceRef.current.disconnect();

              // Start Microphone Input
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                
                const source = inputContext.createMediaStreamSource(stream);
                sourceRef.current = source;
                
                const processor = inputContext.createScriptProcessor(4096, 1, 1);
                processorRef.current = processor;
                
                processor.onaudioprocess = (e) => {
                  if (!mounted) return;
                  
                  // Only process if we have an active session and are connected
                  if (!sessionRef.current) return;

                  const inputData = e.inputBuffer.getChannelData(0);
                  
                  // Visualizer Logic
                  let sum = 0;
                  for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                  const rms = Math.sqrt(sum / inputData.length);
                  setVolume(Math.min(rms * 10, 1)); 

                  // Send to API
                  const pcm16 = floatTo16BitPCM(inputData);
                  const base64 = base64Encode(pcm16);
                  
                  try {
                    sessionRef.current.sendRealtimeInput({
                        media: {
                            mimeType: 'audio/pcm;rate=16000',
                            data: base64
                        }
                    });
                  } catch(err) {
                    // Ignore send errors during reconnection phases
                  }
                };

                source.connect(processor);
                processor.connect(inputContext.destination);

              } catch (err) {
                console.error("Mic Error:", err);
                if (mounted) setStatus('error');
              }
            },
            onmessage: async (message: LiveServerMessage) => {
               if (!mounted) return;
               
               // Handle Audio Output
               const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
               if (audioData && outputContext) {
                 const audioBytes = base64ToUint8Array(audioData);
                 
                 const int16Array = new Int16Array(audioBytes.buffer);
                 const float32Array = new Float32Array(int16Array.length);
                 for (let i = 0; i < int16Array.length; i++) {
                   float32Array[i] = int16Array[i] / 32768.0;
                 }
                 
                 const buffer = outputContext.createBuffer(1, float32Array.length, 24000);
                 buffer.copyToChannel(float32Array, 0);
                 
                 const source = outputContext.createBufferSource();
                 source.buffer = buffer;
                 source.connect(outputContext.destination);
                 
                 const currentTime = outputContext.currentTime;
                 const startTime = Math.max(currentTime, nextStartTimeRef.current);
                 source.start(startTime);
                 nextStartTimeRef.current = startTime + buffer.duration;
                 
                 if (buffer.duration > 0.1) {
                     setVolume(0.8); 
                     setTimeout(() => setVolume(0), buffer.duration * 1000);
                 }
               }
            },
            onclose: () => {
                console.log("Connection closed");
                if (mounted && status !== 'error') setStatus('ended');
            },
            onerror: (e) => {
                console.error("Gemini Error:", e);
                if (mounted) {
                    // Retry logic for Service Unavailable or other transient errors
                    if (retries < 3) {
                        console.log(`Retrying connection... Attempt ${retries + 1}`);
                        setStatus('reconnecting');
                        sessionRef.current = null; // Prevent sending data
                        
                        retryTimeoutRef.current = setTimeout(() => {
                            connectToGemini(retries + 1);
                        }, 2000 * (retries + 1)); // Exponential backoff
                    } else {
                        setStatus('error');
                    }
                }
            }
          }
        });

        const s = await sessionPromise;
        if (mounted) {
            sessionRef.current = s;
        } else {
            s.close();
        }

      } catch (error) {
        console.error("Connection Failed:", error);
        if (mounted) {
            if (retries < 3) {
                setStatus('reconnecting');
                retryTimeoutRef.current = setTimeout(() => {
                    connectToGemini(retries + 1);
                }, 2000 * (retries + 1));
            } else {
                setStatus('error');
            }
        }
      }
    };

    connectToGemini();

    return () => {
      mounted = false;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      
      // Cleanup Audio
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (processorRef.current) processorRef.current.disconnect();
      if (sourceRef.current) sourceRef.current.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
      if (inputContextRef.current && inputContextRef.current.state !== 'closed') inputContextRef.current.close();
      
      // Cleanup Session
      if (sessionRef.current) {
          try {
            sessionRef.current.close();
          } catch(e) {
              console.log("Session close skipped or failed", e);
          }
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0F172A] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-30">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : (status === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500')} animate-pulse`}></div>
                 <span className="text-xs font-bold text-white tracking-widest uppercase">Live Demo Call</span>
            </div>
            <button onClick={onEndCall} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Main Visualizer Area */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center">
            
            {/* Avatar */}
            <div className="relative mb-8">
                {/* Rings */}
                <div 
                    className="absolute inset-0 rounded-full border border-cyan-500/30 transition-all duration-100 ease-out"
                    style={{ transform: `scale(${1 + volume * 0.5})`, opacity: 0.5 + volume }}
                ></div>
                <div 
                    className="absolute inset-0 rounded-full border border-emerald-400/20 transition-all duration-100 ease-out delay-75"
                    style={{ transform: `scale(${1 + volume * 1})` }}
                ></div>
                
                {/* Core Image */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20"></div>
                    <span className="text-4xl">👩‍💼</span>
                </div>
                
                {/* Status Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
                    {status === 'connecting' && 'Connecting...'}
                    {status === 'reconnecting' && 'Reconnecting...'}
                    {status === 'connected' && 'Sarah is Listening'}
                    {status === 'error' && 'Connection Failed'}
                    {status === 'ended' && 'Call Ended'}
                </div>
            </div>

            {/* Captions / Hints */}
            <div className="space-y-2 max-w-[250px]">
                <h3 className="text-xl font-bold text-white">Sarah (AI Agent)</h3>
                <p className="text-slate-400 text-sm">
                    {status === 'connected' 
                        ? "Say 'Hello' to start..." 
                        : status === 'error' 
                            ? "Service unavailable. Retrying..." 
                            : status === 'reconnecting'
                                ? "Connection lost. Reconnecting..."
                                : "Establishing secure line..."}
                </p>
            </div>

        </div>

        {/* Controls */}
        <div className="relative z-10 p-6 bg-slate-900/50 backdrop-blur-md border-t border-white/10 flex justify-center gap-6">
            <button 
                onClick={onEndCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 transition-all hover:scale-110"
            >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.36 7.46 6 12 6s8.66 2.36 11.71 5.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
            </button>
            
             <button 
                onClick={onOpenModal}
                className="h-14 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white font-bold gap-2 transition-all"
            >
                <span>Book Demo</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
        </div>
    </div>
  );
};


// --- Main Widget ---

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ onOpenModal, isOpen, setIsOpen, mode, setMode }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Salam! 👋 I'm Sarah, the LeadFora AI Agent. I can speak 30+ languages. Want to hear me?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Greeting Bubble State
  const [showGreeting, setShowGreeting] = useState(false);
  const [hasDismissedGreeting, setHasDismissedGreeting] = useState(false);

  // Proactive Greeting Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isOpen && !hasDismissedGreeting) {
      timer = setTimeout(() => {
        setShowGreeting(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, hasDismissedGreeting]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen, mode]);

  // Gemini Chat Session for Text Mode (Separate from Voice)
  const [textChatSession, setTextChatSession] = useState<any>(null);

  useEffect(() => {
    if (process.env.API_KEY && mode === 'chat') {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
              model: 'gemini-3-pro-preview',
              config: {
                systemInstruction: SARAH_PERSONA,
              }
            });
            setTextChatSession(chat);
        } catch (error) {
            console.error("Failed to initialize Text AI", error);
        }
    }
  }, [mode]);

  const handleSendMessage = async (text: string, isDemo: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (isDemo) {
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: Message = { 
          id: Date.now() + 1, 
          text: "Let's do it! Opening the demo form for you now...", 
          sender: 'ai' 
        };
        setMessages(prev => [...prev, aiMsg]);
        setTimeout(() => onOpenModal(), 1000);
      }, 1000);
      return;
    }

    try {
      if (textChatSession) {
        const result = await textChatSession.sendMessage({ message: text });
        const response = result.text;
        setIsTyping(false);
        const aiMsg: Message = { 
          id: Date.now() + 1, 
          text: response, 
          sender: 'ai' 
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
         setTimeout(() => {
            setIsTyping(false);
            const aiMsg: Message = { 
                id: Date.now() + 1, 
                text: "I'm connecting... please try again.", 
                sender: 'ai' 
            };
            setMessages(prev => [...prev, aiMsg]);
         }, 1000);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const errorMsg: Message = { 
          id: Date.now() + 1, 
          text: "Connection error. Please try again.", 
          sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  const handleDismissGreeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGreeting(false);
    setHasDismissedGreeting(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      
      {/* Proactive Chat Invitation Bubble */}
      {!isOpen && showGreeting && (
        <div 
          onClick={() => setIsOpen(true)}
          className="mb-4 mr-2 w-64 bg-[#0F172A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl rounded-br-none p-4 shadow-[0_0_20px_rgba(0,217,255,0.2)] cursor-pointer animate-fade-in-up relative group transition-all hover:-translate-y-1"
        >
          {/* Close Button */}
          <button 
            onClick={handleDismissGreeting}
            className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex-shrink-0 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed pr-4">
              I'm Sarah, your AI Agent. Want to hear me speak Arabic or French? Click here. 🎙️
            </p>
          </div>

          {/* Triangle Pointer */}
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#0F172A]/90 border-r border-b border-cyan-500/30 transform rotate-45"></div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[550px] flex flex-col bg-[#0F172A]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-bottom-right transition-all duration-300">
          
          {mode === 'voice' ? (
              <VoiceCallInterface 
                onEndCall={() => setMode('chat')} 
                onOpenModal={onOpenModal} 
              />
          ) : (
            <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-cyan-500/20 shrink-0">
                    <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2 h-2 absolute bottom-0 right-0 bg-green-500 rounded-full ring-2 ring-slate-900"></div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        AI
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Sarah (AI Agent)</h3>
                        <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Voice Call Button */}
                        <button 
                            onClick={() => setMode('voice')}
                            className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30"
                            title="Call Sarah"
                        >
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.27-.27.36-.66.24-1.01-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.28 3 3.93 3 4.74c0 9.17 7.46 16.63 16.63 16.63.81 0 1.46-.65 1.46-1.19v-3.81c0-.54-.45-.99-.99-.99z"/></svg>
                        </button>
                        {/* Close */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gradient-to-b from-slate-900/50 to-transparent">
                    {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-2'}`}
                    >
                        {/* AI Avatar for messages */}
                        {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)] mt-1">
                            <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        )}

                        <div 
                        className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed shadow-lg ${
                            msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-none' 
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}
                        >
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                    <div className="flex justify-start items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)] mt-1">
                        <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl rounded-tl-none flex items-center gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-slate-900/80 border-t border-cyan-500/20 shrink-0">
                    
                    {/* Quick Options (Horizontal Scroll) */}
                    <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-slate-800">
                    {QUICK_REPLIES.map((option) => (
                        <button
                        key={option.id}
                        onClick={() => handleSendMessage(option.question, option.id === 'demo')}
                        disabled={isTyping}
                        className="whitespace-nowrap text-xs py-1.5 px-3 rounded-full bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {option.label}
                        </button>
                    ))}
                    </div>

                    {/* Text Input */}
                    <div className="p-3 flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a question..."
                        className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-cyan-500 focus:outline-none placeholder-slate-500"
                    />
                    <button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                    </div>
                </div>
            </>
          )}

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowGreeting(false);
        }}
        className="relative group h-14 w-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:scale-110 transition-all duration-300 focus:outline-none"
        style={{
          background: 'linear-gradient(135deg, #00D9FF 0%, #00FF41 100%)'
        }}
      >
        {/* Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping"></span>
        
        {isOpen ? (
           // Close Icon
           <svg className="w-6 h-6 text-slate-900 font-bold relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
           // Robot/Sparkle Icon
           <svg className="w-7 h-7 text-slate-900 relative z-10 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>
        )}
      </button>

      {/* Notification Badge (Only when closed and greeting not shown) */}
      {!isOpen && !showGreeting && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center animate-bounce">
          <span className="w-2 h-2 bg-white rounded-full"></span>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
