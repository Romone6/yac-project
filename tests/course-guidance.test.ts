import assert from "node:assert/strict";
import test from "node:test";

import { enrichCourseRecord } from "../src/lib/course-guidance";

function makeCourse(courseName: string, description = "") {
  return {
    faculty: "",
    courseName,
    description,
    level: "undergraduate" as const,
    prerequisites: [],
    assumedKnowledge: [],
    recommendedSubjects: [],
    secondarySubjects: [],
  };
}

test("physics courses infer maths and physics-heavy school preparation", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Physics", "Study theoretical and applied physics.")
  );

  assert.ok(course.prerequisites.includes("Mathematics Advanced"));
  assert.ok(course.assumedKnowledge.includes("Physics"));
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
});

test("mathematics courses avoid software-specific recommendations", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Mathematics", "Advanced mathematical theory and modelling.")
  );

  assert.ok(course.prerequisites.includes("Mathematics Advanced"));
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
  assert.ok(!course.recommendedSubjects.includes("Software Engineering"));
});

test("psychology courses include english alongside science preparation", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Psychology with Honours", "Psychological science, research and practice.")
  );

  assert.ok(course.recommendedSubjects.includes("Biology"));
  assert.ok(course.recommendedSubjects.includes("English Advanced"));
});

test("nursing courses include communication-oriented school subjects", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Nursing", "Clinical care, health systems and patient practice.")
  );

  assert.ok(course.recommendedSubjects.includes("Biology"));
  assert.ok(course.recommendedSubjects.includes("English Advanced"));
  assert.ok(course.secondarySubjects.includes("PDHPE"));
});

test("architecture courses include design-focused visual preparation", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Architecture", "Studio-based design for the built environment.")
  );

  assert.ok(course.prerequisites.includes("Mathematics Advanced"));
  assert.ok(course.recommendedSubjects.includes("Design and Technology"));
  assert.ok(course.secondarySubjects.includes("Visual Arts"));
});

test("economics courses elevate extension maths into the recommended pathway", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Economics", "Quantitative economics, markets and policy.")
  );

  assert.ok(course.prerequisites.includes("Mathematics Advanced"));
  assert.ok(course.recommendedSubjects.includes("Economics"));
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
});
