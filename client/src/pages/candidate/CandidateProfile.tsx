import React, { useEffect, useState, useCallback } from "react";
import type { CandidateProfile as CandidateProfileType, Experience, Education } from "../../types";
import { candidateService } from "../../services";
import { Input, Textarea, Button, Skeleton } from "../../components/common";

export const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfileType | null>(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Experience State
  const [newExp, setNewExp] = useState<Experience>({
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [addingExp, setAddingExp] = useState(false);

  // New Education State
  const [newEdu, setNewEdu] = useState<Education>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });
  const [addingEdu, setAddingEdu] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await candidateService.getProfile();
        const raw = response as unknown as { candidate?: CandidateProfileType; data?: CandidateProfileType };
        const data = raw.candidate || raw.data || (response as unknown as CandidateProfileType);

        if (data && isMounted) {
          setProfile(data);
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setLinkedin(data.linkedin || "");
          setGithub(data.github || "");
          setPortfolio(data.portfolio || "");

          const currentSkills = data.skills || [];
          setSkillsInput(
            Array.isArray(currentSkills) ? currentSkills.join(", ") : (currentSkills as string)
          );
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to load profile details.";
          setMessage({ type: "error", text: msg });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await candidateService.updateProfile({
        phone,
        bio,
        location,
        skills: skillsArray,
        linkedin,
        github,
        portfolio,
      });

      if (resumeFile) {
        await candidateService.uploadResume(resumeFile);
        setResumeFile(null);
      }

      setMessage({
        type: "success",
        text: "Profile details and resume updated successfully!",
      });
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update profile.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.company || !newExp.title || !newExp.startDate) {
      setMessage({ type: "error", text: "Company, Title, and Start Date are required for experience." });
      return;
    }

    try {
      setAddingExp(true);
      await candidateService.addExperience(newExp);
      setNewExp({
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setMessage({ type: "success", text: "Experience added successfully!" });
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to add experience.";
      setMessage({ type: "error", text: msg });
    } finally {
      setAddingExp(false);
    }
  };

  const handleDeleteExperience = async (id?: string) => {
    if (!id) return;
    try {
      await candidateService.deleteExperience(id);
      setMessage({ type: "success", text: "Experience record removed." });
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete experience.";
      setMessage({ type: "error", text: msg });
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.institution || !newEdu.degree) {
      setMessage({ type: "error", text: "Institution and Degree are required." });
      return;
    }

    try {
      setAddingEdu(true);
      await candidateService.addEducation(newEdu);
      setNewEdu({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
      setMessage({ type: "success", text: "Education added successfully!" });
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to add education.";
      setMessage({ type: "error", text: msg });
    } finally {
      setAddingEdu(false);
    }
  };

  const handleDeleteEducation = async (id?: string) => {
    if (!id) return;
    try {
      await candidateService.deleteEducation(id);
      setMessage({ type: "success", text: "Education record removed." });
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete education.";
      setMessage({ type: "error", text: msg });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const user = profile?.user;
  const fullName = user?.fullName || "Candidate";
  const email = user?.email || "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Candidate Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your profile to stand out to verified tech recruiters.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Info Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6 mb-8"
      >
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={fullName}
            disabled
            helperText="Name linked to your account"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled
            helperText="Primary email for job notifications"
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Location"
            placeholder="Bengaluru, India / Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Input
          label="Skills (Comma Separated)"
          placeholder="React, TypeScript, Node.js, Next.js, Tailwind CSS"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          helperText="Add your strongest technical and soft skills"
        />

        <Textarea
          label="Professional Bio"
          placeholder="Brief summary of your expertise, achievements, and career goals..."
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/username"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
          <Input
            label="GitHub Profile"
            placeholder="https://github.com/username"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <Input
            label="Portfolio Website"
            placeholder="https://yourportfolio.dev"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
          />
        </div>

        {/* Resume Section */}
        <div className="border-t border-gray-100 pt-6">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Resume / CV Document (PDF)
          </label>
          {profile?.resume && (
            <div className="mb-3 flex items-center justify-between p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-sm">
              <span className="text-indigo-950 font-medium truncate max-w-md flex items-center gap-2">
                📄 {profile.resume.split("/").pop()}
              </span>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-white border border-indigo-200 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 shadow-2xs"
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
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={saving}
          >
            Save Profile Details
          </Button>
        </div>
      </form>

      {/* Experience Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Work Experience
        </h2>

        {profile?.experience && profile.experience.length > 0 ? (
          <div className="space-y-3">
            {profile.experience.map((exp) => (
              <div
                key={exp._id}
                className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {exp.title} &bull; <span className="text-indigo-600">{exp.company}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {exp.startDate?.split("T")[0]} &mdash; {exp.endDate?.split("T")[0] || "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => handleDeleteExperience(exp._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No work experience added yet.</p>
        )}

        {/* Add Experience Form */}
        <form onSubmit={handleAddExperience} className="border-t border-gray-100 pt-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            + Add Work Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Company Name"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              required
            />
            <Input
              placeholder="Job Title / Role"
              value={newExp.title}
              onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
              required
            />
            <Input
              type="date"
              label="Start Date"
              value={newExp.startDate}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              required
            />
            <Input
              type="date"
              label="End Date (Leave blank if currently working)"
              value={newExp.endDate || ""}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Key achievements and responsibilities..."
            rows={2}
            value={newExp.description || ""}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              isLoading={addingExp}
            >
              Add Experience
            </Button>
          </div>
        </form>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Education
        </h2>

        {profile?.education && profile.education.length > 0 ? (
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div
                key={edu._id}
                className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree} &bull; <span className="text-indigo-600">{edu.institution}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ""}
                    {edu.startYear || ""} &mdash; {edu.endYear || "Present"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => handleDeleteEducation(edu._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No education details added yet.</p>
        )}

        {/* Add Education Form */}
        <form onSubmit={handleAddEducation} className="border-t border-gray-100 pt-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            + Add Education
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Institution / University"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              required
            />
            <Input
              placeholder="Degree (e.g. B.Tech, M.S.)"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              required
            />
            <Input
              placeholder="Field of Study (e.g. Computer Science)"
              value={newEdu.fieldOfStudy || ""}
              onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Start Year"
              value={newEdu.startYear || ""}
              onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
            />
            <Input
              type="number"
              placeholder="End Year"
              value={newEdu.endYear || ""}
              onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              isLoading={addingEdu}
            >
              Add Education
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;
