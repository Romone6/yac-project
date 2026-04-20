import { allNswCourses } from "@/lib/nsw-course-catalog";

export function findCourseById(courseId: string) {
  return allNswCourses.find((course) => course.id === courseId) ?? null;
}

export function buildCourseDetailHref(courseId: string) {
  return `/toolkit/subject-alignment/${encodeURIComponent(courseId)}`;
}
