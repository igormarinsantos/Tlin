"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const HOLE_RADIUS = 60; // Base radius in CSS pixels

export function FooterBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<{ x: number, y: number, life: number }[]>([]);
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  // Handle Canvas Drawing and Mask Generation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (!trailCanvasRef.current) {
      trailCanvasRef.current = document.createElement('canvas');
    }
    const trailCanvas = trailCanvasRef.current;
    const trailCtx = trailCanvas.getContext('2d');

    let rafId: number;

    const render = () => {
      if (!ctx || !trailCtx || !canvas) return;
      timeRef.current += 0.008;
      
      const dpr = window.devicePixelRatio || 1;

      // Ensure Trail Canvas matches High-DPI internal resolution
      if (trailCanvas.width !== canvas.width || trailCanvas.height !== canvas.height) {
        trailCanvas.width = canvas.width;
        trailCanvas.height = canvas.height;
      }

      // Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr); // Scale context to use CSS pixels for all drawings

      // 1. Draw Mesh Gradient (Animated Blobs)
      ctx.globalCompositeOperation = "source-over";
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      
      // Base color
      ctx.fillStyle = "#B597FF";
      ctx.fillRect(0, 0, w, h);

      // Multiple blobs for mesh effect (Brand Blue & Lilac mix)
      const blobs = [
        { x: 0.2, y: 0.3, r: 1.2, color: "#38E3FF", speed: 0.5 },
        { x: 0.8, y: 0.7, r: 1.1, color: "#B597FF", speed: 0.7 },
        { x: 0.5, y: 0.5, r: 1.3, color: "#38E3FF", speed: 0.3 },
        { x: 0.1, y: 0.9, r: 0.6, color: "#C4ADFF", speed: 0.6 }
      ];

      blobs.forEach((blob, i) => {
        const x = w * (blob.x + Math.cos(timeRef.current * blob.speed + i) * 0.3);
        const y = h * (blob.y + Math.sin(timeRef.current * blob.speed + i) * 0.3);
        const rad = Math.max(w, h) * blob.r;

        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, blob.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.globalAlpha = 1.0;

      // 2. Draw Flashlight Trail with FULL HOLES (Slither.io style)
      trailCtx.save();
      trailCtx.scale(dpr, dpr);
      trailCtx.clearRect(0, 0, trailCanvas.width / dpr, trailCanvas.height / dpr);
      
      const { x: mx, y: my } = mouseRef.current;
      
      // Interpolate to avoid gaps when moving fast
      if (isHoveredRef.current && mx > -500) {
        if (lastMousePos.current.x > -500) {
          const dist = Math.hypot(mx - lastMousePos.current.x, my - lastMousePos.current.y);
          const steps = Math.max(1, Math.floor(dist / 10)); // One point every 10px
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            trailRef.current.push({ 
              x: lastMousePos.current.x + (mx - lastMousePos.current.x) * t, 
              y: lastMousePos.current.y + (my - lastMousePos.current.y) * t, 
              life: 1.0 
            });
          }
        } else {
          trailRef.current.push({ x: mx, y: my, life: 1.0 });
        }
        lastMousePos.current = { x: mx, y: my };
      }

      // Update and Draw Trail
      trailCtx.fillStyle = "white";
      trailRef.current = trailRef.current.filter(p => {
        p.life -= 0.04; // Trail duration control
        if (p.life <= 0) return false;
        
        trailCtx.globalAlpha = 1.0;
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, HOLE_RADIUS, 0, Math.PI * 2);
        trailCtx.fill();
        return true;
      });
      
      trailCtx.restore();

      // 3. Draw the Mask
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(trailCanvas, 0, 0, canvas.width / dpr, canvas.height / dpr);
      
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseRef.current = { x, y };

      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
      }
    };

    render();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Handle Resize and DPI sync
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current && containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Set internal resolution based on DPI
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        
        const trailCanvas = trailCanvasRef.current;
        if (trailCanvas) {
          trailCanvas.width = rect.width * dpr;
          trailCanvas.height = rect.height * dpr;
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="w-full py-20 px-10 relative">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px] bg-[#B597FF]/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div 
        ref={containerRef}
        onMouseEnter={() => {
          setIsHovered(true);
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          isHoveredRef.current = false;
          mouseRef.current = { x: -1000, y: -1000 };
        }}
        className="w-full h-[750px] relative overflow-hidden rounded-[3.5rem] group bg-[#0c0d0d]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-form-of-blue-and-purple-dots-31730-large.mp4" type="video/mp4" />
        </video>

        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-10 w-full h-full pointer-events-none" 
        />

        <div 
          ref={cursorRef}
          className="absolute z-20 rounded-full pointer-events-none transition-opacity duration-300"
          style={{ 
            width: `${HOLE_RADIUS * 2}px`,
            height: `${HOLE_RADIUS * 2}px`,
            opacity: isHovered ? 1 : 0,
            left: `-1000px`,
            top: `-1000px`,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top',
            background: 'radial-gradient(circle, transparent 70%, rgba(255,255,255,0.05) 100%)',
            border: '4px solid rgba(255, 255, 255, 0.8)',
          }}
        />

        <div className="relative z-30 h-full max-w-5xl mx-auto px-8 flex flex-col items-center justify-center text-center pointer-events-none">
           <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-12 leading-tight"
           >
              Receba uma demo gratuita
           </motion.h2>



           <div className="flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
              <a href="#pricing" className="px-10 py-4 rounded-full bg-white text-[#0c0d0d] font-bold text-sm hover:bg-zinc-50 transition-all">
                 Quero meu Agente Tlin
              </a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="px-10 py-4 rounded-full border border-white text-white font-bold text-sm hover:bg-white/10 transition-all">
                 Falar com vendas
              </a>
           </div>
        </div>
      </div>
    </section>
  );
}
