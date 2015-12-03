!function(e, t) {
    function r(e) {
        return function(t) {
            return {}.toString.call(t) == "[object " + e + "]"
        }
    }
    function i() {
        return $++
    }
    function n(e) {
        return e.match(O)[0]
    }
    function s(e) {
        for (e = e.replace(j, "/"); e.match(C); )
            e = e.replace(C, "/");
        return e = e.replace(L, "$1/")
    }
    function o(e) {
        var t = e.length - 1
          , r = e.charAt(t);
        return "#" === r ? e.substring(0, t) : ".js" === e.substring(t - 2) || e.indexOf("?") > 0 || ".css" === e.substring(t - 3) || "/" === r ? e : e + ".js"
    }
    function a(e) {
        var t = _.alias;
        return t && x(t[e]) ? t[e] : e
    }
    function u(e) {
        var t, r = _.paths;
        return r && (t = e.match(N)) && x(r[t[1]]) && (e = r[t[1]] + t[2]),
        e
    }
    function c(e) {
        var t = _.vars;
        return t && e.indexOf("{") > -1 && (e = e.replace(U, function(e, r) {
            return x(t[r]) ? t[r] : e
        }
        )),
        e
    }
    function l(e) {
        var t = _.map
          , r = e;
        if (t)
            for (var i = 0, n = t.length; n > i; i++) {
                var s = t[i];
                if (r = T(s) ? s(e) || e : e.replace(s[0], s[1]),
                r !== e)
                    break
            }
        return r
    }
    function d(e, t) {
        var r, i = e.charAt(0);
        if (k.test(e))
            r = e;
        else if ("." === i)
            r = s((t ? n(t) : _.cwd) + e);
        else if ("/" === i) {
            var o = _.cwd.match(R);
            r = o ? o[0] + e.substring(1) : e
        } else
            r = _.base + e;
        return 0 === r.indexOf("//") && (r = location.protocol + r),
        r
    }
    function f(e, t) {
        if (!e)
            return "";
        e = a(e),
        e = u(e),
        e = c(e),
        e = o(e);
        var r = d(e, t);
        return r = l(r)
    }
    function g(e) {
        return e.hasAttribute ? e.src : e.getAttribute("src", 4)
    }
    function v(e, t, r) {
        var i = z.test(e)
          , n = G.createElement(i ? "link" : "script");
        if (r) {
            var s = T(r) ? r(e) : r;
            s && (n.charset = s)
        }
        p(n, t, i, e),
        i ? (n.rel = "stylesheet",
        n.href = e) : (n.async = !0,
        n.src = e),
        M = n,
        H ? V.insertBefore(n, H) : V.appendChild(n),
        M = null 
    }
    function p(e, t, r, i) {
        function n() {
            e.onload = e.onerror = e.onreadystatechange = null ,
            r || _.debug || V.removeChild(e),
            e = null ,
            t()
        }
        var s = "onload" in e;
        return !r || !K && s ? void (s ? (e.onload = n,
        e.onerror = function() {
            q("error", {
                uri: i,
                node: e
            }),
            n()
        }
        ) : e.onreadystatechange = function() {
            /loaded|complete/.test(e.readyState) && n()
        }
        ) : void setTimeout(function() {
            h(e, t)
        }
        , 1)
    }
    function h(e, t) {
        var r, i = e.sheet;
        if (K)
            i && (r = !0);
        else if (i)
            try {
                i.cssRules && (r = !0)
            } catch (n) {
                "NS_ERROR_DOM_SECURITY_ERR" === n.name && (r = !0)
            }
        setTimeout(function() {
            r ? t() : h(e, t)
        }
        , 20)
    }
    function w() {
        if (M)
            return M;
        if (P && "interactive" === P.readyState)
            return P;
        for (var e = V.getElementsByTagName("script"), t = e.length - 1; t >= 0; t--) {
            var r = e[t];
            if ("interactive" === r.readyState)
                return P = r
        }
    }
    function m(e) {
        var t = [];
        return e.replace(J, "").replace(Y, function(e, r, i) {
            i && t.push(i)
        }
        ),
        t
    }
    function b(e, t) {
        this.uri = e,
        this.dependencies = t || [],
        this.exports = null ,
        this.status = 0,
        this._waitings = {},
        this._remain = 0
    }
    var y = e.seajs;
    if (y && y.args && (e.seajs = null ),
    !e.seajs) {
        var E = e.seajs = {
            version: "2.2.1"
        }
          , _ = E.data = {}
          , A = r("Object")
          , x = r("String")
          , S = Array.isArray || r("Array")
          , T = r("Function")
          , $ = 0
          , D = _.events = {};
        E.on = function(e, t) {
            var r = D[e] || (D[e] = []);
            return r.push(t),
            E
        }
        ,
        E.off = function(e, t) {
            if (!e && !t)
                return D = _.events = {},
                E;
            var r = D[e];
            if (r)
                if (t)
                    for (var i = r.length - 1; i >= 0; i--)
                        r[i] === t && r.splice(i, 1);
                else
                    delete D[e];
            return E
        }
        ;
        var q = E.emit = function(e, t) {
            var r, i = D[e];
            if (i)
                for (i = i.slice(); r = i.shift(); )
                    r(t);
            return E
        }
          , O = /[^?#]*\//
          , j = /\/\.\//g
          , C = /\/[^/]+\/\.\.\//
          , L = /([^:/])\/\//g
          , N = /^([^/:]+)(\/.+)$/
          , U = /{([^{]+)}/g
          , k = /^\/\/.|:\//
          , R = /^.*?\/\/.*?\//
          , G = document
          , I = n(G.URL)
          , F = G.scripts
          , X = G.getElementById("seajsnode") || F[F.length - 1]
          , B = n(g(X) || I);
        E.resolve = f;
        var M, P, V = G.head || G.getElementsByTagName("head")[0] || G.documentElement, H = V.getElementsByTagName("base")[0], z = /\.css(?:\?|$)/i, K = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, "$1") < 536;
        E.request = v;
        var W, Y = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g, J = /\\\\/g, Q = E.cache = {}, Z = {}, ee = {}, te = {}, re = b.STATUS = {
            FETCHING: 1,
            SAVED: 2,
            LOADING: 3,
            LOADED: 4,
            EXECUTING: 5,
            EXECUTED: 6
        };
        b.prototype.resolve = function() {
            for (var e = this, t = e.dependencies, r = [], i = 0, n = t.length; n > i; i++)
                r[i] = b.resolve(t[i], e.uri);
            return r
        }
        ,
        b.prototype.load = function() {
            var e = this;
            if (!(e.status >= re.LOADING)) {
                e.status = re.LOADING;
                var t = e.resolve();
                q("load", t);
                for (var r, i = e._remain = t.length, n = 0; i > n; n++)
                    r = b.get(t[n]),
                    r.status < re.LOADED ? r._waitings[e.uri] = (r._waitings[e.uri] || 0) + 1 : e._remain--;
                if (0 === e._remain)
                    return void e.onload();
                var s = {};
                for (n = 0; i > n; n++)
                    r = Q[t[n]],
                    r.status < re.FETCHING ? r.fetch(s) : r.status === re.SAVED && r.load();
                for (var o in s)
                    s.hasOwnProperty(o) && s[o]()
            }
        }
        ,
        b.prototype.onload = function() {
            var e = this;
            e.status = re.LOADED,
            e.callback && e.callback();
            var t, r, i = e._waitings;
            for (t in i)
                i.hasOwnProperty(t) && (r = Q[t],
                r._remain -= i[t],
                0 === r._remain && r.onload());
            delete e._waitings,
            delete e._remain
        }
        ,
        b.prototype.fetch = function(e) {
            function t() {
                E.request(s.requestUri, s.onRequest, s.charset)
            }
            function r() {
                delete Z[o],
                ee[o] = !0,
                W && (b.save(n, W),
                W = null );
                var e, t = te[o];
                for (delete te[o]; e = t.shift(); )
                    e.load()
            }
            var i = this
              , n = i.uri;
            i.status = re.FETCHING;
            var s = {
                uri: n
            };
            q("fetch", s);
            var o = s.requestUri || n;
            return !o || ee[o] ? void i.load() : Z[o] ? void te[o].push(i) : (Z[o] = !0,
            te[o] = [i],
            q("request", s = {
                uri: n,
                requestUri: o,
                onRequest: r,
                charset: _.charset
            }),
            void (s.requested || (e ? e[s.requestUri] = t : t())))
        }
        ,
        b.prototype.exec = function() {
            function e(t) {
                return b.get(e.resolve(t)).exec()
            }
            var r = this;
            if (r.status >= re.EXECUTING)
                return r.exports;
            r.status = re.EXECUTING;
            var n = r.uri;
            e.resolve = function(e) {
                return b.resolve(e, n)
            }
            ,
            e.async = function(t, r) {
                return b.use(t, r, n + "_async_" + i()),
                e
            }
            ;
            var s = r.factory
              , o = T(s) ? s(e, r.exports = {}, r) : s;
            return o === t && (o = r.exports),
            delete r.factory,
            r.exports = o,
            r.status = re.EXECUTED,
            q("exec", r),
            o
        }
        ,
        b.resolve = function(e, t) {
            var r = {
                id: e,
                refUri: t
            };
            return q("resolve", r),
            r.uri || E.resolve(r.id, t)
        }
        ,
        b.define = function(e, r, i) {
            var n = arguments.length;
            1 === n ? (i = e,
            e = t) : 2 === n && (i = r,
            S(e) ? (r = e,
            e = t) : r = t),
            !S(r) && T(i) && (r = m(i.toString()));
            var s = {
                id: e,
                uri: b.resolve(e),
                deps: r,
                factory: i
            };
            if (!s.uri && G.attachEvent) {
                var o = w();
                o && (s.uri = o.src)
            }
            q("define", s),
            s.uri ? b.save(s.uri, s) : W = s
        }
        ,
        b.save = function(e, t) {
            var r = b.get(e);
            r.status < re.SAVED && (r.id = t.id || e,
            r.dependencies = t.deps || [],
            r.factory = t.factory,
            r.status = re.SAVED)
        }
        ,
        b.get = function(e, t) {
            return Q[e] || (Q[e] = new b(e,t))
        }
        ,
        b.use = function(t, r, i) {
            var n = b.get(i, S(t) ? t : [t]);
            n.callback = function() {
                for (var t = [], i = n.resolve(), s = 0, o = i.length; o > s; s++)
                    t[s] = Q[i[s]].exec();
                r && r.apply(e, t),
                delete n.callback
            }
            ,
            n.load()
        }
        ,
        b.preload = function(e) {
            var t = _.preload
              , r = t.length;
            r ? b.use(t, function() {
                t.splice(0, r),
                b.preload(e)
            }
            , _.cwd + "_preload_" + i()) : e()
        }
        ,
        E.use = function(e, t) {
            return b.preload(function() {
                b.use(e, t, _.cwd + "_use_" + i())
            }
            ),
            E
        }
        ,
        b.define.cmd = {},
        E.define = b.define;
        var ie = e.define;
        e.define = ie && T(ie) ? function() {
            ie.apply(e, arguments),
            b.define.apply(e, arguments)
        }
         : b.define,
        E.isFunction = T,
        E.parseDependencies = m,
        E.Module = b,
        _.fetchedList = ee,
        _.cid = i,
        E.require = function(e) {
            var t = b.get(b.resolve(e));
            return t.status < re.EXECUTING && (t.onload(),
            t.exec()),
            t.exports
        }
        ;
        var ne = /^(.+?\/)(\?\?)?(seajs\/)+/;
        _.base = (B.match(ne) || ["", B])[1],
        _.dir = B,
        _.cwd = I,
        _.charset = "utf-8",
        _.preload = function() {
            var e = []
              , t = location.search.replace(/(seajs-\w+)(&|$)/g, "$1=1$2");
            return t += " " + G.cookie,
            t.replace(/(seajs-\w+)=1/g, function(t, r) {
                e.push(r)
            }
            ),
            e
        }
        (),
        E.config = function(e) {
            for (var t in e) {
                var r = e[t]
                  , i = _[t];
                if (i && A(i))
                    for (var n in r)
                        i[n] = r[n];
                else
                    S(i) ? r = i.concat(r) : "base" === t && ("/" !== r.slice(-1) && (r += "/"),
                    r = d(r)),
                    _[t] = r
            }
            return q("config", e),
            E
        }
        ,
        y && y.args && (E.execPreorders = function() {
            for (var e = ["define", "config", "use"], t = y.args, r = 0; r < t.length; r += 2)
                E[e[t[r]]].apply(E, t[r + 1]);
            E.execPreorders = null 
        }
        )
    }
}
(this),
seajs.config({
    alias: {
        ui: "ui/ui",
        iscroll: "libs/iscroll",
        accordion: "ui/widgets/accordion",
        accordionList: "ui/widgets/accordionList",
        button: "ui/widgets/button",
        checkbox: "ui/widgets/checkbox",
        dialog: "ui/widgets/dialog",
        radio: "ui/widgets/checkbox",
        select: "ui/widgets/select",
        input: "ui/widgets/input",
        "switch": "ui/widgets/switch",
        slider: "ui/widgets/slider/slider",
        sGuide: "ui/widgets/slider/guide",
        sTouch: "ui/widgets/slider/touch",
        sGestures: "ui/widgets/slider/gestures",
        sMultiview: "ui/widgets/slider/multiview",
        swipelist: "ui/widgets/swipelist",
        tab: "ui/widgets/tabs/tabs",
        navigator: "ui/widgets/navigator",
        swipepage: "ui/widgets/swipepage",
        treeview: "ui/widgets/treeview",
        refresh: "ui/widgets/refresh",
        fullpage: "ui/widgets/fullpage",
        searchbar: "ui/widgets/searchbar",
        photobrowser: "ui/widgets/photobrowser",
        lazyloadimage: "ui/widgets/lazyloadimage",
        scroll: "ui/widgets/iscroll",
        debug: "debug"
    },
    preload: ["ui", "button", "checkbox", "select", "input"]
}),
function(e, t, r) {
    function i(e) {
        var t = [];
        return e.replace(a, "").replace(o, function(e, r, i) {
            i && t.push(i)
        }
        ),
        t
    }
    var n = e.co = {
        version: "1.0.1",
        verticalSwipe: !0
    }
      , s = /complete|loaded|interactive/
      , o = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
      , a = /\\\\/g;
    ($.os.android || $.os.ios) && $.os.ios && parseFloat($.os.version) >= 7 && $(document.body).addClass("ui-ios7"),
    n.plus = !!e.rd,
    e.onLoad = function() {
        u.isReady = !0,
        n.plus = !!e.rd
    }
    ;
    var u = function(r) {
        if ($.isFunction(r)) {
            var s = i(r.toString());
            t.use(s, function() {
                ($.os.android || $.os.ios) && n.plus ? setTimeout(function() {
                    u.isReady ? (r.call(null , t.require),
                    window.onerror = function(e, t, r, i, n) {
                        var s = e;
                        return window.rd.log.e.call(window.rd, s),
                        s = "Line: " + r,
                        window.rd.log.e.call(window.rd, s),
                        s = "resource: " + t,
                        window.rd.log.e.call(window.rd, s),
                        s = "column: " + i,
                        window.rd.log.e.call(window.rd, s),
                        !1
                    }
                    ) : setTimeout(arguments.callee, 1)
                }
                , 1) : r.call(null , t.require),
                $(document).find(".ui-action-back").button(function(t) {
                    n.plus ? window.rd.window.closeSelf.call(window.rd) : e.history.length > 1 && e.history.back()
                }
                )
            }
            )
        }
    }
    ;
    $.fn.ready = function(e) {
        return s.test(document.readyState) && document.body ? u(e) : document.addEventListener("DOMContentLoaded", function() {
            u(e)
        }
        , !1),
        this
    }
    ,
    e.domReady = u
}
(this, seajs);
