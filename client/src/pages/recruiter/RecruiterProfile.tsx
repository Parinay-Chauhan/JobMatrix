import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
    <div className="max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recruiter & Company Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal recruiter details, company identity, and hiring branding.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Personal Recruiter Identity */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Personal Recruiter Details
              </h2>
              <p className="text-xs text-gray-400">
                Information about you as a hiring partner
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
              helperText="Your job title within the company"
            />
            <Input
              label="Recruiter Experience"
              placeholder="e.g. 5+ Years in Tech Hiring"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              helperText="Total years of recruitment expertise"
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
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
              🏢
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Company & Organization Details
              </h2>
              <p className="text-xs text-gray-400">
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
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Company Logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-400 text-center px-1">
                    No Logo
                  </span>
                )}
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoChange}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <p className="text-[11px] text-gray-400">
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
            className="w-full sm:w-auto px-8 py-3 text-sm font-bold shadow-md shadow-indigo-100"
          >
            {isSaving ? "Saving Profile..." : "Save Recruiter Profile"}
          </Button>
        </div>
      </form>

      {/* Account Session & Sign Out Card at Bottom */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Employer Account Session
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Signed in as <span className="font-semibold text-gray-800">{fullName}</span> ({email})
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
    </div>
  );
};

export default RecruiterProfile;
