import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  FileText, Plus, Trash2, Eye, ShieldCheck,
  Github, Globe, ArrowLeft, Layers, Zap,
  Upload, CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "./components/ConfirmModal";

/* ---------- HELPERS ---------- */
const isImage = (path) => /\.(jpg|jpeg|png)$/i.test(path);
const isPDF = (path) => /\.pdf$/i.test(path);

const openFile = async (path) => {
  if (!path) return;
  const loadingToast = toast.loading("Fetching document from secure vault...");
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/upload/file?filePath=${encodeURIComponent(path)}`,
      { headers: { Authorization: token } }
    );
    if (!res.ok) {
        toast.error("Authorization failed. Session might be expired.", { id: loadingToast });
        return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    toast.success("Document opened", { id: loadingToast });
  } catch {
    toast.error("Unable to retrieve file from storage", { id: loadingToast });
  }
};

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
      } catch { }
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
    <div className="
      group bg-white dark:bg-[#111118] 
      rounded-3xl p-4 border border-gray-100 dark:border-[#1e1e30] 
      shadow-sm hover:shadow-lg dark:hover:shadow-card-dark 
      transition-all duration-300 animate-slide-up
    ">
      <div className="h-40 bg-gray-50 dark:bg-black/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative group/preview">
        {isImage(path) && previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110" />
        ) : isPDF(path) ? (
          <div className="flex flex-col items-center gap-2">
            <FileText size={48} className="text-red-400 opacity-60 group-hover/preview:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase text-gray-400">PDF Document</span>
          </div>
        ) : (
          <Layers size={48} className="text-blue-400 opacity-60" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
          <button onClick={() => openFile(path)} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:scale-110 transition-transform">
            <Eye size={24} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate uppercase tracking-widest">{title}</p>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------- PROJECT CARD ---------- */
const ProjectCard = ({ project, onDelete }) => (
  <div className="
    group bg-white dark:bg-[#111118] 
    rounded-[32px] p-7 border border-gray-100 dark:border-[#1e1e30] 
    shadow-sm hover:shadow-xl dark:hover:shadow-card-dark 
    transition-all duration-300 animate-slide-up hover:-translate-y-1
  ">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">{project.title}</h3>
      <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>

    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-6 line-clamp-2 leading-relaxed h-10">{project.description}</p>

    <div className="flex flex-wrap gap-1.5 mb-6">
      {project.techStack.map((t, i) => (
        <span
          key={i}
          className="text-[9px] font-black uppercase tracking-widest bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 px-3 py-1 rounded-full border border-gray-100 dark:border-white/5"
        >
          {t}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
      <div className="flex gap-5">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-electric hover:opacity-70 transition-opacity">
            <Github size={12} /> Source
          </a>
        )}
        {project.deployedUrl && (
          <a href={project.deployedUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500 hover:opacity-70 transition-opacity">
            <Globe size={12} /> Deployment
          </a>
        )}
      </div>
      <div className="p-1.5 bg-green-500/10 text-green-500 rounded-lg">
        <CheckCircle size={12} />
      </div>
    </div>
  </div>
);

/* ---------- MAIN PAGE ---------- */
export default function Documents() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState(null);
  const [projects, setProjects] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [loading, setLoading] = useState({ resume: false, certs: false, project: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", data: null });

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

  const updateResume = async () => {
    if (!resumeFile) return toast.error("Please select a resume file");
    setLoading(prev => ({ ...prev, resume: true }));
    const loadingToast = toast.loading("Updating primary resume...");
    try {
      const fd = new FormData();
      fd.append("resume", resumeFile);
      await API.post("/upload/resume", fd);
      toast.success("Master resume updated", { id: loadingToast });
      const res = await API.get("/upload/my-documents");
      setDocs(res.data);
      setResumeFile(null);
    } catch {
      toast.error("Resume update failed", { id: loadingToast });
    } finally {
      setLoading(prev => ({ ...prev, resume: false }));
    }
  };

  const addCertificates = async () => {
    if (certFiles.length === 0) return toast.error("Select certificate files for synchronization");
    setLoading(prev => ({ ...prev, certs: true }));
    const loadingToast = toast.loading("Committing certificate data to index...");
    try {
      const fd = new FormData();
      for (let f of certFiles) fd.append("certificates", f);
      await API.post("/upload/certificates", fd);
      const res = await API.get("/upload/my-documents");
      setDocs(res.data);
      setCertFiles([]);
      toast.success("Certificates indexed successfully", { id: loadingToast });
    } catch {
      toast.error("Certificate synchronization failed", { id: loadingToast });
    } finally {
      setLoading(prev => ({ ...prev, certs: false }));
    }
  };

  const deleteCertificate = (index) => {
    setConfirmModal({ isOpen: true, type: "certificate", data: index });
  };

  const handleConfirmCertDelete = async () => {
    const index = confirmModal.data;
    const loadingToast = toast.loading("Purging certificate record...");
    try {
        await API.delete(`/upload/certificates/${index}`);
        setDocs(prev => ({
          ...prev,
          certificates: prev.certificates.filter((_, i) => i !== index)
        }));
        toast.success("Certificate removed successfully", { id: loadingToast });
    } catch {
        toast.error("Certificate removal failed. Index might be locked.", { id: loadingToast });
    }
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.description)
      return toast.error("Title and description are mandatory for project indexing");

    setLoading(prev => ({ ...prev, project: true }));
    const loadingToast = toast.loading("Indexing new engineering project...");
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(",").map(t => t.trim()).filter(Boolean)
      };
      const res = await API.post("/profile/projects", payload);
      setProjects(prev => [...prev, res.data.project]);
      setNewProject({ title: "", description: "", techStack: "", githubUrl: "", deployedUrl: "" });
      toast.success("Project indexed successfully", { id: loadingToast });
    } catch {
      toast.error("Project indexing failed. Check network link.", { id: loadingToast });
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  };

  const deleteProject = (index) => {
    setConfirmModal({ isOpen: true, type: "project", data: index });
  };

  const handleConfirmProjectDelete = async () => {
    const index = confirmModal.data;
    const loadingToast = toast.loading("Purging project record...");
    await API.delete(`/profile/projects/${index}`);
    setProjects(prev => prev.filter((_, i) => i !== index));
    toast.success("Project eliminated", { id: loadingToast });
  };

  if (!docs) return (
    <div className="h-screen bg-gray-50 dark:bg-[#080810] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 dark:border-electric border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Professional Index...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-12 bg-gray-50 dark:bg-[#080810] min-h-screen transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-16 animate-fade-in stagger">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-white/5 animate-slide-up">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-electric/20 dark:to-blue-900/40 rounded-3xl text-white dark:text-electric shadow-xl shadow-blue-500/10 dark:shadow-electric/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-electric transition-colors mb-2"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <h1 className="text-3xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase leading-none">Your Work</h1>
            </div>
          </div>
          <div className="px-6 py-3 bg-white dark:bg-[#111118] border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-gray-900 dark:text-slate-100 leading-none">{projects.length}</span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Projects</span>
            </div>
            <div className="h-8 w-px bg-gray-100 dark:bg-white/5" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-gray-900 dark:text-slate-100 leading-none">{docs.certificates?.length || 0}</span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Certs</span>
            </div>
          </div>
        </div>

        {/* RESUME SECTION */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-500 dark:text-electric" size={20} />
              <h3 className="text-xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">Resume</h3>
            </div>
            <div className="h-px flex-1 mx-8 bg-gray-100 dark:bg-white/5 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4">
              {docs.resume ? (
                <DocCard title="Primary Master Resume" path={docs.resume} />
              ) : (
                <div className="p-8 border border-dashed border-gray-200 dark:border-[#1e1e30] rounded-3xl text-center text-gray-400 dark:text-slate-600">
                  No high-fidelity resume detected in vault.
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#111118] p-8 rounded-[32px] border border-gray-100 dark:border-[#1e1e30] shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 italic">// Update Resume</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setResumeFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="px-5 py-3.5 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 text-xs font-bold text-gray-500 dark:text-slate-400 truncate">
                    {resumeFile ? resumeFile.name : "Select PDF..."}
                  </div>
                </div>
                <button
                  onClick={updateResume}
                  disabled={loading.resume || !resumeFile}
                  className="px-8 py-3.5 bg-blue-600 dark:bg-electric text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading.resume ? <Zap className="animate-spin" size={14} /> : <Upload size={14} />}
                  Update Resume
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Layers className="text-blue-400" size={20} />
              <h3 className="text-xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">Verified Certificates</h3>
            </div>
            <div className="h-px flex-1 mx-8 bg-gray-100 dark:bg-white/5 hidden md:block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 stagger">
            {docs.certificates?.length ? (
              docs.certificates.map((c, i) => (
                <DocCard
                  key={i}
                  title={`Certificate-0${i + 1}`}
                  path={c}
                  onDelete={() => deleteCertificate(i)}
                />
              ))
            ) : (
              <div className="col-span-full py-12 border border-dashed border-gray-200 dark:border-[#1e1e30] rounded-[40px] text-center text-gray-400 italic text-sm">
                No skill verification records found.
              </div>
            )}
          </div>

          <div className="max-w-xl mx-auto bg-white dark:bg-[#111118] p-8 rounded-[40px] border border-gray-100 dark:border-[#1e1e30] shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl mb-4">
                <Plus size={24} />
              </div>
              <h4 className="text-base font-black italic text-gray-900 dark:text-slate-100 tracking-tight uppercase">Add New Certificates</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Save structured skill data to the secure encrypted index.</p>
            </div>

            <div className="flex flex-col gap-4 bg-white dark:bg-[#111118]">
              <input
                type="file"
                multiple
                onChange={e => setCertFiles(e.target.files)}
                className="w-full text-xs text-white font-black uppercase bg-gray-50 dark:bg-black/20 p-4 rounded-3xl file:hidden cursor-pointer border border-dashed border-gray-200 dark:border-white/5"
              />
              {certFiles.length > 0 && <p className="text-[10px] font-bold text-center text-electric animate-pulse">{certFiles.length} records staged for commit</p>}
              <button
                onClick={addCertificates}
                disabled={loading.certs || certFiles.length === 0}
                className="w-full py-4 bg-green-600 dark:bg-green-500 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl shadow-green-500/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading.certs ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Zap className="text-yellow-500 animate-pulse" size={20} />
              <h3 className="text-xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">Your Projects</h3>
            </div>
            <div className="h-px flex-1 mx-8 bg-gray-100 dark:bg-white/5 hidden md:block" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 stagger">
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} onDelete={() => deleteProject(i)} />
            ))}
          </div>

          {/* ADD PROJECT FORM */}
          <div className="bg-white dark:bg-[#111118] rounded-[48px] p-10 border border-gray-100 dark:border-[#1e1e30] shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1 space-y-6">
                <div className="p-5 bg-blue-600 dark:bg-electric text-white rounded-[32px] inline-block shadow-xl shadow-blue-500/20">
                  <Plus size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black italic text-gray-900 dark:text-slate-100 tracking-tighter uppercase italic leading-none">Add New<br />Project</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 italic max-w-[180px] leading-relaxed">
                    Log hyper-relevant technical engineering projects to your professional record index.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="w-full bg-gray-50 dark:bg-black/20 border-none outline-none p-4 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 dark:focus:ring-electric transition-all"
                    placeholder="Project Name"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })} />

                  <input className="w-full bg-gray-50 dark:bg-black/20 border-none outline-none p-4 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 dark:focus:ring-electric transition-all"
                    placeholder="Tech Stack (comma separated)"
                    value={newProject.techStack}
                    onChange={e => setNewProject({ ...newProject, techStack: e.target.value })} />
                </div>

                <textarea className="w-full bg-gray-50 dark:bg-black/20 border-none outline-none p-4 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 dark:focus:ring-electric transition-all h-24"
                  placeholder="Description"
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Github size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full bg-gray-50 dark:bg-black/20 border-none outline-none p-4 pl-10 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 dark:focus:ring-electric transition-all"
                      placeholder="Repository source link"
                      value={newProject.githubUrl}
                      onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Globe size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full bg-gray-50 dark:bg-black/20 border-none outline-none p-4 pl-10 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 dark:focus:ring-electric transition-all"
                      placeholder="Deployed link"
                      value={newProject.deployedUrl}
                      onChange={e => setNewProject({ ...newProject, deployedUrl: e.target.value })} />
                  </div>
                </div>

                <button
                  onClick={addProject}
                  disabled={loading.project}
                  className="w-full mt-4 py-4 bg-blue-600 dark:bg-electric text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl shadow-blue-500/10 dark:shadow-electric/30 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading.project ? "  Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: "", data: null })}
        onConfirm={confirmModal.type === "certificate" ? handleConfirmCertDelete : handleConfirmProjectDelete}
        title={confirmModal.type === "certificate" ? "Delete Certificate?" : "Delete Project?"}
        message={confirmModal.type === "certificate" 
          ? "This will remove the certificate from your professional index and update your skill extraction metrics."
          : "Are you sure you want to remove this project from your profile? This cannot be undone."}
        confirmText="Confirm Delete"
      />
    </div>
  );
}
