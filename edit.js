$(document).ready(function () {

    /********************************************
     * Оглавление
     * 1. Вывод информации на вкладки
     * 2. Фильтры
     * 3. Всплывающие окна
     *******************************************/



    /*******************************
     1. ВЫВОД  ИНФОРМАЦИИ НА ВКЛАДКИ
     *******************************/

    /*Вывод информации о расписании*/
    $.getJSON('timetable.json', function (data) {
        /*Составляем карту индексов*/
        var i = 0, keymap = Object.keys(data).reduce(function (carry, key) {
            carry[key] = i++;
            return carry;
        }, {});
        /*Выводим информацию о днях недели. На каждый день недели создаём div*/
        $.each(data, function (key, data) {
            $("div#page-timetable").append('<div class="group-block">' +
                '<div class="lesson-date">' +
                key + '</div>' +
                '<div class="day-block' + keymap[key] + '"' + '>');
            /*Вывыодим информацию о лекции, добавляем кнопки редактирования и удаления.
             Помещаем все лекции, которые проходят в один день, в созданный ранее div*/
            $.each(data, function (index, value) {
                $('<div class="lesson-block"><span class="lesson-time">' + value['time'] + ' - ' + value['time2'] + '</span>' +
                    '<div class="lesson-info">' +
                    '<a href="#" class="lesson-subject">' + value['name'] + '</a>' +
                    '<p class="lesson-school">' + 'Школа ' + value['school'].toLowerCase() + '</p>' +
                    '<p class="lesson-teacher">' + value['teacher'] + '</p>' +
                    '<p class="lesson-place">' + value['classroom'] + '</p>' +
                    '</div></div>'
                ).appendTo("div.day-block" + keymap[key]);
            });
        });
    });




    /**********
     2.ФИЛЬТРЫ
     *********/

    /*Общее расписание*/
    $("div.refresh").click(function(){
        /*Удаляем якорь из URL*/
        window.location.hash = "";
        location.reload();
    });

    /*Фильтр по школам*/
    $("div.filter").click(function(){
        value = $(this).text();
        $("div.group-block").addClass("none");
        $("div.lesson-block").addClass("none");

        $("p.lesson-school").each(function() {
            var school = $(this).text();
            if (school.indexOf(value) != -1){
                $(this).parents(".group-block").removeClass("none");
                $(this).closest(".lesson-block").removeClass("none");
            }
        });
    });



    /******************
     3.ВСПЛЫВАЮЩИЕ ОКНА
     ******************/

    /*Показываем окошко с информацией об учителе*/
    
    $(document).on('mouseover','.lesson-teacher',function(){
        /*Получаем имя и фамилию преподавателя*/
        var theClass = $(this).text();
        var block = $(this);

        /*Перебираем фотографии преподавателей и находим img с alt равным именем и фамилией преподователя*/
        $(".teacher-img").each(function() {
            var teacherName = $(this).attr('alt');

            if (teacherName == theClass) {
                /*Находим ближайшего предка -- div с информацией о преподавателе*/
                block.after($(this).closest(".teacher-info").removeClass("none"));
            }
        });
    });


    /*Скрываем окошко с информацией об учителе*/
    $(document).on('mouseout','.lesson-teacher',function(){
        $(".teacher-info").not('.none').addClass("none");
    });



    /*Показываем окошко с видеозаписью*/
    $("a[class^='video']").click(function(){
        var id = $(this).attr('href');
        loadPopup(id);
    });
    
    var on = 0; //Cостояние окна: 0 - закрыто, 1 - открыто

    /*Открываем окно*/
    function loadPopup(popup) {
        if (on == 0) {
            $(".back").css("opacity", "0.6");
            $(popup).fadeIn(200);
            $(".back").fadeIn(400);
            on = 1;
        }
    }

    /*Закрываем окно*/
    function off() {
        if (on == 1) {
            $(".popup").fadeOut("normal");
            $(".back").fadeOut("normal");
            on = 0;
        }
    }

    /* Закрываем окно при клике вне окна*/
    $("div.back").click(function () {
        /*Ставим видео на паузу*/
        jQuery("iframe").each(function() {
            jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        });
        off();
    });

    /*********************
     4.ОТОБРАЖЕНИЕ ВКЛАДОК
     *********************/

    /*Проверяем хэш, показываем нужную вкладку. По умолчанию расписание*/
    /*    $(window).bind("hashchange", function () {
     ShowPage(location.hash);
     });
     if (location.hash != "") {
     ShowPage(location.hash);
     } else {
     ShowPage("#page-timetable");
     }


     /!* Показываем одну вкладку, скрываем другие *!/
     function ShowPage(pageName) {
     $(pageName).removeClass("none");
     link = ".main-menu a[href^=" + "\'" + pageName + "\'" + "]";
     var currentAttrValue = $(link).attr("href");
     $(".page" + currentAttrValue).fadeIn(200).siblings(".page").hide();
     $(link).parent("li").addClass("active").siblings("li").removeClass("active");
     }*/


});