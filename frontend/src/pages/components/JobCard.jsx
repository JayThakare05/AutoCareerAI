import { useEffect, useState } from "react";
import { Bookmark, X, MapPin, Building2, Briefcase, ExternalLink, Star, ChevronRight } from "lucide-react";
import API from "../../api/api";
import toast from "react-hot-toast";

/* ─── Job Card ───────────────────────────────────────────────── */
const JobCard = ({ job, isSavedPage = false, onRemove }) => {
  const [saved, setSaved] = useState(false);
  const jobId = job.jobId || job.url;

  useEffect(() => {
    if (isSavedPage) setSaved(true);
  }, [isSavedPage]);

  const saveJob = async () => {
    const loadingToast = toast.loading("Saving job to vault...");
    try {
      await API.post("/saved-jobs", {
        jobId,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        matchScore: job.matchScore,
        description: job.description,
        matchedSkills: job.matchedSkills || [],
      });
      setSaved(true);
      toast.success("Job bookmarked!", { id: loadingToast });
    } catch {
      toast.error("Failed to save job", { id: loadingToast });
    }
  };

  const removeJob = async () => {
    const loadingToast = toast.loading("Purging bookmark...");
    try {
      await API.delete(`/saved-jobs/${jobId}`);
      setSaved(false);
      onRemove && onRemove(jobId);
      toast.success("Bookmark removed", { id: loadingToast });
    } catch {
      toast.error("Failed to remove job", { id: loadingToast });
    }
  };

  const score = job.matchScore ?? 0;
  const matchColor =
    score >= 70 ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30" :
      score >= 40 ? "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30" :
        "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";

  const barColor =
    score >= 70 ? "bg-green-500" :
      score >= 40 ? "bg-yellow-400" :
        "bg-red-400";

  return (
    <div
      className="
        bg-white dark:bg-[#14141f]
        border border-gray-100 dark:border-[#1e1e30]
        rounded-2xl p-6
        shadow-sm hover:shadow-lg dark:hover:shadow-card-dark
        hover:-translate-y-1 hover:border-blue-200 dark:hover:border-electric/30
        transition-all duration-300 group
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-snug">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
              <Building2 size={14} className="text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-slate-300">{job.company}</span>
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
              <MapPin size={14} className="text-gray-400" />
              {job.location}
            </p>
            {job.category?.label && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 dark:bg-electric/10 dark:text-electric">
                {job.category.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`shrink-0 px-3 py-1 text-xs font-black rounded-full ${matchColor}`}>
            {score}% Match
          </span>
        </div>
      </div>

      {/* Match bar */}
      <div className="mt-5 w-full h-1.5 bg-gray-100 dark:bg-[#1e1e30] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Full Description */}
      <div className="mt-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
          <Briefcase size={12} /> Job Overview
        </h4>
        <p className="text-sm text-gray-700 dark:text-slate-400 leading-relaxed whitespace-pre-line">
          {job.description || "No detailed description available."}
        </p>
      </div>

      {/* All Matched skills */}
      {job.matchedSkills?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
            <Star size={12} /> Skills You Have
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {job.matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-1 rounded-lg font-bold
                  bg-green-50 text-green-700 border border-green-100
                  dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-[#1e1e30]">
        <button
          onClick={() => window.open(job.url, "_blank")}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-black rounded-xl bg-blue-600 dark:bg-electric text-white hover:shadow-lg dark:hover:shadow-electric hover:scale-[1.02] active:scale-95 transition-all"
        >
          Apply to Role <ExternalLink size={14} />
        </button>
        
        {!isSavedPage ? (
          <button
            onClick={saved ? undefined : saveJob}
            disabled={saved}
            className={`
              w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all
              ${saved
                ? "border-blue-200 dark:border-electric/20 text-blue-600 dark:text-electric bg-blue-50 dark:bg-electric/5"
                : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5"
              }
            `}
          >
            <Bookmark size={14} className={saved ? "fill-current" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
        ) : (
          <button
            onClick={removeJob}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-black"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
