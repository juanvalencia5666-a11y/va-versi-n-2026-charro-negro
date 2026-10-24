import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RecordingView } from "@/backend";
import { RecordingUpload } from "@/components/RecordingUpload";

/**
 * Cover for the visitor's own narration recording: the visible upload control,
 * client-side validation, upload progress and confirmation, replacement, and
 * the active-voice indicator. The platform actor and the object-storage client
 * are local typed mocks, so this proves the component's contract with them —
 * not that the real canister or file storage works.
 */

const getRecording = vi.fn<() => Promise<RecordingView | null>>();
const uploadRecording =
  vi.fn<
    (
      blob: unknown,
      filename: string,
      mimeType: string,
    ) => Promise<RecordingView>
  >();
const clearRecording = vi.fn<() => Promise<void>>();

const mockActor = {
  getRecording,
  uploadRecording,
  clearRecording,
};

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: mockActor, isFetching: false }),
  useInternetIdentity: () => ({
    isAuthenticated: true,
    login: vi.fn(),
    isLoggingIn: false,
  }),
}));

/** Minimal stand-in for the platform `ExternalBlob` used by the upload hook. */
vi.mock("@caffeineai/object-storage", () => {
  class FakeExternalBlob {
    private progress: ((percentage: number) => void) | undefined;
    constructor(
      private readonly url: string,
      private readonly contentType: string,
      private readonly filename: string,
    ) {}
    static fromBytes(
      _bytes: Uint8Array,
      contentType?: string,
      filename?: string,
    ) {
      return new FakeExternalBlob(
        "blob:fake-recording",
        contentType ?? "",
        filename ?? "",
      );
    }
    withUploadProgress(onProgress: (percentage: number) => void) {
      this.progress = onProgress;
      return this;
    }
    getDirectURL() {
      return this.url;
    }
    getBytes() {
      return Promise.resolve(new Uint8Array());
    }
    /** Test-only: drive the progress callback the hook registered. */
    emitProgress(percentage: number) {
      this.progress?.(percentage);
    }
  }
  return { ExternalBlob: FakeExternalBlob };
});

function makeRecordingView(filename: string): RecordingView {
  return {
    blob: {
      getDirectURL: () => "blob:stored-recording",
    } as unknown as RecordingView["blob"],
    filename,
    mimeType: "audio/mpeg",
    uploadedAt: 1_700_000_000_000_000_000n,
  };
}

function renderUpload() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<RecordingUpload />, { wrapper });
}

/**
 * jsdom's `File` does not implement `arrayBuffer`, which the upload hook calls.
 * Attach it so the component can read the bytes it would send.
 */
function audioFile(name: string, type: string, size = 1024): File {
  const file = new File([new Uint8Array(size)], name, { type });
  Object.defineProperty(file, "arrayBuffer", {
    configurable: true,
    value: () => Promise.resolve(new Uint8Array(size).buffer),
  });
  return file;
}

/** Select a file directly, bypassing the input's `accept` filter. */
function selectFile(file: File) {
  fireEvent.change(screen.getByTestId("recording.file_input"), {
    target: { files: [file] },
  });
}

beforeEach(() => {
  getRecording.mockReset();
  uploadRecording.mockReset();
  clearRecording.mockReset();
  getRecording.mockResolvedValue(null);
  uploadRecording.mockImplementation((_blob, filename, mimeType) =>
    Promise.resolve({
      ...makeRecordingView(filename),
      mimeType,
    }),
  );
  clearRecording.mockImplementation(() => {
    getRecording.mockResolvedValue(null);
    return Promise.resolve();
  });

  // jsdom has no object-URL support and never loads audio metadata; stub both
  // so the duration probe resolves instead of hanging.
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:probe"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  class FakeAudio {
    preload = "";
    duration = 12.5;
    src = "";
    onloadedmetadata: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor() {
      queueMicrotask(() => this.onloadedmetadata?.());
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

describe("RecordingUpload", () => {
  it("shows the synthesized voice as the active source when nothing is uploaded", async () => {
    renderUpload();

    await waitFor(() =>
      expect(screen.getByTestId("recording.active_source")).toHaveTextContent(
        "Voz sintetizada del navegador",
      ),
    );
    expect(screen.getByTestId("recording.upload_button")).toHaveTextContent(
      "Elegir archivo",
    );
  });

  it("uploads an accepted audio file and confirms it with name and duration", async () => {
    renderUpload();

    selectFile(audioFile("mi-narracion.mp3", "audio/mpeg"));

    await waitFor(() => expect(uploadRecording).toHaveBeenCalledTimes(1));
    const [blobArg, filename, mimeType] = uploadRecording.mock.calls[0];
    expect(blobArg).toBeTruthy();
    expect(filename).toBe("mi-narracion.mp3");
    expect(mimeType).toBe("audio/mpeg");

    const success = await screen.findByTestId("recording.success_state");
    expect(success).toHaveTextContent("mi-narracion.mp3");
    expect(success).toHaveTextContent("0:13");
  });

  it("shows upload progress while the file is being stored", async () => {
    let resolveUpload: ((view: RecordingView) => void) | undefined;
    uploadRecording.mockImplementation((blob, filename, mimeType) => {
      // Drive the progress callback the hook registered on the blob, then hold
      // the upload open so the in-progress UI is observable.
      (blob as { emitProgress: (p: number) => void }).emitProgress(50);
      return new Promise<RecordingView>((resolve) => {
        resolveUpload = (view) => resolve(view);
        void filename;
        void mimeType;
      });
    });

    renderUpload();
    selectFile(audioFile("mi-narracion.mp3", "audio/mpeg"));

    const loading = await screen.findByTestId("recording.loading_state");
    expect(loading).toHaveTextContent("Subiendo grabación");
    expect(loading).toHaveTextContent("50%");

    resolveUpload?.(makeRecordingView("mi-narracion.mp3"));
    await screen.findByTestId("recording.success_state");
    expect(
      screen.queryByTestId("recording.loading_state"),
    ).not.toBeInTheDocument();
  });

  it("shows a clear message when the upload fails and stores nothing", async () => {
    uploadRecording.mockRejectedValue(
      new Error("No se pudo guardar la grabación."),
    );

    renderUpload();
    selectFile(audioFile("mi-narracion.mp3", "audio/mpeg"));

    const error = await screen.findByTestId("recording.error_state");
    expect(error).toHaveTextContent(/No se pudo guardar la grabación/i);
    expect(
      screen.queryByTestId("recording.success_state"),
    ).not.toBeInTheDocument();
  });

  it("rejects a non-audio file with a clear message and never uploads it", async () => {
    renderUpload();

    selectFile(audioFile("notas.txt", "text/plain"));

    const error = await screen.findByTestId("recording.error_state");
    expect(error).toHaveTextContent(/debe ser de audio/i);
    expect(uploadRecording).not.toHaveBeenCalled();
  });

  it("rejects an audio file over the size limit without uploading", async () => {
    renderUpload();

    selectFile(audioFile("enorme.wav", "audio/wav", 26 * 1024 * 1024));

    const error = await screen.findByTestId("recording.error_state");
    expect(error).toHaveTextContent(/25 MB/);
    expect(uploadRecording).not.toHaveBeenCalled();
  });

  it("reflects a stored recording and offers replacement", async () => {
    getRecording.mockResolvedValue(makeRecordingView("guardada.m4a"));
    renderUpload();

    expect(
      await screen.findByTestId("recording.current_filename"),
    ).toHaveTextContent("guardada.m4a");
    expect(screen.getByTestId("recording.active_source")).toHaveTextContent(
      "Tu grabación",
    );
    expect(screen.getByTestId("recording.upload_button")).toHaveTextContent(
      "Reemplazar grabación",
    );
  });

  it("clears the stored recording so narration falls back to the browser voice", async () => {
    getRecording.mockResolvedValue(makeRecordingView("guardada.m4a"));
    const user = userEvent.setup();
    renderUpload();

    await user.click(await screen.findByTestId("recording.delete_button"));

    await waitFor(() => expect(clearRecording).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId("recording.active_source")).toHaveTextContent(
        "Voz sintetizada del navegador",
      ),
    );
  });
});
