import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../Dashboard";
import API from "../../../api/api";

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    API.get("/resume/history").then(res => {
      setHistory(res.data);
      console.log(res.data);
  })
  }, []);

  return (
    <DashboardLayout title="Resume Analysis History">

      {history.map((item, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow mb-4"
        >
          <h4 className="font-semibold">{item.jobRole}</h4>
          <p className="text-sm text-gray-500">
            ATS Score: {item.atsScore}/100
          </p>
          <p className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}

    </DashboardLayout>
  );
}
