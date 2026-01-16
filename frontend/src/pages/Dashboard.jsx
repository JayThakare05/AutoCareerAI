import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import Sidebar from "./components/Sidebar"; 
import Topbar from "./components/Topbar"; 
import JobCard from "./components/JobCard"; 
import API from "../api/api";
export default function Dashboard({ children, title }) {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
    API.get("/jobs/recommended", {
      params: {
        data: "skills",
        source: "dashboard"
      }
    }).then(res => setJobs(res.data.jobs || []));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar navigate={navigate} />

      <div className="flex-1 flex flex-col">

        <div className="sticky top-0 z-20 bg-white border-b">
          <Topbar user={user} navigate={navigate} />
        </div>

        {/* HEADER (NO SCROLL) */}
        <div className="px-8 pt-6 pb-4 bg-gray-50 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {title || "Jobs recommended for you 🚀"}
          </h2>
        </div>

        {/* ✅ ONLY SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">

          {/* ✅ CHILD CONTENT (Extracted skills page etc.) */}
          {children}

          {/* ✅ DEFAULT DASHBOARD JOBS */}
          {!children && (
            jobs.length === 0 ? (
              <div className="mt-12 text-center text-gray-500">
                No jobs found yet. Complete your profile.
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-5 mt-4">
                {jobs.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
