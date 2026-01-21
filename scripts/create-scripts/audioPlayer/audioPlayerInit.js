import { audioPlayer } from "./audioPlayer.js";

export function audioPlayerInit() {
  const defaultPlayerOne = document.getElementById("recordedAudioPlayer");
  const customPlayerOne = document.getElementById("audioPlayer");
  const defaultPlayerSecond = document.getElementById("uploadedAudioPlayer");
  const customPlayerSecond = document.getElementById("audioPlayerSecond");


  audioPlayer(defaultPlayerOne, customPlayerOne);
  audioPlayer(defaultPlayerSecond, customPlayerSecond);
}
