import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type OldActor = { accessControlState : AccessControl.AccessControlState };
  public type Recording = {
    blob : Storage.ExternalBlob;
    filename : Text;
    mimeType : Text;
    uploadedAt : Nat;
  };
  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    recordings : Map.Map<Principal, Recording>;
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      recordings = Map.empty();
    };
  };
};
