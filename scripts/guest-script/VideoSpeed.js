export function initVideoSpeed() {
  const video = document.getElementById("bg-video");
  
  if (video) {
    video.playbackRate = 0.5;
  } else {
    console.warn('Элемент видео с ID "bg-video" не найден');
  }
}