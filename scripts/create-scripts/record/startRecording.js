// Начало записи
export async function startRecording() {
  try {
    // Запрашиваем доступ к микрофону
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
        channelCount: 1,
      },
    });

    // Определяем поддерживаемые форматы
    const options = { mimeType: "audio/webm" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = "audio/mp4";
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "";
      }
    }

    // Создаем MediaRecorder
    mediaRecorder = new MediaRecorder(audioStream, options);
    audioChunks = [];

    // Обработчик данных
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // Обработчик завершения записи
    mediaRecorder.onstop = () => {
      // Определяем тип файла на основе использованного mimeType
      let audioType = "audio/webm";
      if (options.mimeType === "audio/mp4") {
        audioType = "audio/mp4";
      } else if (!options.mimeType) {
        audioType = "audio/wav";
      }

      const audioBlob = new Blob(audioChunks, { type: audioType });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Отображаем записанное аудио
      recordedAudioPlayer.src = audioUrl;
      recordedAudioPlayer.style.display = "block";
      uploadedAudioPlayer.style.display = "none";

      // Обновляем интерфейс
      audioInputField.value = "Голосовая запись";

      // Показываем сообщение о успешной записи
      showMessage("Запись завершена успешно", "success");

      // Генерируем ноты из записи
      generateNotesFromBlob(audioBlob);
    };

    // Обработчик ошибок
    mediaRecorder.onerror = (event) => {
      console.error("Ошибка записи:", event.error);
      showMessage("Ошибка при записи звука", "error");
    };

    // Начинаем запись с интервалом 1000 мс для получения данных
    mediaRecorder.start(1000);
    isRecording = true;
    recordButton.classList.add("recording");
    audioInputField.value = "Идет запись...";

    showMessage(
      "Запись начата. Нажмите на микрофон еще раз чтобы остановить.",
      "info"
    );
  } catch (error) {
    console.error("Ошибка доступа к микрофону:", error);
    showMessage(
      "Не удалось получить доступ к микрофону. Проверьте разрешения.",
      "error"
    );
  }
}
