import { useState } from "react";
import { useApp } from "../context/AppContext";

const ALL_PATIENTS = [
  {
    id:1, name:"Taigo Wilkinson",   type:"Emergency Visit",     time:"09:15 AM", color:"#f97316", day:"Today",
    patientId:"1EG4-TES-NK72", gender:"Male",   age:"38 Years 5 Months",
    tags:[{label:"Fever",style:"red"},{label:"Cought",style:"orange"},{label:"Heart Burn",style:"red"}],
    lastChecked:"Dr. Evans on 27 April 2023", prescription:"FLUTEN 12",
    observation:"High fever and cough at normal recognition levels.",
    medicine:"Paracetamol · 2 times a day · Day and Night before meal",
  },
  {
    id:2, name:"Samantha Williams", type:"Routine Check-In",    time:"11:00 AM", color:"#3b82f6", day:"Today",
    patientId:"2SAM-ROT-AA01", gender:"Female", age:"29 Years 2 Months",
    tags:[{label:"Hypertension",style:"orange"}],
    lastChecked:"Dr. Evans on 10 April 2023", prescription:"METOPROLOL",
    observation:"Blood pressure slightly elevated, otherwise stable.",
    medicine:"Metoprolol · 1 time a day · Morning after breakfast",
  },
  {
    id:3, name:"Amy White",         type:"Video Consultation",  time:"11:00 AM", color:"#8b5cf6", day:"Today",
    patientId:"3AMY-VID-WH09", gender:"Female", age:"45 Years 8 Months",
    tags:[{label:"Migraine",style:"red"},{label:"Fatigue",style:"orange"}],
    lastChecked:"Dr. Lee on 15 March 2023",   prescription:"SUMATRIPTAN",
    observation:"Frequent migraines, stress-related triggers identified.",
    medicine:"Sumatriptan · As needed · Max 2 per day",
  },
  {
    id:4, name:"Tyler Young",       type:"Report",              time:"09:45 AM", color:"#10b981", day:"Today",
    patientId:"4TYL-RPT-YG22", gender:"Male",   age:"52 Years 1 Month",
    tags:[{label:"Diabetes",style:"orange"}],
    lastChecked:"Dr. Evans on 1 May 2023",    prescription:"METFORMIN",
    observation:"Blood sugar levels under control. Routine follow-up.",
    medicine:"Metformin · 2 times a day · With meals",
  },
  {
    id:5, name:"Carlos Medina",     type:"Emergency Visit",     time:"02:00 PM", color:"#f43f5e", day:"Tomorrow",
    patientId:"5CAR-EMG-MD33", gender:"Male",   age:"61 Years 3 Months",
    tags:[{label:"Chest Pain",style:"red"}],
    lastChecked:"Dr. Evans on 30 April 2023", prescription:"NITROGLYCERIN",
    observation:"Recurring chest pain episodes. Stress test recommended.",
    medicine:"Nitroglycerin · As needed",
  },
  {
    id:6, name:"Linda Park",        type:"Routine Check-In",    time:"10:30 AM", color:"#0ea5e9", day:"This week",
    patientId:"6LIN-ROT-PK44", gender:"Female", age:"33 Years 7 Months",
    tags:[{label:"Allergies",style:"orange"}],
    lastChecked:"Dr. Lee on 5 April 2023",    prescription:"CETIRIZINE",
    observation:"Seasonal allergies under control with medication.",
    medicine:"Cetirizine · 1 time a day · Morning",
  },
];

const PERIOD_FILTERS = ["Today", "Tomorrow", "This week", "All"];
const TAG_COLORS = {
  red:    { background:"#fecaca", color:"#dc2626" },
  orange: { background:"#fed7aa", color:"#c2410c" },
};

export default function PatientList() {
  const { searchQuery } = useApp();
  const [selected,     setSelected]     = useState(0);
  const [periodFilter, setPeriodFilter] = useState("Today");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = ALL_PATIENTS.filter(p => {
    const matchPeriod = periodFilter === "All" || p.day === periodFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPeriod && matchSearch;
  });

  const patient = filtered[selected] ?? filtered[0] ?? ALL_PATIENTS[0];

  return (
    <div style={styles.wrapper}>
      {/* ── Patient list ── */}
      <div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Patient's list</span>
          {/* Period filter dropdown */}
          <div style={{ position:"relative" }}>
            <button style={styles.badge} onClick={() => setShowDropdown(p => !p)}>
              {periodFilter} ▾
            </button>
            {showDropdown && (
              <div style={styles.dropdown}>
                {PERIOD_FILTERS.map(f => (
                  <div key={f}
                    style={{ ...styles.dropItem, ...(periodFilter===f ? styles.dropActive : {}) }}
                    onClick={() => { setPeriodFilter(f); setSelected(0); setShowDropdown(false); }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>No patients found</div>
        ) : (
          filtered.map((p, i) => (
            <PatientRow key={p.id} patient={p}
              isSelected={selected === i}
              onClick={() => setSelected(i)}
            />
          ))
        )}
      </div>

      {/* ── Visit details ── */}
      <div>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Visit details</span>
        </div>
        <DetailCard patient={patient}/>
      </div>
    </div>
  );
}

function PatientRow({ patient, isSelected, onClick }) {
  const initials = patient.name.split(" ").map(n => n[0]).join("");
  return (
    <div onClick={onClick}
      style={{ ...styles.patientRow, ...(isSelected ? styles.rowSelected : {}) }}
    >
      <div style={{ ...styles.avatar, background: patient.color }}>{initials}</div>
      <div style={styles.info}>
        <div style={styles.name}>{patient.name}</div>
        <div style={styles.type}>{patient.type}</div>
      </div>
      <span style={styles.timeBadge}>{patient.time}</span>
    </div>
  );
}

function DetailCard({ patient }) {
  return (
    <div style={styles.detailCard}>
      <div style={styles.detailHeader}>
        <span style={styles.detailName}>{patient.name}</span>
        <span style={styles.detailId}>{patient.patientId}</span>
      </div>
      <div style={styles.demographics}>{patient.gender} · {patient.age}</div>
      <div style={styles.tagsRow}>
        {patient.tags.map(t => (
          <span key={t.label} style={{ ...styles.pill, ...TAG_COLORS[t.style] }}>{t.label}</span>
        ))}
      </div>
      <Row label="Last Checked:">{patient.lastChecked} · Prescription <a href="#!" style={styles.link}>{patient.prescription}</a></Row>
      <Row label="Observation:">{patient.observation}</Row>
      <Row label="Prescription:">{patient.medicine}</Row>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={styles.detailRow}>
      <strong style={styles.detailLabel}>{label}</strong>
      <span style={styles.detailValue}>{children}</span>
    </div>
  );
}

const styles = {
  wrapper: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 },
  sectionHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  sectionTitle:  { fontSize:13, fontWeight:700, color:"#1a1a1a" },
  badge: {
    fontSize:10, fontWeight:600, background:"#1a1a1a", color:"#fff",
    borderRadius:999, padding:"2px 8px", whiteSpace:"nowrap", cursor:"pointer",
    border:"none", fontFamily:"'DM Sans',sans-serif",
  },
  dropdown: {
    position:"absolute", right:0, top:"calc(100% + 4px)", background:"#fff",
    border:"1.5px solid #e0ddd7", borderRadius:12, zIndex:100, overflow:"hidden",
    boxShadow:"0 4px 16px rgba(0,0,0,0.1)", minWidth:110,
  },
  dropItem: { padding:"7px 12px", fontSize:12, color:"#555", cursor:"pointer", transition:"background .12s" },
  dropActive: { background:"#f7f4ee", color:"#1a1a1a", fontWeight:600 },
  empty: { fontSize:12, color:"#aaa", padding:"20px 0", textAlign:"center" },

  patientRow: {
    display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
    borderRadius:12, background:"#fff", marginBottom:6,
    border:"1.5px solid #f0ede6", cursor:"pointer", transition:"border-color .15s",
  },
  rowSelected: { borderColor:"#1a1a1a", background:"#f7f4ee" },
  avatar: {
    width:32, height:32, borderRadius:"50%", display:"flex",
    alignItems:"center", justifyContent:"center",
    fontWeight:700, fontSize:12, color:"#fff", flexShrink:0,
  },
  info:     { flex:1 },
  name:     { fontSize:12, fontWeight:600, color:"#1a1a1a" },
  type:     { fontSize:10, color:"#888" },
  timeBadge:{ fontSize:10, fontWeight:600, background:"#1a1a1a", color:"#fff", borderRadius:999, padding:"2px 8px", whiteSpace:"nowrap" },

  detailCard: { background:"#fff", border:"1.5px solid #e0ddd7", borderRadius:16, padding:14, fontSize:12 },
  detailHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 },
  detailName: { fontSize:14, fontWeight:700, color:"#1a1a1a" },
  detailId:   { fontFamily:"'DM Mono',monospace", fontSize:10, background:"#f0ede6", padding:"3px 8px", borderRadius:6, color:"#555" },
  demographics:{ fontSize:11, color:"#888", marginBottom:8 },
  tagsRow:    { marginBottom:10, display:"flex", flexWrap:"wrap", gap:4 },
  pill:       { display:"inline-block", padding:"2px 8px", borderRadius:999, fontSize:10, fontWeight:600 },
  detailRow:  { display:"flex", gap:6, marginBottom:8, color:"#555", lineHeight:1.5, fontSize:11 },
  detailLabel:{ color:"#1a1a1a", minWidth:90, fontWeight:600 },
  detailValue:{ flex:1 },
  link:       { color:"#2563eb", textDecoration:"underline", cursor:"pointer" },
};