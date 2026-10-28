"use client";

import { useEffect, useMemo, useState } from "react";

const budgetItems = [
  { name: "Travel to inspect or move", type: "one-off" },
  { name: "Bond and accommodation setup", type: "one-off" },
  { name: "Course materials, tools or uniform", type: "one-off" },
  { name: "Computer or study equipment", type: "one-off" },
  { name: "Rent and utilities", type: "monthly" },
  { name: "Food and household costs", type: "monthly" },
  { name: "Local and regional transport", type: "monthly" },
  { name: "Phone, internet and study costs", type: "monthly" },
] as const;

const storageKey = "pathway-to-entry-budget-v1";

export function BudgetWorksheet() {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            setAmounts(Object.fromEntries(Object.entries(parsed).filter(([key, value]) => budgetItems.some((item) => item.name === key) && typeof value === "string")));
          }
        }
      } catch {
        // The worksheet remains usable in memory if device storage is unavailable.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (Object.values(amounts).some(Boolean)) localStorage.setItem(storageKey, JSON.stringify(amounts));
      else localStorage.removeItem(storageKey);
    } catch {
      // Do not block planning if the browser refuses local storage.
    }
  }, [amounts, ready]);

  const totals = useMemo(() => budgetItems.reduce((sum, item) => {
    const amount = Number(amounts[item.name]);
    if (Number.isFinite(amount) && amount >= 0) sum[item.type] += amount;
    return sum;
  }, { "one-off": 0, monthly: 0 }), [amounts]);

  const money = (value: number) => new Intl.NumberFormat("en-AU", {
    style: "currency", currency: "AUD", maximumFractionDigits: 2,
  }).format(value);

  return (
    <section aria-labelledby="budget-worksheet-title" className="border-y border-[var(--line)] py-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--green)]">Your own estimates</p>
        <h2 id="budget-worksheet-title" className="mt-2 text-2xl font-bold">Make a simple moving or study budget</h2>
        <p className="mt-2 leading-7 text-[var(--muted)]">Add your own estimates. No typical costs are assumed. Amounts stay in this browser on this device and are not sent to Pathway to Entry.</p>
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-3 md:grid-cols-2">
        {budgetItems.map((item) => (
          <label key={item.name} className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-3 text-sm">
            <span>{item.name}<span className="mt-1 block text-xs text-[var(--muted)]">{item.type === "monthly" ? "Monthly amount" : "One-off amount"}</span></span>
            <span className="flex shrink-0 items-center gap-1 text-[var(--muted)]">
              <span aria-hidden="true">$</span>
              <input type="number" min="0" step="0.01" inputMode="decimal" aria-label={`${item.name} amount in Australian dollars`} value={amounts[item.name] ?? ""} onChange={(event) => setAmounts((current) => ({ ...current, [item.name]: event.target.value }))} className="w-28 rounded border border-[var(--line)] bg-[var(--surface)] px-2 py-2 text-right text-[var(--foreground)]" />
            </span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-md bg-[var(--accent-soft)] p-4">
        <p className="font-semibold">One-off: {money(totals["one-off"])} <span className="mx-2 text-[var(--muted)]">·</span> Monthly: {money(totals.monthly)}</p>
        <div className="flex gap-4">
          <button type="button" onClick={() => window.print()} className="font-semibold text-[var(--green)] underline underline-offset-4">Print</button>
          <button type="button" onClick={() => setAmounts({})} className="font-semibold text-[var(--green)] underline underline-offset-4">Clear estimates</button>
        </div>
      </div>
    </section>
  );
}
