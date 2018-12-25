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
})({"src/roms/MON-2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROM = void 0;
const ROM = `:10000000C30002FFFFFFFFFF2AC008E9FFFFFFFF59
:100010002AC208E9FFFFFFFF2AC408E9FFFFFFFF2C
:100020002AC608E9FFFFFFFF2AC808E9FFFFFFFF14
:100030002ACA08E9FFFFFFFF2ACC08E9FFFFFFFFFC
:10004000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC0
:10005000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB0
:10006000FFFFFFFFFFFFF5DB0032E008F1ED45FF8A
:10007000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF90
:10008000EB28CDAD2EA7E729EF2F6FE6C3ECC747CE
:10009000E36628E84EC22D6BEB4F2F4BA746EAE0F4
:1000A000ACA4AEC9100818042C00FFFFFFFFFFFF2F
:1000B00000090000FFFFFFFFFFFFFFFFF8FF000048
:1000C0001B181E1D12170E290B222917120C24298A
:1000D00029292929FE1C1D18170AFFFFFFFFFFFF12
:1000E000CD8902031804CD89020BCD9004CD700296
:1000F00021DF08CBC6CB8EC37803FFFFFFFFFFFFD6
:10010000FD1010FD11EF12E1135414C910BE10B20E
:1001100010A9199F1A961C801E86207F22772471B1
:10012000266A28642A5F2D592F543250354B3847A0
:100130003C433F3F433C47384B355032542F592DB9
:100140005F2A64286A26712477227F20861E8E1CEF
:10015000961A9419A918B316BE15C914D513E1122D
:10016000EF11FD10FFFFFFFFFFFFFFFFFFFFFFFF8E
:10017000C5D5E5F5A720035F18021E802100018781
:10018000856F4E23467BD30110FE46AFD30110FE90
:100190000D20F1F1E1D1C1C9FFFFFFFFFFFFFFFF1C
:1001A000F5E52AD6087EFEFF2003E1F1C9FEFE2810
:1001B000F123CD700118EEFFFFFFFFFFFFFFFFFFF0
:1001C00021DF08CB462007CBC6CB8EC37803CB8676
:1001D000CBCEC37803FFFFFFC50680CDA00210FB86
:1001E000C1C9FFFFED4BD208CD9004CD7002C3789A
:1001F00003FFED4BD408CD9004CD7002C37803FF0C
:10020000ED73E808310009F5C5D5E5DDE5FDE50844
:10021000D9F5C5D5E5ED57F5AF32CC0832CD083E5E
:10022000FF32E008C34002FFFFFFFFFFFFFFFFFFB9
:10023000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCE
:1002400031C008AFD301D30221B00011D808010595
:1002500000EDB0CD70023E08CD70013E0FCD7001B3
:100260003E0132DF08CDA002CD600318F8FFFFFF8A
:10027000F5E5C5CD8902E6F00F0F0F0F32DC080A55
:10028000E60F32DD08C1E1F1C921D8087E07070772
:1002900007238647237E0707070723864F0AC9FFE0
:1002A000F5E5D5C511D808AFD301CD5003CB4E2805
:1002B00002CBE7D3023E20D301062010FEAFD301CC
:1002C000CD5003CB4E2802CBE7D3023E10D301061C
:1002D0002010FEAFD301CD5003CB4E2802CBE7D385
:1002E000023E08D301062010FEAFD301CD5003CB50
:1002F0004E2802CBE7D3023E04D301062010FEAF06
:10030000D30100C31803FFFFFFFFFFFFCD8902C524
:10031000E131C008E9FFFFFFCD5003CB462802CBF7
:10032000E7D3023E02D301062010FEAFD301CD5029
:1003300003CB462802CBE7D3023E01D301062010AF
:10034000FEAFD301C1D1E1F1C9FFFFFFFFFFFFFF06
:100350002180001A856F7E1321DF08C9FFFFFFFF90
:10036000F5E521E0083EFFBE280E7EE61FCB6E209D
:1003700002C614C3A803FFFFE1F1C9FFFFE1F1C901
:10038000FFFFFFFFCD8902C5DDE1DD23DDE5E17C77
:10039000FE402808DD7E00DD77FF18EE3E0032FFCC
:1003A0003FCD7002C37803FFC601CD7001C32104A5
:1003B000CD89020BDD21FE3FDD7E00DD7701DD2BE7
:1003C000DDE5E179BD20F178BC20EDDD360100CD21
:1003D0007002C37803FFFFFFE5F5DDE5C5AF32DF4F
:1003E00008060621D8083E29772310FC2AD0087E6B
:1003F000FEFF2006C1DDE1F1E1C9FEFE28EEDD21B0
:10040000D8080605DD7E01DD7700DD2310F67E329B
:10041000DD08230640CDA00210FB18D3FFFFFFFF2D
:10042000FFD60136FFCB67C2C004CB6FC2C0042128
:10043000DF08CB46CA550457CD890221DF08CB5EC1
:100440002003AFCBDE07070707E6F08202CD70027C
:10045000C37D03FFFF5721DF08CB9ECB6620080139
:100460000000CD9004CBE6CD89027807070707E6A8
:10047000F05F7907070707E60F8347790707070744
:10048000E6F0824FCD9004CD7002C37D03FFFFFFE5
:10049000F5E521D80878E6F007070707772378E61F
:1004A0000F772379E6F007070707772379E60F77B9
:1004B000E1F1C9FFFFFFFFFFFFFFFFFFFFFFFFFFAE
:1004C00021DF08CB9ECBA6FE10CAE000FE11CAE6D3
:1004D00000FE12CA0C03FE13CAC001FE14CA500566
:1004E000FE15CAFFFFFE16CAFFFFFE17CAF201FE85
:1004F00018CA7005FE19CAFFFFFE1ACAFFFFFE1BCD
:10050000CAFFFFFE1CCA6006FE1DCAFFFFFE1ECA10
:10051000FFFFFE1FCAFFFFFE20CAFFFFFE21CAFF2A
:10052000FFFE22CAFFFFFE23CAFFFFFE24CAB0035C
:10053000FE25CA8403FE26CAFFFFFE27CAE401C3C4
:100540007803FFFFFFFFFFFFFFFFFFFFFFFFFFFF3E
:10055000CD890260693AE10823BE20FC444DCD906C
:1005600004C35302FFFFFFFFFFFFFFFFFFFFFFFF7B
:10057000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF8B
:10058000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7B
:10059000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6B
:1005A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5B
:1005B000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF4B
:1005C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3B
:1005D000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF2B
:1005E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1B
:1005F000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0B
:10060000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA
:10061000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEA
:10062000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDA
:10063000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCA
:10064000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBA
:10065000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAA
:10066000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9A
:10067000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF8A
:10068000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7A
:10069000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6A
:1006A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5A
:1006B000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF4A
:1006C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3A
:1006D000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF2A
:1006E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1A
:1006F000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0A
:10070000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9
:10071000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE9
:10072000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD9
:10073000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC9
:10074000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB9
:10075000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA9
:10076000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF99
:10077000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF89
:10078000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF79
:10079000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF69
:1007A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF59
:1007B000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF49
:1007C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF39
:1007D000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF29
:1007E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF19
:1007F000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF09
:00000001FF
`;
exports.ROM = ROM;
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52741" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/roms/MON-2.js"], null)
//# sourceMappingURL=/MON-2.161923a7.map