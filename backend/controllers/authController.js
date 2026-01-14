const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  console.log("HII")
  try {
    const { name, email, password, qualification, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      qualification,
      address
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(err)
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
