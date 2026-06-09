import logo from "../assets/guardians-lux-logo.png";
import { getCurrentRoute, navigateToRoute, routeHref } from "../routing.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function ManagerLayout({ children, title, kicker }) {
  const currentPath = getCurrentRoute();
  const logout = () => {
    sessionStorage.removeItem("manager_logged_in");
    navigateToRoute("/login");
  };

  return (
    <main className="manager-page">
      <aside className="manager-sidebar">
        <a className="agency-logo manager-agency-logo" href={routeHref("/")} aria-label="Back to LMS landing page">
          <img src={logo} alt="Guardians Lux" />
        </a>
        <nav className="manager-nav" aria-label="Manager navigation">
          <a className="back-to-lms" href={routeHref("/")}>Back to LMS</a>
          <a className={currentPath === "/manager" || currentPath === "/manager/dashboard" ? "is-active" : ""} href={routeHref("/manager/dashboard")}>Dashboard</a>
          <a className={currentPath === "/manager/brokers" ? "is-active" : ""} href={routeHref("/manager/brokers")}>Brokers</a>
          <a className={currentPath === "/manager/leads" ? "is-active" : ""} href={routeHref("/manager/leads")}>Leads</a>
          <a className={currentPath === "/manager/activity" ? "is-active" : ""} href={routeHref("/manager/activity")}>Activity Log</a>
          <a className={currentPath === "/manager/settings" ? "is-active" : ""} href={routeHref("/manager/settings")}>Settings</a>
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
