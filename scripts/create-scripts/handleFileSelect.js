// Обработка выбора файла
export function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    // Проверяем тип файла
    if (!file.type.startsWith("audio/")) {
      showMessage("Пожалуйста, выберите аудиофайл", "error");
      return;
    }

    // Обновляем поле ввода с именем файла
    audioInputField.value = `Аудиофайл: ${file.name}`;

    // Создаем URL для воспроизведения
    const audioURL = URL.createObjectURL(file);
    uploadedAudioPlayer.src = audioURL;
    uploadedAudioPlayer.style.display = "block";
    recordedAudioPlayer.style.display = "none";

    // Показываем сообщение о успешной загрузке
    showMessage("Аудиофайл успешно загружен", "success");

    // Генерируем ноты (заглушка)
    generateNotesFromAudio(file);
  }
}
