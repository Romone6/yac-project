# PRD 05 — Events and deadlines calendar

**Status:** MVP implemented for local review; initial calendar is a reviewed selection, not comprehensive coverage.
**Product area:** Dates and opportunities
**Primary users:** Regional NSW students comparing pathways and trying to keep application dates, scholarships, open days, expos, and information sessions straight.

## Summary

Create one searchable calendar that brings together official application and scholarship deadlines with events students can attend. Keep these record types visibly distinct: a deadline is an action date; an event is an opportunity to participate. Every date must link to the source organization, carry a time zone when relevant, and expire cleanly. The calendar should never imply that an unpublished date is confirmed or automatically roll last year's dates forward.

## User problem and outcomes

Dates are published across UAC, TAFE NSW, universities, NESA, scholarship providers, and local events pages. Students want to:

- filter by pathway, region/online, event or deadline type, and date range;
- see the organization, date/time, location or online format, and registration/action link;
- understand whether a date is a confirmed official deadline or a student-facing event;
- open the authoritative source and optionally add a relevant date to their own calendar.

## Proposed product

Provide list and calendar views, with mobile-first filters and a compact “coming up” module for the homepage. A result includes title, record type, provider, date/time and timezone (or all-day date), region, delivery mode, short plain-language summary, official source, action link, and last-checked date. For a deadline, the action should explain what the user must do and link directly to the official application or scholarship source. For an event, show registration and venue/online details only when confirmed.

Users can export an individual record or filtered selection as an `.ics` calendar file. If personal reminders are later added, they should be opt-in, use a clear retention policy, and remain separate from the no-account first release.

## How the data will be obtained

### Initial official sources

- **University applications and offers:** UAC's [key dates](https://uac.edu.au/key-dates/) and [publications](https://uac.edu.au/media-centre/publications/). Link to the institution for direct-entry dates not covered by UAC.
- **Provider events:** TAFE NSW's official [events page](https://www.tafensw.edu.au/events/) and each university's own future-student event page (for example, [University of Newcastle](https://www.newcastle.edu.au/study/undergraduate/future-student-information-events) and [Charles Sturt University](https://study.csu.edu.au/why-charles-sturt/events)).
- **Careers expos:** NESA's [Careers Expos page](https://www.nsw.gov.au/education-and-training/nesa/awards-and-events/careers-expos), once a current listing is published.
- **Campaign-wide events:** the official [National Careers Week](https://careersweek.com.au/) site. The 2027 dates were published as 10–16 May 2027 at the research snapshot date; future years must be checked from the organizer rather than inferred from the recurring pattern.
- **Scholarships and other dates:** the scholarship provider's own current page or official application portal. Secondary roundups can inform editorial discovery but cannot substantiate the displayed deadline.

### Ingestion and freshness

Use a documented API/feed or permitted official download where one exists. Otherwise, an editor enters a record from the official page and a second reviewer validates its date, type, source, and action link. Do not scrape or republish third-party event listings without permission. A simple internal queue should expose records approaching their review date, event date, or deadline.

Store `id`, `record_type`, `title`, `provider`, `pathway`, `region`, `start_at`, `end_at`, `timezone`, `all_day`, `location`, `delivery_mode`, `summary`, `official_source_url`, `action_url`, `source_checked_at`, `valid_from`, `valid_to`, `reviewer`, and `status`. Distinguish `application_deadline`, `scholarship_deadline`, `offer_date`, `open_day`, `expo`, `workshop`, and `information_session` in the underlying type and public filter.

Recheck deadlines weekly during peak application periods and monthly outside them. Check events at entry, two weeks before they occur, and shortly after the date. Remove or archive a past event; mark a deadline passed rather than presenting it as upcoming. If the organizer changes or cancels something, update the record immediately after verification. Never auto-generate the next year's record from a past one. If no official date has been announced, omit it or say “date not yet announced” only when the organizer says so.

## Non-goals

- Guaranteeing admission, scholarship eligibility, event availability, or that registration remains open.
- Sending email/SMS reminders in the first release.
- Aggregating every local event or unverified social-media listing.
- Replacing provider or UAC application systems.

## Success measures

- Users who open an official action/registration link from a date record.
- Calendar exports and successful use of pathway/date filters.
- Percentage of upcoming records with valid, recently checked primary sources.
- Stale/cancelled date corrections and time-to-correct.
- Student comprehension of the difference between a deadline and an event.

## Acceptance criteria

- Every active record has a primary source, source-check date, owner, valid date/time, and accurate record type.
- The UI distinguishes deadlines from events visually and with accessible text, not color alone.
- Dates use the correct local timezone or are clearly marked all-day; users can open the source for context.
- Expired records do not appear as upcoming, and dates are never rolled forward automatically.
- Users can filter and export records; an export retains title, date/time, location/format, and official URL.
- No current date appears without an official confirmation or source check.

## Key risks and controls

| Risk | Control |
| --- | --- |
| A changed deadline causes a student to miss an opportunity. | Weekly checks during peak periods, visible last-checked date, direct source link, and an editorial correction route. |
| Event date is treated like an application deadline. | Separate record types, labels, filters, and wording. |
| Old events are mistaken for current opportunities. | Validity bounds, automatic expiry from display, and no date rollover. |
| Calendar coverage is incomplete. | Publish the source coverage policy and avoid implying a complete statewide feed. |
