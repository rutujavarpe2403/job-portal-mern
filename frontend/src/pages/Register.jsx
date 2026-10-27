import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Register() {
  const { register, resendVerification } = useApp();
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "candidate" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await register(formData);
    if (!result.ok) return setError(result.error);
    setError("");
    setVerificationSent(true);
  }

  async function handleResend() {
    const result = await resendVerification(formData.email);
    setResendMessage(result.ok ? result.message : result.error);
  }

  if (verificationSent) {
    return (
      <div className="auth-page">
        <section className="auth-card">
          <h1>Verify your email</h1>
          <p>We sent a verification link to {formData.email}. Open it to activate your account.</p>
          <button type="button" className="button full-width" onClick={handleResend}>Resend verification email</button>
          {resendMessage && <p role="status">{resendMessage}</p>}
          <p className="auth-footer"><Link to="/login">Return to login</Link></p>
        </section>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p>Join JobConnect and start in minutes.</p>

        {error && <p className="form-error" role="alert">{error}</p>}
        {error.includes("verification email") && <p>Check your mail settings or request another verification link.</p>}
        {(error.includes("verification email") || error.includes("already exists")) && (
          <button type="button" className="link-button" onClick={handleResend}>Resend verification email</button>
        )}
        {resendMessage && <p role="status">{resendMessage}</p>}

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
