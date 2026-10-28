# Full-page visual drafts — Pathway to Entry

These route-by-route drafts describe the full vertical page, from shared header to footer. Long result pages include every current result row/card and continuation state, rather than a shortened sample. They guide the design review; screenshots are the evidence of what the browser actually rendered. Existing records, links, source notes, forms and PDFs stay in place.

## Shared shell

```text
┌────────────────────────────────────────────────────────────────────┐
│ School mark + Pathway to Entry  Explore  Toolkit  About  Updates   │
├────────────────────────────────────────────────────────────────────┤
│ Route content                                                       │
├────────────────────────────────────────────────────────────────────┤
│ Footer: project summary                 contact + public site link   │
└────────────────────────────────────────────────────────────────────┘
```

Cream canvas, navy headings, eucalyptus actions, amber accent, Manrope type, consistent content width, focus states and responsive spacing. Use open editorial sections for explanations, cards for distinct tools/results/forms, and retain the source/freshness metadata where it is already provided.

## 1. Home — `/`

```text
HEADER
HERO (full width): eyebrow → large two-line headline → supporting copy
  → search input + Search action → helper text; real Westport campus photo
  blended at right; small wave motif at bottom
FOUR PATHWAYS: university | TAFE/trade | work/apprenticeship | exploring
TOOLS: short introduction at left; all four tools as numbered editorial rows
THREE STEPS: explore → plan → confirm with provider
YOUTH-INFORMED: consultation copy + research, report PDF and project links
CLOSING BAND: “Your next step can start here” + trusted-information note
FOOTER
```

The home page stays editorial rather than turning every paragraph into a card. Photo attribution remains linked. At phone width the image and copy stack, pathways become two columns and the three steps stack vertically.

## 2. Toolkit — `/toolkit`

```text
HEADER
PAGE INTRO: “Practical Tools Hub” + explanatory lead
AVAILABLE TOOLS: all six existing tools in the current order
  [Application Timeline Tracker] [Scholarship Finder] [Subject Alignment]
  [Financial Pathway Explainer] [Regional Student Checklist] [Support Directory]
Each tool: title → existing description → direct action
FOOTER
```

Use a balanced three-column grid on desktop, one column on phone. Cards identify independent tools and share equal visual weight; no added tool content or links.

## 3. Scholarships — `/scholarships`

```text
HEADER
PAGE INTRO: title + purpose
SEARCH/FILTER PANEL (all current controls): keyword; institution; study level;
  field; minimum and maximum value; all quick-filter chips; reset
RESULT BAR: filtered count and reset action
ALL MATCHING RESULTS, in current data order:
  each record retains title, provider, description, eligibility/value/date,
  open/closing state, source link and existing source-check metadata
EMPTY/FILTERED STATE where current logic shows it
FOOTER
```

The entire result sequence is part of this page (currently a long list), not just the first viewport. Keep filters usable on mobile and allow the result cards to flow in one column. `/toolkit/scholarships` redirects here.

## 4. Application Timelines — `/toolkit/application-timelines`

```text
HEADER
PAGE INTRO: “Application Timelines” + lead
FILTERS: all current filters and view controls
DEADLINE RESULTS: current filtered count and every matching deadline card,
  in the current sort order; cards retain institution, round, date, status,
  details and original official-source link
TIMELINE: current grouped timeline rows/sections for those deadlines
FOOTER
```

This is a long page by design (59 current deadlines before filtering). Do not truncate results in the design sketch or screenshot review. `/timelines` is the same page/alias.

## 5. Financial Pathway Explainer — `/toolkit/financial-pathways`

```text
HEADER
PAGE INTRO: title + supporting lead
FINANCIAL SUPPORT OPTIONS: all existing resource cards, with their current
  explanation, eligibility/context and official source action
KEY THINGS TO KNOW: current guidance in its existing order
RELATED ACTION/SOURCE LINKS (where currently provided)
FOOTER
```

Keep the page scannable with a clear distinction between support programs and explanatory guidance. Use a responsive card grid for the separate programs; keep longer guidance as readable open text.

## 6. Subject Alignment Checklist — `/toolkit/subject-alignment`

```text
HEADER
PAGE INTRO + current verification/data notice
SELECT A UNIVERSITY: all current university options
SELECT A SUBJECT AREA: current subject chips/choices
COURSE SEARCH/FILTERS: existing search and selection behavior
BROWSE COURSES: current result count and every matching course card
  (provider, course name, existing subject signal and detail action)
FOOTER
```

Use one grouped selector/filter surface followed by clearly separated results. Preserve the current course dataset and the warning that unverified universities may be absent. Results become one column on narrow screens.

## 7. Course detail — `/toolkit/subject-alignment/[courseId]`

```text
HEADER
BACK LINK → course title and existing provider/level metadata
COURSE SNAPSHOT: current at-a-glance fields
SUMMARY: existing course summary
DETAILED BREAKDOWN: all current breakdown fields
SUBJECT PATHWAY: current subject mapping, explanation and caveats
CAREER OUTCOMES: all current listed outcomes
OFFICIAL COURSE SOURCE + related return link
FOOTER
```

This template represents each valid dynamic course route. Keep missing/unavailable fields graceful and do not add inferred prerequisites or outcomes.

## 8. Consultation — `/consultation`

```text
HEADER
PAGE INTRO
LATEST PUBLISHED REPORT: existing report card and PDF action
PARTICIPATE IN THE SURVEY: existing survey explanation and action/form
FOCUS GROUP EXPRESSION OF INTEREST: current invitation and form/action
HOW DATA WILL BE USED: all existing privacy/data-use explanation
FOOTER
```

Cards group each distinct participation action; the data explanation remains a readable section. Preserve form behavior and report PDF.

## 9. Get Involved — `/get-involved`

```text
HEADER
PAGE INTRO
MENTOR EXPRESSION OF INTEREST: existing details and mentor form
EDUCATOR AND STAKEHOLDER CONTACT: existing contact form and instructions
CURRENT PRIVACY/CONTACT NOTES
FOOTER
```

Keep the two routes into participation distinct and make required fields and submit actions easy to identify, without changing form semantics.

## 10. Research — `/research`

```text
HEADER
PAGE INTRO: consultation, evidence and recommendations
RESEARCH FOCUS: Information Gap | Student Voice | Policy Translation
CURRENT EVIDENCE PRODUCTS: all existing reports/publications and source links
HOW RESEARCH FEEDS THE TOOLKIT: existing explanation and connections
FOOTER
```

Use three concise focus cards, then a separate evidence/publication area and a clear evidence-to-resource explanation. Preserve citations and existing document links.

## 11. The Problem — `/the-problem`

```text
HEADER
PAGE INTRO
WHERE THE GAP SHOWS UP: Regional-versus-metro participation gap;
  limited execution support after selection; retain full existing evidence copy
EVIDENCE AND DATA (NSW SOURCES): all current tables, figures, explanations,
  footnotes and citations in their existing order
RELATED RESEARCH / NEXT LINK (if present)
FOOTER
```

This long-form page keeps evidence claims adjacent to their source. Tables remain complete and scroll horizontally on narrow screens where needed; do not replace evidence with generic cards.

## 12. The Project — `/the-project`

```text
HEADER
PAGE INTRO
PROJECT SCOPE: “What the project does” and “What the project does not do”
HIGH-LEVEL PHASES: every current phase in order, each with label, title,
  description and any current timing/detail
RELATED REPORT / RESEARCH / CONTACT LINKS (if present)
FOOTER
```

Use paired scope panels followed by a continuous four-phase progression. At phone width the phases form a vertical sequence. The existing content and boundaries remain explicit.

## 13. Updates — `/updates`

```text
HEADER
PAGE INTRO
MILESTONES: February → March → April → May 2026, with all existing text
LATEST PUBLICATION: current report/document and action
CONSULTATION STATUS: full current status details
NEXT STEPS: every existing next step in order
FOOTER
```

Show milestones as a vertical timeline on mobile and a connected progression on wide screens. Keep dates and status wording as published.

## Route coverage and review rule

The 13 designs above cover every unique public content template currently in `src/app`. The `/timelines` alias resolves to the application-timelines page; `/toolkit/scholarships` redirects to `/scholarships`. For long dynamic pages, visual review captures the full page and separately checks the first viewport; the first viewport alone is not evidence that the whole page matches its draft. These are structural/layout sketches, not pixel-perfect source screenshots.
