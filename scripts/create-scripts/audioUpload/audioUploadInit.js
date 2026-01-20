import { handleFileSelect } from "./handleFileSelect.js";
export function audioUploadInit() {
  const uploadAudio = document.getElementById("uploadAudio");

  // Обработчик выбора файла
  uploadAudio.addEventListener("change", handleFileSelect);
}
