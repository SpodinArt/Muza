// Функция проверки телефона
function checkPhone(phone) {
  // Принимаем номера в форматах:
  // +7 (XXX) XXX-XX-XX
  // 8 (XXX) XXX-XX-XX
  // XXX-XXX-XX-XX
  // XXXXXXXXXX
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && /^[78]?\d{10}$/.test(digits);
}
export default checkPhone ;