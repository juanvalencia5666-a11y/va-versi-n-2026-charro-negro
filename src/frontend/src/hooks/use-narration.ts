import { useCallback, useEffect, useRef, useState } from "react";

export type NarrationStatus = "idle" | "playing" | "paused";

/** Which audio source a narration is currently using. */
export type NarrationSource = "recording" | "voice";

interface UseNarrationOptions {
  /** Text read aloud when no recording is available. */
  text: string;
  /**
   * Blob URL of the visitor's uploaded recording. When present, narration
   * plays this audio instead of the synthesized voice.
   */
  recordingUrl?: string | null;
  /** BCP-47 language tag used to select a matching voice. */
  lang?: string;
  /** Preferred voice names, in priority order, matched case-insensitively. */
  preferredVoices?: string[];
  /** Speech rate for the synthesized voice. */
  rate?: number;
  /** Speech pitch for the synthesized voice. */
  pitch?: number;
}

interface UseNarrationResult {
  status: NarrationStatus;
  supported: boolean;
  /** Active audio source: the uploaded recording or the synthesized voice. */
  source: NarrationSource;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
}

const DEEP_MALE_HINTS = [
  "jorge",
  "diego",
  "carlos",
  "juan",
  "pablo",
  "miguel",
  "enrique",
  "male",
  "hombre",
  "masculin",
];

function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: string,
  preferred: string[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const base = lang.split("-")[0].toLowerCase();
  const sameLanguage = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(base),
  );
  const pool = sameLanguage.length > 0 ? sameLanguage : voices;

  for (const name of preferred) {
    const match = pool.find(
      (voice) => voice.name.toLowerCase() === name.toLowerCase(),
    );
    if (match) return match;
  }

  const hinted = pool.find((voice) =>
    DEEP_MALE_HINTS.some((hint) => voice.name.toLowerCase().includes(hint)),
  );
  if (hinted) return hinted;

  return pool[0] ?? null;
}

/**
 * Module-level registry so only one narration plays at a time: starting a
 * narration stops whichever other narration is currently active.
 */
let activeStop: (() => void) | null = null;

function claimPlayback(stop: () => void) {
  if (activeStop && activeStop !== stop) activeStop();
  activeStop = stop;
}

function releasePlayback(stop: () => void) {
  if (activeStop === stop) activeStop = null;
}

/**
 * Narrates a story aloud, exposing play / pause / stop. When the visitor has
 * uploaded a recording, that audio is played; otherwise the text is read with
 * the Web Speech API. Voices load asynchronously, so the hook waits for
 * `voiceschanged` before resolving a voice. Playback is cancelled on unmount.
 */
export function useNarration({
  text,
  recordingUrl = null,
  lang = "es-MX",
  preferredVoices = [],
  rate = 0.92,
  pitch = 0.7,
}: UseNarrationOptions): UseNarrationResult {
  const [status, setStatus] = useState<NarrationStatus>("idle");
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasRecording = Boolean(recordingUrl);
  const source: NarrationSource = hasRecording ? "recording" : "voice";

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const synth = window.speechSynthesis;

    const resolveVoice = () => {
      voiceRef.current = pickVoice(synth.getVoices(), lang, preferredVoices);
    };

    resolveVoice();
    synth.addEventListener("voiceschanged", resolveVoice);
    return () => synth.removeEventListener("voiceschanged", resolveVoice);
  }, [lang, preferredVoices]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    }

    releasePlayback(stop);
    setStatus("idle");
  }, []);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;

    // Uploaded recording takes priority over the synthesized voice.
    if (recordingUrl) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;

      let audio = audioRef.current;
      if (!audio || audio.src !== recordingUrl) {
        audio = new Audio(recordingUrl);
        audio.preload = "auto";
        audio.onended = () => {
          audioRef.current = null;
          releasePlayback(stop);
          setStatus("idle");
        };
        audio.onerror = () => {
          audioRef.current = null;
          releasePlayback(stop);
          setStatus("idle");
        };
        audioRef.current = audio;
      }

      claimPlayback(stop);
      void audio.play();
      setStatus("playing");
      return;
    }

    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (synth.paused && utteranceRef.current) {
      synth.resume();
      setStatus("playing");
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    if (voiceRef.current) utterance.voice = voiceRef.current;

    utterance.onend = () => {
      utteranceRef.current = null;
      releasePlayback(stop);
      setStatus("idle");
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      releasePlayback(stop);
      setStatus("idle");
    };

    utteranceRef.current = utterance;
    claimPlayback(stop);
    synth.speak(utterance);
    setStatus("playing");
  }, [lang, pitch, rate, recordingUrl, stop, text]);

  const pause = useCallback(() => {
    if (recordingUrl) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setStatus("paused");
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [recordingUrl]);

  const toggle = useCallback(() => {
    if (status === "playing") {
      pause();
    } else {
      play();
    }
  }, [pause, play, status]);

  // Stop playback when the active recording changes (uploaded or cleared).
  const previousRecordingUrl = useRef(recordingUrl);
  useEffect(() => {
    if (previousRecordingUrl.current === recordingUrl) return;
    previousRecordingUrl.current = recordingUrl;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audioRef.current = null;
    }
    releasePlayback(stop);
    setStatus("idle");
  }, [recordingUrl, stop]);

  // Cancel playback when the component unmounts.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audioRef.current = null;
      }
      releasePlayback(stop);
    };
  }, [stop]);

  return { status, supported, source, play, pause, stop, toggle };
}
