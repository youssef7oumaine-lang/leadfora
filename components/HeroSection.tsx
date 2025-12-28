
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '../LanguageContext';

interface HeroSectionProps {
  onOpenModal: () => void;
}

// --- 3D COMPONENT: LIQUID SPHERE (CENTERED AI CORE) ---

const LiquidSphere = () => {
  const mainRef = useRef<THREE.Mesh>(null);
  const dropletRef = useRef<THREE.Mesh>(null);
  
  const mainMatRef = useRef<any>(null);
  const dropletMatRef = useRef<any>(null);

  useFrame((state) => {
    const { x, y } = state.pointer; // Mouse coordinates normalized (-1 to 1)
    
    // Calculate distance from center for material intensity
    const dist = Math.sqrt(x * x + y * y);
    
    // --- MATERIAL ANIMATION (High Viscosity / Mercury) ---
    // Base distort kept high for "softer" feel. 
    // Mouse influence kept high for "aggressive" reaction.
    const targetDistort = 0.4 + (dist * 0.4); 
    
    // Speed increased by 20% (0.6 base). 
    const targetSpeed = 0.6 + (dist * 0.3);   

    if (mainMatRef.current) {
      mainMatRef.current.distort = THREE.MathUtils.lerp(mainMatRef.current.distort, targetDistort, 0.05);
      mainMatRef.current.speed = THREE.MathUtils.lerp(mainMatRef.current.speed, targetSpeed, 0.05);
    }
    
    if (dropletMatRef.current) {
      dropletMatRef.current.distort = THREE.MathUtils.lerp(dropletMatRef.current.distort, targetDistort * 1.2, 0.06);
      dropletMatRef.current.speed = THREE.MathUtils.lerp(dropletMatRef.current.speed, targetSpeed * 1.2, 0.06);
    }

    // --- PARALLAX & MOVEMENT (Aggressive Magnetic Flow) ---
    
    if (mainRef.current && dropletRef.current) {
      // MAIN SPHERE:
      // Rotation: Increased tilt sensitivity
      mainRef.current.rotation.x = THREE.MathUtils.lerp(mainRef.current.rotation.x, -y * 0.5, 0.08);
      mainRef.current.rotation.y = THREE.MathUtils.lerp(mainRef.current.rotation.y, x * 0.5, 0.08);
      
      // Position: Aggressive "Magnetic" Pull towards cursor
      mainRef.current.position.x = THREE.MathUtils.lerp(mainRef.current.position.x, x * 0.3, 0.08);
      mainRef.current.position.y = THREE.MathUtils.lerp(mainRef.current.position.y, y * 0.3, 0.08);
      
      // DROPLET SPHERE:
      // Follows loosely
      dropletRef.current.position.x = THREE.MathUtils.lerp(dropletRef.current.position.x, x * 0.6, 0.1);
      dropletRef.current.position.y = THREE.MathUtils.lerp(dropletRef.current.position.y, y * 0.6, 0.1);
    }
  });

  return (
    <Float 
      speed={2.0} // Increased float speed for organic feel
      rotationIntensity={0.4} 
      floatIntensity={0.4} 
    >
      <group>
        {/* MAIN CORE SPHERE */}
        <Sphere 
          args={[1, 256, 256]} 
          scale={1.45} 
          ref={mainRef}
        >
          <MeshDistortMaterial
            ref={mainMatRef}
            color="#ffffff" 
            roughness={0} 
            metalness={1.0} 
            envMapIntensity={3.0} // Brighter reflections
            distort={0.4} 
            speed={0.6} 
            radius={1}
          />
        </Sphere>

        {/* DROPLET SPHERE */}
        <Sphere args={[1, 128, 128]} scale={0.4} ref={dropletRef}>
          <MeshDistortMaterial
            ref={dropletMatRef}
            color="#ffffff" 
            roughness={0} 
            metalness={1.0}
            envMapIntensity={3.0} 
            distort={0.45} 
            speed={0.7} 
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
  
  // Split the headline by newline character to ensure exactly two lines based on translation
  const headlines = t.hero.headline.split('\n');

  // Common button styles for uniformity
  const buttonBaseClass = "w-full md:w-auto md:min-w-[260px] px-8 py-2.5 rounded-full font-bold text-white text-lg capitalize transition-all duration-300 hover:scale-105 hover:brightness-110 focus:outline-none shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]";
  const gradientStyle = { background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)' };

  return (
    <section 
      className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-[#F8FAFC]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 3D Liquid Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]} // Handle high-DPI
          gl={{ antialias: true, alpha: true }} 
        >
          {/* 
             Using 'city' preset for a stable, high-quality urban reflection.
             This ensures the sphere looks like liquid chrome reflecting a skyline.
          */}
          <Environment preset="city" />
          
          {/* Lighting setup to enhance the 3D depth - Boosted for high exposure */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2.0} />
          <pointLight position={[-10, -10, -5]} intensity={1.0} color="#00D9FF" />
          
          <LiquidSphere />
        </Canvas>
        
        {/* Subtle gradients to blend 3D canvas with 2D page */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#F8FAFC_85%)] pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mt-0 pointer-events-none">
        
        {/* Live Badge (Glassmorphism & Breathe Animation) */}
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

        {/* Headline - "Apple-esque" Sizing (text-3xl to text-5xl) */}
        <h1 
          className="font-bold tracking-tight animate-fade-in-up mx-auto max-w-5xl" 
          style={{ animationDelay: '0.1s' }}
        >
          {headlines.map((line, index) => (
            <span 
              key={index} 
              className={`block text-3xl md:text-4xl lg:text-5xl text-black ${index > 0 ? 'mt-4' : ''}`}
              style={{ 
                // Very faint white halo to ensure black text is readable over liquid chrome
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
