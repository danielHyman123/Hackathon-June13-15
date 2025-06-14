const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Speech Recognition not supported in this browser. Try Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const text = document.getElementById("text");
  const toggleBtn = document.getElementById("toggle");
  const generateBtn = document.getElementById("generate");

  let isListening = false;
  let finalTranscript = "";
  let storedTitle = ""; // ✅ declare the missing variable

  // Toggle speech recognition
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

  // Generate website from title
  generateBtn.addEventListener("click", () => {
    if (storedTitle) {
      makeWebsite(storedTitle);
    } else {
      makeWebsite("My Website");
    }
  });

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let transcript = event.results[i][0].transcript;
      console.log("Received prompt:", transcript);

      if (event.results[i].isFinal) {
        // Replace "slash dot"/"slash period" with "."
        transcript = replaceSlashDot(transcript);

        finalTranscript += transcript + " ";

        containsTitle(transcript);
      } else {
        interimTranscript += transcript;
      }
    }

    text.value = finalTranscript + interimTranscript;
  };

  recognition.onerror = (e) => {
    console.error("Speech Recognition Error:", e.error);
  };

  // Extract title from the transcript
  function containsTitle(transcript) {
    const found = /title/i.test(transcript);
    console.log(`Contains 'title'? ${found}`);

    const regex = /\btitle\b(.*)/i;
    const match = transcript.match(regex);

    if (match) {
      const extractedTitle = match[1].trim();
      console.log("Extracted Title:", extractedTitle);
      storedTitle = extractedTitle;
      return true;
    }
    return false;
  }

  // Replace "slash dot" or "slash period" with "."
  function replaceSlashDot(transcript) {
    const cleanedTranscript = transcript.replace(/\bslash\s+(dot|period)\b/gi, ".");
    console.log("Cleaned Transcript:", cleanedTranscript);
    return cleanedTranscript;
  }

  // Generate a basic website using the title
  function makeWebsite(title) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>This is a basic website generated with your voice.</p>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    console.log("Generated Website HTML:\n", html, "\nURL:", url);

    window.open(url, '_blank');
  }
}