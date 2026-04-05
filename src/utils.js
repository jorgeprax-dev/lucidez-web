import { supabase } from "./supabaseClient";

export function generarSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function generarReportePublico({ scores, overall, nivel, aiReport }) {
  try {
    const frase = aiReport
      ? aiReport.replace(/PREGUNTA_DINAMICA:.*$/m, "").trim().split("\n\n")[0]
      : null;

    const fraseAnonima = frase
      ? frase.replace(/^[^,]+,/, "Tu perfil,")
      : null;

    const slug = generarSlug();

    const { error } = await supabase.from("reportes_publicos").insert([{
      slug,
      scores,
      overall,
      nivel,
      frase: fraseAnonima,
    }]);

    if (error) {
      console.error("Error guardando reporte público:", error);
      return null;
    }
    return slug;
  } catch (e) {
    console.error("Error generando reporte público:", e);
    return null;
  }
}
