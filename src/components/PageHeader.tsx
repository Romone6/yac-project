import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type PageHeaderProps = {
  title: string;
  summary?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  summary,
  eyebrow,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cx("relative space-y-4 border-b border-[var(--line)] pb-9 sm:pb-11", className)}>
      {eyebrow ? (
        <p className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--green)]">
          <span aria-hidden="true" className="h-0.5 w-8 bg-[var(--amber)]" />
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-4xl text-[clamp(2.35rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[var(--foreground)]">
        {title}
      </h1>
      {summary ? (
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">{summary}</p>
      ) : null}
      {children}
    </header>
  );
}
