// Обработка выбора сложности
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    difficultyBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Обработка загрузки файла
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const progressContainer = document.getElementById("progress-container");
const uploadProgress = document.getElementById("upload-progress");
const resultSection = document.getElementById("result-section");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    // Симуляция загрузки файла
    progressContainer.style.display = "block";
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      uploadProgress.value = progress;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressContainer.style.display = "none";
          resultSection.style.display = "block";

          // Показываем пример результата
          const resultContent = document.getElementById("result-content");
          const instrument = document.getElementById("instrument").value;
          const difficulty = document.querySelector(
            ".difficulty-btn.active"
          ).textContent;

          if (
            document.getElementById("create-notes").classList.contains("active")
          ) {
            resultContent.innerHTML = `<p>Нотная запись для ${instrument} (${difficulty} уровень)</p>
                                                         <div style="background:#f9f9f9; padding:20px; margin:10px 0;">
                                                         Пример нотного стана с мелодией...
                                                         </div>`;
          } else {
            resultContent.innerHTML = `<p>Табулатура для ${instrument} (${difficulty} уровень)</p>
                                                         <div style="background:#f9f9f9; padding:20px; margin:10px 0; font-family:monospace;">
                                                         e|-----------------0-----------------<br>
                                                         B|-------------1--------1------------<br>
                                                         G|----------2---------------2--------<br>
                                                         D|-------2----------------------2-----<br>
                                                         A|----0----------------------------0-<br>
                                                         E|-3--------------------------------3<br>
                                                         </div>`;
          }
        }, 500);
      }
    }, 200);
  }
});

// Обработка выбора между нотами и табами
const createNotesBtn = document.getElementById("create-notes");
const createTabsBtn = document.getElementById("create-tabs");

createNotesBtn.addEventListener("click", () => {
  createNotesBtn.classList.add("active");
  createTabsBtn.classList.remove("active");
});

createTabsBtn.addEventListener("click", () => {
  createTabsBtn.classList.add("active");
  createNotesBtn.classList.remove("active");
});

// По умолчанию выбираем "Создать ноты"
createNotesBtn.classList.add("active");

// Обработка кнопки сохранения
document.getElementById("save-btn").addEventListener("click", () => {
  alert("Файл готов к скачиванию!");
});
