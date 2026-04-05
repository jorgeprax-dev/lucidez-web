import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

async function saveToSupabase(data) {
  try {
    const { error } = await supabase.from("indice_lucidez").insert([data]);
    return !error;
  } catch (e) {
    console.error("Supabase error:", e);
    return false;
  }
}

async function generateAIReport(scores, nombre) {
  const dimTexts = [
    { id: "presencia", label: "Presencia", score: scores.presencia },
    { id: "claridad", label: "Claridad Cognitiva", score: scores.claridad },
    { id: "regulacion", label: "Regulación Emocional", score: scores.regulacion },
    { id: "valores", label: "Alineación de Valores", score: scores.valores },
    { id: "autoconocimiento", label: "Autoconocimiento", score: scores.autoconocimiento },
    { id: "agencia", label: "Agencia", score: scores.agencia },
  ];
  const sorted = [...dimTexts].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const low = sorted[sorted.length - 1];
  const overall = Math.round(dimTexts.reduce((s, d) => s + d.score, 0) / 6);
  const zona = overall >= 80 ? "verde" : overall >= 60 ? "ámbar" : "roja";

  const prompt = `Eres un clínico experto en psicología basada en evidencia. Vas a escribir un reporte personalizado para ${nombre} basado en su Índice de Lucidez.

Datos del perfil:
- Score general: ${overall}/100 (zona ${zona})
- Presencia: ${scores.presencia}/100
- Claridad Cognitiva: ${scores.claridad}/100
- Regulación Emocional: ${scores.regulacion}/100
- Alineación de Valores: ${scores.valores}/100
- Autoconocimiento: ${scores.autoconocimiento}/100
- Agencia: ${scores.agencia}/100
- Dimensión más alta: ${top.label} (${top.score}/100)
- Dimensión más baja: ${low.label} (${low.score}/100)

Escribe un reporte en español de 4 párrafos con este formato exacto:

Párrafo 1 — Apertura personal: La primera palabra del reporte debe ser el nombre '${nombre}' seguido de una coma. Obligatorio. Ejemplo exacto del formato: '${nombre}, tu perfil muestra...'. Nunca empieces con otra palabra. Máximo 3 oraciones.

Párrafo 2 — El patrón: Qué significa la combinación de scores. Qué está pasando en la vida de alguien con este perfil. Concreto y clínico. Máximo 3 oraciones.

Párrafo 3 — La fortaleza: Qué tiene ${nombre} que ya funciona y cómo puede usarlo. Menciona la dimensión más alta específicamente.

Párrafo 4 — La pregunta abierta: Termina con algo que el Índice no puede responder y que solo la evaluación profunda de ${low.label} puede resolver. Genera curiosidad sin ser manipulador.

Voz: segunda persona directa en todo el reporte. Nunca tercera persona. No escribas 'Jorge presenta' ni 'su perfil' — escribe 'tu perfil', 'presentas', 'tu dimensión'. El reporte le habla a ${nombre} directamente, no habla sobre él.

Tono: directo, clínico, sin jerga terapéutica, sin frases de autoayuda. Como Epicteto escribiría un reporte clínico.
Longitud total: máximo 200 palabras.
Responde SOLO con los 4 párrafos. Sin títulos, sin explicaciones adicionales.`;

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

const DIMS = [
  {
    id: "presencia", label: "Presencia", tool: "MAAS", autor: "Brown & Ryan, 2003",
    color: "#3d7a65",
    desc: "Tu capacidad de estar aquí, ahora",
    fortaleza: "Vives con atención genuina al momento presente. Tienes una capacidad natural de notar lo que está pasando — en tu cuerpo, en tus emociones, en el entorno — antes de que te rebase.",
    crecimiento: "Tu mente tiende a estar en otro lado. El pasado o el futuro ocupan más espacio que el presente. Esto no es un defecto — es el punto de partida del trabajo de mindfulness.",
    questions: [
      { id: "p1", text: "Me cuesta mantenerme enfocado en lo que está sucediendo en el presente.", rev: true },
      { id: "p2", text: "Hago cosas sin prestar atención porque estoy en piloto automático.", rev: true },
      { id: "p3", text: "Noto sensaciones de tensión o malestar solo cuando ya son muy intensas.", rev: true },
    ],
  },
  {
    id: "claridad", label: "Claridad Cognitiva", tool: "ATQ", autor: "Hollon & Kendall, 1980",
    color: "#9a5e2e",
    desc: "El ruido vs. la señal en tu mente",
    fortaleza: "Tu mente no te sabotea constantemente. Puedes pensar con relativa claridad incluso en momentos de estrés, y los pensamientos autocríticos no dominan tu narrativa interna.",
    crecimiento: "Hay mucho ruido cognitivo — pensamientos automáticos negativos que aparecen solos y distorsionan cómo ves las situaciones y a ti mismo. El trabajo de CBT es exactamente para esto.",
    questions: [
      { id: "c1", text: "Tengo pensamientos negativos sobre mí mismo que aparecen solos.", rev: true },
      { id: "c2", text: "Me cuesta ver las cosas con claridad cuando estoy perturbado.", rev: true },
      { id: "c3", text: "Me juzgo duramente cuando cometo errores.", rev: true },
    ],
  },
  {
    id: "regulacion", label: "Regulación Emocional", tool: "DERS", autor: "Gratz & Roemer, 2004",
    color: "#6a3d82",
    desc: "Tu relación con lo que sientes",
    fortaleza: "Puedes sentir emociones intensas sin que te desborden. Tienes recursos internos para volver a un estado funcional cuando algo te perturba — eso es una fortaleza clínica real.",
    crecimiento: "Las emociones intensas te desbordan con frecuencia. Cuando algo te perturba, cuesta volver al centro. Esto es el área de trabajo más directa del programa — y la que más cambia la calidad de vida.",
    questions: [
      { id: "r1", text: "Cuando estoy molesto, me desborda lo que siento.", rev: true },
      { id: "r2", text: "Cuando estoy molesto, me cuesta concentrarme en otras cosas.", rev: true },
      { id: "r3", text: "Cuando estoy molesto, tardo mucho en sentirme mejor.", rev: true },
    ],
  },
  {
    id: "valores", label: "Alineación de Valores", tool: "VQ", autor: "Wilson et al., 2010",
    color: "#2d6382",
    desc: "Vivir lo que dices que importa",
    fortaleza: "Hay coherencia entre lo que dices que importa y cómo te comportas. Tomas decisiones desde tus valores reales, no solo desde la comodidad o el miedo. Eso da dirección y propósito.",
    crecimiento: "Hay una brecha entre lo que valoras y cómo vives. El miedo, la comodidad o el piloto automático dictan más tus decisiones de lo que quisieras. Cerrar esa brecha es el corazón del programa.",
    questions: [
      { id: "v1", text: "Esta semana actué de acuerdo con lo que realmente me importa.", rev: false },
      { id: "v2", text: "El miedo o la comodidad me impidieron hacer lo que valoro.", rev: true },
      { id: "v3", text: "Siento que mi vida tiene dirección y propósito.", rev: false },
    ],
  },
  {
    id: "autoconocimiento", label: "Autoconocimiento", tool: "SCS-Neff", autor: "Neff, 2003",
    color: "#4d6d2a",
    desc: "Cómo te ves y te tratas a ti mismo",
    fortaleza: "Te tratas con una generosidad real cuando fallas. Puedes ver tus errores sin exagerarlos ni minimizarlos, y no te sientes completamente solo cuando sufres. Eso es autocompasión funcional.",
    crecimiento: "La autocrítica es fuerte y la autocompasión escasa. Cuando fallas, la voz interna es dura. Aprender a tratarte como tratarías a alguien que quieres es uno de los cambios más profundos del programa.",
    questions: [
      { id: "a1", text: "Soy amable conmigo mismo cuando fallo o me equivoco.", rev: false },
      { id: "a2", text: "Cuando sufro, tiendo a sentirme más aislado del resto del mundo.", rev: true },
      { id: "a3", text: "Puedo ver mis defectos sin exagerarlos ni minimizarlos.", rev: false },
    ],
  },
  {
    id: "agencia", label: "Agencia", tool: "SCS-Tangney", autor: "Tangney et al., 2004",
    color: "#7a6520",
    desc: "Tu capacidad de elegir conscientemente",
    fortaleza: "Puedes traducir tus intenciones en acciones con consistencia. Cuando decides algo, lo sostienes. Esa capacidad de autocontrol consciente es el músculo que hace posible cualquier cambio real.",
    crecimiento: "La brecha entre lo que quieres hacer y lo que terminas haciendo es grande. Las tentaciones, la dificultad o el cansancio ganan con frecuencia. Fortalecer este músculo es esencial para sostener la recuperación.",
    questions: [
      { id: "ag1", text: "Puedo resistir tentaciones cuando sé que algo no me conviene.", rev: false },
      { id: "ag2", text: "Actúo de forma consistente con mis intenciones.", rev: false },
      { id: "ag3", text: "Me cuesta mantener el rumbo cuando algo es difícil.", rev: true },
    ],
  },
];

const SCALE_LABELS = ["Casi nunca", "Raramente", "A veces", "Con frecuencia", "Casi siempre"];

function computeScores(answers) {
  const scores = {};
  DIMS.forEach((d) => {
    let total = 0;
    d.questions.forEach((q) => {
      const v = answers[q.id] || 3;
      total += q.rev ? 6 - v : v;
    });
    scores[d.id] = Math.round((total / (d.questions.length * 5)) * 100);
  });
  return scores;
}

function generateLocalReport(scores, user) {
  const nombre = user.nombre || "tú";
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
  const zona = (s) => s >= 80 ? "verde" : s >= 60 ? "ambar" : "rojo";
  const z = {};
  DIMS.forEach((d) => { z[d.id] = zona(scores[d.id] || 0); });
  const rojasCount = Object.values(z).filter((v) => v === "rojo").length;
  const verdesCount = Object.values(z).filter((v) => v === "verde").length;
  const sorted = [...DIMS].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const top1 = sorted[0];
  const low1 = sorted[sorted.length - 1];

  let apertura = "", patron = "", prioridad = "";
  if (rojasCount >= 5) {
    apertura = `${nombre}, lo que muestra tu Índice es un punto de partida honesto — no un diagnóstico definitivo.`;
    patron = "Múltiples áreas están bajo presión al mismo tiempo. Eso no significa que todo está mal — significa que el sistema completo necesita atención, y que hay un orden para trabajarlo.";
    prioridad = "El primer paso es la regulación emocional. Es la base desde donde el resto del trabajo se vuelve posible.";
  } else if (verdesCount >= 5) {
    apertura = `${nombre}, tu Índice muestra algo que no es común: ya tienes una base real y medible.`;
    patron = "La mayoría de tus dimensiones funcionan bien. El trabajo ahora es sostener lo que funciona, cerrar las brechas que quedan, y usar esa base para los momentos difíciles.";
    prioridad = `Tu área de mayor oportunidad es ${low1.label.toLowerCase()}. Desde una base sólida, ese trabajo avanza rápido.`;
  } else if (z.presencia === "rojo" && z.claridad === "rojo") {
    apertura = `${nombre}, tu mente raramente está donde estás tú.`;
    patron = "Cuando no estás en piloto automático, el ruido interno ocupa el espacio. Es una combinación que agota sin que sepas bien por qué.";
    prioridad = "Presencia primero — sin ella, la claridad cognitiva no mejora sola.";
  } else if (z.regulacion === "rojo" && z.agencia === "rojo") {
    apertura = `${nombre}, la brecha entre lo que quieres hacer y lo que terminas haciendo es el patrón central de tu perfil.`;
    patron = "Las emociones intensas desvían tus intenciones con frecuencia. No es falta de voluntad — es que el sistema de regulación está sobrecargado.";
    prioridad = "Regulación primero — la agencia sin regulación es esfuerzo que se pierde.";
  } else {
    apertura = `${nombre}, tu Índice refleja un perfil en movimiento — con áreas que ya funcionan y otras que están esperando atención.`;
    patron = `Tu dimensión más desarrollada es ${top1.label.toLowerCase()} (${scores[top1.id]}/100). Tu mayor oportunidad está en ${low1.label.toLowerCase()} (${scores[low1.id]}/100).`;
    prioridad = `Empieza por ${low1.label.toLowerCase()}.`;
  }

  const fortalezaTextos = {
    presencia: "Tienes una capacidad real de estar donde estás. Eso es más raro de lo que parece — y es la base desde donde el trabajo del programa se vuelve efectivo.",
    claridad: "Tu mente no te sabotea constantemente. Puedes pensar con relativa claridad incluso bajo presión.",
    regulacion: "Puedes sentir emociones intensas sin que te desborden. Eso es una fortaleza clínica real.",
    valores: "Hay coherencia entre lo que dices que importa y cómo te comportas. Eso da dirección.",
    autoconocimiento: "Te tratas con generosidad real cuando fallas. Eso es la condición necesaria para cambiar sin destruirte en el proceso.",
    agencia: "Puedes traducir intenciones en acciones con consistencia. Ese músculo es el que hace posible cualquier cambio real.",
  };

  const fortaleza = verdesCount > 0
    ? `Tu punto de apoyo es ${top1.label.toLowerCase()} (${scores[top1.id]}/100). ${fortalezaTextos[top1.id]}`
    : "Completar este Índice ya dice algo sobre ti — la disposición a mirarse de frente es el primer paso real.";

  const cierreTextos = {
    verde: "Este baseline confirma algo: el trabajo que has hecho tiene resultado medible.",
    ambar: "Hay salida. Y es medible. El programa empieza exactamente donde estás — no donde crees que deberías estar.",
    rojo: "El punto de partida más honesto es el más útil. Desde aquí el delta va a ser visible.",
  };

  const zonaGeneral = overall >= 80 ? "verde" : overall >= 60 ? "ambar" : "rojo";
  return `${apertura}\n\n${patron}\n\n${fortaleza}\n\n${prioridad}\n\n${cierreTextos[zonaGeneral]}`;
}

// ─── Estilos base ───
const C = {
  cream: "#f7f4f0",
  creamDark: "#ede9e3",
  ink: "#1a1714",
  inkMuted: "#6b6460",
  inkFaint: "#a09890",
  border: "rgba(26,23,20,0.12)",
  borderStrong: "rgba(26,23,20,0.22)",
};

const mono = "'Courier New', monospace";
const serif = "Georgia, 'Times New Roman', serif";

// ─── Radar chart ───
function Radar({ scores }) {
  const cx = 140, cy = 140, r = 95, n = DIMS.length;
  const angle = (i) => (2 * Math.PI * i) / n - Math.PI / 2;
  const pt = (i, ratio) => ({ x: cx + r * ratio * Math.cos(angle(i)), y: cy + r * ratio * Math.sin(angle(i)) });
  const dataPoints = DIMS.map((d, i) => pt(i, (scores[d.id] || 0) / 100));
  const poly = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg width={280} height={280} style={{ display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon key={g} points={DIMS.map((_, i) => { const p = pt(i, g); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke={C.border} strokeWidth={g === 1 ? 1 : 0.5} />
      ))}
      {DIMS.map((_, i) => { const e = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke={C.border} strokeWidth={0.5} />; })}
      <polygon points={poly} fill="rgba(61,122,101,0.1)" stroke="#3d7a65" strokeWidth={2} />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={DIMS[i].color} />)}
      {DIMS.map((d, i) => {
        const lp = pt(i, 1.28);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={C.inkFaint} fontSize={8} fontFamily={mono}>{d.label.split(" ")[0]}</text>;
      })}
    </svg>
  );
}

// ─── Pantalla de nombre ───
function NameScreen({ nombre, onChange, onStart }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 48 }}>
      <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 20, display: "block" }}>
        Índice de Lucidez
      </span>
      <div style={{ fontSize: 26, fontWeight: "normal", lineHeight: 1.35, marginBottom: 28, color: C.ink }}>
        ¿Cómo te llamas?
      </div>
      <input
        type="text"
        value={nombre}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tu nombre"
        autoFocus
        style={{ display: "block", width: "100%", padding: "14px 0", background: "transparent", color: C.ink, border: "none", borderBottom: `1px solid ${C.borderStrong}`, fontFamily: serif, fontSize: 22, outline: "none", marginBottom: 32 }}
      />
      <button
        onClick={onStart}
        style={{ background: C.ink, color: C.cream, border: "none", padding: "13px 28px", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
      >
        Comenzar →
      </button>
    </div>
  );
}

// ─── Una pregunta a la vez ───
function QuestionScreen({ allQuestions, currentIdx, answers, onAnswer, onNext, onBack }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const q = allQuestions[currentIdx];
  const dim = DIMS.find((d) => d.questions.some((dq) => dq.id === q.id));
  const total = allQuestions.length;
  const answered = answers[q.id] !== undefined;

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const dimProgress = DIMS.map((d) => {
    const idxs = allQuestions.map((qq, i) => d.questions.some((dq) => dq.id === qq.id) ? i : -1).filter((i) => i >= 0);
    const done = idxs.every((i) => answers[allQuestions[i].id] !== undefined);
    const active = d.questions.some((dq) => dq.id === q.id);
    return { ...d, done, active };
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 32 }}>
      <div style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : undefined, gridTemplateColumns: isMobile ? undefined : "200px 1fr 220px", gap: 0, alignItems: "stretch", border: `0.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden", background: C.cream }}>
        {!isMobile && (
        <div style={{ padding: "32px 20px", borderRight: `0.5px solid ${C.border}` }}>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12 }}>
            Dimensiones
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {dimProgress.map((d) => {
              const color = d.active ? C.cream : d.done ? C.inkMuted : C.inkFaint;
              const background = d.active ? C.ink : d.done ? "#edf4f0" : "transparent";
              return (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 4, background }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.active ? C.cream : d.color, flexShrink: 0 }} />
                  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color }}>
                    {d.label.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        <div style={{ padding: isMobile ? "24px 20px" : "40px 48px" }}>
          {isMobile && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {dimProgress.map((d) => {
                const color = d.active ? C.cream : d.done ? C.inkMuted : C.inkFaint;
                const background = d.active ? C.ink : d.done ? "#edf4f0" : "transparent";
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 4, background }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.active ? C.cream : d.color, flexShrink: 0 }} />
                    <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color }}>
                      {d.label.split(" ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: dim.color, flexShrink: 0 }} />
            <span style={{ fontFamily: mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.inkMuted }}>{dim.label}</span>
            <span style={{ fontFamily: mono, fontSize: 10, color: C.inkFaint, marginLeft: "auto" }}>{currentIdx + 1} / {total}</span>
          </div>

          <div style={{ fontSize: 20, fontWeight: "normal", lineHeight: 1.5, marginBottom: 36, color: C.ink, minHeight: 72 }}>
            {q.text}
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((v) => {
                const sel = answers[q.id] === v;
                return (
                  <button
                    key={v}
                    onClick={() => onAnswer(q.id, v)}
                    style={{ width: 50, height: 50, borderRadius: "50%", border: `1px solid ${sel ? dim.color : C.borderStrong}`, background: sel ? dim.color : C.cream, color: sel ? C.cream : C.ink, fontFamily: mono, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", padding: 0 }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
            <div style={{ width: 290, display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9, color: C.inkFaint, letterSpacing: "0.04em" }}>
              <span style={{ width: 50, textAlign: "center" }}>Nunca</span>
              <span style={{ width: 50, textAlign: "center" }}>Siempre</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={onBack}
              style={{ visibility: currentIdx === 0 ? "hidden" : "visible", background: C.cream, color: C.inkMuted, border: `1px solid ${C.borderStrong}`, padding: "12px 20px", fontFamily: mono, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
            >
              ← Anterior
            </button>
            <button
              onClick={onNext}
              disabled={!answered}
              style={{ background: answered ? C.ink : C.creamDark, color: answered ? C.cream : C.inkFaint, border: "none", padding: "12px 24px", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: answered ? "pointer" : "default", borderRadius: 2, opacity: answered ? 1 : 0.5 }}
            >
              {currentIdx === total - 1 ? "Ver mi reporte →" : "Siguiente →"}
            </button>
          </div>
        </div>

        {!isMobile && (
        <div style={{ padding: "32px 20px", borderLeft: `0.5px solid ${C.border}`, background: "#faf8f5" }}>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12 }}>
            Esta dimensión
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: dim.color, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: C.ink, fontWeight: "normal" }}>{dim.label}</div>
          </div>
          <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.5, marginTop: 6 }}>
            {dim.desc}
          </div>
          <hr style={{ border: "none", borderTop: `0.5px solid ${C.border}`, margin: "16px 0" }} />
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 8 }}>
            Escalas validadas
          </div>
          <div>
            {DIMS.map((d) => {
              const active = d.id === dim.id;
              return (
                <div key={d.id} style={{ fontFamily: mono, fontSize: 11, lineHeight: 2, color: active ? C.ink : C.inkFaint }}>
                  {d.escalaLabel}
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

// ─── Reporte ───
function ResultsScreen({ scores, user, session }) {
  const [showReport, setShowReport] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [emailOpcional, setEmailOpcional] = useState("");
  const [emailFinal, setEmailFinal] = useState("");
  const [saved, setSaved] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DIMS.length);
  const zona = overall >= 80 ? { label: "Zona verde", color: "#3d7a65", bg: "#edf4f0" } : overall >= 60 ? { label: "Zona ámbar", color: "#9a5e2e", bg: "#f5ede4" } : { label: "Zona roja", color: "#8A3030", bg: "#f5e8e8" };
  const sorted = [...DIMS].sort((a, b) => scores[b.id] - scores[a.id]);
  const low1 = sorted[sorted.length - 1];
  const report = generateLocalReport(scores, user);

  const handleShowReport = async () => {
    if (!session && !emailOpcional.trim()) return;
    setShowReport(true);
    setLoadingReport(true);

    // Guardar en Supabase
    const resolvedEmailFinal = !session?.user?.id && emailOpcional.trim() ? emailOpcional.trim() : user.email;
    setEmailFinal(resolvedEmailFinal);
    const payload = {
      nombre: user.nombre,
      email: resolvedEmailFinal,
      edad: parseInt(user.edad) || null,
      ciudad: user.ciudad,
      scores,
      overall,
      nivel: zona.label,
      reporte: generateLocalReport(scores, user),
      fecha: new Date().toISOString(),
    };
    if (!session?.user?.id) {
      localStorage.setItem("indice_anonimo", JSON.stringify(payload));
      await supabase.auth.signInWithOtp({
        email: resolvedEmailFinal,
        options: { emailRedirectTo: window.location.origin + '/dashboard' }
      });
    } else {
      payload.user_id = session.user.id;
      await saveToSupabase(payload);
    }

    await supabase.functions.invoke("send-welcome-email", {
      body: {
        nombre: user.nombre,
        email: resolvedEmailFinal,
        scores,
        overall,
        zona: zona.label,
      },
    });

    // Llamar a Claude API
    const ai = await generateAIReport(scores, user.nombre);
    setAiReport(ai);
    setLoadingReport(false);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 32 }}>
      {isMobile ? (
        <div>
          <div style={{ marginBottom: 36 }}>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12, display: "block" }}>
              Tu Índice de Lucidez
            </span>
            <div style={{ fontSize: 80, fontWeight: "normal", lineHeight: 1, color: zona.color, letterSpacing: "-0.03em", marginBottom: 4 }}>
              {overall}
            </div>
            <div style={{ display: "inline-block", padding: "4px 12px", background: zona.bg, color: zona.color, fontFamily: mono, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 2, marginBottom: 8 }}>
              {zona.label}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.inkFaint }}>
              {user.nombre} · {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {DIMS.map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: C.inkMuted, width: 130, flexShrink: 0 }}>{d.label.split(" ")[0]}</div>
                <div style={{ flex: 1, height: 6, background: C.creamDark, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${scores[d.id]}%`, background: d.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: mono, fontSize: 12, color: C.ink, width: 30, textAlign: "right", flexShrink: 0 }}>{scores[d.id]}</div>
              </div>
            ))}
          </div>

          {!showReport && (
            <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", background: C.creamDark, borderRadius: 4, padding: 24, margin: "24px 0" }}>
              <div style={{ fontSize: 18, fontWeight: "normal", marginBottom: 8, color: C.ink }}>Guarda tu reporte</div>
              <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 20, lineHeight: 1.5 }}>Deja tu correo y te enviamos tus resultados. También guardamos tu historial.</div>
              <input
                type="email"
                value={emailOpcional}
                onChange={(e) => setEmailOpcional(e.target.value)}
                placeholder="tu@correo.com"
                style={{ display: "block", width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "12px 14px", background: C.cream, color: C.ink, border: `0.5px solid ${C.borderStrong}`, borderRadius: 2, fontFamily: serif, fontSize: 15, outline: "none", marginBottom: 10 }}
              />
              {!emailOpcional.trim() && (
                <p style={{ fontSize: 12, color: "#9a5e2e", fontFamily: "'Courier New', monospace", marginBottom: 8 }}>
                  Ingresa tu correo para ver el reporte
                </p>
              )}
              <button
                onClick={handleShowReport}
                style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", background: C.ink, color: C.cream, border: "none", padding: "13px 0", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
              >
                Ver mi reporte completo →
              </button>
            </div>
          )}

          <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 4, padding: "20px 0", marginBottom: 24 }}>
            <Radar scores={scores} />
          </div>

          {showReport && (
            <div style={{ background: "#ffffff", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: 24 }}>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 16, display: "block" }}>Tu reporte clínico</span>
              {loadingReport ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontFamily: mono, fontSize: 12, color: C.inkFaint, letterSpacing: "0.08em", marginBottom: 8 }}>
                    Analizando tu perfil...
                  </p>
                  <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, lineHeight: 1.7 }}>
                    Esto toma unos segundos. Claude está leyendo tus 6 dimensiones.
                  </p>
                </div>
              ) : (
                (aiReport || generateLocalReport(scores, user)).split("\n\n").map((p, i) => (
                  <p key={i} style={{ color: "#6b6460", fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>{p}</p>
                ))
              )}
              <p style={{ fontFamily: mono, fontSize: 12, color: C.inkFaint, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                Te enviamos un enlace a {emailFinal}. Un clic y entras a tu cuenta — sin contraseña.
              </p>
              {session && (
                <a href="/dashboard" style={{ display: "inline-block", padding: "12px 24px", background: C.ink, color: C.cream, fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, textDecoration: "none" }}>
                  Ir al dashboard →
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 40, alignItems: "start" }}>
          <div>
            <div style={{ marginBottom: 36 }}>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12, display: "block" }}>
                Tu Índice de Lucidez
              </span>
              <div style={{ fontSize: 80, fontWeight: "normal", lineHeight: 1, color: zona.color, letterSpacing: "-0.03em", marginBottom: 4 }}>
                {overall}
              </div>
              <div style={{ display: "inline-block", padding: "4px 12px", background: zona.bg, color: zona.color, fontFamily: mono, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 2, marginBottom: 8 }}>
                {zona.label}
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.inkFaint }}>
                {user.nombre} · {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {DIMS.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: C.inkMuted, width: 130, flexShrink: 0 }}>{d.label.split(" ")[0]}</div>
                  <div style={{ flex: 1, height: 6, background: C.creamDark, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${scores[d.id]}%`, background: d.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 12, color: C.ink, width: 30, textAlign: "right", flexShrink: 0 }}>{scores[d.id]}</div>
                </div>
              ))}
            </div>

            <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 4, padding: "20px 0", marginBottom: 32 }}>
              <Radar scores={scores} />
            </div>
          </div>

          <div style={{ position: "sticky", top: 80 }}>
            {!showReport ? (
              <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden", background: "#ffffff", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: 28 }}>
                <div style={{ fontSize: 18, fontWeight: "normal", marginBottom: 8, color: C.ink }}>Guarda tu reporte</div>
                <div style={{ fontSize: 13, color: C.inkMuted, marginBottom: 20, lineHeight: 1.5 }}>Deja tu correo y te enviamos tus resultados. También guardamos tu historial.</div>
                <input
                  type="email"
                  value={emailOpcional}
                  onChange={(e) => setEmailOpcional(e.target.value)}
                  placeholder="tu@correo.com"
                  style={{ display: "block", width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "12px 14px", background: C.cream, color: C.ink, border: `0.5px solid ${C.borderStrong}`, borderRadius: 2, fontFamily: serif, fontSize: 15, outline: "none", marginBottom: 10 }}
                />
                {!emailOpcional.trim() && (
                  <p style={{ fontSize: 12, color: "#9a5e2e", fontFamily: "'Courier New', monospace", marginBottom: 8 }}>
                    Ingresa tu correo para ver el reporte
                  </p>
                )}
                <button
                  onClick={handleShowReport}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", background: C.ink, color: C.cream, border: "none", padding: "13px 0", fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
                >
                  Ver mi reporte completo →
                </button>
              </div>
            ) : (
              <div style={{ background: "#ffffff", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: 28 }}>
                <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 16, display: "block" }}>Tu reporte clínico</span>
                {loadingReport ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <p style={{ fontFamily: mono, fontSize: 12, color: C.inkFaint, letterSpacing: "0.08em", marginBottom: 8 }}>
                      Analizando tu perfil...
                    </p>
                    <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, lineHeight: 1.7 }}>
                      Esto toma unos segundos. Claude está leyendo tus 6 dimensiones.
                    </p>
                  </div>
                ) : (
                  (aiReport || generateLocalReport(scores, user)).split("\n\n").map((p, i) => (
                    <p key={i} style={{ color: "#6b6460", fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>{p}</p>
                  ))
                )}
                <p style={{ fontFamily: mono, fontSize: 12, color: C.inkFaint, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                  Te enviamos un enlace a {emailFinal}. Un clic y entras a tu cuenta — sin contraseña.
                </p>
                {session && (
                  <a href="/dashboard" style={{ display: "inline-block", padding: "12px 24px", background: C.ink, color: C.cream, fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, textDecoration: "none" }}>
                    Ir al dashboard →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ───
export default function Indice() {
  const [screen, setScreen] = useState("name");
  const [nombre, setNombre] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [session, setSession] = useState(null);
  const topRef = useRef(null);

  // Aplanar todas las preguntas en orden
  const allQuestions = DIMS.flatMap((d) => d.questions);

  const scroll = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        const meta = session.user.user_metadata;
        setNombre(meta?.full_name || meta?.name || session.user.email.split("@")[0]);
        setScreen("questions");
      }
    });
  }, []);

  const handleAnswer = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    // Auto-avance
    setTimeout(() => {
      if (currentQ < allQuestions.length - 1) {
        setCurrentQ((q) => q + 1);
        scroll();
      } else {
        setScreen("results");
        scroll();
      }
    }, 360);
  };

  const handleNext = () => {
    if (answers[allQuestions[currentQ].id] === undefined) return;
    if (currentQ < allQuestions.length - 1) { setCurrentQ((q) => q + 1); scroll(); }
    else { setScreen("results"); scroll(); }
  };

  const handleBack = () => {
    if (currentQ > 0) { setCurrentQ((q) => q - 1); scroll(); }
  };

  const pct = screen === "questions" ? Math.round(((currentQ + 1) / allQuestions.length) * 100) : screen === "results" ? 100 : 0;

  return (
    <div ref={topRef} style={{ background: C.cream, minHeight: "100vh", fontFamily: serif, color: C.ink, fontSize: 15, lineHeight: 1.6 }}>

      <nav style={{ borderBottom: `0.5px solid ${C.border}`, background: C.cream, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: serif, fontSize: 17, color: C.ink, letterSpacing: "0.04em", flexShrink: 0 }}>lucidez</a>
          <div style={{ flex: 1, margin: "0 40px", height: 2, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.ink, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.inkFaint, letterSpacing: "0.06em", flexShrink: 0 }}>
            {screen === "questions" ? `${pct}% completado` : screen === "results" ? "Índice completado" : "Índice de Lucidez"}
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px 80px" }}>
        {screen === "name" && (
          <NameScreen
            nombre={nombre}
            onChange={setNombre}
            onStart={() => { if (nombre.trim()) { setScreen("questions"); scroll(); } else { setScreen("questions"); } }}
          />
        )}
        {screen === "questions" && (
          <QuestionScreen
            allQuestions={allQuestions}
            currentIdx={currentQ}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {screen === "results" && (
          <ResultsScreen
            scores={computeScores(answers)}
            user={{ nombre, email: session?.user?.email || "", edad: "", ciudad: "" }}
            session={session}
          />
        )}
      </div>
    </div>
  );
}