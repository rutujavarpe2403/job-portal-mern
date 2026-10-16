import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dashboardPath, useApp } from "../context/AppContext";

const demos = [
  { label: "Candidate", email: "candidate@jobconnect.com", password: "candidate123" },
  { label: "Recruiter", email: "recruiter@jobconnect.com", password: "recruiter123" },
  { label: "Admin", email: "admin@jobconnect.com", password: "admin12345" },
];

function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) return setError(result.error);
    navigate(location.state?.from || dashboardPath(result.user.role), { replace: true });
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Log in to your JobConnect account.</p>

        {error && <p className="form-error" role="alert">{error}</p>}

        <label htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter your password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="button full-width">Log in</button>

        <div className="demo-box">
          <span>Try a demo account</span>
          <div>
            {demos.map((d) => (
              <button type="button" key={d.label} className="chip"
                onClick={() => { setEmail(d.email); setPassword(d.password); setError(""); }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <p className="auth-footer">
          New to JobConnect? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
