/*
Author: Simon Menke
Created at: 2012-01-26

@html
  <body data-active-nav-keys="page-5 page-20">
  <nav>
    <a href="/products" data-nav-key="page-5">Products</a>
    <a href="/about" data-nav-key="page-6">About</a>
  </nav>

  <nav>
    <a href="/products/cookies" data-nav-key="page-9">Cookies</a>
    <a href="/products/milk" data-nav-key="page-20">Milk</a>
  </nav>
  </body>


@use
  $('body).navigationstate();
  
*/

var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

$.fn.navigationstate = function(){
  
  var $this
  ,   keys
  ;
  
  $this = $(this);
  keys  = $this.data('active-nav-keys').split(' ');
  
  $('*[data-nav-key]', $this).each(function(){
    var $this
    ,   key
    ;
    
    $this = $(this);
    key   = $this.data('nav-key');
    
    if (keys.indexOf(key) >= 0) {
      $this.addClass('active');
    } else {
      $this.removeClass('active');
    } 
  });
  
};