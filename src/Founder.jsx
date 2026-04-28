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
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, conIndice: 0, feedback: 0, conEvalProfunda: 0 });

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

      // Cargar todos los usuarios vía RPC
      const { data: usersData, error: usersError } = await supabase.rpc("get_all_users_for_founder");
      
      if (usersError) {
        console.error("Error cargando usuarios:", usersError);
      } else if (usersData) {
        setUsers(usersData);
        
        // Calcular métricas
        const total = usersData.length;
        const conIndice = usersData.filter(u => u.tiene_indice).length;
        const conEvalProfunda = usersData.filter(u => u.evaluaciones_profundas_count > 0).length;
        const feedbackCount = feedbackData ? feedbackData.length : 0;
        
        setMetrics({ total, conIndice, feedback: feedbackCount, conEvalProfunda });
      }

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

  function getUtilityBadgeStyle(utilidad) {
    let bg, color;
    if (utilidad >= 8) {
      bg = '#EAF3DE'; color = '#27500A'; // verde
    } else if (utilidad >= 5) {
      bg = '#FAEEDA'; color = '#633806'; // ámbar
    } else {
      bg = '#FCEBEB'; color = '#791F1F'; // rojo
    }
    return {
      background: bg,
      color: color,
      fontSize: 14,
      fontWeight: 500,
      padding: '6px 10px',
      borderRadius: 8,
      minWidth: 38,
      textAlign: 'center',
    };
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Panel de fundador</h1>
          <p style={s.subtitle}>Lectura del producto Lucidez</p>
        </div>

        <div style={s.metricsGrid}>
          <div style={s.metricCard}>
            <div style={s.metricLabel}>Usuarios</div>
            <div style={s.metricValue}>{metrics.total}</div>
          </div>
          <div style={s.metricCard}>
            <div style={s.metricLabel}>Con Índice</div>
            <div style={s.metricValue}>{metrics.conIndice}</div>
          </div>
          <div style={s.metricCard}>
            <div style={s.metricLabel}>Feedback</div>
            <div style={s.metricValue}>{metrics.feedback}</div>
          </div>
          <div style={s.metricCard}>
            <div style={s.metricLabel}>Eval. profunda</div>
            <div style={s.metricValue}>{metrics.conEvalProfunda}</div>
          </div>
        </div>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>Usuarios</h2>
          {users.length === 0 ? (
            <p style={s.empty}>Sin usuarios registrados.</p>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr style={s.tableHeaderRow}>
                    <th style={s.th}>Usuario</th>
                    <th style={s.th}>Registro</th>
                    <th style={s.th}>Estado</th>
                    <th style={{...s.th, textAlign: 'right'}}>Índice</th>
                    <th style={{...s.th, textAlign: 'right'}}>Utilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const displayName = u.nombre || u.email;
                    const showEmail = u.nombre && u.nombre !== u.email;
                    let estadoLabel = "Sin Índice";
                    let estadoStyle = s.statusPending;
                    if (u.tiene_indice) {
                      estadoLabel = u.evaluaciones_profundas_count > 0 
                        ? `Índice + ${u.evaluaciones_profundas_count} eval`
                        : "Índice completo";
                      estadoStyle = s.statusComplete;
                    }
                    return (
                      <tr key={u.user_id} style={s.tableRow}>
                        <td style={s.td}>
                          <div style={s.tdName}>{displayName}</div>
                          {showEmail && <div style={s.tdEmail}>{u.email}</div>}
                        </td>
                        <td style={{...s.td, color: '#6C6C70'}}>
                          {new Date(u.registered_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={s.td}>
                          <span style={{...s.statusBadge, ...estadoStyle}}>{estadoLabel}</span>
                        </td>
                        <td style={{...s.td, textAlign: 'right', fontWeight: u.overall ? 500 : 400, color: u.overall ? '#000000' : '#C7C7CC'}}>
                          {u.overall ?? "—"}
                        </td>
                        <td style={{...s.td, textAlign: 'right', fontWeight: u.ultima_utilidad ? 500 : 400, color: u.ultima_utilidad ? '#000000' : '#C7C7CC'}}>
                          {u.ultima_utilidad ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>Feedback</h2>
          {feedbacks.length === 0 ? (
            <p style={s.empty}>Aún no hay feedback registrado.</p>
          ) : (
            <div style={s.list}>
              {feedbacks.map(f => (
                <article key={f.id} style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={{flex: 1}}>
                      <div style={s.userName}>{f.userNombre || f.userEmail}</div>
                      {f.userNombre && <div style={s.userEmailInline}>{f.userEmail}</div>}
                      <div style={s.cardMeta}>
                        {new Date(f.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {f.momento}
                      </div>
                    </div>
                    {f.utilidad !== null && (
                      <div style={getUtilityBadgeStyle(f.utilidad)}>
                        {f.utilidad}
                      </div>
                    )}
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
  userEmailInline: {
    fontSize: 12,
    color: '#6C6C70',
    fontWeight: 400,
    marginTop: 2,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    background: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
  },
  metricLabel: {
    fontSize: 13,
    color: '#6C6C70',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 500,
    color: '#000000',
  },
  tableWrapper: {
    border: '0.5px solid rgba(60,60,67,0.18)',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#FFFFFF',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  tableHeaderRow: {
    background: '#F2F2F7',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontWeight: 500,
    color: '#6C6C70',
    fontSize: 12,
  },
  tableRow: {
    borderTop: '0.5px solid rgba(60,60,67,0.12)',
  },
  td: {
    padding: '10px 12px',
    color: '#000000',
  },
  tdName: {
    fontSize: 13,
    color: '#000000',
  },
  tdEmail: {
    fontSize: 11,
    color: '#6C6C70',
    marginTop: 2,
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 6,
  },
  statusPending: {
    background: '#F2F2F7',
    color: '#6C6C70',
  },
  statusComplete: {
    background: '#EAF3DE',
    color: '#27500A',
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
