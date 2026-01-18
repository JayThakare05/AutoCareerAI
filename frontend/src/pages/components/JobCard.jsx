import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import API from "../../api/api";

const JobCard = ({ job, isSavedPage = false, onRemove }) => {
  const [saved, setSaved] = useState(false);
  const jobId = job.jobId || job.url; // supports saved jobs + feed

  /* ---------------- CHECK SAVED STATUS ---------------- */
  useEffect(() => {
    if (isSavedPage) {
      setSaved(true);
    }
  }, [isSavedPage]);

  /* ---------------- SAVE JOB ---------------- */
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
        matchedSkills: job.matchedSkills || []
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save job");
    }
  };

  /* ---------------- REMOVE JOB ---------------- */
  const removeJob = async () => {
    try {
      await API.delete(`/saved-jobs/${jobId}`);
      setSaved(false);
      onRemove && onRemove(jobId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove job");
    }
  };

  const matchColor =
    job.matchScore >= 70
      ? "text-green-600 bg-green-100"
      : job.matchScore >= 40
      ? "text-yellow-600 bg-yellow-100"
      : "text-red-600 bg-red-100";

  return (
    <div
      className="bg-white rounded-2xl p-6
                 border border-gray-100
                 shadow-sm hover:shadow-lg
                 transition-all duration-300"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {job.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">
              {job.company}
            </span>{" "}
            • {job.location}
          </p>

          {job.category?.label && (
            <span
              className="inline-block mt-2 px-3 py-1 text-xs
                         font-semibold rounded-full
                         bg-purple-100 text-purple-700"
            >
              {job.category.label}
            </span>
          )}
        </div>

        {/* MATCH BADGE */}
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${matchColor}`}
        >
          {job.matchScore}% Match
        </span>
      </div>

      {/* MATCH BAR */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              job.matchScore >= 70
                ? "bg-green-500"
                : job.matchScore >= 40
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
            style={{ width: `${job.matchScore}%` }}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-sm text-gray-700 leading-relaxed line-clamp-3">
        {job.description || "No description available for this job."}
      </p>

      {/* SKILLS MATCHED */}
      {job.matchedSkills?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Skills matched
          </p>
          <div className="flex flex-wrap gap-2">
            {job.matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full
                           bg-green-50 text-green-700
                           border border-green-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        {/* APPLY */}
        <button
          onClick={() => window.open(job.url, "_blank")}
          className="px-5 py-2 text-sm font-semibold
                     text-white bg-purple-600 rounded-lg
                     hover:bg-purple-700 transition"
        >
          Apply →
        </button>

        {/* SAVE / REMOVE */}
        {!isSavedPage ? (
          <button
            onClick={saveJob}
            disabled={saved}
            className={`flex items-center gap-2 text-sm font-medium transition
              ${
                saved
                  ? "text-purple-600 cursor-default"
                  : "text-gray-500 hover:text-purple-600"
              }`}
          >
            <Bookmark
              size={16}
              className={saved ? "fill-purple-600" : ""}
            />
            {saved ? "Saved" : "Save"}
          </button>
        ) : (
          <button
            onClick={removeJob}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
