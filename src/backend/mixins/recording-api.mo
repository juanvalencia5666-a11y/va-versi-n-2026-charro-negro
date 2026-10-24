import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/recording";

mixin (recordings : Map.Map<Principal, Types.Recording>) {
  func toView(rec : Types.Recording) : Types.RecordingView {
    {
      blob = rec.blob;
      filename = rec.filename;
      mimeType = rec.mimeType;
      uploadedAt = rec.uploadedAt;
    };
  };

  /// Stores the calling visitor's uploaded narration recording, replacing any
  /// previous one they uploaded. The recording persists across visits and is
  /// served back to that same visitor's legend narration buttons.
  public shared ({ caller }) func uploadRecording(
    blob : Storage.ExternalBlob,
    filename : Text,
    mimeType : Text,
  ) : async Types.RecordingView {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to upload a recording");
    };
    let stored : Types.Recording = {
      blob;
      filename;
      mimeType;
      uploadedAt = Time.now().toNat();
    };
    recordings.add(caller, stored);
    toView(stored);
  };

  /// Returns the calling visitor's stored narration recording, or `null` when
  /// they have not uploaded one yet.
  public query ({ caller }) func getRecording() : async ?Types.RecordingView {
    switch (recordings.get(caller)) {
      case (?rec) { ?toView(rec) };
      case null { null };
    };
  };

  /// Removes the calling visitor's stored narration recording, if any.
  public shared ({ caller }) func clearRecording() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to clear the recording");
    };
    recordings.remove(caller);
  };
};
