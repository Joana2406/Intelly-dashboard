import { useState, useRef, useEffect } from "react";
import { Search, Users, Bell, Settings, Menu, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

const FILTERS = ["Patients", "Education", "Prescriptions", "Test results"];

export default function Header() {
  const {
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    setActiveNav,
    sidebarOpen,  setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed,
    notifications, unreadCount, markAllRead,
  } = useApp();

  const [showNotifs,   setShowNotifs]   = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notifsRef   = useRef(null);
  const profileRef  = useRef(null);
  const settingsRef = useRef(null);

  // Close any open dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current   && !notifsRef.current.contains(e.target))   setShowNotifs(false);
      if (profileRef.current  && !profileRef.current.contains(e.target))  setShowProfile(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Detect screen width to decide what hamburger does
  const isDesktop = () => window.innerWidth > 1024;

  const handleHamburger = () => {
    if (isDesktop()) {
      // Toggle desktop sidebar collapse
      setSidebarCollapsed(c => !c);
    } else {
      // Open mobile drawer
      setSidebarOpen(o => !o);
    }
  };

  const handleFilterClick = (f) => {
    setActiveFilter(f);
    if (f === "Patients")      setActiveNav("Patients");
    if (f === "Education")     setActiveNav("Education");
    if (f === "Prescriptions") setActiveNav("Patients");
    if (f === "Test results")  setActiveNav("Patients");
  };

  return (
    <div style={styles.topbar}>

      {/* ── Hamburger: collapses desktop sidebar / opens mobile drawer ── */}
      <button
        style={styles.menuBtn}
        onClick={handleHamburger}
        title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
      >
        <Menu size={18} />
      </button>

      {/* ── Search bar ── */}
      <div style={styles.searchWrap}>
        <Search size={13} color="#aaa" />
        <input
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button style={styles.clearBtn} onClick={() => setSearchQuery("")}>
            <X size={12} />
          </button>
        )}
        <div style={styles.tags}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={{ ...styles.tag, ...(activeFilter === f ? styles.tagActive : {}) }}
              onClick={() => handleFilterClick(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Profile ── */}
      <div style={styles.iconWrap} ref={profileRef}>
        <button
          style={styles.iconBtn}
          onClick={() => { setShowProfile(p => !p); setShowNotifs(false); setShowSettings(false); }}
        >
          <Users size={14} />
        </button>
        {showProfile && (
          <div style={styles.dropdown}>
            <div style={styles.dropHeader}>
              <div style={styles.avatar}>OL</div>
              <div>
                <div style={styles.dropName}>Dr. Olivia Lee</div>
                <div style={styles.dropSub}>olivia@intelly.health</div>
              </div>
            </div>
            <DropItem onClick={() => { setShowProfile(false); setActiveNav("Settings"); }}>My Profile</DropItem>
            <DropItem onClick={() => { setShowProfile(false); setActiveNav("Settings"); }}>Preferences</DropItem>
            <div style={styles.dropDivider} />
            <DropItem danger>Log out</DropItem>
          </div>
        )}
      </div>

      {/* ── Notifications ── */}
      <div style={styles.iconWrap} ref={notifsRef}>
        <button
          style={styles.iconBtn}
          onClick={() => { setShowNotifs(p => !p); setShowProfile(false); setShowSettings(false); }}
        >
          <Bell size={14} />
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </button>
        {showNotifs && (
          <div style={{ ...styles.dropdown, width: 280 }}>
            <div style={styles.dropRow}>
              <strong style={{ fontSize: 13 }}>Notifications</strong>
              <button style={styles.markAllBtn} onClick={markAllRead}>
                <Check size={11} /> Mark all read
              </button>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{ ...styles.notifItem, ...(n.read ? {} : styles.notifUnread) }}>
                {!n.read && <div style={styles.notifDot} />}
                <span style={{ fontSize: 12, color: "#333" }}>{n.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Settings ── */}
      <div style={styles.iconWrap} ref={settingsRef}>
        <button
          style={styles.iconBtn}
          onClick={() => { setShowSettings(p => !p); setShowNotifs(false); setShowProfile(false); }}
        >
          <Settings size={14} />
        </button>
        {showSettings && (
          <div style={styles.dropdown}>
            <div style={{ padding: "10px 14px 6px", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
              Quick settings
            </div>
            <DropItem onClick={() => { setShowSettings(false); setActiveNav("Settings"); }}>Account settings</DropItem>
            <DropItem onClick={() => { setShowSettings(false); setActiveNav("Settings"); }}>Appearance</DropItem>
            <DropItem onClick={() => { setShowSettings(false); setActiveNav("Settings"); }}>Notifications</DropItem>
            <DropItem onClick={() => { setShowSettings(false); setActiveNav("Settings"); }}>Privacy</DropItem>
          </div>
        )}
      </div>
    </div>
  );
}

function DropItem({ children, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{ ...styles.dropItem, ...(danger ? styles.dropDanger : {}) }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? "#fff5f5" : "#f7f4ee"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {children}
    </div>
  );
}

const styles = {
  topbar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "14px 20px 0", flexShrink: 0,
  },
  menuBtn: {
    background: "transparent", border: "none", cursor: "pointer",
    color: "#555", padding: 6, borderRadius: 8,
    display: "flex", alignItems: "center", flexShrink: 0,
    transition: "color .15s",
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fff", border: "1.5px solid #e0ddd7",
    borderRadius: 999, padding: "6px 12px", flex: 1, minWidth: 0,
  },
  searchInput: {
    border: "none", outline: "none", fontSize: 13,
    color: "#1a1a1a", background: "transparent",
    flex: "0 0 70px", minWidth: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  clearBtn: {
    background: "transparent", border: "none",
    cursor: "pointer", color: "#aaa", padding: 0, display: "flex", flexShrink: 0,
  },
  tags: {
    marginLeft: "auto", display: "flex", gap: 5,
    alignItems: "center", flexWrap: "wrap",
  },
  tag: {
    background: "transparent", border: "1.5px solid #ddd", color: "#666",
    borderRadius: 999, padding: "2px 9px", fontSize: 11, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
    whiteSpace: "nowrap",
  },
  tagActive: {
    background: "#1a1a1a", color: "#fff", border: "1.5px solid #1a1a1a",
  },

  iconWrap: { position: "relative", flexShrink: 0 },
  iconBtn: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#fff", border: "1.5px solid #e0ddd7",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#555", position: "relative",
    transition: "background .12s",
  },
  badge: {
    position: "absolute", top: -3, right: -3,
    background: "#f87171", color: "#fff", borderRadius: "50%",
    width: 16, height: 16, fontSize: 9, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  dropdown: {
    position: "absolute", right: 0, top: "calc(100% + 8px)",
    background: "#fff", border: "1.5px solid #e0ddd7",
    borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    zIndex: 200, minWidth: 200, overflow: "hidden",
  },
  dropHeader: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 14px", borderBottom: "1px solid #f0ede6",
  },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#1a1a1a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  dropName: { fontSize: 13, fontWeight: 700, color: "#1a1a1a" },
  dropSub:  { fontSize: 11, color: "#aaa" },
  dropItem: {
    padding: "9px 14px", fontSize: 13, color: "#444",
    cursor: "pointer", transition: "background .12s",
  },
  dropDanger: { color: "#dc2626" },
  dropDivider: { height: 1, background: "#f0ede6", margin: "4px 0" },

  dropRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px 8px", borderBottom: "1px solid #f0ede6",
  },
  markAllBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "transparent", border: "none", fontSize: 11,
    color: "#888", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  notifItem: {
    display: "flex", alignItems: "flex-start", gap: 8,
    padding: "10px 14px", borderBottom: "1px solid #f7f4ee",
  },
  notifUnread: { background: "#fefaf4" },
  notifDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#fb923c", flexShrink: 0, marginTop: 3,
  },
};