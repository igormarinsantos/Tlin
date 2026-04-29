"use client";

import { motion } from "framer-motion";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-white pointer-events-none">
      {/* 
        High-Performance Static CSS Blobs
        Using fixed radial gradients and blur to eliminate Main-Thread Canvas calculations.
      */}
      
      {/* Glow 1: Purple Base */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#B597FF]/10 blur-[120px] anima1"
        style={{ willChange: 'transform' }}
      />
      
      {/* Glow 2: Cyan Contrast */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#38E3FF]/10 blur-[120px] anima2"
        style={{ willChange: 'transform' }}
      />

      {/* Glow 3: Deep Purple Accent */}
      <div 
        className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#6C38FF]/5 blur-[100px] anima3"
        style={{ willChange: 'transform' }}
      />

      {/* 
        Overlay Mesh / Noise for premium feel 
        Using a lighter opacity for better scrolling performance.
      */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://res.cloudinary.com/dyd911kmh/image/upload/v1640050260/noise_shscsc.png')]" />

      <style jsx>{`
        .anima1 {
          animation: drift 25s infinite alternate ease-in-out;
        }
        .anima2 {
          animation: drift 30s infinite alternate-reverse ease-in-out;
        }
        .anima3 {
          animation: drift 35s infinite alternate ease-in-out;
        }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(100px, 50px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
