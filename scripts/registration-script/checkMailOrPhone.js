// Функция для проверки типа введенных данных (email или телефон)

import { checkEmail } from "./registration-script/checkEmail.js";
import { checkPhone } from "./registration-script/checkPhone.js";

function checkMailOrPhone(value) {
  if (validateEmail(value)) {
    return "email";
  }

  if (validatePhone(value)) {
    return "phone";
  }

  return false;
}

// Экспорт функции, если она будет использоваться в других модулях
export { checkMailOrPhone };
