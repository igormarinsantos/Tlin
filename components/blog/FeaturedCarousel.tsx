"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { formatArticleDate, type EditorialArticleSummary } from "./ArticleCard";
import { CATEGORY_VISUALS } from "./categoryVisuals";

const AUTOPLAY_MS = 6000;

// O topo funciona como stories: indicadores segmentados acima da area visual
// e troca automatica por slide ou arraste. Artigos sem capa aprovada preservam
// o gradiente por categoria como fallback.
export function FeaturedCarousel({
  articles,
}: {
  articles: readonly EditorialArticleSummary[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const showNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % articles.length);
  };

  const showPrevious = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const showStory = (storyIndex: number) => {
    if (storyIndex === index) return;
    setDirection(storyIndex > index ? 1 : -1);
    setIndex(storyIndex);
  };

  useEffect(() => {
    if (articles.length < 2) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % articles.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, articles.length]);

  if (articles.length === 0) return null;

  const article = articles[index];
  const visual = CATEGORY_VISUALS[article.clusterId];
  const slideVariants: Variants = {
    enter: (slideDirection: number) => ({
      x: shouldReduceMotion ? "0%" : slideDirection > 0 ? "100%" : "-100%",
      opacity: shouldReduceMotion ? 1 : 0.82,
      scale: shouldReduceMotion ? 1 : 0.985,
    }),
    center: { x: "0%", opacity: 1, scale: 1 },
    exit: (slideDirection: number) => ({
      x: shouldReduceMotion ? "0%" : slideDirection > 0 ? "-32%" : "32%",
      opacity: shouldReduceMotion ? 1 : 0,
      scale: shouldReduceMotion ? 1 : 0.985,
    }),
  };

  return (
    <div>
      {articles.length > 1 && (
        <div
          className="mb-3 flex gap-1.5 px-1 md:mb-4 md:px-2"
          role="group"
          aria-label="Navegação dos destaques"
        >
          {articles.map((story, storyIndex) => (
            <button
              key={story.slug}
              type="button"
              aria-label={`Mostrar destaque ${storyIndex + 1}: ${story.title}`}
              aria-current={storyIndex === index ? "true" : undefined}
              onClick={() => showStory(storyIndex)}
              className="group/story flex h-5 flex-1 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#8659e7] focus-visible:ring-offset-2"
            >
              <span
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  storyIndex === index
                    ? "bg-gradient-to-r from-[#8659e7] to-[#38E3FF]"
                    : "bg-zinc-200 group-hover/story:bg-zinc-300"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative h-[440px] w-full overflow-hidden rounded-[2.5rem] md:h-[500px] md:rounded-[3rem]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={article.slug}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0 : 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
            drag={articles.length > 1 && !shouldReduceMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -500) {
                showNext();
              } else if (info.offset.x > 60 || info.velocity.x > 500) {
                showPrevious();
              }
            }}
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          >
            {article.heroImage ? (
              <>
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.decorative ? "" : article.heroImage.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 768px) 72rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }}
                />
                <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-white/10 blur-[100px]" />
              </>
            )}

            <div className="relative flex h-full items-end p-4 md:p-8">
              <div className="w-full max-w-xl rounded-[2rem] bg-white p-5 md:rounded-[2.5rem] md:p-8">
                <span
                  className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: `${visual.from}1a`, color: visual.badgeText }}
                >
                  {article.topic}
                </span>
                <h2 className="text-balance text-xl font-black tracking-tight text-[#0c0d0d] md:text-3xl">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500 md:text-base">
                  {article.summary}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400 md:text-sm">
                  <span>{formatArticleDate(article.publishedAt)}</span>
                  <span>{article.readingTimeMinutes} min de leitura</span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-5 inline-flex min-h-10 w-fit items-center justify-center rounded-xl bg-[#0c0d0d] px-5 py-2 font-bold text-white outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#242525] focus-visible:ring-4 focus-visible:ring-[#0c0d0d]/20"
                >
                  Ler artigo
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
