/*===============================================================================
************   ui native httpManager   ************
===============================================================================*/
(function($L, global) {

	var XMLHttpRequest = function() {
		var isOpened = false;
		var settings = {};
		var uuid = 0;
		var requests = {};
		settings.offline = 'undefined';
		settings.expires = 0;
		this.open = function(url, method, timeout) {
			if (typeof url === 'undefined') {
				throw new Error("请传入有效的请求地址！");
			}
			settings.method = method || 'GET';
			settings.url = url;
			settings.timeout = timeout || 30000;
			isOpened = true;
		};
		this.send = function(body, dataType) {
			requests[uuid++]['isAbort'] = false;
			if (!isOpened) {
				throw new Error("执行send方法失败，请确保请求对象为OPENDE状态！");
			}
			if (body && $L.isPlainObject(body)) settings.body = JSON.stringify(body);
			settings.dataType = dataType || 'json';
			$L.executeNativeJS(['httpManager', 'sendRequest'], settings, function(response, data) {
				if (this.onSuccess && $L.isFunction(this.onSuccess && !requests[uuid++]['isAbort'])) {
					this.onSuccess.call(null, data, response);
				}

			}, function(code, response, Message) {
				if (this.onError && $L.isFunction(this.onError) && !requests[uuid++]['isAbort']) {
					this.onError.call(null, Message, code, response);
				}
			});

		};
		this.postForm = function(data, dataType, files) {
			requests[uuid++]['isAbort'] = false;
			if (!isOpened) {
				throw new Error("执行postForm方法失败，请确保请求对象为OPENDE状态！");
			}
			var form = {};
			if (data) {
				if (typeof data === 'string') data = JSON.parse(data)
				form.values = data;
			}
			if (files) form.files = files;
			settings.form = form;
			settings.dataType = dataType || 'json';
			$L.executeNativeJS(['httpManager', 'sendRequest'], settings, function(response, data) {
				if (this.onSuccess && $L.isFunction(this.onSuccess && !requests[uuid++]['isAbort'])) {
					this.onSuccess.call(null, data, response);
				}

			}, function(code, response, message) {
				if (this.onError && $L.isFunction(this.onError) && !requests[uuid++]['isAbort']) {
					this.onError.call(null, message, code, response);
				}
			});

		};
		this.abort = function() {
			requests[uuid]['isAbort'] = true;
		};
		this.setHeader = function(headerName, headerValue) {
			if (settings.HTTPHeader) {
				if (headerName && headerValue) settings.HTTPHeader[headerName.toLowerCase()] = headerValue;
			} else {
				settings.HTTPHeader = {};
				if (headerName && headerValue) settings.HTTPHeader[headerName.toLowerCase()] = headerValue;
			}
		};
		this.setOffline = function(type) {
			if (type == 'true') {
				settings.offline = 'true';
			} else if (type == 'false') {
				settings.offline = 'false';
			}else if (type == 'none') {
				settings.offline = 'undefined';
			}
		};
		this.setExpires = function(ms) {
			if (ms) settings.expires = ms;
		};
		this.setCertificate = function(path, password) {
			if (settings.certificate) {
				if (path) settings.certificate['path'] = path;
				if (password) settings.certificate['password'] = password;
			} else {
				settings.certificate = {};
				if (path) settings.certificate['path'] = path;
				if (password) settings.certificate['password'] = password;
			}
		};
	}



	$L.http = {

		/*
		 * 获取网络请求对象
		 */
		XMLHttpRequest: function() {
			return new XMLHttpRequest();
		},
		/*
		 * 执行ajax请求
		 */
		ajax: function(url, settings) {
			var xhr = new XMLHttpRequest();
			if (settings) {
				xhr.open(url, settings.type, settings.timeout);
				if (settings.headers)
					for (name in settings.headers) xhr.setHeader(name, settings.headers[name])
				xhr.setOffline(settings.offline);
				xhr.setExpires(settings.expires);
				if (settings.certificate) xhr.setCertificate(settings.certificate['path'], settings.certificate['password']);

				if (settings.success && typeof(settings.success) === "function") {
					xhr.onSuccess = function(data, response) {
						settings.success.call(null, data, response);
					}
				}
				if (settings.error && typeof(settings.error) === "function") {
					xhr.onError = function(message, code, response) {
						settings.error.call(null, message, code, response);
					}
				}

				xhr.send(settings.data, settings.dataType);
			} else {
				xhr.open(url);
				xhr.send();
			}
			return xhr;
		},
		/*
		 * 执行get请求
		 */
		get: function(url, data, dataType, success) {
			if (typeof(data) === "function") {
				return this.ajax(url, {
					success: data
				})
			} else if (typeof(dataType) === "function") {
				return this.ajax(url, {
					data: data,
					success: dataType
				})
			} else {
				return this.ajax(url, {
					data: data,
					dataType: dataType,
					success: success
				})
			}
		},
		/*
		 * 执行getJSON请求
		 */
		getJSON: function(url, data, success) {
			if (typeof(data) === "function") {
				return this.ajax(url, {
					success: data
				})
			} else {
				return this.ajax(url, {
					data: data,
					success: success
				})
			}
		},
		/*
		 * 执行fileUpload请求
		 */
		fileUpload: function(url, files, data, dataType, success) {
			var xhr = new XMLHttpRequest();
			xhr.open(url, 'POST');

			if (typeof(data) === "function") {
				success = data;
				data = undefined;
				dataType = undefined;
			} else if (typeof(dataType) === "function") {
				success = dataType;
				dataType = undefined;
			}

			if (success && typeof(success) === "function") {
				xhr.onSuccess = function(data, response) {
					success.call(null, data, response);
				}
			}
			xhr.postForm(data, dataType, files);
			return xhr;
		}
	}

}(app, this));