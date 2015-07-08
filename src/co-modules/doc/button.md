
##button##

	按钮组件可以将页面上任意节点定义为一个按钮对象，并提供点击回调事件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

$(selector).button(callback) 

*	返回值：button对象（多个时返回数组）

##组件构成##
* html+css
* js

###html+css###
	<button type="button" class="ui-btn ui-btn-primary ui-btn-outlined">
         操作
    </button>
    <div class="ui-btn ui-btn-primary" id="basebtn">
         操作
    </div>
    <span class="ui-btn ui-btn-success" id="success">
         操作          
    </span>
>更多按钮示例参见[Buttons](http://www.bootcss.com/p/buttons/)，下载[地址](https://github.com/alexwolfe/Buttons.git)

###js###
	 domReady(function(require){
            $('button.ui-btn').button(function(el,evt){
                
            })
            $('#basebtn').button(function(el,evt){
                    alert(el.innerHTML);
                });
			 $('#success').button(function(el,evt){
                    alert(el.innerHTML);
                });
        });

###回调事件参数###

*	el ： 按钮定义对象（dom对象）
*	evt ： 事件对象（tab）