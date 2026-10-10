let recognition;
let isLiveSessionActive = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'ur-PK'; // Urdu / English multi-language support

    recognition.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        document.getElementById('userInput').value = transcript;
        sendMessage();
    };
}

function startVoiceRecognition() {
    if (recognition) {
        recognition.start();
        isLiveSessionActive = true;
        document.getElementById('startVoiceBtn').disabled = true;
        document.getElementById('stopVoiceBtn').disabled = false;
        appendMessage('assistant-msg', 'Live Voice Session Started. Speak now...');
    } else {
        alert('Browser Speech Recognition not supported.');
    }
}

function stopVoiceRecognition() {
    if (recognition && isLiveSessionActive) {
        recognition.stop();
        isLiveSessionActive = false;
        document.getElementById('startVoiceBtn').disabled = false;
        document.getElementById('stopVoiceBtn').disabled = true;
        appendMessage('assistant-msg', 'Live Voice Session Stopped.');
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

function appendMessage(className, text) {
    const chatBox = document.getElementById('chatBox');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user-msg', message);
    input.value = '';

    try {
        const response = await fetch('api/chat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        if (data.status === 'success') {
            appendMessage('assistant-msg', data.response);
            speakText(data.response);
        } else {
            appendMessage('assistant-msg', 'Error: ' + data.message);
        }
    } catch (err) {
        appendMessage('assistant-msg', 'Server connection error.');
    }
}

async function uploadDocument() {
    const fileInput = document.getElementById('docFile');
    if (!fileInput.files.length) {
        alert('Please select a file first.');
        return;
    }

    const formData = new FormData();
    formData.append('document', fileInput.files[0]);

    const res = await fetch('api/upload.php', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    alert(data.message);
    if (data.status === 'success') fileInput.value = '';
}