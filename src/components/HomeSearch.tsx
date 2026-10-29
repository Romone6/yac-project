"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { searchPageResources } from "@/lib/site-search";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const visibleResults = useMemo(() => searchPageResources(query.trim()).slice(0, 5), [query]);

  return (
    <div className="relative z-30">
      <form
        id="home-resource-search-form"
        role="search"
        action="/search"
        method="get"
        className="flex min-h-[52px] overflow-hidden rounded-md border border-slate-300 bg-[var(--surface)] shadow-sm focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]/20 sm:min-h-[54px]"
      >
        <label htmlFor="home-resource-search" className="sr-only">
          Search current pathways and tools
        </label>
        <MagnifyingGlass
          aria-hidden="true"
          size={23}
          className="ml-4 shrink-0 self-center text-slate-800"
        />
        <input
          id="home-resource-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          aria-controls="home-resource-search-results"
          placeholder="Search for a course, job, industry or keyword"
          className="min-w-0 flex-1 border-0 !bg-transparent !outline-none !rounded-none px-4 py-3 text-base text-[var(--foreground)] placeholder:text-slate-500 focus-visible:!outline-none"
        />
        <button
          type="submit"
          aria-label="Search current resources"
          className="flex min-h-[52px] shrink-0 items-center justify-center gap-2 bg-[var(--accent)] px-5 text-base font-bold text-white transition hover:bg-[var(--green)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white sm:min-h-[54px]"
        >
          <span>Search</span>
          <ArrowRight aria-hidden="true" size={20} />
        </button>
      </form>
      {query.trim() ? (
        <div
          id="home-resource-search-results"
          role="region"
          aria-label="Search results"
          aria-live="polite"
          className="mt-2 max-h-[min(60vh,28rem)] overflow-y-auto rounded-md border border-[var(--line)] bg-[var(--surface)] p-2 shadow-lg"
        >
          {visibleResults.length > 0 ? (
            <>
              <ul className="divide-y divide-[var(--line)]">
                {visibleResults.map(({ page }) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="flex items-center justify-between gap-4 px-3 py-3 hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--green)]"
                    >
                      <span>
                        <span className="block font-semibold text-[var(--accent)]">
                          {page.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {page.description}
                        </span>
                      </span>
                      <ArrowRight aria-hidden="true" size={18} className="shrink-0 text-[var(--green)]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                className="block border-t border-[var(--line)] px-3 py-3 font-semibold text-[var(--green)] underline underline-offset-4 hover:bg-[var(--accent-soft)]"
              >
                See all pathway results for “{query.trim()}”
              </Link>
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-slate-700">
              <p>Search courses and official pathway sources for “{query.trim()}”.</p>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                className="mt-2 inline-block font-semibold text-[var(--green)] underline underline-offset-4"
              >
                See all pathway results
              </Link>
              <span className="mx-2 text-slate-400">·</span>
              <Link
                href="/toolkit"
                className="inline-block font-semibold text-[var(--green)] underline underline-offset-4"
              >
                Browse all current tools
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
