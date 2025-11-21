import { validateEmail, validatePassword } from "./validation.js";
import {
  validatePhoneNumber,
  getPhoneInputInstance,
} from "./validTelNumberRegistration.js";
import { initRegisterRequest } from "../requests/initRegisterRequest.js";

export function initRegisterForm() {
  const registerForm = document.getElementById("register-form");
  if (!registerForm) return;

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const phone = document.getElementById("register-phone");
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    );

    // Функция для безопасного получения элемента ошибки
    const getErrorElement = (input) => {
      if (!input) return null;

      // Ищем следующий элемент с классом invalid-feedback
      let sibling = input.nextElementSibling;
      while (sibling) {
        if (sibling.classList.contains("invalid-feedback")) {
          return sibling;
        }
        sibling = sibling.nextElementSibling;
      }
      return null;
    };

    const nameError = getErrorElement(name);
    const emailError = getErrorElement(email);
    const phoneError = getErrorElement(phone);
    const passwordError = getErrorElement(password);
    const confirmPasswordError = getErrorElement(confirmPassword);

    // Сброс ошибок
    if (name) name.classList.remove("is-invalid");
    if (nameError) nameError.style.display = "none";

    if (email) email.classList.remove("is-invalid");
    if (emailError) emailError.style.display = "none";

    if (phone) phone.classList.remove("is-invalid");
    if (phoneError) phoneError.style.display = "none";

    if (password) password.classList.remove("is-invalid");
    if (passwordError) passwordError.style.display = "none";

    if (confirmPassword) confirmPassword.classList.remove("is-invalid");
    if (confirmPasswordError) confirmPasswordError.style.display = "none";

    // Валидация имени
    if (name && name.value.trim() === "") {
      name.classList.add("is-invalid");
      if (nameError) nameError.style.display = "block";
      isValid = false;
    }

    // Валидация email
    if (email && !validateEmail(email.value)) {
      email.classList.add("is-invalid");
      if (emailError) emailError.style.display = "block";
      isValid = false;
    }

    // Валидация телефона
    const iti = getPhoneInputInstance();
    if (!validatePhoneNumber()) {
      if (phone) phone.classList.add("is-invalid");
      if (phoneError) phoneError.style.display = "block";
      isValid = false;

      // Очищаем поле при ошибке
      if (iti) {
        iti.setNumber("");
      }
    }

    // Валидация пароля
    if (password && !validatePassword(password.value)) {
      password.classList.add("is-invalid");
      if (passwordError) passwordError.style.display = "block";
      isValid = false;
    }

    // Подтверждение пароля
    if (
      confirmPassword &&
      password &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.classList.add("is-invalid");
      if (confirmPasswordError) confirmPasswordError.style.display = "block";
      isValid = false;
    }

    if (isValid) {
      // Получаем полный номер телефона
      const fullPhone = iti ? iti.getNumber() : "";

      // Формируем данные для отправки
      const formData = {
        name: name ? name.value.trim() : "",
        email: email ? email.value : "",
        phone: fullPhone,
        password: password ? password.value : "",
      };
      console.log("Данные для регистрации:", formData);

      ////сюда вставить отправку формы на обработчик
      initRegisterRequest(formData.name, formData.email, formData.password, formData.phone);//Отправка регистрации на бэк
     
    }
  });
}
