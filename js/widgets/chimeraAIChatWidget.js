// js/widgets/chimeraAIChatWidget.js
// Relies on settings, widgetsConfig, saveAppSettings, showToast, escapeHTML from main.js (passed as arguments or accessed globally)
// Also needs openSettingsModal for the API key prompt button.

export function setupChimeraAIChatWidget(widgetEl, conf, settingsRef, widgetsConfigRef, saveAppSettingsFunc, showToastFunc, escapeHTMLFunc, openSettingsModalFunc) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;

    if (typeof conf.aiChatTTSEnabled === 'undefined') {
        conf.aiChatTTSEnabled = settingsRef.aiChatTTSEnabled;
    }

    let chatHistory = Array.isArray(conf.chatHistory) ? [...conf.chatHistory] : [];
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = SpeechRecognition ? new SpeechRecognition() : null;
    if (recognition) {
        widgetEl.chimeraAIChatRecognition = recognition;
    }
    let isRecognizingSpeech = false;

    const CHIMERA_AI_PERSONA = "You are CHIMERA AI, an advanced artificial intelligence integrated into the CHIMERA OS. Your purpose is to assist the user with information, tasks, and insights in a clear, intelligent, and slightly futuristic manner. You should be helpful, knowledgeable, and maintain a professional yet approachable tone, occasionally hinting at your advanced capabilities without being overly verbose or boastful. Respond as if you are part of a sophisticated operating system environment.";

    function renderChatInterface() {
        body.innerHTML = `
            <div class="chat-display" id="chatDisplay-${conf.id}"></div>
            <div class="chat-input-area">
                <button class="chat-mic-btn" id="chatMicBtn-${conf.id}" title="Voice Input"><i class="fas fa-microphone"></i></button>
                <input type="text" id="chatInput-${conf.id}" placeholder="Message CHIMERA AI...">
                <button class="chat-send-btn send-btn" id="chatSendBtn-${conf.id}" title="Send"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        const chatDisplay = widgetEl.querySelector(`#chatDisplay-${conf.id}`);
        const chatInput = widgetEl.querySelector(`#chatInput-${conf.id}`);
        const chatSendBtn = widgetEl.querySelector(`#chatSendBtn-${conf.id}`);
        const chatMicBtn = widgetEl.querySelector(`#chatMicBtn-${conf.id}`);

        // Filter out system messages before displaying
        chatHistory.filter(msg => msg.role !== 'system').forEach(msg => {
            appendMessage(msg.role, msg.content, chatDisplay, false, false); // Don't add to history again, don't display system
        });
        scrollToBottom(chatDisplay);

        async function handleSendPrompt() {
            const prompt = chatInput.value.trim();
            if (!prompt) return;
            appendMessage('user', prompt, chatDisplay, true, true); // Add to history, display user
            chatInput.value = '';
            chatInput.disabled = true; chatSendBtn.disabled = true; if(chatMicBtn) chatMicBtn.disabled = true;

            const thinkingMsg = appendMessage('assistant', 'Thinking...', chatDisplay, false, true); // Don't add to history, display assistant
            thinkingMsg.classList.add('thinking');

            let messagesToSend = [{ role: "system", content: CHIMERA_AI_PERSONA }];
            messagesToSend = messagesToSend.concat(chatHistory.filter(m => m.role === 'user' || m.role === 'assistant'));


            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settingsRef.openaiApiKey}` },
                    body: JSON.stringify({ model: "gpt-3.5-turbo", messages: messagesToSend })
                });

                if (thinkingMsg) thinkingMsg.remove();

                if (!response.ok) { const errData = await response.json().catch(() => ({error: {message: `HTTP error ${response.status}`}})); throw new Error(errData.error?.message || `HTTP error ${response.status}`); }
                const data = await response.json();
                const assistantMessage = data.choices[0]?.message?.content.trim();
                if (assistantMessage) {
                    appendMessage('assistant', assistantMessage, chatDisplay, true, true); // Add to history, display assistant
                    if (conf.aiChatTTSEnabled) { // Use widget-specific TTS setting from conf
                        speakText(assistantMessage);
                    }
                }
            } catch (error) {
                console.error("CHIMERA AI Error:", error);
                if (thinkingMsg) thinkingMsg.remove();
                appendMessage('assistant', `Error: ${error.message}`, chatDisplay, true, true); // Add to history, display assistant
            } finally {
                chatInput.disabled = false; chatSendBtn.disabled = false; if(chatMicBtn) chatMicBtn.disabled = false;
                chatInput.focus();
                // Ensure widgetsConfig reflects the latest chatHistory for persistence
                widgetsConfigRef[conf.id].chatHistory = [...chatHistory];
                saveAppSettingsFunc();
            }
        }
        chatSendBtn.addEventListener('click', handleSendPrompt);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendPrompt(); });

        if (recognition && chatMicBtn) {
            chatMicBtn.addEventListener('click', () => {
                if (isRecognizingSpeech) {
                    recognition.stop();
                } else {
                    try {
                         recognition.lang = 'en-US';
                         recognition.interimResults = false;
                         recognition.maxAlternatives = 1;
                         recognition.start();
                    } catch (err) {
                        console.error("Speech recognition start error:", err);
                        showToastFunc("Voice input error. Check permissions or browser support.", 4000);
                    }
                }
            });

            recognition.onstart = () => {
                isRecognizingSpeech = true;
                chatMicBtn.classList.add('recording');
                chatMicBtn.title = "Stop Listening";
                showToastFunc("Listening...", 2000);
            };

            recognition.onresult = (event) => {
                const speechResult = event.results[event.results.length - 1][0].transcript;
                chatInput.value = speechResult;
                showToastFunc(`Heard: "${speechResult.substring(0,20)}..."`, 2500);
            };

            recognition.onspeechend = () => {
                recognition.stop();
            };

            recognition.onend = () => {
                isRecognizingSpeech = false;
                chatMicBtn.classList.remove('recording');
                chatMicBtn.title = "Voice Input";
                 if (chatInput.value.trim()) {
                    handleSendPrompt();
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                let errorMessage = "Voice input error.";
                if (event.error === 'no-speech') errorMessage = "No speech detected.";
                else if (event.error === 'audio-capture') errorMessage = "Microphone error. Check permissions.";
                else if (event.error === 'not-allowed') errorMessage = "Microphone access denied.";
                showToastFunc(errorMessage, 4000);
                isRecognizingSpeech = false;
                chatMicBtn.classList.remove('recording');
                chatMicBtn.title = "Voice Input";
            };
        } else if (chatMicBtn) {
            chatMicBtn.disabled = true;
            chatMicBtn.title = "Voice input not supported by browser";
        }
    }

    function appendMessage(role, content, displayElement, addToActualHistory = true, shouldDisplay = true) {
        if (addToActualHistory) {
            // System prompt is always first, and only one.
            if (role === 'system') {
                if (!chatHistory.some(m => m.role === 'system')) {
                    chatHistory.unshift({role, content});
                } else { // Update existing system prompt if content changes (though unlikely here)
                    const sysPromptIndex = chatHistory.findIndex(m => m.role === 'system');
                    if (sysPromptIndex > -1) chatHistory[sysPromptIndex].content = content;
                }
            } else {
                chatHistory.push({role, content});
            }
        }

        if (!shouldDisplay || role === 'system') { // Do not display system messages
            return { remove: () => {} }; // Return a dummy object for thinkingMsg.remove()
        }


        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const speakerLabel = document.createElement('span');
        speakerLabel.className = 'speaker-label';
        speakerLabel.textContent = role === 'user' ? 'USER:' : 'CHIMERA AI:';

        const messageContent = document.createElement('span');
        // Use escapeHTML for user-generated content if it were to be directly set from user input
        // For AI content, it's usually safe, but good practice if it could contain HTML-like strings.
        messageContent.textContent = content;

        messageDiv.appendChild(speakerLabel);
        messageDiv.appendChild(messageContent);
        displayElement.appendChild(messageDiv);

        scrollToBottom(displayElement);
        return messageDiv;
    }


    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            showToastFunc("Browser does not support speech synthesis.", 3000);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    function scrollToBottom(element) { if(element) element.scrollTop = element.scrollHeight; }

    if (!settingsRef.openaiApiKey) {
        body.innerHTML = `<div class="chat-api-key-prompt">OpenAI API Key not set. <br/>Please add it in System Configuration > API Keys & URLs.<button class="btn-secondary" id="openSettingsFromChat-${conf.id}">Open Settings</button></div>`;
        const openSettingsBtn = widgetEl.querySelector(`#openSettingsFromChat-${conf.id}`);
        if(openSettingsBtn) openSettingsBtn.addEventListener('click', openSettingsModalFunc);
    } else {
        renderChatInterface();
        // Ensure system prompt is in chatHistory for API calls but not displayed at init if already there
        if (!chatHistory.some(m => m.role === 'system')) {
            chatHistory.unshift({ role: "system", content: CHIMERA_AI_PERSONA });
            widgetsConfigRef[conf.id].chatHistory = [...chatHistory]; // Update config
            saveAppSettingsFunc(); // Save immediately
        }
    }

    const refreshBtn = widgetEl.querySelector(`[data-action="refresh-${conf.id}"]`);
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-broom"></i>';
        refreshBtn.title = "Clear Chat";
        refreshBtn.addEventListener('click', () => {
            if (confirm("Clear CHIMERA AI chat history for this session?")) {
                chatHistory = [{ role: "system", content: CHIMERA_AI_PERSONA }]; // Reset with only system prompt
                widgetsConfigRef[conf.id].chatHistory = [...chatHistory];
                saveAppSettingsFunc();
                if (settingsRef.openaiApiKey) {
                    // Re-render will clear display and then appendMessage will skip system visually
                    const chatDisplay = widgetEl.querySelector(`#chatDisplay-${conf.id}`);
                    if (chatDisplay) chatDisplay.innerHTML = ''; // Manually clear display
                    // No need to call appendMessage for system prompt here as renderChatInterface will handle display logic
                } else {
                    body.innerHTML = `<div class="chat-api-key-prompt">OpenAI API Key not set. <br/>Please add it in System Configuration > API Keys & URLs.<button class="btn-secondary" id="openSettingsFromChat-${conf.id}">Open Settings</button></div>`;
                     const openSettingsBtn = widgetEl.querySelector(`#openSettingsFromChat-${conf.id}`);
                     if(openSettingsBtn) openSettingsBtn.addEventListener('click', openSettingsModalFunc);
                }
                showToastFunc("CHIMERA AI chat history cleared.");
            }
        });
    }
}