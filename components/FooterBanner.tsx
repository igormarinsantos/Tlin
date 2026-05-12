"use client";

import { motion, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const HOLE_RADIUS = 60; // Base radius in CSS pixels

export function FooterBanner() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<{ x: number, y: number, life: number }[]>([]);
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  
  const isInView = useInView(containerRef, { margin: "200px" });
  const isInViewRef = useRef(isInView);
  
  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

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
      rafId = requestAnimationFrame(render);
      if (!ctx || !trailCtx || !canvas) return;
      if (!isInViewRef.current) return; // Skip heavy drawing when offscreen
      
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
      
      // 1. Draw Mesh Gradient Background
      ctx.globalCompositeOperation = "source-over";
      
      // Base color (Lilac)
      ctx.fillStyle = "#B597FF";
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, 0, w, h);

      // Large animated cyan/light blobs for abstract movement
      const blobs = [
        { x: 0.2, y: 0.2, r: 1.8, color: "#38E3FF", speed: 0.3 },
        { x: 0.8, y: 0.8, r: 1.5, color: "#C4ADFF", speed: 0.4 },
        { x: 0.5, y: 0.5, r: 2.0, color: "#38E3FF", speed: 0.2 },
      ];

      blobs.forEach((blob, i) => {
        const x = w * (blob.x + Math.cos(timeRef.current * blob.speed + i) * 0.4);
        const y = h * (blob.y + Math.sin(timeRef.current * blob.speed + i) * 0.4);
        const rad = Math.max(w, h) * blob.r;

        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, blob.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.5; 
        ctx.fillRect(0, 0, w, h);
      });

      // Reset Alpha
      ctx.globalAlpha = 1.0;

      // 2. Draw Flashlight Trail
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
    <section className="w-full py-10 md:py-20 px-4 md:px-10 relative">
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
        className="w-full h-[600px] md:h-[750px] relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] group bg-[#0c0d0d]"
      >
        <video
          ref={videoRef}
          aria-hidden="true"
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
        >
          <source src="/RoboCamera.mp4" type="video/mp4" />
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
              className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-tight"
           >
              {t.footerBanner.title}<br/>{t.footerBanner.titleHighlight}
           </motion.h2>

           <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-white mb-8 max-w-2xl"
           >
              {t.footerBanner.subtitle}
           </motion.p>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 pointer-events-auto w-full md:w-auto px-2 md:px-0"
           >
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-qualification", { detail: { plan: "TLIN" } }))}
                className="relative p-[1px] rounded-full overflow-hidden group/btn transition-all duration-300 cursor-pointer z-10 block w-full md:w-auto"
              >
                <div className="absolute inset-[-150%] opacity-100 transition-opacity animate-[spin_3s_linear_infinite]"
                  style={{ backgroundImage: `conic-gradient(from 0deg, transparent 0 120deg, #B597FF 150deg, #38E3FF 210deg, transparent 240deg 360deg)` }}
                />
                <div className="relative px-2 md:px-10 py-4 rounded-full font-bold text-[14px] z-10 block w-full text-white transition-colors duration-300 group-hover/btn:text-[#0c0d0d] text-center bg-[#0c0d0d]">
                  <span className="relative z-10">{t.footerBanner.cta1}</span>
                  <div className="absolute inset-0 bg-[#0c0d0d] rounded-full transition-opacity duration-500 group-hover/btn:opacity-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B597FF] to-[#38E3FF] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
                </div>
              </button>
              <a 
                href="https://wa.me/5511916248604" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden md:flex px-6 md:px-10 py-4 rounded-full bg-white text-[#0c0d0d] font-bold text-[14px] hover:bg-zinc-100 transition-all whitespace-nowrap"
              >
                 {t.footerBanner.cta2}
              </a>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
