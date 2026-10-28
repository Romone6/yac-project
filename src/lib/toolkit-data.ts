import rawApplicationTimelineEntries from "../../data/timelines/nsw/admission-rounds.json";
import universities from "../../data/courses/nsw/universities.json";

export type TimelineEntry = {
  id: string;
  university: string;
  universitySlug: string;
  roundType: "early-entry" | "regular" | "scholarship";
  roundName: string;
  applicationOpen: string | null;
  applicationClose: string | null;
  offerDate: string | null;
  description: string;
  officialUrl: string;
  sourceLabel: string;
  lastVerified: string;
};

type RawTimelineEntry = {
  id: string;
  university: string;
  universitySlug: string;
  roundType: "early-entry" | "regular" | "scholarship";
  roundName: string;
  applicationOpen: string | null;
  applicationClose: string | null;
  offerDate: string | null;
  description: string;
  officialUrl: string;
  lastUpdated: string;
};

const universityUrlMap = new Map(
  (universities as Array<{ name: string; courseSearchUrl: string; website: string }>).map(
    (university) => [university.name, university.courseSearchUrl || university.website]
  )
);

function getFallbackTimelineUrl(entry: RawTimelineEntry) {
  if (entry.university.startsWith("UAC")) {
    if (entry.roundType === "early-entry") {
      return "https://www.uac.edu.au/current-applicants/undergraduate-applications-and-offers/early-offer-schemes-for-year-12-students";
    }
    if (entry.roundType === "scholarship") {
      return "https://www.uac.edu.au/key-dates";
    }
    return "https://www.uac.edu.au/current-applicants/undergraduate-applications-and-offers";
  }

  return (
    universityUrlMap.get(entry.university) ??
    "https://www.uac.edu.au/current-applicants/undergraduate-applications-and-offers"
  );
}

export const applicationTimelineEntries: TimelineEntry[] = (
  rawApplicationTimelineEntries as RawTimelineEntry[]
).map((entry) => ({
  ...entry,
  officialUrl:
    entry.officialUrl && entry.officialUrl.startsWith("http")
      ? entry.officialUrl
      : getFallbackTimelineUrl(entry),
  sourceLabel: entry.university.startsWith("UAC") ? "UAC" : entry.university,
  lastVerified: entry.lastUpdated.slice(0, 10),
}));

export const toolkitVerificationDate = "2026-04-16";
