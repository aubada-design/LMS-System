import logo from "../assets/guardians-lux-logo.png";
import { routeHref } from "../routing.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <a className="agency-logo" href={routeHref("/")} aria-label="Guardians Lux home">
        <img src={logo} alt="Guardians Lux" />
      </a>
      <nav className="public-actions" aria-label="Public navigation">
        <a className="button primary" href={routeHref("/login")}>Manager Login</a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
