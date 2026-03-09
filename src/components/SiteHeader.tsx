import Link from "next/link";
import { Container } from "@/components/Container";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/the-problem", label: "The Problem" },
  { href: "/the-project", label: "The Project" },
  { href: "/consultation", label: "Consultation" },
  { href: "/toolkit", label: "Toolkit" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/updates", label: "Updates" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            NSW Youth Advisory Council–Aligned Initiative
          </p>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Pathway to Entry
          </Link>
          <p className="text-sm text-slate-600">
            Policy and research project for post-school pathway entry.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline decoration-transparent underline-offset-4 transition hover:decoration-slate-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
