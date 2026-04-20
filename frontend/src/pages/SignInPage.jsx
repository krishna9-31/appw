import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { saveAuth } from "../services/auth";

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await login({
        email: email.trim(),
        password,
      });
      saveAuth(response.token, response.user);
      navigate("/search");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="auth-card">
        <h1 className="title">Sign In</h1>
        <p className="subtitle">Continue to book your bus tickets.</p>

        {error && <p className="alert-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="subtitle" style={{ marginTop: "14px" }}>
          New user? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default SignInPage;
