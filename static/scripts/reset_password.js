// Скрываем форму восстановления пароля по умолчанию
document.getElementById("reset-password-form").style.display = "none";

// Обработчик события клика на ссылку "Забыли пароль?"
document
  .getElementById("forgot-password")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showResetPasswordForm();
  });

// Показываем форму восстановления пароля
function showResetPasswordForm() {
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("register-form").classList.remove("active");
  document.getElementById("reset-password-form").style.display = "block";
}

// Возвращаемся к форме входа
function showLoginForm() {
  document.getElementById("login-form").classList.add("active");
  document.getElementById("reset-password-form").style.display = "none";
}

// Отправляем запрос на восстановление пароля
function sendResetPassword() {
  const resetEmail = document.getElementById("reset-email").value.trim();

  // Проверка валидности email
  if (!validateEmail(resetEmail)) {
    alert("Некорректный адрес электронной почты!");
    return false;
  }

  // Здесь можете отправить AJAX-запрос на сервер для отправки письма с восстановлением пароля
  console.log("Запрос отправлен на восстановление пароля для:", resetEmail);
  alert("Инструкция по восстановлению пароля отправлена на указанный адрес.");
  showLoginForm(); // Вернемся к форме входа после успешной отправки
}

// Функция проверки валидности email
function validateEmail(email) {
  const re =
    /^(([^<>()[$$.,;:\s@"]+(\.[^<>()[$$.,;:\s@"]+)*)|(".+"))@(([^<>()[$$.,;:\s@"]+\.)+[^<>()[$$.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}
