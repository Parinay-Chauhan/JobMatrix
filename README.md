# 💼 JobMatrix — Next-Gen Full-Stack Hiring & Talent Intelligence Platform

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, production-grade hiring ecosystem built with the **MERN** stack (MongoDB, Express, React, Node.js) and **TypeScript**. Features a dark glassmorphic design system, real-time WebSocket notifications, an intelligent applicant pipeline, and a resilient multi-token auth architecture with silent session recovery.

---

## 🌐 Live Production Deployment

- **Live URL:** [https://project-job-portal-ytq3.onrender.com](https://project-job-portal-ytq3.onrender.com)
- **Deployment Model:** Single-Service Full Stack (SPA + REST API + Socket.IO under one unified domain on Render).

---

## ✨ Key Features & Capabilities

### 👨‍💼 1. Candidate Experience
- **Explore & Filter Jobs:** Search active openings with instant keyword queries, experience level filters (`Entry-level`, `Mid-level`, `Senior-level`), work modes (`Remote`, `Hybrid`, `On-site`), and employment categories.
- **One-Click Application:** Seamless job application workflow with duplicate submission prevention.
- **Live Status Tracker:** Monitor application progress across pipeline stages (`Under Review`, `Shortlisted / Offered`, `Archived / Rejected`).
- **Comprehensive Profile & Timelines:** Manage work experience, education history, technical skills, and candidate summary.
- **Interactive Resume Viewer:** In-browser modal for PDF resumes with fallback direct downloads and multi-mode rendering.
- **Real-Time WebSocket Alerts:** Instant notifications whenever an employer reviews or updates application status.

### 🏢 2. Recruiter & Employer Hub
- **Recruiter Analytics Dashboard:** Stat cards tracking active job inventory, total applicant volume, and hiring status.
- **Job Posting Lifecycle:** Multi-section glassmorphic form for role specifications, requirements, salary budgeting (INR), and headcount.
- **Job Inventory Management:** Search, pagination, and quick navigation across all company postings.
- **Applicant Pipeline & Decisioning:** Filter applicants by status tab (`All`, `Under Review`, `Shortlisted`, `Rejected`), inspect resumes, and update candidate stages with safety confirmation dialogs.
- **Company Branding Profile:** Upload verified company logos, office headquarters, industry tags, and public organization descriptions.

### 🛡️ 3. Security & Session Architecture
- **Dual-Token Authentication:** Secure JWT Access Tokens (short-lived) and Refresh Tokens (long-lived) with HTTP-only cookies and automatic multi-mode fallback.
- **Silent Refresh Interceptor:** Axios response interceptor that transparently refreshes expired sessions and replays pending requests without interrupting the user.
- **Role-Based Access Control (RBAC):** Server-side middleware isolating candidate routes from recruiter management tools.

### 🎨 4. Design System & Aesthetics
- **Dark Glassmorphism Theme:** Custom palette featuring deep slate (`#020617`), glowing emerald accents (`#10b981`), and subtle border glass effects.
- **Floating Header Navigation:** GSAP-animated floating pill navigation with dynamic scroll blur, notifications bell, and quick avatar routing.
- **Responsive Architecture:** Tailored desktop tables, mobile cards, and touch-friendly drawers.

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

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TanStack Query v5, GSAP, Lucide React, Sonner Toasts, React Router v7 |
| **Styling** | Tailwind CSS, Custom Glassmorphic Utilities, Responsive Dark Mode Palette |
| **Backend** | Node.js (ES Modules), Express 5, MongoDB, Mongoose 9, Socket.IO 4.8, Multer, Cloudinary SDK |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, CORS, Cookie-Parser, RBAC Guards |
| **Testing** | Automated Security & RBAC Test Suite, E2E Flow Assertion Suite |

---

## 📁 Repository Structure

```
Job-portal/
├── client/                     # Frontend Vite + React SPA
│   ├── src/
│   │   ├── components/         # Reusable glassmorphic UI components & modals
│   │   │   ├── common/         # Button, Input, Select, Dialogs, Badges
│   │   │   └── home/           # FloatingHeader, Hero, JobGrid
│   │   ├── context/            # AuthContext, JobContext, SocketContext
│   │   ├── hooks/              # Custom React & TanStack Query hooks
│   │   ├── layouts/            # CandidateLayout, RecruiterLayout
│   │   ├── pages/              # Candidate, Recruiter, Login, Register
│   │   ├── services/           # Axios API clients & interceptors
│   │   └── types/              # Full TypeScript interface definitions
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend Express REST API + WebSocket
│   ├── src/
│   │   ├── controllers/        # Auth, Job, Application, Profile controllers
│   │   ├── middlewares/        # Auth, Role guards, Multer file upload
│   │   ├── models/             # User, Job, Application, RecruiterProfile, CandidateProfile
│   │   ├── routes/             # Versioned REST endpoints (/api/v1/*)
│   │   ├── utils/              # ApiResponse, ApiError, AsyncHandler, Cloudinary
│   │   ├── app.js              # Express app configuration & static SPA serving
│   │   └── index.js            # Server entry point & Socket.IO server
│   ├── seed-jobs.js            # Industry-standard job seeding script
│   └── package.json
├── package.json                # Root workspace build & launch orchestrator
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js:** v18.0 or higher
- **npm:** v9.0 or higher
- **MongoDB Atlas** or local MongoDB instance

### 2. Clone & Install
```bash
git clone https://github.com/Parinay-Chauhan/JobMatrix.git
cd JobMatrix
npm run build
```

### 3. Configure Environment Variables

Create `server/.env` (refer to `server/.env.example`):
```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
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

### 4. Seed Verified Jobs & Companies (Optional)
```bash
cd server
node seed-jobs.js
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend Server (Port 8000)
npm run dev:server

# Terminal 2: Frontend Client (Vite Hot-Reload on Port 5173)
npm run dev:client
```

---

## 🧪 Testing & Verification

Run the automated test suites to validate RBAC, endpoint integrity, and security policies:

```bash
# Security & Role-Based Access Control suite (21 assertions)
npm run test:security

# End-to-End Application Flow suite (16 assertions)
npm run test:flow
```

---

## 🚀 Deployment on Render (Single Live URL)

1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your GitHub repository (`main` branch).
3. Set configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Atlas Connection String>`
   - `ACCESS_TOKEN_SECRET`: `<Secret>`
   - `REFRESH_TOKEN_SECRET`: `<Secret>`
   - `CLOUDINARY_CLOUD_NAME`: `<Cloud Name>`
   - `CLOUDINARY_API_KEY`: `<API Key>`
   - `CLOUDINARY_API_SECRET`: `<API Secret>`
   - `CORS_ORIGIN`: `https://<your-service-name>.onrender.com`
   - `VITE_API_BASE_URL`: `/api/v1`
5. Click **Deploy**. Both the client frontend and backend REST API will be served from your single live Render domain.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
