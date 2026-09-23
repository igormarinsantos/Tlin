"use client";

import { useMemo, useState } from "react";
import { ArticleCard, type EditorialArticleSummary } from "./ArticleCard";

export function BlogSearchAndGrid({ articles }: { articles: readonly EditorialArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return null;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.summary.toLowerCase().includes(normalizedQuery) ||
        article.topic.toLowerCase().includes(normalizedQuery)
    );
  }, [articles, normalizedQuery]);

  const topicsWithArticles = useMemo(
    () => [...new Set(articles.map((article) => article.topic))]
      .map((topic) => ({ topic, items: articles.filter((article) => article.topic === topic) })),
    [articles],
  );

  return (
    <div>
      <div className="relative max-w-md">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou tema..."
          className="w-full rounded-full border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#B597FF] transition-colors"
        />
      </div>

      {searchResults ? (
        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-6">
            {searchResults.length > 0 ? `${searchResults.length} resultado(s) para "${query}"` : `Nada encontrado para "${query}"`}
          </p>
          {searchResults.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-14 space-y-16">
          {topicsWithArticles.map(({ topic, items }) => (
            <div key={topic}>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#0c0d0d] mb-6">{topic}</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
