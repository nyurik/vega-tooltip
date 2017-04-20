(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vegaTooltip = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// https://d3js.org/d3-collection/ Version 1.0.3. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

var nest = function() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) return rollup != null
        ? rollup(array) : (sortValues != null
        ? array.sort(sortValues)
        : array);

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map$$1, depth) {
    if (++depth > keys.length) return map$$1;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map$$1.entries();
    else array = [], map$$1.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
};

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map();
}

function setMap(map$$1, key, value) {
  map$$1.set(key, value);
}

function Set() {}

var proto = map.prototype;

Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var keys = function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
};

var values = function(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
};

var entries = function(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
};

exports.nest = nest;
exports.set = set;
exports.map = map;
exports.keys = keys;
exports.values = values;
exports.entries = entries;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3_dsv = {})));
}(this, function (exports) { 'use strict';

  function dsv(delimiter) {
    return new Dsv(delimiter);
  }

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function Dsv(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    this.parse = function(text, f) {
      var convert, columns, rows = this.parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns;
      return rows;
    };

    this.parseRows = function(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I, c;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var k = 1;
          c = text.charCodeAt(I++);
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    this.format = function(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      })).join("\n");
    };

    this.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }
  }

  dsv.prototype = Dsv.prototype;

  var csv = dsv(",");
  var tsv = dsv("\t");

  var version = "0.1.14";

  exports.version = version;
  exports.dsv = dsv;
  exports.csv = csv;
  exports.tsv = tsv;

}));
},{}],4:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-format', ['exports'], factory) :
  factory((global.d3_format = {}));
}(this, function (exports) { 'use strict';

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  };

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  };

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  };

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  };

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  };

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  };

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  };

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function identity(x) {
    return x;
  }

  function locale(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
        currency = locale.currency,
        decimal = locale.decimal;

    function format(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      return function(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // If the original value was negative, it may be rounded to zero during
          // formatting; treat this as (positive) zero.
          if (valueNegative) {
            var i = -1, n = value.length, c;
            valueNegative = false;
            while (++i < n) {
              if (c = value.charCodeAt(i), (48 < c && c < 58)
                  || (type === "x" && 96 < c && c < 103)
                  || (type === "X" && 64 < c && c < 71)) {
                valueNegative = true;
                break;
              }
            }
          }

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            var i = -1, n = value.length, c;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      };
    }

    function formatPrefix(specifier, value) {
      var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: format,
      formatPrefix: formatPrefix
    };
  };

  var defaultLocale = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  var caES = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  });

  var csCZ = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0Kč"],
  });

  var deCH = locale({
    decimal: ",",
    thousands: "'",
    grouping: [3],
    currency: ["", "\xa0CHF"]
  });

  var deDE = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  });

  var enCA = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  var enGB = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["£", ""]
  });

  var esES = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  });

  var fiFI = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0€"]
  });

  var frCA = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "$"]
  });

  var frFR = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0€"]
  });

  var heIL = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["₪", ""]
  });

  var huHU = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0Ft"]
  });

  var itIT = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["€", ""]
  });

  var jaJP = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["", "円"]
  });

  var koKR = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["₩", ""]
  });

  var mkMK = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "\xa0ден."]
  });

  var nlNL = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["€\xa0", ""]
  });

  var plPL = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", "zł"]
  });

  var ptBR = locale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["R$", ""]
  });

  var ruRU = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "\xa0руб."]
  });

  var svSE = locale({
    decimal: ",",
    thousands: "\xa0",
    grouping: [3],
    currency: ["", "SEK"]
  });

  var zhCN = locale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["¥", ""]
  });

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  };

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  };

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  };

  var format = defaultLocale.format;
  var formatPrefix = defaultLocale.formatPrefix;

  var version = "0.4.2";

  exports.version = version;
  exports.format = format;
  exports.formatPrefix = formatPrefix;
  exports.locale = locale;
  exports.localeCaEs = caES;
  exports.localeCsCz = csCZ;
  exports.localeDeCh = deCH;
  exports.localeDeDe = deDE;
  exports.localeEnCa = enCA;
  exports.localeEnGb = enGB;
  exports.localeEnUs = defaultLocale;
  exports.localeEsEs = esES;
  exports.localeFiFi = fiFI;
  exports.localeFrCa = frCA;
  exports.localeFrFr = frFR;
  exports.localeHeIl = heIL;
  exports.localeHuHu = huHU;
  exports.localeItIt = itIT;
  exports.localeJaJp = jaJP;
  exports.localeKoKr = koKR;
  exports.localeMkMk = mkMK;
  exports.localeNlNl = nlNL;
  exports.localePlPl = plPL;
  exports.localePtBr = ptBR;
  exports.localeRuRu = ruRU;
  exports.localeSvSe = svSE;
  exports.localeZhCn = zhCN;
  exports.formatSpecifier = formatSpecifier;
  exports.precisionFixed = precisionFixed;
  exports.precisionPrefix = precisionPrefix;
  exports.precisionRound = precisionRound;

}));
},{}],5:[function(require,module,exports){
// https://d3js.org/d3-selection/ Version 1.0.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
};

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

var creator = function(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
};

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

var matcher = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector
        || element.msMatchesSelector
        || element.mozMatchesSelector
        || element.oMatchesSelector;
    matcher = function(selector) {
      return function() {
        return vendorMatches.call(this, selector);
      };
    };
  }
}

var matcher$1 = matcher;

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  if (!("onmouseenter" in element$1)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

var selection_on = function(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
};

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

var sourceEvent = function() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
};

var point = function(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
};

var mouse = function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

function none() {}

var selector = function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
};

var selection_select = function(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

function empty() {
  return [];
}

var selectorAll = function(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
};

var selection_filter = function(match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function(update) {
  return new Array(update.length);
};

var selection_enter = function() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

var constant = function(x) {
  return function() {
    return x;
  };
};

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

var selection_data = function(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
};

var selection_exit = function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_merge = function(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
};

var selection_order = function() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
};

var selection_node = function() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
};

var selection_empty = function() {
  return !this.node();
};

var selection_each = function(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

var selection_attr = function(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
};

var defaultView = function(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
};

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

var selection_style = function(name, value, priority) {
  var node;
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : defaultView(node = this.node())
          .getComputedStyle(node, null)
          .getPropertyValue(name);
};

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

var selection_property = function(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
};

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

var selection_classed = function(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
};

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

var selection_text = function(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
};

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

var selection_html = function(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
};

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function() {
  return this.each(raise);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function() {
  return this.each(lower);
};

var selection_append = function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function() {
  return this.each(remove);
};

var selection_datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
};

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (event) {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

var selection_dispatch = function(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
};

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
};

var selectAll = function(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
};

var touch = function(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
};

var touches = function(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
};

exports.creator = creator;
exports.local = local;
exports.matcher = matcher$1;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;
exports.customEvent = customEvent;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-time')) :
  typeof define === 'function' && define.amd ? define('d3-time-format', ['exports', 'd3-time'], factory) :
  factory((global.d3_time_format = {}),global.d3_time);
}(this, function (exports,d3Time) { 'use strict';

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  function locale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.parse = newParse(specifier, localDate);
        f.toString = function() { return specifier; };
        return f;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.parse = newParse(specifier, utcDate);
        f.toString = function() { return specifier; };
        return f;
      }
    };
  };

  var pads = {"-": "", "_": " ", "0": "0"};
  var numberRe = /^\s*\d+/;
  var percentRe = /^%/;
  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + d3Time.day.count(d3Time.year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekNumberSunday(d, p) {
    return pad(d3Time.sunday.count(d3Time.year(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(d3Time.monday.count(d3Time.year(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + d3Time.utcDay.count(d3Time.utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(d3Time.utcSunday.count(d3Time.utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(d3Time.utcMonday.count(d3Time.utcYear(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  var locale = locale$1({
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  var caES = locale$1({
    dateTime: "%A, %e de %B de %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
    shortDays: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."],
    months: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
    shortMonths: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."]
  });

  var deCH = locale$1({
    dateTime: "%A, der %e. %B %Y, %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  });

  var deDE = locale$1({
    dateTime: "%A, der %e. %B %Y, %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  });

  var enCA = locale$1({
    dateTime: "%a %b %e %X %Y",
    date: "%Y-%m-%d",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  var enGB = locale$1({
    dateTime: "%a %e %b %X %Y",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  var esES = locale$1({
    dateTime: "%A, %e de %B de %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  });

  var fiFI = locale$1({
    dateTime: "%A, %-d. %Bta %Y klo %X",
    date: "%-d.%-m.%Y",
    time: "%H:%M:%S",
    periods: ["a.m.", "p.m."],
    days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
    shortDays: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
    shortMonths: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"]
  });

  var frCA = locale$1({
    dateTime: "%a %e %b %Y %X",
    date: "%Y-%m-%d",
    time: "%H:%M:%S",
    periods: ["", ""],
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    shortDays: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    shortMonths: ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aoû", "sep", "oct", "nov", "déc"]
  });

  var frFR = locale$1({
    dateTime: "%A, le %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    shortMonths: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
  });

  var heIL = locale$1({
    dateTime: "%A, %e ב%B %Y %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
    shortDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
    months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
    shortMonths: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"]
  });

  var huHU = locale$1({
    dateTime: "%Y. %B %-e., %A %X",
    date: "%Y. %m. %d.",
    time: "%H:%M:%S",
    periods: ["de.", "du."], // unused
    days: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
    shortDays: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
    months: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
    shortMonths: ["jan.", "feb.", "már.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."]
  });

  var itIT = locale$1({
    dateTime: "%A %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
    shortDays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    shortMonths: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
  });

  var jaJP = locale$1({
    dateTime: "%Y %b %e %a %X",
    date: "%Y/%m/%d",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    shortDays: ["日", "月", "火", "水", "木", "金", "土"],
    months: ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  });

  var koKR = locale$1({
    dateTime: "%Y/%m/%d %a %X",
    date: "%Y/%m/%d",
    time: "%H:%M:%S",
    periods: ["오전", "오후"],
    days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    shortDays: ["일", "월", "화", "수", "목", "금", "토"],
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    shortMonths: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  });

  var mkMK = locale$1({
    dateTime: "%A, %e %B %Y г. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
    shortDays: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
    months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
    shortMonths: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
  });

  var nlNL = locale$1({
    dateTime: "%a %e %B %Y %T",
    date: "%d-%m-%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    shortDays: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
    shortMonths: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
  });

  var plPL = locale$1({
    dateTime: "%A, %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"], // unused
    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    shortDays: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    shortMonths: ["Stycz.", "Luty", "Marz.", "Kwie.", "Maj", "Czerw.", "Lipc.", "Sierp.", "Wrz.", "Paźdz.", "Listop.", "Grudz."]/* In Polish language abbraviated months are not commonly used so there is a dispute about the proper abbraviations. */
  });

  var ptBR = locale$1({
    dateTime: "%A, %e de %B de %Y. %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  });

  var ruRU = locale$1({
    dateTime: "%A, %e %B %Y г. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  });

  var svSE = locale$1({
    dateTime: "%A den %d %B %Y %X",
    date: "%Y-%m-%d",
    time: "%H:%M:%S",
    periods: ["fm", "em"],
    days: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
    shortDays: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
    months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
  });

  var zhCN = locale$1({
    dateTime: "%a %b %e %X %Y",
    date: "%Y/%-m/%-d",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    shortDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  });

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
    return date.toISOString();
  }

  formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };

  formatIsoNative.toString = function() {
    return isoSpecifier;
  };

  var formatIso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
      ? formatIsoNative
      : locale.utcFormat(isoSpecifier);

  var format = locale.format;
  var utcFormat = locale.utcFormat;

  var version = "0.2.1";

  exports.version = version;
  exports.format = format;
  exports.utcFormat = utcFormat;
  exports.locale = locale$1;
  exports.localeCaEs = caES;
  exports.localeDeCh = deCH;
  exports.localeDeDe = deDE;
  exports.localeEnCa = enCA;
  exports.localeEnGb = enGB;
  exports.localeEnUs = locale;
  exports.localeEsEs = esES;
  exports.localeFiFi = fiFI;
  exports.localeFrCa = frCA;
  exports.localeFrFr = frFR;
  exports.localeHeIl = heIL;
  exports.localeHuHu = huHU;
  exports.localeItIt = itIT;
  exports.localeJaJp = jaJP;
  exports.localeKoKr = koKR;
  exports.localeMkMk = mkMK;
  exports.localeNlNl = nlNL;
  exports.localePlPl = plPL;
  exports.localePtBr = ptBR;
  exports.localeRuRu = ruRU;
  exports.localeSvSe = svSE;
  exports.localeZhCn = zhCN;
  exports.isoFormat = formatIso;

}));
},{"d3-time":7}],7:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
  factory((global.d3_time = {}));
}(this, function (exports) { 'use strict';

  var t0 = new Date;
  var t1 = new Date;
  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  };

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getSeconds();
  });

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getMinutes();
  });

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getHours();
  });

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  }, function(date) {
    return date.getDate() - 1;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getUTCMinutes();
  });

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getUTCHours();
  });

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  var milliseconds = millisecond.range;
  var seconds = second.range;
  var minutes = minute.range;
  var hours = hour.range;
  var days = day.range;
  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;
  var weeks = sunday.range;
  var months = month.range;
  var years = year.range;

  var utcMillisecond = millisecond;
  var utcMilliseconds = milliseconds;
  var utcSeconds = utcSecond.range;
  var utcMinutes = utcMinute.range;
  var utcHours = utcHour.range;
  var utcDays = utcDay.range;
  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;
  var utcWeeks = utcSunday.range;
  var utcMonths = utcMonth.range;
  var utcYears = utcYear.range;

  var version = "0.1.1";

  exports.version = version;
  exports.milliseconds = milliseconds;
  exports.seconds = seconds;
  exports.minutes = minutes;
  exports.hours = hours;
  exports.days = days;
  exports.sundays = sundays;
  exports.mondays = mondays;
  exports.tuesdays = tuesdays;
  exports.wednesdays = wednesdays;
  exports.thursdays = thursdays;
  exports.fridays = fridays;
  exports.saturdays = saturdays;
  exports.weeks = weeks;
  exports.months = months;
  exports.years = years;
  exports.utcMillisecond = utcMillisecond;
  exports.utcMilliseconds = utcMilliseconds;
  exports.utcSeconds = utcSeconds;
  exports.utcMinutes = utcMinutes;
  exports.utcHours = utcHours;
  exports.utcDays = utcDays;
  exports.utcSundays = utcSundays;
  exports.utcMondays = utcMondays;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursdays = utcThursdays;
  exports.utcFridays = utcFridays;
  exports.utcSaturdays = utcSaturdays;
  exports.utcWeeks = utcWeeks;
  exports.utcMonths = utcMonths;
  exports.utcYears = utcYears;
  exports.millisecond = millisecond;
  exports.second = second;
  exports.minute = minute;
  exports.hour = hour;
  exports.day = day;
  exports.sunday = sunday;
  exports.monday = monday;
  exports.tuesday = tuesday;
  exports.wednesday = wednesday;
  exports.thursday = thursday;
  exports.friday = friday;
  exports.saturday = saturday;
  exports.week = sunday;
  exports.month = month;
  exports.year = year;
  exports.utcSecond = utcSecond;
  exports.utcMinute = utcMinute;
  exports.utcHour = utcHour;
  exports.utcDay = utcDay;
  exports.utcSunday = utcSunday;
  exports.utcMonday = utcMonday;
  exports.utcTuesday = utcTuesday;
  exports.utcWednesday = utcWednesday;
  exports.utcThursday = utcThursday;
  exports.utcFriday = utcFriday;
  exports.utcSaturday = utcSaturday;
  exports.utcWeek = utcSunday;
  exports.utcMonth = utcMonth;
  exports.utcYear = utcYear;
  exports.interval = newInterval;

}));
},{}],8:[function(require,module,exports){
module.exports={
  "name": "datalib",
  "version": "1.7.3",
  "description": "JavaScript utilites for loading, summarizing and working with data.",
  "keywords": [
    "data",
    "table",
    "statistics",
    "parse",
    "csv",
    "tsv",
    "json",
    "utility"
  ],
  "repository": {
    "type": "git",
    "url": "http://github.com/vega/datalib.git"
  },
  "author": {
    "name": "Jeffrey Heer",
    "url": "http://idl.cs.washington.edu"
  },
  "contributors": [
    {
      "name": "Michael Correll",
      "url": "http://pages.cs.wisc.edu/~mcorrell/"
    },
    {
      "name": "Ryan Russell",
      "url": "https://github.com/RussellSprouts"
    }
  ],
  "license": "BSD-3-Clause",
  "dependencies": {
    "d3-dsv": "0.1",
    "d3-format": "0.4",
    "d3-time": "0.1",
    "d3-time-format": "0.2",
    "topojson": "^1.6.19",
    "request": "^2.67.0",
    "sync-request": "^2.1.0"
  },
  "devDependencies": {
    "browserify": "^12.0.1",
    "chai": "^3.4.1",
    "istanbul": "latest",
    "jshint": "^2.9.1-rc1",
    "mocha": "^2.3.4",
    "uglify-js": "^2.6.1"
  },
  "main": "src/index.js",
  "scripts": {
    "deploy": "npm run test && scripts/deploy.sh",
    "lint": "jshint src/",
    "test": "npm run lint && TZ=America/Los_Angeles mocha --recursive test/",
    "cover": "TZ=America/Los_Angeles istanbul cover _mocha -- --recursive test/",
    "build": "browserify src/index.js -d -s dl -o datalib.js",
    "postbuild": "uglifyjs datalib.js -c -m -o datalib.min.js"
  },
  "browser": {
    "buffer": false,
    "fs": false,
    "http": false,
    "request": false,
    "sync-request": false,
    "url": false
  }
}

},{}],9:[function(require,module,exports){
var util = require('./util'),
    time = require('./time'),
    utc = time.utc;

var u = module.exports;

u.$year   = util.$func('year', time.year.unit);
u.$month  = util.$func('month', time.months.unit);
u.$date   = util.$func('date', time.dates.unit);
u.$day    = util.$func('day', time.weekdays.unit);
u.$hour   = util.$func('hour', time.hours.unit);
u.$minute = util.$func('minute', time.minutes.unit);
u.$second = util.$func('second', time.seconds.unit);

u.$utcYear   = util.$func('utcYear', utc.year.unit);
u.$utcMonth  = util.$func('utcMonth', utc.months.unit);
u.$utcDate   = util.$func('utcDate', utc.dates.unit);
u.$utcDay    = util.$func('utcDay', utc.weekdays.unit);
u.$utcHour   = util.$func('utcHour', utc.hours.unit);
u.$utcMinute = util.$func('utcMinute', utc.minutes.unit);
u.$utcSecond = util.$func('utcSecond', utc.seconds.unit);

},{"./time":31,"./util":32}],10:[function(require,module,exports){
var util = require('../util'),
    Measures = require('./measures'),
    Collector = require('./collector');

function Aggregator() {
  this._cells = {};
  this._aggr = [];
  this._stream = false;
}

var Flags = Aggregator.Flags = {
  ADD_CELL: 1,
  MOD_CELL: 2
};

var proto = Aggregator.prototype;

// Parameters

proto.stream = function(v) {
  if (v == null) return this._stream;
  this._stream = !!v;
  this._aggr = [];
  return this;
};

// key accessor to use for streaming removes
proto.key = function(key) {
  if (key == null) return this._key;
  this._key = util.$(key);
  return this;
};

// Input: array of objects of the form
// {name: string, get: function}
proto.groupby = function(dims) {
  this._dims = util.array(dims).map(function(d, i) {
    d = util.isString(d) ? {name: d, get: util.$(d)}
      : util.isFunction(d) ? {name: util.name(d) || d.name || ('_' + i), get: d}
      : (d.name && util.isFunction(d.get)) ? d : null;
    if (d == null) throw 'Invalid groupby argument: ' + d;
    return d;
  });
  return this.clear();
};

// Input: array of objects of the form
// {name: string, ops: [string, ...]}
proto.summarize = function(fields) {
  fields = summarize_args(fields);
  this._count = true;
  var aggr = (this._aggr = []),
      m, f, i, j, op, as, get;

  for (i=0; i<fields.length; ++i) {
    for (j=0, m=[], f=fields[i]; j<f.ops.length; ++j) {
      op = f.ops[j];
      if (op !== 'count') this._count = false;
      as = (f.as && f.as[j]) || (op + (f.name==='*' ? '' : '_'+f.name));
      m.push(Measures[op](as));
    }
    get = f.get && util.$(f.get) ||
      (f.name === '*' ? util.identity : util.$(f.name));
    aggr.push({
      name: f.name,
      measures: Measures.create(
        m,
        this._stream, // streaming remove flag
        get,          // input tuple getter
        this._assign) // output tuple setter
    });
  }
  return this.clear();
};

// Convenience method to summarize by count
proto.count = function() {
  return this.summarize({'*':'count'});
};

// Override to perform custom tuple value assignment
proto._assign = function(object, name, value) {
  object[name] = value;
};

function summarize_args(fields) {
  if (util.isArray(fields)) { return fields; }
  if (fields == null) { return []; }
  var a = [], name, ops;
  for (name in fields) {
    ops = util.array(fields[name]);
    a.push({name: name, ops: ops});
  }
  return a;
}

// Cell Management

proto.clear = function() {
  return (this._cells = {}, this);
};

proto._cellkey = function(x) {
  var d = this._dims,
      n = d.length, i,
      k = String(d[0].get(x));
  for (i=1; i<n; ++i) {
    k += '|' + d[i].get(x);
  }
  return k;
};

proto._cell = function(x) {
  var key = this._dims.length ? this._cellkey(x) : '';
  return this._cells[key] || (this._cells[key] = this._newcell(x, key));
};

proto._newcell = function(x, key) {
  var cell = {
    num:   0,
    tuple: this._newtuple(x, key),
    flag:  Flags.ADD_CELL,
    aggs:  {}
  };

  var aggr = this._aggr, i;
  for (i=0; i<aggr.length; ++i) {
    cell.aggs[aggr[i].name] = new aggr[i].measures(cell, cell.tuple);
  }
  if (cell.collect) {
    cell.data = new Collector(this._key);
  }
  return cell;
};

proto._newtuple = function(x) {
  var dims = this._dims,
      t = {}, i, n;
  for (i=0, n=dims.length; i<n; ++i) {
    t[dims[i].name] = dims[i].get(x);
  }
  return this._ingest(t);
};

// Override to perform custom tuple ingestion
proto._ingest = util.identity;

// Process Tuples

proto._add = function(x) {
  var cell = this._cell(x),
      aggr = this._aggr, i;

  cell.num += 1;
  if (!this._count) { // skip if count-only
    if (cell.collect) cell.data.add(x);
    for (i=0; i<aggr.length; ++i) {
      cell.aggs[aggr[i].name].add(x);
    }
  }
  cell.flag |= Flags.MOD_CELL;
  if (this._on_add) this._on_add(x, cell);
};

proto._rem = function(x) {
  var cell = this._cell(x),
      aggr = this._aggr, i;

  cell.num -= 1;
  if (!this._count) { // skip if count-only
    if (cell.collect) cell.data.rem(x);
    for (i=0; i<aggr.length; ++i) {
      cell.aggs[aggr[i].name].rem(x);
    }
  }
  cell.flag |= Flags.MOD_CELL;
  if (this._on_rem) this._on_rem(x, cell);
};

proto._mod = function(curr, prev) {
  var cell0 = this._cell(prev),
      cell1 = this._cell(curr),
      aggr = this._aggr, i;

  if (cell0 !== cell1) {
    cell0.num -= 1;
    cell1.num += 1;
    if (cell0.collect) cell0.data.rem(prev);
    if (cell1.collect) cell1.data.add(curr);
  } else if (cell0.collect && !util.isObject(curr)) {
    cell0.data.rem(prev);
    cell0.data.add(curr);
  }

  for (i=0; i<aggr.length; ++i) {
    cell0.aggs[aggr[i].name].rem(prev);
    cell1.aggs[aggr[i].name].add(curr);
  }
  cell0.flag |= Flags.MOD_CELL;
  cell1.flag |= Flags.MOD_CELL;
  if (this._on_mod) this._on_mod(curr, prev, cell0, cell1);
};

proto._markMod = function(x) {
  var cell0 = this._cell(x);
  cell0.flag |= Flags.MOD_CELL;
};

proto.result = function() {
  var result = [],
      aggr = this._aggr,
      cell, i, k;

  for (k in this._cells) {
    cell = this._cells[k];
    if (cell.num > 0) {
      // consolidate collector values
      if (cell.collect) {
        cell.data.values();
      }
      // update tuple properties
      for (i=0; i<aggr.length; ++i) {
        cell.aggs[aggr[i].name].set();
      }
      // add output tuple
      result.push(cell.tuple);
    } else {
      delete this._cells[k];
    }
    cell.flag = 0;
  }

  this._rems = false;
  return result;
};

proto.changes = function(output) {
  var changes = output || {add:[], rem:[], mod:[]},
      aggr = this._aggr,
      cell, flag, i, k;

  for (k in this._cells) {
    cell = this._cells[k];
    flag = cell.flag;

    // consolidate collector values
    if (cell.collect) {
      cell.data.values();
    }

    // update tuple properties
    for (i=0; i<aggr.length; ++i) {
      cell.aggs[aggr[i].name].set();
    }

    // organize output tuples
    if (cell.num <= 0) {
      changes.rem.push(cell.tuple); // if (flag === Flags.MOD_CELL) { ??
      delete this._cells[k];
      if (this._on_drop) this._on_drop(cell);
    } else {
      if (this._on_keep) this._on_keep(cell);
      if (flag & Flags.ADD_CELL) {
        changes.add.push(cell.tuple);
      } else if (flag & Flags.MOD_CELL) {
        changes.mod.push(cell.tuple);
      }
    }

    cell.flag = 0;
  }

  this._rems = false;
  return changes;
};

proto.execute = function(input) {
  return this.clear().insert(input).result();
};

proto.insert = function(input) {
  this._consolidate();
  for (var i=0; i<input.length; ++i) {
    this._add(input[i]);
  }
  return this;
};

proto.remove = function(input) {
  if (!this._stream) {
    throw 'Aggregator not configured for streaming removes.' +
      ' Call stream(true) prior to calling summarize.';
  }
  for (var i=0; i<input.length; ++i) {
    this._rem(input[i]);
  }
  this._rems = true;
  return this;
};

// consolidate removals
proto._consolidate = function() {
  if (!this._rems) return;
  for (var k in this._cells) {
    if (this._cells[k].collect) {
      this._cells[k].data.values();
    }
  }
  this._rems = false;
};

module.exports = Aggregator;

},{"../util":32,"./collector":11,"./measures":13}],11:[function(require,module,exports){
var util = require('../util');
var stats = require('../stats');

var REM = '__dl_rem__';

function Collector(key) {
  this._add = [];
  this._rem = [];
  this._key = key || null;
  this._last = null;
}

var proto = Collector.prototype;

proto.add = function(v) {
  this._add.push(v);
};

proto.rem = function(v) {
  this._rem.push(v);
};

proto.values = function() {
  this._get = null;
  if (this._rem.length === 0) return this._add;

  var a = this._add,
      r = this._rem,
      k = this._key,
      x = Array(a.length - r.length),
      i, j, n, m;

  if (!util.isObject(r[0])) {
    // processing raw values
    m = stats.count.map(r);
    for (i=0, j=0, n=a.length; i<n; ++i) {
      if (m[a[i]] > 0) {
        m[a[i]] -= 1;
      } else {
        x[j++] = a[i];
      }
    }
  } else if (k) {
    // has unique key field, so use that
    m = util.toMap(r, k);
    for (i=0, j=0, n=a.length; i<n; ++i) {
      if (!m.hasOwnProperty(k(a[i]))) { x[j++] = a[i]; }
    }
  } else {
    // no unique key, mark tuples directly
    for (i=0, n=r.length; i<n; ++i) {
      r[i][REM] = 1;
    }
    for (i=0, j=0, n=a.length; i<n; ++i) {
      if (!a[i][REM]) { x[j++] = a[i]; }
    }
    for (i=0, n=r.length; i<n; ++i) {
      delete r[i][REM];
    }
  }

  this._rem = [];
  return (this._add = x);
};

// memoizing statistics methods

proto.extent = function(get) {
  if (this._get !== get || !this._ext) {
    var v = this.values(),
        i = stats.extent.index(v, get);
    this._ext = [v[i[0]], v[i[1]]];
    this._get = get;
  }
  return this._ext;
};

proto.argmin = function(get) {
  return this.extent(get)[0];
};

proto.argmax = function(get) {
  return this.extent(get)[1];
};

proto.min = function(get) {
  var m = this.extent(get)[0];
  return m != null ? get(m) : +Infinity;
};

proto.max = function(get) {
  var m = this.extent(get)[1];
  return m != null ? get(m) : -Infinity;
};

proto.quartile = function(get) {
  if (this._get !== get || !this._q) {
    this._q = stats.quartile(this.values(), get);
    this._get = get;
  }
  return this._q;
};

proto.q1 = function(get) {
  return this.quartile(get)[0];
};

proto.q2 = function(get) {
  return this.quartile(get)[1];
};

proto.q3 = function(get) {
  return this.quartile(get)[2];
};

module.exports = Collector;

},{"../stats":29,"../util":32}],12:[function(require,module,exports){
var util = require('../util');
var Aggregator = require('./aggregator');

module.exports = function() {
  // flatten arguments into a single array
  var args = [].reduce.call(arguments, function(a, x) {
    return a.concat(util.array(x));
  }, []);
  // create and return an aggregator
  return new Aggregator()
    .groupby(args)
    .summarize({'*':'values'});
};

},{"../util":32,"./aggregator":10}],13:[function(require,module,exports){
var util = require('../util');

var types = {
  'values': measure({
    name: 'values',
    init: 'cell.collect = true;',
    set:  'cell.data.values()', idx: -1
  }),
  'count': measure({
    name: 'count',
    set:  'cell.num'
  }),
  'missing': measure({
    name: 'missing',
    set:  'this.missing'
  }),
  'valid': measure({
    name: 'valid',
    set:  'this.valid'
  }),
  'sum': measure({
    name: 'sum',
    init: 'this.sum = 0;',
    add:  'this.sum += v;',
    rem:  'this.sum -= v;',
    set:  'this.sum'
  }),
  'mean': measure({
    name: 'mean',
    init: 'this.mean = 0;',
    add:  'var d = v - this.mean; this.mean += d / this.valid;',
    rem:  'var d = v - this.mean; this.mean -= this.valid ? d / this.valid : this.mean;',
    set:  'this.mean'
  }),
  'average': measure({
    name: 'average',
    set:  'this.mean',
    req:  ['mean'], idx: 1
  }),
  'variance': measure({
    name: 'variance',
    init: 'this.dev = 0;',
    add:  'this.dev += d * (v - this.mean);',
    rem:  'this.dev -= d * (v - this.mean);',
    set:  'this.valid > 1 ? this.dev / (this.valid-1) : 0',
    req:  ['mean'], idx: 1
  }),
  'variancep': measure({
    name: 'variancep',
    set:  'this.valid > 1 ? this.dev / this.valid : 0',
    req:  ['variance'], idx: 2
  }),
  'stdev': measure({
    name: 'stdev',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / (this.valid-1)) : 0',
    req:  ['variance'], idx: 2
  }),
  'stdevp': measure({
    name: 'stdevp',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / this.valid) : 0',
    req:  ['variance'], idx: 2
  }),
  'stderr': measure({
    name: 'stderr',
    set:  'this.valid > 1 ? Math.sqrt(this.dev / (this.valid * (this.valid-1))) : 0',
    req:  ['variance'], idx: 2
  }),
  'median': measure({
    name: 'median',
    set:  'cell.data.q2(this.get)',
    req:  ['values'], idx: 3
  }),
  'q1': measure({
    name: 'q1',
    set:  'cell.data.q1(this.get)',
    req:  ['values'], idx: 3
  }),
  'q3': measure({
    name: 'q3',
    set:  'cell.data.q3(this.get)',
    req:  ['values'], idx: 3
  }),
  'distinct': measure({
    name: 'distinct',
    set:  'this.distinct(cell.data.values(), this.get)',
    req:  ['values'], idx: 3
  }),
  'argmin': measure({
    name: 'argmin',
    add:  'if (v < this.min) this.argmin = t;',
    rem:  'if (v <= this.min) this.argmin = null;',
    set:  'this.argmin = this.argmin || cell.data.argmin(this.get)',
    req:  ['min'], str: ['values'], idx: 3
  }),
  'argmax': measure({
    name: 'argmax',
    add:  'if (v > this.max) this.argmax = t;',
    rem:  'if (v >= this.max) this.argmax = null;',
    set:  'this.argmax = this.argmax || cell.data.argmax(this.get)',
    req:  ['max'], str: ['values'], idx: 3
  }),
  'min': measure({
    name: 'min',
    init: 'this.min = +Infinity;',
    add:  'if (v < this.min) this.min = v;',
    rem:  'if (v <= this.min) this.min = NaN;',
    set:  'this.min = (isNaN(this.min) ? cell.data.min(this.get) : this.min)',
    str:  ['values'], idx: 4
  }),
  'max': measure({
    name: 'max',
    init: 'this.max = -Infinity;',
    add:  'if (v > this.max) this.max = v;',
    rem:  'if (v >= this.max) this.max = NaN;',
    set:  'this.max = (isNaN(this.max) ? cell.data.max(this.get) : this.max)',
    str:  ['values'], idx: 4
  }),
  'modeskew': measure({
    name: 'modeskew',
    set:  'this.dev===0 ? 0 : (this.mean - cell.data.q2(this.get)) / Math.sqrt(this.dev/(this.valid-1))',
    req:  ['mean', 'variance', 'median'], idx: 5
  })
};

function measure(base) {
  return function(out) {
    var m = util.extend({init:'', add:'', rem:'', idx:0}, base);
    m.out = out || base.name;
    return m;
  };
}

function resolve(agg, stream) {
  function collect(m, a) {
    function helper(r) { if (!m[r]) collect(m, m[r] = types[r]()); }
    if (a.req) a.req.forEach(helper);
    if (stream && a.str) a.str.forEach(helper);
    return m;
  }
  var map = agg.reduce(
    collect,
    agg.reduce(function(m, a) { return (m[a.name] = a, m); }, {})
  );
  return util.vals(map).sort(function(a, b) { return a.idx - b.idx; });
}

function create(agg, stream, accessor, mutator) {
  var all = resolve(agg, stream),
      ctr = 'this.cell = cell; this.tuple = t; this.valid = 0; this.missing = 0;',
      add = 'if (v==null) this.missing++; if (!this.isValid(v)) return; ++this.valid;',
      rem = 'if (v==null) this.missing--; if (!this.isValid(v)) return; --this.valid;',
      set = 'var t = this.tuple; var cell = this.cell;';

  all.forEach(function(a) {
    if (a.idx < 0) {
      ctr = a.init + ctr;
      add = a.add + add;
      rem = a.rem + rem;
    } else {
      ctr += a.init;
      add += a.add;
      rem += a.rem;
    }
  });
  agg.slice()
    .sort(function(a, b) { return a.idx - b.idx; })
    .forEach(function(a) {
      set += 'this.assign(t,\''+a.out+'\','+a.set+');';
    });
  set += 'return t;';

  /* jshint evil: true */
  ctr = Function('cell', 't', ctr);
  ctr.prototype.assign = mutator;
  ctr.prototype.add = Function('t', 'var v = this.get(t);' + add);
  ctr.prototype.rem = Function('t', 'var v = this.get(t);' + rem);
  ctr.prototype.set = Function(set);
  ctr.prototype.get = accessor;
  ctr.prototype.distinct = require('../stats').count.distinct;
  ctr.prototype.isValid = util.isValid;
  ctr.fields = agg.map(util.$('out'));
  return ctr;
}

types.create = create;
module.exports = types;

},{"../stats":29,"../util":32}],14:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

function bins(opt) {
  if (!opt) { throw Error("Missing binning options."); }

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, level, minstep, precision, v, i, eps;

  if (opt.step) {
    // if step size is explicitly given, use that
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
      opt.steps.length - 1,
      bisect(opt.steps, span/maxb, 0, opt.steps.length)
    )];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = opt.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );

    // increase step size if too many bins
    while (Math.ceil(span/step) > maxb) { step *= base; }

    // decrease step size if allowed
    for (i=0; i<div.length; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop:  max,
    step:  step,
    unit:  {precision: precision},
    value: value,
    index: index
  };
}

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
}

function date_index(v) {
  return index.call(this, this.unit.unit(v));
}

bins.date = function(opt) {
  if (!opt) { throw Error("Missing date binning options."); }

  // find time step, then bin
  var units = opt.utc ? time.utc : time,
      dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin),
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      spec = bins({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  spec.unit = unit;
  spec.index = date_index;
  if (!opt.raw) spec.value = date_value;
  return spec;
};

module.exports = bins;

},{"../time":31,"../util":32}],15:[function(require,module,exports){
var bins = require('./bins'),
    gen  = require('../generate'),
    type = require('../import/type'),
    util = require('../util'),
    stats = require('../stats');

var qtype = {
  'integer': 1,
  'number': 1,
  'date': 1
};

function $bin(values, f, opt) {
  opt = options(values, f, opt);
  var b = spec(opt);
  return !b ? (opt.accessor || util.identity) :
    util.$func('bin', b.unit.unit ?
      function(x) { return b.value(b.unit.unit(x)); } :
      function(x) { return b.value(x); }
    )(opt.accessor);
}

function histogram(values, f, opt) {
  opt = options(values, f, opt);
  var b = spec(opt);
  return b ?
    numerical(values, opt.accessor, b) :
    categorical(values, opt.accessor, opt && opt.sort);
}

function spec(opt) {
  var t = opt.type, b = null;
  if (t == null || qtype[t]) {
    if (t === 'integer' && opt.minstep == null) opt.minstep = 1;
    b = (t === 'date') ? bins.date(opt) : bins(opt);
  }
  return b;
}

function options() {
  var a = arguments,
      i = 0,
      values = util.isArray(a[i]) ? a[i++] : null,
      f = util.isFunction(a[i]) || util.isString(a[i]) ? util.$(a[i++]) : null,
      opt = util.extend({}, a[i]);

  if (values) {
    opt.type = opt.type || type(values, f);
    if (qtype[opt.type]) {
      var ext = stats.extent(values, f);
      opt = util.extend({min: ext[0], max: ext[1]}, opt);
    }
  }
  if (f) { opt.accessor = f; }
  return opt;
}

function numerical(values, f, b) {
  var h = gen.range(b.start, b.stop + b.step/2, b.step)
    .map(function(v) { return {value: b.value(v), count: 0}; });

  for (var i=0, v, j; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      j = b.index(v);
      if (j < 0 || j >= h.length || !isFinite(j)) continue;
      h[j].count += 1;
    }
  }
  h.bins = b;
  return h;
}

function categorical(values, f, sort) {
  var u = stats.unique(values, f),
      c = stats.count.map(values, f);
  return u.map(function(k) { return {value: k, count: c[k]}; })
    .sort(util.comparator(sort ? '-count' : '+value'));
}

module.exports = {
  $bin: $bin,
  histogram: histogram
};

},{"../generate":18,"../import/type":27,"../stats":29,"../util":32,"./bins":14}],16:[function(require,module,exports){
var util = require('./util'),
    type = require('./import/type'),
    stats = require('./stats'),
    template = require('./template');

module.exports = {
  table:   formatTable,  // format a data table
  summary: formatSummary // format a data table summary
};

var FMT = {
  'date':    '|time:"%m/%d/%Y %H:%M:%S"',
  'number':  '|number:".4f"',
  'integer': '|number:"d"'
};

var POS = {
  'number':  'left',
  'integer': 'left'
};

function formatTable(data, opt) {
  opt = util.extend({separator:' ', minwidth: 8, maxwidth: 15}, opt);
  var fields = opt.fields || util.keys(data[0]),
      types = type.all(data);

  if (opt.start || opt.limit) {
    var a = opt.start || 0,
        b = opt.limit ? a + opt.limit : data.length;
    data = data.slice(a, b);
  }

  // determine char width of fields
  var lens = fields.map(function(name) {
    var format = FMT[types[name]] || '',
        t = template('{{' + name + format + '}}'),
        l = stats.max(data, function(x) { return t(x).length; });
    l = Math.max(Math.min(name.length, opt.minwidth), l);
    return opt.maxwidth > 0 ? Math.min(l, opt.maxwidth) : l;
  });

  // print header row
  var head = fields.map(function(name, i) {
    return util.truncate(util.pad(name, lens[i], 'center'), lens[i]);
  }).join(opt.separator);

  // build template function for each row
  var tmpl = template(fields.map(function(name, i) {
    return '{{' +
      name +
      (FMT[types[name]] || '') +
      ('|pad:' + lens[i] + ',' + (POS[types[name]] || 'right')) +
      ('|truncate:' + lens[i]) +
    '}}';
  }).join(opt.separator));

  // print table
  return head + "\n" + data.map(tmpl).join('\n');
}

function formatSummary(s) {
  s = s ? s.__summary__ ? s : stats.summary(s) : this;
  var str = [], i, n;
  for (i=0, n=s.length; i<n; ++i) {
    str.push('-- ' + s[i].field + ' --');
    if (s[i].type === 'string' || s[i].distinct < 10) {
      str.push(printCategoricalProfile(s[i]));
    } else {
      str.push(printQuantitativeProfile(s[i]));
    }
    str.push('');
  }
  return str.join('\n');
}

function printQuantitativeProfile(p) {
  return [
    'valid:    ' + p.valid,
    'missing:  ' + p.missing,
    'distinct: ' + p.distinct,
    'min:      ' + p.min,
    'max:      ' + p.max,
    'median:   ' + p.median,
    'mean:     ' + p.mean,
    'stdev:    ' + p.stdev,
    'modeskew: ' + p.modeskew
  ].join('\n');
}

function printCategoricalProfile(p) {
  var list = [
    'valid:    ' + p.valid,
    'missing:  ' + p.missing,
    'distinct: ' + p.distinct,
    'top values: '
  ];
  var u = p.unique;
  var top = util.keys(u)
    .sort(function(a,b) { return u[b] - u[a]; })
    .slice(0, 6)
    .map(function(v) { return ' \'' + v + '\' (' + u[v] + ')'; });
  return list.concat(top).join('\n');
}
},{"./import/type":27,"./stats":29,"./template":30,"./util":32}],17:[function(require,module,exports){
var util = require('./util'),
    d3_time = require('d3-time'),
    d3_timeF = require('d3-time-format'),
    d3_numberF = require('d3-format'),
    numberF = d3_numberF, // defaults to EN-US
    timeF = d3_timeF,     // defaults to EN-US
    tmpDate = new Date(2000, 0, 1),
    monthFull, monthAbbr, dayFull, dayAbbr;


module.exports = {
  // Update number formatter to use provided locale configuration.
  // For more see https://github.com/d3/d3-format
  numberLocale: numberLocale,
  number:       function(f) { return numberF.format(f); },
  numberPrefix: function(f, v) { return numberF.formatPrefix(f, v); },

  // Update time formatter to use provided locale configuration.
  // For more see https://github.com/d3/d3-time-format
  timeLocale:   timeLocale,
  time:         function(f) { return timeF.format(f); },
  utc:          function(f) { return timeF.utcFormat(f); },

  // Set number and time locale simultaneously.
  locale:       function(l) { numberLocale(l); timeLocale(l); },

  // automatic formatting functions
  auto: {
    number:   autoNumberFormat,
    linear:   linearNumberFormat,
    time:     function() { return timeAutoFormat(); },
    utc:      function() { return utcAutoFormat(); }
  },

  month:      monthFormat,      // format month name from integer code
  day:        dayFormat,        // format week day name from integer code
  quarter:    quarterFormat,    // format quarter name from timestamp
  utcQuarter: utcQuarterFormat  // format quarter name from utc timestamp
};

// -- Locales ----

// transform 'en-US' style locale string to match d3-format v0.4+ convention
function localeRef(l) {
  return l.length > 4 && 'locale' + (
    l[0].toUpperCase() + l[1].toLowerCase() +
    l[3].toUpperCase() + l[4].toLowerCase()
  );
}

function numberLocale(l) {
  var f = util.isString(l) ? d3_numberF[localeRef(l)] : d3_numberF.locale(l);
  if (f == null) throw Error('Unrecognized locale: ' + l);
  numberF = f;
}

function timeLocale(l) {
  var f = util.isString(l) ? d3_timeF[localeRef(l)] : d3_timeF.locale(l);
  if (f == null) throw Error('Unrecognized locale: ' + l);
  timeF = f;
  monthFull = monthAbbr = dayFull = dayAbbr = null;
}

// -- Number Formatting ----

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function linearRange(domain, count) {
  if (!domain.length) domain = [0];
  if (count == null) count = 10;

  var start = domain[0],
      stop = domain[domain.length - 1];

  if (stop < start) { error = stop; stop = start; start = error; }

  var span = (stop - start) || (count = 1, start || stop || 1),
      step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
      error = span / count / step;

  // Filter ticks to get closer to the desired count.
  if (error >= e10) step *= 10;
  else if (error >= e5) step *= 5;
  else if (error >= e2) step *= 2;

  // Round start and stop values to step interval.
  return [
    Math.ceil(start / step) * step,
    Math.floor(stop / step) * step + step / 2, // inclusive
    step
  ];
}

function trimZero(f, decimal) {
  return function(x) {
    var s = f(x),
        n = s.indexOf(decimal);
    if (n < 0) return s;

    var idx = rightmostDigit(s, n),
        end = idx < s.length ? s.slice(idx) : '';

    while (--idx > n) {
      if (s[idx] !== '0') { ++idx; break; }
    }
    return s.slice(0, idx) + end;
  };
}

function rightmostDigit(s, n) {
  var i = s.lastIndexOf('e'), c;
  if (i > 0) return i;
  for (i=s.length; --i > n;) {
    c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) return i+1; // is digit
  }
}

function autoNumberFormat(f) {
  var decimal = numberF.format('.1f')(1)[1]; // get decimal char
  if (f == null) f = ',';
  f = d3_numberF.formatSpecifier(f);
  if (f.precision == null) f.precision = 12;
  switch (f.type) {
    case '%': f.precision -= 2; break;
    case 'e': f.precision -= 1; break;
  }
  return trimZero(numberF.format(f), decimal);
}

function linearNumberFormat(domain, count, f) {
  var range = linearRange(domain, count);

  if (f == null) f = ',f';

  switch (f = d3_numberF.formatSpecifier(f), f.type) {
    case 's': {
      var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
      if (f.precision == null) f.precision = d3_numberF.precisionPrefix(range[2], value);
      return numberF.formatPrefix(f, value);
    }
    case '':
    case 'e':
    case 'g':
    case 'p':
    case 'r': {
      if (f.precision == null) f.precision = d3_numberF.precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (f.type === 'e');
      break;
    }
    case 'f':
    case '%': {
      if (f.precision == null) f.precision = d3_numberF.precisionFixed(range[2]) - 2 * (f.type === '%');
      break;
    }
  }
  return numberF.format(f);
}

// -- Datetime Formatting ----

function timeAutoFormat() {
  var f = timeF.format,
      formatMillisecond = f('.%L'),
      formatSecond = f(':%S'),
      formatMinute = f('%I:%M'),
      formatHour = f('%I %p'),
      formatDay = f('%a %d'),
      formatWeek = f('%b %d'),
      formatMonth = f('%B'),
      formatYear = f('%Y');

  return function(date) {
    var d = +date;
    return (d3_time.second(date) < d ? formatMillisecond
        : d3_time.minute(date) < d ? formatSecond
        : d3_time.hour(date) < d ? formatMinute
        : d3_time.day(date) < d ? formatHour
        : d3_time.month(date) < d ?
          (d3_time.week(date) < d ? formatDay : formatWeek)
        : d3_time.year(date) < d ? formatMonth
        : formatYear)(date);
  };
}

function utcAutoFormat() {
  var f = timeF.utcFormat,
      formatMillisecond = f('.%L'),
      formatSecond = f(':%S'),
      formatMinute = f('%I:%M'),
      formatHour = f('%I %p'),
      formatDay = f('%a %d'),
      formatWeek = f('%b %d'),
      formatMonth = f('%B'),
      formatYear = f('%Y');

  return function(date) {
    var d = +date;
    return (d3_time.utcSecond(date) < d ? formatMillisecond
        : d3_time.utcMinute(date) < d ? formatSecond
        : d3_time.utcHour(date) < d ? formatMinute
        : d3_time.utcDay(date) < d ? formatHour
        : d3_time.utcMonth(date) < d ?
          (d3_time.utcWeek(date) < d ? formatDay : formatWeek)
        : d3_time.utcYear(date) < d ? formatMonth
        : formatYear)(date);
  };
}

function monthFormat(month, abbreviate) {
  var f = abbreviate ?
    (monthAbbr || (monthAbbr = timeF.format('%b'))) :
    (monthFull || (monthFull = timeF.format('%B')));
  return (tmpDate.setMonth(month), f(tmpDate));
}

function dayFormat(day, abbreviate) {
  var f = abbreviate ?
    (dayAbbr || (dayAbbr = timeF.format('%a'))) :
    (dayFull || (dayFull = timeF.format('%A')));
  return (tmpDate.setMonth(0), tmpDate.setDate(2 + day), f(tmpDate));
}

function quarterFormat(date) {
  return Math.floor(date.getMonth() / 3) + 1;
}

function utcQuarterFormat(date) {
  return Math.floor(date.getUTCMonth() / 3) + 1;
}

},{"./util":32,"d3-format":4,"d3-time":7,"d3-time-format":6}],18:[function(require,module,exports){
var util = require('./util'),
    gen = module.exports;

gen.repeat = function(val, n) {
  var a = Array(n), i;
  for (i=0; i<n; ++i) a[i] = val;
  return a;
};

gen.zeros = function(n) {
  return gen.repeat(0, n);
};

gen.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

gen.random = {};

gen.random.uniform = function(min, max) {
  if (max === undefined) {
    max = min === undefined ? 1 : min;
    min = 0;
  }
  var d = max - min;
  var f = function() {
    return min + d * Math.random();
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x >= min && x <= max) ? 1/d : 0;
  };
  f.cdf = function(x) {
    return x < min ? 0 : x > max ? 1 : (x - min) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? min + p*d : NaN;
  };
  return f;
};

gen.random.integer = function(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  var d = b - a;
  var f = function() {
    return a + Math.floor(d * Math.random());
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
  };
  f.cdf = function(x) {
    var v = Math.floor(x);
    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
  };
  return f;
};

gen.random.normal = function(mean, stdev) {
  mean = mean || 0;
  stdev = stdev || 1;
  var next;
  var f = function() {
    var x = 0, y = 0, rds, c;
    if (next !== undefined) {
      x = next;
      next = undefined;
      return x;
    }
    do {
      x = Math.random()*2-1;
      y = Math.random()*2-1;
      rds = x*x + y*y;
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
    next = mean + y*c*stdev;
    return mean + x*c*stdev;
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
    return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
  };
  f.cdf = function(x) {
    // Approximation from West (2009)
    // Better Approximations to Cumulative Normal Functions
    var cd,
        z = (x - mean) / stdev,
        Z = Math.abs(z);
    if (Z > 37) {
      cd = 0;
    } else {
      var sum, exp = Math.exp(-Z*Z/2);
      if (Z < 7.07106781186547) {
        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
        sum = sum * Z + 6.37396220353165;
        sum = sum * Z + 33.912866078383;
        sum = sum * Z + 112.079291497871;
        sum = sum * Z + 221.213596169931;
        sum = sum * Z + 220.206867912376;
        cd = exp * sum;
        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
        sum = sum * Z + 16.064177579207;
        sum = sum * Z + 86.7807322029461;
        sum = sum * Z + 296.564248779674;
        sum = sum * Z + 637.333633378831;
        sum = sum * Z + 793.826512519948;
        sum = sum * Z + 440.413735824752;
        cd = cd / sum;
      } else {
        sum = Z + 0.65;
        sum = Z + 4 / sum;
        sum = Z + 3 / sum;
        sum = Z + 2 / sum;
        sum = Z + 1 / sum;
        cd = exp / sum / 2.506628274631;
      }
    }
    return z > 0 ? 1 - cd : cd;
  };
  f.icdf = function(p) {
    // Approximation of Probit function using inverse error function.
    if (p <= 0 || p >= 1) return NaN;
    var x = 2*p - 1,
        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
        b = Math.log(1 - (x*x)) / v,
        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
    return mean + stdev * Math.SQRT2 * s;
  };
  return f;
};

gen.random.bootstrap = function(domain, smooth) {
  // Generates a bootstrap sample from a set of observations.
  // Smooth bootstrapping adds random zero-centered noise to the samples.
  var val = domain.filter(util.isValid),
      len = val.length,
      err = smooth ? gen.random.normal(0, smooth) : null;
  var f = function() {
    return val[~~(Math.random()*len)] + (err ? err() : 0);
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  return f;
};
},{"./util":32}],19:[function(require,module,exports){
var util = require('../../util');
var d3_dsv = require('d3-dsv');

function dsv(data, format) {
  if (data) {
    var h = format.header;
    data = (h ? h.join(format.delimiter) + '\n' : '') + data;
  }
  return d3_dsv.dsv(format.delimiter).parse(data);
}

dsv.delimiter = function(delim) {
  var fmt = {delimiter: delim};
  return function(data, format) {
    return dsv(data, format ? util.extend(format, fmt) : fmt);
  };
};

module.exports = dsv;

},{"../../util":32,"d3-dsv":3}],20:[function(require,module,exports){
var dsv = require('./dsv');

module.exports = {
  json: require('./json'),
  topojson: require('./topojson'),
  treejson: require('./treejson'),
  dsv: dsv,
  csv: dsv.delimiter(','),
  tsv: dsv.delimiter('\t')
};

},{"./dsv":19,"./json":21,"./topojson":22,"./treejson":23}],21:[function(require,module,exports){
var util = require('../../util');

module.exports = function(data, format) {
  var d = util.isObject(data) && !util.isBuffer(data) ?
    data : JSON.parse(data);
  if (format && format.property) {
    d = util.accessor(format.property)(d);
  }
  return d;
};

},{"../../util":32}],22:[function(require,module,exports){
var json = require('./json');

var reader = function(data, format) {
  var topojson = reader.topojson;
  if (topojson == null) { throw Error('TopoJSON library not loaded.'); }

  var t = json(data, format), obj;

  if (format && format.feature) {
    if ((obj = t.objects[format.feature])) {
      return topojson.feature(t, obj).features;
    } else {
      throw Error('Invalid TopoJSON object: ' + format.feature);
    }
  } else if (format && format.mesh) {
    if ((obj = t.objects[format.mesh])) {
      return [topojson.mesh(t, t.objects[format.mesh])];
    } else {
      throw Error('Invalid TopoJSON object: ' + format.mesh);
    }
  } else {
    throw Error('Missing TopoJSON feature or mesh parameter.');
  }
};

reader.topojson = require('topojson');
module.exports = reader;

},{"./json":21,"topojson":37}],23:[function(require,module,exports){
var json = require('./json');

module.exports = function(tree, format) {
  return toTable(json(tree, format), format);
};

function toTable(root, fields) {
  var childrenField = fields && fields.children || 'children',
      parentField = fields && fields.parent || 'parent',
      table = [];

  function visit(node, parent) {
    node[parentField] = parent;
    table.push(node);
    var children = node[childrenField];
    if (children) {
      for (var i=0; i<children.length; ++i) {
        visit(children[i], node);
      }
    }
  }

  visit(root, null);
  return (table.root = root, table);
}

},{"./json":21}],24:[function(require,module,exports){
var util = require('../util');

// Matches absolute URLs with optional protocol
//   https://...    file://...    //...
var protocol_re = /^([A-Za-z]+:)?\/\//;

// Special treatment in node.js for the file: protocol
var fileProtocol = 'file://';

// Validate and cleanup URL to ensure that it is allowed to be accessed
// Returns cleaned up URL, or false if access is not allowed
function sanitizeUrl(opt) {
  var url = opt.url;
  if (!url && opt.file) { return fileProtocol + opt.file; }

  // In case this is a relative url (has no host), prepend opt.baseURL
  if (opt.baseURL && !protocol_re.test(url)) {
    if (!startsWith(url, '/') && opt.baseURL[opt.baseURL.length-1] !== '/') {
      url = '/' + url; // Ensure that there is a slash between the baseURL (e.g. hostname) and url
    }
    url = opt.baseURL + url;
  }
  // relative protocol, starts with '//'
  if (!load.useXHR && startsWith(url, '//')) {
    url = (opt.defaultProtocol || 'http') + ':' + url;
  }
  // If opt.domainWhiteList is set, only allows url, whose hostname
  // * Is the same as the origin (window.location.hostname)
  // * Equals one of the values in the whitelist
  // * Is a proper subdomain of one of the values in the whitelist
  if (opt.domainWhiteList) {
    var domain, origin;
    if (load.useXHR) {
      var a = document.createElement('a');
      a.href = url;
      // From http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
      // IE doesn't populate all link properties when setting .href with a relative URL,
      // however .href will return an absolute URL which then can be used on itself
      // to populate these additional fields.
      if (a.host === '') {
        a.href = a.href;
      }
      domain = a.hostname.toLowerCase();
      origin = window.location.hostname;
    } else {
      // relative protocol is broken: https://github.com/defunctzombie/node-url/issues/5
      var parts = require('url').parse(url);
      domain = parts.hostname;
      origin = null;
    }

    if (origin !== domain) {
      var whiteListed = opt.domainWhiteList.some(function(d) {
        var idx = domain.length - d.length;
        return d === domain ||
          (idx > 1 && domain[idx-1] === '.' && domain.lastIndexOf(d) === idx);
      });
      if (!whiteListed) {
        throw 'URL is not whitelisted: ' + url;
      }
    }
  }
  return url;
}

function load(opt, callback) {
  return load.loader(opt, callback);
}

function loader(opt, callback) {
  var error = callback || function(e) { throw e; }, url;

  try {
    url = load.sanitizeUrl(opt); // enable override
  } catch (err) {
    error(err);
    return;
  }

  if (!url) {
    error('Invalid URL: ' + opt.url);
  } else if (load.useXHR) {
    // on client, use xhr
    return load.xhr(url, opt, callback);
  } else if (startsWith(url, fileProtocol)) {
    // on server, if url starts with 'file://', strip it and load from file
    return load.file(url.slice(fileProtocol.length), opt, callback);
  } else if (url.indexOf('://') < 0) { // TODO better protocol check?
    // on server, if no protocol assume file
    return load.file(url, opt, callback);
  } else {
    // for regular URLs on server
    return load.http(url, opt, callback);
  }
}

function xhrHasResponse(request) {
  var type = request.responseType;
  return type && type !== 'text' ?
    request.response : // null on error
    request.responseText; // '' on error
}

function xhr(url, opt, callback) {
  var async = !!callback;
  var request = new XMLHttpRequest();
  // If IE does not support CORS, use XDomainRequest (copied from d3.xhr)
  if (typeof XDomainRequest !== 'undefined' &&
      !('withCredentials' in request) &&
      /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();

  function respond() {
    var status = request.status;
    if (!status && xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
      callback(null, request.responseText);
    } else {
      callback(request, null);
    }
  }

  if (async) {
    if ('onload' in request) {
      request.onload = request.onerror = respond;
    } else {
      request.onreadystatechange = function() {
        if (request.readyState > 3) respond();
      };
    }
  }

  request.open('GET', url, async);
  /* istanbul ignore else */
  if (request.setRequestHeader) {
    var headers = util.extend({}, load.headers, opt.headers);
    for (var name in headers) {
      request.setRequestHeader(name, headers[name]);
    }
  }
  request.send();

  if (!async && xhrHasResponse(request)) {
    return request.responseText;
  }
}

function file(filename, opt, callback) {
  var fs = require('fs');
  if (!callback) {
    return fs.readFileSync(filename, 'utf8');
  }
  fs.readFile(filename, callback);
}

function http(url, opt, callback) {
  var headers = util.extend({}, load.headers, opt.headers);

  var options = {url: url, encoding: null, gzip: true, headers: headers};
  if (!callback) {
    return require('sync-request')('GET', url, options).getBody();
  }
  require('request')(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, body);
    } else {
      error = error ||
        'Load failed with response code ' + response.statusCode + '.';
      callback(error, null);
    }
  });
}

function startsWith(string, searchString) {
  return string == null ? false : string.lastIndexOf(searchString, 0) === 0;
}

// Allow these functions to be overriden by the user of the library
load.loader = loader;
load.sanitizeUrl = sanitizeUrl;
load.xhr = xhr;
load.file = file;
load.http = http;

// Default settings
load.useXHR = (typeof XMLHttpRequest !== 'undefined');
load.headers = {};

module.exports = load;

},{"../util":32,"fs":1,"request":1,"sync-request":1,"url":1}],25:[function(require,module,exports){
var util = require('../util'),
  type = require('./type'),
  formats = require('./formats'),
  timeF = require('../format').time;

function read(data, format) {
  var type = (format && format.type) || 'json';
  data = formats[type](data, format);
  if (format && format.parse) parse(data, format.parse);
  return data;
}

function parse(data, types) {
  var cols, parsers, d, i, j, clen, len = data.length;

  types = (types==='auto') ? type.inferAll(data) : util.duplicate(types);
  cols = util.keys(types);
  parsers = cols.map(function(c) {
    var t = types[c];
    if (t && t.indexOf('date:') === 0) {
      var parts = t.split(/:(.+)?/, 2),  // split on first :
          pattern = parts[1];
      if ((pattern[0] === '\'' && pattern[pattern.length-1] === '\'') ||
          (pattern[0] === '"'  && pattern[pattern.length-1] === '"')) {
        pattern = pattern.slice(1, -1);
      } else {
        throw Error('Format pattern must be quoted: ' + pattern);
      }
      pattern = timeF(pattern);
      return function(v) { return pattern.parse(v); };
    }
    if (!type.parsers[t]) {
      throw Error('Illegal format pattern: ' + c + ':' + t);
    }
    return type.parsers[t];
  });

  for (i=0, clen=cols.length; i<len; ++i) {
    d = data[i];
    for (j=0; j<clen; ++j) {
      d[cols[j]] = parsers[j](d[cols[j]]);
    }
  }
  type.annotation(data, types);
}

read.formats = formats;
module.exports = read;

},{"../format":17,"../util":32,"./formats":20,"./type":27}],26:[function(require,module,exports){
var util = require('../util');
var load = require('./load');
var read = require('./read');

module.exports = util
  .keys(read.formats)
  .reduce(function(out, type) {
    out[type] = function(opt, format, callback) {
      // process arguments
      if (util.isString(opt)) { opt = {url: opt}; }
      if (arguments.length === 2 && util.isFunction(format)) {
        callback = format;
        format = undefined;
      }

      // set up read format
      format = util.extend({parse: 'auto'}, format);
      format.type = type;

      // load data
      var data = load(opt, callback ? function(error, data) {
        if (error) { callback(error, null); return; }
        try {
          // data loaded, now parse it (async)
          data = read(data, format);
          callback(null, data);
        } catch (e) {
          callback(e, null);
        }
      } : undefined);

      // data loaded, now parse it (sync)
      if (!callback) return read(data, format);
    };
    return out;
  }, {});

},{"../util":32,"./load":24,"./read":25}],27:[function(require,module,exports){
var util = require('../util');

var TYPES = '__types__';

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  function(x) { return x == null || x === '' ? null : x + ''; }
};

var TESTS = {
  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
  date: function(x) { return !isNaN(Date.parse(x)); }
};

function annotation(data, types) {
  if (!types) return data && data[TYPES] || null;
  data[TYPES] = types;
}

function fieldNames(datum) {
  return util.keys(datum);
}

function bracket(fieldName) {
  return '[' + fieldName + ']';
}

function type(values, f) {
  values = util.array(values);
  f = util.$(f);
  var v, i, n;

  // if data array has type annotations, use them
  if (values[TYPES]) {
    v = f(values[TYPES]);
    if (util.isString(v)) return v;
  }

  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
    v = f ? f(values[i]) : values[i];
  }

  return util.isDate(v) ? 'date' :
    util.isNumber(v)    ? 'number' :
    util.isBoolean(v)   ? 'boolean' :
    util.isString(v)    ? 'string' : null;
}

function typeAll(data, fields) {
  if (!data.length) return;
  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
  return fields.reduce(function(types, f) {
    return (types[f] = type(data, get(f)), types);
  }, {});
}

function infer(values, f) {
  values = util.array(values);
  f = util.$(f);
  var i, j, v;

  // types to test for, in precedence order
  var types = ['boolean', 'integer', 'number', 'date'];

  for (i=0; i<values.length; ++i) {
    // get next value to test
    v = f ? f(values[i]) : values[i];
    // test value against remaining types
    for (j=0; j<types.length; ++j) {
      if (util.isValid(v) && !TESTS[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    // if no types left, return 'string'
    if (types.length === 0) return 'string';
  }

  return types[0];
}

function inferAll(data, fields) {
  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
  return fields.reduce(function(types, f) {
    types[f] = infer(data, get(f));
    return types;
  }, {});
}

type.annotation = annotation;
type.all = typeAll;
type.infer = infer;
type.inferAll = inferAll;
type.parsers = PARSERS;
module.exports = type;

},{"../util":32}],28:[function(require,module,exports){
var util = require('./util');

var dl = {
  version:    require('../package.json').version,
  load:       require('./import/load'),
  read:       require('./import/read'),
  type:       require('./import/type'),
  Aggregator: require('./aggregate/aggregator'),
  groupby:    require('./aggregate/groupby'),
  bins:       require('./bins/bins'),
  $bin:       require('./bins/histogram').$bin,
  histogram:  require('./bins/histogram').histogram,
  format:     require('./format'),
  template:   require('./template'),
  time:       require('./time')
};

util.extend(dl, util);
util.extend(dl, require('./accessor'));
util.extend(dl, require('./generate'));
util.extend(dl, require('./stats'));
util.extend(dl, require('./import/readers'));
util.extend(dl.format, require('./format-tables'));

// backwards-compatible, deprecated API
// will remove in the future
dl.print = {
  table:   dl.format.table,
  summary: dl.format.summary
};

module.exports = dl;

},{"../package.json":8,"./accessor":9,"./aggregate/aggregator":10,"./aggregate/groupby":12,"./bins/bins":14,"./bins/histogram":15,"./format":17,"./format-tables":16,"./generate":18,"./import/load":24,"./import/read":25,"./import/readers":26,"./import/type":27,"./stats":29,"./template":30,"./time":31,"./util":32}],29:[function(require,module,exports){
var util = require('./util');
var type = require('./import/type');
var gen = require('./generate');

var stats = module.exports;

// Collect unique values.
// Output: an array of unique values, in first-observed order
stats.unique = function(values, f, results) {
  f = util.$(f);
  results = results || [];
  var u = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    results.push(v);
  }
  return results;
};

// Return the length of the input array.
stats.count = function(values) {
  return values && values.length || 0;
};

// Count the number of non-null, non-undefined, non-NaN values.
stats.count.valid = function(values, f) {
  f = util.$(f);
  var v, i, n, valid = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) valid += 1;
  }
  return valid;
};

// Count the number of null or undefined values.
stats.count.missing = function(values, f) {
  f = util.$(f);
  var v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

// Count the number of distinct values.
// Null, undefined and NaN are each considered distinct values.
stats.count.distinct = function(values, f) {
  f = util.$(f);
  var u = {}, v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// Construct a map from distinct values to occurrence counts.
stats.count.map = function(values, f) {
  f = util.$(f);
  var map = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    map[v] = (v in map) ? map[v] + 1 : 1;
  }
  return map;
};

// Compute the median of an array of numbers.
stats.median = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  return stats.quantile(values, 0.5);
};

// Computes the quartile boundaries of an array of numbers.
stats.quartile = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  var q = stats.quantile;
  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
};

// Compute the quantile of a sorted array of numbers.
// Adapted from the D3.js implementation.
stats.quantile = function(values, f, p) {
  if (p === undefined) { p = f; f = util.identity; }
  f = util.$(f);
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +f(values[h - 1]),
      e = H - h;
  return e ? v + e * (f(values[h]) - v) : v;
};

// Compute the sum of an array of numbers.
stats.sum = function(values, f) {
  f = util.$(f);
  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) sum += v;
  }
  return sum;
};

// Compute the mean (average) of an array of numbers.
stats.mean = function(values, f) {
  f = util.$(f);
  var mean = 0, delta, i, n, c, v;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

// Compute the geometric mean of an array of numbers.
stats.mean.geometric = function(values, f) {
  f = util.$(f);
  var mean = 1, c, n, v, i;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v <= 0) {
        throw Error("Geometric mean only defined for positive values.");
      }
      mean *= v;
      ++c;
    }
  }
  mean = c > 0 ? Math.pow(mean, 1/c) : 0;
  return mean;
};

// Compute the harmonic mean of an array of numbers.
stats.mean.harmonic = function(values, f) {
  f = util.$(f);
  var mean = 0, c, n, v, i;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      mean += 1/v;
      ++c;
    }
  }
  return c / mean;
};

// Compute the sample variance of an array of numbers.
stats.variance = function(values, f) {
  f = util.$(f);
  if (!util.isArray(values) || values.length < 2) return 0;
  var mean = 0, M2 = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (c - 1);
  return M2;
};

// Compute the sample standard deviation of an array of numbers.
stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
stats.modeskew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return std === 0 ? 0 : (avg - med) / std;
};

// Find the minimum value in an array.
stats.min = function(values, f) {
  return stats.extent(values, f)[0];
};

// Find the maximum value in an array.
stats.max = function(values, f) {
  return stats.extent(values, f)[1];
};

// Find the minimum and maximum of an array of values.
stats.extent = function(values, f) {
  f = util.$(f);
  var a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) a = v;
      if (v > b) b = v;
    }
  }
  return [a, b];
};

// Find the integer indices of the minimum and maximum values.
stats.extent.index = function(values, f) {
  f = util.$(f);
  var x = -1, y = -1, a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) { a = v; x = i; }
      if (v > b) { b = v; y = i; }
    }
  }
  return [x, y];
};

// Compute the dot product of two arrays of numbers.
stats.dot = function(values, a, b) {
  var sum = 0, i, v;
  if (!b) {
    if (values.length !== a.length) {
      throw Error('Array lengths must match.');
    }
    for (i=0; i<values.length; ++i) {
      v = values[i] * a[i];
      if (v === v) sum += v;
    }
  } else {
    a = util.$(a);
    b = util.$(b);
    for (i=0; i<values.length; ++i) {
      v = a(values[i]) * b(values[i]);
      if (v === v) sum += v;
    }
  }
  return sum;
};

// Compute the vector distance between two arrays of numbers.
// Default is Euclidean (exp=2) distance, configurable via exp argument.
stats.dist = function(values, a, b, exp) {
  var f = util.isFunction(b) || util.isString(b),
      X = values,
      Y = f ? values : a,
      e = f ? exp : b,
      L2 = e === 2 || e == null,
      n = values.length, s = 0, d, i;
  if (f) {
    a = util.$(a);
    b = util.$(b);
  }
  for (i=0; i<n; ++i) {
    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
    s += L2 ? d*d : Math.pow(Math.abs(d), e);
  }
  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
};

// Compute the Cohen's d effect size between two arrays of numbers.
stats.cohensd = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      x1 = stats.mean(X),
      x2 = stats.mean(Y),
      n1 = stats.count.valid(X),
      n2 = stats.count.valid(Y);

  if ((n1+n2-2) <= 0) {
    // if both arrays are size 1, or one is empty, there's no effect size
    return 0;
  }
  // pool standard deviation
  var s1 = stats.variance(X),
      s2 = stats.variance(Y),
      s = Math.sqrt((((n1-1)*s1) + ((n2-1)*s2)) / (n1+n2-2));
  // if there is no variance, there's no effect size
  return s===0 ? 0 : (x1 - x2) / s;
};

// Computes the covariance between two arrays of numbers
stats.covariance = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n = X.length,
      xm = stats.mean(X),
      ym = stats.mean(Y),
      sum = 0, c = 0, i, x, y, vx, vy;

  if (n !== Y.length) {
    throw Error('Input lengths must match.');
  }

  for (i=0; i<n; ++i) {
    x = X[i]; vx = util.isValid(x);
    y = Y[i]; vy = util.isValid(y);
    if (vx && vy) {
      sum += (x-xm) * (y-ym);
      ++c;
    } else if (vx || vy) {
      throw Error('Valid values must align.');
    }
  }
  return sum / (c-1);
};

// Compute ascending rank scores for an array of values.
// Ties are assigned their collective mean rank.
stats.rank = function(values, f) {
  f = util.$(f) || util.identity;
  var a = values.map(function(v, i) {
      return {idx: i, val: f(v)};
    })
    .sort(util.comparator('val'));

  var n = values.length,
      r = Array(n),
      tie = -1, p = {}, i, v, mu;

  for (i=0; i<n; ++i) {
    v = a[i].val;
    if (tie < 0 && p === v) {
      tie = i - 1;
    } else if (tie > -1 && p !== v) {
      mu = 1 + (i-1 + tie) / 2;
      for (; tie<i; ++tie) r[a[tie].idx] = mu;
      tie = -1;
    }
    r[a[i].idx] = i + 1;
    p = v;
  }

  if (tie > -1) {
    mu = 1 + (n-1 + tie) / 2;
    for (; tie<n; ++tie) r[a[tie].idx] = mu;
  }

  return r;
};

// Compute the sample Pearson product-moment correlation of two arrays of numbers.
stats.cor = function(values, a, b) {
  var fn = b;
  b = fn ? values.map(util.$(b)) : a;
  a = fn ? values.map(util.$(a)) : values;

  var dot = stats.dot(a, b),
      mua = stats.mean(a),
      mub = stats.mean(b),
      sda = stats.stdev(a),
      sdb = stats.stdev(b),
      n = values.length;

  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
};

// Compute the Spearman rank correlation of two arrays of values.
stats.cor.rank = function(values, a, b) {
  var ra = b ? stats.rank(values, a) : stats.rank(values),
      rb = b ? stats.rank(values, b) : stats.rank(a),
      n = values.length, i, s, d;

  for (i=0, s=0; i<n; ++i) {
    d = ra[i] - rb[i];
    s += d * d;
  }

  return 1 - 6*s / (n * (n*n-1));
};

// Compute the distance correlation of two arrays of numbers.
// http://en.wikipedia.org/wiki/Distance_correlation
stats.cor.dist = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a;

  var A = stats.dist.mat(X),
      B = stats.dist.mat(Y),
      n = A.length,
      i, aa, bb, ab;

  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
    aa += A[i]*A[i];
    bb += B[i]*B[i];
    ab += A[i]*B[i];
  }

  return Math.sqrt(ab / Math.sqrt(aa*bb));
};

// Simple linear regression.
// Returns a "fit" object with slope (m), intercept (b),
// r value (R), and sum-squared residual error (rss).
stats.linearRegression = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n = X.length,
      xy = stats.covariance(X, Y), // will throw err if valid vals don't align
      sx = stats.stdev(X),
      sy = stats.stdev(Y),
      slope = xy / (sx*sx),
      icept = stats.mean(Y) - slope * stats.mean(X),
      fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
      res, i;

  for (i=0; i<n; ++i) {
    if (util.isValid(X[i]) && util.isValid(Y[i])) {
      res = (slope*X[i] + icept) - Y[i];
      fit.rss += res * res;
    }
  }

  return fit;
};

// Namespace for bootstrap
stats.bootstrap = {};

// Construct a bootstrapped confidence interval at a given percentile level
// Arguments are an array, an optional n (defaults to 1000),
//  an optional alpha (defaults to 0.05), and an optional smoothing parameter
stats.bootstrap.ci = function(values, a, b, c, d) {
  var X, N, alpha, smooth, bs, means, i;
  if (util.isFunction(a) || util.isString(a)) {
    X = values.map(util.$(a));
    N = b;
    alpha = c;
    smooth = d;
  } else {
    X = values;
    N = a;
    alpha = b;
    smooth = c;
  }
  N = N ? +N : 1000;
  alpha = alpha || 0.05;

  bs = gen.random.bootstrap(X, smooth);
  for (i=0, means = Array(N); i<N; ++i) {
    means[i] = stats.mean(bs.samples(X.length));
  }
  means.sort(util.numcmp);
  return [
    stats.quantile(means, alpha/2),
    stats.quantile(means, 1-(alpha/2))
  ];
};

// Namespace for z-tests
stats.z = {};

// Construct a z-confidence interval at a given significance level
// Arguments are an array and an optional alpha (defaults to 0.05).
stats.z.ci = function(values, a, b) {
  var X = values, alpha = a;
  if (util.isFunction(a) || util.isString(a)) {
    X = values.map(util.$(a));
    alpha = b;
  }
  alpha = alpha || 0.05;

  var z = alpha===0.05 ? 1.96 : gen.random.normal(0, 1).icdf(1-(alpha/2)),
      mu = stats.mean(X),
      SE = stats.stdev(X) / Math.sqrt(stats.count.valid(X));
  return [mu - (z*SE), mu + (z*SE)];
};

// Perform a z-test of means. Returns the p-value.
// If a single array is provided, performs a one-sample location test.
// If two arrays or a table and two accessors are provided, performs
// a two-sample location test. A paired test is performed if specified
// by the options hash.
// The options hash format is: {paired: boolean, nullh: number}.
// http://en.wikipedia.org/wiki/Z-test
// http://en.wikipedia.org/wiki/Paired_difference_test
stats.z.test = function(values, a, b, opt) {
  if (util.isFunction(b) || util.isString(b)) { // table and accessors
    return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
  } else if (util.isArray(a)) { // two arrays
    return (b && b.paired ? ztestP : ztest2)(b, values, a);
  } else if (util.isFunction(a) || util.isString(a)) {
    return ztest1(b, values, a); // table and accessor
  } else {
    return ztest1(a, values); // one array
  }
};

// Perform a z-test of means. Returns the p-value.
// Assuming we have a list of values, and a null hypothesis. If no null
// hypothesis, assume our null hypothesis is mu=0.
function ztest1(opt, X, f) {
  var nullH = opt && opt.nullh || 0,
      gaussian = gen.random.normal(0, 1),
      mu = stats.mean(X,f),
      SE = stats.stdev(X,f) / Math.sqrt(stats.count.valid(X,f));

  if (SE===0) {
    // Test not well defined when standard error is 0.
    return (mu - nullH) === 0 ? 1 : 0;
  }
  // Two-sided, so twice the one-sided cdf.
  var z = (mu - nullH) / SE;
  return 2 * gaussian.cdf(-Math.abs(z));
}

// Perform a two sample paired z-test of means. Returns the p-value.
function ztestP(opt, values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n1 = stats.count(X),
      n2 = stats.count(Y),
      diffs = Array(), i;

  if (n1 !== n2) {
    throw Error('Array lengths must match.');
  }
  for (i=0; i<n1; ++i) {
    // Only valid differences should contribute to the test statistic
    if (util.isValid(X[i]) && util.isValid(Y[i])) {
      diffs.push(X[i] - Y[i]);
    }
  }
  return stats.z.test(diffs, opt && opt.nullh || 0);
}

// Perform a two sample z-test of means. Returns the p-value.
function ztest2(opt, values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n1 = stats.count.valid(X),
      n2 = stats.count.valid(Y),
      gaussian = gen.random.normal(0, 1),
      meanDiff = stats.mean(X) - stats.mean(Y) - (opt && opt.nullh || 0),
      SE = Math.sqrt(stats.variance(X)/n1 + stats.variance(Y)/n2);

  if (SE===0) {
    // Not well defined when pooled standard error is 0.
    return meanDiff===0 ? 1 : 0;
  }
  // Two-tailed, so twice the one-sided cdf.
  var z = meanDiff / SE;
  return 2 * gaussian.cdf(-Math.abs(z));
}

// Construct a mean-centered distance matrix for an array of numbers.
stats.dist.mat = function(X) {
  var n = X.length,
      m = n*n,
      A = Array(m),
      R = gen.zeros(n),
      M = 0, v, i, j;

  for (i=0; i<n; ++i) {
    A[i*n+i] = 0;
    for (j=i+1; j<n; ++j) {
      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
      A[j*n+i] = v;
      R[i] += v;
      R[j] += v;
    }
  }

  for (i=0; i<n; ++i) {
    M += R[i];
    R[i] /= n;
  }
  M /= m;

  for (i=0; i<n; ++i) {
    for (j=i; j<n; ++j) {
      A[i*n+j] += M - R[i] - R[j];
      A[j*n+i] = A[i*n+j];
    }
  }

  return A;
};

// Compute the Shannon entropy (log base 2) of an array of counts.
stats.entropy = function(counts, f) {
  f = util.$(f);
  var i, p, s = 0, H = 0, n = counts.length;
  for (i=0; i<n; ++i) {
    s += (f ? f(counts[i]) : counts[i]);
  }
  if (s === 0) return 0;
  for (i=0; i<n; ++i) {
    p = (f ? f(counts[i]) : counts[i]) / s;
    if (p) H += p * Math.log(p);
  }
  return -H / Math.LN2;
};

// Compute the mutual information between two discrete variables.
// Returns an array of the form [MI, MI_distance]
// MI_distance is defined as 1 - I(a,b) / H(a,b).
// http://en.wikipedia.org/wiki/Mutual_information
stats.mutual = function(values, a, b, counts) {
  var x = counts ? values.map(util.$(a)) : values,
      y = counts ? values.map(util.$(b)) : a,
      z = counts ? values.map(util.$(counts)) : b;

  var px = {},
      py = {},
      n = z.length,
      s = 0, I = 0, H = 0, p, t, i;

  for (i=0; i<n; ++i) {
    px[x[i]] = 0;
    py[y[i]] = 0;
  }

  for (i=0; i<n; ++i) {
    px[x[i]] += z[i];
    py[y[i]] += z[i];
    s += z[i];
  }

  t = 1 / (s * Math.LN2);
  for (i=0; i<n; ++i) {
    if (z[i] === 0) continue;
    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
    I += z[i] * t * Math.log(p);
    H += z[i] * t * Math.log(z[i]/s);
  }

  return [I, 1 + I/H];
};

// Compute the mutual information between two discrete variables.
stats.mutual.info = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[0];
};

// Compute the mutual information distance between two discrete variables.
// MI_distance is defined as 1 - I(a,b) / H(a,b).
stats.mutual.dist = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[1];
};

// Compute a profile of summary statistics for a variable.
stats.profile = function(values, f) {
  var mean = 0,
      valid = 0,
      missing = 0,
      distinct = 0,
      min = null,
      max = null,
      M2 = 0,
      vals = [],
      u = {}, delta, sd, i, v, x;

  // compute summary stats
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];

    // update unique values
    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

    if (v == null) {
      ++missing;
    } else if (util.isValid(v)) {
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      if (min===null || x < min) min = x;
      if (max===null || x > max) max = x;
      delta = x - mean;
      mean = mean + delta / (++valid);
      M2 = M2 + delta * (x - mean);
      vals.push(x);
    }
  }
  M2 = M2 / (valid - 1);
  sd = Math.sqrt(M2);

  // sort values for median and iqr
  vals.sort(util.cmp);

  return {
    type:     type(values, f),
    unique:   u,
    count:    values.length,
    valid:    valid,
    missing:  missing,
    distinct: distinct,
    min:      min,
    max:      max,
    mean:     mean,
    stdev:    sd,
    median:   (v = stats.quantile(vals, 0.5)),
    q1:       stats.quantile(vals, 0.25),
    q3:       stats.quantile(vals, 0.75),
    modeskew: sd === 0 ? 0 : (mean - v) / sd
  };
};

// Compute profiles for all variables in a data set.
stats.summary = function(data, fields) {
  fields = fields || util.keys(data[0]);
  var s = fields.map(function(f) {
    var p = stats.profile(data, util.$(f));
    return (p.field = f, p);
  });
  return (s.__summary__ = true, s);
};

},{"./generate":18,"./import/type":27,"./util":32}],30:[function(require,module,exports){
var util = require('./util'),
    format = require('./format');

var context = {
  formats:    [],
  format_map: {},
  truncate:   util.truncate,
  pad:        util.pad,
  day:        format.day,
  month:      format.month,
  quarter:    format.quarter,
  utcQuarter: format.utcQuarter
};

function template(text) {
  var src = source(text, 'd');
  src = 'var __t; return ' + src + ';';

  /* jshint evil: true */
  return (new Function('d', src)).bind(context);
}

template.source = source;
template.context = context;
template.format = get_format;
module.exports = template;

// Clear cache of format objects.
// This can *break* prior template functions, so invoke with care!
template.clearFormatCache = function() {
  context.formats = [];
  context.format_map = {};
};

// Generate property access code for use within template source.
// object: the name of the object (variable) containing template data
// property: the property access string, verbatim from template tag
template.property = function(object, property) {
  var src = util.field(property).map(util.str).join('][');
  return object + '[' + src + ']';
};

// Generate source code for a template function.
// text: the template text
// variable: the name of the data object variable ('obj' by default)
// properties: optional hash for collecting all accessed properties
function source(text, variable, properties) {
  variable = variable || 'obj';
  var index = 0;
  var src = '\'';
  var regex = template_re;

  // Compile the template source, escaping string literals appropriately.
  text.replace(regex, function(match, interpolate, offset) {
    src += text
      .slice(index, offset)
      .replace(template_escaper, template_escapeChar);
    index = offset + match.length;

    if (interpolate) {
      src += '\'\n+((__t=(' +
        template_var(interpolate, variable, properties) +
        '))==null?\'\':__t)+\n\'';
    }

    // Adobe VMs need the match returned to produce the correct offest.
    return match;
  });
  return src + '\'';
}

function template_var(text, variable, properties) {
  var filters = text.match(filter_re);
  var prop = filters.shift().trim();
  var stringCast = true;

  function strcall(fn) {
    fn = fn || '';
    if (stringCast) {
      stringCast = false;
      src = 'String(' + src + ')' + fn;
    } else {
      src += fn;
    }
    return src;
  }

  function date() {
    return '(typeof ' + src + '==="number"?new Date('+src+'):'+src+')';
  }

  function formatter(type) {
    var pattern = args[0];
    if ((pattern[0] === '\'' && pattern[pattern.length-1] === '\'') ||
        (pattern[0] === '"'  && pattern[pattern.length-1] === '"')) {
      pattern = pattern.slice(1, -1);
    } else {
      throw Error('Format pattern must be quoted: ' + pattern);
    }
    a = template_format(pattern, type);
    stringCast = false;
    var arg = type === 'number' ? src : date();
    src = 'this.formats['+a+']('+arg+')';
  }

  if (properties) properties[prop] = 1;
  var src = template.property(variable, prop);

  for (var i=0; i<filters.length; ++i) {
    var f = filters[i], args = null, pidx, a, b;

    if ((pidx=f.indexOf(':')) > 0) {
      f = f.slice(0, pidx);
      args = filters[i].slice(pidx+1)
        .match(args_re)
        .map(function(s) { return s.trim(); });
    }
    f = f.trim();

    switch (f) {
      case 'length':
        strcall('.length');
        break;
      case 'lower':
        strcall('.toLowerCase()');
        break;
      case 'upper':
        strcall('.toUpperCase()');
        break;
      case 'lower-locale':
        strcall('.toLocaleLowerCase()');
        break;
      case 'upper-locale':
        strcall('.toLocaleUpperCase()');
        break;
      case 'trim':
        strcall('.trim()');
        break;
      case 'left':
        a = util.number(args[0]);
        strcall('.slice(0,' + a + ')');
        break;
      case 'right':
        a = util.number(args[0]);
        strcall('.slice(-' + a +')');
        break;
      case 'mid':
        a = util.number(args[0]);
        b = a + util.number(args[1]);
        strcall('.slice(+'+a+','+b+')');
        break;
      case 'slice':
        a = util.number(args[0]);
        strcall('.slice('+ a +
          (args.length > 1 ? ',' + util.number(args[1]) : '') +
          ')');
        break;
      case 'truncate':
        a = util.number(args[0]);
        b = args[1];
        b = (b!=='left' && b!=='middle' && b!=='center') ? 'right' : b;
        src = 'this.truncate(' + strcall() + ',' + a + ',\'' + b + '\')';
        break;
      case 'pad':
        a = util.number(args[0]);
        b = args[1];
        b = (b!=='left' && b!=='middle' && b!=='center') ? 'right' : b;
        src = 'this.pad(' + strcall() + ',' + a + ',\'' + b + '\')';
        break;
      case 'number':
        formatter('number');
        break;
      case 'time':
        formatter('time');
        break;
      case 'time-utc':
        formatter('utc');
        break;
      case 'month':
        src = 'this.month(' + src + ')';
        break;
      case 'month-abbrev':
        src = 'this.month(' + src + ',true)';
        break;
      case 'day':
        src = 'this.day(' + src + ')';
        break;
      case 'day-abbrev':
        src = 'this.day(' + src + ',true)';
        break;
      case 'quarter':
        src = 'this.quarter(' + src + ')';
        break;
      case 'quarter-utc':
        src = 'this.utcQuarter(' + src + ')';
        break;
      default:
        throw Error('Unrecognized template filter: ' + f);
    }
  }

  return src;
}

var template_re = /\{\{(.+?)\}\}|$/g,
    filter_re = /(?:"[^"]*"|\'[^\']*\'|[^\|"]+|[^\|\']+)+/g,
    args_re = /(?:"[^"]*"|\'[^\']*\'|[^,"]+|[^,\']+)+/g;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var template_escapes = {
  '\'':     '\'',
  '\\':     '\\',
  '\r':     'r',
  '\n':     'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var template_escaper = /\\|'|\r|\n|\u2028|\u2029/g;

function template_escapeChar(match) {
  return '\\' + template_escapes[match];
}

function template_format(pattern, type) {
  var key = type + ':' + pattern;
  if (context.format_map[key] == null) {
    var f = format[type](pattern);
    var i = context.formats.length;
    context.formats.push(f);
    context.format_map[key] = i;
    return i;
  }
  return context.format_map[key];
}

function get_format(pattern, type) {
  return context.formats[template_format(pattern, type)];
}

},{"./format":17,"./util":32}],31:[function(require,module,exports){
var d3_time = require('d3-time');

var tempDate = new Date(),
    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

function date(d) {
  return (tempDate.setTime(+d), tempDate);
}

// create a time unit entry
function entry(type, date, unit, step, min, max) {
  var e = {
    type: type,
    date: date,
    unit: unit
  };
  if (step) {
    e.step = step;
  } else {
    e.minstep = 1;
  }
  if (min != null) e.min = min;
  if (max != null) e.max = max;
  return e;
}

function create(type, unit, base, step, min, max) {
  return entry(type,
    function(d) { return unit.offset(base, d); },
    function(d) { return unit.count(base, d); },
    step, min, max);
}

var locale = [
  create('second', d3_time.second, baseDate),
  create('minute', d3_time.minute, baseDate),
  create('hour',   d3_time.hour,   baseDate),
  create('day',    d3_time.day,    baseDate, [1, 7]),
  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
  create('year',   d3_time.year,   baseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
    function(d) { return date(d).getSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(1970, 0, 1, 0, d); },
    function(d) { return date(d).getMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(1970, 0, 1, d); },
    function(d) { return date(d).getHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(1970, 0, 4+d); },
    function(d) { return date(d).getDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(1970, 0, d); },
    function(d) { return date(d).getDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(1970, d % 12, 1); },
    function(d) { return date(d).getMonth(); },
    [1], 0, 11
  )
];

var utc = [
  create('second', d3_time.utcSecond, utcBaseDate),
  create('minute', d3_time.utcMinute, utcBaseDate),
  create('hour',   d3_time.utcHour,   utcBaseDate),
  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
  create('year',   d3_time.utcYear,   utcBaseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
    function(d) { return date(d).getUTCSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
    function(d) { return date(d).getUTCMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
    function(d) { return date(d).getUTCHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
    function(d) { return date(d).getUTCDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(Date.UTC(1970, 0, d)); },
    function(d) { return date(d).getUTCDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
    function(d) { return date(d).getUTCMonth(); },
    [1], 0, 11
  )
];

var STEPS = [
  [31536e6, 5],  // 1-year
  [7776e6, 4],   // 3-month
  [2592e6, 4],   // 1-month
  [12096e5, 3],  // 2-week
  [6048e5, 3],   // 1-week
  [1728e5, 3],   // 2-day
  [864e5, 3],    // 1-day
  [432e5, 2],    // 12-hour
  [216e5, 2],    // 6-hour
  [108e5, 2],    // 3-hour
  [36e5, 2],     // 1-hour
  [18e5, 1],     // 30-minute
  [9e5, 1],      // 15-minute
  [3e5, 1],      // 5-minute
  [6e4, 1],      // 1-minute
  [3e4, 0],      // 30-second
  [15e3, 0],     // 15-second
  [5e3, 0],      // 5-second
  [1e3, 0]       // 1-second
];

function find(units, span, minb, maxb) {
  var step = STEPS[0], i, n, bins;

  for (i=1, n=STEPS.length; i<n; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return units[STEPS[i-1][1]];
      }
      if (bins >= minb) {
        return units[step[1]];
      }
    }
  }
  return units[STEPS[n-1][1]];
}

function toUnitMap(units) {
  var map = {}, i, n;
  for (i=0, n=units.length; i<n; ++i) {
    map[units[i].type] = units[i];
  }
  map.find = function(span, minb, maxb) {
    return find(units, span, minb, maxb);
  };
  return map;
}

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);
},{"d3-time":7}],32:[function(require,module,exports){
(function (Buffer){
var u = module.exports;

// utility functions

var FNAME = '__name__';

u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

u.name = function(f) { return f==null ? null : f[FNAME]; };

u.identity = function(x) { return x; };

u.true = u.namedfunc('true', function() { return true; });

u.false = u.namedfunc('false', function() { return false; });

u.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

u.equal = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

u.extend = function(obj) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

u.length = function(x) {
  return x != null && x.length != null ? x.length : null;
};

u.keys = function(x) {
  var keys = [], k;
  for (k in x) keys.push(k);
  return keys;
};

u.vals = function(x) {
  var vals = [], k;
  for (k in x) vals.push(x[k]);
  return vals;
};

u.toMap = function(list, f) {
  return (f = u.$(f)) ?
    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  var n = values.length;
  if (!n) return '';
  for (var s=String(values[0]), i=1; i<n; ++i) {
    s += '|' + String(values[i]);
  }
  return s;
};

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) === '[object Function]';
};

u.isString = function(obj) {
  return typeof value === 'string' || toString.call(obj) === '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

u.isNumber = function(obj) {
  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
};

u.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) === '[object Date]';
};

u.isValid = function(obj) {
  return obj != null && obj === obj;
};

u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) {
  return s == null || s === '' ? null : +s;
};

u.boolean = function(s) {
  return s == null || s === '' ? null : s==='false' ? false : !!s;
};

// parse a date with optional d3.time-format format
u.date = function(s, format) {
  var d = format ? format : Date;
  return s == null || s === '' ? null : d.parse(s);
};

u.array = function(x) {
  return x != null ? (u.isArray(x) ? x : [x]) : [];
};

u.str = function(x) {
  return u.isArray(x) ? '[' + x.map(u.str) + ']'
    : u.isObject(x) || u.isString(x) ?
      // Output valid JSON and JS source strings.
      // See http://timelessrepo.com/json-isnt-a-javascript-subset
      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
    : x;
};

// data access functions

var field_re = /\[(.*?)\]|[^.\[]+/g;

u.field = function(f) {
  return String(f).match(field_re).map(function(d) {
    return d[0] !== '[' ? d :
      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
      d.slice(2, -2).replace(/\\(["'])/g, '$1');
  });
};

u.accessor = function(f) {
  /* jshint evil: true */
  return f==null || u.isFunction(f) ? f :
    u.namedfunc(f, Function('x', 'return x[' + u.field(f).map(u.str).join('][') + '];'));
};

// short-cut for accessor
u.$ = u.accessor;

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1 ?
    function(x, v) {
      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
      x[s[i]] = v;
    } :
    function(x, v) { x[f] = v; };
};


u.$func = function(name, op) {
  return function(f) {
    f = u.$(f) || u.identity;
    var n = name + (u.name(f) ? '_'+u.name(f) : '');
    return u.namedfunc(n, function(d) { return op(f(d)); });
  };
};

u.$valid  = u.$func('valid', u.isValid);
u.$length = u.$func('length', u.length);

u.$in = function(f, values) {
  f = u.$(f);
  var map = u.isArray(values) ? u.toMap(values) : values;
  return function(d) { return !!map[f(d)]; };
};

// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === '-') { s = -1; f = f.slice(1); }
    else if (f[0] === '+') { s = +1; f = f.slice(1); }
    sign.push(s);
    return u.accessor(f);
  });
  return function(a, b) {
    var i, n, f, c;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i];
      c = u.cmp(f(a), f(b));
      if (c) return c * sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  return (a < b || a == null) && b != null ? -1 :
    (a > b || b == null) && a != null ? 1 :
    ((b = b instanceof Date ? +b : b),
     (a = a instanceof Date ? +a : a)) !== a && b === b ? -1 :
    b !== b && a === a ? 1 : 0;
};

u.numcmp = function(a, b) { return a - b; };

u.stablesort = function(array, sortBy, keyFn) {
  var indices = array.reduce(function(idx, v, i) {
    return (idx[keyFn(v)] = i, idx);
  }, {});

  array.sort(function(a, b) {
    var sa = sortBy(a),
        sb = sortBy(b);
    return sa < sb ? -1 : sa > sb ? 1
         : (indices[keyFn(a)] - indices[keyFn(b)]);
  });

  return array;
};

// permutes an array using a Knuth shuffle
u.permute = function(a) {
  var m = a.length,
      swap,
      i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    swap = a[m];
    a[m] = a[i];
    a[i] = swap;
  }
};

// string functions

u.pad = function(s, length, pos, padchar) {
  padchar = padchar || " ";
  var d = length - s.length;
  if (d <= 0) return s;
  switch (pos) {
    case 'left':
      return strrep(d, padchar) + s;
    case 'middle':
    case 'center':
      return strrep(Math.floor(d/2), padchar) +
         s + strrep(Math.ceil(d/2), padchar);
    default:
      return s + strrep(d, padchar);
  }
};

function strrep(n, str) {
  var s = "", i;
  for (i=0; i<n; ++i) s += str;
  return s;
}

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case 'left':
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case 'middle':
    case 'center':
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join('').trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

}).call(this,require("buffer").Buffer)

},{"buffer":1}],33:[function(require,module,exports){
var json = typeof JSON !== 'undefined' ? JSON : require('jsonify');

module.exports = function (obj, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var space = opts.space || '';
    if (typeof space === 'number') space = Array(space+1).join(' ');
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
    var replacer = opts.replacer || function(key, value) { return value; };

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (parent, key, node, level) {
        var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
        var colonSeparator = space ? ': ' : ':';

        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        node = replacer.call(parent, key, node);

        if (node === undefined) {
            return;
        }
        if (typeof node !== 'object' || node === null) {
            return json.stringify(node);
        }
        if (isArray(node)) {
            var out = [];
            for (var i = 0; i < node.length; i++) {
                var item = stringify(node, i, node[i], level+1) || json.stringify(null);
                out.push(indent + space + item);
            }
            return '[' + out.join(',') + indent + ']';
        }
        else {
            if (seen.indexOf(node) !== -1) {
                if (cycles) return json.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
            }
            else seen.push(node);

            var keys = objectKeys(node).sort(cmp && cmp(node));
            var out = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node, key, node[key], level+1);

                if(!value) continue;

                var keyValue = json.stringify(key)
                    + colonSeparator
                    + value;
                ;
                out.push(indent + space + keyValue);
            }
            seen.splice(seen.indexOf(node), 1);
            return '{' + out.join(',') + indent + '}';
        }
    })({ '': obj }, '', obj, 0);
};

var isArray = Array.isArray || function (x) {
    return {}.toString.call(x) === '[object Array]';
};

var objectKeys = Object.keys || function (obj) {
    var has = Object.prototype.hasOwnProperty || function () { return true };
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

},{"jsonify":34}],34:[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":35,"./lib/stringify":36}],35:[function(require,module,exports){
var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};

},{}],36:[function(require,module,exports){
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};

},{}],37:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.topojson = global.topojson || {})));
}(this, (function (exports) { 'use strict';

function noop() {}

function transformAbsolute(transform) {
  if (!transform) return noop;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(point, i) {
    if (!i) x0 = y0 = 0;
    point[0] = (x0 += point[0]) * kx + dx;
    point[1] = (y0 += point[1]) * ky + dy;
  };
}

function transformRelative(transform) {
  if (!transform) return noop;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(point, i) {
    if (!i) x0 = y0 = 0;
    var x1 = Math.round((point[0] - dx) / kx),
        y1 = Math.round((point[1] - dy) / ky);
    point[0] = x1 - x0;
    point[1] = y1 - y0;
    x0 = x1;
    y0 = y1;
  };
}

function reverse(array, n) {
  var t, j = array.length, i = j - n;
  while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
}

function bisect(a, x) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function feature(topology, o) {
  return o.type === "GeometryCollection" ? {
    type: "FeatureCollection",
    features: o.geometries.map(function(o) { return feature$1(topology, o); })
  } : feature$1(topology, o);
}

function feature$1(topology, o) {
  var f = {
    type: "Feature",
    id: o.id,
    properties: o.properties || {},
    geometry: object(topology, o)
  };
  if (o.id == null) delete f.id;
  return f;
}

function object(topology, o) {
  var absolute = transformAbsolute(topology.transform),
      arcs = topology.arcs;

  function arc(i, points) {
    if (points.length) points.pop();
    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length, p; k < n; ++k) {
      points.push(p = a[k].slice());
      absolute(p, k);
    }
    if (i < 0) reverse(points, n);
  }

  function point(p) {
    p = p.slice();
    absolute(p, 0);
    return p;
  }

  function line(arcs) {
    var points = [];
    for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
    if (points.length < 2) points.push(points[0].slice());
    return points;
  }

  function ring(arcs) {
    var points = line(arcs);
    while (points.length < 4) points.push(points[0].slice());
    return points;
  }

  function polygon(arcs) {
    return arcs.map(ring);
  }

  function geometry(o) {
    var t = o.type;
    return t === "GeometryCollection" ? {type: t, geometries: o.geometries.map(geometry)}
        : t in geometryType ? {type: t, coordinates: geometryType[t](o)}
        : null;
  }

  var geometryType = {
    Point: function(o) { return point(o.coordinates); },
    MultiPoint: function(o) { return o.coordinates.map(point); },
    LineString: function(o) { return line(o.arcs); },
    MultiLineString: function(o) { return o.arcs.map(line); },
    Polygon: function(o) { return polygon(o.arcs); },
    MultiPolygon: function(o) { return o.arcs.map(polygon); }
  };

  return geometry(o);
}

function stitchArcs(topology, arcs) {
  var stitchedArcs = {},
      fragmentByStart = {},
      fragmentByEnd = {},
      fragments = [],
      emptyIndex = -1;

  // Stitch empty arcs first, since they may be subsumed by other arcs.
  arcs.forEach(function(i, j) {
    var arc = topology.arcs[i < 0 ? ~i : i], t;
    if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
      t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
    }
  });

  arcs.forEach(function(i) {
    var e = ends(i),
        start = e[0],
        end = e[1],
        f, g;

    if (f = fragmentByEnd[start]) {
      delete fragmentByEnd[f.end];
      f.push(i);
      f.end = end;
      if (g = fragmentByStart[end]) {
        delete fragmentByStart[g.start];
        var fg = g === f ? f : f.concat(g);
        fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else if (f = fragmentByStart[end]) {
      delete fragmentByStart[f.start];
      f.unshift(i);
      f.start = start;
      if (g = fragmentByEnd[start]) {
        delete fragmentByEnd[g.end];
        var gf = g === f ? f : g.concat(f);
        fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else {
      f = [i];
      fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
    }
  });

  function ends(i) {
    var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
    if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
    else p1 = arc[arc.length - 1];
    return i < 0 ? [p1, p0] : [p0, p1];
  }

  function flush(fragmentByEnd, fragmentByStart) {
    for (var k in fragmentByEnd) {
      var f = fragmentByEnd[k];
      delete fragmentByStart[f.start];
      delete f.start;
      delete f.end;
      f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
      fragments.push(f);
    }
  }

  flush(fragmentByEnd, fragmentByStart);
  flush(fragmentByStart, fragmentByEnd);
  arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

  return fragments;
}

function mesh(topology) {
  return object(topology, meshArcs.apply(this, arguments));
}

function meshArcs(topology, o, filter) {
  var arcs = [];

  function arc(i) {
    var j = i < 0 ? ~i : i;
    (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
  }

  function line(arcs) {
    arcs.forEach(arc);
  }

  function polygon(arcs) {
    arcs.forEach(line);
  }

  function geometry(o) {
    if (o.type === "GeometryCollection") o.geometries.forEach(geometry);
    else if (o.type in geometryType) geom = o, geometryType[o.type](o.arcs);
  }

  if (arguments.length > 1) {
    var geomsByArc = [],
        geom;

    var geometryType = {
      LineString: line,
      MultiLineString: polygon,
      Polygon: polygon,
      MultiPolygon: function(arcs) { arcs.forEach(polygon); }
    };

    geometry(o);

    geomsByArc.forEach(arguments.length < 3
        ? function(geoms) { arcs.push(geoms[0].i); }
        : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });
  } else {
    for (var i = 0, n = topology.arcs.length; i < n; ++i) arcs.push(i);
  }

  return {type: "MultiLineString", arcs: stitchArcs(topology, arcs)};
}

function cartesianTriangleArea(triangle) {
  var a = triangle[0], b = triangle[1], c = triangle[2];
  return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]));
}

function ring(ring) {
  var i = -1,
      n = ring.length,
      a,
      b = ring[n - 1],
      area = 0;

  while (++i < n) {
    a = b;
    b = ring[i];
    area += a[0] * b[1] - a[1] * b[0];
  }

  return area / 2;
}

function merge(topology) {
  return object(topology, mergeArcs.apply(this, arguments));
}

function mergeArcs(topology, objects) {
  var polygonsByArc = {},
      polygons = [],
      components = [];

  objects.forEach(function(o) {
    if (o.type === "Polygon") register(o.arcs);
    else if (o.type === "MultiPolygon") o.arcs.forEach(register);
  });

  function register(polygon) {
    polygon.forEach(function(ring$$) {
      ring$$.forEach(function(arc) {
        (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
      });
    });
    polygons.push(polygon);
  }

  function area(ring$$) {
    return Math.abs(ring(object(topology, {type: "Polygon", arcs: [ring$$]}).coordinates[0]));
  }

  polygons.forEach(function(polygon) {
    if (!polygon._) {
      var component = [],
          neighbors = [polygon];
      polygon._ = 1;
      components.push(component);
      while (polygon = neighbors.pop()) {
        component.push(polygon);
        polygon.forEach(function(ring$$) {
          ring$$.forEach(function(arc) {
            polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
              if (!polygon._) {
                polygon._ = 1;
                neighbors.push(polygon);
              }
            });
          });
        });
      }
    }
  });

  polygons.forEach(function(polygon) {
    delete polygon._;
  });

  return {
    type: "MultiPolygon",
    arcs: components.map(function(polygons) {
      var arcs = [], n;

      // Extract the exterior (unique) arcs.
      polygons.forEach(function(polygon) {
        polygon.forEach(function(ring$$) {
          ring$$.forEach(function(arc) {
            if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
              arcs.push(arc);
            }
          });
        });
      });

      // Stitch the arcs into one or more rings.
      arcs = stitchArcs(topology, arcs);

      // If more than one ring is returned,
      // at most one of these rings can be the exterior;
      // choose the one with the greatest absolute area.
      if ((n = arcs.length) > 1) {
        for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
          if ((ki = area(arcs[i])) > k) {
            t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
          }
        }
      }

      return arcs;
    })
  };
}

function neighbors(objects) {
  var indexesByArc = {}, // arc index -> array of object indexes
      neighbors = objects.map(function() { return []; });

  function line(arcs, i) {
    arcs.forEach(function(a) {
      if (a < 0) a = ~a;
      var o = indexesByArc[a];
      if (o) o.push(i);
      else indexesByArc[a] = [i];
    });
  }

  function polygon(arcs, i) {
    arcs.forEach(function(arc) { line(arc, i); });
  }

  function geometry(o, i) {
    if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
    else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
  }

  var geometryType = {
    LineString: line,
    MultiLineString: polygon,
    Polygon: polygon,
    MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
  };

  objects.forEach(geometry);

  for (var i in indexesByArc) {
    for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
      for (var k = j + 1; k < m; ++k) {
        var ij = indexes[j], ik = indexes[k], n;
        if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
        if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
      }
    }
  }

  return neighbors;
}

function compareArea(a, b) {
  return a[1][2] - b[1][2];
}

function minAreaHeap() {
  var heap = {},
      array = [],
      size = 0;

  heap.push = function(object) {
    up(array[object._ = size] = object, size++);
    return size;
  };

  heap.pop = function() {
    if (size <= 0) return;
    var removed = array[0], object;
    if (--size > 0) object = array[size], down(array[object._ = 0] = object, 0);
    return removed;
  };

  heap.remove = function(removed) {
    var i = removed._, object;
    if (array[i] !== removed) return; // invalid request
    if (i !== --size) object = array[size], (compareArea(object, removed) < 0 ? up : down)(array[object._ = i] = object, i);
    return i;
  };

  function up(object, i) {
    while (i > 0) {
      var j = ((i + 1) >> 1) - 1,
          parent = array[j];
      if (compareArea(object, parent) >= 0) break;
      array[parent._ = i] = parent;
      array[object._ = i = j] = object;
    }
  }

  function down(object, i) {
    while (true) {
      var r = (i + 1) << 1,
          l = r - 1,
          j = i,
          child = array[j];
      if (l < size && compareArea(array[l], child) < 0) child = array[j = l];
      if (r < size && compareArea(array[r], child) < 0) child = array[j = r];
      if (j === i) break;
      array[child._ = i] = child;
      array[object._ = i = j] = object;
    }
  }

  return heap;
}

function presimplify(topology, triangleArea) {
  var absolute = transformAbsolute(topology.transform),
      relative = transformRelative(topology.transform),
      heap = minAreaHeap();

  if (!triangleArea) triangleArea = cartesianTriangleArea;

  topology.arcs.forEach(function(arc) {
    var triangles = [],
        maxArea = 0,
        triangle,
        i,
        n,
        p;

    // To store each point’s effective area, we create a new array rather than
    // extending the passed-in point to workaround a Chrome/V8 bug (getting
    // stuck in smi mode). For midpoints, the initial effective area of
    // Infinity will be computed in the next step.
    for (i = 0, n = arc.length; i < n; ++i) {
      p = arc[i];
      absolute(arc[i] = [p[0], p[1], Infinity], i);
    }

    for (i = 1, n = arc.length - 1; i < n; ++i) {
      triangle = arc.slice(i - 1, i + 2);
      triangle[1][2] = triangleArea(triangle);
      triangles.push(triangle);
      heap.push(triangle);
    }

    for (i = 0, n = triangles.length; i < n; ++i) {
      triangle = triangles[i];
      triangle.previous = triangles[i - 1];
      triangle.next = triangles[i + 1];
    }

    while (triangle = heap.pop()) {
      var previous = triangle.previous,
          next = triangle.next;

      // If the area of the current point is less than that of the previous point
      // to be eliminated, use the latter's area instead. This ensures that the
      // current point cannot be eliminated without eliminating previously-
      // eliminated points.
      if (triangle[1][2] < maxArea) triangle[1][2] = maxArea;
      else maxArea = triangle[1][2];

      if (previous) {
        previous.next = next;
        previous[2] = triangle[2];
        update(previous);
      }

      if (next) {
        next.previous = previous;
        next[0] = triangle[0];
        update(next);
      }
    }

    arc.forEach(relative);
  });

  function update(triangle) {
    heap.remove(triangle);
    triangle[1][2] = triangleArea(triangle);
    heap.push(triangle);
  }

  return topology;
}

var version = "1.6.27";

exports.version = version;
exports.mesh = mesh;
exports.meshArcs = meshArcs;
exports.merge = merge;
exports.mergeArcs = mergeArcs;
exports.feature = feature;
exports.neighbors = neighbors;
exports.presimplify = presimplify;

Object.defineProperty(exports, '__esModule', { value: true });

})));
},{}],38:[function(require,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), q = [], c, i;
        return i = { next: verb("next"), "throw": verb("throw"), "return": verb("return") }, i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { return function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]), next(); }); }; }
        function next() { if (!c && q.length) resume((c = q.shift())[0], c[1]); }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(c[3], e); } }
        function step(r) { r.done ? settle(c[2], r) : r.value[0] === "yield" ? settle(c[2], { value: r.value[1], done: false }) : Promise.resolve(r.value[1]).then(r.value[0] === "delegate" ? delegate : fulfill, reject); }
        function delegate(r) { step(r.done ? r : { value: ["yield", r.value], done: false }); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { c = void 0, f(v), next(); }
    };

    __asyncDelegator = function (o) {
        var i = { next: verb("next"), "throw": verb("throw", function (e) { throw e; }), "return": verb("return", function (v) { return { value: v, done: true }; }) };
        return o = __asyncValues(o), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { return function (v) { return { value: ["delegate", (o[n] || f).call(o, v)], done: false }; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],39:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vega = global.vega || {})));
}(this, (function (exports) { 'use strict';

/**
 * Parse an event selector string.
 * Returns an array of event stream definitions.
 */
var eventSelector = function(selector, source, marks) {
  DEFAULT_SOURCE = source || VIEW;
  MARKS = marks || DEFAULT_MARKS;
  return parseMerge(selector.trim()).map(parseSelector);
};

var VIEW    = 'view';
var LBRACK  = '[';
var RBRACK  = ']';
var LBRACE  = '{';
var RBRACE  = '}';
var COLON   = ':';
var COMMA   = ',';
var NAME    = '@';
var GT      = '>';
var ILLEGAL = /[\[\]\{\}]/;
var DEFAULT_SOURCE;
var MARKS;
var DEFAULT_MARKS = {
      '*': 1,
      arc: 1,
      area: 1,
      group: 1,
      image: 1,
      line: 1,
      path: 1,
      rect: 1,
      rule: 1,
      shape: 1,
      symbol: 1,
      text: 1,
      trail: 1
    };

function isMarkType(type) {
  return MARKS.hasOwnProperty(type);
}

function find(s, i, endChar, pushChar, popChar) {
  var count = 0,
      n = s.length,
      c;
  for (; i<n; ++i) {
    c = s[i];
    if (!count && c === endChar) return i;
    else if (popChar && popChar.indexOf(c) >= 0) --count;
    else if (pushChar && pushChar.indexOf(c) >= 0) ++count;
  }
  return i;
}

function parseMerge(s) {
  var output = [],
      start = 0,
      n = s.length,
      i = 0;

  while (i < n) {
    i = find(s, i, COMMA, LBRACK + LBRACE, RBRACK + RBRACE);
    output.push(s.substring(start, i).trim());
    start = ++i;
  }

  if (output.length === 0) {
    throw 'Empty event selector: ' + s;
  }
  return output;
}

function parseSelector(s) {
  return s[0] === '['
    ? parseBetween(s)
    : parseStream(s);
}

function parseBetween(s) {
  var n = s.length,
      i = 1,
      b, stream;

  i = find(s, i, RBRACK, LBRACK, RBRACK);
  if (i === n) {
    throw 'Empty between selector: ' + s;
  }

  b = parseMerge(s.substring(1, i));
  if (b.length !== 2) {
    throw 'Between selector must have two elements: ' + s;
  }

  s = s.slice(i + 1).trim();
  if (s[0] !== GT) {
    throw 'Expected \'>\' after between selector: ' + s;
  }

  b = b.map(parseSelector);

  stream = parseSelector(s.slice(1).trim());
  if (stream.between) {
    return {
      between: b,
      stream: stream
    };
  } else {
    stream.between = b;
  }

  return stream;
}

function parseStream(s) {
  var stream = {source: DEFAULT_SOURCE},
      source = [],
      throttle = [0, 0],
      markname = 0,
      start = 0,
      n = s.length,
      i = 0, j,
      filter;

  // extract throttle from end
  if (s[n-1] === RBRACE) {
    i = s.lastIndexOf(LBRACE);
    if (i >= 0) {
      try {
        throttle = parseThrottle(s.substring(i+1, n-1));
      } catch (e) {
        throw 'Invalid throttle specification: ' + s;
      }
      s = s.slice(0, i).trim();
      n = s.length;
    } else throw 'Unmatched right brace: ' + s;
    i = 0;
  }

  if (!n) throw s;

  // set name flag based on first char
  if (s[0] === NAME) markname = ++i;

  // extract first part of multi-part stream selector
  j = find(s, i, COLON);
  if (j < n) {
    source.push(s.substring(start, j).trim());
    start = i = ++j;
  }

  // extract remaining part of stream selector
  i = find(s, i, LBRACK);
  if (i === n) {
    source.push(s.substring(start, n).trim());
  } else {
    source.push(s.substring(start, i).trim());
    filter = [];
    start = ++i;
    if (start === n) throw 'Unmatched left bracket: ' + s;
  }

  // extract filters
  while (i < n) {
    i = find(s, i, RBRACK);
    if (i === n) throw 'Unmatched left bracket: ' + s;
    filter.push(s.substring(start, i).trim());
    if (i < n-1 && s[++i] !== LBRACK) throw 'Expected left bracket: ' + s;
    start = ++i;
  }

  // marshall event stream specification
  if (!(n = source.length) || ILLEGAL.test(source[n-1])) {
    throw 'Invalid event selector: ' + s;
  }

  if (n > 1) {
    stream.type = source[1];
    if (markname) {
      stream.markname = source[0].slice(1);
    } else if (isMarkType(source[0])) {
      stream.marktype = source[0];
    } else {
      stream.source = source[0];
    }
  } else {
    stream.type = source[0];
  }
  if (stream.type.slice(-1) === '!') {
    stream.consume = true;
    stream.type = stream.type.slice(0, -1);
  }
  if (filter != null) stream.filter = filter;
  if (throttle[0]) stream.throttle = throttle[0];
  if (throttle[1]) stream.debounce = throttle[1];

  return stream;
}

function parseThrottle(s) {
  var a = s.split(COMMA);
  if (!s.length || a.length > 2) throw s;
  return a.map(function(_) {
    var x = +_;
    if (x !== x) throw s;
    return x;
  });
}

exports.selector = eventSelector;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],40:[function(require,module,exports){
module.exports={
  "name": "vega-lite",
  "author": "Jeffrey Heer, Dominik Moritz, Kanit \"Ham\" Wongsuphasawat",
  "version": "2.0.0-alpha.9",
  "collaborators": [
    "Kanit Wongsuphasawat <kanitw@gmail.com> (http://kanitw.yellowpigz.com)",
    "Dominik Moritz <domoritz@cs.washington.edu> (https://www.domoritz.de)",
    "Jeffrey Heer <jheer@uw.edu> (http://jheer.org)"
  ],
  "homepage": "https://vega.github.io/vega-lite/",
  "description": "Vega-lite provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete Vega specifications.",
  "main": "build/src/vl.js",
  "types": "build/src/vl.d.ts",
  "bin": {
    "vl2png": "./bin/vl2png",
    "vl2svg": "./bin/vl2svg",
    "vl2vg": "./bin/vl2vg"
  },
  "directories": {
    "test": "test"
  },
  "scripts": {
    "tsc": "rm -rf build/*/** && tsc",
    "prebuild": "mkdir -p build/site build/examples/images build/test-gallery",
    "build": "npm run tsc && cp package.json build && browserify src/vl.ts -p tsify -d -s vl | exorcist build/vega-lite.js.map > build/vega-lite.js",
    "postbuild": "uglifyjs build/vega-lite.js -cm --in-source-map build/vega-lite.js.map --source-map build/vega-lite.min.js.map > build/vega-lite.min.js && npm run schema",
    "build:examples": "./scripts/build-examples.sh",
    "build:images": "npm run data && scripts/generate-images.sh",
    "build:toc": "bundle exec jekyll build -q && scripts/generate-toc",
    "build:site": "npm run link && browserify site/static/main.ts -p [tsify -p site] -d | exorcist build/site/main.js.map > build/site/main.js",
    "build:versions": "scripts/update-version.sh",
    "build:test-gallery": "browserify test-gallery/main.ts -p [tsify -p test-gallery] -d > build/test-gallery/main.js",
    "check:examples": "scripts/check-examples.sh",
    "check:schema": "scripts/check-schema.sh",
    "clean": "rm -rf build && rm -f vega-lite.* & find -E src test site examples -regex '.*\\.(js|js.map|d.ts|vg.json)' -delete & rm -rf data",
    "data": "rsync -r node_modules/vega-datasets/data/* data",
    "link": "npm link && npm link vega-lite",

    "deploy": "scripts/deploy.sh",
    "deploy:gh": "scripts/deploy-gh.sh",
    "deploy:schema": "scripts/deploy-schema.sh",

    "prestart": "npm run data && npm run build && scripts/index-examples",
    "start": "nodemon -x 'npm run build:test-gallery' & browser-sync start --server --files 'build/test-gallery/main.js' --index 'test-gallery/index.html'",
    "poststart": "rm examples/all-examples.json",

    "preschema": "npm run prebuild",
    "schema": "typescript-json-schema --required true --noExtraProps true src/spec.ts TopLevelExtendedSpec > build/vega-lite-schema.json && rm -f _data/vega-lite-schema.json && cp build/vega-lite-schema.json _data/",

    "presite": "npm run build && npm run data && npm run build:site && npm run build:toc && npm run build:versions",
    "site": "bundle exec jekyll serve",

    "lint": "tslint --project tsconfig.json -c tslint.json --type-check",
    "pretest": "npm run tsc && npm run schema && npm run data",
    "test": "npm run test:nocompile",
    "test:nocompile": "npm run test:only && npm run lint && npm run mocha:examples",
    "test:only": "nyc --reporter=html --reporter=text-summary npm run mocha:test",
    "test:debug": "npm run pretest && mocha --recursive --debug-brk build/test build/examples",
    "mocha:test": "mocha --require source-map-support/register --reporter dot --recursive build/test",
    "mocha:examples": "mocha --require source-map-support/register --reporter dot --recursive build/examples",

    "codecov": "nyc report --reporter=json && codecov -f coverage/*.json",
    "watch:build": "watchify src/vl.ts -p tsify -v -d -s vl -o 'exorcist build/vega-lite.js.map > build/vega-lite.js'",
    "watch:test": "nodemon -x 'npm test'",
    "watch": "nodemon -x 'npm run build && npm run test:nocompile' # already ran schema in build"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/vega/vega-lite.git"
  },
  "license": "BSD-3-Clause",
  "bugs": {
    "url": "https://github.com/vega/vega-lite/issues"
  },
  "devDependencies": {
    "@types/chai": "^3.5.0",
    "@types/d3": "^4.7.0",
    "@types/highlight.js": "^9.1.9",
    "@types/json-stable-stringify": "^1.0.31",
    "@types/mocha": "^2.2.40",
    "@types/node": "^7.0.12",
    "ajv": "5.0.1-beta.1",
    "browser-sync": "~2.18.8",
    "browserify": "~14.3.0",
    "browserify-shim": "^3.8.14",
    "chai": "~3.5.0",
    "cheerio": "~0.22.0",
    "codecov": "~2.1.0",
    "d3": "^4.7.4",
    "exorcist": "~0.4.0",
    "highlight.js": "^9.10.0",
    "mocha": "~3.2.0",
    "nodemon": "~1.11.0",
    "nyc": "~10.2.0",
    "source-map-support": "~0.4.14",
    "tsify": "~3.0.1",
    "tslint": "~5.1.0",
    "tslint-eslint-rules": "^4.0.0",
    "typescript": "^2.2.2",
    "typescript-json-schema": "^0.11.0",
    "uglify-js": "~2.8.22",
    "vega": "3.0.0-beta.28",
    "vega-datasets": "vega/vega-datasets#gh-pages",
    "vega-embed": "3.0.0-beta.10",
    "watchify": "~3.9.0",
    "yaml-front-matter": "~3.4.0"
  },
  "dependencies": {
    "json-stable-stringify": "~1.0.1",
    "tslib": "^1.6.0",
    "vega-event-selector": "^2.0.0-beta",
    "vega-util": "~1.1.4",
    "yargs": "~7.0.2"
  }
}

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
exports.AGGREGATE_OPS = [
    'values',
    'count',
    'valid',
    'missing',
    'distinct',
    'sum',
    'mean',
    'average',
    'variance',
    'variancep',
    'stdev',
    'stdevp',
    'median',
    'q1',
    'q3',
    'ci0',
    'ci1',
    'modeskew',
    'min',
    'max',
    'argmin',
    'argmax',
];
exports.AGGREGATE_OP_INDEX = util_1.toSet(exports.AGGREGATE_OPS);
/** Additive-based aggregation operations.  These can be applied to stack. */
exports.SUM_OPS = [
    'count',
    'sum',
    'distinct',
    'valid',
    'missing'
];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
exports.SHARED_DOMAIN_OPS = [
    'mean',
    'average',
    'median',
    'q1',
    'q3',
    'min',
    'max',
];

},{"./util":124}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXIS_PROPERTIES = [
    'domain', 'format', 'grid', 'labelPadding', 'labels', 'maxExtent', 'minExtent', 'offset', 'orient', 'position', 'tickCount', 'ticks', 'tickSize', 'title', 'titlePadding', 'values', 'zindex'
];

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var util_1 = require("./util");
function binToString(bin) {
    if (util_1.isBoolean(bin)) {
        return 'bin';
    }
    return 'bin' + Object.keys(bin).map(function (p) { return "_" + p + "_" + bin[p]; }).join('');
}
exports.binToString = binToString;
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;

},{"./channel":44,"./util":124}],44:[function(require,module,exports){
/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("./scale");
var util_1 = require("./util");
var Channel;
(function (Channel) {
    // Facet
    Channel.ROW = 'row';
    Channel.COLUMN = 'column';
    // Position
    Channel.X = 'x';
    Channel.Y = 'y';
    Channel.X2 = 'x2';
    Channel.Y2 = 'y2';
    // Mark property with scale
    Channel.COLOR = 'color';
    Channel.SHAPE = 'shape';
    Channel.SIZE = 'size';
    Channel.OPACITY = 'opacity';
    // Non-scale channel
    Channel.TEXT = 'text';
    Channel.ORDER = 'order';
    Channel.DETAIL = 'detail';
})(Channel = exports.Channel || (exports.Channel = {}));
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.X2 = Channel.X2;
exports.Y2 = Channel.Y2;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// CHANNELS without COLUMN, ROW
exports.UNIT_CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT
exports.UNIT_SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
// UNIT_SCALE_CHANNELS with ROW, COLUMN
exports.SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY, exports.ROW, exports.COLUMN];
// UNIT_CHANNELS without X, Y, X2, Y2;
exports.NONSPATIAL_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_SCALE_CHANNELS without X, Y;
exports.NONSPATIAL_SCALE_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
exports.LEVEL_OF_DETAIL_CHANNELS = util_1.without(exports.NONSPATIAL_CHANNELS, ['order']);
/** Channels that can serve as groupings for stacked charts. */
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
function supportMark(channel, mark) {
    return mark in getSupportedMark(channel);
}
exports.supportMark = supportMark;
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER: // TODO: revise (order might not support rect, which is not stackable?)
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, rect: true, line: true, area: true, text: true
            };
        case exports.X2:
        case exports.Y2:
            return {
                rule: true, bar: true, rect: true, area: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true, line: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.TEXT, exports.ORDER], channel);
}
exports.hasScale = hasScale;
// Position does not work with ordinal (lookup) scale and sequential (which is only for color)
var POSITION_SCALE_TYPE_INDEX = util_1.toSet(util_1.without(scale_1.SCALE_TYPES, ['ordinal', 'sequential']));
function supportScaleType(channel, scaleType) {
    switch (channel) {
        case exports.ROW:
        case exports.COLUMN:
            return scaleType === 'band'; // row / column currently supports band only
        case exports.X:
        case exports.Y:
        case exports.SIZE: // TODO: size and opacity can support ordinal with more modification
        case exports.OPACITY:
            // Although it generally doesn't make sense to use band with size and opacity,
            // it can also work since we use band: 0.5 to get midpoint.
            return scaleType in POSITION_SCALE_TYPE_INDEX;
        case exports.COLOR:
            return scaleType !== 'band'; // band does not make sense with color
        case exports.SHAPE:
            return scaleType === 'ordinal'; // shape = lookup only
    }
    /* istanbul ignore next: it should never reach here */
    return false;
}
exports.supportScaleType = supportScaleType;
function rangeType(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.SIZE:
        case exports.OPACITY:
            return 'continuous';
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case exports.COLOR:
            return 'flexible';
        // No scale, no range type.
        case exports.X2:
        case exports.Y2:
        case exports.DETAIL:
        case exports.TEXT:
        case exports.ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('getSupportedRole not implemented for ' + channel);
}
exports.rangeType = rangeType;

},{"./scale":115,"./util":124}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function labels(model, channel, labelsSpec, def) {
    var fieldDef = model.fieldDef(channel);
    var axis = model.axis(channel);
    var config = model.config;
    // Text
    if (fieldDef.type === type_1.TEMPORAL) {
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat)
            }
        }, labelsSpec);
    }
    // Label Angle
    if (axis.labelAngle !== undefined) {
        labelsSpec.angle = { value: axis.labelAngle };
    }
    else {
        // auto rotate for X
        if (channel === channel_1.X && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === type_1.TEMPORAL)) {
            labelsSpec.angle = { value: 270 };
        }
    }
    // Auto set align if rotated
    // TODO: consider other value besides 270, 90
    if (labelsSpec.angle) {
        if (labelsSpec.angle.value === 270) {
            labelsSpec.align = {
                value: def.orient === 'top' ? 'left' :
                    (channel === channel_1.X || channel === channel_1.COLUMN) ? 'right' :
                        'center'
            };
        }
        else if (labelsSpec.angle.value === 90) {
            labelsSpec.align = { value: 'center' };
        }
    }
    if (labelsSpec.angle) {
        // Auto set baseline if rotated
        // TODO: consider other value besides 270, 90
        if (labelsSpec.angle.value === 270) {
            labelsSpec.baseline = { value: (channel === channel_1.X || channel === channel_1.COLUMN) ? 'middle' : 'bottom' };
        }
        else if (labelsSpec.angle.value === 90) {
            labelsSpec.baseline = { value: 'bottom' };
        }
    }
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;

},{"../../channel":44,"../../type":123,"../../util":124,"../common":48}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axis_1 = require("../../axis");
var encode = require("./encode");
var rules = require("./rules");
var util_1 = require("../../util");
var AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
function parseAxisComponent(model, axisChannels) {
    return axisChannels.reduce(function (axis, channel) {
        var vgAxes = [];
        if (model.axis(channel)) {
            var main = parseMainAxis(channel, model);
            if (main && isVisibleAxis(main)) {
                vgAxes.push(main);
            }
            var grid = parseGridAxis(channel, model);
            if (grid && isVisibleAxis(grid)) {
                vgAxes.push(grid);
            }
            if (vgAxes.length > 0) {
                axis[channel] = vgAxes;
            }
        }
        return axis;
    }, {});
}
exports.parseAxisComponent = parseAxisComponent;
function isFalseOrNull(v) {
    return v === false || v === null;
}
/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis) {
    return util_1.some(AXIS_PARTS, function (part) { return hasAxisPart(axis, part); });
}
function hasAxisPart(axis, part) {
    // FIXME this method can be wrong if users use a Vega theme.
    // (Not sure how to correctly handle that yet.).
    if (part === 'grid' || part === 'title') {
        return !!axis[part];
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(axis[part]);
}
/**
 * Make an inner axis for showing grid for shared axis.
 */
function parseGridAxis(channel, model) {
    // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
    return parseAxis(channel, model, true);
}
exports.parseGridAxis = parseGridAxis;
function parseMainAxis(channel, model) {
    return parseAxis(channel, model, false);
}
exports.parseMainAxis = parseMainAxis;
function parseAxis(channel, model, isGridAxis) {
    var axis = model.axis(channel);
    var vgAxis = {
        scale: model.scaleName(channel)
    };
    // 1.2. Add properties
    axis_1.AXIS_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, axis, channel, model, isGridAxis);
        if (value !== undefined) {
            vgAxis[property] = value;
        }
    });
    // Special case for gridScale since gridScale is not a Vega-Lite Axis property.
    var gridScale = getSpecifiedOrDefaultValue('gridScale', axis, channel, model, isGridAxis);
    if (gridScale !== undefined) {
        vgAxis.gridScale = gridScale;
    }
    // 2) Add guide encode definition groups
    var encodeSpec = axis.encode || {};
    AXIS_PARTS.forEach(function (part) {
        if (!hasAxisPart(vgAxis, part)) {
            // No need to create encode for a disabled part.
            return;
        }
        // TODO(@yuhanlu): instead of calling encode[part], break this line based on part type
        // as different require different parameters.
        var value;
        if (part === 'labels') {
            value = encode.labels(model, channel, encodeSpec.labels || {}, vgAxis);
        }
        else {
            value = encodeSpec[part] || {};
        }
        if (value !== undefined && util_1.keys(value).length > 0) {
            vgAxis.encode = vgAxis.encode || {};
            vgAxis.encode[part] = { update: value };
        }
    });
    return vgAxis;
}
function getSpecifiedOrDefaultValue(property, specifiedAxis, channel, model, isGridAxis) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'labels':
            return isGridAxis ? false : specifiedAxis[property];
        case 'domain':
            return rules.domain(property, specifiedAxis, isGridAxis, channel);
        case 'ticks':
            return rules.ticks(property, specifiedAxis, isGridAxis, channel);
        case 'format':
            return rules.format(specifiedAxis, channel, fieldDef, model.config);
        case 'grid':
            return rules.grid(model, channel, isGridAxis); // FIXME: refactor this
        case 'gridScale':
            return rules.gridScale(model, channel, isGridAxis);
        case 'orient':
            return rules.orient(specifiedAxis, channel);
        case 'tickCount':
            return rules.tickCount(specifiedAxis, channel, fieldDef); // TODO: scaleType
        case 'title':
            return rules.title(specifiedAxis, fieldDef, model.config, isGridAxis);
        case 'values':
            return rules.values(specifiedAxis);
        case 'zindex':
            return rules.zindex(specifiedAxis, isGridAxis);
    }
    // Otherwise, return specified property.
    return specifiedAxis[property];
}

},{"../../axis":42,"../../util":124,"./encode":45,"./rules":47}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
function format(specifiedAxis, channel, fieldDef, config) {
    return common_1.numberFormat(fieldDef, specifiedAxis.format, config, channel);
}
exports.format = format;
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function gridShow(model, channel) {
    var grid = model.axis(channel).grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.hasDiscreteScale(channel) && !model.fieldDef(channel).bin;
}
exports.gridShow = gridShow;
function grid(model, channel, isGridAxis) {
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        // never apply grid for ROW and COLUMN since we manually create rule-group for them
        return false;
    }
    if (!isGridAxis) {
        return undefined;
    }
    return gridShow(model, channel);
}
exports.grid = grid;
function gridScale(model, channel, isGridAxis) {
    if (isGridAxis) {
        var gridChannel = channel === 'x' ? 'y' : 'x';
        if (model.scale(gridChannel)) {
            return model.scaleName(gridChannel);
        }
    }
    return undefined;
}
exports.gridScale = gridScale;
function orient(specifiedAxis, channel) {
    var orient = specifiedAxis.orient;
    if (orient) {
        return orient;
    }
    switch (channel) {
        case channel_1.COLUMN:
            // FIXME test and decide
            return 'top';
        case channel_1.X:
            return 'bottom';
        case channel_1.ROW:
        case channel_1.Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
exports.orient = orient;
function tickCount(specifiedAxis, channel, fieldDef) {
    var count = specifiedAxis.tickCount;
    if (count !== undefined) {
        return count;
    }
    // FIXME depends on scale type too
    if (channel === channel_1.X && !fieldDef.bin) {
        // Vega's default tickCount often lead to a lot of label occlusion on X without 90 degree rotation
        return 5;
    }
    return undefined;
}
exports.tickCount = tickCount;
function title(specifiedAxis, fieldDef, config, isGridAxis) {
    if (isGridAxis) {
        return undefined;
    }
    if (specifiedAxis.title !== undefined) {
        return specifiedAxis.title;
    }
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fielddef_1.title(fieldDef, config);
    var maxLength = specifiedAxis.titleMaxLength;
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
function values(specifiedAxis) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return datetime_1.timestamp(dt, true);
        });
    }
    return vals;
}
exports.values = values;
function zindex(specifiedAxis, isGridAxis) {
    var z = specifiedAxis.zindex;
    if (z !== undefined) {
        return z;
    }
    if (isGridAxis) {
        // if grid is true, need to put layer on the back so that grid is behind marks
        return 0;
    }
    return 1; // otherwise return undefined and use Vega's default.
}
exports.zindex = zindex;
function domainAndTicks(property, specifiedAxis, isGridAxis, channel) {
    if (isGridAxis || channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return false;
    }
    return specifiedAxis[property];
}
exports.domainAndTicks = domainAndTicks;
exports.domain = domainAndTicks;
exports.ticks = domainAndTicks;

},{"../../channel":44,"../../datetime":107,"../../fielddef":110,"../../log":113,"../../util":124,"../common":48}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var type_1 = require("../type");
var util_1 = require("../util");
var spec_1 = require("../spec");
var timeunit_1 = require("../timeunit");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var unit_1 = require("./unit");
function buildModel(spec, parent, parentGivenName, config) {
    if (spec_1.isFacetSpec(spec)) {
        return new facet_1.FacetModel(spec, parent, parentGivenName, config);
    }
    if (spec_1.isLayerSpec(spec)) {
        return new layer_1.LayerModel(spec, parent, parentGivenName, config);
    }
    if (spec_1.isUnitSpec(spec)) {
        return new unit_1.UnitModel(spec, parent, parentGivenName, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.buildModel = buildModel;
function applyConfig(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList) {
    propsList.forEach(function (property) {
        var value = config[property];
        if (value !== undefined) {
            e[property] = { value: value };
        }
    });
    return e;
}
exports.applyConfig = applyConfig;
function applyMarkConfig(e, model, propsList) {
    propsList.forEach(function (property) {
        var value = getMarkConfig(property, model.mark(), model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    });
    return e;
}
exports.applyMarkConfig = applyMarkConfig;
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
function getMarkConfig(prop, mark, config) {
    var markSpecificConfig = config[mark];
    if (markSpecificConfig[prop] !== undefined) {
        return markSpecificConfig[prop];
    }
    return config.mark[prop];
}
exports.getMarkConfig = getMarkConfig;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
function numberFormat(fieldDef, format, config, channel) {
    if (fieldDef.type === type_1.QUANTITATIVE) {
        // add number format for quantitative type only
        if (format) {
            return format;
        }
        else if (fieldDef.aggregate === 'count' && channel === channel_1.TEXT) {
            // FIXME: need a more holistic way to deal with this.
            return 'd';
        }
        // TODO: need to make this work correctly for numeric ordinal / nominal type
        return config.numberFormat;
    }
    return undefined;
}
exports.numberFormat = numberFormat;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig) {
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        var _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
        return "timeFormat(" + field + ", '" + _format + "')";
    }
    else {
        return timeunit_1.formatExpression(timeUnit, field, shortTimeLabels);
    }
}
exports.timeFormatExpression = timeFormatExpression;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
function sortParams(orderDef) {
    return (util_1.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(fielddef_1.field(orderChannelDef, { binSuffix: 'start' }));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
exports.sortParams = sortParams;

},{"../channel":44,"../fielddef":110,"../log":113,"../spec":118,"../timeunit":120,"../type":123,"../util":124,"./facet":65,"./layer":66,"./unit":103}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
var config_1 = require("../config");
var data_1 = require("../data");
var log = require("../log");
var spec_1 = require("../spec");
var toplevelprops_1 = require("../toplevelprops");
var util_1 = require("../util");
var common_1 = require("./common");
var selection_1 = require("./selection/selection");
function compile(inputSpec, logger) {
    if (logger) {
        // set the singleton logger to the provided logger
        log.set(logger);
    }
    try {
        // 1. Convert input spec into a normal form
        // (Decompose all extended unit specs into composition of unit spec.)
        var spec = spec_1.normalize(inputSpec);
        // 2. Instantiate the model with default config
        var config = config_1.initConfig(inputSpec.config);
        var model = common_1.buildModel(spec, null, '', config);
        // 3. Parse each part of the model to produce components that will be assembled later
        // We traverse the whole tree to parse once for each type of components
        // (e.g., data, layout, mark, scale).
        // Please see inside model.parse() for order for compilation.
        model.parse();
        // 4. Assemble a Vega Spec from the parsed components in 3.
        return assemble(model, getTopLevelProperties(inputSpec, config));
    }
    finally {
        // Reset the singleton logger if a logger is provided
        if (logger) {
            log.reset();
        }
    }
}
exports.compile = compile;
function getTopLevelProperties(topLevelSpec, config) {
    return tslib_1.__assign({}, toplevelprops_1.extractTopLevelProperties(config), toplevelprops_1.extractTopLevelProperties(topLevelSpec));
}
function assemble(model, topLevelProperties) {
    // TODO: change type to become VgSpec
    var output = util_1.extend({
        $schema: 'http://vega.github.io/schema/vega/v3.0.json',
    }, { autosize: 'pad' }, // Currently we don't support custom autosize
    topLevelProperties, {
        // Map calculated layout width and height to width and height signals.
        signals: [
            {
                name: 'width',
                update: "data('" + model.getName(data_1.LAYOUT) + "')[0]." + model.getName('width')
            },
            {
                name: 'height',
                update: "data('" + model.getName(data_1.LAYOUT) + "')[0]." + model.getName('height')
            }
        ].concat(selection_1.assembleTopLevelSignals(model))
    }, {
        data: [].concat(model.assembleData(), model.assembleLayout([]), model.assembleSelectionData([])),
        marks: [assembleRootGroup(model)]
    });
    return {
        spec: output
        // TODO: add warning / errors here
    };
}
function assembleRootGroup(model) {
    var rootGroup = util_1.extend({
        name: model.getName('main-group'),
        type: 'group',
    }, model.description ? { description: model.description } : {}, {
        from: { data: model.getName(data_1.LAYOUT) },
        encode: {
            update: util_1.extend({
                width: { field: model.getName('width') },
                height: { field: model.getName('height') }
            }, model.assembleParentGroupProperties(model.config.cell))
        }
    });
    return util_1.extend(rootGroup, model.assembleGroup());
}
exports.assembleRootGroup = assembleRootGroup;

},{"../config":105,"../data":106,"../log":113,"../spec":118,"../toplevelprops":121,"../util":124,"./common":48,"./selection/selection":93,"tslib":38}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
function addDimension(dims, fieldDef) {
    if (fieldDef.bin) {
        dims[fielddef_1.field(fieldDef, { binSuffix: 'start' })] = true;
        dims[fielddef_1.field(fieldDef, { binSuffix: 'end' })] = true;
        // const scale = model.scale(channel);
        // if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
        // also produce bin_range if the binned field use ordinal scale
        dims[fielddef_1.field(fieldDef, { binSuffix: 'range' })] = true;
        // }
    }
    else {
        dims[fielddef_1.field(fieldDef)] = true;
    }
    return dims;
}
function mergeMeasures(parentMeasures, childMeasures) {
    for (var field_1 in childMeasures) {
        if (childMeasures.hasOwnProperty(field_1)) {
            // when we merge a measure, we either have to add an aggregation operator or even a new field
            var ops = childMeasures[field_1];
            for (var op in ops) {
                if (ops.hasOwnProperty(op)) {
                    if (field_1 in parentMeasures) {
                        // add operator to existing measure field
                        parentMeasures[field_1][op] = true;
                    }
                    else {
                        parentMeasures[field_1] = { op: true };
                    }
                }
            }
        }
    }
}
var AggregateNode = (function (_super) {
    tslib_1.__extends(AggregateNode, _super);
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict set of aggregation functions
     */
    function AggregateNode(dimensions, measures) {
        var _this = _super.call(this) || this;
        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }
    AggregateNode.prototype.clone = function () {
        return new AggregateNode(util_1.extend({}, this.dimensions), util_1.duplicate(this.measures));
    };
    AggregateNode.make = function (model) {
        var isAggregate = false;
        model.forEachFieldDef(function (fd) {
            if (fd.aggregate) {
                isAggregate = true;
            }
        });
        var meas = {};
        var dims = {};
        if (!isAggregate) {
            // no need to create this node if the model has no aggregation
            return null;
        }
        model.forEachFieldDef(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    /* tslint:disable:no-string-literal */
                    meas['*']['count'] = true;
                    /* tslint:enable:no-string-literal */
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                    // add min/max so we can use their union as unaggregated domain
                    var scale = model.scale(channel);
                    if (scale && scale.domain === 'unaggregated') {
                        meas[fieldDef.field]['min'] = true;
                        meas[fieldDef.field]['max'] = true;
                    }
                }
            }
            else {
                addDimension(dims, fieldDef);
            }
        });
        if ((Object.keys(dims).length + Object.keys(meas).length) === 0) {
            return null;
        }
        return new AggregateNode(dims, meas);
    };
    AggregateNode.prototype.merge = function (other) {
        if (!util_1.differ(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            other.remove();
        }
        else {
            log.debug('different dimensions, cannot merge');
        }
    };
    AggregateNode.prototype.addDimensions = function (fields) {
        var _this = this;
        fields.forEach(function (f) { return _this.dimensions[f] = true; });
    };
    AggregateNode.prototype.dependentFields = function () {
        var out = {};
        util_1.keys(this.dimensions).forEach(function (f) { return out[f] = true; });
        util_1.keys(this.measures).forEach(function (m) { return out[m] = true; });
        return out;
    };
    AggregateNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        util_1.keys(this.measures).forEach(function (field) {
            util_1.keys(_this.measures[field]).forEach(function (op) {
                out[op + "_" + field] = true;
            });
        });
        return out;
    };
    AggregateNode.prototype.assemble = function () {
        var _this = this;
        var ops = [];
        var fields = [];
        util_1.keys(this.measures).forEach(function (field) {
            util_1.keys(_this.measures[field]).forEach(function (op) {
                ops.push(op);
                fields.push(field);
            });
        });
        return {
            type: 'aggregate',
            groupby: util_1.keys(this.dimensions),
            ops: ops,
            fields: fields
        };
    };
    return AggregateNode;
}(dataflow_1.DataFlowNode));
exports.AggregateNode = AggregateNode;

},{"../../fielddef":110,"../../log":113,"../../util":124,"./dataflow":53,"tslib":38}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var util_1 = require("../../util");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var formatparse_1 = require("./formatparse");
var nonpositivefilter_1 = require("./nonpositivefilter");
var nullfilter_1 = require("./nullfilter");
var optimizers_1 = require("./optimizers");
var optimizers = require("./optimizers");
var pathorder_1 = require("./pathorder");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var transforms_1 = require("./transforms");
exports.FACET_SCALE_PREFIX = 'scale_';
/**
 * Start optimization path from the root. Useful for removing nodes.
 */
function removeUnnecessaryNodes(node) {
    // remove empty non positive filter
    if (node instanceof nonpositivefilter_1.NonPositiveFilterNode && util_1.every(util_1.vals(node.filter), function (b) { return b === false; })) {
        node.remove();
    }
    // remove empty null filter nodes
    if (node instanceof nullfilter_1.NullFilterNode && util_1.every(util_1.vals(node.filteredFields), function (f) { return f === null; })) {
        node.remove();
    }
    // remove output nodes that are not required
    if (node instanceof dataflow_1.OutputNode && !node.required) {
        node.remove();
    }
    node.children.forEach(removeUnnecessaryNodes);
}
/**
 * Clones the subtree and ignores output nodes except for the leafs, which are renamed.
 */
function cloneSubtree(facet) {
    function clone(node) {
        if (!(node instanceof pathorder_1.OrderNode)) {
            var copy_1 = node.clone();
            if (copy_1 instanceof dataflow_1.OutputNode) {
                var newName = exports.FACET_SCALE_PREFIX + facet.model.getName(copy_1.source);
                copy_1.source = newName;
                facet.model.component.data.outputNodes[newName] = copy_1;
                util_1.flatten(node.children.map(clone)).forEach(function (n) { return n.parent = copy_1; });
            }
            else if (copy_1 instanceof aggregate_1.AggregateNode || copy_1 instanceof stack_1.StackNode) {
                copy_1.addDimensions(facet.fields);
                util_1.flatten(node.children.map(clone)).forEach(function (n) { return n.parent = copy_1; });
            }
            else {
                util_1.flatten(node.children.map(clone)).forEach(function (n) { return n.parent = copy_1; });
            }
            return [copy_1];
        }
        return util_1.flatten(node.children.map(clone));
    }
    return clone;
}
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
function moveFacetDown(node) {
    if (node instanceof facet_1.FacetNode) {
        if (node.numChildren() === 1 && !(node.children[0] instanceof dataflow_1.OutputNode)) {
            // move down until we hit a fork or output node
            var child = node.children[0];
            if (child instanceof aggregate_1.AggregateNode || child instanceof stack_1.StackNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            moveMainDownToFacet(node.model.component.data.main);
            // replicate the subtree and place it before the facet's main node
            var copy = util_1.flatten(node.children.map(cloneSubtree(node)));
            copy.forEach(function (c) { return c.parent = node.model.component.data.main; });
        }
    }
    else {
        node.children.forEach(moveFacetDown);
    }
}
function moveMainDownToFacet(node) {
    if (node instanceof dataflow_1.OutputNode && node.type === data_1.MAIN) {
        if (node.numChildren() === 1) {
            var child = node.children[0];
            if (!(child instanceof facet_1.FacetNode)) {
                child.swapWithParent();
                moveMainDownToFacet(node);
            }
        }
    }
}
/**
 * Return all leaf nodes.
 */
function getLeaves(roots) {
    var leaves = [];
    function append(node) {
        if (node.numChildren() === 0) {
            leaves.push(node);
        }
        else {
            node.children.forEach(append);
        }
    }
    roots.forEach(append);
    return leaves;
}
/**
 * Print debug information for dataflow tree.
 */
function debug(node) {
    console.log("" + node.constructor.name + (node.debugName ? " (" + node.debugName + ")" : '') + " -> " + (node.children.map(function (c) {
        return "" + c.constructor.name + (c.debugName ? " (" + c.debugName + ")" : '');
    })));
    console.log(node);
    node.children.forEach(debug);
}
function makeWalkTree(data) {
    // to name datasources
    var datasetIndex = 0;
    /**
     * Recursively walk down the tree.
     */
    function walkTree(node, dataSource) {
        if (node instanceof formatparse_1.ParseNode) {
            if (node.parent instanceof source_1.SourceNode && dataSource.format) {
                dataSource.format.parse = node.assemble();
            }
            else {
                throw new Error('Can only instantiate parse next to source.');
            }
        }
        if (node instanceof facet_1.FacetNode) {
            if (!dataSource.name) {
                dataSource.name = "data_" + datasetIndex++;
            }
            if (!dataSource.source || dataSource.transform.length > 0) {
                data.push(dataSource);
                node.data = dataSource.name;
            }
            else {
                node.data = dataSource.source;
            }
            node.assemble().forEach(function (d) { return data.push(d); });
            // break here because the rest of the tree has to be taken care of by the facet.
            return;
        }
        if (node instanceof transforms_1.FilterNode ||
            node instanceof nullfilter_1.NullFilterNode ||
            node instanceof transforms_1.CalculateNode ||
            node instanceof aggregate_1.AggregateNode ||
            node instanceof pathorder_1.OrderNode) {
            dataSource.transform.push(node.assemble());
        }
        if (node instanceof nonpositivefilter_1.NonPositiveFilterNode ||
            node instanceof bin_1.BinNode ||
            node instanceof timeunit_1.TimeUnitNode ||
            node instanceof stack_1.StackNode) {
            dataSource.transform = dataSource.transform.concat(node.assemble());
        }
        if (node instanceof dataflow_1.OutputNode) {
            if (dataSource.source && dataSource.transform.length === 0) {
                node.source = dataSource.source;
            }
            else if (node.parent instanceof dataflow_1.OutputNode) {
                // Note that an output node may be required but we still do not assemble a
                // separate data source for it.
                node.source = dataSource.name;
                throw new Error('cannot happen');
            }
            else {
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }
                // Here we set the name of the datasource we generated. From now on
                // other assemblers can use it.
                node.source = dataSource.name;
                // if this node has more than one child, we will add a datasource automatically
                if (node.numChildren() === 1 && dataSource.transform.length > 0) {
                    data.push(dataSource);
                    var newData = {
                        name: null,
                        source: dataSource.name,
                        transform: []
                    };
                    dataSource = newData;
                }
            }
        }
        switch (node.numChildren()) {
            case 0:
                // done
                if (!dataSource.source || dataSource.transform.length > 0) {
                    // do not push empty datasources that are simply references
                    data.push(dataSource);
                }
                break;
            case 1:
                walkTree(node.children[0], dataSource);
                break;
            default:
                var source_2 = dataSource.name;
                if (!dataSource.source || dataSource.transform.length > 0) {
                    data.push(dataSource);
                }
                else {
                    source_2 = dataSource.source;
                }
                node.children.forEach(function (child) {
                    var newData = {
                        name: null,
                        source: source_2,
                        transform: []
                    };
                    walkTree(child, newData);
                });
                break;
        }
    }
    return walkTree;
}
/**
 * Assemble data sources that are derived from faceted data.
 */
function assembleFacetData(root) {
    var data = [];
    var walkTree = makeWalkTree(data);
    root.children.forEach(function (child) { return walkTree(child, {
        source: root.name,
        name: null,
        transform: []
    }); });
    return data;
}
exports.assembleFacetData = assembleFacetData;
/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
function assembleData(roots) {
    var data = [];
    roots.forEach(removeUnnecessaryNodes);
    // parse needs to be next to sources
    getLeaves(roots).forEach(optimizers_1.optimizeFromLeaves(optimizers.parse));
    roots.forEach(moveFacetDown);
    // roots.forEach(debug);
    var walkTree = makeWalkTree(data);
    var sourceIndex = 0;
    roots.forEach(function (root) {
        // assign a name if the source does not have a name yet
        if (!root.hasName()) {
            root.dataName = "source_" + sourceIndex++;
        }
        var newData = root.assemble();
        walkTree(root, newData);
    });
    return data;
}
exports.assembleData = assembleData;

},{"../../data":106,"../../util":124,"./aggregate":50,"./bin":52,"./dataflow":53,"./facet":54,"./formatparse":55,"./nonpositivefilter":56,"./nullfilter":57,"./optimizers":58,"./pathorder":60,"./source":61,"./stack":62,"./timeunit":63,"./transforms":64}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
function numberFormatExpr(expr, format) {
    return "format(" + expr + ", '" + format + "')";
}
function rangeFormula(model, fieldDef, channel) {
    var discreteDomain = scale_1.hasDiscreteDomain(model.scale(channel).type);
    if (discreteDomain) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var format = (model.axis(channel) || model.legend(channel) || {}).format ||
            model.config.numberFormat;
        var startField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'start' });
        var endField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: numberFormatExpr(startField, format) + " + ' - ' + " + numberFormatExpr(endField, format)
        };
    }
    return {};
}
var BinNode = (function (_super) {
    tslib_1.__extends(BinNode, _super);
    function BinNode(bins) {
        var _this = _super.call(this) || this;
        _this.bins = bins;
        return _this;
    }
    BinNode.prototype.clone = function () {
        return new BinNode(util_1.duplicate(this.bins));
    };
    BinNode.make = function (model) {
        var bins = model.reduceFieldDef(function (binComponent, fieldDef, channel) {
            var fieldDefBin = model.fieldDef(channel).bin;
            if (fieldDefBin) {
                var bin = util_1.isBoolean(fieldDefBin) ? {} : fieldDefBin;
                var key = bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field;
                if (!(key in binComponent)) {
                    binComponent[key] = {
                        bin: bin,
                        field: fieldDef.field,
                        as: [fielddef_1.field(fieldDef, { binSuffix: 'start' }), fielddef_1.field(fieldDef, { binSuffix: 'end' })],
                        signal: util_1.varName(model.getName(key + "_bins")),
                        extentSignal: model.getName(key + '_extent')
                    };
                }
                binComponent[key] = tslib_1.__assign({}, binComponent[key], rangeFormula(model, fieldDef, channel));
            }
            return binComponent;
        }, {});
        if (Object.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(bins);
    };
    BinNode.prototype.merge = function (other) {
        this.bins = util_1.extend(other.bins);
        other.remove();
    };
    BinNode.prototype.producedFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            c.as.forEach(function (f) { return out[f] = true; });
        });
        return out;
    };
    BinNode.prototype.dependentFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            out[c.field] = true;
        });
        return out;
    };
    BinNode.prototype.assemble = function () {
        return util_1.flatten(util_1.vals(this.bins).map(function (bin) {
            var transform = [];
            var binTrans = tslib_1.__assign({ type: 'bin', field: bin.field, as: bin.as, signal: bin.signal }, bin.bin);
            if (!bin.bin.extent) {
                transform.push({
                    type: 'extent',
                    field: bin.field,
                    signal: bin.extentSignal
                });
                binTrans.extent = { signal: bin.extentSignal };
            }
            transform.push(binTrans);
            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }
            return transform;
        }));
    };
    return BinNode;
}(dataflow_1.DataFlowNode));
exports.BinNode = BinNode;

},{"../../bin":43,"../../fielddef":110,"../../scale":115,"../../util":124,"./dataflow":53,"tslib":38}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * A node in the dataflow tree.
 */
var DataFlowNode = (function () {
    function DataFlowNode(debugName) {
        this.debugName = debugName;
        this._children = [];
        this._parent = null;
    }
    /**
     * Clone this node with a deep copy.
     */
    DataFlowNode.prototype.clone = function () {
        throw new Error('Cannot clone node');
    };
    /**
     * Set of fields that are being created by this node.
     */
    DataFlowNode.prototype.producedFields = function () {
        return {};
    };
    DataFlowNode.prototype.dependentFields = function () {
        return {};
    };
    Object.defineProperty(DataFlowNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        /**
         * Set the parent of the node and also add this not to the parent's children.
         */
        set: function (parent) {
            this._parent = parent;
            parent.addChild(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataFlowNode.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    DataFlowNode.prototype.numChildren = function () {
        return this._children.length;
    };
    DataFlowNode.prototype.addChild = function (child) {
        this._children.push(child);
    };
    DataFlowNode.prototype.removeChild = function (oldChild) {
        this._children.splice(this._children.indexOf(oldChild), 1);
    };
    /**
     * Remove node from the dataflow.
     */
    DataFlowNode.prototype.remove = function () {
        var _this = this;
        this._children.forEach(function (child) { return child.parent = _this._parent; });
        this._parent.removeChild(this);
    };
    DataFlowNode.prototype.swapWithParent = function () {
        var parent = this._parent;
        var newParent = parent.parent;
        // reconnect the children
        this._children.forEach(function (c) { return c.parent = parent; });
        // remove old links
        this._children = []; // equivalent to removing every child link one by one
        parent.removeChild(this);
        parent.parent.removeChild(parent);
        // swap two nodes
        this.parent = newParent;
        parent.parent = this;
    };
    return DataFlowNode;
}());
exports.DataFlowNode = DataFlowNode;
var OutputNode = (function (_super) {
    tslib_1.__extends(OutputNode, _super);
    function OutputNode(source, type) {
        var _this = _super.call(this, source) || this;
        _this.type = type;
        _this._refcount = 0;
        _this._source = source;
        return _this;
    }
    OutputNode.prototype.clone = function () {
        var cloneObj = new this.constructor;
        cloneObj._source = this._source;
        cloneObj.debugName = 'clone_' + this.debugName;
        cloneObj._refcount = this._refcount;
        return cloneObj;
    };
    Object.defineProperty(OutputNode.prototype, "source", {
        /**
         * Request the datasource name.
         *
         * During the parsing phase, this will return the simple name such as 'main' or 'raw'.
         * It is crucial to request the name from an output node to mark it as a required node.
         * If nobody ever requests the name, this datasource will not be instantiated in the assemble phase.
         *
         * In the assemble phase, this will return the correct name.
         */
        get: function () {
            this._refcount++;
            return this._source;
        },
        set: function (source) {
            this._source = source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputNode.prototype, "required", {
        get: function () {
            return this._refcount > 0;
        },
        enumerable: true,
        configurable: true
    });
    return OutputNode;
}(DataFlowNode));
exports.OutputNode = OutputNode;

},{"tslib":38}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var dataflow_1 = require("./dataflow");
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = (function (_super) {
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(model, name, data) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        if (model.facet.column) {
            _this.columnField = model.field(channel_1.COLUMN);
            _this.columnName = model.getName('column');
        }
        if (model.facet.row) {
            _this.rowField = model.field(channel_1.ROW);
            _this.rowName = model.getName('row');
        }
        return _this;
    }
    Object.defineProperty(FacetNode.prototype, "fields", {
        get: function () {
            var fields = [];
            if (this.columnField) {
                fields.push(this.columnField);
            }
            if (this.rowField) {
                fields.push(this.rowField);
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetNode.prototype, "source", {
        /**
         * The name to reference this source is its name
         */
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    FacetNode.prototype.assemble = function () {
        var data = [];
        if (this.columnName) {
            data.push({
                name: this.columnName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: [this.columnField]
                    }]
            });
        }
        if (this.rowName) {
            data.push({
                name: this.rowName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: [this.rowField]
                    }]
            });
        }
        return data;
    };
    return FacetNode;
}(dataflow_1.DataFlowNode));
exports.FacetNode = FacetNode;

},{"../../channel":44,"./dataflow":53,"tslib":38}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var filter_1 = require("../../filter");
var type_1 = require("../../type");
var util_1 = require("../../util");
var transform_1 = require("../../transform");
var dataflow_1 = require("./dataflow");
var ParseNode = (function (_super) {
    tslib_1.__extends(ParseNode, _super);
    function ParseNode(parse) {
        var _this = _super.call(this) || this;
        _this._parse = {};
        _this._parse = parse;
        return _this;
    }
    ParseNode.make = function (model) {
        var parse = {};
        var calcFieldMap = model.transforms.filter(transform_1.isCalculate).reduce(function (fieldMap, formula) {
            fieldMap[formula.as] = true;
            return fieldMap;
        }, {});
        // Parse filter fields
        model.transforms.filter(transform_1.isFilter).forEach(function (transform) {
            var filter = transform.filter;
            if (!util_1.isArray(filter)) {
                filter = [filter];
            }
            filter.forEach(function (f) {
                var val = null;
                // For EqualFilter, just use the equal property.
                // For RangeFilter and OneOfFilter, all array members should have
                // the same type, so we only use the first one.
                if (filter_1.isEqualFilter(f)) {
                    val = f.equal;
                }
                else if (filter_1.isRangeFilter(f)) {
                    val = f.range[0];
                }
                else if (filter_1.isOneOfFilter(f)) {
                    val = (f.oneOf || f['in'])[0];
                } // else -- for filter expression, we can't infer anything
                if (val) {
                    if (datetime_1.isDateTime(val)) {
                        parse[f['field']] = 'date';
                    }
                    else if (util_1.isNumber(val)) {
                        parse[f['field']] = 'number';
                    }
                    else if (util_1.isString(val)) {
                        parse[f['field']] = 'string';
                    }
                }
            });
        });
        // Parse encoded fields
        model.forEachFieldDef(function (fieldDef) {
            if (fieldDef.type === type_1.TEMPORAL) {
                parse[fieldDef.field] = 'date';
            }
            else if (fieldDef.type === type_1.QUANTITATIVE) {
                if (fielddef_1.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                    return;
                }
                parse[fieldDef.field] = 'number';
            }
        });
        // Custom parse should override inferred parse
        var data = model.data;
        if (data && data_1.isUrlData(data) && data.format && data.format.parse) {
            var p_1 = data.format.parse;
            util_1.keys(p_1).forEach(function (field) {
                parse[field] = p_1[field];
            });
        }
        return new ParseNode(parse);
    };
    Object.defineProperty(ParseNode.prototype, "parse", {
        get: function () {
            return this._parse;
        },
        enumerable: true,
        configurable: true
    });
    ParseNode.prototype.merge = function (other) {
        this._parse = util_1.extend(this._parse, other.parse);
        other.remove();
    };
    ParseNode.prototype.assemble = function () {
        return this._parse;
    };
    return ParseNode;
}(dataflow_1.DataFlowNode));
exports.ParseNode = ParseNode;

},{"../../data":106,"../../datetime":107,"../../fielddef":110,"../../filter":111,"../../transform":122,"../../type":123,"../../util":124,"./dataflow":53,"tslib":38}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var NonPositiveFilterNode = (function (_super) {
    tslib_1.__extends(NonPositiveFilterNode, _super);
    function NonPositiveFilterNode(filter) {
        var _this = _super.call(this) || this;
        _this._filter = filter;
        return _this;
    }
    NonPositiveFilterNode.prototype.clone = function () {
        return new NonPositiveFilterNode(util_1.extend({}, this._filter));
    };
    NonPositiveFilterNode.make = function (model) {
        var filter = model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);
            if (!scale || !model.field(channel)) {
                // don't set anything
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.type === scale_1.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
        if (!Object.keys(filter).length) {
            return null;
        }
        return new NonPositiveFilterNode(filter);
    };
    Object.defineProperty(NonPositiveFilterNode.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        enumerable: true,
        configurable: true
    });
    NonPositiveFilterNode.prototype.assemble = function () {
        var _this = this;
        return util_1.keys(this._filter).filter(function (field) {
            // Only filter fields (keys) with value = true
            return _this._filter[field];
        }).map(function (field) {
            return {
                type: 'filter',
                expr: 'datum["' + field + '"] > 0'
            };
        });
    };
    return NonPositiveFilterNode;
}(dataflow_1.DataFlowNode));
exports.NonPositiveFilterNode = NonPositiveFilterNode;

},{"../../scale":115,"../../util":124,"./dataflow":53,"tslib":38}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var DEFAULT_NULL_FILTERS = {
    nominal: false,
    ordinal: false,
    quantitative: true,
    temporal: true
};
var NullFilterNode = (function (_super) {
    tslib_1.__extends(NullFilterNode, _super);
    function NullFilterNode(fields) {
        var _this = _super.call(this) || this;
        _this._filteredFields = fields;
        return _this;
    }
    NullFilterNode.prototype.clone = function () {
        return new NullFilterNode(util_1.duplicate(this._filteredFields));
    };
    NullFilterNode.make = function (model) {
        var fields = model.reduceFieldDef(function (aggregator, fieldDef) {
            if (fieldDef.aggregate !== 'count') {
                if (model.config.filterInvalid ||
                    (model.config.filterInvalid === undefined && (fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type]))) {
                    aggregator[fieldDef.field] = fieldDef;
                }
                else {
                    // define this so we know that we don't filter nulls for this field
                    // this makes it easier to merge into parents
                    aggregator[fieldDef.field] = null;
                }
            }
            return aggregator;
        }, {});
        if (Object.keys(fields).length === 0) {
            return null;
        }
        return new NullFilterNode(fields);
    };
    Object.defineProperty(NullFilterNode.prototype, "filteredFields", {
        get: function () {
            return this._filteredFields;
        },
        enumerable: true,
        configurable: true
    });
    NullFilterNode.prototype.merge = function (other) {
        var _this = this;
        var t = Object.keys(this._filteredFields).map(function (k) { return k + ' ' + util_1.hash(_this._filteredFields[k]); });
        var o = Object.keys(other.filteredFields).map(function (k) { return k + ' ' + util_1.hash(other.filteredFields[k]); });
        if (!util_1.differArray(t, o)) {
            this._filteredFields = util_1.extend(this._filteredFields, other._filteredFields);
            other.remove();
        }
    };
    NullFilterNode.prototype.assemble = function () {
        var _this = this;
        var filters = util_1.keys(this._filteredFields).reduce(function (_filters, field) {
            var fieldDef = _this._filteredFields[field];
            if (fieldDef !== null) {
                _filters.push('datum["' + fieldDef.field + '"] !== null');
                if (util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
                    // TODO(https://github.com/vega/vega-lite/issues/1436):
                    // We can be even smarter and add NaN filter for N,O that are numbers
                    // based on the `parse` property once we have it.
                    _filters.push('!isNaN(datum["' + fieldDef.field + '"])');
                }
            }
            return _filters;
        }, []);
        return filters.length > 0 ?
            {
                type: 'filter',
                expr: filters.join(' && ')
            } : null;
    };
    return NullFilterNode;
}(dataflow_1.DataFlowNode));
exports.NullFilterNode = NullFilterNode;

},{"../../type":123,"../../util":124,"./dataflow":53,"tslib":38}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
/**
 * Start optimization path at the leaves. Useful for merging up things.
 */
function optimizeFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node.parent instanceof source_1.SourceNode) {
            return;
        }
        else if (!node || !node.parent) {
            throw new Error('A source node cannot have parents and roots haev to be source nodes.');
        }
        var next = node.parent;
        f(node);
        optimizeNextFromLeaves(next);
    }
    return optimizeNextFromLeaves;
}
exports.optimizeFromLeaves = optimizeFromLeaves;
function parse(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof formatparse_1.ParseNode) {
        if (parent instanceof formatparse_1.ParseNode) {
            parent.merge(node);
        }
        else {
            node.swapWithParent();
        }
    }
}
exports.parse = parse;

},{"./formatparse":55,"./source":61}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var facet_1 = require("../facet");
var unit_1 = require("../unit");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var facet_2 = require("./facet");
var formatparse_1 = require("./formatparse");
var nonpositivefilter_1 = require("./nonpositivefilter");
var nullfilter_1 = require("./nullfilter");
var pathorder_1 = require("./pathorder");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var transforms_1 = require("./transforms");
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        var source = new source_1.SourceNode(model);
        var hash = source.hash();
        if (hash in sources) {
            // use a reference if we already have a source
            return sources[hash];
        }
        else {
            // otherwise add a new one
            sources[hash] = source;
            return source;
        }
    }
    else {
        // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
        return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
    }
}
/*
Description of the dataflow (http://asciiflow.com/):

     +--------+
     | Source |
     +---+----+
         |
         v
       Parse
         |
         v
     Transforms
(Filter, Compute, ...)
         |
         v
     Null Filter
         |
         v
      Binning
         |
         v
     Timeunit
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
     Aggregate
         |
         v
       Stack
         |
         v
      >0 Filter
         |
         v
     Path Order
         |
         v
   +----------+
   |   Main   +----> Layout
   +----------+
         |
         v
     +-------+
     | Facet |----> Child data...
     +-------+

*/
function parseData(model) {
    var root = parseRoot(model, model.component.data.sources);
    var outputNodes = model.component.data.outputNodes;
    // the current head of the tree that we are appending to
    var head = root;
    var parse = formatparse_1.ParseNode.make(model);
    parse.parent = root;
    head = parse;
    if (model.transforms.length > 0) {
        var _a = transforms_1.parseTransformArray(model), first = _a.first, last = _a.last;
        first.parent = head;
        head = last;
    }
    var nullFilter = nullfilter_1.NullFilterNode.make(model);
    if (nullFilter) {
        nullFilter.parent = head;
        head = nullFilter;
    }
    var bin = bin_1.BinNode.make(model);
    if (bin) {
        bin.parent = head;
        head = bin;
    }
    var tu = timeunit_1.TimeUnitNode.make(model);
    if (tu) {
        tu.parent = head;
        head = tu;
    }
    // add an output node pre aggregation
    var rawName = model.getName(data_1.RAW);
    var raw = new dataflow_1.OutputNode(rawName, data_1.RAW);
    outputNodes[rawName] = raw;
    raw.parent = head;
    head = raw;
    if (model instanceof unit_1.UnitModel) {
        var agg = aggregate_1.AggregateNode.make(model);
        if (agg) {
            agg.parent = head;
            head = agg;
        }
    }
    if (model instanceof unit_1.UnitModel) {
        var stack = stack_1.StackNode.make(model);
        if (stack) {
            stack.parent = head;
            head = stack;
        }
    }
    var nonPosFilter = nonpositivefilter_1.NonPositiveFilterNode.make(model);
    if (nonPosFilter) {
        nonPosFilter.parent = head;
        head = nonPosFilter;
    }
    if (model instanceof unit_1.UnitModel) {
        var order = pathorder_1.OrderNode.make(model);
        if (order) {
            order.parent = head;
            head = order;
        }
    }
    // output node for marks
    var mainName = model.getName(data_1.MAIN);
    var main = new dataflow_1.OutputNode(mainName, data_1.MAIN);
    outputNodes[mainName] = main;
    main.parent = head;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (model instanceof facet_1.FacetModel) {
        var facetName = model.getName('facet');
        facetRoot = new facet_2.FacetNode(model, facetName, main.source);
        outputNodes[facetName] = facetRoot;
        facetRoot.parent = head;
        head = facetRoot;
    }
    return {
        sources: model.component.data.sources,
        outputNodes: outputNodes,
        main: main,
        facetRoot: facetRoot
    };
}
exports.parseData = parseData;

},{"../../data":106,"../facet":65,"../unit":103,"./aggregate":50,"./bin":52,"./dataflow":53,"./facet":54,"./formatparse":55,"./nonpositivefilter":56,"./nullfilter":57,"./pathorder":60,"./source":61,"./stack":62,"./timeunit":63,"./transforms":64}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
var OrderNode = (function (_super) {
    tslib_1.__extends(OrderNode, _super);
    function OrderNode(sort) {
        var _this = _super.call(this) || this;
        _this.sort = sort;
        return _this;
    }
    OrderNode.prototype.clone = function () {
        return new OrderNode(util_1.duplicate(this.sort));
    };
    OrderNode.make = function (model) {
        var sort = null;
        if (util_1.contains(['line', 'area'], model.mark())) {
            if (model.mark() === 'line' && model.channelHasField('order')) {
                // For only line, sort by the order field if it is specified.
                sort = common_1.sortParams(model.encoding.order);
            }
            else {
                // For both line and area, we sort values based on dimension by default
                var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
                var s = model.sort(dimensionChannel);
                var sortField = sort_1.isSortField(s) ?
                    fielddef_1.field({
                        // FIXME: this op might not already exist?
                        // FIXME: what if dimensionChannel (x or y) contains custom domain?
                        aggregate: encoding_1.isAggregate(model.encoding) ? s.op : undefined,
                        field: s.field
                    }) :
                    model.field(dimensionChannel, { binSuffix: 'start' });
                sort = {
                    field: sortField,
                    order: 'descending'
                };
            }
        }
        else {
            return null;
        }
        return new OrderNode(sort);
    };
    OrderNode.prototype.assemble = function () {
        return {
            type: 'collect',
            sort: this.sort
        };
    };
    return OrderNode;
}(dataflow_1.DataFlowNode));
exports.OrderNode = OrderNode;

},{"../../encoding":108,"../../fielddef":110,"../../sort":117,"../../util":124,"../common":48,"./dataflow":53,"tslib":38}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var SourceNode = (function (_super) {
    tslib_1.__extends(SourceNode, _super);
    function SourceNode(model) {
        var _this = _super.call(this) || this;
        var data = model.data || { name: 'source' };
        if (data_1.isInlineData(data)) {
            _this._data = {
                values: data.values,
                format: { type: 'json' }
            };
        }
        else if (data_1.isUrlData(data)) {
            // Extract extension from URL using snippet from
            // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
            var defaultExtension = /(?:\.([^.]+))?$/.exec(data.url)[1];
            if (!util_1.contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
                defaultExtension = 'json';
            }
            var dataFormat = data.format || {};
            // For backward compatibility for former `data.formatType` property
            var formatType = dataFormat.type || data['formatType'];
            var property = dataFormat.property, feature = dataFormat.feature, mesh = dataFormat.mesh;
            var format = tslib_1.__assign({ type: formatType ? formatType : defaultExtension }, (property ? { property: property } : {}), (feature ? { feature: feature } : {}), (mesh ? { mesh: mesh } : {}));
            _this._data = {
                url: data.url,
                format: format
            };
        }
        else if (data_1.isNamedData(data)) {
            _this._name = data.name;
        }
        return _this;
    }
    Object.defineProperty(SourceNode.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    SourceNode.prototype.hasName = function () {
        return !!this._name;
    };
    Object.defineProperty(SourceNode.prototype, "dataName", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return a unique identifir for this data source.
     */
    SourceNode.prototype.hash = function () {
        if (data_1.isInlineData(this._data)) {
            return util_1.hash(this._data);
        }
        else if (data_1.isUrlData) {
            return this._data.url + " " + util_1.hash(this._data.format);
        }
        else if (data_1.isNamedData) {
            return this._data.name;
        }
        throw new Error('Unsupported source');
    };
    SourceNode.prototype.assemble = function () {
        return tslib_1.__assign({ name: this._name }, this._data, { transform: [] });
    };
    return SourceNode;
}(dataflow_1.DataFlowNode));
exports.SourceNode = SourceNode;

},{"../../data":106,"../../util":124,"./dataflow":53,"tslib":38}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
        var channel = by.channel;
        var fieldDef = by.fieldDef;
        var scale = model.scale(channel);
        var _field = fielddef_1.field(fieldDef, {
            binSuffix: scale && scale_1.hasDiscreteDomain(scale.type) ? 'range' : 'start'
        });
        if (_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
var StackNode = (function (_super) {
    tslib_1.__extends(StackNode, _super);
    function StackNode(stack) {
        var _this = _super.call(this) || this;
        _this._stack = stack;
        return _this;
    }
    StackNode.prototype.clone = function () {
        return new StackNode(util_1.duplicate(this._stack));
    };
    StackNode.make = function (model) {
        var stackProperties = model.stack;
        if (!stackProperties) {
            return null;
        }
        var groupby = [];
        if (stackProperties.groupbyChannel) {
            var groupbyFieldDef = model.fieldDef(stackProperties.groupbyChannel);
            if (groupbyFieldDef.bin) {
                // For Bin, we need to add both start and end to ensure that both get imputed
                // and included in the stack output (https://github.com/vega/vega-lite/issues/1805).
                groupby.push(model.field(stackProperties.groupbyChannel, { binSuffix: 'start' }));
                groupby.push(model.field(stackProperties.groupbyChannel, { binSuffix: 'end' }));
            }
            else {
                groupby.push(model.field(stackProperties.groupbyChannel));
            }
        }
        var stackby = getStackByFields(model);
        var orderDef = model.encoding.order;
        var sort;
        if (orderDef) {
            sort = common_1.sortParams(orderDef);
        }
        else {
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce(function (s, field) {
                s.field.push(field);
                s.order.push('descending');
                return s;
            }, { field: [], order: [] });
        }
        return new StackNode({
            groupby: groupby,
            field: model.field(stackProperties.fieldChannel),
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: util_1.contains(['area', 'line'], model.mark()),
        });
    };
    Object.defineProperty(StackNode.prototype, "stack", {
        get: function () {
            return this._stack;
        },
        enumerable: true,
        configurable: true
    });
    StackNode.prototype.addDimensions = function (fields) {
        this._stack.groupby = this._stack.groupby.concat(fields);
    };
    StackNode.prototype.dependentFields = function () {
        var out = {};
        out[this._stack.field] = true;
        this._stack.groupby.forEach(function (f) { return out[f] = true; });
        var field = this._stack.sort.field;
        vega_util_1.isArray(field) ? field.forEach(function (f) { return out[f] = true; }) : out[field] = true;
        return out;
    };
    StackNode.prototype.producedFields = function () {
        var out = {};
        out[this._stack.field + '_start'] = true;
        out[this._stack.field + '_end'] = true;
        return out;
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var stack = this._stack;
        // Impute
        if (stack.impute) {
            transform.push({
                type: 'impute',
                field: stack.field,
                groupby: stack.stackby,
                orderby: stack.groupby,
                method: 'value',
                value: 0
            });
        }
        // Stack
        transform.push({
            type: 'stack',
            groupby: stack.groupby,
            field: stack.field,
            sort: stack.sort,
            as: [
                stack.field + '_start',
                stack.field + '_end'
            ],
            offset: stack.offset
        });
        return transform;
    };
    return StackNode;
}(dataflow_1.DataFlowNode));
exports.StackNode = StackNode;

},{"../../fielddef":110,"../../scale":115,"../../util":124,"../common":48,"./dataflow":53,"tslib":38,"vega-util":128}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var timeunit_1 = require("../../timeunit");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var TimeUnitNode = (function (_super) {
    tslib_1.__extends(TimeUnitNode, _super);
    function TimeUnitNode(formula) {
        var _this = _super.call(this) || this;
        _this.formula = formula;
        return _this;
    }
    TimeUnitNode.prototype.clone = function () {
        return new TimeUnitNode(util_1.duplicate(this.formula));
    };
    TimeUnitNode.make = function (model) {
        var formula = model.reduceFieldDef(function (timeUnitComponent, fieldDef) {
            if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
                var f = fielddef_1.field(fieldDef);
                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }
            return timeUnitComponent;
        }, {});
        if (Object.keys(formula).length === 0) {
            return null;
        }
        return new TimeUnitNode(formula);
    };
    TimeUnitNode.prototype.merge = function (other) {
        this.formula = util_1.extend(this.formula, other.formula);
        other.remove();
    };
    TimeUnitNode.prototype.producedFields = function () {
        var out = {};
        util_1.vals(this.formula).forEach(function (f) {
            out[f.as] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.dependentFields = function () {
        var out = {};
        util_1.vals(this.formula).forEach(function (f) {
            out[f.field] = true;
        });
        return out;
    };
    TimeUnitNode.prototype.assemble = function () {
        return util_1.vals(this.formula).map(function (c) {
            return {
                type: 'formula',
                as: c.as,
                expr: timeunit_1.fieldExpr(c.timeUnit, c.field)
            };
        });
    };
    return TimeUnitNode;
}(dataflow_1.DataFlowNode));
exports.TimeUnitNode = TimeUnitNode;

},{"../../fielddef":110,"../../timeunit":120,"../../type":123,"../../util":124,"./dataflow":53,"tslib":38}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var filter_1 = require("../../filter");
var log = require("../../log");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterNode = (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(filter) {
        var _this = _super.call(this) || this;
        _this.filter = filter;
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(util_1.duplicate(this.filter));
    };
    FilterNode.prototype.merge = function (other) {
        this.filter = (vega_util_1.isArray(this.filter) ? this.filter : [this.filter]).concat(vega_util_1.isArray(other.filter) ? other.filter : [other.filter]);
        this.remove();
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: filter_1.expression(this.filter)
        };
    };
    return FilterNode;
}(dataflow_1.DataFlowNode));
exports.FilterNode = FilterNode;
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(transform) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(util_1.duplicate(this.transform));
    };
    CalculateNode.prototype.producedFields = function () {
        var out = {};
        out[this.transform.as] = true;
        return out;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    return CalculateNode;
}(dataflow_1.DataFlowNode));
exports.CalculateNode = CalculateNode;
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(model) {
    var first;
    var last;
    var node;
    var previous;
    model.transforms.forEach(function (t, i) {
        if (transform_1.isCalculate(t)) {
            node = new CalculateNode(t);
        }
        else if (transform_1.isFilter(t)) {
            node = new FilterNode(t.filter);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        if (i === 0) {
            first = node;
        }
        else {
            node.parent = previous;
        }
        previous = node;
    });
    last = node;
    return { first: first, last: last };
}
exports.parseTransformArray = parseTransformArray;

},{"../../filter":111,"../../log":113,"../../transform":122,"../../util":124,"./dataflow":53,"tslib":38,"vega-util":128}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var data_1 = require("../data");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var parse_1 = require("./axis/parse");
var rules_1 = require("./axis/rules");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_2 = require("./data/parse");
var layout_1 = require("./layout");
var model_1 = require("./model");
var init_1 = require("./scale/init");
var parse_3 = require("./scale/parse");
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.stack = null;
        _this._spacing = {};
        var child = _this.child = common_1.buildModel(spec.spec, _this, _this.getName('child'), config);
        _this.children = [child];
        var facet = _this.facet = _this.initFacet(spec.facet);
        _this.scales = _this.initScalesAndSpacing(facet, _this.config);
        _this.axes = _this.initAxis(facet, _this.config, child);
        _this.legends = {};
        return _this;
    }
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        return encoding_1.reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                return normalizedFacet;
            }
            // TODO: array of row / column ?
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                return normalizedFacet;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            normalizedFacet[channel] = fielddef_1.normalize(fieldDef, channel);
            return normalizedFacet;
        }, {});
    };
    FacetModel.prototype.initScalesAndSpacing = function (facet, config) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_scale, channel) {
            if (facet[channel]) {
                _scale[channel] = init_1.default(channel, facet[channel], config, undefined, // Facet doesn't have one single mark
                undefined, // TODO(#1647): support width / height here
                [] // There is no xyRangeSteps here and there is no need to input
                );
                model._spacing[channel] = spacing(facet[channel].scale || {}, model, config);
            }
            return _scale;
        }, {});
    };
    FacetModel.prototype.initAxis = function (facet, config, child) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_axis, channel) {
            if (facet[channel]) {
                var axisSpec = facet[channel].axis;
                if (axisSpec !== false) {
                    var axisConfig = config.facet !== undefined && config.facet.axis !== undefined ? config.facet.axis : {};
                    var modelAxis = _axis[channel] = tslib_1.__assign({}, axisSpec, axisConfig);
                    if (channel === channel_1.ROW) {
                        var yAxis = child.axis(channel_1.Y);
                        if (yAxis && yAxis.orient !== 'right' && modelAxis.orient === undefined) {
                            modelAxis.orient = 'right';
                        }
                        if (model.hasDescendantWithFieldOnChannel(channel_1.X) && modelAxis.labelAngle === undefined) {
                            modelAxis.labelAngle = modelAxis.orient === 'right' ? 90 : 270;
                        }
                    }
                }
            }
            return _axis;
        }, {});
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this.facet[channel];
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.component.data = parse_2.parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseSelection = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    FacetModel.prototype.parseLayoutData = function () {
        this.child.parseLayoutData();
        this.component.layout = layout_1.parseFacetLayout(this);
    };
    FacetModel.prototype.parseScale = function () {
        var _this = this;
        var child = this.child;
        var model = this;
        child.parseScale();
        // First, add scale for row and column.
        var scaleComponent = this.component.scales = parse_3.default(this);
        // Then, move shared/union from its child spec.
        util_1.keys(child.component.scales).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                var scale = scaleComponent[channel] = child.component.scales[channel];
                var scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
                var newName = model.scaleName(scaleNameWithoutPrefix, true);
                child.renameScale(scale.name, newName);
                scale.name = newName;
                // Replace the scale domain with data output from a cloned subtree after the facet.
                var domain = scale.domain;
                if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
                    domain.data = assemble_1.FACET_SCALE_PREFIX + _this.getName(domain.data);
                }
                else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
                    domain.fields = domain.fields.map(function (f) {
                        return tslib_1.__assign({}, f, { data: assemble_1.FACET_SCALE_PREFIX + _this.getName(f.data) });
                    });
                }
                // Once put in parent, just remove the child's scale.
                delete child.component.scales[channel];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child.parseMark();
        this.component.mark = [{
                name: this.getName('cell'),
                type: 'group',
                from: {
                    facet: {
                        name: this.component.data.facetRoot.name,
                        data: this.component.data.facetRoot.data,
                        groupby: [].concat(this.channelHasField(channel_1.ROW) ? [this.field(channel_1.ROW)] : [], this.channelHasField(channel_1.COLUMN) ? [this.field(channel_1.COLUMN)] : [])
                    }
                },
                encode: {
                    update: getFacetGroupProperties(this)
                }
            }];
    };
    FacetModel.prototype.parseAxis = function () {
        this.child.parseAxis();
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.ROW, channel_1.COLUMN]);
    };
    FacetModel.prototype.parseAxisGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseAxisGroup();
        var xAxisGroup = parseAxisGroups(this, channel_1.X);
        var yAxisGroup = parseAxisGroups(this, channel_1.Y);
        this.component.axisGroups = util_1.extend(xAxisGroup ? { x: xAxisGroup } : {}, yAxisGroup ? { y: yAxisGroup } : {});
    };
    FacetModel.prototype.parseGridGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseGridGroup();
        var child = this.child;
        this.component.gridGroups = util_1.extend(!child.channelHasField(channel_1.X) && this.channelHasField(channel_1.COLUMN) ? { column: getColumnGridGroups(this) } : {}, !child.channelHasField(channel_1.Y) && this.channelHasField(channel_1.ROW) ? { row: getRowGridGroups(this) } : {});
    };
    FacetModel.prototype.parseLegend = function () {
        this.child.parseLegend();
        // TODO: support legend for independent non-position scale across facets
        // TODO: support legend for field reference of parent data (e.g., for SPLOM)
        // For now, assuming that non-positional scales are always shared across facets
        // Thus, just move all legends from its child
        this.component.legends = this.child.component.legends;
        this.child.component.legends = {};
    };
    FacetModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleSignals = function (signals) {
        return [];
    };
    FacetModel.prototype.assembleSelectionData = function (data) {
        return [];
    };
    FacetModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this.child.assembleLayout(layoutData);
        return layout_1.assembleLayout(this, layoutData);
    };
    FacetModel.prototype.assembleMarks = function () {
        var data = assemble_1.assembleFacetData(this.component.data.facetRoot);
        var mark = this.component.mark[0];
        // correct the name of the faceted data source
        mark.from.facet.name = this.component.data.facetRoot.name;
        mark.from.facet.data = this.component.data.facetRoot.data;
        var marks = [].concat(
        // axisGroup is a mapping to VgMarkGroup
        util_1.vals(this.component.axisGroups), util_1.flatten(util_1.vals(this.component.gridGroups)), util_1.extend(mark, data.length > 0 ? { data: data } : {}, this.child.assembleGroup()));
        return marks.map(this.correctDataNames);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    FacetModel.prototype.spacing = function (channel) {
        return this._spacing[channel];
    };
    FacetModel.prototype.isFacet = function () {
        return true;
    };
    return FacetModel;
}(model_1.Model));
exports.FacetModel = FacetModel;
function hasSubPlotWithXy(model) {
    return model.hasDescendantWithFieldOnChannel('x') ||
        model.hasDescendantWithFieldOnChannel('y');
}
exports.hasSubPlotWithXy = hasSubPlotWithXy;
function spacing(scale, model, config) {
    if (scale.spacing !== undefined) {
        return scale.spacing;
    }
    if (!hasSubPlotWithXy(model)) {
        // If there is no subplot with x/y, it's a simple table so there should be no spacing.
        return 0;
    }
    return config.scale.facetSpacing;
}
exports.spacing = spacing;
function getFacetGroupProperties(model) {
    var child = model.child;
    var mergedCellConfig = util_1.extend({}, child.config.cell, child.config.facet.cell);
    return util_1.extend({
        x: model.channelHasField(channel_1.COLUMN) ? {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.COLUMN) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        y: model.channelHasField(channel_1.ROW) ? {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.ROW) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        width: { field: { parent: model.child.sizeName('width') } },
        height: { field: { parent: model.child.sizeName('height') } }
    }, hasSubPlotWithXy(model) ? child.assembleParentGroupProperties(mergedCellConfig) : {});
}
// TODO: move the rest of the file src/compile/facet/*.ts
function parseAxisGroups(model, channel) {
    // TODO: add a case where inner spec is not a unit (facet/layer/concat)
    var axisGroup = null;
    var child = model.child;
    if (child.channelHasField(channel)) {
        if (child.axis(channel)) {
            if (true) {
                // add a group for the shared axes
                axisGroup = getSharedAxisGroup(model, channel);
                if (child.axis(channel) && rules_1.gridShow(child, channel)) {
                    // add inner axis (aka axis that shows only grid to )
                    child.component.axes[channel] = [parse_1.parseGridAxis(channel, child)];
                }
                else {
                    // Delete existing child axes
                    delete child.component.axes[channel];
                }
            }
            else {
                // TODO: implement independent axes support
            }
        }
    }
    return axisGroup;
}
function getSharedAxisGroup(model, channel) {
    var isX = channel === 'x';
    var facetChannel = isX ? 'column' : 'row';
    var hasFacet = !!model.facet[facetChannel];
    var axesGroup = {
        name: model.getName(channel + '-axes'),
        type: 'group'
    };
    if (hasFacet) {
        // Need to drive this with special data source that has one item for each column/row value.
        // TODO: We might only need to drive this with special data source if there are both row and column
        // However, it might be slightly difficult as we have to merge this with the main group.
        axesGroup.from = { data: channel === 'x' ? model.getName('column') : model.getName('row') };
    }
    if (isX) {
        axesGroup.encode = {
            update: {
                width: { field: { parent: model.child.sizeName('width') } },
                height: { field: { group: 'height' } },
                x: hasFacet ? {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN),
                    // offset by the spacing
                    offset: model.spacing(channel_1.COLUMN) / 2
                } : {
                    // TODO: support custom spacing here
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    else {
        axesGroup.encode = {
            update: {
                width: { field: { group: 'width' } },
                height: { field: { parent: model.child.sizeName('height') } },
                y: hasFacet ? {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW),
                    // offset by the spacing
                    offset: model.spacing(channel_1.ROW) / 2
                } : {
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    axesGroup.axes = [parse_1.parseMainAxis(channel, model.child)];
    return axesGroup;
}
exports.getSharedAxisGroup = getSharedAxisGroup;
function getRowGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var rowGrid = {
        name: model.getName('row-grid'),
        type: 'rule',
        from: {
            data: model.getDataName(data_1.MAIN)
        },
        encode: {
            update: {
                y: {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW)
                },
                x: { value: 0, offset: -facetGridConfig.offset },
                x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [rowGrid, {
            name: model.getName('row-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    y: { field: { group: 'height' } },
                    x: { value: 0, offset: -facetGridConfig.offset },
                    x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
function getColumnGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var columnGrid = {
        name: model.getName('column-grid'),
        type: 'rule',
        from: {
            data: model.getDataName(data_1.MAIN)
        },
        encode: {
            update: {
                x: {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN)
                },
                y: { value: 0, offset: -facetGridConfig.offset },
                y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [columnGrid, {
            name: model.getName('column-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    x: { field: { group: 'width' } },
                    y: { value: 0, offset: -facetGridConfig.offset },
                    y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}

},{"../channel":44,"../data":106,"../encoding":108,"../fielddef":110,"../log":113,"../util":124,"../vega.schema":126,"./axis/parse":46,"./axis/rules":47,"./common":48,"./data/assemble":51,"./data/parse":59,"./layout":67,"./model":83,"./scale/init":86,"./scale/parse":87,"tslib":38}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("../mark");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var layout_1 = require("./layout");
var model_1 = require("./model");
var domain_1 = require("./scale/domain");
var LayerModel = (function (_super) {
    tslib_1.__extends(LayerModel, _super);
    function LayerModel(spec, parent, parentGivenName, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.stack = null;
        _this.width = spec.width;
        _this.height = spec.height;
        _this.children = spec.layer.map(function (layer, i) {
            // FIXME: this is not always the case
            // we know that the model has to be a unit model because we pass in a unit spec
            return common_1.buildModel(layer, _this, _this.getName('layer_' + i), config);
        });
        return _this;
    }
    LayerModel.prototype.channelHasField = function (channel) {
        // layer does not have any channels
        return false;
    };
    LayerModel.prototype.hasDiscreteScale = function (channel) {
        // since we assume shared scales we can just ask the first child
        return this.children[0].hasDiscreteScale(channel);
    };
    LayerModel.prototype.fieldDef = function (channel) {
        return null; // layer does not have field defs
    };
    LayerModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    };
    LayerModel.prototype.parseSelection = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    LayerModel.prototype.parseLayoutData = function () {
        // TODO: correctly union ordinal scales rather than just using the layout of the first child
        this.children.forEach(function (child) {
            child.parseLayoutData();
        });
        this.component.layout = layout_1.parseLayerLayout(this);
    };
    LayerModel.prototype.parseScale = function () {
        var model = this;
        var scaleComponent = this.component.scales = {};
        this.children.forEach(function (child) {
            child.parseScale();
            // FIXME(#1602): correctly implement independent scale
            // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error
            if (true) {
                util_1.keys(child.component.scales).forEach(function (channel) {
                    var childScale = child.component.scales[channel];
                    var modelScale = scaleComponent[channel];
                    if (!childScale || vega_schema_1.isSignalRefDomain(childScale.domain) || (modelScale && vega_schema_1.isSignalRefDomain(modelScale.domain))) {
                        // TODO: merge signal ref domains
                        return;
                    }
                    if (modelScale) {
                        modelScale.domain = domain_1.unionDomains(modelScale.domain, childScale.domain);
                    }
                    else {
                        scaleComponent[channel] = childScale;
                    }
                    // rename child scale to parent scales
                    var scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
                    var newName = model.scaleName(scaleNameWithoutPrefix, true);
                    child.renameScale(childScale.name, newName);
                    childScale.name = newName;
                    // remove merged scales from children
                    delete child.component.scales[channel];
                });
            }
        });
    };
    LayerModel.prototype.parseMark = function () {
        this.children.forEach(function (child) {
            child.parseMark();
        });
    };
    LayerModel.prototype.parseAxis = function () {
        var axisComponent = this.component.axes = {};
        this.children.forEach(function (child) {
            child.parseAxis();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.axes).forEach(function (channel) {
                    // TODO: support multiple axes for shared scale
                    // just use the first axis definition for each channel
                    if (!axisComponent[channel]) {
                        axisComponent[channel] = child.component.axes[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.parseAxisGroup = function () {
        return null;
    };
    LayerModel.prototype.parseGridGroup = function () {
        return null;
    };
    LayerModel.prototype.parseLegend = function () {
        var legendComponent = this.component.legends = {};
        this.children.forEach(function (child) {
            child.parseLegend();
            // TODO: correctly implement independent axes
            if (true) {
                util_1.keys(child.component.legends).forEach(function (channel) {
                    // just use the first legend definition for each channel
                    if (!legendComponent[channel]) {
                        legendComponent[channel] = child.component.legends[channel];
                    }
                });
            }
        });
    };
    LayerModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    LayerModel.prototype.assembleSignals = function (signals) {
        return [];
    };
    LayerModel.prototype.assembleSelectionData = function (data) {
        return [];
    };
    LayerModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    LayerModel.prototype.assembleScales = function () {
        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _super.prototype.assembleScales.call(this));
    };
    LayerModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this.children.forEach(function (child) {
            child.assembleLayout(layoutData);
        });
        return layout_1.assembleLayout(this, layoutData);
    };
    LayerModel.prototype.assembleMarks = function () {
        // only children have marks
        return util_1.flatten(this.children.map(function (child) {
            return child.assembleMarks();
        }));
    };
    LayerModel.prototype.channels = function () {
        return [];
    };
    LayerModel.prototype.getMapping = function () {
        return null;
    };
    LayerModel.prototype.isLayer = function () {
        return true;
    };
    return LayerModel;
}(model_1.Model));
exports.LayerModel = LayerModel;

},{"../mark":114,"../util":124,"../vega.schema":126,"./common":48,"./data/assemble":51,"./data/parse":59,"./layout":67,"./model":83,"./scale/domain":85,"tslib":38}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var data_1 = require("../data");
var scale_1 = require("../scale");
var util_1 = require("../util");
function assembleLayout(model, layoutData) {
    var layoutComponent = model.component.layout;
    if (!layoutComponent.width && !layoutComponent.height) {
        return layoutData; // Do nothing
    }
    if (true) {
        var distinctFields = util_1.keys(util_1.extend(layoutComponent.width.distinct, layoutComponent.height.distinct));
        var formula = layoutComponent.width.formula.concat(layoutComponent.height.formula)
            .map(function (f) {
            return tslib_1.__assign({ type: 'formula' }, f);
        });
        return [
            distinctFields.length > 0 ? {
                name: model.getName(data_1.LAYOUT),
                source: model.lookupDataSource(layoutComponent.width.source || layoutComponent.height.source),
                transform: [{
                        type: 'aggregate',
                        fields: distinctFields,
                        ops: distinctFields.map(function () { return 'distinct'; })
                    }].concat(formula)
            } : {
                name: model.getName(data_1.LAYOUT),
                values: [{}],
                transform: formula
            }
        ];
    }
    // FIXME: implement
    // otherwise, we need to join width and height (cross)
}
exports.assembleLayout = assembleLayout;
// FIXME: for nesting x and y, we need to declare x,y layout separately before joining later
// For now, let's always assume shared scale
function parseUnitLayout(model) {
    return {
        width: parseUnitSizeLayout(model, channel_1.X),
        height: parseUnitSizeLayout(model, channel_1.Y)
    };
}
exports.parseUnitLayout = parseUnitLayout;
function parseUnitSizeLayout(model, channel) {
    var distinct = getDistinct(model, channel);
    return {
        source: util_1.keys(distinct).length > 0 ? model.getDataName(data_1.MAIN) : null,
        distinct: distinct,
        formula: [{
                as: model.channelSizeName(channel),
                expr: unitSizeExpr(model, channel)
            }]
    };
}
function unitSizeExpr(model, channel) {
    var scale = model.scale(channel);
    if (scale) {
        if (scale_1.hasDiscreteDomain(scale.type) && scale.rangeStep) {
            // If the spec has top level size or specified rangeStep = fit, it will be undefined here.
            var cardinality = cardinalityExpr(model, channel);
            var paddingOuter = scale.paddingOuter !== undefined ? scale.paddingOuter : scale.padding;
            var paddingInner = scale.type === 'band' ?
                // only band has real paddingInner
                (scale.paddingInner !== undefined ? scale.paddingInner : scale.padding) :
                // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
                // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
                1;
            var space = cardinality +
                (paddingInner ? " - " + paddingInner : '') +
                (paddingOuter ? " + 2*" + paddingOuter : '');
            // This formula is equivalent to
            // space = count - inner + outer * 2
            // range = rangeStep * (space > 0 ? space : 0)
            // in https://github.com/vega/vega-encode/blob/master/src/Scale.js#L112
            return "max(" + space + ", 0) * " + scale.rangeStep;
        }
    }
    return (channel === channel_1.X ? model.width : model.height) + '';
}
exports.unitSizeExpr = unitSizeExpr;
function parseFacetLayout(model) {
    return {
        width: parseFacetSizeLayout(model, channel_1.COLUMN),
        height: parseFacetSizeLayout(model, channel_1.ROW)
    };
}
exports.parseFacetLayout = parseFacetLayout;
function parseFacetSizeLayout(model, channel) {
    var childLayoutComponent = model.child.component.layout;
    var sizeType = channel === channel_1.ROW ? 'height' : 'width';
    var childSizeComponent = childLayoutComponent[sizeType];
    if (true) {
        // For shared scale, we can simply merge the layout into one data source
        var distinct = util_1.extend(getDistinct(model, channel), childSizeComponent.distinct);
        var formula = childSizeComponent.formula.concat([{
                as: model.channelSizeName(channel),
                expr: facetSizeFormula(model, channel, model.child.channelSizeName(channel))
            }]);
        delete childLayoutComponent[sizeType];
        return {
            source: model.getDataName(data_1.MAIN),
            distinct: distinct,
            formula: formula
        };
    }
    // FIXME implement independent scale as well
    // TODO: - also consider when children have different data source
}
function facetSizeFormula(model, channel, innerSize) {
    if (model.channelHasField(channel)) {
        return '(datum["' + innerSize + '"] + ' + model.spacing(channel) + ')' + ' * ' + cardinalityExpr(model, channel);
    }
    else {
        return 'datum["' + innerSize + '"] + ' + model.config.scale.facetSpacing; // need to add outer padding for facet
    }
}
function parseLayerLayout(model) {
    return {
        width: parseLayerSizeLayout(model, channel_1.X),
        height: parseLayerSizeLayout(model, channel_1.Y)
    };
}
exports.parseLayerLayout = parseLayerLayout;
function parseLayerSizeLayout(model, channel) {
    if (true) {
        // For shared scale, we can simply merge the layout into one data source
        // TODO: don't just take the layout from the first child
        var childLayoutComponent = model.children[0].component.layout;
        var sizeType_1 = channel === channel_1.Y ? 'height' : 'width';
        var childSizeComponent = childLayoutComponent[sizeType_1];
        var distinct = childSizeComponent.distinct;
        var formula = [{
                as: model.channelSizeName(channel),
                expr: childSizeComponent.formula[0].expr
            }];
        model.children.forEach(function (child) {
            delete child.component.layout[sizeType_1];
        });
        return {
            source: model.getDataName(data_1.MAIN),
            distinct: distinct,
            formula: formula
        };
    }
}
function getDistinct(model, channel) {
    if (model.channelHasField(channel) && model.hasDiscreteScale(channel)) {
        var scale = model.scale(channel);
        if (scale_1.hasDiscreteDomain(scale.type) && !(scale.domain instanceof Array)) {
            // if explicit domain is declared, use array length
            var distinctField = model.field(channel);
            var distinct = {};
            distinct[distinctField] = true;
            return distinct;
        }
    }
    return {};
}
function cardinalityExpr(model, channel) {
    var scale = model.scale(channel);
    if (scale.domain instanceof Array) {
        return scale.domain.length + '';
    }
    return model.field(channel, { datum: true, prefix: 'distinct' });
}
exports.cardinalityExpr = cardinalityExpr;

},{"../channel":44,"../data":106,"../scale":115,"../util":124,"tslib":38}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function symbols(fieldDef, symbolsSpec, model, channel) {
    var symbols = {};
    var mark = model.mark();
    switch (mark) {
        case mark_1.BAR:
        case mark_1.TICK:
        case mark_1.TEXT:
            symbols.shape = { value: 'square' };
            break;
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
            symbols.shape = { value: mark };
            break;
        case mark_1.POINT:
        case mark_1.LINE:
        case mark_1.AREA:
            // use default circle
            break;
    }
    var cfg = model.config;
    var filled = model.markDef.filled;
    var config = channel === channel_1.COLOR ?
        /* For color's legend, do not set fill (when filled) or stroke (when unfilled) property from config because the legend's `fill` or `stroke` scale should have precedence */
        util_1.without(mark_1.FILL_STROKE_CONFIG, [filled ? 'fill' : 'stroke', 'strokeDash', 'strokeDashOffset']) :
        /* For other legend, no need to omit. */
        mark_1.FILL_STROKE_CONFIG;
    config = util_1.without(config, ['strokeDash', 'strokeDashOffset']);
    common_1.applyMarkConfig(symbols, model, config);
    if (filled) {
        symbols.strokeWidth = { value: 0 };
    }
    var value;
    var colorDef = model.encoding.color;
    if (fielddef_1.isValueDef(colorDef)) {
        value = { value: colorDef.value };
    }
    if (value !== undefined) {
        // apply the value
        if (filled) {
            symbols.fill = value;
        }
        else {
            symbols.stroke = value;
        }
    }
    else if (channel !== channel_1.COLOR) {
        // For non-color legend, apply color config if there is no fill / stroke config.
        // (For color, do not override scale specified!)
        symbols[filled ? 'fill' : 'stroke'] = symbols[filled ? 'fill' : 'stroke'] ||
            { value: cfg.mark.color };
    }
    if (symbols.fill === undefined) {
        // fall back to mark config colors for legend fill
        if (cfg.mark.fill !== undefined) {
            symbols.fill = { value: cfg.mark.fill };
        }
        else if (cfg.mark.stroke !== undefined) {
            symbols.stroke = { value: cfg.mark.stroke };
        }
    }
    var shapeDef = model.encoding.shape;
    if (channel !== channel_1.SHAPE) {
        if (fielddef_1.isValueDef(shapeDef)) {
            symbols.shape = { value: shapeDef.value };
        }
    }
    symbols = util_1.extend(symbols, symbolsSpec || {});
    return util_1.keys(symbols).length > 0 ? symbols : undefined;
}
exports.symbols = symbols;
function labels(fieldDef, labelsSpec, model, channel) {
    var legend = model.legend(channel);
    var config = model.config;
    var labels = {};
    if (fieldDef.type === type_1.TEMPORAL) {
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, legend.format, config.legend.shortTimeLabels, config.timeFormat)
            }
        }, labelsSpec || {});
    }
    labels = util_1.extend(labels, labelsSpec || {});
    return util_1.keys(labels).length > 0 ? labels : undefined;
}
exports.labels = labels;

},{"../../channel":44,"../../fielddef":110,"../../mark":114,"../../type":123,"../../util":124,"../common":48}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var legend_1 = require("../../legend");
var util_1 = require("../../util");
var common_1 = require("../common");
var encode = require("./encode");
var rules = require("./rules");
function parseLegendComponent(model) {
    return [channel_1.COLOR, channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].reduce(function (legendComponent, channel) {
        if (model.legend(channel)) {
            legendComponent[channel] = parseLegend(model, channel);
        }
        return legendComponent;
    }, {});
}
exports.parseLegendComponent = parseLegendComponent;
function getLegendDefWithScale(model, channel) {
    // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
    switch (channel) {
        case channel_1.COLOR:
            var scale = model.scaleName(channel_1.COLOR);
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
        case channel_1.SIZE:
            return { size: model.scaleName(channel_1.SIZE) };
        case channel_1.SHAPE:
            return { shape: model.scaleName(channel_1.SHAPE) };
        case channel_1.OPACITY:
            return { opacity: model.scaleName(channel_1.OPACITY) };
    }
    return null;
}
function parseLegend(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    var def = getLegendDefWithScale(model, channel);
    legend_1.LEGEND_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, legend, channel, model);
        if (value !== undefined) {
            def[property] = value;
        }
    });
    // 2) Add mark property definition groups
    var encodeSpec = legend.encode || {};
    ['labels', 'legend', 'title', 'symbols'].forEach(function (part) {
        var value = encode[part] ?
            encode[part](fieldDef, encodeSpec[part], model, channel) :
            encodeSpec[part]; // no rule -- just default values
        if (value !== undefined && util_1.keys(value).length > 0) {
            def.encode = def.encode || {};
            def.encode[part] = { update: value };
        }
    });
    return def;
}
exports.parseLegend = parseLegend;
function getSpecifiedOrDefaultValue(property, specifiedLegend, channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'format':
            return common_1.numberFormat(fieldDef, specifiedLegend.format, model.config, channel);
        case 'title':
            return rules.title(specifiedLegend, fieldDef, model.config);
        case 'values':
            return rules.values(specifiedLegend);
        case 'type':
            return rules.type(specifiedLegend, fieldDef.type, channel, model.scale(channel).type);
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}

},{"../../channel":44,"../../legend":112,"../../util":124,"../common":48,"./encode":68,"./rules":70}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function title(legend, fieldDef, config) {
    if (legend.title !== undefined) {
        return legend.title;
    }
    return fielddef_1.title(fieldDef, config);
}
exports.title = title;
function values(legend) {
    var vals = legend.values;
    if (vals && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return datetime_1.timestamp(dt, true);
        });
    }
    return vals;
}
exports.values = values;
function type(legend, type, channel, scaleType) {
    if (legend.type) {
        return legend.type;
    }
    if (channel === channel_1.COLOR && ((type === 'quantitative' && !scale_1.isBinScale(scaleType)) || (type === 'temporal' && util_1.contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;

},{"../../channel":44,"../../datetime":107,"../../fielddef":110,"../../scale":115,"../../util":124}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.area = {
    vgMark: 'area',
    defaultRole: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']));
    }
};

},{"./mixins":76,"tslib":38}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.bar = {
    vgMark: 'rect',
    defaultRole: 'bar',
    encodeEntry: function (model) {
        var stack = model.stack;
        return tslib_1.__assign({}, x(model, stack), y(model, stack), mixins.color(model), mixins.nonPosition('opacity', model));
    }
};
function x(model, stack) {
    var config = model.config, width = model.width;
    var orient = model.markDef.orient;
    var sizeDef = model.encoding.size;
    var xDef = model.encoding.x;
    var xScaleName = model.scaleName(channel_1.X);
    var xScale = model.scale(channel_1.X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === 'horizontal') {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'));
    }
    else {
        if (fielddef_1.isFieldDef(xDef)) {
            if (!sizeDef && scale_1.isBinScale(xScale.type)) {
                return mixins.binnedPosition('x', model, config.bar.binSpacing);
            }
            else if (xScale.type === scale_1.ScaleType.BAND) {
                return mixins.bandPosition('x', model);
            }
        }
        // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
        return mixins.centeredBandPosition('x', model, tslib_1.__assign({}, ref.midX(width, config)), defaultSizeRef(xScaleName, model.scale(channel_1.X), config));
    }
}
function y(model, stack) {
    var config = model.config, encoding = model.encoding, height = model.height;
    var orient = model.markDef.orient;
    var sizeDef = encoding.size;
    var yDef = encoding.y;
    var yScaleName = model.scaleName(channel_1.Y);
    var yScale = model.scale(channel_1.Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient === 'vertical') {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'));
    }
    else {
        if (fielddef_1.isFieldDef(yDef)) {
            if (yDef.bin && !sizeDef) {
                return mixins.binnedPosition('y', model, config.bar.binSpacing);
            }
            else if (yScale.type === scale_1.ScaleType.BAND) {
                return mixins.bandPosition('y', model);
            }
        }
        return mixins.centeredBandPosition('y', model, ref.midY(height, config), defaultSizeRef(yScaleName, model.scale(channel_1.Y), config));
    }
}
function defaultSizeRef(scaleName, scale, config) {
    if (config.bar.discreteBandSize) {
        return { value: config.bar.discreteBandSize };
    }
    if (scale) {
        if (scale.type === scale_1.ScaleType.POINT) {
            if (scale.rangeStep !== null) {
                return { value: scale.rangeStep - 1 };
            }
            log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
        }
        else if (scale.type === scale_1.ScaleType.BAND) {
            return ref.band(scaleName);
        }
        else {
            return { value: config.bar.continuousBandSize };
        }
    }
    if (config.scale.rangeStep && config.scale.rangeStep !== null) {
        return { value: config.scale.rangeStep - 1 };
    }
    // TODO: this should depends on cell's width / height?
    return { value: 20 };
}

},{"../../channel":44,"../../fielddef":110,"../../log":113,"../../scale":115,"./mixins":76,"./valueref":82,"tslib":38}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function initMarkDef(mark, encoding, scale, config) {
    var markDef = mark_1.isMarkDef(mark) ? tslib_1.__assign({}, mark) : { type: mark };
    var specifiedOrient = markDef.orient || common_1.getMarkConfig('orient', markDef.type, config);
    markDef.orient = orient(markDef.type, encoding, scale, specifiedOrient);
    if (specifiedOrient !== undefined && specifiedOrient !== markDef.orient) {
        log.warn(log.message.orientOverridden(markDef.orient, specifiedOrient));
    }
    var specifiedFilled = markDef.filled;
    if (specifiedFilled === undefined) {
        markDef.filled = filled(markDef.type, config);
    }
    return markDef;
}
exports.initMarkDef = initMarkDef;
/**
 * Initialize encoding's value with some special default values
 */
function initEncoding(mark, encoding, stacked, config) {
    var opacityConfig = common_1.getMarkConfig('opacity', mark, config);
    if (!encoding.opacity && opacityConfig === undefined) {
        var opacity = defaultOpacity(mark, encoding, stacked);
        if (opacity !== undefined) {
            encoding.opacity = { value: opacity };
        }
    }
    return encoding;
}
exports.initEncoding = initEncoding;
function defaultOpacity(mark, encoding, stacked) {
    if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], mark)) {
        // point-based marks
        if (!encoding_1.isAggregate(encoding)) {
            return 0.7;
        }
    }
    return undefined;
}
function filled(mark, config) {
    var filledConfig = common_1.getMarkConfig('filled', mark, config);
    return filledConfig !== undefined ? filledConfig : mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
}
function orient(mark, encoding, scale, specifiedOrient) {
    switch (mark) {
        case mark_1.POINT:
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
        case mark_1.TEXT:
        case mark_1.RECT:
            // orient is meaningless for these marks.
            return undefined;
    }
    var yIsRange = encoding.y && encoding.y2;
    var xIsRange = encoding.x && encoding.x2;
    switch (mark) {
        case mark_1.TICK:
            var xScaleType = scale['x'] ? scale['x'].type : null;
            var yScaleType = scale['y'] ? scale['y'].type : null;
            // Tick is opposite to bar, line, area and never have ranged mark.
            if (!scale_1.hasDiscreteDomain(xScaleType) && (!encoding.y ||
                scale_1.hasDiscreteDomain(yScaleType) ||
                (fielddef_1.isFieldDef(encoding.y) && encoding.y.bin))) {
                return 'vertical';
            }
            // y:Q or Ambiguous case, return horizontal
            return 'horizontal';
        case mark_1.RULE:
        case mark_1.BAR:
        case mark_1.AREA:
            // If there are range for both x and y, y (vertical) has higher precedence.
            if (yIsRange) {
                return 'vertical';
            }
            else if (xIsRange) {
                return 'horizontal';
            }
            else if (mark === mark_1.RULE) {
                if (encoding.x && !encoding.y) {
                    return 'vertical';
                }
                else if (encoding.y && !encoding.x) {
                    return 'horizontal';
                }
            }
        /* tslint:disable */
        case mark_1.LINE:
            /* tslint:enable */
            var xIsContinuous = fielddef_1.isFieldDef(encoding.x) && fielddef_1.isContinuous(encoding.x);
            var yIsContinuous = fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y);
            if (xIsContinuous && !yIsContinuous) {
                return 'horizontal';
            }
            else if (!xIsContinuous && yIsContinuous) {
                return 'vertical';
            }
            else if (xIsContinuous && yIsContinuous) {
                var xDef = encoding.x; // we can cast here since they are surely fieldDef
                var yDef = encoding.y;
                var xIsTemporal = xDef.type === type_1.TEMPORAL;
                var yIsTemporal = yDef.type === type_1.TEMPORAL;
                // temporal without timeUnit is considered continuous, but better serves as dimension
                if (xIsTemporal && !yIsTemporal) {
                    return 'vertical';
                }
                else if (!xIsTemporal && yIsTemporal) {
                    return 'horizontal';
                }
                if (!xDef.aggregate && yDef.aggregate) {
                    return 'vertical';
                }
                else if (xDef.aggregate && !yDef.aggregate) {
                    return 'horizontal';
                }
                if (specifiedOrient) {
                    // When ambiguous, use user specified one.
                    return specifiedOrient;
                }
                if (!(mark === mark_1.LINE && encoding.order)) {
                    // Except for connected scatterplot, we should log warning for unclear orientation of QxQ plots.
                    log.warn(log.message.unclearOrientContinuous(mark));
                }
                return 'vertical';
            }
            else {
                // For Discrete x Discrete case, return undefined.
                log.warn(log.message.unclearOrientDiscreteOrEmpty(mark));
                return undefined;
            }
    }
    return 'vertical';
}

},{"../../encoding":108,"../../fielddef":110,"../../log":113,"../../mark":114,"../../scale":115,"../../type":123,"../../util":124,"../common":48,"tslib":38}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.line = {
    vgMark: 'line',
    defaultRole: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }), mixins.markDefProperties(model.markDef, ['interpolate', 'tension']));
    }
};

},{"./mixins":76,"tslib":38}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var mark_1 = require("../../mark");
var util_1 = require("../../util");
var area_1 = require("./area");
var bar_1 = require("./bar");
var line_1 = require("./line");
var point_1 = require("./point");
var rect_1 = require("./rect");
var rule_1 = require("./rule");
var text_1 = require("./text");
var tick_1 = require("./tick");
var data_1 = require("../../data");
var markCompiler = {
    area: area_1.area,
    bar: bar_1.bar,
    line: line_1.line,
    point: point_1.point,
    text: text_1.text,
    tick: tick_1.tick,
    rect: rect_1.rect,
    rule: rule_1.rule,
    circle: point_1.circle,
    square: point_1.square
};
function parseMark(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return parsePathMark(model);
    }
    else {
        return parseNonPathMark(model);
    }
}
exports.parseMark = parseMark;
var FACETED_PATH_PREFIX = 'faceted-path-';
function parsePathMark(model) {
    var mark = model.mark();
    // FIXME: replace this with more general case for composition
    var details = detailFields(model);
    var pathMarks = [
        {
            name: model.getName('marks'),
            type: markCompiler[mark].vgMark,
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: { data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + model.getDataName(data_1.MAIN) },
            encode: { update: markCompiler[mark].encodeEntry(model) }
        }
    ];
    if (details.length > 0) {
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
        return [{
                name: model.getName('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: FACETED_PATH_PREFIX + model.getDataName(data_1.MAIN),
                        data: model.getDataName(data_1.MAIN),
                        groupby: details,
                    }
                },
                encode: {
                    update: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } }
                    }
                },
                marks: pathMarks
            }];
    }
    else {
        return pathMarks;
    }
}
function parseNonPathMark(model) {
    var mark = model.mark();
    var role = model.markDef.role || markCompiler[mark].defaultRole;
    var marks = []; // TODO: vgMarks
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
    marks.push(tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (role ? { role: role } : {}), { from: { data: model.getDataName(data_1.MAIN) }, encode: { update: markCompiler[mark].encodeEntry(model) } }));
    return marks;
}
/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model) {
    return channel_1.LEVEL_OF_DETAIL_CHANNELS.reduce(function (details, channel) {
        if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}

},{"../../channel":44,"../../data":106,"../../mark":114,"../../util":124,"./area":71,"./bar":72,"./line":74,"./point":77,"./rect":78,"./rule":79,"./text":80,"./tick":81,"tslib":38}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util = require("../../util");
var common_1 = require("../common");
var ref = require("./valueref");
var selection_1 = require("../selection/selection");
function color(model) {
    var config = model.config;
    var filled = model.markDef.filled;
    var e = nonPosition('color', model, {
        vgChannel: filled ? 'fill' : 'stroke',
        defaultValue: common_1.getMarkConfig('color', model.mark(), config)
    });
    // If there is no fill, always fill symbols
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
        e.fill = { value: 'transparent' };
    }
    return e;
}
exports.color = color;
function markDefProperties(mark, props) {
    return props.reduce(function (m, prop) {
        if (mark[prop]) {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
exports.markDefProperties = markDefProperties;
function valueIfDefined(prop, value) {
    if (value !== undefined) {
        return _a = {}, _a[prop] = { value: value }, _a;
    }
    return undefined;
    var _a;
}
exports.valueIfDefined = valueIfDefined;
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
function nonPosition(channel, model, opt) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    if (opt === void 0) { opt = {}; }
    var defaultValue = opt.defaultValue, vgChannel = opt.vgChannel;
    var defaultRef = opt.defaultRef || (defaultValue !== undefined ? { value: defaultValue } : undefined);
    var channelDef = model.encoding[channel];
    var valueRef = ref.midPoint(channel, channelDef, model.scaleName(channel), model.scale(channel), defaultRef);
    return wrapCondition(model, channelDef && channelDef.condition, vgChannel || channel, valueRef);
}
exports.nonPosition = nonPosition;
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
function wrapCondition(model, condition, vgChannel, valueRef) {
    if (condition) {
        var selection = condition.selection, value = condition.value;
        return _a = {},
            _a[vgChannel] = [
                { test: selectionTest(model, selection), value: value }
            ].concat((valueRef !== undefined ? [valueRef] : [])),
            _a;
    }
    else {
        return valueRef !== undefined ? (_b = {}, _b[vgChannel] = valueRef, _b) : {};
    }
    var _a, _b;
}
function selectionTest(model, selectionName) {
    var negate = selectionName.charAt(0) === '!', name = negate ? selectionName.slice(1) : selectionName;
    return (negate ? '!' : '') + selection_1.predicate(model.component.selection[name]);
}
function text(model) {
    var channelDef = model.encoding.text;
    return wrapCondition(model, channelDef && channelDef.condition, 'text', ref.text(channelDef, model.config));
}
exports.text = text;
function bandPosition(channel, model) {
    // TODO: band scale doesn't support size yet
    var fieldDef = model.encoding[channel];
    var scaleName = model.scaleName(channel);
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return _a = {},
        _a[channel] = ref.fieldRef(fieldDef, scaleName, {}),
        _a[sizeChannel] = ref.band(scaleName),
        _a;
    var _a;
}
exports.bandPosition = bandPosition;
function centeredBandPosition(channel, model, defaultPosRef, defaultSizeRef) {
    var centerChannel = channel === 'x' ? 'xc' : 'yc';
    var sizeChannel = channel === 'x' ? 'width' : 'height';
    return tslib_1.__assign({}, pointPosition(channel, model, defaultPosRef, centerChannel), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
exports.centeredBandPosition = centeredBandPosition;
function binnedPosition(channel, model, spacing) {
    var fieldDef = model.encoding[channel];
    var scaleName = model.scaleName(channel);
    if (channel === 'x') {
        return {
            x2: ref.bin(fieldDef, scaleName, 'start', spacing),
            x: ref.bin(fieldDef, scaleName, 'end')
        };
    }
    else {
        return {
            y2: ref.bin(fieldDef, scaleName, 'start'),
            y: ref.bin(fieldDef, scaleName, 'end', spacing)
        };
    }
}
exports.binnedPosition = binnedPosition;
/**
 * Return mixins for point (non-band) position channels.
 */
function pointPosition(channel, model, defaultRef, vgChannel) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    var encoding = model.encoding, stack = model.stack;
    var valueRef = ref.stackable(channel, encoding[channel], model.scaleName(channel), model.scale(channel), stack, defaultRef);
    return _a = {},
        _a[vgChannel || channel] = valueRef,
        _a;
    var _a;
}
exports.pointPosition = pointPosition;
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
function pointPosition2(model, defaultRef, channel) {
    var encoding = model.encoding, markDef = model.markDef, stack = model.stack;
    channel = channel || (markDef.orient === 'horizontal' ? 'x2' : 'y2');
    var baseChannel = channel === 'x2' ? 'x' : 'y';
    var valueRef = ref.stackable2(channel, encoding[baseChannel], encoding[channel], model.scaleName(baseChannel), model.scale(baseChannel), stack, defaultRef);
    return _a = {}, _a[channel] = valueRef, _a;
    var _a;
}
exports.pointPosition2 = pointPosition2;

},{"../../util":124,"../common":48,"../selection/selection":93,"./valueref":82,"tslib":38}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var common_1 = require("../common");
var ref = require("./valueref");
function encodeEntry(model, fixedShape) {
    var config = model.config, width = model.width, height = model.height;
    return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(width, config)), mixins.pointPosition('y', model, ref.midY(height, config)), mixins.color(model), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape), mixins.nonPosition('opacity', model));
}
function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: common_1.getMarkConfig('shape', 'point', config) });
}
exports.shapeMixins = shapeMixins;
exports.point = {
    vgMark: 'symbol',
    defaultRole: 'point',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    defaultRole: 'circle',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    defaultRole: 'square',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};

},{"../common":48,"./mixins":76,"./valueref":82,"tslib":38}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var mixins = require("./mixins");
exports.rect = {
    vgMark: 'rect',
    defaultRole: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, x(model), y(model), mixins.color(model), mixins.nonPosition('opacity', model));
    }
};
function x(model) {
    var xDef = model.encoding.x;
    var x2Def = model.encoding.x2;
    var xScale = model.scale(channel_1.X);
    if (fielddef_1.isFieldDef(xDef) && xDef.bin && !x2Def) {
        return mixins.binnedPosition('x', model, 0);
    }
    else if (xScale && scale_1.hasDiscreteDomain(xScale.type)) {
        /* istanbul ignore else */
        if (xScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('x', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, xScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
}
function y(model) {
    var yDef = model.encoding.y;
    var y2Def = model.encoding.y2;
    var yScale = model.scale(channel_1.Y);
    if (fielddef_1.isFieldDef(yDef) && yDef.bin && !y2Def) {
        return mixins.binnedPosition('y', model, 0);
    }
    else if (yScale && scale_1.hasDiscreteDomain(yScale.type)) {
        /* istanbul ignore else */
        if (yScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('y', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, yScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
}

},{"../../channel":44,"../../fielddef":110,"../../log":113,"../../mark":114,"../../scale":115,"./mixins":76,"tslib":38}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.rule = {
    vgMark: 'rule',
    defaultRole: undefined,
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.midX(width, config)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.midY(height, config)), mixins.pointPosition2(model, 'zeroOrMax'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};

},{"./mixins":76,"./valueref":82,"tslib":38}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var common_1 = require("../common");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var mixins = require("./mixins");
var encoding_1 = require("../../encoding");
var ref = require("./valueref");
exports.text = {
    vgMark: 'text',
    defaultRole: undefined,
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding, height = model.height;
        var textDef = encoding.text;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.midY(height, config)), mixins.text(model), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize
        }), mixins.valueIfDefined('align', align(encoding, config)));
    }
};
function xDefault(config, textDef) {
    if (fielddef_1.isFieldDef(textDef) && textDef.type === type_1.QUANTITATIVE) {
        return { field: { group: 'width' }, offset: -5 };
    }
    // TODO: allow this to fit (Be consistent with ref.midX())
    return { value: config.scale.textXRangeStep / 2 };
}
function align(encoding, config) {
    var alignConfig = common_1.getMarkConfig('align', 'text', config);
    if (alignConfig === undefined) {
        return encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}

},{"../../channel":44,"../../encoding":108,"../../fielddef":110,"../../type":123,"../common":48,"./mixins":76,"./valueref":82,"tslib":38}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    defaultRole: 'tick',
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(width, config), 'xc'), mixins.pointPosition('y', model, ref.midY(height, config), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a), mixins.color(model), mixins.nonPosition('opacity', model));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config;
    var orient = model.markDef.orient;
    var scaleRangeStep = (model.scale(orient === 'horizontal' ? 'x' : 'y') || {}).rangeStep;
    if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var rangeStep = scaleRangeStep !== undefined ?
            scaleRangeStep :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}

},{"./mixins":76,"./valueref":82,"tslib":38}],82:[function(require,module,exports){
/**
 * Utility files for producing Vega ValueRef for marks
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var common_1 = require("../common");
// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.
/**
 * @return Vega ValueRef for stackable x or y
 */
function stackable(channel, channelDef, scaleName, scale, stack, defaultRef) {
    if (channelDef && stack && channel === stack.fieldChannel) {
        // x or y use stack_end so that stacked line's point mark use stack_end too.
        return fieldRef(channelDef, scaleName, { suffix: 'end' });
    }
    return midPoint(channel, channelDef, scaleName, scale, defaultRef);
}
exports.stackable = stackable;
/**
 * @return Vega ValueRef for stackable x2 or y2
 */
function stackable2(channel, aFieldDef, a2fieldDef, scaleName, scale, stack, defaultRef) {
    if (aFieldDef && stack &&
        // If fieldChannel is X and channel is X2 (or Y and Y2)
        channel.charAt(0) === stack.fieldChannel.charAt(0)) {
        return fieldRef(aFieldDef, scaleName, { suffix: 'start' });
    }
    return midPoint(channel, a2fieldDef, scaleName, scale, defaultRef);
}
exports.stackable2 = stackable2;
/**
 * Value Ref for binned fields
 */
function bin(fieldDef, scaleName, side, offset) {
    return fieldRef(fieldDef, scaleName, { binSuffix: side }, offset);
}
exports.bin = bin;
function fieldRef(fieldDef, scaleName, opt, offset) {
    var ref = {
        scale: scaleName,
        field: fielddef_1.field(fieldDef, opt),
    };
    if (offset) {
        ref.offset = offset;
    }
    return ref;
}
exports.fieldRef = fieldRef;
function band(scaleName, band) {
    if (band === void 0) { band = true; }
    return {
        scale: scaleName,
        band: band
    };
}
exports.band = band;
/**
 * Signal that returns the middle of a bin. Should only be used with x and y.
 */
function binMidSignal(fieldDef, scaleName) {
    return {
        signal: "(" +
            ("scale(\"" + scaleName + "\", " + fielddef_1.field(fieldDef, { binSuffix: 'start', datum: true }) + ")") +
            " + " +
            ("scale(\"" + scaleName + "\", " + fielddef_1.field(fieldDef, { binSuffix: 'end', datum: true }) + ")") +
            ")/2"
    };
}
/**
 * @returns {VgValueRef} Value Ref for xc / yc or mid point for other channels.
 */
function midPoint(channel, channelDef, scaleName, scale, defaultRef) {
    // TODO: datum support
    if (channelDef) {
        /* istanbul ignore else */
        if (fielddef_1.isFieldDef(channelDef)) {
            if (scale_1.isBinScale(scale.type)) {
                // Use middle only for x an y to place marks in the center between start and end of the bin range.
                // We do not use the mid point for other channels (e.g. size) so that properties of legends and marks match.
                if (util_1.contains(['x', 'y'], channel)) {
                    return binMidSignal(channelDef, scaleName);
                }
                return fieldRef(channelDef, scaleName, { binSuffix: 'start' });
            }
            if (scale_1.hasDiscreteDomain(scale.type)) {
                if (scale.type === 'band') {
                    // For band, to get mid point, need to offset by half of the band
                    return fieldRef(channelDef, scaleName, { binSuffix: 'range' }, band(scaleName, 0.5));
                }
                return fieldRef(channelDef, scaleName, { binSuffix: 'range' });
            }
            else {
                return fieldRef(channelDef, scaleName, {}); // no need for bin suffix
            }
        }
        else if (channelDef.value !== undefined) {
            return { value: channelDef.value };
        }
        else {
            throw new Error('FieldDef without field or value.'); // FIXME add this to log.message
        }
    }
    if (defaultRef === 'zeroOrMin') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMinX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMinY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    else if (defaultRef === 'zeroOrMax') {
        /* istanbul ignore else */
        if (channel === channel_1.X || channel === channel_1.X2) {
            return zeroOrMaxX(scaleName, scale);
        }
        else if (channel === channel_1.Y || channel === channel_1.Y2) {
            return zeroOrMaxY(scaleName, scale);
        }
        else {
            throw new Error("Unsupported channel " + channel + " for base function"); // FIXME add this to log.message
        }
    }
    return defaultRef;
}
exports.midPoint = midPoint;
function text(textDef, config) {
    // text
    if (textDef) {
        if (fielddef_1.isFieldDef(textDef)) {
            if (textDef.type === 'quantitative') {
                // FIXME: what happens if we have bin?
                var format = common_1.numberFormat(textDef, textDef.format, config, 'text');
                return {
                    signal: "format(" + fielddef_1.field(textDef, { datum: true }) + ", '" + format + "')"
                };
            }
            else if (textDef.type === 'temporal') {
                return {
                    signal: common_1.timeFormatExpression(fielddef_1.field(textDef, { datum: true }), textDef.timeUnit, textDef.format, config.text.shortTimeLabels, config.timeFormat)
                };
            }
            else {
                return { field: textDef.field };
            }
        }
        else if (textDef.value) {
            return { value: textDef.value };
        }
    }
    return { value: config.text.text };
}
exports.text = text;
function midX(width, config) {
    if (width) {
        return { value: width / 2 };
    }
    if (typeof config.scale.rangeStep === 'string') {
        // TODO: For fit-mode, use middle of the width
        throw new Error('midX can not handle string rangeSteps');
    }
    return { value: config.scale.rangeStep / 2 };
}
exports.midX = midX;
function midY(height, config) {
    if (height) {
        return { value: height / 2 };
    }
    if (typeof config.scale.rangeStep === 'string') {
        // TODO: For fit-mode, use middle of the width
        throw new Error('midX can not handle string rangeSteps');
    }
    return { value: config.scale.rangeStep / 2 };
}
exports.midY = midY;
function zeroOrMinX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the x-axis
    return { value: 0 };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function zeroOrMaxX(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    return { field: { group: 'width' } };
}
function zeroOrMinY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { field: { group: 'height' } };
}
/**
 * @returns {VgValueRef} base value if scale exists and return max value if scale does not exist
 */
function zeroOrMaxY(scaleName, scale) {
    if (scaleName) {
        // Log / Time / UTC scale do not support zero
        if (!util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type) &&
            scale.zero !== false) {
            return {
                scale: scaleName,
                value: 0
            };
        }
    }
    // Put the mark on the y-axis
    return { value: 0 };
}

},{"../../channel":44,"../../fielddef":110,"../../scale":115,"../../util":124,"../common":48}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var util_1 = require("../util");
var assemble_1 = require("./scale/assemble");
var NameMap = (function () {
    function NameMap() {
        this.nameMap = {};
    }
    NameMap.prototype.rename = function (oldName, newName) {
        this.nameMap[oldName] = newName;
    };
    NameMap.prototype.has = function (name) {
        return this.nameMap[name] !== undefined;
    };
    NameMap.prototype.get = function (name) {
        // If the name appears in the _nameMap, we need to read its new name.
        // We have to loop over the dict just in case the new name also gets renamed.
        while (this.nameMap[name]) {
            name = this.nameMap[name];
        }
        return name;
    };
    return NameMap;
}());
exports.NameMap = NameMap;
var Model = (function () {
    function Model(spec, parent, parentGivenName, config) {
        var _this = this;
        this.scales = {};
        this.axes = {};
        this.legends = {};
        this.children = [];
        /**
         * Corrects the data references in marks after assemble.
         */
        this.correctDataNames = function (mark) {
            // TODO: make this correct
            // for normal data references
            if (mark.from && mark.from.data) {
                mark.from.data = _this.lookupDataSource(mark.from.data);
            }
            // for access to facet data
            if (mark.from && mark.from.facet && mark.from.facet.data) {
                mark.from.facet.data = _this.lookupDataSource(mark.from.facet.data);
            }
            return mark;
        };
        this.parent = parent;
        this.config = config;
        // If name is not provided, always use parent's givenName to avoid name conflicts.
        this.name = spec.name || parentGivenName;
        // Shared name maps
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.sizeNameMap = parent ? parent.sizeNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = spec.transform || [];
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : {},
                outputNodes: parent ? parent.component.data.outputNodes : {}
            },
            layout: null, mark: null, scales: null, axes: null,
            axisGroups: null, gridGroups: null, legends: null, selection: null
        };
    }
    Model.prototype.parse = function () {
        this.parseData();
        this.parseLayoutData();
        this.parseScale(); // depends on data name
        this.parseSelection();
        this.parseAxis(); // depends on scale name
        this.parseLegend(); // depends on scale name
        this.parseAxisGroup(); // depends on child axis
        this.parseGridGroup();
        this.parseMark(); // depends on data name and scale name, axisGroup, gridGroup and children's scale, axis, legend and mark.
    };
    Model.prototype.assembleScales = function () {
        return assemble_1.assembleScale(this);
    };
    Model.prototype.assembleAxes = function () {
        return [].concat.apply([], util_1.vals(this.component.axes));
    };
    Model.prototype.assembleLegends = function () {
        return util_1.vals(this.component.legends);
    };
    Model.prototype.assembleGroup = function () {
        var group = {};
        var signals = this.assembleSignals(group.signals || []);
        if (signals.length > 0) {
            group.signals = signals;
        }
        group.marks = this.assembleMarks();
        var scales = this.assembleScales();
        if (scales.length > 0) {
            group.scales = scales;
        }
        var axes = this.assembleAxes();
        if (axes.length > 0) {
            group.axes = axes;
        }
        var legends = this.assembleLegends();
        if (legends.length > 0) {
            group.legends = legends;
        }
        return group;
    };
    Model.prototype.reduceFieldDef = function (f, init, t) {
        return encoding_1.reduce(this.getMapping(), function (acc, cd, c) {
            return fielddef_1.isFieldDef(cd) ? f(acc, cd, c) : acc;
        }, init, t);
    };
    Model.prototype.forEachFieldDef = function (f, t) {
        encoding_1.forEach(this.getMapping(), function (cd, c) {
            if (fielddef_1.isFieldDef(cd)) {
                f(cd, c);
            }
        }, t);
    };
    Model.prototype.hasDescendantWithFieldOnChannel = function (channel) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.isUnit()) {
                if (child.channelHasField(channel)) {
                    return true;
                }
            }
            else {
                if (child.hasDescendantWithFieldOnChannel(channel)) {
                    return true;
                }
            }
        }
        return false;
    };
    Model.prototype.getName = function (text, delimiter) {
        if (delimiter === void 0) { delimiter = '_'; }
        return (this.name ? this.name + delimiter : '') + text;
    };
    /**
     * Return the data source name for the given data source type. You probably want to call this in parse.
     */
    Model.prototype.getDataName = function (name) {
        var fullName = this.getName(name);
        return this.lookupDataSource(fullName);
    };
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    Model.prototype.lookupDataSource = function (name) {
        var node = this.component.data.outputNodes[name];
        if (!node) {
            // name not found in map so let's just return what we got
            return name;
        }
        return node.source;
    };
    Model.prototype.renameSize = function (oldName, newName) {
        this.sizeNameMap.rename(oldName, newName);
    };
    Model.prototype.channelSizeName = function (channel) {
        return this.sizeName(channel === channel_1.X || channel === channel_1.COLUMN ? 'width' : 'height');
    };
    Model.prototype.sizeName = function (size) {
        return this.sizeNameMap.get(this.getName(size, '_'));
    };
    /** Get "field" reference for vega */
    Model.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
            }, opt);
        }
        return fielddef_1.field(fieldDef, opt);
    };
    Model.prototype.scale = function (channel) {
        return this.scales[channel];
    };
    Model.prototype.hasDiscreteScale = function (channel) {
        var scale = this.scale(channel);
        return scale && scale_1.hasDiscreteDomain(scale.type);
    };
    Model.prototype.renameScale = function (oldName, newName) {
        this.scaleNameMap.rename(oldName, newName);
    };
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     */
    Model.prototype.scaleName = function (originalScaleName, parse) {
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a scale can't be renamed
            // before it has the original name.
            return this.getName(originalScaleName);
        }
        // If there is a scale for the channel, it should either
        // be in the _scale mapping or exist in the name map
        if (
        // in the scale map (the scale is not merged by its parent)
        (this.scale && this.scales[originalScaleName]) ||
            // in the scale name map (the the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
        }
        return undefined;
    };
    Model.prototype.sort = function (channel) {
        return (this.getMapping()[channel] || {}).sort;
    };
    Model.prototype.axis = function (channel) {
        return this.axes[channel];
    };
    Model.prototype.legend = function (channel) {
        return this.legends[channel];
    };
    /**
     * Type checks
     */
    Model.prototype.isUnit = function () {
        return false;
    };
    Model.prototype.isFacet = function () {
        return false;
    };
    Model.prototype.isLayer = function () {
        return false;
    };
    return Model;
}());
exports.Model = Model;

},{"../channel":44,"../encoding":108,"../fielddef":110,"../scale":115,"../util":124,"./scale/assemble":84}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
function assembleScale(model) {
    return util_1.vals(model.component.scales).map(function (scale) {
        // correct references to data
        var domain = scale.domain;
        if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
            return scale;
        }
        else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
            domain.fields = domain.fields.map(function (f) {
                return tslib_1.__assign({}, f, { data: model.lookupDataSource(f.data) });
            });
            return scale;
        }
        else if (vega_schema_1.isSignalRefDomain(domain) || vega_util_1.isArray(domain)) {
            return scale;
        }
        else {
            throw new Error('invalid scale domain');
        }
    });
}
exports.assembleScale = assembleScale;

},{"../../util":124,"../../vega.schema":126,"tslib":38,"vega-util":128}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var aggregate_1 = require("../../aggregate");
var bin_1 = require("../../bin");
var datetime_1 = require("../../datetime");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var data_1 = require("../../data");
function initDomain(domain, fieldDef, scale, scaleConfig) {
    if (domain === 'unaggregated') {
        var _a = canUseUnaggregatedDomain(fieldDef, scale), valid = _a.valid, reason = _a.reason;
        if (!valid) {
            log.warn(reason);
            return undefined;
        }
    }
    else if (domain === undefined && scaleConfig.useUnaggregatedDomain) {
        // Apply config if domain is not specified.
        var valid = canUseUnaggregatedDomain(fieldDef, scale).valid;
        if (valid) {
            return 'unaggregated';
        }
    }
    return domain;
}
exports.initDomain = initDomain;
function parseDomain(model, channel) {
    var scale = model.scale(channel);
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && model.channelHasField('x2')) {
        if (model.channelHasField('x')) {
            return unionDomains(parseSingleChannelDomain(scale, model, 'x'), parseSingleChannelDomain(scale, model, 'x2'));
        }
        else {
            return parseSingleChannelDomain(scale, model, 'x2');
        }
    }
    else if (channel === 'y' && model.channelHasField('y2')) {
        if (model.channelHasField('y')) {
            return unionDomains(parseSingleChannelDomain(scale, model, 'y'), parseSingleChannelDomain(scale, model, 'y2'));
        }
        else {
            return parseSingleChannelDomain(scale, model, 'y2');
        }
    }
    return parseSingleChannelDomain(scale, model, channel);
}
exports.parseDomain = parseDomain;
function parseSingleChannelDomain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (scale.domain && scale.domain !== 'unaggregated') {
        if (datetime_1.isDateTime(scale.domain[0])) {
            return scale.domain.map(function (dt) {
                return datetime_1.timestamp(dt, true);
            });
        }
        return scale.domain;
    }
    var stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return [0, 1];
        }
        return {
            data: model.getDataName(data_1.MAIN),
            fields: [
                model.field(channel, { suffix: 'start' }),
                model.field(channel, { suffix: 'end' })
            ]
        };
    }
    var sort = domainSort(model, channel, scale.type);
    if (scale.domain === 'unaggregated') {
        return {
            data: model.getDataName(data_1.MAIN),
            fields: [
                model.field(channel, { aggregate: 'min' }),
                model.field(channel, { aggregate: 'max' })
            ]
        };
    }
    else if (fieldDef.bin) {
        if (scale_1.isBinScale(scale.type)) {
            var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
        }
        if (scale_1.hasDiscreteDomain(scale.type)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin_start
            // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
            return {
                data: model.getDataName(data_1.MAIN),
                field: model.field(channel, { binSuffix: 'range' }),
                sort: {
                    field: model.field(channel, { binSuffix: 'start' }),
                    op: 'min' // min or max doesn't matter since same _range would have the same _start
                }
            };
        }
        else {
            if (channel === 'x' || channel === 'y') {
                // X/Y position have to include start and end for non-ordinal scale
                return {
                    data: model.getDataName(data_1.MAIN),
                    fields: [
                        model.field(channel, { binSuffix: 'start' }),
                        model.field(channel, { binSuffix: 'end' })
                    ]
                };
            }
            else {
                // TODO: use bin_mid
                return {
                    data: model.getDataName(data_1.MAIN),
                    field: model.field(channel, { binSuffix: 'start' })
                };
            }
        }
    }
    else if (sort) {
        return {
            // If sort by aggregation of a specified sort field, we need to use RAW table,
            // so we can aggregate values for the scale independently from the main aggregation.
            data: util.isBoolean(sort) ? model.getDataName(data_1.MAIN) : model.getDataName(data_1.RAW),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.getDataName(data_1.MAIN),
            field: model.field(channel),
        };
    }
}
function domainSort(model, channel, scaleType) {
    if (!scale_1.hasDiscreteDomain(scaleType)) {
        return undefined;
    }
    var sort = model.sort(channel);
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (sort_1.isSortField(sort)) {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    if (util.contains(['ascending', 'descending', undefined /* default =ascending*/], sort)) {
        return true;
    }
    // sort === 'none'
    return undefined;
}
exports.domainSort = domainSort;
/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
function canUseUnaggregatedDomain(fieldDef, scaleType) {
    if (!fieldDef.aggregate) {
        return {
            valid: false,
            reason: log.message.unaggregateDomainHasNoEffectForRawField(fieldDef)
        };
    }
    if (aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) === -1) {
        return {
            valid: false,
            reason: log.message.unaggregateDomainWithNonSharedDomainOp(fieldDef.aggregate)
        };
    }
    if (fieldDef.type === 'quantitative') {
        if (scaleType === 'log') {
            return {
                valid: false,
                reason: log.message.unaggregatedDomainWithLogScale(fieldDef)
            };
        }
    }
    return { valid: true };
}
exports.canUseUnaggregatedDomain = canUseUnaggregatedDomain;
/**
 * Convert the domain to an array of data refs or an array of values. Also, throw
 * away sorting information since we always sort the domain when we union two domains.
 */
function normalizeDomain(domain) {
    if (util.isArray(domain)) {
        return [domain];
    }
    else if (vega_schema_1.isDataRefDomain(domain)) {
        delete domain.sort;
        return [domain];
    }
    else if (vega_schema_1.isFieldRefUnionDomain(domain)) {
        return domain.fields.map(function (d) {
            return {
                data: domain.data,
                field: d
            };
        });
    }
    else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
        return domain.fields.map(function (d) {
            if (util.isArray(d)) {
                return d;
            }
            return {
                field: d.field,
                data: d.data
            };
        });
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVAID_DOMAIN);
}
/**
 * Union two data domains. A unioned domain is always sorted.
 */
function unionDomains(domain1, domain2) {
    if (vega_schema_1.isSignalRefDomain(domain1) || vega_schema_1.isSignalRefDomain(domain2)) {
        if (!vega_schema_1.isSignalRefDomain(domain1) || !vega_schema_1.isSignalRefDomain(domain2) || domain1.signal !== domain2.signal) {
            throw new Error(log.message.UNABLE_TO_MERGE_DOMAINS);
        }
        return domain1;
    }
    var normalizedDomain1 = normalizeDomain(domain1);
    var normalizedDomain2 = normalizeDomain(domain2);
    var domains = normalizedDomain1.concat(normalizedDomain2);
    domains = util.unique(domains, util.hash);
    if (domains.length > 1) {
        var allData = domains.map(function (d) {
            if (vega_schema_1.isDataRefDomain(d)) {
                return d.data;
            }
            return null;
        });
        if (util.unique(allData, function (x) { return x; }).length === 1 && allData[0] !== null) {
            return {
                data: allData[0],
                fields: domains.map(function (d) { return d.field; })
            };
        }
        return { fields: domains, sort: true };
    }
    else {
        return domains[0];
    }
}
exports.unionDomains = unionDomains;

},{"../../aggregate":41,"../../bin":43,"../../data":106,"../../datetime":107,"../../log":113,"../../scale":115,"../../sort":117,"../../util":124,"../../vega.schema":126}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var scale_1 = require("../../scale");
var util = require("../../util");
var domain_1 = require("./domain");
var range_1 = require("./range");
var rules = require("./rules");
var type_1 = require("./type");
/**
 * All scale properties except type and all range properties.
 */
exports.NON_TYPE_RANGE_SCALE_PROPERTIES = [
    // general properties
    'domain',
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'zero',
    'interpolate',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter' // padding
];
/**
 * Initialize Vega-Lite Scale's properties
 *
 * Note that we have to apply these rules here because:
 * - many other scale and non-scale properties (including layout, mark) depend on scale type
 * - layout depends on padding
 * - range depends on zero and size (width and height) depends on range
 */
function init(channel, fieldDef, config, mark, topLevelSize, xyRangeSteps) {
    var specifiedScale = (fieldDef || {}).scale || {};
    var scale = {
        type: type_1.default(specifiedScale.type, channel, fieldDef, mark, topLevelSize !== undefined, specifiedScale.rangeStep, config.scale)
    };
    // Use specified value if compatible or determine default values for each property
    exports.NON_TYPE_RANGE_SCALE_PROPERTIES.forEach(function (property) {
        var specifiedValue = specifiedScale[property];
        var supportedByScaleType = scale_1.scaleTypeSupportProperty(scale.type, property);
        var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
        if (specifiedValue !== undefined) {
            // If there is a specified value, check if it is compatible with scale type and channel
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
            }
            else if (channelIncompatability) {
                log.warn(channelIncompatability);
            }
        }
        if (supportedByScaleType && channelIncompatability === undefined) {
            var value = getValue(specifiedValue, property, scale, channel, fieldDef, config.scale);
            if (value !== undefined) {
                scale[property] = value;
            }
        }
    });
    return util.extend(scale, range_1.default(channel, scale.type, fieldDef.type, specifiedScale, config, scale.zero, mark, topLevelSize, xyRangeSteps));
}
exports.default = init;
function getValue(specifiedValue, property, scale, channel, fieldDef, scaleConfig) {
    // For domain, we might override specified value
    if (property === 'domain') {
        return domain_1.initDomain(specifiedValue, fieldDef, scale.type, scaleConfig);
    }
    // Other properties, no overriding default values
    if (specifiedValue !== undefined) {
        return specifiedValue;
    }
    return getDefaultValue(property, scale, channel, fieldDef, scaleConfig);
}
function getDefaultValue(property, scale, channel, fieldDef, scaleConfig) {
    // If we have default rule-base, determine default value first
    switch (property) {
        case 'nice':
            return rules.nice(scale.type, channel, fieldDef);
        case 'padding':
            return rules.padding(channel, scale.type, scaleConfig);
        case 'paddingInner':
            return rules.paddingInner(scale.padding, channel, scaleConfig);
        case 'paddingOuter':
            return rules.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
        case 'round':
            return rules.round(channel, scaleConfig);
        case 'zero':
            return rules.zero(scale, channel, fieldDef);
    }
    // Otherwise, use scale config
    return scaleConfig[property];
}

},{"../../log":113,"../../scale":115,"../../util":124,"./domain":85,"./range":88,"./rules":89,"./type":90}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sort_1 = require("../../sort");
var domain_1 = require("./domain");
var range_1 = require("./range");
/**
 * Parse scales for all channels of a model.
 */
function parseScaleComponent(model) {
    // TODO: should model.channels() inlcude X2/Y2?
    return model.channels().reduce(function (scaleComponentsIndex, channel) {
        var scaleComponents = parseScale(model, channel);
        if (scaleComponents) {
            scaleComponentsIndex[channel] = scaleComponents;
        }
        return scaleComponentsIndex;
    }, {});
}
exports.default = parseScaleComponent;
exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = [
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'interpolate', 'zero',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter',
];
/**
 * Parse scales for a single channel of a model.
 */
function parseScale(model, channel) {
    if (!model.scale(channel)) {
        return null;
    }
    var scale = model.scale(channel);
    var sort = model.sort(channel);
    var scaleComponent = {
        name: model.scaleName(channel + '', true),
        type: scale.type,
        domain: domain_1.parseDomain(model, channel),
        range: range_1.parseRange(scale)
    };
    exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach(function (property) {
        scaleComponent[property] = scale[property];
    });
    if (sort && (sort_1.isSortField(sort) ? sort.order : sort) === 'descending') {
        scaleComponent.reverse = true;
    }
    return scaleComponent;
}
exports.parseScale = parseScale;

},{"../../sort":117,"./domain":85,"./range":88}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var util = require("../../util");
function parseRange(scale) {
    if (scale.rangeStep) {
        return { step: scale.rangeStep };
    }
    else if (scale.scheme) {
        var scheme = scale.scheme;
        if (scale_1.isExtendedScheme(scheme)) {
            var r = { scheme: scheme.name };
            if (scheme.count) {
                r.count = scheme.count;
            }
            if (scheme.extent) {
                r.extent = scheme.extent;
            }
            return r;
        }
        else {
            return { scheme: scheme };
        }
    }
    return scale.range;
}
exports.parseRange = parseRange;
exports.RANGE_PROPERTIES = ['range', 'rangeStep', 'scheme'];
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
function rangeMixins(channel, scaleType, type, specifiedScale, config, zero, mark, topLevelSize, xyRangeSteps) {
    var specifiedRangeStepIsNull = false;
    // Check if any of the range properties is specified.
    // If so, check if it is compatible and make sure that we only output one of the properties
    for (var _i = 0, RANGE_PROPERTIES_1 = exports.RANGE_PROPERTIES; _i < RANGE_PROPERTIES_1.length; _i++) {
        var property = RANGE_PROPERTIES_1[_i];
        if (specifiedScale[property] !== undefined) {
            var supportedByScaleType = scale_1.scaleTypeSupportProperty(scaleType, property);
            var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
            }
            else if (channelIncompatability) {
                log.warn(channelIncompatability);
            }
            else {
                switch (property) {
                    case 'range':
                        return { range: specifiedScale[property] };
                    case 'scheme':
                        return { scheme: specifiedScale[property] };
                    case 'rangeStep':
                        if (topLevelSize === undefined) {
                            var stepSize = specifiedScale[property];
                            if (stepSize !== null) {
                                return { rangeStep: stepSize };
                            }
                            else {
                                specifiedRangeStepIsNull = true;
                            }
                        }
                        else {
                            // If top-level size is specified, we ignore specified rangeStep.
                            log.warn(log.message.rangeStepDropped(channel));
                        }
                }
            }
        }
    }
    switch (channel) {
        // TODO: revise row/column when facetSpec has top-level width/height
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
        case channel_1.X:
        case channel_1.Y:
            if (topLevelSize === undefined) {
                if (util.contains(['point', 'band'], scaleType) && !specifiedRangeStepIsNull) {
                    if (channel === channel_1.X && mark === 'text') {
                        if (config.scale.textXRangeStep) {
                            return { rangeStep: config.scale.textXRangeStep };
                        }
                    }
                    else {
                        if (config.scale.rangeStep) {
                            return { rangeStep: config.scale.rangeStep };
                        }
                    }
                }
                // If specified range step is null or the range step config is null.
                // Use default topLevelSize rule/config
                topLevelSize = channel === channel_1.X ? config.cell.width : config.cell.height;
            }
            return { range: channel === channel_1.X ? [0, topLevelSize] : [topLevelSize, 0] };
        case channel_1.SIZE:
            // TODO: support custom rangeMin, rangeMax
            var rangeMin = sizeRangeMin(mark, zero, config);
            var rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
            return { range: [rangeMin, rangeMax] };
        case channel_1.SHAPE:
        case channel_1.COLOR:
            return { range: defaultRange(channel, scaleType, type, mark) };
        case channel_1.OPACITY:
            // TODO: support custom rangeMin, rangeMax
            return { range: [config.scale.minOpacity, config.scale.maxOpacity] };
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
exports.default = rangeMixins;
function defaultRange(channel, scaleType, type, mark) {
    switch (channel) {
        case channel_1.SHAPE:
            return 'symbol';
        case channel_1.COLOR:
            if (scaleType === 'ordinal') {
                // Only nominal data uses ordinal scale by default
                return type === 'nominal' ? 'category' : 'ordinal';
            }
            return mark === 'rect' ? 'heatmap' : 'ramp';
    }
}
function sizeRangeMin(mark, zero, config) {
    if (zero) {
        return 0;
    }
    switch (mark) {
        case 'bar':
            return config.scale.minBandSize !== undefined ? config.scale.minBandSize : config.bar.continuousBandSize;
        case 'tick':
            return config.scale.minBandSize;
        case 'line':
        case 'rule':
            return config.scale.minStrokeWidth;
        case 'text':
            return config.scale.minFontSize;
        case 'point':
        case 'square':
        case 'circle':
            if (config.scale.minSize) {
                return config.scale.minSize;
            }
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMin not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
function sizeRangeMax(mark, xyRangeSteps, config) {
    var scaleConfig = config.scale;
    // TODO(#1168): make max size scale based on rangeStep / overall plot size
    switch (mark) {
        case 'bar':
        case 'tick':
            if (config.scale.maxBandSize !== undefined) {
                return config.scale.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.scale) - 1;
        case 'line':
        case 'rule':
            return config.scale.maxStrokeWidth;
        case 'text':
            return config.scale.maxFontSize;
        case 'point':
        case 'square':
        case 'circle':
            if (config.scale.maxSize) {
                return config.scale.maxSize;
            }
            // FIXME this case totally should be refactored
            var pointStep = minXYRangeStep(xyRangeSteps, scaleConfig);
            return (pointStep - 2) * (pointStep - 2);
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMax not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function minXYRangeStep(xyRangeSteps, scaleConfig) {
    if (xyRangeSteps.length > 0) {
        return Math.min.apply(null, xyRangeSteps);
    }
    if (scaleConfig.rangeStep) {
        return scaleConfig.rangeStep;
    }
    return 21; // FIXME: re-evaluate the default value here.
}

},{"../../channel":44,"../../log":113,"../../scale":115,"../../util":124}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var timeunit_1 = require("../../timeunit");
var util = require("../../util");
function nice(scaleType, channel, fieldDef) {
    if (util.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scaleType)) {
        return timeunit_1.smallestUnit(fieldDef.timeUnit);
    }
    return util.contains([channel_1.X, channel_1.Y], channel); // return true for quantitative X/Y
}
exports.nice = nice;
function padding(channel, scaleType, scaleConfig) {
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        if (scaleType === scale_1.ScaleType.POINT) {
            return scaleConfig.pointPadding;
        }
    }
    return undefined;
}
exports.padding = padding;
function paddingInner(padding, channel, scaleConfig) {
    if (padding !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingInner.
        return undefined;
    }
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
        return scaleConfig.bandPaddingInner;
    }
    return undefined;
}
exports.paddingInner = paddingInner;
function paddingOuter(padding, channel, scaleType, paddingInner, scaleConfig) {
    if (padding !== undefined) {
        // If user has already manually specified "padding", no need to add default paddingOuter.
        return undefined;
    }
    if (util.contains([channel_1.X, channel_1.Y], channel)) {
        // Padding is only set for X and Y by default.
        // Basically it doesn't make sense to add padding for color and size.
        if (scaleType === scale_1.ScaleType.BAND) {
            if (scaleConfig.bandPaddingOuter !== undefined) {
                return scaleConfig.bandPaddingOuter;
            }
            /* By default, paddingOuter is paddingInner / 2. The reason is that
                size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
                and we want the width/height to be integer by default.
                Note that step (by default) and cardinality are integers.) */
            return paddingInner / 2;
        }
    }
    return undefined;
}
exports.paddingOuter = paddingOuter;
function round(channel, scaleConfig) {
    if (util.contains(['x', 'y', 'row', 'column'], channel)) {
        return scaleConfig.round;
    }
    return undefined;
}
exports.round = round;
function zero(specifiedScale, channel, fieldDef) {
    // By default, return true only for the following cases:
    // 1) using quantitative field with size
    // While this can be either ratio or interval fields, our assumption is that
    // ratio are more common.
    if (channel === 'size' && fieldDef.type === 'quantitative') {
        return true;
    }
    // 2) non-binned, quantitative x-scale or y-scale if no custom domain is provided.
    // (For binning, we should not include zero by default because binning are calculated without zero.
    // Similar, if users explicitly provide a domain range, we should not augment zero as that will be unexpected.)
    if (!specifiedScale.domain && !fieldDef.bin && util.contains([channel_1.X, channel_1.Y], channel)) {
        return true;
    }
    return false;
}
exports.zero = zero;

},{"../../channel":44,"../../scale":115,"../../timeunit":120,"../../util":124}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var timeunit_1 = require("../../timeunit");
var scale_2 = require("../../scale");
var type_1 = require("../../type");
var util = require("../../util");
var util_1 = require("../../util");
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function type(specifiedType, channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    var defaultScaleType = defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
    if (!channel_1.hasScale(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (specifiedType !== undefined) {
        // Check if explicitly specified scale type is supported by the channel
        if (!channel_1.supportScaleType(channel, specifiedType)) {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the data type
        if (!fieldDefMatchScaleType(specifiedType, fieldDef)) {
            log.warn(log.message.scaleTypeNotWorkWithFieldDef(specifiedType, defaultScaleType));
            return defaultScaleType;
        }
        return specifiedType;
    }
    return defaultScaleType;
}
exports.default = type;
/**
 * Determine appropriate default scale type.
 */
function defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['row', 'column'], channel)) {
        return 'band';
    }
    switch (fieldDef.type) {
        case 'nominal':
            if (channel === 'color' || channel_1.rangeType(channel) === 'discrete') {
                return 'ordinal';
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'ordinal':
            if (channel === 'color') {
                return 'ordinal';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                return 'ordinal';
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'temporal':
            if (channel === 'color') {
                // Always use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            if (timeunit_1.isDiscreteByDefault(fieldDef.timeUnit)) {
                return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            }
            return 'time';
        case 'quantitative':
            if (channel === 'color') {
                if (fieldDef.bin) {
                    return 'bin-ordinal';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            if (fieldDef.bin) {
                return 'bin-linear';
            }
            return 'linear';
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['x', 'y'], channel)) {
        if (mark === 'rect') {
            // The rect mark should fit into a band.
            return 'band';
        }
        if (mark === 'bar') {
            // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
            // However, for non-fit mode, point scale provides better center position.
            if (haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
                return 'point';
            }
            return 'band';
        }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return 'point';
}
function haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (hasTopLevelSize) {
        // if topLevelSize is provided, rangeStep will be dropped.
        return false;
    }
    if (specifiedRangeStep !== undefined) {
        return specifiedRangeStep !== null;
    }
    return !!scaleConfig.rangeStep;
}
function fieldDefMatchScaleType(specifiedType, fieldDef) {
    var type = fieldDef.type;
    if (util_1.contains([type_1.Type.ORDINAL, type_1.Type.NOMINAL], type)) {
        return specifiedType === undefined || scale_2.hasDiscreteDomain(specifiedType);
    }
    else if (type === type_1.Type.TEMPORAL) {
        if (!fieldDef.timeUnit) {
            return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], specifiedType);
        }
        else {
            return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], specifiedType) || scale_2.hasDiscreteDomain(specifiedType);
        }
    }
    else if (type === type_1.Type.QUANTITATIVE) {
        if (fieldDef.bin) {
            return specifiedType === scale_1.ScaleType.BIN_LINEAR || specifiedType === scale_1.ScaleType.BIN_ORDINAL;
        }
        return util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.QUANTILE, scale_1.ScaleType.QUANTIZE, scale_1.ScaleType.LINEAR, undefined], specifiedType);
    }
    return true;
}
exports.fieldDefMatchScaleType = fieldDefMatchScaleType;

},{"../../channel":44,"../../log":113,"../../scale":115,"../../timeunit":120,"../../type":123,"../../util":124}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var scales_1 = require("./transforms/scales");
exports.BRUSH = '_brush', exports.SIZE = '_size';
var interval = {
    predicate: 'vlInterval',
    signals: function (model, selCmpt) {
        var signals = [], intervals = [], name = selCmpt.name, size = name + exports.SIZE;
        if (selCmpt.translate && !(scales_1.default.has(selCmpt))) {
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                filters.push('!event.item || (event.item && ' +
                    ("event.item.mark.name !== " + util_1.stringValue(name + exports.BRUSH) + ")"));
            });
        }
        selCmpt.project.forEach(function (p) {
            if (p.encoding !== channel_1.X && p.encoding !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignal(model, selCmpt, p.encoding);
            signals.push(cs);
            intervals.push("{field: " + util_1.stringValue(p.field) + ", extent: " + cs.name + "}");
        });
        signals.push({
            name: size,
            value: [],
            on: events(selCmpt, function (on, evt) {
                on.push({
                    events: evt.between[0],
                    update: '{x: x(unit), y: y(unit), width: 0, height: 0}'
                });
                on.push({
                    events: evt,
                    update: "{x: " + size + ".x, y: " + size + ".y, " +
                        ("width: abs(x(unit) - " + size + ".x), height: abs(y(unit) - " + size + ".y)}")
                });
                return on;
            })
        }, {
            name: name,
            update: "[" + intervals.join(', ') + "]"
        });
        return signals;
    },
    tupleExpr: function (model, selCmpt) {
        return "intervals: " + selCmpt.name;
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ", {unit: " + tpl + ".unit}";
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name, _a = projections(selCmpt), x = _a.x, y = _a.y;
        // Do not add a brush if we're binding to scales.
        if (scales_1.default.has(selCmpt)) {
            return marks;
        }
        var update = {
            x: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[0]" } :
                { value: 0 }),
            x2: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[1]" } :
                { field: { group: 'width' } }),
            y: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[0]" } :
                { value: 0 }),
            y2: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[1]" } :
                { field: { group: 'height' } }),
        };
        return [{
                name: undefined,
                type: 'rect',
                encode: {
                    enter: { fill: { value: '#eee' } },
                    update: update
                }
            }].concat(marks, {
            name: name + exports.BRUSH,
            type: 'rect',
            encode: {
                enter: { fill: { value: 'transparent' } },
                update: update
            }
        });
    }
};
exports.default = interval;
function projections(selCmpt) {
    var x = null, y = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.encoding === channel_1.X) {
            x = i;
        }
        else if (p.encoding === channel_1.Y) {
            y = i;
        }
    });
    return { x: x, y: y };
}
exports.projections = projections;
function channelSignal(model, selCmpt, channel) {
    var name = selection_1.channelSignalName(selCmpt, channel), size = (channel === channel_1.X ? 'width' : 'height'), coord = channel + "(unit)", invert = selection_1.invert.bind(null, model, selCmpt, channel);
    return {
        name: name,
        value: [],
        on: scales_1.default.has(selCmpt) ? [] : events(selCmpt, function (on, evt) {
            on.push({
                events: evt.between[0],
                update: invert("[" + coord + ", " + coord + "]")
            });
            on.push({
                events: evt,
                update: "[" + name + "[0], " + invert("clamp(" + coord + ", 0, " + size + ")") + ']'
            });
            return on;
        })
    };
}
function events(selCmpt, cb) {
    return selCmpt.events.reduce(function (on, evt) {
        if (!evt.between) {
            log_1.warn(evt + " is not an ordered event stream for interval selections");
            return on;
        }
        return cb(on, evt);
    }, []);
}

},{"../../channel":44,"../../log":113,"../../util":124,"./selection":93,"./transforms/scales":98}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var selection_1 = require("./selection");
var multi = {
    predicate: 'vlPoint',
    signals: function (model, selCmpt) {
        var proj = selCmpt.project, datum = '(item().isVoronoi ? datum.datum : datum)', fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return datum + "[" + util_1.stringValue(p.field) + "]"; }).join(', ');
        return [{
                name: selCmpt.name,
                value: {},
                on: [{
                        events: selCmpt.events,
                        update: "{fields: [" + fields + "], values: [" + values + "]}"
                    }]
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name;
        return "fields: " + name + ".fields, values: " + name + ".values";
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE;
    }
};
exports.default = multi;

},{"../../util":124,"./selection":93}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var util_1 = require("../../util");
var interval_1 = require("./interval");
var multi_1 = require("./multi");
var single_1 = require("./single");
var transforms_1 = require("./transforms/transforms");
exports.STORE = '_store', exports.TUPLE = '_tuple', exports.MODIFY = '_modify';
function parseUnitSelection(model, selDefs) {
    var selCmpts = {}, selectionConfig = model.config.selection;
    var _loop_1 = function (name_1) {
        if (!selDefs.hasOwnProperty(name_1)) {
            return "continue";
        }
        var selDef = selDefs[name_1], cfg = selectionConfig[selDef.type];
        // Set default values from config if a property hasn't been specified,
        // or if it is true. E.g., "translate": true should use the default
        // event handlers for translate. However, true may be a valid value for
        // a property (e.g., "nearest": true).
        for (var key in cfg) {
            // A selection should contain either `encodings` or `fields`, only use
            // default values for these two values if neither of them is specified.
            if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
                continue;
            }
            if (selDef[key] === undefined || selDef[key] === true) {
                selDef[key] = cfg[key] || selDef[key];
            }
        }
        var selCmpt = selCmpts[name_1] = util_1.extend({}, selDef, {
            name: model.getName(name_1),
            events: util_1.isString(selDef.on) ? vega_event_selector_1.selector(selDef.on, 'scope') : selDef.on,
            domain: 'data',
            resolve: 'union'
        });
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.parse) {
                txCompiler.parse(model, selDef, selCmpt);
            }
        });
    };
    for (var name_1 in selDefs) {
        _loop_1(name_1);
    }
    return selCmpts;
}
exports.parseUnitSelection = parseUnitSelection;
function assembleUnitSignals(model, signals) {
    forEachSelection(model, function (selCmpt, selCompiler) {
        var name = selCmpt.name, tupleExpr = selCompiler.tupleExpr(model, selCmpt);
        var modifyExpr = selCompiler.modifyExpr(model, selCmpt);
        signals.push.apply(signals, selCompiler.signals(model, selCmpt));
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.signals) {
                signals = txCompiler.signals(model, selCmpt, signals);
            }
            if (txCompiler.modifyExpr) {
                modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
            }
        });
        signals.push({
            name: name + exports.TUPLE,
            on: [{
                    events: { signal: name },
                    update: "{unit: unit.datum && unit.datum._id, " + tupleExpr + "}"
                }]
        }, {
            name: name + exports.MODIFY,
            on: [{
                    events: { signal: name },
                    update: "modify(" + util_1.stringValue(name + exports.STORE) + ", " + modifyExpr + ")"
                }]
        });
    });
    return signals;
}
exports.assembleUnitSignals = assembleUnitSignals;
function assembleTopLevelSignals(model) {
    var signals = [{
            name: 'unit',
            value: {},
            on: [{ events: 'mousemove', update: 'group()._id ? group() : unit' }]
        }];
    forEachSelection(model, function (selCmpt, selCompiler) {
        if (selCompiler.topLevelSignals) {
            signals.push.apply(signals, selCompiler.topLevelSignals(model, selCmpt));
        }
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            if (txCompiler.topLevelSignals) {
                signals = txCompiler.topLevelSignals(model, selCmpt, signals);
            }
        });
    });
    return signals;
}
exports.assembleTopLevelSignals = assembleTopLevelSignals;
function assembleUnitData(model, data) {
    return data
        .concat(Object.keys(model.component.selection)
        .map(function (k) {
        return { name: k + exports.STORE };
    }));
}
exports.assembleUnitData = assembleUnitData;
function assembleUnitMarks(model, marks) {
    var clippedGroup = false, selMarks = marks;
    forEachSelection(model, function (selCmpt, selCompiler) {
        selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;
        transforms_1.forEachTransform(selCmpt, function (txCompiler) {
            clippedGroup = clippedGroup || txCompiler.clippedGroup;
            if (txCompiler.marks) {
                selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
            }
        });
    });
    if (clippedGroup) {
        selMarks = [{
                type: 'group',
                encode: {
                    enter: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } },
                        fill: { value: 'transparent' },
                        clip: { value: true }
                    }
                },
                marks: selMarks.map(model.correctDataNames)
            }];
    }
    return selMarks;
}
exports.assembleUnitMarks = assembleUnitMarks;
var PREDICATES_OPS = {
    'single': '"intersect", "all"',
    'independent': '"intersect", "unit"',
    'union': '"union", "all"',
    'union_others': '"union", "others"',
    'intersect': '"intersect", "all"',
    'intersect_others': '"intersect", "others'
};
function predicate(selCmpt, datum) {
    var store = util_1.stringValue(selCmpt.name + exports.STORE), op = PREDICATES_OPS[selCmpt.resolve];
    datum = datum || 'datum';
    return compiler(selCmpt).predicate + ("(" + store + ", parent._id, " + datum + ", " + op + ")");
}
exports.predicate = predicate;
// Utility functions
function forEachSelection(model, cb) {
    var selections = model.component.selection;
    for (var name_2 in selections) {
        if (selections.hasOwnProperty(name_2)) {
            var sel = selections[name_2];
            cb(sel, compiler(sel));
        }
    }
}
function compiler(selCmpt) {
    switch (selCmpt.type) {
        case 'single':
            return single_1.default;
        case 'multi':
            return multi_1.default;
        case 'interval':
            return interval_1.default;
    }
    return null;
}
function invert(model, selCmpt, channel, expr) {
    var scale = util_1.stringValue(model.scaleName(channel));
    return selCmpt.domain === 'data' ? "invert(" + scale + ", " + expr + ")" : expr;
}
exports.invert = invert;
function channelSignalName(selCmpt, channel) {
    return selCmpt.name + '_' + channel;
}
exports.channelSignalName = channelSignalName;

},{"../../util":124,"./interval":91,"./multi":92,"./single":94,"./transforms/transforms":100,"vega-event-selector":39}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: multi_1.default.predicate,
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt) {
        var name = selCmpt.name;
        return [{
                name: name,
                update: "data(" + util_1.stringValue(name + selection_1.STORE) + ")[0]"
            }];
    },
    tupleExpr: function (model, selCmpt) {
        var name = selCmpt.name, values = name + ".values";
        return "fields: " + name + ".fields, values: " + values + ", " +
            selCmpt.project.map(function (p, i) {
                return p.field + ": " + values + "[" + i + "]";
            }).join(', ');
    },
    modifyExpr: function (model, selCmpt) {
        return selCmpt.name + selection_1.TUPLE + ', true';
    }
};
exports.default = single;

},{"../../util":124,"./multi":92,"./selection":93}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, bind = selCmpt.bind, datum = '(item().isVoronoi ? datum.datum : datum)';
        proj.forEach(function (p) {
            signals.unshift({
                name: name + id(p.field),
                value: '',
                on: [{
                        events: selCmpt.events,
                        update: datum + "[" + util_1.stringValue(p.field) + "]"
                    }],
                bind: bind[p.field] || bind[p.encoding] || bind
            });
        });
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, proj = selCmpt.project, signal = signals.filter(function (s) { return s.name === name; })[0], fields = proj.map(function (p) { return util_1.stringValue(p.field); }).join(', '), values = proj.map(function (p) { return name + id(p.field); }).join(', ');
        signal.update = "{fields: [" + fields + "], values: [" + values + "]}";
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
function id(str) {
    return '_' + str.replace(/\W/g, '_');
}

},{"../../../util":124}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.nearest !== undefined && selCmpt.nearest !== false;
    },
    marks: function (model, selCmpt, marks, selMarks) {
        var mark = marks[0], index = selMarks.indexOf(mark), isPathgroup = mark.name === model.getName('pathgroup'), exists = (function (m) { return m.name && m.name.indexOf(VORONOI) >= 0; }), cellDef = {
            name: model.getName(VORONOI),
            type: 'path',
            from: { data: model.getName('marks') },
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    strokeWidth: { value: 0.35 },
                    stroke: { value: 'transparent' },
                    isVoronoi: { value: true }
                }
            },
            transform: [{
                    type: 'voronoi',
                    x: 'datum.x',
                    y: 'datum.y',
                    size: [{ signal: 'width' }, { signal: 'height' }]
                }]
        };
        if (isPathgroup && !mark.marks.filter(exists).length) {
            mark.marks.push(cellDef);
            selMarks.splice(index, 1, mark);
        }
        else if (!isPathgroup && !selMarks.filter(exists).length) {
            selMarks.splice(index + 1, 0, cellDef);
        }
        return selMarks;
    }
};
exports.default = nearest;

},{}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var project = {
    has: function (selDef) {
        return selDef.fields !== undefined || selDef.encodings !== undefined;
    },
    parse: function (model, selDef, selCmpt) {
        var fields = {};
        // TODO: find a possible channel mapping for these fields.
        (selDef.fields || []).forEach(function (f) { return fields[f] = null; });
        (selDef.encodings || []).forEach(function (e) { return fields[model.field(e)] = e; });
        var projection = selCmpt.project || (selCmpt.project = []);
        for (var field in fields) {
            if (fields.hasOwnProperty(field)) {
                projection.push({ field: field, encoding: fields[field] });
            }
        }
    }
};
exports.default = project;

},{}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../../../log");
var scale_1 = require("../../../scale");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scaleBindings = {
    clippedGroup: true,
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var scales = model.component.scales;
        var bound = selCmpt.scales = [];
        selCmpt.project.forEach(function (p) {
            var channel = p.encoding;
            var scale = scales[channel];
            if (!scale || !scale_1.hasContinuousDomain(scale.type)) {
                log_1.warn('Scale bindings are currently only supported for scales with continuous domains.');
                return;
            }
            scale.domainRaw = { signal: selection_1.channelSignalName(selCmpt, channel) };
            bound.push(channel);
        });
    },
    topLevelSignals: function (model, selCmpt, signals) {
        return signals.concat(selCmpt.scales.map(function (channel) {
            return { name: selection_1.channelSignalName(selCmpt, channel) };
        }));
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        signals = signals.filter(function (s) {
            return s.name !== name + interval_1.SIZE &&
                s.name !== name + selection_1.TUPLE && s.name !== selection_1.MODIFY;
        });
        selCmpt.scales.forEach(function (channel) {
            var signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0];
            signal.push = 'outer';
            delete signal.value;
            delete signal.update;
        });
        return signals;
    }
};
exports.default = scaleBindings;
function domain(model, channel) {
    var scale = util_1.stringValue(model.scaleName(channel));
    return "domain(" + scale + ")";
}
exports.domain = domain;

},{"../../../log":113,"../../../scale":115,"../../../util":124,"../interval":91,"../selection":93}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../selection");
var TOGGLE = '_toggle';
var toggle = {
    has: function (selCmpt) {
        return selCmpt.toggle !== undefined && selCmpt.toggle !== false;
    },
    signals: function (model, selCmpt, signals) {
        return signals.concat({
            name: selCmpt.name + TOGGLE,
            value: false,
            on: [{ events: selCmpt.events, update: selCmpt.toggle }]
        });
    },
    modifyExpr: function (model, selCmpt, expr) {
        var tpl = selCmpt.name + selection_1.TUPLE, signal = selCmpt.name + TOGGLE;
        return signal + " ? null : " + tpl + ", " +
            (signal + " ? null : true, ") +
            (signal + " ? " + tpl + " : null");
    }
};
exports.default = toggle;

},{"../selection":93}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inputs_1 = require("./inputs");
var nearest_1 = require("./nearest");
var project_1 = require("./project");
var scales_1 = require("./scales");
var toggle_1 = require("./toggle");
var translate_1 = require("./translate");
var zoom_1 = require("./zoom");
var compilers = { project: project_1.default, toggle: toggle_1.default, scales: scales_1.default,
    translate: translate_1.default, zoom: zoom_1.default, inputs: inputs_1.default, nearest: nearest_1.default };
function forEachTransform(selCmpt, cb) {
    for (var t in compilers) {
        if (compilers[t].has(selCmpt)) {
            cb(compilers[t]);
        }
    }
}
exports.forEachTransform = forEachTransform;

},{"./inputs":95,"./nearest":96,"./project":97,"./scales":98,"./toggle":99,"./translate":101,"./zoom":102}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var scales_1 = require("./scales");
var ANCHOR = '_translate_anchor', DELTA = '_translate_delta';
var translate = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, scales = scales_1.default.has(selCmpt), size = scales ? 'unit' : name + interval_1.SIZE, anchor = name + ANCHOR, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y;
        var events = vega_event_selector_1.selector(selCmpt.translate, 'scope');
        if (!scales) {
            events = events.map(function (e) { return (e.between[0].markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: anchor,
            value: {},
            on: [{
                    events: events.map(function (e) { return e.between[0]; }),
                    update: '{x: x(unit), y: y(unit), ' +
                        ("width: " + size + ".width, height: " + size + ".height, ") +
                        (x !== null ? 'extent_x: ' + (scales ? scales_1.domain(model, channel_1.X) :
                            "slice(" + name + "_x)") + ', ' : '') +
                        (y !== null ? 'extent_y: ' + (scales ? scales_1.domain(model, channel_1.Y) :
                            "slice(" + name + "_y)") + ', ' : '') + '}'
                }]
        }, {
            name: name + DELTA,
            value: {},
            on: [{
                    events: events,
                    update: "{x: x(unit) - " + anchor + ".x, y: y(unit) - " + anchor + ".y}"
                }]
        });
        if (x !== null) {
            onDelta(model, selCmpt, channel_1.X, 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, channel_1.Y, 'height', signals);
        }
        return signals;
    }
};
exports.default = translate;
function getSign(selCmpt, channel) {
    var s = channel === channel_1.X ? '+' : '-';
    if (scales_1.default.has(selCmpt)) {
        s = s === '+' ? '-' : '+';
    }
    return s;
}
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0], anchor = name + ANCHOR, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), extent = ".extent_" + channel, sign = getSign(selCmpt, channel), offset = sign + " abs(span(" + anchor + extent + ")) * " +
        (delta + "." + channel + " / " + anchor + "." + size), range = "[" + anchor + extent + "[0] " + offset + ", " +
        ("" + anchor + extent + "[1] " + offset + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales_1.default.has(selCmpt) ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}

},{"../../../channel":44,"../../../util":124,"../interval":91,"./scales":98,"vega-event-selector":39}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_event_selector_1 = require("vega-event-selector");
var channel_1 = require("../../../channel");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var scales_1 = require("./scales");
var ANCHOR = '_zoom_anchor', DELTA = '_zoom_delta';
var zoom = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name, delta = name + DELTA, _a = interval_1.projections(selCmpt), x = _a.x, y = _a.y, sx = util_1.stringValue(model.scaleName(channel_1.X)), sy = util_1.stringValue(model.scaleName(channel_1.Y));
        var events = vega_event_selector_1.selector(selCmpt.zoom, 'scope');
        if (!scales_1.default.has(selCmpt)) {
            events = events.map(function (e) { return (e.markname = name + interval_1.BRUSH, e); });
        }
        signals.push({
            name: name + ANCHOR,
            on: [{
                    events: events,
                    update: "{x: invert(" + sx + ", x(unit)), y: invert(" + sy + ", y(unit))}"
                }]
        }, {
            name: delta,
            on: [{
                    events: events,
                    force: true,
                    update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
                }]
        });
        if (x !== null) {
            onDelta(model, selCmpt, 'x', 'width', signals);
        }
        if (y !== null) {
            onDelta(model, selCmpt, 'y', 'height', signals);
        }
        var size = signals.filter(function (s) { return s.name === name + interval_1.SIZE; });
        if (size.length) {
            var sname = size[0].name;
            size[0].on.push({
                events: { signal: delta },
                update: "{x: " + sname + ".x, y: " + sname + ".y, " +
                    ("width: " + sname + ".width * " + delta + " , ") +
                    ("height: " + sname + ".height * " + delta + "}")
            });
        }
        return signals;
    }
};
exports.default = zoom;
function onDelta(model, selCmpt, channel, size, signals) {
    var name = selCmpt.name, signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0], scales = scales_1.default.has(selCmpt), base = scales ? scales_1.domain(model, channel) : signal.name, anchor = "" + name + ANCHOR + "." + channel, delta = name + DELTA, scale = util_1.stringValue(model.scaleName(channel)), range = "[" + anchor + " + (" + base + "[0] - " + anchor + ") * " + delta + ", " +
        (anchor + " + (" + base + "[1] - " + anchor + ") * " + delta + "]"), lo = "invert(" + scale + (channel === channel_1.X ? ', 0' : ", unit." + size) + ')', hi = "invert(" + scale + (channel === channel_1.X ? ", unit." + size : ', 0') + ')';
    signal.on.push({
        events: { signal: delta },
        update: scales ? range : "clampRange(" + range + ", " + lo + ", " + hi + ")"
    });
}

},{"../../../channel":44,"../../../util":124,"../interval":91,"./scales":98,"vega-event-selector":39}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var vlEncoding = require("../encoding"); // TODO: remove
var fielddef_1 = require("../fielddef");
var mark_1 = require("../mark");
var scale_1 = require("../scale");
var stack_1 = require("../stack");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_2 = require("./data/parse");
var layout_1 = require("./layout");
var parse_3 = require("./legend/parse");
var init_1 = require("./mark/init");
var mark_2 = require("./mark/mark");
var model_1 = require("./model");
var init_2 = require("./scale/init");
var parse_4 = require("./scale/parse");
var selection_1 = require("./selection/selection");
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
var UnitModel = (function (_super) {
    tslib_1.__extends(UnitModel, _super);
    function UnitModel(spec, parent, parentGivenName, cfg) {
        var _this = _super.call(this, spec, parent, parentGivenName, cfg) || this;
        _this.selection = {};
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.children = [];
        // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten
        _this.initFacetCellConfig();
        // use top-level width / height or parent's top-level width / height
        // FIXME: once facet supports width/height, this is no longer correct!
        var providedWidth = spec.width !== undefined ? spec.width :
            parent ? parent['width'] : undefined; // only exists if parent is layer
        var providedHeight = spec.height !== undefined ? spec.height :
            parent ? parent['height'] : undefined; // only exists if parent is layer
        var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
        var encoding = _this.encoding = encoding_1.normalizeEncoding(spec.encoding || {}, mark);
        // calculate stack properties
        _this.stack = stack_1.stack(mark, encoding, _this.config.stack);
        _this.scales = _this.initScales(mark, encoding, providedWidth, providedHeight);
        _this.markDef = init_1.initMarkDef(spec.mark, encoding, _this.scales, _this.config);
        _this.encoding = init_1.initEncoding(mark, encoding, _this.stack, _this.config);
        _this.axes = _this.initAxes(encoding);
        _this.legends = _this.initLegend(encoding);
        // Selections will be initialized upon parse.
        _this.selection = spec.selection;
        // width / height
        var _a = _this.initSize(mark, _this.scales, providedWidth, providedHeight), _b = _a.width, width = _b === void 0 ? _this.width : _b, _c = _a.height, height = _c === void 0 ? _this.height : _c;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    UnitModel.prototype.initFacetCellConfig = function () {
        var config = this.config;
        var ancestor = this.parent;
        var hasFacetAncestor = false;
        while (ancestor !== null) {
            if (ancestor.isFacet()) {
                hasFacetAncestor = true;
                break;
            }
            ancestor = ancestor.parent;
        }
        if (hasFacetAncestor) {
            config.cell = util_1.extend({}, config.cell, config.facet.cell);
        }
    };
    UnitModel.prototype.initScales = function (mark, encoding, topLevelWidth, topLevelHeight) {
        var _this = this;
        var xyRangeSteps = [];
        return channel_1.UNIT_SCALE_CHANNELS.reduce(function (scales, channel) {
            if (vlEncoding.channelHasField(encoding, channel) ||
                (channel === channel_1.X && vlEncoding.channelHasField(encoding, channel_1.X2)) ||
                (channel === channel_1.Y && vlEncoding.channelHasField(encoding, channel_1.Y2))) {
                var scale = scales[channel] = init_2.default(channel, encoding[channel], _this.config, mark, channel === channel_1.X ? topLevelWidth : channel === channel_1.Y ? topLevelHeight : undefined, xyRangeSteps // for determine point / bar size
                );
                if (channel === channel_1.X || channel === channel_1.Y) {
                    if (scale.rangeStep) {
                        xyRangeSteps.push(scale.rangeStep);
                    }
                }
            }
            return scales;
        }, {});
    };
    // TODO: consolidate this with scale?  Current scale range is in parseScale (later),
    // but not in initScale because scale range depends on size,
    // but size depends on scale type and rangeStep
    UnitModel.prototype.initSize = function (mark, scale, width, height) {
        var cellConfig = this.config.cell;
        var scaleConfig = this.config.scale;
        if (width === undefined) {
            if (scale[channel_1.X]) {
                if (!scale_1.hasDiscreteDomain(scale[channel_1.X].type) || !scale[channel_1.X].rangeStep) {
                    width = cellConfig.width;
                } // else: Do nothing, use dynamic width.
            }
            else {
                if (mark === mark_1.TEXT) {
                    // for text table without x/y scale we need wider rangeStep
                    width = scaleConfig.textXRangeStep;
                }
                else {
                    if (typeof scaleConfig.rangeStep === 'string') {
                        throw new Error('_initSize does not handle string rangeSteps');
                    }
                    width = scaleConfig.rangeStep;
                }
            }
        }
        if (height === undefined) {
            if (scale[channel_1.Y]) {
                if (!scale_1.hasDiscreteDomain(scale[channel_1.Y].type) || !scale[channel_1.Y].rangeStep) {
                    height = cellConfig.height;
                } // else: Do nothing, use dynamic height .
            }
            else {
                if (typeof scaleConfig.rangeStep === 'string') {
                    throw new Error('_initSize does not handle string rangeSteps');
                }
                height = scaleConfig.rangeStep;
            }
        }
        return { width: width, height: height };
    };
    UnitModel.prototype.initAxes = function (encoding) {
        return [channel_1.X, channel_1.Y].reduce(function (_axis, channel) {
            // Position Axis
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef) ||
                (channel === channel_1.X && fielddef_1.isFieldDef(encoding.x2)) ||
                (channel === channel_1.Y && fielddef_1.isFieldDef(encoding.y2))) {
                var axisSpec = fielddef_1.isFieldDef(channelDef) ? channelDef.axis : null;
                // We no longer support false in the schema, but we keep false here for backward compatability.
                if (axisSpec !== null && axisSpec !== false) {
                    _axis[channel] = tslib_1.__assign({}, axisSpec);
                }
            }
            return _axis;
        }, {});
    };
    UnitModel.prototype.initLegend = function (encoding) {
        return channel_1.NONSPATIAL_SCALE_CHANNELS.reduce(function (_legend, channel) {
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef)) {
                var legendSpec = channelDef.legend;
                if (legendSpec !== null && legendSpec !== false) {
                    _legend[channel] = tslib_1.__assign({}, legendSpec);
                }
            }
            return _legend;
        }, {});
    };
    UnitModel.prototype.parseData = function () {
        this.component.data = parse_2.parseData(this);
    };
    UnitModel.prototype.parseSelection = function () {
        this.component.selection = selection_1.parseUnitSelection(this, this.selection);
    };
    UnitModel.prototype.parseLayoutData = function () {
        this.component.layout = layout_1.parseUnitLayout(this);
    };
    UnitModel.prototype.parseScale = function () {
        this.component.scales = parse_4.default(this);
    };
    UnitModel.prototype.parseMark = function () {
        this.component.mark = mark_2.parseMark(this);
    };
    UnitModel.prototype.parseAxis = function () {
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.X, channel_1.Y]);
    };
    UnitModel.prototype.parseAxisGroup = function () {
        return null;
    };
    UnitModel.prototype.parseGridGroup = function () {
        return null;
    };
    UnitModel.prototype.parseLegend = function () {
        this.component.legends = parse_3.parseLegendComponent(this);
    };
    UnitModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    UnitModel.prototype.assembleSignals = function (signals) {
        return selection_1.assembleUnitSignals(this, signals);
    };
    UnitModel.prototype.assembleSelectionData = function (data) {
        return selection_1.assembleUnitData(this, data);
    };
    UnitModel.prototype.assembleLayout = function (layoutData) {
        return layout_1.assembleLayout(this, layoutData);
    };
    UnitModel.prototype.assembleMarks = function () {
        var marks = this.component.mark || [];
        marks = selection_1.assembleUnitMarks(this, marks);
        return marks.map(this.correctDataNames);
    };
    UnitModel.prototype.assembleParentGroupProperties = function (cellConfig) {
        return common_1.applyConfig({}, cellConfig, mark_1.FILL_STROKE_CONFIG.concat(['clip']));
    };
    UnitModel.prototype.channels = function () {
        return channel_1.UNIT_CHANNELS;
    };
    UnitModel.prototype.getMapping = function () {
        return this.encoding;
    };
    UnitModel.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this.encoding);
        var spec;
        spec = {
            mark: this.markDef,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this.config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this.data);
        }
        // remove defaults
        return spec;
    };
    UnitModel.prototype.mark = function () {
        return this.markDef.type;
    };
    UnitModel.prototype.channelHasField = function (channel) {
        return vlEncoding.channelHasField(this.encoding, channel);
    };
    UnitModel.prototype.fieldDef = function (channel) {
        // TODO: remove this || {}
        // Currently we have it to prevent null pointer exception.
        return this.encoding[channel] || {};
    };
    /** Get "field" reference for vega */
    UnitModel.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
            }, opt);
        }
        return fielddef_1.field(fieldDef, opt);
    };
    UnitModel.prototype.isUnit = function () {
        return true;
    };
    return UnitModel;
}(model_1.Model));
exports.UnitModel = UnitModel;

},{"../channel":44,"../encoding":108,"../fielddef":110,"../mark":114,"../scale":115,"../stack":119,"../util":124,"./axis/parse":46,"./common":48,"./data/assemble":51,"./data/parse":59,"./layout":67,"./legend/parse":69,"./mark/init":73,"./mark/mark":75,"./model":83,"./scale/init":86,"./scale/parse":87,"./selection/selection":93,"tslib":38}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("./mark");
exports.ERRORBAR = 'error-bar';
/**
 * Registry index for all composite mark's normalizer
 */
var normalizerRegistry = {};
function add(mark, normalizer) {
    normalizerRegistry[mark] = normalizer;
}
exports.add = add;
function remove(mark) {
    delete normalizerRegistry[mark];
}
exports.remove = remove;
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec) {
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var normalizer = normalizerRegistry[mark];
    if (normalizer) {
        return normalizer(spec);
    }
    throw new Error("Unregistered composite mark " + mark);
}
exports.normalize = normalize;
add(exports.ERRORBAR, function (spec) {
    var _m = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var _s = encoding.size, encodingWithoutSize = tslib_1.__rest(encoding, ["size"]);
    var _x2 = encoding.x2, _y2 = encoding.y2, encodingWithoutX2Y2 = tslib_1.__rest(encoding, ["x2", "y2"]);
    var _x = encodingWithoutX2Y2.x, _y = encodingWithoutX2Y2.y, encodingWithoutX_X2_Y_Y2 = tslib_1.__rest(encodingWithoutX2Y2, ["x", "y"]);
    if (!encoding.x2 && !encoding.y2) {
        throw new Error('Neither x2 or y2 provided');
    }
    return tslib_1.__assign({}, outerSpec, { layer: [
            {
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: encoding.x2 ? tslib_1.__assign({ x: encoding.x2, y: encoding.y }, encodingWithoutX_X2_Y_Y2) : tslib_1.__assign({ x: encoding.x, y: encoding.y2 }, encodingWithoutX_X2_Y_Y2)
            }
        ] });
});

},{"./mark":114,"tslib":38}],105:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legend_1 = require("./legend");
var mark = require("./mark");
var scale_1 = require("./scale");
var selection_1 = require("./selection");
var util_1 = require("./util");
exports.defaultCellConfig = {
    width: 200,
    height: 200,
    fill: 'transparent'
};
exports.defaultFacetCellConfig = {
    stroke: '#ccc',
    strokeWidth: 1
};
var defaultFacetGridConfig = {
    color: '#000000',
    opacity: 0.4,
    offset: 0
};
exports.defaultFacetConfig = {
    axis: {},
    grid: defaultFacetGridConfig,
    cell: exports.defaultFacetCellConfig
};
exports.defaultOverlayConfig = {
    line: false
};
exports.defaultConfig = {
    padding: 5,
    numberFormat: 's',
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    cell: exports.defaultCellConfig,
    mark: mark.defaultMarkConfig,
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    line: {},
    point: {},
    rect: {},
    rule: {},
    square: {},
    text: mark.defaultTextConfig,
    tick: mark.defaultTickConfig,
    overlay: exports.defaultOverlayConfig,
    scale: scale_1.defaultScaleConfig,
    axis: {},
    axisX: {},
    axisY: {},
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: legend_1.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
    selection: selection_1.defaultConfig,
};
function initConfig(config) {
    return util_1.mergeDeep(util_1.duplicate(exports.defaultConfig), config);
}
exports.initConfig = initConfig;

},{"./legend":112,"./mark":114,"./scale":115,"./selection":116,"./util":124}],106:[function(require,module,exports){
/*
 * Constants and utilities for data.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUrlData(data) {
    return !!data['url'];
}
exports.isUrlData = isUrlData;
function isInlineData(data) {
    return !!data['values'];
}
exports.isInlineData = isInlineData;
function isNamedData(data) {
    return !!data['name'];
}
exports.isNamedData = isNamedData;
exports.MAIN = 'main';
exports.RAW = 'raw';
exports.LAYOUT = 'layout';

},{}],107:[function(require,module,exports){
// DateTime definition object
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var util_1 = require("./util");
/*
 * A designated year that starts on Sunday.
 */
var SUNDAY_YEAR = 2006;
function isDateTime(o) {
    return !!o && (!!o.year || !!o.quarter || !!o.month || !!o.date || !!o.day ||
        !!o.hours || !!o.minutes || !!o.seconds || !!o.milliseconds);
}
exports.isDateTime = isDateTime;
exports.MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
exports.SHORT_MONTHS = exports.MONTHS.map(function (m) { return m.substr(0, 3); });
exports.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
exports.SHORT_DAYS = exports.DAYS.map(function (d) { return d.substr(0, 3); });
function normalizeQuarter(q) {
    if (util_1.isNumber(q)) {
        if (q > 4) {
            log.warn(log.message.invalidTimeUnit('quarter', q));
        }
        // We accept 1-based quarter, so need to readjust to 0-based quarter
        return (q - 1) + '';
    }
    else {
        // Invalid quarter
        throw new Error(log.message.invalidTimeUnit('quarter', q));
    }
}
function normalizeMonth(m) {
    if (util_1.isNumber(m)) {
        // We accept 1-based month, so need to readjust to 0-based month
        return (m - 1) + '';
    }
    else {
        var lowerM = m.toLowerCase();
        var monthIndex = exports.MONTHS.indexOf(lowerM);
        if (monthIndex !== -1) {
            return monthIndex + ''; // 0 for january, ...
        }
        var shortM = lowerM.substr(0, 3);
        var shortMonthIndex = exports.SHORT_MONTHS.indexOf(shortM);
        if (shortMonthIndex !== -1) {
            return shortMonthIndex + '';
        }
        // Invalid month
        throw new Error(log.message.invalidTimeUnit('month', m));
    }
}
function normalizeDay(d) {
    if (util_1.isNumber(d)) {
        // mod so that this can be both 0-based where 0 = sunday
        // and 1-based where 7=sunday
        return (d % 7) + '';
    }
    else {
        var lowerD = d.toLowerCase();
        var dayIndex = exports.DAYS.indexOf(lowerD);
        if (dayIndex !== -1) {
            return dayIndex + ''; // 0 for january, ...
        }
        var shortD = lowerD.substr(0, 3);
        var shortDayIndex = exports.SHORT_DAYS.indexOf(shortD);
        if (shortDayIndex !== -1) {
            return shortDayIndex + '';
        }
        // Invalid day
        throw new Error(log.message.invalidTimeUnit('day', d));
    }
}
function timestamp(d, normalize) {
    var date = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
    // FIXME support UTC
    if (d.day !== undefined) {
        if (util_1.keys(d).length > 1) {
            log.warn(log.message.droppedDay(d));
            d = util_1.duplicate(d);
            delete d.day;
        }
        else {
            // Use a year that has 1/1 as Sunday so we can setDate below
            date.setFullYear(SUNDAY_YEAR);
            var day = normalize ? normalizeDay(d.day) : d.day;
            date.setDate(+day + 1); // +1 since date start at 1 in JS
        }
    }
    if (d.year !== undefined) {
        date.setFullYear(d.year);
    }
    if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        date.setMonth(+quarter * 3);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        date.setMonth(+month);
    }
    if (d.date !== undefined) {
        date.setDate(d.date);
    }
    if (d.hours !== undefined) {
        date.setHours(d.hours);
    }
    if (d.minutes !== undefined) {
        date.setMinutes(d.minutes);
    }
    if (d.seconds !== undefined) {
        date.setSeconds(d.seconds);
    }
    if (d.milliseconds !== undefined) {
        date.setMilliseconds(d.milliseconds);
    }
    return date.getTime();
}
exports.timestamp = timestamp;
/**
 * Return Vega Expression for a particular date time.
 * @param d
 * @param normalize whether to normalize quarter, month, day.
 */
function dateTimeExpr(d, normalize) {
    if (normalize === void 0) { normalize = false; }
    var units = [];
    if (normalize && d.day !== undefined) {
        if (util_1.keys(d).length > 1) {
            log.warn(log.message.droppedDay(d));
            d = util_1.duplicate(d);
            delete d.day;
        }
    }
    if (d.year !== undefined) {
        units.push(d.year);
    }
    else if (d.day !== undefined) {
        // Set year to 2006 for working with day since January 1 2006 is a Sunday
        units.push(SUNDAY_YEAR);
    }
    else {
        units.push(0);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        units.push(month);
    }
    else if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        units.push(quarter + '*3');
    }
    else {
        units.push(0); // months start at zero in JS
    }
    if (d.date !== undefined) {
        units.push(d.date);
    }
    else if (d.day !== undefined) {
        // HACK: Day only works as a standalone unit
        // This is only correct because we always set year to 2006 for day
        var day = normalize ? normalizeDay(d.day) : d.day;
        units.push(day + '+1');
    }
    else {
        units.push(1); // Date starts at 1 in JS
    }
    // Note: can't use TimeUnit enum here as importing it will create
    // circular dependency problem!
    for (var _i = 0, _a = ['hours', 'minutes', 'seconds', 'milliseconds']; _i < _a.length; _i++) {
        var timeUnit = _a[_i];
        if (d[timeUnit] !== undefined) {
            units.push(d[timeUnit]);
        }
        else {
            units.push(0);
        }
    }
    return 'datetime(' + units.join(', ') + ')';
}
exports.dateTimeExpr = dateTimeExpr;

},{"./log":113,"./util":124}],108:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utility for encoding mapping
var channel_1 = require("./channel");
var fielddef_1 = require("./fielddef");
var log = require("./log");
var util_1 = require("./util");
function channelHasField(encoding, channel) {
    var channelDef = encoding && encoding[channel];
    if (channelDef) {
        if (util_1.isArray(channelDef)) {
            return util_1.some(channelDef, function (fieldDef) { return !!fieldDef.field; });
        }
        else {
            return fielddef_1.isFieldDef(channelDef);
        }
    }
    return false;
}
exports.channelHasField = channelHasField;
function isAggregate(encoding) {
    return util_1.some(channel_1.CHANNELS, function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            if (util_1.isArray(channelDef)) {
                return util_1.some(channelDef, function (fieldDef) { return !!fieldDef.aggregate; });
            }
            else {
                return fielddef_1.isFieldDef(channelDef) && !!channelDef.aggregate;
            }
        }
        return false;
    });
}
exports.isAggregate = isAggregate;
function normalizeEncoding(encoding, mark) {
    return Object.keys(encoding).reduce(function (normalizedEncoding, channel) {
        if (!channel_1.supportMark(channel, mark)) {
            // Drop unsupported channel
            log.warn(log.message.incompatibleChannel(channel, mark));
            return normalizedEncoding;
        }
        // Drop line's size if the field is aggregated.
        if (channel === 'size' && mark === 'line') {
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef) && channelDef.aggregate) {
                log.warn(log.message.incompatibleChannel(channel, mark, 'when the field is aggregated.'));
                return normalizedEncoding;
            }
        }
        if (util_1.isArray(encoding[channel])) {
            // Array of fieldDefs for detail channel (or production rule)
            normalizedEncoding[channel] = encoding[channel].reduce(function (channelDefs, channelDef) {
                if (!fielddef_1.isFieldDef(channelDef) && !fielddef_1.isValueDef(channelDef)) {
                    log.warn(log.message.emptyFieldDef(channelDef, channel));
                }
                else {
                    channelDefs.push(fielddef_1.normalize(channelDef, channel));
                }
                return channelDefs;
            }, []);
        }
        else {
            var channelDef = encoding[channel];
            if (!fielddef_1.isFieldDef(channelDef) && !fielddef_1.isValueDef(channelDef)) {
                log.warn(log.message.emptyFieldDef(channelDef, channel));
                return normalizedEncoding;
            }
            normalizedEncoding[channel] = fielddef_1.normalize(channelDef, channel);
        }
        return normalizedEncoding;
    }, {});
}
exports.normalizeEncoding = normalizeEncoding;
function isRanged(encoding) {
    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}
exports.isRanged = isRanged;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                arr.push(fieldDef);
            });
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
function forEach(mapping, f, thisArg) {
    if (!mapping) {
        return;
    }
    Object.keys(mapping).forEach(function (c) {
        var channel = c;
        if (util_1.isArray(mapping[channel])) {
            mapping[channel].forEach(function (channelDef) {
                f.call(thisArg, channelDef, channel);
            });
        }
        else {
            f.call(thisArg, mapping[channel], channel);
        }
    });
}
exports.forEach = forEach;
function reduce(mapping, f, init, thisArg) {
    if (!mapping) {
        return init;
    }
    return Object.keys(mapping).reduce(function (r, c) {
        var channel = c;
        if (util_1.isArray(mapping[channel])) {
            return mapping[channel].reduce(function (r1, channelDef) {
                return f.call(thisArg, r1, channelDef, channel);
            }, r);
        }
        else {
            return f.call(thisArg, r, mapping[channel], channel);
        }
    }, init);
}
exports.reduce = reduce;

},{"./channel":44,"./fielddef":110,"./log":113,"./util":124}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],110:[function(require,module,exports){
// utility for a field definition object
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var channel_1 = require("./channel");
var log = require("./log");
var timeunit_1 = require("./timeunit");
var type_1 = require("./type");
var util_1 = require("./util");
function isFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
exports.isFieldDef = isFieldDef;
function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
exports.isValueDef = isValueDef;
function field(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var field = fieldDef.field;
    var prefix = opt.prefix;
    var suffix = opt.suffix;
    if (isCount(fieldDef)) {
        field = 'count_*';
    }
    else {
        var fn = undefined;
        if (!opt.nofn) {
            if (fieldDef.bin) {
                fn = bin_1.binToString(fieldDef.bin);
                suffix = opt.binSuffix;
            }
            else if (fieldDef.aggregate) {
                fn = String(opt.aggregate || fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (fn) {
            field = fn + "_" + field;
        }
    }
    if (suffix) {
        field = field + "_" + suffix;
    }
    if (prefix) {
        field = prefix + "_" + field;
    }
    if (opt.datum) {
        field = "datum[\"" + field + "\"]";
    }
    return field;
}
exports.field = field;
function isDiscrete(fieldDef) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            return true;
        case 'quantitative':
            return !!fieldDef.bin;
        case 'temporal':
            // TODO: deal with custom scale type case.
            return timeunit_1.isDiscreteByDefault(fieldDef.timeUnit);
    }
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
exports.isDiscrete = isDiscrete;
function isContinuous(fieldDef) {
    return !isDiscrete(fieldDef);
}
exports.isContinuous = isContinuous;
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function title(fieldDef, config) {
    if (fieldDef.title != null) {
        return fieldDef.title;
    }
    if (isCount(fieldDef)) {
        return config.countTitle;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
exports.title = title;
function defaultType(fieldDef, channel) {
    if (fieldDef.timeUnit) {
        return 'temporal';
    }
    if (fieldDef.bin) {
        return 'quantitative';
    }
    switch (channel_1.rangeType(channel)) {
        case 'continuous':
            return 'quantitative';
        case 'discrete':
            return 'nominal';
        case 'flexible':
            return 'nominal';
        default:
            return 'quantitative';
    }
}
exports.defaultType = defaultType;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
function normalize(channelDef, channel) {
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(channelDef)) {
        var fieldDef = channelDef;
        // Drop invalid aggregate
        if (fieldDef.aggregate && !aggregate_1.AGGREGATE_OP_INDEX[fieldDef.aggregate]) {
            var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
            log.warn(log.message.invalidAggregate(fieldDef.aggregate));
            fieldDef = fieldDefWithoutAggregate;
        }
        // Normalize bin
        if (fieldDef.bin) {
            var bin = fieldDef.bin;
            if (util_1.isBoolean(bin)) {
                fieldDef = tslib_1.__assign({}, fieldDef, { bin: { maxbins: bin_1.autoMaxBins(channel) } });
            }
            else if (!bin.maxbins && !bin.step) {
                fieldDef = tslib_1.__assign({}, fieldDef, { bin: tslib_1.__assign({}, bin, { maxbins: bin_1.autoMaxBins(channel) }) });
            }
        }
        // Normalize Type
        if (fieldDef.type) {
            var fullType = type_1.getFullName(fieldDef.type);
            if (fieldDef.type !== fullType) {
                // convert short type to full type
                fieldDef = tslib_1.__assign({}, fieldDef, { type: fullType });
            }
        }
        else {
            // If type is empty / invalid, then augment with default type
            var newType = defaultType(fieldDef, channel);
            log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
            fieldDef = tslib_1.__assign({}, fieldDef, { type: newType });
        }
        var _a = channelCompatibility(fieldDef, channel), compatible = _a.compatible, warning = _a.warning;
        if (!compatible) {
            log.warn(warning);
        }
        return fieldDef;
    }
    return channelDef;
}
exports.normalize = normalize;
var COMPATIBLE = { compatible: true };
function channelCompatibility(fieldDef, channel) {
    switch (channel) {
        case 'row':
        case 'column':
            if (isContinuous(fieldDef) && !fieldDef.timeUnit) {
                // TODO:(https://github.com/vega/vega-lite/issues/2011):
                // with timeUnit it's not always strictly continuous
                return {
                    compatible: false,
                    warning: log.message.facetChannelShouldBeDiscrete(channel)
                };
            }
            return COMPATIBLE;
        case 'x':
        case 'y':
        case 'color':
        case 'text':
        case 'detail':
            return COMPATIBLE;
        case 'opacity':
        case 'size':
        case 'x2':
        case 'y2':
            if (isDiscrete(fieldDef) && !fieldDef.bin) {
                return {
                    compatible: false,
                    warning: "Channel " + channel + " should not be used with discrete field."
                };
            }
            return COMPATIBLE;
        case 'shape':
            if (fieldDef.type !== 'nominal') {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with nominal data only'
                };
            }
            return COMPATIBLE;
        case 'order':
            if (fieldDef.type === 'nominal') {
                return {
                    compatible: false,
                    warning: "Channel order is inappropriate for nominal field, which has no inherent order."
                };
            }
            return COMPATIBLE;
    }
    throw new Error('channelCompatability not implemented for channel ' + channel);
}
exports.channelCompatibility = channelCompatibility;

},{"./aggregate":41,"./bin":43,"./channel":44,"./log":113,"./timeunit":120,"./type":123,"./util":124,"tslib":38}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime_1 = require("./datetime");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
exports.isEqualFilter = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && filter.field) {
        if (util_1.isArray(filter.range) && filter.range.length === 2) {
            return true;
        }
    }
    return false;
}
exports.isRangeFilter = isRangeFilter;
function isOneOfFilter(filter) {
    return filter && !!filter.field && (util_1.isArray(filter.oneOf) ||
        util_1.isArray(filter.in) // backward compatibility
    );
}
exports.isOneOfFilter = isOneOfFilter;
/**
 * Converts a filter into an expression.
 */
function expression(filter) {
    if (util_1.isArray(filter)) {
        return '(' +
            filter.map(function (f) { return expression(f); })
                .filter(function (f) { return f !== undefined; })
                .join(') && (') +
            ')';
    }
    else if (util_1.isString(filter)) {
        return filter;
    }
    else {
        var fieldExpr = filter.timeUnit ?
            // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
            // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
            // TODO: support utc
            ('time(' + timeunit_1.fieldExpr(filter.timeUnit, filter.field) + ')') :
            fielddef_1.field(filter, { datum: true });
        if (isEqualFilter(filter)) {
            return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
        }
        else if (isOneOfFilter(filter)) {
            // "oneOf" was formerly "in" -- so we need to add backward compatibility
            var oneOf = filter.oneOf || filter['in'];
            return 'indexof([' +
                oneOf.map(function (v) { return valueExpr(v, filter.timeUnit); }).join(',') +
                '], ' + fieldExpr + ') !== -1';
        }
        else if (isRangeFilter(filter)) {
            var lower = filter.range[0];
            var upper = filter.range[1];
            if (lower !== null && upper !== null) {
                return 'inrange(' + fieldExpr + ', ' +
                    valueExpr(lower, filter.timeUnit) + ', ' +
                    valueExpr(upper, filter.timeUnit) + ')';
            }
            else if (lower !== null) {
                return fieldExpr + ' >= ' + lower;
            }
            else if (upper !== null) {
                return fieldExpr + ' <= ' + upper;
            }
        }
    }
    return undefined;
}
exports.expression = expression;
function valueExpr(v, timeUnit) {
    if (datetime_1.isDateTime(v)) {
        var expr = datetime_1.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit_1.isSingleTimeUnit(timeUnit)) {
        var datetime = {};
        datetime[timeUnit] = v;
        var expr = datetime_1.dateTimeExpr(datetime, true);
        return 'time(' + expr + ')';
    }
    return JSON.stringify(v);
}

},{"./datetime":107,"./fielddef":110,"./timeunit":120,"./util":124}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLegendConfig = {
    orient: undefined,
};
exports.LEGEND_PROPERTIES = ['entryPadding', 'format', 'offset', 'orient', 'tickCount', 'title', 'type', 'values', 'zindex'];

},{}],113:[function(require,module,exports){
///<reference path="../typings/vega-util.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vega-Lite's singleton logger utility.
 */
var vega_util_1 = require("vega-util");
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
var main = vega_util_1.logger(vega_util_1.Warn);
var current = main;
/**
 * Logger tool for checking if the code throws correct warning
 */
var LocalLogger = (function () {
    function LocalLogger() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }
    LocalLogger.prototype.level = function () {
        return this;
    };
    LocalLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.warns).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.infos).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.debugs).push.apply(_a, args);
        return this;
        var _a;
    };
    return LocalLogger;
}());
exports.LocalLogger = LocalLogger;
function runLocalLogger(f) {
    var localLogger = current = new LocalLogger();
    f(localLogger);
    reset();
}
exports.runLocalLogger = runLocalLogger;
function wrap(f) {
    return function () {
        var logger = current = new LocalLogger();
        f(logger);
        reset();
    };
}
exports.wrap = wrap;
/**
 * Set the singleton logger to be a custom logger
 */
function set(logger) {
    current = logger;
    return current;
}
exports.set = set;
/**
 * Reset the main logger to use the default Vega Logger
 */
function reset() {
    current = main;
    return current;
}
exports.reset = reset;
function warn() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.warn.apply(current, arguments);
}
exports.warn = warn;
function info() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.info.apply(current, arguments);
}
exports.info = info;
function debug() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.debug.apply(current, arguments);
}
exports.debug = debug;
/**
 * Collection of all Vega-Lite Error Messages
 */
var message;
(function (message) {
    message.INVALID_SPEC = 'Invalid spec';
    // TRANSFORMS
    function invalidTransformIgnored(transform) {
        return "Ignoring an invalid transform: " + JSON.stringify(transform) + ".";
    }
    message.invalidTransformIgnored = invalidTransformIgnored;
    // ENCODING & FACET
    function invalidFieldType(type) {
        return "Invalid field type \"" + type + "\"";
    }
    message.invalidFieldType = invalidFieldType;
    function invalidAggregate(aggregate) {
        return "Invalid aggregation operator \"" + aggregate + "\"";
    }
    message.invalidAggregate = invalidAggregate;
    function emptyOrInvalidFieldType(type, channel, newType) {
        return "Invalid field type (" + type + ") for channel " + channel + ", using " + newType + " instead.";
    }
    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + JSON.stringify(fieldDef) + " from channel " + channel + " since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with " + markOrFacet +
            when ? "when " + when : '';
    }
    message.incompatibleChannel = incompatibleChannel;
    function facetChannelShouldBeDiscrete(channel) {
        return channel + " encoding should be discrete (ordinal / nominal / binned).";
    }
    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
    function discreteChannelCannotEncode(channel, type) {
        return "Using discrete channel " + channel + " to encode " + type + " field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
    }
    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
    // Mark
    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function unclearOrientContinuous(mark) {
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode continous fields. In this case, we use vertical by default';
    }
    message.unclearOrientContinuous = unclearOrientContinuous;
    function unclearOrientDiscreteOrEmpty(mark) {
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode discrete or empty fields.';
    }
    message.unclearOrientDiscreteOrEmpty = unclearOrientDiscreteOrEmpty;
    function orientOverridden(original, actual) {
        return "Specified orient " + original + " overridden with " + actual;
    }
    message.orientOverridden = orientOverridden;
    // SCALE
    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return "Cannot use " + prop + " with non-color channel.";
    }
    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return "Using unaggregated domain with raw field has no effect (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for " + aggregate + " since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
    message.CANNOT_USE_RANGE_WITH_POSITION = 'Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.';
    message.CANNOT_USE_PADDING_WITH_FACET = 'Cannot use padding with facet\'s scale.  Please use spacing instead.';
    function cannotUseRangePropertyWithFacet(propName) {
        return "Cannot use custom " + propName + " with row or column channel. Please use width, height, or spacing instead.";
    }
    message.cannotUseRangePropertyWithFacet = cannotUseRangePropertyWithFacet;
    function rangeStepDropped(channel) {
        return "rangeStep for " + channel + " is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }
    message.rangeStepDropped = rangeStepDropped;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return "Channel " + channel + " does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scaleTypeNotWorkWithFieldDef(scaleType, defaultScaleType) {
        return "FieldDef does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithFieldDef = scaleTypeNotWorkWithFieldDef;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return "Scale type \"" + scaleType + "\" does not work with mark " + mark + ".";
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
    message.INVAID_DOMAIN = 'Invalid scale domain';
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    // AXIS
    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return "Cannot stack " + channel + " if there is already " + channel + "2";
    }
    message.cannotStackRangedMark = cannotStackRangedMark;
    function cannotStackNonLinearScale(scaleType) {
        return "Cannot stack non-linear scale (" + scaleType + ")";
    }
    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
    function cannotStackNonSummativeAggregate(aggregate) {
        return "Cannot stack when the aggregate function is non-summative (" + aggregate + ")";
    }
    message.cannotStackNonSummativeAggregate = cannotStackNonSummativeAggregate;
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return "Invalid " + unitName + ": " + value;
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " +
            (fullTimeUnit + '').replace('day', 'date') + '.';
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return 'Dropping day from datetime ' + JSON.stringify(d) +
            ' as day cannot be combined with other units.';
    }
    message.droppedDay = droppedDay;
})(message = exports.message || (exports.message = {}));

},{"vega-util":128}],114:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Mark;
(function (Mark) {
    Mark.AREA = 'area';
    Mark.BAR = 'bar';
    Mark.LINE = 'line';
    Mark.POINT = 'point';
    Mark.RECT = 'rect';
    Mark.RULE = 'rule';
    Mark.TEXT = 'text';
    Mark.TICK = 'tick';
    Mark.CIRCLE = 'circle';
    Mark.SQUARE = 'square';
})(Mark = exports.Mark || (exports.Mark = {}));
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RECT = Mark.RECT;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.TICK, exports.RECT, exports.RULE, exports.CIRCLE, exports.SQUARE];
function isMarkDef(mark) {
    return mark['type'];
}
exports.isMarkDef = isMarkDef;
var PRIMITIVE_MARK_INDEX = util_1.toSet(exports.PRIMITIVE_MARKS);
function isPrimitiveMark(mark) {
    var markType = isMarkDef(mark) ? mark.type : mark;
    return markType in PRIMITIVE_MARK_INDEX;
}
exports.isPrimitiveMark = isPrimitiveMark;
exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
    'strokeDash', 'strokeDashOffset', 'strokeOpacity'];
exports.FILL_CONFIG = ['fill', 'fillOpacity'];
exports.FILL_STROKE_CONFIG = [].concat(exports.STROKE_CONFIG, exports.FILL_CONFIG);
exports.defaultMarkConfig = {
    color: '#4c78a8',
};
exports.defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 2
};
exports.defaultTextConfig = {
    baseline: 'middle',
};
exports.defaultTickConfig = {
    thickness: 1
};

},{"./util":124}],115:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var util_1 = require("./util");
var ScaleType;
(function (ScaleType) {
    // Continuous - Quantitative
    ScaleType.LINEAR = 'linear';
    ScaleType.BIN_LINEAR = 'bin-linear';
    ScaleType.LOG = 'log';
    ScaleType.POW = 'pow';
    ScaleType.SQRT = 'sqrt';
    // Continuous - Time
    ScaleType.TIME = 'time';
    ScaleType.UTC = 'utc';
    // sequential
    ScaleType.SEQUENTIAL = 'sequential';
    // Quantile, Quantize, threshold
    ScaleType.QUANTILE = 'quantile';
    ScaleType.QUANTIZE = 'quantize';
    ScaleType.THRESHOLD = 'threshold';
    ScaleType.ORDINAL = 'ordinal';
    ScaleType.BIN_ORDINAL = 'bin-ordinal';
    ScaleType.POINT = 'point';
    ScaleType.BAND = 'band';
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.SCALE_TYPES = [
    // Continuous - Quantitative
    'linear', 'bin-linear', 'log', 'pow', 'sqrt',
    // Continuous - Time
    'time', 'utc',
    // Sequential
    'sequential',
    // Discrete
    'ordinal', 'bin-ordinal', 'point', 'band',
];
exports.CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'bin-linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
var CONTINUOUS_TO_CONTINUOUS_INDEX = util_1.toSet(exports.CONTINUOUS_TO_CONTINUOUS_SCALES);
exports.CONTINUOUS_DOMAIN_SCALES = exports.CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
var CONTINUOUS_DOMAIN_INDEX = util_1.toSet(exports.CONTINUOUS_DOMAIN_SCALES);
exports.DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
var DISCRETE_DOMAIN_INDEX = util_1.toSet(exports.DISCRETE_DOMAIN_SCALES);
var BIN_SCALES_INDEX = util_1.toSet(['bin-linear', 'bin-ordinal']);
exports.TIME_SCALE_TYPES = ['time', 'utc'];
function hasDiscreteDomain(type) {
    return type in DISCRETE_DOMAIN_INDEX;
}
exports.hasDiscreteDomain = hasDiscreteDomain;
function isBinScale(type) {
    return type in BIN_SCALES_INDEX;
}
exports.isBinScale = isBinScale;
function hasContinuousDomain(type) {
    return type in CONTINUOUS_DOMAIN_INDEX;
}
exports.hasContinuousDomain = hasContinuousDomain;
function isContinuousToContinuous(type) {
    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
}
exports.isContinuousToContinuous = isContinuousToContinuous;
exports.defaultScaleConfig = {
    round: true,
    textXRangeStep: 90,
    rangeStep: 21,
    pointPadding: 0.5,
    bandPaddingInner: 0.1,
    facetSpacing: 16,
    minFontSize: 8,
    maxFontSize: 40,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    minStrokeWidth: 1,
    maxStrokeWidth: 4,
    shapes: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down']
};
function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
exports.isExtendedScheme = isExtendedScheme;
exports.SCALE_PROPERTIES = [
    'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'paddingInner', 'paddingOuter', 'clamp', 'nice',
    'exponent', 'zero', 'interpolate'
];
function scaleTypeSupportProperty(scaleType, propName) {
    switch (propName) {
        case 'type':
        case 'domain':
        case 'range':
        case 'scheme':
            return true;
        case 'interpolate':
            return util_1.contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);
        case 'round':
            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
        case 'rangeStep':
        case 'padding':
        case 'paddingOuter':
            return util_1.contains(['point', 'band'], scaleType);
        case 'paddingInner':
            return scaleType === 'band';
        case 'clamp':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
        case 'nice':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType === 'quantize';
        case 'exponent':
            return scaleType === 'pow' || scaleType === 'log';
        case 'zero':
            // TODO: what about quantize, threshold?
            return scaleType === 'bin-ordinal' || (!hasDiscreteDomain(scaleType) && !util_1.contains(['log', 'time', 'utc', 'bin-linear'], scaleType));
    }
    /* istanbul ignore next: should never reach here*/
    throw new Error("Invalid scale property " + propName + ".");
}
exports.scaleTypeSupportProperty = scaleTypeSupportProperty;
/**
 * Returns undefined if the input channel supports the input scale property name
 */
function channelScalePropertyIncompatability(channel, propName) {
    switch (propName) {
        case 'range':
            // User should not customize range for position and facet channel directly.
            if (channel === 'x' || channel === 'y') {
                return log.message.CANNOT_USE_RANGE_WITH_POSITION;
            }
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('range');
            }
            return undefined; // GOOD!
        // band / point
        case 'rangeStep':
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('rangeStep');
            }
            return undefined; // GOOD!
        case 'padding':
        case 'paddingInner':
        case 'paddingOuter':
            if (channel === 'row' || channel === 'column') {
                /*
                 * We do not use d3 scale's padding for row/column because padding there
                 * is a ratio ([0, 1]) and it causes the padding to be decimals.
                 * Therefore, we manually calculate "spacing" in the layout by ourselves.
                 */
                return log.message.CANNOT_USE_PADDING_WITH_FACET;
            }
            return undefined; // GOOD!
        case 'interpolate':
        case 'scheme':
            if (channel !== 'color') {
                return log.message.cannotUseScalePropertyWithNonColor(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'round':
        case 'clamp':
        case 'exponent':
        case 'nice':
        case 'zero':
            // These channel do not have strict requirement
            return undefined; // GOOD!
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error('Invalid scale property "${propName}".');
}
exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;

},{"./log":113,"./util":124}],116:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    single: { on: 'click', fields: ['_id'] },
    multi: { on: 'click', fields: ['_id'], toggle: 'event.shiftKey' },
    interval: {
        on: '[mousedown, window:mouseup] > window:mousemove!',
        encodings: ['x', 'y'],
        translate: '[mousedown, window:mouseup] > window:mousemove!',
        zoom: 'wheel'
    }
};

},{}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSortField(sort) {
    return !!sort && !!sort['field'] && !!sort['op'];
}
exports.isSortField = isSortField;

},{}],118:[function(require,module,exports){
/* Package of defining Vega-lite Specification's json schema at its utility functions */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var compositeMark = require("./compositemark");
var encoding_1 = require("./encoding");
var channel_1 = require("./channel");
var vlEncoding = require("./encoding");
var log = require("./log");
var mark_1 = require("./mark");
var stack_1 = require("./stack");
var util_1 = require("./util");
/* Custom type guards */
function isFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
exports.isFacetSpec = isFacetSpec;
function isUnitSpec(spec) {
    return !!spec['mark'];
}
exports.isUnitSpec = isUnitSpec;
function isLayerSpec(spec) {
    return spec['layer'] !== undefined;
}
exports.isLayerSpec = isLayerSpec;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
function normalize(spec) {
    if (isFacetSpec(spec)) {
        return normalizeFacet(spec, spec.config);
    }
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec, spec.config);
    }
    if (isUnitSpec(spec)) {
        var hasRow = encoding_1.channelHasField(spec.encoding, channel_1.ROW);
        var hasColumn = encoding_1.channelHasField(spec.encoding, channel_1.COLUMN);
        if (hasRow || hasColumn) {
            return normalizeFacetedUnit(spec, spec.config);
        }
        return normalizeNonFacetUnit(spec, spec.config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.normalize = normalize;
function normalizeNonFacet(spec, config) {
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec, config);
    }
    return normalizeNonFacetUnit(spec, config);
}
function normalizeFacet(spec, config) {
    var subspec = spec.spec, rest = tslib_1.__rest(spec, ["spec"]);
    return tslib_1.__assign({}, rest, { spec: normalizeNonFacet(subspec, config) });
}
function normalizeLayer(spec, config) {
    var layer = spec.layer, rest = tslib_1.__rest(spec, ["layer"]);
    return tslib_1.__assign({}, rest, { layer: layer.map(function (subspec) { return normalizeNonFacet(subspec, config); }) });
}
function normalizeFacetedUnit(spec, config) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    var _a = spec.encoding, row = _a.row, column = _a.column, encoding = tslib_1.__rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    var mark = spec.mark, _ = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    return tslib_1.__assign({}, outerSpec, { facet: tslib_1.__assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit({
            mark: mark,
            encoding: encoding
        }, config) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return mark_1.isPrimitiveMark(spec.mark);
}
function normalizeNonFacetUnit(spec, config) {
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(spec.encoding)) {
            return normalizeRangedUnit(spec);
        }
        var overlayConfig = config && config.overlay;
        var overlayWithLine = overlayConfig && spec.mark === mark_1.AREA &&
            util_1.contains(['linepoint', 'line'], overlayConfig.area);
        var overlayWithPoint = overlayConfig && ((overlayConfig.line && spec.mark === mark_1.LINE) ||
            (overlayConfig.area === 'linepoint' && spec.mark === mark_1.AREA));
        // TODO: consider moving this to become another case of compositeMark
        if (overlayWithPoint || overlayWithLine) {
            return normalizeOverlay(spec, overlayWithPoint, overlayWithLine, config);
        }
        return spec; // Nothing to normalize
    }
    else {
        return compositeMark.normalize(spec);
    }
}
function normalizeRangedUnit(spec) {
    var hasX = encoding_1.channelHasField(spec.encoding, channel_1.X);
    var hasY = encoding_1.channelHasField(spec.encoding, channel_1.Y);
    var hasX2 = encoding_1.channelHasField(spec.encoding, channel_1.X2);
    var hasY2 = encoding_1.channelHasField(spec.encoding, channel_1.Y2);
    if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
        var normalizedSpec = util_1.duplicate(spec);
        if (hasX2 && !hasX) {
            normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
            delete normalizedSpec.encoding.x2;
        }
        if (hasY2 && !hasY) {
            normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
            delete normalizedSpec.encoding.y2;
        }
        return normalizedSpec;
    }
    return spec;
}
// FIXME(#1804): re-design this
function normalizeOverlay(spec, overlayWithPoint, overlayWithLine, config) {
    var mark = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var layer = [{ mark: mark, encoding: encoding }];
    // Need to copy stack config to overlayed layer
    var stackProps = stack_1.stack(mark, encoding, config ? config.stack : undefined);
    var overlayEncoding = encoding;
    if (stackProps) {
        var stackFieldChannel = stackProps.fieldChannel, offset = stackProps.offset;
        overlayEncoding = tslib_1.__assign({}, encoding, (_a = {}, _a[stackFieldChannel] = tslib_1.__assign({}, encoding[stackFieldChannel], (offset ? { stack: offset } : {})), _a));
    }
    if (overlayWithLine) {
        layer.push({
            mark: {
                type: 'line',
                role: 'lineOverlay'
            },
            encoding: overlayEncoding
        });
    }
    if (overlayWithPoint) {
        layer.push({
            mark: {
                type: 'point',
                filled: true,
                role: 'pointOverlay'
            },
            encoding: overlayEncoding
        });
    }
    return tslib_1.__assign({}, outerSpec, { layer: layer });
    var _a;
}
// TODO: add vl.spec.validate & move stuff from vl.validate to here
/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict, fieldDefs) {
    fieldDefs.forEach(function (fieldDef) {
        // Consider only pure fieldDef properties (ignoring scale, axis, legend)
        var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce(function (f, key) {
            if (fieldDef[key] !== undefined) {
                f[key] = fieldDef[key];
            }
            return f;
        }, {});
        var key = util_1.hash(pureFieldDef);
        dict[key] = dict[key] || fieldDef;
    });
    return dict;
}
/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex(spec, dict) {
    if (dict === void 0) { dict = {}; }
    // TODO: Support repeat and concat
    if (isLayerSpec(spec)) {
        spec.layer.forEach(function (layer) {
            if (isUnitSpec(layer)) {
                accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
            }
            else {
                fieldDefIndex(layer, dict);
            }
        });
    }
    else if (isFacetSpec(spec)) {
        accumulate(dict, vlEncoding.fieldDefs(spec.facet));
        fieldDefIndex(spec.spec, dict);
    }
    else {
        accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
    }
    return dict;
}
/* Returns all non-duplicate fieldDefs in a spec in a flat array */
function fieldDefs(spec) {
    return util_1.vals(fieldDefIndex(spec));
}
exports.fieldDefs = fieldDefs;
function isStacked(spec, config) {
    config = config || spec.config;
    if (mark_1.isPrimitiveMark(spec.mark)) {
        return stack_1.stack(spec.mark, spec.encoding, config ? config.stack : undefined) !== null;
    }
    return false;
}
exports.isStacked = isStacked;

},{"./channel":44,"./compositemark":104,"./encoding":108,"./log":113,"./mark":114,"./stack":119,"./util":124,"tslib":38}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var aggregate_1 = require("./aggregate");
var channel_1 = require("./channel");
var encoding_1 = require("./encoding");
var fielddef_1 = require("./fielddef");
var mark_1 = require("./mark");
var scale_1 = require("./scale");
var util_1 = require("./util");
exports.STACKABLE_MARKS = [mark_1.BAR, mark_1.AREA, mark_1.RULE, mark_1.POINT, mark_1.CIRCLE, mark_1.SQUARE, mark_1.LINE, mark_1.TEXT, mark_1.TICK];
exports.STACK_BY_DEFAULT_MARKS = [mark_1.BAR, mark_1.AREA];
// Note: CompassQL uses this method and only pass in required properties of each argument object.
// If required properties change, make sure to update CompassQL.
function stack(m, encoding, stackConfig) {
    var mark = mark_1.isMarkDef(m) ? m.type : m;
    // Should have stackable mark
    if (!util_1.contains(exports.STACKABLE_MARKS, mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!encoding_1.isAggregate(encoding)) {
        return null;
    }
    // Should have grouping level of detail
    var stackBy = channel_1.STACK_GROUP_CHANNELS.reduce(function (sc, channel) {
        if (encoding_1.channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                if (fielddef_1.isFieldDef(fieldDef) && !fieldDef.aggregate) {
                    sc.push({
                        channel: channel,
                        fieldDef: fieldDef
                    });
                }
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var hasXField = fielddef_1.isFieldDef(encoding.x);
    var hasYField = fielddef_1.isFieldDef(encoding.y);
    var xIsAggregate = fielddef_1.isFieldDef(encoding.x) && !!encoding.x.aggregate;
    var yIsAggregate = fielddef_1.isFieldDef(encoding.y) && !!encoding.y.aggregate;
    if (xIsAggregate !== yIsAggregate) {
        var fieldChannel = xIsAggregate ? channel_1.X : channel_1.Y;
        var fieldDef = encoding[fieldChannel];
        var fieldChannelAggregate = fieldDef.aggregate;
        var fieldChannelScale = fieldDef.scale;
        var stackOffset = null;
        if (fieldDef.stack !== undefined) {
            stackOffset = fieldDef.stack;
        }
        else if (util_1.contains(exports.STACK_BY_DEFAULT_MARKS, mark)) {
            // Bar and Area with sum ops are automatically stacked by default
            stackOffset = stackConfig === undefined ? 'zero' : stackConfig;
        }
        else {
            stackOffset = stackConfig;
        }
        if (!stackOffset || stackOffset === 'none') {
            return null;
        }
        // If stacked, check if it qualifies for stacking (and log warning if not qualified.)
        if (fieldChannelScale && fieldChannelScale.type && fieldChannelScale.type !== scale_1.ScaleType.LINEAR) {
            log.warn(log.message.cannotStackNonLinearScale(fieldChannelScale.type));
            return null;
        }
        if (encoding_1.channelHasField(encoding, fieldChannel === channel_1.X ? channel_1.X2 : channel_1.Y2)) {
            log.warn(log.message.cannotStackRangedMark(fieldChannel));
            return null;
        }
        if (!util_1.contains(aggregate_1.SUM_OPS, fieldChannelAggregate)) {
            log.warn(log.message.cannotStackNonSummativeAggregate(fieldChannelAggregate));
            return null;
        }
        return {
            groupbyChannel: xIsAggregate ? (hasYField ? channel_1.Y : null) : (hasXField ? channel_1.X : null),
            fieldChannel: fieldChannel,
            stackBy: stackBy,
            offset: stackOffset
        };
    }
    return null;
}
exports.stack = stack;

},{"./aggregate":41,"./channel":44,"./encoding":108,"./fielddef":110,"./log":113,"./mark":114,"./scale":115,"./util":124}],120:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime_1 = require("./datetime");
var log = require("./log");
var util_1 = require("./util");
var TimeUnit;
(function (TimeUnit) {
    TimeUnit.YEAR = 'year';
    TimeUnit.MONTH = 'month';
    TimeUnit.DAY = 'day';
    TimeUnit.DATE = 'date';
    TimeUnit.HOURS = 'hours';
    TimeUnit.MINUTES = 'minutes';
    TimeUnit.SECONDS = 'seconds';
    TimeUnit.MILLISECONDS = 'milliseconds';
    TimeUnit.YEARMONTH = 'yearmonth';
    TimeUnit.YEARMONTHDATE = 'yearmonthdate';
    TimeUnit.YEARMONTHDATEHOURS = 'yearmonthdatehours';
    TimeUnit.YEARMONTHDATEHOURSMINUTES = 'yearmonthdatehoursminutes';
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS = 'yearmonthdatehoursminutesseconds';
    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
    TimeUnit.MONTHDATE = 'monthdate';
    TimeUnit.HOURSMINUTES = 'hoursminutes';
    TimeUnit.HOURSMINUTESSECONDS = 'hoursminutesseconds';
    TimeUnit.MINUTESSECONDS = 'minutesseconds';
    TimeUnit.SECONDSMILLISECONDS = 'secondsmilliseconds';
    TimeUnit.QUARTER = 'quarter';
    TimeUnit.YEARQUARTER = 'yearquarter';
    TimeUnit.QUARTERMONTH = 'quartermonth';
    TimeUnit.YEARQUARTERMONTH = 'yearquartermonth';
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
/** Time Unit that only corresponds to only one part of Date objects. */
exports.SINGLE_TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
];
var SINGLE_TIMEUNIT_INDEX = exports.SINGLE_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isSingleTimeUnit(timeUnit) {
    return !!SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isSingleTimeUnit = isSingleTimeUnit;
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
function convert(unit, date) {
    var result = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
    exports.SINGLE_TIMEUNITS.forEach(function (singleUnit) {
        if (containsTimeUnit(unit, singleUnit)) {
            switch (singleUnit) {
                case TimeUnit.DAY:
                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
                case TimeUnit.YEAR:
                    result.setFullYear(date.getFullYear());
                    break;
                case TimeUnit.QUARTER:
                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                    result.setMonth((Math.floor(date.getMonth() / 3)) * 3);
                    break;
                case TimeUnit.MONTH:
                    result.setMonth(date.getMonth());
                    break;
                case TimeUnit.DATE:
                    result.setDate(date.getDate());
                    break;
                case TimeUnit.HOURS:
                    result.setHours(date.getHours());
                    break;
                case TimeUnit.MINUTES:
                    result.setMinutes(date.getMinutes());
                    break;
                case TimeUnit.SECONDS:
                    result.setSeconds(date.getSeconds());
                    break;
                case TimeUnit.MILLISECONDS:
                    result.setMilliseconds(date.getMilliseconds());
                    break;
            }
        }
    });
    return result;
}
exports.convert = convert;
exports.MULTI_TIMEUNITS = [
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];
var MULTI_TIMEUNIT_INDEX = exports.MULTI_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isMultiTimeUnit(timeUnit) {
    return !!MULTI_TIMEUNIT_INDEX[timeUnit];
}
exports.isMultiTimeUnit = isMultiTimeUnit;
exports.TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS
];
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
function containsTimeUnit(fullTimeUnit, timeUnit) {
    var index = fullTimeUnit.indexOf(timeUnit);
    return index > -1 &&
        (timeUnit !== TimeUnit.SECONDS ||
            index === 0 ||
            fullTimeUnit.charAt(index - 1) !== 'i' // exclude milliseconds
        );
}
exports.containsTimeUnit = containsTimeUnit;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
function fieldExpr(fullTimeUnit, field) {
    var fieldRef = "datum[\"" + field + "\"]";
    function func(timeUnit) {
        if (timeUnit === TimeUnit.QUARTER) {
            // quarter starting at 0 (0,3,6,9).
            return "(quarter(" + fieldRef + ")-1)";
        }
        else {
            return timeUnit + "(" + fieldRef + ")";
        }
    }
    var d = exports.SINGLE_TIMEUNITS.reduce(function (_d, tu) {
        if (containsTimeUnit(fullTimeUnit, tu)) {
            _d[tu] = func(tu);
        }
        return _d;
    }, {});
    if (d.day && util_1.keys(d).length > 1) {
        log.warn(log.message.dayReplacedWithDate(fullTimeUnit));
        delete d.day;
        d.date = func(TimeUnit.DATE);
    }
    return datetime_1.dateTimeExpr(d);
}
exports.fieldExpr = fieldExpr;
/** returns the smallest nice unit for scale.nice */
function smallestUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        return 'second';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        return 'minute';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        return 'hour';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
        containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        return 'day';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        return 'month';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
        return 'year';
    }
    return undefined;
}
exports.smallestUnit = smallestUnit;
/** returns the signal expression used for axis labels for a time unit */
function formatExpression(timeUnit, field, shortTimeLabels) {
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    var expression = '';
    var hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);
    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
        // special expression for quarter as prefix
        expression = "'Q' + quarter(" + field + ")";
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        // By default use short month name
        dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
        dateComponents.push(shortTimeLabels ? '%a' : '%A');
    }
    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
    }
    if (hasYear) {
        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
    }
    var timeComponents = [];
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        timeComponents.push('%H');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        timeComponents.push('%M');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        timeComponents.push('%S');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
        timeComponents.push('%L');
    }
    var dateTimeComponents = [];
    if (dateComponents.length > 0) {
        dateTimeComponents.push(dateComponents.join(' '));
    }
    if (timeComponents.length > 0) {
        dateTimeComponents.push(timeComponents.join(':'));
    }
    if (dateTimeComponents.length > 0) {
        if (expression) {
            // Add space between quarter and main time format
            expression += " + ' ' + ";
        }
        expression += "timeFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
    }
    // If expression is still an empty string, return undefined instead.
    return expression || undefined;
}
exports.formatExpression = formatExpression;
function isDiscreteByDefault(timeUnit) {
    switch (timeUnit) {
        // These time unit use discrete scale by default
        case 'hours':
        case 'day':
        case 'month':
        case 'quarter':
            return true;
    }
    return false;
}
exports.isDiscreteByDefault = isDiscreteByDefault;

},{"./datetime":107,"./log":113,"./util":124}],121:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TOP_LEVEL_PROPERTIES = [
    'background', 'padding'
];
function extractTopLevelProperties(t) {
    return TOP_LEVEL_PROPERTIES.reduce(function (o, p) {
        if (t && t[p] !== undefined) {
            o[p] = t[p];
        }
        return o;
    }, {});
}
exports.extractTopLevelProperties = extractTopLevelProperties;

},{}],122:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFilter(t) {
    return t['filter'] !== undefined;
}
exports.isFilter = isFilter;
function isCalculate(t) {
    return t['calculate'] !== undefined;
}
exports.isCalculate = isCalculate;

},{}],123:[function(require,module,exports){
/** Constants and utilities for data type */
/** Data type based on level of measurement */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type.QUANTITATIVE = 'quantitative';
    Type.ORDINAL = 'ordinal';
    Type.TEMPORAL = 'temporal';
    Type.NOMINAL = 'nominal';
})(Type = exports.Type || (exports.Type = {}));
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
function getFullName(type) {
    if (type) {
        type = type.toLowerCase();
        switch (type) {
            case 'q':
            case exports.QUANTITATIVE:
                return 'quantitative';
            case 't':
            case exports.TEMPORAL:
                return 'temporal';
            case 'o':
            case exports.ORDINAL:
                return 'ordinal';
            case 'n':
            case exports.NOMINAL:
                return 'nominal';
        }
    }
    // If we get invalid input, return undefined type.
    return undefined;
}
exports.getFullName = getFullName;

},{}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
exports.extend = vega_util_1.extend;
exports.isArray = vega_util_1.isArray;
exports.isObject = vega_util_1.isObject;
exports.isNumber = vega_util_1.isNumber;
exports.isString = vega_util_1.isString;
exports.truncate = vega_util_1.truncate;
exports.toSet = vega_util_1.toSet;
exports.stringValue = vega_util_1.stringValue;
var vega_util_2 = require("vega-util");
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
function pick(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
exports.omit = omit;
function hash(a) {
    if (vega_util_2.isString(a) || vega_util_2.isNumber(a) || isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) { return !contains(excludedItems, item); });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
/**
 * Returns true if any item returns true.
 */
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * Returns true if all items return true.
 */
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
/**
 * recursively merges src into dest
 */
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
        var s = src_1[_a];
        dest = deepMerge_(dest, s);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
// recursively merges src into dest
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || vega_util_2.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {};
    var v;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
exports.unique = unique;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
exports.differ = differ;
function hasIntersection(a, b) {
    for (var key in a) {
        if (key in b) {
            return true;
        }
    }
    return false;
}
exports.hasIntersection = hasIntersection;
function differArray(array, other) {
    if (array.length !== other.length) {
        return true;
    }
    array.sort();
    other.sort();
    for (var i = 0; i < array.length; i++) {
        if (other[i] !== array[i]) {
            return true;
        }
    }
    return false;
}
exports.differArray = differArray;
exports.keys = Object.keys;
function vals(x) {
    var _vals = [];
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
exports.vals = vals;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;
/**
 * Convert a string into a valid variable name
 */
function varName(s) {
    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
    var alphanumericS = s.replace(/\W/g, '_');
    // Add _ if the string has leading numbers.
    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}
exports.varName = varName;

},{"json-stable-stringify":33,"vega-util":128}],125:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mark_1 = require("./mark");
// TODO: move to vl.spec.validator?
var mark_2 = require("./mark");
var util_1 = require("./util");
/**
 * Required Encoding Channels for each mark type
 * @type {Object}
 */
exports.DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    area: ['x', 'y']
};
/**
 * Supported Encoding Channel for each mark type
 */
exports.DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: util_1.toSet(['row', 'column', 'x', 'y', 'size', 'color', 'detail']),
    line: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'detail']),
    area: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'detail']),
    tick: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'detail']),
    circle: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    square: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    point: util_1.toSet(['row', 'column', 'x', 'y', 'color', 'size', 'detail', 'shape']),
    text: util_1.toSet(['row', 'column', 'size', 'color', 'text']) // TODO(#724) revise
};
// TODO: consider if we should add validate method and
// requires ZSchema in the main vega-lite repo
/**
 * Further check if encoding mapping of a spec is invalid and
 * return error if it is invalid.
 *
 * This checks if
 * (1) all the required encoding channels for the mark type are specified
 * (2) all the specified encoding channels are supported by the mark type
 * @param  {[type]} spec [description]
 * @param  {RequiredChannelMap  = DefaultRequiredChannelMap}  requiredChannelMap
 * @param  {SupportedChannelMap = DefaultSupportedChannelMap} supportedChannelMap
 * @return {String} Return one reason why the encoding is invalid,
 *                  or null if the encoding is valid.
 */
function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = exports.DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = exports.DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var encoding = spec.encoding;
    var requiredChannels = requiredChannelMap[mark];
    var supportedChannels = supportedChannelMap[mark];
    for (var i in requiredChannels) {
        if (!(requiredChannels[i] in encoding)) {
            return 'Missing encoding channel \"' + requiredChannels[i] +
                '\" for mark \"' + mark + '\"';
        }
    }
    for (var channel in encoding) {
        if (!supportedChannels[channel]) {
            return 'Encoding channel \"' + channel +
                '\" is not supported by mark type \"' + mark + '\"';
        }
    }
    if (mark === mark_2.BAR && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
exports.getEncodingMappingError = getEncodingMappingError;

},{"./mark":114,"./util":124}],126:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function isDataRefUnionedDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'fields' in domain && !('data' in domain);
    }
    return false;
}
exports.isDataRefUnionedDomain = isDataRefUnionedDomain;
function isFieldRefUnionDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'fields' in domain && 'data' in domain;
    }
    return false;
}
exports.isFieldRefUnionDomain = isFieldRefUnionDomain;
function isDataRefDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'field' in domain && 'data' in domain;
    }
    return false;
}
exports.isDataRefDomain = isDataRefDomain;
function isSignalRefDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'signal' in domain;
    }
    return false;
}
exports.isSignalRefDomain = isSignalRefDomain;

},{"./util":124}],127:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axis = require("./axis");
exports.aggregate = require("./aggregate");
exports.bin = require("./bin");
exports.channel = require("./channel");
exports.compositeMark = require("./compositemark");
var compile_1 = require("./compile/compile");
exports.compile = compile_1.compile;
exports.config = require("./config");
exports.data = require("./data");
exports.datetime = require("./datetime");
exports.encoding = require("./encoding");
exports.facet = require("./facet");
exports.fieldDef = require("./fielddef");
exports.legend = require("./legend");
exports.mark = require("./mark");
exports.scale = require("./scale");
exports.sort = require("./sort");
exports.spec = require("./spec");
exports.stack = require("./stack");
exports.timeUnit = require("./timeunit");
exports.transform = require("./transform");
exports.type = require("./type");
exports.util = require("./util");
exports.validate = require("./validate");
exports.version = require('../package.json').version;

},{"../package.json":40,"./aggregate":41,"./axis":42,"./bin":43,"./channel":44,"./compile/compile":49,"./compositemark":104,"./config":105,"./data":106,"./datetime":107,"./encoding":108,"./facet":109,"./fielddef":110,"./legend":112,"./mark":114,"./scale":115,"./sort":117,"./spec":118,"./stack":119,"./timeunit":120,"./transform":122,"./type":123,"./util":124,"./validate":125}],128:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vega = global.vega || {})));
}(this, (function (exports) { 'use strict';

var accessor = function(fn, fields, name) {
  return (
    fn.fields = fields || [],
    fn.fname = name,
    fn
  );
}

function accessorName(fn) {
  return fn == null ? null : fn.fname;
}

function accessorFields(fn) {
  return fn == null ? null : fn.fields;
}

var error = function(message) {
  throw Error(message);
}

var splitAccessPath = function(p) {
  var path = [],
      q = null,
      b = 0,
      n = p.length,
      s = '',
      i, j, c;

  p = p + '';

  function push() {
    path.push(s + p.substring(i, j));
    s = '';
    i = j + 1;
  }

  for (i=j=0; j<n; ++j) {
    c = p[j];
    if (c === '\\') s += p.substring(i, j), i = ++j;
    else if (c === q) push(), q = null, b = -1;
    else if (q) continue;
    else if (i === b && c === '"') i = j + 1, q = c;
    else if (i === b && c === "'") i = j + 1, q = c;
    else if (c === '.' && !b) (j > i) ? push() : (i = j + 1);
    else if (c === '[') {
      if (j > i) push();
      b = i = j + 1;
    }
    else if (c === ']') {
      if (!b) error('Access path missing open bracket: ' + p);
      if (b > 0) push();
      b = 0;
      i = j + 1;
    }
  }

  if (b) error('Access path missing closing bracket: ' + p);
  if (q) error('Access path missing closing quote: ' + p);
  if (j > i) ++j, push();
  return path;
}

var isArray = Array.isArray;

var isObject = function(_) {
  return _ === Object(_);
}

var isString = function(_) {
  return typeof _ === 'string';
}

function $(x) {
  return isArray(x) ? '[' + x.map($) + ']'
    : isObject(x) || isString(x) ?
      // Output valid JSON and JS source strings.
      // See http://timelessrepo.com/json-isnt-a-javascript-subset
      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
    : x;
}

var field = function(field, name) {
  var path = splitAccessPath(field),
      code = 'return _[' + path.map($).join('][') + '];';

  return accessor(
    Function('_', code),
    [(field = path.length===1 ? path[0] : field)],
    name || field
  );
}

var empty = [];

var id = field('id');

var identity = accessor(function(_) { return _; }, empty, 'identity');

var zero = accessor(function() { return 0; }, empty, 'zero');

var one = accessor(function() { return 1; }, empty, 'one');

var truthy = accessor(function() { return true; }, empty, 'true');

var falsy = accessor(function() { return false; }, empty, 'false');

function log(method, level, input) {
  var args = [level].concat([].slice.call(input));
  console[method].apply(console, args); // eslint-disable-line no-console
}

var None  = 0;
var Warn  = 1;
var Info  = 2;
var Debug = 3;

var logger = function(_) {
  var level = _ || None;
  return {
    level: function(_) {
      return arguments.length ? (level = +_, this) : level;
    },
    warn: function() {
      if (level >= Warn) log('warn', 'WARN', arguments);
      return this;
    },
    info: function() {
      if (level >= Info) log('log', 'INFO', arguments);
      return this;
    },
    debug: function() {
      if (level >= Debug) log('log', 'DEBUG', arguments);
      return this;
    }
  }
}

var array = function(_) {
  return _ != null ? (isArray(_) ? _ : [_]) : [];
}

var compare = function(fields, orders) {
  var idx = [],
      cmp = (fields = array(fields)).map(function(f, i) {
        return f == null ? null
          : (idx.push(i), splitAccessPath(f).map($).join(']['));
      }),
      n = idx.length - 1,
      ord = array(orders),
      code = 'var u,v;return ',
      i, j, f, u, v, d, lt, gt;

  if (n < 0) return null;

  for (j=0; j<=n; ++j) {
    i = idx[j];
    f = cmp[i];
    u = '(u=a['+f+'])';
    v = '(v=b['+f+'])';
    d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';
    lt = ord[i] !== 'descending' ? (gt=1, -1) : (gt=-1, 1);
    code += '(' + u+'<'+v+'||u==null)&&v!=null?' + lt
      + ':(u>v||v==null)&&u!=null?' + gt
      + ':'+d+'!==u&&v===v?' + lt
      + ':v!==v&&u===u?' + gt
      + (i < n ? ':' : ':0');
  }

  return accessor(
    Function('a', 'b', code + ';'),
    fields.filter(function(_) { return _ != null; })
  );
}

var isFunction = function(_) {
  return typeof _ === 'function';
}

var constant = function(_) {
  return isFunction(_) ? _ : function() { return _; };
}

var extend = function(_) {
  for (var x, k, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (k in x) { _[k] = x[k]; }
  }
  return _;
}

var extentIndex = function(array, f) {
  var i = -1,
      n = array.length,
      a, b, c, u, v;

  if (f == null) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
    u = v = i;
    while (++i < n) if ((b = array[i]) != null) {
      if (a > b) a = b, u = i;
      if (c < b) c = b, v = i;
    }
  } else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
    u = v = i;
    while (++i < n) if ((b = f(array[i], i, array)) != null) {
      if (a > b) a = b, u = i;
      if (c < b) c = b, v = i;
    }
  }

  return [u, v];
}

var NULL = {};

var fastmap = function(input) {
  var obj = {},
      map,
      test;

  function has(key) {
    return obj.hasOwnProperty(key) && obj[key] !== NULL;
  }

  map = {
    size: 0,
    empty: 0,
    object: obj,
    has: has,
    get: function(key) {
      return has(key) ? obj[key] : undefined;
    },
    set: function(key, value) {
      if (!has(key)) {
        ++map.size;
        if (obj[key] === NULL) --map.empty;
      }
      obj[key] = value;
      return this;
    },
    delete: function(key) {
      if (has(key)) {
        --map.size;
        ++map.empty;
        obj[key] = NULL;
      }
      return this;
    },
    clear: function() {
      map.size = map.empty = 0;
      map.object = obj = {};
    },
    test: function(_) {
      return arguments.length ? (test = _, map) : test;
    },
    clean: function() {
      var next = {},
          size = 0,
          key, value;
      for (key in obj) {
        value = obj[key];
        if (value !== NULL && (!test || !test(value))) {
          next[key] = value;
          ++size;
        }
      }
      map.size = size;
      map.empty = 0;
      map.object = (obj = next);
    }
  };

  if (input) Object.keys(input).forEach(function(key) {
    map.set(key, input[key]);
  });

  return map;
}

var inherits = function(child, parent) {
  var proto = (child.prototype = Object.create(parent.prototype));
  proto.constructor = child;
  return proto;
}

var isNumber = function(_) {
  return typeof _ === 'number';
}

var key = function(fields) {
  fields = fields ? array(fields) : fields;
  var fn = !(fields && fields.length)
    ? function() { return ''; }
    : Function('_', 'return \'\'+' +
        fields.map(function(f) {
          return '_[' + splitAccessPath(f).map($).join('][') + ']';
        }).join('+\'|\'+') + ';');
  return accessor(fn, fields, 'key');
}

var merge = function(compare, array0, array1, output) {
  var n0 = array0.length,
      n1 = array1.length;

  if (!n1) return array0;
  if (!n0) return array1;

  var merged = output || new array0.constructor(n0 + n1),
      i0 = 0, i1 = 0, i = 0;

  for (; i0<n0 && i1<n1; ++i) {
    merged[i] = compare(array0[i0], array1[i1]) > 0
       ? array1[i1++]
       : array0[i0++];
  }

  for (; i0<n0; ++i0, ++i) {
    merged[i] = array0[i0];
  }

  for (; i1<n1; ++i1, ++i) {
    merged[i] = array1[i1];
  }

  return merged;
}

var repeat = function(str, reps) {
  var s = '';
  while (--reps >= 0) s += str;
  return s;
}

var pad = function(str, length, padchar, align) {
  var c = padchar || ' ',
      s = str + '',
      n = length - s.length;

  return n <= 0 ? s
    : align === 'left' ? repeat(c, n) + s
    : align === 'center' ? repeat(c, ~~(n/2)) + s + repeat(c, Math.ceil(n/2))
    : s + repeat(c, n);
}

var peek = function(array) {
  return array[array.length - 1];
}

var toSet = function(_) {
  for (var s={}, i=0, n=_.length; i<n; ++i) s[_[i]] = 1;
  return s;
}

var truncate = function(str, length, align, ellipsis) {
  var e = ellipsis != null ? ellipsis : '\u2026',
      s = str + '',
      n = s.length,
      l = Math.max(0, length - e.length);

  return n <= length ? s
    : align === 'left' ? e + s.slice(n - l)
    : align === 'center' ? s.slice(0, Math.ceil(l/2)) + e + s.slice(n - ~~(l/2))
    : s.slice(0, l) + e;
}

var visitArray = function(array, filter, visitor) {
  if (array) {
    var i = 0, n = array.length, t;
    if (filter) {
      for (; i<n; ++i) {
        if (t = filter(array[i])) visitor(t, i, array);
      }
    } else {
      array.forEach(visitor);
    }
  }
}

exports.accessor = accessor;
exports.accessorName = accessorName;
exports.accessorFields = accessorFields;
exports.id = id;
exports.identity = identity;
exports.zero = zero;
exports.one = one;
exports.truthy = truthy;
exports.falsy = falsy;
exports.logger = logger;
exports.None = None;
exports.Warn = Warn;
exports.Info = Info;
exports.Debug = Debug;
exports.array = array;
exports.compare = compare;
exports.constant = constant;
exports.error = error;
exports.extend = extend;
exports.extentIndex = extentIndex;
exports.fastmap = fastmap;
exports.field = field;
exports.inherits = inherits;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.key = key;
exports.merge = merge;
exports.pad = pad;
exports.peek = peek;
exports.repeat = repeat;
exports.splitAccessPath = splitAccessPath;
exports.stringValue = $;
exports.toSet = toSet;
exports.truncate = truncate;
exports.visitArray = visitArray;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],129:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_collection_1 = require("d3-collection");
var d3_selection_1 = require("d3-selection");
var dl = require("datalib");
var type_1 = require("vega-lite/build/src/type");
var vl = require("vega-lite/build/src/vl");
// by default, delay showing tooltip for 100 ms
var DELAY = 100;
var tooltipPromise = undefined;
var tooltipActive = false;
/**
* Export API for Vega visualizations: vg.tooltip(vgView, options)
* options can specify whether to show all fields or to show only custom fields
* It can also provide custom title and format for fields
*/
function vega(vgView, options) {
    // TODO: change item type to vega scenegraph
    if (options === void 0) { options = {}; }
    // initialize tooltip with item data and options on mouse over
    vgView.addEventListener("mouseover.tooltipInit", function (event, item) {
        if (shouldShowTooltip(item)) {
            // clear existing promise because mouse can only point at one thing at a time
            cancelPromise();
            tooltipPromise = window.setTimeout(function () {
                init(event, item, options);
            }, options.delay || DELAY);
        }
    });
    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.addEventListener("mousemove.tooltipUpdate", function (event, item) {
        if (shouldShowTooltip(item) && tooltipActive) {
            update(event, item, options);
        }
    });
    // clear tooltip on mouse out
    vgView.addEventListener("mouseout.tooltipRemove", function (event, item) {
        if (shouldShowTooltip(item)) {
            cancelPromise();
            if (tooltipActive) {
                clear(event, item, options);
            }
        }
    });
    return {
        destroy: function () {
            // remove event listeners
            vgView.removeEventListener("mouseover.tooltipInit");
            vgView.removeEventListener("mousemove.tooltipUpdate");
            vgView.removeEventListener("mouseout.tooltipRemove");
            cancelPromise(); // clear tooltip promise
        }
    };
}
exports.vega = vega;
;
/**
* Export API for Vega-Lite visualizations: vl.tooltip(vgView, vlSpec, options)
* options can specify whether to show all fields or to show only custom fields
* It can also provide custom title and format for fields
* options can be supplemented by vlSpec
*/
function vegaLite(vgView, vlSpec, options) {
    if (options === void 0) { options = {}; }
    options = supplementOptions(options, vlSpec);
    // TODO: update this to use new vega-view api (addEventListener)
    // initialize tooltip with item data and options on mouse over
    vgView.addEventListener("mouseover", function (event, item) {
        if (shouldShowTooltip(item)) {
            // clear existing promise because mouse can only point at one thing at a time
            cancelPromise();
            // make a new promise with time delay for tooltip
            tooltipPromise = window.setTimeout(function () {
                init(event, item, options);
            }, options.delay || DELAY);
        }
    });
    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.addEventListener("mousemove", function (event, item) {
        if (shouldShowTooltip(item) && tooltipActive) {
            update(event, item, options);
        }
    });
    // clear tooltip on mouse out
    vgView.addEventListener("mouseout", function (event, item) {
        if (shouldShowTooltip(item)) {
            cancelPromise();
            if (tooltipActive) {
                clear(event, item, options);
            }
        }
    });
    return {
        destroy: function () {
            // remove event listeners
            vgView.removeEventListener("mouseover.tooltipInit");
            vgView.removeEventListener("mousemove.tooltipUpdate");
            vgView.removeEventListener("mouseout.tooltipRemove");
            cancelPromise(); // clear tooltip promise
        }
    };
}
exports.vegaLite = vegaLite;
;
/* Cancel tooltip promise */
function cancelPromise() {
    /* We don't check if tooltipPromise is valid because passing
     an invalid ID to clearTimeout does not have any effect
     (and doesn't throw an exception). */
    window.clearTimeout(tooltipPromise);
    tooltipPromise = undefined;
}
/* d3mapping from fieldDef.type to formatType */
var formatTypeMap = {
    "quantitative": "number",
    "temporal": "time",
    "ordinal": undefined,
    "nominal": undefined
};
/**
* (Vega-Lite only) Supplement options with vlSpec
*
* @param options - user-provided options
* @param vlSpec - vega-lite spec
* @return the vlSpec-supplemented options object
*
* if options.showAllFields is true or undefined, vlSpec will supplement
* options.fields with all fields in the spec
* if options.showAllFields is false, vlSpec will only supplement existing fields
* in options.fields
*/
function supplementOptions(options, vlSpec) {
    // fields to be supplemented by vlSpec
    var supplementedFields = [];
    // if showAllFields is true or undefined, supplement all fields in vlSpec
    if (options.showAllFields !== false) {
        vl.spec.fieldDefs(vlSpec).forEach(function (fieldDef) {
            // get a fieldOption in options that matches the fieldDef
            var fieldOption = getFieldOption(options.fields, fieldDef);
            // supplement the fieldOption with fieldDef and config
            var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);
            supplementedFields.push(supplementedFieldOption);
        });
    }
    else {
        if (options.fields) {
            options.fields.forEach(function (fieldOption) {
                // get the fieldDef in vlSpec that matches the fieldOption
                var fieldDef = getFieldDef(vl.spec.fieldDefs(vlSpec), fieldOption);
                // supplement the fieldOption with fieldDef and config
                var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);
                supplementedFields.push(supplementedFieldOption);
            });
        }
    }
    options.fields = supplementedFields;
    return options;
}
/**
* Find a fieldOption in fieldOptions that matches a fieldDef
*
* @param {Object[]} fieldOptionss - a list of field options (i.e. options.fields[])
* @param {Object} fieldDef - from vlSpec
* @return the matching fieldOption, or undefined if no match was found
*
* If the fieldDef is aggregated, find a fieldOption that matches the field name and
* the aggregation of the fieldDef.
* If the fieldDef is not aggregated, find a fieldOption that matches the field name.
*/
function getFieldOption(fieldOptions, fieldDef) {
    if (!fieldDef || !fieldOptions || fieldOptions.length <= 0)
        return undefined;
    // if aggregate, match field name and aggregate operation
    if (fieldDef.aggregate) {
        // try find the perfect match: field name equals, aggregate operation equals
        for (var i = 0; i < fieldOptions.length; i++) {
            var fieldOption = fieldOptions[i];
            if (fieldOption.field === fieldDef.field && fieldOption.aggregate === fieldDef.aggregate) {
                return fieldOption;
            }
        }
        // try find the second-best match: field name equals, field.aggregate is not specified
        for (var i = 0; i < fieldOptions.length; i++) {
            var fieldOption = fieldOptions[i];
            if (fieldOption.field === fieldDef.field && !fieldOption.aggregate) {
                return fieldOption;
            }
        }
        // return undefined if no match was found
        return undefined;
    }
    else {
        for (var i = 0; i < fieldOptions.length; i++) {
            var fieldOption = fieldOptions[i];
            if (fieldOption.field === fieldDef.field) {
                return fieldOption;
            }
        }
        // return undefined if no match was found
        return undefined;
    }
}
/**
* Find a fieldDef that matches a fieldOption
*
* @param {Object} fieldOption - a field option (a member in options.fields[])
* @return the matching fieldDef, or undefined if no match was found
*
* A matching fieldDef should have the same field name as fieldOption.
* If the matching fieldDef is aggregated, the aggregation should not contradict
* with that of the fieldOption.
*/
function getFieldDef(fieldDefs, fieldOption) {
    if (!fieldOption || !fieldOption.field || !fieldDefs) {
        return undefined;
    }
    // field name should match, aggregation should not disagree
    for (var i = 0; i < fieldDefs.length; i++) {
        var fieldDef = fieldDefs[i];
        if (fieldDef.field === fieldOption.field) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === fieldOption.aggregate || !fieldOption.aggregate) {
                    return fieldDef;
                }
            }
            else {
                return fieldDef;
            }
        }
    }
    // return undefined if no match was found
    return undefined;
}
/**
* Supplement a fieldOption (from options.fields[]) with a fieldDef, config
* (which provides timeFormat, numberFormat, countTitle)
* Either fieldOption or fieldDef can be undefined, but they cannot both be undefined.
* config (and its members timeFormat, numberFormat and countTitle) can be undefined.
* @return the supplemented fieldOption, or undefined on error
*/
function supplementFieldOption(fieldOption, fieldDef, vlSpec) {
    // many specs don't have config
    var config = vl.util.extend({}, vlSpec.config);
    // at least one of fieldOption and fieldDef should exist
    if (!fieldOption && !fieldDef) {
        console.error("[Tooltip] Cannot supplement a field when field and fieldDef are both empty.");
        return undefined;
    }
    // if either one of fieldOption and fieldDef is undefined, make it an empty object
    if (!fieldOption && fieldDef)
        fieldOption = {};
    if (fieldOption && !fieldDef)
        fieldDef = {};
    // the supplemented field option
    var supplementedFieldOption = {};
    // supplement a user-provided field name with underscore prefixes and suffixes to
    // match the field names in item.datum
    // for aggregation, this will add prefix "mean_" etc.
    // for timeUnit, this will add prefix "yearmonth_" etc.
    // for bin, this will add prefix "bin_" and suffix "_start". Later we will replace "_start" with "_range".
    supplementedFieldOption.field = fieldDef.field ?
        vl.fieldDef.field(fieldDef) : fieldOption.field;
    // If a fieldDef is a (TIMEUNIT)T, we check if the original T is present in the vlSpec.
    // If only (TIMEUNIT)T is present in vlSpec, we set `removeOriginalTemporalField` to T,
    // which will cause function removeDuplicateTimeFields() to remove T and only keep (TIMEUNIT)T
    // in item data.
    // If both (TIMEUNIT)T and T are in vlSpec, we set `removeOriginalTemporalField` to undefined,
    // which will leave both T and (TIMEUNIT)T in item data.
    // Note: user should never have to provide this boolean in options
    if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
        // in most cases, if it's a (TIMEUNIT)T, we remove original T
        var originalTemporalField = fieldDef.field;
        supplementedFieldOption.removeOriginalTemporalField = originalTemporalField;
        // handle corner case: if T is present in vlSpec, then we keep both T and (TIMEUNIT)T
        var fieldDefs = vl.spec.fieldDefs(vlSpec);
        for (var i = 0; i < fieldDefs.length; i++) {
            if (fieldDefs[i].field === originalTemporalField && !fieldDefs[i].timeUnit) {
                supplementedFieldOption.removeOriginalTemporalField = undefined;
                break;
            }
        }
    }
    // supplement title
    if (!config.countTitle)
        config.countTitle = vl.config.defaultConfig.countTitle; // use vl default countTitle
    supplementedFieldOption.title = fieldOption.title ?
        fieldOption.title : vl.fieldDef.title(fieldDef, config);
    // supplement formatType
    supplementedFieldOption.formatType = fieldOption.formatType ?
        fieldOption.formatType : formatTypeMap[fieldDef.type];
    // supplement format
    if (fieldOption.format) {
        supplementedFieldOption.format = fieldOption.format;
    }
    else {
        switch (supplementedFieldOption.formatType) {
            case "time":
                supplementedFieldOption.format = fieldDef.timeUnit ?
                    // TODO(zening): use template for all time fields, to be consistent with Vega-Lite
                    vl.timeUnit.formatExpression(fieldDef.timeUnit, "", false).split("'")[1]
                    : config.timeFormat || vl.config.defaultConfig.timeFormat;
                break;
            case "number":
                supplementedFieldOption.format = config.numberFormat;
                break;
            case "string":
            default:
        }
    }
    // supplement bin from fieldDef, user should never have to provide bin in options
    if (fieldDef.bin) {
        supplementedFieldOption.field = supplementedFieldOption.field.replace("_start", "_range"); // replace suffix
        supplementedFieldOption.bin = true;
        supplementedFieldOption.formatType = "string"; // we show bin range as string (e.g. "5-10")
    }
    return supplementedFieldOption;
}
/* Initialize tooltip with data */
function init(event, item, options) {
    // get tooltip HTML placeholder
    var tooltipPlaceholder = getTooltipPlaceholder();
    // prepare data for tooltip
    var tooltipData = getTooltipData(item, options);
    if (!tooltipData || tooltipData.length === 0)
        return;
    // bind data to tooltip HTML placeholder
    bindData(tooltipPlaceholder, tooltipData);
    updatePosition(event, options);
    updateColorTheme(options);
    d3_selection_1.select("#vis-tooltip").style("visibility", "visible");
    tooltipActive = true;
    // invoke user-provided callback
    if (options.onAppear) {
        options.onAppear(event, item);
    }
}
/* Update tooltip position on mousemove */
function update(event, item, options) {
    updatePosition(event, options);
    // invoke user-provided callback
    if (options.onMove) {
        options.onMove(event, item);
    }
}
/* Clear tooltip */
function clear(event, item, options) {
    // visibility hidden instead of display none
    // because we need computed tooltip width and height to best position it
    d3_selection_1.select("#vis-tooltip").style("visibility", "hidden");
    tooltipActive = false;
    clearData();
    clearColorTheme();
    clearPosition();
    // invoke user-provided callback
    if (options.onDisappear) {
        options.onDisappear(event, item);
    }
}
/* Decide if a scenegraph item deserves tooltip */
function shouldShowTooltip(item) {
    // no data, no show
    if (!item || !item.datum)
        return false;
    // (small multiples) avoid showing tooltip for a facet's background
    if (item.datum._facetID)
        return false;
    // avoid showing tooltip for axis title and labels
    if (!item.datum._id)
        return false;
    return true;
}
/**
* Prepare data for the tooltip
* @return An array of tooltip data [{ title: ..., value: ...}]
*/
// TODO: add marktype
function getTooltipData(item, options) {
    // this array will be bind to the tooltip element
    var tooltipData;
    var itemData = d3_collection_1.map(item.datum);
    // TODO(zening): find more keys which we should remove from data (#35)
    var removeKeys = [
        "_id", "_prev", "width", "height",
        "count_start", "count_end",
        "layout_start", "layout_mid", "layout_end", "layout_path", "layout_x", "layout_y"
    ];
    removeFields(itemData, removeKeys);
    // remove duplicate time fields (if any)
    removeDuplicateTimeFields(itemData, options.fields);
    // combine multiple rows of a binned field into a single row
    combineBinFields(itemData, options.fields);
    // TODO(zening): use Vega-Lite layering to support tooltip on line and area charts (#1)
    dropFieldsForLineArea(item.mark.marktype, itemData);
    if (options.showAllFields !== false) {
        tooltipData = prepareAllFieldsData(itemData, options);
    }
    else {
        tooltipData = prepareCustomFieldsData(itemData, options);
    }
    return tooltipData;
}
/**
* Prepare custom fields data for tooltip. This function formats
* field titles and values and returns an array of formatted fields.
*
* @param {d3.map} itemData - a map of item.datum
* @param {Object} options - user-provided options
* @return An array of formatted fields specified by options [{ title: ..., value: ...}]
*/
function prepareCustomFieldsData(itemData, options) {
    var tooltipData = [];
    options.fields.forEach(function (fieldOption) {
        // prepare field title
        var title = fieldOption.title ? fieldOption.title : fieldOption.field;
        // get (raw) field value
        var value = getValue(itemData, fieldOption.field);
        if (value === undefined)
            return;
        // format value
        var formattedValue = customFormat(value, fieldOption.formatType, fieldOption.format) || autoFormat(value);
        // add formatted data to tooltipData
        tooltipData.push({ title: title, value: formattedValue });
    });
    return tooltipData;
}
/**
* Get a field value from a data map.
* @param {d3.map} itemData - a map of item.datum
* @param {string} field - the name of the field. It can contain "." to specify
* that the field is not a direct child of item.datum
* @return the field value on success, undefined otherwise
*/
// TODO(zening): Mute "Cannot find field" warnings for composite vis (issue #39)
function getValue(itemData, field) {
    var value;
    var accessors = field.split('.');
    // get the first accessor and remove it from the array
    var firstAccessor = accessors[0];
    accessors.shift();
    if (itemData.has(firstAccessor)) {
        value = itemData.get(firstAccessor);
        // if we still have accessors, use them to get the value
        accessors.forEach(function (a) {
            if (value[a]) {
                value = value[a];
            }
        });
    }
    if (value === undefined) {
        console.warn("[Tooltip] Cannot find field " + field + " in data.");
        return undefined;
    }
    else {
        return value;
    }
}
/**
* Prepare data for all fields in itemData for tooltip. This function
* formats field titles and values and returns an array of formatted fields.
*
* @param {d3.map} itemData - a map of item.datum
* @param {Object} options - user-provided options
* @return All fields in itemData, formatted, in the form of an array: [{ title: ..., value: ...}]
*
* Please note that this function expects itemData to be simple {field:value} pairs.
* It will not try to parse value if it is an object. If value is an object, please
* use prepareCustomFieldsData() instead.
*/
function prepareAllFieldsData(itemData, options) {
    var tooltipData = [];
    // here, fieldOptions still provides format
    var fieldOptions = d3_collection_1.map(options.fields, function (d) { return d.field; });
    itemData.each(function (value, field) {
        // prepare title
        var title;
        if (fieldOptions.has(field) && fieldOptions.get(field).title) {
            title = fieldOptions.get(field).title;
        }
        else {
            title = field;
        }
        // format value
        if (fieldOptions.has(field)) {
            var formatType = fieldOptions.get(field).formatType;
            var format = fieldOptions.get(field).format;
        }
        var formattedValue = customFormat(value, formatType, format) || autoFormat(value);
        // add formatted data to tooltipData
        tooltipData.push({ title: title, value: formattedValue });
    });
    return tooltipData;
}
/**
* Remove multiple fields from a tooltip data map, using removeKeys
*
* Certain meta data fields (e.g. "_id", "_prev") should be hidden in the tooltip
* by default. This function can be used to remove these fields from tooltip data.
* @param {d3.map} dataMap - the data map that contains tooltip data.
* @param {string[]} removeKeys - the fields that should be removed from dataMap.
*/
function removeFields(dataMap, removeKeys) {
    removeKeys.forEach(function (key) {
        dataMap.remove(key);
    });
}
/**
 * When a temporal field has timeUnit, itemData will give us duplicated fields
 * (e.g., Year and YEAR(Year)). In tooltip want to display the field WITH the
 * timeUnit and remove the field that doesn't have timeUnit.
 */
function removeDuplicateTimeFields(itemData, optFields) {
    if (!optFields)
        return;
    optFields.forEach(function (optField) {
        if (optField.removeOriginalTemporalField) {
            removeFields(itemData, [optField.removeOriginalTemporalField]);
        }
    });
}
/**
* Combine multiple binned fields in itemData into one field. The value of the field
* is a string that describes the bin range.
*
* @param {d3.map} itemData - a map of item.datum
* @param {Object[]} fieldOptions - a list of field options (i.e. options.fields[])
* @return itemData with combined bin fields
*/
function combineBinFields(itemData, fieldOptions) {
    if (!fieldOptions)
        return undefined;
    fieldOptions.forEach(function (fieldOption) {
        if (fieldOption.bin === true) {
            // get binned field names
            var bin_field_range = fieldOption.field;
            var bin_field_start = bin_field_range.replace('_range', '_start');
            var bin_field_mid = bin_field_range.replace('_range', '_mid');
            var bin_field_end = bin_field_range.replace('_range', '_end');
            // use start value and end value to compute range
            // save the computed range in bin_field_start
            var startValue = itemData.get(bin_field_start);
            var endValue = itemData.get(bin_field_end);
            if ((startValue !== undefined) && (endValue !== undefined)) {
                var range = startValue + '-' + endValue;
                itemData.set(bin_field_range, range);
            }
            // remove bin_field_mid, bin_field_end, and bin_field_range from itemData
            var binRemoveKeys = [];
            binRemoveKeys.push(bin_field_start, bin_field_mid, bin_field_end);
            removeFields(itemData, binRemoveKeys);
        }
    });
    return itemData;
}
/**
* Drop fields for line and area marks.
*
* Lines and areas are defined by a series of datum. We overlay point marks
* on top of lines and areas to allow tooltip to show all data in the series.
* For the line marks and area marks underneath, we only show nominal fields
* in tooltip. This is because line / area marks only give us the last datum
* in their series. It only make sense to show the nominal fields (e.g., symbol
* = APPL, AMZN, GOOG, IBM, MSFT) because these fields don't tend to change along
* the line / area border.
*/
function dropFieldsForLineArea(marktype, itemData) {
    if (marktype === "line" || marktype === "area") {
        var quanKeys = [];
        itemData.each(function (field, value) {
            switch (dl.type(value)) {
                case "number":
                case "date":
                    quanKeys.push(field);
                    break;
                case "boolean":
                case "string":
            }
        });
        removeFields(itemData, quanKeys);
    }
}
/**
* Format value using formatType and format
* @param value - a field value to be formatted
* @param formatType - the foramtType can be: "time", "number", or "string"
* @param format - a d3 time format specifier, or a d3 number format specifier, or undefined
* @return the formatted value, or undefined if value or formatType is missing
*/
function customFormat(value, formatType, format) {
    if (value === undefined || value === null)
        return;
    if (!formatType)
        return;
    switch (formatType) {
        case "time":
            return format ? dl.format.time(format)(value) : dl.format.auto.time()(value);
        case "number":
            return format ? dl.format.number(format)(value) : dl.format.auto.number()(value);
        case "string":
        default:
            return value;
    }
}
/**
* Automatically format a time, number or string value
* @return the formatted time, number or string value
*/
function autoFormat(value) {
    switch (dl.type(value)) {
        case "date":
            return dl.format.auto.time()(value);
        case "number":
            return dl.format.auto.number()(value);
        case "boolean":
        case "string":
        default:
            return value;
    }
}
/**
* Get the tooltip HTML placeholder by id selector "#vis-tooltip"
* If none exists, create a placeholder.
* @returns the HTML placeholder for tooltip
*/
function getTooltipPlaceholder() {
    var tooltipPlaceholder;
    if (d3_selection_1.select("#vis-tooltip").empty()) {
        tooltipPlaceholder = d3_selection_1.select("body").append("div")
            .attr("id", "vis-tooltip")
            .attr("class", "vg-tooltip");
    }
    else {
        tooltipPlaceholder = d3_selection_1.select("#vis-tooltip");
    }
    return tooltipPlaceholder;
}
/**
* Bind tooltipData to the tooltip placeholder
*/
function bindData(tooltipPlaceholder, tooltipData) {
    tooltipPlaceholder.selectAll("table").remove();
    var tooltipRows = tooltipPlaceholder.append("table").selectAll(".tooltip-row")
        .data(tooltipData);
    tooltipRows.exit().remove();
    var row = tooltipRows.enter().append("tr")
        .attr("class", "tooltip-row");
    row.append("td").attr("class", "key").text(function (d) { return d.title + ":"; });
    row.append("td").attr("class", "value").text(function (d) { return d.value; });
}
/**
* Clear tooltip data
*/
function clearData() {
    d3_selection_1.select("#vis-tooltip").selectAll(".tooltip-row").data([])
        .exit().remove();
}
/**
* Update tooltip position
* Default position is 10px right of and 10px below the cursor. This can be
* overwritten by options.offset
*/
function updatePosition(event, options) {
    // determine x and y offsets, defaults are 10px
    var offsetX = 10;
    var offsetY = 10;
    if (options && options.offset && (options.offset.x !== undefined) && (options.offset.x !== null)) {
        offsetX = options.offset.x;
    }
    if (options && options.offset && (options.offset.y !== undefined) && (options.offset.y !== null)) {
        offsetY = options.offset.y;
    }
    //TODO: use the correct d3 type
    d3_selection_1.select("#vis-tooltip")
        .style("top", function () {
        // by default: put tooltip 10px below cursor
        // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
        var tooltipHeight = this.getBoundingClientRect().height;
        if (event.clientY + tooltipHeight + offsetY < window.innerHeight) {
            return "" + (event.clientY + offsetY) + "px";
        }
        else {
            return "" + (event.clientY - tooltipHeight - offsetY) + "px";
        }
    })
        .style("left", function () {
        // by default: put tooltip 10px to the right of cursor
        // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
        var tooltipWidth = this.getBoundingClientRect().width;
        if (event.clientX + tooltipWidth + offsetX < window.innerWidth) {
            return "" + (event.clientX + offsetX) + "px";
        }
        else {
            return "" + (event.clientX - tooltipWidth - offsetX) + "px";
        }
    });
}
/* Clear tooltip position */
function clearPosition() {
    d3_selection_1.select("#vis-tooltip")
        .style("top", "-9999px")
        .style("left", "-9999px");
}
/**
* Update tooltip color theme according to options.colorTheme
*
* If colorTheme === "dark", apply dark theme to tooltip.
* Otherwise apply light color theme.
*/
function updateColorTheme(options) {
    clearColorTheme();
    if (options && options.colorTheme === "dark") {
        d3_selection_1.select("#vis-tooltip").classed("dark-theme", true);
    }
    else {
        d3_selection_1.select("#vis-tooltip").classed("light-theme", true);
    }
}
/* Clear color themes */
function clearColorTheme() {
    d3_selection_1.select("#vis-tooltip").classed("dark-theme light-theme", false);
}

},{"d3-collection":2,"d3-selection":5,"datalib":28,"vega-lite/build/src/type":123,"vega-lite/build/src/vl":127}]},{},[129])(129)
});