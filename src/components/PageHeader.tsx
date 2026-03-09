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
    <header className={cx("space-y-4 border-b border-slate-200 pb-8", className)}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h1>
      {summary ? (
        <p className="max-w-3xl text-lg leading-7 text-slate-700">{summary}</p>
      ) : null}
      {children}
    </header>
  );
}
