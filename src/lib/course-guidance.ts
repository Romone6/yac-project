type CourseLevel = "undergraduate" | "postgraduate" | "diploma" | "pathway";

type CourseLike = {
  faculty: string;
  subjectAreas?: string[];
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
    id: "engineering-specialist",
    group: "engineering",
    patterns: [
      /\baerospace systems engineering\b/,
      /\b(?:civil|mechanical|electrical|mechatronic|chemical|environmental|biomedical|renewable energy|mining|materials|systems) engineering\b/,
      /\bbachelor of engineering\b/,
      /\bengineering \(honours\)\b/,
    ],
    faculty: "Engineering, Design and Technology",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    assumed: ["Physics"],
    recommended: ["Mathematics Extension 1", "Engineering Studies"],
    secondary: ["Design and Technology", "Chemistry"],
    summary:
      "engineering design, applied physics, advanced mathematics and technical systems problem-solving",
  },
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
    id: "business-specialist",
    group: "business",
    patterns: [
      /\bbusiness\b/,
      /\bcommerce\b/,
      /\baccounting\b/,
      /\bfinance\b/,
      /\bmarketing\b/,
      /\bbusiness administration\b/,
      /\bhuman resource management\b/,
    ],
    faculty: "Business",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    recommended: ["Business Studies", "Economics"],
    secondary: ["English Advanced", "Mathematics Extension 1"],
    summary:
      "commercial decision-making, financial literacy, market analysis and organisational strategy",
  },
  {
    id: "law-justice",
    group: "law",
    patterns: [
      /\bcriminology\b/,
      /\bcriminal justice\b/,
      /\blaw\b/,
      /\blegal studies\b/,
      /\bjuris doctor\b/,
    ],
    faculty: "Law, Justice and Criminology",
    specificity: "specific",
    recommended: ["English Advanced", "Legal Studies"],
    secondary: ["Modern History", "Society and Culture"],
    summary:
      "legal reasoning, justice systems, policy analysis and evidence-based professional communication",
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
    id: "construction-management",
    group: "engineering",
    patterns: [/\bconstruction management\b/, /\bconstruction project management\b/, /\bbuilding and construction\b/],
    faculty: "Engineering, Design and Technology",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    assumed: ["Physics"],
    recommended: ["Engineering Studies", "Design and Technology"],
    secondary: ["Mathematics Extension 1", "Business Studies"],
    summary:
      "construction systems, built-environment delivery, technical coordination and applied project problem-solving",
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
    patterns: [
      /\bcomputer science\b/,
      /\bsoftware\b/,
      /\bdata science\b/,
      /\bartificial intelligence\b/,
      /\bcyber(?:security| security)?\b/,
      /\binformation technology\b/,
      /\bapplication development\b/,
      /\bweb and mobile applications?\b/,
      /\bcomputing\b/,
    ],
    faculty: "Engineering, Design and Technology",
    specificity: "specific",
    required: ["Mathematics Advanced"],
    recommended: ["Mathematics Extension 1", "Software Engineering"],
    secondary: ["Physics", "Business Studies"],
    summary:
      "computational thinking, formal problem-solving, coding and data-driven systems design",
  },
  {
    id: "teaching-education",
    group: "education",
    patterns: [
      /\bbachelor of education\b/,
      /\bmaster of teaching\b/,
      /\beducational studies\b/,
      /\beducational leadership\b/,
      /\bspecial and inclusive education\b/,
      /\bearly childhood education\b/,
    ],
    faculty: "Education",
    specificity: "specific",
    recommended: ["English Advanced", "Mathematics Standard 2"],
    secondary: ["Society and Culture", "Modern History"],
    summary:
      "curriculum design, learner development, classroom communication and professional teaching practice",
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
    id: "exercise-physiology",
    group: "health",
    patterns: [
      /\bclinical exercise physiology\b/,
      /\bexercise physiology\b/,
      /\bexercise science\b/,
      /\bsport and exercise\b/,
      /\bsport science\b/,
    ],
    faculty: "Health and Science",
    specificity: "specific",
    recommended: ["Biology", "PDHPE"],
    secondary: ["Chemistry", "Mathematics Advanced"],
    summary:
      "human movement, exercise prescription, rehabilitation, physiology and evidence-based allied health practice",
  },
  {
    id: "sport-health",
    group: "health",
    patterns: [
      /\bhigh performance sport\b/,
      /\bsport and exercise\b/,
      /\bsport science\b/,
      /\bsports? performance\b/,
      /\bstrength and conditioning\b/,
    ],
    faculty: "Health and Science",
    specificity: "specific",
    recommended: ["Biology", "PDHPE"],
    secondary: ["Mathematics Advanced", "Chemistry"],
    summary:
      "human performance, movement science, training load, athlete wellbeing and evidence-based sport practice",
  },
  {
    id: "nursing",
    group: "health",
    patterns: [/\bnursing\b/, /\bmidwif/i, /\bparamedic(?:ine)?\b/],
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
    patterns: [/\bcomputer\b/, /\bsoftware\b/, /\binformation technology\b/, /\bict\b/, /\bcyber\b/, /\bdata science\b/, /\bartificial intelligence\b/, /\bmachine learning\b/],
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
    patterns: [/\beducation\b/, /\beducational\b/, /\bteaching\b/, /\bearly childhood\b/, /\bvocational education\b/, /\bcurriculum\b/, /\bpedagogy\b/],
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
  const primaryDomain = domains[0];

  if (primaryDomain) {
    return primaryDomain.faculty;
  }

  if (!faculty || faculty.includes("|") || faculty.includes("aos:")) {
    return "General Studies";
  }

  if (faculty === faculty.toLowerCase()) {
    return "General Studies";
  }

  return faculty;
}

function matchesRule(rule: DomainRule, text: string) {
  return rule.patterns.some((pattern) => pattern.test(text));
}

function detectDomains(text: string, courseName: string) {
  const title = courseName.toLowerCase();
  const allSpecificMatches = SPECIFIC_RULES.filter((rule) => matchesRule(rule, text));
  const titleSpecificMatches = allSpecificMatches.filter((rule) =>
    matchesRule(rule, title)
  );
  const eligibleSpecificMatches =
    titleSpecificMatches.length > 0
      ? allSpecificMatches.filter(
          (rule) =>
            matchesRule(rule, title) ||
            domainMatchScore(rule, courseName) >= 25
        )
      : allSpecificMatches;
  const specificMatches = rankDomainMatches(eligibleSpecificMatches, courseName);
  const broadMatches = rankDomainMatches(
    DOMAIN_RULES.filter((rule) => matchesRule(rule, text)),
    courseName
  );

  if (specificMatches.length === 0) {
    return broadMatches.length > 0
      ? broadMatches
      : [DOMAIN_RULES.find((rule) => rule.id === "arts")!];
  }

  const coveredGroups = new Set(specificMatches.map((rule) => rule.group));
  const supplementalBroadMatches = broadMatches.filter(
    (rule) =>
      !coveredGroups.has(rule.group) &&
      !isBlockedSupplementalBroadMatch(rule, courseName) &&
      (matchesRule(rule, courseName.toLowerCase()) ||
        domainMatchScore(rule, courseName) >= 25)
  );

  return [...specificMatches, ...supplementalBroadMatches];
}

function isBlockedSupplementalBroadMatch(rule: DomainRule, courseName: string) {
  const title = courseName.toLowerCase();

  return rule.id === "business" && /\bconstruction management\b/.test(title);
}

function rankDomainMatches(matches: DomainRule[], courseName: string) {
  return [...matches].sort(
    (a, b) => domainMatchScore(b, courseName) - domainMatchScore(a, courseName)
  );
}

function domainMatchScore(rule: DomainRule, courseName: string) {
  const title = courseName.toLowerCase();
  let score = matchesRule(rule, title) ? 10 : 0;

  if (
    rule.group === "engineering" &&
    /\b(?:engineering|aerospace|construction|built environment|civil|mechanical|electrical|mechatronic|surveying)\b/.test(title)
  ) {
    score += 20;
  }

  if (
    rule.group === "computing" &&
    /\b(?:computer science|software|information technology|application development|cybersecurity|cyber security|data science|artificial intelligence|computing)\b/.test(title)
  ) {
    score += 25;
  }

  if (
    rule.group === "health" &&
    /\b(?:clinical|exercise physiology|exercise science|health|rehabilitation|nursing|midwifery|paramedicine|medicine|medical|physio|therapy)\b/.test(title)
  ) {
    score += 20;
  }

  if (
    rule.group === "education" &&
    /\b(?:education|educational|teaching|early childhood|curriculum|pedagogy)\b/.test(title)
  ) {
    score += 25;
  }

  if (
    rule.group === "business" &&
    /\b(?:business|commerce|accounting|finance|marketing|economics|tourism|hotel|project management)\b/.test(title)
  ) {
    score += 20;
  }

  if (
    rule.group === "law" &&
    /\b(?:law|legal|criminology|criminal justice|juris doctor)\b/.test(title)
  ) {
    score += 25;
  }

  return score;
}

function buildSummary(courseName: string, domains: DomainRule[]) {
  if (domains.length === 1) {
    return `${courseName} focuses on ${domains[0].summary}. This toolkit attaches the school-subject pathway that most directly supports entry into later study in that discipline.`;
  }

  const labels = domains.slice(0, 2).map((domain) => domain.faculty.toLowerCase());
  return `${courseName} combines ${labels.join(" with ")} study. The subject pathway in this toolkit blends the strongest school-level preparation signals for each side of the course so students can keep both directions open.`;
}

function buildEnhancedDescription(
  course: CourseLike,
  domains: DomainRule[],
  subjectAreas: string[],
  recommendedSubjects: string[],
  secondarySubjects: string[]
) {
  const baseDescription = course.description.trim();
  const fallbackSummary = buildSummary(course.courseName, domains);
  const description =
    baseDescription.length >= 40 &&
    baseDescription.toLowerCase() !== course.courseName.trim().toLowerCase()
      ? baseDescription
      : fallbackSummary;

  if (description.length >= 220) {
    return description;
  }

  const primarySubjects = recommendedSubjects.slice(0, 3);
  const supportSubjects = secondarySubjects
    .filter((subject) => !primarySubjects.includes(subject))
    .slice(0, 2);
  const domainSummary =
    domains.length === 1
      ? domains[0].summary
      : domains
          .slice(0, 2)
          .map((domain) => domain.summary)
          .join(" alongside ");
  const subjectSentence =
    primarySubjects.length > 0
      ? `The subject-selection pathway prioritises ${primarySubjects.join(", ")}${
          supportSubjects.length > 0
            ? `, with ${supportSubjects.join(", ")} as supporting preparation`
            : ""
        }.`
      : "The subject-selection pathway prioritises strong literacy, numeracy and evidence-based study habits.";

  const pathwayLabel =
    subjectAreas.length > 1
      ? `${subjectAreas.slice(0, 2).join(" and ").toLowerCase()} pathway`
      : `${subjectAreas[0]?.toLowerCase() ?? "general studies"} pathway`;

  return `${description} In this toolkit, the course is treated as a ${pathwayLabel} because it develops ${domainSummary}. ${subjectSentence} Students should use the linked university course page to confirm entry rules, majors, campuses, accreditation and application details.`;
}

export function enrichCourseRecord<T extends CourseLike>(
  course: T
): T & { subjectAreas: string[] } {
  const text = `${course.courseName} ${course.description}`.toLowerCase();
  const domains = detectDomains(text, course.courseName);
  const subjectAreas = uniq([
    normalizeFaculty(course.faculty, domains),
    ...domains.map((domain) => domain.faculty),
    ...(course.subjectAreas ?? []),
  ]);
  const prerequisites = uniq([
    ...course.prerequisites,
    ...domains.flatMap((domain) => domain.required ?? []),
  ]);
  const assumedKnowledge = uniq([
    ...course.assumedKnowledge,
    ...domains.flatMap((domain) => domain.assumed ?? []),
  ]);
  const recommendedSubjects = uniq([
    ...course.recommendedSubjects,
    ...domains.flatMap((domain) => domain.recommended),
  ]);
  const secondarySubjects = uniq([
    ...course.secondarySubjects,
    ...domains.flatMap((domain) => domain.secondary),
  ]);

  return {
    ...course,
    faculty: normalizeFaculty(course.faculty, domains),
    subjectAreas,
    description: buildEnhancedDescription(
      course,
      domains,
      subjectAreas,
      recommendedSubjects,
      secondarySubjects
    ),
    prerequisites,
    assumedKnowledge,
    recommendedSubjects,
    secondarySubjects,
  };
}
