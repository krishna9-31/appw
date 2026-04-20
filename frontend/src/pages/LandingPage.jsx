import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="landing-simple">
      <section className="landing-card">
        <h1 className="landing-title">BusBay</h1>
        <p className="landing-subtitle">Book your bus in minutes.</p>
        <div className="landing-actions">
          <Link to="/signup" className="button">
            Sign Up
          </Link>
          <Link to="/signin" className="button-outline">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
