import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { TransitionChecklist } from "@/components/TransitionChecklist";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";

export const metadata = {
  title: "Transition checklist | Pathway to Entry",
  description: "Pathway-specific steps for planning and starting university, TAFE/VET, an apprenticeship or another next step.",
};

export default function ChecklistPage() {
  return (
    <Container className="space-y-8">
      <PageHeader eyebrow="Plan your next step" title="A checklist that moves with you" summary="Choose a pathway and stage to see a short list of actions. Change your choices any time; your progress stays in this browser on this device." />
      <TransitionChecklist />
      <ToolSourceCrosschecks tool="checklist" title="Add wellbeing and transition prompts" />
    </Container>
  );
}
