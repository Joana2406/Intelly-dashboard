import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeNav,       setActiveNav]       = useState("Dashboard");
  const [searchQuery,     setSearchQuery]     = useState("");
  const [activeFilter,    setActiveFilter]    = useState("Patients");

  // sidebarOpen  → mobile/tablet drawer (starts closed)
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  // sidebarCollapsed → desktop sidebar toggle (starts visible = false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Patient pre-loaded into Schedule form
  const [scheduledPatient, setScheduledPatient] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Taigo Wilkinson check-in at 9:15 AM", read: false },
    { id: 2, text: "Team daily planning in 30 min",        read: false },
    { id: 3, text: "New lab results for Amy White",        read: true  },
  ]);

  const [events, setEvents] = useState([
    { id: 1, date: "2024-05-15", title: "Emergency visit",           location: "West camp, Room 312",    color: "#fbbf24" },
    { id: 2, date: "2024-05-15", title: "Diagnostic test",           location: "East camp, Lab floor 8", color: "#a78bfa" },
    { id: 3, date: "2024-05-15", title: "Team daily planning",       location: "East camp, Room 205",    color: "#fb923c" },
    { id: 4, date: "2024-05-18", title: "Follow-up: Samantha Williams", location: "Clinic Room 4",       color: "#3b82f6" },
    { id: 5, date: "2024-05-22", title: "Board meeting",             location: "Conference Room A",      color: "#10b981" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const addEvent = (event) =>
    setEvents(prev => [...prev, { ...event, id: Date.now() }]);

  // Navigate to Schedule with a patient pre-filled
  const scheduleAppointment = (patient) => {
    setScheduledPatient(patient);
    setActiveNav("Schedule");
    setSidebarOpen(false);
  };

  return (
    <AppContext.Provider value={{
      activeNav,        setActiveNav,
      searchQuery,      setSearchQuery,
      activeFilter,     setActiveFilter,
      sidebarOpen,      setSidebarOpen,
      sidebarCollapsed, setSidebarCollapsed,
      scheduledPatient, setScheduledPatient, scheduleAppointment,
      notifications, unreadCount, markAllRead,
      events, addEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);