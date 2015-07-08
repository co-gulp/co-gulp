
##Radio##

	单选框组件可以将页面上指定节点内的radio定义为一个单选框对象，
	并提供选择状态变化时的回调事件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

$(selector).radio(callback);

*	返回值：单选框对象（多个时返回数组）

##组件构成##
* html+css
* js

###html+css###
	<div class="ui-content" id="baseradio">
		<div class="ui-content" id="baseradio">
            <h5 class="ui-content-padded">图标左对齐</h5>
            <div class="ui-card">
                <form class="ui-input-group">
                    <div class="ui-input-row ui-radio ui-left" >
                        <label>radio</label>
                        <input name="radio1" type="radio" value="0">
                    </div>
                    <div class="ui-input-row ui-radio ui-left">
                        <label>radio</label>
                        <input  name="radio1" type="radio" value="1" checked>
                    </div>
                    <div class="ui-input-row ui-radio ui-left" >
                        <label>disabled radio</label>
                        <input name="radio1" type="radio" value="2" disabled="disabled">
                    </div>
                </form>
            </div>
		</div>


###js###
		 domReady(function(require){
            $('#baseradio').radio(function(el,evt){
                    console($(el).val());
                });
        });

###回调事件参数###

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）