import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ESCALAS } from "./escalas";
import { theme } from "./theme";

const PREGUNTAS_POR_DIMENSION = {
  presencia: [
    "¿Hay momentos del día donde sientes que estás en piloto automático sin darte cuenta? ¿Cuándo pasa más?",
    "¿Cuándo fue la última vez que estuviste completamente presente en algo que importaba?",
  ],
  claridad: [
    "¿Qué tipo de pensamientos aparecen solos cuando algo sale mal?",
    "¿Hay una voz interna que te juzga con frecuencia? ¿Qué dice exactamente?",
  ],
  regulacion: [
    "¿Qué situación reciente te sacó del centro? ¿Qué pasó después?",
    "¿Cuánto tardas normalmente en volver a un estado funcional cuando algo te perturba?",
  ],
  valores: [
    "¿Hay algo que dices que te importa pero que no estás haciendo? ¿Qué te lo impide?",
    "¿Cuándo fue la última vez que tomaste una decisión que se sintió completamente tuya?",
  ],
  autoconocimiento: [
    "¿Cómo te hablas a ti mismo cuando cometes un error importante?",
    "¿Te tratas con la misma generosidad con la que tratarías a alguien que quieres?",
  ],
  agencia: [
    "¿Hay algo que llevas tiempo queriendo cambiar y no has podido sostener? ¿Qué pasa exactamente?",
    "¿Cuál es la brecha más grande entre lo que quieres hacer y lo que terminas haciendo?",
  ],
};

async function saveRespuestasCualitativas({ userId, momento, dimension, preguntas, respuestas }) {
  try {
    const payload = {
      user_id: userId,
      momento,
      dimension: dimension || null,
      pregunta_1: preguntas[0] || null,
      respuesta_1: respuestas[0] || null,
      pregunta_2: preguntas[1] || null,
      respuesta_2: respuestas[1] || null,
      pregunta_3: null,
      respuesta_3: null,
    };
    const { error } = await supabase.from("respuestas_cualitativas").insert([payload]);
    if (error) console.error("Error guardando respuestas:", error);
    return !error;
  } catch (e) {
    console.error("Error guardando respuestas:", e);
    return false;
  }
}

function getScaledScore(value) {
  // Valor numérico según selección
  return Number(value);
}

function computeOverall(answers, questions, maxOption) {
  if (!questions.length || maxOption <= 0) return 0;
  const answered = questions.map((q) => answers[q.id] || 0);
  const total = answered.reduce((acc, v) => acc + v, 0);
  return Math.round((total / (questions.length * maxOption)) * 100);
}

async function saveEvaluation({ userId, dimension, scores, overall }) {
  const payload = {
    user_id: userId,
    dimension,
    scores,
    overall,
    fecha: new Date().toISOString(),
  };

  const { error } = await supabase.from("evaluacion_profunda").insert([payload]);
  if (error) throw error;
  return true;
}

async function generateDeepReport(dimension, escala, scores, overall) {
  const zona = overall >= 80 ? "verde" : overall >= 60 ? "ámbar" : "roja";
  const nivel = overall >= 70 ? "alto" : overall >= 40 ? "medio" : "bajo";
  const interpretacion = escala.interpretacion?.[nivel] || "";

  const prompt = `Eres un intérprete de perfiles psicológicos entrenado en ACT, CBT y psicología positiva clínica.
Tu trabajo: leer cómo la dimensión focal interactúa con las otras 5 dimensiones y nombrar el patrón real — no describir el score en aislamiento.

Dimensión focal: ${escala.label}
Score focal: ${overall}/100 (zona ${zona})

Perfil completo de las 6 dimensiones:
- Presencia: ${scores.presencia}/100
- Claridad Cognitiva: ${scores.claridad}/100
- Regulación Emocional: ${scores.regulacion}/100
- Alineación de Valores: ${scores.valores}/100
- Autoconocimiento: ${scores.autoconocimiento}/100
- Agencia: ${scores.agencia}/100

PASO 1 — LEER LA CONFIGURACIÓN:
Antes de escribir, identifica internamente cómo el score de ${escala.label} se explica por la combinación de las otras dimensiones. Busca:
- ¿Qué dimensiones altas o bajas amplifican o amortiguan este score?
- ¿Hay una dimensión que claramente lo causa o lo sostiene?
- ¿El patrón tiene nombre? (piloto automático, desregulación encubierta, intelectualización, valores sin tracción, agencia desanclada, colapso de identidad)

PASO 2 — ESCRIBIR EL REPORTE:
Escribe en español, segunda persona, 4 párrafos. Sin títulos, sin bullets.

Párrafo 1: Lo que revela este score en ${escala.label} — no el número, sino la experiencia de vivir con este patrón. Conecta con al menos una dimensión relacionada del perfil completo.

Párrafo 2: El mecanismo — por qué este patrón se sostiene solo. El loop específico que lo perpetúa, usando el contexto de las otras dimensiones.

Párrafo 3: El recurso real disponible — menciona la dimensión más alta del perfil sin decir el número. No elogios vacíos.

Párrafo 4: Una sola acción concreta para esta semana. Específica para este patrón, no genérica.

VOZ: poética y directa. Imágenes concretas. Sin jerga clínica. Sin frases de autoayuda. Sin adjetivos vacíos.
Segunda persona siempre. Nunca "esta persona" ni "su puntuación".
No menciones nombres de escalas ni acrónimos (MAAS, DERS, ATQ, VQ, SCS, BSCS).
Escribe con mayúsculas normales en español. Mayúscula al inicio de cada oración y en nombres propios.
Máximo 200 palabras en los 4 párrafos.
Responde SOLO con los 4 párrafos.`;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      }
    );
    const data = await response.json();
    return data.text || null;
  } catch (e) {
    console.error("Claude proxy error:", e);
    return null;
  }
}

function colorZona(score) {
  if (score >= 80) return theme.green;
  if (score >= 60) return theme.zonaAmbar.color;
  return theme.zonaRoja.color;
}

export default function Evaluacion() {
  const { dimension } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedOverall, setSavedOverall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reporteGuardado, setReporteGuardado] = useState(null);
  const [respuestasCual, setRespuestasCual] = useState(["", ""]);
  const [cualGuardadas, setCualGuardadas] = useState(false);
  const autoAdvanceTimeoutRef = useRef(null);
  const modoReporte = searchParams.get("modo") === "reporte";

  const escalaLabels = {
    presencia: "Escala de Atención Consciente · versión breve",
    claridad: "Cuestionario de Pensamientos Automáticos",
    regulacion: "Escala de Dificultades en Regulación Emocional",
    valores: "Cuestionario de Valores",
    autoconocimiento: "Escala de Autocompasión",
    agencia: "Escala Breve de Autocontrol",
  };

  const escala = ESCALAS[dimension];

  useEffect(() => {
    if (!escala) return;
    document.title = `Evaluación ${escala.label} · Lucidez`;
  }, [escala]);

  useEffect(() => {
    if (!modoReporte) return;
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || !isMounted) return;
      const { data } = await supabase
        .from("evaluacion_profunda")
        .select("overall, fecha, scores")
        .eq("user_id", session.user.id)
        .eq("dimension", dimension)
        .order("fecha", { ascending: false })
        .limit(1)
        .single();

      if (data && isMounted) {
        const report = await generateDeepReport(dimension, escala, data.scores, data.overall);
        setReporteGuardado(report);
        setAiReport(report);
        setSavedOverall(data.overall ?? null);
        setSaved(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [modoReporte, dimension, escala]);

  const questions = escala?.preguntas || [];
  const currentQ = questions[questionIndex];
  const maxOption = (escala?.opciones?.length || 5);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((questionIndex + 1) / questions.length) * 100);
  }, [questionIndex, questions.length]);

  const overall = computeOverall(answers, questions, maxOption);

  const handleAnswer = (value) => {
    if (!currentQ) return;
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(updatedAnswers);

    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((p) => p + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Última pregunta: guardar y mostrar reporte automáticamente
        onSubmit(updatedAnswers);
      }
    }, 360);
  };

  const onNext = () => {
    setError("");
    if (!answers[currentQ.id]) {
      setError("Selecciona un valor para continuar.");
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // fin
      setQuestionIndex(questions.length);
    }
  };

  const onPrev = () => {
    setError("");
    if (questionIndex > 0) {
      setQuestionIndex((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (answersOverride) => {
    setError("");
    const answersToUse = answersOverride || answers;
    if (Object.keys(answersToUse).length !== questions.length) {
      setError("Completa todas las preguntas antes de guardar.");
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const formattedScores = {};
      questions.forEach((q) => {
        formattedScores[q.id] = getScaledScore(answersToUse[q.id]);
      });

      // Guardar en Supabase solo si hay sesión activa
      if (userId) {
        await saveEvaluation({
          userId,
          dimension,
          scores: formattedScores,
          overall,
        });
      }

      // Mostrar reporte aunque no haya sesión
      setSaved(true);
      setSavedOverall(overall);
      setLoadingReport(true);
      const report = await generateDeepReport(dimension, escala, formattedScores, overall);
      setAiReport(report);
      setLoadingReport(false);
    } catch (err) {
      setSaved(false);
      setError(err.message || "Error al generar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  if (!escala) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.sans, color: theme.ink, padding: "40px 24px" }}>
        <h1>Dimensión no encontrada</h1>
        <p>Revisa que la ruta tenga una dimensión válida.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "14px 24px", border: "none", background: theme.purple, color: "#FFFFFF", cursor: "pointer", borderRadius: 12, fontFamily: theme.sans, fontWeight: 600, fontSize: 15 }}>
          Volver al home
        </button>
      </div>
    );
  }

  if (modoReporte && !reporteGuardado) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.sans, color: theme.ink, padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 16, color: theme.inkMuted }}>Cargando tu reporte...</p>
        </div>
      </div>
    );
  }

  if (saved) {
    const visibleOverall = savedOverall ?? overall;
    const nivel = visibleOverall >= 70 ? 'alto' : visibleOverall >= 40 ? 'medio' : 'bajo';
    const interpretacion = escala.interpretacion[nivel];
    const reporte = aiReport;
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.sans, color: theme.ink, padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: theme.sans, fontSize: "clamp(48px, 12vw, 72px)", fontWeight: 700, color: colorZona(visibleOverall), marginBottom: 16 }}>
            {visibleOverall}%
          </div>
          <h1 style={{ fontFamily: theme.sans, fontSize: 22, fontWeight: 600, margin: "0 0 24px", color: theme.ink }}>
            {escala.label}
          </h1>
          <p style={{ fontFamily: theme.sans, fontSize: 17, lineHeight: 1.6, color: theme.inkMuted, margin: "0 0 32px", textAlign: "left" }}>
            {interpretacion}
          </p>

          <div style={{ textAlign: "left", margin: "0 0 32px" }}>
            <p style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, color: theme.inkFaint, letterSpacing: "0.06em", margin: "0 0 12px" }}>TU REPORTE</p>
            {loadingReport && (
              <p style={{ fontFamily: theme.sans, fontSize: 12, color: theme.inkFaint }}>Analizando tu evaluación...</p>
            )}
            {aiReport && aiReport.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily: theme.sans, fontSize: 16, color: theme.ink, lineHeight: 1.6, margin: "0 0 16px" }}>{para}</p>
            ))}
          </div>

          {reporte && !cualGuardadas && (
            <div style={{ marginTop: 24, background: theme.bg, border: `0.5px solid ${theme.border}`, borderRadius: 6, padding: 28 }}>
              <span style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", color: theme.inkFaint, marginBottom: 16, display: "block" }}>
                Dos preguntas · para profundizar
              </span>
              {(PREGUNTAS_POR_DIMENSION[dimension] || []).map((pregunta, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: theme.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", color: theme.inkFaint, marginBottom: 6 }}>
                    Pregunta {i + 1} de 2
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: theme.ink, lineHeight: 1.5, marginBottom: 10, fontFamily: theme.sans, textAlign: "left" }}>
                    {pregunta}
                  </div>
                  <textarea
                    value={respuestasCual[i]}
                    onChange={(e) => {
                      const nuevas = [...respuestasCual];
                      nuevas[i] = e.target.value;
                      setRespuestasCual(nuevas);
                    }}
                    placeholder="Escribe con libertad..."
                    rows={3}
                    style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "12px 16px", background: theme.bg, color: theme.ink, border: `1px solid ${theme.border}`, borderRadius: 12, fontFamily: theme.sans, fontSize: 16, resize: "none", outline: "none", lineHeight: 1.6 }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <button
                  onClick={() => setCualGuardadas(true)}
                  style={{ background: "transparent", color: theme.inkFaint, border: "none", fontFamily: theme.sans, fontSize: 14, cursor: "pointer", padding: 0 }}
                >
                  Ahora no
                </button>
                <button
                  onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user?.id) {
                      await saveRespuestasCualitativas({
                        userId: session.user.id,
                        momento: `evaluacion_${dimension}`,
                        dimension,
                        preguntas: PREGUNTAS_POR_DIMENSION[dimension] || [],
                        respuestas: respuestasCual,
                      });
                    }
                    setCualGuardadas(true);
                  }}
                  style={{ background: theme.purple, color: "#FFFFFF", border: "none", padding: "14px 24px", fontFamily: theme.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", borderRadius: 12 }}
                >
                  Guardar y continuar →
                </button>
              </div>
            </div>
          )}

          {reporte && cualGuardadas && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <a href="/dashboard" style={{ fontFamily: theme.sans, fontSize: 15, color: theme.purple, textDecoration: "none" }}>
                Volver al dashboard →
              </a>
            </div>
          )}

          <button onClick={() => navigate("/dashboard")} style={{ padding: "14px 24px", background: theme.purple, border: "none", borderRadius: 14, color: "#FFFFFF", fontFamily: theme.sans, fontSize: 17, fontWeight: 600, cursor: "pointer" }}>
            Volver al dashboard →
          </button>
          <div>
            <button
              onClick={() => navigate(`/evaluacion/${dimension}`)}
              style={{ marginTop: 14, padding: "12px 24px", background: theme.bgSecondary, border: "none", borderRadius: 12, color: theme.purple, fontFamily: theme.sans, fontSize: 15, fontWeight: 500, cursor: "pointer" }}
            >
              Repetir evaluación →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.sans, color: theme.ink }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ marginBottom: 20, borderBottom: `1px solid ${theme.border}`, paddingBottom: 14 }}>
          <h1 style={{ margin: 0, fontFamily: theme.sans, fontSize: 22, fontWeight: 600, color: theme.ink }}>{escala.label}</h1>
          <p style={{ margin: "8px 0", color: theme.inkFaint, fontSize: 14, fontFamily: theme.sans }}>{escalaLabels[dimension] || escala.escala}</p>
          <p style={{ margin: 0, color: theme.inkMuted, fontSize: 17, textAlign: "left", fontFamily: theme.sans }}>{escala.instruccion}</p>
        </div>

        <div style={{ marginBottom: 18, height: 8, background: theme.bgTertiary, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: theme.green, transition: "width 0.25s" }} />
        </div>

        <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "20px 22px" }}>
          <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: theme.ink }}>Pregunta {questionIndex + 1} de {questions.length}</p>
          <p style={{ margin: "0 0 18px", fontSize: 16, color: theme.inkMuted }}>{currentQ.texto}</p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {escala.opciones.map((opt, idx) => {
              const val = idx + 1;
              const selected = answers[currentQ.id] === val;
              return (
                <div key={val} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44 }}>
                  <button
                    onClick={() => handleAnswer(val)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: selected ? `2.5px solid ${theme.purple}` : `1.5px solid ${theme.border}`,
                      background: selected ? theme.purple : "transparent",
                      color: selected ? "#FFFFFF" : theme.ink,
                      fontFamily: theme.sans,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    {val}
                  </button>
                  <span
                    style={{
                      marginTop: 4,
                      visibility: idx === 0 || idx === escala.opciones.length - 1 ? "visible" : "hidden",
                      fontSize: 9,
                      fontFamily: theme.sans,
                      color: theme.inkFaint,
                      textAlign: "center",
                      width: 50,
                    }}
                  >
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {error && <p style={{ color: theme.zonaRoja.color, marginTop: 14 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button
              onClick={onPrev}
              disabled={questionIndex === 0}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: `1px solid ${theme.border}`,
                borderRadius: 6,
                color: questionIndex === 0 ? theme.inkFaint : theme.purple,
                cursor: questionIndex === 0 ? "not-allowed" : "pointer",
                fontFamily: theme.sans,
              }}
            >
              ← Anterior
            </button>

            {questionIndex < questions.length - 1 ? (
              <button
                onClick={onNext}
                style={{ padding: "14px 24px", background: theme.purple, border: "none", borderRadius: 12, color: "#FFFFFF", cursor: "pointer", fontFamily: theme.sans, fontWeight: 600, fontSize: 15 }}
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={loading}
                style={{ padding: "14px 24px", background: theme.purple, border: "none", borderRadius: 12, color: "#FFFFFF", cursor: "pointer", fontFamily: theme.sans, fontWeight: 600, fontSize: 15 }}
              >
                {loading ? "Guardando…" : "Guardar evaluación"}
              </button>
            )}
          </div>

          <p style={{ marginTop: 18, fontSize: 13, color: theme.inkFaint, fontFamily: theme.sans }}>
            Progreso actual: {progress}% · Score global estimado: {overall}%
          </p>
        </div>
      </div>
    </div>
  );
}
