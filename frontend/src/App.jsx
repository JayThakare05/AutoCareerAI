import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Profile from "./pages/components/profile/Profile";
import Jobs from "./pages/Jobs";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/components/history/ResumeHistory";
import SavedJobs from "./pages/SavedJobs";
import ProjectRecommendations from "./pages/components/projects/ProjectRecommendations";
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
        <Route path="/resume-history" element={<ResumeHistory />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/project-recommend" element={<ProjectRecommendations />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
