export interface LegendChapter {
  id: string;
  title: string;
  body: string;
}

export interface LegendMilestone {
  id: string;
  marker: string;
  title: string;
  body: string;
}

/**
 * The original legend, told in full. Each chapter is a paragraph of the
 * written narration and is also the unit read aloud by the narration button.
 */
export const LEYENDA_REAL: LegendChapter[] = [
  {
    id: "origen",
    title: "El charro humilde",
    body: "Cuenta la leyenda que en los caminos solitarios de México vivía un charro tan pobre que no tenía más que su caballo, su sombrero de ala ancha y las espuelas heredadas de su padre. Trabajaba de sol a sol cuidando ganado ajeno, y aun así nunca alcanzaba para comer. En las noches de luna nueva, cuando el viento silbaba entre los mezquites, se sentaba junto al camino y le pedía al cielo una sola cosa: dejar de ser pobre.",
  },
  {
    id: "invocacion",
    title: "La invocación al diablo",
    body: "Una madrugada, cansado de rogarle a un cielo que nunca le respondía, el charro hizo lo que los mayores prohibían. Se detuvo en una encrucijada, clavó su sombrero en la tierra y pronunció en voz alta el nombre que no debe pronunciarse. El aire se volvió frío, los grillos callaron y, entre la niebla, apareció un jinete vestido de negro montado en un caballo que no dejaba huellas. El diablo había escuchado su ruego.",
  },
  {
    id: "pacto",
    title: "El pacto por su alma",
    body: "El extraño le ofreció un trato sencillo: riquezas sin fin a cambio de su alma. El charro, hambriento y humillado, aceptó sin pensarlo dos veces. Firmó el pacto con una gota de su propia sangre sobre el filo de una navaja, y en ese instante sintió que algo dentro de él se apagaba para siempre. El diablo sonrió, le entregó una bolsa de monedas de oro y desapareció entre la niebla sin decir una palabra más.",
  },
  {
    id: "riqueza",
    title: "La riqueza repentina",
    body: "Desde esa noche, el charro humilde se volvió el hombre más rico de la región. Compró tierras, ganado y caballos; su casa creció hasta parecer un palacio, y ya nadie se atrevía a mirarlo mal. Pero la bolsa nunca se vaciaba, y eso empezó a inquietar a quienes lo conocían. El oro pesaba en sus bolsillos como pesaba en su conciencia, porque sabía muy bien de dónde venía.",
  },
  {
    id: "temor",
    title: "El temor del pueblo",
    body: "Pronto los vecinos notaron que el charro ya no dormía, que hablaba solo y que su sombra se movía distinto a la de los demás. Los perros le gruñían al pasar y los niños corrían a esconderse cuando lo veían llegar. Decían que había vendido su alma, y el miedo se extendió por los pueblos como un incendio. Nadie volvió a aceptar su oro, ni su mano, ni su saludo.",
  },
  {
    id: "huida",
    title: "La huida con el oro",
    body: "Cuando el plazo del pacto se cumplió, el charro huyó a caballo con la bolsa de monedas de oro apretada contra el pecho. Cabalgó toda la noche, cruzó ríos y veredas, convencido de que podría escapar del trato. Pero el diablo no persigue a los que corren: espera. En la primera encrucijada del camino, el jinete negro ya estaba allí, con la mano extendida y una paciencia infinita.",
  },
  {
    id: "condena",
    title: "La condena eterna",
    body: "El diablo cobró su deuda y condenó al charro a vagar por los caminos para siempre, cobrando las deudas ajenas. Desde entonces aparece de madrugada, vestido de negro y con el rostro oculto bajo el sombrero, ofreciendo oro a los viajeros que andan solos. Quien acepta su fortuna queda atado a él, y quien lo mira de frente queda marcado por el miedo. Así paga el Charro Negro una deuda que nunca terminará de saldar.",
  },
];

/**
 * The milestones of the original legend, rendered as a vertical timeline.
 */
export const LEYENDA_TIMELINE: LegendMilestone[] = [
  {
    id: "origen",
    marker: "I",
    title: "Origen humilde",
    body: "Un charro pobre, sin más herencia que su caballo y sus espuelas, ruega por dejar de ser pobre.",
  },
  {
    id: "pacto",
    marker: "II",
    title: "El pacto",
    body: "En una encrucijada invoca al diablo y firma con su sangre: riquezas sin fin a cambio de su alma.",
  },
  {
    id: "riqueza",
    marker: "III",
    title: "La riqueza",
    body: "Se vuelve el hombre más rico de la región, pero la bolsa de oro nunca deja de pesar en su conciencia.",
  },
  {
    id: "temor",
    marker: "IV",
    title: "El temor",
    body: "El pueblo descubre la verdad: los perros le gruñen, los niños huyen y nadie acepta su oro.",
  },
  {
    id: "huida",
    marker: "V",
    title: "La huida",
    body: "Al cumplirse el plazo, huye a caballo con la bolsa de monedas, creyendo que puede escapar del trato.",
  },
  {
    id: "condena",
    marker: "VI",
    title: "La condena",
    body: "El diablo lo alcanza y lo condena a vagar por los caminos cobrando las deudas ajenas.",
  },
];

/** Full narration text, assembled from the chapters in reading order. */
export const LEYENDA_NARRATION: string = LEYENDA_REAL.map(
  (chapter) => `${chapter.title}. ${chapter.body}`,
).join(" ");
