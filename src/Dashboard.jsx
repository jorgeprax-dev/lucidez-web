import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ESCALAS } from "./escalas";

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIMENSIONES = [
  { key: "presencia",        label: "Presencia" },
  { key: "claridad",         label: "Claridad cognitiva" },
  { key: "regulacion",       label: "Regulación emocional" },
  { key: "valores",          label: "Alineación de valores" },
  { key: "autoconocimiento", label: "Autoconocimiento" },
  { key: "agencia",          label: "Agencia" },
];

// Zonas basadas en escala 0–100
function zona(score) {
  if (score >= 80) return "verde";
  if (score >= 60) return "ambar";
  return "rojo";
}

function colorZona(z) {
  if (z === "verde") return "#639922";
  if (z === "ambar") return "#EF9F27";
  return "#E24B4A";
}

function labelZona(score) {
  if (score >= 80) return "Funcional";
  if (score >= 60) return "Trabajando";
  return "Crítico";
}

// ─── Estilos inline ───────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FAF7F2",
    fontFamily: "Georgia, serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px 16px",
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    backgroundColor: "#FAF7F2",
  },
  navLogo: {
    fontSize: "13px",
    letterSpacing: "0.1em",
    color: "#1A1A1A",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navUser: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
  },
  signOut: {
    fontSize: "12px",
    color: "#8A7F74",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    padding: 0,
  },
  tabBar: {
    display: "flex",
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    padding: "0 24px",
    backgroundColor: "#FAF7F2",
  },
  tab: (active) => ({
    padding: "12px 0",
    marginRight: "24px",
    fontSize: "13px",
    fontFamily: "Georgia, serif",
    color: active ? "#1A1A1A" : "#8A7F74",
    cursor: "pointer",
    borderBottom: active ? "2px solid #1A1A1A" : "2px solid transparent",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid #1A1A1A" : "2px solid transparent",
  }),
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px 24px 48px",
  },
  sectionLabel: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8A7F74",
    marginBottom: "14px",
    fontFamily: "Georgia, serif",
  },
  heroCard: {
    backgroundColor: "#F0EBE3",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroNumber: {
    fontSize: "52px",
    fontWeight: "400",
    color: "#1A1A1A",
    lineHeight: 1,
    fontFamily: "Georgia, serif",
  },
  heroSub: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    marginTop: "6px",
  },
  heroLabel: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    marginBottom: "6px",
  },
  heroGoal: {
    fontSize: "22px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    textAlign: "right",
  },
  heroGoalLabel: {
    fontSize: "11px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    marginBottom: "4px",
    textAlign: "right",
  },
  dimRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  dimName: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    width: "140px",
    flexShrink: 0,
  },
  dimBarWrap: {
    flex: 1,
    height: "6px",
    backgroundColor: "#E8E2D9",
    borderRadius: "3px",
    overflow: "hidden",
  },
  dimVal: {
    fontSize: "12px",
    color: "#1A1A1A",
    fontFamily: "Georgia, serif",
    width: "32px",
    textAlign: "right",
    flexShrink: 0,
  },
  legend: {
    display: "flex",
    gap: "14px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
  },
  divider: {
    height: "0.5px",
    backgroundColor: "rgba(0,0,0,0.08)",
    margin: "24px 0",
  },
  ctaCard: {
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "10px",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
  },
  ctaTitle: {
    fontSize: "14px",
    color: "#1A1A1A",
    marginBottom: "5px",
    fontFamily: "Georgia, serif",
  },
  ctaDesc: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    lineHeight: "1.5",
  },
  pill: (color, bg) => ({
    display: "inline-block",
    fontSize: "11px",
    fontFamily: "Georgia, serif",
    padding: "3px 10px",
    borderRadius: "20px",
    marginTop: "8px",
    backgroundColor: bg,
    color: color,
  }),
  chatBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "16px 20px",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    width: "100%",
    textAlign: "left",
    marginTop: "16px",
  },
  chatDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#639922",
    flexShrink: 0,
  },
  chatText: {
    fontSize: "14px",
    color: "#1A1A1A",
    fontFamily: "Georgia, serif",
  },
  chatSub: {
    fontSize: "12px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    marginTop: "2px",
  },
  // Progreso
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "16px",
  },
  chip: (active) => ({
    fontSize: "11px",
    fontFamily: "Georgia, serif",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "0.5px solid rgba(0,0,0,0.15)",
    backgroundColor: active ? "#1A1A1A" : "#FFFFFF",
    color: active ? "#FAF7F2" : "#8A7F74",
    cursor: "pointer",
  }),
  chartWrap: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "20px",
  },
  chartNote: {
    fontSize: "11px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    textAlign: "center",
    marginTop: "10px",
  },
  // Empty state
  emptyWrap: {
    textAlign: "center",
    padding: "48px 24px",
  },
  emptyTitle: {
    fontSize: "18px",
    color: "#1A1A1A",
    fontFamily: "Georgia, serif",
    marginBottom: "10px",
  },
  emptySub: {
    fontSize: "13px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    lineHeight: "1.7",
    marginBottom: "24px",
  },
  btnPrimary: {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: "#1A1A1A",
    color: "#FAF7F2",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "Georgia, serif",
    letterSpacing: "0.04em",
    cursor: "pointer",
    textDecoration: "none",
  },
  // Reporte
  reporteBox: {
    backgroundColor: "#FFFFFF",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "20px",
    fontSize: "13px",
    color: "#4A4540",
    fontFamily: "Georgia, serif",
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
  },
  fechaLabel: {
    fontSize: "11px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
    marginBottom: "12px",
  },
  loading: {
    textAlign: "center",
    padding: "60px 24px",
    fontSize: "13px",
    color: "#8A7F74",
    fontFamily: "Georgia, serif",
  },
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [session, setSession]     = useState(null);
  const [mediciones, setMediciones] = useState([]);
  const [evaluacionesProfundas, setEvaluacionesProfundas] = useState({});
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // Sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  // Cargar mediciones del usuario por email
  const cargarMediciones = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("indice_lucidez")
      .select("id, fecha, scores, overall, nivel, reporte, nombre")
      .eq("email", session.user.email)
      .order("fecha", { ascending: true });

    if (!error && data) setMediciones(data);

    // Carga evaluaciones profundas y las indexa por dimensión
    const { data: deepData, error: deepError } = await supabase
      .from("evaluacion_profunda")
      .select("dimension, overall, fecha, reporte")
      .eq("user_id", session.user.id)
      .order("fecha", { ascending: true });

    if (!deepError && deepData) {
      const deepMap = {};
      deepData.forEach((row) => {
        if (!row.dimension) return;
        const existing = deepMap[row.dimension];
        if (!existing || new Date(row.fecha) > new Date(existing.fecha)) {
          deepMap[row.dimension] = row;
        }
      });
      const deepScores = Object.fromEntries(
        Object.entries(deepMap).map(([dimension, item]) => [dimension, item.overall ?? 0])
      );
      setEvaluacionesProfundas(deepScores);
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    cargarMediciones();
  }, [cargarMediciones]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Datos derivados
  const ultima       = mediciones[mediciones.length - 1] ?? null;
  const indexScores  = ultima?.scores ?? {};
  const scores       = indexScores;
  const overall      = ultima?.overall ?? 0;
  const nombre       = ultima?.nombre?.split(" ")[0] ?? session?.user?.email?.split("@")[0] ?? "tú";
  const diasDesdeInicio = mediciones.length > 0
    ? Math.round((new Date() - new Date(mediciones[0].fecha)) / (1000 * 60 * 60 * 24))
    : 0;

  // Dimensiones en rojo (score < 60)
  const evaluadas = Object.keys(evaluacionesProfundas).length;
  const delta = mediciones.length > 1 ? overall - (mediciones[0].overall ?? 0) : 0;

  // ── Render: Loading ──
  if (loading) {
    return (
      <div style={S.page}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={S.loading}>Cargando tu perfil…</div>
        </div>
      </div>
    );
  }

  // ── Render: Sin mediciones ──
  if (mediciones.length === 0) {
    return (
      <div style={S.page}>
        <nav style={S.nav}>
          <span onClick={() => navigate("/")} style={{ ...S.navLogo, cursor: "pointer" }}>LUCIDEZ</span>
          <div style={S.navRight}>
              <span style={S.navUser}>{nombre}</span>
            <button style={S.signOut} onClick={handleSignOut}>Salir</button>
          </div>
        </nav>
        <div style={S.container}>
          <div style={S.emptyWrap}>
            <p style={S.emptyTitle}>Bienvenido a Lucidez.</p>
            <p style={S.emptySub}>
              El Índice de Lucidez es el punto de partida.<br />
              18 preguntas · 6 dimensiones · 8 minutos.<br />
              Tu reporte es inmediato.
            </p>
            <button style={S.btnPrimary} onClick={() => navigate("/indice")}>
              Hacer el Índice ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Con mediciones ──
  const navPad = isMobile ? "16px 20px" : "16px 40px";
  const secPad = isMobile ? "16px 20px" : "16px 40px";
  const fechaLabel = ultima
    ? new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
    : "";
  const ESCALA_DESC = {
    presencia: "MAAS-5 · qué tan presente estás en tu vida diaria",
    claridad: "ATQ-8 · frecuencia de pensamientos negativos automáticos",
    regulacion: "DERS-16 · cómo manejas tus emociones cuando te desbordan",
    valores: "VQ-8 · qué tan alineado estás con lo que realmente valoras",
    autoconocimiento: "SCS-12 · cómo te tratas a ti mismo cuando fallas",
    agencia: "BSCS-13 · tu capacidad de actuar según tus intenciones",
  };

  return (
    <div style={S.page}>
      {/* 1 — Nav */}
      <nav style={{ background: "#FAF7F2", padding: navPad, borderBottom: "0.5px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 16, color: "#1a1714" }}>lucidez</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ background: "#ede9e3", fontFamily: "'Courier New', monospace", fontSize: 11, borderRadius: 20, padding: "4px 10px", color: "#8A7F74" }}>
            {diasDesdeInicio > 0 ? `${nombre} · día ${diasDesdeInicio}` : nombre}
          </span>
          <button style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#8A7F74", background: "none", border: "none", cursor: "pointer" }} onClick={handleSignOut}>Salir</button>
        </div>
      </nav>

      {/* 2 — Score hero */}
      <div style={{ padding: isMobile ? "24px 20px 20px" : "24px 40px 20px", background: "#fff", borderBottom: "0.5px solid #ede9e3" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", marginBottom: 8 }}>
          ÍNDICE DE LUCIDEZ · {fechaLabel}
        </div>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 72, lineHeight: 1, color: colorZona(zona(overall)) }}>{overall}</div>
          <div style={{ height: 6, borderRadius: 3, background: "#ede9e3", marginTop: 12, width: "100%", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overall}%`, background: colorZona(zona(overall)), borderRadius: 3 }} />
          </div>
        </div>
      </div>

      {/* 3 — Dimensiones */}
      <div style={{ padding: secPad }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", marginBottom: 12 }}>
          TUS DIMENSIONES · {evaluadas} de 6 evaluadas
        </div>
        {DIMENSIONES.map((d) => {
          const s = scores[d.key] ?? 0;
          const deepScore = evaluacionesProfundas[d.key];
          const hasDeepEval = deepScore !== undefined;
          const zDeep = hasDeepEval ? zona(deepScore) : null;
          const cDeep = hasDeepEval ? colorZona(zDeep) : null;
          return (
            <div key={d.key} style={{ background: hasDeepEval ? "#fff" : "#FAFAF7", borderRadius: 10, border: hasDeepEval ? "0.5px solid #9FE1CB" : "0.5px solid #D3D1C7", padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1A1A1A", marginBottom: 2 }}>
                {d.label}
              </div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", marginBottom: 10 }}>
                {ESCALA_DESC[d.key]}
              </div>
              <div style={{ height: 3, background: "#ede9e3", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hasDeepEval ? deepScore : s}%`, background: hasDeepEval ? cDeep : colorZona(zona(s)), borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: hasDeepEval ? cDeep : colorZona(zona(s)) }}>
                    {hasDeepEval ? deepScore : s}
                  </span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", marginLeft: 6 }}>
                    {hasDeepEval ? `índice: ${s}` : "solo Índice"}
                  </span>
                </div>
                {hasDeepEval ? (
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button
                      onClick={() => navigate(`/evaluacion/${d.key}?modo=reporte`)}
                      style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#5BA08A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Ver mi reporte →
                    </button>
                    <button
                      onClick={() => navigate(`/evaluacion/${d.key}`)}
                      style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Repetir →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/evaluacion/${d.key}`)}
                    style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#5BA08A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Realizar evaluación →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 — Botón re-aplicar */}
      <div style={{ margin: isMobile ? "0 20px 32px" : "0 40px 32px" }}>
        <div
          onClick={() => navigate("/indice")}
          style={{ background: "#1a1714", borderRadius: 8, padding: "13px 16px", textAlign: "center", cursor: "pointer" }}
        >
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#f7f4f0", marginBottom: 2 }}>Re-aplicar el Índice</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#888780" }}>Mide tu progreso esta semana</div>
        </div>
      </div>
    </div>
  );
}
