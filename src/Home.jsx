import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "./theme";

export default function Home() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;
  const pad = isMobile ? "0 20px" : "0 48px";

  return (
    <div style={{ background: theme.bgSecondary, minHeight: "100vh", fontFamily: theme.sans, color: theme.ink }}>

      {/* Nav */}
      <nav style={{ background: theme.bg, padding: "12px 20px 16px", borderBottom: `0.5px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: theme.ink, letterSpacing: "-0.4px" }}>lucidez</span>
        <button onClick={() => navigate("/login")} style={{ fontSize: 15, color: theme.purple, background: "none", border: "none", cursor: "pointer", fontFamily: theme.sans }}>
          Iniciar sesión
        </button>
      </nav>

      {/* Hero */}
      <div style={{ background: theme.bg, padding: "40px 20px 32px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: theme.purpleLight, color: theme.purple, fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, marginBottom: 16 }}>
          Tests psicológicos validados
        </div>
        <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 700, color: theme.ink, lineHeight: 1.2, letterSpacing: "-0.5px", marginBottom: 12 }}>
          Conoce cómo funciona tu mente
        </h1>
        <p style={{ fontSize: 15, color: theme.inkFaint, lineHeight: 1.5, marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>
          Un mapa de tu funcionamiento mental en 6 dimensiones
        </p>
        <button
          onClick={() => navigate("/indice")}
          style={{ background: theme.purple, color: "#FFFFFF", border: "none", borderRadius: 14, padding: "16px 32px", fontSize: 17, fontWeight: 600, width: "100%", maxWidth: 400, cursor: "pointer", fontFamily: theme.sans, letterSpacing: "-0.2px" }}
        >
          Hacer el Índice gratis
        </button>
        <div style={{ fontSize: 12, color: "#8E8E93", marginTop: 10 }}>
          18 preguntas · 8 minutos · sin tarjeta
        </div>
      </div>

      {/* Separador */}
      <div style={{ background: theme.bgSecondary, height: 8 }} />

      {/* Dimensiones */}
      <div style={{ background: theme.bg, padding: "24px 20px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.ink, letterSpacing: "-0.3px", marginBottom: 4 }}>Lo que mide Lucidez</div>
        <div style={{ fontSize: 14, color: theme.inkFaint, marginBottom: 16 }}>6 dimensiones del funcionamiento mental</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Presencia", desc: "Qué tan presente estás en tu vida", color: theme.dims.presencia },
            { label: "Claridad", desc: "Frecuencia de pensamientos negativos", color: theme.dims.claridad },
            { label: "Regulación", desc: "Cómo manejas tus emociones", color: theme.dims.regulacion },
            { label: "Valores", desc: "Alineación con lo que importa", color: theme.dims.valores },
            { label: "Autoconocimiento", desc: "Cómo te tratas cuando fallas", color: theme.dims.autoconocimiento },
            { label: "Agencia", desc: "Capacidad de actuar tus intenciones", color: theme.dims.agencia },
          ].map((d) => (
            <div key={d.label} style={{ background: theme.bgSecondary, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.ink, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: "#8E8E93", lineHeight: 1.3 }}>{d.desc}</div>
              <div style={{ height: 3, borderRadius: 2, marginTop: 8, background: d.color, width: "70%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Separador */}
      <div style={{ background: theme.bgSecondary, height: 8 }} />

      {/* Por qué Lucidez */}
      <div style={{ background: theme.bg, padding: "24px 20px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.ink, letterSpacing: "-0.3px", marginBottom: 4 }}>Por qué Lucidez</div>
        <div style={{ fontSize: 14, color: theme.inkFaint, marginBottom: 16 }}>No es otro test de personalidad</div>
        {[
          { icon: "🔬", bg: theme.purpleLight, title: "Tests validados clínicamente", desc: "Los mismos instrumentos que usan psicólogos clínicos en investigación.", iconColor: theme.purple },
          { icon: "✦", bg: "#F0E8FF", title: "Análisis con IA en español", desc: "Reporte personalizado, no genérico", iconColor: "#AF52DE" },
          { icon: "★", bg: theme.greenLight, title: "Gratis para empezar", desc: "El Índice completo sin costo", iconColor: theme.green },
        ].map((c) => (
          <div key={c.title} style={{ background: theme.bgSecondary, borderRadius: 12, padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, color: c.iconColor }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.ink, marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: theme.inkFaint, lineHeight: 1.4 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", color: "#6C6C70", fontSize: 14, lineHeight: 1.6, marginTop: 32, marginBottom: 24, padding: "0 16px" }}>
        Lucidez es una herramienta de autoconocimiento. No reemplaza atención psicológica profesional. Si estás en crisis, llama a SAPTEL al 55 5259 8121.
      </div>

      {/* CTA final */}
      <div style={{ background: theme.bg, padding: "24px 20px 40px", textAlign: "center", borderTop: `0.5px solid ${theme.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.ink, marginBottom: 6, letterSpacing: "-0.3px" }}>¿Cuánto te conoces?</div>
        <div style={{ fontSize: 14, color: theme.inkFaint, marginBottom: 20 }}>Empieza ahora, sin tarjeta.</div>
        <button
          onClick={() => navigate("/indice")}
          style={{ background: theme.ink, color: "#FFFFFF", border: "none", borderRadius: 14, padding: "16px 32px", fontSize: 17, fontWeight: 600, width: "100%", cursor: "pointer", fontFamily: theme.sans }}
        >
          Comenzar ahora
        </button>
      </div>

    </div>
  );
}
