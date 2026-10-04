# 💼 Case Study: JobMatrix — Real-Time Hiring & Talent Intelligence Platform

---

## 📌 Context / Background
Recruitment platforms often struggle with fragmented user experiences, insecure session management, and delayed communication between hiring teams and candidates. Candidates submit applications without visibility into evaluation stages, while recruiters face cumbersome tools vulnerable to unauthorized data access. 

**JobMatrix** was developed as a comprehensive full-stack recruitment ecosystem designed to demonstrate robust system architecture, complex asynchronous data workflows, resilient security mechanisms, and modern UI/UX design principles. It solves key operational bottlenecks through real-time event streaming, dual-token security, role-based workflows, and client-side ATS intelligence.

---

## 🚀 Overview
**JobMatrix** is a production-grade full-stack hiring platform built with **React 19, TypeScript, Node.js, Express, MongoDB Atlas, and Socket.IO**. It showcases core technical capabilities in building end-to-end applications with secure authentication, real-time WebSocket state synchronization, modular API design, an intelligent applicant pipeline, and a client-side ATS keyword analyzer.

---

## 🎯 Problem Statement
Developing a modern recruitment platform requires solving complex state management, data integrity, seamless client-server communication, and optimal database querying without compromising performance or security:
- **Session Vulnerabilities:** Traditional single-token JWTs stored in `localStorage` are vulnerable to XSS attacks, while naive refresh tokens lack rotation and reuse detection.
- **Data Isolation & IDOR Risks:** Multi-tenant recruiter portals risk unauthorized cross-access to candidate applications and job postings.
- **Latency in Application Status:** Polling-based architectures cause server strain and delay critical status updates to candidates.
- **Opaque Candidate Feedback:** Candidates lack actionable insights into how well their resumes align with target job descriptions.

---

## ⚡ Challenges
- **Dual-Token Auth & Concurrent Request Queuing:** Designing a resilient authentication system with 15-minute access tokens and 7-day refresh tokens that transparently refreshes expired sessions using Axios interceptors without race conditions during simultaneous API calls.
- **Cross-Tenant Data Isolation (IDOR Defense):** Enforcing strict Role-Based Access Control (RBAC) and ownership verification so competing recruiters cannot view, edit, or manipulate each other's candidate pipelines.
- **Real-Time Bidirectional Event Synchronization:** Implementing Socket.IO room-based event broadcasting so candidate application status changes (`Under Review`, `Shortlisted`, `Rejected`) reflect instantly across devices without page reloads.
- **Rule-Based Client-Side ATS Analyzer:** Engineering an in-browser keyword extraction and frequency analysis engine comparing resume text against job requirements with zero backend overhead.
- **Automated Verification & CI/CD Pipeline:** Constructing a reproducible GitHub Actions workflow executing TypeScript type checks, a 26-assertion security/RBAC audit suite, and a 16-assertion E2E integration flow suite against real MongoDB containers.

---

## 💡 Solution
I architected and developed a full-stack web application using the **MERN + TypeScript** stack with clean separation of concerns:
- **Robust Security Architecture:** Implemented SHA-256 hashed refresh tokens stored in MongoDB with unique cryptographic `jti` identifiers, paired with HttpOnly cookies, Helmet security headers, Express rate limiting, and Zod schema validation.
- **Silent Refresh Interceptor:** Built an Axios interceptor with a pending request queue (`failedQueue`) that buffers concurrent failed requests while a single refresh token exchange occurs, replaying them seamlessly once renewed.
- **Real-Time WebSocket Pipeline:** Integrated Socket.IO for immediate status updates and alert notifications.
- **Modern Glassmorphic Frontend:** Developed a responsive cyber-themed UI using React 19, TypeScript, Tailwind CSS, GSAP 3D tilt and cursor magnetism, and `<MagicBento />` interactive cards.

---

## ✨ Key Features
- **Dual-Token Auth with Rotation & Reuse Detection:** 15-minute JWT access tokens and 7-day refresh tokens in HttpOnly cookies; tokens rotate on refresh and are invalidated upon logout.
- **Role-Based Workspaces (Candidate & Recruiter):** 
  - *Candidates:* Filter jobs by experience/mode, 1-click apply with duplicate prevention, live status tracking, PDF resume viewer, and ATS keyword optimizer.
  - *Recruiters:* Job analytics dashboard, multi-step job creation, applicant review pipeline, and status update confirmation dialogs.
- **Real-Time WebSocket Alerts:** Instant push notifications via Socket.IO whenever an application status changes.
- **Rule-Based ATS Keyword Matcher:** Client-side algorithm comparing profile skills and resumes against job requirements to calculate match scores and missing keywords.
- **MagicBento Interactive UI:** Dynamic spotlight cursor tracking, 3D perspective tilt, magnetism, particle star animations, and custom glowing borders.
- **Battle-Tested Automated CI/CD:** GitHub Actions pipeline running TypeScript builds, 26 security/RBAC tests, and 16 E2E flow tests with 100% pass rate.

---

## 📊 Results & Impact
> **Successfully developed and deployed a fully functional, high-performance recruitment platform with 100% automated test coverage (26/26 Security assertions & 16/16 E2E Flow assertions), sub-100ms real-time status synchronization, and zero security vulnerabilities across IDOR, mass assignment, and session hijacking vectors.**

---

## 🛠️ Sidebar Specifications

### 💻 Tech Stack
- `React 19`
- `TypeScript`
- `Node.js`
- `Express 5`
- `MongoDB Atlas`
- `Socket.IO`
- `TanStack Query v5`
- `Tailwind CSS`
- `GSAP`
- `Zod`
- `JWT & Bcrypt`
- `Cloudinary`

### 👤 My Role
- Architected the complete full-stack application from scratch.
- Designed and built RESTful API endpoints and WebSocket architecture with Node.js, Express, and Socket.IO.
- Structured MongoDB database schemas, indexing, and transactional operations.
- Implemented modern, interactive frontend interfaces in React 19, TypeScript, and Tailwind CSS.
- Built dual-token authentication, role guards (RBAC), and Axios silent refresh interceptors.
- Handled CI/CD deployment, automated test suites (42 total assertions), and performance optimization.

### 👥 Team
- **Design & Full-Stack Development** — Parinay Chauhan

### ⏱️ Timeline
- **3 - 4 Weeks**
