# Pathway to Entry feature PRDs

**Prepared:** 28 October 2026
**Status:** Five local MVPs implemented for user review; the data coverage is intentionally bounded and source maintenance remains editorial.
**Audience:** Regional NSW secondary students considering university, VET/TAFE, apprenticeships, work, or several options.

This pack turns the five candidate additions in the public-site research brief into implemented first-release products. Each PRD describes the user problem, the experience, how the information is sourced and maintained, the release boundary, and the remaining conditions for a broader production dataset.

## The five proposed features

1. [Cross-pathway finder](01-cross-pathway-finder.md) — existing NSW university course results plus source-linked NSW VET/TAFE, apprenticeship and broader course searches.
2. [Regional move and money guide](02-regional-move-and-money-guide.md) — a practical cost-planning guide with official payment, travel, tenancy, and provider-cost sources.
3. [First-year transition checklist](03-first-year-transition-checklist.md) — a saved, pathway-specific checklist from choosing an option through the first weeks of study or work.
4. [Regional support directory](04-regional-support-directory.md) — a findable directory of local study hubs and other verified student and careers support.
5. [Events and deadlines calendar](05-events-and-deadlines-calendar.md) — a source-backed calendar that keeps provider deadlines distinct from events students may attend.

## Shared product principles

- **Official source first.** Provider and government pages remain the authority for entry, eligibility, dates, fees, and service availability. Pathway to Entry summarizes and links; it does not determine admission or payment entitlement.
- **Show coverage honestly.** A filter or comparison is available only when the underlying records are sufficiently complete. Missing course or local event coverage is stated plainly.
- **Every maintained record carries provenance.** Store a canonical source URL, source type, last-checked date, reviewer, and any applicable validity dates. Do not silently convert an event's date or a benefit's amount into a permanent fact.
- **Prefer structured feeds, not brittle scraping.** Use a documented feed/API or a permitted download if available. Otherwise, maintain a small reviewed dataset from official pages and link to the source. Do not depend on scraping pages without permission or an agreed maintenance plan.
- **Make the first release useful without an account.** Save checklists locally on the device; don't collect school, family income, disability, immigration, or application data to power discovery.
- **Use plain-language boundaries.** Label general information, estimated amounts, regional availability, and personalized eligibility checks separately.

## Proposed delivery order

The order below follows the earlier research shortlist while accounting for dependency and maintenance work:

1. **Define a shared source and record standard.** Agree the common fields and source-review process before importing more records.
2. **Cross-pathway finder.** Begin with a deliberately bounded set of official NSW VET and apprenticeship records alongside the existing university catalog. This establishes the pathway labels and filters used by later tools.
3. **Regional move and money guide.** Publish official links and a moving-cost planning flow; avoid building a home-grown benefits calculator.
4. **First-year transition checklist.** Reuse the finder, dates, and official links so each task points to a real next step.
5. **Regional support directory.** Start with official hub/centre locations, then add other support only when its local scope and contact details can be verified.
6. **Events and deadlines calendar.** Ship after a named person or team accepts frequent date-checking and expiry work.

All five MVPs are now present in the local site. The ordering above describes their implementation sequence. Before broadening any dataset, assign an information owner who can perform the stated reviews; the calendar especially needs frequent date checks.

## Common record and review model

For any structured record, retain only fields needed for the public experience:

| Field | Purpose |
| --- | --- |
| `id`, `record_type` | Stable internal reference and feature category. |
| `title`, `summary`, `keywords` | Search, filters, and a concise public result. |
| `pathway`, `region`, `delivery_mode` | Comparison dimensions, only when the source supplies them. |
| `provider`, `official_url` | Clearly identify the organization responsible for current details. |
| `source_url`, `source_checked_at` | Provenance and user-visible freshness. |
| `valid_from`, `valid_to` | Bound a date, price, offer, or event to the period it applies to. |
| `review_status`, `reviewer`, `notes` | Internal quality control and correction history. |

Do not make an unverified record public. If a source changes or a record cannot be confirmed, label it for review and remove time-sensitive claims or temporarily unpublish it. The preferred operating model is a small editorial queue and a visible “report a correction” route, not automatic publication from scraped content.

## Source-research snapshot

The initial source set was checked on 28 October 2026. It is a set of primary starting points, not proof that each source offers a reusable API or grants redistribution rights. Before importing data, inspect each source's terms, available structured files, and contact channel.

- Skills NSW says its search exposes subsidized NSW VET course, provider, location, delivery, duration, and fee-estimate details; training providers must confirm current eligibility and fees ([Skills NSW](https://skills.education.nsw.gov.au/), [NSW Education: Find a course](https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/how-to-enrol/find-a-course)).
- The National Training Register distinguishes current from superseded training products, and ASQA directs users to the register to check current versions ([training.gov.au](https://training.gov.au/search), [ASQA change guidance](https://www.asqa.gov.au/for-providers/manage-registration/change-scope-registration/training-product-transition-arrangements/when-training-products-change)).
- Services Australia owns Tertiary Access Payment rules and its Payment Finder; Moneysmart provides a budget planner that saves data locally in the user's browser ([TAP eligibility](https://www.servicesaustralia.gov.au/who-can-get-tertiary-access-payment?context=53447), [Payment Finder](https://www.servicesaustralia.gov.au/online-estimators?context=64107), [Moneysmart budget planner](https://moneysmart.gov.au/budgeting/budget-plANNER)).
- UAC publishes application/offer dates and Year 12 checklists; Study Assist explains provider-specific census dates; Transport for NSW owns NSW student concession eligibility ([UAC key dates](https://uac.edu.au/key-dates/), [UAC publications](https://uac.edu.au/media-centre/publications/), [Study Assist dates](https://www.studyassist.gov.au/starting-study-basics/key-dates-and-terminology), [Transport for NSW](https://transportnsw.info/tickets-opal/ticket-eligibility-concessions/child-student-concessions/tertiary-or-tafe-students)).
- The Australian Government Study Hubs map and Country Universities Centre location directory provide starting location sources; each local centre should confirm operational details ([University Study Hubs finder](https://www.education.gov.au/access-and-participation/university-study-hubs), [Regional University Study Hubs program](https://www.education.gov.au/regional-university-study-hubs), [CUC centres](https://www.cuc.edu.au/our-centres/)).
- UAC, TAFE NSW, universities, NESA, and the official National Careers Week page publish event or deadline information; their pages are maintained separately, so the site must retain and check each individual source ([UAC key dates](https://uac.edu.au/key-dates/), [TAFE NSW events](https://www.tafensw.edu.au/events/), [NESA Careers Expos](https://www.nsw.gov.au/education-and-training/nesa/awards-and-events/careers-expos), [National Careers Week](https://careersweek.com.au/)).

## Deferred collaboration candidates

These are possible ways to distribute or enrich content later, not dependencies or approved outreach:

- Regional Industry Education Partnerships (RIEP) for school/employer pathway context ([NSW Government](https://www.nsw.gov.au/education-and-training/vocational/vet-programs/regional-schools-industry)).
- Country Universities Centres for local support verification and stories ([CUC centres](https://www.cuc.edu.au/our-centres/)).
- TAFE NSW / Institute of Applied Technology for vocational pathway explainers and event sourcing ([TAFE NSW events](https://www.tafensw.edu.au/events/), [IAT school engagement](https://www.iat.tafensw.edu.au/engage-with-us/schools)).
- National Careers Week, TAFE NSW Jobs Connect Festival, university outreach, and regional careers expos for future calendar listings or student-facing explainers ([NCW](https://careersweek.com.au/), [Jobs Connect](https://studentengagement.tafensw.edu.au/jobs-connect-festival-26), [NESA Careers Expos](https://www.nsw.gov.au/education-and-training/nesa/awards-and-events/careers-expos)).

The NSW Youth Advisory Council and Youth Week are existing relationships, not new partnership prospects; nothing in this PRD proposes re-establishing them.
