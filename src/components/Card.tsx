import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
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
