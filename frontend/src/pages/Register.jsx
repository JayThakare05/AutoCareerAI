import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import ThemeToggle from "./components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- UTILS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    let err = {};
    if (step === 1) {
      if (!form.firstName) err.firstName = "Required";
      if (!form.surname) err.surname = "Required";
      if (!form.email) err.email = "Required";
      if (!form.password) err.password = "Required";
      if (form.password !== form.confirmPassword)
        err.confirmPassword = "Passwords do not match";
    }
    if (step === 2) {
      ["address", "state", "country", "pincode"].forEach(f => {
        if (!form[f]) err[f] = "Required";
      });
      if (form.pincode && !/^\d{6}$/.test(form.pincode))
        err.pincode = "Invalid pincode";
    }
    if (step === 3) {
      if (!form.highestQualification)
        err.highestQualification = "Select qualification";
      if (!form.tenthBoard) err.tenthBoard = "Required";
      if (!form.tenthYear) err.tenthYear = "Required";
      if (!form.tenthScore) err.tenthScore = "Required";
      if (["12th", "Under Graduate", "Post Graduate"].includes(form.highestQualification)) {
        if (!form.twelfthStream) err.twelfthStream = "Required";
        if (!form.twelfthBoard) err.twelfthBoard = "Required";
        if (!form.twelfthScore) err.twelfthScore = "Required";
      }
      if (["Under Graduate", "Post Graduate"].includes(form.highestQualification)) {
        if (!form.ugCourse) err.ugCourse = "Required";
        if (!form.ugCollege) err.ugCollege = "Required";
        if (!form.ugCgpa) err.ugCgpa = "Required";
      }
      if (form.highestQualification === "Post Graduate") {
        if (!form.pgCourse) err.pgCourse = "Required";
        if (!form.pgCollege) err.pgCollege = "Required";
        if (!form.pgCgpa) err.pgCgpa = "Required";
      }
    }
    if (step === 4) {
      if (!form.skills) err.skills = "Required";
      if (!form.interestedJobs) err.interestedJobs = "Required";
    }
    setErrors(err);
    if (Object.keys(err).length > 0) {
      toast.error("Please fix the errors before continuing");
    }
    return Object.keys(err).length === 0;
  };

  const next = () => validateStep() && setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleRegister = async () => {
    if (!validateStep()) return;
    setLoading(true);
    const loadingToast = toast.loading("Creating your professional profile...");
    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful! Welcome aboard.", { id: loadingToast });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-400 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-electric/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <Link to="/" className="text-white text-2xl font-black tracking-tight drop-shadow-lg no-underline hover:scale-105 transition-transform">
          AUTOCAREER<span className="text-purple-300 dark:text-electric">AI</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-electric/20
                        rounded-[32px] shadow-2xl dark:shadow-electric/10 p-10 text-white overflow-hidden">

          <Progress step={step} />

          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <>
                  <Title title="Personal Details" desc="Basic identity & security" />
                  <Grid>
                    <Input label="First Name *" name="firstName" onChange={handleChange} value={form.firstName || ""} error={errors.firstName} />
                    <Input label="Middle Name" name="middleName" onChange={handleChange} value={form.middleName || ""} />
                    <Input label="Surname *" name="surname" onChange={handleChange} value={form.surname || ""} error={errors.surname} />
                    <Input label="DOB" type="date" name="dob" onChange={handleChange} value={form.dob || ""} />
                  </Grid>
                  <Input label="Email Address *" name="email" onChange={handleChange} value={form.email || ""} error={errors.email} />
                  <Input label="Phone Number" name="phone" onChange={handleChange} value={form.phone || ""} />
                  <Grid>
                    <Input label="Password *" type="password" name="password" onChange={handleChange} value={form.password || ""} error={errors.password} />
                    <Input label="Confirm Password *" type="password" name="confirmPassword" onChange={handleChange} value={form.confirmPassword || ""} error={errors.confirmPassword} />
                  </Grid>
                  <div className="mt-8 flex justify-end">
                    <Primary onClick={next}>Continue →</Primary>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <Title title="Location" desc="Current address details" />
                  <Input label="Full Address *" name="address" onChange={handleChange} value={form.address || ""} error={errors.address} />
                  <Grid>
                    <Input label="State *" name="state" onChange={handleChange} value={form.state || ""} error={errors.state} />
                    <Input label="District" name="district" onChange={handleChange} value={form.district || ""} />
                    <Input label="Country *" name="country" onChange={handleChange} value={form.country || ""} error={errors.country} />
                    <Input label="Pin Code *" name="pincode" onChange={handleChange} value={form.pincode || ""} error={errors.pincode} />
                  </Grid>
                  <div className="mt-8 flex justify-between">
                    <Ghost onClick={prev}>← Back</Ghost>
                    <Primary onClick={next}>Continue →</Primary>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <Title title="Education" desc="Your academic background" />
                  <Select
                    label="Highest Qualification *"
                    name="highestQualification"
                    options={["10th", "12th", "Under Graduate", "Post Graduate"]}
                    onChange={handleChange}
                    value={form.highestQualification || ""}
                    error={errors.highestQualification}
                  />
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {form.highestQualification && (
                      <Section title="10th Standard">
                        <Grid>
                          <Input label="Board *" name="tenthBoard" onChange={handleChange} value={form.tenthBoard || ""} error={errors.tenthBoard} />
                          <Input label="Year *" name="tenthYear" onChange={handleChange} value={form.tenthYear || ""} error={errors.tenthYear} />
                          <Input label="Score (CGPA/%) *" name="tenthScore" onChange={handleChange} value={form.tenthScore || ""} error={errors.tenthScore} />
                        </Grid>
                      </Section>
                    )}
                    {["12th", "Under Graduate", "Post Graduate"].includes(form.highestQualification) && (
                      <Section title="12th Standard">
                        <Grid>
                          <Input label="Stream *" name="twelfthStream" onChange={handleChange} value={form.twelfthStream || ""} error={errors.twelfthStream} />
                          <Input label="Board *" name="twelfthBoard" onChange={handleChange} value={form.twelfthBoard || ""} error={errors.twelfthBoard} />
                          <Input label="Score (CGPA/%) *" name="twelfthScore" onChange={handleChange} value={form.twelfthScore || ""} error={errors.twelfthScore} />
                        </Grid>
                      </Section>
                    )}
                    {["Under Graduate", "Post Graduate"].includes(form.highestQualification) && (
                      <Section title="Under Graduation">
                        <Grid>
                          <Input label="Course *" name="ugCourse" onChange={handleChange} value={form.ugCourse || ""} error={errors.ugCourse} />
                          <Input label="College *" name="ugCollege" onChange={handleChange} value={form.ugCollege || ""} error={errors.ugCollege} />
                          <Input label="CGPA *" name="ugCgpa" onChange={handleChange} value={form.ugCgpa || ""} error={errors.ugCgpa} />
                          <Input label="Year" name="ugYear" onChange={handleChange} value={form.ugYear || ""} />
                        </Grid>
                      </Section>
                    )}
                    {form.highestQualification === "Post Graduate" && (
                      <Section title="Post Graduation">
                        <Grid>
                          <Input label="Course *" name="pgCourse" onChange={handleChange} value={form.pgCourse || ""} error={errors.pgCourse} />
                          <Input label="College *" name="pgCollege" onChange={handleChange} value={form.pgCollege || ""} error={errors.pgCollege} />
                          <Input label="CGPA *" name="pgCgpa" onChange={handleChange} value={form.pgCgpa || ""} error={errors.pgCgpa} />
                          <Input label="Year" name="pgYear" onChange={handleChange} value={form.pgYear || ""} />
                        </Grid>
                      </Section>
                    )}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Ghost onClick={prev}>← Back</Ghost>
                    <Primary onClick={next}>Continue →</Primary>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <Title title="Career Details" desc="Work history & skills" />
                  <Grid>
                    <Select label="Work Experience?" name="experience" options={["No", "Yes"]} onChange={handleChange} value={form.experience || ""} />
                    {form.experience === "Yes" && (
                      <>
                        <Input label="Company Name" name="company" onChange={handleChange} value={form.company || ""} />
                        <Input label="Experience (Years)" name="experienceYears" onChange={handleChange} value={form.experienceYears || ""} />
                      </>
                    )}
                  </Grid>
                  <Input label="Skills (Comma separated) *" name="skills" placeholder="React, Node.js, Python..." onChange={handleChange} value={form.skills || ""} error={errors.skills} />
                  <Input label="Interested Job Roles *" name="interestedJobs" placeholder="Frontend Dev, ML Engineer..." onChange={handleChange} value={form.interestedJobs || ""} error={errors.interestedJobs} />
                  <div className="mt-8 flex justify-between">
                    <Ghost onClick={prev}>← Back</Ghost>
                    <Primary onClick={handleRegister} disabled={loading}>{loading ? "Finishing..." : "Complete Registration ✓"}</Primary>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

const Progress = ({ step }) => {
  const percent = Math.round((step / 4) * 100);
  return (
    <div className="mb-10 text-center">
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 italic">Progression: Stage {step} of 4</span>
        <span className="text-[10px] font-black text-purple-300 dark:text-electric uppercase tracking-widest">{percent}% Ready</span>
      </div>
      <div className="w-full h-2 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 dark:from-electric dark:to-purple-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
      </div>
    </div>
  );
};

const Title = ({ title, desc }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-black italic tracking-tighter italic uppercase mb-2">{title}</h2>
    <p className="text-sm text-white/50 font-medium">{desc}</p>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">{children}</div>
);

const Input = ({ label, error, ...props }) => (
  <div className="mb-5 group">
    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 ml-1">{label}</label>
    <input
      {...props}
      className={`w-full px-4 py-4 rounded-2xl transition-all duration-300 bg-white/10 dark:bg-white/5 border text-sm font-medium
                 focus:outline-none focus:ring-2 placeholder:text-white/20
                 ${error
          ? "border-red-400/50 focus:ring-red-400"
          : "border-white/10 dark:border-white/5 focus:ring-blue-400 dark:focus:ring-electric group-hover:bg-white/20"}`}
    />
    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-red-400 font-black uppercase tracking-widest mt-2 ml-2"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const Select = ({ label, options, error, ...props }) => (
  <div className="mb-5 group">
    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 ml-1">{label}</label>
    <select
      {...props}
      className={`w-full px-4 py-4 rounded-2xl bg-white/10 dark:bg-slate-900 border text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 appearance-none
                 ${error ? "border-red-400/50 focus:ring-red-400" : "border-white/10 dark:border-white/5 focus:ring-blue-400 dark:focus:ring-electric group-hover:bg-white/20"}`}
    >
      <option value="" className="bg-slate-900">Select option</option>
      {options.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
    </select>
    {error && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mt-2 ml-2">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="p-6 rounded-3xl bg-white/5 dark:bg-white-[0.02] border border-white/5 mb-6 hover:bg-white-[0.08] transition-all duration-500">
    <h3 className="text-[10px] font-black text-purple-300 dark:text-electric uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-3 italic">{title}</h3>
    {children}
  </div>
);

const Primary = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] bg-gradient-to-r from-blue-500 to-purple-500 dark:from-electric dark:to-purple-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

const Ghost = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all duration-300"
  >
    {children}
  </button>
);
