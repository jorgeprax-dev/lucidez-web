import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

const mono = "'Courier New', monospace";
const serif = "Georgia, 'Times New Roman', serif";
const C = {
  cream: "#f7f4f0",
  creamDark: "#ede9e3",
  ink: "#1a1714",
  inkMuted: "#6b6460",
  inkFaint: "#a09890",
  border: "rgba(26,23,20,0.12)",
};

const DIMS = [
  { id: "presencia", label: "Presencia", color: "#3d7a65" },
  { id: "claridad", label: "Claridad", color: "#9a5e2e" },
  { id: "regulacion", label: "Regulación", color: "#6a3d82" },
  { id: "valores", label: "Valores", color: "#2d6382" },
  { id: "autoconocimiento", label: "Autoconocimiento", color: "#4d6d2a" },
  { id: "agencia", label: "Agencia", color: "#7a6520" },
];

export default function ReportePublico() {
  const { slug } = useParams();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("reportes_publicos")
      .select("scores, overall, nivel, frase")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setReporte(data);
        }
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!reporte) return;

    const titulo = `Mi Índice de Lucidez: ${reporte.overall}`;
    const descripcion = `Presencia · Claridad · Regulación · Valores · Autoconocimiento · Agencia. Conoce el tuyo en lucidez.app`;

    document.title = titulo;

    const setMeta = (property, content, isName = false) => {
      const attr = isName ? "name" : "property";
      let el = document.querySelector(`meta[${attr}="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", titulo);
    setMeta("og:description", descripcion);
    setMeta("og:url", window.location.href);
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary", true);
    setMeta("twitter:title", titulo, true);
    setMeta("twitter:description", descripcion, true);
  }, [reporte]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 12, color: C.inkFaint, letterSpacing: "0.08em" }}>
        Cargando...
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 16, color: C.inkMuted }}>
        Este reporte no existe o fue eliminado.
      </div>
    );
  }

  const zona = reporte.overall >= 80
    ? { label: "Zona verde", color: "#3d7a65", bg: "#edf4f0" }
    : reporte.overall >= 60
    ? { label: "Zona ámbar", color: "#9a5e2e", bg: "#f5ede4" }
    : { label: "Zona roja", color: "#8A3030", bg: "#f5e8e8" };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: serif, color: C.ink }}>
      <nav style={{ borderBottom: `0.5px solid ${C.border}`, background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: serif, fontSize: 17, color: C.ink }}>lucidez</a>
          <span style={{ fontFamily: mono, fontSize: 10, color: C.inkFaint, letterSpacing: "0.08em", textTransform: "uppercase" }}>Reporte compartido</span>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px 80px" }}>
        <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12, display: "block" }}>
          Índice de Lucidez
        </span>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 80, fontWeight: "normal", lineHeight: 1, color: zona.color, letterSpacing: "-0.03em" }}>
            {reporte.overall}
          </div>
          <div style={{ display: "inline-block", padding: "4px 12px", background: zona.bg, color: zona.color, fontFamily: mono, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 2 }}>
            {zona.label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "28px 0" }}>
          {DIMS.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: C.inkMuted, width: 140, flexShrink: 0 }}>
                {d.label}
              </div>
              <div style={{ flex: 1, height: 6, background: C.creamDark, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${reporte.scores?.[d.id] || 0}%`, background: d.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: mono, fontSize: 12, color: C.ink, width: 30, textAlign: "right", flexShrink: 0 }}>
                {reporte.scores?.[d.id] || 0}
              </div>
            </div>
          ))}
        </div>

        {reporte.frase && (
          <div style={{ background: "#ffffff", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: 24, marginBottom: 32 }}>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12, display: "block" }}>
              Del reporte
            </span>
            <p style={{ color: C.inkMuted, fontFamily: serif, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              {reporte.frase}
            </p>
          </div>
        )}

        <div style={{ background: C.ink, borderRadius: 6, padding: 28, textAlign: "center" }}>
          <div style={{ fontFamily: serif, fontSize: 18, color: C.cream, marginBottom: 8, fontWeight: "normal" }}>
            ¿Cuál es tu Índice de Lucidez?
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, color: C.inkFaint, marginBottom: 20, letterSpacing: "0.04em" }}>
            18 preguntas · 6 dimensiones · reporte con IA · gratis
          </div>
          <a
            href="/indice"
            style={{ display: "inline-block", background: C.cream, color: C.ink, textDecoration: "none", padding: "12px 28px", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2 }}
          >
            Medir ahora →
          </a>
        </div>
      </div>
    </div>
  );
}
