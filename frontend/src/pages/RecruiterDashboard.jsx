import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Stat, StatusBadge, formatDate } from "../components/ui";

function RecruiterDashboard() {
  const { user, postedJobs, applications, deleteJob } = useApp();
  const myJobs = postedJobs.filter((j) => j.recruiterEmail === user.email);
  const myIds = myJobs.map((j) => j.id);
  const received = applications.filter((a) => myIds.includes(a.jobId));

  return (
    <div className="page-container dashboard-page">
      <header className="page-heading row">
        <div>
          <h1>Recruiter dashboard</h1>
          <p>Manage your openings and review who applied.</p>
        </div>
        <Link to="/recruiter/create-job" className="button">Post a job</Link>
      </header>

      <div className="stats">
        <Stat label="Active jobs" value={myJobs.length} />
        <Stat label="Applications received" value={received.length} />
        <Stat label="Awaiting review" value={received.filter((a) => a.status === "Applied").length} />
        <Stat label="Shortlisted" value={received.filter((a) => a.status === "Shortlisted").length} />
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Your job postings</h2></div>
        {myJobs.length === 0 ? (
          <p className="empty-message">No jobs posted yet. <Link to="/recruiter/create-job">Post your first job</Link>.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Title</th><th>Location</th><th>Type</th><th>Applicants</th><th></th></tr></thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job.id}>
                    <td><Link to={`/jobs/${job.id}`}>{job.title}</Link></td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>{applications.filter((a) => a.jobId === job.id).length}</td>
                    <td className="actions">
                      <button className="link-danger"
                        onClick={() => window.confirm(`Delete "${job.title}"? Its applications will be removed too.`) && deleteJob(job.id)}>
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

      <section className="panel">
        <div className="panel-head">
          <h2>Latest applicants</h2>
          <Link to="/applications">Manage all</Link>
        </div>
        {received.length === 0 ? (
          <p className="empty-message">Applicants will appear here once candidates apply.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Candidate</th><th>Job</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {received.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td>{a.candidateName}</td>
                    <td>{myJobs.find((j) => j.id === a.jobId)?.title}</td>
                    <td>{formatDate(a.date)}</td>
                    <td><StatusBadge status={a.status} /></td>
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

export default RecruiterDashboard;
