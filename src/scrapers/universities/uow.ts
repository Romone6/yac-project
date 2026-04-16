import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/university-of-wollongong");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Faculty of Business": [
    { name: "Bachelor of Business", code: "BBus", atar: 70, duration: "3 years", prerequisites: [], description: "Business, Management, Marketing, Tourism, HR." },
    { name: "Bachelor of Commerce", code: "BCom", atar: 75, duration: "3 years", prerequisites: [], description: "Accounting, Economics, Finance." },
    { name: "Bachelor of Accounting", code: "BAcc", atar: 72, duration: "3 years", prerequisites: [], description: "Professional accounting." },
    { name: "Bachelor of Business Information Systems", code: "BBIS", atar: 75, duration: "3 years", prerequisites: [], description: "Business + IT." },
    { name: "Bachelor of Marketing", code: "BMkt", atar: 70, duration: "3 years", prerequisites: [], description: "Marketing, digital media." },
    { name: "Bachelor of Tourism Management", code: "BTM", atar: 68, duration: "3 years", prerequisites: [], description: "Tourism, hospitality." },
    { name: "Bachelor of Economics", code: "BEcon", atar: 78, duration: "3 years", prerequisites: [], description: "Economics, policy." },
    { name: "Bachelor of Finance", code: "BFin", atar: 78, duration: "3 years", prerequisites: [], description: "Finance, investment." },
  ],
  "Faculty of Engineering and Information Sciences": [
    { name: "Bachelor of Engineering (Honours)", code: "BEng", atar: 80, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Civil, Mechanical, Electrical, Computer, Materials, Mining, Environmental." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Science", code: "BEng_BSc", atar: 82, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Science." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Commerce", code: "BEng_BCom", atar: 82, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Business." },
    { name: "Bachelor of Computer Science", code: "BCS", atar: 78, duration: "3 years", prerequisites: [], description: "Software, AI, security." },
    { name: "Bachelor of Information Technology", code: "BIT", atar: 70, duration: "3 years", prerequisites: [], description: "IT, networking." },
    { name: "Bachelor of Mathematics", code: "BMath", atar: 78, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Maths, statistics." },
    { name: "Bachelor of Physics", code: "BPhys", atar: 80, duration: "3 years", prerequisites: ["Physics"], description: "Physics, research." },
    { name: "Bachelor of Chemistry", code: "BChem", atar: 78, duration: "3 years", prerequisites: ["Chemistry"], description: "Chemistry, analysis." },
  ],
  "Faculty of Law, Humanities and Arts": [
    { name: "Bachelor of Laws (Honours)", code: "LLB", atar: 88, duration: "4 years", prerequisites: [], description: "Professional law." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Commerce", code: "LLB_BCom", atar: 90, duration: "5 years", prerequisites: [], description: "Law + Commerce." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Arts", code: "LLB_BA", atar: 90, duration: "5 years", prerequisites: [], description: "Law + Arts." },
    { name: "Bachelor of Arts", code: "BA", atar: 65, duration: "3 years", prerequisites: [], description: "Humanities, history, politics, media." },
    { name: "Bachelor of Communication and Media", code: "BCM", atar: 68, duration: "3 years", prerequisites: [], description: "Journalism, PR, media." },
    { name: "Bachelor of International Studies", code: "BIntSt", atar: 70, duration: "3 years", prerequisites: [], description: "International relations." },
    { name: "Bachelor of Creative Arts", code: "BCA", atar: 65, duration: "3 years", prerequisites: [], description: "Visual arts, music, theatre." },
    { name: "Bachelor of Education (Primary)", code: "BEd_P", atar: 70, duration: "4 years", prerequisites: [], description: "Primary teaching." },
    { name: "Bachelor of Education (Secondary)", code: "BEd_S", atar: 70, duration: "4 years", prerequisites: [], description: "Secondary teaching." },
    { name: "Bachelor of Social Work", code: "BSW", atar: 70, duration: "4 years", prerequisites: [], description: "Social work." },
  ],
  "Faculty of Science, Medicine and Health": [
    { name: "Bachelor of Science", code: "BSc", atar: 70, duration: "3 years", prerequisites: [], description: "Biology, Chemistry, Physics, Environmental, Psychology." },
    { name: "Bachelor of Science (Honours)", code: "BSc_H", atar: 85, duration: "4 years", prerequisites: [], description: "Research-intensive." },
    { name: "Bachelor of Medical Science", code: "BMedSc", atar: 78, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical research." },
    { name: "Bachelor of Biotechnology", code: "BBiotech", atar: 75, duration: "3 years", prerequisites: ["Chemistry"], description: "Biochemistry." },
    { name: "Bachelor of Marine Science", code: "BMarSc", atar: 78, duration: "3 years", prerequisites: [], description: "Marine biology, oceanography." },
    { name: "Bachelor of Environmental Science", code: "BEnvSc", atar: 72, duration: "3 years", prerequisites: [], description: "Sustainability." },
    { name: "Bachelor of Psychology (Honours)", code: "BPsych", atar: 82, duration: "4 years", prerequisites: [], description: "APAC accredited." },
    { name: "Bachelor of Nursing", code: "BN", atar: 65, duration: "3 years", prerequisites: [], description: "Registered nurse." },
    { name: "Bachelor of Nursing / Bachelor of Business", code: "BN_BBus", atar: 68, duration: "4 years", prerequisites: [], description: "Nursing + Business." },
    { name: "Bachelor of Physiotherapy", code: "BPhysio", atar: 90, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy." },
    { name: "Bachelor of Occupational Therapy", code: "BOccThy", atar: 82, duration: "4 years", prerequisites: [], description: "Occupational therapy." },
    { name: "Bachelor of Exercise Science", code: "BExSc", atar: 70, duration: "3 years", prerequisites: [], description: "Exercise, sport." },
    { name: "Bachelor of Nutrition and Dietetics", code: "BND", atar: 82, duration: "4 years", prerequisites: ["Chemistry"], description: "Dietetics." },
    { name: "Bachelor of Podiatry", code: "BPod", atar: 85, duration: "4 years", prerequisites: [], description: "Podiatry." },
    { name: "Bachelor of Oral Health", code: "BOH", atar: 78, duration: "3 years", prerequisites: [], description: "Dental hygiene." },
  ],
  "UOW College": [
    { name: "Diploma of Engineering", code: "DipEng", atar: 60, duration: "1 year", prerequisites: [], description: "Pathway to Engineering." },
    { name: "Diploma of Science", code: "DipSc", atar: 60, duration: "1 year", prerequisites: [], description: "Pathway to Science." },
    { name: "Diploma of Business", code: "DipBus", atar: 60, duration: "1 year", prerequisites: [], description: "Pathway to Business." },
  ],
};

function generateUOWCourses() {
  console.log("🔍 Generating UOW courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `uow-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "University of Wollongong",
        universitySlug: "university-of-wollongong",
        state: "NSW",
        faculty: faculty,
        courseName: course.name,
        courseCode: course.code,
        level: course.code.startsWith("Dip") ? "diploma" : course.code.startsWith("M") ? "postgraduate" : "undergraduate",
        description: course.description,
        duration: course.duration || "",
        atar: course.atar,
        prerequisites: course.prerequisites || [],
        assumedKnowledge: [],
        recommendedSubjects: [],
        secondarySubjects: [],
        careerOutcomes: [],
        officialUrl: `https://www.uow.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ UOW: ${courses.length} courses saved`);
  return courses;
}

generateUOWCourses();
