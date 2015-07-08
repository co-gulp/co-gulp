##Header##

	导航栏组件使开发者可以通过HTML+CSS快速构建导航控件


##组件构成##
* html+css

###html+css###

	ex1:
	<header  class="ui-bar ui-bar-nav">
        <h1 class="ui-title">导航栏</h1>
        <a class="ui-icon ui-icon-bars ui-pull-right"></a>
        <a class="ui-action-back ui-icon ui-icon-left-nav ui-pull-left"></a>
    </header>

	ex2:
	<header  class="ui-bar ui-bar-nav">
        <h1 class="ui-title">导航栏</h1>
        <button class="ui-action-back ui-btn ui-btn-blue ui-btn-link ui-btn-nav ui-pull-left">
            <span class="ui-icon ui-icon-left-nav"></span>
            首页
        </button>
        <button class="ui-btn ui-btn-blue ui-btn-link ui-pull-right">
            编辑
        </button>
    </header>
####可与butto组合使用###

	 domReady(function(require){
            $('a.ui-pull-left').button(function(evt){
                this.back();
            })
            $('a.ui-pull-right').button(function(evt){
                console.log('右边');
            })
        });
