import { useEffect, useState } from "react";
import API from "../api/api";

/* ---------- HELPERS ---------- */
const isImage = (path) => /\.(jpg|jpeg|png)$/i.test(path);
const isPDF = (path) => /\.pdf$/i.test(path);

/* ---------- SECURE FILE OPEN ---------- */
const openFile = async (path) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!res.ok) {
      alert("Authorization failed");
      return;
    }

    const blob = await res.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } catch (err) {
    console.error(err);
    alert("Unable to open file");
  }
};

/* ---------- CUSTOM HOOK (MUST BE TOP-LEVEL) ---------- */
const useSecurePreview = (path) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path || !isImage(path)) return;

    let objectUrl;

    const loadImage = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
          {
            headers: { Authorization: token },
          }
        );

        if (!res.ok) return;

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (err) {
        console.error(err);
      }
    };

    loadImage();

    // cleanup
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return url;
};

/* ---------- DOCUMENT CARD ---------- */
const DocCard = ({ title, path }) => {
  const previewUrl = useSecurePreview(path);

  return (
    <div className="border rounded-lg p-3 shadow hover:shadow-lg transition">
      <div className="h-32 flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
        {isImage(path) && previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : isPDF(path) ? (
          <span className="text-6xl">📄</span>
        ) : (
          <span className="text-6xl">📁</span>
        )}
      </div>

      <p className="text-sm font-semibold truncate">{title}</p>

      <button
        onClick={() => openFile(path)}
        className="mt-2 w-full bg-blue-600 text-white text-sm py-1 rounded"
      >
        View / Download
      </button>
    </div>
  );
};

/* ---------- MAIN PAGE ---------- */
export default function Documents() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    API.get("/upload/my-documents").then((res) => setDocs(res.data));
  }, []);

  if (!docs) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Documents</h2>

        {/* Resume */}
        <h3 className="font-semibold mb-2">Resume</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {docs.resumePath ? (
            <DocCard title="Resume" path={docs.resumePath} />
          ) : (
            <p className="text-sm text-gray-500">No resume uploaded</p>
          )}
        </div>

        {/* Certificates */}
        <h3 className="font-semibold mb-2">Certificates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {docs.certificates?.length > 0 ? (
            docs.certificates.map((c, i) => (
              <DocCard
                key={i}
                title={`Certificate ${i + 1}`}
                path={c}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No certificates uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
