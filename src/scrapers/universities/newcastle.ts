import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/university-of-newcastle");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Faculty of Business and Law": [
    { name: "Bachelor of Business", code: "BBus", atar: 65, duration: "3 years", prerequisites: [], description: "Management, Marketing, HR, Tourism." },
    { name: "Bachelor of Commerce", code: "BCom", atar: 70, duration: "3 years", prerequisites: [], description: "Accounting, Economics, Finance." },
    { name: "Bachelor of Accounting", code: "BAcc", atar: 68, duration: "3 years", prerequisites: [], description: "Professional accounting." },
    { name: "Bachelor of Marketing", code: "BMkt", atar: 65, duration: "3 years", prerequisites: [], description: "Marketing, digital." },
    { name: "Bachelor of Tourism and Event Management", code: "BTEM", atar: 65, duration: "3 years", prerequisites: [], description: "Tourism, events." },
    { name: "Bachelor of Laws (Honours)", code: "LLB", atar: 85, duration: "4 years", prerequisites: [], description: "Professional law." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Commerce", code: "LLB_BCom", atar: 88, duration: "5 years", prerequisites: [], description: "Law + Commerce." },
    { name: "Bachelor of Business / Bachelor of Laws", code: "BBus_LLB", atar: 88, duration: "5 years", prerequisites: [], description: "Business + Law." },
  ],
  "Faculty of Engineering and Built Environment": [
    { name: "Bachelor of Engineering (Honours)", code: "BEng", atar: 78, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Civil, Mechanical, Electrical, Software, Computer, Chemical, Environmental." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Commerce", code: "BEng_BCom", atar: 80, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Business." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Science", code: "BEng_BSc", atar: 80, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Science." },
    { name: "Bachelor of Computer Science", code: "BCS", atar: 75, duration: "3 years", prerequisites: [], description: "Software, AI, security." },
    { name: "Bachelor of Information Technology", code: "BIT", atar: 68, duration: "3 years", prerequisites: [], description: "IT systems." },
    { name: "Bachelor of Construction Management", code: "BCM", atar: 70, duration: "4 years", prerequisites: [], description: "Construction project management." },
  ],
  "Faculty of Health and Medicine": [
    { name: "Bachelor of Medical Science", code: "BMedSc", atar: 75, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical research pathway." },
    { name: "Bachelor of Physiotherapy", code: "BPhysio", atar: 88, duration: "4 years", prerequisites: ["Chemistry"], description: "Physiotherapy." },
    { name: "Bachelor of Occupational Therapy", code: "BOccThy", atar: 80, duration: "4 years", prerequisites: [], description: "Occupational therapy." },
    { name: "Bachelor of Speech Pathology", code: "BSpPath", atar: 82, duration: "4 years", prerequisites: [], description: "Speech pathology." },
    { name: "Bachelor of Nursing", code: "BN", atar: 63, duration: "3 years", prerequisites: [], description: "Registered nurse." },
    { name: "Bachelor of Nutrition and Dietetics", code: "BND", atar: 80, duration: "4 years", prerequisites: ["Chemistry"], description: "Dietetics." },
    { name: "Bachelor of Exercise and Sport Science", code: "BESS", atar: 68, duration: "3 years", prerequisites: [], description: "Exercise, sport." },
    { name: "Bachelor of Psychology (Honours)", code: "BPsych", atar: 80, duration: "4 years", prerequisites: [], description: "APAC accredited." },
    { name: "Bachelor of Pharmacy", code: "BPharm", atar: 78, duration: "4 years", prerequisites: ["Chemistry"], description: "Pharmacy." },
    { name: "Bachelor of Dental Surgery", code: "BDS", atar: 90, duration: "4 years", prerequisites: [], description: "Dental surgery." },
  ],
  "Faculty of Education and Arts": [
    { name: "Bachelor of Arts", code: "BA", atar: 60, duration: "3 years", prerequisites: [], description: "Humanities, History, Politics, English, Psychology." },
    { name: "Bachelor of Teaching (Primary)", code: "BTeach_P", atar: 65, duration: "4 years", prerequisites: [], description: "Primary teaching." },
    { name: "Bachelor of Teaching (Secondary)", code: "BTeach_S", atar: 65, duration: "4 years", prerequisites: [], description: "Secondary teaching." },
    { name: "Bachelor of Social Work", code: "BSW", atar: 65, duration: "4 years", prerequisites: [], description: "Social work." },
    { name: "Bachelor of Communication", code: "BComm", atar: 62, duration: "3 years", prerequisites: [], description: "Journalism, PR." },
    { name: "Bachelor of Development Studies", code: "BDevSt", atar: 60, duration: "3 years", prerequisites: [], description: "International development." },
    { name: "Bachelor of Music", code: "BMus", atar: 60, duration: "3 years", prerequisites: [], description: "Music practice." },
  ],
  "Faculty of Science and Information Technology": [
    { name: "Bachelor of Science", code: "BSc", atar: 65, duration: "3 years", prerequisites: [], description: "Biology, Chemistry, Physics, Mathematics, Computing." },
    { name: "Bachelor of Science (Honours)", code: "BSc_H", atar: 80, duration: "4 years", prerequisites: [], description: "Research-intensive." },
    { name: "Bachelor of Mathematics", code: "BMath", atar: 75, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Maths, statistics." },
    { name: "Bachelor of Biotechnology", code: "BBiotech", atar: 70, duration: "3 years", prerequisites: ["Chemistry"], description: "Biochemistry." },
    { name: "Bachelor of Environmental Science", code: "BEnvSc", atar: 68, duration: "3 years", prerequisites: [], description: "Sustainability." },
    { name: "Bachelor of Information Systems", code: "BIS", atar: 68, duration: "3 years", prerequisites: [], description: "Business informatics." },
  ],
};

function generateNewcastleCourses() {
  console.log("🔍 Generating Newcastle courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `newcastle-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "University of Newcastle",
        universitySlug: "university-of-newcastle",
        state: "NSW",
        faculty: faculty,
        courseName: course.name,
        courseCode: course.code,
        level: "undergraduate",
        description: course.description,
        duration: course.duration || "",
        atar: course.atar,
        prerequisites: course.prerequisites || [],
        assumedKnowledge: [],
        recommendedSubjects: [],
        secondarySubjects: [],
        careerOutcomes: [],
        officialUrl: `https://www.newcastle.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ Newcastle: ${courses.length} courses saved`);
  return courses;
}

generateNewcastleCourses();
