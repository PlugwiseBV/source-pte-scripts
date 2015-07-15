var calendar = {

  init: function() {

    var mon = 'Mon';
    var tue = 'Tue';
    var wed = 'Wed';
    var thur = 'Thur';
    var fri = 'Fri';
    var sat = 'Sat';
    var sund = 'Sun';

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
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
/**
    $('.btn-next').on('click', function(e) {
      $('.btn-prev').removeClass('button-remove');
      var monthNumber = $('.month').attr('data-month');
      if (monthNumber == 11) {
         $('.btn-next').addClass('button-remove');
      }
  
      if (monthNumber < 12) {
        setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
      };
    });

    $('.btn-prev').on('click', function(e) {
      $('.btn-next').removeClass('button-remove');
      var monthNumber = $('.month').attr('data-month');
      if (monthNumber == 2) {
         $('.btn-prev').addClass('button-remove');
      }
      if (monthNumber > 1) {
        setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
      };
    });

     * Get all dates for current month
     */


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

    $.get("../connect/schedule/schedule_to_name.pte?uuid="+getUrlVars()["id"], function(val) {
      $('#schemaname').text(val);
    })

    $.get("../connect/schedules.pte", function(val) {

      colors = [
        {'background': 'rgb(190, 172, 48)', 'color': '#fff'}
      ]
      val = JSON.parse(val);
      console.log(val);
      for(var i=0; i<=val.length; i++) {
        checked = '';
        if(i==0) checked = 'checked';
        console.log(val[i]);
         $('#schema').append('<li style="list-style-type: none"><label for="'+i+'"><input type="radio" id="'+i+'" name="schedule" value="'+val[i].uuid+'" backcolor="'+colors[i].background+'" color="'+colors[i].color+'" '+checked+'> '+val[i].name+' [<font style="color: rgb(190, 172, 48)">yellow</font>]</label></li>');
      }
    })

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
//      setCurrentDay(month);
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
    function setEvent() {
      $('.day-event').each(function(i) {
        var eventYear = $(this).attr('date-year');
        var eventMonth = $(this).attr('date-month');
        var eventDay = $(this).attr('date-day');
        var id = $(this).attr('id');

        $('tbody.event-calendar tr td[date-year="' + eventYear + '"][date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').attr('id',id).addClass('event').css({"border": "1px solid rgb(147, 159, 195)", "color": $(this).attr('color'), "background-color": $(this).attr('backcolor')});
      });
    };
;
 $('#savecalendar').on('click', function(e) {
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



      console.log('url id: '+getUrlVars()["id"]);
      filename = 10000 + Math.floor(Math.random() * 90000);
      $.post("../connect/schedule/schedule_save.pte?uuid="+getUrlVars()["id"]+"&filename="+filename, JSON.stringify(list)).done(function(data) {
        window.opener.saveCalendarParent(getUrlVars()["id"], filename);
      });
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
  calendar.init();
});
