import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  User,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  useRecruiterProfileQuery,
  useUpdateRecruiterProfileMutation,
  useUploadCompanyLogoMutation,
} from "../../hooks/queries";
import { Input, Textarea, Skeleton } from "../../components/common";

export const RecruiterProfile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const { data: profileData, isLoading: loading } = useRecruiterProfileQuery();
  const updateProfileMutation = useUpdateRecruiterProfileMutation();
  const uploadLogoMutation = useUploadCompanyLogoMutation();

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  // Logo File State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    if (profileData) {
      setCompanyName(profileData.companyName || "");
      setDesignation(profileData.designation || "");
      setExperience(profileData.experience || "");
      setPhone(profileData.phone || "");
      setBio(profileData.bio || "");
      setCompanyWebsite(profileData.companyWebsite || "");
      setCompanyDescription(profileData.companyDescription || "");
      setLocation(profileData.location || "");
      setIndustry(profileData.industry || "");
      if (profileData.companyLogo) {
        setLogoPreview(profileData.companyLogo);
      }
    }
  }, [profileData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Company logo must be under 2MB.",
        });
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Validation error", {
        description: "Company name is required.",
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        companyName: companyName.trim(),
        designation: designation.trim(),
        experience: experience.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        companyWebsite: companyWebsite.trim(),
        companyDescription: companyDescription.trim(),
        location: location.trim(),
        industry: industry.trim(),
      });

      if (logoFile) {
        await uploadLogoMutation.mutateAsync(logoFile);
        setLogoFile(null);
      }

      toast.success("Profile updated", {
        description: "Your recruiter and organization profile have been saved.",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update recruiter profile.";
      toast.error("Update failed", { description: msg });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully.");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const user = profileData?.user || authUser;
  const fullName = user?.fullName || authUser?.fullName || "Recruiter";
  const email = user?.email || authUser?.email || "";
  const isSaving =
    updateProfileMutation.isPending || uploadLogoMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* High-End Header Banner with Subtle Radial Glow & Glass Surface */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
        {/* Ambient Top Glow Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/3 h-48 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Employer Identity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Recruiter & organization profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Configure hiring partner credentials, brand assets, and verified organization details.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-xs text-slate-300 font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified employer</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal Recruiter Identity */}
        <div className="group rounded-2xl bg-slate-900/40 border border-white/[0.07] hover:border-white/[0.12] p-6 sm:p-7 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-200 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Personal recruiter details
              </h2>
              <p className="text-xs text-slate-400">
                Contact information visible to applicants and team members
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              disabled
              helperText="Account name verified on JobMatrix"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              disabled
              helperText="Official communication and notification email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role"
              placeholder="e.g. Senior Talent Partner, HR Lead"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              helperText="Your title within the hiring team"
            />
            <Input
              label="Hiring Experience"
              placeholder="e.g. 5+ Years in Tech Hiring"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              helperText="Total years of recruitment expertise"
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
              label="Account Verification"
              value="Verified Recruiter / Hiring Manager"
              disabled
            />
          </div>

          <Textarea
            label="Recruiter Bio & Hiring Focus"
            placeholder="Introduce yourself and your hiring focus (e.g. Partnering with top engineers and designers to build scalable modern systems)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            helperText="A brief bio displayed alongside your open listings"
          />
        </div>

        {/* Card 2: Company Information */}
        <div className="group rounded-2xl bg-slate-900/40 border border-white/[0.07] hover:border-white/[0.12] p-6 sm:p-7 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all duration-200 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Organization details
              </h2>
              <p className="text-xs text-slate-400">
                Public profile and branding displayed across your job posts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g. Stripe, Razorpay, Linear"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <Input
              label="Industry Domain"
              placeholder="e.g. Software & Technology, Fintech, AI"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Headquarters / Location"
              placeholder="e.g. Bengaluru, India / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Company Website"
              placeholder="https://company.com"
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <Textarea
            label="About the Organization"
            placeholder="Share your company's mission, engineering culture, and work values..."
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
          />

          {/* Company Logo Upload */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Organization logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="h-16 w-16 rounded-full border border-white/[0.1] bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoChange}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-white/[0.08] file:text-xs file:font-medium file:bg-slate-900 file:text-slate-300 hover:file:bg-slate-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Supported formats: PNG, JPG, or WEBP up to 2MB. Square ratio recommended.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - High End Linear Style Primary Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving profile...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save recruiter profile</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Account Session & Sign Out Card */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/[0.07] p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-white">
            Account session
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Signed in as <span className="font-medium text-slate-200">{fullName}</span> ({email})
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="sm:w-auto w-full inline-flex items-center justify-center gap-1.5 font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
