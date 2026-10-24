import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LeyendaActualizadaSection } from "@/components/LeyendaActualizadaSection";
import {
  LIVE_META,
  LIVE_TITLE,
  STORY_BLOCKS,
  STORY_NARRATION_TEXT,
} from "@/lib/leyenda-actualizada";

/**
 * Regression guard for the accepted 2026 Gen-Z/TikTok rewrite of the Kevin
 * story. The sibling `leyenda-actualizada.test.tsx` derives its expectations
 * from `STORY_BLOCKS`, so it stays green across a text swap; this file pins the
 * accepted text itself, so a revert to the previous version fails here.
 *
 * The expected blocks are transcribed from the accepted requirement and are
 * intentionally literal — do not derive them from the module under test.
 */

interface ExpectedBlock {
  id: string;
  kind: "narration" | "dialogue" | "comment" | "notification";
  author?: string;
  handle?: string;
  text: string;
}

const EXPECTED_BLOCKS: ExpectedBlock[] = [
  {
    id: "b1",
    kind: "narration",
    text: "Pov: eres Kevin, 19 años, de Juárez. Sales de la maquila, son las 2:13 AM, tu Italika ya no prende, se te acabó la pila, no traes saldo y el Uber está en $380 tarifa dinámica.",
  },
  {
    id: "b2",
    kind: "dialogue",
    author: "Kevin",
    text: "Banda me quedé tirado en el desierto de Samalayuca, like para que no me secuestren fr",
  },
  {
    id: "b3",
    kind: "comment",
    author: "Live",
    handle: "@tiktok.live",
    text: "0 viewers.",
  },
  {
    id: "b4",
    kind: "narration",
    text: "De la nada suena: clip clop clip clop pero en HD, con autotune.",
  },
  {
    id: "b5",
    kind: "narration",
    text: "Volteas y literal:",
  },
  {
    id: "b6",
    kind: "narration",
    text: "Un vato en caballo negro, pero drip total. Traje de charro negro con bordado LED, sombrero con cadena, botas de esas que brillan. El caballo trae rines y echa humo como si fuera moto tuneada. El charro saca su iPhone 17 Pro Max.",
  },
  {
    id: "b7",
    kind: "dialogue",
    author: "Charro Negro",
    text: "Wenas noches mi Kevin, ¿cómo andamos?",
  },
  {
    id: "b8",
    kind: "dialogue",
    author: "Kevin",
    text: "ALV ¿cómo sabes mi nombre?",
  },
  {
    id: "b9",
    kind: "dialogue",
    author: "Charro Negro",
    text: "Bro, te vi en TikTok. También vi que debes 40k al Coppel, que tu ex te dejó en visto y que vendes fotos de pies en marketplace para la renta. Te traigo un deal.",
  },
  {
    id: "b10",
    kind: "narration",
    text: "Te enseña la pantalla: una wallet con 2.5 millones en Bitcoin.",
  },
  {
    id: "b11",
    kind: "dialogue",
    author: "Charro Negro",
    text: "Mira papito. Te doy todo esto. Te vuelves viral, te compras troca, tu ex te ruega. Nomás fírmame acá. Cuando te mueras me sigues en el más allá. Forever. Es como un follow x follow, pero eterno. ¿Jalas?",
  },
  {
    id: "b12",
    kind: "narration",
    text: "Y te pone un contrato en PDF, ya firmado con sangre digital.",
  },
  {
    id: "b13",
    kind: "narration",
    text: "Tú ya ibas a darle aceptar, porque seamos honestos, ¿quién no? 2.5M pa salir de Electra.",
  },
  {
    id: "b14",
    kind: "narration",
    text: 'Pero te acuerdas del consejo de tu abuela que viste en un TikTok de @leyendas.mexicanas: "Si ves al Charro Negro no le aceptes nada, y si te quiere fondear, mándaselo a alguien que no te deba nada, así se bugea".',
  },
  {
    id: "b15",
    kind: "dialogue",
    author: "Kevin",
    text: "No mames we, no lo quiero. Dónaselo a @DonaLupedeBachimba. Esa morra ni me sigue, ni me debe nada. Ella hace tortillas en TikTok.",
  },
  {
    id: "b16",
    kind: "narration",
    text: "El charro se traba. Como si le hubiera dado lag.",
  },
  {
    id: "b17",
    kind: "dialogue",
    author: "Charro Negro",
    text: "¿QUÉ? BRO ESA NO ES LA DINÁMICA, NO PUEDES HACER ESO, NO ESTÁ EN LOS TÉRMINOS Y CONDICIONES",
  },
  {
    id: "b18",
    kind: "narration",
    text: "empieza a gritar, pero con voz distorsionada como audio de WhatsApp en x2.",
  },
  {
    id: "b19",
    kind: "narration",
    text: "El caballo se empieza a glitchear, a tirar pantallazo azul.",
  },
  {
    id: "b20",
    kind: "dialogue",
    author: "Charro Negro",
    text: "¡ME CANCELASTE! ¡ME FUNASTE!",
  },
  {
    id: "b21",
    kind: "narration",
    text: "grita y la tierra se abre como portal del Minecraft. Literal se lo traga un bug del sistema. Huele a cargador quemado.",
  },
  {
    id: "b22",
    kind: "narration",
    text: "Tu Italika prende de la nada. El live sube a 12k viewers. Todos en comentarios:",
  },
  {
    id: "b23",
    kind: "comment",
    author: "Viewer",
    handle: "@viewer_1",
    text: "ALV EL CHARRO TE QUERÍA ESTAFAR CON UNA PIRÁMIDE",
  },
  {
    id: "b24",
    kind: "comment",
    author: "Viewer",
    handle: "@viewer_2",
    text: "es la versión norteña de los sugar daddy",
  },
  {
    id: "b25",
    kind: "narration",
    text: "Llegas a tu casa. Tu cel vibra. Te llegó una notificación del Banco Azteca:",
  },
  {
    id: "b26",
    kind: "notification",
    author: "Banco Azteca",
    text: "Depósito: $4,000. Remitente: Doña Lupe (QEPD)",
  },
  {
    id: "b27",
    kind: "notification",
    author: "Instagram",
    text: "mi abuela murió hace 3 días pero me dijo que si veía a un morro tirado en el desierto le mandara esto. Dijo que soñó con un caballo",
  },
  {
    id: "b28",
    kind: "narration",
    text: "Kevin borra el live. Lo sube como historia y pone:",
  },
  {
    id: "b29",
    kind: "dialogue",
    author: "Kevin",
    text: "al chile no acepten dinero fácil, raza. El charro negro ya está en LinkedIn buscando gente",
  },
];

/** Distinctive phrases from the previous story version that must be gone. */
const PREVIOUS_VERSION_LEFTOVERS = [
  "El charro humilde",
  "se apareció en el camino real",
  "alma en pena",
];

interface FakeSynth {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  getVoices: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  speaking: boolean;
  paused: boolean;
}

let synth: FakeSynth;
let spoken: string[];

beforeEach(() => {
  spoken = [];
  synth = {
    speak: vi.fn((utterance: SpeechSynthesisUtterance) => {
      spoken.push(utterance.text);
      synth.speaking = true;
    }),
    cancel: vi.fn(() => {
      synth.speaking = false;
      synth.paused = false;
    }),
    pause: vi.fn(() => {
      synth.paused = true;
    }),
    resume: vi.fn(() => {
      synth.paused = false;
    }),
    getVoices: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    speaking: false,
    paused: false,
  };
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: synth,
  });
  class FakeUtterance {
    text: string;
    lang = "";
    rate = 1;
    pitch = 1;
    volume = 1;
    voice: SpeechSynthesisVoice | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: FakeUtterance,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Leyenda Actualizada 2026 story text", () => {
  it("reproduces the accepted 2026 story blocks exactly, in order", () => {
    expect(STORY_BLOCKS).toHaveLength(EXPECTED_BLOCKS.length);
    EXPECTED_BLOCKS.forEach((expected, index) => {
      const actual = STORY_BLOCKS[index];
      expect(actual.id).toBe(expected.id);
      expect(actual.kind).toBe(expected.kind);
      expect(actual.author).toBe(expected.author);
      expect(actual.handle).toBe(expected.handle);
      expect(actual.text).toBe(expected.text);
    });
  });

  it("keeps no leftover text from the previous story version", () => {
    const corpus = [
      LIVE_TITLE,
      LIVE_META.host,
      LIVE_META.location,
      ...STORY_BLOCKS.map((block) => block.text),
      STORY_NARRATION_TEXT,
    ].join("\n");

    for (const leftover of PREVIOUS_VERSION_LEFTOVERS) {
      expect(corpus).not.toContain(leftover);
    }
  });

  it("renders the accepted 2026 text in the live-chat panel", () => {
    render(<LeyendaActualizadaSection />);

    const panel = screen.getByTestId("leyenda_actualizada.chat_panel");
    for (const block of EXPECTED_BLOCKS) {
      const row = within(panel).getByTestId(
        `leyenda_actualizada.${block.kind}.${block.id}`,
      );
      expect(within(row).getByText(block.text)).toBeInTheDocument();
    }
  });

  it("narrates the accepted 2026 transcript when the button is pressed", async () => {
    const user = userEvent.setup();
    render(<LeyendaActualizadaSection />);

    await user.click(
      screen.getByTestId("leyenda_actualizada.narration_button"),
    );

    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toBe(STORY_NARRATION_TEXT);
    // The transcript carries the new story, not the old one.
    expect(spoken[0]).toContain("Pov: eres Kevin, 19 años, de Juárez.");
    expect(spoken[0]).toContain("Charro Negro dice: Wenas noches mi Kevin");
  });
});
