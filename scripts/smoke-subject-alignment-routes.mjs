const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error("Usage: node scripts/smoke-subject-alignment-routes.mjs <base-url>");
  process.exit(1);
}

async function get(path) {
  const response = await fetch(new URL(path, baseUrl));
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }

  return body;
}

function assertIncludes(body, expected, label) {
  if (!body.includes(expected)) {
    throw new Error(`${label} missing expected text: ${expected}`);
  }
}

function assertExcludes(body, unexpected, label) {
  if (body.includes(unexpected)) {
    throw new Error(`${label} includes unexpected text: ${unexpected}`);
  }
}

const subjectPage = await get("/toolkit/subject-alignment");
assertIncludes(subjectPage, "undergraduate-first", "Subject alignment page");
assertExcludes(
  subjectPage,
  "Sydney Professional Certificate",
  "Subject alignment page"
);

const sydneyDetail = await get("/toolkit/subject-alignment/usyd-b-a");
assertIncludes(sydneyDetail, "Undergraduate course summary", "Sydney detail page");
assertIncludes(sydneyDetail, "Bachelor of Arts", "Sydney detail page");
assertExcludes(
  sydneyDetail,
  "Sydney Professional Certificate",
  "Sydney detail page"
);

console.log(`Subject alignment route smoke passed for ${baseUrl}`);
