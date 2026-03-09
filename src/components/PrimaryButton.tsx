import type { ReactNode } from "react";
import Link from "next/link";
import { cx } from "@/lib/cx";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function PrimaryButton({ href, children, className }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-sm border border-transparent bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 [&_*]:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
