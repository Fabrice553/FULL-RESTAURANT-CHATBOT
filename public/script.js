const API_BASE_URL = getApiUrl();
const DEVICE_ID = generateDeviceId();
let sessionId = null;
let isLoading = false;

function getApiUrl() {
    // Use current domain for API calls (works on both localhost and production)
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/api`;
}

function generateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const loadingIndicator = document.getElementById('loading');
const sessionIdDisplay = document.getElementById('sessionId');

window.addEventListener('load', initializeChat);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isLoading) sendMessage();
});
resetBtn.addEventListener('click', resetChat);

async function initializeChat() {
    try {
        await sendMessage('1', true);
    } catch (error) {
        console.error('Failed to initialize:', error);
        addMessage('bot', 'Error: Failed to connect to server');
    }
}

async function sendMessage(userMessage = null, isInitial = false) {
    if (isLoading) return;

    if (!userMessage) {
        userMessage = messageInput.value.trim();
        if (!userMessage) return;
    }

    messageInput.value = '';
    if (!isInitial) addMessage('user', userMessage);

    isLoading = true;
    loadingIndicator.style.display = 'flex';
    sendBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/chat/message`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({deviceId: DEVICE_ID, message: userMessage, sessionId}),
        });

        const data = await response.json();
        if (data.success) {
            if (data.data.sessionId) {
                sessionId = data.data.sessionId;
                sessionIdDisplay.textContent = sessionId.substring(0, 12) + '...';
            }
            addMessage('bot', data.data.botResponse);
        } else {
            addMessage('bot', 'Error: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Fetch error:', error);
        addMessage('bot', 'Error: ' + error.message);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = 'none';
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function resetChat() {
    if (confirm('Clear chat history?')) {
        messagesContainer.innerHTML = '';
        sessionId = null;
        sessionIdDisplay.textContent = 'Loading...';
        messageInput.value = '';
        initializeChat();
    }
}
