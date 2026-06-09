import { useEffect, useState } from "react";
import BrokerStatusPage from "./components/BrokerStatusPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ActivityLogPage from "./components/ActivityLogPage.jsx";
import LeadStatusPage from "./components/LeadStatusPage.jsx";
import ManagerBrokersPage from "./components/ManagerBrokersPage.jsx";
import ManagerDashboardPage from "./components/ManagerDashboardPage.jsx";
import ManagerLeadsPage from "./components/ManagerLeadsPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import { getCurrentRoute, navigateToRoute } from "./routing.js";

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute());

  useEffect(() => {
    const storedTheme = localStorage.getItem("lms:theme") || "light";
    document.documentElement.dataset.theme = storedTheme;
  }, []);

  useEffect(() => {
    const handleLocationChange = () => setRoute(getCurrentRoute());

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const isManagerRoute = route.startsWith("/manager");
    const isLoggedIn = sessionStorage.getItem("manager_logged_in") === "true";

    if (isManagerRoute && !isLoggedIn) {
      navigateToRoute("/login");
      setRoute("/login");
    }
  }, [route]);

  if (route === "/login") return <LoginPage />;
  if (route === "/demo" || route === "/broker-status" || route === "/brokers") return <BrokerStatusPage />;
  if (route === "/lead-status" || route === "/leads") return <LeadStatusPage />;
  if (route === "/manager" || route === "/manager/dashboard") return <ManagerDashboardPage />;
  if (route === "/manager/brokers") return <ManagerBrokersPage />;
  if (route === "/manager/leads") return <ManagerLeadsPage />;
  if (route === "/manager/activity") return <ActivityLogPage />;
  if (route === "/manager/settings") return <SettingsPage />;

  return <LandingPage />;
}
