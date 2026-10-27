import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "editorial" | "boxed";
};

export function Card({ title, children, className, variant = "editorial" }: CardProps) {
  if (variant === "boxed") {
    return (
      <div className={cx("rounded-sm border border-slate-200 bg-white p-6", className)}>
        {title ? (
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
        ) : null}
        <div className={cx(title ? "mt-3" : "", "space-y-3")}>{children}</div>
      </div>
    );
  }

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
