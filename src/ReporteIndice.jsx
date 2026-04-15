import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { generarReportePublico } from "./utils";
import { theme } from "./theme";

const C = theme;

const DIMS = [
  { id: "presencia", label: "Presencia", color: "#007AFF" },
  { id: "claridad", label: "Claridad Cognitiva", color: "#34C759" },
  { id: "regulacion", label: "Regulación Emocional", color: "#FF9500" },
  { id: "valores", label: "Alineación de Valores", color: "#AF52DE" },
  { id: "autoconocimiento", label: "Autoconocimiento", color: "#FF2D55" },
  { id: "agencia", label: "Agencia", color: "#5AC8FA" },
];

function zona(score) {
  if (score >= 75) return { label: "Zona verde", color: "#34C759", bg: "#F0FFF4" };
  if (score >= 50) return { label: "Zona amarilla", color: "#FF9500", bg: "#FFFBF0" };
  return { label: "Zona roja", color: "#FF3B30", bg: "#FFF5F5" };
}

export default function ReporteIndice() {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    async function cargar() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/"); return; }
      const { data } = await supabase
        .from("indice_lucidez")
        .select("id, fecha, scores, overall, nivel, reporte, nombre")
        .eq("user_id", session.user.id)
        .order("fecha", { ascending: false })
        .limit(1);
      if (data && data.length > 0) setIndice(data[0]);
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) return <div style={{ padding: 40, fontFamily: theme.sans, color: theme.inkFaint }}>Cargando...</div>;
  if (!indice) return <div style={{ padding: 40, fontFamily: theme.sans, color: theme.inkFaint }}>No encontramos tu reporte.</div>;

  const scores = indice.scores || {};
  const overall = indice.overall ?? 0;
  const z = zona(overall);
  const fecha = new Date(indice.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "32px 20px" : "48px 40px" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{ fontFamily: theme.sans, fontSize: 14, color: theme.inkFaint, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 32 }}
      >
        ← Volver al dashboard
      </button>

      <div style={{ marginBottom: 36 }}>
        <span style={{ fontFamily: theme.sans, fontSize: 13, fontWeight: 500, color: C.inkFaint, marginBottom: 12, display: "block" }}>
          Tu Índice de Lucidez
        </span>
        <div style={{ fontSize: 80, fontFamily: theme.sans, fontWeight: "normal", lineHeight: 1, color: z.color, letterSpacing: "-2px", marginBottom: 4 }}>
          {overall}
        </div>
        <div style={{ display: "inline-block", padding: "4px 12px", background: z.bg, color: z.color, fontFamily: theme.sans, fontSize: 13, fontWeight: 600, borderRadius: 20, marginBottom: 8 }}>
          {z.label}
        </div>
        <div style={{ fontFamily: theme.sans, fontSize: 11, color: C.inkFaint }}>
          {indice.nombre} · {fecha}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {DIMS.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: theme.sans, fontSize: 13, color: theme.ink, width: 130, flexShrink: 0 }}>{d.label.split(" ")[0]}</div>
            <div style={{ flex: 1, height: 6, background: theme.bgSecondary, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${scores[d.id] ?? 0}%`, background: d.color, borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: theme.sans, fontSize: 13, color: C.ink, width: 30, textAlign: "right", flexShrink: 0 }}>{scores[d.id] ?? 0}</div>
          </div>
        ))}
      </div>

      {indice.reporte && (
        <div style={{ background: theme.bgSecondary, borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <span style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, color: C.inkFaint, marginBottom: 16, display: "block", letterSpacing: "0.06em" }}>TU REPORTE</span>
          {indice.reporte.split("\n\n").map((p, i) => (
            <p key={i} style={{ color: theme.ink, fontFamily: theme.sans, fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>{p}</p>
          ))}
        </div>
      )}

      <button
        onClick={async () => {
          const slug = await generarReportePublico({
            scores: indice.scores,
            overall: indice.overall,
            nivel: indice.nivel,
            aiReport: indice.reporte || null,
          });
          if (slug) {
            const mensaje = encodeURIComponent("Acabo de descubrir cómo funciona mi mente. Mira mi reporte: " + window.location.origin + "/r/" + slug);
            const esMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const url = esMobile ? "whatsapp://send?text=" + mensaje : "https://wa.me/?text=" + mensaje;
            if (esMobile) { window.location.href = url; } else { window.open(url, "_blank"); }
          }
        }}
        style={{ width: "100%", background: "#25D366", color: "#FFFFFF", border: "none", padding: "13px 0", fontFamily: theme.sans, fontSize: 16, fontWeight: 600, cursor: "pointer", borderRadius: 14, marginBottom: 12 }}
      >
        Compartir por WhatsApp →
      </button>
      <button
        onClick={() => navigate("/dashboard")}
        style={{ width: "100%", background: theme.accent, color: "#FFFFFF", border: "none", padding: "13px 0", fontFamily: theme.sans, fontSize: 16, fontWeight: 600, cursor: "pointer", borderRadius: 14, marginBottom: 12 }}
      >
        Volver al dashboard →
      </button>
      <button
        onClick={() => navigate("/indice")}
        style={{ width: "100%", background: theme.bgSecondary, color: theme.purple, border: "none", padding: "13px 0", fontFamily: theme.sans, fontSize: 15, fontWeight: 500, cursor: "pointer", borderRadius: 14 }}
      >
        Repetir el Índice →
      </button>
    </div>
  );
}
