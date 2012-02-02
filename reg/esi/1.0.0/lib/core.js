var $      = require('jquery')
,   window = require('browser/window')
;

var index     = 0
,   callbacks = []
,   pending   = 1
;

var _replace
,   _ready
;

exports.process_esi = function(){
  var esi_tags
  ;

  esi_tags = $('include, esi\\:include');
  pending  = esi_tags.length;
  esi_tags.each(_replace);

  _ready();
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
      pending -= 1;
      _ready();
    }
  });

  $.ajaxSettings.data = data;
};

_ready = function(){
  if (pending > 0) { return; } // not ready

  callbacks.forEach(function(callback){
    callback();
  });
};

