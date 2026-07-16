# Scholarship Database Reramp Design

## Decision

Keep Pathway to Entry regional NSW-first. Include national programs only when a regional NSW student can apply. Retain repository-backed JSON rather than introducing a hosted database.

## Problem

The existing importer combines discovery, extraction, publishing and reporting in one pass. Several official providers block or move pages, and a site-wide "last checked" date can make retained records look fresher than they are.

## Chosen architecture

1. A daily, read-only source-health check measures each configured official URL without changing public data.
2. A weekly refresh runs the importer, validates its candidate data, preserves prior provider records when discovery yields no valid records, and keeps each record's own `last_verified_at` date unchanged when it is retained.
3. Curated records remain editorial overrides. Discovery only adds official-source records that pass the existing record rules.
4. The public finder derives freshness per record. It never claims that the whole catalogue was refreshed when only some providers succeeded.
5. Codex scheduled tasks run the daily health check and weekly refresh/review workflow. The weekly workflow must create a reviewable PR, never merge directly.

## Approved discovery extension

CEF's regional scholarship guide and Study Australia's scholarship search are discovery sources only. They populate a separate review queue with a scholarship title, tracker URL and candidate provider URL; they never populate `scholarships.json` directly. UAC remains an official cross-institution source for equity scholarship coverage.

The queue is deliberately bounded: one CEF guide page and the Study Australia `regional` and `rural` searches, with a fixed number of detail pages per run. It stores links only, not tracker descriptions. A candidate becomes public only after a reviewer confirms that its provider URL is the official award page and it satisfies the existing scholarship contract.

## Boundaries

- No hosted database, queue, headless browser, paid scraping service, or automatic merge.
- No tracker-only public records, copied tracker descriptions, or automated publication from the discovery queue.
- No expansion into an all-Australia directory.
- No attempt to bypass a provider's bot controls. Blocked providers retain their last verified records and appear in health reporting until a compliant official source is configured.

## Success criteria

- The existing scholarship contract still validates.
- A provider outage does not delete that provider's previously published discovery records.
- A retained record retains its prior verification date and is visibly stale after 35 days.
- Daily health checks are runnable without modifying repository data.
- Weekly refreshes are covered by tests, build successfully, and are proposed through a PR.
