import { useMemo } from "react";
import { getBrokerStatus, recomputeBrokerCounts } from "../assignment.js";
import { INITIAL_BROKERS } from "../data.js";
import { storage } from "../storage.js";
import PublicHeader from "./PublicHeader.jsx";

export default function LandingPage() {
  const leads = storage.getLeads();
  const brokers = recomputeBrokerCounts(storage.getBrokers(INITIAL_BROKERS), leads);

  const brokerStats = useMemo(() => {
    const statuses = brokers.map((broker) => getBrokerStatus(broker.id, leads, broker));
    return {
      total: brokers.length,
      available: statuses.filter((status) => status === "Available").length,
      busy: statuses.filter((status) => status === "Busy").length,
      full: statuses.filter((status) => status === "Full").length,
    };
  }, [brokers, leads]);

  const leadStats = {
    total: leads.length,
    new: leads.filter((lead) => lead.leadStatus === "New").length,
    active: leads.filter((lead) => !["Closed", "Lost"].includes(lead.leadStatus)).length,
    closed: leads.filter((lead) => lead.leadStatus === "Closed").length,
  };

  return (
    <main className="public-page">
      <PublicHeader />

      <section className="public-hero">
        <span className="eyebrow">Real Estate Operations Platform</span>
        <h1>LMS</h1>
        <p>Lead Management System</p>
      </section>

      <section className="public-action-grid">
        <article className="public-action-card">
          <div>
            <span className="section-label">Broker Status</span>
            <h2>Broker Status</h2>
          </div>
          <dl>
            <div><dt>Total Brokers</dt><dd>{brokerStats.total}</dd></div>
            <div><dt>Available Brokers</dt><dd>{brokerStats.available}</dd></div>
            <div><dt>Busy Brokers</dt><dd>{brokerStats.busy}</dd></div>
            <div><dt>Full Brokers</dt><dd>{brokerStats.full}</dd></div>
          </dl>
          <a className="button primary" href="/broker-status">View Broker Status</a>
        </article>

        <article className="public-action-card">
          <div>
            <span className="section-label">Lead Status</span>
            <h2>Lead Status</h2>
          </div>
          <dl>
            <div><dt>Total Leads</dt><dd>{leadStats.total}</dd></div>
            <div><dt>New Leads</dt><dd>{leadStats.new}</dd></div>
            <div><dt>Active Leads</dt><dd>{leadStats.active}</dd></div>
            <div><dt>Closed Leads</dt><dd>{leadStats.closed}</dd></div>
          </dl>
          <a className="button subtle" href="/lead-status">View Lead Status</a>
        </article>
      </section>
    </main>
  );
}
