import rawApplicationTimelineEntries from "../../data/timelines/nsw/admission-rounds.json";
import universities from "../../data/courses/nsw/universities.json";

export type FinancialResource = {
  title: string;
  tag: string;
  description: string;
  steps: string[];
  sourceLabel: string;
  sourceUrl: string;
  lastVerified: string;
};

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

export const financialResources: FinancialResource[] = [
  {
    title: "HECS-HELP",
    tag: "Core loan",
    description:
      "HECS-HELP covers the student contribution amount for Commonwealth supported places. StudyAssist says compulsory repayments now start only on income above $67,000 in 2025-26, and the 2026 HELP loan limit is $129,883 for most students.",
    steps: [
      "Accept your Commonwealth supported place with your provider.",
      "Complete the HECS-HELP eCAF before census date.",
      "Provide your TFN and keep track of your available HELP balance in myHELPbalance.",
    ],
    sourceLabel: "StudyAssist",
    sourceUrl: "https://www.studyassist.gov.au/help-loans/hecs-help",
    lastVerified: "2026-04-16",
  },
  {
    title: "Youth Allowance",
    tag: "Living costs",
    description:
      "Youth Allowance supports eligible full-time students aged 24 or under. The exact rate depends on age, living arrangement, dependency status and parental income, so it is safer to check your personal estimate than rely on a single headline figure.",
    steps: [
      "Check eligibility and your dependency status with Services Australia.",
      "Start your claim up to 13 weeks before your course starts.",
      "Submit enrolment, identity and income details through myGov and Centrelink.",
    ],
    sourceLabel: "Services Australia",
    sourceUrl:
      "https://www.servicesaustralia.gov.au/individuals/services/centrelink/youth-allowance-students-and-australian-apprentices/how-claim/when-claim",
    lastVerified: "2026-04-16",
  },
  {
    title: "Tertiary Access Payment",
    tag: "Regional move",
    description:
      "Services Australia says the Tertiary Access Payment is a one-off payment of $3,000 or $5,000 for eligible students who need to move from a regional or remote area for tertiary study.",
    steps: [
      "Check whether your family home is classified as regional or remote.",
      "Confirm that your move is required for study after Year 12 or equivalent.",
      "Claim through Services Australia and keep your address and study details up to date.",
    ],
    sourceLabel: "Services Australia",
    sourceUrl: "https://www.servicesaustralia.gov.au/tertiary-access-payment",
    lastVerified: "2026-04-16",
  },
  {
    title: "Relocation Scholarship",
    tag: "Regional support",
    description:
      "Relocation Scholarship is a once-a-year payment for eligible students on Youth Allowance or ABSTUDY who need to move to or from a regional or remote area for higher education study. Eligibility matters more than a generic headline amount, because circumstances affect what you receive.",
    steps: [
      "Check that you are already eligible for Youth Allowance or ABSTUDY as a student.",
      "Confirm your move meets the regional and higher-education rules.",
      "Apply through Services Australia and keep evidence of both addresses and study enrolment.",
    ],
    sourceLabel: "Services Australia",
    sourceUrl: "https://www.servicesaustralia.gov.au/relocation-scholarship",
    lastVerified: "2026-04-16",
  },
  {
    title: "Scholarships and bursaries",
    tag: "Non-repayable",
    description:
      "Scholarships and bursaries do not need to be repaid. StudyAssist points students to provider scholarships, equity scholarships and other targeted support, which is often where regional, first-in-family and hardship-based assistance sits.",
    steps: [
      "Check your university scholarship portal as soon as applications open.",
      "Search equity and regional scholarships through UAC and your target institutions.",
      "Track evidence requirements early because many applications close before semester starts.",
    ],
    sourceLabel: "StudyAssist",
    sourceUrl: "https://www.studyassist.gov.au/financial-and-study-support/scholarships",
    lastVerified: "2026-04-16",
  },
  {
    title: "FEE-HELP",
    tag: "Fee-paying places",
    description:
      "FEE-HELP can cover tuition fees for eligible fee-paying higher education courses. It sits under the same HELP borrowing cap, so students need to check their remaining balance before census date if they have used HELP before.",
    steps: [
      "Confirm the course is FEE-HELP eligible with your provider.",
      "Complete the FEE-HELP eCAF before the census date for each unit or study period.",
      "Check that the tuition you want to defer fits within your available HELP balance.",
    ],
    sourceLabel: "StudyAssist",
    sourceUrl: "https://www.studyassist.gov.au/help-loans/fee-help",
    lastVerified: "2026-04-16",
  },
  {
    title: "Education Entry Payment",
    tag: "Special case",
    description:
      "Education Entry Payment is not a standard student allowance. Services Australia says it is a one-off $208 payment for people on certain income support payments when they start approved study, including some students transferring onto Youth Allowance, Austudy or ABSTUDY.",
    steps: [
      "Check that your existing Centrelink payment makes you eligible.",
      "Confirm the study you are starting is approved for the payment.",
      "Ask Services Australia whether it will be paid automatically or needs to be assessed with your claim.",
    ],
    sourceLabel: "Services Australia",
    sourceUrl: "https://www.servicesaustralia.gov.au/education-entry-payment",
    lastVerified: "2026-04-16",
  },
];

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
