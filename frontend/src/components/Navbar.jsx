import { Link, NavLink, useNavigate } from "react-router-dom";
import { dashboardPath, useApp } from "../context/AppContext";

function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark">J</span>
        JobConnect
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/jobs">Find Jobs</NavLink>

        {user ? (
          <>
            <NavLink to={dashboardPath(user.role)}>Dashboard</NavLink>
            {user.role !== "admin" && <NavLink to="/applications">Applications</NavLink>}
            <button className="nav-link-button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="nav-button">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
