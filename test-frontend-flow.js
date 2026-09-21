const API_BASE = "http://localhost:8000/api/v1";

let passedCount = 0;
let failedCount = 0;

function logPass(msg) {
  console.log(`  ✅ [PASS] ${msg}`);
  passedCount++;
}

function logFail(msg, err) {
  console.error(`  ❌ [FAIL] ${msg}`, err ? `-> ${err}` : "");
  failedCount++;
}

async function runE2ETests() {
  console.log("\n========================================================");
  console.log("🧪 STARTING FRONTEND & API E2E TESTING SUITE");
  console.log("========================================================\n");

  const timestamp = Date.now();
  const candidateEmail = `test.candidate.${timestamp}@example.com`;
  const recruiterEmail = `test.recruiter.${timestamp}@example.com`;
  const candidateUsername = `cand_${timestamp}`;
  const recruiterUsername = `rec_${timestamp}`;
  const testPassword = "Password@123";

  let candidateToken = "";
  let recruiterToken = "";
  let createdJobId = "";
  let submittedAppId = "";

  // 1. REGISTER FLOW
  console.log("📌 1. Testing Registration Flow (Candidate & Recruiter)...");
  try {
    const candRes = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Alex Candidate",
        username: candidateUsername,
        email: candidateEmail,
        password: testPassword,
        role: "candidate",
      }),
    });
    const candData = await candRes.json();
    if (candRes.status === 201 && candData.success) {
      logPass("Candidate registration completed (201 Created)");
    } else {
      logFail("Candidate registration failed", JSON.stringify(candData));
    }

    const recRes = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Sarah Recruiter",
        username: recruiterUsername,
        email: recruiterEmail,
        password: testPassword,
        role: "recruiter",
      }),
    });
    const recData = await recRes.json();
    if (recRes.status === 201 && recData.success) {
      logPass("Recruiter registration completed (201 Created)");
    } else {
      logFail("Recruiter registration failed", JSON.stringify(recData));
    }
  } catch (err) {
    logFail("Registration request error", err.message);
  }

  // 2. LOGIN FLOW
  console.log("\n📌 2. Testing Login Flow & JWT Token Storage...");
  try {
    const candLoginRes = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: candidateEmail, password: testPassword }),
    });
    const candLoginData = await candLoginRes.json();
    if (candLoginRes.status === 200 && candLoginData.data?.accessToken) {
      candidateToken = candLoginData.data.accessToken;
      logPass(`Candidate authenticated -> Token received (Role: ${candLoginData.data.user?.role})`);
    } else {
      logFail("Candidate login failed", JSON.stringify(candLoginData));
    }

    const recLoginRes = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: recruiterEmail, password: testPassword }),
    });
    const recLoginData = await recLoginRes.json();
    if (recLoginRes.status === 200 && recLoginData.data?.accessToken) {
      recruiterToken = recLoginData.data.accessToken;
      logPass(`Recruiter authenticated -> Token received (Role: ${recLoginData.data.user?.role})`);
    } else {
      logFail("Recruiter login failed", JSON.stringify(recLoginData));
    }
  } catch (err) {
    logFail("Login request error", err.message);
  }

  // 3. PROFILE INITIALIZATION & PROTECTED ROUTE RBAC
  console.log("\n📌 3. Testing Protected Route RBAC Access & Profiles...");
  try {
    // Candidate Profile
    const candProfileRes = await fetch(`${API_BASE}/candidates/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candidateToken}`,
      },
      body: JSON.stringify({
        bio: "Frontend Engineer passionate about React & TypeScript",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        location: "Bengaluru",
        phone: "+91 9876543210",
      }),
    });
    const candProfileData = await candProfileRes.json();
    if (candProfileRes.status === 200 || candProfileRes.status === 201) {
      logPass("Candidate profile created/fetched (200 OK)");
    } else {
      logFail("Candidate profile setup failed", JSON.stringify(candProfileData));
    }

    // Recruiter Profile
    const recProfileRes = await fetch(`${API_BASE}/recruiters/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({
        companyName: "InnovateTech Inc",
        companyWebsite: "https://innovatetech.dev",
        location: "Bengaluru",
        industry: "Information Technology",
      }),
    });
    const recProfileData = await recProfileRes.json();
    if (recProfileRes.status === 200 || recProfileRes.status === 201) {
      logPass("Recruiter profile created/fetched (200 OK)");
    } else {
      logFail("Recruiter profile setup failed", JSON.stringify(recProfileData));
    }

    // Role Mismatch Guard: Candidate accessing Recruiter Jobs
    const mismatchRes = await fetch(`${API_BASE}/jobs/my-jobs`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    if (mismatchRes.status === 403) {
      logPass("Candidate blocked from accessing /jobs/my-jobs (403 Forbidden)");
    } else {
      logFail("Role mismatch guard failed", `Status: ${mismatchRes.status}`);
    }
  } catch (err) {
    logFail("Protected route error", err.message);
  }

  // 4. JOB POSTING & SEARCH
  console.log("\n📌 4. Testing Job Creation & Search Filtering...");
  try {
    const jobPayload = {
      title: `Senior Full Stack Developer ${timestamp}`,
      description: "Exciting opportunity to build scalable modern web applications with cutting-edge tech stack.",
      location: "Bengaluru, India",
      jobType: "Full-time",
      workMode: "Remote",
      category: "Software Development",
      experienceLevel: "Senior-level",
      salary: 2200000,
      positions: 2,
      requirements: ["React", "Node.js", "TypeScript"],
    };

    const postJobRes = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify(jobPayload),
    });
    const postJobData = await postJobRes.json();
    if (postJobRes.status === 201 && postJobData.data?._id) {
      createdJobId = postJobData.data._id;
      logPass(`Recruiter posted new job -> ID: ${createdJobId} (201 Created)`);
    } else {
      logFail("Job creation failed", JSON.stringify(postJobData));
    }

    // Search Job by query parameter
    const searchRes = await fetch(`${API_BASE}/jobs?search=Full+Stack`);
    const searchData = await searchRes.json();
    const jobsList = searchData.data?.jobs || (Array.isArray(searchData.data) ? searchData.data : []);
    const found = jobsList.some((j) => j._id === createdJobId);
    if (searchRes.status === 200 && found) {
      logPass("Public job search successfully matched newly created listing (200 OK)");
    } else {
      logFail("Job search verification failed", `Found: ${found}`);
    }
  } catch (err) {
    logFail("Job creation/search error", err.message);
  }

  // 5. JOB APPLICATION FLOW
  console.log("\n📌 5. Testing Candidate Job Application Flow...");
  try {
    const applyRes = await fetch(`${API_BASE}/applications/apply/${createdJobId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${candidateToken}`,
      },
    });
    const applyData = await applyRes.json();
    if (applyRes.status === 201 && applyData.data?._id) {
      submittedAppId = applyData.data._id;
      logPass(`Candidate applied to job -> Application ID: ${submittedAppId} (201 Created)`);
    } else {
      logFail("Job application submission failed", JSON.stringify(applyData));
    }

    // Duplicate application check
    const dupApplyRes = await fetch(`${API_BASE}/applications/apply/${createdJobId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${candidateToken}`,
      },
    });
    if (dupApplyRes.status === 400) {
      logPass("Duplicate application prevented with 400 Bad Request");
    } else {
      logFail("Duplicate application guard failed", `Status: ${dupApplyRes.status}`);
    }

    // Fetch Candidate's submitted applications
    const myAppsRes = await fetch(`${API_BASE}/applications/get`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    const myAppsData = await myAppsRes.json();
    const appsList = Array.isArray(myAppsData.data) ? myAppsData.data : [];
    const appFound = appsList.some((a) => a._id === submittedAppId);
    if (myAppsRes.status === 200 && appFound) {
      logPass("Candidate /applications/get includes newly submitted application (200 OK)");
    } else {
      logFail("Candidate applications list check failed", `App found: ${appFound}`);
    }
  } catch (err) {
    logFail("Application flow error", err.message);
  }

  // 6. RECRUITER STATUS DECISION
  console.log("\n📌 6. Testing Recruiter Status Decision & Shortlist Flow...");
  try {
    const applicantsRes = await fetch(`${API_BASE}/applications/${createdJobId}/applicants`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    const applicantsData = await applicantsRes.json();
    const applicantList = Array.isArray(applicantsData.data) ? applicantsData.data : [];
    const hasCandidate = applicantList.some((a) => a._id === submittedAppId);
    if (applicantsRes.status === 200 && hasCandidate) {
      logPass("Recruiter successfully fetched applicant pipeline for the job (200 OK)");
    } else {
      logFail("Recruiter applicant fetch failed", `Has candidate: ${hasCandidate}`);
    }

    // Shortlist Candidate
    const updateRes = await fetch(`${API_BASE}/applications/status/${submittedAppId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({ status: "accepted" }),
    });
    const updateData = await updateRes.json();
    if (updateRes.status === 200 && updateData.data?.status === "accepted") {
      logPass("Recruiter shortlisted candidate -> Status updated to 'accepted' (200 OK)");
    } else {
      logFail("Status update failed", JSON.stringify(updateData));
    }
  } catch (err) {
    logFail("Recruiter status decision error", err.message);
  }

  // 7. NOTIFICATIONS FLOW
  console.log("\n📌 7. Testing Real-Time Notifications Flow...");
  try {
    // Check candidate notifications
    const candNotifRes = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    const candNotifData = await candNotifRes.json();
    const notifs = candNotifData.data || candNotifData.notifications || (Array.isArray(candNotifData) ? candNotifData : []);
    if (candNotifRes.status === 200 && notifs.length > 0) {
      logPass(`Candidate received notification for application status change (${notifs.length} total)`);
      
      // Mark notification read
      const markRes = await fetch(`${API_BASE}/notifications/${notifs[0]._id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${candidateToken}` },
      });
      if (markRes.status === 200) {
        logPass("Candidate marked notification as read (200 OK)");
      } else {
        logFail("Mark notification read failed", `Status: ${markRes.status}`);
      }
    } else {
      logFail("Candidate notification check failed", JSON.stringify(candNotifData));
    }
  } catch (err) {
    logFail("Notifications flow error", err.message);
  }

  console.log("\n========================================================");
  console.log(`📊 E2E TESTING COMPLETED: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  process.exit(failedCount > 0 ? 1 : 0);
}

runE2ETests();
