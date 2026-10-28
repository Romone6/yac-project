# PRD 02 — Regional move and money guide

**Status:** MVP implemented for local review; budget figures remain user-entered and device-local.
**Product area:** Funding and costs
**Primary users:** Regional NSW school leavers comparing study or training options that may require regular travel or a move from home.

## Summary

Build a practical guide that helps a student list likely costs, discover relevant official support, and prepare questions before accepting a course or moving. The experience combines a short scenario-led guide, a planning worksheet, and trusted links. It does not calculate a student's Centrelink entitlement, predict rent, or provide financial or legal advice.

## User problem and outcomes

Students may compare course fees while missing transport, accommodation, equipment, food, technology, bond, and moving costs. Government payments and concessions have detailed personal rules that change over time. A static page of benefit amounts can become wrong and can suggest eligibility that the site cannot assess.

The student should leave with:

- a fuller list of one-off and recurring costs to investigate;
- official tools for checking payments, concessions, and study costs;
- regionally relevant prompts about travel, accommodation, and moving;
- an understanding that a linked government/provider source makes the final decision.

## Proposed product

### Page structure

1. **Choose a situation:** staying at home and commuting; moving for university/TAFE; apprenticeship/traineeship; online or mixed study.
2. **Plan one-off costs:** travel to inspect or move, bond/rent in advance, accommodation setup, tools/equipment, computer, course-specific materials.
3. **Plan recurring costs:** rent, utilities, food, local/intercity travel, phone/data, student fees, and repayments or payments only where relevant.
4. **Check support:** scholarships, Youth Allowance/Austudy/ABSTUDY, Tertiary Access Payment, fares or transport concessions, provider hardship/support services.
5. **Take an action:** open an official eligibility tool, save a question to the transition checklist, or visit the provider's cost/accommodation page.

Each cost topic should use a plain-language description, a “how to estimate it” prompt, an official source link, and whether the item is one-off or recurring. Students may optionally enter their own rough amounts into an on-device worksheet; the tool must not prefill a “typical” regional cost without a defensible, maintained dataset.

### Data and privacy behavior

- No family income, bank details, Centrelink CRN, or exact home address is requested.
- If students use an embedded or linked calculator, it is the official source's calculator; Pathway to Entry must disclose when the user leaves the site.
- A locally saved budget worksheet is optional, device-only, clearable, and never attached to an account.
- Avoid any “you qualify” result. A guided eligibility prompt may list questions to check, but the final check links to the agency.

## How the data will be obtained

### Primary sources and roles

- **Payments and moving:** use the official [Tertiary Access Payment eligibility](https://www.servicesaustralia.gov.au/who-can-get-tertiary-access-payment?context=53447), [moving for study](https://www.servicesaustralia.gov.au/moving-for-study?context=60023), and [Payment Finder](https://www.servicesaustralia.gov.au/online-estimators?context=64107). The Payment Finder is authoritative for estimates; the site only describes it and links out.
- **Study and HELP costs:** use provider fee pages for course-specific charges and [Study Assist](https://www.studyassist.gov.au/) for Commonwealth supported places and HELP guidance. Do not copy a generic amount into course cards; link by course/provider.
- **Student budgets:** use the Australian Government [Moneysmart student money guide](https://moneysmart.gov.au/student-life-and-money/studying) for categories and its [budget planner](https://moneysmart.gov.au/budgeting/budget-plANNER) as the external calculation tool. Moneysmart states that its planner stores data on the user's computer or mobile device.
- **NSW transport:** use Transport for NSW's [tertiary and TAFE concessions](https://transportnsw.info/tickets-opal/ticket-eligibility-concessions/child-student-concessions/tertiary-or-tafe-students), [regional tickets and fares](https://transportnsw.info/tickets-opal/regional-tickets-fares), and current trip/fare tools. Eligibility is conditional, so show the relevant source rather than applying it to every student.
- **Moving and renting:** link to current NSW Government/Fair Trading or Legal Aid NSW tenant guidance, such as [Legal Aid NSW tenancy information](https://www.legalaid.nsw.gov.au/my-problem-is-about/my-housing/tenancy). Do not summarize legal rights beyond plain-language signposting without a reviewed source.
- **Accommodation and course-specific expenses:** link to each provider's official accommodation and course-cost pages. These are institution-specific, so do not assume a single state-wide figure.

### Acquisition and review process

- Store guide topics and source links in a reviewed content manifest, not hardcoded eligibility rules.
- For each monetary value or eligibility statement, store source URL, exact scope, last-checked date, and a validity period. Prefer removing the amount and keeping a link if no reliable update signal exists.
- Review government payment and fare sources at least quarterly and when budgets/rates are announced; review institution cost pages before each admissions cycle. A named editor checks the source page, records what changed, and republishes.
- Where a page uses a calculator or complex eligibility logic, link directly to it instead of reimplementing it.
- On source outage or uncertainty, suppress time-sensitive amounts and show the official home page plus “check current rules.”

### Suggested content schema

`topic_id`, `scenario`, `cost_type` (one-off/recurring/conditional), `title`, `plain_language_prompt`, `common_questions`, `pathway_scope`, `region_scope`, `source_name`, `source_url`, `checked_at`, `valid_from`, `valid_to`, `review_owner`, `status`.

No personal budget entries should be sent to analytics or retained server-side.

## Non-goals

- Centrelink/TAP entitlement determinations, tax or financial advice, or an internally built payment calculator.
- A rent/property listings marketplace or claims about average regional rent without a maintained, clearly defined source.
- Making school or provider choices based on a single “total cost” score.

## Success measures

- Student starts a cost plan and visits at least one relevant official support page.
- Useful progression to the checklist or course/provider detail after the guide.
- User comprehension: students can name one-off versus recurring costs and know where eligibility is decided.
- Percentage of live links with valid review metadata; no expired amounts presented as current.
- Low collection risk: no financial profile data on the server.

## Acceptance criteria

- Any amount is tied to a source, scope, valid period, and checked date; otherwise it is not displayed as current.
- Payment/concession content says rules apply and provides the official eligibility route.
- The guided path includes university, VET/TAFE, and apprenticeship situations without implying that all payments apply to all routes.
- The budget worksheet is optional, works without account creation, and has a clear reset/export path if implemented.
- The page works without JavaScript as a readable linked guide.

## Key risks and controls

| Risk | Control |
| --- | --- |
| Payment rules or rates change. | No locally calculated entitlement; quarterly review and direct Services Australia link. |
| Students interpret a cost list as complete. | Call it a planning prompt, not a full quote; link to institution-specific fees. |
| Sensitive financial data is collected. | Keep any entered figures local-only and exclude them from analytics. |
| Rental information crosses into legal advice. | Use reviewed summaries and link to NSW tenancy authorities/help services. |
