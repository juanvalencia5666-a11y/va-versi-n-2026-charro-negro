import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LeyendaActualizadaSection } from "@/components/LeyendaActualizadaSection";
import { LeyendaRealSection } from "@/components/LeyendaRealSection";
import { STORY_NARRATION_TEXT } from "@/lib/leyenda-actualizada";
import { LEYENDA_NARRATION } from "@/lib/leyenda-real";

/**
 * Characterization of the synthesized-voice fallback that must survive the
 * addition of an uploaded recording. When no recording exists, both narration
 * buttons still speak the story through the Web Speech API, read verbatim from
 * the written text, and the two sections never narrate at the same time.
 *
 * jsdom has no Web Speech API, so a local fake `speechSynthesis` records the
 * calls the components make; assertions are on the observable button state and
 * the spoken text, never on the mock itself.
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

describe("synthesized narration fallback", () => {
  it("reads the Leyenda Real text verbatim when no recording exists", async () => {
    const user = userEvent.setup();
    render(<LeyendaRealSection />);

    await user.click(
      screen.getByTestId("leyenda_real.narration.toggle_button"),
    );

    expect(spoken).toHaveLength(1);
    // The whole written legend, unaltered, is what gets spoken.
    expect(spoken[0]).toBe(LEYENDA_NARRATION);
  });

  it("reads the Leyenda Actualizada text verbatim when no recording exists", async () => {
    const user = userEvent.setup();
    render(<LeyendaActualizadaSection />);

    await user.click(
      screen.getByTestId("leyenda_actualizada.narration_button"),
    );

    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toBe(STORY_NARRATION_TEXT);
  });

  it("resumes the Leyenda Real narration after pausing", async () => {
    const user = userEvent.setup();
    render(<LeyendaRealSection />);

    const toggle = screen.getByTestId("leyenda_real.narration.toggle_button");
    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).toHaveTextContent("Reanudar narración");

    await user.click(toggle);
    expect(synth.resume).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveTextContent("Pausar narración");
    // Resuming continues the same utterance rather than starting a new one.
    expect(spoken).toHaveLength(1);
  });

  it("resumes the Leyenda Actualizada narration after pausing", async () => {
    const user = userEvent.setup();
    render(<LeyendaActualizadaSection />);

    const play = screen.getByTestId("leyenda_actualizada.narration_button");
    await user.click(play);
    await user.click(play);
    expect(play).toHaveTextContent("Reanudar");

    await user.click(play);
    expect(synth.resume).toHaveBeenCalledTimes(1);
    expect(play).toHaveTextContent("Pausar");
    expect(spoken).toHaveLength(1);
  });

  it("cancels the other section's narration when one starts", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LeyendaRealSection />
        <LeyendaActualizadaSection />
      </>,
    );

    // Start the original legend, then start the updated one: the second start
    // must cancel the first so only one story is ever narrated at a time.
    await user.click(
      screen.getByTestId("leyenda_real.narration.toggle_button"),
    );
    expect(spoken).toHaveLength(1);

    await user.click(
      screen.getByTestId("leyenda_actualizada.narration_button"),
    );
    expect(synth.cancel).toHaveBeenCalled();
    expect(spoken).toHaveLength(2);
    expect(spoken[1]).toBe(STORY_NARRATION_TEXT);
  });
});
