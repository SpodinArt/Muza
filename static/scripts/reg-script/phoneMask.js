export function initPhoneMask() {
  const phoneInput = document.getElementById("register-phone");
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value;
    let cleaned = value.replace(/\D/g, "");
    let hasPlus = value.includes("+");

    // Удаляем первую 7, если ввод начинается с '+7'
    if (hasPlus && cleaned[0] === "7") {
      cleaned = cleaned.substring(1);
    }

    // Обработка специального случая: только '+7'
    if (cleaned === "" && hasPlus) {
      e.target.value = "+7";
      return;
    }

    // Разбиваем на группы (3,3,2,2)
    let match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);

    if (!match) {
      e.target.value = value;
      return;
    }

    // Форматируем номер
    e.target.value = !match[1]
      ? "+7"
      : "+7 (" +
        match[1] +
        (match[2] ? ") " + match[2] : "") +
        (match[3] ? "-" + match[3] : "") +
        (match[4] ? "-" + match[4] : "");
  });
}
