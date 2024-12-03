// Theme Toggle
function toggleDayNight() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.getElementById('dayNightToggle').textContent = newTheme === 'dark' ? '🌙' : '🌞';
    localStorage.setItem('theme', newTheme);
}

// Load Theme on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('dayNightToggle').textContent = savedTheme === 'dark' ? '🌙' : '🌞';
});

// User Login
function login() {
    const email = document.getElementById('email').value;
    if (email) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
    } else {
        alert('Please enter a valid email.');
    }
}

// Logout
function logout() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
}

// Speech-to-Text Functions
let selectedLanguage = 'en';
let recognition;
let isListening = false;
let lastText = "";
let undoStack = [];
let redoStack = [];

function changeLanguage(language) {
    selectedLanguage = language;
    alert(`Language changed to ${language}`);
}

function startListening() {
    if (isListening) return;
    isListening = true;

    // Set up speech recognition
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    recognition.onstart = () => {
        document.getElementById('recordingTimer').style.display = 'block';
        startTimer();
    };

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        document.getElementById('outputText').value = transcript;
        lastText = transcript;
    };

    recognition.onend = () => {
        isListening = false;
        document.getElementById('recordingTimer').style.display = 'none';
    };
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }
    isListening = false;
}

function copyText() {
    const text = document.getElementById('outputText').value;
    navigator.clipboard.writeText(text);
}

function undoText() {
    if (undoStack.length > 0) {
        const lastAction = undoStack.pop();
        redoStack.push(lastText);
        document.getElementById('outputText').value = lastAction;
    }
}

function redoText() {
    if (redoStack.length > 0) {
        const redoAction = redoStack.pop();
        undoStack.push(lastText);
        document.getElementById('outputText').value = redoAction;
    }
}

function eraseText() {
    const currentText = document.getElementById('outputText').value;
    document.getElementById('outputText').value = currentText.slice(0, -1);
}

function clearText() {
    undoStack.push(lastText);
    document.getElementById('outputText').value = '';
}

function downloadPDF() {
    const text = document.getElementById('outputText').value;
    if (!text) {
        alert('Nothing to save as PDF!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text(text, 10, 10, { maxWidth: 190 });
    pdf.save('speech-to-text.pdf');
}

// Timer for recording
let timer = 0;
let timerInterval;

function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('recordingTimer').textContent = `Recording: ${timer}s`;
    }, 1000);
}