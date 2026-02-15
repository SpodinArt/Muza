export function validateEmail(email) {
  // Проверка типа
  if (typeof email !== "string") return false;

  // Удаляем пробелы по краям
  email = email.trim();

  // Не пустой
  if (!email) return false;

  // Максимум 254 символа
  if (email.length > 254) return false;

  // Обязательный @ и только один
  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // Локальная часть не пуста и состоит из допустимых символов
  if (local.length === 0) return false;
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;

  // Домен не пуст
  if (!domain) return false;

  // Требуем хотя бы одну точку в домене (наличие домена верхнего уровня)
  if (!domain.includes(".")) return false;

  // Проверка формата домена (буквы, цифры, дефисы, разделённые точками)
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!domainRegex.test(domain)) return false;

  // Нормализация в lowercase
  return email.toLowerCase();
}

export function validatePhone(phone) {
  // Проверка типа
  if (typeof phone !== "string") return false;

  // Не пустой (пустая строка или только пробелы)
  if (!phone.trim()) return false;

  // Очистка от дефисов, скобок и пробелов (нормализация в E.164)
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Проверка формата: начинается с +, затем только цифры
  if (!/^\+\d+$/.test(cleaned)) return false;

  // После + не больше 15 цифр (стандарт E.164)
  if (cleaned.length > 16) return false; // +15 цифр = 16 символов

  // Минимальная длина: + и хотя бы 5 цифр (можно скорректировать при необходимости)
  if (cleaned.length < 6) return false; // +12345 = 6 символов

  // Возврат нормализованного номера (код страны может быть любым)
  return cleaned;
}

export function validateLogin(login) {
  // Проверка типа
  if (typeof login !== "string") return false;

  // Удаляем пробелы по краям
  login = login.trim();

  // Не пустой
  if (!login) return false;

  // Максимум 254 символа
  if (login.length > 254) return false;

  // Минимальная длина 3 символа
  if (login.length < 3) return false;

  // Разрешённые символы: латиница, кириллица, цифры, дефис, подчёркивание
  if (!/^[a-zA-Zа-яА-ЯёЁ0-9_-]+$/.test(login)) return false;

  // Запрет системных имён
  const forbiddenNames = [
    "admin",
    "root",
    "system",
    "administrator",
    "superuser",
  ];
  if (forbiddenNames.includes(login.toLowerCase())) return false;

  // Возврат логина (уже обрезан)
  return login;
}

export function validatePassword(password) {
  // Проверка типа
  if (typeof password !== "string") return false;

  // Не пустой (опционально, но регулярка потребует минимум 8 символов)
  if (!password) return false;

  // Ограничение максимальной длины (например, 128 символов)
  if (password.length > 128) return false;

  // Минимум 8 символов, хотя бы одна заглавная и одна строчная буква, цифра и любой спецсимвол
  // Поддержка кириллицы и других символов через Unicode-категории
  const passwordRegex =
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*\d)(?=.*[\p{P}\p{S}])[\p{L}\d\p{P}\p{S}]{8,}$/u;
  return passwordRegex.test(password);
}
