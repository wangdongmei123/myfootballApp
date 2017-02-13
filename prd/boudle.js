/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			var item = this[i];
			if (item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * State-based routing for AngularJS
 * @version v0.3.2
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined" != typeof module && "undefined" != typeof exports && module.exports === exports && (module.exports = "ui.router"), function (a, b, c) {
  "use strict";
  function d(a, b) {
    return S(new (S(function () {}, { prototype: a }))(), b);
  }function e(a) {
    return R(arguments, function (b) {
      b !== a && R(b, function (b, c) {
        a.hasOwnProperty(c) || (a[c] = b);
      });
    }), a;
  }function f(a, b) {
    var c = [];for (var d in a.path) {
      if (a.path[d] !== b.path[d]) break;c.push(a.path[d]);
    }return c;
  }function g(a) {
    if (Object.keys) return Object.keys(a);var b = [];return R(a, function (a, c) {
      b.push(c);
    }), b;
  }function h(a, b) {
    if (Array.prototype.indexOf) return a.indexOf(b, Number(arguments[2]) || 0);var c = a.length >>> 0,
        d = Number(arguments[2]) || 0;for (d = d < 0 ? Math.ceil(d) : Math.floor(d), d < 0 && (d += c); d < c; d++) {
      if (d in a && a[d] === b) return d;
    }return -1;
  }function i(a, b, c, d) {
    var e,
        i = f(c, d),
        j = {},
        k = [];for (var l in i) {
      if (i[l] && i[l].params && (e = g(i[l].params), e.length)) for (var m in e) {
        h(k, e[m]) >= 0 || (k.push(e[m]), j[e[m]] = a[e[m]]);
      }
    }return S({}, j, b);
  }function j(a, b, c) {
    if (!c) {
      c = [];for (var d in a) {
        c.push(d);
      }
    }for (var e = 0; e < c.length; e++) {
      var f = c[e];if (a[f] != b[f]) return !1;
    }return !0;
  }function k(a, b) {
    var c = {};return R(a, function (a) {
      c[a] = b[a];
    }), c;
  }function l(a) {
    var b = {},
        c = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));return R(c, function (c) {
      c in a && (b[c] = a[c]);
    }), b;
  }function m(a) {
    var b = {},
        c = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));for (var d in a) {
      h(c, d) == -1 && (b[d] = a[d]);
    }return b;
  }function n(a, b) {
    var c = Q(a),
        d = c ? [] : {};return R(a, function (a, e) {
      b(a, e) && (d[c ? d.length : e] = a);
    }), d;
  }function o(a, b) {
    var c = Q(a) ? [] : {};return R(a, function (a, d) {
      c[d] = b(a, d);
    }), c;
  }function p(a) {
    return a.then(c, function () {}) && a;
  }function q(a, b) {
    var d = 1,
        f = 2,
        i = {},
        j = [],
        k = i,
        l = S(a.when(i), { $$promises: i, $$values: i });this.study = function (i) {
      function n(a, c) {
        if (s[c] !== f) {
          if (r.push(c), s[c] === d) throw r.splice(0, h(r, c)), new Error("Cyclic dependency: " + r.join(" -> "));if (s[c] = d, O(a)) q.push(c, [function () {
            return b.get(a);
          }], j);else {
            var e = b.annotate(a);R(e, function (a) {
              a !== c && i.hasOwnProperty(a) && n(i[a], a);
            }), q.push(c, a, e);
          }r.pop(), s[c] = f;
        }
      }function o(a) {
        return P(a) && a.then && a.$$promises;
      }if (!P(i)) throw new Error("'invocables' must be an object");var p = g(i || {}),
          q = [],
          r = [],
          s = {};return R(i, n), i = r = s = null, function (d, f, g) {
        function h() {
          --u || (v || e(t, f.$$values), r.$$values = t, r.$$promises = r.$$promises || !0, delete r.$$inheritedValues, n.resolve(t));
        }function i(a) {
          r.$$failure = a, n.reject(a);
        }function j(c, e, f) {
          function j(a) {
            l.reject(a), i(a);
          }function k() {
            if (!M(r.$$failure)) try {
              l.resolve(b.invoke(e, g, t)), l.promise.then(function (a) {
                t[c] = a, h();
              }, j);
            } catch (a) {
              j(a);
            }
          }var l = a.defer(),
              m = 0;R(f, function (a) {
            s.hasOwnProperty(a) && !d.hasOwnProperty(a) && (m++, s[a].then(function (b) {
              t[a] = b, --m || k();
            }, j));
          }), m || k(), s[c] = l.promise;
        }if (o(d) && g === c && (g = f, f = d, d = null), d) {
          if (!P(d)) throw new Error("'locals' must be an object");
        } else d = k;if (f) {
          if (!o(f)) throw new Error("'parent' must be a promise returned by $resolve.resolve()");
        } else f = l;var n = a.defer(),
            r = n.promise,
            s = r.$$promises = {},
            t = S({}, d),
            u = 1 + q.length / 3,
            v = !1;if (M(f.$$failure)) return i(f.$$failure), r;f.$$inheritedValues && e(t, m(f.$$inheritedValues, p)), S(s, f.$$promises), f.$$values ? (v = e(t, m(f.$$values, p)), r.$$inheritedValues = m(f.$$values, p), h()) : (f.$$inheritedValues && (r.$$inheritedValues = m(f.$$inheritedValues, p)), f.then(h, i));for (var w = 0, x = q.length; w < x; w += 3) {
          d.hasOwnProperty(q[w]) ? h() : j(q[w], q[w + 1], q[w + 2]);
        }return r;
      };
    }, this.resolve = function (a, b, c, d) {
      return this.study(a)(b, c, d);
    };
  }function r(a, b, c) {
    this.fromConfig = function (a, b, c) {
      return M(a.template) ? this.fromString(a.template, b) : M(a.templateUrl) ? this.fromUrl(a.templateUrl, b) : M(a.templateProvider) ? this.fromProvider(a.templateProvider, b, c) : null;
    }, this.fromString = function (a, b) {
      return N(a) ? a(b) : a;
    }, this.fromUrl = function (c, d) {
      return N(c) && (c = c(d)), null == c ? null : a.get(c, { cache: b, headers: { Accept: "text/html" } }).then(function (a) {
        return a.data;
      });
    }, this.fromProvider = function (a, b, d) {
      return c.invoke(a, null, d || { params: b });
    };
  }function s(a, b, e) {
    function f(b, c, d, e) {
      if (q.push(b), o[b]) return o[b];if (!/^\w+([-.]+\w+)*(?:\[\])?$/.test(b)) throw new Error("Invalid parameter name '" + b + "' in pattern '" + a + "'");if (p[b]) throw new Error("Duplicate parameter name '" + b + "' in pattern '" + a + "'");return p[b] = new V.Param(b, c, d, e), p[b];
    }function g(a, b, c, d) {
      var e = ["", ""],
          f = a.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");if (!b) return f;switch (c) {case !1:
          e = ["(", ")" + (d ? "?" : "")];break;case !0:
          f = f.replace(/\/$/, ""), e = ["(?:/(", ")|/)?"];break;default:
          e = ["(" + c + "|", ")?"];}return f + e[0] + b + e[1];
    }function h(e, f) {
      var g, h, i, j, k;return g = e[2] || e[3], k = b.params[g], i = a.substring(m, e.index), h = f ? e[4] : e[4] || ("*" == e[1] ? ".*" : null), h && (j = V.type(h) || d(V.type("string"), { pattern: new RegExp(h, b.caseInsensitive ? "i" : c) })), { id: g, regexp: h, segment: i, type: j, cfg: k };
    }b = S({ params: {} }, P(b) ? b : {});var i,
        j = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
        k = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
        l = "^",
        m = 0,
        n = this.segments = [],
        o = e ? e.params : {},
        p = this.params = e ? e.params.$$new() : new V.ParamSet(),
        q = [];this.source = a;for (var r, s, t; (i = j.exec(a)) && (r = h(i, !1), !(r.segment.indexOf("?") >= 0));) {
      s = f(r.id, r.type, r.cfg, "path"), l += g(r.segment, s.type.pattern.source, s.squash, s.isOptional), n.push(r.segment), m = j.lastIndex;
    }t = a.substring(m);var u = t.indexOf("?");if (u >= 0) {
      var v = this.sourceSearch = t.substring(u);if (t = t.substring(0, u), this.sourcePath = a.substring(0, m + u), v.length > 0) for (m = 0; i = k.exec(v);) {
        r = h(i, !0), s = f(r.id, r.type, r.cfg, "search"), m = j.lastIndex;
      }
    } else this.sourcePath = a, this.sourceSearch = "";l += g(t) + (b.strict === !1 ? "/?" : "") + "$", n.push(t), this.regexp = new RegExp(l, b.caseInsensitive ? "i" : c), this.prefix = n[0], this.$$paramNames = q;
  }function t(a) {
    S(this, a);
  }function u() {
    function a(a) {
      return null != a ? a.toString().replace(/(~|\/)/g, function (a) {
        return { "~": "~~", "/": "~2F" }[a];
      }) : a;
    }function e(a) {
      return null != a ? a.toString().replace(/(~~|~2F)/g, function (a) {
        return { "~~": "~", "~2F": "/" }[a];
      }) : a;
    }function f() {
      return { strict: p, caseInsensitive: m };
    }function i(a) {
      return N(a) || Q(a) && N(a[a.length - 1]);
    }function j() {
      for (; w.length;) {
        var a = w.shift();if (a.pattern) throw new Error("You cannot override a type's .pattern at runtime.");b.extend(r[a.name], l.invoke(a.def));
      }
    }function k(a) {
      S(this, a || {});
    }V = this;var l,
        m = !1,
        p = !0,
        q = !1,
        r = {},
        v = !0,
        w = [],
        x = { string: { encode: a, decode: e, is: function is(a) {
          return null == a || !M(a) || "string" == typeof a;
        }, pattern: /[^\/]*/ }, int: { encode: a, decode: function decode(a) {
          return parseInt(a, 10);
        }, is: function is(a) {
          return M(a) && this.decode(a.toString()) === a;
        }, pattern: /\d+/ }, bool: { encode: function encode(a) {
          return a ? 1 : 0;
        }, decode: function decode(a) {
          return 0 !== parseInt(a, 10);
        }, is: function is(a) {
          return a === !0 || a === !1;
        }, pattern: /0|1/ }, date: { encode: function encode(a) {
          return this.is(a) ? [a.getFullYear(), ("0" + (a.getMonth() + 1)).slice(-2), ("0" + a.getDate()).slice(-2)].join("-") : c;
        }, decode: function decode(a) {
          if (this.is(a)) return a;var b = this.capture.exec(a);return b ? new Date(b[1], b[2] - 1, b[3]) : c;
        }, is: function is(a) {
          return a instanceof Date && !isNaN(a.valueOf());
        }, equals: function equals(a, b) {
          return this.is(a) && this.is(b) && a.toISOString() === b.toISOString();
        }, pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/, capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/ }, json: { encode: b.toJson, decode: b.fromJson, is: b.isObject, equals: b.equals, pattern: /[^\/]*/ }, any: { encode: b.identity, decode: b.identity, equals: b.equals, pattern: /.*/ } };u.$$getDefaultValue = function (a) {
      if (!i(a.value)) return a.value;if (!l) throw new Error("Injectable functions cannot be called at configuration time");return l.invoke(a.value);
    }, this.caseInsensitive = function (a) {
      return M(a) && (m = a), m;
    }, this.strictMode = function (a) {
      return M(a) && (p = a), p;
    }, this.defaultSquashPolicy = function (a) {
      if (!M(a)) return q;if (a !== !0 && a !== !1 && !O(a)) throw new Error("Invalid squash policy: " + a + ". Valid policies: false, true, arbitrary-string");return q = a, a;
    }, this.compile = function (a, b) {
      return new s(a, S(f(), b));
    }, this.isMatcher = function (a) {
      if (!P(a)) return !1;var b = !0;return R(s.prototype, function (c, d) {
        N(c) && (b = b && M(a[d]) && N(a[d]));
      }), b;
    }, this.type = function (a, b, c) {
      if (!M(b)) return r[a];if (r.hasOwnProperty(a)) throw new Error("A type named '" + a + "' has already been defined.");return r[a] = new t(S({ name: a }, b)), c && (w.push({ name: a, def: c }), v || j()), this;
    }, R(x, function (a, b) {
      r[b] = new t(S({ name: b }, a));
    }), r = d(r, {}), this.$get = ["$injector", function (a) {
      return l = a, v = !1, j(), R(x, function (a, b) {
        r[b] || (r[b] = new t(a));
      }), this;
    }], this.Param = function (a, d, e, f) {
      function j(a) {
        var b = P(a) ? g(a) : [],
            c = h(b, "value") === -1 && h(b, "type") === -1 && h(b, "squash") === -1 && h(b, "array") === -1;return c && (a = { value: a }), a.$$fn = i(a.value) ? a.value : function () {
          return a.value;
        }, a;
      }function k(c, d, e) {
        if (c.type && d) throw new Error("Param '" + a + "' has two type configurations.");return d ? d : c.type ? b.isString(c.type) ? r[c.type] : c.type instanceof t ? c.type : new t(c.type) : "config" === e ? r.any : r.string;
      }function m() {
        var b = { array: "search" === f && "auto" },
            c = a.match(/\[\]$/) ? { array: !0 } : {};return S(b, c, e).array;
      }function p(a, b) {
        var c = a.squash;if (!b || c === !1) return !1;if (!M(c) || null == c) return q;if (c === !0 || O(c)) return c;throw new Error("Invalid squash policy: '" + c + "'. Valid policies: false, true, or arbitrary string");
      }function s(a, b, d, e) {
        var f,
            g,
            i = [{ from: "", to: d || b ? c : "" }, { from: null, to: d || b ? c : "" }];return f = Q(a.replace) ? a.replace : [], O(e) && f.push({ from: e, to: c }), g = o(f, function (a) {
          return a.from;
        }), n(i, function (a) {
          return h(g, a.from) === -1;
        }).concat(f);
      }function u() {
        if (!l) throw new Error("Injectable functions cannot be called at configuration time");var a = l.invoke(e.$$fn);if (null !== a && a !== c && !x.type.is(a)) throw new Error("Default value (" + a + ") for parameter '" + x.id + "' is not an instance of Type (" + x.type.name + ")");return a;
      }function v(a) {
        function b(a) {
          return function (b) {
            return b.from === a;
          };
        }function c(a) {
          var c = o(n(x.replace, b(a)), function (a) {
            return a.to;
          });return c.length ? c[0] : a;
        }return a = c(a), M(a) ? x.type.$normalize(a) : u();
      }function w() {
        return "{Param:" + a + " " + d + " squash: '" + A + "' optional: " + z + "}";
      }var x = this;e = j(e), d = k(e, d, f);var y = m();d = y ? d.$asArray(y, "search" === f) : d, "string" !== d.name || y || "path" !== f || e.value !== c || (e.value = "");var z = e.value !== c,
          A = p(e, z),
          B = s(e, y, z, A);S(this, { id: a, type: d, location: f, array: y, squash: A, replace: B, isOptional: z, value: v, dynamic: c, config: e, toString: w });
    }, k.prototype = { $$new: function $$new() {
        return d(this, S(new k(), { $$parent: this }));
      }, $$keys: function $$keys() {
        for (var a = [], b = [], c = this, d = g(k.prototype); c;) {
          b.push(c), c = c.$$parent;
        }return b.reverse(), R(b, function (b) {
          R(g(b), function (b) {
            h(a, b) === -1 && h(d, b) === -1 && a.push(b);
          });
        }), a;
      }, $$values: function $$values(a) {
        var b = {},
            c = this;return R(c.$$keys(), function (d) {
          b[d] = c[d].value(a && a[d]);
        }), b;
      }, $$equals: function $$equals(a, b) {
        var c = !0,
            d = this;return R(d.$$keys(), function (e) {
          var f = a && a[e],
              g = b && b[e];d[e].type.equals(f, g) || (c = !1);
        }), c;
      }, $$validates: function $$validates(a) {
        var d,
            e,
            f,
            g,
            h,
            i = this.$$keys();for (d = 0; d < i.length && (e = this[i[d]], f = a[i[d]], f !== c && null !== f || !e.isOptional); d++) {
          if (g = e.type.$normalize(f), !e.type.is(g)) return !1;if (h = e.type.encode(g), b.isString(h) && !e.type.pattern.exec(h)) return !1;
        }return !0;
      }, $$parent: c }, this.ParamSet = k;
  }function v(a, d) {
    function e(a) {
      var b = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null != b ? b[1].replace(/\\(.)/g, "$1") : "";
    }function f(a, b) {
      return a.replace(/\$(\$|\d{1,2})/, function (a, c) {
        return b["$" === c ? 0 : Number(c)];
      });
    }function g(a, b, c) {
      if (!c) return !1;var d = a.invoke(b, b, { $match: c });return !M(d) || d;
    }function h(d, e, f, g, h) {
      function m(a, b, c) {
        return "/" === q ? a : b ? q.slice(0, -1) + a : c ? q.slice(1) + a : a;
      }function n(a) {
        function b(a) {
          var b = a(f, d);return !!b && (O(b) && d.replace().url(b), !0);
        }if (!a || !a.defaultPrevented) {
          p && d.url() === p;p = c;var e,
              g = j.length;for (e = 0; e < g; e++) {
            if (b(j[e])) return;
          }k && b(k);
        }
      }function o() {
        return i = i || e.$on("$locationChangeSuccess", n);
      }var p,
          q = g.baseHref(),
          r = d.url();return l || o(), { sync: function sync() {
          n();
        }, listen: function listen() {
          return o();
        }, update: function update(a) {
          return a ? void (r = d.url()) : void (d.url() !== r && (d.url(r), d.replace()));
        }, push: function push(a, b, e) {
          var f = a.format(b || {});null !== f && b && b["#"] && (f += "#" + b["#"]), d.url(f), p = e && e.$$avoidResync ? d.url() : c, e && e.replace && d.replace();
        }, href: function href(c, e, f) {
          if (!c.validates(e)) return null;var g = a.html5Mode();b.isObject(g) && (g = g.enabled), g = g && h.history;var i = c.format(e);if (f = f || {}, g || null === i || (i = "#" + a.hashPrefix() + i), null !== i && e && e["#"] && (i += "#" + e["#"]), i = m(i, g, f.absolute), !f.absolute || !i) return i;var j = !g && i ? "/" : "",
              k = d.port();return k = 80 === k || 443 === k ? "" : ":" + k, [d.protocol(), "://", d.host(), k, j, i].join("");
        } };
    }var i,
        j = [],
        k = null,
        l = !1;this.rule = function (a) {
      if (!N(a)) throw new Error("'rule' must be a function");return j.push(a), this;
    }, this.otherwise = function (a) {
      if (O(a)) {
        var b = a;a = function a() {
          return b;
        };
      } else if (!N(a)) throw new Error("'rule' must be a function");return k = a, this;
    }, this.when = function (a, b) {
      var c,
          h = O(b);if (O(a) && (a = d.compile(a)), !h && !N(b) && !Q(b)) throw new Error("invalid 'handler' in when()");var i = { matcher: function matcher(a, b) {
          return h && (c = d.compile(b), b = ["$match", function (a) {
            return c.format(a);
          }]), S(function (c, d) {
            return g(c, b, a.exec(d.path(), d.search()));
          }, { prefix: O(a.prefix) ? a.prefix : "" });
        }, regex: function regex(a, b) {
          if (a.global || a.sticky) throw new Error("when() RegExp must not be global or sticky");return h && (c = b, b = ["$match", function (a) {
            return f(c, a);
          }]), S(function (c, d) {
            return g(c, b, a.exec(d.path()));
          }, { prefix: e(a) });
        } },
          j = { matcher: d.isMatcher(a), regex: a instanceof RegExp };for (var k in j) {
        if (j[k]) return this.rule(i[k](a, b));
      }throw new Error("invalid 'what' in when()");
    }, this.deferIntercept = function (a) {
      a === c && (a = !0), l = a;
    }, this.$get = h, h.$inject = ["$location", "$rootScope", "$injector", "$browser", "$sniffer"];
  }function w(a, e) {
    function f(a) {
      return 0 === a.indexOf(".") || 0 === a.indexOf("^");
    }function m(a, b) {
      if (!a) return c;var d = O(a),
          e = d ? a : a.name,
          g = f(e);if (g) {
        if (!b) throw new Error("No reference point given for path '" + e + "'");b = m(b);for (var h = e.split("."), i = 0, j = h.length, k = b; i < j; i++) {
          if ("" !== h[i] || 0 !== i) {
            if ("^" !== h[i]) break;if (!k.parent) throw new Error("Path '" + e + "' not valid for state '" + b.name + "'");k = k.parent;
          } else k = b;
        }h = h.slice(i).join("."), e = k.name + (k.name && h ? "." : "") + h;
      }var l = A[e];return !l || !d && (d || l !== a && l.self !== a) ? c : l;
    }function n(a, b) {
      B[a] || (B[a] = []), B[a].push(b);
    }function q(a) {
      for (var b = B[a] || []; b.length;) {
        r(b.shift());
      }
    }function r(b) {
      b = d(b, { self: b, resolve: b.resolve || {}, toString: function toString() {
          return this.name;
        } });var c = b.name;if (!O(c) || c.indexOf("@") >= 0) throw new Error("State must have a valid name");if (A.hasOwnProperty(c)) throw new Error("State '" + c + "' is already defined");var e = c.indexOf(".") !== -1 ? c.substring(0, c.lastIndexOf(".")) : O(b.parent) ? b.parent : P(b.parent) && O(b.parent.name) ? b.parent.name : "";if (e && !A[e]) return n(e, b.self);for (var f in D) {
        N(D[f]) && (b[f] = D[f](b, D.$delegates[f]));
      }return A[c] = b, !b[C] && b.url && a.when(b.url, ["$match", "$stateParams", function (a, c) {
        z.$current.navigable == b && j(a, c) || z.transitionTo(b, a, { inherit: !0, location: !1 });
      }]), q(c), b;
    }function s(a) {
      return a.indexOf("*") > -1;
    }function t(a) {
      for (var b = a.split("."), c = z.$current.name.split("."), d = 0, e = b.length; d < e; d++) {
        "*" === b[d] && (c[d] = "*");
      }return "**" === b[0] && (c = c.slice(h(c, b[1])), c.unshift("**")), "**" === b[b.length - 1] && (c.splice(h(c, b[b.length - 2]) + 1, Number.MAX_VALUE), c.push("**")), b.length == c.length && c.join("") === b.join("");
    }function u(a, b) {
      return O(a) && !M(b) ? D[a] : N(b) && O(a) ? (D[a] && !D.$delegates[a] && (D.$delegates[a] = D[a]), D[a] = b, this) : this;
    }function v(a, b) {
      return P(a) ? b = a : b.name = a, r(b), this;
    }function w(a, e, f, h, l, n, q, r, u) {
      function v(b, c, d, f) {
        var g = a.$broadcast("$stateNotFound", b, c, d);if (g.defaultPrevented) return q.update(), F;if (!g.retry) return null;if (f.$retry) return q.update(), G;var h = z.transition = e.when(g.retry);return h.then(function () {
          return h !== z.transition ? (a.$broadcast("$stateChangeCancel", b.to, b.toParams, c, d), D) : (b.options.$retry = !0, z.transitionTo(b.to, b.toParams, b.options));
        }, function () {
          return F;
        }), q.update(), h;
      }function w(a, c, d, g, i, j) {
        function m() {
          var c = [];return R(a.views, function (d, e) {
            var g = d.resolve && d.resolve !== a.resolve ? d.resolve : {};g.$template = [function () {
              return f.load(e, { view: d, locals: i.globals, params: n, notify: j.notify }) || "";
            }], c.push(l.resolve(g, i.globals, i.resolve, a).then(function (c) {
              if (N(d.controllerProvider) || Q(d.controllerProvider)) {
                var f = b.extend({}, g, i.globals);c.$$controller = h.invoke(d.controllerProvider, null, f);
              } else c.$$controller = d.controller;c.$$state = a, c.$$controllerAs = d.controllerAs, c.$$resolveAs = d.resolveAs, i[e] = c;
            }));
          }), e.all(c).then(function () {
            return i.globals;
          });
        }var n = d ? c : k(a.params.$$keys(), c),
            o = { $stateParams: n };i.resolve = l.resolve(a.resolve, o, i.resolve, a);var p = [i.resolve.then(function (a) {
          i.globals = a;
        })];return g && p.push(g), e.all(p).then(m).then(function (a) {
          return i;
        });
      }var B = new Error("transition superseded"),
          D = p(e.reject(B)),
          E = p(e.reject(new Error("transition prevented"))),
          F = p(e.reject(new Error("transition aborted"))),
          G = p(e.reject(new Error("transition failed")));return y.locals = { resolve: null, globals: { $stateParams: {} } }, z = { params: {}, current: y.self, $current: y, transition: null }, z.reload = function (a) {
        return z.transitionTo(z.current, n, { reload: a || !0, inherit: !1, notify: !0 });
      }, z.go = function (a, b, c) {
        return z.transitionTo(a, b, S({ inherit: !0, relative: z.$current }, c));
      }, z.transitionTo = function (b, c, f) {
        c = c || {}, f = S({ location: !0, inherit: !1, relative: null, notify: !0, reload: !1, $retry: !1 }, f || {});var g,
            j = z.$current,
            l = z.params,
            o = j.path,
            p = m(b, f.relative),
            r = c["#"];if (!M(p)) {
          var s = { to: b, toParams: c, options: f },
              t = v(s, j.self, l, f);if (t) return t;if (b = s.to, c = s.toParams, f = s.options, p = m(b, f.relative), !M(p)) {
            if (!f.relative) throw new Error("No such state '" + b + "'");throw new Error("Could not resolve '" + b + "' from state '" + f.relative + "'");
          }
        }if (p[C]) throw new Error("Cannot transition to abstract state '" + b + "'");if (f.inherit && (c = i(n, c || {}, z.$current, p)), !p.params.$$validates(c)) return G;c = p.params.$$values(c), b = p;var u = b.path,
            A = 0,
            F = u[A],
            H = y.locals,
            I = [];if (f.reload) {
          if (O(f.reload) || P(f.reload)) {
            if (P(f.reload) && !f.reload.name) throw new Error("Invalid reload state object");var J = f.reload === !0 ? o[0] : m(f.reload);if (f.reload && !J) throw new Error("No such reload state '" + (O(f.reload) ? f.reload : f.reload.name) + "'");for (; F && F === o[A] && F !== J;) {
              H = I[A] = F.locals, A++, F = u[A];
            }
          }
        } else for (; F && F === o[A] && F.ownParams.$$equals(c, l);) {
          H = I[A] = F.locals, A++, F = u[A];
        }if (x(b, c, j, l, H, f)) return r && (c["#"] = r), z.params = c, T(z.params, n), T(k(b.params.$$keys(), n), b.locals.globals.$stateParams), f.location && b.navigable && b.navigable.url && (q.push(b.navigable.url, c, { $$avoidResync: !0, replace: "replace" === f.location }), q.update(!0)), z.transition = null, e.when(z.current);if (c = k(b.params.$$keys(), c || {}), r && (c["#"] = r), f.notify && a.$broadcast("$stateChangeStart", b.self, c, j.self, l, f).defaultPrevented) return a.$broadcast("$stateChangeCancel", b.self, c, j.self, l), null == z.transition && q.update(), E;for (var K = e.when(H), L = A; L < u.length; L++, F = u[L]) {
          H = I[L] = d(H), K = w(F, c, F === b, K, H, f);
        }var N = z.transition = K.then(function () {
          var d, e, g;if (z.transition !== N) return a.$broadcast("$stateChangeCancel", b.self, c, j.self, l), D;for (d = o.length - 1; d >= A; d--) {
            g = o[d], g.self.onExit && h.invoke(g.self.onExit, g.self, g.locals.globals), g.locals = null;
          }for (d = A; d < u.length; d++) {
            e = u[d], e.locals = I[d], e.self.onEnter && h.invoke(e.self.onEnter, e.self, e.locals.globals);
          }return z.transition !== N ? (a.$broadcast("$stateChangeCancel", b.self, c, j.self, l), D) : (z.$current = b, z.current = b.self, z.params = c, T(z.params, n), z.transition = null, f.location && b.navigable && q.push(b.navigable.url, b.navigable.locals.globals.$stateParams, { $$avoidResync: !0, replace: "replace" === f.location }), f.notify && a.$broadcast("$stateChangeSuccess", b.self, c, j.self, l), q.update(!0), z.current);
        }).then(null, function (d) {
          return d === B ? D : z.transition !== N ? (a.$broadcast("$stateChangeCancel", b.self, c, j.self, l), D) : (z.transition = null, g = a.$broadcast("$stateChangeError", b.self, c, j.self, l, d), g.defaultPrevented || q.update(), e.reject(d));
        });return N;
      }, z.is = function (a, b, d) {
        d = S({ relative: z.$current }, d || {});var e = m(a, d.relative);return M(e) ? z.$current === e && (!b || j(e.params.$$values(b), n)) : c;
      }, z.includes = function (a, b, d) {
        if (d = S({ relative: z.$current }, d || {}), O(a) && s(a)) {
          if (!t(a)) return !1;a = z.$current.name;
        }var e = m(a, d.relative);if (!M(e)) return c;if (!M(z.$current.includes[e.name])) return !1;if (!b) return !0;for (var f = g(b), h = 0; h < f.length; h++) {
          var i = f[h],
              j = e.params[i];if (j && !j.type.equals(n[i], b[i])) return !1;
        }return !0;
      }, z.href = function (a, b, d) {
        d = S({ lossy: !0, inherit: !0, absolute: !1, relative: z.$current }, d || {});var e = m(a, d.relative);if (!M(e)) return null;d.inherit && (b = i(n, b || {}, z.$current, e));var f = e && d.lossy ? e.navigable : e;return f && f.url !== c && null !== f.url ? q.href(f.url, k(e.params.$$keys().concat("#"), b || {}), { absolute: d.absolute }) : null;
      }, z.get = function (a, b) {
        if (0 === arguments.length) return o(g(A), function (a) {
          return A[a].self;
        });var c = m(a, b || z.$current);return c && c.self ? c.self : null;
      }, z;
    }function x(a, b, c, d, e, f) {
      function g(a, b, c) {
        function d(b) {
          return "search" != a.params[b].location;
        }var e = a.params.$$keys().filter(d),
            f = l.apply({}, [a.params].concat(e)),
            g = new V.ParamSet(f);return g.$$equals(b, c);
      }if (!f.reload && a === c && (e === c.locals || a.self.reloadOnSearch === !1 && g(c, d, b))) return !0;
    }var y,
        z,
        A = {},
        B = {},
        C = "abstract",
        D = { parent: function parent(a) {
        if (M(a.parent) && a.parent) return m(a.parent);var b = /^(.+)\.[^.]+$/.exec(a.name);return b ? m(b[1]) : y;
      }, data: function data(a) {
        return a.parent && a.parent.data && (a.data = a.self.data = d(a.parent.data, a.data)), a.data;
      }, url: function url(a) {
        var b = a.url,
            c = { params: a.params || {} };if (O(b)) return "^" == b.charAt(0) ? e.compile(b.substring(1), c) : (a.parent.navigable || y).url.concat(b, c);if (!b || e.isMatcher(b)) return b;throw new Error("Invalid url '" + b + "' in state '" + a + "'");
      }, navigable: function navigable(a) {
        return a.url ? a : a.parent ? a.parent.navigable : null;
      }, ownParams: function ownParams(a) {
        var b = a.url && a.url.params || new V.ParamSet();return R(a.params || {}, function (a, c) {
          b[c] || (b[c] = new V.Param(c, null, a, "config"));
        }), b;
      }, params: function params(a) {
        var b = l(a.ownParams, a.ownParams.$$keys());return a.parent && a.parent.params ? S(a.parent.params.$$new(), b) : new V.ParamSet();
      }, views: function views(a) {
        var b = {};return R(M(a.views) ? a.views : { "": a }, function (c, d) {
          d.indexOf("@") < 0 && (d += "@" + a.parent.name), c.resolveAs = c.resolveAs || a.resolveAs || "$resolve", b[d] = c;
        }), b;
      }, path: function path(a) {
        return a.parent ? a.parent.path.concat(a) : [];
      }, includes: function includes(a) {
        var b = a.parent ? S({}, a.parent.includes) : {};return b[a.name] = !0, b;
      }, $delegates: {} };y = r({ name: "", url: "^", views: null, abstract: !0 }), y.navigable = null, this.decorator = u, this.state = v, this.$get = w, w.$inject = ["$rootScope", "$q", "$view", "$injector", "$resolve", "$stateParams", "$urlRouter", "$location", "$urlMatcherFactory"];
  }function x() {
    function a(a, b) {
      return { load: function load(a, c) {
          var d,
              e = { template: null, controller: null, view: null, locals: null, notify: !0, async: !0, params: {} };return c = S(e, c), c.view && (d = b.fromConfig(c.view, c.params, c.locals)), d;
        } };
    }this.$get = a, a.$inject = ["$rootScope", "$templateFactory"];
  }function y() {
    var a = !1;this.useAnchorScroll = function () {
      a = !0;
    }, this.$get = ["$anchorScroll", "$timeout", function (b, c) {
      return a ? b : function (a) {
        return c(function () {
          a[0].scrollIntoView();
        }, 0, !1);
      };
    }];
  }function z(a, c, d, e, f) {
    function g() {
      return c.has ? function (a) {
        return c.has(a) ? c.get(a) : null;
      } : function (a) {
        try {
          return c.get(a);
        } catch (a) {
          return null;
        }
      };
    }function h(a, c) {
      var d = function d() {
        return { enter: function enter(a, b, c) {
            b.after(a), c();
          }, leave: function leave(a, b) {
            a.remove(), b();
          } };
      };if (k) return { enter: function enter(a, c, d) {
          b.version.minor > 2 ? k.enter(a, null, c).then(d) : k.enter(a, null, c, d);
        }, leave: function leave(a, c) {
          b.version.minor > 2 ? k.leave(a).then(c) : k.leave(a, c);
        } };if (j) {
        var e = j && j(c, a);return { enter: function enter(a, b, c) {
            e.enter(a, null, b), c();
          }, leave: function leave(a, b) {
            e.leave(a), b();
          } };
      }return d();
    }var i = g(),
        j = i("$animator"),
        k = i("$animate"),
        l = { restrict: "ECA", terminal: !0, priority: 400, transclude: "element", compile: function compile(c, g, i) {
        return function (c, g, j) {
          function k() {
            if (m && (m.remove(), m = null), o && (o.$destroy(), o = null), n) {
              var a = n.data("$uiViewAnim");s.leave(n, function () {
                a.$$animLeave.resolve(), m = null;
              }), m = n, n = null;
            }
          }function l(h) {
            var l,
                m = B(c, j, g, e),
                t = m && a.$current && a.$current.locals[m];if (h || t !== p) {
              l = c.$new(), p = a.$current.locals[m], l.$emit("$viewContentLoading", m);var u = i(l, function (a) {
                var e = f.defer(),
                    h = f.defer(),
                    i = { $animEnter: e.promise, $animLeave: h.promise, $$animLeave: h };a.data("$uiViewAnim", i), s.enter(a, g, function () {
                  e.resolve(), o && o.$emit("$viewContentAnimationEnded"), (b.isDefined(r) && !r || c.$eval(r)) && d(a);
                }), k();
              });n = u, o = l, o.$emit("$viewContentLoaded", m), o.$eval(q);
            }
          }var m,
              n,
              o,
              p,
              q = j.onload || "",
              r = j.autoscroll,
              s = h(j, c);g.inheritedData("$uiView");c.$on("$stateChangeSuccess", function () {
            l(!1);
          }), l(!0);
        };
      } };return l;
  }function A(a, c, d, e) {
    return { restrict: "ECA", priority: -400, compile: function compile(f) {
        var g = f.html();return function (f, h, i) {
          var j = d.$current,
              k = B(f, i, h, e),
              l = j && j.locals[k];if (l) {
            h.data("$uiView", { name: k, state: l.$$state }), h.html(l.$template ? l.$template : g);var m = b.extend({}, l);f[l.$$resolveAs] = m;var n = a(h.contents());if (l.$$controller) {
              l.$scope = f, l.$element = h;var o = c(l.$$controller, l);l.$$controllerAs && (f[l.$$controllerAs] = o, f[l.$$controllerAs][l.$$resolveAs] = m), N(o.$onInit) && o.$onInit(), h.data("$ngControllerController", o), h.children().data("$ngControllerController", o);
            }n(f);
          }
        };
      } };
  }function B(a, b, c, d) {
    var e = d(b.uiView || b.name || "")(a),
        f = c.inheritedData("$uiView");return e.indexOf("@") >= 0 ? e : e + "@" + (f ? f.state.name : "");
  }function C(a, b) {
    var c,
        d = a.match(/^\s*({[^}]*})\s*$/);if (d && (a = b + "(" + d[1] + ")"), c = a.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/), !c || 4 !== c.length) throw new Error("Invalid state ref '" + a + "'");return { state: c[1], paramExpr: c[3] || null };
  }function D(a) {
    var b = a.parent().inheritedData("$uiView");if (b && b.state && b.state.name) return b.state;
  }function E(a) {
    var b = "[object SVGAnimatedString]" === Object.prototype.toString.call(a.prop("href")),
        c = "FORM" === a[0].nodeName;return { attr: c ? "action" : b ? "xlink:href" : "href", isAnchor: "A" === a.prop("tagName").toUpperCase(), clickable: !c };
  }function F(a, b, c, d, e) {
    return function (f) {
      var g = f.which || f.button,
          h = e();if (!(g > 1 || f.ctrlKey || f.metaKey || f.shiftKey || a.attr("target"))) {
        var i = c(function () {
          b.go(h.state, h.params, h.options);
        });f.preventDefault();var j = d.isAnchor && !h.href ? 1 : 0;f.preventDefault = function () {
          j-- <= 0 && c.cancel(i);
        };
      }
    };
  }function G(a, b) {
    return { relative: D(a) || b.$current, inherit: !0 };
  }function H(a, c) {
    return { restrict: "A", require: ["?^uiSrefActive", "?^uiSrefActiveEq"], link: function link(d, e, f, g) {
        var h,
            i = C(f.uiSref, a.current.name),
            j = { state: i.state, href: null, params: null },
            k = E(e),
            l = g[1] || g[0],
            m = null;j.options = S(G(e, a), f.uiSrefOpts ? d.$eval(f.uiSrefOpts) : {});var n = function n(c) {
          c && (j.params = b.copy(c)), j.href = a.href(i.state, j.params, j.options), m && m(), l && (m = l.$$addStateInfo(i.state, j.params)), null !== j.href && f.$set(k.attr, j.href);
        };i.paramExpr && (d.$watch(i.paramExpr, function (a) {
          a !== j.params && n(a);
        }, !0), j.params = b.copy(d.$eval(i.paramExpr))), n(), k.clickable && (h = F(e, a, c, k, function () {
          return j;
        }), e[e.on ? "on" : "bind"]("click", h), d.$on("$destroy", function () {
          e[e.off ? "off" : "unbind"]("click", h);
        }));
      } };
  }function I(a, b) {
    return { restrict: "A", require: ["?^uiSrefActive", "?^uiSrefActiveEq"], link: function link(c, d, e, f) {
        function g(b) {
          m.state = b[0], m.params = b[1], m.options = b[2], m.href = a.href(m.state, m.params, m.options), n && n(), j && (n = j.$$addStateInfo(m.state, m.params)), m.href && e.$set(i.attr, m.href);
        }var h,
            i = E(d),
            j = f[1] || f[0],
            k = [e.uiState, e.uiStateParams || null, e.uiStateOpts || null],
            l = "[" + k.map(function (a) {
          return a || "null";
        }).join(", ") + "]",
            m = { state: null, params: null, options: null, href: null },
            n = null;c.$watch(l, g, !0), g(c.$eval(l)), i.clickable && (h = F(d, a, b, i, function () {
          return m;
        }), d[d.on ? "on" : "bind"]("click", h), c.$on("$destroy", function () {
          d[d.off ? "off" : "unbind"]("click", h);
        }));
      } };
  }function J(a, b, c) {
    return { restrict: "A", controller: ["$scope", "$element", "$attrs", "$timeout", function (b, d, e, f) {
        function g(b, c, e) {
          var f = a.get(b, D(d)),
              g = h(b, c),
              i = { state: f || { name: b }, params: c, hash: g };return p.push(i), q[g] = e, function () {
            var a = p.indexOf(i);a !== -1 && p.splice(a, 1);
          };
        }function h(a, c) {
          if (!O(a)) throw new Error("state should be a string");return P(c) ? a + U(c) : (c = b.$eval(c), P(c) ? a + U(c) : a);
        }function i() {
          for (var a = 0; a < p.length; a++) {
            l(p[a].state, p[a].params) ? j(d, q[p[a].hash]) : k(d, q[p[a].hash]), m(p[a].state, p[a].params) ? j(d, n) : k(d, n);
          }
        }function j(a, b) {
          f(function () {
            a.addClass(b);
          });
        }function k(a, b) {
          a.removeClass(b);
        }function l(b, c) {
          return a.includes(b.name, c);
        }function m(b, c) {
          return a.is(b.name, c);
        }var n,
            o,
            p = [],
            q = {};n = c(e.uiSrefActiveEq || "", !1)(b);try {
          o = b.$eval(e.uiSrefActive);
        } catch (a) {}o = o || c(e.uiSrefActive || "", !1)(b), P(o) && R(o, function (c, d) {
          if (O(c)) {
            var e = C(c, a.current.name);g(e.state, b.$eval(e.paramExpr), d);
          }
        }), this.$$addStateInfo = function (a, b) {
          if (!(P(o) && p.length > 0)) {
            var c = g(a, b, o);return i(), c;
          }
        }, b.$on("$stateChangeSuccess", i), i();
      }] };
  }function K(a) {
    var b = function b(_b, c) {
      return a.is(_b, c);
    };return b.$stateful = !0, b;
  }function L(a) {
    var b = function b(_b2, c, d) {
      return a.includes(_b2, c, d);
    };return b.$stateful = !0, b;
  }var M = b.isDefined,
      N = b.isFunction,
      O = b.isString,
      P = b.isObject,
      Q = b.isArray,
      R = b.forEach,
      S = b.extend,
      T = b.copy,
      U = b.toJson;b.module("ui.router.util", ["ng"]), b.module("ui.router.router", ["ui.router.util"]), b.module("ui.router.state", ["ui.router.router", "ui.router.util"]), b.module("ui.router", ["ui.router.state"]), b.module("ui.router.compat", ["ui.router"]), q.$inject = ["$q", "$injector"], b.module("ui.router.util").service("$resolve", q), r.$inject = ["$http", "$templateCache", "$injector"], b.module("ui.router.util").service("$templateFactory", r);var V;s.prototype.concat = function (a, b) {
    var c = { caseInsensitive: V.caseInsensitive(), strict: V.strictMode(), squash: V.defaultSquashPolicy() };return new s(this.sourcePath + a + this.sourceSearch, S(c, b), this);
  }, s.prototype.toString = function () {
    return this.source;
  }, s.prototype.exec = function (a, b) {
    function c(a) {
      function b(a) {
        return a.split("").reverse().join("");
      }function c(a) {
        return a.replace(/\\-/g, "-");
      }var d = b(a).split(/-(?!\\)/),
          e = o(d, b);return o(e, c).reverse();
    }var d = this.regexp.exec(a);if (!d) return null;b = b || {};var e,
        f,
        g,
        h = this.parameters(),
        i = h.length,
        j = this.segments.length - 1,
        k = {};if (j !== d.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");var l, m;for (e = 0; e < j; e++) {
      for (g = h[e], l = this.params[g], m = d[e + 1], f = 0; f < l.replace.length; f++) {
        l.replace[f].from === m && (m = l.replace[f].to);
      }m && l.array === !0 && (m = c(m)), M(m) && (m = l.type.decode(m)), k[g] = l.value(m);
    }for (; e < i; e++) {
      for (g = h[e], k[g] = this.params[g].value(b[g]), l = this.params[g], m = b[g], f = 0; f < l.replace.length; f++) {
        l.replace[f].from === m && (m = l.replace[f].to);
      }M(m) && (m = l.type.decode(m)), k[g] = l.value(m);
    }return k;
  }, s.prototype.parameters = function (a) {
    return M(a) ? this.params[a] || null : this.$$paramNames;
  }, s.prototype.validates = function (a) {
    return this.params.$$validates(a);
  }, s.prototype.format = function (a) {
    function b(a) {
      return encodeURIComponent(a).replace(/-/g, function (a) {
        return "%5C%" + a.charCodeAt(0).toString(16).toUpperCase();
      });
    }a = a || {};var c = this.segments,
        d = this.parameters(),
        e = this.params;if (!this.validates(a)) return null;var f,
        g = !1,
        h = c.length - 1,
        i = d.length,
        j = c[0];for (f = 0; f < i; f++) {
      var k = f < h,
          l = d[f],
          m = e[l],
          n = m.value(a[l]),
          p = m.isOptional && m.type.equals(m.value(), n),
          q = !!p && m.squash,
          r = m.type.encode(n);if (k) {
        var s = c[f + 1],
            t = f + 1 === h;if (q === !1) null != r && (j += Q(r) ? o(r, b).join("-") : encodeURIComponent(r)), j += s;else if (q === !0) {
          var u = j.match(/\/$/) ? /\/?(.*)/ : /(.*)/;j += s.match(u)[1];
        } else O(q) && (j += q + s);t && m.squash === !0 && "/" === j.slice(-1) && (j = j.slice(0, -1));
      } else {
        if (null == r || p && q !== !1) continue;if (Q(r) || (r = [r]), 0 === r.length) continue;r = o(r, encodeURIComponent).join("&" + l + "="), j += (g ? "&" : "?") + (l + "=" + r), g = !0;
      }
    }return j;
  }, t.prototype.is = function (a, b) {
    return !0;
  }, t.prototype.encode = function (a, b) {
    return a;
  }, t.prototype.decode = function (a, b) {
    return a;
  }, t.prototype.equals = function (a, b) {
    return a == b;
  }, t.prototype.$subPattern = function () {
    var a = this.pattern.toString();return a.substr(1, a.length - 2);
  }, t.prototype.pattern = /.*/, t.prototype.toString = function () {
    return "{Type:" + this.name + "}";
  }, t.prototype.$normalize = function (a) {
    return this.is(a) ? a : this.decode(a);
  }, t.prototype.$asArray = function (a, b) {
    function d(a, b) {
      function d(a, b) {
        return function () {
          return a[b].apply(a, arguments);
        };
      }function e(a) {
        return Q(a) ? a : M(a) ? [a] : [];
      }function f(a) {
        switch (a.length) {case 0:
            return c;case 1:
            return "auto" === b ? a[0] : a;default:
            return a;}
      }function g(a) {
        return !a;
      }function h(a, b) {
        return function (c) {
          if (Q(c) && 0 === c.length) return c;c = e(c);var d = o(c, a);return b === !0 ? 0 === n(d, g).length : f(d);
        };
      }function i(a) {
        return function (b, c) {
          var d = e(b),
              f = e(c);if (d.length !== f.length) return !1;for (var g = 0; g < d.length; g++) {
            if (!a(d[g], f[g])) return !1;
          }return !0;
        };
      }this.encode = h(d(a, "encode")), this.decode = h(d(a, "decode")), this.is = h(d(a, "is"), !0), this.equals = i(d(a, "equals")), this.pattern = a.pattern, this.$normalize = h(d(a, "$normalize")), this.name = a.name, this.$arrayMode = b;
    }if (!a) return this;if ("auto" === a && !b) throw new Error("'auto' array mode is for query parameters only");return new d(this, a);
  }, b.module("ui.router.util").provider("$urlMatcherFactory", u), b.module("ui.router.util").run(["$urlMatcherFactory", function (a) {}]), v.$inject = ["$locationProvider", "$urlMatcherFactoryProvider"], b.module("ui.router.router").provider("$urlRouter", v), w.$inject = ["$urlRouterProvider", "$urlMatcherFactoryProvider"], b.module("ui.router.state").factory("$stateParams", function () {
    return {};
  }).constant("$state.runtime", { autoinject: !0 }).provider("$state", w).run(["$injector", function (a) {
    a.get("$state.runtime").autoinject && a.get("$state");
  }]), x.$inject = [], b.module("ui.router.state").provider("$view", x), b.module("ui.router.state").provider("$uiViewScroll", y), z.$inject = ["$state", "$injector", "$uiViewScroll", "$interpolate", "$q"], A.$inject = ["$compile", "$controller", "$state", "$interpolate"], b.module("ui.router.state").directive("uiView", z), b.module("ui.router.state").directive("uiView", A), H.$inject = ["$state", "$timeout"], I.$inject = ["$state", "$timeout"], J.$inject = ["$state", "$stateParams", "$interpolate"], b.module("ui.router.state").directive("uiSref", H).directive("uiSrefActive", J).directive("uiSrefActiveEq", J).directive("uiState", I), K.$inject = ["$state"], L.$inject = ["$state"], b.module("ui.router.state").filter("isState", K).filter("includedByState", L);
}(window, window.angular);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 AngularJS v1.5.8
 (c) 2010-2016 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (C) {
  'use strict';
  function N(a) {
    return function () {
      var b = arguments[0],
          d;d = "[" + (a ? a + ":" : "") + b + "] http://errors.angularjs.org/1.5.8/" + (a ? a + "/" : "") + b;for (b = 1; b < arguments.length; b++) {
        d = d + (1 == b ? "?" : "&") + "p" + (b - 1) + "=";var c = encodeURIComponent,
            e;e = arguments[b];e = "function" == typeof e ? e.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof e ? "undefined" : "string" != typeof e ? JSON.stringify(e) : e;d += c(e);
      }return Error(d);
    };
  }function ta(a) {
    if (null == a || Va(a)) return !1;if (L(a) || G(a) || F && a instanceof F) return !0;
    var b = "length" in Object(a) && a.length;return T(b) && (0 <= b && (b - 1 in a || a instanceof Array) || "function" == typeof a.item);
  }function q(a, b, d) {
    var c, e;if (a) if (z(a)) for (c in a) {
      "prototype" == c || "length" == c || "name" == c || a.hasOwnProperty && !a.hasOwnProperty(c) || b.call(d, a[c], c, a);
    } else if (L(a) || ta(a)) {
      var f = "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a));c = 0;for (e = a.length; c < e; c++) {
        (f || c in a) && b.call(d, a[c], c, a);
      }
    } else if (a.forEach && a.forEach !== q) a.forEach(b, d, a);else if (sc(a)) for (c in a) {
      b.call(d, a[c], c, a);
    } else if ("function" === typeof a.hasOwnProperty) for (c in a) {
      a.hasOwnProperty(c) && b.call(d, a[c], c, a);
    } else for (c in a) {
      ua.call(a, c) && b.call(d, a[c], c, a);
    }return a;
  }function tc(a, b, d) {
    for (var c = Object.keys(a).sort(), e = 0; e < c.length; e++) {
      b.call(d, a[c[e]], c[e]);
    }return c;
  }function uc(a) {
    return function (b, d) {
      a(d, b);
    };
  }function Yd() {
    return ++pb;
  }function Pb(a, b, d) {
    for (var c = a.$$hashKey, e = 0, f = b.length; e < f; ++e) {
      var g = b[e];if (D(g) || z(g)) for (var h = Object.keys(g), k = 0, l = h.length; k < l; k++) {
        var m = h[k],
            n = g[m];d && D(n) ? da(n) ? a[m] = new Date(n.valueOf()) : Wa(n) ? a[m] = new RegExp(n) : n.nodeName ? a[m] = n.cloneNode(!0) : Qb(n) ? a[m] = n.clone() : (D(a[m]) || (a[m] = L(n) ? [] : {}), Pb(a[m], [n], !0)) : a[m] = n;
      }
    }c ? a.$$hashKey = c : delete a.$$hashKey;return a;
  }function S(a) {
    return Pb(a, va.call(arguments, 1), !1);
  }function Zd(a) {
    return Pb(a, va.call(arguments, 1), !0);
  }function Z(a) {
    return parseInt(a, 10);
  }function Rb(a, b) {
    return S(Object.create(a), b);
  }function A() {}function Xa(a) {
    return a;
  }function ha(a) {
    return function () {
      return a;
    };
  }function vc(a) {
    return z(a.toString) && a.toString !== ma;
  }function y(a) {
    return "undefined" === typeof a;
  }function w(a) {
    return "undefined" !== typeof a;
  }function D(a) {
    return null !== a && "object" === (typeof a === "undefined" ? "undefined" : _typeof(a));
  }function sc(a) {
    return null !== a && "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && !wc(a);
  }function G(a) {
    return "string" === typeof a;
  }function T(a) {
    return "number" === typeof a;
  }function da(a) {
    return "[object Date]" === ma.call(a);
  }function z(a) {
    return "function" === typeof a;
  }function Wa(a) {
    return "[object RegExp]" === ma.call(a);
  }function Va(a) {
    return a && a.window === a;
  }function Ya(a) {
    return a && a.$evalAsync && a.$watch;
  }function Ga(a) {
    return "boolean" === typeof a;
  }function $d(a) {
    return a && T(a.length) && ae.test(ma.call(a));
  }function Qb(a) {
    return !(!a || !(a.nodeName || a.prop && a.attr && a.find));
  }function be(a) {
    var b = {};a = a.split(",");var d;for (d = 0; d < a.length; d++) {
      b[a[d]] = !0;
    }return b;
  }function wa(a) {
    return Q(a.nodeName || a[0] && a[0].nodeName);
  }function Za(a, b) {
    var d = a.indexOf(b);0 <= d && a.splice(d, 1);return d;
  }function pa(a, b) {
    function d(a, b) {
      var d = b.$$hashKey,
          e;if (L(a)) {
        e = 0;for (var f = a.length; e < f; e++) {
          b.push(c(a[e]));
        }
      } else if (sc(a)) for (e in a) {
        b[e] = c(a[e]);
      } else if (a && "function" === typeof a.hasOwnProperty) for (e in a) {
        a.hasOwnProperty(e) && (b[e] = c(a[e]));
      } else for (e in a) {
        ua.call(a, e) && (b[e] = c(a[e]));
      }d ? b.$$hashKey = d : delete b.$$hashKey;return b;
    }function c(a) {
      if (!D(a)) return a;var b = f.indexOf(a);if (-1 !== b) return g[b];if (Va(a) || Ya(a)) throw xa("cpws");var b = !1,
          c = e(a);void 0 === c && (c = L(a) ? [] : Object.create(wc(a)), b = !0);f.push(a);g.push(c);return b ? d(a, c) : c;
    }function e(a) {
      switch (ma.call(a)) {case "[object Int8Array]":case "[object Int16Array]":case "[object Int32Array]":case "[object Float32Array]":case "[object Float64Array]":case "[object Uint8Array]":case "[object Uint8ClampedArray]":case "[object Uint16Array]":case "[object Uint32Array]":
          return new a.constructor(c(a.buffer), a.byteOffset, a.length);case "[object ArrayBuffer]":
          if (!a.slice) {
            var b = new ArrayBuffer(a.byteLength);new Uint8Array(b).set(new Uint8Array(a));return b;
          }return a.slice(0);case "[object Boolean]":case "[object Number]":case "[object String]":case "[object Date]":
          return new a.constructor(a.valueOf());case "[object RegExp]":
          return b = new RegExp(a.source, a.toString().match(/[^\/]*$/)[0]), b.lastIndex = a.lastIndex, b;case "[object Blob]":
          return new a.constructor([a], { type: a.type });}if (z(a.cloneNode)) return a.cloneNode(!0);
    }
    var f = [],
        g = [];if (b) {
      if ($d(b) || "[object ArrayBuffer]" === ma.call(b)) throw xa("cpta");if (a === b) throw xa("cpi");L(b) ? b.length = 0 : q(b, function (a, d) {
        "$$hashKey" !== d && delete b[d];
      });f.push(a);g.push(b);return d(a, b);
    }return c(a);
  }function na(a, b) {
    if (a === b) return !0;if (null === a || null === b) return !1;if (a !== a && b !== b) return !0;var d = typeof a === "undefined" ? "undefined" : _typeof(a),
        c;if (d == (typeof b === "undefined" ? "undefined" : _typeof(b)) && "object" == d) if (L(a)) {
      if (!L(b)) return !1;if ((d = a.length) == b.length) {
        for (c = 0; c < d; c++) {
          if (!na(a[c], b[c])) return !1;
        }return !0;
      }
    } else {
      if (da(a)) return da(b) ? na(a.getTime(), b.getTime()) : !1;if (Wa(a)) return Wa(b) ? a.toString() == b.toString() : !1;if (Ya(a) || Ya(b) || Va(a) || Va(b) || L(b) || da(b) || Wa(b)) return !1;d = U();for (c in a) {
        if ("$" !== c.charAt(0) && !z(a[c])) {
          if (!na(a[c], b[c])) return !1;d[c] = !0;
        }
      }for (c in b) {
        if (!(c in d) && "$" !== c.charAt(0) && w(b[c]) && !z(b[c])) return !1;
      }return !0;
    }return !1;
  }function $a(a, b, d) {
    return a.concat(va.call(b, d));
  }function ab(a, b) {
    var d = 2 < arguments.length ? va.call(arguments, 2) : [];return !z(b) || b instanceof RegExp ? b : d.length ? function () {
      return arguments.length ? b.apply(a, $a(d, arguments, 0)) : b.apply(a, d);
    } : function () {
      return arguments.length ? b.apply(a, arguments) : b.call(a);
    };
  }function ce(a, b) {
    var d = b;"string" === typeof a && "$" === a.charAt(0) && "$" === a.charAt(1) ? d = void 0 : Va(b) ? d = "$WINDOW" : b && C.document === b ? d = "$DOCUMENT" : Ya(b) && (d = "$SCOPE");return d;
  }function bb(a, b) {
    if (!y(a)) return T(b) || (b = b ? 2 : null), JSON.stringify(a, ce, b);
  }function xc(a) {
    return G(a) ? JSON.parse(a) : a;
  }function yc(a, b) {
    a = a.replace(de, "");var d = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6E4;return isNaN(d) ? b : d;
  }function Sb(a, b, d) {
    d = d ? -1 : 1;var c = a.getTimezoneOffset();b = yc(b, c);d *= b - c;a = new Date(a.getTime());a.setMinutes(a.getMinutes() + d);return a;
  }function ya(a) {
    a = F(a).clone();try {
      a.empty();
    } catch (b) {}var d = F("<div>").append(a).html();try {
      return a[0].nodeType === Ma ? Q(d) : d.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (a, b) {
        return "<" + Q(b);
      });
    } catch (c) {
      return Q(d);
    }
  }function zc(a) {
    try {
      return decodeURIComponent(a);
    } catch (b) {}
  }function Ac(a) {
    var b = {};q((a || "").split("&"), function (a) {
      var c, e, f;a && (e = a = a.replace(/\+/g, "%20"), c = a.indexOf("="), -1 !== c && (e = a.substring(0, c), f = a.substring(c + 1)), e = zc(e), w(e) && (f = w(f) ? zc(f) : !0, ua.call(b, e) ? L(b[e]) ? b[e].push(f) : b[e] = [b[e], f] : b[e] = f));
    });return b;
  }function Tb(a) {
    var b = [];q(a, function (a, c) {
      L(a) ? q(a, function (a) {
        b.push(ea(c, !0) + (!0 === a ? "" : "=" + ea(a, !0)));
      }) : b.push(ea(c, !0) + (!0 === a ? "" : "=" + ea(a, !0)));
    });return b.length ? b.join("&") : "";
  }function qb(a) {
    return ea(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
  }function ea(a, b) {
    return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, b ? "%20" : "+");
  }function ee(a, b) {
    var d,
        c,
        e = Na.length;for (c = 0; c < e; ++c) {
      if (d = Na[c] + b, G(d = a.getAttribute(d))) return d;
    }return null;
  }function fe(a, b) {
    var d,
        c,
        e = {};q(Na, function (b) {
      b += "app";!d && a.hasAttribute && a.hasAttribute(b) && (d = a, c = a.getAttribute(b));
    });q(Na, function (b) {
      b += "app";var e;!d && (e = a.querySelector("[" + b.replace(":", "\\:") + "]")) && (d = e, c = e.getAttribute(b));
    });d && (e.strictDi = null !== ee(d, "strict-di"), b(d, c ? [c] : [], e));
  }function Bc(a, b, d) {
    D(d) || (d = {});d = S({ strictDi: !1 }, d);var c = function c() {
      a = F(a);if (a.injector()) {
        var c = a[0] === C.document ? "document" : ya(a);throw xa("btstrpd", c.replace(/</, "&lt;").replace(/>/, "&gt;"));
      }b = b || [];b.unshift(["$provide", function (b) {
        b.value("$rootElement", a);
      }]);d.debugInfoEnabled && b.push(["$compileProvider", function (a) {
        a.debugInfoEnabled(!0);
      }]);b.unshift("ng");c = cb(b, d.strictDi);c.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function (a, b, c, d) {
        a.$apply(function () {
          b.data("$injector", d);c(b)(a);
        });
      }]);return c;
    },
        e = /^NG_ENABLE_DEBUG_INFO!/,
        f = /^NG_DEFER_BOOTSTRAP!/;C && e.test(C.name) && (d.debugInfoEnabled = !0, C.name = C.name.replace(e, ""));if (C && !f.test(C.name)) return c();C.name = C.name.replace(f, "");ca.resumeBootstrap = function (a) {
      q(a, function (a) {
        b.push(a);
      });return c();
    };z(ca.resumeDeferredBootstrap) && ca.resumeDeferredBootstrap();
  }function ge() {
    C.name = "NG_ENABLE_DEBUG_INFO!" + C.name;C.location.reload();
  }function he(a) {
    a = ca.element(a).injector();if (!a) throw xa("test");return a.get("$$testability");
  }
  function Cc(a, b) {
    b = b || "_";return a.replace(ie, function (a, c) {
      return (c ? b : "") + a.toLowerCase();
    });
  }function je() {
    var a;if (!Dc) {
      var b = rb();(qa = y(b) ? C.jQuery : b ? C[b] : void 0) && qa.fn.on ? (F = qa, S(qa.fn, { scope: Oa.scope, isolateScope: Oa.isolateScope, controller: Oa.controller, injector: Oa.injector, inheritedData: Oa.inheritedData }), a = qa.cleanData, qa.cleanData = function (b) {
        for (var c, e = 0, f; null != (f = b[e]); e++) {
          (c = qa._data(f, "events")) && c.$destroy && qa(f).triggerHandler("$destroy");
        }a(b);
      }) : F = O;ca.element = F;Dc = !0;
    }
  }function sb(a, b, d) {
    if (!a) throw xa("areq", b || "?", d || "required");return a;
  }function Pa(a, b, d) {
    d && L(a) && (a = a[a.length - 1]);sb(z(a), b, "not a function, got " + (a && "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) ? a.constructor.name || "Object" : typeof a === "undefined" ? "undefined" : _typeof(a)));return a;
  }function Qa(a, b) {
    if ("hasOwnProperty" === a) throw xa("badname", b);
  }function Ec(a, b, d) {
    if (!b) return a;b = b.split(".");for (var c, e = a, f = b.length, g = 0; g < f; g++) {
      c = b[g], a && (a = (e = a)[c]);
    }return !d && z(a) ? ab(e, a) : a;
  }function tb(a) {
    for (var b = a[0], d = a[a.length - 1], c, e = 1; b !== d && (b = b.nextSibling); e++) {
      if (c || a[e] !== b) c || (c = F(va.call(a, 0, e))), c.push(b);
    }return c || a;
  }function U() {
    return Object.create(null);
  }function ke(a) {
    function b(a, b, c) {
      return a[b] || (a[b] = c());
    }var d = N("$injector"),
        c = N("ng");a = b(a, "angular", Object);a.$$minErr = a.$$minErr || N;return b(a, "module", function () {
      var a = {};return function (f, g, h) {
        if ("hasOwnProperty" === f) throw c("badname", "module");g && a.hasOwnProperty(f) && (a[f] = null);return b(a, f, function () {
          function a(b, d, e, f) {
            f || (f = c);return function () {
              f[e || "push"]([b, d, arguments]);return R;
            };
          }function b(a, d) {
            return function (b, e) {
              e && z(e) && (e.$$moduleName = f);c.push([a, d, arguments]);return R;
            };
          }if (!g) throw d("nomod", f);var c = [],
              e = [],
              p = [],
              u = a("$injector", "invoke", "push", e),
              R = { _invokeQueue: c, _configBlocks: e, _runBlocks: p, requires: g, name: f, provider: b("$provide", "provider"), factory: b("$provide", "factory"), service: b("$provide", "service"), value: a("$provide", "value"), constant: a("$provide", "constant", "unshift"), decorator: b("$provide", "decorator"), animation: b("$animateProvider", "register"), filter: b("$filterProvider", "register"), controller: b("$controllerProvider", "register"), directive: b("$compileProvider", "directive"), component: b("$compileProvider", "component"), config: u, run: function run(a) {
              p.push(a);return this;
            } };h && u(h);return R;
        });
      };
    });
  }function ia(a, b) {
    if (L(a)) {
      b = b || [];for (var d = 0, c = a.length; d < c; d++) {
        b[d] = a[d];
      }
    } else if (D(a)) for (d in b = b || {}, a) {
      if ("$" !== d.charAt(0) || "$" !== d.charAt(1)) b[d] = a[d];
    }return b || a;
  }function le(a) {
    S(a, { bootstrap: Bc, copy: pa, extend: S, merge: Zd, equals: na, element: F, forEach: q, injector: cb, noop: A, bind: ab,
      toJson: bb, fromJson: xc, identity: Xa, isUndefined: y, isDefined: w, isString: G, isFunction: z, isObject: D, isNumber: T, isElement: Qb, isArray: L, version: me, isDate: da, lowercase: Q, uppercase: ub, callbacks: { $$counter: 0 }, getTestability: he, $$minErr: N, $$csp: Ba, reloadWithDebugInfo: ge });Ub = ke(C);Ub("ng", ["ngLocale"], ["$provide", function (a) {
      a.provider({ $$sanitizeUri: ne });a.provider("$compile", Fc).directive({ a: oe, input: Gc, textarea: Gc, form: pe, script: qe, select: re, style: se, option: te, ngBind: ue, ngBindHtml: ve, ngBindTemplate: we, ngClass: xe,
        ngClassEven: ye, ngClassOdd: ze, ngCloak: Ae, ngController: Be, ngForm: Ce, ngHide: De, ngIf: Ee, ngInclude: Fe, ngInit: Ge, ngNonBindable: He, ngPluralize: Ie, ngRepeat: Je, ngShow: Ke, ngStyle: Le, ngSwitch: Me, ngSwitchWhen: Ne, ngSwitchDefault: Oe, ngOptions: Pe, ngTransclude: Qe, ngModel: Re, ngList: Se, ngChange: Te, pattern: Hc, ngPattern: Hc, required: Ic, ngRequired: Ic, minlength: Jc, ngMinlength: Jc, maxlength: Kc, ngMaxlength: Kc, ngValue: Ue, ngModelOptions: Ve }).directive({ ngInclude: We }).directive(vb).directive(Lc);a.provider({ $anchorScroll: Xe,
        $animate: Ye, $animateCss: Ze, $$animateJs: $e, $$animateQueue: af, $$AnimateRunner: bf, $$animateAsyncRun: cf, $browser: df, $cacheFactory: ef, $controller: ff, $document: gf, $exceptionHandler: hf, $filter: Mc, $$forceReflow: jf, $interpolate: kf, $interval: lf, $http: mf, $httpParamSerializer: nf, $httpParamSerializerJQLike: of, $httpBackend: pf, $xhrFactory: qf, $jsonpCallbacks: rf, $location: sf, $log: tf, $parse: uf, $rootScope: vf, $q: wf, $$q: xf, $sce: yf, $sceDelegate: zf, $sniffer: Af, $templateCache: Bf, $templateRequest: Cf, $$testability: Df, $timeout: Ef,
        $window: Ff, $$rAF: Gf, $$jqLite: Hf, $$HashMap: If, $$cookieReader: Jf });
    }]);
  }function db(a) {
    return a.replace(Kf, function (a, d, c, e) {
      return e ? c.toUpperCase() : c;
    }).replace(Lf, "Moz$1");
  }function Nc(a) {
    a = a.nodeType;return 1 === a || !a || 9 === a;
  }function Oc(a, b) {
    var d,
        c,
        e = b.createDocumentFragment(),
        f = [];if (Vb.test(a)) {
      d = e.appendChild(b.createElement("div"));c = (Mf.exec(a) || ["", ""])[1].toLowerCase();c = ja[c] || ja._default;d.innerHTML = c[1] + a.replace(Nf, "<$1></$2>") + c[2];for (c = c[0]; c--;) {
        d = d.lastChild;
      }f = $a(f, d.childNodes);d = e.firstChild;
      d.textContent = "";
    } else f.push(b.createTextNode(a));e.textContent = "";e.innerHTML = "";q(f, function (a) {
      e.appendChild(a);
    });return e;
  }function Pc(a, b) {
    var d = a.parentNode;d && d.replaceChild(b, a);b.appendChild(a);
  }function O(a) {
    if (a instanceof O) return a;var b;G(a) && (a = W(a), b = !0);if (!(this instanceof O)) {
      if (b && "<" != a.charAt(0)) throw Wb("nosel");return new O(a);
    }if (b) {
      b = C.document;var d;a = (d = Of.exec(a)) ? [b.createElement(d[1])] : (d = Oc(a, b)) ? d.childNodes : [];
    }Qc(this, a);
  }function Xb(a) {
    return a.cloneNode(!0);
  }function wb(a, b) {
    b || eb(a);if (a.querySelectorAll) for (var d = a.querySelectorAll("*"), c = 0, e = d.length; c < e; c++) {
      eb(d[c]);
    }
  }function Rc(a, b, d, c) {
    if (w(c)) throw Wb("offargs");var e = (c = xb(a)) && c.events,
        f = c && c.handle;if (f) if (b) {
      var g = function g(b) {
        var c = e[b];w(d) && Za(c || [], d);w(d) && c && 0 < c.length || (a.removeEventListener(b, f, !1), delete e[b]);
      };q(b.split(" "), function (a) {
        g(a);yb[a] && g(yb[a]);
      });
    } else for (b in e) {
      "$destroy" !== b && a.removeEventListener(b, f, !1), delete e[b];
    }
  }function eb(a, b) {
    var d = a.ng339,
        c = d && fb[d];c && (b ? delete c.data[b] : (c.handle && (c.events.$destroy && c.handle({}, "$destroy"), Rc(a)), delete fb[d], a.ng339 = void 0));
  }function xb(a, b) {
    var d = a.ng339,
        d = d && fb[d];b && !d && (a.ng339 = d = ++Pf, d = fb[d] = { events: {}, data: {}, handle: void 0 });return d;
  }function Yb(a, b, d) {
    if (Nc(a)) {
      var c = w(d),
          e = !c && b && !D(b),
          f = !b;a = (a = xb(a, !e)) && a.data;if (c) a[b] = d;else {
        if (f) return a;if (e) return a && a[b];S(a, b);
      }
    }
  }function zb(a, b) {
    return a.getAttribute ? -1 < (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") : !1;
  }function Ab(a, b) {
    b && a.setAttribute && q(b.split(" "), function (b) {
      a.setAttribute("class", W((" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + W(b) + " ", " ")));
    });
  }function Bb(a, b) {
    if (b && a.setAttribute) {
      var d = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");q(b.split(" "), function (a) {
        a = W(a);-1 === d.indexOf(" " + a + " ") && (d += a + " ");
      });a.setAttribute("class", W(d));
    }
  }function Qc(a, b) {
    if (b) if (b.nodeType) a[a.length++] = b;else {
      var d = b.length;if ("number" === typeof d && b.window !== b) {
        if (d) for (var c = 0; c < d; c++) {
          a[a.length++] = b[c];
        }
      } else a[a.length++] = b;
    }
  }function Sc(a, b) {
    return Cb(a, "$" + (b || "ngController") + "Controller");
  }function Cb(a, b, d) {
    9 == a.nodeType && (a = a.documentElement);for (b = L(b) ? b : [b]; a;) {
      for (var c = 0, e = b.length; c < e; c++) {
        if (w(d = F.data(a, b[c]))) return d;
      }a = a.parentNode || 11 === a.nodeType && a.host;
    }
  }function Tc(a) {
    for (wb(a, !0); a.firstChild;) {
      a.removeChild(a.firstChild);
    }
  }function Db(a, b) {
    b || wb(a);var d = a.parentNode;d && d.removeChild(a);
  }function Qf(a, b) {
    b = b || C;if ("complete" === b.document.readyState) b.setTimeout(a);else F(b).on("load", a);
  }function Uc(a, b) {
    var d = Eb[b.toLowerCase()];return d && Vc[wa(a)] && d;
  }function Rf(a, b) {
    var d = function d(c, _d) {
      c.isDefaultPrevented = function () {
        return c.defaultPrevented;
      };var f = b[_d || c.type],
          g = f ? f.length : 0;if (g) {
        if (y(c.immediatePropagationStopped)) {
          var h = c.stopImmediatePropagation;c.stopImmediatePropagation = function () {
            c.immediatePropagationStopped = !0;c.stopPropagation && c.stopPropagation();h && h.call(c);
          };
        }c.isImmediatePropagationStopped = function () {
          return !0 === c.immediatePropagationStopped;
        };var k = f.specialHandlerWrapper || Sf;1 < g && (f = ia(f));for (var l = 0; l < g; l++) {
          c.isImmediatePropagationStopped() || k(a, c, f[l]);
        }
      }
    };d.elem = a;return d;
  }function Sf(a, b, d) {
    d.call(a, b);
  }function Tf(a, b, d) {
    var c = b.relatedTarget;c && (c === a || Uf.call(a, c)) || d.call(a, b);
  }function Hf() {
    this.$get = function () {
      return S(O, { hasClass: function hasClass(a, b) {
          a.attr && (a = a[0]);return zb(a, b);
        }, addClass: function addClass(a, b) {
          a.attr && (a = a[0]);return Bb(a, b);
        }, removeClass: function removeClass(a, b) {
          a.attr && (a = a[0]);return Ab(a, b);
        } });
    };
  }function Ca(a, b) {
    var d = a && a.$$hashKey;if (d) return "function" === typeof d && (d = a.$$hashKey()), d;d = typeof a === "undefined" ? "undefined" : _typeof(a);return d = "function" == d || "object" == d && null !== a ? a.$$hashKey = d + ":" + (b || Yd)() : d + ":" + a;
  }function Ra(a, b) {
    if (b) {
      var d = 0;this.nextUid = function () {
        return ++d;
      };
    }q(a, this.put, this);
  }function Wc(a) {
    a = (Function.prototype.toString.call(a) + " ").replace(Vf, "");return a.match(Wf) || a.match(Xf);
  }function Yf(a) {
    return (a = Wc(a)) ? "function(" + (a[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn";
  }function cb(a, b) {
    function d(a) {
      return function (b, c) {
        if (D(b)) q(b, uc(a));else return a(b, c);
      };
    }function c(a, b) {
      Qa(a, "service");if (z(b) || L(b)) b = p.instantiate(b);if (!b.$get) throw Ha("pget", a);return n[a + "Provider"] = b;
    }function e(a, b) {
      return function () {
        var c = B.invoke(b, this);if (y(c)) throw Ha("undef", a);return c;
      };
    }function f(a, b, d) {
      return c(a, { $get: !1 !== d ? e(a, b) : b });
    }function g(a) {
      sb(y(a) || L(a), "modulesToLoad", "not an array");var b = [],
          c;q(a, function (a) {
        function d(a) {
          var b, c;b = 0;for (c = a.length; b < c; b++) {
            var e = a[b],
                f = p.get(e[0]);f[e[1]].apply(f, e[2]);
          }
        }if (!m.get(a)) {
          m.put(a, !0);try {
            G(a) ? (c = Ub(a), b = b.concat(g(c.requires)).concat(c._runBlocks), d(c._invokeQueue), d(c._configBlocks)) : z(a) ? b.push(p.invoke(a)) : L(a) ? b.push(p.invoke(a)) : Pa(a, "module");
          } catch (e) {
            throw L(a) && (a = a[a.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), Ha("modulerr", a, e.stack || e.message || e);
          }
        }
      });return b;
    }function h(a, c) {
      function d(b, e) {
        if (a.hasOwnProperty(b)) {
          if (a[b] === k) throw Ha("cdep", b + " <- " + l.join(" <- "));return a[b];
        }try {
          return l.unshift(b), a[b] = k, a[b] = c(b, e);
        } catch (f) {
          throw a[b] === k && delete a[b], f;
        } finally {
          l.shift();
        }
      }function e(a, c, f) {
        var g = [];a = cb.$$annotate(a, b, f);for (var h = 0, k = a.length; h < k; h++) {
          var l = a[h];if ("string" !== typeof l) throw Ha("itkn", l);g.push(c && c.hasOwnProperty(l) ? c[l] : d(l, f));
        }return g;
      }return { invoke: function invoke(a, b, c, d) {
          "string" === typeof c && (d = c, c = null);c = e(a, c, d);L(a) && (a = a[a.length - 1]);d = 11 >= Ea ? !1 : "function" === typeof a && /^(?:class\b|constructor\()/.test(Function.prototype.toString.call(a) + " ");return d ? (c.unshift(null), new (Function.prototype.bind.apply(a, c))()) : a.apply(b, c);
        }, instantiate: function instantiate(a, b, c) {
          var d = L(a) ? a[a.length - 1] : a;a = e(a, b, c);a.unshift(null);return new (Function.prototype.bind.apply(d, a))();
        }, get: d, annotate: cb.$$annotate, has: function has(b) {
          return n.hasOwnProperty(b + "Provider") || a.hasOwnProperty(b);
        } };
    }b = !0 === b;var k = {},
        l = [],
        m = new Ra([], !0),
        n = { $provide: { provider: d(c), factory: d(f), service: d(function (a, b) {
          return f(a, ["$injector", function (a) {
            return a.instantiate(b);
          }]);
        }), value: d(function (a, b) {
          return f(a, ha(b), !1);
        }), constant: d(function (a, b) {
          Qa(a, "constant");n[a] = b;u[a] = b;
        }), decorator: function decorator(a, b) {
          var c = p.get(a + "Provider"),
              d = c.$get;c.$get = function () {
            var a = B.invoke(d, c);return B.invoke(b, null, { $delegate: a });
          };
        } } },
        p = n.$injector = h(n, function (a, b) {
      ca.isString(b) && l.push(b);throw Ha("unpr", l.join(" <- "));
    }),
        u = {},
        R = h(u, function (a, b) {
      var c = p.get(a + "Provider", b);return B.invoke(c.$get, c, void 0, a);
    }),
        B = R;n.$injectorProvider = { $get: ha(R) };var r = g(a),
        B = R.get("$injector");B.strictDi = b;q(r, function (a) {
      a && B.invoke(a);
    });return B;
  }function Xe() {
    var a = !0;this.disableAutoScrolling = function () {
      a = !1;
    };this.$get = ["$window", "$location", "$rootScope", function (b, d, c) {
      function e(a) {
        var b = null;Array.prototype.some.call(a, function (a) {
          if ("a" === wa(a)) return b = a, !0;
        });return b;
      }function f(a) {
        if (a) {
          a.scrollIntoView();var c;c = g.yOffset;z(c) ? c = c() : Qb(c) ? (c = c[0], c = "fixed" !== b.getComputedStyle(c).position ? 0 : c.getBoundingClientRect().bottom) : T(c) || (c = 0);c && (a = a.getBoundingClientRect().top, b.scrollBy(0, a - c));
        } else b.scrollTo(0, 0);
      }function g(a) {
        a = G(a) ? a : d.hash();var b;a ? (b = h.getElementById(a)) ? f(b) : (b = e(h.getElementsByName(a))) ? f(b) : "top" === a && f(null) : f(null);
      }var h = b.document;a && c.$watch(function () {
        return d.hash();
      }, function (a, b) {
        a === b && "" === a || Qf(function () {
          c.$evalAsync(g);
        });
      });return g;
    }];
  }function gb(a, b) {
    if (!a && !b) return "";if (!a) return b;if (!b) return a;L(a) && (a = a.join(" "));L(b) && (b = b.join(" "));return a + " " + b;
  }function Zf(a) {
    G(a) && (a = a.split(" "));var b = U();q(a, function (a) {
      a.length && (b[a] = !0);
    });return b;
  }function Ia(a) {
    return D(a) ? a : {};
  }function $f(a, b, d, c) {
    function e(a) {
      try {
        a.apply(null, va.call(arguments, 1));
      } finally {
        if (R--, 0 === R) for (; B.length;) {
          try {
            B.pop()();
          } catch (b) {
            d.error(b);
          }
        }
      }
    }
    function f() {
      t = null;g();h();
    }function g() {
      r = K();r = y(r) ? null : r;na(r, E) && (r = E);E = r;
    }function h() {
      if (v !== k.url() || J !== r) v = k.url(), J = r, q(M, function (a) {
        a(k.url(), r);
      });
    }var k = this,
        l = a.location,
        m = a.history,
        n = a.setTimeout,
        p = a.clearTimeout,
        u = {};k.isMock = !1;var R = 0,
        B = [];k.$$completeOutstandingRequest = e;k.$$incOutstandingRequestCount = function () {
      R++;
    };k.notifyWhenNoOutstandingRequests = function (a) {
      0 === R ? a() : B.push(a);
    };var r,
        J,
        v = l.href,
        fa = b.find("base"),
        t = null,
        K = c.history ? function () {
      try {
        return m.state;
      } catch (a) {}
    } : A;g();J = r;k.url = function (b, d, e) {
      y(e) && (e = null);l !== a.location && (l = a.location);m !== a.history && (m = a.history);if (b) {
        var f = J === e;if (v === b && (!c.history || f)) return k;var h = v && Ja(v) === Ja(b);v = b;J = e;!c.history || h && f ? (h || (t = b), d ? l.replace(b) : h ? (d = l, e = b.indexOf("#"), e = -1 === e ? "" : b.substr(e), d.hash = e) : l.href = b, l.href !== b && (t = b)) : (m[d ? "replaceState" : "pushState"](e, "", b), g(), J = r);t && (t = b);return k;
      }return t || l.href.replace(/%27/g, "'");
    };k.state = function () {
      return r;
    };var M = [],
        H = !1,
        E = null;k.onUrlChange = function (b) {
      if (!H) {
        if (c.history) F(a).on("popstate", f);F(a).on("hashchange", f);H = !0;
      }M.push(b);return b;
    };k.$$applicationDestroyed = function () {
      F(a).off("hashchange popstate", f);
    };k.$$checkUrlChange = h;k.baseHref = function () {
      var a = fa.attr("href");return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, "") : "";
    };k.defer = function (a, b) {
      var c;R++;c = n(function () {
        delete u[c];e(a);
      }, b || 0);u[c] = !0;return c;
    };k.defer.cancel = function (a) {
      return u[a] ? (delete u[a], p(a), e(A), !0) : !1;
    };
  }function df() {
    this.$get = ["$window", "$log", "$sniffer", "$document", function (a, b, d, c) {
      return new $f(a, c, b, d);
    }];
  }function ef() {
    this.$get = function () {
      function a(a, c) {
        function e(a) {
          a != n && (p ? p == a && (p = a.n) : p = a, f(a.n, a.p), f(a, n), n = a, n.n = null);
        }function f(a, b) {
          a != b && (a && (a.p = b), b && (b.n = a));
        }if (a in b) throw N("$cacheFactory")("iid", a);var g = 0,
            h = S({}, c, { id: a }),
            k = U(),
            l = c && c.capacity || Number.MAX_VALUE,
            m = U(),
            n = null,
            p = null;return b[a] = { put: function put(a, b) {
            if (!y(b)) {
              if (l < Number.MAX_VALUE) {
                var c = m[a] || (m[a] = { key: a });e(c);
              }a in k || g++;k[a] = b;g > l && this.remove(p.key);return b;
            }
          }, get: function get(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];
              if (!b) return;e(b);
            }return k[a];
          }, remove: function remove(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];if (!b) return;b == n && (n = b.p);b == p && (p = b.n);f(b.n, b.p);delete m[a];
            }a in k && (delete k[a], g--);
          }, removeAll: function removeAll() {
            k = U();g = 0;m = U();n = p = null;
          }, destroy: function destroy() {
            m = h = k = null;delete b[a];
          }, info: function info() {
            return S({}, h, { size: g });
          } };
      }var b = {};a.info = function () {
        var a = {};q(b, function (b, e) {
          a[e] = b.info();
        });return a;
      };a.get = function (a) {
        return b[a];
      };return a;
    };
  }function Bf() {
    this.$get = ["$cacheFactory", function (a) {
      return a("templates");
    }];
  }
  function Fc(a, b) {
    function d(a, b, c) {
      var d = /^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/,
          e = U();q(a, function (a, f) {
        if (a in n) e[f] = n[a];else {
          var g = a.match(d);if (!g) throw ga("iscp", b, f, a, c ? "controller bindings definition" : "isolate scope definition");e[f] = { mode: g[1][0], collection: "*" === g[2], optional: "?" === g[3], attrName: g[4] || f };g[4] && (n[a] = e[f]);
        }
      });return e;
    }function c(a) {
      var b = a.charAt(0);if (!b || b !== Q(b)) throw ga("baddir", a);if (a !== a.trim()) throw ga("baddir", a);
    }function e(a) {
      var b = a.require || a.controller && a.name;
      !L(b) && D(b) && q(b, function (a, c) {
        var d = a.match(l);a.substring(d[0].length) || (b[c] = d[0] + c);
      });return b;
    }var f = {},
        g = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
        h = /(([\w\-]+)(?:\:([^;]+))?;?)/,
        k = be("ngSrc,ngSrcset,src,srcset"),
        l = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
        m = /^(on[a-z]+|formaction)$/,
        n = U();this.directive = function B(b, d) {
      Qa(b, "directive");G(b) ? (c(b), sb(d, "directiveFactory"), f.hasOwnProperty(b) || (f[b] = [], a.factory(b + "Directive", ["$injector", "$exceptionHandler", function (a, c) {
        var d = [];q(f[b], function (f, g) {
          try {
            var h = a.invoke(f);z(h) ? h = { compile: ha(h) } : !h.compile && h.link && (h.compile = ha(h.link));h.priority = h.priority || 0;h.index = g;h.name = h.name || b;h.require = e(h);h.restrict = h.restrict || "EA";h.$$moduleName = f.$$moduleName;d.push(h);
          } catch (k) {
            c(k);
          }
        });return d;
      }])), f[b].push(d)) : q(b, uc(B));return this;
    };this.component = function (a, b) {
      function c(a) {
        function e(b) {
          return z(b) || L(b) ? function (c, d) {
            return a.invoke(b, this, { $element: c, $attrs: d });
          } : b;
        }var f = b.template || b.templateUrl ? b.template : "",
            g = { controller: d, controllerAs: Xc(b.controller) || b.controllerAs || "$ctrl", template: e(f), templateUrl: e(b.templateUrl), transclude: b.transclude, scope: {}, bindToController: b.bindings || {}, restrict: "E", require: b.require };q(b, function (a, b) {
          "$" === b.charAt(0) && (g[b] = a);
        });return g;
      }var d = b.controller || function () {};q(b, function (a, b) {
        "$" === b.charAt(0) && (c[b] = a, z(d) && (d[b] = a));
      });c.$inject = ["$injector"];return this.directive(a, c);
    };this.aHrefSanitizationWhitelist = function (a) {
      return w(a) ? (b.aHrefSanitizationWhitelist(a), this) : b.aHrefSanitizationWhitelist();
    };this.imgSrcSanitizationWhitelist = function (a) {
      return w(a) ? (b.imgSrcSanitizationWhitelist(a), this) : b.imgSrcSanitizationWhitelist();
    };var p = !0;this.debugInfoEnabled = function (a) {
      return w(a) ? (p = a, this) : p;
    };var u = 10;this.onChangesTtl = function (a) {
      return arguments.length ? (u = a, this) : u;
    };this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$sce", "$animate", "$$sanitizeUri", function (a, b, c, e, n, t, K, M, H, E) {
      function I() {
        try {
          if (! --qa) throw Y = void 0, ga("infchng", u);K.$apply(function () {
            for (var a = [], b = 0, c = Y.length; b < c; ++b) {
              try {
                Y[b]();
              } catch (d) {
                a.push(d);
              }
            }Y = void 0;if (a.length) throw a;
          });
        } finally {
          qa++;
        }
      }function Da(a, b) {
        if (b) {
          var c = Object.keys(b),
              d,
              e,
              f;d = 0;for (e = c.length; d < e; d++) {
            f = c[d], this[f] = b[f];
          }
        } else this.$attr = {};this.$$element = a;
      }function P(a, b, c) {
        pa.innerHTML = "<span " + b + ">";b = pa.firstChild.attributes;var d = b[0];b.removeNamedItem(d.name);d.value = c;a.attributes.setNamedItem(d);
      }function x(a, b) {
        try {
          a.addClass(b);
        } catch (c) {}
      }function aa(a, b, c, d, e) {
        a instanceof F || (a = F(a));for (var f = /\S+/, g = 0, h = a.length; g < h; g++) {
          var k = a[g];k.nodeType === Ma && k.nodeValue.match(f) && Pc(k, a[g] = C.document.createElement("span"));
        }var l = s(a, b, a, c, d, e);aa.$$addScopeClass(a);var m = null;return function (b, c, d) {
          sb(b, "scope");e && e.needsNewScope && (b = b.$parent.$new());d = d || {};var f = d.parentBoundTranscludeFn,
              g = d.transcludeControllers;d = d.futureParentElement;f && f.$$boundTransclude && (f = f.$$boundTransclude);m || (m = (d = d && d[0]) ? "foreignobject" !== wa(d) && ma.call(d).match(/SVG/) ? "svg" : "html" : "html");d = "html" !== m ? F(da(m, F("<div>").append(a).html())) : c ? Oa.clone.call(a) : a;if (g) for (var h in g) {
            d.data("$" + h + "Controller", g[h].instance);
          }aa.$$addScopeInfo(d, b);c && c(d, b);l && l(b, d, d, f);return d;
        };
      }function s(a, b, c, d, e, f) {
        function g(a, c, d, e) {
          var f, k, l, m, p, r, v;if (n) for (v = Array(c.length), m = 0; m < h.length; m += 3) {
            f = h[m], v[f] = c[f];
          } else v = c;m = 0;for (p = h.length; m < p;) {
            k = v[h[m++]], c = h[m++], f = h[m++], c ? (c.scope ? (l = a.$new(), aa.$$addScopeInfo(F(k), l)) : l = a, r = c.transcludeOnThisElement ? za(a, c.transclude, e) : !c.templateOnThisElement && e ? e : !e && b ? za(a, b) : null, c(f, l, k, d, r)) : f && f(a, k.childNodes, void 0, e);
          }
        }for (var h = [], k, l, m, p, n, r = 0; r < a.length; r++) {
          k = new Da();l = $b(a[r], [], k, 0 === r ? d : void 0, e);(f = l.length ? oa(l, a[r], k, b, c, null, [], [], f) : null) && f.scope && aa.$$addScopeClass(k.$$element);k = f && f.terminal || !(m = a[r].childNodes) || !m.length ? null : s(m, f ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude : b);if (f || k) h.push(r, f, k), p = !0, n = n || f;f = null;
        }return p ? g : null;
      }function za(a, b, c) {
        function d(e, f, g, h, k) {
          e || (e = a.$new(!1, k), e.$$transcluded = !0);return b(e, f, { parentBoundTranscludeFn: c,
            transcludeControllers: g, futureParentElement: h });
        }var e = d.$$slots = U(),
            f;for (f in b.$$slots) {
          e[f] = b.$$slots[f] ? za(a, b.$$slots[f], c) : null;
        }return d;
      }function $b(a, b, c, d, e) {
        var f = c.$attr;switch (a.nodeType) {case 1:
            O(b, Aa(wa(a)), "E", d, e);for (var g, k, l, m, p = a.attributes, n = 0, r = p && p.length; n < r; n++) {
              var v = !1,
                  u = !1;g = p[n];k = g.name;l = W(g.value);g = Aa(k);if (m = Ba.test(g)) k = k.replace(Yc, "").substr(8).replace(/_(.)/g, function (a, b) {
                return b.toUpperCase();
              });(g = g.match(Ca)) && V(g[1]) && (v = k, u = k.substr(0, k.length - 5) + "end", k = k.substr(0, k.length - 6));g = Aa(k.toLowerCase());f[g] = k;if (m || !c.hasOwnProperty(g)) c[g] = l, Uc(a, g) && (c[g] = !0);ia(a, b, l, g, m);O(b, g, "A", d, e, v, u);
            }f = a.className;D(f) && (f = f.animVal);if (G(f) && "" !== f) for (; a = h.exec(f);) {
              g = Aa(a[2]), O(b, g, "C", d, e) && (c[g] = W(a[3])), f = f.substr(a.index + a[0].length);
            }break;case Ma:
            if (11 === Ea) for (; a.parentNode && a.nextSibling && a.nextSibling.nodeType === Ma;) {
              a.nodeValue += a.nextSibling.nodeValue, a.parentNode.removeChild(a.nextSibling);
            }ca(b, a.nodeValue);break;case 8:
            hb(a, b, c, d, e);}b.sort(Z);
        return b;
      }function hb(a, b, c, d, e) {
        try {
          var f = g.exec(a.nodeValue);if (f) {
            var h = Aa(f[1]);O(b, h, "M", d, e) && (c[h] = W(f[2]));
          }
        } catch (k) {}
      }function N(a, b, c) {
        var d = [],
            e = 0;if (b && a.hasAttribute && a.hasAttribute(b)) {
          do {
            if (!a) throw ga("uterdir", b, c);1 == a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--);d.push(a);a = a.nextSibling;
          } while (0 < e);
        } else d.push(a);return F(d);
      }function Zc(a, b, c) {
        return function (d, e, f, g, h) {
          e = N(e[0], b, c);return a(d, e, f, g, h);
        };
      }function ac(a, b, c, d, e, f) {
        var g;return a ? aa(b, c, d, e, f) : function () {
          g || (g = aa(b, c, d, e, f), b = c = f = null);return g.apply(this, arguments);
        };
      }function oa(a, b, d, e, f, g, h, k, l) {
        function m(a, b, c, d) {
          if (a) {
            c && (a = Zc(a, c, d));a.require = x.require;a.directiveName = I;if (u === x || x.$$isolateScope) a = ja(a, { isolateScope: !0 });h.push(a);
          }if (b) {
            c && (b = Zc(b, c, d));b.require = x.require;b.directiveName = I;if (u === x || x.$$isolateScope) b = ja(b, { isolateScope: !0 });k.push(b);
          }
        }function p(a, e, f, g, l) {
          function m(a, b, c, d) {
            var e;Ya(a) || (d = c, c = b, b = a, a = void 0);fa && (e = t);c || (c = fa ? I.parent() : I);if (d) {
              var f = l.$$slots[d];if (f) return f(a, b, e, c, s);if (y(f)) throw ga("noslot", d, ya(I));
            } else return l(a, b, e, c, s);
          }var n, E, x, M, B, t, P, I;b === f ? (g = d, I = d.$$element) : (I = F(f), g = new Da(I, d));B = e;u ? M = e.$new(!0) : r && (B = e.$parent);l && (P = m, P.$$boundTransclude = l, P.isSlotFilled = function (a) {
            return !!l.$$slots[a];
          });v && (t = ag(I, g, P, v, M, e, u));u && (aa.$$addScopeInfo(I, M, !0, !(H && (H === u || H === u.$$originalDirective))), aa.$$addScopeClass(I, !0), M.$$isolateBindings = u.$$isolateBindings, E = ka(e, g, M, M.$$isolateBindings, u), E.removeWatches && M.$on("$destroy", E.removeWatches));
          for (n in t) {
            E = v[n];x = t[n];var Zb = E.$$bindings.bindToController;x.bindingInfo = x.identifier && Zb ? ka(B, g, x.instance, Zb, E) : {};var K = x();K !== x.instance && (x.instance = K, I.data("$" + E.name + "Controller", K), x.bindingInfo.removeWatches && x.bindingInfo.removeWatches(), x.bindingInfo = ka(B, g, x.instance, Zb, E));
          }q(v, function (a, b) {
            var c = a.require;a.bindToController && !L(c) && D(c) && S(t[b].instance, ib(b, c, I, t));
          });q(t, function (a) {
            var b = a.instance;if (z(b.$onChanges)) try {
              b.$onChanges(a.bindingInfo.initialChanges);
            } catch (d) {
              c(d);
            }if (z(b.$onInit)) try {
              b.$onInit();
            } catch (e) {
              c(e);
            }z(b.$doCheck) && (B.$watch(function () {
              b.$doCheck();
            }), b.$doCheck());z(b.$onDestroy) && B.$on("$destroy", function () {
              b.$onDestroy();
            });
          });n = 0;for (E = h.length; n < E; n++) {
            x = h[n], la(x, x.isolateScope ? M : e, I, g, x.require && ib(x.directiveName, x.require, I, t), P);
          }var s = e;u && (u.template || null === u.templateUrl) && (s = M);a && a(s, f.childNodes, void 0, l);for (n = k.length - 1; 0 <= n; n--) {
            x = k[n], la(x, x.isolateScope ? M : e, I, g, x.require && ib(x.directiveName, x.require, I, t), P);
          }q(t, function (a) {
            a = a.instance;z(a.$postLink) && a.$postLink();
          });
        }l = l || {};for (var n = -Number.MAX_VALUE, r = l.newScopeDirective, v = l.controllerDirectives, u = l.newIsolateScopeDirective, H = l.templateDirective, E = l.nonTlbTranscludeDirective, M = !1, B = !1, fa = l.hasElementTranscludeDirective, t = d.$$element = F(b), x, I, P, K = e, s, Fa = !1, za = !1, w, A = 0, C = a.length; A < C; A++) {
          x = a[A];var G = x.$$start,
              hb = x.$$end;G && (t = N(b, G, hb));P = void 0;if (n > x.priority) break;if (w = x.scope) x.templateUrl || (D(w) ? (X("new/isolated scope", u || r, x, t), u = x) : X("new/isolated scope", u, x, t)), r = r || x;I = x.name;if (!Fa && (x.replace && (x.templateUrl || x.template) || x.transclude && !x.$$tlb)) {
            for (w = A + 1; Fa = a[w++];) {
              if (Fa.transclude && !Fa.$$tlb || Fa.replace && (Fa.templateUrl || Fa.template)) {
                za = !0;break;
              }
            }Fa = !0;
          }!x.templateUrl && x.controller && (w = x.controller, v = v || U(), X("'" + I + "' controller", v[I], x, t), v[I] = x);if (w = x.transclude) if (M = !0, x.$$tlb || (X("transclusion", E, x, t), E = x), "element" == w) fa = !0, n = x.priority, P = t, t = d.$$element = F(aa.$$createComment(I, d[I])), b = t[0], ea(f, va.call(P, 0), b), P[0].$$parentNode = P[0].parentNode, K = ac(za, P, e, n, g && g.name, { nonTlbTranscludeDirective: E });else {
            var oa = U();P = F(Xb(b)).contents();
            if (D(w)) {
              P = [];var Q = U(),
                  O = U();q(w, function (a, b) {
                var c = "?" === a.charAt(0);a = c ? a.substring(1) : a;Q[a] = b;oa[b] = null;O[b] = c;
              });q(t.contents(), function (a) {
                var b = Q[Aa(wa(a))];b ? (O[b] = !0, oa[b] = oa[b] || [], oa[b].push(a)) : P.push(a);
              });q(O, function (a, b) {
                if (!a) throw ga("reqslot", b);
              });for (var V in oa) {
                oa[V] && (oa[V] = ac(za, oa[V], e));
              }
            }t.empty();K = ac(za, P, e, void 0, void 0, { needsNewScope: x.$$isolateScope || x.$$newScope });K.$$slots = oa;
          }if (x.template) if (B = !0, X("template", H, x, t), H = x, w = z(x.template) ? x.template(t, d) : x.template, w = xa(w), x.replace) {
            g = x;P = Vb.test(w) ? $c(da(x.templateNamespace, W(w))) : [];b = P[0];if (1 != P.length || 1 !== b.nodeType) throw ga("tplrt", I, "");ea(f, t, b);C = { $attr: {} };w = $b(b, [], C);var Z = a.splice(A + 1, a.length - (A + 1));(u || r) && T(w, u, r);a = a.concat(w).concat(Z);$(d, C);C = a.length;
          } else t.html(w);if (x.templateUrl) B = !0, X("template", H, x, t), H = x, x.replace && (g = x), p = ba(a.splice(A, a.length - A), t, d, f, M && K, h, k, { controllerDirectives: v, newScopeDirective: r !== x && r, newIsolateScopeDirective: u, templateDirective: H, nonTlbTranscludeDirective: E }), C = a.length;else if (x.compile) try {
            s = x.compile(t, d, K);var Y = x.$$originalDirective || x;z(s) ? m(null, ab(Y, s), G, hb) : s && m(ab(Y, s.pre), ab(Y, s.post), G, hb);
          } catch (ca) {
            c(ca, ya(t));
          }x.terminal && (p.terminal = !0, n = Math.max(n, x.priority));
        }p.scope = r && !0 === r.scope;p.transcludeOnThisElement = M;p.templateOnThisElement = B;p.transclude = K;l.hasElementTranscludeDirective = fa;return p;
      }function ib(a, b, c, d) {
        var e;if (G(b)) {
          var f = b.match(l);b = b.substring(f[0].length);var g = f[1] || f[3],
              f = "?" === f[2];"^^" === g ? c = c.parent() : e = (e = d && d[b]) && e.instance;if (!e) {
            var h = "$" + b + "Controller";e = g ? c.inheritedData(h) : c.data(h);
          }if (!e && !f) throw ga("ctreq", b, a);
        } else if (L(b)) for (e = [], g = 0, f = b.length; g < f; g++) {
          e[g] = ib(a, b[g], c, d);
        } else D(b) && (e = {}, q(b, function (b, f) {
          e[f] = ib(a, b, c, d);
        }));return e || null;
      }function ag(a, b, c, d, e, f, g) {
        var h = U(),
            k;for (k in d) {
          var l = d[k],
              m = { $scope: l === g || l.$$isolateScope ? e : f, $element: a, $attrs: b, $transclude: c },
              p = l.controller;"@" == p && (p = b[l.name]);m = t(p, m, !0, l.controllerAs);h[l.name] = m;a.data("$" + l.name + "Controller", m.instance);
        }return h;
      }
      function T(a, b, c) {
        for (var d = 0, e = a.length; d < e; d++) {
          a[d] = Rb(a[d], { $$isolateScope: b, $$newScope: c });
        }
      }function O(b, e, g, h, k, l, m) {
        if (e === k) return null;k = null;if (f.hasOwnProperty(e)) {
          var p;e = a.get(e + "Directive");for (var n = 0, r = e.length; n < r; n++) {
            try {
              if (p = e[n], (y(h) || h > p.priority) && -1 != p.restrict.indexOf(g)) {
                l && (p = Rb(p, { $$start: l, $$end: m }));if (!p.$$bindings) {
                  var u = p,
                      v = p,
                      x = p.name,
                      H = { isolateScope: null, bindToController: null };D(v.scope) && (!0 === v.bindToController ? (H.bindToController = d(v.scope, x, !0), H.isolateScope = {}) : H.isolateScope = d(v.scope, x, !1));D(v.bindToController) && (H.bindToController = d(v.bindToController, x, !0));if (D(H.bindToController)) {
                    var E = v.controller,
                        M = v.controllerAs;if (!E) throw ga("noctrl", x);if (!Xc(E, M)) throw ga("noident", x);
                  }var t = u.$$bindings = H;D(t.isolateScope) && (p.$$isolateBindings = t.isolateScope);
                }b.push(p);k = p;
              }
            } catch (I) {
              c(I);
            }
          }
        }return k;
      }function V(b) {
        if (f.hasOwnProperty(b)) for (var c = a.get(b + "Directive"), d = 0, e = c.length; d < e; d++) {
          if (b = c[d], b.multiElement) return !0;
        }return !1;
      }function $(a, b) {
        var c = b.$attr,
            d = a.$attr;q(a, function (d, e) {
          "$" != e.charAt(0) && (b[e] && b[e] !== d && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]));
        });q(b, function (b, e) {
          a.hasOwnProperty(e) || "$" === e.charAt(0) || (a[e] = b, "class" !== e && "style" !== e && (d[e] = c[e]));
        });
      }function ba(a, b, c, d, f, g, h, k) {
        var l = [],
            m,
            p,
            n = b[0],
            r = a.shift(),
            u = Rb(r, { templateUrl: null, transclude: null, replace: null, $$originalDirective: r }),
            H = z(r.templateUrl) ? r.templateUrl(b, c) : r.templateUrl,
            E = r.templateNamespace;b.empty();e(H).then(function (e) {
          var v, M;e = xa(e);if (r.replace) {
            e = Vb.test(e) ? $c(da(E, W(e))) : [];v = e[0];if (1 != e.length || 1 !== v.nodeType) throw ga("tplrt", r.name, H);e = { $attr: {} };ea(d, b, v);var B = $b(v, [], e);D(r.scope) && T(B, !0);a = B.concat(a);$(c, e);
          } else v = n, b.html(e);a.unshift(u);m = oa(a, v, c, f, b, r, g, h, k);q(d, function (a, c) {
            a == v && (d[c] = b[0]);
          });for (p = s(b[0].childNodes, f); l.length;) {
            e = l.shift();M = l.shift();var t = l.shift(),
                I = l.shift(),
                B = b[0];if (!e.$$destroyed) {
              if (M !== n) {
                var P = M.className;k.hasElementTranscludeDirective && r.replace || (B = Xb(v));ea(t, F(M), B);x(F(B), P);
              }M = m.transcludeOnThisElement ? za(e, m.transclude, I) : I;m(p, e, B, d, M);
            }
          }l = null;
        });return function (a, b, c, d, e) {
          a = e;b.$$destroyed || (l ? l.push(b, c, d, a) : (m.transcludeOnThisElement && (a = za(b, m.transclude, e)), m(p, b, c, d, a)));
        };
      }function Z(a, b) {
        var c = b.priority - a.priority;return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
      }function X(a, b, c, d) {
        function e(a) {
          return a ? " (module: " + a + ")" : "";
        }if (b) throw ga("multidir", b.name, e(b.$$moduleName), c.name, e(c.$$moduleName), a, ya(d));
      }function ca(a, c) {
        var d = b(c, !0);d && a.push({ priority: 0, compile: function compile(a) {
            a = a.parent();var b = !!a.length;b && aa.$$addBindingClass(a);return function (a, c) {
              var e = c.parent();b || aa.$$addBindingClass(e);aa.$$addBindingInfo(e, d.expressions);a.$watch(d, function (a) {
                c[0].nodeValue = a;
              });
            };
          } });
      }function da(a, b) {
        a = Q(a || "html");switch (a) {case "svg":case "math":
            var c = C.document.createElement("div");c.innerHTML = "<" + a + ">" + b + "</" + a + ">";return c.childNodes[0].childNodes;default:
            return b;}
      }function ha(a, b) {
        if ("srcdoc" == b) return M.HTML;var c = wa(a);if ("xlinkHref" == b || "form" == c && "action" == b || "img" != c && ("src" == b || "ngSrc" == b)) return M.RESOURCE_URL;
      }function ia(a, c, d, e, f) {
        var g = ha(a, e);f = k[e] || f;var h = b(d, !0, g, f);if (h) {
          if ("multiple" === e && "select" === wa(a)) throw ga("selmulti", ya(a));c.push({ priority: 100, compile: function compile() {
              return { pre: function pre(a, c, k) {
                  c = k.$$observers || (k.$$observers = U());if (m.test(e)) throw ga("nodomevents");var l = k[e];l !== d && (h = l && b(l, !0, g, f), d = l);h && (k[e] = h(a), (c[e] || (c[e] = [])).$$inter = !0, (k.$$observers && k.$$observers[e].$$scope || a).$watch(h, function (a, b) {
                    "class" === e && a != b ? k.$updateClass(a, b) : k.$set(e, a);
                  }));
                } };
            } });
        }
      }function ea(a, b, c) {
        var d = b[0],
            e = b.length,
            f = d.parentNode,
            g,
            h;if (a) for (g = 0, h = a.length; g < h; g++) {
          if (a[g] == d) {
            a[g++] = c;h = g + e - 1;for (var k = a.length; g < k; g++, h++) {
              h < k ? a[g] = a[h] : delete a[g];
            }a.length -= e - 1;a.context === d && (a.context = c);break;
          }
        }f && f.replaceChild(c, d);a = C.document.createDocumentFragment();for (g = 0; g < e; g++) {
          a.appendChild(b[g]);
        }F.hasData(d) && (F.data(c, F.data(d)), F(d).off("$destroy"));F.cleanData(a.querySelectorAll("*"));for (g = 1; g < e; g++) {
          delete b[g];
        }b[0] = c;b.length = 1;
      }function ja(a, b) {
        return S(function () {
          return a.apply(null, arguments);
        }, a, b);
      }function la(a, b, d, e, f, g) {
        try {
          a(b, d, e, f, g);
        } catch (h) {
          c(h, ya(d));
        }
      }function ka(a, c, d, e, f) {
        function g(b, c, e) {
          z(d.$onChanges) && c !== e && (Y || (a.$$postDigest(I), Y = []), m || (m = {}, Y.push(h)), m[b] && (e = m[b].previousValue), m[b] = new Fb(e, c));
        }function h() {
          d.$onChanges(m);m = void 0;
        }var k = [],
            l = {},
            m;q(e, function (e, h) {
          var m = e.attrName,
              p = e.optional,
              v,
              u,
              x,
              H;switch (e.mode) {case "@":
              p || ua.call(c, m) || (d[h] = c[m] = void 0);c.$observe(m, function (a) {
                if (G(a) || Ga(a)) g(h, a, d[h]), d[h] = a;
              });c.$$observers[m].$$scope = a;v = c[m];G(v) ? d[h] = b(v)(a) : Ga(v) && (d[h] = v);l[h] = new Fb(bc, d[h]);break;case "=":
              if (!ua.call(c, m)) {
                if (p) break;c[m] = void 0;
              }if (p && !c[m]) break;u = n(c[m]);H = u.literal ? na : function (a, b) {
                return a === b || a !== a && b !== b;
              };x = u.assign || function () {
                v = d[h] = u(a);throw ga("nonassign", c[m], m, f.name);
              };v = d[h] = u(a);p = function p(b) {
                H(b, d[h]) || (H(b, v) ? x(a, b = d[h]) : d[h] = b);return v = b;
              };p.$stateful = !0;p = e.collection ? a.$watchCollection(c[m], p) : a.$watch(n(c[m], p), null, u.literal);k.push(p);break;case "<":
              if (!ua.call(c, m)) {
                if (p) break;c[m] = void 0;
              }if (p && !c[m]) break;u = n(c[m]);var E = d[h] = u(a);l[h] = new Fb(bc, d[h]);p = a.$watch(u, function (a, b) {
                if (b === a) {
                  if (b === E) return;b = E;
                }g(h, a, b);d[h] = a;
              }, u.literal);k.push(p);break;case "&":
              u = c.hasOwnProperty(m) ? n(c[m]) : A;if (u === A && p) break;d[h] = function (b) {
                return u(a, b);
              };}
        });return { initialChanges: l, removeWatches: k.length && function () {
            for (var a = 0, b = k.length; a < b; ++a) {
              k[a]();
            }
          } };
      }var ta = /^\w/,
          pa = C.document.createElement("div"),
          qa = u,
          Y;Da.prototype = { $normalize: Aa, $addClass: function $addClass(a) {
          a && 0 < a.length && H.addClass(this.$$element, a);
        }, $removeClass: function $removeClass(a) {
          a && 0 < a.length && H.removeClass(this.$$element, a);
        }, $updateClass: function $updateClass(a, b) {
          var c = ad(a, b);c && c.length && H.addClass(this.$$element, c);(c = ad(b, a)) && c.length && H.removeClass(this.$$element, c);
        }, $set: function $set(a, b, d, e) {
          var f = Uc(this.$$element[0], a),
              g = bd[a],
              h = a;f ? (this.$$element.prop(a, b), e = f) : g && (this[g] = b, h = g);this[a] = b;e ? this.$attr[a] = e : (e = this.$attr[a]) || (this.$attr[a] = e = Cc(a, "-"));f = wa(this.$$element);if ("a" === f && ("href" === a || "xlinkHref" === a) || "img" === f && "src" === a) this[a] = b = E(b, "src" === a);else if ("img" === f && "srcset" === a && w(b)) {
            for (var f = "", g = W(b), k = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, k = /\s/.test(g) ? k : /(,)/, g = g.split(k), k = Math.floor(g.length / 2), l = 0; l < k; l++) {
              var m = 2 * l,
                  f = f + E(W(g[m]), !0),
                  f = f + (" " + W(g[m + 1]));
            }g = W(g[2 * l]).split(/\s/);f += E(W(g[0]), !0);2 === g.length && (f += " " + W(g[1]));this[a] = b = f;
          }!1 !== d && (null === b || y(b) ? this.$$element.removeAttr(e) : ta.test(e) ? this.$$element.attr(e, b) : P(this.$$element[0], e, b));(a = this.$$observers) && q(a[h], function (a) {
            try {
              a(b);
            } catch (d) {
              c(d);
            }
          });
        },
        $observe: function $observe(a, b) {
          var c = this,
              d = c.$$observers || (c.$$observers = U()),
              e = d[a] || (d[a] = []);e.push(b);K.$evalAsync(function () {
            e.$$inter || !c.hasOwnProperty(a) || y(c[a]) || b(c[a]);
          });return function () {
            Za(e, b);
          };
        } };var ra = b.startSymbol(),
          sa = b.endSymbol(),
          xa = "{{" == ra && "}}" == sa ? Xa : function (a) {
        return a.replace(/\{\{/g, ra).replace(/}}/g, sa);
      },
          Ba = /^ngAttr[A-Z]/,
          Ca = /^(.+)Start$/;aa.$$addBindingInfo = p ? function (a, b) {
        var c = a.data("$binding") || [];L(b) ? c = c.concat(b) : c.push(b);a.data("$binding", c);
      } : A;aa.$$addBindingClass = p ? function (a) {
        x(a, "ng-binding");
      } : A;aa.$$addScopeInfo = p ? function (a, b, c, d) {
        a.data(c ? d ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope", b);
      } : A;aa.$$addScopeClass = p ? function (a, b) {
        x(a, b ? "ng-isolate-scope" : "ng-scope");
      } : A;aa.$$createComment = function (a, b) {
        var c = "";p && (c = " " + (a || "") + ": ", b && (c += b + " "));return C.document.createComment(c);
      };return aa;
    }];
  }function Fb(a, b) {
    this.previousValue = a;this.currentValue = b;
  }function Aa(a) {
    return db(a.replace(Yc, ""));
  }function ad(a, b) {
    var d = "",
        c = a.split(/\s+/),
        e = b.split(/\s+/),
        f = 0;a: for (; f < c.length; f++) {
      for (var g = c[f], h = 0; h < e.length; h++) {
        if (g == e[h]) continue a;
      }d += (0 < d.length ? " " : "") + g;
    }return d;
  }function $c(a) {
    a = F(a);var b = a.length;if (1 >= b) return a;for (; b--;) {
      8 === a[b].nodeType && bg.call(a, b, 1);
    }return a;
  }function Xc(a, b) {
    if (b && G(b)) return b;if (G(a)) {
      var d = cd.exec(a);if (d) return d[3];
    }
  }function ff() {
    var a = {},
        b = !1;this.has = function (b) {
      return a.hasOwnProperty(b);
    };this.register = function (b, c) {
      Qa(b, "controller");D(b) ? S(a, b) : a[b] = c;
    };this.allowGlobals = function () {
      b = !0;
    };this.$get = ["$injector", "$window", function (d, c) {
      function e(a, b, c, d) {
        if (!a || !D(a.$scope)) throw N("$controller")("noscp", d, b);a.$scope[b] = c;
      }return function (f, g, h, k) {
        var l, m, n;h = !0 === h;k && G(k) && (n = k);if (G(f)) {
          k = f.match(cd);if (!k) throw cg("ctrlfmt", f);m = k[1];n = n || k[3];f = a.hasOwnProperty(m) ? a[m] : Ec(g.$scope, m, !0) || (b ? Ec(c, m, !0) : void 0);Pa(f, m, !0);
        }if (h) return h = (L(f) ? f[f.length - 1] : f).prototype, l = Object.create(h || null), n && e(g, n, l, m || f.name), S(function () {
          var a = d.invoke(f, l, g, m);a !== l && (D(a) || z(a)) && (l = a, n && e(g, n, l, m || f.name));return l;
        }, { instance: l, identifier: n });l = d.instantiate(f, g, m);n && e(g, n, l, m || f.name);return l;
      };
    }];
  }function gf() {
    this.$get = ["$window", function (a) {
      return F(a.document);
    }];
  }function hf() {
    this.$get = ["$log", function (a) {
      return function (b, d) {
        a.error.apply(a, arguments);
      };
    }];
  }function cc(a) {
    return D(a) ? da(a) ? a.toISOString() : bb(a) : a;
  }function nf() {
    this.$get = function () {
      return function (a) {
        if (!a) return "";var b = [];tc(a, function (a, c) {
          null === a || y(a) || (L(a) ? q(a, function (a) {
            b.push(ea(c) + "=" + ea(cc(a)));
          }) : b.push(ea(c) + "=" + ea(cc(a))));
        });
        return b.join("&");
      };
    };
  }function of() {
    this.$get = function () {
      return function (a) {
        function b(a, e, f) {
          null === a || y(a) || (L(a) ? q(a, function (a, c) {
            b(a, e + "[" + (D(a) ? c : "") + "]");
          }) : D(a) && !da(a) ? tc(a, function (a, c) {
            b(a, e + (f ? "" : "[") + c + (f ? "" : "]"));
          }) : d.push(ea(e) + "=" + ea(cc(a))));
        }if (!a) return "";var d = [];b(a, "", !0);return d.join("&");
      };
    };
  }function dc(a, b) {
    if (G(a)) {
      var d = a.replace(dg, "").trim();if (d) {
        var c = b("Content-Type");(c = c && 0 === c.indexOf(dd)) || (c = (c = d.match(eg)) && fg[c[0]].test(d));c && (a = xc(d));
      }
    }return a;
  }function ed(a) {
    var b = U(),
        d;G(a) ? q(a.split("\n"), function (a) {
      d = a.indexOf(":");var e = Q(W(a.substr(0, d)));a = W(a.substr(d + 1));e && (b[e] = b[e] ? b[e] + ", " + a : a);
    }) : D(a) && q(a, function (a, d) {
      var f = Q(d),
          g = W(a);f && (b[f] = b[f] ? b[f] + ", " + g : g);
    });return b;
  }function fd(a) {
    var b;return function (d) {
      b || (b = ed(a));return d ? (d = b[Q(d)], void 0 === d && (d = null), d) : b;
    };
  }function gd(a, b, d, c) {
    if (z(c)) return c(a, b, d);q(c, function (c) {
      a = c(a, b, d);
    });return a;
  }function mf() {
    var a = this.defaults = { transformResponse: [dc], transformRequest: [function (a) {
        return D(a) && "[object File]" !== ma.call(a) && "[object Blob]" !== ma.call(a) && "[object FormData]" !== ma.call(a) ? bb(a) : a;
      }], headers: { common: { Accept: "application/json, text/plain, */*" }, post: ia(ec), put: ia(ec), patch: ia(ec) }, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", paramSerializer: "$httpParamSerializer" },
        b = !1;this.useApplyAsync = function (a) {
      return w(a) ? (b = !!a, this) : b;
    };var d = !0;this.useLegacyPromiseExtensions = function (a) {
      return w(a) ? (d = !!a, this) : d;
    };var c = this.interceptors = [];this.$get = ["$httpBackend", "$$cookieReader", "$cacheFactory", "$rootScope", "$q", "$injector", function (e, f, g, h, k, l) {
      function m(b) {
        function c(a, b) {
          for (var d = 0, e = b.length; d < e;) {
            var f = b[d++],
                g = b[d++];a = a.then(f, g);
          }b.length = 0;return a;
        }function e(a, b) {
          var c,
              d = {};q(a, function (a, e) {
            z(a) ? (c = a(b), null != c && (d[e] = c)) : d[e] = a;
          });return d;
        }function f(a) {
          var b = S({}, a);b.data = gd(a.data, a.headers, a.status, g.transformResponse);a = a.status;return 200 <= a && 300 > a ? b : k.reject(b);
        }if (!D(b)) throw N("$http")("badreq", b);if (!G(b.url)) throw N("$http")("badreq", b.url);var g = S({ method: "get", transformRequest: a.transformRequest,
          transformResponse: a.transformResponse, paramSerializer: a.paramSerializer }, b);g.headers = function (b) {
          var c = a.headers,
              d = S({}, b.headers),
              f,
              g,
              h,
              c = S({}, c.common, c[Q(b.method)]);a: for (f in c) {
            g = Q(f);for (h in d) {
              if (Q(h) === g) continue a;
            }d[f] = c[f];
          }return e(d, ia(b));
        }(b);g.method = ub(g.method);g.paramSerializer = G(g.paramSerializer) ? l.get(g.paramSerializer) : g.paramSerializer;var h = [],
            m = [],
            p = k.when(g);q(R, function (a) {
          (a.request || a.requestError) && h.unshift(a.request, a.requestError);(a.response || a.responseError) && m.push(a.response, a.responseError);
        });p = c(p, h);p = p.then(function (b) {
          var c = b.headers,
              d = gd(b.data, fd(c), void 0, b.transformRequest);y(d) && q(c, function (a, b) {
            "content-type" === Q(b) && delete c[b];
          });y(b.withCredentials) && !y(a.withCredentials) && (b.withCredentials = a.withCredentials);return n(b, d).then(f, f);
        });p = c(p, m);d ? (p.success = function (a) {
          Pa(a, "fn");p.then(function (b) {
            a(b.data, b.status, b.headers, g);
          });return p;
        }, p.error = function (a) {
          Pa(a, "fn");p.then(null, function (b) {
            a(b.data, b.status, b.headers, g);
          });return p;
        }) : (p.success = hd("success"), p.error = hd("error"));return p;
      }function n(c, d) {
        function g(a) {
          if (a) {
            var c = {};q(a, function (a, d) {
              c[d] = function (c) {
                function d() {
                  a(c);
                }b ? h.$applyAsync(d) : h.$$phase ? d() : h.$apply(d);
              };
            });return c;
          }
        }function l(a, c, d, e) {
          function f() {
            n(c, a, d, e);
          }E && (200 <= a && 300 > a ? E.put(P, [a, c, ed(d), e]) : E.remove(P));b ? h.$applyAsync(f) : (f(), h.$$phase || h.$apply());
        }function n(a, b, d, e) {
          b = -1 <= b ? b : 0;(200 <= b && 300 > b ? M.resolve : M.reject)({ data: a, status: b, headers: fd(d), config: c, statusText: e });
        }function t(a) {
          n(a.data, a.status, ia(a.headers()), a.statusText);
        }function R() {
          var a = m.pendingRequests.indexOf(c);-1 !== a && m.pendingRequests.splice(a, 1);
        }var M = k.defer(),
            H = M.promise,
            E,
            I,
            Da = c.headers,
            P = p(c.url, c.paramSerializer(c.params));m.pendingRequests.push(c);H.then(R, R);!c.cache && !a.cache || !1 === c.cache || "GET" !== c.method && "JSONP" !== c.method || (E = D(c.cache) ? c.cache : D(a.cache) ? a.cache : u);E && (I = E.get(P), w(I) ? I && z(I.then) ? I.then(t, t) : L(I) ? n(I[1], I[0], ia(I[2]), I[3]) : n(I, 200, {}, "OK") : E.put(P, H));y(I) && ((I = id(c.url) ? f()[c.xsrfCookieName || a.xsrfCookieName] : void 0) && (Da[c.xsrfHeaderName || a.xsrfHeaderName] = I), e(c.method, P, d, l, Da, c.timeout, c.withCredentials, c.responseType, g(c.eventHandlers), g(c.uploadEventHandlers)));return H;
      }function p(a, b) {
        0 < b.length && (a += (-1 == a.indexOf("?") ? "?" : "&") + b);return a;
      }var u = g("$http");a.paramSerializer = G(a.paramSerializer) ? l.get(a.paramSerializer) : a.paramSerializer;var R = [];q(c, function (a) {
        R.unshift(G(a) ? l.get(a) : l.invoke(a));
      });m.pendingRequests = [];(function (a) {
        q(arguments, function (a) {
          m[a] = function (b, c) {
            return m(S({}, c || {}, { method: a, url: b }));
          };
        });
      })("get", "delete", "head", "jsonp");(function (a) {
        q(arguments, function (a) {
          m[a] = function (b, c, d) {
            return m(S({}, d || {}, { method: a, url: b, data: c }));
          };
        });
      })("post", "put", "patch");m.defaults = a;return m;
    }];
  }function qf() {
    this.$get = function () {
      return function () {
        return new C.XMLHttpRequest();
      };
    };
  }function pf() {
    this.$get = ["$browser", "$jsonpCallbacks", "$document", "$xhrFactory", function (a, b, d, c) {
      return gg(a, c, a.defer, b, d[0]);
    }];
  }function gg(a, b, d, c, e) {
    function f(a, b, d) {
      a = a.replace("JSON_CALLBACK", b);var f = e.createElement("script"),
          _m = null;f.type = "text/javascript";f.src = a;f.async = !0;_m = function m(a) {
        f.removeEventListener("load", _m, !1);f.removeEventListener("error", _m, !1);e.body.removeChild(f);f = null;var g = -1,
            u = "unknown";a && ("load" !== a.type || c.wasCalled(b) || (a = { type: "error" }), u = a.type, g = "error" === a.type ? 404 : 200);d && d(g, u);
      };f.addEventListener("load", _m, !1);f.addEventListener("error", _m, !1);e.body.appendChild(f);return _m;
    }return function (e, h, k, l, m, n, p, u, R, B) {
      function r() {
        fa && fa();t && t.abort();
      }function J(b, c, e, f, g) {
        w(M) && d.cancel(M);fa = t = null;b(c, e, f, g);a.$$completeOutstandingRequest(A);
      }a.$$incOutstandingRequestCount();h = h || a.url();if ("jsonp" === Q(e)) var v = c.createCallback(h),
          fa = f(h, v, function (a, b) {
        var d = 200 === a && c.getResponse(v);J(l, a, d, "", b);c.removeCallback(v);
      });else {
        var t = b(e, h);t.open(e, h, !0);q(m, function (a, b) {
          w(a) && t.setRequestHeader(b, a);
        });t.onload = function () {
          var a = t.statusText || "",
              b = "response" in t ? t.response : t.responseText,
              c = 1223 === t.status ? 204 : t.status;0 === c && (c = b ? 200 : "file" == Y(h).protocol ? 404 : 0);J(l, c, b, t.getAllResponseHeaders(), a);
        };e = function e() {
          J(l, -1, null, null, "");
        };t.onerror = e;t.onabort = e;q(R, function (a, b) {
          t.addEventListener(b, a);
        });q(B, function (a, b) {
          t.upload.addEventListener(b, a);
        });p && (t.withCredentials = !0);if (u) try {
          t.responseType = u;
        } catch (K) {
          if ("json" !== u) throw K;
        }t.send(y(k) ? null : k);
      }if (0 < n) var M = d(r, n);else n && z(n.then) && n.then(r);
    };
  }function kf() {
    var a = "{{",
        b = "}}";this.startSymbol = function (b) {
      return b ? (a = b, this) : a;
    };this.endSymbol = function (a) {
      return a ? (b = a, this) : b;
    };this.$get = ["$parse", "$exceptionHandler", "$sce", function (d, c, e) {
      function f(a) {
        return "\\\\\\" + a;
      }function g(c) {
        return c.replace(n, a).replace(p, b);
      }function h(a, b, c, d) {
        var e;return e = a.$watch(function (a) {
          e();return d(a);
        }, b, c);
      }function k(f, k, p, n) {
        function J(a) {
          try {
            var b = a;a = p ? e.getTrusted(p, b) : e.valueOf(b);var d;if (n && !w(a)) d = a;else if (null == a) d = "";else {
              switch (typeof a === "undefined" ? "undefined" : _typeof(a)) {case "string":
                  break;case "number":
                  a = "" + a;break;default:
                  a = bb(a);}d = a;
            }return d;
          } catch (g) {
            c(Ka.interr(f, g));
          }
        }if (!f.length || -1 === f.indexOf(a)) {
          var v;k || (k = g(f), v = ha(k), v.exp = f, v.expressions = [], v.$$watchDelegate = h);return v;
        }n = !!n;var q,
            t,
            K = 0,
            M = [],
            H = [];v = f.length;for (var E = [], I = []; K < v;) {
          if (-1 != (q = f.indexOf(a, K)) && -1 != (t = f.indexOf(b, q + l))) K !== q && E.push(g(f.substring(K, q))), K = f.substring(q + l, t), M.push(K), H.push(d(K, J)), K = t + m, I.push(E.length), E.push("");else {
            K !== v && E.push(g(f.substring(K)));break;
          }
        }p && 1 < E.length && Ka.throwNoconcat(f);if (!k || M.length) {
          var Da = function Da(a) {
            for (var b = 0, c = M.length; b < c; b++) {
              if (n && y(a[b])) return;E[I[b]] = a[b];
            }return E.join("");
          };return S(function (a) {
            var b = 0,
                d = M.length,
                e = Array(d);try {
              for (; b < d; b++) {
                e[b] = H[b](a);
              }return Da(e);
            } catch (g) {
              c(Ka.interr(f, g));
            }
          }, { exp: f, expressions: M, $$watchDelegate: function $$watchDelegate(a, b) {
              var c;return a.$watchGroup(H, function (d, e) {
                var f = Da(d);z(b) && b.call(this, f, d !== e ? c : f, a);c = f;
              });
            } });
        }
      }var l = a.length,
          m = b.length,
          n = new RegExp(a.replace(/./g, f), "g"),
          p = new RegExp(b.replace(/./g, f), "g");k.startSymbol = function () {
        return a;
      };k.endSymbol = function () {
        return b;
      };return k;
    }];
  }function lf() {
    this.$get = ["$rootScope", "$window", "$q", "$$q", "$browser", function (a, b, d, c, e) {
      function f(f, k, l, m) {
        function n() {
          p ? f.apply(null, u) : f(r);
        }var p = 4 < arguments.length,
            u = p ? va.call(arguments, 4) : [],
            R = b.setInterval,
            q = b.clearInterval,
            r = 0,
            J = w(m) && !m,
            v = (J ? c : d).defer(),
            fa = v.promise;l = w(l) ? l : 0;fa.$$intervalId = R(function () {
          J ? e.defer(n) : a.$evalAsync(n);v.notify(r++);0 < l && r >= l && (v.resolve(r), q(fa.$$intervalId), delete g[fa.$$intervalId]);J || a.$apply();
        }, k);g[fa.$$intervalId] = v;return fa;
      }var g = {};f.cancel = function (a) {
        return a && a.$$intervalId in g ? (g[a.$$intervalId].reject("canceled"), b.clearInterval(a.$$intervalId), delete g[a.$$intervalId], !0) : !1;
      };return f;
    }];
  }function fc(a) {
    a = a.split("/");for (var b = a.length; b--;) {
      a[b] = qb(a[b]);
    }return a.join("/");
  }function jd(a, b) {
    var d = Y(a);b.$$protocol = d.protocol;b.$$host = d.hostname;b.$$port = Z(d.port) || hg[d.protocol] || null;
  }function kd(a, b) {
    var d = "/" !== a.charAt(0);d && (a = "/" + a);var c = Y(a);b.$$path = decodeURIComponent(d && "/" === c.pathname.charAt(0) ? c.pathname.substring(1) : c.pathname);b.$$search = Ac(c.search);b.$$hash = decodeURIComponent(c.hash);b.$$path && "/" != b.$$path.charAt(0) && (b.$$path = "/" + b.$$path);
  }function ka(a, b) {
    if (0 === b.lastIndexOf(a, 0)) return b.substr(a.length);
  }function Ja(a) {
    var b = a.indexOf("#");return -1 == b ? a : a.substr(0, b);
  }function jb(a) {
    return a.replace(/(#.+)|#$/, "$1");
  }function gc(a, b, d) {
    this.$$html5 = !0;d = d || "";jd(a, this);this.$$parse = function (a) {
      var d = ka(b, a);if (!G(d)) throw Gb("ipthprfx", a, b);kd(d, this);this.$$path || (this.$$path = "/");this.$$compose();
    };this.$$compose = function () {
      var a = Tb(this.$$search),
          d = this.$$hash ? "#" + qb(this.$$hash) : "";this.$$url = fc(this.$$path) + (a ? "?" + a : "") + d;this.$$absUrl = b + this.$$url.substr(1);
    };this.$$parseLinkUrl = function (c, e) {
      if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;var f, g;w(f = ka(a, c)) ? (g = f, g = w(f = ka(d, f)) ? b + (ka("/", f) || f) : a + g) : w(f = ka(b, c)) ? g = b + f : b == c + "/" && (g = b);g && this.$$parse(g);return !!g;
    };
  }function hc(a, b, d) {
    jd(a, this);this.$$parse = function (c) {
      var e = ka(a, c) || ka(b, c),
          f;y(e) || "#" !== e.charAt(0) ? this.$$html5 ? f = e : (f = "", y(e) && (a = c, this.replace())) : (f = ka(d, e), y(f) && (f = e));kd(f, this);c = this.$$path;var e = a,
          g = /^\/[A-Z]:(\/.*)/;0 === f.lastIndexOf(e, 0) && (f = f.replace(e, ""));g.exec(f) || (c = (f = g.exec(c)) ? f[1] : c);this.$$path = c;this.$$compose();
    };this.$$compose = function () {
      var b = Tb(this.$$search),
          e = this.$$hash ? "#" + qb(this.$$hash) : "";this.$$url = fc(this.$$path) + (b ? "?" + b : "") + e;this.$$absUrl = a + (this.$$url ? d + this.$$url : "");
    };this.$$parseLinkUrl = function (b, d) {
      return Ja(a) == Ja(b) ? (this.$$parse(b), !0) : !1;
    };
  }function ld(a, b, d) {
    this.$$html5 = !0;hc.apply(this, arguments);this.$$parseLinkUrl = function (c, e) {
      if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;var f, g;a == Ja(c) ? f = c : (g = ka(b, c)) ? f = a + d + g : b === c + "/" && (f = b);f && this.$$parse(f);return !!f;
    };this.$$compose = function () {
      var b = Tb(this.$$search),
          e = this.$$hash ? "#" + qb(this.$$hash) : "";this.$$url = fc(this.$$path) + (b ? "?" + b : "") + e;this.$$absUrl = a + d + this.$$url;
    };
  }function Hb(a) {
    return function () {
      return this[a];
    };
  }function md(a, b) {
    return function (d) {
      if (y(d)) return this[a];this[a] = b(d);this.$$compose();return this;
    };
  }function sf() {
    var a = "",
        b = { enabled: !1, requireBase: !0, rewriteLinks: !0 };this.hashPrefix = function (b) {
      return w(b) ? (a = b, this) : a;
    };this.html5Mode = function (a) {
      return Ga(a) ? (b.enabled = a, this) : D(a) ? (Ga(a.enabled) && (b.enabled = a.enabled), Ga(a.requireBase) && (b.requireBase = a.requireBase), Ga(a.rewriteLinks) && (b.rewriteLinks = a.rewriteLinks), this) : b;
    };this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function (d, c, e, f, g) {
      function h(a, b, d) {
        var e = l.url(),
            f = l.$$state;try {
          c.url(a, b, d), l.$$state = c.state();
        } catch (g) {
          throw l.url(e), l.$$state = f, g;
        }
      }function k(a, b) {
        d.$broadcast("$locationChangeSuccess", l.absUrl(), a, l.$$state, b);
      }var l, m;m = c.baseHref();var n = c.url(),
          p;if (b.enabled) {
        if (!m && b.requireBase) throw Gb("nobase");p = n.substring(0, n.indexOf("/", n.indexOf("//") + 2)) + (m || "/");m = e.history ? gc : ld;
      } else p = Ja(n), m = hc;var u = p.substr(0, Ja(p).lastIndexOf("/") + 1);l = new m(p, u, "#" + a);l.$$parseLinkUrl(n, n);l.$$state = c.state();var R = /^\s*(javascript|mailto):/i;f.on("click", function (a) {
        if (b.rewriteLinks && !a.ctrlKey && !a.metaKey && !a.shiftKey && 2 != a.which && 2 != a.button) {
          for (var e = F(a.target); "a" !== wa(e[0]);) {
            if (e[0] === f[0] || !(e = e.parent())[0]) return;
          }var h = e.prop("href"),
              k = e.attr("href") || e.attr("xlink:href");D(h) && "[object SVGAnimatedString]" === h.toString() && (h = Y(h.animVal).href);R.test(h) || !h || e.attr("target") || a.isDefaultPrevented() || !l.$$parseLinkUrl(h, k) || (a.preventDefault(), l.absUrl() != c.url() && (d.$apply(), g.angular["ff-684208-preventDefault"] = !0));
        }
      });jb(l.absUrl()) != jb(n) && c.url(l.absUrl(), !0);var q = !0;c.onUrlChange(function (a, b) {
        y(ka(u, a)) ? g.location.href = a : (d.$evalAsync(function () {
          var c = l.absUrl(),
              e = l.$$state,
              f;a = jb(a);l.$$parse(a);l.$$state = b;f = d.$broadcast("$locationChangeStart", a, c, b, e).defaultPrevented;l.absUrl() === a && (f ? (l.$$parse(c), l.$$state = e, h(c, !1, e)) : (q = !1, k(c, e)));
        }), d.$$phase || d.$digest());
      });d.$watch(function () {
        var a = jb(c.url()),
            b = jb(l.absUrl()),
            f = c.state(),
            g = l.$$replace,
            m = a !== b || l.$$html5 && e.history && f !== l.$$state;if (q || m) q = !1, d.$evalAsync(function () {
          var b = l.absUrl(),
              c = d.$broadcast("$locationChangeStart", b, a, l.$$state, f).defaultPrevented;l.absUrl() === b && (c ? (l.$$parse(a), l.$$state = f) : (m && h(b, g, f === l.$$state ? null : l.$$state), k(a, f)));
        });l.$$replace = !1;
      });return l;
    }];
  }function tf() {
    var a = !0,
        b = this;this.debugEnabled = function (b) {
      return w(b) ? (a = b, this) : a;
    };this.$get = ["$window", function (d) {
      function c(a) {
        a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line));return a;
      }function e(a) {
        var b = d.console || {},
            e = b[a] || b.log || A;a = !1;try {
          a = !!e.apply;
        } catch (k) {}return a ? function () {
          var a = [];q(arguments, function (b) {
            a.push(c(b));
          });
          return e.apply(b, a);
        } : function (a, b) {
          e(a, null == b ? "" : b);
        };
      }return { log: e("log"), info: e("info"), warn: e("warn"), error: e("error"), debug: function () {
          var c = e("debug");return function () {
            a && c.apply(b, arguments);
          };
        }() };
    }];
  }function Sa(a, b) {
    if ("__defineGetter__" === a || "__defineSetter__" === a || "__lookupGetter__" === a || "__lookupSetter__" === a || "__proto__" === a) throw X("isecfld", b);return a;
  }function ig(a) {
    return a + "";
  }function ra(a, b) {
    if (a) {
      if (a.constructor === a) throw X("isecfn", b);if (a.window === a) throw X("isecwindow", b);if (a.children && (a.nodeName || a.prop && a.attr && a.find)) throw X("isecdom", b);if (a === Object) throw X("isecobj", b);
    }return a;
  }function nd(a, b) {
    if (a) {
      if (a.constructor === a) throw X("isecfn", b);if (a === jg || a === kg || a === lg) throw X("isecff", b);
    }
  }function Ib(a, b) {
    if (a && (a === 0 .constructor || a === (!1).constructor || a === "".constructor || a === {}.constructor || a === [].constructor || a === Function.constructor)) throw X("isecaf", b);
  }function mg(a, b) {
    return "undefined" !== typeof a ? a : b;
  }function od(a, b) {
    return "undefined" === typeof a ? b : "undefined" === typeof b ? a : a + b;
  }function V(a, b) {
    var d, c;switch (a.type) {case s.Program:
        d = !0;q(a.body, function (a) {
          V(a.expression, b);d = d && a.expression.constant;
        });a.constant = d;break;case s.Literal:
        a.constant = !0;a.toWatch = [];break;case s.UnaryExpression:
        V(a.argument, b);a.constant = a.argument.constant;a.toWatch = a.argument.toWatch;break;case s.BinaryExpression:
        V(a.left, b);V(a.right, b);a.constant = a.left.constant && a.right.constant;a.toWatch = a.left.toWatch.concat(a.right.toWatch);break;case s.LogicalExpression:
        V(a.left, b);V(a.right, b);a.constant = a.left.constant && a.right.constant;a.toWatch = a.constant ? [] : [a];break;case s.ConditionalExpression:
        V(a.test, b);V(a.alternate, b);V(a.consequent, b);a.constant = a.test.constant && a.alternate.constant && a.consequent.constant;a.toWatch = a.constant ? [] : [a];break;case s.Identifier:
        a.constant = !1;a.toWatch = [a];break;case s.MemberExpression:
        V(a.object, b);a.computed && V(a.property, b);a.constant = a.object.constant && (!a.computed || a.property.constant);a.toWatch = [a];break;case s.CallExpression:
        d = a.filter ? !b(a.callee.name).$stateful : !1;c = [];q(a.arguments, function (a) {
          V(a, b);d = d && a.constant;a.constant || c.push.apply(c, a.toWatch);
        });a.constant = d;a.toWatch = a.filter && !b(a.callee.name).$stateful ? c : [a];break;case s.AssignmentExpression:
        V(a.left, b);V(a.right, b);a.constant = a.left.constant && a.right.constant;a.toWatch = [a];break;case s.ArrayExpression:
        d = !0;c = [];q(a.elements, function (a) {
          V(a, b);d = d && a.constant;a.constant || c.push.apply(c, a.toWatch);
        });a.constant = d;a.toWatch = c;break;case s.ObjectExpression:
        d = !0;c = [];q(a.properties, function (a) {
          V(a.value, b);d = d && a.value.constant && !a.computed;a.value.constant || c.push.apply(c, a.value.toWatch);
        });a.constant = d;a.toWatch = c;break;case s.ThisExpression:
        a.constant = !1;a.toWatch = [];break;case s.LocalsExpression:
        a.constant = !1, a.toWatch = [];}
  }function pd(a) {
    if (1 == a.length) {
      a = a[0].expression;var b = a.toWatch;return 1 !== b.length ? b : b[0] !== a ? b : void 0;
    }
  }function qd(a) {
    return a.type === s.Identifier || a.type === s.MemberExpression;
  }function rd(a) {
    if (1 === a.body.length && qd(a.body[0].expression)) return { type: s.AssignmentExpression,
      left: a.body[0].expression, right: { type: s.NGValueParameter }, operator: "=" };
  }function sd(a) {
    return 0 === a.body.length || 1 === a.body.length && (a.body[0].expression.type === s.Literal || a.body[0].expression.type === s.ArrayExpression || a.body[0].expression.type === s.ObjectExpression);
  }function td(a, b) {
    this.astBuilder = a;this.$filter = b;
  }function ud(a, b) {
    this.astBuilder = a;this.$filter = b;
  }function Jb(a) {
    return "constructor" == a;
  }function ic(a) {
    return z(a.valueOf) ? a.valueOf() : ng.call(a);
  }function uf() {
    var a = U(),
        b = U(),
        d = { "true": !0,
      "false": !1, "null": null, undefined: void 0 },
        c,
        e;this.addLiteral = function (a, b) {
      d[a] = b;
    };this.setIdentifierFns = function (a, b) {
      c = a;e = b;return this;
    };this.$get = ["$filter", function (f) {
      function g(c, d, e) {
        var g, k, H;e = e || J;switch (typeof c === "undefined" ? "undefined" : _typeof(c)) {case "string":
            H = c = c.trim();var E = e ? b : a;g = E[H];if (!g) {
              ":" === c.charAt(0) && ":" === c.charAt(1) && (k = !0, c = c.substring(2));g = e ? r : B;var q = new jc(g);g = new kc(q, f, g).parse(c);g.constant ? g.$$watchDelegate = p : k ? g.$$watchDelegate = g.literal ? n : m : g.inputs && (g.$$watchDelegate = l);e && (g = h(g));E[H] = g;
            }return u(g, d);case "function":
            return u(c, d);default:
            return u(A, d);}
      }function h(a) {
        function b(c, d, e, f) {
          var g = J;J = !0;try {
            return a(c, d, e, f);
          } finally {
            J = g;
          }
        }if (!a) return a;b.$$watchDelegate = a.$$watchDelegate;b.assign = h(a.assign);b.constant = a.constant;b.literal = a.literal;for (var c = 0; a.inputs && c < a.inputs.length; ++c) {
          a.inputs[c] = h(a.inputs[c]);
        }b.inputs = a.inputs;return b;
      }function k(a, b) {
        return null == a || null == b ? a === b : "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && (a = ic(a), "object" === (typeof a === "undefined" ? "undefined" : _typeof(a))) ? !1 : a === b || a !== a && b !== b;
      }function l(a, b, c, d, e) {
        var f = d.inputs,
            g;if (1 === f.length) {
          var h = k,
              f = f[0];return a.$watch(function (a) {
            var b = f(a);k(b, h) || (g = d(a, void 0, void 0, [b]), h = b && ic(b));return g;
          }, b, c, e);
        }for (var l = [], m = [], p = 0, n = f.length; p < n; p++) {
          l[p] = k, m[p] = null;
        }return a.$watch(function (a) {
          for (var b = !1, c = 0, e = f.length; c < e; c++) {
            var h = f[c](a);if (b || (b = !k(h, l[c]))) m[c] = h, l[c] = h && ic(h);
          }b && (g = d(a, void 0, void 0, m));return g;
        }, b, c, e);
      }function m(a, b, c, d) {
        var e, f;return e = a.$watch(function (a) {
          return d(a);
        }, function (a, c, d) {
          f = a;z(b) && b.apply(this, arguments);w(a) && d.$$postDigest(function () {
            w(f) && e();
          });
        }, c);
      }function n(a, b, c, d) {
        function e(a) {
          var b = !0;q(a, function (a) {
            w(a) || (b = !1);
          });return b;
        }var f, g;return f = a.$watch(function (a) {
          return d(a);
        }, function (a, c, d) {
          g = a;z(b) && b.call(this, a, c, d);e(a) && d.$$postDigest(function () {
            e(g) && f();
          });
        }, c);
      }function p(a, b, c, d) {
        var e;return e = a.$watch(function (a) {
          e();return d(a);
        }, b, c);
      }function u(a, b) {
        if (!b) return a;var c = a.$$watchDelegate,
            d = !1,
            c = c !== n && c !== m ? function (c, e, f, g) {
          f = d && g ? g[0] : a(c, e, f, g);return b(f, c, e);
        } : function (c, d, e, f) {
          e = a(c, d, e, f);c = b(e, c, d);return w(e) ? c : e;
        };a.$$watchDelegate && a.$$watchDelegate !== l ? c.$$watchDelegate = a.$$watchDelegate : b.$stateful || (c.$$watchDelegate = l, d = !a.inputs, c.inputs = a.inputs ? a.inputs : [a]);return c;
      }var R = Ba().noUnsafeEval,
          B = { csp: R, expensiveChecks: !1, literals: pa(d), isIdentifierStart: z(c) && c, isIdentifierContinue: z(e) && e },
          r = { csp: R, expensiveChecks: !0, literals: pa(d), isIdentifierStart: z(c) && c, isIdentifierContinue: z(e) && e },
          J = !1;g.$$runningExpensiveChecks = function () {
        return J;
      };return g;
    }];
  }function wf() {
    this.$get = ["$rootScope", "$exceptionHandler", function (a, b) {
      return vd(function (b) {
        a.$evalAsync(b);
      }, b);
    }];
  }function xf() {
    this.$get = ["$browser", "$exceptionHandler", function (a, b) {
      return vd(function (b) {
        a.defer(b);
      }, b);
    }];
  }function vd(a, b) {
    function d() {
      this.$$state = { status: 0 };
    }function c(a, b) {
      return function (c) {
        b.call(a, c);
      };
    }function e(c) {
      !c.processScheduled && c.pending && (c.processScheduled = !0, a(function () {
        var a, d, e;e = c.pending;c.processScheduled = !1;c.pending = void 0;for (var f = 0, g = e.length; f < g; ++f) {
          d = e[f][0];a = e[f][c.status];
          try {
            z(a) ? d.resolve(a(c.value)) : 1 === c.status ? d.resolve(c.value) : d.reject(c.value);
          } catch (h) {
            d.reject(h), b(h);
          }
        }
      }));
    }function f() {
      this.promise = new d();
    }var g = N("$q", TypeError),
        h = function h() {
      var a = new f();a.resolve = c(a, a.resolve);a.reject = c(a, a.reject);a.notify = c(a, a.notify);return a;
    };S(d.prototype, { then: function then(a, b, c) {
        if (y(a) && y(b) && y(c)) return this;var d = new f();this.$$state.pending = this.$$state.pending || [];this.$$state.pending.push([d, a, b, c]);0 < this.$$state.status && e(this.$$state);return d.promise;
      }, "catch": function _catch(a) {
        return this.then(null, a);
      }, "finally": function _finally(a, b) {
        return this.then(function (b) {
          return l(b, !0, a);
        }, function (b) {
          return l(b, !1, a);
        }, b);
      } });S(f.prototype, { resolve: function resolve(a) {
        this.promise.$$state.status || (a === this.promise ? this.$$reject(g("qcycle", a)) : this.$$resolve(a));
      }, $$resolve: function $$resolve(a) {
        function d(a) {
          k || (k = !0, h.$$resolve(a));
        }function f(a) {
          k || (k = !0, h.$$reject(a));
        }var g,
            h = this,
            k = !1;try {
          if (D(a) || z(a)) g = a && a.then;z(g) ? (this.promise.$$state.status = -1, g.call(a, d, f, c(this, this.notify))) : (this.promise.$$state.value = a, this.promise.$$state.status = 1, e(this.promise.$$state));
        } catch (l) {
          f(l), b(l);
        }
      }, reject: function reject(a) {
        this.promise.$$state.status || this.$$reject(a);
      }, $$reject: function $$reject(a) {
        this.promise.$$state.value = a;this.promise.$$state.status = 2;e(this.promise.$$state);
      }, notify: function notify(c) {
        var d = this.promise.$$state.pending;0 >= this.promise.$$state.status && d && d.length && a(function () {
          for (var a, e, f = 0, g = d.length; f < g; f++) {
            e = d[f][0];a = d[f][3];try {
              e.notify(z(a) ? a(c) : c);
            } catch (h) {
              b(h);
            }
          }
        });
      } });var k = function k(a, b) {
      var c = new f();b ? c.resolve(a) : c.reject(a);return c.promise;
    },
        l = function l(a, b, c) {
      var d = null;try {
        z(c) && (d = c());
      } catch (e) {
        return k(e, !1);
      }return d && z(d.then) ? d.then(function () {
        return k(a, b);
      }, function (a) {
        return k(a, !1);
      }) : k(a, b);
    },
        m = function m(a, b, c, d) {
      var e = new f();e.resolve(a);return e.promise.then(b, c, d);
    },
        n = function n(a) {
      if (!z(a)) throw g("norslvr", a);var b = new f();a(function (a) {
        b.resolve(a);
      }, function (a) {
        b.reject(a);
      });return b.promise;
    };n.prototype = d.prototype;n.defer = h;n.reject = function (a) {
      var b = new f();b.reject(a);return b.promise;
    };n.when = m;n.resolve = m;n.all = function (a) {
      var b = new f(),
          c = 0,
          d = L(a) ? [] : {};q(a, function (a, e) {
        c++;m(a).then(function (a) {
          d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d));
        }, function (a) {
          d.hasOwnProperty(e) || b.reject(a);
        });
      });0 === c && b.resolve(d);return b.promise;
    };n.race = function (a) {
      var b = h();q(a, function (a) {
        m(a).then(b.resolve, b.reject);
      });return b.promise;
    };return n;
  }function Gf() {
    this.$get = ["$window", "$timeout", function (a, b) {
      var d = a.requestAnimationFrame || a.webkitRequestAnimationFrame,
          c = a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame,
          e = !!d,
          f = e ? function (a) {
        var b = d(a);return function () {
          c(b);
        };
      } : function (a) {
        var c = b(a, 16.66, !1);return function () {
          b.cancel(c);
        };
      };f.supported = e;return f;
    }];
  }function vf() {
    function a(a) {
      function b() {
        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;this.$$listeners = {};this.$$listenerCount = {};this.$$watchersCount = 0;this.$id = ++pb;this.$$ChildScope = null;
      }b.prototype = a;return b;
    }var b = 10,
        d = N("$rootScope"),
        c = null,
        e = null;this.digestTtl = function (a) {
      arguments.length && (b = a);return b;
    };this.$get = ["$exceptionHandler", "$parse", "$browser", function (f, g, h) {
      function k(a) {
        a.currentScope.$$destroyed = !0;
      }function l(a) {
        9 === Ea && (a.$$childHead && l(a.$$childHead), a.$$nextSibling && l(a.$$nextSibling));a.$parent = a.$$nextSibling = a.$$prevSibling = a.$$childHead = a.$$childTail = a.$root = a.$$watchers = null;
      }function m() {
        this.$id = ++pb;this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;this.$root = this;this.$$destroyed = !1;this.$$listeners = {};this.$$listenerCount = {};this.$$watchersCount = 0;this.$$isolateBindings = null;
      }function n(a) {
        if (J.$$phase) throw d("inprog", J.$$phase);J.$$phase = a;
      }function p(a, b) {
        do {
          a.$$watchersCount += b;
        } while (a = a.$parent);
      }function u(a, b, c) {
        do {
          a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c];
        } while (a = a.$parent);
      }function s() {}function B() {
        for (; t.length;) {
          try {
            t.shift()();
          } catch (a) {
            f(a);
          }
        }e = null;
      }function r() {
        null === e && (e = h.defer(function () {
          J.$apply(B);
        }));
      }m.prototype = { constructor: m, $new: function $new(b, c) {
          var d;c = c || this;b ? (d = new m(), d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = a(this)), d = new this.$$ChildScope());d.$parent = c;d.$$prevSibling = c.$$childTail;c.$$childHead ? (c.$$childTail.$$nextSibling = d, c.$$childTail = d) : c.$$childHead = c.$$childTail = d;(b || c != this) && d.$on("$destroy", k);return d;
        }, $watch: function $watch(a, b, d, e) {
          var f = g(a);if (f.$$watchDelegate) return f.$$watchDelegate(this, b, d, f, a);var h = this,
              k = h.$$watchers,
              l = { fn: b, last: s, get: f, exp: e || a, eq: !!d };c = null;z(b) || (l.fn = A);k || (k = h.$$watchers = []);k.unshift(l);p(this, 1);return function () {
            0 <= Za(k, l) && p(h, -1);c = null;
          };
        }, $watchGroup: function $watchGroup(a, b) {
          function c() {
            h = !1;k ? (k = !1, b(e, e, g)) : b(e, d, g);
          }var d = Array(a.length),
              e = Array(a.length),
              f = [],
              g = this,
              h = !1,
              k = !0;if (!a.length) {
            var l = !0;g.$evalAsync(function () {
              l && b(e, e, g);
            });return function () {
              l = !1;
            };
          }if (1 === a.length) return this.$watch(a[0], function (a, c, f) {
            e[0] = a;d[0] = c;b(e, a === c ? e : d, f);
          });q(a, function (a, b) {
            var k = g.$watch(a, function (a, f) {
              e[b] = a;d[b] = f;h || (h = !0, g.$evalAsync(c));
            });f.push(k);
          });return function () {
            for (; f.length;) {
              f.shift()();
            }
          };
        },
        $watchCollection: function $watchCollection(a, b) {
          function c(a) {
            e = a;var b, d, g, h;if (!y(e)) {
              if (D(e)) {
                if (ta(e)) for (f !== n && (f = n, u = f.length = 0, l++), a = e.length, u !== a && (l++, f.length = u = a), b = 0; b < a; b++) {
                  h = f[b], g = e[b], d = h !== h && g !== g, d || h === g || (l++, f[b] = g);
                } else {
                  f !== p && (f = p = {}, u = 0, l++);a = 0;for (b in e) {
                    ua.call(e, b) && (a++, g = e[b], h = f[b], b in f ? (d = h !== h && g !== g, d || h === g || (l++, f[b] = g)) : (u++, f[b] = g, l++));
                  }if (u > a) for (b in l++, f) {
                    ua.call(e, b) || (u--, delete f[b]);
                  }
                }
              } else f !== e && (f = e, l++);return l;
            }
          }c.$stateful = !0;var d = this,
              e,
              f,
              h,
              k = 1 < b.length,
              l = 0,
              m = g(a, c),
              n = [],
              p = {},
              r = !0,
              u = 0;return this.$watch(m, function () {
            r ? (r = !1, b(e, e, d)) : b(e, h, d);if (k) if (D(e)) {
              if (ta(e)) {
                h = Array(e.length);for (var a = 0; a < e.length; a++) {
                  h[a] = e[a];
                }
              } else for (a in h = {}, e) {
                ua.call(e, a) && (h[a] = e[a]);
              }
            } else h = e;
          });
        }, $digest: function $digest() {
          var a,
              g,
              k,
              l,
              m,
              p,
              u,
              r,
              q = b,
              t,
              y = [],
              A,
              C;n("$digest");h.$$checkUrlChange();this === J && null !== e && (h.defer.cancel(e), B());c = null;do {
            r = !1;t = this;for (p = 0; p < v.length; p++) {
              try {
                C = v[p], C.scope.$eval(C.expression, C.locals);
              } catch (F) {
                f(F);
              }c = null;
            }v.length = 0;a: do {
              if (p = t.$$watchers) for (u = p.length; u--;) {
                try {
                  if (a = p[u]) if (m = a.get, (g = m(t)) !== (k = a.last) && !(a.eq ? na(g, k) : "number" === typeof g && "number" === typeof k && isNaN(g) && isNaN(k))) r = !0, c = a, a.last = a.eq ? pa(g, null) : g, l = a.fn, l(g, k === s ? g : k, t), 5 > q && (A = 4 - q, y[A] || (y[A] = []), y[A].push({ msg: z(a.exp) ? "fn: " + (a.exp.name || a.exp.toString()) : a.exp, newVal: g, oldVal: k }));else if (a === c) {
                    r = !1;break a;
                  }
                } catch (G) {
                  f(G);
                }
              }if (!(p = t.$$watchersCount && t.$$childHead || t !== this && t.$$nextSibling)) for (; t !== this && !(p = t.$$nextSibling);) {
                t = t.$parent;
              }
            } while (t = p);if ((r || v.length) && !q--) throw J.$$phase = null, d("infdig", b, y);
          } while (r || v.length);for (J.$$phase = null; K < w.length;) {
            try {
              w[K++]();
            } catch (D) {
              f(D);
            }
          }w.length = K = 0;
        }, $destroy: function $destroy() {
          if (!this.$$destroyed) {
            var a = this.$parent;this.$broadcast("$destroy");this.$$destroyed = !0;this === J && h.$$applicationDestroyed();p(this, -this.$$watchersCount);for (var b in this.$$listenerCount) {
              u(this, this.$$listenerCount[b], b);
            }a && a.$$childHead == this && (a.$$childHead = this.$$nextSibling);a && a.$$childTail == this && (a.$$childTail = this.$$prevSibling);this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling);this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling);this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = A;this.$on = this.$watch = this.$watchGroup = function () {
              return A;
            };this.$$listeners = {};this.$$nextSibling = null;l(this);
          }
        }, $eval: function $eval(a, b) {
          return g(a)(this, b);
        }, $evalAsync: function $evalAsync(a, b) {
          J.$$phase || v.length || h.defer(function () {
            v.length && J.$digest();
          });v.push({ scope: this, expression: g(a), locals: b });
        }, $$postDigest: function $$postDigest(a) {
          w.push(a);
        },
        $apply: function $apply(a) {
          try {
            n("$apply");try {
              return this.$eval(a);
            } finally {
              J.$$phase = null;
            }
          } catch (b) {
            f(b);
          } finally {
            try {
              J.$digest();
            } catch (c) {
              throw f(c), c;
            }
          }
        }, $applyAsync: function $applyAsync(a) {
          function b() {
            c.$eval(a);
          }var c = this;a && t.push(b);a = g(a);r();
        }, $on: function $on(a, b) {
          var c = this.$$listeners[a];c || (this.$$listeners[a] = c = []);c.push(b);var d = this;do {
            d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++;
          } while (d = d.$parent);var e = this;return function () {
            var d = c.indexOf(b);-1 !== d && (c[d] = null, u(e, 1, a));
          };
        }, $emit: function $emit(a, b) {
          var c = [],
              d,
              e = this,
              g = !1,
              h = { name: a, targetScope: e, stopPropagation: function stopPropagation() {
              g = !0;
            }, preventDefault: function preventDefault() {
              h.defaultPrevented = !0;
            }, defaultPrevented: !1 },
              k = $a([h], arguments, 1),
              l,
              m;do {
            d = e.$$listeners[a] || c;h.currentScope = e;l = 0;for (m = d.length; l < m; l++) {
              if (d[l]) try {
                d[l].apply(null, k);
              } catch (n) {
                f(n);
              } else d.splice(l, 1), l--, m--;
            }if (g) return h.currentScope = null, h;e = e.$parent;
          } while (e);h.currentScope = null;return h;
        }, $broadcast: function $broadcast(a, b) {
          var c = this,
              d = this,
              e = { name: a, targetScope: this, preventDefault: function preventDefault() {
              e.defaultPrevented = !0;
            }, defaultPrevented: !1 };if (!this.$$listenerCount[a]) return e;for (var g = $a([e], arguments, 1), h, k; c = d;) {
            e.currentScope = c;d = c.$$listeners[a] || [];h = 0;for (k = d.length; h < k; h++) {
              if (d[h]) try {
                d[h].apply(null, g);
              } catch (l) {
                f(l);
              } else d.splice(h, 1), h--, k--;
            }if (!(d = c.$$listenerCount[a] && c.$$childHead || c !== this && c.$$nextSibling)) for (; c !== this && !(d = c.$$nextSibling);) {
              c = c.$parent;
            }
          }e.currentScope = null;return e;
        } };var J = new m(),
          v = J.$$asyncQueue = [],
          w = J.$$postDigestQueue = [],
          t = J.$$applyAsyncQueue = [],
          K = 0;return J;
    }];
  }function ne() {
    var a = /^\s*(https?|ftp|mailto|tel|file):/,
        b = /^\s*((https?|ftp|file|blob):|data:image\/)/;this.aHrefSanitizationWhitelist = function (b) {
      return w(b) ? (a = b, this) : a;
    };this.imgSrcSanitizationWhitelist = function (a) {
      return w(a) ? (b = a, this) : b;
    };this.$get = function () {
      return function (d, c) {
        var e = c ? b : a,
            f;f = Y(d).href;return "" === f || f.match(e) ? d : "unsafe:" + f;
      };
    };
  }function og(a) {
    if ("self" === a) return a;if (G(a)) {
      if (-1 < a.indexOf("***")) throw sa("iwcard", a);a = wd(a).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*");return new RegExp("^" + a + "$");
    }if (Wa(a)) return new RegExp("^" + a.source + "$");throw sa("imatcher");
  }function xd(a) {
    var b = [];w(a) && q(a, function (a) {
      b.push(og(a));
    });return b;
  }function zf() {
    this.SCE_CONTEXTS = la;var a = ["self"],
        b = [];this.resourceUrlWhitelist = function (b) {
      arguments.length && (a = xd(b));return a;
    };this.resourceUrlBlacklist = function (a) {
      arguments.length && (b = xd(a));return b;
    };this.$get = ["$injector", function (d) {
      function c(a, b) {
        return "self" === a ? id(b) : !!a.exec(b.href);
      }function e(a) {
        var b = function b(a) {
          this.$$unwrapTrustedValue = function () {
            return a;
          };
        };a && (b.prototype = new a());b.prototype.valueOf = function () {
          return this.$$unwrapTrustedValue();
        };b.prototype.toString = function () {
          return this.$$unwrapTrustedValue().toString();
        };return b;
      }var f = function f(a) {
        throw sa("unsafe");
      };d.has("$sanitize") && (f = d.get("$sanitize"));var g = e(),
          h = {};h[la.HTML] = e(g);h[la.CSS] = e(g);h[la.URL] = e(g);h[la.JS] = e(g);h[la.RESOURCE_URL] = e(h[la.URL]);return { trustAs: function trustAs(a, b) {
          var c = h.hasOwnProperty(a) ? h[a] : null;if (!c) throw sa("icontext", a, b);if (null === b || y(b) || "" === b) return b;if ("string" !== typeof b) throw sa("itype", a);return new c(b);
        }, getTrusted: function getTrusted(d, e) {
          if (null === e || y(e) || "" === e) return e;var g = h.hasOwnProperty(d) ? h[d] : null;if (g && e instanceof g) return e.$$unwrapTrustedValue();if (d === la.RESOURCE_URL) {
            var g = Y(e.toString()),
                n,
                p,
                u = !1;n = 0;for (p = a.length; n < p; n++) {
              if (c(a[n], g)) {
                u = !0;break;
              }
            }if (u) for (n = 0, p = b.length; n < p; n++) {
              if (c(b[n], g)) {
                u = !1;break;
              }
            }if (u) return e;throw sa("insecurl", e.toString());
          }if (d === la.HTML) return f(e);throw sa("unsafe");
        }, valueOf: function valueOf(a) {
          return a instanceof g ? a.$$unwrapTrustedValue() : a;
        } };
    }];
  }function yf() {
    var a = !0;this.enabled = function (b) {
      arguments.length && (a = !!b);return a;
    };this.$get = ["$parse", "$sceDelegate", function (b, d) {
      if (a && 8 > Ea) throw sa("iequirks");var c = ia(la);c.isEnabled = function () {
        return a;
      };c.trustAs = d.trustAs;c.getTrusted = d.getTrusted;c.valueOf = d.valueOf;a || (c.trustAs = c.getTrusted = function (a, b) {
        return b;
      }, c.valueOf = Xa);c.parseAs = function (a, d) {
        var e = b(d);return e.literal && e.constant ? e : b(d, function (b) {
          return c.getTrusted(a, b);
        });
      };var e = c.parseAs,
          f = c.getTrusted,
          g = c.trustAs;q(la, function (a, b) {
        var d = Q(b);c[db("parse_as_" + d)] = function (b) {
          return e(a, b);
        };c[db("get_trusted_" + d)] = function (b) {
          return f(a, b);
        };c[db("trust_as_" + d)] = function (b) {
          return g(a, b);
        };
      });return c;
    }];
  }function Af() {
    this.$get = ["$window", "$document", function (a, b) {
      var d = {},
          c = !(a.chrome && a.chrome.app && a.chrome.app.runtime) && a.history && a.history.pushState,
          e = Z((/android (\d+)/.exec(Q((a.navigator || {}).userAgent)) || [])[1]),
          f = /Boxee/i.test((a.navigator || {}).userAgent),
          g = b[0] || {},
          h,
          k = /^(Moz|webkit|ms)(?=[A-Z])/,
          l = g.body && g.body.style,
          m = !1,
          n = !1;if (l) {
        for (var p in l) {
          if (m = k.exec(p)) {
            h = m[0];h = h[0].toUpperCase() + h.substr(1);break;
          }
        }h || (h = "WebkitOpacity" in l && "webkit");m = !!("transition" in l || h + "Transition" in l);n = !!("animation" in l || h + "Animation" in l);!e || m && n || (m = G(l.webkitTransition), n = G(l.webkitAnimation));
      }return { history: !(!c || 4 > e || f), hasEvent: function hasEvent(a) {
          if ("input" === a && 11 >= Ea) return !1;if (y(d[a])) {
            var b = g.createElement("div");d[a] = "on" + a in b;
          }return d[a];
        }, csp: Ba(), vendorPrefix: h, transitions: m, animations: n, android: e };
    }];
  }
  function Cf() {
    var a;this.httpOptions = function (b) {
      return b ? (a = b, this) : a;
    };this.$get = ["$templateCache", "$http", "$q", "$sce", function (b, d, c, e) {
      function f(g, h) {
        f.totalPendingRequests++;if (!G(g) || y(b.get(g))) g = e.getTrustedResourceUrl(g);var k = d.defaults && d.defaults.transformResponse;L(k) ? k = k.filter(function (a) {
          return a !== dc;
        }) : k === dc && (k = null);return d.get(g, S({ cache: b, transformResponse: k }, a))["finally"](function () {
          f.totalPendingRequests--;
        }).then(function (a) {
          b.put(g, a.data);return a.data;
        }, function (a) {
          if (!h) throw pg("tpload", g, a.status, a.statusText);return c.reject(a);
        });
      }f.totalPendingRequests = 0;return f;
    }];
  }function Df() {
    this.$get = ["$rootScope", "$browser", "$location", function (a, b, d) {
      return { findBindings: function findBindings(a, b, d) {
          a = a.getElementsByClassName("ng-binding");var g = [];q(a, function (a) {
            var c = ca.element(a).data("$binding");c && q(c, function (c) {
              d ? new RegExp("(^|\\s)" + wd(b) + "(\\s|\\||$)").test(c) && g.push(a) : -1 != c.indexOf(b) && g.push(a);
            });
          });return g;
        }, findModels: function findModels(a, b, d) {
          for (var g = ["ng-", "data-ng-", "ng\\:"], h = 0; h < g.length; ++h) {
            var k = a.querySelectorAll("[" + g[h] + "model" + (d ? "=" : "*=") + '"' + b + '"]');if (k.length) return k;
          }
        }, getLocation: function getLocation() {
          return d.url();
        }, setLocation: function setLocation(b) {
          b !== d.url() && (d.url(b), a.$digest());
        }, whenStable: function whenStable(a) {
          b.notifyWhenNoOutstandingRequests(a);
        } };
    }];
  }function Ef() {
    this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function (a, b, d, c, e) {
      function f(f, k, l) {
        z(f) || (l = k, k = f, f = A);var m = va.call(arguments, 3),
            n = w(l) && !l,
            p = (n ? c : d).defer(),
            u = p.promise,
            q;q = b.defer(function () {
          try {
            p.resolve(f.apply(null, m));
          } catch (b) {
            p.reject(b), e(b);
          } finally {
            delete g[u.$$timeoutId];
          }n || a.$apply();
        }, k);u.$$timeoutId = q;g[q] = p;return u;
      }var g = {};f.cancel = function (a) {
        return a && a.$$timeoutId in g ? (g[a.$$timeoutId].reject("canceled"), delete g[a.$$timeoutId], b.defer.cancel(a.$$timeoutId)) : !1;
      };return f;
    }];
  }function Y(a) {
    Ea && ($.setAttribute("href", a), a = $.href);$.setAttribute("href", a);return { href: $.href, protocol: $.protocol ? $.protocol.replace(/:$/, "") : "", host: $.host, search: $.search ? $.search.replace(/^\?/, "") : "", hash: $.hash ? $.hash.replace(/^#/, "") : "", hostname: $.hostname, port: $.port, pathname: "/" === $.pathname.charAt(0) ? $.pathname : "/" + $.pathname };
  }function id(a) {
    a = G(a) ? Y(a) : a;return a.protocol === yd.protocol && a.host === yd.host;
  }function Ff() {
    this.$get = ha(C);
  }function zd(a) {
    function b(a) {
      try {
        return decodeURIComponent(a);
      } catch (b) {
        return a;
      }
    }var d = a[0] || {},
        c = {},
        e = "";return function () {
      var a, g, h, k, l;a = d.cookie || "";if (a !== e) for (e = a, a = e.split("; "), c = {}, h = 0; h < a.length; h++) {
        g = a[h], k = g.indexOf("="), 0 < k && (l = b(g.substring(0, k)), y(c[l]) && (c[l] = b(g.substring(k + 1))));
      }return c;
    };
  }function Jf() {
    this.$get = zd;
  }function Mc(a) {
    function b(d, c) {
      if (D(d)) {
        var e = {};q(d, function (a, c) {
          e[c] = b(c, a);
        });return e;
      }return a.factory(d + "Filter", c);
    }this.register = b;this.$get = ["$injector", function (a) {
      return function (b) {
        return a.get(b + "Filter");
      };
    }];b("currency", Ad);b("date", Bd);b("filter", qg);b("json", rg);b("limitTo", sg);b("lowercase", tg);b("number", Cd);b("orderBy", Dd);b("uppercase", ug);
  }function qg() {
    return function (a, b, d, c) {
      if (!ta(a)) {
        if (null == a) return a;throw N("filter")("notarray", a);
      }c = c || "$";var e;switch (lc(b)) {case "function":
          break;case "boolean":case "null":case "number":case "string":
          e = !0;case "object":
          b = vg(b, d, c, e);break;default:
          return a;}return Array.prototype.filter.call(a, b);
    };
  }function vg(a, b, d, c) {
    var e = D(a) && d in a;!0 === b ? b = na : z(b) || (b = function b(a, _b) {
      if (y(a)) return !1;if (null === a || null === _b) return a === _b;if (D(_b) || D(a) && !vc(a)) return !1;a = Q("" + a);_b = Q("" + _b);return -1 !== a.indexOf(_b);
    });return function (f) {
      return e && !D(f) ? La(f, a[d], b, d, !1) : La(f, a, b, d, c);
    };
  }function La(a, b, d, c, e, f) {
    var g = lc(a),
        h = lc(b);if ("string" === h && "!" === b.charAt(0)) return !La(a, b.substring(1), d, c, e);if (L(a)) return a.some(function (a) {
      return La(a, b, d, c, e);
    });switch (g) {case "object":
        var k;if (e) {
          for (k in a) {
            if ("$" !== k.charAt(0) && La(a[k], b, d, c, !0)) return !0;
          }return f ? !1 : La(a, b, d, c, !1);
        }if ("object" === h) {
          for (k in b) {
            if (f = b[k], !z(f) && !y(f) && (g = k === c, !La(g ? a : a[k], f, d, c, g, g))) return !1;
          }return !0;
        }return d(a, b);case "function":
        return !1;default:
        return d(a, b);}
  }function lc(a) {
    return null === a ? "null" : typeof a === "undefined" ? "undefined" : _typeof(a);
  }function Ad(a) {
    var b = a.NUMBER_FORMATS;return function (a, c, e) {
      y(c) && (c = b.CURRENCY_SYM);y(e) && (e = b.PATTERNS[1].maxFrac);return null == a ? a : Ed(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, e).replace(/\u00A4/g, c);
    };
  }function Cd(a) {
    var b = a.NUMBER_FORMATS;return function (a, c) {
      return null == a ? a : Ed(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c);
    };
  }function wg(a) {
    var b = 0,
        d,
        c,
        e,
        f,
        g;-1 < (c = a.indexOf(Fd)) && (a = a.replace(Fd, ""));0 < (e = a.search(/e/i)) ? (0 > c && (c = e), c += +a.slice(e + 1), a = a.substring(0, e)) : 0 > c && (c = a.length);for (e = 0; a.charAt(e) == mc; e++) {}
    if (e == (g = a.length)) d = [0], c = 1;else {
      for (g--; a.charAt(g) == mc;) {
        g--;
      }c -= e;d = [];for (f = 0; e <= g; e++, f++) {
        d[f] = +a.charAt(e);
      }
    }c > Gd && (d = d.splice(0, Gd - 1), b = c - 1, c = 1);return { d: d, e: b, i: c };
  }function xg(a, b, d, c) {
    var e = a.d,
        f = e.length - a.i;b = y(b) ? Math.min(Math.max(d, f), c) : +b;d = b + a.i;c = e[d];if (0 < d) {
      e.splice(Math.max(a.i, d));for (var g = d; g < e.length; g++) {
        e[g] = 0;
      }
    } else for (f = Math.max(0, f), a.i = 1, e.length = Math.max(1, d = b + 1), e[0] = 0, g = 1; g < d; g++) {
      e[g] = 0;
    }if (5 <= c) if (0 > d - 1) {
      for (c = 0; c > d; c--) {
        e.unshift(0), a.i++;
      }e.unshift(1);a.i++;
    } else e[d - 1]++;
    for (; f < Math.max(0, b); f++) {
      e.push(0);
    }if (b = e.reduceRight(function (a, b, c, d) {
      b += a;d[c] = b % 10;return Math.floor(b / 10);
    }, 0)) e.unshift(b), a.i++;
  }function Ed(a, b, d, c, e) {
    if (!G(a) && !T(a) || isNaN(a)) return "";var f = !isFinite(a),
        g = !1,
        h = Math.abs(a) + "",
        k = "";if (f) k = "\u221E";else {
      g = wg(h);xg(g, e, b.minFrac, b.maxFrac);k = g.d;h = g.i;e = g.e;f = [];for (g = k.reduce(function (a, b) {
        return a && !b;
      }, !0); 0 > h;) {
        k.unshift(0), h++;
      }0 < h ? f = k.splice(h, k.length) : (f = k, k = [0]);h = [];for (k.length >= b.lgSize && h.unshift(k.splice(-b.lgSize, k.length).join("")); k.length > b.gSize;) {
        h.unshift(k.splice(-b.gSize, k.length).join(""));
      }k.length && h.unshift(k.join(""));k = h.join(d);f.length && (k += c + f.join(""));e && (k += "e+" + e);
    }return 0 > a && !g ? b.negPre + k + b.negSuf : b.posPre + k + b.posSuf;
  }function Kb(a, b, d, c) {
    var e = "";if (0 > a || c && 0 >= a) c ? a = -a + 1 : (a = -a, e = "-");for (a = "" + a; a.length < b;) {
      a = mc + a;
    }d && (a = a.substr(a.length - b));return e + a;
  }function ba(a, b, d, c, e) {
    d = d || 0;return function (f) {
      f = f["get" + a]();if (0 < d || f > -d) f += d;0 === f && -12 == d && (f = 12);return Kb(f, b, c, e);
    };
  }function kb(a, b, d) {
    return function (c, e) {
      var f = c["get" + a](),
          g = ub((d ? "STANDALONE" : "") + (b ? "SHORT" : "") + a);return e[g][f];
    };
  }function Hd(a) {
    var b = new Date(a, 0, 1).getDay();return new Date(a, 0, (4 >= b ? 5 : 12) - b);
  }function Id(a) {
    return function (b) {
      var d = Hd(b.getFullYear());b = +new Date(b.getFullYear(), b.getMonth(), b.getDate() + (4 - b.getDay())) - +d;b = 1 + Math.round(b / 6048E5);return Kb(b, a);
    };
  }function nc(a, b) {
    return 0 >= a.getFullYear() ? b.ERAS[0] : b.ERAS[1];
  }function Bd(a) {
    function b(a) {
      var b;if (b = a.match(d)) {
        a = new Date(0);var f = 0,
            g = 0,
            h = b[8] ? a.setUTCFullYear : a.setFullYear,
            k = b[8] ? a.setUTCHours : a.setHours;b[9] && (f = Z(b[9] + b[10]), g = Z(b[9] + b[11]));h.call(a, Z(b[1]), Z(b[2]) - 1, Z(b[3]));f = Z(b[4] || 0) - f;g = Z(b[5] || 0) - g;h = Z(b[6] || 0);b = Math.round(1E3 * parseFloat("0." + (b[7] || 0)));k.call(a, f, g, h, b);
      }return a;
    }var d = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function (c, d, f) {
      var g = "",
          h = [],
          k,
          l;d = d || "mediumDate";d = a.DATETIME_FORMATS[d] || d;G(c) && (c = yg.test(c) ? Z(c) : b(c));T(c) && (c = new Date(c));if (!da(c) || !isFinite(c.getTime())) return c;
      for (; d;) {
        (l = zg.exec(d)) ? (h = $a(h, l, 1), d = h.pop()) : (h.push(d), d = null);
      }var m = c.getTimezoneOffset();f && (m = yc(f, m), c = Sb(c, f, !0));q(h, function (b) {
        k = Ag[b];g += k ? k(c, a.DATETIME_FORMATS, m) : "''" === b ? "'" : b.replace(/(^'|'$)/g, "").replace(/''/g, "'");
      });return g;
    };
  }function rg() {
    return function (a, b) {
      y(b) && (b = 2);return bb(a, b);
    };
  }function sg() {
    return function (a, b, d) {
      b = Infinity === Math.abs(Number(b)) ? Number(b) : Z(b);if (isNaN(b)) return a;T(a) && (a = a.toString());if (!ta(a)) return a;d = !d || isNaN(d) ? 0 : Z(d);d = 0 > d ? Math.max(0, a.length + d) : d;return 0 <= b ? oc(a, d, d + b) : 0 === d ? oc(a, b, a.length) : oc(a, Math.max(0, d + b), d);
    };
  }function oc(a, b, d) {
    return G(a) ? a.slice(b, d) : va.call(a, b, d);
  }function Dd(a) {
    function b(b) {
      return b.map(function (b) {
        var c = 1,
            d = Xa;if (z(b)) d = b;else if (G(b)) {
          if ("+" == b.charAt(0) || "-" == b.charAt(0)) c = "-" == b.charAt(0) ? -1 : 1, b = b.substring(1);if ("" !== b && (d = a(b), d.constant)) var e = d(),
              d = function d(a) {
            return a[e];
          };
        }return { get: d, descending: c };
      });
    }function d(a) {
      switch (typeof a === "undefined" ? "undefined" : _typeof(a)) {case "number":case "boolean":case "string":
          return !0;default:
          return !1;}
    }
    function c(a, b) {
      var c = 0,
          d = a.type,
          k = b.type;if (d === k) {
        var k = a.value,
            l = b.value;"string" === d ? (k = k.toLowerCase(), l = l.toLowerCase()) : "object" === d && (D(k) && (k = a.index), D(l) && (l = b.index));k !== l && (c = k < l ? -1 : 1);
      } else c = d < k ? -1 : 1;return c;
    }return function (a, f, g, h) {
      if (null == a) return a;if (!ta(a)) throw N("orderBy")("notarray", a);L(f) || (f = [f]);0 === f.length && (f = ["+"]);var k = b(f),
          l = g ? -1 : 1,
          m = z(h) ? h : c;a = Array.prototype.map.call(a, function (a, b) {
        return { value: a, tieBreaker: { value: b, type: "number", index: b }, predicateValues: k.map(function (c) {
            var e = c.get(a);c = typeof e === "undefined" ? "undefined" : _typeof(e);if (null === e) c = "string", e = "null";else if ("object" === c) a: {
              if (z(e.valueOf) && (e = e.valueOf(), d(e))) break a;vc(e) && (e = e.toString(), d(e));
            }return { value: e, type: c, index: b };
          }) };
      });a.sort(function (a, b) {
        for (var c = 0, d = k.length; c < d; c++) {
          var e = m(a.predicateValues[c], b.predicateValues[c]);if (e) return e * k[c].descending * l;
        }return m(a.tieBreaker, b.tieBreaker) * l;
      });return a = a.map(function (a) {
        return a.value;
      });
    };
  }function Ta(a) {
    z(a) && (a = { link: a });a.restrict = a.restrict || "AC";return ha(a);
  }function Jd(a, b, d, c, e) {
    var f = this,
        g = [];f.$error = {};f.$$success = {};f.$pending = void 0;f.$name = e(b.name || b.ngForm || "")(d);f.$dirty = !1;f.$pristine = !0;f.$valid = !0;f.$invalid = !1;f.$submitted = !1;f.$$parentForm = Lb;f.$rollbackViewValue = function () {
      q(g, function (a) {
        a.$rollbackViewValue();
      });
    };f.$commitViewValue = function () {
      q(g, function (a) {
        a.$commitViewValue();
      });
    };f.$addControl = function (a) {
      Qa(a.$name, "input");g.push(a);a.$name && (f[a.$name] = a);a.$$parentForm = f;
    };f.$$renameControl = function (a, b) {
      var c = a.$name;f[c] === a && delete f[c];f[b] = a;a.$name = b;
    };f.$removeControl = function (a) {
      a.$name && f[a.$name] === a && delete f[a.$name];q(f.$pending, function (b, c) {
        f.$setValidity(c, null, a);
      });q(f.$error, function (b, c) {
        f.$setValidity(c, null, a);
      });q(f.$$success, function (b, c) {
        f.$setValidity(c, null, a);
      });Za(g, a);a.$$parentForm = Lb;
    };Kd({ ctrl: this, $element: a, set: function set(a, b, c) {
        var d = a[b];d ? -1 === d.indexOf(c) && d.push(c) : a[b] = [c];
      }, unset: function unset(a, b, c) {
        var d = a[b];d && (Za(d, c), 0 === d.length && delete a[b]);
      }, $animate: c });f.$setDirty = function () {
      c.removeClass(a, Ua);c.addClass(a, Mb);f.$dirty = !0;f.$pristine = !1;f.$$parentForm.$setDirty();
    };f.$setPristine = function () {
      c.setClass(a, Ua, Mb + " ng-submitted");f.$dirty = !1;f.$pristine = !0;f.$submitted = !1;q(g, function (a) {
        a.$setPristine();
      });
    };f.$setUntouched = function () {
      q(g, function (a) {
        a.$setUntouched();
      });
    };f.$setSubmitted = function () {
      c.addClass(a, "ng-submitted");f.$submitted = !0;f.$$parentForm.$setSubmitted();
    };
  }function pc(a) {
    a.$formatters.push(function (b) {
      return a.$isEmpty(b) ? b : b.toString();
    });
  }function lb(a, b, d, c, e, f) {
    var g = Q(b[0].type);if (!e.android) {
      var h = !1;b.on("compositionstart", function () {
        h = !0;
      });b.on("compositionend", function () {
        h = !1;l();
      });
    }var k,
        l = function l(a) {
      k && (f.defer.cancel(k), k = null);if (!h) {
        var e = b.val();a = a && a.type;"password" === g || d.ngTrim && "false" === d.ngTrim || (e = W(e));(c.$viewValue !== e || "" === e && c.$$hasNativeValidators) && c.$setViewValue(e, a);
      }
    };if (e.hasEvent("input")) b.on("input", l);else {
      var m = function m(a, b, c) {
        k || (k = f.defer(function () {
          k = null;b && b.value === c || l(a);
        }));
      };b.on("keydown", function (a) {
        var b = a.keyCode;91 === b || 15 < b && 19 > b || 37 <= b && 40 >= b || m(a, this, this.value);
      });if (e.hasEvent("paste")) b.on("paste cut", m);
    }b.on("change", l);if (Ld[g] && c.$$hasNativeValidators && g === d.type) b.on("keydown wheel mousedown", function (a) {
      if (!k) {
        var b = this.validity,
            c = b.badInput,
            d = b.typeMismatch;k = f.defer(function () {
          k = null;b.badInput === c && b.typeMismatch === d || l(a);
        });
      }
    });c.$render = function () {
      var a = c.$isEmpty(c.$viewValue) ? "" : c.$viewValue;b.val() !== a && b.val(a);
    };
  }function Nb(a, b) {
    return function (d, c) {
      var e, f;if (da(d)) return d;if (G(d)) {
        '"' == d.charAt(0) && '"' == d.charAt(d.length - 1) && (d = d.substring(1, d.length - 1));if (Bg.test(d)) return new Date(d);a.lastIndex = 0;if (e = a.exec(d)) return e.shift(), f = c ? { yyyy: c.getFullYear(), MM: c.getMonth() + 1, dd: c.getDate(), HH: c.getHours(), mm: c.getMinutes(), ss: c.getSeconds(), sss: c.getMilliseconds() / 1E3 } : { yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0 }, q(e, function (a, c) {
          c < b.length && (f[b[c]] = +a);
        }), new Date(f.yyyy, f.MM - 1, f.dd, f.HH, f.mm, f.ss || 0, 1E3 * f.sss || 0);
      }return NaN;
    };
  }function mb(a, b, d, c) {
    return function (e, f, g, h, k, l, m) {
      function n(a) {
        return a && !(a.getTime && a.getTime() !== a.getTime());
      }function p(a) {
        return w(a) && !da(a) ? d(a) || void 0 : a;
      }Md(e, f, g, h);lb(e, f, g, h, k, l);var u = h && h.$options && h.$options.timezone,
          q;h.$$parserName = a;h.$parsers.push(function (a) {
        if (h.$isEmpty(a)) return null;if (b.test(a)) return a = d(a, q), u && (a = Sb(a, u)), a;
      });h.$formatters.push(function (a) {
        if (a && !da(a)) throw nb("datefmt", a);if (n(a)) return (q = a) && u && (q = Sb(q, u, !0)), m("date")(a, c, u);q = null;return "";
      });if (w(g.min) || g.ngMin) {
        var s;h.$validators.min = function (a) {
          return !n(a) || y(s) || d(a) >= s;
        };g.$observe("min", function (a) {
          s = p(a);h.$validate();
        });
      }if (w(g.max) || g.ngMax) {
        var r;h.$validators.max = function (a) {
          return !n(a) || y(r) || d(a) <= r;
        };g.$observe("max", function (a) {
          r = p(a);h.$validate();
        });
      }
    };
  }function Md(a, b, d, c) {
    (c.$$hasNativeValidators = D(b[0].validity)) && c.$parsers.push(function (a) {
      var c = b.prop("validity") || {};return c.badInput || c.typeMismatch ? void 0 : a;
    });
  }function Nd(a, b, d, c, e) {
    if (w(c)) {
      a = a(c);if (!a.constant) throw nb("constexpr", d, c);return a(b);
    }return e;
  }function qc(a, b) {
    a = "ngClass" + a;return ["$animate", function (d) {
      function c(a, b) {
        var c = [],
            d = 0;a: for (; d < a.length; d++) {
          for (var e = a[d], m = 0; m < b.length; m++) {
            if (e == b[m]) continue a;
          }c.push(e);
        }return c;
      }function e(a) {
        var b = [];return L(a) ? (q(a, function (a) {
          b = b.concat(e(a));
        }), b) : G(a) ? a.split(" ") : D(a) ? (q(a, function (a, c) {
          a && (b = b.concat(c.split(" ")));
        }), b) : a;
      }return { restrict: "AC", link: function link(f, g, h) {
          function k(a) {
            a = l(a, 1);h.$addClass(a);
          }function l(a, b) {
            var c = g.data("$classCounts") || U(),
                d = [];q(a, function (a) {
              if (0 < b || c[a]) c[a] = (c[a] || 0) + b, c[a] === +(0 < b) && d.push(a);
            });g.data("$classCounts", c);return d.join(" ");
          }
          function m(a, b) {
            var e = c(b, a),
                f = c(a, b),
                e = l(e, 1),
                f = l(f, -1);e && e.length && d.addClass(g, e);f && f.length && d.removeClass(g, f);
          }function n(a) {
            if (!0 === b || (f.$index & 1) === b) {
              var c = e(a || []);if (!p) k(c);else if (!na(a, p)) {
                var d = e(p);m(d, c);
              }
            }p = L(a) ? a.map(function (a) {
              return ia(a);
            }) : ia(a);
          }var p;f.$watch(h[a], n, !0);h.$observe("class", function (b) {
            n(f.$eval(h[a]));
          });"ngClass" !== a && f.$watch("$index", function (c, d) {
            var g = c & 1;if (g !== (d & 1)) {
              var m = e(f.$eval(h[a]));g === b ? k(m) : (g = l(m, -1), h.$removeClass(g));
            }
          });
        } };
    }];
  }function Kd(a) {
    function b(a, b) {
      b && !f[a] ? (k.addClass(e, a), f[a] = !0) : !b && f[a] && (k.removeClass(e, a), f[a] = !1);
    }function d(a, c) {
      a = a ? "-" + Cc(a, "-") : "";b(ob + a, !0 === c);b(Od + a, !1 === c);
    }var c = a.ctrl,
        e = a.$element,
        f = {},
        g = a.set,
        h = a.unset,
        k = a.$animate;f[Od] = !(f[ob] = e.hasClass(ob));c.$setValidity = function (a, e, f) {
      y(e) ? (c.$pending || (c.$pending = {}), g(c.$pending, a, f)) : (c.$pending && h(c.$pending, a, f), Pd(c.$pending) && (c.$pending = void 0));Ga(e) ? e ? (h(c.$error, a, f), g(c.$$success, a, f)) : (g(c.$error, a, f), h(c.$$success, a, f)) : (h(c.$error, a, f), h(c.$$success, a, f));c.$pending ? (b(Qd, !0), c.$valid = c.$invalid = void 0, d("", null)) : (b(Qd, !1), c.$valid = Pd(c.$error), c.$invalid = !c.$valid, d("", c.$valid));e = c.$pending && c.$pending[a] ? void 0 : c.$error[a] ? !1 : c.$$success[a] ? !0 : null;d(a, e);c.$$parentForm.$setValidity(a, e, c);
    };
  }function Pd(a) {
    if (a) for (var b in a) {
      if (a.hasOwnProperty(b)) return !1;
    }return !0;
  }var Cg = /^\/(.+)\/([a-z]*)$/,
      ua = Object.prototype.hasOwnProperty,
      Q = function Q(a) {
    return G(a) ? a.toLowerCase() : a;
  },
      ub = function ub(a) {
    return G(a) ? a.toUpperCase() : a;
  },
      Ea,
      F,
      qa,
      va = [].slice,
      bg = [].splice,
      Dg = [].push,
      ma = Object.prototype.toString,
      wc = Object.getPrototypeOf,
      xa = N("ng"),
      ca = C.angular || (C.angular = {}),
      Ub,
      pb = 0;Ea = C.document.documentMode;A.$inject = [];Xa.$inject = [];var L = Array.isArray,
      ae = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/,
      W = function W(a) {
    return G(a) ? a.trim() : a;
  },
      wd = function wd(a) {
    return a.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
  },
      Ba = function Ba() {
    if (!w(Ba.rules)) {
      var a = C.document.querySelector("[ng-csp]") || C.document.querySelector("[data-ng-csp]");if (a) {
        var b = a.getAttribute("ng-csp") || a.getAttribute("data-ng-csp");Ba.rules = { noUnsafeEval: !b || -1 !== b.indexOf("no-unsafe-eval"), noInlineStyle: !b || -1 !== b.indexOf("no-inline-style") };
      } else {
        a = Ba;try {
          new Function(""), b = !1;
        } catch (d) {
          b = !0;
        }a.rules = { noUnsafeEval: b, noInlineStyle: !1 };
      }
    }return Ba.rules;
  },
      rb = function rb() {
    if (w(rb.name_)) return rb.name_;var a,
        b,
        d = Na.length,
        c,
        e;for (b = 0; b < d; ++b) {
      if (c = Na[b], a = C.document.querySelector("[" + c.replace(":", "\\:") + "jq]")) {
        e = a.getAttribute(c + "jq");break;
      }
    }return rb.name_ = e;
  },
      de = /:/g,
      Na = ["ng-", "data-ng-", "ng:", "x-ng-"],
      ie = /[A-Z]/g,
      Dc = !1,
      Ma = 3,
      me = { full: "1.5.8", major: 1, minor: 5, dot: 8, codeName: "arbitrary-fallbacks" };O.expando = "ng339";var fb = O.cache = {},
      Pf = 1;O._data = function (a) {
    return this.cache[a[this.expando]] || {};
  };var Kf = /([\:\-\_]+(.))/g,
      Lf = /^moz([A-Z])/,
      yb = { mouseleave: "mouseout", mouseenter: "mouseover" },
      Wb = N("jqLite"),
      Of = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
      Vb = /<|&#?\w+;/,
      Mf = /<([\w:-]+)/,
      Nf = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
      ja = { option: [1, '<select multiple="multiple">', "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] };ja.optgroup = ja.option;ja.tbody = ja.tfoot = ja.colgroup = ja.caption = ja.thead;ja.th = ja.td;var Uf = C.Node.prototype.contains || function (a) {
    return !!(this.compareDocumentPosition(a) & 16);
  },
      Oa = O.prototype = { ready: function ready(a) {
      function b() {
        d || (d = !0, a());
      }var d = !1;"complete" === C.document.readyState ? C.setTimeout(b) : (this.on("DOMContentLoaded", b), O(C).on("load", b));
    }, toString: function toString() {
      var a = [];q(this, function (b) {
        a.push("" + b);
      });return "[" + a.join(", ") + "]";
    }, eq: function eq(a) {
      return 0 <= a ? F(this[a]) : F(this[this.length + a]);
    }, length: 0, push: Dg, sort: [].sort, splice: [].splice },
      Eb = {};q("multiple selected checked disabled readOnly required open".split(" "), function (a) {
    Eb[Q(a)] = a;
  });var Vc = {};q("input select option textarea button form details".split(" "), function (a) {
    Vc[a] = !0;
  });var bd = { ngMinlength: "minlength",
    ngMaxlength: "maxlength", ngMin: "min", ngMax: "max", ngPattern: "pattern" };q({ data: Yb, removeData: eb, hasData: function hasData(a) {
      for (var b in fb[a.ng339]) {
        return !0;
      }return !1;
    }, cleanData: function cleanData(a) {
      for (var b = 0, d = a.length; b < d; b++) {
        eb(a[b]);
      }
    } }, function (a, b) {
    O[b] = a;
  });q({ data: Yb, inheritedData: Cb, scope: function scope(a) {
      return F.data(a, "$scope") || Cb(a.parentNode || a, ["$isolateScope", "$scope"]);
    }, isolateScope: function isolateScope(a) {
      return F.data(a, "$isolateScope") || F.data(a, "$isolateScopeNoTemplate");
    }, controller: Sc, injector: function injector(a) {
      return Cb(a, "$injector");
    }, removeAttr: function removeAttr(a, b) {
      a.removeAttribute(b);
    }, hasClass: zb, css: function css(a, b, d) {
      b = db(b);if (w(d)) a.style[b] = d;else return a.style[b];
    }, attr: function attr(a, b, d) {
      var c = a.nodeType;if (c !== Ma && 2 !== c && 8 !== c) if (c = Q(b), Eb[c]) {
        if (w(d)) d ? (a[b] = !0, a.setAttribute(b, c)) : (a[b] = !1, a.removeAttribute(c));else return a[b] || (a.attributes.getNamedItem(b) || A).specified ? c : void 0;
      } else if (w(d)) a.setAttribute(b, d);else if (a.getAttribute) return a = a.getAttribute(b, 2), null === a ? void 0 : a;
    }, prop: function prop(a, b, d) {
      if (w(d)) a[b] = d;else return a[b];
    }, text: function () {
      function a(a, d) {
        if (y(d)) {
          var c = a.nodeType;return 1 === c || c === Ma ? a.textContent : "";
        }a.textContent = d;
      }a.$dv = "";return a;
    }(), val: function val(a, b) {
      if (y(b)) {
        if (a.multiple && "select" === wa(a)) {
          var d = [];q(a.options, function (a) {
            a.selected && d.push(a.value || a.text);
          });return 0 === d.length ? null : d;
        }return a.value;
      }a.value = b;
    }, html: function html(a, b) {
      if (y(b)) return a.innerHTML;wb(a, !0);a.innerHTML = b;
    }, empty: Tc }, function (a, b) {
    O.prototype[b] = function (b, c) {
      var e,
          f,
          g = this.length;if (a !== Tc && y(2 == a.length && a !== zb && a !== Sc ? b : c)) {
        if (D(b)) {
          for (e = 0; e < g; e++) {
            if (a === Yb) a(this[e], b);else for (f in b) {
              a(this[e], f, b[f]);
            }
          }return this;
        }e = a.$dv;g = y(e) ? Math.min(g, 1) : g;for (f = 0; f < g; f++) {
          var h = a(this[f], b, c);e = e ? e + h : h;
        }return e;
      }for (e = 0; e < g; e++) {
        a(this[e], b, c);
      }return this;
    };
  });q({ removeData: eb, on: function on(a, b, d, c) {
      if (w(c)) throw Wb("onargs");if (Nc(a)) {
        c = xb(a, !0);var e = c.events,
            f = c.handle;f || (f = c.handle = Rf(a, e));c = 0 <= b.indexOf(" ") ? b.split(" ") : [b];for (var g = c.length, h = function h(b, c, g) {
          var h = e[b];h || (h = e[b] = [], h.specialHandlerWrapper = c, "$destroy" === b || g || a.addEventListener(b, f, !1));h.push(d);
        }; g--;) {
          b = c[g], yb[b] ? (h(yb[b], Tf), h(b, void 0, !0)) : h(b);
        }
      }
    }, off: Rc, one: function one(a, b, d) {
      a = F(a);a.on(b, function e() {
        a.off(b, d);a.off(b, e);
      });a.on(b, d);
    }, replaceWith: function replaceWith(a, b) {
      var d,
          c = a.parentNode;wb(a);q(new O(b), function (b) {
        d ? c.insertBefore(b, d.nextSibling) : c.replaceChild(b, a);d = b;
      });
    }, children: function children(a) {
      var b = [];q(a.childNodes, function (a) {
        1 === a.nodeType && b.push(a);
      });return b;
    }, contents: function contents(a) {
      return a.contentDocument || a.childNodes || [];
    }, append: function append(a, b) {
      var d = a.nodeType;if (1 === d || 11 === d) {
        b = new O(b);for (var d = 0, c = b.length; d < c; d++) {
          a.appendChild(b[d]);
        }
      }
    }, prepend: function prepend(a, b) {
      if (1 === a.nodeType) {
        var d = a.firstChild;q(new O(b), function (b) {
          a.insertBefore(b, d);
        });
      }
    }, wrap: function wrap(a, b) {
      Pc(a, F(b).eq(0).clone()[0]);
    }, remove: Db, detach: function detach(a) {
      Db(a, !0);
    }, after: function after(a, b) {
      var d = a,
          c = a.parentNode;b = new O(b);for (var e = 0, f = b.length; e < f; e++) {
        var g = b[e];c.insertBefore(g, d.nextSibling);d = g;
      }
    }, addClass: Bb, removeClass: Ab, toggleClass: function toggleClass(a, b, d) {
      b && q(b.split(" "), function (b) {
        var e = d;y(e) && (e = !zb(a, b));(e ? Bb : Ab)(a, b);
      });
    }, parent: function parent(a) {
      return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
    }, next: function next(a) {
      return a.nextElementSibling;
    }, find: function find(a, b) {
      return a.getElementsByTagName ? a.getElementsByTagName(b) : [];
    }, clone: Xb, triggerHandler: function triggerHandler(a, b, d) {
      var c,
          e,
          f = b.type || b,
          g = xb(a);if (g = (g = g && g.events) && g[f]) c = { preventDefault: function preventDefault() {
          this.defaultPrevented = !0;
        }, isDefaultPrevented: function isDefaultPrevented() {
          return !0 === this.defaultPrevented;
        }, stopImmediatePropagation: function stopImmediatePropagation() {
          this.immediatePropagationStopped = !0;
        }, isImmediatePropagationStopped: function isImmediatePropagationStopped() {
          return !0 === this.immediatePropagationStopped;
        }, stopPropagation: A, type: f, target: a }, b.type && (c = S(c, b)), b = ia(g), e = d ? [c].concat(d) : [c], q(b, function (b) {
        c.isImmediatePropagationStopped() || b.apply(a, e);
      });
    } }, function (a, b) {
    O.prototype[b] = function (b, c, e) {
      for (var f, g = 0, h = this.length; g < h; g++) {
        y(f) ? (f = a(this[g], b, c, e), w(f) && (f = F(f))) : Qc(f, a(this[g], b, c, e));
      }return w(f) ? f : this;
    };O.prototype.bind = O.prototype.on;O.prototype.unbind = O.prototype.off;
  });Ra.prototype = { put: function put(a, b) {
      this[Ca(a, this.nextUid)] = b;
    }, get: function get(a) {
      return this[Ca(a, this.nextUid)];
    }, remove: function remove(a) {
      var b = this[a = Ca(a, this.nextUid)];delete this[a];return b;
    } };var If = [function () {
    this.$get = [function () {
      return Ra;
    }];
  }],
      Wf = /^([^\(]+?)=>/,
      Xf = /^[^\(]*\(\s*([^\)]*)\)/m,
      Eg = /,/,
      Fg = /^\s*(_?)(\S+?)\1\s*$/,
      Vf = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
      Ha = N("$injector");cb.$$annotate = function (a, b, d) {
    var c;if ("function" === typeof a) {
      if (!(c = a.$inject)) {
        c = [];if (a.length) {
          if (b) throw G(d) && d || (d = a.name || Yf(a)), Ha("strictdi", d);
          b = Wc(a);q(b[1].split(Eg), function (a) {
            a.replace(Fg, function (a, b, d) {
              c.push(d);
            });
          });
        }a.$inject = c;
      }
    } else L(a) ? (b = a.length - 1, Pa(a[b], "fn"), c = a.slice(0, b)) : Pa(a, "fn", !0);return c;
  };var Rd = N("$animate"),
      $e = function $e() {
    this.$get = A;
  },
      af = function af() {
    var a = new Ra(),
        b = [];this.$get = ["$$AnimateRunner", "$rootScope", function (d, c) {
      function e(a, b, c) {
        var d = !1;b && (b = G(b) ? b.split(" ") : L(b) ? b : [], q(b, function (b) {
          b && (d = !0, a[b] = c);
        }));return d;
      }function f() {
        q(b, function (b) {
          var c = a.get(b);if (c) {
            var d = Zf(b.attr("class")),
                e = "",
                f = "";q(c, function (a, b) {
              a !== !!d[b] && (a ? e += (e.length ? " " : "") + b : f += (f.length ? " " : "") + b);
            });q(b, function (a) {
              e && Bb(a, e);f && Ab(a, f);
            });a.remove(b);
          }
        });b.length = 0;
      }return { enabled: A, on: A, off: A, pin: A, push: function push(g, h, k, l) {
          l && l();k = k || {};k.from && g.css(k.from);k.to && g.css(k.to);if (k.addClass || k.removeClass) if (h = k.addClass, l = k.removeClass, k = a.get(g) || {}, h = e(k, h, !0), l = e(k, l, !1), h || l) a.put(g, k), b.push(g), 1 === b.length && c.$$postDigest(f);g = new d();g.complete();return g;
        } };
    }];
  },
      Ye = ["$provide", function (a) {
    var b = this;this.$$registeredAnimations = Object.create(null);this.register = function (d, c) {
      if (d && "." !== d.charAt(0)) throw Rd("notcsel", d);var e = d + "-animation";b.$$registeredAnimations[d.substr(1)] = e;a.factory(e, c);
    };this.classNameFilter = function (a) {
      if (1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null) && /(\s+|\/)ng-animate(\s+|\/)/.test(this.$$classNameFilter.toString())) throw Rd("nongcls", "ng-animate");return this.$$classNameFilter;
    };this.$get = ["$$animateQueue", function (a) {
      function b(a, c, d) {
        if (d) {
          var h;a: {
            for (h = 0; h < d.length; h++) {
              var k = d[h];if (1 === k.nodeType) {
                h = k;break a;
              }
            }h = void 0;
          }!h || h.parentNode || h.previousElementSibling || (d = null);
        }d ? d.after(a) : c.prepend(a);
      }return { on: a.on, off: a.off, pin: a.pin, enabled: a.enabled, cancel: function cancel(a) {
          a.end && a.end();
        }, enter: function enter(e, f, g, h) {
          f = f && F(f);g = g && F(g);f = f || g.parent();b(e, f, g);return a.push(e, "enter", Ia(h));
        }, move: function move(e, f, g, h) {
          f = f && F(f);g = g && F(g);f = f || g.parent();b(e, f, g);return a.push(e, "move", Ia(h));
        }, leave: function leave(b, c) {
          return a.push(b, "leave", Ia(c), function () {
            b.remove();
          });
        }, addClass: function addClass(b, c, g) {
          g = Ia(g);g.addClass = gb(g.addclass, c);return a.push(b, "addClass", g);
        }, removeClass: function removeClass(b, c, g) {
          g = Ia(g);g.removeClass = gb(g.removeClass, c);return a.push(b, "removeClass", g);
        }, setClass: function setClass(b, c, g, h) {
          h = Ia(h);h.addClass = gb(h.addClass, c);h.removeClass = gb(h.removeClass, g);return a.push(b, "setClass", h);
        }, animate: function animate(b, c, g, h, k) {
          k = Ia(k);k.from = k.from ? S(k.from, c) : c;k.to = k.to ? S(k.to, g) : g;k.tempClasses = gb(k.tempClasses, h || "ng-inline-animate");return a.push(b, "animate", k);
        } };
    }];
  }],
      cf = function cf() {
    this.$get = ["$$rAF", function (a) {
      function b(b) {
        d.push(b);1 < d.length || a(function () {
          for (var a = 0; a < d.length; a++) {
            d[a]();
          }d = [];
        });
      }var d = [];return function () {
        var a = !1;b(function () {
          a = !0;
        });return function (d) {
          a ? d() : b(d);
        };
      };
    }];
  },
      bf = function bf() {
    this.$get = ["$q", "$sniffer", "$$animateAsyncRun", "$document", "$timeout", function (a, b, d, c, e) {
      function f(a) {
        this.setHost(a);var b = d();this._doneCallbacks = [];this._tick = function (a) {
          var d = c[0];d && d.hidden ? e(a, 0, !1) : b(a);
        };this._state = 0;
      }f.chain = function (a, b) {
        function c() {
          if (d === a.length) b(!0);else a[d](function (a) {
            !1 === a ? b(!1) : (d++, c());
          });
        }var d = 0;c();
      };f.all = function (a, b) {
        function c(f) {
          e = e && f;++d === a.length && b(e);
        }var d = 0,
            e = !0;q(a, function (a) {
          a.done(c);
        });
      };f.prototype = { setHost: function setHost(a) {
          this.host = a || {};
        }, done: function done(a) {
          2 === this._state ? a() : this._doneCallbacks.push(a);
        }, progress: A, getPromise: function getPromise() {
          if (!this.promise) {
            var b = this;this.promise = a(function (a, c) {
              b.done(function (b) {
                !1 === b ? c() : a();
              });
            });
          }return this.promise;
        }, then: function then(a, b) {
          return this.getPromise().then(a, b);
        }, "catch": function _catch(a) {
          return this.getPromise()["catch"](a);
        },
        "finally": function _finally(a) {
          return this.getPromise()["finally"](a);
        }, pause: function pause() {
          this.host.pause && this.host.pause();
        }, resume: function resume() {
          this.host.resume && this.host.resume();
        }, end: function end() {
          this.host.end && this.host.end();this._resolve(!0);
        }, cancel: function cancel() {
          this.host.cancel && this.host.cancel();this._resolve(!1);
        }, complete: function complete(a) {
          var b = this;0 === b._state && (b._state = 1, b._tick(function () {
            b._resolve(a);
          }));
        }, _resolve: function _resolve(a) {
          2 !== this._state && (q(this._doneCallbacks, function (b) {
            b(a);
          }), this._doneCallbacks.length = 0, this._state = 2);
        } };return f;
    }];
  },
      Ze = function Ze() {
    this.$get = ["$$rAF", "$q", "$$AnimateRunner", function (a, b, d) {
      return function (b, e) {
        function f() {
          a(function () {
            g.addClass && (b.addClass(g.addClass), g.addClass = null);g.removeClass && (b.removeClass(g.removeClass), g.removeClass = null);g.to && (b.css(g.to), g.to = null);h || k.complete();h = !0;
          });return k;
        }var g = e || {};g.$$prepared || (g = pa(g));g.cleanupStyles && (g.from = g.to = null);g.from && (b.css(g.from), g.from = null);var h,
            k = new d();return { start: f, end: f };
      };
    }];
  },
      ga = N("$compile"),
      bc = new function () {}();
  Fc.$inject = ["$provide", "$$sanitizeUriProvider"];Fb.prototype.isFirstChange = function () {
    return this.previousValue === bc;
  };var Yc = /^((?:x|data)[\:\-_])/i,
      cg = N("$controller"),
      cd = /^(\S+)(\s+as\s+([\w$]+))?$/,
      jf = function jf() {
    this.$get = ["$document", function (a) {
      return function (b) {
        b ? !b.nodeType && b instanceof F && (b = b[0]) : b = a[0].body;return b.offsetWidth + 1;
      };
    }];
  },
      dd = "application/json",
      ec = { "Content-Type": dd + ";charset=utf-8" },
      eg = /^\[|^\{(?!\{)/,
      fg = { "[": /]$/, "{": /}$/ },
      dg = /^\)\]\}',?\n/,
      Gg = N("$http"),
      hd = function hd(a) {
    return function () {
      throw Gg("legacy", a);
    };
  },
      Ka = ca.$interpolateMinErr = N("$interpolate");Ka.throwNoconcat = function (a) {
    throw Ka("noconcat", a);
  };Ka.interr = function (a, b) {
    return Ka("interr", a, b.toString());
  };var rf = function rf() {
    this.$get = ["$window", function (a) {
      function b(a) {
        var b = function b(a) {
          b.data = a;b.called = !0;
        };b.id = a;return b;
      }var d = a.angular.callbacks,
          c = {};return { createCallback: function createCallback(a) {
          a = "_" + (d.$$counter++).toString(36);var f = "angular.callbacks." + a,
              g = b(a);c[f] = d[a] = g;return f;
        }, wasCalled: function wasCalled(a) {
          return c[a].called;
        }, getResponse: function getResponse(a) {
          return c[a].data;
        },
        removeCallback: function removeCallback(a) {
          delete d[c[a].id];delete c[a];
        } };
    }];
  },
      Hg = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
      hg = { http: 80, https: 443, ftp: 21 },
      Gb = N("$location"),
      Ig = { $$absUrl: "", $$html5: !1, $$replace: !1, absUrl: Hb("$$absUrl"), url: function url(a) {
      if (y(a)) return this.$$url;var b = Hg.exec(a);(b[1] || "" === a) && this.path(decodeURIComponent(b[1]));(b[2] || b[1] || "" === a) && this.search(b[3] || "");this.hash(b[5] || "");return this;
    }, protocol: Hb("$$protocol"), host: Hb("$$host"), port: Hb("$$port"), path: md("$$path", function (a) {
      a = null !== a ? a.toString() : "";return "/" == a.charAt(0) ? a : "/" + a;
    }), search: function search(a, b) {
      switch (arguments.length) {case 0:
          return this.$$search;case 1:
          if (G(a) || T(a)) a = a.toString(), this.$$search = Ac(a);else if (D(a)) a = pa(a, {}), q(a, function (b, c) {
            null == b && delete a[c];
          }), this.$$search = a;else throw Gb("isrcharg");break;default:
          y(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b;}this.$$compose();return this;
    }, hash: md("$$hash", function (a) {
      return null !== a ? a.toString() : "";
    }), replace: function replace() {
      this.$$replace = !0;return this;
    } };q([ld, hc, gc], function (a) {
    a.prototype = Object.create(Ig);a.prototype.state = function (b) {
      if (!arguments.length) return this.$$state;if (a !== gc || !this.$$html5) throw Gb("nostate");this.$$state = y(b) ? null : b;return this;
    };
  });var X = N("$parse"),
      jg = Function.prototype.call,
      kg = Function.prototype.apply,
      lg = Function.prototype.bind,
      Ob = U();q("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function (a) {
    Ob[a] = !0;
  });var Jg = { n: "\n", f: "\f", r: "\r", t: "\t", v: "\v", "'": "'", '"': '"' },
      jc = function jc(a) {
    this.options = a;
  };jc.prototype = { constructor: jc,
    lex: function lex(a) {
      this.text = a;this.index = 0;for (this.tokens = []; this.index < this.text.length;) {
        if (a = this.text.charAt(this.index), '"' === a || "'" === a) this.readString(a);else if (this.isNumber(a) || "." === a && this.isNumber(this.peek())) this.readNumber();else if (this.isIdentifierStart(this.peekMultichar())) this.readIdent();else if (this.is(a, "(){}[].,;:?")) this.tokens.push({ index: this.index, text: a }), this.index++;else if (this.isWhitespace(a)) this.index++;else {
          var b = a + this.peek(),
              d = b + this.peek(2),
              c = Ob[b],
              e = Ob[d];Ob[a] || c || e ? (a = e ? d : c ? b : a, this.tokens.push({ index: this.index, text: a, operator: !0 }), this.index += a.length) : this.throwError("Unexpected next character ", this.index, this.index + 1);
        }
      }return this.tokens;
    }, is: function is(a, b) {
      return -1 !== b.indexOf(a);
    }, peek: function peek(a) {
      a = a || 1;return this.index + a < this.text.length ? this.text.charAt(this.index + a) : !1;
    }, isNumber: function isNumber(a) {
      return "0" <= a && "9" >= a && "string" === typeof a;
    }, isWhitespace: function isWhitespace(a) {
      return " " === a || "\r" === a || "\t" === a || "\n" === a || "\v" === a || "\xA0" === a;
    }, isIdentifierStart: function isIdentifierStart(a) {
      return this.options.isIdentifierStart ? this.options.isIdentifierStart(a, this.codePointAt(a)) : this.isValidIdentifierStart(a);
    }, isValidIdentifierStart: function isValidIdentifierStart(a) {
      return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a;
    }, isIdentifierContinue: function isIdentifierContinue(a) {
      return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(a, this.codePointAt(a)) : this.isValidIdentifierContinue(a);
    }, isValidIdentifierContinue: function isValidIdentifierContinue(a, b) {
      return this.isValidIdentifierStart(a, b) || this.isNumber(a);
    }, codePointAt: function codePointAt(a) {
      return 1 === a.length ? a.charCodeAt(0) : (a.charCodeAt(0) << 10) + a.charCodeAt(1) - 56613888;
    }, peekMultichar: function peekMultichar() {
      var a = this.text.charAt(this.index),
          b = this.peek();if (!b) return a;var d = a.charCodeAt(0),
          c = b.charCodeAt(0);return 55296 <= d && 56319 >= d && 56320 <= c && 57343 >= c ? a + b : a;
    }, isExpOperator: function isExpOperator(a) {
      return "-" === a || "+" === a || this.isNumber(a);
    }, throwError: function throwError(a, b, d) {
      d = d || this.index;b = w(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, d) + "]" : " " + d;throw X("lexerr", a, b, this.text);
    }, readNumber: function readNumber() {
      for (var a = "", b = this.index; this.index < this.text.length;) {
        var d = Q(this.text.charAt(this.index));if ("." == d || this.isNumber(d)) a += d;else {
          var c = this.peek();if ("e" == d && this.isExpOperator(c)) a += d;else if (this.isExpOperator(d) && c && this.isNumber(c) && "e" == a.charAt(a.length - 1)) a += d;else if (!this.isExpOperator(d) || c && this.isNumber(c) || "e" != a.charAt(a.length - 1)) break;else this.throwError("Invalid exponent");
        }this.index++;
      }this.tokens.push({ index: b, text: a, constant: !0, value: Number(a) });
    }, readIdent: function readIdent() {
      var a = this.index;for (this.index += this.peekMultichar().length; this.index < this.text.length;) {
        var b = this.peekMultichar();if (!this.isIdentifierContinue(b)) break;this.index += b.length;
      }this.tokens.push({ index: a, text: this.text.slice(a, this.index), identifier: !0 });
    }, readString: function readString(a) {
      var b = this.index;this.index++;for (var d = "", c = a, e = !1; this.index < this.text.length;) {
        var f = this.text.charAt(this.index),
            c = c + f;if (e) "u" === f ? (e = this.text.substring(this.index + 1, this.index + 5), e.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + e + "]"), this.index += 4, d += String.fromCharCode(parseInt(e, 16))) : d += Jg[f] || f, e = !1;else if ("\\" === f) e = !0;else {
          if (f === a) {
            this.index++;this.tokens.push({ index: b, text: c, constant: !0, value: d });return;
          }d += f;
        }this.index++;
      }this.throwError("Unterminated quote", b);
    } };var s = function s(a, b) {
    this.lexer = a;this.options = b;
  };s.Program = "Program";s.ExpressionStatement = "ExpressionStatement";s.AssignmentExpression = "AssignmentExpression";s.ConditionalExpression = "ConditionalExpression";s.LogicalExpression = "LogicalExpression";s.BinaryExpression = "BinaryExpression";s.UnaryExpression = "UnaryExpression";
  s.CallExpression = "CallExpression";s.MemberExpression = "MemberExpression";s.Identifier = "Identifier";s.Literal = "Literal";s.ArrayExpression = "ArrayExpression";s.Property = "Property";s.ObjectExpression = "ObjectExpression";s.ThisExpression = "ThisExpression";s.LocalsExpression = "LocalsExpression";s.NGValueParameter = "NGValueParameter";s.prototype = { ast: function ast(a) {
      this.text = a;this.tokens = this.lexer.lex(a);a = this.program();0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]);return a;
    },
    program: function program() {
      for (var a = [];;) {
        if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.expressionStatement()), !this.expect(";")) return { type: s.Program, body: a };
      }
    }, expressionStatement: function expressionStatement() {
      return { type: s.ExpressionStatement, expression: this.filterChain() };
    }, filterChain: function filterChain() {
      for (var a = this.expression(); this.expect("|");) {
        a = this.filter(a);
      }return a;
    }, expression: function expression() {
      return this.assignment();
    }, assignment: function assignment() {
      var a = this.ternary();this.expect("=") && (a = { type: s.AssignmentExpression,
        left: a, right: this.assignment(), operator: "=" });return a;
    }, ternary: function ternary() {
      var a = this.logicalOR(),
          b,
          d;return this.expect("?") && (b = this.expression(), this.consume(":")) ? (d = this.expression(), { type: s.ConditionalExpression, test: a, alternate: b, consequent: d }) : a;
    }, logicalOR: function logicalOR() {
      for (var a = this.logicalAND(); this.expect("||");) {
        a = { type: s.LogicalExpression, operator: "||", left: a, right: this.logicalAND() };
      }return a;
    }, logicalAND: function logicalAND() {
      for (var a = this.equality(); this.expect("&&");) {
        a = { type: s.LogicalExpression,
          operator: "&&", left: a, right: this.equality() };
      }return a;
    }, equality: function equality() {
      for (var a = this.relational(), b; b = this.expect("==", "!=", "===", "!==");) {
        a = { type: s.BinaryExpression, operator: b.text, left: a, right: this.relational() };
      }return a;
    }, relational: function relational() {
      for (var a = this.additive(), b; b = this.expect("<", ">", "<=", ">=");) {
        a = { type: s.BinaryExpression, operator: b.text, left: a, right: this.additive() };
      }return a;
    }, additive: function additive() {
      for (var a = this.multiplicative(), b; b = this.expect("+", "-");) {
        a = { type: s.BinaryExpression, operator: b.text,
          left: a, right: this.multiplicative() };
      }return a;
    }, multiplicative: function multiplicative() {
      for (var a = this.unary(), b; b = this.expect("*", "/", "%");) {
        a = { type: s.BinaryExpression, operator: b.text, left: a, right: this.unary() };
      }return a;
    }, unary: function unary() {
      var a;return (a = this.expect("+", "-", "!")) ? { type: s.UnaryExpression, operator: a.text, prefix: !0, argument: this.unary() } : this.primary();
    }, primary: function primary() {
      var a;this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.selfReferential.hasOwnProperty(this.peek().text) ? a = pa(this.selfReferential[this.consume().text]) : this.options.literals.hasOwnProperty(this.peek().text) ? a = { type: s.Literal, value: this.options.literals[this.consume().text] } : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());for (var b; b = this.expect("(", "[", ".");) {
        "(" === b.text ? (a = { type: s.CallExpression, callee: a, arguments: this.parseArguments() }, this.consume(")")) : "[" === b.text ? (a = { type: s.MemberExpression, object: a, property: this.expression(), computed: !0 }, this.consume("]")) : "." === b.text ? a = { type: s.MemberExpression, object: a, property: this.identifier(), computed: !1 } : this.throwError("IMPOSSIBLE");
      }return a;
    }, filter: function filter(a) {
      a = [a];for (var b = { type: s.CallExpression, callee: this.identifier(), arguments: a, filter: !0 }; this.expect(":");) {
        a.push(this.expression());
      }return b;
    }, parseArguments: function parseArguments() {
      var a = [];if (")" !== this.peekToken().text) {
        do {
          a.push(this.filterChain());
        } while (this.expect(","));
      }return a;
    }, identifier: function identifier() {
      var a = this.consume();a.identifier || this.throwError("is not a valid identifier", a);return { type: s.Identifier, name: a.text };
    }, constant: function constant() {
      return { type: s.Literal, value: this.consume().value };
    }, arrayDeclaration: function arrayDeclaration() {
      var a = [];if ("]" !== this.peekToken().text) {
        do {
          if (this.peek("]")) break;a.push(this.expression());
        } while (this.expect(","));
      }this.consume("]");return { type: s.ArrayExpression, elements: a };
    }, object: function object() {
      var a = [],
          b;if ("}" !== this.peekToken().text) {
        do {
          if (this.peek("}")) break;
          b = { type: s.Property, kind: "init" };this.peek().constant ? (b.key = this.constant(), b.computed = !1, this.consume(":"), b.value = this.expression()) : this.peek().identifier ? (b.key = this.identifier(), b.computed = !1, this.peek(":") ? (this.consume(":"), b.value = this.expression()) : b.value = b.key) : this.peek("[") ? (this.consume("["), b.key = this.expression(), this.consume("]"), b.computed = !0, this.consume(":"), b.value = this.expression()) : this.throwError("invalid key", this.peek());a.push(b);
        } while (this.expect(","));
      }this.consume("}");
      return { type: s.ObjectExpression, properties: a };
    }, throwError: function throwError(a, b) {
      throw X("syntax", b.text, a, b.index + 1, this.text, this.text.substring(b.index));
    }, consume: function consume(a) {
      if (0 === this.tokens.length) throw X("ueoe", this.text);var b = this.expect(a);b || this.throwError("is unexpected, expecting [" + a + "]", this.peek());return b;
    }, peekToken: function peekToken() {
      if (0 === this.tokens.length) throw X("ueoe", this.text);return this.tokens[0];
    }, peek: function peek(a, b, d, c) {
      return this.peekAhead(0, a, b, d, c);
    }, peekAhead: function peekAhead(a, b, d, c, e) {
      if (this.tokens.length > a) {
        a = this.tokens[a];var f = a.text;if (f === b || f === d || f === c || f === e || !(b || d || c || e)) return a;
      }return !1;
    }, expect: function expect(a, b, d, c) {
      return (a = this.peek(a, b, d, c)) ? (this.tokens.shift(), a) : !1;
    }, selfReferential: { "this": { type: s.ThisExpression }, $locals: { type: s.LocalsExpression } } };td.prototype = { compile: function compile(a, b) {
      var d = this,
          c = this.astBuilder.ast(a);this.state = { nextId: 0, filters: {}, expensiveChecks: b, fn: { vars: [], body: [], own: {} }, assign: { vars: [], body: [], own: {} }, inputs: [] };V(c, d.$filter);var e = "",
          f;this.stage = "assign";
      if (f = rd(c)) this.state.computing = "assign", e = this.nextId(), this.recurse(f, e), this.return_(e), e = "fn.assign=" + this.generateFunction("assign", "s,v,l");f = pd(c.body);d.stage = "inputs";q(f, function (a, b) {
        var c = "fn" + b;d.state[c] = { vars: [], body: [], own: {} };d.state.computing = c;var e = d.nextId();d.recurse(a, e);d.return_(e);d.state.inputs.push(c);a.watchId = b;
      });this.state.computing = "fn";this.stage = "main";this.recurse(c);e = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + e + this.watchFns() + "return fn;";e = new Function("$filter", "ensureSafeMemberName", "ensureSafeObject", "ensureSafeFunction", "getStringValue", "ensureSafeAssignContext", "ifDefined", "plus", "text", e)(this.$filter, Sa, ra, nd, ig, Ib, mg, od, a);this.state = this.stage = void 0;e.literal = sd(c);e.constant = c.constant;return e;
    }, USE: "use", STRICT: "strict", watchFns: function watchFns() {
      var a = [],
          b = this.state.inputs,
          d = this;q(b, function (b) {
        a.push("var " + b + "=" + d.generateFunction(b, "s"));
      });b.length && a.push("fn.inputs=[" + b.join(",") + "];");
      return a.join("");
    }, generateFunction: function generateFunction(a, b) {
      return "function(" + b + "){" + this.varsPrefix(a) + this.body(a) + "};";
    }, filterPrefix: function filterPrefix() {
      var a = [],
          b = this;q(this.state.filters, function (d, c) {
        a.push(d + "=$filter(" + b.escape(c) + ")");
      });return a.length ? "var " + a.join(",") + ";" : "";
    }, varsPrefix: function varsPrefix(a) {
      return this.state[a].vars.length ? "var " + this.state[a].vars.join(",") + ";" : "";
    }, body: function body(a) {
      return this.state[a].body.join("");
    }, recurse: function recurse(a, b, d, c, e, f) {
      var g,
          h,
          k = this,
          l,
          m,
          n;c = c || A;if (!f && w(a.watchId)) b = b || this.nextId(), this.if_("i", this.lazyAssign(b, this.computedMember("i", a.watchId)), this.lazyRecurse(a, b, d, c, e, !0));else switch (a.type) {case s.Program:
          q(a.body, function (b, c) {
            k.recurse(b.expression, void 0, void 0, function (a) {
              h = a;
            });c !== a.body.length - 1 ? k.current().body.push(h, ";") : k.return_(h);
          });break;case s.Literal:
          m = this.escape(a.value);this.assign(b, m);c(m);break;case s.UnaryExpression:
          this.recurse(a.argument, void 0, void 0, function (a) {
            h = a;
          });m = a.operator + "(" + this.ifDefined(h, 0) + ")";this.assign(b, m);
          c(m);break;case s.BinaryExpression:
          this.recurse(a.left, void 0, void 0, function (a) {
            g = a;
          });this.recurse(a.right, void 0, void 0, function (a) {
            h = a;
          });m = "+" === a.operator ? this.plus(g, h) : "-" === a.operator ? this.ifDefined(g, 0) + a.operator + this.ifDefined(h, 0) : "(" + g + ")" + a.operator + "(" + h + ")";this.assign(b, m);c(m);break;case s.LogicalExpression:
          b = b || this.nextId();k.recurse(a.left, b);k.if_("&&" === a.operator ? b : k.not(b), k.lazyRecurse(a.right, b));c(b);break;case s.ConditionalExpression:
          b = b || this.nextId();k.recurse(a.test, b);k.if_(b, k.lazyRecurse(a.alternate, b), k.lazyRecurse(a.consequent, b));c(b);break;case s.Identifier:
          b = b || this.nextId();d && (d.context = "inputs" === k.stage ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", a.name) + "?l:s"), d.computed = !1, d.name = a.name);Sa(a.name);k.if_("inputs" === k.stage || k.not(k.getHasOwnProperty("l", a.name)), function () {
            k.if_("inputs" === k.stage || "s", function () {
              e && 1 !== e && k.if_(k.not(k.nonComputedMember("s", a.name)), k.lazyAssign(k.nonComputedMember("s", a.name), "{}"));k.assign(b, k.nonComputedMember("s", a.name));
            });
          }, b && k.lazyAssign(b, k.nonComputedMember("l", a.name)));(k.state.expensiveChecks || Jb(a.name)) && k.addEnsureSafeObject(b);c(b);break;case s.MemberExpression:
          g = d && (d.context = this.nextId()) || this.nextId();b = b || this.nextId();k.recurse(a.object, g, void 0, function () {
            k.if_(k.notNull(g), function () {
              e && 1 !== e && k.addEnsureSafeAssignContext(g);if (a.computed) h = k.nextId(), k.recurse(a.property, h), k.getStringValue(h), k.addEnsureSafeMemberName(h), e && 1 !== e && k.if_(k.not(k.computedMember(g, h)), k.lazyAssign(k.computedMember(g, h), "{}")), m = k.ensureSafeObject(k.computedMember(g, h)), k.assign(b, m), d && (d.computed = !0, d.name = h);else {
                Sa(a.property.name);e && 1 !== e && k.if_(k.not(k.nonComputedMember(g, a.property.name)), k.lazyAssign(k.nonComputedMember(g, a.property.name), "{}"));m = k.nonComputedMember(g, a.property.name);if (k.state.expensiveChecks || Jb(a.property.name)) m = k.ensureSafeObject(m);k.assign(b, m);d && (d.computed = !1, d.name = a.property.name);
              }
            }, function () {
              k.assign(b, "undefined");
            });c(b);
          }, !!e);break;case s.CallExpression:
          b = b || this.nextId();
          a.filter ? (h = k.filter(a.callee.name), l = [], q(a.arguments, function (a) {
            var b = k.nextId();k.recurse(a, b);l.push(b);
          }), m = h + "(" + l.join(",") + ")", k.assign(b, m), c(b)) : (h = k.nextId(), g = {}, l = [], k.recurse(a.callee, h, g, function () {
            k.if_(k.notNull(h), function () {
              k.addEnsureSafeFunction(h);q(a.arguments, function (a) {
                k.recurse(a, k.nextId(), void 0, function (a) {
                  l.push(k.ensureSafeObject(a));
                });
              });g.name ? (k.state.expensiveChecks || k.addEnsureSafeObject(g.context), m = k.member(g.context, g.name, g.computed) + "(" + l.join(",") + ")") : m = h + "(" + l.join(",") + ")";m = k.ensureSafeObject(m);k.assign(b, m);
            }, function () {
              k.assign(b, "undefined");
            });c(b);
          }));break;case s.AssignmentExpression:
          h = this.nextId();g = {};if (!qd(a.left)) throw X("lval");this.recurse(a.left, void 0, g, function () {
            k.if_(k.notNull(g.context), function () {
              k.recurse(a.right, h);k.addEnsureSafeObject(k.member(g.context, g.name, g.computed));k.addEnsureSafeAssignContext(g.context);m = k.member(g.context, g.name, g.computed) + a.operator + h;k.assign(b, m);c(b || m);
            });
          }, 1);break;case s.ArrayExpression:
          l = [];q(a.elements, function (a) {
            k.recurse(a, k.nextId(), void 0, function (a) {
              l.push(a);
            });
          });m = "[" + l.join(",") + "]";this.assign(b, m);c(m);break;case s.ObjectExpression:
          l = [];n = !1;q(a.properties, function (a) {
            a.computed && (n = !0);
          });n ? (b = b || this.nextId(), this.assign(b, "{}"), q(a.properties, function (a) {
            a.computed ? (g = k.nextId(), k.recurse(a.key, g)) : g = a.key.type === s.Identifier ? a.key.name : "" + a.key.value;h = k.nextId();k.recurse(a.value, h);k.assign(k.member(b, g, a.computed), h);
          })) : (q(a.properties, function (b) {
            k.recurse(b.value, a.constant ? void 0 : k.nextId(), void 0, function (a) {
              l.push(k.escape(b.key.type === s.Identifier ? b.key.name : "" + b.key.value) + ":" + a);
            });
          }), m = "{" + l.join(",") + "}", this.assign(b, m));c(b || m);break;case s.ThisExpression:
          this.assign(b, "s");c("s");break;case s.LocalsExpression:
          this.assign(b, "l");c("l");break;case s.NGValueParameter:
          this.assign(b, "v"), c("v");}
    }, getHasOwnProperty: function getHasOwnProperty(a, b) {
      var d = a + "." + b,
          c = this.current().own;c.hasOwnProperty(d) || (c[d] = this.nextId(!1, a + "&&(" + this.escape(b) + " in " + a + ")"));return c[d];
    },
    assign: function assign(a, b) {
      if (a) return this.current().body.push(a, "=", b, ";"), a;
    }, filter: function filter(a) {
      this.state.filters.hasOwnProperty(a) || (this.state.filters[a] = this.nextId(!0));return this.state.filters[a];
    }, ifDefined: function ifDefined(a, b) {
      return "ifDefined(" + a + "," + this.escape(b) + ")";
    }, plus: function plus(a, b) {
      return "plus(" + a + "," + b + ")";
    }, return_: function return_(a) {
      this.current().body.push("return ", a, ";");
    }, if_: function if_(a, b, d) {
      if (!0 === a) b();else {
        var c = this.current().body;c.push("if(", a, "){");b();c.push("}");d && (c.push("else{"), d(), c.push("}"));
      }
    }, not: function not(a) {
      return "!(" + a + ")";
    }, notNull: function notNull(a) {
      return a + "!=null";
    }, nonComputedMember: function nonComputedMember(a, b) {
      var d = /[^$_a-zA-Z0-9]/g;return (/[$_a-zA-Z][$_a-zA-Z0-9]*/.test(b) ? a + "." + b : a + '["' + b.replace(d, this.stringEscapeFn) + '"]'
      );
    }, computedMember: function computedMember(a, b) {
      return a + "[" + b + "]";
    }, member: function member(a, b, d) {
      return d ? this.computedMember(a, b) : this.nonComputedMember(a, b);
    }, addEnsureSafeObject: function addEnsureSafeObject(a) {
      this.current().body.push(this.ensureSafeObject(a), ";");
    }, addEnsureSafeMemberName: function addEnsureSafeMemberName(a) {
      this.current().body.push(this.ensureSafeMemberName(a), ";");
    }, addEnsureSafeFunction: function addEnsureSafeFunction(a) {
      this.current().body.push(this.ensureSafeFunction(a), ";");
    }, addEnsureSafeAssignContext: function addEnsureSafeAssignContext(a) {
      this.current().body.push(this.ensureSafeAssignContext(a), ";");
    }, ensureSafeObject: function ensureSafeObject(a) {
      return "ensureSafeObject(" + a + ",text)";
    }, ensureSafeMemberName: function ensureSafeMemberName(a) {
      return "ensureSafeMemberName(" + a + ",text)";
    }, ensureSafeFunction: function ensureSafeFunction(a) {
      return "ensureSafeFunction(" + a + ",text)";
    }, getStringValue: function getStringValue(a) {
      this.assign(a, "getStringValue(" + a + ")");
    }, ensureSafeAssignContext: function ensureSafeAssignContext(a) {
      return "ensureSafeAssignContext(" + a + ",text)";
    }, lazyRecurse: function lazyRecurse(a, b, d, c, e, f) {
      var g = this;return function () {
        g.recurse(a, b, d, c, e, f);
      };
    }, lazyAssign: function lazyAssign(a, b) {
      var d = this;return function () {
        d.assign(a, b);
      };
    }, stringEscapeRegex: /[^ a-zA-Z0-9]/g, stringEscapeFn: function stringEscapeFn(a) {
      return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
    }, escape: function escape(a) {
      if (G(a)) return "'" + a.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";if (T(a)) return a.toString();if (!0 === a) return "true";if (!1 === a) return "false";if (null === a) return "null";if ("undefined" === typeof a) return "undefined";throw X("esc");
    }, nextId: function nextId(a, b) {
      var d = "v" + this.state.nextId++;a || this.current().vars.push(d + (b ? "=" + b : ""));return d;
    }, current: function current() {
      return this.state[this.state.computing];
    } };ud.prototype = { compile: function compile(a, b) {
      var d = this,
          c = this.astBuilder.ast(a);this.expression = a;this.expensiveChecks = b;V(c, d.$filter);var e, f;if (e = rd(c)) f = this.recurse(e);e = pd(c.body);var g;e && (g = [], q(e, function (a, b) {
        var c = d.recurse(a);a.input = c;g.push(c);a.watchId = b;
      }));var h = [];q(c.body, function (a) {
        h.push(d.recurse(a.expression));
      });
      e = 0 === c.body.length ? A : 1 === c.body.length ? h[0] : function (a, b) {
        var c;q(h, function (d) {
          c = d(a, b);
        });return c;
      };f && (e.assign = function (a, b, c) {
        return f(a, c, b);
      });g && (e.inputs = g);e.literal = sd(c);e.constant = c.constant;return e;
    }, recurse: function recurse(a, b, d) {
      var c,
          e,
          f = this,
          g;if (a.input) return this.inputs(a.input, a.watchId);switch (a.type) {case s.Literal:
          return this.value(a.value, b);case s.UnaryExpression:
          return e = this.recurse(a.argument), this["unary" + a.operator](e, b);case s.BinaryExpression:
          return c = this.recurse(a.left), e = this.recurse(a.right), this["binary" + a.operator](c, e, b);case s.LogicalExpression:
          return c = this.recurse(a.left), e = this.recurse(a.right), this["binary" + a.operator](c, e, b);case s.ConditionalExpression:
          return this["ternary?:"](this.recurse(a.test), this.recurse(a.alternate), this.recurse(a.consequent), b);case s.Identifier:
          return Sa(a.name, f.expression), f.identifier(a.name, f.expensiveChecks || Jb(a.name), b, d, f.expression);case s.MemberExpression:
          return c = this.recurse(a.object, !1, !!d), a.computed || (Sa(a.property.name, f.expression), e = a.property.name), a.computed && (e = this.recurse(a.property)), a.computed ? this.computedMember(c, e, b, d, f.expression) : this.nonComputedMember(c, e, f.expensiveChecks, b, d, f.expression);case s.CallExpression:
          return g = [], q(a.arguments, function (a) {
            g.push(f.recurse(a));
          }), a.filter && (e = this.$filter(a.callee.name)), a.filter || (e = this.recurse(a.callee, !0)), a.filter ? function (a, c, d, f) {
            for (var n = [], p = 0; p < g.length; ++p) {
              n.push(g[p](a, c, d, f));
            }a = e.apply(void 0, n, f);return b ? { context: void 0, name: void 0, value: a } : a;
          } : function (a, c, d, m) {
            var n = e(a, c, d, m),
                p;if (null != n.value) {
              ra(n.context, f.expression);nd(n.value, f.expression);p = [];for (var q = 0; q < g.length; ++q) {
                p.push(ra(g[q](a, c, d, m), f.expression));
              }p = ra(n.value.apply(n.context, p), f.expression);
            }return b ? { value: p } : p;
          };case s.AssignmentExpression:
          return c = this.recurse(a.left, !0, 1), e = this.recurse(a.right), function (a, d, g, m) {
            var n = c(a, d, g, m);a = e(a, d, g, m);ra(n.value, f.expression);Ib(n.context);n.context[n.name] = a;return b ? { value: a } : a;
          };case s.ArrayExpression:
          return g = [], q(a.elements, function (a) {
            g.push(f.recurse(a));
          }), function (a, c, d, e) {
            for (var f = [], p = 0; p < g.length; ++p) {
              f.push(g[p](a, c, d, e));
            }return b ? { value: f } : f;
          };case s.ObjectExpression:
          return g = [], q(a.properties, function (a) {
            a.computed ? g.push({ key: f.recurse(a.key), computed: !0, value: f.recurse(a.value) }) : g.push({ key: a.key.type === s.Identifier ? a.key.name : "" + a.key.value, computed: !1, value: f.recurse(a.value) });
          }), function (a, c, d, e) {
            for (var f = {}, p = 0; p < g.length; ++p) {
              g[p].computed ? f[g[p].key(a, c, d, e)] = g[p].value(a, c, d, e) : f[g[p].key] = g[p].value(a, c, d, e);
            }return b ? { value: f } : f;
          };case s.ThisExpression:
          return function (a) {
            return b ? { value: a } : a;
          };case s.LocalsExpression:
          return function (a, c) {
            return b ? { value: c } : c;
          };case s.NGValueParameter:
          return function (a, c, d) {
            return b ? { value: d } : d;
          };}
    }, "unary+": function unary(a, b) {
      return function (d, c, e, f) {
        d = a(d, c, e, f);d = w(d) ? +d : 0;return b ? { value: d } : d;
      };
    }, "unary-": function unary(a, b) {
      return function (d, c, e, f) {
        d = a(d, c, e, f);d = w(d) ? -d : 0;return b ? { value: d } : d;
      };
    }, "unary!": function unary(a, b) {
      return function (d, c, e, f) {
        d = !a(d, c, e, f);return b ? { value: d } : d;
      };
    }, "binary+": function binary(a, b, d) {
      return function (c, e, f, g) {
        var h = a(c, e, f, g);c = b(c, e, f, g);h = od(h, c);return d ? { value: h } : h;
      };
    }, "binary-": function binary(a, b, d) {
      return function (c, e, f, g) {
        var h = a(c, e, f, g);c = b(c, e, f, g);h = (w(h) ? h : 0) - (w(c) ? c : 0);return d ? { value: h } : h;
      };
    }, "binary*": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) * b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary/": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) / b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary%": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) % b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary===": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) === b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary!==": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) !== b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary==": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) == b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary!=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) != b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary<": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) < b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary>": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) > b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary<=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) <= b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary>=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) >= b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary&&": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) && b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "binary||": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) || b(c, e, f, g);return d ? { value: c } : c;
      };
    }, "ternary?:": function ternary(a, b, d, c) {
      return function (e, f, g, h) {
        e = a(e, f, g, h) ? b(e, f, g, h) : d(e, f, g, h);return c ? { value: e } : e;
      };
    }, value: function value(a, b) {
      return function () {
        return b ? { context: void 0, name: void 0, value: a } : a;
      };
    }, identifier: function identifier(a, b, d, c, e) {
      return function (f, g, h, k) {
        f = g && a in g ? g : f;c && 1 !== c && f && !f[a] && (f[a] = {});g = f ? f[a] : void 0;b && ra(g, e);return d ? { context: f, name: a, value: g } : g;
      };
    }, computedMember: function computedMember(a, b, d, c, e) {
      return function (f, g, h, k) {
        var l = a(f, g, h, k),
            m,
            n;null != l && (m = b(f, g, h, k), m += "", Sa(m, e), c && 1 !== c && (Ib(l), l && !l[m] && (l[m] = {})), n = l[m], ra(n, e));return d ? { context: l, name: m, value: n } : n;
      };
    }, nonComputedMember: function nonComputedMember(a, b, d, c, e, f) {
      return function (g, h, k, l) {
        g = a(g, h, k, l);e && 1 !== e && (Ib(g), g && !g[b] && (g[b] = {}));h = null != g ? g[b] : void 0;(d || Jb(b)) && ra(h, f);return c ? { context: g, name: b, value: h } : h;
      };
    }, inputs: function inputs(a, b) {
      return function (d, c, e, f) {
        return f ? f[b] : a(d, c, e);
      };
    } };var kc = function kc(a, b, d) {
    this.lexer = a;this.$filter = b;this.options = d;this.ast = new s(a, d);this.astCompiler = d.csp ? new ud(this.ast, b) : new td(this.ast, b);
  };kc.prototype = { constructor: kc, parse: function parse(a) {
      return this.astCompiler.compile(a, this.options.expensiveChecks);
    } };var ng = Object.prototype.valueOf,
      sa = N("$sce"),
      la = { HTML: "html", CSS: "css", URL: "url", RESOURCE_URL: "resourceUrl", JS: "js" },
      pg = N("$compile"),
      $ = C.document.createElement("a"),
      yd = Y(C.location.href);zd.$inject = ["$document"];Mc.$inject = ["$provide"];var Gd = 22,
      Fd = ".",
      mc = "0";Ad.$inject = ["$locale"];Cd.$inject = ["$locale"];var Ag = { yyyy: ba("FullYear", 4, 0, !1, !0), yy: ba("FullYear", 2, 0, !0, !0), y: ba("FullYear", 1, 0, !1, !0), MMMM: kb("Month"), MMM: kb("Month", !0), MM: ba("Month", 2, 1), M: ba("Month", 1, 1), LLLL: kb("Month", !1, !0), dd: ba("Date", 2), d: ba("Date", 1), HH: ba("Hours", 2), H: ba("Hours", 1), hh: ba("Hours", 2, -12), h: ba("Hours", 1, -12), mm: ba("Minutes", 2), m: ba("Minutes", 1), ss: ba("Seconds", 2), s: ba("Seconds", 1), sss: ba("Milliseconds", 3), EEEE: kb("Day"), EEE: kb("Day", !0), a: function a(_a, b) {
      return 12 > _a.getHours() ? b.AMPMS[0] : b.AMPMS[1];
    }, Z: function Z(a, b, d) {
      a = -1 * d;return a = (0 <= a ? "+" : "") + (Kb(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + Kb(Math.abs(a % 60), 2));
    }, ww: Id(2), w: Id(1), G: nc, GG: nc, GGG: nc, GGGG: function GGGG(a, b) {
      return 0 >= a.getFullYear() ? b.ERANAMES[0] : b.ERANAMES[1];
    } },
      zg = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
      yg = /^\-?\d+$/;Bd.$inject = ["$locale"];var tg = ha(Q),
      ug = ha(ub);Dd.$inject = ["$parse"];var oe = ha({ restrict: "E", compile: function compile(a, b) {
      if (!b.href && !b.xlinkHref) return function (a, b) {
        if ("a" === b[0].nodeName.toLowerCase()) {
          var e = "[object SVGAnimatedString]" === ma.call(b.prop("href")) ? "xlink:href" : "href";b.on("click", function (a) {
            b.attr(e) || a.preventDefault();
          });
        }
      };
    } }),
      vb = {};q(Eb, function (a, b) {
    function d(a, d, e) {
      a.$watch(e[c], function (a) {
        e.$set(b, !!a);
      });
    }if ("multiple" != a) {
      var c = Aa("ng-" + b),
          e = d;"checked" === a && (e = function e(a, b, _e) {
        _e.ngModel !== _e[c] && d(a, b, _e);
      });vb[c] = function () {
        return { restrict: "A", priority: 100, link: e };
      };
    }
  });q(bd, function (a, b) {
    vb[b] = function () {
      return { priority: 100, link: function link(a, c, e) {
          if ("ngPattern" === b && "/" == e.ngPattern.charAt(0) && (c = e.ngPattern.match(Cg))) {
            e.$set("ngPattern", new RegExp(c[1], c[2]));return;
          }a.$watch(e[b], function (a) {
            e.$set(b, a);
          });
        } };
    };
  });q(["src", "srcset", "href"], function (a) {
    var b = Aa("ng-" + a);vb[b] = function () {
      return { priority: 99, link: function link(d, c, e) {
          var f = a,
              g = a;"href" === a && "[object SVGAnimatedString]" === ma.call(c.prop("href")) && (g = "xlinkHref", e.$attr[g] = "xlink:href", f = null);e.$observe(b, function (b) {
            b ? (e.$set(g, b), Ea && f && c.prop(f, e[g])) : "href" === a && e.$set(g, null);
          });
        } };
    };
  });var Lb = { $addControl: A, $$renameControl: function $$renameControl(a, b) {
      a.$name = b;
    }, $removeControl: A, $setValidity: A,
    $setDirty: A, $setPristine: A, $setSubmitted: A };Jd.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];var Sd = function Sd(a) {
    return ["$timeout", "$parse", function (b, d) {
      function c(a) {
        return "" === a ? d('this[""]').assign : d(a).assign || A;
      }return { name: "form", restrict: a ? "EAC" : "E", require: ["form", "^^?form"], controller: Jd, compile: function compile(d, f) {
          d.addClass(Ua).addClass(ob);var g = f.name ? "name" : a && f.ngForm ? "ngForm" : !1;return { pre: function pre(a, d, e, f) {
              var n = f[0];if (!("action" in e)) {
                var p = function p(b) {
                  a.$apply(function () {
                    n.$commitViewValue();
                    n.$setSubmitted();
                  });b.preventDefault();
                };d[0].addEventListener("submit", p, !1);d.on("$destroy", function () {
                  b(function () {
                    d[0].removeEventListener("submit", p, !1);
                  }, 0, !1);
                });
              }(f[1] || n.$$parentForm).$addControl(n);var q = g ? c(n.$name) : A;g && (q(a, n), e.$observe(g, function (b) {
                n.$name !== b && (q(a, void 0), n.$$parentForm.$$renameControl(n, b), q = c(n.$name), q(a, n));
              }));d.on("$destroy", function () {
                n.$$parentForm.$removeControl(n);q(a, void 0);S(n, Lb);
              });
            } };
        } };
    }];
  },
      pe = Sd(),
      Ce = Sd(!0),
      Bg = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/,
      Kg = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,
      Lg = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
      Mg = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,
      Td = /^(\d{4,})-(\d{2})-(\d{2})$/,
      Ud = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
      rc = /^(\d{4,})-W(\d\d)$/,
      Vd = /^(\d{4,})-(\d\d)$/,
      Wd = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
      Ld = U();q(["date", "datetime-local", "month", "time", "week"], function (a) {
    Ld[a] = !0;
  });var Xd = { text: function text(a, b, d, c, e, f) {
      lb(a, b, d, c, e, f);pc(c);
    }, date: mb("date", Td, Nb(Td, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"), "datetime-local": mb("datetimelocal", Ud, Nb(Ud, "yyyy MM dd HH mm ss sss".split(" ")), "yyyy-MM-ddTHH:mm:ss.sss"), time: mb("time", Wd, Nb(Wd, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"), week: mb("week", rc, function (a, b) {
      if (da(a)) return a;if (G(a)) {
        rc.lastIndex = 0;var d = rc.exec(a);
        if (d) {
          var c = +d[1],
              e = +d[2],
              f = d = 0,
              g = 0,
              h = 0,
              k = Hd(c),
              e = 7 * (e - 1);b && (d = b.getHours(), f = b.getMinutes(), g = b.getSeconds(), h = b.getMilliseconds());return new Date(c, 0, k.getDate() + e, d, f, g, h);
        }
      }return NaN;
    }, "yyyy-Www"), month: mb("month", Vd, Nb(Vd, ["yyyy", "MM"]), "yyyy-MM"), number: function number(a, b, d, c, e, f) {
      Md(a, b, d, c);lb(a, b, d, c, e, f);c.$$parserName = "number";c.$parsers.push(function (a) {
        if (c.$isEmpty(a)) return null;if (Mg.test(a)) return parseFloat(a);
      });c.$formatters.push(function (a) {
        if (!c.$isEmpty(a)) {
          if (!T(a)) throw nb("numfmt", a);a = a.toString();
        }return a;
      });if (w(d.min) || d.ngMin) {
        var g;c.$validators.min = function (a) {
          return c.$isEmpty(a) || y(g) || a >= g;
        };d.$observe("min", function (a) {
          w(a) && !T(a) && (a = parseFloat(a));g = T(a) && !isNaN(a) ? a : void 0;c.$validate();
        });
      }if (w(d.max) || d.ngMax) {
        var h;c.$validators.max = function (a) {
          return c.$isEmpty(a) || y(h) || a <= h;
        };d.$observe("max", function (a) {
          w(a) && !T(a) && (a = parseFloat(a));h = T(a) && !isNaN(a) ? a : void 0;c.$validate();
        });
      }
    }, url: function url(a, b, d, c, e, f) {
      lb(a, b, d, c, e, f);pc(c);c.$$parserName = "url";c.$validators.url = function (a, b) {
        var d = a || b;return c.$isEmpty(d) || Kg.test(d);
      };
    }, email: function email(a, b, d, c, e, f) {
      lb(a, b, d, c, e, f);pc(c);c.$$parserName = "email";c.$validators.email = function (a, b) {
        var d = a || b;return c.$isEmpty(d) || Lg.test(d);
      };
    }, radio: function radio(a, b, d, c) {
      y(d.name) && b.attr("name", ++pb);b.on("click", function (a) {
        b[0].checked && c.$setViewValue(d.value, a && a.type);
      });c.$render = function () {
        b[0].checked = d.value == c.$viewValue;
      };d.$observe("value", c.$render);
    }, checkbox: function checkbox(a, b, d, c, e, f, g, h) {
      var k = Nd(h, a, "ngTrueValue", d.ngTrueValue, !0),
          l = Nd(h, a, "ngFalseValue", d.ngFalseValue, !1);b.on("click", function (a) {
        c.$setViewValue(b[0].checked, a && a.type);
      });c.$render = function () {
        b[0].checked = c.$viewValue;
      };c.$isEmpty = function (a) {
        return !1 === a;
      };c.$formatters.push(function (a) {
        return na(a, k);
      });c.$parsers.push(function (a) {
        return a ? k : l;
      });
    }, hidden: A, button: A, submit: A, reset: A, file: A },
      Gc = ["$browser", "$sniffer", "$filter", "$parse", function (a, b, d, c) {
    return { restrict: "E", require: ["?ngModel"], link: { pre: function pre(e, f, g, h) {
          h[0] && (Xd[Q(g.type)] || Xd.text)(e, f, g, h[0], b, a, d, c);
        } } };
  }],
      Ng = /^(true|false|\d+)$/,
      Ue = function Ue() {
    return { restrict: "A", priority: 100, compile: function compile(a, b) {
        return Ng.test(b.ngValue) ? function (a, b, e) {
          e.$set("value", a.$eval(e.ngValue));
        } : function (a, b, e) {
          a.$watch(e.ngValue, function (a) {
            e.$set("value", a);
          });
        };
      } };
  },
      ue = ["$compile", function (a) {
    return { restrict: "AC", compile: function compile(b) {
        a.$$addBindingClass(b);return function (b, c, e) {
          a.$$addBindingInfo(c, e.ngBind);c = c[0];b.$watch(e.ngBind, function (a) {
            c.textContent = y(a) ? "" : a;
          });
        };
      } };
  }],
      we = ["$interpolate", "$compile", function (a, b) {
    return { compile: function compile(d) {
        b.$$addBindingClass(d);return function (c, d, f) {
          c = a(d.attr(f.$attr.ngBindTemplate));b.$$addBindingInfo(d, c.expressions);d = d[0];f.$observe("ngBindTemplate", function (a) {
            d.textContent = y(a) ? "" : a;
          });
        };
      } };
  }],
      ve = ["$sce", "$parse", "$compile", function (a, b, d) {
    return { restrict: "A", compile: function compile(c, e) {
        var f = b(e.ngBindHtml),
            g = b(e.ngBindHtml, function (b) {
          return a.valueOf(b);
        });d.$$addBindingClass(c);return function (b, c, e) {
          d.$$addBindingInfo(c, e.ngBindHtml);b.$watch(g, function () {
            var d = f(b);c.html(a.getTrustedHtml(d) || "");
          });
        };
      } };
  }],
      Te = ha({ restrict: "A", require: "ngModel", link: function link(a, b, d, c) {
      c.$viewChangeListeners.push(function () {
        a.$eval(d.ngChange);
      });
    } }),
      xe = qc("", !0),
      ze = qc("Odd", 0),
      ye = qc("Even", 1),
      Ae = Ta({ compile: function compile(a, b) {
      b.$set("ngCloak", void 0);a.removeClass("ng-cloak");
    } }),
      Be = [function () {
    return { restrict: "A", scope: !0, controller: "@", priority: 500 };
  }],
      Lc = {},
      Og = { blur: !0, focus: !0 };q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function (a) {
    var b = Aa("ng-" + a);Lc[b] = ["$parse", "$rootScope", function (d, c) {
      return { restrict: "A", compile: function compile(e, f) {
          var g = d(f[b], null, !0);return function (b, d) {
            d.on(a, function (d) {
              var e = function e() {
                g(b, { $event: d });
              };Og[a] && c.$$phase ? b.$evalAsync(e) : b.$apply(e);
            });
          };
        } };
    }];
  });var Ee = ["$animate", "$compile", function (a, b) {
    return { multiElement: !0, transclude: "element", priority: 600, terminal: !0, restrict: "A", $$tlb: !0, link: function link(d, c, e, f, g) {
        var h, k, l;d.$watch(e.ngIf, function (d) {
          d ? k || g(function (d, f) {
            k = f;d[d.length++] = b.$$createComment("end ngIf", e.ngIf);h = { clone: d };a.enter(d, c.parent(), c);
          }) : (l && (l.remove(), l = null), k && (k.$destroy(), k = null), h && (l = tb(h.clone), a.leave(l).then(function () {
            l = null;
          }), h = null));
        });
      } };
  }],
      Fe = ["$templateRequest", "$anchorScroll", "$animate", function (a, b, d) {
    return { restrict: "ECA", priority: 400, terminal: !0, transclude: "element", controller: ca.noop, compile: function compile(c, e) {
        var f = e.ngInclude || e.src,
            g = e.onload || "",
            h = e.autoscroll;return function (c, e, m, n, p) {
          var q = 0,
              s,
              B,
              r,
              y = function y() {
            B && (B.remove(), B = null);s && (s.$destroy(), s = null);r && (d.leave(r).then(function () {
              B = null;
            }), B = r, r = null);
          };c.$watch(f, function (f) {
            var m = function m() {
              !w(h) || h && !c.$eval(h) || b();
            },
                t = ++q;f ? (a(f, !0).then(function (a) {
              if (!c.$$destroyed && t === q) {
                var b = c.$new();n.template = a;a = p(b, function (a) {
                  y();d.enter(a, null, e).then(m);
                });s = b;r = a;s.$emit("$includeContentLoaded", f);c.$eval(g);
              }
            }, function () {
              c.$$destroyed || t !== q || (y(), c.$emit("$includeContentError", f));
            }), c.$emit("$includeContentRequested", f)) : (y(), n.template = null);
          });
        };
      } };
  }],
      We = ["$compile", function (a) {
    return { restrict: "ECA",
      priority: -400, require: "ngInclude", link: function link(b, d, c, e) {
        ma.call(d[0]).match(/SVG/) ? (d.empty(), a(Oc(e.template, C.document).childNodes)(b, function (a) {
          d.append(a);
        }, { futureParentElement: d })) : (d.html(e.template), a(d.contents())(b));
      } };
  }],
      Ge = Ta({ priority: 450, compile: function compile() {
      return { pre: function pre(a, b, d) {
          a.$eval(d.ngInit);
        } };
    } }),
      Se = function Se() {
    return { restrict: "A", priority: 100, require: "ngModel", link: function link(a, b, d, c) {
        var e = b.attr(d.$attr.ngList) || ", ",
            f = "false" !== d.ngTrim,
            g = f ? W(e) : e;c.$parsers.push(function (a) {
          if (!y(a)) {
            var b = [];a && q(a.split(g), function (a) {
              a && b.push(f ? W(a) : a);
            });return b;
          }
        });c.$formatters.push(function (a) {
          if (L(a)) return a.join(e);
        });c.$isEmpty = function (a) {
          return !a || !a.length;
        };
      } };
  },
      ob = "ng-valid",
      Od = "ng-invalid",
      Ua = "ng-pristine",
      Mb = "ng-dirty",
      Qd = "ng-pending",
      nb = N("ngModel"),
      Pg = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function (a, b, d, c, e, f, g, h, k, l) {
    this.$modelValue = this.$viewValue = Number.NaN;this.$$rawModelValue = void 0;this.$validators = {};
    this.$asyncValidators = {};this.$parsers = [];this.$formatters = [];this.$viewChangeListeners = [];this.$untouched = !0;this.$touched = !1;this.$pristine = !0;this.$dirty = !1;this.$valid = !0;this.$invalid = !1;this.$error = {};this.$$success = {};this.$pending = void 0;this.$name = l(d.name || "", !1)(a);this.$$parentForm = Lb;var m = e(d.ngModel),
        n = m.assign,
        p = m,
        u = n,
        s = null,
        B,
        r = this;this.$$setOptions = function (a) {
      if ((r.$options = a) && a.getterSetter) {
        var b = e(d.ngModel + "()"),
            f = e(d.ngModel + "($$$p)");p = function p(a) {
          var c = m(a);z(c) && (c = b(a));
          return c;
        };u = function u(a, b) {
          z(m(a)) ? f(a, { $$$p: b }) : n(a, b);
        };
      } else if (!m.assign) throw nb("nonassign", d.ngModel, ya(c));
    };this.$render = A;this.$isEmpty = function (a) {
      return y(a) || "" === a || null === a || a !== a;
    };this.$$updateEmptyClasses = function (a) {
      r.$isEmpty(a) ? (f.removeClass(c, "ng-not-empty"), f.addClass(c, "ng-empty")) : (f.removeClass(c, "ng-empty"), f.addClass(c, "ng-not-empty"));
    };var J = 0;Kd({ ctrl: this, $element: c, set: function set(a, b) {
        a[b] = !0;
      }, unset: function unset(a, b) {
        delete a[b];
      }, $animate: f });this.$setPristine = function () {
      r.$dirty = !1;r.$pristine = !0;f.removeClass(c, Mb);f.addClass(c, Ua);
    };this.$setDirty = function () {
      r.$dirty = !0;r.$pristine = !1;f.removeClass(c, Ua);f.addClass(c, Mb);r.$$parentForm.$setDirty();
    };this.$setUntouched = function () {
      r.$touched = !1;r.$untouched = !0;f.setClass(c, "ng-untouched", "ng-touched");
    };this.$setTouched = function () {
      r.$touched = !0;r.$untouched = !1;f.setClass(c, "ng-touched", "ng-untouched");
    };this.$rollbackViewValue = function () {
      g.cancel(s);r.$viewValue = r.$$lastCommittedViewValue;r.$render();
    };this.$validate = function () {
      if (!T(r.$modelValue) || !isNaN(r.$modelValue)) {
        var a = r.$$rawModelValue,
            b = r.$valid,
            c = r.$modelValue,
            d = r.$options && r.$options.allowInvalid;r.$$runValidators(a, r.$$lastCommittedViewValue, function (e) {
          d || b === e || (r.$modelValue = e ? a : void 0, r.$modelValue !== c && r.$$writeModelToScope());
        });
      }
    };this.$$runValidators = function (a, b, c) {
      function d() {
        var c = !0;q(r.$validators, function (d, e) {
          var g = d(a, b);c = c && g;f(e, g);
        });return c ? !0 : (q(r.$asyncValidators, function (a, b) {
          f(b, null);
        }), !1);
      }function e() {
        var c = [],
            d = !0;q(r.$asyncValidators, function (e, g) {
          var h = e(a, b);if (!h || !z(h.then)) throw nb("nopromise", h);f(g, void 0);c.push(h.then(function () {
            f(g, !0);
          }, function () {
            d = !1;f(g, !1);
          }));
        });c.length ? k.all(c).then(function () {
          g(d);
        }, A) : g(!0);
      }function f(a, b) {
        h === J && r.$setValidity(a, b);
      }function g(a) {
        h === J && c(a);
      }J++;var h = J;(function () {
        var a = r.$$parserName || "parse";if (y(B)) f(a, null);else return B || (q(r.$validators, function (a, b) {
          f(b, null);
        }), q(r.$asyncValidators, function (a, b) {
          f(b, null);
        })), f(a, B), B;return !0;
      })() ? d() ? e() : g(!1) : g(!1);
    };this.$commitViewValue = function () {
      var a = r.$viewValue;g.cancel(s);if (r.$$lastCommittedViewValue !== a || "" === a && r.$$hasNativeValidators) r.$$updateEmptyClasses(a), r.$$lastCommittedViewValue = a, r.$pristine && this.$setDirty(), this.$$parseAndValidate();
    };this.$$parseAndValidate = function () {
      var b = r.$$lastCommittedViewValue;if (B = y(b) ? void 0 : !0) for (var c = 0; c < r.$parsers.length; c++) {
        if (b = r.$parsers[c](b), y(b)) {
          B = !1;break;
        }
      }T(r.$modelValue) && isNaN(r.$modelValue) && (r.$modelValue = p(a));var d = r.$modelValue,
          e = r.$options && r.$options.allowInvalid;r.$$rawModelValue = b;e && (r.$modelValue = b, r.$modelValue !== d && r.$$writeModelToScope());r.$$runValidators(b, r.$$lastCommittedViewValue, function (a) {
        e || (r.$modelValue = a ? b : void 0, r.$modelValue !== d && r.$$writeModelToScope());
      });
    };this.$$writeModelToScope = function () {
      u(a, r.$modelValue);q(r.$viewChangeListeners, function (a) {
        try {
          a();
        } catch (c) {
          b(c);
        }
      });
    };this.$setViewValue = function (a, b) {
      r.$viewValue = a;r.$options && !r.$options.updateOnDefault || r.$$debounceViewValueCommit(b);
    };this.$$debounceViewValueCommit = function (b) {
      var c = 0,
          d = r.$options;
      d && w(d.debounce) && (d = d.debounce, T(d) ? c = d : T(d[b]) ? c = d[b] : T(d["default"]) && (c = d["default"]));g.cancel(s);c ? s = g(function () {
        r.$commitViewValue();
      }, c) : h.$$phase ? r.$commitViewValue() : a.$apply(function () {
        r.$commitViewValue();
      });
    };a.$watch(function () {
      var b = p(a);if (b !== r.$modelValue && (r.$modelValue === r.$modelValue || b === b)) {
        r.$modelValue = r.$$rawModelValue = b;B = void 0;for (var c = r.$formatters, d = c.length, e = b; d--;) {
          e = c[d](e);
        }r.$viewValue !== e && (r.$$updateEmptyClasses(e), r.$viewValue = r.$$lastCommittedViewValue = e, r.$render(), r.$$runValidators(b, e, A));
      }return b;
    });
  }],
      Re = ["$rootScope", function (a) {
    return { restrict: "A", require: ["ngModel", "^?form", "^?ngModelOptions"], controller: Pg, priority: 1, compile: function compile(b) {
        b.addClass(Ua).addClass("ng-untouched").addClass(ob);return { pre: function pre(a, b, e, f) {
            var g = f[0];b = f[1] || g.$$parentForm;g.$$setOptions(f[2] && f[2].$options);b.$addControl(g);e.$observe("name", function (a) {
              g.$name !== a && g.$$parentForm.$$renameControl(g, a);
            });a.$on("$destroy", function () {
              g.$$parentForm.$removeControl(g);
            });
          }, post: function post(b, c, e, f) {
            var g = f[0];if (g.$options && g.$options.updateOn) c.on(g.$options.updateOn, function (a) {
              g.$$debounceViewValueCommit(a && a.type);
            });c.on("blur", function () {
              g.$touched || (a.$$phase ? b.$evalAsync(g.$setTouched) : b.$apply(g.$setTouched));
            });
          } };
      } };
  }],
      Qg = /(\s+|^)default(\s+|$)/,
      Ve = function Ve() {
    return { restrict: "A", controller: ["$scope", "$attrs", function (a, b) {
        var d = this;this.$options = pa(a.$eval(b.ngModelOptions));w(this.$options.updateOn) ? (this.$options.updateOnDefault = !1, this.$options.updateOn = W(this.$options.updateOn.replace(Qg, function () {
          d.$options.updateOnDefault = !0;return " ";
        }))) : this.$options.updateOnDefault = !0;
      }] };
  },
      He = Ta({ terminal: !0, priority: 1E3 }),
      Rg = N("ngOptions"),
      Sg = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
      Pe = ["$compile", "$document", "$parse", function (a, b, d) {
    function c(a, b, c) {
      function e(a, b, c, d, f) {
        this.selectValue = a;this.viewValue = b;this.label = c;this.group = d;this.disabled = f;
      }function f(a) {
        var b;if (!q && ta(a)) b = a;else {
          b = [];for (var c in a) {
            a.hasOwnProperty(c) && "$" !== c.charAt(0) && b.push(c);
          }
        }return b;
      }var n = a.match(Sg);if (!n) throw Rg("iexp", a, ya(b));var p = n[5] || n[7],
          q = n[6];a = / as /.test(n[0]) && n[1];var s = n[9];b = d(n[2] ? n[1] : p);var w = a && d(a) || b,
          r = s && d(s),
          y = s ? function (a, b) {
        return r(c, b);
      } : function (a) {
        return Ca(a);
      },
          v = function v(a, b) {
        return y(a, E(a, b));
      },
          A = d(n[2] || n[1]),
          t = d(n[3] || ""),
          K = d(n[4] || ""),
          z = d(n[8]),
          H = {},
          E = q ? function (a, b) {
        H[q] = b;H[p] = a;return H;
      } : function (a) {
        H[p] = a;return H;
      };return { trackBy: s, getTrackByValue: v, getWatchables: d(z, function (a) {
          var b = [];a = a || [];for (var d = f(a), e = d.length, g = 0; g < e; g++) {
            var h = a === d ? g : d[g],
                l = a[h],
                h = E(l, h),
                l = y(l, h);b.push(l);if (n[2] || n[1]) l = A(c, h), b.push(l);n[4] && (h = K(c, h), b.push(h));
          }return b;
        }), getOptions: function getOptions() {
          for (var a = [], b = {}, d = z(c) || [], g = f(d), h = g.length, n = 0; n < h; n++) {
            var p = d === g ? n : g[n],
                q = E(d[p], p),
                r = w(c, q),
                p = y(r, q),
                u = A(c, q),
                H = t(c, q),
                q = K(c, q),
                r = new e(p, r, u, H, q);a.push(r);b[p] = r;
          }return { items: a, selectValueMap: b,
            getOptionFromViewValue: function getOptionFromViewValue(a) {
              return b[v(a)];
            }, getViewValueFromOption: function getViewValueFromOption(a) {
              return s ? ca.copy(a.viewValue) : a.viewValue;
            } };
        } };
    }var e = C.document.createElement("option"),
        f = C.document.createElement("optgroup");return { restrict: "A", terminal: !0, require: ["select", "ngModel"], link: { pre: function pre(a, b, c, d) {
          d[0].registerOption = A;
        }, post: function post(d, h, k, l) {
          function m(a, b) {
            a.element = b;b.disabled = a.disabled;a.label !== b.label && (b.label = a.label, b.textContent = a.label);a.value !== b.value && (b.value = a.selectValue);
          }function n() {
            var a = t && p.readValue();if (t) for (var b = t.items.length - 1; 0 <= b; b--) {
              var c = t.items[b];w(c.group) ? Db(c.element.parentNode) : Db(c.element);
            }t = K.getOptions();var d = {};v && h.prepend(B);t.items.forEach(function (a) {
              var b;if (w(a.group)) {
                b = d[a.group];b || (b = f.cloneNode(!1), C.appendChild(b), b.label = null === a.group ? "null" : a.group, d[a.group] = b);var c = e.cloneNode(!1);
              } else b = C, c = e.cloneNode(!1);b.appendChild(c);m(a, c);
            });h[0].appendChild(C);s.$render();s.$isEmpty(a) || (b = p.readValue(), (K.trackBy || y ? na(a, b) : a === b) || (s.$setViewValue(b), s.$render()));
          }var p = l[0],
              s = l[1],
              y = k.multiple,
              B;l = 0;for (var r = h.children(), A = r.length; l < A; l++) {
            if ("" === r[l].value) {
              B = r.eq(l);break;
            }
          }var v = !!B,
              z = F(e.cloneNode(!1));z.val("?");var t,
              K = c(k.ngOptions, h, d),
              C = b[0].createDocumentFragment();y ? (s.$isEmpty = function (a) {
            return !a || 0 === a.length;
          }, p.writeValue = function (a) {
            t.items.forEach(function (a) {
              a.element.selected = !1;
            });a && a.forEach(function (a) {
              if (a = t.getOptionFromViewValue(a)) a.element.selected = !0;
            });
          }, p.readValue = function () {
            var a = h.val() || [],
                b = [];q(a, function (a) {
              (a = t.selectValueMap[a]) && !a.disabled && b.push(t.getViewValueFromOption(a));
            });return b;
          }, K.trackBy && d.$watchCollection(function () {
            if (L(s.$viewValue)) return s.$viewValue.map(function (a) {
              return K.getTrackByValue(a);
            });
          }, function () {
            s.$render();
          })) : (p.writeValue = function (a) {
            var b = t.getOptionFromViewValue(a);b ? (h[0].value !== b.selectValue && (z.remove(), v || B.remove(), h[0].value = b.selectValue, b.element.selected = !0), b.element.setAttribute("selected", "selected")) : null === a || v ? (z.remove(), v || h.prepend(B), h.val(""), B.prop("selected", !0), B.attr("selected", !0)) : (v || B.remove(), h.prepend(z), h.val("?"), z.prop("selected", !0), z.attr("selected", !0));
          }, p.readValue = function () {
            var a = t.selectValueMap[h.val()];return a && !a.disabled ? (v || B.remove(), z.remove(), t.getViewValueFromOption(a)) : null;
          }, K.trackBy && d.$watch(function () {
            return K.getTrackByValue(s.$viewValue);
          }, function () {
            s.$render();
          }));v ? (B.remove(), a(B)(d), B.removeClass("ng-scope")) : B = F(e.cloneNode(!1));h.empty();n();d.$watchCollection(K.getWatchables, n);
        } } };
  }],
      Ie = ["$locale", "$interpolate", "$log", function (a, b, d) {
    var c = /{}/g,
        e = /^when(Minus)?(.+)$/;return { link: function link(f, g, h) {
        function k(a) {
          g.text(a || "");
        }var l = h.count,
            m = h.$attr.when && g.attr(h.$attr.when),
            n = h.offset || 0,
            p = f.$eval(m) || {},
            s = {},
            w = b.startSymbol(),
            B = b.endSymbol(),
            r = w + l + "-" + n + B,
            z = ca.noop,
            v;q(h, function (a, b) {
          var c = e.exec(b);c && (c = (c[1] ? "-" : "") + Q(c[2]), p[c] = g.attr(h.$attr[b]));
        });q(p, function (a, d) {
          s[d] = b(a.replace(c, r));
        });f.$watch(l, function (b) {
          var c = parseFloat(b),
              e = isNaN(c);e || c in p || (c = a.pluralCat(c - n));c === v || e && T(v) && isNaN(v) || (z(), e = s[c], y(e) ? (null != b && d.debug("ngPluralize: no rule defined for '" + c + "' in " + m), z = A, k()) : z = f.$watch(e, k), v = c);
        });
      } };
  }],
      Je = ["$parse", "$animate", "$compile", function (a, b, d) {
    var c = N("ngRepeat"),
        e = function e(a, b, c, d, _e2, m, n) {
      a[c] = d;_e2 && (a[_e2] = m);a.$index = b;a.$first = 0 === b;a.$last = b === n - 1;a.$middle = !(a.$first || a.$last);a.$odd = !(a.$even = 0 === (b & 1));
    };return { restrict: "A", multiElement: !0, transclude: "element", priority: 1E3, terminal: !0, $$tlb: !0, compile: function compile(f, g) {
        var h = g.ngRepeat,
            k = d.$$createComment("end ngRepeat", h),
            l = h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if (!l) throw c("iexp", h);var m = l[1],
            n = l[2],
            p = l[3],
            s = l[4],
            l = m.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);if (!l) throw c("iidexp", m);var w = l[3] || l[1],
            y = l[2];if (p && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(p) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(p))) throw c("badident", p);var r,
            z,
            v,
            A,
            t = { $id: Ca };s ? r = a(s) : (v = function v(a, b) {
          return Ca(b);
        }, A = function A(a) {
          return a;
        });return function (a, d, f, g, l) {
          r && (z = function z(b, c, d) {
            y && (t[y] = b);t[w] = c;t.$index = d;return r(a, t);
          });var m = U();a.$watchCollection(n, function (f) {
            var g,
                n,
                r = d[0],
                s,
                u = U(),
                t,
                C,
                F,
                E,
                G,
                D,
                H;p && (a[p] = f);if (ta(f)) G = f, n = z || v;else for (H in n = z || A, G = [], f) {
              ua.call(f, H) && "$" !== H.charAt(0) && G.push(H);
            }t = G.length;H = Array(t);for (g = 0; g < t; g++) {
              if (C = f === G ? g : G[g], F = f[C], E = n(C, F, g), m[E]) D = m[E], delete m[E], u[E] = D, H[g] = D;else {
                if (u[E]) throw q(H, function (a) {
                  a && a.scope && (m[a.id] = a);
                }), c("dupes", h, E, F);H[g] = { id: E,
                  scope: void 0, clone: void 0 };u[E] = !0;
              }
            }for (s in m) {
              D = m[s];E = tb(D.clone);b.leave(E);if (E[0].parentNode) for (g = 0, n = E.length; g < n; g++) {
                E[g].$$NG_REMOVED = !0;
              }D.scope.$destroy();
            }for (g = 0; g < t; g++) {
              if (C = f === G ? g : G[g], F = f[C], D = H[g], D.scope) {
                s = r;do {
                  s = s.nextSibling;
                } while (s && s.$$NG_REMOVED);D.clone[0] != s && b.move(tb(D.clone), null, r);r = D.clone[D.clone.length - 1];e(D.scope, g, w, F, y, C, t);
              } else l(function (a, c) {
                D.scope = c;var d = k.cloneNode(!1);a[a.length++] = d;b.enter(a, null, r);r = d;D.clone = a;u[D.id] = D;e(D.scope, g, w, F, y, C, t);
              });
            }m = u;
          });
        };
      } };
  }],
      Ke = ["$animate", function (a) {
    return { restrict: "A", multiElement: !0, link: function link(b, d, c) {
        b.$watch(c.ngShow, function (b) {
          a[b ? "removeClass" : "addClass"](d, "ng-hide", { tempClasses: "ng-hide-animate" });
        });
      } };
  }],
      De = ["$animate", function (a) {
    return { restrict: "A", multiElement: !0, link: function link(b, d, c) {
        b.$watch(c.ngHide, function (b) {
          a[b ? "addClass" : "removeClass"](d, "ng-hide", { tempClasses: "ng-hide-animate" });
        });
      } };
  }],
      Le = Ta(function (a, b, d) {
    a.$watch(d.ngStyle, function (a, d) {
      d && a !== d && q(d, function (a, c) {
        b.css(c, "");
      });a && b.css(a);
    }, !0);
  }),
      Me = ["$animate", "$compile", function (a, b) {
    return { require: "ngSwitch", controller: ["$scope", function () {
        this.cases = {};
      }], link: function link(d, c, e, f) {
        var g = [],
            h = [],
            k = [],
            l = [],
            m = function m(a, b) {
          return function () {
            a.splice(b, 1);
          };
        };d.$watch(e.ngSwitch || e.on, function (c) {
          var d, e;d = 0;for (e = k.length; d < e; ++d) {
            a.cancel(k[d]);
          }d = k.length = 0;for (e = l.length; d < e; ++d) {
            var s = tb(h[d].clone);l[d].$destroy();(k[d] = a.leave(s)).then(m(k, d));
          }h.length = 0;l.length = 0;(g = f.cases["!" + c] || f.cases["?"]) && q(g, function (c) {
            c.transclude(function (d, e) {
              l.push(e);var f = c.element;d[d.length++] = b.$$createComment("end ngSwitchWhen");h.push({ clone: d });a.enter(d, f.parent(), f);
            });
          });
        });
      } };
  }],
      Ne = Ta({ transclude: "element", priority: 1200, require: "^ngSwitch", multiElement: !0, link: function link(a, b, d, c, e) {
      c.cases["!" + d.ngSwitchWhen] = c.cases["!" + d.ngSwitchWhen] || [];c.cases["!" + d.ngSwitchWhen].push({ transclude: e, element: b });
    } }),
      Oe = Ta({ transclude: "element", priority: 1200, require: "^ngSwitch", multiElement: !0, link: function link(a, b, d, c, e) {
      c.cases["?"] = c.cases["?"] || [];c.cases["?"].push({ transclude: e,
        element: b });
    } }),
      Tg = N("ngTransclude"),
      Qe = ["$compile", function (a) {
    return { restrict: "EAC", terminal: !0, compile: function compile(b) {
        var d = a(b.contents());b.empty();return function (a, b, f, g, h) {
          function k() {
            d(a, function (a) {
              b.append(a);
            });
          }if (!h) throw Tg("orphan", ya(b));f.ngTransclude === f.$attr.ngTransclude && (f.ngTransclude = "");f = f.ngTransclude || f.ngTranscludeSlot;h(function (a, c) {
            a.length ? b.append(a) : (k(), c.$destroy());
          }, null, f);f && !h.isSlotFilled(f) && k();
        };
      } };
  }],
      qe = ["$templateCache", function (a) {
    return { restrict: "E", terminal: !0,
      compile: function compile(b, d) {
        "text/ng-template" == d.type && a.put(d.id, b[0].text);
      } };
  }],
      Ug = { $setViewValue: A, $render: A },
      Vg = ["$element", "$scope", function (a, b) {
    var d = this,
        c = new Ra();d.ngModelCtrl = Ug;d.unknownOption = F(C.document.createElement("option"));d.renderUnknownOption = function (b) {
      b = "? " + Ca(b) + " ?";d.unknownOption.val(b);a.prepend(d.unknownOption);a.val(b);
    };b.$on("$destroy", function () {
      d.renderUnknownOption = A;
    });d.removeUnknownOption = function () {
      d.unknownOption.parent() && d.unknownOption.remove();
    };d.readValue = function () {
      d.removeUnknownOption();
      return a.val();
    };d.writeValue = function (b) {
      d.hasOption(b) ? (d.removeUnknownOption(), a.val(b), "" === b && d.emptyOption.prop("selected", !0)) : null == b && d.emptyOption ? (d.removeUnknownOption(), a.val("")) : d.renderUnknownOption(b);
    };d.addOption = function (a, b) {
      if (8 !== b[0].nodeType) {
        Qa(a, '"option value"');"" === a && (d.emptyOption = b);var g = c.get(a) || 0;c.put(a, g + 1);d.ngModelCtrl.$render();b[0].hasAttribute("selected") && (b[0].selected = !0);
      }
    };d.removeOption = function (a) {
      var b = c.get(a);b && (1 === b ? (c.remove(a), "" === a && (d.emptyOption = void 0)) : c.put(a, b - 1));
    };d.hasOption = function (a) {
      return !!c.get(a);
    };d.registerOption = function (a, b, c, h, k) {
      if (h) {
        var l;c.$observe("value", function (a) {
          w(l) && d.removeOption(l);l = a;d.addOption(a, b);
        });
      } else k ? a.$watch(k, function (a, e) {
        c.$set("value", a);e !== a && d.removeOption(e);d.addOption(a, b);
      }) : d.addOption(c.value, b);b.on("$destroy", function () {
        d.removeOption(c.value);d.ngModelCtrl.$render();
      });
    };
  }],
      re = function re() {
    return { restrict: "E", require: ["select", "?ngModel"], controller: Vg, priority: 1, link: { pre: function pre(a, b, d, c) {
          var e = c[1];if (e) {
            var f = c[0];f.ngModelCtrl = e;b.on("change", function () {
              a.$apply(function () {
                e.$setViewValue(f.readValue());
              });
            });if (d.multiple) {
              f.readValue = function () {
                var a = [];q(b.find("option"), function (b) {
                  b.selected && a.push(b.value);
                });return a;
              };f.writeValue = function (a) {
                var c = new Ra(a);q(b.find("option"), function (a) {
                  a.selected = w(c.get(a.value));
                });
              };var g,
                  h = NaN;a.$watch(function () {
                h !== e.$viewValue || na(g, e.$viewValue) || (g = ia(e.$viewValue), e.$render());h = e.$viewValue;
              });e.$isEmpty = function (a) {
                return !a || 0 === a.length;
              };
            }
          }
        }, post: function post(a, b, d, c) {
          var e = c[1];if (e) {
            var f = c[0];e.$render = function () {
              f.writeValue(e.$viewValue);
            };
          }
        } } };
  },
      te = ["$interpolate", function (a) {
    return { restrict: "E", priority: 100, compile: function compile(b, d) {
        if (w(d.value)) var c = a(d.value, !0);else {
          var e = a(b.text(), !0);e || d.$set("value", b.text());
        }return function (a, b, d) {
          var k = b.parent();(k = k.data("$selectController") || k.parent().data("$selectController")) && k.registerOption(a, b, d, c, e);
        };
      } };
  }],
      se = ha({ restrict: "E", terminal: !1 }),
      Ic = function Ic() {
    return { restrict: "A",
      require: "?ngModel", link: function link(a, b, d, c) {
        c && (d.required = !0, c.$validators.required = function (a, b) {
          return !d.required || !c.$isEmpty(b);
        }, d.$observe("required", function () {
          c.$validate();
        }));
      } };
  },
      Hc = function Hc() {
    return { restrict: "A", require: "?ngModel", link: function link(a, b, d, c) {
        if (c) {
          var e,
              f = d.ngPattern || d.pattern;d.$observe("pattern", function (a) {
            G(a) && 0 < a.length && (a = new RegExp("^" + a + "$"));if (a && !a.test) throw N("ngPattern")("noregexp", f, a, ya(b));e = a || void 0;c.$validate();
          });c.$validators.pattern = function (a, b) {
            return c.$isEmpty(b) || y(e) || e.test(b);
          };
        }
      } };
  },
      Kc = function Kc() {
    return { restrict: "A", require: "?ngModel", link: function link(a, b, d, c) {
        if (c) {
          var e = -1;d.$observe("maxlength", function (a) {
            a = Z(a);e = isNaN(a) ? -1 : a;c.$validate();
          });c.$validators.maxlength = function (a, b) {
            return 0 > e || c.$isEmpty(b) || b.length <= e;
          };
        }
      } };
  },
      Jc = function Jc() {
    return { restrict: "A", require: "?ngModel", link: function link(a, b, d, c) {
        if (c) {
          var e = 0;d.$observe("minlength", function (a) {
            e = Z(a) || 0;c.$validate();
          });c.$validators.minlength = function (a, b) {
            return c.$isEmpty(b) || b.length >= e;
          };
        }
      } };
  };C.angular.bootstrap ? C.console && console.log("WARNING: Tried to load angular more than once.") : (je(), le(ca), ca.module("ngLocale", [], ["$provide", function (a) {
    function b(a) {
      a += "";var b = a.indexOf(".");return -1 == b ? 0 : a.length - b - 1;
    }a.value("$locale", { DATETIME_FORMATS: { AMPMS: ["AM", "PM"], DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), ERANAMES: ["Before Christ", "Anno Domini"], ERAS: ["BC", "AD"], FIRSTDAYOFWEEK: 6, MONTH: "January February March April May June July August September October November December".split(" "),
        SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "), SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONEMONTH: "January February March April May June July August September October November December".split(" "), WEEKENDRANGE: [5, 6], fullDate: "EEEE, MMMM d, y", longDate: "MMMM d, y", medium: "MMM d, y h:mm:ss a", mediumDate: "MMM d, y", mediumTime: "h:mm:ss a", "short": "M/d/yy h:mm a", shortDate: "M/d/yy", shortTime: "h:mm a" }, NUMBER_FORMATS: { CURRENCY_SYM: "$", DECIMAL_SEP: ".", GROUP_SEP: ",",
        PATTERNS: [{ gSize: 3, lgSize: 3, maxFrac: 3, minFrac: 0, minInt: 1, negPre: "-", negSuf: "", posPre: "", posSuf: "" }, { gSize: 3, lgSize: 3, maxFrac: 2, minFrac: 2, minInt: 1, negPre: "-\xA4", negSuf: "", posPre: "\xA4", posSuf: "" }] }, id: "en-us", localeID: "en_US", pluralCat: function pluralCat(a, c) {
        var e = a | 0,
            f = c;void 0 === f && (f = Math.min(b(a), 3));Math.pow(10, f);return 1 == e && 0 == f ? "one" : "other";
      } });
  }]), F(C.document).ready(function () {
    fe(C.document, Bc);
  }));
})(window);!window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');
//# sourceMappingURL=angular.min.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! iScroll v5.2.0 ~ (c) 2008-2016 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
	var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};

	var utils = function () {
		var me = {};

		var _elementStyle = document.createElement('div').style;
		var _vendor = function () {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			    transform,
			    i = 0,
			    l = vendors.length;

			for (; i < l; i++) {
				transform = vendors[i] + 'ransform';
				if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
			}

			return false;
		}();

		function _prefixStyle(style) {
			if (_vendor === false) return false;
			if (_vendor === '') return style;
			return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
		}

		me.getTime = Date.now || function getTime() {
			return new Date().getTime();
		};

		me.extend = function (target, obj) {
			for (var i in obj) {
				target[i] = obj[i];
			}
		};

		me.addEvent = function (el, type, fn, capture) {
			el.addEventListener(type, fn, !!capture);
		};

		me.removeEvent = function (el, type, fn, capture) {
			el.removeEventListener(type, fn, !!capture);
		};

		me.prefixPointerEvent = function (pointerEvent) {
			return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) : pointerEvent;
		};

		me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
			var distance = current - start,
			    speed = Math.abs(distance) / time,
			    destination,
			    duration;

			deceleration = deceleration === undefined ? 0.0006 : deceleration;

			destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
			duration = speed / deceleration;

			if (destination < lowerMargin) {
				destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if (destination > 0) {
				destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			};
		};

		var _transform = _prefixStyle('transform');

		me.extend(me, {
			hasTransform: _transform !== false,
			hasPerspective: _prefixStyle('perspective') in _elementStyle,
			hasTouch: 'ontouchstart' in window,
			hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
			hasTransition: _prefixStyle('transition') in _elementStyle
		});

		/*
  This should find all Android browsers lower than build 535.19 (both stock browser and webview)
  - galaxy S2 is ok
     - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
     - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S3 is badAndroid (stock brower, webview)
      `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S4 is badAndroid (stock brower, webview)
      `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S5 is OK
      `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
    - galaxy S6 is OK
      `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
   */
		me.isBadAndroid = function () {
			var appVersion = window.navigator.appVersion;
			// Android browser is not a chrome browser.
			if (/Android/.test(appVersion) && !/Chrome\/\d/.test(appVersion)) {
				var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
				if (safariVersion && (typeof safariVersion === 'undefined' ? 'undefined' : _typeof(safariVersion)) === "object" && safariVersion.length >= 2) {
					return parseFloat(safariVersion[1]) < 535.19;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}();

		me.extend(me.style = {}, {
			transform: _transform,
			transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
			transitionDuration: _prefixStyle('transitionDuration'),
			transitionDelay: _prefixStyle('transitionDelay'),
			transformOrigin: _prefixStyle('transformOrigin')
		});

		me.hasClass = function (e, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
			return re.test(e.className);
		};

		me.addClass = function (e, c) {
			if (me.hasClass(e, c)) {
				return;
			}

			var newclass = e.className.split(' ');
			newclass.push(c);
			e.className = newclass.join(' ');
		};

		me.removeClass = function (e, c) {
			if (!me.hasClass(e, c)) {
				return;
			}

			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
			e.className = e.className.replace(re, ' ');
		};

		me.offset = function (el) {
			var left = -el.offsetLeft,
			    top = -el.offsetTop;

			// jshint -W084
			while (el = el.offsetParent) {
				left -= el.offsetLeft;
				top -= el.offsetTop;
			}
			// jshint +W084

			return {
				left: left,
				top: top
			};
		};

		me.preventDefaultException = function (el, exceptions) {
			for (var i in exceptions) {
				if (exceptions[i].test(el[i])) {
					return true;
				}
			}

			return false;
		};

		me.extend(me.eventType = {}, {
			touchstart: 1,
			touchmove: 1,
			touchend: 1,

			mousedown: 2,
			mousemove: 2,
			mouseup: 2,

			pointerdown: 3,
			pointermove: 3,
			pointerup: 3,

			MSPointerDown: 3,
			MSPointerMove: 3,
			MSPointerUp: 3
		});

		me.extend(me.ease = {}, {
			quadratic: {
				style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				fn: function fn(k) {
					return k * (2 - k);
				}
			},
			circular: {
				style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
				fn: function fn(k) {
					return Math.sqrt(1 - --k * k);
				}
			},
			back: {
				style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				fn: function fn(k) {
					var b = 4;
					return (k = k - 1) * k * ((b + 1) * k + b) + 1;
				}
			},
			bounce: {
				style: '',
				fn: function fn(k) {
					if ((k /= 1) < 1 / 2.75) {
						return 7.5625 * k * k;
					} else if (k < 2 / 2.75) {
						return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
					} else if (k < 2.5 / 2.75) {
						return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
					} else {
						return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
					}
				}
			},
			elastic: {
				style: '',
				fn: function fn(k) {
					var f = 0.22,
					    e = 0.4;

					if (k === 0) {
						return 0;
					}
					if (k == 1) {
						return 1;
					}

					return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1;
				}
			}
		});

		me.tap = function (e, eventName) {
			var ev = document.createEvent('Event');
			ev.initEvent(eventName, true, true);
			ev.pageX = e.pageX;
			ev.pageY = e.pageY;
			e.target.dispatchEvent(ev);
		};

		me.click = function (e) {
			var target = e.target,
			    ev;

			if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
				ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);

				ev._constructed = true;
				target.dispatchEvent(ev);
			}
		};

		return me;
	}();
	function IScroll(el, options) {
		this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
		this.scroller = this.wrapper.children[0];
		this.scrollerStyle = this.scroller.style; // cache style for better performance

		this.options = {

			resizeScrollbars: true,

			mouseWheelSpeed: 20,

			snapThreshold: 0.334,

			// INSERT POINT: OPTIONS
			disablePointer: !utils.hasPointer,
			disableTouch: utils.hasPointer || !utils.hasTouch,
			disableMouse: utils.hasPointer || utils.hasTouch,
			startX: 0,
			startY: 0,
			scrollY: true,
			directionLockThreshold: 5,
			momentum: true,

			bounce: true,
			bounceTime: 600,
			bounceEasing: '',

			preventDefault: true,
			preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

			HWCompositing: true,
			useTransition: true,
			useTransform: true,
			bindToWrapper: typeof window.onmousedown === "undefined"
		};

		for (var i in options) {
			this.options[i] = options[i];
		}

		// Normalize options
		this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

		this.options.useTransition = utils.hasTransition && this.options.useTransition;
		this.options.useTransform = utils.hasTransform && this.options.useTransform;

		this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
		this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

		// If you want eventPassthrough I have to lock one of the axes
		this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
		this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

		// With eventPassthrough we also need lockDirection mechanism
		this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
		this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

		this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

		this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

		if (this.options.tap === true) {
			this.options.tap = 'tap';
		}

		if (this.options.shrinkScrollbars == 'scale') {
			this.options.useTransition = false;
		}

		this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

		if (this.options.probeType == 3) {
			this.options.useTransition = false;
		}

		// INSERT POINT: NORMALIZATION

		// Some defaults
		this.x = 0;
		this.y = 0;
		this.directionX = 0;
		this.directionY = 0;
		this._events = {};

		// INSERT POINT: DEFAULTS

		this._init();
		this.refresh();

		this.scrollTo(this.options.startX, this.options.startY);
		this.enable();
	}

	IScroll.prototype = {
		version: '5.2.0',

		_init: function _init() {
			this._initEvents();

			if (this.options.scrollbars || this.options.indicators) {
				this._initIndicators();
			}

			if (this.options.mouseWheel) {
				this._initWheel();
			}

			if (this.options.snap) {
				this._initSnap();
			}

			if (this.options.keyBindings) {
				this._initKeys();
			}

			// INSERT POINT: _init
		},

		destroy: function destroy() {
			this._initEvents(true);
			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = null;
			this._execEvent('destroy');
		},

		_transitionEnd: function _transitionEnd(e) {
			if (e.target != this.scroller || !this.isInTransition) {
				return;
			}

			this._transitionTime();
			if (!this.resetPosition(this.options.bounceTime)) {
				this.isInTransition = false;
				this._execEvent('scrollEnd');
			}
		},

		_start: function _start(e) {
			// React to left mouse button only
			if (utils.eventType[e.type] != 1) {
				// for button property
				// http://unixpapa.com/js/mouse.html
				var button;
				if (!e.which) {
					/* IE case */
					button = e.button < 2 ? 0 : e.button == 4 ? 1 : 2;
				} else {
					/* All others */
					button = e.button;
				}
				if (button !== 0) {
					return;
				}
			}

			if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
				return;
			}

			if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
				e.preventDefault();
			}

			var point = e.touches ? e.touches[0] : e,
			    pos;

			this.initiated = utils.eventType[e.type];
			this.moved = false;
			this.distX = 0;
			this.distY = 0;
			this.directionX = 0;
			this.directionY = 0;
			this.directionLocked = 0;

			this.startTime = utils.getTime();

			if (this.options.useTransition && this.isInTransition) {
				this._transitionTime();
				this.isInTransition = false;
				pos = this.getComputedPosition();
				this._translate(Math.round(pos.x), Math.round(pos.y));
				this._execEvent('scrollEnd');
			} else if (!this.options.useTransition && this.isAnimating) {
				this.isAnimating = false;
				this._execEvent('scrollEnd');
			}

			this.startX = this.x;
			this.startY = this.y;
			this.absStartX = this.x;
			this.absStartY = this.y;
			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this._execEvent('beforeScrollStart');
		},

		_move: function _move(e) {
			if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
				return;
			}

			if (this.options.preventDefault) {
				// increases performance on Android? TODO: check!
				e.preventDefault();
			}

			var point = e.touches ? e.touches[0] : e,
			    deltaX = point.pageX - this.pointX,
			    deltaY = point.pageY - this.pointY,
			    timestamp = utils.getTime(),
			    newX,
			    newY,
			    absDistX,
			    absDistY;

			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this.distX += deltaX;
			this.distY += deltaY;
			absDistX = Math.abs(this.distX);
			absDistY = Math.abs(this.distY);

			// We need to move at least 10 pixels for the scrolling to initiate
			if (timestamp - this.endTime > 300 && absDistX < 10 && absDistY < 10) {
				return;
			}

			// If you are scrolling in one direction lock the other
			if (!this.directionLocked && !this.options.freeScroll) {
				if (absDistX > absDistY + this.options.directionLockThreshold) {
					this.directionLocked = 'h'; // lock horizontally
				} else if (absDistY >= absDistX + this.options.directionLockThreshold) {
					this.directionLocked = 'v'; // lock vertically
				} else {
					this.directionLocked = 'n'; // no lock
				}
			}

			if (this.directionLocked == 'h') {
				if (this.options.eventPassthrough == 'vertical') {
					e.preventDefault();
				} else if (this.options.eventPassthrough == 'horizontal') {
					this.initiated = false;
					return;
				}

				deltaY = 0;
			} else if (this.directionLocked == 'v') {
				if (this.options.eventPassthrough == 'horizontal') {
					e.preventDefault();
				} else if (this.options.eventPassthrough == 'vertical') {
					this.initiated = false;
					return;
				}

				deltaX = 0;
			}

			deltaX = this.hasHorizontalScroll ? deltaX : 0;
			deltaY = this.hasVerticalScroll ? deltaY : 0;

			newX = this.x + deltaX;
			newY = this.y + deltaY;

			// Slow down if outside of the boundaries
			if (newX > 0 || newX < this.maxScrollX) {
				newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
			}
			if (newY > 0 || newY < this.maxScrollY) {
				newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
			}

			this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
			this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

			if (!this.moved) {
				this._execEvent('scrollStart');
			}

			this.moved = true;

			this._translate(newX, newY);

			/* REPLACE START: _move */
			if (timestamp - this.startTime > 300) {
				this.startTime = timestamp;
				this.startX = this.x;
				this.startY = this.y;

				if (this.options.probeType == 1) {
					this._execEvent('scroll');
				}
			}

			if (this.options.probeType > 1) {
				this._execEvent('scroll');
			}
			/* REPLACE END: _move */
		},

		_end: function _end(e) {
			if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
				return;
			}

			if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
				e.preventDefault();
			}

			var point = e.changedTouches ? e.changedTouches[0] : e,
			    momentumX,
			    momentumY,
			    duration = utils.getTime() - this.startTime,
			    newX = Math.round(this.x),
			    newY = Math.round(this.y),
			    distanceX = Math.abs(newX - this.startX),
			    distanceY = Math.abs(newY - this.startY),
			    time = 0,
			    easing = '';

			this.isInTransition = 0;
			this.initiated = 0;
			this.endTime = utils.getTime();

			// reset if we are outside of the boundaries
			if (this.resetPosition(this.options.bounceTime)) {
				return;
			}

			this.scrollTo(newX, newY); // ensures that the last position is rounded

			// we scrolled less than 10 pixels
			if (!this.moved) {
				if (this.options.tap) {
					utils.tap(e, this.options.tap);
				}

				if (this.options.click) {
					utils.click(e);
				}

				this._execEvent('scrollCancel');
				return;
			}

			if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
				this._execEvent('flick');
				return;
			}

			// start momentum animation if needed
			if (this.options.momentum && duration < 300) {
				momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
				momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
				newX = momentumX.destination;
				newY = momentumY.destination;
				time = Math.max(momentumX.duration, momentumY.duration);
				this.isInTransition = 1;
			}

			if (this.options.snap) {
				var snap = this._nearestSnap(newX, newY);
				this.currentPage = snap;
				time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
				newX = snap.x;
				newY = snap.y;

				this.directionX = 0;
				this.directionY = 0;
				easing = this.options.bounceEasing;
			}

			// INSERT POINT: _end

			if (newX != this.x || newY != this.y) {
				// change easing function when scroller goes out of the boundaries
				if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
					easing = utils.ease.quadratic;
				}

				this.scrollTo(newX, newY, time, easing);
				return;
			}

			this._execEvent('scrollEnd');
		},

		_resize: function _resize() {
			var that = this;

			clearTimeout(this.resizeTimeout);

			this.resizeTimeout = setTimeout(function () {
				that.refresh();
			}, this.options.resizePolling);
		},

		resetPosition: function resetPosition(time) {
			var x = this.x,
			    y = this.y;

			time = time || 0;

			if (!this.hasHorizontalScroll || this.x > 0) {
				x = 0;
			} else if (this.x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (!this.hasVerticalScroll || this.y > 0) {
				y = 0;
			} else if (this.y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			if (x == this.x && y == this.y) {
				return false;
			}

			this.scrollTo(x, y, time, this.options.bounceEasing);

			return true;
		},

		disable: function disable() {
			this.enabled = false;
		},

		enable: function enable() {
			this.enabled = true;
		},

		refresh: function refresh() {
			var rf = this.wrapper.offsetHeight; // Force reflow

			this.wrapperWidth = this.wrapper.clientWidth;
			this.wrapperHeight = this.wrapper.clientHeight;

			/* REPLACE START: refresh */

			this.scrollerWidth = this.scroller.offsetWidth;
			this.scrollerHeight = this.scroller.offsetHeight;

			this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
			this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

			/* REPLACE END: refresh */

			this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

			if (!this.hasHorizontalScroll) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}

			if (!this.hasVerticalScroll) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}

			this.endTime = 0;
			this.directionX = 0;
			this.directionY = 0;

			this.wrapperOffset = utils.offset(this.wrapper);

			this._execEvent('refresh');

			this.resetPosition();

			// INSERT POINT: _refresh
		},

		on: function on(type, fn) {
			if (!this._events[type]) {
				this._events[type] = [];
			}

			this._events[type].push(fn);
		},

		off: function off(type, fn) {
			if (!this._events[type]) {
				return;
			}

			var index = this._events[type].indexOf(fn);

			if (index > -1) {
				this._events[type].splice(index, 1);
			}
		},

		_execEvent: function _execEvent(type) {
			if (!this._events[type]) {
				return;
			}

			var i = 0,
			    l = this._events[type].length;

			if (!l) {
				return;
			}

			for (; i < l; i++) {
				this._events[type][i].apply(this, [].slice.call(arguments, 1));
			}
		},

		scrollBy: function scrollBy(x, y, time, easing) {
			x = this.x + x;
			y = this.y + y;
			time = time || 0;

			this.scrollTo(x, y, time, easing);
		},

		scrollTo: function scrollTo(x, y, time, easing) {
			easing = easing || utils.ease.circular;

			this.isInTransition = this.options.useTransition && time > 0;
			var transitionType = this.options.useTransition && easing.style;
			if (!time || transitionType) {
				if (transitionType) {
					this._transitionTimingFunction(easing.style);
					this._transitionTime(time);
				}
				this._translate(x, y);
			} else {
				this._animate(x, y, time, easing.fn);
			}
		},

		scrollToElement: function scrollToElement(el, time, offsetX, offsetY, easing) {
			el = el.nodeType ? el : this.scroller.querySelector(el);

			if (!el) {
				return;
			}

			var pos = utils.offset(el);

			pos.left -= this.wrapperOffset.left;
			pos.top -= this.wrapperOffset.top;

			// if offsetX/Y are true we center the element to the screen
			if (offsetX === true) {
				offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
			}
			if (offsetY === true) {
				offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
			}

			pos.left -= offsetX || 0;
			pos.top -= offsetY || 0;

			pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
			pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

			time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

			this.scrollTo(pos.left, pos.top, time, easing);
		},

		_transitionTime: function _transitionTime(time) {
			time = time || 0;

			var durationProp = utils.style.transitionDuration;
			this.scrollerStyle[durationProp] = time + 'ms';

			if (!time && utils.isBadAndroid) {
				this.scrollerStyle[durationProp] = '0.0001ms';
				// remove 0.0001ms
				var self = this;
				rAF(function () {
					if (self.scrollerStyle[durationProp] === '0.0001ms') {
						self.scrollerStyle[durationProp] = '0s';
					}
				});
			}

			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTime(time);
				}
			}

			// INSERT POINT: _transitionTime
		},

		_transitionTimingFunction: function _transitionTimingFunction(easing) {
			this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].transitionTimingFunction(easing);
				}
			}

			// INSERT POINT: _transitionTimingFunction
		},

		_translate: function _translate(x, y) {
			if (this.options.useTransform) {

				/* REPLACE START: _translate */

				this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

				/* REPLACE END: _translate */
			} else {
				x = Math.round(x);
				y = Math.round(y);
				this.scrollerStyle.left = x + 'px';
				this.scrollerStyle.top = y + 'px';
			}

			this.x = x;
			this.y = y;

			if (this.indicators) {
				for (var i = this.indicators.length; i--;) {
					this.indicators[i].updatePosition();
				}
			}

			// INSERT POINT: _translate
		},

		_initEvents: function _initEvents(remove) {
			var eventType = remove ? utils.removeEvent : utils.addEvent,
			    target = this.options.bindToWrapper ? this.wrapper : window;

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			if (this.options.click) {
				eventType(this.wrapper, 'click', this, true);
			}

			if (!this.options.disableMouse) {
				eventType(this.wrapper, 'mousedown', this);
				eventType(target, 'mousemove', this);
				eventType(target, 'mousecancel', this);
				eventType(target, 'mouseup', this);
			}

			if (utils.hasPointer && !this.options.disablePointer) {
				eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
				eventType(target, utils.prefixPointerEvent('pointermove'), this);
				eventType(target, utils.prefixPointerEvent('pointercancel'), this);
				eventType(target, utils.prefixPointerEvent('pointerup'), this);
			}

			if (utils.hasTouch && !this.options.disableTouch) {
				eventType(this.wrapper, 'touchstart', this);
				eventType(target, 'touchmove', this);
				eventType(target, 'touchcancel', this);
				eventType(target, 'touchend', this);
			}

			eventType(this.scroller, 'transitionend', this);
			eventType(this.scroller, 'webkitTransitionEnd', this);
			eventType(this.scroller, 'oTransitionEnd', this);
			eventType(this.scroller, 'MSTransitionEnd', this);
		},

		getComputedPosition: function getComputedPosition() {
			var matrix = window.getComputedStyle(this.scroller, null),
			    x,
			    y;

			if (this.options.useTransform) {
				matrix = matrix[utils.style.transform].split(')')[0].split(', ');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +matrix.left.replace(/[^-\d.]/g, '');
				y = +matrix.top.replace(/[^-\d.]/g, '');
			}

			return { x: x, y: y };
		},
		_initIndicators: function _initIndicators() {
			var interactive = this.options.interactiveScrollbars,
			    customStyle = typeof this.options.scrollbars != 'string',
			    indicators = [],
			    indicator;

			var that = this;

			this.indicators = [];

			if (this.options.scrollbars) {
				// Vertical scrollbar
				if (this.options.scrollY) {
					indicator = {
						el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
						interactive: interactive,
						defaultScrollbars: true,
						customStyle: customStyle,
						resize: this.options.resizeScrollbars,
						shrink: this.options.shrinkScrollbars,
						fade: this.options.fadeScrollbars,
						listenX: false
					};

					this.wrapper.appendChild(indicator.el);
					indicators.push(indicator);
				}

				// Horizontal scrollbar
				if (this.options.scrollX) {
					indicator = {
						el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
						interactive: interactive,
						defaultScrollbars: true,
						customStyle: customStyle,
						resize: this.options.resizeScrollbars,
						shrink: this.options.shrinkScrollbars,
						fade: this.options.fadeScrollbars,
						listenY: false
					};

					this.wrapper.appendChild(indicator.el);
					indicators.push(indicator);
				}
			}

			if (this.options.indicators) {
				// TODO: check concat compatibility
				indicators = indicators.concat(this.options.indicators);
			}

			for (var i = indicators.length; i--;) {
				this.indicators.push(new Indicator(this, indicators[i]));
			}

			// TODO: check if we can use array.map (wide compatibility and performance issues)
			function _indicatorsMap(fn) {
				if (that.indicators) {
					for (var i = that.indicators.length; i--;) {
						fn.call(that.indicators[i]);
					}
				}
			}

			if (this.options.fadeScrollbars) {
				this.on('scrollEnd', function () {
					_indicatorsMap(function () {
						this.fade();
					});
				});

				this.on('scrollCancel', function () {
					_indicatorsMap(function () {
						this.fade();
					});
				});

				this.on('scrollStart', function () {
					_indicatorsMap(function () {
						this.fade(1);
					});
				});

				this.on('beforeScrollStart', function () {
					_indicatorsMap(function () {
						this.fade(1, true);
					});
				});
			}

			this.on('refresh', function () {
				_indicatorsMap(function () {
					this.refresh();
				});
			});

			this.on('destroy', function () {
				_indicatorsMap(function () {
					this.destroy();
				});

				delete this.indicators;
			});
		},

		_initWheel: function _initWheel() {
			utils.addEvent(this.wrapper, 'wheel', this);
			utils.addEvent(this.wrapper, 'mousewheel', this);
			utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

			this.on('destroy', function () {
				clearTimeout(this.wheelTimeout);
				this.wheelTimeout = null;
				utils.removeEvent(this.wrapper, 'wheel', this);
				utils.removeEvent(this.wrapper, 'mousewheel', this);
				utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
			});
		},

		_wheel: function _wheel(e) {
			if (!this.enabled) {
				return;
			}

			e.preventDefault();

			var wheelDeltaX,
			    wheelDeltaY,
			    newX,
			    newY,
			    that = this;

			if (this.wheelTimeout === undefined) {
				that._execEvent('scrollStart');
			}

			// Execute the scrollEnd event after 400ms the wheel stopped scrolling
			clearTimeout(this.wheelTimeout);
			this.wheelTimeout = setTimeout(function () {
				if (!that.options.snap) {
					that._execEvent('scrollEnd');
				}
				that.wheelTimeout = undefined;
			}, 400);

			if ('deltaX' in e) {
				if (e.deltaMode === 1) {
					wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
					wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
				} else {
					wheelDeltaX = -e.deltaX;
					wheelDeltaY = -e.deltaY;
				}
			} else if ('wheelDeltaX' in e) {
				wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
				wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
			} else if ('wheelDelta' in e) {
				wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
			} else if ('detail' in e) {
				wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
			} else {
				return;
			}

			wheelDeltaX *= this.options.invertWheelDirection;
			wheelDeltaY *= this.options.invertWheelDirection;

			if (!this.hasVerticalScroll) {
				wheelDeltaX = wheelDeltaY;
				wheelDeltaY = 0;
			}

			if (this.options.snap) {
				newX = this.currentPage.pageX;
				newY = this.currentPage.pageY;

				if (wheelDeltaX > 0) {
					newX--;
				} else if (wheelDeltaX < 0) {
					newX++;
				}

				if (wheelDeltaY > 0) {
					newY--;
				} else if (wheelDeltaY < 0) {
					newY++;
				}

				this.goToPage(newX, newY);

				return;
			}

			newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
			newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

			this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
			this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

			if (newX > 0) {
				newX = 0;
			} else if (newX < this.maxScrollX) {
				newX = this.maxScrollX;
			}

			if (newY > 0) {
				newY = 0;
			} else if (newY < this.maxScrollY) {
				newY = this.maxScrollY;
			}

			this.scrollTo(newX, newY, 0);

			if (this.options.probeType > 1) {
				this._execEvent('scroll');
			}

			// INSERT POINT: _wheel
		},

		_initSnap: function _initSnap() {
			this.currentPage = {};

			if (typeof this.options.snap == 'string') {
				this.options.snap = this.scroller.querySelectorAll(this.options.snap);
			}

			this.on('refresh', function () {
				var i = 0,
				    l,
				    m = 0,
				    n,
				    cx,
				    cy,
				    x = 0,
				    y,
				    stepX = this.options.snapStepX || this.wrapperWidth,
				    stepY = this.options.snapStepY || this.wrapperHeight,
				    el;

				this.pages = [];

				if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
					return;
				}

				if (this.options.snap === true) {
					cx = Math.round(stepX / 2);
					cy = Math.round(stepY / 2);

					while (x > -this.scrollerWidth) {
						this.pages[i] = [];
						l = 0;
						y = 0;

						while (y > -this.scrollerHeight) {
							this.pages[i][l] = {
								x: Math.max(x, this.maxScrollX),
								y: Math.max(y, this.maxScrollY),
								width: stepX,
								height: stepY,
								cx: x - cx,
								cy: y - cy
							};

							y -= stepY;
							l++;
						}

						x -= stepX;
						i++;
					}
				} else {
					el = this.options.snap;
					l = el.length;
					n = -1;

					for (; i < l; i++) {
						if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
							m = 0;
							n++;
						}

						if (!this.pages[m]) {
							this.pages[m] = [];
						}

						x = Math.max(-el[i].offsetLeft, this.maxScrollX);
						y = Math.max(-el[i].offsetTop, this.maxScrollY);
						cx = x - Math.round(el[i].offsetWidth / 2);
						cy = y - Math.round(el[i].offsetHeight / 2);

						this.pages[m][n] = {
							x: x,
							y: y,
							width: el[i].offsetWidth,
							height: el[i].offsetHeight,
							cx: cx,
							cy: cy
						};

						if (x > this.maxScrollX) {
							m++;
						}
					}
				}

				this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

				// Update snap threshold if needed
				if (this.options.snapThreshold % 1 === 0) {
					this.snapThresholdX = this.options.snapThreshold;
					this.snapThresholdY = this.options.snapThreshold;
				} else {
					this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
					this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
				}
			});

			this.on('flick', function () {
				var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1000), Math.min(Math.abs(this.y - this.startY), 1000)), 300);

				this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time);
			});
		},

		_nearestSnap: function _nearestSnap(x, y) {
			if (!this.pages.length) {
				return { x: 0, y: 0, pageX: 0, pageY: 0 };
			}

			var i = 0,
			    l = this.pages.length,
			    m = 0;

			// Check if we exceeded the snap threshold
			if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
				return this.currentPage;
			}

			if (x > 0) {
				x = 0;
			} else if (x < this.maxScrollX) {
				x = this.maxScrollX;
			}

			if (y > 0) {
				y = 0;
			} else if (y < this.maxScrollY) {
				y = this.maxScrollY;
			}

			for (; i < l; i++) {
				if (x >= this.pages[i][0].cx) {
					x = this.pages[i][0].x;
					break;
				}
			}

			l = this.pages[i].length;

			for (; m < l; m++) {
				if (y >= this.pages[0][m].cy) {
					y = this.pages[0][m].y;
					break;
				}
			}

			if (i == this.currentPage.pageX) {
				i += this.directionX;

				if (i < 0) {
					i = 0;
				} else if (i >= this.pages.length) {
					i = this.pages.length - 1;
				}

				x = this.pages[i][0].x;
			}

			if (m == this.currentPage.pageY) {
				m += this.directionY;

				if (m < 0) {
					m = 0;
				} else if (m >= this.pages[0].length) {
					m = this.pages[0].length - 1;
				}

				y = this.pages[0][m].y;
			}

			return {
				x: x,
				y: y,
				pageX: i,
				pageY: m
			};
		},

		goToPage: function goToPage(x, y, time, easing) {
			easing = easing || this.options.bounceEasing;

			if (x >= this.pages.length) {
				x = this.pages.length - 1;
			} else if (x < 0) {
				x = 0;
			}

			if (y >= this.pages[x].length) {
				y = this.pages[x].length - 1;
			} else if (y < 0) {
				y = 0;
			}

			var posX = this.pages[x][y].x,
			    posY = this.pages[x][y].y;

			time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;

			this.currentPage = {
				x: posX,
				y: posY,
				pageX: x,
				pageY: y
			};

			this.scrollTo(posX, posY, time, easing);
		},

		next: function next(time, easing) {
			var x = this.currentPage.pageX,
			    y = this.currentPage.pageY;

			x++;

			if (x >= this.pages.length && this.hasVerticalScroll) {
				x = 0;
				y++;
			}

			this.goToPage(x, y, time, easing);
		},

		prev: function prev(time, easing) {
			var x = this.currentPage.pageX,
			    y = this.currentPage.pageY;

			x--;

			if (x < 0 && this.hasVerticalScroll) {
				x = 0;
				y--;
			}

			this.goToPage(x, y, time, easing);
		},

		_initKeys: function _initKeys(e) {
			// default key bindings
			var keys = {
				pageUp: 33,
				pageDown: 34,
				end: 35,
				home: 36,
				left: 37,
				up: 38,
				right: 39,
				down: 40
			};
			var i;

			// if you give me characters I give you keycode
			if (_typeof(this.options.keyBindings) == 'object') {
				for (i in this.options.keyBindings) {
					if (typeof this.options.keyBindings[i] == 'string') {
						this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
					}
				}
			} else {
				this.options.keyBindings = {};
			}

			for (i in keys) {
				this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
			}

			utils.addEvent(window, 'keydown', this);

			this.on('destroy', function () {
				utils.removeEvent(window, 'keydown', this);
			});
		},

		_key: function _key(e) {
			if (!this.enabled) {
				return;
			}

			var snap = this.options.snap,
			    // we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			    newY = snap ? this.currentPage.pageY : this.y,
			    now = utils.getTime(),
			    prevTime = this.keyTime || 0,
			    acceleration = 0.250,
			    pos;

			if (this.options.useTransition && this.isInTransition) {
				pos = this.getComputedPosition();

				this._translate(Math.round(pos.x), Math.round(pos.y));
				this.isInTransition = false;
			}

			this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

			switch (e.keyCode) {
				case this.options.keyBindings.pageUp:
					if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
						newX += snap ? 1 : this.wrapperWidth;
					} else {
						newY += snap ? 1 : this.wrapperHeight;
					}
					break;
				case this.options.keyBindings.pageDown:
					if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
						newX -= snap ? 1 : this.wrapperWidth;
					} else {
						newY -= snap ? 1 : this.wrapperHeight;
					}
					break;
				case this.options.keyBindings.end:
					newX = snap ? this.pages.length - 1 : this.maxScrollX;
					newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
					break;
				case this.options.keyBindings.home:
					newX = 0;
					newY = 0;
					break;
				case this.options.keyBindings.left:
					newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.up:
					newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.right:
					newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
					break;
				case this.options.keyBindings.down:
					newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
					break;
				default:
					return;
			}

			if (snap) {
				this.goToPage(newX, newY);
				return;
			}

			if (newX > 0) {
				newX = 0;
				this.keyAcceleration = 0;
			} else if (newX < this.maxScrollX) {
				newX = this.maxScrollX;
				this.keyAcceleration = 0;
			}

			if (newY > 0) {
				newY = 0;
				this.keyAcceleration = 0;
			} else if (newY < this.maxScrollY) {
				newY = this.maxScrollY;
				this.keyAcceleration = 0;
			}

			this.scrollTo(newX, newY, 0);

			this.keyTime = now;
		},

		_animate: function _animate(destX, destY, duration, easingFn) {
			var that = this,
			    startX = this.x,
			    startY = this.y,
			    startTime = utils.getTime(),
			    destTime = startTime + duration;

			function step() {
				var now = utils.getTime(),
				    newX,
				    newY,
				    easing;

				if (now >= destTime) {
					that.isAnimating = false;
					that._translate(destX, destY);

					if (!that.resetPosition(that.options.bounceTime)) {
						that._execEvent('scrollEnd');
					}

					return;
				}

				now = (now - startTime) / duration;
				easing = easingFn(now);
				newX = (destX - startX) * easing + startX;
				newY = (destY - startY) * easing + startY;
				that._translate(newX, newY);

				if (that.isAnimating) {
					rAF(step);
				}

				if (that.options.probeType == 3) {
					that._execEvent('scroll');
				}
			}

			this.isAnimating = true;
			step();
		},

		handleEvent: function handleEvent(e) {
			switch (e.type) {
				case 'touchstart':
				case 'pointerdown':
				case 'MSPointerDown':
				case 'mousedown':
					this._start(e);
					break;
				case 'touchmove':
				case 'pointermove':
				case 'MSPointerMove':
				case 'mousemove':
					this._move(e);
					break;
				case 'touchend':
				case 'pointerup':
				case 'MSPointerUp':
				case 'mouseup':
				case 'touchcancel':
				case 'pointercancel':
				case 'MSPointerCancel':
				case 'mousecancel':
					this._end(e);
					break;
				case 'orientationchange':
				case 'resize':
					this._resize();
					break;
				case 'transitionend':
				case 'webkitTransitionEnd':
				case 'oTransitionEnd':
				case 'MSTransitionEnd':
					this._transitionEnd(e);
					break;
				case 'wheel':
				case 'DOMMouseScroll':
				case 'mousewheel':
					this._wheel(e);
					break;
				case 'keydown':
					this._key(e);
					break;
				case 'click':
					if (this.enabled && !e._constructed) {
						e.preventDefault();
						e.stopPropagation();
					}
					break;
			}
		}
	};
	function createDefaultScrollbar(direction, interactive, type) {
		var scrollbar = document.createElement('div'),
		    indicator = document.createElement('div');

		if (type === true) {
			scrollbar.style.cssText = 'position:absolute;z-index:9999';
			indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
		}

		indicator.className = 'iScrollIndicator';

		if (direction == 'h') {
			if (type === true) {
				scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
				indicator.style.height = '100%';
			}
			scrollbar.className = 'iScrollHorizontalScrollbar';
		} else {
			if (type === true) {
				scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
				indicator.style.width = '100%';
			}
			scrollbar.className = 'iScrollVerticalScrollbar';
		}

		scrollbar.style.cssText += ';overflow:hidden';

		if (!interactive) {
			scrollbar.style.pointerEvents = 'none';
		}

		scrollbar.appendChild(indicator);

		return scrollbar;
	}

	function Indicator(scroller, options) {
		this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
		this.wrapperStyle = this.wrapper.style;
		this.indicator = this.wrapper.children[0];
		this.indicatorStyle = this.indicator.style;
		this.scroller = scroller;

		this.options = {
			listenX: true,
			listenY: true,
			interactive: false,
			resize: true,
			defaultScrollbars: false,
			shrink: false,
			fade: false,
			speedRatioX: 0,
			speedRatioY: 0
		};

		for (var i in options) {
			this.options[i] = options[i];
		}

		this.sizeRatioX = 1;
		this.sizeRatioY = 1;
		this.maxPosX = 0;
		this.maxPosY = 0;

		if (this.options.interactive) {
			if (!this.options.disableTouch) {
				utils.addEvent(this.indicator, 'touchstart', this);
				utils.addEvent(window, 'touchend', this);
			}
			if (!this.options.disablePointer) {
				utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
				utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
			}
			if (!this.options.disableMouse) {
				utils.addEvent(this.indicator, 'mousedown', this);
				utils.addEvent(window, 'mouseup', this);
			}
		}

		if (this.options.fade) {
			this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
			var durationProp = utils.style.transitionDuration;
			this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
			// remove 0.0001ms
			var self = this;
			if (utils.isBadAndroid) {
				rAF(function () {
					if (self.wrapperStyle[durationProp] === '0.0001ms') {
						self.wrapperStyle[durationProp] = '0s';
					}
				});
			}
			this.wrapperStyle.opacity = '0';
		}
	}

	Indicator.prototype = {
		handleEvent: function handleEvent(e) {
			switch (e.type) {
				case 'touchstart':
				case 'pointerdown':
				case 'MSPointerDown':
				case 'mousedown':
					this._start(e);
					break;
				case 'touchmove':
				case 'pointermove':
				case 'MSPointerMove':
				case 'mousemove':
					this._move(e);
					break;
				case 'touchend':
				case 'pointerup':
				case 'MSPointerUp':
				case 'mouseup':
				case 'touchcancel':
				case 'pointercancel':
				case 'MSPointerCancel':
				case 'mousecancel':
					this._end(e);
					break;
			}
		},

		destroy: function destroy() {
			if (this.options.fadeScrollbars) {
				clearTimeout(this.fadeTimeout);
				this.fadeTimeout = null;
			}
			if (this.options.interactive) {
				utils.removeEvent(this.indicator, 'touchstart', this);
				utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
				utils.removeEvent(this.indicator, 'mousedown', this);

				utils.removeEvent(window, 'touchmove', this);
				utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
				utils.removeEvent(window, 'mousemove', this);

				utils.removeEvent(window, 'touchend', this);
				utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
				utils.removeEvent(window, 'mouseup', this);
			}

			if (this.options.defaultScrollbars) {
				this.wrapper.parentNode.removeChild(this.wrapper);
			}
		},

		_start: function _start(e) {
			var point = e.touches ? e.touches[0] : e;

			e.preventDefault();
			e.stopPropagation();

			this.transitionTime();

			this.initiated = true;
			this.moved = false;
			this.lastPointX = point.pageX;
			this.lastPointY = point.pageY;

			this.startTime = utils.getTime();

			if (!this.options.disableTouch) {
				utils.addEvent(window, 'touchmove', this);
			}
			if (!this.options.disablePointer) {
				utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
			}
			if (!this.options.disableMouse) {
				utils.addEvent(window, 'mousemove', this);
			}

			this.scroller._execEvent('beforeScrollStart');
		},

		_move: function _move(e) {
			var point = e.touches ? e.touches[0] : e,
			    deltaX,
			    deltaY,
			    newX,
			    newY,
			    timestamp = utils.getTime();

			if (!this.moved) {
				this.scroller._execEvent('scrollStart');
			}

			this.moved = true;

			deltaX = point.pageX - this.lastPointX;
			this.lastPointX = point.pageX;

			deltaY = point.pageY - this.lastPointY;
			this.lastPointY = point.pageY;

			newX = this.x + deltaX;
			newY = this.y + deltaY;

			this._pos(newX, newY);

			if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
				this.startTime = timestamp;
				this.scroller._execEvent('scroll');
			} else if (this.scroller.options.probeType > 1) {
				this.scroller._execEvent('scroll');
			}

			// INSERT POINT: indicator._move

			e.preventDefault();
			e.stopPropagation();
		},

		_end: function _end(e) {
			if (!this.initiated) {
				return;
			}

			this.initiated = false;

			e.preventDefault();
			e.stopPropagation();

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			if (this.scroller.options.snap) {
				var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

				var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);

				if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
					this.scroller.directionX = 0;
					this.scroller.directionY = 0;
					this.scroller.currentPage = snap;
					this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
				}
			}

			if (this.moved) {
				this.scroller._execEvent('scrollEnd');
			}
		},

		transitionTime: function transitionTime(time) {
			time = time || 0;
			var durationProp = utils.style.transitionDuration;
			this.indicatorStyle[durationProp] = time + 'ms';

			if (!time && utils.isBadAndroid) {
				this.indicatorStyle[durationProp] = '0.0001ms';
				// remove 0.0001ms
				var self = this;
				rAF(function () {
					if (self.indicatorStyle[durationProp] === '0.0001ms') {
						self.indicatorStyle[durationProp] = '0s';
					}
				});
			}
		},

		transitionTimingFunction: function transitionTimingFunction(easing) {
			this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
		},

		refresh: function refresh() {
			this.transitionTime();

			if (this.options.listenX && !this.options.listenY) {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
			} else if (this.options.listenY && !this.options.listenX) {
				this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
			} else {
				this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
			}

			if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
				utils.addClass(this.wrapper, 'iScrollBothScrollbars');
				utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

				if (this.options.defaultScrollbars && this.options.customStyle) {
					if (this.options.listenX) {
						this.wrapper.style.right = '8px';
					} else {
						this.wrapper.style.bottom = '8px';
					}
				}
			} else {
				utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
				utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

				if (this.options.defaultScrollbars && this.options.customStyle) {
					if (this.options.listenX) {
						this.wrapper.style.right = '2px';
					} else {
						this.wrapper.style.bottom = '2px';
					}
				}
			}

			var r = this.wrapper.offsetHeight; // force refresh

			if (this.options.listenX) {
				this.wrapperWidth = this.wrapper.clientWidth;
				if (this.options.resize) {
					this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
					this.indicatorStyle.width = this.indicatorWidth + 'px';
				} else {
					this.indicatorWidth = this.indicator.clientWidth;
				}

				this.maxPosX = this.wrapperWidth - this.indicatorWidth;

				if (this.options.shrink == 'clip') {
					this.minBoundaryX = -this.indicatorWidth + 8;
					this.maxBoundaryX = this.wrapperWidth - 8;
				} else {
					this.minBoundaryX = 0;
					this.maxBoundaryX = this.maxPosX;
				}

				this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX;
			}

			if (this.options.listenY) {
				this.wrapperHeight = this.wrapper.clientHeight;
				if (this.options.resize) {
					this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
					this.indicatorStyle.height = this.indicatorHeight + 'px';
				} else {
					this.indicatorHeight = this.indicator.clientHeight;
				}

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;

				if (this.options.shrink == 'clip') {
					this.minBoundaryY = -this.indicatorHeight + 8;
					this.maxBoundaryY = this.wrapperHeight - 8;
				} else {
					this.minBoundaryY = 0;
					this.maxBoundaryY = this.maxPosY;
				}

				this.maxPosY = this.wrapperHeight - this.indicatorHeight;
				this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY;
			}

			this.updatePosition();
		},

		updatePosition: function updatePosition() {
			var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			    y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

			if (!this.options.ignoreBoundaries) {
				if (x < this.minBoundaryX) {
					if (this.options.shrink == 'scale') {
						this.width = Math.max(this.indicatorWidth + x, 8);
						this.indicatorStyle.width = this.width + 'px';
					}
					x = this.minBoundaryX;
				} else if (x > this.maxBoundaryX) {
					if (this.options.shrink == 'scale') {
						this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
						this.indicatorStyle.width = this.width + 'px';
						x = this.maxPosX + this.indicatorWidth - this.width;
					} else {
						x = this.maxBoundaryX;
					}
				} else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
					this.width = this.indicatorWidth;
					this.indicatorStyle.width = this.width + 'px';
				}

				if (y < this.minBoundaryY) {
					if (this.options.shrink == 'scale') {
						this.height = Math.max(this.indicatorHeight + y * 3, 8);
						this.indicatorStyle.height = this.height + 'px';
					}
					y = this.minBoundaryY;
				} else if (y > this.maxBoundaryY) {
					if (this.options.shrink == 'scale') {
						this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
						this.indicatorStyle.height = this.height + 'px';
						y = this.maxPosY + this.indicatorHeight - this.height;
					} else {
						y = this.maxBoundaryY;
					}
				} else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
					this.height = this.indicatorHeight;
					this.indicatorStyle.height = this.height + 'px';
				}
			}

			this.x = x;
			this.y = y;

			if (this.scroller.options.useTransform) {
				this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
			} else {
				this.indicatorStyle.left = x + 'px';
				this.indicatorStyle.top = y + 'px';
			}
		},

		_pos: function _pos(x, y) {
			if (x < 0) {
				x = 0;
			} else if (x > this.maxPosX) {
				x = this.maxPosX;
			}

			if (y < 0) {
				y = 0;
			} else if (y > this.maxPosY) {
				y = this.maxPosY;
			}

			x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
			y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

			this.scroller.scrollTo(x, y);
		},

		fade: function fade(val, hold) {
			if (hold && !this.visible) {
				return;
			}

			clearTimeout(this.fadeTimeout);
			this.fadeTimeout = null;

			var time = val ? 250 : 500,
			    delay = val ? 0 : 300;

			val = val ? '1' : '0';

			this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

			this.fadeTimeout = setTimeout(function (val) {
				this.wrapperStyle.opacity = val;
				this.visible = +val;
			}.bind(this, val), delay);
		}
	};

	IScroll.utils = utils;

	if (typeof module != 'undefined' && module.exports) {
		module.exports = IScroll;
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return IScroll;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.IScroll = IScroll;
	}
})(window, document, Math);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Swiper 3.4.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: October 16, 2016
 */
!function () {
  "use strict";
  function e(e) {
    e.fn.swiper = function (a) {
      var s;return e(this).each(function () {
        var e = new t(this, a);s || (s = e);
      }), s;
    };
  }var a,
      t = function t(e, i) {
    function n(e) {
      return Math.floor(e);
    }function o() {
      var e = S.params.autoplay,
          a = S.slides.eq(S.activeIndex);a.attr("data-swiper-autoplay") && (e = a.attr("data-swiper-autoplay") || S.params.autoplay), S.autoplayTimeoutId = setTimeout(function () {
        S.params.loop ? (S.fixLoop(), S._slideNext(), S.emit("onAutoplay", S)) : S.isEnd ? i.autoplayStopOnLast ? S.stopAutoplay() : (S._slideTo(0), S.emit("onAutoplay", S)) : (S._slideNext(), S.emit("onAutoplay", S));
      }, e);
    }function l(e, t) {
      var s = a(e.target);if (!s.is(t)) if ("string" == typeof t) s = s.parents(t);else if (t.nodeType) {
        var i;return s.parents().each(function (e, a) {
          a === t && (i = t);
        }), i ? t : void 0;
      }if (0 !== s.length) return s[0];
    }function p(e, a) {
      a = a || {};var t = window.MutationObserver || window.WebkitMutationObserver,
          s = new t(function (e) {
        e.forEach(function (e) {
          S.onResize(!0), S.emit("onObserverUpdate", S, e);
        });
      });s.observe(e, { attributes: "undefined" == typeof a.attributes || a.attributes, childList: "undefined" == typeof a.childList || a.childList, characterData: "undefined" == typeof a.characterData || a.characterData }), S.observers.push(s);
    }function d(e) {
      e.originalEvent && (e = e.originalEvent);var a = e.keyCode || e.charCode;if (!S.params.allowSwipeToNext && (S.isHorizontal() && 39 === a || !S.isHorizontal() && 40 === a)) return !1;if (!S.params.allowSwipeToPrev && (S.isHorizontal() && 37 === a || !S.isHorizontal() && 38 === a)) return !1;if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
        if (37 === a || 39 === a || 38 === a || 40 === a) {
          var t = !1;if (S.container.parents("." + S.params.slideClass).length > 0 && 0 === S.container.parents("." + S.params.slideActiveClass).length) return;var s = { left: window.pageXOffset, top: window.pageYOffset },
              i = window.innerWidth,
              r = window.innerHeight,
              n = S.container.offset();S.rtl && (n.left = n.left - S.container[0].scrollLeft);for (var o = [[n.left, n.top], [n.left + S.width, n.top], [n.left, n.top + S.height], [n.left + S.width, n.top + S.height]], l = 0; l < o.length; l++) {
            var p = o[l];p[0] >= s.left && p[0] <= s.left + i && p[1] >= s.top && p[1] <= s.top + r && (t = !0);
          }if (!t) return;
        }S.isHorizontal() ? (37 !== a && 39 !== a || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), (39 === a && !S.rtl || 37 === a && S.rtl) && S.slideNext(), (37 === a && !S.rtl || 39 === a && S.rtl) && S.slidePrev()) : (38 !== a && 40 !== a || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === a && S.slideNext(), 38 === a && S.slidePrev());
      }
    }function u() {
      var e = "onwheel",
          a = e in document;if (!a) {
        var t = document.createElement("div");t.setAttribute(e, "return;"), a = "function" == typeof t[e];
      }return !a && document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== !0 && (a = document.implementation.hasFeature("Events.wheel", "3.0")), a;
    }function c(e) {
      e.originalEvent && (e = e.originalEvent);var a = 0,
          t = S.rtl ? -1 : 1,
          s = m(e);if (S.params.mousewheelForceToAxis) {
        if (S.isHorizontal()) {
          if (!(Math.abs(s.pixelX) > Math.abs(s.pixelY))) return;a = s.pixelX * t;
        } else {
          if (!(Math.abs(s.pixelY) > Math.abs(s.pixelX))) return;a = s.pixelY;
        }
      } else a = Math.abs(s.pixelX) > Math.abs(s.pixelY) ? -s.pixelX * t : -s.pixelY;if (0 !== a) {
        if (S.params.mousewheelInvert && (a = -a), S.params.freeMode) {
          var i = S.getWrapperTranslate() + a * S.params.mousewheelSensitivity,
              r = S.isBeginning,
              n = S.isEnd;if (i >= S.minTranslate() && (i = S.minTranslate()), i <= S.maxTranslate() && (i = S.maxTranslate()), S.setWrapperTransition(0), S.setWrapperTranslate(i), S.updateProgress(), S.updateActiveIndex(), (!r && S.isBeginning || !n && S.isEnd) && S.updateClasses(), S.params.freeModeSticky ? (clearTimeout(S.mousewheel.timeout), S.mousewheel.timeout = setTimeout(function () {
            S.slideReset();
          }, 300)) : S.params.lazyLoading && S.lazy && S.lazy.load(), S.emit("onScroll", S, e), S.params.autoplay && S.params.autoplayDisableOnInteraction && S.stopAutoplay(), 0 === i || i === S.maxTranslate()) return;
        } else {
          if (new window.Date().getTime() - S.mousewheel.lastScrollTime > 60) if (a < 0) {
            if (S.isEnd && !S.params.loop || S.animating) {
              if (S.params.mousewheelReleaseOnEdges) return !0;
            } else S.slideNext(), S.emit("onScroll", S, e);
          } else if (S.isBeginning && !S.params.loop || S.animating) {
            if (S.params.mousewheelReleaseOnEdges) return !0;
          } else S.slidePrev(), S.emit("onScroll", S, e);S.mousewheel.lastScrollTime = new window.Date().getTime();
        }return e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1;
      }
    }function m(e) {
      var a = 10,
          t = 40,
          s = 800,
          i = 0,
          r = 0,
          n = 0,
          o = 0;return "detail" in e && (r = e.detail), "wheelDelta" in e && (r = -e.wheelDelta / 120), "wheelDeltaY" in e && (r = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (i = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (i = r, r = 0), n = i * a, o = r * a, "deltaY" in e && (o = e.deltaY), "deltaX" in e && (n = e.deltaX), (n || o) && e.deltaMode && (1 === e.deltaMode ? (n *= t, o *= t) : (n *= s, o *= s)), n && !i && (i = n < 1 ? -1 : 1), o && !r && (r = o < 1 ? -1 : 1), { spinX: i, spinY: r, pixelX: n, pixelY: o };
    }function h(e, t) {
      e = a(e);var s,
          i,
          r,
          n = S.rtl ? -1 : 1;s = e.attr("data-swiper-parallax") || "0", i = e.attr("data-swiper-parallax-x"), r = e.attr("data-swiper-parallax-y"), i || r ? (i = i || "0", r = r || "0") : S.isHorizontal() ? (i = s, r = "0") : (r = s, i = "0"), i = i.indexOf("%") >= 0 ? parseInt(i, 10) * t * n + "%" : i * t * n + "px", r = r.indexOf("%") >= 0 ? parseInt(r, 10) * t + "%" : r * t + "px", e.transform("translate3d(" + i + ", " + r + ",0px)");
    }function g(e) {
      return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e), e;
    }if (!(this instanceof t)) return new t(e, i);var f = { direction: "horizontal", touchEventsTarget: "container", initialSlide: 0, speed: 300, autoplay: !1, autoplayDisableOnInteraction: !0, autoplayStopOnLast: !1, iOSEdgeSwipeDetection: !1, iOSEdgeSwipeThreshold: 20, freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, virtualTranslate: !1, effect: "slide", coverflow: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 }, flip: { slideShadows: !0, limitRotation: !0 }, cube: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 }, fade: { crossFade: !1 }, parallax: !1, zoom: !1, zoomMax: 3, zoomMin: 1, zoomToggle: !0, scrollbar: null, scrollbarHide: !0, scrollbarDraggable: !1, scrollbarSnapOnRelease: !1, keyboardControl: !1, mousewheelControl: !1, mousewheelReleaseOnEdges: !1, mousewheelInvert: !1, mousewheelForceToAxis: !1, mousewheelSensitivity: 1, mousewheelEventsTarged: "container", hashnav: !1, hashnavWatchState: !1, history: !1, replaceState: !1, breakpoints: void 0, spaceBetween: 0, slidesPerView: 1, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, roundLengths: !1, touchRatio: 1, touchAngle: 45, simulateTouch: !0, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, onlyExternal: !1, threshold: 0, touchMoveStopPropagation: !0, touchReleaseOnEdges: !1, uniqueNavElements: !0, pagination: null, paginationElement: "span", paginationClickable: !1, paginationHide: !1, paginationBulletRender: null, paginationProgressRender: null, paginationFractionRender: null, paginationCustomRender: null, paginationType: "bullets", resistance: !0, resistanceRatio: .85, nextButton: null, prevButton: null, watchSlidesProgress: !1, watchSlidesVisibility: !1, grabCursor: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, lazyLoading: !1, lazyLoadingInPrevNext: !1, lazyLoadingInPrevNextAmount: 1, lazyLoadingOnTransitionStart: !1, preloadImages: !0, updateOnImagesReady: !0, loop: !1, loopAdditionalSlides: 0, loopedSlides: null, control: void 0, controlInverse: !1, controlBy: "slide", normalizeSlideIndex: !0, allowSwipeToPrev: !0, allowSwipeToNext: !0, swipeHandler: null, noSwiping: !0, noSwipingClass: "swiper-no-swiping", passiveListeners: !0, containerModifierClass: "swiper-container-", slideClass: "swiper-slide", slideActiveClass: "swiper-slide-active", slideDuplicateActiveClass: "swiper-slide-duplicate-active", slideVisibleClass: "swiper-slide-visible", slideDuplicateClass: "swiper-slide-duplicate", slideNextClass: "swiper-slide-next", slideDuplicateNextClass: "swiper-slide-duplicate-next", slidePrevClass: "swiper-slide-prev", slideDuplicatePrevClass: "swiper-slide-duplicate-prev", wrapperClass: "swiper-wrapper", bulletClass: "swiper-pagination-bullet", bulletActiveClass: "swiper-pagination-bullet-active", buttonDisabledClass: "swiper-button-disabled", paginationCurrentClass: "swiper-pagination-current", paginationTotalClass: "swiper-pagination-total", paginationHiddenClass: "swiper-pagination-hidden", paginationProgressbarClass: "swiper-pagination-progressbar", paginationClickableClass: "swiper-pagination-clickable", paginationModifierClass: "swiper-pagination-", lazyLoadingClass: "swiper-lazy", lazyStatusLoadingClass: "swiper-lazy-loading", lazyStatusLoadedClass: "swiper-lazy-loaded", lazyPreloaderClass: "swiper-lazy-preloader", notificationClass: "swiper-notification", preloaderClass: "preloader", zoomContainerClass: "swiper-zoom-container", observer: !1, observeParents: !1, a11y: !1, prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide", paginationBulletMessage: "Go to slide {{index}}", runCallbacksOnInit: !0 },
        v = i && i.virtualTranslate;i = i || {};var w = {};for (var y in i) {
      if ("object" != _typeof(i[y]) || null === i[y] || i[y].nodeType || i[y] === window || i[y] === document || "undefined" != typeof s && i[y] instanceof s || "undefined" != typeof jQuery && i[y] instanceof jQuery) w[y] = i[y];else {
        w[y] = {};for (var x in i[y]) {
          w[y][x] = i[y][x];
        }
      }
    }for (var T in f) {
      if ("undefined" == typeof i[T]) i[T] = f[T];else if ("object" == _typeof(i[T])) for (var b in f[T]) {
        "undefined" == typeof i[T][b] && (i[T][b] = f[T][b]);
      }
    }var S = this;if (S.params = i, S.originalParams = w, S.classNames = [], "undefined" != typeof a && "undefined" != typeof s && (a = s), ("undefined" != typeof a || (a = "undefined" == typeof s ? window.Dom7 || window.Zepto || window.jQuery : s)) && (S.$ = a, S.currentBreakpoint = void 0, S.getActiveBreakpoint = function () {
      if (!S.params.breakpoints) return !1;var e,
          a = !1,
          t = [];for (e in S.params.breakpoints) {
        S.params.breakpoints.hasOwnProperty(e) && t.push(e);
      }t.sort(function (e, a) {
        return parseInt(e, 10) > parseInt(a, 10);
      });for (var s = 0; s < t.length; s++) {
        e = t[s], e >= window.innerWidth && !a && (a = e);
      }return a || "max";
    }, S.setBreakpoint = function () {
      var e = S.getActiveBreakpoint();if (e && S.currentBreakpoint !== e) {
        var a = e in S.params.breakpoints ? S.params.breakpoints[e] : S.originalParams,
            t = S.params.loop && a.slidesPerView !== S.params.slidesPerView;for (var s in a) {
          S.params[s] = a[s];
        }S.currentBreakpoint = e, t && S.destroyLoop && S.reLoop(!0);
      }
    }, S.params.breakpoints && S.setBreakpoint(), S.container = a(e), 0 !== S.container.length)) {
      if (S.container.length > 1) {
        var C = [];return S.container.each(function () {
          C.push(new t(this, i));
        }), C;
      }S.container[0].swiper = S, S.container.data("swiper", S), S.classNames.push(S.params.containerModifierClass + S.params.direction), S.params.freeMode && S.classNames.push(S.params.containerModifierClass + "free-mode"), S.support.flexbox || (S.classNames.push(S.params.containerModifierClass + "no-flexbox"), S.params.slidesPerColumn = 1), S.params.autoHeight && S.classNames.push(S.params.containerModifierClass + "autoheight"), (S.params.parallax || S.params.watchSlidesVisibility) && (S.params.watchSlidesProgress = !0), S.params.touchReleaseOnEdges && (S.params.resistanceRatio = 0), ["cube", "coverflow", "flip"].indexOf(S.params.effect) >= 0 && (S.support.transforms3d ? (S.params.watchSlidesProgress = !0, S.classNames.push(S.params.containerModifierClass + "3d")) : S.params.effect = "slide"), "slide" !== S.params.effect && S.classNames.push(S.params.containerModifierClass + S.params.effect), "cube" === S.params.effect && (S.params.resistanceRatio = 0, S.params.slidesPerView = 1, S.params.slidesPerColumn = 1, S.params.slidesPerGroup = 1, S.params.centeredSlides = !1, S.params.spaceBetween = 0, S.params.virtualTranslate = !0, S.params.setWrapperSize = !1), "fade" !== S.params.effect && "flip" !== S.params.effect || (S.params.slidesPerView = 1, S.params.slidesPerColumn = 1, S.params.slidesPerGroup = 1, S.params.watchSlidesProgress = !0, S.params.spaceBetween = 0, S.params.setWrapperSize = !1, "undefined" == typeof v && (S.params.virtualTranslate = !0)), S.params.grabCursor && S.support.touch && (S.params.grabCursor = !1), S.wrapper = S.container.children("." + S.params.wrapperClass), S.params.pagination && (S.paginationContainer = a(S.params.pagination), S.params.uniqueNavElements && "string" == typeof S.params.pagination && S.paginationContainer.length > 1 && 1 === S.container.find(S.params.pagination).length && (S.paginationContainer = S.container.find(S.params.pagination)), "bullets" === S.params.paginationType && S.params.paginationClickable ? S.paginationContainer.addClass(S.params.paginationModifierClass + "clickable") : S.params.paginationClickable = !1, S.paginationContainer.addClass(S.params.paginationModifierClass + S.params.paginationType)), (S.params.nextButton || S.params.prevButton) && (S.params.nextButton && (S.nextButton = a(S.params.nextButton), S.params.uniqueNavElements && "string" == typeof S.params.nextButton && S.nextButton.length > 1 && 1 === S.container.find(S.params.nextButton).length && (S.nextButton = S.container.find(S.params.nextButton))), S.params.prevButton && (S.prevButton = a(S.params.prevButton), S.params.uniqueNavElements && "string" == typeof S.params.prevButton && S.prevButton.length > 1 && 1 === S.container.find(S.params.prevButton).length && (S.prevButton = S.container.find(S.params.prevButton)))), S.isHorizontal = function () {
        return "horizontal" === S.params.direction;
      }, S.rtl = S.isHorizontal() && ("rtl" === S.container[0].dir.toLowerCase() || "rtl" === S.container.css("direction")), S.rtl && S.classNames.push(S.params.containerModifierClass + "rtl"), S.rtl && (S.wrongRTL = "-webkit-box" === S.wrapper.css("display")), S.params.slidesPerColumn > 1 && S.classNames.push(S.params.containerModifierClass + "multirow"), S.device.android && S.classNames.push(S.params.containerModifierClass + "android"), S.container.addClass(S.classNames.join(" ")), S.translate = 0, S.progress = 0, S.velocity = 0, S.lockSwipeToNext = function () {
        S.params.allowSwipeToNext = !1, S.params.allowSwipeToPrev === !1 && S.params.grabCursor && S.unsetGrabCursor();
      }, S.lockSwipeToPrev = function () {
        S.params.allowSwipeToPrev = !1, S.params.allowSwipeToNext === !1 && S.params.grabCursor && S.unsetGrabCursor();
      }, S.lockSwipes = function () {
        S.params.allowSwipeToNext = S.params.allowSwipeToPrev = !1, S.params.grabCursor && S.unsetGrabCursor();
      }, S.unlockSwipeToNext = function () {
        S.params.allowSwipeToNext = !0, S.params.allowSwipeToPrev === !0 && S.params.grabCursor && S.setGrabCursor();
      }, S.unlockSwipeToPrev = function () {
        S.params.allowSwipeToPrev = !0, S.params.allowSwipeToNext === !0 && S.params.grabCursor && S.setGrabCursor();
      }, S.unlockSwipes = function () {
        S.params.allowSwipeToNext = S.params.allowSwipeToPrev = !0, S.params.grabCursor && S.setGrabCursor();
      }, S.setGrabCursor = function (e) {
        S.container[0].style.cursor = "move", S.container[0].style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", S.container[0].style.cursor = e ? "-moz-grabbin" : "-moz-grab", S.container[0].style.cursor = e ? "grabbing" : "grab";
      }, S.unsetGrabCursor = function () {
        S.container[0].style.cursor = "";
      }, S.params.grabCursor && S.setGrabCursor(), S.imagesToLoad = [], S.imagesLoaded = 0, S.loadImage = function (e, a, t, s, i, r) {
        function n() {
          r && r();
        }var o;e.complete && i ? n() : a ? (o = new window.Image(), o.onload = n, o.onerror = n, s && (o.sizes = s), t && (o.srcset = t), a && (o.src = a)) : n();
      }, S.preloadImages = function () {
        function e() {
          "undefined" != typeof S && null !== S && (void 0 !== S.imagesLoaded && S.imagesLoaded++, S.imagesLoaded === S.imagesToLoad.length && (S.params.updateOnImagesReady && S.update(), S.emit("onImagesReady", S)));
        }S.imagesToLoad = S.container.find("img");for (var a = 0; a < S.imagesToLoad.length; a++) {
          S.loadImage(S.imagesToLoad[a], S.imagesToLoad[a].currentSrc || S.imagesToLoad[a].getAttribute("src"), S.imagesToLoad[a].srcset || S.imagesToLoad[a].getAttribute("srcset"), S.imagesToLoad[a].sizes || S.imagesToLoad[a].getAttribute("sizes"), !0, e);
        }
      }, S.autoplayTimeoutId = void 0, S.autoplaying = !1, S.autoplayPaused = !1, S.startAutoplay = function () {
        return "undefined" == typeof S.autoplayTimeoutId && !!S.params.autoplay && !S.autoplaying && (S.autoplaying = !0, S.emit("onAutoplayStart", S), void o());
      }, S.stopAutoplay = function (e) {
        S.autoplayTimeoutId && (S.autoplayTimeoutId && clearTimeout(S.autoplayTimeoutId), S.autoplaying = !1, S.autoplayTimeoutId = void 0, S.emit("onAutoplayStop", S));
      }, S.pauseAutoplay = function (e) {
        S.autoplayPaused || (S.autoplayTimeoutId && clearTimeout(S.autoplayTimeoutId), S.autoplayPaused = !0, 0 === e ? (S.autoplayPaused = !1, o()) : S.wrapper.transitionEnd(function () {
          S && (S.autoplayPaused = !1, S.autoplaying ? o() : S.stopAutoplay());
        }));
      }, S.minTranslate = function () {
        return -S.snapGrid[0];
      }, S.maxTranslate = function () {
        return -S.snapGrid[S.snapGrid.length - 1];
      }, S.updateAutoHeight = function () {
        var e = [],
            a = 0;if ("auto" !== S.params.slidesPerView && S.params.slidesPerView > 1) for (r = 0; r < Math.ceil(S.params.slidesPerView); r++) {
          var t = S.activeIndex + r;if (t > S.slides.length) break;e.push(S.slides.eq(t)[0]);
        } else e.push(S.slides.eq(S.activeIndex)[0]);for (r = 0; r < e.length; r++) {
          if ("undefined" != typeof e[r]) {
            var s = e[r].offsetHeight;a = s > a ? s : a;
          }
        }a && S.wrapper.css("height", a + "px");
      }, S.updateContainerSize = function () {
        var e, a;e = "undefined" != typeof S.params.width ? S.params.width : S.container[0].clientWidth, a = "undefined" != typeof S.params.height ? S.params.height : S.container[0].clientHeight, 0 === e && S.isHorizontal() || 0 === a && !S.isHorizontal() || (e = e - parseInt(S.container.css("padding-left"), 10) - parseInt(S.container.css("padding-right"), 10), a = a - parseInt(S.container.css("padding-top"), 10) - parseInt(S.container.css("padding-bottom"), 10), S.width = e, S.height = a, S.size = S.isHorizontal() ? S.width : S.height);
      }, S.updateSlidesSize = function () {
        S.slides = S.wrapper.children("." + S.params.slideClass), S.snapGrid = [], S.slidesGrid = [], S.slidesSizesGrid = [];var e,
            a = S.params.spaceBetween,
            t = -S.params.slidesOffsetBefore,
            s = 0,
            i = 0;if ("undefined" != typeof S.size) {
          "string" == typeof a && a.indexOf("%") >= 0 && (a = parseFloat(a.replace("%", "")) / 100 * S.size), S.virtualSize = -a, S.rtl ? S.slides.css({ marginLeft: "", marginTop: "" }) : S.slides.css({ marginRight: "", marginBottom: "" });var r;S.params.slidesPerColumn > 1 && (r = Math.floor(S.slides.length / S.params.slidesPerColumn) === S.slides.length / S.params.slidesPerColumn ? S.slides.length : Math.ceil(S.slides.length / S.params.slidesPerColumn) * S.params.slidesPerColumn, "auto" !== S.params.slidesPerView && "row" === S.params.slidesPerColumnFill && (r = Math.max(r, S.params.slidesPerView * S.params.slidesPerColumn)));var o,
              l = S.params.slidesPerColumn,
              p = r / l,
              d = p - (S.params.slidesPerColumn * p - S.slides.length);for (e = 0; e < S.slides.length; e++) {
            o = 0;var u = S.slides.eq(e);if (S.params.slidesPerColumn > 1) {
              var c, m, h;"column" === S.params.slidesPerColumnFill ? (m = Math.floor(e / l), h = e - m * l, (m > d || m === d && h === l - 1) && ++h >= l && (h = 0, m++), c = m + h * r / l, u.css({ "-webkit-box-ordinal-group": c, "-moz-box-ordinal-group": c, "-ms-flex-order": c, "-webkit-order": c, order: c })) : (h = Math.floor(e / p), m = e - h * p), u.css("margin-" + (S.isHorizontal() ? "top" : "left"), 0 !== h && S.params.spaceBetween && S.params.spaceBetween + "px").attr("data-swiper-column", m).attr("data-swiper-row", h);
            }"none" !== u.css("display") && ("auto" === S.params.slidesPerView ? (o = S.isHorizontal() ? u.outerWidth(!0) : u.outerHeight(!0), S.params.roundLengths && (o = n(o))) : (o = (S.size - (S.params.slidesPerView - 1) * a) / S.params.slidesPerView, S.params.roundLengths && (o = n(o)), S.isHorizontal() ? S.slides[e].style.width = o + "px" : S.slides[e].style.height = o + "px"), S.slides[e].swiperSlideSize = o, S.slidesSizesGrid.push(o), S.params.centeredSlides ? (t = t + o / 2 + s / 2 + a, 0 === e && (t = t - S.size / 2 - a), Math.abs(t) < .001 && (t = 0), i % S.params.slidesPerGroup === 0 && S.snapGrid.push(t), S.slidesGrid.push(t)) : (i % S.params.slidesPerGroup === 0 && S.snapGrid.push(t), S.slidesGrid.push(t), t = t + o + a), S.virtualSize += o + a, s = o, i++);
          }S.virtualSize = Math.max(S.virtualSize, S.size) + S.params.slidesOffsetAfter;var g;if (S.rtl && S.wrongRTL && ("slide" === S.params.effect || "coverflow" === S.params.effect) && S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }), S.support.flexbox && !S.params.setWrapperSize || (S.isHorizontal() ? S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }) : S.wrapper.css({ height: S.virtualSize + S.params.spaceBetween + "px" })), S.params.slidesPerColumn > 1 && (S.virtualSize = (o + S.params.spaceBetween) * r, S.virtualSize = Math.ceil(S.virtualSize / S.params.slidesPerColumn) - S.params.spaceBetween, S.isHorizontal() ? S.wrapper.css({ width: S.virtualSize + S.params.spaceBetween + "px" }) : S.wrapper.css({ height: S.virtualSize + S.params.spaceBetween + "px" }), S.params.centeredSlides)) {
            for (g = [], e = 0; e < S.snapGrid.length; e++) {
              S.snapGrid[e] < S.virtualSize + S.snapGrid[0] && g.push(S.snapGrid[e]);
            }S.snapGrid = g;
          }if (!S.params.centeredSlides) {
            for (g = [], e = 0; e < S.snapGrid.length; e++) {
              S.snapGrid[e] <= S.virtualSize - S.size && g.push(S.snapGrid[e]);
            }S.snapGrid = g, Math.floor(S.virtualSize - S.size) - Math.floor(S.snapGrid[S.snapGrid.length - 1]) > 1 && S.snapGrid.push(S.virtualSize - S.size);
          }0 === S.snapGrid.length && (S.snapGrid = [0]), 0 !== S.params.spaceBetween && (S.isHorizontal() ? S.rtl ? S.slides.css({ marginLeft: a + "px" }) : S.slides.css({ marginRight: a + "px" }) : S.slides.css({ marginBottom: a + "px" })), S.params.watchSlidesProgress && S.updateSlidesOffset();
        }
      }, S.updateSlidesOffset = function () {
        for (var e = 0; e < S.slides.length; e++) {
          S.slides[e].swiperSlideOffset = S.isHorizontal() ? S.slides[e].offsetLeft : S.slides[e].offsetTop;
        }
      }, S.updateSlidesProgress = function (e) {
        if ("undefined" == typeof e && (e = S.translate || 0), 0 !== S.slides.length) {
          "undefined" == typeof S.slides[0].swiperSlideOffset && S.updateSlidesOffset();var a = -e;S.rtl && (a = e), S.slides.removeClass(S.params.slideVisibleClass);for (var t = 0; t < S.slides.length; t++) {
            var s = S.slides[t],
                i = (a + (S.params.centeredSlides ? S.minTranslate() : 0) - s.swiperSlideOffset) / (s.swiperSlideSize + S.params.spaceBetween);if (S.params.watchSlidesVisibility) {
              var r = -(a - s.swiperSlideOffset),
                  n = r + S.slidesSizesGrid[t],
                  o = r >= 0 && r < S.size || n > 0 && n <= S.size || r <= 0 && n >= S.size;o && S.slides.eq(t).addClass(S.params.slideVisibleClass);
            }s.progress = S.rtl ? -i : i;
          }
        }
      }, S.updateProgress = function (e) {
        "undefined" == typeof e && (e = S.translate || 0);var a = S.maxTranslate() - S.minTranslate(),
            t = S.isBeginning,
            s = S.isEnd;0 === a ? (S.progress = 0, S.isBeginning = S.isEnd = !0) : (S.progress = (e - S.minTranslate()) / a, S.isBeginning = S.progress <= 0, S.isEnd = S.progress >= 1), S.isBeginning && !t && S.emit("onReachBeginning", S), S.isEnd && !s && S.emit("onReachEnd", S), S.params.watchSlidesProgress && S.updateSlidesProgress(e), S.emit("onProgress", S, S.progress);
      }, S.updateActiveIndex = function () {
        var e,
            a,
            t,
            s = S.rtl ? S.translate : -S.translate;for (a = 0; a < S.slidesGrid.length; a++) {
          "undefined" != typeof S.slidesGrid[a + 1] ? s >= S.slidesGrid[a] && s < S.slidesGrid[a + 1] - (S.slidesGrid[a + 1] - S.slidesGrid[a]) / 2 ? e = a : s >= S.slidesGrid[a] && s < S.slidesGrid[a + 1] && (e = a + 1) : s >= S.slidesGrid[a] && (e = a);
        }S.params.normalizeSlideIndex && (e < 0 || "undefined" == typeof e) && (e = 0), t = Math.floor(e / S.params.slidesPerGroup), t >= S.snapGrid.length && (t = S.snapGrid.length - 1), e !== S.activeIndex && (S.snapIndex = t, S.previousIndex = S.activeIndex, S.activeIndex = e, S.updateClasses(), S.updateRealIndex());
      }, S.updateRealIndex = function () {
        S.realIndex = S.slides.eq(S.activeIndex).attr("data-swiper-slide-index") || S.activeIndex;
      }, S.updateClasses = function () {
        S.slides.removeClass(S.params.slideActiveClass + " " + S.params.slideNextClass + " " + S.params.slidePrevClass + " " + S.params.slideDuplicateActiveClass + " " + S.params.slideDuplicateNextClass + " " + S.params.slideDuplicatePrevClass);var e = S.slides.eq(S.activeIndex);e.addClass(S.params.slideActiveClass), i.loop && (e.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + S.realIndex + '"]').addClass(S.params.slideDuplicateActiveClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + S.realIndex + '"]').addClass(S.params.slideDuplicateActiveClass));var t = e.next("." + S.params.slideClass).addClass(S.params.slideNextClass);S.params.loop && 0 === t.length && (t = S.slides.eq(0), t.addClass(S.params.slideNextClass));var s = e.prev("." + S.params.slideClass).addClass(S.params.slidePrevClass);if (S.params.loop && 0 === s.length && (s = S.slides.eq(-1), s.addClass(S.params.slidePrevClass)), i.loop && (t.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + t.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicateNextClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + t.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicateNextClass), s.hasClass(S.params.slideDuplicateClass) ? S.wrapper.children("." + S.params.slideClass + ":not(." + S.params.slideDuplicateClass + ')[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicatePrevClass) : S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(S.params.slideDuplicatePrevClass)), S.paginationContainer && S.paginationContainer.length > 0) {
          var r,
              n = S.params.loop ? Math.ceil((S.slides.length - 2 * S.loopedSlides) / S.params.slidesPerGroup) : S.snapGrid.length;if (S.params.loop ? (r = Math.ceil((S.activeIndex - S.loopedSlides) / S.params.slidesPerGroup), r > S.slides.length - 1 - 2 * S.loopedSlides && (r -= S.slides.length - 2 * S.loopedSlides), r > n - 1 && (r -= n), r < 0 && "bullets" !== S.params.paginationType && (r = n + r)) : r = "undefined" != typeof S.snapIndex ? S.snapIndex : S.activeIndex || 0, "bullets" === S.params.paginationType && S.bullets && S.bullets.length > 0 && (S.bullets.removeClass(S.params.bulletActiveClass), S.paginationContainer.length > 1 ? S.bullets.each(function () {
            a(this).index() === r && a(this).addClass(S.params.bulletActiveClass);
          }) : S.bullets.eq(r).addClass(S.params.bulletActiveClass)), "fraction" === S.params.paginationType && (S.paginationContainer.find("." + S.params.paginationCurrentClass).text(r + 1), S.paginationContainer.find("." + S.params.paginationTotalClass).text(n)), "progress" === S.params.paginationType) {
            var o = (r + 1) / n,
                l = o,
                p = 1;S.isHorizontal() || (p = o, l = 1), S.paginationContainer.find("." + S.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + l + ") scaleY(" + p + ")").transition(S.params.speed);
          }"custom" === S.params.paginationType && S.params.paginationCustomRender && (S.paginationContainer.html(S.params.paginationCustomRender(S, r + 1, n)), S.emit("onPaginationRendered", S, S.paginationContainer[0]));
        }S.params.loop || (S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.isBeginning ? (S.prevButton.addClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.disable(S.prevButton)) : (S.prevButton.removeClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.enable(S.prevButton))), S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.isEnd ? (S.nextButton.addClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.disable(S.nextButton)) : (S.nextButton.removeClass(S.params.buttonDisabledClass), S.params.a11y && S.a11y && S.a11y.enable(S.nextButton))));
      }, S.updatePagination = function () {
        if (S.params.pagination && S.paginationContainer && S.paginationContainer.length > 0) {
          var e = "";if ("bullets" === S.params.paginationType) {
            for (var a = S.params.loop ? Math.ceil((S.slides.length - 2 * S.loopedSlides) / S.params.slidesPerGroup) : S.snapGrid.length, t = 0; t < a; t++) {
              e += S.params.paginationBulletRender ? S.params.paginationBulletRender(S, t, S.params.bulletClass) : "<" + S.params.paginationElement + ' class="' + S.params.bulletClass + '"></' + S.params.paginationElement + ">";
            }S.paginationContainer.html(e), S.bullets = S.paginationContainer.find("." + S.params.bulletClass), S.params.paginationClickable && S.params.a11y && S.a11y && S.a11y.initPagination();
          }"fraction" === S.params.paginationType && (e = S.params.paginationFractionRender ? S.params.paginationFractionRender(S, S.params.paginationCurrentClass, S.params.paginationTotalClass) : '<span class="' + S.params.paginationCurrentClass + '"></span> / <span class="' + S.params.paginationTotalClass + '"></span>', S.paginationContainer.html(e)), "progress" === S.params.paginationType && (e = S.params.paginationProgressRender ? S.params.paginationProgressRender(S, S.params.paginationProgressbarClass) : '<span class="' + S.params.paginationProgressbarClass + '"></span>', S.paginationContainer.html(e)), "custom" !== S.params.paginationType && S.emit("onPaginationRendered", S, S.paginationContainer[0]);
        }
      }, S.update = function (e) {
        function a() {
          S.rtl ? -S.translate : S.translate;s = Math.min(Math.max(S.translate, S.maxTranslate()), S.minTranslate()), S.setWrapperTranslate(s), S.updateActiveIndex(), S.updateClasses();
        }if (S.updateContainerSize(), S.updateSlidesSize(), S.updateProgress(), S.updatePagination(), S.updateClasses(), S.params.scrollbar && S.scrollbar && S.scrollbar.set(), e) {
          var t, s;S.controller && S.controller.spline && (S.controller.spline = void 0), S.params.freeMode ? (a(), S.params.autoHeight && S.updateAutoHeight()) : (t = ("auto" === S.params.slidesPerView || S.params.slidesPerView > 1) && S.isEnd && !S.params.centeredSlides ? S.slideTo(S.slides.length - 1, 0, !1, !0) : S.slideTo(S.activeIndex, 0, !1, !0), t || a());
        } else S.params.autoHeight && S.updateAutoHeight();
      }, S.onResize = function (e) {
        S.params.breakpoints && S.setBreakpoint();var a = S.params.allowSwipeToPrev,
            t = S.params.allowSwipeToNext;S.params.allowSwipeToPrev = S.params.allowSwipeToNext = !0, S.updateContainerSize(), S.updateSlidesSize(), ("auto" === S.params.slidesPerView || S.params.freeMode || e) && S.updatePagination(), S.params.scrollbar && S.scrollbar && S.scrollbar.set(), S.controller && S.controller.spline && (S.controller.spline = void 0);var s = !1;if (S.params.freeMode) {
          var i = Math.min(Math.max(S.translate, S.maxTranslate()), S.minTranslate());S.setWrapperTranslate(i), S.updateActiveIndex(), S.updateClasses(), S.params.autoHeight && S.updateAutoHeight();
        } else S.updateClasses(), s = ("auto" === S.params.slidesPerView || S.params.slidesPerView > 1) && S.isEnd && !S.params.centeredSlides ? S.slideTo(S.slides.length - 1, 0, !1, !0) : S.slideTo(S.activeIndex, 0, !1, !0);S.params.lazyLoading && !s && S.lazy && S.lazy.load(), S.params.allowSwipeToPrev = a, S.params.allowSwipeToNext = t;
      }, S.touchEventsDesktop = { start: "mousedown", move: "mousemove", end: "mouseup" }, window.navigator.pointerEnabled ? S.touchEventsDesktop = { start: "pointerdown", move: "pointermove", end: "pointerup" } : window.navigator.msPointerEnabled && (S.touchEventsDesktop = { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" }), S.touchEvents = { start: S.support.touch || !S.params.simulateTouch ? "touchstart" : S.touchEventsDesktop.start, move: S.support.touch || !S.params.simulateTouch ? "touchmove" : S.touchEventsDesktop.move, end: S.support.touch || !S.params.simulateTouch ? "touchend" : S.touchEventsDesktop.end }, (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === S.params.touchEventsTarget ? S.container : S.wrapper).addClass("swiper-wp8-" + S.params.direction), S.initEvents = function (e) {
        var a = e ? "off" : "on",
            t = e ? "removeEventListener" : "addEventListener",
            s = "container" === S.params.touchEventsTarget ? S.container[0] : S.wrapper[0],
            r = S.support.touch ? s : document,
            n = !!S.params.nested;if (S.browser.ie) s[t](S.touchEvents.start, S.onTouchStart, !1), r[t](S.touchEvents.move, S.onTouchMove, n), r[t](S.touchEvents.end, S.onTouchEnd, !1);else {
          if (S.support.touch) {
            var o = !("touchstart" !== S.touchEvents.start || !S.support.passiveListener || !S.params.passiveListeners) && { passive: !0, capture: !1 };s[t](S.touchEvents.start, S.onTouchStart, o), s[t](S.touchEvents.move, S.onTouchMove, n), s[t](S.touchEvents.end, S.onTouchEnd, o);
          }(i.simulateTouch && !S.device.ios && !S.device.android || i.simulateTouch && !S.support.touch && S.device.ios) && (s[t]("mousedown", S.onTouchStart, !1), document[t]("mousemove", S.onTouchMove, n), document[t]("mouseup", S.onTouchEnd, !1));
        }window[t]("resize", S.onResize), S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.nextButton[a]("click", S.onClickNext), S.params.a11y && S.a11y && S.nextButton[a]("keydown", S.a11y.onEnterKey)), S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.prevButton[a]("click", S.onClickPrev), S.params.a11y && S.a11y && S.prevButton[a]("keydown", S.a11y.onEnterKey)), S.params.pagination && S.params.paginationClickable && (S.paginationContainer[a]("click", "." + S.params.bulletClass, S.onClickIndex), S.params.a11y && S.a11y && S.paginationContainer[a]("keydown", "." + S.params.bulletClass, S.a11y.onEnterKey)), (S.params.preventClicks || S.params.preventClicksPropagation) && s[t]("click", S.preventClicks, !0);
      }, S.attachEvents = function () {
        S.initEvents();
      }, S.detachEvents = function () {
        S.initEvents(!0);
      }, S.allowClick = !0, S.preventClicks = function (e) {
        S.allowClick || (S.params.preventClicks && e.preventDefault(), S.params.preventClicksPropagation && S.animating && (e.stopPropagation(), e.stopImmediatePropagation()));
      }, S.onClickNext = function (e) {
        e.preventDefault(), S.isEnd && !S.params.loop || S.slideNext();
      }, S.onClickPrev = function (e) {
        e.preventDefault(), S.isBeginning && !S.params.loop || S.slidePrev();
      }, S.onClickIndex = function (e) {
        e.preventDefault();var t = a(this).index() * S.params.slidesPerGroup;S.params.loop && (t += S.loopedSlides), S.slideTo(t);
      }, S.updateClickedSlide = function (e) {
        var t = l(e, "." + S.params.slideClass),
            s = !1;if (t) for (var i = 0; i < S.slides.length; i++) {
          S.slides[i] === t && (s = !0);
        }if (!t || !s) return S.clickedSlide = void 0, void (S.clickedIndex = void 0);if (S.clickedSlide = t, S.clickedIndex = a(t).index(), S.params.slideToClickedSlide && void 0 !== S.clickedIndex && S.clickedIndex !== S.activeIndex) {
          var r,
              n = S.clickedIndex;if (S.params.loop) {
            if (S.animating) return;r = a(S.clickedSlide).attr("data-swiper-slide-index"), S.params.centeredSlides ? n < S.loopedSlides - S.params.slidesPerView / 2 || n > S.slides.length - S.loopedSlides + S.params.slidesPerView / 2 ? (S.fixLoop(), n = S.wrapper.children("." + S.params.slideClass + '[data-swiper-slide-index="' + r + '"]:not(.' + S.params.slideDuplicateClass + ")").eq(0).index(), setTimeout(function () {
              S.slideTo(n);
            }, 0)) : S.slideTo(n) : n > S.slides.length - S.params.slidesPerView ? (S.fixLoop(), n = S.wrapper.children("." + S.params.slideClass + '[data-swiper-slide-index="' + r + '"]:not(.' + S.params.slideDuplicateClass + ")").eq(0).index(), setTimeout(function () {
              S.slideTo(n);
            }, 0)) : S.slideTo(n);
          } else S.slideTo(n);
        }
      };var z,
          M,
          E,
          P,
          I,
          k,
          L,
          D,
          B,
          H,
          G = "input, select, textarea, button, video",
          X = Date.now(),
          Y = [];S.animating = !1, S.touches = { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 };var A, O;S.onTouchStart = function (e) {
        if (e.originalEvent && (e = e.originalEvent), A = "touchstart" === e.type, A || !("which" in e) || 3 !== e.which) {
          if (S.params.noSwiping && l(e, "." + S.params.noSwipingClass)) return void (S.allowClick = !0);if (!S.params.swipeHandler || l(e, S.params.swipeHandler)) {
            var t = S.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
                s = S.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;if (!(S.device.ios && S.params.iOSEdgeSwipeDetection && t <= S.params.iOSEdgeSwipeThreshold)) {
              if (z = !0, M = !1, E = !0, I = void 0, O = void 0, S.touches.startX = t, S.touches.startY = s, P = Date.now(), S.allowClick = !0, S.updateContainerSize(), S.swipeDirection = void 0, S.params.threshold > 0 && (D = !1), "touchstart" !== e.type) {
                var i = !0;a(e.target).is(G) && (i = !1), document.activeElement && a(document.activeElement).is(G) && document.activeElement.blur(), i && e.preventDefault();
              }S.emit("onTouchStart", S, e);
            }
          }
        }
      }, S.onTouchMove = function (e) {
        if (e.originalEvent && (e = e.originalEvent), !A || "mousemove" !== e.type) {
          if (e.preventedByNestedSwiper) return S.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, void (S.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY);if (S.params.onlyExternal) return S.allowClick = !1, void (z && (S.touches.startX = S.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, S.touches.startY = S.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, P = Date.now()));if (A && S.params.touchReleaseOnEdges && !S.params.loop) if (S.isHorizontal()) {
            if (S.touches.currentX < S.touches.startX && S.translate <= S.maxTranslate() || S.touches.currentX > S.touches.startX && S.translate >= S.minTranslate()) return;
          } else if (S.touches.currentY < S.touches.startY && S.translate <= S.maxTranslate() || S.touches.currentY > S.touches.startY && S.translate >= S.minTranslate()) return;if (A && document.activeElement && e.target === document.activeElement && a(e.target).is(G)) return M = !0, void (S.allowClick = !1);if (E && S.emit("onTouchMove", S, e), !(e.targetTouches && e.targetTouches.length > 1)) {
            if (S.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, S.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, "undefined" == typeof I) {
              var t;S.isHorizontal() && S.touches.currentY === S.touches.startY || !S.isHorizontal() && S.touches.currentX !== S.touches.startX ? I = !1 : (t = 180 * Math.atan2(Math.abs(S.touches.currentY - S.touches.startY), Math.abs(S.touches.currentX - S.touches.startX)) / Math.PI, I = S.isHorizontal() ? t > S.params.touchAngle : 90 - t > S.params.touchAngle);
            }if (I && S.emit("onTouchMoveOpposite", S, e), "undefined" == typeof O && S.browser.ieTouch && (S.touches.currentX === S.touches.startX && S.touches.currentY === S.touches.startY || (O = !0)), z) {
              if (I) return void (z = !1);if (O || !S.browser.ieTouch) {
                S.allowClick = !1, S.emit("onSliderMove", S, e), e.preventDefault(), S.params.touchMoveStopPropagation && !S.params.nested && e.stopPropagation(), M || (i.loop && S.fixLoop(), L = S.getWrapperTranslate(), S.setWrapperTransition(0), S.animating && S.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), S.params.autoplay && S.autoplaying && (S.params.autoplayDisableOnInteraction ? S.stopAutoplay() : S.pauseAutoplay()), H = !1, !S.params.grabCursor || S.params.allowSwipeToNext !== !0 && S.params.allowSwipeToPrev !== !0 || S.setGrabCursor(!0)), M = !0;var s = S.touches.diff = S.isHorizontal() ? S.touches.currentX - S.touches.startX : S.touches.currentY - S.touches.startY;s *= S.params.touchRatio, S.rtl && (s = -s), S.swipeDirection = s > 0 ? "prev" : "next", k = s + L;var r = !0;if (s > 0 && k > S.minTranslate() ? (r = !1, S.params.resistance && (k = S.minTranslate() - 1 + Math.pow(-S.minTranslate() + L + s, S.params.resistanceRatio))) : s < 0 && k < S.maxTranslate() && (r = !1, S.params.resistance && (k = S.maxTranslate() + 1 - Math.pow(S.maxTranslate() - L - s, S.params.resistanceRatio))), r && (e.preventedByNestedSwiper = !0), !S.params.allowSwipeToNext && "next" === S.swipeDirection && k < L && (k = L), !S.params.allowSwipeToPrev && "prev" === S.swipeDirection && k > L && (k = L), S.params.threshold > 0) {
                  if (!(Math.abs(s) > S.params.threshold || D)) return void (k = L);if (!D) return D = !0, S.touches.startX = S.touches.currentX, S.touches.startY = S.touches.currentY, k = L, void (S.touches.diff = S.isHorizontal() ? S.touches.currentX - S.touches.startX : S.touches.currentY - S.touches.startY);
                }S.params.followFinger && ((S.params.freeMode || S.params.watchSlidesProgress) && S.updateActiveIndex(), S.params.freeMode && (0 === Y.length && Y.push({ position: S.touches[S.isHorizontal() ? "startX" : "startY"], time: P }), Y.push({ position: S.touches[S.isHorizontal() ? "currentX" : "currentY"], time: new window.Date().getTime() })), S.updateProgress(k), S.setWrapperTranslate(k));
              }
            }
          }
        }
      }, S.onTouchEnd = function (e) {
        if (e.originalEvent && (e = e.originalEvent), E && S.emit("onTouchEnd", S, e), E = !1, z) {
          S.params.grabCursor && M && z && (S.params.allowSwipeToNext === !0 || S.params.allowSwipeToPrev === !0) && S.setGrabCursor(!1);var t = Date.now(),
              s = t - P;if (S.allowClick && (S.updateClickedSlide(e), S.emit("onTap", S, e), s < 300 && t - X > 300 && (B && clearTimeout(B), B = setTimeout(function () {
            S && (S.params.paginationHide && S.paginationContainer.length > 0 && !a(e.target).hasClass(S.params.bulletClass) && S.paginationContainer.toggleClass(S.params.paginationHiddenClass), S.emit("onClick", S, e));
          }, 300)), s < 300 && t - X < 300 && (B && clearTimeout(B), S.emit("onDoubleTap", S, e))), X = Date.now(), setTimeout(function () {
            S && (S.allowClick = !0);
          }, 0), !z || !M || !S.swipeDirection || 0 === S.touches.diff || k === L) return void (z = M = !1);z = M = !1;var i;if (i = S.params.followFinger ? S.rtl ? S.translate : -S.translate : -k, S.params.freeMode) {
            if (i < -S.minTranslate()) return void S.slideTo(S.activeIndex);if (i > -S.maxTranslate()) return void (S.slides.length < S.snapGrid.length ? S.slideTo(S.snapGrid.length - 1) : S.slideTo(S.slides.length - 1));if (S.params.freeModeMomentum) {
              if (Y.length > 1) {
                var r = Y.pop(),
                    n = Y.pop(),
                    o = r.position - n.position,
                    l = r.time - n.time;S.velocity = o / l, S.velocity = S.velocity / 2, Math.abs(S.velocity) < S.params.freeModeMinimumVelocity && (S.velocity = 0), (l > 150 || new window.Date().getTime() - r.time > 300) && (S.velocity = 0);
              } else S.velocity = 0;S.velocity = S.velocity * S.params.freeModeMomentumVelocityRatio, Y.length = 0;var p = 1e3 * S.params.freeModeMomentumRatio,
                  d = S.velocity * p,
                  u = S.translate + d;S.rtl && (u = -u);var c,
                  m = !1,
                  h = 20 * Math.abs(S.velocity) * S.params.freeModeMomentumBounceRatio;if (u < S.maxTranslate()) S.params.freeModeMomentumBounce ? (u + S.maxTranslate() < -h && (u = S.maxTranslate() - h), c = S.maxTranslate(), m = !0, H = !0) : u = S.maxTranslate();else if (u > S.minTranslate()) S.params.freeModeMomentumBounce ? (u - S.minTranslate() > h && (u = S.minTranslate() + h), c = S.minTranslate(), m = !0, H = !0) : u = S.minTranslate();else if (S.params.freeModeSticky) {
                var g,
                    f = 0;for (f = 0; f < S.snapGrid.length; f += 1) {
                  if (S.snapGrid[f] > -u) {
                    g = f;break;
                  }
                }u = Math.abs(S.snapGrid[g] - u) < Math.abs(S.snapGrid[g - 1] - u) || "next" === S.swipeDirection ? S.snapGrid[g] : S.snapGrid[g - 1], S.rtl || (u = -u);
              }if (0 !== S.velocity) p = S.rtl ? Math.abs((-u - S.translate) / S.velocity) : Math.abs((u - S.translate) / S.velocity);else if (S.params.freeModeSticky) return void S.slideReset();S.params.freeModeMomentumBounce && m ? (S.updateProgress(c), S.setWrapperTransition(p), S.setWrapperTranslate(u), S.onTransitionStart(), S.animating = !0, S.wrapper.transitionEnd(function () {
                S && H && (S.emit("onMomentumBounce", S), S.setWrapperTransition(S.params.speed), S.setWrapperTranslate(c), S.wrapper.transitionEnd(function () {
                  S && S.onTransitionEnd();
                }));
              })) : S.velocity ? (S.updateProgress(u), S.setWrapperTransition(p), S.setWrapperTranslate(u), S.onTransitionStart(), S.animating || (S.animating = !0, S.wrapper.transitionEnd(function () {
                S && S.onTransitionEnd();
              }))) : S.updateProgress(u), S.updateActiveIndex();
            }return void ((!S.params.freeModeMomentum || s >= S.params.longSwipesMs) && (S.updateProgress(), S.updateActiveIndex()));
          }var v,
              w = 0,
              y = S.slidesSizesGrid[0];for (v = 0; v < S.slidesGrid.length; v += S.params.slidesPerGroup) {
            "undefined" != typeof S.slidesGrid[v + S.params.slidesPerGroup] ? i >= S.slidesGrid[v] && i < S.slidesGrid[v + S.params.slidesPerGroup] && (w = v, y = S.slidesGrid[v + S.params.slidesPerGroup] - S.slidesGrid[v]) : i >= S.slidesGrid[v] && (w = v, y = S.slidesGrid[S.slidesGrid.length - 1] - S.slidesGrid[S.slidesGrid.length - 2]);
          }var x = (i - S.slidesGrid[w]) / y;if (s > S.params.longSwipesMs) {
            if (!S.params.longSwipes) return void S.slideTo(S.activeIndex);"next" === S.swipeDirection && (x >= S.params.longSwipesRatio ? S.slideTo(w + S.params.slidesPerGroup) : S.slideTo(w)), "prev" === S.swipeDirection && (x > 1 - S.params.longSwipesRatio ? S.slideTo(w + S.params.slidesPerGroup) : S.slideTo(w));
          } else {
            if (!S.params.shortSwipes) return void S.slideTo(S.activeIndex);"next" === S.swipeDirection && S.slideTo(w + S.params.slidesPerGroup), "prev" === S.swipeDirection && S.slideTo(w);
          }
        }
      }, S._slideTo = function (e, a) {
        return S.slideTo(e, a, !0, !0);
      }, S.slideTo = function (e, a, t, s) {
        "undefined" == typeof t && (t = !0), "undefined" == typeof e && (e = 0), e < 0 && (e = 0), S.snapIndex = Math.floor(e / S.params.slidesPerGroup), S.snapIndex >= S.snapGrid.length && (S.snapIndex = S.snapGrid.length - 1);var i = -S.snapGrid[S.snapIndex];if (S.params.autoplay && S.autoplaying && (s || !S.params.autoplayDisableOnInteraction ? S.pauseAutoplay(a) : S.stopAutoplay()), S.updateProgress(i), S.params.normalizeSlideIndex) for (var r = 0; r < S.slidesGrid.length; r++) {
          -Math.floor(100 * i) >= Math.floor(100 * S.slidesGrid[r]) && (e = r);
        }return !(!S.params.allowSwipeToNext && i < S.translate && i < S.minTranslate()) && !(!S.params.allowSwipeToPrev && i > S.translate && i > S.maxTranslate() && (S.activeIndex || 0) !== e) && ("undefined" == typeof a && (a = S.params.speed), S.previousIndex = S.activeIndex || 0, S.activeIndex = e, S.updateRealIndex(), S.rtl && -i === S.translate || !S.rtl && i === S.translate ? (S.params.autoHeight && S.updateAutoHeight(), S.updateClasses(), "slide" !== S.params.effect && S.setWrapperTranslate(i), !1) : (S.updateClasses(), S.onTransitionStart(t), 0 === a || S.browser.lteIE9 ? (S.setWrapperTranslate(i), S.setWrapperTransition(0), S.onTransitionEnd(t)) : (S.setWrapperTranslate(i), S.setWrapperTransition(a), S.animating || (S.animating = !0, S.wrapper.transitionEnd(function () {
          S && S.onTransitionEnd(t);
        }))), !0));
      }, S.onTransitionStart = function (e) {
        "undefined" == typeof e && (e = !0), S.params.autoHeight && S.updateAutoHeight(), S.lazy && S.lazy.onTransitionStart(), e && (S.emit("onTransitionStart", S), S.activeIndex !== S.previousIndex && (S.emit("onSlideChangeStart", S), S.activeIndex > S.previousIndex ? S.emit("onSlideNextStart", S) : S.emit("onSlidePrevStart", S)));
      }, S.onTransitionEnd = function (e) {
        S.animating = !1, S.setWrapperTransition(0), "undefined" == typeof e && (e = !0), S.lazy && S.lazy.onTransitionEnd(), e && (S.emit("onTransitionEnd", S), S.activeIndex !== S.previousIndex && (S.emit("onSlideChangeEnd", S), S.activeIndex > S.previousIndex ? S.emit("onSlideNextEnd", S) : S.emit("onSlidePrevEnd", S))), S.params.history && S.history && S.history.setHistory(S.params.history, S.activeIndex), S.params.hashnav && S.hashnav && S.hashnav.setHash();
      }, S.slideNext = function (e, a, t) {
        if (S.params.loop) {
          if (S.animating) return !1;S.fixLoop();S.container[0].clientLeft;return S.slideTo(S.activeIndex + S.params.slidesPerGroup, a, e, t);
        }return S.slideTo(S.activeIndex + S.params.slidesPerGroup, a, e, t);
      }, S._slideNext = function (e) {
        return S.slideNext(!0, e, !0);
      }, S.slidePrev = function (e, a, t) {
        if (S.params.loop) {
          if (S.animating) return !1;S.fixLoop();S.container[0].clientLeft;return S.slideTo(S.activeIndex - 1, a, e, t);
        }return S.slideTo(S.activeIndex - 1, a, e, t);
      }, S._slidePrev = function (e) {
        return S.slidePrev(!0, e, !0);
      }, S.slideReset = function (e, a, t) {
        return S.slideTo(S.activeIndex, a, e);
      }, S.disableTouchControl = function () {
        return S.params.onlyExternal = !0, !0;
      }, S.enableTouchControl = function () {
        return S.params.onlyExternal = !1, !0;
      }, S.setWrapperTransition = function (e, a) {
        S.wrapper.transition(e), "slide" !== S.params.effect && S.effects[S.params.effect] && S.effects[S.params.effect].setTransition(e), S.params.parallax && S.parallax && S.parallax.setTransition(e), S.params.scrollbar && S.scrollbar && S.scrollbar.setTransition(e), S.params.control && S.controller && S.controller.setTransition(e, a), S.emit("onSetTransition", S, e);
      }, S.setWrapperTranslate = function (e, a, t) {
        var s = 0,
            i = 0,
            r = 0;S.isHorizontal() ? s = S.rtl ? -e : e : i = e, S.params.roundLengths && (s = n(s), i = n(i)), S.params.virtualTranslate || (S.support.transforms3d ? S.wrapper.transform("translate3d(" + s + "px, " + i + "px, " + r + "px)") : S.wrapper.transform("translate(" + s + "px, " + i + "px)")), S.translate = S.isHorizontal() ? s : i;var o,
            l = S.maxTranslate() - S.minTranslate();o = 0 === l ? 0 : (e - S.minTranslate()) / l, o !== S.progress && S.updateProgress(e), a && S.updateActiveIndex(), "slide" !== S.params.effect && S.effects[S.params.effect] && S.effects[S.params.effect].setTranslate(S.translate), S.params.parallax && S.parallax && S.parallax.setTranslate(S.translate), S.params.scrollbar && S.scrollbar && S.scrollbar.setTranslate(S.translate), S.params.control && S.controller && S.controller.setTranslate(S.translate, t), S.emit("onSetTranslate", S, S.translate);
      }, S.getTranslate = function (e, a) {
        var t, s, i, r;return "undefined" == typeof a && (a = "x"), S.params.virtualTranslate ? S.rtl ? -S.translate : S.translate : (i = window.getComputedStyle(e, null), window.WebKitCSSMatrix ? (s = i.transform || i.webkitTransform, s.split(",").length > 6 && (s = s.split(", ").map(function (e) {
          return e.replace(",", ".");
        }).join(", ")), r = new window.WebKitCSSMatrix("none" === s ? "" : s)) : (r = i.MozTransform || i.OTransform || i.MsTransform || i.msTransform || i.transform || i.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), t = r.toString().split(",")), "x" === a && (s = window.WebKitCSSMatrix ? r.m41 : 16 === t.length ? parseFloat(t[12]) : parseFloat(t[4])), "y" === a && (s = window.WebKitCSSMatrix ? r.m42 : 16 === t.length ? parseFloat(t[13]) : parseFloat(t[5])), S.rtl && s && (s = -s), s || 0);
      }, S.getWrapperTranslate = function (e) {
        return "undefined" == typeof e && (e = S.isHorizontal() ? "x" : "y"), S.getTranslate(S.wrapper[0], e);
      }, S.observers = [], S.initObservers = function () {
        if (S.params.observeParents) for (var e = S.container.parents(), a = 0; a < e.length; a++) {
          p(e[a]);
        }p(S.container[0], { childList: !1 }), p(S.wrapper[0], { attributes: !1 });
      }, S.disconnectObservers = function () {
        for (var e = 0; e < S.observers.length; e++) {
          S.observers[e].disconnect();
        }S.observers = [];
      }, S.createLoop = function () {
        S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass).remove();var e = S.wrapper.children("." + S.params.slideClass);"auto" !== S.params.slidesPerView || S.params.loopedSlides || (S.params.loopedSlides = e.length), S.loopedSlides = parseInt(S.params.loopedSlides || S.params.slidesPerView, 10), S.loopedSlides = S.loopedSlides + S.params.loopAdditionalSlides, S.loopedSlides > e.length && (S.loopedSlides = e.length);var t,
            s = [],
            i = [];for (e.each(function (t, r) {
          var n = a(this);t < S.loopedSlides && i.push(r), t < e.length && t >= e.length - S.loopedSlides && s.push(r), n.attr("data-swiper-slide-index", t);
        }), t = 0; t < i.length; t++) {
          S.wrapper.append(a(i[t].cloneNode(!0)).addClass(S.params.slideDuplicateClass));
        }for (t = s.length - 1; t >= 0; t--) {
          S.wrapper.prepend(a(s[t].cloneNode(!0)).addClass(S.params.slideDuplicateClass));
        }
      }, S.destroyLoop = function () {
        S.wrapper.children("." + S.params.slideClass + "." + S.params.slideDuplicateClass).remove(), S.slides.removeAttr("data-swiper-slide-index");
      }, S.reLoop = function (e) {
        var a = S.activeIndex - S.loopedSlides;S.destroyLoop(), S.createLoop(), S.updateSlidesSize(), e && S.slideTo(a + S.loopedSlides, 0, !1);
      }, S.fixLoop = function () {
        var e;S.activeIndex < S.loopedSlides ? (e = S.slides.length - 3 * S.loopedSlides + S.activeIndex, e += S.loopedSlides, S.slideTo(e, 0, !1, !0)) : ("auto" === S.params.slidesPerView && S.activeIndex >= 2 * S.loopedSlides || S.activeIndex > S.slides.length - 2 * S.params.slidesPerView) && (e = -S.slides.length + S.activeIndex + S.loopedSlides, e += S.loopedSlides, S.slideTo(e, 0, !1, !0));
      }, S.appendSlide = function (e) {
        if (S.params.loop && S.destroyLoop(), "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) for (var a = 0; a < e.length; a++) {
          e[a] && S.wrapper.append(e[a]);
        } else S.wrapper.append(e);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0);
      }, S.prependSlide = function (e) {
        S.params.loop && S.destroyLoop();var a = S.activeIndex + 1;if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) {
          for (var t = 0; t < e.length; t++) {
            e[t] && S.wrapper.prepend(e[t]);
          }a = S.activeIndex + e.length;
        } else S.wrapper.prepend(e);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0), S.slideTo(a, 0, !1);
      }, S.removeSlide = function (e) {
        S.params.loop && (S.destroyLoop(), S.slides = S.wrapper.children("." + S.params.slideClass));var a,
            t = S.activeIndex;if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.length) {
          for (var s = 0; s < e.length; s++) {
            a = e[s], S.slides[a] && S.slides.eq(a).remove(), a < t && t--;
          }t = Math.max(t, 0);
        } else a = e, S.slides[a] && S.slides.eq(a).remove(), a < t && t--, t = Math.max(t, 0);S.params.loop && S.createLoop(), S.params.observer && S.support.observer || S.update(!0), S.params.loop ? S.slideTo(t + S.loopedSlides, 0, !1) : S.slideTo(t, 0, !1);
      }, S.removeAllSlides = function () {
        for (var e = [], a = 0; a < S.slides.length; a++) {
          e.push(a);
        }S.removeSlide(e);
      }, S.effects = { fade: { setTranslate: function setTranslate() {
            for (var e = 0; e < S.slides.length; e++) {
              var a = S.slides.eq(e),
                  t = a[0].swiperSlideOffset,
                  s = -t;S.params.virtualTranslate || (s -= S.translate);var i = 0;S.isHorizontal() || (i = s, s = 0);var r = S.params.fade.crossFade ? Math.max(1 - Math.abs(a[0].progress), 0) : 1 + Math.min(Math.max(a[0].progress, -1), 0);a.css({ opacity: r }).transform("translate3d(" + s + "px, " + i + "px, 0px)");
            }
          }, setTransition: function setTransition(e) {
            if (S.slides.transition(e), S.params.virtualTranslate && 0 !== e) {
              var a = !1;S.slides.transitionEnd(function () {
                if (!a && S) {
                  a = !0, S.animating = !1;for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], t = 0; t < e.length; t++) {
                    S.wrapper.trigger(e[t]);
                  }
                }
              });
            }
          } }, flip: { setTranslate: function setTranslate() {
            for (var e = 0; e < S.slides.length; e++) {
              var t = S.slides.eq(e),
                  s = t[0].progress;S.params.flip.limitRotation && (s = Math.max(Math.min(t[0].progress, 1), -1));var i = t[0].swiperSlideOffset,
                  r = -180 * s,
                  n = r,
                  o = 0,
                  l = -i,
                  p = 0;if (S.isHorizontal() ? S.rtl && (n = -n) : (p = l, l = 0, o = -n, n = 0), t[0].style.zIndex = -Math.abs(Math.round(s)) + S.slides.length, S.params.flip.slideShadows) {
                var d = S.isHorizontal() ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"),
                    u = S.isHorizontal() ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");0 === d.length && (d = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), t.append(d)), 0 === u.length && (u = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), t.append(u)), d.length && (d[0].style.opacity = Math.max(-s, 0)), u.length && (u[0].style.opacity = Math.max(s, 0));
              }t.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)");
            }
          }, setTransition: function setTransition(e) {
            if (S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), S.params.virtualTranslate && 0 !== e) {
              var t = !1;S.slides.eq(S.activeIndex).transitionEnd(function () {
                if (!t && S && a(this).hasClass(S.params.slideActiveClass)) {
                  t = !0, S.animating = !1;for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], s = 0; s < e.length; s++) {
                    S.wrapper.trigger(e[s]);
                  }
                }
              });
            }
          } }, cube: { setTranslate: function setTranslate() {
            var e,
                t = 0;S.params.cube.shadow && (S.isHorizontal() ? (e = S.wrapper.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), S.wrapper.append(e)), e.css({ height: S.width + "px" })) : (e = S.container.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), S.container.append(e))));for (var s = 0; s < S.slides.length; s++) {
              var i = S.slides.eq(s),
                  r = 90 * s,
                  n = Math.floor(r / 360);S.rtl && (r = -r, n = Math.floor(-r / 360));var o = Math.max(Math.min(i[0].progress, 1), -1),
                  l = 0,
                  p = 0,
                  d = 0;s % 4 === 0 ? (l = 4 * -n * S.size, d = 0) : (s - 1) % 4 === 0 ? (l = 0, d = 4 * -n * S.size) : (s - 2) % 4 === 0 ? (l = S.size + 4 * n * S.size, d = S.size) : (s - 3) % 4 === 0 && (l = -S.size, d = 3 * S.size + 4 * S.size * n), S.rtl && (l = -l), S.isHorizontal() || (p = l, l = 0);var u = "rotateX(" + (S.isHorizontal() ? 0 : -r) + "deg) rotateY(" + (S.isHorizontal() ? r : 0) + "deg) translate3d(" + l + "px, " + p + "px, " + d + "px)";if (o <= 1 && o > -1 && (t = 90 * s + 90 * o, S.rtl && (t = 90 * -s - 90 * o)), i.transform(u), S.params.cube.slideShadows) {
                var c = S.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top"),
                    m = S.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");0 === c.length && (c = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), i.append(c)), 0 === m.length && (m = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), i.append(m)), c.length && (c[0].style.opacity = Math.max(-o, 0)), m.length && (m[0].style.opacity = Math.max(o, 0));
              }
            }if (S.wrapper.css({ "-webkit-transform-origin": "50% 50% -" + S.size / 2 + "px", "-moz-transform-origin": "50% 50% -" + S.size / 2 + "px", "-ms-transform-origin": "50% 50% -" + S.size / 2 + "px", "transform-origin": "50% 50% -" + S.size / 2 + "px" }), S.params.cube.shadow) if (S.isHorizontal()) e.transform("translate3d(0px, " + (S.width / 2 + S.params.cube.shadowOffset) + "px, " + -S.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + S.params.cube.shadowScale + ")");else {
              var h = Math.abs(t) - 90 * Math.floor(Math.abs(t) / 90),
                  g = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2),
                  f = S.params.cube.shadowScale,
                  v = S.params.cube.shadowScale / g,
                  w = S.params.cube.shadowOffset;e.transform("scale3d(" + f + ", 1, " + v + ") translate3d(0px, " + (S.height / 2 + w) + "px, " + -S.height / 2 / v + "px) rotateX(-90deg)");
            }var y = S.isSafari || S.isUiWebView ? -S.size / 2 : 0;S.wrapper.transform("translate3d(0px,0," + y + "px) rotateX(" + (S.isHorizontal() ? 0 : t) + "deg) rotateY(" + (S.isHorizontal() ? -t : 0) + "deg)");
          }, setTransition: function setTransition(e) {
            S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), S.params.cube.shadow && !S.isHorizontal() && S.container.find(".swiper-cube-shadow").transition(e);
          } }, coverflow: { setTranslate: function setTranslate() {
            for (var e = S.translate, t = S.isHorizontal() ? -e + S.width / 2 : -e + S.height / 2, s = S.isHorizontal() ? S.params.coverflow.rotate : -S.params.coverflow.rotate, i = S.params.coverflow.depth, r = 0, n = S.slides.length; r < n; r++) {
              var o = S.slides.eq(r),
                  l = S.slidesSizesGrid[r],
                  p = o[0].swiperSlideOffset,
                  d = (t - p - l / 2) / l * S.params.coverflow.modifier,
                  u = S.isHorizontal() ? s * d : 0,
                  c = S.isHorizontal() ? 0 : s * d,
                  m = -i * Math.abs(d),
                  h = S.isHorizontal() ? 0 : S.params.coverflow.stretch * d,
                  g = S.isHorizontal() ? S.params.coverflow.stretch * d : 0;Math.abs(g) < .001 && (g = 0), Math.abs(h) < .001 && (h = 0), Math.abs(m) < .001 && (m = 0), Math.abs(u) < .001 && (u = 0), Math.abs(c) < .001 && (c = 0);var f = "translate3d(" + g + "px," + h + "px," + m + "px)  rotateX(" + c + "deg) rotateY(" + u + "deg)";if (o.transform(f), o[0].style.zIndex = -Math.abs(Math.round(d)) + 1, S.params.coverflow.slideShadows) {
                var v = S.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top"),
                    w = S.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");0 === v.length && (v = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "left" : "top") + '"></div>'), o.append(v)), 0 === w.length && (w = a('<div class="swiper-slide-shadow-' + (S.isHorizontal() ? "right" : "bottom") + '"></div>'), o.append(w)), v.length && (v[0].style.opacity = d > 0 ? d : 0), w.length && (w[0].style.opacity = -d > 0 ? -d : 0);
              }
            }if (S.browser.ie) {
              var y = S.wrapper[0].style;y.perspectiveOrigin = t + "px 50%";
            }
          }, setTransition: function setTransition(e) {
            S.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e);
          } } }, S.lazy = { initialImageLoaded: !1, loadImageInSlide: function loadImageInSlide(e, t) {
          if ("undefined" != typeof e && ("undefined" == typeof t && (t = !0), 0 !== S.slides.length)) {
            var s = S.slides.eq(e),
                i = s.find("." + S.params.lazyLoadingClass + ":not(." + S.params.lazyStatusLoadedClass + "):not(." + S.params.lazyStatusLoadingClass + ")");!s.hasClass(S.params.lazyLoadingClass) || s.hasClass(S.params.lazyStatusLoadedClass) || s.hasClass(S.params.lazyStatusLoadingClass) || (i = i.add(s[0])), 0 !== i.length && i.each(function () {
              var e = a(this);e.addClass(S.params.lazyStatusLoadingClass);var i = e.attr("data-background"),
                  r = e.attr("data-src"),
                  n = e.attr("data-srcset"),
                  o = e.attr("data-sizes");S.loadImage(e[0], r || i, n, o, !1, function () {
                if (i ? (e.css("background-image", 'url("' + i + '")'), e.removeAttr("data-background")) : (n && (e.attr("srcset", n), e.removeAttr("data-srcset")), o && (e.attr("sizes", o), e.removeAttr("data-sizes")), r && (e.attr("src", r), e.removeAttr("data-src"))), e.addClass(S.params.lazyStatusLoadedClass).removeClass(S.params.lazyStatusLoadingClass), s.find("." + S.params.lazyPreloaderClass + ", ." + S.params.preloaderClass).remove(), S.params.loop && t) {
                  var a = s.attr("data-swiper-slide-index");if (s.hasClass(S.params.slideDuplicateClass)) {
                    var l = S.wrapper.children('[data-swiper-slide-index="' + a + '"]:not(.' + S.params.slideDuplicateClass + ")");S.lazy.loadImageInSlide(l.index(), !1);
                  } else {
                    var p = S.wrapper.children("." + S.params.slideDuplicateClass + '[data-swiper-slide-index="' + a + '"]');S.lazy.loadImageInSlide(p.index(), !1);
                  }
                }S.emit("onLazyImageReady", S, s[0], e[0]);
              }), S.emit("onLazyImageLoad", S, s[0], e[0]);
            });
          }
        }, load: function load() {
          var e,
              t = S.params.slidesPerView;if ("auto" === t && (t = 0), S.lazy.initialImageLoaded || (S.lazy.initialImageLoaded = !0), S.params.watchSlidesVisibility) S.wrapper.children("." + S.params.slideVisibleClass).each(function () {
            S.lazy.loadImageInSlide(a(this).index());
          });else if (t > 1) for (e = S.activeIndex; e < S.activeIndex + t; e++) {
            S.slides[e] && S.lazy.loadImageInSlide(e);
          } else S.lazy.loadImageInSlide(S.activeIndex);if (S.params.lazyLoadingInPrevNext) if (t > 1 || S.params.lazyLoadingInPrevNextAmount && S.params.lazyLoadingInPrevNextAmount > 1) {
            var s = S.params.lazyLoadingInPrevNextAmount,
                i = t,
                r = Math.min(S.activeIndex + i + Math.max(s, i), S.slides.length),
                n = Math.max(S.activeIndex - Math.max(i, s), 0);for (e = S.activeIndex + t; e < r; e++) {
              S.slides[e] && S.lazy.loadImageInSlide(e);
            }for (e = n; e < S.activeIndex; e++) {
              S.slides[e] && S.lazy.loadImageInSlide(e);
            }
          } else {
            var o = S.wrapper.children("." + S.params.slideNextClass);o.length > 0 && S.lazy.loadImageInSlide(o.index());var l = S.wrapper.children("." + S.params.slidePrevClass);l.length > 0 && S.lazy.loadImageInSlide(l.index());
          }
        }, onTransitionStart: function onTransitionStart() {
          S.params.lazyLoading && (S.params.lazyLoadingOnTransitionStart || !S.params.lazyLoadingOnTransitionStart && !S.lazy.initialImageLoaded) && S.lazy.load();
        }, onTransitionEnd: function onTransitionEnd() {
          S.params.lazyLoading && !S.params.lazyLoadingOnTransitionStart && S.lazy.load();
        } }, S.scrollbar = { isTouched: !1, setDragPosition: function setDragPosition(e) {
          var a = S.scrollbar,
              t = S.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY,
              s = t - a.track.offset()[S.isHorizontal() ? "left" : "top"] - a.dragSize / 2,
              i = -S.minTranslate() * a.moveDivider,
              r = -S.maxTranslate() * a.moveDivider;s < i ? s = i : s > r && (s = r), s = -s / a.moveDivider, S.updateProgress(s), S.setWrapperTranslate(s, !0);
        }, dragStart: function dragStart(e) {
          var a = S.scrollbar;a.isTouched = !0, e.preventDefault(), e.stopPropagation(), a.setDragPosition(e), clearTimeout(a.dragTimeout), a.track.transition(0), S.params.scrollbarHide && a.track.css("opacity", 1), S.wrapper.transition(100), a.drag.transition(100), S.emit("onScrollbarDragStart", S);
        }, dragMove: function dragMove(e) {
          var a = S.scrollbar;a.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, a.setDragPosition(e), S.wrapper.transition(0), a.track.transition(0), a.drag.transition(0), S.emit("onScrollbarDragMove", S));
        }, dragEnd: function dragEnd(e) {
          var a = S.scrollbar;a.isTouched && (a.isTouched = !1, S.params.scrollbarHide && (clearTimeout(a.dragTimeout), a.dragTimeout = setTimeout(function () {
            a.track.css("opacity", 0), a.track.transition(400);
          }, 1e3)), S.emit("onScrollbarDragEnd", S), S.params.scrollbarSnapOnRelease && S.slideReset());
        }, draggableEvents: function () {
          return S.params.simulateTouch !== !1 || S.support.touch ? S.touchEvents : S.touchEventsDesktop;
        }(), enableDraggable: function enableDraggable() {
          var e = S.scrollbar,
              t = S.support.touch ? e.track : document;a(e.track).on(e.draggableEvents.start, e.dragStart), a(t).on(e.draggableEvents.move, e.dragMove), a(t).on(e.draggableEvents.end, e.dragEnd);
        }, disableDraggable: function disableDraggable() {
          var e = S.scrollbar,
              t = S.support.touch ? e.track : document;a(e.track).off(S.draggableEvents.start, e.dragStart), a(t).off(S.draggableEvents.move, e.dragMove), a(t).off(S.draggableEvents.end, e.dragEnd);
        }, set: function set() {
          if (S.params.scrollbar) {
            var e = S.scrollbar;e.track = a(S.params.scrollbar), S.params.uniqueNavElements && "string" == typeof S.params.scrollbar && e.track.length > 1 && 1 === S.container.find(S.params.scrollbar).length && (e.track = S.container.find(S.params.scrollbar)), e.drag = e.track.find(".swiper-scrollbar-drag"), 0 === e.drag.length && (e.drag = a('<div class="swiper-scrollbar-drag"></div>'), e.track.append(e.drag)), e.drag[0].style.width = "", e.drag[0].style.height = "", e.trackSize = S.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight, e.divider = S.size / S.virtualSize, e.moveDivider = e.divider * (e.trackSize / S.size), e.dragSize = e.trackSize * e.divider, S.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px", e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "", S.params.scrollbarHide && (e.track[0].style.opacity = 0);
          }
        }, setTranslate: function setTranslate() {
          if (S.params.scrollbar) {
            var e,
                a = S.scrollbar,
                t = (S.translate || 0, a.dragSize);e = (a.trackSize - a.dragSize) * S.progress, S.rtl && S.isHorizontal() ? (e = -e, e > 0 ? (t = a.dragSize - e, e = 0) : -e + a.dragSize > a.trackSize && (t = a.trackSize + e)) : e < 0 ? (t = a.dragSize + e, e = 0) : e + a.dragSize > a.trackSize && (t = a.trackSize - e), S.isHorizontal() ? (S.support.transforms3d ? a.drag.transform("translate3d(" + e + "px, 0, 0)") : a.drag.transform("translateX(" + e + "px)"), a.drag[0].style.width = t + "px") : (S.support.transforms3d ? a.drag.transform("translate3d(0px, " + e + "px, 0)") : a.drag.transform("translateY(" + e + "px)"), a.drag[0].style.height = t + "px"), S.params.scrollbarHide && (clearTimeout(a.timeout), a.track[0].style.opacity = 1, a.timeout = setTimeout(function () {
              a.track[0].style.opacity = 0, a.track.transition(400);
            }, 1e3));
          }
        }, setTransition: function setTransition(e) {
          S.params.scrollbar && S.scrollbar.drag.transition(e);
        } }, S.controller = { LinearSpline: function LinearSpline(e, a) {
          this.x = e, this.y = a, this.lastIndex = e.length - 1;var t, s;this.x.length;this.interpolate = function (e) {
            return e ? (s = i(this.x, e), t = s - 1, (e - this.x[t]) * (this.y[s] - this.y[t]) / (this.x[s] - this.x[t]) + this.y[t]) : 0;
          };var i = function () {
            var e, a, t;return function (s, i) {
              for (a = -1, e = s.length; e - a > 1;) {
                s[t = e + a >> 1] <= i ? a = t : e = t;
              }return e;
            };
          }();
        }, getInterpolateFunction: function getInterpolateFunction(e) {
          S.controller.spline || (S.controller.spline = S.params.loop ? new S.controller.LinearSpline(S.slidesGrid, e.slidesGrid) : new S.controller.LinearSpline(S.snapGrid, e.snapGrid));
        }, setTranslate: function setTranslate(e, a) {
          function s(a) {
            e = a.rtl && "horizontal" === a.params.direction ? -S.translate : S.translate, "slide" === S.params.controlBy && (S.controller.getInterpolateFunction(a), r = -S.controller.spline.interpolate(-e)), r && "container" !== S.params.controlBy || (i = (a.maxTranslate() - a.minTranslate()) / (S.maxTranslate() - S.minTranslate()), r = (e - S.minTranslate()) * i + a.minTranslate()), S.params.controlInverse && (r = a.maxTranslate() - r), a.updateProgress(r), a.setWrapperTranslate(r, !1, S), a.updateActiveIndex();
          }var i,
              r,
              n = S.params.control;if (S.isArray(n)) for (var o = 0; o < n.length; o++) {
            n[o] !== a && n[o] instanceof t && s(n[o]);
          } else n instanceof t && a !== n && s(n);
        }, setTransition: function setTransition(e, a) {
          function s(a) {
            a.setWrapperTransition(e, S), 0 !== e && (a.onTransitionStart(), a.wrapper.transitionEnd(function () {
              r && (a.params.loop && "slide" === S.params.controlBy && a.fixLoop(), a.onTransitionEnd());
            }));
          }var i,
              r = S.params.control;if (S.isArray(r)) for (i = 0; i < r.length; i++) {
            r[i] !== a && r[i] instanceof t && s(r[i]);
          } else r instanceof t && a !== r && s(r);
        } }, S.hashnav = { onHashCange: function onHashCange(e, a) {
          var t = document.location.hash.replace("#", ""),
              s = S.slides.eq(S.activeIndex).attr("data-hash");t !== s && S.slideTo(S.wrapper.children("." + S.params.slideClass + '[data-hash="' + t + '"]').index());
        }, attachEvents: function attachEvents(e) {
          var t = e ? "off" : "on";a(window)[t]("hashchange", S.hashnav.onHashCange);
        }, setHash: function setHash() {
          if (S.hashnav.initialized && S.params.hashnav) if (S.params.replaceState && window.history && window.history.replaceState) window.history.replaceState(null, null, "#" + S.slides.eq(S.activeIndex).attr("data-hash") || "");else {
            var e = S.slides.eq(S.activeIndex),
                a = e.attr("data-hash") || e.attr("data-history");document.location.hash = a || "";
          }
        }, init: function init() {
          if (S.params.hashnav && !S.params.history) {
            S.hashnav.initialized = !0;var e = document.location.hash.replace("#", "");if (e) {
              for (var a = 0, t = 0, s = S.slides.length; t < s; t++) {
                var i = S.slides.eq(t),
                    r = i.attr("data-hash") || i.attr("data-history");if (r === e && !i.hasClass(S.params.slideDuplicateClass)) {
                  var n = i.index();S.slideTo(n, a, S.params.runCallbacksOnInit, !0);
                }
              }S.params.hashnavWatchState && S.hashnav.attachEvents();
            }
          }
        }, destroy: function destroy() {
          S.params.hashnavWatchState && S.hashnav.attachEvents(!0);
        } }, S.history = { init: function init() {
          if (S.params.history) {
            if (!window.history || !window.history.pushState) return S.params.history = !1, void (S.params.hashnav = !0);S.history.initialized = !0, this.paths = this.getPathValues(), (this.paths.key || this.paths.value) && (this.scrollToSlide(0, this.paths.value, S.params.runCallbacksOnInit), S.params.replaceState || window.addEventListener("popstate", this.setHistoryPopState));
          }
        }, setHistoryPopState: function setHistoryPopState() {
          S.history.paths = S.history.getPathValues(), S.history.scrollToSlide(S.params.speed, S.history.paths.value, !1);
        }, getPathValues: function getPathValues() {
          var e = window.location.pathname.slice(1).split("/"),
              a = e.length,
              t = e[a - 2],
              s = e[a - 1];return { key: t, value: s };
        }, setHistory: function setHistory(e, a) {
          if (S.history.initialized && S.params.history) {
            var t = S.slides.eq(a),
                s = this.slugify(t.attr("data-history"));window.location.pathname.includes(e) || (s = e + "/" + s), S.params.replaceState ? window.history.replaceState(null, null, s) : window.history.pushState(null, null, s);
          }
        }, slugify: function slugify(e) {
          return e.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        }, scrollToSlide: function scrollToSlide(e, a, t) {
          if (a) for (var s = 0, i = S.slides.length; s < i; s++) {
            var r = S.slides.eq(s),
                n = this.slugify(r.attr("data-history"));if (n === a && !r.hasClass(S.params.slideDuplicateClass)) {
              var o = r.index();S.slideTo(o, e, t);
            }
          } else S.slideTo(0, e, t);
        } }, S.disableKeyboardControl = function () {
        S.params.keyboardControl = !1, a(document).off("keydown", d);
      }, S.enableKeyboardControl = function () {
        S.params.keyboardControl = !0, a(document).on("keydown", d);
      }, S.mousewheel = { event: !1, lastScrollTime: new window.Date().getTime() }, S.params.mousewheelControl && (S.mousewheel.event = navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : u() ? "wheel" : "mousewheel"), S.disableMousewheelControl = function () {
        if (!S.mousewheel.event) return !1;var e = S.container;return "container" !== S.params.mousewheelEventsTarged && (e = a(S.params.mousewheelEventsTarged)), e.off(S.mousewheel.event, c), !0;
      }, S.enableMousewheelControl = function () {
        if (!S.mousewheel.event) return !1;var e = S.container;return "container" !== S.params.mousewheelEventsTarged && (e = a(S.params.mousewheelEventsTarged)), e.on(S.mousewheel.event, c), !0;
      }, S.parallax = { setTranslate: function setTranslate() {
          S.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
            h(this, S.progress);
          }), S.slides.each(function () {
            var e = a(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
              var a = Math.min(Math.max(e[0].progress, -1), 1);h(this, a);
            });
          });
        }, setTransition: function setTransition(e) {
          "undefined" == typeof e && (e = S.params.speed), S.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
            var t = a(this),
                s = parseInt(t.attr("data-swiper-parallax-duration"), 10) || e;0 === e && (s = 0), t.transition(s);
          });
        } }, S.zoom = { scale: 1, currentScale: 1, isScaling: !1, gesture: { slide: void 0, slideWidth: void 0, slideHeight: void 0, image: void 0, imageWrap: void 0, zoomMax: S.params.zoomMax }, image: { isTouched: void 0, isMoved: void 0, currentX: void 0, currentY: void 0, minX: void 0, minY: void 0, maxX: void 0, maxY: void 0, width: void 0, height: void 0, startX: void 0, startY: void 0, touchesStart: {}, touchesCurrent: {} }, velocity: { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 }, getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
          if (e.targetTouches.length < 2) return 1;var a = e.targetTouches[0].pageX,
              t = e.targetTouches[0].pageY,
              s = e.targetTouches[1].pageX,
              i = e.targetTouches[1].pageY,
              r = Math.sqrt(Math.pow(s - a, 2) + Math.pow(i - t, 2));return r;
        }, onGestureStart: function onGestureStart(e) {
          var t = S.zoom;if (!S.support.gestures) {
            if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;t.gesture.scaleStart = t.getDistanceBetweenTouches(e);
          }return t.gesture.slide && t.gesture.slide.length || (t.gesture.slide = a(this), 0 === t.gesture.slide.length && (t.gesture.slide = S.slides.eq(S.activeIndex)), t.gesture.image = t.gesture.slide.find("img, svg, canvas"), t.gesture.imageWrap = t.gesture.image.parent("." + S.params.zoomContainerClass), t.gesture.zoomMax = t.gesture.imageWrap.attr("data-swiper-zoom") || S.params.zoomMax, 0 !== t.gesture.imageWrap.length) ? (t.gesture.image.transition(0), void (t.isScaling = !0)) : void (t.gesture.image = void 0);
        }, onGestureChange: function onGestureChange(e) {
          var a = S.zoom;if (!S.support.gestures) {
            if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;a.gesture.scaleMove = a.getDistanceBetweenTouches(e);
          }a.gesture.image && 0 !== a.gesture.image.length && (S.support.gestures ? a.scale = e.scale * a.currentScale : a.scale = a.gesture.scaleMove / a.gesture.scaleStart * a.currentScale, a.scale > a.gesture.zoomMax && (a.scale = a.gesture.zoomMax - 1 + Math.pow(a.scale - a.gesture.zoomMax + 1, .5)), a.scale < S.params.zoomMin && (a.scale = S.params.zoomMin + 1 - Math.pow(S.params.zoomMin - a.scale + 1, .5)), a.gesture.image.transform("translate3d(0,0,0) scale(" + a.scale + ")"));
        }, onGestureEnd: function onGestureEnd(e) {
          var a = S.zoom;!S.support.gestures && ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2) || a.gesture.image && 0 !== a.gesture.image.length && (a.scale = Math.max(Math.min(a.scale, a.gesture.zoomMax), S.params.zoomMin), a.gesture.image.transition(S.params.speed).transform("translate3d(0,0,0) scale(" + a.scale + ")"), a.currentScale = a.scale, a.isScaling = !1, 1 === a.scale && (a.gesture.slide = void 0));
        }, onTouchStart: function onTouchStart(e, a) {
          var t = e.zoom;t.gesture.image && 0 !== t.gesture.image.length && (t.image.isTouched || ("android" === e.device.os && a.preventDefault(), t.image.isTouched = !0, t.image.touchesStart.x = "touchstart" === a.type ? a.targetTouches[0].pageX : a.pageX, t.image.touchesStart.y = "touchstart" === a.type ? a.targetTouches[0].pageY : a.pageY));
        }, onTouchMove: function onTouchMove(e) {
          var a = S.zoom;if (a.gesture.image && 0 !== a.gesture.image.length && (S.allowClick = !1, a.image.isTouched && a.gesture.slide)) {
            a.image.isMoved || (a.image.width = a.gesture.image[0].offsetWidth, a.image.height = a.gesture.image[0].offsetHeight, a.image.startX = S.getTranslate(a.gesture.imageWrap[0], "x") || 0, a.image.startY = S.getTranslate(a.gesture.imageWrap[0], "y") || 0, a.gesture.slideWidth = a.gesture.slide[0].offsetWidth, a.gesture.slideHeight = a.gesture.slide[0].offsetHeight, a.gesture.imageWrap.transition(0));var t = a.image.width * a.scale,
                s = a.image.height * a.scale;if (!(t < a.gesture.slideWidth && s < a.gesture.slideHeight)) {
              if (a.image.minX = Math.min(a.gesture.slideWidth / 2 - t / 2, 0), a.image.maxX = -a.image.minX, a.image.minY = Math.min(a.gesture.slideHeight / 2 - s / 2, 0), a.image.maxY = -a.image.minY, a.image.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, a.image.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !a.image.isMoved && !a.isScaling) {
                if (S.isHorizontal() && Math.floor(a.image.minX) === Math.floor(a.image.startX) && a.image.touchesCurrent.x < a.image.touchesStart.x || Math.floor(a.image.maxX) === Math.floor(a.image.startX) && a.image.touchesCurrent.x > a.image.touchesStart.x) return void (a.image.isTouched = !1);if (!S.isHorizontal() && Math.floor(a.image.minY) === Math.floor(a.image.startY) && a.image.touchesCurrent.y < a.image.touchesStart.y || Math.floor(a.image.maxY) === Math.floor(a.image.startY) && a.image.touchesCurrent.y > a.image.touchesStart.y) return void (a.image.isTouched = !1);
              }e.preventDefault(), e.stopPropagation(), a.image.isMoved = !0, a.image.currentX = a.image.touchesCurrent.x - a.image.touchesStart.x + a.image.startX, a.image.currentY = a.image.touchesCurrent.y - a.image.touchesStart.y + a.image.startY, a.image.currentX < a.image.minX && (a.image.currentX = a.image.minX + 1 - Math.pow(a.image.minX - a.image.currentX + 1, .8)), a.image.currentX > a.image.maxX && (a.image.currentX = a.image.maxX - 1 + Math.pow(a.image.currentX - a.image.maxX + 1, .8)), a.image.currentY < a.image.minY && (a.image.currentY = a.image.minY + 1 - Math.pow(a.image.minY - a.image.currentY + 1, .8)), a.image.currentY > a.image.maxY && (a.image.currentY = a.image.maxY - 1 + Math.pow(a.image.currentY - a.image.maxY + 1, .8)), a.velocity.prevPositionX || (a.velocity.prevPositionX = a.image.touchesCurrent.x), a.velocity.prevPositionY || (a.velocity.prevPositionY = a.image.touchesCurrent.y), a.velocity.prevTime || (a.velocity.prevTime = Date.now()), a.velocity.x = (a.image.touchesCurrent.x - a.velocity.prevPositionX) / (Date.now() - a.velocity.prevTime) / 2, a.velocity.y = (a.image.touchesCurrent.y - a.velocity.prevPositionY) / (Date.now() - a.velocity.prevTime) / 2, Math.abs(a.image.touchesCurrent.x - a.velocity.prevPositionX) < 2 && (a.velocity.x = 0), Math.abs(a.image.touchesCurrent.y - a.velocity.prevPositionY) < 2 && (a.velocity.y = 0), a.velocity.prevPositionX = a.image.touchesCurrent.x, a.velocity.prevPositionY = a.image.touchesCurrent.y, a.velocity.prevTime = Date.now(), a.gesture.imageWrap.transform("translate3d(" + a.image.currentX + "px, " + a.image.currentY + "px,0)");
            }
          }
        }, onTouchEnd: function onTouchEnd(e, a) {
          var t = e.zoom;if (t.gesture.image && 0 !== t.gesture.image.length) {
            if (!t.image.isTouched || !t.image.isMoved) return t.image.isTouched = !1, void (t.image.isMoved = !1);t.image.isTouched = !1, t.image.isMoved = !1;var s = 300,
                i = 300,
                r = t.velocity.x * s,
                n = t.image.currentX + r,
                o = t.velocity.y * i,
                l = t.image.currentY + o;0 !== t.velocity.x && (s = Math.abs((n - t.image.currentX) / t.velocity.x)), 0 !== t.velocity.y && (i = Math.abs((l - t.image.currentY) / t.velocity.y));var p = Math.max(s, i);t.image.currentX = n, t.image.currentY = l;var d = t.image.width * t.scale,
                u = t.image.height * t.scale;t.image.minX = Math.min(t.gesture.slideWidth / 2 - d / 2, 0), t.image.maxX = -t.image.minX, t.image.minY = Math.min(t.gesture.slideHeight / 2 - u / 2, 0), t.image.maxY = -t.image.minY, t.image.currentX = Math.max(Math.min(t.image.currentX, t.image.maxX), t.image.minX), t.image.currentY = Math.max(Math.min(t.image.currentY, t.image.maxY), t.image.minY), t.gesture.imageWrap.transition(p).transform("translate3d(" + t.image.currentX + "px, " + t.image.currentY + "px,0)");
          }
        }, onTransitionEnd: function onTransitionEnd(e) {
          var a = e.zoom;a.gesture.slide && e.previousIndex !== e.activeIndex && (a.gesture.image.transform("translate3d(0,0,0) scale(1)"), a.gesture.imageWrap.transform("translate3d(0,0,0)"), a.gesture.slide = a.gesture.image = a.gesture.imageWrap = void 0, a.scale = a.currentScale = 1);
        }, toggleZoom: function toggleZoom(e, t) {
          var s = e.zoom;if (s.gesture.slide || (s.gesture.slide = e.clickedSlide ? a(e.clickedSlide) : e.slides.eq(e.activeIndex), s.gesture.image = s.gesture.slide.find("img, svg, canvas"), s.gesture.imageWrap = s.gesture.image.parent("." + e.params.zoomContainerClass)), s.gesture.image && 0 !== s.gesture.image.length) {
            var i, r, n, o, l, p, d, u, c, m, h, g, f, v, w, y, x, T;"undefined" == typeof s.image.touchesStart.x && t ? (i = "touchend" === t.type ? t.changedTouches[0].pageX : t.pageX, r = "touchend" === t.type ? t.changedTouches[0].pageY : t.pageY) : (i = s.image.touchesStart.x, r = s.image.touchesStart.y), s.scale && 1 !== s.scale ? (s.scale = s.currentScale = 1, s.gesture.imageWrap.transition(300).transform("translate3d(0,0,0)"), s.gesture.image.transition(300).transform("translate3d(0,0,0) scale(1)"), s.gesture.slide = void 0) : (s.scale = s.currentScale = s.gesture.imageWrap.attr("data-swiper-zoom") || e.params.zoomMax, t ? (x = s.gesture.slide[0].offsetWidth, T = s.gesture.slide[0].offsetHeight, n = s.gesture.slide.offset().left, o = s.gesture.slide.offset().top, l = n + x / 2 - i, p = o + T / 2 - r, c = s.gesture.image[0].offsetWidth, m = s.gesture.image[0].offsetHeight, h = c * s.scale, g = m * s.scale, f = Math.min(x / 2 - h / 2, 0), v = Math.min(T / 2 - g / 2, 0), w = -f, y = -v, d = l * s.scale, u = p * s.scale, d < f && (d = f), d > w && (d = w), u < v && (u = v), u > y && (u = y)) : (d = 0, u = 0), s.gesture.imageWrap.transition(300).transform("translate3d(" + d + "px, " + u + "px,0)"), s.gesture.image.transition(300).transform("translate3d(0,0,0) scale(" + s.scale + ")"));
          }
        }, attachEvents: function attachEvents(e) {
          var t = e ? "off" : "on";if (S.params.zoom) {
            var s = (S.slides, !("touchstart" !== S.touchEvents.start || !S.support.passiveListener || !S.params.passiveListeners) && { passive: !0, capture: !1 });S.support.gestures ? (S.slides[t]("gesturestart", S.zoom.onGestureStart, s), S.slides[t]("gesturechange", S.zoom.onGestureChange, s), S.slides[t]("gestureend", S.zoom.onGestureEnd, s)) : "touchstart" === S.touchEvents.start && (S.slides[t](S.touchEvents.start, S.zoom.onGestureStart, s), S.slides[t](S.touchEvents.move, S.zoom.onGestureChange, s), S.slides[t](S.touchEvents.end, S.zoom.onGestureEnd, s)), S[t]("touchStart", S.zoom.onTouchStart), S.slides.each(function (e, s) {
              a(s).find("." + S.params.zoomContainerClass).length > 0 && a(s)[t](S.touchEvents.move, S.zoom.onTouchMove);
            }), S[t]("touchEnd", S.zoom.onTouchEnd), S[t]("transitionEnd", S.zoom.onTransitionEnd), S.params.zoomToggle && S.on("doubleTap", S.zoom.toggleZoom);
          }
        }, init: function init() {
          S.zoom.attachEvents();
        }, destroy: function destroy() {
          S.zoom.attachEvents(!0);
        } }, S._plugins = [];for (var N in S.plugins) {
        var W = S.plugins[N](S, S.params[N]);W && S._plugins.push(W);
      }return S.callPlugins = function (e) {
        for (var a = 0; a < S._plugins.length; a++) {
          e in S._plugins[a] && S._plugins[a][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
      }, S.emitterEventListeners = {}, S.emit = function (e) {
        S.params[e] && S.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);var a;if (S.emitterEventListeners[e]) for (a = 0; a < S.emitterEventListeners[e].length; a++) {
          S.emitterEventListeners[e][a](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }S.callPlugins && S.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }, S.on = function (e, a) {
        return e = g(e), S.emitterEventListeners[e] || (S.emitterEventListeners[e] = []), S.emitterEventListeners[e].push(a), S;
      }, S.off = function (e, a) {
        var t;if (e = g(e), "undefined" == typeof a) return S.emitterEventListeners[e] = [], S;if (S.emitterEventListeners[e] && 0 !== S.emitterEventListeners[e].length) {
          for (t = 0; t < S.emitterEventListeners[e].length; t++) {
            S.emitterEventListeners[e][t] === a && S.emitterEventListeners[e].splice(t, 1);
          }return S;
        }
      }, S.once = function (e, a) {
        e = g(e);var t = function t() {
          a(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), S.off(e, t);
        };return S.on(e, t), S;
      }, S.a11y = { makeFocusable: function makeFocusable(e) {
          return e.attr("tabIndex", "0"), e;
        }, addRole: function addRole(e, a) {
          return e.attr("role", a), e;
        }, addLabel: function addLabel(e, a) {
          return e.attr("aria-label", a), e;
        }, disable: function disable(e) {
          return e.attr("aria-disabled", !0), e;
        }, enable: function enable(e) {
          return e.attr("aria-disabled", !1), e;
        }, onEnterKey: function onEnterKey(e) {
          13 === e.keyCode && (a(e.target).is(S.params.nextButton) ? (S.onClickNext(e), S.isEnd ? S.a11y.notify(S.params.lastSlideMessage) : S.a11y.notify(S.params.nextSlideMessage)) : a(e.target).is(S.params.prevButton) && (S.onClickPrev(e), S.isBeginning ? S.a11y.notify(S.params.firstSlideMessage) : S.a11y.notify(S.params.prevSlideMessage)), a(e.target).is("." + S.params.bulletClass) && a(e.target)[0].click());
        }, liveRegion: a('<span class="' + S.params.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>'), notify: function notify(e) {
          var a = S.a11y.liveRegion;0 !== a.length && (a.html(""), a.html(e));
        }, init: function init() {
          S.params.nextButton && S.nextButton && S.nextButton.length > 0 && (S.a11y.makeFocusable(S.nextButton), S.a11y.addRole(S.nextButton, "button"), S.a11y.addLabel(S.nextButton, S.params.nextSlideMessage)), S.params.prevButton && S.prevButton && S.prevButton.length > 0 && (S.a11y.makeFocusable(S.prevButton), S.a11y.addRole(S.prevButton, "button"), S.a11y.addLabel(S.prevButton, S.params.prevSlideMessage)), a(S.container).append(S.a11y.liveRegion);
        }, initPagination: function initPagination() {
          S.params.pagination && S.params.paginationClickable && S.bullets && S.bullets.length && S.bullets.each(function () {
            var e = a(this);S.a11y.makeFocusable(e), S.a11y.addRole(e, "button"), S.a11y.addLabel(e, S.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1));
          });
        }, destroy: function destroy() {
          S.a11y.liveRegion && S.a11y.liveRegion.length > 0 && S.a11y.liveRegion.remove();
        } }, S.init = function () {
        S.params.loop && S.createLoop(), S.updateContainerSize(), S.updateSlidesSize(), S.updatePagination(), S.params.scrollbar && S.scrollbar && (S.scrollbar.set(), S.params.scrollbarDraggable && S.scrollbar.enableDraggable()), "slide" !== S.params.effect && S.effects[S.params.effect] && (S.params.loop || S.updateProgress(), S.effects[S.params.effect].setTranslate()), S.params.loop ? S.slideTo(S.params.initialSlide + S.loopedSlides, 0, S.params.runCallbacksOnInit) : (S.slideTo(S.params.initialSlide, 0, S.params.runCallbacksOnInit), 0 === S.params.initialSlide && (S.parallax && S.params.parallax && S.parallax.setTranslate(), S.lazy && S.params.lazyLoading && (S.lazy.load(), S.lazy.initialImageLoaded = !0))), S.attachEvents(), S.params.observer && S.support.observer && S.initObservers(), S.params.preloadImages && !S.params.lazyLoading && S.preloadImages(), S.params.zoom && S.zoom && S.zoom.init(), S.params.autoplay && S.startAutoplay(), S.params.keyboardControl && S.enableKeyboardControl && S.enableKeyboardControl(), S.params.mousewheelControl && S.enableMousewheelControl && S.enableMousewheelControl(), S.params.hashnavReplaceState && (S.params.replaceState = S.params.hashnavReplaceState), S.params.history && S.history && S.history.init(), S.params.hashnav && S.hashnav && S.hashnav.init(), S.params.a11y && S.a11y && S.a11y.init(), S.emit("onInit", S);
      }, S.cleanupStyles = function () {
        S.container.removeClass(S.classNames.join(" ")).removeAttr("style"), S.wrapper.removeAttr("style"), S.slides && S.slides.length && S.slides.removeClass([S.params.slideVisibleClass, S.params.slideActiveClass, S.params.slideNextClass, S.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"), S.paginationContainer && S.paginationContainer.length && S.paginationContainer.removeClass(S.params.paginationHiddenClass), S.bullets && S.bullets.length && S.bullets.removeClass(S.params.bulletActiveClass), S.params.prevButton && a(S.params.prevButton).removeClass(S.params.buttonDisabledClass), S.params.nextButton && a(S.params.nextButton).removeClass(S.params.buttonDisabledClass), S.params.scrollbar && S.scrollbar && (S.scrollbar.track && S.scrollbar.track.length && S.scrollbar.track.removeAttr("style"), S.scrollbar.drag && S.scrollbar.drag.length && S.scrollbar.drag.removeAttr("style"));
      }, S.destroy = function (e, a) {
        S.detachEvents(), S.stopAutoplay(), S.params.scrollbar && S.scrollbar && S.params.scrollbarDraggable && S.scrollbar.disableDraggable(), S.params.loop && S.destroyLoop(), a && S.cleanupStyles(), S.disconnectObservers(), S.params.zoom && S.zoom && S.zoom.destroy(), S.params.keyboardControl && S.disableKeyboardControl && S.disableKeyboardControl(), S.params.mousewheelControl && S.disableMousewheelControl && S.disableMousewheelControl(), S.params.a11y && S.a11y && S.a11y.destroy(), S.params.history && !S.params.replaceState && window.removeEventListener("popstate", S.history.setHistoryPopState), S.params.hashnav && S.hashnav && S.hashnav.destroy(), S.emit("onDestroy"), e !== !1 && (S = null);
      }, S.init(), S;
    }
  };t.prototype = { isSafari: function () {
      var e = navigator.userAgent.toLowerCase();return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0;
    }(), isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent), isArray: function isArray(e) {
      return "[object Array]" === Object.prototype.toString.apply(e);
    }, browser: { ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled, ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1, lteIE9: function () {
        var e = document.createElement("div");return e.innerHTML = "<!--[if lte IE 9]><i></i><![endif]-->", 1 === e.getElementsByTagName("i").length;
      }() }, device: function () {
      var e = navigator.userAgent,
          a = e.match(/(Android);?[\s\/]+([\d.]+)?/),
          t = e.match(/(iPad).*OS\s([\d_]+)/),
          s = e.match(/(iPod)(.*OS\s([\d_]+))?/),
          i = !t && e.match(/(iPhone\sOS)\s([\d_]+)/);return { ios: t || i || s, android: a };
    }(), support: { touch: window.Modernizr && Modernizr.touch === !0 || function () {
        return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
      }(), transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function () {
        var e = document.createElement("div").style;return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e;
      }(), flexbox: function () {
        for (var e = document.createElement("div").style, a = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), t = 0; t < a.length; t++) {
          if (a[t] in e) return !0;
        }
      }(), observer: function () {
        return "MutationObserver" in window || "WebkitMutationObserver" in window;
      }(), passiveListener: function () {
        var e = !1;try {
          var a = Object.defineProperty({}, "passive", { get: function get() {
              e = !0;
            } });window.addEventListener("testPassiveListener", null, a);
        } catch (e) {}return e;
      }(), gestures: function () {
        return "ongesturestart" in window;
      }() }, plugins: {} };for (var s = function () {
    var e = function e(_e) {
      var a = this,
          t = 0;for (t = 0; t < _e.length; t++) {
        a[t] = _e[t];
      }return a.length = _e.length, this;
    },
        a = function a(_a, t) {
      var s = [],
          i = 0;if (_a && !t && _a instanceof e) return _a;if (_a) if ("string" == typeof _a) {
        var r,
            n,
            o = _a.trim();if (o.indexOf("<") >= 0 && o.indexOf(">") >= 0) {
          var l = "div";for (0 === o.indexOf("<li") && (l = "ul"), 0 === o.indexOf("<tr") && (l = "tbody"), 0 !== o.indexOf("<td") && 0 !== o.indexOf("<th") || (l = "tr"), 0 === o.indexOf("<tbody") && (l = "table"), 0 === o.indexOf("<option") && (l = "select"), n = document.createElement(l), n.innerHTML = _a, i = 0; i < n.childNodes.length; i++) {
            s.push(n.childNodes[i]);
          }
        } else for (r = t || "#" !== _a[0] || _a.match(/[ .<>:~]/) ? (t || document).querySelectorAll(_a) : [document.getElementById(_a.split("#")[1])], i = 0; i < r.length; i++) {
          r[i] && s.push(r[i]);
        }
      } else if (_a.nodeType || _a === window || _a === document) s.push(_a);else if (_a.length > 0 && _a[0].nodeType) for (i = 0; i < _a.length; i++) {
        s.push(_a[i]);
      }return new e(s);
    };return e.prototype = { addClass: function addClass(e) {
        if ("undefined" == typeof e) return this;for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.add(a[t]);
          }
        }return this;
      }, removeClass: function removeClass(e) {
        for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.remove(a[t]);
          }
        }return this;
      }, hasClass: function hasClass(e) {
        return !!this[0] && this[0].classList.contains(e);
      }, toggleClass: function toggleClass(e) {
        for (var a = e.split(" "), t = 0; t < a.length; t++) {
          for (var s = 0; s < this.length; s++) {
            this[s].classList.toggle(a[t]);
          }
        }return this;
      }, attr: function attr(e, a) {
        if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;for (var t = 0; t < this.length; t++) {
          if (2 === arguments.length) this[t].setAttribute(e, a);else for (var s in e) {
            this[t][s] = e[s], this[t].setAttribute(s, e[s]);
          }
        }return this;
      }, removeAttr: function removeAttr(e) {
        for (var a = 0; a < this.length; a++) {
          this[a].removeAttribute(e);
        }return this;
      }, data: function data(e, a) {
        if ("undefined" != typeof a) {
          for (var t = 0; t < this.length; t++) {
            var s = this[t];s.dom7ElementDataStorage || (s.dom7ElementDataStorage = {}), s.dom7ElementDataStorage[e] = a;
          }return this;
        }if (this[0]) {
          var i = this[0].getAttribute("data-" + e);return i ? i : this[0].dom7ElementDataStorage && (e in this[0].dom7ElementDataStorage) ? this[0].dom7ElementDataStorage[e] : void 0;
        }
      }, transform: function transform(e) {
        for (var a = 0; a < this.length; a++) {
          var t = this[a].style;t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e;
        }return this;
      }, transition: function transition(e) {
        "string" != typeof e && (e += "ms");for (var a = 0; a < this.length; a++) {
          var t = this[a].style;t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e;
        }return this;
      }, on: function on(e, t, s, i) {
        function r(e) {
          var i = e.target;if (a(i).is(t)) s.call(i, e);else for (var r = a(i).parents(), n = 0; n < r.length; n++) {
            a(r[n]).is(t) && s.call(r[n], e);
          }
        }var n,
            o,
            l = e.split(" ");for (n = 0; n < this.length; n++) {
          if ("function" == typeof t || t === !1) for ("function" == typeof t && (s = arguments[1], i = arguments[2] || !1), o = 0; o < l.length; o++) {
            this[n].addEventListener(l[o], s, i);
          } else for (o = 0; o < l.length; o++) {
            this[n].dom7LiveListeners || (this[n].dom7LiveListeners = []), this[n].dom7LiveListeners.push({ listener: s, liveListener: r }), this[n].addEventListener(l[o], r, i);
          }
        }return this;
      }, off: function off(e, a, t, s) {
        for (var i = e.split(" "), r = 0; r < i.length; r++) {
          for (var n = 0; n < this.length; n++) {
            if ("function" == typeof a || a === !1) "function" == typeof a && (t = arguments[1], s = arguments[2] || !1), this[n].removeEventListener(i[r], t, s);else if (this[n].dom7LiveListeners) for (var o = 0; o < this[n].dom7LiveListeners.length; o++) {
              this[n].dom7LiveListeners[o].listener === t && this[n].removeEventListener(i[r], this[n].dom7LiveListeners[o].liveListener, s);
            }
          }
        }return this;
      }, once: function once(e, a, t, s) {
        function i(n) {
          t(n), r.off(e, a, i, s);
        }var r = this;"function" == typeof a && (a = !1, t = arguments[1], s = arguments[2]), r.on(e, a, i, s);
      }, trigger: function trigger(e, a) {
        for (var t = 0; t < this.length; t++) {
          var s;try {
            s = new window.CustomEvent(e, { detail: a, bubbles: !0, cancelable: !0 });
          } catch (t) {
            s = document.createEvent("Event"), s.initEvent(e, !0, !0), s.detail = a;
          }this[t].dispatchEvent(s);
        }return this;
      }, transitionEnd: function transitionEnd(e) {
        function a(r) {
          if (r.target === this) for (e.call(this, r), t = 0; t < s.length; t++) {
            i.off(s[t], a);
          }
        }var t,
            s = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
            i = this;if (e) for (t = 0; t < s.length; t++) {
          i.on(s[t], a);
        }return this;
      }, width: function width() {
        return this[0] === window ? window.innerWidth : this.length > 0 ? parseFloat(this.css("width")) : null;
      }, outerWidth: function outerWidth(e) {
        return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth : null;
      }, height: function height() {
        return this[0] === window ? window.innerHeight : this.length > 0 ? parseFloat(this.css("height")) : null;
      }, outerHeight: function outerHeight(e) {
        return this.length > 0 ? e ? this[0].offsetHeight + parseFloat(this.css("margin-top")) + parseFloat(this.css("margin-bottom")) : this[0].offsetHeight : null;
      }, offset: function offset() {
        if (this.length > 0) {
          var e = this[0],
              a = e.getBoundingClientRect(),
              t = document.body,
              s = e.clientTop || t.clientTop || 0,
              i = e.clientLeft || t.clientLeft || 0,
              r = window.pageYOffset || e.scrollTop,
              n = window.pageXOffset || e.scrollLeft;return { top: a.top + r - s, left: a.left + n - i };
        }return null;
      }, css: function css(e, a) {
        var t;if (1 === arguments.length) {
          if ("string" != typeof e) {
            for (t = 0; t < this.length; t++) {
              for (var s in e) {
                this[t].style[s] = e[s];
              }
            }return this;
          }if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(e);
        }if (2 === arguments.length && "string" == typeof e) {
          for (t = 0; t < this.length; t++) {
            this[t].style[e] = a;
          }return this;
        }return this;
      }, each: function each(e) {
        for (var a = 0; a < this.length; a++) {
          e.call(this[a], a, this[a]);
        }return this;
      }, html: function html(e) {
        if ("undefined" == typeof e) return this[0] ? this[0].innerHTML : void 0;for (var a = 0; a < this.length; a++) {
          this[a].innerHTML = e;
        }return this;
      }, text: function text(e) {
        if ("undefined" == typeof e) return this[0] ? this[0].textContent.trim() : null;for (var a = 0; a < this.length; a++) {
          this[a].textContent = e;
        }return this;
      }, is: function is(t) {
        if (!this[0]) return !1;var s, i;if ("string" == typeof t) {
          var r = this[0];if (r === document) return t === document;if (r === window) return t === window;if (r.matches) return r.matches(t);if (r.webkitMatchesSelector) return r.webkitMatchesSelector(t);if (r.mozMatchesSelector) return r.mozMatchesSelector(t);if (r.msMatchesSelector) return r.msMatchesSelector(t);for (s = a(t), i = 0; i < s.length; i++) {
            if (s[i] === this[0]) return !0;
          }return !1;
        }if (t === document) return this[0] === document;if (t === window) return this[0] === window;if (t.nodeType || t instanceof e) {
          for (s = t.nodeType ? [t] : t, i = 0; i < s.length; i++) {
            if (s[i] === this[0]) return !0;
          }return !1;
        }return !1;
      }, index: function index() {
        if (this[0]) {
          for (var e = this[0], a = 0; null !== (e = e.previousSibling);) {
            1 === e.nodeType && a++;
          }return a;
        }
      }, eq: function eq(a) {
        if ("undefined" == typeof a) return this;var t,
            s = this.length;return a > s - 1 ? new e([]) : a < 0 ? (t = s + a, new e(t < 0 ? [] : [this[t]])) : new e([this[a]]);
      }, append: function append(a) {
        var t, s;for (t = 0; t < this.length; t++) {
          if ("string" == typeof a) {
            var i = document.createElement("div");for (i.innerHTML = a; i.firstChild;) {
              this[t].appendChild(i.firstChild);
            }
          } else if (a instanceof e) for (s = 0; s < a.length; s++) {
            this[t].appendChild(a[s]);
          } else this[t].appendChild(a);
        }return this;
      }, prepend: function prepend(a) {
        var t, s;for (t = 0; t < this.length; t++) {
          if ("string" == typeof a) {
            var i = document.createElement("div");for (i.innerHTML = a, s = i.childNodes.length - 1; s >= 0; s--) {
              this[t].insertBefore(i.childNodes[s], this[t].childNodes[0]);
            }
          } else if (a instanceof e) for (s = 0; s < a.length; s++) {
            this[t].insertBefore(a[s], this[t].childNodes[0]);
          } else this[t].insertBefore(a, this[t].childNodes[0]);
        }return this;
      }, insertBefore: function insertBefore(e) {
        for (var t = a(e), s = 0; s < this.length; s++) {
          if (1 === t.length) t[0].parentNode.insertBefore(this[s], t[0]);else if (t.length > 1) for (var i = 0; i < t.length; i++) {
            t[i].parentNode.insertBefore(this[s].cloneNode(!0), t[i]);
          }
        }
      }, insertAfter: function insertAfter(e) {
        for (var t = a(e), s = 0; s < this.length; s++) {
          if (1 === t.length) t[0].parentNode.insertBefore(this[s], t[0].nextSibling);else if (t.length > 1) for (var i = 0; i < t.length; i++) {
            t[i].parentNode.insertBefore(this[s].cloneNode(!0), t[i].nextSibling);
          }
        }
      }, next: function next(t) {
        return new e(this.length > 0 ? t ? this[0].nextElementSibling && a(this[0].nextElementSibling).is(t) ? [this[0].nextElementSibling] : [] : this[0].nextElementSibling ? [this[0].nextElementSibling] : [] : []);
      }, nextAll: function nextAll(t) {
        var s = [],
            i = this[0];if (!i) return new e([]);for (; i.nextElementSibling;) {
          var r = i.nextElementSibling;t ? a(r).is(t) && s.push(r) : s.push(r), i = r;
        }return new e(s);
      }, prev: function prev(t) {
        return new e(this.length > 0 ? t ? this[0].previousElementSibling && a(this[0].previousElementSibling).is(t) ? [this[0].previousElementSibling] : [] : this[0].previousElementSibling ? [this[0].previousElementSibling] : [] : []);
      }, prevAll: function prevAll(t) {
        var s = [],
            i = this[0];if (!i) return new e([]);for (; i.previousElementSibling;) {
          var r = i.previousElementSibling;t ? a(r).is(t) && s.push(r) : s.push(r), i = r;
        }return new e(s);
      }, parent: function parent(e) {
        for (var t = [], s = 0; s < this.length; s++) {
          e ? a(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode);
        }return a(a.unique(t));
      }, parents: function parents(e) {
        for (var t = [], s = 0; s < this.length; s++) {
          for (var i = this[s].parentNode; i;) {
            e ? a(i).is(e) && t.push(i) : t.push(i), i = i.parentNode;
          }
        }return a(a.unique(t));
      }, find: function find(a) {
        for (var t = [], s = 0; s < this.length; s++) {
          for (var i = this[s].querySelectorAll(a), r = 0; r < i.length; r++) {
            t.push(i[r]);
          }
        }return new e(t);
      }, children: function children(t) {
        for (var s = [], i = 0; i < this.length; i++) {
          for (var r = this[i].childNodes, n = 0; n < r.length; n++) {
            t ? 1 === r[n].nodeType && a(r[n]).is(t) && s.push(r[n]) : 1 === r[n].nodeType && s.push(r[n]);
          }
        }return new e(a.unique(s));
      }, remove: function remove() {
        for (var e = 0; e < this.length; e++) {
          this[e].parentNode && this[e].parentNode.removeChild(this[e]);
        }return this;
      }, add: function add() {
        var e,
            t,
            s = this;for (e = 0; e < arguments.length; e++) {
          var i = a(arguments[e]);for (t = 0; t < i.length; t++) {
            s[s.length] = i[t], s.length++;
          }
        }return s;
      } }, a.fn = e.prototype, a.unique = function (e) {
      for (var a = [], t = 0; t < e.length; t++) {
        a.indexOf(e[t]) === -1 && a.push(e[t]);
      }return a;
    }, a;
  }(), i = ["jQuery", "Zepto", "Dom7"], r = 0; r < i.length; r++) {
    window[i[r]] && e(window[i[r]]);
  }var n;n = "undefined" == typeof s ? window.Dom7 || window.Zepto || window.jQuery : s, n && ("transitionEnd" in n.fn || (n.fn.transitionEnd = function (e) {
    function a(r) {
      if (r.target === this) for (e.call(this, r), t = 0; t < s.length; t++) {
        i.off(s[t], a);
      }
    }var t,
        s = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
        i = this;if (e) for (t = 0; t < s.length; t++) {
      i.on(s[t], a);
    }return this;
  }), "transform" in n.fn || (n.fn.transform = function (e) {
    for (var a = 0; a < this.length; a++) {
      var t = this[a].style;t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e;
    }return this;
  }), "transition" in n.fn || (n.fn.transition = function (e) {
    "string" != typeof e && (e += "ms");for (var a = 0; a < this.length; a++) {
      var t = this[a].style;t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e;
    }return this;
  }), "outerWidth" in n.fn || (n.fn.outerWidth = function (e) {
    return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth : null;
  })), window.Swiper = t;
}(),  true ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function () {
  "use strict";
  return window.Swiper;
});
//# sourceMappingURL=maps/swiper.min.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var app = angular.module("mapp", ["ui.router"]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("guide");
    $stateProvider.state("guide", {
        url: "/guide",
        templateUrl: "./tpl/guide.html",
        controller: "guideCtrl"
    }).state("index", {
        url: "/index",
        templateUrl: "./tpl/index.html",
        controller: "indexCtrl"
    }).state("index.home", {
        url: "/index.home",
        templateUrl: "./tpl/home.html",
        controller: "homeCtrl"

    }).state("index.first", {
        url: "/index.first",
        templateUrl: "./tpl/first.html",
        controller: "firstCtrl"

    }).state("index.find", {
        url: "/index.find",
        templateUrl: "./tpl/find.html"
    }).state("index.me", {
        url: "/index.me",
        templateUrl: "./tpl/me.html"
    }).state("index.exit", {
        url: "/index.exit",
        templateUrl: "./tpl/exit.html"
    });
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("mapp").controller("guideCtrl", function () {
    setTimeout(function () {
        var myswiper = new Swiper('#guide-swiper');
    }, 10);
    //var myScroll = new IScroll("#scroll")
}).controller("indexCtrl", function ($state) {
    $state.go("index.home");
}).controller("homeCtrl", function ($scope, myHttp) {
    //json��Ⱦ
    myHttp.then(function (data) {
        //[{1,2},{3,4},{4,5}]
        $scope.arr = [];
        $scope.data = data.data.data;
        var len = Math.ceil($scope.data.length);
        for (var i = 0; i < len; i++) {
            $scope.arr[i] = [];
            $scope.arr[i].push($scope.data[i * 2]);
            $scope.arr[i].push($scope.data[i * 2 + 1]);
        }
    });
    //swiperҳ���л�1
    setTimeout(function () {
        var myswiper2 = new Swiper('#first-swiper', {
            onSlideChangeStart: function onSlideChangeStart(swiper) {
                var indexs = swiper.activeIndex;
                //console.log(indexs)
                $("#first-nav").children().eq(indexs).addClass("active").siblings().removeClass("active");
            }
        });
        $("#first-nav").children().on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            myswiper2.slideTo($(this).index());
        });

        //swiper �ȵ�ҳ����עҳ �л�
        var myswiper1 = new Swiper('#home-swiper', {
            onSlideChangeStart: function onSlideChangeStart(swiper) {
                var indexs = swiper.activeIndex;
                //console.log(indexs)
                $("#nav").children().eq(indexs).addClass("active").siblings().removeClass("active");
            }
        });
        $("#nav").children().on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            myswiper1.slideTo($(this).index());
        });
    }, 10);
});

/* app.controller("firstCtrl", function () {
 var myScroll = new IScroll("#scroll")
 })*/

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("mapp").factory("myHttp", ["$http", function ($http) {
    return $http.get("./livelist.json");
}]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./app.sass", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/lib/loader.js!./app.sass");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./swiper.min.css", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./swiper.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/**\n * Yo框架全局Variables\n -----------------------\n * Yo基础变量map，如果不想定义某属性，将其value设置为null；\n * Yo仅使用2种长度单位：px用于边框，rem用于除边框之外的所有地方\n *\n * @class variables\n * @module Yo\n */\n/**\n * Yo框架全局基础方法\n -----------------------\n * Yo内置了包括响应式方案，CSS3兼容性方案，厂商前缀方案，iconfont方案，flex布局等全局方法\n *\n * @class classes\n * @module Yo\n */\n/**\n * 给需要的属性加厂家前缀\n * @method prefix\n * @param {String} $property 指定属性\n * @param {String} $value 指定属性值\n */\n/**\n * 四则运算\n * @method calc\n * @param {String} $property 指定需要进行计算的CSS属性\n * @param {String} $value 与原生CSS语法一致，使用方式如：@include calc(width, 100% - 0.1rem);\n */\n/**\n * 定义渐变色值\n * @method gradient\n * @param {String} $type 指定渐变的4种类型：linear, repeating-linear, radial, repeating-radial\n * @param {String} $gradient 指定渐变取值，与w3c最新原生语法一致\n */\n/**\n * 定义响应式方案\n * @method responsive\n * @param {String} $media 指定媒体查询条件\n */\n/**\n * 定义字体图标\n * @method yofont\n */\n/**\n * 滤镜\n * @method filter\n * @param {String} $filter 取值与原生语法一致\n */\n/**\n * 定义UA默认外观\n * @method appearance\n * @param {String} $appearance 指定UA外观类型\n */\n/**\n * 定义是否可以选中元素\n * @method user-select\n * @param {String} $user-select 指定是否可以选中\n */\n/**\n * 定义背景图像缩放（Android Browser2.3.*还需要厂商前缀）\n * @method background-size\n * @param {String | Length} $background-size 指定背景图缩放值\n */\n/**\n * 定义背景裁减（Android Browser2.3.*还需要厂商前缀）\n * @method background-clip\n * @param {String} $background-clip 指定背景图缩放值\n */\n/**\n * 定义背景显示区域（Android Browser2.3.*还需要厂商前缀）\n * @method background-origin\n * @param {String} $background-origin 指定背景图缩放值\n */\n/**\n * 定义盒模型\n * @method box-sizing\n * @param {String} $box-sizing 的2个值分别为：content-box(标准盒模型) | border-box(怪异盒模型)\n */\n/**\n * 定义圆角\n * @method border-radius\n * @param {String} $border-radius 取值与原生语法一致\n */\n/**\n * 定义简单变换\n * @method transform\n * @param {String} $transform 取值与原生语法一致\n */\n/**\n * 定义变换原点\n * @method transform-origin\n * @param {String} $transform-origin 取值与原生语法一致\n */\n/**\n * 定义动画\n * @method animation\n * @param {String} $animation 取值与原生语法一致\n */\n/**\n * 定义补间\n * @method transition\n * @param {String} $transition 取值与原生语法一致\n */\n/**\n * 定义显示类型为伸缩盒\n * @method flexbox\n * @param {String} $flexbox 默认值：flex，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素如何分配空间\n * @method flex\n * @param {String} $flex 默认值：1，取值与最新原生语法一致\n * @param {String} $direction 默认值: row\n */\n/**\n * 定义伸缩盒子元素的排版顺序\n * @method order\n * @param {String} $order 默认值：1，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素的流动方向\n * @method flex-direction\n * @param {String} $flex-direction 默认值：row，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素溢出排版\n * @method flex-wrap\n * @param {String} $flex-wrap 默认值：nowrap，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素的水平对齐方式\n * @method justify-content\n * @param {String} $justify-content 默认值：center，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素的垂直对齐方式\n * @method align-items\n * @param {String} $align-items 默认值：center，取值与最新原生语法一致\n */\n/**\n * 定义伸缩盒子元素自身的垂直对齐方式\n * @method align-self\n * @param {String} $align-self 默认值：center，取值与最新原生语法一致\n */\n/**\n * 定义root root-scroll\n * @method root-scroll\n * @param {String} $root-scroll 指定scroll类型，取值overflow属性的标准值\n */\n/**\n * 定义是否有滚动条\n * @method overflow\n * @param {String} $overflow 默认值：auto，取值与最新原生语法一致\n */\n/**\n * 生成矩形方法\n * @method rect\n * @param {Length} $width 定义矩形的长度\n * @param {Length} $height 定义矩形的高度\n */\n/**\n * 生成正方形方法\n * @method square\n * @param {Length} $size 定义正方形的边长\n */\n/**\n * 生成圆形方法\n * @method circle\n * @param {Length} $size 定义圆的半径长度\n * @param {Length} $radius 定义圆的圆角半径长度\n */\n/**\n * 生成全屏方法\n * @method fullscreen\n * @param {Integer} $z-index 定义层叠级别\n */\n/**\n * 清除浮动方案\n * @method clearfix\n */\n/**\n * 链接处理方法\n * @method link\n * @param {Color} $color 定义链接颜色\n */\n/**\n * 强制换行方案\n * @method wrap\n */\n/**\n * 单行文本溢出显示方案\n * @method ellipsis\n * @param {Boolen} $ellipsis 定义是否需要省略号\n */\n/**\n * 文字隐藏方案\n * @method texthide\n */\n/**\n * 清除间隙方案-容器\n * @method killspace\n */\n/**\n * 清除间隙方案-子级\n * @method killspace-item\n */\n/**\n * 未知尺寸元素垂直居中解决方案-容器\n * @method valign\n */\n/**\n * 未知尺寸元素垂直居中解决方案-子级\n * @method valign-item\n */\n/**\n * 已经尺寸元素垂直居中解决方案\n * @method alignment\n * @param {Length} $width 居中元素的宽度\n * @param {Length} $height 居中元素的高度\n */\n/* border */\n/**\n * Yo框架全局Reset\n -----------------------\n * Yo重置Mobile及高级浏览器上常见的差异\n *\n * @class reset\n * @module Yo\n */\n*,\n::before,\n::after {\n  -webkit-tap-highlight-color: transparent; }\n\nhtml {\n  background-color: #fafafa;\n  color: #212121;\n  font-size: 100px;\n  -webkit-user-select: none;\n  user-select: none; }\n\nbody {\n  margin: 0;\n  font-size: 14px;\n  line-height: 1.5;\n  font-family: Helvetica Neue, Helvetica, STHeiTi, sans-serif; }\n\nul,\nol,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nfigure,\nform,\nfieldset,\nlegend,\ninput,\ntextarea,\nbutton,\np,\nblockquote,\nth,\ntd,\npre,\nxmp {\n  margin: 0;\n  padding: 0; }\n\ninput,\ntextarea,\nbutton,\nselect,\npre,\nxmp,\ntt,\ncode,\nkbd,\nsamp {\n  line-height: inherit;\n  font-family: inherit; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nsmall,\nbig,\ninput,\ntextarea,\nbutton,\nselect {\n  font-size: inherit; }\n\naddress,\ncite,\ndfn,\nem,\ni,\noptgroup,\nvar {\n  font-style: normal; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n  text-align: left; }\n\nul,\nol,\nmenu {\n  list-style: none; }\n\nfieldset,\nimg {\n  border: 0;\n  vertical-align: middle; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nvideo {\n  display: inline-block; }\n\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \" \"; }\n\ntextarea,\npre,\nxmp {\n  overflow: auto;\n  -webkit-overflow-scrolling: touch; }\n\ntextarea {\n  resize: vertical; }\n\ninput,\ntextarea,\nbutton,\nselect\na {\n  outline: 0 none; }\n\ninput,\ntextarea,\nbutton,\nselect {\n  color: inherit; }\n  input:disabled,\n  textarea:disabled,\n  button:disabled,\n  select:disabled {\n    opacity: 1; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  padding: 0;\n  border: 0; }\n\ninput[type=\"button\"],\ninput[type=\"submit\"],\ninput[type=\"reset\"],\ninput[type=\"file\"]::-webkit-file-upload-button,\ninput[type=\"search\"]::-webkit-search-cancel-button {\n  -webkit-appearance: none;\n  appearance: none; }\n\nmark {\n  background-color: transparent; }\n\na,\nins,\ns,\nu,\ndel {\n  text-decoration: none; }\n\na,\nimg {\n  -webkit-touch-callout: none; }\n\na {\n  color: #00afc7; }\n\n.g-clear::after,\n.g-mod::after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  content: \" \"; }\n\n@font-face {\n  font-family: yofont;\n  src: url(\"http://source.qunarzz.com/fonts/yo/1.0.0/yofont.woff\") format(\"woff\"), url(\"http://source.qunarzz.com/fonts/yo/1.0.0/yofont.ttf\") format(\"truetype\"); }\n\n.yo-ico {\n  font-family: yofont !important;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  vertical-align: middle; }\n\n.wrap {\n  width: 100%;\n  height: 100%;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  flex: 1;\n  width: .1px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n\n.my-controller {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  flex: 1;\n  width: .1px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  width: 100%;\n  overflow: hidden; }\n\n.index-content {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  flex: 1;\n  width: .1px;\n  width: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  overflow: hidden; }\n\n.swiper-slide {\n  width: 100%;\n  height: 100%; }\n  .swiper-slide img {\n    width: 100%;\n    height: 100%; }\n\n.home-header {\n  width: 100%;\n  height: .44rem;\n  background-color: #0fc441;\n  color: #ffffff; }\n  .home-header ul {\n    width: 100%;\n    height: 100%;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex; }\n    .home-header ul li:first-child, .home-header ul li:last-child {\n      width: .44rem;\n      text-align: center;\n      line-height: .44rem; }\n    .home-header ul li:nth-child(2) {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n      flex: 1;\n      width: .1px;\n      text-align: center;\n      line-height: .44rem; }\n      .home-header ul li:nth-child(2) span {\n        display: inline-block;\n        height: .25rem;\n        line-height: .25rem;\n        width: .6rem;\n        font-size: .12rem; }\n        .home-header ul li:nth-child(2) span:first-child {\n          background: #39cf63;\n          border-radius: 15px 0 0 15px; }\n        .home-header ul li:nth-child(2) span:last-child {\n          background: #39cf63;\n          border-radius: 0 15px 15px 0; }\n      .home-header ul li:nth-child(2) span.active {\n        background: #60d07e; }\n\n.home-section {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  flex: 1;\n  width: .1px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  width: 100%;\n  overflow: hidden; }\n  .home-section .nav {\n    height: .35rem; }\n    .home-section .nav > ul {\n      height: .35rem;\n      -webkit-box-sizing: border-box;\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: flex; }\n      .home-section .nav > ul li {\n        border-bottom: 1px solid #cccccc;\n        -webkit-box-flex: 1;\n        -webkit-flex: 1;\n        flex: 1;\n        width: .1px;\n        font-size: .14rem;\n        text-align: center;\n        line-height: .35rem;\n        color: #6a6a6a; }\n      .home-section .nav > ul li.active {\n        border-bottom: 2px solid #0fc441;\n        color: #0fc441; }\n\n.iscroll {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n  flex: 1;\n  width: .1px;\n  width: 100%;\n  overflow: hidden; }\n\n.content {\n  width: 100%;\n  padding-top: .05rem; }\n  .content ul {\n    width: 100%;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex; }\n    .content ul li {\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: flex;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n      -webkit-flex-direction: column;\n      flex-direction: column; }\n      .content ul li:not(:nth-child(2)) {\n        -webkit-box-flex: 1;\n        -webkit-flex: 1;\n        flex: 1;\n        width: .1px; }\n      .content ul li:nth-child(2) {\n        width: 0.05rem; }\n      .content ul li img {\n        width: 100%;\n        height: 100%;\n        display: inline-block; }\n      .content ul li b {\n        display: inline-block;\n        height: 34px;\n        line-height: 34px;\n        font-size: .14rem;\n        text-align: center; }\n\n.home-footer {\n  width: 100%;\n  border-top: 1px solid #d8d8d8;\n  box-sizing: border-box; }\n  .home-footer ul {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: flex; }\n  .home-footer li {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n    flex: 1;\n    width: .1px;\n    text-align: center;\n    color: #d9d9d9; }\n    .home-footer li b {\n      font-size: 12px; }\n    .home-footer li i:not(:nth-child(3)) {\n      font-size: 20px;\n      margin-top: 1px; }\n    .home-footer li em {\n      font-size: 40px;\n      color: #cccccc; }\n  .home-footer .camera {\n    position: absolute;\n    width: 60px;\n    height: 60px;\n    border: 1px solid #d8d8d8;\n    border-radius: 50%;\n    bottom: 0;\n    left: 50%;\n    background: #fff;\n    -webkit-transform: translate(-50%, 0);\n    -moz-transform: translate(-50%, 0); }\n    .home-footer .camera em {\n      line-height: 54px; }\n\n.footer-bg {\n  color: #0bbf44; }\n\n.one-box {\n  width: 100%;\n  overflow: hidden;\n  position: relative; }\n  .one-box .two-box {\n    width: 100%;\n    overflow: hidden; }\n    .one-box .two-box .three-box {\n      width: 100%;\n      overflow: hidden; }\n\n@font-face {\n  font-family: \"yofont\";\n  src: url(\"/images/iconfont/iconfont.ttf\");\n  src: url(\"/images/iconfont/iconfont.woff\"); }\n\nhtml {\n  width: 100%;\n  height: 100%; }\n\nbody {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/**\n * Swiper 3.4.0\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * \n * http://www.idangero.us/swiper/\n * \n * Copyright 2016, Vladimir Kharlampidi\n * The iDangero.us\n * http://www.idangero.us/\n * \n * Licensed under MIT\n * \n * Released on: October 16, 2016\n */\n.swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-moz-box-orient:vertical;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate(0,0);-ms-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.swiper-container-multirow>.swiper-wrapper{-webkit-box-lines:multiple;-moz-box-lines:multiple;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex:0 0 auto;flex-shrink:0;width:100%;height:100%;position:relative}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start;-webkit-transition-property:-webkit-transform,height;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform,height}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-wp8-horizontal{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-wp8-vertical{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;-moz-background-size:27px 44px;-webkit-background-size:27px 44px;background-size:27px 44px;background-position:center;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");left:10px;right:auto}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");right:10px;left:auto}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;transition:.3s;-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-moz-appearance:none;-ms-appearance:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-white .swiper-pagination-bullet{background:#fff}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-o-transform:translate(0,-50%);-ms-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:5px 0;display:block}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 5px}.swiper-pagination-progress{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progress .swiper-pagination-progressbar{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;-moz-transform-origin:left top;-ms-transform-origin:left top;-o-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar{-webkit-transform-origin:right top;-moz-transform-origin:right top;-ms-transform-origin:right top;-o-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progress{width:100%;height:4px;left:0;top:0}.swiper-container-vertical>.swiper-pagination-progress{width:4px;height:100%;left:0;top:0}.swiper-pagination-progress.swiper-pagination-white{background:rgba(255,255,255,.5)}.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar{background:#fff}.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar{background:#000}.swiper-container-3d{-webkit-perspective:1200px;-moz-perspective:1200px;-o-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-coverflow .swiper-wrapper,.swiper-container-flip .swiper-wrapper{-ms-perspective:1200px}.swiper-container-cube,.swiper-container-flip{overflow:visible}.swiper-container-cube .swiper-slide,.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-cube .swiper-slide .swiper-slide,.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active,.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top,.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-slide{visibility:hidden;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;-moz-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-zoom-container{width:100%;height:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-moz-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-moz-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-moz-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12,end) infinite;-moz-animation:swiper-preloader-spin 1s steps(12,end) infinite;animation:swiper-preloader-spin 1s steps(12,end) infinite}.swiper-lazy-preloader:after{display:block;content:\"\";width:100%;height:100%;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");background-position:50%;-webkit-background-size:100%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\")}@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{transform:rotate(360deg)}}", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

__webpack_require__(3);

__webpack_require__(2);

__webpack_require__(10);

__webpack_require__(5);

__webpack_require__(4);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

/***/ })
/******/ ]);
//# sourceMappingURL=boudle.js.map