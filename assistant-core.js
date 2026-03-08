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
        this.lastMepPrice = null; // Seguimiento proactivo

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
        const data = this.brain.financialData;

        // --- ALERTA PROACTIVA (Salto de Precio) ---
        if (data && data.market_summary) {
            const currentMep = data.market_summary.exchange_rates.dolar_mep.valor;
            // Si el precio cambia más de 2 pesos de un momento a otro
            if (this.lastMepPrice && Math.abs(currentMep - this.lastMepPrice) >= 2) {
                const trend = currentMep > this.lastMepPrice ? "subido" : "bajado";
                this.speak(`Ana informa: El Dólar MEP ha ${trend} y ahora cotiza a ${Math.floor(currentMep)} pesos.`);
                if (this.anaCharacter) this.anaCharacter.setPose('serious');
            }
            this.lastMepPrice = currentMep;
        }

        this.updateMarketTicker(data);
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

        console.log(`[AssistantCore] Alarma programada: ${minutes} minutos.`);

        // Mostrar contador regresivo visible
        this.showCountdown(endTime);
        this.setupAlarmCheck(minutes * 60 * 1000);
    }

    showCountdown(endTime) {
        // Limpiar contador anterior si existía
        this.clearCountdown();

        // Crear elemento de contador en el header
        let countdownEl = document.getElementById('anaCountdown');
        if (!countdownEl) {
            countdownEl = document.createElement('div');
            countdownEl.id = 'anaCountdown';
            countdownEl.style.cssText = `
                position: fixed; top: 12px; right: 20px; z-index: 9000;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
                border: 1px solid rgba(0,210,255,0.4); border-radius: 20px;
                padding: 6px 16px; font-family: monospace; font-size: 1rem;
                color: #00d4ff; letter-spacing: 2px;
                box-shadow: 0 0 15px rgba(0,210,255,0.2);
                display: flex; align-items: center; gap: 8px;
            `;
            document.body.appendChild(countdownEl);
        }

        const updateDisplay = () => {
            const remaining = endTime - Date.now();
            if (remaining <= 0) {
                this.clearCountdown();
                return;
            }
            const totalSecs = Math.ceil(remaining / 1000);
            const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
            const secs = (totalSecs % 60).toString().padStart(2, '0');

            // Cambiar color cuando queden menos de 2 minutos
            const color = totalSecs < 120 ? '#ff6b6b' : '#00d4ff';
            const pulse = totalSecs < 60 ? 'animation: countdown-pulse 1s infinite;' : '';
            countdownEl.style.color = color;
            countdownEl.style.borderColor = color.replace(')', ', 0.4)');
            countdownEl.innerHTML = `⏱️ ${mins}:${secs}`;
        };

        // Agregar keyframe de pulso si no existe
        if (!document.getElementById('countdown-style')) {
            const st = document.createElement('style');
            st.id = 'countdown-style';
            st.innerHTML = `@keyframes countdown-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`;
            document.head.appendChild(st);
        }

        updateDisplay();
        this.countdownInterval = setInterval(updateDisplay, 1000);
    }

    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        const el = document.getElementById('anaCountdown');
        if (el) el.remove();
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

        // Limpiar el contador al disparar la alarma
        this.clearCountdown();

        localStorage.removeItem('ana-alarm');
        this.playAlarmSound();

        const msg = `¡Atención! Se ha cumplido el tiempo de tu alarma de ${mins} minutos.`;
        this.addMessage(msg, 'ana');
        this.speak(msg);

        if (this.anaCharacter) {
            this.anaCharacter.setPose('happy');

            // --- ALERTA VISUAL PREMIUM + NOTTE MAGICA ---
            const overlay = document.createElement('div');
            overlay.className = 'ana-alert-overlay';
            overlay.innerHTML = `
                <div class="alert-content">
                    <img src="./ana-alert.png" class="alert-img" onerror="this.style.display='none'">
                    <div class="alert-text">⏱ TIEMPO CUMPLIDO</div>
                    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:10px;">
                        <button class="alert-close">¡VAMOS!</button>
                        <button class="notte-btn" onclick="window.assistant && window.assistant.playNotteMagica()">
                            🎵 Notte Magica
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

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
                    display: flex; flex-direction: column; align-items: center; gap: 15px;
                }
                .alert-img { width: 260px; height: 260px; border-radius: 25px; box-shadow: 0 0 40px #00d2ff; object-fit: cover; border: 2px solid rgba(0,210,255,0.5); }
                .alert-text { font-size: 2rem; font-weight: 900; letter-spacing: 4px; text-shadow: 0 0 15px #00d2ff; }
                .alert-close { background: linear-gradient(135deg, #00d2ff, #0072ff); border: none; padding: 12px 32px; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.3s; color: white; font-size: 1rem; }
                .alert-close:hover { transform: scale(1.1); box-shadow: 0 0 25px #00d2ff; }
                .notte-btn { background: linear-gradient(135deg, #c9a96e, #ffd700); border: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; cursor: pointer; color: #000; font-size: 1rem; transition: 0.3s; }
                .notte-btn:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(201,169,110,0.6); }
                .notte-player { margin-top: 5px; }
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
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startOffset);
                gain.gain.setValueAtTime(0, audioCtx.currentTime + startOffset);
                gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startOffset + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startOffset + duration);
                osc.start(audioCtx.currentTime + startOffset);
                osc.stop(audioCtx.currentTime + startOffset + duration);
            };
            // Acordes de anuncio
            playNote(523.25, 0.4, 0);
            playNote(659.25, 0.4, 0.15);
            playNote(783.99, 0.4, 0.3);
            playNote(1046.50, 0.8, 0.45);
        } catch (e) {
            console.warn("Audio error", e);
        }
    }

    /**
     * Síntesis local de "Notte Magica" (Un'estate Italiana - Gianna Nannini, 1990)
     * Funciona 100% offline — no requiere internet.
     */
    playNotteMagica() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Notas de la melodía principal (frecuencias en Hz, duración en s, pausa antes)
            // Melodía: Mi-Re-Do-Re-Mi-Mi-Mi | Re-Re-Re | Mi-Sol-Sol | (repite)
            const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23,
                G4 = 392.00, A4 = 440.00, B4 = 493.88,
                C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99;

            // [frecuencia, duración, pausa_antes]
            const melody = [
                [E4, 0.35, 0], [D4, 0.2, 0.38], [C4, 0.4, 0.60],
                [D4, 0.2, 1.02], [E4, 0.3, 1.24], [E4, 0.3, 1.56], [E4, 0.5, 1.88],
                [D4, 0.3, 2.42], [D4, 0.3, 2.74], [D4, 0.5, 3.06],
                [E4, 0.3, 3.60], [G4, 0.3, 3.92], [G4, 0.6, 4.24],

                [E4, 0.35, 4.92], [D4, 0.2, 5.30], [C4, 0.4, 5.52],
                [D4, 0.2, 5.94], [E4, 0.3, 6.16], [E4, 0.3, 6.48], [E4, 0.3, 6.80],
                [D4, 0.3, 7.12], [D4, 0.3, 7.44], [E4, 0.2, 7.76], [D4, 0.2, 7.98],
                [C4, 0.8, 8.20],

                // Segunda parte — más aguda
                [E5, 0.35, 9.10], [D5, 0.2, 9.48], [C5, 0.4, 9.70],
                [D5, 0.2, 10.12], [E5, 0.3, 10.34], [E5, 0.3, 10.66], [E5, 0.5, 10.98],
                [D5, 0.3, 11.52], [D5, 0.3, 11.84], [D5, 0.5, 12.16],
                [E5, 0.3, 12.70], [G5, 0.3, 13.02], [G5, 0.8, 13.34],
            ];

            melody.forEach(([freq, dur, offset]) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                // Mezcla de sine + triangle para timbre más cálido, tipo flauta
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + offset);
                gain.gain.setValueAtTime(0, ctx.currentTime + offset);
                gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + offset + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + offset);
                osc.stop(ctx.currentTime + offset + dur + 0.05);
            });

            console.log('[Ana] ♪ Notte Magica — Italia 90 ♪');
        } catch (e) {
            console.warn('Audio error:', e);
        }
    }
}

window.addEventListener('load', () => {
    window.assistant = new AssistantCore();
});
