"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _kefir = require("kefir");

var NEVER = _kefir.Kefir.never();
var ZERO = _kefir.Kefir.constant(0);

var ADD1 = function ADD1(x) {
  return x + 1;
};
var SUBTRACT1 = function SUBTRACT1(x) {
  return x - 1;
};
var ALWAYS = function ALWAYS(x) {
  return function () {
    return x;
  };
};

var delay = function delay(n, s) {
  return s.slidingWindow(n + 1, 2).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        i = _ref2[0],
        _ = _ref2[1];

    return i;
  });
};

function galvo(_ref3, collection) {
  var _ref3$advance = _ref3.advance,
      advance = _ref3$advance === undefined ? NEVER : _ref3$advance,
      _ref3$recede = _ref3.recede,
      recede = _ref3$recede === undefined ? NEVER : _ref3$recede,
      _ref3$index = _ref3.index,
      index = _ref3$index === undefined ? ZERO : _ref3$index;

  var length = collection.length;

  var nextT = advance.map(function () {
    return ADD1;
  });
  var previousT = recede.map(function () {
    return SUBTRACT1;
  });
  var indexT = index.map(ALWAYS);
  var transformations = _kefir.Kefir.merge([nextT, previousT, indexT]);

  var currentIndex = transformations.scan(function (i, transform) {
    return (transform(i) + length) % length;
  }, 0);

  var current = currentIndex.map(function (i) {
    return collection[i];
  });

  var previousIndex = delay(1, currentIndex);
  var previous = delay(1, current);

  return {
    current: current,
    currentIndex: currentIndex,
    previous: previous,
    previousIndex: previousIndex
  };
}

exports.default = galvo;