/**
 * AssistantCore.js - The "Spirit" of EduFlow Assistant
 * Handles: Speech Recognition (Virtual Ears), Text-to-Speech (Voice), and Visual Life (Animations)
 */

class AssistantCore {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.brain = null;

        // Target avatar elements
        this.assistantEl = document.querySelector('img[alt*="Asistente"], img[data-alt*="Asistente"], div[data-alt*="Asistente"], div[style*="background-image"]');

        this.initSpeechRecognition();
        this.setupVisualLife();

        // Initialize Intelligence if loaded
        if (typeof AssistantBrain !== 'undefined') {
            this.brain = new AssistantBrain(this);
            console.log('AssistantCore: Brain connected.');
        } else {
            console.error('AssistantCore: AssistantBrain class not found. Check script order.');
        }

        this.bindEvents();
        console.log('AssistantCore: Spirit initialized.');
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'es-ES';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                console.log('Recognition: Listening...');
                this.isListening = true;
                this.updateMicUI();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Recognition Heard:', transcript);
                this.onHeard(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Recognition Error:', event.error);
                this.isListening = false;
                this.updateMicUI();
            };

            this.recognition.onend = () => {
                console.log('Recognition: Stopped.');
                this.isListening = false;
                this.updateMicUI();
            };
        }
    }

    setupVisualLife() {
        if (!this.assistantEl) return;

        this.assistantEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease';
        this.assistantEl.classList.add('assistant-living');

        // Create Sound Waves Indicator if not exists
        if (!document.querySelector('.assistant-waves')) {
            this.waves = document.createElement('div');
            this.waves.className = 'assistant-waves';
            this.waves.innerHTML = '<span></span><span></span><span></span><span></span>';
            this.assistantEl.parentElement.appendChild(this.waves);
        } else {
            this.waves = document.querySelector('.assistant-waves');
        }

        const styleId = 'assistant-life-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes breathe {
                    0%, 100% { transform: scale(1.0); }
                    50% { transform: scale(1.015); }
                }
                @keyframes talking-vidnoz {
                    0%, 100% { transform: scale(1.02) translateY(-2px); filter: brightness(1.05) contrast(1.1); }
                    25% { transform: scale(1.03) translateX(1px); }
                    50% { transform: scale(1.04) translateY(-1px); filter: brightness(1.1) contrast(1.15); }
                    75% { transform: scale(1.03) translateX(-1px); }
                }
                .assistant-living {
                    animation: breathe 5s infinite ease-in-out;
                }
                .assistant-talking {
                    animation: talking-vidnoz 0.2s infinite ease-in-out !important;
                    box-shadow: 0 0 30px rgba(32, 111, 238, 0.3);
                }
                .assistant-waves {
                    position: absolute; bottom: 20px; right: 20px; display: none; align-items: flex-end; gap: 3px; height: 30px; z-index: 100;
                }
                .assistant-waves span {
                    width: 4px; background: #206fee; border-radius: 2px; animation: wave 1s infinite ease-in-out;
                }
                .assistant-waves span:nth-child(1) { height: 10px; animation-delay: 0.1s; }
                .assistant-waves span:nth-child(2) { height: 20px; animation-delay: 0.2s; }
                .assistant-waves span:nth-child(3) { height: 15px; animation-delay: 0.3s; }
                .assistant-waves span:nth-child(4) { height: 25px; animation-delay: 0.4s; }
                @keyframes wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.5); }
                }
                .mic-active {
                    color: #ef4444 !important;
                    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)) !important;
                    animation: mic-pulse 1s infinite alternate;
                }
                @keyframes mic-pulse {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0.6; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    bindEvents() {
        console.log('Core: Binding events...');

        // Comprehensive Mic Search
        const findAndBindMic = () => {
            const micElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const text = el.innerText?.toLowerCase() || '';
                const title = el.getAttribute('aria-label')?.toLowerCase() || '';
                return text === 'mic' || text.includes('hablar') || title.includes('hablar') || title === 'mic';
            });

            micElements.forEach(el => {
                const btn = el.closest('button') || el;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Mic clicked');
                    this.toggleListening();
                };
            });
        };

        // Comprehensive Input/Send Search
        const findAndBindInput = () => {
            const inputs = document.querySelectorAll('input[type="text"], input[placeholder*="mensaje"]');
            const sendBtns = Array.from(document.querySelectorAll('*')).filter(el => {
                const label = el.getAttribute('aria-label')?.toLowerCase() || '';
                return label.includes('enviar') || el.innerHTML.includes('rotate-90');
            });

            const process = (inp) => {
                const val = inp.value.trim();
                if (val && this.brain) {
                    this.brain.think(val);
                    inp.value = '';
                }
            };

            inputs.forEach(inp => {
                inp.onkeypress = (e) => {
                    if (e.key === 'Enter') process(inp);
                };
            });

            sendBtns.forEach(btn => {
                const actualBtn = btn.closest('button') || btn;
                actualBtn.onclick = (e) => {
                    e.preventDefault();
                    const relatedInput = document.querySelector('input[type="text"]') || btn.closest('div, section')?.querySelector('input');
                    if (relatedInput) process(relatedInput);
                };
            });
        };

        findAndBindMic();
        findAndBindInput();

        // Auto-speak current page context
        const speechBubble = document.querySelector('p, .speech-bubble p, .glass-card p');
        if (speechBubble) {
            setTimeout(() => this.speak(speechBubble.innerText), 1500);
        }
    }

    toggleListening() {
        if (!this.recognition) {
            alert('Tu navegador no soporta reconocimiento de voz.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (e) {
                console.warn('Recognition already started');
            }
        }
    }

    updateMicUI() {
        const icons = Array.from(document.querySelectorAll('*')).filter(el => el.innerText?.toLowerCase() === 'mic');
        icons.forEach(icon => {
            if (this.isListening) icon.classList.add('mic-active');
            else icon.classList.remove('mic-active');
        });
    }

    speak(text) {
        if (!this.synth) return;
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.pitch = 1.05;
        utterance.rate = 1.0;

        utterance.onstart = () => {
            this.isSpeaking = true;
            if (this.assistantEl) {
                this.assistantEl.classList.add('assistant-talking');
                if (this.waves) this.waves.style.display = 'flex';
            }
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (this.assistantEl) {
                this.assistantEl.classList.remove('assistant-talking');
                if (this.waves) this.waves.style.display = 'none';
            }
        };

        this.synth.speak(utterance);
    }

    onHeard(transcript) {
        if (this.brain) {
            this.brain.think(transcript);
        } else {
            console.warn('Brain not ready for transcript:', transcript);
        }
    }
}

// Global initialization
window.addEventListener('load', () => {
    window.assistant = new AssistantCore();
});
