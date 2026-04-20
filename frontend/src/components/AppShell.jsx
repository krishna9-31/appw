import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser, isLoggedIn } from "../services/auth";

function AppShell({ children }) {
  const navigate = useNavigate();
  const authenticated = isLoggedIn();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="brand">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 4h11a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-4 0h-4a2 2 0 0 1-4 0H3a2 2 0 0 1-2-2V9a5 5 0 0 1 4-5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M5 8h8M15 8h4M5 11h4M11 11h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>BusBay</span>
          </Link>

          <div className="site-header-right">
            <nav className="site-nav">
              <Link to={authenticated ? "/search" : "/"}>Home</Link>
              <Link to="/routes">Routes</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </nav>

            <div className="site-auth-actions">
              {authenticated ? (
                <>
                  <span className="user-pill">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.142 0-7.5 2.518-7.5 5.625A1.125 1.125 0 0 0 5.625 21h12.75A1.125 1.125 0 0 0 19.5 19.875c0-3.107-3.358-5.625-7.5-5.625Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{user?.name || "Account"}</span>
                  </span>
                  <button type="button" className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="nav-auth-link">
                    Sign In
                  </Link>
                  <Link to="/signup" className="signup-pill">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="content-wrap">{children}</div>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <Link to="/" className="brand">
            <span>BusBay</span>
          </Link>
          <div className="site-footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
            <Link to="/terms-of-service">TOS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;
