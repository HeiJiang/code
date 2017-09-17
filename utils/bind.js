/**
 * bind(obj,[args])
 * @returns {Function}
 */

Function.prototype.myBind = function () {
    let context = [].shift.call(arguments),
        args = [].slice.call(arguments),
        _this = this;
    return function () {
        return _this.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
};