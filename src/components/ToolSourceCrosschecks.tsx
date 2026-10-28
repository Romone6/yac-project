import sourcesByTool from "../../data/cross-references/tool-sources.json";

type ToolKey = keyof typeof sourcesByTool;

export function ToolSourceCrosschecks({ tool, title = "Cross-check with other sources" }: { tool: ToolKey; title?: string }) {
  const sources = sourcesByTool[tool];

  return (
    <section aria-labelledby={`${tool}-source-crosschecks`} className="border-t border-[var(--line)] pt-6">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--green)]">Source cross-checks</p>
      <h2 id={`${tool}-source-crosschecks`} className="mt-2 text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-3xl leading-7 text-[var(--muted)]">Official sources control current dates, eligibility, fees, availability and provider requirements. Independent sources help broaden discovery or add context; check actionable details with the responsible organisation.</p>
      <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {sources.map((source) => (
          <li key={source.url} className="border-t border-[var(--line)] py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--green)]">{source.kind === "official" ? "Official source" : "Independent source"}</p>
            <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-[var(--green)] underline underline-offset-4">{source.name}</a>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{source.purpose}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Use: {source.limits}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[var(--muted)]">Source list reviewed 28 October 2026.</p>
    </section>
  );
}
