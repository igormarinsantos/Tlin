"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Avatar {
  id: number;
  x: number; // base x percentage
  y: number; // base y percentage
  size: number;
  image: string;
  delay: number;
  floatSpeed: number;
  floatRange: number;
}

const AVATARS: Avatar[] = [
  // Left side
  { id: 1, x: 12, y: 35, size: 48, image: "/testimonials/ceo.png", delay: 0, floatSpeed: 12, floatRange: 8 },
  { id: 2, x: 18, y: 55, size: 40, image: "/testimonials/director.png", delay: 0.1, floatSpeed: 15, floatRange: 6 },
  { id: 3, x: 8, y: 70, size: 56, image: "/testimonials/founder.png", delay: 0.2, floatSpeed: 18, floatRange: 10 },
  
  // Right side
  { id: 4, x: 82, y: 30, size: 52, image: "/testimonials/founder.png", delay: 0.05, floatSpeed: 14, floatRange: 7 },
  { id: 5, x: 88, y: 50, size: 44, image: "/testimonials/ceo.png", delay: 0.15, floatSpeed: 16, floatRange: 9 },
  { id: 6, x: 80, y: 75, size: 48, image: "/testimonials/director.png", delay: 0.25, floatSpeed: 20, floatRange: 12 },
  
  // Bottom area (avoiding CTA)
  { id: 7, x: 30, y: 85, size: 36, image: "/testimonials/director.png", delay: 0.3, floatSpeed: 13, floatRange: 5 },
  { id: 8, x: 70, y: 82, size: 42, image: "/testimonials/founder.png", delay: 0.35, floatSpeed: 17, floatRange: 8 },
];

export function RevenueGravityHero({ isVisible }: { isVisible: boolean }) {
  const [activeAvatars, setActiveAvatars] = useState<number[]>(AVATARS.map(a => a.id));
  const [convertedIds, setConvertedIds] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const displayedAvatars = isMobile ? AVATARS.slice(0, 3) : AVATARS;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {isVisible && displayedAvatars.map((avatar) => (
          activeAvatars.includes(avatar.id) && (
            <AvatarElement 
              key={avatar.id} 
              avatar={avatar} 
              mouseX={mouseX}
              mouseY={mouseY}
              isConverted={convertedIds.has(avatar.id)}
              onConvert={() => {
                setConvertedIds(prev => new Set(prev).add(avatar.id));
                setTimeout(() => {
                  setActiveAvatars(prev => prev.filter(id => id !== avatar.id));
                }, 2000); // Wait for card display + fade out
              }}
            />
          )
        ))}
      </AnimatePresence>
    </div>
  );
}

function AvatarElement({ 
  avatar, 
  mouseX, 
  mouseY, 
  isConverted, 
  onConvert 
}: { 
  avatar: Avatar; 
  mouseX: any; 
  mouseY: any; 
  isConverted: boolean; 
  onConvert: () => void;
}) {
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const [revenueValue] = useState(() => Math.floor(Math.random() * 4501) + 500);

  // Smooth mouse influence
  const springX = useSpring(0, { damping: 30, stiffness: 100 });
  const springY = useSpring(0, { damping: 30, stiffness: 100 });

  useEffect(() => {
    const unsubscribeX = mouseX.on("change", (latest: number) => {
      const rect = { left: window.innerWidth * (avatar.x / 100), top: window.innerHeight * (avatar.y / 100) };
      const dist = Math.hypot(latest - rect.left, mouseY.get() - rect.top);
      if (dist < 300) {
        const power = (1 - dist / 300) * 15;
        springX.set((latest - rect.left) * (power / 100));
        springY.set((mouseY.get() - rect.top) * (power / 100));
      } else {
        springX.set(0);
        springY.set(0);
      }
    });
    return () => unsubscribeX();
  }, [avatar.x, avatar.y, mouseX, mouseY, springX, springY]);

  const handleMouseEnter = () => {
    if (isConverted) return;
    setHovering(true);
    hoverTimer.current = setTimeout(() => {
      onConvert();
    }, 500);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ 
        opacity: isConverted ? 0 : 1, 
        scale: isConverted ? 1.05 : hovering ? 1.1 : 1,
        y: isConverted ? -20 : 0,
        transition: { 
            opacity: { duration: isConverted ? 0.8 : 0.6, delay: isConverted ? 1 : 0 },
            y: { duration: 1.2, delay: 1, ease: "easeOut" }
        }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.8, 
        delay: avatar.delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      style={{
        position: "absolute",
        left: `${avatar.x}%`,
        top: `${avatar.y}%`,
        x: springX,
        y: springY,
        width: avatar.size,
        height: avatar.size,
      }}
      className="pointer-events-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isConverted ? (
          <motion.div
            key="avatar"
            className="w-full h-full rounded-full border-2 border-white shadow-sm overflow-hidden"
            animate={{
              y: [0, avatar.floatRange, 0],
            }}
            transition={{
              duration: avatar.floatSpeed,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src={avatar.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[140px] bg-white p-3 rounded-2xl shadow-xl border border-zinc-100 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Venda concluída</span>
            <span className="text-sm font-black text-[#0c0d0d]">+ R$ {revenueValue}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
