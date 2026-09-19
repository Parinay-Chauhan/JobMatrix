import React, { useEffect, useState } from "react";
import api from "../../api/axios";


interface Experience {
  _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number | string;
  endYear: number | string;
}

interface ProfileData {
  fullname: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  resume?: string;
  experience: Experience[];
  education: Education[];
}

export const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    fullname: "",
    email: "",
    phone: "",
    bio: "",
    skills: [],
    resume: "",
    experience: [],
    education: [],
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );

  // New item form states for modal / inline adding
  const [newExp, setNewExp] = useState<Experience>({
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [newEdu, setNewEdu] = useState<Education>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const refetchProfile = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await api.get("/candidates/profile");
        const data =
          response.data?.candidate || response.data?.data || response.data;

        if (data && isMounted) {
          setProfile({
            fullname: data.user?.fullName || data.fullName || "",
            email: data.user?.email || data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            skills: data.skills || [],
            resume: data.resume || "",
            experience: data.experience || [],
            education: data.education || [],
          });

          const currentSkills = data.skills || [];
          setSkillsInput(
            Array.isArray(currentSkills)
              ? currentSkills.join(", ")
              : currentSkills,
          );
        }
      } catch (err: unknown) {
        console.error("Profile Fetch Error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);


  // Add Experience via dedicated endpoint /experience
  const handleAddExperience = async () => {
    if (!newExp.company || !newExp.title) {
      alert("Company and Title are required");
      return;
    }
    try {
      await api.post("/candidates/experience", newExp);
      setNewExp({
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      refetchProfile();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add experience";
      alert(msg);
    }
  };

  // Delete Experience via /experience/:id
  const handleDeleteExperience = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete(`/candidates/experience/${id}`);
      refetchProfile();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete experience";
      alert(msg);
    }
  };

  // Add Education via dedicated endpoint /education
  const handleAddEducation = async () => {
    if (!newEdu.institution || !newEdu.degree) {
      alert("Institution and Degree are required");
      return;
    }
    try {
      await api.post("/candidates/education", newEdu);
      setNewEdu({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
      refetchProfile();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add education";
      alert(msg);
    }
  };

  // Delete Education via /education/:id
  const handleDeleteEducation = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete(`/candidates/education/${id}`);
      refetchProfile();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete education";
      alert(msg);
    }
  };

  // Save Main Profile Details (Bio, Phone, Skills)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const profilePayload = {
        phone: profile.phone || "",
        bio: profile.bio || "",
        skills: skillsArray,
      };

      // Calls PATCH /candidates/profile
      await api.patch("/candidates/profile", profilePayload);

      // Upload Resume if selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        await api.post("/candidates/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage({
        type: "success",
        text: "Profile details updated successfully!",
      });
      setResumeFile(null);
      refetchProfile();
    } catch (err: unknown) {
      console.error("Profile Update Error Details:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile details.";
      setMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500 font-medium">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal details, work experience, education, and resume.
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

      {/* Main Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8"
      >
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullname}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-not-allowed font-medium"
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
                placeholder="React, Node.js, MongoDB"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
              Bio / Professional Summary
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary about yourself..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Resume Section */}
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
            {saving ? "Saving Changes..." : "Save Basic Details"}
          </button>
        </div>
      </form>

      {/* Experience Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6 space-y-4">
        <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
          Work Experience
        </h3>
        {profile.experience.map((exp) => (
          <div
            key={exp._id}
            className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {exp.title} -{" "}
                <span className="text-indigo-600">{exp.company}</span>
              </p>
              <p className="text-xs text-gray-500">
                {exp.startDate?.split("T")[0]} to{" "}
                {exp.endDate?.split("T")[0] || "Present"}
              </p>
              {exp.description && (
                <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDeleteExperience(exp._id)}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
            >
              Delete
            </button>
          </div>
        ))}

        {/* Add Experience Form */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Company Name"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Role / Title"
            value={newExp.title}
            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="date"
            value={newExp.startDate}
            onChange={(e) =>
              setNewExp({ ...newExp, startDate: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="date"
            value={newExp.endDate}
            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <textarea
            placeholder="Description / Responsibilities"
            value={newExp.description}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            className="md:col-span-2 px-3 py-2 border rounded-lg text-sm resize-none"
            rows={2}
          />
          <div className="md:col-span-2 text-right">
            <button
              type="button"
              onClick={handleAddExperience}
              className="bg-indigo-50 text-indigo-600 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-indigo-100"
            >
              + Add Experience
            </button>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6 space-y-4">
        <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
          Education
        </h3>
        {profile.education.map((edu) => (
          <div
            key={edu._id}
            className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {edu.degree} -{" "}
                <span className="text-indigo-600">{edu.institution}</span>
              </p>
              <p className="text-xs text-gray-500">
                {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear})
              </p>
            </div>
            <button
              onClick={() => handleDeleteEducation(edu._id)}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
            >
              Delete
            </button>
          </div>
        ))}

        {/* Add Education Form */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Institution"
            value={newEdu.institution}
            onChange={(e) =>
              setNewEdu({ ...newEdu, institution: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Degree (e.g., B.Tech)"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Field of Study (e.g., CSE)"
            value={newEdu.fieldOfStudy}
            onChange={(e) =>
              setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Start Year"
            value={newEdu.startYear}
            onChange={(e) =>
              setNewEdu({ ...newEdu, startYear: e.target.value })
            }
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="End Year"
            value={newEdu.endYear}
            onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <div className="md:col-span-3 text-right">
            <button
              type="button"
              onClick={handleAddEducation}
              className="bg-indigo-50 text-indigo-600 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-indigo-100"
            >
              + Add Education
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
