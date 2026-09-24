import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/db/index.js";
import { User } from "./src/models/user.model.js";
import { Candidate } from "./src/models/candidateProfile.model.js";
import { RecruiterProfile } from "./src/models/recruiterProfile.model.js";
import { Job } from "./src/models/job.model.js";
import { Application } from "./src/models/application.model.js";
import { Notification } from "./src/models/notification.model.js";

async function cleanup() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for cleanup...");

    const testUsers = await User.find({
      $or: [
        { email: /@example\.com$/i },
        { username: /^cand/i },
        { username: /^rec/i },
      ],
    });

    const testUserIds = testUsers.map((u) => u._id);
    console.log(`Found ${testUsers.length} test users to clean up.`);

    if (testUserIds.length > 0) {
      // Find recruiter profiles to find created test jobs
      const recruiterProfiles = await RecruiterProfile.find({
        user: { $in: testUserIds },
      });
      const recruiterIds = recruiterProfiles.map((r) => r._id);

      const testJobs = await Job.find({
        $or: [{ recruiter: { $in: recruiterIds } }, { title: /^Test /i }],
      });
      const testJobIds = testJobs.map((j) => j._id);

      // Clean up applications
      const deletedApps = await Application.deleteMany({
        $or: [
          { applicant: { $in: testUserIds } },
          { job: { $in: testJobIds } },
        ],
      });
      console.log(`Deleted ${deletedApps.deletedCount} test applications.`);

      // Clean up notifications
      const deletedNotifs = await Notification.deleteMany({
        recipient: { $in: testUserIds },
      });
      console.log(`Deleted ${deletedNotifs.deletedCount} test notifications.`);

      // Clean up jobs
      const deletedJobs = await Job.deleteMany({
        _id: { $in: testJobIds },
      });
      console.log(`Deleted ${deletedJobs.deletedCount} test jobs.`);

      // Clean up profiles
      const deletedCandidates = await Candidate.deleteMany({
        user: { $in: testUserIds },
      });
      console.log(`Deleted ${deletedCandidates.deletedCount} candidate profiles.`);

      const deletedRecruiters = await RecruiterProfile.deleteMany({
        user: { $in: testUserIds },
      });
      console.log(`Deleted ${deletedRecruiters.deletedCount} recruiter profiles.`);

      // Clean up users
      const deletedUsers = await User.deleteMany({
        _id: { $in: testUserIds },
      });
      console.log(`Deleted ${deletedUsers.deletedCount} test users.`);
    }

    const remaining = await User.find({}, "fullName email username role");
    console.log("\n✅ Remaining REAL users in database:");
    remaining.forEach((u) => {
      console.log(` - ${u.fullName || u.username} (${u.email}) [${u.role}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Cleanup error:", error);
    process.exit(1);
  }
}

cleanup();
