# Toolkit database and source coverage audit — 28 October 2026

## What changed

- Added the five open NSW Suburban University Study Hubs to the existing 14 regional hub records. The directory now contains all 19 NSW hubs identified by the Australian Government's current University Study Hubs map: 14 regional and five suburban. Each new hub record links to its local operator and a government listing.
- Added six pathway discovery routes: TAFE NSW courses, the national training register, Workforce Australia vacancies, NSW apprenticeship guidance, myfuture career exploration, and National Apprentice Employment Network support. These are discovery routes; vacancy and enrolment terms are controlled by the provider or employer.
- Added official and independent cross-check sources to the shared source register for those new pathways and for the full NSW study-hub set.
- Filled the 59 timeline records' previously blank `officialUrl` values with UAC or university source pages. The timeline generator now writes source links as well.
- Separated lowest/published selection-rank figures from ATAR values for UNSW, UTS and Newcastle scraper records. These values were previously presented as ATARs even though their source fields label them as selection ranks.
- Stopped course-area heuristics from creating required prerequisites or assumed-knowledge claims. Those fields now contain provider-supplied values only; inferred HSC advice is labelled as optional planning guidance. Course detail pages now link to both the provider course page and a live UAC course search.
- Expanded the reviewed event calendar from 8 to 12 records, including the exact 10 am SRS release, TAFE NSW Virtual Open Week, AIE campus events, and separate HSC-results and ATAR-release dates. Descriptions now state who each event is for and what happens.
- Added data checks for source URL completeness, NSW hub counts, pathway coverage, and official-plus-independent source coverage for every tool family.

## Dataset coverage snapshot

| Tool family | Current records | Coverage and source policy |
| --- | ---: | --- |
| University course search / subject alignment | 3,206 total; 1,372 undergraduate | 11 NSW universities. Provider pages supply the course record; course details and subject requirements must be checked on the provider's current page. |
| Pathway search | 12 | University, TAFE/VET, apprenticeship/traineeship, and work routes. Includes both official catalogues and clearly labelled independent discovery resources. |
| Scholarships | 103 | Individual records link to the sponsor/provider. 65 currently carry `source-check-required`; their eligibility, dates and values have not been re-verified in this pass and should not be treated as production-current. |
| Admissions timelines | 59 | All records now have a stored official URL. The underlying date dataset is dated 6 June 2026; source URLs are not evidence that each date was rechecked. |
| Events and deadlines calendar | 12 | A reviewed selection, not a complete statewide calendar. Each date must be confirmed with the event organiser. |
| Study hubs | 19 | 14 regional and five suburban NSW hub programs, checked against the government finder and the relevant hub/operator pages. The government map lists physical locations; this directory groups multiple sites under their program/operator. |
| Financial planning | 8 editable user-entered budget categories | No local cost averages or eligibility predictions are inferred. Users check current entitlements and fees with the responsible agency/provider. |
| Transition checklist | 12 tasks | User-planning prompts, cross-checked with official careers/payment information and independent wellbeing and planning guides. |
| HSC subject alignment | 1,372 undergraduate course records | Uses the course catalog above, filtered to undergraduate-entry courses; provider prerequisites remain authoritative. |

### Course-entry data coverage

In the 1,372 visible undergraduate records, 389 currently have a numeric ATAR reference, 276 have a separately labelled selection-rank reference, 22 have provider-sourced HSC prerequisites captured, and 184 have provider-sourced assumed knowledge captured. The figures are not exhaustive and do not mean courses with blank fields have no requirements. The UAC link on each course detail page searches UAC's current course catalogue; the university link remains the authority for current provider requirements. Historical ATAR profiles are guides rather than guaranteed cutoffs, and selection ranks may include adjustment factors.

## Source hierarchy and cross-check rules

The register in `data/cross-references/tool-sources.json` gives each tool family both official and independent sources, with the purpose and limitations of each source. Official sources control current dates, eligibility, fees, course availability, and provider requirements. Independent sources broaden discovery or add context; they do not override official terms. Individual public records retain their provider URL wherever that record depends on a provider decision.

Verified primary sources used for this pass include the [Australian Government University Study Hubs finder](https://www.education.gov.au/access-and-participation/university-study-hubs), [UAC 2026–27 application and offer dates](https://uac.edu.au/current-applicants/undergraduate-applications-and-offers), [TAFE NSW courses](https://www.tafensw.edu.au/courses), [Workforce Australia job search](https://www.workforceaustralia.gov.au/individuals/jobs/), and the NSW Government's [apprenticeship start guidance](https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/how-to-enrol/getting-started).

Course and event clarifications were cross-checked against UAC's [explanation of ATAR profiles and selection ranks](https://uac.edu.au/future-applicants/admission-criteria/year-12-qualifications/), its [live undergraduate course search](https://uac.edu.au/course-search/search/find-a-course-undergraduate), its [Schools Recommendation Scheme dates](https://uac.edu.au/future-applicants/scholarships-and-schemes/schools-recommendation-schemes/), TAFE NSW's [Virtual Open Week listing](https://www.tafensw.edu.au/events/), AIE's [Open Day details](https://aie.edu.au/aie_event/open-day/) and [Online Campus Day details](https://aie.edu.au/aie_event/online-campus-day/), NESA's [HSC key dates](https://www.nsw.gov.au/education-and-training/nesa/key-dates/hsc), and UAC's [ATAR access instructions](https://uac.edu.au/future-applicants/atar/how-to-get-your-atar).

## Remaining production data work

1. Re-verify or retire the 65 scholarship records flagged for source checking. The current database includes records last verified in June and July 2026; age alone does not validate that their application cycle remains current.
2. Refresh the admissions date dataset from UAC and each university for the next intake. The current dataset's generation date is 6 June 2026, and the UTS source now states that its Early Entry Program will not run for Autumn 2027. UTS records must be clearly retained as historical 2026-cycle information or removed from the forward-looking view.
3. Extend the reviewed calendar selection as 2027 university open days, information sessions, and event registrations are published. Do not scrape third-party events directly into the confirmed calendar without organiser confirmation.
4. Refresh the course catalog from all 11 provider catalogues on a recurring schedule and report course-level fetch failures or source-page changes. The recorded course refresh dates currently span April–June 2026.
5. Expand course-entry coverage using UAC's live 2026/27 course profiles and current provider pages. Match by course code, institution and campus, and store ATAR, selection rank, prerequisites, assumed knowledge, additional tests/portfolios, source URL and data year separately. Do not infer missing requirements from course names.
6. Keep local hub details such as opening hours and registration rules out of static copy unless they are rechecked on the operator's own page.

The read-only scholarship source-health pass checked 41 configured provider URLs: 25 returned HTTP success and 16 returned HTTP 403. The 403s include several university sites that block automated requests, so those results do not prove the pages are broken; they also do not verify the award details. A browser/manual provider review is still required for those records.

## Reproducible checks

`tests/toolkit-data.test.ts` asserts course coverage across the university selector, all source register families have official and independent sources, the 19-hub split is complete, pathway records have source links, and each raw timeline row now stores an official URL. `tests/scholarship-data.test.ts` ensures discovery leads remain separate from public scholarship records.
