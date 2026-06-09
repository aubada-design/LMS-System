import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/guardians-lux-logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

export default function ManagerLayout({ children, title, kicker }) {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("manager_logged_in");
    navigate("/manager-login");
  };

  return (
    <main className="manager-page">
      <aside className="manager-sidebar">
        <Link className="agency-logo manager-agency-logo" to="/" aria-label="Back to LMS landing page">
          <img src={logo} alt="Guardians Lux" />
        </Link>
        <nav className="manager-nav" aria-label="Manager navigation">
          <Link className="back-to-lms" to="/">Back to LMS</Link>
          <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/manager/dashboard">Dashboard</NavLink>
          <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/manager/brokers">Brokers</NavLink>
          <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/manager/leads">Leads</NavLink>
          <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/manager/activity">Activity Log</NavLink>
          <NavLink className={({ isActive }) => (isActive ? "is-active" : "")} to="/manager/settings">Settings</NavLink>
          <ThemeToggle />
          <button className="button subtle" type="button" onClick={logout}>Logout</button>
        </nav>
      </aside>

      <section className="manager-content">
        <section className="manager-hero">
          <div>
            <span className="eyebrow">{kicker}</span>
            <h1>{title}</h1>
          </div>
        </section>

        {children}
      </section>
    </main>
  );
}
