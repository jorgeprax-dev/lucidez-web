import { useNavigate } from "react-router-dom";

const colors = {
  cream: "#f7f4f0",
  creamDark: "#ede9e3",
  ink: "#1a1714",
  inkMuted: "#6b6460",
  inkFaint: "#a09890",
  border: "rgba(26,23,20,0.12)",
};

const dims = [
  { color: "#3d7a65", name: "Presencia", desc: "Tu mente está siempre en otro lado. No puedes enfocarte." },
  { color: "#9a5e2e", name: "Claridad cognitiva", desc: "Pensamientos que se repiten. Ruido mental constante." },
  { color: "#6a3d82", name: "Regulación emocional", desc: "Las emociones te desbordan o no sabes qué sientes." },
  { color: "#2d6382", name: "Alineación de valores", desc: "Haces cosas que no van con lo que realmente importa." },
  { color: "#4d6d2a", name: "Autoconocimiento", desc: "No te tratas bien. Eres más duro contigo que con otros." },
  { color: "#7a6520", name: "Agencia", desc: "Sabes qué hacer pero no lo haces. Te sientes estancado." },
];

const steps = [
  { num: "01", title: "Haces el Índice", desc: "18 preguntas. 8 minutos. Gratis y sin cuenta." },
  { num: "02", title: "Ves tu reporte", desc: "Score por dimensión y patrón clínico detectado." },
  { num: "03", title: "Trabajas lo más bajo", desc: "Reporte profundo con IA y contenido por dimensión." },
  { num: "04", title: "Mides tu progreso", desc: "Dashboard con historial y evolución longitudinal." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: colors.cream, minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif", color: colors.ink, fontSize: 15, lineHeight: 1.6 }}>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `0.5px solid ${colors.border}`, background: colors.cream, position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: "normal", letterSpacing: "0.04em", color: colors.ink }}>lucidez</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button onClick={() => navigate("/indice")} style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: colors.inkMuted, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>El Índice</button>
          <button style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: colors.inkMuted, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>Programa</button>
          <button onClick={() => navigate("/login")} style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: colors.ink, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>Entrar →</button>
          <button onClick={() => navigate("/indice")} style={{ background: colors.ink, color: colors.cream, border: "none", padding: "10px 22px", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Comenzar</button>
        </div>
      </nav>

      <div style={{ padding: "80px 32px 60px", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 28 }}>Primer programa clínico digital en español</p>
        <h1 style={{ fontSize: 42, fontWeight: "normal", lineHeight: 1.2, marginBottom: 24, letterSpacing: "-0.01em", color: colors.ink }}>¿Sientes que algo no está bien, pero no sabes exactamente qué?</h1>
        <p style={{ fontSize: 17, color: colors.inkMuted, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>Lucidez mide tu salud mental en seis dimensiones con psicometría validada. Sin diagnósticos. Sin jerga clínica. Con un plan real de lo que puedes hacer.</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/indice")} style={{ background: colors.ink, color: colors.cream, border: "none", padding: "12px 26px", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Hacer el Índice — gratis</button>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: colors.inkFaint, letterSpacing: "0.04em" }}>8 minutos · 18 preguntas · sin cuenta</span>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 48px" }} />

      <div style={{ padding: "0 32px 60px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>Lo que puede estar pasando</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {dims.map((d) => (
            <div key={d.name} style={{ background: colors.creamDark, borderRadius: 4, padding: 16, border: `0.5px solid ${colors.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, marginBottom: 10 }} />
              <strong style={{ display: "block", fontSize: 14, color: colors.ink, marginBottom: 4, fontWeight: "normal" }}>{d.name}</strong>
              <p style={{ fontSize: 13, color: colors.inkMuted, lineHeight: 1.5 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 48px" }} />

      <div style={{ padding: "0 32px 60px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>Cómo funciona</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", border: `0.5px solid ${colors.border}`, borderRadius: 4, overflow: "hidden" }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ padding: "20px 16px", borderRight: i < steps.length - 1 ? `0.5px solid ${colors.border}` : "none" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: colors.inkFaint, letterSpacing: "0.06em", marginBottom: 8 }}>{s.num}</div>
              <strong style={{ display: "block", fontSize: 14, fontWeight: "normal", marginBottom: 4, color: colors.ink }}>{s.title}</strong>
              <p style={{ fontSize: 12, color: colors.inkMuted, lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: colors.ink, borderRadius: 0, padding: "40px 32px", textAlign: "center", margin: "0 0 0 0" }}>
        <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 12, color: "#f7f4f0" }}>Empieza por entenderte</h2>
        <p style={{ fontSize: 14, color: "#b8b0a8", marginBottom: 24 }}>El Índice de Lucidez es gratis. Siempre.</p>
        <button onClick={() => navigate("/indice")} style={{ background: colors.cream, color: colors.ink, border: "none", padding: "12px 28px", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Hacer el Índice — 8 minutos</button>
      </div>

    </div>
  );
}
