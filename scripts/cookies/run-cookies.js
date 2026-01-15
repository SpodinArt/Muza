(function () {
  // Проверяем, есть ли согласие в localStorage
  function hasCookieConsent() {
    return localStorage.getItem("cookies") === "1";
  }

  // Сохраняем согласие в localStorage
  function setCookieConsent() {
    localStorage.setItem("cookies", "1");
  }

  // Основная логика
  document.addEventListener("DOMContentLoaded", function () {
    const notification = document.getElementById("cookieNotification");
    const modal = document.getElementById("cookieModal");
    const acceptBtn = document.getElementById("cookieAccept");
    const settingsBtn = document.getElementById("cookieSettings");
    const saveSettingsBtn = document.getElementById("saveSettings");
    const closeBtn = document.querySelector("#cookieModal .close-btn");

    // Если уже есть согласие, не показываем форму
    if (hasCookieConsent()) {
      // Инициализируем сервисы согласно сохраненным настройкам
      initializeServices();
      return;
    }

    // Показываем уведомление с задержкой 3 секунды
    setTimeout(() => {
      notification.style.display = "block";
    }, 3000);

    // Обработчики событий
    acceptBtn.addEventListener("click", acceptAll);
    settingsBtn.addEventListener("click", showModal);

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", savePreferences);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", hideModal);
    }

    // Закрытие модального окна при клике вне его
    modal.addEventListener("click", function (e) {
      if (e.target === modal) hideModal();
    });

    function hideNotification() {
      notification.style.display = "none";
    }

    function showModal() {
      modal.style.display = "flex";

      // Восстанавливаем предыдущие настройки (если есть)
      const preferences = getCookiePreferences();
      const analyticsCheckbox = modal.querySelector('input[name="analytics"]');
      const marketingCheckbox = modal.querySelector('input[name="marketing"]');

      if (analyticsCheckbox) {
        analyticsCheckbox.checked = preferences.analytics;
      }

      if (marketingCheckbox) {
        marketingCheckbox.checked = preferences.marketing;
      }
    }

    function hideModal() {
      modal.style.display = "none";
    }

    function acceptAll() {
      // Сохраняем факт согласия
      setCookieConsent();

      // Сохраняем полное согласие в cookie
      setCookiePreferences({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      });

      hideNotification();
      initializeServices();
    }

    function savePreferences() {
      // Сохраняем факт согласия
      setCookieConsent();

      // Собираем настройки
      const analytics =
        modal.querySelector('input[name="analytics"]')?.checked || false;
      const marketing =
        modal.querySelector('input[name="marketing"]')?.checked || false;

      // Сохраняем настройки в cookie
      setCookiePreferences({
        necessary: true,
        analytics: analytics,
        marketing: marketing,
        timestamp: new Date().toISOString(),
      });

      hideModal();
      hideNotification();
      initializeServices();
    }

    // Функции для работы с cookies (из оригинального кода)
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + date.toUTCString();
      document.cookie =
        name +
        "=" +
        encodeURIComponent(value) +
        ";" +
        expires +
        ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
      return null;
    }

    function setCookiePreferences(preferences) {
      // Сохраняем на 1 год
      setCookie("cookieConsent", JSON.stringify(preferences), 365);

      // Для обратной совместимости также сохраняем настройки в localStorage
      localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    }

    function getCookiePreferences() {
      // Сначала проверяем cookie
      const consent = getCookie("cookieConsent");
      if (consent) {
        return JSON.parse(consent);
      }

      // Затем проверяем localStorage
      const stored = localStorage.getItem("cookiePreferences");
      if (stored) {
        return JSON.parse(stored);
      }

      // Значения по умолчанию
      return {
        necessary: true,
        analytics: false,
        marketing: false,
      };
    }

    function initializeServices() {
      const preferences = getCookiePreferences();

      // Инициализация аналитических сервисов
      if (preferences.analytics) {
        initAnalytics();
      }

      // Инициализация рекламных сервисов
      if (preferences.marketing) {
        initMarketing();
      }

      // Обязательные сервисы всегда инициализируются
      initNecessary();
    }

    // Заглушки для инициализации сервисов
    function initNecessary() {
      console.log("Initializing necessary services...");
    }

    function initAnalytics() {
      console.log("Initializing analytics services...");
    }

    function initMarketing() {
      console.log("Initializing marketing services...");
    }

    // Инициализируем при загрузке, если есть согласие
    if (hasCookieConsent()) {
      initializeServices();
    }
  });
})();
