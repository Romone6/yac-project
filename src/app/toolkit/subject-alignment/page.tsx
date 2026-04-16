"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { cx } from "@/lib/cx";
import universitiesData from "../../../../data/courses/nsw/universities.json";
import {
  allNswCourses,
  type CourseLevel,
  type CourseRecord,
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
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"All" | CourseLevel>("All");

  const universities = useMemo(
    () => allUniversities.filter((u) => u.state === selectedState),
    [selectedState]
  );

  const filteredCourses = useMemo(() => {
    return allNswCourses.filter((c) => {
      if (selectedUni && c.universitySlug !== selectedUni) return false;
      if (selectedFaculty && c.faculty !== selectedFaculty) return false;
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
          .map((course) => course.faculty)
      ),
    ].sort();
  }, [selectedUni, selectedLevel]);

  return (
    <Container className="space-y-8">
      <PageHeader
        eyebrow="Toolkit"
        title="Subject Alignment Checklist"
        summary="Explore compiled course coverage across every NSW university in this toolkit, including undergraduate, diploma/pathway and postgraduate options, then jump to the official university search page to confirm the live details."
      />

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        This explorer now pulls from the full NSW catalog used in this project. It is still designed to reduce the search workload, not replace the source university page. If a subject section is blank, the current dataset does not yet store a detailed subject recommendation for that course.
      </div>

      <Section title="Select a university">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni) => (
            <button
              key={uni.slug}
              onClick={() => {
                setSelectedUni(uni.slug);
                setSelectedFaculty(null);
                setSelectedCourse(null);
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
        <Section title="Select a faculty and level">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(levelLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setSelectedLevel(value as "All" | CourseLevel);
                    setSelectedFaculty(null);
                    setSelectedCourse(null);
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
                  setSelectedCourse(null);
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
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="w-full rounded-sm border border-slate-200 bg-white p-5 text-left transition hover:border-slate-400"
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
              </button>
            ))}
            {filteredCourses.length === 0 && (
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No courses match your search. Try a different query or faculty.
              </div>
            )}
          </div>
        </Section>
      )}

      {selectedCourse && (
        <Section>
          <div className="rounded-sm border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                ← Back to courses
              </button>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {[selectedCourse.university, selectedCourse.faculty, selectedCourse.courseCode]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {levelLabels[selectedCourse.level]}
                  </p>
                </div>
                {selectedCourse.atar && (
                  <div className="shrink-0 rounded-sm bg-slate-100 px-4 py-2 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500">ATAR</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedCourse.atar}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-5">
              <div className="space-y-6 md:col-span-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
                  <p className="mt-2 text-base leading-7 text-slate-700">{selectedCourse.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Duration</h3>
                  <p className="mt-2 text-base text-slate-700">{selectedCourse.duration}</p>
                </div>

                {selectedCourse.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Prerequisites (Required)</h3>
                    <ul className="mt-2 space-y-1">
                      {selectedCourse.prerequisites.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCourse.assumedKnowledge.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assumed Knowledge (Helpful)</h3>
                    <ul className="mt-2 space-y-1">
                      {selectedCourse.assumedKnowledge.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCourse.careerOutcomes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Career Outcomes</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedCourse.careerOutcomes.map((c) => (
                        <span key={c} className="rounded-sm border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <a
                    href={selectedCourse.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                  >
                    View official course page →
                  </a>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                    Dataset last refreshed {selectedCourse.lastUpdated.slice(0, 10)}
                  </p>
                </div>
              </div>

              <div className="space-y-6 md:col-span-2">
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Current HSC Subject Signals
                  </h3>
                  <div className="mt-3 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Recommended</p>
                      <ul className="mt-2 space-y-1.5">
                        {(
                          selectedCourse.recommendedSubjects.length > 0
                            ? selectedCourse.recommendedSubjects
                            : ["No verified recommended-subject list stored yet. Check the official page."]
                        ).map((s) => (
                          <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Secondary</p>
                      <ul className="mt-2 space-y-1.5">
                        {(
                          selectedCourse.secondarySubjects.length > 0
                            ? selectedCourse.secondarySubjects
                            : ["No secondary subject suggestions stored yet."]
                        ).map((s) => (
                          <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}
    </Container>
  );
}
