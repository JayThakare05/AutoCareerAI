import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

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

  /* STEP 1 */
    if (step === 1) {
      if (!form.firstName) err.firstName = "Required";
      if (!form.surname) err.surname = "Required";
      if (!form.email) err.email = "Required";
      if (!form.password) err.password = "Required";
      if (form.password !== form.confirmPassword)
        err.confirmPassword = "Passwords do not match";
    }

    /* STEP 2 */
    if (step === 2) {
      ["address", "state", "country", "pincode"].forEach(f => {
        if (!form[f]) err[f] = "Required";
      });
      if (form.pincode && !/^\d{6}$/.test(form.pincode))
        err.pincode = "Invalid pincode";
    }

    /* STEP 3 – QUALIFICATION (CRITICAL) */
    if (step === 3) {
      if (!form.highestQualification)
        err.highestQualification = "Select qualification";

      // 10th mandatory for all
      if (!form.tenthBoard) err.tenthBoard = "Required";
      if (!form.tenthYear) err.tenthYear = "Required";
      if (!form.tenthScore) err.tenthScore = "Required";

      // 12th+
      if (["12th", "Under Graduate", "Post Graduate"].includes(form.highestQualification)) {
        if (!form.twelfthStream) err.twelfthStream = "Required";
        if (!form.twelfthBoard) err.twelfthBoard = "Required";
        if (!form.twelfthScore) err.twelfthScore = "Required";
      }

      // UG+
      if (["Under Graduate", "Post Graduate"].includes(form.highestQualification)) {
        if (!form.ugCourse) err.ugCourse = "Required";
        if (!form.ugCollege) err.ugCollege = "Required";
        if (!form.ugCgpa) err.ugCgpa = "Required";
      }

      // PG
      if (form.highestQualification === "Post Graduate") {
        if (!form.pgCourse) err.pgCourse = "Required";
        if (!form.pgCollege) err.pgCollege = "Required";
        if (!form.pgCgpa) err.pgCgpa = "Required";
      }
    }

    /* STEP 4 */
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">

      {/* Logo */}
      <div className="absolute top-6 left-6 text-white text-2xl font-extrabold">
        AutoCareer<span className="text-pink-300">AI</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/20 border border-white/30
                      rounded-2xl shadow-2xl p-8 text-white transition-all duration-500">

        {/* Progress */}
        <Progress step={step} />

        {/* STEP CONTENT */}
        <div className="animate-slide">
          {step === 1 && (
            <>
              <Title title="Personal Details" desc="Basic identity & security" />
              <Grid>
                <Input label="First Name *" name="firstName" onChange={handleChange} error={errors.firstName} />
                <Input label="Middle Name" name="middleName" onChange={handleChange} />
                <Input label="Surname *" name="surname" onChange={handleChange} error={errors.surname} />
                <Input label="DOB" type="date" name="dob" onChange={handleChange} />
              </Grid>

              <Input label="Email *" name="email" onChange={handleChange} error={errors.email} />
              <Input label="Phone" name="phone" onChange={handleChange} />

              <Grid>
                <Input label="Password *" type="password" name="password" onChange={handleChange} error={errors.password} />
                <Input
                      label="Confirm Password *"
                      type="password"
                      name="confirmPassword"
                      onChange={handleChange}
                      error={errors.confirmPassword}
                    />

              </Grid>

              <NextButton onClick={next} />
            </>
          )}

          {step === 2 && (
            <>
              <Title title="Address Details" desc="Where you are located" />
              <Input label="Current Address *" name="address" onChange={handleChange} error={errors.address} />
              <Grid>
                <Input label="State *" name="state" onChange={handleChange} error={errors.state} />
                <Input label="District" name="district" onChange={handleChange} />
              </Grid>
              <Grid>
                <Input label="Country *" name="country" onChange={handleChange} error={errors.country} />
                <Input label="Pin Code *" name="pincode" onChange={handleChange} error={errors.pincode} />
              </Grid>
              <NavButtons prev={prev} next={next} />
            </>
          )}

          {step === 3 && (
            <>
              <Title title="Qualifications" desc="Academic background" />

              {/* Highest Qualification */}
              <Select
                label="Highest Qualification *"
                name="highestQualification"
                options={["10th", "12th", "Under Graduate", "Post Graduate"]}
                onChange={handleChange}
                error={errors.highestQualification}
              />

              {/* 10th Details */}
              {["10th", "12th", "Under Graduate", "Post Graduate"].includes(form.highestQualification) && (
                <Section title="10th Details">
                  <Grid>
                    <Input
                      label="10th Board *"
                      name="tenthBoard"
                      onChange={handleChange}
                      error={errors.tenthBoard}
                    />
                    <Input
                      label="Year of Passing *"
                      name="tenthYear"
                      onChange={handleChange}
                      error={errors.tenthYear}
                    />
                    <Input
                      label="Percentage / CGPA *"
                      name="tenthScore"
                      onChange={handleChange}
                      error={errors.tenthScore}
                    />
                  </Grid>
                </Section>
              )}

              {/* 12th Details */}
              {["12th", "Under Graduate", "Post Graduate"].includes(form.highestQualification) && (
                <Section title="12th Details">
                  <Grid>
                    <Input
                      label="Stream *"
                      name="twelfthStream"
                      onChange={handleChange}
                      error={errors.twelfthStream}
                    />
                    <Input
                      label="Board *"
                      name="twelfthBoard"
                      onChange={handleChange}
                      error={errors.twelfthBoard}
                    />
                    <Input
                      label="Percentage / CGPA *"
                      name="twelfthScore"
                      onChange={handleChange}
                      error={errors.twelfthScore}
                    />
                  </Grid>
                </Section>
              )}

              {/* Under Graduation Details */}
              {["Under Graduate", "Post Graduate"].includes(form.highestQualification) && (
                <Section title="Under Graduation Details">
                  <Grid>
                    <Input
                      label="Course *"
                      name="ugCourse"
                      onChange={handleChange}
                      error={errors.ugCourse}
                    />
                    <Input
                      label="University / College *"
                      name="ugCollege"
                      onChange={handleChange}
                      error={errors.ugCollege}
                    />
                    <Input
                      label="CGPA / Percentage *"
                      name="ugCgpa"
                      onChange={handleChange}
                      error={errors.ugCgpa}
                    />
                    <Input
                      label="Year of Passing"
                      name="ugYear"
                      onChange={handleChange}
                    />
                  </Grid>
                </Section>
              )}

              {/* Post Graduation Details */}
              {form.highestQualification === "Post Graduate" && (
                <Section title="Post Graduation Details">
                  <Grid>
                    <Input
                      label="Course *"
                      name="pgCourse"
                      onChange={handleChange}
                      error={errors.pgCourse}
                    />
                    <Input
                      label="University / College *"
                      name="pgCollege"
                      onChange={handleChange}
                      error={errors.pgCollege}
                    />
                    <Input
                      label="CGPA / Percentage *"
                      name="pgCgpa"
                      onChange={handleChange}
                      error={errors.pgCgpa}
                    />
                    <Input
                      label="Year of Passing"
                      name="pgYear"
                      onChange={handleChange}
                    />
                  </Grid>
                </Section>
              )}

              <NavButtons prev={prev} next={next} />
            </>
          )}


          {step === 4 && (
            <>
              <Title title="Work & Interests" desc="Career preferences" />

              <Select
                label="Do you have work experience?"
                name="experience"
                options={["No", "Yes"]}
                onChange={handleChange}
              />

              {form.experience === "Yes" && (
                <Grid>
                  <Input label="Company Name" name="company" onChange={handleChange} />
                  <Input label="Years of Experience" name="experienceYears" onChange={handleChange} />
                </Grid>
              )}


              <Input
                label="Skills *"
                name="skills"
                placeholder="e.g. Python, React, SQL"
                onChange={handleChange}
                error={errors.skills}
              />


              <Input
                label="Interested Job Roles *"
                name="interestedJobs"
                onChange={handleChange}
                error={errors.interestedJobs}
              />

              <div className="flex justify-between mt-6">
                <Ghost onClick={prev}>Previous</Ghost>
                <Primary onClick={handleRegister}>Register →</Primary>
              </div>
            </>
          )}


          {/* {step === 5 && (
            <>
              <Title title="Upload Documents" desc="You can update later" />
              <File label="Profile Photo *" />
              <File label="Resume *" />
              <File label="Certificates (Optional)" multiple />
              <div className="flex justify-between mt-6">
                <Ghost onClick={prev}>Previous</Ghost>
                <Primary onClick={handleRegister}>Register →</Primary>
              </div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Progress = ({ step }) => (
  <div className="mb-6">
    <div className="flex justify-between text-xs text-white/70 mb-1">
      <span>Step {step} of 4</span>
      <span>{Math.round((step /4 ) * 100)}%</span>
    </div>
    <div className="w-full h-2 bg-white/20 rounded-full">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
        style={{ width: `${(step / 4) * 100}%` }}
      />
    </div>
  </div>
);

const Title = ({ title, desc }) => (
  <>
    <h2 className="text-2xl font-bold mb-1">{title}</h2>
    <p className="text-sm text-white/70 mb-6">{desc}</p>
  </>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    <label className="text-xs uppercase text-white/70">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-white/90 text-black
                 focus:ring-2 focus:ring-pink-400 outline-none"
    />
    {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options, error, ...props }) => (
  <div className="mb-4">
    <label className="text-xs uppercase text-white/70">{label}</label>
    <select {...props} className="w-full px-4 py-3 rounded-xl bg-white text-black">
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    {error && <p className="text-xs text-red-300">{error}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold text-pink-300 mb-2">{title}</h3>
    {children}
  </div>
);

// const File = ({ label, multiple }) => (
//   <div className="mb-4">
//     <label className="text-sm text-white/80">{label}</label>
//     <input type="file" multiple={multiple} className="w-full mt-1 bg-white p-2 rounded" />
//   </div>
// );

const Primary = ({ children, onClick }) => (
  <button onClick={onClick} className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold">
    {children}
  </button>
);

const Ghost = ({ children, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 rounded bg-white/20">
    {children}
  </button>
);

const NextButton = ({ onClick }) => (
  <Primary onClick={onClick}>Save & Next →</Primary>
);

const NavButtons = ({ prev, next }) => (
  <div className="flex justify-between mt-6">
    <Ghost onClick={prev}>Previous</Ghost>
    <Primary onClick={next}>Save & Next →</Primary>
  </div>
);
