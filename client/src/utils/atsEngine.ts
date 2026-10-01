import type { Job, CandidateProfile } from "../types";

export interface ATSAnalysisResult {
  score: number;
  matchBand: "high" | "medium" | "low";
  matchedSkills: string[];
  missingSkills: string[];
  allRequiredSkills: string[];
  candidateSkills: string[];
  suggestedBullets: string[];
  keywordDensityAdvice: string;
  formattingTips: {
    title: string;
    description: string;
    passed: boolean;
  }[];
}

// Canonical Skill Dictionary with Aliases for Intelligent Matching
const SKILL_LEXICON: Record<string, string[]> = {
  // Frontend
  "React": ["react", "react.js", "reactjs"],
  "Next.js": ["next.js", "nextjs", "next"],
  "TypeScript": ["typescript", "ts"],
  "JavaScript": ["javascript", "js", "es6", "es6+", "ecmascript"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
  "CSS3": ["css", "css3", "sass", "scss", "styled-components"],
  "HTML5": ["html", "html5", "semantic html"],
  "Redux": ["redux", "redux toolkit", "rtk", "zustand", "recoil"],
  "GraphQL": ["graphql", "apollo", "relay"],
  "WebSockets": ["websocket", "websockets", "socket.io", "realtime", "real-time"],
  "Vue.js": ["vue", "vue.js", "vuejs", "nuxt"],
  "Angular": ["angular", "angularjs"],

  // Backend & Languages
  "Node.js": ["node", "node.js", "nodejs"],
  "Express.js": ["express", "express.js", "expressjs"],
  "NestJS": ["nestjs", "nest.js"],
  "Go (Golang)": ["go", "golang"],
  "Python": ["python", "django", "fastapi", "flask"],
  "Java": ["java", "spring", "spring boot"],
  "C++": ["c++", "cpp"],
  "REST APIs": ["rest", "restful", "rest api", "rest apis", "restful apis"],
  "Microservices": ["microservices", "microservice", "distributed systems"],
  "gRPC": ["grpc", "protobuf"],

  // Databases & Caching
  "MongoDB": ["mongodb", "mongo", "mongoose"],
  "PostgreSQL": ["postgresql", "postgres", "psql"],
  "MySQL": ["mysql", "sql", "relational database"],
  "Redis": ["redis", "caching", "cache"],
  "Prisma": ["prisma", "typeorm", "sequelize", "orm"],
  "Elasticsearch": ["elasticsearch", "elastic search", "opensearch"],
  "Kafka": ["kafka", "apache kafka", "rabbitmq", "message queue", "event-driven"],

  // Cloud, DevOps & Tools
  "Docker": ["docker", "containerization", "containers"],
  "Kubernetes": ["kubernetes", "k8s", "helm"],
  "AWS": ["aws", "amazon web services", "s3", "ec2", "lambda", "ecs"],
  "GCP": ["gcp", "google cloud", "google cloud platform"],
  "Azure": ["azure", "microsoft azure"],
  "Terraform": ["terraform", "iac", "infrastructure as code"],
  "CI/CD": ["ci/cd", "github actions", "gitlab ci", "jenkins", "pipelines"],
  "Linux": ["linux", "bash", "shell scripting"],
  "Git": ["git", "github", "gitlab", "version control"],

  // Testing & Quality
  "Playwright": ["playwright"],
  "Cypress": ["cypress"],
  "Jest": ["jest", "vitest", "mocha", "unit testing", "automated testing"],
  "API Testing": ["postman", "api testing", "supertest"],

  // Design & Product
  "Figma": ["figma", "figma tokens"],
  "UI/UX Design": ["ui/ux", "ui design", "ux design", "product design", "user experience", "user interface"],
  "Design Systems": ["design system", "design systems", "component library"],
  "Wireframing": ["wireframing", "prototyping", "wireframes", "prototypes"],
  "User Research": ["user research", "usability testing", "persona mapping"],
  "Accessibility (WCAG)": ["accessibility", "wcag", "a11y", "accessible"],

  // Methodologies & Soft Skills
  "Agile / Scrum": ["agile", "scrum", "sprints", "kanban", "jira"],
  "System Design": ["system design", "software architecture", "high-level design", "hld", "lld"],
  "Clean Code": ["clean code", "solid principles", "design patterns", "refactoring"],
  "Performance Optimization": ["performance optimization", "web vitals", "lighthouse", "load time"],
  "Product Marketing": ["product marketing", "go-to-market", "gtm", "copywriting"],
  "SEO & Growth": ["seo", "organic growth", "google analytics", "semrush"],
  "Technical Sales": ["pre-sales", "technical sales", "solutions consultant", "poc"],
};

/**
 * Extracts normalized skills from any input text (job description, requirements, candidate profile).
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const matchedCanonicalSkills: string[] = [];

  for (const [canonicalName, aliases] of Object.entries(SKILL_LEXICON)) {
    for (const alias of aliases) {
      // Word boundary regex or substring match for punctuation-heavy tokens like Next.js or C++
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escapedAlias}([^a-zA-Z0-9_#+]|$)`, "i");

      if (regex.test(lowerText) || lowerText.includes(alias)) {
        matchedCanonicalSkills.push(canonicalName);
        break;
      }
    }
  }

  return Array.from(new Set(matchedCanonicalSkills));
}

/**
 * Extracts all skills from a Candidate Profile (skills list, bio, experience descriptions, education).
 */
export function getCandidateSkills(profile?: CandidateProfile | null): string[] {
  if (!profile) return [];

  const explicitSkills = (profile.skills || []).map((s) => s.trim());
  const bioSkills = extractSkillsFromText(profile.bio || "");

  const experienceText = (profile.experience || [])
    .map((exp) => `${exp.title} ${exp.company} ${exp.description || ""}`)
    .join(" ");
  const expSkills = extractSkillsFromText(experienceText);

  const educationText = (profile.education || [])
    .map((edu) => `${edu.degree} ${edu.institution} ${edu.fieldOfStudy || ""}`)
    .join(" ");
  const eduSkills = extractSkillsFromText(educationText);

  // Normalize explicit skills against lexicon
  const normalizedExplicit: string[] = [];
  for (const s of explicitSkills) {
    const extracted = extractSkillsFromText(s);
    if (extracted.length > 0) {
      normalizedExplicit.push(...extracted);
    } else {
      normalizedExplicit.push(s);
    }
  }

  return Array.from(new Set([...normalizedExplicit, ...bioSkills, ...expSkills, ...eduSkills]));
}

/**
 * Extracts all skills from a Job Posting (requirements array, description, title, category).
 */
export function getJobRequiredSkills(job: Job): string[] {
  const reqText = (job.requirements || []).join(" ");
  const descText = `${job.title} ${job.category || ""} ${job.description || ""} ${reqText}`;
  return extractSkillsFromText(descText);
}

/**
 * Computes full ATS analysis, missing skills, match score, and recommendations.
 */
export function analyzeJobATS(job: Job, profile?: CandidateProfile | null): ATSAnalysisResult {
  const jobSkills = getJobRequiredSkills(job);
  const candidateSkills = getCandidateSkills(profile);

  // Match comparison
  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of jobSkills) {
    const isMatched = candidateSkillsLower.some((cs) => {
      if (cs === skill.toLowerCase()) return true;
      const aliases = SKILL_LEXICON[skill] || [];
      return aliases.some((a) => cs.includes(a) || a.includes(cs));
    });

    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Calculate Weighted ATS Score (0 - 100)
  let score = 0;
  if (jobSkills.length > 0) {
    const skillMatchRatio = matchedSkills.length / jobSkills.length;
    score = Math.round(skillMatchRatio * 75); // 75% weight on skill match
  } else {
    score = 65; // baseline if job has minimal explicit skills
  }

  // Category & Experience Level bonus (up to 25%)
  if (profile) {
    if ((profile.experience || []).length > 0) score += 15;
    if ((profile.education || []).length > 0) score += 5;
    if (profile.resume) score += 5;
  }

  // Cap score within 0 to 100
  score = Math.min(Math.max(score, 15), 98);

  const matchBand: "high" | "medium" | "low" =
    score >= 75 ? "high" : score >= 50 ? "medium" : "low";

  // Generate role-specific high-impact bullet suggestions incorporating missing or key skills
  const targetRole = job.title;
  const topSkillsToHighlight = (missingSkills.length > 0 ? missingSkills : matchedSkills).slice(0, 3);
  const skillStr = topSkillsToHighlight.join(" & ") || "Modern Frameworks";

  const suggestedBullets: string[] = [
    `Architected and shipped customer-facing web features utilizing ${skillStr}, resulting in a 35% improvement in application responsiveness and Web Vitals.`,
    `Engineered scalable RESTful API services and state management workflows using ${matchedSkills[0] || "TypeScript"}, reducing redundant network roundtrips by 28%.`,
    `Spearheaded automated end-to-end testing and CI/CD validation pipelines across product squads, achieving 99.9% deployment reliability.`,
    `Collaborated with cross-functional design and product engineering teams to implement accessibility standards (WCAG 2.1) and modular design systems.`,
  ];

  // Keyword Density Advice
  const keywordDensityAdvice = missingSkills.length > 0
    ? `Add missing keywords like ${missingSkills.slice(0, 4).join(", ")} inside your Work Experience bullets or Skills section to pass automated recruiter ATS parsers.`
    : `Your resume has excellent keyword alignment with this ${targetRole} posting! Ensure your bullet points highlight quantifiable metrics (e.g. %, ₹, latency).`;

  // Formatting Checklist
  const formattingTips = [
    {
      title: "Target Keywords Matched",
      description: `${matchedSkills.length} of ${jobSkills.length} core job competencies identified in your profile`,
      passed: matchedSkills.length >= Math.ceil(jobSkills.length * 0.5),
    },
    {
      title: "Verified Resume Uploaded",
      description: profile?.resume ? "PDF resume is attached and ready for recruiter download" : "Upload your resume PDF to complete ATS screening",
      passed: Boolean(profile?.resume),
    },
    {
      title: "Quantifiable Work History",
      description: (profile?.experience || []).length > 0 ? `${(profile?.experience || []).length} past roles detailed with responsibilities` : "Add past experience roles with measurable impact metrics",
      passed: (profile?.experience || []).length > 0,
    },
    {
      title: "Formal Education Background",
      description: (profile?.education || []).length > 0 ? "Academic credentials and degree records added" : "Include your degree / institution to satisfy employer educational filters",
      passed: (profile?.education || []).length > 0,
    },
    {
      title: "Clear Contact Information",
      description: profile?.phone && profile?.location ? "Phone number & location city verified" : "Provide contact phone and location in your profile",
      passed: Boolean(profile?.phone && profile?.location),
    },
  ];

  return {
    score,
    matchBand,
    matchedSkills,
    missingSkills,
    allRequiredSkills: jobSkills,
    candidateSkills,
    suggestedBullets,
    keywordDensityAdvice,
    formattingTips,
  };
}
