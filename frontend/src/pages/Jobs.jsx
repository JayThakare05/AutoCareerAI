import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "./Dashboard";
import JobCard from "./components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch user again
    API.get("/profile").then(res => setUser(res.data));

    // fetch jobs
    API.get("/jobs/recommended", {
      params: {
        data: "extractedSkills",
        source: "certificates"
      }
    })
      .then(res => setJobs(res.data.jobs || []))
      .finally(() => setLoading(false));

  }, []);

  return (
    
    <DashboardLayout title="Jobs as per Certificates 🎯">

      {/* ✅ PRINT EXTRACTED SKILLS */}
      {user?.extractedSkills && (
        <h1 className="text-xl font-semibold mb-4">
          Extracted Skills :-{" "}
          <span className="text-purple-600">
            {user.extractedSkills.join(", ")}
          </span>
        </h1>
      )}
      {loading && (
        <p className="text-gray-500">Fetching jobs for you...</p>
      )}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500">
          Upload certificates to get job recommendations.
        </p>
      )}

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

    </DashboardLayout>
  );
}
