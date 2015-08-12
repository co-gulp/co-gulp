(function() {

	var CLASS_PULL_TOP_POCKET = 'mui-pull-top-pocket';
	var CLASS_PULL_BOTTOM_POCKET = 'mui-pull-bottom-pocket';
	var CLASS_PULL = 'mui-pull';
	var CLASS_PULL_LOADING = 'mui-pull-loading';
	var CLASS_PULL_CAPTION = 'mui-pull-caption';

	var CLASS_ICON = 'mui-icon';
	var CLASS_SPINNER = 'mui-spinner';
	var CLASS_ICON_PULLDOWN = 'mui-icon-pulldown';

	var CLASS_BLOCK = 'mui-block';
	var CLASS_HIDDEN = 'mui-hidden';
	var CLASS_VISIBILITY = 'mui-visibility';

    var CLASS_SCROLL = 'ui-scroll';
    var CLASS_SCROLL_WRAPPER = 'ui-scroll-wrapper';

	var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
	var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

	var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');


	var render = function(){
            var _re = this, opts = _re.opts;
            _re.wrapper = _re.ref;
			_re.scrollEl = _re.wrapper.children().first();
			if (opts.down && opts.down.hasOwnProperty('callback')) {
				_re.topPocket = _re.scrollEl.find('.' + CLASS_PULL_TOP_POCKET);
				if (!_re.topPocket[0]) {
					_re.topPocket = createPocket(CLASS_PULL_TOP_POCKET, opts.down, CLASS_LOADING_DOWN);
					_re.topPocket.insertBefore(_re.scrollEl);
				}
				_re.topLoading = _re.topPocket.find('.' + CLASS_PULL_LOADING);
				_re.topCaption = _re.topPocket.find('.' + CLASS_PULL_CAPTION);
			}
			if (opts.up && opts.up.hasOwnProperty('callback')) {
				_re.bottomPocket = _re.scrollEl.find('.' + CLASS_PULL_BOTTOM_POCKET);
				if (!_re.bottomPocket[0]) {
					_re.bottomPocket = createPocket(CLASS_PULL_BOTTOM_POCKET, opts.up, CLASS_LOADING);
					_re.bottomPocket.appendTo(_re.scrollEl);
				}
				_re.bottomLoading = _re.bottomPocket.find('.' + CLASS_PULL_LOADING);
				_re.bottomCaption = _re.bottomPocket.find('.' + CLASS_PULL_CAPTION);
			}
        };

    var bind = function(){
            var _re = this, opts = _re.opts;
           	_re.scroller.on('scrollStart', function () {
           			console.log('scrollStart x--> '+this.x);
                    if (!_re.loading) {
						_re.pulldown = _re.pullPocket = _re.pullCaption = _re.pullLoading = false
					}   
                });
           	_re.scroller.on('scroll',function(e){
                	if (!_re.pulldown && !_re.loading && _re.topPocket && this.directionY === -1 && this.y >= 0) {
						initPulldownRefresh.call(_re);
					}
					if (_re.pulldown) {
						setCaption.call(_re,this.y > opts.down.height ? opts.down.contentover : opts.down.contentdown);
					}
                });

           	_re.scroller.on('scrollEnd',function(e){
                	if (Math.abs(this.y) > 0 && this.y <= this.maxScrollY) {
						if (!_re.pulldown && !_re.loading&&!_re.finished) {
							_re.pulldown = false;
							initPullupRefresh.call(_re);
							pullupLoading.apply(_re,[0, this]);
						}
					}
            });

			var _resetPosition = _re.scroller.resetPosition;
            $.extend(_re.scroller, { 
            	resetPosition:function(time) {
					if (_re.pulldown && this.y >= opts.down.height) {
						pulldownLoading.apply(_re,[0, _re.scroller]);
						return true;
					}
					_resetPosition.call(_re.scroller,time);
				}
            });

        };

    var initPulldownRefresh = function() {
    		var _re = this, opts = _re.opts;
			_re.pulldown = true;
			_re.pullPocket = _re.topPocket;
			_re.pullPocket.addClass(CLASS_BLOCK);
			_re.pullPocket.addClass(CLASS_VISIBILITY);
			_re.pullCaption = _re.topCaption;
			_re.pullLoading = _re.topLoading;
		};
	var initPullupRefresh = function() {
			var _re = this, opts = _re.opts;
			_re.pulldown = false;
			_re.pullPocket = _re.bottomPocket;
			_re.pullPocket.addClass(CLASS_BLOCK);
			_re.pullPocket.addClass(CLASS_VISIBILITY);
			_re.pullCaption = _re.bottomCaption;
			_re.pullLoading = _re.bottomLoading;
		};

	var resetPosition = function(scroller) {
			var _re = this, opts = _re.opts;
			if (_re.pulldown && scroller.y >= opts.down.height) {
				pulldownLoading.apply(_re,[0, scroller]);
				return true;
			}
		};
	var pulldownLoading = function(x, scroller) {
			var _re = this, opts = _re.opts;
			var time = scroller.options.bounceTime;
			x = x || 0;
			scroller.scrollTo(x, opts.down.height, time, IScroll.utils.ease.circular);
			if (_re.loading) {
				return;
			}
			initPulldownRefresh.call(_re);
			setCaption.call(_re,opts.down.contentrefresh);
			_re.loading = true;
			var callback = opts.down.callback;
			callback && callback.call(_re);
			scroller.refresh();
		};
	var pullupLoading = function(x, scroller,callback) {
			var _re = this, opts = _re.opts;
			var time = scroller.options.bounceTime;
			x = x || 0;
			scroller.scrollTo(x, scroller.maxScrollY, time, scroller.options.bounceEasing);
			if (_re.loading) {
				return;
			}
			initPullupRefresh.call(_re);
			setCaption.call(_re,opts.up.contentrefresh);
			_re.loading = true;
			callback = callback || opts.up.callback;
			callback && callback.call(this);
			scroller.refresh();
		};

    var createPocket = function(clazz, options, iconClass) {
			var pocket = document.createElement('div');
			pocket.className = clazz;
			pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentrefresh).replace('{icon}', iconClass);
			return $(pocket);
	};

	var setCaption = function(title, reset) {
			var _re = this, opts = _re.opts;
			if (_re.loading) {
				return;
			}
			var pocket = _re.pullPocket;
			var caption = _re.pullCaption;
			var loading = _re.pullLoading;
			var isPulldown = _re.pulldown;
			if (pocket) {
				if (reset) {
					setTimeout(function() {
						_re.lastTitle = title;
						caption.html(title);
						if (isPulldown) {
							loading[0].className = CLASS_LOADING_DOWN;
						} else {
							loading[0].className = CLASS_LOADING;
						}
						loading[0].style.webkitAnimation = "";
						loading[0].style.webkitTransition = "";
						loading[0].style.webkitTransform = "";
					}, 100);
				} else {
					if (title !== _re.lastTitle) {
						caption.html(title);
						if (isPulldown) {
							if (title === opts.down.contentrefresh) {
								loading[0].className = CLASS_LOADING;
								loading[0].style.webkitAnimation = "spinner-spin 1s step-end infinite";
							} else if (title === opts.down.contentover) {
								loading[0].className = CLASS_LOADING_UP;
								loading[0].style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading[0].style.webkitTransform = "rotate(180deg)";
							} else if (title === opts.down.contentdown) {
								loading[0].className = CLASS_LOADING_DOWN;
								loading[0].style.webkitTransition = "-webkit-transform 0.3s ease-in";
								loading[0].style.webkitTransform = "rotate(0deg)";
							}
						} else {
							if (title === opts.up.contentrefresh) {
								loading[0].className = CLASS_LOADING + ' ' + CLASS_VISIBILITY;
							} else {
								loading[0].className = CLASS_LOADING + ' ' + CLASS_HIDDEN;
							}
						}
						_re.lastTitle = title;
					}
				}

			}
		};

	/**
     * 刷新组件
     */
    define(function(require, exports, module) {
        var $ui = require("ui");
        var $refresh = $ui.define('Refresh',{
				scrollY: true,
				scrollX: false,
				down: {
					height: 50,
					contentdown: '下拉可以刷新',
					contentover: '释放立即刷新',
					contentrefresh: '正在刷新...'
				},
				up: {
					height: 50,
					auto: false,
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了',
					duration: 300
				}
			});
        
        //初始化
        $refresh.prototype.init = function () {
            var _re = this, opts = _re.opts;
            require.async('scroll', function() {
	            _re.ref.addClass(CLASS_SCROLL_WRAPPER);
	            _re.ref.children().wrapAll('<div class = "'+CLASS_SCROLL+'"/>');
                _re.scroller = _re.ref.scroll({
                        scrollY: true,
						scrollX: false,
						bounceTime:300,
						probeType:1 //每滚动一像素触发
                });
	            render.call(_re);
	            bind.call(_re);
            });
        };



		$refresh.prototype.endPulldownToRefresh = function() {
			var _re = this, opts = _re.opts;
			if (_re.topPocket && _re.loading && _re.pulldown) {
				_re.scroller.scrollTo(0, 0, _re.scroller.options.bounceTime, _re.scroller.options.bounceEasing);
				_re.loading = false;
				setCaption.apply(_re,[opts.down.contentdown, true]);
				setTimeout(function() {
					_re.loading || _re.topPocket.removeClass(CLASS_VISIBILITY);
				}, 150);
			}
		};

		$refresh.prototype.endPullupToRefresh = function(finished) {
			var _re = this, opts = _re.opts;
			if (_re.bottomPocket && _re.loading && !_re.pulldown) {
				_re.loading = false;
				if (finished) {
					_re.finished = true;
					setCaption.call(_re,opts.up.contentnomore);
					// _re.wrapper.removeEventListener('scrollbottom', self);
				} else {
					setCaption.call(_re,opts.up.contentdown);
					setTimeout(function() {
						_re.loading || _re.bottomPocket.removeClass(CLASS_VISIBILITY);
					}, 150);
				}
			}
		};

        /**
         * 销毁组件
         * @method destroy
         */
        $refresh.prototype.destroy = function () {
           
        };
        //注册$插件
        $.fn.refresh = function(opts) {
            var refObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var refObj = null;
                var id = this.getAttribute('data-ref');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++$ui.uuid;
                    refObj = $ui.data[id] = new $refresh(opts);
                    this.setAttribute('data-ref', id);
                } else {
                    refObj = $ui.data[id];
                }
                refObjs.push(refObj);
            });
            return refObjs.length > 1 ? refObjs : refObjs[0];
        };

    });
})();