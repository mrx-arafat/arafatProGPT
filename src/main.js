/**
 * Arafat Chat - AI Chat Application
 * A full-featured chat interface for Antigravity Claude Proxy
 */

import './styles.css';

// ================================
// 🔐 AUTHENTICATION SYSTEM
// ================================
const AUTH_CONFIG = {
    username: import.meta.env.VITE_APP_USERNAME || 'admin',
    password: import.meta.env.VITE_APP_PASSWORD || 'password',
    maxAttempts: 5,
    lockoutTime: 30000 // 30 seconds
};

let loginAttempts = 0;
let isLockedOut = false;
let lockoutTimer = null;

// Funny error messages for wrong credentials
const funnyErrors = [
    "🚫 Nice try, but that's not it! Are you even trying?",
    "🤔 Hmm... my grandma could guess better than that!",
    "😅 Wrong! Did you try turning your brain off and on again?",
    "🎭 Impostor detected! The real agent would know the password!",
    "🙈 That password is so wrong, even the AI is embarrassed for you!",
    "🔐 Access denied! The password fairy says NO!",
    "🤖 Beep boop! Human authentication failed. Are you a robot?",
    "🕵️ Our spy satellites confirm: you're not authorized!",
    "💀 That password just died of embarrassment!",
    "🎪 Welcome to the circus of wrong passwords!"
];

// Funny facts that rotate
const funnyFacts = [
    "💡 Fun fact: This AI once calculated pi to 1 million digits... just for fun!",
    "🧠 Fun fact: The AI has read more books than a library full of bookworms!",
    "🚀 Fun fact: This AI dreams in binary and speaks in emojis!",
    "🎮 Fun fact: The AI beat every video game... in its imagination!",
    "🍕 Fun fact: If this AI could eat, it would definitely choose pizza!",
    "🌍 Fun fact: This AI knows 47 ways to say 'Hello' in alien languages!",
    "🎸 Fun fact: The AI's favorite band is 'The Debugging Beatles'!",
    "☕ Fun fact: This AI runs on coffee... wait, that's the developer!",
    "🦄 Fun fact: The AI believes in unicorns. Don't tell it they're not real!",
    "🎬 Fun fact: The AI's favorite movie is 'The Matrix'... for obvious reasons!"
];

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('arafatGPT_authenticated') === 'true';
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');

    if (isAuthenticated) {
        loginOverlay.classList.add('hidden');
        appContainer.style.display = 'flex';
        initializeApp();
    } else {
        loginOverlay.classList.remove('hidden');
        appContainer.style.display = 'none';
        rotateFunFact();
    }
}

function attemptLogin(event) {
    event.preventDefault();

    if (isLockedOut) {
        showLoginError("⏰ Whoa there, speed demon! Take a breather and try again soon!");
        return false;
    }

    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');

    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    loginBtn.disabled = true;

    // Simulate verification delay for dramatic effect
    setTimeout(() => {
        if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
            // SUCCESS! 🎉
            loginSuccess();
        } else {
            // FAIL! 😢
            loginFailed();
        }

        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        loginBtn.disabled = false;
    }, 800);

    return false;
}

function loginSuccess() {
    const loginContainer = document.querySelector('.login-container');
    const loginOverlay = document.getElementById('login-overlay');

    // Store authentication
    sessionStorage.setItem('arafatGPT_authenticated', 'true');

    // Play success animation
    loginContainer.classList.add('success');

    // Show success message briefly
    showLoginError("✅ Welcome, Agent! Initiating neural link...", true);

    setTimeout(() => {
        loginOverlay.classList.add('hidden');
        document.getElementById('app-container').style.display = 'flex';
        initializeApp();
        showToast("🎉 Welcome aboard, Agent Arafat! The AI awaits your commands!", 'success');
    }, 800);
}

function loginFailed() {
    loginAttempts++;
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.querySelector('.login-container');

    // Shake animation
    loginBtn.classList.add('shake');
    loginForm.style.animation = 'none';
    setTimeout(() => {
        loginForm.style.animation = '';
        loginBtn.classList.remove('shake');
    }, 500);

    // Show random funny error
    const randomError = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
    showLoginError(randomError);

    // Update attempts counter
    updateAttemptsCounter();

    // Check for lockout
    if (loginAttempts >= AUTH_CONFIG.maxAttempts) {
        inititateLockout();
    }

    // Rotate fun fact
    rotateFunFact();
}

function showLoginError(message, isSuccess = false) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = message;
    errorEl.style.borderColor = isSuccess ? '#22c55e' : '#ef4444';
    errorEl.style.background = isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    errorEl.style.color = isSuccess ? '#22c55e' : '#ef4444';
    errorEl.classList.add('visible');
}

function updateAttemptsCounter() {
    const counter = document.getElementById('attempts-counter');
    const remaining = AUTH_CONFIG.maxAttempts - loginAttempts;

    if (remaining > 0) {
        counter.textContent = `⚠️ ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining before temporary lockout!`;
    } else {
        counter.textContent = "🔒 Too many attempts! Cooling down...";
    }
}

function inititateLockout() {
    isLockedOut = true;
    const counter = document.getElementById('attempts-counter');
    let timeLeft = AUTH_CONFIG.lockoutTime / 1000;

    showLoginError("🔒 Slow down there, cowboy! Too many wrong guesses!");

    const updateTimer = () => {
        counter.textContent = `⏰ Try again in ${timeLeft} seconds... (Grab some coffee ☕)`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(lockoutTimer);
            isLockedOut = false;
            loginAttempts = 0;
            counter.textContent = "🔓 You're unlocked! Give it another shot!";
            document.getElementById('login-error').classList.remove('visible');
        }
    };

    updateTimer();
    lockoutTimer = setInterval(updateTimer, 1000);
}

function rotateFunFact() {
    const factEl = document.getElementById('fun-fact');
    const randomFact = funnyFacts[Math.floor(Math.random() * funnyFacts.length)];
    factEl.textContent = randomFact;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('login-password');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁️';
    }
}

function logout() {
    sessionStorage.removeItem('arafatGPT_authenticated');
    document.getElementById('login-overlay').classList.remove('hidden');
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').classList.remove('visible');
    loginAttempts = 0;
    showToast("👋 See you later, Agent! The AI will miss you!", 'info');
}

// ================================
// Configuration & State
// ================================
const DEFAULT_CONFIG = {
    apiUrl: 'https://chat.arafatops.com',
    defaultModel: 'claude-sonnet-4-5',
    maxTokens: 16384,
    showThinking: true,
    autoScroll: true
};

let config = { ...DEFAULT_CONFIG };
let conversations = {};
let currentConversationId = null;
let isStreaming = false;
let abortController = null;
let pendingImages = [];

// ================================
// Initialization
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    checkAuth();
});

function initializeApp() {
    loadConfig();
    loadConversations();
    renderConversationsList();
    checkConnection();
    initializeMascot();
    initializeImageHandlers();  // Initialize paste and drag-drop for images

    // Load last conversation or show welcome
    const lastConvId = localStorage.getItem('lastConversationId');
    if (lastConvId && conversations[lastConvId]) {
        loadConversation(lastConvId);
    }

    // Setup marked for markdown
    marked.setOptions({
        highlight: function (code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (e) { }
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    // Update character count on input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('input', updateCharCount);
    }
}

function initializeMascot() {
    const sidebar = document.getElementById('right-sidebar');
    const mascot = document.getElementById('robot-mascot');

    if (sidebar && mascot) {
        // Mascot shows when sidebar is OPEN, hides when sidebar is CLOSED
        if (sidebar.classList.contains('closed')) {
            mascot.classList.add('hidden-by-sidebar');
        } else {
            mascot.classList.remove('hidden-by-sidebar');
        }
    }
}

// ================================
// Configuration Management
// ================================
function loadConfig() {
    const saved = localStorage.getItem('arafatChatConfig');
    if (saved) {
        config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }

    // Update UI
    document.getElementById('model-select').value = config.defaultModel;
    updateTheme();
}

function saveConfig() {
    localStorage.setItem('arafatChatConfig', JSON.stringify(config));
}

function openSettings() {
    document.getElementById('settings-api-url').value = config.apiUrl;
    document.getElementById('settings-default-model').value = config.defaultModel;
    document.getElementById('settings-max-tokens').value = config.maxTokens;
    document.getElementById('settings-show-thinking').checked = config.showThinking;
    document.getElementById('settings-auto-scroll').checked = config.autoScroll;
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function saveSettings() {
    config.apiUrl = document.getElementById('settings-api-url').value.trim();
    config.defaultModel = document.getElementById('settings-default-model').value;
    config.maxTokens = parseInt(document.getElementById('settings-max-tokens').value) || 8192;
    config.showThinking = document.getElementById('settings-show-thinking').checked;
    config.autoScroll = document.getElementById('settings-auto-scroll').checked;

    saveConfig();
    document.getElementById('model-select').value = config.defaultModel;
    closeSettings();
    showToast('Settings saved successfully', 'success');
    checkConnection();
}

// ================================
// Theme Management
// ================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateTheme();
}

function updateTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const themeTextEl = document.getElementById('theme-text');
    if (themeTextEl) {
        themeTextEl.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

// ================================
// Conversation Management
// ================================
function loadConversations() {
    const saved = localStorage.getItem('arafatChatConversations');
    if (saved) {
        conversations = JSON.parse(saved);
    }
}

function saveConversations() {
    localStorage.setItem('arafatChatConversations', JSON.stringify(conversations));
}

function generateId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function newChat() {
    const id = generateId();
    conversations[id] = {
        id,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    saveConversations();
    loadConversation(id);
    renderConversationsList();
    closeSidebar();
}

function loadConversation(id) {
    currentConversationId = id;
    localStorage.setItem('lastConversationId', id);

    const conv = conversations[id];
    if (!conv) return;

    // Clear chat container
    const container = document.getElementById('chat-container');
    container.innerHTML = '';

    // Hide welcome screen if there are messages
    if (conv.messages.length === 0) {
        container.innerHTML = getWelcomeScreenHTML();
    } else {
        // Render all messages
        conv.messages.forEach(msg => {
            renderMessage(msg.role, msg.content, msg.images, msg.thinking);
        });
    }

    renderConversationsList();
}

function deleteConversation(id, event) {
    event.stopPropagation();

    if (!confirm('Delete this conversation?')) return;

    delete conversations[id];
    saveConversations();

    if (currentConversationId === id) {
        currentConversationId = null;
        const container = document.getElementById('chat-container');
        container.innerHTML = getWelcomeScreenHTML();
    }

    renderConversationsList();
    showToast('Conversation deleted', 'success');
}

function updateConversationTitle(id, firstMessage) {
    if (!conversations[id]) return;

    // Generate title from first message (first 50 chars)
    let title = firstMessage.substring(0, 50);
    if (firstMessage.length > 50) title += '...';

    conversations[id].title = title;
    conversations[id].updatedAt = Date.now();
    saveConversations();
    renderConversationsList();
}

function renderConversationsList() {
    const list = document.getElementById('conversations-list');
    const sortedConvs = Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt);

    if (sortedConvs.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 14px;">No conversations yet</div>';
        return;
    }

    list.innerHTML = sortedConvs.map(conv => `
        <div class="conversation-item ${conv.id === currentConversationId ? 'active' : ''}"
             onclick="loadConversation('${conv.id}')">
            <span class="conv-icon">💬</span>
            <span class="conv-title">${escapeHtml(conv.title)}</span>
            <button class="conv-delete" onclick="deleteConversation('${conv.id}', event)" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function clearAllData() {
    if (!confirm('This will delete ALL conversations. Are you sure?')) return;

    conversations = {};
    currentConversationId = null;
    localStorage.removeItem('arafatChatConversations');
    localStorage.removeItem('lastConversationId');

    document.getElementById('chat-container').innerHTML = getWelcomeScreenHTML();
    renderConversationsList();
    closeSettings();
    showToast('All data cleared', 'success');
}

// ================================
// Sidebar
// ================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function closeSidebar() {
    const sidebar = document.getElementById('right-sidebar');
    if (sidebar) {
        sidebar.classList.remove('mobile-visible');
    }
}

// ================================
// Image Handling
// ================================
const IMAGE_CONFIG = {
    maxSize: 20 * 1024 * 1024,  // 20MB original limit
    maxCompressedSize: 4 * 1024 * 1024,  // 4MB compressed target
    maxDimension: 2048,  // Max width/height for compression
    compressionQuality: 0.85,  // JPEG quality
    supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

let isProcessingImages = false;

// Compress image using canvas
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            let { width, height } = img;

            // Scale down if larger than max dimension
            if (width > IMAGE_CONFIG.maxDimension || height > IMAGE_CONFIG.maxDimension) {
                const ratio = Math.min(
                    IMAGE_CONFIG.maxDimension / width,
                    IMAGE_CONFIG.maxDimension / height
                );
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG for better compression (except for PNGs with transparency)
            const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const base64 = canvas.toDataURL(outputType, IMAGE_CONFIG.compressionQuality);

            resolve({
                type: 'base64',
                media_type: outputType,
                data: base64.split(',')[1],
                originalName: file.name,
                originalSize: file.size,
                compressedSize: Math.round((base64.length * 3) / 4)  // Approximate base64 decoded size
            });
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Process a single image file
async function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
        throw new Error('Not an image file');
    }

    if (!IMAGE_CONFIG.supportedTypes.includes(file.type)) {
        throw new Error(`Unsupported image type: ${file.type}`);
    }

    if (file.size > IMAGE_CONFIG.maxSize) {
        throw new Error('Image must be less than 20MB');
    }

    // Compress if larger than 1MB, otherwise use as-is
    if (file.size > 1024 * 1024) {
        return await compressImage(file);
    }

    // Small image - just convert to base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            resolve({
                type: 'base64',
                media_type: file.type,
                data: base64.split(',')[1],
                originalName: file.name,
                originalSize: file.size,
                compressedSize: file.size
            });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Process multiple image files
async function processImageFiles(files) {
    if (isProcessingImages) return;

    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    isProcessingImages = true;
    showImageProcessingIndicator(true);

    let successCount = 0;
    let errorCount = 0;

    for (const file of fileArray) {
        try {
            const processedImage = await processImageFile(file);
            pendingImages.push(processedImage);
            successCount++;
            renderImagePreviews();
        } catch (error) {
            errorCount++;
            console.error('Image processing error:', error);
            showToast(`Failed to process ${file.name}: ${error.message}`, 'error');
        }
    }

    isProcessingImages = false;
    showImageProcessingIndicator(false);

    if (successCount > 0) {
        const sizeInfo = pendingImages.length > 0
            ? ` (${pendingImages.length} image${pendingImages.length > 1 ? 's' : ''} ready)`
            : '';
        showToast(`${successCount} image${successCount > 1 ? 's' : ''} added${sizeInfo}`, 'success');
    }
}

function showImageProcessingIndicator(show) {
    let indicator = document.getElementById('image-processing-indicator');

    if (show) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'image-processing-indicator';
            indicator.className = 'image-processing-indicator';
            indicator.innerHTML = `
                <div class="processing-spinner"></div>
                <span>Processing images...</span>
            `;
            const previewContainer = document.getElementById('image-preview-container');
            previewContainer.parentNode.insertBefore(indicator, previewContainer);
        }
        indicator.classList.add('visible');
    } else if (indicator) {
        indicator.classList.remove('visible');
    }
}

// File input handler
function handleImageUpload(event) {
    processImageFiles(event.target.files);
    event.target.value = '';
}

// Clipboard paste handler
function handlePaste(event) {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) imageFiles.push(file);
        }
    }

    if (imageFiles.length > 0) {
        event.preventDefault();
        processImageFiles(imageFiles);
    }
}

// Drag and drop handlers
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const inputArea = document.querySelector('.input-floater');
    if (inputArea) inputArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    const inputArea = document.querySelector('.input-floater');
    if (inputArea) inputArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const inputArea = document.querySelector('.input-floater');
    if (inputArea) inputArea.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        processImageFiles(files);
    }
}

// Initialize image handling event listeners
function initializeImageHandlers() {
    const messageInput = document.getElementById('message-input');
    const inputFloater = document.querySelector('.input-floater');
    const chatContainer = document.getElementById('chat-container');

    // Paste handler on the textarea
    if (messageInput) {
        messageInput.addEventListener('paste', handlePaste);
    }

    // Also listen for paste on the whole document when input is focused
    document.addEventListener('paste', (event) => {
        const activeElement = document.activeElement;
        if (activeElement === messageInput ||
            activeElement?.closest('.input-floater') ||
            activeElement?.closest('.main-stage')) {
            handlePaste(event);
        }
    });

    // Drag and drop on input area
    if (inputFloater) {
        inputFloater.addEventListener('dragover', handleDragOver);
        inputFloater.addEventListener('dragleave', handleDragLeave);
        inputFloater.addEventListener('drop', handleDrop);
    }

    // Also allow drop on the main chat area
    if (chatContainer) {
        chatContainer.addEventListener('dragover', handleDragOver);
        chatContainer.addEventListener('dragleave', handleDragLeave);
        chatContainer.addEventListener('drop', handleDrop);
    }
}

function renderImagePreviews() {
    const container = document.getElementById('image-preview-container');
    if (pendingImages.length === 0) {
        container.innerHTML = '';
        container.classList.remove('has-images');
        return;
    }

    container.classList.add('has-images');
    container.innerHTML = pendingImages.map((img, index) => {
        const sizeKB = Math.round(img.compressedSize / 1024);
        const sizeLabel = sizeKB > 1024
            ? `${(sizeKB / 1024).toFixed(1)}MB`
            : `${sizeKB}KB`;

        return `
            <div class="image-preview" data-index="${index}">
                <img src="data:${img.media_type};base64,${img.data}" alt="Preview ${index + 1}">
                <div class="image-preview-info">
                    <span class="image-size">${sizeLabel}</span>
                </div>
                <button class="remove-image" onclick="removeImage(${index})" title="Remove image">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function removeImage(index) {
    pendingImages.splice(index, 1);
    renderImagePreviews();
    if (pendingImages.length === 0) {
        showToast('All images removed', 'info');
    }
}

function clearAllImages() {
    pendingImages = [];
    renderImagePreviews();
    showToast('All images cleared', 'info');
}

// ================================
// Message Sending
// ================================
async function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();

    if (!content && pendingImages.length === 0) return;
    if (isStreaming) return;

    if (!config.apiUrl) {
        showToast('Please configure API URL in Settings', 'error');
        openSettings();
        return;
    }

    // Create conversation if needed
    if (!currentConversationId) {
        newChat();
    }

    const conv = conversations[currentConversationId];

    // Clear welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }

    // Build user message content
    let userContent = [];

    // Add images first
    if (pendingImages.length > 0) {
        pendingImages.forEach(img => {
            userContent.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: img.media_type,
                    data: img.data
                }
            });
        });
    }

    // Add text
    if (content) {
        userContent.push({ type: 'text', text: content });
    }

    // Store message
    const userMessage = {
        role: 'user',
        content: userContent.length === 1 && userContent[0].type === 'text' ? content : userContent,
        images: pendingImages.length > 0 ? [...pendingImages] : undefined
    };
    conv.messages.push(userMessage);

    // Update title if first message
    if (conv.messages.length === 1) {
        updateConversationTitle(currentConversationId, content || 'Image message');
    }

    // Render user message
    renderMessage('user', content, pendingImages);

    // Clear input
    input.value = '';
    input.style.height = 'auto';
    pendingImages = [];
    renderImagePreviews();
    updateCharCount();

    // Prepare API messages
    const apiMessages = conv.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // Start streaming
    isStreaming = true;
    updateUIForStreaming(true);

    const model = document.getElementById('model-select').value;

    try {
        abortController = new AbortController();

        const response = await fetch(`${config.apiUrl}/v1/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                model,
                max_tokens: config.maxTokens,
                stream: true,
                messages: apiMessages
            }),
            signal: abortController.signal
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        // Process stream
        await processStream(response, conv);

    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Generation stopped', 'warning');
        } else {
            console.error('Error:', error);
            showToast(error.message, 'error');
            renderErrorMessage(error.message);
        }
    } finally {
        isStreaming = false;
        abortController = null;
        updateUIForStreaming(false);
        saveConversations();
    }
}

async function processStream(response, conv) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    let assistantMessageEl = null;
    let thinkingBlockEl = null;
    let textBlockEl = null;

    let fullThinking = '';
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
                const event = JSON.parse(data);

                switch (event.type) {
                    case 'message_start':
                        // Create assistant message container
                        assistantMessageEl = createMessageElement('assistant');
                        document.getElementById('chat-container').appendChild(assistantMessageEl);
                        break;

                    case 'content_block_start':
                        const block = event.content_block;
                        if (block.type === 'thinking') {
                            if (config.showThinking) {
                                thinkingBlockEl = createThinkingBlock();
                                assistantMessageEl.querySelector('.message-content').appendChild(thinkingBlockEl);
                            }
                            fullThinking = block.thinking || '';
                        } else if (block.type === 'text') {
                            textBlockEl = document.createElement('div');
                            textBlockEl.className = 'text-content';
                            assistantMessageEl.querySelector('.message-content').appendChild(textBlockEl);
                            fullText = block.text || '';
                        }
                        break;

                    case 'content_block_delta':
                        const delta = event.delta;
                        if (delta.type === 'thinking_delta' && thinkingBlockEl) {
                            fullThinking += delta.thinking || '';
                            thinkingBlockEl.querySelector('.thinking-content').textContent = fullThinking;
                        } else if (delta.type === 'text_delta' && textBlockEl) {
                            fullText += delta.text || '';
                            textBlockEl.innerHTML = renderMarkdown(fullText);
                            addCopyButtons(textBlockEl);
                        }

                        if (config.autoScroll) {
                            scrollToBottom();
                        }
                        break;

                    case 'content_block_stop':
                        // Block completed
                        break;

                    case 'message_stop':
                        // Store assistant message
                        conv.messages.push({
                            role: 'assistant',
                            content: fullText,
                            thinking: fullThinking || undefined
                        });
                        conv.updatedAt = Date.now();
                        break;

                    case 'error':
                        throw new Error(event.error?.message || 'Stream error');
                }
            } catch (e) {
                if (e.message !== 'Stream error') {
                    console.warn('Parse error:', e);
                } else {
                    throw e;
                }
            }
        }
    }
}

function stopGeneration() {
    if (abortController) {
        abortController.abort();
    }
}

// ================================
// Message Rendering Functions Helper
// ================================
function createThinkingBlock() {
    const div = document.createElement('div');
    div.className = 'thinking-block';
    div.innerHTML = `
        <div class="thinking-header" onclick="toggleThinking(this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span class="thinking-label">🧠 Thinking...</span>
        </div>
        <div class="thinking-content"></div>
    `;
    return div;
}

function toggleThinking(header) {
    header.classList.toggle('collapsed');
    header.nextElementSibling.classList.toggle('collapsed');
}

function renderMessage(role, content, images, thinking) {
    const container = document.getElementById('chat-container');
    const messageEl = createMessageElement(role);
    const contentEl = messageEl.querySelector('.message-content');

    // Render thinking block if present
    if (role === 'assistant' && thinking && config.showThinking) {
        const thinkingEl = createThinkingBlock();
        thinkingEl.querySelector('.thinking-content').textContent = thinking;
        thinkingEl.querySelector('.thinking-label').textContent = '🧠 Thinking process';
        contentEl.appendChild(thinkingEl);
    }

    // Render images
    if (images && images.length > 0) {
        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'message-images';
        images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.className = 'message-image';
            imgEl.src = `data:${img.media_type};base64,${img.data}`;
            imgEl.onclick = () => window.open(imgEl.src, '_blank');
            imagesDiv.appendChild(imgEl);
        });
        contentEl.appendChild(imagesDiv);
    }

    // Render text content
    if (content) {
        const textContent = typeof content === 'string' ? content :
            (Array.isArray(content) ? content.filter(c => c.type === 'text').map(c => c.text).join('') : '');

        if (textContent) {
            const textDiv = document.createElement('div');
            textDiv.className = 'text-content';
            textDiv.innerHTML = renderMarkdown(textContent);
            addCopyButtons(textDiv);
            contentEl.appendChild(textDiv);
        }
    }

    container.appendChild(messageEl);
    scrollToBottom();
}

function renderErrorMessage(error) {
    const container = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-header">
            <div class="message-avatar" style="background: var(--error);">⚠️</div>
            <span class="message-role">Error</span>
        </div>
        <div class="message-content" style="color: var(--error);">
            ${escapeHtml(error)}
        </div>
    `;
    container.appendChild(div);
    scrollToBottom();
}

function renderMarkdown(text) {
    // Process with marked
    let html = marked.parse(text);

    // Add code headers with copy buttons
    html = html.replace(/<pre><code class="language-(\w+)">/g,
        '<pre><div class="code-header"><span class="code-lang">$1</span><button class="copy-btn" onclick="copyCode(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy</button></div><code class="language-$1">');

    html = html.replace(/<pre><code>/g,
        '<pre><div class="code-header"><span class="code-lang">code</span><button class="copy-btn" onclick="copyCode(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy</button></div><code>');

    return html;
}

function addCopyButtons(element) {
    // Already added via renderMarkdown
}

async function copyCode(button) {
    const pre = button.closest('pre');
    const code = pre.querySelector('code').textContent;

    try {
        await navigator.clipboard.writeText(code);
        button.classList.add('copied');
        button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';

        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
        }, 2000);
    } catch (e) {
        showToast('Failed to copy', 'error');
    }
}

// ================================
// UI Helpers
// ================================
function updateUIForStreaming(streaming) {
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');
    const input = document.getElementById('message-input');

    if (streaming) {
        sendBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        input.disabled = true;
    } else {
        sendBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        input.disabled = false;
        input.focus();
    }
}

function scrollToBottom() {
    const container = document.getElementById('chat-container');
    container.scrollTop = container.scrollHeight;
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function updateCharCount() {
    const input = document.getElementById('message-input');
    const count = document.getElementById('char-count');
    if (count && input) {
        count.textContent = `${input.value.length} characters`;
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function setPrompt(text) {
    const input = document.getElementById('message-input');
    input.value = text;
    input.focus();
    autoResize(input);
    updateCharCount();
}

function focusChatInput() {
    const input = document.getElementById('message-input');
    if (input) {
        input.focus();
        // Add a little visual feedback
        input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
        setTimeout(() => {
            input.style.boxShadow = '';
        }, 500);
    }
}

function getWelcomeScreenHTML() {
    return `
        <div class="welcome-screen" id="welcome-screen">
            <div class="welcome-logo">🚀</div>
            <h1>Welcome to Arafat Chat</h1>
            <p>Powered by Claude & Gemini AI models through Antigravity Proxy</p>
            <div class="quick-actions">
                <button class="quick-action" onclick="setPrompt('Explain quantum computing in simple terms')">
                    <span class="quick-icon">💡</span>
                    <span>Explain quantum computing</span>
                </button>
                <button class="quick-action" onclick="setPrompt('Write a Python function to sort a list')">
                    <span class="quick-icon">💻</span>
                    <span>Write Python code</span>
                </button>
                <button class="quick-action" onclick="setPrompt('What are the latest trends in AI?')">
                    <span class="quick-icon">🤖</span>
                    <span>AI trends</span>
                </button>
                <button class="quick-action" onclick="setPrompt('Help me write a professional email')">
                    <span class="quick-icon">✉️</span>
                    <span>Write an email</span>
                </button>
            </div>
        </div>
    `;
}

// ================================
// Connection Check
// ================================
async function checkConnection() {
    const statusEl = document.getElementById('connection-status');
    if (!statusEl) return;

    const statusText = statusEl.querySelector('.status-text');
    if (!statusText) return;

    if (!config.apiUrl) {
        statusEl.className = 'connection-pill';
        statusEl.classList.remove('hidden');
        statusText.textContent = 'API URL not configured';
        return;
    }

    statusEl.className = 'connection-pill connecting';
    statusEl.classList.remove('hidden');
    statusText.textContent = 'Connecting...';

    try {
        const response = await fetch(`${config.apiUrl}/health`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (response.ok) {
            const data = await response.json();
            statusEl.className = 'connection-pill connected';
            statusText.textContent = `Connected • ${data.accounts || 'Proxy ready'}`;
        } else {
            throw new Error('Bad response');
        }
    } catch (e) {
        statusEl.className = 'connection-pill error';
        statusText.textContent = 'Connection failed - check Settings';
    }
}

// ================================
// Toast Notifications
// ================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ================================
// Utilities
// ================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "arafat_gpt_history_" + new Date().toISOString() + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('Chat history exported successfully', 'success');
}

// Expose functions to global scope for onclick handlers
// ================================
// Sidebar & UI Logic
// ================================
function toggleRightSidebar() {
    const sidebar = document.getElementById('right-sidebar');
    const mascot = document.getElementById('robot-mascot');

    if (sidebar) {
        sidebar.classList.toggle('closed');
        sidebar.classList.toggle('mobile-visible');

        // Toggle mascot visibility based on sidebar state
        // Mascot shows when sidebar is OPEN, hides when sidebar is CLOSED
        if (mascot) {
            if (sidebar.classList.contains('closed')) {
                mascot.classList.add('hidden-by-sidebar');
            } else {
                mascot.classList.remove('hidden-by-sidebar');
            }
        }
    }
}

// ================================
// Message Rendering (Updated for new DOM)
// ================================
function createMessageElement(role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatarIcon = role === 'user' ? '👤' : '✨';
    div.innerHTML = `
        <div class="message-avatar">${avatarIcon}</div>
        <div class="message-content"></div>
    `;
    return div;
}

// Expose functions to global scope for onclick handlers
window.toggleRightSidebar = toggleRightSidebar;
window.exportData = exportData;
window.newChat = newChat;
window.loadConversation = loadConversation;
window.deleteConversation = deleteConversation;
window.toggleTheme = toggleTheme;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.clearAllData = clearAllData;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.clearAllImages = clearAllImages;
window.sendMessage = sendMessage;
window.stopGeneration = stopGeneration;
window.setPrompt = setPrompt;
window.focusChatInput = focusChatInput;
window.handleKeyDown = handleKeyDown;
window.autoResize = autoResize;
window.copyCode = copyCode;
window.toggleThinking = toggleThinking;

// Authentication functions
window.attemptLogin = attemptLogin;
window.togglePasswordVisibility = togglePasswordVisibility;
window.logout = logout;
window.checkAuth = checkAuth;
