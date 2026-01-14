import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const profileCompletion = () => {
    let filled = 0;
    const fields = ["name", "college", "qualification", "address", "resumePath"];
    fields.forEach(f => user[f] && filled++);
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
          <p className="text-sm text-gray-600">
            Profile Completion: {profileCompletion()}%
          </p>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${profileCompletion()}%` }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Resume"
            value={user.resumePath ? "Uploaded" : "Missing"}
            color="blue"
          />
          <StatCard title="Certificates"
            value={user.certificates?.length || 0}
            color="green"
          />
          <StatCard title="Skills"
            value={user.extractedSkills?.length || 0}
            color="purple"
          />
          <StatCard title="Jobs"
            value="Coming Soon"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="Upload Documents"
              desc="Add resume & certificates"
              onClick={() => navigate("/upload")}
            />
            <ActionCard
              title="View Documents"
              desc="Preview & download files"
              onClick={() => navigate("/documents")}
            />
            <ActionCard
              title="My Profile"
              desc="Edit your personal details"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- Components ---- */

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className={`text-${color}-600 font-semibold`}>{title}</p>
    <p className="text-xl font-bold mt-2">{value}</p>
  </div>
);

const ActionCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="border rounded p-4 cursor-pointer hover:bg-gray-100 transition"
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);
