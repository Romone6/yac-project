import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_FILE = path.join(ROOT, "data/import-sources/scholarship-discovery.json");
const QUEUE_FILE = path.join(ROOT, "data/scholarships/nsw/discovery-queue.json");
const REPORT_FILE = path.join(ROOT, "data/scholarships/nsw/discovery-report.json");
const PUBLIC_FILE = path.join(ROOT, "data/scholarships/nsw/scholarships.json");
const WRITE = !process.argv.includes("--dry-run");
const REQUEST_TIMEOUT_MS = Number(process.env.SCHOLARSHIP_REQUEST_TIMEOUT_MS ?? 12000);

function cleanText(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#(x[\da-f]+|\d+);?/gi, (_, entity) => String.fromCodePoint(
      entity[0].toLowerCase() === "x" ? Number.parseInt(entity.slice(1), 16) : Number(entity)
    ))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(href, baseUrl) {
  try {
    return new URL(href.replace(/&amp;/g, "&"), baseUrl).toString().split("#")[0];
  } catch {
    return null;
  }
}

function anchors(html, baseUrl) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ url: absoluteUrl(match[1], baseUrl), label: cleanText(match[2]) }))
    .filter((item) => item.url && item.label);
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "PathwayToEntryDiscovery/1.0",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function isUsefulTitle(title) {
  return title.length >= 5 && !/^(view scholarship|learn more|enquire|apply|search|scholarships)$/i.test(title);
}

function directProviderLinks(html, source) {
  const sourceHost = new URL(source.url).hostname.replace(/^www\./, "");
  const byUrl = new Map();

  for (const link of anchors(html, source.url)) {
    const host = new URL(link.url).hostname.replace(/^www\./, "");
    if (host === sourceHost || !isUsefulTitle(link.label)) continue;
    if (!/scholarship|bursary|grant|award|equity|relocation|rural|regional/i.test(`${link.label} ${link.url}`)) continue;
    byUrl.set(link.url, link.label);
  }

  return [...byUrl].slice(0, source.limit).map(([candidate_provider_url, title]) => ({
    title,
    discovery_url: source.url,
    candidate_provider_url,
  }));
}

function detailLinks(html, source) {
  return anchors(html, source.url)
    .filter((link) => /\/scholarship\//.test(new URL(link.url).pathname))
    .filter((link) => !/\/enquiry$/.test(new URL(link.url).pathname))
    .filter((link) => isUsefulTitle(link.label))
    .filter((link, index, items) => items.findIndex((item) => item.url === link.url) === index)
    .slice(0, source.limit);
}

async function providerUrlFromDetail(detailUrl) {
  const html = await fetchHtml(detailUrl);
  const trackerHost = new URL(detailUrl).hostname.replace(/^www\./, "");
  const link = anchors(html, detailUrl).find((item) => {
    const host = new URL(item.url).hostname.replace(/^www\./, "");
    return host !== trackerHost && /visit website/i.test(item.label);
  });
  return link?.url ?? null;
}

async function discoverSource(source) {
  const html = await fetchHtml(source.url);
  if (source.kind === "direct-provider-links") return directProviderLinks(html, source);
  if (source.kind === "official-program") {
    return [{
      title: "UAC Equity Scholarships",
      discovery_url: source.url,
      candidate_provider_url: source.url,
    }];
  }

  const candidates = [];
  for (const detail of detailLinks(html, source)) {
    const candidate_provider_url = await providerUrlFromDetail(detail.url);
    if (candidate_provider_url) candidates.push({
      title: detail.label,
      discovery_url: detail.url,
      candidate_provider_url,
    });
  }
  return candidates;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  const publicUrls = new Set(
    JSON.parse(fs.readFileSync(PUBLIC_FILE, "utf8")).map((item) => item.source_url)
  );
  const reports = [];
  const queue = new Map();

  for (const source of manifest.sources) {
    try {
      const leads = await discoverSource(source);
      const queued = leads.filter((lead) => !publicUrls.has(lead.candidate_provider_url));
      for (const lead of queued) {
        queue.set(lead.candidate_provider_url, {
          ...lead,
          tracker: source.name,
          source_id: source.id,
          requires_official_review: true,
        });
      }
      reports.push({ source_id: source.id, discovered: leads.length, queued: queued.length, errors: [] });
    } catch (error) {
      reports.push({ source_id: source.id, discovered: 0, queued: 0, errors: [error.message] });
    }
  }

  const candidates = [...queue.values()].sort((a, b) => a.title.localeCompare(b.title));
  const report = {
    generated_at: new Date().toISOString(),
    write_mode: WRITE ? "write" : "dry-run",
    candidates: candidates.length,
    sources: reports,
  };

  if (WRITE) {
    writeJson(QUEUE_FILE, {
      generated_at: report.generated_at,
      source_policy: "Review queue only. Do not publish a candidate until its provider URL is confirmed as the official award page.",
      candidates,
    });
    writeJson(REPORT_FILE, report);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
