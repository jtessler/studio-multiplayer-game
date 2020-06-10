function readOutLoud(message) {
  let speech = new SpeechSynthesisUtterance();
  // console.log(speech);
  speech.text = message;

  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

export default readOutLoud;
