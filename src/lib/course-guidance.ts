type CourseLevel = "undergraduate" | "postgraduate" | "diploma" | "pathway";

type CourseLike = {
  faculty: string;
  courseName: string;
  description: string;
  level: CourseLevel;
  prerequisites: string[];
  assumedKnowledge: string[];
  recommendedSubjects: string[];
  secondarySubjects: string[];
};

type DomainRule = {
  id: string;
  group: string;
  patterns: RegExp[];
  faculty: string;
  specificity: "broad" | "specific";
  required?: string[];
  assumed?: string[];
  recommended: string[];
  secondary: string[];
  summary: string;
};

const SPECIFIC_RULES: DomainRule[] = [
  {
    id: "physics",
    group: "science",
    patterns: [/\bphysics\b/, /\bastrophysics\b/, /\bquantum\b/],
    faculty: "Science, Agriculture and Environment",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    assumed: ["Physics"],
    recommended: ["Mathematics Extension 1"],
    secondary: ["Chemistry", "Engineering Studies"],
    summary:
      "advanced mathematical modelling, experimental analysis and physical systems reasoning",
  },
  {
    id: "mathematics",
    group: "science",
    patterns: [/\bmathematics\b/, /\bmathematical\b/, /\bmaths\b/, /\bactuar/i],
    faculty: "Science, Agriculture and Environment",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    recommended: ["Mathematics Extension 1"],
    secondary: ["Physics", "Chemistry"],
    summary:
      "abstract reasoning, mathematical proof, modelling and quantitative problem-solving",
  },
  {
    id: "economics",
    group: "business",
    patterns: [/\beconomics\b/, /\beconomy\b/, /\beconometric/i, /\bfintech\b/],
    faculty: "Business",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    recommended: ["Economics", "Mathematics Extension 1"],
    secondary: ["Business Studies", "English Advanced"],
    summary:
      "quantitative economic analysis, markets, policy and evidence-based decision-making",
  },
  {
    id: "architecture",
    group: "engineering",
    patterns: [/\barchitecture\b/, /\bbuilt environment\b/, /\burban\b/, /\bplanning\b/, /\binterior\b/],
    faculty: "Engineering, Design and Technology",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    assumed: ["Physics"],
    recommended: ["Design and Technology"],
    secondary: ["Visual Arts", "Engineering Studies"],
    summary:
      "spatial design, technical drawing, materials understanding and built-environment problem-solving",
  },
  {
    id: "computing",
    group: "computing",
    patterns: [/\bcomputer science\b/, /\bsoftware\b/, /\bdata science\b/, /\bartificial intelligence\b/, /\bcyber\b/, /\binformation technology\b/, /\bcomputing\b/],
    faculty: "Engineering, Design and Technology",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    recommended: ["Mathematics Extension 1", "Software Engineering"],
    secondary: ["Physics", "Business Studies"],
    summary:
      "computational thinking, formal problem-solving, coding and data-driven systems design",
  },
  {
    id: "psychology",
    group: "health",
    patterns: [/\bpsychology\b/, /\bpsychological science\b/, /\bmental health\b/],
    faculty: "Health and Science",
    specificity: "specific",
    recommended: ["Biology", "English Advanced"],
    secondary: ["Mathematics Advanced", "Society and Culture"],
    summary:
      "human behaviour, scientific research, communication and evidence-based analysis of mind and behaviour",
  },
  {
    id: "nursing",
    group: "health",
    patterns: [/\bnursing\b/, /\bmidwif/i, /\bparamedic\b/],
    faculty: "Health and Science",
    specificity: "specific",
    recommended: ["Biology", "English Advanced"],
    secondary: ["PDHPE", "Chemistry"],
    summary:
      "clinical communication, patient care, human biology and applied health practice",
  },
  {
    id: "pharmacy",
    group: "health",
    patterns: [/\bpharmacy\b/, /\bpharmaceutical/i, /\bpharmacology\b/],
    faculty: "Health and Science",
    specificity: "specific",
    required: ["Chemistry"],
    assumed: ["Biology"],
    recommended: ["Mathematics Advanced"],
    secondary: ["PDHPE", "Physics"],
    summary:
      "medicinal chemistry, human biology, quantitative reasoning and clinical decision-making",
  },
  {
    id: "biomedical",
    group: "health",
    patterns: [/\bbiomedical\b/, /\bbiomedicine\b/, /\bmedical science\b/, /\bmedical laboratory\b/],
    faculty: "Health and Science",
    specificity: "specific",
    recommended: ["Biology", "Chemistry"],
    secondary: ["Mathematics Advanced", "Physics"],
    summary:
      "human biology, laboratory science, disease processes and scientific investigation",
  },
  {
    id: "medicine",
    group: "health",
    patterns: [/\bmedicine\b/, /\bmedical\b/, /\bdental\b/, /\boral health\b/, /\bveterinary\b/],
    faculty: "Health and Science",
    specificity: "specific",
    required: ["Chemistry"],
    recommended: ["Biology", "English Advanced"],
    secondary: ["Mathematics Advanced", "PDHPE"],
    summary:
      "clinical science, patient communication, human systems knowledge and evidence-based care",
  },
];

const DOMAIN_RULES: DomainRule[] = [
  {
    id: "law",
    group: "law",
    patterns: [/\blaw\b/, /\blegal\b/, /\bjuris\b/, /\bcriminology\b/, /\bjustice\b/, /\bpolicing\b/, /\bmigration\b/],
    faculty: "Law, Justice and Criminology",
    specificity: "broad",
    recommended: ["English Advanced", "Legal Studies"],
    secondary: ["Modern History", "Business Studies"],
    summary:
      "legal reasoning, critical reading, policy analysis and professional communication",
  },
  {
    id: "business",
    group: "business",
    patterns: [/\bbusiness\b/, /\baccount/i, /\bfinance\b/, /\beconom/i, /\bmarketing\b/, /\bcommerce\b/, /\bmanagement\b/, /\bhotel\b/, /\btourism\b/, /\bproject management\b/],
    faculty: "Business",
    specificity: "broad",
    required: ["Mathematics Advanced"],
    recommended: ["Business Studies", "Economics"],
    secondary: ["English Advanced", "Mathematics Extension 1"],
    summary:
      "commercial decision-making, quantitative analysis and organisational strategy",
  },
  {
    id: "engineering",
    group: "engineering",
    patterns: [/\bengineer/i, /\bconstruction\b/, /\bbuilt environment\b/, /\barchitecture\b/, /\bproperty\b/, /\bsurvey/i],
    faculty: "Engineering, Design and Technology",
    specificity: "broad",
    required: ["Mathematics Advanced"],
    assumed: ["Physics"],
    recommended: ["Mathematics Extension 1", "Engineering Studies"],
    secondary: ["Design and Technology", "Chemistry"],
    summary:
      "technical design, systems thinking, applied mathematics and problem-solving in built and engineered environments",
  },
  {
    id: "computing-general",
    group: "computing",
    patterns: [/\bcomputer\b/, /\bsoftware\b/, /\binformation technology\b/, /\bict\b/, /\bcyber\b/, /\bdata science\b/, /\bartificial intelligence\b/, /\bmachine learning\b/, /\bstatistics\b/, /\bmathematics\b/],
    faculty: "Engineering, Design and Technology",
    specificity: "broad",
    required: ["Mathematics Advanced"],
    recommended: ["Software Engineering", "Mathematics Extension 1"],
    secondary: ["Physics", "Business Studies"],
    summary:
      "computing, digital systems, quantitative thinking and data-driven problem-solving",
  },
  {
    id: "health-general",
    group: "health",
    patterns: [/\bmedicine\b/, /\bmedical\b/, /\bbiomedical\b/, /\bpharmacy\b/, /\bnursing\b/, /\bmidwif/i, /\bparamedic\b/, /\bphysio/i, /\boccupational therapy\b/, /\bspeech pathology\b/, /\bnutrition\b/, /\bdiet/i, /\bpublic health\b/, /\bclinical\b/, /\bexercise\b/, /\bsport science\b/, /\bosteopath/i, /\bpodiat/i, /\bdental\b/, /\boral health\b/, /\bveterinary\b/, /\bpsychology\b/, /\blaboratory\b/],
    faculty: "Health and Science",
    specificity: "broad",
    recommended: ["Biology", "Chemistry"],
    secondary: ["PDHPE", "Mathematics Advanced"],
    summary:
      "human health, scientific literacy, evidence-based practice and professional care in clinical or community settings",
  },
  {
    id: "education",
    group: "education",
    patterns: [/\beducation\b/, /\bteaching\b/, /\bearly childhood\b/, /\bvocational education\b/],
    faculty: "Education",
    specificity: "broad",
    recommended: ["English Advanced", "Mathematics Standard 2"],
    secondary: ["Biology", "PDHPE"],
    summary:
      "curriculum, communication, learner development and professional teaching practice",
  },
  {
    id: "arts",
    group: "arts",
    patterns: [/\barts\b/, /\bhumanities\b/, /\bcommunication\b/, /\bcreative\b/, /\bwriting\b/, /\blanguages\b/, /\bmusic\b/, /\btheology\b/, /\bphilosophy\b/, /\binternational studies\b/, /\bglobal studies\b/, /\bcommunity\b/, /\byouth work\b/, /\bsocial work\b/],
    faculty: "Arts, Humanities and Social Sciences",
    specificity: "broad",
    recommended: ["English Advanced", "Modern History"],
    secondary: ["Visual Arts", "Languages", "Society and Culture"],
    summary:
      "communication, culture, social analysis and applied human-centred problem-solving",
  },
  {
    id: "agriculture",
    group: "science",
    patterns: [/\bagricultur/i, /\benvironment/i, /\bscience\b/, /\bwine\b/, /\bhorticultur/i, /\banimal\b/, /\bequine\b/, /\bfish\b/, /\bconservation\b/],
    faculty: "Science, Agriculture and Environment",
    specificity: "broad",
    recommended: ["Biology", "Chemistry"],
    secondary: ["Geography", "Mathematics Advanced"],
    summary:
      "scientific investigation, environmental systems and applied field-based analysis",
  },
];

function uniq(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeFaculty(rawFaculty: string, domains: DomainRule[]) {
  const faculty = rawFaculty.trim();

  if (!faculty || faculty.includes("|") || faculty.includes("aos:")) {
    return domains[0]?.faculty ?? "General Studies";
  }

  if (faculty === faculty.toLowerCase()) {
    return domains[0]?.faculty ?? "General Studies";
  }

  return faculty;
}

function matchesRule(rule: DomainRule, text: string) {
  return rule.patterns.some((pattern) => pattern.test(text));
}

function isCombinedCourse(courseName: string) {
  return /\/|double degree|combined/i.test(courseName);
}

function detectDomains(text: string, courseName: string) {
  const specificMatches = SPECIFIC_RULES.filter((rule) => matchesRule(rule, text));
  const broadMatches = DOMAIN_RULES.filter((rule) => matchesRule(rule, text));

  if (specificMatches.length === 0) {
    return broadMatches.length > 0
      ? broadMatches
      : [DOMAIN_RULES.find((rule) => rule.id === "arts")!];
  }

  if (!isCombinedCourse(courseName)) {
    return specificMatches;
  }

  const coveredGroups = new Set(specificMatches.map((rule) => rule.group));
  const supplementalBroadMatches = broadMatches.filter((rule) => !coveredGroups.has(rule.group));

  return [...specificMatches, ...supplementalBroadMatches];
}

function buildSummary(courseName: string, domains: DomainRule[]) {
  if (domains.length === 1) {
    return `${courseName} focuses on ${domains[0].summary}. This toolkit attaches the school-subject pathway that most directly supports entry into later study in that discipline.`;
  }

  const labels = domains.slice(0, 2).map((domain) => domain.faculty.toLowerCase());
  return `${courseName} combines ${labels.join(" with ")} study. The subject pathway in this toolkit blends the strongest school-level preparation signals for each side of the course so students can keep both directions open.`;
}

export function enrichCourseRecord<T extends CourseLike>(course: T): T {
  const text = `${course.faculty} ${course.courseName} ${course.description}`.toLowerCase();
  const domains = detectDomains(text, course.courseName);
  const fallbackSummary = buildSummary(course.courseName, domains);

  return {
    ...course,
    faculty: normalizeFaculty(course.faculty, domains),
    description:
      course.description.trim().length >= 40 ? course.description.trim() : fallbackSummary,
    prerequisites: uniq([
      ...course.prerequisites,
      ...domains.flatMap((domain) => domain.required ?? []),
    ]),
    assumedKnowledge: uniq([
      ...course.assumedKnowledge,
      ...domains.flatMap((domain) => domain.assumed ?? []),
    ]),
    recommendedSubjects: uniq([
      ...course.recommendedSubjects,
      ...domains.flatMap((domain) => domain.recommended),
    ]),
    secondarySubjects: uniq([
      ...course.secondarySubjects,
      ...domains.flatMap((domain) => domain.secondary),
    ]),
  };
}
