import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();

const fileChecks = [
  {
    filePath: path.join(rootDir, "src", "app", "updates", "page.mdx"),
    disallowed: [
      "Dates are placeholders until confirmed.",
      "(placeholder)",
      "Update this section when the survey and focus groups are live.",
    ],
  },
  {
    filePath: path.join(rootDir, "src", "components", "SiteFooter.tsx"),
    disallowed: ["Domain placeholder for public launch."],
  },
];

test("site copy excludes known placeholder messaging", async () => {
  for (const check of fileChecks) {
    const content = await readFile(check.filePath, "utf8");

    for (const phrase of check.disallowed) {
      assert.equal(
        content.includes(phrase),
        false,
        `${path.basename(check.filePath)} still contains placeholder phrase: ${phrase}`
      );
    }
  }
});
