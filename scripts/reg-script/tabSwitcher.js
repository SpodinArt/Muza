export function initTabSwitcher() {
  const tabs = document.querySelectorAll(".auth-tab");
  const forms = document.querySelectorAll(".auth-form");
  const resetForm = document.getElementById("reset-password-form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // 1. Сбрасываем активные состояния у всех вкладок и форм
      tabs.forEach((t) => t.classList.remove("active"));
      forms.forEach((f) => f.classList.remove("active"));

      // 2. Скрываем форму восстановления пароля (если она открыта)
      if (resetForm) {
        resetForm.style.display = "none";
      }

      // 3. Активируем текущую вкладку
      this.classList.add("active");
      const tabName = this.getAttribute("data-tab");

      // 4. Показываем соответствующую форму (login-form или register-form)
      const activeForm = document.getElementById(`${tabName}-form`);
      if (activeForm) {
        activeForm.classList.add("active");
      }
    });
  });
}
