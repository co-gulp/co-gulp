var body = document.body
var Zindex = 10000
var windows = []
var winMap = {}
var EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);



var uuid = function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
var iframeload = function(id) {
    if (!this.readyState || this.readyState == "complete") {
        // this.postMessage(id,'*');
    }
}
var GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}
window.addEventListener('message', function(e) {
    eval(e.data);
}, false);
var rootName = GetQueryString('pageId') || uuid(16);
var rootUrl = GetQueryString('pageId') || 'index.html';
openWindow(rootName, rootUrl, true);

function strEncode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += EncodeChars.charAt(c1 >> 2);
            out += EncodeChars.charAt((c1 & 0x3) << 4);
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += EncodeChars.charAt(c1 >> 2);
            out += EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += EncodeChars.charAt((c2 & 0xF) << 2);
            break;
        }
        c3 = str.charCodeAt(i++);
        out += EncodeChars.charAt(c1 >> 2);
        out += EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function strDecode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do {
            c2 = DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
var closeWin = strEncode(uuid(32));

function openWindow(windowname, url, noTransition) {
    var pageId = strEncode(windowname);
    var win = document.getElementById(pageId);
    if (win) {
        win.style.zIndex = ++Zindex;
        return;
    }
    winMap[pageId] = {};
    winMap[pageId]['pops'] = [];
    windows.push(pageId);
    var view = document.createElement("DIV");
    view.style.borderWidth = "0px";
    view.style.position = "absolute";
    view.style.left = "0px";
    view.style.top = "0px";
    view.style.width = "100%";
    view.style.height = "100%";
    view.style.zIndex = ++Zindex;
    view.id = pageId;
    // view.style.transform: translate3d(100%, 0, 0);
    var iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.borderWidth = "0px";
    iframe.style.left = "0px";
    iframe.style.top = "0px";
    iframe.style.border = "0px";
    iframe.style.padding = "0px";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    view.appendChild(iframe);
    iframe.onload = iframe.onreadystatechange = function() {
        iframeload.call(iframe, pageId);
    }
    iframe.src = url + "?pageId=" + pageId;
    // view.innerHTML = '<iframe style="position:absolute;left:0px;top:0px;width:100%;height:100%;border:0px;padding:0px;" src="' + args[2] + '"></iframe>';
    body.appendChild(view);
    if (noTransition) return;
    view.className = 'page-from-right-to-center';
    view.addEventListener("webkitAnimationEnd", function() {
        view.className = '';
    }, false);
}

function closeWindow(windowname, pageId) {

    var win = document.getElementById(pageId);
    win.className = 'page-from-center-to-right';
    win.addEventListener("webkitAnimationEnd", function() {
        var pops = winMap[pageId]['pops'];
        for (var i = 0; i < pops.length; i++) {
            var popId = pops[i];
            var pop = document.getElementById(popId);
            pop && pop.parentNode.removeChild(pop)
        }
        winMap[pageId]['pops']
        delete winMap[pageId];
        win.parentNode.removeChild(win);
    }, false);
}

function openPopover(popname, url, rect, windowname) {
    var pageId = strEncode(popname);
    var win = document.getElementById(pageId);
    if (win) {
        win.style.zIndex = ++Zindex;
        return;
    }
    rect = JSON.parse(rect);
    var x = (rect.x || 0) + "px";
    var y = (rect.y || 0) + "px";
    var width = '100%';
    if (rect.width) {
        width = rect.width + "px";
    } else if (rect.width == 0 && rect.x) {
        width = (document.body.scrollWidth - rect.x) + "px";
    }
    var height = '100%';
    if (rect.height) {
        height = rect.height + "px";
    } else if (rect.height == 0 && rect.y) {
        height = (document.body.scrollHeight - rect.y) + "px";
    }
    winMap[windowname]['pops'].push(pageId);
    var view = document.createElement("DIV");
    view.style.borderWidth = "0px";
    view.style.position = "absolute";
    view.style.left = x;
    view.style.top = y;
    view.style.width = width;
    view.style.height = height;
    view.style.zIndex = ++Zindex;
    view.id = pageId;
    // view.style.transform: translate3d(100%, 0, 0);
    var iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.borderWidth = "0px";
    iframe.style.left = "0px";
    iframe.style.top = "0px";
    iframe.style.border = "0px";
    iframe.style.padding = "0px";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    view.appendChild(iframe);
    iframe.onload = iframe.onreadystatechange = function() {
        iframeload.call(iframe, pageId);
    }
    iframe.src = url + "?pageId=" + pageId;
    document.getElementById(windowname).appendChild(view);
}

function closePopover(windowname, pageId) {
    // windows.splice(index,index);
    var pop = document.getElementById(pageId);
    pop.parentNode.removeChild(pop);
}