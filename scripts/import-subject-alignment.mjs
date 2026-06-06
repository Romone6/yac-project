import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, "data/import-sources/subject-alignment.nsw.json");
const REPORT_FILE = path.join(ROOT, "data/courses/nsw/import-report.json");
const COURSE_ROOT = path.join(ROOT, "data/courses/nsw");
const REQUEST_TIMEOUT_MS = Number(process.env.PATHWAY_IMPORT_REQUEST_TIMEOUT_MS ?? 12000);

const providerOutputs = {
  acu: { file: "australian-catholic-university/courses.json", minRecords: 40 },
  wsu: { file: "western-sydney-university/courses.json", minRecords: 100 },
  csu: { file: "charles-sturt-university/courses.json", minRecords: 20 },
  macquarie: { file: "macquarie-university-expanded/courses.json", minRecords: 40 },
  une: { file: "university-of-new-england-expanded/courses.json", minRecords: 20 },
  scu: { file: "southern-cross-university/courses.json", minRecords: 100 },
  newcastle: { file: "university-of-newcastle-expanded/courses.json", minRecords: 30 },
  uow: { file: "university-of-wollongong-expanded/courses.json", minRecords: 250 },
  sydney: { file: "university-of-sydney-expanded/courses.json", minRecords: 50 },
  unsw: { file: "unsw-expanded/courses.json", minRecords: 200 },
  uts: { file: "uts-expanded/courses.json", minRecords: 70 },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function restoreBackup(outputPath, backup) {
  if (backup === null) {
    fs.rmSync(outputPath, { force: true });
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, backup);
}

function readOutputCount(outputPath) {
  if (!fs.existsSync(outputPath)) return 0;
  return readJson(outputPath).length;
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

function runProvider(provider) {
  const config = providerOutputs[provider];
  const outputPath = path.join(COURSE_ROOT, config.file);
  const backup = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
  const beforeCount = readOutputCount(outputPath);

  const result = spawnSync(
    process.execPath,
    ["src/scrapers/generate-expanded-nsw-courses.mjs", provider],
    {
      encoding: "utf8",
    }
  );

  const afterCount = readOutputCount(outputPath);
  const valid = result.status === 0 && afterCount >= config.minRecords;

  if (!valid) {
    restoreBackup(outputPath, backup);
  }

  return {
    provider,
    output: config.file,
    status: result.status,
    before_count: beforeCount,
    after_count: afterCount,
    final_count: readOutputCount(outputPath),
    min_records: config.minRecords,
    restored: !valid,
    stdout: result.stdout?.slice(-2000) ?? "",
    stderr: result.stderr?.slice(-2000) ?? "",
  };
}

const manifest = readJson(SOURCE_FILE);
const statuses = [];

for (const url of manifest.sources) {
  statuses.push(await fetchStatus(url));
}

const requestedProviders = process.env.PATHWAY_SUBJECT_PROVIDERS
  ? process.env.PATHWAY_SUBJECT_PROVIDERS.split(",").map((item) => item.trim()).filter(Boolean)
  : Object.keys(providerOutputs);
const unknownProviders = requestedProviders.filter(
  (provider) => !providerOutputs[provider]
);

if (unknownProviders.length > 0) {
  console.error(`Unknown subject provider(s): ${unknownProviders.join(", ")}`);
  console.error(`Known providers: ${Object.keys(providerOutputs).join(", ")}`);
  process.exit(1);
}

const providerRuns = requestedProviders.map(runProvider);
const sydneyCoursesFile = path.join(ROOT, "data/courses/nsw/university-of-sydney/courses.json");
const sydneyCourses = fs.existsSync(sydneyCoursesFile)
  ? readJson(sydneyCoursesFile)
  : [];
const sydneyUndergraduate = sydneyCourses.filter(
  (course) =>
    course.level === manifest.target_level &&
    !/^Sydney Professional Certificate\b/i.test(course.courseName)
);
const sydneyExpandedFile = path.join(
  ROOT,
  "data/courses/nsw/university-of-sydney-expanded/courses.json"
);
const sydneyExpanded = fs.existsSync(sydneyExpandedFile)
  ? readJson(sydneyExpandedFile)
  : [];

writeJson(REPORT_FILE, {
  generated_at: new Date().toISOString(),
  output: manifest.output,
  target_level: manifest.target_level,
  requested_providers: requestedProviders,
  sources_checked: statuses.length,
  sources_ok: statuses.filter((item) => item.ok).length,
  provider_runs: providerRuns,
  providers_restored: providerRuns.filter((run) => run.restored).map((run) => run.provider),
  sydney_undergraduate_records: sydneyUndergraduate.length,
  sydney_professional_certificates_visible: sydneyExpanded.filter((course) =>
    /^Sydney Professional Certificate\b/i.test(course.courseName)
  ).length,
  statuses,
});

const hardFailures = providerRuns.filter(
  (run) => run.restored && run.provider === "sydney"
);

if (hardFailures.length > 0) {
  process.exit(1);
}
