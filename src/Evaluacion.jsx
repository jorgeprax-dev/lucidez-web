import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { ESCALAS } from "./escalas";

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
  const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const zona = overall >= 80 ? "verde" : overall >= 60 ? "ámbar" : "roja";
  const nivel = overall >= 70 ? "alto" : overall >= 40 ? "medio" : "bajo";
  const interpretacion = escala.interpretacion?.[nivel] || "";

  const prompt = `Eres un clínico experto en psicología basada en evidencia. Escribe un reporte personalizado basado en la evaluación profunda de ${escala.label} usando la escala ${escala.escala}.

Datos:
- Dimensión: ${escala.label}
- Escala: ${escala.escala} (${escala.referencia})
- Score: ${overall}/100
- Zona: ${zona}
- Interpretación clínica base: ${interpretacion}

Escribe un reporte en español de 4 párrafos:

Párrafo 1 — El diagnóstico: Qué revela exactamente este score en ${escala.label}. Concreto, específico, sin generalidades.
Párrafo 2 — El patrón: Cómo se manifiesta esto en la vida diaria de alguien con este perfil.
Párrafo 3 — El recurso: Qué tiene esta persona que puede usar como punto de apoyo.
Párrafo 4 — El siguiente paso: Una acción concreta y específica para esta semana. No genérica.

Tono: directo, clínico, sin jerga terapéutica, sin frases de autoayuda. Como Epicteto escribiría un reporte clínico.
Longitud: máximo 180 palabras.
Responde SOLO con los 4 párrafos. Sin títulos.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.error("Claude API error:", e);
    return null;
  }
}

export default function Evaluacion() {
  const { dimension } = useParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const escala = ESCALAS[dimension];

  useEffect(() => {
    if (!escala) return;
    document.title = `Evaluación ${escala.label} · Lucidez`;
  }, [escala]);

  const questions = escala?.preguntas || [];
  const currentQ = questions[questionIndex];
  const maxOption = (escala?.opciones?.length || 5);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((questionIndex + 1) / questions.length) * 100);
  }, [questionIndex, questions.length]);

  const overall = computeOverall(answers, questions, maxOption);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
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

  const onSubmit = async () => {
    setError("");
    if (Object.keys(answers).length !== questions.length) {
      setError("Completa todas las preguntas antes de guardar.");
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        throw new Error("No se encontró sesión activa.");
      }

      const formattedScores = {};
      questions.forEach((q) => {
        formattedScores[q.id] = getScaledScore(answers[q.id]);
      });

      await saveEvaluation({
        userId,
        dimension,
        scores: formattedScores,
        overall,
      });

      setSaved(true);
      setLoadingReport(true);
      const report = await generateDeepReport(dimension, escala, formattedScores, overall);
      setAiReport(report);
      setLoadingReport(false);
    } catch (err) {
      setSaved(false);
      setError(err.message || "Error al guardar la evaluación.");
    } finally {
      setLoading(false);
    }
  };

  if (!escala) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f4f0", fontFamily: "Georgia, serif", color: "#1a1a1a", padding: "40px 24px" }}>
        <h1>Dimensión no encontrada</h1>
        <p>Revisa que la ruta tenga una dimensión válida.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "10px 16px", border: "none", background: "#5BA08A", color: "#fff", cursor: "pointer", borderRadius: 6 }}>
          Volver al home
        </button>
      </div>
    );
  }

  if (saved) {
    const nivel = overall >= 70 ? 'alto' : overall >= 40 ? 'medio' : 'bajo';
    const interpretacion = escala.interpretacion[nivel];
    return (
      <div style={{ minHeight: "100vh", background: "#f7f4f0", fontFamily: "Georgia, serif", color: "#1a1a1a", padding: "40px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "clamp(48px, 12vw, 72px)", fontWeight: 300, color: "#5BA08A", marginBottom: 16 }}>
            {overall}%
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 400, margin: "0 0 24px", color: "#1a1a1a" }}>
            {escala.label}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#444", margin: "0 0 32px" }}>
            {interpretacion}
          </p>

          <div style={{ textAlign: "left", margin: "0 0 32px" }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 10, textTransform: "uppercase", color: "#8a7f74", letterSpacing: "0.08em", margin: "0 0 12px" }}>Tu reporte clínico</p>
            {loadingReport && (
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#a09890" }}>Analizando tu evaluación...</p>
            )}
            {aiReport && aiReport.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#4A4540", lineHeight: 1.8, margin: "0 0 16px" }}>{para}</p>
            ))}
          </div>

          <button onClick={() => navigate("/dashboard")} style={{ padding: "14px 28px", background: "#5BA08A", border: "none", borderRadius: 8, color: "#fff", fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            Volver al dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4f0", fontFamily: "Georgia, serif", color: "#1a1a1a" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 300, color: "#1a1a1a" }}>{escala.label}</h1>
          <p style={{ margin: "8px 0", color: "#8a7f74", fontSize: 14 }}>{escala.escala} · {escala.referencia}</p>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{escala.instruccion}</p>
        </div>

        <div style={{ marginBottom: 18, height: 8, background: "#e8e2d9", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#5BA08A", transition: "width 0.25s" }} />
        </div>

        <div style={{ background: "#fffdf8", border: "1px solid #e8e2d9", borderRadius: 12, padding: "20px 22px" }}>
          <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>Pregunta {questionIndex + 1} de {questions.length}</p>
          <p style={{ margin: "0 0 18px", fontSize: 16, color: "#444" }}>{currentQ.texto}</p>

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
                      border: selected ? "2.5px solid #5BA08A" : "1.5px solid #d0c8bc",
                      background: selected ? "#5BA08A" : "transparent",
                      color: selected ? "#fff" : "#333",
                      fontFamily: "Georgia, serif",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    {val}
                  </button>
                  <span style={{ marginTop: 4, fontSize: 10, color: "#aaa", textAlign: "center", maxWidth: 44 }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {error && <p style={{ color: "#E24B4A", marginTop: 14 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button
              onClick={onPrev}
              disabled={questionIndex === 0}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: "1px solid #d0c8bc",
                borderRadius: 6,
                color: questionIndex === 0 ? "#ccc" : "#8a7f74",
                cursor: questionIndex === 0 ? "not-allowed" : "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              ← Anterior
            </button>

            {questionIndex < questions.length - 1 ? (
              <button
                onClick={onNext}
                style={{ padding: "10px 16px", background: "#5BA08A", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontFamily: "Georgia, serif" }}
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={loading}
                style={{ padding: "10px 16px", background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontFamily: "Georgia, serif" }}
              >
                {loading ? "Guardando…" : "Guardar evaluación"}
              </button>
            )}
          </div>

          <p style={{ marginTop: 18, fontSize: 13, color: "#8a7f74", fontFamily: "'DM Mono', monospace" }}>
            Progreso actual: {progress}% · Score global estimado: {overall}%
          </p>
        </div>
      </div>
    </div>
  );
}
