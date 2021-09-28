(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":7}],4:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],5:[function(require,module,exports){
var n,l,u,t,i,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function p(n){var l=n.parentNode;l&&l.removeChild(n)}function v(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return h(l,f,i,o,null)}function h(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null!=l.vnode&&l.vnode(f),f}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function x(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!b.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(b)}function b(){for(var n;b.__r=i.length;)n=i.sort(function(n,l){return n.__v.__b-l.__v.__b}),i=[],n.some(function(n){var l,u,t,i,o,r;n.__d&&(o=(i=(l=n).__v).__e,(r=l.__P)&&(u=[],(t=a({},i)).__v=i.__v+1,I(r,i,t,l.__n,void 0!==r.ownerSVGElement,null!=i.__h?[o]:null,u,null==o?_(i):o,i.__h),T(u,i),i.__e!=o&&k(i)))})}function m(n,l,u,t,i,o,r,f,s,a){var p,v,d,k,x,b,m,A=t&&t.__k||c,P=A.length;for(u.__k=[],p=0;p<l.length;p++)if(null!=(k=u.__k[p]=null==(k=l[p])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?h(null,k,null,null,k):Array.isArray(k)?h(y,{children:k},null,null,null):k.__b>0?h(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=A[p])||d&&k.key==d.key&&k.type===d.type)A[p]=void 0;else for(v=0;v<P;v++){if((d=A[v])&&k.key==d.key&&k.type===d.type){A[v]=void 0;break}d=null}I(n,k,d=d||e,i,o,r,f,s,a),x=k.__e,(v=k.ref)&&d.ref!=v&&(m||(m=[]),d.ref&&m.push(d.ref,null,k),m.push(v,k.__c||x,k)),null!=x?(null==b&&(b=x),"function"==typeof k.type&&null!=k.__k&&k.__k===d.__k?k.__d=s=g(k,s,n):s=w(n,k,d,A,x,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&d.__e==s&&s.parentNode!=n&&(s=_(d))}for(u.__e=b,p=P;p--;)null!=A[p]&&("function"==typeof u.type&&null!=A[p].__e&&A[p].__e==u.__d&&(u.__d=_(t,p+1)),L(A[p],A[p]));if(m)for(p=0;p<m.length;p++)z(m[p],m[++p],m[++p])}function g(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,l="function"==typeof i.type?g(i,l,u):w(u,i,i,n.__k,i.__e,l));return l}function w(n,l,u,t,i,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||i!=o||null==i.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(i),r=null;else{for(f=o,e=0;(f=f.nextSibling)&&e<t.length;e+=2)if(f==i)break n;n.insertBefore(i,o),r=o}return void 0!==r?r:i.nextSibling}function A(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||C(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function C(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||P(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||P(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t||n.addEventListener(l,o?H:$,o):n.removeEventListener(l,o?H:$,o);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function $(n){this.l[n.type+!1](l.event?l.event(n):n)}function H(n){this.l[n.type+!0](l.event?l.event(n):n)}function I(n,u,t,i,o,r,f,e,c){var s,p,v,h,_,k,x,b,g,w,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(b=u.props,g=(s=P.contextType)&&i[s.__c],w=s?g?g.props.value:s.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(b,w):(u.__c=p=new d(b,w),p.constructor=P,p.render=M),g&&g.sub(p),p.props=b,p.state||(p.state={}),p.context=w,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=a({},p.__s)),a(p.__s,P.getDerivedStateFromProps(b,p.__s))),h=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==h&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(b,w),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(b,p.__s,w)||u.__v===t.__v){p.props=b,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),p.__h.length&&f.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(b,p.__s,w),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(h,_,k)})}p.context=w,p.props=b,p.state=p.__s,(s=l.__r)&&s(u),p.__d=!1,p.__v=u,p.__P=n,s=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=a(a({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(k=p.getSnapshotBeforeUpdate(h,_)),A=null!=s&&s.type===y&&null==s.key?s.props.children:s,m(n,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,o,r,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,t)}}function T(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,o,r,f,c){var s,a,v,h=t.props,y=u.props,d=u.type,k=0;if("svg"===d&&(o=!0),null!=r)for(;k<r.length;k++)if((s=r[k])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,r[k]=null;break}if(null==l){if(null===d)return document.createTextNode(y);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,y.is&&y),r=null,c=!1}if(null===d)h===y||c&&l.data===y||(l.data=y);else{if(r=r&&n.call(l.childNodes),a=(h=t.props||e).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,!c){if(null!=r)for(h={},k=0;k<l.attributes.length;k++)h[l.attributes[k].name]=l.attributes[k].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""))}if(A(l,y,h,o,c),v)u.__k=[];else if(k=u.props.children,m(l,Array.isArray(k)?k:[k],u,t,i,o&&"foreignObject"!==d,r,f,r?r[0]:t.__k&&_(t,0),c),null!=r)for(k=r.length;k--;)null!=r[k]&&p(r[k]);c||("value"in y&&void 0!==(k=y.value)&&(k!==l.value||"progress"===d&&!k)&&C(l,"value",k,h.value,!1),"checked"in y&&void 0!==(k=y.checked)&&k!==l.checked&&C(l,"checked",k,h.checked,!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function L(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&L(i[o],u,"function"!=typeof n.type);t||null==n.__e||p(n.__e),n.__e=n.__d=void 0}function M(n,l,u){return this.constructor(n,u)}function N(u,t,i){var o,r,f;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],I(t,u=(!o&&i||t).__k=v(y,null,[u]),r||e,e,void 0!==t.ownerSVGElement,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o),T(f,u)}n=c.slice,l={__e:function(n,l){for(var u,t,i;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return u.__E=u}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),x(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),x(this))},d.prototype.render=y,i=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,b.__r=0,f=0,exports.render=N,exports.hydrate=function n(l,u){N(l,u,n)},exports.createElement=v,exports.h=v,exports.Fragment=y,exports.createRef=function(){return{current:null}},exports.isValidElement=t,exports.Component=d,exports.cloneElement=function(l,u,t){var i,o,r,f=a({},l.props);for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),h(l.type,f,i||l.key,o||l.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(x)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.options=l;


},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],8:[function(require,module,exports){
'use strict';

class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

},{}],9:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const tokenStorage = require('./tokenStorage');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(([headers, token]) => {
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }

  authUrl(queries = {}) {
    if (this.preAuthToken) {
      queries.uppyPreAuthToken = this.preAuthToken;
    }

    return `${this.hostname}/${this.id}/connect?${new URLSearchParams(queries)}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return Promise.resolve();
    }

    return this.post(`${this.id}/preauth/`, {
      params: this.companionKeysParams
    }).then(res => {
      this.preAuthToken = res.token;
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    });
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(([response]) => response);
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

},{"./RequestClient":10,"./tokenStorage":14}],10:[function(require,module,exports){
'use strict';

var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError');

const AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(([allowedHeaders, headers]) => {
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.1", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

},{"./../../utils/lib/fetchWithNetworkError":33,"./AuthError":8}],11:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

},{"./RequestClient":10}],12:[function(require,module,exports){
"use strict";

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = require('namespace-emitter');

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

},{"namespace-emitter":4}],13:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

const RequestClient = require('./RequestClient');

const Provider = require('./Provider');

const SearchProvider = require('./SearchProvider');

const Socket = require('./Socket');

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

},{"./Provider":9,"./RequestClient":10,"./SearchProvider":11,"./Socket":12}],14:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],15:[function(require,module,exports){
(function (process){(function (){
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

let { urlAlphabet } = require('./url-alphabet/index.cjs')

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * size) / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}

module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":16,"_process":6}],16:[function(require,module,exports){
// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

module.exports = { urlAlphabet }

},{}],17:[function(require,module,exports){
"use strict";

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = require('./../../utils/lib/Translator');

module.exports = class BasePlugin {
  constructor(uppy, opts = {}) {
    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

},{"./../../utils/lib/Translator":31}],18:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = require('preact');

const findDOMElement = require('./../../utils/lib/findDOMElement');

const BasePlugin = require('./BasePlugin');
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return (...args) => {
    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

},{"./../../utils/lib/findDOMElement":34,"./BasePlugin":17,"preact":5}],19:[function(require,module,exports){
/* global AggregateError */
'use strict';

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = require('./../../utils/lib/Translator');

const ee = require('namespace-emitter');

const {
  nanoid
} = require('nanoid');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const match = require('mime-match');

const DefaultStore = require('./../../store-default');

const getFileType = require('./../../utils/lib/getFileType');

const getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

const generateFileID = require('./../../utils/lib/generateFileID');

const supportsUploadProgress = require('./supportsUploadProgress');

const getFileName = require('./getFileName');

const {
  justErrorsLogger,
  debugLogger
} = require('./loggers'); // Exported from here.


class RestrictionError extends Error {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(message, errors) {
      super(message);
      this.errors = errors;
    }

  };
}

class AggregateRestrictionError extends AggregateError {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _checkRestrictions = /*#__PURE__*/_classPrivateFieldLooseKey("checkRestrictions");

var _checkMinNumberOfFiles = /*#__PURE__*/_classPrivateFieldLooseKey("checkMinNumberOfFiles");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _showOrLogErrorAndThrow = /*#__PURE__*/_classPrivateFieldLooseKey("showOrLogErrorAndThrow");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _showOrLogErrorAndThrow, {
      value: _showOrLogErrorAndThrow2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkMinNumberOfFiles, {
      value: _checkMinNumberOfFiles2
    });
    Object.defineProperty(this, _checkRestrictions, {
      value: _checkRestrictions2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null,
        requiredMetaFields: []
      },
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event, ...args) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(({
      progress
    }) => !progress.uploadComplete && progress.uploadStarted);
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */


  validateRestrictions(file, files) {
    try {
      _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */


  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason = null) {
    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type = 'info', duration = 3000) {
    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2](...args) {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...args);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => {
      _classPrivateFieldLooseBase(this, _checkMinNumberOfFiles)[_checkMinNumberOfFiles](files);

      _classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err);
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
        showInformer: false
      });
    });
  }

}

function _checkRestrictions2(file, files = this.getFiles()) {
  const {
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    allowedFileTypes
  } = this.opts.restrictions;

  if (maxNumberOfFiles) {
    if (files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }
  }

  if (allowedFileTypes) {
    const isCorrectFileType = allowedFileTypes.some(type => {
      // check if this is a mime-type
      if (type.indexOf('/') > -1) {
        if (!file.type) return false;
        return match(file.type.replace(/;.*?$/, ''), type);
      } // otherwise this is likely an extension


      if (type[0] === '.' && file.extension) {
        return file.extension.toLowerCase() === type.substr(1).toLowerCase();
      }

      return false;
    });

    if (!isCorrectFileType) {
      const allowedFileTypesString = allowedFileTypes.join(', ');
      throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
        types: allowedFileTypesString
      }));
    }
  } // We can't check maxTotalFileSize if the size is unknown.


  if (maxTotalFileSize && file.size != null) {
    let totalFilesSize = 0;
    totalFilesSize += file.size;
    files.forEach(f => {
      totalFilesSize += f.size;
    });

    if (totalFilesSize > maxTotalFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxTotalFileSize),
        file: file.name
      }));
    }
  } // We can't check maxFileSize if the size is unknown.


  if (maxFileSize && file.size != null) {
    if (file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    }
  } // We can't check minFileSize if the size is unknown.


  if (minFileSize && file.size != null) {
    if (file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }
}

function _checkMinNumberOfFiles2(files) {
  const {
    minNumberOfFiles
  } = this.opts.restrictions;

  if (Object.keys(files).length < minNumberOfFiles) {
    throw new RestrictionError(`${this.i18n('youHaveToAtLeastSelectX', {
      smart_count: minNumberOfFiles
    })}`);
  }
}

function _checkRequiredMetaFields2(files) {
  const {
    requiredMetaFields
  } = this.opts.restrictions;
  const {
    hasOwnProperty
  } = Object.prototype;
  const errors = [];

  for (const fileID of Object.keys(files)) {
    const file = this.getFile(fileID);

    for (let i = 0; i < requiredMetaFields.length; i++) {
      if (!hasOwnProperty.call(file.meta, requiredMetaFields[i]) || file.meta[requiredMetaFields[i]] === '') {
        const err = new RestrictionError(`${this.i18n('missingRequiredMetaFieldOnFile', {
          fileName: file.name
        })}`);
        errors.push(err);

        _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
          file,
          showInformer: false,
          throwErr: false
        });
      }
    }
  }

  if (errors.length) {
    throw new AggregateRestrictionError(`${this.i18n('missingRequiredMetaField')}`, errors);
  }
}

function _showOrLogErrorAndThrow2(err, {
  showInformer = true,
  file = null,
  throwErr = true
} = {}) {
  const message = typeof err === 'object' ? err.message : err;
  const details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
  // as they are expected and shown in the UI.

  let logMessageWithDetails = message;

  if (details) {
    logMessageWithDetails += ` ${details}`;
  }

  if (err.isRestriction) {
    this.log(logMessageWithDetails);
    this.emit('restriction-failed', file, err);
  } else {
    this.log(logMessageWithDetails, 'error');
  } // Sometimes informer has to be shown manually by the developer,
  // for example, in `onBeforeFileAdded`.


  if (showInformer) {
    this.info({
      message,
      details
    }, 'error', this.opts.infoTimeout);
  }

  if (throwErr) {
    throw typeof err === 'object' ? err : new Error(err);
  }
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError(this.i18n('noMoreFilesAllowed')), {
      file
    });
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
      file: fileDescriptor
    });
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
      showInformer: false,
      fileDescriptor
    });
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
      file: newFile
    });
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](newError, {
        throwErr: false
      });
    } else {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
        throwErr: false
      });
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts = {}) {
  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    this.emit('error', err);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.0.3";
module.exports = Uppy;

},{"./../../store-default":26,"./../../utils/lib/Translator":31,"./../../utils/lib/generateFileID":35,"./../../utils/lib/getFileNameAndExtension":36,"./../../utils/lib/getFileType":37,"./getFileName":20,"./loggers":22,"./supportsUploadProgress":23,"@transloadit/prettier-bytes":1,"lodash.throttle":2,"mime-match":3,"namespace-emitter":4,"nanoid":15}],20:[function(require,module,exports){
"use strict";

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

},{}],21:[function(require,module,exports){
'use strict';

const Uppy = require('./Uppy');

const UIPlugin = require('./UIPlugin');

const BasePlugin = require('./BasePlugin');

const {
  debugLogger
} = require('./loggers');

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

},{"./BasePlugin":17,"./UIPlugin":18,"./Uppy":19,"./loggers":22}],22:[function(require,module,exports){
"use strict";

/* eslint-disable no-console */
const getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
  warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

},{"./../../utils/lib/getTimeStamp":39}],23:[function(require,module,exports){
"use strict";

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],24:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const toArray = require('./../../utils/lib/toArray');

const {
  h
} = require('preact');

module.exports = (_temp = _class = class FileInput extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'FileInput';
    this.title = 'File Input';
    this.type = 'acquirer';
    this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    const defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    const files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  }

  handleClick() {
    this.input.click();
  }

  render() {
    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    const hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    const {
      restrictions
    } = this.uppy.opts;
    const accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      className: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      className: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onChange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: input => {
        this.input = input;
      }
    }), this.opts.pretty && h("button", {
      className: "uppy-FileInput-btn",
      type: "button",
      onClick: this.handleClick
    }, this.i18n('chooseFiles')));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.2", _temp);

},{"./../../core":21,"./../../utils/lib/toArray":45,"preact":5}],25:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const {
  h
} = require('preact');
/**
 * Progress bar
 *
 */


module.exports = (_temp = _class = class ProgressBar extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'ProgressBar';
    this.title = 'Progress Bar';
    this.type = 'progressindicator'; // set default options

    const defaultOptions = {
      target: 'body',
      fixed: false,
      hideAfterFinish: true
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.render = this.render.bind(this);
  }

  render(state) {
    const progress = state.totalProgress || 0; // before starting and after finish should be hidden if specified in the options

    const isHidden = (progress === 0 || progress === 100) && this.opts.hideAfterFinish;
    return h("div", {
      className: "uppy uppy-ProgressBar",
      style: {
        position: this.opts.fixed ? 'fixed' : 'initial'
      },
      "aria-hidden": isHidden
    }, h("div", {
      className: "uppy-ProgressBar-inner",
      style: {
        width: `${progress}%`
      }
    }), h("div", {
      className: "uppy-ProgressBar-percentage"
    }, progress));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.2", _temp);

},{"./../../core":21,"preact":5}],26:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2(...args) {
  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.0";

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],27:[function(require,module,exports){
"use strict";

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

},{}],28:[function(require,module,exports){
"use strict";

class NetworkError extends Error {
  constructor(error, xhr = null) {
    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

},{}],29:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _aliveTimer = /*#__PURE__*/_classPrivateFieldLooseKey("aliveTimer");

var _isDone = /*#__PURE__*/_classPrivateFieldLooseKey("isDone");

var _onTimedOut = /*#__PURE__*/_classPrivateFieldLooseKey("onTimedOut");

var _timeout = /*#__PURE__*/_classPrivateFieldLooseKey("timeout");

/**
 * Helper to abort upload requests if there has not been any progress for `timeout` ms.
 * Create an instance using `timer = new ProgressTimeout(10000, onTimeout)`
 * Call `timer.progress()` to signal that there has been progress of any kind.
 * Call `timer.done()` when the upload has completed.
 */
class ProgressTimeout {
  constructor(timeout, timeoutHandler) {
    Object.defineProperty(this, _aliveTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isDone, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _onTimedOut, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _timeout, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _timeout)[_timeout] = timeout;
    _classPrivateFieldLooseBase(this, _onTimedOut)[_onTimedOut] = timeoutHandler;
  }

  progress() {
    // Some browsers fire another progress event when the upload is
    // cancelled, so we have to ignore progress after the timer was
    // told to stop.
    if (_classPrivateFieldLooseBase(this, _isDone)[_isDone]) return;

    if (_classPrivateFieldLooseBase(this, _timeout)[_timeout] > 0) {
      clearTimeout(_classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer]);
      _classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer] = setTimeout(_classPrivateFieldLooseBase(this, _onTimedOut)[_onTimedOut], _classPrivateFieldLooseBase(this, _timeout)[_timeout]);
    }
  }

  done() {
    if (!_classPrivateFieldLooseBase(this, _isDone)[_isDone]) {
      clearTimeout(_classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer]);
      _classPrivateFieldLooseBase(this, _aliveTimer)[_aliveTimer] = null;
      _classPrivateFieldLooseBase(this, _isDone)[_isDone] = true;
    }
  }

}

module.exports = ProgressTimeout;

},{}],30:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    return (...args) => {
      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options = {}) {
  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

},{}],31:[function(require,module,exports){
"use strict";

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = require('./hasProperty');

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

},{"./hasProperty":40}],32:[function(require,module,exports){
"use strict";

const throttle = require('lodash.throttle');

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":2}],33:[function(require,module,exports){
"use strict";

const NetworkError = require('./NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError(...options) {
  return fetch(...options).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./NetworkError":28}],34:[function(require,module,exports){
"use strict";

const isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context = document) {
  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

},{"./isDOMElement":41}],35:[function(require,module,exports){
"use strict";

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

},{}],36:[function(require,module,exports){
"use strict";

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

},{}],37:[function(require,module,exports){
"use strict";

const getFileNameAndExtension = require('./getFileNameAndExtension');

const mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

},{"./getFileNameAndExtension":36,"./mimeTypes":43}],38:[function(require,module,exports){
"use strict";

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

},{}],39:[function(require,module,exports){
"use strict";

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

},{}],40:[function(require,module,exports){
"use strict";

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],41:[function(require,module,exports){
"use strict";

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

},{}],42:[function(require,module,exports){
"use strict";

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],43:[function(require,module,exports){
"use strict";

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

},{}],44:[function(require,module,exports){
"use strict";

module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],45:[function(require,module,exports){
"use strict";

/**
 * Converts list into array
 */
module.exports = Array.from;

},{}],46:[function(require,module,exports){
(function (process){(function (){
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

let { urlAlphabet } = require('./url-alphabet/index.cjs')

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * size) / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}

module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":47,"_process":6}],47:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],48:[function(require,module,exports){
"use strict";

var _class, _temp;

const BasePlugin = require('./../../core/lib/BasePlugin');

const {
  nanoid
} = require('nanoid');

const {
  Provider,
  RequestClient,
  Socket
} = require('./../../companion-client');

const emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

const getSocketHost = require('./../../utils/lib/getSocketHost');

const settle = require('./../../utils/lib/settle');

const EventTracker = require('./../../utils/lib/EventTracker');

const ProgressTimeout = require('./../../utils/lib/ProgressTimeout');

const {
  RateLimitedQueue,
  internalRateLimitedQueue
} = require('./../../utils/lib/RateLimitedQueue');

const NetworkError = require('./../../utils/lib/NetworkError');

const isNetworkError = require('./../../utils/lib/isNetworkError');

function buildResponseError(xhr, err) {
  let error = err; // No error message

  if (!error) error = new Error('Upload error'); // Got an error message string

  if (typeof error === 'string') error = new Error(error); // Got something else

  if (!(error instanceof Error)) {
    error = Object.assign(new Error('Upload error'), {
      data: error
    });
  }

  if (isNetworkError(xhr)) {
    error = new NetworkError(error, xhr);
    return error;
  }

  error.request = xhr;
  return error;
}
/**
 * Set `data.type` in the blob to `file.meta.type`,
 * because we might have detected a more accurate file type in Uppy
 * https://stackoverflow.com/a/50875615
 *
 * @param {object} file File object with `data`, `size` and `meta` properties
 * @returns {object} blob updated with the new `type` set from `file.meta.type`
 */


function setTypeInBlob(file) {
  const dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
  return dataWithUpdatedType;
}

module.exports = (_temp = _class = class XHRUpload extends BasePlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'XHRUpload';
    this.title = 'XHRUpload';
    this.defaultLocale = {
      strings: {
        timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
      }
    }; // Default options

    const defaultOptions = {
      formData: true,
      fieldName: opts.bundle ? 'files[]' : 'file',
      method: 'post',
      metaFields: null,
      responseUrlFieldName: 'url',
      bundle: false,
      headers: {},
      timeout: 30 * 1000,
      limit: 5,
      withCredentials: false,
      responseType: '',

      /**
       * @typedef respObj
       * @property {string} responseText
       * @property {number} status
       * @property {string} statusText
       * @property {object.<string, string>} headers
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseData(responseText) {
        let parsedResponse = {};

        try {
          parsedResponse = JSON.parse(responseText);
        } catch (err) {
          uppy.log(err);
        }

        return parsedResponse;
      },

      /**
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseError(_, response) {
        let error = new Error('Upload error');

        if (isNetworkError(response)) {
          error = new NetworkError(error, response);
        }

        return error;
      },

      /**
       * Check if the response from the upload endpoint indicates that the upload was successful.
       *
       * @param {number} status the response status code
       */
      validateStatus(status) {
        return status >= 200 && status < 300;
      }

    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.handleUpload = this.handleUpload.bind(this); // Simultaneous upload limiting is shared across all uploads with this plugin.

    if (internalRateLimitedQueue in this.opts) {
      this.requests = this.opts[internalRateLimitedQueue];
    } else {
      this.requests = new RateLimitedQueue(this.opts.limit);
    }

    if (this.opts.bundle && !this.opts.formData) {
      throw new Error('`opts.formData` must be true when `opts.bundle` is enabled.');
    }

    this.uploaderEvents = Object.create(null);
  }

  getOptions(file) {
    const overrides = this.uppy.getState().xhrUpload;
    const {
      headers
    } = this.opts;
    const opts = { ...this.opts,
      ...(overrides || {}),
      ...(file.xhrUpload || {}),
      headers: {}
    }; // Support for `headers` as a function, only in the XHRUpload settings.
    // Options set by other plugins in Uppy state or on the files themselves are still merged in afterward.
    //
    // ```js
    // headers: (file) => ({ expires: file.meta.expires })
    // ```

    if (typeof headers === 'function') {
      opts.headers = headers(file);
    } else {
      Object.assign(opts.headers, this.opts.headers);
    }

    if (overrides) {
      Object.assign(opts.headers, overrides.headers);
    }

    if (file.xhrUpload) {
      Object.assign(opts.headers, file.xhrUpload.headers);
    }

    return opts;
  } // eslint-disable-next-line class-methods-use-this


  addMetadata(formData, meta, opts) {
    const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields : Object.keys(meta); // Send along all fields by default.

    metaFields.forEach(item => {
      formData.append(item, meta[item]);
    });
  }

  createFormDataUpload(file, opts) {
    const formPost = new FormData();
    this.addMetadata(formPost, file.meta, opts);
    const dataWithUpdatedType = setTypeInBlob(file);

    if (file.name) {
      formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
    } else {
      formPost.append(opts.fieldName, dataWithUpdatedType);
    }

    return formPost;
  }

  createBundledUpload(files, opts) {
    const formPost = new FormData();
    const {
      meta
    } = this.uppy.getState();
    this.addMetadata(formPost, meta, opts);
    files.forEach(file => {
      const options = this.getOptions(file);
      const dataWithUpdatedType = setTypeInBlob(file);

      if (file.name) {
        formPost.append(options.fieldName, dataWithUpdatedType, file.name);
      } else {
        formPost.append(options.fieldName, dataWithUpdatedType);
      }
    });
    return formPost;
  }

  upload(file, current, total) {
    const opts = this.getOptions(file);
    this.uppy.log(`uploading ${current} of ${total}`);
    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const data = opts.formData ? this.createFormDataUpload(file, opts) : file.data;
      const xhr = new XMLHttpRequest();
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      const timer = new ProgressTimeout(opts.timeout, () => {
        xhr.abort();
        queuedRequest.done();
        const error = new Error(this.i18n('timedOut', {
          seconds: Math.ceil(opts.timeout / 1000)
        }));
        this.uppy.emit('upload-error', file, error);
        reject(error);
      });
      const id = nanoid();
      xhr.upload.addEventListener('loadstart', () => {
        this.uppy.log(`[XHRUpload] ${id} started`);
      });
      xhr.upload.addEventListener('progress', ev => {
        this.uppy.log(`[XHRUpload] ${id} progress: ${ev.loaded} / ${ev.total}`); // Begin checking for timeouts when progress starts, instead of loading,
        // to avoid timing out requests on browser concurrency queue

        timer.progress();

        if (ev.lengthComputable) {
          this.uppy.emit('upload-progress', file, {
            uploader: this,
            bytesUploaded: ev.loaded,
            bytesTotal: ev.total
          });
        }
      });
      xhr.addEventListener('load', ev => {
        this.uppy.log(`[XHRUpload] ${id} finished`);
        timer.done();
        queuedRequest.done();

        if (this.uploaderEvents[file.id]) {
          this.uploaderEvents[file.id].remove();
          this.uploaderEvents[file.id] = null;
        }

        if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          const body = opts.getResponseData(xhr.responseText, xhr);
          const uploadURL = body[opts.responseUrlFieldName];
          const uploadResp = {
            status: ev.target.status,
            body,
            uploadURL
          };
          this.uppy.emit('upload-success', file, uploadResp);

          if (uploadURL) {
            this.uppy.log(`Download ${file.name} from ${uploadURL}`);
          }

          return resolve(file);
        }

        const body = opts.getResponseData(xhr.responseText, xhr);
        const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
        const response = {
          status: ev.target.status,
          body
        };
        this.uppy.emit('upload-error', file, error, response);
        return reject(error);
      });
      xhr.addEventListener('error', () => {
        this.uppy.log(`[XHRUpload] ${id} errored`);
        timer.done();
        queuedRequest.done();

        if (this.uploaderEvents[file.id]) {
          this.uploaderEvents[file.id].remove();
          this.uploaderEvents[file.id] = null;
        }

        const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
        this.uppy.emit('upload-error', file, error);
        return reject(error);
      });
      xhr.open(opts.method.toUpperCase(), opts.endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = opts.withCredentials;

      if (opts.responseType !== '') {
        xhr.responseType = opts.responseType;
      }

      const queuedRequest = this.requests.run(() => {
        this.uppy.emit('upload-started', file); // When using an authentication system like JWT, the bearer token goes as a header. This
        // header needs to be fresh each time the token is refreshed so computing and setting the
        // headers just before the upload starts enables this kind of authentication to work properly.
        // Otherwise, half-way through the list of uploads the token could be stale and the upload would fail.

        const currentOpts = this.getOptions(file);
        Object.keys(currentOpts.headers).forEach(header => {
          xhr.setRequestHeader(header, currentOpts.headers[header]);
        });
        xhr.send(data);
        return () => {
          timer.done();
          xhr.abort();
        };
      });
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        reject(new Error('File removed'));
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        reject(new Error('Upload cancelled'));
      });
    });
  }

  uploadRemote(file) {
    const opts = this.getOptions(file);
    return new Promise((resolve, reject) => {
      const fields = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(name => {
        fields[name] = file.meta[name];
      });
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions);
      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        size: file.data.size,
        fieldname: opts.fieldName,
        metadata: fields,
        httpMethod: opts.method,
        useFormData: opts.formData,
        headers: opts.headers
      }).then(res => {
        const {
          token
        } = res;
        const host = getSocketHost(file.remote.companionUrl);
        const socket = new Socket({
          target: `${host}/api/${token}`,
          autoOpen: false
        });
        this.uploaderEvents[file.id] = new EventTracker(this.uppy);
        this.onFileRemove(file.id, () => {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve(`upload ${file.id} was removed`);
        });
        this.onCancelAll(file.id, () => {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve(`upload ${file.id} was canceled`);
        });
        this.onRetry(file.id, () => {
          socket.send('pause', {});
          socket.send('resume', {});
        });
        this.onRetryAll(file.id, () => {
          socket.send('pause', {});
          socket.send('resume', {});
        });
        socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
        socket.on('success', data => {
          const body = opts.getResponseData(data.response.responseText, data.response);
          const uploadURL = body[opts.responseUrlFieldName];
          const uploadResp = {
            status: data.response.status,
            body,
            uploadURL
          };
          this.uppy.emit('upload-success', file, uploadResp);
          queuedRequest.done();

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          return resolve();
        });
        socket.on('error', errData => {
          const resp = errData.response;
          const error = resp ? opts.getResponseError(resp.responseText, resp) : Object.assign(new Error(errData.error.message), {
            cause: errData.error
          });
          this.uppy.emit('upload-error', file, error);
          queuedRequest.done();

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          reject(error);
        });
        const queuedRequest = this.requests.run(() => {
          socket.open();

          if (file.isPaused) {
            socket.send('pause', {});
          }

          return () => socket.close();
        });
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }

  uploadBundle(files) {
    return new Promise((resolve, reject) => {
      const {
        endpoint
      } = this.opts;
      const {
        method
      } = this.opts;
      const optsFromState = this.uppy.getState().xhrUpload;
      const formData = this.createBundledUpload(files, { ...this.opts,
        ...(optsFromState || {})
      });
      const xhr = new XMLHttpRequest();
      const timer = new ProgressTimeout(this.opts.timeout, () => {
        xhr.abort();
        const error = new Error(this.i18n('timedOut', {
          seconds: Math.ceil(this.opts.timeout / 1000)
        }));
        emitError(error);
        reject(error);
      });

      const emitError = error => {
        files.forEach(file => {
          this.uppy.emit('upload-error', file, error);
        });
      };

      xhr.upload.addEventListener('loadstart', () => {
        this.uppy.log('[XHRUpload] started uploading bundle');
        timer.progress();
      });
      xhr.upload.addEventListener('progress', ev => {
        timer.progress();
        if (!ev.lengthComputable) return;
        files.forEach(file => {
          this.uppy.emit('upload-progress', file, {
            uploader: this,
            bytesUploaded: ev.loaded / ev.total * file.size,
            bytesTotal: file.size
          });
        });
      });
      xhr.addEventListener('load', ev => {
        timer.done();

        if (this.opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          const body = this.opts.getResponseData(xhr.responseText, xhr);
          const uploadResp = {
            status: ev.target.status,
            body
          };
          files.forEach(file => {
            this.uppy.emit('upload-success', file, uploadResp);
          });
          return resolve();
        }

        const error = this.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        error.request = xhr;
        emitError(error);
        return reject(error);
      });
      xhr.addEventListener('error', () => {
        timer.done();
        const error = this.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        emitError(error);
        return reject(error);
      });
      this.uppy.on('cancel-all', () => {
        timer.done();
        xhr.abort();
      });
      xhr.open(method.toUpperCase(), endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = this.opts.withCredentials;

      if (this.opts.responseType !== '') {
        xhr.responseType = this.opts.responseType;
      }

      Object.keys(this.opts.headers).forEach(header => {
        xhr.setRequestHeader(header, this.opts.headers[header]);
      });
      xhr.send(formData);
      files.forEach(file => {
        this.uppy.emit('upload-started', file);
      });
    });
  }

  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = parseInt(i, 10) + 1;
      const total = files.length;

      if (file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        return this.uploadRemote(file, current, total);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }

  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }

  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }

  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[XHRUpload] No files to upload!');
      return Promise.resolve();
    } // No limit configured by the user, and no RateLimitedQueue passed in by a "parent" plugin
    // (basically just AwsS3) using the internal symbol


    if (this.opts.limit === 0 && !this.opts[internalRateLimitedQueue]) {
      this.uppy.log('[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0', 'warning');
    }

    this.uppy.log('[XHRUpload] Uploading...');
    const files = fileIDs.map(fileID => this.uppy.getFile(fileID));

    if (this.opts.bundle) {
      // if bundle: true, we don’t support remote uploads
      const isSomeFileRemote = files.some(file => file.isRemote);

      if (isSomeFileRemote) {
        throw new Error('Can’t upload remote files when the `bundle: true` option is set');
      }

      if (typeof this.opts.headers === 'function') {
        throw new TypeError('`headers` may not be a function when the `bundle: true` option is set');
      }

      return this.uploadBundle(files);
    }

    return this.uploadFiles(files).then(() => null);
  }

  install() {
    if (this.opts.bundle) {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          individualCancellation: false
        }
      });
    }

    this.uppy.addUploader(this.handleUpload);
  }

  uninstall() {
    if (this.opts.bundle) {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          individualCancellation: true
        }
      });
    }

    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.0.3", _temp);

},{"./../../companion-client":13,"./../../core/lib/BasePlugin":17,"./../../utils/lib/EventTracker":27,"./../../utils/lib/NetworkError":28,"./../../utils/lib/ProgressTimeout":29,"./../../utils/lib/RateLimitedQueue":30,"./../../utils/lib/emitSocketProgress":32,"./../../utils/lib/getSocketHost":38,"./../../utils/lib/isNetworkError":42,"./../../utils/lib/settle":44,"nanoid":46}],49:[function(require,module,exports){
"use strict";

const Uppy = require('./../../../../packages/@uppy/core');

const FileInput = require('./../../../../packages/@uppy/file-input');

const XHRUpload = require('./../../../../packages/@uppy/xhr-upload');

const ProgressBar = require('./../../../../packages/@uppy/progress-bar');

document.querySelector('.Uppy').innerHTML = '';
const uppy = new Uppy({
  debug: true,
  autoProceed: true
});
uppy.use(FileInput, {
  target: '.Uppy'
});
uppy.use(ProgressBar, {
  target: '.UppyProgressBar',
  hideAfterFinish: false
});
uppy.use(XHRUpload, {
  endpoint: 'https://xhr-server.herokuapp.com/upload',
  formData: true,
  fieldName: 'files[]'
}); // And display uploaded files

uppy.on('upload-success', (file, response) => {
  const url = response.uploadURL;
  const fileName = file.name;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.appendChild(document.createTextNode(fileName));
  li.appendChild(a);
  document.querySelector('.uploaded-files ol').appendChild(li);
});

},{"./../../../../packages/@uppy/core":21,"./../../../../packages/@uppy/file-input":24,"./../../../../packages/@uppy/progress-bar":25,"./../../../../packages/@uppy/xhr-upload":48}]},{},[49])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL21pbWUtbWF0Y2gvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbmFtZXNwYWNlLWVtaXR0ZXIvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi4uL25vZGVfbW9kdWxlcy93aWxkY2FyZC9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL0F1dGhFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1Byb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUmVxdWVzdENsaWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1NlYXJjaFByb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU29ja2V0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy90b2tlblN0b3JhZ2UuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5janMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmNqcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL0Jhc2VQbHVnaW4uanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9VSVBsdWdpbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL1VwcHkuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9nZXRGaWxlTmFtZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvbG9nZ2Vycy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL3N1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9maWxlLWlucHV0L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3Byb2dyZXNzLWJhci9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdG9yZS1kZWZhdWx0L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9FdmVudFRyYWNrZXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvTmV0d29ya0Vycm9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL1Byb2dyZXNzVGltZW91dC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9SYXRlTGltaXRlZFF1ZXVlLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL1RyYW5zbGF0b3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZW1pdFNvY2tldFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2ZldGNoV2l0aE5ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9maW5kRE9NRWxlbWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZW5lcmF0ZUZpbGVJRC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlVHlwZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRTb2NrZXRIb3N0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFRpbWVTdGFtcC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9oYXNQcm9wZXJ0eS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc0RPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaXNOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvbWltZVR5cGVzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3NldHRsZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy90b0FycmF5LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkveGhyLXVwbG9hZC9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmJyb3dzZXIuY2pzIiwiLi4vcGFja2FnZXMvQHVwcHkveGhyLXVwbG9hZC9zcmMvaW5kZXguanMiLCJzcmMvZXhhbXBsZXMveGhydXBsb2FkL2FwcC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LEdBQUwsQ0FBUyxTQUFULEVBQW9CO0FBQ2xCLEVBQUEsUUFBUSxFQUFFLHlDQURRO0FBRWxCLEVBQUEsUUFBUSxFQUFFLElBRlE7QUFHbEIsRUFBQSxTQUFTLEVBQUU7QUFITyxDQUFwQixFLENBTUE7O0FBQ0EsSUFBSSxDQUFDLEVBQUwsQ0FBUSxnQkFBUixFQUEwQixDQUFDLElBQUQsRUFBTyxRQUFQLEtBQW9CO0FBQzVDLFFBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxTQUFyQjtBQUNBLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUF0QjtBQUVBLFFBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQVg7QUFDQSxRQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QixDQUFWO0FBQ0EsRUFBQSxDQUFDLENBQUMsSUFBRixHQUFTLEdBQVQ7QUFDQSxFQUFBLENBQUMsQ0FBQyxNQUFGLEdBQVcsUUFBWDtBQUNBLEVBQUEsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxRQUFRLENBQUMsY0FBVCxDQUF3QixRQUF4QixDQUFkO0FBQ0EsRUFBQSxFQUFFLENBQUMsV0FBSCxDQUFlLENBQWY7QUFFQSxFQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxXQUE3QyxDQUF5RCxFQUF6RDtBQUNELENBWkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZsZXQvcHJldHRpZXItYnl0ZXMvXG4vLyBDaGFuZ2luZyAxMDAwIGJ5dGVzIHRvIDEwMjQsIHNvIHdlIGNhbiBrZWVwIHVwcGVyY2FzZSBLQiB2cyBrQlxuLy8gSVNDIExpY2Vuc2UgKGMpIERhbiBGbGV0dHJlIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL2Jsb2IvbWFzdGVyL0xJQ0VOU0Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJldHRpZXJCeXRlcyAobnVtKSB7XG4gIGlmICh0eXBlb2YgbnVtICE9PSAnbnVtYmVyJyB8fCBpc05hTihudW0pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBudW1iZXIsIGdvdCAnICsgdHlwZW9mIG51bSlcbiAgfVxuXG4gIHZhciBuZWcgPSBudW0gPCAwXG4gIHZhciB1bml0cyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddXG5cbiAgaWYgKG5lZykge1xuICAgIG51bSA9IC1udW1cbiAgfVxuXG4gIGlmIChudW0gPCAxKSB7XG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0gKyAnIEInXG4gIH1cblxuICB2YXIgZXhwb25lbnQgPSBNYXRoLm1pbihNYXRoLmZsb29yKE1hdGgubG9nKG51bSkgLyBNYXRoLmxvZygxMDI0KSksIHVuaXRzLmxlbmd0aCAtIDEpXG4gIG51bSA9IE51bWJlcihudW0gLyBNYXRoLnBvdygxMDI0LCBleHBvbmVudCkpXG4gIHZhciB1bml0ID0gdW5pdHNbZXhwb25lbnRdXG5cbiAgaWYgKG51bSA+PSAxMCB8fCBudW0gJSAxID09PSAwKSB7XG4gICAgLy8gRG8gbm90IHNob3cgZGVjaW1hbHMgd2hlbiB0aGUgbnVtYmVyIGlzIHR3by1kaWdpdCwgb3IgaWYgdGhlIG51bWJlciBoYXMgbm9cbiAgICAvLyBkZWNpbWFsIGNvbXBvbmVudC5cbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDApICsgJyAnICsgdW5pdFxuICB9IGVsc2Uge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtLnRvRml4ZWQoMSkgKyAnICcgKyB1bml0XG4gIH1cbn1cbiIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiIsInZhciB3aWxkY2FyZCA9IHJlcXVpcmUoJ3dpbGRjYXJkJyk7XG52YXIgcmVNaW1lUGFydFNwbGl0ID0gL1tcXC9cXCtcXC5dLztcblxuLyoqXG4gICMgbWltZS1tYXRjaFxuXG4gIEEgc2ltcGxlIGZ1bmN0aW9uIHRvIGNoZWNrZXIgd2hldGhlciBhIHRhcmdldCBtaW1lIHR5cGUgbWF0Y2hlcyBhIG1pbWUtdHlwZVxuICBwYXR0ZXJuIChlLmcuIGltYWdlL2pwZWcgbWF0Y2hlcyBpbWFnZS9qcGVnIE9SIGltYWdlLyopLlxuXG4gICMjIEV4YW1wbGUgVXNhZ2VcblxuICA8PDwgZXhhbXBsZS5qc1xuXG4qKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBwYXR0ZXJuKSB7XG4gIGZ1bmN0aW9uIHRlc3QocGF0dGVybikge1xuICAgIHZhciByZXN1bHQgPSB3aWxkY2FyZChwYXR0ZXJuLCB0YXJnZXQsIHJlTWltZVBhcnRTcGxpdCk7XG5cbiAgICAvLyBlbnN1cmUgdGhhdCB3ZSBoYXZlIGEgdmFsaWQgbWltZSB0eXBlIChzaG91bGQgaGF2ZSB0d28gcGFydHMpXG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID49IDI7XG4gIH1cblxuICByZXR1cm4gcGF0dGVybiA/IHRlc3QocGF0dGVybi5zcGxpdCgnOycpWzBdKSA6IHRlc3Q7XG59O1xuIiwiLyoqXG4qIENyZWF0ZSBhbiBldmVudCBlbWl0dGVyIHdpdGggbmFtZXNwYWNlc1xuKiBAbmFtZSBjcmVhdGVOYW1lc3BhY2VFbWl0dGVyXG4qIEBleGFtcGxlXG4qIHZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9pbmRleCcpKClcbipcbiogZW1pdHRlci5vbignKicsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnYWxsIGV2ZW50cyBlbWl0dGVkJywgdGhpcy5ldmVudClcbiogfSlcbipcbiogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnZXhhbXBsZSBldmVudCBlbWl0dGVkJylcbiogfSlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXIgKCkge1xuICB2YXIgZW1pdHRlciA9IHt9XG4gIHZhciBfZm5zID0gZW1pdHRlci5fZm5zID0ge31cblxuICAvKipcbiAgKiBFbWl0IGFuIGV2ZW50LiBPcHRpb25hbGx5IG5hbWVzcGFjZSB0aGUgZXZlbnQuIEhhbmRsZXJzIGFyZSBmaXJlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSB3ZXJlIGFkZGVkIHdpdGggZXhhY3QgbWF0Y2hlcyB0YWtpbmcgcHJlY2VkZW5jZS4gU2VwYXJhdGUgdGhlIG5hbWVzcGFjZSBhbmQgZXZlbnQgd2l0aCBhIGA6YFxuICAqIEBuYW1lIGVtaXRcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQg4oCTIHRoZSBuYW1lIG9mIHRoZSBldmVudCwgd2l0aCBvcHRpb25hbCBuYW1lc3BhY2VcbiAgKiBAcGFyYW0gey4uLip9IGRhdGEg4oCTIHVwIHRvIDYgYXJndW1lbnRzIHRoYXQgYXJlIHBhc3NlZCB0byB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIuZW1pdCgnZXhhbXBsZScpXG4gICogZW1pdHRlci5lbWl0KCdkZW1vOnRlc3QnKVxuICAqIGVtaXR0ZXIuZW1pdCgnZGF0YScsIHsgZXhhbXBsZTogdHJ1ZX0sICdhIHN0cmluZycsIDEpXG4gICovXG4gIGVtaXR0ZXIuZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKGV2ZW50LCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2KSB7XG4gICAgdmFyIHRvRW1pdCA9IGdldExpc3RlbmVycyhldmVudClcblxuICAgIGlmICh0b0VtaXQubGVuZ3RoKSB7XG4gICAgICBlbWl0QWxsKGV2ZW50LCB0b0VtaXQsIFthcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2XSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGUgZW4gZXZlbnQgbGlzdGVuZXIuXG4gICogQG5hbWUgb25cbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub24oJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbiA9IGZ1bmN0aW9uIG9uIChldmVudCwgZm4pIHtcbiAgICBpZiAoIV9mbnNbZXZlbnRdKSB7XG4gICAgICBfZm5zW2V2ZW50XSA9IFtdXG4gICAgfVxuXG4gICAgX2Zuc1tldmVudF0ucHVzaChmbilcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lciB0aGF0IGZpcmVzIG9uY2UuXG4gICogQG5hbWUgb25jZVxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uY2UoJ2V4YW1wbGUnLCBmdW5jdGlvbiAoKSB7fSlcbiAgKiBlbWl0dGVyLm9uY2UoJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbmNlID0gZnVuY3Rpb24gb25jZSAoZXZlbnQsIGZuKSB7XG4gICAgZnVuY3Rpb24gb25lICgpIHtcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIGVtaXR0ZXIub2ZmKGV2ZW50LCBvbmUpXG4gICAgfVxuICAgIHRoaXMub24oZXZlbnQsIG9uZSlcbiAgfVxuXG4gIC8qKlxuICAqIFN0b3AgbGlzdGVuaW5nIHRvIGFuIGV2ZW50LiBTdG9wIGFsbCBsaXN0ZW5lcnMgb24gYW4gZXZlbnQgYnkgb25seSBwYXNzaW5nIHRoZSBldmVudCBuYW1lLiBTdG9wIGEgc2luZ2xlIGxpc3RlbmVyIGJ5IHBhc3NpbmcgdGhhdCBldmVudCBoYW5kbGVyIGFzIGEgY2FsbGJhY2suXG4gICogWW91IG11c3QgYmUgZXhwbGljaXQgYWJvdXQgd2hhdCB3aWxsIGJlIHVuc3Vic2NyaWJlZDogYGVtaXR0ZXIub2ZmKCdkZW1vJylgIHdpbGwgdW5zdWJzY3JpYmUgYW4gYGVtaXR0ZXIub24oJ2RlbW8nKWAgbGlzdGVuZXIsXG4gICogYGVtaXR0ZXIub2ZmKCdkZW1vOmV4YW1wbGUnKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbzpleGFtcGxlJylgIGxpc3RlbmVyXG4gICogQG5hbWUgb2ZmXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXSDigJMgdGhlIHNwZWNpZmljIGhhbmRsZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub2ZmKCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLm9mZignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9mZiA9IGZ1bmN0aW9uIG9mZiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIGtlZXAgPSBbXVxuXG4gICAgaWYgKGV2ZW50ICYmIGZuKSB7XG4gICAgICB2YXIgZm5zID0gdGhpcy5fZm5zW2V2ZW50XVxuICAgICAgdmFyIGkgPSAwXG4gICAgICB2YXIgbCA9IGZucyA/IGZucy5sZW5ndGggOiAwXG5cbiAgICAgIGZvciAoaTsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikge1xuICAgICAgICAgIGtlZXAucHVzaChmbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBrZWVwLmxlbmd0aCA/IHRoaXMuX2Zuc1tldmVudF0gPSBrZWVwIDogZGVsZXRlIHRoaXMuX2Zuc1tldmVudF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyAoZSkge1xuICAgIHZhciBvdXQgPSBfZm5zW2VdID8gX2Zuc1tlXSA6IFtdXG4gICAgdmFyIGlkeCA9IGUuaW5kZXhPZignOicpXG4gICAgdmFyIGFyZ3MgPSAoaWR4ID09PSAtMSkgPyBbZV0gOiBbZS5zdWJzdHJpbmcoMCwgaWR4KSwgZS5zdWJzdHJpbmcoaWR4ICsgMSldXG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9mbnMpXG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgaWYgKGtleSA9PT0gJyonKSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiYgYXJnc1swXSA9PT0ga2V5KSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRBbGwgKGUsIGZucywgYXJncykge1xuICAgIHZhciBpID0gMFxuICAgIHZhciBsID0gZm5zLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoIWZuc1tpXSkgYnJlYWtcbiAgICAgIGZuc1tpXS5ldmVudCA9IGVcbiAgICAgIGZuc1tpXS5hcHBseShmbnNbaV0sIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVtaXR0ZXJcbn1cbiIsInZhciBuLGwsdSx0LGksbyxyLGYsZT17fSxjPVtdLHM9L2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxncmlkfG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmR8aXRlcmEvaTtmdW5jdGlvbiBhKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIHAobil7dmFyIGw9bi5wYXJlbnROb2RlO2wmJmwucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gdihsLHUsdCl7dmFyIGksbyxyLGY9e307Zm9yKHIgaW4gdSlcImtleVwiPT1yP2k9dVtyXTpcInJlZlwiPT1yP289dVtyXTpmW3JdPXVbcl07aWYoYXJndW1lbnRzLmxlbmd0aD4yJiYoZi5jaGlsZHJlbj1hcmd1bWVudHMubGVuZ3RoPjM/bi5jYWxsKGFyZ3VtZW50cywyKTp0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsJiZudWxsIT1sLmRlZmF1bHRQcm9wcylmb3IociBpbiBsLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1mW3JdJiYoZltyXT1sLmRlZmF1bHRQcm9wc1tyXSk7cmV0dXJuIGgobCxmLGksbyxudWxsKX1mdW5jdGlvbiBoKG4sdCxpLG8scil7dmFyIGY9e3R5cGU6bixwcm9wczp0LGtleTppLHJlZjpvLF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19kOnZvaWQgMCxfX2M6bnVsbCxfX2g6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Om51bGw9PXI/Kyt1OnJ9O3JldHVybiBudWxsIT1sLnZub2RlJiZsLnZub2RlKGYpLGZ9ZnVuY3Rpb24geShuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiBkKG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIF8obixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP18obi5fXyxuLl9fLl9fay5pbmRleE9mKG4pKzEpOm51bGw7Zm9yKHZhciB1O2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXJldHVybiB1Ll9fZTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGU/XyhuKTpudWxsfWZ1bmN0aW9uIGsobil7dmFyIGwsdTtpZihudWxsIT0obj1uLl9fKSYmbnVsbCE9bi5fX2Mpe2ZvcihuLl9fZT1uLl9fYy5iYXNlPW51bGwsbD0wO2w8bi5fX2subGVuZ3RoO2wrKylpZihudWxsIT0odT1uLl9fa1tsXSkmJm51bGwhPXUuX19lKXtuLl9fZT1uLl9fYy5iYXNlPXUuX19lO2JyZWFrfXJldHVybiBrKG4pfX1mdW5jdGlvbiB4KG4peyghbi5fX2QmJihuLl9fZD0hMCkmJmkucHVzaChuKSYmIWIuX19yKyt8fHIhPT1sLmRlYm91bmNlUmVuZGVyaW5nKSYmKChyPWwuZGVib3VuY2VSZW5kZXJpbmcpfHxvKShiKX1mdW5jdGlvbiBiKCl7Zm9yKHZhciBuO2IuX19yPWkubGVuZ3RoOyluPWkuc29ydChmdW5jdGlvbihuLGwpe3JldHVybiBuLl9fdi5fX2ItbC5fX3YuX19ifSksaT1bXSxuLnNvbWUoZnVuY3Rpb24obil7dmFyIGwsdSx0LGksbyxyO24uX19kJiYobz0oaT0obD1uKS5fX3YpLl9fZSwocj1sLl9fUCkmJih1PVtdLCh0PWEoe30saSkpLl9fdj1pLl9fdisxLEkocixpLHQsbC5fX24sdm9pZCAwIT09ci5vd25lclNWR0VsZW1lbnQsbnVsbCE9aS5fX2g/W29dOm51bGwsdSxudWxsPT1vP18oaSk6byxpLl9faCksVCh1LGkpLGkuX19lIT1vJiZrKGkpKSl9KX1mdW5jdGlvbiBtKG4sbCx1LHQsaSxvLHIsZixzLGEpe3ZhciBwLHYsZCxrLHgsYixtLEE9dCYmdC5fX2t8fGMsUD1BLmxlbmd0aDtmb3IodS5fX2s9W10scD0wO3A8bC5sZW5ndGg7cCsrKWlmKG51bGwhPShrPXUuX19rW3BdPW51bGw9PShrPWxbcF0pfHxcImJvb2xlYW5cIj09dHlwZW9mIGs/bnVsbDpcInN0cmluZ1wiPT10eXBlb2Yga3x8XCJudW1iZXJcIj09dHlwZW9mIGt8fFwiYmlnaW50XCI9PXR5cGVvZiBrP2gobnVsbCxrLG51bGwsbnVsbCxrKTpBcnJheS5pc0FycmF5KGspP2goeSx7Y2hpbGRyZW46a30sbnVsbCxudWxsLG51bGwpOmsuX19iPjA/aChrLnR5cGUsay5wcm9wcyxrLmtleSxudWxsLGsuX192KTprKSl7aWYoay5fXz11LGsuX19iPXUuX19iKzEsbnVsbD09PShkPUFbcF0pfHxkJiZrLmtleT09ZC5rZXkmJmsudHlwZT09PWQudHlwZSlBW3BdPXZvaWQgMDtlbHNlIGZvcih2PTA7djxQO3YrKyl7aWYoKGQ9QVt2XSkmJmsua2V5PT1kLmtleSYmay50eXBlPT09ZC50eXBlKXtBW3ZdPXZvaWQgMDticmVha31kPW51bGx9SShuLGssZD1kfHxlLGksbyxyLGYscyxhKSx4PWsuX19lLCh2PWsucmVmKSYmZC5yZWYhPXYmJihtfHwobT1bXSksZC5yZWYmJm0ucHVzaChkLnJlZixudWxsLGspLG0ucHVzaCh2LGsuX19jfHx4LGspKSxudWxsIT14PyhudWxsPT1iJiYoYj14KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBrLnR5cGUmJm51bGwhPWsuX19rJiZrLl9faz09PWQuX19rP2suX19kPXM9ZyhrLHMsbik6cz13KG4sayxkLEEseCxzKSxhfHxcIm9wdGlvblwiIT09dS50eXBlP1wiZnVuY3Rpb25cIj09dHlwZW9mIHUudHlwZSYmKHUuX19kPXMpOm4udmFsdWU9XCJcIik6cyYmZC5fX2U9PXMmJnMucGFyZW50Tm9kZSE9biYmKHM9XyhkKSl9Zm9yKHUuX19lPWIscD1QO3AtLTspbnVsbCE9QVtwXSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHUudHlwZSYmbnVsbCE9QVtwXS5fX2UmJkFbcF0uX19lPT11Ll9fZCYmKHUuX19kPV8odCxwKzEpKSxMKEFbcF0sQVtwXSkpO2lmKG0pZm9yKHA9MDtwPG0ubGVuZ3RoO3ArKyl6KG1bcF0sbVsrK3BdLG1bKytwXSl9ZnVuY3Rpb24gZyhuLGwsdSl7dmFyIHQsaTtmb3IodD0wO3Q8bi5fX2subGVuZ3RoO3QrKykoaT1uLl9fa1t0XSkmJihpLl9fPW4sbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpLnR5cGU/ZyhpLGwsdSk6dyh1LGksaSxuLl9fayxpLl9fZSxsKSk7cmV0dXJuIGx9ZnVuY3Rpb24gdyhuLGwsdSx0LGksbyl7dmFyIHIsZixlO2lmKHZvaWQgMCE9PWwuX19kKXI9bC5fX2QsbC5fX2Q9dm9pZCAwO2Vsc2UgaWYobnVsbD09dXx8aSE9b3x8bnVsbD09aS5wYXJlbnROb2RlKW46aWYobnVsbD09b3x8by5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKGkpLHI9bnVsbDtlbHNle2ZvcihmPW8sZT0wOyhmPWYubmV4dFNpYmxpbmcpJiZlPHQubGVuZ3RoO2UrPTIpaWYoZj09aSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKGksbykscj1vfXJldHVybiB2b2lkIDAhPT1yP3I6aS5uZXh0U2libGluZ31mdW5jdGlvbiBBKG4sbCx1LHQsaSl7dmFyIG87Zm9yKG8gaW4gdSlcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8byBpbiBsfHxDKG4sbyxudWxsLHVbb10sdCk7Zm9yKG8gaW4gbClpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW29dfHxcImNoaWxkcmVuXCI9PT1vfHxcImtleVwiPT09b3x8XCJ2YWx1ZVwiPT09b3x8XCJjaGVja2VkXCI9PT1vfHx1W29dPT09bFtvXXx8QyhuLG8sbFtvXSx1W29dLHQpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1udWxsPT11P1wiXCI6XCJudW1iZXJcIiE9dHlwZW9mIHV8fHMudGVzdChsKT91OnUrXCJweFwifWZ1bmN0aW9uIEMobixsLHUsdCxpKXt2YXIgbztuOmlmKFwic3R5bGVcIj09PWwpaWYoXCJzdHJpbmdcIj09dHlwZW9mIHUpbi5zdHlsZS5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgdCYmKG4uc3R5bGUuY3NzVGV4dD10PVwiXCIpLHQpZm9yKGwgaW4gdCl1JiZsIGluIHV8fFAobi5zdHlsZSxsLFwiXCIpO2lmKHUpZm9yKGwgaW4gdSl0JiZ1W2xdPT09dFtsXXx8UChuLnN0eWxlLGwsdVtsXSl9ZWxzZSBpZihcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXSlvPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksbD1sLnRvTG93ZXJDYXNlKClpbiBuP2wudG9Mb3dlckNhc2UoKS5zbGljZSgyKTpsLnNsaWNlKDIpLG4ubHx8KG4ubD17fSksbi5sW2wrb109dSx1P3R8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLG8/SDokLG8pOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLG8/SDokLG8pO2Vsc2UgaWYoXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCl7aWYoaSlsPWwucmVwbGFjZSgveGxpbmtbSDpoXS8sXCJoXCIpLnJlcGxhY2UoL3NOYW1lJC8sXCJzXCIpO2Vsc2UgaWYoXCJocmVmXCIhPT1sJiZcImxpc3RcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0YWJJbmRleFwiIT09bCYmXCJkb3dubG9hZFwiIT09bCYmbCBpbiBuKXRyeXtuW2xdPW51bGw9PXU/XCJcIjp1O2JyZWFrIG59Y2F0Y2gobil7fVwiZnVuY3Rpb25cIj09dHlwZW9mIHV8fChudWxsIT11JiYoITEhPT11fHxcImFcIj09PWxbMF0mJlwiclwiPT09bFsxXSk/bi5zZXRBdHRyaWJ1dGUobCx1KTpuLnJlbW92ZUF0dHJpYnV0ZShsKSl9fWZ1bmN0aW9uICQobil7dGhpcy5sW24udHlwZSshMV0obC5ldmVudD9sLmV2ZW50KG4pOm4pfWZ1bmN0aW9uIEgobil7dGhpcy5sW24udHlwZSshMF0obC5ldmVudD9sLmV2ZW50KG4pOm4pfWZ1bmN0aW9uIEkobix1LHQsaSxvLHIsZixlLGMpe3ZhciBzLHAsdixoLF8sayx4LGIsZyx3LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDtudWxsIT10Ll9faCYmKGM9dC5fX2gsZT11Ll9fZT10Ll9fZSx1Ll9faD1udWxsLHI9W2VdKSwocz1sLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoYj11LnByb3BzLGc9KHM9UC5jb250ZXh0VHlwZSkmJmlbcy5fX2NdLHc9cz9nP2cucHJvcHMudmFsdWU6cy5fXzppLHQuX19jP3g9KHA9dS5fX2M9dC5fX2MpLl9fPXAuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXA9bmV3IFAoYix3KToodS5fX2M9cD1uZXcgZChiLHcpLHAuY29uc3RydWN0b3I9UCxwLnJlbmRlcj1NKSxnJiZnLnN1YihwKSxwLnByb3BzPWIscC5zdGF0ZXx8KHAuc3RhdGU9e30pLHAuY29udGV4dD13LHAuX19uPWksdj1wLl9fZD0hMCxwLl9faD1bXSksbnVsbD09cC5fX3MmJihwLl9fcz1wLnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHAuX19zPT1wLnN0YXRlJiYocC5fX3M9YSh7fSxwLl9fcykpLGEocC5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoYixwLl9fcykpKSxoPXAucHJvcHMsXz1wLnN0YXRlLHYpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXAuY29tcG9uZW50V2lsbE1vdW50JiZwLmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXAuY29tcG9uZW50RGlkTW91bnQmJnAuX19oLnB1c2gocC5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmYiE9PWgmJm51bGwhPXAuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmcC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGIsdyksIXAuX19lJiZudWxsIT1wLnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT1wLnNob3VsZENvbXBvbmVudFVwZGF0ZShiLHAuX19zLHcpfHx1Ll9fdj09PXQuX192KXtwLnByb3BzPWIscC5zdGF0ZT1wLl9fcyx1Ll9fdiE9PXQuX192JiYocC5fX2Q9ITEpLHAuX192PXUsdS5fX2U9dC5fX2UsdS5fX2s9dC5fX2ssdS5fX2suZm9yRWFjaChmdW5jdGlvbihuKXtuJiYobi5fXz11KX0pLHAuX19oLmxlbmd0aCYmZi5wdXNoKHApO2JyZWFrIG59bnVsbCE9cC5jb21wb25lbnRXaWxsVXBkYXRlJiZwLmNvbXBvbmVudFdpbGxVcGRhdGUoYixwLl9fcyx3KSxudWxsIT1wLmNvbXBvbmVudERpZFVwZGF0ZSYmcC5fX2gucHVzaChmdW5jdGlvbigpe3AuY29tcG9uZW50RGlkVXBkYXRlKGgsXyxrKX0pfXAuY29udGV4dD13LHAucHJvcHM9YixwLnN0YXRlPXAuX19zLChzPWwuX19yKSYmcyh1KSxwLl9fZD0hMSxwLl9fdj11LHAuX19QPW4scz1wLnJlbmRlcihwLnByb3BzLHAuc3RhdGUscC5jb250ZXh0KSxwLnN0YXRlPXAuX19zLG51bGwhPXAuZ2V0Q2hpbGRDb250ZXh0JiYoaT1hKGEoe30saSkscC5nZXRDaGlsZENvbnRleHQoKSkpLHZ8fG51bGw9PXAuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fChrPXAuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUoaCxfKSksQT1udWxsIT1zJiZzLnR5cGU9PT15JiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOnMsbShuLEFycmF5LmlzQXJyYXkoQSk/QTpbQV0sdSx0LGksbyxyLGYsZSxjKSxwLmJhc2U9dS5fX2UsdS5fX2g9bnVsbCxwLl9faC5sZW5ndGgmJmYucHVzaChwKSx4JiYocC5fX0U9cC5fXz1udWxsKSxwLl9fZT0hMX1lbHNlIG51bGw9PXImJnUuX192PT09dC5fX3Y/KHUuX19rPXQuX19rLHUuX19lPXQuX19lKTp1Ll9fZT1qKHQuX19lLHUsdCxpLG8scixmLGMpOyhzPWwuZGlmZmVkKSYmcyh1KX1jYXRjaChuKXt1Ll9fdj1udWxsLChjfHxudWxsIT1yKSYmKHUuX19lPWUsdS5fX2g9ISFjLHJbci5pbmRleE9mKGUpXT1udWxsKSxsLl9fZShuLHUsdCl9fWZ1bmN0aW9uIFQobix1KXtsLl9fYyYmbC5fX2ModSxuKSxuLnNvbWUoZnVuY3Rpb24odSl7dHJ5e249dS5fX2gsdS5fX2g9W10sbi5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKG4pe2wuX19lKG4sdS5fX3YpfX0pfWZ1bmN0aW9uIGoobCx1LHQsaSxvLHIsZixjKXt2YXIgcyxhLHYsaD10LnByb3BzLHk9dS5wcm9wcyxkPXUudHlwZSxrPTA7aWYoXCJzdmdcIj09PWQmJihvPSEwKSxudWxsIT1yKWZvcig7azxyLmxlbmd0aDtrKyspaWYoKHM9cltrXSkmJihzPT09bHx8KGQ/cy5sb2NhbE5hbWU9PWQ6Mz09cy5ub2RlVHlwZSkpKXtsPXMscltrXT1udWxsO2JyZWFrfWlmKG51bGw9PWwpe2lmKG51bGw9PT1kKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh5KTtsPW8/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixkKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGQseS5pcyYmeSkscj1udWxsLGM9ITF9aWYobnVsbD09PWQpaD09PXl8fGMmJmwuZGF0YT09PXl8fChsLmRhdGE9eSk7ZWxzZXtpZihyPXImJm4uY2FsbChsLmNoaWxkTm9kZXMpLGE9KGg9dC5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsdj15LmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFjKXtpZihudWxsIT1yKWZvcihoPXt9LGs9MDtrPGwuYXR0cmlidXRlcy5sZW5ndGg7aysrKWhbbC5hdHRyaWJ1dGVzW2tdLm5hbWVdPWwuYXR0cmlidXRlc1trXS52YWx1ZTsodnx8YSkmJih2JiYoYSYmdi5fX2h0bWw9PWEuX19odG1sfHx2Ll9faHRtbD09PWwuaW5uZXJIVE1MKXx8KGwuaW5uZXJIVE1MPXYmJnYuX19odG1sfHxcIlwiKSl9aWYoQShsLHksaCxvLGMpLHYpdS5fX2s9W107ZWxzZSBpZihrPXUucHJvcHMuY2hpbGRyZW4sbShsLEFycmF5LmlzQXJyYXkoayk/azpba10sdSx0LGksbyYmXCJmb3JlaWduT2JqZWN0XCIhPT1kLHIsZixyP3JbMF06dC5fX2smJl8odCwwKSxjKSxudWxsIT1yKWZvcihrPXIubGVuZ3RoO2stLTspbnVsbCE9cltrXSYmcChyW2tdKTtjfHwoXCJ2YWx1ZVwiaW4geSYmdm9pZCAwIT09KGs9eS52YWx1ZSkmJihrIT09bC52YWx1ZXx8XCJwcm9ncmVzc1wiPT09ZCYmIWspJiZDKGwsXCJ2YWx1ZVwiLGssaC52YWx1ZSwhMSksXCJjaGVja2VkXCJpbiB5JiZ2b2lkIDAhPT0oaz15LmNoZWNrZWQpJiZrIT09bC5jaGVja2VkJiZDKGwsXCJjaGVja2VkXCIsayxoLmNoZWNrZWQsITEpKX1yZXR1cm4gbH1mdW5jdGlvbiB6KG4sdSx0KXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHUpOm4uY3VycmVudD11fWNhdGNoKG4pe2wuX19lKG4sdCl9fWZ1bmN0aW9uIEwobix1LHQpe3ZhciBpLG87aWYobC51bm1vdW50JiZsLnVubW91bnQobiksKGk9bi5yZWYpJiYoaS5jdXJyZW50JiZpLmN1cnJlbnQhPT1uLl9fZXx8eihpLG51bGwsdSkpLG51bGwhPShpPW4uX19jKSl7aWYoaS5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7aS5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKG4pe2wuX19lKG4sdSl9aS5iYXNlPWkuX19QPW51bGx9aWYoaT1uLl9faylmb3Iobz0wO288aS5sZW5ndGg7bysrKWlbb10mJkwoaVtvXSx1LFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4udHlwZSk7dHx8bnVsbD09bi5fX2V8fHAobi5fX2UpLG4uX19lPW4uX19kPXZvaWQgMH1mdW5jdGlvbiBNKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIE4odSx0LGkpe3ZhciBvLHIsZjtsLl9fJiZsLl9fKHUsdCkscj0obz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpKT9udWxsOmkmJmkuX19rfHx0Ll9fayxmPVtdLEkodCx1PSghbyYmaXx8dCkuX19rPXYoeSxudWxsLFt1XSkscnx8ZSxlLHZvaWQgMCE9PXQub3duZXJTVkdFbGVtZW50LCFvJiZpP1tpXTpyP251bGw6dC5maXJzdENoaWxkP24uY2FsbCh0LmNoaWxkTm9kZXMpOm51bGwsZiwhbyYmaT9pOnI/ci5fX2U6dC5maXJzdENoaWxkLG8pLFQoZix1KX1uPWMuc2xpY2UsbD17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LHQsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKCh0PXUuY29uc3RydWN0b3IpJiZudWxsIT10LmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKHUuc2V0U3RhdGUodC5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpLGk9dS5fX2QpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJih1LmNvbXBvbmVudERpZENhdGNoKG4pLGk9dS5fX2QpLGkpcmV0dXJuIHUuX19FPXV9Y2F0Y2gobCl7bj1sfXRocm93IG59fSx1PTAsdD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sZC5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PW51bGwhPXRoaXMuX19zJiZ0aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKGEoe30sdSksdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCkseCh0aGlzKSl9LGQucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSx4KHRoaXMpKX0sZC5wcm90b3R5cGUucmVuZGVyPXksaT1bXSxvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LGIuX19yPTAsZj0wLGV4cG9ydHMucmVuZGVyPU4sZXhwb3J0cy5oeWRyYXRlPWZ1bmN0aW9uIG4obCx1KXtOKGwsdSxuKX0sZXhwb3J0cy5jcmVhdGVFbGVtZW50PXYsZXhwb3J0cy5oPXYsZXhwb3J0cy5GcmFnbWVudD15LGV4cG9ydHMuY3JlYXRlUmVmPWZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bnVsbH19LGV4cG9ydHMuaXNWYWxpZEVsZW1lbnQ9dCxleHBvcnRzLkNvbXBvbmVudD1kLGV4cG9ydHMuY2xvbmVFbGVtZW50PWZ1bmN0aW9uKGwsdSx0KXt2YXIgaSxvLHIsZj1hKHt9LGwucHJvcHMpO2ZvcihyIGluIHUpXCJrZXlcIj09cj9pPXVbcl06XCJyZWZcIj09cj9vPXVbcl06ZltyXT11W3JdO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLGgobC50eXBlLGYsaXx8bC5rZXksb3x8bC5yZWYsbnVsbCl9LGV4cG9ydHMuY3JlYXRlQ29udGV4dD1mdW5jdGlvbihuLGwpe3ZhciB1PXtfX2M6bD1cIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgdSx0O3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KHU9W10sKHQ9e30pW2xdPXRoaXMsdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJnUuc29tZSh4KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7dS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Uuc3BsaWNlKHUuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LlByb3ZpZGVyLl9fPXUuQ29uc3VtZXIuY29udGV4dFR5cGU9dX0sZXhwb3J0cy50b0NoaWxkQXJyYXk9ZnVuY3Rpb24gbihsLHUpe3JldHVybiB1PXV8fFtdLG51bGw9PWx8fFwiYm9vbGVhblwiPT10eXBlb2YgbHx8KEFycmF5LmlzQXJyYXkobCk/bC5zb21lKGZ1bmN0aW9uKGwpe24obCx1KX0pOnUucHVzaChsKSksdX0sZXhwb3J0cy5vcHRpb25zPWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QuanMubWFwXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMgd2lsZGNhcmRcblxuICBWZXJ5IHNpbXBsZSB3aWxkY2FyZCBtYXRjaGluZywgd2hpY2ggaXMgZGVzaWduZWQgdG8gcHJvdmlkZSB0aGUgc2FtZVxuICBmdW5jdGlvbmFsaXR5IHRoYXQgaXMgZm91bmQgaW4gdGhlXG4gIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpIGV2ZW50aW5nIGxpYnJhcnkuXG5cbiAgIyMgVXNhZ2VcblxuICBJdCB3b3JrcyB3aXRoIHN0cmluZ3M6XG5cbiAgPDw8IGV4YW1wbGVzL3N0cmluZ3MuanNcblxuICBBcnJheXM6XG5cbiAgPDw8IGV4YW1wbGVzL2FycmF5cy5qc1xuXG4gIE9iamVjdHMgKG1hdGNoaW5nIGFnYWluc3Qga2V5cyk6XG5cbiAgPDw8IGV4YW1wbGVzL29iamVjdHMuanNcblxuICBXaGlsZSB0aGUgbGlicmFyeSB3b3JrcyBpbiBOb2RlLCBpZiB5b3UgYXJlIGFyZSBsb29raW5nIGZvciBmaWxlLWJhc2VkXG4gIHdpbGRjYXJkIG1hdGNoaW5nIHRoZW4geW91IHNob3VsZCBoYXZlIGEgbG9vayBhdDpcblxuICA8aHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2I+XG4qKi9cblxuZnVuY3Rpb24gV2lsZGNhcmRNYXRjaGVyKHRleHQsIHNlcGFyYXRvcikge1xuICB0aGlzLnRleHQgPSB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgdGhpcy5oYXNXaWxkID0gfnRleHQuaW5kZXhPZignKicpO1xuICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgdGhpcy5wYXJ0cyA9IHRleHQuc3BsaXQoc2VwYXJhdG9yKTtcbn1cblxuV2lsZGNhcmRNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgdmFyIHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgdmFyIGlpO1xuICB2YXIgcGFydHNDb3VudCA9IHBhcnRzLmxlbmd0aDtcbiAgdmFyIHRlc3RQYXJ0cztcblxuICBpZiAodHlwZW9mIGlucHV0ID09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc1dpbGQgJiYgdGhpcy50ZXh0ICE9IGlucHV0KSB7XG4gICAgICBtYXRjaGVzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlc3RQYXJ0cyA9IChpbnB1dCB8fCAnJykuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgICAgZm9yIChpaSA9IDA7IG1hdGNoZXMgJiYgaWkgPCBwYXJ0c0NvdW50OyBpaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpaV0gPT09ICcqJykgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpaSA8IHRlc3RQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXRjaGVzID0gcGFydHNbaWldID09PSB0ZXN0UGFydHNbaWldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXRjaGVzLCB0aGVuIHJldHVybiB0aGUgY29tcG9uZW50IHBhcnRzXG4gICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiB0ZXN0UGFydHM7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpbnB1dC5zcGxpY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hdGNoZXMgPSBbXTtcblxuICAgIGZvciAoaWkgPSBpbnB1dC5sZW5ndGg7IGlpLS07ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goaW5wdXRbaWldKSkge1xuICAgICAgICBtYXRjaGVzW21hdGNoZXMubGVuZ3RoXSA9IGlucHV0W2lpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0ID09ICdvYmplY3QnKSB7XG4gICAgbWF0Y2hlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChrZXkpKSB7XG4gICAgICAgIG1hdGNoZXNba2V5XSA9IGlucHV0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIHRlc3QsIHNlcGFyYXRvcikge1xuICB2YXIgbWF0Y2hlciA9IG5ldyBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yIHx8IC9bXFwvXFwuXS8pO1xuICBpZiAodHlwZW9mIHRlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbWF0Y2hlci5tYXRjaCh0ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICAgIHRoaXMudG9rZW5LZXkgPSBgY29tcGFuaW9uLSR7dGhpcy5wbHVnaW5JZH0tYXV0aC10b2tlbmBcbiAgICB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgPSB0aGlzLm9wdHMuY29tcGFuaW9uS2V5c1BhcmFtc1xuICAgIHRoaXMucHJlQXV0aFRva2VuID0gbnVsbFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+IHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7fVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBhdXRoSGVhZGVyc1sndXBweS1hdXRoLXRva2VuJ10gPSB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcykge1xuICAgICAgICAgIGF1dGhIZWFkZXJzWyd1cHB5LWNyZWRlbnRpYWxzLXBhcmFtcyddID0gYnRvYShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgcGFyYW1zOiB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uaGVhZGVycywgLi4uYXV0aEhlYWRlcnMgfVxuICAgICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIHJlc3BvbnNlID0gc3VwZXIub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKVxuICAgIGNvbnN0IG9sZEF1dGhlbnRpY2F0ZWQgPSBwbHVnaW4uZ2V0UGx1Z2luU3RhdGUoKS5hdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aGVudGljYXRlZCA9IG9sZEF1dGhlbnRpY2F0ZWQgPyByZXNwb25zZS5zdGF0dXMgIT09IDQwMSA6IHJlc3BvbnNlLnN0YXR1cyA8IDQwMFxuICAgIHBsdWdpbi5zZXRQbHVnaW5TdGF0ZSh7IGF1dGhlbnRpY2F0ZWQgfSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHNldEF1dGhUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnNldEl0ZW0odGhpcy50b2tlbktleSwgdG9rZW4pXG4gIH1cblxuICBnZXRBdXRoVG9rZW4gKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KVxuICB9XG5cbiAgYXV0aFVybCAocXVlcmllcyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJlQXV0aFRva2VuKSB7XG4gICAgICBxdWVyaWVzLnVwcHlQcmVBdXRoVG9rZW4gPSB0aGlzLnByZUF1dGhUb2tlblxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzLmhvc3RuYW1lfS8ke3RoaXMuaWR9L2Nvbm5lY3Q/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJpZXMpfWBcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9LyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgZmV0Y2hQcmVBdXRoVG9rZW4gKCkge1xuICAgIGlmICghdGhpcy5jb21wYW5pb25LZXlzUGFyYW1zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KGAke3RoaXMuaWR9L3ByZWF1dGgvYCwgeyBwYXJhbXM6IHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcyB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnByZUF1dGhUb2tlbiA9IHJlcy50b2tlblxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gZmV0Y2ggcHJlQXV0aFRva2VuICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgIH0pXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSksXG4gICAgICBdKSkudGhlbigoW3Jlc3BvbnNlXSkgPT4gcmVzcG9uc2UpXG4gIH1cblxuICBzdGF0aWMgaW5pdFBsdWdpbiAocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJ1xuICAgIHBsdWdpbi5maWxlcyA9IFtdXG4gICAgaWYgKGRlZmF1bHRPcHRzKSB7XG4gICAgICBwbHVnaW4ub3B0cyA9IHsgLi4uZGVmYXVsdE9wdHMsIC4uLm9wdHMgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cykge1xuICAgICAgY29uc3QgcGF0dGVybiA9IG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzXG4gICAgICAvLyB2YWxpZGF0ZSBjb21wYW5pb25BbGxvd2VkSG9zdHMgcGFyYW1cbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycgJiYgIUFycmF5LmlzQXJyYXkocGF0dGVybikgJiYgIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BsdWdpbi5pZH06IHRoZSBvcHRpb24gXCJjb21wYW5pb25BbGxvd2VkSG9zdHNcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBgKVxuICAgICAgfVxuICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gcGF0dGVyblxuICAgIH0gZWxzZSBpZiAoL14oPyFodHRwcz86XFwvXFwvKS4qJC9pLnRlc3Qob3B0cy5jb21wYW5pb25VcmwpKSB7XG4gICAgICAvLyBkb2VzIG5vdCBzdGFydCB3aXRoIGh0dHBzOi8vXG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBgaHR0cHM6Ly8ke29wdHMuY29tcGFuaW9uVXJsLnJlcGxhY2UoL15cXC9cXC8vLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBuZXcgVVJMKG9wdHMuY29tcGFuaW9uVXJsKS5vcmlnaW5cbiAgICB9XG5cbiAgICBwbHVnaW4uc3RvcmFnZSA9IHBsdWdpbi5vcHRzLnN0b3JhZ2UgfHwgdG9rZW5TdG9yYWdlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmV0Y2hXaXRoTmV0d29ya0Vycm9yJylcbmNvbnN0IEF1dGhFcnJvciA9IHJlcXVpcmUoJy4vQXV0aEVycm9yJylcblxuLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzbGFzaCBzbyB3ZSBjYW4gYWx3YXlzIHNhZmVseSBhcHBlbmQgL3h5ei5cbmZ1bmN0aW9uIHN0cmlwU2xhc2ggKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSlNPTlJlc3BvbnNlIChyZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICB9XG5cbiAgY29uc3QganNvblByb21pc2UgPSByZXMuanNvbigpXG5cbiAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+IDMwMCkge1xuICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQganNvblByb21pc2VcbiAgICAgIGVyck1zZyA9IGVyckRhdGEubWVzc2FnZSA/IGAke2Vyck1zZ30gbWVzc2FnZTogJHtlcnJEYXRhLm1lc3NhZ2V9YCA6IGVyck1zZ1xuICAgICAgZXJyTXNnID0gZXJyRGF0YS5yZXF1ZXN0SWQgPyBgJHtlcnJNc2d9IHJlcXVlc3QtSWQ6ICR7ZXJyRGF0YS5yZXF1ZXN0SWR9YCA6IGVyck1zZ1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5zYWZlLWZpbmFsbHlcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpXG4gICAgfVxuICB9XG4gIHJldHVybiBqc29uUHJvbWlzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlcXVlc3RDbGllbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgI2dldFBvc3RSZXNwb25zZUZ1bmMgPSBza2lwID0+IHJlc3BvbnNlID0+IChza2lwID8gcmVzcG9uc2UgOiB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSlcblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYWxsb3dlZEhlYWRlcnMgPSBbJ2FjY2VwdCcsICdjb250ZW50LXR5cGUnLCAndXBweS1hdXRoLXRva2VuJ11cbiAgICB0aGlzLnByZWZsaWdodERvbmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGhvc3RuYW1lICgpIHtcbiAgICBjb25zdCB7IGNvbXBhbmlvbiB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIHJldHVybiBzdHJpcFNsYXNoKGNvbXBhbmlvbiAmJiBjb21wYW5pb25baG9zdF0gPyBjb21wYW5pb25baG9zdF0gOiBob3N0KVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRIZWFkZXJzID17XG4gICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWAsXG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi5SZXF1ZXN0Q2xpZW50LmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnMsXG4gICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IHsgaGVhZGVycyB9ID0gcmVzcG9uc2VcbiAgICAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuICAgIGlmIChoZWFkZXJzLmhhcygnaS1hbScpICYmIGhlYWRlcnMuZ2V0KCdpLWFtJykgIT09IGNvbXBhbmlvbltob3N0XSkge1xuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY29tcGFuaW9uOiB7IC4uLmNvbXBhbmlvbiwgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gICNnZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgI2Vycm9ySGFuZGxlciAobWV0aG9kLCBwYXRoKSB7XG4gICAgcmV0dXJuIChlcnIpID0+IHtcbiAgICAgIGlmICghZXJyPy5pc0F1dGhFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ291bGQgbm90ICR7bWV0aG9kfSAke3RoaXMuI2dldFVybChwYXRoKX1gKVxuICAgICAgICBlcnJvci5jYXVzZSA9IGVyclxuICAgICAgICBlcnIgPSBlcnJvciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgfVxuXG4gIHByZWZsaWdodCAocGF0aCkge1xuICAgIGlmICh0aGlzLnByZWZsaWdodERvbmUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpKVxuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKVxuICAgICAgICAgICAgLnNwbGl0KCcsJykubWFwKChoZWFkZXJOYW1lKSA9PiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0ICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgICAgdGhpcy5wcmVmbGlnaHREb25lID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpXG4gICAgICB9KVxuICB9XG5cbiAgcHJlZmxpZ2h0QW5kSGVhZGVycyAocGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSlcbiAgICAgIC50aGVuKChbYWxsb3dlZEhlYWRlcnMsIGhlYWRlcnNdKSA9PiB7XG4gICAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgIGlmICghYWxsb3dlZEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgZGlzYWxsb3dlZCBoZWFkZXIgJHtoZWFkZXJ9YClcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIGNvbnN0IG1ldGhvZCA9ICdnZXQnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuI2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbihoYW5kbGVKU09OUmVzcG9uc2UpXG4gICAgICAuY2F0Y2godGhpcy4jZXJyb3JIYW5kbGVyKG1ldGhvZCwgcGF0aCkpXG4gIH1cblxuICBwb3N0IChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ3Bvc3QnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG5cbiAgZGVsZXRlIChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ2RlbGV0ZSdcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT4gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0cy5jb21wYW5pb25Db29raWVzUnVsZSB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBkYXRhID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBudWxsLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vc2VhcmNoLyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgc2VhcmNoICh0ZXh0LCBxdWVyaWVzKSB7XG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgPyBgJiR7cXVlcmllc31gIDogJydcbiAgICByZXR1cm4gdGhpcy5nZXQoYHNlYXJjaC8ke3RoaXMuaWR9L2xpc3Q/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX0ke3F1ZXJpZXN9YClcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gICNxdWV1ZWQgPSBbXVxuXG4gICNlbWl0dGVyID0gZWUoKVxuXG4gICNpc09wZW4gPSBmYWxzZVxuXG4gICNzb2NrZXRcblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNPcGVuICgpIHsgcmV0dXJuIHRoaXMuI2lzT3BlbiB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0U29ja2V0JyldICgpIHsgcmV0dXJuIHRoaXMuI3NvY2tldCB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0UXVldWVkJyldICgpIHsgcmV0dXJuIHRoaXMuI3F1ZXVlZCB9XG5cbiAgb3BlbiAoKSB7XG4gICAgdGhpcy4jc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy4jc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2lzT3BlbiA9IHRydWVcblxuICAgICAgd2hpbGUgKHRoaXMuI3F1ZXVlZC5sZW5ndGggPiAwICYmIHRoaXMuI2lzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuI3F1ZXVlZC5zaGlmdCgpXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNpc09wZW4gPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuI3NvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLiNoYW5kbGVNZXNzYWdlXG4gIH1cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy4jc29ja2V0Py5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLiNpc09wZW4pIHtcbiAgICAgIHRoaXMuI3F1ZXVlZC5wdXNoKHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiNzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkLFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub25jZShhY3Rpb24sIGhhbmRsZXIpXG4gIH1cblxuICAjaGFuZGxlTWVzc2FnZT0gKGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYSBtb3JlIHJvYnVzdCBlcnJvciBoYW5kbGVyLlxuICAgICAgY29uc29sZS5sb2coZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1hbmFnZXMgY29tbXVuaWNhdGlvbnMgd2l0aCBDb21wYW5pb25cbiAqL1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcbmNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpXG5jb25zdCBTZWFyY2hQcm92aWRlciA9IHJlcXVpcmUoJy4vU2VhcmNoUHJvdmlkZXInKVxuY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9Tb2NrZXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXIsXG4gIFNlYXJjaFByb3ZpZGVyLFxuICBTb2NrZXQsXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgYW4gQXN5bmMgd3JhcHBlciBmb3IgTG9jYWxTdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSAoa2V5LCB2YWx1ZSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIHJlc29sdmUoKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cbiIsIi8vIFRoaXMgZmlsZSByZXBsYWNlcyBgaW5kZXguanNgIGluIGJ1bmRsZXJzIGxpa2Ugd2VicGFjayBvciBSb2xsdXAsXG4vLyBhY2NvcmRpbmcgdG8gYGJyb3dzZXJgIGNvbmZpZyBpbiBgcGFja2FnZS5qc29uYC5cblxubGV0IHsgdXJsQWxwaGFiZXQgfSA9IHJlcXVpcmUoJy4vdXJsLWFscGhhYmV0L2luZGV4LmNqcycpXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIEFsbCBidW5kbGVycyB3aWxsIHJlbW92ZSB0aGlzIGJsb2NrIGluIHRoZSBwcm9kdWN0aW9uIGJ1bmRsZS5cbiAgaWYgKFxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgJiZcbiAgICB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnUmVhY3QgTmF0aXZlIGRvZXMgbm90IGhhdmUgYSBidWlsdC1pbiBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzIHVzZSBgbmFub2lkL25vbi1zZWN1cmVgLiAnICtcbiAgICAgICAgJ0ZvciBzZWN1cmUgSURzLCBpbXBvcnQgYHJlYWN0LW5hdGl2ZS1nZXQtcmFuZG9tLXZhbHVlc2AgJyArXG4gICAgICAgICdiZWZvcmUgTmFubyBJRC4nXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0ltcG9ydCBmaWxlIHdpdGggYGlmICghd2luZG93LmNyeXB0bykgd2luZG93LmNyeXB0byA9IHdpbmRvdy5tc0NyeXB0b2AnICtcbiAgICAgICAgJyBiZWZvcmUgaW1wb3J0aW5nIE5hbm8gSUQgdG8gZml4IElFIDExIHN1cHBvcnQnXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdZb3VyIGJyb3dzZXIgZG9lcyBub3QgaGF2ZSBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzLCB5b3UgY2FuIHVzZSBuYW5vaWQvbm9uLXNlY3VyZS4nXG4gICAgKVxuICB9XG59XG5cbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxubGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgc2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIC8vIEZpcnN0LCBhIGJpdG1hc2sgaXMgbmVjZXNzYXJ5IHRvIGdlbmVyYXRlIHRoZSBJRC4gVGhlIGJpdG1hc2sgbWFrZXMgYnl0ZXNcbiAgLy8gdmFsdWVzIGNsb3NlciB0byB0aGUgYWxwaGFiZXQgc2l6ZS4gVGhlIGJpdG1hc2sgY2FsY3VsYXRlcyB0aGUgY2xvc2VzdFxuICAvLyBgMl4zMSAtIDFgIG51bWJlciwgd2hpY2ggZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgLy8gRm9yIGV4YW1wbGUsIHRoZSBiaXRtYXNrIGZvciB0aGUgYWxwaGFiZXQgc2l6ZSAzMCBpcyAzMSAoMDAwMTExMTEpLlxuICAvLyBgTWF0aC5jbHozMmAgaXMgbm90IHVzZWQsIGJlY2F1c2UgaXQgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2Vycy5cbiAgbGV0IG1hc2sgPSAoMiA8PCAoTWF0aC5sb2coYWxwaGFiZXQubGVuZ3RoIC0gMSkgLyBNYXRoLkxOMikpIC0gMVxuICAvLyBUaG91Z2gsIHRoZSBiaXRtYXNrIHNvbHV0aW9uIGlzIG5vdCBwZXJmZWN0IHNpbmNlIHRoZSBieXRlcyBleGNlZWRpbmdcbiAgLy8gdGhlIGFscGhhYmV0IHNpemUgYXJlIHJlZnVzZWQuIFRoZXJlZm9yZSwgdG8gcmVsaWFibHkgZ2VuZXJhdGUgdGhlIElELFxuICAvLyB0aGUgcmFuZG9tIGJ5dGVzIHJlZHVuZGFuY3kgaGFzIHRvIGJlIHNhdGlzZmllZC5cblxuICAvLyBOb3RlOiBldmVyeSBoYXJkd2FyZSByYW5kb20gZ2VuZXJhdG9yIGNhbGwgaXMgcGVyZm9ybWFuY2UgZXhwZW5zaXZlLFxuICAvLyBiZWNhdXNlIHRoZSBzeXN0ZW0gY2FsbCBmb3IgZW50cm9weSBjb2xsZWN0aW9uIHRha2VzIGEgbG90IG9mIHRpbWUuXG4gIC8vIFNvLCB0byBhdm9pZCBhZGRpdGlvbmFsIHN5c3RlbSBjYWxscywgZXh0cmEgYnl0ZXMgYXJlIHJlcXVlc3RlZCBpbiBhZHZhbmNlLlxuXG4gIC8vIE5leHQsIGEgc3RlcCBkZXRlcm1pbmVzIGhvdyBtYW55IHJhbmRvbSBieXRlcyB0byBnZW5lcmF0ZS5cbiAgLy8gVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgZ2V0cyBkZWNpZGVkIHVwb24gdGhlIElEIHNpemUsIG1hc2ssXG4gIC8vIGFscGhhYmV0IHNpemUsIGFuZCBtYWdpYyBudW1iZXIgMS42ICh1c2luZyAxLjYgcGVha3MgYXQgcGVyZm9ybWFuY2VcbiAgLy8gYWNjb3JkaW5nIHRvIGJlbmNobWFya3MpLlxuXG4gIC8vIGAtfmYgPT4gTWF0aC5jZWlsKGYpYCBpZiBmIGlzIGEgZmxvYXRcbiAgLy8gYC1+aSA9PiBpICsgMWAgaWYgaSBpcyBhbiBpbnRlZ2VyXG4gIGxldCBzdGVwID0gLX4oKDEuNiAqIG1hc2sgKiBzaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgLy8gQSBjb21wYWN0IGFsdGVybmF0aXZlIGZvciBgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwOyBpKyspYC5cbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAvLyBBZGRpbmcgYHx8ICcnYCByZWZ1c2VzIGEgcmFuZG9tIGJ5dGUgdGhhdCBleGNlZWRzIHRoZSBhbHBoYWJldCBzaXplLlxuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUpID0+IGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxuXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT4ge1xuICBsZXQgaWQgPSAnJ1xuICBsZXQgYnl0ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKVxuXG4gIC8vIEEgY29tcGFjdCBhbHRlcm5hdGl2ZSBmb3IgYGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgaSsrKWAuXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICAvLyBJdCBpcyBpbmNvcnJlY3QgdG8gdXNlIGJ5dGVzIGV4Y2VlZGluZyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICAvLyBUaGUgZm9sbG93aW5nIG1hc2sgcmVkdWNlcyB0aGUgcmFuZG9tIGJ5dGUgaW4gdGhlIDAtMjU1IHZhbHVlXG4gICAgLy8gcmFuZ2UgdG8gdGhlIDAtNjMgdmFsdWUgcmFuZ2UuIFRoZXJlZm9yZSwgYWRkaW5nIGhhY2tzLCBzdWNoXG4gICAgLy8gYXMgZW1wdHkgc3RyaW5nIGZhbGxiYWNrIG9yIG1hZ2ljIG51bWJlcnMsIGlzIHVubmVjY2Vzc2FyeSBiZWNhdXNlXG4gICAgLy8gdGhlIGJpdG1hc2sgdHJpbXMgYnl0ZXMgZG93biB0byB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICBsZXQgYnl0ZSA9IGJ5dGVzW3NpemVdICYgNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICAvLyBgMC05YS16YFxuICAgICAgaWQgKz0gYnl0ZS50b1N0cmluZygzNilcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mikge1xuICAgICAgLy8gYEEtWmBcbiAgICAgIGlkICs9IChieXRlIC0gMjYpLnRvU3RyaW5nKDM2KS50b1VwcGVyQ2FzZSgpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjMpIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiLy8gVGhpcyBhbHBoYWJldCB1c2VzIGBBLVphLXowLTlfLWAgc3ltYm9scy4gVGhlIGdlbmV0aWMgYWxnb3JpdGhtIGhlbHBlZFxuLy8gb3B0aW1pemUgdGhlIGd6aXAgY29tcHJlc3Npb24gZm9yIHRoaXMgYWxwaGFiZXQuXG5sZXQgdXJsQWxwaGFiZXQgPVxuICAnTW9kdWxlU3ltYmhhc093blByLTAxMjM0NTY3ODlBQkNERUZHSE5SVmZnY3RpVXZ6X0txWVRKa0x4cFpYSWpRVydcblxubW9kdWxlLmV4cG9ydHMgPSB7IHVybEFscGhhYmV0IH1cbiIsIi8qKlxuICogQ29yZSBwbHVnaW4gbG9naWMgdGhhdCBhbGwgcGx1Z2lucyBzaGFyZS5cbiAqXG4gKiBCYXNlUGx1Z2luIGRvZXMgbm90IGNvbnRhaW4gRE9NIHJlbmRlcmluZyBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgcGx1Z2luc1xuICogd2l0aG91dCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIFNlZSBgUGx1Z2luYCBmb3IgdGhlIGV4dGVuZGVkIHZlcnNpb24gd2l0aCBQcmVhY3QgcmVuZGVyaW5nIGZvciBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzZVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgZ2V0UGx1Z2luU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fVxuICB9XG5cbiAgc2V0UGx1Z2luU3RhdGUgKHVwZGF0ZSkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgIFt0aGlzLmlkXToge1xuICAgICAgICAgIC4uLnBsdWdpbnNbdGhpcy5pZF0sXG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHsgLi4udGhpcy5vcHRzLCAuLi5uZXdPcHRzIH1cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgICB0aGlzLmkxOG5Jbml0KClcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZGFibGUgbWV0aG9kc1xuICAgKiA9PT09PT09PT09PT09PT09PT1cbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgaGVyZSB0byBzZXJ2ZSBhcyBhbiBvdmVydmlldyBvZiB0aGUgZXh0ZW5kYWJsZSBtZXRob2RzIGFzIHdlbGwgYXNcbiAgICogbWFraW5nIHRoZW0gbm90IGNvbmRpdGlvbmFsIGluIHVzZSwgc3VjaCBhcyBgaWYgKHRoaXMuYWZ0ZXJVcGRhdGUpYC5cbiAgICovXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWRkVGFyZ2V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgYWRkVGFyZ2V0IG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYW5vdGhlciBwbHVnaW5cXCdzIHRhcmdldCcpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBpbnN0YWxsICgpIHt9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdW5pbnN0YWxsICgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHBsdWdpbiBpcyBtb3VudGVkLCB3aGV0aGVyIGluIERPTSBvciBpbnRvIGFub3RoZXIgcGx1Z2luLlxuICAgKiBOZWVkZWQgYmVjYXVzZSBzb21ldGltZXMgcGx1Z2lucyBhcmUgbW91bnRlZCBzZXBhcmF0ZWx5L2FmdGVyIGBpbnN0YWxsYCxcbiAgICogc28gdGhpcy5lbCBhbmQgdGhpcy5wYXJlbnQgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSBpbiBgaW5zdGFsbGAuXG4gICAqIFRoaXMgaXMgdGhlIGNhc2Ugd2l0aCBAdXBweS9yZWFjdCBwbHVnaW5zLCBmb3IgZXhhbXBsZS5cbiAgICovXG4gIHJlbmRlciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdXBkYXRlICgpIHt9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWZ0ZXJVcGRhdGUgKCkge31cbn1cbiIsImNvbnN0IHsgcmVuZGVyIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKVxuXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0geygpID0+IFR9IGZuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBVSVBsdWdpbiBpcyB0aGUgZXh0ZW5kZWQgdmVyc2lvbiBvZiBCYXNlUGx1Z2luIHRvIGluY29ycG9yYXRlIHJlbmRlcmluZyB3aXRoIFByZWFjdC5cbiAqIFVzZSB0aGlzIGZvciBwbHVnaW5zIHRoYXQgbmVlZCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIEZvciBwbHVnaW5zIHdpdGhvdXQgYW4gdXNlciBpbnRlcmZhY2UsIHNlZSBCYXNlUGx1Z2luLlxuICovXG5jbGFzcyBVSVBsdWdpbiBleHRlbmRzIEJhc2VQbHVnaW4ge1xuICAjdXBkYXRlVUlcblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLmlzVGFyZ2V0RE9NRWwgPSB0cnVlXG4gICAgICAvLyBXaGVuIHRhcmdldCBpcyA8Ym9keT4gd2l0aCBhIHNpbmdsZSA8ZGl2PiBlbGVtZW50LFxuICAgICAgLy8gUHJlYWN0IHRoaW5rcyBpdOKAmXMgdGhlIFVwcHkgcm9vdCBlbGVtZW50IGluIHRoZXJlIHdoZW4gZG9pbmcgYSBkaWZmLFxuICAgICAgLy8gYW5kIGRlc3Ryb3lzIGl0LiBTbyB3ZSBhcmUgY3JlYXRpbmcgYSBmcmFnbWVudCAoY291bGQgYmUgZW1wdHkgZGl2KVxuICAgICAgY29uc3QgdXBweVJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgIC8vIEFQSSBmb3IgcGx1Z2lucyB0aGF0IHJlcXVpcmUgYSBzeW5jaHJvbm91cyByZXJlbmRlci5cbiAgICAgIHRoaXMuI3VwZGF0ZVVJID0gZGVib3VuY2UoKHN0YXRlKSA9PiB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLmlkKSkgcmV0dXJuXG4gICAgICAgIHJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHVwcHlSb290RWxlbWVudClcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZSgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVwbGFjZVRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgLy8gRG9pbmcgcmVuZGVyKGgobnVsbCksIHRhcmdldEVsZW1lbnQpLCB3aGljaCBzaG91bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGEgYmV0dGVyIHdheSwgc2luY2UgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IG5lZWQgdG8gZG8gYWRkaXRpb25hbCBjbGVhbnVwIHdoZW4gaXQgaXMgcmVtb3ZlZCxcbiAgICAgICAgLy8gc3RvcHBlZCB3b3JraW5nIOKAlCBQcmVhY3QganVzdCBhZGRzIG51bGwgaW50byB0YXJnZXQsIG5vdCByZXBsYWNpbmdcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgfVxuXG4gICAgICByZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB1cHB5Um9vdEVsZW1lbnQpXG4gICAgICB0aGlzLmVsID0gdXBweVJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHVwcHlSb290RWxlbWVudClcblxuICAgICAgdGhpcy5vbk1vdW50KClcblxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFVJUGx1Z2luKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gKmluc3RhbmNlKlxuICAgICAgdGFyZ2V0UGx1Z2luID0gdGFyZ2V0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gdHlwZVxuICAgICAgY29uc3QgVGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgdGhpcy51cHB5Lml0ZXJhdGVQbHVnaW5zKHAgPT4ge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFBsdWdpbiA9IHBcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICdcbiAgICAgICAgKyAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJ1xuICAgICAgICArICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJ1xuICAgICAgICArICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJ1xuICAgICAgICArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICdcbiAgICAgICAgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nXG4gICAgICAgICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuI3VwZGF0ZVVJPy4oc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgdW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaXNUYXJnZXRET01FbCkge1xuICAgICAgdGhpcy5lbD8ucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5vblVubW91bnQoKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgb25Nb3VudCAoKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG9uVW5tb3VudCAoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJUGx1Z2luXG4iLCIvKiBnbG9iYWwgQWdncmVnYXRlRXJyb3IgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCBlZSA9IHJlcXVpcmUoJ25hbWVzcGFjZS1lbWl0dGVyJylcbmNvbnN0IHsgbmFub2lkIH0gPSByZXF1aXJlKCduYW5vaWQnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKVxuY29uc3QgRGVmYXVsdFN0b3JlID0gcmVxdWlyZSgnQHVwcHkvc3RvcmUtZGVmYXVsdCcpXG5jb25zdCBnZXRGaWxlVHlwZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlVHlwZScpXG5jb25zdCBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBnZW5lcmF0ZUZpbGVJRCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZW5lcmF0ZUZpbGVJRCcpXG5jb25zdCBzdXBwb3J0c1VwbG9hZFByb2dyZXNzID0gcmVxdWlyZSgnLi9zdXBwb3J0c1VwbG9hZFByb2dyZXNzJylcbmNvbnN0IGdldEZpbGVOYW1lID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZScpXG5jb25zdCB7IGp1c3RFcnJvcnNMb2dnZXIsIGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG4vLyBFeHBvcnRlZCBmcm9tIGhlcmUuXG5jbGFzcyBSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5pZiAodHlwZW9mIEFnZ3JlZ2F0ZUVycm9yID09PSAndW5kZWZpbmVkJykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZ2xvYmFsLWFzc2lnblxuICBnbG9iYWxUaGlzLkFnZ3JlZ2F0ZUVycm9yID0gY2xhc3MgQWdncmVnYXRlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIGVycm9ycykge1xuICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgfVxuICB9XG59XG5jbGFzcyBBZ2dyZWdhdGVSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgQWdncmVnYXRlRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogVXBweSBDb3JlIG1vZHVsZS5cbiAqIE1hbmFnZXMgcGx1Z2lucywgc3RhdGUgdXBkYXRlcywgYWN0cyBhcyBhbiBldmVudCBidXMsXG4gKiBhZGRzL3JlbW92ZXMgZmlsZXMgYW5kIG1ldGFkYXRhLlxuICovXG5jbGFzcyBVcHB5IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgQmFzZVBsdWdpbltdPn0gKi9cbiAgI3BsdWdpbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgI3N0b3JlVW5zdWJzY3JpYmVcblxuICAjZW1pdHRlciA9IGVlKClcblxuICAjcHJlUHJvY2Vzc29ycyA9IG5ldyBTZXQoKVxuXG4gICN1cGxvYWRlcnMgPSBuZXcgU2V0KClcblxuICAjcG9zdFByb2Nlc3NvcnMgPSBuZXcgU2V0KClcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgVXBweVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgYWRkQnVsa0ZpbGVzRmFpbGVkOiB7XG4gICAgICAgICAgMDogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZSBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3InLFxuICAgICAgICAgIDE6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGVzIGR1ZSB0byBpbnRlcm5hbCBlcnJvcnMnLFxuICAgICAgICB9LFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkWDoge1xuICAgICAgICAgIDA6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeW91SGF2ZVRvQXRMZWFzdFNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgaGF2ZSB0byBzZWxlY3QgYXQgbGVhc3QgJXtzbWFydF9jb3VudH0gZmlsZXMnLFxuICAgICAgICB9LFxuICAgICAgICBleGNlZWRzU2l6ZTogJyV7ZmlsZX0gZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBvZiAle3NpemV9JyxcbiAgICAgICAgbWlzc2luZ1JlcXVpcmVkTWV0YUZpZWxkOiAnTWlzc2luZyByZXF1aXJlZCBtZXRhIGZpZWxkcycsXG4gICAgICAgIG1pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZE9uRmlsZTogJ01pc3NpbmcgcmVxdWlyZWQgbWV0YSBmaWVsZHMgaW4gJXtmaWxlTmFtZX0nLFxuICAgICAgICBpbmZlcmlvclNpemU6ICdUaGlzIGZpbGUgaXMgc21hbGxlciB0aGFuIHRoZSBhbGxvd2VkIHNpemUgb2YgJXtzaXplfScsXG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRGaWxlVHlwZXM6ICdZb3UgY2FuIG9ubHkgdXBsb2FkOiAle3R5cGVzfScsXG4gICAgICAgIG5vTW9yZUZpbGVzQWxsb3dlZDogJ0Nhbm5vdCBhZGQgbW9yZSBmaWxlcycsXG4gICAgICAgIG5vRHVwbGljYXRlczogJ0Nhbm5vdCBhZGQgdGhlIGR1cGxpY2F0ZSBmaWxlIFxcJyV7ZmlsZU5hbWV9XFwnLCBpdCBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgIGNvbXBhbmlvbkVycm9yOiAnQ29ubmVjdGlvbiB3aXRoIENvbXBhbmlvbiBmYWlsZWQnLFxuICAgICAgICBjb21wYW5pb25VbmF1dGhvcml6ZUhpbnQ6ICdUbyB1bmF1dGhvcml6ZSB0byB5b3VyICV7cHJvdmlkZXJ9IGFjY291bnQsIHBsZWFzZSBnbyB0byAle3VybH0nLFxuICAgICAgICBmYWlsZWRUb1VwbG9hZDogJ0ZhaWxlZCB0byB1cGxvYWQgJXtmaWxlfScsXG4gICAgICAgIG5vSW50ZXJuZXRDb25uZWN0aW9uOiAnTm8gSW50ZXJuZXQgY29ubmVjdGlvbicsXG4gICAgICAgIGNvbm5lY3RlZFRvSW50ZXJuZXQ6ICdDb25uZWN0ZWQgdG8gdGhlIEludGVybmV0JyxcbiAgICAgICAgLy8gU3RyaW5ncyBmb3IgcmVtb3RlIHByb3ZpZGVyc1xuICAgICAgICBub0ZpbGVzRm91bmQ6ICdZb3UgaGF2ZSBubyBmaWxlcyBvciBmb2xkZXJzIGhlcmUnLFxuICAgICAgICBzZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgICAgMTogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgIH0sXG4gICAgICAgIGFsbEZpbGVzRnJvbUZvbGRlck5hbWVkOiAnQWxsIGZpbGVzIGZyb20gZm9sZGVyICV7bmFtZX0nLFxuICAgICAgICBvcGVuRm9sZGVyTmFtZWQ6ICdPcGVuIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgY2FuY2VsOiAnQ2FuY2VsJyxcbiAgICAgICAgbG9nT3V0OiAnTG9nIG91dCcsXG4gICAgICAgIGZpbHRlcjogJ0ZpbHRlcicsXG4gICAgICAgIHJlc2V0RmlsdGVyOiAnUmVzZXQgZmlsdGVyJyxcbiAgICAgICAgbG9hZGluZzogJ0xvYWRpbmcuLi4nLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoVGl0bGU6ICdQbGVhc2UgYXV0aGVudGljYXRlIHdpdGggJXtwbHVnaW5OYW1lfSB0byBzZWxlY3QgZmlsZXMnLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoOiAnQ29ubmVjdCB0byAle3BsdWdpbk5hbWV9JyxcbiAgICAgICAgc2lnbkluV2l0aEdvb2dsZTogJ1NpZ24gaW4gd2l0aCBHb29nbGUnLFxuICAgICAgICBzZWFyY2hJbWFnZXM6ICdTZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGVudGVyVGV4dFRvU2VhcmNoOiAnRW50ZXIgdGV4dCB0byBzZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGJhY2tUb1NlYXJjaDogJ0JhY2sgdG8gU2VhcmNoJyxcbiAgICAgICAgZW1wdHlGb2xkZXJBZGRlZDogJ05vIGZpbGVzIHdlcmUgYWRkZWQgZnJvbSBlbXB0eSBmb2xkZXInLFxuICAgICAgICBmb2xkZXJBbHJlYWR5QWRkZWQ6ICdUaGUgZm9sZGVyIFwiJXtmb2xkZXJ9XCIgd2FzIGFscmVhZHkgYWRkZWQnLFxuICAgICAgICBmb2xkZXJBZGRlZDoge1xuICAgICAgICAgIDA6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlIGZyb20gJXtmb2xkZXJ9JyxcbiAgICAgICAgICAxOiAnQWRkZWQgJXtzbWFydF9jb3VudH0gZmlsZXMgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGlkOiAndXBweScsXG4gICAgICBhdXRvUHJvY2VlZDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIFRoZSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgYWxsb3dNdWx0aXBsZVVwbG9hZEJhdGNoZXM6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1pbkZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhUb3RhbEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBtaW5OdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBudWxsLFxuICAgICAgICByZXF1aXJlZE1ldGFGaWVsZHM6IFtdLFxuICAgICAgfSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgb25CZWZvcmVGaWxlQWRkZWQ6IChjdXJyZW50RmlsZSkgPT4gY3VycmVudEZpbGUsXG4gICAgICBvbkJlZm9yZVVwbG9hZDogKGZpbGVzKSA9PiBmaWxlcyxcbiAgICAgIHN0b3JlOiBEZWZhdWx0U3RvcmUoKSxcbiAgICAgIGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlcixcbiAgICAgIGluZm9UaW1lb3V0OiA1MDAwLFxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyLFxuICAgIC8vIG1ha2luZyBzdXJlIHRvIG1lcmdlIHJlc3RyaWN0aW9ucyB0b29cbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdHMsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4ob3B0cyAmJiBvcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZGVidWc6IHRydWUgZm9yIGJhY2t3YXJkcy1jb21wYXRhYmlsaXR5LCB1bmxlc3MgbG9nZ2VyIGlzIHNldCBpbiBvcHRzXG4gICAgLy8gb3B0cyBpbnN0ZWFkIG9mIHRoaXMub3B0cyB0byBhdm9pZCBjb21wYXJpbmcgb2JqZWN0cyDigJQgd2Ugc2V0IGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlciBpbiBkZWZhdWx0T3B0aW9uc1xuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAob3B0cyAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLm9wdHMubG9nZ2VyID0gZGVidWdMb2dnZXJcbiAgICB9XG5cbiAgICB0aGlzLmxvZyhgVXNpbmcgQ29yZSB2JHt0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT059YClcblxuICAgIGlmICh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXNcbiAgICAgICAgJiYgdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzICE9PSBudWxsXG4gICAgICAgICYmICFBcnJheS5pc0FycmF5KHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc2AgbXVzdCBiZSBhbiBhcnJheScpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICAvLyBfX19XaHkgdGhyb3R0bGUgYXQgNTAwbXM/XG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0ID4yNTBtcyBmb3Igc3VwZXJmb2N1cyBpbiBEYXNoYm9hcmQgdG8gd29yayB3ZWxsXG4gICAgLy8gICAgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsXG4gICAgLy8gICAgYW5kIGNsaWNrICdBREQgTU9SRSBGSUxFUycsIC0gZm9jdXMgd29uJ3QgYWN0aXZhdGUgaW4gRmlyZWZveC5cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgYXJvdW5kID41MDBtcyB0byBhdm9pZCBwZXJmb3JtYW5jZSBsYWdzLlxuICAgIC8vICAgIFtQcmFjdGljYWwgQ2hlY2tdIEZpcmVmb3gsIHRyeSB0byB1cGxvYWQgYSBiaWcgZmlsZSBmb3IgYSBwcm9sb25nZWQgcGVyaW9kIG9mIHRpbWUuIExhcHRvcCB3aWxsIHN0YXJ0IHRvIGhlYXQgdXAuXG4gICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcyA9IHRocm90dGxlKHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKSwgNTAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnN0b3JlID0gdGhpcy5vcHRzLnN0b3JlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGZpbGVzOiB7fSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7fSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiB0cnVlLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIHVwbG9hZFByb2dyZXNzOiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzKCksXG4gICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWUsXG4gICAgICAgIHJlc3VtYWJsZVVwbG9hZHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgICBtZXRhOiB7IC4uLnRoaXMub3B0cy5tZXRhIH0sXG4gICAgICBpbmZvOiBbXSxcbiAgICAgIHJlY292ZXJlZFN0YXRlOiBudWxsLFxuICAgIH0pXG5cbiAgICB0aGlzLiNzdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdzdGF0ZS11cGRhdGUnLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gICAgICB0aGlzLnVwZGF0ZUFsbChuZXh0U3RhdGUpXG4gICAgfSlcblxuICAgIC8vIEV4cG9zaW5nIHVwcHkgb2JqZWN0IG9uIHdpbmRvdyBmb3IgZGVidWdnaW5nIGFuZCB0ZXN0aW5nXG4gICAgaWYgKHRoaXMub3B0cy5kZWJ1ZyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93W3RoaXMub3B0cy5pZF0gPSB0aGlzXG4gICAgfVxuXG4gICAgdGhpcy4jYWRkTGlzdGVuZXJzKClcbiAgfVxuXG4gIGVtaXQgKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGV2ZW50LCAuLi5hcmdzKVxuICB9XG5cbiAgb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvbmNlIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9uY2UoZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvZmYgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb24gYWxsIHBsdWdpbnMgYW5kIHJ1biBgdXBkYXRlYCBvbiB0aGVtLlxuICAgKiBDYWxsZWQgZWFjaCB0aW1lIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqL1xuICB1cGRhdGVBbGwgKHN0YXRlKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgcGx1Z2luLnVwZGF0ZShzdGF0ZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgc3RhdGUgd2l0aCBhIHBhdGNoXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXRjaCB7Zm9vOiAnYmFyJ31cbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCYWNrIGNvbXBhdCBmb3Igd2hlbiB1cHB5LnN0YXRlIGlzIHVzZWQgaW5zdGVhZCBvZiB1cHB5LmdldFN0YXRlKCkuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBnZXQgc3RhdGUgKCkge1xuICAgIC8vIEhlcmUsIHN0YXRlIGlzIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCB0byBzZXQgc3RhdGUgZm9yIGEgc3BlY2lmaWMgZmlsZS5cbiAgICovXG4gIHNldEZpbGVTdGF0ZSAoZmlsZUlELCBzdGF0ZSkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fu4oCZdCBzZXQgc3RhdGUgZm9yICR7ZmlsZUlEfSAodGhlIGZpbGUgY291bGQgaGF2ZSBiZWVuIHJlbW92ZWQpYClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcywgW2ZpbGVJRF06IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIC4uLnN0YXRlIH0gfSxcbiAgICB9KVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIGNvbnN0IHRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihbdGhpcy5kZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlXSlcbiAgICB0aGlzLmkxOG4gPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5pMThuQXJyYXkgPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodHJhbnNsYXRvcilcbiAgICB0aGlzLmxvY2FsZSA9IHRyYW5zbGF0b3IubG9jYWxlXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0ge1xuICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgLi4ubmV3T3B0cyxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdHMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4obmV3T3B0cyAmJiBuZXdPcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmIChuZXdPcHRzLm1ldGEpIHtcbiAgICAgIHRoaXMuc2V0TWV0YShuZXdPcHRzLm1ldGEpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE5vdGU6IHRoaXMgaXMgbm90IHRoZSBwcmVhY3QgYHNldFN0YXRlYCwgaXQncyBhbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGhhcyB0aGUgc2FtZSBuYW1lLlxuICAgIHRoaXMuc2V0U3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsLFxuICAgIH1cbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHsgLi4uZmlsZXNbZmlsZUlEXSB9XG4gICAgICB1cGRhdGVkRmlsZS5wcm9ncmVzcyA9IHsgLi4udXBkYXRlZEZpbGUucHJvZ3Jlc3MsIC4uLmRlZmF1bHRQcm9ncmVzcyB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmVzZXQtcHJvZ3Jlc3MnKVxuICB9XG5cbiAgYWRkUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMuI3ByZVByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHJldHVybiB0aGlzLiNwcmVQcm9jZXNzb3JzLmRlbGV0ZShmbilcbiAgfVxuXG4gIGFkZFBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgdGhpcy4jcG9zdFByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUG9zdFByb2Nlc3NvciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zdFByb2Nlc3NvcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgYWRkVXBsb2FkZXIgKGZuKSB7XG4gICAgdGhpcy4jdXBsb2FkZXJzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVVwbG9hZGVyIChmbikge1xuICAgIHJldHVybiB0aGlzLiN1cGxvYWRlcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgc2V0TWV0YSAoZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRNZXRhID0geyAuLi50aGlzLmdldFN0YXRlKCkubWV0YSwgLi4uZGF0YSB9XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogeyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCAuLi5kYXRhIH0gfVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZygnQWRkaW5nIG1ldGFkYXRhOicpXG4gICAgdGhpcy5sb2coZGF0YSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWV0YTogdXBkYXRlZE1ldGEsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgIH0pXG4gIH1cblxuICBzZXRGaWxlTWV0YSAoZmlsZUlELCBkYXRhKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGlmICghdXBkYXRlZEZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdXYXMgdHJ5aW5nIHRvIHNldCBtZXRhZGF0YSBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJywgZmlsZUlEKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IG5ld01ldGEgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIC4uLmRhdGEgfVxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogbmV3TWV0YSB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBmaWxlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRCBUaGUgSUQgb2YgdGhlIGZpbGUgb2JqZWN0IHRvIHJldHVybi5cbiAgICovXG4gIGdldEZpbGUgKGZpbGVJRCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICBnZXRGaWxlcyAoKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsZXMpXG4gIH1cblxuICBnZXRPYmplY3RPZkZpbGVzUGVyU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgZmlsZXM6IGZpbGVzT2JqZWN0LCB0b3RhbFByb2dyZXNzLCBlcnJvciB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgZmlsZXMgPSBPYmplY3QudmFsdWVzKGZpbGVzT2JqZWN0KVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGaWxlcyA9IGZpbGVzLmZpbHRlcigoeyBwcm9ncmVzcyB9KSA9PiAhcHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiYgcHJvZ3Jlc3MudXBsb2FkU3RhcnRlZClcbiAgICBjb25zdCBuZXdGaWxlcyA9ICBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3Qgc3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKFxuICAgICAgZmlsZSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICApXG4gICAgY29uc3QgdXBsb2FkU3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3QgcGF1c2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgY29tcGxldGVGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSlcbiAgICBjb25zdCBlcnJvcmVkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZXJyb3IpXG4gICAgY29uc3QgaW5Qcm9ncmVzc05vdFBhdXNlZEZpbGVzID0gaW5Qcm9ncmVzc0ZpbGVzLmZpbHRlcigoZmlsZSkgPT4gIWZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgcHJvY2Vzc2luZ0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnByZXByb2Nlc3MgfHwgZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2VzcylcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIHVwbG9hZFN0YXJ0ZWRGaWxlcyxcbiAgICAgIHBhdXNlZEZpbGVzLFxuICAgICAgY29tcGxldGVGaWxlcyxcbiAgICAgIGVycm9yZWRGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyxcbiAgICAgIHByb2Nlc3NpbmdGaWxlcyxcblxuICAgICAgaXNVcGxvYWRTdGFydGVkOiB1cGxvYWRTdGFydGVkRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzQWxsQ29tcGxldGU6IHRvdGFsUHJvZ3Jlc3MgPT09IDEwMFxuICAgICAgICAmJiBjb21wbGV0ZUZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoXG4gICAgICAgICYmIHByb2Nlc3NpbmdGaWxlcy5sZW5ndGggPT09IDAsXG4gICAgICBpc0FsbEVycm9yZWQ6ICEhZXJyb3IgJiYgZXJyb3JlZEZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoLFxuICAgICAgaXNBbGxQYXVzZWQ6IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGggIT09IDAgJiYgcGF1c2VkRmlsZXMubGVuZ3RoID09PSBpblByb2dyZXNzRmlsZXMubGVuZ3RoLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzOiBpblByb2dyZXNzRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzU29tZUdob3N0OiBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc0dob3N0KSxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwdWJsaWMgd3JhcHBlciBmb3IgX2NoZWNrUmVzdHJpY3Rpb25zIOKAlCBjaGVja3MgaWYgYSBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMuXG4gICAqIEZvciB1c2UgaW4gVUkgcGx1aWdpbnMgKGxpa2UgUHJvdmlkZXJzKSwgdG8gZGlzYWxsb3cgc2VsZWN0aW5nIGZpbGVzIHRoYXQgd29u4oCZdCBwYXNzIHJlc3RyaWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB7IHJlc3VsdDogdHJ1ZS9mYWxzZSwgcmVhc29uOiB3aHkgZmlsZSBkaWRu4oCZdCBwYXNzIHJlc3RyaWN0aW9ucyB9XG4gICAqL1xuICB2YWxpZGF0ZVJlc3RyaWN0aW9ucyAoZmlsZSwgZmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy4jY2hlY2tSZXN0cmljdGlvbnMoZmlsZSwgZmlsZXMpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IHRydWUsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGVyci5tZXNzYWdlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSxcbiAgICogbWF4TnVtYmVyT2ZGaWxlcyBhbmQgYWxsb3dlZEZpbGVUeXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI2NoZWNrUmVzdHJpY3Rpb25zIChmaWxlLCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKSkge1xuICAgIGNvbnN0IHsgbWF4RmlsZVNpemUsIG1pbkZpbGVTaXplLCBtYXhUb3RhbEZpbGVTaXplLCBtYXhOdW1iZXJPZkZpbGVzLCBhbGxvd2VkRmlsZVR5cGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG5cbiAgICBpZiAobWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCArIDEgPiBtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7IHNtYXJ0X2NvdW50OiBtYXhOdW1iZXJPZkZpbGVzIH0pfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIGNvbnN0IGlzQ29ycmVjdEZpbGVUeXBlID0gYWxsb3dlZEZpbGVUeXBlcy5zb21lKCh0eXBlKSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBtaW1lLXR5cGVcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIG1hdGNoKGZpbGUudHlwZS5yZXBsYWNlKC87Lio/JC8sICcnKSwgdHlwZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGlzIGlzIGxpa2VseSBhbiBleHRlbnNpb25cbiAgICAgICAgaWYgKHR5cGVbMF0gPT09ICcuJyAmJiBmaWxlLmV4dGVuc2lvbikge1xuICAgICAgICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoIWlzQ29ycmVjdEZpbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgPSBhbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywgJylcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywgeyB0eXBlczogYWxsb3dlZEZpbGVUeXBlc1N0cmluZyB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhUb3RhbEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5zaXplICE9IG51bGwpIHtcbiAgICAgIGxldCB0b3RhbEZpbGVzU2l6ZSA9IDBcbiAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGUuc2l6ZVxuICAgICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmLnNpemVcbiAgICAgIH0pXG4gICAgICBpZiAodG90YWxGaWxlc1NpemUgPiBtYXhUb3RhbEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhUb3RhbEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1heEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZScsIHtcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1heEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1pbkZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1pbkZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdpbmZlcmlvclNpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtaW5GaWxlU2l6ZSksXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBtaW5OdW1iZXJPZkZpbGVzIHJlc3RyaWN0aW9uIGlzIHJlYWNoZWQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjaGVja01pbk51bWJlck9mRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyBtaW5OdW1iZXJPZkZpbGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggPCBtaW5OdW1iZXJPZkZpbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywgeyBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiByZXF1aXJlZE1ldGFGaWVsZCByZXN0cmljdGlvbiBpcyBtZXQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICovXG4gICNjaGVja1JlcXVpcmVkTWV0YUZpZWxkcyAoZmlsZXMpIHtcbiAgICBjb25zdCB7IHJlcXVpcmVkTWV0YUZpZWxkcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuICAgIGNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgZm9yIChjb25zdCBmaWxlSUQgb2YgT2JqZWN0LmtleXMoZmlsZXMpKSB7XG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWlyZWRNZXRhRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChmaWxlLm1ldGEsIHJlcXVpcmVkTWV0YUZpZWxkc1tpXSkgfHwgZmlsZS5tZXRhW3JlcXVpcmVkTWV0YUZpZWxkc1tpXV0gPT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IFJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGRPbkZpbGUnLCB7IGZpbGVOYW1lOiBmaWxlLm5hbWUgfSl9YClcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZSwgc2hvd0luZm9ybWVyOiBmYWxzZSwgdGhyb3dFcnI6IGZhbHNlIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZVJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGQnKX1gLCBlcnJvcnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gZXJyb3IsIHNldHMgSW5mb3JtZXIgbWVzc2FnZSwgdGhlbiB0aHJvd3MgdGhlIGVycm9yLlxuICAgKiBFbWl0cyBhICdyZXN0cmljdGlvbi1mYWlsZWQnIGV2ZW50IGlmIGl04oCZcyBhIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0IHwgc3RyaW5nfSBlcnIg4oCUIEVycm9yIG9iamVjdCBvciBwbGFpbiBzdHJpbmcgbWVzc2FnZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2hvd0luZm9ybWVyPXRydWVdIOKAlCBTb21ldGltZXMgZGV2ZWxvcGVyIG1pZ2h0IHdhbnQgdG8gc2hvdyBJbmZvcm1lciBtYW51YWxseVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZmlsZT1udWxsXSDigJQgRmlsZSBvYmplY3QgdXNlZCB0byBlbWl0IHRoZSByZXN0cmljdGlvbiBlcnJvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRocm93RXJyPXRydWVdIOKAlCBFcnJvcnMgc2hvdWxkbuKAmXQgYmUgdGhyb3duLCBmb3IgZXhhbXBsZSwgaW4gYHVwbG9hZC1lcnJvcmAgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNzaG93T3JMb2dFcnJvckFuZFRocm93IChlcnIsIHsgc2hvd0luZm9ybWVyID0gdHJ1ZSwgZmlsZSA9IG51bGwsIHRocm93RXJyID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgPyBlcnIubWVzc2FnZSA6IGVyclxuICAgIGNvbnN0IGRldGFpbHMgPSAodHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgZXJyLmRldGFpbHMpID8gZXJyLmRldGFpbHMgOiAnJ1xuXG4gICAgLy8gUmVzdHJpY3Rpb24gZXJyb3JzIHNob3VsZCBiZSBsb2dnZWQsIGJ1dCBub3QgYXMgZXJyb3JzLFxuICAgIC8vIGFzIHRoZXkgYXJlIGV4cGVjdGVkIGFuZCBzaG93biBpbiB0aGUgVUkuXG4gICAgbGV0IGxvZ01lc3NhZ2VXaXRoRGV0YWlscyA9IG1lc3NhZ2VcbiAgICBpZiAoZGV0YWlscykge1xuICAgICAgbG9nTWVzc2FnZVdpdGhEZXRhaWxzICs9IGAgJHtkZXRhaWxzfWBcbiAgICB9XG4gICAgaWYgKGVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMpXG4gICAgICB0aGlzLmVtaXQoJ3Jlc3RyaWN0aW9uLWZhaWxlZCcsIGZpbGUsIGVycilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzLCAnZXJyb3InKVxuICAgIH1cblxuICAgIC8vIFNvbWV0aW1lcyBpbmZvcm1lciBoYXMgdG8gYmUgc2hvd24gbWFudWFsbHkgYnkgdGhlIGRldmVsb3BlcixcbiAgICAvLyBmb3IgZXhhbXBsZSwgaW4gYG9uQmVmb3JlRmlsZUFkZGVkYC5cbiAgICBpZiAoc2hvd0luZm9ybWVyKSB7XG4gICAgICB0aGlzLmluZm8oeyBtZXNzYWdlLCBkZXRhaWxzIH0sICdlcnJvcicsIHRoaXMub3B0cy5pbmZvVGltZW91dClcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyciA6IG5ldyBFcnJvcihlcnIpKVxuICAgIH1cbiAgfVxuXG4gICNhc3NlcnROZXdVcGxvYWRBbGxvd2VkIChmaWxlKSB7XG4gICAgY29uc3QgeyBhbGxvd05ld1VwbG9hZCB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYWxsb3dOZXdVcGxvYWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9Nb3JlRmlsZXNBbGxvd2VkJykpLCB7IGZpbGUgfSlcbiAgICB9XG4gIH1cblxuICBjaGVja0lmRmlsZUFscmVhZHlFeGlzdHMgKGZpbGVJRCkge1xuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKGZpbGVzW2ZpbGVJRF0gJiYgIWZpbGVzW2ZpbGVJRF0uaXNHaG9zdCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZmlsZSBzdGF0ZSBvYmplY3QgYmFzZWQgb24gdXNlci1wcm92aWRlZCBgYWRkRmlsZSgpYCBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlIHRoaXMgaXMgZXh0cmVtZWx5IHNpZGUtZWZmZWN0ZnVsIGFuZCBzaG91bGQgb25seSBiZSBkb25lIHdoZW4gYSBmaWxlIHN0YXRlIG9iamVjdFxuICAgKiB3aWxsIGJlIGFkZGVkIHRvIHN0YXRlIGltbWVkaWF0ZWx5IGFmdGVyd2FyZCFcbiAgICpcbiAgICogVGhlIGBmaWxlc2AgdmFsdWUgaXMgcGFzc2VkIGluIGJlY2F1c2UgaXQgbWF5IGJlIHVwZGF0ZWQgYnkgdGhlIGNhbGxlciB3aXRob3V0IHVwZGF0aW5nIHRoZSBzdG9yZS5cbiAgICovXG4gICNjaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdCAoZmlsZXMsIGZpbGVEZXNjcmlwdG9yKSB7XG4gICAgY29uc3QgZmlsZVR5cGUgPSBnZXRGaWxlVHlwZShmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlTmFtZSA9IGdldEZpbGVOYW1lKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZU5hbWUpLmV4dGVuc2lvblxuICAgIGNvbnN0IGlzUmVtb3RlID0gQm9vbGVhbihmaWxlRGVzY3JpcHRvci5pc1JlbW90ZSlcbiAgICBjb25zdCBmaWxlSUQgPSBnZW5lcmF0ZUZpbGVJRCh7XG4gICAgICAuLi5maWxlRGVzY3JpcHRvcixcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5jaGVja0lmRmlsZUFscmVhZHlFeGlzdHMoZmlsZUlEKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHsgZmlsZU5hbWUgfSkpXG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVycm9yLCB7IGZpbGU6IGZpbGVEZXNjcmlwdG9yIH0pXG4gICAgfVxuXG4gICAgY29uc3QgbWV0YSA9IGZpbGVEZXNjcmlwdG9yLm1ldGEgfHwge31cbiAgICBtZXRhLm5hbWUgPSBmaWxlTmFtZVxuICAgIG1ldGEudHlwZSA9IGZpbGVUeXBlXG5cbiAgICAvLyBgbnVsbGAgbWVhbnMgdGhlIHNpemUgaXMgdW5rbm93bi5cbiAgICBjb25zdCBzaXplID0gTnVtYmVyLmlzRmluaXRlKGZpbGVEZXNjcmlwdG9yLmRhdGEuc2l6ZSkgPyBmaWxlRGVzY3JpcHRvci5kYXRhLnNpemUgOiBudWxsXG5cbiAgICBsZXQgbmV3RmlsZSA9IHtcbiAgICAgIHNvdXJjZTogZmlsZURlc2NyaXB0b3Iuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YToge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkubWV0YSxcbiAgICAgICAgLi4ubWV0YSxcbiAgICAgIH0sXG4gICAgICB0eXBlOiBmaWxlVHlwZSxcbiAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yLmRhdGEsXG4gICAgICBwcm9ncmVzczoge1xuICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiAwLFxuICAgICAgICBieXRlc1RvdGFsOiBzaXplLFxuICAgICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IG51bGwsXG4gICAgICB9LFxuICAgICAgc2l6ZSxcbiAgICAgIGlzUmVtb3RlLFxuICAgICAgcmVtb3RlOiBmaWxlRGVzY3JpcHRvci5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlRGVzY3JpcHRvci5wcmV2aWV3LFxuICAgIH1cblxuICAgIGNvbnN0IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlRmlsZUFkZGVkKG5ld0ZpbGUsIGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwgeyBzaG93SW5mb3JtZXI6IGZhbHNlLCBmaWxlRGVzY3JpcHRvciB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSAnb2JqZWN0JyAmJiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgbmV3RmlsZSA9IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVzQXJyYXkgPSBPYmplY3Qua2V5cyhmaWxlcykubWFwKGkgPT4gZmlsZXNbaV0pXG4gICAgICB0aGlzLiNjaGVja1Jlc3RyaWN0aW9ucyhuZXdGaWxlLCBmaWxlc0FycmF5KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZTogbmV3RmlsZSB9KVxuICAgIH1cblxuICAgIHJldHVybiBuZXdGaWxlXG4gIH1cblxuICAvLyBTY2hlZHVsZSBhbiB1cGxvYWQgaWYgYGF1dG9Qcm9jZWVkYCBpcyBlbmFibGVkLlxuICAjc3RhcnRJZkF1dG9Qcm9jZWVkICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLmF1dG9Qcm9jZWVkICYmICF0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsXG4gICAgICAgIHRoaXMudXBsb2FkKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9nKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSwgNClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGZpbGUgdG8gYHN0YXRlLmZpbGVzYC4gVGhpcyB3aWxsIHJ1biBgb25CZWZvcmVGaWxlQWRkZWRgLFxuICAgKiB0cnkgdG8gZ3Vlc3MgZmlsZSB0eXBlIGluIGEgY2xldmVyIHdheSwgY2hlY2sgZmlsZSBhZ2FpbnN0IHJlc3RyaWN0aW9ucyxcbiAgICogYW5kIHN0YXJ0IGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWQgPT09IHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gYWRkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGlkIGZvciB0aGUgYWRkZWQgZmlsZVxuICAgKi9cbiAgYWRkRmlsZSAoZmlsZSkge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoZmlsZSlcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIGxldCBuZXdGaWxlID0gdGhpcy4jY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGUpXG5cbiAgICAvLyBVc2VycyBhcmUgYXNrZWQgdG8gcmUtc2VsZWN0IHJlY292ZXJlZCBmaWxlcyB3aXRob3V0IGRhdGEsXG4gICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgIGlmIChmaWxlc1tuZXdGaWxlLmlkXSAmJiBmaWxlc1tuZXdGaWxlLmlkXS5pc0dob3N0KSB7XG4gICAgICBuZXdGaWxlID0ge1xuICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgICBpc0dob3N0OiBmYWxzZSxcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCB0aGUgYmxvYiBpbiB0aGUgcmVzdG9yZWQgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIC4uLmZpbGVzLFxuICAgICAgICBbbmV3RmlsZS5pZF06IG5ld0ZpbGUsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBbbmV3RmlsZV0pXG4gICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZS5uYW1lfSwgJHtuZXdGaWxlLmlkfSwgbWltZSB0eXBlOiAke25ld0ZpbGUudHlwZX1gKVxuXG4gICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcblxuICAgIHJldHVybiBuZXdGaWxlLmlkXG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGZpbGVzIHRvIGBzdGF0ZS5maWxlc2AuIFNlZSB0aGUgYGFkZEZpbGUoKWAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGFkZGluZyBhIGZpbGUsIGl0IGlzIGxvZ2dlZCBhbmQgdGhlIHVzZXIgaXMgbm90aWZpZWQuXG4gICAqIFRoaXMgaXMgZ29vZCBmb3IgVUkgcGx1Z2lucywgYnV0IG5vdCBmb3IgcHJvZ3JhbW1hdGljIHVzZS5cbiAgICogUHJvZ3JhbW1hdGljIHVzZXJzIHNob3VsZCB1c3VhbGx5IHN0aWxsIHVzZSBgYWRkRmlsZSgpYCBvbiBpbmRpdmlkdWFsIGZpbGVzLlxuICAgKi9cbiAgYWRkRmlsZXMgKGZpbGVEZXNjcmlwdG9ycykge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKVxuXG4gICAgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gW11cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RmlsZSA9IHRoaXMuI2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlRGVzY3JpcHRvcnNbaV0pXG4gICAgICAgIC8vIFVzZXJzIGFyZSBhc2tlZCB0byByZS1zZWxlY3QgcmVjb3ZlcmVkIGZpbGVzIHdpdGhvdXQgZGF0YSxcbiAgICAgICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgICAgICBpZiAoZmlsZXNbbmV3RmlsZS5pZF0gJiYgZmlsZXNbbmV3RmlsZS5pZF0uaXNHaG9zdCkge1xuICAgICAgICAgIG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yc1tpXS5kYXRhLFxuICAgICAgICAgICAgaXNHaG9zdDogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCBibG9iIGluIGEgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICAgICAgfVxuICAgICAgICBmaWxlc1tuZXdGaWxlLmlkXSA9IG5ld0ZpbGVcbiAgICAgICAgbmV3RmlsZXMucHVzaChuZXdGaWxlKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcblxuICAgIG5ld0ZpbGVzLmZvckVhY2goKG5ld0ZpbGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBuZXdGaWxlcylcblxuICAgIGlmIChuZXdGaWxlcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgQWRkZWQgYmF0Y2ggb2YgJHtuZXdGaWxlcy5sZW5ndGh9IGZpbGVzYClcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMobmV3RmlsZXMpLmZvckVhY2goZmlsZUlEID0+IHtcbiAgICAgICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZXNbZmlsZUlEXS5uYW1lfVxcbiBpZDogJHtuZXdGaWxlc1tmaWxlSURdLmlkfVxcbiB0eXBlOiAke25ld0ZpbGVzW2ZpbGVJRF0udHlwZX1gKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAobmV3RmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ011bHRpcGxlIGVycm9ycyBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgZmlsZXM6XFxuJ1xuICAgICAgZXJyb3JzLmZvckVhY2goKHN1YkVycm9yKSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz0gYFxcbiAqICR7c3ViRXJyb3IubWVzc2FnZX1gXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmluZm8oe1xuICAgICAgICBtZXNzYWdlOiB0aGlzLmkxOG4oJ2FkZEJ1bGtGaWxlc0ZhaWxlZCcsIHsgc21hcnRfY291bnQ6IGVycm9ycy5sZW5ndGggfSksXG4gICAgICAgIGRldGFpbHM6IG1lc3NhZ2UsXG4gICAgICB9LCAnZXJyb3InLCB0aGlzLm9wdHMuaW5mb1RpbWVvdXQpXG5cbiAgICAgIGlmICh0eXBlb2YgQWdncmVnYXRlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgbWVzc2FnZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICBlcnIuZXJyb3JzID0gZXJyb3JzXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZpbGVzIChmaWxlSURzLCByZWFzb24pIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZFVwbG9hZHMgPSB7IC4uLmN1cnJlbnRVcGxvYWRzIH1cblxuICAgIGNvbnN0IHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBmaWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgICAgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0gPSBmaWxlc1tmaWxlSURdXG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkRmlsZXNbZmlsZUlEXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG4gICAgZnVuY3Rpb24gZmlsZUlzTm90UmVtb3ZlZCAodXBsb2FkRmlsZUlEKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZEZpbGVzW3VwbG9hZEZpbGVJRF0gPT09IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgY29uc3QgbmV3RmlsZUlEcyA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXS5maWxlSURzLmZpbHRlcihmaWxlSXNOb3RSZW1vdmVkKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHVwbG9hZCBpZiBubyBmaWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGl0IGFueW1vcmUuXG4gICAgICBpZiAobmV3RmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdXBkYXRlZFVwbG9hZHNbdXBsb2FkSURdID0ge1xuICAgICAgICAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sXG4gICAgICAgIGZpbGVJRHM6IG5ld0ZpbGVJRHMsXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHN0YXRlVXBkYXRlID0ge1xuICAgICAgY3VycmVudFVwbG9hZHM6IHVwZGF0ZWRVcGxvYWRzLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgZmlsZXMgd2VyZSByZW1vdmVkIC0gYWxsb3cgbmV3IHVwbG9hZHMsXG4gICAgLy8gYW5kIGNsZWFyIHJlY292ZXJlZFN0YXRlXG4gICAgaWYgKE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGF0ZVVwZGF0ZS5hbGxvd05ld1VwbG9hZCA9IHRydWVcbiAgICAgIHN0YXRlVXBkYXRlLmVycm9yID0gbnVsbFxuICAgICAgc3RhdGVVcGRhdGUucmVjb3ZlcmVkU3RhdGUgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZVVwZGF0ZSlcbiAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpXG4gICAgcmVtb3ZlZEZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pXG4gICAgfSlcblxuICAgIGlmIChyZW1vdmVkRmlsZUlEcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCAke3JlbW92ZWRGaWxlSURzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCBmaWxlczogJHtyZW1vdmVkRmlsZUlEcy5qb2luKCcsICcpfWApXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZSAoZmlsZUlELCByZWFzb24gPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmVGaWxlcyhbZmlsZUlEXSwgcmVhc29uKVxuICB9XG5cbiAgcGF1c2VSZXN1bWUgKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzXG4gICAgICAgICB8fCB0aGlzLmdldEZpbGUoZmlsZUlEKS51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHdhc1BhdXNlZCA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpLmlzUGF1c2VkIHx8IGZhbHNlXG4gICAgY29uc3QgaXNQYXVzZWQgPSAhd2FzUGF1c2VkXG5cbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZC1wYXVzZScsIGZpbGVJRCwgaXNQYXVzZWQpXG5cbiAgICByZXR1cm4gaXNQYXVzZWRcbiAgfVxuXG4gIHBhdXNlQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZVxuICAgICAgICAgICAgICYmIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlXSwgaXNQYXVzZWQ6IHRydWUgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgICB0aGlzLmVtaXQoJ3BhdXNlLWFsbCcpXG4gIH1cblxuICByZXN1bWVBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlXG4gICAgICAgICAgICAgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHtcbiAgICAgICAgLi4udXBkYXRlZEZpbGVzW2ZpbGVdLFxuICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc3VtZS1hbGwnKVxuICB9XG5cbiAgcmV0cnlBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBmaWxlc1RvUmV0cnkgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcihmaWxlID0+IHtcbiAgICAgIHJldHVybiB1cGRhdGVkRmlsZXNbZmlsZV0uZXJyb3JcbiAgICB9KVxuXG4gICAgZmlsZXNUb1JldHJ5LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0ge1xuICAgICAgICAuLi51cGRhdGVkRmlsZXNbZmlsZV0sXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmV0cnktYWxsJywgZmlsZXNUb1JldHJ5KVxuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoZmlsZXNUb1JldHJ5LCB7XG4gICAgICBmb3JjZUFsbG93TmV3VXBsb2FkOiB0cnVlLCAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIGNhbmNlbEFsbCAoKSB7XG4gICAgdGhpcy5lbWl0KCdjYW5jZWwtYWxsJylcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKVxuICAgIGlmIChmaWxlSURzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlcyhmaWxlSURzLCAnY2FuY2VsLWFsbCcpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICByZWNvdmVyZWRTdGF0ZTogbnVsbCxcbiAgICB9KVxuICB9XG5cbiAgcmV0cnlVcGxvYWQgKGZpbGVJRCkge1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoW2ZpbGVJRF0sIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUsIC8vIGNyZWF0ZSBuZXcgdXBsb2FkIGV2ZW4gaWYgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy4jcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuY2FuY2VsQWxsKClcbiAgfVxuXG4gIGxvZ291dCAoKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgaWYgKHBsdWdpbi5wcm92aWRlciAmJiBwbHVnaW4ucHJvdmlkZXIubG9nb3V0KSB7XG4gICAgICAgIHBsdWdpbi5wcm92aWRlci5sb2dvdXQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjYWxjdWxhdGVQcm9ncmVzcyAoZmlsZSwgZGF0YSkge1xuICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gYnl0ZXNUb3RhbCBtYXkgYmUgbnVsbCBvciB6ZXJvOyBpbiB0aGF0IGNhc2Ugd2UgY2FuJ3QgZGl2aWRlIGJ5IGl0XG4gICAgY29uc3QgY2FuSGF2ZVBlcmNlbnRhZ2UgPSBOdW1iZXIuaXNGaW5pdGUoZGF0YS5ieXRlc1RvdGFsKSAmJiBkYXRhLmJ5dGVzVG90YWwgPiAwXG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgLi4udGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogY2FuSGF2ZVBlcmNlbnRhZ2VcbiAgICAgICAgICA/IE1hdGgucm91bmQoKGRhdGEuYnl0ZXNVcGxvYWRlZCAvIGRhdGEuYnl0ZXNUb3RhbCkgKiAxMDApXG4gICAgICAgICAgOiAwLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MgKCkge1xuICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBwcm9ncmVzcywgdXNpbmcgdGhlIG51bWJlciBvZiBmaWxlcyBjdXJyZW50bHkgdXBsb2FkaW5nLFxuICAgIC8vIG11bHRpcGxpZWQgYnkgMTAwIGFuZCB0aGUgc3VtbSBvZiBpbmRpdmlkdWFsIHByb2dyZXNzIG9mIGVhY2ggZmlsZVxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpXG5cbiAgICBjb25zdCBpblByb2dyZXNzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgICAgIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuICAgICAgICB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgfSlcblxuICAgIGlmIChpblByb2dyZXNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIDApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzczogMCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgIT0gbnVsbClcbiAgICBjb25zdCB1bnNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsID09IG51bGwpXG5cbiAgICBpZiAoc2l6ZWRGaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzTWF4ID0gaW5Qcm9ncmVzcy5sZW5ndGggKiAxMDBcbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9ncmVzcyA9IHVuc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgZmlsZS5wcm9ncmVzcy5wZXJjZW50YWdlXG4gICAgICB9LCAwKVxuICAgICAgY29uc3QgdG90YWxQcm9ncmVzcyA9IE1hdGgucm91bmQoKGN1cnJlbnRQcm9ncmVzcyAvIHByb2dyZXNzTWF4KSAqIDEwMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbFxuICAgIH0sIDApXG4gICAgY29uc3QgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aFxuICAgIHRvdGFsU2l6ZSArPSBhdmVyYWdlU2l6ZSAqIHVuc2l6ZWRGaWxlcy5sZW5ndGhcblxuICAgIGxldCB1cGxvYWRlZFNpemUgPSAwXG4gICAgc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1VwbG9hZGVkXG4gICAgfSlcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdXBsb2FkZWRTaXplICs9IChhdmVyYWdlU2l6ZSAqIChmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2UgfHwgMCkpIC8gMTAwXG4gICAgfSlcblxuICAgIGxldCB0b3RhbFByb2dyZXNzID0gdG90YWxTaXplID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogTWF0aC5yb3VuZCgodXBsb2FkZWRTaXplIC8gdG90YWxTaXplKSAqIDEwMClcblxuICAgIC8vIGhvdCBmaXgsIGJlY2F1c2U6XG4gICAgLy8gdXBsb2FkZWRTaXplIGVuZGVkIHVwIGxhcmdlciB0aGFuIHRvdGFsU2l6ZSwgcmVzdWx0aW5nIGluIDEzMjUlIHRvdGFsXG4gICAgaWYgKHRvdGFsUHJvZ3Jlc3MgPiAxMDApIHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3MgPSAxMDBcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzcyB9KVxuICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCB0b3RhbFByb2dyZXNzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBsaXN0ZW5lcnMgZm9yIGFsbCBnbG9iYWwgYWN0aW9ucywgbGlrZTpcbiAgICogYGVycm9yYCwgYGZpbGUtcmVtb3ZlZGAsIGB1cGxvYWQtcHJvZ3Jlc3NgXG4gICAqL1xuICAjYWRkTGlzdGVuZXJzICgpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZmlsZV1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3Jlc3BvbnNlXVxuICAgICAqL1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnJvciwgZmlsZSwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGxldCBlcnJvck1zZyA9IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSBgICR7ZXJyb3IuZGV0YWlsc31gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3JNc2cgfSlcblxuICAgICAgaWYgKGZpbGUgIT0gbnVsbCAmJiBmaWxlLmlkIGluIHRoaXMuZ2V0U3RhdGUoKS5maWxlcykge1xuICAgICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTXNnLFxuICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ2Vycm9yJywgZXJyb3JIYW5kbGVyKVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGUsIGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgZXJyb3JIYW5kbGVyKGVycm9yLCBmaWxlLCByZXNwb25zZSlcblxuICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjb25zdCBuZXdFcnJvciA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICBuZXdFcnJvci5kZXRhaWxzID0gZXJyb3IubWVzc2FnZVxuICAgICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICAgIG5ld0Vycm9yLmRldGFpbHMgKz0gYCAke2Vycm9yLmRldGFpbHN9YFxuICAgICAgICB9XG4gICAgICAgIG5ld0Vycm9yLm1lc3NhZ2UgPSB0aGlzLmkxOG4oJ2ZhaWxlZFRvVXBsb2FkJywgeyBmaWxlOiBmaWxlLm5hbWUgfSlcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXdFcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyb3IsIHtcbiAgICAgICAgICB0aHJvd0VycjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3RhcnRlZCcsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICB1cGxvYWRTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgICAgYnl0ZXNUb3RhbDogZmlsZS5zaXplLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcylcblxuICAgIHRoaXMub24oJ3VwbG9hZC1zdWNjZXNzJywgKGZpbGUsIHVwbG9hZFJlc3ApID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50UHJvZ3Jlc3MgPSB0aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3NcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAuLi5jdXJyZW50UHJvZ3Jlc3MsXG4gICAgICAgICAgcG9zdHByb2Nlc3M6IHRoaXMuI3Bvc3RQcm9jZXNzb3JzLnNpemUgPiAwID8ge1xuICAgICAgICAgICAgbW9kZTogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiB0cnVlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMCxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkOiBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2U6IHVwbG9hZFJlc3AsXG4gICAgICAgIHVwbG9hZFVSTDogdXBsb2FkUmVzcC51cGxvYWRVUkwsXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlbW90ZSBwcm92aWRlcnMgc29tZXRpbWVzIGRvbid0IHRlbGwgdXMgdGhlIGZpbGUgc2l6ZSxcbiAgICAgIC8vIGJ1dCB3ZSBjYW4ga25vdyBob3cgbWFueSBieXRlcyB3ZSB1cGxvYWRlZCBvbmNlIHRoZSB1cGxvYWQgaXMgY29tcGxldGUuXG4gICAgICBpZiAoZmlsZS5zaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICAgIHNpemU6IHVwbG9hZFJlc3AuYnl0ZXNVcGxvYWRlZCB8fCBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiB7IC4uLnRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcywgcHJlcHJvY2VzczogcHJvZ3Jlc3MgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICAgIGZpbGVzW2ZpbGUuaWRdID0geyAuLi5maWxlc1tmaWxlLmlkXSwgcHJvZ3Jlc3M6IHsgLi4uZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MgfSB9XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZSwgcHJvZ3Jlc3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczogeyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsIHBvc3Rwcm9jZXNzOiBwcm9ncmVzcyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzLFxuICAgICAgfVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSB7XG4gICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLFxuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgZGVsZXRlIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdyZXN0b3JlZCcsICgpID0+IHtcbiAgICAgIC8vIEZpbGVzIG1heSBoYXZlIGNoYW5nZWQtLWVuc3VyZSBwcm9ncmVzcyBpcyBzdGlsbCBhY2N1cmF0ZS5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIC8vIHNob3cgaW5mb3JtZXIgaWYgb2ZmbGluZVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgc2V0VGltZW91dCh0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMsIDMwMDApXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT25saW5lU3RhdHVzICgpIHtcbiAgICBjb25zdCBvbmxpbmVcbiAgICAgID0gdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lXG4gICAgICAgIDogdHJ1ZVxuICAgIGlmICghb25saW5lKSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9mZmxpbmUnKVxuICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignbm9JbnRlcm5ldENvbm5lY3Rpb24nKSwgJ2Vycm9yJywgMClcbiAgICAgIHRoaXMud2FzT2ZmbGluZSA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdpcy1vbmxpbmUnKVxuICAgICAgaWYgKHRoaXMud2FzT2ZmbGluZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2JhY2stb25saW5lJylcbiAgICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignY29ubmVjdGVkVG9JbnRlcm5ldCcpLCAnc3VjY2VzcycsIDMwMDApXG4gICAgICAgIHRoaXMud2FzT2ZmbGluZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI3VwZGF0ZU9ubGluZVN0YXR1cyA9IHRoaXMudXBkYXRlT25saW5lU3RhdHVzLmJpbmQodGhpcylcblxuICBnZXRJRCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBsdWdpbiB3aXRoIENvcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBQbHVnaW4gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gb2JqZWN0IHdpdGggb3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gUGx1Z2luXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHNlbGYgZm9yIGNoYWluaW5nXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gIHVzZSAoUGx1Z2luLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBQbHVnaW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCAke1BsdWdpbiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBQbHVnaW59LmBcbiAgICAgICAgKyAnIFBsZWFzZSB2ZXJpZnkgdGhhdCB0aGUgcGx1Z2luIHdhcyBpbXBvcnRlZCBhbmQgc3BlbGxlZCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgLy8gSW5zdGFudGlhdGVcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMsIG9wdHMpXG4gICAgY29uc3QgcGx1Z2luSWQgPSBwbHVnaW4uaWRcblxuICAgIGlmICghcGx1Z2luSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGFuIGlkJylcbiAgICB9XG5cbiAgICBpZiAoIXBsdWdpbi50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhIHR5cGUnKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgY29uc3QgbXNnID0gYEFscmVhZHkgZm91bmQgYSBwbHVnaW4gbmFtZWQgJyR7ZXhpc3RzUGx1Z2luQWxyZWFkeS5pZH0nLiBgXG4gICAgICAgICsgYFRyaWVkIHRvIHVzZTogJyR7cGx1Z2luSWR9Jy5cXG5gXG4gICAgICAgICsgJ1VwcHkgcGx1Z2lucyBtdXN0IGhhdmUgdW5pcXVlIGBpZGAgb3B0aW9ucy4gU2VlIGh0dHBzOi8vdXBweS5pby9kb2NzL3BsdWdpbnMvI2lkLidcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgaWYgKFBsdWdpbi5WRVJTSU9OKSB7XG4gICAgICB0aGlzLmxvZyhgVXNpbmcgJHtwbHVnaW5JZH0gdiR7UGx1Z2luLlZFUlNJT059YClcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnR5cGUgaW4gdGhpcy4jcGx1Z2lucykge1xuICAgICAgdGhpcy4jcGx1Z2luc1twbHVnaW4udHlwZV0ucHVzaChwbHVnaW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3BsdWdpbnNbcGx1Z2luLnR5cGVdID0gW3BsdWdpbl1cbiAgICB9XG4gICAgcGx1Z2luLmluc3RhbGwoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG9uZSBQbHVnaW4gYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIHBsdWdpbiBpZFxuICAgKiBAcmV0dXJucyB7QmFzZVBsdWdpbnx1bmRlZmluZWR9XG4gICAqL1xuICBnZXRQbHVnaW4gKGlkKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW5zIG9mIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykpIHtcbiAgICAgIGNvbnN0IGZvdW5kUGx1Z2luID0gcGx1Z2lucy5maW5kKHBsdWdpbiA9PiBwbHVnaW4uaWQgPT09IGlkKVxuICAgICAgaWYgKGZvdW5kUGx1Z2luICE9IG51bGwpIHJldHVybiBmb3VuZFBsdWdpblxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBbU3ltYm9sLmZvcigndXBweSB0ZXN0OiBnZXRQbHVnaW5zJyldICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuI3BsdWdpbnNbdHlwZV1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIGB1c2VgZCBwbHVnaW5zLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCB3aWxsIGJlIHJ1biBvbiBlYWNoIHBsdWdpblxuICAgKi9cbiAgaXRlcmF0ZVBsdWdpbnMgKG1ldGhvZCkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykuZmxhdCgxKS5mb3JFYWNoKG1ldGhvZClcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKGBSZW1vdmluZyBwbHVnaW4gJHtpbnN0YW5jZS5pZH1gKVxuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKVxuXG4gICAgaWYgKGluc3RhbmNlLnVuaW5zdGFsbCkge1xuICAgICAgaW5zdGFuY2UudW5pbnN0YWxsKClcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy4jcGx1Z2luc1tpbnN0YW5jZS50eXBlXVxuICAgIC8vIGxpc3QuaW5kZXhPZiBmYWlsZWQgaGVyZSwgYmVjYXVzZSBWdWUzIGNvbnZlcnRlZCB0aGUgcGx1Z2luIGluc3RhbmNlXG4gICAgLy8gdG8gYSBQcm94eSBvYmplY3QsIHdoaWNoIGZhaWxlZCB0aGUgc3RyaWN0IGNvbXBhcmlzb24gdGVzdDpcbiAgICAvLyBvYmogIT09IG9ialByb3h5XG4gICAgY29uc3QgaW5kZXggPSBsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGluc3RhbmNlLmlkKVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZFN0YXRlID0ge1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICAuLi5zdGF0ZS5wbHVnaW5zLFxuICAgICAgICBbaW5zdGFuY2UuaWRdOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHVwZGF0ZWRTdGF0ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYWxsIHBsdWdpbnMgYW5kIGNsb3NlIGRvd24gdGhpcyBVcHB5IGluc3RhbmNlLlxuICAgKi9cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMubG9nKGBDbG9zaW5nIFVwcHkgaW5zdGFuY2UgJHt0aGlzLm9wdHMuaWR9OiByZW1vdmluZyBhbGwgZmlsZXMgYW5kIHVuaW5zdGFsbGluZyBwbHVnaW5zYClcblxuICAgIHRoaXMucmVzZXQoKVxuXG4gICAgdGhpcy4jc3RvcmVVbnN1YnNjcmliZSgpXG5cbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlUGx1Z2luKHBsdWdpbilcbiAgICB9KVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgfVxuICB9XG5cbiAgaGlkZUluZm8gKCkge1xuICAgIGNvbnN0IHsgaW5mbyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgaW5mbzogaW5mby5zbGljZSgxKSB9KVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLWhpZGRlbicpXG4gIH1cblxuICAvKipcbiAgICogU2V0IGluZm8gbWVzc2FnZSBpbiBgc3RhdGUuaW5mb2AsIHNvIHRoYXQgVUkgcGx1Z2lucyBsaWtlIGBJbmZvcm1lcmBcbiAgICogY2FuIGRpc3BsYXkgdGhlIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgb2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJ5IHRoZSBpbmZvcm1lclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb25dXG4gICAqL1xuICBpbmZvIChtZXNzYWdlLCB0eXBlID0gJ2luZm8nLCBkdXJhdGlvbiA9IDMwMDApIHtcbiAgICBjb25zdCBpc0NvbXBsZXhNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IFtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmluZm8sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIG1lc3NhZ2U6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHM6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLmRldGFpbHMgOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGVJbmZvKCksIGR1cmF0aW9uKVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLXZpc2libGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3NlcyBtZXNzYWdlcyB0byBhIGZ1bmN0aW9uLCBwcm92aWRlZCBpbiBgb3B0cy5sb2dnZXJgLlxuICAgKiBJZiBgb3B0cy5sb2dnZXI6IFVwcHkuZGVidWdMb2dnZXJgIG9yIGBvcHRzLmRlYnVnOiB0cnVlYCwgbG9ncyB0byB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobWVzc2FnZSwgdHlwZSkge1xuICAgIGNvbnN0IHsgbG9nZ2VyIH0gPSB0aGlzLm9wdHNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzogbG9nZ2VyLmVycm9yKG1lc3NhZ2UpOyBicmVha1xuICAgICAgY2FzZSAnd2FybmluZyc6IGxvZ2dlci53YXJuKG1lc3NhZ2UpOyBicmVha1xuICAgICAgZGVmYXVsdDogbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpOyBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIGFuIHVwbG9hZCBieSBpdHMgSUQuXG4gICAqL1xuICByZXN0b3JlICh1cGxvYWRJRCkge1xuICAgIHRoaXMubG9nKGBDb3JlOiBhdHRlbXB0aW5nIHRvIHJlc3RvcmUgdXBsb2FkIFwiJHt1cGxvYWRJRH1cImApXG5cbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0pIHtcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vbmV4aXN0ZW50IHVwbG9hZCcpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHVwbG9hZCBmb3IgYSBidW5jaCBvZiBmaWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBmaWxlSURzIEZpbGUgSURzIHRvIGluY2x1ZGUgaW4gdGhpcyB1cGxvYWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IElEIG9mIHRoaXMgdXBsb2FkLlxuICAgKi9cbiAgI2NyZWF0ZVVwbG9hZCAoZmlsZUlEcywgb3B0cyA9IHt9KSB7XG4gICAgLy8gdXBweS5yZXRyeUFsbCBzZXRzIHRoaXMgdG8gdHJ1ZSDigJQgd2hlbiByZXRyeWluZyB3ZSB3YW50IHRvIGlnbm9yZSBgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlYFxuICAgIGNvbnN0IHsgZm9yY2VBbGxvd05ld1VwbG9hZCA9IGZhbHNlIH0gPSBvcHRzXG5cbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgaWYgKCFhbGxvd05ld1VwbG9hZCAmJiAhZm9yY2VBbGxvd05ld1VwbG9hZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHVwbG9hZDogYWxyZWFkeSB1cGxvYWRpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IG5hbm9pZCgpXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZCcsIHtcbiAgICAgIGlkOiB1cGxvYWRJRCxcbiAgICAgIGZpbGVJRHMsXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRoaXMub3B0cy5hbGxvd011bHRpcGxlVXBsb2FkQmF0Y2hlcyAhPT0gZmFsc2UgJiYgdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcblxuICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgLi4uY3VycmVudFVwbG9hZHMsXG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDAsXG4gICAgICAgICAgcmVzdWx0OiB7fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiB1cGxvYWRJRFxuICB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogY3JlYXRlVXBsb2FkJyldICguLi5hcmdzKSB7IHJldHVybiB0aGlzLiNjcmVhdGVVcGxvYWQoLi4uYXJncykgfVxuXG4gICNnZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuI2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkID0geyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHJlc3VsdDogeyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0ucmVzdWx0LCAuLi5kYXRhIH0gfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IHsgLi4uY3VycmVudFVwbG9hZHMsIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWQgfSxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiB1cGxvYWQsIGVnLiBpZiBpdCBoYXMgYmVlbiBjYW5jZWxlZCBvciBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJRCBUaGUgSUQgb2YgdGhlIHVwbG9hZC5cbiAgICovXG4gICNyZW1vdmVVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgY3VycmVudFVwbG9hZHMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcyB9XG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkcyxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhbiB1cGxvYWQuIFRoaXMgcGlja3MgdXAgd2hlcmUgaXQgbGVmdCBvZmYgaW4gY2FzZSB0aGUgdXBsb2FkIGlzIGJlaW5nIHJlc3RvcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgI3J1blVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBsZXQgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgbGV0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICBjb25zdCByZXN0b3JlU3RlcCA9IGN1cnJlbnRVcGxvYWQuc3RlcCB8fCAwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMuI3ByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLiN1cGxvYWRlcnMsXG4gICAgICAuLi50aGlzLiNwb3N0UHJvY2Vzc29ycyxcbiAgICBdXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobGV0IHN0ZXAgPSByZXN0b3JlU3RlcDsgc3RlcCA8IHN0ZXBzLmxlbmd0aDsgc3RlcCsrKSB7XG4gICAgICAgIGlmICghY3VycmVudFVwbG9hZCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm4gPSBzdGVwc1tzdGVwXVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRVcGxvYWQgPSB7XG4gICAgICAgICAgLi4uY3VycmVudFVwbG9hZCxcbiAgICAgICAgICBzdGVwLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzLFxuICAgICAgICAgICAgW3VwbG9hZElEXTogdXBkYXRlZFVwbG9hZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRPRE8gZ2l2ZSB0aGlzIHRoZSBgdXBkYXRlZFVwbG9hZGAgb2JqZWN0IGFzIGl0cyBvbmx5IHBhcmFtZXRlciBtYXliZT9cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdoZW4gbW9yZSBtZXRhZGF0YSBtYXkgYmUgYWRkZWQgdG8gdGhlIHVwbG9hZCB0aGlzIHdvdWxkIGtlZXAgZ2V0dGluZyBtb3JlIHBhcmFtZXRlcnNcbiAgICAgICAgYXdhaXQgZm4odXBkYXRlZFVwbG9hZC5maWxlSURzLCB1cGxvYWRJRClcblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudFVwbG9hZCB2YWx1ZSBpbiBjYXNlIGl0IHdhcyBtb2RpZmllZCBhc3luY2hyb25vdXNseS5cbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNcbiAgICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHRocm93IGVyclxuICAgIH1cblxuICAgIC8vIFNldCByZXN1bHQgZGF0YS5cbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgLy8gTWFyayBwb3N0cHJvY2Vzc2luZyBzdGVwIGFzIGNvbXBsZXRlIGlmIG5lY2Vzc2FyeTsgdGhpcyBhZGRyZXNzZXMgYSBjYXNlIHdoZXJlIHdlIG1pZ2h0IGdldFxuICAgICAgLy8gc3R1Y2sgaW4gdGhlIHBvc3Rwcm9jZXNzaW5nIFVJIHdoaWxlIHRoZSB1cGxvYWQgaXMgZnVsbHkgY29tcGxldGUuXG4gICAgICAvLyBJZiB0aGUgcG9zdHByb2Nlc3Npbmcgc3RlcHMgZG8gbm90IGRvIGFueSB3b3JrLCB0aGV5IG1heSBub3QgZW1pdCBwb3N0cHJvY2Vzc2luZyBldmVudHMgYXRcbiAgICAgIC8vIGFsbCwgYW5kIG5ldmVyIG1hcmsgdGhlIHBvc3Rwcm9jZXNzaW5nIGFzIGNvbXBsZXRlLiBUaGlzIGlzIGZpbmUgb24gaXRzIG93biBidXQgd2VcbiAgICAgIC8vIGludHJvZHVjZWQgY29kZSBpbiB0aGUgQHVwcHkvY29yZSB1cGxvYWQtc3VjY2VzcyBoYW5kbGVyIHRvIHByZXBhcmUgcG9zdHByb2Nlc3NpbmcgcHJvZ3Jlc3NcbiAgICAgIC8vIHN0YXRlIGlmIGFueSBwb3N0cHJvY2Vzc29ycyBhcmUgcmVnaXN0ZXJlZC4gVGhhdCBpcyB0byBhdm9pZCBhIFwiZmxhc2ggb2YgY29tcGxldGVkIHN0YXRlXCJcbiAgICAgIC8vIGJlZm9yZSB0aGUgcG9zdHByb2Nlc3NpbmcgcGx1Z2lucyBjYW4gZW1pdCBldmVudHMuXG4gICAgICAvL1xuICAgICAgLy8gU28sIGp1c3QgaW4gY2FzZSBhbiB1cGxvYWQgd2l0aCBwb3N0cHJvY2Vzc2luZyBwbHVnaW5zICpoYXMqIGNvbXBsZXRlZCAqd2l0aG91dCogZW1pdHRpbmdcbiAgICAgIC8vIHBvc3Rwcm9jZXNzaW5nIGNvbXBsZXRpb24sIHdlIGRvIGl0IGluc3RlYWQuXG4gICAgICBjdXJyZW50VXBsb2FkLmZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGUoZmlsZUlEKVxuICAgICAgICBpZiAoZmlsZSAmJiBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0cHJvY2Vzcy1jb21wbGV0ZScsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gY3VycmVudFVwbG9hZC5maWxlSURzLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmVycm9yKVxuICAgICAgY29uc3QgZmFpbGVkID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgICAgYXdhaXQgdGhpcy5hZGRSZXN1bHREYXRhKHVwbG9hZElELCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCwgdXBsb2FkSUQgfSlcblxuICAgICAgLy8gVXBkYXRlIGN1cnJlbnRVcGxvYWQgdmFsdWUgaW4gY2FzZSBpdCB3YXMgbW9kaWZpZWQgYXN5bmNocm9ub3VzbHkuXG4gICAgICBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1xuICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgIH1cbiAgICAvLyBFbWl0IGNvbXBsZXRpb24gZXZlbnRzLlxuICAgIC8vIFRoaXMgaXMgaW4gYSBzZXBhcmF0ZSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBgY3VycmVudFVwbG9hZHNgIHZhcmlhYmxlXG4gICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAvLyB0byBhbiBvdXRkYXRlZCBvYmplY3Qgd2l0aG91dCB0aGUgYC5yZXN1bHRgIHByb3BlcnR5LlxuICAgIGxldCByZXN1bHRcbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgcmVzdWx0ID0gY3VycmVudFVwbG9hZC5yZXN1bHRcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCByZXN1bHQpXG5cbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcmVzdWx0IGZvciBhbiB1cGxvYWQgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke3VwbG9hZElEfWApXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiB1cGxvYWQgZm9yIGFsbCB0aGUgZmlsZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBiZWluZyB1cGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICB1cGxvYWQgKCkge1xuICAgIGlmICghdGhpcy4jcGx1Z2lucy51cGxvYWRlcj8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvZygnTm8gdXBsb2FkZXIgdHlwZSBwbHVnaW5zIGFyZSB1c2VkJywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIGxldCB7IGZpbGVzIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG9uQmVmb3JlVXBsb2FkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlVXBsb2FkKGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlVXBsb2FkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IHN0YXJ0aW5nIHRoZSB1cGxvYWQgYmVjYXVzZSBvbkJlZm9yZVVwbG9hZCByZXR1cm5lZCBmYWxzZScpKVxuICAgIH1cblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCAmJiB0eXBlb2Ygb25CZWZvcmVVcGxvYWRSZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBmaWxlcyA9IG9uQmVmb3JlVXBsb2FkUmVzdWx0XG4gICAgICAvLyBVcGRhdGluZyBmaWxlcyBpbiBzdGF0ZSwgYmVjYXVzZSB1cGxvYWRlciBwbHVnaW5zIHJlY2VpdmUgZmlsZSBJRHMsXG4gICAgICAvLyBhbmQgdGhlbiBmZXRjaCB0aGUgYWN0dWFsIGZpbGUgb2JqZWN0IGZyb20gc3RhdGVcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmaWxlcyxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuI2NoZWNrTWluTnVtYmVyT2ZGaWxlcyhmaWxlcylcbiAgICAgICAgdGhpcy4jY2hlY2tSZXF1aXJlZE1ldGFGaWVsZHMoZmlsZXMpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgLy8gZ2V0IGEgbGlzdCBvZiBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgYXNzaWduZWQgdG8gdXBsb2Fkc1xuICAgICAgICBjb25zdCBjdXJyZW50bHlVcGxvYWRpbmdGaWxlcyA9IE9iamVjdC52YWx1ZXMoY3VycmVudFVwbG9hZHMpLmZsYXRNYXAoY3VyciA9PiBjdXJyLmZpbGVJRHMpXG5cbiAgICAgICAgY29uc3Qgd2FpdGluZ0ZpbGVJRHMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpXG4gICAgICAgICAgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG4gICAgICAgICAgaWYgKCghZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKSAmJiAoY3VycmVudGx5VXBsb2FkaW5nRmlsZXMuaW5kZXhPZihmaWxlSUQpID09PSAtMSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHtcbiAgICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUgKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcikge1xuICBpZiAoZmlsZURlc2NyaXB0b3IubmFtZSkge1xuICAgIHJldHVybiBmaWxlRGVzY3JpcHRvci5uYW1lXG4gIH1cblxuICBpZiAoZmlsZVR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJykge1xuICAgIHJldHVybiBgJHtmaWxlVHlwZS5zcGxpdCgnLycpWzBdfS4ke2ZpbGVUeXBlLnNwbGl0KCcvJylbMV19YFxuICB9XG5cbiAgcmV0dXJuICdub25hbWUnXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgVXBweSA9IHJlcXVpcmUoJy4vVXBweScpXG5jb25zdCBVSVBsdWdpbiA9IHJlcXVpcmUoJy4vVUlQbHVnaW4nKVxuY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJy4vQmFzZVBsdWdpbicpXG5jb25zdCB7IGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG5tb2R1bGUuZXhwb3J0cy5VSVBsdWdpbiA9IFVJUGx1Z2luXG5tb2R1bGUuZXhwb3J0cy5CYXNlUGx1Z2luID0gQmFzZVBsdWdpblxubW9kdWxlLmV4cG9ydHMuZGVidWdMb2dnZXIgPSBkZWJ1Z0xvZ2dlclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuY29uc3QgZ2V0VGltZVN0YW1wID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFRpbWVTdGFtcCcpXG5cbi8vIFN3YWxsb3cgYWxsIGxvZ3MsIGV4Y2VwdCBlcnJvcnMuXG4vLyBkZWZhdWx0IGlmIGxvZ2dlciBpcyBub3Qgc2V0IG9yIGRlYnVnOiBmYWxzZVxuY29uc3QganVzdEVycm9yc0xvZ2dlciA9IHtcbiAgZGVidWc6ICgpID0+IHt9LFxuICB3YXJuOiAoKSA9PiB7fSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxufVxuXG4vLyBQcmludCBsb2dzIHRvIGNvbnNvbGUgd2l0aCBuYW1lc3BhY2UgKyB0aW1lc3RhbXAsXG4vLyBzZXQgYnkgbG9nZ2VyOiBVcHB5LmRlYnVnTG9nZ2VyIG9yIGRlYnVnOiB0cnVlXG5jb25zdCBkZWJ1Z0xvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBjb25zb2xlLmRlYnVnKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gY29uc29sZS53YXJuKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IGNvbnNvbGUuZXJyb3IoYFtVcHB5XSBbJHtnZXRUaW1lU3RhbXAoKX1dYCwgLi4uYXJncyksXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBqdXN0RXJyb3JzTG9nZ2VyLFxuICBkZWJ1Z0xvZ2dlcixcbn1cbiIsIi8vIEVkZ2UgMTUueCBkb2VzIG5vdCBmaXJlICdwcm9ncmVzcycgZXZlbnRzIG9uIHVwbG9hZHMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzk0NVxuLy8gQW5kIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMjI0NTEwL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzICh1c2VyQWdlbnQpIHtcbiAgLy8gQWxsb3cgcGFzc2luZyBpbiB1c2VyQWdlbnQgZm9yIHRlc3RzXG4gIGlmICh1c2VyQWdlbnQgPT0gbnVsbCkge1xuICAgIHVzZXJBZ2VudCA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID8gbmF2aWdhdG9yLnVzZXJBZ2VudCA6IG51bGxcbiAgfVxuICAvLyBBc3N1bWUgaXQgd29ya3MgYmVjYXVzZSBiYXNpY2FsbHkgZXZlcnl0aGluZyBzdXBwb3J0cyBwcm9ncmVzcyBldmVudHMuXG4gIGlmICghdXNlckFnZW50KSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IG0gPSAvRWRnZVxcLyhcXGQrXFwuXFxkKykvLmV4ZWModXNlckFnZW50KVxuICBpZiAoIW0pIHJldHVybiB0cnVlXG5cbiAgY29uc3QgZWRnZVZlcnNpb24gPSBtWzFdXG4gIGxldCBbbWFqb3IsIG1pbm9yXSA9IGVkZ2VWZXJzaW9uLnNwbGl0KCcuJylcbiAgbWFqb3IgPSBwYXJzZUludChtYWpvciwgMTApXG4gIG1pbm9yID0gcGFyc2VJbnQobWlub3IsIDEwKVxuXG4gIC8vIFdvcmtlZCBiZWZvcmU6XG4gIC8vIEVkZ2UgNDAuMTUwNjMuMC4wXG4gIC8vIE1pY3Jvc29mdCBFZGdlSFRNTCAxNS4xNTA2M1xuICBpZiAobWFqb3IgPCAxNSB8fCAobWFqb3IgPT09IDE1ICYmIG1pbm9yIDwgMTUwNjMpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIEZpeGVkIGluOlxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTguMTgyMThcbiAgaWYgKG1ham9yID4gMTggfHwgKG1ham9yID09PSAxOCAmJiBtaW5vciA+PSAxODIxOCkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gb3RoZXIgdmVyc2lvbnMgZG9uJ3Qgd29yay5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJjb25zdCB7IFVJUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHRvQXJyYXkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvdG9BcnJheScpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmlsZUlucHV0IGV4dGVuZHMgVUlQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnRmlsZUlucHV0J1xuICAgIHRoaXMudGl0bGUgPSAnRmlsZSBJbnB1dCdcbiAgICB0aGlzLnR5cGUgPSAnYWNxdWlyZXInXG5cbiAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIC8vIFRoZSBzYW1lIGtleSBpcyB1c2VkIGZvciB0aGUgc2FtZSBwdXJwb3NlIGJ5IEB1cHB5L3JvYm9kb2cncyBgZm9ybSgpYCBBUEksIGJ1dCBvdXJcbiAgICAgICAgLy8gbG9jYWxlIHBhY2sgc2NyaXB0cyBjYW4ndCBhY2Nlc3MgaXQgaW4gUm9ib2RvZy4gSWYgaXQgaXMgdXBkYXRlZCBoZXJlLCBpdCBzaG91bGRcbiAgICAgICAgLy8gYWxzbyBiZSB1cGRhdGVkIHRoZXJlIVxuICAgICAgICBjaG9vc2VGaWxlczogJ0Nob29zZSBmaWxlcycsXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgcHJldHR5OiB0cnVlLFxuICAgICAgaW5wdXROYW1lOiAnZmlsZXNbXScsXG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVJbnB1dENoYW5nZSA9IHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGFkZEZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZmlsZXMubWFwKChmaWxlKSA9PiAoe1xuICAgICAgc291cmNlOiB0aGlzLmlkLFxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgZGF0YTogZmlsZSxcbiAgICB9KSlcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnVwcHkuYWRkRmlsZXMoZGVzY3JpcHRvcnMpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGVycilcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZSAoZXZlbnQpIHtcbiAgICB0aGlzLnVwcHkubG9nKCdbRmlsZUlucHV0XSBTb21ldGhpbmcgc2VsZWN0ZWQgdGhyb3VnaCBpbnB1dC4uLicpXG4gICAgY29uc3QgZmlsZXMgPSB0b0FycmF5KGV2ZW50LnRhcmdldC5maWxlcylcbiAgICB0aGlzLmFkZEZpbGVzKGZpbGVzKVxuXG4gICAgLy8gV2UgY2xlYXIgdGhlIGlucHV0IGFmdGVyIGEgZmlsZSBpcyBzZWxlY3RlZCwgYmVjYXVzZSBvdGhlcndpc2VcbiAgICAvLyBjaGFuZ2UgZXZlbnQgaXMgbm90IGZpcmVkIGluIENocm9tZSBhbmQgU2FmYXJpIHdoZW4gYSBmaWxlXG4gICAgLy8gd2l0aCB0aGUgc2FtZSBuYW1lIGlzIHNlbGVjdGVkLlxuICAgIC8vIF9fX1doeSBub3QgdXNlIHZhbHVlPVwiXCIgb24gPGlucHV0Lz4gaW5zdGVhZD9cbiAgICAvLyAgICBCZWNhdXNlIGlmIHdlIHVzZSB0aGF0IG1ldGhvZCBvZiBjbGVhcmluZyB0aGUgaW5wdXQsXG4gICAgLy8gICAgQ2hyb21lIHdpbGwgbm90IHRyaWdnZXIgY2hhbmdlIGlmIHdlIGRyb3AgdGhlIHNhbWUgZmlsZSB0d2ljZSAoSXNzdWUgIzc2OCkuXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbFxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgKCkge1xuICAgIHRoaXMuaW5wdXQuY2xpY2soKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICAvKiBodHRwOi8vdHltcGFudXMubmV0L2NvZHJvcHMvMjAxNS8wOS8xNS9zdHlsaW5nLWN1c3RvbWl6aW5nLWZpbGUtaW5wdXRzLXNtYXJ0LXdheS8gKi9cbiAgICBjb25zdCBoaWRkZW5JbnB1dFN0eWxlID0ge1xuICAgICAgd2lkdGg6ICcwLjFweCcsXG4gICAgICBoZWlnaHQ6ICcwLjFweCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgIH1cblxuICAgIGNvbnN0IHsgcmVzdHJpY3Rpb25zIH0gPSB0aGlzLnVwcHkub3B0c1xuICAgIGNvbnN0IGFjY2VwdCA9IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzID8gcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMuam9pbignLCcpIDogbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1Sb290IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJ1cHB5LUZpbGVJbnB1dC1pbnB1dFwiXG4gICAgICAgICAgc3R5bGU9e3RoaXMub3B0cy5wcmV0dHkgJiYgaGlkZGVuSW5wdXRTdHlsZX1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgbmFtZT17dGhpcy5vcHRzLmlucHV0TmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX1cbiAgICAgICAgICBtdWx0aXBsZT17cmVzdHJpY3Rpb25zLm1heE51bWJlck9mRmlsZXMgIT09IDF9XG4gICAgICAgICAgYWNjZXB0PXthY2NlcHR9XG4gICAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpcy5pbnB1dCA9IGlucHV0IH19XG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLm9wdHMucHJldHR5XG4gICAgICAgICAgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktRmlsZUlucHV0LWJ0blwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuaTE4bignY2hvb3NlRmlsZXMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiY29uc3QgeyBVSVBsdWdpbiB9ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbi8qKlxuICogUHJvZ3Jlc3MgYmFyXG4gKlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByb2dyZXNzQmFyIGV4dGVuZHMgVUlQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnUHJvZ3Jlc3NCYXInXG4gICAgdGhpcy50aXRsZSA9ICdQcm9ncmVzcyBCYXInXG4gICAgdGhpcy50eXBlID0gJ3Byb2dyZXNzaW5kaWNhdG9yJ1xuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICBmaXhlZDogZmFsc2UsXG4gICAgICBoaWRlQWZ0ZXJGaW5pc2g6IHRydWUsXG4gICAgfVxuXG4gICAgLy8gbWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICB9XG5cbiAgcmVuZGVyIChzdGF0ZSkge1xuICAgIGNvbnN0IHByb2dyZXNzID0gc3RhdGUudG90YWxQcm9ncmVzcyB8fCAwXG4gICAgLy8gYmVmb3JlIHN0YXJ0aW5nIGFuZCBhZnRlciBmaW5pc2ggc2hvdWxkIGJlIGhpZGRlbiBpZiBzcGVjaWZpZWQgaW4gdGhlIG9wdGlvbnNcbiAgICBjb25zdCBpc0hpZGRlbiA9IChwcm9ncmVzcyA9PT0gMCB8fCBwcm9ncmVzcyA9PT0gMTAwKSAmJiB0aGlzLm9wdHMuaGlkZUFmdGVyRmluaXNoXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwidXBweSB1cHB5LVByb2dyZXNzQmFyXCJcbiAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246IHRoaXMub3B0cy5maXhlZCA/ICdmaXhlZCcgOiAnaW5pdGlhbCcgfX1cbiAgICAgICAgYXJpYS1oaWRkZW49e2lzSGlkZGVufVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktUHJvZ3Jlc3NCYXItaW5uZXJcIiBzdHlsZT17eyB3aWR0aDogYCR7cHJvZ3Jlc3N9JWAgfX0gLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVByb2dyZXNzQmFyLXBlcmNlbnRhZ2VcIj57cHJvZ3Jlc3N9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBpbnN0YWxsICgpIHtcbiAgICBjb25zdCB7IHRhcmdldCB9ID0gdGhpcy5vcHRzXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tb3VudCh0YXJnZXQsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVubW91bnQoKVxuICB9XG59XG4iLCIvKipcbiAqIERlZmF1bHQgc3RvcmUgdGhhdCBrZWVwcyBzdGF0ZSBpbiBhIHNpbXBsZSBvYmplY3QuXG4gKi9cbmNsYXNzIERlZmF1bHRTdG9yZSB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVcbiAgfVxuXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIGNvbnN0IHByZXZTdGF0ZSA9IHsgLi4udGhpcy5zdGF0ZSB9XG4gICAgY29uc3QgbmV4dFN0YXRlID0geyAuLi50aGlzLnN0YXRlLCAuLi5wYXRjaCB9XG5cbiAgICB0aGlzLnN0YXRlID0gbmV4dFN0YXRlXG4gICAgdGhpcy4jcHVibGlzaChwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gIH1cblxuICBzdWJzY3JpYmUgKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChsaXN0ZW5lcilcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICAgIHRoaXMuY2FsbGJhY2tzLnNwbGljZShcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuaW5kZXhPZihsaXN0ZW5lciksXG4gICAgICAgIDFcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAjcHVibGlzaCAoLi4uYXJncykge1xuICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lciguLi5hcmdzKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZhdWx0U3RvcmUgKCkge1xuICByZXR1cm4gbmV3IERlZmF1bHRTdG9yZSgpXG59XG4iLCIvKipcbiAqIENyZWF0ZSBhIHdyYXBwZXIgYXJvdW5kIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBhIGByZW1vdmVgIG1ldGhvZCB0byByZW1vdmVcbiAqIGFsbCBldmVudHMgdGhhdCB3ZXJlIGFkZGVkIHVzaW5nIHRoZSB3cmFwcGVkIGVtaXR0ZXIuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRXZlbnRUcmFja2VyIHtcbiAgI2VtaXR0ZXJcblxuICAjZXZlbnRzID0gW11cblxuICBjb25zdHJ1Y3RvciAoZW1pdHRlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIgPSBlbWl0dGVyXG4gIH1cblxuICBvbiAoZXZlbnQsIGZuKSB7XG4gICAgdGhpcy4jZXZlbnRzLnB1c2goW2V2ZW50LCBmbl0pXG4gICAgcmV0dXJuIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGZuKVxuICB9XG5cbiAgcmVtb3ZlICgpIHtcbiAgICBmb3IgKGNvbnN0IFtldmVudCwgZm5dIG9mIHRoaXMuI2V2ZW50cy5zcGxpY2UoMCkpIHtcbiAgICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBmbilcbiAgICB9XG4gIH1cbn1cbiIsImNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKGVycm9yLCB4aHIgPSBudWxsKSB7XG4gICAgc3VwZXIoYFRoaXMgbG9va3MgbGlrZSBhIG5ldHdvcmsgZXJyb3IsIHRoZSBlbmRwb2ludCBtaWdodCBiZSBibG9ja2VkIGJ5IGFuIGludGVybmV0IHByb3ZpZGVyIG9yIGEgZmlyZXdhbGwuYClcblxuICAgIHRoaXMuY2F1c2UgPSBlcnJvclxuICAgIHRoaXMuaXNOZXR3b3JrRXJyb3IgPSB0cnVlXG4gICAgdGhpcy5yZXF1ZXN0ID0geGhyXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrRXJyb3JcbiIsIi8qKlxuICogSGVscGVyIHRvIGFib3J0IHVwbG9hZCByZXF1ZXN0cyBpZiB0aGVyZSBoYXMgbm90IGJlZW4gYW55IHByb2dyZXNzIGZvciBgdGltZW91dGAgbXMuXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2UgdXNpbmcgYHRpbWVyID0gbmV3IFByb2dyZXNzVGltZW91dCgxMDAwMCwgb25UaW1lb3V0KWBcbiAqIENhbGwgYHRpbWVyLnByb2dyZXNzKClgIHRvIHNpZ25hbCB0aGF0IHRoZXJlIGhhcyBiZWVuIHByb2dyZXNzIG9mIGFueSBraW5kLlxuICogQ2FsbCBgdGltZXIuZG9uZSgpYCB3aGVuIHRoZSB1cGxvYWQgaGFzIGNvbXBsZXRlZC5cbiAqL1xuY2xhc3MgUHJvZ3Jlc3NUaW1lb3V0IHtcbiAgI2FsaXZlVGltZXI7XG5cbiAgI2lzRG9uZSA9IGZhbHNlO1xuXG4gICNvblRpbWVkT3V0O1xuXG4gICN0aW1lb3V0O1xuXG4gIGNvbnN0cnVjdG9yICh0aW1lb3V0LCB0aW1lb3V0SGFuZGxlcikge1xuICAgIHRoaXMuI3RpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy4jb25UaW1lZE91dCA9IHRpbWVvdXRIYW5kbGVyXG4gIH1cblxuICBwcm9ncmVzcyAoKSB7XG4gICAgLy8gU29tZSBicm93c2VycyBmaXJlIGFub3RoZXIgcHJvZ3Jlc3MgZXZlbnQgd2hlbiB0aGUgdXBsb2FkIGlzXG4gICAgLy8gY2FuY2VsbGVkLCBzbyB3ZSBoYXZlIHRvIGlnbm9yZSBwcm9ncmVzcyBhZnRlciB0aGUgdGltZXIgd2FzXG4gICAgLy8gdG9sZCB0byBzdG9wLlxuICAgIGlmICh0aGlzLiNpc0RvbmUpIHJldHVyblxuXG4gICAgaWYgKHRoaXMuI3RpbWVvdXQgPiAwKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jYWxpdmVUaW1lcilcbiAgICAgIHRoaXMuI2FsaXZlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuI29uVGltZWRPdXQsIHRoaXMuI3RpbWVvdXQpXG4gICAgfVxuICB9XG5cbiAgZG9uZSAoKSB7XG4gICAgaWYgKCF0aGlzLiNpc0RvbmUpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLiNhbGl2ZVRpbWVyKVxuICAgICAgdGhpcy4jYWxpdmVUaW1lciA9IG51bGxcbiAgICAgIHRoaXMuI2lzRG9uZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmVzc1RpbWVvdXRcbiIsImZ1bmN0aW9uIGNyZWF0ZUNhbmNlbEVycm9yICgpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQ2FuY2VsbGVkJylcbn1cblxuY2xhc3MgUmF0ZUxpbWl0ZWRRdWV1ZSB7XG4gICNhY3RpdmVSZXF1ZXN0cyA9IDBcblxuICAjcXVldWVkSGFuZGxlcnMgPSBbXVxuXG4gIGNvbnN0cnVjdG9yIChsaW1pdCkge1xuICAgIGlmICh0eXBlb2YgbGltaXQgIT09ICdudW1iZXInIHx8IGxpbWl0ID09PSAwKSB7XG4gICAgICB0aGlzLmxpbWl0ID0gSW5maW5pdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdCA9IGxpbWl0XG4gICAgfVxuICB9XG5cbiAgI2NhbGwgKGZuKSB7XG4gICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgKz0gMVxuXG4gICAgbGV0IGRvbmUgPSBmYWxzZVxuXG4gICAgbGV0IGNhbmNlbEFjdGl2ZVxuICAgIHRyeSB7XG4gICAgICBjYW5jZWxBY3RpdmUgPSBmbigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVyblxuICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICAgIGNhbmNlbEFjdGl2ZSgpXG4gICAgICAgIHRoaXMuI3F1ZXVlTmV4dCgpXG4gICAgICB9LFxuXG4gICAgICBkb25lOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICB0aGlzLiNxdWV1ZU5leHQoKVxuICAgICAgfSxcbiAgICB9XG4gIH1cblxuICAjcXVldWVOZXh0ICgpIHtcbiAgICAvLyBEbyBpdCBzb29uIGJ1dCBub3QgaW1tZWRpYXRlbHksIHRoaXMgYWxsb3dzIGNsZWFyaW5nIG91dCB0aGUgZW50aXJlIHF1ZXVlIHN5bmNocm9ub3VzbHlcbiAgICAvLyBvbmUgYnkgb25lIHdpdGhvdXQgY29udGludW91c2x5IF9hZHZhbmNpbmdfIGl0IChhbmQgc3RhcnRpbmcgbmV3IHRhc2tzIGJlZm9yZSBpbW1lZGlhdGVseVxuICAgIC8vIGFib3J0aW5nIHRoZW0pXG4gICAgcXVldWVNaWNyb3Rhc2soKCkgPT4gdGhpcy4jbmV4dCgpKVxuICB9XG5cbiAgI25leHQgKCkge1xuICAgIGlmICh0aGlzLiNhY3RpdmVSZXF1ZXN0cyA+PSB0aGlzLmxpbWl0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIG5leHQgcmVxdWVzdCwgYW5kIHVwZGF0ZSB0aGUgYWJvcnQvZG9uZSBoYW5kbGVyc1xuICAgIC8vIHNvIHRoYXQgY2FuY2VsbGluZyBpdCBkb2VzIHRoZSBSaWdodCBUaGluZyAoYW5kIGRvZXNuJ3QganVzdCB0cnlcbiAgICAvLyB0byBkZXF1ZXVlIGFuIGFscmVhZHktcnVubmluZyByZXF1ZXN0KS5cbiAgICBjb25zdCBuZXh0ID0gdGhpcy4jcXVldWVkSGFuZGxlcnMuc2hpZnQoKVxuICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLiNjYWxsKG5leHQuZm4pXG4gICAgbmV4dC5hYm9ydCA9IGhhbmRsZXIuYWJvcnRcbiAgICBuZXh0LmRvbmUgPSBoYW5kbGVyLmRvbmVcbiAgfVxuXG4gICNxdWV1ZSAoZm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgICBmbixcbiAgICAgIHByaW9yaXR5OiBvcHRpb25zLnByaW9yaXR5IHx8IDAsXG4gICAgICBhYm9ydDogKCkgPT4ge1xuICAgICAgICB0aGlzLiNkZXF1ZXVlKGhhbmRsZXIpXG4gICAgICB9LFxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtYXJrIGEgcXVldWVkIHJlcXVlc3QgYXMgZG9uZTogdGhpcyBpbmRpY2F0ZXMgYSBidWcnKVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmZpbmRJbmRleCgob3RoZXIpID0+IHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByaW9yaXR5ID4gb3RoZXIucHJpb3JpdHlcbiAgICB9KVxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnB1c2goaGFuZGxlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jcXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAwLCBoYW5kbGVyKVxuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlclxuICB9XG5cbiAgI2RlcXVldWUgKGhhbmRsZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmluZGV4T2YoaGFuZGxlcilcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLiNxdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgcnVuIChmbiwgcXVldWVPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuI2FjdGl2ZVJlcXVlc3RzIDwgdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuIHRoaXMuI2NhbGwoZm4pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNxdWV1ZShmbiwgcXVldWVPcHRpb25zKVxuICB9XG5cbiAgd3JhcFByb21pc2VGdW5jdGlvbiAoZm4sIHF1ZXVlT3B0aW9ucykge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgbGV0IHF1ZXVlZFJlcXVlc3RcbiAgICAgIGNvbnN0IG91dGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucnVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgY2FuY2VsRXJyb3JcbiAgICAgICAgICBsZXQgaW5uZXJQcm9taXNlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShmbiguLi5hcmdzKSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KGVycilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbm5lclByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FuY2VsRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGNhbmNlbEVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxFcnJvciA9IGNyZWF0ZUNhbmNlbEVycm9yKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHF1ZXVlT3B0aW9ucylcbiAgICAgIH0pXG5cbiAgICAgIG91dGVyUHJvbWlzZS5hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRlclByb21pc2VcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJhdGVMaW1pdGVkUXVldWUsXG4gIGludGVybmFsUmF0ZUxpbWl0ZWRRdWV1ZTogU3ltYm9sKCdfX3F1ZXVlJyksXG59XG4iLCJjb25zdCBoYXMgPSByZXF1aXJlKCcuL2hhc1Byb3BlcnR5JylcblxuZnVuY3Rpb24gaW5zZXJ0UmVwbGFjZW1lbnQgKHNvdXJjZSwgcngsIHJlcGxhY2VtZW50KSB7XG4gIGNvbnN0IG5ld1BhcnRzID0gW11cbiAgc291cmNlLmZvckVhY2goKGNodW5rKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgc291cmNlIGNvbnRhaW5zIG11bHRpcGxlIHBsYWNlaG9sZGVycyBmb3IgaW50ZXJwb2xhdGlvbixcbiAgICAvLyB3ZSBzaG91bGQgaWdub3JlIGNodW5rcyB0aGF0IGFyZSBub3Qgc3RyaW5ncywgYmVjYXVzZSB0aG9zZVxuICAgIC8vIGNhbiBiZSBKU1ggb2JqZWN0cyBhbmQgd2lsbCBiZSBvdGhlcndpc2UgaW5jb3JyZWN0bHkgdHVybmVkIGludG8gc3RyaW5ncy5cbiAgICAvLyBXaXRob3V0IHRoaXMgY29uZGl0aW9uIHdl4oCZZCBnZXQgdGhpczogW29iamVjdCBPYmplY3RdIGhlbGxvIFtvYmplY3QgT2JqZWN0XSBteSA8YnV0dG9uPlxuICAgIGlmICh0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3UGFydHMucHVzaChjaHVuaylcbiAgICB9XG5cbiAgICByZXR1cm4gcnhbU3ltYm9sLnNwbGl0XShjaHVuaykuZm9yRWFjaCgocmF3LCBpLCBsaXN0KSA9PiB7XG4gICAgICBpZiAocmF3ICE9PSAnJykge1xuICAgICAgICBuZXdQYXJ0cy5wdXNoKHJhdylcbiAgICAgIH1cblxuICAgICAgLy8gSW50ZXJsYWNlIHdpdGggdGhlIGByZXBsYWNlbWVudGAgdmFsdWVcbiAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIG5ld1BhcnRzLnB1c2gocmVwbGFjZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIG5ld1BhcnRzXG59XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlciB2YXJpYWJsZXMgbGlrZSBgJXtzbWFydF9jb3VudH0gZmlsZSBzZWxlY3RlZGBcbiAqIGFuZCByZXBsYWNlcyBpdCB3aXRoIHZhbHVlcyBmcm9tIG9wdGlvbnMgYHtzbWFydF9jb3VudDogNX1gXG4gKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKiB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMvYmxvYi9tYXN0ZXIvbGliL3BvbHlnbG90LmpzI0wyOTlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlIHRoYXQgbmVlZHMgaW50ZXJwb2xhdGlvbiwgd2l0aCBwbGFjZWhvbGRlcnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gKiBAcmV0dXJucyB7YW55W119IGludGVycG9sYXRlZFxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZSAocGhyYXNlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGRvbGxhclJlZ2V4ID0gL1xcJC9nXG4gIGNvbnN0IGRvbGxhckJpbGxzWWFsbCA9ICckJCQkJ1xuICBsZXQgaW50ZXJwb2xhdGVkID0gW3BocmFzZV1cblxuICBpZiAob3B0aW9ucyA9PSBudWxsKSByZXR1cm4gaW50ZXJwb2xhdGVkXG5cbiAgZm9yIChjb25zdCBhcmcgb2YgT2JqZWN0LmtleXMob3B0aW9ucykpIHtcbiAgICBpZiAoYXJnICE9PSAnXycpIHtcbiAgICAgIC8vIEVuc3VyZSByZXBsYWNlbWVudCB2YWx1ZSBpcyBlc2NhcGVkIHRvIHByZXZlbnQgc3BlY2lhbCAkLXByZWZpeGVkXG4gICAgICAvLyByZWdleCByZXBsYWNlIHRva2Vucy4gdGhlIFwiJCQkJFwiIGlzIG5lZWRlZCBiZWNhdXNlIGVhY2ggXCIkXCIgbmVlZHMgdG9cbiAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgIGxldCByZXBsYWNlbWVudCA9IG9wdGlvbnNbYXJnXVxuICAgICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVwbGFjZW1lbnQgPSBkb2xsYXJSZWdleFtTeW1ib2wucmVwbGFjZV0ocmVwbGFjZW1lbnQsIGRvbGxhckJpbGxzWWFsbClcbiAgICAgIH1cbiAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAvLyBzdHJpbmcgcmVwbGFjZSBzbyB0aGF0IHRoZSBzYW1lIGFyZ3VtZW50IGNhbiBiZSByZXBsYWNlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gaW4gdGhlIHNhbWUgcGhyYXNlLlxuICAgICAgaW50ZXJwb2xhdGVkID0gaW5zZXJ0UmVwbGFjZW1lbnQoaW50ZXJwb2xhdGVkLCBuZXcgUmVnRXhwKGAlXFxcXHske2FyZ31cXFxcfWAsICdnJyksIHJlcGxhY2VtZW50KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbnRlcnBvbGF0ZWRcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGVzIHN0cmluZ3Mgd2l0aCBpbnRlcnBvbGF0aW9uICYgcGx1cmFsaXphdGlvbiBzdXBwb3J0LlxuICogRXh0ZW5zaWJsZSB3aXRoIGN1c3RvbSBkaWN0aW9uYXJpZXMgYW5kIHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zLlxuICpcbiAqIEJvcnJvd3MgaGVhdmlseSBmcm9tIGFuZCBpbnNwaXJlZCBieSBQb2x5Z2xvdCBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzLFxuICogYmFzaWNhbGx5IGEgc3RyaXBwZWQtZG93biB2ZXJzaW9uIG9mIGl0LiBEaWZmZXJlbmNlczogcGx1cmFsaXphdGlvbiBmdW5jdGlvbnMgYXJlIG5vdCBoYXJkY29kZWRcbiAqIGFuZCBjYW4gYmUgZWFzaWx5IGFkZGVkIGFtb25nIHdpdGggZGljdGlvbmFyaWVzLCBuZXN0ZWQgb2JqZWN0cyBhcmUgdXNlZCBmb3IgcGx1cmFsaXphdGlvblxuICogYXMgb3Bwb3NlZCB0byBgfHx8fGAgZGVsaW1ldGVyXG4gKlxuICogVXNhZ2UgZXhhbXBsZTogYHRyYW5zbGF0b3IudHJhbnNsYXRlKCdmaWxlc19jaG9zZW4nLCB7c21hcnRfY291bnQ6IDN9KWBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmFuc2xhdG9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5PG9iamVjdD59IGxvY2FsZXMgLSBsb2NhbGUgb3IgbGlzdCBvZiBsb2NhbGVzLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGxvY2FsZXMpIHtcbiAgICB0aGlzLmxvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHt9LFxuICAgICAgcGx1cmFsaXplIChuKSB7XG4gICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsb2NhbGVzKSkge1xuICAgICAgbG9jYWxlcy5mb3JFYWNoKHRoaXMuI2FwcGx5LCB0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNhcHBseShsb2NhbGVzKVxuICAgIH1cbiAgfVxuXG4gICNhcHBseSAobG9jYWxlKSB7XG4gICAgaWYgKCFsb2NhbGU/LnN0cmluZ3MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHByZXZMb2NhbGUgPSB0aGlzLmxvY2FsZVxuICAgIHRoaXMubG9jYWxlID0geyAuLi5wcmV2TG9jYWxlLCBzdHJpbmdzOiB7IC4uLnByZXZMb2NhbGUuc3RyaW5ncywgLi4ubG9jYWxlLnN0cmluZ3MgfSB9XG4gICAgdGhpcy5sb2NhbGUucGx1cmFsaXplID0gbG9jYWxlLnBsdXJhbGl6ZSB8fCBwcmV2TG9jYWxlLnBsdXJhbGl6ZVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyB0cmFuc2xhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgbGF0ZXIgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnMgaW4gc3RyaW5nXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRyYW5zbGF0ZWQgKGFuZCBpbnRlcnBvbGF0ZWQpXG4gICAqL1xuICB0cmFuc2xhdGUgKGtleSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZUFycmF5KGtleSwgb3B0aW9ucykuam9pbignJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0cmFuc2xhdGlvbiBhbmQgcmV0dXJuIHRoZSB0cmFuc2xhdGVkIGFuZCBpbnRlcnBvbGF0ZWQgcGFydHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAgICogQHJldHVybnMge0FycmF5fSBUaGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzLCBpbiBvcmRlci5cbiAgICovXG4gIHRyYW5zbGF0ZUFycmF5IChrZXksIG9wdGlvbnMpIHtcbiAgICBpZiAoIWhhcyh0aGlzLmxvY2FsZS5zdHJpbmdzLCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1pc3Npbmcgc3RyaW5nOiAke2tleX1gKVxuICAgIH1cblxuICAgIGNvbnN0IHN0cmluZyA9IHRoaXMubG9jYWxlLnN0cmluZ3Nba2V5XVxuICAgIGNvbnN0IGhhc1BsdXJhbEZvcm1zID0gdHlwZW9mIHN0cmluZyA9PT0gJ29iamVjdCdcblxuICAgIGlmIChoYXNQbHVyYWxGb3Jtcykge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc21hcnRfY291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMubG9jYWxlLnBsdXJhbGl6ZShvcHRpb25zLnNtYXJ0X2NvdW50KVxuICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nW3BsdXJhbF0sIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVtcHRlZCB0byB1c2UgYSBzdHJpbmcgd2l0aCBwbHVyYWwgZm9ybXMsIGJ1dCBubyB2YWx1ZSB3YXMgZ2l2ZW4gZm9yICV7c21hcnRfY291bnR9JylcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nLCBvcHRpb25zKVxuICB9XG59XG4iLCJjb25zdCB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpXG5cbmZ1bmN0aW9uIGVtaXRTb2NrZXRQcm9ncmVzcyAodXBsb2FkZXIsIHByb2dyZXNzRGF0YSwgZmlsZSkge1xuICBjb25zdCB7IHByb2dyZXNzLCBieXRlc1VwbG9hZGVkLCBieXRlc1RvdGFsIH0gPSBwcm9ncmVzc0RhdGFcbiAgaWYgKHByb2dyZXNzKSB7XG4gICAgdXBsb2FkZXIudXBweS5sb2coYFVwbG9hZCBwcm9ncmVzczogJHtwcm9ncmVzc31gKVxuICAgIHVwbG9hZGVyLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgdXBsb2FkZXIsXG4gICAgICBieXRlc1VwbG9hZGVkLFxuICAgICAgYnl0ZXNUb3RhbCxcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGUoZW1pdFNvY2tldFByb2dyZXNzLCAzMDAsIHtcbiAgbGVhZGluZzogdHJ1ZSxcbiAgdHJhaWxpbmc6IHRydWUsXG59KVxuIiwiY29uc3QgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnLi9OZXR3b3JrRXJyb3InKVxuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5mZXRjaCB0aGF0IHRocm93cyBhIE5ldHdvcmtFcnJvciB3aGVuIGFwcHJvcHJpYXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmV0Y2hXaXRoTmV0d29ya0Vycm9yICguLi5vcHRpb25zKSB7XG4gIHJldHVybiBmZXRjaCguLi5vcHRpb25zKVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoZXJyKVxuICAgICAgfVxuICAgIH0pXG59XG4iLCJjb25zdCBpc0RPTUVsZW1lbnQgPSByZXF1aXJlKCcuL2lzRE9NRWxlbWVudCcpXG5cbi8qKlxuICogRmluZCBhIERPTSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtOb2RlfG51bGx9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZERPTUVsZW1lbnQgKGVsZW1lbnQsIGNvbnRleHQgPSBkb2N1bWVudCkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICB9XG5cbiAgaWYgKGlzRE9NRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIiwiZnVuY3Rpb24gZW5jb2RlQ2hhcmFjdGVyIChjaGFyYWN0ZXIpIHtcbiAgcmV0dXJuIGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDMyKVxufVxuXG5mdW5jdGlvbiBlbmNvZGVGaWxlbmFtZSAobmFtZSkge1xuICBsZXQgc3VmZml4ID0gJydcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvW15BLVowLTldL2lnLCAoY2hhcmFjdGVyKSA9PiB7XG4gICAgc3VmZml4ICs9IGAtJHtlbmNvZGVDaGFyYWN0ZXIoY2hhcmFjdGVyKX1gXG4gICAgcmV0dXJuICcvJ1xuICB9KSArIHN1ZmZpeFxufVxuXG4vKipcbiAqIFRha2VzIGEgZmlsZSBvYmplY3QgYW5kIHR1cm5zIGl0IGludG8gZmlsZUlELCBieSBjb252ZXJ0aW5nIGZpbGUubmFtZSB0byBsb3dlcmNhc2UsXG4gKiByZW1vdmluZyBleHRyYSBjaGFyYWN0ZXJzIGFuZCBhZGRpbmcgdHlwZSwgc2l6ZSBhbmQgbGFzdE1vZGlmaWVkXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmaWxlSURcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUZpbGVJRCAoZmlsZSkge1xuICAvLyBJdCdzIHRlbXB0aW5nIHRvIGRvIGBbaXRlbXNdLmZpbHRlcihCb29sZWFuKS5qb2luKCctJylgIGhlcmUsIGJ1dCB0aGF0XG4gIC8vIGlzIHNsb3dlciEgc2ltcGxlIHN0cmluZyBjb25jYXRlbmF0aW9uIGlzIGZhc3RcblxuICBsZXQgaWQgPSAndXBweSdcbiAgaWYgKHR5cGVvZiBmaWxlLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpKX1gXG4gIH1cblxuICBpZiAoZmlsZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS50eXBlfWBcbiAgfVxuXG4gIGlmIChmaWxlLm1ldGEgJiYgdHlwZW9mIGZpbGUubWV0YS5yZWxhdGl2ZVBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubWV0YS5yZWxhdGl2ZVBhdGgudG9Mb3dlckNhc2UoKSl9YFxuICB9XG5cbiAgaWYgKGZpbGUuZGF0YS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLnNpemV9YFxuICB9XG4gIGlmIChmaWxlLmRhdGEubGFzdE1vZGlmaWVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLmxhc3RNb2RpZmllZH1gXG4gIH1cblxuICByZXR1cm4gaWRcbn1cbiIsIi8qKlxuICogVGFrZXMgYSBmdWxsIGZpbGVuYW1lIHN0cmluZyBhbmQgcmV0dXJucyBhbiBvYmplY3Qge25hbWUsIGV4dGVuc2lvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbEZpbGVOYW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB7bmFtZSwgZXh0ZW5zaW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uIChmdWxsRmlsZU5hbWUpIHtcbiAgY29uc3QgbGFzdERvdCA9IGZ1bGxGaWxlTmFtZS5sYXN0SW5kZXhPZignLicpXG4gIC8vIHRoZXNlIGNvdW50IGFzIG5vIGV4dGVuc2lvbjogXCJuby1kb3RcIiwgXCJ0cmFpbGluZy1kb3QuXCJcbiAgaWYgKGxhc3REb3QgPT09IC0xIHx8IGxhc3REb3QgPT09IGZ1bGxGaWxlTmFtZS5sZW5ndGggLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGZ1bGxGaWxlTmFtZSxcbiAgICAgIGV4dGVuc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6IGZ1bGxGaWxlTmFtZS5zbGljZSgwLCBsYXN0RG90KSxcbiAgICBleHRlbnNpb246IGZ1bGxGaWxlTmFtZS5zbGljZShsYXN0RG90ICsgMSksXG4gIH1cbn1cbiIsImNvbnN0IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBtaW1lVHlwZXMgPSByZXF1aXJlKCcuL21pbWVUeXBlcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZVR5cGUgKGZpbGUpIHtcbiAgaWYgKGZpbGUudHlwZSkgcmV0dXJuIGZpbGUudHlwZVxuXG4gIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBmaWxlLm5hbWUgPyBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmaWxlLm5hbWUpLmV4dGVuc2lvbj8udG9Mb3dlckNhc2UoKSA6IG51bGxcbiAgaWYgKGZpbGVFeHRlbnNpb24gJiYgZmlsZUV4dGVuc2lvbiBpbiBtaW1lVHlwZXMpIHtcbiAgICAvLyBlbHNlLCBzZWUgaWYgd2UgY2FuIG1hcCBleHRlbnNpb24gdG8gYSBtaW1lIHR5cGVcbiAgICByZXR1cm4gbWltZVR5cGVzW2ZpbGVFeHRlbnNpb25dXG4gIH1cbiAgLy8gaWYgYWxsIGZhaWxzLCBmYWxsIGJhY2sgdG8gYSBnZW5lcmljIGJ5dGUgc3RyZWFtIHR5cGVcbiAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNvY2tldEhvc3QgKHVybCkge1xuICAvLyBnZXQgdGhlIGhvc3QgZG9tYWluXG4gIGNvbnN0IHJlZ2V4ID0gL14oPzpodHRwcz86XFwvXFwvfFxcL1xcLyk/KD86W15AXFxuXStAKT8oPzp3d3dcXC4pPyhbXlxcbl0rKS9pXG4gIGNvbnN0IGhvc3QgPSByZWdleC5leGVjKHVybClbMV1cbiAgY29uc3Qgc29ja2V0UHJvdG9jb2wgPSAvXmh0dHA6XFwvXFwvL2kudGVzdCh1cmwpID8gJ3dzJyA6ICd3c3MnXG5cbiAgcmV0dXJuIGAke3NvY2tldFByb3RvY29sfTovLyR7aG9zdH1gXG59XG4iLCIvKipcbiAqIEFkZHMgemVybyB0byBzdHJpbmdzIHNob3J0ZXIgdGhhbiB0d28gY2hhcmFjdGVycy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBwYWQgKG51bWJlcikge1xuICByZXR1cm4gbnVtYmVyIDwgMTAgPyBgMCR7bnVtYmVyfWAgOiBudW1iZXIudG9TdHJpbmcoKVxufVxuXG4vKipcbiAqIFJldHVybnMgYSB0aW1lc3RhbXAgaW4gdGhlIGZvcm1hdCBvZiBgaG91cnM6bWludXRlczpzZWNvbmRzYFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFRpbWVTdGFtcCAoKSB7XG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IGhvdXJzID0gcGFkKGRhdGUuZ2V0SG91cnMoKSlcbiAgY29uc3QgbWludXRlcyA9IHBhZChkYXRlLmdldE1pbnV0ZXMoKSlcbiAgY29uc3Qgc2Vjb25kcyA9IHBhZChkYXRlLmdldFNlY29uZHMoKSlcbiAgcmV0dXJuIGAke2hvdXJzfToke21pbnV0ZXN9OiR7c2Vjb25kc31gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSlcbn1cbiIsIi8qKlxuICogQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQuIER1Y2stdHlwaW5nIGJhc2VkIG9uIGBub2RlVHlwZWAuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0RPTUVsZW1lbnQgKG9iaikge1xuICByZXR1cm4gb2JqPy5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREVcbn1cbiIsImZ1bmN0aW9uIGlzTmV0d29ya0Vycm9yICh4aHIpIHtcbiAgaWYgKCF4aHIpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gKHhoci5yZWFkeVN0YXRlICE9PSAwICYmIHhoci5yZWFkeVN0YXRlICE9PSA0KSB8fCB4aHIuc3RhdHVzID09PSAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOZXR3b3JrRXJyb3JcbiIsIi8vIF9fX1doeSBub3QgYWRkIHRoZSBtaW1lLXR5cGVzIHBhY2thZ2U/XG4vLyAgICBJdCdzIDE5LjdrQiBnemlwcGVkLCBhbmQgd2Ugb25seSBuZWVkIG1pbWUgdHlwZXMgZm9yIHdlbGwta25vd24gZXh0ZW5zaW9ucyAoZm9yIGZpbGUgcHJldmlld3MpLlxuLy8gX19fV2hlcmUgdG8gdGFrZSBuZXcgZXh0ZW5zaW9ucyBmcm9tP1xuLy8gICAgaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC9taW1lLWRiL2Jsb2IvbWFzdGVyL2RiLmpzb25cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1kOiAndGV4dC9tYXJrZG93bicsXG4gIG1hcmtkb3duOiAndGV4dC9tYXJrZG93bicsXG4gIG1wNDogJ3ZpZGVvL21wNCcsXG4gIG1wMzogJ2F1ZGlvL21wMycsXG4gIHN2ZzogJ2ltYWdlL3N2Zyt4bWwnLFxuICBqcGc6ICdpbWFnZS9qcGVnJyxcbiAgcG5nOiAnaW1hZ2UvcG5nJyxcbiAgZ2lmOiAnaW1hZ2UvZ2lmJyxcbiAgaGVpYzogJ2ltYWdlL2hlaWMnLFxuICBoZWlmOiAnaW1hZ2UvaGVpZicsXG4gIHlhbWw6ICd0ZXh0L3lhbWwnLFxuICB5bWw6ICd0ZXh0L3lhbWwnLFxuICBjc3Y6ICd0ZXh0L2NzdicsXG4gIHRzdjogJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnLFxuICB0YWI6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgYXZpOiAndmlkZW8veC1tc3ZpZGVvJyxcbiAgbWtzOiAndmlkZW8veC1tYXRyb3NrYScsXG4gIG1rdjogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBtb3Y6ICd2aWRlby9xdWlja3RpbWUnLFxuICBkb2M6ICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICBkb2NtOiAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQuZG9jdW1lbnQubWFjcm9lbmFibGVkLjEyJyxcbiAgZG9jeDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgZG90OiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG90bTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZScsXG4gIHhsYTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsYW06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxjOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxmOiAnYXBwbGljYXRpb24veC14bGlmZit4bWwnLFxuICB4bG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHM6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHNiOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHNtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsc3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG4gIHhsdDogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsdG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyJyxcbiAgeGx0eDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnRlbXBsYXRlJyxcbiAgeGx3OiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgdHh0OiAndGV4dC9wbGFpbicsXG4gIHRleHQ6ICd0ZXh0L3BsYWluJyxcbiAgY29uZjogJ3RleHQvcGxhaW4nLFxuICBsb2c6ICd0ZXh0L3BsYWluJyxcbiAgcGRmOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgemlwOiAnYXBwbGljYXRpb24vemlwJyxcbiAgJzd6JzogJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCcsXG4gIHJhcjogJ2FwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWQnLFxuICB0YXI6ICdhcHBsaWNhdGlvbi94LXRhcicsXG4gIGd6OiAnYXBwbGljYXRpb24vZ3ppcCcsXG4gIGRtZzogJ2FwcGxpY2F0aW9uL3gtYXBwbGUtZGlza2ltYWdlJyxcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlIChwcm9taXNlcykge1xuICBjb25zdCByZXNvbHV0aW9ucyA9IFtdXG4gIGNvbnN0IHJlamVjdGlvbnMgPSBbXVxuICBmdW5jdGlvbiByZXNvbHZlZCAodmFsdWUpIHtcbiAgICByZXNvbHV0aW9ucy5wdXNoKHZhbHVlKVxuICB9XG4gIGZ1bmN0aW9uIHJlamVjdGVkIChlcnJvcikge1xuICAgIHJlamVjdGlvbnMucHVzaChlcnJvcilcbiAgfVxuXG4gIGNvbnN0IHdhaXQgPSBQcm9taXNlLmFsbChcbiAgICBwcm9taXNlcy5tYXAoKHByb21pc2UpID0+IHByb21pc2UudGhlbihyZXNvbHZlZCwgcmVqZWN0ZWQpKVxuICApXG5cbiAgcmV0dXJuIHdhaXQudGhlbigoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3NmdWw6IHJlc29sdXRpb25zLFxuICAgICAgZmFpbGVkOiByZWplY3Rpb25zLFxuICAgIH1cbiAgfSlcbn1cbiIsIi8qKlxuICogQ29udmVydHMgbGlzdCBpbnRvIGFycmF5XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuZnJvbVxuIiwiLy8gVGhpcyBmaWxlIHJlcGxhY2VzIGBpbmRleC5qc2AgaW4gYnVuZGxlcnMgbGlrZSB3ZWJwYWNrIG9yIFJvbGx1cCxcbi8vIGFjY29yZGluZyB0byBgYnJvd3NlcmAgY29uZmlnIGluIGBwYWNrYWdlLmpzb25gLlxuXG5sZXQgeyB1cmxBbHBoYWJldCB9ID0gcmVxdWlyZSgnLi91cmwtYWxwaGFiZXQvaW5kZXguY2pzJylcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgLy8gQWxsIGJ1bmRsZXJzIHdpbGwgcmVtb3ZlIHRoaXMgYmxvY2sgaW4gdGhlIHByb2R1Y3Rpb24gYnVuZGxlLlxuICBpZiAoXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyAmJlxuICAgIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdSZWFjdCBOYXRpdmUgZG9lcyBub3QgaGF2ZSBhIGJ1aWx0LWluIHNlY3VyZSByYW5kb20gZ2VuZXJhdG9yLiAnICtcbiAgICAgICAgJ0lmIHlvdSBkb27igJl0IG5lZWQgdW5wcmVkaWN0YWJsZSBJRHMgdXNlIGBuYW5vaWQvbm9uLXNlY3VyZWAuICcgK1xuICAgICAgICAnRm9yIHNlY3VyZSBJRHMsIGltcG9ydCBgcmVhY3QtbmF0aXZlLWdldC1yYW5kb20tdmFsdWVzYCAnICtcbiAgICAgICAgJ2JlZm9yZSBOYW5vIElELidcbiAgICApXG4gIH1cbiAgaWYgKHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnSW1wb3J0IGZpbGUgd2l0aCBgaWYgKCF3aW5kb3cuY3J5cHRvKSB3aW5kb3cuY3J5cHRvID0gd2luZG93Lm1zQ3J5cHRvYCcgK1xuICAgICAgICAnIGJlZm9yZSBpbXBvcnRpbmcgTmFubyBJRCB0byBmaXggSUUgMTEgc3VwcG9ydCdcbiAgICApXG4gIH1cbiAgaWYgKHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBoYXZlIHNlY3VyZSByYW5kb20gZ2VuZXJhdG9yLiAnICtcbiAgICAgICAgJ0lmIHlvdSBkb27igJl0IG5lZWQgdW5wcmVkaWN0YWJsZSBJRHMsIHlvdSBjYW4gdXNlIG5hbm9pZC9ub24tc2VjdXJlLidcbiAgICApXG4gIH1cbn1cblxubGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxuXG5sZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBzaXplLCBnZXRSYW5kb20pID0+IHtcbiAgLy8gRmlyc3QsIGEgYml0bWFzayBpcyBuZWNlc3NhcnkgdG8gZ2VuZXJhdGUgdGhlIElELiBUaGUgYml0bWFzayBtYWtlcyBieXRlc1xuICAvLyB2YWx1ZXMgY2xvc2VyIHRvIHRoZSBhbHBoYWJldCBzaXplLiBUaGUgYml0bWFzayBjYWxjdWxhdGVzIHRoZSBjbG9zZXN0XG4gIC8vIGAyXjMxIC0gMWAgbnVtYmVyLCB3aGljaCBleGNlZWRzIHRoZSBhbHBoYWJldCBzaXplLlxuICAvLyBGb3IgZXhhbXBsZSwgdGhlIGJpdG1hc2sgZm9yIHRoZSBhbHBoYWJldCBzaXplIDMwIGlzIDMxICgwMDAxMTExMSkuXG4gIC8vIGBNYXRoLmNsejMyYCBpcyBub3QgdXNlZCwgYmVjYXVzZSBpdCBpcyBub3QgYXZhaWxhYmxlIGluIGJyb3dzZXJzLlxuICBsZXQgbWFzayA9ICgyIDw8IChNYXRoLmxvZyhhbHBoYWJldC5sZW5ndGggLSAxKSAvIE1hdGguTE4yKSkgLSAxXG4gIC8vIFRob3VnaCwgdGhlIGJpdG1hc2sgc29sdXRpb24gaXMgbm90IHBlcmZlY3Qgc2luY2UgdGhlIGJ5dGVzIGV4Y2VlZGluZ1xuICAvLyB0aGUgYWxwaGFiZXQgc2l6ZSBhcmUgcmVmdXNlZC4gVGhlcmVmb3JlLCB0byByZWxpYWJseSBnZW5lcmF0ZSB0aGUgSUQsXG4gIC8vIHRoZSByYW5kb20gYnl0ZXMgcmVkdW5kYW5jeSBoYXMgdG8gYmUgc2F0aXNmaWVkLlxuXG4gIC8vIE5vdGU6IGV2ZXJ5IGhhcmR3YXJlIHJhbmRvbSBnZW5lcmF0b3IgY2FsbCBpcyBwZXJmb3JtYW5jZSBleHBlbnNpdmUsXG4gIC8vIGJlY2F1c2UgdGhlIHN5c3RlbSBjYWxsIGZvciBlbnRyb3B5IGNvbGxlY3Rpb24gdGFrZXMgYSBsb3Qgb2YgdGltZS5cbiAgLy8gU28sIHRvIGF2b2lkIGFkZGl0aW9uYWwgc3lzdGVtIGNhbGxzLCBleHRyYSBieXRlcyBhcmUgcmVxdWVzdGVkIGluIGFkdmFuY2UuXG5cbiAgLy8gTmV4dCwgYSBzdGVwIGRldGVybWluZXMgaG93IG1hbnkgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuICAvLyBUaGUgbnVtYmVyIG9mIHJhbmRvbSBieXRlcyBnZXRzIGRlY2lkZWQgdXBvbiB0aGUgSUQgc2l6ZSwgbWFzayxcbiAgLy8gYWxwaGFiZXQgc2l6ZSwgYW5kIG1hZ2ljIG51bWJlciAxLjYgKHVzaW5nIDEuNiBwZWFrcyBhdCBwZXJmb3JtYW5jZVxuICAvLyBhY2NvcmRpbmcgdG8gYmVuY2htYXJrcykuXG5cbiAgLy8gYC1+ZiA9PiBNYXRoLmNlaWwoZilgIGlmIGYgaXMgYSBmbG9hdFxuICAvLyBgLX5pID0+IGkgKyAxYCBpZiBpIGlzIGFuIGludGVnZXJcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIHNpemUpIC8gYWxwaGFiZXQubGVuZ3RoKVxuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICAvLyBBIGNvbXBhY3QgYWx0ZXJuYXRpdmUgZm9yIGBmb3IgKHZhciBpID0gMDsgaSA8IHN0ZXA7IGkrKylgLlxuICAgICAgbGV0IGogPSBzdGVwXG4gICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgIC8vIEFkZGluZyBgfHwgJydgIHJlZnVzZXMgYSByYW5kb20gYnl0ZSB0aGF0IGV4Y2VlZHMgdGhlIGFscGhhYmV0IHNpemUuXG4gICAgICAgIGlkICs9IGFscGhhYmV0W2J5dGVzW2pdICYgbWFza10gfHwgJydcbiAgICAgICAgaWYgKGlkLmxlbmd0aCA9PT0gc2l6ZSkgcmV0dXJuIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSkgPT4gY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplLCByYW5kb20pXG5cbmxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBieXRlcyA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpXG5cbiAgLy8gQSBjb21wYWN0IGFsdGVybmF0aXZlIGZvciBgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwOyBpKyspYC5cbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIC8vIEl0IGlzIGluY29ycmVjdCB0byB1c2UgYnl0ZXMgZXhjZWVkaW5nIHRoZSBhbHBoYWJldCBzaXplLlxuICAgIC8vIFRoZSBmb2xsb3dpbmcgbWFzayByZWR1Y2VzIHRoZSByYW5kb20gYnl0ZSBpbiB0aGUgMC0yNTUgdmFsdWVcbiAgICAvLyByYW5nZSB0byB0aGUgMC02MyB2YWx1ZSByYW5nZS4gVGhlcmVmb3JlLCBhZGRpbmcgaGFja3MsIHN1Y2hcbiAgICAvLyBhcyBlbXB0eSBzdHJpbmcgZmFsbGJhY2sgb3IgbWFnaWMgbnVtYmVycywgaXMgdW5uZWNjZXNzYXJ5IGJlY2F1c2VcbiAgICAvLyB0aGUgYml0bWFzayB0cmltcyBieXRlcyBkb3duIHRvIHRoZSBhbHBoYWJldCBzaXplLlxuICAgIGxldCBieXRlID0gYnl0ZXNbc2l6ZV0gJiA2M1xuICAgIGlmIChieXRlIDwgMzYpIHtcbiAgICAgIC8vIGAwLTlhLXpgXG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICAvLyBgQS1aYFxuICAgICAgaWQgKz0gKGJ5dGUgLSAyNikudG9TdHJpbmcoMzYpLnRvVXBwZXJDYXNlKClcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mykge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkICs9ICctJ1xuICAgIH1cbiAgfVxuICByZXR1cm4gaWRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IG5hbm9pZCwgY3VzdG9tQWxwaGFiZXQsIGN1c3RvbVJhbmRvbSwgdXJsQWxwaGFiZXQsIHJhbmRvbSB9XG4iLCJjb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnQHVwcHkvY29yZS9saWIvQmFzZVBsdWdpbicpXG5jb25zdCB7IG5hbm9pZCB9ID0gcmVxdWlyZSgnbmFub2lkJylcbmNvbnN0IHsgUHJvdmlkZXIsIFJlcXVlc3RDbGllbnQsIFNvY2tldCB9ID0gcmVxdWlyZSgnQHVwcHkvY29tcGFuaW9uLWNsaWVudCcpXG5jb25zdCBlbWl0U29ja2V0UHJvZ3Jlc3MgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZW1pdFNvY2tldFByb2dyZXNzJylcbmNvbnN0IGdldFNvY2tldEhvc3QgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U29ja2V0SG9zdCcpXG5jb25zdCBzZXR0bGUgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvc2V0dGxlJylcbmNvbnN0IEV2ZW50VHJhY2tlciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9FdmVudFRyYWNrZXInKVxuY29uc3QgUHJvZ3Jlc3NUaW1lb3V0ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1Byb2dyZXNzVGltZW91dCcpXG5jb25zdCB7IFJhdGVMaW1pdGVkUXVldWUsIGludGVybmFsUmF0ZUxpbWl0ZWRRdWV1ZSB9ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1JhdGVMaW1pdGVkUXVldWUnKVxuY29uc3QgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL05ldHdvcmtFcnJvcicpXG5jb25zdCBpc05ldHdvcmtFcnJvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9pc05ldHdvcmtFcnJvcicpXG5cbmZ1bmN0aW9uIGJ1aWxkUmVzcG9uc2VFcnJvciAoeGhyLCBlcnIpIHtcbiAgbGV0IGVycm9yID0gZXJyXG4gIC8vIE5vIGVycm9yIG1lc3NhZ2VcbiAgaWYgKCFlcnJvcikgZXJyb3IgPSBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG4gIC8vIEdvdCBhbiBlcnJvciBtZXNzYWdlIHN0cmluZ1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3IpXG4gIC8vIEdvdCBzb21ldGhpbmcgZWxzZVxuICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgIGVycm9yID0gT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpLCB7IGRhdGE6IGVycm9yIH0pXG4gIH1cblxuICBpZiAoaXNOZXR3b3JrRXJyb3IoeGhyKSkge1xuICAgIGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlcnJvciwgeGhyKVxuICAgIHJldHVybiBlcnJvclxuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHhoclxuICByZXR1cm4gZXJyb3Jcbn1cblxuLyoqXG4gKiBTZXQgYGRhdGEudHlwZWAgaW4gdGhlIGJsb2IgdG8gYGZpbGUubWV0YS50eXBlYCxcbiAqIGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSBkZXRlY3RlZCBhIG1vcmUgYWNjdXJhdGUgZmlsZSB0eXBlIGluIFVwcHlcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDg3NTYxNVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIEZpbGUgb2JqZWN0IHdpdGggYGRhdGFgLCBgc2l6ZWAgYW5kIGBtZXRhYCBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBibG9iIHVwZGF0ZWQgd2l0aCB0aGUgbmV3IGB0eXBlYCBzZXQgZnJvbSBgZmlsZS5tZXRhLnR5cGVgXG4gKi9cbmZ1bmN0aW9uIHNldFR5cGVJbkJsb2IgKGZpbGUpIHtcbiAgY29uc3QgZGF0YVdpdGhVcGRhdGVkVHlwZSA9IGZpbGUuZGF0YS5zbGljZSgwLCBmaWxlLmRhdGEuc2l6ZSwgZmlsZS5tZXRhLnR5cGUpXG4gIHJldHVybiBkYXRhV2l0aFVwZGF0ZWRUeXBlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgWEhSVXBsb2FkIGV4dGVuZHMgQmFzZVBsdWdpbiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy50eXBlID0gJ3VwbG9hZGVyJ1xuICAgIHRoaXMuaWQgPSB0aGlzLm9wdHMuaWQgfHwgJ1hIUlVwbG9hZCdcbiAgICB0aGlzLnRpdGxlID0gJ1hIUlVwbG9hZCdcblxuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgdGltZWRPdXQ6ICdVcGxvYWQgc3RhbGxlZCBmb3IgJXtzZWNvbmRzfSBzZWNvbmRzLCBhYm9ydGluZy4nLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGZvcm1EYXRhOiB0cnVlLFxuICAgICAgZmllbGROYW1lOiBvcHRzLmJ1bmRsZSA/ICdmaWxlc1tdJyA6ICdmaWxlJyxcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgbWV0YUZpZWxkczogbnVsbCxcbiAgICAgIHJlc3BvbnNlVXJsRmllbGROYW1lOiAndXJsJyxcbiAgICAgIGJ1bmRsZTogZmFsc2UsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHRpbWVvdXQ6IDMwICogMTAwMCxcbiAgICAgIGxpbWl0OiA1LFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIHJlc3BvbnNlVHlwZTogJycsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHJlc3BPYmpcbiAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwb25zZVRleHRcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzdGF0dXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGF0dXNUZXh0XG4gICAgICAgKiBAcHJvcGVydHkge29iamVjdC48c3RyaW5nLCBzdHJpbmc+fSBoZWFkZXJzXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlVGV4dCB0aGUgcmVzcG9uc2UgYm9keSBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3QgfCByZXNwT2JqfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IChYSFIgb3Igc2ltaWxhcilcbiAgICAgICAqL1xuICAgICAgZ2V0UmVzcG9uc2VEYXRhIChyZXNwb25zZVRleHQpIHtcbiAgICAgICAgbGV0IHBhcnNlZFJlc3BvbnNlID0ge31cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJzZWRSZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB1cHB5LmxvZyhlcnIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VkUmVzcG9uc2VcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2VUZXh0IHRoZSByZXNwb25zZSBib2R5IHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdCB8IHJlc3BPYmp9IHJlc3BvbnNlIHRoZSByZXNwb25zZSBvYmplY3QgKFhIUiBvciBzaW1pbGFyKVxuICAgICAgICovXG4gICAgICBnZXRSZXNwb25zZUVycm9yIChfLCByZXNwb25zZSkge1xuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG5cbiAgICAgICAgaWYgKGlzTmV0d29ya0Vycm9yKHJlc3BvbnNlKSkge1xuICAgICAgICAgIGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlcnJvciwgcmVzcG9uc2UpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXJyb3JcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIGlmIHRoZSByZXNwb25zZSBmcm9tIHRoZSB1cGxvYWQgZW5kcG9pbnQgaW5kaWNhdGVzIHRoYXQgdGhlIHVwbG9hZCB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIHRoZSByZXNwb25zZSBzdGF0dXMgY29kZVxuICAgICAgICovXG4gICAgICB2YWxpZGF0ZVN0YXR1cyAoc3RhdHVzKSB7XG4gICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMFxuICAgICAgfSxcbiAgICB9XG5cbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cbiAgICB0aGlzLmkxOG5Jbml0KClcblxuICAgIHRoaXMuaGFuZGxlVXBsb2FkID0gdGhpcy5oYW5kbGVVcGxvYWQuYmluZCh0aGlzKVxuXG4gICAgLy8gU2ltdWx0YW5lb3VzIHVwbG9hZCBsaW1pdGluZyBpcyBzaGFyZWQgYWNyb3NzIGFsbCB1cGxvYWRzIHdpdGggdGhpcyBwbHVnaW4uXG4gICAgaWYgKGludGVybmFsUmF0ZUxpbWl0ZWRRdWV1ZSBpbiB0aGlzLm9wdHMpIHtcbiAgICAgIHRoaXMucmVxdWVzdHMgPSB0aGlzLm9wdHNbaW50ZXJuYWxSYXRlTGltaXRlZFF1ZXVlXVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlcXVlc3RzID0gbmV3IFJhdGVMaW1pdGVkUXVldWUodGhpcy5vcHRzLmxpbWl0KVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMuYnVuZGxlICYmICF0aGlzLm9wdHMuZm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYG9wdHMuZm9ybURhdGFgIG11c3QgYmUgdHJ1ZSB3aGVuIGBvcHRzLmJ1bmRsZWAgaXMgZW5hYmxlZC4nKVxuICAgIH1cblxuICAgIHRoaXMudXBsb2FkZXJFdmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH1cblxuICBnZXRPcHRpb25zIChmaWxlKSB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0gdGhpcy51cHB5LmdldFN0YXRlKCkueGhyVXBsb2FkXG4gICAgY29uc3QgeyBoZWFkZXJzIH0gPSB0aGlzLm9wdHNcblxuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAuLi50aGlzLm9wdHMsXG4gICAgICAuLi4ob3ZlcnJpZGVzIHx8IHt9KSxcbiAgICAgIC4uLihmaWxlLnhoclVwbG9hZCB8fCB7fSksXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICB9XG4gICAgLy8gU3VwcG9ydCBmb3IgYGhlYWRlcnNgIGFzIGEgZnVuY3Rpb24sIG9ubHkgaW4gdGhlIFhIUlVwbG9hZCBzZXR0aW5ncy5cbiAgICAvLyBPcHRpb25zIHNldCBieSBvdGhlciBwbHVnaW5zIGluIFVwcHkgc3RhdGUgb3Igb24gdGhlIGZpbGVzIHRoZW1zZWx2ZXMgYXJlIHN0aWxsIG1lcmdlZCBpbiBhZnRlcndhcmQuXG4gICAgLy9cbiAgICAvLyBgYGBqc1xuICAgIC8vIGhlYWRlcnM6IChmaWxlKSA9PiAoeyBleHBpcmVzOiBmaWxlLm1ldGEuZXhwaXJlcyB9KVxuICAgIC8vIGBgYFxuICAgIGlmICh0eXBlb2YgaGVhZGVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0cy5oZWFkZXJzID0gaGVhZGVycyhmaWxlKVxuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKG9wdHMuaGVhZGVycywgdGhpcy5vcHRzLmhlYWRlcnMpXG4gICAgfVxuXG4gICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLmhlYWRlcnMsIG92ZXJyaWRlcy5oZWFkZXJzKVxuICAgIH1cbiAgICBpZiAoZmlsZS54aHJVcGxvYWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cy5oZWFkZXJzLCBmaWxlLnhoclVwbG9hZC5oZWFkZXJzKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRzXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBhZGRNZXRhZGF0YSAoZm9ybURhdGEsIG1ldGEsIG9wdHMpIHtcbiAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICA/IG9wdHMubWV0YUZpZWxkc1xuICAgICAgOiBPYmplY3Qua2V5cyhtZXRhKSAvLyBTZW5kIGFsb25nIGFsbCBmaWVsZHMgYnkgZGVmYXVsdC5cblxuICAgIG1ldGFGaWVsZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgZm9ybURhdGEuYXBwZW5kKGl0ZW0sIG1ldGFbaXRlbV0pXG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0ZUZvcm1EYXRhVXBsb2FkIChmaWxlLCBvcHRzKSB7XG4gICAgY29uc3QgZm9ybVBvc3QgPSBuZXcgRm9ybURhdGEoKVxuXG4gICAgdGhpcy5hZGRNZXRhZGF0YShmb3JtUG9zdCwgZmlsZS5tZXRhLCBvcHRzKVxuXG4gICAgY29uc3QgZGF0YVdpdGhVcGRhdGVkVHlwZSA9IHNldFR5cGVJbkJsb2IoZmlsZSlcblxuICAgIGlmIChmaWxlLm5hbWUpIHtcbiAgICAgIGZvcm1Qb3N0LmFwcGVuZChvcHRzLmZpZWxkTmFtZSwgZGF0YVdpdGhVcGRhdGVkVHlwZSwgZmlsZS5tZXRhLm5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1Qb3N0LmFwcGVuZChvcHRzLmZpZWxkTmFtZSwgZGF0YVdpdGhVcGRhdGVkVHlwZSlcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybVBvc3RcbiAgfVxuXG4gIGNyZWF0ZUJ1bmRsZWRVcGxvYWQgKGZpbGVzLCBvcHRzKSB7XG4gICAgY29uc3QgZm9ybVBvc3QgPSBuZXcgRm9ybURhdGEoKVxuXG4gICAgY29uc3QgeyBtZXRhIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuICAgIHRoaXMuYWRkTWV0YWRhdGEoZm9ybVBvc3QsIG1ldGEsIG9wdHMpXG5cbiAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKGZpbGUpXG5cbiAgICAgIGNvbnN0IGRhdGFXaXRoVXBkYXRlZFR5cGUgPSBzZXRUeXBlSW5CbG9iKGZpbGUpXG5cbiAgICAgIGlmIChmaWxlLm5hbWUpIHtcbiAgICAgICAgZm9ybVBvc3QuYXBwZW5kKG9wdGlvbnMuZmllbGROYW1lLCBkYXRhV2l0aFVwZGF0ZWRUeXBlLCBmaWxlLm5hbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtUG9zdC5hcHBlbmQob3B0aW9ucy5maWVsZE5hbWUsIGRhdGFXaXRoVXBkYXRlZFR5cGUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBmb3JtUG9zdFxuICB9XG5cbiAgdXBsb2FkIChmaWxlLCBjdXJyZW50LCB0b3RhbCkge1xuICAgIGNvbnN0IG9wdHMgPSB0aGlzLmdldE9wdGlvbnMoZmlsZSlcblxuICAgIHRoaXMudXBweS5sb2coYHVwbG9hZGluZyAke2N1cnJlbnR9IG9mICR7dG90YWx9YClcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcblxuICAgICAgY29uc3QgZGF0YSA9IG9wdHMuZm9ybURhdGFcbiAgICAgICAgPyB0aGlzLmNyZWF0ZUZvcm1EYXRhVXBsb2FkKGZpbGUsIG9wdHMpXG4gICAgICAgIDogZmlsZS5kYXRhXG5cbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIGNvbnN0IHRpbWVyID0gbmV3IFByb2dyZXNzVGltZW91dChvcHRzLnRpbWVvdXQsICgpID0+IHtcbiAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5pMThuKCd0aW1lZE91dCcsIHsgc2Vjb25kczogTWF0aC5jZWlsKG9wdHMudGltZW91dCAvIDEwMDApIH0pKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGlkID0gbmFub2lkKClcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtYSFJVcGxvYWRdICR7aWR9IHN0YXJ0ZWRgKVxuICAgICAgfSlcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBwcm9ncmVzczogJHtldi5sb2FkZWR9IC8gJHtldi50b3RhbH1gKVxuICAgICAgICAvLyBCZWdpbiBjaGVja2luZyBmb3IgdGltZW91dHMgd2hlbiBwcm9ncmVzcyBzdGFydHMsIGluc3RlYWQgb2YgbG9hZGluZyxcbiAgICAgICAgLy8gdG8gYXZvaWQgdGltaW5nIG91dCByZXF1ZXN0cyBvbiBicm93c2VyIGNvbmN1cnJlbmN5IHF1ZXVlXG4gICAgICAgIHRpbWVyLnByb2dyZXNzKClcblxuICAgICAgICBpZiAoZXYubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtcHJvZ3Jlc3MnLCBmaWxlLCB7XG4gICAgICAgICAgICB1cGxvYWRlcjogdGhpcyxcbiAgICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGV2LmxvYWRlZCxcbiAgICAgICAgICAgIGJ5dGVzVG90YWw6IGV2LnRvdGFsLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2KSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtYSFJVcGxvYWRdICR7aWR9IGZpbmlzaGVkYClcbiAgICAgICAgdGltZXIuZG9uZSgpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgIGlmICh0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdKSB7XG4gICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXS5yZW1vdmUoKVxuICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0cy52YWxpZGF0ZVN0YXR1cyhldi50YXJnZXQuc3RhdHVzLCB4aHIucmVzcG9uc2VUZXh0LCB4aHIpKSB7XG4gICAgICAgICAgY29uc3QgYm9keSA9IG9wdHMuZ2V0UmVzcG9uc2VEYXRhKHhoci5yZXNwb25zZVRleHQsIHhocilcbiAgICAgICAgICBjb25zdCB1cGxvYWRVUkwgPSBib2R5W29wdHMucmVzcG9uc2VVcmxGaWVsZE5hbWVdXG5cbiAgICAgICAgICBjb25zdCB1cGxvYWRSZXNwID0ge1xuICAgICAgICAgICAgc3RhdHVzOiBldi50YXJnZXQuc3RhdHVzLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIHVwbG9hZFVSTCxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKVxuXG4gICAgICAgICAgaWYgKHVwbG9hZFVSTCkge1xuICAgICAgICAgICAgdGhpcy51cHB5LmxvZyhgRG93bmxvYWQgJHtmaWxlLm5hbWV9IGZyb20gJHt1cGxvYWRVUkx9YClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmaWxlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvZHkgPSBvcHRzLmdldFJlc3BvbnNlRGF0YSh4aHIucmVzcG9uc2VUZXh0LCB4aHIpXG4gICAgICAgIGNvbnN0IGVycm9yID0gYnVpbGRSZXNwb25zZUVycm9yKHhociwgb3B0cy5nZXRSZXNwb25zZUVycm9yKHhoci5yZXNwb25zZVRleHQsIHhocikpXG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiBldi50YXJnZXQuc3RhdHVzLFxuICAgICAgICAgIGJvZHksXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IsIHJlc3BvbnNlKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgfSlcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBlcnJvcmVkYClcbiAgICAgICAgdGltZXIuZG9uZSgpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgIGlmICh0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdKSB7XG4gICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXS5yZW1vdmUoKVxuICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJvciA9IGJ1aWxkUmVzcG9uc2VFcnJvcih4aHIsIG9wdHMuZ2V0UmVzcG9uc2VFcnJvcih4aHIucmVzcG9uc2VUZXh0LCB4aHIpKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICB4aHIub3BlbihvcHRzLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBvcHRzLmVuZHBvaW50LCB0cnVlKVxuICAgICAgLy8gSUUxMCBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIGB3aXRoQ3JlZGVudGlhbHNgIGFuZCBgcmVzcG9uc2VUeXBlYFxuICAgICAgLy8gYmVmb3JlIGBvcGVuKClgIGlzIGNhbGxlZC5cbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRzLndpdGhDcmVkZW50aWFsc1xuICAgICAgaWYgKG9wdHMucmVzcG9uc2VUeXBlICE9PSAnJykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0cy5yZXNwb25zZVR5cGVcbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcblxuICAgICAgICAvLyBXaGVuIHVzaW5nIGFuIGF1dGhlbnRpY2F0aW9uIHN5c3RlbSBsaWtlIEpXVCwgdGhlIGJlYXJlciB0b2tlbiBnb2VzIGFzIGEgaGVhZGVyLiBUaGlzXG4gICAgICAgIC8vIGhlYWRlciBuZWVkcyB0byBiZSBmcmVzaCBlYWNoIHRpbWUgdGhlIHRva2VuIGlzIHJlZnJlc2hlZCBzbyBjb21wdXRpbmcgYW5kIHNldHRpbmcgdGhlXG4gICAgICAgIC8vIGhlYWRlcnMganVzdCBiZWZvcmUgdGhlIHVwbG9hZCBzdGFydHMgZW5hYmxlcyB0aGlzIGtpbmQgb2YgYXV0aGVudGljYXRpb24gdG8gd29yayBwcm9wZXJseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBoYWxmLXdheSB0aHJvdWdoIHRoZSBsaXN0IG9mIHVwbG9hZHMgdGhlIHRva2VuIGNvdWxkIGJlIHN0YWxlIGFuZCB0aGUgdXBsb2FkIHdvdWxkIGZhaWwuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRPcHRzID0gdGhpcy5nZXRPcHRpb25zKGZpbGUpXG5cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9wdHMuaGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBjdXJyZW50T3B0cy5oZWFkZXJzW2hlYWRlcl0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgeGhyLnNlbmQoZGF0YSlcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHRpbWVyLmRvbmUoKVxuICAgICAgICAgIHhoci5hYm9ydCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25GaWxlUmVtb3ZlKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ZpbGUgcmVtb3ZlZCcpKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vbkNhbmNlbEFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICByZWplY3QobmV3IEVycm9yKCdVcGxvYWQgY2FuY2VsbGVkJykpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB1cGxvYWRSZW1vdGUgKGZpbGUpIHtcbiAgICBjb25zdCBvcHRzID0gdGhpcy5nZXRPcHRpb25zKGZpbGUpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkcyA9IHt9XG4gICAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICAgID8gb3B0cy5tZXRhRmllbGRzXG4gICAgICAgIC8vIFNlbmQgYWxvbmcgYWxsIGZpZWxkcyBieSBkZWZhdWx0LlxuICAgICAgICA6IE9iamVjdC5rZXlzKGZpbGUubWV0YSlcblxuICAgICAgbWV0YUZpZWxkcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIGZpZWxkc1tuYW1lXSA9IGZpbGUubWV0YVtuYW1lXVxuICAgICAgfSlcblxuICAgICAgY29uc3QgQ2xpZW50ID0gZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zLnByb3ZpZGVyID8gUHJvdmlkZXIgOiBSZXF1ZXN0Q2xpZW50XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHRoaXMudXBweSwgZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zKVxuICAgICAgY2xpZW50LnBvc3QoZmlsZS5yZW1vdGUudXJsLCB7XG4gICAgICAgIC4uLmZpbGUucmVtb3RlLmJvZHksXG4gICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICBzaXplOiBmaWxlLmRhdGEuc2l6ZSxcbiAgICAgICAgZmllbGRuYW1lOiBvcHRzLmZpZWxkTmFtZSxcbiAgICAgICAgbWV0YWRhdGE6IGZpZWxkcyxcbiAgICAgICAgaHR0cE1ldGhvZDogb3B0cy5tZXRob2QsXG4gICAgICAgIHVzZUZvcm1EYXRhOiBvcHRzLmZvcm1EYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRzLmhlYWRlcnMsXG4gICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgeyB0b2tlbiB9ID0gcmVzXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRTb2NrZXRIb3N0KGZpbGUucmVtb3RlLmNvbXBhbmlvblVybClcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbmV3IFNvY2tldCh7IHRhcmdldDogYCR7aG9zdH0vYXBpLyR7dG9rZW59YCwgYXV0b09wZW46IGZhbHNlIH0pXG4gICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBuZXcgRXZlbnRUcmFja2VyKHRoaXMudXBweSlcblxuICAgICAgICB0aGlzLm9uRmlsZVJlbW92ZShmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgcmVzb2x2ZShgdXBsb2FkICR7ZmlsZS5pZH0gd2FzIHJlbW92ZWRgKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMub25DYW5jZWxBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyBjYW5jZWxlZGApXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5vblJldHJ5KGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5vblJldHJ5QWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgIH0pXG5cbiAgICAgICAgc29ja2V0Lm9uKCdwcm9ncmVzcycsIChwcm9ncmVzc0RhdGEpID0+IGVtaXRTb2NrZXRQcm9ncmVzcyh0aGlzLCBwcm9ncmVzc0RhdGEsIGZpbGUpKVxuXG4gICAgICAgIHNvY2tldC5vbignc3VjY2VzcycsIChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgYm9keSA9IG9wdHMuZ2V0UmVzcG9uc2VEYXRhKGRhdGEucmVzcG9uc2UucmVzcG9uc2VUZXh0LCBkYXRhLnJlc3BvbnNlKVxuICAgICAgICAgIGNvbnN0IHVwbG9hZFVSTCA9IGJvZHlbb3B0cy5yZXNwb25zZVVybEZpZWxkTmFtZV1cblxuICAgICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IGRhdGEucmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIHVwbG9hZFVSTCxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgaWYgKHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0ucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgfSlcblxuICAgICAgICBzb2NrZXQub24oJ2Vycm9yJywgKGVyckRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCByZXNwID0gZXJyRGF0YS5yZXNwb25zZVxuICAgICAgICAgIGNvbnN0IGVycm9yID0gcmVzcFxuICAgICAgICAgICAgPyBvcHRzLmdldFJlc3BvbnNlRXJyb3IocmVzcC5yZXNwb25zZVRleHQsIHJlc3ApXG4gICAgICAgICAgICA6IE9iamVjdC5hc3NpZ24obmV3IEVycm9yKGVyckRhdGEuZXJyb3IubWVzc2FnZSksIHsgY2F1c2U6IGVyckRhdGEuZXJyb3IgfSlcbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICBpZiAodGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSkge1xuICAgICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXS5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSA9IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc29ja2V0Lm9wZW4oKVxuICAgICAgICAgIGlmIChmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4gc29ja2V0LmNsb3NlKClcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwbG9hZEJ1bmRsZSAoZmlsZXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeyBlbmRwb2ludCB9ID0gdGhpcy5vcHRzXG4gICAgICBjb25zdCB7IG1ldGhvZCB9ID0gdGhpcy5vcHRzXG5cbiAgICAgIGNvbnN0IG9wdHNGcm9tU3RhdGUgPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKS54aHJVcGxvYWRcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gdGhpcy5jcmVhdGVCdW5kbGVkVXBsb2FkKGZpbGVzLCB7XG4gICAgICAgIC4uLnRoaXMub3B0cyxcbiAgICAgICAgLi4uKG9wdHNGcm9tU3RhdGUgfHwge30pLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgY29uc3QgdGltZXIgPSBuZXcgUHJvZ3Jlc3NUaW1lb3V0KHRoaXMub3B0cy50aW1lb3V0LCAoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpXG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuaTE4bigndGltZWRPdXQnLCB7IHNlY29uZHM6IE1hdGguY2VpbCh0aGlzLm9wdHMudGltZW91dCAvIDEwMDApIH0pKVxuICAgICAgICBlbWl0RXJyb3IoZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGVtaXRFcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycm9yKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsICgpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZygnW1hIUlVwbG9hZF0gc3RhcnRlZCB1cGxvYWRpbmcgYnVuZGxlJylcbiAgICAgICAgdGltZXIucHJvZ3Jlc3MoKVxuICAgICAgfSlcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldikgPT4ge1xuICAgICAgICB0aW1lci5wcm9ncmVzcygpXG5cbiAgICAgICAgaWYgKCFldi5sZW5ndGhDb21wdXRhYmxlKSByZXR1cm5cblxuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgICAgICAgIHVwbG9hZGVyOiB0aGlzLFxuICAgICAgICAgICAgYnl0ZXNVcGxvYWRlZDogZXYubG9hZGVkIC8gZXYudG90YWwgKiBmaWxlLnNpemUsXG4gICAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLnNpemUsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2KSA9PiB7XG4gICAgICAgIHRpbWVyLmRvbmUoKVxuXG4gICAgICAgIGlmICh0aGlzLm9wdHMudmFsaWRhdGVTdGF0dXMoZXYudGFyZ2V0LnN0YXR1cywgeGhyLnJlc3BvbnNlVGV4dCwgeGhyKSkge1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLm9wdHMuZ2V0UmVzcG9uc2VEYXRhKHhoci5yZXNwb25zZVRleHQsIHhocilcbiAgICAgICAgICBjb25zdCB1cGxvYWRSZXNwID0ge1xuICAgICAgICAgICAgc3RhdHVzOiBldi50YXJnZXQuc3RhdHVzLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZSwgdXBsb2FkUmVzcClcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVycm9yID0gdGhpcy5vcHRzLmdldFJlc3BvbnNlRXJyb3IoeGhyLnJlc3BvbnNlVGV4dCwgeGhyKSB8fCBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG4gICAgICAgIGVycm9yLnJlcXVlc3QgPSB4aHJcbiAgICAgICAgZW1pdEVycm9yKGVycm9yKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgfSlcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICB0aW1lci5kb25lKClcblxuICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMub3B0cy5nZXRSZXNwb25zZUVycm9yKHhoci5yZXNwb25zZVRleHQsIHhocikgfHwgbmV3IEVycm9yKCdVcGxvYWQgZXJyb3InKVxuICAgICAgICBlbWl0RXJyb3IoZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkub24oJ2NhbmNlbC1hbGwnLCAoKSA9PiB7XG4gICAgICAgIHRpbWVyLmRvbmUoKVxuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgfSlcblxuICAgICAgeGhyLm9wZW4obWV0aG9kLnRvVXBwZXJDYXNlKCksIGVuZHBvaW50LCB0cnVlKVxuICAgICAgLy8gSUUxMCBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIGB3aXRoQ3JlZGVudGlhbHNgIGFuZCBgcmVzcG9uc2VUeXBlYFxuICAgICAgLy8gYmVmb3JlIGBvcGVuKClgIGlzIGNhbGxlZC5cbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0aGlzLm9wdHMud2l0aENyZWRlbnRpYWxzXG4gICAgICBpZiAodGhpcy5vcHRzLnJlc3BvbnNlVHlwZSAhPT0gJycpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMub3B0cy5yZXNwb25zZVR5cGVcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXModGhpcy5vcHRzLmhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRoaXMub3B0cy5oZWFkZXJzW2hlYWRlcl0pXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZChmb3JtRGF0YSlcblxuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdXBsb2FkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBmaWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZUludChpLCAxMCkgKyAxXG4gICAgICBjb25zdCB0b3RhbCA9IGZpbGVzLmxlbmd0aFxuXG4gICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGZpbGUuZXJyb3IpKVxuICAgICAgfSBpZiAoZmlsZS5pc1JlbW90ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWRSZW1vdGUoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy51cGxvYWQoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgfSlcblxuICAgIHJldHVybiBzZXR0bGUocHJvbWlzZXMpXG4gIH1cblxuICBvbkZpbGVSZW1vdmUgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ2ZpbGUtcmVtb3ZlZCcsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoZmlsZUlEID09PSBmaWxlLmlkKSBjYihmaWxlLmlkKVxuICAgIH0pXG4gIH1cblxuICBvblJldHJ5IChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCd1cGxvYWQtcmV0cnknLCAodGFyZ2V0RmlsZUlEKSA9PiB7XG4gICAgICBpZiAoZmlsZUlEID09PSB0YXJnZXRGaWxlSUQpIHtcbiAgICAgICAgY2IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvblJldHJ5QWxsIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdyZXRyeS1hbGwnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVyblxuICAgICAgY2IoKVxuICAgIH0pXG4gIH1cblxuICBvbkNhbmNlbEFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbignY2FuY2VsLWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVVwbG9hZCAoZmlsZUlEcykge1xuICAgIGlmIChmaWxlSURzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy51cHB5LmxvZygnW1hIUlVwbG9hZF0gTm8gZmlsZXMgdG8gdXBsb2FkIScpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICAvLyBObyBsaW1pdCBjb25maWd1cmVkIGJ5IHRoZSB1c2VyLCBhbmQgbm8gUmF0ZUxpbWl0ZWRRdWV1ZSBwYXNzZWQgaW4gYnkgYSBcInBhcmVudFwiIHBsdWdpblxuICAgIC8vIChiYXNpY2FsbHkganVzdCBBd3NTMykgdXNpbmcgdGhlIGludGVybmFsIHN5bWJvbFxuICAgIGlmICh0aGlzLm9wdHMubGltaXQgPT09IDAgJiYgIXRoaXMub3B0c1tpbnRlcm5hbFJhdGVMaW1pdGVkUXVldWVdKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKFxuICAgICAgICAnW1hIUlVwbG9hZF0gV2hlbiB1cGxvYWRpbmcgbXVsdGlwbGUgZmlsZXMgYXQgb25jZSwgY29uc2lkZXIgc2V0dGluZyB0aGUgYGxpbWl0YCBvcHRpb24gKHRvIGAxMGAgZm9yIGV4YW1wbGUpLCB0byBsaW1pdCB0aGUgbnVtYmVyIG9mIGNvbmN1cnJlbnQgdXBsb2Fkcywgd2hpY2ggaGVscHMgcHJldmVudCBtZW1vcnkgYW5kIG5ldHdvcmsgaXNzdWVzOiBodHRwczovL3VwcHkuaW8vZG9jcy94aHItdXBsb2FkLyNsaW1pdC0wJyxcbiAgICAgICAgJ3dhcm5pbmcnXG4gICAgICApXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmxvZygnW1hIUlVwbG9hZF0gVXBsb2FkaW5nLi4uJylcbiAgICBjb25zdCBmaWxlcyA9IGZpbGVJRHMubWFwKChmaWxlSUQpID0+IHRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpXG5cbiAgICBpZiAodGhpcy5vcHRzLmJ1bmRsZSkge1xuICAgICAgLy8gaWYgYnVuZGxlOiB0cnVlLCB3ZSBkb27igJl0IHN1cHBvcnQgcmVtb3RlIHVwbG9hZHNcbiAgICAgIGNvbnN0IGlzU29tZUZpbGVSZW1vdGUgPSBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc1JlbW90ZSlcbiAgICAgIGlmIChpc1NvbWVGaWxlUmVtb3RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fu4oCZdCB1cGxvYWQgcmVtb3RlIGZpbGVzIHdoZW4gdGhlIGBidW5kbGU6IHRydWVgIG9wdGlvbiBpcyBzZXQnKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5oZWFkZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BoZWFkZXJzYCBtYXkgbm90IGJlIGEgZnVuY3Rpb24gd2hlbiB0aGUgYGJ1bmRsZTogdHJ1ZWAgb3B0aW9uIGlzIHNldCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEJ1bmRsZShmaWxlcylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy51cGxvYWRGaWxlcyhmaWxlcykudGhlbigoKSA9PiBudWxsKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgaWYgKHRoaXMub3B0cy5idW5kbGUpIHtcbiAgICAgIGNvbnN0IHsgY2FwYWJpbGl0aWVzIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgICAgLi4uY2FwYWJpbGl0aWVzLFxuICAgICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkuYWRkVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpXG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIGlmICh0aGlzLm9wdHMuYnVuZGxlKSB7XG4gICAgICBjb25zdCB7IGNhcGFiaWxpdGllcyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICAgIC4uLmNhcGFiaWxpdGllcyxcbiAgICAgICAgICBpbmRpdmlkdWFsQ2FuY2VsbGF0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkucmVtb3ZlVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpXG4gIH1cbn1cbiIsImNvbnN0IFVwcHkgPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IEZpbGVJbnB1dCA9IHJlcXVpcmUoJ0B1cHB5L2ZpbGUtaW5wdXQnKVxuY29uc3QgWEhSVXBsb2FkID0gcmVxdWlyZSgnQHVwcHkveGhyLXVwbG9hZCcpXG5jb25zdCBQcm9ncmVzc0JhciA9IHJlcXVpcmUoJ0B1cHB5L3Byb2dyZXNzLWJhcicpXG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5VcHB5JykuaW5uZXJIVE1MID0gJydcblxuY29uc3QgdXBweSA9IG5ldyBVcHB5KHsgZGVidWc6IHRydWUsIGF1dG9Qcm9jZWVkOiB0cnVlIH0pXG51cHB5LnVzZShGaWxlSW5wdXQsIHtcbiAgdGFyZ2V0OiAnLlVwcHknLFxufSlcbnVwcHkudXNlKFByb2dyZXNzQmFyLCB7XG4gIHRhcmdldDogJy5VcHB5UHJvZ3Jlc3NCYXInLFxuICBoaWRlQWZ0ZXJGaW5pc2g6IGZhbHNlLFxufSlcbnVwcHkudXNlKFhIUlVwbG9hZCwge1xuICBlbmRwb2ludDogJ2h0dHBzOi8veGhyLXNlcnZlci5oZXJva3VhcHAuY29tL3VwbG9hZCcsXG4gIGZvcm1EYXRhOiB0cnVlLFxuICBmaWVsZE5hbWU6ICdmaWxlc1tdJyxcbn0pXG5cbi8vIEFuZCBkaXNwbGF5IHVwbG9hZGVkIGZpbGVzXG51cHB5Lm9uKCd1cGxvYWQtc3VjY2VzcycsIChmaWxlLCByZXNwb25zZSkgPT4ge1xuICBjb25zdCB1cmwgPSByZXNwb25zZS51cGxvYWRVUkxcbiAgY29uc3QgZmlsZU5hbWUgPSBmaWxlLm5hbWVcblxuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICBhLmhyZWYgPSB1cmxcbiAgYS50YXJnZXQgPSAnX2JsYW5rJ1xuICBhLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGVOYW1lKSlcbiAgbGkuYXBwZW5kQ2hpbGQoYSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXBsb2FkZWQtZmlsZXMgb2wnKS5hcHBlbmRDaGlsZChsaSlcbn0pXG4iXX0=
