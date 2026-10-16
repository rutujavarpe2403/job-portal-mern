import { createContext, useContext, useEffect, useMemo, useState } from "react";
import seedJobs from "../data/jobs";

const AppContext = createContext(null);
const KEY = "jobconnect-db-v1";

const seedUsers = [
  { id: 1, name: "Admin", email: "admin@jobconnect.com", password: "admin12345", role: "admin" },
  { id: 2, name: "Riya Sharma", email: "recruiter@jobconnect.com", password: "recruiter123", role: "recruiter" },
  { id: 3, name: "Arjun Patil", email: "candidate@jobconnect.com", password: "candidate123", role: "candidate" },
];

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function dashboardPath(role) {
  return { admin: "/admin", recruiter: "/recruiter", candidate: "/candidate" }[role] || "/";
}

export function AppProvider({ children }) {
  const [db, setDb] = useState(
    () => load() ?? { users: seedUsers, session: null, postedJobs: [], applications: [] }
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      /* storage unavailable */
    }
  }, [db]);

  const user = db.users.find((u) => u.email === db.session) || null;
  const jobs = useMemo(() => [...db.postedJobs, ...seedJobs], [db.postedJobs]);

  const api = {
    user,
    jobs,
    users: db.users,
    postedJobs: db.postedJobs,
    applications: db.applications,

    register({ name, email, password, role }) {
      const mail = email.trim().toLowerCase();
      if (db.users.some((u) => u.email === mail))
        return { ok: false, error: "An account with this email already exists." };
      const newUser = { id: Date.now(), name: name.trim(), email: mail, password, role };
      setDb((d) => ({ ...d, users: [...d.users, newUser], session: mail }));
      return { ok: true, user: newUser };
    },

    login(email, password) {
      const found = db.users.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (!found) return { ok: false, error: "Email or password is incorrect." };
      setDb((d) => ({ ...d, session: found.email }));
      return { ok: true, user: found };
    },

    logout() {
      setDb((d) => ({ ...d, session: null }));
    },

    postJob(job) {
      const newJob = {
        ...job,
        id: Date.now(),
        recruiterEmail: user.email,
        postedAt: new Date().toISOString(),
      };
      setDb((d) => ({ ...d, postedJobs: [newJob, ...d.postedJobs] }));
    },

    deleteJob(id) {
      setDb((d) => ({
        ...d,
        postedJobs: d.postedJobs.filter((j) => j.id !== id),
        applications: d.applications.filter((a) => a.jobId !== id),
      }));
    },

    hasApplied(jobId) {
      return db.applications.find((a) => a.jobId === jobId && a.candidateEmail === user?.email);
    },

    apply(jobId) {
      if (!user || db.applications.some((a) => a.jobId === jobId && a.candidateEmail === user.email)) return;
      const entry = {
        id: Date.now(),
        jobId,
        candidateEmail: user.email,
        candidateName: user.name,
        status: "Applied",
        date: new Date().toISOString(),
      };
      setDb((d) => ({ ...d, applications: [entry, ...d.applications] }));
    },

    setStatus(appId, status) {
      setDb((d) => ({
        ...d,
        applications: d.applications.map((a) => (a.id === appId ? { ...a, status } : a)),
      }));
    },

    deleteUser(id) {
      setDb((d) => {
        const target = d.users.find((u) => u.id === id);
        if (!target || target.role === "admin") return d;
        const removedJobs = d.postedJobs.filter((j) => j.recruiterEmail === target.email).map((j) => j.id);
        return {
          ...d,
          users: d.users.filter((u) => u.id !== id),
          postedJobs: d.postedJobs.filter((j) => j.recruiterEmail !== target.email),
          applications: d.applications.filter(
            (a) => a.candidateEmail !== target.email && !removedJobs.includes(a.jobId)
          ),
        };
      });
    },
  };

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
