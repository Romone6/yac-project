# PRD 04 — Regional support directory

**Status:** MVP implemented for local review; initial coverage is 13 CUC locations in NSW.
**Product area:** Find support
**Primary users:** Regional NSW secondary students and recent school leavers who need a nearby place, person, or service to help them explore or continue a pathway.

## Summary

Build a searchable directory of verified study and careers support, beginning with formal study-hub locations and then adding other services only when their local remit, contact details, and access conditions can be confirmed. The directory should answer “what support is near me, what can it help with, and how do I check whether I can use it?” It must not imply that a service is open, funded, or available to every student unless its source confirms that.

## User problem and outcomes

Students outside major centres may not know where to get reliable help with study, internet/computer access, course research, applications, or careers advice. Existing information is spread across government maps, provider directories, and local centre websites. Users need to:

- search by town or postcode and filter by support type;
- understand what a location offers and who can use it;
- contact the organization or check its official page directly;
- see when the listing was last verified and report a correction.

## Proposed product

The first release is a responsive list-first directory with town/postcode search, region and support-type filters, and clear “visit website,” “call,” or “get directions” actions where verified. Each result shows service name, location, a short sourced description, access/catchment notes, and a verification date. A map can be considered after the initial dataset has reliable coordinates and an acceptable mapping/data-use basis; it is not required for launch.

The implemented first release covers 13 NSW Country Universities Centre (CUC) locations. It does not copy every location in the federal map. Initial coverage should prioritize:

1. Country Universities Centre (CUC) locations in NSW, sourced from the network's official directory and linked to each centre.
2. Use the Australian Government University Study Hubs finder as an outbound broader-search link until its complete location records have a verified reuse and maintenance process.
3. Other student or careers supports only where the operator publishes a clear public service description and local contact.

Regional Industry Education Partnerships (RIEP) are potentially useful pathway context for schools and employers. They should not be presented as walk-in student support unless a specific public-facing local service and contact are confirmed.

### Result detail

Every public record should show only supported attributes: what help is offered, who the service says it supports, location/address, opening/contact details if published, accessibility information if explicitly documented, official page, and last checked date. Do not infer disability access, free access, drop-in availability, eligibility, or opening hours from a general program description.

## How the data will be obtained

### Source hierarchy

- Seed study-hub records from the Australian Government's [University Study Hubs finder](https://www.education.gov.au/access-and-participation/university-study-hubs) and program page. The federal directory is the authoritative program-level starting point, but local operating details still need confirmation.
- Cross-check CUC locations against its official [centre directory](https://www.cuc.edu.au/our-centres/) and the individual centre page.
- For additional services, use the service operator's own current website or a responsible NSW/federal government service directory. A secondary list can help find candidates, but it is not sufficient evidence for a published record.
- Keep RIEP information linked as school/employer pathway context from the [NSW Government RIEP page](https://www.nsw.gov.au/education-and-training/vocational/vet-programs/regional-schools-industry), not as a student drop-in listing by default.

### Collection and maintenance

For the first release, use a small editorially maintained dataset. Review the terms and contact the directory owner before bulk copying or automating imports. If the source later offers a documented feed or downloadable dataset with clear reuse terms, prefer that over manual entry; do not scrape pages without permission or a sustainable review process.

For each record, store: stable ID; operator; name; service type; town/region; street address when published; phone/email/site; official service description; eligibility/catchment wording; opening hours only when explicitly published; accessibility attributes only when stated; official source URL; checked date; reviewer; review due date; and status. Keep a correction history. Coordinates may be added only from an authoritative source or verified address geocoding with appropriate reuse terms.

Check the source directories quarterly, and confirm a centre's local hours and contact details directly at least twice per year or before featuring it prominently. If a local detail cannot be confirmed, remove that detail rather than presenting old data. A “report a change” form should submit a suggested correction to an editorial queue; it should never publish user-submitted changes automatically.

## Non-goals

- Guaranteeing a service has capacity, accepts a particular student, or provides a specific appointment.
- Giving individualized counselling, legal, medical, financial, or eligibility advice.
- Collecting a user's precise location or continuously tracking them.
- Launching a map before location records and licensing are reliable.

## Success measures

- Searches that lead to an official provider/contact click.
- Search refinement and no-results rates by broad region (without retaining precise user queries longer than needed).
- Proportion of live records within their review window and successful correction resolution time.
- Student usability feedback on whether the location, service, and access conditions are clear.

## Acceptance criteria

- Every listing has a primary official source, last-checked date, and named internal owner/reviewer.
- Search works by town/postcode and service type; unsupported filters are not offered.
- Access, cost, hours, and accessibility are shown only when substantiated by the source.
- A user can reach the service's official page or contact channel from each result.
- Expired or disputed records are flagged internally and hidden or qualified until re-verified.
- A correction can be submitted without creating an account, and remains unpublished until reviewed.

## Key risks and controls

| Risk | Control |
| --- | --- |
| A listing appears to guarantee local service or availability. | Use careful copy, show official contact, and state that users should confirm current access. |
| Directory data becomes stale. | Quarterly directory scan, twice-yearly local verification, review dates, and fast correction queue. |
| Candidate services are miscategorized. | Publish only what the operator describes; treat RIEP and similar programs as contextual links unless direct service is confirmed. |
| Map geocoding introduces wrong locations or reuse issues. | Launch list-first; use verified coordinates and documented data terms before adding a map. |
