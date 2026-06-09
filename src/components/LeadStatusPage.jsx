import { useMemo, useState } from "react";
import { INITIAL_BROKERS, LANGUAGES, LEAD_STATUSES, PROPERTY_TYPES } from "../data.js";
import { formatTime } from "../managerUtils.js";
import { routeHref } from "../routing.js";
import { storage } from "../storage.js";
import LeadDetailsModal from "./LeadDetailsModal.jsx";
import PublicHeader from "./PublicHeader.jsx";

const emptyFilters = {
  search: "",
  status: "All",
  broker: "All",
  propertyType: "All",
  language: "All",
};

export default function LeadStatusPage() {
  const leads = storage.getLeads();
  const brokers = storage.getBrokers(INITIAL_BROKERS);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedLead, setSelectedLead] = useState(null);

  const brokerNames = useMemo(() => {
    const names = new Set([
      ...brokers.map((broker) => broker.name),
      ...leads.map((lead) => lead.assignedBrokerName).filter((name) => name && name !== "Pending"),
    ]);
    return Array.from(names).sort();
  }, [brokers, leads]);

  const visibleLeads = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return leads.filter((lead) => {
      const brokerName = lead.assignedBrokerName || "Pending";
      return (
        (!query ||
          lead.name.toLowerCase().includes(query) ||
          brokerName.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query)) &&
        (filters.status === "All" || lead.leadStatus === filters.status || lead.assignmentStatus === filters.status) &&
        (filters.broker === "All" || brokerName === filters.broker) &&
        (filters.propertyType === "All" || lead.propertyType === filters.propertyType) &&
        (filters.language === "All" || lead.language === filters.language)
      );
    });
  }, [leads, filters]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="public-page public-portal">
      <PublicHeader />

      <section className="portal-heading">
        <div>
          <span className="eyebrow">Public lead access</span>
          <h1>Lead Status</h1>
        </div>
        <a className="button subtle back-button" href={routeHref("/")}>Back to LMS</a>
      </section>

      <section className="toolbar-card public-toolbar">
        <label className="search-field">
          Search
          <input name="search" value={filters.search} onChange={updateFilter} placeholder="Lead name, broker name, phone number" />
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={updateFilter}>
            <option>All</option>
            <option>Assigned</option>
            <option>Pending</option>
            {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label>
          Broker
          <select name="broker" value={filters.broker} onChange={updateFilter}>
            <option>All</option>
            <option>Pending</option>
            {brokerNames.map((broker) => <option key={broker}>{broker}</option>)}
          </select>
        </label>
        <label>
          Property Type
          <select name="propertyType" value={filters.propertyType} onChange={updateFilter}>
            <option>All</option>
            {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Language
          <select name="language" value={filters.language} onChange={updateFilter}>
            <option>All</option>
            {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
          </select>
        </label>
        <button className="button subtle" type="button" onClick={() => setFilters(emptyFilters)}>Clear</button>
      </section>

      <section className="panel public-table-panel">
        {visibleLeads.length === 0 ? (
          <div className="leads-empty-state">
            <h3>No leads match these filters.</h3>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="manager-table public-leads-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Assigned Broker</th>
                  <th>Property Type</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => (
                  <tr key={lead.id} className="clickable-row" onClick={() => setSelectedLead(lead)}>
                    <td>
                      <strong>{lead.name}</strong>
                      <span>{lead.phone}</span>
                    </td>
                    <td>{lead.assignedBrokerName || "Pending"}</td>
                    <td>{lead.propertyType}</td>
                    <td>
                      <span className={`badge ${lead.assignmentStatus === "Assigned" ? "assigned" : "pending"}`}>
                        {lead.leadStatus || lead.assignmentStatus}
                      </span>
                    </td>
                    <td>{lead.activity?.at(-1) || formatTime(lead.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </main>
  );
}
