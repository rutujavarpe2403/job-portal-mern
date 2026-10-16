import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateJob from "./pages/CreateJob";
import Applications from "./pages/Applications";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/candidate" element={<ProtectedRoute roles={["candidate"]}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute roles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/create-job" element={<ProtectedRoute roles={["recruiter"]}><CreateJob /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute roles={["candidate", "recruiter"]}><Applications /></ProtectedRoute>} />

          <Route path="*" element={<div className="page-container"><h1>Page not found</h1></div>} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} JobConnect. Find work. Hire people.</footer>
    </>
  );
}

export default App;
