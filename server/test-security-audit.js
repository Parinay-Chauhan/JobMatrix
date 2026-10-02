// Comprehensive Security, Auth & RBAC Audit Test Script
// Tests:
// 1. Unauthenticated Route Guards (401)
// 2. Malformed / Tampered JWT Handling (401)
// 3. Refresh Token Rotation & Revocation Security Suite (Rotation, JTI uniqueness, Reuse Detection, Logout Invalidation)
// 4. Role-Based Access Control (RBAC) & Cross-Role Guards (403)
// 5. Candidate & Notification IDOR Protections (403)
// 6. Input Validation & Malformed Status Injection Guards (400)
// 7. Duplicate Application & Inactive Job Guards (400)
// 8. Cross-Recruiter Ownership & Application Decisioning (403)

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api/v1";

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

const getCookie = (resHeaders, name) => {
  if (!resHeaders) return null;
  // Handle node-fetch / global fetch headers
  const setCookie = typeof resHeaders.getSetCookie === "function" 
    ? resHeaders.getSetCookie() 
    : (resHeaders.get ? [resHeaders.get("set-cookie")].filter(Boolean) : []);
  
  for (const str of setCookie) {
    if (str.startsWith(name + "=")) {
      return str.split(";")[0].split("=").slice(1).join("=");
    }
  }
  return null;
};

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
    return { status: res.status, data, headers: res.headers };
  } catch (err) {
    return { status: 0, error: err.message, headers: null };
  }
}

async function runSecurityAudit() {
  console.log("\n========================================================");
  console.log("🔒 STARTING SECURITY, AUTH & RBAC AUDIT SUITE");
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

  const tamperedJwt = await request("/candidates/profile", {
    headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTYiLCJleHAiOjE2MDAwMDAwMDB9.signature" },
  });
  if (tamperedJwt.status === 401) {
    logPass("Tampered / Invalid Signature JWT correctly rejected with 401");
  } else {
    logFail("Tampered JWT", `Got status ${tamperedJwt.status}`);
  }

  // ----------------------------------------------------
  // SETUP TEST USERS: Candidate, Recruiter A, Recruiter B
  // ----------------------------------------------------
  console.log("\n📌 3. Setting up Test Users for Auth & RBAC Verification...");

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

  // Log in users to retrieve tokens
  const candLogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: candidateEmail, password }),
  });
  const candToken = candLogin.data?.data?.accessToken;
  const candRt1 = candLogin.data?.data?.refreshToken || getCookie(candLogin.headers, "refreshToken");

  const recALogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: recruiterAEmail, password }),
  });
  const recAToken = recALogin.data?.data?.accessToken;

  const recBLogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: recruiterBEmail, password }),
  });
  const recBToken = recBLogin.data?.data?.accessToken;

  // ----------------------------------------------------
  // GROUP 3: REFRESH TOKEN ROTATION & REVOCATION SUITE
  // ----------------------------------------------------
  console.log("\n📌 4. Testing Refresh Token Rotation, Reuse Detection & Revocation:");

  if (candRt1) {
    // 1. Legitimate Refresh -> Issues New Pair (RT2)
    const refreshRes = await request("/users/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken: candRt1 }),
      headers: { Cookie: `refreshToken=${candRt1}` },
    });
    const candRt2 = refreshRes.data?.data?.refreshToken || getCookie(refreshRes.headers, "refreshToken");

    if (refreshRes.status === 200 && candRt2 && candRt2 !== candRt1) {
      logPass("Refresh Token Rotation succeeded -> issued distinct new Refresh Token (RT2)");
    } else {
      logFail("Refresh Token Rotation", `Expected status 200 and RT2 != RT1. Got ${refreshRes.status}`);
    }

    // 2. Replay / Reuse Old Token (RT1) -> Must be rejected with 401
    const reuseOldTokenRes = await request("/users/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken: candRt1 }),
      headers: { Cookie: `refreshToken=${candRt1}` },
    });
    if (reuseOldTokenRes.status === 401) {
      logPass("Replaying used old Refresh Token (RT1) rejected with 401 (Reuse Detection)");
    } else {
      logFail("Old Refresh Token Reuse", `Expected 401, got ${reuseOldTokenRes.status}`);
    }

    // 3. User Logout -> Must Revoke DB Refresh Token
    const logoutRes = await request("/users/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${candToken}` },
    });
    if (logoutRes.status === 200) {
      logPass("User Logout completed -> DB refreshToken cleared");
    } else {
      logFail("User Logout", `Expected 200, got ${logoutRes.status}`);
    }

    // 4. Refreshing with RT2 after Logout -> Must be rejected with 401
    const refreshAfterLogout = await request("/users/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken: candRt2 }),
      headers: { Cookie: `refreshToken=${candRt2}` },
    });
    if (refreshAfterLogout.status === 401) {
      logPass("Refresh after logout rejected with 401 (Server-side Token Revocation)");
    } else {
      logFail("Post-Logout Token Invalidation", `Expected 401, got ${refreshAfterLogout.status}`);
    }
  } else {
    logFail("Refresh Token Extraction", "Failed to retrieve initial refresh token");
  }

  // Log in Candidate again for remaining RBAC / functional tests
  const freshCandLogin = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: candidateEmail, password }),
  });
  const activeCandToken = freshCandLogin.data?.data?.accessToken;

  // ----------------------------------------------------
  // GROUP 4: ROLE-BASED ACCESS CONTROL (RBAC) GUARDS
  // ----------------------------------------------------
  console.log("\n📌 5. Testing Cross-Role Access Control (Expect 403):");

  // Candidate trying to access Recruiter Profile (Expect 403)
  const candOnRecProfile = await request("/recruiters/profile", {
    headers: { Authorization: `Bearer ${activeCandToken}` },
  });
  if (candOnRecProfile.status === 403) {
    logPass("Candidate blocked from /recruiters/profile (403 Forbidden)");
  } else {
    logFail("Candidate on Recruiter Profile", `Expected 403, got ${candOnRecProfile.status}`);
  }

  // Candidate trying to post a job (Expect 403)
  const candPostJob = await request("/jobs", {
    method: "POST",
    headers: { Authorization: `Bearer ${activeCandToken}` },
    body: JSON.stringify({
      title: "Hacked Job",
      description: "Should not be created by candidate",
    }),
  });
  if (candPostJob.status === 403) {
    logPass("Candidate blocked from POST /jobs (403 Forbidden)");
  } else {
    logFail("Candidate POST /jobs", `Expected 403, got ${candPostJob.status}`);
  }

  // Recruiter trying to access Candidate Profile (Expect 403)
  const recOnCandProfile = await request("/candidates/profile", {
    headers: { Authorization: `Bearer ${recAToken}` },
  });
  if (recOnCandProfile.status === 403) {
    logPass("Recruiter blocked from /candidates/profile (403 Forbidden)");
  } else {
    logFail("Recruiter on Candidate Profile", `Expected 403, got ${recOnCandProfile.status}`);
  }

  // ----------------------------------------------------
  // GROUP 5: INPUT VALIDATION & MASS ASSIGNMENT GUARDS
  // ----------------------------------------------------
  console.log("\n📌 6. Testing Input Validation & Mass Assignment Rejection:");

  // Set up Recruiter A profile
  await request("/recruiters/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${recAToken}` },
    body: JSON.stringify({
      companyName: "Nexus Cloud Labs",
      companyWebsite: "https://nexuslabs.dev",
      location: "Bengaluru",
      industry: "Information Technology",
    }),
  });

  // Recruiter A posts a valid job
  const recCreateJob = await request("/jobs", {
    method: "POST",
    headers: { Authorization: `Bearer ${recAToken}` },
    body: JSON.stringify({
      title: "Senior Security Specialist",
      description: "Designing end-to-end cloud and API security controls with auditability.",
      requirements: ["Node.js", "JWT", "OAuth", "MongoDB"],
      location: "Bengaluru",
      jobType: "Full-time",
      workMode: "Remote",
      experienceLevel: "Senior-level",
      salary: 2500000,
      positions: 1,
    }),
  });
  const createdJobId = recCreateJob.data?.data?._id;

  // Candidate applies to Job
  const applyRes = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${activeCandToken}` },
  });
  const createdAppId = applyRes.data?.data?._id;

  // Recruiter attempts to set an invalid status ("hacked") -> Expect 400
  if (createdAppId) {
    const invalidStatusRes = await request(`/applications/status/${createdAppId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${recAToken}` },
      body: JSON.stringify({ status: "hacked" }),
    });
    if (invalidStatusRes.status === 400) {
      logPass("Invalid application status update ('hacked') rejected with 400 Validation Error");
    } else {
      logFail("Status Validation Injection", `Expected 400, got ${invalidStatusRes.status}`);
    }
  }

  // ----------------------------------------------------
  // GROUP 6: DUPLICATE APPLICATION & INACTIVE JOB GUARDS
  // ----------------------------------------------------
  console.log("\n📌 7. Testing Application Constraints (Duplicate & Inactive Guards):");

  // Candidate applies to SAME Job 2nd time (Expect 400 Duplicate rejection)
  const apply2nd = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${activeCandToken}` },
  });
  if (apply2nd.status === 400 && JSON.stringify(apply2nd.data).toLowerCase().includes("already applied")) {
    logPass("Candidate applying to SAME job twice -> 400 Bad Request ('already applied')");
  } else {
    logFail("Duplicate Application Guard", `Expected 400, got ${apply2nd.status}`);
  }

  // Recruiter A closes / deactivates Job
  await request(`/jobs/toggle-status/${createdJobId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${recAToken}` },
  });

  // Another Candidate applies to INACTIVE job (Expect 400 Inactive rejection)
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

  const applyInactive = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cand2Token}` },
  });
  if (applyInactive.status === 400) {
    logPass("Candidate applying to INACTIVE job -> 400 Bad Request ('no longer accepting')");
  } else {
    logFail("Inactive Job Guard", `Expected 400, got ${applyInactive.status}`);
  }

  // ----------------------------------------------------
  // GROUP 7: CROSS-RECRUITER & NOTIFICATION IDOR GUARDS
  // ----------------------------------------------------
  console.log("\n📌 8. Testing IDOR Protections (Cross-Recruiter & Notification IDOR):");

  // Recruiter B tries to view applicants for Recruiter A's job (Expect 403)
  const recBViewApplicants = await request(`/applications/${createdJobId}/applicants`, {
    headers: { Authorization: `Bearer ${recBToken}` },
  });
  if (recBViewApplicants.status === 403) {
    logPass("Recruiter B viewing Recruiter A's job applicants -> 403 Forbidden");
  } else {
    logFail("Cross-Recruiter View Applicants", `Expected 403, got ${recBViewApplicants.status}`);
  }

  // Recruiter B tries to update status of Recruiter A's application (Expect 403)
  if (createdAppId) {
    const recBUpdateStatus = await request(`/applications/status/${createdAppId}`, {
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

  // Legitimate Job Owner (Recruiter A) updates status to 'accepted' (Expect 200)
  if (createdAppId) {
    const recAUpdateStatus = await request(`/applications/status/${createdAppId}`, {
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

  // Candidate B attempts to mark Candidate A's notification as read (Expect 403)
  const candANotifsRes = await request("/notifications", {
    headers: { Authorization: `Bearer ${activeCandToken}` },
  });
  const candANotifs = candANotifsRes.data?.data || [];
  if (candANotifs.length > 0) {
    const candBMarkRead = await request(`/notifications/${candANotifs[0]._id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${cand2Token}` },
    });
    if (candBMarkRead.status === 403) {
      logPass("Candidate B blocked from marking Candidate A's notification (403 Notification IDOR)");
    } else {
      logFail("Notification IDOR Protection", `Expected 403, got ${candBMarkRead.status}`);
    }
  }

  // Unauthenticated user attempting to apply to a job (Expect 401)
  const unauthApply = await request(`/applications/apply/${createdJobId}`, {
    method: "POST",
  });
  if (unauthApply.status === 401) {
    logPass("Unauthenticated /applications/apply blocked with 401 Unauthorized");
  } else {
    logFail("Unauthenticated Apply Guard", `Expected 401, got ${unauthApply.status}`);
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
