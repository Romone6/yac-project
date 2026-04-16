import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/unsw");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Arts, Design & Architecture": [
    { name: "Bachelor of Architecture", code: "BARCH", atar: 90, duration: "3 years", prerequisites: [], description: "Design studios, building technology, professional practice." },
    { name: "Bachelor of Design", code: "BDES", atar: 85, duration: "3 years", prerequisites: [], description: "Graphic design, interior design, visual communication." },
    { name: "Bachelor of City Planning", code: "BCP", atar: 82, duration: "4 years", prerequisites: [], description: "Urban planning, sustainability, policy." },
    { name: "Bachelor of Fine Arts", code: "BFA", atar: 80, duration: "3 years", prerequisites: [], description: "Studio art practice, visual arts." },
    { name: "Bachelor of Arts", code: "BA", atar: 80, duration: "3 years", prerequisites: [], description: "Over 30 majors: Arts, Media, Music, Social Sciences." },
    { name: "Bachelor of Arts / Bachelor of Laws", code: "BA_LLB", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Arts/Law. Humanities + legal." },
    { name: "Bachelor of International Studies", code: "BIntSt", atar: 85, duration: "3 years", prerequisites: [], description: "Languages, international relations. Year overseas." },
    { name: "Bachelor of Music", code: "BMus", atar: 80, duration: "3 years", prerequisites: ["Music audition"], description: "Performance, composition, music technology." },
  ],
  "Business School": [
    { name: "Bachelor of Commerce", code: "BCom", atar: 92, duration: "3 years", prerequisites: [], description: "Accounting, Finance, Marketing, Management. Flexible majors." },
    { name: "Bachelor of Economics", code: "BEcon", atar: 90, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Economics, econometrics, economic policy." },
    { name: "Bachelor of Economics / Bachelor of Laws", code: "BEcon_LLB", atar: 99, duration: "5 years", prerequisites: ["Mathematics Advanced"], description: "Combined Economics/Law." },
    { name: "Bachelor of Commerce / Bachelor of Laws", code: "BCom_LLB", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Commerce/Law." },
    { name: "Bachelor of Commerce / Bachelor of Economics", code: "BCom_BEcon", atar: 93, duration: "4 years", prerequisites: [], description: "Double major in Commerce and Economics." },
    { name: "Bachelor of Actuarial Studies", code: "BActSt", atar: 98, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Actuarial science, risk management, finance." },
    { name: "Bachelor of Information Systems", code: "BIS", atar: 85, duration: "3 years", prerequisites: [], description: "Business informatics, IT systems. Commerce + IT." },
    { name: "Bachelor of Marketing", code: "BMkt", atar: 85, duration: "3 years", prerequisites: [], description: "Digital marketing, consumer insights, brand strategy." },
    { name: "Bachelor of Human Resource Management", code: "BHRM", atar: 82, duration: "3 years", prerequisites: [], description: "HR, organisational behaviour, employment law." },
    { name: "Bachelor of Property", code: "BProp", atar: 80, duration: "3 years", prerequisites: [], description: "Property valuation, development, investment." },
  ],
  "Engineering": [
    { name: "Bachelor of Engineering (Honours)", code: "BEng", atar: 90, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Civil, Mechanical, Electrical, Computer, Software, Chemical, Environmental, Mining, Petroleum." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Science", code: "BEng_BSc", atar: 92, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Science major." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Commerce", code: "BEng_BCom", atar: 93, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Business." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Arts", code: "BEng_BA", atar: 90, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Arts major." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Fine Arts", code: "BEng_BFA", atar: 88, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering + Design." },
    { name: "Bachelor of Computer Science", code: "BCS", atar: 90, duration: "3 years", prerequisites: [], description: "AI, Cybersecurity, Data Science, Software Engineering." },
    { name: "Bachelor of Science (Computer Science)", code: "BSc_CS", atar: 88, duration: "3 years", prerequisites: [], description: "Computer science with science breadth." },
  ],
  "Law & Justice": [
    { name: "Bachelor of Laws (Honours)", code: "LLB", atar: 98, duration: "4 years", prerequisites: [], description: "Professional law degree. Core + electives." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Arts", code: "LLB_BA", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Arts." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Commerce", code: "LLB_BCom", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Commerce." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Economics", code: "LLB_BEcon", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Economics." },
    { name: "Bachelor of Laws (Honours) / Bachelor of Science", code: "LLB_BSc", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Science." },
    { name: "Bachelor of Criminology and Criminal Justice", code: "BCCJ", atar: 82, duration: "3 years", prerequisites: [], description: "Criminology, criminal justice, policy." },
  ],
  "Medicine & Health": [
    { name: "Bachelor of Medical Studies / Doctor of Medicine", code: "BMed_MD", atar: 99, duration: "6 years", prerequisites: ["Chemistry"], description: "Gemma. Interview + UCAT. Graduate pathway available." },
    { name: "Bachelor of Exercise Physiology", code: "BEP", atar: 82, duration: "4 years", prerequisites: [], description: "Exercise rehabilitation, chronic disease management." },
    { name: "Bachelor of Nutrition and Dietetics", code: "BND", atar: 88, duration: "4 years", prerequisites: ["Chemistry"], description: "Accredited practising dietitian. Clinical placements." },
    { name: "Bachelor of Pharmacy", code: "BPharm", atar: 85, duration: "4 years", prerequisites: ["Chemistry"], description: "Pharmacy practice, pharmaceutical science." },
    { name: "Bachelor of Nursing", code: "BN", atar: 70, duration: "3 years", prerequisites: [], description: "Registered nurse. Clinical placements." },
    { name: "Bachelor of Psychology (Honours)", code: "BPsych", atar: 90, duration: "4 years", prerequisites: [], description: "APAC-accredited. Honours research." },
    { name: "Bachelor of Health Sciences", code: "BHS", atar: 80, duration: "3 years", prerequisites: [], description: "Health services, public health, Indigenous health." },
    { name: "Bachelor of Vision Science / Master of Clinical Optometry", code: "BVS_MCO", atar: 92, duration: "5 years", prerequisites: ["Chemistry"], description: "Optometry. Primary care, ocular disease." },
    { name: "Bachelor of Medical Science", code: "BMedSc", atar: 85, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical research, pathology." },
  ],
  "Science": [
    { name: "Bachelor of Science", code: "BSc", atar: 85, duration: "3 years", prerequisites: [], description: "40+ majors: Chemistry, Physics, Biology, Mathematics, Psychology, Earth Sciences, Food Science." },
    { name: "Bachelor of Science (Honours)", code: "BSc_H", atar: 95, duration: "4 years", prerequisites: [], description: "Research-intensive. Direct honours." },
    { name: "Bachelor of Science / Bachelor of Arts", code: "BSc_BA", atar: 88, duration: "4 years", prerequisites: [], description: "Science + Arts double degree." },
    { name: "Bachelor of Science / Bachelor of Laws", code: "BSc_LLB", atar: 99, duration: "5 years", prerequisites: [], description: "Science + Law." },
    { name: "Bachelor of Mathematics", code: "BMath", atar: 90, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Pure mathematics, applied mathematics, statistics." },
    { name: "Bachelor of Statistics", code: "BStat", atar: 88, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Data analysis, stochastic processes." },
    { name: "Bachelor of Psychology", code: "BPsych", atar: 88, duration: "3 years", prerequisites: [], description: "Psychology, behaviour, cognitive science." },
    { name: "Bachelor of Biotechnology", code: "BBioTech", atar: 85, duration: "4 years", prerequisites: [], description: "Biochemistry, genetics, biotech industry." },
    { name: "Bachelor of Environmental Management", code: "BEM", atar: 82, duration: "3 years", prerequisites: [], description: "Sustainability, environmental policy." },
    { name: "Bachelor of Marine and Ocean Science", code: "BMOS", atar: 85, duration: "3 years", prerequisites: [], description: "Marine biology, oceanography. Fieldwork." },
    { name: "Bachelor of Neuroscience", code: "BNeuro", atar: 90, duration: "3 years", prerequisites: ["Chemistry"], description: "Brain science, neurobiology." },
    { name: "Bachelor of Genetics", code: "BGen", atar: 90, duration: "3 years", prerequisites: ["Chemistry"], description: "Genetics, genomics, genetic counselling." },
  ],
  "UNSW Canberra": [
    { name: "Bachelor of Cyber Security", code: "BCS", atar: 85, duration: "3 years", prerequisites: [], description: "Cyber security, network defence, ethical hacking." },
    { name: "Bachelor of Politics, Philosophy and Economics", code: "BPPE", atar: 90, duration: "3 years", prerequisites: [], description: "Interdisciplinary social sciences." },
    { name: "Bachelor of Criminology", code: "BCrim", atar: 82, duration: "3 years", prerequisites: [], description: "Crime, justice, policy." },
  ],
};

function generateUNSWCourses() {
  console.log("🔍 Generating UNSW courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `unsw-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "University of New South Wales",
        universitySlug: "unsw",
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
        officialUrl: `https://www.unsw.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ UNSW: ${courses.length} courses saved`);
  return courses;
}

generateUNSWCourses();
