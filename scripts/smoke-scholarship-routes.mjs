const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error("Usage: node scripts/smoke-scholarship-routes.mjs <base-url>");
}

const expectations = [
  ["/", "Helping regional NSW students navigate life after school"],
  ["/toolkit", "Practical Tools Hub"],
  ["/scholarships", "Scholarship Finder"],
  ["/scholarships", "UAC Equity Scholarships"],
  ["/scholarships", "Indigenous Commonwealth Accommodation Scholarship"],
  ["/scholarships", "Official source link"],
  ["/research", "Consultation, Evidence And Recommendations"],
];

for (const [path, expected] of expectations) {
  const response = await fetch(new URL(path, baseUrl));
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes(expected)) {
    throw new Error(`${path} did not include expected text: ${expected}`);
  }
}

console.log(`SMOKE_OK ${baseUrl}`);
