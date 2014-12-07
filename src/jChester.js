(function($) {

  $.fn.jChester = function(method, _settings) {
    if(!this.is('div')) {
      throw "jChester can only be applied to divs";
    }
    if($.isPlainObject(method)) {
      _settings = method;
      method = null;
    }

    var that = this;
    var settings = $.extend({}, $.fn.jChester.defaults, _settings);

    var data = this.data('datepicker');
    if(!data) {
      data = {};
      this.data('datepicker', data);

      data.$formGroup = $('<div class="form-group">');
      that.append(data.$formGroup);

      data.$input = $('<input class="form-control">');
      data.$formGroup.append(data.$input);

      data.$helpBlock = $('<span class="help-block">');
      data.$formGroup.append(data.$helpBlock);

      var updateSolveTime = function() {
        var val = data.$input.val();
        try {
          var solveTime = $.stopwatchFormatToSolveTime(val);
          data.solveTime = solveTime;
          data.$helpBlock.text('');
          data.$formGroup.removeClass('has-warning');
        } catch(e) {
          data.solveTime = null;
          if(val.length === 0) {
            data.$helpBlock.text("Please enter a time");
          } else {
            data.$helpBlock.text(e);
          }
          data.$formGroup.addClass('has-warning');
        }
      };

      data.$input.on("input", function() {
        updateSolveTime();
        that.trigger("solveTimeInput", [data.solveTime]);
      });

      data.$input.on('keydown', function(e) {
        if(e.which === 13) {
          updateSolveTime();
          that.trigger("solveTimeChange", [data.solveTime]);
        }
      });

    }

    if(method === 'getSolveTime') {
      return data.solveTime;
    }

    if(settings.solveTime === null) {
      // If settings.solveTime is explicitly set to null, clear
      // the current input and warning state.
      data.$input.val('');
      data.$input.trigger('input');
    } else if(settings.solveTime) {
      data.$input.val($.solveTimeToStopwatchFormat(settings.solveTime));
      data.$input.trigger('input');
    }
    return that;
  };

  $.fn.jChester.defaults = {
    solveTime: null,
  };

  var MILLIS_PER_SECOND = 1000;
  var MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND;
  $.extend({
    stopwatchFormatToSolveTime: function(stopwatchFormat) {
      if(stopwatchFormat.toUpperCase() === 'DNF') {
        return {
          puzzlesSolved: 0,
          puzzlesAttempted: 1,
        };
      }
      if(stopwatchFormat.toUpperCase() === 'DNS') {
        return {
          puzzlesSolved: 0,
          puzzlesAttempted: 0,
        };
      }
      var m = stopwatchFormat.match(/^(?:(\d*):)?(\d+)(?:[.,](\d*))?$/);
      if(!m) {
        throw "Invalid stopwatch format";
      }

      var minutes = parseInt(m[1] || "0");
      var seconds = parseInt(m[2]);
      var decimalStr = m[3] || "";
      var decimal = parseInt(decimalStr || "0");
      var denominator = Math.pow(10, decimal.toString().length - 3); /* subtract 3 to get millis instead of seconds */
      var decimalValueInMillis = !decimal ? 0 : Math.round(decimal / denominator);

      var millis = minutes * MILLIS_PER_MINUTE + seconds * MILLIS_PER_SECOND + decimalValueInMillis;
      var decimals = Math.min(3, decimalStr.length); /* max allowed decimals is 3 */
      return {
        millis: millis,
        decimals: decimals,
      };
    },
    solveTimeIsDNF: function(solveTime) {
      if(typeof solveTime.puzzlesSolved !== 'undefined' && typeof solveTime.puzzlesAttempted !== 'undefined') {
        if(solveTime.puzzlesAttempted === 1) {
          // This is *not* a multi attempt.
          if(solveTime.puzzlesSolved === 0) {
            return true;
          }
        } else if(solveTime.puzzlesAttempted > 1) {
          // By https://www.worldcubeassociation.org/regulations/#H1a,
          // multibld results must have at least 2 puzzles attempted.
          /* From https://www.worldcubeassociation.org/regulations/#9f12c
          9f12c) For Multiple Blindfolded Solving, rankings are
          assessed based on number of puzzles solved minus the number
          of puzzles not solved, where a greater difference is better.
          If the difference is less than 0, or if only 1 puzzle is
          solved, the attempt is considered unsolved (DNF). If
          competitors achieve the same result, rankings are assessed
          based on total time, where the shorter recorded time is
          better. If competitors achieve the same result and the same
          time, rankings are assessed based on the number of puzzles
          the competitors failed to solve, where fewer unsolved
          puzzles is better.
          */
          var puzzleUnsolved = solveTime.puzzlesAttempted - solveTime.puzzlesSolved;
          var solvedMinusUnsolved = solveTime.puzzlesSolved - puzzleUnsolved;
          if(solvedMinusUnsolved < 0 || solveTime.puzzlesSolved === 1) {
            return true;
          }
        }
      }
      return false;
    },
    solveTimeIsDNS: function(solveTime) {
      if(typeof solveTime.puzzlesAttempted !== 'undefined') {
        if(solveTime.puzzlesAttempted === 0) {
          return true;
        }
      }
      return false;
    },
    solveTimeToStopwatchFormat: function(solveTime) {
      if($.solveTimeIsDNF(solveTime)) {
        return "DNF";
      } else if($.solveTimeIsDNS(solveTime)) {
        return "DNS";
      }

      var millis = solveTime.millis;
      var minutesField = Math.floor(millis / (60*1000));
      millis %= (60*1000);

      var secondsField = Math.floor(millis / 1000);
      millis %= 1000;

      function pad(toPad, padVal, minLength) {
        var padded = toPad + "";
        while(padded.length < minLength) {
          padded = padVal + padded;
        }
        return padded;
      }

      var stopwatchFormat;
      if(minutesField) {
        stopwatchFormat = minutesField + ":" + pad(secondsField, "0", 2);
      } else {
        stopwatchFormat = "" + secondsField;
      }
      var decimals = solveTime.decimals;
      if(decimals > 0) {
        // It doesn't make sense to format to more decimal places than the
        // accuracy we have.
        decimals = Math.min(3, decimals);
        var millisStr = pad(millis, "0", 3);
        stopwatchFormat += ".";
        for(var i = 0; i < decimals; i++) {
          stopwatchFormat += millisStr.charAt(i);
        }
      }
      return stopwatchFormat;
    },
  });

}(jQuery));
