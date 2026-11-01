export type SearchablePage = {
  pageTitle: string;
  title: string;
  description: string;
  href: string;
  content: string;
};

// Keep this index grounded in headings and copy people can actually read on the
// site. Each entry is one destination or section, rather than a page-level bag
// of related search terms.
export const searchablePages: SearchablePage[] = [
  { pageTitle: "Home", title: "University", description: "Explore subject and course information for university pathways in NSW.", href: "/search?pathway=university&q=course", content: "University NSW subject course pathways" },
  { pageTitle: "Home", title: "TAFE or trade", description: "Search NSW vocational courses and check current options with the training provider.", href: "/search?pathway=tafe-vet&q=course", content: "TAFE trade vocational courses provider" },
  { pageTitle: "Home", title: "Work or apprenticeship", description: "Compare apprenticeship and traineeship options and learn how to get started.", href: "/search?pathway=apprenticeship&q=trade", content: "Work apprenticeship traineeship options" },
  { pageTitle: "Home", title: "Still exploring", description: "Search current tools, practical information and support.", href: "/search", content: "Explore tools practical information support" },
  { pageTitle: "Home", title: "Application timelines", description: "Track admissions, early-entry and scholarship dates.", href: "/toolkit/application-timelines", content: "Application timeline admissions early entry scholarship dates" },
  { pageTitle: "Home", title: "Scholarship finder", description: "Search current scholarships, bursaries and student support.", href: "/scholarships", content: "Scholarship bursary student support funding" },
  { pageTitle: "Home", title: "Subject alignment tool", description: "Compare HSC subject signals across available university courses.", href: "/toolkit/subject-alignment", content: "HSC subjects university courses prerequisites assumed knowledge ATAR selection rank" },
  { pageTitle: "Home", title: "Financial pathway guide", description: "Understand student payments, HELP loans and regional support.", href: "/toolkit/financial-pathways#official-cost-support-title", content: "Financial costs student payments HELP loans regional support" },
  { pageTitle: "Home", title: "Explore your options", description: "Start with your interests and browse the pathways and tools currently available.", href: "/toolkit", content: "Explore interests pathways available tools" },
  { pageTitle: "Home", title: "Plan the details", description: "Check application dates, scholarships and financial support as you make a plan.", href: "/toolkit/financial-pathways", content: "Plan application dates scholarships financial support" },
  { pageTitle: "Home", title: "Confirm with the provider", description: "Follow the official source links to confirm current dates and eligibility before applying.", href: "/toolkit", content: "Confirm official source links current dates eligibility applying" },

  { pageTitle: "Toolkit", title: "Events and Deadlines Calendar", description: "Browse confirmed application dates, offer rounds, open events and careers opportunities.", href: "/calendar", content: "Events deadlines application dates offer rounds open days careers" },
  { pageTitle: "Toolkit", title: "Application Timeline Tracker", description: "Track admissions, early-entry and scholarship milestones from UAC and university sources.", href: "/toolkit/application-timelines", content: "Application timeline admissions early entry scholarships UAC university" },
  { pageTitle: "Toolkit", title: "Scholarship Finder", description: "Search scholarships, bursaries, relocation support, accommodation help and equity funding.", href: "/scholarships", content: "Scholarships bursaries relocation accommodation equity funding" },
  { pageTitle: "Toolkit", title: "Subject Alignment Tool", description: "Compare subject signals across NSW university courses before finalising senior subject or course choices.", href: "/toolkit/subject-alignment", content: "Subject alignment HSC prerequisites assumed knowledge ATAR university course" },
  { pageTitle: "Toolkit", title: "Financial Pathway Explainer", description: "Understand HELP loans, student payments, regional relocation support and non-repayable funding.", href: "/toolkit/financial-pathways", content: "Financial pathway HELP loans payments regional relocation funding" },
  { pageTitle: "Toolkit", title: "Regional Student Checklist", description: "Track pathway-specific actions and personal target dates from exploring options to your first weeks.", href: "/checklist", content: "Regional student checklist actions target dates first weeks" },
  { pageTitle: "Toolkit", title: "Support Directory", description: "Search regional and suburban NSW University Study Hubs and contact a local centre directly.", href: "/support", content: "Regional suburban NSW University Study Hubs local centre" },

  { pageTitle: "Financial Pathways", title: "Staying at home", description: "Estimate travel, meals away from home, devices and course-specific equipment. Check provider course costs and transport concessions.", href: "/toolkit/financial-pathways#cost-scenarios-title", content: "Travel meals devices course equipment costs transport concessions staying home" },
  { pageTitle: "Financial Pathways", title: "Moving for study", description: "Include travel to inspect accommodation, bond, setup costs, rent, utilities, food and return trips. Confirm payment eligibility through Services Australia.", href: "/toolkit/financial-pathways#cost-scenarios-title", content: "Moving accommodation bond setup rent utilities food travel Services Australia" },
  { pageTitle: "Financial Pathways", title: "Apprenticeship or traineeship costs", description: "Ask the employer and training provider about tools, uniforms, travel, paid training time and course fees.", href: "/toolkit/financial-pathways#cost-scenarios-title", content: "Apprenticeship traineeship employer provider tools uniforms travel training fees" },
  { pageTitle: "Financial Pathways", title: "Online or mixed study costs", description: "Plan for reliable internet, a suitable device, occasional campus travel and required materials or placement travel.", href: "/toolkit/financial-pathways#cost-scenarios-title", content: "Online mixed study internet device campus materials placement travel" },

  { pageTitle: "Subject Alignment", title: "Course prerequisites and assumed knowledge", description: "Compare published ATAR or selection-rank references, prerequisites, assumed knowledge, recommended HSC subjects and career outcomes by course.", href: "/toolkit/subject-alignment", content: "Course prerequisites assumed knowledge ATAR selection rank recommended HSC subjects career outcomes" },
  { pageTitle: "Scholarships", title: "Find scholarships by eligibility", description: "Filter scholarships by closing date, institution, study level, field of study and eligibility.", href: "/scholarships", content: "Scholarship eligibility closing date institution study level field" },
  { pageTitle: "Application Timelines", title: "University application rounds", description: "Find application opening and closing dates, offer rounds and university-specific admissions milestones.", href: "/toolkit/application-timelines", content: "University application round opening closing dates offers admissions milestones" },
  { pageTitle: "Support Directory", title: "University Study Hubs", description: "Find regional and suburban study spaces, local facilities, registration information and contacts.", href: "/support", content: "University Study Hubs regional suburban facilities registration contact" },
  { pageTitle: "Calendar", title: "Events, open days and deadlines", description: "Browse confirmed university and TAFE events, application deadlines, offer rounds and careers opportunities.", href: "/calendar", content: "Events open days deadlines university TAFE careers" },
  { pageTitle: "Checklist", title: "Plan your next steps", description: "Track actions for exploring, applying, accepting an offer and starting study or work.", href: "/checklist", content: "Checklist explore apply accept offer start study work" },

  { pageTitle: "Research", title: "Information Gap", description: "Understand where students have trouble finding clear, practical pathway information.", href: "/research", content: "Research regional student information access gap" },
  { pageTitle: "Research", title: "Student Voice", description: "Read what regional students raised through consultation and student voice activities.", href: "/research", content: "Regional students student voice consultation findings" },
  { pageTitle: "Research", title: "Policy Translation", description: "See how research and consultation inform practical tools and recommendations.", href: "/research", content: "Research policy recommendations practical tools" },
  { pageTitle: "Consultation", title: "2026 consultation report", description: "Read the consultation report and find information about the survey and focus group process.", href: "/consultation", content: "2026 consultation report survey focus group student feedback" },
  { pageTitle: "Get Involved", title: "Mentor expression of interest", description: "Register interest in mentoring regional students as they explore post-school options.", href: "/get-involved", content: "Mentor expression of interest regional students" },
  { pageTitle: "Get Involved", title: "Educator and community partners", description: "Contact the project about school, training provider or community collaboration.", href: "/get-involved", content: "Educator school training provider community partner collaboration" },
  { pageTitle: "The Problem", title: "Regional versus metro participation gap", description: "Explore evidence about differences in post-school participation and access to opportunity.", href: "/the-problem", content: "Regional metro participation university access evidence" },
  { pageTitle: "The Problem", title: "Execution support after selection", description: "Understand the practical support students need after choosing a course or pathway.", href: "/the-problem", content: "Practical execution support after pathway selection" },
  { pageTitle: "The Project", title: "What the project does", description: "Learn how Pathway to Entry brings practical pathway information together for regional NSW students.", href: "/the-project", content: "Project purpose regional NSW students pathways" },
  { pageTitle: "Project Updates", title: "Milestones and publications", description: "Follow consultation progress, project milestones and published resources.", href: "/updates", content: "Project updates milestones publications consultation" },
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
    .map((page) => {
      const titleScore = matchScore(page.title, tokens);
      const descriptionScore = matchScore(page.description, tokens);
      const contentScore = matchScore(page.content, tokens);
      const matched = Math.max(titleScore, descriptionScore, contentScore);
      const coverage = (titleScore + descriptionScore + contentScore) / (tokens.length * 3);
      return { page, score: titleScore * 8 + descriptionScore * 3 + contentScore * 2 + coverage * 4, matched };
    })
    .filter((result) => result.matched > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
}
