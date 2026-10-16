import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import JobFrom from "../components/JobFrom";

function CreateJob() {
  const { postJob } = useApp();
  const navigate = useNavigate();

  function handleSubmit(job) {
    postJob(job);
    navigate("/recruiter");
  }

  return (
    <div className="page-container narrow">
      <header className="page-heading">
        <h1>Post a job</h1>
        <p>Describe the role clearly. Candidates can apply as soon as you publish.</p>
      </header>
      <JobFrom onSubmit={handleSubmit} submitLabel="Publish job" />
    </div>
  );
}

export default CreateJob;
