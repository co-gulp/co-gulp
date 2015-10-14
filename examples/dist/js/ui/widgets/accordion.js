/**
 * @file accordion 组件
 */
(function() {
    var CLASS_ACCORDION_ITEM = 'accordion-item',
        CLASS_ACCORDION_ITEM_EXPANDED = 'accordion-item-expanded',
        CLASS_ACCORDION_ITEM_LINK = 'accordion-item-link',
        CLASS_ACCORDION_LIST = 'accordion-list',
        CLASS_ACCORDION_ITEM_CONTENT = 'accordion-item-content';

    var SELECTOR_ACCORDION_ITEM = '.' + CLASS_ACCORDION_ITEM,
        SELECTOR_ACCORDION_ITEM_EXPANDED = '.' + CLASS_ACCORDION_ITEM_EXPANDED,
        SELECTOR_ACCORDION_ITEM_LINK = '.' + CLASS_ACCORDION_ITEM_LINK,
        SELECTOR_ACCORDION_LIST = '.' + CLASS_ACCORDION_LIST,
        SELECTOR_ACCORDION_ITEM_CONTENT = '.' + CLASS_ACCORDION_ITEM_CONTENT;

    var render = function() {
        var _acd = this,
            opts = _acd.opts;
        opts.autoExpanded && _acd.ref.find(SELECTOR_ACCORDION_ITEM).addClass(CLASS_ACCORDION_ITEM_EXPANDED);
    };

    //绑定事件
    var bind = function() {
        var _acd = this,
            opts = _acd.opts;
        _acd.ref.find(SELECTOR_ACCORDION_ITEM_LINK).on(_acd.touchEve(), function(evt) {
            var clicked = $(evt.currentTarget);
            var accordionItem = clicked.parent(SELECTOR_ACCORDION_ITEM);
            if (accordionItem.length === 0) accordionItem = clicked.parents(SELECTOR_ACCORDION_ITEM);
            if (accordionItem.length === 0) accordionItem = clicked.parents('li');
            _acd.accordionToggle(accordionItem);
        })
    };

    define(function(require, exports, module) {
        var $ui = require("ui");
        //accordion
        var $accordion = $ui.define('Accordion', {
            autoExpanded: false,
            toggleClose: true
        });

        //初始化
        $accordion.prototype.init = function() {
            var _acd = this;
            render.call(this);
            bind.call(this);

        };

        $accordion.prototype.accordionToggle = function(item) {
            var _acd = this,
                item = $(item);
            if (item.length === 0) return;
            if (item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)) _acd.accordionClose(item);
            else _acd.accordionOpen(item);
        };

        $accordion.prototype.accordionOpen = function(item) {
            var _acd = this,
                item = $(item);
            var list = item.parents(SELECTOR_ACCORDION_LIST).eq(0);
            var content = item.children(SELECTOR_ACCORDION_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_ITEM_CONTENT);
            var expandedItem = list.length > 0 && item.parent().children(SELECTOR_ACCORDION_ITEM_EXPANDED);
            if (expandedItem.length > 0) {
                opts.toggleClose && _acd.accordionClose(expandedItem);
                _acd.ref.trigger('toggle', [item, item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)]);
            }
            content.css('height', content[0].scrollHeight + 'px').transitionEnd(function() {
                if (item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)) {
                    content.transition(0);
                    content.css('height', 'auto');
                    var clientLeft = content[0].clientLeft;
                    content.transition('');
                    item.trigger('opened');
                } else {
                    content.css('height', '');
                    item.trigger('closed');
                }
            });
            item.trigger('open');
            item.addClass(CLASS_ACCORDION_ITEM_EXPANDED);
        };

        $accordion.prototype.accordionClose = function(item) {
            var _acd = this,
                item = $(item);
            var content = item.children(SELECTOR_ACCORDION_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_ITEM_CONTENT);
            item.removeClass(CLASS_ACCORDION_ITEM_EXPANDED);
            content.transition(0);
            content.css('height', content[0].scrollHeight + 'px');
            // Relayout
            var clientLeft = content[0].clientLeft;
            // Close
            content.transition('');
            content.css('height', '').transitionEnd(function() {
                if (item.hasClass(CLASS_ACCORDION_ITEM_EXPANDED)) {
                    content.transition(0);
                    content.css('height', 'auto');
                    var clientLeft = content[0].clientLeft;
                    content.transition('');
                    item.trigger('opened');
                } else {
                    content.css('height', '');
                    item.trigger('closed');
                }
            });
            item.trigger('close');
        };


        //注册$插件
        $.fn.accordion = function(opts) {
            var accordionObjs = [];
            opts || (opts = {});
            this.each(function() {
                var accordionObj = null;
                var id = this.getAttribute('data-accordion');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
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