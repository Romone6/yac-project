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
        "inline-flex items-center justify-center rounded-md border border-transparent bg-[var(--green)] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 [&_*]:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
