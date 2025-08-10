import { initTabSwitcher } from "./reg-script/tabSwitcher.js";
import { initPhoneMask } from "./reg-script/phoneMask.js";
import { initLoginForm } from "./reg-script/loginForm.js";
import { initRegisterForm } from "./reg-script/registerForm.js";
import { initSocialAuth } from "./reg-script/socialAuth.js";
import { initForgotPassword } from "./reg-script/forgotPassword.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabSwitcher();
  initPhoneMask();
  initLoginForm();
  initRegisterForm();
  initSocialAuth();
  initForgotPassword();
});
