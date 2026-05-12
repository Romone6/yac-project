import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-slate-700">Pathway to Entry</p>
          <p>NSW YAC-aligned policy and research project.</p>
        </div>
        <div className="space-y-1 text-right">
          <p>Contact: contact@pathwaytoentry.org.au</p>
          <p>Website: pathwaytoentry.org.au</p>
        </div>
      </Container>
    </footer>
  );
}
