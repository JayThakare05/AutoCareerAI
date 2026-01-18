import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "./Dashboard";
import API from "../api/api";
import AnalysisCard from "./components/AnalysisCard";
import SkillPieChart from "./components/charts/SkillPieChart";
import SkillMatrix from "./components/charts/SkillMatrix";
export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const analyzeResume = async () => {
    if (!resume || !jobRole)
      return alert("Please upload resume and enter job role");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobRole", jobRole);
    setLoading(true);
    try {
      const res = await API.post("/ai/resume-analyze", formData);

        const data =
        typeof res.data === "string"
            ? JSON.parse(res.data)
            : res.data;

        setResult(data);

    } catch {
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Resume Analyzer 🧠">

      {/* INPUT CARD */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h3 className="text-lg font-semibold mb-4">
          Analyse Your Resume
        </h3>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:bg-purple-50 file:text-purple-700
                     hover:file:bg-purple-100 mb-4"
        />

        <input
          type="text"
          placeholder="Target Job Role (e.g. Backend Developer)"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={analyzeResume}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg
                      hover:bg-purple-700"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          <button
            onClick={() => navigate("/resume-history")}
            className="text-sm text-purple-600 font-semibold
                      hover:underline"
          >
            View Resume History →
          </button>
</div>


      </div>

      {result && typeof result.atsScore === "number" && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
          <p className="text-sm text-gray-500">ATS Score</p>
          <p
            className={`text-4xl font-bold mt-2 ${
              result.atsScore >= 75
                ? "text-green-600"
                : result.atsScore >= 50
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {result.atsScore}/100
          </p>
        </div>
      )}
{/* RESULT */}
      {result && (
  <div className="space-y-4">
    {result.summary && (
      <AnalysisCard title="Resume Summary" content={result.summary} />
    )}

      {result && (
  <SkillPieChart
    skills={result.skills || []}
    missingSkills={result.missingSkills || []}
  />
  
)}
      {result && (
        <SkillMatrix
          skills={result.skills || []}
          missingSkills={result.missingSkills || []}
        />
        
      )}

      

    {/* {result.skills?.length > 0 && (
      <AnalysisCard title="Detected Skills" list={result.skills} />
    )}

    {result.missingSkills?.length > 0 && (
      <AnalysisCard title="Missing Skills" list={result.missingSkills} />
    )} */}

    {result.suggestions?.length > 0 && (
      <AnalysisCard title="Suggestions" list={result.suggestions} />
    )}
  </div>
)}


    </DashboardLayout>
  );
}
