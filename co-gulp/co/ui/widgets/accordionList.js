/**
 * @file accordion-list 组件
 */
(function() {
    var CLASS_ACCORDION_LIST = 'ui-accordion-list',
        CLASS_ACCORDION_LIST_ITEM = 'ui-accordion-list-item',
        CLASS_ACCORDION_LIST_ITEM_EXPANDED = 'ui-accordion-list-item-expanded',
        CLASS_ACCORDION_LIST_ITEM_LINK = 'ui-accordion-list-item-link',
        CLASS_ACCORDION_LIST_ITEM_CONTENT = 'ui-accordion-list-item-content',
        CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED = 'ui-accordion-list-item-link-expanded',
        CLASS_ACTIVE = 'ui-active';

    var SELECTOR_ACCORDION_LIST_ITEM = '.' + CLASS_ACCORDION_LIST_ITEM,
        SELECTOR_ACCORDION_LIST_ITEM_EXPANDED = '.' + CLASS_ACCORDION_LIST_ITEM_EXPANDED,
        SELECTOR_ACCORDION_LIST_ITEM_LINK = '.' + CLASS_ACCORDION_LIST_ITEM_LINK,
        SELECTOR_ACCORDION_LIST = '.' + CLASS_ACCORDION_LIST,
        SELECTOR_ACCORDION_LIST_ITEM_CONTENT = '.' + CLASS_ACCORDION_LIST_ITEM_CONTENT;

    var render = function() {
        var _acd = this,
            opts = _acd.opts;
        // opts.autoExpanded && _acd.ref.find(SELECTOR_ACCORDION_LIST_ITEM).addClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED);
    };

    //绑定事件
    var bind = function() {
        var _acd = this,
            opts = _acd.opts;
        _acd.ref.find(SELECTOR_ACCORDION_LIST_ITEM_LINK).on(_acd.touchEve(), function(evt) {
            var clicked = $(evt.currentTarget);
            var accordionItem = clicked.parent(SELECTOR_ACCORDION_LIST_ITEM);
            if (accordionItem.length === 0) accordionItem = clicked.parents(SELECTOR_ACCORDION_LIST_ITEM);
            if (accordionItem.length === 0) accordionItem = clicked.parents('li');
            _acd.accordionToggle(accordionItem);
        })
    };

    define(function(require, exports, module) {
        var $ui = require("ui");
        //accordionList
        var $accordionList = $ui.define('AccordionList', {
            toggleClose: true
        });

        //初始化
        $accordionList.prototype.init = function() {
            var _acd = this;
            render.call(this);
            bind.call(this);

        };

        $accordionList.prototype.accordionToggle = function(item) {
            var _acd = this,
                item = $(item);
            if (item.length === 0) return;
            if (item.hasClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)) _acd.accordionClose(item);
            else _acd.accordionOpen(item);
        };

        $accordionList.prototype.accordionOpen = function(item) {
            var _acd = this,
                opts = _acd.opts,
                item = $(item);
            var list = item.parents(SELECTOR_ACCORDION_LIST).eq(0);
            var content = item.children(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            var expandedItem = list.length > 0 && item.parent().children(SELECTOR_ACCORDION_LIST_ITEM_EXPANDED);
            if (content.length === 0) {
                _acd.ref.trigger('tapped', [item]);
                return;
            }
            if (expandedItem.length > 0) {
                opts.toggleClose && _acd.accordionClose(expandedItem);
                _acd.ref.trigger('toggle', [item, item.hasClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)]);
            };
            content.css('height', content[0].scrollHeight + 'px').transitionEnd(function() {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                _acd.ref.trigger('opened',[item]);
            });
            _acd.ref.trigger('open',[item]);
            item.addClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)
            $(item.children()[0]).addClass(CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED).addClass(CLASS_ACTIVE);
        };

        $accordionList.prototype.accordionClose = function(item) {
            var _acd = this,
                item = $(item);
            var content = item.children(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            if (content.length === 0) content = item.find(SELECTOR_ACCORDION_LIST_ITEM_CONTENT);
            item.removeClass(CLASS_ACCORDION_LIST_ITEM_EXPANDED)
            $(item.children()[0]).removeClass(CLASS_ACCORDION_LIST_ITEM_LINK_EXPANDED).removeClass(CLASS_ACTIVE);
            content.transition(0);
            content.css('height', content[0].scrollHeight + 'px');
            // Relayout
            
            // Close
            content.transition('');
            content.css('height', '').transitionEnd(function() {
                content.css('height', '');
                item.trigger('closed');
            });
            item.trigger('close');
        };


        //注册$插件
        $.fn.accordionList = function(opts) {
            var accordionListObjs = [];
            opts || (opts = {});
            this.each(function() {
                var accordionListObj = null;
                var id = this.getAttribute('data-accordionList');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    accordionListObj = $ui.data[id] = new $accordionList(opts);
                    this.setAttribute('data-accordionList', id);
                } else {
                    accordionListObj = $ui.data[id];
                }
                accordionListObjs.push(accordionListObj);
            });
            return accordionListObjs.length > 1 ? accordionListObjs : accordionListObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();