import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../LanguageContext';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const { t, isRTL } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlines = t.hero.headline.split('\n');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // State variables for the ripple effect
    let width = 0;
    let height = 0;
    let rippleMap: Int32Array | null = null;
    let lastMap: Int32Array | null = null;
    let imageData: ImageData | null = null;
    let animationFrameId: number;
    let isDestroyed = false;

    // Gradient Configuration (Light Gray/Bluish)
    // Top: #F8FAFC (248, 250, 252)
    // Bottom: #E2E8F0 (226, 232, 240)
    const startColor = { r: 248, g: 250, b: 252 };
    const endColor = { r: 226, g: 232, b: 240 };

    const init = () => {
      if (isDestroyed) return;
      
      // Use offset sizes to match DOM exactly to avoid scaling artifacts
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      // Prevent buffer creation errors if size is 0
      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;

      const size = width * height;
      rippleMap = new Int32Array(size);
      lastMap = new Int32Array(size);
      imageData = ctx.createImageData(width, height);
    };

    const disturb = (x: number, y: number) => {
      if (!width || !height || !rippleMap) return;
      
      // Boundary checks to avoid index out of bounds
      if (x < 2 || x >= width - 2 || y < 2 || y >= height - 2) return;

      const disturbance = 400; // Ripple strength
      const radius = 3;        // Ripple radius

      for (let j = y - radius; j <= y + radius; j++) {
        for (let i = x - radius; i <= x + radius; i++) {
          const idx = (j * width) + i;
          // Safe buffer access
          if (idx >= 0 && idx < rippleMap.length) {
            rippleMap[idx] += disturbance;
          }
        }
      }
    };

    const render = () => {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(render);

      // Strict check to prevent "Uncaught" errors during resize or init
      if (!width || !height || !rippleMap || !lastMap || !imageData) return;

      const data = imageData.data;
      const rMap = rippleMap;
      const lMap = lastMap;

      // Calculate Gradient Deltas once per frame
      const dR = endColor.r - startColor.r;
      const dG = endColor.g - startColor.g;
      const dB = endColor.b - startColor.b;

      let mapInd = width; // Start at second row
      
      // Loop through all pixels (skipping 1px edge to avoid boundary checks)
      for (let y = 1; y < height - 1; y++) {
        
        // Calculate base gradient color for this specific row (Vertical Gradient)
        const rowFactor = y / height;
        const baseR = startColor.r + (dR * rowFactor);
        const baseG = startColor.g + (dG * rowFactor);
        const baseB = startColor.b + (dB * rowFactor);

        for (let x = 1; x < width - 1; x++) {
          // Water Ripple Algorithm
          // New Height = (Average of 4 neighbors) - Previous Height
          const nextHeight = (
            (rMap[mapInd - 1] + 
             rMap[mapInd + 1] + 
             rMap[mapInd - width] + 
             rMap[mapInd + width]) >> 1
          ) - lMap[mapInd];

          // Damping (Energy Loss) - Equivalent to val * 0.968
          const val = nextHeight - (nextHeight >> 5);
          
          // Store result in the "Current" buffer (which becomes "Last" next frame)
          lMap[mapInd] = val;

          // Render Logic: Apply shading based on ripple height
          // "val" is the height. Positive = peak (lighter), Negative = trough (darker)
          const highlight = val >> 4; 

          let r = baseR + highlight;
          let g = baseG + highlight;
          let b = baseB + highlight;

          // Fast Clamping
          if (r > 255) r = 255; else if (r < 0) r = 0;
          if (g > 255) g = 255; else if (g < 0) g = 0;
          if (b > 255) b = 255; else if (b < 0) b = 0;

          // Write to Pixel Buffer
          const pixelInd = mapInd << 2; // multiply by 4
          data[pixelInd] = r;
          data[pixelInd + 1] = g;
          data[pixelInd + 2] = b;
          data[pixelInd + 3] = 255; // Alpha

          mapInd++;
        }
        mapInd += 2; // Skip edge pixels (left and right)
      }

      // Swap buffers for next frame
      rippleMap = lMap;
      lastMap = rMap;

      ctx.putImageData(imageData, 0, 0);
    };

    // Event Handlers
    const handleMove = (e: MouseEvent | TouchEvent) => {
      // Guard clause
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      disturb(Math.floor(clientX - rect.left), Math.floor(clientY - rect.top));
    };

    // Start
    init();
    render();

    // Listeners
    window.addEventListener('resize', init);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: true });

    // Cleanup
    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMove);
        canvas.removeEventListener('touchmove', handleMove);
      }
    };
  }, []);

  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden pt-20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Interactive Water Ripple Background (Z-0) */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full block cursor-crosshair"
        style={{
          // Fallback gradient while loading JS
          background: 'linear-gradient(to bottom, #F8FAFC 0%, #E2E8F0 100%)' 
        }}
      />

      {/* Content Overlay (Z-10, Pointer-Events-None to let clicks pass to canvas) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mt-12 -translate-y-14 space-y-8 pointer-events-none">
        
        <h1 className="font-bold text-slate-900 tracking-tight">
          {headlines.map((line, index) => (
            <span 
              key={index} 
              className={`block text-3xl md:text-5xl leading-tight ${index > 0 ? 'mt-2 md:mt-4' : ''}`}
            >
              {line}
            </span>
          ))}
        </h1>

        {/* Pointer-Events-Auto required for button to be clickable */}
        <div className="pt-4 pointer-events-auto">
          <button
            onClick={onOpenModal}
            className="px-12 py-2.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:brightness-125 focus:outline-none"
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #00FF41 100%)',
              boxShadow: '0 0 25px rgba(0, 255, 65, 0.6)'
            }}
          >
            {t.hero.cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;