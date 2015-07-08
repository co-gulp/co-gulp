
##Tabs##

	选项卡组件使开发者可以通过数据快速构建选项卡对象

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	 domReady(function(require){
	        require("tab");
			$(selector).tab(options) 
	 });

*	返回值：选项卡对象（多个时返回数组）

###options###
	配置对象--JSON
*	active


>###active###

*	初始时哪个为选中状态 
*	number 
*	默认值：0


##组件构成##
* html+css
* js

###html+css###
	<div class="ui-content" id = "tabs1">
        <nav class="ui-bar ui-bar-tab">
            <a class="ui-tab-item" href="#slider">
                <span class="ui-icon ui-icon-home"></span>
                <span class="ui-tab-label">首页</span>
            </a>
            <a class="ui-tab-item" href="#wrapper">
                <span class="ui-icon ui-icon-email"><span class="ui-badge">9</span></span>
                <span class="ui-tab-label">消息</span>
            </a>
            <a class="ui-tab-item" href="#contact">
                <span class="ui-icon ui-icon-contact"></span>
                <span class="ui-tab-label">通讯录</span>
            </a>
            <a class="ui-tab-item" href="#contor">
                <span class="ui-icon ui-icon-gear"></span>
                <span class="ui-tab-label">设置</span>
            </a>
        </nav>
            <div id="slider" class ="ui-control-content">
            </div>
            <div id="wrapper" class ="ui-control-content ui-wrapper">
            </div>
            <div id="contact" class ="ui-control-content ui-wrapper">
            </div>
            <div id="contor" class ="ui-control-content">
            </div>
        </div>

###js###
			domReady(function(require){
	        	require("tab");
                $('#tabs1').tab();
            });

##接口##
* switchTo


###switchTo###
	
*	参数
	*	to {number} 目标的序号
*	返回值：返回本身
*	说明：切换到第几个slide
###代码###
		$('#tabs1').tab().switchTo(number);
