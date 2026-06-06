import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { join } from "node:path";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

test("homepage keeps Pathway to Entry broad and tool-oriented", () => {
  const homepage = read("src/app/page.mdx");

  assert.ok(
    homepage.includes("Helping regional NSW students navigate life after school.")
  );
  assert.ok(homepage.includes("Explore the Toolkit"));
  assert.ok(homepage.includes("Search Scholarships"));
  assert.ok(homepage.includes("Read the Research"));
  assert.ok(
    homepage.includes(
      "Built from regional student consultation and aligned with the NSW Youth"
    )
  );
  assert.ok(homepage.includes("university, TAFE, training"));
});

test("navigation uses requested public route set", () => {
  const header = read("src/components/SiteHeader.tsx");

  for (const label of [
    "Home",
    "Toolkit",
    "Scholarships",
    "Timelines",
    "Research",
    "Get Involved",
  ]) {
    assert.ok(header.includes(`label: "${label}"`), `missing nav label ${label}`);
  }

  assert.ok(!header.includes("The Problem"));
  assert.ok(!header.includes("Consultation"));
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
