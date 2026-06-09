import { LANGUAGES, LEAD_SOURCES, PROPERTY_TYPES } from "../data.js";
import ThemeToggle from "./ThemeToggle.jsx";
import ManagerLayout from "./ManagerLayout.jsx";

const settings = [
  ["Broker Capacity", "Maximum 5 leads per broker"],
  ["Assignment Rules", "Match language, respect capacity, prefer lowest workload"],
  ["Dark Mode Defaults", "Theme is saved per browser session"],
  ["System Preferences", "Frontend-only demo using localStorage"],
];

export default function SettingsPage() {
  return (
    <ManagerLayout title="Settings" kicker="System configuration">
      <section className="settings-grid">
        {settings.map(([title, body]) => (
          <article className="settings-card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
        <article className="settings-card">
          <h2>Languages</h2>
          <p>{LANGUAGES.join(", ")}</p>
        </article>
        <article className="settings-card">
          <h2>Lead Sources</h2>
          <p>{LEAD_SOURCES.join(", ")}</p>
        </article>
        <article className="settings-card">
          <h2>Property Types</h2>
          <p>{PROPERTY_TYPES.join(", ")}</p>
        </article>
        <article className="settings-card">
          <h2>Theme</h2>
          <p>Switch workspace appearance.</p>
          <ThemeToggle />
        </article>
      </section>
    </ManagerLayout>
  );
}
