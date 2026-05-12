import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const reportPath = path.join(
  rootDir,
  "public",
  "reports",
  "pathway-to-entry-consultation-report-2026.pdf"
);
const reportHref = "/reports/pathway-to-entry-consultation-report-2026.pdf";

test("latest consultation report PDF is published in public assets", async () => {
  await access(reportPath);
});

test("site pages link to the latest consultation report PDF", async () => {
  const consultationPage = await readFile(
    path.join(rootDir, "src", "app", "consultation", "page.mdx"),
    "utf8"
  );
  const updatesPage = await readFile(
    path.join(rootDir, "src", "app", "updates", "page.mdx"),
    "utf8"
  );

  assert.equal(
    consultationPage.includes(reportHref),
    true,
    "consultation page is missing the latest report link"
  );
  assert.equal(
    updatesPage.includes(reportHref),
    true,
    "updates page is missing the latest report link"
  );
});
