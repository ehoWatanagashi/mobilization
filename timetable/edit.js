$(document).ready(function () {

    /********************************************
     * Оглавление
     * 1. Отображение вкладок
     * 2. Фильтры
     * 3. Всплывающие окна
     *******************************************/


    /*********************
     1.ОТОБРАЖЕНИЕ ВКЛАДОК
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
            console.log('ура2');
                $(this).parents(".group-block").removeClass("none");
                $(this).closest(".lesson-block").removeClass("none");
            }
        });
    });



    /******************
     3.ВСПЛЫВАЮЩИЕ ОКНА
     ******************/

    /*Показываем окошко с информацией об учителе*/
    $("span[class^='lesson-teacher-']").mouseover(function(){
        var theClass = $(this).attr('class').replace('lesson-teacher-', '');
        $("."  + theClass).removeClass("none");
        $(this).append($("."  + theClass).fadeIn());
    });

    /*Скрываекм окошко с информацией об учителе*/
    $("span[class^='lesson-teacher-']").mouseout(function(){
        var theClass = $(this).attr('class').replace('lesson-teacher-', '');
        $("."  + theClass).addClass("none");

    });
    
    /*Скрываекм окошко с информацией об учителе*/
    $(".teacher-info").mouseout(function(){
        var theClass = $(this).attr('class');
        $("."  + theClass).addClass("none");
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
});