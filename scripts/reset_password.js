import { validateEmail } from "./reg-script/validation.js";

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
  const emailFeedback = document.querySelector(
    "#reset-email + .invalid-feedback"
  );

  // Проверка валидности email
  if (!validateEmail(resetEmail)) {
    emailFeedback.style.display = "block";
    return false;
  }

  // Здесь можете отправить AJAX-запрос на сервер для отправки письма с восстановлением пароля
  console.log("Запрос отправлен на восстановление пароля для:", resetEmail);
  alert("Инструкция по восстановлению пароля отправлена на указанный адрес.");
  showLoginForm(); // Вернемся к форме входа после успешной отправки
}

// Добавляем обработчик для кнопки "Отправить"
document
  .getElementById("reset-password-btn")
  .addEventListener("click", sendResetPassword);

// Добавляем обработчик для кнопки "Вернуться назад"
document
  .getElementById("showLoginForm")
  .addEventListener("click", showLoginForm);

// // по нажатию на кнопку вернутся назад скрывать форму забыли пароль
// function hidePasswordForm() {
//   const passwordForm = document.getElementById("reset-password-form");
//   const showLoginForm = document.getElementById("showLoginForm");
//   const registerForm = document.getElementById("login-form");

//   showLoginForm.addEventListener("click", () => {
//     passwordForm.style.display = "none";
//     registerForm.style.display = "block";
//   });
// }
// hidePasswordForm();
// //

// // Функция проверки валидности email
// function validateEmail(email) {
//   const re =
//     /^(([^<>()[$$.,;:\s@"]+(\.[^<>()[$$.,;:\s@"]+)*)|(".+"))@(([^<>()[$$.,;:\s@"]+\.)+[^<>()[$$.,;:\s@"]{2,})$/i;
//   return re.test(String(email).toLowerCase());
// }
