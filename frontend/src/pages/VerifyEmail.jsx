import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { request } from "../services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }).then((result) => {
      setMessage(result.message);
      setVerified(true);
    }).catch((error) => {
      setMessage(error.message);
    });
  }, [token]);

  const statusMessage = message || (token ? "Verifying your email..." : "This verification link is missing its token.");

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h1>{verified ? "Email verified" : "Email verification"}</h1>
        <p role="status">{statusMessage}</p>
        {verified && <Link className="button full-width" to="/login">Continue to login</Link>}
      </section>
    </div>
  );
}

export default VerifyEmail;