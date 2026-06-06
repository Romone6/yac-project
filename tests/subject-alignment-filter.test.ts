import assert from "node:assert/strict";
import test from "node:test";

import type { CourseRecord } from "../src/lib/nsw-course-catalog";
import { allNswCourses } from "../src/lib/nsw-course-catalog";
import {
  courseHasAtar,
  filterSubjectAlignmentCourses,
} from "../src/lib/subject-alignment-filter";

function makeCourse(level: CourseRecord["level"]): CourseRecord {
  return {
    id: `sample-${level}`,
    university: "Sample University",
    universitySlug: "sample-university",
    state: "NSW",
    faculty: "Engineering, Design and Technology",
    subjectAreas: ["Engineering, Design and Technology"],
    courseName: `${level} sample course`,
    courseCode: `${level.toUpperCase()}-1`,
    level,
    description: "Sample course description for search behavior.",
    duration: "3 years",
    atar: null,
    prerequisites: [],
    assumedKnowledge: [],
    recommendedSubjects: [],
    secondarySubjects: [],
    careerOutcomes: [],
    officialUrl: "https://example.com/course",
    lastUpdated: "2026-05-19",
  };
}

test("text search routes level keywords to the matching level classification", () => {
  const sampleCourses: CourseRecord[] = [
    makeCourse("undergraduate"),
    makeCourse("postgraduate"),
    makeCourse("diploma"),
  ];

  const undergraduateResults = filterSubjectAlignmentCourses(sampleCourses, {
    selectedUni: "sample-university",
    selectedFaculty: null,
    selectedLevel: "All",
    searchQuery: "undergraduate",
  });
  const postgraduateResults = filterSubjectAlignmentCourses(sampleCourses, {
    selectedUni: "sample-university",
    selectedFaculty: null,
    selectedLevel: "All",
    searchQuery: "postgraduate",
  });
  const diplomaResults = filterSubjectAlignmentCourses(sampleCourses, {
    selectedUni: "sample-university",
    selectedFaculty: null,
    selectedLevel: "All",
    searchQuery: "diploma",
  });

  assert.deepEqual(
    undergraduateResults.map((course) => course.level),
    ["undergraduate"]
  );
  assert.deepEqual(
    postgraduateResults.map((course) => course.level),
    ["postgraduate"]
  );
  assert.deepEqual(diplomaResults.map((course) => course.level), ["diploma"]);
});

test("UNSW level filtering returns courses for undergraduate, postgraduate, and diploma", () => {
  for (const level of ["undergraduate", "postgraduate", "diploma"] as const) {
    const filtered = filterSubjectAlignmentCourses(allNswCourses, {
      selectedUni: "unsw",
      selectedFaculty: null,
      selectedLevel: level,
      searchQuery: "",
    });

    assert.ok(filtered.length > 0, `expected UNSW ${level} results`);
    assert.ok(filtered.every((course) => course.level === level));
  }
});

test("courseHasAtar treats null as unavailable and numbers as available", () => {
  assert.equal(courseHasAtar({ atar: null }), false);
  assert.equal(courseHasAtar({ atar: 82.35 }), true);
});

