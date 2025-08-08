// Маска для телефона в поле входа

function loginEmailOrPhone(e) {
  // Если ввод начинается с цифры или +, применяем маску телефона
  if (/^[\d+]/.test(e.target.value)) {
    let value = e.target.value;

    // Заменяем начальную 8 на +7
    if (value.startsWith("8")) {
      value = "+7" + value.substring(1);
    }

    // Удаляем все нецифровые символы, кроме ведущего +
    const digits = value.replace(/\D/g, "");

    // Если после +7 нет цифр, оставляем просто +7
    if (digits === "7" || digits === "") {
      e.target.value = "+7";
      return;
    }

    // Разбиваем на группы: код (7), затем 3-3-2-2
    const groups = digits.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

    if (!groups) {
      e.target.value = "+7";
      return;
    }

    // Форматируем: +7 (XXX) XXX-XX-XX
    let formatted = "+7";
    if (groups[1]) {
      formatted += ` (${groups[1]}`;
      if (groups[2]) {
        formatted += `) ${groups[2]}`;
        if (groups[3]) {
          formatted += `-${groups[3]}`;
          if (groups[4]) {
            formatted += `-${groups[4]}`;
          }
        }
      }
    }

    e.target.value = formatted;
  }
}

export default loginEmailOrPhone;
