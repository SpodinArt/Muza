import { initTabSwitcher } from "./reg-script/tabSwitcher.js";
import { hidePasswordFormRegister } from "./reg-script/tabSwitcher.js";
import { hidePasswordFormLogin } from "./reg-script/tabSwitcher.js";
import { initLoginForm } from "./reg-script/loginForm.js";
import { initRegisterForm } from "./reg-script/registerForm.js";
import { initSocialAuth } from "./reg-script/socialAuth.js";
import { initForgotPassword } from "./reg-script/forgotPassword.js";
import { initTelInput } from "./reg-script/validTelNumberRegistration.js"; // Добавляем импорт
import { initVideoSpeed } from "./guest-script/VideoSpeed.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabSwitcher();
  initTelInput(); // Инициализируем телефонный ввод
  // initPhoneMask();старая реализация проверки телефона
  initLoginForm();
  initRegisterForm();
  initSocialAuth();
  initForgotPassword();
  initVideoSpeed(); // Инициализируем контроль скорости видео
  hidePasswordFormRegister(); //выключение формы восстановления пароля при нажатии кнопки регистрация
  hidePasswordFormLogin(); //выключение формы восстановления пароля при нажатии кнопки Вход
});
