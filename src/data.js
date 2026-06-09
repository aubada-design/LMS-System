export const LANGUAGES = ["Arabic", "English", "Russian", "Hindi", "Chinese"];

export const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Office"];

export const LEAD_SOURCES = ["Website", "WhatsApp", "Portal", "Referral", "Walk-in", "Instagram"];

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "No Answer",
  "Viewing Scheduled",
  "Viewing Done",
  "Interested",
  "Negotiating",
  "Closed",
  "Lost",
];

export const AREAS = [
  "Downtown",
  "Marina",
  "Business Bay",
  "Palm District",
  "Jumeirah",
  "Creek Harbour",
  "City Walk",
  "Meydan",
];

const broker = (id, name, language) => ({
  id,
  name,
  language,
  availability: "Available",
  active: true,
  assignedCount: 0,
  maxCapacity: 5,
});

export const INITIAL_BROKERS = [
  broker("ar-1", "Omar Haddad", "Arabic"),
  broker("ar-2", "Layla Mansour", "Arabic"),
  broker("ar-3", "Karim Nasser", "Arabic"),
  broker("ar-4", "Nadia Saleh", "Arabic"),
  broker("en-1", "Emma Collins", "English"),
  broker("en-2", "Noah Bennett", "English"),
  broker("en-3", "Sophie Grant", "English"),
  broker("en-4", "James Carter", "English"),
  broker("ru-1", "Anastasia Petrova", "Russian"),
  broker("ru-2", "Mikhail Sokolov", "Russian"),
  broker("ru-3", "Irina Volkova", "Russian"),
  broker("ru-4", "Dmitry Orlov", "Russian"),
  broker("hi-1", "Aarav Mehta", "Hindi"),
  broker("hi-2", "Priya Kapoor", "Hindi"),
  broker("hi-3", "Rohan Sharma", "Hindi"),
  broker("hi-4", "Neha Iyer", "Hindi"),
  broker("zh-1", "Li Wei", "Chinese"),
  broker("zh-2", "Mei Chen", "Chinese"),
  broker("zh-3", "Jun Zhang", "Chinese"),
  broker("zh-4", "Lin Wang", "Chinese"),
];

export const normalizeBroker = (brokerRecord) => ({
  ...brokerRecord,
  availability: brokerRecord.availability || "Available",
  active: brokerRecord.active ?? true,
  assignedCount: brokerRecord.assignedCount ?? 0,
  maxCapacity: 5,
});

export const normalizeBrokers = (brokers) => brokers.map(normalizeBroker);

export const normalizeLead = (leadRecord) => ({
  ...leadRecord,
  email: leadRecord.email || "",
  source: leadRecord.source || leadRecord.leadSource || "Website",
  notes: leadRecord.notes || "",
  leadStatus: leadRecord.leadStatus || "New",
  assignmentStatus: leadRecord.assignmentStatus || leadRecord.status || "Pending",
  status: leadRecord.status || leadRecord.assignmentStatus || "Pending",
  assignmentMode: leadRecord.assignmentMode || "Auto",
  activity: leadRecord.activity || [
    `${new Date(leadRecord.timestamp || Date.now()).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    })} Lead created`,
  ],
});

export const normalizeLeads = (leads) => leads.map(normalizeLead);

export const DEMO_NAMES = [
  "Maya Stone",
  "Ali Rahman",
  "Victor Kuznetsov",
  "Sara Kapoor",
  "Chen Yu",
  "Daniel Reed",
  "Fatima Noor",
  "Elena Morozova",
  "Arjun Nair",
  "Grace Liu",
  "Hassan Malik",
  "Olivia Brooks",
];
