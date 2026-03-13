import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { User, MapPin, GraduationCap, Briefcase, Database, ArrowLeft, Camera, ShieldCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- HELPERS ---------------- */
const isImage = (path) => /\.(jpg|jpeg|png)$/i.test(path);

const openFile = async (path) => {
  if (!path) return;
  const loadingToast = toast.loading("Decrypting profile asset...");
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
      { headers: { Authorization: token } }
    );
    if (!res.ok) {
        toast.error("Decryption failed. Unauthorized access.", { id: loadingToast });
        return;
    }
    const blob = await res.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
    toast.success("Identity asset decrypted", { id: loadingToast });
  } catch {
    toast.error("Vault access error", { id: loadingToast });
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

/* ---------------- MAIN ---------------- */

const sections = [
  { id: "Personal", icon: User },
  { id: "Address", icon: MapPin },
  { id: "Qualifications", icon: GraduationCap },
  { id: "Work & Preferences", icon: Briefcase },
  { id: "Metadata", icon: Database }
];

export default function Profile() {
  const [user, setUser] = useState({});
  const [active, setActive] = useState("Personal");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
  }, []);

  const profilePhotoPath = user?.documents?.profilePhoto;
  const securePhoto = useSecurePreview(profilePhotoPath);

  const uploadPhoto = async () => {
    if (!photo) return toast.error("Select an image for upload");
    const loadingToast = toast.loading("Updating biometric visualization...");
    try {
        const fd = new FormData();
        fd.append("photo", photo);
        await API.post("/profile/photo", fd);
        toast.success("Visualization updated", { id: loadingToast });
        setTimeout(() => window.location.reload(), 1000);
    } catch {
        toast.error("Upload failed", { id: loadingToast });
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Committing changes to professional record...");
    try {
      await API.put("/profile", user);
      toast.success("Profile record synchronized", { id: loadingToast });
    } catch {
      toast.error("Failed to commit profile changes", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080810] transition-colors duration-500 p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* SIDE NAV */}
        <div className="w-full lg:w-72 shrink-0 animate-slide-in">
          <div className="bg-white dark:bg-[#111118] rounded-[32px] p-8 border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark sticky top-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-600 dark:hover:text-electric transition-colors"
            >
              <ArrowLeft size={12} /> Back
            </button>

            <h3 className="text-2xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase mb-8">Profile</h3>

            <div className="space-y-1.5 stagger">
              {sections.map(s => (
                <div
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`
                       px-5 py-3.5 rounded-2xl cursor-pointer font-bold text-sm flex items-center gap-3 transition-all duration-200 animate-slide-in
                       ${active === s.id
                      ? "bg-purple-600 dark:bg-electric text-white shadow-lg shadow-purple-500/20 dark:shadow-electric/30 scale-105"
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-slate-200"
                    }
                     `}
                >
                  <s.icon size={16} />
                  <span className="truncate">{s.id}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-[#080810] rounded-2xl border border-dashed border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                <ShieldCheck size={12} className="text-green-500" /> Secure Data
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                Records are encrypted with AES-256 protocols and stored in high-availability clusters.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-[#111118] rounded-[40px] border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark overflow-hidden relative">

            {/* ACCENT DECOR */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
              <User size={300} className="text-purple-600 dark:text-electric rotate-12" />
            </div>

            <div className="p-8 md:p-12 relative z-10">

              {/* PERSONAL HEADER */}
              {active === "Personal" && (
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12 animate-fade-in">
                  <div className="relative group shrink-0">
                    <div
                      onClick={() => openFile(profilePhotoPath)}
                      className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-white dark:border-[#1e1e30] shadow-xl hover:scale-105 transition-transform duration-500"
                    >
                      {securePhoto ? (
                        <img src={securePhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-electric/20 dark:to-purple-900/40 flex items-center justify-center text-white dark:text-electric text-5xl font-black italic italic">
                          {user.firstName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-1 right-1 p-2 bg-purple-600 dark:bg-electric text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                      <Camera size={14} />
                      <input type="file" className="hidden" onChange={e => {
                        setPhoto(e.target.files[0]);
                        uploadPhoto();
                      }} />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                        <ShieldCheck size={10} /> Active Identity
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UID: {user._id?.slice(-8)}</span>
                    </div>
                    <h2 className="text-4xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">{user.firstName} {user.surname}</h2>
                    <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
              )}

              <div key={active} className="animate-fade-in stagger">
                {active === "Personal" && (
                  <div className="space-y-10">
                    <Title text="Identity Profile" icon={User} />
                    <Grid>
                      <Input label="First Name" value={user.firstName} onChange={v => setUser({ ...user, firstName: v })} />
                      <Input label="Surname" value={user.surname} onChange={v => setUser({ ...user, surname: v })} />
                    </Grid>
                    <Grid>
                      <Input type="date" label="Date of Birth" value={user.dob?.slice(0, 10)} onChange={v => setUser({ ...user, dob: v })} />
                      <Input label="Phone Number" value={user.phone} onChange={v => setUser({ ...user, phone: v })} />
                    </Grid>
                    <Input label="Email Address" value={user.email} disabled />
                  </div>
                )}

                {active === "Address" && (
                  <div className="space-y-10">
                    <Title text="Address Details" icon={MapPin} />
                    <Input label="Address" value={user.address} onChange={v => setUser({ ...user, address: v })} />
                    <Grid>
                      <Input label="State" value={user.state} onChange={v => setUser({ ...user, state: v })} />
                      <Input label="Country" value={user.country} onChange={v => setUser({ ...user, country: v })} />
                    </Grid>
                    <Input label="Pincode" value={user.pincode} onChange={v => setUser({ ...user, pincode: v })} />
                  </div>
                )}

                {active === "Qualifications" && (
                  <div className="space-y-10">
                    <Title text="Education Details" icon={GraduationCap} />
                    <Select
                      label="Current Highest Qualification"
                      value={user.highestQualification}
                      options={["10th", "12th", "Under Graduate", "Post Graduate"]}
                      onChange={v => setUser({ ...user, highestQualification: v })}
                    />

                    <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {user.highestQualification && (
                        <Section title="Standard 10th">
                          <Grid>
                            <Input label="Board" value={user.qualifications?.tenth?.board || ""} onChange={v => updateNested(user, setUser, ["qualifications", "tenth", "board"], v)} />
                            <Input label="Year" value={user.qualifications?.tenth?.year || ""} onChange={v => updateNested(user, setUser, ["qualifications", "tenth", "year"], v)} />
                            <Input label="Score" value={user.qualifications?.tenth?.score || ""} onChange={v => updateNested(user, setUser, ["qualifications", "tenth", "score"], v)} />
                          </Grid>
                        </Section>
                      )}

                      {["12th", "Under Graduate", "Post Graduate"].includes(user.highestQualification) && (
                        <Section title="Standard 12th ">
                          <Grid>
                            <Input label="Domain Stream" value={user.qualifications?.twelfth?.stream || ""} onChange={v => updateNested(user, setUser, ["qualifications", "twelfth", "stream"], v)} />
                            <Input label="Board" value={user.qualifications?.twelfth?.board || ""} onChange={v => updateNested(user, setUser, ["qualifications", "twelfth", "board"], v)} />
                            <Input label="Score" value={user.qualifications?.twelfth?.score || ""} onChange={v => updateNested(user, setUser, ["qualifications", "twelfth", "score"], v)} />
                          </Grid>
                        </Section>
                      )}

                      {["Under Graduate", "Post Graduate"].includes(user.highestQualification) && (
                        <Section title="Under Graduate">
                          <Grid>
                            <Input label="College" value={user.qualifications?.ug?.college || ""} onChange={v => updateNested(user, setUser, ["qualifications", "ug", "college"], v)} />
                            <Input label="Course" value={user.qualifications?.ug?.degree || ""} onChange={v => updateNested(user, setUser, ["qualifications", "ug", "degree"], v)} />
                            <Input label="Percentile" value={user.qualifications?.ug?.score || ""} onChange={v => updateNested(user, setUser, ["qualifications", "ug", "score"], v)} />
                          </Grid>
                        </Section>
                      )}

                      {user.highestQualification === "Post Graduate" && (
                        <Section title="Post Graduate">
                          <Grid>
                            <Input label="College" value={user.qualifications?.pg?.college || ""} onChange={v => updateNested(user, setUser, ["qualifications", "pg", "college"], v)} />
                            <Input label="Masters Course" value={user.qualifications?.pg?.degree || ""} onChange={v => updateNested(user, setUser, ["qualifications", "pg", "degree"], v)} />
                            <Input label="Percentile" value={user.qualifications?.pg?.score || ""} onChange={v => updateNested(user, setUser, ["qualifications", "pg", "score"], v)} />
                          </Grid>
                        </Section>
                      )}
                    </div>
                  </div>
                )}

                {active === "Work & Preferences" && (
                  <div className="space-y-10">
                    <Title text="Experience" icon={Briefcase} />
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <Select
                          label="Experience"
                          value={user.experience}
                          options={["No", "Yes"]}
                          onChange={v => setUser({ ...user, experience: v })}
                        />
                      </div>
                      {user.experience === "Yes" && (
                        <div className="md:col-span-2">
                          <Grid>
                            <Input label="Company" value={user.company || ""} onChange={v => setUser({ ...user, company: v })} />
                            <Input label="Duration (Years)" value={user.experienceYears || ""} onChange={v => setUser({ ...user, experienceYears: v })} />
                          </Grid>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <Input label="Verified Skill Stack (Comma separated)" value={user.skills?.join(", ")} onChange={v => setUser({ ...user, skills: v.split(",").map(s => s.trim()) })} />
                      <Input label="Target Job Roles (Comma separated)" value={user.interestedJobs?.join(", ")} onChange={v => setUser({ ...user, interestedJobs: v.split(",").map(j => j.trim()) })} />
                    </div>
                  </div>
                )}

                {active === "Metadata" && (
                  <div className="space-y-10">
                    <Title text="System Logs" icon={Database} />
                    <div className="p-8 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl space-y-8">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Universal UID</label>
                        <code className="text-sm font-bold text-gray-600 dark:text-slate-300 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5">
                          {user._id}
                        </code>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">AI-Extracted Verification Clusters</label>
                        <div className="flex flex-wrap gap-2">
                          {user.extractedSkills?.length > 0 ? (
                            user.extractedSkills.map((s, i) => (
                              <span key={i} className="px-3 py-1.5 bg-purple-500/10 dark:bg-electric/10 border border-purple-500/20 dark:border-electric/20 text-[10px] font-black text-purple-600 dark:text-electric uppercase tracking-widest rounded-xl">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs italic text-gray-400 lowercase">No high-confidence extractions detected. Update documentation cycles.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BAR */}
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-[#1e1e30] flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-10 py-4 bg-purple-600 dark:bg-electric text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/20 dark:shadow-electric/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Update Profile <Zap size={14} className="group-hover:translate-x-1 group-hover:scale-110 transition-transform" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const updateNested = (obj, set, path, value) => {
  const updated = structuredClone(obj);
  let curr = updated;
  path.slice(0, -1).forEach(k => curr = curr[k] ||= {});
  curr[path.at(-1)] = value;
  set(updated);
};

const Title = ({ text, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2.5 bg-purple-100 dark:bg-electric/10 rounded-2xl text-purple-600 dark:text-electric">
      <Icon size={20} />
    </div>
    <h2 className="text-2xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">{text}</h2>
  </div>
);

const Grid = ({ children }) => <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">{children}</div>;

const Section = ({ title, children }) => (
  <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[32px] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all">
    <h3 className="text-xs font-black text-purple-600 dark:text-electric uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-3 italic">{title}</h3>
    {children}
  </div>
);

const Input = ({ label, value, onChange, disabled, type = "text" }) => (
  <div className="mb-6 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block lowercase italic">// {label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className={`
        w-full px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all duration-300
        ${disabled
          ? "bg-gray-100/50 dark:bg-black/20 border-transparent text-gray-400 dark:text-slate-600 cursor-not-allowed"
          : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-electric hover:border-gray-200 dark:hover:border-white/10"
        }
      `}
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div className="mb-6 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block lowercase italic">// {label}</label>
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-[#111118] border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-electric transition-all"
    >
      <option value="" className="bg-white dark:bg-[#111118]">Unset Configuration</option>
      {options.map(o => <option key={o} value={o} className="bg-white dark:bg-[#111118]">{o}</option>)}
    </select>
  </div>
);
