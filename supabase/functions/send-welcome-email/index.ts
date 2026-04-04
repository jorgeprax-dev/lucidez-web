import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { nombre, email, scores, overall, zona } = await req.json();

    const dimLabels: Record<string, string> = {
      presencia: "Presencia",
      claridad: "Claridad cognitiva",
      regulacion: "Regulación emocional",
      valores: "Valores",
      autoconocimiento: "Autoconocimiento",
      agencia: "Agencia",
    };

    const dimColors: Record<string, string> = {
      presencia: "#3d7a65",
      claridad: "#9a5e2e",
      regulacion: "#6a3d82",
      valores: "#2d6382",
      autoconocimiento: "#4d6d2a",
      agencia: "#7a6520",
    };

    const zonaColor = zona === "Zona verde" ? "#3d7a65" : zona === "Zona ámbar" ? "#9a5e2e" : "#8A3030";
    const zonaBg = zona === "Zona verde" ? "#edf4f0" : zona === "Zona ámbar" ? "#f5ede4" : "#f5e8e8";

    const barras = Object.entries(scores).map(([id, score]) => {
      const pct = score as number;
      const color = dimColors[id] || "#888";
      const label = dimLabels[id] || id;
      return `
        <tr>
          <td style="font-family:'Courier New',monospace;font-size:9px;color:#a09890;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:8px;width:130px;">${label}</td>
          <td style="padding-bottom:8px;">
            <div style="height:4px;background:#ede9e3;border-radius:2px;">
              <div style="height:4px;width:${pct}%;background:${color};border-radius:2px;max-width:100%;"></div>
            </div>
          </td>
          <td style="font-family:'Courier New',monospace;font-size:9px;color:#6b6460;text-align:right;padding-left:8px;padding-bottom:8px;width:24px;">${pct}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Índice de Lucidez</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece6;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:6px;border:1px solid #ddd8d0;overflow:hidden;">

        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #ede9e3;">
            <p style="margin:0;font-size:18px;color:#1a1714;letter-spacing:0.04em;">lucidez</p>
            <p style="margin:5px 0 0;font-size:10px;color:#a09890;letter-spacing:0.1em;font-family:'Courier New',monospace;text-transform:uppercase;">Ver claro · Actuar bien · Vivir bien</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 40px 24px;background:#f7f4f0;border-bottom:1px solid #ede9e3;">
            <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:10px;color:#a09890;letter-spacing:0.1em;text-transform:uppercase;">Tu Índice de Lucidez · ${nombre}</p>
            <p style="margin:0 0 16px;">
              <span style="font-size:48px;color:${zonaColor};line-height:1;letter-spacing:-0.02em;">${overall}</span>
              <span style="font-family:'Courier New',monospace;font-size:11px;color:${zonaColor};letter-spacing:0.06em;text-transform:uppercase;background:${zonaBg};padding:3px 10px;border-radius:2px;margin-left:12px;">${zona}</span>
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">${barras}</table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px 28px;">
            <p style="margin:0 0 20px;font-size:15px;color:#1a1714;line-height:1.7;">Tu reporte clínico completo está en tu cuenta. Incluye el patrón específico de tu perfil, las implicaciones clínicas y el primer paso sugerido.</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6b6460;line-height:1.7;">El enlace de abajo te da acceso directo — sin contraseña, sin formularios.</p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#1a1714;border-radius:2px;">
                  <a href="https://lucidez.app/dashboard" style="display:inline-block;padding:14px 32px;font-family:'Courier New',monospace;font-size:12px;color:#f7f4f0;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;">Ver mi reporte →</a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:11px;color:#a09890;line-height:1.6;font-family:'Courier New',monospace;">Si no solicitaste este acceso, ignora este mensaje.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #ede9e3;">
            <p style="margin:0;font-size:11px;color:#b8b0a8;line-height:1.6;font-family:'Courier New',monospace;">lucidez.app — Bienestar mental basado en ciencia.<br>Tampico, México · hola@lucidez.app</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Lucidez <hola@lucidez.app>",
        to: [email],
        subject: `${nombre}, tu Índice de Lucidez`,
        html,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});