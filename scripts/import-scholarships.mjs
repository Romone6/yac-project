import fs from "node:fs";
import path from "node:path";
import { fallbackRecordsForProvider } from "../src/lib/scholarship-refresh.mjs";

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, "data/import-sources/scholarships.nsw.json");
const CURATED_FILE = path.join(ROOT, "data/scholarships/nsw/curated-scholarships.json");
const OUTPUT_FILE = path.join(ROOT, "data/scholarships/nsw/scholarships.json");
const REPORT_FILE = path.join(ROOT, "data/scholarships/nsw/import-report.json");
const TODAY = new Date().toISOString().slice(0, 10);
const MAX_PAGES_PER_PROVIDER = Number(process.env.SCHOLARSHIP_MAX_PAGES_PER_PROVIDER ?? 25);
const REQUEST_TIMEOUT_MS = Number(process.env.SCHOLARSHIP_REQUEST_TIMEOUT_MS ?? 12000);
const WRITE = !process.argv.includes("--dry-run");

const KEYWORDS = [
  "scholarship",
  "scholarships",
  "bursary",
  "bursaries",
  "grant",
  "grants",
  "equity",
  "financial assistance",
  "accommodation",
  "relocation",
  "indigenous",
  "aboriginal",
  "torres strait",
  "regional",
  "rural",
  "hardship",
];

const SKIP_HREF = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".zip",
  "mailto:",
  "tel:",
  "facebook.com",
  "linkedin.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "youtube.com",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function decodeHtml(input = "") {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(input = "") {
  return decodeHtml(input)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseWhitespace(input = "") {
  return decodeHtml(input).replace(/\s+/g, " ").trim();
}

function absoluteUrl(href, base) {
  try {
    return new URL(decodeHtml(href), base).toString().split("#")[0];
  } catch {
    return null;
  }
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "PathwayToEntryScholarshipImporter/1.0 (+https://pathwaytoentry.org.au)",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function isScholarshipish(text) {
  const haystack = text.toLowerCase();
  return KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function isRecordCandidate(title, url) {
  const haystack = `${title} ${url}`.toLowerCase();

  if (
    /(?:^scholarships$|^university scholarships$|^search$|^about us$|contact|faq|frequently asked|recipient|tips when submitting|how to apply|how to complete|how to submit|how to use|how to fund|accept or defer|applying for|find a scholarship|scholarship search|scholarships search|search for scholarships|scholarships guide|fees and scholarships|domestic student fees|international student fees|international student scholarships|domestic student scholarships|external scholarships|australia awards|us financial aid|sponsorships|prizes and awards|scholarships at|scholarships information|scholarships and important dates|scholarships & financial support|nursing and midwifery scholarships and financial assistance|merit-based scholarships|categories and supporting documents|offers$|universities offering|financial assistance for university|removing barriers|scheme works|schools recommendation scheme|educational access scheme|elite athlete and performer scheme|student life and support|services and support|equity and inclusion|first peoples directorate|regional health|aboriginal health|we are here for you|support contact list|rental advisory|canberra accommodation|student accommodation$|community-engaged research|scholarship-supported research projects|financing your studies|funding and grant opportunities|information for current|accommodation$)/i.test(
      title
    )
  ) {
    return false;
  }

  return /scholarship|scholarships|bursary|bursaries|grant|grants|cadetship|cadetships|tertiary-access-payment|relocation-scholarship|student-support-program|cef-extra|apply-for-a-grant|equity-scholarships|financial-assistance/.test(
    haystack
  );
}

function isSkippedUrl(url) {
  const lower = url.toLowerCase();
  return SKIP_HREF.some((skip) => lower.includes(skip));
}

function discoverLinks(html, baseUrl) {
  const links = [];
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorPattern.exec(html))) {
    const url = absoluteUrl(match[1], baseUrl);
    if (!url || isSkippedUrl(url)) continue;

    const label = stripTags(match[2]);
    const combined = `${label} ${url}`;
    if (!isScholarshipish(combined)) continue;

    links.push({ url, label: label || url });
  }

  return links;
}

function extractTitle(html, fallback) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return normaliseWhitespace(stripTags(h1[1]));

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (title) {
    return normaliseWhitespace(stripTags(title[1]).replace(/\s*[|–-]\s*.+$/, ""));
  }

  return fallback;
}

function extractDescription(html, text) {
  const meta = html.match(/<meta\b[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (meta) return normaliseWhitespace(meta[1]).slice(0, 500);

  const paragraph = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraph) return normaliseWhitespace(stripTags(paragraph[1])).slice(0, 500);

  return text.slice(0, 320);
}

function extractValue(text) {
  const values = [];
  const moneyPattern = /\$\s?([0-9][0-9,]*(?:\.\d{1,2})?)\s?(k)?/gi;
  let match;

  while ((match = moneyPattern.exec(text))) {
    let amount = Number(match[1].replace(/,/g, ""));
    if (match[2]?.toLowerCase() === "k") amount *= 1000;
    if (Number.isFinite(amount)) values.push(amount);
  }

  if (values.length === 0) {
    if (/var(?:y|ies|ious)|depend/i.test(text)) {
      return { value_text: "Value varies; check official source.", value_amount: null };
    }
    return { value_text: "Check official source for current value.", value_amount: null };
  }

  const max = Math.max(...values);
  const firstMoney = text.match(/\$\s?[0-9][0-9,]*(?:\.\d{1,2})?(?:\s?k)?(?:\s?(?:per|for|over|up to)[^.]{0,80})?/i)?.[0];
  return {
    value_text: normaliseWhitespace(firstMoney ?? `Up to $${max.toLocaleString("en-AU")}.`),
    value_amount: max,
  };
}

function monthNumber(month) {
  return {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  }[month.toLowerCase()];
}

function toIsoDate(day, month, year) {
  const mm = monthNumber(month);
  if (!mm || !year) return null;
  return `${year}-${mm}-${String(day).padStart(2, "0")}`;
}

function extractCloseDate(text) {
  const closeContext = text.match(/(?:close|closes|closing date|applications close|closing)\D{0,60}([0-3]?\d)\s+([A-Za-z]+)\s+(20\d{2})/i);
  if (closeContext) return toIsoDate(closeContext[1], closeContext[2], closeContext[3]);

  const anyDate = text.match(/([0-3]?\d)\s+([A-Za-z]+)\s+(20\d{2})/i);
  if (anyDate && /close|closing|deadline|apply by/i.test(text.slice(Math.max(0, anyDate.index - 120), anyDate.index + 120))) {
    return toIsoDate(anyDate[1], anyDate[2], anyDate[3]);
  }

  return null;
}

function statusFromCloseDate(closeDate) {
  if (!closeDate) return "check_source";

  const now = new Date(`${TODAY}T12:00:00+10:00`);
  const close = new Date(`${closeDate}T23:59:59+10:00`);
  const diffDays = (close.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

  if (diffDays < 0) return "closed";
  if (diffDays <= 21) return "closing_soon";
  return "open";
}

function inferTags(text, title) {
  const haystack = `${title} ${text}`.toLowerCase();
  const tags = new Set();
  if (/regional|rural|remote|country|distance|relocat|living away|travel/.test(haystack)) tags.add("regional-rural");
  if (/equity|financial|low socio|low-ses|hardship|centrelink|disadvantage|means test|income/.test(haystack)) tags.add("low-income-equity");
  if (/first in family|first generation/.test(haystack)) tags.add("first-in-family");
  if (/aboriginal|torres strait|indigenous|first nations/.test(haystack)) tags.add("aboriginal-torres-strait-islander");
  if (/disability|medical|accessibility|carer|illness|condition/.test(haystack)) tags.add("disability-accessibility");
  if (/leadership|community|volunteer|service|citizenship/.test(haystack)) tags.add("leadership-community");
  if (/academic|merit|atar|high achie|excellence|distinction/.test(haystack)) tags.add("academic-merit");
  if (/relocat|travel|placement|moving/.test(haystack)) tags.add("relocation");
  if (/accommodation|residential|college|residence|housing/.test(haystack)) tags.add("accommodation");
  if (tags.size === 0) tags.add("low-income-equity");
  return [...tags];
}

function inferStudyLevels(text, title) {
  const haystack = `${title} ${text}`.toLowerCase();
  const levels = new Set();
  if (/undergraduate|bachelor|commencing student|school leaver|year 12/.test(haystack)) levels.add("undergraduate");
  if (/postgraduate|master|graduate certificate|graduate diploma/.test(haystack)) levels.add("postgraduate");
  if (/research|phd|doctor of philosophy|mres|mphil/.test(haystack)) levels.add("research");
  if (/tafe|vocational|apprentice|trainee|certificate|diploma/.test(haystack)) levels.add("tafe");
  if (/training|apprenticeship|traineeship/.test(haystack)) levels.add("training");
  if (levels.size === 0) levels.add("undergraduate");
  return [...levels];
}

function inferFields(text, title) {
  const haystack = `${title} ${text}`.toLowerCase();
  const fields = new Set();
  if (/nursing|midwifery/.test(haystack)) fields.add("nursing");
  if (/health|medical|medicine|clinical|allied health|placement/.test(haystack)) fields.add("health");
  if (/engineer|built environment|construction|stem|technology|computing|cyber/.test(haystack)) fields.add("engineering");
  if (/law|legal/.test(haystack)) fields.add("law");
  if (/social work|community services/.test(haystack)) fields.add("social-work");
  if (/science|agriculture|rural science|animal/.test(haystack)) fields.add("science");
  if (/business|commerce|management|tourism|hospitality/.test(haystack)) fields.add("business");
  if (fields.size === 0) fields.add("all-fields");
  return [...fields];
}

function inferRequiredDocuments(text) {
  const lower = text.toLowerCase();
  const docs = new Set();
  if (/uac/.test(lower)) docs.add("UAC scholarship or equity application where required");
  if (/centrelink|income|financial|hardship|low socio|low-ses/.test(lower)) docs.add("Financial hardship or income evidence");
  if (/aboriginal|torres strait|indigenous|first nations/.test(lower)) docs.add("Indigenous identity evidence where requested");
  if (/regional|rural|remote|relocat|accommodation/.test(lower)) docs.add("Address, relocation or accommodation evidence where requested");
  if (/academic|merit|atar|transcript/.test(lower)) docs.add("Academic achievement evidence");
  if (docs.size === 0) docs.add("Official provider application requirements");
  return [...docs];
}

function inferValueType(text, title) {
  const haystack = `${title} ${text}`.toLowerCase();
  if (/accommodation|residential|housing/.test(haystack)) return "Accommodation scholarship";
  if (/relocat|travel|placement/.test(haystack)) return "Relocation or placement support";
  if (/indigenous|aboriginal|torres strait|first nations/.test(haystack)) return "First Nations scholarship";
  if (/equity|financial|hardship|disadvantage/.test(haystack)) return "Equity scholarship";
  if (/academic|merit|excellence/.test(haystack)) return "Merit scholarship";
  if (/grant|bursary/.test(haystack)) return "Grant or bursary";
  return "Scholarship";
}

function makeRecord(provider, page) {
  const text = stripTags(page.html);
  const title = extractTitle(page.html, page.label);
  if (!title || title.length < 5 || !isScholarshipish(`${title} ${text}`)) return null;
  if (!isRecordCandidate(title, page.url)) return null;

  const description = extractDescription(page.html, text);
  const { value_text, value_amount } = extractValue(text);
  const closes_at = extractCloseDate(text);
  const slug = slugify(`${provider.slug}-${title}`);

  return {
    id: slug,
    slug,
    scholarship_name: title.replace(/\s*-\s*Scholarships?\s*$/i, "").trim(),
    provider: provider.provider,
    institution: provider.institution,
    description:
      description.length >= 80
        ? description
        : `${title} is listed by ${provider.provider}. Check the official source for current eligibility, value and application conditions.`,
    value_text,
    value_amount,
    value_type: inferValueType(text, title),
    opens_at: null,
    closes_at,
    status: statusFromCloseDate(closes_at),
    eligibility_summary: `Source-backed listing from ${provider.provider}. Check the official source for current eligibility and round-specific rules.`,
    eligibility_tags: inferTags(text, title),
    study_level: inferStudyLevels(text, title),
    location_eligibility: inferTags(text, title).includes("regional-rural")
      ? ["NSW", "regional-or-remote-australia"]
      : ["NSW", "Australia"],
    field_of_study: inferFields(text, title),
    required_documents: inferRequiredDocuments(text),
    application_method: `Use the official ${provider.provider} source page for the current application method.`,
    source_url: page.url,
    source_name: title,
    last_verified_at: TODAY,
    confidence_status: "source-check-required",
    notes: "Generated by the provider import workflow. Record should be reviewed before being promoted to curated verified status.",
    import_source: "provider-discovery",
  };
}

function mergeRecords(curated, generated) {
  const bySource = new Map();
  const output = [];

  for (const item of curated) {
    const clean = { ...item, import_source: item.import_source ?? "curated" };
    output.push(clean);
    bySource.set(clean.source_url, clean);
  }

  for (const item of generated) {
    if (!item) continue;
    if (bySource.has(item.source_url)) continue;
    if (output.some((existing) => existing.slug === item.slug)) continue;
    output.push(item);
    bySource.set(item.source_url, item);
  }

  return output.sort((a, b) => {
    const institution = a.institution.localeCompare(b.institution);
    if (institution !== 0) return institution;
    return a.scholarship_name.localeCompare(b.scholarship_name);
  });
}

async function discoverProvider(provider) {
  const report = {
    provider: provider.provider,
    sources: provider.sources.length,
    fetched_sources: 0,
    discovered_links: 0,
    fetched_candidate_pages: 0,
    generated_records: 0,
    fallback_records: 0,
    errors: [],
  };
  const candidates = new Map();

  for (const sourceUrl of provider.sources) {
    try {
      const html = await fetchHtml(sourceUrl);
      report.fetched_sources += 1;
      candidates.set(sourceUrl, { url: sourceUrl, label: provider.provider });

      for (const link of discoverLinks(html, sourceUrl)) {
        const sourceHost = new URL(sourceUrl).hostname.replace(/^www\./, "");
        const linkHost = new URL(link.url).hostname.replace(/^www\./, "");
        if (sourceHost !== linkHost && !linkHost.endsWith(sourceHost)) continue;
        candidates.set(link.url, link);
      }
    } catch (error) {
      report.errors.push({ url: sourceUrl, message: error.message });
    }
  }

  const limited = [...candidates.values()].slice(0, MAX_PAGES_PER_PROVIDER);
  report.discovered_links = limited.length;

  const records = [];
  for (const candidate of limited) {
    try {
      console.log(`  candidate ${report.fetched_candidate_pages + 1}/${limited.length}: ${candidate.url}`);
      const html = await fetchHtml(candidate.url);
      report.fetched_candidate_pages += 1;
      const record = makeRecord(provider, { ...candidate, html });
      if (record) {
        records.push(record);
        report.generated_records += 1;
      }
    } catch (error) {
      report.errors.push({ url: candidate.url, message: error.message });
    }
  }

  return { records, report };
}

async function main() {
  const sources = readJson(SOURCE_FILE);
  const curated = readJson(CURATED_FILE);
  const previousPublished = fs.existsSync(OUTPUT_FILE) ? readJson(OUTPUT_FILE) : [];
  const allGenerated = [];
  const allFallback = [];
  const providerReports = [];

  for (const provider of sources.providers) {
    console.log(`scraping ${provider.provider}`);
    const { records, report } = await discoverProvider(provider);
    allGenerated.push(...records);
    const fallback = fallbackRecordsForProvider(
      previousPublished,
      provider.provider,
      report.generated_records
    );
    report.fallback_records = fallback.length;
    allFallback.push(...fallback);
    providerReports.push(report);
  }

  const merged = mergeRecords(curated, [...allFallback, ...allGenerated]);
  const report = {
    generated_at: new Date().toISOString(),
    write_mode: WRITE ? "write" : "dry-run",
    curated_records: curated.length,
    discovered_records: allGenerated.length,
    fallback_records: allFallback.length,
    output_records: merged.length,
    providers: providerReports,
  };

  if (WRITE) {
    writeJson(
      OUTPUT_FILE,
      merged.map((item) => {
        const record = { ...item };
        delete record.import_source;
        return record;
      })
    );
    writeJson(REPORT_FILE, report);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
