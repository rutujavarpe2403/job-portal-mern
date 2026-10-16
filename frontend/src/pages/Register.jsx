import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardPath, useApp } from "../context/AppContext";

function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "candidate" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = register(formData);
    if (!result.ok) return setError(result.error);
    navigate(dashboardPath(result.user.role), { replace: true });
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p>Join JobConnect and start in minutes.</p>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="role-toggle" role="radiogroup" aria-label="Account type">
          {[["candidate", "I'm looking for a job"], ["recruiter", "I'm hiring"]].map(([value, text]) => (
            <label key={value} className={formData.role === value ? "active" : ""}>
              <input type="radio" name="role" value={value} checked={formData.role === value} onChange={handleChange} />
              {text}
            </label>
          ))}
        </div>

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="At least 8 characters"
          value={formData.password} onChange={handleChange} minLength={8} required />

        <button type="submit" className="button full-width">Create account</button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
