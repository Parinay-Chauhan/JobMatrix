import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  User,
  Globe,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Sparkles,
  UploadCloud,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  useRecruiterProfileQuery,
  useUpdateRecruiterProfileMutation,
  useUploadCompanyLogoMutation,
} from "../../hooks/queries";
import { Input, Textarea, Button, Skeleton } from "../../components/common";

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
        toast.error("File Too Large", {
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
      toast.error("Validation Error", {
        description: "Company name is required.",
      });
      return;
    }

    try {
      // 1. Update text profile fields
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

      // 2. Upload logo if selected
      if (logoFile) {
        await uploadLogoMutation.mutateAsync(logoFile);
        setLogoFile(null);
      }

      toast.success("Profile Updated", {
        description: "Your recruiter and company profile have been saved successfully.",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update recruiter profile.";
      toast.error("Update Failed", { description: msg });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  const user = profileData?.user || authUser;
  const fullName = user?.fullName || authUser?.fullName || "Recruiter";
  const email = user?.email || authUser?.email || "";
  const isSaving =
    updateProfileMutation.isPending || uploadLogoMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Employer Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Recruiter & Company Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Manage your personal recruiter credentials, organization branding, and public hiring profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Personal Recruiter Identity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Personal Recruiter Details
              </h2>
              <p className="text-xs text-slate-400">
                Information about you as a hiring coordinator
              </p>
            </div>
          </div>

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
              helperText="Official login & candidate notification email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role"
              placeholder="e.g. Senior Talent Partner, HR Lead"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              helperText="Your role within the hiring team"
            />
            <Input
              label="Recruiter Experience"
              placeholder="e.g. 5+ Years in Tech Hiring"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              helperText="Total years of hiring expertise"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone / Contact Number"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Account Role"
              value="Verified Employer / Recruiter"
              disabled
            />
          </div>

          <Textarea
            label="Recruiter Bio"
            placeholder="Introduce yourself and your hiring focus (e.g. Hiring top 1% Full Stack Engineers and Designers for high-growth tech teams)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        {/* Card 2: Company Information */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="h-10 w-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Company & Organization Details
              </h2>
              <p className="text-xs text-slate-400">
                This information will be displayed to candidates on your job postings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g. Stripe, Razorpay, TechCorp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <Input
              label="Industry"
              placeholder="e.g. Software & Technology, Fintech, AI"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Headquarter / Office Location"
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
            label="Company Description / About Us"
            placeholder="Tell candidates about your company culture, mission, team size, and what makes your workplace exciting..."
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
          />

          {/* Company Logo Upload */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Company Logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-600" />
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoChange}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/15 file:text-emerald-300 hover:file:bg-emerald-500/25 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Supported formats: PNG, JPG, WEBP (Max 2MB). Transparent backgrounds recommended.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>{isSaving ? "Saving Profile..." : "Save Recruiter Profile"}</span>
          </Button>
        </div>
      </form>

      {/* Account Session & Sign Out Card at Bottom */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-base font-bold text-white">
            Employer Account Session
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Signed in as <span className="font-semibold text-emerald-400">{fullName}</span> ({email})
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          onClick={handleLogout}
          className="sm:w-auto w-full flex items-center justify-center gap-2 font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
