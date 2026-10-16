import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import JobCard from "../components/JobCard";

function Jobs() {
  const { jobs } = useApp();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");

  const locations = [...new Set(jobs.map((j) => j.location))];
  const types = [...new Set(jobs.map((j) => j.type))];
  const term = search.toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.skills.some((s) => s.toLowerCase().includes(term));
    return (
      matchesSearch &&
      (location === "All" || job.location === location) &&
      (type === "All" || job.type === type)
    );
  });

  return (
    <div className="page-container">
      <header className="page-heading">
        <h1>Find your next opportunity</h1>
        <p>Explore jobs that match your skills and interests.</p>
      </header>

      <div className="search-panel">
        <input
          type="text"
          placeholder="Search job title, company or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search jobs"
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location">
          <option value="All">All locations</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Job type">
          <option value="All">All job types</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <p className="results-count">
        {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
      </p>

      <div className="job-grid">
        {filteredJobs.map((job) => <JobCard job={job} key={job.id} />)}
      </div>

      {filteredJobs.length === 0 && (
        <p className="empty-message">No jobs match these filters. Clear the search or choose another location.</p>
      )}
    </div>
  );
}

export default Jobs;
