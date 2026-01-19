// Инициализация Canvas для нотного стана - просто очищаем
export function initializeMusicCanvas() {
  const canvas = document.getElementById("musicSheet");
  const ctx = canvas.getContext("2d");

  // Устанавливаем размеры canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
