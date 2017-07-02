<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Регистрация на сайте</title>
    <link rel="stylesheet" href="css/Style2.css?4422213">
</head>
<body>
<div align="center"><h2>Регистрация на сайте:</h2></div>
<div class="auth">
<form action="reg.php" method="post">
    <label for="login2">Логин:</label>
<input class="authInput" type="text" name="login2"><br>
    <label for="password2">Пароль:</label>
    <input class="authInput" type="password" name="password2"><br>
    <label for="password3">Повторите пароль:</label>
    <input class="authInput" type="password" name="password3"><br>
<input class="AuthButton"type="submit" name="submit2">
</form>
</div>
<div align="center"><a href="login.php">Уже зарегистрированы? Войти.</a>

<?php

$connection = mysqli_connect('localhost', 'root', '', 'timetable') or die(mysqli_error()); // Соединение с базой данных

if (isset($_POST['submit2']))
{
    /*Проверки на заполненность логина и пароля*/
if (empty($_POST['login2']))
{
echo "<script>alert('Поле логин не заполненно');</script>";
}
    if (($_POST['password2']) != ($_POST['password3']))
    {
        echo "<script>alert('Пароли не совпадают');</script>";
    }
    elseif (empty($_POST['password2']))
{
echo "<script>alert('Поле логин не заполненно');</script>";
}
/*Иначе, если все поля заполненны*/
else
{
$login2 = $_POST['login2'];
$password2 = $_POST['password2'];
    /*Создаём переменную с запросом к БД на создание нового юзера*/
$query = "INSERT INTO `users` (login, password) VALUES ('$login2', '$password2')";
    /*Отправляем переменную с запросом в базу данных*/
$result = mysqli_query($connection, $query) or die(mysqli_error());
    header('location: index.php');
}
} ?>

</body>
</html>