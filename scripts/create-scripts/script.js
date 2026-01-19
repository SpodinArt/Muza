

// Обработка выбора файла
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Проверяем тип файла
        if (!file.type.startsWith('audio/')) {
            showMessage('Пожалуйста, выберите аудиофайл', 'error');
            return;
        }
        
        // Обновляем поле ввода с именем файла
        audioInputField.value = `Аудиофайл: ${file.name}`;
        
        // Создаем URL для воспроизведения
        const audioURL = URL.createObjectURL(file);
        uploadedAudioPlayer.src = audioURL;
        uploadedAudioPlayer.style.display = 'block';
        recordedAudioPlayer.style.display = 'none';
        
        // Показываем сообщение о успешной загрузке
        showMessage('Аудиофайл успешно загружен', 'success');
        
        // Генерируем ноты (заглушка)
        generateNotesFromAudio(file);
    }
}

// Переключение режима записи
async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

// Начало записи
async function startRecording() {
    try {
        // Запрашиваем доступ к микрофону
        audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
                channelCount: 1
            } 
        });
        
        // Определяем поддерживаемые форматы
        const options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'audio/mp4';
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = '';
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
            let audioType = 'audio/webm';
            if (options.mimeType === 'audio/mp4') {
                audioType = 'audio/mp4';
            } else if (!options.mimeType) {
                audioType = 'audio/wav';
            }
            
            const audioBlob = new Blob(audioChunks, { type: audioType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Отображаем записанное аудио
            recordedAudioPlayer.src = audioUrl;
            recordedAudioPlayer.style.display = 'block';
            uploadedAudioPlayer.style.display = 'none';
            
            // Обновляем интерфейс
            audioInputField.value = 'Голосовая запись';
            
            // Показываем сообщение о успешной записи
            showMessage('Запись завершена успешно', 'success');
            
            // Генерируем ноты из записи
            generateNotesFromBlob(audioBlob);
        };
        
        // Обработчик ошибок
        mediaRecorder.onerror = (event) => {
            console.error('Ошибка записи:', event.error);
            showMessage('Ошибка при записи звука', 'error');
        };
        
        // Начинаем запись с интервалом 1000 мс для получения данных
        mediaRecorder.start(1000);
        isRecording = true;
        recordButton.classList.add('recording');
        audioInputField.value = 'Идет запись...';
        
        showMessage('Запись начата. Нажмите на микрофон еще раз чтобы остановить.', 'info');
        
    } catch (error) {
        console.error('Ошибка доступа к микрофону:', error);
        showMessage('Не удалось получить доступ к микрофону. Проверьте разрешения.', 'error');
    }
}

// Остановка записи
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordButton.classList.remove('recording');
        
        // Останавливаем все треки
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }
    }
}

// Инициализация Canvas для нотного стана - просто очищаем
function initializeMusicCanvas() {
    const canvas = document.getElementById('musicSheet');
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Генерация нот из аудиофайла (заглушка)
function generateNotesFromAudio(file) {
    // Здесь будет реальная логика анализа аудио и генерации нот
    console.log('Анализ аудиофайла:', file.name);
    
    // Имитация обработки
    setTimeout(() => {
        showMessage('Ноты сгенерированы из аудиофайла', 'success');
    }, 1000);
}

// Генерация нот из blob записи (заглушка)
function generateNotesFromBlob(blob) {
    // Здесь будет реальная логика анализа аудио и генерации нот
    console.log('Анализ аудиозаписи');
    
    // Имитация обработки
    setTimeout(() => {
        showMessage('Ноты сгенерированы из записи', 'success');
    }, 1500);
}

// Функции управления тональностью
function increaseTone() {
    showMessage('Тональность повышена', 'info');
    // Реализация повышения тональности
    console.log('Повышение тональности');
}

function decreaseTone() {
    showMessage('Тональность понижена', 'info');
    // Реализация понижения тональности
    console.log('Понижение тональности');
}

function editNotes() {
    showMessage('Режим редактирования нот', 'info');
    // Реализация редактирования нот
    console.log('Редактирование нот');
}

function regenerateNotes() {
    showMessage('Перегенерация нот', 'info');
    // Реализация перегенерации нот
    console.log('Перегенерация нот');
}

// Вспомогательная функция для показа сообщений
function showMessage(message, type) {
    // Создаем элемент для сообщения
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-family: "Comfortaa-Regular", sans-serif;
        z-index: 1000;
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    // Устанавливаем цвет в зависимости от типа
    switch(type) {
        case 'success':
            messageEl.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            messageEl.style.backgroundColor = '#F44336';
            break;
        case 'info':
            messageEl.style.backgroundColor = '#2196F3';
            break;
        default:
            messageEl.style.backgroundColor = '#56524b';
    }
    
    // Добавляем в DOM
    document.body.appendChild(messageEl);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    const canvas = document.getElementById('musicSheet');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Предотвращение закрытия страницы во время записи
window.addEventListener('beforeunload', function(e) {
    if (isRecording) {
        e.preventDefault();
        e.returnValue = 'Идет запись аудио. Вы уверены, что хотите покинуть страницу?';
        return e.returnValue;
    }
});