var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

exports.load = function(id, options){
    
    if (id === undefined) {
      
      console.log("Typekit script ID is missing");
      return false;
      
    } else {
      
      options = options ? $.extend({}, exports.defaults, options) : exports.defaults;
      
      $.getScript(options.typekit_url + id + '.js', function(){
        
        window.Typekit.load({
          loading: function(){
            // Javascript to execute when fonts start loading
            $("html")
              .removeClass("typekit-active typekit-inactive")
              .addClass("typekit-loading");
            if ($.isFunction(options.onLoading)) {
              options.onLoading();
            }
          },
          active: function(){
            // Javascript to execute when fonts become active
            $("html")
              .removeClass("typekit-loading typekit-inactive ")
              .addClass("typekit-active");
            if ($.isFunction(options.onActive)) {
              options.onActive();
            }
          },
          inactive: function(){
            // Javascript to execute when fonts become inactive
            $("html")
              .removeClass("typekit-loading typekit-active")
              .addClass("typekit-inactive");
            if ($.isFunction(options.onInactive)) {
              options.onInactive();
            }
            console.log("Typekit fonts inactive");
          }
        });
        
      });
      return true;
    }
    
};

exports.defaults = {
  typekit_url : "http://use.typekit.com/"
, onLoading   : false
, onActive    : false
, onInactive  : false
};