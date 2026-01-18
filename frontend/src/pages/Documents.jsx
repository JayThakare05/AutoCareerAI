import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

/* ---------- HELPERS ---------- */
const isImage = (path) => /\.(jpg|jpeg|png)$/i.test(path);
const isPDF = (path) => /\.pdf$/i.test(path);

/* ---------- SECURE FILE OPEN ---------- */
const openFile = async (path) => {
  if (!path) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
      { headers: { Authorization: token } }
    );

    if (!res.ok) return alert("Authorization failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch {
    alert("Unable to open file");
  }
};

/* ---------- SECURE IMAGE PREVIEW ---------- */
const useSecurePreview = (path) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path || !isImage(path)) return;
    let objectUrl;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
          { headers: { Authorization: token } }
        );
        if (!res.ok) return;
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch {}
    };

    load();
    return () => objectUrl && URL.revokeObjectURL(objectUrl);
  }, [path]);

  return url;
};

/* ---------- DOCUMENT CARD ---------- */
const DocCard = ({ title, path, onDelete }) => {
  const previewUrl = useSecurePreview(path);

  return (
    <div className="border rounded-xl p-3 shadow hover:shadow-lg transition">
      <div className="h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
        {isImage(path) && previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover" />
        ) : isPDF(path) ? (
          <span className="text-6xl">📄</span>
        ) : (
          <span className="text-6xl">📁</span>
        )}
      </div>

      <p className="text-sm font-semibold truncate">{title}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => openFile(path)}
          className="flex-1 bg-blue-600 text-white text-sm py-1 rounded"
        >
          View
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 text-white text-sm py-1 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- PROJECT CARD ---------- */
const ProjectCard = ({ project, onDelete }) => (
  <div className="border rounded-xl p-4 shadow-sm hover:shadow transition">
    <h3 className="font-semibold text-lg">{project.title}</h3>
    <p className="text-sm text-gray-600 mt-1">{project.description}</p>

    <div className="flex flex-wrap gap-2 mt-2">
      {project.techStack.map((t, i) => (
        <span
          key={i}
          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
        >
          {t}
        </span>
      ))}
    </div>

    <div className="flex gap-4 mt-3 text-sm">
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600">
          GitHub
        </a>
      )}
      {project.deployedUrl && (
        <a href={project.deployedUrl} target="_blank" rel="noreferrer" className="text-green-600">
          Live
        </a>
      )}
    </div>

    <button onClick={onDelete} className="mt-3 text-sm text-red-600">
      Delete Project
    </button>
  </div>
);

/* ---------- MAIN PAGE ---------- */
export default function Documents() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState(null);
  const [projects, setProjects] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    deployedUrl: ""
  });

  useEffect(() => {
    API.get("/upload/my-documents").then(res => setDocs(res.data));
    API.get("/profile/projects").then(res => setProjects(res.data));
  }, []);

  /* ---------- RESUME UPDATE ---------- */
  const updateResume = async () => {
  if (!resumeFile) {
    alert("Select a resume");
    return;
  }

  try {
    const fd = new FormData();
    fd.append("resume", resumeFile);

    await API.post("/upload/resume", fd);

    // ✅ Success alert
    alert("Resume uploaded successfully");

    // refresh documents
    const res = await API.get("/upload/my-documents");
    setDocs(res.data);

    setResumeFile(null);
  } catch (err) {
    console.error(err);
    alert("Failed to upload resume. Please try again.");
  }
};


  /* ---------- ADD CERTIFICATES ---------- */
  const addCertificates = async () => {
    if (certFiles.length === 0) return alert("Select certificates");
    const fd = new FormData();
    for (let f of certFiles) fd.append("certificates", f);
    await API.post("/upload/certificates", fd);
    const res = await API.get("/upload/my-documents");
    setDocs(res.data);
    setCertFiles([]);
  };

  /* ---------- DELETE CERTIFICATE ---------- */
  const deleteCertificate = async (index) => {
    await API.delete(`/upload/certificates/${index}`);
    setDocs(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  /* ---------- PROJECT CRUD ---------- */
  const addProject = async () => {
    if (!newProject.title || !newProject.description)
      return alert("Title & description required");

    const payload = {
      ...newProject,
      techStack: newProject.techStack.split(",").map(t => t.trim()).filter(Boolean)
    };

    const res = await API.post("/profile/projects", payload);
    setProjects(prev => [...prev, res.data.project]);
    setNewProject({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      deployedUrl: ""
    });
  };

  const deleteProject = async (index) => {
    await API.delete(`/profile/projects/${index}`);
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  if (!docs) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-purple-600 font-medium"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold">My Professional Assets</h2>

        {/* RESUME */}
        <section>
          <h3 className="font-semibold mb-3">Resume</h3>

          {docs.resume ? (
            <DocCard title="Resume" path={docs.resume} />
          ) : (
            <p className="text-sm text-gray-500">No resume uploaded</p>
          )}

          <div className="mt-3 flex gap-3">
            <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} />
            <button
              onClick={updateResume}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Update Resume
            </button>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section>
          <h3 className="font-semibold mb-3">Certificates</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {docs.certificates?.length ? (
              docs.certificates.map((c, i) => (
                <DocCard
                  key={i}
                  title={`Certificate ${i + 1}`}
                  path={c}
                  onDelete={() => deleteCertificate(i)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No certificates uploaded</p>
            )}
          </div>

          <div className="flex gap-3">
            <input type="file" multiple onChange={e => setCertFiles(e.target.files)} />
            <button
              onClick={addCertificates}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Add Certificates
            </button>
          </div>
        </section>

        {/* PROJECTS */}
        <section>
          <h3 className="font-semibold mb-4">Projects</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} onDelete={() => deleteProject(i)} />
            ))}
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h4 className="font-semibold mb-4">Add Project</h4>

            <input className="w-full border p-2 mb-2"
              placeholder="Project Title"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })} />

            <textarea className="w-full border p-2 mb-2"
              placeholder="Description"
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })} />

            <input className="w-full border p-2 mb-2"
              placeholder="Tech Stack (comma separated)"
              value={newProject.techStack}
              onChange={e => setNewProject({ ...newProject, techStack: e.target.value })} />

            <input className="w-full border p-2 mb-2"
              placeholder="GitHub URL"
              value={newProject.githubUrl}
              onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })} />

            <input className="w-full border p-2 mb-4"
              placeholder="Deployed URL (optional)"
              value={newProject.deployedUrl}
              onChange={e => setNewProject({ ...newProject, deployedUrl: e.target.value })} />

            <button
              onClick={addProject}
              className="bg-purple-600 text-white px-5 py-2 rounded"
            >
              Add Project
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
