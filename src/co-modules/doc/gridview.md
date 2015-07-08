
##Gridview##

	列表组件使开发者可以通过数据与模板创建各种复杂的列表控件

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	domReady(function(require){
		require("gridview");
		$(selector).gridview(options) 
	});

*	返回值：列表对象（多个时返回数组）

###options###
	配置对象--JSON
*	tpl
*	data
*	iscroll
*	callback

>####tpl####
>>*	ul
>>*	li

模板对象可通过配置ul、li达到不同的列表效果

tpl默认值：

			tpl : {
                    ul: '<ul class="'+CLASS_TABLE_VIEW+'" ></ul>',
                    li: '<li class="'+CLASS_TABLE_VIEW_CELL+'"><%=cont%></li>' 
                }

>###data###

数据对象，包含每行需要展示的数据。通过与模板结合达到各种展现效果，每项的key需要与模板中需要替换的一一对应

例：

			var data = [{
                			src:'css/assets/slider/image1.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		},{
                			src:'css/assets/slider/image2.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		},{
                			src:'css/assets/slider/image3.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		}];	

>###iscroll###

是否添加滚动效果 true/false
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
	<div class="ui-content" id="base">
			</div>

###js###
			var	tplLeft = '<li class="ui-table-view-cell ui-media">'+
								'<a href="javascript:;">'+
									'<img class="ui-media-object ui-pull-left" src="<%=src%>">'+
									'<div class="ui-media-body">'+
										'<%=cont%>'+
										'<p class="ui-ellipsis"><%=text%></p>'+
									'</div>'+
								'</a>'+
							'</li>';
				

				var data = [{
                			src:'css/assets/slider/image1.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		},{
                			src:'css/assets/slider/image2.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		},{
                			src:'css/assets/slider/image3.png',
                			cont:'标题',
                			text:'这里是描述信息'
                		}];			
                var view = $('#base').gridview({
                	tpl:{
                		li: tplLeft 
                	},
                	data:data
                });

##接口##
* renderData
* appendHtml
* appendData


##renderData##
	view.renderData(lis);

*	参数
	*	lis :数组对象，需要加载的数据
*	返回值：返回本身
*	说明：该方法会将传入的数据替换ul内原有的内容
###代码###
		$('#base').gridview({
                }).renderData(data);



##appendHtml##
view.appendHtml(html);
	
*	参数
	*	html :字符串对象，需要加载的html字符串
*	返回值：返回本身
*	说明：该方法会将传入的html片段拼接到列表的尾部
###代码###
		var customSTR = '<li class="ui-table-view-cell">'+
									'card（圆角列表）'+
									'<div id="M_Toggle" class="ui-switch ui-active">'+
										'<div class="ui-switch-handle"></div>'+
									'</div>'+
								'</li>'+
								'<li class="ui-table-view-cell">'+
									'Item 1'+
									'<button type="button" class="ui-btn">'+
										'Button'+
									'</button>'+
								'</li>'+
								'<li class="ui-table-view-cell">'+
									'Item 2'+
									'<button type="button" class="ui-btn ui-btn-primary">'+
										'Button'+
									'</button>'+
								'</li>'+
								'<li class="ui-table-view-cell">'+
									'Item 3'+
									'<div class="ui-switch ui-active">'+
										'<div class="ui-switch-handle"></div>'+
									'</div>'+
								'</li>'+
								'<li class="ui-table-view-cell">'+
									'Item 4'+
									'<div class="ui-switch ui-switch-blue ui-switch-mini ui-active">'+
										'<div class="ui-switch-handle"></div>'+
									'</div>'+
								'</li>';
		$('#base').gridview({
                }).appendHtml(customSTR);


##appendData##
view.appendData(html);
	
*	参数
	*	html :字符串对象，需要加载的html字符串
*	返回值：返回本身
*	说明：该方法会将传入的数据与模板组合后拼接到列表的尾部
###代码###
		$('#base').gridview({
                }).appendData(data);



