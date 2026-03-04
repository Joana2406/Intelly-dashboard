import {
  LayoutDashboard, Calendar, Users, BarChart2,
  BookOpen, FileText, MessageSquare, CreditCard,
  Database, Settings, LogOut, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV_GENERAL = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Calendar,        label: "Schedule"  },
  { icon: Users,           label: "Patients"  },
  { icon: BarChart2,       label: "Statistics & reports" },
  { icon: BookOpen,        label: "Education" },
  { icon: FileText,        label: "My articles" },
];
const NAV_TOOLS = [
  { icon: MessageSquare, label: "Chats & calls"  },
  { icon: CreditCard,    label: "Billing"        },
  { icon: Database,      label: "Documents base" },
  { icon: Settings,      label: "Settings"       },
];

export default function Sidebar() {
  const {
    activeNav, setActiveNav,
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed,
  } = useApp();

  const navigate = (label) => {
    setActiveNav(label);
    setSidebarOpen(false); // close mobile drawer on nav
  };

  // ── Shared inner content ──────────────────────────────────────────────────
  const SidebarContent = ({ isDrawer }) => (
    <div style={styles.inner}>
      {/* Logo row */}
      <div style={styles.logoRow}>
        {!sidebarCollapsed && (
          <div style={styles.logo}>
            <div style={styles.logoDot} />
            intelly
          </div>
        )}
        {/* On drawer → X button. On desktop → collapse arrow */}
        {isDrawer ? (
          <button style={styles.iconBtn} onClick={() => setSidebarOpen(false)}>
            <X size={15} />
          </button>
        ) : (
          <button
            style={{ ...styles.iconBtn, marginLeft: sidebarCollapsed ? "auto" : undefined }}
            onClick={() => setSidebarCollapsed(c => !c)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* Nav sections */}
      {!sidebarCollapsed && <span style={styles.navLabel}>General</span>}
      {NAV_GENERAL.map(n => (
        <NavItem
          key={n.label}
          Icon={n.icon}
          label={n.label}
          active={activeNav === n.label}
          collapsed={!isDrawer && sidebarCollapsed}
          onClick={() => navigate(n.label)}
        />
      ))}

      {!sidebarCollapsed && <span style={styles.navLabel}>Tools</span>}
      {sidebarCollapsed && !isDrawer && <div style={styles.divider} />}
      {NAV_TOOLS.map(n => (
        <NavItem
          key={n.label}
          Icon={n.icon}
          label={n.label}
          active={activeNav === n.label}
          collapsed={!isDrawer && sidebarCollapsed}
          onClick={() => navigate(n.label)}
        />
      ))}

      {/* Logout */}
      <div style={{ ...styles.logout, justifyContent: (!isDrawer && sidebarCollapsed) ? "center" : undefined }}>
        <LogOut size={14} />
        {(isDrawer || !sidebarCollapsed) && " Log out"}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop static sidebar ── */}
      <div
        className="sidebar-desktop"
        style={{
          ...styles.static,
          width: sidebarCollapsed ? 56 : 190,
          transition: "width 0.22s ease",
        }}
      >
        <SidebarContent isDrawer={false} />
      </div>

      {/* ── Mobile drawer ── */}
      {sidebarOpen && (
        <>
          <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
          <div style={styles.drawer}>
            <SidebarContent isDrawer={true} />
          </div>
        </>
      )}
    </>
  );
}

function NavItem({ Icon, label, active, collapsed, onClick }) {
  return (
    <div
      onClick={onClick}
      title={collapsed ? label : undefined}
      style={{
        ...styles.navItem,
        ...(active ? styles.navActive : {}),
        justifyContent: collapsed ? "center" : undefined,
        padding: collapsed ? "8px 0" : "8px 10px",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = "#2a2a2a";
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#aaa";
        }
      }}
    >
      <Icon size={15} />
      {!collapsed && <span>{label}</span>}
    </div>
  );
}

const styles = {
  static: {
    height: "100%",
    background: "#1a1a1a",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.45)", zIndex: 100,
  },
  drawer: {
    position: "fixed", top: 0, left: 0,
    width: 210, height: "100%",
    background: "#1a1a1a", zIndex: 101,
    display: "flex", flexDirection: "column",
    boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
  },
  inner: {
    display: "flex", flexDirection: "column",
    padding: "18px 10px", height: "100%", color: "#fff",
    overflowY: "auto", overflowX: "hidden",
  },
  logoRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 24, gap: 8,
  },
  logo: {
    display: "flex", alignItems: "center",
    gap: 8, fontSize: 18, fontWeight: 700, color: "#fff",
    whiteSpace: "nowrap", overflow: "hidden",
  },
  logoDot: { width: 8, height: 8, background: "#fb923c", borderRadius: "50%", flexShrink: 0 },
  iconBtn: {
    background: "transparent", border: "none",
    color: "#666", cursor: "pointer", padding: 4,
    display: "flex", alignItems: "center",
    borderRadius: 6, flexShrink: 0,
    transition: "color .15s",
  },
  navLabel: {
    fontSize: 10, textTransform: "uppercase", color: "#555",
    letterSpacing: ".08em", margin: "12px 0 4px 10px", fontWeight: 600,
    whiteSpace: "nowrap",
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    borderRadius: 10, fontSize: 13, color: "#aaa",
    cursor: "pointer", transition: "background .15s, color .15s",
    fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap",
  },
  navActive: { background: "#2f2f2f", color: "#fff" },
  divider: { height: 1, background: "#2a2a2a", margin: "8px 0" },
  logout: {
    marginTop: "auto", display: "flex", alignItems: "center",
    gap: 10, padding: "8px 10px", borderRadius: 10,
    fontSize: 13, color: "#555", cursor: "pointer",
  },
};