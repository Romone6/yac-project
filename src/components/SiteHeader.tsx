"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretDown } from "@phosphor-icons/react/ssr";

const navGroups = [
  {
    label: "Explore pathways",
    links: [
      { href: "/search", label: "Search across pathways" },
      { href: "/toolkit", label: "All current tools" },
      { href: "/toolkit/subject-alignment", label: "University subjects and courses" },
    ],
  },
  {
    label: "Funding",
    links: [
      { href: "/scholarships", label: "Scholarship finder" },
      { href: "/toolkit/financial-pathways", label: "Financial pathway guide" },
    ],
  },
  {
    label: "Plan",
    links: [
      { href: "/checklist", label: "Transition checklist" },
      { href: "/calendar", label: "Events and deadlines" },
      { href: "/timelines", label: "Application timelines" },
      { href: "/consultation", label: "Consultation report" },
    ],
  },
  {
    label: "Support",
    links: [
      { href: "/support", label: "Regional study support directory" },
      { href: "/get-involved", label: "Get involved" },
      { href: "/updates", label: "Project updates" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/the-project", label: "The project" },
      { href: "/the-problem", label: "The problem" },
      { href: "/research", label: "Research" },
    ],
  },
];

function PathwayLogo() {
  return (
    <Image
      src="/pathway-school-mark.png"
      alt=""
      aria-hidden="true"
      width={88}
      height={76}
      priority
      className="h-[58px] w-[68px] shrink-0 object-contain sm:h-[66px] sm:w-[76px]"
    />
  );
}

export function SiteHeader() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        navRef.current?.querySelectorAll("details[open]").forEach((menu) => {
          menu.removeAttribute("open");
        });
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const openMenus = navRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]");
      if (!openMenus?.length) return;
      openMenus.forEach((menu) => menu.removeAttribute("open"));
      openMenus[0]?.querySelector<HTMLElement>("summary")?.focus();
    }

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function handleNavClick(event: React.MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    const clickedDetails = target.closest("details");
    const clickedSummary = target.closest("summary");
    const openMenus = navRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]");

    if (!clickedDetails || target.closest("a")) {
      openMenus?.forEach((menu) => menu.removeAttribute("open"));
      return;
    }

    if (clickedSummary) {
      openMenus?.forEach((menu) => {
        if (menu !== clickedDetails) menu.removeAttribute("open");
      });
    }
  }

  return (
    <header className="relative z-30 border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-6 py-4 md:min-h-[106px] md:flex-row md:items-center md:justify-between md:gap-8 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Pathway to Entry home" className="shrink-0">
            <PathwayLogo />
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/"
              className="text-[1.3rem] font-extrabold uppercase leading-[1.04] tracking-[0.045em] text-[var(--foreground)] sm:text-[1.65rem]"
            >
              Pathway<br className="sm:hidden" /> to Entry
            </Link>
            <div className="hidden h-12 border-l-2 border-[var(--muted)]/50 sm:block" />
            <p className="hidden max-w-36 text-base leading-tight text-[var(--muted)] sm:block">
              Regional NSW<br />Post-school pathways
            </p>
          </div>
        </div>
        <nav
          ref={navRef}
          onClick={handleNavClick}
          aria-label="Main navigation"
          className="flex flex-wrap items-center justify-between gap-x-1 gap-y-2 text-base font-semibold text-slate-900 md:justify-end md:gap-x-3"
        >
          {navGroups.map((group, index) => (
            <details key={group.label} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-sm px-2 py-2 hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)] [&::-webkit-details-marker]:hidden">
                {group.label}
                <CaretDown
                  aria-hidden="true"
                  size={14}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <ul
                className={`absolute top-full z-40 mt-1 min-w-56 border border-[var(--line)] bg-[var(--surface)] p-2 shadow-lg ${
                  index === navGroups.length - 1 ? "right-0" : "left-0"
                }`}
              >
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block whitespace-nowrap rounded-sm px-3 py-2.5 font-normal text-slate-700 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--green)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </div>
    </header>
  );
}
