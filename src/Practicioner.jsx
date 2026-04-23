import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { theme } from './theme';

export default function Practicioner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      // 1. Verificar sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // 2. Verificar si es practicioner
      const { data: practicionerData, error: pError } = await supabase
        .from('practicioners')
        .select('id, nombre, institucion')
        .eq('user_id', session.user.id)
        .single();

      if (pError || !practicionerData) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      // 3. Cargar lista de usuarios desde la vista
      const { data: usersData, error: uError } = await supabase
        .from('practicioner_users_view')
        .select('*')
        .order('last_activity', { ascending: false });

      if (uError) {
        setError(uError.message);
        setLoading(false);
        return;
      }

      setUsers(usersData || []);
      setLoading(false);
    }

    init();
  }, [navigate]);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function handleVerReporte(userId) {
    navigate(`/dashboard?as_practicioner=${userId}`);
  }

  // Estilos inline siguiendo paleta Apple del producto
  const s = {
    page: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px 80px',
      fontFamily: theme.typography.fontFamily,
    },
    header: {
      marginBottom: '40px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${theme.colors.border || '#E5E5EA'}`,
    },
    title: {
      fontSize: '28px',
      fontWeight: 600,
      color: theme.colors.textPrimary || '#000000',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '15px',
      color: theme.colors.textSecondary || '#6C6C70',
    },
    counter: {
      fontSize: '13px',
      color: theme.colors.textSecondary || '#6C6C70',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: 600,
      color: theme.colors.textSecondary || '#6C6C70',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '12px 16px',
      borderBottom: `1px solid ${theme.colors.border || '#E5E5EA'}`,
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      color: theme.colors.textPrimary || '#000000',
      borderBottom: `1px solid ${theme.colors.border || '#E5E5EA'}`,
    },
    nameCell: {
      fontWeight: 500,
    },
    emailCell: {
      color: theme.colors.textSecondary || '#6C6C70',
      fontSize: '13px',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 500,
    },
    statusComplete: {
      background: '#E8F5E9',
      color: '#2E7D32',
    },
    statusPending: {
      background: '#F2F2F7',
      color: '#6C6C70',
    },
    button: {
      background: theme.colors.primary || '#007AFF',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'inherit',
    },
    notAuthorized: {
      textAlign: 'center',
      padding: '80px 20px',
      color: theme.colors.textSecondary || '#6C6C70',
    },
    loading: {
      textAlign: 'center',
      padding: '80px 20px',
      color: theme.colors.textSecondary || '#6C6C70',
    },
    empty: {
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.colors.textSecondary || '#6C6C70',
    },
  };

  if (loading) {
    return <div style={s.page}><div style={s.loading}>Cargando…</div></div>;
  }

  if (!authorized) {
    return (
      <div style={s.page}>
        <div style={s.notAuthorized}>
          <h2>Acceso restringido</h2>
          <p>Esta sección está reservada para personal autorizado.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.page}>
        <div style={s.notAuthorized}>
          <h2>Error al cargar</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Panel del practicioner</h1>
        <p style={s.subtitle}>Vista de usuarios registrados en Lucidez.</p>
      </div>

      <div style={s.counter}>{users.length} usuarios registrados</div>

      {users.length === 0 ? (
        <div style={s.empty}>No hay usuarios registrados aún.</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Última actividad</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td style={{ ...s.td, ...s.nameCell }}>{u.nombre || '—'}</td>
                <td style={{ ...s.td, ...s.emailCell }}>{u.email}</td>
                <td style={s.td}>{formatDate(u.last_activity)}</td>
                <td style={s.td}>
                  {u.completo_indice ? (
                    <span style={{ ...s.statusBadge, ...s.statusComplete }}>
                      Índice completo
                      {u.evaluaciones_profundas_count > 0 && ` · ${u.evaluaciones_profundas_count} eval`}
                    </span>
                  ) : (
                    <span style={{ ...s.statusBadge, ...s.statusPending }}>Sin completar</span>
                  )}
                </td>
                <td style={s.td}>
                  {u.completo_indice && (
                    <button
                      style={s.button}
                      onClick={() => handleVerReporte(u.user_id)}
                    >
                      Ver reporte →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}