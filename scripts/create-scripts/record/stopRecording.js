// Остановка записи
export function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    recordButton.classList.remove("recording");

    // Останавливаем все треки
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }
  }
}
