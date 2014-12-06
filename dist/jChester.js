/*
 *  jChester - v0.0.1
 *  A time entry component for speedcubing solves.
 *  https://github.com/jfly/jChester
 *
 *  Made by Jeremy Fleischman
 *  Under GPL-3.0 License
 */
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
