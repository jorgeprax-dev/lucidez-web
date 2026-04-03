import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard", { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f7f4f0", color: "#1a1a1a", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #d0c8bc; border-radius: 2px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          nav a[href^="#"] { display: none; }
        }
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 48px", background: "#f7f4f0", borderBottom: "1px solid #e8e2d9" }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", letterSpacing: 0.5 }}>
          lucidez<span style={{ color: "#5BA08A", fontStyle: "italic" }}>.app</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {[["El Índice","#indice"],["El Programa","#programa"],["Base Científica","#ciencia"]].map(([label,href],i) => (
            <a key={i} href={href} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#888" }}>{label}</a>
          ))}
          <a href="/login" style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#5BA08A" }}>
            Entrar →
          </a>
        </div>
      </nav>

      <section style={{ padding: "48px 20px 64px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#aaa", textTransform: "uppercase", marginBottom: 24 }}>
          América Latina · IOP Digital · Basado en Evidencia
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 300, lineHeight: 1.12, marginBottom: 22, color: "#1a1a1a" }}>
          Tu primer mapa de bienestar mental. Basado en ciencia, medido con datos.
        </h1>
        <p style={{ fontSize: 17, color: "#666", lineHeight: 1.8, maxWidth: 560, marginBottom: 36, fontStyle: "italic" }}>
          Lucidez mide 6 dimensiones de tu bienestar con escalas psicométricas validadas, identifica dónde está el trabajo, y te da un camino claro para mejorar — sin etiquetas, sin diagnósticos, con datos reales.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <a href="/indice" style={{ padding: "13px 28px", background: "#5BA08A", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Georgia, serif" }}>
            Hacer mi mapa de bienestar →
          </a>
          <a href="/login" style={{ fontSize: 14, fontFamily: "Georgia, serif", color: "#5BA08A" }}>
            ¿Ya tienes cuenta? Entrar →
          </a>
        </div>
        <p style={{ marginTop: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#bbb", textTransform: "uppercase" }}>
          Gratis · Sin tarjeta · 8 minutos
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e8e2d9", margin: "0 48px" }} />

      <section id="indice" style={{ padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#5BA08A", textTransform: "uppercase", marginBottom: 40, fontWeight: 600 }}>
          Assessment · El instrumento
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 72 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 18, color: "#1a1a1a" }}>
              El Índice de <em style={{ color: "#5BA08A" }}>Lucidez</em>
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 14, fontStyle: "italic" }}>
              Un instrumento compuesto de seis escalas psicométricas validadas que mide tu estado funcional en seis dimensiones clave de bienestar mental.
            </p>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
              Es el punto de entrada al programa y tu instrumento de seguimiento longitudinal. Cada vez que lo repites, ves el delta — prueba real de que algo está cambiando.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { inst: "MAAS", dim: "Presencia", autor: "Brown & Ryan, 2003", pct: 70 },
              { inst: "ATQ", dim: "Claridad Cognitiva", autor: "Hollon & Kendall, 1980", pct: 45 },
              { inst: "DERS", dim: "Regulación Emocional", autor: "Gratz & Roemer, 2004", pct: 55 },
              { inst: "VQ", dim: "Alineación de Valores", autor: "Wilson et al., 2010", pct: 60 },
              { inst: "SCS-Neff", dim: "Autoconocimiento", autor: "Neff, 2003", pct: 50 },
              { inst: "SCS-Tangney", dim: "Agencia", autor: "Tangney et al., 2004", pct: 65 },
            ].map((d, i) => (
              <div key={i} style={{ background: "#faf8f5", border: "1px solid #e8e2d9", borderLeft: "3px solid #5BA08A", padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{d.dim}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#aaa", fontStyle: "italic" }}>{d.inst} · {d.autor}</span>
                </div>
                <div style={{ height: 3, background: "#e8e2d9" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: "#5BA08A" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e8e2d9", margin: "0 48px" }} />

      <section id="programa" style={{ background: "#faf8f5", borderTop: "1px solid #e8e2d9", borderBottom: "1px solid #e8e2d9", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#5BA08A", textTransform: "uppercase", marginBottom: 40, fontWeight: 600 }}>
            Estructura del IOP
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 300, lineHeight: 1.2, marginBottom: 14, color: "#1a1a1a" }}>
            La estructura de un programa clínico — diseñada para la vida cotidiana.
          </h2>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, maxWidth: 780, marginBottom: 30, fontStyle: "italic" }}>
            Los programas de salud mental más efectivos del mundo combinan evaluación, plan personalizado, tratamiento activo y seguimiento. Lucidez integra esa estructura en un sistema digital accesible desde cualquier lugar.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 2 }}>
            {[
              { num: "01", title: "Assessment", desc: "Índice de Lucidez. 6 escalas psicométricas validadas." },
              { num: "02", title: "Treatment Plan", desc: "IA genera un plan personalizado con justificación clínica visible." },
              { num: "03", title: "Tratamiento", desc: "8 módulos estructurados. CBT, DBT, ACT, Mindfulness." },
              { num: "04", title: "Acompañante", desc: "Chat con perfil precargado. Disponible 24/7." },
              { num: "05", title: "Discharge", desc: "Alta basada en scores funcionales ≥ 80 en todas las dimensiones." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#f7f4f0", border: "1px solid #e8e2d9", padding: "22px 18px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#5BA08A", letterSpacing: 1, marginBottom: 12 }}>{s.num}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e8e2d9", margin: "0 48px" }} />

      <section id="ciencia" style={{ padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#5BA08A", textTransform: "uppercase", marginBottom: 40, fontWeight: 600 }}>
          Marcos teóricos integrados
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 72 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 300, lineHeight: 1.2, marginBottom: 18, color: "#1a1a1a" }}>
              Lo mejor de la psicología clínica <em style={{ color: "#5BA08A" }}>en un solo sistema.</em>
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 14, fontStyle: "italic" }}>
              Lucidez integra cuatro marcos terapéuticos con evidencia sólida: CBT para reestructurar pensamientos automáticos, DBT para regular emociones de alta intensidad, ACT para alinear conducta con valores, y Mindfulness para entrenar la atención al momento presente.
            </p>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, fontStyle: "italic" }}>
              Efectivo para ansiedad, estrés, burnout, depresión leve-moderada, crisis de identidad y recuperación de adicciones. No reemplaza a un psiquiatra ni diagnostica — complementa y mide.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { marco: "CBT", nombre: "Terapia Cognitivo-Conductual", autor: "Beck, 1979", desc: "Reestructura pensamientos automáticos negativos" },
              { marco: "DBT", nombre: "Terapia Dialéctico-Conductual", autor: "Linehan, 1993", desc: "Regula emociones de alta intensidad" },
              { marco: "ACT", nombre: "Aceptación y Compromiso", autor: "Hayes, 2004", desc: "Alinea conducta con valores personales" },
              { marco: "MBSR", nombre: "Mindfulness-Based Stress Reduction", autor: "Kabat-Zinn, 1990", desc: "Entrena atención al momento presente" },
              { marco: "MI", nombre: "Entrevista Motivacional", autor: "Miller & Rollnick, 1991", desc: "Fortalece motivación intrínseca al cambio" },
              { marco: "12-Step", nombre: "Programa de 12 Pasos", autor: "AA, 1935", desc: "Estructura de recuperación por comunidad" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#faf8f5", border: "1px solid #e8e2d9", padding: "16px 14px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#5BA08A", marginBottom: 6 }}>{m.marco}</div>
                <div style={{ fontSize: 12, color: "#1a1a1a", marginBottom: 4, lineHeight: 1.4, fontWeight: 600 }}>{m.nombre}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#bbb", marginBottom: 6 }}>{m.autor}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, fontStyle: "italic" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#5BA08A", padding: "48px 20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 300, color: "#fff", marginBottom: 14, lineHeight: 1.2 }}>
          Empieza con tu mapa de bienestar.
        </h2>
        <p style={{ color: "#fff", fontSize: 16, marginBottom: 24, fontFamily: "Georgia, serif" }}>
          18 preguntas. 6 dimensiones. Reporte personalizado. Gratis.
        </p>
        <a href="/indice" style={{ display: "inline-block", padding: "14px 36px", background: "#1a1814", color: "#f4f0ea", fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 600 }}>
          Hacer mi mapa de bienestar →
        </a>
      </section>

      <footer style={{ padding: "20px 48px", borderTop: "1px solid #e8e2d9", display: "flex", justifyContent: "center", alignItems: "center", background: "#f7f4f0" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#bbb", textTransform: "uppercase" }}>
          © 2026 Lucidez · Tampico, México · Programa de bienestar mental basado en evidencia
        </p>
      </footer>
    </div>
  );
}
