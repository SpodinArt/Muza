import { showMessage } from "../utilits/showMessage.js";

export function initSendNewPassword(token, newPassword) {
  const resetData = {
    token: token,
    new_password: newPassword,
  };

  return fetch("http://127.0.0.1:8080/auth/pass_resset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetData),
  })
    .then(async (response) => {
      console.log("Ответ от сервера:", response.status);

      if (response.status === 404) {
        showMessage("По этой ссылке уже был изменён пароль. Попробуйте позже.");
        window.location.href = "/error.html"; // Редирект на страницу ошибки
        return { status: 404, redirect: true };
      }

      if (response.status === 410) {
        showMessage("Ссылка устарела. Попробуйте еще раз.");

        // Скрываем старую форму и показываем новую
        const oldForm = document.querySelector("#form-call-back");
        const newForm = document.querySelector(".hidden"); // Элемент div.hidden, указанный тобой

        oldForm.style.display = "none"; // Скрываем старый контейнер
        newForm.classList.remove("hidden"); // Показываем новый контейнер

        return { status: 410 };
      }

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("sessionToken", result.token); // Сохранение токена в Local Storage
        window.location.href = "/create.html"; // Переход на страницу create
        return {
          success: true,
          message: "Пароль успешно изменён!",
          token: result.token,
        };
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка HTTP: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Ошибка при изменении пароля:", error);
      throw new Error("Произошла ошибка при изменении пароля попробуйте еще раз");
    });
}
