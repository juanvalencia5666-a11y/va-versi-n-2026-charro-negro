import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/recording";

module {
  /// Converts an internal recording record into its shared API view.
  public func toView(recording : Types.Recording) : Types.RecordingView {
    {
      blob = recording.blob;
      filename = recording.filename;
      mimeType = recording.mimeType;
      uploadedAt = recording.uploadedAt;
    };
  };

  /// Builds a new recording record from an uploaded external blob.
  public func new(
    blob : Storage.ExternalBlob,
    filename : Text,
    mimeType : Text,
    uploadedAt : Nat,
  ) : Types.Recording {
    { blob; filename; mimeType; uploadedAt };
  };
};
