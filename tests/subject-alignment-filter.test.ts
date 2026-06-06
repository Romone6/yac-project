import assert from "node:assert/strict";
import test from "node:test";

import type { CourseRecord } from "../src/lib/nsw-course-catalog";
import {
  allNswCourses,
  subjectAlignmentCourses,
} from "../src/lib/nsw-course-catalog";
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

test("subject alignment catalog exposes only undergraduate UNSW results", () => {
  const filtered = filterSubjectAlignmentCourses(subjectAlignmentCourses, {
    selectedUni: "unsw",
    selectedFaculty: null,
    selectedLevel: "undergraduate",
    searchQuery: "",
  });

  assert.ok(filtered.length > 0, "expected UNSW undergraduate results");
  assert.ok(filtered.every((course) => course.level === "undergraduate"));

  const hiddenPostgraduate = filterSubjectAlignmentCourses(subjectAlignmentCourses, {
    selectedUni: "unsw",
    selectedFaculty: null,
    selectedLevel: "postgraduate",
    searchQuery: "",
  });
  assert.equal(hiddenPostgraduate.length, 0);
});

test("broader course catalog can still classify non-undergraduate levels outside subject alignment", () => {
  const postgraduate = filterSubjectAlignmentCourses(allNswCourses, {
    selectedUni: "unsw",
    selectedFaculty: null,
    selectedLevel: "postgraduate",
    searchQuery: "",
  });

  assert.ok(postgraduate.length > 0, "expected broader catalog to retain postgraduate records");
  assert.ok(postgraduate.every((course) => course.level === "postgraduate"));
});

test("courseHasAtar treats null as unavailable and numbers as available", () => {
  assert.equal(courseHasAtar({ atar: null }), false);
  assert.equal(courseHasAtar({ atar: 82.35 }), true);
});
