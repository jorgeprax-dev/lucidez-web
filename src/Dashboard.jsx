import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

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
    maxWidth: "480px",
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
  const [session, setSession]     = useState(null);
  const [mediciones, setMediciones] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dimActiva, setDimActiva] = useState("presencia");

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
  const scores       = ultima?.scores ?? {};
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
        <div style={S.loading}>Cargando tu perfil…</div>
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
      {/* Nav */}
      <nav style={S.nav}>
        <span onClick={() => navigate("/")} style={{ ...S.navLogo, cursor: "pointer" }}>LUCIDEZ</span>
        <div style={S.navRight}>
          <span style={S.navUser}>{nombre} · día {diasDesdeInicio}</span>
          <button style={S.signOut} onClick={handleSignOut}>Salir</button>
        </div>
      </nav>

      {/* Tabs */}
      <div style={S.tabBar}>
        {["hoy", "progreso", "reporte"].map(t => (
          <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
            {t === "hoy" ? "Hoy" : t === "progreso" ? "Progreso" : "Reporte"}
          </button>
        ))}
      </div>

      <div style={S.container}>

        {/* ── TAB: HOY ── */}
        {tab === "hoy" && (
          <>
            <p style={S.sectionLabel}>Índice de Lucidez</p>

            {/* Hero score */}
            <div style={S.heroCard}>
              <div>
                <p style={S.heroLabel}>Score general</p>
                <p style={S.heroNumber}>{overall}</p>
                <p style={S.heroSub}>{labelZona(zona(overall))} · {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div>
                <p style={S.heroGoalLabel}>Objetivo</p>
                <p style={S.heroGoal}>80</p>
              </div>
            </div>

            {/* Leyenda */}
            <div style={S.legend}>
              {[["#E24B4A", "Crítico (< 60)"], ["#EF9F27", "Trabajando (60–79)"], ["#639922", "Funcional (≥ 80)"]].map(([c, l]) => (
                <div key={l} style={S.legendItem}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c }} />
                  {l}
                </div>
              ))}
            </div>

            {/* Barras por dimensión */}
            <p style={S.sectionLabel}>Por dimensión</p>
            {DIMENSIONES.map(d => {
              const s  = scores[d.key] ?? 0;
              const z  = zona(s);
              const c  = colorZona(z);
              const objetivo = 80;
              return (
                <div key={d.key} style={S.dimRow}>
                  <span style={S.dimName}>{d.label}</span>
                  <div style={S.dimBarWrap}>
                    <div style={{ height: "100%", width: `${s}%`, backgroundColor: c, borderRadius: "3px", position: "relative" }} />
                    {/* Marcador objetivo */}
                    <div style={{ position: "absolute", left: `calc(${objetivo}% - 1px)`, top: "-4px", width: "2px", height: "14px", backgroundColor: "#8A7F74", borderRadius: "1px", opacity: 0.4, marginTop: "-5px" }} />
                  </div>
                  <span style={S.dimVal}>{s}</span>
                </div>
              );
            })}

            <div style={S.divider} />

            {/* Próximos pasos */}
            <p style={S.sectionLabel}>Próximos pasos</p>

            {dimsRojas.length > 0 && (
              <div style={S.ctaCard}>
                <p style={S.ctaTitle}>Dimensiones críticas</p>
                <p style={S.ctaDesc}>
                  {dimsRojas.map(d => d.label).join(" y ")} {dimsRojas.length === 1 ? "está" : "están"} en zona crítica. Enfoca tu trabajo aquí esta semana.
                </p>
                <span style={S.pill("#A32D2D", "#FCEBEB")}>
                  {dimsRojas.length} {dimsRojas.length === 1 ? "dimensión" : "dimensiones"} bajo 60
                </span>
              </div>
            )}

            <div style={S.ctaCard} onClick={() => navigate("/indice")}>
              <p style={S.ctaTitle}>Re-aplicar el Índice</p>
              <p style={S.ctaDesc}>Mide tu progreso con una nueva medición para ver el delta vs. tu baseline.</p>
              <span style={S.pill("#854F0B", "#FAEEDA")}>
                {mediciones.length === 1 ? "Primera medición completada" : `${mediciones.length} mediciones`}
              </span>
            </div>

            {/* Botón chat */}
            <button style={S.chatBtn} onClick={() => navigate("/chat")}>
              <div style={S.chatDot} />
              <div>
                <p style={S.chatText}>Hablar con tu acompañante</p>
                <p style={S.chatSub}>Disponible 24/7 · Conoce tu perfil</p>
              </div>
            </button>
          </>
        )}

        {/* ── TAB: PROGRESO ── */}
        {tab === "progreso" && (
          <>
            <p style={S.sectionLabel}>Dimensión</p>
            <div style={S.chipWrap}>
              {DIMENSIONES.map(d => (
                <button key={d.key} style={S.chip(dimActiva === d.key)} onClick={() => setDimActiva(d.key)}>
                  {d.label}
                </button>
              ))}
            </div>

            <div style={S.chartWrap}>
              <GraficaProgreso historial={historialDim} dimLabel={DIMENSIONES.find(d => d.key === dimActiva)?.label} />
            </div>
            <p style={S.chartNote}>Línea punteada = objetivo (80) · Punto = medición</p>

            {mediciones.length === 1 && (
              <p style={{ ...S.chartNote, marginTop: "16px", color: "#8A7F74" }}>
                Aplica el Índice nuevamente para ver tu evolución en el tiempo.
              </p>
            )}
          </>
        )}

        {/* ── TAB: REPORTE ── */}
        {tab === "reporte" && (
          <>
            <p style={S.fechaLabel}>
              Última medición · {new Date(ultima.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div style={S.reporteBox}>
              {ultima.reporte ?? "No hay reporte disponible para esta medición."}
            </div>

            {mediciones.length > 1 && (
              <>
                <div style={S.divider} />
                <p style={S.sectionLabel}>Mediciones anteriores</p>
                {[...mediciones].reverse().slice(1).map((m, i) => (
                  <div key={m.id} style={{ ...S.ctaCard, cursor: "default" }}>
                    <p style={S.ctaTitle}>
                      {new Date(m.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p style={S.ctaDesc}>Score general: {m.overall} · {m.nivel}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}

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
