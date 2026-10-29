"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
import centres from "../../data/support/nsw/study-hubs.json";

export function SupportDirectory() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return centres.filter((centre) => {
      const text = `${centre.name} ${centre.location} ${centre.programType} university study hub regional suburban community centre`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query]);
  const regionalCount = centres.filter((centre) => centre.programType === "regional").length;
  const suburbanCount = centres.filter((centre) => centre.programType === "suburban").length;

  return (
    <>
      <form role="search" onSubmit={(event) => event.preventDefault()} className="flex max-w-2xl items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]/20">
        <MagnifyingGlass aria-hidden="true" size={21} className="shrink-0 text-[var(--foreground)]" />
        <label className="sr-only" htmlFor="support-search">Search by town or centre</label>
        <input id="support-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a town or centre" className="min-w-0 flex-1 !border-0 !bg-transparent !outline-none !rounded-none px-1 py-4 focus-visible:!outline-none" />
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">Showing {results.length} of {centres.length} NSW University Study Hubs ({regionalCount} regional and {suburbanCount} suburban). Ask each centre about current opening hours, registration, facilities and access.</p>
      <ul className="mt-4 grid gap-x-8 md:grid-cols-2">
        {results.map((centre) => (
          <li id={centre.id} key={centre.id} className="border-t border-[var(--line)] py-5">
            <p className="text-sm font-semibold text-[var(--green)]">{centre.programType === "suburban" ? "Suburban University Study Hub" : "Regional University Study Hub"} · {centre.location}</p>
            <h2 className="mt-1 text-xl font-bold">{centre.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">A community-led study centre. Facilities and registration are set locally; check the centre’s official site for current details.</p>
            <a href={centre.officialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold text-[var(--green)] underline underline-offset-4">Visit centre site <ArrowRight aria-hidden="true" size={17} /></a>
            {centre.crossCheckUrl && <a href={centre.crossCheckUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)] underline underline-offset-4">Cross-check in the national hub network <ArrowUpRight aria-hidden="true" size={16} /></a>}
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="border-y border-[var(--line)] py-8 text-center text-[var(--muted)]">No matching hub. Try another town or search the <a className="font-semibold text-[var(--green)] underline" href="https://www.education.gov.au/access-and-participation/university-study-hubs">Australian Government hub finder</a> and the <a className="font-semibold text-[var(--green)] underline" href="https://www.regionaluniversitystudyhubsnetwork.edu.au/locations">Regional University Study Hubs Network</a>.</p>}
    </>
  );
}
