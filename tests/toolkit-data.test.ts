import assert from "node:assert/strict";
import test from "node:test";

import {
  applicationTimelineEntries,
  financialResources,
} from "../src/lib/toolkit-data";
import { allNswCourses } from "../src/lib/nsw-course-catalog";
import unswCoursesJson from "../data/courses/nsw/unsw-expanded/courses.json";
import utsCoursesJson from "../data/courses/nsw/uts-expanded/courses.json";
import universities from "../data/courses/nsw/universities.json";

test("application timeline entries expose verified official sources", () => {
  assert.ok(applicationTimelineEntries.length >= 8);

  for (const entry of applicationTimelineEntries) {
    assert.match(entry.officialUrl, /^https?:\/\//);
    assert.match(entry.lastVerified, /^\d{4}-\d{2}-\d{2}$/);

    if (entry.applicationOpen && entry.applicationClose) {
      assert.ok(
        Date.parse(entry.applicationOpen) <= Date.parse(entry.applicationClose),
        `${entry.id} closes before it opens`
      );
    }
  }
});

test("financial resources carry dates and official source links", () => {
  assert.ok(financialResources.length >= 6);

  for (const resource of financialResources) {
    assert.match(resource.sourceUrl, /^https?:\/\//);
    assert.match(resource.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(resource.steps.length >= 2, `${resource.title} needs action steps`);
  }
});

test("course dataset covers every NSW university in the selector list", () => {
  const availableUniversities = new Set(
    allNswCourses.map((course) => course.university)
  );

  for (const university of universities as Array<{ name: string }>) {
    assert.ok(
      availableUniversities.has(university.name),
      `missing course coverage for ${university.name}`
    );
  }
});

test("subject toolkit keeps broad NSW course coverage across the expanded catalog", () => {
  const counts = allNswCourses.reduce<Record<string, number>>((acc, course) => {
    acc[course.university] = (acc[course.university] ?? 0) + 1;
    return acc;
  }, {});

  assert.ok(allNswCourses.length >= 3200, "expected a near-complete NSW course catalog");
  assert.ok(
    (counts["Australian Catholic University"] ?? 0) >= 150,
    "ACU course coverage is still too narrow"
  );
  assert.ok(
    (counts["Charles Sturt University"] ?? 0) >= 200,
    "Charles Sturt course coverage is still too narrow"
  );
  assert.ok(
    (counts["Macquarie University"] ?? 0) >= 160,
    "Macquarie course coverage is still too narrow"
  );
  assert.ok(
    (counts["Southern Cross University"] ?? 0) >= 100,
    "Southern Cross course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of New England"] ?? 0) >= 200,
    "UNE course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of Newcastle"] ?? 0) >= 200,
    "Newcastle course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of Sydney"] ?? 0) >= 350,
    "Sydney course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of New South Wales"] ?? 0) >= 450,
    "UNSW course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of Technology Sydney"] ?? 0) >= 380,
    "UTS course coverage is still too narrow"
  );
  assert.ok(
    (counts["University of Wollongong"] ?? 0) >= 500,
    "Wollongong course coverage is still too narrow"
  );
  assert.ok(
    (counts["Western Sydney University"] ?? 0) >= 150,
    "Western Sydney course coverage is still too narrow"
  );
});

test("every course exposes subject-pathway guidance", () => {
  for (const course of allNswCourses) {
    const totalSignals =
      course.prerequisites.length +
      course.assumedKnowledge.length +
      course.recommendedSubjects.length +
      course.secondarySubjects.length;

    assert.ok(totalSignals > 0, `${course.id} is missing subject guidance`);
    assert.ok(
      course.description.trim().length >= 40,
      `${course.id} needs a more useful course summary`
    );
  }
});

test("timeline dataset covers every NSW university plus the UAC umbrella records", () => {
  const timelineUniversities = new Set(
    applicationTimelineEntries.map((entry) => entry.university)
  );

  for (const university of universities as Array<{ name: string }>) {
    assert.ok(
      timelineUniversities.has(university.name),
      `missing timeline coverage for ${university.name}`
    );
  }

  assert.ok(timelineUniversities.has("UAC (All NSW Universities)"));
});

test("UNSW and UTS raw datasets preserve official subject-detail fields", () => {
  const countSignals = (
    courses: Array<{
      prerequisites?: string[];
      assumedKnowledge?: string[];
      recommendedSubjects?: string[];
    }>
  ) =>
    courses.filter((course) => {
      const totalSignals =
        (course.prerequisites?.length ?? 0) +
        (course.assumedKnowledge?.length ?? 0) +
        (course.recommendedSubjects?.length ?? 0);

      return totalSignals > 0;
    }).length;

  assert.ok(
    countSignals(unswCoursesJson as Array<{ prerequisites?: string[]; assumedKnowledge?: string[]; recommendedSubjects?: string[] }>) >= 90,
    "UNSW raw course data is still missing too much official subject detail"
  );
  assert.ok(
    countSignals(utsCoursesJson as Array<{ prerequisites?: string[]; assumedKnowledge?: string[]; recommendedSubjects?: string[] }>) >= 75,
    "UTS raw course data is still missing too much official subject detail"
  );
});
