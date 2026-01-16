import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
