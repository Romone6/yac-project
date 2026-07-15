import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, "data/import-sources/scholarships.nsw.json");
const REPORT_FILE = path.join(ROOT, "data/scholarships/nsw/provider-health.json");
const REQUEST_TIMEOUT_MS = Number(process.env.SCHOLARSHIP_REQUEST_TIMEOUT_MS ?? 12000);
const WRITE = process.argv.includes("--write");

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function checkSource(provider, url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "PathwayToEntryScholarshipHealthCheck/1.0",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    const bytes = Number(response.headers.get("content-length") ?? 0);
    return { provider, url, ok: response.ok, status: response.status, bytes };
  } catch (error) {
    return { provider, url, ok: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
  const results = [];

  for (const provider of manifest.providers) {
    for (const url of provider.sources) {
      results.push(await checkSource(provider.provider, url));
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    write_mode: WRITE ? "write" : "read-only",
    checked_sources: results.length,
    healthy_sources: results.filter((item) => item.ok).length,
    sources: results,
  };

  if (WRITE) writeJson(REPORT_FILE, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
