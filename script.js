const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Speech Recognition not supported in this browser. Try Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const output = document.getElementById("output");
  const toggleBtn = document.getElementById("toggle");
  let isListening = false;

  toggleBtn.addEventListener("click", () => {
    if (isListening) {
      recognition.stop();
      toggleBtn.textContent = "Start Listening";
    } else {
      recognition.start();
      toggleBtn.textContent = "Stop Listening";
    }
    isListening = !isListening;
  });

  let finalTranscript = "";

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        // Append only finalized results
        finalTranscript += transcript + " ";
      } else {
        // Interim result (live updating, but not finalized)
        interimTranscript += transcript;
      }
    }

    // Display final + interim (interim disappears when finalized)
    output.value = finalTranscript + interimTranscript;
  };

  recognition.onerror = (e) => {
    console.error("Speech Recognition Error:", e.error);
  };
}