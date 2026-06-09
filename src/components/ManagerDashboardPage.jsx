import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BROKER_CAPACITY,
  getBrokerLeadCount,
  getBrokerStatus,
  recomputeBrokerCounts,
} from "../assignment.js";
import { INITIAL_BROKERS, LANGUAGES, LEAD_SOURCES, LEAD_STATUSES } from "../data.js";
import { storage } from "../storage.js";
import { BarChart, DonutChart, LineChart } from "./Charts.jsx";
import ManagerLayout from "./ManagerLayout.jsx";

const colors = ["#D6F56A", "#A7F3D0", "#FDBA74", "#93C5FD", "#FCA5A5", "#C4B5FD"];

function countBy(items, keyGetter, labels) {
  return labels.map((label, index) => ({
    label,
    value: items.filter((item) => keyGetter(item) === label).length,
    color: colors[index % colors.length],
  }));
}

function monthLabel(offset) {
  const date = new Date();
  date.setMonth(date.getMonth() - offset);
  return date.toLocaleString("en", { month: "short" });
}

export default function ManagerDashboardPage() {
  const leads = storage.getLeads();
  const brokers = recomputeBrokerCounts(storage.getBrokers(INITIAL_BROKERS), leads);

  const stats = useMemo(() => {
    const brokerStatuses = brokers.map((broker) => getBrokerStatus(broker.id, leads, broker));
    return [
      { label: "Total Leads", value: leads.length },
      { label: "New Leads", value: leads.filter((lead) => lead.leadStatus === "New").length },
      { label: "Active Leads", value: leads.filter((lead) => !["Closed", "Lost"].includes(lead.leadStatus)).length },
      { label: "Closed Leads", value: leads.filter((lead) => lead.leadStatus === "Closed").length },
      { label: "Available Brokers", value: brokerStatuses.filter((status) => status === "Available").length },
      { label: "Busy Brokers", value: brokerStatuses.filter((status) => status === "Busy").length },
      { label: "Full Brokers", value: brokerStatuses.filter((status) => status === "Full").length },
    ];
  }, [brokers, leads]);

  const statusData = countBy(leads, (lead) => lead.leadStatus, LEAD_STATUSES);
  const sourceData = countBy(leads, (lead) => lead.source, LEAD_SOURCES);
  const languageData = countBy(leads, (lead) => lead.language, LANGUAGES);
  const workloadData = brokers.map((broker) => ({
    label: broker.name.split(" ")[0],
    value: getBrokerLeadCount(broker.id, leads),
  }));
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const offset = 5 - index;
    const label = monthLabel(offset);
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    return {
      label,
      value: leads.filter((lead) => {
        const leadDate = new Date(lead.timestamp);
        return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
      }).length,
    };
  });
  const assignmentTrend = monthlyData.map((item, index) => ({ ...item, value: item.value + index + 1 }));

  return (
    <ManagerLayout title="Dashboard" kicker="Management overview">
      <section className="manager-kpi-grid">
        {stats.map((stat) => (
          <article className="manager-kpi-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="chart-grid">
        <article className="chart-card">
          <h2>Leads By Status</h2>
          <DonutChart items={statusData} />
        </article>
        <article className="chart-card">
          <h2>Leads By Source</h2>
          <BarChart items={sourceData} />
        </article>
        <article className="chart-card">
          <h2>Broker Workload</h2>
          <BarChart items={workloadData} />
        </article>
        <article className="chart-card">
          <h2>Monthly Lead Growth</h2>
          <LineChart items={monthlyData} />
        </article>
        <article className="chart-card">
          <h2>Language Distribution</h2>
          <DonutChart items={languageData} />
        </article>
        <article className="chart-card">
          <h2>Lead Assignment Trend</h2>
          <LineChart items={assignmentTrend} filled />
        </article>
      </section>

      <aside className="quick-action-panel" aria-label="Quick actions">
        <Link className="button primary" to="/manager/leads">Assign Lead</Link>
        <Link className="button subtle" to="/manager/brokers">Add Broker</Link>
      </aside>
    </ManagerLayout>
  );
}
