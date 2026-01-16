const JobCard = ({ job }) => {
  const matchStyle =
    job.matchScore >= 70
      ? "bg-green-100 text-green-700"
      : job.matchScore >= 40
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-600";

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-100
                 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {job.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">
              {job.company}
            </span>
            {" • "}
            {job.location}
          </p>
        </div>

        {/* MATCH BADGE */}
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${matchStyle}`}
        >
          {job.matchScore}% Match
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-sm text-gray-700 leading-relaxed line-clamp-3">
        {job.description || "No description available for this job."}
      </p>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-purple-600
                     font-semibold hover:text-purple-700"
        >
          Apply
          <span className="text-lg">→</span>
        </a>

        <button
          className="text-sm font-medium text-gray-500
                     hover:text-purple-600 transition"
        >
          Save Job
        </button>
      </div>
    </div>
  );
};

export default JobCard;
