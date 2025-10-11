(function () {
  // Создаем структуру HTML для уведомления и модального окна
  const cookieNotificationHTML = `
    <div id="cookieNotification" class="cookie-notification">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3>🍪 Использование cookies</h3>
          <p>Мы используем файлы cookie для работы сайта, аналитики и персонализации. Подробнее в нашей 
            <a href="/privacy-policy" target="_blank">Политике конфиденциальности</a>.
          </p>
        </div>
        <div class="cookie-buttons">
          <button id="cookieSettings" class="cookie-btn settings-btn">Настройки</button>
          <button id="cookieAcceptAll" class="cookie-btn accept-btn">Принять все</button>
          <button id="cookieAcceptNecessary" class="cookie-btn necessary-btn">Только необходимые</button>
        </div>
      </div>
    </div>

    <div id="cookieModal" class="cookie-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Настройки файлов cookie</h3>
          <button id="modalClose" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="cookie-category">
            <div class="category-header">
              <label class="toggle">
                <input type="checkbox" name="necessary" checked disabled>
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <strong>Обязательные cookies</strong>
                <p>Необходимы для работы сайта. Не могут быть отключены.</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <div class="category-header">
              <label class="toggle">
                <input type="checkbox" name="analytics">
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <strong>Аналитические cookies</strong>
                <p>Помогают нам анализировать использование сайта и улучшать его.</p>
              </div>
            </div>
          </div>

          <div class="cookie-category">
            <div class="category-header">
              <label class="toggle">
                <input type="checkbox" name="marketing">
                <span class="slider"></span>
              </label>
              <div class="category-info">
                <strong>Маркетинговые cookies</strong>
                <p>Используются для показа релевантной рекламы.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button id="savePreferences" class="save-btn">Сохранить настройки</button>
        </div>
      </div>
    </div>
  `;

  // Вставляем HTML в тело документа
  document.body.insertAdjacentHTML("beforeend", cookieNotificationHTML);

  // Функции для работы с cookies
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

  // Основная логика
  document.addEventListener("DOMContentLoaded", function () {
    const notification = document.getElementById("cookieNotification");
    const modal = document.getElementById("cookieModal");
    const acceptAllBtn = document.getElementById("cookieAcceptAll");
    const necessaryBtn = document.getElementById("cookieAcceptNecessary");
    const settingsBtn = document.getElementById("cookieSettings");
    const saveBtn = document.getElementById("savePreferences");
    const closeBtn = document.getElementById("modalClose");

    // Проверяем, было ли уже принято соглашение
    if (!getCookie("cookieConsent")) {
      showNotification();
    }

    // Обработчики событий
    acceptAllBtn.addEventListener("click", acceptAll);
    necessaryBtn.addEventListener("click", acceptNecessary);
    settingsBtn.addEventListener("click", showModal);
    saveBtn.addEventListener("click", savePreferences);
    closeBtn.addEventListener("click", hideModal);

    // Закрытие модального окна при клике вне его
    modal.addEventListener("click", function (e) {
      if (e.target === modal) hideModal();
    });

    function showNotification() {
      notification.style.display = "block";
      // Блокируем прокрутку страницы? (опционально, но может раздражать)
      // document.body.style.overflow = 'hidden';
    }

    function hideNotification() {
      notification.style.display = "none";
      // document.body.style.overflow = '';
    }

    function showModal() {
      modal.style.display = "flex";
      // Восстанавливаем предыдущие настройки
      const preferences = getCookiePreferences();
      document.querySelector('input[name="analytics"]').checked =
        preferences.analytics;
      document.querySelector('input[name="marketing"]').checked =
        preferences.marketing;
    }

    function hideModal() {
      modal.style.display = "none";
    }

    function acceptAll() {
      setCookieConsent({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      });
      hideNotification();
      initializeServices(); // Инициализация всех сервисов
    }

    function acceptNecessary() {
      setCookieConsent({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      });
      hideNotification();
      initializeServices(); // Инициализация только необходимых сервисов
    }

    function savePreferences() {
      const analytics = document.querySelector(
        'input[name="analytics"]'
      ).checked;
      const marketing = document.querySelector(
        'input[name="marketing"]'
      ).checked;

      setCookieConsent({
        necessary: true,
        analytics: analytics,
        marketing: marketing,
        timestamp: new Date().toISOString(),
      });

      hideModal();
      hideNotification();
      initializeServices(); // Инициализация сервисов согласно настройкам
    }

    function setCookieConsent(preferences) {
      // Сохраняем на 1 год
      setCookie("cookieConsent", JSON.stringify(preferences), 365);

      // Логируем согласие (для соблюдения GDPR)
      logConsent(preferences);
    }

    function getCookiePreferences() {
      const consent = getCookie("cookieConsent");
      if (consent) {
        return JSON.parse(consent);
      }
      return {
        necessary: true,
        analytics: false,
        marketing: false,
      };
    }

    function initializeServices() {
      const preferences = getCookiePreferences();

      // Инициализация аналитических сервисов (Google Analytics и т.д.)
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

    function logConsent(preferences) {
      // Отправка данных о согласии на сервер для соблюдения GDPR
      // Замените на ваш endpoint
      fetch("/api/consent-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: preferences,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }

    // Заглушки для инициализации сервисов
    function initNecessary() {
      console.log("Initializing necessary services...");
      // Сессионные cookies, корзина, аутентификация
    }

    function initAnalytics() {
      console.log("Initializing analytics services...");
      // Google Analytics, Yandex.Metrica и т.д.
      // if (window.gtag) { gtag('config', 'GA_MEASUREMENT_ID'); }
    }

    function initMarketing() {
      console.log("Initializing marketing services...");
      // Facebook Pixel, ретаргетинг и т.д.
    }

    // Инициализация при загрузке страницы
    initializeServices();
  });
})();
