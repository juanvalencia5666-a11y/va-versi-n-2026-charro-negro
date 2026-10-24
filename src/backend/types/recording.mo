import Storage "mo:caffeineai-object-storage/Storage";

module {
  /// A visitor-uploaded narration recording, stored off-chain via the platform
  /// object-storage extension. `blob` is the external file reference; the
  /// frontend resolves it to a playable URL.
  public type Recording = {
    blob : Storage.ExternalBlob;
    filename : Text;
    mimeType : Text;
    uploadedAt : Nat;
  };

  /// Shared view of a recording returned across the API boundary.
  public type RecordingView = {
    blob : Storage.ExternalBlob;
    filename : Text;
    mimeType : Text;
    uploadedAt : Nat;
  };
};
