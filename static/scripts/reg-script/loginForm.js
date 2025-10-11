import { validateEmail, validatePassword } from "./validation.js";
import { initLoginRequest } from "../requests/initLoginRequest.js";

export function initLoginForm() {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const emailError = email.nextElementSibling;
    const passwordError = password.nextElementSibling;

    if (!validateEmail(email.value)) {
      email.classList.add("is-invalid");
      emailError.style.display = "block";
      isValid = false;
    } else {
      email.classList.remove("is-invalid");
      emailError.style.display = "none";
    }

    if (!validatePassword(password.value)) {
      password.classList.add("is-invalid");
      passwordError.style.display = "block";
      isValid = false;
    } else {
      password.classList.remove("is-invalid");
      passwordError.style.display = "none";
    }

    if (isValid) {
      //проверка аутинтификации сервером
      // Работа с бэкендом
     initLoginRequest(email.value, password.value);

     
    }
  });
}
