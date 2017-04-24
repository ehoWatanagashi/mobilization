<!doctype html>
<html lang="ru">
<head>
    <title>Редактирование расписания | Мобилизация 2017</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/Style2.css?4422213">

</head>
<body>
<?php
/* Удаляем get-параметры из URL*/
function clearUrl($url)
{
    return preg_replace('/^([^?]+)(\?.*?)?(#.*)?$/', '$1$3', $url);
}

/*Получаем данные из json-файла*/
function get($file)
{
    return json_decode(file_get_contents("$file"), true);
}

/*Дописываем данные в json-файл*/
function put($file, $value)
{
    return file_put_contents("$file", json_encode($value));
}

/*Добавление новой школы*/
if (isset($_GET['school-name'])) {
    $schoolName = htmlspecialchars($_GET['school-name']);
    $schoolStudentsCount = (int)$_GET['students-count'];

    /*Получаем данные из формы и записываем их в json-файл*/
    $file = "schools.json";
    $jsonSchools = get($file);

    $jsonSchools[] = [
        'name' => "$schoolName",
        'students_count' => "$schoolStudentsCount",
    ];
    put($file, $jsonSchools);
    unset($jsonSchools);

    /*Добавляем школу в раздел лекций*/
    $file1 = "lectures.json";
    $jsonLectures = get($file1);
    $jsonLectures[$schoolName] = [];
    put($file1, $jsonLectures);
    unset($jsonLectures);

    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-schools";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}

/*Добавление новой аудитории*/
if (isset($_GET['classrooms-name'])) {
    $classroomName = htmlspecialchars($_GET['classrooms-name']);
    $classroomCapacity = (int)$_GET['students-capacity'];
    $classroomLocation = htmlspecialchars($_GET['location']);

    /*Получаем данные из формы и записываем их в json-файл*/
    $file = "classrooms.json";
    $jsonClassrooms = get($file);
    $jsonClassrooms[] = [
        'name' => "$classroomName",
        'max_students' => "$classroomCapacity",
        'location' => "$classroomLocation",
    ];
    put($file, $jsonClassrooms);
    unset($jsonClassrooms);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-classrooms";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}


/*Добавление новой лекции*/
if (isset($_GET['lecture-name'])) {
    $lectureName = htmlspecialchars($_GET['lecture-name']);
    $lectureTeacher = htmlspecialchars($_GET['lecture-teacher']);
    $lectureSchool = htmlspecialchars($_GET['lecture-school']);

    $file = "lectures.json";
    $jsonLectures = get($file);
    $jsonLectures[$lectureSchool][] = [
        'name' => "$lectureName",
        'teacher' => "$lectureTeacher",
    ];
    put($file, $jsonLectures);
    unset($jsonLectures);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-lectures";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}

/*Добавление расписания*/

if (isset($_GET['date-timetable'])) {
    $TTDate = htmlspecialchars($_GET['date-timetable']);
    $TTTime = htmlspecialchars($_GET['time-timetable']);
    $TTLecture = htmlspecialchars($_GET['lecture-timetable']);
    $TTSchool = $_GET['school-timetable'];
    $TTTeacher = htmlspecialchars($_GET['teacher-timetable']);
    $TTClassroom = htmlspecialchars($_GET['classroom-timetable']);

    //Если выбрано несколько школ, то объединяем элементы массива в строку.
    if (is_array($TTSchool)) {
        $TTSchool = implode(",", $TTSchool);
    }

    // Удаляем информацию о количестве студентов в школе
    $TTSchoolArr = explode(",", $TTSchool);
    $len = count($TTSchoolArr);

    for ($i = 1; $i < $len; $i += 2) {
        unset ($TTSchoolArr[$i]);
    }
    $TTSchool = implode(", ", $TTSchoolArr);

    // Удаляем информацию о вместимости аудитории
    $TTClassroomArr = explode(",", $TTClassroom);
    $len2 = count($TTClassroomArr);
    unset ($TTClassroomArr[$len2 - 1]);
    $TTClassroom = implode(",", $TTClassroomArr);
    $file = "timetable.json";
    $jsonTimetable = get($file);
    $jsonTimetable[$TTDate][] = [
        'time' => "$TTTime",
        'name' => "$TTLecture",
        'school' => "$TTSchool",
        'teacher' => "$TTTeacher",
        'classroom' => "$TTClassroom",
    ];
    ksort($jsonTimetable);
    put($file, $jsonTimetable);
    unset($jsonLectures);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-edit-timetable";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}


/*Удаление аудитории*/

if (isset($_POST['deleteClassroom'])) {
    $delClassroom = (int)$_POST['deleteClassroom'];
    $file = "classrooms.json";
    $jsonClassrooms = get($file);
    unset($jsonClassrooms[$delClassroom]);
    put($file, $jsonClassrooms);
    unset($jsonClassrooms);
};

/*Удаление школы*/

if (isset($_POST['deleteSchool'])) {
    $delSchool = (int)$_POST['deleteSchool'];
    $file = "schools.json";
    $jsonSchools = get($file);
    $key = $jsonSchools[$delSchool]["name"];
    unset($jsonSchools[$delSchool]);
    put($file, $jsonSchools);
    unset($jsonSchools);
    /*удаляем школу из раздела лекций*/
    $file1 = "lectures.json";
    $jsonLectures = get($file1);
    unset($jsonLectures[$key]);
    put($file1, $jsonLectures);
    unset($jsonLectures);
};

/*Удаление лекции*/

if (isset($_POST['deleteLecture1'])) {
    $delLecture1 = (int)$_POST['deleteLecture1'];
    $delLecture2 = (int)$_POST['deleteLecture2'];
    $file = "lectures.json";
    $jsonLecture = get($file);
    $keys = array_keys($jsonLecture);
    $schoolName = $keys[$delLecture1];
    unset($jsonLecture[$schoolName][$delLecture2]);
    put($file, $jsonLecture);
    unset($jsonLecture);
};

/*Удаление расписания*/

if (isset($_POST['deleteTimetable1'])) {
    $delTimetable1 = (int)$_POST['deleteTimetable1'];
    $delTimetable2 = (int)$_POST['deleteTimetable2'];
    $file = "timetable.json";
    $jsonTimetable = get($file);
    $keys = array_keys($jsonTimetable);
    $dateTimetable = $keys[$delTimetable1];


    echo $keys;
    echo $dateTimetable;
    echo $jsonTimetable[$dateTimetable];
    print_r($jsonTimetable[$dateTimetable]);
    unset($jsonTimetable[$dateTimetable][$delTimetable2]);

    /*если в этот день больше лекций нет, то удаляем и сам день*/
    if (count($jsonTimetable[$dateTimetable]) == 0) {
        unset($jsonTimetable[$dateTimetable]);
    }
    put($file, $jsonTimetable);
    unset($jsonTimetable);
}

/*Редактирование  аудитории*/
if (isset($_GET['edit-classrooms-name'])) {
    $classroomName = htmlspecialchars($_GET['edit-classrooms-name']);
    $classroomCapacity = (int)$_GET['edit-students-capacity'];
    $classroomLocation = htmlspecialchars($_GET['edit-location']);
    $classroomIndex = (int)$_GET['edit-index'];

    $file = "classrooms.json";
    $jsonClassrooms = get($file);
    $jsonClassrooms[$classroomIndex] = [
        'name' => "$classroomName",
        'max_students' => "$classroomCapacity",
        'location' => "$classroomLocation",
    ];
    put($file, $jsonClassrooms);
    unset($jsonClassrooms);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-classrooms";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}

/*Редактирование  школы*/
if (isset($_GET['edit-school-name'])) {
    $SchoolName = htmlspecialchars($_GET['edit-school-name']);
    $SchoolCapacity = (int)$_GET['edit-students-count'];
    $SchoolIndex = (int)$_GET['edit-index-school'];
    $SchoolOldName = htmlspecialchars($_GET['old-school-name']);

    $file = "schools.json";
    $jsonSchools = get($file);
    $jsonSchools[$SchoolIndex] = [
        'name' => "$SchoolName",
        'students_count' => "$SchoolCapacity",
    ];
    put($file, $jsonSchools);
    unset($jsonSchools);

    /*Редактируем школу в разделе лекций*/
    $file1 = "lectures.json";
    $jsonLectures = get($file1);
    $jsonLectures[$SchoolName] = $jsonLectures[$SchoolOldName];
    ksort($jsonLectures);
    unset($jsonLectures[$SchoolOldName]);
    put($file1, $jsonLectures);
    unset($jsonLectures);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-schools";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}


/*Редактирование  расписания*/
if (isset($_GET['edit-time-timetable'])) {
    $TTEditTime = htmlspecialchars($_GET['edit-time-timetable']);
    $TTEditLecture = htmlspecialchars($_GET['edit-lecture-timetable']);
    $TTEditSchool = $_GET['edit-school-timetable'];
    $TTEditTeacher = htmlspecialchars($_GET['edit-teacher-timetable']);
    $TTEditClassroom = htmlspecialchars($_GET['edit-classroom-timetable']);
    $TTEeditDate = $_GET['edit-date-timetable'];
    $TTEditIndex2 = $_GET['edit-index-timetable'];

    //Если выбрано несколько школ, то объединяем элементы массива в строку.
    if (is_array($TTEditSchool)) {
        $TTEditSchool = implode(",", $TTEditSchool);
    }

    // Удаляем информацию о количестве студентов в школе
    $TTEditSchoolArr = explode(",", $TTEditSchool);
    $len = count($TTEditSchoolArr);
    for ($i = 1; $i < $len; $i += 2) {
        unset ($TTEditSchoolArr[$i]);
    }
    $TTEditSchool = implode(", ", $TTEditSchoolArr);

    // Удаляем информацию о вместимости аудитории
    $TTEditClassroomArr = explode(",", $TTEditClassroom);
    unset ($TTEditClassroomArr[2]);
    $TTEditClassroom = implode(", ", $TTEditClassroomArr);

    $file = "timetable.json";
    $jsonTTEdit = get($file);
    $jsonTTEdit[$TTEeditDate][$TTEditIndex2] = [
        'time' => "$TTEditTime",
        'name' => "$TTEditLecture",
        'school' => "$TTEditSchool",
        'teacher' => "$TTEditTeacher",
        'classroom' => "$TTEditClassroom",
    ];
    put($file, $jsonTTEdit);
    unset($jsonTTEdit);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-edit-timetable";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
}

/*Редактирование лекции*/

if (isset($_GET['edit-lecture-school'])) {
    $editNewSchool = htmlspecialchars($_GET['edit-lecture-school']);
    $editOldSchool = htmlspecialchars($_GET['edit-old-school']);
    $editNewLecture = htmlspecialchars($_GET['edit-lecture-name']);
    $editNewTeacher = htmlspecialchars($_GET['edit-lecture-teacher']);
    $editLectureIndex = (int)$_GET['edit-index-lecture'];

    $file = "lectures.json";
    $jsonLecture = get($file);

    unset($jsonLecture[$editOldSchool][$editLectureIndex]);
    $jsonLecture[$editNewSchool][] = [
        'name' => "$editNewLecture",
        'teacher' => "$editNewTeacher",
    ];
    ksort($jsonLecture);
    put($file, $jsonLecture);
    unset($jsonLecture);
    $link = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "#page-lectures";
    $newUrl = clearUrl($link);
    header("location: $newUrl");
};
?>

<header class="main-header">
    <div class="header-top">
        <a class="logo" href="https://www.yandex.ru/">Яндекс</a>
        <nav class="main-nav">
            <ul class="main-menu">
                <li><a href="#page-timetable">Образец</a></li>
                <li><a href="#page-edit-timetable">Расписание</a></li>
                <li><a href="#page-lectures">Лекции</a></li>
                <li><a href="#page-schools">Школы</a></li>
                <li><a href="#page-classrooms">Аудитории</a></li>
            </ul>
        </nav>
    </div>
</header>
<div class="container page none" id="page-timetable">
    <div class="group-block">
        <div class="lesson-date">
            10 апр., пн
        </div>
        <div class="day-block">
            <div class="lesson-block ended">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="btn">Смотреть</a>
                    <a href="#" class="lesson-subject">Лекция 1. Адаптивная вёрстка</a>
                    <p class="lesson-school">Школа разработки интерфейсов;<span
                            class="lesson-teacher">Дмитрий Душкин</span></p>
                </div>
            </div>
        </div>

    </div>
    <div class="group-block">
        <div class="lesson-date">
            11 апр., вт
        </div>
        <div class="day-block ended">
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="btn">Смотреть</a>
                    <a href="#" class="lesson-subject">Лекция 2. Работа с сенсорным пользовательским вводом</a>
                    <p class="lesson-school">Школа разработки интерфейсов;<span
                            class="lesson-teacher">Дмитрий Душкин</span></p>
                </div>
            </div>

            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="btn">Смотреть</a>
                    <a href="#" class="lesson-subject">Лекция 1. Java Blitz (Часть 1)</a>
                    <p class="lesson-school">Школа мобильной разработки;<span
                            class="lesson-teacher">Эдуард Мацуков</span></p>
                </div>
            </div>
        </div>

    </div>
    <div class="group-block">
        <div class="lesson-date">
            14 апр., пт
        </div>
        <div class="day-block">
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 1. Идея, исследование, концепт (Часть 1)</a>
                    <p class="lesson-school">Школа мобильного дизайна</p>
                    <p class="lesson-teacher">Антон Тен</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 14, ауд. 42</p>
                </div>
            </div>
        </div>
    </div>
    <div class="group-block">
        <div class="lesson-date">
            17 апр., пн
        </div>
        <div class="day-block">
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 2.Git & Workflow</a>
                    <p class="lesson-school">Школа мобильной разработки</p>
                    <p class="lesson-teacher">Максим Васильев</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 16, ауд. 214</p>
                </div>
            </div>
        </div>
    </div>

    <div class="group-block">
        <div class="lesson-date">
            18 апр., вт
        </div>
        <div class="day-block">
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 3. Мультимедиа: возможности браузера</a>
                    <p class="lesson-school">Школа мобильной разработки, Школа разработки интерфейсов</p>
                    <p class="lesson-teacher">Дмитрий Складнов</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 16, ауд. 242</p>
                </div>
            </div>
        </div>
    </div>
    <div class="group-block">
        <div class="lesson-date">
            20 апр., чт
        </div>
        <div class="day-block">
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 2. Идея, исследование, концепт (Часть 2)</a>
                    <p class="lesson-school">Школа мобильного дизайна</p>
                    <p class="lesson-teacher">Антон Тен</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 14, ауд. 29</p>
                </div>
            </div>
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 4. Java Blitz (Часть 2)</a>
                    <p class="lesson-school">Школа мобильной разработки</p>
                    <p class="lesson-teacher">Дмитрий Складнов</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 16, ауд. 242</p>
                </div>
            </div>
            <div class="lesson-block">
                <span class="lesson-time">18:00-21:00</span>
                <div class="lesson-info">
                    <a href="#" class="lesson-subject">Лекция 4. Особенности проектирования мобильных интерфейсов</a>
                    <p class="lesson-school">Школа разработки интерфейсов</p>
                    <p class="lesson-teacher">Васюнин Николай</p>
                    <p class="lesson-place">ул. Льва Толстого, д. 16, ауд. 212</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="back"></div>
<div class="container page none" id="page-edit-timetable">
    <div class="row">
        <span class="filter-label">Добавить лекцию</span>
    <button type="button" class="button" id="moderate-create-timetable">
        <i class="fa fa-plus fa-lg"></i>
    </button>
        </div>
    <div class="filter">
        <p>Фильтр по дате:</p>
        <label for="from-timetable">От:</label>
        <input type="date" id="from-timetable" name="from-timetable" value=""><br>
        <label for="to-timetable">До:</label>
        <input type="date" id="to-timetable" name="to-timetable" value=""><br>
        <button id="filterApply">Применить</button>
        <button id="filterClear">Обнулить</button>
    </div>
    <div class="popup moderate-create-timetable none" id="new-timetable">
        <form id="newTimetable">
            <div class="messenger"></div>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <div class="form-group">
                    <label for="date-timetable">Дата проведения лекции</label>
                    <input type="date" id="date-timetable" name="date-timetable" required><br>
                </div>
                <div class="form-group">
                    <label for="time-timetable">Время проведения</label>
                    <input type="time" id="time-timetable" name="time-timetable" required><br>
                </div>
                <div class="form-group">
                    <label for="lecture-timetable">Название леции</label>
                    <select id="lecture-timetable" name="lecture-timetable" required>
                    </select>
                </div>
                <div class="form-group">
                    <label for="school-timetable">Для каких школ читается</label><br>
                    <select multiple id="school-timetable" name="school-timetable[]" required>
                    </select>
                </div>
                <div class="form-group">
                    <label for="teacher-timetable">Лектор</label>
                    <select id="teacher-timetable" name="teacher-timetable" required>
                    </select>
                </div>
                <div class="form-group">
                    <label for="classroom-timetable">Аудитория</label>
                    <select id="classroom-timetable" name="classroom-timetable" required>
                    </select>
                </div>
                <button type="submit" class="btn btn-default" id="save-new-timetable">Сохранить</button>
        </form>
    </div>
</div>
<div class="popup moderate-edit-timetable none" id="edit-timetable">
    <form id="editTimetable">
        <div class="messenger"></div>
        <div class="close"><i class="fa fa-times fa-2x"></i></div>
        <div class="form-group">
            <div class="form-group">
                <label for="edit-time-timetable">Время проведения</label>
                <input type="time" id="edit-time-timetable" name="edit-time-timetable" required><br>
            </div>
            <div class="form-group">
                <label for="edit-lecture-timetable">Название леции</label>
                <select id="edit-lecture-timetable" name="edit-lecture-timetable" required>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-school-timetable">Для каких школ читается</label><br>
                <select multiple id="edit-school-timetable" name="edit-school-timetable[]" required>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-teacher-timetable">Лектор</label>
                <select id="edit-teacher-timetable" name="edit-teacher-timetable" required>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-classroom-timetable">Аудитория</label>
                <select id="edit-classroom-timetable" name="edit-classroom-timetable" required>
                </select>
            </div>
            <input type="hidden" id="edit-date-timetable" name="edit-date-timetable" value="">
            <input type="hidden" id="edit-index-timetable" name="edit-index-timetable" value="">
            <button type="submit" class="btn btn-default" id="save-edited-timetable">Сохранить</button>
    </form>
</div>
</div>
</div>
<div class="add"></div>
<div class="container page none" id="page-lectures">
    <button type="button" class="button" id="moderate-create-lectures">
        <i class="fa fa-plus fa-lg"></i>
    </button>
    <div class="popup moderate-create-lectures none" id="new-lectures">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="lecture-school">Для какой школы читается</label>
                <select id="lecture-school" name="lecture-school" required>
                </select>
            </div>
            <div class="form-group">
                <label for="lecture-name">Название леции</label>
                <input type="text" class="form-control" id="lecture-name" name="lecture-name" required>
            </div>
            <div class="form-group">
                <label for="lecture-teacher">Лектор</label>
                <input type="text" class="form-control" id="lecture-teacher" name="lecture-teacher" required>
            </div>
            <button type="submit" class="btn btn-default" id="save-new-lecture">Сохранить</button>
        </form>
    </div>
    <div class="popup edit-lectures none" id="edit-lectures">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="edit-lecture-school">Для какой школы читается</label>
                <select id="edit-lecture-school" name="edit-lecture-school" required>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-lecture-name">Название леции</label>
                <input type="text" class="form-control" id="edit-lecture-name" name="edit-lecture-name" required>
            </div>
            <div class="form-group">
                <label for="edit-lecture-teacher">Лектор</label>
                <input type="text" class="form-control" id="edit-lecture-teacher" name="edit-lecture-teacher" required>
            </div>
            <input type="hidden" id="edit-index-lecture" name="edit-index-lecture" value="">
            <input type="hidden" id="edit-old-school" name="edit-old-school" value="">
            <button type="submit" class="btn btn-default" id="edit-lecture">Сохранить</button>
        </form>
    </div>
</div>
<div class="container page none" id="page-schools">
    <button type="button" class="button" id="moderate-create-schools">
        <i class="fa fa-plus fa-lg"></i>
    </button>
    <div class="popup moderate-create-schools none" id="new-schools">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="school-name">Название школы</label>
                <input type="text" class="form-control" id="school-name" name="school-name" required>
            </div>
            <div class="form-group">
                <label for="students-count">Количество студентов</label>
                <input type="number" class="form-control" id="students-count" name="students-count" required>
            </div>
            <button type="submit" class="btn btn-default" id="save-new-student">Сохранить</button>
        </form>
    </div>
    <div class="popup edit-schools none" id="edit-schools">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="edit-school-name">Название школы</label>
                <input type="text" class="form-control" id="edit-school-name" name="edit-school-name" required>
            </div>
            <div class="form-group">
                <label for="edit-students-count">Количество студентов</label>
                <input type="number" class="form-control" id="edit-students-count" name="edit-students-count" required>
            </div>
            <input type="hidden" id="edit-index-school" name="edit-index-school" value="">
            <input type="hidden" id="old-school-name" name="old-school-name" value="">
            <button type="submit" class="btn btn-default" id="save-schools">Сохранить</button>
        </form>
    </div>
</div>
<div class="container page none" id="page-classrooms">
    <span class="filter-label">Добавить аудиторию</span>
    <button type="button" class="button" id="moderate-create-classrooms">
        <i class="fa fa-plus fa-lg"></i>
    </button>
    <div class="row">
        <div class="filter">
            <p>Фильтр по дате:</p>
            <label for="from-classrooms">От:</label>
            <input type="date" id="from-classrooms" name="from-classrooms" value=""><br>
            <label for="to-classrooms">До:</label>
            <input type="date" id="to-classrooms" name="to-classrooms" value=""><br>
            <div class="form-group">
                <label for="filter-classrooms">Аудитория</label>
                <select id="filter-classrooms" name="filter-classrooms">
                </select>
            </div>
            <button id="filterApplyClassrooms">Применить</button>
            <button id="filterClearClassrooms">Обнулить</button>
        </div>
    </div>
    <div class="addClassrooms"></div>
    <br>
    <div class="popup moderate-create-classrooms none" id="new-classrooms">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="classrooms-name">Название аудитории</label>
                <input type="text" class="form-control" id="classrooms-name" name="classrooms-name" required>
            </div>
            <div class="form-group">
                <label for="students-capacity">Сколько людей вмещает</label>
                <input type="number" class="form-control" id="students-capacity" name="students-capacity" required>
            </div>
            <div class="form-group">
                <label for="location">Где находится</label>
                <input type="text" class="form-control" id="location" name="location" required>
            </div>
            <button type="submit" class="btn btn-default" id="save-new-classroom">Сохранить</button>
        </form>
    </div>
    <div class="popup edit-classrooms none" id="edit-classrooms">
        <form>
            <div class="close"><i class="fa fa-times fa-2x"></i></div>
            <div class="form-group">
                <label for="edit-classrooms-name">Название аудитории</label>
                <input type="text" class="form-control" id="edit-classrooms-name" name="edit-classrooms-name" value=""
                       required>
            </div>
            <div class="form-group">
                <label for="edit-students-capacity">Сколько людей вмещает</label>
                <input type="number" class="form-control" id="edit-students-capacity" name="edit-students-capacity"
                       value=""
                       required>
            </div>
            <div class="form-group">
                <label for="edit-location">Где находится</label>
                <input type="text" class="form-control" id="edit-location" name="edit-location" value="" required>
            </div>
            <input type="hidden" id="edit-index" name="edit-index" value="">
            <button type="submit" class="btn btn-default" id="save-classroom">Сохранить</button>
        </form>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="edit.js"></script>
</body>
</html>