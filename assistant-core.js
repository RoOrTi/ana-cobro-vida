/**
 * AssistantCore.js - The "Spirit" of Avatar Assistant
 * Handles: Speech Recognition (Virtual Ears), Text-to-Speech (Voice), and Visual Life (Animations)
 */

class AssistantCore {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.brain = null;
        this.anaCharacter = null;
        this.agenda = JSON.parse(localStorage.getItem('ana-agenda') || '[]');

        this.initAnaCharacter();
        this.initSpeechRecognition();
        this.setupVisualLife();
        this.initDate();
        this.updateAgendaUI();

        if (typeof AssistantBrain !== 'undefined') {
            this.brain = new AssistantBrain(this);
            console.log('AssistantCore: Brain connected.');
        }

        this.checkPendingAlarms();
        this.bindEvents();
        this.setupFluidCommunication();
        console.log('AssistantCore: Ready for Ana Premium.');
    }

    setupFluidCommunication() {
        this.fluidCommunication = true; // Enabled by default as requested
        document.addEventListener('anaFinishedSpeaking', () => {
            if (this.fluidCommunication && !this.isListening) {
                console.log('AssistantCore: Fluid comm auto-starting mic...');
                setTimeout(() => this.toggleListening(), 500);
            }
        });
    }

    initDate() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const now = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            dateEl.innerText = now.toLocaleDateString('es-ES', options).toUpperCase();
        }
    }

    addTask(text) {
        if (!text) return;
        this.agenda.push({ id: Date.now(), text: text, completed: false });
        localStorage.setItem('ana-agenda', JSON.stringify(this.agenda));
        this.updateAgendaUI();

        // Small animation hint
        const sidebar = document.querySelector('.sidebar-agenda');
        if (sidebar) {
            sidebar.style.transition = 'all 0.5s';
            sidebar.style.transform = 'scale(1.2)';
            setTimeout(() => sidebar.style.transform = 'scale(1)', 500);
        }
    }

    removeTask(id) {
        this.agenda = this.agenda.filter(t => t.id !== id);
        localStorage.setItem('ana-agenda', JSON.stringify(this.agenda));
        this.updateAgendaUI();
    }

    updateAgendaUI() {
        const list = document.getElementById('agendaList');
        if (!list) return;

        list.innerHTML = '';
        this.agenda.forEach((task, index) => {
            const item = document.createElement('div');
            item.className = 'agenda-item';
            item.innerText = index + 1;
            item.title = task.text;
            item.onclick = () => {
                this.speak(`Tarea número ${index + 1}: ${task.text}`);
                if (confirm(`¿Eliminar tarea: "${task.text}"?`)) {
                    this.removeTask(task.id);
                }
            };
            list.appendChild(item);
        });
    }

    initAnaCharacter() {
        const anaContainer = document.querySelector('.ana-avatar-container, #avatarWrap');
        if (anaContainer && typeof AnaCharacter !== 'undefined') {
            this.anaCharacter = new AnaCharacter(anaContainer);
        }
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'es-ES';
            this.recognition.onstart = () => { this.isListening = true; this.updateMicUI(); };
            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                const input = document.getElementById('chat-input');
                if (input) input.value = transcript;
                this.onHeard(transcript);
            };
            this.recognition.onend = () => { this.isListening = false; this.updateMicUI(); };
        }
    }

    setupVisualLife() {
        if (!document.querySelector('link[href$="ana-theme.css"]')) {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = './ana-theme.css';
            document.head.appendChild(style);
        }
    }

    bindEvents() {
        const sendBtn = document.querySelector('.btn-send');
        const input = document.getElementById('chat-input');
        const micBtn = document.getElementById('micBtn');

        if (sendBtn) sendBtn.onclick = () => this.sendMessage();
        if (input) {
            input.onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            };
        }
        if (micBtn) micBtn.onclick = () => this.toggleListening();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (text) {
            this.addMessage(text, 'user');
            if (this.brain) this.brain.think(text);
            input.value = '';
        }
    }

    getSuggestionsFor(input, response) {
        if (input.match(/finanzas|dólar|merval/)) {
            return ["¿Cómo impacta el MEP?", "¿Sugerencias para Cedears?", "Analiza el riesgo país"];
        } else if (input.match(/geopolit|decisión/)) {
            return ["Impacto del crudo", "¿Cómo influye el VIX?", "¿Estrategia defensiva?"];
        } else if (input.match(/clima|rosario/)) {
            return ["¿Clima el fin de semana?", "¿Va a llover pronto?", "Mejor hora para salir"];
        } else if (input.match(/hola|buenos/)) {
            return ["Dame un resumen financiero", "¿Qué sabes de Rosario?", "Anota mis tareas"];
        }
        return ["Dime un chiste", "¿Qué puedes hacer?", "Actualidad del mercado"];
    }

    addMessage(text, sender, chartData = null) {
        const wrap = document.getElementById('messagesWrap');
        if (!wrap) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;

        const bubbleClass = sender === 'ana' ? 'ana-msg-bubble' : 'user-msg-bubble';

        msgDiv.innerHTML = `<div class="${bubbleClass}">${text}</div>`;

        if (chartData && typeof FinancialCharts !== 'undefined') {
            const chartId = `chart-${Date.now()}`;
            const chartCont = FinancialCharts.createChartContainer(chartId);
            msgDiv.appendChild(chartCont);

            // Render chart after a small delay to ensure DOM is ready
            setTimeout(() => {
                if (chartData.type === 'variation') {
                    FinancialCharts.renderVariationChart(chartId, chartData.labels, chartData.data);
                } else {
                    FinancialCharts.renderPriceChart(chartId, chartData.label, chartData.points, chartData.color);
                }
            }, 100);
        }

        wrap.appendChild(msgDiv);

        // Target the scrollable container
        const container = document.querySelector('.messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;

            // Re-scroll after chart rendering completes
            if (chartData) {
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight;
                }, 150);
            }
        }
    }

    showTypingIndicator() {
        const ti = document.getElementById('typingIndicator');
        if (ti) ti.classList.add('visible');
    }

    hideTypingIndicator() {
        const ti = document.getElementById('typingIndicator');
        if (ti) ti.classList.remove('visible');
    }

    toggleListening() {
        if (!this.recognition) return;
        this.isListening ? this.recognition.stop() : this.recognition.start();
    }

    updateMicUI() {
        const micBtn = document.getElementById('micBtn');
        if (micBtn) micBtn.classList.toggle('recording', this.isListening);
    }

    showSuggestions(list) {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;

        container.innerHTML = '';
        list.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.innerText = text;
            chip.onclick = () => {
                const input = document.getElementById('chat-input');
                if (input) input.value = text;
                this.sendMessage();
                container.innerHTML = '';
            };
            container.appendChild(chip);
        });
    }

    speak(text) {
        if (!this.synth) return;
        this.synth.cancel();

        // Clean text for speech: remove markdown symbols like *, #, _ and excessive breaks
        const cleanText = text
            .replace(/\$/g, ' dolar ') // Asegurar que diga dolar
            .replace(/[*#_~]/g, '')    // Remove markdown symbols
            .replace(/\n-/g, ', ')      // Convert list dashes to commas for natural flow
            .replace(/\n+/g, ' ')       // Remove line breaks
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 1;
        utterance.pitch = 1.05;

        utterance.onstart = () => {
            if (this.anaCharacter) this.anaCharacter.startSpeaking();
        };

        utterance.onend = () => {
            if (this.anaCharacter) this.anaCharacter.stopSpeaking();
        };

        this.synth.speak(utterance);
    }

    onHeard(transcript) {
        if (this.brain) this.brain.think(transcript);
    }

    startTimer(minutes) {
        if (!minutes || minutes <= 0) return;
        const endTime = Date.now() + (minutes * 60 * 1000);
        localStorage.setItem('ana-alarm', JSON.stringify({ endTime, minutes }));

        console.log(`[AssistantCore] Alarma programada: ${minutes} minutos. Finaliza en: ${new Date(endTime).toLocaleTimeString()}`);

        this.setupAlarmCheck(minutes * 60 * 1000);
    }

    setupAlarmCheck(delay) {
        if (this.currentTimer) clearTimeout(this.currentTimer);
        this.currentTimer = setTimeout(() => {
            this.triggerAlarm();
        }, delay);
    }

    checkPendingAlarms() {
        const alarmData = JSON.parse(localStorage.getItem('ana-alarm'));
        if (alarmData) {
            const now = Date.now();
            if (now >= alarmData.endTime) {
                // Ya pasó mientras estaba cerrado/suspendido
                this.triggerAlarm();
            } else {
                // Re-programar el tiempo restante
                this.setupAlarmCheck(alarmData.endTime - now);
            }
        }
    }

    triggerAlarm() {
        const alarmData = JSON.parse(localStorage.getItem('ana-alarm'));
        const mins = alarmData ? alarmData.minutes : 10;

        localStorage.removeItem('ana-alarm');
        this.playAlarmSound();

        const msg = `¡Atención! Se ha cumplido el tiempo de tu alarma de ${mins} minutos. Estoy lista para retomar en Rosario.`;
        this.addMessage(msg, 'ana');
        this.speak(msg);

        if (this.anaCharacter) {
            this.anaCharacter.setPose('happy');
            // Alerta visual: pulso de luz en el holograma
            const holo = document.getElementById('anaAvatarWrap');
            if (holo) {
                holo.classList.add('ana-speaking');
                setTimeout(() => holo.classList.remove('ana-speaking'), 3000);
            }
        }
    }

    playAlarmSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // La nota La (A5)
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5); // Sonar por 1.5 seg
        } catch (e) {
            console.warn("No se pudo reproducir el sonido de la alarma", e);
        }
    }
}

window.addEventListener('load', () => {
    window.assistant = new AssistantCore();
});
