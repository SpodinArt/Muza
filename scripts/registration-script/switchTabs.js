// Переключение между табами
const tabs = document.querySelectorAll(".auth-tab");
const forms = document.querySelectorAll(".auth-form");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    // Удаляем активный класс у всех табов и форм
    tabs.forEach((t) => t.classList.remove("active"));
    forms.forEach((f) => f.classList.remove("active"));

    // Добавляем активный класс текущему табу и соответствующей форме
    this.classList.add("active");
    const tabName = this.getAttribute("data-tab");
    document.getElementById(`${tabName}-form`).classList.add("active");
  });
});
