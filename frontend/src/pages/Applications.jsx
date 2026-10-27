import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { STATUSES, StatusBadge, formatDate } from "../components/ui";

function Applications() {
  const { user, jobs, applications, setStatus } = useApp();
  const [notice, setNotice] = useState("");
  const isRecruiter = user.role === "recruiter";

  const myJobIds = jobs.filter((j) => j.recruiterEmail === user.email).map((j) => j.id);
  const list = applications.filter((a) =>
    isRecruiter ? myJobIds.includes(a.jobId) : a.candidateEmail === user.email
  );

  async function handleStatusChange(applicationId, status) {
    const result = await setStatus(applicationId, status);
    if (!result.ok) {
      setNotice(result.error);
    } else if (result.notificationSent === false) {
      setNotice("Status saved, but the email notification was not sent. Check the SMTP settings.");
    } else {
      setNotice("");
    }
  }

  return (
    <div className="page-container dashboard-page">
      <header className="page-heading">
        <h1>{isRecruiter ? "Applicants" : "My applications"}</h1>
        <p>{isRecruiter ? "Review candidates and update their status." : "Track the status of every job you applied for."}</p>
      </header>

      <section className="panel">
        {notice && <p className="note" role="status">{notice}</p>}
        {list.length === 0 ? (
          <p className="empty-message">
            {isRecruiter ? "No applications yet." : <>You haven't applied to any jobs. <Link to="/jobs">Find a job</Link>.</>}
          </p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {isRecruiter && <th>Candidate</th>}
                  <th>Job</th>
                  {!isRecruiter && <th>Company</th>}
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => {
                  const job = jobs.find((j) => j.id === a.jobId);
                  return (
                    <tr key={a.id}>
                      {isRecruiter && <td>{a.candidateName}<small className="muted block">{a.candidateEmail}</small></td>}
                      <td>{job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : "Removed job"}</td>
                      {!isRecruiter && <td>{job?.company}</td>}
                      <td>{formatDate(a.date)}</td>
                      <td>
                        {isRecruiter ? (
                          <select className="status-select" value={a.status} aria-label={`Status for ${a.candidateName}`}
                            onChange={(e) => handleStatusChange(a.id, e.target.value)}>
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        ) : (
                          <StatusBadge status={a.status} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Applications;
