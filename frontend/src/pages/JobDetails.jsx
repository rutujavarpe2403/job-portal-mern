import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "../components/ui";

function JobDetails() {
  const { id } = useParams();
  const { jobs, user, apply, hasApplied } = useApp();
  const job = jobs.find((item) => item.id === Number(id));

  if (!job) {
    return (
      <div className="page-container">
        <h1>Job not found</h1>
        <p>This job may have been removed.</p>
        <Link to="/jobs" className="button">Back to jobs</Link>
      </div>
    );
  }

  const application = hasApplied(job.id);

  function renderAction() {
    if (!user) return <Link to="/login" state={{ from: `/jobs/${job.id}` }} className="button">Log in to apply</Link>;
    if (user.role !== "candidate") return <p className="note">Only candidate accounts can apply for jobs.</p>;
    if (application)
      return (
        <p className="note">
          You applied for this job. Current status: <StatusBadge status={application.status} />
        </p>
      );
    return <button className="button" onClick={() => apply(job.id)}>Apply now</button>;
  }

  return (
    <div className="page-container details-layout">
      <article className="details-card">
        <Link to="/jobs" className="back-link">← All jobs</Link>

        <div className="details-head">
          <span className="company-initial large">{job.company[0]}</span>
          <div>
            <h1>{job.title}</h1>
            <p className="company-name">{job.company}</p>
          </div>
        </div>

        <div className="job-meta">
          <span>{job.location}</span>
          <span>{job.salary}</span>
          <span>{job.type}</span>
          <span>{job.experience} experience</span>
        </div>

        <h2>About the role</h2>
        <p>{job.description}</p>

        <h2>Required skills</h2>
        <div className="skills">
          {job.skills.map((s) => <span className="skill-tag" key={s}>{s}</span>)}
        </div>

        <h2>Responsibilities</h2>
        <ul>
          {job.responsibilities.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </article>

      <aside className="apply-card">
        <h2>Interested in this role?</h2>
        <p>{job.company} · {job.location}</p>
        {renderAction()}
      </aside>
    </div>
  );
}

export default JobDetails;
