// Для многострочного текста
export function initializeMusicCanvas() {
  const canvas = document.getElementById("musicSheet");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const lines = ["Здесь будет отображаться", "результат генерации"];

  ctx.fillStyle = "#777";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = 28;
  const startY = canvas.height / 2 - (lineHeight * (lines.length - 1)) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });
}
