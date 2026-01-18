import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "./Dashboard";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/saved-jobs").then(res => setJobs(res.data));
  }, []);

  const removeJob = async (jobId) => {
    
    await API.delete(`/saved-jobs/${encodeURIComponent(jobId)}`);
    setJobs(jobs.filter(j => j.jobId !== jobId));
  };

  return (
    <DashboardLayout title="Saved Jobs 🔖">

      {jobs.length === 0 && (
        <p className="text-gray-500">No saved jobs yet.</p>
      )}

      <div className="space-y-4">
        {jobs.map(job => (
          <div
            key={job.jobId}
            className="bg-white rounded-2xl p-6 shadow"
          >
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">
              {job.company} • {job.location}
            </p>

            <p className="text-sm text-gray-700 mt-3 line-clamp-3">
              {job.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => window.open(job.url, "_blank")}
                className="text-purple-600 font-semibold"
              >
                Apply →
              </button>

              <button
                onClick={() => removeJob(job.jobId)}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}
