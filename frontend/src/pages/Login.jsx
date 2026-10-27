import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dashboardPath, useApp } from "../context/AppContext";

function Login() {
  const { login, resendVerification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) return setError(result.error);
    navigate(location.state?.from || dashboardPath(result.user.role), { replace: true });
  }

  async function handleResend() {
    const result = await resendVerification(email);
    setResendMessage(result.ok ? result.message : result.error);
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Log in to your JobConnect account.</p>

        {error && <p className="form-error" role="alert">{error}</p>}
        {error.includes("verify your email") && (
          <button type="button" className="link-button" onClick={handleResend}>Resend verification email</button>
        )}
        {resendMessage && <p role="status">{resendMessage}</p>}

        <label htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter your password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="button full-width">Log in</button>

        <p className="auth-footer">
          New to JobConnect? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
