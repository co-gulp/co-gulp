seajs.config({
      alias: {
          'ui': 'ui/ui',
          'iscroll': 'libs/iscroll',
          'swipeout': 'libs/swipeout',
          'button' : 'ui/widgets/button',
          'checkbox' : 'ui/widgets/checkbox',
          'radio' : 'ui/widgets/checkbox',
          'select' : 'ui/widgets/select',
          'input' : 'ui/widgets/input',
          'switch':'ui/widgets/switch',
          'slider':'ui/widgets/slider/slider',
          'sGuide':'ui/widgets/slider/guide',
          'sTouch':'ui/widgets/slider/touch',
          'sMultiview':'ui/widgets/slider/multiview',
          'listview' : 'ui/widgets/listview',
          'tab' : 'ui/widgets/tabs/tabs',
          'treeview' : 'ui/widgets/treeview',
          'scroll' : 'ui/widgets/iscroll'
      },
      preload: ['ui','button','checkbox','select','input']
  });