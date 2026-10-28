# Playwright visual review

Run against the optimized production build at `http://localhost:3000` on 27 October 2026 using headless Chromium. For each unique page, Playwright captured a full-page screenshot and an initial-viewport screenshot at 1440 × 1000. It then reloaded every route at 390 px and checked the document width. Screenshots are in `/tmp/pathway-render-check-final/`; the machine-local run data is in `results-final.json`.

| Page | Route | Desktop page height | Full-page screenshot |
|---|---|---:|---|
| Home | `/` | 2,920 px | [home](</tmp/pathway-render-check-final/home-final-full.png>) |
| Toolkit | `/toolkit` | 1,125 px | [toolkit](</tmp/pathway-render-check-final/toolkit-final-full.png>) |
| Scholarships | `/scholarships` | 33,789 px | [scholarships](</tmp/pathway-render-check-final/scholarships-final-full.png>) |
| Application timelines | `/toolkit/application-timelines` | 17,035 px | [timelines](</tmp/pathway-render-check-final/timelines-final-full.png>) |
| Financial pathways | `/toolkit/financial-pathways` | 2,861 px | [finance](</tmp/pathway-render-check-final/finance-final-full.png>) |
| Subject alignment | `/toolkit/subject-alignment` | 1,219 px | [subjects](</tmp/pathway-render-check-final/subjects-final-full.png>) |
| Course detail | `/toolkit/subject-alignment/[courseId]` | 1,896 px | [course detail](</tmp/pathway-render-check-final/course-detail-final-full.png>) |
| Consultation | `/consultation` | 1,881 px | [consultation](</tmp/pathway-render-check-final/consultation-final-full.png>) |
| Get involved | `/get-involved` | 1,223 px | [get involved](</tmp/pathway-render-check-final/get-involved-final-full.png>) |
| Research | `/research` | 1,750 px | [research](</tmp/pathway-render-check-final/research-final-full.png>) |
| The problem | `/the-problem` | 3,231 px | [problem](</tmp/pathway-render-check-final/problem-final-full.png>) |
| The project | `/the-project` | 1,101 px | [project](</tmp/pathway-render-check-final/project-final-full.png>) |
| Updates | `/updates` | 1,523 px | [updates](</tmp/pathway-render-check-final/updates-final-full.png>) |

## Checks

- All 13 page templates returned HTTP 200 and rendered the expected main heading. The 103 scholarship records and 59 timeline deadlines remain present in the full-page captures.
- No JavaScript page errors or browser-console errors were recorded on the captured routes.
- At 390 px, all 13 routes reported `scrollWidth === clientWidth`; no horizontal overflow was detected.
- The home page also rendered at 686 px with its title on two lines and Manrope at 36 px. It had no horizontal overflow or browser errors. [686 px full-page capture](</tmp/pathway-render-check-final/home-686-final-full.png>) · [viewport](</tmp/pathway-render-check-final/home-686-final-viewport.png>).
- `/toolkit/scholarships` resolves to `/scholarships`. `/timelines` returns HTTP 200 as a public alias.
- The screenshots were inspected page by page against the route sketches in [site-visual-drafts.md](site-visual-drafts.md). Those sketches are structural wireframes, so the comparison confirms the section order, complete content length, shared visual treatment and responsive presentation; it does not claim pixel identity to a rendered mockup.

The browser preview is the production build, not a dev-server approximation. It remains available at `http://localhost:3000` for review.
