import {
  Coins,
  Cross,
  Flame,
  type LucideIcon,
  MapPin,
  ScrollText,
  Skull,
} from "lucide-react";

export interface Curiosidad {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

export const CURIOSIDADES: Curiosidad[] = [
  {
    id: "origen-jalisciense",
    title: "Origen jalisciense",
    body: "Muchas versiones sitúan su nacimiento en los caminos de Jalisco, donde los arrieros contaban de un jinete negro que aparecía al caer la noche y desaparecía sin dejar rastro.",
    icon: MapPin,
  },
  {
    id: "tesorero-del-diablo",
    title: "El tesorero del diablo",
    body: "Se le llama así porque custodia fortunas enterradas. Quien desentierra su oro sin permiso encuentra riqueza por un tiempo, pero paga el precio con la vida o la cordura.",
    icon: Coins,
  },
  {
    id: "ojos-de-fuego",
    title: "El caballo de ojos de fuego",
    body: "Su caballo es tan negro que se confunde con la noche, y sus ojos arden con un fuego frío. Los cascos no dejan huella y el galope suena como un tambor lejano.",
    icon: Flame,
  },
  {
    id: "cruces-y-capillas",
    title: "Cruces y capillas",
    body: "Para espantarlo, los pueblos levantaban cruces en las encrucijadas y capillas en los caminos. Se creía que el jinete no podía cruzar un lugar consagrado.",
    icon: Cross,
  },
  {
    id: "variantes-regionales",
    title: "Variantes regionales",
    body: "En Zacatecas es un castigo divino; en el Bajío, un rico condenado por avaro; en el norte, un pacto con el diablo. Cada región le dio su propio rostro y su propia advertencia.",
    icon: ScrollText,
  },
  {
    id: "vinculo-avaricia",
    title: "Su vínculo con la avaricia",
    body: "La leyenda funciona como advertencia moral: el Charro Negro castiga a quien ambiciona lo ajeno. Su oro es la trampa y la avaricia, el pecado que lo invoca.",
    icon: Skull,
  },
];
