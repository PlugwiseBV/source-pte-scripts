!function(t){t.fn.translate=function(n){var a=this,s={css:"trn",lang:"en"};s=t.extend(s,n||{}),0!==s.css.lastIndexOf(".",0)&&(s.css="."+s.css);var r=s.t;return this.lang=function(t){return t&&(s.lang=t,this.translate(s)),s.lang},this.get=function(t){var n=t;try{n=r[t][s.lang]}catch(a){return t}return n?n:t},this.g=this.get,this.find(s.css).each(function(n){var s=t(this),r=s.attr("data-trn-key");r||(r=s.html(),s.attr("data-trn-key",r)),s.html(a.get(r))}),this}}(jQuery);
var calendar = {

  init: function(translations) {

    var mon = translations.mon;
    var tue = translations.tue;
    var wed = translations.wed;
    var thur = translations.thur;
    var fri = translations.fri;
    var sat = translations.sat;
    var sund = translations.sun;

    var color_uuid = [];

    /**
     * Get current date
     */
    var d = new Date();
    var strDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();

    /**
     * Get current month and set as '.current-month' in title
     */
    var monthNumber = d.getMonth() + 1;
    var yearNumber = d.getFullYear();

    function GetMonthName(monthNumber) {
      var months = [translations.jan, translations.feb, translations.mar, translations.apr, translations.may, translations.jun, translations.jul, translations.aug, translations.sept, translations.oct, translations.nov, translations.dec];
      return months[monthNumber - 1];
    }

    setMonth(yearNumber, monthNumber, mon, tue, wed, thur, fri, sat, sund);

    function setMonth(yearNumber, monthNumber, mon, tue, wed, thur, fri, sat, sund) {
      $('.year').text(yearNumber);
      $('.year').attr('data-year', yearNumber);

      $('.month').text(GetMonthName(monthNumber));
      $('.month').attr('data-month', monthNumber);
      printDateNumber(yearNumber, monthNumber, mon, tue, wed, thur, fri, sat, sund);
    }
    function refreshCalendar() {
      printDateNumber(yearNumber, monthNumber, mon, tue, wed, thur, fri, sat, sund); 
    }

   function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function getDarkColors() {
      var letters = '012345'.split('');
      var color = '#';        
      color += letters[Math.round(Math.random() * 5)];
      letters = '0123456789ABCDEF'.split('');
      for (var i = 0; i < 5; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    }

    $.get("../connect/schedule/schedule_to_name.pte?uuid="+getUrlVars()["id"], function(val) {
      $('#schemaname').text(val.replace('_CD', ''));
    })

    $.get("../connect/schedules.pte", function(val) {

      colors = [
        {'background': '#5A0AD2', 'color': '#fff'}
      ];

      val = JSON.parse(val);
      for(var i=0; i<=val.length-1; i++) {        
        if(typeof colors[i] === 'undefined') {
          color = "#fff";
          background = getDarkColors();
        } else {
          color = colors[i].color
          background = colors[i].background
        }

        color_uuid.push({'background': background, 'color': color, 'uuid': val[i].uuid});

        if(val[i].uuid==getUrlVars()["id"].replace('#','')) {
          $('#schema').prepend('<li style="list-style-type: none"><label for="'+i+'"><input type="radio" id="'+i+'" name="schedule" value="'+val[i].uuid+'" backcolor="rgb(147, 159, 195)" color="#fff" checked> '+val[i].name+' <small style="position: relative;top: 5px;left: -3px;float:left;height:10px;width:10px;display:block;background: rgb(147, 159, 195)"></small> ('+translations.calendar_reset+') </label></li>');
        } else
          $('#schema').append('<li style="list-style-type: none"><label for="'+i+'"><input type="radio" id="'+i+'" name="schedule" value="'+val[i].uuid+'" backcolor="'+background+'" color="'+color+'"> '+val[i].name+' <small style="position: relative;top: 5px;left: -3px;float:left;height:10px;width:10px;display:block;background: '+background+'"></small></label></li>');
        }
    });

    $('.btn-next').on('click', function(e) {
      var monthNumber = $('.month').attr('data-month');
      var yearNumber = $('.year').attr('data-year');

      if (monthNumber > 11) {
        $('.month').attr('data-month', '0');
        var monthNumber = $('.month').attr('data-month');
        setMonth(parseInt(yearNumber) + 1, parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
      } else {
        setMonth(parseInt(yearNumber), parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
      };
    });

    $('.btn-prev').on('click', function(e) {
      var monthNumber = $('.month').attr('data-month');
      var yearNumber = $('.year').attr('data-year');

      if (monthNumber < 2) {
        $('.month').attr('data-month', '13');
        var monthNumber = $('.month').attr('data-month');
        setMonth(parseInt(yearNumber) - 1, parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
      } else {
        setMonth(parseInt(yearNumber), parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
      };
    });


    function printDateNumber(yearNumber, monthNumber, mon, tue, wed, thur, fri, sat, sund) {

      $($('tbody.event-calendar tr')).each(function(index) {
        $(this).empty();
      });

      $($('thead.event-days tr')).each(function(index) {
        $(this).empty();
      });

      function getDaysInMonth(month, year) {
        // Since no month has fewer than 28 days
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        return days;
      }

      i = 0;

      setDaysInOrder(mon, tue, wed, thur, fri, sat, sund);

      function setDaysInOrder(mon, tue, wed, thur, fri, sat, sund) {
        var monthDay = getDaysInMonth(monthNumber - 1, yearNumber)[0].toString().substring(0, 3);
        if (monthDay === 'Mon') {
          $('thead.event-days tr').append('<td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td>');
        } else if (monthDay === 'Tue') {
          $('thead.event-days tr').append('<td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td>');
        } else if (monthDay === 'Wed') {
          $('thead.event-days tr').append('<td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td>');
        } else if (monthDay === 'Thu') {
          $('thead.event-days tr').append('<td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td>');
        } else if (monthDay === 'Fri') {
          $('thead.event-days tr').append('<td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td>');
        } else if (monthDay === 'Sat') {
          $('thead.event-days tr').append('<td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td>');
        } else if (monthDay === 'Sun') {
          $('thead.event-days tr').append('<td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td>');
        }
      };
      $(getDaysInMonth(monthNumber - 1, yearNumber)).each(function(index) {
        var index = index + 1;
        if (index < 8) {
          $('tbody.event-calendar tr.1').append('<td date-year="' + yearNumber + '" date-month="' + monthNumber + '" date-day="' + index + '" class="event" style="border: 1px solid #999;color:white;background: rgb(147, 159, 195);">' + index + '</td>');
        } else if (index < 15) {
          $('tbody.event-calendar tr.2').append('<td date-year="' + yearNumber + '" date-month="' + monthNumber + '" date-day="' + index + '" class="event" style="border: 1px solid #999;color:white;background: rgb(147, 159, 195);">' + index + '</td>');
        } else if (index < 22) {
          $('tbody.event-calendar tr.3').append('<td date-year="' + yearNumber + '" date-month="' + monthNumber + '" date-day="' + index + '" class="event" style="border: 1px solid #999;color:white;background: rgb(147, 159, 195);">' + index + '</td>');
        } else if (index < 29) {
          $('tbody.event-calendar tr.4').append('<td date-year="' + yearNumber + '" date-month="' + monthNumber + '" date-day="' + index + '" class="event" style="border: 1px solid #999;color:white;background: rgb(147, 159, 195);">' + index + '</td>');
        } else if (index < 32) {
          $('tbody.event-calendar tr.5').append('<td date-year="' + yearNumber + '" date-month="' + monthNumber + '" date-day="' + index + '" class="event" style="border: 1px solid #999;color:white;background: rgb(147, 159, 195);">' + index + '</td>');
        }
        i++;
      });
      var date = new Date();
      var month = date.getMonth() + 1;
      setEvent();
      displayEvent();
    }

    /**
     * Get current day and set as '.current-day'
     
    function setCurrentDay(month) {
      var viewMonth = $('.month').attr('data-month');
      if (parseInt(month) === parseInt(viewMonth)) {
        $('tbody.event-calendar td[date-day="' + d.getDate() + '"]').addClass('current-day');
      }
    };


     * Add class '.active' on calendar date
     */
    $('tbody td').on('click', function(e) {
      if ($(this).hasClass('event')) {
        $('tbody.event-calendar td').removeClass('active');
        $(this).addClass('active');
      } else {
        $('tbody.event-calendar td').removeClass('active');
      };
    });

    /**
     * Add '.event' class to all days that has an event
     */


    function loadHistory(arr) {
      $(".history").empty();
      for(var i=0; i<=arr.length-1; i++) {
        $(".history").prepend('<li class="calendar_history">'+arr[i].user_filename+' - <b class="load" style="cursor: pointer;" data-uuid="'+arr[i].uuid+'" data-filename="'+arr[i].user_filename+'" data-filepath="'+arr[i].filepath+'">'+translations.calendar_select_load+'</b> - <b class="remove" style="cursor: pointer;" data-filename="'+arr[i].user_filename+'">'+translations.calendar_remove+'</b></li>');
      }
    }

    function getHistory() {
        return $.get("../cache/schedule_history.json", function(val) {
          return loadHistory(JSON.parse(val));
        });
    }

	var history = getHistory();

    function setEvent() {
      $('.day-event').each(function(i) {
        var eventYear = $(this).attr('date-year');
        var eventMonth = $(this).attr('date-month');
        var eventDay = $(this).attr('date-day');
        var id = $(this).attr('id');

        $('tbody.event-calendar tr td[date-year="' + eventYear + '"][date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').attr('id',id).addClass('event').css({"border": "1px solid rgb(147, 159, 195)", "color": $(this).attr('color'), "background-color": $(this).attr('backcolor')});
      });
    };

    $('.history').on('click', '.load', function(e) {
      var filepath = $(this).attr("data-filepath");
      var filename = $(this).attr("data-filename");
      var uuid = $(this).attr("data-uuid");
	  swal(translations.calendar_exception, translations.calendar_return, "success");
      window.opener.saveCalendarParent(getUrlVars()["id"], parseInt(filepath), filename);


      $.get("../connect/schedule/schedule_load.pte?filepath="+filepath+"&uuid="+uuid, function(val) {
            var load = (JSON.parse("["+val.replace(new RegExp("'",'g'), '"').replace(new RegExp('"=>"','g'), '":"').slice(1,-1)+"]"));
            $(".list").empty();
            refreshCalendar();
            back = 'black';
            color = 'red';
            for(var i=0; i<=load.length-1; i++) {
              for(var j=0; j<=color_uuid.length-1; j++) {
                if(color_uuid[j].uuid==load[i].id) {
                  back = color_uuid[j].background;
                  color = color_uuid[j].color;
                }
              }
              $(".list").prepend('<div class="day-event" date-year="'+load[i].year+'" date-month="'+load[i].month+'" date-day="'+load[i].day+'" data-number="1" backcolor="'+back+'" color="'+color+'" id="'+load[i].id+'"></div>');
            }
            setEvent();
      });
    });

    $('.history').on('click', '.remove', function(e) {
      var filename = $(this).attr("data-filename");
      $.get("../cache/schedule_history.json", function(val) {
        arr = JSON.parse(val)

        for(var i=0; i<=arr.length-1; i++) {
          if(filename === arr[i].user_filename) arr.splice(i, 1);
        }
        $.post("../connect/schedule/schedule_history.pte", JSON.stringify(arr)).done(function(data) {
          getHistory();
        });

      });

    });


	 $('#savecalendar').on('click', function(e) {
	    var user_filename = prompt(translations.calendar_give_name);
	    if(user_filename) {
	    var list = []
	      $('.list > div').each(function(i) {
	        list.push(
	          {
	            'id': $(this).attr('id'),
	            'year': $(this).attr('date-year'),
	            'month': $(this).attr('date-month'),
	            'day': $(this).attr('date-day')
	          }
	        );
	      });

	    filename = 10000 + Math.floor(Math.random() * 90000);
	    window.opener.saveCalendarParent(getUrlVars()["id"], filename, user_filename);

	    $.post("../connect/schedule/schedule_save.pte?filename="+filename+"&uuid="+getUrlVars()["id"], JSON.stringify(list)).done(function(data) {
	      window.opener.saveCalendarParent(getUrlVars()["id"], filename, user_filename);
	      $(".alert").css("display", "block").text(translations.calendar_saved);
	    });
	      var all = []
	    $.get("../cache/schedule_history.json", function(val) {
	      if(val) all = JSON.parse(val);
	      all.push({'user_filename': user_filename, 'uuid': getUrlVars()["id"], 'filepath':filename, 'id': filename });
	      $.post("../connect/schedule/schedule_history.pte?user_filename="+user_filename, JSON.stringify(all)).done(function(data) {
	        getHistory();
	      });
	    })
	  } else {

	  }

	 });
    /**
     * Get current day on click in calendar
     * and find day-event to display
     */
    function displayEvent() {
      $('tbody.event-calendar td').on('click', function(e) {
      var backcolor = $('input[name=schedule]:checked', '#schema').attr("backcolor");
      var color = $('input[name=schedule]:checked', '#schema').attr("color");
      var id = $('input[name=schedule]:checked', '#schema').attr("value");
      $(this).addClass("event").css("background-color", backcolor);
      $(this).addClass("event").css("color", color);

$('.list').append('<div class="day-event" date-year="'+$(this).attr('date-year')+'" date-month="'+$(this).attr('date-month')+'" date-day="'+$(this).attr('date-day')+'" data-number="1" color="'+color+'" id="'+id+'" backcolor="'+backcolor+'"></div>');

        $('.day-event').slideUp('fast');
        var yearEvent = $(this).attr('date-year');
        var monthEvent = $(this).attr('date-month');
        var dayEvent = $(this).text();
      });
    };

  },
};

$(document).ready(function() {
	translations = window.opener.getTranslationsCalendar();

	language = (window.opener.getLanguageCalendar());


	if(language==="jp-JP") {
		$("body").addClass("japanese_font");
	}


	translations.then( function(translations) {
		$.each(translations, function(i,j) {
			$("body").find("[data-translate='" + i + "']").html(j);
		});
		calendar.init(translations);
	});
});
