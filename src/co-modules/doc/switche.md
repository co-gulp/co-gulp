
##Switche##

	开关组件可以将页面上指定节点定义为一个开关对象，并提供状态变化时的回调事件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	domReady(function(require){
		require("switch");
		$(selector).switche(options) 
	});

*	返回值：开关对象（多个时返回数组）

##组件构成##
* html+css
* js

###html+css###
		<div class="ui-content">
			<ul class="ui-table-view">
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-active">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-mini ui-active ">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-mini">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-blue ui-active">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-blue">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-blue ui-switch-mini ui-active">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
				<li class="ui-table-view-cell">
					<span></span>
					<div class="ui-switch ui-switch-blue ui-switch-mini">
						<div class="ui-switch-handle"></div>
					</div>
				</li>
			</ul>
		</div>


###js###
		 domReady(function(require){
				require("switch");
			 	$('.ui-content .ui-switch').switch({
                    callback:function(el,event,isActive){
                        el.parentNode.querySelector('span').innerText = '状态：' + ( isActive? 'true' : 'false');
                    }
                });
        	});

###回调事件参数###

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（toggle）
*	isActive :选中状态 true/false

##接口##
*	toggle

###toggle###
	
	
*	返回值：返回本身
*	说明：切换状态
###代码###
		$('.ui-content .ui-switch').switch()[0].toggle();
		$('#switch').switch().toggle();