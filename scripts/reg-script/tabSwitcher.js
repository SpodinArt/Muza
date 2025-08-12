export function initTabSwitcher() {
  const tabs = document.querySelectorAll(".auth-tab");
  const forms = document.querySelectorAll(".auth-form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      forms.forEach((f) => f.classList.remove("active"));

      this.classList.add("active");
      const tabName = this.getAttribute("data-tab");
      document.getElementById(`${tabName}-form`).classList.add("active");
    });
  });
}
export function hidePasswordFormRegister() {
  const buttonRegister = document.getElementById("buttonRegister");
  const resetPasswordForm = document.getElementById("reset-password-form");

  buttonRegister.addEventListener("click", () => {
    resetPasswordForm.style.display = "none";
  });
}
hidePasswordFormRegister();
hidePasswordFormLogin();

export function hidePasswordFormLogin() {
  const buttonLogin = document.getElementById("buttonLogin");
  const resetPasswordForm = document.getElementById("reset-password-form");

  buttonLogin.addEventListener("click", () => {
    resetPasswordForm.style.display = "none";
  });
}

