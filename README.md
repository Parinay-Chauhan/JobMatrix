# 💼 Job Portal - Enterprise Full-Stack Web Application

A modern, production-ready, full-stack Job Portal built with the **MERN** stack (MongoDB, Express, React, Node.js) and **TypeScript**. Designed for high performance, enterprise security, and seamless deployment as a unified single-service on platforms like **Render**.

---

## Live Demo

Try the deployed application: [https://project-job-portal-ytq3.onrender.com](https://project-job-portal-ytq3.onrender.com)


## 🚀 Key Features

### 👨‍💼 Candidate Experience
- **Smart Job Search & Filters:** Search jobs in real-time by title, keywords, location, employment type, and salary range.
- **One-Click Application:** Apply to active listings with automatic duplicate application prevention.
- **Application Tracking:** Live dashboard with status badges (`Pending`, `Reviewing`, `Accepted`, `Rejected`).
- **Profile & Resume Management:** Dynamic profile with skills, experience, education, and Cloudinary-backed resume uploads.
- **Real-Time Notifications:** Instant WebSocket alerts when recruiter updates application decisions.

### 🏢 Recruiter Management
- **Job Posting & Lifecycle Control:** Create rich job listings with active/closed status toggles.
- **Applicant Pipeline & Decisioning:** Filter and review candidate submissions with direct resume view and status updates (`Shortlist`, `Reject`, `Review`).
- **Role-Based Access Control (RBAC):** Strict authorization preventing candidate tampering or cross-recruiter applicant inspection.

### ⚡ Performance & Production Architecture
- **Single-Origin Deployment:** Express server hosts both the REST API and the compiled React SPA from one unified domain. Frontend, REST API, and Socket.IO are served from the same origin, minimizing cross-origin configuration requirements.
- **Route-Level Code Splitting:** `React.lazy` and `Suspense` page loader with Rollup vendor chunking (`vendor-react`, `vendor-query`, `vendor-socket`, `vendor-ui`).
- **TanStack Query v5 Server State:** Intelligent background cache synchronization with WebSocket invalidations (`staleTime: 3m`, `gcTime: 15m`).
- **Strict Security:** HTTP-Only cookie handling, JWT access & refresh tokens, Axios 401 reactive interceptor, and comprehensive RBAC guards.

---

## 🏗️ Architecture & Deployment Flow

```
                     Render / Production Server
                                │
                       Node / Express Server
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
  React SPA (dist)           REST API                Socket.IO
   (Static Assets)          /api/v1/*                /socket.io
        │                       │                        │
        └───────────────────────┴────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   │                         │
             MongoDB Atlas              Cloudinary
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TanStack Query v5, Lucide React, Sonner Toasts, Vanilla CSS Design System
- **Backend:** Node.js, Express 5, MongoDB, Mongoose 9, Socket.IO, Multer, Cloudinary, JWT, Bcrypt
- **Testing:** Custom automated E2E & security test suites (37 test assertions)

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Job-portal
npm run build
```

### 2. Environment Variables
Create `.env` inside `server/` (refer to `server/.env.example`):
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create `.env` inside `client/` (refer to `client/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

### 3. Run Locally

#### Option A: Single Unified Server (Production Preview)
```bash
npm start
```
Visit `http://localhost:8000` in your browser.

#### Option B: Independent Hot-Reload Dev Servers
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend (Vite HMR)
npm run dev:client
```

---

## 🧪 Automated Testing

Run the built-in test suites to verify functionality and security guards:

```bash
# 1. Run Security & RBAC Audit Suite (21 test cases)
npm run test:security

# 2. Run Full Frontend Flow & Business Logic Suite (16 test cases)
npm run test:flow
```

---

## 🌐 Deploying to Render (Single Live URL)

1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables on Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Atlas Connection String>`
   - `ACCESS_TOKEN_SECRET`: `<Secret>`
   - `REFRESH_TOKEN_SECRET`: `<Secret>`
   - `CLOUDINARY_CLOUD_NAME`: `<Cloud Name>`
   - `CLOUDINARY_API_KEY`: `<API Key>`
   - `CLOUDINARY_API_SECRET`: `<API Secret>`
   - `CORS_ORIGIN`: `https://<your-service-name>.onrender.com`
   - `VITE_API_BASE_URL`: `/api/v1`
5. Click **Deploy Web Service**. You will get a single live URL (e.g., `https://your-job-portal.onrender.com`) where the frontend, REST API, and Socket.IO are served together from the same origin!
