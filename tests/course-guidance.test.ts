import assert from "node:assert/strict";
import test from "node:test";

import { enrichCourseRecord } from "../src/lib/course-guidance";

function makeCourse(
  courseName: string,
  description = "",
  overrides: Partial<ReturnType<typeof makeBaseCourse>> = {}
) {
  return {
    ...makeBaseCourse(courseName, description),
    ...overrides,
  };
}

function makeBaseCourse(courseName: string, description = "") {
  return {
    faculty: "",
    courseName,
    description,
    level: "undergraduate" as const,
    prerequisites: [] as string[],
    assumedKnowledge: [] as string[],
    recommendedSubjects: [] as string[],
    secondarySubjects: [] as string[],
  };
}

test("physics courses keep inferred preparation separate from entry requirements", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Physics", "Study theoretical and applied physics.")
  );

  assert.deepEqual(course.prerequisites, []);
  assert.deepEqual(course.assumedKnowledge, []);
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
});

test("mathematics courses avoid software-specific recommendations", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Mathematics", "Advanced mathematical theory and modelling.")
  );

  assert.deepEqual(course.prerequisites, []);
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

test("provider-supplied entry requirements are preserved without adding inferred requirements", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Engineering", "Engineering design and applied science.", {
      prerequisites: ["Mathematics Advanced"],
      assumedKnowledge: ["Physics"],
    })
  );

  assert.deepEqual(course.prerequisites, ["Mathematics Advanced"]);
  assert.deepEqual(course.assumedKnowledge, ["Physics"]);
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

  assert.deepEqual(course.prerequisites, []);
  assert.ok(course.recommendedSubjects.includes("Design and Technology"));
  assert.ok(course.secondarySubjects.includes("Visual Arts"));
});

test("economics courses elevate extension maths into the recommended pathway", () => {
  const course = enrichCourseRecord(
    makeCourse("Bachelor of Economics", "Quantitative economics, markets and policy.")
  );

  assert.deepEqual(course.prerequisites, []);
  assert.ok(course.recommendedSubjects.includes("Economics"));
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
});

test("engineering college labels do not add biology to aerospace engineering pathways", () => {
  const course = enrichCourseRecord(
    makeCourse(
      "Bachelor of Aerospace Systems Engineering (Honours)",
      "Aerospace systems engineering involves systems design, aircraft subsystems, sensors, controllers and defence industry operations.",
      { faculty: "College of Engineering Science and Environment" }
    )
  );

  assert.deepEqual(course.prerequisites, []);
  assert.deepEqual(course.assumedKnowledge, []);
  assert.ok(course.recommendedSubjects.includes("Mathematics Extension 1"));
  assert.ok(course.recommendedSubjects.includes("Engineering Studies"));
  assert.ok(!course.recommendedSubjects.includes("Biology"));
  assert.ok(!course.recommendedSubjects.includes("Chemistry"));
});

test("construction management stays in the built-environment engineering pathway", () => {
  const course = enrichCourseRecord(
    makeCourse(
      "Bachelor of Construction Management",
      "Construction management covers building delivery, site coordination, contracts and built environment project practice."
    )
  );

  assert.equal(course.faculty, "Engineering, Design and Technology");
  assert.deepEqual(course.prerequisites, []);
  assert.ok(course.recommendedSubjects.includes("Engineering Studies"));
  assert.ok(!course.recommendedSubjects.includes("Business Studies"));
});

test("clinical exercise physiology is grouped and guided as health science even with misleading raw faculties", () => {
  const course = enrichCourseRecord(
    makeCourse(
      "Bachelor of Clinical Exercise Physiology",
      "Clinical exercise physiology prepares students for exercise assessment, rehabilitation, chronic disease management and allied health practice.",
      { faculty: "Business" }
    )
  );

  assert.equal(course.faculty, "Health and Science");
  assert.ok(course.recommendedSubjects.includes("Biology"));
  assert.ok(course.recommendedSubjects.includes("PDHPE"));
  assert.ok(course.secondarySubjects.includes("Chemistry"));
  assert.ok(course.secondarySubjects.includes("Mathematics Advanced"));
});
