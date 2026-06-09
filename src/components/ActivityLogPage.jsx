import { useMemo, useState } from "react";
import { INITIAL_BROKERS } from "../data.js";
import { storage } from "../storage.js";
import ManagerLayout from "./ManagerLayout.jsx";

const filters = ["All Activity", "Lead Activity", "Broker Activity", "Assignments", "System Changes"];

export default function ActivityLogPage() {
  const [filter, setFilter] = useState("All Activity");
  const leads = storage.getLeads();
  const brokers = storage.getBrokers(INITIAL_BROKERS);

  const events = useMemo(() => [
    ...leads.flatMap((lead) => (lead.activity || []).map((activity) => ({
      type: activity.includes("Assigned") || activity.includes("assigned") ? "Assignments" : "Lead Activity",
      title: lead.name,
      body: activity,
      timestamp: lead.timestamp,
    }))),
    ...brokers.map((broker) => ({
      type: "Broker Activity",
      title: broker.name,
      body: `${broker.name} available for ${broker.language} leads`,
      timestamp: new Date().toISOString(),
    })),
    {
      type: "System Changes",
      title: "Settings",
      body: "Broker capacity set to 5 leads",
      timestamp: new Date().toISOString(),
    },
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), [brokers, leads]);

  const visibleEvents = filter === "All Activity" ? events : events.filter((event) => event.type === filter);

  return (
    <ManagerLayout title="Activity Log" kicker="System history">
      <section className="panel">
        <div className="filter-pills">
          {filters.map((item) => (
            <button
              className={filter === item ? "is-active" : ""}
              key={item}
              type="button"
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="timeline activity-timeline">
          {visibleEvents.map((event, index) => (
            <article key={`${event.title}-${event.body}-${index}`}>
              <span>{event.type}</span>
              <h3>{event.title}</h3>
              <p>{event.body}</p>
            </article>
          ))}
        </div>
      </section>
    </ManagerLayout>
  );
}
