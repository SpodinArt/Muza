export function audioPlayer(audioDefaultPlayer, audioCustomtPlayer) {
  // Элементы DOM
  const audio = document.getElementById(audioDefaultPlayer);
  const audioPlayer = document.getElementById(audioCustomtPlayer);
  console.log(audioCustomtPlayer);
  const playPauseBtn = audioPlayer.querySelector("#playPauseBtn");
  const playIcon = audioPlayer.querySelector("#playIcon");
  const volumeIcon = audioPlayer.querySelector("#volumeIcon");
  const progressBar = audioPlayer.querySelector("#progressBar");
  const progressContainer = audioPlayer.querySelector("#progressContainer");
  const currentTimeEl = audioPlayer.querySelector("#currentTime");
  const durationEl = audioPlayer.querySelector("#duration");
  const volumeSlider = audioPlayer.querySelector("#volumeSlider");
  const volumeBtn = audioPlayer.querySelector("#volumeBtn");

  // Состояние
  let isPlaying = false;
  let lastVolume = 1;

  // Функции форматирования времени
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Обновление прогресс-бара
  function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100 || 0;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);

    if (!isNaN(duration) && duration > 0) {
      durationEl.textContent = formatTime(duration);
    }
  }

  // Перемотка при клике на прогресс-бар
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (!isNaN(duration) && duration > 0) {
      audio.currentTime = (clickX / width) * duration;
    }
  }

  // Управление воспроизведением
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.log("Ошибка воспроизведения:", e));
    }
  }

  // Обновление состояния кнопки play/pause
  function updatePlayButton() {
    isPlaying = !audio.paused;

    if (isPlaying) {
      playIcon.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
      playPauseBtn.setAttribute("title", "Пауза");
      audioPlayer.classList.add("playing");
    } else {
      playIcon.setAttribute("d", "M8 5v14l11-7z");
      playPauseBtn.setAttribute("title", "Воспроизвести");
      audioPlayer.classList.remove("playing");
    }
  }

  // Управление громкостью
  function updateVolume() {
    audio.volume = volumeSlider.value;

    // Обновление иконки громкости
    if (audio.volume === 0) {
      volumeIcon.setAttribute(
        "d",
        "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
      );
    } else if (audio.volume < 0.5) {
      volumeIcon.setAttribute(
        "d",
        "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
      );
    } else {
      volumeIcon.setAttribute(
        "d",
        "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
      );
    }
  }

  // Включение/выключение звука
  function toggleMute() {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeSlider.value = 0;
    } else {
      audio.volume = lastVolume;
      volumeSlider.value = lastVolume;
    }
    updateVolume();
  }

  // События
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);
  audio.addEventListener("ended", () => {
    isPlaying = false;
    updatePlayButton();
    // Сброс прогресс-бара в начало
    audio.currentTime = 0;
    updateProgress();
  });

  audio.addEventListener("volumechange", updateVolume);

  // Обработчики кликов
  playPauseBtn.addEventListener("click", togglePlay);
  progressContainer.addEventListener("click", setProgress);
  volumeSlider.addEventListener("input", updateVolume);
  volumeBtn.addEventListener("click", toggleMute);

  // Инициализация
  updatePlayButton();
  updateVolume();
}
