import { showMessage } from "../utilits/showMessage.js";
export function initRegisterRequest(name, email, password, phone) {
  // 1. Оставляем только цифры и создаем BigInt
  // (например, "+79991234567" станет 79991234567n)
  const aaa = BigInt(phone.replace(/\D/g, ""));

  const register_json = {
    login: name,
    email: email,
    password: password,
    phone_number: aaa,
  };

  console.log("Данные для отправки:", register_json);

  fetch("http://127.0.0.1:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // 2. JSON.stringify не умеет работать с BigInt по умолчанию,
    // поэтому добавляем функцию-реплейсер, чтобы убрать кавычки (передать как число)
    body: JSON.stringify(register_json, (key, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
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
       showMessage("Ошибка: " + error.message, "error");
    });
}
