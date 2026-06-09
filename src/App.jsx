import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BrokerStatusPage from "./components/BrokerStatusPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ActivityLogPage from "./components/ActivityLogPage.jsx";
import LeadStatusPage from "./components/LeadStatusPage.jsx";
import ManagerBrokersPage from "./components/ManagerBrokersPage.jsx";
import ManagerDashboardPage from "./components/ManagerDashboardPage.jsx";
import ManagerLeadsPage from "./components/ManagerLeadsPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";

function RequireManager({ children }) {
  const [isLoggedIn] = useState(() => sessionStorage.getItem("manager_logged_in") === "true");

  if (!isLoggedIn) {
    return <Navigate to="/manager-login" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("lms:theme") || "light";
    document.documentElement.dataset.theme = storedTheme;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/brokers" element={<BrokerStatusPage />} />
      <Route path="/broker-status" element={<Navigate to="/brokers" replace />} />
      <Route path="/demo" element={<Navigate to="/brokers" replace />} />
      <Route path="/leads" element={<LeadStatusPage />} />
      <Route path="/lead-status" element={<Navigate to="/leads" replace />} />
      <Route path="/manager-login" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/manager-login" replace />} />
      <Route
        path="/manager"
        element={(
          <RequireManager>
            <ManagerDashboardPage />
          </RequireManager>
        )}
      />
      <Route
        path="/manager/dashboard"
        element={(
          <RequireManager>
            <ManagerDashboardPage />
          </RequireManager>
        )}
      />
      <Route
        path="/manager/brokers"
        element={(
          <RequireManager>
            <ManagerBrokersPage />
          </RequireManager>
        )}
      />
      <Route
        path="/manager/leads"
        element={(
          <RequireManager>
            <ManagerLeadsPage />
          </RequireManager>
        )}
      />
      <Route
        path="/manager/activity"
        element={(
          <RequireManager>
            <ActivityLogPage />
          </RequireManager>
        )}
      />
      <Route
        path="/manager/settings"
        element={(
          <RequireManager>
            <SettingsPage />
          </RequireManager>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
