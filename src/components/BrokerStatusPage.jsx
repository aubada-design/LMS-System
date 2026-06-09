import { useMemo, useState } from "react";
import { BROKER_CAPACITY, getBrokerLeadCount, getBrokerStatus, recomputeBrokerCounts } from "../assignment.js";
import { getBrokerAvatar, getBrokerAvatarStyle } from "../brokerAvatars.js";
import { INITIAL_BROKERS } from "../data.js";
import { storage } from "../storage.js";
import LeadDetailsModal from "./LeadDetailsModal.jsx";
import PublicHeader from "./PublicHeader.jsx";

function brokerInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function leadLabel(lead, index) {
  const suffix = String(index + 124).padStart(3, "0");
  return `Lead #${lead.id?.slice(-3).toUpperCase() || suffix}`;
}

export default function BrokerStatusPage() {
  const leads = storage.getLeads();
  const brokers = recomputeBrokerCounts(storage.getBrokers(INITIAL_BROKERS), leads);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const visibleBrokers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return brokers.filter((broker) => !query || broker.name.toLowerCase().includes(query));
  }, [brokers, search]);

  return (
    <main className="public-page public-portal">
      <PublicHeader />

      <section className="portal-heading">
        <div>
          <span className="eyebrow">Public broker access</span>
          <h1>Broker Status</h1>
        </div>
        <a className="button subtle back-button" href="/">Back to LMS</a>
      </section>

      <label className="portal-search">
        <span>Search Broker Name...</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Broker Name..." />
      </label>

      <section className="public-broker-grid" aria-label="Broker status cards">
        {visibleBrokers.map((broker) => {
          const assignedLeads = leads.filter((lead) => lead.assignedBrokerId === broker.id);
          const leadCount = getBrokerLeadCount(broker.id, leads);
          const status = getBrokerStatus(broker.id, leads, broker);
          const capacity = Math.min((leadCount / BROKER_CAPACITY) * 100, 100);

          return (
            <article className="broker-status-card public-status-card" key={broker.id}>
              <div className="broker-status-card__header">
                <div className="public-broker-title">
                  <span className="profile-photo">
                    <img src={getBrokerAvatar(broker)} alt={`${broker.name} avatar`} style={getBrokerAvatarStyle(broker)} />
                    <span>{brokerInitials(broker.name)}</span>
                  </span>
                  <div>
                    <h2>{broker.name}</h2>
                    <span>{broker.language}</span>
                  </div>
                </div>
                <span className={`badge ${status.toLowerCase()}`}>{status}</span>
              </div>

              <dl className="broker-status-card__stats">
                <div>
                  <dt>Languages</dt>
                  <dd>{broker.language}</dd>
                </div>
                <div>
                  <dt>Assigned Leads Count</dt>
                  <dd>{leadCount}</dd>
                </div>
                <div>
                  <dt>Current Capacity</dt>
                  <dd>{leadCount}/{BROKER_CAPACITY}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{status}</dd>
                </div>
              </dl>

              <div className="capacity-track" aria-label={`${leadCount} of ${BROKER_CAPACITY} assigned leads`}>
                <span className={`capacity-fill ${status.toLowerCase()}`} style={{ width: `${capacity}%` }} />
              </div>

              <div className="broker-status-card__leads">
                <span className="section-label">Assigned leads</span>
                {assignedLeads.length > 0 ? (
                  <ul>
                    {assignedLeads.map((lead, index) => (
                      <li key={lead.id}>
                        <button type="button" onClick={() => setSelectedLead(lead)}>
                          {leadLabel(lead, index)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No assigned leads</p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {visibleBrokers.length === 0 ? (
        <div className="leads-empty-state">
          <h3>No brokers match this search.</h3>
        </div>
      ) : null}

      <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </main>
  );
}
