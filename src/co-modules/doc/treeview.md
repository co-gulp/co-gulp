
##Treeview##

	树形列表组件使开发者可以通过数据与模板创建各种复杂的列表控件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	domReady(function(require){
	   		require("treeview");
			$(selector).treeview(options);
	});

*	返回值：树形列表对象(多个时返回数组)

###options###
	配置对象--JSON
*	tpl
*	data
*	iscroll
*	toggle
*	callback

>####tpl####
>>*	ul
>>*	li

模板对象可通过配置ul、li、muli达到不同的列表效果

tpl默认值：

			tpl : {
                    ul: '<ul class="'+CLASS_TABLE_VIEW+'  '+CLASS_TABLE_VIEW_CHEVRON+'" ></ul>',
                    li: '<li class="'+CLASS_TABLE_VIEW_CELL+'" data-ui-li = <%=i%> tar = <%=tar%>>'+
                        '<a class="'+CLASS_NAVIGATE_RIGHT+'" javascript:;><%=cont%></a></li>' ,
                    muli: '<li class="'+CLASS_TABLE_VIEW_CELL+'" data-ui-li = <%=i%>>'+
                        '<a class="'+CLASS_NAVIGATE_RIGHT+'"><%=cont%></a></li>' 
                }

>###data###

数据对象，包含每行需要展示的数据。通过与模板结合达到各种展现效果，每项的key需要与模板中需要替换的一一对应

例：

			var data = [{
						    cont : "按钮",
						    name : "control"
					    }, {
						    cont : "树列表",
						    contents : [{
							    cont : '多选框',
							    name : "listview",
							    tar : "checkbox.html"
						    },{
							    cont : '弹出框',
							    name : "listview",
							    tar : "dialog.html"
							}]
						}, {
						    cont : "树列表",
						    contents : [{
							    cont : "按钮",
							    name : "control",
							    tar : "button.html"
						    }]
						}]	

>###iscroll###

是否添加滚动效果 true/false
>###toggle###

展开收缩树形列表回调事件 
			
			toggle:function(el,evt,isActive){
   						console(isActive)
   					}
*	参数
	*	el :点击的对象
	*	evt：事件对象
	*	isActive 是否展开  true/false

>###callback###

点击回调事件 
			
	callback：function(el,evt){
		
			}
*	参数
	*	el :点击的对象
	*	evt：事件对象

##组件构成##
* html+css
* js

###html+css###
	<div class="ui-content" id='treeview'>
				
		</div>

###js###
			domReady(function(require){
	   			require("treeview");
   				$('#treeview').treeview({
   					callback:function(el,evt){
   						console(el.innerHTML)
   					},
   					toggle:function(el,evt,isActive){
   						console(el.innerHTML)
   					},
                	data:data
                });
   			})

##接口##
* renderData


##renderData##
	view.renderData(lis);

*	参数
	*	lis :数组对象，需要加载的数据
*	返回值：返回本身
*	说明：该方法会将传入的数据替换ul内原有的内容
###代码###
		$('#base').gridview({
                }).renderData(data);





