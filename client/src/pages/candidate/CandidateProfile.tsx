import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  Eye,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  UploadCloud,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Calendar,
} from "lucide-react";
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
  AvatarCropModal,
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

  // Page View Mode (Showcase vs Full Profile Edit Form)
  const [isEditing, setIsEditing] = useState(false);

  // Dialog & Modal states for Experience & Education
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);
  const [isAddEduModalOpen, setIsAddEduModalOpen] = useState(false);
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null);
  const [deleteEduId, setDeleteEduId] = useState<string | null>(null);

  // Resume Modal & Viewer State
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeViewerMode, setResumeViewerMode] = useState<"google" | "direct" | "office">("google");
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const showcaseAvatarInputRef = useRef<HTMLInputElement>(null);

  // Avatar Cropper Modal State
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

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

  // Switch to Edit View with current values
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

  // Open Avatar Cropper Modal when user selects a photo
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setCropFile(file);
    setIsCropModalOpen(true);

    if (avatarInputRef.current) avatarInputRef.current.value = "";
    if (showcaseAvatarInputRef.current) showcaseAvatarInputRef.current.value = "";
  };

  // Upload cropped avatar file
  const handleCropSave = async (croppedFile: File) => {
    const localUrl = URL.createObjectURL(croppedFile);
    setAvatarPreview(localUrl);

    try {
      await uploadAvatarMutation.mutateAsync(croppedFile);
      setIsCropModalOpen(false);
      setCropFile(null);
      toast.success("Profile photo updated successfully.");
    } catch (err: unknown) {
      setAvatarPreview(null);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload profile photo.";
      toast.error("Upload Error", { description: msg });
    }
  };

  // Auto-upload resume immediately on file select
  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      await uploadResumeMutation.mutateAsync(file);
      toast.success("Resume document uploaded successfully.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload resume document.";
      toast.error("Upload Error", { description: msg });
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

      if (resumeFile) {
        await uploadResumeMutation.mutateAsync(resumeFile);
      }

      toast.success("Profile saved successfully.");
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile.";
      toast.error("Update Failed", { description: msg });
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.company || !newExp.title || !newExp.startDate) {
      toast.error("Missing Required Fields", {
        description: "Company, job title, and start date are required.",
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
      toast.success("Work experience added.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add work experience.";
      toast.error("Error", { description: msg });
    }
  };

  const confirmDeleteExperience = async () => {
    if (!deleteExpId) return;
    try {
      await deleteExperienceMutation.mutateAsync(deleteExpId);
      toast.success("Work experience entry removed.");
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
      toast.error("Missing Required Fields", {
        description: "Institution name and degree are required.",
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
      toast.success("Education record added.");
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
      toast.success("Education record removed.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete education record.";
      toast.error("Error", { description: msg });
    } finally {
      setDeleteEduId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully.");
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
  // VIEW 1: FULL PROFILE SETTINGS EDIT FORM
  // =========================================================================
  if (isEditing) {
    return (
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Edit Candidate Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure personal information, skills, and links displayed to prospective employers.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="self-start sm:self-center flex items-center gap-2 border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Button>
        </div>

        {/* 2-Column Form Layout */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Form Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Full Name */}
              <div>
                <Input
                  label="Full Name"
                  value={fullName}
                  disabled
                  helperText="Primary name associated with your JobMatrix account."
                />
              </div>

              {/* Verified Email */}
              <div>
                <Input
                  label="Account Email"
                  type="email"
                  value={email}
                  disabled
                  helperText="Verified address used for system notices and recruiter inquiries."
                />
              </div>

              {/* Bio / Summary */}
              <div>
                <Textarea
                  label="Professional Summary"
                  placeholder="Summarize your professional background, technical specializations, and career achievements..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  helperText="Provide a concise summary of your technical background and current focus."
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
                  label="Skills (Comma-separated)"
                  placeholder="React, TypeScript, Node.js, Next.js, PostgreSQL, Docker"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  helperText="Searchable keywords utilized for matching algorithm ranking."
                />
              </div>

              {/* Portfolio */}
              <div>
                <Input
                  label="Portfolio / Personal Website"
                  placeholder="https://yourportfolio.dev"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>

              {/* Social Accounts */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Professional Links
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
                  Resume Document (PDF, DOCX)
                </label>
                {profile?.resume && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                    <span className="text-emerald-300 font-mono truncate max-w-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="truncate">{profile.resume.split("/").pop()}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(true)}
                      className="text-emerald-400 font-semibold hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Current</span>
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setResumeFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl"
                >
                  Save Changes
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

            {/* Right Column: Profile Photo (Perfect Circular Frame) */}
            <div className="lg:col-span-4 space-y-4">
              <label className="block text-sm font-bold text-white">
                Profile Photo
              </label>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="w-16 h-16 text-slate-600 mb-1" />
                    <span className="text-sm font-semibold">{initials || "User"}</span>
                  </div>
                )}

                {/* Uploading Spinner */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold text-emerald-300">Uploading...</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />

                {/* Edit Pencil Button */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 py-1.5 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 hover:border-emerald-500/40 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-300" />
                  <span>{uploadAvatarMutation.isPending ? "Saving..." : "Change Photo"}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Recommended formats: JPG, PNG, or WEBP. File size up to 5MB.
              </p>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: CANDIDATE PROFILE SHOWCASE VIEW
  // =========================================================================
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 animate-in fade-in duration-200">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: Avatar, Basic Bio, Contact, Resume                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 shadow-xl relative overflow-hidden">
            {/* Top ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-emerald-500/5 blur-xl pointer-events-none" />

            {/* Profile Avatar (Perfect Circle) */}
            <div className="relative mx-auto w-44 h-44 sm:w-48 sm:h-48 mb-5 group">
              <div className="w-full h-full rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="w-16 h-16 text-slate-600 mb-1" />
                    <span className="text-xl font-bold text-slate-300">{initials || "User"}</span>
                  </div>
                )}

                {/* Uploading Spinner */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-semibold text-emerald-300">Saving photo...</span>
                  </div>
                )}

                {/* Hidden File Input */}
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
                  className="absolute inset-0 bg-slate-950/75 backdrop-blur-2xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold gap-1.5 disabled:opacity-0"
                >
                  <Pencil className="w-5 h-5 text-emerald-400" />
                  <span>Update Photo</span>
                </button>
              </div>
            </div>

            {/* Name & Role Header */}
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span className="text-xs font-medium text-slate-400">
                  Candidate Profile
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Open to Opportunities
                </span>
              </div>
            </div>

            {/* Short Bio */}
            <div className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {profile?.bio ? (
                <p className="line-clamp-4">{profile.bio}</p>
              ) : (
                <p className="text-slate-500 italic">
                  No summary added yet. Click &quot;Edit Profile&quot; to configure your background details.
                </p>
              )}
            </div>

            {/* Edit Profile Action Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleStartEditing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-bold border border-slate-700 hover:border-slate-600 shadow-xs transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Contact & Social Links List */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs">
              {/* Location */}
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{profile?.location || "Location not set"}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{email || "No email available"}</span>
              </div>

              {/* Phone */}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{profile.phone}</span>
                </div>
              )}

              {/* LinkedIn */}
              {profile?.linkedin && (
                <div className="flex items-center gap-3 text-slate-300 group">
                  <svg className="w-4 h-4 text-sky-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22c-.93 0-1.68.75-1.68 1.68s.75 1.68 1.68 1.68 1.68-.75 1.68-1.68-.75-1.68-1.68-1.68z" />
                  </svg>
                  <a
                    href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="truncate">{profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </a>
                </div>
              )}

              {/* GitHub */}
              {profile?.github && (
                <div className="flex items-center gap-3 text-slate-300 group">
                  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <a
                    href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="truncate">{profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </a>
                </div>
              )}

              {/* Portfolio */}
              {profile?.portfolio && (
                <div className="flex items-center gap-3 text-slate-300 group">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={profile.portfolio.startsWith("http") ? profile.portfolio : `https://${profile.portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="truncate">{profile.portfolio.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Resume Document Sidebar Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Resume Document</span>
              </span>
              {profile?.resume ? (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Uploaded
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  Missing
                </span>
              )}
            </div>

            {profile?.resume ? (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-300 font-mono truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {profile.resume.split("/").pop()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploadResumeMutation.isPending}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploadResumeMutation.isPending ? "..." : "Replace"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-slate-400 mb-3">
                  Upload your resume in PDF format to enhance recruiter discovery.
                </p>
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={uploadResumeMutation.isPending}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadResumeMutation.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Resume</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Hidden Input for Instant Resume Upload */}
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
        {/* RIGHT COLUMN: Summary, Skills, Work Experience, Education                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Professional Summary & Skills Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 shadow-xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Professional Summary</h2>
              </div>
              <button
                type="button"
                onClick={handleStartEditing}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {/* Bio */}
            <div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {profile?.bio || (
                  <span className="text-slate-500 italic">
                    No summary provided yet. Click &quot;Edit&quot; to describe your background and experience.
                  </span>
                )}
              </p>
            </div>

            {/* Skills */}
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technical Skills & Competencies
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {skillsList.length} skills listed
                </span>
              </div>

              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium hover:border-slate-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No skills listed yet. Add skills through the edit profile view.
                </p>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-teal-400" />
                <h2 className="text-base font-bold text-white">Work Experience</h2>
                <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md">
                  {profile?.experience?.length || 0}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setIsAddExpModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold cursor-pointer text-xs whitespace-nowrap shrink-0"
              >
                Add Position
              </Button>
            </div>

            {profile?.experience && profile.experience.length > 0 ? (
              <div className="space-y-3">
                {profile.experience.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex justify-between items-start hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm">
                        {exp.title}{" "}
                        <span className="text-slate-400 font-normal">at</span>{" "}
                        <span className="text-emerald-400">{exp.company}</span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>
                          {exp.startDate?.split("T")[0]} &mdash;{" "}
                          {exp.endDate?.split("T")[0] || "Present"}
                        </span>
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-xs text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      disabled={deleteExperienceMutation.isPending}
                      onClick={() => exp._id && setDeleteExpId(exp._id)}
                      title="Delete experience entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400">No work experience listed yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddExpModalOpen(true)}
                  className="mt-2 text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add Experience Record
                </button>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Education & Credentials</h2>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                  {profile?.education?.length || 0}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setIsAddEduModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold cursor-pointer text-xs whitespace-nowrap shrink-0"
              >
                Add Education
              </Button>
            </div>

            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((edu) => (
                  <div
                    key={edu._id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex justify-between items-start hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm">
                        {edu.degree}{" "}
                        <span className="text-slate-400 font-normal">from</span>{" "}
                        <span className="text-cyan-400">{edu.institution}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ""}
                        {edu.startYear || ""} &mdash; {edu.endYear || "Present"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      disabled={deleteEducationMutation.isPending}
                      onClick={() => edu._id && setDeleteEduId(edu._id)}
                      title="Delete education record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400">No education credentials added yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddEduModalOpen(true)}
                  className="mt-2 text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                >
                  + Add Degree or University
                </button>
              </div>
            )}
          </div>

          {/* Account Session / Logout */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Account Session</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Signed in as <span className="text-slate-200 font-medium">{email}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              className="sm:w-auto w-full flex items-center justify-center gap-2 font-semibold cursor-pointer bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/30 text-xs"
            >
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
            placeholder="e.g. Acme Corp, Stripe, Microsoft"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            required
          />
          <Input
            label="Job Title"
            placeholder="e.g. Senior Software Engineer"
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
              label="End Date (Leave blank if current)"
              value={newExp.endDate || ""}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
            />
          </div>
          <Textarea
            label="Key Responsibilities & Achievements"
            placeholder="Outline your impact, technologies used, and core projects delivered..."
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
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
        title="Add Education Record"
        size="md"
      >
        <form onSubmit={handleAddEducation} className="space-y-4">
          <Input
            label="Institution / University"
            placeholder="e.g. Stanford University, IIT Bombay"
            value={newEdu.institution}
            onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
            required
          />
          <Input
            label="Degree"
            placeholder="e.g. Bachelor of Technology, Master of Science"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
            required
          />
          <Input
            label="Field of Study"
            placeholder="e.g. Computer Science, Information Systems"
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
              label="Graduation Year"
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
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
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
        confirmText="Delete Entry"
        variant="danger"
        isLoading={deleteExperienceMutation.isPending}
        onConfirm={confirmDeleteExperience}
        onCancel={() => setDeleteExpId(null)}
      />

      {/* Delete Education Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteEduId)}
        title="Delete Education Record"
        description="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete Record"
        variant="danger"
        isLoading={deleteEducationMutation.isPending}
        onConfirm={confirmDeleteEducation}
        onCancel={() => setDeleteEduId(null)}
      />

      {/* Resume Document Viewer Modal */}
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
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
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
                    Direct PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeViewerMode("office")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      resumeViewerMode === "office"
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Office View
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {profile?.resume && (
                <>
                  <button
                    type="button"
                    onClick={() => window.open(profile.resume, "_blank", "noopener,noreferrer")}
                    className="py-2 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={profile.resume}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Download</span>
                    <Download className="w-3.5 h-3.5" />
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
            <div className="space-y-2">
              {/* Document Banner Notice & Quick Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="truncate max-w-md font-mono text-emerald-400">
                  {profile.resume.split("/").pop()}
                </span>
                <button
                  type="button"
                  onClick={() => window.open(profile.resume, "_blank", "noopener,noreferrer")}
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Trouble viewing? Open in full tab</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="relative w-full h-[65vh] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
                {resumeViewerMode === "direct" ? (
                  <object
                    data={profile.resume}
                    type="application/pdf"
                    className="w-full h-full rounded-xl"
                  >
                    <iframe
                      src={profile.resume}
                      title="Direct Resume Frame"
                      className="w-full h-full border-0 rounded-xl"
                    />
                  </object>
                ) : resumeViewerMode === "office" ? (
                  <iframe
                    key="office-viewer"
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      profile.resume,
                    )}`}
                    title="Office Resume Preview"
                    className="w-full h-full border-0 rounded-xl"
                  />
                ) : (
                  <iframe
                    key="google-viewer"
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      profile.resume,
                    )}&embedded=true`}
                    title="Google Docs Resume Preview"
                    className="w-full h-full border-0 rounded-xl"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No Resume Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload a PDF or DOCX file to preview your resume document here.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => resumeInputRef.current?.click()}
                className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Upload Resume
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Avatar Cropper Modal */}
      <AvatarCropModal
        isOpen={isCropModalOpen}
        imageFile={cropFile}
        onClose={() => {
          setIsCropModalOpen(false);
          setCropFile(null);
        }}
        onSave={handleCropSave}
        isSaving={uploadAvatarMutation.isPending}
      />
    </div>
  );
};

export default CandidateProfile;
