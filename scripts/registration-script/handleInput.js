import checkPhone from "./checkPhone.js";
import loginEmailOrPhone from "./maskPhoneLogin.js";

function handleInput() {
  const loginInput = document.getElementById("login-email");

  loginInput.addEventListener("input", (evt) => {
    loginEmailOrPhone(evt);
    console.log("просто заебись!");
  });
}
export default handleInput;
