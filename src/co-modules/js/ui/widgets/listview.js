/**
 * @file 列表组件
 */
(function() {
        var CLASS_SCROLL = 'ui-scroll';
        
        var render = function(){
        };

         //绑定事件
        var bind = function(){
            

        };

        var bingSwipe = function(swipe){
            var _gv = this,opts = _gv.opts;
            var swipeouts = _gv.ref.find('.swipeout');
            if(swipeouts.length>0){
                swipe.initSwipe(_gv.ref);
                swipeouts.find('.swipeout-delete').on(_gv.touchEve(),function(evt){
                   var tar = $(this);
                   swipe.swipeDelete(tar.parents('.swipeout'));
                });
                swipeouts.on('delete',function(e){
                    // return false;
                })
            }
        }

    define(function(require, exports, module) {
        var $ui = require("ui");

        //listview
        var $listview = $ui.define('Listview',{
            iscroll:false
        });

        //初始化
        $listview.prototype.init = function(){
            var _gv = this,opts = _gv.opts;
            render.call(_gv);
            bind.call(_gv);
            if(opts.iscroll){
                require.async('scroll', function() {
                    _gv.ref.children().wrapAll('<div class = "'+CLASS_SCROLL+'"/>');
                    _gv.ref.scroll({
                            scrollbars: false,
                            interactiveScrollbars: true,
                            shrinkScrollbars: 'scale',
                            fadeScrollbars: true
                    });
                });
            }
            require.async('swipeout', function(swipe) {
                bingSwipe.call(_gv,swipe);
            });
        };

         //删除
        $listview.prototype.swipeDelete = function(el, callback){
            var _gv = this,opts = _gv.opts;
            _gv.swipe.swipeDelete(el, callback);
            return _gv;
        };
        //注册$插件
        $.fn.listview = function (opts) {
            var listviewObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var listviewObj = null;
                var id = this.getAttribute('data-listview');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++$ui.uuid;
                    listviewObj = $ui.data[id] = new $listview(opts);
                    this.setAttribute('data-listview', id);
                } else {
                    listviewObj = $ui.data[id];
                }
                listviewObjs.push(listviewObj);
            });
            return listviewObjs.length > 1 ? listviewObjs : listviewObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();