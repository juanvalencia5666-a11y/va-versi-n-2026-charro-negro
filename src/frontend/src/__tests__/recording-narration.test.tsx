import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RecordingView } from "@/backend";
import { LeyendaActualizadaSection } from "@/components/LeyendaActualizadaSection";
import { LeyendaRealSection } from "@/components/LeyendaRealSection";

/**
 * Cover for the recording-aware narration: once the visitor has uploaded a
 * recording, both legend narration buttons play that audio instead of the
 * synthesized voice, expose play / pause / resume / stop with a visible state,
 * and only one narration sounds at a time. The platform actor is a local typed
 * mock and `Audio` is a local fake, so this proves the component's behavior —
 * not that the real canister or browser audio pipeline works.
 */

const RECORDING_URL = "blob:stored-recording";

const getRecording = vi.fn<() => Promise<RecordingView | null>>();

const mockActor = {
  getRecording,
  uploadRecording: vi.fn(),
  clearRecording: vi.fn(),
};

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: mockActor, isFetching: false }),
  useInternetIdentity: () => ({
    isAuthenticated: true,
    login: vi.fn(),
    isLoggingIn: false,
  }),
}));

function makeRecordingView(): RecordingView {
  return {
    blob: {
      getDirectURL: () => RECORDING_URL,
    } as unknown as RecordingView["blob"],
    filename: "mi-voz.mp3",
    mimeType: "audio/mpeg",
    uploadedAt: 1_700_000_000_000_000_000n,
  };
}

interface FakeAudioElement {
  src: string;
  preload: string;
  currentTime: number;
  onended: (() => void) | null;
  onerror: (() => void) | null;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
}

let audioInstances: FakeAudioElement[];
let synth: {
  speak: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  getVoices: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  speaking: boolean;
  paused: boolean;
};

function renderWithProviders(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

beforeEach(() => {
  audioInstances = [];
  getRecording.mockReset();
  getRecording.mockResolvedValue(makeRecordingView());

  synth = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
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

  class FakeAudio implements FakeAudioElement {
    src: string;
    preload = "";
    currentTime = 0;
    onended: (() => void) | null = null;
    onerror: (() => void) | null = null;
    play = vi.fn(() => Promise.resolve());
    pause = vi.fn();
    constructor(src = "") {
      this.src = src;
      audioInstances.push(this);
    }
  }
  Object.defineProperty(window, "Audio", {
    configurable: true,
    value: FakeAudio,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("recording-aware narration", () => {
  it("plays the uploaded recording for Leyenda Real instead of the synthesized voice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LeyendaRealSection />);

    const toggle = await screen.findByTestId(
      "leyenda_real.narration.toggle_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_real.narration.status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(toggle);

    await waitFor(() => expect(audioInstances).toHaveLength(1));
    expect(audioInstances[0].src).toBe(RECORDING_URL);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
    // The synthesized voice must not be used while a recording exists.
    expect(synth.speak).not.toHaveBeenCalled();
    expect(toggle).toHaveTextContent("Pausar narración");
    expect(
      screen.getByTestId("leyenda_real.narration.status"),
    ).toHaveTextContent("Narrando · Tu grabación");
  });

  it("plays the uploaded recording for Leyenda Actualizada instead of the synthesized voice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LeyendaActualizadaSection />);

    const play = await screen.findByTestId(
      "leyenda_actualizada.narration_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_actualizada.narration_status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(play);

    await waitFor(() => expect(audioInstances).toHaveLength(1));
    expect(audioInstances[0].src).toBe(RECORDING_URL);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
    expect(synth.speak).not.toHaveBeenCalled();
    expect(play).toHaveTextContent("Pausar");
    expect(
      screen.getByTestId("leyenda_actualizada.narration_status"),
    ).toHaveTextContent("Reproduciendo · Tu grabación");
  });

  it("pauses, resumes and stops the recording with a visible state", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LeyendaRealSection />);

    const toggle = await screen.findByTestId(
      "leyenda_real.narration.toggle_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_real.narration.status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(toggle);
    await waitFor(() => expect(audioInstances).toHaveLength(1));
    const audio = audioInstances[0];

    // Pause.
    await user.click(toggle);
    expect(audio.pause).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveTextContent("Reanudar narración");
    expect(
      screen.getByTestId("leyenda_real.narration.status"),
    ).toHaveTextContent("En pausa · Tu grabación");

    // Resume: the same audio element plays again, not a new one.
    await user.click(toggle);
    expect(audio.play).toHaveBeenCalledTimes(2);
    expect(audioInstances).toHaveLength(1);
    expect(toggle).toHaveTextContent("Pausar narración");

    // Stop.
    await user.click(screen.getByTestId("leyenda_real.narration.stop_button"));
    expect(audio.pause).toHaveBeenCalledTimes(2);
    expect(toggle).toHaveTextContent("Escuchar esta historia");
    expect(
      screen.getByTestId("leyenda_real.narration.status"),
    ).toHaveTextContent("Tu grabación");
  });

  it("stops the other section's recording when one starts", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <LeyendaRealSection />
        <LeyendaActualizadaSection />
      </>,
    );

    const realToggle = await screen.findByTestId(
      "leyenda_real.narration.toggle_button",
    );
    const updatedPlay = await screen.findByTestId(
      "leyenda_actualizada.narration_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_real.narration.status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(realToggle);
    await waitFor(() => expect(audioInstances).toHaveLength(1));
    const firstAudio = audioInstances[0];

    await user.click(updatedPlay);
    await waitFor(() => expect(audioInstances).toHaveLength(2));

    // Starting the second narration stops the first.
    expect(firstAudio.pause).toHaveBeenCalled();
    expect(audioInstances[1].play).toHaveBeenCalledTimes(1);
    expect(realToggle).toHaveTextContent("Escuchar esta historia");
    expect(updatedPlay).toHaveTextContent("Pausar");
  });

  it("stops the recording when the section leaves the viewport", async () => {
    // Capture the section's IntersectionObserver so the test can drive the
    // "left the viewport" callback the component registers.
    const observers: Array<(entries: IntersectionObserverEntry[]) => void> = [];
    class ControllableObserver {
      constructor(callback: IntersectionObserverCallback) {
        observers.push(
          callback as (entries: IntersectionObserverEntry[]) => void,
        );
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: ControllableObserver,
    });

    const user = userEvent.setup();
    renderWithProviders(<LeyendaRealSection />);

    const toggle = await screen.findByTestId(
      "leyenda_real.narration.toggle_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_real.narration.status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(toggle);
    await waitFor(() => expect(audioInstances).toHaveLength(1));
    const audio = audioInstances[0];

    // Simulate the section scrolling out of view.
    for (const callback of observers) {
      callback([
        {
          isIntersecting: false,
          target: document.body,
        } as unknown as IntersectionObserverEntry,
      ]);
    }

    await waitFor(() => expect(audio.pause).toHaveBeenCalled());
    expect(toggle).toHaveTextContent("Escuchar esta historia");
    expect(
      screen.getByTestId("leyenda_real.narration.status"),
    ).toHaveTextContent("Tu grabación");
  });

  it("returns to idle when the recording finishes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LeyendaRealSection />);

    const toggle = await screen.findByTestId(
      "leyenda_real.narration.toggle_button",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("leyenda_real.narration.status"),
      ).toHaveTextContent("Tu grabación"),
    );

    await user.click(toggle);
    await waitFor(() => expect(audioInstances).toHaveLength(1));

    audioInstances[0].onended?.();

    await waitFor(() =>
      expect(toggle).toHaveTextContent("Escuchar esta historia"),
    );
  });
});
