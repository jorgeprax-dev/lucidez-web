import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { theme } from "./theme";

const FOUNDER_EMAIL = "jorgeprax@gmail.com";

export default function Founder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      if (session.user.email !== FOUNDER_EMAIL) {
        navigate("/dashboard");
        return;
      }
      setAuthorized(true);

      // Cargar feedback con email del usuario via JOIN manual
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("id, user_id, momento, utilidad, valioso, mejora, created_at")
        .order("created_at", { ascending: false });

      if (feedbackError) {
        console.error("Error cargando feedback:", feedbackError);
        setLoading(false);
        return;
      }

      // Obtener emails y nombres de los user_ids únicos vía RPC
      const userIds = [...new Set(feedbackData.map(f => f.user_id).filter(Boolean))];
      const userMap = {};
      
      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase.rpc("get_users_for_founder", {
          user_ids: userIds
        });
        
        if (usersError) {
          console.error("Error obteniendo info de usuarios:", usersError);
        } else if (usersData) {
          usersData.forEach(u => {
            const meta = u.raw_user_meta_data || {};
            const nombre = meta.full_name || meta.name || null;
            userMap[u.user_id] = { 
              email: u.email, 
              nombre: nombre
            };
          });
        }
      }

      // Combinar feedback con info de usuario
      const enrichedFeedback = feedbackData.map(f => ({
        ...f,
        userEmail: f.user_id ? (userMap[f.user_id]?.email || "—") : "—",
        userNombre: f.user_id ? (userMap[f.user_id]?.nombre || "") : "",
      }));

      setFeedbacks(enrichedFeedback);
      setLoading(false);
    }
    init();
  }, [navigate]);

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.loading}>Cargando…</div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Panel de fundador</h1>
          <p style={s.subtitle}>Lectura cualitativa del producto · {feedbacks.length} entradas de feedback</p>
        </div>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>Feedback</h2>
          {feedbacks.length === 0 ? (
            <p style={s.empty}>Aún no hay feedback registrado.</p>
          ) : (
            <div style={s.list}>
              {feedbacks.map(f => (
                <article key={f.id} style={s.card}>
                  <div style={s.cardHeader}>
                    <div>
                      <span style={s.userName}>{f.userNombre || f.userEmail}</span>
                      {f.userNombre && <span style={s.userEmail}> · {f.userEmail}</span>}
                    </div>
                    <span style={s.cardMeta}>
                      {new Date(f.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}
                      {f.momento}
                      {f.utilidad !== null && ` · utilidad ${f.utilidad}`}
                    </span>
                  </div>
                  {f.valioso && (
                    <div style={s.field}>
                      <span style={s.fieldLabel}>Lo valioso</span>
                      <p style={s.fieldText}>{f.valioso}</p>
                    </div>
                  )}
                  {f.mejora && (
                    <div style={s.field}>
                      <span style={s.fieldLabel}>Para mejorar</span>
                      <p style={s.fieldText}>{f.mejora}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: theme.bgSecondary || "#F2F2F7",
    fontFamily: theme.sans,
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: theme.ink || "#000000",
    margin: 0,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.inkFaint || "#6C6C70",
    margin: 0,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.ink || "#000000",
    marginBottom: 16,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    border: "1px solid rgba(60,60,67,0.12)",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(60,60,67,0.08)",
  },
  userName: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.ink || "#000000",
  },
  userEmail: {
    fontSize: 13,
    color: theme.inkFaint || "#6C6C70",
    fontWeight: 400,
  },
  cardMeta: {
    fontSize: 12,
    color: theme.inkFaint || "#6C6C70",
  },
  field: {
    marginTop: 8,
  },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: theme.inkFaint || "#6C6C70",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldText: {
    fontSize: 14,
    color: theme.ink || "#000000",
    lineHeight: 1.5,
    margin: 0,
  },
  empty: {
    fontSize: 14,
    color: theme.inkFaint || "#6C6C70",
    fontStyle: "italic",
  },
  loading: {
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    color: theme.inkFaint || "#6C6C70",
  },
};
