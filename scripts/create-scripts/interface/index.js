import { audioPlayer } from "../audioPlayer/audioPlayer.js";
// import { showInterface } from "../script.js";
// showInterface();
audioPlayer("recordedAudioPlayer", "audioPlayer");

export function showInterface() {
  // Элементы DOM
  const audioInputField = document.getElementById("audioInputField");
  const uploadAudio = document.getElementById("uploadAudio");
  const recordButton = document.getElementById("recordButton");
  const uploadedAudioPlayer = document.getElementById("uploadedAudioPlayer");
  const recordedAudioPlayer = document.getElementById("recordedAudioPlayer");
  const musicSheet = document.getElementById("musicSheet");

  // Переменные для записи аудио
  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;
  let audioStream;

  // Обработчики событий
  document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
  });

  function initializeApp() {
    // Обработчик клика на поле ввода
    audioInputField.addEventListener("click", function () {
      uploadAudio.click();
    });

    // Обработчик выбора файла
    uploadAudio.addEventListener("change", handleFileSelect);

    // Обработчик кнопки записи
    recordButton.addEventListener("click", toggleRecording);

    // Инициализация Canvas для нот - просто очищаем
    initializeMusicCanvas();
  }

  // Обработка изменения размера окна
  window.addEventListener("resize", function () {
    const canvas = document.getElementById("musicSheet");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Предотвращение закрытия страницы во время записи
  window.addEventListener("beforeunload", function (e) {
    if (isRecording) {
      e.preventDefault();
      e.returnValue =
        "Идет запись аудио. Вы уверены, что хотите покинуть страницу?";
      return e.returnValue;
    }
  });
}
