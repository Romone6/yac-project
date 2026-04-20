import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCourseDetailHref,
  findCourseById,
} from "../src/lib/course-directory";
import { allNswCourses } from "../src/lib/nsw-course-catalog";

test("findCourseById returns a course record for known course ids", () => {
  const knownCourse = allNswCourses.find(
    (course) => course.university === "University of New South Wales"
  );
  const course = findCourseById(knownCourse?.id ?? "");

  assert.ok(course);
  assert.equal(course?.university, "University of New South Wales");
});

test("buildCourseDetailHref creates stable detail URLs for courses", () => {
  assert.equal(
    buildCourseDetailHref("unsw-3405"),
    "/toolkit/subject-alignment/unsw-3405"
  );
});
