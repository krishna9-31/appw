import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import { saveAuth } from "../services/auth";

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Enter valid name, email and password (min 6 chars).");
      return;
    }

    try {
      setLoading(true);
      const response = await signup({
        name: name.trim(),
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
        <h1 className="title">Sign Up</h1>
        <p className="subtitle">Create account to start booking.</p>

        {error && <p className="alert-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Enter your email"
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
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="subtitle" style={{ marginTop: "14px" }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUpPage;
