/**
 * @file 图片轮播组件
 */
(function() {
    var CLASS_STATE_ACTIVE = 'ui-state-active';
        CLASS_SLIDER_GROUP = 'ui-slider-group' ,
        CLASS_SWIPE_ITEM = 'ui-swipe-item' ;

        /**
         * @property {Object}  容器的选择器
         */
    var SELECTOR_SLIDER_GROUP = '.'+CLASS_SLIDER_GROUP;  
    var loading = '<div class="ui-loading">'+
                    '<div class="ui-spinner">'+
                    '</div>'+
                  '</div>'

    // todo 检测3d是否支持。
    var transitionEnd,translateZ = ' translateZ(0)';

    var render = function() {
            var _sl = this, opts = _sl.opts,
                viewNum = opts.viewNum || 1,
                items,
                container;
            _sl.loading = $(loading).appendTo(_sl.ref);
            _sl.index = opts.index,
            // 检测容器节点是否指定
            container = _sl.ref.find( SELECTOR_SLIDER_GROUP );

            _sl.length = container.children().length;

            _sl._items = (_sl._container = container)
                    .children()
                    .toArray();
            _sl._items[_sl.index].setAttribute( 'actived', true );
            _sl.ref.trigger('donedom');
            initWidth.call(_sl);
        };

    var bind = function(){
            var _sl = this, opts = _sl.opts;
            _sl.ref.on( 'slideend', $.proxy(handleEvent, _sl))
                   .on( 'touchstart', $.proxy(handleEvent, _sl))
                   .on( 'touchend', $.proxy(handleEvent, _sl))
                   .on( 'slide', function(evt,to,from) {

                    })
            _sl._container.on( transitionEnd,
                    $.proxy(tansitionEnd, _sl ) );
    };    

    var handleEvent = function(evt) {
            var _sl = this, opts = _sl.opts;
            // if (element.classList.contains(CLASS_DISABLED)) {
            //     return;
            // }
            switch (evt.type) {
                case 'touchstart':
                    _sl.stop();
                    break;
                case 'touchend':
                case 'touchcancel':
                case 'slideend':
                    !_sl._items[_sl.index].getAttribute( 'actived' )&&_sl._items[_sl.index].setAttribute( 'actived', true );
                    break;
            }
        }; 

    var initWidth = function() {
            var _sl = this, opts = _sl.opts,width;

            // width没有变化不需要重排
            if ( (width = _sl.ref.width()) === _sl.width ) {
                return;
            }
            _sl.width = width;
            _sl.arrange();
            _sl._container.css('display','block');
            _sl.ref.trigger('hiChange');
            _sl.loading.remove();
    };


    var tansitionEnd = function( evt ) {
             var _sl = this, opts = _sl.opts;
            // ~~用来类型转换，等价于parseInt( str, 10 );
            var ele = evt.target;
            if($(ele).hasClass(CLASS_SWIPE_ITEM)){
                if ( ~~ele.getAttribute( 'data-index' ) !== _sl.index ) {
                    return;
                }
                _sl.ref.trigger('slideend', [_sl.index]);
            }
        }; 

 
    
    /**
     * 图片轮播组件
     */
    define(function(require, exports, module) {
        var $ui = require("ui"),
            cssPrefix = $.fx.cssPrefix;
            transitionEnd = $.fx.transitionEnd;
        var $swipepage = $ui.define('Swipepage',{
                
                /**
                 * @property {Number} [speed=400] 动画执行速度
                 * @namespace options
                 */
                speed: 100,

                /**
                 * @property {Number} [index=0] 初始位置
                 * @namespace options
                 */
                index: 0,
                /**
                 * @property {Number} [itemHeight=500] 
                 * @namespace options
                 */
                itemHeight:500

        }); 
        //初始化
        $swipepage.prototype.init = function() {
            var _sl = this,opts = _sl.opts;
            // 初始dom结构
            render.call(_sl);
            //绑定事件
            bind.call(_sl);

            //加載觸摸按鈕
            require.async('sTouch', function(st) {
                st.call(_sl);
            });
        };



    // 重排items
    $swipepage.prototype.arrange = function() {
            var _sl = this, opts = _sl.opts,
                items = _sl._items,
                i = 0,item,len;

            _sl._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];

                item.style.cssText += 'width:' + _sl.width + 'px;' +'height:' + opts.itemHeight + 'px;' +
                        'left:' + (i * -_sl.width) + 'px;';
                item.setAttribute( 'data-index', i );

                _sl.move( i, i < _sl.index ? -_sl.width : i > _sl.index ? _sl.width : 0, 0 );
            }

            _sl._container.css( 'width', _sl.width * len );
        };

        /**
         * 停止自动播放
         * @method stop
         * @chainable
         * @return {self} 返回本身
         * @for swipepage
         * @uses swipepage.autoplay
         */
        $swipepage.prototype.stop = function() {
            var _sl = this;
            if ( _sl._timer ) {
                clearTimeout( _sl._timer );
                _sl._timer = null;
            }
            return _sl;
        };

        
        /**
         * 切换到下一个slide
         * @method next
         * @chainable
         * @return {self} 返回本身
         */
        $swipepage.prototype.next = function() {
            var _sl = this, opts = _sl.opts;
            if (_sl.index + 1 < _sl.length ) {
                _sl.slideTo( _sl.index + 1 );
            }

            return _sl;
        };
         /**
         * 切换到上一个slide
         * @method prev
         * @chainable
         * @return {self} 返回本身
         */
        $swipepage.prototype.prev = function() {
            var _sl = this, opts = _sl.opts;
            if (_sl.index > 0 ) {
                _sl.slideTo( _sl.index - 1 );
            }

            return _sl;
        };

        

        $swipepage.prototype.move = function( index, dist, speed, immediate ) {
            var _sl = this, opts = _sl.opts,
                slidePos = _sl._slidePos,
                items = _sl._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            _sl.translate( index, dist, speed );
            slidePos[ index ] = dist;    // 记录目标位置

            // 强制一个reflow
            immediate && items[ index ].clientLeft;
        };

        $swipepage.prototype.translate = function( index, dist, speed ) {
            var _sl = this, opts = _sl.opts,
                slide = _sl._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    dist + 'px, 0)' + translateZ + ';';
        };

        $swipepage.prototype.circle = function( index, arr ) {
            var _sl = this, opts = _sl.opts, len;

            arr = arr || _sl._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        };

        $swipepage.prototype.slide = function( from, diff, dir, width, speed, opts ) {
             var _sl = this, to, opts = _sl.opts;

            to = _sl.circle( from - dir * diff );

            dir = Math.abs( from - to ) / (from - to);
            
            // 调整初始位置，如果已经在位置上不会重复处理
            _sl.move( to, -dir * width, 0, true );

            _sl.move( from, width * dir, speed );
            _sl.move( to, 0, speed );

            _sl.index = to;
            _sl.ref.trigger('slide', [to,from]);
            return _sl;
        };

        /**
         * 切换到第几个slide
         */
        $swipepage.prototype.slideTo = function( to, speed ) {
            var _sl = this, opts = _sl.opts;
            if ( _sl.index === to || _sl.index === _sl.circle( to ) ) {
                return this;
            }

            var index = _sl.index,
                diff = Math.abs( index - to ),
                
                // 1向左，-1向右
                dir = diff / (index - to),
                width = _sl.width;

            speed = speed || opts.speed;

            return _sl.slide( index, diff, dir, width, speed, opts );
        };

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        $swipepage.prototype.getIndex = function() {
            return this.index;
        };

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        $swipepage.prototype.getItem = function(index) {
            return this._items[index];
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $swipepage.prototype.destroy = function() {
            
        };

        //注册$插件
        $.fn.swipepage = function(opts) {
            var swipepageObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var swipepageObj = null;
                var id = this.getAttribute('data-swipepage');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++$ui.uuid;
                    swipepageObj = $ui.data[id] = new $swipepage(opts);
                    this.setAttribute('data-swipepage', id);
                } else {
                    swipepageObj = $ui.data[id];
                }
                swipepageObjs.push(swipepageObj);
            });
            return swipepageObjs.length > 1 ? swipepageObjs : swipepageObjs[0];
        };

    });

})();