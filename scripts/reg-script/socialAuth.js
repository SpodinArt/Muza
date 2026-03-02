import { showMessage } from "../utilits/showMessage.js";

export function initSocialAuth() {
  document.getElementById("google-login").addEventListener("click", () => {
    showMessage("Вход через Google", "info");
  });

  document.getElementById("google-register").addEventListener("click", () => {
    showMessage("Регистрация через Google", "info");
  });

  document.getElementById("yandex-login").addEventListener("click", () => {
    showMessage("Вход через Yandex", "info");
  });

  document.getElementById("yandex-register").addEventListener("click", () => {
    showMessage("Регистрация через Yandex", "info");
  });
}
