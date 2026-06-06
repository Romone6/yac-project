import rawScholarships from "../../data/scholarships/nsw/scholarships.json";

export type ScholarshipStatus =
  | "open"
  | "closing_soon"
  | "upcoming"
  | "closed"
  | "under_assessment"
  | "check_source";

export type Scholarship = {
  id: string;
  slug: string;
  scholarship_name: string;
  provider: string;
  institution: string;
  description: string;
  value_text: string;
  value_amount: number | null;
  value_type: string;
  opens_at: string | null;
  closes_at: string | null;
  status: ScholarshipStatus;
  eligibility_summary: string;
  eligibility_tags: string[];
  study_level: string[];
  location_eligibility: string[];
  field_of_study: string[];
  required_documents: string[];
  application_method: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  confidence_status: "verified-official-source" | "source-check-required";
  notes: string;
};

export type ScholarshipFilters = {
  query?: string;
  tags?: string[];
  institution?: string;
  fieldOfStudy?: string;
  studyLevel?: string;
  openNow?: boolean;
  closingSoon?: boolean;
  minValue?: number;
  maxValue?: number;
};

export const scholarships = rawScholarships as Scholarship[];

export const scholarshipVerificationDate = "2026-06-06";

export const scholarshipFilterOptions = [
  { label: "Open now", value: "open-now" },
  { label: "Closing soon", value: "closing-soon" },
  { label: "Regional/rural", value: "regional-rural" },
  { label: "Low income/equity", value: "low-income-equity" },
  { label: "First in family", value: "first-in-family" },
  {
    label: "Aboriginal and Torres Strait Islander",
    value: "aboriginal-torres-strait-islander",
  },
  { label: "Disability/accessibility", value: "disability-accessibility" },
  { label: "Leadership/community", value: "leadership-community" },
  { label: "Academic merit", value: "academic-merit" },
  { label: "Relocation", value: "relocation" },
  { label: "Accommodation", value: "accommodation" },
] as const;

export function formatScholarshipStatus(status: ScholarshipStatus) {
  const labels: Record<ScholarshipStatus, string> = {
    open: "Open",
    closing_soon: "Closing soon",
    upcoming: "Upcoming",
    closed: "Closed",
    under_assessment: "Under assessment",
    check_source: "Check source",
  };

  return labels[status];
}

export function formatScholarshipDate(date: string | null) {
  if (!date) return "Check source";

  return new Date(`${date}T12:00:00+10:00`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getScholarshipInstitutions() {
  return Array.from(new Set(scholarships.map((item) => item.institution))).sort();
}

export function getScholarshipFields() {
  return Array.from(new Set(scholarships.flatMap((item) => item.field_of_study))).sort();
}

export function getScholarshipStudyLevels() {
  return Array.from(new Set(scholarships.flatMap((item) => item.study_level))).sort();
}

export function filterScholarships(filters: ScholarshipFilters) {
  const query = filters.query?.trim().toLowerCase();
  const tags = filters.tags ?? [];

  return scholarships.filter((item) => {
    if (query) {
      const haystack = [
        item.scholarship_name,
        item.provider,
        item.institution,
        item.description,
        item.eligibility_summary,
        item.value_text,
        item.field_of_study.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (filters.openNow && item.status !== "open" && item.status !== "closing_soon") {
      return false;
    }

    if (filters.closingSoon && item.status !== "closing_soon") {
      return false;
    }

    if (tags.length > 0 && !tags.every((tag) => item.eligibility_tags.includes(tag))) {
      return false;
    }

    if (filters.institution && item.institution !== filters.institution) {
      return false;
    }

    if (filters.fieldOfStudy && !item.field_of_study.includes(filters.fieldOfStudy)) {
      return false;
    }

    if (filters.studyLevel && !item.study_level.includes(filters.studyLevel)) {
      return false;
    }

    if (
      typeof filters.minValue === "number" &&
      (item.value_amount === null || item.value_amount < filters.minValue)
    ) {
      return false;
    }

    if (
      typeof filters.maxValue === "number" &&
      item.value_amount !== null &&
      item.value_amount > filters.maxValue
    ) {
      return false;
    }

    return true;
  });
}
