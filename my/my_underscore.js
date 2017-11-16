(function () {

  var root = this;
  var previousUnderscore = root._;
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = Object.hasOwnProperty;

  var nativeIsArray = Array.isArray,
    nativeKeys = Array.key,
    nativeBind = FuncProto.bind,
    nativeCreate = Object.create;

  var Ctor = function () { };

  var _ = function (obj) {
    if (obj instanceof _) {
      return obj;
    }
    if (!(this instanceof _)) {
      return new _(obj);
    }
    this._wrapped = obj;
  }

  if(typeof)
})();