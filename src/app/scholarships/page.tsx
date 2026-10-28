import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ScholarshipFinder } from "./ScholarshipFinder";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";

export const metadata = {
  title: "Scholarships | Pathway to Entry",
  description:
    "Search scholarships, bursaries, relocation support, equity funding and accommodation support for regional NSW students.",
};

export default async function ScholarshipsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <Container className="space-y-10">
      <PageHeader
        eyebrow="Funding for your next step"
        title="Scholarships"
        summary="Find scholarships, bursaries and other study support from universities and providers across NSW."
      />

      <ScholarshipFinder initialQuery={q} />
      <ToolSourceCrosschecks tool="scholarships" title="Broaden and cross-check your scholarship search" />
    </Container>
  );
}
