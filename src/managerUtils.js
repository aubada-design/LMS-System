export const emptyLeadFilters = {
  search: "",
  language: "All",
  status: "All",
  broker: "All",
  propertyType: "All",
  source: "All",
  area: "",
  minBudget: "",
  maxBudget: "",
};

export const emptyBrokerFilters = {
  search: "",
  language: "All",
  status: "All",
  active: "All",
};

export function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function parseBudget(value) {
  if (!value) return 0;
  const normalized = String(value).toLowerCase().replace(/,/g, "");
  const number = Number(normalized.match(/[\d.]+/)?.[0] || 0);

  if (normalized.includes("m")) return number * 1000000;
  if (normalized.includes("k")) return number * 1000;
  return number;
}

export function filterLeads(leads, filters) {
  const search = filters.search.trim().toLowerCase();
  const minBudget = filters.minBudget ? Number(filters.minBudget) : 0;
  const maxBudget = filters.maxBudget ? Number(filters.maxBudget) : Number.POSITIVE_INFINITY;

  return leads.filter((lead) => {
    const leadBudget = parseBudget(lead.budget);
    const brokerName = lead.assignedBrokerName || "Pending";

    return (
      (!search ||
        lead.name.toLowerCase().includes(search) ||
        lead.phone.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search)) &&
      (filters.language === "All" || lead.language === filters.language) &&
      (filters.status === "All" || lead.leadStatus === filters.status || lead.assignmentStatus === filters.status) &&
      (filters.broker === "All" || brokerName === filters.broker) &&
      (filters.propertyType === "All" || lead.propertyType === filters.propertyType) &&
      (filters.source === "All" || lead.source === filters.source) &&
      (!filters.area || lead.area.toLowerCase().includes(filters.area.toLowerCase())) &&
      leadBudget >= minBudget &&
      leadBudget <= maxBudget
    );
  });
}

export function filterBrokers(brokers, filters, leads = []) {
  const search = filters.search.trim().toLowerCase();

  return brokers.filter((broker) => (
    (!search || broker.name.toLowerCase().includes(search)) &&
    (filters.language === "All" || broker.language === filters.language) &&
    (filters.status === "All" || getBrokerStatus(broker.id, leads, broker) === filters.status) &&
    (filters.active === "All" ||
      (filters.active === "Active" ? broker.active !== false : broker.active === false))
  ));
}
import { getBrokerStatus } from "./assignment.js";
