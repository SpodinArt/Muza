import {
  validateEmail,
  validatePhone,
  validatePassword,
} from "./validation.js";

export function initRegisterForm() {
  const registerForm = document.getElementById("register-form");

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

    const nameError = name.nextElementSibling;
    const emailError = email.nextElementSibling;
    const phoneError = phone.nextElementSibling;
    const passwordError = password.nextElementSibling;
    const confirmPasswordError = confirmPassword.nextElementSibling;

    if (name.value.trim() === "") {
      name.classList.add("is-invalid");
      nameError.style.display = "block";
      isValid = false;
    } else {
      name.classList.remove("is-invalid");
      nameError.style.display = "none";
    }

    if (!validateEmail(email.value)) {
      email.classList.add("is-invalid");
      emailError.style.display = "block";
      isValid = false;
    } else {
      email.classList.remove("is-invalid");
      emailError.style.display = "none";
    }

    if (!validatePhone(phone.value)) {
      phone.classList.add("is-invalid");
      phoneError.style.display = "block";
      isValid = false;
    } else {
      phone.classList.remove("is-invalid");
      phoneError.style.display = "none";
    }

    if (!validatePassword(password.value)) {
      password.classList.add("is-invalid");
      passwordError.style.display = "block";
      isValid = false;
    } else {
      password.classList.remove("is-invalid");
      passwordError.style.display = "none";
    }

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
    }
  });
}
