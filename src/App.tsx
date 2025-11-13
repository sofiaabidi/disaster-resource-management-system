import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { EmergencyAlerts } from "./components/EmergencyAlerts";
import { ResourceManagement } from "./components/ResourceManagement";
import { IncidentReporting } from "./components/IncidentReporting";
import { ResponseTeams } from "./components/ResponseTeams";
import { EvacuationPlans } from "./components/EvacuationPlans";
import { WeatherMonitoring } from "./components/WeatherMonitoring";
import { CommunicationCenter } from "./components/CommunicationCenter";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage("dashboard");
    sessionStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onPageChange={setCurrentPage} />;
      case "alerts":
        return <EmergencyAlerts />;
      case "resources":
        return <ResourceManagement />;
      case "incidents":
        return <IncidentReporting />;
      case "teams":
        return <ResponseTeams />;
      case "evacuation":
        return <EvacuationPlans />;
      case "weather":
        return <WeatherMonitoring />;
      case "communication":
        return <CommunicationCenter />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}