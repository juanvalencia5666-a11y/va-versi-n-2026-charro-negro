import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  formatDuration,
  readAudioDuration,
  useClearRecording,
  useRecording,
  useUploadRecording,
  validateRecordingFile,
} from "@/hooks/use-recording";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  Trash2,
  Upload,
  Waves,
} from "lucide-react";
import { useCallback, useId, useState } from "react";

interface UploadedMeta {
  filename: string;
  duration: number | null;
}

/**
 * Section 02·Voz — lets the visitor upload their own narration recording.
 * The recording is stored through the platform file storage, persists across
 * visits, and becomes the active narration voice for both legends.
 */
export function RecordingUpload() {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<UploadedMeta | null>(null);

  const { isAuthenticated, login, isLoggingIn } = useInternetIdentity();
  const { data: recording, isLoading } = useRecording();
  const upload = useUploadRecording();
  const clear = useClearRecording();

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setConfirmed(null);

      const validationError = validateRecordingFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const duration = await readAudioDuration(file);
      setProgress(0);
      upload.mutate(
        {
          file,
          onProgress: (percentage) => setProgress(percentage),
        },
        {
          onSuccess: () => {
            setProgress(null);
            setConfirmed({ filename: file.name, duration });
          },
          onError: (mutationError) => {
            setProgress(null);
            setError(
              mutationError instanceof Error
                ? mutationError.message
                : "No se pudo guardar la grabación. Inténtalo de nuevo.",
            );
          },
        },
      );
    },
    [upload],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleFile(file);
      event.target.value = "";
    },
    [handleFile],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const onClear = useCallback(() => {
    setError(null);
    setConfirmed(null);
    clear.mutate(undefined, {
      onError: () =>
        setError("No se pudo eliminar la grabación. Inténtalo de nuevo."),
    });
  }, [clear]);

  const isUploading = upload.isPending;
  const activeSourceLabel = recording
    ? "Tu grabación"
    : "Voz sintetizada del navegador";

  return (
    <section
      id="voz"
      data-ocid="recording.section"
      className="relative border-b border-border bg-card/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02·Voz"
            kicker="Tu propia voz"
            title="Narra con tu grabación"
            description="Sube un archivo de audio con tu propia narración y la leyenda se contará con tu voz. Si no subes nada, se mantiene la voz sintetizada del navegador."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={80}>
            <div className="surface-card rounded-lg p-6 sm:p-8">
              {!isAuthenticated ? (
                <div
                  data-ocid="recording.auth_prompt"
                  className="flex flex-col items-start gap-4"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Para guardar tu grabación necesitas iniciar sesión. Tu
                    archivo quedará asociado a tu cuenta y persistirá entre
                    visitas.
                  </p>
                  <button
                    type="button"
                    data-ocid="recording.login_button"
                    onClick={() => login()}
                    disabled={isLoggingIn}
                    className="inline-flex min-h-11 items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Mic className="size-4" aria-hidden="true" />
                    )}
                    Iniciar sesión para subir
                  </button>
                </div>
              ) : (
                <>
                  <div
                    data-ocid="recording.dropzone"
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={[
                      "flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center transition-smooth",
                      dragging
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background/40",
                    ].join(" ")}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-ember">
                      <Upload className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-5 font-display text-xl text-foreground">
                      Arrastra tu archivo de audio aquí
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Formatos m4a, mp3, wav u ogg · hasta 25 MB
                    </p>

                    <input
                      id={inputId}
                      type="file"
                      accept="audio/*,.m4a,.mp3,.wav,.ogg"
                      data-ocid="recording.file_input"
                      onChange={onInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={inputId}
                      data-ocid="recording.upload_button"
                      className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-accent/50 bg-accent/10 px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-smooth hover:border-accent hover:bg-accent/20 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                    >
                      <Upload className="size-4" aria-hidden="true" />
                      {recording ? "Reemplazar grabación" : "Elegir archivo"}
                    </label>
                  </div>

                  {isUploading ? (
                    <div
                      data-ocid="recording.loading_state"
                      className="mt-6"
                      aria-live="polite"
                    >
                      <div className="flex items-center justify-between text-kicker text-muted-foreground">
                        <span>Subiendo grabación</span>
                        <span>{progress ?? 0}%</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-accent transition-[width] duration-300"
                          style={{ width: `${progress ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <p
                      data-ocid="recording.error_state"
                      role="alert"
                      className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground"
                    >
                      <AlertCircle
                        className="mt-0.5 size-4 shrink-0 text-destructive"
                        aria-hidden="true"
                      />
                      {error}
                    </p>
                  ) : null}

                  {confirmed && !isUploading ? (
                    <p
                      data-ocid="recording.success_state"
                      aria-live="polite"
                      className="mt-6 flex items-start gap-3 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-foreground"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {confirmed.filename}
                        </span>
                        <span className="text-muted-foreground">
                          Duración {formatDuration(confirmed.duration)} ·
                          guardada correctamente
                        </span>
                      </span>
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <aside className="surface-card flex h-full flex-col rounded-lg p-6 sm:p-8">
              <p className="text-kicker text-muted-foreground">
                Fuente de voz activa
              </p>
              <div className="rule-ember mt-4" aria-hidden="true" />

              <div
                data-ocid="recording.active_source"
                aria-live="polite"
                className="mt-6 flex items-center gap-3"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-ember">
                  {recording ? (
                    <Waves className="size-4" aria-hidden="true" />
                  ) : (
                    <Mic className="size-4" aria-hidden="true" />
                  )}
                </span>
                <span className="font-display text-xl text-foreground">
                  {isLoading ? "Comprobando…" : activeSourceLabel}
                </span>
              </div>

              {recording ? (
                <div className="mt-6 space-y-2 border-t border-border pt-6">
                  <p
                    data-ocid="recording.current_filename"
                    className="truncate text-sm text-foreground"
                    title={recording.filename}
                  >
                    {recording.filename}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recording.uploadedAt
                      ? `Subida el ${recording.uploadedAt.toLocaleDateString(
                          "es-MX",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )}`
                      : "Grabación guardada"}
                  </p>
                  <button
                    type="button"
                    data-ocid="recording.delete_button"
                    onClick={onClear}
                    disabled={clear.isPending}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition-smooth hover:border-destructive/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {clear.isPending ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 className="size-4" aria-hidden="true" />
                    )}
                    Eliminar grabación
                  </button>
                </div>
              ) : (
                <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
                  Aún no has subido una grabación. Los botones de narración usan
                  la voz sintetizada del navegador.
                </p>
              )}
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
