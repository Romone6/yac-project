# PRD 01 — Cross-pathway finder

**Status:** MVP implemented for local review; non-university options link to official live searches.
**Product area:** Explore pathways
**Primary users:** Regional NSW students in Years 10–12 and recent school leavers; secondary users are parents/carers and careers advisers.

## Summary

Create one search and browse experience for post-school options that currently sit in separate catalogs: university, NSW VET/TAFE, apprenticeships and traineeships, and selected work-entry or pre-apprenticeship resources. A student should be able to start with an ordinary interest (“nursing”, “cars”, “working with kids”) and discover credible routes without mistaking Pathway to Entry for an admissions authority or live job board.

The current site already has a large NSW university course dataset and course-detail pages. The proposed feature keeps that experience and adds carefully scoped, link-first records for other routes. It does not attempt to mirror every live provider catalog in its first release.

## User problem and outcomes

Students often know an interest but not the qualification or provider terms to search. They can also assume university is the only route, or see fees/availability without knowing whether the information is current.

After using the finder, a student should be able to:

- see relevant options across more than one pathway;
- understand what each option is, where it is offered, and the next step;
- distinguish current sourced records from broad pathway guides;
- go to the official provider or government source to confirm entry, fees, dates, and availability.

## Proposed product

### Entry and result experience

- Search from the homepage and the finder page using course, interest, occupation, institution, qualification, or keyword.
- Browse by four visible pathway types: **University**, **TAFE/VET**, **Apprenticeship or traineeship**, and **Work and other entry routes**.
- Offer only supported filters: NSW location/region, qualification level, delivery mode, and entry route. A filter is hidden when its fields are not populated reliably.
- Result cards show pathway type, course or option title, provider, region/location, delivery mode when supplied, concise summary, source-checked date, and a prominent official-source action.
- Provide a detail page with route overview, entry steps, official provider record, funding/support links when verified, and a “what to check next” link to the checklist or calendar.
- Allow comparing up to three results only for fields with compatible definitions. Avoid a false numeric ranking or “best for you” score.

### Initial release boundary

1. Retain current undergraduate NSW university course records and expose the shared pathway label.
2. For NSW TAFE/VET, provide a source-checked link to the official Skills NSW search. Do not mirror course records until a documented export/API, reuse terms, and an update owner are confirmed.
3. For apprenticeship/traineeship and broader national vocational exploration, provide source-backed route cards that open Australian Government searches/guidance. Do not claim to list vacancies.
4. Keep scholarships and existing planning tools available in broad search; keep their records distinguishable from course/pathway options.

## How the data will be obtained

### Source hierarchy

1. **Existing university catalog:** use the current repository data and official course URLs. Keep the course owner/institution as the authority; retain the existing import process and last-updated field.
2. **NSW subsidized VET:** use [Skills NSW](https://skills.education.nsw.gov.au/) for Smart and Skilled course/provider/location/delivery/duration/fee-estimate signals. NSW Education states that the search covers government-subsidized options and that training providers confirm current eligibility and fees ([Find a course](https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/how-to-enrol/find-a-course)).
3. **Nationally recognised qualifications:** validate qualification name/code and whether it is current against [training.gov.au](https://training.gov.au/search). ASQA specifically directs users to the National Training Register to identify current or superseded products ([transition guidance](https://www.asqa.gov.au/for-providers/manage-registration/change-scope-registration/training-product-transition-arrangements/when-training-products-change)). This register is not a course timetable or a guarantee that a provider is enrolling.
4. **Apprenticeships:** explain route types and next steps using [Australian Apprenticeships](https://www.apprenticeships.gov.au/about-apprenticeships/types-apprenticeships) and NSW-specific material from [Training Services NSW](https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/how-to-enrol/getting-started/7-steps-for-starting-your-apprenticeship-or-traineeship). Link to an Apprentice Connect Australia Provider or current opportunity source rather than storing claims about open positions.
5. **General VET discovery:** link to the Australian Government's [Your Career course search](https://my.gov.au/en/services/education/vocational-education-and-training/vocational-education-and-training-courses) where state data is not available. Avoid copying the national catalog until a documented export/API and reuse terms are confirmed.

### Acquisition and quality workflow

- First inspect each source for a documented API, export, update notes, and reuse terms. Contact the source owner when the terms or feeds are unclear.
- If no suitable structured feed exists, a content editor creates/updates a bounded record from the official page. Save the URL and the date checked. Never make scraping a hidden dependency.
- Validate training product code/status against training.gov.au before publishing a qualification as current. Validate actual provider availability and fee/delivery claims against the provider or Skills NSW listing.
- Recheck VET records at least once per term or when the source shows a change; recheck higher-risk fee/subsidy details more frequently. Recheck apprenticeship pathway pages twice yearly and on notification of changed rules.
- Mark a record “needs recheck” when a source is unavailable, stale, or conflicts with a provider. Remove expired fee or intake claims; keep the stable pathway explainer if still accurate.

### Suggested record fields

`id`, `pathway_type`, `title`, `provider`, `qualification_name`, `qualification_code`, `qualification_status`, `interest_tags`, `occupation_tags`, `region_or_delivery_area`, `delivery_modes`, `entry_route`, `summary`, `fee_signal` (optional, explicitly estimated/subsidy scoped), `official_url`, `source_url`, `source_checked_at`, `valid_from`, `valid_to`, `review_status`.

Do not infer guaranteed local availability from a national qualification listing. Store the source's location wording as written, and distinguish “available in NSW” from “available near you.”

## Non-goals

- Live vacancies, recommendations based on personal profiles, eligibility decisions, or application submission.
- Complete national coverage or a replacement for Skills NSW, a provider catalog, UAC, or training.gov.au.
- Unverified “in demand” labels or claims that a particular pathway guarantees employment.

## Success measures

- Search-to-result click-through by pathway type and query family.
- Share of searches that return at least one useful official source, monitored alongside no-result queries.
- Use of pathway filters, course detail links, and subsequent checklist/calendar actions.
- Record freshness and correction rate; target zero public records with missing source URL or review date.
- Student research sessions can identify two plausible routes for the same interest without being told one is universally superior.

## Acceptance criteria

- Each result clearly identifies pathway and provider and links to an authoritative page.
- A record with unknown region, delivery, or fees does not receive an invented value or misleading filter chip.
- Expired or unverified availability/price data is hidden or explicitly flagged.
- Search works with plain-language interests as well as exact course/qualification terms.
- No job vacancy is presented as current without a maintained source and date.

## Key risks and controls

| Risk | Control |
| --- | --- |
| Broad catalogs change faster than a small project can maintain them. | Start with bounded categories; prefer outbound discovery links; appoint a data owner before expanding. |
| Students read an estimate or catalog listing as guaranteed enrolment/eligibility. | Label the source and scope beside the claim; link to the provider; avoid final eligibility language. |
| Training qualifications become superseded. | Validate current status on training.gov.au and retain a review state before release. |
| Search implies jobs are available. | Separate “career/pathway information” from live job listings and label vacancies only if separately supported. |
