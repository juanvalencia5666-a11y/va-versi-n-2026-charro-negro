# Project Guidance

## User Preferences

- Three sections: Leyenda Real, Leyenda Actualizada and Curiosidades
- The Kevin story is reproduced exactly as written in Leyenda Actualizada
- The original legend goes in the Leyenda Real section
- Graphic representations and images of the Charro Negro
- Interactive 3D model with character details (how he dressed, interesting facts)
- Professional finish with a Halloween look: clean, polished and presentable
- A narration button per story, with separate voices
- Both voices male and deep, sounding like the Charro Negro
- A timeline in the original version
- Black and grey colour palette
- 3D model on horseback in a dark desert, with clicks on hat, suit and more to reveal details
- The narration voice should be the visitor's own uploaded recording when one exists

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Web Speech voices load async; resolve via a voiceschanged listener and pick a distinct named deep Spanish voice per narration so two stories keep separate voices.
- drei Html hotspots inside a Canvas need stopPropagation on click/pointer events so OrbitControls does not swallow the tap.
- A CSS custom property in :root does not create a Tailwind utility; the color must also be registered in tailwind.config.js colors.
- pnpm fix (biome --write) resolves import-order and JSX formatting errors that pnpm check flags; run it before check.
- Motoko has no triple-quoted strings; build multi-line Text with "\n" concatenation.
- STORY_NARRATION_TEXT derives from STORY_BLOCKS, so story edits propagate to both the live-chat render and the narration automatically.
- The notification narration prefix is hardcoded to Banco Azteca rather than using block.author, so a non-bank notification block is misattributed in speech.
- pnpm fix (biome --write) reformats all of src, including tester-owned test files, as a side effect of the check command sequence.
- ExternalBlob.fromBytes(bytes, type, name).withUploadProgress(cb) feeds actor.uploadRecording; core-infrastructure wires the storage client automatically.
- useRecording returns RecordingInfo.url from blob.getDirectURL(); narration sections pass it as recordingUrl to useNarration.
- useNarration plays an uploaded recording via HTMLAudioElement when recordingUrl is set, else Web Speech; a module-level activeStop registry enforces one narration at a time across sections.
- Sections reading useRecording() must sit behind an error boundary: useActor throws when InternetIdentityProvider is absent, so bare-rendered tests crash without a synthesized-voice fallback.
- A pending migration's NewActor must inline the exact actor field type; ?Blob vs ?Recording fails M0170.
- Time.now() returns Time.Time (Int); a Nat timestamp field needs Time.now().toNat().
- The recording is a single canister-global field, so getRecording returns the same audio to every visitor regardless of who uploaded it.
- Per-caller recording scoping requires the Map<Principal, Recording> field in main.mo, the migration NewActor, and the unchanged getRecording/uploadRecording signatures to stay in sync.
- Notification narration now derives its prefix from block.author, so each notification is attributed to its real sender.
- Scoping per-caller state needs Map<Principal, T>; getRecording must take ({ caller }) and read recordings.get(caller).
- A pending migration is edited in place, not duplicated; check-stable baseline .old/backend.did proves which migrations are unapplied.
