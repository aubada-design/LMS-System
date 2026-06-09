export const BROKER_CAPACITY = 5;

export function getBrokerLeadCount(brokerId, leads) {
  return leads.filter((lead) => lead.assignedBrokerId === brokerId).length;
}

export function getBrokerStatus(brokerId, leads, broker) {
  const count = getBrokerLeadCount(brokerId, leads);

  if (count >= BROKER_CAPACITY) return "Full";
  if (broker?.availability === "Busy") return "Busy";
  if (count >= 3) return "Busy";
  return "Available";
}

export function getBrokerClosedDeals(brokerId, leads) {
  return leads.filter((lead) => lead.assignedBrokerId === brokerId && lead.leadStatus === "Closed").length;
}

export function getBrokerConversionRate(brokerId, leads) {
  const assignedCount = getBrokerLeadCount(brokerId, leads);
  if (assignedCount === 0) return 0;
  return Math.round((getBrokerClosedDeals(brokerId, leads) / assignedCount) * 100);
}

export function getEligibleBrokers(lead, brokers, leads) {
  return brokers.filter((broker) => (
    broker.active !== false &&
    broker.availability !== "Busy" &&
    broker.language === lead.language &&
    getBrokerLeadCount(broker.id, leads) < BROKER_CAPACITY
  ));
}

function pendingLead(lead, assignmentMode = "Auto") {
  return {
    ...lead,
    id: lead.id || crypto.randomUUID(),
    assignedBrokerId: null,
    assignedBrokerName: "Pending",
    assignmentStatus: "Pending",
    status: "Pending",
    statusNote: "Pending - no suitable broker has capacity for this language.",
    assignmentMode,
    timestamp: lead.timestamp || new Date().toISOString(),
  };
}

function assignedLead(lead, broker, assignmentMode = "Auto") {
  return {
    ...lead,
    id: lead.id || crypto.randomUUID(),
    assignedBrokerId: broker.id,
    assignedBrokerName: broker.name,
    assignmentStatus: "Assigned",
    status: "Assigned",
    statusNote: `Assigned to ${broker.name}.`,
    assignmentMode,
    timestamp: lead.timestamp || new Date().toISOString(),
  };
}

export function assignLeadManually(lead, brokerId, brokers, leads) {
  const eligibleBroker = getEligibleBrokers(lead, brokers, leads).find((broker) => broker.id === brokerId);

  if (!eligibleBroker) {
    return pendingLead(lead, "Manual");
  }

  return assignedLead(lead, eligibleBroker, "Manual");
}

export function assignLeadAutomatically(lead, brokers, leads) {
  const eligibleBrokers = getEligibleBrokers(lead, brokers, leads);

  // Assignment logic:
  // 1. Only brokers with the same language can receive the lead.
  // 2. Inactive brokers and brokers at fixed capacity 5 are excluded.
  // 3. Prefer Available brokers, which means they currently have 0-2 assigned leads.
  // 4. Assign to the lowest lead count.
  // 5. When workloads tie, prefer the broker with the best conversion rate.
  // 6. If conversion also ties, choose randomly for fair distribution.
  const preferredBrokers = eligibleBrokers.filter((broker) => getBrokerStatus(broker.id, leads, broker) === "Available");
  const candidates = preferredBrokers.length > 0 ? preferredBrokers : eligibleBrokers;

  if (candidates.length === 0) {
    return pendingLead(lead, "Auto");
  }

  const lowestCount = Math.min(...candidates.map((broker) => getBrokerLeadCount(broker.id, leads)));
  const workloadTies = candidates.filter((broker) => getBrokerLeadCount(broker.id, leads) === lowestCount);
  const bestConversion = Math.max(...workloadTies.map((broker) => getBrokerConversionRate(broker.id, leads)));
  const conversionTies = workloadTies.filter((broker) => getBrokerConversionRate(broker.id, leads) === bestConversion);
  const selectedBroker = conversionTies[Math.floor(Math.random() * conversionTies.length)];

  return assignedLead(lead, selectedBroker, "Auto");
}

export function shuffleAllLeads(leads, brokers) {
  return leads.reduce((nextLeads, lead) => {
    const clearedLead = {
      ...lead,
      assignedBrokerId: null,
      assignedBrokerName: "Pending",
      assignmentStatus: "Pending",
      status: "Pending",
      statusNote: "Pending - waiting for reassignment.",
    };

    return [
      ...nextLeads,
      assignLeadAutomatically(clearedLead, brokers, nextLeads),
    ];
  }, []);
}

export function recomputeBrokerCounts(brokers, leads) {
  return brokers.map((broker) => ({
    ...broker,
    assignedCount: getBrokerLeadCount(broker.id, leads),
    maxCapacity: BROKER_CAPACITY,
  }));
}
