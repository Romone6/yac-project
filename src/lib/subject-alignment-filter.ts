import type { CourseLevel, CourseRecord } from "@/lib/nsw-course-catalog";

type SelectedLevel = "All" | CourseLevel;

export type SubjectAlignmentFilters = {
  selectedUni: string | null;
  selectedFaculty: string | null;
  selectedLevel: SelectedLevel;
  searchQuery: string;
};

export function courseHasAtar(course: Pick<CourseRecord, "atar">): boolean {
  return typeof course.atar === "number" && Number.isFinite(course.atar);
}

export function filterSubjectAlignmentCourses(
  courses: CourseRecord[],
  filters: SubjectAlignmentFilters
): CourseRecord[] {
  const query = filters.searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return courses.filter((course) => {
    if (filters.selectedUni && course.universitySlug !== filters.selectedUni) return false;
    if (filters.selectedFaculty && !course.subjectAreas.includes(filters.selectedFaculty))
      return false;
    if (filters.selectedLevel !== "All" && course.level !== filters.selectedLevel) return false;

    if (!query) return true;

    const searchableText = [
      course.courseName, course.courseCode, course.description, course.faculty,
      course.university, course.level, course.subjectAreas.join(" "),
      course.recommendedSubjects.join(" "), course.prerequisites.join(" "),
      course.assumedKnowledge.join(" "), course.secondarySubjects.join(" "),
      course.careerOutcomes.join(" "), String(course.atar ?? ""),
      String(course.selectionRank ?? ""),
    ].join(" ").toLowerCase();
    return query.every((term) => searchableText.includes(term));
  });
}
