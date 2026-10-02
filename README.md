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

A full-stack recruitment platform built with the **MERN** stack (MongoDB, Express 5, React 19, Node.js) with **TypeScript** on the frontend. Features a dark glassmorphic design system, a **client-side heuristic ATS resume keyword optimizer**, real-time WebSocket notifications, an applicant tracking pipeline, and a hardened authentication system with SHA-256 hashed refresh tokens, rate limiting, and Zod request validation.

---

## 🌐 Live Deployment & Demo Credentials

- **Live Application:** [https://project-job-portal-ytq3.onrender.com](https://project-job-portal-ytq3.onrender.com)
- **Health Check Status:** [https://project-job-portal-ytq3.onrender.com/health](https://project-job-portal-ytq3.onrender.com/health)

### 🔑 Test Accounts (Instant Evaluation)

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Demo Recruiter** | `recruiter.demo@jobmatrix.dev` | `Password@123` | Post jobs, review applicants, update candidate stages, manage company profile |
| **Demo Candidate** | `candidate.demo@jobmatrix.dev` | `Password@123` | Search jobs, 1-click apply, track applications, live ATS resume optimizer |

---

## ⚡ Core Features

### 1. ATS Resume Keyword Optimizer
- **Dual Mode Input:** Analyze against active platform job postings or paste any custom Job Description (JD) from LinkedIn/Indeed.
- **Rule-Based Skill Extraction:** Categorized dictionary across 150+ technical skills (Frontend, Backend, DevOps/Cloud, Databases, AI/ML, and Core CS).
- **Weighted Match Scoring (0–100%):** Categorizes candidates into readiness bands (`Excellent Match`, `Strong Match`, `Good Match`, `Optimization Required`).
- **Target Keyword Identification:** Highlights matching skills in green and missing keywords in amber. *(Design note: Intended as an exploratory gap analysis tool to help candidates surface relevant skills they possess that ATS filters search for).*
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
- **Company Branding:** Manage organization descriptions, headquarters, and branding assets.

---

## 🛡️ Authentication & Security Architecture

```
Client (Axios / Browser)                        Server (Express + MongoDB)
       │                                                    │
       ├─── 1. POST /api/v1/users/login ───────────────────>│ (Rate limit + Zod validation)
       │<── 2. Set-Cookie: accessToken (15m, HttpOnly) ─────┤ (Generate signed JWT pair,
       │<──    Set-Cookie: refreshToken (7d, HttpOnly) ─────┤  Store SHA-256(refreshToken) in DB)
       │                                                    │
       ├─── 3. Request with expired accessToken ───────────>│
       │<── 4. 401 Unauthorized ───────────────────────────┤
       │                                                    │
       ├─── 5. POST /api/v1/users/refresh-token ───────────>│ (Verify SHA-256(incoming) == DB hash)
       │<── 6. New accessToken + Rotated refreshToken ──────┤ (Rotate hash & update User document)
       │                                                    │
       ├─── 7. POST /api/v1/users/logout ──────────────────>│ (Execute $unset: { refreshToken: "" },
       │<── 8. Clear Cookies ───────────────────────────────┤  clear HttpOnly cookies)
```

1. **Signed Dual-Token JWT Flow:**
   - **Access Token (Short-lived - 15 mins):** Cryptographically signed JWT (HMAC-SHA256) carrying user ID and role for stateless authorization.
   - **Refresh Token (Long-lived - 7 days):** Cryptographically signed JWT. To prevent database leak exploitation, only its **SHA-256 hash** is persisted in the MongoDB `User` document.
2. **Server-Side Token Rotation & Invalidation:**
   - On `/api/v1/users/refresh-token`, the server computes the SHA-256 hash of the incoming token, verifies it against the database record, issues a new token pair, and rotates the stored hash.
   - On `/api/v1/users/logout`, the server removes the stored hash via `$unset: { refreshToken: "" }` and clears client cookies. The refresh token is revoked immediately; the stateless access token expires within its short 15-minute TTL.
   - *Session Policy:* Single active refresh token per user (logging in on a new device replaces the active session token hash).
3. **Cookie Configuration:**
   - Transported via `HttpOnly` cookies with `Secure: true` in production and `SameSite: Lax` (or `SameSite: None` with HTTPS for cross-origin setups) to mitigate XSS and CSRF exposure.
4. **Silent Refresh Interceptor:**
   - Axios response interceptor intercepts `401` errors, buffers concurrent requests in a queue, requests a refreshed token pair, and transparently replays original requests.
5. **Authenticated Socket.IO Handshake:**
   - WebSocket connection runs handshake middleware (`io.use`) verifying JWT before connection approval.
   - Users are bound to private rooms (`socket.join(userId)`), isolating notifications to authorized recipients.
6. **API Hardening & Upload Controls:**
   - **Helmet:** Sets secure HTTP response headers.
   - **Express Rate Limiting:** Global rate limiting (500 req/15 min) with strict auth rate limiting (30 attempts/15 min per IP) on login and registration.
   - **Zod Schema Validation:** Applied on auth (`/register`, `/login`) and job posting endpoints.
   - **Multer File Validation:** Enforces a strict 5MB maximum file size limit and MIME-type verification (`PDF`, `DOCX`, `JPEG`, `PNG`).

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
| **ATS Engine** | Client-Side Heuristic Tokenizer | **Chosen:** Near-instant evaluation (<10ms), zero external API billing, complete candidate data privacy.<br>**Trade-off:** Lacks semantic understanding of nuanced job synonyms compared to cloud LLM embeddings. |
| **Deployment Model** | Single-Service Monorepo on Render | **Chosen:** Express serves both the pre-built React SPA static files and REST API from a single domain, eliminating cross-origin third-party cookie restrictions.<br>**Trade-off:** Frontend and backend share the same compute instance. |
| **Real-Time Scaling** | In-Memory Socket.IO Rooms | **Chosen:** Zero external infrastructure dependencies for single-instance hosting.<br>**Trade-off:** Multi-instance horizontal scaling requires adding a Redis Pub/Sub adapter. |
| **Type Safety** | TypeScript Frontend + Node.js Backend | **Chosen:** Full type safety across state management, UI props, and API response contracts on the frontend; runtime schema validation with Zod on the backend. |

---

## ⚠️ Known Limitations & Future Roadmap

- [ ] **Socket.IO Multi-Instance Scaling:** Implement `@socket.io/redis-adapter` with Redis to support multi-instance horizontal clustering.
- [ ] **Backend TypeScript Migration:** Incrementally migrate backend models and controllers from ES Modules to TypeScript.
- [ ] **Granular Session Management:** Migrate from single-token schema to a multi-device `sessions` collection with device fingerprinting and family-level reuse detection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Query v5, GSAP, Lucide Icons, Sonner Toasts, React Router v7 |
| **Styling** | Tailwind CSS, Custom Glassmorphic Utilities, Responsive Dark Mode Palette |
| **Backend** | Node.js (ES Modules), Express 5, MongoDB, Mongoose 9, Socket.IO 4.8, Multer, Cloudinary SDK |
| **Security & Validation** | Signed JWTs, Bcrypt, SHA-256 Token Hashing, Helmet, Express-Rate-Limit, Zod Schemas |
| **CI / DevOps** | GitHub Actions (`ci.yml` with MongoDB 7.0 service container), Render Hosting, UptimeRobot 5-min Ping |

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

### 4. Seed Curated Sample Data (Optional)
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
