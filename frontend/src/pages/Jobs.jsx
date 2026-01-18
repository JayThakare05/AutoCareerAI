import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "./Dashboard";
import JobCard from "./components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));

    API.get("/jobs/recommended", {
      params: {
        data: "extractedSkills",
        source: "certificates",
      },
    })
      .then(res => setJobs(res.data.jobs || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Jobs as per Certificates 🎯">

      {/* Extracted Skills */}
      {user?.extractedSkills && (
        <div className="mb-4">
          <h1 className="text-sm font-medium text-gray-500">
            Extracted skills
          </h1>
          <p className="text-gray-800 font-medium mt-1">
            {user.extractedSkills.join(", ")}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="mt-10 text-center text-gray-500">
          Fetching jobs for you...
        </p>
      )}

      {/* Empty */}
      {!loading && jobs.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          Upload certificates to get job recommendations.
        </p>
      )}

      {/* ✅ SAME WRAPPER AS DASHBOARD */}
      {!loading && jobs.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6 mt-6">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}
