const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
  firstName,
  middleName,
  surname,
  dob,
  email,
  phone,
  password,

  address,
  state,
  district,
  country,
  pincode,

  highestQualification,

  tenthBoard,
  tenthYear,
  tenthScore,

  twelfthStream,
  twelfthBoard,
  twelfthScore,

  ugCourse,
  ugCollege,
  ugCgpa,
  ugYear,

  pgCourse,
  pgCollege,
  pgCgpa,
  pgYear,

  experience,
  company,
  experienceYears,

  skills,
  interestedJobs,
} = req.body;


    // 1️⃣ Check user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
        firstName,
        middleName,
        surname,
        dob,
        email,
        phone,
        password: hashedPassword,

        address,
        state,
        district,
        country,
        pincode,

        highestQualification,

        qualifications: {
          tenth: { board: tenthBoard, year: tenthYear, score: tenthScore },
          twelfth: { stream: twelfthStream, board: twelfthBoard, score: twelfthScore },
          ug: { course: ugCourse, college: ugCollege, cgpa: ugCgpa, year: ugYear },
          pg: { course: pgCourse, college: pgCollege, cgpa: pgCgpa, year: pgYear },
        },

        workExperience: {
          hasExperience: experience,
          company: experience === "Yes" ? company : null,
          years: experience === "Yes" ? experienceYears : null,
        },

        skills: skills?.split(",").map(s => s.trim()),
        interestedJobs: interestedJobs?.split(",").map(j => j.trim()),
      });


    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    //console.log("woww")
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // res.cookie("token", token, {
    //   httpOnly: true,      // JS cannot access it
    //   secure: false,       // true only in HTTPS
    //   sameSite: "lax",
    //   maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
