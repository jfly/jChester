(function($) {

  $.fn.jChester = function(options) {
    var settings = $.extend({}, $.fn.jChester.defaults, options);

    return this.css({
      color: settings.color,
      backgroundColor: settings.backgroundColor
    });

  };

  $.fn.jChester.defaults = {
    color: "green",//<<<
  };

}(jQuery));
