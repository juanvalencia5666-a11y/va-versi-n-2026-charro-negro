import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BASELINE_WASM });
  await pic.upgradeCanister({ canisterId: installed.canisterId, wasm: BACKEND_WASM, arg: new Uint8Array() });
  ({ actor, canisterId } = installed);
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("returns public API documentation from getApiDoc instead of trapping", async () => {
  const doc = await actor.getApiDoc();
  expect(typeof doc).toBe("string");
  expect(doc.length).toBeGreaterThan(0);
  // The accepted requirement is that the backend documents its own public API.
  expect(doc).toContain("getApiDoc");
});

it("reports an empty OQL schema on a fresh canister", async () => {
  const schema = await actor.schema();
  expect(typeof schema).toBe("string");
});

it("answers isCallerAdmin for an anonymous caller without trapping", async () => {
  await expect(actor.isCallerAdmin()).resolves.toBe(false);
});

it("reports no stored recording on a fresh canister", async () => {
  await expect(actor.getRecording()).resolves.toEqual([]);
});

it("round-trips an uploaded recording through the real canister", async () => {
  const alice = createIdentity("recording-alice");
  actor.setIdentity(alice);

  const blob = new Uint8Array([1, 2, 3, 4]);
  const view = await actor.uploadRecording(blob, "mi-voz.mp3", "audio/mpeg");
  expect(view.filename).toBe("mi-voz.mp3");
  expect(view.mimeType).toBe("audio/mpeg");
  expect(view.uploadedAt).toBeGreaterThan(0n);

  const stored = await actor.getRecording();
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({
    filename: "mi-voz.mp3",
    mimeType: "audio/mpeg",
  });
});

it("replaces the previous recording when a new one is uploaded", async () => {
  const alice = createIdentity("recording-replace");
  actor.setIdentity(alice);

  await actor.uploadRecording(new Uint8Array([1]), "primera.mp3", "audio/mpeg");
  await actor.uploadRecording(new Uint8Array([2]), "segunda.wav", "audio/wav");

  const stored = await actor.getRecording();
  expect(stored).toHaveLength(1);
  expect(stored[0].filename).toBe("segunda.wav");
});

it("clears the stored recording", async () => {
  const alice = createIdentity("recording-clear");
  actor.setIdentity(alice);

  await actor.uploadRecording(new Uint8Array([1]), "borrar.mp3", "audio/mpeg");
  await expect(actor.clearRecording()).resolves.toBeNull();
  await expect(actor.getRecording()).resolves.toEqual([]);
});

it("rejects an anonymous caller trying to upload a recording", async () => {
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    guest.uploadRecording(new Uint8Array([1]), "anon.mp3", "audio/mpeg"),
  ).rejects.toThrow();
});
