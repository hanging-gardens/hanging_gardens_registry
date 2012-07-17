var jQuery    = require('jquery'),
    window    = require('browser/window'),
    document  = require('browser/document'),
    navigator = require('browser/navigator');

/*
 * jquery-imagefit
 *
 * Created at: 2012-07-16 19:24:45 +0200
 * Author: Yves Van Broekhoven
 * Version: 0.0.2
 */

(function($) {

  $.fn.imagefit = function() {

    this.each( function() {
      var $this           = $(this),
          $wrapper        = $this.parent(),
          wrapper_width   = $wrapper.width(),
          wrapper_height  = $wrapper.height(),
          wrapper_ratio,
          image_ratio;

      // ratios
      image_ratio   = $this.width() / $this.height();
      wrapper_ratio = wrapper_width / wrapper_height;

      $this.css({
        position  : 'absolute'
      });

      if ( wrapper_ratio < image_ratio ) {
        $this.css({
          height    : 'auto',
          left      : '0',
          top       : '50%',
          width     : '100%'
        });

        $this.css({
          marginTop : 0 - ($this.height() / 2)
        });

      } else {
        $this.css({
          height    : wrapper_height,
          left      : '50%',
          top       : '0',
          width     : 'auto'
        });

        $this.css({
          marginLeft  : 0 - ($this.width() / 2)
        });

      }

    });

    return this;
  };

}(jQuery));