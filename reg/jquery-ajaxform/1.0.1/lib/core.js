var $     = require("jquery")
;

/*
 * jQuery ajaxform
 *
 * Version: 1.0.1
 * Author: Yves Van Broekhoven
 */

var _submit
,   _handleResponse
,   _handleError
,   _successClb
;

_submit = function(event){
  var ctx = $(this);
  event.preventDefault();
  $.ajax({
    type:     'POST',
    url:      ctx.attr('action'),
    data:     ctx.serialize(),
    success:  function(data){
      _handleResponse(data, ctx);
    },
    error:    _handleError
  });
};

_handleResponse = function(data, ctx){
  var form = $("#" + ctx[0].id, data).first();
  ctx.replaceWith(form);
  ctx.unbind("submit");
  ctx = form;
  _successClb(data, ctx);
};

_handleError = function(){
  console.log("something went wrong baby");
};

_successClb = function(data, ctx){
  var opts = $.fn.ajaxform.options;
  if ($.isFunction(opts.successClb)) {
    opts.successClb.call(this, data, ctx);
  }
};

$.fn.ajaxform = function(options){
  var _this = $(this);
  
  $.fn.ajaxform.options = options ? $.extend({}, $.fn.ajaxform.defaults, options) : $.fn.ajaxform.defaults;
  
  _this.live("submit", _submit);
  
  return _this;
};

$.fn.ajaxform.defaults = {
  successClb: false
};
