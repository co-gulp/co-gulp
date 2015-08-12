/**
 * iscroll组件
 */
(function() {
      // 给$.fn上挂iScroll方法
    define(function(require, exports, module) {
         var $ui = require("ui");
                  require("iscroll");

        //注册$插件
       $.fn.scroll = function( opts ) {

            var scrollObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var scrollObj = null;
                var self = this;
                var id = self.getAttribute('data-scroll');
                if (!id) {
                    opts = $.extend(opts, { disableMouse : true,disablePointer:true});
                    id = ++$ui.uuid;
                    scrollObj = $ui.data[id] = new IScroll(self, opts);
                    // scrollObj.on('scrollStart', function () {
                    //         console.log('scrollStart x--> '+this.x);
                    //         console.log('scrollStart y--> '+this.y);
                    // });
                    // scrollObj.on('scrollEnd', function () {
                    //         console.log('scrollEnd x--> '+this.x);
                    //         console.log('scrollEnd y--> '+this.y);
                    // });
                    self.setAttribute('data-scroll', id);
                } else {
                    scrollObj = $ui.data[id];
                }
                scrollObjs.push(scrollObj);
            });
            return scrollObjs.length === 1 ? scrollObjs[0] : scrollObjs;
        };
    });
})();
