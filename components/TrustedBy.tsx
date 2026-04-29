"use client";

import { motion } from "framer-motion";

export function TrustedBy() {
  return (
    <section className="w-full py-12 bg-white flex flex-col items-center">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="w-full max-w-5xl flex flex-col items-center opacity-40"
        >
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 px-4 grayscale opacity-60">
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.svg" alt="Meta" className="h-4 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" className="h-4 w-auto" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-auto" />
            </div>
        </motion.div>
    </section>
  );
}
