/*
 * Author: Yves Van Broekhoven
 * Created at: 2012-02-01
 * Version: 1.0.0
 * API docs: http://developer.echonest.com/
 * jPlayer docs: http://jplayer.org/
 *
 * @example
 *   $.musicPreview('lady gaga', 'born this way');
 * 
 */

var $         = require("jquery")
,   window    = require("browser/window")
,   document  = require("browser/document")
,   navigator = require("browser/navigator")
;

var api_key   = 'VHMF6QHSMJZNBCLSU'
,   url       = 'http://developer.echonest.com/api/v4/song/search?api_key={{api_key}}&format=json&results=1&artist={{artist}}&title={{title}}&bucket=id:7digital-US&bucket=audio_summary&bucket=tracks'
,   response  = {}
;

var _onSuccess
;

$.musicPreview = function(artist, title){
  
  var dfd = $.Deferred();
  
  // Error: artist required
  if (artist === undefined || artist == '') {
    return dfd.reject(response.artist_required);
  }
  
  // Error: song title required
  if (title === undefined || title == '') {
    return dfd.reject(response.title_required);
  }
  
  // Echonest request
  var api_url = url.replace('{{api_key}}', api_key)
                   .replace('{{artist}}', artist)
                   .replace('{{title}}', title);
  
  var jxhr = $.getJSON(api_url);
  
  
  // Success: Echnonest request
  jxhr.success(function(data){
    _onSuccess.call(dfd, data);
  });
  
  // Error: Echnonest request
  jxhr.error(function(data){
    dfd.reject($.extend({}, response.request_error, { data: data }));
  });
  
  return dfd.promise();
};


_onSuccess = function(data){
  
  // Error: No songs found
  if (data.response.songs.length <= 0) {
    return this.reject(response.no_songs_found);
  }
  
  // Error: No preview found
  if (data.response.songs[0].tracks === undefined || data.response.songs[0].tracks.length <= 0) {
    return this.reject(response.no_preview_found);
  }
  
  // Success: preview found
  var preview_url = data.response.songs[0].tracks[0].preview_url;
  return this.resolve($.extend({}, response.success, { preview_url: preview_url }));
  
};

response = {
  
  artist_required: {
    status:   'error'
  , message:  'Artist required'
  },
  
  title_required: {
    status:   'error'
  , message:  'Song title required'
  },
  
  requeset_error: {
    status:   'error'
  , message:  'Can not connect to Echonest API'
  },
  
  no_songs_found: {
    status:   'error'
  , message:  'No soungs found'
  },
  
  no_preview_found: {
    status:   'error'
  , message:  'No preview found'
  },
  
  success: {
    status:   'success'
  , message:  'Preview found'
  }
  
};
  
