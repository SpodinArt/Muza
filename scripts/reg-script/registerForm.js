// reg-script/registerForm.js
import { validateEmail } from "../reg-script/validation.js";
import { validatePassword } from "../reg-script/validation.js";
import { validateLogin } from "../reg-script/validation.js";
import {
  validatePhoneNumberAndShowError,
  getPhoneInputInstance,
} from "./validTelNumberRegistration.js";

export function initRegisterForm() {
  const form = document.querySelector("#register-form");
  if (!form) return;

  // Функция для показа ошибки конкретному полю
  function showFieldError(fieldId, show = true) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const formGroup = field.closest(".form-group");
    const feedback = formGroup.querySelector(".invalid-feedback");
    if (show) {
      formGroup.classList.add("is-invalid", "error");
      feedback.style.display = "block";
    } else {
      formGroup.classList.remove("is-invalid", "error");
      feedback.style.display = "none";
    }
  }

  // Функция для скрытия ошибки (используется при вводе)
  function hideFieldError(fieldId) {
    showFieldError(fieldId, false);
  }

  // Сброс ошибки при вводе для всех полей
  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm-password");
  const phoneInput = document.getElementById("register-phone");

  [nameInput, emailInput, passwordInput, confirmInput, phoneInput].forEach(
    (input) => {
      if (input) {
        input.addEventListener("input", function () {
          hideFieldError(this.id);
        });
      }
    },
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Валидация имени (логина)
    const name = nameInput ? nameInput.value.trim() : "";
    const nameValid = validateLogin(name);
    if (!nameValid) {
      showFieldError("register-name", true);
      isValid = false;
    } else {
      showFieldError("register-name", false);
    }

    // 2. Валидация email
    const email = emailInput ? emailInput.value.trim() : "";
    const emailValid = validateEmail(email);
    if (!emailValid) {
      showFieldError("register-email", true);
      isValid = false;
    } else {
      showFieldError("register-email", false);
    }

    // 3. Валидация телефона (через нашу функцию, которая уже подсвечивает)
    const phoneValid = validatePhoneNumberAndShowError();
    if (!phoneValid) {
      isValid = false;
      // фокус на телефоне позже, но не сбрасываем подсветку
    }

    // 4. Валидация пароля
    const password = passwordInput ? passwordInput.value : "";
    const passwordValid = validatePassword(password);
    if (!passwordValid) {
      showFieldError("register-password", true);
      isValid = false;
    } else {
      showFieldError("register-password", false);
    }

    // 5. Проверка совпадения паролей
    const confirm = confirmInput ? confirmInput.value : "";
    const confirmGroup = confirmInput.closest(".form-group");
    const confirmFeedback = confirmGroup.querySelector(".invalid-feedback");
    if (password !== confirm) {
      confirmGroup.classList.add("is-invalid", "error");
      confirmFeedback.style.display = "block";
      isValid = false;
    } else {
      confirmGroup.classList.remove("is-invalid", "error");
      confirmFeedback.style.display = "none";
    }

    // Если хотя бы одна проверка не пройдена, прерываем отправку
    if (!isValid) {
      // Фокус на первом невалидном поле (опционально)
      if (!nameValid) nameInput.focus();
      else if (!emailValid) emailInput.focus();
      else if (!phoneValid) phoneInput.focus();
      else if (!passwordValid) passwordInput.focus();
      else if (password !== confirm) confirmInput.focus();
      return;
    }

    // Все проверки пройдены – собираем данные для отправки
    const phoneInstance = getPhoneInputInstance();
    const phoneNumber = phoneInstance ? phoneInstance.getNumber() : "";

    const data = {
      name: name, // уже валидировано и обрезано
      email: emailValid ? emailValid : email, // validateEmail возвращает нормализованный email или false, поэтому используем emailValid если это строка
      phone: phoneNumber,
      password: password,
    };

    // Внимание: validateEmail возвращает либо false, либо нормализованный email (в нижнем регистре)
    // Поэтому если emailValid не false, то это строка, её и используем
    if (typeof emailValid === "string") {
      data.email = emailValid;
    }

    // Отправка на сервер
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка сервера");
        }
        return response.json();
      })
      .then((result) => {
        alert("Регистрация прошла успешно!");
        form.reset();
        // Дополнительно можно очистить подсветку ошибок
        [
          nameInput,
          emailInput,
          passwordInput,
          confirmInput,
          phoneInput,
        ].forEach((input) => {
          if (input) hideFieldError(input.id);
        });
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        // Здесь можно показать общее сообщение об ошибке
      });
  });
}
