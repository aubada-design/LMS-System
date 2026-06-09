import logo from "../assets/guardians-lux-logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

export default function ManagerLayout({ children, title, kicker }) {
  const currentPath = window.location.pathname;
  const logout = () => {
    sessionStorage.removeItem("manager_logged_in");
    window.location.assign("/login");
  };

  return (
    <main className="manager-page">
      <aside className="manager-sidebar">
        <a className="agency-logo manager-agency-logo" href="/" aria-label="Back to LMS landing page">
          <img src={logo} alt="Guardians Lux" />
        </a>
        <nav className="manager-nav" aria-label="Manager navigation">
          <a className="back-to-lms" href="/">Back to LMS</a>
          <a className={currentPath === "/manager" || currentPath === "/manager/dashboard" ? "is-active" : ""} href="/manager/dashboard">Dashboard</a>
          <a className={currentPath === "/manager/brokers" ? "is-active" : ""} href="/manager/brokers">Brokers</a>
          <a className={currentPath === "/manager/leads" ? "is-active" : ""} href="/manager/leads">Leads</a>
          <a className={currentPath === "/manager/activity" ? "is-active" : ""} href="/manager/activity">Activity Log</a>
          <a className={currentPath === "/manager/settings" ? "is-active" : ""} href="/manager/settings">Settings</a>
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
