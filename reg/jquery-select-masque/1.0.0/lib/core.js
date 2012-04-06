var $ = require("jquery")
;

var _init
,   _unmasque
;

/*
 * How to use:
 * $(".select-masque").selectMasque();
 */
$.fn.selectMasque = function(){

    $(this).each(function(){
        _init.call($(this));
    });

};

_init = function(){

    $(this).wrap(function(){
        return '<div class="select-masque"></div>';
    }).parent().prepend('<span>' + $(this).find("option:selected").text() + '</span>');
    
    $(this).parent().bind("click", function(){
        $(this).addClass("unmasque");
    });

};


