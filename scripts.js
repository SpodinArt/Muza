// Открытие навигационного меню на мобильных устройствах
document
  .querySelector(".navigation-bar")
  .addEventListener("click", function () {
    this.classList.toggle("active");
  });

// Переключение активного состояния кнопки переключателя языка
const languageButton = document.getElementById("languageToggle");
if (languageButton) {
  languageButton.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "ru";
    if (currentLang === "ru") {
      setLanguage("en");
    } else {
      setLanguage("ru");
    }
  });
}

// Установка выбранного языка
function setLanguage(lang) {
  // Сохраняем выбранный язык в локальном хранилище браузера
  localStorage.setItem("lang", lang);
  location.reload(); // Перезагружаем страницу, чтобы применить изменения
}

// Определяем выбранный язык при загрузке страницы
window.onload = function () {
  let selectedLang = localStorage.getItem("lang") || "ru"; // По умолчанию русский
  updatePageLanguage(selectedLang);
};

// Изменяет интерфейс в зависимости от выбранного языка
function updatePageLanguage(lang) {
  // Реализуйте изменение интерфейса здесь
  console.log(`Selected Language: ${lang}`);
}

// Пример открытия профиля пользователя
document
  .querySelector(".profile-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    alert("Profile clicked!");
  });
