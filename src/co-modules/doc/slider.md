
##Slider##

	轮播图组件使开发者可以通过数据快速构建轮播图对象

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	domReady(function(require){
	        require("slider");
			$(selector).slider(options) 
	});

*	返回值：轮播图对象（多个时返回数组）

###options###
	配置对象--JSON
*	loop
*	speed
*	index
*	autoPlay
*	interval
*	dots
*	data
*	tpl


>###loop###

*	是否连续滑动 
*	true/false 
*	默认值：false

>###speed###

*	动画执行速度 
*	默认值：400

>###index###

*	初始位置 
*	默认值：0


>###autoPlay###

*	是否开启自动播放 
*	true/false
*	默认值：true

>###interval###

*	是否显示点
*	默认值：4000

>###interval###

*	自动播放的间隔时间（毫秒）
*	true/false
*	默认值：true

>###data###

数据对象，包含每张图片对应的数据。通过与模板结合达到展现效果，每项的key需要与模板中需要替换的一一对应

例：

			var data = data:[{
                        pic:'image1.png',
                        title:'1,让Coron的太阳把自己晒黑—小天',
                        href:'http://www.baidu.com/'
                    },{
                        pic:'image2.png',
                        title:'2,让Coron的太阳把自己晒黑—小天',
                        href:'http://www.baidu.com/'
                    },{
                        pic:'image3.png',
                        title:'3,让Coron的太阳把自己晒黑—小天',
                        href:'http://www.baidu.com/'
                    },{
                        pic:'image4.png',
                        title:'4,让Coron的太阳把自己晒黑—小天',
                        href:'http://www.baidu.com/'
                    }] ;

>####tpl####
>>*	item

>>*	dots

模板对象可通过配置item配置每个图片对应的显示效果、dots配置轮播点的显示效果

tpl默认值：

	tpl : {
                    item: '<div class="'+CLASS_SLIDER_ITEM+'"><a <% if( href ) { %>href="<%= href %>" <% } %>>' +
                            '<img src="<%= pic %>" /></a>' +
                            '<% if( title ) { %><p><%= title %></p><% } %>' +
                            '</div>',
                    dots: '<p class="'+CLASS_SLIDER_DOTS+'"><%= new Array( len + 1 )' +
                            '.join("<b></b>") %></p>'        
                }

##组件构成##
* html+css
* js

###html+css###
	<div class="ui-content" id="slider">
    </div>

###js###
			seajs.use(['slider'], function(){
               var slider =  $('#slider').slider( { 
                    loop:true,
                    data:data 
                });
            });

##接口##
* play
* stop
* slideTo
* getIndex


###play###
	
*	返回值：返回调用者本身
*	说明：该方法会使轮播图自动播放
###代码###
		slider.play();


###stop###
	
*	返回值：返回调用者本身
*	说明：该方法会使轮播图停止播放（针对启动了自动播放的情况）
###代码###
		slider.stop();

###slideTo###
	
*	参数
	*	to {number} 目标slide的序号
	*	speed {number} [可选]切换的速度 
*	返回值：返回本身
*	说明：切换到第几个slide
###代码###
		slider.slideTo(to ，speed);
###getIndex###
	
*	参数
	*	index {number} 当前的silde序号
*	返回值：number
*	说明：返回当前显示的第几个slide
###代码###
		slider.getIndex(index);


##插件##
*	sliderbtn：图片轮播剪头按钮插件

####使用方式####

在页面依赖部分添加sliderbtn，如seajs.use(['slider','sliderbtn'])

##接口##
* next
* prev

###next###
	
	
*	返回值：返回本身
*	说明：切换到下一个slide
###代码###
		slider.next();
###prev###
	
	
*	返回值：返回本身
*	说明：切换到上一个slide
###代码###
		slider.prev();