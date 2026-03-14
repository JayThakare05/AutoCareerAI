const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");


dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
// app.use(cookieParser()); // 👈 REQUIRED for req.cookies

app.use("/auth", require("./routes/authRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/jobs", require("./routes/jobRoutes"));
app.use("/ai", require("./routes/aiRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/api/saved-jobs", require("./routes/savedJobRoutes"));
app.use("/api/project-recommend", require("./routes/projectRoutes"))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

