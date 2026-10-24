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
 * Characterization of the Leyenda Actualizada section's *structure* — the
 * live-chat rendering contract and the narration transcript derivation — which
 * must survive a change to the story text itself. Every expectation is derived
 * from the exported data, so replacing the story blocks keeps these valid while
 * still catching a broken renderer or transcript.
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

describe("Leyenda Actualizada story structure", () => {
  it("renders every story block under its kind-specific hook", () => {
    render(<LeyendaActualizadaSection />);

    const panel = screen.getByTestId("leyenda_actualizada.chat_panel");
    for (const block of STORY_BLOCKS) {
      const row = within(panel).getByTestId(
        `leyenda_actualizada.${block.kind}.${block.id}`,
      );
      expect(within(row).getByText(block.text)).toBeInTheDocument();
    }
  });

  it("keeps the live-chat header with its title, host and viewer count", () => {
    render(<LeyendaActualizadaSection />);

    const panel = screen.getByTestId("leyenda_actualizada.chat_panel");
    expect(within(panel).getByText(LIVE_TITLE)).toBeInTheDocument();
    expect(
      within(panel).getByText(new RegExp(LIVE_META.host)),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(new RegExp(LIVE_META.viewers)),
    ).toBeInTheDocument();
  });

  it("derives the narration transcript from the block kinds", () => {
    // Dialogue is attributed to its speaker; the bank notification is prefixed.
    for (const block of STORY_BLOCKS) {
      if (block.kind === "dialogue" && block.author) {
        expect(STORY_NARRATION_TEXT).toContain(
          `${block.author} dice: ${block.text}`,
        );
      } else if (block.kind === "notification") {
        // The transcript prefixes each notification with its author, e.g.
        // "Notificación de Banco Azteca: …"; the block text itself is verbatim.
        expect(STORY_NARRATION_TEXT).toContain(
          `Notificación de ${block.author}: ${block.text}`,
        );
      } else {
        expect(STORY_NARRATION_TEXT).toContain(block.text);
      }
    }
  });

  it("narrates the derived transcript, not the raw blocks", async () => {
    const user = userEvent.setup();
    render(<LeyendaActualizadaSection />);

    await user.click(
      screen.getByTestId("leyenda_actualizada.narration_button"),
    );

    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toBe(STORY_NARRATION_TEXT);
  });
});
