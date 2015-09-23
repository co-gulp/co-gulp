/**
 * @file 列表组件
 */
(function() {
    var CLASS_ACTIVE = 'ui-active',
        CLASS_TABLE_VIEW_CELL = 'ui-table-view-cell',
        CLASS_COLLAPSE = 'ui-collapse',
        CLASS_TABLE_VIEW = 'ui-table-view',
        CLASS_NAVIGATE_RIGHT = 'ui-navigate-right',

        tarEl;

    var CLASS_SCROLL = 'ui-scroll';
    var CLASS_SCROLL_WRAPPER = 'ui-scroll-wrapper';

    var render = function() {
        var _tv = this,
            opts = _tv.opts;
        _tv._ul = _tv.ref.find('ul.' + CLASS_TABLE_VIEW);
        if (_tv._ul.length == 0) {
            _tv._ul = $(opts.tpl.ul).appendTo(_tv.ref);
        }
        _tv._lis = [];
        _tv.renderData(opts.data);
    };

    //绑定事件
    var bind = function() {
        var _tv = this,
            opts = _tv.opts,
            startY;
        _tv.ref.on(_tv.touchStart(), function(evt) {
            var touch = evt.touches[0];
            startY = touch.pageY;
            tarEl = false;
            var ele = $(evt.target).closest('li.' + CLASS_TABLE_VIEW_CELL);
            if ((!ele.hasClass(CLASS_COLLAPSE)) && ele.hasClass(CLASS_TABLE_VIEW_CELL)) {
                tarEl = ele;
                ele.addClass(CLASS_ACTIVE);
            }
        }).on(_tv.touchMove(), function(evt) {
            if (tarEl) {
                var touch = evt.touches[0];
                if (touch.pageY != startY) {
                    tarEl.removeClass(CLASS_ACTIVE);
                    tarEl = false;
                }
            }
        }).on(_tv.touchEve(), function(evt) {
            var ele = $(evt.target).closest('li.' + CLASS_TABLE_VIEW_CELL);
            if (!tarEl) {
                if ($(evt.target).hasClass('ui-navigate-right')&&ele.hasClass(CLASS_COLLAPSE)) {
                    if (!ele.hasClass(CLASS_ACTIVE)) { //展开时,需要收缩其他同类
                        var collapse = ele[0].parentNode.querySelector('.' + CLASS_COLLAPSE + '.' + CLASS_ACTIVE);
                        if (collapse) {
                            collapse.classList.remove(CLASS_ACTIVE);
                        }
                    }
                    ele.toggleClass(CLASS_ACTIVE);
                    if (opts.iscroll) {
                        $(window).trigger('resize');
                    }
                    if ($.isFunction(_tv.toggle)) {
                        _tv.toggle.apply(_tv, [ele[0], evt, ele.hasClass(CLASS_ACTIVE)]);
                    }
                }
            } else {
                tarEl.removeClass(CLASS_ACTIVE);
                if ($.isFunction(_tv.callback)) {
                    _tv.callback.apply(_tv, [tarEl[0], evt]);
                }
            }
        }).on(_tv.longTap(), function(evt) {
            if (tarEl) {
                tarEl.removeClass(CLASS_ACTIVE);
                tarEl = false;
            }
        }).on(_tv.touchCancel(), function(evt) {
            if (tarEl) {
                tarEl.removeClass(CLASS_ACTIVE);
                tarEl = false;
            }
        })
    };

    define(function(require, exports, module) {
        var $ui = require("ui");
        //treeview
        var $treeview = $ui.define('Treeview', {
            /**
             * 模板對象
             * @type {function}
             */
            tpl: {
                ul: '<ul class="' + CLASS_TABLE_VIEW + '" ></ul>',
                li: '<li class="' + CLASS_TABLE_VIEW_CELL + '" data-ui-li = <%=i%> tar = <%=tar%>>' +
                    '<a class="' + CLASS_NAVIGATE_RIGHT + '" javascript:;><%=cont%></a></li>',
                muli: '<li class="' + CLASS_TABLE_VIEW_CELL + '" data-ui-li = <%=i%>>' +
                    '<a class="' + CLASS_NAVIGATE_RIGHT + '"><%=cont%></a></li>'
            },
            /**
             * 渲染數據
             */
            data: [],
            iscroll: false,
            /**
             * 点击回调函数
             * @type {function}
             */
            toggle: function() {}

        });

        //初始化
        $treeview.prototype.init = function() {
            var _tv = this,
                opts = _tv.opts;
            _tv.toggle = opts.toggle;
            render.call(this);
            bind.call(this);
            if (opts.iscroll) {
                _tv.ref.addClass(CLASS_SCROLL_WRAPPER);
                _tv.ref.children().wrapAll('<div class = "' + CLASS_SCROLL + '"/>');
                require.async('scroll', function() {
                    _tv.ref.scroll({
                        scrollbars: false,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: true
                    });
                });
            }
        };

        /**
         * 根據傳入數據渲染
         * @type {function}
         * lis -> array
         */
        $treeview.prototype.renderData = function(lis) {
            var _tv = this,
                opts = _tv.opts;

            if ($.isArray(lis)) {
                var _lis = [],
                    _mulis = [];
                //_tv._ul.empty();
                _tv._parseFn || (_tv._parseFn = _tv.parseTpl(opts.tpl.li));
                if (lis.length > 0) {
                    $.each(lis, function(index, item) {
                        item.i = index + 1;
                        item.tar || (item.tar = "#");
                        if (item.contents && ($.isArray(item.contents))) {
                            _tv._muliparseFn || (_tv._muliparseFn = _tv.parseTpl(opts.tpl.muli));
                            _lis[index] = _tv._muliparseFn(item);
                            var mulis = [];
                            $.each(item.contents, function(i, el) {
                                el.i = i + 1;
                                el.tar || (el.tar = "#");
                                mulis[i] = _tv._parseFn(el);
                            })
                            _mulis.push({
                                index: index,
                                mulis: mulis
                            });
                        } else {
                            _lis[index] = _tv._parseFn(item);
                        }
                    })
                    _tv._lis = $(_lis.join('')).appendTo(_tv._ul);
                    $.each(_mulis, function(index, item) {
                        if (item.mulis && ($.isArray(item.mulis))) {
                            var tarli = _tv._lis[item.index];
                            $(tarli).addClass(CLASS_COLLAPSE);
                            var tardiv = $('<div></div>').appendTo(tarli);
                            var tarul = $(opts.tpl.ul).appendTo(tardiv);
                            var tarlis = $(item.mulis.join('')).appendTo(tarul)
                            _tv._lis = $(_tv._lis.concat(tarlis));
                        }
                    });
                    _tv._lis.attr('data-ui-tli', true);
                }
            }
            if (opts.iscroll) {
                $(window).trigger('resize');
            }

        };


        //注册$插件
        $.fn.treeview = function(opts) {
            var treeviewObjs = [];
            opts || (opts = {});
            this.each(function() {
                var treeviewObj = null;
                var id = this.getAttribute('data-treeview');
                if (!id) {
                    opts = $.extend(opts, {
                        ref: this
                    });
                    id = ++$ui.uuid;
                    treeviewObj = $ui.data[id] = new $treeview(opts);
                    this.setAttribute('data-treeview', id);
                } else {
                    treeviewObj = $ui.data[id];
                }
                treeviewObjs.push(treeviewObj);
            });
            return treeviewObjs.length > 1 ? treeviewObjs : treeviewObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();