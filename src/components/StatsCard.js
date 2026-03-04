import { Video, MessageCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Tooltip } from "recharts";

const visitData = [
  {t:"09:30",v:3},{t:"10:00",v:5},{t:"10:30",v:4},
  {t:"11:00",v:7},{t:"11:30",v:6},{t:"12:00",v:9},
  {t:"12:30",v:8},{t:"13:00",v:11},{t:"13:30",v:10},
];
const patientBarData = [
  {h:"07:30",v:4},{h:"08:00",v:6},{h:"09:00",v:3},
  {h:"10:00",v:8},{h:"11:00",v:5},{h:"12:00",v:9},
];

export default function StatsCards() {
  return (
    <div style={styles.grid}>
      {/* Patients */}
      <div style={{...styles.card, background:"#fde68a"}}>
        <div style={styles.title}>Patients:</div>
        <div style={styles.row}>
          <Stat num="14" label="STABLE"/><Stat num="5" label="FAIR"/><Stat num="2" label="CRITICAL"/>
        </div>
        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height={50}>
            <BarChart data={patientBarData} barSize={8}>
              <Bar dataKey="v" fill="#ca8a04" radius={[3,3,0,0]}/>
              <Tooltip contentStyle={{fontSize:10}} cursor={{fill:"rgba(0,0,0,0.05)"}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visits */}
      <div style={{...styles.card, background:"#fda4af"}}>
        <div style={styles.title}>Visits summary:</div>
        <div style={styles.row}>
          <Stat num="24 min" label="AVERAGE"/><Stat num="15 min" label="MINIMUM"/><Stat num="01:30 h" label="MAXIMUM"/>
        </div>
        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={visitData}>
              <Line type="monotone" dataKey="v" stroke="#be123c" strokeWidth={2} dot={false}/>
              <Tooltip contentStyle={{fontSize:10}} cursor={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Condition */}
      <div style={{...styles.card, background:"#bbf7d0", position:"relative", overflow:"hidden"}}>
        <div style={styles.title}>By condition:</div>
        <div style={styles.row}>
          <Stat num="14" label="STABLE"/><Stat num="5" label="FAIR"/><Stat num="1" label="CRITICAL"/>
        </div>
        <div style={styles.deco}>💊</div>
      </div>

      {/* Sessions */}
      <div style={{...styles.card, background:"#bae6fd", position:"relative", overflow:"hidden"}}>
        <div style={styles.title}>Sessions:</div>
        <div style={styles.row}>
          <Stat num="03:45 h" label="IN CLINIC"/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <Video size={12}/><span style={styles.num}>02:00</span>
            </div>
            <div style={styles.label}>VIDEO CALLS</div>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <MessageCircle size={12}/><span style={styles.num}>00:24</span>
            </div>
            <div style={styles.label}>IN CHAT</div>
          </div>
        </div>
        <div style={styles.deco}>📱</div>
      </div>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div>
      <div style={styles.num}>{num}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
}

const styles = {
  grid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 },
  card:  { borderRadius:16, padding:"14px 16px", border:"1.5px solid rgba(0,0,0,.08)" },
  title: { fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:8 },
  row:   { display:"flex", gap:14, alignItems:"flex-end" },
  num:   { fontSize:18, fontWeight:700, color:"#1a1a1a" },
  label: { fontSize:10, color:"#444", marginTop:2 },
  chart: { marginTop:8 },
  deco:  { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:46, opacity:.22, pointerEvents:"none" },
};