import { useState } from "react";
import { useApp } from "../context/AppContext";

const FILTERS = ["All", "Clinic", "Video calls", "Chat"];

function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
}

function formatMonthDay(dateStr) {
  const [y,m,d] = dateStr.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m-1]} ${d}`;
}

export default function Timeline() {
  const { events } = useApp();
  const [filter, setFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const today = todayStr();
  const todayEvents = events.filter(e => e.date === today);
  // If no events today, show nearest upcoming
  const displayDate = todayEvents.length > 0 ? today : (events[0]?.date ?? today);
  const displayEvents = events.filter(e => e.date === displayDate);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div style={styles.widget}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.date}>{formatMonthDay(displayDate)}</div>
          <div style={styles.sub}>Today's timeline</div>
        </div>
        <div style={{ position:"relative" }}>
          <button style={styles.filterBtn} onClick={() => setShowFilter(p => !p)}>
            {filter} ▾
          </button>
          {showFilter && (
            <div style={styles.filterDrop}>
              {FILTERS.map(f => (
                <div key={f}
                  style={{ ...styles.filterItem, ...(filter===f ? styles.filterActive : {}) }}
                  onClick={() => { setFilter(f); setShowFilter(false); }}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Events */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        {displayEvents.length === 0 ? (
          <div style={styles.empty}>No events scheduled</div>
        ) : (
          displayEvents.map((e, i) => {
            // Determine if event is "active" (current hour roughly)
            const eventHour = parseInt((e.time || "00:00").split(":")[0]) || (8 + i);
            const eventMin  = parseInt((e.time || "00:00").split(":")[1]) || 0;
            const eventMinutes = eventHour * 60 + eventMin;
            const isActive = Math.abs(eventMinutes - nowMinutes) < 60;

            return (
              <div key={e.id} style={styles.item}>
                <span style={styles.time}>{e.time || `0${8+i}:00`}</span>
                <div style={{ ...styles.dot, background: e.color }}/>
                <div style={{ ...styles.content, ...(isActive ? styles.contentActive : {}) }}>
                  <div style={styles.title}>{e.title}</div>
                  {e.location && <div style={styles.loc}>{e.location}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button style={styles.viewAllBtn}>View all details</button>
    </div>
  );
}

const styles = {
  widget: {
    background:"#fff", border:"1.5px solid #e0ddd7",
    borderRadius:16, padding:14, flex:1,
    display:"flex", flexDirection:"column", minHeight:0,
  },
  header: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 },
  date:   { fontSize:13, fontWeight:700, color:"#1a1a1a" },
  sub:    { fontSize:10, color:"#aaa", marginTop:1 },
  filterBtn: {
    fontSize:10, background:"#f0ede6", color:"#555",
    padding:"3px 8px", borderRadius:8, cursor:"pointer",
    fontWeight:600, border:"none", fontFamily:"'DM Sans',sans-serif",
  },
  filterDrop: {
    position:"absolute", right:0, top:"calc(100% + 4px)",
    background:"#fff", border:"1.5px solid #e0ddd7",
    borderRadius:10, zIndex:100, overflow:"hidden", minWidth:120,
    boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
  },
  filterItem: {
    padding:"7px 12px", fontSize:12, cursor:"pointer",
    color:"#555", transition:"background .12s",
  },
  filterActive: { background:"#f7f4ee", color:"#1a1a1a", fontWeight:600 },

  item: { display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" },
  time: {
    fontSize:10, color:"#aaa", width:34, flexShrink:0,
    paddingTop:3, fontFamily:"'DM Mono',monospace",
  },
  dot: { width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0 },
  content: { flex:1, background:"#f7f4ee", borderRadius:10, padding:"6px 8px" },
  contentActive: { background:"#fde68a" },
  title: { fontSize:11, fontWeight:600, color:"#1a1a1a" },
  loc:   { fontSize:10, color:"#888", marginTop:1 },
  empty: { fontSize:12, color:"#aaa", textAlign:"center", padding:"20px 0" },

  viewAllBtn: {
    width:"100%", background:"#1a1a1a", color:"#fff", border:"none",
    borderRadius:10, padding:8, fontSize:11, fontWeight:600,
    fontFamily:"'DM Sans',sans-serif", cursor:"pointer", marginTop:8, flexShrink:0,
  },
};