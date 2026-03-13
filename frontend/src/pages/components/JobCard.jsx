import { useEffect, useState } from "react";
import { Bookmark, X, MapPin, Building2, Briefcase, ExternalLink, Star, ChevronRight } from "lucide-react";
import API from "../../api/api";
import toast from "react-hot-toast";

/* ─── Full details modal ─────────────────────────────────────── */
const JobModal = ({ job, onClose, saved, onSave, onRemove, isSavedPage }) => {
  const score = job.matchScore ?? 0;
  const matchColor =
    score >= 70 ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30" :
      score >= 40 ? "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30" :
        "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";

  const barColor =
    score >= 70 ? "bg-green-500" :
      score >= 40 ? "bg-yellow-400" :
        "bg-red-400";

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="
          relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
          bg-white dark:bg-[#13131f]
          border border-gray-100 dark:border-[#1e1e30]
          rounded-3xl shadow-2xl dark:shadow-electric/10
          animate-slide-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-slate-400 transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Header gradient strip */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#00b4ff]/20 dark:to-purple-900/40 p-8 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-5%] w-[200px] h-[200px] bg-white/10 dark:bg-electric/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white leading-tight">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Building2 size={14} />
                    <span className="font-semibold">{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1.5 text-white/70 text-sm">
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.category?.label && (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                      {job.category.label}
                    </span>
                  )}
                </div>
              </div>
              <span className={`shrink-0 px-4 py-2 text-sm font-black rounded-2xl ${matchColor}`}>
                {score}% Match
              </span>
            </div>

            {/* Match bar */}
            <div className="mt-5 w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3 flex items-center gap-2">
              <Briefcase size={12} /> Job Description
            </h3>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description || "No description available for this position. Click 'Apply' to visit the job listing for full details."}
            </p>
          </div>

          {/* Matched skills */}
          {job.matchedSkills?.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <Star size={12} /> Skills Matched
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-xl font-semibold
                      bg-green-50 text-green-700 border border-green-100
                      dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-[#1e1e30]">
            <button
              onClick={() => window.open(job.url, "_blank")}
              className="
                flex-1 flex items-center justify-center gap-2
                px-6 py-3 text-sm font-black rounded-2xl
                bg-blue-600 hover:bg-blue-700 dark:bg-electric dark:hover:bg-electric-dark
                text-white transition-all duration-200
                hover:shadow-lg dark:hover:shadow-electric
                active:scale-95
              "
            >
              Apply Now <ExternalLink size={15} />
            </button>

            {!isSavedPage ? (
              <button
                onClick={saved ? undefined : onSave}
                disabled={saved}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all duration-200
                  ${saved
                    ? "border-purple-300 dark:border-electric/40 text-purple-600 dark:text-electric bg-purple-50 dark:bg-electric/10 cursor-default"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-electric/40 hover:text-purple-600 dark:hover:text-electric hover:bg-purple-50 dark:hover:bg-electric/10"
                  }
                `}
              >
                <Bookmark size={15} className={saved ? "fill-current" : ""} />
                {saved ? "Saved" : "Save Job"}
              </button>
            ) : (
              <button
                onClick={onRemove}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Job Card ───────────────────────────────────────────────── */
const JobCard = ({ job, isSavedPage = false, onRemove }) => {
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
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
    <>
      {/* Modal */}
      {showModal && (
        <JobModal
          job={job}
          onClose={() => setShowModal(false)}
          saved={saved}
          onSave={saveJob}
          onRemove={removeJob}
          isSavedPage={isSavedPage}
        />
      )}

      {/* Card — clickable to open modal */}
      <div
        onClick={() => setShowModal(true)}
        className="
          bg-white dark:bg-[#14141f]
          border border-gray-100 dark:border-[#1e1e30]
          rounded-2xl p-6 cursor-pointer
          shadow-sm hover:shadow-lg dark:hover:shadow-card-dark
          hover:-translate-y-1 hover:border-blue-200 dark:hover:border-electric/30
          transition-all duration-300 group
        "
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-electric transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              <span className="font-medium text-gray-700 dark:text-slate-300">{job.company}</span>
              {" "}• {job.location}
            </p>
            {job.category?.label && (
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-electric/10 dark:text-electric">
                {job.category.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${matchColor}`}>
              {score}% Match
            </span>
            <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-electric transition-colors" />
          </div>
        </div>

        {/* Match bar */}
        <div className="mt-4 w-full h-1.5 bg-gray-100 dark:bg-[#1e1e30] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Description preview */}
        <p className="mt-4 text-sm text-gray-700 dark:text-slate-400 leading-relaxed line-clamp-2">
          {job.description || "Click to view full job details and requirements."}
        </p>

        {/* Matched skills preview */}
        {job.matchedSkills?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mb-2">Skills matched</p>
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full
                    bg-green-50 text-green-700 border border-green-100
                    dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40"
                >
                  {skill}
                </span>
              ))}
              {job.matchedSkills.length > 4 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-slate-500 border border-gray-100 dark:border-white/10">
                  +{job.matchedSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100 dark:border-[#1e1e30]">
          <span className="text-xs text-gray-400 dark:text-slate-600 font-medium">Click to view full details</span>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 dark:text-electric">
            View & Apply <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </>
  );
};

export default JobCard;
