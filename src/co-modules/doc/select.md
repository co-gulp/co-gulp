
# select
***
	下拉组件


$(selector).select(callback);

*	返回值：下拉对象（多个时返回数组）
# 组件构成
* html+css
* js

# html+css
					<div class="ui-input-row">
                        <label>请选择</label>
                        <select>
                                <option value=0>选项一</option>
                                <option value=1>选项二</option>
                                <option value=2>选项三</option>
                                <option value=3>选项四</option>
                        </select>
                    </div>


# js
		 domReady(function(require){
            $('.ui-input-group').select(function(el,eve){
                    console.log($(el).val());
             }); 
        });

## 回调事件参数

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）