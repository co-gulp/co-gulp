
##Dialog##

	弹出框组件封装了原生对话框对象，使开发者在界面中可以调用原生对话框完成交互，并且提供自定义对话框接口

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建。

	domReady(function(require){
            require("dialog");
			Dialog.alert
			......
	 });

##接口##
* alert
* confirm
* prompt
* dialog


##alert##
Dialog.alert(msg，options)
###代码###
	domReady(function(require){
            require("dialog");
			Dialog.alert('消息内容',{
	               title : '单按钮',
	               callback:function(ret){
	                     if(ret.buttonIndex==1)
		console.log('点击的是第一个按钮');
	                  }
	         });
	 });
###msg###
	要提示的消息内容


###options###
	配置对象--JSON
*	title
*	buttons
*	callback
	*	ret

>#####title#####
<table>
    <tr>
        <th>type</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>text</td>
        <td>提示框的标题</td>
        <td>
			title : '单按钮'
		</td>
    </tr>
</table>
>#####buttons#####
<table>
    <tr>
        <th>type</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>array</td>
        <td>显示的按钮，默认值['确定']</td>
        <td>buttons:['确定']</td>
    </tr>

</table>
>#####callback#####
>callback(ret)
<table>
    <tr>
        <th>type</th>
        <th>value</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>function</td>
        <td>点击按钮后的回调函数</td>
        <td><pre><code>
	callback:function(ret){
                  if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
              }
		</code></pre></td>
    </tr>

</table>	
>	>######ret######

<table>
    <tr>
        <th>类型</th>
        <th>说明</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>JSON</td>
        <td>点击按钮的序号（从1开始）</td>
        <td><pre><code>
callback:function(ret){
     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
				  
     }
		</code></pre></td>
    </tr>

</table>

##confirm##
Dialog.confirm(msg，options)
###代码###
		Dialog.confirm('消息内容',{
               title : '多按钮',
			   buttons : ['确认','放弃','取消'],
               callback:function(ret){
                     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
                  }
         });

###msg###
	要提示的消息内容


###options###
	配置对象--JSON
*	title
*	buttons
*	callback
	*	ret

>#####title#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>title</td>
        <td>提示框的标题</td>
        <td>
			title : '多按钮'
		</td>
    </tr>
</table>
>#####buttons#####	
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>buttons</td>
        <td>显示的按钮，默认值["取消","确定"]</td>
        <td>buttons:['确认','放弃','取消']</td>
    </tr>

</table>
>#####callback#####
>callback(ret)
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>callback</td>
        <td>点击按钮后的回调函数</td>
        <td><pre><code>
	callback:function(ret){
                  if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
              }
		</code></pre></td>
    </tr>

</table>	
>	>######ret######

<table>
    <tr>
        <th>类型</th>
        <th>说明</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>JSON</td>
        <td>点击按钮的序号（从1开始）</td>
        <td><pre><code>
callback:function(ret){
     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
				  
     }
		</code></pre></td>
    </tr>

</table>

##prompt##
Dialog.prompt(msg，options)
###代码###
		Dialog.prompt('消息内容',{
               title : '多按钮',
			   text ：'',
			   type : 'text',
			   buttons : ['确认','放弃','取消'],
               callback:function(ret){
                     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
                  }
         });

###msg###
	要提示的消息内容


###options###
	配置对象--JSON
*	title
*	text
*	type
*	buttons
*	callback
	*	ret

>#####title#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>title</td>
        <td>提示框的标题</td>
        <td>
			title : '多按钮'
		</td>
    </tr>
</table>
>#####text#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>text</td>
        <td>（可选项）输入框里面的默认内容</td>
        <td>
			text : '请输入'
		</td>
    </tr>
</table>
>#####type#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>type</td>
        <td>
	（可选项）输入类型，不同输入类型弹出键盘类型不同，
	取值范围（text、password、number、email、url）</td>
        <td>
			type : 'text'
		</td>
    </tr>
</table>
>#####buttons#####	
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>buttons</td>
        <td>（可选项）按钮标题，若小于两个按钮，会补齐两个按钮；若大于三个按钮，则使用前三个按钮，默认值["取消","确定"]</td>
        <td>buttons:['确认','放弃','取消']</td>
    </tr>

</table>
>#####callback#####
>callback(ret)
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>callback</td>
        <td>点击按钮后的回调函数</td>
        <td><pre><code>
	callback:function(ret){
                  if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
              }
		</code></pre></td>
    </tr>

</table>	
>	>######ret######

<table>
    <tr>
        <th>类型</th>
        <th>说明</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>JSON</td>
        <td>点击按钮的序号（从1开始）</td>
        <td><pre><code>
callback:function(ret){
     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
				  
     }
		</code></pre></td>
    </tr>

</table>


##dialog##
Dialog.dialog(options)

*	返回值 ：弹出框对象

###代码###
			var dialog = Dialog.dialog({
                            title:'登陆提示',
                            buttons: {
                                '取消': function(){
                                    this.close();
                                },
                                '确定': function(){
                                    this.close();
                                }
                            },
                            content:  '<div style="display:block"><p>恭喜您, 您是我们第1000000000000个用户</p></div>'
                        })


###options###
	配置对象--JSON
*	buttons
*	width
*	height
*	title
*	content

>#####buttons#####
<table>
    <tr>
        <th>type</th>
		<th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>JSON</td>
		<td>按钮的显示值</td>
        <td>点击按钮的回调事件</td>
        <td>
			<pre><code>
	buttons: {
            '取消': function(){
                       this.close();
             },
             '确定': function(){
                       this.close();
             }
      }
		</code></pre>
		</td>
    </tr>
</table>
>#####width#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>width</td>
        <td>弹出框宽度,默认300</td>
        <td>
			width:300
		</td>
    </tr>
</table>
>#####height#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>height</td>
        <td>弹出框高度，默认auto</td>
        <td>
			height:'auto'
		</td>
    </tr>
</table>
>#####title#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>title</td>
        <td>弹出框标题,默认提示框</td>
        <td>title: '提示框'</td>
    </tr>

</table>
>#####content#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
    </tr>
   
    <tr>
        <td>content</td>
        <td>弹出框内容</td>
    </tr>
	<tr>
        <th colspan= "2">示例</th>
	</tr>
</table>	
	content: '<div style="display:block"><p>恭喜您, 您是我们第1000000000000个用户</p></div>'

