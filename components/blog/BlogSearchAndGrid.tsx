"use client";

import { useMemo, useState } from "react";
import type { ClusterId } from "@/lib/editorial/types";
import { ArticleCard, type EditorialArticleSummary } from "./ArticleCard";

type TopicFilter = "all" | ClusterId;

export function BlogSearchAndGrid({ articles }: { articles: readonly EditorialArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>("all");
  const normalizedQuery = query.trim().toLowerCase();

  const topics = useMemo(
    () => [
      ...new Map(
        articles.map((article) => [
          article.clusterId,
          { id: article.clusterId, label: article.topic },
        ]),
      ).values(),
    ],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    return articles.filter(
      (article) => {
        const matchesTopic = selectedTopic === "all" || article.clusterId === selectedTopic;
        const matchesQuery =
          !normalizedQuery ||
          article.title.toLowerCase().includes(normalizedQuery) ||
          article.summary.toLowerCase().includes(normalizedQuery) ||
          article.topic.toLowerCase().includes(normalizedQuery);

        return matchesTopic && matchesQuery;
      },
    );
  }, [articles, normalizedQuery, selectedTopic]);

  const topicsWithArticles = useMemo(
    () => [...new Set(articles.map((article) => article.topic))]
      .map((topic) => ({ topic, items: articles.filter((article) => article.topic === topic) })),
    [articles],
  );

  const isFiltering = normalizedQuery.length > 0 || selectedTopic !== "all";
  const selectedTopicLabel = topics.find((topic) => topic.id === selectedTopic)?.label;

  return (
    <div>
      <div
        role="search"
        aria-label="Filtros do blog"
        className="flex flex-col rounded-[2rem] border border-zinc-200 bg-white p-2 md:flex-row md:items-center md:rounded-full"
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar artigos</span>
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título ou tema..."
            className="h-11 w-full rounded-full bg-zinc-50 pl-10 pr-4 text-sm font-medium text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:bg-[#F8F5FF] focus:ring-2 focus:ring-[#B597FF]/35 md:bg-transparent"
          />
        </label>

        <div
          role="group"
          aria-label="Filtrar por tema"
          className="mt-2 flex min-w-0 items-center gap-1 overflow-x-auto border-t border-zinc-100 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:ml-2 md:mt-0 md:border-l md:border-t-0 md:pl-2 md:pt-0"
        >
          <button
            type="button"
            aria-pressed={selectedTopic === "all"}
            onClick={() => setSelectedTopic("all")}
            className={`h-9 shrink-0 rounded-full px-4 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8659e7] focus-visible:ring-offset-1 ${
              selectedTopic === "all"
                ? "bg-[#0c0d0d] text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-[#0c0d0d]"
            }`}
          >
            Todos
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selectedTopic === topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`h-9 shrink-0 rounded-full px-4 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#8659e7] focus-visible:ring-offset-1 ${
                selectedTopic === topic.id
                  ? "bg-[#F3EEFF] text-[#5B3DB3]"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-[#0c0d0d]"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {isFiltering ? (
        <div className="mt-10">
          <p className="mb-6 text-sm font-bold uppercase tracking-wide text-zinc-400">
            {filteredArticles.length > 0
              ? `${filteredArticles.length} artigo(s)${normalizedQuery ? ` para “${query}”` : ""}${selectedTopicLabel ? ` em ${selectedTopicLabel}` : ""}`
              : `Nenhum artigo encontrado${normalizedQuery ? ` para “${query}”` : ""}${selectedTopicLabel ? ` em ${selectedTopicLabel}` : ""}`}
          </p>
          {filteredArticles.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
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
