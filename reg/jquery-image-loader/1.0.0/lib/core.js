/*
Author: Yves Van Broekhoven
Created: 2011-12-01
Version: 1.0.0

How to use:

HTML:

<div class="wrapper">
  <img data-src="url-to-image.jpg">
</div>


JS:

$('.wrapper').loadImages({
  imgLoadedClb: function(){ ... }
, allLoadedClb: function(){ ... }
});

*/


var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

var _load
;

$.fn.loadImages = function(options){
  options = options ? $.extend({}, $.fn.loadImages.defaults, options) : $.fn.loadImages.defaults;
  
  this.each(function(){
    var _this = this;
    
    $.when(_load.call(_this, options))
     .then(function(){
       if ($.isFunction(options.allLoadedClb)) {
         options.allLoadedClb.call(_this);
       }
     });
    
  });
  
  return this;
};


$.fn.loadImages.defaults = {
  imgLoadedClb: false /* callback when a image is loaded. 
                         this [object] loaded image
                         @params loaded [integer] loaded images
                         @params total  [integer] total images
                      */
, allLoadedClb: false /* callback when all images are loaded. 
                         this [object] wrapper element 
                      */
};


_load = function(options) {
  var dfd     = $.Deferred()
  ,   $this   = $(this)
  ,   loaded  = 0
  ,   $images = $this.find('img[data-src]')
  ,   clb
  ;
  
  
  /*
   * Callback after load/error
   * this = img obj
   */
  clb = function(){
    loaded += 1;
        
    // image loaded callback
    if ($.isFunction(options.imgLoadedClb)) {
     options.imgLoadedClb.call(this, loaded, $images.length);
    }
    
    // if all images are loaded, resolve
    if (loaded == $images.length) {
      dfd.resolve();
    }
    
  };
  
  
  /*
   * Load images
   */
  $images.each(function(){
    var $img = $(this);
    
    $img
      .load(function(){
        clb.call($img[0]);
      })
      .attr('src', $img.data('src'))
      .error(function(errorObj){
        $img.remove();
        console.log('[' + errorObj.type + ']' + ' Can\'t load ' + $img.data('src'));
        clb.call($img[0]);
      });
    
  });
  
  return dfd.promise();
};
