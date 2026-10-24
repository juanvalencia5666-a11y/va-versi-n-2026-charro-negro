import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Expose "mo:caffeineai-oql/Expose";
import ApiDocMixin "mixins/api-doc";
import RecordingApiMixin "mixins/recording-api";
import Types "types/recording";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let recordings : Map.Map<Principal, Types.Recording>;

  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();
  include RecordingApiMixin(recordings);
  include Expose({ entities = [] });
  include ApiDocMixin();
};
