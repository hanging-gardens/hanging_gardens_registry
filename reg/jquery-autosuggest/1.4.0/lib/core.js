var $ = require('jquery')
;

 /*
 * AutoSuggest (modified by Simon Menke for the purposes of Lalala)
 * Copyright 2009-2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/autosuggest-jquery-plugin
 *
 * Version 1.4   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will auto-complete or auto-suggest completed search queries
 * for you as you type. You can add multiple selections and remove them on
 * the fly. It supports keybord navigation (UP + DOWN + RETURN), as well
 * as multiple AutoSuggest fields on the same page.
 *
 * Inspied by the Autocomplete plugin by: Jörn Zaefferer
 * and the Facelist plugin by: Ian Tearle (iantearle.com)
 *
 * This AutoSuggest jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

  $.fn.autoSuggest = function(data, options) {
  var defaults = {
    inputName: false,
    inputNameSuffix: false,
    sortable: false,
    style: false,
    asHtmlID: false,
    startText: false,
    emptyText: "No Results Found",
    preFill: {},
    limitText: "No More Selections Are Allowed",
    selectedItemProp: "value", //name of object property
    selectedValuesProp: "value", //name of object property
    searchObjProps: "value", //comma separated list of object property names
    queryParam: "q",
    retrieveLimit: false, //number for 'limit' param on ajax request
    extraParams: "",
    matchCase: false,
    minChars: 1,
    keyDelay: 400,
    resultsHighlight: true,
    neverSubmit: false,
    selectionLimit: false,
    showResultList: true,
    start: function(){},
    selectionClick: function(elem){},
    selectionAdded: function(elem){},
    selectionRemoved: function(elem){ elem.remove(); },
    formatList: false, //callback function
    beforeRetrieve: function(string){ return string; },
    retrieveComplete: function(data){ return data; },
    resultClick: function(data){},
    resultsComplete: function(){}
  };
  var opts = $.extend(defaults, options);

  var d_type = "object";
  var d_count = 0;
  var k;
  var org_data;
  var req_string;
  if (data == "rel") {
    d_type = "rel";
  } else if(typeof data == "string") {
    d_type = "string";
    req_string = data;
  } else {
    org_data = data;
    for (k in data){ 
      if (data.hasOwnProperty(k)){ d_count++; }
    }
  }
  if((d_type == "object" && d_count > 0) || d_type == "string" || d_type == "rel"){
    return this.each(function(x){
      var add_selected_item;
      var moveSelection;
      var keyChange;
      var lastKeyPressCode;
      var processData;
      var x_id;
      
      if(!opts.asHtmlID){
        x = x+""+Math.floor(Math.random()*100); //this ensures there will be unique IDs on the page if autoSuggest() is called multiple times
        x_id = "as-input-"+x;
      } else {
        x = opts.asHtmlID;
        x_id = x;
      }
      opts.start.call(this);
      var input = $(this);
      var input_org_data = org_data;
      
      if (d_type == 'rel') {
        input_org_data = eval('('+input.attr('rel')+')');
        input.removeAttr('rel');
      }
      input.data('as.data', input_org_data.data);
      
      var start_text  = opts.startText;
      if (start_text === false) {
        start_text = input.attr('title');
        input.removeAttr('title');
      }
      if (!start_text) {
        start_text = "Enter a search string...";
      }
      input.attr("autocomplete","off").addClass("as-input").attr("id",x_id).val(start_text);
      var input_focus = false;
      var list_style  = opts.style;
      var sortable    = opts.sortable;
      var input_name  = opts.inputName;
      var name_suffix = opts.inputNameSuffix;

      // Setup basic elements and render them to the DOM
      input.wrap('<ul class="as-selections" id="as-selections-'+x+'"></ul>').wrap('<li class="as-original" id="as-original-'+x+'"></li>');
      var selections_holder = $("#as-selections-"+x);
      var org_li = $("#as-original-"+x);
      var results_holder = $('<div class="as-results" id="as-results-'+x+'"></div>').hide();
      var results_ul =  $('<ul class="as-list"></ul>');
      
      add_selected_item = function(data, num){
        var value = data[opts.selectedValuesProp];
        var item = $('<li class="as-selection-item" id="as-selection-'+num+'" rel="'+value+'"></li>').click(function(){
            opts.selectionClick.call(this, $(this));
            selections_holder.children().removeClass("selected");
            $(this).addClass("selected");
          }).mousedown(function(){ input_focus = false; });
        var close = $('<a class="as-close">&times;</a>').click(function(){

            opts.selectionRemoved.call(this, item);
            input_focus = true;
            input.focus();
            return false;
          });
        item = item.html(data[opts.selectedItemProp]).prepend(close);
        if (sortable) {
          var drag = $('<a class="as-drag">&divide;</a>');
          item = item.prepend(drag);
        }
        item = item.prepend('<input type="hidden" value="'+value+'" name="'+input_name+'" />');
        org_li.before(item);
        opts.selectionAdded.call(this, org_li.prev());
      };

      if (list_style === false) {
        if (input.hasClass('as-rows-style')) {
          input.removeClass('as-rows-style');
          list_style = 'rows';
        } else if (input.hasClass('as-tags-style')) {
          input.removeClass('as-tags-style');
          list_style = 'tags';
        }
      }
      if (list_style == 'rows') {
        selections_holder.addClass('as-rows-style');
      } else {
        selections_holder.addClass('as-tags-style');
      }
      
      if (sortable === false) {
        sortable = input.hasClass('as-sortable');
        input.removeClass('as-sortable');
      }
      if (sortable) {
        selections_holder.addClass('as-sortable');
        selections_holder.sortable({
          'forcePlaceholderSize': true,
          'containment' : 'parent',
          'opacity'     : 0.6,
          'distance'    : 5,
          'items'       : 'li.as-selection-item',
          'handle'      : '.as-drag',
          'placeholder' : 'as-placeholder',
          'revert'      : true,
          'start'       : function(){
          },
          'update'      : function(){
          }
        });
      }
      
      if (name_suffix === false) {
        name_suffix = input_org_data.name_suffix;
      }
      
      if (input_name === false) {
        input_name = input.attr('name');
        input.removeAttr('name');
      }
      if (!input_name) {
        input_name = 'selection';
      }
      if (typeof name_suffix == "string") {
        input_name += name_suffix;
      }
      
      org_li.append('<input type="hidden" name="'+input_name+'" value="" />');
      
      var has_data = false;
      var i;
      if(d_type == 'rel') {
        for (i in input_org_data.selection) {
          var data, idata, sdata;
          sdata = input_org_data.selection[i];
          for (var j in input_org_data.data) {
            idata = input_org_data.data[j];
            if (idata[opts.selectedValuesProp] == sdata) {
              add_selected_item(idata, "000"+i);
              has_data = true;
            }
          }
        }
      } else if(typeof opts.preFill == "string"){
        var vals = opts.preFill.split(",");
        for(i=0; i < vals.length; i++){
          var v_data = {};
          v_data[opts.selectedValuesProp] = vals[i];
          if(vals[i] != ""){
            add_selected_item(v_data, "000"+i);
          }
        }
        has_data = true;
      } else {
        var prefill_count = 0;
        var k;
        for (k in opts.preFill) { if (opts.preFill.hasOwnProperty(k)) { prefill_count++; } }
        if(prefill_count > 0){
          for(i=0; i < prefill_count; i++){
            var new_v = opts.preFill[i][opts.selectedValuesProp];
            if(new_v === undefined){ new_v = ""; }
            has_data = true;
            if(new_v != ""){
              add_selected_item(opts.preFill[i], "000"+i);
            }
          }
        }
      }
      if(has_data){
        input.val("");
        $("li.as-selection-item", selections_holder).addClass("blur").removeClass("selected");
      }
      selections_holder.click(function(){
        input_focus = true;
        input.focus();
      }).mousedown(function(){ input_focus = false; }).after(results_holder);

      var timeout = null;
      var prev = "";
      var totalSelections = 0;
      var tab_press = false;

      // Handle input field events
      input.focus(function(){
        var values = $('li.as-selection-item', selections_holder);
        if($(this).val() == start_text && values.length === 0){
          $(this).val("");
        } else if(input_focus){
          values.removeClass("blur");
          if($(this).val() != ""){
            results_ul.css("width",selections_holder.outerWidth());
            results_holder.show();
          }
        }
        input_focus = true;
        return true;
      }).blur(function(){
        var values = $('li.as-selection-item', selections_holder);
        if($(this).val() == "" && values.length === 0){
          $(this).val(start_text);
        } else if(input_focus){
          $("li.as-selection-item", selections_holder).addClass("blur").removeClass("selected");
          results_holder.hide();
        }
      }).keydown(function(e) {
        // track last key pressed
        var lastKeyPressCode = e.keyCode;
        var first_focus = false;
        switch(e.keyCode) {
          case 38: // up
            e.preventDefault();
            moveSelection("up");
            break;
          case 40: // down
            e.preventDefault();
            moveSelection("down");
            break;
          case 8:  // delete
            if(input.val() == ""){ selections_holder.children().not(org_li.prev()).removeClass("selected");
              if(org_li.prev().hasClass("selected")){
                opts.selectionRemoved.call(this, org_li.prev());
              } else {
                opts.selectionClick.call(this, org_li.prev());
                org_li.prev().addClass("selected");
              }
            }
            if(input.val().length == 1){
              results_holder.hide();
               prev = "";
            }
            if($(":visible",results_holder).length > 0){
              if (timeout){ clearTimeout(timeout); }
              timeout = setTimeout(function(){ keyChange(); }, opts.keyDelay);
            }
            break;
          case 13: // return
            tab_press = false;
            var active = $("li.active:first", results_holder);
            if(active.length > 0){
              active.click();
              results_holder.hide();
            }
            if(opts.neverSubmit || active.length > 0){
              e.preventDefault();
            }
            break;
          default:
            if(opts.showResultList){
              if(opts.selectionLimit && $("li.as-selection-item", selections_holder).length >= opts.selectionLimit){
                results_ul.html('<li class="as-message">'+opts.limitText+'</li>');
                results_holder.show();
              } else {
                if (timeout){ clearTimeout(timeout); }
                timeout = setTimeout(function(){ keyChange(); }, opts.keyDelay);
              }
            }
            break;
        }
      });

      keyChange = function() {
        // ignore if the following keys are pressed: [del] [shift] [capslock]
        if( lastKeyPressCode == 46 || (lastKeyPressCode > 8 && lastKeyPressCode < 32) ){ return results_holder.hide(); }
        var string = input.val().replace(/[\\]+|[\/]+/g,"");
        if (string == prev){ return;}
        prev = string;
        if (string.length >= opts.minChars) {
          selections_holder.addClass("loading");
          if(d_type == "string"){
            var limit = "";
            if(opts.retrieveLimit){
              limit = "&limit="+encodeURIComponent(opts.retrieveLimit);
            }
            if(opts.beforeRetrieve){
              string = opts.beforeRetrieve.call(this, string);
            }
            $.getJSON(req_string+"?"+opts.queryParam+"="+encodeURIComponent(string)+limit+opts.extraParams, function(data){
              d_count = 0;
              var new_data = opts.retrieveComplete.call(this, data);
              var k;
              for (k in new_data){ if (new_data.hasOwnProperty(k)) {d_count++;}}
              processData(new_data, string);
            });
          } else {
            if(opts.beforeRetrieve){
              string = opts.beforeRetrieve.call(this, string);
            }
            var idata = input.data('as.data');
            d_count = 0;
            var k;
            for (k in idata){ if (idata.hasOwnProperty(k)) {d_count++;}}
            processData(idata, string);
          }
        } else {
          selections_holder.removeClass("loading");
          results_holder.hide();
        }
      };
      var num_count = 0;
      processData = function(data, query){
        if (!opts.matchCase){ query = query.toLowerCase(); }
        var matchCount = 0;
        results_holder.html(results_ul.html("")).hide();
        for(var i=0;i<d_count;i++){
          var num = i;
          num_count++;
          var forward = false;
          var str;
          if(opts.searchObjProps == "value") {
            str = data[num].value;
          } else {
            str = "";
            var names = opts.searchObjProps.split(",");
            for(var y=0;y<names.length;y++){
              var name = $.trim(names[y]);
              str = str+data[num][name]+" ";
            }
          }
          if(str){
            if (!opts.matchCase){ str = str.toLowerCase(); }
            var i_value = data[num][opts.selectedValuesProp];
            i_value = $("li.as-selection-item[rel='"+i_value+"']", selections_holder);
            if(str.search(query) != -1 && i_value.length === 0){
              forward = true;
            }
          }
          if(forward){
            var formatted = $('<li class="as-result-item" id="as-result-item-'+num+'"></li>').click(function(){
                var raw_data = $(this).data("data");
                var number = raw_data.num;
                if($("#as-selection-"+number, selections_holder).length <= 0 && !tab_press){
                  var data = raw_data.attributes;
                  input.val("").focus();
                  prev = "";
                  add_selected_item(data, number);
                  opts.resultClick.call(this, raw_data);
                  results_holder.hide();
                }
                tab_press = false;
              }).mousedown(function(){ input_focus = false; }).mouseover(function(){
                $("li", results_ul).removeClass("active");
                $(this).addClass("active");
              }).data("data",{attributes: data[num], num: num_count});
            var this_data = $.extend({},data[num]);
            var regx;
            if (!opts.matchCase){
              regx = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "gi");
            } else {
              regx = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "g");
            }

            if(opts.resultsHighlight){
              this_data[opts.selectedItemProp] = this_data[opts.selectedItemProp].replace(regx,"<em>$1</em>");
            }
            if(!opts.formatList){
              formatted = formatted.html(this_data[opts.selectedItemProp]);
            } else {
              formatted = opts.formatList.call(this, this_data, formatted);
            }
            results_ul.append(formatted);
            this_data = null;
            matchCount++;
            if(opts.retrieveLimit && opts.retrieveLimit == matchCount ){ break; }
          }
        }
        selections_holder.removeClass("loading");
        if(matchCount <= 0){
          results_ul.html('<li class="as-message">'+opts.emptyText+'</li>');
        }
        results_ul.css("width", selections_holder.outerWidth());
        results_holder.show();
        opts.resultsComplete.call(this);
      };

      moveSelection = function(direction){
        if($(":visible",results_holder).length > 0){
          var lis = $("li", results_holder);
          var start;
          if(direction == "down"){
            start = lis.eq(0);
          } else {
            start = lis.filter(":last");
          }
          var active = $("li.active:first", results_holder);
          if(active.length > 0){
            if(direction == "down"){
            start = active.next();
            } else {
              start = active.prev();
            }
          }
          lis.removeClass("active");
          start.addClass("active");
        }
      };

    });
  }
};