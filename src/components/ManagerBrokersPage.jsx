import { useEffect, useMemo, useState } from "react";
import {
  BROKER_CAPACITY,
  getBrokerClosedDeals,
  getBrokerConversionRate,
  getBrokerLeadCount,
  getBrokerStatus,
  recomputeBrokerCounts,
} from "../assignment.js";
import { getBrokerAvatar, getBrokerAvatarStyle } from "../brokerAvatars.js";
import { AREAS, INITIAL_BROKERS, LANGUAGES, PROPERTY_TYPES } from "../data.js";
import { emptyBrokerFilters, filterBrokers } from "../managerUtils.js";
import { storage } from "../storage.js";
import ManagerLayout from "./ManagerLayout.jsx";

const emptyBrokerForm = {
  name: "",
  language: "Arabic",
  availability: "Available",
  active: true,
};

function brokerInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function brokerProfile(broker, index) {
  const slug = broker.name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.+|\.+$/g, "");
  return {
    email: `${slug || "broker"}@guardianslux.example`,
    phone: `+971 50 ${String(2400 + index * 37).padStart(4, "0")} ${String(110 + index).padStart(3, "0")}`,
    areas: [AREAS[index % AREAS.length], AREAS[(index + 3) % AREAS.length]],
    propertyTypes: [PROPERTY_TYPES[index % PROPERTY_TYPES.length], PROPERTY_TYPES[(index + 1) % PROPERTY_TYPES.length]],
  };
}

export default function ManagerBrokersPage() {
  const [leads, setLeads] = useState(() => storage.getLeads());
  const [brokers, setBrokers] = useState(() =>
    recomputeBrokerCounts(storage.getBrokers(INITIAL_BROKERS), storage.getLeads()),
  );
  const [filters, setFilters] = useState(emptyBrokerFilters);
  const [brokerForm, setBrokerForm] = useState(emptyBrokerForm);
  const [editingBrokerId, setEditingBrokerId] = useState(null);

  useEffect(() => storage.setLeads(leads), [leads]);
  useEffect(() => storage.setBrokers(recomputeBrokerCounts(brokers, leads)), [brokers, leads]);

  const visibleBrokers = useMemo(() => filterBrokers(brokers, filters, leads), [brokers, filters, leads]);
  const isEditing = Boolean(editingBrokerId);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setBrokerForm((current) => ({
      ...current,
      [name]: name === "active" ? value === "Active" : value,
    }));
  };

  const resetForm = () => {
    setBrokerForm(emptyBrokerForm);
    setEditingBrokerId(null);
  };

  const submitBroker = (event) => {
    event.preventDefault();

    if (isEditing) {
      setBrokers((current) =>
        current.map((broker) =>
          broker.id === editingBrokerId
            ? { ...broker, ...brokerForm, maxCapacity: BROKER_CAPACITY }
            : broker,
        ),
      );
    } else {
      setBrokers((current) => [
        ...current,
        {
          ...brokerForm,
          id: crypto.randomUUID(),
          assignedCount: 0,
          maxCapacity: BROKER_CAPACITY,
        },
      ]);
    }

    resetForm();
  };

  const editBroker = (broker) => {
    setEditingBrokerId(broker.id);
    setBrokerForm({
      name: broker.name,
      language: broker.language,
      availability: broker.availability || "Available",
      active: broker.active !== false,
    });
  };

  const toggleAvailability = (brokerId) => {
    setBrokers((current) =>
      current.map((broker) =>
        broker.id === brokerId
          ? { ...broker, availability: broker.availability === "Busy" ? "Available" : "Busy" }
          : broker,
      ),
    );
  };

  const toggleActive = (brokerId) => {
    setBrokers((current) =>
      current.map((broker) =>
        broker.id === brokerId ? { ...broker, active: broker.active === false } : broker,
      ),
    );
  };

  const deleteBroker = (brokerId) => {
    const nextBrokers = brokers.filter((broker) => broker.id !== brokerId);
    const nextLeads = leads.map((lead) =>
      lead.assignedBrokerId === brokerId
        ? {
            ...lead,
            assignedBrokerId: null,
            assignedBrokerName: "Pending",
            status: "Pending",
            assignmentStatus: "Pending",
            statusNote: "Pending - assigned broker was removed.",
          }
        : lead,
    );

    setLeads(nextLeads);
    setBrokers(recomputeBrokerCounts(nextBrokers, nextLeads));
  };

  return (
    <ManagerLayout title="Brokers" kicker="Broker workspace">
      <section className="toolbar-card">
        <div className="toolbar-main">
          <label className="search-field">
            Search brokers
            <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search by broker name" />
          </label>
          <label>
            Language
            <select name="language" value={filters.language} onChange={updateFilter}>
              <option>All</option>
              {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
          <label>
            Availability
            <select name="status" value={filters.status} onChange={updateFilter}>
              <option>All</option>
              <option>Available</option>
              <option>Busy</option>
              <option>Full</option>
            </select>
          </label>
          <label>
            Active
            <select name="active" value={filters.active} onChange={updateFilter}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <button className="button subtle" type="button" onClick={() => setFilters(emptyBrokerFilters)}>
            Clear
          </button>
        </div>
      </section>

      <section className="panel manager-panel compact-panel">
        <div className="panel-header row-header">
          <div>
            <span className="section-label">{isEditing ? "Edit broker" : "Add broker"}</span>
            <h2>{isEditing ? brokerForm.name : "Create broker profile"}</h2>
          </div>
          {isEditing ? (
            <button className="button subtle" type="button" onClick={resetForm}>Cancel edit</button>
          ) : null}
        </div>
        <form className="filters-grid broker-form-grid" onSubmit={submitBroker}>
          <label>
            Name
            <input name="name" value={brokerForm.name} onChange={updateForm} required />
          </label>
          <label>
            Language
            <select name="language" value={brokerForm.language} onChange={updateForm}>
              {LANGUAGES.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
          <label>
            Availability
            <select name="availability" value={brokerForm.availability} onChange={updateForm}>
              <option>Available</option>
              <option>Busy</option>
            </select>
          </label>
          <label>
            Active status
            <select name="active" value={brokerForm.active ? "Active" : "Inactive"} onChange={updateForm}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          <label>
            Max capacity per day
            <input value={BROKER_CAPACITY} readOnly />
          </label>
          <div className="form-actions">
            <button className="button primary" type="submit">{isEditing ? "Save broker" : "Add broker"}</button>
          </div>
        </form>
      </section>

      <section className="directory-section">
        <div className="section-title-row">
          <div>
            <span className="section-label">Directory</span>
            <h2>{visibleBrokers.length} brokers shown</h2>
          </div>
          <a className="button subtle" href="/manager/leads">Open leads</a>
        </div>

        {visibleBrokers.length === 0 ? (
          <div className="leads-empty-state">
            <h3>No brokers match these filters.</h3>
            <button className="button primary" type="button" onClick={() => setFilters(emptyBrokerFilters)}>Clear filters</button>
          </div>
        ) : (
          <div className="broker-card-grid">
            {visibleBrokers.map((broker, index) => {
              const activeLeads = getBrokerLeadCount(broker.id, leads);
              const status = getBrokerStatus(broker.id, leads, broker);
              const closedDeals = getBrokerClosedDeals(broker.id, leads);
              const conversionRate = getBrokerConversionRate(broker.id, leads);
              const profile = brokerProfile(broker, index);
              const capacity = Math.min((activeLeads / BROKER_CAPACITY) * 100, 100);

              return (
                <article className="broker-profile-card" key={broker.id}>
                  <div className="broker-profile-top">
                    <span className="profile-photo">
                      <img src={getBrokerAvatar(broker, index)} alt={`${broker.name} avatar`} style={getBrokerAvatarStyle(broker)} />
                      <span>{brokerInitials(broker.name)}</span>
                    </span>
                    <div className="broker-profile-title">
                      <h3>{broker.name}</h3>
                      <p>{broker.language} specialist</p>
                    </div>
                    <span className={`badge ${status.toLowerCase()}`}>{status}</span>
                  </div>

                  <div className="tag-row">
                    <span>{broker.language}</span>
                    {profile.areas.map((area) => <span key={area}>{area}</span>)}
                    {profile.propertyTypes.map((type) => <span key={type}>{type}</span>)}
                  </div>

                  <div className="capacity-block">
                    <div>
                      <span>Current leads</span>
                      <strong>{activeLeads}/{BROKER_CAPACITY}</strong>
                    </div>
                    <div className="capacity-track" aria-label={`${activeLeads} of ${BROKER_CAPACITY} active leads`}>
                      <span className={`capacity-fill ${status.toLowerCase()}`} style={{ width: `${capacity}%` }} />
                    </div>
                  </div>

                  <div className="broker-metric-grid">
                    <span>Closed deals <strong>{closedDeals}</strong></span>
                    <span>Conversion <strong>{conversionRate}%</strong></span>
                    <span>Status <strong>{broker.active === false ? "Inactive" : "Active"}</strong></span>
                    <span>Capacity <strong>{BROKER_CAPACITY}/day</strong></span>
                  </div>

                  <div className="contact-block">
                    <span>{profile.phone}</span>
                    <span>{profile.email}</span>
                  </div>

                  <div className="card-actions">
                    <a className="button subtle" href={`/manager/leads?broker=${encodeURIComponent(broker.name)}`}>View</a>
                    <button className="button subtle" type="button" onClick={() => editBroker(broker)}>Edit</button>
                    <button className="button subtle" type="button" onClick={() => toggleAvailability(broker.id)}>
                      {broker.availability === "Busy" ? "Set Available" : "Set Busy"}
                    </button>
                    <button className="button subtle" type="button" onClick={() => toggleActive(broker.id)}>
                      {broker.active === false ? "Activate" : "Deactivate"}
                    </button>
                    <button className="text-action danger" type="button" onClick={() => deleteBroker(broker.id)}>Delete</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </ManagerLayout>
  );
}
