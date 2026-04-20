"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { cx } from "@/lib/cx";
import { buildCourseDetailHref } from "@/lib/course-directory";
import universitiesData from "../../../../data/courses/nsw/universities.json";
import {
  allNswCourses,
  type CourseLevel,
} from "@/lib/nsw-course-catalog";

type UniversityRecord = {
  name: string;
  slug: string;
  state: string;
  locations: string[];
};

const allUniversities = universitiesData as UniversityRecord[];
const levelLabels: Record<"All" | CourseLevel, string> = {
  All: "All levels",
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  diploma: "Diploma",
  pathway: "Pathway",
};

export default function SubjectAlignmentPage() {
  const [selectedState] = useState("NSW");
  const [selectedUni, setSelectedUni] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"All" | CourseLevel>("All");

  const universities = useMemo(
    () => allUniversities.filter((u) => u.state === selectedState),
    [selectedState]
  );

  const filteredCourses = useMemo(() => {
    return allNswCourses.filter((c) => {
      if (selectedUni && c.universitySlug !== selectedUni) return false;
      if (selectedFaculty && !c.subjectAreas.includes(selectedFaculty)) return false;
      if (selectedLevel !== "All" && c.level !== selectedLevel) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.courseName.toLowerCase().includes(q) ||
          (c.courseCode ?? "").toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.recommendedSubjects.some((subject) => subject.toLowerCase().includes(q)) ||
          c.prerequisites.some((subject) => subject.toLowerCase().includes(q)) ||
          c.assumedKnowledge.some((subject) => subject.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedUni, selectedFaculty, searchQuery, selectedLevel]);

  const faculties = useMemo(() => {
    return [
      ...new Set(
        allNswCourses
          .filter((course) => course.universitySlug === selectedUni)
          .filter((course) => selectedLevel === "All" || course.level === selectedLevel)
          .flatMap((course) => course.subjectAreas)
      ),
    ].sort();
  }, [selectedUni, selectedLevel]);

  return (
    <Container className="space-y-8">
      <PageHeader
        eyebrow="Toolkit"
        title="Subject Alignment Checklist"
        summary="Explore compiled course coverage across every NSW university in this toolkit, including undergraduate, diploma/pathway and postgraduate options, then click into any course for its summary and official university course-information link."
      />

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        This explorer now pulls from the broader NSW catalog used in this project and pairs each course with a subject-pathway recommendation so students can map school choices against likely tertiary directions faster. It is still designed to reduce the search workload, not replace the source university page.
      </div>

      <Section title="Select a university">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni) => (
            <button
              key={uni.slug}
              onClick={() => {
                setSelectedUni(uni.slug);
                setSelectedFaculty(null);
              }}
              className={cx(
                "rounded-sm border p-5 text-left transition",
                selectedUni === uni.slug
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
              )}
            >
              <p className="text-sm font-semibold">{uni.name}</p>
              <p className={cx("mt-1 text-xs", selectedUni === uni.slug ? "text-slate-300" : "text-slate-500")}>
                {uni.locations.join(", ")}
              </p>
            </button>
          ))}
        </div>
      </Section>

      {selectedUni && (
        <Section title="Select a subject area and level">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(levelLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setSelectedLevel(value as "All" | CourseLevel);
                    setSelectedFaculty(null);
                  }}
                  className={cx(
                    "rounded-sm border px-4 py-2 text-sm font-medium transition",
                    selectedLevel === value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
            {faculties.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setSelectedFaculty(f);
                }}
                className={cx(
                  "rounded-sm border px-4 py-2 text-sm font-medium transition",
                  selectedFaculty === f
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                )}
              >
                {f}
              </button>
            ))}
            </div>
          </div>
        </Section>
      )}

      {selectedUni && selectedFaculty && (
        <Section title={`Browse courses (${filteredCourses.length})`}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search courses, subjects, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={buildCourseDetailHref(course.id)}
                className="block w-full rounded-sm border border-slate-200 bg-white p-5 text-left transition hover:border-slate-400"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{course.courseName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {[levelLabels[course.level], course.courseCode, course.duration]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {course.atar && (
                    <div className="shrink-0 rounded-sm bg-slate-100 px-3 py-1.5 text-center">
                      <p className="text-xs uppercase tracking-wide text-slate-500">ATAR</p>
                      <p className="text-lg font-bold text-slate-900">{course.atar}</p>
                    </div>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {course.description}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {course.subjectAreas.slice(0, 3).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(course.recommendedSubjects.length > 0
                    ? course.recommendedSubjects
                    : course.prerequisites
                  )
                    .slice(0, 3)
                    .map((s) => (
                      <span
                        key={s}
                        className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  {(course.recommendedSubjects.length > 0
                    ? course.recommendedSubjects.length
                    : course.prerequisites.length) > 3 && (
                    <span className="text-xs text-slate-400">
                      +
                      {(course.recommendedSubjects.length > 0
                        ? course.recommendedSubjects.length
                        : course.prerequisites.length) - 3}{" "}
                      more
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Click for summary, subject pathway and official course link
                  </span>
                  <span className="font-medium text-slate-900">
                    Open course →
                  </span>
                </div>
              </Link>
            ))}
            {filteredCourses.length === 0 && (
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No courses match your search. Try a different query or faculty.
              </div>
            )}
          </div>
        </Section>
      )}
    </Container>
  );
}
