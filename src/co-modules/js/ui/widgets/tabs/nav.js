/**
 * @file 选项卡组件
 */

(function() {
    var CLASS_SLIDER_TAB = 'ui-slider-tab',
        CLASS_ACTIVE = 'ui-active',
        CLASS_SCROLL_WRAPPER = 'ui-scroll-wrapper',
        CLASS_SCROLL_PROGRESS_BAR = 'ui-slider-progress-bar',
        CLASS_SLIDER_GROUP = 'ui-slider-group';

    var SELECTOR_ACTIVE = '.'+CLASS_ACTIVE,
        SELECTOR_SLIDER_TAB = '.'+CLASS_SLIDER_TAB,
        SELECTOR_SCROLL_WRAPPER = '.'+CLASS_SCROLL_WRAPPER;
        SELECTOR_SLIDER_GROUP = '.'+CLASS_SLIDER_GROUP;
        SELECTOR_SLIDER_PROGRESS_BAR = '.'+CLASS_SCROLL_PROGRESS_BAR;

    var durationThreshold = 1000, // 时间大于1s就不算。
        horizontalDistanceThreshold = 30, // x方向必须大于30
        verticalDistanceThreshold = 70, // y方向上只要大于70就不算
        scrollSupressionThreshold = 30, //如果x方向移动大于这个直就禁掉滚动
        tabs = [],
        eventBinded = false,
        isFromTabs = function (target) {
            for (var i = tabs.length; i--;) {
                if ($.contains(tabs[i], target)) return true;
            }
            return false;
        };    

    var translateZ = ' translateZ(0)',
        cssPrefix = $.fx.cssPrefix;
    var _uid = 1,
        uid = function(){
            return _uid++;
        },
        idRE = /^#(.+)$/;

    var render = function(){
            var _tb = this, opts = _tb.opts, 
                content, items;

            _tb._tab =  _tb.ref.find(SELECTOR_SLIDER_TAB).first();
            _tb._content = _tb.ref.find(SELECTOR_SLIDER_GROUP).first();

            if(_tb._tab) {
                items = [];
                _tb._tab.children().each(function(){
                    var $a = $(this), href = $a?$a.attr('href'):_tb.callZ(this).attr('data-url'), id, $content;
                    id = idRE.test(href)? RegExp.$1: 'tabs_'+uid();
                    ($content = _tb.ref.find('#'+id) || $('<div id="'+id+'"></div>'))
                    items.push({
                        id: id,
                        href: href,
                        title: $a?$a.attr('href', 'javascript:;').text():_tb.callZ(this).text(),//如果href不删除的话，地址栏会出现，然后一会又消失。
                        content: $content
                    });
                });
                opts.items = items;
                opts.active = Math.max(0, Math.min(items.length-1, opts.active || _tb.callZ(SELECTOR_ACTIVE, _tb._tab).index()||0));
                getPanel.call(_tb).add(_tb._tab.children().eq(opts.active)).addClass(CLASS_ACTIVE);
            } 
            _tb._progressBar = _tb.ref.find(SELECTOR_SLIDER_PROGRESS_BAR)[0];
            if (_tb._progressBar) {
                opts.progressBarStyle = _tb._progressBar.style;
                opts.progressBarStyle.width = _tb._tab.children().eq(opts.active)[0].offsetWidth+'px';
                opts._progressBarWidth = _tb._progressBar.offsetWidth;
                opts.progressBarX = 0;
            }
            // fitToContent.call(_tb,getPanel.call(_tb));
        };

    var bind = function(){
            var _tb = this, opts = _tb.opts, handler = $.proxy(eventHandler, _tb);
            
            _tb._tab.on(_tb.touchEve(), handler).children().highlight('ui-state-hover');
            tabsSwipeEvents.call(_tb);
            _tb._content.on('tabsSwipeLeft tabsSwipeRight', $.proxy(eventHandler, _tb));
        };

    var tabsSwipeEvents =function() {
        var _tb = this, opts = _tb.opts;
        
        _tb._content.on('touchstart', function (e) {
            var point = e.touches ? e.touches[0] : e, start, stop;

            start = {
                x:point.clientX,
                y:point.clientY,
                time:Date.now(),
                el:$(e.target)
            }

            _tb._content.on('touchmove',function (e) {
                var point = e.touches ? e.touches[0] : e, xDelta;
                if (!start)return;
                stop = {
                    x:point.clientX,
                    y:point.clientY,
                    time:Date.now()
                }
                if ((xDelta = Math.abs(start.x - stop.x)) > scrollSupressionThreshold ||
                    xDelta > Math.abs(start.y - stop.y)) {
                    isFromTabs(e.target) && e.preventDefault();
                } else {//如果系统滚动开始了，就不触发swipe事件
                    _tb._content.off('touchmove touchend');
                }
            }).one('touchend', function () {
                    _tb._content.off('touchmove');
                    if (start && stop) {
                        if (stop.time - start.time < durationThreshold &&
                            Math.abs(start.x - stop.x) > horizontalDistanceThreshold &&
                            Math.abs(start.y - stop.y) < verticalDistanceThreshold) {
                            start.el.trigger(start.x > stop.x ? "tabsSwipeLeft" : "tabsSwipeRight");
                        }
                    }
                    start = stop = undefined;
                });
        });
    };    

    var getPanel = function(index){
            // var _tb = this, opts = _tb.opts; 
            // return $('#' + opts.items[index === undefined ? opts.active : index].id);
        };

    var fitToContent = function(div) {
            var _tb = this, opts = _tb.opts, $content = _tb._content;
            _tb._plus === undefined && (_tb._plus = parseFloat($content.css('border-top-width'))+parseFloat($content.css('border-bottom-width')))
            $content.height( div.height() + _tb._plus);
        };

    var eventHandler = function (e) {
            var _tb = this, opts = _tb.opts;
            if((match = $(e.target).closest('a', _tb._tab)) && match.length) {
                e.preventDefault();
                _tb.switchTo(match.index());
            }else{
                switch (e.type) {
                    case 'tabsSwipeLeft':
                    case 'tabsSwipeRight':
                        items = opts.items;
                        if (e.type == 'tabsSwipeLeft' && opts.active < items.length - 1) {
                            index = opts.active + 1;
                        } else if (e.type == 'tabsSwipeRight' && opts.active > 0) {
                            index = opts.active - 1;
                        }else{
                            break;
                        }
                        index !== undefined && (e.stopPropagation(), _tb.switchTo(index));
                        break;
                    default://tap
                        return _tb;
                }
            }
        };

    /**
     * 选项卡组件
     */
    define(function(require, exports, module) {
        var $ui = require("ui");
        var $tabs = $ui.define('TabBase',{

            /**
             * @property {Number} [active=0] 初始时哪个为选中状态，如果时setup模式，如果第2个li上加了ui-state-active样式时，active值为1
             * @namespace options
             */
            active: 0,

            speed: 400,

            /**
             * @property {Array} [items=null] 在render模式下需要必须设置 格式为\[{title:\'\', content:\'\', href:\'\'}\], href可以不设，可以用来设置ajax内容
             * @namespace options
             */
            items:null
         });
        
        //初始化
        $tabs.prototype.init = function () {
            var _tb = this, opts = _tb.opts;
            _tb.ref.addClass('ui-tabs');
            render.call(_tb);
            bind.call(_tb);
            require.async('scroll', function() {
                    _tb.ref.scroll({
                        hScroll: true,
                        vScroll: false,
                        hScrollbar: false,
                        vScrollbar: false
                });
            });
        };
        /**
         * 切换到某个Tab
         * @method switchTo
         * @param {Number} index Tab编号
         * @chainable
         * @return {self} 返回本身。
         */
        $tabs.prototype.switchTo = function(index) {
           var _tb = this, opts = _tb.opts, items = opts.items, eventData, to, from, reverse, endEvent;
            if(!_tb._buzy && opts.active != (index = Math.max(0, Math.min(items.length-1, index)))) {
                to = $.extend({}, items[index]);//copy it.
                to.div = getPanel.call(_tb,index);
                to.index = index;

                from = $.extend({}, items[opts.active]);
                from.div = getPanel.call(_tb);
                from.index = opts.active;

                var eventStatus = _tb.ref.trigger('beforeActivate',[to,from])
                if(!eventStatus) return _tb;

                _tb._content.children().removeClass(CLASS_ACTIVE);
                to.div.addClass(CLASS_ACTIVE);
                _tb._tab.children().removeClass(CLASS_ACTIVE).eq(to.index).addClass(CLASS_ACTIVE);
                opts.active = index;
                if(!items[opts.active].actived){
                    items[opts.active].actived = true;
                    _tb.ref.trigger('activate',[to,from]);
                    opts.iscroll = _tb.ref.find(SELECTOR_SCROLL_WRAPPER).length>0;
                }

                opts.iscroll&&$(window).trigger('resize');
                _tb.ref.trigger('afteractivate',[to,from]);
                fitToContent.call(_tb,to.div);
                _tb.updateTranslate(from.index,to.index);
                
            }
            return _tb;
        };

        $tabs.prototype.updateTranslate = function(from,to){
            var _tb = this, opts = _tb.opts;

            opts.progressBarX = opts.progressBarX + (to - from)*opts._progressBarWidth;
            opts.progressBarStyle.cssText += cssPrefix + 'transition-duration:' + opts.speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    opts.progressBarX + 'px, 0)' + translateZ + ';';
        }
        /**
         * 销毁组件
         * @method destroy
         */
        $tabs.prototype.destroy = function () {
           
        };
        //注册$插件
        $.fn.tab = function(opts) {
            var tabObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var tabObj = null;
                var id = this.getAttribute('data-tab');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++$ui.uuid;
                    tabObj = $ui.data[id] = new $tabs(opts);
                    this.setAttribute('data-tab', id);
                } else {
                    tabObj = $ui.data[id];
                }
                tabObjs.push(tabObj);
            });
            return tabObjs.length > 1 ? tabObjs : tabObjs[0];
        };

    });
})();