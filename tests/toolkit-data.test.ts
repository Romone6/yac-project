import assert from "node:assert/strict";
import test from "node:test";

import {
  applicationTimelineEntries,
  financialResources,
} from "../src/lib/toolkit-data";
import { allNswCourses } from "../src/lib/nsw-course-catalog";
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
