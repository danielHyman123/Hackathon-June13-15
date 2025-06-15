    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // DOM elements
      const text = document.getElementById("transcript");
      const toggleBtn = document.getElementById("toggle");
      const generateBtn = document.getElementById("generate");
      const downloadBtn = document.getElementById("download");
      const clearBtn = document.getElementById("clear");
      const statusDiv = document.getElementById("status");
      const previewDiv = document.getElementById("preview");

      // State variables
      let isListening = false;
      let finalTranscript = "";
      let storedTitle = "My Website";
      let storedElements = [];

      // Event listeners
      toggleBtn.addEventListener("click", toggleListening);
      generateBtn.addEventListener("click", generateWebsite);
      downloadBtn.addEventListener("click", downloadHTML);
      clearBtn.addEventListener("click", clearAll);

      // Speech recognition event handlers
      recognition.onresult = handleSpeechResult;
      recognition.onerror = handleSpeechError;
      recognition.onend = handleSpeechEnd;

      function toggleListening() {
        if (isListening) {
          recognition.stop();
          updateStatus(false);
          toggleBtn.textContent = "Start Listening";
        } else {
          recognition.start();
          updateStatus(true);
          toggleBtn.textContent = "Stop Listening";
        }
        isListening = !isListening;
      }

      function updateStatus(listening) {
        const pulse = statusDiv.querySelector('.pulse');
        const statusText = statusDiv.querySelector('span');
        
        if (listening) {
          statusDiv.className = 'status-indicator listening';
          pulse.style.background = '#28a745';
          pulse.style.animation = 'pulse 1.5s infinite';
          statusText.textContent = 'Listening...';
        } else {
          statusDiv.className = 'status-indicator stopped';
          pulse.style.background = '#dc3545';
          pulse.style.animation = 'none';
          statusText.textContent = 'Ready to listen';
        }
      }

      function handleSpeechResult(event) {
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            transcript = cleanTranscript(transcript);
            finalTranscript += transcript + " ";
            processCommand(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        
        text.value = finalTranscript + interimTranscript;
      }

      function handleSpeechError(event) {
        console.error("Speech Recognition Error:", event.error);
        updateStatus(false);
        toggleBtn.textContent = "Start Listening";
        isListening = false;
      }

      function handleSpeechEnd() {
        if (isListening) {
          recognition.start(); // Restart if we were still supposed to be listening
        }
      }

      function cleanTranscript(transcript) {
        return transcript
          .replace(/\bslash\s+(dot|period)\b/gi, ".")
          .replace(/\bslash\s+slash\b/gi, "/")
          .replace(/\bat\s+sign\b/gi, "@")
          .replace(/\bhash\s+tag\b/gi, "#")
          .replace(/\bdollar\s+sign\b/gi, "$")
          .replace(/\bpercent\s+sign\b/gi, "%")
          .replace(/\bampersand\b/gi, "&")
          .replace(/\basterisk\b/gi, "*")
          .replace(/\bplus\s+sign\b/gi, "+")
          .replace(/\bequals\s+sign\b/gi, "=")
          .replace(/\bquestion\s+mark\b/gi, "?")
          .replace(/\bexclamation\s+(mark|point)\b/gi, "!")
          .trim();
      }

      function processCommand(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        // Title command
        if (lowerTranscript.includes('title')) {
          const titleMatch = transcript.match(/title\s+(.+)/i);
          if (titleMatch) {
            storedTitle = titleMatch[1].trim();
            console.log("Title set:", storedTitle);
          }
        }
        
        // Paragraph command
        else if (lowerTranscript.includes('paragraph')) {
          const paragraphMatch = transcript.match(/paragraph\s+(.+)/i);
          if (paragraphMatch) {
            storedElements.push({
              type: 'paragraph',
              content: paragraphMatch[1].trim()
            });
            console.log("Paragraph added:", paragraphMatch[1].trim());
          }
        }
        
        // Heading command
        else if (lowerTranscript.includes('heading')) {
          const headingMatch = transcript.match(/heading\s+(.+)/i);
          if (headingMatch) {
            storedElements.push({
              type: 'heading',
              content: headingMatch[1].trim()
            });
            console.log("Heading added:", headingMatch[1].trim());
          }
        }
        
        // List item command
        else if (lowerTranscript.includes('list item')) {
          const listMatch = transcript.match(/list item\s+(.+)/i);
          if (listMatch) {
            storedElements.push({
              type: 'listitem',
              content: listMatch[1].trim()
            });
            console.log("List item added:", listMatch[1].trim());
          }
        }
        
        // Link command
        else if (lowerTranscript.includes('link') && lowerTranscript.includes('to')) {
          const linkMatch = transcript.match(/link\s+(.+?)\s+to\s+(.+)/i);
          if (linkMatch) {
            storedElements.push({
              type: 'link',
              content: linkMatch[1].trim(),
              url: linkMatch[2].trim()
            });
            console.log("Link added:", linkMatch[1].trim(), "->", linkMatch[2].trim());
          }
        }
        
        // New line command
        else if (lowerTranscript.includes('new line')) {
          storedElements.push({
            type: 'break'
          });
          console.log("Line break added");
        }
        
        updatePreview();
      }

      function updatePreview() {
        let html = `<h1>${storedTitle}</h1>`;
        
        if (storedElements.length === 0) {
          html += `<p>Start speaking to build your website!</p>`;
        } else {
          let currentList = [];
          
          storedElements.forEach(element => {
            switch (element.type) {
              case 'paragraph':
                if (currentList.length > 0) {
                  html += `<ul>${currentList.map(item => `<li>${item}</li>`).join('')}</ul>`;
                  currentList = [];
                }
                html += `<p>${element.content}</p>`;
                break;
              case 'heading':
                if (currentList.length > 0) {
                  html += `<ul>${currentList.map(item => `<li>${item}</li>`).join('')}</ul>`;
                  currentList = [];
                }
                html += `<h2>${element.content}</h2>`;
                break;
              case 'listitem':
                currentList.push(element.content);
                break;
              case 'link':
                if (currentList.length > 0) {
                  html += `<ul>${currentList.map(item => `<li>${item}</li>`).join('')}</ul>`;
                  currentList = [];
                }
                html += `<p><a href="${element.url}" target="_blank">${element.content}</a></p>`;
                break;
              case 'break':
                if (currentList.length > 0) {
                  html += `<ul>${currentList.map(item => `<li>${item}</li>`).join('')}</ul>`;
                  currentList = [];
                }
                html += `<br>`;
                break;
            }
          });
          
          if (currentList.length > 0) {
            html += `<ul>${currentList.map(item => `<li>${item}</li>`).join('')}</ul>`;
          }
        }
        
        previewDiv.innerHTML = html;
      }

      function generateWebsite() {
        const fullHTML = createFullHTML();
        const blob = new Blob([fullHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }

      function downloadHTML() {
        const fullHTML = createFullHTML();
        const blob = new Blob([fullHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${storedTitle.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      function createFullHTML() {
        const contentHTML = previewDiv.innerHTML;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${storedTitle}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #333;
      background: #f8f9fa;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    p {
      margin-bottom: 15px;
      text-align: justify;
    }
    ul {
      margin-bottom: 20px;
      padding-left: 30px;
    }
    li {
      margin-bottom: 8px;
    }
    a {
      color: #3498db;
      text-decoration: none;
      border-bottom: 1px solid #3498db;
      transition: color 0.3s ease;
    }
    a:hover {
      color: #2980b9;
      border-bottom-color: #2980b9;
    }
    @media (max-width: 600px) {
      body {
        padding: 20px 15px;
      }
      h1 {
        font-size: 1.8rem;
      }
    }
  </style>
</head>
<body>
  ${contentHTML}
  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 0.9rem;">
    <p>Generated with Voice to Website Builder</p>
  </footer>
</body>
</html>`;
      }

      function clearAll() {
        finalTranscript = "";
        storedTitle = "My Website";
        storedElements = [];
        text.value = "";
        updatePreview();
        console.log("All data cleared");
      }

      // Initialize preview
      updatePreview();
    }