"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";

const searchableResources = [
  {
    title: "Explore all current tools",
    description: "Browse the Pathway to Entry toolkit.",
    href: "/toolkit",
    terms: "toolkit tools resources after school regional pathways tafe training apprenticeship trade work career",
  },
  {
    title: "University subject and course information",
    description: "Compare HSC subject signals across available NSW courses.",
    href: "/toolkit/subject-alignment",
    terms: "university course degree subject subjects atar selection study",
  },
  {
    title: "Scholarships and support",
    description: "Search current scholarships, bursaries and student support.",
    href: "/scholarships",
    terms: "scholarship bursary funding money equity relocation accommodation grant",
  },
  {
    title: "Application dates and timelines",
    description: "Find admissions, early-entry and scholarship milestones.",
    href: "/toolkit/application-timelines",
    terms: "application dates deadline timeline deadlines close open admissions early entry",
  },
  {
    title: "Financial pathways",
    description: "Read about HELP loans, student payments and regional support.",
    href: "/toolkit/financial-pathways",
    terms: "financial finance cost costs help loan hecs payment support tertiary access regional",
  },
  {
    title: "Research and consultation",
    description: "Read the project’s consultation findings and evidence.",
    href: "/research",
    terms: "research consultation student voice report evidence findings",
  },
];

const ignoredTerms = new Set(["a", "and", "for", "in", "me", "my", "the", "to"]);

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const terms = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term && !ignoredTerms.has(term)),
    [query],
  );
  const results = useMemo(
    () =>
      terms.length === 0
        ? []
        : searchableResources.filter((resource) => {
            const searchableText =
              `${resource.title} ${resource.description} ${resource.terms}`.toLowerCase();
            return terms.some((term) => searchableText.includes(term));
          }),
    [terms],
  );
  const visibleResults = results;

  return (
    <div className="relative">
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
          className="absolute left-0 right-0 top-full z-20 mt-2 border border-[var(--line)] bg-[var(--surface)] p-2 shadow-lg"
        >
          {visibleResults.length > 0 ? (
            <>
              <ul className="divide-y divide-[var(--line)]">
                {visibleResults.slice(0, 5).map((result) => (
                  <li key={result.href}>
                    <Link
                      href={result.href}
                      className="flex items-center justify-between gap-4 px-3 py-3 hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--green)]"
                    >
                      <span>
                        <span className="block font-semibold text-[var(--accent)]">
                          {result.title}
                        </span>
                        <span className="mt-1 block text-sm text-slate-600">
                          {result.description}
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
