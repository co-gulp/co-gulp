/*===============================================================================
************   ui native window   ************
===============================================================================*/
    
    var $local = global.$local = {};
    (function($L,global) {
       $L.Win = {
          openWin : function(url,id,options,type){
              if(co.plus){
                id = id||url;
                type = type||0;
                options = options||{type:$N.window.ANIMATION_TYPE_PUSH,time:150,curve:$N.window.ANIMATION_CURVE_LINEAR};
                $N.window.openWindow(id,type,url,options);
              }else{
                global.location.href=url;
              }
              return this;
            },

          backWin : function(id,options){
              if(co.plus){
                options = options||{type:$N.window.ANIMATION_TYPE_PUSH,time:150,curve:$N.window.ANIMATION_CURVE_LINEAR};
                $N.window.backToWindow(id,options);
              }else{
                if(global.history.length > 1) {
                  global.history.back();
                }
              }
              return this;
            }  
       }
    }($local,global));
/*===============================================================================
************   ui native window end  ************
===============================================================================*/    
    
    (function(global) {
       var $A = {
          fullIos7Bar : function(){
             
          },

          fullStatusBar : function(){
             
          },

          toast : function(){
             
          }
       }
       global.$app = $A;
    }(global));