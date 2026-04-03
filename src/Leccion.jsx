import { useParams, useNavigate } from "react-router-dom";

const CONTENIDO = {
  regulacion: {
    1: {
      1: {
        titulo: "Las emociones no son el problema",
        lectura: "Hay una idea que la mayoría cargamos sin cuestionarla: que sentir cosas intensas es un defecto. Que si te desbordan las emociones, algo está mal contigo.\n\nNo es así.\n\nLas emociones son un sistema de información. Evolucionaron para darte datos sobre lo que importa, lo que amenaza, lo que necesitas. El miedo te avisa de peligro. La tristeza señala una pérdida real. La rabia dice que algo que valoras fue violado.\n\nEl problema no es sentir. El problema es qué hacemos cuando sentimos.\n\nLa mayoría aprendemos una de dos estrategias que no funcionan:\n\nSuprimir — ignorar, distraer, anestesiar. Funciona a corto plazo. A largo plazo, las emociones suprimidas se acumulan y eventualmente explotan con más fuerza, o se convierten en ansiedad crónica, tensión física, o distancia emocional.\n\nActuar en el pico — decir lo que no debes, tomar decisiones que después lamentas, reaccionar antes de procesar. La emoción conduce, tú vas de pasajero.\n\nHay una tercera opción que no nos enseñaron: sentir sin suprimir y sin actuar impulsivamente. Eso es regulación emocional. No es control — es contacto consciente con lo que sientes mientras decides cómo responder.",
        ejercicio: "Piensa en algo que te haya generado una emoción notable hoy o ayer. Responde estas tres preguntas:\n\n1. ¿Qué emoción fue? Nómbrala con precisión — no 'me sentí mal', sino frustración, vergüenza, miedo, tristeza, enojo.\n2. ¿Dónde la sentiste en el cuerpo? Pecho apretado, mandíbula tensa, nudo en el estómago, calor en la cara.",
        journaling: "¿Qué emoción evitas más? ¿Qué crees que pasaría si la dejaras estar sin hacer nada al respecto?"
      },
      2: {
        titulo: "El ciclo de desbordamiento",
        lectura: "Las emociones no aparecen de la nada. Hay un ciclo que siempre se repite — y cuando lo puedes ver, puedes intervenir antes de que sea demasiado tarde.\n\nEl ciclo tiene cuatro pasos:\n\nEstímulo — algo pasa. Una palabra, un tono, una situación, un recuerdo.\n\nInterpretación — tu mente le da un significado en milisegundos. 'Me están ignorando.' 'Esto siempre me pasa.' 'No soy suficiente.' Esa interpretación no es un hecho — es una hipótesis. Pero el cerebro la trata como verdad.\n\nEmoción — la interpretación genera una respuesta emocional. Si interpretas amenaza, viene miedo o rabia. Si interpretas pérdida, viene tristeza. Si interpretas humillación, viene vergüenza.\n\nConducta — la emoción empuja hacia una acción. Atacar, huir, congelarse, anestesiarse.\n\nEl desbordamiento ocurre cuando el ciclo va tan rápido que saltas directo del estímulo a la conducta sin pasar por la conciencia. El trabajo de regulación emocional es insertar una pausa entre la emoción y la conducta.\n\nEsa pausa es donde vive la libertad.",
        ejercicio: "Piensa en un episodio reciente donde te desbordaste — o casi. Mapea el ciclo completo:\n\n1. ¿Cuál fue el estímulo?\n2. ¿Qué interpretó tu mente automáticamente?\n3. ¿Qué emoción vino?\n4. ¿Qué hiciste o quisiste hacer?",
        journaling: "¿En qué parte del ciclo pierdes el control normalmente — en la interpretación, en la emoción, o en la conducta? ¿Cómo sabes que ya estás ahí?"
      },
      3: {
        titulo: "Tu termómetro emocional",
        lectura: "El problema con el desbordamiento no es la emoción en el pico — ahí ya es demasiado tarde. El problema es que no notamos la emoción cuando todavía es manejable.\n\nTu cuerpo siempre avisa antes que tu mente.\n\nAntes de que explotes, antes de que digas lo que no debes, antes de que tomes la decisión que vas a lamentar — tu cuerpo ya lleva minutos, a veces horas, mandando señales. Tensión en los hombros. Mandíbula apretada. Respiración corta. Calor en el pecho. Nudo en el estómago.\n\nEsas señales son tu termómetro emocional. Y la mayoría las ignoramos porque aprendimos a vivir desconectados del cuerpo.\n\nHay tres zonas:\n\nVerde — 1 a 3 — calma, presencia, capacidad de responder conscientemente.\n\nÁmbar — 4 a 7 — activación creciente. Todavía puedes intervenir. Aquí es donde las herramientas funcionan mejor.\n\nRojo — 8 a 10 — desbordamiento. La corteza prefrontal se desconecta. Ya no puedes razonar ni regular — solo sobrevivir. Aquí el único objetivo es bajar la intensidad, no resolver nada.\n\nLa mayoría intentamos regular en rojo. No funciona. El objetivo es detectar el ámbar.",
        ejercicio: "Cierra los ojos un momento. Haz tres respiraciones lentas. Ahora escanea tu cuerpo de arriba a abajo.\n\nIdentifica tus tres señales personales de alerta temprana — las que aparecen cuando estás en ámbar, antes de llegar al rojo:\n\n1. Señal 1 — ¿dónde y cómo se siente?\n2. Señal 2 — ¿dónde y cómo se siente?\n3. Señal 3 — ¿dónde y cómo se siente?",
        journaling: "¿Qué situaciones casi siempre disparan esas señales? ¿Hay personas, lugares, o momentos del día que te llevan al ámbar con más frecuencia?"
      },
      4: {
        titulo: "TIPP — el freno de emergencia",
        lectura: "Ya sabes detectar el ámbar. Ahora necesitas una herramienta para bajar la intensidad antes de llegar al rojo.\n\nTIPP es la intervención biológica de DBT. No trabaja con pensamientos ni con interpretaciones — trabaja directamente con el sistema nervioso. Por eso funciona cuando todo lo demás falla.\n\nSon cuatro técnicas:\n\nT — Temperature. El frío activa el reflejo de inmersión — una respuesta fisiológica que baja el ritmo cardíaco en segundos. Moja tu cara con agua fría. Sostén hielo en las manos.\n\nI — Intense exercise. La activación emocional genera energía física que necesita salir. 10 minutos de ejercicio intenso metaboliza esa energía y regula el sistema nervioso.\n\nP — Paced breathing. Exhalar más largo que inhalar activa el sistema nervioso parasimpático. Inhala 4 tiempos, exhala 6. Repite 10 veces.\n\nP — Progressive relaxation. Tensa cada grupo muscular por 5 segundos y suéltalo. Empieza por los pies, sube hasta la cara.\n\nLa clave de TIPP es usarla en ámbar, no en rojo. En rojo ya es difícil recordar que existe.",
        ejercicio: "Practica la respiración rítmica ahora mismo. Cinco minutos.\n\nInhala por la nariz contando 4 tiempos.\nExhala por la boca contando 6 tiempos.\nRepite sin prisa.\n\nAl terminar, nota la diferencia en tu cuerpo.",
        journaling: "¿Cuál de las cuatro técnicas de TIPP se siente más accesible para ti en un momento de activación? ¿Por qué esa y no las otras?"
      },
      5: {
        titulo: "Surfear la ola",
        lectura: "Hay algo que nadie te dijo sobre las emociones: tienen una curva.\n\nSuben. Llegan a un pico. Y bajan. Siempre. Sin excepción.\n\nEl problema es que en el pico se siente como si fueran a durar para siempre. El cerebro en modo de amenaza no puede ver más allá del momento — y eso hace que actúes como si la emoción nunca fuera a bajar.\n\nPero siempre baja.\n\nLa investigación de DBT muestra que la mayoría de las emociones intensas, si no se alimentan con pensamientos rumiantes ni con conductas que las amplifican, duran entre 60 y 90 minutos en llegar al pico y comenzar a descender. Muchas veces mucho menos.\n\nSurfear la ola es exactamente eso: no luchar contra la emoción, no huir de ella, no alimentarla — simplemente montarla.\n\nTres principios:\n\nNo alimentes la ola — los pensamientos rumiantes son viento que hace crecer la ola. Nótalos y déjalos pasar.\n\nMantén contacto con el cuerpo — ¿dónde sientes la emoción ahora? Observar la sensación física ancla la atención al presente.\n\nRecuerda que la ola siempre baja — no como pensamiento positivo, sino como dato. Ya ha bajado antes.",
        ejercicio: "Trae a la memoria una emoción difícil reciente — algo manejable. Cierra los ojos.\n\nImagina esa emoción como una ola en el océano. Obsérvala desde tu tabla de surf. Nota cómo sube. Siente dónde está en tu cuerpo. No hagas nada — solo observa.\n\nQuédate ahí dos minutos. Nota si la intensidad cambia solo con observarla.",
        journaling: "¿Qué harías diferente la próxima vez si supieras con certeza que la emoción va a bajar sola en menos de una hora? ¿Qué decisiones o palabras te ahorrarías?"
      }
    }
  }
};

export default function Leccion() {
  const { dimension, nivel, numero } = useParams();
  const navigate = useNavigate();

  const contenido = CONTENIDO[dimension]?.[nivel]?.[numero];
  const total = 5; // hardcoded para nivel 1
  const current = Number(numero) || 1;
  const siguienteNum = current < total ? current + 1 : null;

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#FAF7F2", color: "#1a1a1a", minHeight: "100vh" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px" }}>
        <button
          onClick={() => navigate(`/curso/${dimension}`)}
          style={{ marginBottom: 20, background: "transparent", border: "none", color: "#5BA08A", fontSize: 14, cursor: "pointer" }}
        >
          ← Curso
        </button>

        <div style={{ marginBottom: 24, border: "0.5px solid #e8e2d9", padding: 18, borderRadius: 8, background: "#fff" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>
            {dimension.charAt(0).toUpperCase() + dimension.slice(1)} · Nivel {nivel} · Lección {numero}: {contenido?.titulo || "Lección no disponible"}
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666" }}>Lección {current} de {total}</p>
          <div style={{ marginTop: 12, height: 6, background: "#e8e2d9", borderRadius: 3 }}>
            <div style={{ width: `${(current / total) * 100}%`, height: "100%", background: "#5BA08A", borderRadius: 3 }} />
          </div>
        </div>

        {contenido ? (
          <div style={{ display: "grid", gap: 14 }}>
            <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Lectura</h2>
              <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{contenido.lectura}</p>
            </section>

            <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Ejercicio</h2>
              <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{contenido.ejercicio}</p>
            </section>

            <section style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Journaling</h2>
              <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>{contenido.journaling}</p>
            </section>
          </div>
        ) : (
          <div style={{ border: "0.5px solid #e8e2d9", background: "#fff", borderRadius: 8, padding: 16 }}>
            <p style={{ margin: 0, color: "#666" }}>Lección no disponible</p>
          </div>
        )}

        <div style={{ marginTop: 26, textAlign: "right" }}>
          {siguienteNum ? (
            <button
              onClick={() => {
                localStorage.setItem(`leccion_${dimension}_${nivel}_${numero}`, 'completada');
                navigate(`/leccion/${dimension}/${nivel}/${siguienteNum}`);
              }}
              style={{ padding: "12px 20px", background: "#5BA08A", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
            >
              Siguiente lección →
            </button>
          ) : (
            <button
              disabled
              style={{ padding: "12px 20px", background: "#ccc", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, cursor: "not-allowed" }}
            >
              Completado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
