$(document).ready(function () {

    /**********************************************
     * Оглавление
     * 1. Вывод информации на вкладки
     * 2. Фильтры
     * 3. Отображение вкладок
     * 4. Клики по кнопкам удаления/редактирования
     * 5. Проверки
     * 6. Всплывающие окна
     *********************************************/


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
            $("div#page-edit-timetable").append('<div class="group-block">' +
                '<div class="lesson-date">' +
                key + '</div>' +
                '<div class="day-block' + keymap[key] + '"' + '>');
            /*Вывыодим информацию о лекции, добавляем кнопки редактирования и удаления.
             Помещаем все лекции, которые проходят в один день, в созданный ранее div*/
            $.each(data, function (index, value) {
                $('<div class="lesson-block"><span class="lesson-time">' + value['time'] + '</span>' +
                    '<div class="lesson-info">' +
                    '<a href="#" class="lesson-subject">' + value['name'] + '</a>' +
                    '<p class="lesson-school">' + value['school'] + '</p>' +
                    '<p class="lesson-teacher">' + value['teacher'] + '</p>' +
                    '<p class="lesson-place">' + value['classroom'] + '</p>' +
                    '<button type="button" class="button" id="edit-timetable' + keymap[key] + 'x' + index + '">' +
                    '<i class="fa fa-pencil"></i>' +
                    '</button>' +
                    '<button type="submit" class="button" id="delete-timetable' + keymap[key] + 'x' + index + '">' +
                    '<i class="fa fa-times"></i>' +
                    '</button>' +
                    '</div></div>'
                ).appendTo("div.day-block" + keymap[key]);
            });
        });
    });


    /*Вывод информации о лекциях*/
    $.getJSON('lectures.json', function (data) {
        var a = [];
        /*Составляем карту индексов*/
        var i = 0, keymap = Object.keys(data).reduce(function (carry, key) {
            carry[key] = i++;
            return carry;
        }, {});
        $.each(data, function (key, data) {
            /*Заносим информацию о лекциях в селекты*/
            $("#edit-lecture-school").append('<option value="' + key + '">' + key + '</option>');
            $("#lecture-school").append('<option value="' + key + '">' + key + '</option>');
            $("div#page-lectures").append('<p class="schoolName">' + key + '</p>');
            $.each(data, function (index, value) {
                $("div#page-lectures").append('<div class="container-info"><span class="school-info">Лекция ' + '&laquo;' + value['name'] + '&raquo;' + '; Лектор: ' + value['teacher'] + '</span>'+
                    '<button type="button" class="button" id="edit-lectures' + keymap[key] + 'x' + index + '">' +
                    '<i class="fa fa-pencil"></i>' +
                    '</button>' +
                    '<button type="submit" class="button" id="delete-lectures' + keymap[key] + 'x' + index + '">' +
                    '<i class="fa fa-times"></i>' +
                    '</button>' + '</div>'
                );
                /*Заносим информацию о названии лекций селекты*/
                $("#lecture-timetable").append('<option value="' + value['name'] + '">' + value['name'] + '</option>');
                $("#edit-lecture-timetable").append('<option value="' + value['name'] + '">' + value['name'] + '</option>');
                a.push(value['teacher']);
            });
        });
        /*Избегаем дублирования преподавателей в селектах*/
        var uniqueNames = [];
        $.each(a, function (i, el) {
            if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        /*Заносим информацию о преподавателях в селекты*/
        $.each(uniqueNames, function (index, value) {
            $("#teacher-timetable").append('<option value="' + value + '">' + value + '</option>');
            $("#edit-teacher-timetable").append('<option value="' + value + '">' + value + '</option>');
        });

    });


    /*Вывод информации о школах*/
    $.getJSON('schools.json', function (data) {
        $.each(data, function (index, value) {
            $("div#page-schools").append('<div class="container-info"><span class="school-info">Школа &laquo;' + value['name'] + '&raquo;' + '; Количество студентов: ' + value['students_count'] + '</span>' +
                '<button type="button" class="button" id="edit-schools' + index + '">' +
                '<i class="fa fa-pencil"></i>' +
                '</button>' +
                '<button type="submit" class="button" id="delete-schools' + index + '">' +
                '<i class="fa fa-times"></i>' +
                '</button>' +  '</div>'
            );
            /*Заносим информацию о названии школ и количестве студентов в селекты*/
            $("#school-timetable").append('<option value="' + value['name'] + ', ' + value['students_count'] + '">' + value['name'] + '</option>');
            $("#edit-school-timetable").append('<option value="' + value['name'] + ', ' + value['students_count'] + '">' + value['name'] + '</option>');
        });
    });


    /*Вывод информации об аудиториях*/
    $.getJSON('classrooms.json', function (data) {
        $.each(data, function (index, value) {
            $("div#page-classrooms").append('<div class="container-info"><span class="classroom-info">Аудитория &laquo;' + value['name'] + '&raquo;' + '; Вместимость: ' +
                value['max_students'] + '; Местоположение: ' + value['location'] + '</span>'+
                '<button type="button" class="button" id="edit-classrooms' + index + '">' +
                '<i class="fa fa-pencil"></i>' +
                '</button>' +
                '<button type="submit" class="button" id="delete-classrooms' + index + '">' +
                '<i class="fa fa-times"></i>' +
                '</button>' +  '</div>'
            );
            /*Заносим информацию о названии лекций и её местонахождении в селекты*/
            $("#classroom-timetable").append('<option value="' + value['name'] + ', ' + value['location'] + ', ' + value['max_students'] + '">' + value['name'] + '</option>');
            $("#edit-classroom-timetable").append('<option value="' + value['name'] + ', ' + value['location'] + ', ' + value['max_students'] + '">' + value['name'] + '</option>');
            $("#filter-classrooms").append('<option value="' + value['name'] + ', ' + value['location'] + '">' + value['name'] + '</option>');

        });
    });


    /******************************************
     2. ФИЛЬТРЫ (РАСПИСАНИЯ ЛЕКЦИЙ И АУДИТОРИЙ)
     *****************************************/


    /*Фильтр расписания по датам*/
    $("button[id='filterApply']").click(function () {
        /*Очищаем старый фильтр*/
        $("div[id^='.day-block']").remove();
        $("div.group-block").remove();

        filterFrom = $("#from-timetable").val();
        filterTo = $("#to-timetable").val();

        $.getJSON('timetable.json', function (data) {
            /*Составляем карту индексов*/
            var i = 0, keymap = Object.keys(data).reduce(function (carry, key) {
                carry[key] = i++;
                return carry;
            }, {});
            /*Выводим информацию о днях недели. На каждый день недели создаём div*/
            $.each(data, function (key, data) {
                if ((key >= filterFrom) && (key <= filterTo)) {
                    $("div.add").append('<div class="group-block">' +
                        '<div class="lesson-date">' +
                        key + '</div>' +
                        '<div class="day-block' + keymap[key] + '"' + '>');
                    /*Вывыодим информацию о лекции, добавляем кнопки редактирования и удаления.
                     Помещаем все лекции, которые проходят в один день, в созданный ранее div*/
                    $.each(data, function (index, value) {
                        $("div.day-block" + keymap[key]).append('<div class="lesson-block"><span class="lesson-time">' + value['time'] + '</span>' +
                            '<div class="lesson-info">' +
                            '<a href="#" class="lesson-subject">' + value['name'] + '</a>' +
                            '<p class="lesson-school">' + value['school'] + '</p>' +
                            '<p class="lesson-teacher">' + value['teacher'] + '</p>' +
                            '<p class="lesson-place">' + value['classroom'] + '</p>' +
                            '</div></div>' +
                            '<button type="button" class="button" id="edit-timetable' + keymap[key] + 'x' + index + '">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</button>' +
                            '<button type="submit" class="button" id="delete-timetable' + keymap[key] + 'x' + index + '">' +
                            '<i class="fa fa-times"></i>' +
                            '</button>'
                        );
                    });
                }
            });
        });
    });


    /*Фильтр аудиторий по датам*/
    $("button[id='filterApplyClassrooms']").click(function () {
        var flag = 0;
        $("div[id^='.day-blocks']").remove();
        $("div.group-blocks").remove();
        filterFrom = $("#from-classrooms").val();
        filterTo = $("#to-classrooms").val();
        classroom = $("#filter-classrooms").val();


        $.getJSON('timetable.json', function (data) {
            /*Составляем карту индексов*/
            var i = 0, keymap = Object.keys(data).reduce(function (carry, key) {
                carry[key] = i++;
                return carry;
            }, {});
            /*Выводим информацию о днях недели. На каждый день недели создаём div*/
            $.each(data, function (key, data) {
                if ((key >= filterFrom) && (key <= filterTo)) {
                    $("div.addClassrooms").append('<div class="group-blocks">' +
                        '<div class="lesson-date">' +
                        key + '</div>' +
                        '<div class="day-blocks' + keymap[key] + '"' + '>');
                    /*Вывыодим информацию о лекции, добавляем кнопки редактирования и удаления.
                     Помещаем все лекции, которые проходят в один день, в созданный ранее div*/
                    $.each(data, function (index, value) {
                        if (classroom == value['classroom']) {
                            flag = 1;
                            $("div.day-blocks" + keymap[key]).append('<div class="lesson-block"><span class="lesson-time">' + value['time'] + '</span>' +
                                '<div class="lesson-info">' +
                                '<a href="#" class="lesson-subject">' + value['name'] + '</a>' +
                                '<p class="lesson-school">' + value['school'] + '</p>' +
                                '<p class="lesson-teacher">' + value['teacher'] + '</p>' +
                                '<p class="lesson-place">' + value['classroom'] + '</p>' +
                                '</div></div>' +
                                '<button type="button" class="button" id="edit-timetable' + keymap[key] + 'x' + index + '">' +
                                '<i class="fa fa-pencil"></i>' +
                                '</button>' +
                                '<button type="submit" class="button" id="delete-timetable' + keymap[key] + 'x' + index + '">' +
                                '<i class="fa fa-times"></i>' +
                                '</button>'
                            );
                        }
                        /*Если в аудитории занятий в выбранное время нет, то ничего не показываем*/
                        if (flag == 0) {
                            $("div[id^='.day-blocks']").remove();
                            $("div.group-blocks").remove();
                        }
                    });
                }
            });
        });
        flag = 0;
    });


    /*Сброс фильтра (обновление страницы)*/
    $("button[id^='filterClear']").click(function () {
        window.location.reload();
    });


    showdate("from-classrooms", "to-classrooms");
    showdate("from-timetable", "to-timetable");

    /*Подставляем в фильтр сегодняшнее число, если там ещё не указана дата*/
    function showdate(val1, val2) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        if (($("#" + val1).val() == "") && ($("#" + val2).val() == "")) {
            $("#" + val1).val(today);
            $("#" + val2).val(today);
        }
    }


    /*********************
     3.ОТОБРАЖЕНИЕ ВКЛАДОК
     *********************/


    /*Проверяем хэш, показываем нужную вкладку. По умолчанию расписание*/
    $(window).bind("hashchange", function () {
        ShowPage(location.hash);
    });
    if (location.hash != "") {
        ShowPage(location.hash);
    } else {
        ShowPage("#page-timetable");
    }


    /* Показываем одну вкладку, скрываем другие */
    function ShowPage(pageName) {
        $(pageName).removeClass("none");
        link = ".main-menu a[href^=" + "\'" + pageName + "\'" + "]";
        var currentAttrValue = $(link).attr("href");
        $(".page" + currentAttrValue).fadeIn(200).siblings(".page").hide();
        $(link).parent('li').addClass('active').siblings("li").removeClass('active');
    }


    /******************************************************
     4.КЛИКИ ПО КНОПКАМ УДАЛЕНИЯ/РЕДАКТИРОВАНИЯ/ДОБАВЛЕНИЯ/
     *****************************************************/

    /*Клик по кнопке удаления аудитории*/
    $('body').on('click', "button[id^='delete-classrooms']", function () {

        var value = $(this).attr('id').replace('delete-classrooms', '');
        $.ajax({
            type: "POST",
            url: "index.php",
            data: {deleteClassroom: value}
        }).done(function () {
            window.location.reload();
        }).fail(function () {
            console.log('deleteClassroom fail');
        });
    });

    /*Клик по кнопке удаления школы*/
    $('body').on('click', "button[id^='delete-schools']", function () {
        var value = $(this).attr('id').replace('delete-schools', '');
        $.ajax({
            type: "POST",
            url: "index.php",
            data: {deleteSchool: value}
        }).done(function () {
            window.location.reload();
        }).fail(function () {
            console.log('deleteSchool fail');
        });
    });

    /*Клик по кнопке удаления лекции*/
    $('body').on('click', "button[id^='delete-lectures']", function () {
        var arr = $(this).attr('id').replace('delete-lectures', '');
        var arr2 = arr.split('x');
        value1 = arr2[0];
        value2 = arr2[1];
        $.ajax({
            type: "POST",
            url: "index.php",
            data: ({deleteLecture1: value1, deleteLecture2: value2})
        }).done(function () {
            window.location.reload();
        }).fail(function () {
            console.log('deleteLecture fail');
        });
    });

    /*Клик по кнопке удаления расписания*/
    $('body').on('click', "button[id^='delete-timetable']", function () {
        var arr = $(this).attr('id').replace('delete-timetable', '');
        var arr2 = arr.split('x');
        value1 = arr2[0];
        value2 = arr2[1];
        $.ajax({
            type: "POST",
            url: "index.php",
            data: ({deleteTimetable1: value1, deleteTimetable2: value2})
        }).done(function () {
            window.location.reload();
        }).fail(function () {
            console.log('deleteTimetable fail');
        });
    });

    /*Клик по кнопке редактирования аудитории*/
    $('body').on('click', "button[id^='edit-classrooms']", function () {
        var id = "edit-classrooms";
        var val = $(this).attr('id').replace('edit-classrooms', '');
        $("#edit-index").val(val);
        $.getJSON('classrooms.json', function (data) {
            $("#edit-classrooms-name").val(data[val]['name']);
            $("#edit-students-capacity").val(data[val]['max_students']);
            $("#edit-location").val(data[val]['location']);
        });
        loadPopup(id);
    });


    /*Клик по кнопке редактирования школы*/
    $('body').on('click', "button[id^='edit-schools']", function () {
        var id = "edit-schools";
        var val = $(this).attr('id').replace('edit-schools', '');
        $("#edit-index-school").val(val);
        $.getJSON('schools.json', function (data) {
            $("#edit-school-name").val(data[val]['name']);
            $("#edit-students-count").val(data[val]['students_count']);
            $("#old-school-name").val(data[val]['name']);
        });
        loadPopup(id);
    });

    /*Клик по кнопке редактирования расписания*/
    $('body').on('click', "button[id^='edit-timetable']", function () {
        var id = "edit-timetable";
        var arr = $(this).attr('id').replace('edit-timetable', '');
        var arr2 = arr.split('x');
        var value1 = arr2[0];
        var value2 = arr2[1];
        $("#edit-index-timetable").val(value2);
        $.getJSON('timetable.json', function (data) {
            var keys = Object.keys(data);
            var obj = keys[value1];
            $("#edit-date-timetable").val(obj);
            $("#edit-time-timetable").val(data[obj][value2]['time']);
        });
        loadPopup(id);
    });

    /*Клик по кнопке редактирования лекции*/
    $('body').on('click', "button[id^='edit-lectures']", function () {
        var id = "edit-lectures";
        var arr = $(this).attr('id').replace('edit-lectures', '');
        var arr2 = arr.split('x');
        var value1 = arr2[0];
        var value2 = arr2[1];
        $("#edit-index-lecture").val(value2);
        $.getJSON('lectures.json', function (data) {
            var keys = Object.keys(data);
            var obj = keys[value1];
            $("#edit-old-school").val(obj);
            $("#edit-lecture-name").val(data[obj][value2]['name']);
            $("#edit-lecture-teacher").val(data[obj][value2]['teacher']);
        });
        loadPopup(id);
    });

    /*Всплывающее окно для добевления аудитории/школы/лекции/расписания*/
    $("button[id^='moderate-']").click(function () {
        var idButton = $(this).attr('id');
        var idPopup = $("." + idButton).attr('id');
        loadPopup(idPopup);
    });


    /***************************************************
     5.ПРОВЕРКИ ПРИ ДОБАВЛЕНИИ/РЕДАКТИРОВАНИИ РАСПИСАНИЯ
     ****************************************************/


    /*Проверка корректности данных при добавлении расписания*/
    $("#save-new-timetable").click(function () {
        event.preventDefault();
        var error = 0; // индекс ошибки
        var err_text = ""; //текст ошибки
        var dateTimetable = String($("#date-timetable").val());
        var timeTimetable = String($("#time-timetable").val());
        //var lectureTimetable = $("#lecture-timetable").val();
        var teacherTimetable = $("#teacher-timetable").val();
        var schoolTimetable = $("#school-timetable").val();
        var classroomTimetable = $("#classroom-timetable").val();

        var classroomArr = classroomTimetable.split(',');
        var lenClassroom = classroomArr.length;
        var studentCount = classroomArr[lenClassroom - 1]; // Вместимость аудитории
        var classroomName = classroomArr[0];

        for (i = 1; i < lenClassroom - 1; i++) {
            classroomName = classroomName + ', ' + classroomArr[i]; // Название аудитории
        }



        count = 0; // Количество студентов, которое планируется поместить в аудиторию
        var arr = []; // Временный массив
        var arr2 = []; // !!! Тут будут находится школы
        var arr3 = []; // Временный массив
        var str = ""; // Временная строка
        len = schoolTimetable.length;

        /*Узнаём общее количество студентов в школах*/
        for (i = 0; i < len; i++) {
            arr = schoolTimetable[i].split(', ');
            arr.splice(0, 1);
            str = +arr.join();
            count = count + str;
        }

        /*Создаём массив с названиями школ*/
        for (i = 0; i < len; i++) {
            arr3 = schoolTimetable[i].split(', ');
            arr3.splice(1, 1);
            str = arr3.join();
            arr2.push(str);
        }
        /*Проверка на допустимое кол-во студентов*/
        if (count > studentCount) {
            setError("1");
        }

        $.getJSON('timetable.json', function (data) {

            if (data[dateTimetable] != undefined) {
                lenkeys = (Object.keys(data[dateTimetable]).length);

                /*Проверка, есть ли уже в выбранной аудитории лекции в это же время*/
                for (i = 0; i < lenkeys; i++) {
                    if ((classroomName == data[dateTimetable][i]["classroom"]) &&
                        (timeTimetable == data[dateTimetable][i]["time"])) {
                        setError("2");
                    }
                    /*Проверка, есть ли уже у какой-либо из выбранных школ другие лекции в это же время*/
                    for (j = 0; j < len; j++) {
                        if ((data[dateTimetable][i]["school"].indexOf(arr2[j]) != -1) &&
                            (timeTimetable == data[dateTimetable][i]["time"])) {
                            setError("3");
                        }
                    }
                    for (k = 0; k < len; k++) {
                        if ((teacherTimetable == data[dateTimetable][i]["teacher"]) &&
                            (timeTimetable == data[dateTimetable][i]["time"])) {
                            setError("7");
                        }
                    }
                }
            }
        });



        function setError(result) {
            error = result;
        }

        if (dateTimetable == "") {
            setError("4");
            err_text = "Укажите дату лекции!";
        }
        if (timeTimetable == "") {
            setError("5");
            err_text = "Укажите время лекции!";
        }
        if (schoolTimetable == "") {
            setError("6");
        }

        setTimeout(function () {
            if (error == 0) { // если ошибок нет то отправляем данные
                $("#newTimetable").submit();
            }
            else {
                if (error == 1) {
                    err_text = "В выбранную аудиторию не поместятся все студенты!";
                }
                if (error == 2) {
                    err_text = "В это время в выбранной аудитории уже проводится лекция!";
                }
                if (error == 3) {
                    err_text = "Для одной школы не могут одновременно проходить две лекции!";
                }
                if (error == 4) {
                    err_text = "Укажите дату лекции!";
                }
                if (error == 5) {
                    err_text = "Укажите время лекции!";
                }
                if (error == 6) {
                    err_text = "Выберите школу!";
                }
                if (error == 7) {
                    err_text = "Один преподаватель не может одновременно вести несколько лекций!";
                }
                $(".messenger").html(err_text).fadeIn();
                error = 0;
                return false; //если в форме встретились ошибки, то не отправляем её
            }
        }, 200);
    });

    /*Проверка корректности данных при редактировании расписания*/
    $("#save-edited-timetable").click(function () {
        event.preventDefault();
        var error = 0; // индекс ошибки
        var err_text = ""; //текст ошибки
        var dateTimetable = String($("#edit-date-timetable").val());
        var timeTimetable = String($("#edit-time-timetable").val());
        //var lectureTimetable = $("#lecture-timetable").val();
        var teacherTimetable = $("#teacher-timetable").val();
        var schoolTimetable = $("#edit-school-timetable").val();
        var classroomTimetable = $("#edit-classroom-timetable").val();

        var classroomArr = classroomTimetable.split(',');
        var lenClassroom = classroomArr.length;
        var studentCount = classroomArr[lenClassroom - 1]; // Вместимость аудитории
        var classroomName = classroomArr[0];

        for (i = 1; i < lenClassroom - 1; i++) {
            classroomName = classroomName + ', ' + classroomArr[i]; // Название аудитории
        }

        count = 0; // Количество студентов, которое планируется поместить в аудиторию
        var arr = []; // Временный массив
        var arr2 = []; // !!! Тут будут находится школы
        var arr3 = []; // Временный массив
        var str = ""; // Временная строка
        len = schoolTimetable.length;

        /*Узнаём общее количество студентов в школах*/
        for (i = 0; i < len; i++) {
            arr = schoolTimetable[i].split(', ');
            arr.splice(0, 1);
            str = +arr.join();
            count = count + str;
        }

        /*Создаём массив с названиями школ*/
        for (i = 0; i < len; i++) {
            arr3 = schoolTimetable[i].split(', ');
            arr3.splice(1, 1);
            str = arr3.join();
            arr2.push(str);
        }
        /*Проверка на допустимое кол-во студентов*/
        if (count > studentCount) {
            setError("1");
        }

        $.getJSON('timetable.json', function (data) {
            if (data[dateTimetable] != undefined) {
                lenkeys = (Object.keys(data[dateTimetable]).length);

                /*Проверка, есть ли уже в выбранной аудитории лекции в это же время*/
                for (i = 0; i < lenkeys; i++) {
                    if ((classroomName == data[dateTimetable][i]["classroom"]) &&
                        (timeTimetable == data[dateTimetable][i]["time"])) {
                        setError("2");
                    }
                    /*Проверка, есть ли уже у какой-либо из выбранных школ другие лекции в это же время*/
                    for (j = 0; j < len; j++) {
                        if ((data[dateTimetable][i]["school"].indexOf(arr2[j]) != -1) &&
                            (timeTimetable == data[dateTimetable][i]["time"])) {
                            setError("3");
                        }
                    }
                    for (k = 0; k < len; k++) {
                        if ((teacherTimetable == data[dateTimetable][i]["teacher"]) &&
                            (timeTimetable == data[dateTimetable][i]["time"])) {
                            setError("7");
                        }
                    }
                }
            }
        });

        function setError(result) {
            error = result;
        }

        if (dateTimetable == "") {
            setError("4");
            err_text = "Укажите дату лекции!";
        }
        if (timeTimetable == "") {
            setError("5");
            err_text = "Укажите время лекции!";
        }
        if (schoolTimetable == "") {
            setError("6");

        }

        setTimeout(function () {
            if (error == 0) { // если ошибок нет то отправляем данные
                $("#editTimetable").submit();
            }
            else {
                if (error == 1) {
                    err_text = "В выбранную аудиторию не поместятся все студенты!";
                }
                if (error == 2) {
                    err_text = "В это время в выбранной аудитории уже проводится лекция!";
                }
                if (error == 3) {
                    err_text = "Для одной школы не могут одновременно проходить две лекции!";
                }
                if (error == 4) {
                    err_text = "Укажите дату лекции!";
                }
                if (error == 5) {
                    err_text = "Укажите время лекции!";
                }
                if (error == 6) {
                    err_text = "Выберите школу!";
                }
                if (error == 7) {
                    err_text = "Один преподаватель не может одновременно вести несколько лекций!";
                }
                $(".messenger").html(err_text).fadeIn();
                error = 0;
                return false; //если в форме встретились ошибки, то не отправляем её
            }
        }, 200);
    });


    /******************
     6.ВСПЛЫВАЮЩИЕ ОКНА
     ******************/


    var on = 0; //Cостояние окна: 0 - закрыто, 1 - открыто

    /*Открываем окно*/
    function loadPopup(popup) {
        if (on == 0) {
            $(".back").css("opacity", "0.6");
            $("#" + popup).fadeIn(200);
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
        off();
    });

    /* Закрываем окно при клике по крестику*/
    $("div.close").click(function () {
        off();
    });

});
