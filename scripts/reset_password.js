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

  // Показываем только первый шаг (ввод email)
  document.querySelectorAll("#reset-password-form .hidden").forEach((el) => {
    el.style.display = "none";
  });
  document.getElementById("form-input-mail").parentElement.style.display =
    "block";
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
    "#reset-email + .invalid-feedback",
  );

  // Проверка валидности email
  if (!validateEmail(resetEmail)) {
    emailFeedback.style.display = "block";
    return false;
  }

  // Скрываем ошибку если была
  emailFeedback.style.display = "none";

  // запрос на сервер для отправки письма бэку отправляем емаил

  const PasswordResetRequest = {
    email: resetEmail,
  };

  fetch("http://127.0.0.1:8080/auth/password_reset_request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PasswordResetRequest),
  });
  console.log("Запрос отправлен на восстановление пароля для:", resetEmail);

  //   .then(async (response) => {
  //   console.log("отправлено");
  //   console.log("слушаю");

  //   // Пытаемся получить ответ как текст сначала
  //   const responseText = await response.text();

  //   let result;
  //   try {
  //     // Пытаемся парсить как JSON
  //     result = JSON.parse(responseText);
  //   } catch (e) {
  //     // Если не JSON, то это текстовая ошибка
  //     result = { message: responseText };
  //   }

  //   if (!response.ok) {
  //     throw new Error(result.message || `Ошибка HTTP: ${response.status}`);
  //   }

  //   return result;
  // })

  // После отправки email переходим ко второму шагу (ввод кода)
  document.getElementById("form-input-mail").parentElement.style.display =
    "none";
  document.getElementById("reset-code").parentElement.style.display = "block";

  return true;
}

// Добавляем обработчик для кнопки "Отправить" (этап 1 - email)
document
  .getElementById("send-email-btn")
  .addEventListener("click", sendResetPassword);

// Добавляем обработчик для кнопки "Вернуться назад"
document
  .getElementById("showLoginForm")
  .addEventListener("click", showLoginForm);

// Обработчик для кнопки отправки кода (этап 2)
document.getElementById("send-code-btn").addEventListener("click", function () {
  const code = document.getElementById("reset-code-input").value.trim();

  if (!code) {
    alert("Введите код подтверждения");
    return;
  }

  console.log("Код подтверждения:", code);

  // Проверяем код (здесь должна быть логика проверки)
  if (code === "123456") {
    // Замените на реальную проверку
    // Переходим к третьему шагу (ввод нового пароля)
    document.getElementById("reset-code").parentElement.style.display = "none";
    document.getElementById("form-call-back").parentElement.style.display =
      "block";
  } else {
    alert("Неверный код подтверждения");
  }
});

// Обработчик для кнопки отправки нового пароля (этап 3)
document
  .querySelector('#form-call-back button[type="submit"]')
  .addEventListener("click", function (e) {
    e.preventDefault();

    const password = document.getElementById("send-password").value;
    const confirmPassword = document.getElementById(
      "send-confirm-password",
    ).value;

    // Проверка пароля
    if (password.length < 6) {
      alert("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    console.log("Новый пароль установлен");
    alert("Пароль успешно изменен!");

    // Возвращаемся к форме входа
    showLoginForm();
  });
