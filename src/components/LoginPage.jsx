import { useState } from "react";
import logo from "../assets/guardians-lux-logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Demo-only authentication. Replace this with real auth such as Firebase
    // Authentication or Supabase Auth before using this in production.
    if (password === "admin123") {
      sessionStorage.setItem("manager_logged_in", "true");
      window.location.assign("/manager/dashboard");
      return;
    }

    setError("Incorrect manager password.");
  };

  return (
    <main className="login-page">
      <section className="login-panel panel">
        <a className="agency-logo login-agency-logo" href="/" aria-label="Back to LMS landing page">
          <img src={logo} alt="Guardians Lux" />
        </a>
        <div>
          <span className="eyebrow">Manager login</span>
          <h1>Sign in</h1>
          <p>Use the demo password to access lead and broker operations.</p>
        </div>
        <ThemeToggle />
        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            Password
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button primary full" type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}
