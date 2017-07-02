<?php
/*Старт сессии*/
session_start(); 
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Авторизация на сайте:</title>
    <link rel="stylesheet" href="css/Style2.css?4422213">
</head>
<body>
<div align="center"><h2>Авторизация на сайте:</h2></div>
<div class="auth">
<form action="login.php" method="post">
    <label for="login">Логин:</label>
    <input class="authInput" type="text" name="login"><br>
    <label for="password">Пароль:</label>
<input class="authInput" type="password" name="password"><br>
<input class="AuthButton" type="submit" name="submit">
</form></div>

<?php $connection = mysqli_connect('localhost', 'root', '', 'timetable') or die(mysqli_error());

if (isset($_POST['submit']))
{
    /*Проверки на заполненность логина и пароля*/
if (empty($_POST['login']))
{
echo '<script>alert("Поле логин не заполненно");</script>';
}
elseif (empty($_POST['password']))
{
echo '<script>alert("Поле пароль не заполненно");</script>';
}
    /*Иначе, если все поля заполненны*/
else
{    
$login = $_POST['login'];
$password = $_POST['password'];
    /*Создаём переменную с запросом к БД*/
$query = mysqli_query($connection, "SELECT `id` FROM `users` WHERE `login` = '$login' AND `password` = '$password'");
$result = mysqli_fetch_array($query);
if (empty($result['id']))
{
echo '<script>alert("Неверные Логин или Пароль");</script>';
}
/*Если всё хорошо, то заносим данные в сессию и выполняем вход*/
else
{
$_SESSION['password'] = $password;
$_SESSION['login'] = $login;
$_SESSION['id'] = $result['id'];
    header("location: index.php");
}     
}		
} ?>

<?php if (isset($_GET['exit'])) { // если вызвали переменную "exit"
unset($_SESSION['password']); // Чистим сессию пароля
unset($_SESSION['login']); // Чистим сессию логина
unset($_SESSION['id']); // Чистим сессию id
} ?>

<?php if (isset($_SESSION['login']) && isset($_SESSION['id'])) // если в сессии загружены логин и id
{
echo '<div align="center"><a href="login.php?exit">Выход</a></div>'; // Выводим нашу ссылку выхода
} ?>

<?php if (!isset($_SESSION['login']) || !isset($_SESSION['id'])) // если в сессии не загружены логин и id
{
echo '<div align="center"><a href="reg.php">Регистрация</a></div>'; // Выводим нашу ссылку регистрации
} ?>
</body>
</html>