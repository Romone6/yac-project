import rawEvents from "../../../data/events/nsw/calendar.json";
import { Container } from "@/components/Container";
import { EventsCalendar, type CalendarRecord } from "@/components/EventsCalendar";
import { PageHeader } from "@/components/PageHeader";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";

export const metadata = {
  title: "Events and deadlines | Pathway to Entry",
  description: "Confirmed NSW university application dates, student events and careers opportunities.",
};

export default function CalendarPage() {
  return (
    <Container className="space-y-7">
      <PageHeader eyebrow="Plan your next step" title="Dates and events to keep in view" summary="A source-checked selection of application deadlines, offer dates and events. Choose a type, open the official details, or download dates to your calendar." />
      <EventsCalendar records={rawEvents as CalendarRecord[]} />
      <ToolSourceCrosschecks tool="calendar" title="Broaden event discovery and verify dates" />
    </Container>
  );
}
