import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type {
  CandidateProfile as CandidateProfileType,
  Experience,
  Education,
  UpdateCandidateProfilePayload,
} from "../../types";
import {
  useCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useUploadResumeMutation,
} from "../../hooks/queries";
import {
  Input,
  Textarea,
  Button,
  Skeleton,
  ConfirmDialog,
} from "../../components/common";
import { useAuth } from "../../context/AuthContext";

interface ProfileBasicFormProps {
  profile: CandidateProfileType;
  onSave: (
    payload: UpdateCandidateProfilePayload,
    resumeFile: File | null
  ) => Promise<void>;
  isSaving: boolean;
}

const ProfileBasicForm: React.FC<ProfileBasicFormProps> = ({
  profile,
  onSave,
  isSaving,
}) => {
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(profile.skills)
      ? profile.skills.join(", ")
      : typeof profile.skills === "string"
      ? profile.skills
      : ""
  );
  const [phone, setPhone] = useState(profile.phone || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [linkedin, setLinkedin] = useState(profile.linkedin || "");
  const [github, setGithub] = useState(profile.github || "");
  const [portfolio, setPortfolio] = useState(profile.portfolio || "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSave(
      {
        phone,
        bio,
        location,
        skills: skillsArray,
        linkedin,
        github,
        portfolio,
      },
      resumeFile
    );
  };

  const { user: authUser } = useAuth();
  const user = profile.user || authUser;
  const fullName = user?.fullName || authUser?.fullName || "Candidate";
  const email = user?.email || authUser?.email || "";

  return (
    <form
      onSubmit={handleSubmit}
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
        {profile.resume && (
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
        <Button type="submit" variant="primary" isLoading={isSaving}>
          Save Profile Details
        </Button>
      </div>
    </form>
  );
};

export const CandidateProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // TanStack Query for profile data
  const { data: profile, isLoading: loading } = useCandidateProfileQuery();

  // Mutations
  const updateProfileMutation = useUpdateCandidateProfileMutation();
  const addExperienceMutation = useAddExperienceMutation();
  const deleteExperienceMutation = useDeleteExperienceMutation();
  const addEducationMutation = useAddEducationMutation();
  const deleteEducationMutation = useDeleteEducationMutation();
  const uploadResumeMutation = useUploadResumeMutation();

  // Fallback profile if brand new account
  const effectiveProfile: CandidateProfileType = profile || {
    _id: "new-profile",
    user: (user || { _id: "", fullName: "Candidate", email: "", role: "candidate" }) as any,
    skills: [],
    experience: [],
    education: [],
  };

  // Dialog State
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null);
  const [deleteEduId, setDeleteEduId] = useState<string | null>(null);

  // New Experience Form State
  const [newExp, setNewExp] = useState<Experience>({
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // New Education Form State
  const [newEdu, setNewEdu] = useState<Education>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const handleSaveProfile = async (
    payload: UpdateCandidateProfilePayload,
    resumeFile: File | null
  ) => {
    try {
      await updateProfileMutation.mutateAsync(payload);

      if (resumeFile) {
        await uploadResumeMutation.mutateAsync(resumeFile);
      }

      toast.success("Profile Updated", {
        description: "Your candidate profile and resume have been saved.",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile.";
      toast.error("Profile Update Failed", { description: msg });
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.company || !newExp.title || !newExp.startDate) {
      toast.error("Missing Fields", {
        description: "Company, Title, and Start Date are required.",
      });
      return;
    }

    try {
      await addExperienceMutation.mutateAsync(newExp);
      setNewExp({
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      toast.success("Experience Added successfully!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add experience.";
      toast.error("Error", { description: msg });
    }
  };

  const confirmDeleteExperience = async () => {
    if (!deleteExpId) return;
    try {
      await deleteExperienceMutation.mutateAsync(deleteExpId);
      toast.success("Experience Removed");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete experience.";
      toast.error("Error", { description: msg });
    } finally {
      setDeleteExpId(null);
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.institution || !newEdu.degree) {
      toast.error("Missing Fields", {
        description: "Institution and Degree are required.",
      });
      return;
    }

    try {
      await addEducationMutation.mutateAsync(newEdu);
      setNewEdu({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
      toast.success("Education Added successfully!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add education.";
      toast.error("Error", { description: msg });
    }
  };

  const confirmDeleteEducation = async () => {
    if (!deleteEduId) return;
    try {
      await deleteEducationMutation.mutateAsync(deleteEduId);
      toast.success("Education Removed");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete education.";
      toast.error("Error", { description: msg });
    } finally {
      setDeleteEduId(null);
    }
  };

  if (loading && !profile) {
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

  const isSaving =
    updateProfileMutation.isPending || uploadResumeMutation.isPending;

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

      {/* Main Info Form (keyed by profile ID for proper React state initialization) */}
      <ProfileBasicForm
        key={effectiveProfile._id || "profile-form"}
        profile={effectiveProfile}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />

      {/* Experience Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Work Experience
        </h2>

        {effectiveProfile.experience && effectiveProfile.experience.length > 0 ? (
          <div className="space-y-3">
            {effectiveProfile.experience.map((exp) => (
              <div
                key={exp._id}
                className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {exp.title} &bull;{" "}
                    <span className="text-indigo-600">{exp.company}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {exp.startDate?.split("T")[0]} &mdash;{" "}
                    {exp.endDate?.split("T")[0] || "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  disabled={deleteExperienceMutation.isPending}
                  onClick={() => exp._id && setDeleteExpId(exp._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">
            No work experience added yet.
          </p>
        )}

        {/* Add Experience Form */}
        <form
          onSubmit={handleAddExperience}
          className="border-t border-gray-100 pt-5 space-y-3"
        >
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            + Add Work Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Company Name"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
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
              onChange={(e) =>
                setNewExp({ ...newExp, startDate: e.target.value })
              }
              required
            />
            <Input
              type="date"
              label="End Date (Leave blank if currently working)"
              value={newExp.endDate || ""}
              onChange={(e) =>
                setNewExp({ ...newExp, endDate: e.target.value })
              }
            />
          </div>
          <Textarea
            placeholder="Key achievements and responsibilities..."
            rows={2}
            value={newExp.description || ""}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              isLoading={addExperienceMutation.isPending}
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

        {effectiveProfile.education && effectiveProfile.education.length > 0 ? (
          <div className="space-y-3">
            {effectiveProfile.education.map((edu) => (
              <div
                key={edu._id}
                className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree} &bull;{" "}
                    <span className="text-indigo-600">{edu.institution}</span>
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
                  disabled={deleteEducationMutation.isPending}
                  onClick={() => edu._id && setDeleteEduId(edu._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">
            No education details added yet.
          </p>
        )}

        {/* Add Education Form */}
        <form
          onSubmit={handleAddEducation}
          className="border-t border-gray-100 pt-5 space-y-3"
        >
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            + Add Education
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Institution / University"
              value={newEdu.institution}
              onChange={(e) =>
                setNewEdu({ ...newEdu, institution: e.target.value })
              }
              required
            />
            <Input
              placeholder="Degree (e.g. B.Tech, M.S.)"
              value={newEdu.degree}
              onChange={(e) =>
                setNewEdu({ ...newEdu, degree: e.target.value })
              }
              required
            />
            <Input
              placeholder="Field of Study (e.g. Computer Science)"
              value={newEdu.fieldOfStudy || ""}
              onChange={(e) =>
                setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Start Year"
              value={newEdu.startYear || ""}
              onChange={(e) =>
                setNewEdu({ ...newEdu, startYear: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="End Year"
              value={newEdu.endYear || ""}
              onChange={(e) =>
                setNewEdu({ ...newEdu, endYear: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              isLoading={addEducationMutation.isPending}
            >
              Add Education
            </Button>
          </div>
        </form>
      </div>

      {/* Account Session & Sign Out Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mb-8">
        <div>
          <h2 className="text-base font-bold text-gray-900">Account Session</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Sign out of your candidate account ({user?.email}) on this device.
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          onClick={handleLogout}
          className="sm:w-auto w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out / Logout</span>
        </Button>
      </div>

      {/* Delete Experience Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteExpId)}
        title="Delete Work Experience"
        description="Are you sure you want to delete this work experience entry? This action cannot be undone."
        confirmText="Delete Experience"
        variant="danger"
        isLoading={deleteExperienceMutation.isPending}
        onConfirm={confirmDeleteExperience}
        onCancel={() => setDeleteExpId(null)}
      />

      {/* Delete Education Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteEduId)}
        title="Delete Education Entry"
        description="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete Education"
        variant="danger"
        isLoading={deleteEducationMutation.isPending}
        onConfirm={confirmDeleteEducation}
        onCancel={() => setDeleteEduId(null)}
      />
    </div>
  );
};

export default CandidateProfile;
