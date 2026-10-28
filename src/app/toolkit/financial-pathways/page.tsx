import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { BudgetWorksheet } from "@/components/BudgetWorksheet";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";

export const metadata = {
  title: "Regional study costs and support | Pathway to Entry",
  description: "Plan study, travel and moving costs and check official support for regional NSW students.",
};

const situations = [
  { title: "Staying at home", text: "Estimate travel, meals away from home, devices and any course-specific equipment. Check the provider's current course costs and transport concessions." },
  { title: "Moving for study", text: "Include travel to inspect accommodation, bond, setup costs, rent, utilities, food and return trips. Confirm your own payment eligibility through Services Australia." },
  { title: "Apprenticeship or traineeship", text: "Ask the employer and training provider about tools, uniforms, travel, paid training time and any course fees before you start." },
  { title: "Online or mixed study", text: "Plan for reliable internet, a suitable device, occasional campus travel and any required materials or placement travel." },
];

const officialLinks = [
  { label: "Tertiary Access Payment eligibility", detail: "Check the official rules for students who need to move for study.", href: "https://www.servicesaustralia.gov.au/who-can-get-tertiary-access-payment?context=53447" },
  { label: "Services Australia Payment Finder", detail: "Use the government's estimator for payments that may fit your circumstances.", href: "https://www.servicesaustralia.gov.au/online-estimators?context=64107" },
  { label: "Moving for study", detail: "Review current government information about relocating to study.", href: "https://www.servicesaustralia.gov.au/moving-for-study?context=60023" },
  { label: "Transport concessions and regional fares", detail: "Check current NSW concession conditions and regional fares.", href: "https://transportnsw.info/tickets-opal/ticket-eligibility-concessions/child-student-concessions/tertiary-or-tafe-students" },
  { label: "Budget planner", detail: "Moneysmart's budget planner helps compare income and expenses.", href: "https://moneysmart.gov.au/budgeting/budget-planner" },
  { label: "NSW tenancy information", detail: "Read current renting and tenancy guidance from Legal Aid NSW.", href: "https://www.legalaid.nsw.gov.au/my-problem-is-about/my-housing/tenancy" },
];

export default function FinancialPathwaysPage() {
  return (
    <Container className="space-y-12">
      <PageHeader
        eyebrow="Funding and costs"
        title="Plan the costs around your next step"
        summary="Build a fuller picture of travel, study, training and moving costs, then check current support with the government or provider responsible for it."
      />

      <section aria-labelledby="cost-scenarios-title">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--green)]">Start with your situation</p>
          <h2 id="cost-scenarios-title" className="mt-2 text-2xl font-bold">Costs to ask about</h2>
        </div>
        <div className="mt-5 grid gap-0 divide-y divide-[var(--line)] border-y border-[var(--line)] md:grid-cols-2 md:divide-y-0">
          {situations.map((situation, index) => (
            <article key={situation.title} className={`py-5 md:px-6 ${index % 2 === 1 ? "md:border-l md:border-[var(--line)]" : "md:pl-0"} ${index > 1 ? "md:border-t md:border-[var(--line)]" : ""}`}>
              <h3 className="text-lg font-bold">{situation.title}</h3>
              <p className="mt-2 max-w-prose leading-7 text-[var(--muted)]">{situation.text}</p>
            </article>
          ))}
        </div>
      </section>

      <BudgetWorksheet />

      <section aria-labelledby="official-cost-support-title">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--green)]">Check current rules</p>
          <h2 id="official-cost-support-title" className="mt-2 text-2xl font-bold">Official support and cost information</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">Rules, fees and concessions can change and may depend on your circumstances. These links go to the organization that maintains the current information.</p>
        </div>
        <div className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {officialLinks.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-5 py-4 hover:text-[var(--green)]">
              <span><span className="block font-bold">{item.label}</span><span className="mt-1 block text-sm text-[var(--muted)]">{item.detail}</span></span>
              <ArrowRight aria-hidden="true" size={20} className="shrink-0 text-[var(--green)]" />
            </a>
          ))}
        </div>
        <Link href="/scholarships" className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--green)] underline underline-offset-4">Search regional scholarships and bursaries <ArrowRight aria-hidden="true" size={17} /></Link>
      </section>
      <ToolSourceCrosschecks tool="financial-planning" title="Check your plan with support and budgeting sources" />
    </Container>
  );
}
