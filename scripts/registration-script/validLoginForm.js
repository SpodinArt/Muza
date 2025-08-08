// Валидация формы входа
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  const emailOrPhone = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  const emailOrPhoneError = emailOrPhone.nextElementSibling;
  const passwordError = password.nextElementSibling;

  // Проверка email или телефона
  if (!validateEmailOrPhone(emailOrPhone.value)) {
    emailOrPhone.classList.add("is-invalid");
    emailOrPhoneError.textContent =
      "Пожалуйста, введите корректный email или телефон";
    emailOrPhoneError.style.display = "block";
    isValid = false;
  } else {
    emailOrPhone.classList.remove("is-invalid");
    emailOrPhoneError.style.display = "none";
  }

  // Проверка пароля
  if (!validatePassword(password.value)) {
    password.classList.add("is-invalid");
    passwordError.style.display = "block";
    isValid = false;
  } else {
    password.classList.remove("is-invalid");
    passwordError.style.display = "none";
  }

  if (isValid) {
    alert("Вход выполнен успешно!");
    // Здесь можно добавить отправку формы на сервер
  }
});
