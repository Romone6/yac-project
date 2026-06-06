import type { CourseLevel, CourseRecord } from "@/lib/nsw-course-catalog";

type SelectedLevel = "All" | CourseLevel;

export type SubjectAlignmentFilters = {
  selectedUni: string | null;
  selectedFaculty: string | null;
  selectedLevel: SelectedLevel;
  searchQuery: string;
};

const levelSearchTerms: Record<CourseLevel, string[]> = {
  undergraduate: ["undergraduate", "undergrad", "ug"],
  postgraduate: ["postgraduate", "postgrad", "pg"],
  diploma: ["diploma"],
  pathway: ["pathway", "foundation"],
};

export function courseHasAtar(course: Pick<CourseRecord, "atar">): boolean {
  return typeof course.atar === "number" && Number.isFinite(course.atar);
}

function matchesLevelQuery(course: CourseRecord, query: string): boolean {
  const terms = levelSearchTerms[course.level];
  return terms.some((term) => term.includes(query) || query.includes(term));
}

export function filterSubjectAlignmentCourses(
  courses: CourseRecord[],
  filters: SubjectAlignmentFilters
): CourseRecord[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return courses.filter((course) => {
    if (filters.selectedUni && course.universitySlug !== filters.selectedUni) return false;
    if (filters.selectedFaculty && !course.subjectAreas.includes(filters.selectedFaculty))
      return false;
    if (filters.selectedLevel !== "All" && course.level !== filters.selectedLevel) return false;

    if (!query) return true;

    return (
      matchesLevelQuery(course, query) ||
      course.courseName.toLowerCase().includes(query) ||
      (course.courseCode ?? "").toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.faculty.toLowerCase().includes(query) ||
      course.subjectAreas.some((subjectArea) => subjectArea.toLowerCase().includes(query)) ||
      course.recommendedSubjects.some((subject) => subject.toLowerCase().includes(query)) ||
      course.prerequisites.some((subject) => subject.toLowerCase().includes(query)) ||
      course.assumedKnowledge.some((subject) => subject.toLowerCase().includes(query))
    );
  });
}
