export function initSocialAuth() {
  document.getElementById("google-login").addEventListener("click", () => {
    alert("Вход через Google");
  });

  document.getElementById("google-register").addEventListener("click", () => {
    alert("Регистрация через Google");
  });

  document.getElementById("yandex-login").addEventListener("click", () => {
    alert("Вход через Yandex");
  });

  document.getElementById("yandex-register").addEventListener("click", () => {
    alert("Регистрация через Yandex");
  });
}
