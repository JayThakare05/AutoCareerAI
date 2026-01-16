const mongoose = require("mongoose");

const qualificationSchema = new mongoose.Schema(
  {
    tenth: {
      board: String,
      year: String,
      score: String,
    },
    twelfth: {
      stream: String,
      board: String,
      score: String,
    },
    ug: {
      course: String,
      college: String,
      cgpa: String,
      year: String,
    },
    pg: {
      course: String,
      college: String,
      cgpa: String,
      year: String,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    /* PERSONAL */
    firstName: { type: String, required: true },
    middleName: String,
    surname: { type: String, required: true },
    dob: Date,

    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },

    /* ADDRESS */
    address: String,
    state: String,
    district: String,
    country: String,
    pincode: String,

    /* EDUCATION */
    highestQualification: {
      type: String,
      enum: ["10th", "12th", "Under Graduate", "Post Graduate"],
      required: true,
    },
    qualifications: qualificationSchema,

    /* CAREER */
    workExperience: {
      hasExperience: String,
      company: String,
      years: String,
    },
    extractedSkills: [String],
    skills: [String],
    interestedJobs: [String],


    /* FILES */
    documents: {
      profilePhoto: String,
      resume: String,
      certificates: [String],
    },

    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
