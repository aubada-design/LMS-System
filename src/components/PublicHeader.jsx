import { Link } from "react-router-dom";
import logo from "../assets/guardians-lux-logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="agency-logo" to="/" aria-label="Guardians Lux home">
        <img src={logo} alt="Guardians Lux" />
      </Link>
      <nav className="public-actions" aria-label="Public navigation">
        <Link className="button primary" to="/manager-login">Manager Login</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
