import { subjectAlignmentCourses } from "@/lib/nsw-course-catalog";

export function findCourseById(courseId: string) {
  return subjectAlignmentCourses.find((course) => course.id === courseId) ?? null;
}

export function buildCourseDetailHref(courseId: string) {
  return `/toolkit/subject-alignment/${encodeURIComponent(courseId)}`;
}
