import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  cream: "#f7f4f0",
  creamDark: "#ede9e3",
  ink: "#1a1714",
  inkMuted: "#6b6460",
  inkFaint: "#6b6460",
  border: "rgba(26,23,20,0.12)",
};

const dimCapas = [
  {
    capa: "Cómo percibes",
    items: [
      { color: "#3d7a65", name: "Presencia", escala: "Escala de Atención Consciente", desc: "Qué tan presente estás en tu vida diaria vs en piloto automático" },
      { color: "#9a5e2e", name: "Claridad cognitiva", escala: "Cuestionario de Pensamientos Automáticos", desc: "Qué tan seguido te atrapan los pensamientos negativos sobre ti mismo" },
    ],
  },
  {
    capa: "Cómo procesas",
    items: [
      { color: "#6a3d82", name: "Regulación emocional", escala: "Escala de Dificultades en Regulación Emocional", desc: "Cómo manejas tus emociones cuando te desbordan" },
      { color: "#2d6382", name: "Autoconocimiento", escala: "Escala de Autocompasión", desc: "Qué tan bien te observas a ti mismo sin juzgarte" },
    ],
  },
  {
    capa: "Cómo actúas",
    items: [
      { color: "#4d6d2a", name: "Alineación de valores", escala: "Cuestionario de Valores", desc: "Si lo que haces cada día refleja lo que realmente te importa" },
      { color: "#7a6520", name: "Agencia", escala: "Escala Breve de Autocontrol", desc: "Si puedes convertir tus intenciones en acciones" },
    ],
  },
];

const steps = [
  { num: "01", title: "Haces el Índice", desc: "18 preguntas validadas clínicamente. 8 minutos. Gratis." },
  { num: "02", title: "Ves tu reporte", desc: "La IA analiza tu patrón específico entre las seis dimensiones y genera un diagnóstico personalizado. No un texto genérico — el tuyo." },
  { num: "03", title: "Profundizas donde importa", desc: "Evaluación detallada por dimensión con diagnóstico clínico preciso." },
  { num: "04", title: "Mides si algo cambia", desc: "Vuelve en una semana. El número te dice si algo se movió." },
];

export default function Home() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const mono = "'Courier New', monospace";
  const serif = "Georgia, 'Times New Roman', serif";

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;

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
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>
              Autoconocimiento · Basado en ciencia · Medido con datos
            </p>
            <h1 style={{ fontSize: 40, fontWeight: "normal", lineHeight: 1.2, marginBottom: 18, color: colors.ink, letterSpacing: "-0.01em" }}>
              ¿Quieres conocerte a ti mismo de una manera que nunca habías imaginado?
            </h1>
            <p style={{ fontSize: 15, color: colors.inkMuted, lineHeight: 1.7, maxWidth: 460, marginBottom: 24 }}>
              Lucidez mide cómo percibes la realidad, cómo la procesas, y cómo actúas en consecuencia — con datos precisos, no con intuición. Un modelo de IA analiza tu combinación específica de dimensiones y te devuelve un reporte personalizado.
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
              Seis dimensiones de tu mente
            </p>
            <div>
              {dimCapas.map((grupo, gi) => (
                <div key={grupo.capa} style={{ marginTop: gi === 0 ? 0 : 16 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: colors.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    {grupo.capa}
                  </div>
                  {grupo.items.map((d) => (
                    <div key={d.name} style={{ minWidth: 0, padding: "8px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, fontWeight: "normal", color: colors.ink }}>{d.name}</div>
                      </div>
                      <div style={{ fontFamily: mono, fontSize: 10, color: colors.inkFaint, letterSpacing: "0.04em", marginBottom: 4 }}>{d.escala}</div>
                      <p style={{ fontSize: 12, color: colors.inkMuted, lineHeight: 1.4, margin: 0 }}>{d.desc}</p>
                    </div>
                  ))}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", border: `0.5px solid ${colors.border}`, borderRadius: 4, overflow: "hidden" }}>
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
        <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 12, color: colors.cream }}>Empieza por conocerte</h2>
        <p style={{ fontSize: 14, color: "#b8b0a8", marginBottom: 24 }}>El Índice es gratis. Siempre lo será.</p>
        <button onClick={() => navigate("/indice")} style={{ background: colors.cream, color: colors.ink, border: "none", padding: "12px 28px", fontFamily: mono, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>
          Hacer el Índice — 8 minutos
        </button>
      </div>
    </div>
  );
}
