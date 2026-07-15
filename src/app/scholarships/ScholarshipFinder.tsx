"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { cx } from "@/lib/cx";
import {
  filterScholarships,
  formatScholarshipDate,
  formatScholarshipStatus,
  getScholarshipFreshness,
  getScholarshipFields,
  getScholarshipInstitutions,
  getScholarshipStudyLevels,
  scholarshipFilterOptions,
  scholarships,
  type ScholarshipStatus,
} from "@/lib/scholarships";

function getStatusClass(status: ScholarshipStatus) {
  switch (status) {
    case "open":
      return "bg-emerald-100 text-emerald-800";
    case "closing_soon":
      return "bg-amber-100 text-amber-900";
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "under_assessment":
      return "bg-slate-100 text-slate-700";
    case "closed":
      return "bg-slate-200 text-slate-500";
    case "check_source":
      return "bg-orange-100 text-orange-900";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function humaniseToken(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ScholarshipFinder() {
  const [query, setQuery] = useState("");
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
  const eligibilityTags = selectedTags.filter(
    (tag) => tag !== "open-now" && tag !== "closing-soon"
  );

  const results = useMemo(
    () =>
      filterScholarships({
        query,
        tags: eligibilityTags,
        institution: institution || undefined,
        fieldOfStudy: fieldOfStudy || undefined,
        studyLevel: studyLevel || undefined,
        openNow,
        closingSoon,
        minValue: minValue ? Number(minValue) : undefined,
        maxValue: maxValue ? Number(maxValue) : undefined,
      }),
    [
      query,
      eligibilityTags,
      institution,
      fieldOfStudy,
      studyLevel,
      openNow,
      closingSoon,
      minValue,
      maxValue,
    ]
  );

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
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
    <div className="space-y-10">
      <Section title="Search And Filter">
        <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search scholarships
              </label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try regional, nursing, relocation, equity..."
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Institution
              </label>
              <select
                value={institution}
                onChange={(event) => setInstitution(event.target.value)}
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="">All institutions</option>
                {institutions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Study level
              </label>
              <select
                value={studyLevel}
                onChange={(event) => setStudyLevel(event.target.value)}
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="">All study levels</option>
                {studyLevels.map((item) => (
                  <option key={item} value={item}>
                    {humaniseToken(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Field of study
              </label>
              <select
                value={fieldOfStudy}
                onChange={(event) => setFieldOfStudy(event.target.value)}
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="">All fields</option>
                {fields.map((item) => (
                  <option key={item} value={item}>
                    {humaniseToken(item)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Minimum value
              </label>
              <input
                value={minValue}
                onChange={(event) => setMinValue(event.target.value)}
                inputMode="numeric"
                placeholder="Any"
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Maximum value
              </label>
              <input
                value={maxValue}
                onChange={(event) => setMaxValue(event.target.value)}
                inputMode="numeric"
                placeholder="Any"
                className="w-full rounded-sm border border-[var(--line)] bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {scholarshipFilterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleTag(option.value)}
                className={cx(
                  "rounded-sm border px-3 py-1.5 text-xs font-semibold transition",
                  selectedTags.includes(option.value)
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--line)] bg-white text-slate-700 hover:border-[var(--green)]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4 text-sm text-slate-600">
            <p>
              Showing <span className="font-semibold text-slate-900">{results.length}</span>{" "}
              of {scholarships.length} source-backed records.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-[var(--accent)] underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            >
              Reset filters
            </button>
          </div>
        </div>
      </Section>

      <Section title="Scholarship Results">
        <div className="grid gap-5">
          {results.map((item) => {
            const freshness = getScholarshipFreshness(item.last_verified_at);

            return <Card
              key={item.id}
              title={item.scholarship_name}
              className="bg-[var(--surface)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cx(
                        "rounded-sm px-2 py-1 text-xs font-semibold",
                        getStatusClass(item.status)
                      )}
                    >
                      {formatScholarshipStatus(item.status)}
                    </span>
                    <span className="rounded-sm bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--green)]">
                      Source-backed
                    </span>
                    <span className={cx(
                      "text-xs uppercase tracking-wide",
                      freshness.stale ? "text-amber-700" : "text-slate-400"
                    )}>
                      {freshness.stale ? "Check source - " : ""}{freshness.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.provider}
                    {item.institution !== item.provider ? ` / ${item.institution}` : ""}
                  </p>
                  <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                  <p className="text-sm leading-6 text-slate-700">
                    <span className="font-semibold text-slate-900">Eligibility: </span>
                    {item.eligibility_summary}
                  </p>
                </div>
                <div className="min-w-48 rounded-sm border border-[var(--line)] bg-white p-4 text-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Value</p>
                  <p className="mt-1 font-semibold text-slate-900">{item.value_text}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Closing date</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatScholarshipDate(item.closes_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {item.eligibility_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-[var(--line)]"
                  >
                    {humaniseToken(tag)}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-4 text-sm md:flex-row md:items-center md:justify-between">
                <p className="text-slate-600">{item.notes}</p>
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 font-semibold text-[var(--accent)] underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                >
                  Official source link
                </a>
              </div>
            </Card>;
          })}
          {results.length === 0 ? (
            <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-8 text-center text-sm text-slate-600">
              No scholarships match those filters. Reset filters or check the official
              provider pages for newer rounds.
            </div>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
