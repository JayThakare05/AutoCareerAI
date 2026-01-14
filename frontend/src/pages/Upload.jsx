import { useState } from "react";
import API from "../api/api";

export default function Upload() {
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("resume", resume);
    await API.post("/upload/resume", formData);
    alert("Resume uploaded");
  };

  const uploadCertificates = async () => {
    const formData = new FormData();
    for (let file of certificates) {
      formData.append("certificates", file);
    }
    await API.post("/upload/certificates", formData);
    alert("Certificates uploaded");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>

        <input type="file" accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])} />
        <button onClick={uploadResume}
          className="block mt-3 bg-blue-600 text-white px-4 py-2 rounded">
          Upload Resume
        </button>

        <hr className="my-6" />

        <input type="file" multiple
          onChange={(e) => setCertificates(e.target.files)} />
        <button onClick={uploadCertificates}
          className="block mt-3 bg-green-600 text-white px-4 py-2 rounded">
          Upload Certificates
        </button>
      </div>
    </div>
  );
}
