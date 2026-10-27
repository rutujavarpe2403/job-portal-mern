import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Home() {
  const { jobs } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const companies = new Set(jobs.map((j) => j.company)).size;

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Your next chapter starts here</p>
          <h1>Find a job that fits your skills and your life.</h1>
          <p className="hero-text">
            Search openings from {companies} companies, apply in one click, and
            follow every application from a single dashboard.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Job title, company or skill"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search jobs"
            />
            <button type="submit" className="button">Search jobs</button>
          </form>

          <p className="hero-sub">
            Hiring instead? <Link to="/register">Create a recruiter account</Link>
          </p>
        </div>

        <aside className="hero-feed" aria-label="Latest openings">
          <h2>Latest openings</h2>
          {jobs.slice(0, 4).map((job) => (
            <Link to={`/jobs/${job.id}`} className="feed-item" key={job.id}>
              <span className="company-initial">{job.company[0]}</span>
              <span className="feed-text">
                <strong>{job.title}</strong>
                <small>{job.company} · {job.location}</small>
              </span>
              <span className="feed-salary">{job.salary}</span>
            </Link>
          ))}
          <Link to="/jobs" className="feed-more">See all {jobs.length} jobs</Link>
        </aside>
      </section>

      <section className="features">
        <h2>Everything you need for the search, in one place</h2>

        <div className="feature-grid">
          <div className="feature">
            <h3>Search by skill</h3>
            <p>Filter by title, company, skill or city and see only roles worth your time.</p>
          </div>
          <div className="feature">
            <h3>Apply in one click</h3>
            <p>Your profile goes with every application, so there are no forms to refill.</p>
          </div>
          <div className="feature">
            <h3>Track every status</h3>
            <p>See whether you are under review, shortlisted or declined, as recruiters update it.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to post your first opening?</h2>
          <p>Recruiters can publish a job in two minutes and review applicants right away.</p>
        </div>
        <Link to="/register" className="button light">Create an account</Link>
      </section>
    </div>
  );
}

export default Home;
