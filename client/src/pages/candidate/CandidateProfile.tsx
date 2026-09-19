import React, { useEffect, useState } from "react";
import api from "../../api/axios";

interface ProfileData {
  fullname: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  resume?: string;
}

export const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    fullname: "",
    email: "",
    phone: "",
    bio: "",
    skills: [],
    resume: "",
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Candidate profile details fetch route
      const response = await api.get("/candidates/profile");
      const user = response.data?.user || response.data?.data || response.data;

      setProfile({
        fullname: user.fullName || user.fullname || user.name || "",
        email: user.email || "",
        phone: user.profile?.phoneNumber || user.phoneNumber || "",
        bio: user.profile?.bio || user.bio || "",
        skills: user.profile?.skills || user.skills || [],
        resume: user.profile?.resume || user.resume || "",
      });

      const currentSkills = user.profile?.skills || user.skills || [];
      if (Array.isArray(currentSkills)) {
        setSkillsInput(currentSkills.join(", "));
      } else if (typeof currentSkills === "string") {
        setSkillsInput(currentSkills);
      }
    } catch (err: any) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      // 1. Profile JSON update (/candidates/profile)
      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const profilePayload = {
        fullName: profile.fullname,
        phoneNumber: profile.phone,
        bio: profile.bio,
        skills: skillsArray,
      };

      await api.post("/candidates/profile", profilePayload);

      // 2. Resume file upload (/candidates/resume)
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("file", resumeFile);

        await api.post("/candidates/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setResumeFile(null);
      fetchProfile();
    } catch (err: any) {
      console.error("Profile Update Error:", err.response);
      const errorMsg =
        err.response?.data?.message || "Failed to update profile details.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500 font-medium">
          Loading profile details...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information, skills, and uploaded resume.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullname}
              onChange={(e) =>
                setProfile({ ...profile, fullname: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 9876543210"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB, Tailwind"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Bio / Professional Summary
          </label>
          <textarea
            rows={4}
            placeholder="Write a brief overview about your technical background..."
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            Resume / CV Document (PDF)
          </label>

          {profile.resume && (
            <div className="mb-3 flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
              <span className="text-indigo-900 font-medium truncate max-w-md">
                📄 {profile.resume.split("/").pop()}
              </span>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-white border border-indigo-200 text-indigo-600 font-semibold px-3 py-1 rounded hover:bg-indigo-50"
              >
                View Resume
              </a>
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setResumeFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
