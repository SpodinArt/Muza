import { showMessage } from "../utilits/showMessage.js";

export function initRegisterRequest(name, email, password, phone) {
  // 1. Очистка номера телефона
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const register_json = {
    login: name,
    email: email,
    password: password,
    phone_number: Number(cleanPhone),
  };

  console.log("Данные для отправки:", register_json);

  fetch("http://127.0.0.1:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(register_json),
  })
    .then(async (response) => {
      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { message: responseText };
      }

      // Если сервер прислал ошибку (400, 500 и т.д.),
      // мы не кидаем throw, а передаем результат дальше для проверки текста
      return result;
    })
    .then((result) => {
      console.log("Получено от сервера:", result);

      // 1. Успешная регистрация (есть токен)
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        window.location.replace("create");
        return;
      }

      // 2. Проверка текстовых сообщений (даже если это ошибка)
      const msg = result.message || "";

      if (msg.includes("Мыло уже существует чувак")) {
        showMessage("Email уже зарегистрирован", "error");
      } else if (msg.includes("Твой логин уже поюзали")) {
        showMessage("Пользователь с таким именем уже зарегистрирован", "error");
      } else if (msg.includes("Content type error")) {
        showMessage("Пошло что-то не так", "error");
      } else {
        // Если ничего не подошло
        console.warn("Неизвестный формат ответа:", result);
        showMessage(msg || "Неизвестная ошибка", "error");
      }
    })
    .catch((error) => {
      console.error("Сетевая ошибка или ошибка кода:", error);
      showMessage("Ошибка соединения: " + error.message, "error");
    });
}
