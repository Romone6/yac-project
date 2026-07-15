# Regional NSW Scholarship Database Reramp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the regional NSW-first scholarship catalogue safely refreshable through daily source-health checks, weekly reviewable refreshes, and truthful per-record freshness.

**Architecture:** Keep `data/scholarships/nsw/scholarships.json` as the public dataset and `curated-scholarships.json` as editorial overrides. Add a small source-health command, preserve previously discovered records for providers whose entire source set fails, and derive public freshness from each record's existing verification date.

**Tech Stack:** Next.js 16, TypeScript, Node.js ESM scripts, built-in `fetch`, Node test runner, GitHub pull requests, Codex scheduled tasks.

## Global Constraints

- Scope is regional NSW first; include national awards only when regional NSW applicants are eligible.
- Use official provider, government, institution, or established regional-support sources only.
- Never overwrite healthy public data from a provider that cannot be fetched.
- Preserve a retained record's `last_verified_at`; do not manufacture a fresh date.
- Add no dependency or hosted service.
- Daily health checks are read-only. Weekly publication remains PR-reviewed and never auto-merges.

---

### Task 1: Add source-health reporting

**Files:**
- Create: `scripts/check-scholarship-sources.mjs`
- Create: `data/scholarships/nsw/provider-health.json`
- Modify: `package.json`
- Test: `tests/scholarship-data.test.ts`

**Interfaces:**
- Consumes: `data/import-sources/scholarships.nsw.json`
- Produces: `node scripts/check-scholarship-sources.mjs [--write]` and a report with `generated_at`, `checked_sources`, `healthy_sources`, and per-source status.

- [ ] **Step 1: Write the failing contract test**

```ts
assert.ok(existsSync(join(root, "scripts/check-scholarship-sources.mjs")));
assert.ok(existsSync(join(root, "data/scholarships/nsw/provider-health.json")));
assert.equal(packageJson.scripts["scholarships:health"], "node scripts/check-scholarship-sources.mjs");
```

- [ ] **Step 2: Run the focused test**

Run: `pnpm test -- --test-name-pattern "health"`
Expected: fail because the health command and report do not exist.

- [ ] **Step 3: Implement the bounded health check**

```js
const WRITE = process.argv.includes("--write");
const status = await checkSource(url);
if (WRITE) writeJson(REPORT_FILE, report);
```

Each source receives a 12-second timeout and an honest status. A failed fetch is reported, not retried aggressively or treated as a refreshed record.

- [ ] **Step 4: Run the check and focused test**

Run: `pnpm scholarships:health -- --write; pnpm test -- --test-name-pattern "health"`
Expected: a JSON provider report and passing health contract test.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/check-scholarship-sources.mjs data/scholarships/nsw/provider-health.json tests/scholarship-data.test.ts
git commit -m "feat: add scholarship source health checks"
```

### Task 2: Make refresh failures non-destructive

**Files:**
- Modify: `scripts/import-scholarships.mjs`
- Modify: `tests/scholarship-data.test.ts`
- Modify: `docs/runbook.md`

**Interfaces:**
- Consumes: current `scholarships.json`, curated records, and provider discovery results.
- Produces: provider reports with `fallback_records`; failed-provider records are carried forward with their original `last_verified_at`.

- [ ] **Step 1: Write the failing safety assertions**

```ts
const importer = readFileSync(join(root, "scripts/import-scholarships.mjs"), "utf8");
assert.match(importer, /fallback_records/);
assert.match(importer, /previousPublished/);
```

- [ ] **Step 2: Run the focused test**

Run: `pnpm test -- --test-name-pattern "preserves"`
Expected: fail because failed-provider records are currently discarded.

- [ ] **Step 3: Implement provider fallback**

```js
const previousPublished = readJson(OUTPUT_FILE);
const fallback = report.fetched_sources === 0
  ? previousPublished.filter((item) => item.provider === provider.provider)
  : [];
```

Merge fallback before generated records, deduplicate by `source_url` and `slug`, and preserve each record's existing verification date. Record the fallback count in `import-report.json`.

- [ ] **Step 4: Run the import contract tests**

Run: `pnpm test -- --test-name-pattern "scholarship"`
Expected: passing data, coverage, and non-destructive-refresh assertions.

- [ ] **Step 5: Commit**

```bash
git add scripts/import-scholarships.mjs tests/scholarship-data.test.ts docs/runbook.md
git commit -m "fix: preserve scholarship records on provider outage"
```

### Task 3: Show truthful public freshness

**Files:**
- Modify: `src/lib/scholarships.ts`
- Modify: `src/app/scholarships/page.tsx`
- Modify: `src/app/scholarships/ScholarshipFinder.tsx`
- Test: `tests/scholarship-data.test.ts`

**Interfaces:**
- Produces: `getScholarshipFreshness(lastVerifiedAt, now?)` returning `{ label, stale }`.
- Consumes: each record's existing `last_verified_at` and `confidence_status`.

- [ ] **Step 1: Write failing freshness tests**

```ts
assert.deepEqual(getScholarshipFreshness("2026-07-10", new Date("2026-07-15")), {
  label: "Verified 10 Jul 2026",
  stale: false,
});
assert.equal(getScholarshipFreshness("2026-05-01", new Date("2026-07-15")).stale, true);
```

- [ ] **Step 2: Run the focused test**

Run: `pnpm test -- --test-name-pattern "freshness"`
Expected: fail because no freshness helper exists.

- [ ] **Step 3: Implement the smallest truthful UI change**

```ts
export function getScholarshipFreshness(lastVerifiedAt: string, now = new Date()) {
  const stale = daysSince(lastVerifiedAt, now) > 35;
  return { label: `Verified ${formatScholarshipDate(lastVerifiedAt)}`, stale };
}
```

Replace the site-wide date claim with per-record freshness and a stale warning. Keep the official source link and existing status badges.

- [ ] **Step 4: Run focused tests and route smoke**

Run: `pnpm test -- --test-name-pattern "freshness|scholarship"; pnpm build; pnpm start -p 4300`
Expected: passing tests, successful production build, and the scholarship smoke script passes against port 4300.

- [ ] **Step 5: Commit**

```bash
git add src/lib/scholarships.ts src/app/scholarships/page.tsx src/app/scholarships/ScholarshipFinder.tsx tests/scholarship-data.test.ts
git commit -m "feat: show scholarship record freshness"
```

### Task 4: Run and publish the first safe refresh

**Files:**
- Modify: `data/scholarships/nsw/scholarships.json`
- Modify: `data/scholarships/nsw/import-report.json`
- Modify: `data/scholarships/nsw/provider-health.json`

**Interfaces:**
- Consumes: Tasks 1-3 and official source responses.
- Produces: a validated dataset plus current import and health evidence.

- [ ] **Step 1: Capture source health**

Run: `pnpm scholarships:health -- --write`
Expected: `provider-health.json` records every configured source, including failures.

- [ ] **Step 2: Refresh the catalogue**

Run: `pnpm import:scholarships`
Expected: successful providers produce candidates; failed providers retain prior published records.

- [ ] **Step 3: Run release checks**

Run: `pnpm test; pnpm lint; pnpm build`
Expected: all pass.

- [ ] **Step 4: Commit the reviewed refresh**

```bash
git add data/scholarships/nsw
git commit -m "data: refresh regional NSW scholarships"
```

### Task 5: Schedule recurring maintenance

**Files:**
- Modify: `docs/runbook.md`

**Interfaces:**
- Produces: a daily Codex health-check automation and weekly Codex refresh-and-PR automation.

- [ ] **Step 1: Document the commands and approval boundary**

```powershell
pnpm scholarships:health -- --write
pnpm import:scholarships
pnpm test
pnpm lint
pnpm build
```

The weekly task creates a PR only after the release checks pass; it does not merge.

- [ ] **Step 2: Create daily Codex automation**

Configure it to run the health command in this project, report provider failures, and leave the working tree unchanged.

- [ ] **Step 3: Create weekly Codex automation**

Configure it to refresh scholarship data, run the release checks, commit only its own files, and create a PR when there is a validated change.

- [ ] **Step 4: Verify and record automation identifiers**

Expected: both automations are enabled and their IDs are included in the PR summary.

## Plan self-review

- Scope, safety, daily health, weekly refresh, UI freshness, test gates, automation, and PR review are each covered by a task.
- All referenced files and commands exist or are created by the named task.
- The plan intentionally excludes a hosted database, headless browser, paid service, and automatic merge.
