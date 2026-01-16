import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadCard from "./components/UploadCard";

export default function Upload() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);

  /* FETCH USER (IMPORTANT) */
  useEffect(() => {
    API.get("/profile")
      .then(res => setUser(res.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const uploadResume = async () => {
    if (!resume) return alert("Please select a resume");
    const formData = new FormData();
    formData.append("resume", resume);
    await API.post("/upload/resume", formData);
    alert("Resume uploaded successfully");
  };

  const uploadCertificates = async () => {
  if (certificates.length === 0)
    return alert("Please select certificates");

  try {
    const formData = new FormData();

    for (let file of certificates) {
      formData.append("certificates", file);
    }

    // ✅ Correct debug
    console.log([...formData.entries()]);

    await API.post("/upload/certificates", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Certificates uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("Certificate upload failed");
  }
};


  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar navigate={navigate} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR (NOW RECEIVES USER) */}
        <div className="sticky top-0 z-20 bg-white border-b">
          <Topbar user={user} navigate={navigate} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto w-full space-y-6">

            <h2 className="text-2xl font-bold text-gray-900">
              Upload Your Documents 📄
            </h2>
            <p className="text-sm text-gray-500">
              Upload resume & certificates to get better job recommendations
            </p>

            {/* Resume Upload */}
            <UploadCard
              title="Upload Resume"
              desc="Upload your latest resume (PDF)"
              accept=".pdf"
              onFileSelect={(e) => setResume(e.target.files[0])}
              onUpload={uploadResume}
              buttonText="Upload Resume"
              color="blue"
            />

            {/* Certificates Upload */}
            <UploadCard
              title="Upload Certificates"
              desc="Upload skill certificates (Images / PDFs)"
              multiple
              onFileSelect={(e) => setCertificates(e.target.files)}
              onUpload={uploadCertificates}
              buttonText="Upload Certificates"
              color="green"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
