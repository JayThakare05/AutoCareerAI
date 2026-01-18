import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

/* ---------------- HELPERS ---------------- */
const isImage = (path) => /\.(jpg|jpeg|png)$/i.test(path);

/* ---------- SECURE FILE OPEN ---------- */
const openFile = async (path) => {
  if (!path) return;
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/upload/file?filePath=${encodeURIComponent(path)}`,
      {
        headers: { Authorization: token },
      }
    );

    if (!res.ok) {
      alert("Authorization failed");
      return;
    }

    const blob = await res.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } catch {
    alert("Unable to open file");
  }
};

/* ---------- SECURE IMAGE PREVIEW HOOK ---------- */
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

/* ---------------- MAIN ---------------- */

const sections = [
  "Personal",
  "Address",
  "Qualifications",
  "Work & Preferences",
  "Metadata"
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
    if (!photo) return alert("Select a photo");
    const fd = new FormData();
    fd.append("photo", photo);
    await API.post("/profile/photo", fd);
    alert("Profile photo updated");
    window.location.reload();
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      await API.put("/profile", user);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow flex">

        {/* SIDEBAR */}
        <div className="w-64 border-r p-6 space-y-2">
          <h3 className="font-semibold text-lg mb-4">Profile</h3>
          {sections.map(s => (
            <div
              key={s}
              onClick={() => setActive(s)}
              className={`px-4 py-2 rounded-lg cursor-pointer font-medium
                ${active === s
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-900 mb-8"
          >
            ← Back
          </button>

          {/* PERSONAL */}
          {active === "Personal" && (
            <>
              {/* PROFILE HEADER */}
              <div className="flex items-center gap-6 mb-10">
                <div
                  onClick={() => openFile(profilePhotoPath)}
                  className="w-28 h-28 rounded-full overflow-hidden
                             cursor-pointer border shadow"
                >
                  {securePhoto ? (
                    <img
                      src={securePhoto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-500
                      flex items-center justify-center
                      text-white text-4xl font-bold">
                      {user.firstName?.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">
                    {user.firstName} {user.surname}
                  </h2>

                  <div className="mt-2 flex items-center gap-2">
                    <input type="file" onChange={e => setPhoto(e.target.files[0])} />
                    <button
                      onClick={uploadPhoto}
                      className="px-4 py-1 bg-purple-600 text-white rounded"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>

              <Title text="Personal Information" />
              <Grid>
                <Input label="First Name" value={user.firstName}
                  onChange={v => setUser({ ...user, firstName: v })} />
                <Input label="Surname" value={user.surname}
                  onChange={v => setUser({ ...user, surname: v })} />
              </Grid>
              <Grid>
                <Input type="date" label="DOB"
                  value={user.dob?.slice(0,10)}
                  onChange={v => setUser({ ...user, dob: v })} />
                <Input label="Phone"
                  value={user.phone}
                  onChange={v => setUser({ ...user, phone: v })} />
              </Grid>
              <Input label="Email" value={user.email} disabled />
            </>
          )}

          {/* ADDRESS */}
          {active === "Address" && (
            <>
              <Title text="Address" />
              <Input label="Address" value={user.address}
                onChange={v => setUser({ ...user, address: v })} />
              <Grid>
                <Input label="State" value={user.state}
                  onChange={v => setUser({ ...user, state: v })} />
                <Input label="Country" value={user.country}
                  onChange={v => setUser({ ...user, country: v })} />
              </Grid>
              <Input label="Pincode" value={user.pincode}
                onChange={v => setUser({ ...user, pincode: v })} />
            </>
          )}

          {active === "Qualifications" && (
                <>
                  <Title text="Qualifications" />

                  <Select
                    label="Highest Qualification"
                    value={user.highestQualification}
                    options={["10th", "12th", "Under Graduate", "Post Graduate"]}
                    onChange={v => setUser({ ...user, highestQualification: v })}
                  />

                  {/* 10th */}
                  {user.highestQualification && (
                    <Section title="10th">
                      <Grid>
                        <Input label="Board"
                          value={user.qualifications?.tenth?.board || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","tenth","board"], v)} />
                        <Input label="Year"
                          value={user.qualifications?.tenth?.year || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","tenth","year"], v)} />
                        <Input label="Score"
                          value={user.qualifications?.tenth?.score || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","tenth","score"], v)} />
                      </Grid>
                    </Section>
                  )}

                  {/* 12th */}
                  {["12th","Under Graduate","Post Graduate"].includes(user.highestQualification) && (
                    <Section title="12th">
                      <Grid>
                        <Input label="Stream"
                          value={user.qualifications?.twelfth?.stream || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","twelfth","stream"], v)} />
                        <Input label="Board"
                          value={user.qualifications?.twelfth?.board || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","twelfth","board"], v)} />
                        <Input label="Score"
                          value={user.qualifications?.twelfth?.score || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","twelfth","score"], v)} />
                      </Grid>
                    </Section>
                  )}

                  {/* UG */}
                  {["Under Graduate","Post Graduate"].includes(user.highestQualification) && (
                    <Section title="Under Graduation">
                      <Grid>
                        <Input label="College"
                          value={user.qualifications?.ug?.college || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","ug","college"], v)} />
                        <Input label="Degree"
                          value={user.qualifications?.ug?.degree || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","ug","degree"], v)} />
                        <Input label="Score"
                          value={user.qualifications?.ug?.score || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","ug","score"], v)} />
                      </Grid>
                    </Section>
                  )}

                  {/* PG */}
                  {user.highestQualification === "Post Graduate" && (
                    <Section title="Post Graduation">
                      <Grid>
                        <Input label="College"
                          value={user.qualifications?.pg?.college || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","pg","college"], v)} />
                        <Input label="Degree"
                          value={user.qualifications?.pg?.degree || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","pg","degree"], v)} />
                        <Input label="Score"
                          value={user.qualifications?.pg?.score || ""}
                          onChange={v => updateNested(user, setUser, ["qualifications","pg","score"], v)} />
                      </Grid>
                    </Section>
                  )}
                </>
              )}


          {/* WORK */}
          {active === "Work & Preferences" && (
            <>
              <Title text="Work & Preferences" />
              <Select
                label="Work Experience"
                value={user.experience}
                options={["No","Yes"]}
                onChange={v => setUser({ ...user, experience: v })}
              />

              {user.experience === "Yes" && (
                <Grid>
                  <Input label="Company"
                    value={user.company || ""}
                    onChange={v => setUser({ ...user, company: v })} />
                  <Input label="Years"
                    value={user.experienceYears || ""}
                    onChange={v => setUser({ ...user, experienceYears: v })} />
                </Grid>
              )}

              <Input label="Skills"
                value={user.skills?.join(", ")}
                onChange={v => setUser({ ...user, skills: v.split(",").map(s=>s.trim()) })} />
              <Input label="Interested Jobs"
                value={user.interestedJobs?.join(", ")}
                onChange={v => setUser({ ...user, interestedJobs: v.split(",").map(j=>j.trim()) })} />
            </>
          )}

          {/* METADATA */}
          {active === "Metadata" && (
            <>
              <Title text="Metadata" />
              <ReadOnly label="User ID" value={user._id} />
              <ReadOnly label="Extracted Skills" value={user.extractedSkills?.join(", ")} />
            </>
          )}

          <button
            onClick={updateProfile}
            disabled={loading}
            className="mt-10 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const updateNested = (obj, set, path, value) => {
  const updated = structuredClone(obj);
  let curr = updated;
  path.slice(0,-1).forEach(k => curr = curr[k] ||= {});
  curr[path.at(-1)] = value;
  set(updated);
};

const Title = ({ text }) => <h2 className="text-xl font-semibold mb-6">{text}</h2>;
const Grid = ({ children }) => <div className="grid md:grid-cols-2 gap-4">{children}</div>;
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-purple-600 mb-2">{title}</h3>
    {children}
  </div>
);
const Input = ({ label, value, onChange, disabled, type="text" }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      className="w-full mt-1 px-4 py-2 border rounded-lg"
    />
  </div>
);
const Select = ({ label, value, options, onChange }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-600">{label}</label>
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="w-full mt-1 px-4 py-2 border rounded-lg"
    >
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);
const ReadOnly = ({ label, value }) => (
  <Input label={label} value={value} disabled />
);
