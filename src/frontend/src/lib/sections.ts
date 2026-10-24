export interface SectionMeta {
  id: string;
  index: string;
  label: string;
  navLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "leyenda-real",
    index: "01",
    label: "Leyenda Real",
    navLabel: "Leyenda Real",
  },
  {
    id: "leyenda-actualizada",
    index: "02",
    label: "Leyenda Actualizada",
    navLabel: "Leyenda Actualizada",
  },
  {
    id: "curiosidades",
    index: "03",
    label: "Curiosidades",
    navLabel: "Curiosidades",
  },
];

export const HERO_ID = "portada";

export const NAV_ITEMS = [
  { id: HERO_ID, label: "El Mito" },
  ...SECTIONS.map((section) => ({ id: section.id, label: section.navLabel })),
];

export const TIMELINE = [
  {
    year: "1890",
    note: "Primeros relatos orales en los caminos de Zacatecas.",
  },
  {
    year: "1910",
    note: "La Revolución dispersa las versiones por todo el país.",
  },
  {
    year: "1925",
    note: "Aparece en los corridos y en la prensa de la capital.",
  },
  { year: "1940", note: "El cine de oro lo fija como jinete de medianoche." },
  {
    year: "1960",
    note: "Se vuelve advertencia para quienes andan de madrugada.",
  },
  { year: "1980", note: "La televisión rural lo reinventa en cada región." },
  { year: "2000", note: "Foros y blogs recopilan testimonios de todo México." },
  { year: "HOY", note: "Sigue cabalgando en la memoria colectiva." },
];
