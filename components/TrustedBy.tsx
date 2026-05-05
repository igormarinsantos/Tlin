"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Meta", src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.svg" },
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "OpenAI", src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "AWS", src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Stripe", src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "HubSpot", src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" },
  { name: "Salesforce", src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
];

export function TrustedBy() {
  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Label */}
          <div className="shrink-0 flex items-center gap-6">
            <p className="text-zinc-400 font-bold text-xs md:text-sm leading-tight text-center md:text-left">
              Confiança para <br className="hidden md:block" /> escalar sua operação
            </p>
            <div className="h-10 w-[1px] bg-zinc-200 hidden md:block" />
          </div>

          {/* Carousel */}
          <div className="flex-1 relative overflow-hidden">
            {/* Gradients to fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            
            <motion.div 
              className="flex items-center gap-16 md:gap-24 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ willChange: "transform" }}
            >
              {/* Double the logos for seamless loop */}
              {[...logos, ...logos].map((logo, idx) => (
                <div key={idx} className="shrink-0 flex items-center">
                  <Image 
                    src={logo.src} 
                    alt={logo.name}
                    width={96}
                    height={24}
                    className="h-5 md:h-6 w-auto grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"
                    style={{ width: 'auto', height: '24px' }}
                    loading="lazy"
                    unoptimized
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
