import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata = {
  title: "Toolkit | Pathway to Entry",
  description:
    "Practical tools for regional NSW students navigating post-school pathways, applications, scholarships, finances and support services.",
};

const tools = [
  {
    title: "Application Timeline Tracker",
    href: "/toolkit/application-timelines",
    summary:
      "Track verified admissions, early-entry and scholarship milestones from UAC and university sources.",
  },
  {
    title: "Scholarship Finder",
    href: "/scholarships",
    summary:
      "Search source-backed scholarships, bursaries, relocation support, accommodation help and equity funding.",
  },
  {
    title: "Subject Alignment Tool",
    href: "/toolkit/subject-alignment",
    summary:
      "Compare subject signals across NSW university courses before finalising senior subject or course choices.",
  },
  {
    title: "Financial Pathway Explainer",
    href: "/toolkit/financial-pathways",
    summary:
      "Understand HELP loans, student payments, regional relocation support and non-repayable funding.",
  },
  {
    title: "Regional Student Checklist",
    href: "/research",
    summary:
      "Use consultation-backed prompts to plan documents, travel, accommodation, costs and support conversations.",
  },
  {
    title: "Support Directory",
    href: "/get-involved",
    summary:
      "Find the right next contact point for school, institution, community and project involvement support.",
  },
];

export default function ToolkitPage() {
  return (
    <Container className="space-y-12">
      <PageHeader
        eyebrow="Toolkit"
        title="Practical Tools Hub"
        summary="Pathway to Entry turns regional student consultation into practical tools for deadlines, scholarships, subject choices, finances, checklists and support."
      />

      <Section title="Available Tools">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="block">
              <Card
                title={tool.title}
                className="h-full cursor-pointer bg-[var(--surface)] transition hover:border-[var(--green)] hover:shadow-sm"
              >
                <p className="text-sm leading-6 text-slate-700">{tool.summary}</p>
                <div className="pt-2 text-sm font-semibold text-[var(--accent)]">
                  Open tool
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </Container>
  );
}
