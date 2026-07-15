import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  filterScholarships,
  getScholarshipFreshness,
  scholarshipFilterOptions,
  scholarships,
} from "../src/lib/scholarships";
import { fallbackRecordsForProvider } from "../src/lib/scholarship-refresh.mjs";

const requiredKeys = [
  "id",
  "slug",
  "scholarship_name",
  "provider",
  "institution",
  "description",
  "value_text",
  "value_amount",
  "value_type",
  "opens_at",
  "closes_at",
  "status",
  "eligibility_summary",
  "eligibility_tags",
  "study_level",
  "location_eligibility",
  "field_of_study",
  "required_documents",
  "application_method",
  "source_url",
  "source_name",
  "last_verified_at",
  "confidence_status",
  "notes",
] as const;

test("scholarship database exposes required source-backed fields", () => {
  assert.ok(scholarships.length >= 80);

  for (const item of scholarships) {
    for (const key of requiredKeys) {
      assert.ok(key in item, `${item.id} missing ${key}`);
    }

    assert.match(item.source_url, /^https?:\/\//);
    assert.match(item.last_verified_at, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      item.confidence_status === "verified-official-source" ||
        item.confidence_status === "source-check-required"
    );
    assert.ok(item.eligibility_tags.length > 0, `${item.id} needs eligibility tags`);
    assert.ok(item.required_documents.length > 0, `${item.id} needs required documents`);
    assert.ok(item.description.length >= 80, `${item.id} needs a useful summary`);
  }
});

test("scholarship import workflow is configured for repeatable provider refresh", () => {
  const root = process.cwd();
  assert.ok(existsSync(join(root, "data/import-sources/scholarships.nsw.json")));
  assert.ok(existsSync(join(root, "data/scholarships/nsw/curated-scholarships.json")));
  assert.ok(existsSync(join(root, "data/scholarships/nsw/import-report.json")));
  assert.ok(existsSync(join(root, "scripts/import-scholarships.mjs")));
  assert.ok(existsSync(join(root, "scripts/check-scholarship-sources.mjs")));
  assert.ok(existsSync(join(root, "data/scholarships/nsw/provider-health.json")));
  assert.ok(existsSync(join(root, "scripts/refresh-pathway-data.mjs")));

  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["scholarships:health"], "node scripts/check-scholarship-sources.mjs");

  const importer = readFileSync(join(root, "scripts/import-scholarships.mjs"), "utf8");
  assert.match(importer, /previousPublished/);
  assert.match(importer, /fallback_records/);
});

test("scholarship freshness distinguishes current and stale records", () => {
  assert.deepEqual(
    getScholarshipFreshness("2026-07-10", new Date("2026-07-15T12:00:00+10:00")),
    { label: "Verified 10 July 2026", stale: false }
  );
  assert.equal(
    getScholarshipFreshness("2026-05-01", new Date("2026-07-15T12:00:00+10:00")).stale,
    true
  );
});

test("failed scholarship providers retain only their own prior records", () => {
  const previous = [
    { id: "acu-a", provider: "Australian Catholic University" },
    { id: "uts-a", provider: "University of Technology Sydney" },
  ];

  assert.deepEqual(
    fallbackRecordsForProvider(previous, "Australian Catholic University", 0),
    [previous[0]]
  );
  assert.deepEqual(
    fallbackRecordsForProvider(previous, "Australian Catholic University", 1),
    []
  );
});

test("scholarship database excludes obvious generic non-record pages", () => {
  const bannedTitles = [
    "About us",
    "Search",
    "Scholarships",
    "University Scholarships",
    "Scholarships and Important Dates",
    "How to apply",
    "Contact us",
  ];

  for (const item of scholarships) {
    assert.ok(
      !bannedTitles.includes(item.scholarship_name),
      `${item.slug} is a generic page, not a scholarship record`
    );
  }
});

test("scholarship database has broad provider and support-type coverage", () => {
  const institutions = new Set(scholarships.map((item) => item.institution));
  const tags = new Set(scholarships.flatMap((item) => item.eligibility_tags));
  const studyLevels = new Set(scholarships.flatMap((item) => item.study_level));
  const fields = new Set(scholarships.flatMap((item) => item.field_of_study));

  assert.ok(institutions.size >= 12, "database needs coverage across NSW providers");

  for (const institution of [
    "Australian Catholic University",
    "Charles Sturt University",
    "Macquarie University",
    "Southern Cross University",
    "UNSW Sydney",
    "University of Newcastle",
    "University of Technology Sydney",
    "University of Wollongong",
    "Western Sydney University",
    "Australian Government",
  ]) {
    assert.ok(institutions.has(institution), `missing ${institution}`);
  }

  for (const tag of [
    "regional-rural",
    "low-income-equity",
    "first-in-family",
    "aboriginal-torres-strait-islander",
    "disability-accessibility",
    "leadership-community",
    "academic-merit",
    "relocation",
    "accommodation",
  ]) {
    assert.ok(tags.has(tag), `missing tag coverage for ${tag}`);
  }

  for (const level of ["undergraduate", "postgraduate", "research", "tafe", "training"]) {
    assert.ok(studyLevels.has(level), `missing study level ${level}`);
  }

  for (const field of [
    "all-fields",
    "engineering",
    "health",
    "law",
    "social-work",
    "nursing",
  ]) {
    assert.ok(fields.has(field), `missing field coverage for ${field}`);
  }
});

test("scholarship filters cover the requested public filter set", () => {
  const labels = scholarshipFilterOptions.map((option) => option.label);

  for (const expected of [
    "Open now",
    "Closing soon",
    "Regional/rural",
    "Low income/equity",
    "First in family",
    "Aboriginal and Torres Strait Islander",
    "Disability/accessibility",
    "Leadership/community",
    "Academic merit",
    "Relocation",
    "Accommodation",
  ]) {
    assert.ok(labels.includes(expected), `missing filter: ${expected}`);
  }
});

test("scholarship search and filters return relevant records", () => {
  const regionalOpen = filterScholarships({
    openNow: true,
    tags: ["regional-rural"],
  });
  assert.ok(regionalOpen.some((item) => item.slug === "tertiary-access-payment"));

  const accommodation = filterScholarships({ tags: ["accommodation"] });
  assert.ok(
    accommodation.some((item) => item.slug === "une-wilmot-residential-scholarship")
  );

  const nursing = filterScholarships({ query: "nursing", fieldOfStudy: "nursing" });
  assert.ok(
    nursing.some(
      (item) => item.slug === "nsw-health-undergraduate-clinical-placement-grants"
    )
  );

  const highValue = filterScholarships({ minValue: 7000 });
  assert.ok(highValue.every((item) => item.value_amount !== null));
  assert.ok(highValue.some((item) => item.slug === "une-wilmot-residential-scholarship"));
});
