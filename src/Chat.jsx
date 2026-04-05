import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  borderStrong: "rgba(26,23,20,0.22)",
  teal: "#3d7a65",
};

async function loadPerfil(userId) {
  const [indiceRes, evaluacionesRes, respuestasRes] = await Promise.all([
    supabase
      .from("indice_lucidez")
      .select("scores, overall, nivel, nombre, fecha")
      .eq("user_id", userId)
      .order("fecha", { ascending: false })
      .limit(1),
    supabase
      .from("evaluacion_profunda")
      .select("dimension, scores, overall, fecha")
      .eq("user_id", userId)
      .order("fecha", { ascending: false }),
    supabase
      .from("respuestas_cualitativas")
      .select("momento, dimension, pregunta_1, respuesta_1, pregunta_2, respuesta_2, pregunta_3, respuesta_3")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    indice: indiceRes.data?.[0] || null,
    evaluaciones: evaluacionesRes.data || [],
    respuestas: respuestasRes.data || [],
  };
}

function buildSystemPrompt(perfil, nombre) {
  const { indice, evaluaciones, respuestas } = perfil;

  const scoresIndice = indice?.scores
    ? Object.entries(indice.scores)
        .map(([k, v]) => `- ${k}: ${v}/100`)
        .join("\n")
    : "Sin datos del Índice todavía.";

  const scoresEvaluaciones = evaluaciones.length
    ? evaluaciones
        .map((e) => `- ${e.dimension}: ${e.overall}/100`)
        .join("\n")
    : "Sin evaluaciones profundas todavía.";

  const contextoCualitativo = respuestas.length
    ? respuestas
        .map((r) => {
          const lineas = [];
          if (r.pregunta_1 && r.respuesta_1)
            lineas.push(`  P: ${r.pregunta_1}\n  R: ${r.respuesta_1}`);
          if (r.pregunta_2 && r.respuesta_2)
            lineas.push(`  P: ${r.pregunta_2}\n  R: ${r.respuesta_2}`);
          if (r.pregunta_3 && r.respuesta_3)
            lineas.push(`  P: ${r.pregunta_3}\n  R: ${r.respuesta_3}`);
          return `[${r.momento}${r.dimension ? ` · ${r.dimension}` : ""}]\n${lineas.join("\n")}`;
        })
        .join("\n\n")
    : "Sin respuestas cualitativas todavía.";

  return `Eres el Acompañante de Lucidez. Un interlocutor clínico entrenado en ACT (Terapia de Aceptación y Compromiso) y entrevista motivacional.

QUIÉN ERES:
- Directo, curioso, sin juicio, orientado a valores
- No eres un coach que da consejos ni un terapeuta que valida emociones
- Eres un espejo con datos — ayudas al usuario a ver con precisión lo que los números ya muestran, y a entender qué significa para su vida específica
- Nunca produces listas de pasos. Nunca dices "excelente pregunta". Nunca usas jerga terapéutica ni frases de autoayuda

PERFIL DEL USUARIO:
Nombre: ${nombre}
Score general del Índice: ${indice?.overall || "sin datos"}/100

SCORES DEL ÍNDICE:
${scoresIndice}

EVALUACIONES PROFUNDAS:
${scoresEvaluaciones}

CONTEXTO CUALITATIVO:
${contextoCualitativo}

CÓMO CONDUCES LA CONVERSACIÓN:
El chat tiene tres actos. No los announces — los ejecutas.

Acto 1 — Apertura con contexto:
Abre con una observación específica basada en el perfil. No preguntes "¿cómo estás?" ni hagas introducción genérica. Ve directo al patrón más relevante o pregunta una cosa concreta. Máximo 3 oraciones.

Acto 2 — El aha moment:
Cuando tengas suficiente contexto, conecta los puntos de forma que el usuario no había visto. Usa los números, usa lo que el usuario dijo, nombra el patrón exacto. El aha moment no se anuncia — aparece.

Acto 3 — La estrella polar:
Una sola dirección. No un plan. No una lista. Una dimensión, una razón de por qué esa dimensión mueve todo lo demás, una acción concreta para esta semana.

FORMATO:
- Máximo 4 oraciones por turno en actos 1 y 2
- Segunda persona siempre. Nunca tercera persona sobre el usuario.
- Sin markdown, sin bullets, sin negritas
- Una sola pregunta por turno — nunca dos en el mismo mensaje

LÍMITES CLÍNICOS:
Si el usuario expresa ideación suicida, autolesión o crisis aguda:
- No profundices
- Responde con calidez directa
- Proporciona: SAPTEL México 55 5259-8121, disponible 24 horas
- Sugiere atención profesional presencial

Si el perfil sugiere patología severa (scores menores a 30 en 3 o más dimensiones):
- No diagnostiques
- Señaliza hacia atención profesional
- El alcance de Lucidez es autoconocimiento y orientación, no tratamiento`;
}

async function sendMessage(messages, systemPrompt) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          prompt: messages[messages.length - 1].content,
          system: systemPrompt,
          history: messages.slice(0, -1),
        }),
      }
    );
    const data = await response.json();
    return data.text || null;
  } catch (e) {
    console.error("Chat error:", e);
    return null;
  }
}

export default function Chat() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [nombre, setNombre] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/login"); return; }
      setSession(session);
      const meta = session.user.user_metadata;
      const n = meta?.full_name || meta?.name || session.user.email?.split("@")[0] || "tú";
      setNombre(n);
      const p = await loadPerfil(session.user.id);
      setPerfil(p);
      setIniciando(false);
    });
  }, [navigate]);

  useEffect(() => {
    if (!perfil || messages.length > 0) return;
    const systemPrompt = buildSystemPrompt(perfil, nombre);
    setLoading(true);
    sendMessage(
      [{ role: "user", content: "Inicia la conversación." }],
      systemPrompt
    ).then((text) => {
      if (text) {
        setMessages([{ role: "assistant", content: text }]);
      }
      setLoading(false);
    });
  }, [perfil, nombre]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const systemPrompt = buildSystemPrompt(perfil, nombre);
    const text = await sendMessage(newMessages, systemPrompt);
    if (text) {
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    }
    setLoading(false);
  };

  if (iniciando) {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 12, color: C.inkFaint, letterSpacing: "0.08em" }}>
        Cargando tu perfil...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: serif, color: C.ink, display: "flex", flexDirection: "column" }}>
      <nav style={{ borderBottom: `0.5px solid ${C.border}`, background: C.cream, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: serif, fontSize: 17, color: C.ink }}>lucidez</a>
          <span style={{ fontFamily: mono, fontSize: 10, color: C.inkFaint, letterSpacing: "0.08em", textTransform: "uppercase" }}>Acompañante</span>
          <a href="/dashboard" style={{ fontFamily: mono, fontSize: 10, color: C.inkFaint, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>← Dashboard</a>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: "32px 28px 120px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 5 }}>
              {m.role === "user" ? nombre : "Acompañante"}
            </div>
            <div style={{ maxWidth: "85%", padding: "14px 16px", borderRadius: m.role === "user" ? "8px 2px 8px 8px" : "2px 8px 8px 8px", background: m.role === "user" ? C.ink : "#ffffff", border: m.role === "user" ? "none" : `0.5px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: m.role === "user" ? C.cream : C.inkMuted }}>
                {m.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 5 }}>Acompañante</div>
            <div style={{ padding: "14px 16px", borderRadius: "2px 8px 8px 8px", background: "#ffffff", border: `0.5px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 14, color: C.inkFaint, fontFamily: mono, letterSpacing: "0.04em" }}>···</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ position: "sticky", bottom: 0, background: C.cream, borderTop: `0.5px solid ${C.border}`, padding: "16px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Escribe aquí..."
            rows={2}
            style={{ flex: 1, padding: "12px 14px", background: "#ffffff", color: C.ink, border: `0.5px solid ${C.borderStrong}`, borderRadius: 4, fontFamily: serif, fontSize: 14, resize: "none", outline: "none", lineHeight: 1.6 }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? C.creamDark : C.ink, color: loading || !input.trim() ? C.inkFaint : C.cream, border: "none", padding: "12px 20px", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: loading || !input.trim() ? "default" : "pointer", borderRadius: 2, flexShrink: 0 }}
          >
            →
          </button>
        </div>
        <div style={{ maxWidth: 720, margin: "8px auto 0", fontFamily: mono, fontSize: 9, color: C.inkFaint, letterSpacing: "0.04em" }}>
          Enter para enviar · Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
}
