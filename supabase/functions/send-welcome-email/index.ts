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
      presencia: "#34C759",
      claridad: "#FF9500",
      regulacion: "#AF52DE",
      valores: "#007AFF",
      autoconocimiento: "#5AC8FA",
      agencia: "#FF2D55",
    };

    const zonaColor = zona === "Zona verde" ? "#34C759" : zona === "Zona ámbar" ? "#FF9500" : "#FF3B30";
    const zonaBg = zona === "Zona verde" ? "#E8F8ED" : zona === "Zona ámbar" ? "#FFF3E0" : "#FFE8E7";

    const barras = Object.entries(scores).map(([id, score]) => {
      const pct = score as number;
      const color = dimColors[id] || "#888";
      const label = dimLabels[id] || id;
      return `
        <tr>
          <td style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:9px;color:#6C6C70;text-transform:uppercase;letter-spacing:0.06em;padding-bottom:8px;width:130px;">${label}</td>
          <td style="padding-bottom:8px;">
            <div style="height:4px;background:#E5E5EA;border-radius:2px;">
              <div style="height:4px;width:${pct}%;background:${color};border-radius:2px;max-width:100%;"></div>
            </div>
          </td>
          <td style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:9px;color:#3C3C43;text-align:right;padding-left:8px;padding-bottom:8px;width:24px;">${pct}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Índice de Lucidez</title>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F7;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F7;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;">

        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid rgba(60,60,67,0.18);">
            <p style="margin:0;font-size:17px;font-weight:700;color:#000000;letter-spacing:-0.3px;">lucidez</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6C6C70;letter-spacing:0.04em;">Ver claro · Actuar bien · Vivir bien</p>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px 20px;background:#F2F2F7;border-bottom:1px solid rgba(60,60,67,0.18);">
            <p style="margin:0 0 4px;font-size:12px;font-weight:500;color:#6C6C70;letter-spacing:0.06em;">ÍNDICE DE LUCIDEZ · ${nombre}</p>
            <p style="margin:0 0 16px;">
              <span style="font-size:56px;font-weight:700;color:${zonaColor};line-height:1;letter-spacing:-2px;">${overall}</span>
              <span style="font-size:13px;font-weight:600;color:${zonaColor};background:${zonaBg};padding:4px 12px;border-radius:20px;margin-left:12px;">${zona}</span>
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">${barras}</table>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 24px;">
            <p style="margin:0 0 8px;font-size:17px;font-weight:600;color:#000000;line-height:1.4;">Tu reporte está listo.</p>
            <p style="margin:0 0 24px;font-size:15px;color:#3C3C43;line-height:1.6;">Incluye el patrón específico de cómo funciona tu mente, qué lo sostiene, y un primer paso concreto para esta semana.</p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#007AFF;border-radius:12px;">
                  <a href="https://lucidez.app/dashboard" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Ver mi reporte →</a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:12px;color:#6C6C70;line-height:1.6;">Si no solicitaste este acceso, ignora este mensaje.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid rgba(60,60,67,0.18);">
            <p style="margin:0;font-size:12px;color:#8E8E93;line-height:1.6;">lucidez.app — El mapa más preciso de cómo funciona tu mente.<br>Tampico, México · hola@lucidez.app</p>
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