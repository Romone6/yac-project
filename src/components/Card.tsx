import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={cx("rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_12px_32px_rgba(16,35,67,0.06)] sm:p-7", className)}>
      {title ? (
        <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          {title}
        </h3>
      ) : null}
      <div className={cx(title ? "mt-3" : "", "space-y-3")}>{children}</div>
    </div>
  );
}
