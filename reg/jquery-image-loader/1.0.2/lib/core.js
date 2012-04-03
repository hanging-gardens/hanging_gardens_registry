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
, imgErrorClb:  function(){ ... }
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
                         @params processed [integer] processed images
                         @params total  [integer] total images
                      */
, allLoadedClb: false /* callback when all images are loaded. 
                         this [object] wrapper element 
                      */
, imgErrorClb: false  /* callback when an image fails loading
                         this [object] failed image
                      */
};


_load = function(options) {
  var dfd       = $.Deferred()
  ,   $this     = $(this)
  ,   processed = 0
  ,   $images   = $this.find('img[data-src]')
  ,   clb
  ;
  
  
  /*
   * If there are no images, exit immediately
   */
  if ($images.length < 1) {
    return dfd.resolve();
  }
  
  
  /*
   * Callback after load/error
   * this = img obj
   */
  clb = function(status){
    processed += 1;
        
    // image success callback
    if (status == 'success' && $.isFunction(options.imgLoadedClb)) {
     options.imgLoadedClb.call(this, processed, $images.length);
    }
    
    // image error callback
    if (status == 'error' && $.isFunction(options.imgErrorClb)) {
     options.imgErrorClb.call(this);
    }
    
    // if all images are processed, resolve
    if (processed == $images.length) {
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
        clb.call($img[0], 'success');
      })
      .attr('src', $img.data('src'))
      .error(function(errorObj){
        console.log('[' + errorObj.type + ']' + ' Can\'t load ' + $img.data('src'));
        clb.call($img[0], 'error');
      });
    
  });
  
  return dfd.promise();
};