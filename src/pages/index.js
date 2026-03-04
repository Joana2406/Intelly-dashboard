import { useState } from "react";
import {
  Calendar, Clock, FileText, Video, MessageCircle,
  TrendingUp, BookOpen, Activity, CreditCard,
  Settings, User, Bell, Shield, Palette,
  ChevronRight, Plus, Search, X, ArrowLeft, CheckCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";

// ─────────────────────────────────────────────
// SCHEDULE — shows booked patient if coming from View
// ─────────────────────────────────────────────
export function SchedulePage() {
  const { scheduledPatient, setScheduledPatient } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    date: "", time: "09:00", type: "Routine Check-In", room: "",
  });

  const baseSchedule = [
    { time:"08:00", patient:"Taigo Wilkinson",   type:"Emergency Visit",    duration:"30 min", color:"#f97316", room:"Room 312" },
    { time:"09:30", patient:"Samantha Williams", type:"Routine Check-In",   duration:"20 min", color:"#3b82f6", room:"Room 104" },
    { time:"11:00", patient:"Amy White",         type:"Video Consultation", duration:"45 min", color:"#8b5cf6", room:"Online"   },
    { time:"12:30", patient:"—",                 type:"Lunch break",        duration:"60 min", color:"#d1d5db", room:"—"        },
    { time:"13:30", patient:"Tyler Young",       type:"Report Review",      duration:"20 min", color:"#10b981", room:"Office"   },
    { time:"14:30", patient:"Carlos Medina",     type:"Emergency Visit",    duration:"30 min", color:"#f43f5e", room:"Room 201" },
    { time:"16:00", patient:"Linda Park",        type:"Routine Check-In",   duration:"25 min", color:"#0ea5e9", room:"Room 104" },
  ];

  const handleConfirm = () => {
    if (!form.date) return;
    setConfirmed(true);
  };

  const handleCancel = () => {
    setScheduledPatient(null);
    setConfirmed(false);
  };

  return (
    <PageWrap title="Schedule" subtitle="Your appointments for today, May 15">

      {/* ── New appointment form (only when coming from Patients > View) ── */}
      {scheduledPatient && (
        <div style={sch.bookingCard}>
          {confirmed ? (
            /* Success state */
            <div style={sch.successBox}>
              <CheckCircle size={36} color="#16a34a" />
              <div style={sch.successTitle}>Appointment confirmed!</div>
              <div style={sch.successSub}>
                <strong>{scheduledPatient.name}</strong> has been scheduled for {form.date} at {form.time}.
              </div>
              <button style={sch.successBtn} onClick={handleCancel}>Done</button>
            </div>
          ) : (
            <>
              <div style={sch.bookingHeader}>
                <div style={sch.bookingTitle}>
                  <Calendar size={15} /> Schedule appointment
                </div>
                <button style={sch.dismissBtn} onClick={handleCancel}><X size={14}/></button>
              </div>

              {/* Patient info pill */}
              <div style={sch.patientPill}>
                <div style={{ ...sch.ptAvatar, background: scheduledPatient.color }}>
                  {scheduledPatient.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={sch.ptName}>{scheduledPatient.name}</div>
                  <div style={sch.ptSub}>{scheduledPatient.patientId}</div>
                </div>
              </div>

              {/* Form fields */}
              <div style={sch.formGrid}>
                <div style={sch.formField}>
                  <label style={sch.label}>Date *</label>
                  <input
                    type="date"
                    style={sch.input}
                    value={form.date}
                    onChange={e => setForm(f => ({...f, date: e.target.value}))}
                  />
                </div>
                <div style={sch.formField}>
                  <label style={sch.label}>Time</label>
                  <input
                    type="time"
                    style={sch.input}
                    value={form.time}
                    onChange={e => setForm(f => ({...f, time: e.target.value}))}
                  />
                </div>
                <div style={sch.formField}>
                  <label style={sch.label}>Visit type</label>
                  <select
                    style={sch.input}
                    value={form.type}
                    onChange={e => setForm(f => ({...f, type: e.target.value}))}
                  >
                    {["Routine Check-In","Emergency Visit","Video Consultation","Report Review"].map(t=>(
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={sch.formField}>
                  <label style={sch.label}>Room / location</label>
                  <input
                    style={sch.input}
                    placeholder="e.g. Room 104"
                    value={form.room}
                    onChange={e => setForm(f => ({...f, room: e.target.value}))}
                  />
                </div>
              </div>

              <div style={sch.formActions}>
                <button style={sch.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button
                  style={{ ...sch.confirmBtn, opacity: form.date ? 1 : 0.5 }}
                  onClick={handleConfirm}
                  disabled={!form.date}
                >
                  Confirm appointment
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Today's schedule list ── */}
      <div style={pg.card}>
        {baseSchedule.map((s, i) => (
          <div key={i} style={{ ...pg.schedRow, borderLeft:`3px solid ${s.color}` }}>
            <div style={pg.schedTime}>{s.time}</div>
            <div style={{ flex:1 }}>
              <div style={pg.schedPatient}>{s.patient}</div>
              <div style={pg.schedType}>{s.type} · {s.room}</div>
            </div>
            <div style={pg.schedDur}>{s.duration}</div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// Schedule-specific styles
const sch = {
  bookingCard: {
    background: "#fff", border: "2px solid #1a1a1a",
    borderRadius: 16, padding: 16, marginBottom: 14,
    boxShadow: "4px 4px 0 #1a1a1a",
  },
  bookingHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 12,
  },
  bookingTitle: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 14, fontWeight: 700, color: "#1a1a1a",
  },
  dismissBtn: {
    background: "transparent", border: "none",
    cursor: "pointer", color: "#aaa", display: "flex",
  },
  patientPill: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#f7f4ee", borderRadius: 12, padding: "10px 14px", marginBottom: 14,
  },
  ptAvatar: {
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0,
  },
  ptName: { fontSize: 14, fontWeight: 700, color: "#1a1a1a" },
  ptSub:  { fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace" },
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14,
  },
  formField: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 11, fontWeight: 600, color: "#888" },
  input: {
    border: "1.5px solid #e0ddd7", borderRadius: 10,
    padding: "8px 10px", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1a1a1a",
  },
  formActions: { display: "flex", gap: 8, justifyContent: "flex-end" },
  cancelBtn: {
    padding: "8px 16px", borderRadius: 10, border: "1.5px solid #e0ddd7",
    background: "transparent", fontSize: 13, fontWeight: 600,
    cursor: "pointer", color: "#555", fontFamily: "'DM Sans', sans-serif",
  },
  confirmBtn: {
    padding: "8px 18px", borderRadius: 10, border: "none",
    background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "opacity .15s",
  },
  successBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, padding: "16px 0 8px",
  },
  successTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  successSub:   { fontSize: 13, color: "#555", textAlign: "center" },
  successBtn: {
    marginTop: 8, padding: "8px 24px", borderRadius: 10, border: "none",
    background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
};

// ─────────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────────
const PATIENT_DETAILS = [
  {
    name:"Taigo Wilkinson",   age:38, gender:"Male",   condition:"Stable",   lastVisit:"27 Apr 2023", color:"#f97316",
    patientId:"1EG4-TES-NK72",
    tags:[{label:"Fever",style:"red"},{label:"Cought",style:"orange"},{label:"Heart Burn",style:"red"}],
    lastChecked:"Dr. Evans on 27 April 2023", prescription:"FLUTEN 12",
    observation:"High fever and cough at normal recognition levels.",
    medicine:"Paracetamol · 2 times a day · Day and Night before meal",
    phone:"+1 (555) 102-3344", blood:"O+", allergies:"Penicillin",
  },
  {
    name:"Samantha Williams", age:29, gender:"Female", condition:"Good",     lastVisit:"10 Apr 2023", color:"#3b82f6",
    patientId:"2SAM-ROT-AA01",
    tags:[{label:"Hypertension",style:"orange"}],
    lastChecked:"Dr. Evans on 10 April 2023", prescription:"METOPROLOL",
    observation:"Blood pressure slightly elevated, otherwise stable.",
    medicine:"Metoprolol · 1 time a day · Morning after breakfast",
    phone:"+1 (555) 234-5678", blood:"A+", allergies:"None known",
  },
  {
    name:"Amy White",         age:45, gender:"Female", condition:"Stable",   lastVisit:"15 Mar 2023", color:"#8b5cf6",
    patientId:"3AMY-VID-WH09",
    tags:[{label:"Migraine",style:"red"},{label:"Fatigue",style:"orange"}],
    lastChecked:"Dr. Lee on 15 March 2023", prescription:"SUMATRIPTAN",
    observation:"Frequent migraines, stress-related triggers identified.",
    medicine:"Sumatriptan · As needed · Max 2 per day",
    phone:"+1 (555) 345-6789", blood:"B-", allergies:"Sulfa drugs",
  },
  {
    name:"Tyler Young",       age:52, gender:"Male",   condition:"Good",     lastVisit:"01 May 2023", color:"#10b981",
    patientId:"4TYL-RPT-YG22",
    tags:[{label:"Diabetes",style:"orange"}],
    lastChecked:"Dr. Evans on 1 May 2023", prescription:"METFORMIN",
    observation:"Blood sugar levels under control. Routine follow-up.",
    medicine:"Metformin · 2 times a day · With meals",
    phone:"+1 (555) 456-7890", blood:"AB+", allergies:"None known",
  },
  {
    name:"Carlos Medina",     age:61, gender:"Male",   condition:"Critical", lastVisit:"30 Apr 2023", color:"#f43f5e",
    patientId:"5CAR-EMG-MD33",
    tags:[{label:"Chest Pain",style:"red"}],
    lastChecked:"Dr. Evans on 30 April 2023", prescription:"NITROGLYCERIN",
    observation:"Recurring chest pain episodes. Stress test recommended.",
    medicine:"Nitroglycerin · As needed",
    phone:"+1 (555) 567-8901", blood:"O-", allergies:"Aspirin",
  },
  {
    name:"Linda Park",        age:33, gender:"Female", condition:"Good",     lastVisit:"05 Apr 2023", color:"#0ea5e9",
    patientId:"6LIN-ROT-PK44",
    tags:[{label:"Allergies",style:"orange"}],
    lastChecked:"Dr. Lee on 5 April 2023", prescription:"CETIRIZINE",
    observation:"Seasonal allergies under control with medication.",
    medicine:"Cetirizine · 1 time a day · Morning",
    phone:"+1 (555) 678-9012", blood:"A-", allergies:"Pollen, dust mites",
  },
];

const condColor = { Stable:"#bbf7d0", Good:"#bae6fd", Critical:"#fecaca" };
const condText  = { Stable:"#16a34a", Good:"#0369a1", Critical:"#dc2626" };
const tagColors = {
  red:    { background:"#fecaca", color:"#dc2626" },
  orange: { background:"#fed7aa", color:"#c2410c" },
};

export function PatientsPage() {
  const [search, setSearch] = useState("");
  const [viewPt, setViewPt] = useState(null);

  const filtered = PATIENT_DETAILS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageWrap title="Patients" subtitle="All registered patients">
        <div style={pg.searchRow}>
          <Search size={14} color="#aaa"/>
          <input style={pg.searchIn} placeholder="Search patient..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button style={pg.clearSearch} onClick={() => setSearch("")}><X size={12}/></button>
          )}
        </div>

        <div style={pg.card}>
          <div style={pg.tableHead}>
            {["Patient","Age","Gender","Condition","Last visit",""].map(h => (
              <div key={h} style={pg.th}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={pg.emptyState}>No patients found for "{search}"</div>
          ) : filtered.map((p, i) => (
            <div key={i} style={pg.tableRow}>
              <div style={pg.tdName}>
                <div style={{...pg.avatar2, background:p.color}}>
                  {p.name.split(" ").map(n=>n[0]).join("")}
                </div>
                {p.name}
              </div>
              <div style={pg.td}>{p.age}</div>
              <div style={pg.td}>{p.gender}</div>
              <div style={pg.td}>
                <span style={{...pg.condPill, background:condColor[p.condition], color:condText[p.condition]}}>
                  {p.condition}
                </span>
              </div>
              <div style={pg.td}>{p.lastVisit}</div>
              <div style={pg.td}>
                <button style={pg.viewBtn} onClick={() => setViewPt(p)}>
                  View <ChevronRight size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageWrap>

      {viewPt && (
        <PatientModal patient={viewPt} onClose={() => setViewPt(null)} />
      )}
    </>
  );
}

// ── Patient detail modal ────────────────────────────────────────────────────
function PatientModal({ patient: p, onClose }) {
  const { scheduleAppointment } = useApp();

  const handleSchedule = () => {
    onClose();
    scheduleAppointment(p); // sets scheduledPatient + navigates to Schedule
  };

  return (
    <div style={modal.bg} onClick={onClose}>
      <div style={modal.box} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ ...modal.header, background: p.color }}>
          <button style={modal.iconBtnWhite} onClick={onClose}><ArrowLeft size={16}/></button>
          <div style={modal.avatar}>
            {p.name.split(" ").map(n=>n[0]).join("")}
          </div>
          <div style={{ flex:1 }}>
            <div style={modal.ptName}>{p.name}</div>
            <div style={modal.ptSub}>{p.gender} · {p.age} years · {p.blood}</div>
          </div>
          <span style={{...modal.condBadge, background:condColor[p.condition], color:condText[p.condition]}}>
            {p.condition}
          </span>
          <button style={modal.iconBtnWhite} onClick={onClose}><X size={16}/></button>
        </div>

        {/* Body */}
        <div style={modal.body}>
          <div style={modal.infoGrid}>
            <InfoBox label="Patient ID" value={p.patientId}/>
            <InfoBox label="Phone"      value={p.phone}/>
            <InfoBox label="Blood type" value={p.blood}/>
            <InfoBox label="Allergies"  value={p.allergies}/>
          </div>

          <div style={modal.section}>
            <div style={modal.sectionTitle}>Symptoms</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {p.tags.map(t => (
                <span key={t.label} style={{...modal.pill, ...tagColors[t.style]}}>{t.label}</span>
              ))}
            </div>
          </div>

          <div style={modal.section}>
            <div style={modal.sectionTitle}>Clinical notes</div>
            <div style={modal.detailRows}>
              <DRow label="Last checked"  value={p.lastChecked}/>
              <DRow label="Prescription"  value={p.prescription} highlight/>
              <DRow label="Observation"   value={p.observation}/>
              <DRow label="Medicine"      value={p.medicine}/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={modal.footer}>
          <button style={modal.footerBtnSecondary} onClick={onClose}>Close</button>
          <button style={modal.footerBtnPrimary} onClick={handleSchedule}>
            <Calendar size={13}/> Schedule appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div style={modal.infoBox}>
      <div style={modal.infoLabel}>{label}</div>
      <div style={modal.infoValue}>{value}</div>
    </div>
  );
}
function DRow({ label, value, highlight }) {
  return (
    <div style={modal.detailRow}>
      <strong style={modal.detailLabel}>{label}</strong>
      <span style={{ ...modal.detailValue, ...(highlight ? {color:"#2563eb",fontWeight:600} : {}) }}>
        {value}
      </span>
    </div>
  );
}

const modal = {
  bg: {
    position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
    zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
  },
  box: {
    background:"#fff", borderRadius:20, width:"100%", maxWidth:520,
    overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.25)",
    display:"flex", flexDirection:"column", maxHeight:"90vh",
  },
  header: {
    display:"flex", alignItems:"center", gap:10,
    padding:"18px 18px", color:"#fff", flexShrink:0,
  },
  iconBtnWhite: {
    background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"50%",
    width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", color:"#fff", flexShrink:0,
  },
  avatar: {
    width:44, height:44, borderRadius:"50%",
    background:"rgba(255,255,255,0.3)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontWeight:700, fontSize:16, color:"#fff", flexShrink:0,
  },
  ptName: { fontSize:17, fontWeight:700 },
  ptSub:  { fontSize:12, opacity:.85, marginTop:2 },
  condBadge: {
    padding:"3px 10px", borderRadius:999,
    fontSize:11, fontWeight:700, flexShrink:0,
  },
  body: { padding:"16px 18px", overflowY:"auto", flex:1 },
  infoGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 },
  infoBox:  { background:"#f7f4ee", borderRadius:12, padding:"10px 14px" },
  infoLabel:{ fontSize:10, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".05em" },
  infoValue:{ fontSize:14, fontWeight:600, color:"#1a1a1a", marginTop:4 },
  section:  { marginBottom:16 },
  sectionTitle:{ fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 },
  pill: { display:"inline-block", padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:600 },
  detailRows:{ background:"#f7f4ee", borderRadius:12, overflow:"hidden" },
  detailRow: { display:"flex", gap:8, padding:"10px 14px", borderBottom:"1px solid #ede9e1", fontSize:13 },
  detailLabel:{ minWidth:110, color:"#888", fontWeight:600, flexShrink:0 },
  detailValue:{ color:"#1a1a1a", flex:1 },
  footer: {
    display:"flex", gap:8, padding:"14px 18px",
    borderTop:"1px solid #f0ede6", flexShrink:0,
  },
  footerBtnSecondary: {
    flex:1, padding:"10px 0", borderRadius:10, border:"1.5px solid #e0ddd7",
    background:"transparent", fontSize:13, fontWeight:600, cursor:"pointer",
    color:"#555", fontFamily:"'DM Sans',sans-serif",
  },
  footerBtnPrimary: {
    flex:2, padding:"10px 0", borderRadius:10, border:"none",
    background:"#1a1a1a", color:"#fff", fontSize:13, fontWeight:700,
    cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
  },
};

// ─────────────────────────────────────────────
// STATISTICS
// ─────────────────────────────────────────────
export function StatisticsPage() {
  const stats = [
    { icon:<Activity size={20}/>, label:"Total patients",    value:"248",  change:"+12%", color:"#fde68a" },
    { icon:<Calendar size={20}/>, label:"Appointments today",value:"45",   change:"+5%",  color:"#bae6fd" },
    { icon:<Clock size={20}/>,    label:"Avg visit duration", value:"24min",change:"-3%",  color:"#bbf7d0" },
    { icon:<TrendingUp size={20}/>,label:"Recovery rate",    value:"92%",  change:"+2%",  color:"#fda4af" },
  ];
  return (
    <PageWrap title="Statistics & Reports" subtitle="Overview of your clinical activity">
      <div style={pg.statsGrid}>
        {stats.map((s,i) => (
          <div key={i} style={{...pg.statCard, background:s.color}}>
            <div style={pg.statIcon}>{s.icon}</div>
            <div style={pg.statVal}>{s.value}</div>
            <div style={pg.statLabel}>{s.label}</div>
            <div style={{...pg.statChange, color: s.change.startsWith("+") ? "#16a34a" : "#dc2626"}}>
              {s.change} this month
            </div>
          </div>
        ))}
      </div>
      <div style={pg.card}>
        <div style={pg.cardTitle}>Recent Reports</div>
        {["Monthly patient summary","Q1 treatment outcomes","Emergency visits report","Prescription analysis"].map((r,i) => (
          <div key={i} style={pg.reportRow}>
            <FileText size={14} color="#888"/>
            <span style={pg.reportName}>{r}</span>
            <button style={pg.viewBtn}>Download</button>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────
export function EducationPage() {
  const articles = [
    { title:"Latest advances in cardiology treatment",      category:"Cardiology",       date:"May 10, 2024", read:"8 min" },
    { title:"Managing hypertension in elderly patients",    category:"Internal Medicine", date:"May 8, 2024",  read:"5 min" },
    { title:"New guidelines for diabetes management",       category:"Endocrinology",    date:"May 5, 2024",  read:"12 min" },
    { title:"Mental health integration in primary care",    category:"Psychiatry",       date:"Apr 28, 2024", read:"6 min" },
  ];
  const catColor = { Cardiology:"#fda4af", "Internal Medicine":"#bae6fd", Endocrinology:"#bbf7d0", Psychiatry:"#fde68a" };
  return (
    <PageWrap title="Education" subtitle="Medical articles & continuing education">
      <div style={pg.eduGrid}>
        {articles.map((a,i) => (
          <div key={i} style={pg.eduCard}>
            <div style={{...pg.eduBanner, background: catColor[a.category] ?? "#f0ede6"}}>
              <BookOpen size={28} color="#1a1a1a" style={{opacity:.3}}/>
            </div>
            <div style={pg.eduBody}>
              <span style={pg.eduCat}>{a.category}</span>
              <div style={pg.eduTitle}>{a.title}</div>
              <div style={pg.eduMeta}>{a.date} · {a.read} read</div>
              <button style={pg.readBtn}>Read article</button>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// MY ARTICLES
// ─────────────────────────────────────────────
export function MyArticlesPage() {
  const articles = [
    { title:"Post-operative care protocols for minimally invasive surgery", status:"Published", date:"Mar 2024", views:342 },
    { title:"Antibiotic resistance patterns in outpatient settings",        status:"Published", date:"Jan 2024", views:289 },
    { title:"Patient adherence strategies in chronic disease management",   status:"Draft",     date:"May 2024", views:0   },
  ];
  return (
    <PageWrap title="My Articles" subtitle="Your published & draft medical articles">
      <button style={pg.newBtn}><Plus size={14}/> New article</button>
      <div style={{...pg.card, marginTop:12}}>
        {articles.map((a,i) => (
          <div key={i} style={pg.articleRow}>
            <div style={{flex:1}}>
              <div style={pg.articleTitle}>{a.title}</div>
              <div style={pg.articleMeta}>{a.date} · {a.views > 0 ? `${a.views} views` : "Not published"}</div>
            </div>
            <span style={{
              ...pg.statusPill,
              background: a.status==="Published" ? "#bbf7d0" : "#fde68a",
              color:       a.status==="Published" ? "#16a34a" : "#92400e",
            }}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// CHATS
// ─────────────────────────────────────────────
export function ChatsPage() {
  const chats = [
    { name:"Taigo Wilkinson",   last:"Feeling better today, thank you!", time:"9:20 AM",   unread:2, color:"#f97316" },
    { name:"Samantha Williams", last:"Can we reschedule my appointment?", time:"Yesterday", unread:0, color:"#3b82f6" },
    { name:"Dr. Evans (Staff)", last:"Lab results are ready.",            time:"Yesterday", unread:1, color:"#10b981" },
    { name:"Amy White",         last:"I had another migraine episode.",   time:"Mon",       unread:0, color:"#8b5cf6" },
  ];
  return (
    <PageWrap title="Chats & Calls" subtitle="Patient and staff communications">
      <div style={pg.card}>
        {chats.map((c,i) => (
          <div key={i} style={pg.chatRow}>
            <div style={{...pg.avatar2, background:c.color, width:38, height:38, fontSize:14}}>
              {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div style={{flex:1}}>
              <div style={{...pg.schedPatient, display:"flex", justifyContent:"space-between"}}>
                <span>{c.name}</span>
                <span style={{fontSize:10,color:"#aaa",fontWeight:400}}>{c.time}</span>
              </div>
              <div style={pg.schedType}>{c.last}</div>
            </div>
            {c.unread > 0 && <div style={pg.unreadBadge}>{c.unread}</div>}
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// BILLING
// ─────────────────────────────────────────────
export function BillingPage() {
  const bills = [
    { patient:"Taigo Wilkinson",   amount:"$320.00", status:"Paid",    date:"May 15, 2024" },
    { patient:"Samantha Williams", amount:"$150.00", status:"Pending", date:"May 15, 2024" },
    { patient:"Amy White",         amount:"$200.00", status:"Paid",    date:"May 14, 2024" },
    { patient:"Carlos Medina",     amount:"$480.00", status:"Overdue", date:"May 10, 2024" },
  ];
  const statusColors = { Paid:"#bbf7d0", Pending:"#fde68a", Overdue:"#fecaca" };
  const statusText   = { Paid:"#16a34a", Pending:"#92400e", Overdue:"#dc2626"  };
  return (
    <PageWrap title="Billing" subtitle="Patient invoices and payments">
      <div style={pg.statsGrid}>
        {[
          {label:"Total revenue",value:"$12,400",color:"#bbf7d0"},
          {label:"Pending",      value:"$1,200", color:"#fde68a"},
          {label:"Overdue",      value:"$480",   color:"#fecaca"},
        ].map((s,i) => (
          <div key={i} style={{...pg.statCard, background:s.color}}>
            <CreditCard size={20}/>
            <div style={pg.statVal}>{s.value}</div>
            <div style={pg.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={pg.card}>
        {bills.map((b,i) => (
          <div key={i} style={pg.tableRow}>
            <div style={{flex:1}}>
              <div style={pg.schedPatient}>{b.patient}</div>
              <div style={pg.schedType}>{b.date}</div>
            </div>
            <div style={{fontWeight:700,fontSize:14}}>{b.amount}</div>
            <span style={{...pg.condPill, background:statusColors[b.status], color:statusText[b.status], marginLeft:10}}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────
export function DocumentsPage() {
  const docs = [
    { name:"Patient intake form v3.pdf",       size:"245 KB", date:"May 1, 2024",  type:"PDF" },
    { name:"Emergency protocol 2024.docx",     size:"89 KB",  date:"Apr 15, 2024", type:"DOC" },
    { name:"Prescription template.xlsx",       size:"32 KB",  date:"Mar 20, 2024", type:"XLS" },
    { name:"Lab results — Taigo Wilkinson.pdf",size:"512 KB", date:"May 10, 2024", type:"PDF" },
    { name:"Insurance claim forms.pdf",        size:"180 KB", date:"Apr 5, 2024",  type:"PDF" },
  ];
  const typeColor = { PDF:"#fda4af", DOC:"#bae6fd", XLS:"#bbf7d0" };
  return (
    <PageWrap title="Documents Base" subtitle="Clinical documents and templates">
      <div style={pg.card}>
        {docs.map((d,i) => (
          <div key={i} style={pg.reportRow}>
            <span style={{...pg.typePill, background: typeColor[d.type] ?? "#f0ede6"}}>{d.type}</span>
            <div style={{flex:1}}>
              <div style={pg.schedPatient}>{d.name}</div>
              <div style={pg.schedType}>{d.size} · {d.date}</div>
            </div>
            <button style={pg.viewBtn}>Download</button>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
export function SettingsPage() {
  const [name,  setName]  = useState("Dr. Olivia Lee");
  const [email, setEmail] = useState("olivia@intelly.health");
  const [notif, setNotif] = useState(true);
  return (
    <PageWrap title="Settings" subtitle="Account & preferences">
      <div style={pg.settingsGrid}>
        <div style={pg.card}>
          <div style={pg.cardTitle}><User size={14}/> Profile</div>
          <label style={pg.label}>Full name</label>
          <input style={pg.input} value={name} onChange={e => setName(e.target.value)}/>
          <label style={pg.label}>Email</label>
          <input style={pg.input} value={email} onChange={e => setEmail(e.target.value)}/>
          <button style={pg.saveBtn}>Save changes</button>
        </div>
        <div style={pg.card}>
          <div style={pg.cardTitle}><Bell size={14}/> Notifications</div>
          {[
            {label:"Appointment reminders", on:notif},
            {label:"New patient messages",  on:true},
            {label:"Lab result alerts",     on:false},
            {label:"Daily summary email",   on:true},
          ].map((n,i) => (
            <div key={i} style={pg.toggleRow}>
              <span style={{fontSize:13,color:"#444"}}>{n.label}</span>
              <div
                onClick={() => i===0 && setNotif(p=>!p)}
                style={{...pg.toggle, background:(i===0?notif:n.on)?"#1a1a1a":"#e0ddd7"}}
              >
                <div style={{...pg.toggleKnob, left:(i===0?notif:n.on)?"calc(100% - 18px)":2}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={pg.card}>
          <div style={pg.cardTitle}><Shield size={14}/> Security</div>
          <label style={pg.label}>Current password</label>
          <input style={pg.input} type="password" placeholder="••••••••"/>
          <label style={pg.label}>New password</label>
          <input style={pg.input} type="password" placeholder="••••••••"/>
          <button style={pg.saveBtn}>Update password</button>
        </div>
        <div style={pg.card}>
          <div style={pg.cardTitle}><Palette size={14}/> Appearance</div>
          {["System default","Light mode","Dark mode"].map((m,i) => (
            <div key={i} style={pg.radioRow}>
              <div style={{...pg.radio,...(i===1?pg.radioActive:{})}}/>
              <span style={{fontSize:13,color:"#444"}}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrap>
  );
}

// ─────────────────────────────────────────────
// PageWrap
// ─────────────────────────────────────────────
function PageWrap({ title, subtitle, children }) {
  return (
    <div style={pg.wrap}>
      <div style={pg.pageHeader}>
        <h2 style={pg.pageTitle}>{title}</h2>
        <p style={pg.pageSub}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────
const pg = {
  wrap:       { padding:"14px 0 10px" },
  pageHeader: { marginBottom:14 },
  pageTitle:  { fontSize:20, fontWeight:700, color:"#1a1a1a" },
  pageSub:    { fontSize:12, color:"#888", marginTop:3 },

  card:      { background:"#fff", border:"1.5px solid #e0ddd7", borderRadius:16, padding:14, marginBottom:12 },
  cardTitle: { fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12, display:"flex", alignItems:"center", gap:6 },

  schedRow:     { display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f0ede6", paddingLeft:10 },
  schedTime:    { fontSize:12, fontWeight:700, color:"#1a1a1a", width:44, flexShrink:0 },
  schedPatient: { fontSize:13, fontWeight:600, color:"#1a1a1a" },
  schedType:    { fontSize:11, color:"#888" },
  schedDur:     { fontSize:11, color:"#aaa", flexShrink:0 },

  searchRow:   { display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #e0ddd7", borderRadius:12, padding:"8px 12px", marginBottom:10 },
  searchIn:    { border:"none", outline:"none", fontSize:13, fontFamily:"'DM Sans',sans-serif", flex:1, background:"transparent" },
  clearSearch: { background:"transparent", border:"none", cursor:"pointer", color:"#aaa", display:"flex", padding:0 },
  emptyState:  { padding:"24px", textAlign:"center", color:"#aaa", fontSize:13 },

  tableHead: { display:"grid", gridTemplateColumns:"2fr .5fr .7fr .8fr 1fr .6fr", padding:"8px 10px", borderBottom:"1px solid #f0ede6", fontSize:10, fontWeight:700, color:"#aaa", textTransform:"uppercase" },
  tableRow:  { display:"grid", gridTemplateColumns:"2fr .5fr .7fr .8fr 1fr .6fr", padding:"10px 10px", borderBottom:"1px solid #f7f4ee", alignItems:"center" },
  tdName:    { display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600 },
  td:        { fontSize:13, color:"#555" },
  th:        {},
  avatar2:   { width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, color:"#fff", flexShrink:0 },
  condPill:  { display:"inline-block", padding:"2px 8px", borderRadius:999, fontSize:10, fontWeight:600 },
  viewBtn:   { display:"flex", alignItems:"center", gap:3, background:"#f0ede6", border:"none", borderRadius:8, padding:"5px 10px", fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"#1a1a1a", fontWeight:600 },

  statsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:12 },
  statCard:  { borderRadius:16, padding:14, border:"1.5px solid rgba(0,0,0,.06)" },
  statIcon:  { marginBottom:8 },
  statVal:   { fontSize:24, fontWeight:700, color:"#1a1a1a", marginBottom:2 },
  statLabel: { fontSize:11, color:"#555" },
  statChange:{ fontSize:10, marginTop:4, fontWeight:600 },

  reportRow: { display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #f0ede6" },
  reportName:{ fontSize:13, color:"#333", flex:1 },
  typePill:  { fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:6, flexShrink:0 },

  eduGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 },
  eduCard:  { background:"#fff", border:"1.5px solid #e0ddd7", borderRadius:16, overflow:"hidden" },
  eduBanner:{ height:80, display:"flex", alignItems:"center", justifyContent:"center" },
  eduBody:  { padding:12 },
  eduCat:   { fontSize:10, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".06em" },
  eduTitle: { fontSize:13, fontWeight:700, color:"#1a1a1a", margin:"4px 0 4px" },
  eduMeta:  { fontSize:10, color:"#aaa", marginBottom:8 },
  readBtn:  { background:"#1a1a1a", color:"#fff", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },

  articleRow:   { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f0ede6" },
  articleTitle: { fontSize:13, fontWeight:600, color:"#1a1a1a" },
  articleMeta:  { fontSize:11, color:"#888", marginTop:2 },
  statusPill:   { fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:999, flexShrink:0 },
  newBtn:       { display:"flex", alignItems:"center", gap:6, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },

  chatRow:     { display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #f0ede6" },
  unreadBadge: { width:18, height:18, borderRadius:"50%", background:"#fb923c", color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },

  settingsGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  label:       { fontSize:11, fontWeight:600, color:"#888", display:"block", marginBottom:4, marginTop:10 },
  input:       { width:"100%", border:"1.5px solid #e0ddd7", borderRadius:10, padding:"8px 10px", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", color:"#1a1a1a" },
  saveBtn:     { marginTop:12, background:"#1a1a1a", color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },
  toggleRow:   { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f7f4ee" },
  toggle:      { width:36, height:20, borderRadius:999, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 },
  toggleKnob:  { position:"absolute", top:2, width:16, height:16, background:"#fff", borderRadius:"50%", transition:"left .2s" },
  radioRow:    { display:"flex", alignItems:"center", gap:10, padding:"8px 0" },
  radio:       { width:16, height:16, borderRadius:"50%", border:"2px solid #ccc", flexShrink:0 },
  radioActive: { border:"2px solid #1a1a1a", background:"#1a1a1a" },
};