document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("send-email-btn");

  if (button) {
    button.addEventListener("click", PasswordResetRequest);
  } else {
    console.error('Кнопка с id "send-email-btn" не найдена');
  }
});

// Ваша функция
function PasswordResetRequest() {
  console.log("Запрос на сброс пароля отправлен");
  // Ваша логика сброса пароля

  const mail = document.getElementById("reset-email").value;

  const register_json = {
    email: email,
  };
  console.log(register_json);
}
