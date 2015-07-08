
##select##

	下拉组件可以将页面上指定节点内的select定义为一个单选框对象，
	并提供选择状态变化时的回调事件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

$(selector).select(callback);

*	返回值：下拉对象（多个时返回数组）
##组件构成##
* html+css
* js

###html+css###
	<div class="ui-content" id="basesel">
        <div class="select uba bc-border bc-text" >
            <div class="text">请选择</div>
            <div class="icon"></div>
            <select selectedindex="0">
                <option value=0>选项一</option>
                <option value=1>选项二</option>
                <option value=2>选项三</option>
                <option value=3>选项四</option>
            </select>
        </div>
    </div>


###js###
		 domReady(function(require){
            $('#basesel').select(function(el,eve){
                    console.log(this.callZ(el).val());
                });
        });

###回调事件参数###

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）