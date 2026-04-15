import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ESCALAS } from "./escalas";
import { generarReportePublico } from "./utils";
import { theme } from "./theme";

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

function labelZona(score) {
  if (score >= 80) return "Funcional";
  if (score >= 60) return "Trabajando";
  return "Crítico";
}

// ─── Estilos inline ───────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: theme.bgSecondary,
    fontFamily: theme.sans,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px 16px",
    borderBottom: `1px solid ${theme.border}`,
    backgroundColor: theme.bg,
  },
  navLogo: {
    fontSize: "13px",
    letterSpacing: "0.1em",
    color: theme.inkFaint,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navUser: {
    fontSize: "12px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
  },
  signOut: {
    fontSize: "12px",
    color: theme.inkFaint,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: theme.sans,
    padding: 0,
  },
  tabBar: {
    display: "flex",
    borderBottom: `1px solid ${theme.border}`,
    padding: "0 24px",
    backgroundColor: theme.bg,
  },
  tab: (active) => ({
    padding: "12px 0",
    marginRight: "24px",
    fontSize: "13px",
    fontFamily: theme.sans,
    color: active ? theme.ink : theme.inkFaint,
    cursor: "pointer",
    borderBottom: active ? `2px solid ${theme.ink}` : "2px solid transparent",
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${theme.ink}` : "2px solid transparent",
  }),
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px 24px 48px",
  },
  sectionLabel: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    color: theme.inkFaint,
    marginBottom: "14px",
    fontFamily: theme.sans,
  },
  heroCard: {
    backgroundColor: theme.bgTertiary,
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
    color: theme.ink,
    lineHeight: 1,
    fontFamily: theme.sans,
  },
  heroSub: {
    fontSize: "12px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    marginTop: "6px",
  },
  heroLabel: {
    fontSize: "12px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    marginBottom: "6px",
  },
  heroGoal: {
    fontSize: "22px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    textAlign: "right",
  },
  heroGoalLabel: {
    fontSize: "11px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
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
    color: theme.inkFaint,
    fontFamily: theme.sans,
    width: "140px",
    flexShrink: 0,
  },
  dimBarWrap: {
    flex: 1,
    height: "6px",
    backgroundColor: theme.bgTertiary,
    borderRadius: "3px",
    overflow: "hidden",
  },
  dimVal: {
    fontSize: "12px",
    color: theme.ink,
    fontFamily: theme.sans,
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
    color: theme.inkFaint,
    fontFamily: theme.sans,
  },
  divider: {
    height: "0.5px",
    backgroundColor: theme.border,
    margin: "24px 0",
  },
  ctaCard: {
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "10px",
    backgroundColor: theme.bg,
    cursor: "pointer",
  },
  ctaTitle: {
    fontSize: "14px",
    color: theme.ink,
    marginBottom: "5px",
    fontFamily: theme.sans,
  },
  ctaDesc: {
    fontSize: "12px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    lineHeight: "1.5",
  },
  pill: (color, bg) => ({
    display: "inline-block",
    fontSize: "11px",
    fontFamily: theme.sans,
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
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "16px 20px",
    cursor: "pointer",
    backgroundColor: theme.bg,
    width: "100%",
    textAlign: "left",
    marginTop: "16px",
  },
  chatDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: theme.green,
    flexShrink: 0,
  },
  chatText: {
    fontSize: "14px",
    color: theme.ink,
    fontFamily: theme.sans,
  },
  chatSub: {
    fontSize: "12px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
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
    fontFamily: theme.sans,
    padding: "4px 12px",
    borderRadius: "20px",
    border: `1px solid ${theme.border}`,
    backgroundColor: active ? theme.ink : theme.bg,
    color: active ? theme.bg : theme.inkFaint,
    cursor: "pointer",
  }),
  chartWrap: {
    width: "100%",
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "20px",
  },
  chartNote: {
    fontSize: "11px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
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
    color: theme.ink,
    fontFamily: theme.sans,
    marginBottom: "10px",
  },
  emptySub: {
    fontSize: "13px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    lineHeight: "1.7",
    marginBottom: "24px",
  },
  btnPrimary: {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: theme.ink,
    color: theme.bgSecondary,
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: theme.sans,
    letterSpacing: "0.04em",
    cursor: "pointer",
    textDecoration: "none",
  },
  // Reporte
  reporteBox: {
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "20px",
    fontSize: "13px",
    color: theme.inkMuted,
    fontFamily: theme.sans,
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
  },
  fechaLabel: {
    fontSize: "11px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
    marginBottom: "12px",
  },
  loading: {
    textAlign: "center",
    padding: "60px 24px",
    fontSize: "13px",
    color: theme.inkFaint,
    fontFamily: theme.sans,
  },
};

// ─── Componente principal ─────────────────────────────────────────────────────

async function generateMapaCompleto(scores, indiceScores) {
  const prompt = `Eres un intérprete de perfiles psicológicos entrenado en ACT, CBT y psicología positiva clínica.
Tienes acceso al perfil psicométrico más completo posible de esta persona — 6 dimensiones medidas con escalas validadas.
Tu trabajo: sintetizar todo en una lectura honesta, precisa y útil. No describir números — revelar el patrón de fondo.

Perfil completo:
- Presencia: ${scores.presencia}/100
- Claridad Cognitiva: ${scores.claridad}/100
- Regulación Emocional: ${scores.regulacion}/100
- Alineación de Valores: ${scores.valores}/100
- Autoconocimiento: ${scores.autoconocimiento}/100
- Agencia: ${scores.agencia}/100

PASO 1 — IDENTIFICAR EL PATRÓN CENTRAL:
Antes de escribir, identifica internamente:
- ¿Cuál es la configuración dominante? (piloto automático funcional, desregulación encubierta, intelectualización como defensa, valores sin tracción, agencia desanclada, colapso de identidad — o nombra uno nuevo si no encaja)
- ¿Cuál es la dimensión que más limita al sistema completo?
- ¿Cuál es el recurso real disponible?
- ¿Cuál es el loop que perpetúa el patrón?

PASO 2 — ESCRIBIR EL MAPA:
Escribe exactamente 4 secciones con este formato:

[Título de sección]

[Párrafo]

Las 4 secciones son:
Lo que veo
El patrón que lo sostiene
Tu estrella polar
Esta semana

Contenido de cada sección:

Lo que veo: La observación más honesta del perfil completo. No describas cada dimensión — describe la experiencia de vivir con esta configuración. Sé concreto y sin miedo. 3-4 oraciones.

El patrón que lo sostiene: El mecanismo que perpetúa este patrón. Por qué el sistema se sostiene solo. El loop específico. Conecta al menos dos dimensiones entre sí. 3-4 oraciones.

Tu estrella polar: El recurso real disponible — la dimensión más alta y cómo usarla como palanca para el cambio. No elogios vacíos. Una dirección concreta. 2-3 oraciones.

Esta semana: Una sola acción. Específica para este patrón. Que venga del mecanismo identificado, no de un manual genérico. 1-2 oraciones.

VOZ: poética y directa. Imágenes concretas. Sin jerga clínica. Sin frases de autoayuda. Sin adjetivos vacíos.
Segunda persona siempre. Tutéame.
Mayúsculas normales en español — mayúscula al inicio de cada oración y en nombres propios.
Títulos con mayúscula en la primera letra: "Lo que veo", "El patrón que lo sostiene", "Tu estrella polar", "Esta semana".
No uses markdown, no uses #, no uses asteriscos.
Separa cada sección con una línea en blanco.
No menciones nombres de escalas ni acrónimos.
Responde SOLO con las 4 secciones.`;

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.text || null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const [session, setSession]     = useState(null);
  const [mediciones, setMediciones] = useState([]);
  const [evaluacionesProfundas, setEvaluacionesProfundas] = useState({});
  const [loading, setLoading]     = useState(true);
  const [mapaCompleto, setMapaCompleto] = useState(null);
  const [loadingMapa, setLoadingMapa] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTexto, setFeedbackTexto] = useState("");
  const [showReporteIndice, setShowReporteIndice] = useState(false);
  const ultimoIndice = mediciones?.[mediciones.length - 1] ?? null;
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);
  const [slugIndice, setSlugIndice] = useState(null);
  const [generandoSlug, setGenerandoSlug] = useState(false);

  function colorZona(z) {
    if (z === "verde") return theme.green;
    if (z === "ambar") return theme.zonaAmbar.color;
    return theme.zonaRoja.color;
  }

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
      .select("id, fecha, scores, overall, nivel, reporte, nombre, mapa_completo")
      .eq("user_id", session.user.id)
      .order("fecha", { ascending: true });

    if (!error && data) {
      setMediciones(data);
      const ultimo = data[data.length - 1];
      if (ultimo?.mapa_completo) setMapaCompleto(ultimo.mapa_completo);
    }

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
    presencia: "Escala de Atención Consciente · qué tan presente estás en tu vida diaria",
    claridad: "Cuestionario de Pensamientos Automáticos · frecuencia de pensamientos negativos",
    regulacion: "Escala de Dificultades en Regulación Emocional · cómo manejas tus emociones cuando te desbordan",
    valores: "Cuestionario de Valores · qué tan alineado estás con lo que realmente valoras",
    autoconocimiento: "Escala de Autocompasión · cómo te tratas a ti mismo cuando fallas",
    agencia: "Escala Breve de Autocontrol · tu capacidad de actuar según tus intenciones",
  };

  const handleFeedbackFlotante = async () => {
    if (!feedbackTexto.trim()) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from("feedback").insert([{
        user_id: session?.user?.id || null,
        momento: "flotante",
        valioso: feedbackTexto.trim(),
      }]);
      setFeedbackEnviado(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackTexto("");
        setFeedbackEnviado(false);
      }, 2000);
    } catch (e) {
      console.error("Error feedback:", e);
    }
  };

  return (
    <div style={S.page}>
      {/* 1 — Nav */}
      <nav style={{ background: theme.bg, padding: navPad, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer", fontFamily: theme.sans, fontWeight: 700, fontSize: 17, color: theme.ink }}>lucidez</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ background: theme.bgSecondary, fontFamily: theme.sans, fontSize: 13, borderRadius: 20, padding: "4px 12px", color: theme.inkMuted }}>
            {diasDesdeInicio > 0 ? `${nombre} · día ${diasDesdeInicio}` : nombre}
          </span>
          <button style={{ fontFamily: theme.sans, fontSize: 15, fontWeight: 400, color: theme.purple, background: "none", border: "none", cursor: "pointer" }} onClick={handleSignOut}>Salir</button>
        </div>
      </nav>

      {/* 2 — Score hero + botones Índice */}
      <div style={{ padding: isMobile ? "16px 20px" : "16px 40px", background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px 20px 16px", marginBottom: 0 }}>
          <div style={{ fontFamily: theme.sans, fontSize: 15, fontWeight: 700, color: theme.ink, marginBottom: 4 }}>Índice de Lucidez</div>
          <div style={{ fontFamily: theme.sans, fontSize: 13, color: theme.inkFaint, marginBottom: 14 }}>Medición global · {fechaLabel}</div>
          <div style={{ height: 6, borderRadius: 3, background: theme.bgTertiary, marginBottom: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overall}%`, background: colorZona(zona(overall)), borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: theme.sans, fontWeight: 700, fontSize: 32, lineHeight: 1, color: colorZona(zona(overall)) }}>{overall}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {ultimoIndice?.reporte && (
                <button
                  onClick={() => navigate("/reporte-indice")}
                  style={{ fontFamily: theme.sans, fontSize: 14, fontWeight: 500, color: theme.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Ver mi reporte →
                </button>
              )}
              <button
                onClick={() => navigate("/indice")}
                style={{ fontFamily: theme.sans, fontSize: 14, color: theme.inkFaint, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Repetir →
              </button>
            </div>
            <button
              onClick={async () => {
                setGenerandoSlug(true);
                if (ultimoIndice) {
                  const slug = await generarReportePublico({
                    scores: ultimoIndice.scores,
                    overall: ultimoIndice.overall,
                    nivel: ultimoIndice.nivel,
                    aiReport: ultimoIndice.reporte || null,
                  });
                  if (slug) {
                    setSlugIndice(slug);
                    const slugGenerado = slug;
                    const mensaje = encodeURIComponent("Acabo de descubrir cómo funciona mi mente. Mira mi reporte: " + window.location.origin + "/r/" + slugGenerado);
                    const esMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const url = esMobile
                      ? "whatsapp://send?text=" + mensaje
                      : "https://wa.me/?text=" + mensaje;
                    if (esMobile) {
                      window.location.href = url;
                    } else {
                      window.open(url, "_blank");
                    }
                  }
                }
                setGenerandoSlug(false);
              }}
              disabled={generandoSlug}
              style={{ background: "#25D366", color: "#FFFFFF", fontFamily: theme.sans, fontWeight: 600, fontSize: 13, borderRadius: 12, padding: "8px 14px", border: "none", cursor: generandoSlug ? "default" : "pointer" }}
            >
              {generandoSlug ? "Generando..." : "WhatsApp →"}
            </button>
          </div>
        </div>
      </div>

      {/* 3 — Dimensiones */}
      <div style={{ padding: secPad, background: theme.bgSecondary }}>
        <div style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", color: theme.inkFaint, marginBottom: 12 }}>
          TUS DIMENSIONES · {evaluadas} de 6 evaluadas
        </div>
        {DIMENSIONES.map((d) => {
          const s = scores[d.key] ?? 0;
          const deepScore = evaluacionesProfundas[d.key];
          const hasDeepEval = deepScore !== undefined;
          const zDeep = hasDeepEval ? zona(deepScore) : null;
          const cDeep = hasDeepEval ? colorZona(zDeep) : null;
          return (
            <div key={d.key} style={{ background: theme.bg, borderRadius: 16, border: `1px solid ${theme.border}`, padding: "16px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: theme.sans, fontWeight: 600, fontSize: 17, color: theme.ink, marginBottom: 2 }}>
                {d.label}
              </div>
              <div style={{ fontFamily: theme.sans, fontSize: 13, color: theme.inkFaint, marginBottom: 10 }}>
                {ESCALA_DESC[d.key]}
              </div>
              <div style={{ height: 6, background: theme.bgTertiary, borderRadius: 3, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hasDeepEval ? deepScore : s}%`, background: hasDeepEval ? cDeep : colorZona(zona(s)), borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={{ fontFamily: theme.sans, fontWeight: 700, fontSize: 28, color: hasDeepEval ? cDeep : colorZona(zona(s)) }}>
                    {hasDeepEval ? deepScore : s}
                  </span>
                  <span style={{ fontFamily: theme.sans, fontSize: 13, color: theme.inkFaint, marginLeft: 6 }}>
                    {hasDeepEval ? `índice: ${s}` : "solo Índice"}
                  </span>
                </div>
                {hasDeepEval ? (
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button
                      onClick={() => navigate(`/evaluacion/${d.key}?modo=reporte`)}
                      style={{ fontFamily: theme.sans, fontSize: 14, fontWeight: 500, color: theme.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Ver mi reporte →
                    </button>
                    <button
                      onClick={() => navigate(`/evaluacion/${d.key}`)}
                      style={{ fontFamily: theme.sans, fontSize: 14, color: theme.inkFaint, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      Repetir →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/evaluacion/${d.key}`)}
                    style={{ fontFamily: theme.sans, fontSize: 14, color: theme.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Realizar evaluación →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3.5 — Mapa completo */}
      {evaluadas === 6 && (
        <div style={{ padding: secPad }}>
          {!mapaCompleto ? (
            <button
              onClick={async () => {
                setLoadingMapa(true);
                const mapa = await generateMapaCompleto(evaluacionesProfundas, scores);
                setMapaCompleto(mapa);
                if (mapa && mediciones.length > 0) {
                  const ultimoId = mediciones[mediciones.length - 1].id;
                  await supabase
                    .from("indice_lucidez")
                    .update({ mapa_completo: mapa })
                    .eq("id", ultimoId);
                }
                setLoadingMapa(false);
              }}
              disabled={loadingMapa}
              style={{ width: "100%", fontFamily: theme.sans, fontSize: 14, color: loadingMapa ? theme.inkFaint : theme.bg, background: loadingMapa ? theme.bgTertiary : theme.purple, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "14px 16px", cursor: loadingMapa ? "not-allowed" : "pointer" }}
            >
              {loadingMapa ? "Generando mapa..." : "Generar mi mapa completo →"}
            </button>
          ) : (
            <>
            <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "20px" }}>
              <div style={{ fontFamily: theme.sans, fontSize: 12, color: theme.inkFaint, marginBottom: 20, letterSpacing: "0.06em", fontWeight: 500 }}>
                TU MAPA COMPLETO · {fechaLabel}
              </div>
              {mapaCompleto.split("\n\n").map((block, i) => {
                const lines = block.split("\n");
                const label = lines[0];
                const texto = lines.slice(1).join("\n").trim();
                return (
                  <div key={i} style={{ marginBottom: 24 }}>
                    {label && texto ? (
                      <>
                        <div style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, color: theme.inkFaint, letterSpacing: "0.06em", marginBottom: 6 }}>
                          {label.toUpperCase()}
                        </div>
                        <p style={{ fontFamily: theme.sans, fontSize: 16, color: theme.ink, lineHeight: 1.6, margin: 0 }}>
                          {texto}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontFamily: theme.sans, fontSize: 16, color: theme.ink, lineHeight: 1.6, margin: 0 }}>
                        {block}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={async () => {
                setLoadingMapa(true);
                const mapa = await generateMapaCompleto(evaluacionesProfundas, scores);
                setMapaCompleto(mapa);
                if (mapa && mediciones.length > 0) {
                  const ultimoId = mediciones[mediciones.length - 1].id;
                  await supabase.from("indice_lucidez").update({ mapa_completo: mapa }).eq("id", ultimoId);
                }
                setLoadingMapa(false);
              }}
              disabled={loadingMapa}
              style={{ marginTop: 16, width: "100%", fontFamily: theme.sans, fontSize: 13, color: loadingMapa ? theme.inkFaint : "#fff", background: loadingMapa ? theme.bgTertiary : theme.purple, border: "none", borderRadius: 8, padding: "10px 16px", cursor: loadingMapa ? "not-allowed" : "pointer" }}
            >
              {loadingMapa ? "Generando..." : "Actualizar mapa →"}
            </button>
            </>
          )}
        </div>
      )}


      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}>
        {showFeedbackModal && (
          <div style={{ marginBottom: 8, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 20, width: 280, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            {feedbackEnviado ? (
              <p style={{ fontFamily: theme.sans, fontSize: 14, color: theme.green, margin: 0, textAlign: "center" }}>
                Gracias — lo leemos todo.
              </p>
            ) : (
              <>
                <div style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, color: theme.inkFaint, marginBottom: 12 }}>
                  ¿Algo que mejorar?
                </div>
                <textarea
                  value={feedbackTexto}
                  onChange={(e) => setFeedbackTexto(e.target.value)}
                  placeholder="Escribe lo que quieras — bug, sugerencia, lo que sea..."
                  rows={3}
                  style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "10px 12px", background: theme.bgSecondary, color: theme.ink, border: `0.5px solid ${theme.border}`, borderRadius: 12, fontFamily: theme.sans, fontSize: 13, resize: "none", outline: "none", lineHeight: 1.6, marginBottom: 10 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={() => { setShowFeedbackModal(false); setFeedbackTexto(""); }}
                    style={{ background: "transparent", color: theme.inkFaint, border: "none", fontFamily: theme.sans, fontSize: 14, cursor: "pointer", padding: 0 }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleFeedbackFlotante}
                    disabled={!feedbackTexto.trim()}
                    style={{ background: feedbackTexto.trim() ? theme.purple : theme.bgTertiary, color: feedbackTexto.trim() ? theme.bg : theme.inkFaint, border: "none", padding: "10px 18px", fontFamily: theme.sans, fontSize: 14, cursor: feedbackTexto.trim() ? "pointer" : "default", borderRadius: 20 }}
                  >
                    Enviar →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <button
          onClick={() => setShowFeedbackModal(!showFeedbackModal)}
          style={{ background: theme.purple, color: theme.bg, border: "none", padding: "10px 18px", fontFamily: theme.sans, fontSize: 14, cursor: "pointer", borderRadius: 20 }}
        >
          {showFeedbackModal ? "× Cerrar" : "¿Feedback?"}
        </button>
      </div>
    </div>
  );
}
