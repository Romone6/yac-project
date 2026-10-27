import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <article className={cx("border-t border-[var(--line)] py-5", className)}>
      {title ? (
        <h3 className="text-xl font-semibold tracking-tight text-[var(--accent)]">
          {title}
        </h3>
      ) : null}
      <div className={cx(title ? "mt-2" : "", "space-y-3 leading-7 text-slate-700")}>{children}</div>
    </article>
  );
}
