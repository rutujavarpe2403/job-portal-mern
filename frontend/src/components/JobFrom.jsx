import { useState } from "react";

const empty = {
  title: "", company: "", location: "", type: "Full-time",
  salary: "", experience: "", skills: "", description: "", responsibilities: "",
};

function JobFrom({ onSubmit, submitLabel = "Publish job" }) {
  const [form, setForm] = useState(empty);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      responsibilities: form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Job title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Frontend Developer" required />
      </div>
      <div>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Your company name" required />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Pune, Mumbai or Remote" required />
      </div>
      <div>
        <label htmlFor="type">Job type</label>
        <select id="type" name="type" value={form.type} onChange={handleChange}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
      </div>
      <div>
        <label htmlFor="salary">Salary</label>
        <input id="salary" name="salary" value={form.salary} onChange={handleChange} placeholder="₹6–9 LPA" required />
      </div>
      <div>
        <label htmlFor="experience">Experience</label>
        <input id="experience" name="experience" value={form.experience} onChange={handleChange} placeholder="1–3 years" required />
      </div>
      <div className="span-2">
        <label htmlFor="skills">Required skills (separate with commas)</label>
        <input id="skills" name="skills" value={form.skills} onChange={handleChange} placeholder="React, JavaScript, CSS" required />
      </div>
      <div className="span-2">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
      </div>
      <div className="span-2">
        <label htmlFor="responsibilities">Responsibilities (one per line)</label>
        <textarea id="responsibilities" name="responsibilities" rows="4" value={form.responsibilities} onChange={handleChange} required />
      </div>
      <div className="span-2">
        <button type="submit" className="button">{submitLabel}</button>
      </div>
    </form>
  );
}

export default JobFrom;
