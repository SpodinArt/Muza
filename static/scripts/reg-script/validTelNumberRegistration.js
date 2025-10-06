let phoneInputInstance = null;

export function initTelInput() {
  const phoneInput = document.getElementById("register-phone");

  if (phoneInput) {
    if (typeof intlTelInput === "undefined") {
      console.error("International Telephone Input library is not loaded");
      return;
    }

    const iti = intlTelInput(phoneInput, {
      initialCountry: "ru",
      separateDialCode: true,
      preferredCountries: [
        "ru",
        "ua",
        "by",
        "kz",
        "us",
        "de",
        "fr",
        "cn",
        "gb",
      ],
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      customPlaceholder: function (
        selectedCountryPlaceholder,
        selectedCountryData
      ) {
        return "XXX-XXX-XX-XX";
      },
    });

    // Сохраняем экземпляр в модульной переменной
    phoneInputInstance = iti;

    // Добавляем обработчик для скрытия ошибки при вводе
    phoneInput.addEventListener("input", function () {
      const formGroup = this.closest(".form-group");
      if (formGroup) {
        formGroup.classList.remove("is-invalid");
        const feedback = formGroup.querySelector(".invalid-feedback");
        if (feedback) {
          feedback.style.display = "none";
        }
      }
    });

    // Обновляем стили
    const wrapper = phoneInput.closest(".form-group");
    if (wrapper) {
      const itiContainer = wrapper.querySelector(".iti");
      if (itiContainer) {
        itiContainer.classList.add("custom-iti");
      }
    }
  }
}

// Валидация телефонного номера
export function validatePhoneNumber() {
  if (!phoneInputInstance) return false;
  return phoneInputInstance.isValidNumber();
}

// Получение экземпляра для работы
export function getPhoneInputInstance() {
  return phoneInputInstance;
}
// Особенности работы:

// Библиотека автоматически определяет страну пользователя

// При вводе номера отображается флаг выбранной страны

// При клике на флаг открывается список всех стран с фильтрацией

// Номер телефона автоматически форматируется в зависимости от страны

// Полный номер можно получить через iti.getNumber()

// Для валидации в форме регистрации можно использовать:

// javascript
// const phoneNumber = phoneInput.iti.getNumber();
// if (!phoneInput.iti.isValidNumber()) {
//   // Показать ошибку
// }
