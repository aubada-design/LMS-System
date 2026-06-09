import { useEffect, useMemo, useState } from "react";
import {
  assignLeadAutomatically,
  assignLeadManually,
  getEligibleBrokers,
  recomputeBrokerCounts,
  shuffleAllLeads,
} from "../assignment.js";
import { INITIAL_BROKERS, LANGUAGES, LEAD_SOURCES, LEAD_STATUSES, PROPERTY_TYPES } from "../data.js";
import { emptyLeadFilters, filterLeads, formatTime } from "../managerUtils.js";
import { storage } from "../storage.js";
import ManagerLayout from "./ManagerLayout.jsx";

const emptyLeadForm = {
  name: "",
  phone: "",
  email: "",
  language: "Arabic",
  propertyType: "Apartment",
  budget: "",
  source: "Website",
  notes: "",
  assignmentMode: "Auto",
  brokerId: "",
};

function dateStamp(date = new Date()) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
}

export default function ManagerLeadsPage() {
  const [leads, setLeads] = useState(() => storage.getLeads());
  const [brokers, setBrokers] = useState(() =>
    recomputeBrokerCounts(storage.getBrokers(INITIAL_BROKERS), storage.getLeads()),
  );
  const [filters, setFilters] = useState(emptyLeadFilters);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => storage.setLeads(leads), [leads]);
  useEffect(() => storage.setBrokers(recomputeBrokerCounts(brokers, leads)), [brokers, leads]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || leads[0] || null,
    [leads, selectedLeadId],
  );

  const assignedBrokerOptions = useMemo(() => {
    const names = new Set([
      ...brokers.map((broker) => broker.name),
      ...leads.map((lead) => lead.assignedBrokerName).filter((name) => name && name !== "Pending"),
    ]);
    return Array.from(names).sort();
  }, [brokers, leads]);

  const visibleLeads = useMemo(() => filterLeads(leads, filters), [leads, filters]);

  const eligibleManualBrokers = useMemo(
    () => getEligibleBrokers(leadForm, brokers, leads),
    [leadForm, brokers, leads],
  );

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const updateLeadForm = (event) => {
    const { name, value } = event.target;
    setDuplicateWarning("");
    setLeadForm((current) => ({
      ...current,
      [name]: value,
      brokerId: name === "language" || name === "assignmentMode" ? "" : current.brokerId,
    }));
  };

  const resetLeadForm = () => {
    setLeadForm(emptyLeadForm);
    setEditingLeadId(null);
    setDuplicateWarning("");
  };

  const createTimeline = (lead, assignedLead) => [
    `${dateStamp()} Lead received from ${lead.source}`,
    assignedLead.assignmentStatus === "Assigned"
      ? `${dateStamp()} Assigned to ${assignedLead.assignedBrokerName}`
      : `${dateStamp()} Pending assignment`,
  ];

  const addLead = (event) => {
    event.preventDefault();
    const normalizedPhone = leadForm.phone.trim().toLowerCase();
    const normalizedEmail = leadForm.email.trim().toLowerCase();
    const duplicate = leads.find((lead) =>
      lead.phone.trim().toLowerCase() === normalizedPhone ||
      (normalizedEmail && lead.email.trim().toLowerCase() === normalizedEmail)
    );

    if (duplicate && !editingLeadId) {
      setDuplicateWarning(`Possible duplicate: ${duplicate.name} already uses this phone or email.`);
      return;
    }

    const baseLead = {
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email,
      language: leadForm.language,
      propertyType: leadForm.propertyType,
      budget: leadForm.budget,
      source: leadForm.source,
      notes: leadForm.notes,
      leadStatus: "New",
      timestamp: new Date().toISOString(),
    };

    const currentLeads = editingLeadId ? leads.filter((lead) => lead.id !== editingLeadId) : leads;
    const assignedLead = leadForm.assignmentMode === "Manual"
      ? assignLeadManually(baseLead, leadForm.brokerId, brokers, currentLeads)
      : assignLeadAutomatically(baseLead, brokers, currentLeads);

    const nextLead = {
      ...assignedLead,
      id: editingLeadId || assignedLead.id,
      activity: createTimeline(baseLead, assignedLead),
    };
    const nextLeads = [nextLead, ...currentLeads];

    setLeads(nextLeads);
    setBrokers((current) => recomputeBrokerCounts(current, nextLeads));
    setSelectedLeadId(nextLead.id);
    resetLeadForm();
  };

  const editLead = (lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      language: lead.language,
      propertyType: lead.propertyType,
      budget: lead.budget,
      source: lead.source,
      notes: lead.notes,
      assignmentMode: lead.assignmentMode || "Auto",
      brokerId: lead.assignedBrokerId || "",
    });
    setDuplicateWarning("");
  };

  const deleteLead = (leadId) => {
    const nextLeads = leads.filter((lead) => lead.id !== leadId);
    setLeads(nextLeads);
    setBrokers((current) => recomputeBrokerCounts(current, nextLeads));
    setSelectedLeadId(nextLeads[0]?.id || null);
  };

  const reassignLead = (lead) => {
    const otherLeads = leads.filter((item) => item.id !== lead.id);
    const reassignedLead = assignLeadAutomatically(
      {
        ...lead,
        assignedBrokerId: null,
        assignedBrokerName: "Pending",
        assignmentStatus: "Pending",
        status: "Pending",
        assignmentMode: "Auto",
        timestamp: new Date().toISOString(),
      },
      brokers,
      otherLeads,
    );
    const nextLead = {
      ...reassignedLead,
      activity: [
        ...(lead.activity || []),
        reassignedLead.assignmentStatus === "Assigned"
          ? `${dateStamp()} Reassigned to ${reassignedLead.assignedBrokerName}`
          : `${dateStamp()} Reassignment pending`,
      ],
    };
    const nextLeads = [nextLead, ...otherLeads];

    setLeads(nextLeads);
    setBrokers((current) => recomputeBrokerCounts(current, nextLeads));
    setSelectedLeadId(nextLead.id);
  };

  const shuffleLeads = () => {
    const nextLeads = shuffleAllLeads(leads, brokers).map((lead) => ({
      ...lead,
      activity: [
        ...(lead.activity || []),
        lead.assignmentStatus === "Assigned"
          ? `${dateStamp()} Shuffle assigned to ${lead.assignedBrokerName}`
          : `${dateStamp()} Shuffle left pending`,
      ],
    }));
    setLeads(nextLeads);
    setBrokers((current) => recomputeBrokerCounts(current, nextLeads));
  };

  const updateLeadStatus = (event) => {
    if (!selectedLead) return;
    const nextStatus = event.target.value;
    setLeads((current) => current.map((lead) =>
      lead.id === selectedLead.id
        ? {
            ...lead,
            leadStatus: nextStatus,
            activity: [...(lead.activity || []), `${dateStamp()} Status changed to ${nextStatus}`],
          }
        : lead,
    ));
  };

  const addNote = (event) => {
    event.preventDefault();
    if (!selectedLead || !noteText.trim()) return;
    setLeads((current) => current.map((lead) =>
      lead.id === selectedLead.id
        ? {
            ...lead,
            notes: [lead.notes, noteText.trim()].filter(Boolean).join("\n"),
            activity: [...(lead.activity || []), `${dateStamp()} ${noteText.trim()}`],
          }
        : lead,
    ));
    setNoteText("");
  };

  const noManualBroker = leadForm.assignmentMode === "Manual" && eligibleManualBrokers.length === 0;

  return (
    <ManagerLayout title="Leads" kicker="Lead workspace">
      <section className="workspace-two-column">
        <section className="panel manager-panel">
          <div className="panel-header row-header">
            <div>
              <span className="section-label">Add new lead</span>
              <h2>{editingLeadId ? "Edit lead" : "Add and assign a lead"}</h2>
            </div>
            {editingLeadId ? <button className="button subtle" type="button" onClick={resetLeadForm}>Cancel edit</button> : null}
          </div>
          <form className="filters-grid lead-entry-grid" onSubmit={addLead}>
            <label>
              Lead Name
              <input name="name" value={leadForm.name} onChange={updateLeadForm} required />
            </label>
            <label>
              Phone
              <input name="phone" value={leadForm.phone} onChange={updateLeadForm} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={leadForm.email} onChange={updateLeadForm} required />
            </label>
            <label>
              Language
              <select name="language" value={leadForm.language} onChange={updateLeadForm}>
                {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
            <label>
              Property Type
              <select name="propertyType" value={leadForm.propertyType} onChange={updateLeadForm}>
                {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label>
              Budget
              <input name="budget" value={leadForm.budget} onChange={updateLeadForm} placeholder="AED 2.5M" required />
            </label>
            <label>
              Lead Source
              <select name="source" value={leadForm.source} onChange={updateLeadForm}>
                {LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}
              </select>
            </label>
            <label>
              Assignment Options
              <select name="assignmentMode" value={leadForm.assignmentMode} onChange={updateLeadForm}>
                <option value="Auto">Auto Assign</option>
                <option value="Manual">Manual Assign Broker</option>
              </select>
            </label>
            {leadForm.assignmentMode === "Manual" ? (
              <label>
                Manual Assign Broker
                <select name="brokerId" value={leadForm.brokerId} onChange={updateLeadForm} required={!noManualBroker}>
                  <option value="">Select compatible broker</option>
                  {eligibleManualBrokers.map((broker) => <option key={broker.id} value={broker.id}>{broker.name}</option>)}
                </select>
              </label>
            ) : null}
            <label className="notes-field">
              Notes
              <textarea name="notes" value={leadForm.notes} onChange={updateLeadForm} rows="4" />
            </label>
            {duplicateWarning ? <p className="duplicate-warning">{duplicateWarning}</p> : null}
            {noManualBroker ? <p className="form-error">No compatible broker has capacity for this lead.</p> : null}
            <div className="form-actions">
              <button className="button primary" type="submit" disabled={noManualBroker}>
                {editingLeadId ? "Save Lead" : "Add Lead"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel lead-detail-panel">
          <div className="panel-header">
            <span className="section-label">Lead details page</span>
            <h2>{selectedLead ? selectedLead.name : "No lead selected"}</h2>
          </div>
          {selectedLead ? (
            <>
              <div className="lead-info-grid">
                <span>Phone <strong>{selectedLead.phone}</strong></span>
                <span>Email <strong>{selectedLead.email || "Not added"}</strong></span>
                <span>Language <strong>{selectedLead.language}</strong></span>
                <span>Budget <strong>{selectedLead.budget}</strong></span>
              </div>
              <label>
                Status Dropdown
                <select value={selectedLead.leadStatus} onChange={updateLeadStatus}>
                  {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <div className="timeline">
                <span className="section-label">Activity Timeline</span>
                {(selectedLead.activity || []).map((activity, index) => (
                  <p key={`${activity}-${index}`}>{activity}</p>
                ))}
              </div>
              <form className="note-form" onSubmit={addNote}>
                <label>
                  Manager notes
                  <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} rows="3" />
                </label>
                <button className="button subtle" type="submit">Add Note</button>
              </form>
            </>
          ) : (
            <p className="empty-state">Select a lead to view details.</p>
          )}
        </section>
      </section>

      <section className="panel manager-panel">
          <div className="panel-header row-header">
            <div>
              <span className="section-label">Lead management section</span>
              <h2>Lead table</h2>
            </div>
          <div className="table-actions">
            <button className="button subtle" type="button" onClick={shuffleLeads}>Shuffle Leads</button>
            <button className="button subtle" type="button" onClick={() => setFilters(emptyLeadFilters)}>Clear filters</button>
          </div>
        </div>
        <div className="filters-grid">
          <label>
            Search name, phone, email
            <input name="search" value={filters.search} onChange={updateFilter} placeholder="Client, +971, email" />
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
              {assignedBrokerOptions.map((broker) => <option key={broker}>{broker}</option>)}
            </select>
          </label>
          <label>
            Language
            <select name="language" value={filters.language} onChange={updateFilter}>
              <option>All</option>
              {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
          <label>
            Source
            <select name="source" value={filters.source} onChange={updateFilter}>
              <option>All</option>
              {LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}
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
            Min Budget
            <input name="minBudget" type="number" value={filters.minBudget} onChange={updateFilter} placeholder="0" />
          </label>
          <label>
            Max Budget
            <input name="maxBudget" type="number" value={filters.maxBudget} onChange={updateFilter} placeholder="5000000" />
          </label>
        </div>

        {leads.length === 0 ? (
          <div className="leads-empty-state">
            <div className="empty-illustration" aria-hidden="true">GL</div>
            <h3>No leads available yet.</h3>
            <button className="button primary" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Add Lead
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th>Lead Source</th>
                  <th>Property Type</th>
                  <th>Budget</th>
                  <th>Assigned Broker</th>
                  <th>Status</th>
                  <th>Date Created</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.name}</strong>
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.email || "Not added"}</td>
                    <td>{lead.language}</td>
                    <td>{lead.source}</td>
                    <td>{lead.propertyType}</td>
                    <td>{lead.budget}</td>
                    <td>{lead.assignedBrokerName}</td>
                    <td>
                      <div className="status-stack">
                        <span className={`badge ${lead.assignmentStatus === "Assigned" ? "assigned" : "pending"}`}>
                          {lead.assignmentStatus}
                        </span>
                        <span className="badge auto">{lead.leadStatus}</span>
                      </div>
                    </td>
                    <td>{formatTime(lead.timestamp)}</td>
                    <td>{lead.activity?.at(-1) || "Created"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="text-action" type="button" onClick={() => setSelectedLeadId(lead.id)}>View</button>
                        <button className="text-action" type="button" onClick={() => editLead(lead)}>Edit</button>
                        <button className="text-action" type="button" onClick={() => reassignLead(lead)}>Reassign</button>
                        <button className="text-action danger" type="button" onClick={() => deleteLead(lead.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ManagerLayout>
  );
}
