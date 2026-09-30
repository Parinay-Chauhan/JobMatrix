import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { DB_NAME } from "./src/constant.js";
import { User } from "./src/models/user.model.js";
import { RecruiterProfile } from "./src/models/recruiterProfile.model.js";
import { Job } from "./src/models/job.model.js";

const seedData = async () => {
  try {
    const dbUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully!");

    // 1. Cleanup old test/junk jobs
    const junkPatterns = [/test/i, /demo/i, /asdf/i, /qwerty/i, /sample/i, /temp/i, /fake/i, /dummy/i, /abc/i, /xyz/i, /\d{10,}/];
    const allJobs = await Job.find({}).populate("recruiter");
    for (const job of allJobs) {
      if (
        !job.title ||
        job.title.length < 5 ||
        junkPatterns.some((pattern) => pattern.test(job.title)) ||
        job.recruiter?.companyName === "Acme Tech A"
      ) {
        await Job.findByIdAndDelete(job._id);
        console.log(`Deleted test job: "${job.title}"`);
      }
    }

    // 2. Verified recruiters and companies
    const recruitersData = [
      {
        email: "talent@razorpay.com",
        username: "razorpay_talent",
        fullName: "Aarav Sharma",
        companyName: "Razorpay",
        designation: "Head of Technical Recruitment",
        experience: "9+ Years in Fintech Hiring",
        phone: "+91 98112 34567",
        bio: "Building the financial backbone of the internet. Hiring high-impact engineers and product leaders.",
        companyWebsite: "https://razorpay.com",
        companyDescription: "Razorpay is India's leading full-stack financial services company, empowering millions of businesses with payments and banking solutions.",
        location: "Bengaluru, Karnataka",
        industry: "Information Technology",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      },
      {
        email: "recruiter@jobmatrix.com",
        username: "nexusrecruiter",
        fullName: "Ananya Iyer",
        companyName: "Nexus Cloud Labs",
        designation: "Principal Talent Partner",
        experience: "7+ Years",
        phone: "+91 98765 43210",
        bio: "Connecting top 1% engineering and design talent with world-class cloud infrastructure teams.",
        companyWebsite: "https://nexuslabs.dev",
        companyDescription: "Global enterprise engineering studio delivering next-gen cloud platforms, edge computing, and real-time collaboration suites.",
        location: "Bengaluru / Remote",
        industry: "Information Technology",
        companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80",
      },
      {
        email: "careers@swiggy.in",
        username: "swiggy_careers",
        fullName: "Vikram Malhotra",
        companyName: "Swiggy Tech",
        designation: "Director of Engineering Hiring",
        experience: "11+ Years",
        phone: "+91 98450 12345",
        bio: "Powering hyperlocal commerce at lightning speed. Scaling algorithms and high-throughput systems.",
        companyWebsite: "https://swiggy.com",
        companyDescription: "India's leading on-demand convenience platform connecting consumers to food, grocery, and dining experiences.",
        location: "Bengaluru / Hyderabad",
        industry: "Information Technology",
        companyLogo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80",
      },
      {
        email: "talent@stripe.com",
        username: "stripe_talent",
        fullName: "Neha Kapoor",
        companyName: "Stripe",
        designation: "Senior Staff Recruiter",
        experience: "8+ Years",
        phone: "+91 99200 98765",
        bio: "Increasing the GDP of the internet. Hiring developers, distributed systems engineers, and UI specialists.",
        companyWebsite: "https://stripe.com",
        companyDescription: "Stripe builds economic infrastructure for the internet — from small startups to public market enterprises.",
        location: "Bengaluru, India / Remote",
        industry: "Information Technology",
        companyLogo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80",
      }
    ];

    const recruiterProfiles = [];

    for (const rData of recruitersData) {
      let user = await User.findOne({ email: rData.email });
      if (!user) {
        user = await User.create({
          username: rData.username,
          fullName: rData.fullName,
          email: rData.email,
          password: "Password@123",
          role: "recruiter",
          avatar: "",
        });
      }

      let profile = await RecruiterProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await RecruiterProfile.create({
          user: user._id,
          companyName: rData.companyName,
          designation: rData.designation,
          experience: rData.experience,
          phone: rData.phone,
          bio: rData.bio,
          companyWebsite: rData.companyWebsite,
          companyDescription: rData.companyDescription,
          location: rData.location,
          industry: rData.industry,
          companyLogo: rData.companyLogo,
        });
      } else {
        profile.companyName = rData.companyName;
        profile.designation = rData.designation;
        profile.bio = rData.bio;
        profile.location = rData.location;
        profile.companyWebsite = rData.companyWebsite;
        profile.companyDescription = rData.companyDescription;
        await profile.save();
      }

      recruiterProfiles.push({ user, profile });
    }

    // 3. Top-tier curated professional jobs
    const professionalJobs = [
      {
        title: "Senior Frontend Engineer (React, TypeScript & Design Systems)",
        description: "Join our core web experience team to build pixel-perfect, high-performance dashboards and checkout flows. You will architect modular component systems, optimize Web Vitals, and lead front-end best practices across product squads.",
        requirements: [
          "4+ years of professional experience with modern React, TypeScript, and Next.js",
          "Deep mastery of state management, CSS architecture, and browser performance optimization",
          "Demonstrated experience building reusable component libraries and accessibility standards (WCAG 2.1)",
          "Track record of writing robust end-to-end tests with Playwright or Cypress"
        ],
        location: "Bengaluru, Karnataka",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Software Development",
        experienceLevel: "Senior-level",
        salary: 2800000,
        positions: 3,
        recruiter: recruiterProfiles[0].profile._id,
        createdBy: recruiterProfiles[0].user._id,
        isActive: true,
      },
      {
        title: "Staff Backend Engineer - Distributed Payment Systems",
        description: "Architect mission-critical payment settlement and ledger microservices capable of processing over 50,000 requests per second with 99.999% uptime. You will solve complex concurrency challenges, idempotency protocols, and data replication across cloud regions.",
        requirements: [
          "6+ years building low-latency distributed systems using Go, Java, or Node.js",
          "Deep understanding of distributed consensus, Kafka/RabbitMQ event pipelines, and ACID transactions",
          "Extensive production experience with PostgreSQL, Redis clustering, and AWS/GCP cloud environments",
          "Strong passion for clean architecture, observability (OpenTelemetry), and zero-downtime deployments"
        ],
        location: "Bengaluru, Karnataka",
        jobType: "Full-time",
        workMode: "On-site",
        category: "Software Development",
        experienceLevel: "Senior-level",
        salary: 3800000,
        positions: 2,
        recruiter: recruiterProfiles[0].profile._id,
        createdBy: recruiterProfiles[0].user._id,
        isActive: true,
      },
      {
        title: "Full Stack Engineer - Realtime Collaboration & Cloud",
        description: "Work on cutting-edge collaborative web software with live cursor presence, optimistic sync engines, and WebSocket infrastructure. You will own features end-to-end from database modeling to rich browser canvas rendering.",
        requirements: [
          "3+ years building full-stack applications with React, Node.js, and TypeScript",
          "Solid foundations in WebSockets, asynchronous messaging, and REST/GraphQL APIs",
          "Experience with MongoDB, PostgreSQL, and Redis caching layers",
          "Strong problem-solving ability, self-driven attitude, and enthusiasm for developer tooling"
        ],
        location: "Remote / Work From Home",
        jobType: "Full-time",
        workMode: "Remote",
        category: "Software Development",
        experienceLevel: "Mid-level",
        salary: 1800000,
        positions: 4,
        recruiter: recruiterProfiles[1].profile._id,
        createdBy: recruiterProfiles[1].user._id,
        isActive: true,
      },
      {
        title: "Junior Software Engineer (Graduate / 2024-2026 Batch)",
        description: "An accelerated career launchpad for passionate fresh engineering graduates. You will be paired with senior engineering mentors to ship customer-facing web features, write clean modular code, and master cloud-native workflows.",
        requirements: [
          "B.Tech / B.E / MCA / BCA in Computer Science, IT or related technical discipline",
          "Strong programming foundation in JavaScript / TypeScript, Data Structures & Algorithms",
          "Familiarity with Git version control, HTML5, CSS3, and modern web frameworks",
          "Exceptional curiosity, fast learning curve, and proactive team communication"
        ],
        location: "Bengaluru / Hybrid",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Software Development",
        experienceLevel: "Entry-level",
        salary: 850000,
        positions: 6,
        recruiter: recruiterProfiles[1].profile._id,
        createdBy: recruiterProfiles[1].user._id,
        isActive: true,
      },
      {
        title: "Lead Product Designer (UI/UX, Mobile & Design Systems)",
        description: "Shape the visual and interaction design language for millions of daily consumers. You will spearhead end-to-end product design from generative user research and wireframing to high-fidelity interactive prototypes and design token systems.",
        requirements: [
          "5+ years designing world-class consumer-facing web and mobile applications",
          "Mastery of Figma, component libraries, interaction design, and micro-animations",
          "Strong portfolio exhibiting thoughtful UX problem solving and crisp visual aesthetics",
          "Excellent presentation skills with ability to collaborate closely with product managers and engineers"
        ],
        location: "Bengaluru, Karnataka",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Design",
        experienceLevel: "Senior-level",
        salary: 2600000,
        positions: 2,
        recruiter: recruiterProfiles[2].profile._id,
        createdBy: recruiterProfiles[2].user._id,
        isActive: true,
      },
      {
        title: "Software Engineering Intern - Web & Backend (Summer 2026)",
        description: "Exciting 6-month paid internship with pre-placement offer (PPO) opportunities. Work alongside talented engineers building hyperlocal routing algorithms, customer order dispatching, and high-throughput microservices.",
        requirements: [
          "Currently pursuing Bachelor's or Master's degree in Computer Science or related fields",
          "Proficiency in at least one modern language: JavaScript/TypeScript, Python, Java, or Go",
          "Hands-on project experience with web development or RESTful APIs",
          "Availability for 6 months full-time internship starting immediately"
        ],
        location: "Bengaluru / Hyderabad",
        jobType: "Internship",
        workMode: "On-site",
        category: "Software Development",
        experienceLevel: "Entry-level",
        salary: 480000,
        positions: 8,
        recruiter: recruiterProfiles[2].profile._id,
        createdBy: recruiterProfiles[2].user._id,
        isActive: true,
      },
      {
        title: "Staff Cloud Infrastructure & SRE Engineer",
        description: "Own the reliability, security, and scalability of multi-region Kubernetes clusters. Automate Infrastructure as Code (Terraform), engineer resilient CI/CD delivery pipelines, and establish SLI/SLO observability metrics.",
        requirements: [
          "5+ years in DevOps / SRE roles managing production cloud workloads on AWS or GCP",
          "Expertise with Kubernetes, Helm, Docker, Terraform, and GitOps workflows",
          "Proficiency in Prometheus, Grafana, ELK Stack, and automated incident response",
          "Scripting mastery in Python, Bash, or Go for infrastructure automation"
        ],
        location: "Remote / Work From Home",
        jobType: "Full-time",
        workMode: "Remote",
        category: "Software Development",
        experienceLevel: "Senior-level",
        salary: 3200000,
        positions: 2,
        recruiter: recruiterProfiles[3].profile._id,
        createdBy: recruiterProfiles[3].user._id,
        isActive: true,
      },
      {
        title: "Product Marketing Manager - Developer Ecosystem",
        description: "Drive global developer adoption, product storytelling, and go-to-market execution for next-gen APIs. You will create engaging technical walkthroughs, lead launch campaigns, and collaborate with Developer Relations.",
        requirements: [
          "3+ years experience in B2B SaaS, developer tooling, or API product marketing",
          "Exceptional technical copywriting, messaging hierarchy, and narrative craft",
          "Data-driven mindset with experience tracking funnel conversions and user acquisition",
          "Comfortable understanding technical developer concepts and translating them into compelling value propositions"
        ],
        location: "Bengaluru, Karnataka",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Marketing",
        experienceLevel: "Mid-level",
        salary: 1900000,
        positions: 2,
        recruiter: recruiterProfiles[3].profile._id,
        createdBy: recruiterProfiles[3].user._id,
        isActive: true,
      },
      {
        title: "Enterprise Solutions Consultant & Technical Sales",
        description: "Partner with enterprise leadership to identify key payment modernization opportunities. Conduct architectural technical discovery, tailor proofs-of-concept, and guide technical decision-makers to close high-value annual contracts.",
        requirements: [
          "4+ years in pre-sales engineering, technical account management, or enterprise SaaS sales",
          "Solid grasp of API integrations, web architectures, and cloud security frameworks",
          "Proven record of surpassing sales quotas and managing complex B2B buyer journeys",
          "Polished communication, executive presentation, and contract negotiation skills"
        ],
        location: "Mumbai / Gurugram",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Sales",
        experienceLevel: "Senior-level",
        salary: 2400000,
        positions: 3,
        recruiter: recruiterProfiles[0].profile._id,
        createdBy: recruiterProfiles[0].user._id,
        isActive: true,
      },
      {
        title: "UI/UX Visual Designer - Interaction & Web (Part-time)",
        description: "Flexible 20 hours per week role for a talented visual designer. Create stunning web landing pages, marketing assets, vector illustrations, and micro-animations for upcoming product releases.",
        requirements: [
          "2+ years experience crafting digital interfaces, web design, and graphic design",
          "Strong portfolio in Figma, Adobe Creative Suite, and responsive web design",
          "Keen eye for typography, spatial balance, modern dark mode aesthetics, and color theory",
          "Ability to deliver high-quality work independently under flexible hours"
        ],
        location: "Remote / Work From Home",
        jobType: "Part-time",
        workMode: "Remote",
        category: "Design",
        experienceLevel: "Mid-level",
        salary: 650000,
        positions: 2,
        recruiter: recruiterProfiles[1].profile._id,
        createdBy: recruiterProfiles[1].user._id,
        isActive: true,
      },
      {
        title: "Contract Senior QA Automation Specialist (6-12 Months)",
        description: "High-impact contract role to build resilient automated testing suites for our core financial checkout pipelines. Integrate automated smoke and regression tests into GitHub Actions CI pipelines.",
        requirements: [
          "4+ years specialized in automated API and end-to-end testing with Playwright or Cypress",
          "Experience with performance/load testing using k6 or JMeter",
          "Proficiency in JavaScript/TypeScript and CI/CD integration",
          "Thorough mindset with focus on test flakiness elimination and edge-case validation"
        ],
        location: "Remote / Bengaluru",
        jobType: "Contract",
        workMode: "Remote",
        category: "Software Development",
        experienceLevel: "Mid-level",
        salary: 1600000,
        positions: 2,
        recruiter: recruiterProfiles[0].profile._id,
        createdBy: recruiterProfiles[0].user._id,
        isActive: true,
      },
      {
        title: "Digital Growth & Content Strategist (Social & SEO)",
        description: "Drive organic search visibility, high-converting social campaigns, and authoritative industry thought leadership. You will plan editorial calendars, optimize landing page SEO, and scale brand engagement.",
        requirements: [
          "2+ years in digital marketing, organic SEO, and content distribution",
          "Experience with Google Analytics 4, Ahrefs/Semrush, and conversion rate optimization",
          "Proven success building high-engagement social media campaigns across LinkedIn & Twitter",
          "Strong creative storytelling and analytical performance reporting skills"
        ],
        location: "Gurugram, NCR",
        jobType: "Full-time",
        workMode: "On-site",
        category: "Marketing",
        experienceLevel: "Entry-level",
        salary: 900000,
        positions: 2,
        recruiter: recruiterProfiles[2].profile._id,
        createdBy: recruiterProfiles[2].user._id,
        isActive: true,
      }
    ];

    for (const rp of recruiterProfiles) {
      await Job.deleteMany({ createdBy: rp.user._id });
    }

    const createdJobs = await Job.insertMany(professionalJobs);
    console.log(`Successfully seeded ${createdJobs.length} professional jobs across verified companies!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
};

seedData();

