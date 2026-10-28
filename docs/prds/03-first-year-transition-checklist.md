# PRD 03 — First-year transition checklist

**Status:** MVP implemented for local review; checklist progress and personal dates stay device-local.
**Product area:** Plan and dates
**Primary users:** Year 12 students and recent school leavers who want a manageable next action rather than another long information page.

## Summary

Create a pathway-specific checklist that helps students track the transition from exploring options to starting the next step. The checklist should make official deadlines and personal preparation tasks visible together, while clearly separating institution-specific requirements from general prompts.

The first release is a no-account, device-local tool. It provides editable task completion, optional personal due dates, links to official sources, and a printable or downloadable copy. It is not a learning-management system or application tracker.

## User problem and outcomes

Students encounter separate application, scholarship, accommodation, payment, travel, and enrolment systems. A generic checklist can also be misleading: a university enrolment task may not apply to an apprentice, and the census date is set by a particular provider/course.

Students should be able to:

- select their likely pathway and current stage;
- see a small, ordered set of next actions;
- understand which tasks apply to them and which are conditional;
- save progress on their own device, return later, or print/export it;
- open the authoritative source for an official deadline or requirement.

## Proposed product

### Start flow

Ask for a pathway (university; TAFE/VET; apprenticeship/traineeship; work/other) and a stage (exploring; applying; offer accepted; preparing to start; first weeks). Both can be changed later. Do not ask the student to enter a school, full name, application number, or exact birth date.

### Checklist stages

- **Explore and choose:** compare route options, talk to a careers adviser, note prerequisites/entry route, check location and delivery.
- **Apply:** identify the correct application channel, collect required documents, check scholarships/equity schemes, add official dates.
- **After an offer or placement:** confirm acceptance steps, enrolment/contract, course or training-plan details, fees/support, housing and transport.
- **Before the first day:** device/tools, timetable, travel, accommodation, contact details, access/disability support, and emergency contacts.
- **First weeks/first study period:** learn where support is, note provider-specific administration dates and census date (where relevant), and find financial/academic support.

Each task has a short instruction, “why it matters,” applicability label (all / university / VET / apprenticeship / conditional), optional due date, official source link, and completion toggle. The UI groups tasks by stage, supports filters for incomplete tasks, and offers printable checklist output. A progress bar reflects only the user's device state.

### Personalization boundary

Use explicit pathway choice to show relevant checklist templates. Do not infer whether a student is eligible for a payment, scholarship, access scheme, or concession. Provide an “I'm not sure” option that leaves the item available as a question to ask an official provider/adviser.

## How the data will be obtained

### Source set

- **University applications:** UAC's current [Year 12 checklist and publications](https://uac.edu.au/media-centre/publications/), plus [key dates](https://uac.edu.au/key-dates/), provide application, preference, offers, documents, and enrolment steps for the channels UAC covers. Direct university applications must point to the individual provider.
- **University first study period:** [Study Assist key dates](https://www.studyassist.gov.au/starting-study-basics/key-dates-and-terminology) explains that census dates are set by the provider and vary by course/study period. The checklist must therefore ask users to retrieve their own provider/course census date rather than publishing a single universal date.
- **VET/TAFE:** source enrolment and course-specific documents from the official provider and [Skills NSW](https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/how-to-enrol/find-a-course). Do not imply that every TAFE course uses one application process.
- **Apprenticeships and traineeships:** use NSW Training Services' [seven steps to starting](https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/how-to-enrol/getting-started/7-steps-for-starting-your-apprenticeship-or-traineeship) and the NSW Government's applicable training-plan information. Tasks should reflect that an employer, Apprentice Connect Australia Provider, and RTO may all be involved.
- **Transport and cost preparation:** link to the [Transport for NSW tertiary/TAFE concessions page](https://transportnsw.info/tickets-opal/ticket-eligibility-concessions/child-student-concessions/tertiary-or-tafe-students), relevant provider pages, and the Regional Move and Money Guide PRD.
- **Local support:** link to a verified directory record, adviser/counsellor, or provider support page; do not store individual contact details unless they are published for this purpose.

### Editorial workflow and refresh

- Store tasks as versioned JSON/Markdown records with an owner, pathway applicability, source URL, checked date, review interval, and optional validity cycle.
- A content editor drafts a task from a primary official guide; a second reviewer checks that the task and applicability match the source before publication.
- Recheck date-bearing tasks each admissions cycle and before the start of semester; recheck stable preparation prompts annually. Provider-specific tasks should link out and carry no copied date unless a record in the Events and Deadlines Calendar owns it.
- If an official source changes, edit the canonical task once. A checklist version change should preserve a student's completed stable tasks where IDs remain the same and show new tasks clearly.
- Keep archived task versions internally for audit, but do not surface expired dates as current.

### Suggested task schema

`task_id`, `template_version`, `stage`, `pathway_types`, `title`, `action_text`, `why_it_matters`, `applies_when`, `official_url`, `source_checked_at`, `source_owner`, `date_record_id` (optional), `review_due`, `sort_order`.

User state is separate: `task_id`, `done`, `user_due_date`, and optional private note. Store locally in the browser; offer reset, print, and JSON/CSV export. If local storage is unavailable, keep the active session functional and explain that progress will not persist.

## Non-goals

- Tracking application status, grades, offers, enrolment credentials, government claims, or employer contracts.
- Sending reminders by email/SMS or creating a cross-device account in the first release.
- Replacing advice from school careers advisers, providers, UAC, Services Australia, or an Apprentice Connect Australia Provider.

## Success measures

- Checklist start and completion-toggle rates by stage/pathway.
- Return visits with locally saved progress, print/export use, and task-source click-through.
- Student testing shows that users can identify their next three actions and distinguish official dates from personal target dates.
- Every sourced/date-bearing task has a valid source and current review timestamp.
- No personal checklist content is transmitted to analytics or stored by the server.

## Acceptance criteria

- Pathway/stage choices are reversible and “not sure yet” is supported.
- Conditional tasks explain when they apply; irrelevant tasks are hidden or labeled, not silently presented as universal.
- Official dates link to their source record and timezone/context; user-entered target dates are visibly personal.
- The user can clear locally saved progress and access a print-friendly version.
- If dates change, the checklist does not continue to show a stale value without a warning.

## Key risks and controls

| Risk | Control |
| --- | --- |
| Checklist becomes a stale pseudo-authority. | Keep dates in the calendar source of truth; annual/cycle review for tasks. |
| Different application routes are collapsed into one. | Label tasks by route and use official application-channel links. |
| Students save sensitive notes. | Explain local storage, avoid asking for sensitive values, and provide clear/delete controls. |
