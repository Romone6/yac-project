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
        "inline-flex items-center rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-xs uppercase tracking-[0.16em] text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}
