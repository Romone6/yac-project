"use client";

import { useMemo, useState } from "react";
import { cx } from "@/lib/cx";
import {
  filterScholarships,
  formatScholarshipDate,
  formatScholarshipStatus,
  getScholarshipFields,
  getScholarshipInstitutions,
  getScholarshipStudyLevels,
  scholarshipFilterOptions,
  scholarships,
  type ScholarshipStatus,
} from "@/lib/scholarships";

function statusClass(status: ScholarshipStatus) {
  switch (status) {
    case "open": return "bg-emerald-100 text-emerald-900";
    case "closing_soon": return "bg-amber-100 text-amber-950";
    case "upcoming": return "bg-blue-100 text-blue-900";
    case "closed": return "bg-slate-100 text-slate-600";
    case "under_assessment": return "bg-slate-100 text-slate-800";
    case "check_source": return "bg-slate-100 text-slate-700";
  }
}

function humanise(value: string) {
  return value.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

const fieldClass = "mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-base text-[var(--foreground)] focus:border-[var(--green)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]/20";
const labelClass = "block text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]";

export function ScholarshipFinder({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const institutions = useMemo(() => getScholarshipInstitutions(), []);
  const fields = useMemo(() => getScholarshipFields(), []);
  const studyLevels = useMemo(() => getScholarshipStudyLevels(), []);
  const openNow = selectedTags.includes("open-now");
  const closingSoon = selectedTags.includes("closing-soon");
  const eligibilityTags = selectedTags.filter((tag) => tag !== "open-now" && tag !== "closing-soon");

  const results = useMemo(() => filterScholarships({
    query,
    tags: eligibilityTags,
    institution: institution || undefined,
    fieldOfStudy: fieldOfStudy || undefined,
    studyLevel: studyLevel || undefined,
    openNow,
    closingSoon,
    minValue: minValue ? Number(minValue) : undefined,
    maxValue: maxValue ? Number(maxValue) : undefined,
  }), [query, eligibilityTags, institution, fieldOfStudy, studyLevel, openNow, closingSoon, minValue, maxValue]);

  function toggleTag(tag: string) {
    setSelectedTags((current) => current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag]);
  }

  function resetFilters() {
    setQuery("");
    setSelectedTags([]);
    setInstitution("");
    setFieldOfStudy("");
    setStudyLevel("");
    setMinValue("");
    setMaxValue("");
  }

  return (
    <div>
      <section aria-labelledby="scholarship-search-title" className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_12px_32px_rgba(16,35,67,0.05)] sm:p-7">
        <h2 id="scholarship-search-title" className="text-2xl font-extrabold tracking-tight text-[var(--accent)] sm:text-3xl">Search and filter</h2>
        <label htmlFor="scholarship-query" className={`${labelClass} mt-5`}>Search by name, provider or keyword</label>
        <input
          id="scholarship-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try nursing, regional, relocation or equity"
          className={fieldClass}
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className={labelClass} htmlFor="institution">Institution</label>
            <select id="institution" value={institution} onChange={(event) => setInstitution(event.target.value)} className={fieldClass}>
              <option value="">All institutions</option>
              {institutions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="study-level">Study level</label>
            <select id="study-level" value={studyLevel} onChange={(event) => setStudyLevel(event.target.value)} className={fieldClass}>
              <option value="">All levels</option>
              {studyLevels.map((item) => <option key={item} value={item}>{humanise(item)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="field-of-study">Field of study</label>
            <select id="field-of-study" value={fieldOfStudy} onChange={(event) => setFieldOfStudy(event.target.value)} className={fieldClass}>
              <option value="">All fields</option>
              {fields.map((item) => <option key={item} value={item}>{humanise(item)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="minimum-value">Minimum value</label>
            <input id="minimum-value" type="number" min="0" step="100" inputMode="numeric" value={minValue} onChange={(event) => setMinValue(event.target.value)} placeholder="Any amount" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="maximum-value">Maximum value</label>
            <input id="maximum-value" type="number" min="0" step="100" inputMode="numeric" value={maxValue} onChange={(event) => setMaxValue(event.target.value)} placeholder="Any amount" className={fieldClass} />
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className={labelClass}>More ways to narrow your search</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {scholarshipFilterOptions.map((option) => (
              <label key={option.value} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--green)]">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(option.value)}
                  onChange={() => toggleTag(option.value)}
                  className="h-4 w-4 accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
          <p className="text-base text-slate-700" aria-live="polite">
            Showing <strong className="text-slate-950">{results.length}</strong> of {scholarships.length} scholarships
          </p>
          <button type="button" onClick={resetFilters} className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4 hover:text-[var(--green)]">
            Clear all filters
          </button>
        </div>
      </section>

      <section aria-labelledby="scholarship-results-title" className="pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="scholarship-results-title" className="text-2xl font-extrabold text-[var(--accent)] sm:text-3xl">Scholarship results</h2>
          <p className="text-sm text-slate-600">Confirm the current round and eligibility with the provider before applying.</p>
        </div>

        <div className="mt-4 grid gap-5" aria-live="polite">
          {results.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_8px_24px_rgba(16,35,67,0.04)] sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                {item.status !== "check_source" && (
                  <span className={cx("rounded-sm px-2.5 py-1 text-sm font-semibold", statusClass(item.status))}>
                    {formatScholarshipStatus(item.status)}
                  </span>
                )}
                <span className="text-sm text-slate-600">{item.provider}{item.institution !== item.provider ? ` · ${item.institution}` : ""}</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold leading-snug text-[var(--accent)]">{item.scholarship_name}</h3>
              {!item.description.includes("is listed by") && <p className="mt-2 max-w-4xl leading-7 text-slate-700">{item.description}</p>}
              {!item.eligibility_summary.startsWith("Source-backed listing from") && (
                <p className="mt-2 max-w-4xl leading-7 text-slate-700">
                  <strong className="text-slate-900">Eligibility:</strong> {item.eligibility_summary}
                </p>
              )}
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div><dt className="inline font-semibold text-slate-900">Value: </dt><dd className="inline text-slate-700">{item.value_text}</dd></div>
                <div><dt className="inline font-semibold text-slate-900">Closes: </dt><dd className="inline text-slate-700">{item.closes_at ? formatScholarshipDate(item.closes_at) : "Not listed"}</dd></div>
                {item.eligibility_tags.length > 0 && <div className="basis-full"><dt className="inline font-semibold text-slate-900">May suit students who are: </dt><dd className="inline text-slate-700">{item.eligibility_tags.map(humanise).join(", ")}</dd></div>}
              </dl>
              <a href={item.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-semibold text-[var(--accent)] underline decoration-[var(--amber)] underline-offset-4 hover:text-[var(--green)]">
                Visit provider website <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            </article>
          ))}
          {results.length === 0 && (
            <p className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-8 text-center text-slate-700">No scholarships match these filters. Clear the filters or try a broader search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
