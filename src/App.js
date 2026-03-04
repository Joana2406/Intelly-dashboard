import { AppProvider, useApp } from "./context/AppContext";
import Sidebar     from "./components/Sidebar";
import Header      from "./components/Header";
import StatsCards  from "./components/StatsCard";
import Calendar    from "./components/Calendar";
import PatientList from "./components/PatientList";
import Timeline    from "./components/Timeline";
import {
  SchedulePage, PatientsPage, StatisticsPage,
  EducationPage, MyArticlesPage, ChatsPage,
  BillingPage, DocumentsPage, SettingsPage,
} from "./pages";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }
  body { font-family: 'DM Sans', sans-serif; background: #dedad2; overflow: hidden; }
  input, button { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

  /* Desktop sidebar always visible */
  .sidebar-desktop { display: flex !important; }

  /* Tablet ≤1024px: hide desktop sidebar, hamburger takes over */
  @media (max-width: 1024px) {
    .sidebar-desktop { display: none !important; }
  }

  /* Tablet ≤900px: stack layout vertically */
  @media (max-width: 900px) {
    body { overflow: auto; }
    .app-shell { overflow: auto !important; }
    .content-body { flex-direction: column !important; overflow: visible !important; }
    .left-panel { overflow: visible !important; padding-right: 0 !important; }
    .right-panel { width: 100% !important; flex-direction: row !important; flex-wrap: wrap; }
    .right-panel > * { flex: 1 1 220px; }
  }

  /* Mobile ≤600px */
  @media (max-width: 600px) {
    .right-panel { flex-direction: column !important; }
    .stats-grid-2col { grid-template-columns: 1fr !important; }
    .patients-grid { grid-template-columns: 1fr !important; }
  }
`;

export default function App() {
  return (
    <AppProvider>
      <style>{GLOBAL_CSS}</style>
      <Shell />
    </AppProvider>
  );
}

function Shell() {
  const { activeNav } = useApp();

  const PAGE_MAP = {
    "Schedule":             <SchedulePage />,
    "Patients":             <PatientsPage />,
    "Statistics & reports": <StatisticsPage />,
    "Education":            <EducationPage />,
    "My articles":          <MyArticlesPage />,
    "Chats & calls":        <ChatsPage />,
    "Billing":              <BillingPage />,
    "Documents base":       <DocumentsPage />,
    "Settings":             <SettingsPage />,
  };

  const isDashboard = activeNav === "Dashboard";

  return (
    <div className="app-shell" style={styles.shell}>

      {/* Desktop sidebar — hidden via CSS on small screens */}
      <div className="sidebar-desktop" style={styles.sidebarWrap}>
        <Sidebar />
      </div>

      {/* Main area */}
      <div style={styles.main}>
        <Header />

        <div className="content-body" style={styles.body}>

          {/* Left panel */}
          <div className="left-panel" style={styles.left}>
            {isDashboard ? (
              <>
                <div style={styles.greeting}>
                  <h1 style={styles.greetTitle}>Good morning, Dr. </h1>
                  <p style={styles.greetSub}>
                    Intelly wishes you a good and productive day. 45 patients waiting
                    for your treatment today. You also have one live event in your calendar today.
                  </p>
                </div>
                <StatsCards />
                <PatientList />
              </>
            ) : (
              PAGE_MAP[activeNav] ?? (
                <div style={styles.comingSoon}>
                  <span style={{ fontSize: 48 }}>🚧</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{activeNav}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>Coming soon.</span>
                </div>
              )
            )}
          </div>

          {/* Right panel — dashboard only */}
          {isDashboard && (
            <div className="right-panel" style={styles.right}>
              <Calendar />
              <Timeline />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#f7f4ee",
    overflow: "hidden",
    position: "relative",
  },
  sidebarWrap: {
    flexShrink: 0,
    height: "100%",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    padding: "0 20px 16px",
    minHeight: 0,
  },
  left: {
    flex: 1,
    overflowY: "auto",
    paddingRight: 14,
    scrollbarWidth: "none",
    minWidth: 0,
  },
  right: {
    width: 230,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    scrollbarWidth: "none",
  },
  greeting:   { padding: "14px 0 10px" },
  greetTitle: { fontSize: 22, fontWeight: 700, color: "#1a1a1a" },
  greetSub:   { fontSize: 12, color: "#888", marginTop: 3, lineHeight: 1.55 },
  comingSoon: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", height: 300, gap: 8,
  },
};