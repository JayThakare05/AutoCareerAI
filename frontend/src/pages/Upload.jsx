import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadCard from "./components/UploadCard";
import { Upload, FileText, BadgeCheck, ShieldCheck, Zap } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [uploading, setUploading] = useState({ resume: false, certificates: false });

  /* FETCH USER (IMPORTANT) */
  useEffect(() => {
    API.get("/profile")
      .then(res => setUser(res.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const uploadResume = async () => {
    if (!resume) return alert("Please select a resume");
    setUploading(prev => ({ ...prev, resume: true }));
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      await API.post("/upload/resume", formData);
      alert("Resume uploaded successfully");
    } finally {
      setUploading(prev => ({ ...prev, resume: false }));
    }
  };

  const uploadCertificates = async () => {
    if (certificates.length === 0) return alert("Please select certificates");
    setUploading(prev => ({ ...prev, certificates: true }));
    try {
      const formData = new FormData();
      for (let file of certificates) {
        formData.append("certificates", file);
      }
      await API.post("/upload/certificates", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Certificates uploaded successfully");
    } catch {
      alert("Certificate upload failed");
    } finally {
      setUploading(prev => ({ ...prev, certificates: false }));
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#080810]">
        <div className="w-12 h-12 border-4 border-blue-500 dark:border-electric border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Secure Vault...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#080810] overflow-hidden animate-fade-in transition-colors duration-500">
      <Sidebar navigate={navigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} navigate={navigate} />

        <div className="flex-1 overflow-y-auto px-8 pb-12 pt-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 animate-fade-in stagger">

            {/* HERO BOX */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-[#080810] dark:to-purple-900/30 p-10 rounded-[40px] shadow-2xl shadow-blue-500/10 dark:shadow-electric/10 relative overflow-hidden group animate-slide-up">
              <div className="absolute top-[-20%] right-[-10%] w-[250px] h-[250px] bg-white/10 dark:bg-electric/10 rounded-full blur-[80px] animate-pulse" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 dark:bg-electric/20 rounded-xl backdrop-blur-md">
                      <ShieldCheck size={18} className="text-white dark:text-electric" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 dark:text-electric/80">Secure Identity Transmission</p>
                  </div>
                  <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase italic">Centralized Vault</h1>
                  <p className="text-sm text-white/60 dark:text-slate-400 font-medium max-w-sm lowercase tracking-tight">Upload high-fidelity career documentation to optimize your market visibility and skill-matching cycles.</p>
                </div>
                <div className="hidden md:block">
                  <Zap size={80} className="text-white/10 dark:text-electric/5 -rotate-12 animate-float" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 stagger">
              {/* Resume Upload Box */}
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-3 ml-2">
                  <FileText size={16} className="text-blue-500 dark:text-electric" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Primary Asset</span>
                </div>
                <UploadCard
                  title="Identity Audit (Resume)"
                  desc="Upload high-specification professional resume (PDF format strictly)."
                  accept=".pdf"
                  onFileSelect={(e) => setResume(e.target.files[0])}
                  onUpload={uploadResume}
                  buttonText={uploading.resume ? "Transmitting..." : "Initialize Transmission"}
                  color="blue"
                />
              </div>

              {/* Certificates Upload Box */}
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-3 ml-2">
                  <BadgeCheck size={16} className="text-purple-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Verification Clusters</span>
                </div>
                <UploadCard
                  title="Skill Authenticity Logs"
                  desc="Certificates & skill-verification records (Multiple Images / PDFs)."
                  multiple
                  onFileSelect={(e) => setCertificates(e.target.files)}
                  onUpload={uploadCertificates}
                  buttonText={uploading.certificates ? "Syncing..." : "Commit To Vault"}
                  color="green"
                />
              </div>
            </div>

            {/* QUICK TERMS/SECURITY */}
            <div className="mt-12 flex flex-col md:flex-row items-center gap-8 justify-center opacity-40 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">
                <ShieldCheck size={14} /> AES-256 Encrypted
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">
                <BadgeCheck size={14} /> PII Privacy Protocol
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
