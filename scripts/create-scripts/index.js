import { initializeMusicCanvas } from "../create-scripts/canvas/initializeMusicCanvas.js";
import { audioUploadInit } from "./audioUpload/audioUploadInit.js";
import { audioPlayerInit } from "./audioPlayer/audioPlayerInit.js";

window.addEventListener("load", () => {
  console.log("это нужный файл");
  initializeMusicCanvas();
  audioUploadInit();
  console.log("vse OK");
  audioPlayerInit();
});
