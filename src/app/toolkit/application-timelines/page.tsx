"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { cx } from "@/lib/cx";
import {
  applicationTimelineEntries,
  toolkitVerificationDate,
  type TimelineEntry,
} from "@/lib/toolkit-data";

function getStatus(round: TimelineEntry) {
  const now = new Date();
  const closeDate = round.applicationClose ? new Date(round.applicationClose) : null;
  const offerDate = round.offerDate ? new Date(round.offerDate) : null;

  if (offerDate && now > offerDate) return "Past";
  if (closeDate && now > closeDate) return "Closed";
  if (closeDate && now > new Date(closeDate.getTime() - 7 * 24 * 60 * 60 * 1000)) return "Closing Soon";
  if (round.applicationOpen && now < new Date(round.applicationOpen)) return "Upcoming";
  return "Open";
}

function getStatusColor(status: string) {
  switch (status) {
    case "Open":
      return "bg-emerald-100 text-emerald-800";
    case "Closing Soon":
      return "bg-amber-100 text-amber-800";
    case "Closed":
    case "Past":
      return "bg-slate-100 text-slate-500";
    case "Upcoming":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const roundTypes = ["All", "early-entry", "regular", "scholarship"];

export default function ApplicationTimelinesPage() {
  const [selectedUni, setSelectedUni] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const universities = useMemo(
    () => ["All", ...new Set(applicationTimelineEntries.map((entry) => entry.university))],
    []
  );

  const filteredRounds = useMemo(() => {
    return applicationTimelineEntries.filter((r) => {
      if (selectedUni !== "All" && r.university !== selectedUni) return false;
      if (selectedType !== "All" && r.roundType !== selectedType) return false;
      return true;
    });
  }, [selectedUni, selectedType]);

  const sortedRounds = useMemo(() => {
    return [...filteredRounds].sort((a, b) => {
      const dateA = a.applicationClose || a.offerDate || a.applicationOpen || "";
      const dateB = b.applicationClose || b.offerDate || b.applicationOpen || "";
      return dateA.localeCompare(dateB);
    });
  }, [filteredRounds]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, TimelineEntry[]> = {};
    sortedRounds.forEach((round) => {
      const date = round.applicationClose || round.offerDate || round.applicationOpen || "";
      if (!date) return;
      const d = new Date(date);
      const key = `${d.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(round);
    });
    return groups;
  }, [sortedRounds]);

  return (
    <Container className="space-y-8">
      <PageHeader
        eyebrow="Toolkit"
        title="Application Timelines"
        summary="Track verified NSW admissions and early-entry milestones from official UAC or university sources. Each item links back to the source page so students can confirm the live details before applying."
      />

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        This page now only shows source-backed dates that were last checked on{" "}
        <span className="font-semibold">
          {new Date(toolkitVerificationDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        . If a university is missing, it means the current dataset has not been verified to production standard yet.
      </div>

      <Section title="Filters">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              University
            </label>
            <select
              value={selectedUni}
              onChange={(e) => setSelectedUni(e.target.value)}
              className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="w-48">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Round Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              {roundTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t === "early-entry" ? "Early Entry" : t === "regular" ? "Regular" : "Scholarship"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={cx(
                "rounded-sm border px-3 py-2 text-sm font-medium transition",
                viewMode === "list"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cx(
                "rounded-sm border px-3 py-2 text-sm font-medium transition",
                viewMode === "calendar"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              )}
            >
              Timeline
            </button>
          </div>
        </div>
      </Section>

      {viewMode === "list" ? (
        <Section title={`${sortedRounds.length} deadlines`}>
          <div className="space-y-3">
            {sortedRounds.map((round) => {
              const status = getStatus(round);
              return (
                <div
                  key={round.id}
                  className="rounded-sm border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cx(
                            "rounded-sm px-2 py-0.5 text-xs font-semibold",
                            getStatusColor(status)
                          )}
                        >
                          {status}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-slate-400">
                          {round.roundType === "early-entry"
                            ? "Early Entry"
                            : round.roundType === "scholarship"
                            ? "Scholarship"
                            : "Regular"}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-slate-900">
                        {round.roundName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{round.university}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{round.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                        Source: {round.sourceLabel} · Last verified {round.lastVerified}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Opens</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(round.applicationOpen)}
                        {round.applicationOpen && ` ${formatTime(round.applicationOpen)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Closes</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(round.applicationClose)}
                        {round.applicationClose && ` ${formatTime(round.applicationClose)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Offers</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(round.offerDate)}
                        {round.offerDate && ` ${formatTime(round.offerDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={round.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                    >
                      Official page →
                    </a>
                  </div>
                </div>
              );
            })}
            {sortedRounds.length === 0 && (
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No deadlines match your filters.
              </div>
            )}
          </div>
        </Section>
      ) : (
        <Section title="Timeline">
          <div className="space-y-8">
            {Object.entries(groupedByMonth).map(([month, rounds]) => (
              <div key={month}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {month}
                </h3>
                <div className="space-y-2">
                  {rounds.map((round) => {
                    const status = getStatus(round);
                    const closeDate =
                      round.applicationClose || round.offerDate || round.applicationOpen || "";
                    return (
                      <div
                        key={round.id}
                        className="flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4"
                      >
                        <div className="w-28 shrink-0 text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatDate(closeDate)}
                          </p>
                        </div>
                        <div className="h-8 w-px shrink-0 bg-slate-200" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cx(
                                "rounded-sm px-2 py-0.5 text-xs font-semibold",
                                getStatusColor(status)
                              )}
                            >
                              {status}
                            </span>
                            <p className="text-sm font-medium text-slate-900">{round.roundName}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{round.university}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {round.sourceLabel} · verified {round.lastVerified}
                          </p>
                        </div>
                        <a
                          href={round.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-xs text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                        >
                          Link →
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
}
