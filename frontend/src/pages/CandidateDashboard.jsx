import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Stat, StatusBadge, formatDate } from "../components/ui";
import JobCard from "../components/JobCard";

function CandidateDashboard() {
  const { user, jobs, applications } = useApp();
  const mine = applications.filter((a) => a.candidateEmail === user.email);
  const count = (s) => mine.filter((a) => a.status === s).length;
  const appliedIds = mine.map((a) => a.jobId);
  const suggested = jobs.filter((j) => !appliedIds.includes(j.id)).slice(0, 3);

  return (
    <div className="page-container">
      <header className="page-heading">
        <h1>Hello, {user.name.split(" ")[0]}</h1>
        <p>Here is where your job search stands today.</p>
      </header>

      <div className="stats">
        <Stat label="Applications sent" value={mine.length} />
        <Stat label="Under review" value={count("Reviewing")} />
        <Stat label="Shortlisted" value={count("Shortlisted")} />
        <Stat label="Not selected" value={count("Rejected")} />
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent applications</h2>
          <Link to="/applications">View all</Link>
        </div>
        {mine.length === 0 ? (
          <p className="empty-message">You haven't applied yet. <Link to="/jobs">Browse jobs</Link> to get started.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {mine.slice(0, 5).map((a) => {
                  const job = jobs.find((j) => j.id === a.jobId);
                  return (
                    <tr key={a.id}>
                      <td>{job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : "Removed job"}</td>
                      <td>{job?.company}</td>
                      <td>{formatDate(a.date)}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <h2 className="section-title">Jobs you might like</h2>
      <div className="job-grid">
        {suggested.map((job) => <JobCard job={job} key={job.id} />)}
      </div>
    </div>
  );
}

export default CandidateDashboard;
