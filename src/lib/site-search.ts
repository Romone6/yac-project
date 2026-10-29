export type SearchablePage = {
  title: string;
  description: string;
  href: string;
  keywords: string;
};

export const searchablePages: SearchablePage[] = [
  { title: "Home and pathway overview", description: "Start with an interest, compare post-school options and find clear information for regional NSW students.", href: "/", keywords: "HSC after high school Year 12 university TAFE VET apprenticeships traineeships trade jobs careers regional rural NSW Port Macquarie Westport school" },
  { title: "Explore all tools", description: "Browse practical pathway, planning, money, dates and support tools.", href: "/toolkit", keywords: "toolkit resources guides calculator checklist calendar support pathway options" },
  { title: "University courses and HSC subjects", description: "Search NSW undergraduate courses, published entry information, prerequisites and subject planning guidance.", href: "/toolkit/subject-alignment", keywords: "course degree university bachelor ATAR selection rank prerequisite assumed knowledge HSC subjects maths English biology chemistry physics nursing teaching engineering psychology design" },
  { title: "Scholarships and student support", description: "Search scholarships, bursaries, grants, accommodation, relocation and equity support.", href: "/scholarships", keywords: "funding financial money award bursary grant rural regional low income first family disability Aboriginal Indigenous equity accommodation relocation nursing open closing eligibility" },
  { title: "Application dates and timelines", description: "Check university admissions rounds, UAC application dates, early entry and scholarship milestones.", href: "/toolkit/application-timelines", keywords: "deadline dates close opens application admissions UAC SRS Schools Recommendation Scheme preferences offers enrolment census scholarship key dates" },
  { title: "Application timeline tracker", description: "Review application rounds and key dates by NSW university.", href: "/timelines", keywords: "university application timeline round offer date semester intake 2026 2027 UAC early entry" },
  { title: "Regional study costs and financial support", description: "Plan study, travel and moving costs and check student payments and official support.", href: "/toolkit/financial-pathways", keywords: "finance financial cost costs budget moving accommodation rent travel transport living HELP HECS loan student payment Youth Allowance Austudy apprenticeship tools fee concession Centrelink regional" },
  { title: "Scholarship search tool", description: "Filter scholarships by closing date, institution, study level, field and eligibility.", href: "/toolkit/scholarships", keywords: "scholarship search bursary funding grant equity filter value field institution eligibility closing soon open" },
  { title: "Events and deadlines calendar", description: "Find confirmed application deadlines, offers, open days and careers events.", href: "/calendar", keywords: "event open day dates deadline offer HSC results ATAR release career week TAFE NSW university information session workshop" },
  { title: "Transition checklist", description: "Plan actions for exploring, applying, accepting an offer and starting study or work.", href: "/checklist", keywords: "checklist first year transition preparation enrollment enrolment apply offer placement move accommodation documents reminder wellbeing apprenticeship TAFE university" },
  { title: "Study hub and local support directory", description: "Find regional and suburban University Study Hubs, study spaces and community support.", href: "/support", keywords: "study hub centre centre location town regional suburban community facilities registration study space CUC Country Universities Centre library" },
  { title: "Research and consultation findings", description: "Read student voice evidence, consultation findings and policy recommendations.", href: "/research", keywords: "research report evidence consultation student voice regional participation policy recommendations access barriers information gap" },
  { title: "Consultation", description: "Read about the student consultation, survey and focus group report.", href: "/consultation", keywords: "survey focus group participate consultation student feedback research report evidence" },
  { title: "The project", description: "Understand the purpose, scope and design of Pathway to Entry.", href: "/the-project", keywords: "project YAC Youth Advisory Council NSW youth advisory regional students initiative purpose" },
  { title: "The pathway information gap", description: "Explore barriers between choosing a post-school pathway and reaching entry.", href: "/the-problem", keywords: "barriers gap participation university TAFE skilled employment regional metro information execution support" },
  { title: "Get involved", description: "Register interest as a mentor, educator, training provider or community partner.", href: "/get-involved", keywords: "mentor stakeholder educator school provider community partner expression interest EOI contact" },
  { title: "Project updates", description: "Read project milestones, consultation status and publications.", href: "/updates", keywords: "updates milestones publication consultation status next steps report" },
];

const stopWords = new Set(["a", "an", "and", "are", "for", "find", "i", "in", "is", "me", "my", "of", "or", "the", "to", "what", "with"]);

export function searchTokens(query: string) {
  return query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 1 && !stopWords.has(word));
}

export function matchScore(text: string, tokens: string[]) {
  const words = text.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word && !stopWords.has(word));
  return tokens.reduce((score, token) => score + (words.some((word) =>
    word === token || (token === "fin" ? word.startsWith("financ") : token.length >= 3 && word.startsWith(token)) ||
    (token.length > 3 && word === token.slice(0, -1)) ||
    (word.length > 3 && token === word.slice(0, -1))
  ) ? 1 : 0), 0);
}

export function searchPageResources(query: string) {
  const tokens = searchTokens(query);
  if (!tokens.length) return [];
  return searchablePages
    .map((page) => ({ page, score: matchScore(page.title, tokens) * 6 + matchScore(page.description, tokens) * 2 + matchScore(page.keywords, tokens) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
}
