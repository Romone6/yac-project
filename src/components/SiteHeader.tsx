import Link from "next/link";
import { Container } from "@/components/Container";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/toolkit", label: "Toolkit" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/timelines", label: "Timelines" },
  { href: "/research", label: "Research" },
  { href: "/get-involved", label: "Get Involved" },
];

function PathwayLogo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--accent)] text-white">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-9 w-9"
        fill="none"
      >
        <path
          d="M13 38V16.5L24 9l11 7.5V38"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 38V25h8v13"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M7 38h34"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M11 31c6-2 12-2 18-1l7 1.5"
          stroke="#f6b44b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M31 25h8m0 0-3-3m3 3-3 3"
          stroke="#9fc8a5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]">
      <Container className="flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <PathwayLogo />
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              NSW Youth Advisory Council-aligned initiative
            </p>
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-slate-950"
            >
              Pathway to Entry
            </Link>
            <p className="text-sm text-slate-600">
              Regional NSW post-school pathways toolkit.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm text-slate-700 md:justify-end">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-1 underline decoration-transparent underline-offset-4 transition hover:bg-[var(--accent-soft)] hover:decoration-slate-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
