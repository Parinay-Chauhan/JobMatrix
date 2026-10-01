import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  Building2,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { Job } from "../../types";
import { useCandidateProfileQuery, useUpdateCandidateProfileMutation } from "../../hooks/queries";
import { analyzeJobATS } from "../../utils/atsEngine";
import { Button } from "../common";

export interface ATSAnalyzerModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
}

export const ATSAnalyzerModal: React.FC<ATSAnalyzerModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  isApplied = false,
}) => {
  const { data: profile } = useCandidateProfileQuery();
  const updateProfileMutation = useUpdateCandidateProfileMutation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "bullets" | "checklist">("skills");

  if (!isOpen || !job) return null;

  const analysis = analyzeJobATS(job, profile);
  const companyName =
    (typeof job.recruiter === "object" ? job.recruiter?.companyName : undefined) ||
    job.companyName ||
    "Hiring Organization";

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Bullet point copied!", {
      description: "Paste this directly into your resume's experience section.",
    });
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleAddSkillToProfile = async (skillToAdd: string) => {
    if (!profile) return;
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(skillToAdd)) return;

    const updatedSkills = [...currentSkills, skillToAdd];
    try {
      await updateProfileMutation.mutateAsync({
        skills: updatedSkills,
      });
      toast.success(`Added "${skillToAdd}" to your Profile!`, {
        description: "Your ATS Match score has been recalculated.",
      });
    } catch {
      toast.error("Failed to update skills in profile.");
    }
  };

  // Color mapping based on match band
  const bandConfig = {
    high: {
      text: "Strong ATS Match",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      circleClass: "text-emerald-400 stroke-emerald-400",
      accentBg: "from-emerald-500/20 via-teal-500/10 to-transparent",
    },
    medium: {
      text: "Moderate Match (Keywords Needed)",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      circleClass: "text-amber-400 stroke-amber-400",
      accentBg: "from-amber-500/20 via-orange-500/10 to-transparent",
    },
    low: {
      text: "Optimization Required",
      badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      circleClass: "text-rose-400 stroke-rose-400",
      accentBg: "from-rose-500/20 via-orange-500/10 to-transparent",
    },
  }[analysis.matchBand];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip with Glowing Gradient */}
        <div className={`p-6 border-b border-slate-800 bg-gradient-to-r ${bandConfig.accentBg} flex justify-between items-start gap-4 shrink-0`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-bold text-white uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI ATS Resume Optimizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{companyName}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">{job.location || "Remote / Hybrid"}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Top Score Banner & ATS Health Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 items-center">
            {/* Circular Gauge Meter */}
            <div className="flex flex-col items-center justify-center sm:border-r sm:border-slate-800 sm:pr-4">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={bandConfig.circleClass}
                    strokeDasharray={`${analysis.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white">{analysis.score}%</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Match</span>
                </div>
              </div>
              <span className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${bandConfig.badgeClass}`}>
                {bandConfig.text}
              </span>
            </div>

            {/* Quick Diagnostic Insights */}
            <div className="sm:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ATS Screening Diagnostic
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysis.keywordDensityAdvice}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{analysis.matchedSkills.length} Matched Skills</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{analysis.missingSkills.length} Keywords to Add</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "skills"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>Skills Gap Breakdown</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-extrabold text-slate-300">
                {analysis.allRequiredSkills.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bullets")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bullets"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tailored Resume Bullets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("checklist")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "checklist"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Health Checklist</span>
            </button>
          </div>

          {/* TAB 1: SKILLS GAP BREAKDOWN */}
          {activeTab === "skills" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Missing Skills Section (Top Priority) */}
              <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Missing Critical Keywords ({analysis.missingSkills.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Click to add to your profile</span>
                </div>

                {analysis.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-medium py-1">
                    🎉 Excellent! You have included all primary technical keywords required for this role.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysis.missingSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkillToProfile(skill)}
                        disabled={updateProfileMutation.isPending}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                        title={`Click to add ${skill} to your profile skills`}
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400 group-hover:text-emerald-300 transition-colors" />
                        <span>{skill}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-emerald-400 font-normal">
                          (+Add)
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Matched Skills Section */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Matching Skills Found ({analysis.matchedSkills.length})
                  </h3>
                </div>

                {analysis.matchedSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 py-1">
                    No exact skills matched yet. Add the missing keywords above to boost your ATS compatibility!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysis.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TAILORED RESUME BULLET POINTS */}
          {activeTab === "bullets" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                💡 <span className="font-bold">ATS Tip:</span> Hiring managers and ATS parsers look for quantifiable achievements with strong action verbs. Copy these ready-to-use bullet points into your resume:
              </div>

              <div className="space-y-3">
                {analysis.suggestedBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-start justify-between gap-3 transition-colors group"
                  >
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      &bull; {bullet}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-all shrink-0 cursor-pointer"
                      title="Copy bullet point to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATS HEALTH CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {analysis.formattingTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-3.5"
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${tip.passed ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {tip.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>{tip.title}</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${tip.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"}`}>
                        {tip.passed ? "PASSED" : "ACTION REQUIRED"}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <Link
            to="/candidate/profile"
            onClick={onClose}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Edit Full Profile & Skills in Profile Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-700 text-slate-300 font-semibold"
            >
              Close
            </Button>
            {onApply && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isApplied}
                onClick={() => {
                  onApply(job._id);
                  onClose();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              >
                {isApplied ? "Already Applied" : "Apply to Job Now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzerModal;
