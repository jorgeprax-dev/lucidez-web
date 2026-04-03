import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Curso() {
  const { dimension } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarScore = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('indice_lucidez')
          .select('scores')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (data && data.length > 0) {
          setScore(data[0].scores[dimension] || 0);
        }
      }
      setLoading(false);
    };
    cargarScore();
  }, [dimension]);

  // Contenido hardcoded para regulacion
  const niveles = [
    {
      nivel: 1,
      titulo: "Fundamentos de Regulación Emocional",
      lecciones: [
        { numero: 1, titulo: "Identificación de Emociones", estado: "completada" },
        { numero: 2, titulo: "Técnicas de Respiración", estado: "completada" },
        { numero: 3, titulo: "Mindfulness Básico", estado: "activa" },
        { numero: 4, titulo: "Gestión de Estrés", estado: "pendiente" },
        { numero: 5, titulo: "Autocompasión", estado: "pendiente" },
      ],
    },
    {
      nivel: 2,
      titulo: "Avanzado en Regulación",
      bloqueado: true,
    },
    {
      nivel: 3,
      titulo: "Maestría en Regulación",
      bloqueado: true,
    },
  ];

  const leccionActiva = niveles[0].lecciones.find(l => l.estado === "activa");

  const progreso = niveles[0].lecciones.filter(l => l.estado === "completada").length / niveles[0].lecciones.length * 100;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#8A7F74" }}>
        Cargando…
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#FAF7F2", minHeight: "100vh", color: "#1a1a1a" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Curso de {dimension.charAt(0).toUpperCase() + dimension.slice(1)}</h1>
          <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>Tu score actual: {score}%</p>
          <div style={{ height: 4, background: "#e8e2d9", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${score}%`, background: "#5BA08A", borderRadius: 2 }} />
          </div>
        </div>

        {niveles.map((nivel) => (
          <div key={nivel.nivel} style={{ marginBottom: 32, border: "0.5px solid #e8e2d9", borderRadius: 8, background: "#fff" }}>
            <div style={{ padding: "20px", borderBottom: nivel.nivel === 1 ? "0.5px solid #e8e2d9" : "none" }}>
              <h2 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8 }}>Nivel {nivel.nivel}: {nivel.titulo}</h2>
              {nivel.bloqueado && <p style={{ fontSize: 14, color: "#888" }}>Bloqueado - Completa el nivel anterior</p>}
            </div>
            {nivel.nivel === 1 && (
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                    <span>Progreso</span>
                    <span>{Math.round(progreso)}%</span>
                  </div>
                  <div style={{ height: 6, background: "#e8e2d9", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${progreso}%`, background: "#5BA08A", borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {nivel.lecciones.map((leccion) => (
                    <div key={leccion.numero} style={{ display: "flex", alignItems: "center", padding: "12px", border: "0.5px solid #e8e2d9", borderRadius: 6, background: leccion.estado === "completada" ? "#f0f0f0" : "#fff" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: leccion.estado === "completada" ? "#5BA08A" : leccion.estado === "activa" ? "#FFA500" : "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", marginRight: 12 }}>
                        {leccion.estado === "completada" ? "✓" : leccion.numero}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 500 }}>{leccion.titulo}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{leccion.estado === "completada" ? "Completada" : leccion.estado === "activa" ? "Activa" : "Pendiente"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {leccionActiva && (
                  <button
                    onClick={() => navigate(`/leccion/${dimension}/1/${leccionActiva.numero}`)}
                    style={{ marginTop: 20, padding: "12px 24px", background: "#5BA08A", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}
                  >
                    Continuar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}