import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-head">
        <span className="company-initial">{job.company[0]}</span>
        <div>
          <h2>{job.title}</h2>
          <p className="company-name">{job.company}</p>
        </div>
      </div>

      <div className="job-meta">
        <span>{job.location}</span>
        <span>{job.salary}</span>
        <span>{job.type}</span>
      </div>

      <div className="skills">
        {job.skills.slice(0, 4).map((skill) => (
          <span className="skill-tag" key={skill}>{skill}</span>
        ))}
      </div>

      <Link to={`/jobs/${job.id}`} className="button full-width">
        View details
      </Link>
    </article>
  );
}

export default JobCard;
