/*===============================================================================
************   $ extend   ************
===============================================================================*/
        (function($){
            $.animationFrame = function(cb) {
                var args, isQueued, context;
                return function() {
                    args = arguments;
                    context = this;
                    if (!isQueued) {
                        isQueued = true;
                        requestAnimationFrame(function() {
                            cb.apply(context, args);
                            isQueued = false;
                        });
                    }
                };
            };
            $.cellPhone = function(v) {
                var cellphone = /^1[3|4|5|8][0-9]\d{8}$/; 
                return cellphone.test(v);
            };

        }($));
/*===============================================================================
************   $ extend end  ************
===============================================================================*/        