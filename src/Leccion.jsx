import { useParams, useNavigate } from "react-router-dom";

export default function Leccion() {
  const { dimension, nivel, numero } = useParams();
  const navigate = useNavigate();

  const lecciones = [
    { numero: 1, titulo: "Identificación de Emociones", lectura: "Aprende a reconocer y nombrar emociones reales en el cuerpo.", ejercicio: "Registra 10 emociones distintas hoy y su intensidad.", journaling: "¿Cuál emoción te sorprendió y por qué?" },
    { numero: 2, titulo: "Técnicas de Respiración", lectura: "Explora respiración diafragmática y 4-7-8.", ejercicio: "Practica 5 minutos de respiración guiada 3 veces.", journaling: "Describe cómo cambió tu nivel de calma." },
    { numero: 3, titulo: "Mindfulness Básico", lectura: "Atención plena a sensaciones, pensamientos y emociones.", ejercicio: "Haz un ejercicio de atención plena de 8 minutos.", journaling: "¿Qué notaste sin juzgar?" },
    { numero: 4, titulo: "Gestión de Estrés", lectura: "Identifica activadores de estrés y respuesta automática.", ejercicio: "Crea un plan de acción de 4 pasos para un evento estresante.", journaling: "¿Qué marcador físico aparece primero?" },
    { numero: 5, titulo: "Autocompasión", lectura: "Practica hablarte con amabilidad en situaciones difíciles.", ejercicio: "Escribe una carta de autocompasión para ti mismo.", journaling: "¿Cuál fue la resistencia más grande para ser amable contigo?" },
  ];

  const leccion = lecciones.find((l) => String(l.numero) === String(numero)) || lecciones[0];
  const total = lecciones.length;
  const current = Math.min(Math.max(Number(numero) || 1, 1), total);

  const siguienteNum = current < total ? current + 1 : null;

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#FAF7F2", color: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px" }}>
        <button
          onClick={() => navigate(`/curso/${dimension}`)}
          style={{ marginBottom: 20, background: "transparent", border: "none", color: "#5BA08A", fontSize: 14, cursor: "pointer" }}
        >
          ← Curso
        </button>

        <div style={{ marginBottom: 24, border: "0.5px solid #e8e2d9", padding: 18, borderRadius: 8, background: "#fff" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>
            {dimension.charAt(0).toUpperCase() + dimension.slice(1)} · Nivel {nivel} · Lección {numero}: {leccion.titulo}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666" }}>Lección {current} de {total}</p>
          <div style={{ marginTop: 12, height: 6, background: "#e8e2d9", borderRadius: 3 }}>
            <div style={{ width: `${(current / total) * 100}%`, height: "100%", background: "#5BA08A", borderRadius: 3 }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Lectura</h2>
            <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{leccion.lectura}</p>
          </section>

          <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Ejercicio</h2>
            <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{leccion.ejercicio}</p>
          </section>

          <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Journaling</h2>
            <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{leccion.journaling}</p>
          </section>
        </div>

        <div style={{ marginTop: 26, textAlign: "right" }}>
          {siguienteNum ? (
            <button
              onClick={() => navigate(`/leccion/${dimension}/${nivel}/${siguienteNum}`)}
              style={{ padding: "12px 20px", background: "#5BA08A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
            >
              Siguiente lección →
            </button>
          ) : (
            <button
              disabled
              style={{ padding: "12px 20px", background: "#ccc", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, cursor: "not-allowed" }}
            >
              Completado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
