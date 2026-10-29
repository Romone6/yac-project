import assert from "node:assert/strict";
import test from "node:test";

import { matchScore, searchPageResources } from "../src/lib/site-search";

test("short financial searches lead to the financial page, not pages beginning with find", () => {
  const results = searchPageResources("fin");
  assert.equal(results[0]?.page.href, "/toolkit/financial-pathways");
  assert.ok(results.some(({ page }) => page.href === "/toolkit/financial-pathways"));
  assert.ok(!results.some(({ page }) => page.href === "/toolkit/application-timelines"));
  assert.equal(matchScore("Find application dates", ["fin"]), 0);
});

test("site search includes the major tools and project information pages", () => {
  for (const [route, query] of [["/support", "suburban"], ["/calendar", "open day"], ["/checklist", "first year"], ["/research", "regional"], ["/scholarships", "bursary"]]) {
    const results = searchPageResources(query);
    assert.ok(results.some(({ page }) => page.href === route), `expected ${route} to match ${query}`);
  }
});

test("multi-keyword searches rank pages containing the full topic higher", () => {
  const results = searchPageResources("moving costs rent");
  assert.equal(results[0]?.page.href, "/toolkit/financial-pathways");
});
