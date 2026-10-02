# 💼 JobMatrix — Full-Stack Recruitment Platform & ATS Keyword Optimizer

[![CI Pipeline](https://github.com/Parinay-Chauhan/JobMatrix/actions/workflows/ci.yml/badge.svg)](https://github.com/Parinay-Chauhan/JobMatrix/actions)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern full-stack recruitment platform built on the **MERN** stack (MongoDB, Express 5, React 19, Node.js) with **TypeScript** on the frontend. Features a dark glassmorphic design system, a **client-side heuristic ATS resume keyword optimizer**, real-time WebSocket notifications, an applicant tracking pipeline, and a resilient multi-token auth architecture with database-backed token rotation.

---

## 🌐 Live Deployment & Demo Credentials

- **Live Application:** [https://project-job-portal-ytq3.onrender.com](https://project-job-portal-ytq3.onrender.com)
- **Health Check Status:** [https://project-job-portal-ytq3.onrender.com/health](https://project-job-portal-ytq3.onrender.com/health)

### 🔑 Test Accounts (Instant Login)

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Recruiter** | `talent@stripe.com` | `Password@123` | Post jobs, review applicants, change candidate stages, manage company profile |
| **Candidate** | `candidate@demo.com` *(or create new)* | `Password@123` | Search jobs, 1-click apply, track applications, live ATS resume optimizer |

---

## ⚡ Core Features

### 1. ATS Resume Keyword Optimizer
- **Dual Mode Input:** Analyze against active platform job postings or paste any custom Job Description (JD) from LinkedIn/Indeed.
- **Rule-Based Skill Extraction:** Categorized dictionary across 150+ technical skills (Frontend, Backend, DevOps/Cloud, Databases, AI/ML, and Core CS).
- **Weighted Match Scoring (0–100%):** Categorizes candidates into readiness bands (`Excellent Match`, `Strong Match`, `Good Match`, `Optimization Required`).
- **1-Click Skill Boosting:** Add missing target keywords directly to the candidate profile with instant score recalculation.
- **Tailored Bullet Point Generator:** Creates action-oriented, quantifiable bullet points aligned with the target role.
- **5-Point Compliance Checklist:** Evaluates keyword coverage, verified PDF upload, measurable work experience, contact details, and education accreditation.

### 2. Candidate Workflow
- **Job Discovery & Multi-Filter Search:** Filter by experience level (`Entry-level`, `Mid-level`, `Senior-level`), work mode (`Remote`, `Hybrid`, `On-site`), and categories.
- **One-Click Application:** Direct application submission with duplicate submission prevention.
- **Live Status Tracker:** Track status transitions (`Under Review`, `Shortlisted`, `Rejected`).
- **In-Browser Resume Preview:** Integrated PDF viewer modal with fallback direct download.
- **Real-Time Alerts:** Instant notifications on application status changes via Socket.IO.

### 3. Recruiter Hub & Pipeline Management
- **Dashboard Metrics:** Live summary of active job listings, applicant volume, and pipeline distribution.
- **Job Posting Lifecycle:** Multi-section form covering role requirements, salary ranges (INR), and headcount.
- **Applicant Decisioning:** Status-based tabs (`All`, `Under Review`, `Shortlisted`, `Rejected`) with safety confirmation modals.
- **Company Branding:** Manage verified organization descriptions, headquarters, and branding assets.

---

## 🛡️ Authentication & Security Architecture

```
Client (Axios / Browser)                        Server (Express + MongoDB)
       │                                                    │
       ├─── 1. POST /api/v1/users/login ───────────────────>│ (Verify password via bcrypt)
       │<── 2. Set-Cookie: accessToken (15m, HttpOnly) ─────┤ (Generate JWT pair,
       │<──    Set-Cookie: refreshToken (7d, HttpOnly) ─────┤  Store refreshToken in User document)
       │                                                    │
       ├─── 3. Request with expired accessToken ───────────>│
       │<── 4. 401 Unauthorized ───────────────────────────┤
       │                                                    │
       ├─── 5. POST /api/v1/users/refresh-token ───────────>│ (Verify incoming token matches DB)
       │<── 6. New accessToken + Rotated refreshToken ──────┤ (Rotate & update User document)
       │                                                    │
       ├─── 7. POST /api/v1/users/logout ──────────────────>│ (Remove refreshToken from DB,
       │<── 8. Clear Cookies ───────────────────────────────┤  clear cookies)
```

1. **Dual-Token JWT Architecture:**
   - **Access Token (Short-lived - 15 mins):** Carries user identity and role for stateless authorization.
   - **Refresh Token (Long-lived - 7 days):** Encrypted JWT stored both in an `HttpOnly` cookie and persisted in the MongoDB `User` document.
2. **Server-Side Token Rotation & Revocation:**
   - On token refresh (`/api/v1/users/refresh-token`), the server verifies that the incoming refresh token matches the database record. A new token pair is issued, and the stored refresh token is rotated.
   - On logout (`/api/v1/users/logout`), the server executes `$unset: { refreshToken: "" }` in MongoDB and clears browser cookies, immediately invalidating any stolen session tokens.
3. **Silent Refresh Interceptor:**
   - Axios response interceptor intercepts `401` errors, buffers concurrent failing requests in a queue, requests a new access token, and transparently replays original requests without interrupting user workflow.
4. **Authenticated Socket.IO Handshake:**
   - WebSocket connection runs handshake authentication middleware (`io.use`) verifying JWT before connection approval.
   - Users are isolated into private rooms (`socket.join(userId)`), ensuring notifications are only delivered to authorized recipients.
5. **Asset Storage:**
   - Resume PDFs and company logos are uploaded via Multer and stored on Cloudinary with sanitized filenames.

---

## 🏗️ Architectural Flow

```
                      Render Production Environment
                                    │
                         Unified Express Server
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
   React 19 SPA (dist)           REST API                  Socket.IO
    (Vite Bundled)              /api/v1/*                 /socket.io
         │                          │                          │
         └──────────────────────────┴──────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
             MongoDB Atlas                 Cloudinary Storage
       (Jobs, Users, Profiles)             (Resumes & Logos)
```

---

## 💡 Engineering Decisions & Trade-offs

| Decision | Approach Chosen | Rationale & Trade-offs |
|---|---|---|
| **ATS Engine** | Client-Side Heuristic Tokenizer | **Chosen:** 0ms latency, zero third-party API costs, complete candidate data privacy.<br>**Trade-off:** Lacks semantic understanding of nuanced job synonyms compared to cloud LLM embeddings. |
| **Deployment Model** | Single-Service Monorepo on Render | **Chosen:** Express serves both the pre-built React SPA static files and REST API from a single domain, eliminating cross-origin third-party cookie restrictions.<br>**Trade-off:** Frontend and backend share the same compute instance. |
| **Real-Time Scaling** | In-Memory Socket.IO Rooms | **Chosen:** Zero external infrastructure dependencies for single-instance hosting.<br>**Trade-off:** Multi-instance horizontal scaling requires adding a Redis Pub/Sub adapter. |
| **Type Safety** | TypeScript Frontend + Node.js Backend | **Chosen:** Full type safety across state management, UI props, and API response contracts on the frontend; lightweight native ES Modules on the backend. |

---

## ⚠️ Known Limitations & Future Roadmap

- [ ] **Socket.IO Horizontal Scaling:** Implement `@socket.io/redis-adapter` with Redis to support multi-instance load balancing.
- [ ] **Backend TypeScript Migration:** Migrate backend controllers and models to TypeScript with runtime schema validation (Zod / Joi).
- [ ] **API Security Hardening:** Integrate `helmet` for HTTP security headers and `express-rate-limit` for DDoS / brute-force protection.
- [ ] **Embeddings-Based Semantic Matching:** Integrate OpenAI / Gemini Embeddings as an optional backend vector search layer to complement heuristic keyword matching.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Query v5, GSAP, Lucide Icons, Sonner Toasts, React Router v7 |
| **Styling** | Tailwind CSS, Custom Glassmorphic Utilities, Responsive Dark Mode Palette |
| **Backend** | Node.js (ES Modules), Express 5, MongoDB, Mongoose 9, Socket.IO 4.8, Multer, Cloudinary SDK |
| **Security** | JSON Web Tokens (JWT), Bcrypt, Cookie-Parser, RBAC Guards, DB-backed Token Revocation |
| **CI / DevOps** | GitHub Actions (`ci.yml`), Render Single-Service Deployment, UptimeRobot 5-min Keep-Alive |

---

## 📁 Directory Layout

```
Job-portal/
├── .github/workflows/          # GitHub Actions CI pipeline
│   └── ci.yml
├── client/                     # Frontend React 19 + TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable glassmorphic UI components & modals
│   │   ├── context/            # AuthContext, JobContext, SocketContext
│   │   ├── hooks/              # Custom React & TanStack Query hooks
│   │   ├── layouts/            # CandidateLayout, RecruiterLayout
│   │   ├── pages/              # ResumeOptimizer, CandidateProfile, RecruiterDashboard
│   │   ├── services/           # Axios client & silent refresh interceptor
│   │   ├── utils/              # atsEngine.ts (Heuristic Tokenizer & Match Scorer)
│   │   └── types/              # TypeScript interface definitions
│   └── vite.config.ts
├── server/                     # Backend Express 5 REST API + Socket.IO
│   ├── src/
│   │   ├── controllers/        # Auth, Job, Application, Profile controllers
│   │   ├── middleware/         # Auth, Role guards, Multer upload, ErrorHandler
│   │   ├── models/             # User, Job, Application, RecruiterProfile, CandidateProfile
│   │   ├── routes/             # Versioned REST endpoints (/api/v1/*)
│   │   ├── app.js              # Express app configuration & static SPA serving
│   │   ├── index.js            # Server entry point & HTTP listener
│   │   └── socket.js           # Authenticated Socket.IO initialization
│   ├── seed-jobs.js            # Verified job & recruiter seeding script
│   └── package.json
├── package.json                # Monorepo build and installation scripts
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js:** v20.0 or higher
- **npm:** v9.0 or higher
- **MongoDB Atlas** or a local MongoDB database

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/Parinay-Chauhan/JobMatrix.git
cd JobMatrix
npm run install:all
```

### 3. Environment Variables Configuration

Create `server/.env` (refer to `server/.env.example`):
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret_key_32_chars
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret_key_32_chars
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Create `client/.env` (refer to `client/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

### 4. Seed Verified Data (Optional)
```bash
cd server
node seed-jobs.js
cd ..
```

### 5. Run Development Servers
```bash
# Terminal 1: Backend API (Port 8000)
npm run dev:server

# Terminal 2: Frontend Vite Client (Port 5173)
npm run dev:client
```

---

## 🧪 Testing & Verification

```bash
# Run security & RBAC verification script
npm run test:security

# Run end-to-end user workflow test script
npm run test:flow
```

---

## 🚀 Production Deployment on Render

1. Create a **New Web Service** on [Render](https://render.com) connected to the `main` branch.
2. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
3. Add environment variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Atlas Connection String>`
   - `ACCESS_TOKEN_SECRET`: `<Secret>`
   - `REFRESH_TOKEN_SECRET`: `<Secret>`
   - `CLOUDINARY_CLOUD_NAME`: `<Cloud Name>`
   - `CLOUDINARY_API_KEY`: `<API Key>`
   - `CLOUDINARY_API_SECRET`: `<API Secret>`
   - `CORS_ORIGIN`: `https://<your-service-name>.onrender.com`
   - `VITE_API_BASE_URL`: `/api/v1`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
