import { validateEmail } from "../scripts/reg-script/validation.js";
import { showMessage } from "./utilits/showMessage.js";
import { getTokenFromURL } from "./reset-pass/getUrlToken.js";
import { initSendEmail } from "./requests/initSendEmail.js";
import { initSendNewPassword } from "./requests/initSendNewPassword.js";

// Проверяем наличие токена в URL при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  const token = getTokenFromURL();

  if (token) {
    // Если есть токен, показываем форму для ввода нового пароля
    showSetPasswordForm(token);
  } else {
    // Если нет токена, скрываем форму восстановления пароля по умолчанию
    document.getElementById("reset-password-form").style.display = "none";
  }
});

// Обработчик события клика на ссылку "Забыли пароль?"
document
  .getElementById("forgot-password")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showResetPasswordForm();
  });

// Показываем форму восстановления пароля (ввод email)
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

  // Убедимся, что заголовок формы виден
  const formTitle = document.querySelector("#reset-password-form h2");
  if (formTitle) formTitle.style.display = "block";

  // Скрываем форму ввода пароля если она была видна
  document.getElementById("form-call-back").parentElement.style.display =
    "none";
}

// Показываем форму для установки нового пароля (при переходе по ссылке с токеном)
function showSetPasswordForm(token) {
  console.log("Показываем форму установки пароля с токеном:", token);

  // Сохраняем токен в глобальной переменной
  window.resetToken = token;

  // Скрываем все другие формы
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("register-form").classList.remove("active");

  // ПОКАЗЫВАЕМ форму восстановления пароля
  document.getElementById("reset-password-form").style.display = "block";

  // Скрываем заголовок формы восстановления
  const formTitle = document.querySelector("#reset-password-form h2");
  if (formTitle) formTitle.style.display = "none";

  // Скрываем все скрытые блоки внутри формы
  document.querySelectorAll("#reset-password-form .hidden").forEach((el) => {
    el.style.display = "none";
  });

  // Показываем форму ввода пароля
  const passwordFormContainer =
    document.getElementById("form-call-back").parentElement;
  passwordFormContainer.style.display = "block";

  // Меняем текст кнопки и добавляем ID
  const submitBtn = document.querySelector(
    '#form-call-back button[type="submit"]',
  );
  if (submitBtn) {
    submitBtn.textContent = "Установить новый пароль";
    submitBtn.id = "send-2pass-btn";
  }

  // Добавляем текст-описание
  let description = document.querySelector(
    "#form-call-back .password-description",
  );
  if (!description) {
    description = document.createElement("p");
    description.className = "password-description";
    description.textContent = "Введите новый пароль для вашей учетной записи";
    description.style.marginBottom = "20px";
    description.style.color = "#ddd0bd";

    const formCallBack = document.getElementById("form-call-back");
    if (formCallBack) {
      formCallBack.insertBefore(description, formCallBack.firstChild);
    }
  }

  // Делаем активной вкладку "Вход"
  document.getElementById("buttonLogin").classList.add("active");
  document.getElementById("buttonRegister").classList.remove("active");

  // Скрываем кнопку "Вернуться назад" так как мы уже в режиме сброса пароля
  const backButton = document.getElementById("showLoginForm");
  if (backButton) {
    backButton.style.display = "none";
  }
}

// Возвращаемся к форме входа
function showLoginForm() {
  document.getElementById("login-form").classList.add("active");
  document.getElementById("reset-password-form").style.display = "none";
}

// Отправляем запрос на восстановление пароля (отправка email)
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

  // Используем функцию из отдельного модуля
  initSendEmail(resetEmail)
    .then((result) => {
      if (result.success) {
        // Показываем сообщение об успешной отправке
        showMessage(result.message, "success");

        // Скрываем форму ввода email и заголовок
        document.getElementById("form-input-mail").parentElement.style.display =
          "none";
        const formTitle = document.querySelector("#reset-password-form h2");
        if (formTitle) formTitle.style.display = "none";

        // Показываем сообщение о том, что письмо отправлено
        const messageDiv = document.createElement("div");
        messageDiv.className = "reset-message";
        messageDiv.innerHTML = `
                    <h3>Письмо отправлено</h3>
                    <p>Инструкции по восстановлению пароля отправлены на указанный email.</p>
                    <p>Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме.</p>
                `;

        // Удаляем предыдущее сообщение если есть
        const oldMessage = document.querySelector(
          "#reset-password-form .reset-message",
        );
        if (oldMessage) oldMessage.remove();

        // Вставляем сообщение перед кнопкой "Вернуться назад"
        const backButton = document.getElementById("showLoginForm");
        document
          .getElementById("reset-password-form")
          .insertBefore(messageDiv, backButton);

        console.log(
          "Запрос отправлен на восстановление пароля для:",
          resetEmail,
        );
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке запроса:", error);
      showMessage(
        error.message ||
          "Произошла ошибка при отправке запроса. Попробуйте позже.",
        "error",
      );
    });

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

// Обработчик для кнопки отправки нового пароля (для этапа с токеном)
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "send-2pass-btn") {
    e.preventDefault();

    if (!window.resetToken) {
      showMessage("Ошибка: токен не найден", "error");
      return;
    }

    const password = document.getElementById("send-password").value;
    const confirmPassword = document.getElementById(
      "send-confirm-password",
    ).value;
    const passwordFeedback = document.querySelector(
      "#send-password + .invalid-feedback",
    );
    const confirmFeedback = document.querySelector(
      "#send-confirm-password + .invalid-feedback",
    );

    // Сбрасываем предыдущие ошибки
    if (passwordFeedback) passwordFeedback.style.display = "none";
    if (confirmFeedback) confirmFeedback.style.display = "none";

    // Проверка пароля
    let isValid = true;

    if (password.length < 8) {
      if (passwordFeedback) {
        passwordFeedback.textContent =
          "Пароль должен содержать минимум 8 символов, хотя бы одну заглавную и одну строчную букву, цифру и любой специальный символ";
        passwordFeedback.style.display = "block";
      }
      isValid = false;
    }

    if (password !== confirmPassword) {
      if (confirmFeedback) {
        confirmFeedback.textContent = "Пароли не совпадают";
        confirmFeedback.style.display = "block";
      }
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    console.log(
      "Отправка запроса на сброс пароля с токеном:",
      window.resetToken,
    );

    // Используем функцию из отдельного модуля
    initSendNewPassword(window.resetToken, password)
      .then((result) => {
        if (result.redirect && result.status === 404) {
          window.location.href = "/error.html";
          return;
        }

        if (result.success) {
          // Сохраняем новый токен в localStorage
          if (result.token) {
            localStorage.setItem("token", result.token);
          }

          showMessage(result.message, "success");

          // Перенаправляем на страницу create
          setTimeout(() => {
            window.location.href = "/create";
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Ошибка при изменении пароля:", error);
        showMessage(
          error.message || "Произошла ошибка при изменении пароля",
          "error",
        );
      });
  }
});

// Добавляем обработчик при загрузке для кнопки с ID send-2pass-btn
document.addEventListener("DOMContentLoaded", function () {
  const sendPassBtn = document.getElementById("send-2pass-btn");
  if (sendPassBtn) {
    sendPassBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Проверяем, есть ли токен
      if (!window.resetToken) {
        showMessage(
          "Для изменения пароля необходимо перейти по ссылке из письма",
          "error",
        );
        return;
      }

      // Если токен есть, запускаем процесс отправки
      const event = new Event("click");
      document.getElementById("send-2pass-btn").dispatchEvent(event);
    });
  }
});
