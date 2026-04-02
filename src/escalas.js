// ─── ESCALAS PSICOMÉTRICAS VALIDADAS · LUCIDEZ ───────────────────────────────
// Evaluación profunda por dimensión
// Todas las escalas están validadas clínicamente y tienen versiones en español

export const ESCALAS = {

  // ─── PRESENCIA · MAAS-5 ───────────────────────────────────────────────────
  // Mindful Attention Awareness Scale (versión breve)
  // Brown & Ryan, 2003 · Creswell et al., 2006
  // Escala: 1 (casi siempre) → 6 (casi nunca) · INVERTIDA: mayor score = más presencia
  presencia: {
    id: "presencia",
    label: "Presencia",
    escala: "MAAS-5",
    referencia: "Brown & Ryan, 2003 · Creswell et al., 2006",
    instruccion: "Indica con qué frecuencia tienes cada una de estas experiencias. Usa la escala del 1 al 6, donde 1 es 'casi siempre' y 6 es 'casi nunca'.",
    tipo: "frecuencia_invertida",
    opciones: ["Casi siempre", "Muy frecuentemente", "Con cierta frecuencia", "Algo frecuentemente", "Raramente", "Casi nunca"],
    preguntas: [
      { id: "maas_1", texto: "Puedo estar experimentando alguna emoción sin ser consciente de ella hasta un momento después." },
      { id: "maas_2", texto: "Rompo o derramo cosas por descuido, por no prestar atención o por estar pensando en otra cosa." },
      { id: "maas_3", texto: "Me resulta difícil mantener mi atención en lo que está ocurriendo en el presente." },
      { id: "maas_4", texto: "Tiendo a caminar rápidamente para llegar a donde voy sin prestar atención a lo que experimento durante el trayecto." },
      { id: "maas_5", texto: "Me cuesta notar las sensaciones de tensión física o incomodidad hasta que realmente me llaman la atención." },
    ],
    scoring: "invertido", // 6 = mejor
    interpretacion: {
      alto: "Tu atención al momento presente es alta. Tienes una capacidad desarrollada para notar lo que ocurre en tu experiencia sin perderte en el piloto automático.",
      medio: "Tu presencia es moderada. Hay momentos de conciencia plena, pero también períodos en que el piloto automático toma el control.",
      bajo: "Tu mente tiende a estar en otro lado. El piloto automático domina con frecuencia, llevándote lejos del momento presente.",
    }
  },

  // ─── CLARIDAD COGNITIVA · ATQ-8 ──────────────────────────────────────────
  // Automatic Thoughts Questionnaire (versión breve)
  // Hollon & Kendall, 1980 · Netemeyer et al., 2002
  // Escala: 1 (nunca) → 5 (siempre) · DIRECTA: mayor score = más pensamientos negativos
  claridad: {
    id: "claridad",
    label: "Claridad cognitiva",
    escala: "ATQ-8",
    referencia: "Hollon & Kendall, 1980",
    instruccion: "A continuación se presentan algunos pensamientos que pueden aparecer en la mente de las personas. Indica con qué frecuencia, si acaso, los pensamientos te han ocurrido durante la última semana.",
    tipo: "frecuencia",
    opciones: ["Nunca", "A veces", "Con moderada frecuencia", "Con frecuencia", "Siempre"],
    preguntas: [
      { id: "atq_1", texto: "Siento que he fallado." },
      { id: "atq_2", texto: "Nunca voy a conseguirlo." },
      { id: "atq_3", texto: "Me siento incapaz." },
      { id: "atq_4", texto: "No puedo soportar esto." },
      { id: "atq_5", texto: "Estoy decepcionado conmigo mismo." },
      { id: "atq_6", texto: "Nada me sale bien." },
      { id: "atq_7", texto: "Soy un perdedor." },
      { id: "atq_8", texto: "No me gusto a mí mismo." },
    ],
    scoring: "invertido_al_mostrar", // score alto = peor, invertir para mostrar
    interpretacion: {
      alto: "Tus pensamientos automáticos negativos son poco frecuentes. Tu narrativa interna no te sabotea de forma habitual.",
      medio: "Aparecen pensamientos automáticos negativos con cierta regularidad. El trabajo de reestructuración cognitiva puede ayudarte a manejarlos.",
      bajo: "Los pensamientos automáticos negativos son frecuentes y persistentes. Este es el territorio central del trabajo de CBT.",
    }
  },

  // ─── REGULACIÓN EMOCIONAL · DERS-16 ──────────────────────────────────────
  // Difficulties in Emotion Regulation Scale (versión breve)
  // Gratz & Roemer, 2004 · Bjureberg et al., 2016
  // Escala: 1 (casi nunca) → 5 (casi siempre) · DIRECTA: mayor score = más dificultad
  regulacion: {
    id: "regulacion",
    label: "Regulación emocional",
    escala: "DERS-16",
    referencia: "Gratz & Roemer, 2004 · Bjureberg et al., 2016",
    instruccion: "Indica con qué frecuencia las siguientes afirmaciones se aplican a ti cuando te sientes con emociones negativas o perturbado.",
    tipo: "frecuencia",
    opciones: ["Casi nunca (0-10%)", "A veces (11-35%)", "La mitad del tiempo (36-65%)", "Con frecuencia (66-90%)", "Casi siempre (91-100%)"],
    preguntas: [
      { id: "ders_1", texto: "Presto atención a cómo me siento." },
      { id: "ders_2", texto: "Tengo claridad sobre mis sentimientos." },
      { id: "ders_3", texto: "Cuando estoy perturbado, reconozco mis emociones." },
      { id: "ders_4", texto: "Cuando estoy perturbado, creo que me quedaré así por mucho tiempo." },
      { id: "ders_5", texto: "Cuando estoy perturbado, tengo dificultad para hacer el trabajo." },
      { id: "ders_6", texto: "Cuando estoy perturbado, pierdo el control de mi comportamiento." },
      { id: "ders_7", texto: "Cuando estoy perturbado, creo que terminaré muy deprimido." },
      { id: "ders_8", texto: "Cuando estoy perturbado, tengo dificultad para concentrarme." },
      { id: "ders_9", texto: "Cuando estoy perturbado, tengo dificultad para controlar mis comportamientos." },
      { id: "ders_10", texto: "Cuando estoy perturbado, siento que soy débil." },
      { id: "ders_11", texto: "Cuando estoy perturbado, siento que no puedo hacer nada al respecto." },
      { id: "ders_12", texto: "Cuando estoy perturbado, me enojo conmigo mismo por sentirme así." },
      { id: "ders_13", texto: "Cuando estoy perturbado, me avergüenzo de sentirme así." },
      { id: "ders_14", texto: "Cuando estoy perturbado, tengo dificultad para pensar en otra cosa." },
      { id: "ders_15", texto: "Cuando estoy perturbado, me toma mucho tiempo sentirme mejor." },
      { id: "ders_16", texto: "Cuando estoy perturbado, mis emociones se sienten abrumadoras." },
    ],
    scoring: "invertido_al_mostrar",
    preguntas_invertidas: ["ders_1", "ders_2", "ders_3"], // estas van al revés
    interpretacion: {
      alto: "Tu regulación emocional es sólida. Puedes sentir emociones intensas sin que tomen el control de tu conducta.",
      medio: "Tienes dificultades moderadas en regulación emocional. Hay situaciones donde las emociones te desbordan más de lo que quisieras.",
      bajo: "La regulación emocional es un área de trabajo prioritario. Las emociones intensas frecuentemente desbordan tu capacidad de respuesta.",
    }
  },

  // ─── ALINEACIÓN DE VALORES · VQ-8 ────────────────────────────────────────
  // Valuing Questionnaire (versión breve)
  // Smout et al., 2014 · Wilson et al., 2010
  // Escala: 0 (nada verdadero) → 6 (completamente verdadero)
  valores: {
    id: "valores",
    label: "Alineación de valores",
    escala: "VQ-8",
    referencia: "Smout et al., 2014 · Wilson et al., 2010",
    instruccion: "Las siguientes afirmaciones describen diferentes aspectos de cómo las personas actúan en relación a lo que es importante para ellas. Indica qué tan verdadero fue esto para ti durante la última semana.",
    tipo: "verdadero",
    opciones: ["Nada verdadero", "Muy poco verdadero", "Poco verdadero", "Algo verdadero", "Bastante verdadero", "Muy verdadero", "Completamente verdadero"],
    preguntas: [
      { id: "vq_1", texto: "Hice cosas que fueron importantes para mí.", rev: false },
      { id: "vq_2", texto: "Mis acciones estuvieron en línea con lo que más me importa en la vida.", rev: false },
      { id: "vq_3", texto: "Me comprometí con actividades que son significativas para mí.", rev: false },
      { id: "vq_4", texto: "Viví de acuerdo con mis valores personales.", rev: false },
      { id: "vq_5", texto: "Me distraje de hacer cosas que son importantes para mí.", rev: true },
      { id: "vq_6", texto: "Me preocupé tanto que no pude hacer las cosas que valoro.", rev: true },
      { id: "vq_7", texto: "Evité situaciones que me habrían permitido hacer lo que valoro.", rev: true },
      { id: "vq_8", texto: "No hice lo que era importante para mí porque no tenía la energía.", rev: true },
    ],
    scoring: "mixto",
    interpretacion: {
      alto: "Hay alta coherencia entre lo que valoras y cómo vives. Tus acciones reflejan tus valores de forma consistente.",
      medio: "Hay cierta brecha entre valores y conducta. A veces el miedo, la distracción o el agotamiento te alejan de lo que importa.",
      bajo: "La brecha valores-conducta es significativa. Esto genera una incomodidad crónica que el programa puede ayudarte a cerrar.",
    }
  },

  // ─── AUTOCONOCIMIENTO · SCS-12 ───────────────────────────────────────────
  // Self-Compassion Scale (versión breve)
  // Neff, 2003 · Raes et al., 2011
  // Escala: 1 (casi nunca) → 5 (casi siempre)
  autoconocimiento: {
    id: "autoconocimiento",
    label: "Autoconocimiento",
    escala: "SCS-12",
    referencia: "Neff, 2003 · Raes et al., 2011",
    instruccion: "¿Con qué frecuencia te comportas de la manera descrita en cada situación?",
    tipo: "frecuencia",
    opciones: ["Casi nunca", "Raramente", "A veces", "Con frecuencia", "Casi siempre"],
    preguntas: [
      { id: "scs_1", texto: "Cuando fallo en algo importante para mí, me invaden sentimientos de inadecuación.", rev: true },
      { id: "scs_2", texto: "Trato de ser comprensivo y paciente con aquellos aspectos de mi personalidad que no me gustan.", rev: false },
      { id: "scs_3", texto: "Cuando algo me produce malestar emocional, tiendo a obsesionarme y fijarme en todo lo que está mal.", rev: true },
      { id: "scs_4", texto: "Cuando fracaso en algo importante, tiendo a ver las dificultades como parte de la condición humana.", rev: false },
      { id: "scs_5", texto: "Cuando atravieso un período muy difícil, me doy el cariño y ternura que necesito.", rev: false },
      { id: "scs_6", texto: "Cuando me siento incompetente en algo, trato de recordarme que la mayoría de las personas también sienten incompetencia a veces.", rev: false },
      { id: "scs_7", texto: "Cuando estoy triste y angustiado, tiendo a pensar que la mayoría de la gente es más feliz que yo.", rev: true },
      { id: "scs_8", texto: "Cuando fracaso en algo que para mí es importante, tiendo a sentirme solo en mi fracaso.", rev: true },
      { id: "scs_9", texto: "Cuando me siento deprimido, tiendo a pensar en todos mis fallos.", rev: true },
      { id: "scs_10", texto: "Intento ser comprensivo con los aspectos de mi personalidad que no me gustan.", rev: false },
      { id: "scs_11", texto: "Cuando algo me hace sufrir, intento mantener mis emociones en equilibrio.", rev: false },
      { id: "scs_12", texto: "Cuando fracaso en algo que para mí es importante, me juzgo y critico.", rev: true },
    ],
    scoring: "mixto",
    interpretacion: {
      alto: "Tienes un nivel sano de autocompasión. Te tratas con la misma amabilidad que le darías a alguien que quieres.",
      medio: "Tu autocompasión es moderada. Hay momentos de amabilidad contigo mismo, pero la autocrítica también aparece con frecuencia.",
      bajo: "La autocrítica domina sobre la autocompasión. Aprender a tratarte con más amabilidad es uno de los cambios más transformadores que puedes hacer.",
    }
  },

  // ─── AGENCIA · BSCS-13 ───────────────────────────────────────────────────
  // Brief Self-Control Scale
  // Tangney et al., 2004
  // Escala: 1 (nada como yo) → 5 (muy parecido a mí)
  agencia: {
    id: "agencia",
    label: "Agencia",
    escala: "BSCS-13",
    referencia: "Tangney et al., 2004",
    instruccion: "Usando la escala de 1 a 5, indica qué tan bien te describe cada afirmación.",
    tipo: "descripcion",
    opciones: ["Nada como yo", "Poco como yo", "Algo como yo", "Bastante como yo", "Muy parecido a mí"],
    preguntas: [
      { id: "bscs_1", texto: "Soy bueno para resistir las tentaciones.", rev: false },
      { id: "bscs_2", texto: "Me cuesta mantener ciertos hábitos.", rev: true },
      { id: "bscs_3", texto: "Soy perezoso.", rev: true },
      { id: "bscs_4", texto: "Digo cosas inapropiadas.", rev: true },
      { id: "bscs_5", texto: "Hago ciertas cosas que son malas para mí si son divertidas.", rev: true },
      { id: "bscs_6", texto: "Me niego a cosas que son malas para mí.", rev: false },
      { id: "bscs_7", texto: "Desearía tener más autodisciplina.", rev: true },
      { id: "bscs_8", texto: "La gente podría describirme como impulsivo.", rev: true },
      { id: "bscs_9", texto: "Gasto demasiado dinero.", rev: true },
      { id: "bscs_10", texto: "Me mantengo enfocado en mis metas.", rev: false },
      { id: "bscs_11", texto: "A veces no puedo evitar hacer algo aunque sé que está mal.", rev: true },
      { id: "bscs_12", texto: "Actúo sin pensar en las consecuencias.", rev: true },
      { id: "bscs_13", texto: "Me cuesta concentrarme.", rev: true },
    ],
    scoring: "mixto",
    interpretacion: {
      alto: "Tu capacidad de agencia y autocontrol es alta. Puedes traducir intenciones en acciones con consistencia.",
      medio: "Tu agencia es moderada. Puedes sostener compromisos en algunas áreas, pero en otras la impulsividad o el cansancio ganan.",
      bajo: "La brecha entre lo que quieres hacer y lo que terminas haciendo es grande. Fortalecer este músculo es esencial para sostener la recuperación.",
    }
  },
};

export const DIMENSION_ORDER = [
  "presencia",
  "claridad", 
  "regulacion",
  "valores",
  "autoconocimiento",
  "agencia",
];
