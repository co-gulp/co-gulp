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


        }($));
/*===============================================================================
************   $ extend end  ************
===============================================================================*/        