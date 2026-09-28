import React, { useState, useRef } from "react";
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
  useUploadAvatarMutation,
} from "../../hooks/queries";
import {
  Input,
  Textarea,
  Button,
  Skeleton,
  Modal,
  ConfirmDialog,
} from "../../components/common";
import { useAuth } from "../../context/AuthContext";

export const CandidateProfile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: profile, isLoading: loading } = useCandidateProfileQuery();
  const updateProfileMutation = useUpdateCandidateProfileMutation();
  const addExperienceMutation = useAddExperienceMutation();
  const deleteExperienceMutation = useDeleteExperienceMutation();
  const addEducationMutation = useAddEducationMutation();
  const deleteEducationMutation = useDeleteEducationMutation();
  const uploadResumeMutation = useUploadResumeMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();

  // Page View Mode (Showcase vs Full Public Profile Edit Page)
  const [isEditing, setIsEditing] = useState(false);

  // Dialog & Modal states for Experience & Education
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);
  const [isAddEduModalOpen, setIsAddEduModalOpen] = useState(false);
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null);
  const [deleteEduId, setDeleteEduId] = useState<string | null>(null);

  // Resume Modal & Viewer State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeViewerMode, setResumeViewerMode] = useState<"google" | "direct">("google");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Form State
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // avatarPreview is used for instant UI feedback during auto-upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const showcaseAvatarInputRef = useRef<HTMLInputElement>(null);

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

  // Switch to Full Edit Page with current values
  const handleStartEditing = () => {
    const current = profile || ({} as CandidateProfileType);
    setPhone(current.phone || "");
    setBio(current.bio || "");
    setLocation(current.location || "");
    setSkillsInput(
      Array.isArray(current.skills)
        ? current.skills.join(", ")
        : typeof current.skills === "string"
        ? current.skills
        : ""
    );
    setLinkedin(current.linkedin || "");
    setGithub(current.github || "");
    setPortfolio(current.portfolio || "");
    setResumeFile(null);
    setAvatarPreview(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-upload avatar immediately on file select — no save button needed
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success("Profile picture updated!", {
        description: "Your new photo has been saved to your profile.",
      });
    } catch (err: unknown) {
      // Revert preview on failure
      setAvatarPreview(null);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload profile picture.";
      toast.error("Upload Failed", { description: msg });
    } finally {
      // Reset file inputs so the same file can be re-selected if needed
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      if (showcaseAvatarInputRef.current) showcaseAvatarInputRef.current.value = "";
    }
  };

  // Auto-upload resume immediately on file select — no save button needed
  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      await uploadResumeMutation.mutateAsync(file);
      toast.success("Resume updated successfully!", {
        description: "Your resume document is now saved to your profile.",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload resume document.";
      toast.error("Upload Failed", { description: msg });
    } finally {
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: UpdateCandidateProfilePayload = {
      phone,
      bio,
      location,
      skills: skillsArray,
      linkedin,
      github,
      portfolio,
    };

    try {
      await updateProfileMutation.mutateAsync(payload);

      // Avatar is uploaded instantly on file select — not here.
      if (resumeFile) {
        await uploadResumeMutation.mutateAsync(resumeFile);
      }

      toast.success("Profile Updated", {
        description: "Your candidate public profile has been updated successfully.",
      });
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      setIsAddExpModalOpen(false);
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
      setIsAddEduModalOpen(false);
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

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-56 w-56 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const effectiveUser = profile?.user || authUser;
  const fullName = effectiveUser?.fullName || "Candidate User";
  const email = effectiveUser?.email || "";
  const avatarUrl = avatarPreview || effectiveUser?.avatar || authUser?.avatar;

  const skillsList = Array.isArray(profile?.skills)
    ? profile.skills
    : typeof profile?.skills === "string" && (profile.skills as string).length > 0
    ? (profile.skills as string).split(",").map((s) => s.trim())
    : [];

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isSaving =
    updateProfileMutation.isPending ||
    uploadResumeMutation.isPending ||
    uploadAvatarMutation.isPending;

  // =========================================================================
  // VIEW 1: FULL "PUBLIC PROFILE" SETTINGS PAGE (Image 2 GitHub Style)
  // =========================================================================
  if (isEditing) {
    return (
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Public profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage how your personal details, skills, and portfolio appear to recruiters.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="self-start sm:self-center flex items-center gap-1.5 border-slate-700 hover:bg-slate-800 text-slate-300 font-bold"
          >
            ← Back to Profile
          </Button>
        </div>

        {/* 2-Column Form Layout (Left: Form, Right: Profile Picture) */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Form Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Name */}
              <div>
                <Input
                  label="Name"
                  value={fullName}
                  disabled
                  helperText="Your name linked to your JobMatrix account."
                />
              </div>

              {/* Public Email */}
              <div>
                <Input
                  label="Public email"
                  type="email"
                  value={email}
                  disabled
                  helperText="Verified email where recruiters can reach you."
                />
              </div>

              {/* Bio */}
              <div>
                <Textarea
                  label="Bio"
                  placeholder="Hey ! there this is my engineering portfolio and skills background..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  helperText="Tell companies about yourself, your tech stack, and what you're looking for."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Skills */}
              <div>
                <Input
                  label="Skills (Comma Separated)"
                  placeholder="React, TypeScript, Node.js, Next.js, MongoDB"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  helperText="Keywords used by search filters and automated matching algorithms."
                />
              </div>

              {/* URL / Portfolio */}
              <div>
                <Input
                  label="URL (Portfolio / Website)"
                  placeholder="https://yourportfolio.dev"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>

              {/* Social Accounts */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Social accounts
                </label>

                {/* LinkedIn */}
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sky-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22c-.93 0-1.68.75-1.68 1.68s.75 1.68 1.68 1.68 1.68-.75 1.68-1.68-.75-1.68-1.68-1.68z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="https://www.linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono text-xs"
                  />
                </div>

                {/* GitHub */}
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-300 pointer-events-none">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              {/* Resume Document Upload */}
              <div className="border-t border-slate-800 pt-6 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Resume / CV Document (PDF, DOCX)
                </label>
                {profile?.resume && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                    <span className="text-emerald-300 font-mono truncate max-w-sm">
                      📄 {profile.resume.split("/").pop()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(true)}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <span>👁️</span> View Current
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setResumeFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 px-6 py-2.5 rounded-xl"
                >
                  Update profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Right Column: Profile Picture (GitHub Exact Style) */}
            <div className="lg:col-span-4 space-y-4">
              <label className="block text-sm font-bold text-white">
                Profile picture
              </label>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-black bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent select-none">
                    {initials || "CM"}
                  </span>
                )}

                {/* Uploading Spinner Overlay */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold text-emerald-300">Saving photo...</span>
                  </div>
                )}

                {/* Hidden File Input for Avatar */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />

                {/* Edit Pencil Button Overlay (Exact Image 2 Style) */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 py-1.5 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 hover:border-emerald-500/40 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg
                    className="w-3.5 h-3.5 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span>{uploadAvatarMutation.isPending ? "Uploading..." : "Edit"}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Click &quot;Edit&quot; to upload a new profile photo (JPG, PNG, or WEBP).
              </p>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEVELOPER PROFILE SHOWCASE VIEW (Image 1 Style)
  // =========================================================================
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 animate-in fade-in duration-300">
      {/* 2-Column Developer Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Avatar, Details & "Edit profile" Button                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 blur-2xl pointer-events-none" />

            {/* Profile Avatar */}
            <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 mb-5 group">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border-4 border-slate-800/90 shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 group-hover:border-emerald-400/50 transition-colors pointer-events-none" />
                
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent select-none">
                    {initials || "CM"}
                  </span>
                )}

                {/* Uploading Spinner Overlay */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold text-emerald-300">Saving photo...</span>
                  </div>
                )}

                {/* Hidden File Input for Avatar in Showcase */}
                <input
                  ref={showcaseAvatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />

                {/* Change photo hover overlay */}
                <button
                  type="button"
                  onClick={() => showcaseAvatarInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold gap-1.5 disabled:opacity-0"
                >
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Status Dot */}
              <div className="absolute bottom-3 right-3 flex items-center justify-center p-1 rounded-full bg-slate-950 border border-slate-700 shadow-md z-10" title="Available for hire">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Name & Role */}
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  {effectiveUser?.role ? `jobmatrix / ${effectiveUser.role}` : "jobmatrix / candidate"}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Talent
                </span>
              </div>
            </div>

            {/* Short Bio */}
            <div className="mt-4 text-sm text-slate-300 leading-relaxed">
              {profile?.bio ? (
                <p className="line-clamp-4">{profile.bio}</p>
              ) : (
                <p className="text-slate-500 italic">
                  No bio added yet. Click &quot;Edit profile&quot; to add a summary of your skills and goals.
                </p>
              )}
            </div>

            {/* Edit Profile Button (Triggers full edit page) */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleStartEditing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:border-emerald-500/40 shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <svg
                  className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Edit profile</span>
              </button>
            </div>

            {/* Contact & Social Links List */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3 text-sm">
              {/* Location */}
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{profile?.location || "India / Remote"}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{email || "candidate@jobmatrix.dev"}</span>
              </div>

              {/* Phone */}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="truncate">{profile.phone}</span>
                </div>
              )}

              {/* LinkedIn */}
              {profile?.linkedin && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-4 h-4 text-sky-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22c-.93 0-1.68.75-1.68 1.68s.75 1.68 1.68 1.68 1.68-.75 1.68-1.68-.75-1.68-1.68-1.68z" />
                  </svg>
                  <a
                    href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors text-xs font-semibold"
                  >
                    {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")} ↗
                  </a>
                </div>
              )}

              {/* GitHub */}
              {profile?.github && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-4 h-4 text-slate-200 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <a
                    href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors text-xs font-semibold"
                  >
                    {profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")} ↗
                  </a>
                </div>
              )}

              {/* Portfolio */}
              {profile?.portfolio && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a
                    href={profile.portfolio.startsWith("http") ? profile.portfolio : `https://${profile.portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors text-xs font-semibold"
                  >
                    {profile.portfolio.replace(/^https?:\/\//, "")} ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Resume Overview Card in Sidebar */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-5 shadow-xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>📄</span> Resume Document
              </span>
              {profile?.resume ? (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  Uploaded
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  Missing
                </span>
              )}
            </div>

            {profile?.resume ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-mono truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {profile.resume.split("/").pop()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>👁️</span> View Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploadResumeMutation.isPending}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploadResumeMutation.isPending ? "..." : "Replace"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-slate-400 mb-2">Upload your PDF resume so employers can view your profile.</p>
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadResumeMutation.isPending}
                  className="py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadResumeMutation.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>+ Upload Resume (PDF)</span>
                  )}
                </button>
              </div>
            )}

            {/* Hidden File Input for Instant Resume Upload */}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Professional Summary, Skills, Experience & Education         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Professional Summary & Skills Card */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📄</span>
                <h2 className="text-lg font-black text-white">About & Summary</h2>
              </div>
              <button
                type="button"
                onClick={handleStartEditing}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Edit</span>
              </button>
            </div>

            {/* Bio */}
            <div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {profile?.bio || (
                  <span className="text-slate-500 italic">
                    No summary added yet. Click &quot;Edit profile&quot; to add your professional bio.
                  </span>
                )}
              </p>
            </div>

            {/* Skills */}
            <div className="border-t border-slate-800/80 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Skills
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {skillsList.length} skills listed
                </span>
              </div>

              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-emerald-500/40 hover:text-emerald-300 transition-all shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No skills listed yet. Add skills in your profile.
                </p>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💼</span>
                <h2 className="text-lg font-black text-white">Work Experience</h2>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  {profile?.experience?.length || 0}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setIsAddExpModalOpen(true)}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold cursor-pointer text-xs"
              >
                + Add Experience
              </Button>
            </div>

            {profile?.experience && profile.experience.length > 0 ? (
              <div className="space-y-3">
                {profile.experience.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 flex justify-between items-start hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm">
                        {exp.title} &bull;{" "}
                        <span className="text-emerald-400">{exp.company}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {exp.startDate?.split("T")[0]} &mdash;{" "}
                        {exp.endDate?.split("T")[0] || "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      disabled={deleteExperienceMutation.isPending}
                      onClick={() => exp._id && setDeleteExpId(exp._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400 italic">No work experience added yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddExpModalOpen(true)}
                  className="mt-2 text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add your first role
                </button>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎓</span>
                <h2 className="text-lg font-black text-white">Education & Degrees</h2>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  {profile?.education?.length || 0}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setIsAddEduModalOpen(true)}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-bold cursor-pointer text-xs"
              >
                + Add Education
              </Button>
            </div>

            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((edu) => (
                  <div
                    key={edu._id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 flex justify-between items-start hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm">
                        {edu.degree} &bull;{" "}
                        <span className="text-emerald-400">{edu.institution}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ""}
                        {edu.startYear || ""} &mdash; {edu.endYear || "Present"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      disabled={deleteEducationMutation.isPending}
                      onClick={() => edu._id && setDeleteEduId(edu._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400 italic">No education details added yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddEduModalOpen(true)}
                  className="mt-2 text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  + Add college or university
                </button>
              </div>
            )}
          </div>

          {/* Account Session / Logout */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 backdrop-blur-xl">
            <div>
              <h2 className="text-base font-extrabold text-white">Account Session</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <span className="text-slate-200 font-semibold">{email}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              className="sm:w-auto w-full flex items-center justify-center gap-2 font-bold cursor-pointer bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD EXPERIENCE MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddExpModalOpen}
        onClose={() => setIsAddExpModalOpen(false)}
        title="Add Work Experience"
        size="md"
      >
        <form onSubmit={handleAddExperience} className="space-y-4">
          <Input
            label="Company Name"
            placeholder="e.g. Google, Infosys, Startup"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            required
          />
          <Input
            label="Job Title / Position"
            placeholder="e.g. Frontend Engineer, SDE Intern"
            value={newExp.title}
            onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Start Date"
              value={newExp.startDate}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              required
            />
            <Input
              type="date"
              label="End Date (Blank if current)"
              value={newExp.endDate || ""}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
            />
          </div>
          <Textarea
            label="Description & Responsibilities"
            placeholder="What tech stack did you use? What features did you build?"
            rows={3}
            value={newExp.description || ""}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddExpModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={addExperienceMutation.isPending}
              className="bg-emerald-500 text-slate-950 font-black"
            >
              Add Experience
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD EDUCATION MODAL                                                       */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddEduModalOpen}
        onClose={() => setIsAddEduModalOpen(false)}
        title="Add Education"
        size="md"
      >
        <form onSubmit={handleAddEducation} className="space-y-4">
          <Input
            label="College / University"
            placeholder="e.g. Stanford University, IIT Delhi"
            value={newEdu.institution}
            onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
            required
          />
          <Input
            label="Degree"
            placeholder="e.g. Bachelor of Technology, M.S."
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
            required
          />
          <Input
            label="Field of Study"
            placeholder="e.g. Computer Science & Engineering"
            value={newEdu.fieldOfStudy || ""}
            onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Start Year"
              placeholder="2020"
              value={newEdu.startYear || ""}
              onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
            />
            <Input
              type="number"
              label="End Year"
              placeholder="2024"
              value={newEdu.endYear || ""}
              onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddEduModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={addEducationMutation.isPending}
              className="bg-cyan-400 text-slate-950 font-black"
            >
              Add Education
            </Button>
          </div>
        </form>
      </Modal>

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

      {/* Interactive Resume Document Viewer Modal */}
      <Modal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title="Candidate Resume Document"
        size="full"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploadResumeMutation.isPending}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadResumeMutation.isPending ? "Uploading..." : "Replace Resume"}
              </button>
              {profile?.resume && (
                <div className="flex items-center rounded-xl bg-slate-950 p-0.5 border border-slate-800 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setResumeViewerMode("google")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      resumeViewerMode === "google"
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Google Viewer
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeViewerMode("direct")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      resumeViewerMode === "direct"
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Direct Frame
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {profile?.resume && (
                <>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open in New Tab ↗</span>
                  </a>
                  <a
                    href={profile.resume}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Download ⬇</span>
                  </a>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => setIsResumeModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          {profile?.resume ? (
            <div className="relative w-full h-[68vh] rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              <iframe
                key={resumeViewerMode}
                src={
                  resumeViewerMode === "google"
                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(
                        profile.resume,
                      )}&embedded=true`
                    : profile.resume
                }
                title="Resume Preview"
                className="w-full h-full border-0 rounded-2xl"
              />
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-xl">
                📄
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No Resume Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven&apos;t uploaded a resume document yet. Please upload a PDF or DOCX file to preview it here.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => resumeInputRef.current?.click()}
                className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950"
              >
                Upload Resume Now
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CandidateProfile;
