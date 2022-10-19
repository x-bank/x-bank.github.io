/*! For license information please see 850.0d96b92c.chunk.js.LICENSE.txt */
(self.webpackChunkXBank=self.webpackChunkXBank||[]).push([[850],{2009:function(e,t){"use strict";t.byteLength=function(e){var t=a(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,i=a(e),s=i[0],u=i[1],f=new o(function(e,t,r){return 3*(t+r)/4-r}(0,s,u)),l=0,c=u>0?s-4:s;for(r=0;r<c;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],f[l++]=t>>16&255,f[l++]=t>>8&255,f[l++]=255&t;2===u&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,f[l++]=255&t);1===u&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,f[l++]=t>>8&255,f[l++]=255&t);return f},t.fromByteArray=function(e){for(var t,n=e.length,o=n%3,i=[],s=16383,u=0,a=n-o;u<a;u+=s)i.push(f(e,u,u+s>a?a:u+s));1===o?(t=e[n-1],i.push(r[t>>2]+r[t<<4&63]+"==")):2===o&&(t=(e[n-2]<<8)+e[n-1],i.push(r[t>>10]+r[t>>4&63]+r[t<<2&63]+"="));return i.join("")};for(var r=[],n=[],o="undefined"!==typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,u=i.length;s<u;++s)r[s]=i[s],n[i.charCodeAt(s)]=s;function a(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function f(e,t,n){for(var o,i,s=[],u=t;u<n;u+=3)o=(e[u]<<16&16711680)+(e[u+1]<<8&65280)+(255&e[u+2]),s.push(r[(i=o)>>18&63]+r[i>>12&63]+r[i>>6&63]+r[63&i]);return s.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},7465:function(e){"use strict";var t,r="object"===typeof Reflect?Reflect:null,n=r&&"function"===typeof r.apply?r.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)};t=r&&"function"===typeof r.ownKeys?r.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var o=Number.isNaN||function(e){return e!==e};function i(){i.init.call(this)}e.exports=i,e.exports.once=function(e,t){return new Promise((function(r,n){function o(r){e.removeListener(t,i),n(r)}function i(){"function"===typeof e.removeListener&&e.removeListener("error",o),r([].slice.call(arguments))}d(e,t,i,{once:!0}),"error"!==t&&function(e,t,r){"function"===typeof e.on&&d(e,"error",t,r)}(e,o,{once:!0})}))},i.EventEmitter=i,i.prototype._events=void 0,i.prototype._eventsCount=0,i.prototype._maxListeners=void 0;var s=10;function u(e){if("function"!==typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function a(e){return void 0===e._maxListeners?i.defaultMaxListeners:e._maxListeners}function f(e,t,r,n){var o,i,s,f;if(u(r),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,r.listener?r.listener:r),i=e._events),s=i[t]),void 0===s)s=i[t]=r,++e._eventsCount;else if("function"===typeof s?s=i[t]=n?[r,s]:[s,r]:n?s.unshift(r):s.push(r),(o=a(e))>0&&s.length>o&&!s.warned){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=e,l.type=t,l.count=s.length,f=l,console&&console.warn&&console.warn(f)}return e}function l(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function c(e,t,r){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:r},o=l.bind(n);return o.listener=r,n.wrapFn=o,o}function p(e,t,r){var n=e._events;if(void 0===n)return[];var o=n[t];return void 0===o?[]:"function"===typeof o?r?[o.listener||o]:[o]:r?function(e){for(var t=new Array(e.length),r=0;r<t.length;++r)t[r]=e[r].listener||e[r];return t}(o):v(o,o.length)}function h(e){var t=this._events;if(void 0!==t){var r=t[e];if("function"===typeof r)return 1;if(void 0!==r)return r.length}return 0}function v(e,t){for(var r=new Array(t),n=0;n<t;++n)r[n]=e[n];return r}function d(e,t,r,n){if("function"===typeof e.on)n.once?e.once(t,r):e.on(t,r);else{if("function"!==typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function o(i){n.once&&e.removeEventListener(t,o),r(i)}))}}Object.defineProperty(i,"defaultMaxListeners",{enumerable:!0,get:function(){return s},set:function(e){if("number"!==typeof e||e<0||o(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");s=e}}),i.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},i.prototype.setMaxListeners=function(e){if("number"!==typeof e||e<0||o(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},i.prototype.getMaxListeners=function(){return a(this)},i.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var o="error"===e,i=this._events;if(void 0!==i)o=o&&void 0===i.error;else if(!o)return!1;if(o){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var u=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw u.context=s,u}var a=i[e];if(void 0===a)return!1;if("function"===typeof a)n(a,this,t);else{var f=a.length,l=v(a,f);for(r=0;r<f;++r)n(l[r],this,t)}return!0},i.prototype.addListener=function(e,t){return f(this,e,t,!1)},i.prototype.on=i.prototype.addListener,i.prototype.prependListener=function(e,t){return f(this,e,t,!0)},i.prototype.once=function(e,t){return u(t),this.on(e,c(this,e,t)),this},i.prototype.prependOnceListener=function(e,t){return u(t),this.prependListener(e,c(this,e,t)),this},i.prototype.removeListener=function(e,t){var r,n,o,i,s;if(u(t),void 0===(n=this._events))return this;if(void 0===(r=n[e]))return this;if(r===t||r.listener===t)0===--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,r.listener||t));else if("function"!==typeof r){for(o=-1,i=r.length-1;i>=0;i--)if(r[i]===t||r[i].listener===t){s=r[i].listener,o=i;break}if(o<0)return this;0===o?r.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,o),1===r.length&&(n[e]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",e,s||t)}return this},i.prototype.off=i.prototype.removeListener,i.prototype.removeAllListeners=function(e){var t,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[e]&&(0===--this._eventsCount?this._events=Object.create(null):delete r[e]),this;if(0===arguments.length){var o,i=Object.keys(r);for(n=0;n<i.length;++n)"removeListener"!==(o=i[n])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"===typeof(t=r[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},i.prototype.listeners=function(e){return p(this,e,!0)},i.prototype.rawListeners=function(e){return p(this,e,!1)},i.listenerCount=function(e,t){return"function"===typeof e.listenerCount?e.listenerCount(t):h.call(e,t)},i.prototype.listenerCount=h,i.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},4038:function(e,t){t.read=function(e,t,r,n,o){var i,s,u=8*o-n-1,a=(1<<u)-1,f=a>>1,l=-7,c=r?o-1:0,p=r?-1:1,h=e[t+c];for(c+=p,i=h&(1<<-l)-1,h>>=-l,l+=u;l>0;i=256*i+e[t+c],c+=p,l-=8);for(s=i&(1<<-l)-1,i>>=-l,l+=n;l>0;s=256*s+e[t+c],c+=p,l-=8);if(0===i)i=1-f;else{if(i===a)return s?NaN:1/0*(h?-1:1);s+=Math.pow(2,n),i-=f}return(h?-1:1)*s*Math.pow(2,i-n)},t.write=function(e,t,r,n,o,i){var s,u,a,f=8*i-o-1,l=(1<<f)-1,c=l>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=n?0:i-1,v=n?1:-1,d=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(u=isNaN(t)?1:0,s=l):(s=Math.floor(Math.log(t)/Math.LN2),t*(a=Math.pow(2,-s))<1&&(s--,a*=2),(t+=s+c>=1?p/a:p*Math.pow(2,1-c))*a>=2&&(s++,a/=2),s+c>=l?(u=0,s=l):s+c>=1?(u=(t*a-1)*Math.pow(2,o),s+=c):(u=t*Math.pow(2,c-1)*Math.pow(2,o),s=0));o>=8;e[r+h]=255&u,h+=v,u/=256,o-=8);for(s=s<<o|u,f+=o;f>0;e[r+h]=255&s,h+=v,s/=256,f-=8);e[r+h-v]|=128*d}},3897:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},5372:function(e){e.exports=function(e){if(Array.isArray(e))return e},e.exports.__esModule=!0,e.exports.default=e.exports},3405:function(e,t,r){var n=r(3897);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},4704:function(e,t,r){var n=r(6116);e.exports=function(e,t){var r="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=n(e))||t&&e&&"number"===typeof e.length){r&&(e=r);var o=0,i=function(){};return{s:i,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,u=!0,a=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){a=!0,s=e},f:function(){try{u||null==r.return||r.return()}finally{if(a)throw s}}}},e.exports.__esModule=!0,e.exports.default=e.exports},9498:function(e){e.exports=function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},8872:function(e){e.exports=function(e,t){var r=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i=[],s=!0,u=!1;try{for(r=r.call(e);!(s=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);s=!0);}catch(a){u=!0,o=a}finally{try{s||null==r.return||r.return()}finally{if(u)throw o}}return i}},e.exports.__esModule=!0,e.exports.default=e.exports},2218:function(e){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},2281:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},7424:function(e,t,r){var n=r(5372),o=r(8872),i=r(6116),s=r(2218);e.exports=function(e,t){return n(e)||o(e,t)||i(e,t)||s()},e.exports.__esModule=!0,e.exports.default=e.exports},861:function(e,t,r){var n=r(3405),o=r(9498),i=r(6116),s=r(2281);e.exports=function(e){return n(e)||o(e)||i(e)||s()},e.exports.__esModule=!0,e.exports.default=e.exports},6116:function(e,t,r){var n=r(3897);e.exports=function(e,t){if(e){if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=850.0d96b92c.chunk.js.map