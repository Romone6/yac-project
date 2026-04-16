import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data/courses/nsw/university-of-sydney");

const FACULTY_COURSES: Record<string, Array<{name: string, code: string, atar: number | null, duration: string, prerequisites: string[], description: string}>> = {
  "Architecture, Design and Planning": [
    { name: "Bachelor of Architecture", code: "B_ARCH", atar: 92, duration: "3 years", prerequisites: ["English Advanced"], description: "Prepare for a career as a registered architect. Studios, technology, and professional practice." },
    { name: "Bachelor of Design Computing", code: "B_DES_COMP", atar: 90, duration: "3 years", prerequisites: [], description: "Combine design thinking with computing. UX, interactive media, and digital product design." },
    { name: "Bachelor of Design in Architecture", code: "B_DES_ARCH", atar: 85, duration: "4 years", prerequisites: [], description: "Foundations for architecture and design. Build a portfolio while you study." },
  ],
  "Arts and Social Sciences": [
    { name: "Bachelor of Arts", code: "B_A", atar: 80, duration: "3 years", prerequisites: [], description: "Over 40 majors: History, Philosophy, Politics, Sociology, Languages, Psychology." },
    { name: "Bachelor of Arts and Business", code: "B_A_B", atar: 90, duration: "4 years", prerequisites: [], description: "Combine an Arts degree with business fundamentals. Commerce breadth included." },
    { name: "Bachelor of Arts and Law", code: "B_A_LLB", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Arts/Law degree. Humanities depth with legal professional training." },
    { name: "Bachelor of Economics", code: "B_Econ", atar: 92, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Economic theory, econometrics, and policy analysis. Honours available." },
    { name: "Bachelor of Social Work", code: "BSW", atar: 80, duration: "4 years", prerequisites: [], description: "Professional social work degree. Field education in Year 3 and 4." },
    { name: "Bachelor of Education (Primary)", code: "BEd_P", atar: 80, duration: "4 years", prerequisites: [], description: "Primary teaching qualification. Professional experience from Year 1." },
    { name: "Bachelor of Education (Secondary)", code: "BEd_S", atar: 80, duration: "4 years", prerequisites: [], description: "Secondary teaching. Two teaching areas required." },
    { name: "Bachelor of International Studies", code: "B_IntSt", atar: 85, duration: "3 years", prerequisites: [], description: "Languages, global politics, and international relations. Year overseas." },
    { name: "Bachelor of Visual Arts", code: "B_VA", atar: 80, duration: "3 years", prerequisites: [], description: "Studio-based art practice. Painting, sculpture, photography, digital media." },
  ],
  "Business": [
    { name: "Bachelor of Commerce", code: "B_Com", atar: 95, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Accounting, Economics, Management, Marketing, Finance. Flexible majors." },
    { name: "Bachelor of Commerce and Bachelor of Laws", code: "B_Com_LLB", atar: 99, duration: "5 years", prerequisites: ["Mathematics Advanced"], description: "Combined Commerce/Law. Double degree with professional pathways." },
    { name: "Bachelor of Business Analytics", code: "B_BA", atar: 90, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Data analysis, statistical modeling, business intelligence. Python, R, SQL." },
    { name: "Bachelor of Marketing", code: "B_Mkt", atar: 85, duration: "3 years", prerequisites: [], description: "Digital marketing, consumer behaviour, brand management, advertising." },
    { name: "Bachelor of Professional Accounting", code: "B_PA", atar: 85, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "CPA-accredited accounting degree. Guaranteed practical experience." },
  ],
  "Economics": [
    { name: "Bachelor of Economics", code: "B_Econ", atar: 92, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Core economics with quantitative methods. Macro and microeconomics." },
    { name: "Bachelor of Economics / Bachelor of Laws", code: "B_Econ_LLB", atar: 99, duration: "5 years", prerequisites: ["Mathematics Advanced"], description: "Combined Economics/Law. Policy and legal expertise." },
    { name: "Bachelor of Economic Analysis", code: "B_EconA", atar: 95, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Advanced quantitative economics. Honours pathway available." },
  ],
  "Education and Social Work": [
    { name: "Bachelor of Education (Primary)", code: "BEd_P", atar: 80, duration: "4 years", prerequisites: [], description: "Primary teaching. All key learning areas. Professional practice." },
    { name: "Bachelor of Education (Secondary)", code: "BEd_S", atar: 80, duration: "4 years", prerequisites: [], description: "Secondary teaching. Two specialisations required." },
    { name: "Bachelor of Social Work", code: "BSW", atar: 80, duration: "4 years", prerequisites: [], description: "Accredited social work. Field placements every year." },
    { name: "Bachelor of Arts / Bachelor of Education", code: "B_A_BEd", atar: 85, duration: "4 years", prerequisites: [], description: "Combined Arts/Education. Secondary teaching pathway." },
  ],
  "Engineering and Computer Science": [
    { name: "Bachelor of Engineering (Honours)", code: "B_Eng_H", atar: 90, duration: "4 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Choice of: Civil, Mechanical, Electrical, Software, Aerospace, Biomedical." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Science", code: "B_Eng_Sc", atar: 92, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Combined Engineering/Science. Two disciplines." },
    { name: "Bachelor of Engineering (Honours) / Bachelor of Commerce", code: "B_Eng_Com", atar: 93, duration: "5 years", prerequisites: ["Mathematics Advanced", "Physics"], description: "Engineering/Commerce. Technical and business skills." },
    { name: "Bachelor of Computer Science", code: "B_CS", atar: 90, duration: "3 years", prerequisites: [], description: "AI, Data Science, Cybersecurity, Software Engineering. Honours available." },
    { name: "Bachelor of Advanced Studies", code: "B_AS", atar: 99, duration: "4 years", prerequisites: [], description: "Research-intensive. Guaranteed honours. PhD pathway." },
    { name: "Bachelor of Information Technology", code: "B_IT", atar: 85, duration: "3 years", prerequisites: [], description: "IT profession. Web development, systems administration." },
    { name: "Bachelor of Data Science", code: "B_DS", atar: 88, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Machine learning, statistics, data visualisation. Industry placements." },
  ],
  "Law": [
    { name: "Bachelor of Laws", code: "LLB", atar: 99, duration: "4 years", prerequisites: [], description: "Professional law degree. Core subjects + electives. Practical training." },
    { name: "Bachelor of Laws / Bachelor of Arts", code: "LLB_BA", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Arts. Humanities + legal expertise." },
    { name: "Bachelor of Laws / Bachelor of Commerce", code: "LLB_BCom", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Commerce. Business focus + law." },
    { name: "Bachelor of Laws / Bachelor of Economics", code: "LLB_BEcon", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Economics. Policy and law." },
    { name: "Bachelor of Laws / Bachelor of Science", code: "LLB_BSc", atar: 99, duration: "5 years", prerequisites: [], description: "Combined Law/Science. Tech + law." },
    { name: "Juris Doctor", code: "JD", atar: null, duration: "3 years", prerequisites: [], description: "Graduate law degree. For graduates from any discipline." },
  ],
  "Medicine and Health": [
    { name: "Doctor of Medicine", code: "MD", atar: 99, duration: "4 years", prerequisites: ["Chemistry"], description: "Graduate medical degree. 4 years. Interview + UCAT required." },
    { name: "Bachelor of Pharmacy", code: "B_Pharm", atar: 88, duration: "4 years", prerequisites: ["Chemistry"], description: "Accredited pharmacy. Clinical placements from Year 1." },
    { name: "Bachelor of Nursing", code: "BN", atar: 70, duration: "3 years", prerequisites: [], description: "Registered nurse qualification. Clinical placements every semester." },
    { name: "Bachelor of Oral Health", code: "BOH", atar: 80, duration: "3 years", prerequisites: [], description: "Dental therapist/hygienist. Clinical practice." },
    { name: "Bachelor of Health Sciences", code: "B_HlthSc", atar: 80, duration: "3 years", prerequisites: [], description: "Flexible health degree. Major in: Health Promotion, Indigenous Health, Nutrition." },
    { name: "Bachelor of Sport and Exercise Science", code: "B_SES", atar: 82, duration: "3 years", prerequisites: [], description: "Exercise physiology, sports nutrition, biomechanics." },
    { name: "Bachelor of Science (Medical Science)", code: "B_Sc_MedSc", atar: 85, duration: "3 years", prerequisites: ["Chemistry"], description: "Medical research pathway. Honours available." },
  ],
  "Music": [
    { name: "Bachelor of Music", code: "B_Mus", atar: 80, duration: "3 years", prerequisites: [], description: "Performance, Composition, Musicology. Audition required." },
    { name: "Bachelor of Music / Bachelor of Arts", code: "B_Mus_BA", atar: 85, duration: "4 years", prerequisites: [], description: "Combined Music/Arts. Double major." },
    { name: "Bachelor of Music (Composition)", code: "B_MusC", atar: 80, duration: "3 years", prerequisites: [], description: "Composition portfolio required. Electronic and acoustic." },
    { name: "Bachelor of Music (Performance)", code: "B_MusP", atar: 80, duration: "3 years", prerequisites: [], description: "Instrument audition required. Classical or Jazz." },
  ],
  "Science": [
    { name: "Bachelor of Science", code: "B_Sc", atar: 85, duration: "3 years", prerequisites: [], description: "50+ majors: Biology, Chemistry, Physics, Mathematics, Psychology, Geography, Environmental." },
    { name: "Bachelor of Science (Advanced)", code: "B_Sc_Adv", atar: 95, duration: "3 years", prerequisites: [], description: "Research-intensive science. Guaranteed honours." },
    { name: "Bachelor of Science / Bachelor of Arts", code: "B_Sc_BA", atar: 90, duration: "4 years", prerequisites: [], description: "Science + Arts. Two disciplines." },
    { name: "Bachelor of Science / Bachelor of Laws", code: "B_Sc_LLB", atar: 99, duration: "5 years", prerequisites: [], description: "Science + Law. Science and legal expertise." },
    { name: "Bachelor of Psychology", code: "B_Psych", atar: 90, duration: "4 years", prerequisites: [], description: "APAC-accredited. Honours in Year 4." },
    { name: "Bachelor of Mathematics", code: "B_Math", atar: 90, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Pure and applied mathematics. Statistics, actuarial." },
    { name: "Bachelor of Statistics", code: "B_Stat", atar: 88, duration: "3 years", prerequisites: ["Mathematics Extension 1"], description: "Data analysis, statistical modeling. Actuarial pathway." },
    { name: "Bachelor of Environmental Studies", code: "B_ES", atar: 82, duration: "3 years", prerequisites: [], description: "Environmental science, sustainability, geography." },
    { name: "Bachelor of Geology", code: "B_Geol", atar: 80, duration: "3 years", prerequisites: [], description: "Earth sciences, geophysics, mineralogy." },
    { name: "Bachelor of Marine Biology", code: "B_MB", atar: 85, duration: "3 years", prerequisites: [], description: "Marine ecosystems, oceanography. Fieldwork at Taronga." },
    { name: "Bachelor of Neuroscience", code: "B_Neuro", atar: 92, duration: "3 years", prerequisites: ["Chemistry"], description: "Brain and nervous system. Research-intensive." },
    { name: "Bachelor of Animal and Veterinary Bioscience", code: "B_AVB", atar: 88, duration: "3 years", prerequisites: ["Chemistry"], description: "Animal science, veterinary pathway." },
  ],
  "Sydney School of Architecture": [
    { name: "Bachelor of Architecture", code: "B_ARCH", atar: 92, duration: "3 years", prerequisites: ["English Advanced"], description: "Design studios, technology, professional practice." },
  ],
  "Sydney School of Business": [
    { name: "Bachelor of Commerce", code: "B_Com", atar: 95, duration: "3 years", prerequisites: ["Mathematics Advanced"], description: "Flexible major selection. Industry projects." },
  ],
};

function generateSydneyCourses() {
  console.log("🔍 Generating University of Sydney courses...");
  
  const courses: Array<Record<string, unknown>> = [];
  
  for (const [faculty, facultyCourses] of Object.entries(FACULTY_COURSES)) {
    for (const course of facultyCourses) {
      courses.push({
        id: `usyd-${course.code.toLowerCase().replace(/_/g, "-")}`,
        university: "University of Sydney",
        universitySlug: "university-of-sydney",
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
        officialUrl: `https://www.sydney.edu.au/study/courses/${course.code.toLowerCase()}.html`,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(join(DATA_DIR, "courses.json"), JSON.stringify(courses, null, 2));
  
  console.log(`✅ USyd: ${courses.length} courses saved`);
  return courses;
}

generateSydneyCourses();
