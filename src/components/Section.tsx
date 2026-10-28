import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type SectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cx("space-y-6", className)}>
      {title ? (
        <h2 className="flex items-center gap-3 text-[clamp(1.65rem,3vw,2.1rem)] font-extrabold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
          <span aria-hidden="true" className="h-7 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
          <span>{title}</span>
        </h2>
      ) : null}
      {children}
    </section>
  );
}
