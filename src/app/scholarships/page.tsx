import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { scholarshipVerificationDate } from "@/lib/scholarships";
import { ScholarshipFinder } from "./ScholarshipFinder";

export const metadata = {
  title: "Scholarships | Pathway to Entry",
  description:
    "Search source-backed scholarships, bursaries, relocation support, equity funding and accommodation support for regional NSW students.",
};

export default function ScholarshipsPage() {
  return (
    <Container className="space-y-10">
      <PageHeader
        eyebrow="Toolkit Feature"
        title="Scholarship Finder"
        summary="A searchable, source-backed database helping regional NSW students find scholarships, bursaries, relocation support, equity funding, accommodation support, and other financial assistance."
      />

      <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-5 text-sm leading-6 text-slate-700">
        Records show official source links and last-verified dates. The database
        was last checked on{" "}
        <span className="font-semibold text-slate-900">
          {new Date(`${scholarshipVerificationDate}T12:00:00+10:00`).toLocaleDateString(
            "en-AU",
            { day: "numeric", month: "short", year: "numeric" }
          )}
        </span>
        . Always confirm details on the official source before applying.
      </div>

      <ScholarshipFinder />
    </Container>
  );
}
