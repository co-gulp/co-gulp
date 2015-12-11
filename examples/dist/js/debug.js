if (window['app']) {
	var uuid = 0;
	var xhr = {}
	window.addEventListener('message', function(e) {
		// alert(e.data);
		var res = JSON.parse(e.data)
		var type = res.type;
		if(type == 'ajax'){
			var token = res.token;
			var success = xhr[token].success;
			var error = xhr[token].error;
			var data = res.data;
			var dataType = xhr[token].dataType;
			if(dataType == 'json'){
				if(app.isFunction(success)){
					data = JSON.parse(data)
					success.call(null,{},data)
				}
			}else{
				if(app.isFunction(success)){
					success.call(null,{},data)
				}
			}
		}
	}, false);

	var GetQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	}
	var getPageDir = function() {
		var div = document.createElement('div');
		div.innerHTML = '<a href="./"></a>';
		var pageDir = div.firstChild.href;
		div = null;
		return pageDir;
	}
	app.executeNativeJS = function() {
		var args = Array.prototype.slice.call(arguments, 1);
		if (arguments[0][0] == 'window' && arguments[0][1] == 'openWindow') {
			var windowname = args[0]
			var url = getPageDir() + args[2]
			var js = "openWindow('" + windowname + "','" + url + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'closeSelf') {
			var pageId = GetQueryString('pageId');
			var js = "closeWindow('" + windowname + "','" + pageId + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'openPopover') {
			var popname = args[0]
			var url = getPageDir() + args[2]
			var rect = JSON.stringify(args[3])
			var windowname = GetQueryString('pageId');
			var js = "openPopover('" + popname + "','" + url + "','" + rect + "','" + windowname + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'closePopover') {
			var popname = args[0]
			var pageId = GetQueryString('pageId');
			var js = "closePopover('" + popname + "','" + pageId + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'bringPopoverToFront') {
			var popname = args[0]
			var js = "openPopover('" + popname + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'setSlideLayout') {
			var params = JSON.stringify(args[0])
			var js = "setSlideLayout('" + params + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'openSlidePane') {
			var params = JSON.stringify(args[0])
			var js = "openSlidePane('" + params + "')"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'window' && arguments[0][1] == 'closeSlidePane') {
			var js = "closeSlidePane()"
			window.parent.postMessage(js, '*');
		} else if (arguments[0][0] == 'httpManager' && arguments[0][1] == 'sendRequest') {
			var settings = JSON.stringify(args[0])
			var pageId = GetQueryString('pageId');
			var token = uuid++;
			xhr[token] = {
				success: args[1],
				error: args[2],
				dataType:args[0].dataType
			}
			var js = "sendRequest('" + settings + "','" + pageId + "','" + token + "')"
			window.parent.postMessage(js, '*');
		}
	}
}
if (window.Dom) {
	var on = $.fn.on;

	$.fn.on = function(event, selector, data, callback, one) {
		if (event == 'tab') {
			event = 'click';
		}
		// else if (event == 'touchstart') {
		// 	event = 'mousedown';
		// } else if (event == 'touchmove') {
		// 	event = 'mousemove';
		// } else if (event == 'touchend') {
		// 	event = 'mouseup';
		// }
		return on.call(this, event, selector, data, callback, one);
	}

	var off = $.fn.off;
	$.fn.off = function(event, selector, callback) {
		if (event == 'tab') {
			event = 'click';
		}
		// else if (event == 'touchstart') {
		// 	event = 'mousedown';
		// } else if (event == 'touchmove') {
		// 	event = 'mousemove';
		// } else if (event == 'touchend') {
		// 	event = 'mouseup';
		// }
		return off.call(this, event, selector, callback);
	}

	var trigger = $.fn.trigger;
	$.fn.trigger = function(event, args) {
		if (event == 'tab') {
			event = 'click';
		}
		// else if (event == 'touchstart') {
		// 	event = 'mousedown';
		// } else if (event == 'touchmove') {
		// 	event = 'mousemove';
		// } else if (event == 'touchend') {
		// 	event = 'mouseup';
		// }
		return trigger.call(this, event, args);
	}

	var one = $.fn.one;
	$.fn.one = function(event, selector, data, callback) {
		if (event == 'tab') {
			event = 'click';
		}
		// else if (event == 'touchstart') {
		// 	event = 'mousedown';
		// } else if (event == 'touchmove') {
		// 	event = 'mousemove';
		// } else if (event == 'touchend') {
		// 	event = 'mouseup';
		// }
		return one.call(this, event, selector, data, callback);
	}

}