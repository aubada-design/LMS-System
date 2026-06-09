import { useEffect, useMemo, useState } from "react";
import { BROKER_CAPACITY, getBrokerLeadCount, getBrokerStatus, recomputeBrokerCounts } from "../assignment.js";
import { INITIAL_BROKERS } from "../data.js";
import { storage } from "../storage.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function DemoPage() {
  const [brokers, setBrokers] = useState(() => storage.getBrokers(INITIAL_BROKERS));
  const [leads] = useState(() => storage.getLeads());

  useEffect(() => {
    setBrokers((current) => recomputeBrokerCounts(current, leads));
  }, [leads]);

  useEffect(() => {
    storage.setBrokers(brokers);
  }, [brokers]);

  const brokerCards = useMemo(() => (
    brokers.map((broker) => ({
      ...broker,
      leadCount: getBrokerLeadCount(broker.id, leads),
      status: getBrokerStatus(broker.id, leads, broker),
      leadNames: leads
        .filter((lead) => lead.assignedBrokerId === broker.id)
        .map((lead) => lead.name),
    }))
  ), [brokers, leads]);

  return (
    <main className="demo-page">
      <header className="topbar">
        <a className="lms-wordmark" href="#/" aria-label="LMS home">
          <strong>LMS</strong>
          <span>Lead Management System</span>
        </a>
        <div className="topbar-links">
          <a className="nav-link" href="/login">Manager</a>
          <a className="nav-link" href="#/">Overview</a>
          <ThemeToggle />
        </div>
      </header>

      <section className="demo-hero">
        <div>
          <span className="eyebrow">Public broker status</span>
          <h1>Broker Status</h1>
        </div>
      </section>

      <section className="public-broker-grid" aria-label="Broker status workspace">
        {brokerCards.map((broker) => (
          <article className="broker-status-card" key={broker.id}>
            <div className="broker-status-card__header">
              <div>
                <h2>{broker.name}</h2>
                <span>{broker.language}</span>
              </div>
              <span className={`badge ${broker.status.toLowerCase()}`}>{broker.status}</span>
            </div>
            <dl className="broker-status-card__stats">
              <div>
                <dt>Assigned leads</dt>
                <dd>{broker.leadCount}</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{BROKER_CAPACITY}</dd>
              </div>
            </dl>
            <div className="broker-status-card__leads">
              <span>Lead names</span>
              {broker.leadNames.length > 0 ? (
                <ul>
                  {broker.leadNames.map((leadName) => <li key={leadName}>{leadName}</li>)}
                </ul>
              ) : (
                <p>No assigned leads</p>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
