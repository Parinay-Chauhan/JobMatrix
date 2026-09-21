// Comprehensive Security & Edge-Case Audit Test Script
// Tests RBAC, JWT validation, cross-role protections, duplicate application guards, inactive job guards, and ownership authorization.

const BASE_URL = "http://localhost:8000/api/v1";

let passedCount = 0;
let failedCount = 0;

function logPass(testName, details = "") {
  passedCount++;
  console.log(`  ✅ [PASS] ${testName} ${details ? `(${details})` : ""}`);
}

function logFail(testName, reason = "") {
  failedCount++;
  console.error(`  ❌ [FAIL] ${testName}: ${reason}`);
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

async function runSecurityAudit() {
  console.log("\n========================================================");
  console.log("🔒 STARTING SECURITY & EDGE-CASE AUDIT SUITE");
  console.log("========================================================\n");

  // ----------------------------------------------------
  // GROUP 1: UNAUTHENTICATED ACCESS GUARDS (Expect 401)
  // ----------------------------------------------------
  console.log("📌 1. Testing Unauthenticated Route Guards (Expect 401):");

  const unauth1 = await request("/candidates/profile");
  if (unauth1.status === 401) {
    logPass("Unauthenticated /candidates/profile blocked with 401");
  } else {
    logFail("Unauthenticated /candidates/profile", `Got status ${unauth1.status}`);
  }

  const unauth2 = await request("/recruiters/profile");
  if (unauth2.status === 401) {
    logPass("Unauthenticated /recruiters/profile blocked with 401");
  } else {
    logFail("Unauthenticated /recruiters/profile", `Got status ${unauth2.status}`);
  }

  const unauth3 = await request("/jobs/my-jobs");
  if (unauth3.status === 401) {
    logPass("Unauthenticated /jobs/my-jobs blocked with 401");
  } else {
    logFail("Unauthenticated /jobs/my-jobs", `Got status ${unauth3.status}`);
  }

  const unauth4 = await request("/applications/get");
  if (unauth4.status === 401) {
    logPass("Unauthenticated /applications/get blocked with 401");
  } else {
    logFail("Unauthenticated /applications/get", `Got status ${unauth4.status}`);
  }

  // ----------------------------------------------------
  // GROUP 2: INVALID / MALFORMED JWT GUARDS (Expect 401)
  // ----------------------------------------------------
  console.log("\n📌 2. Testing Invalid / Malformed JWT Handling (Expect 401):");

  const invalidJwt = await request("/candidates/profile", {
    headers: { Authorization: "Bearer this.is.an.invalid.token.structure" },
  });
  if (invalidJwt.status === 401) {
    logPass("Malformed JWT correctly rejected with 401");
  } else {
    logFail("Malformed JWT", `Got status ${invalidJwt.status}`);
  }

  const expiredJwt = await request("/candidates/profile", {
    headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTYiLCJleHAiOjE2MDAwMDAwMDB9.signature" },
  });
  if (expiredJwt.status === 401) {
    logPass("Expired JWT correctly rejected with 401");
  } else {
    logFail("Expired JWT", `Got status ${expiredJwt.status}`);
  }

  // ----------------------------------------------------
  // SETUP TEST USERS: Candidate, Recruiter A, Recruiter B
  // ----------------------------------------------------
  console.log("\n📌 3. Setting up Test Users for Cross-Role Verification...");

  const timestamp = Date.now();
  const candidateEmail = `test.cand.${timestamp}@example.com`;
  const recruiterAEmail = `test.recA.${timestamp}@example.com`;
  const recruiterBEmail = `test.recB.${timestamp}@example.com`;
  const password = "Password@123";

  // Register Candidate
  await request("/users/register", {
    method: "POST",
    body: JSON.stringify({
      username: `cand_${timestamp}`,
      fullName: "Audit Candidate",
      email: candidateEmail,
      password,
      role: "candidate",
    }),
  });

  // Register Recruiter A
  await request("/users/register", {
    method: "POST",
    body: JSON.stringify({
      username: `recA_${timestamp}`,
      fullName: "Audit Recruiter A",
      email: recruiterAEmail,
      password,
      role: "recruiter",
    }),
  });

  // Register Recruiter B
  await request("/users/register", {
    method: "POST",
    body: JSON.stringify({
      username: `recB_${timestamp}`,
      fullName: "Audit Recruiter B",
      email: recruiterBEmail,
      password,
      role: "recruiter",
    }),
  });

  // Login Candidate
  const candLogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: candidateEmail, password }),
  });
  const candToken = candLogin.data?.data?.accessToken;

  // Login Recruiter A
  const recALogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: recruiterAEmail, password }),
  });
  const recAToken = recALogin.data?.data?.accessToken;

  // Login Recruiter B
  const recBLogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: recruiterBEmail, password }),
  });
  const recBToken = recBLogin.data?.data?.accessToken;

  if (!candToken || !recAToken || !recBToken) {
    console.error("❌ Failed to obtain tokens for test accounts. Aborting.");
    return;
  }
  logPass("Test accounts registered and authenticated successfully");

  // Create recruiter profiles
  await request("/recruiters/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${recAToken}` },
    body: JSON.stringify({
      companyName: "Acme Tech A",
      companyWebsite: "https://acme.com",
      location: "Bengaluru",
      industry: "Technology",
    }),
  });

  await request("/recruiters/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${recBToken}` },
    body: JSON.stringify({
      companyName: "Beta Corp B",
      companyWebsite: "https://beta.com",
      location: "Noida",
      industry: "Technology",
    }),
  });

  // ----------------------------------------------------
  // GROUP 3: CANDIDATE -> RECRUITER RESTRICTED ROUTES (Expect 403)
  // ----------------------------------------------------
  console.log("\n📌 4. Testing Candidate accessing Recruiter Routes (Expect 403):");

  const candToRecProfile = await request("/recruiters/profile", {
    headers: { Authorization: `Bearer ${candToken}` },
  });
  if (candToRecProfile.status === 403) {
    logPass("Candidate accessing GET /recruiters/profile blocked with 403");
  } else {
    logFail("Candidate accessing GET /recruiters/profile", `Got status ${candToRecProfile.status}`);
  }

  const candToPostJob = await request("/jobs", {
    method: "POST",
    headers: { Authorization: `Bearer ${candToken}` },
    body: JSON.stringify({
      title: "Hacker Job",
      description: "Should fail",
      location: "Remote",
      salary: 100000,
    }),
  });
  if (candToPostJob.status === 403) {
    logPass("Candidate attempting POST /jobs blocked with 403");
  } else {
    logFail("Candidate attempting POST /jobs", `Got status ${candToPostJob.status}`);
  }

  const candToMyJobs = await request("/jobs/my-jobs", {
    headers: { Authorization: `Bearer ${candToken}` },
  });
  if (candToMyJobs.status === 403) {
    logPass("Candidate accessing GET /jobs/my-jobs blocked with 403");
  } else {
    logFail("Candidate accessing GET /jobs/my-jobs", `Got status ${candToMyJobs.status}`);
  }

  // ----------------------------------------------------
  // GROUP 4: RECRUITER -> CANDIDATE RESTRICTED ROUTES (Expect 403)
  // ----------------------------------------------------
  console.log("\n📌 5. Testing Recruiter accessing Candidate Routes (Expect 403):");

  const recToCandProfile = await request("/candidates/profile", {
    headers: { Authorization: `Bearer ${recAToken}` },
  });
  if (recToCandProfile.status === 403) {
    logPass("Recruiter accessing GET /candidates/profile blocked with 403");
  } else {
    logFail("Recruiter accessing GET /candidates/profile", `Got status ${recToCandProfile.status}`);
  }

  const recToApplyJob = await request("/applications/apply/650000000000000000000001", {
    method: "POST",
    headers: { Authorization: `Bearer ${recAToken}` },
  });
  if (recToApplyJob.status === 403) {
    logPass("Recruiter attempting POST /applications/apply/:id blocked with 403");
  } else {
    logFail("Recruiter attempting POST /applications/apply/:id", `Got status ${recToApplyJob.status}`);
  }

  const recToGetApplications = await request("/applications/get", {
    headers: { Authorization: `Bearer ${recAToken}` },
  });
  if (recToGetApplications.status === 403) {
    logPass("Recruiter accessing GET /applications/get blocked with 403");
  } else {
    logFail("Recruiter accessing GET /applications/get", `Got status ${recToGetApplications.status}`);
  }

  // ----------------------------------------------------
  // GROUP 5: DUPLICATE APPLICATION & INACTIVE JOB GUARDS
  // ----------------------------------------------------
  console.log("\n📌 6. Testing Application Business Logic & Guard Rails:");

  // Recruiter A creates a job
  const postJobRes = await request("/jobs", {
    method: "POST",
    headers: { Authorization: `Bearer ${recAToken}` },
    body: JSON.stringify({
      title: "Senior Cloud Architect",
      description: "Design cloud native architectures",
      requirements: "AWS, Kubernetes, Terraform",
      location: "Bengaluru",
      jobType: "Full-time",
      workMode: "Hybrid",
      category: "Software Development",
      experienceLevel: "Senior-level",
      salary: 2500000,
      positions: 2,
    }),
  });

  const createdJobId = postJobRes.data?.data?._id;
  if (!createdJobId) {
    console.error("❌ Failed to create test job. Response:", postJobRes.data);
    return;
  }
  logPass("Recruiter A successfully created Job listing", `ID: ${createdJobId}`);

  // Candidate applies to Job 1st time (Expect 201)
  const apply1st = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${candToken}` },
  });
  if (apply1st.status === 201) {
    logPass("Candidate applied 1st time to Job -> 201 Created");
  } else {
    logFail("Candidate 1st application", `Expected 201, got ${apply1st.status}`);
  }

  const createdApplicationId = apply1st.data?.data?._id;

  // Candidate applies to SAME Job 2nd time (Expect 400 Duplicate rejection)
  const apply2nd = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${candToken}` },
  });
  if (apply2nd.status === 400 && JSON.stringify(apply2nd.data).toLowerCase().includes("already applied")) {
    logPass("Candidate applying to SAME job twice -> 400 Bad Request ('already applied')");
  } else {
    logFail("Duplicate Application Guard", `Expected 400 with 'already applied', got ${apply2nd.status} - ${JSON.stringify(apply2nd.data)}`);
  }

  // Recruiter A closes / deactivates Job
  const toggleJob = await request(`/jobs/toggle-status/${createdJobId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${recAToken}` },
  });
  if (toggleJob.status === 200) {
    logPass("Recruiter A closed/toggled job to Inactive");
  } else {
    logFail("Toggle Job Status", `Got status ${toggleJob.status}`);
  }

  // Register Candidate 2 to test applying to an inactive job
  const cand2Email = `test.cand2.${timestamp}@example.com`;
  await request("/users/register", {
    method: "POST",
    body: JSON.stringify({
      username: `cand2_${timestamp}`,
      fullName: "Candidate Two",
      email: cand2Email,
      password,
      role: "candidate",
    }),
  });
  const cand2Login = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: cand2Email, password }),
  });
  const cand2Token = cand2Login.data?.data?.accessToken;

  // Candidate 2 applies to INACTIVE job (Expect 400 Inactive rejection)
  const applyInactive = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cand2Token}` },
  });
  if (applyInactive.status === 400 && JSON.stringify(applyInactive.data).toLowerCase().includes("no longer accepting")) {
    logPass("Candidate applying to INACTIVE job -> 400 Bad Request ('no longer accepting applications')");
  } else {
    logFail("Inactive Job Guard", `Expected 400 with 'no longer accepting', got ${applyInactive.status} - ${JSON.stringify(applyInactive.data)}`);
  }

  // ----------------------------------------------------
  // GROUP 6: CROSS-RECRUITER OWNERSHIP & AUTHORIZATION
  // ----------------------------------------------------
  console.log("\n📌 7. Testing Cross-Recruiter Ownership & Application Modification (Expect 403):");

  // Recruiter B tries to view applicants for Recruiter A's job
  const recBViewApplicants = await request(`/applications/${createdJobId}/applicants`, {
    headers: { Authorization: `Bearer ${recBToken}` },
  });
  if (recBViewApplicants.status === 403) {
    logPass("Recruiter B viewing Recruiter A's job applicants -> 403 Forbidden");
  } else {
    logFail("Cross-Recruiter View Applicants", `Expected 403, got ${recBViewApplicants.status}`);
  }

  // Recruiter B tries to update status of Recruiter A's application
  if (createdApplicationId) {
    const recBUpdateStatus = await request(`/applications/status/${createdApplicationId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${recBToken}` },
      body: JSON.stringify({ status: "accepted" }),
    });
    if (recBUpdateStatus.status === 403) {
      logPass("Recruiter B modifying Recruiter A's application status -> 403 Forbidden");
    } else {
      logFail("Cross-Recruiter Update Application Status", `Expected 403, got ${recBUpdateStatus.status}`);
    }
  }

  // Recruiter A (The legitimate owner) updates status to 'accepted'
  if (createdApplicationId) {
    const recAUpdateStatus = await request(`/applications/status/${createdApplicationId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${recAToken}` },
      body: JSON.stringify({ status: "accepted" }),
    });
    if (recAUpdateStatus.status === 200 && recAUpdateStatus.data?.data?.status === "accepted") {
      logPass("Legitimate Job Owner (Recruiter A) updates applicant status -> 200 OK ('accepted')");
    } else {
      logFail("Legitimate Owner Update Application Status", `Expected 200, got ${recAUpdateStatus.status}`);
    }
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log("\n========================================================");
  console.log(`📊 AUDIT COMPLETED: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("========================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSecurityAudit();
