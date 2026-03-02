import { showMessage } from "../utilits/showMessage.js";

export function initLoginRequest(email, password) {
  const login_json = {
    email: email,
    password: password,
  };

  fetch("http://127.0.0.1:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login_json),
  })
    .then(async (response) => {
      console.log("отправлено");
      console.log("слушаю");

      // Пытаемся получить ответ как текст сначала
      const responseText = await response.text();

      let result;
      try {
        // Пытаемся парсить как JSON
        result = JSON.parse(responseText);
      } catch (e) {
        // Если не JSON, то это текстовая ошибка
        result = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(result.message || `Ошибка HTTP: ${response.status}`);
      }

      return result;
    })
    .then((result) => {
      console.log("Получено от сервера:", result);

      // Проверяем тип ответа
      if (result.token) {
        // 1. Если есть токен - переходим на create
        localStorage.setItem("authToken", result.token);
        window.location.replace("registration");
      } else if (
        result.message &&
        result.message.includes("Пользователя с таким именем не существует")
      ) {
        // 2. Пользователь не существует
        showMessage("Пользователя с таким именем не существует", "error");
      } else if (
        result.message &&
        result.message.includes("Content type error")
      ) {
        // 3. Ошибка content type
        showMessage("Пошло что-то не так", "error");
      } else {
        // Другие ответы
        console.warn("Неизвестный формат ответа:", result);
        showMessage(result.message || "Неизвестная ошибка", "error");
      }
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
      showMessage("Сервер недоступен попробуйте позднее ", "error");
    });
}
