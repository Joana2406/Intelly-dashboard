import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const DAYS  = ["MO","TU","WE","TH","FR","SA","SU"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const EVENT_COLORS = ["#fbbf24","#fb923c","#f87171","#a78bfa","#3b82f6","#10b981"];

function getCalendarMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert Sun=0 to Mon=0
  const startOffset = (firstDay + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  // chunk into weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function fmt(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export default function CalendarWidget() {
  const { events, addEvent } = useApp();
  const today = new Date();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:"", location:"", color: EVENT_COLORS[0] });

  const weeks = getCalendarMatrix(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleAddEvent = () => {
    if (!form.title.trim()) return;
    const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;
    addEvent({ date: dateStr, title: form.title, location: form.location, color: form.color });
    setForm({ title:"", location:"", color: EVENT_COLORS[0] });
    setShowModal(false);
  };

  // Dots for days that have events
  const eventDates = new Set(
    events
      .filter(e => {
        const [y,m] = e.date.split("-").map(Number);
        return y === viewYear && m === viewMonth + 1;
      })
      .map(e => Number(e.date.split("-")[2]))
  );

  return (
    <>
      <div style={styles.widget}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.navBtn} onClick={prevMonth}><ChevronLeft size={14}/></span>
          <span style={styles.month}>{MONTHS[viewMonth]} {viewYear}</span>
          <span style={styles.navBtn} onClick={nextMonth}><ChevronRight size={14}/></span>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {DAYS.map(d => <div key={d} style={styles.dayLabel}>{d}</div>)}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isSelected = day === selectedDay;
              const hasEvent = day && eventDates.has(day);
              return (
                <div key={`${wi}-${di}`}
                  onClick={() => day && setSelectedDay(day)}
                  style={{
                    ...styles.day,
                    ...(isSelected ? styles.daySelected : {}),
                    ...(isToday && !isSelected ? styles.dayToday : {}),
                    ...(!day ? styles.dayEmpty : {}),
                  }}
                >
                  {day || ""}
                  {hasEvent && !isSelected && <div style={styles.eventDot}/>}
                </div>
              );
            })
          )}
        </div>

        {/* Events for selected day */}
        {selectedDay && (() => {
          const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;
          const dayEvents = events.filter(e => e.date === dateStr);
          return dayEvents.length > 0 ? (
            <div style={styles.dayEvents}>
              {dayEvents.map(e => (
                <div key={e.id} style={styles.dayEvent}>
                  <div style={{ ...styles.dayEventDot, background: e.color }}/>
                  <span style={styles.dayEventTitle}>{e.title}</span>
                </div>
              ))}
            </div>
          ) : null;
        })()}

        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={13}/> Add event
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalBg} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <strong style={{ fontSize:14 }}>Add Event</strong>
              <button style={styles.modalClose} onClick={() => setShowModal(false)}><X size={14}/></button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.label}>Date</label>
              <input style={styles.input} readOnly
                value={`${MONTHS[viewMonth]} ${selectedDay}, ${viewYear}`}
              />
              <label style={styles.label}>Title *</label>
              <input style={styles.input} placeholder="Event title"
                value={form.title} onChange={e => setForm(f => ({...f, title:e.target.value}))}
              />
              <label style={styles.label}>Location</label>
              <input style={styles.input} placeholder="Room / location"
                value={form.location} onChange={e => setForm(f => ({...f, location:e.target.value}))}
              />
              <label style={styles.label}>Color</label>
              <div style={styles.colorRow}>
                {EVENT_COLORS.map(c => (
                  <div key={c}
                    onClick={() => setForm(f => ({...f, color:c}))}
                    style={{ ...styles.colorSwatch, background:c, ...(form.color===c ? styles.colorActive : {}) }}
                  />
                ))}
              </div>
            </div>
            <button style={styles.saveBtn} onClick={handleAddEvent}>Save event</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  widget: {
    background:"#fff", border:"1.5px solid #e0ddd7",
    borderRadius:16, padding:14, marginBottom:10, flexShrink:0,
  },
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 },
  month:  { fontSize:13, fontWeight:700, color:"#1a1a1a" },
  navBtn: { cursor:"pointer", color:"#888", display:"flex", alignItems:"center", padding:2 },
  grid:   { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1 },
  dayLabel: { textAlign:"center", fontSize:9, fontWeight:700, color:"#aaa", paddingBottom:4, letterSpacing:".04em" },
  day: {
    textAlign:"center", fontSize:11, padding:"4px 0", borderRadius:8,
    cursor:"pointer", color:"#444", transition:"background .12s", position:"relative",
  },
  daySelected: { background:"#1a1a1a", color:"#fff", fontWeight:700 },
  dayToday:    { background:"#fde68a", fontWeight:700, color:"#1a1a1a" },
  dayEmpty:    { cursor:"default", color:"transparent" },
  eventDot: {
    width:4, height:4, borderRadius:"50%", background:"#fb923c",
    margin:"1px auto 0", position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)",
  },
  dayEvents: { marginTop:8, borderTop:"1px solid #f0ede6", paddingTop:6 },
  dayEvent: { display:"flex", alignItems:"center", gap:5, marginBottom:4 },
  dayEventDot: { width:6, height:6, borderRadius:"50%", flexShrink:0 },
  dayEventTitle: { fontSize:10, color:"#444", fontWeight:500 },
  addBtn: {
    width:"100%", background:"#1a1a1a", color:"#fff", border:"none",
    borderRadius:10, padding:8, fontSize:12, fontWeight:600,
    fontFamily:"'DM Sans', sans-serif", cursor:"pointer", marginTop:10,
    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  },

  // Modal
  modalBg: {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
    zIndex:200, display:"flex", alignItems:"center", justifyContent:"center",
  },
  modal: {
    background:"#fff", borderRadius:20, width:320, overflow:"hidden",
    boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:"1.5px solid #e0ddd7",
  },
  modalHeader: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 16px", borderBottom:"1px solid #f0ede6",
  },
  modalClose: { background:"transparent", border:"none", cursor:"pointer", color:"#aaa", display:"flex" },
  modalBody:  { padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 },
  label: { fontSize:11, fontWeight:600, color:"#888" },
  input: {
    border:"1.5px solid #e0ddd7", borderRadius:10, padding:"8px 10px",
    fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none",
    color:"#1a1a1a",
  },
  colorRow: { display:"flex", gap:8 },
  colorSwatch: { width:22, height:22, borderRadius:"50%", cursor:"pointer", transition:"transform .12s" },
  colorActive: { transform:"scale(1.3)", outline:"2px solid #1a1a1a", outlineOffset:2 },
  saveBtn: {
    width:"100%", background:"#1a1a1a", color:"#fff", border:"none",
    padding:"12px 0", fontSize:13, fontWeight:700,
    fontFamily:"'DM Sans', sans-serif", cursor:"pointer",
  },
};