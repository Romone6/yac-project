import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/macquarie-university");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Faculty of Arts": [
    { name: "Bachelor of Arts", code: "BA", atar: 72, duration: "3 years", prerequisites: [], description: "History, Philosophy, Politics, English, Sociology, Languages." },
    { name: "Bachelor of Arts / Bachelor of Commerce", code: "BA_BCom", atar: 80, duration: "4 years", prerequisites: [], description: "Arts + Commerce double." },
    { name: "Bachelor of Acting", code: "BA_Act", atar: 70, duration: "3 years", prerequisites: [], description: "Performance, theatre practice." },
    { name: "Bachelor of Creative Writing", code: "BA_CW", atar: 72, duration: "3 years", prerequisites: [], description: "Fiction, scriptwriting, poetry." },
    { name: "Bachelor of International Studies", code: "BIntSt", atar: 75, duration: "3 years", prerequisites: [], description: "International relations, languages." },
    { name: "Bachelor of Media and Communications", code: "BMC", atar: 75, duration: "3 years", prerequisites: [], description: "Journalism, PR, media production." },
    { name: "Bachelor of Security Studies", code: "BSecSt", atar: 72, duration: "3 years", prerequisites: [], description: "International security, terrorism studies." },
  ],
  "Faculty of Business": [
    { name: "Bachelor of Commerce", code: "BCom", atar: 78, duration: "3 years", prerequisites: [], description: "Accounting, Economics, Finance, Marketing, Management." },
    { name: "Bachelor of Commerce / Bachelor of Arts", code: "BCom_BA", atar: 80, duration: "4 years", prerequisites: [], description: "Commerce + Arts." },
    { name: "Bachelor of Commerce / Bachelor of Economics", code: "BCom_BEcon", atar: 82, duration: "4 years", prerequisites: [], description: "Commerce + Economics." },
    { name: "Bachelor of Commerce / Bachelor of Science", code: "BCom_BSc", atar: 82, duration: "4 years", prerequisites: [], description: "Commerce + Science." },
    { name: "Bachelor of Accounting", code: "BAcc", atar: 75, duration: "3 years", prerequisites: [], description: "Professional accounting, CPA." },
    { name: "Bachelor of Economics", code: "BEcon", atar: 78, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Economics, econometrics." },
    { name: "Bachelor of Finance", code: "BFin", atar: 80, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Finance, investment." },
    { name: "Bachelor of Actuarial Studies", code: "BAct", atar: 90, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Actuarial science. Mathematics extension required." },
    { name: "Bachelor of Business Analytics", code: "BBA", atar: 78, duration: "3 years", prerequisites: [], description: "Data analytics, business intelligence." },
    { name: "Bachelor of Marketing", code: "BMkt", atar: 75, duration: "3 years", prerequisites: [], description: "Digital marketing, branding." },
    { name: "Bachelor of Human Resource Management", code: "BHRM", atar: 73, duration: "3 years", prerequisites: [], description: "HR, organisational behaviour." },
  ],
  "Faculty of Science": [
    { name: "Bachelor of Science", code: "BSc", atar: 75, duration: "3 years", prerequisites: [], description: "Biology, Chemistry, Physics, Mathematics, Psychology, Geology." },
    { name: "Bachelor of Science / Bachelor of Arts", code: "BSc_BA", atar: 80, duration: "4 years", prerequisites: [], description: "Science + Arts." },
    { name: "Bachelor of Arts / Bachelor of Science", code: "BA_BSc", atar: 80, duration: "4 years", prerequisites: [], description: "Arts + Science." },
    { name: "Bachelor of Mathematics", code: "BMath", atar: 80, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Pure, applied, statistics." },
    { name: "Bachelor of Psychology", code: "BPsych", atar: 80, duration: "3 years", prerequisites: [], description: "Psychology, behaviour." },
    { name: "Bachelor of Biomedical Science", code: "BBiomedSc", atar: 80, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical science research." },
    { name: "Bachelor of Biotechnology", code: "BBiotech", atar: 78, duration: "3 years", prerequisites: ["Chemistry"], description: "Biochemistry, genetics." },
    { name: "Bachelor of Marine Biology", code: "BMarBio", atar: 80, duration: "3 years", prerequisites: [], description: "Marine ecosystems." },
    { name: "Bachelor of Neuroscience", code: "BNeuro", atar: 85, duration: "3 years", prerequisites: ["Chemistry"], description: "Brain science." },
    { name: "Bachelor of Environmental Science", code: "BEnvSc", atar: 75, duration: "3 years", prerequisites: [], description: "Sustainability, ecology." },
    { name: "Bachelor of Gaming and Simulation", code: "BGS", atar: 75, duration: "3 years", prerequisites: [], description: "Game design, simulation." },
  ],
  "Faculty of Medicine, Health and Human Sciences": [
    { name: "Bachelor of Medicine / Doctor of Medicine", code: "MD", atar: 99, duration: "4 years", prerequisites: ["Chemistry"], description: "Graduate medical degree. Interview + CASPer." },
    { name: "Bachelor of Nursing", code: "BN", atar: 65, duration: "3 years", prerequisites: [], description: "Registered nurse. Clinical placements." },
    { name: "Bachelor of Midwifery", code: "BMid", atar: 70, duration: "3 years", prerequisites: [], description: "Midwifery, labour support." },
    { name: "Bachelor of Physiotherapy", code: "BPhysio", atar: 90, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy. Competitive." },
    { name: "Bachelor of Occupational Therapy", code: "BOccThy", atar: 85, duration: "4 years", prerequisites: [], description: "Occupational therapy." },
    { name: "Bachelor of Speech Pathology", code: "BSpPath", atar: 85, duration: "4 years", prerequisites: [], description: "Speech pathology." },
    { name: "Bachelor of Psychology", code: "BPsych", atar: 82, duration: "4 years", prerequisites: [], description: "APAC accredited psychology." },
    { name: "Bachelor of Public Health", code: "BPH", atar: 72, duration: "3 years", prerequisites: [], description: "Public health, health promotion." },
    { name: "Bachelor of Exercise and Sport Science", code: "BESS", atar: 72, duration: "3 years", prerequisites: [], description: "Exercise science, sport." },
    { name: "Bachelor of Clinical Exercise Physiology", code: "BCEP", atar: 75, duration: "4 years", prerequisites: [], description: "Exercise rehabilitation." },
    { name: "Bachelor of Paramedicine", code: "BPara", atar: 80, duration: "3 years", prerequisites: [], description: "Paramedic, emergency care." },
  ],
  "Faculty of Law": [
    { name: "Bachelor of Laws (LLB)", code: "LLB", atar: 92, duration: "4 years", prerequisites: [], description: "Professional law degree." },
    { name: "Bachelor of Laws / Bachelor of Arts", code: "LLB_BA", atar: 92, duration: "5 years", prerequisites: [], description: "Law + Arts." },
    { name: "Bachelor of Laws / Bachelor of Commerce", code: "LLB_BCom", atar: 92, duration: "5 years", prerequisites: [], description: "Law + Commerce." },
    { name: "Bachelor of Laws / Bachelor of Science", code: "LLB_BSc", atar: 92, duration: "5 years", prerequisites: [], description: "Law + Science." },
    { name: "Bachelor of Laws / Bachelor of Psychology", code: "LLB_BPsych", atar: 92, duration: "5 years", prerequisites: [], description: "Law + Psychology." },
    { name: "Juris Doctor", code: "JD", atar: null, duration: "3 years", prerequisites: [], description: "Graduate law degree." },
  ],
  "Faculty of Education": [
    { name: "Bachelor of Early Childhood Education", code: "BECE", atar: 70, duration: "4 years", prerequisites: [], description: "Early childhood teaching." },
    { name: "Bachelor of Primary Education", code: "BPEd", atar: 72, duration: "4 years", prerequisites: [], description: "Primary teaching." },
    { name: "Bachelor of Secondary Education", code: "BSEd", atar: 72, duration: "4 years", prerequisites: [], description: "Secondary teaching." },
    { name: "Bachelor of Education / Bachelor of Arts", code: "BEd_BA", atar: 75, duration: "4 years", prerequisites: [], description: "Education + Arts." },
    { name: "Bachelor of Education / Bachelor of Commerce", code: "BEd_BCom", atar: 75, duration: "4 years", prerequisites: [], description: "Education + Commerce." },
  ],
  "Macquarie Business School": [
    { name: "Master of Accounting", code: "MAcc", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate accounting." },
    { name: "Master of Commerce", code: "MCom", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate commerce." },
    { name: "Master of Finance", code: "MFin", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate finance." },
    { name: "Master of Marketing", code: "MMkt", atar: null, duration: "1 year", prerequisites: [], description: "Graduate marketing." },
  ],
};

function generateMacquarieCourses() {
  console.log("🔍 Generating Macquarie courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `mq-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "Macquarie University",
        universitySlug: "macquarie-university",
        state: "NSW",
        faculty: faculty,
        courseName: course.name,
        courseCode: course.code,
        level: course.code.startsWith("M") ? "postgraduate" : "undergraduate",
        description: course.description,
        duration: course.duration || "",
        atar: course.atar,
        prerequisites: course.prerequisites || [],
        assumedKnowledge: [],
        recommendedSubjects: [],
        secondarySubjects: [],
        careerOutcomes: [],
        officialUrl: `https://www.mq.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ Macquarie: ${courses.length} courses saved`);
  return courses;
}

generateMacquarieCourses();
