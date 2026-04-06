import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  cream: "#f7f4f0",
  creamDark: "#ede9e3",
  ink: "#1a1714",
  inkMuted: "#6b6460",
  inkFaint: "#a09890",
  border: "rgba(26,23,20,0.12)",
};

const mono = "'Courier New', monospace";
const serif = "Georgia, 'Times New Roman', serif";

const tests = [
  {
    sigla: "MAAS",
    nombre: "Escala de Atención Consciente",
    dimension: "Presencia",
    color: "#3d7a65",
    que_mide: "Qué tan presente estás en tu propia vida.",
    para_que: "¿Vives el momento o tu mente siempre está en otro lado? Conocer esto te permite dejar de vivir en piloto automático y empezar a elegir dónde pones tu atención.",
  },
  {
    sigla: "ATQ",
    nombre: "Cuestionario de Pensamientos Automáticos",
    dimension: "Claridad cognitiva",
    color: "#9a5e2e",
    que_mide: "El ruido interno — los pensamientos negativos que aparecen solos.",
    para_que: "Conocer tus pensamientos automáticos es el primer paso para no dejar que dicten cómo te ves a ti mismo y cómo interpretas lo que te pasa.",
  },
  {
    sigla: "DERS",
    nombre: "Escala de Regulación Emocional",
    dimension: "Regulación emocional",
    color: "#6a3d82",
    que_mide: "Cómo manejas lo que sientes cuando las cosas se ponen difíciles.",
    para_que: "Entender tu regulación emocional explica por qué a veces actúas diferente a lo que habías decidido — y qué hacer para que eso cambie.",
  },
  {
    sigla: "VQ",
    nombre: "Cuestionario de Valores",
    dimension: "Alineación de valores",
    color: "#2d6382",
    que_mide: "La brecha entre lo que dices que importa y cómo realmente vives.",
    para_que: "Cerrar esa brecha es la diferencia entre una vida con dirección y una vida en reacción. Primero tienes que verla con claridad.",
  },
  {
    sigla: "SCS",
    nombre: "Escala de Autocompasión",
    dimension: "Autoconocimiento",
    color: "#4d6d2a",
    que_mide: "Cómo te tratas a ti mismo cuando fallas.",
    para_que: "Las personas que se conocen bien saben que la autocrítica destructiva no mejora nada. Este test te muestra exactamente cómo te hablas cuando más te necesitas.",
  },
  {
    sigla: "BSCS",
    nombre: "Escala Breve de Autocontrol",
    dimension: "Agencia",
    color: "#7a6520",
    que_mide: "Tu capacidad real de hacer lo que decides hacer.",
    para_que: "No es fuerza de voluntad — es un músculo medible. Conocer tu nivel de agencia te dice exactamente dónde empieza la brecha entre tus intenciones y tus acciones.",
  },
];

const pasos = [
  { num: "01", title: "Haces el Índice", desc: "18 preguntas. A tu ritmo. Sin cuenta requerida." },
  { num: "02", title: "La IA analiza tu perfil", desc: "Un reporte generado específicamente para ti, en segunda persona, basado en tus seis scores reales. No hay dos reportes iguales." },
  { num: "03", title: "Profundizas por dimensión", desc: "Evaluaciones completas con escalas validadas y reporte de IA por cada área." },
  { num: "04", title: "Conversas con el Acompañante", desc: "Un chat que ya conoce tu perfil completo y te ayuda a entender qué significa para tu vida concreta." },
];

export default function Home() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{ background: colors.cream, minHeight: "100vh", fontFamily: serif, color: colors.ink, fontSize: 15, lineHeight: 1.6 }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `0.5px solid ${colors.border}`, background: colors.cream, position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: serif, fontSize: 18, fontWeight: "normal", letterSpacing: "0.04em", color: colors.ink }}>lucidez</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button onClick={() => navigate("/indice")} style={{ fontFamily: mono, fontSize: 12, color: colors.inkMuted, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none" }}>El Índice</button>
          <button onClick={() => navigate("/login")} style={{ fontFamily: mono, fontSize: 12, color: colors.ink, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", border: "none", background: "none", padding: 0 }}>Entrar →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "60px 28px 48px" : "80px 48px 60px", textAlign: "center" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 24 }}>
          Autoconocimiento · Basado en ciencia · Con inteligencia artificial
        </p>
        <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: "normal", lineHeight: 1.2, marginBottom: 20, color: colors.ink, letterSpacing: "-0.01em" }}>
          ¿Quieres conocerte a ti mismo de una manera que nunca habías imaginado?
        </h1>
        <p style={{ fontSize: 17, color: colors.inkMuted, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
          Lucidez aplica seis tests psicológicos validados por la ciencia y genera un análisis personalizado con inteligencia artificial — específico para ti, no para un tipo genérico. En español. Gratis.
        </p>
        <button
          onClick={() => navigate("/indice")}
          style={{ background: colors.ink, color: colors.cream, border: "none", padding: "16px 32px", fontFamily: mono, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 32, marginBottom: 12 }}
        >
          Comenzar mi autoconocimiento →
        </button>
        <div style={{ fontFamily: mono, fontSize: 11, color: colors.inkFaint, letterSpacing: "0.04em" }}>
          Gratis · Sin cuenta · A tu ritmo
        </div>
      </section>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 60px" }} />

      {/* Los 6 tests */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 28px 60px" : "0 48px 60px" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 8 }}>
          Seis instrumentos psicológicos validados
        </p>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: "normal", marginBottom: 40, color: colors.ink, lineHeight: 1.3 }}>
          Una imagen completa de cómo funciona tu mente
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 20 }}>
          {tests.map((t) => (
            <div key={t.sigla} style={{ background: "#ffffff", border: `0.5px solid ${colors.border}`, borderRadius: 6, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: t.color }}>{t.dimension}</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: colors.inkFaint, marginLeft: "auto" }}>{t.sigla}</span>
              </div>
              <div style={{ fontSize: 15, color: colors.ink, marginBottom: 8, fontWeight: "normal" }}>{t.nombre}</div>
              <p style={{ fontSize: 13, color: colors.inkMuted, lineHeight: 1.6, marginBottom: 10 }}>
                <strong style={{ color: colors.ink, fontWeight: "normal" }}>Mide:</strong> {t.que_mide}
              </p>
              <p style={{ fontSize: 13, color: colors.inkMuted, lineHeight: 1.6 }}>{t.para_que}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 60px" }} />

      {/* Qué puedes lograr */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "0 28px 60px" : "0 48px 60px", textAlign: "center" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 8 }}>
          Lo que cambia cuando te conoces
        </p>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: "normal", marginBottom: 20, color: colors.ink, lineHeight: 1.3 }}>
          Conocerte cambia todo.
        </h2>
        <p style={{ fontSize: 16, color: colors.inkMuted, lineHeight: 1.8, marginBottom: 16 }}>
          Cuando sabes exactamente cómo funciona tu mente — no en general, sino con datos específicos tuyos — puedes dejar de repetir los mismos patrones.
        </p>
        <p style={{ fontSize: 16, color: colors.inkMuted, lineHeight: 1.8, marginBottom: 16 }}>
          Puedes tomar decisiones desde tus valores reales. Puedes entender por qué te pasa lo que te pasa, y qué hacer con eso.
        </p>
        <p style={{ fontSize: 16, color: colors.ink, lineHeight: 1.8, fontStyle: "italic" }}>
          Las personas que se conocen bien no viven en reacción — viven con intención.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: `0.5px solid ${colors.border}`, margin: "0 32px 60px" }} />

      {/* Cómo funciona */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 28px 60px" : "0 48px 60px" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.inkFaint, marginBottom: 8 }}>
          Cómo funciona
        </p>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: "normal", marginBottom: 40, color: colors.ink }}>
          Tu análisis, no una descripción genérica.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 0, border: `0.5px solid ${colors.border}`, borderRadius: 4, overflow: "hidden" }}>
          {pasos.map((s, i) => (
            <div key={s.num} style={{ padding: "24px 20px", borderRight: !isMobile && i < pasos.length - 1 ? `0.5px solid ${colors.border}` : "none", borderBottom: isMobile && i < pasos.length - 1 ? `0.5px solid ${colors.border}` : "none", background: "#ffffff" }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: colors.inkFaint, letterSpacing: "0.06em", marginBottom: 12 }}>{s.num}</div>
              <strong style={{ display: "block", fontSize: 14, fontWeight: "normal", marginBottom: 8, color: colors.ink }}>{s.title}</strong>
              <p style={{ fontSize: 13, color: colors.inkMuted, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <div style={{ background: colors.ink, padding: "60px 32px", textAlign: "center" }}>
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a09890", marginBottom: 16 }}>
          El mapa más preciso de cómo funciona tu mente
        </p>
        <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: "normal", marginBottom: 12, color: colors.cream, lineHeight: 1.3 }}>
          En español. Con datos. Gratis.
        </h2>
        <p style={{ fontSize: 15, color: "#b8b0a8", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          Contesta con honestidad. No hay respuestas correctas. El análisis es tuyo.
        </p>
        <button
          onClick={() => navigate("/indice")}
          style={{ background: colors.cream, color: colors.ink, border: "none", padding: "16px 32px", fontFamily: mono, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 32 }}
        >
          Comenzar mi autoconocimiento →
        </button>
      </div>

    </div>
  );
}
