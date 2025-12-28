
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '../LanguageContext';

interface HeroSectionProps {
  onOpenModal: () => void;
}

// --- 3D COMPONENT: LIQUID SPHERE (CENTERED AI CORE) ---

const LiquidSphere = ({ isMobile }: { isMobile: boolean }) => {
  const mainRef = useRef<THREE.Mesh>(null);
  const dropletRef = useRef<THREE.Mesh>(null);
  
  const mainMatRef = useRef<any>(null);
  const dropletMatRef = useRef<any>(null);

  useFrame((state) => {
    // --- MOBILE BEHAVIOR (Autonomous Idle) ---
    if (isMobile) {
      const t = state.clock.getElapsedTime();

      if (mainRef.current) {
        // Reset position to exact center
        mainRef.current.position.set(0, 0, 0);
        // Gentle idle rotation
        mainRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        mainRef.current.rotation.y = t * 0.1;
      }

      if (dropletRef.current) {
        // Gentle autonomous orbit for droplet
        dropletRef.current.position.x = Math.cos(t * 0.5) * 0.7;
        dropletRef.current.position.y = Math.sin(t * 0.5) * 0.7;
      }

      // Constant material animation for mobile (no mouse reaction)
      if (mainMatRef.current) {
        mainMatRef.current.distort = 0.5;
        mainMatRef.current.speed = 0.7;
      }
      if (dropletMatRef.current) {
        dropletMatRef.current.distort = 0.5;
        dropletMatRef.current.speed = 0.7;
      }
      
      return; // Exit loop for mobile
    }

    // --- DESKTOP BEHAVIOR (Interactive) ---
    const { x, y } = state.pointer; // Mouse coordinates normalized (-1 to 1)
    
    // Calculate distance from center for material intensity
    const dist = Math.sqrt(x * x + y * y);
    
    // Material Animation (High Viscosity / Liquid Mercury)
    const targetDistort = 0.55 + (dist * 0.5); 
    const targetSpeed = 0.75 + (dist * 0.35);   

    if (mainMatRef.current) {
      mainMatRef.current.distort = THREE.MathUtils.lerp(mainMatRef.current.distort, targetDistort, 0.04);
      mainMatRef.current.speed = THREE.MathUtils.lerp(mainMatRef.current.speed, targetSpeed, 0.04);
    }
    
    if (dropletMatRef.current) {
      dropletMatRef.current.distort = THREE.MathUtils.lerp(dropletMatRef.current.distort, targetDistort * 1.2, 0.05);
      dropletMatRef.current.speed = THREE.MathUtils.lerp(dropletMatRef.current.speed, targetSpeed * 1.2, 0.05);
    }

    // Parallax & Movement (Aggressive Magnetic Flow)
    if (mainRef.current && dropletRef.current) {
      mainRef.current.rotation.x = THREE.MathUtils.lerp(mainRef.current.rotation.x, -y * 0.6, 0.1);
      mainRef.current.rotation.y = THREE.MathUtils.lerp(mainRef.current.rotation.y, x * 0.6, 0.1);
      
      mainRef.current.position.x = THREE.MathUtils.lerp(mainRef.current.position.x, x * 0.55, 0.12);
      mainRef.current.position.y = THREE.MathUtils.lerp(mainRef.current.position.y, y * 0.55, 0.12);
      
      dropletRef.current.position.x = THREE.MathUtils.lerp(dropletRef.current.position.x, x * 0.8, 0.14);
      dropletRef.current.position.y = THREE.MathUtils.lerp(dropletRef.current.position.y, y * 0.8, 0.14);
    }
  });

  // Scale Factors
  // Desktop: 1.45 (Main), 0.4 (Droplet)
  // Mobile: Reduced by ~25% to fit behind text
  const mainScale = isMobile ? 1.1 : 1.45;
  const dropletScale = isMobile ? 0.3 : 0.4;

  return (
    <Float 
      speed={isMobile ? 1.5 : 2.5} // Slower float on mobile
      rotationIntensity={isMobile ? 0.2 : 0.5} 
      floatIntensity={isMobile ? 0.2 : 0.5} 
    >
      <group>
        {/* MAIN CORE SPHERE */}
        <Sphere 
          args={[1, 256, 256]} 
          scale={mainScale} 
          ref={mainRef}
        >
          <MeshDistortMaterial
            ref={mainMatRef}
            color="#ffffff" 
            roughness={0} 
            metalness={1.0} 
            envMapIntensity={3.5} 
            distort={0.55} 
            speed={0.75} 
            radius={1}
          />
        </Sphere>

        {/* DROPLET SPHERE */}
        <Sphere args={[1, 128, 128]} scale={dropletScale} ref={dropletRef}>
          <MeshDistortMaterial
            ref={dropletMatRef}
            color="#ffffff" 
            roughness={0} 
            metalness={1.0}
            envMapIntensity={3.5} 
            distort={0.6} 
            speed={0.85} 
            radius={1}
          />
        </Sphere>
      </group>
    </Float>
  );
};

// --- HERO SECTION ---

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const { t, isRTL } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Split the headline by newline character
  const headlines = t.hero.headline.split('\n');

  // Common button styles
  const buttonBaseClass = "w-full md:w-auto md:min-w-[260px] px-8 py-2.5 rounded-full font-bold text-white text-lg capitalize transition-all duration-300 hover:scale-105 hover:brightness-110 focus:outline-none shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]";
  const gradientStyle = { background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)' };

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section 
      className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-[#F8FAFC]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 3D Liquid Background */}
      {/* On mobile, we set pointer-events-none to ensures touches pass through to allow scrolling */}
      <div className={`absolute inset-0 z-0 ${isMobile ? 'pointer-events-none' : ''}`}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]} 
          gl={{ antialias: true, alpha: true }} 
        >
          <Environment preset="city" />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2.0} />
          <pointLight position={[-10, -10, -5]} intensity={1.0} color="#00D9FF" />
          
          <LiquidSphere isMobile={isMobile} />
        </Canvas>
        
        {/* Subtle gradients to blend 3D canvas with 2D page */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#F8FAFC_85%)] pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mt-0 pointer-events-none">
        
        {/* Live Badge */}
        <div className="pointer-events-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] transition-all hover:scale-105 hover:bg-white/60 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-breathe absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 tracking-[0.25em] uppercase font-mono leading-none pt-0.5 ml-0.5">
              WOLFZ AI ENGINE V2.0 LIVE
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 
          className="font-bold tracking-tight animate-fade-in-up mx-auto max-w-5xl" 
          style={{ animationDelay: '0.1s' }}
        >
          {headlines.map((line, index) => (
            <span 
              key={index} 
              className={`block text-3xl md:text-4xl lg:text-5xl text-black ${index > 0 ? 'mt-4' : ''}`}
              style={{ 
                textShadow: '0 0 30px rgba(255,255,255,0.5)',
                lineHeight: '1.4'
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        {/* Buttons */}
        <div className="pt-12 pointer-events-auto flex flex-col md:flex-row items-center gap-6 w-full justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onOpenModal}
            className={buttonBaseClass}
            style={gradientStyle}
          >
            {t.hero.cta.toLowerCase()}
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('trigger-chat-input', { detail: { message: 'I want to try the demo' } });
              window.dispatchEvent(event);
            }}
            className={buttonBaseClass}
            style={gradientStyle}
          >
            Try Chatbot Demo
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; /* Init hidden */
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
