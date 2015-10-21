
# checkbox
***

	复选框组件

$(selector).checkbox(callback) 

*	返回值：复选框对象（多个时返回数组）

# 组件构成
* html+css
* js

# html+css
					<form class="ui-input-group">
                        <div class="ui-input-row ui-checkbox ui-left">
                            <label>left checkbox</label>
                            <input name="checkbox" type="checkbox" value="0">
                        </div>
                        <div class="ui-input-row ui-checkbox">
                            <label>right checkbox</label>
                            <input name="checkbox1" type="checkbox" checked>
                        </div>
                        <div id="discheck" class="ui-input-row ui-checkbox ui-left">
                            <label>disabled checkbox</label>
                            <input name="checkbox" type="checkbox" value="2" disabled="disabled">
                        </div>
                    </form>


# js
		domReady(function(require){
                $('.ui-input-group').checkbox(function(el,evt){
                       if(el.checked)  console.log($(el).val());
                    });
            });

## 回调事件参数

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）