import type { ReactNode } from "react";
import Link from "next/link";
import { cx } from "@/lib/cx";

type SecondaryButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function SecondaryButton({
  href,
  children,
  className,
}: SecondaryButtonProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-sm border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400",
        className
      )}
    >
      {children}
    </Link>
  );
}
