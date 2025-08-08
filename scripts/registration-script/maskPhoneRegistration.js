// Маска для телефона в поле регистрации (аналогично полю входа)
const registerPhone = document.getElementById("register-phone");
registerPhone.addEventListener("input", function (e) {
  // Сохраняем позицию курсора
  const cursorPosition = e.target.selectionStart;

  // Получаем введенные цифры (удаляем все не-цифры)
  let digits = e.target.value.replace(/\D/g, "");

  // Форматируем номер только если есть цифры
  let formatted = "";
  if (digits.length > 0) {
    // Российский номер (начинается с 7 или 8)
    if (digits[0] === "7" || digits[0] === "8") {
      formatted = "+7 (" + digits.substring(1, 4);
      if (digits.length > 4) formatted += ") " + digits.substring(4, 7);
      if (digits.length > 7) formatted += "-" + digits.substring(7, 9);
      if (digits.length > 9) formatted += "-" + digits.substring(9, 11);
    }
    // Номер без кода страны (начинается с 9)
    else if (digits[0] === "9") {
      formatted = digits.substring(0, 3);
      if (digits.length > 3) formatted += "-" + digits.substring(3, 6);
      if (digits.length > 6) formatted += "-" + digits.substring(6, 8);
      if (digits.length > 8) formatted += "-" + digits.substring(8, 10);
    }
    // Другие номера (оставляем как есть)
    else {
      formatted = digits;
    }
  }

  // Устанавливаем отформатированное значение
  e.target.value = formatted;

  // Восстанавливаем позицию курсора
  // Немного корректируем, так как форматирование могло изменить позицию
  let newCursorPosition = cursorPosition;
  if (formatted.length > e.target.value.length) {
    newCursorPosition -= formatted.length - e.target.value.length;
  }
  e.target.setSelectionRange(newCursorPosition, newCursorPosition);
});
