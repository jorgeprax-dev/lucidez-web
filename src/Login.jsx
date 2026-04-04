import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Georgia, serif" }}>
      <div style={{ background: "#FAFAF7", border: "1px solid #E8E2D9", borderRadius: "16px", padding: "44px 40px", width: "100%", maxWidth: 400 }}>

        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ fontSize: 22, letterSpacing: "0.08em", color: "#1A1A1A", marginBottom: 8 }}>lucidez</div>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A89E", fontFamily: "'Courier New', monospace" }}>Ver claro · Actuar bien · Vivir bien</div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 16, color: "#1A1A1A", marginBottom: 12 }}>Revisa tu correo</p>
            <p style={{ fontSize: 13, color: "#8A7F74", lineHeight: 1.6 }}>Te enviamos un enlace a <strong>{email}</strong>. Un clic y entras — sin contraseña.</p>
          </div>
        ) : (
          <>
            <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={{ width: "100%", padding: "15px", background: "#FFFFFF", color: "#1A1A1A", border: "1px solid #E8E2D9", borderRadius: "8px", fontFamily: "Georgia, serif", fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? 0.6 : 1, marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: "1px", background: "#E8E2D9" }}></div>
              <span style={{ color: "#B0A89E", fontSize: 13 }}>o</span>
              <div style={{ flex: 1, height: "1px", background: "#E8E2D9" }}></div>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0A89E", marginBottom: 8, fontFamily: "'Courier New', monospace" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: "100%", padding: "12px 0", border: "none", borderBottom: "1.5px solid #D0C8BC", background: "transparent", fontFamily: "Georgia, serif", fontSize: 17, color: "#1A1A1A", marginBottom: 28, display: "block", outline: "none" }} />
              {error && <p style={{ fontSize: 12, color: "#E24B4A", marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", background: "#1A1A1A", color: "#FAF7F2", border: "none", borderRadius: "8px", fontFamily: "Georgia, serif", fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Enviando..." : "Enviar enlace de acceso"}
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button type="button" onClick={() => navigate("/")} style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#B0A89E", background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Regresar al inicio</button>
        </div>

      </div>
    </div>
  );
}