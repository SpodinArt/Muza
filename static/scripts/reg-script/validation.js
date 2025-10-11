export function validateEmail(email) {
  const re =
    /^(([^<>()[$$.,;:\s@"]+(\.[^<>()[$$.,;:\s@"]+)*)|(".+"))@(([^<>()[$$.,;:\s@"]+\.)+[^<>()[$$.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
  const re = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  return re.test(phone);
}

export function validatePassword(password) {
  return password.length >= 6;
}
