const Event = (function () {
  let Event,
    _default = 'default';

  Event = function () {
    let _listen,
      _trigger,
      _remove,

      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      each;

    // @ary 传入的一个数组对象 array
    // @fn 传入回调函数
    each = function (ary, fn) {
      let ret;
      for (let i = 0, l = ary.length; i < l; i++) {
        let n = ary[i];
        ret = fn.call(n, i, n);
      }
      return ret;
    };

    // @key => eventName
    // @fn => 回调函数
    // @cache => 存储所有的 Event 的对象
    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };

    // @key => 同上
    // @cache => 同上
    // @fn => 同上
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (let i = cache[key].length; i >= 0; i--) {
            if (cache[key] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };

    _trigger = function () {
      // _create() 方法暴露的 _trigger() 方法，
      // 接受的参数第一个是 cache 对象，
      // 即保存所有 events 对象，利用 Array.prototype.shift() 进行弹出，
      // 保存到当前 scope 的变量里
      let cache = _shift.call(arguments);

      // key 即是需要触发的 eventName
      let key = _shift.call(arguments);

      // 在将保存 event 信息的对象，和作为 key 的 eventName 的参数弹出后，
      // 传入函数的具体参数，数组对象
      let args = arguments;

      // 保存一个指向 Event 对象的 ref
      let _self = this,

      // 取出 key 对应保存下来的所有回调函数
      stack = cache[key];

      // 当前 key 没有任何对应需要触发的方法时，终止当前函数继续执行
      if (!stack || !stack.length) {
        return;
      }

      // 调用 each() 方法，将 key 所对应的函数以此执行
      return each(stack, function () {
        // 这里的 this 指向传入的 callback 函数
        return this.apply(_self, args);
      });
    };

    _create = function (namespace) {

      // 保存命名空间的对象，_default => 'default'
      let namespace = namespace || _default;

      // 保存所有 eventName，fn 键值对的对象
      let cache = {};

      // 离线事件
      let offlineStack = [],

      ret = {
        // 调用 _listen() 方法，监听 key 所对应的事件
        listen: function (key, fn, last) {

          _listen(key, fn, cache);

          // 如果没有离线列队，终止继续执行；
          // 如果有离线列队，则取出来以此调用执行。
          if (offlineStack === null) {
            return;
          }

          // 判断 listen() 方法传入的参数有没有 'last'，
          // 见之后的 one() 方法；
          // 如果有，将当前离线列队中的最后一个回调函数弹出并且执行
          // 如果没有，调用 each() 方法，依次执行回调函数
          if (last === 'last') {
            offlineStack.length && offlineStack.pop()();
          } else {
            each(offlineStack, function () {
              this();
            });
          }

          // 清空离线缓存列表
          offlineStack = null;
        },

        // one() 方法，去除 cache 列队中的所有已存的回调函函数 cache = [];
        // 如果当前离线列队中有没有触发的事件回调，
        // 则取出列队中的最后一个执行，并且清空离线列队。
        one: function (key, fn, last) {
          _remove(key, cache);
          this.listen(key, fn, last);
        },

        // 调用 _remove() 方法，取消已经订阅的事件方法
        remove: function (key, fn) {
          _remove(key, cache, fn);
        },

        trigger: function () {
          let fn;
          let args;
          let _self = this;

          // 见 _trigger() 方法，
          // 这里将 cache （保存下来的所有 event）
          // 和 trigger() 方法接收到的所有参数 arguments 数组对象，
          // 打成一个新的数组，作为参数传给 _trigger() 函数并且执行。
          _unshift.call(arguments, cache);
          args = arguments;

          fn = function () {
            return _trigger.apply(_self, args);
          };

          // 如果当前 namespace 下在调用 trigger() 前没有调用 listen() ，
          // 那么离线列队 offliceStack = []，为一个空的数组，
          // 就把当前 eventName 打进离线列队，
          // 等到有了 listen() 的对象之后，再触发。
          if (offlineStack) {
            return offlineStack.push(fn);
          }

          return fn();
        }
      };

      // 判断 namespace 是否已经存在，
      // 从而选择返回已经已经存在的对象，还是新的对象
      /* return namespace 语句等同于以下 if 从句
        if (namespace) {
          if (namespaceCache[namespace]) {
            return namespaceCache[namespace]
          } else {
            return namespaceCache[namespace] = ret;
          }
        } else {
          return ret;
        }
      */
      return namespace ?
        (namespaceCache[namespace] ?
          namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;

    };

    return {
      create: _create,
      one: function (key, fn, last) {
        let event = this.create();
        event.one(key, fn, last);
      },

      remove: function (key, fn) {
        let event = this.create();
        event.remove(key, fn);
      },

      listen: function (key, fn, last) {
        let event = this.create();
        event.listen(key, fn, last);
      },

      trigger: function () {
        let event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }();

  return Event;
})();
