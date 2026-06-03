"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Notification {
  id: number;
  value: string;
  time: string;
  name: string;
  avatar: string;
}

const profiles = [
  { name: "Ricardo M.", avatar: "/lotties/avatars/2_avatar.webp" },
  { name: "Ana Paula", avatar: "/lotties/avatars/1_avatar.webp" },
  { name: "Bruno S.", avatar: "/lotties/avatars/3_avatar.webp" },
  { name: "Carla F.", avatar: "/lotties/avatars/6_avatar.webp" },
  { name: "Lucas G.", avatar: "/lotties/avatars/9_avatar.webp" },
  { name: "Juliana K.", avatar: "/lotties/avatars/10_avatar.webp" },
  { name: "Roberto T.", avatar: "/lotties/avatars/5_avatar.webp" },
  { name: "Mariana L.", avatar: "/lotties/avatars/7_avatar.webp" },
  { name: "Sônia R.", avatar: "/lotties/avatars/4_avatar.webp" },
  { name: "Fernando H.", avatar: "/lotties/avatars/8_avatar.webp" }
];

const values = ["R$ 450,00", "R$ 1.200,00", "R$ 890,00", "R$ 3.500,00", "R$ 670,00", "R$ 2.100,00"];

export function SalesNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      const profile = profiles[Math.floor(Math.random() * profiles.length)];
      const newNotif = {
        id: Date.now(),
        name: profile.name,
        value: values[Math.floor(Math.random() * values.length)],
        avatar: profile.avatar,
        time: t.salesNotification.now,
      };
      setNotifications(prev => [...prev.slice(-4), newNotif]);
    }, 2000);

    return () => clearInterval(interval);
  }, [t.salesNotification.now]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end p-4 md:p-6 gap-2 overflow-hidden pointer-events-none">
      {/* Background Animated Blob (Subtle) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#B597FF]/10 to-[#38E3FF]/10 blur-[100px] rounded-full pointer-events-none"
      />
      
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((notif, index) => {
          const isLast = index === notifications.length - 1;
          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: isLast ? 1 : 0.96,
                zIndex: index 
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 20,
              }}
              className="w-full max-w-[320px] bg-white rounded-2xl p-4 border border-zinc-100 flex items-start gap-3 origin-bottom relative z-10 hover:bg-zinc-50 transition-colors duration-300"
            >
              {/* iOS Style Avatar with App Icon */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-white/40 shadow-sm">
                  <img src={notif.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                {/* WhatsApp Badge - Reverted to Green */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[15px] font-bold text-black tracking-tight leading-tight">
                    {notif.name}
                  </p>
                  <span className="text-[12px] text-black/40 font-medium tracking-tight">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[14px] text-black/80 leading-snug font-semibold line-clamp-2">
                  {t.salesNotification.purchaseOf} <span className="text-black font-black">{notif.value}</span> {t.salesNotification.viaWhatsapp}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
    </div>
  );
}
