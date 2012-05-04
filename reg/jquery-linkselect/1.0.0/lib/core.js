var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

/*
 * Author: Yves Van Broekhoven
 * Created at: 2012-04-25
 * Version: 1.0.0
 *
 * Transform every link in an element into a select box.
 */

$.fn.linkselect = function(action){
  
  var _init
  ,   _destroy
  ,   _sort
  ,   _unique
  ;
  
  /*
   * Initialize
   */
  _init = function(){
    
    this.each(function(){
      
      // If already build, exit
      if ($(this).find('.linkselect').length) {
        return;
      }
      
      var $this   = $(this)
      ,   $select = $('<select></select>')
      ,   blank   = $this.data('include-blank')
      ;
      
      // Include blank
      if (blank != undefined) {
        $select.prepend($('<option val="">' + blank + '</option>'))
      }
      
      console.log(blank);
    
      $this.children().hide();
      
      $( _sort.call( _unique.call($this.find('a')) ) ).each(function(){
        var $a      = $(this)
        ,   $option = $('<option></option>')
        ;
      
        $option.text($a.text());
        $option.val($a.attr('href'));
        $option.appendTo($select);
      });
    
      $select
        .addClass('linkselect')
        .appendTo($this);
    
      $select.bind('change', function(){
        window.location = $(this).val();
      });
    
    });
  
  };
  
  
  /*
   * Destroy
   */
  _destroy = function(){
    this.each(function(){
      var $this = $(this);
    
      $this.find('.linkselect').unbind('change').remove();
      $this.children().show();
    });
  };
  
  
  /*
   * Sort
   * this = array of DOM elements
   */
  _sort = function(){
    return this.sort(function(a, b) {
      var compA = $(a).text().toUpperCase();
      var compB = $(b).text().toUpperCase();
      return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });
  };
  
  
  /*
   * Remove duplicates
   * this = jQuery array
   */
  _unique = function(){
    var unique_hrefs = [];
    
    return this.map(function(){
      var href = $(this).attr('href');
      if ( unique_hrefs.indexOf(href) < 0) {
        unique_hrefs.push(href);
        return $(this);
      }
    });
  };
  
  
  switch(action){
    case "destroy":
      _destroy.call(this);
      break;
    default:
      _init.call(this);
  }

  return this;
};