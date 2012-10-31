/*global require, exports, console */

var jQuery    = require('jquery'),
    window    = require('browser/window'),
    document  = require('browser/document'),
    navigator = require('browser/navigator');

/** @preserve
 * jquery-tweets
 *
 * Created at: 2012-10-30 16:53:39 +0100
 * Updated at: 2012-10-31 13:20:11 +0100
 *
 * Author: @ivow
 * Version: 1.0.4
 *
 */

/*global jQuery:false window*/

(function($, window) {
  "use strict";

  var plugin_name = 'jquery-tweets',
      defaults    = {
        doneCallback: null
      };

  function Tweets( element, url, options ) {
    this.element = element;
    this.url     = url;
    this.id      = this.url.hashCode();
    this.options = $.extend( {}, defaults, options );
    this.cache   = window.sessionStorage[plugin_name + this.id];

    this.init();


  }

  Tweets.prototype.init = function() {
    var _this = this;

    if ( window.JSON && window.Storage && this.cache !== undefined) {
      this.output( $.parseJSON(this.cache) );

    } else {
      $.ajax({
        dataType: 'jsonp',
        success: function( response_data ){
          if ( window.JSON && window.Storage ) {
            window.sessionStorage[plugin_name + _this.id] = JSON.stringify( response_data );
          }
          _this.output( response_data );
        },
        url: _this.url
      });

    }

  };

  Tweets.prototype.output = function( data ) {
    var $ul = $('<ul />');

    $.each( data, function(idx, value) {
      var $li         = $('<li />'),
          $a          = $('<a />'),
          $span       = $('<span />'),
          $time       = $('<time />'),
          created_at  = new Date( Date.parse(value.created_at.replace(/(\+\S+) (.*)/, '$2 $1')) ),
          created_at_formated = created_at.getFullYear() + '-' + (created_at.getMonth() + 1) + '-' + created_at.getDate(),
          created_at_iso      = ISODateString(created_at);

      $a
        .attr( 'href', 'https://twitter.com/' + value.user.screen_name + '/status/' + value.id_str )
        .appendTo( $li );

      $span
        .html( value.text )
        .appendTo( $a );

      $time
        .attr( 'datetime', created_at_iso )
        .text( created_at_formated )
        .appendTo( $a );

      $li.appendTo( $ul );
    });

    $ul.appendTo( $(this.element) );

    if ( $.isFunction( this.options.doneCallback) ) {
      this.options.doneCallback.call( this.element );
    }
  };

  $.fn.tweets = function(url, options ) {
    return this.each(function() {
      if ( !$.data(this, 'plugin_' + plugin_name) ) {
        $.data(this, 'plugin_' + plugin_name, true);
        new Tweets( this, url, options );
      }
    });
  };

  // Helpers
  String.prototype.hashCode = function(){
    var hash = 0,
        i,
        character;

    if (this.length === 0) {
      return hash;
    }

    for (i = 0; i < this.length; i++) {
        character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
  }

}(jQuery, window));
