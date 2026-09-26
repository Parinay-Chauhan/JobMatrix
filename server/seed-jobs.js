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

    // 1. Find or create a demo recruiter user
    let recruiterUser = await User.findOne({ email: "recruiter@jobmatrix.com" });
    if (!recruiterUser) {
      recruiterUser = await User.create({
        username: "nexusrecruiter",
        fullName: "JobMatrix Talent Lead",
        email: "recruiter@jobmatrix.com",
        password: "Password@123",
        role: "recruiter",
        avatar: "",
      });
      console.log("Created demo recruiter user:", recruiterUser._id);
    }

    // 2. Find or create recruiter profiles
    let recruiterProfile = await RecruiterProfile.findOne({ user: recruiterUser._id });
    if (!recruiterProfile) {
      recruiterProfile = await RecruiterProfile.create({
        user: recruiterUser._id,
        companyName: "Nexus Technologies",
        designation: "Head of Talent Acquisition",
        experience: "8+ Years",
        phone: "+91 9876543210",
        bio: "Hiring exceptional engineering, design, and product talent worldwide.",
        companyWebsite: "https://nexus-tech.example.com",
        companyDescription: "Leading global technology enterprise creating cutting-edge cloud and web solutions.",
        location: "Bengaluru, India",
        industry: "Information Technology",
        companyLogo: "",
      });
      console.log("Created demo recruiter profile:", recruiterProfile._id);
    }

    // 3. Define 7 clean, realistic jobs matching all popular categories
    const sampleJobs = [
      {
        title: "Junior Frontend Engineer (Fresher / 2024-2026 Batch)",
        description: "Great opportunity for fresh engineering graduates to join our core web development team. You will build modern, accessible user interfaces using React, TypeScript, and Tailwind CSS under senior mentorship.",
        requirements: ["HTML5, Modern CSS & JavaScript (ES6+)", "Basic understanding of React or Vue.js", "Problem solving, fast learner & team player"],
        location: "Bengaluru, Karnataka",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Software Development",
        experienceLevel: "Entry-level",
        salary: 650000,
        positions: 4,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Full Stack React & Node Developer (100% Remote)",
        description: "Join our globally distributed team to architect high-performance cloud applications. Work on customer-facing dashboards, real-time messaging, and high-throughput APIs from the comfort of your home.",
        requirements: ["React.js, Next.js, and TypeScript", "Node.js & Express / NestJS", "MongoDB or PostgreSQL", "REST APIs & Git workflow"],
        location: "Remote / Work From Home",
        jobType: "Full-time",
        workMode: "Remote",
        category: "Software Development",
        experienceLevel: "Mid-level",
        salary: 1450000,
        positions: 3,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Part-time Technical Content Writer & Reviewer",
        description: "Flexible part-time role (15-20 hours per week). Write technical tutorials, developer guides, and engineering blog posts for a high-traffic developer community.",
        requirements: ["Strong command of English grammar and technical writing", "Familiarity with web technologies & coding concepts", "Ability to dedicate 3-4 flexible hours daily"],
        location: "Remote / Flexible Shifts",
        jobType: "Part-time",
        workMode: "Remote",
        category: "Marketing",
        experienceLevel: "Entry-level",
        salary: 380000,
        positions: 2,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Product Designer - UI/UX (Women in Tech Initiative)",
        description: "Equal-opportunity initiative focused on accelerating women in product leadership. Lead intuitive UX research, design systems, and delightful interfaces for fintech solutions.",
        requirements: ["Figma, Wireframing & Prototyping", "User research and empathetic UX thinking", "Experience collaborating with engineering teams"],
        location: "Gurugram, NCR / Hybrid",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Design",
        experienceLevel: "Mid-level",
        salary: 1300000,
        positions: 2,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Backend Engineer - Go & Distributed Systems (Full Time)",
        description: "Scale high-concurrency microservices processing millions of daily transactions. Implement asynchronous queues, caching, and robust database architectures.",
        requirements: ["Go (Golang) or Java / Node.js", "Docker, Kubernetes, and AWS/GCP", "PostgreSQL, Redis & Kafka/RabbitMQ", "Clean code and unit testing standards"],
        location: "Hyderabad, Telangana",
        jobType: "Full-time",
        workMode: "On-site",
        category: "Software Development",
        experienceLevel: "Mid-level",
        salary: 1850000,
        positions: 3,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Graduate Engineer Trainee - Cloud & DevOps (Freshers Welcome)",
        description: "Kickstart your career in cloud infrastructure and DevOps. Includes comprehensive certification support for AWS/Azure, CI/CD pipeline automation, and production monitoring.",
        requirements: ["B.Tech / B.E / BCA / MCA / B.Sc IT", "Linux command line & basic networking", "Eagerness to learn DevOps, Docker, and Cloud tools"],
        location: "Pune, Maharashtra",
        jobType: "Full-time",
        workMode: "Hybrid",
        category: "Software Development",
        experienceLevel: "Entry-level",
        salary: 580000,
        positions: 5,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
      {
        title: "Remote QA Automation Tester (Part-time / Flexible)",
        description: "Flexible 20 hours per week role to design automated test suites using Playwright and Cypress. Validate web and mobile user flows before product releases.",
        requirements: ["JavaScript/TypeScript automation testing", "Playwright, Cypress, or Selenium", "Bug tracking and API testing with Postman"],
        location: "Remote / Work From Home",
        jobType: "Part-time",
        workMode: "Remote",
        category: "Software Development",
        experienceLevel: "Mid-level",
        salary: 550000,
        positions: 2,
        recruiter: recruiterProfile._id,
        createdBy: recruiterUser._id,
        isActive: true,
      },
    ];

    // Remove older sample jobs to avoid duplicates if re-run
    await Job.deleteMany({ createdBy: recruiterUser._id });

    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Successfully seeded ${createdJobs.length} jobs across all popular categories!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
};

seedData();
