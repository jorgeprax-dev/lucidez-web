import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Home from "./Home.jsx";
import Indice from "./Indice.jsx";
import Dashboard from "./Dashboard.jsx";
import Roadmap from "./Roadmap.jsx";
import Chat from "./Chat.jsx";
import Login from "./Login.jsx";
import Evaluacion from "./Evaluacion.jsx";
import ReporteIndice from "./ReporteIndice.jsx";
import Curso from "./Curso.jsx";
import Leccion from "./Leccion.jsx";
import ReportePublico from "./ReportePublico.jsx";

// Maneja el callback de magic link — procesa el token y redirige al dashboard
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: "#8A7F74", fontSize: "14px" }}>
      Entrando…
    </div>
  );
}

// Protege rutas que requieren sesión activa
function PrivateRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargando sesión — no redirige todavía
  if (session === undefined) return null;

  // Sin sesión — manda al login
  if (!session) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/r/:slug" element={<ReportePublico />} />

        {/* Rutas privadas — requieren sesión */}
        <Route path="/indice" element={<Indice />} />
        <Route path="/reporte-indice" element={<PrivateRoute><ReporteIndice /></PrivateRoute>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <PrivateRoute>
              <Roadmap />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/evaluacion/:dimension"
          element={
            <PrivateRoute>
              <Evaluacion />
            </PrivateRoute>
          }
        />
        <Route
          path="/curso/:dimension"
          element={
            <PrivateRoute>
              <Curso />
            </PrivateRoute>
          }
        />
        <Route
          path="/leccion/:dimension/:nivel/:numero"
          element={
            <PrivateRoute>
              <Leccion />
            </PrivateRoute>
          }
        />

        {/* Cualquier ruta desconocida → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
