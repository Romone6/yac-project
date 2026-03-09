import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type SectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cx("space-y-4", className)}>
      {title ? (
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
