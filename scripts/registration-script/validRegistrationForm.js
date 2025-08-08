// Валидация формы регистрации
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  const name = document.getElementById("register-name");
  const email = document.getElementById("register-email");
  const phone = document.getElementById("register-phone");
  const password = document.getElementById("register-password");
  const confirmPassword = document.getElementById("register-confirm-password");

  const nameError = name.nextElementSibling;
  const emailError = email.nextElementSibling;
  const phoneError = phone.nextElementSibling;
  const passwordError = password.nextElementSibling;
  const confirmPasswordError = confirmPassword.nextElementSibling;

  // Проверка имени
  if (name.value.trim() === "") {
    name.classList.add("is-invalid");
    nameError.style.display = "block";
    isValid = false;
  } else {
    name.classList.remove("is-invalid");
    nameError.style.display = "none";
  }

  // Проверка email
  if (!validateEmail(email.value)) {
    email.classList.add("is-invalid");
    emailError.style.display = "block";
    isValid = false;
  } else {
    email.classList.remove("is-invalid");
    emailError.style.display = "none";
  }

  // Проверка телефона
  if (!validatePhone(phone.value)) {
    phone.classList.add("is-invalid");
    phoneError.style.display = "block";
    isValid = false;
  } else {
    phone.classList.remove("is-invalid");
    phoneError.style.display = "none";
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

  // Проверка подтверждения пароля
  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmPasswordError.style.display = "block";
    isValid = false;
  } else {
    confirmPassword.classList.remove("is-invalid");
    confirmPasswordError.style.display = "none";
  }

  if (isValid) {
    alert("Регистрация прошла успешно!");
    // Здесь можно добавить отправку формы на сервер
  }
});
