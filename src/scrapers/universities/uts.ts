import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/uts");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Faculty of Business": [
    { name: "Bachelor of Business", code: "BBus", atar: 78, duration: "3 years", prerequisites: [], description: "Accounting, Finance, Management, Marketing, Tourism, Events." },
    { name: "Bachelor of Business / Bachelor of Laws", code: "BBus_LLB", atar: 95, duration: "5 years", prerequisites: [], description: "Combined Business/Law." },
    { name: "Bachelor of Accounting", code: "BAcc", atar: 80, duration: "3 years", prerequisites: [], description: "CPA-ready accounting professional." },
    { name: "Bachelor of Finance", code: "BFin", atar: 85, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Corporate finance, investment, banking." },
    { name: "Bachelor of Management", code: "BMgt", atar: 78, duration: "3 years", prerequisites: [], description: "Management, organisational behaviour." },
    { name: "Bachelor of Marketing", code: "BMkt", atar: 78, duration: "3 years", prerequisites: [], description: "Digital marketing, brand management." },
    { name: "Bachelor of Tourism and Events Management", code: "BTEM", atar: 75, duration: "3 years", prerequisites: [], description: "Tourism, event planning, hospitality." },
  ],
  "Faculty of Design, Architecture and Building": [
    { name: "Bachelor of Design in Architecture", code: "BDesArch", atar: 80, duration: "4 years", prerequisites: [], description: "Architectural design, technology." },
    { name: "Bachelor of Design", code: "BDes", atar: 78, duration: "3 years", prerequisites: [], description: "Visual communication, interior design, UX." },
    { name: "Bachelor of Construction Project Management", code: "BCPM", atar: 80, duration: "4 years", prerequisites: [], description: "Construction management, project planning." },
    { name: "Bachelor of Architecture", code: "BArch", atar: 85, duration: "3 years", prerequisites: [], description: "Professional architecture, design studios." },
    { name: "Bachelor of Landscape Architecture", code: "BLArch", atar: 80, duration: "3 years", prerequisites: [], description: "Landscape design, environmental planning." },
    { name: "Bachelor of Property Economics", code: "BPropEc", atar: 78, duration: "3 years", prerequisites: [], description: "Property, valuation, development." },
  ],
  "Faculty of Engineering": [
    { name: "Bachelor of Engineering (Honours)", code: "BEng", atar: 85, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Civil, Mechanical, Electrical, Software, Data, Chemical, Biomedical." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Business", code: "BEng_BBus", atar: 88, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Business." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Science", code: "BEng_BSc", atar: 88, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Science." },
    { name: "Bachelor of Software Engineering", code: "BSE", atar: 85, duration: "4 years", prerequisites: ["Mathematics Advanced"], description: "Software development, systems." },
    { name: "Bachelor of Biomedical Engineering", code: "BBiomedE", atar: 88, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics", "Chemistry"], description: "Medical devices, biomechanics." },
  ],
  "Faculty of Science": [
    { name: "Bachelor of Science", code: "BSc", atar: 78, duration: "3 years", prerequisites: [], description: "Chemistry, Physics, Biology, Mathematics, Environmental, Psychology." },
    { name: "Bachelor of Science (Honours)", code: "BSc_H", atar: 88, duration: "4 years", prerequisites: [], description: "Research-intensive science." },
    { name: "Bachelor of Mathematics", code: "BMath", atar: 82, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Pure, applied, statistics." },
    { name: "Bachelor of Biomedical Science", code: "BBiomedSc", atar: 82, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical science, research pathway." },
    { name: "Bachelor of Biotechnology", code: "BBiotech", atar: 80, duration: "3 years", prerequisites: ["Chemistry"], description: "Biochemistry, genetics, biotech." },
    { name: "Bachelor of Psychology", code: "BPsych", atar: 82, duration: "3 years", prerequisites: [], description: "Psychology, behaviour." },
    { name: "Bachelor of Environmental Science", code: "BEnvSc", atar: 78, duration: "3 years", prerequisites: [], description: "Sustainability, ecology." },
    { name: "Bachelor of Forensic Science", code: "BForens", atar: 80, duration: "3 years", prerequisites: ["Chemistry"], description: "Forensic analysis, toxicology." },
  ],
  "Faculty of Health": [
    { name: "Bachelor of Nursing", code: "BN", atar: 70, duration: "3 years", prerequisites: [], description: "Registered nurse. Clinical placements." },
    { name: "Bachelor of Sport and Exercise Science", code: "BSE", atar: 75, duration: "3 years", prerequisites: [], description: "Exercise, sport science." },
    { name: "Bachelor of Physiotherapy", code: "BPhysio", atar: 92, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy, rehabilitation." },
    { name: "Bachelor of Occupational Therapy", code: "BOccThy", atar: 88, duration: "4 years", prerequisites: [], description: "Occupational therapy, rehab." },
    { name: "Bachelor of Pharmacy", code: "BPharm", atar: 82, duration: "4 years", prerequisites: ["Chemistry"], description: "Pharmacy, clinical practice." },
    { name: "Bachelor of Nutrition and Dietetics", code: "BND", atar: 85, duration: "4 years", prerequisites: ["Chemistry"], description: "Dietetics, nutrition." },
    { name: "Bachelor of Medical Science", code: "BMedSc", atar: 80, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical research." },
  ],
  "Faculty of Law": [
    { name: "Bachelor of Laws (Honours)", code: "LLB", atar: 95, duration: "4 years", prerequisites: [], description: "Professional law degree." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Business", code: "LLB_BBus", atar: 95, duration: "5 years", prerequisites: [], description: "Combined Law/Business." },
    { name: "Bachelor of Legal Studies", code: "BLS", atar: 75, duration: "3 years", prerequisites: [], description: "Legal studies, paralegal." },
  ],
  "Faculty of Arts and Social Sciences": [
    { name: "Bachelor of Arts", code: "BA", atar: 75, duration: "3 years", prerequisites: [], description: "Communication, International Studies, Languages, Creative Writing." },
    { name: "Bachelor of Communication", code: "BComm", atar: 78, duration: "3 years", prerequisites: [], description: "Journalism, PR, Media." },
    { name: "Bachelor of International Studies", code: "BIntSt", atar: 80, duration: "3 years", prerequisites: [], description: "International relations, languages." },
    { name: "Bachelor of Social Science", code: "BScSc", atar: 75, duration: "3 years", prerequisites: [], description: "Sociology, social policy." },
    { name: "Bachelor of Education (Primary)", code: "BEd_P", atar: 78, duration: "4 years", prerequisites: [], description: "Primary teaching." },
    { name: "Bachelor of Education (Secondary)", code: "BEd_S", atar: 78, duration: "4 years", prerequisites: [], description: "Secondary teaching." },
  ],
  "University Graduate School of Business": [
    { name: "Master of Professional Accounting", code: "MPA", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate accounting. CPA pathway." },
    { name: "Master of Human Resource Management", code: "MHRM", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate HR." },
    { name: "Master of Marketing", code: "MMkt", atar: null, duration: "1.5 years", prerequisites: [], description: "Graduate marketing." },
    { name: "Master of Business Analytics", code: "MBA_BA", atar: null, duration: "1.5 years", prerequisites: [], description: "Data-driven business." },
  ],
};

function generateUTSCourses() {
  console.log("🔍 Generating UTS courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `uts-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "University of Technology Sydney",
        universitySlug: "uts",
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
        officialUrl: `https://www.uts.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ UTS: ${courses.length} courses saved`);
  return courses;
}

generateUTSCourses();
