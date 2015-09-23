/**
 * @file 列表组件
 */
(function() {
      
        var render = function(){
           
        };

         //绑定事件
        var bind = function(){
            var _acd = this,opts = _acd.opts;
            _acd.ref.find('.accordion-item-link').on(_acd.touchEve() , function(evt) {
                var clicked = $(evt.currentTarget);
                var accordionItem = clicked.parent('.accordion-item');
                if (accordionItem.length === 0) accordionItem = clicked.parents('.accordion-item');
                if (accordionItem.length === 0) accordionItem = clicked.parents('li');
                _acd.accordionToggle(accordionItem);
            })
        };

        var accordionToggle = function(value) {
            var _dog = this, setter = value!==undefined;
            value = '<h3>'+value+'</h3>';
            setter && _dog._title.html(value).prependTo(_dog._wrap);
        };

    define(function(require, exports, module) {
        var $ui = require("ui");
        //accordion
        var $accordion = $ui.define('Accordion',{});

        //初始化
        $accordion.prototype.init = function(){
            var _acd = this;
            render.call(this);
            bind.call(this);
           
        };

        $accordion.prototype.accordionToggle = function(item){
            var _acd = this,item = $(item);
            if (item.length === 0) return;
            if (item.hasClass('accordion-item-expanded')) _acd.accordionClose(item);
            else _acd.accordionOpen(item);
        };

        $accordion.prototype.accordionOpen = function(item){
            var _acd = this,item = $(item);
            var list = item.parents('.accordion-list').eq(0);
            var content = item.children('.accordion-item-content');
            if (content.length === 0) content = item.find('.accordion-item-content');
            var expandedItem = list.length > 0 && item.parent().children('.accordion-item-expanded');
            if (expandedItem.length > 0) {
                _acd.accordionClose(expandedItem);
            }
            content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
                if (item.hasClass('accordion-item-expanded')) {
                    content.transition(0);
                    content.css('height', 'auto');
                    var clientLeft = content[0].clientLeft;
                    content.transition('');
                    item.trigger('opened');
                }
                else {
                    content.css('height', '');
                    item.trigger('closed');
                }
            });
            item.trigger('open');
            item.addClass('accordion-item-expanded');
        };

        $accordion.prototype.accordionClose = function(item){
            var _acd = this,item = $(item);
            var content = item.children('.accordion-item-content');
            if (content.length === 0) content = item.find('.accordion-item-content');
            item.removeClass('accordion-item-expanded');
            content.transition(0);
            content.css('height', content[0].scrollHeight + 'px');
            // Relayout
            var clientLeft = content[0].clientLeft;
            // Close
            content.transition('');
            content.css('height', '').transitionEnd(function () {
                if (item.hasClass('accordion-item-expanded')) {
                    content.transition(0);
                    content.css('height', 'auto');
                    var clientLeft = content[0].clientLeft;
                    content.transition('');
                    item.trigger('opened');
                }
                else {
                    content.css('height', '');
                    item.trigger('closed');
                }
            });
            item.trigger('close');
        };


        //注册$插件
        $.fn.accordion = function (opts) {
            var accordionObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var accordionObj = null;
                var id = this.getAttribute('data-accordion');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++$ui.uuid;
                    accordionObj = $ui.data[id] = new $accordion(opts);
                    this.setAttribute('data-accordion', id);
                } else {
                    accordionObj = $ui.data[id];
                }
                accordionObjs.push(accordionObj);
            });
            return accordionObjs.length > 1 ? accordionObjs : accordionObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();