import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, "data/import-sources/subject-alignment.nsw.json");
const REPORT_FILE = path.join(ROOT, "data/courses/nsw/import-report.json");
const REQUEST_TIMEOUT_MS = Number(process.env.PATHWAY_IMPORT_REQUEST_TIMEOUT_MS ?? 12000);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function fetchStatus(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "PathwayToEntrySubjectImporter/1.0 (+https://pathwaytoentry.org.au)",
        accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    return {
      url,
      ok: response.ok,
      status: response.status,
      bytes: (await response.text()).length,
    };
  } catch (error) {
    return { url, ok: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

const manifest = readJson(SOURCE_FILE);
const statuses = [];

for (const url of manifest.sources) {
  statuses.push(await fetchStatus(url));
}

writeJson(REPORT_FILE, {
  generated_at: new Date().toISOString(),
  output: manifest.output,
  sources_checked: statuses.length,
  sources_ok: statuses.filter((item) => item.ok).length,
  statuses,
});

const result = spawnSync("node", ["src/scrapers/generate-expanded-nsw-courses.mjs"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
