import macquarieCoursesJson from "../../data/courses/nsw/macquarie-university/courses.json";
import newcastleCoursesJson from "../../data/courses/nsw/university-of-newcastle/courses.json";
import sydneyCoursesJson from "../../data/courses/nsw/university-of-sydney/courses.json";
import uowCoursesJson from "../../data/courses/nsw/university-of-wollongong/courses.json";
import unswCoursesJson from "../../data/courses/nsw/unsw/courses.json";
import utsCoursesJson from "../../data/courses/nsw/uts/courses.json";

export type CourseLevel = "undergraduate" | "postgraduate" | "diploma" | "pathway";

export type CourseRecord = {
  id: string;
  university: string;
  universitySlug: string;
  state: string;
  faculty: string;
  courseName: string;
  courseCode?: string;
  level: CourseLevel;
  description: string;
  duration?: string;
  atar: number | null;
  prerequisites: string[];
  assumedKnowledge: string[];
  recommendedSubjects: string[];
  secondarySubjects: string[];
  careerOutcomes: string[];
  officialUrl: string;
  lastUpdated: string;
};

type ManualCourseSeed = {
  faculty: string;
  searchUrl: string;
  entries: Array<{
    name: string;
    code: string;
    level: CourseLevel;
    atar: number | null;
    duration: string;
    prerequisites?: string[];
    description: string;
  }>;
};

function normalizeCourses(courses: unknown): CourseRecord[] {
  return courses as CourseRecord[];
}

function buildManualUniversityCourses(
  university: string,
  universitySlug: string,
  seeds: ManualCourseSeed[]
): CourseRecord[] {
  const generatedAt = "2026-04-16T00:00:00.000Z";

  return seeds.flatMap((seed) =>
    seed.entries.map((entry) => ({
      id: `${universitySlug}-${entry.code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      university,
      universitySlug,
      state: "NSW",
      faculty: seed.faculty,
      courseName: entry.name,
      courseCode: entry.code,
      level: entry.level,
      description: entry.description,
      duration: entry.duration,
      atar: entry.atar,
      prerequisites: entry.prerequisites ?? [],
      assumedKnowledge: [],
      recommendedSubjects: [],
      secondarySubjects: [],
      careerOutcomes: [],
      officialUrl: seed.searchUrl,
      lastUpdated: generatedAt,
    }))
  );
}

const acuCourses = buildManualUniversityCourses("Australian Catholic University", "australian-catholic-university", [
  {
    faculty: "Law and Business",
    searchUrl: "https://www.acu.edu.au/course-browser",
    entries: [
      { name: "Bachelor of Business Administration", code: "BBA", level: "undergraduate", atar: 58, duration: "3 years", description: "Core business degree covering management, innovation and entrepreneurship." },
      { name: "Bachelor of Accounting and Finance", code: "BAF", level: "undergraduate", atar: 58, duration: "3 years", description: "Professional accounting and finance preparation." },
      { name: "Bachelor of Commerce", code: "BCOM", level: "undergraduate", atar: 58, duration: "3 years", description: "Commerce major options in accounting, HR and marketing." },
      { name: "Bachelor of Laws", code: "LLB", level: "undergraduate", atar: 80, duration: "4 years", description: "Accredited law degree with practical legal training pathway." },
      { name: "Juris Doctor", code: "JD", level: "postgraduate", atar: null, duration: "3 years", description: "Graduate-entry law qualification." },
      { name: "Master of Business Administration", code: "MBA", level: "postgraduate", atar: null, duration: "1.5 years", description: "Postgraduate leadership and strategy program." },
    ],
  },
  {
    faculty: "Education and Arts",
    searchUrl: "https://www.acu.edu.au/course-browser",
    entries: [
      { name: "Bachelor of Arts", code: "BA", level: "undergraduate", atar: 58, duration: "3 years", description: "Humanities and social sciences with flexible majors." },
      { name: "Bachelor of Global Studies", code: "BGS", level: "undergraduate", atar: 58, duration: "3 years", description: "International relations, politics and development studies." },
      { name: "Bachelor of Visual Arts and Design", code: "BVAD", level: "undergraduate", atar: 58, duration: "3 years", description: "Studio art, graphic design and creative practice." },
      { name: "Bachelor of Education (Primary)", code: "BEDP", level: "undergraduate", atar: 70, duration: "4 years", description: "Primary teacher education with school placements." },
      { name: "Bachelor of Education (Early Childhood and Primary)", code: "BEDECP", level: "undergraduate", atar: 70, duration: "4 years", description: "Birth-to-12 teacher preparation." },
      { name: "Bachelor of Teaching/Bachelor of Arts", code: "BTBA", level: "undergraduate", atar: 65, duration: "4 years", description: "Secondary teaching with an arts discipline base." },
      { name: "Master of Teaching (Primary)", code: "MTP", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry initial teacher education for primary settings." },
      { name: "Master of Teaching (Secondary)", code: "MTS", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry secondary teacher qualification." },
    ],
  },
  {
    faculty: "Health Sciences",
    searchUrl: "https://www.acu.edu.au/course-browser",
    entries: [
      { name: "Bachelor of Nursing", code: "BN", level: "undergraduate", atar: 58, duration: "3 years", description: "Registered nursing qualification with clinical placements." },
      { name: "Bachelor of Midwifery", code: "BMID", level: "undergraduate", atar: 58, duration: "3 years", description: "Midwifery qualification with continuity of care experiences." },
      { name: "Bachelor of Paramedicine", code: "BPARA", level: "undergraduate", atar: 58, duration: "3 years", description: "Paramedicine for pre-hospital emergency care." },
      { name: "Bachelor of Physiotherapy", code: "BPHYS", level: "undergraduate", atar: 70, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy degree with clinical education." },
      { name: "Bachelor of Occupational Therapy", code: "BOT", level: "undergraduate", atar: 58, duration: "4 years", description: "Occupational therapy with practice placements." },
      { name: "Bachelor of Exercise and Sports Science", code: "BEXSS", level: "undergraduate", atar: 58, duration: "3 years", description: "Exercise science, coaching and performance." },
      { name: "Bachelor of Psychological Science", code: "BPSYSC", level: "undergraduate", atar: 58, duration: "3 years", description: "Foundational psychology with honours pathway options." },
      { name: "Bachelor of Social Work", code: "BSW", level: "undergraduate", atar: 58, duration: "4 years", description: "Accredited social work degree." },
      { name: "Graduate Certificate in Public Health", code: "GCPH", level: "postgraduate", atar: null, duration: "0.5 years", description: "Public health fundamentals for graduates." },
      { name: "Master of Public Health", code: "MPH", level: "postgraduate", atar: null, duration: "1.5 years", description: "Population health and prevention-focused postgraduate study." },
    ],
  },
  {
    faculty: "Pathways",
    searchUrl: "https://www.acu.edu.au/study-at-acu/pathways",
    entries: [
      { name: "ACU Foundation Studies Program", code: "FOUND", level: "pathway", atar: null, duration: "1 year", description: "Transition pathway for students seeking entry into undergraduate study." },
      { name: "Diploma in Business", code: "DIPBUS", level: "diploma", atar: null, duration: "1 year", description: "Business diploma pathway into related bachelor degrees." },
    ],
  },
]);

const csuCourses = buildManualUniversityCourses("Charles Sturt University", "charles-sturt-university", [
  {
    faculty: "Business, Justice and Behavioural Sciences",
    searchUrl: "https://study.csu.edu.au/courses",
    entries: [
      { name: "Bachelor of Business Studies", code: "BBS", level: "undergraduate", atar: 60, duration: "3 years", description: "Business core with major options across management disciplines." },
      { name: "Bachelor of Accounting", code: "BACC", level: "undergraduate", atar: 60, duration: "3 years", description: "Professional accounting preparation." },
      { name: "Bachelor of Criminal Justice", code: "BCJ", level: "undergraduate", atar: 60, duration: "3 years", description: "Crime, justice systems and investigation." },
      { name: "Bachelor of Laws", code: "LLB", level: "undergraduate", atar: 75, duration: "4 years", description: "Accredited law degree." },
      { name: "Bachelor of Psychological Science", code: "BPSY", level: "undergraduate", atar: 60, duration: "3 years", description: "Psychology major sequence with honours pathway." },
      { name: "Master of Business Administration", code: "MBA", level: "postgraduate", atar: null, duration: "1.5 years", description: "MBA for leadership and enterprise management." },
      { name: "Master of Professional Accounting", code: "MPA", level: "postgraduate", atar: null, duration: "1.5 years", description: "CPA/CA aligned postgraduate accounting program." },
    ],
  },
  {
    faculty: "Arts and Education",
    searchUrl: "https://study.csu.edu.au/courses",
    entries: [
      { name: "Bachelor of Education (Primary)", code: "BEDP", level: "undergraduate", atar: 60, duration: "4 years", description: "Primary teacher education with rural placement options." },
      { name: "Bachelor of Education (K-12)", code: "BEDK12", level: "undergraduate", atar: 60, duration: "4 years", description: "Combined teaching across primary and secondary years." },
      { name: "Bachelor of Arts", code: "BA", level: "undergraduate", atar: 60, duration: "3 years", description: "Flexible humanities and social sciences degree." },
      { name: "Bachelor of Communication", code: "BCOMM", level: "undergraduate", atar: 60, duration: "3 years", description: "Journalism, digital media and strategic communication." },
      { name: "Bachelor of Social Work", code: "BSW", level: "undergraduate", atar: 65, duration: "4 years", description: "Accredited social work qualification." },
      { name: "Master of Teaching (Primary)", code: "MTP", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry primary teacher qualification." },
      { name: "Master of Social Work (Professional Qualifying)", code: "MSWQ", level: "postgraduate", atar: null, duration: "2 years", description: "Qualifying social work degree for graduates." },
    ],
  },
  {
    faculty: "Science and Health",
    searchUrl: "https://study.csu.edu.au/courses",
    entries: [
      { name: "Bachelor of Agricultural Science", code: "BAGSCI", level: "undergraduate", atar: 60, duration: "4 years", description: "Agronomy, animal science and agricultural systems." },
      { name: "Bachelor of Veterinary Biology/Bachelor of Veterinary Science", code: "BVB_BVS", level: "undergraduate", atar: 90, duration: "6 years", prerequisites: ["Chemistry"], description: "Veterinary science qualification." },
      { name: "Bachelor of Information Technology", code: "BIT", level: "undergraduate", atar: 60, duration: "3 years", description: "Software, networking and cyber security." },
      { name: "Bachelor of Nursing", code: "BN", level: "undergraduate", atar: 60, duration: "3 years", description: "Registered nursing degree." },
      { name: "Bachelor of Paramedicine", code: "BPARA", level: "undergraduate", atar: 60, duration: "3 years", description: "Pre-hospital and emergency health care." },
      { name: "Bachelor of Physiotherapy", code: "BPHYS", level: "undergraduate", atar: 70, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy with regional placement exposure." },
      { name: "Master of Nursing", code: "MNURS", level: "postgraduate", atar: null, duration: "1.5 years", description: "Advanced nursing practice and leadership." },
      { name: "Master of Information Technology", code: "MIT", level: "postgraduate", atar: null, duration: "2 years", description: "Postgraduate IT conversion and specialist study." },
    ],
  },
  {
    faculty: "Pathways",
    searchUrl: "https://study.csu.edu.au/pathways",
    entries: [
      { name: "Diploma of General Studies", code: "DIPGS", level: "diploma", atar: null, duration: "1 year", description: "Generalist diploma pathway into bachelor study." },
      { name: "University Preparation Program", code: "UPP", level: "pathway", atar: null, duration: "0.5 years", description: "Preparation pathway for entry into university study." },
    ],
  },
]);

const scuCourses = buildManualUniversityCourses("Southern Cross University", "southern-cross-university", [
  {
    faculty: "Business and Law",
    searchUrl: "https://www.scu.edu.au/study/courses/",
    entries: [
      { name: "Bachelor of Business", code: "BBUS", level: "undergraduate", atar: 60, duration: "3 years", description: "Business major streams including management and marketing." },
      { name: "Bachelor of Business and Enterprise", code: "BBE", level: "undergraduate", atar: 60, duration: "3 years", description: "Enterprise and startup-focused business degree." },
      { name: "Bachelor of Accounting", code: "BACC", level: "undergraduate", atar: 60, duration: "3 years", description: "Accounting and professional practice." },
      { name: "Bachelor of Laws", code: "LLB", level: "undergraduate", atar: 70, duration: "4 years", description: "Accredited law program." },
      { name: "Master of Business Administration", code: "MBA", level: "postgraduate", atar: null, duration: "2 years", description: "MBA with leadership and strategy focus." },
      { name: "Master of Professional Accounting", code: "MPA", level: "postgraduate", atar: null, duration: "2 years", description: "Postgraduate accounting conversion degree." },
    ],
  },
  {
    faculty: "Education and Humanities",
    searchUrl: "https://www.scu.edu.au/study/courses/",
    entries: [
      { name: "Bachelor of Education", code: "BED", level: "undergraduate", atar: 60, duration: "4 years", description: "Teacher education across early childhood, primary or secondary contexts." },
      { name: "Bachelor of Arts", code: "BA", level: "undergraduate", atar: 60, duration: "3 years", description: "Humanities and social sciences degree." },
      { name: "Bachelor of Social Work", code: "BSW", level: "undergraduate", atar: 60, duration: "4 years", description: "Accredited social work program." },
      { name: "Master of Teaching", code: "MTEACH", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry teacher qualification." },
      { name: "Master of Social Work (Professional Qualifying)", code: "MSWQ", level: "postgraduate", atar: null, duration: "2 years", description: "Professional qualifying social work degree." },
    ],
  },
  {
    faculty: "Health and Science",
    searchUrl: "https://www.scu.edu.au/study/courses/",
    entries: [
      { name: "Bachelor of Nursing", code: "BN", level: "undergraduate", atar: 60, duration: "3 years", description: "Registered nursing with placements." },
      { name: "Bachelor of Midwifery", code: "BMID", level: "undergraduate", atar: 60, duration: "3 years", description: "Midwifery program for contemporary maternity care." },
      { name: "Bachelor of Occupational Therapy", code: "BOT", level: "undergraduate", atar: 65, duration: "4 years", description: "Occupational therapy qualification." },
      { name: "Bachelor of Speech Pathology", code: "BSP", level: "undergraduate", atar: 65, duration: "4 years", description: "Speech pathology degree." },
      { name: "Bachelor of Psychological Science", code: "BPSYSC", level: "undergraduate", atar: 60, duration: "3 years", description: "Psychological science sequence." },
      { name: "Bachelor of Biomedical Science", code: "BBIOMED", level: "undergraduate", atar: 60, duration: "3 years", prerequisites: ["Chemistry"], description: "Biomedical science and lab-focused study." },
      { name: "Bachelor of Science", code: "BSC", level: "undergraduate", atar: 60, duration: "3 years", description: "Environmental, marine and general science study." },
      { name: "Bachelor of Information Technology", code: "BIT", level: "undergraduate", atar: 60, duration: "3 years", description: "Programming, networks and cyber security fundamentals." },
      { name: "Master of Public Health", code: "MPH", level: "postgraduate", atar: null, duration: "2 years", description: "Public health systems and prevention." },
      { name: "Master of Clinical Exercise Physiology", code: "MCEP", level: "postgraduate", atar: null, duration: "1.5 years", description: "Clinical exercise physiology postgraduate pathway." },
    ],
  },
  {
    faculty: "Pathways",
    searchUrl: "https://www.scu.edu.au/pathways/",
    entries: [
      { name: "University Preparation Program", code: "UPP", level: "pathway", atar: null, duration: "0.5 years", description: "Preparation course for students seeking university admission." },
      { name: "Diploma of Health", code: "DIPH", level: "diploma", atar: null, duration: "1 year", description: "Health diploma pathway into related bachelor degrees." },
    ],
  },
]);

const uneCourses = buildManualUniversityCourses("University of New England", "university-of-new-england", [
  {
    faculty: "Humanities, Arts, Social Sciences and Education",
    searchUrl: "https://www.une.edu.au/study/courses",
    entries: [
      { name: "Bachelor of Arts", code: "BA", level: "undergraduate", atar: 60, duration: "3 years", description: "Humanities and social science majors across UNE." },
      { name: "Bachelor of Education (Primary)", code: "BEDP", level: "undergraduate", atar: 60, duration: "4 years", description: "Primary teaching degree." },
      { name: "Bachelor of Education (Secondary)", code: "BEDS", level: "undergraduate", atar: 60, duration: "4 years", description: "Secondary teacher education." },
      { name: "Bachelor of Social Work", code: "BSW", level: "undergraduate", atar: 60, duration: "4 years", description: "Accredited social work qualification." },
      { name: "Bachelor of Criminology", code: "BCRIM", level: "undergraduate", atar: 60, duration: "3 years", description: "Criminology and justice systems." },
      { name: "Master of Teaching", code: "MTEACH", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry teaching degree." },
      { name: "Master of Social Work (Professional Qualifying)", code: "MSWQ", level: "postgraduate", atar: null, duration: "2 years", description: "Postgraduate social work qualification." },
    ],
  },
  {
    faculty: "Business and Law",
    searchUrl: "https://www.une.edu.au/study/courses",
    entries: [
      { name: "Bachelor of Business", code: "BBUS", level: "undergraduate", atar: 60, duration: "3 years", description: "Business degree with management, HR and marketing options." },
      { name: "Bachelor of Accounting", code: "BACC", level: "undergraduate", atar: 60, duration: "3 years", description: "Professional accounting." },
      { name: "Bachelor of Laws", code: "LLB", level: "undergraduate", atar: 75, duration: "4 years", description: "Accredited law degree." },
      { name: "Bachelor of Economics", code: "BECON", level: "undergraduate", atar: 60, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Economics with quantitative analysis." },
      { name: "Master of Business Administration", code: "MBA", level: "postgraduate", atar: null, duration: "2 years", description: "MBA with regional and global management perspectives." },
      { name: "Master of Professional Accounting", code: "MPA", level: "postgraduate", atar: null, duration: "2 years", description: "Accounting conversion program." },
    ],
  },
  {
    faculty: "Science, Agriculture and Technology",
    searchUrl: "https://www.une.edu.au/study/courses",
    entries: [
      { name: "Bachelor of Agriculture", code: "BAG", level: "undergraduate", atar: 60, duration: "3 years", description: "Agricultural systems, agronomy and livestock." },
      { name: "Bachelor of Environmental Science", code: "BENVSC", level: "undergraduate", atar: 60, duration: "3 years", description: "Environmental management and sustainability." },
      { name: "Bachelor of Science", code: "BSC", level: "undergraduate", atar: 60, duration: "3 years", description: "General science across physical and biological disciplines." },
      { name: "Bachelor of Computer Science", code: "BCS", level: "undergraduate", atar: 60, duration: "3 years", description: "Computer science and software development." },
      { name: "Bachelor of Information Technology", code: "BIT", level: "undergraduate", atar: 60, duration: "3 years", description: "Applied IT and networking." },
      { name: "Master of Information Technology", code: "MIT", level: "postgraduate", atar: null, duration: "2 years", description: "Postgraduate IT specialist program." },
      { name: "Master of Environmental Science", code: "MENVSC", level: "postgraduate", atar: null, duration: "2 years", description: "Advanced environmental science study." },
    ],
  },
  {
    faculty: "Health",
    searchUrl: "https://www.une.edu.au/study/courses",
    entries: [
      { name: "Bachelor of Nursing", code: "BN", level: "undergraduate", atar: 60, duration: "3 years", description: "Registered nursing program." },
      { name: "Bachelor of Psychological Science", code: "BPSYSC", level: "undergraduate", atar: 60, duration: "3 years", description: "Psychology major sequence." },
      { name: "Bachelor of Biomedical Science", code: "BBIOMED", level: "undergraduate", atar: 60, duration: "3 years", prerequisites: ["Chemistry"], description: "Biomedical science foundations." },
      { name: "Master of Public Health", code: "MPH", level: "postgraduate", atar: null, duration: "1.5 years", description: "Population health and health policy." },
    ],
  },
  {
    faculty: "Pathways",
    searchUrl: "https://www.une.edu.au/study/pathways",
    entries: [
      { name: "Pathways Enabling Course", code: "PEC", level: "pathway", atar: null, duration: "0.5 years", description: "UNE enabling pathway for undergraduate entry." },
      { name: "Diploma in Science", code: "DIPSC", level: "diploma", atar: null, duration: "1 year", description: "Science pathway diploma into bachelor study." },
    ],
  },
]);

const wsuCourses = buildManualUniversityCourses("Western Sydney University", "western-sydney-university", [
  {
    faculty: "Business",
    searchUrl: "https://www.westernsydney.edu.au/future/study/courses",
    entries: [
      { name: "Bachelor of Business", code: "BBUS", level: "undergraduate", atar: 60, duration: "3 years", description: "Flexible business degree with major options." },
      { name: "Bachelor of Accounting", code: "BACC", level: "undergraduate", atar: 60, duration: "3 years", description: "Accounting and professional accreditation pathway." },
      { name: "Bachelor of Economics", code: "BECON", level: "undergraduate", atar: 60, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Economics and applied quantitative analysis." },
      { name: "Bachelor of International Business", code: "BIB", level: "undergraduate", atar: 60, duration: "3 years", description: "Global business strategy and trade." },
      { name: "Master of Business Administration", code: "MBA", level: "postgraduate", atar: null, duration: "1.5 years", description: "MBA for management and strategy." },
      { name: "Master of Professional Accounting", code: "MPA", level: "postgraduate", atar: null, duration: "2 years", description: "Accounting conversion and professional preparation." },
    ],
  },
  {
    faculty: "Engineering, Design and Built Environment",
    searchUrl: "https://www.westernsydney.edu.au/future/study/courses",
    entries: [
      { name: "Bachelor of Engineering", code: "BENG", level: "undergraduate", atar: 65, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering with civil, electrical, robotics and other specialisations." },
      { name: "Bachelor of Computer Science", code: "BCS", level: "undergraduate", atar: 60, duration: "3 years", description: "Software development, AI and security." },
      { name: "Bachelor of Information and Communications Technology", code: "BICT", level: "undergraduate", atar: 60, duration: "3 years", description: "ICT infrastructure, networks and systems." },
      { name: "Bachelor of Construction Management", code: "BCM", level: "undergraduate", atar: 60, duration: "4 years", description: "Construction and project management." },
      { name: "Bachelor of Design", code: "BDES", level: "undergraduate", atar: 60, duration: "3 years", description: "Visual communication, industrial and digital design." },
      { name: "Master of Information and Communications Technology", code: "MICT", level: "postgraduate", atar: null, duration: "2 years", description: "Advanced ICT postgraduate study." },
      { name: "Master of Engineering", code: "MENG", level: "postgraduate", atar: null, duration: "2 years", description: "Postgraduate engineering specialisation." },
    ],
  },
  {
    faculty: "Health",
    searchUrl: "https://www.westernsydney.edu.au/future/study/courses",
    entries: [
      { name: "Bachelor of Nursing", code: "BN", level: "undergraduate", atar: 60, duration: "3 years", description: "Registered nursing qualification." },
      { name: "Bachelor of Midwifery", code: "BMID", level: "undergraduate", atar: 60, duration: "3 years", description: "Midwifery degree." },
      { name: "Bachelor of Paramedicine", code: "BPARA", level: "undergraduate", atar: 65, duration: "3 years", description: "Paramedicine and emergency health care." },
      { name: "Bachelor of Physiotherapy", code: "BPHYS", level: "undergraduate", atar: 75, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy with clinical placements." },
      { name: "Bachelor of Occupational Therapy", code: "BOT", level: "undergraduate", atar: 70, duration: "4 years", description: "Occupational therapy degree." },
      { name: "Bachelor of Podiatric Medicine", code: "BPOD", level: "undergraduate", atar: 65, duration: "4 years", description: "Podiatric medicine qualification." },
      { name: "Bachelor of Medical Science", code: "BMEDSC", level: "undergraduate", atar: 60, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical science pathway." },
      { name: "Bachelor of Public Health", code: "BPH", level: "undergraduate", atar: 60, duration: "3 years", description: "Public health systems and health promotion." },
      { name: "Bachelor of Social Work", code: "BSW", level: "undergraduate", atar: 65, duration: "4 years", description: "Accredited social work degree." },
      { name: "Bachelor of Psychology", code: "BPSY", level: "undergraduate", atar: 70, duration: "4 years", description: "Psychology with honours sequence." },
      { name: "Master of Public Health", code: "MPH", level: "postgraduate", atar: null, duration: "1.5 years", description: "Public health policy and systems." },
      { name: "Master of Health Science", code: "MHS", level: "postgraduate", atar: null, duration: "1.5 years", description: "Postgraduate health specialisation." },
    ],
  },
  {
    faculty: "Law, Humanities and Education",
    searchUrl: "https://www.westernsydney.edu.au/future/study/courses",
    entries: [
      { name: "Bachelor of Arts", code: "BA", level: "undergraduate", atar: 60, duration: "3 years", description: "Humanities, languages and social sciences." },
      { name: "Bachelor of Laws", code: "LLB", level: "undergraduate", atar: 80, duration: "4 years", description: "Professional law degree." },
      { name: "Bachelor of Criminology and Criminal Justice", code: "BCCJ", level: "undergraduate", atar: 60, duration: "3 years", description: "Criminology and criminal justice systems." },
      { name: "Bachelor of Education (Primary)", code: "BEDP", level: "undergraduate", atar: 60, duration: "4 years", description: "Primary teaching qualification." },
      { name: "Bachelor of Education (Secondary)", code: "BEDS", level: "undergraduate", atar: 60, duration: "4 years", description: "Secondary teaching qualification." },
      { name: "Master of Teaching", code: "MTEACH", level: "postgraduate", atar: null, duration: "2 years", description: "Graduate-entry teaching qualification." },
      { name: "Juris Doctor", code: "JD", level: "postgraduate", atar: null, duration: "3 years", description: "Graduate-entry law degree." },
    ],
  },
  {
    faculty: "Pathways",
    searchUrl: "https://www.westernsydney.edu.au/future/study/application-pathways/the-college",
    entries: [
      { name: "Diploma in Business", code: "DIPBUS", level: "diploma", atar: null, duration: "1 year", description: "WSU College pathway into business bachelor degrees." },
      { name: "Diploma in Information and Communications Technology", code: "DIPICT", level: "diploma", atar: null, duration: "1 year", description: "College diploma pathway into computing and IT study." },
      { name: "Foundation Studies", code: "FOUND", level: "pathway", atar: null, duration: "1 year", description: "University preparation pathway through The College." },
    ],
  },
]);

export const allNswCourses: CourseRecord[] = [
  ...normalizeCourses(macquarieCoursesJson),
  ...normalizeCourses(newcastleCoursesJson),
  ...normalizeCourses(sydneyCoursesJson),
  ...normalizeCourses(uowCoursesJson),
  ...normalizeCourses(unswCoursesJson),
  ...normalizeCourses(utsCoursesJson),
  ...acuCourses,
  ...csuCourses,
  ...scuCourses,
  ...uneCourses,
  ...wsuCourses,
].sort((a, b) =>
  a.university.localeCompare(b.university) ||
  a.faculty.localeCompare(b.faculty) ||
  a.courseName.localeCompare(b.courseName)
);
