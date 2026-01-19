// Вспомогательная функция для показа сообщений
export function showMessage(message, type) {
  // Создаем элемент для сообщения
  const messageEl = document.createElement("div");
  messageEl.textContent = message;
  messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-family: "Comfortaa-Regular", sans-serif;
        z-index: 1000;
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

  // Устанавливаем цвет в зависимости от типа
  switch (type) {
    case "success":
      messageEl.style.backgroundColor = "#4CAF50";
      break;
    case "error":
      messageEl.style.backgroundColor = "#F44336";
      break;
    case "info":
      messageEl.style.backgroundColor = "#2196F3";
      break;
    default:
      messageEl.style.backgroundColor = "#56524b";
  }

  // Добавляем в DOM
  document.body.appendChild(messageEl);

  // Удаляем через 3 секунды
  setTimeout(() => {
    messageEl.style.opacity = "0";
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 300);
  }, 3000);
}
