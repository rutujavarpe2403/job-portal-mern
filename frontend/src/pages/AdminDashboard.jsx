import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Stat } from "../components/ui";

function AdminDashboard() {
  const { users, jobs, postedJobs, applications, deleteUser, deleteJob } = useApp();
  const count = (role) => users.filter((u) => u.role === role).length;

  return (
    <div className="page-container dashboard-page">
      <header className="page-heading">
        <h1>Admin dashboard</h1>
        <p>Oversee users, jobs and applications across JobConnect.</p>
      </header>

      <div className="stats">
        <Stat label="Candidates" value={count("candidate")} />
        <Stat label="Recruiters" value={count("recruiter")} />
        <Stat label="Jobs listed" value={jobs.length} />
        <Stat label="Applications" value={applications.length} />
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Users</h2></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role role-${u.role}`}>{u.role}</span></td>
                  <td className="actions">
                    {u.role !== "admin" && (
                      <button className="link-danger"
                        onClick={() => window.confirm(`Remove ${u.name}? Their jobs and applications will be deleted.`) && deleteUser(u.id)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Recruiter-posted jobs</h2></div>
        {postedJobs.length === 0 ? (
          <p className="empty-message">No recruiter has posted a job yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Title</th><th>Company</th><th>Posted by</th><th></th></tr></thead>
              <tbody>
                {postedJobs.map((j) => (
                  <tr key={j.id}>
                    <td><Link to={`/jobs/${j.id}`}>{j.title}</Link></td>
                    <td>{j.company}</td>
                    <td>{j.recruiterEmail}</td>
                    <td className="actions">
                      <button className="link-danger"
                        onClick={() => window.confirm(`Delete "${j.title}"?`) && deleteJob(j.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
