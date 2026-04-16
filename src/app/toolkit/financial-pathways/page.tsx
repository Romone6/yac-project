import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Tag } from "@/components/Tag";
import {
  financialResources,
  toolkitVerificationDate,
} from "@/lib/toolkit-data";

export const metadata = {
  title: "Financial Pathway Explainer | Pathway to Entry",
  description:
    "Understanding HECS-HELP, Youth Allowance, scholarships, and financial support for university students.",
};

export default function FinancialPathwaysPage() {
  return (
    <Container className="space-y-12">
      <PageHeader
        eyebrow="Toolkit"
        title="Financial Pathway Explainer"
        summary="Official-source guidance on the main support options students ask about most: HELP loans, income support, regional relocation help and scholarships."
      />

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        This page was refreshed against Services Australia and StudyAssist sources on{" "}
        <span className="font-semibold">
          {new Date(toolkitVerificationDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        . Payment rates and eligibility rules move, so use the official link on each card before you make a decision or submit a claim.
      </div>

      <Section title="Financial support options">
        <div className="grid gap-6 md:grid-cols-2">
          {financialResources.map((resource) => (
            <Card key={resource.title} title={resource.title}>
              <Tag>{resource.tag}</Tag>
              <p className="mt-3 text-sm leading-6 text-slate-700">{resource.description}</p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How to access</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
                  {resource.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="mt-4">
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                >
                  {resource.sourceLabel} →
                </a>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                  Last verified {resource.lastVerified}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Key things to know">
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-6">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>HECS-HELP is income contingent.</strong> StudyAssist says compulsory repayments only start once your repayment income is above the current threshold.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>Apply for Youth Allowance early.</strong> The safest approach is to start the claim before your course begins so there is time to resolve any identity, income or enrolment checks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>Regional support is broader than one payment.</strong> Students may be able to combine Youth Allowance, Relocation Scholarship, Tertiary Access Payment and provider bursaries if they meet each scheme&apos;s rules.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>Scholarships are still worth the admin.</strong> Equity and regional scholarships often close early and usually ask for supporting evidence, so collect documents before results day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span><strong>Do not rely on old payment screenshots.</strong> Thresholds, rates and loan caps change, so always re-check the linked source before making a financial decision.</span>
            </li>
          </ul>
        </div>
      </Section>
    </Container>
  );
}
