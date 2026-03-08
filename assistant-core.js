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
        this.setupDragAndDrop();
        this.setupPasteHandler();

        // Registro de Service Worker para Android/PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(() => console.log('Ana: Service Worker registrado.'))
                .catch(err => console.log('Ana: Error SW', err));
        }

        this.startMarketMonitor();
        // Asegurar que las alarmas se verifiquen al despertar la PC/volver a la pestaña
        window.addEventListener('focus', () => {
            this.checkPendingAlarms();
            this.fetchMarketData(); // Refrescar mercados al volver
        });
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

    setupDragAndDrop() {
        const dropZones = [document.querySelector('.sidebar-agenda'), document.querySelector('.input-area')];

        dropZones.forEach(zone => {
            if (!zone) return;

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-active');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-active');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-active');

                const text = e.dataTransfer.getData('text');
                const files = e.dataTransfer.files;

                if (text) {
                    this.addTask(text);
                    this.speak(`He anotado "${text.substring(0, 30)}..." en tu agenda.`);
                } else if (files.length > 0) {
                    for (let f of files) {
                        this.addTask(`Revisar: ${f.name}`);
                    }
                    this.speak(`Agregué ${files.length} archivos como tareas para revisar.`);
                }
            });
        });
    }

    setupPasteHandler() {
        document.addEventListener('paste', (e) => {
            // Solo actuar si el usuario no tiene el foco en el chat-input (para evitar duplicados)
            if (document.activeElement.id === 'chat-input') return;

            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            if (pasteData && pasteData.length > 2) {
                if (confirm(`¿Quieres agregar esto como tarea a la agenda?:\n\n"${pasteData.substring(0, 100)}..."`)) {
                    this.addTask(pasteData);
                    this.speak("Anotado en agenda.");
                }
            }
        });
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

    // --- MONITOR DE MERCADO EN VIVO ---

    startMarketMonitor() {
        // Primera carga inmediata
        setTimeout(() => this.fetchMarketData(), 2000);
        // Cada 2 min
        setInterval(() => this.fetchMarketData(), 120000);
    }

    async fetchMarketData() {
        if (!this.brain) return;
        await this.brain.fetchMarketIndices();
        this.updateMarketTicker(this.brain.financialData);
    }

    updateMarketTicker(data) {
        const ticker = document.getElementById('marketTicker');
        if (!ticker || !data || !data.market_summary) return;

        const summary = data.market_summary;
        const rates = summary.exchange_rates;
        const indices = summary.indices;

        const format = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
        const formatVar = (v) => v >= 0 ? `<span class="var-up">▲ ${v}%</span>` : `<span class="var-down">▼ ${v}%</span>`;

        ticker.innerHTML = `
            <div class="ticker-item">
                <span class="ticker-label">BLUE</span>
                <span class="ticker-value">${format(rates.dolar_blue.venta)}</span>
            </div>
            <div class="ticker-item">
                <span class="ticker-label">MEP</span>
                <span class="ticker-value">${format(rates.dolar_mep.valor)}</span>
            </div>
            <div class="ticker-item">
                <span class="ticker-label">RP</span>
                <span class="ticker-value">${indices.riesgo_pais.valor}</span>
                <span class="ticker-var">${formatVar(indices.riesgo_pais.variation)}</span>
            </div>
            <div class="ticker-item">
                <span class="ticker-label">MERVAL</span>
                <span class="ticker-value">${Math.floor(indices.merval.valor / 1000)}k</span>
                <span class="ticker-var">${formatVar(indices.merval.variation)}</span>
            </div>
        `;
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

        // --- LIP SYNC PRO: Fonemas ---
        utterance.onboundary = (event) => {
            if (event.name === 'word' && this.anaCharacter) {
                const word = cleanText.substring(event.charIndex, event.charIndex + event.charLength);
                // Analizamos la 'energía' de la palabra según sus vocales
                // Tomamos el primer carácter representativo para el frame inicial del vocablo
                const firstChar = word.charAt(0);
                this.anaCharacter.setMouthShape(firstChar);

                // Efecto de movimiento rápido para que no quede estática la boca en palabras largas
                if (word.length > 3) {
                    setTimeout(() => {
                        const midChar = word.charAt(Math.floor(word.length / 2));
                        if (this.anaCharacter.isSpeaking) this.anaCharacter.setMouthShape(midChar);
                    }, 50);
                }
            }
        };

        utterance.onend = () => {
            if (this.anaCharacter) this.anaCharacter.stopSpeaking();
            document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
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

        const msg = `¡Atención! Se ha cumplido el tiempo de tu alarma de ${mins} minutos.`;
        this.addMessage(msg, 'ana');
        this.speak(msg);

        if (this.anaCharacter) {
            this.anaCharacter.setPose('happy');

            // --- ALERTA VISUAL PREMIUM ---
            const overlay = document.createElement('div');
            overlay.className = 'ana-alert-overlay';
            overlay.innerHTML = `
                <div class="alert-content">
                    <img src="./ana-alert.png" class="alert-img" onerror="this.src='https://via.placeholder.com/300?text=ALERTA'">
                    <div class="alert-text">TIEMPO CUMPLIDO</div>
                    <button class="alert-close">¡VAMOS!</button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Estilos dinámicos para la alerta
            const style = document.createElement('style');
            style.innerHTML = `
                .ana-alert-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; animation: anaFadeIn 0.5s ease;
                }
                .alert-content {
                    text-align: center; color: white; transform: scale(0.9);
                    animation: anaPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .alert-img { width: 320px; height: 320px; border-radius: 25px; box-shadow: 0 0 40px #00d2ff; margin-bottom: 25px; object-fit: cover; border: 2px solid rgba(0,210,255,0.5); }
                .alert-text { font-size: 2.2rem; font-weight: 900; letter-spacing: 4px; margin-bottom: 25px; text-shadow: 0 0 15px #00d2ff; }
                .alert-close { background: linear-gradient(135deg, #00d2ff, #0072ff); border: none; padding: 12px 40px; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.3s; color: white; font-size: 1.1rem; }
                .alert-close:hover { transform: scale(1.15); box-shadow: 0 0 25px #00d2ff; }
                @keyframes anaFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes anaPopIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `;
            document.head.appendChild(style);

            overlay.querySelector('.alert-close').onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            };

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
            const playNote = (freq, duration, startOffset) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'triangle'; // Sonido más rico y orgánico
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startOffset);

                gain.gain.setValueAtTime(0, audioCtx.currentTime + startOffset);
                gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + startOffset + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startOffset + duration);

                osc.start(audioCtx.currentTime + startOffset);
                osc.stop(audioCtx.currentTime + startOffset + duration);
            };

            // Secuencia energética y alegre: Do, Mi, Sol, Do (Octava arriba)
            playNote(523.25, 0.4, 0);    // C5
            playNote(659.25, 0.4, 0.15); // E5
            playNote(783.99, 0.4, 0.3);  // G5
            playNote(1046.50, 0.8, 0.45); // C6
        } catch (e) {
            console.warn("Audio error", e);
        }
    }
}

window.addEventListener('load', () => {
    window.assistant = new AssistantCore();
});
