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
        "inline-flex items-center justify-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-base font-bold text-[var(--foreground)] transition hover:border-[var(--green)] hover:bg-[var(--accent-soft)]",
        className
      )}
    >
      {children}
    </Link>
  );
}
