import { useState, useEffect } from "react";
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

const DIMS = [
  {
    id: "presencia", label: "Presencia", tool: "MAAS", autor: "Brown & Ryan, 2003",
    color: "#5BA08A",
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
    color: "#C07A45",
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
    color: "#8A5BA0",
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
    color: "#4A7FA0",
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
    color: "#6A8A45",
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
    color: "#A08A35",
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

const SCALE = ["Casi nunca", "Raramente", "A veces", "Con frecuencia", "Casi siempre"];
const MODULO_MAP = {
  presencia: { num: 1, nombre: "Ver claro" },
  claridad: { num: 2, nombre: "Entender el mapa" },
  regulacion: { num: 3, nombre: "Regular" },
  valores: { num: 4, nombre: "Elegir" },
  autoconocimiento: { num: 5, nombre: "Conocerte" },
  agencia: { num: 6, nombre: "Vivir bien" },
};

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
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DIMS.length);
  const sorted = [...DIMS].sort((a, b) => scores[b.id] - scores[a.id]);
  const top2 = sorted.slice(0, 2);
  const low2 = sorted.slice(-2).reverse();
  const openings = {
    alta: `${user.nombre}, tu Índice de Lucidez muestra algo importante: ya tienes una base sólida. No llegaste aquí vacío. Lo que has construido — consciente o no — es real y medible.`,
    media: `${user.nombre}, tu Índice refleja algo que muchos sienten pero pocos pueden nombrar: estás en movimiento, pero el camino todavía no está del todo claro. Eso es exactamente el punto de partida correcto.`,
    baja: `${user.nombre}, lo que muestra tu Índice no es un diagnóstico definitivo — es una fotografía honesta de dónde estás hoy. Y el hecho de que estés aquí, mirándola de frente, ya dice algo importante sobre ti.`,
  };
  const level = overall >= 70 ? "alta" : overall >= 40 ? "media" : "baja";
  const fortalezasText = top2.map((d) => `Tu dimensión más fuerte es ${d.label} (${scores[d.id]}/100). ${d.fortaleza}`).join("\n\n");
  const crecimientoText = low2.map((d) => `${d.label} (${scores[d.id]}/100) es tu área de mayor oportunidad. ${d.crecimiento}`).join("\n\n");
  const modulo = MODULO_MAP[low2[0].id];
  const cierre = `Este baseline es tu punto de partida — no tu destino. Basado en tu perfil, el programa sugiere comenzar por el Módulo ${modulo.num}: ${modulo.nombre}.\n\nHay salida. Y es medible.`;
  return `${openings[level]}\n\n${fortalezasText}\n\n${crecimientoText}\n\n${cierre}`;
}

function Radar({ scores }) {
  const cx = 160, cy = 160, r = 110, n = DIMS.length;
  const angle = (i) => (2 * Math.PI * i) / n - Math.PI / 2;
  const pt = (i, ratio) => ({ x: cx + r * ratio * Math.cos(angle(i)), y: cy + r * ratio * Math.sin(angle(i)) });
  const dataPoints = DIMS.map((d, i) => pt(i, (scores[d.id] || 0) / 100));
  const poly = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg width={320} height={320} style={{ display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon key={g} points={DIMS.map((_, i) => { const p = pt(i, g); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="#e8e2d9" strokeWidth={g === 1 ? 1 : 0.5} />
      ))}
      {DIMS.map((_, i) => { const e = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#e8e2d9" strokeWidth={0.5} />; })}
      <polygon points={poly} fill="rgba(91,160,138,0.12)" stroke="#5BA08A" strokeWidth={2.5} />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={5} fill={DIMS[i].color} />)}
      {DIMS.map((d, i) => {
        const lp = pt(i, 1.28);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize={9} fontFamily="'DM Mono', monospace">{d.label}</text>;
      })}
    </svg>
  );
}

function ScaleBtn({ val, selected, color, onClick, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <button onClick={() => onClick(val)} style={{
        width: 44, height: 44, borderRadius: "50%",
        border: selected ? `2.5px solid ${color}` : "1.5px solid #d0c8bc",
        background: selected ? color : "transparent",
        color: selected ? "#fff" : "#888",
        fontFamily: "Georgia, serif", fontSize: 16,
        fontWeight: selected ? 700 : 400,
        cursor: "pointer", transition: "all 0.18s",
      }}>{val}</button>
      <span style={{ color: "#aaa", fontSize: 9, textAlign: "center", maxWidth: 44, lineHeight: 1.2, fontFamily: "'DM Mono', monospace" }}>{label}</span>
    </div>
  );
}

function QuizScreen({ dim, answers, onAnswer, onNext, onPrev, isFirst, isLast, dimIndex }) {
  const allAnswered = dim.questions.every((q) => answers[q.id] !== undefined);
  const progress = (dimIndex / DIMS.length) * 100;
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#888" }}>Dimensión {dimIndex + 1} de {DIMS.length}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: dim.color, fontWeight: 600 }}>{dim.tool}</span>
        </div>
        <div style={{ height: 3, background: "#e8e2d9", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: dim.color, borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>
      <div style={{ borderLeft: `4px solid ${dim.color}`, paddingLeft: 16, marginBottom: 28 }}>
        <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic", fontFamily: "Georgia, serif", marginBottom: 2 }}>{dim.desc}</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1a1a1a", fontFamily: "Georgia, serif" }}>{dim.label}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 36 }}>
        {dim.questions.map((q, qi) => (
          <div key={q.id} style={{ background: "#faf8f5", borderRadius: 12, padding: "20px 22px", border: `1.5px solid ${answers[q.id] !== undefined ? dim.color + "66" : "#e8e2d9"}`, transition: "border-color 0.25s" }}>
            <p style={{ color: "#333", fontFamily: "Georgia, serif", fontSize: 16, lineHeight: 1.7, margin: "0 0 20px" }}>
              <span style={{ color: dim.color, fontWeight: 700, marginRight: 6 }}>{qi + 1}.</span>{q.text}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5].map((v) => (
                <ScaleBtn key={v} val={v} selected={answers[q.id] === v} color={dim.color} onClick={(val) => onAnswer(q.id, val)} label={SCALE[v - 1]} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onPrev} disabled={isFirst} style={{ padding: "12px 24px", background: "transparent", border: "1.5px solid #d0c8bc", borderRadius: 8, color: isFirst ? "#d0c8bc" : "#666", fontFamily: "Georgia, serif", fontSize: 15, cursor: isFirst ? "default" : "pointer" }}>← Anterior</button>
        <button onClick={onNext} disabled={!allAnswered} style={{ padding: "12px 32px", background: allAnswered ? dim.color : "#e8e2d9", border: "none", borderRadius: 8, color: allAnswered ? "#fff" : "#bbb", fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, cursor: allAnswered ? "pointer" : "default", transition: "all 0.25s" }}>
          {isLast ? "Ver mi Índice →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({ scores, user, session }) {
  const [showReport, setShowReport] = useState(false);
  const [saved, setSaved] = useState(null);
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DIMS.length);
  const level = overall >= 70 ? { label: "Alta", color: "#5BA08A" } : overall >= 40 ? { label: "Media", color: "#C07A45" } : { label: "En desarrollo", color: "#8A5BA0" };
  const sorted = [...DIMS].sort((a, b) => scores[b.id] - scores[a.id]);
  const top2 = sorted.slice(0, 2);
  const low2 = sorted.slice(-2).reverse();
  const report = generateLocalReport(scores, user);

  const handleShowReport = async () => {
    setShowReport(true);
    const payload = {
      nombre: user.nombre,
      email: user.email,
      edad: parseInt(user.edad) || null,
      ciudad: user.ciudad,
      scores,
      overall,
      nivel: level.label,
      reporte: report,
      fecha: new Date().toISOString(),
    };
    if (session?.user?.id) payload.user_id = session.user.id;
    const ok = await saveToSupabase(payload);
    setSaved(ok);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 32, padding: "32px 24px", background: "#faf8f5", borderRadius: 16, border: "1px solid #e8e2d9" }}>
        <div style={{ color: "#888", fontSize: 11, letterSpacing: 3, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>Tu Índice de Lucidez</div>
        <div style={{ fontSize: 96, fontWeight: 700, fontFamily: "Georgia, serif", color: level.color, lineHeight: 1 }}>{overall}</div>
        <div style={{ color: level.color, fontSize: 20, letterSpacing: 2, fontFamily: "Georgia, serif", marginTop: 6, marginBottom: 8 }}>Lucidez {level.label}</div>
        <div style={{ color: "#aaa", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{user.nombre} · {user.ciudad} · {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</div>
      </div>
      <div style={{ background: "#faf8f5", borderRadius: 14, padding: "20px 0", border: "1px solid #e8e2d9", marginBottom: 20 }}>
        <Radar scores={scores} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {DIMS.map((d) => (
          <div key={d.id} style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px", border: "1px solid #e8e2d9", borderLeft: `4px solid ${d.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#333", fontSize: 14, fontWeight: 600, fontFamily: "Georgia, serif" }}>{d.label}</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#555" }}>{scores[d.id]}<span style={{ color: "#bbb" }}>/100</span></span>
            </div>
            <div style={{ height: 5, background: "#e8e2d9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${scores[d.id]}%`, background: d.color, borderRadius: 3, transition: "width 1.2s ease" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#f0f7f4", borderRadius: 10, padding: 16, border: "1px solid #c8ddd7" }}>
          <div style={{ color: "#5BA08A", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Fortalezas</div>
          {top2.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#444", fontFamily: "Georgia, serif" }}>{d.label}</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#5BA08A", marginLeft: "auto", fontWeight: 600 }}>{scores[d.id]}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fdf5ef", borderRadius: 10, padding: 16, border: "1px solid #e8d0bc" }}>
          <div style={{ color: "#C07A45", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Áreas de crecimiento</div>
          {low2.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#444", fontFamily: "Georgia, serif" }}>{d.label}</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#C07A45", marginLeft: "auto", fontWeight: 600 }}>{scores[d.id]}</span>
            </div>
          ))}
        </div>
      </div>
      {!showReport ? (
        <button onClick={handleShowReport} style={{ width: "100%", padding: 18, background: "#5BA08A", border: "none", borderRadius: 10, color: "#fff", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          Ver mi reporte personalizado ✦
        </button>
      ) : (
        <div style={{ background: "#faf8f5", borderRadius: 14, padding: 28, border: "1px solid #e8e2d9" }}>
          <div style={{ color: "#5BA08A", fontSize: 10, letterSpacing: 3, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Tu reporte</div>
          <div style={{ color: "#aaa", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>Programa de Desarrollo de Lucidez · generado localmente</div>
          {report.split("\n\n").map((p, i) => (
            <p key={i} style={{ color: "#333", fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.85, margin: "0 0 16px" }}>{p}</p>
          ))}
          {saved !== null && (
            <div style={{ padding: "10px 14px", borderRadius: 6, background: saved ? "#f0f7f4" : "#fdf5ef", border: `1px solid ${saved ? "#c8ddd7" : "#e8d0bc"}`, fontFamily: "'DM Mono', monospace", fontSize: 12, color: saved ? "#5BA08A" : "#C07A45", marginBottom: 16 }}>
              {saved ? "✓ Medición guardada en tu perfil" : "⚠ Error al guardar"}
            </div>
          )}
          {session ? (
            <a href='/dashboard' style={{ display: 'inline-block', padding: '12px 24px', background: '#5BA08A', color: '#fff', fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 600, borderRadius: 8, textDecoration: 'none' }}>
              Ver mi dashboard →
            </a>
          ) : (
            <div style={{ paddingTop: 16, borderTop: "1px solid #e8e2d9", background: "#f0f7f4", borderRadius: 8, padding: 16 }}>
              <div style={{ color: "#5BA08A", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 600, marginBottom: 8 }}>Guarda tu perfil y monitorea tu progreso</div>
              <div style={{ color: "#666", fontSize: 13, fontFamily: "Georgia, serif", marginBottom: 16 }}>
                Crea tu cuenta para ver cómo cambian tus dimensiones en el tiempo.
              </div>
              <a href='/login' style={{ display: 'inline-block', padding: '12px 24px', background: '#5BA08A', color: '#fff', fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 600, borderRadius: 8, textDecoration: 'none' }}>
                Crear mi cuenta →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Indice() {
  const [screen, setScreen] = useState("quiz");
  const [user, setUser] = useState({ nombre: "", email: "", edad: "", ciudad: "" });
  const [dimIdx, setDimIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [session, setSession] = useState(null);
  const scroll = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Detecta sesión y pre-llena datos del usuario
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        const meta = session.user.user_metadata;
        setUser({
          nombre: meta?.full_name || meta?.name || session.user.email.split("@")[0],
          email: session.user.email,
          edad: meta?.age || "",
          ciudad: meta?.city || "",
        });
      }
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4f0", color: "#1a1a1a", fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        input::placeholder { color: #ccc; }
        input:focus { outline: none; border-bottom-color: #5BA08A !important; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#d0c8bc; border-radius:2px; }
      `}</style>
      <div style={{ borderBottom: "1px solid #e8e2d9", padding: "16px 24px", position: "sticky", top: 0, background: "#f7f4f0", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div>
            <div style={{ color: "#aaa", fontSize: 9, letterSpacing: 4, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>Programa de Desarrollo de</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 1, color: "#1a1a1a" }}>Lucidez</div>
          </div>
        </a>
        {screen === "quiz" && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: DIMS[dimIdx].color }}>{dimIdx + 1} / {DIMS.length}</div>
        )}
      </div>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 20px 80px" }}>
        <QuizScreen
          dim={DIMS[dimIdx]} answers={answers} dimIndex={dimIdx}
          onAnswer={(id, val) => setAnswers((p) => ({ ...p, [id]: val }))}
          onNext={() => { if (dimIdx < DIMS.length - 1) { setDimIdx(p => p + 1); scroll(); } else { setScreen("results"); scroll(); } }}
          onPrev={() => { if (dimIdx > 0) { setDimIdx(p => p - 1); scroll(); } }}
          isFirst={dimIdx === 0} isLast={dimIdx === DIMS.length - 1}
        />
        {screen === "results" && <ResultsScreen scores={computeScores(answers)} user={user} session={session} />}
      </div>
    </div>
  );
}
