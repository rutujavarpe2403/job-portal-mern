import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import JobFrom from "../components/JobFrom";

function CreateJob() {
  const { postJob } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(job) {
    const result = await postJob(job);
    if (!result.ok) return setError(result.error);
    navigate("/recruiter");
  }

  return (
    <div className="page-container narrow">
      <header className="page-heading">
        <h1>Post a job</h1>
        <p>Describe the role clearly. Candidates can apply as soon as you publish.</p>
      </header>
      {error && <p className="form-error" role="alert">{error}</p>}
      <JobFrom onSubmit={handleSubmit} submitLabel="Publish job" />
    </div>
  );
}

export default CreateJob;
