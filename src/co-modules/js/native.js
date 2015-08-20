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
          trim : function(){

          },

          trimAll : function(){
             
          },

          isArray : function(){
             
          },

          addEvent : function(){
             
          },

          removEvent : function(){
             
          },

          one : function(){
             
          },

          query : function(){
             
          },

          queryAll : function(){
             
          },

          first : function(){
             
          },

          last : function(){
             
          },

          eq : function(){
             
          },

          not : function(){
             
          },

          prev : function(){
             
          },

          next : function(){
             
          },

          contains : function(){
             
          },

          closest : function(){
             
          },

          remove : function(){
             
          },

          attr : function(){
             
          },

          removeAttr : function(){
             
          },

          hasClass : function(){
             
          },

          addClass : function(){
             
          },

          removeClass : function(){
             
          },

          toggleClass : function(){
             
          },

          val : function(){
             
          },

          prepend : function(){
             
          },

          append : function(){
             
          },

          before : function(){
             
          },

          after : function(){
             
          },

          html : function(){
             
          },

          text : function(){
             
          },

          offset : function(){
             
          },

          css : function(){
             
          },

          cssVal : function(){
             
          },

          jsonToStr : function(){
             
          },

          strToJson  : function(){
             
          },

          setStorage : function(){
             
          },

          getStorage : function(){
             
          },

          removeStorage : function(){
             
          },

          clearStorage : function(){
             
          },

          fullIos7Bar : function(){
             
          },

          fullStatusBar : function(){
             
          },

          toast : function(){
             
          }
       }
       global.$app = $A;
    }(global));