seajs.config({
      alias: {
          '$': 'base/zepto',
          'ui': 'ui/ui',
          'iscroll': 'libs/iscroll',
          'swipeout': 'libs/swipeout',
          'button' : 'ui/widgets/button',
          'checkbox' : 'ui/widgets/checkbox',
          'radio' : 'ui/widgets/checkbox',
          'select' : 'ui/widgets/select',
          'dialog_plus' : 'ui/widgets/dialog_plus',
          'dialog' : 'ui/widgets/dialog',
          'input' : 'ui/widgets/input',
          'switch':'ui/widgets/switch',
          'slider':'ui/widgets/slider/slider',
          'sGuide':'ui/widgets/slider/guide',
          'sTouch':'ui/widgets/slider/touch',
          'sMultiview':'ui/widgets/slider/multiview',
          'gridview' : 'ui/widgets/gridview',
          'tab' : 'ui/widgets/tabs/tabs',
          'tabbase' : 'ui/widgets/tabs/tabs.base',
          'tabswipe' : 'ui/widgets/tabs/tabs$swipe',
          'treeview' : 'ui/widgets/treeview',
          'scroll' : 'ui/widgets/iscroll'
      },
      preload: ['ui','button','checkbox','select','input','dialog']
  });