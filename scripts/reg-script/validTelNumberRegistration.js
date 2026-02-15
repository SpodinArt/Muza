// reg-script/validTelNumberRegistration.js

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
        "ru", "ua", "by", "kz", "us", "de", "fr", "cn", "gb",
      ],
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      customPlaceholder: function () {
        return "XXX-XXX-XX-XX";
      },
    });

    phoneInputInstance = iti;

    // При вводе скрываем ошибку
    phoneInput.addEventListener("input", function () {
      hidePhoneError(this);
    });

    // При потере фокуса проверяем и показываем ошибку
    phoneInput.addEventListener("blur", function () {
      validatePhoneNumberAndShowError();
    });

    // Стилизация контейнера библиотеки (опционально)
    const wrapper = phoneInput.closest(".form-group");
    if (wrapper) {
      const itiContainer = wrapper.querySelector(".iti");
      if (itiContainer) {
        itiContainer.classList.add("custom-iti");
      }
    }
  }
}

// Скрыть ошибку
function hidePhoneError(inputElement) {
  const formGroup = inputElement.closest(".form-group");
  if (formGroup) {
    formGroup.classList.remove("is-invalid", "error");
    const feedback = formGroup.querySelector(".invalid-feedback");
    if (feedback) {
      feedback.style.display = "none";
    }
  }
}

// Показать ошибку
function showPhoneError(inputElement) {
  const formGroup = inputElement.closest(".form-group");
  if (formGroup) {
    formGroup.classList.add("is-invalid", "error");
    const feedback = formGroup.querySelector(".invalid-feedback");
    if (feedback) {
      feedback.style.display = "block";
    }
  }
}

// Проверка номера и отображение ошибки (возвращает true если валиден)
export function validatePhoneNumberAndShowError() {
  if (!phoneInputInstance) return false;

  const phoneInput = document.getElementById("register-phone");
  if (!phoneInput) return false;

  const isValid = phoneInputInstance.isValidNumber();

  if (isValid) {
    hidePhoneError(phoneInput);
  } else {
    showPhoneError(phoneInput);
  }

  return isValid;
}

// Существующие функции (оставлены без изменений)
export function validatePhoneNumber() {
  return phoneInputInstance ? phoneInputInstance.isValidNumber() : false;
}

export function getPhoneInputInstance() {
  return phoneInputInstance;
}