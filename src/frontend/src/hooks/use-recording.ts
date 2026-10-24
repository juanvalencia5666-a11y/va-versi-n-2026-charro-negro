import { type RecordingView, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { ExternalBlob } from "@caffeineai/object-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Accepted audio MIME types for the visitor's own narration recording. */
export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/ogg",
  "audio/vorbis",
] as const;

/** Maximum accepted upload size, in bytes (25 MB). */
export const MAX_RECORDING_BYTES = 25 * 1024 * 1024;

const RECORDING_QUERY_KEY = ["recording"] as const;

export interface RecordingInfo {
  filename: string;
  mimeType: string;
  uploadedAt: Date | null;
  /** Direct URL the narration audio element plays. */
  url: string;
}

function toRecordingInfo(view: RecordingView): RecordingInfo {
  const uploadedAt = new Date(Number(view.uploadedAt / 1_000_000n));
  return {
    filename: view.filename,
    mimeType: view.mimeType,
    uploadedAt: Number.isNaN(uploadedAt.getTime()) ? null : uploadedAt,
    url: view.blob.getDirectURL(),
  };
}

/**
 * Reads the visitor's stored narration recording. Returns `null` when nothing
 * has been uploaded yet, so callers can fall back to the synthesized voice.
 */
export function useRecording() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: RECORDING_QUERY_KEY,
    queryFn: async (): Promise<RecordingInfo | null> => {
      if (!actor) return null;
      const view = await actor.getRecording();
      return view ? toRecordingInfo(view) : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export interface UploadRecordingInput {
  file: File;
  onProgress?: (percentage: number) => void;
}

/**
 * Stores the visitor's uploaded recording, replacing any previous one. The
 * upload reports progress through the object-storage client.
 */
export function useUploadRecording() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: UploadRecordingInput): Promise<RecordingInfo> => {
      if (!actor) throw new Error("El backend aún no está listo.");
      const bytes = new Uint8Array(await file.arrayBuffer());
      let blob = ExternalBlob.fromBytes(
        bytes,
        file.type || "audio/mpeg",
        file.name,
      );
      if (onProgress) blob = blob.withUploadProgress(onProgress);
      const view = await actor.uploadRecording(
        blob,
        file.name,
        file.type || "audio/mpeg",
      );
      return toRecordingInfo(view);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RECORDING_QUERY_KEY });
    },
  });
}

/** Removes the stored recording so narration falls back to the browser voice. */
export function useClearRecording() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error("El backend aún no está listo.");
      await actor.clearRecording();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RECORDING_QUERY_KEY });
    },
  });
}

/** Validates a candidate file, returning a Spanish error message or `null`. */
export function validateRecordingFile(file: File): string | null {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const hasAudioExtension = /\.(m4a|mp3|wav|ogg|oga|mp4)$/.test(name);
  const isAudio =
    type.startsWith("audio/") ||
    (ACCEPTED_AUDIO_TYPES as readonly string[]).includes(type) ||
    (type === "" && hasAudioExtension);

  if (!isAudio) {
    return "El archivo debe ser de audio (m4a, mp3, wav u ogg).";
  }
  if (file.size > MAX_RECORDING_BYTES) {
    return "El archivo supera el límite de 25 MB.";
  }
  return null;
}

/** Reads an audio file's duration in seconds, or `null` when unavailable. */
export function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const cleanup = () => URL.revokeObjectURL(url);
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : null;
      cleanup();
      resolve(duration);
    };
    audio.onerror = () => {
      cleanup();
      resolve(null);
    };
    audio.src = url;
  });
}

/** Formats a duration in seconds as `m:ss`. */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "—";
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
