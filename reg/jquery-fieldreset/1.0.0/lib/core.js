var $     = require("jquery")
;

/*
 * jQuery fieldReset
 * Clears value of a field if it equals the default value on focus, resets field if empty on focus lost
 *
 * Author: Yves Van Broekhoven
 *
 */

  
var _resetField
;

_resetField = function($this){
  var opts = $this.data("jfr-opts");
  if ($this.val() == "") {
    $this.val(opts.default_value);
  }
};
  
$.fn.fieldreset = function(options){
  
  var opts = options ? $.extend({}, $.fn.fieldreset.defaults, options) : $.fn.fieldreset.defaults;
  
  return $(this).each(function(){
    var $this = $(this);
    
    // Initialize field
    $this.data("jfr-opts", opts);
    _resetField($this);
    
    // On focus
    $this.focusin(function(){
      if ($this.val() == opts.default_value) {
        $this.val("");
      }
    });
    
    // On focus lost
    $this.focusout(function(){
      _resetField($this);
    });
  
  });
  
};

$.fn.fieldreset.defaults = {
  default_value: ""
};
  