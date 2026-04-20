import acuCoursesJson from "../../data/courses/nsw/australian-catholic-university/courses.json";
import csuCoursesJson from "../../data/courses/nsw/charles-sturt-university/courses.json";
import macquarieCoursesJson from "../../data/courses/nsw/macquarie-university-expanded/courses.json";
import newcastleCoursesJson from "../../data/courses/nsw/university-of-newcastle-expanded/courses.json";
import scuCoursesJson from "../../data/courses/nsw/southern-cross-university/courses.json";
import sydneyCoursesJson from "../../data/courses/nsw/university-of-sydney-expanded/courses.json";
import uneCoursesJson from "../../data/courses/nsw/university-of-new-england-expanded/courses.json";
import uowCoursesJson from "../../data/courses/nsw/university-of-wollongong-expanded/courses.json";
import unswCoursesJson from "../../data/courses/nsw/unsw-expanded/courses.json";
import utsCoursesJson from "../../data/courses/nsw/uts-expanded/courses.json";
import wsuCoursesJson from "../../data/courses/nsw/western-sydney-university/courses.json";

import { enrichCourseRecord } from "@/lib/course-guidance";

export type CourseLevel = "undergraduate" | "postgraduate" | "diploma" | "pathway";

export type CourseRecord = {
  id: string;
  university: string;
  universitySlug: string;
  state: string;
  faculty: string;
  subjectAreas: string[];
  courseName: string;
  courseCode?: string;
  level: CourseLevel;
  description: string;
  duration?: string;
  atar: number | null;
  prerequisites: string[];
  assumedKnowledge: string[];
  recommendedSubjects: string[];
  secondarySubjects: string[];
  careerOutcomes: string[];
  officialUrl: string;
  lastUpdated: string;
};

function normalizeCourses(courses: unknown): CourseRecord[] {
  return (courses as CourseRecord[]).map((course) =>
    enrichCourseRecord({
      ...course,
      prerequisites: course.prerequisites ?? [],
      assumedKnowledge: course.assumedKnowledge ?? [],
      recommendedSubjects: course.recommendedSubjects ?? [],
      secondarySubjects: course.secondarySubjects ?? [],
      careerOutcomes: course.careerOutcomes ?? [],
    })
  );
}

export const allNswCourses: CourseRecord[] = [
  ...normalizeCourses(acuCoursesJson),
  ...normalizeCourses(csuCoursesJson),
  ...normalizeCourses(macquarieCoursesJson),
  ...normalizeCourses(newcastleCoursesJson),
  ...normalizeCourses(sydneyCoursesJson),
  ...normalizeCourses(scuCoursesJson),
  ...normalizeCourses(uneCoursesJson),
  ...normalizeCourses(uowCoursesJson),
  ...normalizeCourses(unswCoursesJson),
  ...normalizeCourses(utsCoursesJson),
  ...normalizeCourses(wsuCoursesJson),
].sort(
  (a, b) =>
    a.university.localeCompare(b.university) ||
    a.faculty.localeCompare(b.faculty) ||
    a.courseName.localeCompare(b.courseName)
);
