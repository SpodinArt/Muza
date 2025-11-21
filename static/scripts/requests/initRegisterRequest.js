export function initRegisterRequest(name, email, password, phone) {
 let aaa = 89887453505
  const register_json = {
    login: name,
    email: email,
    password: password,
    phone_number: aaa,
    //phone_number: phone,
  };
console.log(register_json);
  fetch("http://127.0.0.1:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(register_json),
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
