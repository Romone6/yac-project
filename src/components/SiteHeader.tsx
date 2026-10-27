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
    <img src="/school-icon.svg" alt="" aria-hidden="true" className="h-12 w-12 rounded-sm" />
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]">
      <Container className="flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <PathwayLogo />
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              Regional NSW · Post-school pathways
            </p>
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-slate-950"
            >
              Pathway to Entry
            </Link>
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
