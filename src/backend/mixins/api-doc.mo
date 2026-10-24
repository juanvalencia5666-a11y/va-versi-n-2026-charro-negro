mixin () {
  /// Returns static Markdown documentation of this backend's public API.
  public query func getApiDoc() : async Text {
    return "# Charro Negro Backend API\n\n" #
      "This backend serves a static content site about the Mexican legend of the\n" #
      "Charro Negro (the Black Charro). The site's stories, curiosities, timeline\n" #
      "and 3D model details are all shipped in the frontend. The canister stores one\n" #
      "optional narration recording per visitor (a file reference held in platform\n" #
      "object storage, scoped to the caller's principal) and provides authorization\n" #
      "plumbing plus a queryable data surface for the Caffeine Data Intelligence\n" #
      "agent.\n\n" #
      "## Authentication and authorization\n\n" #
      "- The canister uses Internet Identity. The frontend pins an Internet Identity\n" #
      "  derivation origin, published at `/.well-known/ii-derivation-origin` when\n" #
      "  available. An agent that already holds the user's Internet Identity\n" #
      "  authorization derives the correct per-app principal against that origin\n" #
      "  (for example `icp identity link web <name> --app <host>`). Such a delegation\n" #
      "  acts with the user's full authority in this app until it expires.\n" #
      "- Registration is required before any role-guarded call. A direct API caller\n" #
      "  must call `_initialize_access_control` once as a signed-in (non-anonymous)\n" #
      "  caller before any role-guarded call, including guarded queries. The first\n" #
      "  caller to initialize becomes the admin; every subsequent caller becomes a\n" #
      "  regular user.\n" #
      "- An unregistered or anonymous caller receives a trap on guarded endpoints.\n" #
      "  Registration only happens when a caller signs in through the app's own\n" #
      "  frontend, so a principal that never did so is unregistered even when it\n" #
      "  belongs to the app's owner. A signed-in caller derived against a different\n" #
      "  origin is a different principal than the one the frontend registered.\n\n" #
      "## Public methods\n\n" #
      "### `getApiDoc() : async Text` (query)\n\n" #
      "Returns this document. Read-only, no caller identity required, no state read.\n\n" #
      "### `assignCallerUserRole(user : Principal, role : UserRole) : async ()`\n\n" #
      "Admin-only. Assigns `role` to `user`. Traps when the caller is not an admin.\n\n" #
      "### `getCallerUserRole() : async UserRole` (query)\n\n" #
      "Returns the role of the calling principal. Traps when the caller is not\n" #
      "registered.\n\n" #
      "### `isCallerAdmin() : async Bool` (query)\n\n" #
      "Returns `true` when the calling principal is an admin, `false` otherwise.\n\n" #
      "### `_initialize_access_control() : async ()`\n\n" #
      "Registers the calling principal. The first caller becomes the admin; later\n" #
      "callers become regular users. Must be called once by a signed-in caller before\n" #
      "any role-guarded call.\n\n" #
      "### `_internet_identity_sign_in_start()` / `_internet_identity_sign_in_finish(...)`\n\n" #
      "Internet Identity sign-in helpers used by the frontend to establish a session.\n\n" #
      "### `uploadRecording(blob : ExternalBlob, filename : Text, mimeType : Text) : async RecordingView`\n\n" #
      "Signed-in callers only; an anonymous caller traps with `Sign in to upload a\n" #
      "recording`. Stores the calling visitor's narration recording, replacing any\n" #
      "previous one that same caller uploaded, and returns the stored view. The\n" #
      "recording is scoped to the caller's principal, so one visitor's upload never\n" #
      "affects another's. `blob` is an object-storage file reference (the frontend\n" #
      "uploads the bytes and passes the reference); `filename` and `mimeType` are\n" #
      "metadata echoed back for display. `uploadedAt` is a nanosecond timestamp from\n" #
      "the canister clock. Not idempotent: each call replaces the caller's stored\n" #
      "recording.\n\n" #
      "### `getRecording() : async ?RecordingView` (query)\n\n" #
      "Returns the calling visitor's stored recording, or `null` when that caller\n" #
      "has not uploaded one. Scoped to the caller's principal, so each visitor sees\n" #
      "only their own recording. Read-only, safe to poll.\n\n" #
      "### `clearRecording() : async ()`\n\n" #
      "Signed-in callers only; an anonymous caller traps with `Sign in to clear the\n" #
      "recording`. Removes the calling visitor's stored recording. Safe to call when\n" #
      "none is stored.\n\n" #
      "## Data surface (OQL)\n\n" #
      "The canister exposes the Caffeine OQL `schema()` and `execute()` endpoints via\n" #
      "the `Expose` mixin. The entity list is currently empty, so `schema()` reports no\n" #
      "queryable entities and `execute()` returns no rows. There is no application\n" #
      "data to query.\n\n" #
      "## Units, encodings and lifecycle\n\n" #
      "- `Principal` values are Candid principals; `UserRole` is a variant\n" #
      "  (`#admin` / `#user` / `#guest`).\n" #
      "- `RecordingView.blob` is an `ExternalBlob` (a Candid `blob`) holding an\n" #
      "  object-storage file reference, not the audio bytes; the frontend resolves\n" #
      "  it to a playable URL. `uploadedAt` is a nanosecond timestamp.\n" #
      "- All methods are stateless reads except role assignment, initialization and\n" #
      "  the recording mutations, which change only authorization state or the\n" #
      "  caller's own stored recording.\n" #
      "- `getApiDoc` and `getRecording` are queries: safe to poll, no side effects.\n" #
      "- `_initialize_access_control` is not idempotent in effect: the first call\n" #
      "  grants admin, so call it exactly once from the intended admin principal.\n";
  };
};
