import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <Container className="flex flex-col gap-5 py-9 text-base text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-bold text-[var(--foreground)]">Pathway to Entry</p>
          <p>NSW YAC-aligned consultation, toolkit and advocacy initiative.</p>
        </div>
        <div className="space-y-1 text-right">
          <p>Contact: contact@pathwaytoentry.org.au</p>
          <p>Website: pathwaytoentry.org.au</p>
        </div>
      </Container>
    </footer>
  );
}
