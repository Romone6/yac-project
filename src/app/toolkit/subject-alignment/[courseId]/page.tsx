import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { findCourseById } from "@/lib/course-directory";
import type { CourseLevel } from "@/lib/nsw-course-catalog";
import { courseHasAtar } from "@/lib/subject-alignment-filter";

const levelLabels: Record<CourseLevel, string> = {
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  diploma: "Diploma",
  pathway: "Pathway",
};

function formatList(items: string[]) {
  if (items.length === 0) return "Check the official course page for details.";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;
  const course = findCourseById(decodeURIComponent(courseId));

  if (!course) {
    notFound();
  }

  return (
    <Container className="space-y-8">
      <PageHeader
        eyebrow="Toolkit"
        title={course.courseName}
        summary="Course summary, subject-pathway guidance, and the official university course information link for this NSW program."
      >
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <Link
            href="/toolkit/subject-alignment"
            className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
          >
            ← Back to subject explorer
          </Link>
          <span>{course.university}</span>
          <span>·</span>
          <span>{course.subjectAreas.join(" · ")}</span>
          <span>·</span>
          <span>{levelLabels[course.level]}</span>
        </div>
      </PageHeader>

      <Section title="Course Snapshot">
        <div className="grid gap-4 rounded-sm border border-slate-200 bg-white p-6 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              University
            </p>
            <p className="mt-2 text-sm text-slate-800">{course.university}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Primary Area
            </p>
            <p className="mt-2 text-sm text-slate-800">{course.faculty}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Course Code
            </p>
            <p className="mt-2 text-sm text-slate-800">
              {course.courseCode ?? "Not listed"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Duration
            </p>
            <p className="mt-2 text-sm text-slate-800">
              {course.duration ?? "Check official page"}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Summary">
        <div className="rounded-sm border border-slate-200 bg-white p-6 space-y-4">
          <p className="text-base leading-7 text-slate-700">{course.description}</p>
          <div className="flex flex-wrap items-center gap-4">
            {courseHasAtar(course) ? (
              <div className="rounded-sm bg-slate-100 px-4 py-2 text-sm text-slate-800">
                Indicative ATAR: <span className="font-semibold">{course.atar}</span>
              </div>
            ) : (
              <div className="rounded-sm bg-amber-50 px-4 py-2 text-sm text-amber-900">
                Indicative ATAR is not currently available in the verified dataset.
              </div>
            )}
            <a
              href={course.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-sm border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              View course details / application info →
            </a>
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Dataset last refreshed {course.lastUpdated.slice(0, 10)}
          </p>
        </div>
      </Section>

      <Section title="Detailed Breakdown">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Academic Focus
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              This course sits in {formatList(course.subjectAreas)}. Its pathway is
              built from the course title, official summary and NSW HSC subject
              signals captured in the catalog.
            </p>
          </div>
          <div className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Subject Logic
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Prioritise {formatList(course.recommendedSubjects.slice(0, 4))}.
              These subjects are selected because they build the strongest school-level
              preparation for the skills this course is likely to use.
            </p>
          </div>
          <div className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              What To Confirm
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Confirm prerequisites, assumed knowledge, majors, campuses,
              accreditation and application steps on the linked university page before
              finalising subject choices.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Subject Pathway">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Required Or Assumed
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-700">Prerequisites</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {(course.prerequisites.length > 0
                    ? course.prerequisites
                    : ["No explicit required school subjects captured in the dataset."]).map(
                    (subject) => (
                      <li key={subject} className="flex gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red-500" />
                        <span>{subject}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Assumed Knowledge</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {(course.assumedKnowledge.length > 0
                    ? course.assumedKnowledge
                    : ["No explicit assumed knowledge captured in the dataset."]).map(
                    (subject) => (
                      <li key={subject} className="flex gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-500" />
                        <span>{subject}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Recommended HSC Subjects
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-700">Recommended</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {course.recommendedSubjects.map((subject) => (
                    <li key={subject} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Secondary Support</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {course.secondarySubjects.map((subject) => (
                    <li key={subject} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {course.careerOutcomes.length > 0 ? (
        <Section title="Career Outcomes">
          <div className="flex flex-wrap gap-2 rounded-sm border border-slate-200 bg-white p-6">
            {course.careerOutcomes.map((outcome) => (
              <span
                key={outcome}
                className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {outcome}
              </span>
            ))}
          </div>
        </Section>
      ) : null}
    </Container>
  );
}
