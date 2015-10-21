
# radio
***
	单选框组件

$(selector).radio(callback);

*	返回值：单选框对象（多个时返回数组）

# 组件构成
* html+css
* js

# html+css
					<form class="ui-input-group">
                        <div class="ui-input-row ui-radio ui-left" >
                            <label>radio</label>
                            <input name="radio1" type="radio" value="0">
                        </div>
                        <div class="ui-input-row ui-radio">
                            <label>radio</label>
                            <input  name="radio1" type="radio" value="1" checked>
                        </div>
                        <div class="ui-input-row ui-radio ui-left" >
                            <label>disabled radio</label>
                            <input name="radio1" type="radio" value="2" disabled="disabled">
                        </div>
                    </form>


# js
		 domReady(function(require){
            $('.ui-input-group').radio(function(el,evt){
                    console($(el).val());
                });
        });

## 回调事件参数

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）