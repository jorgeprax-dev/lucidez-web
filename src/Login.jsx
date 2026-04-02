import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mode, setMode]         = useState("login");
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    else navigate("/dashboard", { replace: true });
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Georgia, serif" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.1em", color: "#1A1A1A" }}>LUCIDEZ</div>
        <div style={{ fontSize: 11, color: "#8A7F74", marginTop: 4 }}>Ver claro · Actuar bien · Vivir bien</div>
      </div>

      <div style={{ background: "#FFFFFF", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "32px 28px", width: "100%", maxWidth: 360 }}>
        <p style={{ fontSize: 16, color: "#1A1A1A", marginBottom: 24, textAlign: "center" }}>
          {mode === "login" ? "Entra a tu programa" : "Crea tu cuenta"}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A7F74", marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #D0C8BC", background: "transparent", fontFamily: "Georgia, serif", fontSize: 16, color: "#1A1A1A", marginBottom: 20, display: "block", outline: "none" }}
          />
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A7F74", marginBottom: 6 }}>Contraseña</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #D0C8BC", background: "transparent", fontFamily: "Georgia, serif", fontSize: 16, color: "#1A1A1A", marginBottom: 28, display: "block", outline: "none" }}
          />

          {error && <p style={{ fontSize: 12, color: "#E24B4A", marginBottom: 16 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "#1A1A1A", color: "#FAF7F2", border: "none", borderRadius: 6, fontFamily: "Georgia, serif", fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
            {loading ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          style={{ width: "100%", padding: 14, background: "transparent", color: "#8A7F74", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 6, fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer" }}>
          {mode === "login" ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Entrar"}
        </button>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={() => navigate("/", { replace: true })} style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#8A7F74", background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}>
            ← Regresar
          </button>
        </div>
      </div>
    </div>
  );
}
