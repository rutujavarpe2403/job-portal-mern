import { createContext, useContext, useEffect, useState } from "react";
import { getToken, request, setToken } from "../services/api";

const AppContext = createContext(null);

function normalizeUser(user) {
  return { ...user, id: user.id || user._id };
}

function normalizeJob(job) {
  return {
    ...job,
    id: job._id || job.id,
    company: job.company?.name || job.company || "Company",
    recruiterEmail: job.recruiter?.email || "",
    type: job.jobType || job.type || "Full-time",
    salary: job.salary || "Salary not listed",
    experience: job.experience || "Not specified",
    skills: job.skills || [],
    responsibilities: job.responsibilities || [],
  };
}

function normalizeApplication(application) {
  return {
    ...application,
    id: application._id || application.id,
    jobId: application.job?._id || application.job,
    candidateEmail: application.candidate?.email || "",
    candidateName: application.candidate?.name || "Candidate",
    status: application.status === "Interview" || application.status === "Selected"
      ? "Reviewing"
      : application.status,
    date: application.createdAt || application.date,
  };
}

export function dashboardPath(role) {
  return { admin: "/admin", recruiter: "/recruiter", candidate: "/candidate" }[role] || "/";
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refreshData(activeUser = user) {
    const records = await request("/jobs");
    setJobs(records.map(normalizeJob));

    if (!activeUser) {
      setApplications([]);
      setUsers([]);
      return;
    }

    const [applicationRecords, userRecords] = await Promise.all([
      request("/applications"),
      activeUser.role === "admin" ? request("/users") : Promise.resolve([]),
    ]);
    setApplications(applicationRecords.map(normalizeApplication));
    setUsers(userRecords.map(normalizeUser));
  }

  useEffect(() => {
    async function initialize() {
      try {
        if (getToken()) {
          const result = await request("/auth/me");
          const activeUser = normalizeUser(result.user);
          setUser(activeUser);
          await refreshData(activeUser);
        } else {
          await refreshData(null);
        }
      } catch {
        setToken(null);
        setUser(null);
        await refreshData(null).catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  async function login(email, password) {
    try {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result.token);
      const activeUser = normalizeUser(result.user);
      setUser(activeUser);
      await refreshData(activeUser);
      return { ok: true, user: activeUser };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function register(formData) {
    try {
      await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function resendVerification(email) {
    try {
      const result = await request("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return { ok: true, message: result.message };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setApplications([]);
    setUsers([]);
  }

  async function postJob(job) {
    try {
      await request("/jobs", { method: "POST", body: JSON.stringify(job) });
      await refreshData();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function deleteJob(id) {
    try {
      await request(`/jobs/${id}`, { method: "DELETE" });
      await refreshData();
    } catch (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  function hasApplied(jobId) {
    return applications.find((application) => application.jobId === jobId);
  }

  async function apply(jobId) {
    try {
      await request("/applications", {
        method: "POST",
        body: JSON.stringify({ job: jobId }),
      });
      await refreshData();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function setStatus(id, status) {
    try {
      const result = await request(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refreshData();
      return { ok: true, notificationSent: result.notificationSent };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function deleteUser(id) {
    try {
      await request(`/users/${id}`, { method: "DELETE" });
      await refreshData();
    } catch (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  const postedJobs = jobs.filter((job) => job.recruiterEmail === user?.email);
  const value = {
    user,
    jobs,
    users,
    postedJobs,
    applications,
    loading,
    login,
    register,
    resendVerification,
    logout,
    postJob,
    deleteJob,
    hasApplied,
    apply,
    setStatus,
    deleteUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}