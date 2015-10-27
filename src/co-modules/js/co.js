if (global.co) {
  return;
}

var co = global.co = {
  // The current version of co.js being used
  version: "1.0.1",
  verticalSwipe: true //是否可以纵向滑动
}

function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]"
  }
}

var isObject = isType("Object")
var isString = isType("String")
var isArray = Array.isArray || isType("Array")
var isFunction = isType("Function")
var isUndefined = isType("Undefined")
var readyRE = /complete|loaded|interactive/;

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
var SLASH_RE = /\\\\/g

function parseDependencies(code) {
  var ret = []

  code.replace(SLASH_RE, "")
    .replace(REQUIRE_RE, function(m, m1, m2) {
      if (m2) {
        ret.push(m2)
      }
    })

  return ret
}
if (($.os.android || $.os.ios)) {
  if (($.os.ios) && (parseFloat($.os.version) >= 7)) {
    $(document.body).addClass('ui-ios7');
  }
}

var domReady = function(factory) {
  if (isFunction(factory)) {
    var deps = parseDependencies(factory.toString())
    loader.use(deps, function() {
      if (($.os.android || $.os.ios) && global.rd) {
        setTimeout(function() {
          if (domReady.isReady) {
            factory.call(null, loader.require);
          } else {
            setTimeout(arguments.callee, 1);
          }
        }, 1);
      } else {
        factory.call(null, loader.require);
      }

      $(document).find('.ui-action-back').button(function(evt) {
        this.back();
      })
    })
  }
};
global.domReady = domReady;
global.$N = false;
co.plus = !!$N;
global.onLoad = function() {
  domReady.isReady = true;
  global.$N = global.rd
  co.plus = !!$N;
};

$.fn.ready = function(callback) {
  if (readyRE.test(document.readyState) && document.body) domReady(callback);
  else document.addEventListener('DOMContentLoaded', function() {
    domReady(callback)
  }, false)
  return this
};