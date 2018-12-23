// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/event.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
var $Event;

try {
  new Event('!');
  $Event = Event;
} catch (o_O) {
  try {
    new CustomEvent('!');
    $Event = CustomEvent;
  } catch (o_O) {
    $Event = function (type) {
      var e = document.createEvent('Event');
      e.initEvent(type, false, false);
      return e;
    };
  }
}

var _default = $Event;
exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/weakset.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
var $WeakSet;

try {
  $WeakSet = new WeakSet().constructor;
} catch (o_O) {
  try {
    // IE11 apparently has WeakMap but no WeakSet
    o_O = ($WeakSet = new WeakMap() && function () {
      this.$ = new WeakMap();
    }).prototype;

    o_O.add = function (O) {
      this.$.set(O, 0);
      return this;
    };

    o_O.has = function (O) {
      return this.$.has(O);
    };

    o_O.delete = function (O) {
      return this.$.delete(O);
    };
  } catch (o_O) {
    // all other browsers
    var i = 0;

    o_O = ($WeakSet = function () {
      this.$ = ['__', Math.random(), i++, '__'].join('ws');
    }).prototype;

    o_O.add = function (O) {
      if (!this.has(O)) Object.defineProperty(O, this.$, {
        value: true,
        configurable: true
      });
      return this;
    };

    o_O.has = function (O) {
      return this.hasOwnProperty.call(O, this.$);
    };

    o_O.delete = function (O) {
      return delete O[this.$];
    };
  }
}

var _default = $WeakSet;
exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/assign.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
var _default = Object.assign || function (target) {
  for (var o, i = 1; i < arguments.length; i++) {
    o = arguments[i] || {};

    for (var k in o) {
      if (o.hasOwnProperty(k)) target[k] = o[k];
    }
  }

  return target;
};

exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/poly/contains.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// borrowed from https://github.com/WebReflection/dom4/blob/master/src/dom4.js#L361
var contains = document.contains || function (el) {
  while (el && el !== this) el = el.parentNode;

  return this === el;
};

var _default = contains;
exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/poly/matches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var indexOf = [].indexOf; // borrowed from https://github.com/WebReflection/dom4/blob/master/src/dom4.js#L130

var matches = 'matches' in document.documentElement ? function (el, selector) {
  return el.matches(selector);
} : function (el, selector) {
  return (el.matchesSelector || el.webkitMatchesSelector || el.khtmlMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector || fallback).call(el, selector);
};
var _default = matches;
exports.default = _default;

function fallback(selector) {
  var parentNode = this.parentNode;
  return !!parentNode && -1 < indexOf.call(parentNode.querySelectorAll(selector), this);
}
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/3rd/attributechanged.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi */
function attributechanged(poly) {
  'use strict';

  var Event = poly.Event;
  return function observe(node, attributeFilter) {
    var options = {
      attributes: true,
      attributeOldValue: true
    };
    var filtered = attributeFilter instanceof Array && attributeFilter.length;
    if (filtered) options.attributeFilter = attributeFilter.slice(0);

    try {
      new MutationObserver(changes).observe(node, options);
    } catch (o_O) {
      options.handleEvent = filtered ? handleEvent : attrModified;
      node.addEventListener('DOMAttrModified', options, true);
    }

    return node;
  };

  function attrModified(event) {
    dispatchEvent(event.target, event.attrName, event.prevValue);
  }

  function dispatchEvent(node, attributeName, oldValue) {
    var event = new Event('attributechanged');
    event.attributeName = attributeName;
    event.oldValue = oldValue;
    event.newValue = node.getAttribute(attributeName);
    node.dispatchEvent(event);
  }

  function changes(records) {
    for (var record, i = 0, length = records.length; i < length; i++) {
      record = records[i];
      dispatchEvent(record.target, record.attributeName, record.oldValue);
    }
  }

  function handleEvent(event) {
    if (-1 < this.attributeFilter.indexOf(event.attrName)) attrModified(event);
  }
}

var _default = attributechanged;
exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/3rd/disconnected.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi */
function disconnected(poly) {
  'use strict';

  var CONNECTED = 'connected';
  var DISCONNECTED = 'dis' + CONNECTED;
  var Event = poly.Event;
  var WeakSet = poly.WeakSet;
  var notObserving = true;
  var observer = new WeakSet();
  return function observe(node) {
    if (notObserving) {
      notObserving = !notObserving;
      startObserving(node.ownerDocument);
    }

    observer.add(node);
    return node;
  };

  function startObserving(document) {
    var dispatched = null;

    try {
      new MutationObserver(changes).observe(document, {
        subtree: true,
        childList: true
      });
    } catch (o_O) {
      var timer = 0;
      var records = [];

      var reschedule = function (record) {
        records.push(record);
        clearTimeout(timer);
        timer = setTimeout(function () {
          changes(records.splice(timer = 0, records.length));
        }, 0);
      };

      document.addEventListener('DOMNodeRemoved', function (event) {
        reschedule({
          addedNodes: [],
          removedNodes: [event.target]
        });
      }, true);
      document.addEventListener('DOMNodeInserted', function (event) {
        reschedule({
          addedNodes: [event.target],
          removedNodes: []
        });
      }, true);
    }

    function changes(records) {
      dispatched = new Tracker();

      for (var record, length = records.length, i = 0; i < length; i++) {
        record = records[i];
        dispatchAll(record.removedNodes, DISCONNECTED, CONNECTED);
        dispatchAll(record.addedNodes, CONNECTED, DISCONNECTED);
      }

      dispatched = null;
    }

    function dispatchAll(nodes, type, counter) {
      for (var node, event = new Event(type), length = nodes.length, i = 0; i < length; (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, event, type, counter));
    }

    function dispatchTarget(node, event, type, counter) {
      if (observer.has(node) && !dispatched[type].has(node)) {
        dispatched[counter].delete(node);
        dispatched[type].add(node);
        node.dispatchEvent(event);
        /*
        // The event is not bubbling (perf reason: should it?),
        // hence there's no way to know if
        // stop/Immediate/Propagation() was called.
        // Should DOM Level 0 work at all?
        // I say it's a YAGNI case for the time being,
        // and easy to implement in user-land.
        if (!event.cancelBubble) {
          var fn = node['on' + type];
          if (fn)
            fn.call(node, event);
        }
        */
      }

      for (var children = node.children, length = children.length, i = 0; i < length; dispatchTarget(children[i++], event, type, counter));
    }

    function Tracker() {
      this[CONNECTED] = new WeakSet();
      this[DISCONNECTED] = new WeakSet();
    }
  }
}

var _default = disconnected;
exports.default = _default;
},{}],"node_modules/wicked-elements/esm/3rd/regular-elements/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Event", {
  enumerable: true,
  get: function () {
    return _event.default;
  }
});
Object.defineProperty(exports, "WeakSet", {
  enumerable: true,
  get: function () {
    return _weakset.default;
  }
});
Object.defineProperty(exports, "assign", {
  enumerable: true,
  get: function () {
    return _assign.default;
  }
});
exports.regularElements = exports.default = void 0;

var _event = _interopRequireDefault(require("./poorly/event.js"));

var _weakset = _interopRequireDefault(require("./poorly/weakset.js"));

var _assign = _interopRequireDefault(require("./poorly/assign.js"));

var _contains = _interopRequireDefault(require("./poly/contains.js"));

var _matches = _interopRequireDefault(require("./poly/matches.js"));

var _attributechanged = _interopRequireDefault(require("./3rd/attributechanged.js"));

var _disconnected = _interopRequireDefault(require("./3rd/disconnected.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
var bootstrap = true;
var query = [];
var config = [];
var waiting = {};
var known = {};
var regularElements = {
  Event: _event.default,
  WeakSet: _weakset.default,
  assign: _assign.default,
  document: document,
  define: function (selector, options) {
    if (bootstrap) {
      bootstrap = false;
      init(regularElements.document);
    }

    var type = typeof selector;

    if (type === 'string') {
      if (-1 < query.indexOf(selector)) throw new Error('duplicated: ' + selector);
      query.push(selector);
      config.push(options || {});
      ready();

      if (selector in waiting) {
        waiting[selector](config[config.length - 1]);
        delete waiting[selector];
      }
    } else {
      if (type !== "object" || selector.nodeType !== 1) throw new Error('undefinable: ' + selector);
      setupListeners(selector, options || {});
    }
  },
  get: function (selector) {
    var i = query.indexOf(selector);
    return i < 0 ? null : (0, _assign.default)({}, config[i]);
  },
  whenDefined: function (selector) {
    return Promise.resolve(regularElements.get(selector) || new Promise(function ($) {
      waiting[selector] = $;
    }));
  }
}; // passing along regularElements as poly for Event and WeakSet

exports.regularElements = regularElements;
var lifecycle = (0, _disconnected.default)(regularElements);
var observe = {
  attributechanged: (0, _attributechanged.default)(regularElements),
  connected: lifecycle,
  disconnected: lifecycle
};
var _default = regularElements;
exports.default = _default;

function changes(records) {
  for (var i = 0, length = records.length; i < length; i++) setupList(records[i].addedNodes, false);
}

function init(doc) {
  try {
    new MutationObserver(changes).observe(doc, {
      subtree: true,
      childList: true
    });
  } catch (o_O) {
    doc.addEventListener('DOMNodeInserted', function (e) {
      changes([{
        addedNodes: [e.target]
      }]);
    }, false);
  }

  if (doc.readyState !== 'complete') doc.addEventListener('DOMContentLoaded', ready, {
    once: true
  });
}

function ready() {
  if (query.length) setupList(regularElements.document.querySelectorAll(query), true);
}

function setup(node) {
  setupList(node.querySelectorAll(query), true);

  for (var ws, css, i = 0, length = query.length; i < length; i++) {
    css = query[i];
    ws = known[css] || (known[css] = new _weakset.default());

    if (!ws.has(node) && (0, _matches.default)(node, query[i])) {
      ws.add(node);
      setupListeners(node, config[i]);
    }
  }
}

function setupList(nodes, isElement) {
  for (var node, i = 0, length = nodes.length; i < length; i++) {
    node = nodes[i];
    if (isElement || node.nodeType === 1) setup(node);
  }
}

function setupListener(node, options, type, dispatch) {
  var method = options['on' + type];

  if (method) {
    observe[type](node, options.attributeFilter).addEventListener(type, method, false);
    if (dispatch && _contains.default.call(regularElements.document, node)) node.dispatchEvent(new _event.default(type));
  }
}

function setupListeners(node, options) {
  setupListener(node, options, 'attributechanged', false);
  setupListener(node, options, 'disconnected', false);
  setupListener(node, options, 'connected', true);
}
},{"./poorly/event.js":"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/event.js","./poorly/weakset.js":"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/weakset.js","./poorly/assign.js":"node_modules/wicked-elements/esm/3rd/regular-elements/poorly/assign.js","./poly/contains.js":"node_modules/wicked-elements/esm/3rd/regular-elements/poly/contains.js","./poly/matches.js":"node_modules/wicked-elements/esm/3rd/regular-elements/poly/matches.js","./3rd/attributechanged.js":"node_modules/wicked-elements/esm/3rd/regular-elements/3rd/attributechanged.js","./3rd/disconnected.js":"node_modules/wicked-elements/esm/3rd/regular-elements/3rd/disconnected.js"}],"node_modules/wicked-elements/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireWildcard(require("./3rd/regular-elements/index.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * ISC License
 *
 * Copyright (c) 2018, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
// minifier friendly constants
var ATTRIBUTE_FILTER = 'attributeFilter';
var ONDISCONNECTED = 'ondisconnected';
var ONATTRIBUTECHANGED = 'onattributechanged'; // one off scoped shortcut

var create = Object.create; // get() and whenDefined() are just the same
// NOTE: the component is not returned,
//       only its initial definition.
//       This works well in terms of security
//       so that a component prototype won't be
//       exposed directly through the API.

var wickedElements = create(_index.default, {
  define: {
    value: function (selector, component) {
      var ws = new _index.WeakSet();
      var definition = {
        onconnected: setup
      };
      if (ONDISCONNECTED in component) definition[ONDISCONNECTED] = setup;

      if (ONATTRIBUTECHANGED in component) {
        definition[ONATTRIBUTECHANGED] = setup;
        definition[ATTRIBUTE_FILTER] = component[ATTRIBUTE_FILTER] || [];
      }

      addIfNeeded(component, 'init', init);
      addIfNeeded(component, 'handleEvent', handleEvent);

      _index.default.define(selector, definition);

      function setup(event) {
        var el = event.currentTarget;
        var type = event.type;
        el.removeEventListener(type, setup);

        if (!ws.has(el)) {
          ws.add(el);
          bootstrap(component, event, el, 'on' + type);
        }
      }
    }
  }
});
var _default = wickedElements;
exports.default = _default;

function addIfNeeded(component, key, value) {
  if (!(key in component)) component[key] = value;
}

function bootstrap(component, event, el, method) {
  var handler = create(component);
  var invoke = false;

  for (var key in component) {
    if (key.slice(0, 2) === 'on') {
      el.addEventListener(key.slice(2), handler, false);
      if (key === method) invoke = !invoke;
    }
  }

  handler.init(event);
  if (invoke) handler.handleEvent(event);
}

function handleEvent(event) {
  var type = 'on' + event.type;
  if (type in this) this[type](event);
}

function init(event) {
  this.el = event.currentTarget;
}
},{"./3rd/regular-elements/index.js":"node_modules/wicked-elements/esm/3rd/regular-elements/index.js"}],"node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive so that lit-html will call the function
 * during template rendering, rather than passing as a value.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object
 *
 * @example
 *
 * ```
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 * ```
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => typeof o === 'function' && directives.has(o);

exports.isDirective = isDirective;
},{}],"node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  let node = start;

  while (node !== end) {
    const n = node.nextSibling;
    container.insertBefore(node, before);
    node = n;
  }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, startNode, endNode = null) => {
  let node = startNode;

  while (node !== endNode) {
    const n = node.nextSibling;
    container.removeChild(node);
    node = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noChange = void 0;

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
exports.noChange = noChange;
},{}],"node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    let index = -1;
    let partIndex = 0;
    const nodesToRemove = [];

    const _prepareTemplate = template => {
      const content = template.content; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null

      const walker = document.createTreeWalker(content, 133
      /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
      NodeFilter.SHOW_TEXT */
      , null, false); // The actual previous node, accounting for removals: if a node is removed
      // it will never be the previousNode.

      let previousNode; // Used to set previousNode at the top of the loop.

      let currentNode;

      while (walker.nextNode()) {
        index++;
        previousNode = currentNode;
        const node = currentNode = walker.currentNode;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondance between part index and attribute index.

              let count = 0;

              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].value.indexOf(marker) >= 0) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = result.strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                const strings = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings
                });
                node.removeAttribute(attributeLookupName);
                partIndex += strings.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              _prepareTemplate(node);
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const nodeValue = node.nodeValue;

            if (nodeValue.indexOf(marker) < 0) {
              continue;
            }

            const parent = node.parentNode;
            const strings = nodeValue.split(markerRegex);
            const lastIndex = strings.length - 1; // We have a part for each match found

            partIndex += lastIndex; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              parent.insertBefore(strings[i] === '' ? createMarker() : document.createTextNode(strings[i]), node);
              this.parts.push({
                type: 'node',
                index: index++
              });
            }

            parent.insertBefore(strings[lastIndex] === '' ? createMarker() : document.createTextNode(strings[lastIndex]), node);
            nodesToRemove.push(node);
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.nodeValue === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * previousSibling is being removed (thus it's not the
              //    `previousNode`)
              //  * previousSibling is not a Text node
              //
              // TODO(justinfagnani): We should be able to use the previousNode
              // here as the marker node and reduce the number of extra nodes we
              // add to a template. See
              // https://github.com/PolymerLabs/lit-html/issues/147

              const previousSibling = node.previousSibling;

              if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              this.parts.push({
                type: 'node',
                index: index++
              });
              nodesToRemove.push(node); // If we don't have a nextSibling add a marker node.
              // We don't have to check if the next node is going to be removed,
              // because that node will induce a new marker if so.

              if (node.nextSibling === null) {
                parent.insertBefore(createMarker(), node);
              } else {
                index--;
              }

              currentNode = previousNode;
              partIndex++;
            } else {
              let i = -1;

              while ((i = node.nodeValue.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
              }
            }
          }
      }
    };

    _prepareTemplate(element); // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this._parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this._parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this._parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // When using the Custom Elements polyfill, clone the node, rather than
    // importing it, to keep the fragment in the template's document. This
    // leaves the fragment inert so custom elements won't upgrade and
    // potentially modify their contents by creating a polyfilled ShadowRoot
    // while we traverse the tree.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const parts = this.template.parts;
    let partIndex = 0;
    let nodeIndex = 0;

    const _prepareInstance = fragment => {
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
      // null
      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length && node !== null) {
        const part = parts[partIndex]; // Consecutive Parts may have the same node index, in the case of
        // multiple bound attributes on an element. So each iteration we either
        // increment the nodeIndex, if we aren't on a node with a part, or the
        // partIndex if we are. By not incrementing the nodeIndex when we find a
        // part, we allow for the next part to be associated with the current
        // node if neccessasry.

        if (!(0, _template.isTemplatePartActive)(part)) {
          this._parts.push(undefined);

          partIndex++;
        } else if (nodeIndex === part.index) {
          if (part.type === 'node') {
            const part = this.processor.handleTextExpression(this.options);
            part.insertAfterNode(node);

            this._parts.push(part);
          } else {
            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
          }

          partIndex++;
        } else {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            _prepareInstance(node.content);
          }

          node = walker.nextNode();
        }
      }
    };

    _prepareInstance(fragment);

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const endIndex = this.strings.length - 1;
    let html = '';

    for (let i = 0; i < endIndex; i++) {
      const s = this.strings[i]; // This replace() call does two things:
      // 1) Appends a suffix to all bound attribute names to opt out of special
      // attribute value parsing that IE11 and Edge do, like for style and
      // many SVG attributes. The Template class also appends the same suffix
      // when looking up attributes to creat Parts.
      // 2) Adds an unquoted-attribute-safe marker for the first expression in
      // an attribute. Subsequent attribute expressions will use node markers,
      // and this is safe since attributes with multiple expressions are
      // guaranteed to be quoted.

      let addedMarker = false;
      html += s.replace(_template.lastAttributeNameRegex, (_match, whitespace, name, value) => {
        addedMarker = true;
        return whitespace + name + _template.boundAttributeSuffix + value + _template.marker;
      });

      if (!addedMarker) {
        html += _template.nodeMarker;
      }
    }

    return html + this.strings[endIndex];
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = value => value === null || !(typeof value === 'object' || typeof value === 'function');
/**
 * Sets attribute values for AttributeParts, so that the value is only set once
 * even if there are multiple parts for an attribute.
 */


exports.isPrimitive = isPrimitive;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (v != null && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        } else {
          text += typeof v === 'string' ? v : String(v);
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}

exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(comitter) {
    this.value = undefined;
    this.committer = comitter;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}

exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.options = options;
  }
  /**
   * Inserts this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
   * its next sibling must be static, unchanging nodes such as those that appear
   * in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part._insert(this.startNode = (0, _template.createMarker)());

    part._insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Appends this part after `ref`
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref._insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    const value = this._pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this._commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this._commitTemplateResult(value);
    } else if (value instanceof Node) {
      this._commitNode(value);
    } else if (Array.isArray(value) || value[Symbol.iterator]) {
      this._commitIterable(value);
    } else {
      // Fallback, will render the string representation
      this._commitText(value);
    }
  }

  _insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  _commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this._insert(value);

    this.value = value;
  }

  _commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;

    if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
      // If we only have a single text node between the markers, we can just
      // set its value, rather than replacing it.
      // TODO(justinfagnani): Can we just check if this.value is primitive?
      node.textContent = value;
    } else {
      this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
    }

    this.value = value;
  }

  _commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this._commitNode(fragment);

      this.value = instance;
    }
  }

  _commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this._pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const value = !!this._pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
    }

    this.value = value;
    this._pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  };
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this._pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this._boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this._pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this._pendingValue)) {
      const directive = this._pendingValue;
      this._pendingValue = _part.noChange;
      directive(this);
    }

    if (this._pendingValue === _part.noChange) {
      return;
    }

    const newListener = this._pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    if (shouldAddListener) {
      this._options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
    }

    this.value = newListener;
    this._pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"node_modules/lit-html/lib/directive.js","./dom.js":"node_modules/lit-html/lib/dom.js","./part.js":"node_modules/lit-html/lib/part.js","./template-instance.js":"node_modules/lit-html/lib/template-instance.js","./template-result.js":"node_modules/lit-html/lib/template-result.js","./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const comitter = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return comitter.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const comitter = new _parts.AttributeCommitter(element, name, strings);
    return comitter.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"node_modules/lit-html/lib/parts.js"}],"node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"node_modules/lit-html/lib/template.js"}],"node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"node_modules/lit-html/lib/dom.js","./parts.js":"node_modules/lit-html/lib/parts.js","./template-factory.js":"node_modules/lit-html/lib/template-factory.js"}],"node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"node_modules/lit-html/lib/template-result.js","./lib/directive.js":"node_modules/lit-html/lib/directive.js","./lib/dom.js":"node_modules/lit-html/lib/dom.js","./lib/part.js":"node_modules/lit-html/lib/part.js","./lib/parts.js":"node_modules/lit-html/lib/parts.js","./lib/render.js":"node_modules/lit-html/lib/render.js","./lib/template-factory.js":"node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"node_modules/lit-html/lib/template-instance.js","./lib/template.js":"node_modules/lit-html/lib/template.js"}],"src/util/debounce-render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounceRender = debounceRender;

var _litHtml = require("lit-html");

function debounceRender(object) {
  let requested = false;

  const renderFunc = () => {
    requested = false;
    (0, _litHtml.render)(object.render(object), object.element);
  };

  return () => {
    if (requested) return;
    requested = true;
    requestAnimationFrame(renderFunc);
  };
}
},{"lit-html":"node_modules/lit-html/lit-html.js"}],"src/util/with-props.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withProps = withProps;

var _debounceRender = require("./debounce-render");

function withProps(def) {
  const def2 = Object.create(def);
  const oldInit = def2.init;

  def2.init = function (event) {
    this.element = event.currentTarget;
    this.requestRender = (0, _debounceRender.debounceRender)(this);

    if (oldInit) {
      oldInit.call(this, event);
    } else {
      this.requestRender();
    }

    observeProperties(this, event);
  };

  return def2;
}

;

function observeProperties(object) {
  const props = object.observedProperties;

  if (!props || !props.length) {
    object.requestRender();
    return;
  }

  ;
  const element = object.element;

  for (let prop of props) {
    // if the component already has a property of this
    // name then save it for later
    const hasProp = element.hasOwnProperty(prop);
    let initValue;

    if (hasProp) {
      initValue = element[prop];
      delete element[prop];
    } // define getters and setters for this property name


    Object.defineProperty(element, prop, {
      get() {
        return object[prop];
      },

      set(value) {
        const oldValue = object[prop];
        object[prop] = value;

        if (oldValue !== value && object.propertyChanged) {
          object.propertyChanged(prop, value, oldValue);
        }

        object.requestRender();
      }

    }); // if we saved an old property value earlier
    // reassign it to the component

    if (hasProp) {
      element[prop] = initValue;
    }
  }
}
},{"./debounce-render":"src/util/debounce-render.js"}],"src/util/page-visibility.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHidden = isHidden;
exports.addVisibilityListener = addVisibilityListener;
exports.removeVisiblityListener = removeVisiblityListener;
let [hidden, visibilityChange] = typeof document.msHidden !== 'undefined' ? ['msHidden', 'msvisibilitychange'] : typeof document.webkitHidden !== 'undefined' ? ['webkitHidden', 'webkitvisibilitychange'] : ['hidden', 'visibilitychange'];

function isHidden() {
  return document[hidden];
}

function addVisibilityListener(func) {
  document.addEventListener(visibilityChange, func, false);
}

function removeVisiblityListener(func) {
  document.removeEventListener(visibilityChange, func, false);
}
},{}],"src/util/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "withProps", {
  enumerable: true,
  get: function () {
    return _withProps.withProps;
  }
});
Object.defineProperty(exports, "debounceRender", {
  enumerable: true,
  get: function () {
    return _debounceRender.debounceRender;
  }
});
Object.defineProperty(exports, "isHidden", {
  enumerable: true,
  get: function () {
    return _pageVisibility.isHidden;
  }
});
Object.defineProperty(exports, "addVisibilityListener", {
  enumerable: true,
  get: function () {
    return _pageVisibility.addVisibilityListener;
  }
});
Object.defineProperty(exports, "removeVisiblityListener", {
  enumerable: true,
  get: function () {
    return _pageVisibility.removeVisiblityListener;
  }
});

var _withProps = require("./with-props");

var _debounceRender = require("./debounce-render");

var _pageVisibility = require("./page-visibility");
},{"./with-props":"src/util/with-props.js","./debounce-render":"src/util/debounce-render.js","./page-visibility":"src/util/page-visibility.js"}],"src/assets/TEC-1.jpg":[function(require,module,exports) {
module.exports = "/TEC-1.0e237ea8.jpg";
},{}],"src/util/audio.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.audioValue = audioValue;
exports.isAudioPlaying = isAudioPlaying;
exports.audioInit = audioInit;
exports.audioPlay = audioPlay;
exports.audioToggle = audioToggle;
var AudioContext = window.AudioContext // Default
|| window.webkitAudioContext // Safari and old versions of Chrome
|| false;
let audioCtx;
let source1;
let active = false;

function init() {
  audioCtx = new AudioContext();
  if (source1) source1.stop();
  source1 = audioCtx.createOscillator();
  source1.type = 'square';
  source1.frequency.value = 440;
  source1.connect(audioCtx.destination);
  source1.start();
}

function audioValue(value) {
  if (value != null && active) {
    source1.frequency.setValueAtTime(value, audioCtx.currentTime);
  }
}

function isAudioPlaying() {
  return active;
}

function audioInit() {
  if (!audioCtx) {
    init();
  }

  active = true;
}

function audioPlay(state) {
  if (!audioCtx) {
    init();
  }

  if (active === state) return;

  if (active) {
    audioCtx.suspend();
    active = false;
  } else {
    audioCtx.resume();
    active = true;
  }
}

function audioToggle() {
  if (active) audioPause();else audioPlay();
}
},{}],"src/components/wicked-tec1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wickedTec1 = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

var _TEC = _interopRequireDefault(require("../assets/TEC-1.jpg"));

var _audio = require("../util/audio");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const keyMap = {
  Digit0: 0x00,
  Digit1: 0x01,
  Digit2: 0x02,
  Digit3: 0x03,
  Digit4: 0x04,
  Digit5: 0x05,
  Digit6: 0x06,
  Digit7: 0x07,
  Digit8: 0x08,
  Digit9: 0x09,
  KeyA: 0x0A,
  KeyB: 0x0B,
  KeyC: 0x0C,
  KeyD: 0x0D,
  KeyE: 0x0E,
  KeyF: 0x0F,
  Space: 0x13,
  Tab: 0x13,
  Enter: 0x12,
  Minus: 0x11,
  ArrowDown: 0x11,
  ArrowUp: 0x10
};
const wickedTec1 = (0, _util.withProps)({
  init: function (event) {
    this.digits = 0;
    this.segments = 0;
    this.display = Array(6).fill(0);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.classic = localStorage.getItem('classic') === 'true';
    this.speed = localStorage.getItem('speed');
  },

  onconnected(event) {
    this.worker = new Worker("/worker.4293523f.js");

    this.worker.onmessage = event => {
      let view = new Uint8Array(event.data.buffer);
      this.digits = view[1];
      this.segments = view[2];
      this.requestRender();
      this.display = [...new Uint8Array(event.data.display)];
      this.wavelength = event.data.wavelength;
      this.frequency = this.wavelength ? 500000 / this.wavelength : 0;
      (0, _audio.audioValue)(this.frequency);
    };

    this.worker.postMessage({
      type: 'INIT'
    });
    this.postSpeed(this.speed);
    document.addEventListener("keydown", this.handleKeyDown);
    (0, _util.addVisibilityListener)(this.handleVisibility);
  },

  ondisconnected(event) {
    this.worker.terminate();
    document.removeEventListener("keydown", this.handleKeyDown);
    (0, _util.removeVisiblityListener)(this.handleVisibility);
  },

  handleVisibility() {
    console.log('isHidden', (0, _util.isHidden)());
    (0, _audio.audioPlay)(!(0, _util.isHidden)());
    this.worker.postMessage({
      type: 'HIDDEN',
      value: (0, _util.isHidden)()
    });
  },

  handleKeyDown(event) {
    if (this.handleButton(event.code, event.shiftKey, event.ctrlKey)) {
      event.preventDefault();
    } else {
      console.log(event, event.code, event.key);
    }
  },

  handleButton(code, shiftKey, ctrlKey) {
    (0, _audio.audioInit)();

    if (code === 'Escape') {
      this.worker.postMessage({
        type: 'RESET'
      });
      return true;
    }

    if (code === 'Space') {
      this.worker.postMessage({
        type: 'PAUSE'
      });
      return true;
    } else if (code in keyMap) {
      let keyCode = keyMap[code];

      if (shiftKey) {
        keyCode = keyCode | 0x80;
      }

      this.worker.postMessage({
        type: 'SET_INPUT_VALUE',
        port: 0,
        value: keyCode
      });
      this.worker.postMessage({
        type: 'NMI'
      });
      return true;
    }
  },

  handleUpload(event) {
    const files = event.target.files;
    if (files == null || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.worker.postMessage({
        type: 'UPDATE_MEMORY',
        value: reader.result
      });
    };

    reader.readAsText(file);
  },

  postSpeed(speed) {
    this.worker.postMessage({
      type: 'SET_SPEED',
      value: speed
    });
  },

  render({
    digits,
    segments,
    display,
    wavelength,
    frequency
  }) {
    return _litHtml.html`
<style>
    body {
        font-family: sans-serif;
    }
    #tec1 {
        width: 600px;
        height: 375px;
        background-image: url(${_TEC.default});
        background-size: 100% 100%;
        position: relative;
    }

    #digitPane {
        direction: rtl;
        padding: 0px 20px;
        position: relative;
        top: 74.4%;
        right: 42.5%;
    }

    .off {
        fill: #320000;
    }

    .on {
        fill: red;
    }

    [is=key-button] {
        height: 0px;
    }

    [is=key-button] {
        position: absolute;
        background-color: #cd3d45;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: bold;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        left: 438px;
        top: 301px;
    }
</style>
<div style="display:inline-block">
    <div id="tec1">
        ${this.classic ? _litHtml.html`<div is="keypad-classic" @click=${event => this.handleButton(event.detail.code)}></div>` : _litHtml.html`<div is="keypad-modern" @click=${event => this.handleButton(event.detail.code)}></div>`}
        <div is="key-button" .text=${'R'}  .color=${'#cd3d45'} .left=${349} .top=${301} @click=${() => this.handleButton('Escape')}></div>

        <div id="digitPane">
            <div id="seven" is="seven-seg-display" .digits=${digits} .segments=${segments} .display=${display}></div>
        </div>
    </div>
    <div style="display:flex; justify-content:space-between;">
        <div>
            <input type="checkbox"
                ?checked=${this.classic}
                @change=${event => {
      this.classic = event.target.checked;
      localStorage.setItem('classic', String(this.classic));
    }}
                >original key layout
        </div>
        <input type="file" @change=${event => this.handleUpload(event)}>
        <div>
            Speed
            <input
                type="range"
                min="0"
                max="99"
                value=${this.speed || "50"}
                @change=${event => {
      this.speed = event.target.value;
      localStorage.setItem('speed', String(this.speed));
      this.worker.postMessage({
        type: 'SET_SPEED',
        value: this.speed
      });
      this.postSpeed(this.speed);
    }}
                >
        </div>
    </div>
    <p>MON 1 Restarts:</p>
    <div style="display:flex; justify-content:space-between">
        <div>
            <div>CF (RST 1)	INVADERS</div>
            <div>D7 (RST 2)	NIM</div>
            <div>DF (RST 3)	LUNALANDER</div>
        </div>
        <div>
            <div>EF (RST 5)	TUNE 1 Bealach An Doirín</div>
            <div>F7 (RST 6)	TUNE 2 Biking up the Strand</div>
        </div>
    </div>
</div>
<!-- <div is="instructions" style="margin-left: 35px"></div> -->
`;
  }

});
exports.wickedTec1 = wickedTec1;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js","../assets/TEC-1.jpg":"src/assets/TEC-1.jpg","../util/audio":"src/util/audio.js","./../worker/worker.js":[["worker.4293523f.js","src/worker/worker.js"],"worker.4293523f.map","src/worker/worker.js"]}],"src/components/seven-seg-display.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sevenSegDisplay = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const sevenSegDisplay = (0, _util.withProps)({
  init(event) {
    this.display0 = Array(6).fill(0);
    this.display = [...this.display0];
    this.blanks = 0;
  },

  get observedProperties() {
    return ['digits', 'segments', 'display'];
  },

  render({
    digits,
    segments,
    display
  }) {
    return _litHtml.html`
<div style="white-space: nowrap;">${display.map((segs, index) => _litHtml.html`
<span is="seven-seg" style=${index == 1 ? 'margin-left:2.2%' : ''} .segments=${segs}>
</div>`)}</span>
`;
  }

});
exports.sevenSegDisplay = sevenSegDisplay;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/components/seven-seg.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sevenSeg = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const sevenSeg = (0, _util.withProps)({
  get observedProperties() {
    return ['segments'];
  },

  render({
    segments
  }) {
    return _litHtml.html`
            <div style="display:inline-block;width:4.35%;margin-left:1.7%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 12 20">
                    <g class="digit">
                        <polygon id="a" class=${segments & 0x01 ? 'on' : 'off'} points=" 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
                        <polygon id="b" class=${segments & 0x08 ? 'on' : 'off'} points=" 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
                        <polygon id="c" class=${segments & 0x20 ? 'on' : 'off'} points=" 9, 9 10,10 10,16  9,17  8,16  8,10" />
                        <polygon id="d" class=${segments & 0x80 ? 'on' : 'off'} points=" 9,17  8,18  2,18  1,17  2,16  8,16" />
                        <polygon id="e" class=${segments & 0x40 ? 'on' : 'off'} points=" 1,17  0,16  0,10  1, 9  2,10  2,16" />
                        <polygon id="f" class=${segments & 0x02 ? 'on' : 'off'} points=" 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
                        <polygon id="g" class=${segments & 0x04 ? 'on' : 'off'} points=" 1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
                        <circle class=${segments & 0x10 ? 'on' : 'off'} cx="11" cy="17" r="1" />
                    </g>
                </svg>
            </div>
        `;
  }

});
exports.sevenSeg = sevenSeg;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/components/instructions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instructions = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const instructions = (0, _util.withProps)({
  render({
    segments
  }) {
    return _litHtml.html`
        <h1>TEC-1</h1>
        <table style="width: 600px">
            <tbody>
                <tr style="text-align: left;">
                    <th>Key</th>
                    <th>Description</th>
                    <th>TEC-1</th>
                </tr>
                <tr>
                    <td>0-9,A-F</td>
                    <td>Hex digits</td>
                    <td></td>
                </tr>
                <tr>
                    <td>ESC</td>
                    <td>Reset</td>
                    <td>(RES)</td>
                </tr>
                <tr>
                    <td>tab</td>
                    <td>Mode</td>
                    <td>(AD)</td>
                </tr>
                <tr>
                    <td>Enter</td>
                    <td>Run</td>
                    <td>(GO)</td>
                </tr>
                <tr>
                    <td>Arrow Up</td>
                    <td>Increase</td>
                    <td>(+)</td>
                </tr>
                <tr>
                    <td>Arrow Down</td>
                    <td>Decrease</td>
                    <td>(-)</td>
                </tr>
                <tr>
                    <td>Space</td>
                    <td>Pause/Resume</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
`;
  }

});
exports.instructions = instructions;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/components/key-button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyButton = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const keyButton = (0, _util.withProps)({
  get observedProperties() {
    return ['text', 'color', 'left', 'top'];
  },

  render({
    text,
    color,
    left,
    top
  }) {
    this.element.style = `background-color:${color};left:${left}px;top:${top}px`;
    return _litHtml.html`
            ${text}
        `;
  }

});
exports.keyButton = keyButton;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/components/keypad-classic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyPadClassic = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const keyPadClassic = (0, _util.withProps)({
  handleButton(code) {
    const event = new CustomEvent('click', {
      detail: {
        code: code
      }
    });
    this.element.dispatchEvent(event);
  },

  render() {
    return _litHtml.html`
<div is="key-button" .text=${'AD'} .color=${'#cd3d45'} .left=${438} .top=${239} @click=${() => this.handleButton('Tab')}></div>
<div is="key-button" .text=${'3'} .color=${'#efedeb'} .left=${468} .top=${239} @click=${() => this.handleButton('Digit3')}></div>
<div is="key-button" .text=${'7'}  .color=${'#efedeb'} .left=${500} .top=${239} @click=${() => this.handleButton('Digit7')}></div>
<div is="key-button" .text=${'B'} .color=${'#efedeb'} .left=${531} .top=${239} @click=${() => this.handleButton('KeyB')}></div>
<div is="key-button" .text=${'F'} .color=${'#efedeb'} .left=${562} .top=${239} @click=${() => this.handleButton('KeyF')}></div>

<div is="key-button" .text=${'GO'} .color=${'#cd3d45'} .left=${438} .top=${270} @click=${() => this.handleButton('Enter')}></div>
<div is="key-button" .text=${'2'} .color=${'#efedeb'} .left=${468} .top=${270} @click=${() => this.handleButton('Digit2')}></div>
<div is="key-button" .text=${'6'} .color=${'#efedeb'} .left=${500} .top=${270} @click=${() => this.handleButton('Digit6')}></div>
<div is="key-button" .text=${'A'} .color=${'#efedeb'} .left=${531} .top=${270} @click=${() => this.handleButton('KeyA')}></div>
<div is="key-button" .text=${'E'} .color=${'#efedeb'} .left=${562} .top=${270} @click=${() => this.handleButton('KeyE')}></div>

<div is="key-button" .text=${'-'}  .color=${'#cd3d45'} .left=${438} .top=${301} @click=${() => this.handleButton('ArrowDown')}></div>
<div is="key-button" .text=${'1'} .color=${'#efedeb'} .left=${468} .top=${301} @click=${() => this.handleButton('Digit1')}></div>
<div is="key-button" .text=${'5'} .color=${'#efedeb'} .left=${500} .top=${301} @click=${() => this.handleButton('Digit5')}></div>
<div is="key-button" .text=${'9'} .color=${'#efedeb'} .left=${531} .top=${301} @click=${() => this.handleButton('Digit9')}></div>
<div is="key-button" .text=${'D'} .color=${'#efedeb'} .left=${562} .top=${301} @click=${() => this.handleButton('KeyD')}></div>

<div is="key-button" .text=${'+'}  .color=${'#cd3d45'} .left=${438} .top=${331} @click=${() => this.handleButton('ArrowUp')}></div>
<div is="key-button" .text=${'0'} .color=${'#efedeb'} .left=${468} .top=${331} @click=${() => this.handleButton('Digit0')}></div>
<div is="key-button" .text=${'4'} .color=${'#efedeb'} .left=${500} .top=${332} @click=${() => this.handleButton('Digit4')}></div>
<div is="key-button" .text=${'8'} .color=${'#efedeb'} .left=${531} .top=${332} @click=${() => this.handleButton('Digit8')}></div>
<div is="key-button" .text=${'C'} .color=${'#efedeb'} .left=${562} .top=${332} @click=${() => this.handleButton('KeyC')}></div>
        `;
  }

});
exports.keyPadClassic = keyPadClassic;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/components/keypad-modern.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyPadModern = void 0;

var _litHtml = require("lit-html");

var _util = require("../util");

const keyPadModern = (0, _util.withProps)({
  handleButton(code) {
    const event = new CustomEvent('click', {
      detail: {
        code: code
      }
    });
    this.element.dispatchEvent(event);
  },

  render() {
    return _litHtml.html`
<div is="key-button" .text=${'AD'} .color=${'#cd3d45'} .left=${438} .top=${239} @click=${() => this.handleButton('Tab')}></div>
<div is="key-button" .text=${'C'} .color=${'#efedeb'} .left=${468} .top=${239} @click=${() => this.handleButton('KeyC')}></div>
<div is="key-button" .text=${'D'}  .color=${'#efedeb'} .left=${500} .top=${239} @click=${() => this.handleButton('KeyD')}></div>
<div is="key-button" .text=${'E'} .color=${'#efedeb'} .left=${531} .top=${239} @click=${() => this.handleButton('KeyE')}></div>
<div is="key-button" .text=${'F'} .color=${'#efedeb'} .left=${562} .top=${239} @click=${() => this.handleButton('KeyF')}></div>

<div is="key-button" .text=${'GO'} .color=${'#cd3d45'} .left=${438} .top=${270} @click=${() => this.handleButton('Enter')}></div>
<div is="key-button" .text=${'8'} .color=${'#efedeb'} .left=${468} .top=${270} @click=${() => this.handleButton('Digit8')}></div>
<div is="key-button" .text=${'9'} .color=${'#efedeb'} .left=${500} .top=${270} @click=${() => this.handleButton('Digit9')}></div>
<div is="key-button" .text=${'A'} .color=${'#efedeb'} .left=${531} .top=${270} @click=${() => this.handleButton('KeyA')}></div>
<div is="key-button" .text=${'B'} .color=${'#efedeb'} .left=${562} .top=${270} @click=${() => this.handleButton('KeyB')}></div>

<div is="key-button" .text=${'+'}  .color=${'#cd3d45'} .left=${438} .top=${301} @click=${() => this.handleButton('ArrowUp')}></div>
<div is="key-button" .text=${'4'} .color=${'#efedeb'} .left=${468} .top=${301} @click=${() => this.handleButton('Digit4')}></div>
<div is="key-button" .text=${'5'} .color=${'#efedeb'} .left=${500} .top=${301} @click=${() => this.handleButton('Digit5')}></div>
<div is="key-button" .text=${'6'} .color=${'#efedeb'} .left=${531} .top=${301} @click=${() => this.handleButton('Digit6')}></div>
<div is="key-button" .text=${'7'} .color=${'#efedeb'} .left=${562} .top=${301} @click=${() => this.handleButton('Digit7')}></div>

<div is="key-button" .text=${'-'}  .color=${'#cd3d45'} .left=${438} .top=${331} @click=${() => this.handleButton('ArrowDown')}></div>
<div is="key-button" .text=${'0'} .color=${'#efedeb'} .left=${468} .top=${331} @click=${() => this.handleButton('Digit0')}></div>
<div is="key-button" .text=${'1'} .color=${'#efedeb'} .left=${500} .top=${332} @click=${() => this.handleButton('Digit1')}></div>
<div is="key-button" .text=${'2'} .color=${'#efedeb'} .left=${531} .top=${332} @click=${() => this.handleButton('Digit2')}></div>
<div is="key-button" .text=${'3'} .color=${'#efedeb'} .left=${562} .top=${332} @click=${() => this.handleButton('Digit3')}></div>
        `;
  }

});
exports.keyPadModern = keyPadModern;
},{"lit-html":"node_modules/lit-html/lit-html.js","../util":"src/util/index.js"}],"src/app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initApp = initApp;

var _wickedElements = _interopRequireDefault(require("wicked-elements"));

var _wickedTec = require("./components/wicked-tec1");

var _sevenSegDisplay = require("./components/seven-seg-display");

var _sevenSeg = require("./components/seven-seg");

var _instructions = require("./components/instructions");

var _keyButton = require("./components/key-button");

var _keypadClassic = require("./components/keypad-classic");

var _keypadModern = require("./components/keypad-modern");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initApp() {
  _wickedElements.default.define('[is="wicked-tec1"]', _wickedTec.wickedTec1);

  _wickedElements.default.define('[is="seven-seg-display"]', _sevenSegDisplay.sevenSegDisplay);

  _wickedElements.default.define('[is="seven-seg"]', _sevenSeg.sevenSeg);

  _wickedElements.default.define('[is="instructions"]', _instructions.instructions);

  _wickedElements.default.define('[is="key-button"]', _keyButton.keyButton);

  _wickedElements.default.define('[is="keypad-classic"]', _keypadClassic.keyPadClassic);

  _wickedElements.default.define('[is="keypad-modern"]', _keypadModern.keyPadModern);
}
},{"wicked-elements":"node_modules/wicked-elements/esm/index.js","./components/wicked-tec1":"src/components/wicked-tec1.js","./components/seven-seg-display":"src/components/seven-seg-display.js","./components/seven-seg":"src/components/seven-seg.js","./components/instructions":"src/components/instructions.js","./components/key-button":"src/components/key-button.js","./components/keypad-classic":"src/components/keypad-classic.js","./components/keypad-modern":"src/components/keypad-modern.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _app = require("./app");

(0, _app.initApp)();
},{"./app":"src/app.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63877" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map