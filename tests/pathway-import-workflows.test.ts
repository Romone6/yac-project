import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function readJson(path: string) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

test("pathway data import manifests cover scholarships, timelines and subject alignment", () => {
  const scholarshipSources = readJson("data/import-sources/scholarships.nsw.json");
  const timelineSources = readJson("data/import-sources/timelines.nsw.json");
  const subjectSources = readJson("data/import-sources/subject-alignment.nsw.json");

  assert.ok(scholarshipSources.providers.length >= 14);
  assert.ok(timelineSources.sources.length >= 2);
  assert.equal(subjectSources.target_level, "undergraduate");
  assert.ok(subjectSources.sources.length >= 11);
});

test("package exposes repeatable PowerShell-runnable import commands", () => {
  const pkg = readJson("package.json");

  for (const command of [
    "import:scholarships",
    "import:timelines",
    "import:subjects",
    "import:all",
  ]) {
    assert.ok(pkg.scripts[command], `missing ${command}`);
  }

  assert.ok(existsSync(join(root, "scripts/import-scholarships.mjs")));
  assert.ok(existsSync(join(root, "scripts/import-timelines.mjs")));
  assert.ok(existsSync(join(root, "scripts/import-subject-alignment.mjs")));
  assert.ok(existsSync(join(root, "scripts/refresh-pathway-data.mjs")));
});
