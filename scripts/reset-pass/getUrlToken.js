// Функция для получения токена из URL
export function getTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("Извлек токен с url");
  return urlParams.get("token");
}
