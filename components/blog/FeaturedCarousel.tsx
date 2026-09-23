"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { formatArticleDate, type EditorialArticleSummary } from "./ArticleCard";
import { CATEGORY_VISUALS } from "./categoryVisuals";
import { ArrowRightIcon } from "./icons";

const AUTOPLAY_MS = 6000;

// Carrossel de posts em destaque -- cada slide usa um gradiente por
// categoria como "fundo" (o site nao tem fotografia pra capa de post, ver
// categoryVisuals.ts). O texto fica dentro de um container branco por cima
// do degrade (nao direto sobre ele com scrim escuro) -- sem setas de
// navegacao manual, so autoplay + dots.
export function FeaturedCarousel({ articles }: { articles: readonly EditorialArticleSummary[] }) {
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
  const visual = CATEGORY_VISUALS[article.clusterId];

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

          <div className="relative h-full flex items-end p-4 md:p-8">
            <div className="w-full max-w-xl bg-white rounded-2xl md:rounded-3xl p-5 md:p-8">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ backgroundColor: `${visual.from}1a`, color: visual.badgeText }}
              >
                {article.topic}
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight text-[#0c0d0d] text-balance">
                {article.title}
              </h2>
              <p className="mt-3 text-sm md:text-base text-zinc-500 leading-relaxed line-clamp-2">
                {article.summary}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs md:text-sm text-zinc-400">
                <span>{formatArticleDate(article.publishedAt)}</span>
                <span>{article.readingTimeMinutes} min de leitura</span>
              </div>
              <Link
                href={`/blog/${article.slug}`}
                className="mt-5 flex items-center gap-1.5 w-fit font-bold text-[#0c0d0d] transition-colors hover:text-[#8659e7]"
              >
                Ler artigo
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {articles.length > 1 && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
          {articles.map((a, i) => (
            <button
              key={a.slug}
              aria-label={`Ir para o post ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
