(function() {

    var CLASS_PULL_TOP_POCKET = 'ui-pull-top-pocket';
    var CLASS_PULL_BOTTOM_POCKET = 'ui-pull-bottom-pocket';
    var CLASS_PULL = 'ui-pull';
    var CLASS_PULL_LOADING = 'ui-pull-loading';
    var CLASS_PULL_CAPTION = 'ui-pull-caption';

    var CLASS_ICON = 'ui-icon';
    var CLASS_SPINNER = 'ui-spinner';
    var CLASS_ICON_PULLDOWN = 'ui-icon-pulldown';

    var CLASS_BLOCK = 'ui-block';
    var CLASS_HIDDEN = 'ui-hidden';

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
                    _re.topPocket = createPocket(CLASS_PULL_TOP_POCKET, opts.down.contentrefresh, CLASS_LOADING_DOWN);
                    _re.topPocket.insertBefore(_re.scrollEl);
                }
                _re.topLoading = _re.topPocket.find('.' + CLASS_PULL_LOADING);
                _re.topCaption = _re.topPocket.find('.' + CLASS_PULL_CAPTION);
            }
            if (opts.up && opts.up.hasOwnProperty('callback')) {
                _re.bottomPocket = _re.scrollEl.find('.' + CLASS_PULL_BOTTOM_POCKET);
                if (!_re.bottomPocket[0]) {
                    _re.bottomPocket = createPocket(CLASS_PULL_BOTTOM_POCKET, opts.up.contentdown, CLASS_LOADING);
                    _re.bottomPocket.appendTo(_re.scrollEl);
                    _re.bottomPocket.addClass(CLASS_BLOCK);
                    _re.bottomPocket.css('visibility','visible');
                    _re.initPullup = true;
                }
                _re.bottomLoading = _re.bottomPocket.find('.' + CLASS_PULL_LOADING);
                _re.bottomCaption = _re.bottomPocket.find('.' + CLASS_PULL_CAPTION);
                _re.reCaption = $('<div class="' + CLASS_PULL_CAPTION + '">'+opts.up.contentrefresh+'</div>').appendTo(_re.bottomPocket.find('.' + CLASS_PULL));
                _re.reCaption.css('display','none');
            }
        };

    var bind = function(){
            var _re = this, opts = _re.opts;
            
            _re.scroller.on('beforeScrollStart', function () {
                   
                });
            _re.scroller.on('scrollStart', function () {
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
                    if(_re.initPullup&&this.maxScrollY - this.y >20){
                            if(opts.up && opts.up.hasOwnProperty('callback')){
                                if (!_re.pulldown && !_re.loading&&!_re.finished) {
                                    _re.readyUpLoad = true;
                                }
                            }
                    }
                });

            _re.scroller.on('scrollEnd',function(e){
                    if(_re.readyUpLoad){
                        _re.pulldown = false;
                        _re.pullupLoading();
                        _re.readyUpLoad = false;
                    }
            });

            var _resetPosition = _re.scroller.resetPosition;
            $.extend(_re.scroller, { 
                resetPosition:function(time) {
                    if (_re.pulldown && this.y >= opts.down.height) {
                        _re.pulldownLoading();
                        return true;
                    }
                    return _resetPosition.call(_re.scroller,time);
                }
            });

        };

    var initPulldownRefresh = function() {
            var _re = this, opts = _re.opts;
            _re.pulldown = true;
            _re.pullPocket = _re.topPocket;
            _re.pullPocket.addClass(CLASS_BLOCK);
            _re.pullPocket.css('visibility','visible');
            _re.pullCaption = _re.topCaption;
            _re.pullLoading = _re.topLoading;
        };
    var initPullupRefresh = function() {
            var _re = this, opts = _re.opts;
            _re.pulldown = false;
            _re.pullPocket = _re.bottomPocket;
            _re.pullCaption = _re.bottomCaption;
            _re.pullLoading = _re.bottomLoading;
            _re.scroller.refresh();
        };

    var resetPosition = function(scroller) {
            var _re = this, opts = _re.opts;
            if (_re.pulldown && scroller.y >= opts.down.height) {
                _re.pulldownLoading();
                return true;
            }
        };

    var createPocket = function(clazz, content, iconClass) {
            var pocket = document.createElement('div');
            pocket.className = clazz;
            pocket.innerHTML = pocketHtml.replace('{contentrefresh}', content).replace('{icon}', iconClass);
            return $(pocket);
    };

    var setCaption = function(title, reset) {
            var _re = this, opts = _re.opts;
            if (_re.loading) {
                return;
            }
            var pocket = _re.pullPocket[0];
            var caption = _re.pullCaption[0];
            var loading = _re.pullLoading[0];
            var isPulldown = _re.pulldown;
            if (pocket) {
                if (reset) {
                        caption.innerHTML = '';
                        loading.className = '';
                        loading.style.webkitAnimation = "";
                        loading.style.webkitTransition = "";
                        loading.style.webkitTransform = "";
                } else {
                    if (title !== _re.lastTitle) {
                        if (isPulldown) {
                            caption.innerHTML = title;
                            if (title === opts.down.contentrefresh) {
                                loading.className = CLASS_LOADING;
                                loading.style.webkitAnimation = "spinner-spin 1s step-end infinite";
                            } else if (title === opts.down.contentover) {
                                loading.className = CLASS_LOADING_UP;
                                loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                                loading.style.webkitTransform = "rotate(180deg)";
                            } else if (title === opts.down.contentdown) {
                                loading.className = CLASS_LOADING_DOWN;
                                loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                                loading.style.webkitTransform = "rotate(0deg)";
                            }
                        } else {
                            if (title === opts.up.contentrefresh) {
                                $(loading).css('display','inline-block');
                                $(loading).css('visibility','visible');
                                $(caption).css('display','none');
                                _re.reCaption.css('display','inline-block');
//                              if($.os.android&&($.os.version == '4.3')){
//                                  $('html').css('visibility','hidden');
//                                  setTimeout(function(){
//                                           $('html').css('visibility','visible');
//                                  },80);
//                              }
                            } else {
                                caption.innerHTML = title;
                                $(caption).css('display','inline-block');
                                _re.reCaption.css('display','none');
                                loading.style.display = 'none';
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
        require("scroll");
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
            _re.ref.addClass(CLASS_SCROLL_WRAPPER);
            _re.ref.children().wrapAll('<div class = "'+CLASS_SCROLL+'"/>');
            _re.scroller = _re.ref.scroll({
                scrollY: true,
                scrollX: false,
                bounceTime:300,
                bounceEasing: 'quadratic',
                probeType:2 //每滚动一像素触发
            });
            render.call(_re);
            bind.call(_re);
        };
        
        
    $refresh.prototype.pulldownLoading = function() {
            var _re = this, opts = _re.opts;
            var time = _re.scroller.options.bounceTime;
            _re.scroller.scrollTo(0, opts.down.height, time, IScroll.utils.ease.circular);
            if (_re.loading) {
                return;
            }
            initPulldownRefresh.call(_re);
            setCaption.call(_re,opts.down.contentrefresh);
            _re.loading = true;
            var callback = opts.down.callback;
            callback && callback.call(_re);
        };
    $refresh.prototype.pullupLoading = function(callback) {
            var _re = this, opts = _re.opts;
            var time = _re.scroller.options.bounceTime;
            _re.scroller.scrollTo(0, _re.scroller.maxScrollY - opts.up.height, time, _re.scroller.options.bounceEasing);
            if (_re.loading) {
                return;
            }
            initPullupRefresh.call(_re);
            setCaption.call(_re,opts.up.contentrefresh);
            _re.loading = true;
            callback = callback || opts.up.callback;
            callback && callback.call(this);
        };



        $refresh.prototype.endPulldownToRefresh = function() {
            var _re = this, opts = _re.opts;
            if (_re.topPocket && _re.loading && _re.pulldown) {
                _re.scroller.scrollTo(0, 0, _re.scroller.options.bounceTime, _re.scroller.options.bounceEasing);
                _re.loading = false;
                setCaption.apply(_re,[opts.down.contentdown, true]);
                setTimeout(function() {
                    _re.scroller.refresh();
                    _re.loading || _re.topPocket.css('visibility','hidden');
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
                    _re.scroller.refresh();
                } else {
                    setCaption.call(_re,opts.up.contentdown);
                    setTimeout(function() {
                        _re.scroller.refresh();
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