import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LeyendaActualizadaSection } from "@/components/LeyendaActualizadaSection";
import { LeyendaRealSection } from "@/components/LeyendaRealSection";

/**
 * Narration controls for both legends. jsdom has no Web Speech API, so a local
 * fake `speechSynthesis` records the calls the components make; the assertions
 * are on the observable button state and the spoken text, not on the mock.
 */
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
  // The components construct `new SpeechSynthesisUtterance(text)`.
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

describe("Leyenda Real narration", () => {
  it("plays, pauses and stops the original legend aloud", async () => {
    const user = userEvent.setup();
    render(<LeyendaRealSection />);

    const toggle = screen.getByTestId("leyenda_real.narration.toggle_button");
    expect(toggle).toHaveTextContent("Escuchar esta historia");

    await user.click(toggle);
    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toContain("El charro humilde");
    expect(toggle).toHaveTextContent("Pausar narración");

    await user.click(toggle);
    expect(synth.pause).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveTextContent("Reanudar narración");

    await user.click(screen.getByTestId("leyenda_real.narration.stop_button"));
    expect(synth.cancel).toHaveBeenCalled();
    expect(toggle).toHaveTextContent("Escuchar esta historia");
  });
});

describe("Leyenda Actualizada narration", () => {
  it("narrates the Kevin story with its own control and stops on demand", async () => {
    const user = userEvent.setup();
    render(<LeyendaActualizadaSection />);

    const play = screen.getByTestId("leyenda_actualizada.narration_button");
    expect(play).toHaveTextContent("Escuchar esta historia");

    await user.click(play);
    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toContain("Kevin");
    expect(play).toHaveTextContent("Pausar");

    await user.click(screen.getByTestId("leyenda_actualizada.stop_button"));
    expect(synth.cancel).toHaveBeenCalled();
    expect(play).toHaveTextContent("Escuchar esta historia");
  });
});
