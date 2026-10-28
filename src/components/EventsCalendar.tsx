"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";

export type CalendarRecord = {
  id: string;
  type: "deadline" | "offer" | "event";
  title: string;
  provider: string;
  audience: string;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  location: string;
  summary: string;
  officialUrl: string;
  crossCheckUrl?: string;
  checkedAt: string;
};

const typeLabels = { deadline: "Deadline", offer: "Offer or outcome", event: "Event" };
const dateTimeFormat = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });

function eventDate(record: CalendarRecord) {
  const start = new Date(record.startAt);
  if (!record.allDay) return dateTimeFormat.format(start);
  const utcDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };
  const startLabel = new Intl.DateTimeFormat("en-AU", { timeZone: "UTC", day: "numeric", month: "short" }).format(utcDate(record.startAt));
  if (!record.endAt) return `${startLabel} ${start.getUTCFullYear()}`;
  const end = utcDate(record.endAt); end.setUTCDate(end.getUTCDate() - 1);
  return `${startLabel}–${new Intl.DateTimeFormat("en-AU", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }).format(end)}`;
}

function escapeIcs(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

function downloadCalendar(records: CalendarRecord[]) {
  const events = records.map((record) => {
    const dateProperty = (value: string) => value.includes("T")
      ? `DTSTART:${new Date(value).toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z")}`
      : `DTSTART;VALUE=DATE:${value.replaceAll("-", "")}`;
    const lines = ["BEGIN:VEVENT", `UID:${record.id}@pathwaytoentry.org.au`, dateProperty(record.startAt), `SUMMARY:${escapeIcs(record.title)}`, `DESCRIPTION:${escapeIcs(`${record.summary} Official information: ${record.officialUrl}`)}`, `URL:${record.officialUrl}`];
    if (record.endAt) lines.push(record.endAt.includes("T") ? `DTEND:${new Date(record.endAt).toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z")}` : `DTEND;VALUE=DATE:${record.endAt.replaceAll("-", "")}`);
    return [...lines, "END:VEVENT"].join("\r\n");
  });
  const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pathway to Entry//Events and deadlines//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "pathway-to-entry-dates.ics"; link.click(); URL.revokeObjectURL(url);
}

export function EventsCalendar({ records }: { records: CalendarRecord[] }) {
  const [type, setType] = useState("all");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const upcoming = useMemo(() => records
    .filter((record) => now === null || new Date(record.endAt ?? record.startAt).getTime() >= now)
    .filter((record) => type === "all" || record.type === type)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()), [now, records, type]);

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4 border-y border-[var(--line)] py-5">
        <label className="font-semibold">Show
          <select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 block min-w-64 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-3 font-normal">
            <option value="all">All upcoming dates</option><option value="deadline">Deadlines</option><option value="offer">Offers and outcomes</option><option value="event">Events</option>
          </select>
        </label>
        <button type="button" disabled={!upcoming.length} onClick={() => downloadCalendar(upcoming)} className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-3 font-semibold text-white disabled:opacity-50"><ArrowDown aria-hidden="true" size={18} />Download .ics</button>
      </section>
      <p className="mt-3 text-sm text-[var(--muted)]">{upcoming.length} confirmed upcoming {upcoming.length === 1 ? "date" : "dates"}. Sources reviewed 28 October 2026. Always confirm details with the organizer before applying or attending.</p>
      {upcoming.length ? (
        <ol className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {upcoming.map((record) => (
            <li key={record.id} className="grid gap-4 py-5 md:grid-cols-[12rem_1fr_auto] md:items-start">
              <p className="font-bold text-[var(--green)]">{eventDate(record)}</p>
              <div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-wide text-[var(--green)]">{typeLabels[record.type]}</span><span className="text-sm text-[var(--muted)]">{record.provider}</span></div><h2 className="mt-1 text-xl font-bold">{record.title}</h2><p className="mt-2 leading-6 text-[var(--muted)]">{record.summary}</p><p className="mt-2 text-sm"><strong>For:</strong> {record.audience}</p><p className="mt-1 text-sm text-[var(--muted)]">{record.location}</p><p className="mt-2 text-xs text-[var(--muted)]">Source checked 28 October 2026</p></div>
              <div className="flex flex-col items-start gap-2"><a href={record.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-[var(--green)] underline underline-offset-4">Official details <ArrowUpRight aria-hidden="true" size={17} /></a>{record.crossCheckUrl && <a href={record.crossCheckUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--green)] underline underline-offset-4">Cross-check date <ArrowUpRight aria-hidden="true" size={15} /></a>}</div>
            </li>
          ))}
        </ol>
      ) : <p className="border-y border-[var(--line)] py-8 text-center text-[var(--muted)]">No upcoming dates match this filter.</p>}
      <p className="border-t border-[var(--line)] pt-5 text-sm leading-6 text-[var(--muted)]">This is a reviewed selection, not a complete statewide calendar. University key dates, including course census dates, vary by provider and course; check the <a href="https://uac.edu.au/key-dates/" target="_blank" rel="noreferrer" className="font-semibold text-[var(--green)] underline">UAC dates</a> and your provider&apos;s current page.</p>
    </>
  );
}
