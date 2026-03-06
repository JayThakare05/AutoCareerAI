import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import ThemeToggle from "./components/ThemeToggle";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

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
    return Object.keys(err).length === 0;
  };

  const next = () => validateStep() && setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-400 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-electric/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <Link to="/" className="text-white text-2xl font-extrabold tracking-wide drop-shadow-lg no-underline hover:opacity-80">
          AutoCareer<span className="text-purple-300 dark:text-electric">AI</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-3xl animate-slide-up">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-electric/20
                        rounded-3xl shadow-2xl dark:shadow-electric/10 p-8 text-white">

          <Progress step={step} />

          <div key={step} className="animate-slide-in">
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
                  <Primary onClick={next}>Save & Next</Primary>
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
                  <Ghost onClick={prev}>Previous</Ghost>
                  <Primary onClick={next}>Save & Next</Primary>
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
                  <Ghost onClick={prev}>Previous</Ghost>
                  <Primary onClick={next}>Save & Next</Primary>
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
                  <Ghost onClick={prev}>Previous</Ghost>
                  <Primary onClick={handleRegister}>Complete Registration</Primary>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

const Progress = ({ step }) => {
  const percent = Math.round((step / 4) * 100);
  return (
    <div className="mb-10 text-center">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-white/50">Registration Step {step}/4</span>
        <span className="text-xs font-bold text-purple-300 dark:text-electric">{percent}% Ready</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 dark:from-electric dark:to-purple-500 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const Title = ({ title, desc }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-extrabold tracking-tight mb-2">{title}</h2>
    <p className="text-sm text-white/60 dark:text-slate-400 font-medium">{desc}</p>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0.5">{children}</div>
);

const Input = ({ label, error, ...props }) => (
  <div className="mb-5 group">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 ml-1">{label}</label>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-2xl transition-all duration-300 bg-white/10 dark:bg-white/5 border text-sm
                 focus:outline-none focus:ring-2 placeholder:text-white/20
                 ${error
          ? "border-red-400/50 focus:ring-red-400"
          : "border-white/10 dark:border-white/5 focus:ring-blue-400 dark:focus:ring-electric group-hover:bg-white/20"}`}
    />
    {error && <p className="text-[10px] text-red-400 font-bold mt-1.5 ml-2 animate-pulse">{error}</p>}
  </div>
);

const Select = ({ label, options, error, ...props }) => (
  <div className="mb-5 group">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 ml-1">{label}</label>
    <select
      {...props}
      className={`w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-slate-800 border text-sm transition-all duration-300 focus:outline-none focus:ring-2 
                 ${error ? "border-red-400/50 focus:ring-red-400" : "border-white/10 dark:border-white/5 focus:ring-blue-400 dark:focus:ring-electric group-hover:bg-white/20"}`}
    >
      <option value="" className="bg-slate-800">Select option</option>
      {options.map(o => <option key={o} value={o} className="bg-slate-800">{o}</option>)}
    </select>
    {error && <p className="text-[10px] text-red-400 font-bold mt-1.5 ml-2 animate-pulse">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="p-5 rounded-2xl bg-white/5 dark:bg-white-[0.02] border border-white/5 mb-5 hover:bg-white-[0.07] transition-all duration-300">
    <h3 className="text-sm font-bold text-purple-300 dark:text-electric uppercase tracking-widest mb-4 border-b border-white/10 pb-2">{title}</h3>
    {children}
  </div>
);

const Primary = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-electric dark:to-purple-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all duration-300"
  >
    {children}
  </button>
);

const Ghost = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-300"
  >
    {children}
  </button>
);
