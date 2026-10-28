import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--foreground)]",
        className
      )}
    >
      {children}
    </span>
  );
}
