# Link to Platform
https://danielhyman123.github.io/Voice-to-website_builder/

# Features

🎙️ Voice Recognition - Uses browser's built-in Speech Recognition API
🌐 Real-time Preview - See your website update as you speak
📱 Responsive Design - Works on desktop, tablet, and mobile
💾 Download HTML - Save your created website as an HTML file
🎨 Modern UI - Beautiful gradient design with smooth animations
🔄 Live Updates - Website preview updates instantly with voice commands
🚫 No API Keys - Completely client-side, no external services needed

# Voice Commands

CommandExampleResulttitle [text]"title My Amazing Blog"Sets the website titleparagraph [text]"paragraph Welcome to my website"Adds a paragraphheading [text]"heading About Me"Creates a headinglist item [text]"list item First point"Adds a bullet pointlink [text] to [url]"link Google to google.com"Creates a clickable linknew line"new line"Adds a line break

# Browser Support

BrowserStatusNotesChrome✅ Full SupportRecommendedEdge✅ Full SupportWorks greatSafari✅ Full SupportiOS 14.5+ requiredFirefox❌ LimitedNo speech recognition support yet
📁 Project Structure
voice-to-website/
├── index.html          # Main application file
├── script.js           # JavaScript logic (embedded in HTML)
├── package.json        # Project metadata
├── server.js           # Optional Express server
└── README.md           # This file

# Installation & Setup

Option 1: Direct Usage (Recommended)
bash# Clone this repository
Open index.html in your browser

Option 2: With Express Server
bash# Install dependencies
npm install

# How to Use it

Open link at top of "ReadMe"
Click "Start Listening"
Speak your website content using voice commands
Generate or download your website!

Or

Clone or Download the repository
In Terminal, use 'npm start' command or double click index.html in Explorer
Click "Start Listening"
Speak your website content using voice commands
Generate or download your website!

# How It Works

Speech Recognition: Uses the browser's Web Speech API to convert speech to text
Command Processing: Parses voice commands using regex patterns
Real-time Rendering: Updates the preview as elements are added
HTML Generation: Creates complete, styled HTML documents
File Download: Uses Blob API to generate downloadable files

# Technical Details

No External APIs: Uses only browser-native Web APIs
Client-Side Only: No server required for basic functionality
Privacy Focused: Voice data never leaves your browser
Lightweight: No heavy dependencies or frameworks
Cross-Platform: Works on any device with a modern browser
