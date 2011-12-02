var $      = require('jquery')
,   window = require('browser/window')
;

var index     = 0
,   callbacks = []
,   ready     = false
,   pending   = 0
,   recursion = 0
;

var _replace
,   _ready
;

exports.process_esi = function(){
  var esi_tags
  ;

  esi_tags = $('include, esi\\:include');
  pending += esi_tags.length;
  esi_tags.each(_replace);

  if (pending === 0) {
    _ready();
  }
};

exports.ready = function(callback){
  if (pending > 0) {
    callbacks.push(callback);
  } else {
    callback();
  }
};

_replace = function(){
  var $this = $(this)
  ,   data  = $.ajaxSettings.data
  ;

  $.ajaxSettings.data = null;

  index += 1;

  $.ajax(
  { url: $this.attr('src')
  , dataType: 'jsonp'
  , cache:    true
  , jsonpCallback: 'lalala_'+index+'_cb'
  , success:  function(fragment){
      $this.after($this.contents().detach());
      $this.replaceWith(fragment);
      pending   -= 1;

      if (pending === 0) {
        recursion += 1;
        if (recusion <= 5) {
          // recursive call
          exports.process_esi();
        } else {
          throw("Too many recursions");
        }
      }

      if (pending === 0) {
        _ready();
      }
    }
  });

  $.ajaxSettings.data = data;
};

_ready = function(){
  if (ready === true) { return; } // already ready
  ready = true;

  callbacks.forEach(function(callback){
    callback();
  });
};

