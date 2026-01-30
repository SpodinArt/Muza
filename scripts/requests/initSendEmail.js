// Импортируем интерфейсную функцию и функцию таймера
import { showMessage } from "../utilits/showMessage.js";
import { startTimer } from "../utilits/timer.js"; // Подключаем модуль таймера

export function initSendEmail(email) {
  const PasswordResetRequest = {
    email: email,
  };

  return fetch("http://127.0.0.1:8080/auth/password_reset_request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(PasswordResetRequest),
  })
    .then(async (response) => {
      if (!response.ok) {
        switch (response.status) {
          case 401:
            showMessage("Проверьте правильность введённых данных.");
            break;
          case 410:
            showMessage("Попробуйте позже.");
            document.getElementById("send-email-btn").disabled = true; // Отключаем кнопку отправки
            startTimer(); // Запускаем таймер
            break;
          default:
            const errorText = await response.text();
            throw new Error(errorText || `Ошибка HTTP: ${response.status}`);
        }
      } else {
        return {
          success: true,
          message: "Письмо отправлено. Проверьте вашу почту.",
        };
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке запроса:", error);
      throw new Error(
        "Произошла ошибка при отправке запроса. Попробуйте позже.",
      );
    });
}
