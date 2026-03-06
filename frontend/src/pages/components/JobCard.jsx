import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import API from "../../api/api";

const JobCard = ({ job, isSavedPage = false, onRemove }) => {
  const [saved, setSaved] = useState(false);
  const jobId = job.jobId || job.url;

  useEffect(() => {
    if (isSavedPage) setSaved(true);
  }, [isSavedPage]);

  const saveJob = async () => {
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
    } catch { alert("Failed to save job"); }
  };

  const removeJob = async () => {
    try {
      await API.delete(`/saved-jobs/${jobId}`);
      setSaved(false);
      onRemove && onRemove(jobId);
    } catch { alert("Failed to remove job"); }
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
    <div className="
      bg-white dark:bg-[#14141f]
      border border-gray-100 dark:border-[#1e1e30]
      rounded-2xl p-6
      shadow-sm hover:shadow-lg dark:hover:shadow-card-dark
      hover:-translate-y-0.5
      transition-all duration-300
    ">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 leading-snug">
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
        <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${matchColor}`}>
          {score}% Match
        </span>
      </div>

      {/* Match bar */}
      <div className="mt-4 w-full h-1.5 bg-gray-100 dark:bg-[#1e1e30] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-700 dark:text-slate-400 leading-relaxed line-clamp-3">
        {job.description || "No description available for this job."}
      </p>

      {/* Matched skills */}
      {job.matchedSkills?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 dark:text-slate-500 mb-2">Skills matched</p>
          <div className="flex flex-wrap gap-1.5">
            {job.matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-full
                  bg-green-50 text-green-700 border border-green-100
                  dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100 dark:border-[#1e1e30]">
        <button
          onClick={() => window.open(job.url, "_blank")}
          className="
            px-5 py-2 text-sm font-semibold rounded-lg
            bg-purple-600 hover:bg-purple-700
            dark:bg-electric dark:hover:bg-electric-dark
            text-white transition-all duration-200
            hover:shadow-md dark:hover:shadow-electric
            active:scale-95
          "
        >
          Apply →
        </button>

        {!isSavedPage ? (
          <button
            onClick={saveJob}
            disabled={saved}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200
              ${saved ? "text-purple-600 dark:text-electric cursor-default" : "text-gray-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-electric"}`}
          >
            <Bookmark size={15} className={saved ? "fill-current" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
        ) : (
          <button
            onClick={removeJob}
            className="text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
