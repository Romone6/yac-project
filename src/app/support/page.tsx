import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { SupportDirectory } from "@/components/SupportDirectory";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";

export const metadata = {
  title: "NSW study hub directory | Pathway to Entry",
  description: "Find regional and suburban community-led university study hubs across NSW.",
};

export default function SupportPage() {
  return (
    <Container className="space-y-8">
      <PageHeader eyebrow="Find support" title="Study support near you" summary="Search community-led regional and suburban university study hubs across NSW. Each centre sets its own facilities, registration and opening hours, so check the local site before visiting." />
      <SupportDirectory />
      <section aria-label="Study hub directories" className="border-t border-[var(--line)] pt-5 text-sm leading-6 text-[var(--muted)]">
        <p>All 19 programs were cross-checked 28 October 2026 against the <a className="font-semibold text-[var(--green)] underline" href="https://www.education.gov.au/access-and-participation/university-study-hubs" target="_blank" rel="noreferrer">Australian Government University Study Hubs finder</a> and their linked hub/operator pages. Regional records were also checked against the <a className="font-semibold text-[var(--green)] underline" href="https://www.cuc.edu.au/our-centres/" target="_blank" rel="noreferrer">Country Universities Centre directory</a> and the <a className="font-semibold text-[var(--green)] underline" href="https://www.regionaluniversitystudyhubsnetwork.edu.au/locations" target="_blank" rel="noreferrer">Regional University Study Hubs Network location list</a>.</p>
        <p className="mt-2">The government finder can include multiple physical locations for a single hub; this directory groups those locations under the hub program or operator.</p>
      </section>
      <ToolSourceCrosschecks tool="study-hubs" title="Compare hub locations and service details" />
    </Container>
  );
}
