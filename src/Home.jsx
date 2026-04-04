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
  { color: "#3d7a65", name: "Conciencia plena", desc: "Piloto automático, distracción crónica" },
  { color: "#EF9F27", name: "Regulación emocional", desc: "Reacciones intensas, difícil calmarte" },
  { color: "#3d7a65", name: "Valores personales", desc: "Urgente vs lo que realmente importa" },
  { color: "#E24B4A", name: "Autocompasión", desc: "Autocrítica excesiva, exigencia interna" },
  { color: "#3d7a65", name: "Autocontrol", desc: "Impulsos, hábitos, postergación" },
  { color: "#EF9F27", name: "Atención plena", desc: "Rumia, mente dispersa" },
];

const steps = [
  { num: "01", title: "Haces el Índice", desc: "18 preguntas. 8 minutos. Gratis y sin cuenta." },
  { num: "02", title: "Ves tu reporte", desc: "Score por dimensión y patrón clínico generado con IA." },
  { num: "03", title: "Trabajas lo prioritario", desc: "Reporte profundo y contenido por dimensión." },
  { num: "04", title: "Mides tu progreso", desc: "Dashboard con historial y evolución longitudinal." },
];

export default function Home() {
  const navigate = useNavigate();
  const mono = "'Courier New', monospace";
  const serif = "Georgia, 'Times New Roman', serif";

  return (
    <div style={{ background: colors.cream, minHeight: "100vh", fontFamily: serif, color: colors.ink, fontSize: 15, lineHeight: 1.6 }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `0.5px solid ${colors.border}`, background: colors.cream, position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: "normal", letterSpacing: "0.04em", color: colors.ink }}>lucidez</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button onClick={() => navigate("/indice")} style={{ fontFamily: mono, fontSize: 12, color: colors.inkMuted, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>El Índice</button>
          <button style={{ fontFamily: mono, fontSize: 12, color: colors.inkMuted, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>Programa</button>
          <button onClick={() => navigate("/login")} style={{ fontFamily: mono, fontSize: 12, color: colors.ink, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none", padding: 0 }}>Entrar →</button>
        </div>
      </nav>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>
              Bienestar mental · Basado en ciencia · Medido con datos
            </p>
            <h1 style={{ fontSize: 40, fontWeight: "normal", lineHeight: 1.2, marginBottom: 18, color: colors.ink, letterSpacing: "-0.01em" }}>
              Entiende qué está pasando contigo
            </h1>
            <p style={{ fontSize: 15, color: colors.inkMuted, lineHeight: 1.7, maxWidth: 460, marginBottom: 24 }}>
              Un índice clínico gratuito que mide seis dimensiones de tu salud mental. Sin cuenta requerida. Sin juicios.
            </p>
            <button onClick={() => navigate("/indice")} style={{ background: colors.ink, color: colors.cream, border: "none", padding: "12px 24px", fontFamily: mono, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, marginBottom: 12 }}>
              Hacer el Índice — gratis
            </button>
            <div style={{ fontFamily: mono, fontSize: 11, color: colors.inkFaint, letterSpacing: "0.04em" }}>
              8 minutos · 18 preguntas · sin cuenta
            </div>
          </div>

          <div style={{ background: "#ffffff", border: `0.5px solid ${colors.border}`, borderRadius: 6, padding: 20 }}>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 14 }}>
              Lo que puede estar pasando
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {dims.map((d) => (
                <div key={d.name} style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, fontWeight: "normal", color: colors.ink }}>{d.name}</div>
                  </div>
                  <p style={{ fontSize: 12, color: colors.inkMuted, lineHeight: 1.4 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 48px" }} />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 60px" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>
          Cómo funciona
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", border: `0.5px solid ${colors.border}`, borderRadius: 4, overflow: "hidden" }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ padding: "22px 18px", borderRight: i < steps.length - 1 ? `0.5px solid ${colors.border}` : "none" }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: colors.inkFaint, letterSpacing: "0.06em", marginBottom: 10 }}>{s.num}</div>
              <strong style={{ display: "block", fontSize: 14, fontWeight: "normal", marginBottom: 6, color: colors.ink }}>{s.title}</strong>
              <p style={{ fontSize: 12, color: colors.inkMuted, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: colors.ink, borderRadius: 0, padding: "40px 32px", textAlign: "center", margin: "0 0 0 0" }}>
        <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 12, color: colors.cream }}>Empieza por entenderte</h2>
        <p style={{ fontSize: 14, color: "#b8b0a8", marginBottom: 24 }}>El Índice de Lucidez es gratis. Siempre.</p>
        <button onClick={() => navigate("/indice")} style={{ background: colors.cream, color: colors.ink, border: "none", padding: "12px 28px", fontFamily: mono, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>
          Hacer el Índice — 8 minutos
        </button>
      </div>
    </div>
  );
}
