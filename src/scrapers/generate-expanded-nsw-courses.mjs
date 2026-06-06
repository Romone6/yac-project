import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, "data/courses/nsw");
const LAST_UPDATED = new Date().toISOString();
const SUBJECT_PATTERNS = [
  { pattern: /\bmathematics extension 2\b/i, subject: "Mathematics Extension 2" },
  { pattern: /\bmathematics extension 1\b/i, subject: "Mathematics Extension 1" },
  { pattern: /\bmathematics advanced\b/i, subject: "Mathematics Advanced" },
  { pattern: /\bmathematics standard 2\b/i, subject: "Mathematics Standard 2" },
  { pattern: /\benglish advanced\b/i, subject: "English Advanced" },
  { pattern: /\benglish standard\b/i, subject: "English Standard" },
  { pattern: /\b(two units of english|2 units of english)\b/i, subject: "English Standard" },
  { pattern: /\bphysics\b/i, subject: "Physics" },
  { pattern: /\bchemistry\b/i, subject: "Chemistry" },
  { pattern: /\bbiology\b/i, subject: "Biology" },
  { pattern: /\blegal studies\b/i, subject: "Legal Studies" },
  { pattern: /\bbusiness studies\b/i, subject: "Business Studies" },
  { pattern: /\beconomics\b/i, subject: "Economics" },
  { pattern: /\bdesign and technology\b/i, subject: "Design and Technology" },
  { pattern: /\bengineering studies\b/i, subject: "Engineering Studies" },
  { pattern: /\bpdhpe\b/i, subject: "PDHPE" },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(relDir, records) {
  const dir = path.join(DATA_ROOT, relDir);
  ensureDir(dir);
  const file = path.join(dir, "courses.json");
  fs.writeFileSync(file, `${JSON.stringify(records, null, 2)}\n`);
  console.log(`wrote ${records.length} -> ${path.relative(ROOT, file)}`);
}

function stripTags(input = "") {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function titleCaseFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (["of", "and", "in", "for", "to", "by", "with", "on"].includes(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\bPhd\b/g, "PhD")
    .replace(/\bMba\b/g, "MBA")
    .replace(/\bMd\b/g, "MD");
}

function levelFromText(name = "", hint = "") {
  const text = `${name} ${hint}`.toLowerCase();

  if (/(professional certificate|\/pc\/)/.test(text)) {
    return "postgraduate";
  }

  if (/(foundation|pathway|entry|preparation|enabling)/.test(text)) {
    return "pathway";
  }

  if (/(associate degree|diploma)/.test(text)) {
    return "diploma";
  }

  if (
    /(graduate certificate|graduate diploma|master|doctor|juris|phd|doctorate|postgraduate|executive master)/.test(
      text
    )
  ) {
    return "postgraduate";
  }

  return "undergraduate";
}

function createId(slug, source) {
  return `${slug}-${source}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferFaculty(name = "", hint = "") {
  const text = `${name} ${hint}`.toLowerCase();

  if (/(law|legal|criminology|justice|policing|human rights|migration)/.test(text)) {
    return "Law, Justice and Criminology";
  }

  if (
    /(business|account|finance|econom|marketing|management|commerce|hotel|tourism|project management|hr|human resource|tax)/.test(
      text
    )
  ) {
    return "Business";
  }

  if (
    /(engineer|comput|data science|information technology|cyber|software|math|statistics|physics|construction|architecture|design|property|surveying|built environment|aviation|geospatial)/.test(
      text
    )
  ) {
    return "Engineering, Design and Technology";
  }

  if (
    /(medicine|medical|biomed|health|nursing|midwif|paramedic|physio|occupational therapy|speech pathology|nutrition|diet|pharmacy|psychology|mental health|public health|clinical|exercise|sport|osteopath|podiatry|dental|oral health|vet|laboratory)/.test(
      text
    )
  ) {
    return "Health and Science";
  }

  if (/(teaching|education|early childhood)/.test(text)) {
    return "Education";
  }

  if (
    /(arts|humanities|social work|social science|communication|languages|music|theology|philosophy|creative|writing|youth work|community|indigenous|liberal arts)/.test(
      text
    )
  ) {
    return "Arts, Humanities and Social Sciences";
  }

  if (/(agricultur|environment|science|wine|horticulture|animal|equine|fish|conservation)/.test(text)) {
    return "Science, Agriculture and Environment";
  }

  return "General Studies";
}

function baseRecord({
  university,
  universitySlug,
  faculty,
  courseName,
  courseCode,
  level,
  description,
  duration,
  atar,
  officialUrl,
  prerequisites = [],
  assumedKnowledge = [],
  recommendedSubjects = [],
  secondarySubjects = [],
  careerOutcomes = [],
}) {
  return {
    id: createId(universitySlug, courseCode || officialUrl || courseName),
    university,
    universitySlug,
    state: "NSW",
    faculty: faculty || inferFaculty(courseName, description),
    courseName,
    ...(courseCode ? { courseCode } : {}),
    level,
    description: stripTags(description),
    ...(duration ? { duration: stripTags(duration) } : {}),
    atar: typeof atar === "number" ? atar : null,
    prerequisites,
    assumedKnowledge,
    recommendedSubjects,
    secondarySubjects,
    careerOutcomes,
    officialUrl,
    lastUpdated: LAST_UPDATED,
  };
}

async function fetchText(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  return response.text();
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  return response.json();
}

async function fetchTextWithRetries(url, options, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchText(url, options);
    } catch (error) {
      lastError = error;

      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }

  throw lastError;
}

async function runPool(items, limit, task) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = items[index++];
      results.push(await task(current));
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function generateAcu() {
  const payload = await fetchJson("https://www.acu.edu.au/webapi/GetCourseResult/get");
  const seen = new Set();
  const records = [];

  for (const item of payload.CoursesResults || []) {
    const courseName = stripTags(item.CourseName || item.PageTitle || "");
    if (!courseName || /microcredential/i.test(courseName)) {
      continue;
    }

    const level = levelFromText(courseName, item.Level || item.LevelDomesticInternational || "");
    const officialUrl = item.URL.startsWith("http")
      ? item.URL
      : `https://www.acu.edu.au${item.URL}`;

    if (seen.has(officialUrl)) {
      continue;
    }

    seen.add(officialUrl);

    const scores = (item.locations || [])
      .map((location) => Number.parseFloat(String(location.Score).replace(/[^0-9.]/g, "")))
      .filter((value) => Number.isFinite(value));

    records.push(
      baseRecord({
        university: "Australian Catholic University",
        universitySlug: "australian-catholic-university",
        faculty: item.StudyArea || inferFaculty(courseName, item.CourseDescription),
        courseName,
        level,
        description: item.CourseDescription || courseName,
        duration: item.Duration,
        atar: scores.length ? Math.max(...scores) : null,
        officialUrl,
      })
    );
  }

  writeJson(
    "australian-catholic-university",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateWsu() {
  const payload = await fetchJson("https://NY25AYQTZ8-dsn.algolia.net/1/indexes/*/queries", {
    method: "POST",
    headers: {
      "X-Algolia-API-Key": "ab0ec615d7392bf357ecbff7822f8eb3",
      "X-Algolia-Application-Id": "NY25AYQTZ8",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{ indexName: "wsu_prod_courses", params: "query=&hitsPerPage=400&page=0" }],
    }),
  });

  const hits = payload.results?.[0]?.hits ?? [];
  const seen = new Set();
  const records = [];

  for (const hit of hits) {
    const courseName = stripTags(hit.title || "");
    if (!courseName) {
      continue;
    }

    const officialUrl = hit.coursePageUrl || hit.url;
    if (!officialUrl || seen.has(officialUrl)) {
      continue;
    }

    seen.add(officialUrl);

    const tags = Array.isArray(hit.tags) ? hit.tags : [];
    const levelTag = tags.find((tag) => tag.startsWith("course-level:")) || "";
    const facultyTag =
      tags.find((tag) => tag.startsWith("aos:")) ||
      tags.find((tag) => tag.startsWith("school:")) ||
      "";

    records.push(
      baseRecord({
        university: "Western Sydney University",
        universitySlug: "western-sydney-university",
        faculty:
          facultyTag.split(":").slice(1).join(":").replace(/-/g, " ") ||
          inferFaculty(courseName, hit.description || hit.summary),
        courseName,
        courseCode: hit.programCode || undefined,
        level: levelFromText(courseName, levelTag),
        description: hit.description || hit.summary || hit.metaDescription || courseName,
        duration: hit.duration,
        atar: null,
        officialUrl,
      })
    );
  }

  writeJson(
    "western-sydney-university",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateCsu() {
  const sitemap = await fetchText("https://study.csu.edu.au/sitemap.xml");
  const urls = Array.from(
    new Set(
      Array.from(
        sitemap.matchAll(/<loc>(https:\/\/study\.csu\.edu\.au\/courses\/[a-z0-9\-]+)<\/loc>/g)
      ).map((match) => match[1])
    )
  );

  const pages = await runPool(urls, 10, async (url) => {
    const html = await fetchText(url);
    const courseName =
      html
        .match(/<title>([^<]+)<\/title>/i)?.[1]
        ?.replace(/ - Study$/, "")
        .trim() || titleCaseFromSlug(url.split("/").pop() || "");
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || courseName;

    return baseRecord({
      university: "Charles Sturt University",
      universitySlug: "charles-sturt-university",
      faculty: "",
      courseName,
      level: levelFromText(courseName, url),
      description,
      duration: "",
      atar: null,
      officialUrl: url,
    });
  });

  writeJson(
    "charles-sturt-university",
    pages.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateScu() {
  const html = await fetchText("https://www.scu.edu.au/study/courses/");
  const candidates = Array.from(
    html.matchAll(
      /<a href="(https:\/\/www\.scu\.edu\.au\/study\/courses\/[^"]+\/202(6|7)\/)"[^>]*>([^<]+)<\/a>/g
    )
  ).map((match) => ({
    url: match[1],
    year: match[2],
    title: stripTags(match[3]),
  }));

  const deduped = new Map();

  for (const item of candidates) {
    const baseUrl = item.url.replace(/\/202[67]\/$/, "/");
    const existing = deduped.get(baseUrl);

    if (!existing || item.year === "2027") {
      deduped.set(baseUrl, { ...item, url: baseUrl });
    }
  }

  const pages = await runPool(Array.from(deduped.values()), 10, async ({ url, title }) => {
    const pageHtml = await fetchText(`${url}2027/`).catch(() => fetchText(`${url}2026/`));
    const courseName =
      pageHtml
        .match(/<title>([^<]+)<\/title>/i)?.[1]
        ?.replace(/ - 202[67] - SCU$/, "")
        .trim() ||
      title ||
      titleCaseFromSlug(url.split("/").slice(-2, -1)[0]);
    const description = pageHtml.match(/<meta name="description" content="([^"]*)"/i)?.[1] || courseName;

    return baseRecord({
      university: "Southern Cross University",
      universitySlug: "southern-cross-university",
      faculty: "",
      courseName,
      level: levelFromText(courseName, url),
      description,
      duration: "",
      atar: null,
      officialUrl: `${url}2027/`,
    });
  });

  writeJson(
    "southern-cross-university",
    pages.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

function extractMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    html.match(new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ||
    html.match(new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ||
    ""
  );
}

function extractJsonFromAssignment(html, marker) {
  const start = html.indexOf(marker);
  if (start === -1) {
    return null;
  }

  const jsonStart = html.indexOf("{", start);
  if (jsonStart === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = jsonStart; index < html.length; index += 1) {
    const char = html[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        const json = html.slice(jsonStart, index + 1);
        try {
          return JSON.parse(json);
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

function parseFirstNumber(values = []) {
  const numeric = values
    .map((value) => Number.parseFloat(String(value).replace(/[^0-9.]/g, "")))
    .filter((value) => Number.isFinite(value));

  return numeric.length > 0 ? numeric[0] : null;
}

function extractNextData(html) {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function extractSelectionRankFromHtml(html = "") {
  const matches = [
    ...html.matchAll(/Lowest Selection Rank[^0-9]{0,120}([0-9]{2}(?:\.[0-9]{1,2})?)/gi),
    ...html.matchAll(/Selection Rank[^0-9]{0,120}([0-9]{2}(?:\.[0-9]{1,2})?)/gi),
  ];

  for (const match of matches) {
    const value = Number.parseFloat(match[1]);

    if (Number.isFinite(value) && value >= 30 && value <= 99.95) {
      return value;
    }
  }

  return null;
}

function stripMarkdown(input = "") {
  return input
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[#>*_`-]+\s*/gm, "")
    .replace(/[_*`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSignals(input = "") {
  return stripTags(input)
    .split(/(?:;|,|\band\b|\bor\b|\n)/i)
    .map((value) => value.trim())
    .filter(Boolean);
}

function extractSubjectsFromText(text = "") {
  return uniq(
    SUBJECT_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
      ({ subject }) => subject
    )
  );
}

function parseSubjectGuidanceText(text = "") {
  const normalized = stripTags(text).replace(/\s+/g, " ").trim();
  if (!normalized) {
    return {
      assumedKnowledge: [],
      recommendedSubjects: [],
    };
  }

  const segments = normalized
    .replace(/;/g, ". ")
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const assumedKnowledge = [];
  const recommendedSubjects = [];

  for (const segment of segments) {
    const subjects = extractSubjectsFromText(segment);
    if (subjects.length === 0) {
      continue;
    }

    if (/recommended/i.test(segment)) {
      recommendedSubjects.push(...subjects);
    } else {
      assumedKnowledge.push(...subjects);
    }
  }

  if (/\bmathematics\b/i.test(normalized)) {
    assumedKnowledge.push("Mathematics Advanced");
  }

  if (/\benglish\b/i.test(normalized)) {
    assumedKnowledge.push("English Standard");
  }

  return {
    assumedKnowledge: uniq(assumedKnowledge),
    recommendedSubjects: uniq(recommendedSubjects),
  };
}

function extractUnswAssumedKnowledgeText(html = "") {
  const marker = html.indexOf("Assumed knowledge");
  if (marker === -1) {
    return "";
  }

  const slice = html.slice(marker, marker + 2500);
  const paragraphs = Array.from(slice.matchAll(/<p>([\s\S]*?)<\/p>/gi)).map((match) => match[1]);
  return paragraphs.slice(0, 3).join(" ");
}

function extractUtsAssumedKnowledgeText(html = "") {
  const explicitMatch = html.match(
    /Admissions information_Assumed knowledge[\s\S]{0,2200}?<div class="wysiwyg-user-content-output">([\s\S]{0,3500}?)<\/div>/i
  );

  if (explicitMatch?.[1]) {
    return explicitMatch[1];
  }

  const marker = html.search(/Admissions information_Assumed knowledge|Assumed knowledge/i);
  if (marker === -1) {
    return "";
  }

  const slice = html.slice(marker, marker + 7000);
  const matches = Array.from(
    slice.matchAll(/<div class="wysiwyg-user-content-output">([\s\S]{0,3500}?)<\/div>/gi)
  ).map((match) => match[1]);

  return matches.slice(0, 2).join(" ");
}

function parseNewcastleIndex(markdown) {
  const entries = new Map();

  for (const match of markdown.matchAll(
    /\[([^\]]+)\]\((https:\/\/www\.newcastle\.edu\.au\/degrees\/[^)]+)\)([^[]*?)\[Save\]\(https:\/\/www\.newcastle\.edu\.au\/degrees#compare-(\d+)\)/g
  )) {
    const [, title, url, meta, code] = match;
    const cleanedMeta = stripMarkdown(meta);
    const duration =
      cleanedMeta.match(/(?:New\s+)?(\d+(?:\.\d+)?\s+year(?:s)?)/i)?.[1] || "";
    const selectionRank = parseFirstNumber([cleanedMeta.match(/(\d+(?:\.\d+)?)\s+SR/i)?.[1] || ""]);

    entries.set(code, {
      title: stripMarkdown(title),
      url,
      duration,
      selectionRank,
    });
  }

  return entries;
}

function formatNewcastleDuration(content, fallbackDuration = "") {
  if (fallbackDuration) {
    return fallbackDuration;
  }

  const fullTime = content.duration_ft_std || content.duration_ft_max || "";
  const partTime = content.duration_pt_std || content.duration_pt_max || "";

  if (fullTime && partTime) {
    return `${fullTime} years full time, up to ${partTime} years part time`;
  }

  if (fullTime) {
    return `${fullTime} years`;
  }

  if (partTime) {
    return `up to ${partTime} years part time`;
  }

  return "";
}

async function generateMacquarie() {
  const sitemapIndex = await fetchText("https://coursehandbook.mq.edu.au/sitemap.xml");
  const sitemapUrls = Array.from(
    new Set(Array.from(sitemapIndex.matchAll(/<loc>(https:\/\/coursehandbook\.mq\.edu\.au\/sitemap\/[^<]+)<\/loc>/g)).map((match) => match[1]))
  );

  const sitemapPages = await runPool(sitemapUrls, 5, async (url) => fetchText(url));
  const courseUrls = Array.from(
    new Set(
      sitemapPages.flatMap((xml) =>
        Array.from(
          xml.matchAll(/<loc>(https:\/\/coursehandbook\.mq\.edu\.au\/2026\/courses\/[^<]+)<\/loc>/g)
        ).map((match) => match[1])
      )
    )
  );

  const records = (
    await runPool(courseUrls, 3, async (url) => {
      try {
        const html = await fetchTextWithRetries(url, undefined, 4);
        const nextData = extractNextData(html);
        const content = nextData?.props?.pageProps?.pageContent;

        if (!content?.title) {
          return null;
        }

        const overview =
          content.overview_and_aims_of_the_course ||
          content.description ||
          content.summary ||
          content.search_title ||
          content.title;
        const faculty =
          content.school?.value ||
          content.academic_org?.value ||
          content.faculty?.value ||
          "";
        const duration = content.course_duration_in_years?.label || content.duration?.label || "";
        const atar = parseFirstNumber([content.atar]);
        const courseCode = content.code || content.course_code || undefined;
        const careerOutcomes = splitSignals(content.graduate_destinations_and_employability || "");
        const prerequisites = splitSignals(content.year_12_prerequisites || "");
        const assumedKnowledge = splitSignals(content.assumed_knowledge || "");

        return baseRecord({
          university: "Macquarie University",
          universitySlug: "macquarie-university",
          faculty,
          courseName: stripTags(content.title),
          courseCode,
          level: levelFromText(content.title, `${content.type?.label || ""} ${content.contentTypeLabel || ""}`),
          description: overview,
          duration,
          atar,
          officialUrl: url,
          prerequisites,
          assumedKnowledge,
          careerOutcomes,
        });
      } catch {
        return null;
      }
    })
  ).filter(Boolean);

  writeJson(
    "macquarie-university-expanded",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateUne() {
  const sitemapIndex = await fetchText("https://handbook.une.edu.au/sitemap.xml");
  const sitemapUrls = Array.from(
    new Set(
      Array.from(
        sitemapIndex.matchAll(/<loc>(https:\/\/handbook\.une\.edu\.au\/sitemap\/[^<]+)<\/loc>/g)
      ).map((match) => match[1])
    )
  );

  const sitemapPages = await runPool(sitemapUrls, 4, async (url) => fetchText(url));
  const courseUrls = Array.from(
    new Set(
      sitemapPages.flatMap((xml) =>
        Array.from(
          xml.matchAll(/<loc>(https:\/\/handbook\.une\.edu\.au\/courses\/2026\/[^<]+)<\/loc>/g)
        ).map((match) => match[1])
      )
    )
  );

  const records = (
    await runPool(courseUrls, 8, async (url) => {
      try {
        const html = await fetchText(url);
        const nextData = extractNextData(html);
        const content = nextData?.props?.pageProps?.pageContent;

        if (!content?.title) {
          return null;
        }

        const description =
          content.description ||
          content.aim ||
          content.overview ||
          content.other_description ||
          content.additional_info ||
          content.title;
        const faculty =
          content.display_owning_faculty?.value ||
          content.display_academic_org?.value ||
          "";
        const duration =
          content.maximum_duration ||
          content.full_time_duration ||
          content.part_time_duration ||
          "";
        const courseCode = content.code || content.course_code || undefined;
        const prerequisites = splitSignals(content.year_12_prerequisites || "");
        const assumedKnowledge = splitSignals(
          content.assumed_knowledge ||
            content.qualification_requirement ||
            content.special_requirements ||
            ""
        );
        const careerOutcomes = Array.isArray(content.areas_of_employment)
          ? content.areas_of_employment.flatMap((item) =>
              typeof item === "string" ? splitSignals(item) : splitSignals(item?.value || "")
            )
          : splitSignals(content.areas_of_employment || "");

        return baseRecord({
          university: "University of New England",
          universitySlug: "university-of-new-england",
          faculty,
          courseName: stripTags(content.title),
          courseCode,
          level: levelFromText(content.title, `${content.type?.label || ""} ${url}`),
          description,
          duration,
          atar: null,
          officialUrl: url,
          prerequisites,
          assumedKnowledge,
          careerOutcomes,
        });
      } catch {
        return null;
      }
    })
  ).filter(Boolean);

  writeJson(
    "university-of-new-england-expanded",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateNewcastle() {
  const indexMarkdown = await fetchText("https://r.jina.ai/http://https://www.newcastle.edu.au/degrees");
  const indexEntries = parseNewcastleIndex(indexMarkdown);
  const sitemapIndex = await fetchText("https://handbook.newcastle.edu.au/sitemap.xml");
  const sitemapUrls = Array.from(
    new Set(
      Array.from(
        sitemapIndex.matchAll(/<loc>(https:\/\/handbook\.newcastle\.edu\.au\/sitemap\/[^<]+)<\/loc>/g)
      ).map((match) => match[1])
    )
  );
  const sitemapPages = await runPool(sitemapUrls, 4, async (url) => fetchText(url));
  const programUrls = Array.from(
    new Set(
      sitemapPages.flatMap((xml) =>
        Array.from(
          xml.matchAll(/<loc>(https:\/\/handbook\.newcastle\.edu\.au\/program\/2026\/[^<]+)<\/loc>/g)
        ).map((match) => match[1])
      )
    )
  );

  const records = (
    await runPool(programUrls, 8, async (url) => {
      try {
        const html = await fetchText(url);
        const nextData = extractNextData(html);
        const content = nextData?.props?.pageProps?.pageContent;

        if (!content?.title) {
          return null;
        }

        const courseCode = content.code || undefined;
        const indexEntry = courseCode ? indexEntries.get(courseCode) : null;
        const description =
          content.description ||
          content.aim ||
          content.additional_information ||
          content.publication_information ||
          content.title;
        const faculty =
          content.parent_academic_org ||
          content.academic_org ||
          content.sub_academic_org ||
          content.educational_area ||
          "";

        return baseRecord({
          university: "University of Newcastle",
          universitySlug: "university-of-newcastle",
          faculty,
          courseName: stripTags(content.title),
          courseCode,
          level: levelFromText(content.title, `${content.study_level_ref || ""} ${content.type?.label || ""}`),
          description,
          duration: formatNewcastleDuration(content, indexEntry?.duration || ""),
          atar: typeof indexEntry?.selectionRank === "number" ? indexEntry.selectionRank : null,
          officialUrl: url,
        });
      } catch {
        return null;
      }
    })
  ).filter(Boolean);

  writeJson(
    "university-of-newcastle-expanded",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateUow() {
  const sitemap = await fetchText("https://www.uow.edu.au/courses-sitemap-xml/");
  const urls = Array.from(
    new Set(
      Array.from(
        sitemap.matchAll(/<loc>(https:\/\/www\.uow\.edu\.au\/study\/courses\/[^<]+)<\/loc>/g)
      ).map((match) => match[1].replace(/\?students=domestic$/, ""))
    )
  );

  const pages = await runPool(urls, 10, async (url) => {
    const html = await fetchText(url);
    const courseName =
      extractMeta(html, "coursetitle") ||
      html
        .match(/<title>([^<]+)<\/title>/i)?.[1]
        ?.replace(/ - University of Wollongong.+$/, "")
        .trim() ||
      titleCaseFromSlug(url.split("/").filter(Boolean).pop() || "");
    const description = extractMeta(html, "description") || courseName;
    const faculty = extractMeta(html, "faculty") || extractMeta(html, "studyarea");
    const duration = extractMeta(html, "duration");
    const atar = Number.parseFloat(extractMeta(html, "atar"));
    const courseCode = extractMeta(html, "coursecode");
    const careers = extractMeta(html, "careers")
      .split(",")
      .map((item) => stripTags(item))
      .filter(Boolean);
    const levelHint = extractMeta(html, "category");

    return {
      ...baseRecord({
        university: "University of Wollongong",
        universitySlug: "university-of-wollongong",
        faculty,
        courseName,
        courseCode,
        level: levelFromText(courseName, `${levelHint} ${url}`),
        description,
        duration,
        atar: Number.isFinite(atar) ? atar : null,
        officialUrl: url,
      }),
      careerOutcomes: careers,
    };
  });

  writeJson(
    "university-of-wollongong-expanded",
    pages.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function generateSydney() {
  const sitemap = await fetchText("https://www.sydney.edu.au/courses/sitemap.xml");
  const urls = Array.from(
    new Set(
      Array.from(
        sitemap.matchAll(
          /<loc>(https:\/\/www\.sydney\.edu\.au\/courses\/courses\/ug\/[^<]+)<\/loc>/g
        )
      ).map((match) => match[1])
    )
  );

  const pages = await runPool(urls, 10, async (url) => {
    const html = await fetchText(url);
    const courseName =
      extractMeta(html, "og:title") ||
      html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ||
      titleCaseFromSlug(url.split("/").pop()?.replace(/\.html$/, "") || "");
    const description = extractMeta(html, "description") || courseName;
    const keywordFaculty = extractMeta(html, "keywords").split(",").map(stripTags).filter(Boolean)[0] || "";

    return baseRecord({
      university: "University of Sydney",
      universitySlug: "university-of-sydney",
      faculty: keywordFaculty,
      courseName,
      level: levelFromText(courseName, url),
      description,
      duration: "",
      atar: null,
      officialUrl: url,
    });
  });

  const undergraduatePages = pages.filter(
    (course) =>
      course.level === "undergraduate" &&
      !/^Sydney Professional Certificate\b/i.test(course.courseName)
  );

  if (undergraduatePages.length < 50) {
    const fallback = JSON.parse(
      fs.readFileSync(
        path.join(DATA_ROOT, "university-of-sydney", "courses.json"),
        "utf8"
      )
    );
    writeJson(
      "university-of-sydney-expanded",
      fallback.sort((a, b) => a.courseName.localeCompare(b.courseName))
    );
    return;
  }

  writeJson(
    "university-of-sydney-expanded",
    undergraduatePages.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function fetchUnswPage(startRank, numRanks = 100) {
  const params = new URLSearchParams({
    form: "json",
    collection: "unsw~unsw-search",
    profile: "degrees",
    query: "!padrenull",
    start_rank: String(startRank),
    num_ranks: String(numRanks),
    sort: "title",
    gscope1: "degree",
    "cool.4": "0.3",
  });

  return fetchJson(`https://unsw-search.funnelback.squiz.cloud/s/search.html?${params.toString()}`);
}

async function generateUnsw() {
  const firstPage = await fetchUnswPage(1, 100);
  const total = firstPage.response?.resultPacket?.resultsSummary?.totalMatching ?? 0;
  const firstResults = firstPage.response?.resultPacket?.results ?? [];
  const startRanks = [];

  for (let startRank = 101; startRank <= total; startRank += 100) {
    startRanks.push(startRank);
  }

  const remainingPages = await runPool(startRanks, 5, async (startRank) => {
    const page = await fetchUnswPage(startRank, 100);
    return page.response?.resultPacket?.results ?? [];
  });

  const searchResults = [firstResults, ...remainingPages]
    .flat()
    .filter((result) => result?.liveUrl);

  const records = await runPool(searchResults, 8, async (result) => {
      const meta = result.metaData || {};
      const html = await fetchText(result.liveUrl).catch(() => "");
      const subjectGuidance = parseSubjectGuidanceText(extractUnswAssumedKnowledgeText(html));
      const parsedAtar = extractSelectionRankFromHtml(html);
      return baseRecord({
        university: "University of New South Wales",
        universitySlug: "unsw",
        faculty: meta.degreeFaculty || meta.degreeAreaOfStudy || "",
        courseName: stripTags(result.title || meta.degreeAlphanumericTitle || ""),
        courseCode: meta.degreeProgramCode || meta.degreeSharedProgramCodeId || undefined,
        level: levelFromText(result.title || "", `${meta.degreeType || ""} ${meta.degreeCategory || ""}`),
        description: meta.degreeTagline || result.summary || result.title,
        duration: meta.degreeDuration || "",
        atar: parsedAtar,
        officialUrl: result.liveUrl,
        assumedKnowledge: subjectGuidance.assumedKnowledge,
        recommendedSubjects: subjectGuidance.recommendedSubjects,
      });
    });

  writeJson(
    "unsw-expanded",
    records.sort((a, b) => a.courseName.localeCompare(b.courseName))
  );
}

async function fetchUtsSearchPage(page) {
  return fetchJson("https://www.uts.edu.au/api/search/contentsearch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageId: "1294",
      Group: "Courses",
      Page: page,
      pageSize: 18,
      Term: "",
      Filters: [],
    }),
  });
}

async function generateUts() {
  const firstPage = await fetchUtsSearchPage(1);
  const totalPages = firstPage.pagination?.totalPages ?? 0;
  const firstResults = firstPage.results ?? [];
  const pageNumbers = [];

  for (let page = 2; page <= totalPages; page += 1) {
    pageNumbers.push(page);
  }

  const remainingPages = await runPool(pageNumbers, 5, async (page) => {
    const response = await fetchUtsSearchPage(page);
    return response.results ?? [];
  });

  const hits = [firstResults, ...remainingPages].flat();
  const deduped = Array.from(new Map(hits.map((hit) => [hit.url, hit])).values());

  const pages = await runPool(deduped, 10, async (hit) => {
    try {
      const html = await fetchTextWithRetries(hit.url, undefined, 3);
      const dataLayer = extractJsonFromAssignment(html, "window.dataLayer.push(") || {};
      const subjectGuidance = parseSubjectGuidanceText(extractUtsAssumedKnowledgeText(html));
      const courseName =
        dataLayer.course_name ||
        extractMeta(html, "og:title") ||
        html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ||
        hit.title;
      const description = extractMeta(html, "description") || hit.title;
      const duration = dataLayer.course_period || (hit.duration || []).join(", ");
      const atar = parseFirstNumber(hit.selectionRanks || []);

      return baseRecord({
        university: "University of Technology Sydney",
        universitySlug: "uts",
        faculty: dataLayer.faculty || dataLayer.course_area || dataLayer.study_area || "",
        courseName,
        courseCode: dataLayer.course_code || undefined,
        level: levelFromText(courseName, dataLayer.course_level || ""),
        description,
        duration,
        atar,
        officialUrl: hit.url,
        assumedKnowledge: subjectGuidance.assumedKnowledge,
        recommendedSubjects: subjectGuidance.recommendedSubjects,
      });
    } catch {
      return baseRecord({
        university: "University of Technology Sydney",
        universitySlug: "uts",
        faculty: "",
        courseName: hit.title,
        level: levelFromText(hit.title, ""),
        description: hit.title,
        duration: (hit.duration || []).join(", "),
        atar: parseFirstNumber(hit.selectionRanks || []),
        officialUrl: hit.url,
      });
    }
  });

  writeJson("uts-expanded", pages.sort((a, b) => a.courseName.localeCompare(b.courseName)));
}

const generators = {
  acu: generateAcu,
  wsu: generateWsu,
  csu: generateCsu,
  macquarie: generateMacquarie,
  une: generateUne,
  scu: generateScu,
  newcastle: generateNewcastle,
  uow: generateUow,
  sydney: generateSydney,
  unsw: generateUnsw,
  uts: generateUts,
};

const requested = process.argv.slice(2);
const selected = requested.length > 0 ? requested : Object.keys(generators);

for (const name of selected) {
  const generator = generators[name];

  if (!generator) {
    throw new Error(`Unknown generator: ${name}`);
  }

  await generator();
}
