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
        window.location.replace("create");
      } else if (
        result.message &&
        result.message.includes("Пользователя с таким именем не существует")
      ) {
        // 2. Пользователь не существует
        alert("Пользователя с таким именем не существует");
      } else if (
        result.message &&
        result.message.includes("Content type error")
      ) {
        // 3. Ошибка content type
        alert("Пошло что-то не так");
      } else {
        // Другие ответы
        console.warn("Неизвестный формат ответа:", result);
        alert(result.message || "Неизвестная ошибка");
      }
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
      alert("Ошибка: " + error.message);
    });
}
