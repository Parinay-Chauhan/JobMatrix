import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  User,
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
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  }

  const user = profileData?.user || authUser;
  const fullName = user?.fullName || authUser?.fullName || "Recruiter";
  const email = user?.email || authUser?.email || "";
  const isSaving =
    updateProfileMutation.isPending || uploadLogoMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 animate-in fade-in duration-150">
      {/* Page Header Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Recruiter & organization profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
          Manage your hiring credentials, employer branding, and public organization profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal Recruiter Identity */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Personal recruiter details
              </h2>
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
              helperText="Official login and candidate notification email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role"
              placeholder="e.g. Senior Talent Partner, HR Lead"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              helperText="Your role within the hiring organization"
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
              label="Phone Number"
              placeholder="+91 98765 43210"
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
            placeholder="Introduce yourself and your hiring focus (e.g. Hiring high-impact engineers and product leaders for fast-growing technology teams)..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        {/* Card 2: Company Information */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Organization details
              </h2>
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
              placeholder="e.g. Software & Technology, Fintech, Cloud"
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
            placeholder="Describe your company culture, mission, team size, and what makes your engineering team compelling..."
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
          />

          {/* Company Logo Upload */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Company logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-16 w-16 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0">
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
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-800 file:text-xs file:font-medium file:bg-slate-900 file:text-slate-300 hover:file:bg-slate-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Supported formats: PNG, JPG, WEBP up to 2MB. Transparent backgrounds recommended.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSaving ? "Saving..." : "Save changes"}</span>
          </Button>
        </div>
      </form>

      {/* Account Session & Sign Out Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold text-white">
            Account session
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Signed in as <span className="font-medium text-slate-200">{fullName}</span> ({email})
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          onClick={handleLogout}
          className="sm:w-auto w-full flex items-center justify-center gap-1.5 font-medium bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
