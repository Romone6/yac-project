import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ToolSourceCrosschecks } from "@/components/ToolSourceCrosschecks";
import { allNswCourses } from "@/lib/nsw-course-catalog";
import { buildCourseDetailHref } from "@/lib/course-directory";
import { scholarships } from "@/lib/scholarships";
import officialPathwaySearches from "../../../data/pathways/nsw/official-searches.json";

export const metadata = {
  title: "Explore pathways | Pathway to Entry",
  description: "Explore NSW university, TAFE, apprenticeship and work entry pathways.",
};

const stopWords = new Set(["a", "an", "and", "are", "for", "i", "in", "is", "me", "my", "of", "or", "the", "to", "what", "with"]);

function tokensFor(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

function matchScore(text: string, tokens: string[]) {
  const haystack = text.toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

const pathwayResources = [
  {
    title: "University courses and HSC subject alignment",
    description: "Explore NSW university courses, entry details and subject information.",
    href: "/toolkit/subject-alignment",
    terms: "university universities course courses degree nursing health teaching engineering design science subjects hsc atar career industry",
  },
  {
    title: "Scholarship finder",
    description: "Search scholarships, bursaries, relocation and student support.",
    href: "/scholarships",
    terms: "scholarship scholarships bursary bursaries funding money grant grants equity regional rural accommodation relocation nursing",
  },
  {
    title: "Application timelines",
    description: "Check admissions, early-entry and scholarship milestones.",
    href: "/toolkit/application-timelines",
    terms: "application applications dates deadline deadlines timeline timelines admissions early entry university",
  },
  {
    title: "Financial pathway guide",
    description: "Understand HELP loans, student payments and regional support.",
    href: "/toolkit/financial-pathways",
    terms: "financial finance cost costs help loan hecs payment payments youth allowance regional support tafe trade apprenticeship work",
  },
  {
    title: "Explore all current tools",
    description: "Browse practical planning and support resources in the toolkit.",
    href: "/toolkit",
    terms: "toolkit tools resources pathway pathways after school tafe training apprenticeship trade work career jobs industry",
  },
  {
    title: "Research and consultation",
    description: "Read the project’s regional student consultation and evidence.",
    href: "/research",
    terms: "research consultation students evidence report findings",
  },
];

type PathwayFilter = "all" | "university" | "tafe-vet" | "apprenticeship" | "work";

type SearchPageProps = { searchParams: Promise<{ q?: string; pathway?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", pathway = "all" } = await searchParams;
  const query = q.trim();
  const selectedPathway: PathwayFilter = ["university", "tafe-vet", "apprenticeship", "work"].includes(pathway)
    ? pathway as PathwayFilter
    : "all";
  const tokens = tokensFor(query);
  const courseResults = tokens.length && ["all", "university"].includes(selectedPathway)
    ? allNswCourses
        .map((course) => ({
          course,
          score: matchScore(course.courseName, tokens) * 5 +
            matchScore(`${course.subjectAreas.join(" ")} ${course.careerOutcomes.join(" ")} ${course.recommendedSubjects.join(" ")}`, tokens) * 2 +
            matchScore([
            course.courseName,
            course.description,
            course.university,
            course.faculty,
            course.subjectAreas.join(" "),
            course.recommendedSubjects.join(" "),
            course.careerOutcomes.join(" "),
          ].join(" "), tokens),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.course.courseName.localeCompare(b.course.courseName))
    : [];
  const scholarshipResults = tokens.length && selectedPathway === "all"
    ? scholarships
        .map((scholarship) => ({
          scholarship,
          score: matchScore(`${scholarship.scholarship_name} ${scholarship.provider} ${scholarship.institution}`, tokens) * 5 +
            matchScore([
            scholarship.scholarship_name,
            scholarship.provider,
            scholarship.institution,
            scholarship.description,
            scholarship.eligibility_summary,
            scholarship.value_text,
            scholarship.field_of_study.join(" "),
            scholarship.eligibility_tags.join(" "),
          ].join(" "), tokens),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.scholarship.scholarship_name.localeCompare(b.scholarship.scholarship_name))
    : [];
  const resourceResults = tokens.length && selectedPathway === "all"
    ? pathwayResources
        .map((resource) => ({ resource, score: matchScore(`${resource.title} ${resource.description} ${resource.terms}`, tokens) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];
  const officialResults = tokens.length
    ? officialPathwaySearches
        .filter((item) => selectedPathway === "all" || item.pathway === selectedPathway)
        .map((item) => ({ item, score: matchScore(`${item.title} ${item.description} ${item.searchTerms}`, tokens) }))
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <Container className="space-y-8">
      <PageHeader
        eyebrow="Explore pathways"
        title={query ? `Options for “${query}”` : "Search across post-school pathways"}
        summary="Start with an interest, course or occupation. Explore NSW university courses alongside official TAFE/VET and apprenticeship search resources. Confirm current details with each provider."
      />

      <form action="/search" method="get" role="search" className="flex max-w-5xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="site-search-query">Search pathways</label>
        <input id="site-search-query" name="q" type="search" defaultValue={query} placeholder="Try nursing, teaching, carpentry or automotive" className="min-w-0 flex-1 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-base" />
        <label className="sr-only" htmlFor="pathway-filter">Pathway type</label>
        <select id="pathway-filter" name="pathway" defaultValue={selectedPathway} className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-base sm:w-64">
          <option value="all">All pathways</option>
          <option value="university">University</option>
          <option value="tafe-vet">TAFE / VET</option>
          <option value="apprenticeship">Apprenticeship / traineeship</option>
          <option value="work">Work / other entry</option>
        </select>
        <button className="rounded-md bg-[var(--accent)] px-5 py-3 font-bold text-white">Search</button>
      </form>

      {!query ? (
        <p className="text-[var(--muted)]">Choose a starting interest or occupation. Results link to the source organization for current availability and requirements.</p>
      ) : tokens.length === 0 ? (
        <p className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-5 text-[var(--muted)]">Enter a course, interest or keyword with at least two letters.</p>
      ) : (
        <div className="space-y-10">
          {courseResults.length > 0 && (
            <section aria-labelledby="course-results-title">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="course-results-title" className="text-2xl font-bold text-[var(--foreground)]">NSW university courses</h2>
                <p className="text-sm text-[var(--muted)]">{courseResults.length} matching courses</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {courseResults.slice(0, 8).map(({ course }) => (
                  <Link key={course.id} href={buildCourseDetailHref(course.id)} className="group rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--green)] hover:shadow-sm">
                    <span className="text-sm font-semibold text-[var(--green)]">{course.university}</span>
                    <span className="mt-1 flex items-start justify-between gap-3 text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--green)]">
                      {course.courseName}<ArrowRight aria-hidden="true" size={20} className="mt-1 shrink-0" />
                    </span>
                    {course.description && <span className="mt-2 block overflow-hidden text-sm leading-6 text-[var(--muted)]" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}>{course.description}</span>}
                    {(typeof course.atar === "number" || typeof course.selectionRank === "number") && <span className="mt-2 block text-xs text-[var(--muted)]">{typeof course.atar === "number" ? `Published ATAR reference: ${course.atar}` : ""}{typeof course.atar === "number" && typeof course.selectionRank === "number" ? " · " : ""}{typeof course.selectionRank === "number" ? `Selection rank${course.selectionRankYear ? ` (${course.selectionRankYear})` : ""}: ${course.selectionRank}` : ""} · reference figures, not guaranteed cutoffs</span>}
                    <span className="mt-2 block text-xs text-[var(--muted)]">Course source last updated {course.lastUpdated}</span>
                  </Link>
                ))}
              </div>
              {courseResults.length > 8 && <p className="mt-3 text-sm text-[var(--muted)]">Showing the 8 closest matches. Refine your search in the <Link href="/toolkit/subject-alignment" className="font-semibold text-[var(--green)] underline">course and subject tool</Link>.</p>}
            </section>
          )}

          {officialResults.length > 0 && (
            <section aria-labelledby="official-pathway-results-title">
              <div className="mb-4">
                <h2 id="official-pathway-results-title" className="text-2xl font-bold text-[var(--foreground)]">Other pathway searches</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">These links help you broaden and compare your search. Government and provider pages remain the authority for course availability, entry requirements and fees.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {officialResults.map(({ item }) => (
                  <a key={item.id} href={item.officialUrl} target="_blank" rel="noreferrer" className="group rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--green)] hover:shadow-sm">
                    <span className="text-sm font-semibold text-[var(--green)]">{item.provider}</span>
                    {item.sourceType === "independent" && <span className="ml-2 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">Independent source</span>}
                    {item.sourceType === "independent-marketplace" && <span className="ml-2 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">Independent marketplace</span>}
                    <span className="mt-1 flex items-start justify-between gap-3 text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--green)]">{item.title}<ArrowRight aria-hidden="true" size={20} className="mt-1 shrink-0" /></span>
                    <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{item.description}</span>
                    <span className="mt-2 block text-xs text-[var(--muted)]">Source checked {item.sourceCheckedAt}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {scholarshipResults.length > 0 && (
            <section aria-labelledby="scholarship-results-title">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="scholarship-results-title" className="text-2xl font-bold text-[var(--foreground)]">Scholarships and student support</h2>
                <Link href={`/scholarships?q=${encodeURIComponent(query)}`} className="font-semibold text-[var(--green)] underline underline-offset-4">See all {scholarshipResults.length} matches <ArrowRight aria-hidden="true" className="inline" /></Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {scholarshipResults.slice(0, 4).map(({ scholarship }) => (
                  <Link key={scholarship.id} href={`/scholarships?q=${encodeURIComponent(query)}`} className="group rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[var(--green)]">
                    <span className="text-sm text-[var(--muted)]">{scholarship.provider}</span>
                    <span className="mt-1 block text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--green)]">{scholarship.scholarship_name}</span>
                    <span className="mt-2 block text-sm text-[var(--muted)]">{scholarship.value_text}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {resourceResults.length > 0 && (
            <section aria-labelledby="resource-results-title">
              <h2 id="resource-results-title" className="mb-4 text-2xl font-bold text-[var(--foreground)]">Pathway tools and information</h2>
              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] bg-[var(--surface)]">
                {resourceResults.map(({ resource }) => (
                  <Link key={resource.href} href={resource.href} className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--accent-soft)]">
                    <span><span className="block font-bold text-[var(--foreground)] group-hover:text-[var(--green)]">{resource.title}</span><span className="mt-1 block text-sm text-[var(--muted)]">{resource.description}</span></span>
                    <ArrowRight aria-hidden="true" className="shrink-0 text-[var(--green)]" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {courseResults.length + scholarshipResults.length + resourceResults.length + officialResults.length === 0 && (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">No matches yet</h2>
              <p className="mt-2 text-[var(--muted)]">Try a broader term such as nursing, teaching, regional, university, scholarships or support.</p>
              <Link href="/toolkit" className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--green)] underline underline-offset-4">Browse all current tools <ArrowRight aria-hidden="true" size={18} /></Link>
            </div>
          )}
        </div>
      )}
      <div className="space-y-8">
        <ToolSourceCrosschecks tool="course-search" title="Compare courses through other catalogues" />
        <ToolSourceCrosschecks tool="pathway-search" title="Cross-check university, VET and apprenticeship routes" />
      </div>
    </Container>
  );
}
