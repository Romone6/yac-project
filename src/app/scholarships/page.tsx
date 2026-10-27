import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ScholarshipFinder } from "./ScholarshipFinder";

export const metadata = {
  title: "Scholarships | Pathway to Entry",
  description:
    "Search scholarships, bursaries, relocation support, equity funding and accommodation support for regional NSW students.",
};

export default function ScholarshipsPage() {
  return (
    <Container className="space-y-10">
      <PageHeader
        eyebrow="Funding for your next step"
        title="Scholarships"
        summary="Find scholarships, bursaries and other study support from universities and providers across NSW."
      />

      <ScholarshipFinder />
    </Container>
  );
}
