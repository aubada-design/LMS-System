import { normalizeBrokers, normalizeLeads } from "./data.js";

const read = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const storage = {
  getBrokers: (fallback) => normalizeBrokers(read("leadflow:brokers", fallback)),
  getLeads: () => normalizeLeads(read("leadflow:leads", [])),
  setBrokers: (brokers) => localStorage.setItem("leadflow:brokers", JSON.stringify(brokers)),
  setLeads: (leads) => localStorage.setItem("leadflow:leads", JSON.stringify(leads)),
  reset: () => {
    localStorage.removeItem("leadflow:brokers");
    localStorage.removeItem("leadflow:leads");
  },
};
