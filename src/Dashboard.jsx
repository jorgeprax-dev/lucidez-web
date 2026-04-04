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
  const [tab, setTab]             = useState("hoy");
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [session, setSession]     = useState(null);
  const [mediciones, setMediciones] = useState([]);
  const [evaluacionesProfundas, setEvaluacionesProfundas] = useState({});
  const [loading, setLoading]     = useState(true);
  const [dimActiva, setDimActiva] = useState("presencia");

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
      .select("dimension, overall, fecha")
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
  const dimsRojas = DIMENSIONES.filter(d => (scores[d.key] ?? 0) < 60);

  // Historial por dimensión para la gráfica
  const historialDim = mediciones.map(m => ({
    fecha: new Date(m.fecha),
    score: m.scores?.[dimActiva] ?? 0,
  }));

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
  return (
    <div style={S.page}>
      <nav style={{ background: "#FAF7F2", padding: "14px 40px", borderBottom: "0.5px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 16, color: "#1A1A1A" }}>lucidez</span>
        {isMobile ? (
          <span style={{ background: "#ede9e3", fontFamily: "'Courier New', monospace", fontSize: 11, borderRadius: 20, padding: "4px 10px", color: "#1A1A1A" }}>
            {nombre}
          </span>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {[
              { key: "hoy", label: "Hoy" },
              { key: "progreso", label: "Progreso" },
              { key: "reporte", label: "Reporte" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12,
                  color: tab === t.key ? "#1A1A1A" : "#8A7F74",
                  borderBottom: tab === t.key ? "1.5px solid #1A1A1A" : "1.5px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
            <span style={{ background: "#ede9e3", fontFamily: "'Courier New', monospace", fontSize: 12, borderRadius: 20, padding: "4px 12px", color: "#1A1A1A" }}>
              {nombre} · día {diasDesdeInicio}
            </span>
            <button style={{ border: "none", background: "none", cursor: "pointer", padding: 0, fontFamily: "'Courier New', monospace", fontSize: 12, color: "#8A7F74" }} onClick={handleSignOut}>Salir</button>
          </div>
        )}
      </nav>

      {isMobile && (
        <div style={{ display: "flex", width: "100%", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
          {[
            { key: "hoy", label: "Hoy" },
            { key: "progreso", label: "Progreso" },
            { key: "reporte", label: "Reporte" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: tab === t.key ? "#1A1A1A" : "#8A7F74",
                borderBottom: tab === t.key ? "2px solid #1A1A1A" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", minHeight: "calc(100vh - 55px)" }}>
        {!isMobile && (
        <aside style={{ background: "#FFFFFF", borderRight: "0.5px solid rgba(0,0,0,0.1)", padding: "28px 24px" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a09890", marginBottom: 16 }}>
            Score general
          </div>
          <div style={{ fontSize: 64, lineHeight: 1, color: colorZona(zona(overall)), fontFamily: "Georgia, serif" }}>{overall}</div>
          <div style={{ display: "inline-block", marginTop: 8, marginBottom: 4, padding: "3px 10px", borderRadius: 2, fontFamily: "'Courier New', monospace", fontSize: 11, background: zona(overall) === "verde" ? "#edf4f0" : zona(overall) === "ambar" ? "#f5ede4" : "#FCE9E8", color: zona(overall) === "verde" ? "#3d7a65" : zona(overall) === "ambar" ? "#9a5e2e" : "#8A3030" }}>
            {labelZona(zona(overall))}
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890", marginBottom: 24 }}>
            {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
          </div>

          <div style={{ height: 0.5, background: "#ede9e3", marginBottom: 20 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a09890", marginBottom: 12 }}>
            Tus 6 dimensiones
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DIMENSIONES.map((d) => {
              const s = scores[d.key] ?? 0;
              const z = zona(s);
              return (
                <div key={d.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#1a1714" }}>{d.label}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#1a1714" }}>{s}</span>
                  </div>
                  <div style={{ height: 4, background: "#ede9e3", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s}%`, background: colorZona(z), borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ height: 0.5, background: "#ede9e3", margin: "20px 0" }} />
          <button
            onClick={() => navigate("/indice")}
            style={{ width: "100%", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 6, padding: "10px 14px", textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 12, color: "#888780", background: "#fff", cursor: "pointer" }}
          >
            Re-aplicar el Índice →
          </button>
        </aside>
        )}

        <div>

        {/* ── TAB: HOY ── */}
        {tab === "hoy" && (
          isMobile ? (
            <div>
              <div style={{ padding: "24px 20px 16px", background: "#fff", borderBottom: "0.5px solid #ede9e3" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  TU INDICE DE LUCIDEZ
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 64, lineHeight: 1, color: colorZona(zona(overall)) }}>{overall}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", marginBottom: 2 }}>OBJETIVO</div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#D3D1C7" }}>80</div>
                  </div>
                </div>
                <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 2, fontFamily: "'Courier New', monospace", fontSize: 11, background: zona(overall) === "verde" ? "#edf4f0" : zona(overall) === "ambar" ? "#f5ede4" : "#FCE9E8", color: zona(overall) === "verde" ? "#3d7a65" : zona(overall) === "ambar" ? "#9a5e2e" : "#8A3030", marginRight: 8 }}>
                  {labelZona(zona(overall))}
                </div>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890" }}>
                  {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #ede9e3" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  DIMENSION PRIORITARIA
                </div>
                {(() => {
                  const fallbackMin = DIMENSIONES.reduce((min, d) => (scores[d.key] ?? 0) < (scores[min.key] ?? 0) ? d : min, DIMENSIONES[0]);
                  const prioritaria = dimsRojas[0] || fallbackMin;
                  const pScore = scores[prioritaria.key] ?? 0;
                  return (
                    <div onClick={() => navigate(`/evaluacion/${prioritaria.key}`)} style={{ cursor: "pointer", background: "#fff", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.1)", borderLeft: "2px solid #E24B4A", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1a1714", marginBottom: 4 }}>{prioritaria.label}</div>
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890" }}>{pScore} · {labelZona(zona(pScore))}</div>
                      </div>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, background: "#FCE9E8", color: "#A32D2D", borderRadius: 4, padding: "4px 10px" }}>$49 →</span>
                    </div>
                  );
                })()}
              </div>

              <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #ede9e3" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  TUS 6 DIMENSIONES
                </div>
                {DIMENSIONES.map((d) => {
                  const s = scores[d.key] ?? 0;
                  const z = zona(s);
                  const c = colorZona(z);
                  const hasDeepEval = evaluacionesProfundas[d.key] !== undefined;
                  const badgeColor = z === "verde" ? "#3d7a65" : z === "ambar" ? "#9a5e2e" : "#8A3030";
                  const badgeBg = z === "verde" ? "#edf4f0" : z === "ambar" ? "#f5ede4" : "#FCE9E8";
                  return (
                    <div key={d.key} style={{ background: "#FAFAF7", borderRadius: 8, border: hasDeepEval ? "0.5px solid #9FE1CB" : "0.5px solid #D3D1C7", padding: "12px 14px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#1A1A1A" }}>{d.label}</span>
                        <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1A1A1A", lineHeight: 1 }}>{s}</span>
                      </div>
                      <div style={{ height: 4, background: "#ede9e3", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                        <div style={{ height: "100%", width: `${s}%`, backgroundColor: c, borderRadius: 2 }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ background: badgeBg, color: badgeColor, fontSize: 10, fontFamily: "'Courier New', monospace", padding: "4px 10px", borderRadius: "12px" }}>
                          {labelZona(z)}
                        </div>
                        <button onClick={() => navigate(`/evaluacion/${d.key}`)} style={{ background: "transparent", border: "none", color: "#5BA08A", fontSize: 10, fontFamily: "'Courier New', monospace", cursor: "pointer", padding: 0 }}>
                          {hasDeepEval ? "Ver reporte →" : "Evaluar - $49 →"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => navigate("/chat")}
                  style={{ border: "0.5px solid #D3D1C7", borderRadius: 8, padding: "14px 16px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#5BA08A", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1a1714" }}>Hablar con tu acompañante</div>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890" }}>Disponible 24/7 · Conoce tu perfil</div>
                  </div>
                </button>
                <button onClick={() => navigate("/indice")} style={{ border: "0.5px solid #D3D1C7", borderRadius: 8, padding: "12px 16px", textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 12, color: "#888780", background: "#fff", cursor: "pointer" }}>
                  Re-aplicar el Índice →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "28px 32px" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a09890", marginBottom: 16 }}>
                Dimensión prioritaria
              </div>
              {(() => {
                const fallbackMin = DIMENSIONES.reduce((min, d) => (scores[d.key] ?? 0) < (scores[min.key] ?? 0) ? d : min, DIMENSIONES[0]);
                const prioritaria = dimsRojas[0] || fallbackMin;
                const pScore = scores[prioritaria.key] ?? 0;
                return (
                  <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.1)", borderLeft: "2px solid #E24B4A", padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1a1714", marginBottom: 4 }}>{prioritaria.label}</div>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890" }}>{pScore} · {labelZona(zona(pScore))}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/evaluacion/${prioritaria.key}`)}
                      style={{ border: "none", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 11, background: "#FCE9E8", color: "#A32D2D", borderRadius: 4, padding: "4px 10px" }}
                    >
                      Reporte profundo — $49 →
                    </button>
                  </div>
                );
              })()}

              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a09890", marginBottom: 12 }}>
                Todas las dimensiones
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
                {DIMENSIONES.map(d => {
                  const s = scores[d.key] ?? 0;
                  const z = zona(s);
                  const c = colorZona(z);
                  const deepScore = evaluacionesProfundas[d.key];
                  const hasDeepEval = deepScore !== undefined;

                  const badgeColor = z === "verde" ? "#3d7a65" : z === "ambar" ? "#9a5e2e" : "#8A3030";
                  const badgeBg = z === "verde" ? "#edf4f0" : z === "ambar" ? "#f5ede4" : "#FCE9E8";

                  return (
                    <div
                      key={d.key}
                      style={{
                        background: "#FAFAF7",
                        border: hasDeepEval ? "0.5px solid #5BA08A33" : "0.5px solid rgba(0,0,0,0.1)",
                        borderRadius: "10px",
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "normal" }}>
                          {d.label}
                        </span>
                        <span style={{ fontSize: "24px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "normal", lineHeight: 1 }}>
                          {s}
                        </span>
                      </div>

                      <div style={{ height: "4px", background: "#ede9e3", borderRadius: "2px", marginBottom: "12px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${s}%`, backgroundColor: c, borderRadius: "2px" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ background: badgeBg, color: badgeColor, fontSize: "10px", fontFamily: "'Courier New', monospace", padding: "4px 10px", borderRadius: "12px" }}>
                          {labelZona(z)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          {hasDeepEval ? (
                            <div style={{ color: "#5BA08A", fontFamily: "'Courier New', monospace", fontSize: "10px" }}>✓ Evaluado</div>
                          ) : (
                            <button
                              onClick={() => navigate(`/evaluacion/${d.key}`)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#5BA08A",
                                fontSize: "10px",
                                fontFamily: "'Courier New', monospace",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              Evaluar →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/chat")}
                style={{
                  width: "100%",
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#5BA08A", flexShrink: 0 }} />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "14px", color: "#1a1714", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0, marginBottom: "2px" }}>
                    Hablar con tu acompañante
                  </p>
                  <p style={{ fontSize: "11px", color: "#a09890", fontFamily: "'Courier New', monospace", margin: 0 }}>
                    Disponible 24/7 · Conoce tu perfil
                  </p>
                </div>
              </button>
            </div>
          )
        )}

        {/* ── TAB: PROGRESO ── */}
        {tab === "progreso" && (
          isMobile ? (
            <div style={{ padding: 20 }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Score general
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 56, lineHeight: 1, color: colorZona(zona(overall)), marginBottom: 12 }}>
                {overall}
              </div>

              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <svg width="100%" height="200" viewBox="0 0 640 200" style={{ display: "block" }}>
                  <defs>
                    <pattern id="lines-mobile" patternUnits="userSpaceOnUse" width="30" height="30">
                      <line x1="0" y1="0" x2="30" y2="0" stroke="#F0EBE3" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <line x1="40" y1="10" x2="40" y2="160" stroke="#E8E2D9" strokeWidth="1" />
                  <line x1="40" y1="160" x2="630" y2="160" stroke="#E8E2D9" strokeWidth="1" />
                  {[0, 50, 100].map((v, i) => {
                    const y = 160 - (v / 100) * 150;
                    return (
                      <g key={i}>
                        <text x="25" y={y + 4} fontSize="9" fill="#B0A89E" textAnchor="end">{v}</text>
                        {v !== 0 && <line x1="35" y1={y} x2="630" y2={y} stroke="#F0EBE3" strokeWidth="1" strokeDasharray="4,2" />}
                      </g>
                    );
                  })}
                  <line x1="40" y1={160 - (80 / 100) * 150} x2="630" y2={160 - (80 / 100) * 150} stroke="#EF9F27" strokeWidth="2" strokeDasharray="5,3" />
                  {mediciones.length > 0 && (
                    <>
                      {mediciones.map((m, idx) => {
                        const x = 40 + ((idx + 1) / mediciones.length) * 590;
                        const y = 160 - ((m.overall ?? 0) / 100) * 150;
                        return <circle key={idx} cx={x} cy={y} r="4" fill={colorZona(zona(m.overall ?? 0))} />;
                      })}
                      {mediciones.length > 1 && (
                        <polyline
                          points={mediciones.map((m, idx) => {
                            const x = 40 + ((idx + 1) / mediciones.length) * 590;
                            const y = 160 - ((m.overall ?? 0) / 100) * 150;
                            return `${x},${y}`;
                          }).join(" ")}
                          fill="none"
                          stroke="#EF9F27"
                          strokeWidth="2"
                        />
                      )}
                    </>
                  )}
                </svg>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {DIMENSIONES.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDimActiva(d.key)}
                    style={{ fontFamily: "'Courier New', monospace", fontSize: 11, padding: "6px 10px", borderRadius: 20, border: dimActiva === d.key ? "1px solid #1A1A1A" : "1px solid #E8E2D9", background: dimActiva === d.key ? "#1A1A1A" : "#fff", color: dimActiva === d.key ? "#fff" : "#8A7F74", cursor: "pointer" }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#a09890", textTransform: "uppercase", marginBottom: 6 }}>
                  Dimension activa
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1A1A1A" }}>{DIMENSIONES.find((d) => d.key === dimActiva)?.label}</span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 28, color: colorZona(zona(scores[dimActiva] ?? 0)) }}>{scores[dimActiva] ?? 0}</span>
                </div>
              </div>
            </div>
          ) : (
          <div style={{ padding: "28px 32px", maxWidth: "860px" }}>
            {/* Score General */}
            <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "0 0 6px 0" }}>Score actual</p>
                  <p style={{ fontSize: "32px", fontWeight: "400", color: colorZona(zona(overall)), fontFamily: "Georgia, serif", margin: 0 }}>
                    {overall}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", marginBottom: "4px" }}>Objetivo</p>
                  <p style={{ fontSize: "20px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: 0 }}>80</p>
                </div>
              </div>
              {mediciones.length > 1 && (
                <p style={{ fontSize: "12px", color: "#639922", fontFamily: "Georgia, serif", margin: "8px 0 0 0" }}>
                  ↑ +{overall - (mediciones[0].overall ?? 0)} desde el baseline
                </p>
              )}
              {/* Gráfica General */}
              <svg width="100%" height="200" viewBox="0 0 640 200" style={{ marginTop: "16px" }}>
                <defs>
                  <pattern id="lines" patternUnits="userSpaceOnUse" width="30" height="30">
                    <line x1="0" y1="0" x2="30" y2="0" stroke="#F0EBE3" strokeWidth="1" />
                  </pattern>
                </defs>
                {/* Grid */}
                <line x1="40" y1="10" x2="40" y2="160" stroke="#E8E2D9" strokeWidth="1" />
                <line x1="40" y1="160" x2="630" y2="160" stroke="#E8E2D9" strokeWidth="1" />

                {/* Y-axis labels */}
                {[0, 50, 100].map((v, i) => {
                  const y = 160 - (v / 100) * 150;
                  return (
                    <g key={i}>
                      <text x="25" y={y + 4} fontSize="9" fill="#B0A89E" textAnchor="end">
                        {v}
                      </text>
                      {v !== 0 && <line x1="35" y1={y} x2="630" y2={y} stroke="#F0EBE3" strokeWidth="1" strokeDasharray="4,2" />}
                    </g>
                  );
                })}

                {/* Objetivo line */}
                <line x1="40" y1={160 - (80 / 100) * 150} x2="630" y2={160 - (80 / 100) * 150} stroke="#EF9F27" strokeWidth="2" strokeDasharray="5,3" />

                {/* Data points */}
                {mediciones.length > 0 && (
                  <>
                    {mediciones.map((m, idx) => {
                      const x = 40 + ((idx + 1) / mediciones.length) * 590;
                      const y = 160 - ((m.overall ?? 0) / 100) * 150;
                      return (
                        <circle key={idx} cx={x} cy={y} r="4" fill={colorZona(zona(m.overall ?? 0))} />
                      );
                    })}

                    {/* Bezier curve */}
                    {mediciones.length > 1 && (
                      <polyline
                        points={mediciones
                          .map((m, idx) => {
                            const x = 40 + ((idx + 1) / mediciones.length) * 590;
                            const y = 160 - ((m.overall ?? 0) / 100) * 150;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#EF9F27"
                        strokeWidth="2"
                      />
                    )}

                    {/* X-axis labels (fechas) */}
                    {mediciones.length > 0 && (
                      <>
                        <text x="40" y="178" fontSize="9" fill="#B0A89E" textAnchor="middle">
                          {new Date(mediciones[0].fecha).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                        </text>
                        {mediciones.length > 1 && (
                          <text x="630" y="178" fontSize="9" fill="#B0A89E" textAnchor="middle">
                            {new Date(mediciones[mediciones.length - 1].fecha).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                          </text>
                        )}
                      </>
                    )}
                  </>
                )}
              </svg>
            </div>

            {/* Por Dimensión */}
            <p style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A89E", marginBottom: "14px", fontWeight: 600 }}>
              Por dimensión
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {DIMENSIONES.map(d => (
                <button
                  key={d.key}
                  onClick={() => setDimActiva(d.key)}
                  style={{
                    fontSize: "11px",
                    fontFamily: "Georgia, serif",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: dimActiva === d.key ? "1px solid #1A1A1A" : "1px solid #E8E2D9",
                    backgroundColor: dimActiva === d.key ? "#1A1A1A" : "#FFFFFF",
                    color: dimActiva === d.key ? "#FFFFFF" : "#8A7F74",
                    cursor: "pointer",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Gráfica Dimensión Activa */}
            <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "0 0 6px 0" }}>Score actual</p>
                  <p style={{ fontSize: "28px", fontWeight: "400", color: colorZona(zona(scores[dimActiva] ?? 0)), fontFamily: "Georgia, serif", margin: 0 }}>
                    {scores[dimActiva] ?? 0}
                  </p>
                </div>
                {mediciones.length > 1 && (
                  <p style={{ fontSize: "12px", color: "#639922", fontFamily: "Georgia, serif" }}>
                    ↑ +{(scores[dimActiva] ?? 0) - (mediciones[0].scores?.[dimActiva] ?? 0)}
                  </p>
                )}
              </div>

              {/* Leyenda */}
              <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#8A7F74", fontFamily: "Georgia, serif", marginBottom: "14px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="20" height="12" style={{ display: "block", flexShrink: 0 }}>
                    <line x1="2" y1="6" x2="18" y2="6" stroke="#EF9F27" strokeWidth="2" />
                  </svg>
                  Índice
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="16" height="12" style={{ display: "block", flexShrink: 0 }}>
                    <circle cx="8" cy="6" r="4" fill="none" stroke="#7F77DD" strokeWidth="1.5" />
                  </svg>
                  Eval. profunda
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="20" height="12" style={{ display: "block", flexShrink: 0 }}>
                    <line x1="2" y1="6" x2="18" y2="6" stroke="#E8E2D9" strokeWidth="2" strokeDasharray="4,2" />
                  </svg>
                  Objetivo
                </div>
              </div>

              {/* Gráfica Dimensión */}
              <svg width="100%" height="220" viewBox="0 0 640 220">
                {/* Grid */}
                <line x1="40" y1="10" x2="40" y2="170" stroke="#E8E2D9" strokeWidth="1" />
                <line x1="40" y1="170" x2="630" y2="170" stroke="#E8E2D9" strokeWidth="1" />

                {/* Y-axis labels */}
                {[0, 50, 100].map((v, i) => {
                  const y = 170 - (v / 100) * 160;
                  return (
                    <g key={i}>
                      <text x="25" y={y + 4} fontSize="9" fill="#B0A89E" textAnchor="end">
                        {v}
                      </text>
                      {v !== 0 && <line x1="35" y1={y} x2="630" y2={y} stroke="#F0EBE3" strokeWidth="1" />}
                    </g>
                  );
                })}

                {/* Objetivo line */}
                <line x1="40" y1={170 - (80 / 100) * 160} x2="630" y2={170 - (80 / 100) * 160} stroke="#E8E2D9" strokeWidth="2" strokeDasharray="5,3" />

                {/* Índice line and points */}
                {mediciones.length > 0 && (
                  <>
                    {mediciones.length > 1 && (
                      <polyline
                        points={mediciones
                          .map((m, idx) => {
                            const x = 40 + ((idx + 1) / mediciones.length) * 590;
                            const y = 170 - ((m.scores?.[dimActiva] ?? 0) / 100) * 160;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#EF9F27"
                        strokeWidth="2"
                      />
                    )}

                    {mediciones.map((m, idx) => {
                      const x = 40 + ((idx + 1) / mediciones.length) * 590;
                      const y = 170 - ((m.scores?.[dimActiva] ?? 0) / 100) * 160;
                      return (
                        <circle key={`index-${idx}`} cx={x} cy={y} r="3" fill="#EF9F27" />
                      );
                    })}

                    {/* Evaluaciones Profundas */}
                    {evaluacionesProfundas[dimActiva] !== undefined && (
                      mediciones.map((m, idx) => {
                        const deepEval = evaluacionesProfundas[dimActiva];
                        if (!deepEval) return null;

                        const x = 40 + ((idx + 1) / mediciones.length) * 590;
                        const y = 170 - (deepEval / 100) * 160;

                        return (
                          <g key={`deep-${idx}`}>
                            {/* Tooltip */}
                            <rect x={x - 45} y={y - 38} width="90" height="24" rx="4" fill="#EEEDFE" />
                            <text x={x} y={y - 20} fontSize="10" fill="#3C3489" textAnchor="middle" fontWeight="600">
                              Eval. profunda
                            </text>
                            <text x={x} y={y - 10} fontSize="11" fill="#3C3489" textAnchor="middle" fontWeight="700">
                              {deepEval}
                            </text>

                            {/* Circle */}
                            <circle cx={x} cy={y} r="7" fill="#FFFFFF" stroke="#7F77DD" strokeWidth="2" />
                            <circle cx={x} cy={y} r="3" fill="#7F77DD" />
                          </g>
                        );
                      })
                    )}

                    {/* X-axis labels */}
                    <text x="40" y="190" fontSize="9" fill="#B0A89E" textAnchor="middle">
                      {new Date(mediciones[0].fecha).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                    </text>
                    {mediciones.length > 1 && (
                      <text x="630" y="190" fontSize="9" fill="#B0A89E" textAnchor="middle">
                        {new Date(mediciones[mediciones.length - 1].fecha).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                      </text>
                    )}
                  </>
                )}
              </svg>
            </div>

            {mediciones.length === 1 && (
              <p style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif", marginTop: "16px", textAlign: "center" }}>
                Aplica el Índice nuevamente para ver tu evolución en el tiempo.
              </p>
            )}
          </div>
          )
        )}

        {/* ── TAB: REPORTE ── */}
        {tab === "reporte" && (
          isMobile ? (
            <div style={{ padding: 20 }}>
              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#1A1A1A" }}>{nombre}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#a09890" }}>
                    {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 44, lineHeight: 1, color: colorZona(zona(overall)) }}>{overall}</div>
              </div>

              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#1A1A1A", marginBottom: 10 }}>Análisis personalizado</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#4A4540", lineHeight: 1.8 }}>
                  {(ultima.reporte ?? "No hay reporte disponible para esta medición.").split("\n\n").map((p, i) => (
                    <p key={i} style={{ margin: "0 0 10px 0" }}>{p}</p>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                {DIMENSIONES.map((d, i) => {
                  const s = scores[d.key] ?? 0;
                  return (
                    <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < DIMENSIONES.length - 1 ? 10 : 0 }}>
                      <div style={{ flex: 1, fontFamily: "Georgia, serif", fontSize: 12, color: "#1A1A1A" }}>{d.label}</div>
                      <div style={{ width: 80, height: 4, background: "#E8E2D9", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${s}%`, background: colorZona(zona(s)) }} />
                      </div>
                      <div style={{ width: 24, textAlign: "right", fontFamily: "'Courier New', monospace", fontSize: 11, color: "#1A1A1A" }}>{s}</div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const reportText = `Mi reporte de Lucidez:\n\nScore general: ${overall}\nDía ${diasDesdeInicio} del programa\n\n${ultima.reporte}`;
                  navigator.clipboard?.writeText(reportText);
                  alert("Reporte copiado al portapapeles");
                }}
                style={{ width: "100%", padding: "12px 16px", background: "transparent", border: "1px solid #E8E2D9", borderRadius: 8, color: "#8A7F74", fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer" }}
              >
                Compartir con mi terapeuta →
              </button>
            </div>
          ) : (
          <div style={{ padding: "28px 32px", maxWidth: "860px" }}>
            {/* Header */}
            <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "20px", color: "#1A1A1A", fontFamily: "Georgia, serif", margin: "0 0 12px 0" }}>
                  Reporte de Lucidez
                </h2>
                <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "2px 0" }}>
                  {nombre}
                </p>
                <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "2px 0" }}>
                  {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "2px 0" }}>
                  Día {diasDesdeInicio} del programa
                </p>
                <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "2px 0" }}>
                  {mediciones.length} {mediciones.length === 1 ? "medición" : "mediciones"} · {Object.keys(evaluacionesProfundas).length} evaluaciones profundas
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "52px", fontWeight: "400", color: colorZona(zona(overall)), fontFamily: "Georgia, serif", margin: "0 0 4px 0" }}>
                  {overall}
                </p>
                <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: 0 }}>
                  Score general · {labelZona(zona(overall))}
                </p>
              </div>
            </div>

            {/* Dimensiones */}
            <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
              {DIMENSIONES.map(d => {
                const s = scores[d.key] ?? 0;
                const z = zona(s);
                const c = colorZona(z);
                const deepScore = evaluacionesProfundas[d.key];
                const hasDeepEval = deepScore !== undefined;

                const badgeColor = z === "verde" ? "#639922" : z === "ambar" ? "#EF9F27" : "#E24B4A";
                const badgeBg = z === "verde" ? "#F0F7F4" : z === "ambar" ? "#FEF5E8" : "#FCE9E8";

                return (
                  <div key={d.key} style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid #F0EBE3", alignItems: "center" }}>
                    {/* Nombre */}
                    <span style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", minWidth: "160px" }}>
                      {d.label}
                    </span>

                    {/* Barra */}
                    <div style={{ flex: 1, height: "5px", background: "#E8E2D9", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s}%`, backgroundColor: c, borderRadius: "2px" }} />
                    </div>

                    {/* Score */}
                    <span style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", minWidth: "30px", textAlign: "right" }}>
                      {s}
                    </span>

                    {/* Badge */}
                    <div style={{ background: hasDeepEval ? "#EEEDFE" : badgeBg, color: hasDeepEval ? "#7F77DD" : badgeColor, fontSize: "10px", fontFamily: "Georgia, serif", padding: "4px 10px", borderRadius: "12px", minWidth: "60px", textAlign: "center" }}>
                      {hasDeepEval ? "Evaluado" : labelZona(s)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evaluaciones Profundas */}
            {Object.keys(evaluacionesProfundas).length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A89E", marginBottom: "12px", fontWeight: 600 }}>
                  Evaluaciones profundas
                </p>
                {DIMENSIONES.map(d => {
                  const deepScore = evaluacionesProfundas[d.key];
                  if (deepScore === undefined) return null;

                  const escala = ESCALAS[d.key];
                  const nivel = deepScore >= 70 ? "alto" : deepScore >= 40 ? "medio" : "bajo";
                  const interpretacion = escala?.interpretacion?.[nivel] || "";

                  return (
                    <div key={d.key} style={{ background: "#FFFFFF", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "16px 20px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <p style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", margin: 0 }}>
                            {d.label}
                          </p>
                          <p style={{ fontSize: "11px", color: "#B0A89E", fontFamily: "Georgia, serif", margin: "4px 0 0 0" }}>
                            {escala?.escala}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "20px", color: "#7F77DD", fontFamily: "Georgia, serif", fontWeight: "600", margin: 0 }}>
                            {deepScore}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "#4A4540", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: "1.6", margin: "8px 0 0 0" }}>
                        {interpretacion}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Evolución */}
            {mediciones.length > 1 && (
              <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", marginBottom: "12px" }}>Evolución</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid #F0EBE3" }}>
                  <span style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif" }}>Score general</span>
                  <span style={{ fontSize: "13px", color: "#639922", fontFamily: "Georgia, serif", fontWeight: "600" }}>
                    ↑ +{overall - (mediciones[0].overall ?? 0)}
                  </span>
                </div>

                {(() => {
                  const deltas = DIMENSIONES.map(d => ({
                    key: d.key,
                    label: d.label,
                    delta: (scores[d.key] ?? 0) - (mediciones[0].scores?.[d.key] ?? 0),
                  }));
                  const maxDelta = deltas.reduce((a, b) => a.delta > b.delta ? a : b);
                  return (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid #F0EBE3" }}>
                      <span style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif" }}>Mayor mejora</span>
                      <span style={{ fontSize: "13px", color: "#639922", fontFamily: "Georgia, serif", fontWeight: "600" }}>
                        {maxDelta.label} (↑ +{maxDelta.delta})
                      </span>
                    </div>
                  );
                })()}

                {(() => {
                  const gaps = DIMENSIONES.map(d => ({
                    key: d.key,
                    label: d.label,
                    gap: 80 - (scores[d.key] ?? 0),
                  }));
                  const maxGap = gaps.reduce((a, b) => a.gap > b.gap ? a : b);
                  return (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", marginBottom: "12px", borderBottom: "1px solid #F0EBE3" }}>
                      <span style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif" }}>Mayor trabajo pendiente</span>
                      <span style={{ fontSize: "13px", color: "#E24B4A", fontFamily: "Georgia, serif", fontWeight: "600" }}>
                        {maxGap.label}
                      </span>
                    </div>
                  );
                })()}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif" }}>Días en el programa</span>
                  <span style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600" }}>
                    {diasDesdeInicio} {diasDesdeInicio === 1 ? "día" : "días"}
                  </span>
                </div>
              </div>
            )}

            {/* Reporte Narrativo */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", marginBottom: "12px" }}>
                Análisis personalizado
              </p>
              <div style={{ fontSize: "14px", color: "#4A4540", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: "1.9" }}>
                {(ultima.reporte ?? "No hay reporte disponible para esta medición.").split("\n\n").map((p, i) => (
                  <p key={i} style={{ margin: "0 0 12px 0" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Historial */}
            {mediciones.length > 1 && (
              <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600", marginBottom: "12px" }}>
                  Historial de mediciones
                </p>
                {[...mediciones].reverse().map((m, i) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", marginBottom: "10px", borderBottom: i < mediciones.length - 1 ? "1px solid #F0EBE3" : "none" }}>
                    <span style={{ fontSize: "12px", color: "#8A7F74", fontFamily: "Georgia, serif" }}>
                      {new Date(m.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span style={{ fontSize: "12px", color: "#1A1A1A", fontFamily: "Georgia, serif", fontWeight: "600" }}>
                      {m.overall} · {m.nivel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Botón Compartir */}
            <button
              onClick={() => {
                const reportText = `Mi reporte de Lucidez:\n\nScore general: ${overall}\nDía ${diasDesdeInicio} del programa\n\n${ultima.reporte}`;
                navigator.clipboard?.writeText(reportText);
                alert("Reporte copiado al portapapeles");
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                border: "1px solid #E8E2D9",
                borderRadius: "8px",
                color: "#8A7F74",
                fontFamily: "Georgia, serif",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Compartir con mi terapeuta →
            </button>
          </div>
          )
        )}

        </div>
      </div>
    </div>
  );
}

// ─── Gráfica SVG de progreso ──────────────────────────────────────────────────

function GraficaProgreso({ historial, dimLabel }) {
  if (historial.length === 0) return null;

  const W = 400, H = 180;
  const padL = 32, padR = 16, padT = 16, padB = 28;
  const cW = W - padL - padR;
  const cH = H - padT - padB;
  const n  = historial.length;

  const xPos = (i) => padL + (n === 1 ? cW / 2 : (i / (n - 1)) * cW);
  const yPos = (v) => padT + cH - (v / 100) * cH;

  // Líneas de grid
  const gridLines = [0, 20, 40, 60, 80, 100].map(v => ({
    y: yPos(v), v,
  }));

  // Color según último score
  const lastScore = historial[historial.length - 1].score;
  const lineColor = colorZona(zona(lastScore));

  // Path bezier suave
  const pts = historial.map((h, i) => [xPos(i), yPos(h.score)]);
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i][0] + pts[i + 1][0]) / 2;
    pathD += ` C ${cpx} ${pts[i][1]}, ${cpx} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }

  // Etiquetas del eje X
  const xLabels = n <= 4
    ? historial.map((h, i) => ({ i, label: new Date(h.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) }))
    : [0, Math.floor(n / 2), n - 1].map(i => ({ i, label: new Date(historial[i].fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) }));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Grid */}
      {gridLines.map(({ y, v }) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="10" fontFamily="Georgia,serif" fill="#8A7F74">{v}</text>
        </g>
      ))}

      {/* Objetivo punteado en 80 */}
      <line
        x1={padL} x2={W - padR}
        y1={yPos(80)} y2={yPos(80)}
        stroke="#8A7F74" strokeWidth="1"
        strokeDasharray="4 3" opacity="0.5"
      />

      {/* Etiquetas X */}
      {xLabels.map(({ i, label }) => (
        <text key={i} x={xPos(i)} y={H - 4} textAnchor="middle" fontSize="10" fontFamily="Georgia,serif" fill="#8A7F74">
          {label}
        </text>
      ))}

      {/* Línea bezier */}
      {n > 1 && (
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Puntos */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 3}
          fill={lineColor} opacity={i === pts.length - 1 ? 1 : 0.5} />
      ))}

      {/* Score del último punto */}
      <text x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1] - 10}
        textAnchor="middle" fontSize="11" fontFamily="Georgia,serif"
        fill={lineColor} fontWeight="500">
        {lastScore}
      </text>
    </svg>
  );
}
