"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogArticle } from "@/lib/blog";
import { formatArticleDate } from "@/lib/blog";
import { CATEGORY_VISUALS } from "./categoryVisuals";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

const AUTOPLAY_MS = 6000;

// Carrossel de posts em destaque -- cada slide usa um gradiente por
// categoria como "fundo" (o site nao tem fotografia pra capa de post, ver
// categoryVisuals.ts) com um scrim escuro embaixo pra legibilidade do
// texto sobreposto, igual um carrossel de noticia de verdade.
export function FeaturedCarousel({ articles }: { articles: BlogArticle[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || articles.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, articles.length]);

  if (articles.length === 0) return null;

  const article = articles[index];
  const visual = CATEGORY_VISUALS[article.category];

  return (
    <div
      className="relative w-full h-[420px] md:h-[480px] rounded-3xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={article.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
          />
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6 md:p-12">
            <span
              className="self-start px-3 py-1.5 rounded-full bg-white text-xs font-bold uppercase tracking-wide mb-4"
              style={{ color: visual.badgeText }}
            >
              {article.category}
            </span>
            <h2 className="max-w-2xl text-2xl md:text-4xl font-black tracking-tight text-white text-balance">
              {article.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm md:text-base text-white/80 leading-relaxed line-clamp-2">
              {article.description}
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs md:text-sm text-white/70">
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>{article.readingTime}</span>
            </div>
            <Link
              href={`/blog/${article.slug}`}
              className="mt-6 self-start flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0c0d0d] transition hover:bg-gradient-to-r hover:from-[#B597FF] hover:to-[#38E3FF]"
            >
              Ler artigo
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {articles.length > 1 && (
        <>
          <button
            aria-label="Post anterior"
            onClick={() => setIndex((prev) => (prev - 1 + articles.length) % articles.length)}
            className="absolute left-4 top-4 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeftIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            aria-label="Próximo post"
            onClick={() => setIndex((prev) => (prev + 1) % articles.length)}
            className="absolute right-4 top-4 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowRightIcon className="w-[18px] h-[18px]" />
          </button>

          <div className="absolute bottom-6 right-6 md:right-12 flex gap-2">
            {articles.map((a, i) => (
              <button
                key={a.slug}
                aria-label={`Ir para o post ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
