export type HotspotId =
  | "sombrero"
  | "traje"
  | "botas"
  | "caballo"
  | "iphone"
  | "contrato";

export interface CharroDetail {
  id: HotspotId;
  label: string;
  title: string;
  tagline: string;
  description: string;
  facts: string[];
  /** Position of the hotspot in 3D space, relative to the model group. */
  position: [number, number, number];
}

export const CHARRO_DETAILS: CharroDetail[] = [
  {
    id: "sombrero",
    label: "Sombrero",
    title: "Sombrero de ala ancha",
    tagline: "La sombra que nunca deja ver el rostro",
    description:
      "Un sombrero de ala ancha con toquilla de plata y una cadena fina que cuelga del borde. Bajo su sombra no hay ojos: solo un vacío que devuelve la mirada de quien se atreve.",
    facts: [
      "Ala de más de 40 cm que oculta el rostro por completo",
      "Toquilla tejida con hilo de plata envejecida",
      "Cadena de eslabones finos que tintinea al caminar",
      "Nadie ha logrado describir su cara dos veces igual",
    ],
    position: [0, 2.35, 0],
  },
  {
    id: "traje",
    label: "Traje",
    title: "Traje con bordado LED",
    tagline: "La elegancia de un charro que ya no pertenece al mundo",
    description:
      "Traje de gala negro con botonadura de plata y un bordado que, en la oscuridad, se enciende con una luz fría. El filo del bordado dibuja grecas que parecen moverse solas.",
    facts: [
      "Chaquetilla corta con botonadura de plata mate",
      "Bordado con hilo luminoso que brilla en la penumbra",
      "Grecas inspiradas en los trajes de gala jaliscienses",
      "El bordado se apaga cuando alguien lo mira de frente",
    ],
    position: [0, 1.55, 0.12],
  },
  {
    id: "botas",
    label: "Botas",
    title: "Botas brillantes",
    tagline: "El paso que no deja huella",
    description:
      "Botas altas de piel negra pulida hasta reflejar la luna, con espuelas de plata que suenan antes de que aparezca. Se dice que su brillo es lo último que ven los viajeros.",
    facts: [
      "Piel pulida que refleja la luz de la luna",
      "Espuelas de plata con sonido inconfundible",
      "No dejan huella en la tierra ni en el polvo",
      "El tintineo se escucha a cientos de metros",
    ],
    position: [0.28, 0.55, 0.1],
  },
  {
    id: "caballo",
    label: "Caballo",
    title: "Caballo de ojos de fuego",
    tagline: "Negro como la noche, con rines de plata y humo",
    description:
      "Un caballo tan oscuro que se confunde con la noche. Sus ojos arden con un fuego frío y de sus cascos escapa un humo que no huele a nada. Los rines de plata brillan con cada galope.",
    facts: [
      "Pelaje negro absoluto, sin reflejos de color",
      "Ojos que arden con un fuego que no quema",
      "Rines de plata que destellan al galopar",
      "Humo frío que se desvanece sin dejar rastro",
    ],
    position: [-0.55, 1.35, 0.05],
  },
  {
    id: "iphone",
    label: "iPhone",
    title: "El iPhone del jinete",
    tagline: "La leyenda también tiene señal",
    description:
      "En la mano enguantada, un iPhone encendido. La pantalla muestra la hora exacta de la medianoche y una notificación que nadie ha podido leer completa. El Charro Negro, al parecer, también vive en la era digital.",
    facts: [
      "Pantalla siempre marcando las 00:00",
      "Notificación con remitente desconocido",
      "Funda de cuero negro con grabado de herradura",
      "Nunca se queda sin batería",
    ],
    position: [0.62, 1.7, 0.35],
  },
  {
    id: "contrato",
    label: "Contrato",
    title: "Contrato PDF",
    tagline: "El pacto que se firma sin leer la letra pequeña",
    description:
      "Un contrato enrollado, con sello de cera negra, que el jinete extiende a quien encuentra en el camino. Promete oro y riquezas a cambio de algo que nunca especifica con claridad.",
    facts: [
      "Sello de cera negra con la marca de una herradura",
      "Letra pequeña escrita con tinta que no se borra",
      "Promete oro a cambio de un precio no revelado",
      "Quien lo firma queda atado al jinete para siempre",
    ],
    position: [-0.35, 1.75, 0.3],
  },
];

export function getCharroDetail(id: HotspotId): CharroDetail | undefined {
  return CHARRO_DETAILS.find((detail) => detail.id === id);
}
