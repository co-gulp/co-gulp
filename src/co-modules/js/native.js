/*===============================================================================
************   ui native window   ************
===============================================================================*/

var Native = function () {
    
};

Native.genericize = function (object, property, check) {
    if ((!check || !object[property]) && typeof object.prototype[property] == 'function') object[property] = function () {
        var args = Array.prototype.slice.call(arguments);
        return object.prototype[property].apply(args.shift(), args);
    };
};

Native.implement = function (objects, properties) {
    for (var i = 0, l = objects.length; i < l; i++) objects[i].implement(properties);
};

Native.typize = function (object, family) {
    if (!object.type) object.type = function (item) {
        return ($type(item) === family);
    };
};

(function () {
    var natives = {'Array':Array, 'Date':Date, 'Function':Function, 'Number':Number, 'RegExp':RegExp, 'String':String};
    for (var n in natives) new Native({name:n, initialize:natives[n], protect:true});

    var types = {'boolean':Boolean, 'native':Native, 'object':Object};
    for (var t in types) Native.typize(types[t], t);

    var generics = {
        'Array':["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
        'String':["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
    };
    for (var g in generics) {
        for (var i = generics[g].length; i--;) Native.genericize(window[g], generics[g][i], true);
    }
    ;
})();

(function(global) {
  var $L = function(){
      return this;
  }
  $L.prototype = {
    openWin: function(url, id, options, type) {
      if (co.plus) {
        id = id || url;
        type = type || 0;
        options = options || {
          type: $N.window.ANIMATION_TYPE_PUSH,
          time: 150,
          curve: $N.window.ANIMATION_CURVE_LINEAR
        };
        $N.window.openWindow(id, type, url, options);
      } else {
        global.location.href = url;
      }
      return this;
    },

    backWin: function(id, options) {
      if (co.plus) {
        options = options || {
          type: $N.window.ANIMATION_TYPE_PUSH,
          time: 150,
          curve: $N.window.ANIMATION_CURVE_LINEAR
        };
        $N.window.backToWindow(id, options);
      } else {
        if (global.history.length > 1) {
          global.history.back();
        }
      }
      return this;
    }
  }
  global.$local = new $L();
}(global));
/*===============================================================================
************   ui native window end  ************
===============================================================================*/