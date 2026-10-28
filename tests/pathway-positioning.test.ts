import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { join } from "node:path";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

test("homepage introduces the cross-pathway finder clearly", () => {
  const homepage = read("src/app/page.mdx");

  assert.ok(homepage.includes("For regional NSW students"));
  assert.ok(homepage.includes("What are you "));
  assert.ok(homepage.includes("considering after high school?"));
  assert.ok(homepage.includes("/search?pathway=university&q=course"));
  assert.ok(homepage.includes("/search?pathway=tafe-vet&q=course"));
  assert.ok(homepage.includes("/search?pathway=apprenticeship&q=trade"));
  assert.ok(homepage.includes("existing partnership with the NSW Youth Advisory Council"));
});

test("navigation exposes pathway, planning, and support features", () => {
  const header = read("src/components/SiteHeader.tsx");

  for (const label of [
    "Search across pathways",
    "Financial pathway guide",
    "Transition checklist",
    "Events and deadlines",
    "Regional study support directory",
    "Research",
  ]) {
    assert.ok(header.includes(`label: "${label}"`), `missing nav label ${label}`);
  }
});

test("toolkit hub lists all requested tool cards", () => {
  const toolkit = read("src/app/toolkit/page.tsx");

  for (const tool of [
    "Application Timeline Tracker",
    "Scholarship Finder",
    "Subject Alignment Tool",
    "Financial Pathway Explainer",
    "Regional Student Checklist",
    "Support Directory",
    "Events and Deadlines Calendar",
  ]) {
    assert.ok(toolkit.includes(tool), `missing toolkit card ${tool}`);
  }
});

test("research page holds deeper project framing and report link", () => {
  const research = read("src/app/research/page.mdx");

  assert.ok(research.includes("Consultation, Evidence And Recommendations"));
  assert.ok(research.includes("student voice data"));
  assert.ok(research.includes("policy recommendations"));
  assert.ok(research.includes("/reports/pathway-to-entry-consultation-report-2026.pdf"));
});

test("runbook includes a runnable scholarship finder smoke demo", () => {
  const runbook = read("docs/runbook.md");

  assert.ok(runbook.includes("Scholarship Finder local smoke demo"));
  assert.ok(runbook.includes("pnpm dev"));
  assert.ok(runbook.includes("http://localhost:3000/scholarships"));
});
