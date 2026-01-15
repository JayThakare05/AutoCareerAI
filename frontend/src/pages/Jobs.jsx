import { useEffect, useState } from "react";
import API from "../api/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs/recommended").then(res => setJobs(res.data.jobs));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Recommended Jobs</h2>

        {jobs.length === 0 && (
          <p className="text-gray-500">No jobs found yet.</p>
        )}

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white p-5 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="text-green-600 font-bold">
                  {job.matchScore}% Match
                </span>
              </div>

              <p className="text-sm mt-3 line-clamp-3">
                {job.description}
              </p>

              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-blue-600 font-semibold"
              >
                Apply →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
