let timerInterval;

export function startTimer() {
  let secondsLeft = 60; // Таймер на 1 минуту

  const timerDiv = document.createElement('div');
  timerDiv.id = 'timer';
  timerDiv.style.position = 'absolute'; // Стили для отображения формы таймера
  timerDiv.style.top = '50%';
  timerDiv.style.left = '50%';
  timerDiv.style.transform = 'translate(-50%, -50%)';
  timerDiv.style.backgroundColor = '#f0f0f0';
  timerDiv.style.padding = '10px';
  timerDiv.style.borderRadius = '5px';
  timerDiv.innerHTML = `<p>Подождите ещё ${secondsLeft} секунд.</p>`;

  document.body.appendChild(timerDiv); // Добавляем элемент таймера на страницу

  timerInterval = setInterval(() => {
    secondsLeft--;
    timerDiv.innerHTML = `<p>Подождите ещё ${secondsLeft} секунд.</p>`;
    
    if(secondsLeft === 0) {
      clearInterval(timerInterval);
      document.getElementById('send-email-btn').disabled = false; // Включаем кнопку обратно
      document.body.removeChild(timerDiv); // Удаляем таймер с экрана
    }
  }, 1000);
}