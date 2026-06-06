# Pathway to Entry Runbook

## Scholarship Finder local smoke demo

Run from `C:\YAC PROJECT WEBSITE\yac-project-main` in PowerShell:

```powershell
pnpm dev
```

Then open:

```powershell
Start-Process "http://localhost:3000/scholarships"
```

Expected local proof:

- The `/scholarships` page renders the Scholarship Finder.
- Records show scholarship name, provider/institution, value, closing date, eligibility tags, status badge, last verified date, and official source link.
- Filters are available for open now, closing soon, regional/rural, equity, first in family, Aboriginal and Torres Strait Islander, disability/accessibility, leadership/community, academic merit, relocation, accommodation, institution, field of study, value range, and study level.

Automated route smoke command after a production build/server:

```powershell
node scripts/smoke-scholarship-routes.mjs http://127.0.0.1:4300
```

## Data refresh commands

Run from `C:\YAC PROJECT WEBSITE\yac-project-main` in PowerShell.

```powershell
pnpm import:scholarships
```

Refreshes the scholarship database from `data/import-sources/scholarships.nsw.json`, merges provider-discovered records with `data/scholarships/nsw/curated-scholarships.json`, writes `data/scholarships/nsw/scholarships.json`, and records source fetch results in `data/scholarships/nsw/import-report.json`.

```powershell
pnpm import:timelines
```

Checks official timeline source pages from `data/import-sources/timelines.nsw.json`, writes `data/timelines/nsw/import-report.json`, then regenerates `data/timelines/nsw/admission-rounds.json`.

```powershell
pnpm import:subjects
```

Checks official course source roots from `data/import-sources/subject-alignment.nsw.json`, writes `data/courses/nsw/import-report.json`, then runs the NSW course and subject-alignment generator.

```powershell
pnpm import:all
```

Runs scholarships, timelines, and subject-alignment refreshes in that order. Use this before a major data release, then run `pnpm test`, `pnpm lint`, `pnpm build`, and the production smoke command above.
