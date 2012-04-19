/*
Author: Yves Van Broekhoven
Created: 2011-12-01
Version: 1.0.3

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
, noImgClb:     function(){ ... }
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
  imgLoadedClb: false /* callback when an image is loaded. 
                         this [object] loaded image
                         @params processed [integer] processed images
                         @params total  [integer] total images
                      */
, allLoadedClb: false /* callback when all images are loaded. 
                         this [object] wrapper element 
                      */
, imgErrorClb: false  /* callback when an image fails loading.
                         this [object] failed image
                      */
, noImgClb: false     /* callback when there are no images to be loaded, 
                         or all are failed.
                         this [object] wrapper element
                      */
};


_load = function(options) {
  var dfd       = $.Deferred()
  ,   _this     = this
  ,   $this     = $(_this)
  ,   processed = 0
  ,   failed    = 0
  ,   $images   = $this.find('img[data-src]')
  ,   clb
  ;
  
  
  /*
   * If there are no images, exit immediately
   */
  if ($images.length < 1) {
    options.noImgClb.call(_this);
    return dfd.reject();
  }
  
  
  /*
   * Callback after load/error
   * this = <img>
   */
  clb = function(status){
    processed += 1;
        
    // Image success callback
    if (status == 'success' && $.isFunction(options.imgLoadedClb)) {
      options.imgLoadedClb.call(this, processed, $images.length);
    }
    
    // Image error callback
    if (status == 'error') {
      failed += 1;
      
      // Unbind load event to avoid triggering our load function again 
      // when you for example add a fallback image
      $(this).unbind('load');
        
      if ($.isFunction(options.imgErrorClb)) {
        options.imgErrorClb.call(this);
      }
    }
    
    // If all images are processed, resolve
    if (processed == $images.length) {

      // If failed count equals image count, then reject
      // otherwise resolve
      if (failed == $images.length) {
        options.noImgClb.call(_this);
        dfd.reject();
      } else {
        dfd.resolve();
      }
      
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
      .error(function(errorObj){
        clb.call($img[0], 'error');
      })
      .attr('src', $img.data('src'));
    
  });
  
  return dfd.promise();
};