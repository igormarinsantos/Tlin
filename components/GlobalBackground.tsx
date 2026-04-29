"use client";

import { motion } from "framer-motion";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-white pointer-events-none">
      {/* 
        High-Performance Static CSS Blobs
        Using fixed radial gradients and blur to eliminate Main-Thread Canvas calculations.
      */}
      
      {/* Glow 1: Primary Lilac */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#B597FF]/15 blur-[120px] anima1"
        style={{ willChange: 'transform' }}
      />
      
      {/* Glow 2: Soft Lilac Center */}
      <div 
        className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-[#B597FF]/10 blur-[150px] anima2"
        style={{ willChange: 'transform' }}
      />

      {/* Glow 3: Bottom Lilac Accent */}
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#B597FF]/10 blur-[120px] anima3"
        style={{ willChange: 'transform' }}
      />

      {/* Overlay Mesh / Noise for premium feel */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050260/noise_shscsc.png')]" />

      <style jsx>{`
        .anima1 {
          animation: drift 30s infinite alternate ease-in-out;
        }
        .anima2 {
          animation: drift 40s infinite alternate-reverse ease-in-out;
        }
        .anima3 {
          animation: drift 35s infinite alternate ease-in-out;
        }

        @keyframes drift {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(150px, 100px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
