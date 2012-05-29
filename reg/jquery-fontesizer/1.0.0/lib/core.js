var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

/*

Author:      Yves Van Broekhoven
Created at:  2012-05-21
Version:     1.0.0

jQuery fontesizer adds a css class (.fontesizer-1, .fontesizer-2, ...) so 
you can add different fontsizes to your target.

How to use:

$(selector).fontesizer({
  steps: 4,           // default 2
  target: 'selector'  // default 'body'
});

*/
$.fn.fontesizer = function(options){
  
  var _valid
  ,   _step
  ;
  
  // Extend options with defaults
  options = options ? $.extend({}, $.fn.fontesizer.defaults, options) : $.fn.fontesizer.defaults;
  
  
  /*
   * Check if steps is bigger then 1
   */
  _valid = function(options){
    if (options.steps <= 1) {
      try {
        console.info('Too few fontesizer steps');
        
      } finally {
        return false;
        
      }
      
    } else {
      return true;
      
    }
  };
  
  
  /*
   * Go through steps
   */
  _step = function(options){
    var current_step = $(this).data('fontesizer-step')
    ,   next_step    = current_step ? (current_step + 1) : 1
    ;
    
    // If next step bigger then max steps,
    // back to step 1
    if (next_step > options.steps) {
      next_step = 1;
    }
    
    $(this)
      .data('fontesizer-step', next_step)
      .removeClass('fontesizer-' + current_step)
      .addClass('fontesizer-' + next_step);
    
    $(options.target)
      .removeClass('fontesizer-' + current_step)
      .addClass('fontesizer-' + next_step);
  };
  
  
  /*
   * If options are valid, let's rock!
   */
  if (_valid(options)) {
    
    this.each(function(){
      var _this = this
      ,   $this = $(_this)
      ;
    
      _step.call(this, options);
  
      $this.on('click.fontesizer', function(){
        _step.call(this, options);
      });
    
    });
    
  }  
  
  return this;
  
};


/*
 * Defaults
 */
$.fn.fontesizer.defaults = {
  steps:    2
, target:   'body'
};