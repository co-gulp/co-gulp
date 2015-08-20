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
          trim : function(url,id,options,type){

          },

          trimAll : function(id,options){
             
          },

          isArray : function(id,options){
             
          },

          addEvent : function(id,options){
             
          },

          removEvent : function(id,options){
             
          },

          one : function(id,options){
             
          },

          query : function(id,options){
             
          },

          queryAll : function(id,options){
             
          },

          first : function(id,options){
             
          },

          last : function(id,options){
             
          },

          eq : function(id,options){
             
          },

          not : function(id,options){
             
          },

          prev : function(id,options){
             
          },

          next : function(id,options){
             
          },

          contains : function(id,options){
             
          },

          closest : function(id,options){
             
          },

          remove : function(id,options){
             
          },

          attr : function(id,options){
             
          },

          removeAttr : function(id,options){
             
          },

          hasClass : function(id,options){
             
          },

          addClass : function(id,options){
             
          },

          removeClass : function(id,options){
             
          },

          toggleClass : function(id,options){
             
          },

          val : function(id,options){
             
          },

          prepend : function(id,options){
             
          },

          append : function(id,options){
             
          },

          before : function(id,options){
             
          },

          after : function(id,options){
             
          },

          html : function(id,options){
             
          },

          text : function(id,options){
             
          },

          offset : function(id,options){
             
          },

          css : function(id,options){
             
          },

          cssVal : function(id,options){
             
          },

          jsonToStr : function(id,options){
             
          },

          strToJson  : function(id,options){
             
          },

          setStorage : function(id,options){
             
          },

          getStorage : function(id,options){
             
          },

          removeStorage : function(id,options){
             
          },

          clearStorage : function(id,options){
             
          },

          fullIos7Bar : function(id,options){
             
          },

          fullStatusBar : function(id,options){
             
          },

          toast : function(id,options){
             
          }
       }
       global.$app = $A;
    }(global));