parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"1Gq+":[function(require,module,exports) {
"use strict";var t;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;try{new Event("!"),t=Event}catch(n){try{new CustomEvent("!"),t=CustomEvent}catch(n){t=function(t){var e=document.createEvent("Event");return e.initEvent(t,!1,!1),e}}}var e=t;exports.default=e;
},{}],"SVSn":[function(require,module,exports) {
"use strict";var t;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;try{t=(new WeakSet).constructor}catch(n){try{(n=(t=new WeakMap&&function(){this.$=new WeakMap}).prototype).add=function(t){return this.$.set(t,0),this},n.has=function(t){return this.$.has(t)},n.delete=function(t){return this.$.delete(t)}}catch(n){var e=0;(n=(t=function(){this.$=["__",Math.random(),e++,"__"].join("ws")}).prototype).add=function(t){return this.has(t)||Object.defineProperty(t,this.$,{value:!0,configurable:!0}),this},n.has=function(t){return this.hasOwnProperty.call(t,this.$)},n.delete=function(t){return delete t[this.$]}}}var r=t;exports.default=r;
},{}],"bYmQ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var o in r=arguments[t]||{})r.hasOwnProperty(o)&&(e[o]=r[o]);return e};exports.default=e;
},{}],"ZOCu":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=document.contains||function(e){for(;e&&e!==this;)e=e.parentNode;return this===e},t=e;exports.default=t;
},{}],"4jq9":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=[].indexOf,t="matches"in document.documentElement?function(e,t){return e.matches(t)}:function(e,t){return(e.matchesSelector||e.webkitMatchesSelector||e.khtmlMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||r).call(e,t)},c=t;function r(t){var c=this.parentNode;return!!c&&-1<e.call(c.querySelectorAll(t),this)}exports.default=c;
},{}],"dMuw":[function(require,module,exports) {
"use strict";function t(t){var e=t.Event;return function(t,e){var a={attributes:!0,attributeOldValue:!0},u=e instanceof Array&&e.length;u&&(a.attributeFilter=e.slice(0));try{new MutationObserver(n).observe(t,a)}catch(o){a.handleEvent=u?i:r,t.addEventListener("DOMAttrModified",a,!0)}return t};function r(t){a(t.target,t.attrName,t.prevValue)}function a(t,r,a){var n=new e("attributechanged");n.attributeName=r,n.oldValue=a,n.newValue=t.getAttribute(r),t.dispatchEvent(n)}function n(t){for(var e,r=0,n=t.length;r<n;r++)a((e=t[r]).target,e.attributeName,e.oldValue)}function i(t){-1<this.attributeFilter.indexOf(t.attrName)&&r(t)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t;exports.default=e;
},{}],"zpeW":[function(require,module,exports) {
"use strict";function e(e){var t="connected",n="dis"+t,d=e.Event,o=e.WeakSet,r=!0,s=new o;return function(e){return r&&(r=!r,function(e){var r=null;try{new MutationObserver(c).observe(e,{subtree:!0,childList:!0})}catch(h){var i=0,a=[],u=function(e){a.push(e),clearTimeout(i),i=setTimeout(function(){c(a.splice(i=0,a.length))},0)};e.addEventListener("DOMNodeRemoved",function(e){u({addedNodes:[],removedNodes:[e.target]})},!0),e.addEventListener("DOMNodeInserted",function(e){u({addedNodes:[e.target],removedNodes:[]})},!0)}function c(e){r=new l;for(var d,o=e.length,s=0;s<o;s++)v((d=e[s]).removedNodes,n,t),v(d.addedNodes,t,n);r=null}function v(e,t,n){for(var o,r=new d(t),s=e.length,i=0;i<s;1===(o=e[i++]).nodeType&&f(o,r,t,n));}function f(e,t,n,d){s.has(e)&&!r[n].has(e)&&(r[d].delete(e),r[n].add(e),e.dispatchEvent(t));for(var o=e.children,i=o.length,a=0;a<i;f(o[a++],t,n,d));}function l(){this[t]=new o,this[n]=new o}}(e.ownerDocument)),s.add(e),e}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e;exports.default=t;
},{}],"NUR4":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"Event",{enumerable:!0,get:function(){return e.default}}),Object.defineProperty(exports,"WeakSet",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(exports,"assign",{enumerable:!0,get:function(){return n.default}}),exports.regularElements=exports.default=void 0;var e=a(require("./poorly/event.js")),t=a(require("./poorly/weakset.js")),n=a(require("./poorly/assign.js")),r=a(require("./poly/contains.js")),o=a(require("./poly/matches.js")),d=a(require("./3rd/attributechanged.js")),u=a(require("./3rd/disconnected.js"));function a(e){return e&&e.__esModule?e:{default:e}}var i=!0,l=[],c=[],s={},f={},p={Event:e.default,WeakSet:t.default,assign:n.default,document:document,define:function(e,t){i&&(i=!1,y(p.document));var n=typeof e;if("string"===n){if(-1<l.indexOf(e))throw new Error("duplicated: "+e);l.push(e),c.push(t||{}),m(),e in s&&(s[e](c[c.length-1]),delete s[e])}else{if("object"!==n||1!==e.nodeType)throw new Error("undefinable: "+e);E(e,t||{})}},get:function(e){var t=l.indexOf(e);return t<0?null:(0,n.default)({},c[t])},whenDefined:function(e){return Promise.resolve(p.get(e)||new Promise(function(t){s[e]=t}))}};exports.regularElements=p;var v=(0,u.default)(p),g={attributechanged:(0,d.default)(p),connected:v,disconnected:v},h=p;function b(e){for(var t=0,n=e.length;t<n;t++)w(e[t].addedNodes,!1)}function y(e){try{new MutationObserver(b).observe(e,{subtree:!0,childList:!0})}catch(t){e.addEventListener("DOMNodeInserted",function(e){b([{addedNodes:[e.target]}])},!1)}"complete"!==e.readyState&&e.addEventListener("DOMContentLoaded",m,{once:!0})}function m(){l.length&&w(p.document.querySelectorAll(l),!0)}function j(e){w(e.querySelectorAll(l),!0);for(var n,r,d=0,u=l.length;d<u;d++)r=l[d],!(n=f[r]||(f[r]=new t.default)).has(e)&&(0,o.default)(e,l[d])&&(n.add(e),E(e,c[d]))}function w(e,t){for(var n,r=0,o=e.length;r<o;r++)n=e[r],(t||1===n.nodeType)&&j(n)}function x(t,n,o,d){var u=n["on"+o];u&&(g[o](t,n.attributeFilter).addEventListener(o,u,!1),d&&r.default.call(p.document,t)&&t.dispatchEvent(new e.default(o)))}function E(e,t){x(e,t,"attributechanged",!1),x(e,t,"disconnected",!1),x(e,t,"connected",!0)}exports.default=h;
},{"./poorly/event.js":"1Gq+","./poorly/weakset.js":"SVSn","./poorly/assign.js":"bYmQ","./poly/contains.js":"ZOCu","./poly/matches.js":"4jq9","./3rd/attributechanged.js":"dMuw","./3rd/disconnected.js":"zpeW"}],"8+Lu":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./3rd/regular-elements/index.js"));function t(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}var n="attributeFilter",r="ondisconnected",i="onattributechanged",o=Object.create,a=o(e.default,{define:{value:function(t,o){var a=new e.WeakSet,c={onconnected:l};function l(e){var t=e.currentTarget,n=e.type;t.removeEventListener(n,l),a.has(t)||(a.add(t),d(o,e,t,"on"+n))}r in o&&(c[r]=l),i in o&&(c[i]=l,c[n]=o[n]||[]),u(o,"init",s),u(o,"handleEvent",f),e.default.define(t,c)}}}),c=a;function u(e,t,n){t in e||(e[t]=n)}function d(e,t,n,r){var i=o(e),a=!1;for(var c in e)"on"===c.slice(0,2)&&(n.addEventListener(c.slice(2),i,!1),c===r&&(a=!a));i.init(t),a&&i.handleEvent(t)}function f(e){var t="on"+e.type;t in this&&this[t](e)}function s(e){this.el=e.currentTarget}exports.default=c;
},{"./3rd/regular-elements/index.js":"NUR4"}],"P1HH":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isDirective=exports.directive=void 0;const e=new WeakMap,t=t=>(...s)=>{const i=t(...s);return e.set(i,!0),i};exports.directive=t;const s=t=>"function"==typeof t&&e.has(t);exports.isDirective=s;
},{}],"JQ4u":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.removeNodes=exports.reparentNodes=exports.isCEPolyfill=void 0;const e=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback;exports.isCEPolyfill=e;const o=(e,o,l=null,s=null)=>{let t=o;for(;t!==l;){const o=t.nextSibling;e.insertBefore(t,s),t=o}};exports.reparentNodes=o;const l=(e,o,l=null)=>{let s=o;for(;s!==l;){const o=s.nextSibling;e.removeChild(s),s=o}};exports.removeNodes=l;
},{}],"m4zr":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.noChange=void 0;const e={};exports.noChange=e;
},{}],"kXJ6":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.lastAttributeNameRegex=exports.createMarker=exports.isTemplatePartActive=exports.Template=exports.boundAttributeSuffix=exports.markerRegex=exports.nodeMarker=exports.marker=void 0;const e=`{{lit-${String(Math.random()).slice(2)}}}`;exports.marker=e;const t=`\x3c!--${e}--\x3e`;exports.nodeMarker=t;const r=new RegExp(`${e}|${t}`);exports.markerRegex=r;const o="$lit$";exports.boundAttributeSuffix=o;class s{constructor(t,s){this.parts=[],this.element=s;let n=-1,a=0;const p=[],c=s=>{const d=s.content,l=document.createTreeWalker(d,133,null,!1);let u,f;for(;l.nextNode();){n++,u=f;const s=f=l.currentNode;if(1===s.nodeType){if(s.hasAttributes()){const x=s.attributes;let p=0;for(let t=0;t<x.length;t++)x[t].value.indexOf(e)>=0&&p++;for(;p-- >0;){const e=t.strings[a],x=i.exec(e)[2],p=x.toLowerCase()+o,c=s.getAttribute(p).split(r);this.parts.push({type:"attribute",index:n,name:x,strings:c}),s.removeAttribute(p),a+=c.length-1}}"TEMPLATE"===s.tagName&&c(s)}else if(3===s.nodeType){const t=s.nodeValue;if(t.indexOf(e)<0)continue;const o=s.parentNode,i=t.split(r),c=i.length-1;a+=c;for(let e=0;e<c;e++)o.insertBefore(""===i[e]?x():document.createTextNode(i[e]),s),this.parts.push({type:"node",index:n++});o.insertBefore(""===i[c]?x():document.createTextNode(i[c]),s),p.push(s)}else if(8===s.nodeType)if(s.nodeValue===e){const e=s.parentNode,t=s.previousSibling;null===t||t!==u||t.nodeType!==Node.TEXT_NODE?e.insertBefore(x(),s):n--,this.parts.push({type:"node",index:n++}),p.push(s),null===s.nextSibling?e.insertBefore(x(),s):n--,f=u,a++}else{let t=-1;for(;-1!==(t=s.nodeValue.indexOf(e,t+1));)this.parts.push({type:"node",index:-1})}}};c(s);for(const e of p)e.parentNode.removeChild(e)}}exports.Template=s;const n=e=>-1!==e.index;exports.isTemplatePartActive=n;const x=()=>document.createComment("");exports.createMarker=x;const i=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;exports.lastAttributeNameRegex=i;
},{}],"nn5n":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TemplateInstance=void 0;var e=require("./dom.js"),t=require("./template.js");class s{constructor(e,t,s){this._parts=[],this.template=e,this.processor=t,this.options=s}update(e){let t=0;for(const s of this._parts)void 0!==s&&s.setValue(e[t]),t++;for(const s of this._parts)void 0!==s&&s.commit()}_clone(){const s=e.isCEPolyfill?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),o=this.template.parts;let n=0,i=0;const r=e=>{const s=document.createTreeWalker(e,133,null,!1);let l=s.nextNode();for(;n<o.length&&null!==l;){const e=o[n];if((0,t.isTemplatePartActive)(e))if(i===e.index){if("node"===e.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(l),this._parts.push(e)}else this._parts.push(...this.processor.handleAttributeExpressions(l,e.name,e.strings,this.options));n++}else i++,"TEMPLATE"===l.nodeName&&r(l.content),l=s.nextNode();else this._parts.push(void 0),n++}};return r(s),e.isCEPolyfill&&(document.adoptNode(s),customElements.upgrade(s)),s}}exports.TemplateInstance=s;
},{"./dom.js":"JQ4u","./template.js":"kXJ6"}],"SM33":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.SVGTemplateResult=exports.TemplateResult=void 0;var e=require("./dom.js"),t=require("./template.js");class s{constructor(e,t,s,r){this.strings=e,this.values=t,this.type=s,this.processor=r}getHTML(){const e=this.strings.length-1;let s="";for(let r=0;r<e;r++){const e=this.strings[r];let l=!1;s+=e.replace(t.lastAttributeNameRegex,(e,s,r,n)=>(l=!0,s+r+t.boundAttributeSuffix+n+t.marker)),l||(s+=t.nodeMarker)}return s+this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}exports.TemplateResult=s;class r extends s{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),s=t.content,r=s.firstChild;return s.removeChild(r),(0,e.reparentNodes)(s,r.firstChild),t}}exports.SVGTemplateResult=r;
},{"./dom.js":"JQ4u","./template.js":"kXJ6"}],"PIiJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.EventPart=exports.PropertyPart=exports.PropertyCommitter=exports.BooleanAttributePart=exports.NodePart=exports.AttributePart=exports.AttributeCommitter=exports.isPrimitive=void 0;var t=require("./directive.js"),e=require("./dom.js"),i=require("./part.js"),s=require("./template-instance.js"),n=require("./template-result.js"),r=require("./template.js");const o=t=>null===t||!("object"==typeof t||"function"==typeof t);exports.isPrimitive=o;class a{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new h(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(null!=t&&(Array.isArray(t)||"string"!=typeof t&&t[Symbol.iterator]))for(const e of t)i+="string"==typeof e?e:String(e);else i+="string"==typeof t?t:String(t)}}return i+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}exports.AttributeCommitter=a;class h{constructor(t){this.value=void 0,this.committer=t}setValue(e){e===i.noChange||o(e)&&e===this.value||(this.value=e,(0,t.isDirective)(e)||(this.committer.dirty=!0))}commit(){for(;(0,t.isDirective)(this.value);){const t=this.value;this.value=i.noChange,t(this)}this.value!==i.noChange&&this.committer.commit()}}exports.AttributePart=h;class l{constructor(t){this.value=void 0,this._pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild((0,r.createMarker)()),this.endNode=t.appendChild((0,r.createMarker)())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t._insert(this.startNode=(0,r.createMarker)()),t._insert(this.endNode=(0,r.createMarker)())}insertAfterPart(t){t._insert(this.startNode=(0,r.createMarker)()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this._pendingValue=t}commit(){for(;(0,t.isDirective)(this._pendingValue);){const t=this._pendingValue;this._pendingValue=i.noChange,t(this)}const e=this._pendingValue;e!==i.noChange&&(o(e)?e!==this.value&&this._commitText(e):e instanceof n.TemplateResult?this._commitTemplateResult(e):e instanceof Node?this._commitNode(e):Array.isArray(e)||e[Symbol.iterator]?this._commitIterable(e):this._commitText(e))}_insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}_commitNode(t){this.value!==t&&(this.clear(),this._insert(t),this.value=t)}_commitText(t){const e=this.startNode.nextSibling;t=null==t?"":t,e===this.endNode.previousSibling&&e.nodeType===Node.TEXT_NODE?e.textContent=t:this._commitNode(document.createTextNode("string"==typeof t?t:String(t))),this.value=t}_commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value&&this.value.template===e)this.value.update(t.values);else{const i=new s.TemplateInstance(e,t.processor,this.options),n=i._clone();i.update(t.values),this._commitNode(n),this.value=i}}_commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const n of t)void 0===(i=e[s])&&(i=new l(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(n),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){(0,e.removeNodes)(this.startNode.parentNode,t.nextSibling,this.endNode)}}exports.NodePart=l;class u{constructor(t,e,i){if(this.value=void 0,this._pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this._pendingValue=t}commit(){for(;(0,t.isDirective)(this._pendingValue);){const t=this._pendingValue;this._pendingValue=i.noChange,t(this)}if(this._pendingValue===i.noChange)return;const e=!!this._pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)),this.value=e,this._pendingValue=i.noChange}}exports.BooleanAttributePart=u;class d extends a{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new c(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}exports.PropertyCommitter=d;class c extends h{}exports.PropertyPart=c;let p=!1;try{const t={get capture(){return p=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(g){}class m{constructor(t,e,i){this.value=void 0,this._pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this._boundHandleEvent=(t=>this.handleEvent(t))}setValue(t){this._pendingValue=t}commit(){for(;(0,t.isDirective)(this._pendingValue);){const t=this._pendingValue;this._pendingValue=i.noChange,t(this)}if(this._pendingValue===i.noChange)return;const e=this._pendingValue,s=this.value,n=null==e||null!=s&&(e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive),r=null!=e&&(null==s||n);n&&this.element.removeEventListener(this.eventName,this._boundHandleEvent,this._options),r&&(this._options=v(e),this.element.addEventListener(this.eventName,this._boundHandleEvent,this._options)),this.value=e,this._pendingValue=i.noChange}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}exports.EventPart=m;const v=t=>t&&(p?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);
},{"./directive.js":"P1HH","./dom.js":"JQ4u","./part.js":"m4zr","./template-instance.js":"nn5n","./template-result.js":"SM33","./template.js":"kXJ6"}],"mAZn":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.defaultTemplateProcessor=exports.DefaultTemplateProcessor=void 0;var e=require("./parts.js");class t{handleAttributeExpressions(t,r,s,o){const a=r[0];if("."===a){return new e.PropertyCommitter(t,r.slice(1),s).parts}return"@"===a?[new e.EventPart(t,r.slice(1),o.eventContext)]:"?"===a?[new e.BooleanAttributePart(t,r.slice(1),s)]:new e.AttributeCommitter(t,r,s).parts}handleTextExpression(t){return new e.NodePart(t)}}exports.DefaultTemplateProcessor=t;const r=new t;exports.defaultTemplateProcessor=r;
},{"./parts.js":"PIiJ"}],"K8aL":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.templateFactory=t,exports.templateCaches=void 0;var e=require("./template.js");function t(t){let s=r.get(t.type);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},r.set(t.type,s));let n=s.stringsArray.get(t.strings);if(void 0!==n)return n;const a=t.strings.join(e.marker);return void 0===(n=s.keyString.get(a))&&(n=new e.Template(t,t.getTemplateElement()),s.keyString.set(a,n)),s.stringsArray.set(t.strings,n),n}const r=new Map;exports.templateCaches=r;
},{"./template.js":"kXJ6"}],"dvwX":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.render=exports.parts=void 0;var e=require("./dom.js"),t=require("./parts.js"),r=require("./template-factory.js");const s=new WeakMap;exports.parts=s;const o=(o,a,p)=>{let d=s.get(a);void 0===d&&((0,e.removeNodes)(a,a.firstChild),s.set(a,d=new t.NodePart(Object.assign({templateFactory:r.templateFactory},p))),d.appendInto(a)),d.setValue(o),d.commit()};exports.render=o;
},{"./dom.js":"JQ4u","./parts.js":"PIiJ","./template-factory.js":"K8aL"}],"KMqM":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"DefaultTemplateProcessor",{enumerable:!0,get:function(){return e.DefaultTemplateProcessor}}),Object.defineProperty(exports,"defaultTemplateProcessor",{enumerable:!0,get:function(){return e.defaultTemplateProcessor}}),Object.defineProperty(exports,"SVGTemplateResult",{enumerable:!0,get:function(){return t.SVGTemplateResult}}),Object.defineProperty(exports,"TemplateResult",{enumerable:!0,get:function(){return t.TemplateResult}}),Object.defineProperty(exports,"directive",{enumerable:!0,get:function(){return r.directive}}),Object.defineProperty(exports,"isDirective",{enumerable:!0,get:function(){return r.isDirective}}),Object.defineProperty(exports,"removeNodes",{enumerable:!0,get:function(){return n.removeNodes}}),Object.defineProperty(exports,"reparentNodes",{enumerable:!0,get:function(){return n.reparentNodes}}),Object.defineProperty(exports,"noChange",{enumerable:!0,get:function(){return o.noChange}}),Object.defineProperty(exports,"AttributeCommitter",{enumerable:!0,get:function(){return i.AttributeCommitter}}),Object.defineProperty(exports,"AttributePart",{enumerable:!0,get:function(){return i.AttributePart}}),Object.defineProperty(exports,"BooleanAttributePart",{enumerable:!0,get:function(){return i.BooleanAttributePart}}),Object.defineProperty(exports,"EventPart",{enumerable:!0,get:function(){return i.EventPart}}),Object.defineProperty(exports,"isPrimitive",{enumerable:!0,get:function(){return i.isPrimitive}}),Object.defineProperty(exports,"NodePart",{enumerable:!0,get:function(){return i.NodePart}}),Object.defineProperty(exports,"PropertyCommitter",{enumerable:!0,get:function(){return i.PropertyCommitter}}),Object.defineProperty(exports,"PropertyPart",{enumerable:!0,get:function(){return i.PropertyPart}}),Object.defineProperty(exports,"parts",{enumerable:!0,get:function(){return u.parts}}),Object.defineProperty(exports,"render",{enumerable:!0,get:function(){return u.render}}),Object.defineProperty(exports,"templateCaches",{enumerable:!0,get:function(){return a.templateCaches}}),Object.defineProperty(exports,"templateFactory",{enumerable:!0,get:function(){return a.templateFactory}}),Object.defineProperty(exports,"TemplateInstance",{enumerable:!0,get:function(){return p.TemplateInstance}}),Object.defineProperty(exports,"createMarker",{enumerable:!0,get:function(){return s.createMarker}}),Object.defineProperty(exports,"isTemplatePartActive",{enumerable:!0,get:function(){return s.isTemplatePartActive}}),Object.defineProperty(exports,"Template",{enumerable:!0,get:function(){return s.Template}}),exports.svg=exports.html=void 0;var e=require("./lib/default-template-processor.js"),t=require("./lib/template-result.js"),r=require("./lib/directive.js"),n=require("./lib/dom.js"),o=require("./lib/part.js"),i=require("./lib/parts.js"),u=require("./lib/render.js"),a=require("./lib/template-factory.js"),p=require("./lib/template-instance.js"),s=require("./lib/template.js");const l=(r,...n)=>new t.TemplateResult(r,n,"html",e.defaultTemplateProcessor);exports.html=l;const c=(r,...n)=>new t.SVGTemplateResult(r,n,"svg",e.defaultTemplateProcessor);exports.svg=c;
},{"./lib/default-template-processor.js":"mAZn","./lib/template-result.js":"SM33","./lib/directive.js":"P1HH","./lib/dom.js":"JQ4u","./lib/part.js":"m4zr","./lib/parts.js":"PIiJ","./lib/render.js":"dvwX","./lib/template-factory.js":"K8aL","./lib/template-instance.js":"nn5n","./lib/template.js":"kXJ6"}],"xHDi":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.debounceRender=r;var e=require("lit-html");function r(r){let t=!1;const n=()=>{t=!1,(0,e.render)(r.render(r),r.element)};return()=>{t||(t=!0,requestAnimationFrame(n))}}
},{"lit-html":"KMqM"}],"+1i3":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.withProps=t;var e=require("./debounce-render");function t(t){const n=Object.create(t),s=n.init;return n.init=function(t){this.element=t.currentTarget,this.requestRender=(0,e.debounceRender)(this),s?s.call(this,t):this.requestRender(),r(this,t)},n}function r(e){const t=e.observedProperties;if(!t||!t.length)return void e.requestRender();const r=e.element;for(let n of t){const t=r.hasOwnProperty(n);let s;t&&(s=r[n],delete r[n]),Object.defineProperty(r,n,{get:()=>e[n],set(t){const r=e[n];e[n]=t,r!==t&&e.propertyChanged&&e.propertyChanged(n,t,r),e.requestRender()}}),t&&(r[n]=s)}}
},{"./debounce-render":"xHDi"}],"f5pY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isHidden=t,exports.addVisibilityListener=n,exports.removeVisiblityListener=d;let[e,i]=void 0!==document.msHidden?["msHidden","msvisibilitychange"]:void 0!==document.webkitHidden?["webkitHidden","webkitvisibilitychange"]:["hidden","visibilitychange"];function t(){return document[e]}function n(e){document.addEventListener(i,e,!1)}function d(e){document.removeEventListener(i,e,!1)}
},{}],"WLd9":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"withProps",{enumerable:!0,get:function(){return e.withProps}}),Object.defineProperty(exports,"debounceRender",{enumerable:!0,get:function(){return r.debounceRender}}),Object.defineProperty(exports,"isHidden",{enumerable:!0,get:function(){return t.isHidden}}),Object.defineProperty(exports,"addVisibilityListener",{enumerable:!0,get:function(){return t.addVisibilityListener}}),Object.defineProperty(exports,"removeVisiblityListener",{enumerable:!0,get:function(){return t.removeVisiblityListener}});var e=require("./with-props"),r=require("./debounce-render"),t=require("./page-visibility");
},{"./with-props":"+1i3","./debounce-render":"xHDi","./page-visibility":"f5pY"}],"QWBP":[function(require,module,exports) {
module.exports="TEC-1.c2019513.jpg";
},{}],"P4dJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.audioValue=i,exports.isAudioPlaying=r,exports.audioInit=s,exports.audioPlay=a,exports.audioToggle=c;var e=window.AudioContext||window.webkitAudioContext||!1;let t,o,n=!1;function u(){t=new e,o&&o.stop(),(o=t.createOscillator()).type="square",o.frequency.value=440,o.connect(t.destination),o.start()}function i(e){null!=e&&n&&o.frequency.setValueAtTime(e,t.currentTime)}function r(){return n}function s(){t||u(),n=!0}function a(e){t||u(),n!==e&&(n?(t.suspend(),n=!1):(t.resume(),n=!0))}function c(){n?audioPause():a()}
},{}],"Bh1I":[function(require,module,exports) {
var t=null;function r(){return t||(t=e()),t}function e(){try{throw new Error}catch(r){var t=(""+r.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);if(t)return n(t[0])}return"/"}function n(t){return(""+t).replace(/^((?:https?|file|ftp):\/\/.+)\/[^\/]+$/,"$1")+"/"}exports.getBundleURL=r,exports.getBaseURL=n;
},{}],"z1Am":[function(require,module,exports) {
var r=require("./bundle-url").getBundleURL;function e(r){Array.isArray(r)||(r=[r]);var e=r[r.length-1];try{return Promise.resolve(require(e))}catch(n){if("MODULE_NOT_FOUND"===n.code)return new u(function(n,i){t(r.slice(0,-1)).then(function(){return require(e)}).then(n,i)});throw n}}function t(r){return Promise.all(r.map(s))}var n={};function i(r,e){n[r]=e}module.exports=exports=e,exports.load=t,exports.register=i;var o={};function s(e){var t;if(Array.isArray(e)&&(t=e[1],e=e[0]),o[e])return o[e];var i=(e.substring(e.lastIndexOf(".")+1,e.length)||e).toLowerCase(),s=n[i];return s?o[e]=s(r()+e).then(function(r){return r&&module.bundle.register(t,r),r}):void 0}function u(r){this.executor=r,this.promise=null}u.prototype.then=function(r,e){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.then(r,e)},u.prototype.catch=function(r){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.catch(r)};
},{"./bundle-url":"Bh1I"}],"ZoHI":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ROM=void 0;const F=":10000000C3F005FFFFFFFFFFC32003FFFFFFFFFF5C\n:10001000C3E003FFFFFFFFFFC39004FFFFFFFFFFED\n:10002000FFFFFFFFFFFFFFFF213002C34100FFFF83\n:10003000213005C34100FFFFC7FFFFFFFFFFFFFFA8\n:10004000FF220008C3B001FFFFFFFFFFFFFFFFFF1C\n:10005000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB0\n:10006000FFFFFFFFFFFFDB00E61FED47C931D00FA9\n:10007000CD3101CD8E013AF90FFE00C29600ED5749\n:10008000FE10DA8800C3E30021F70FCD6F01ED6F9A\n:1000900023ED6FC3DA00ED57FE10DAB700AF32FA86\n:1000A0000FED57FE13CADA00FE12CAC200FE11CAD3\n:1000B000C600FE10CAD0002AF70FCD7B01ED6FC33A\n:1000C000E3002AF70FE92AF70F2B22F70FC3E3000B\n:1000D0002AF70F2322F70FC3E3003E00060421F3A3\n:1000E0000F18073E67060221F10F32F90FD9ED5BB9\n:1000F000F70FCD02011ACD0E01D9CBE62310FBC3B9\n:100100006D0021F30F7BCD15017ACD1501C921F1C9\n:100110000FCD1501C9F5CD26017723F10F0F0F0F74\n:10012000CD26017723C9E5215F01E60F856F7EE1CA\n:10013000C93EFFED47CD4001ED57FEFFC0C3310181\n:10014000DDE5010106DD7E00D302DD2379D301CB9D\n:10015000274F3E0A3DC25401D30110E9DDE1C9EB4E\n:1001600028CDAD2EA7E729EF2F6FE6C3ECC747CD0B\n:100170007B01C0233E00772BED57C9ED57473AFA74\n:100180000FFE0078C0AF773D32FA0F78C9000E0A33\n:1001900021500029110100AFD3023DD3014110FECF\n:1001A000EE80ED5220F5C9FFFFFFFFFFFFFFFFFFCD\n:1001B000ED5B00081AE61FFE1FC80000FE1ECAB055\n:1001C00001FE00CAE9014713D521F801CDE301F58D\n:1001D00078211002CDE3016F2600F14FCD9301D1BC\n:1001E000C3B4015F1600197EC9D51100101B7AB384\n:1001F000C2ED01D113C3B4018C837C757067625C5E\n:1002000057524E4845413C3936322F2C2A27252358\n:10021000191A1C1D1E20232527292C2E3133373A6D\n:100220003D4145494D52575C10FFFFFFFFFFFFFF67\n:1002300006060A0D060D0A0D121614120F11120FE2\n:100240000D0D0D0A120F0D0A0806080A0F0A0D0FF0\n:1002500006060A0D060D0A0D121614120F11120FC2\n:100260000D0D0D0A120F0D0A0806080A0612001ECF\n:10027000FD2A0008DD21F10F060621F10F360023CB\n:1002800010FB060611F70F21F60F7E122B1B10FA3A\n:10029000FD7E00FD23E61FFE1FC8FE1E28D221B3EF\n:1002A00002CDE30132F10F3E80F5CD4001F13D205A\n:1002B000F818CF006FE6C3ECC747E36E28E8CEC25C\n:1002C0006BEB4F2F43A746EAE0AECD0410180000B9\n:1002D0000008050C0C0E0013080511050013080991\n:1002E0001200091200130805001305031809191953\n:1002F000191904051209070D0504000216000A0E5B\n:10030000080D00080111041600060E110013051A4D\n:100310000000000000001EFFFFFFFFFFFFFFFFFFC8\n:10032000DD21F10FAF32FA0F32FB0F060621F10F7C\n:1003300036002310FB3AF50FFE00203711F50F2190\n:10034000F40F06047E122B1B10FAED5FCDB50332BD\n:10035000F10F3E0000F53EFFED473AFB0FCDB50330\n:1003600032F60FCD4001ED57FEFFC48E03F13D2064\n:10037000E418C2CD8E01060621F10F36002310FBD2\n:100380003AFA0F21F30FCD1501CD31011892FE106D\n:1003900020083AFB0F3C32FB0FC93AF60F4F21F50C\n:1003A0000F06057EB9200A36003AFA0F3C2732FACA\n:1003B0000F2B10EFC9E607CD2601C9160E14000C4D\n:1003C0000E1205001213140F09041A1F0E08000D57\n:1003D0000E19191909000C0E12131A1FFFFFFFFF47\n:1003E000DD21F10F3E2332FA0F21F10F0606360010\n:1003F0002310FB1E00CD6604CD3101ED57FE043005\n:10040000F4FE0028F05F3AFA0FBB284438429327E5\n:1004100032FA0FCD660421F60F36AE1600CD40013C\n:100420001520FA3AFA0FFE01282C3D27D604273072\n:10043000FBC60427FE0028105F3AFA0F932732FA12\n:100440000F21F60F362818ADED5FE603282818E8CF\n:1004500011BB03C3590411CC03ED530008CD700246\n:10046000CD3101C3E00321F10F3AFA0FCD1501237D\n:100470007BCD260177C93CC33804FF14121417172B\n:100480001214101F0111011101111FFFFFFFFFFFC7\n:10049000DD21F10FFD2100083E50FD77003E20FDDB\n:1004A0007701AFFD770221F10F060636002310FB1E\n:1004B0001680FD7E0121F10FCD15012323FD7E0065\n:1004C000CD15013EFFED47CD4001ED57FEFFC4F3D2\n:1004D0000415C2B204FD7E02D60127FD770247FD56\n:1004E0007E008027FE00CA1105FE60301BFD7700EC\n:1004F000C3B004FD7E01FE00C83D27FD7701FD7EEF\n:1005000002C60227FD7702C9118404DD210000180C\n:1005100003117B04ED530008CDB001CD3101C39030\n:1005200004FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD6\n:100530000B0A080A0A0A0606060B0A080A0A0A0A29\n:100540000A0A0B0A080A0A0A0606060A080A0D0D14\n:100550000D0D0D000D05080B0B0B0606060B0A080A\n:100560000A0A0A0606060B0A0608080808080A0B03\n:100570000A080606060606060000001EFFFFFFFF2B\n:1005800021000831D00FDD21F10F22F70FAF32F932\n:100590000F32FA0F0E0A215000CD93010E202130A8\n:1005A00000CD9301C3E300FFFFFFFFFFFFFFFFFF4D\n:1005B00021000811000B7EFEFFC2C205210008C306\n:1005C000B605D3031AFEFFC2D00511000BC3C40544\n:1005D000D304CDE105131AD304CDE1051323C3B62B\n:1005E0000501FF030B78B1C2E405C9FFFFFFFFFF60\n:1005F000ED73D80F31F00FF5C5D5E5DDE5FDE50864\n:10060000D9F5C5D5E5ED57F5C38005FFFFFFFFFF21\n:10061000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEA\n:10062000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDA\n:10063000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCA\n:10064000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBA\n:10065000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAA\n:10066000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9A\n:10067000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF8A\n:10068000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7A\n:10069000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6A\n:1006A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5A\n:1006B000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF4A\n:1006C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3A\n:1006D000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF2A\n:1006E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1A\n:1006F000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0A\n:10070000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9\n:10071000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE9\n:10072000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD9\n:10073000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC9\n:10074000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB9\n:10075000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA9\n:10076000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF99\n:10077000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF89\n:10078000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF79\n:10079000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF69\n:1007A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF59\n:1007B000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF49\n:1007C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF39\n:1007D000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF29\n:1007E000FFFF6AC7FBC7500A93C7FBC78DC6BF0D83\n:1007F000B1C643010BBC000FE00F6D0143016E0851\n:00000001FF\n";exports.ROM=F;
},{}],"tH/w":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.wickedTec1=void 0;var e=require("lit-html"),i=require("../util"),t=d(require("../assets/TEC-1.jpg")),s=require("../util/audio");function d(e){return e&&e.__esModule?e:{default:e}}const n={Digit0:0,Digit1:1,Digit2:2,Digit3:3,Digit4:4,Digit5:5,Digit6:6,Digit7:7,Digit8:8,Digit9:9,KeyA:10,KeyB:11,KeyC:12,KeyD:13,KeyE:14,KeyF:15,Space:19,Tab:19,Enter:18,Minus:17,ArrowDown:17,ArrowUp:16},o=(0,i.withProps)({init:function(e){this.digits=0,this.segments=0,this.display=Array(6).fill(0),this.handleVisibility=this.handleVisibility.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.classic="true"===localStorage.getItem("classic"),this.speed=localStorage.getItem("speed"),this.shiftLocked=!1},onconnected(e){this.worker=new Worker("worker.679e6af4.js"),this.worker.onmessage=(e=>{let i=new Uint8Array(e.data.buffer);this.digits=i[1],this.segments=i[2],this.requestRender(),this.display=[...new Uint8Array(e.data.display)],this.wavelength=e.data.wavelength,this.frequency=this.wavelength?5e5/this.wavelength:0,(0,s.audioValue)(this.frequency)}),this.worker.postMessage({type:"INIT"}),this.postSpeed(this.speed),document.addEventListener("keydown",this.handleKeyDown),(0,i.addVisibilityListener)(this.handleVisibility)},ondisconnected(e){this.worker.terminate(),document.removeEventListener("keydown",this.handleKeyDown),(0,i.removeVisiblityListener)(this.handleVisibility)},handleVisibility(){console.log("isHidden",(0,i.isHidden)()),(0,s.audioPlay)(!(0,i.isHidden)()),this.worker.postMessage({type:"HIDDEN",value:(0,i.isHidden)()})},handleKeyDown(e){this.handleButton(e.code,e.shiftKey,e.ctrlKey)?e.preventDefault():console.log(e,e.code,e.key)},handleButton(e,i,t){if((0,s.audioInit)(),"Escape"===e)return this.worker.postMessage({type:"RESET"}),!0;if("Space"===e)return this.worker.postMessage({type:"PAUSE"}),!0;if("ShiftLock"===e)return this.shiftLocked=!this.shiftLocked,!0;if(e in n){let t=n[e];i&&(this.shiftLocked=!0);const s=32,d=this.shiftLocked?t&~s:t|s;return this.shiftLocked=!1,this.worker.postMessage({type:"SET_INPUT_VALUE",port:0,value:d}),this.worker.postMessage({type:"NMI"}),!0}},handleChangeROM(e){const i=e.target.value;("MON-1A"==i?require("_bundle_loader")(require.resolve("../roms/MON-1A")):"MON-1B"==i?require("_bundle_loader")(require.resolve("../roms/MON-1B")):"MON-2"==i?require("_bundle_loader")(require.resolve("../roms/MON-2")):require("_bundle_loader")(require.resolve("../roms/MON-1"))).then(e=>this.worker.postMessage({type:"UPDATE_MEMORY",value:e.ROM}))},handleUpload(e){const i=e.target.files;if(null==i||0===i.length)return;const t=i[0],s=new FileReader;s.onload=(()=>this.worker.postMessage({type:"UPDATE_MEMORY",value:s.result})),s.readAsText(t)},postSpeed(e){this.worker.postMessage({type:"SET_SPEED",value:e})},render({digits:i,segments:s,display:d,shiftLocked:n}){return e.html`
<style>
    body {
        font-family: sans-serif;
        font-size: 14px;
    }
    #tec1 {
        width: 600px;
        height: 375px;
        background-image: url(${t.default});
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
<div style="display:flex; justify-content:space-between; align-items: center; margin: 3px">
        <div>
            ROM
            <select @change=${e=>this.handleChangeROM(e)}>
                <option>MON-1</option>
                <option>MON-1A</option>
                <option>MON-1B</option>
                <option>MON-2</option>
            </select>
        </div>
        <input type="file" @change=${e=>this.handleUpload(e)}>
    </div>
    <div id="tec1">
        ${this.classic?e.html`<div is="keypad-classic" @click=${e=>this.handleButton(e.detail.code)}></div>`:e.html`<div is="keypad-modern" @click=${e=>this.handleButton(e.detail.code)}></div>`}
        <div is="key-button" .text=${"R"}  .color=${"#cd3d45"} .left=${349} .top=${301} @click=${()=>this.handleButton("Escape")}></div>
        <div is="key-button" .text=${"SH"}  .color=${n?"#d8696f":"#cd3d45"} .left=${386} .top=${333} @click=${()=>this.handleButton("ShiftLock")}></div>

        <div id="digitPane">
            <div id="seven" is="seven-seg-display" .digits=${i} .segments=${s} .display=${d}></div>
        </div>
    </div>
    <div style="display:flex; justify-content:space-between; align-items: center; margin: 3px">
        <div>
            <input type="checkbox"
                ?checked=${this.classic}
                @change=${e=>{this.classic=e.target.checked,localStorage.setItem("classic",String(this.classic))}}
                >original key layout
        </div>
        <div>
            Speed
            <input
                type="range"
                min="0"
                max="99"
                value=${this.speed||"50"}
                @change=${e=>{this.speed=e.target.value,localStorage.setItem("speed",String(this.speed)),this.worker.postMessage({type:"SET_SPEED",value:this.speed}),this.postSpeed(this.speed)}}
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
`}});exports.wickedTec1=o;
},{"lit-html":"KMqM","../util":"WLd9","../assets/TEC-1.jpg":"QWBP","../util/audio":"P4dJ","./../worker/worker.js":[["worker.679e6af4.js","nnuQ"],"worker.b53bffb2.map","nnuQ"],"_bundle_loader":"z1Am","../roms/MON-1A":[["src.ce42d022.js","H99C"],"src.eafb33be.map",["TEC-1.c2019513.jpg","QWBP"],"ZoHI"],"../roms/MON-1B":[["MON-1B.df7c737a.js","/15E"],"MON-1B.df7c737a.map","/15E"],"../roms/MON-2":[["MON-2.833df39e.js","8zL2"],"MON-2.833df39e.map","8zL2"],"../roms/MON-1":[["MON-1.69b81ee1.js","hmvP"],"MON-1.69b81ee1.map","hmvP"]}],"6Rl6":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sevenSegDisplay=void 0;var e=require("lit-html"),s=require("../util");const i=(0,s.withProps)({init(e){this.display0=Array(6).fill(0),this.display=[...this.display0],this.blanks=0},get observedProperties(){return["digits","segments","display"]},render:({digits:s,segments:i,display:t})=>e.html`
<div style="white-space: nowrap;">${t.map((s,i)=>e.html`
<span is="seven-seg" style=${1==i?"margin-left:2.2%":""} .segments=${s}>
</div>`)}</span>
`});exports.sevenSegDisplay=i;
},{"lit-html":"KMqM","../util":"WLd9"}],"Y3is":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sevenSeg=void 0;var i=require("lit-html"),e=require("../util");const l=(i,e)=>i&e?"red":"#320000",o=(0,e.withProps)({get observedProperties(){return["segments"]},render:({segments:e})=>i.html`
            <div style="display:inline-block;width:4.34%;margin-left:1.6%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 12 20">
                    <g class="digit">
                        <polygon id="a" fill=${l(e,1)} points=" 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2" />
                        <polygon id="b" fill=${l(e,8)} points=" 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2" />
                        <polygon id="c" fill=${l(e,32)} points=" 9, 9 10,10 10,16  9,17  8,16  8,10" />
                        <polygon id="d" fill=${l(e,128)} points=" 9,17  8,18  2,18  1,17  2,16  8,16" />
                        <polygon id="e" fill=${l(e,64)} points=" 1,17  0,16  0,10  1, 9  2,10  2,16" />
                        <polygon id="f" fill=${l(e,2)} points=" 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8" />
                        <polygon id="g" fill=${l(e,4)} points=" 1, 9  2, 8  8, 8  9, 9  8,10  2,10" />
                        <circle fill=${l(e,16)} cx="11" cy="17" r="1" />
                    </g>
                </svg>
            </div>
        `});exports.sevenSeg=o;
},{"lit-html":"KMqM","../util":"WLd9"}],"K4QV":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.instructions=void 0;var t=require("lit-html"),d=require("../util");const e=(0,d.withProps)({render:({segments:d})=>t.html`
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
`});exports.instructions=e;
},{"lit-html":"KMqM","../util":"WLd9"}],"MzdT":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.keyButton=void 0;var e=require("lit-html"),t=require("../util");const r=(0,t.withProps)({get observedProperties(){return["text","color","left","top"]},render({text:t,color:r,left:o,top:l}){return this.element.style=`background-color:${r};left:${o}px;top:${l}px`,e.html`
            ${t}
        `}});exports.keyButton=r;
},{"lit-html":"KMqM","../util":"WLd9"}],"NlCz":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.keyPadClassic=void 0;var t=require("lit-html"),e=require("../util");const i=(0,e.withProps)({handleButton(t){const e=new CustomEvent("click",{detail:{code:t}});this.element.dispatchEvent(e)},render(){return t.html`
<div is="key-button" .text=${"AD"} .color=${"#cd3d45"} .left=${438} .top=${239} @click=${()=>this.handleButton("Tab")}></div>
<div is="key-button" .text=${"3"} .color=${"#efedeb"} .left=${468} .top=${239} @click=${()=>this.handleButton("Digit3")}></div>
<div is="key-button" .text=${"7"}  .color=${"#efedeb"} .left=${500} .top=${239} @click=${()=>this.handleButton("Digit7")}></div>
<div is="key-button" .text=${"B"} .color=${"#efedeb"} .left=${531} .top=${239} @click=${()=>this.handleButton("KeyB")}></div>
<div is="key-button" .text=${"F"} .color=${"#efedeb"} .left=${562} .top=${239} @click=${()=>this.handleButton("KeyF")}></div>

<div is="key-button" .text=${"GO"} .color=${"#cd3d45"} .left=${438} .top=${270} @click=${()=>this.handleButton("Enter")}></div>
<div is="key-button" .text=${"2"} .color=${"#efedeb"} .left=${468} .top=${270} @click=${()=>this.handleButton("Digit2")}></div>
<div is="key-button" .text=${"6"} .color=${"#efedeb"} .left=${500} .top=${270} @click=${()=>this.handleButton("Digit6")}></div>
<div is="key-button" .text=${"A"} .color=${"#efedeb"} .left=${531} .top=${270} @click=${()=>this.handleButton("KeyA")}></div>
<div is="key-button" .text=${"E"} .color=${"#efedeb"} .left=${562} .top=${270} @click=${()=>this.handleButton("KeyE")}></div>

<div is="key-button" .text=${"-"}  .color=${"#cd3d45"} .left=${438} .top=${301} @click=${()=>this.handleButton("ArrowDown")}></div>
<div is="key-button" .text=${"1"} .color=${"#efedeb"} .left=${468} .top=${301} @click=${()=>this.handleButton("Digit1")}></div>
<div is="key-button" .text=${"5"} .color=${"#efedeb"} .left=${500} .top=${301} @click=${()=>this.handleButton("Digit5")}></div>
<div is="key-button" .text=${"9"} .color=${"#efedeb"} .left=${531} .top=${301} @click=${()=>this.handleButton("Digit9")}></div>
<div is="key-button" .text=${"D"} .color=${"#efedeb"} .left=${562} .top=${301} @click=${()=>this.handleButton("KeyD")}></div>

<div is="key-button" .text=${"+"}  .color=${"#cd3d45"} .left=${438} .top=${331} @click=${()=>this.handleButton("ArrowUp")}></div>
<div is="key-button" .text=${"0"} .color=${"#efedeb"} .left=${468} .top=${331} @click=${()=>this.handleButton("Digit0")}></div>
<div is="key-button" .text=${"4"} .color=${"#efedeb"} .left=${500} .top=${332} @click=${()=>this.handleButton("Digit4")}></div>
<div is="key-button" .text=${"8"} .color=${"#efedeb"} .left=${531} .top=${332} @click=${()=>this.handleButton("Digit8")}></div>
<div is="key-button" .text=${"C"} .color=${"#efedeb"} .left=${562} .top=${332} @click=${()=>this.handleButton("KeyC")}></div>
        `}});exports.keyPadClassic=i;
},{"lit-html":"KMqM","../util":"WLd9"}],"Lu1m":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.keyPadModern=void 0;var t=require("lit-html"),e=require("../util");const i=(0,e.withProps)({handleButton(t){const e=new CustomEvent("click",{detail:{code:t}});this.element.dispatchEvent(e)},render(){return t.html`
<div is="key-button" .text=${"AD"} .color=${"#cd3d45"} .left=${438} .top=${239} @click=${()=>this.handleButton("Tab")}></div>
<div is="key-button" .text=${"C"} .color=${"#efedeb"} .left=${468} .top=${239} @click=${()=>this.handleButton("KeyC")}></div>
<div is="key-button" .text=${"D"}  .color=${"#efedeb"} .left=${500} .top=${239} @click=${()=>this.handleButton("KeyD")}></div>
<div is="key-button" .text=${"E"} .color=${"#efedeb"} .left=${531} .top=${239} @click=${()=>this.handleButton("KeyE")}></div>
<div is="key-button" .text=${"F"} .color=${"#efedeb"} .left=${562} .top=${239} @click=${()=>this.handleButton("KeyF")}></div>

<div is="key-button" .text=${"GO"} .color=${"#cd3d45"} .left=${438} .top=${270} @click=${()=>this.handleButton("Enter")}></div>
<div is="key-button" .text=${"8"} .color=${"#efedeb"} .left=${468} .top=${270} @click=${()=>this.handleButton("Digit8")}></div>
<div is="key-button" .text=${"9"} .color=${"#efedeb"} .left=${500} .top=${270} @click=${()=>this.handleButton("Digit9")}></div>
<div is="key-button" .text=${"A"} .color=${"#efedeb"} .left=${531} .top=${270} @click=${()=>this.handleButton("KeyA")}></div>
<div is="key-button" .text=${"B"} .color=${"#efedeb"} .left=${562} .top=${270} @click=${()=>this.handleButton("KeyB")}></div>

<div is="key-button" .text=${"+"}  .color=${"#cd3d45"} .left=${438} .top=${301} @click=${()=>this.handleButton("ArrowUp")}></div>
<div is="key-button" .text=${"4"} .color=${"#efedeb"} .left=${468} .top=${301} @click=${()=>this.handleButton("Digit4")}></div>
<div is="key-button" .text=${"5"} .color=${"#efedeb"} .left=${500} .top=${301} @click=${()=>this.handleButton("Digit5")}></div>
<div is="key-button" .text=${"6"} .color=${"#efedeb"} .left=${531} .top=${301} @click=${()=>this.handleButton("Digit6")}></div>
<div is="key-button" .text=${"7"} .color=${"#efedeb"} .left=${562} .top=${301} @click=${()=>this.handleButton("Digit7")}></div>

<div is="key-button" .text=${"-"}  .color=${"#cd3d45"} .left=${438} .top=${331} @click=${()=>this.handleButton("ArrowDown")}></div>
<div is="key-button" .text=${"0"} .color=${"#efedeb"} .left=${468} .top=${331} @click=${()=>this.handleButton("Digit0")}></div>
<div is="key-button" .text=${"1"} .color=${"#efedeb"} .left=${500} .top=${332} @click=${()=>this.handleButton("Digit1")}></div>
<div is="key-button" .text=${"2"} .color=${"#efedeb"} .left=${531} .top=${332} @click=${()=>this.handleButton("Digit2")}></div>
<div is="key-button" .text=${"3"} .color=${"#efedeb"} .left=${562} .top=${332} @click=${()=>this.handleButton("Digit3")}></div>
        `}});exports.keyPadModern=i;
},{"lit-html":"KMqM","../util":"WLd9"}],"vZyd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initApp=c;var e=u(require("wicked-elements")),n=require("./components/wicked-tec1"),s=require("./components/seven-seg-display"),i=require("./components/seven-seg"),t=require("./components/instructions"),d=require("./components/key-button"),o=require("./components/keypad-classic"),r=require("./components/keypad-modern");function u(e){return e&&e.__esModule?e:{default:e}}function c(){e.default.define('[is="wicked-tec1"]',n.wickedTec1),e.default.define('[is="seven-seg-display"]',s.sevenSegDisplay),e.default.define('[is="seven-seg"]',i.sevenSeg),e.default.define('[is="instructions"]',t.instructions),e.default.define('[is="key-button"]',d.keyButton),e.default.define('[is="keypad-classic"]',o.keyPadClassic),e.default.define('[is="keypad-modern"]',r.keyPadModern)}
},{"wicked-elements":"8+Lu","./components/wicked-tec1":"tH/w","./components/seven-seg-display":"6Rl6","./components/seven-seg":"Y3is","./components/instructions":"K4QV","./components/key-button":"MzdT","./components/keypad-classic":"NlCz","./components/keypad-modern":"Lu1m"}],"H99C":[function(require,module,exports) {
"use strict";var i=require("./app");(0,i.initApp)();
},{"./app":"vZyd"}],"Ijyk":[function(require,module,exports) {
module.exports=function(n){return new Promise(function(e,o){var r=document.createElement("script");r.async=!0,r.type="text/javascript",r.charset="utf-8",r.src=n,r.onerror=function(n){r.onerror=r.onload=null,o(n)},r.onload=function(){r.onerror=r.onload=null,e()},document.getElementsByTagName("head")[0].appendChild(r)})};
},{}],0:[function(require,module,exports) {
var b=require("z1Am");b.register("js",require("Ijyk"));
},{}]},{},[0,"H99C"], null)
//# sourceMappingURL=src.eafb33be.map