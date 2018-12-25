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
})({"src/roms/MON-1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROM = void 0;
const ROM = `:10000000C38005FFFFFFFFFFC32003FFFFFFFFFFCC
:10001000C3E003FFFFFFFFFFC39004FFFFFFFFFFED
:10002000FFFFFFFFFFFFFFFF213002C34100FFFF83
:10003000213005C34100FFFF21D102220008C37017
:1000400002220008C3B001FFFFFFFFFFFFFFFFFF19
:10005000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB0
:10006000FFFFFFFFFFFFDB00E61FED47C931F00F89
:10007000CD3101CD8E013AF90FFE00C29600ED5749
:10008000FE10DA8800C3E30021F70FCD6F01ED6F9A
:1000900023ED6FC3DA00ED57FE10DAB700AF32FA86
:1000A0000FED57FE13CADA00FE12CAC200FE11CAD3
:1000B000C600FE10CAD0002AF70FCD7B01ED6FC33A
:1000C000E3002AF70FE92AF70F2B22F70FC3E3000B
:1000D0002AF70F2322F70FC3E3003E00060421F3A3
:1000E0000F18073E67060221F10F32F90FD9ED5BB9
:1000F000F70FCD02011ACD0E01D9CBE62310FBC3B9
:100100006D0021F30F7BCD15017ACD1501C921F1C9
:100110000FCD1501C9F5CD26017723F10F0F0F0F74
:10012000CD26017723C9E5215F01E60F856F7EE1CA
:10013000C93EFFED47CD4001ED57FEFFC0C3310181
:10014000DDE5010106DD7E00D302DD2379D301CB9D
:10015000274F3E0A3DC25401D30110E9DDE1C9EB4E
:1001600028CDAD2EA7E729EF2F6FE6C3ECC747CD0B
:100170007B01C0233E00772BED57C9ED57473AFA74
:100180000FFE0078C0AF773D32FA0F78C9000E0A33
:1001900021500029110100AFD3023DD3014110FECF
:1001A000EE80ED5220F5C9FFFFFFFFFFFFFFFFFFCD
:1001B000ED5B00081AE61FFE1FC80000FE1ECAB055
:1001C00001FE00CAE9014713D521F801CDE301F58D
:1001D00078211002CDE3016F2600F14FCD9301D1BC
:1001E000C3B4015F1600197EC9D51100101B7AB384
:1001F000C2ED01D113C3B4018C837C757067625C5E
:1002000057524E4845413C3936322F2C2A27252358
:10021000191A1C1D1E20232527292C2E3133373A6D
:100220003D4145494D52575C10FFFFFFFFFFFFFF67
:1002300006060A0D060D0A0D121614120F11120FE2
:100240000D0D0D0A120F0D0A0806080A0F0A0D0FF0
:1002500006060A0D060D0A0D121614120F11120FC2
:100260000D0D0D0A120F0D0A0806080A0612001ECF
:10027000FD2A0008DD21F10F060621F10F360023CB
:1002800010FB060611F70F21F60F7E122B1B10FA3A
:10029000FD7E00FD23E61FFE1FC8FE1E28D221B3EF
:1002A00002CDE30132F10F3E80F5CD4001F13D205A
:1002B000F818CF006FE6C3ECC747E36E28E8CEC25C
:1002C00064EB4F2F44A746E0A9AECD041018000000
:1002D0000008050C0C0E0013080511050013080991
:1002E0001200091200130805001305031809191953
:1002F000191904051209070D0504000216000A0E5B
:10030000080D00080111041600060E110013051A4D
:100310000000000000001EFFFFFFFFFFFFFFFFFFC8
:10032000DD21F10FAF32FA0F32FB0F060621F10F7C
:1003300036002310FB3AF50FFE00203711F50F2190
:10034000F40F06047E122B1B10FAED5FCDB50332BD
:10035000F10F3E0000F53EFFED473AFB0FCDB50330
:1003600032F60FCD4001ED57FEFFC48E03F13D2064
:10037000E418C2CD8E01060621F10F36002310FBD2
:100380003AFA0F21F30FCD1501CD31011892FE106D
:1003900020083AFB0F3C32FB0FC93AF60F4F21F50C
:1003A0000F06057EB9200A36003AFA0F3C2732FACA
:1003B0000F2B10EFC9E607CD2601C9160E14000C4D
:1003C0000E1205001213140F09041A1F0E08000D57
:1003D0000E19191909000C0E12131A1FFFFFFFFF47
:1003E000DD21F10F3E2332FA0F21F10F0606360010
:1003F0002310FB1E00CD6604CD3101ED57FE043005
:10040000F4FE0028F05F3AFA0FBB284438429327E5
:1004100032FA0FCD660421F60F36AE1600CD40013C
:100420001520FA3AFA0FFE01282C3D27D604273072
:10043000FBC60427FE0028105F3AFA0F932732FA12
:100440000F21F60F362818ADED5FE603282818E8CF
:1004500011BB03C3590411CC03ED530008CD700246
:10046000CD3101C3E00321F10F3AFA0FCD1501237D
:100470007BCD260177C93CC33804FF14121417172B
:100480001214101F0111011101111FFFFFFFFFFFC7
:10049000DD21F10FFD2100083E50FD77003E20FDDB
:1004A0007701AFFD770221F10F060636002310FB1E
:1004B0001680FD7E0121F10FCD15012323FD7E0065
:1004C000CD15013EFFED47CD4001ED57FEFFC4F3D2
:1004D0000415C2B204FD7E02D60127FD770247FD56
:1004E0007E008027FE00CA1105FE60301BFD7700EC
:1004F000C3B004FD7E01FE00C83D27FD7701FD7EEF
:1005000002C60227FD7702C9118404DD210000180C
:1005100003117B04ED530008CDB001CD3101C39030
:1005200004FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD6
:100530000B0A080A0A0A0606060B0A080A0A0A0A29
:100540000A0A0B0A080A0A0A0606060A080A0D0D14
:100550000D0D0D000D05080B0B0B0606060B0A080A
:100560000A0A0A0606060B0A0608080808080A0B03
:100570000A080606060606060000001EFFFFFFFF2B
:1005800021000831F00FDD21F10F22F70FAF32F912
:100590000F32FA0F0E0A215000CD93010E202130A8
:1005A00000CD9301C3E300FFFFFFFFFFFFFFFFFF4D
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/roms/MON-1.js"], null)
//# sourceMappingURL=/MON-1.eb113f9e.map