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

        // Solicitar Wake Lock para que la pantalla no se duerma durante la cuenta
        this.requestWakeLock();

        // Mostrar contador regresivo visible
        this.showCountdown(endTime);
        this.setupAlarmCheck(minutes * 60 * 1000);
    }

    async requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('[Ana] Wake Lock activo: pantalla no se apagará.');
                // Re-activar si el usuario vuelve a la pestaña
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible' && localStorage.getItem('ana-alarm')) {
                        this.requestWakeLock();
                    }
                }, { once: true });
            }
        } catch (e) {
            console.warn('[Ana] Wake Lock no disponible:', e.message);
        }
    }

    releaseWakeLock() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
            console.log('[Ana] Wake Lock liberado.');
        }
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
        this.releaseWakeLock();
    }

    setupAlarmCheck(delay) {
        // Limpiar previos
        if (this.currentTimer) clearTimeout(this.currentTimer);
        if (this.alarmWatchdog) clearInterval(this.alarmWatchdog);

        // setTimeout principal (puede ser throttleado por Chrome en background)
        this.currentTimer = setTimeout(() => this.triggerAlarm(), delay);

        // Watchdog cada 10 segundos: comprueba la hora real (como un reloj)
        // Esto garantiza precisión aunque Chrome throttlee el setTimeout
        this.alarmWatchdog = setInterval(() => {
            const alarmData = JSON.parse(localStorage.getItem('ana-alarm'));
            if (!alarmData) {
                clearInterval(this.alarmWatchdog);
                return;
            }
            if (Date.now() >= alarmData.endTime) {
                clearTimeout(this.currentTimer);
                clearInterval(this.alarmWatchdog);
                this.triggerAlarm();
            }
        }, 10000); // cada 10 segundos
    }

    checkPendingAlarms() {
        const alarmData = JSON.parse(localStorage.getItem('ana-alarm'));
        if (alarmData) {
            const now = Date.now();
            if (now >= alarmData.endTime) {
                // Ya pasó mientras estaba cerrado/suspendido
                this.triggerAlarm();
            } else {
                // Re-programar el tiempo restante + relanzar countdown
                this.showCountdown(alarmData.endTime);
                this.setupAlarmCheck(alarmData.endTime - now);
            }
        }
    }

    triggerAlarm() {
        // Evitar doble disparo
        if (this.alarmFired) return;
        this.alarmFired = true;
        setTimeout(() => { this.alarmFired = false; }, 3000);

        // Limpiar todos los timers
        if (this.currentTimer) clearTimeout(this.currentTimer);
        if (this.alarmWatchdog) clearInterval(this.alarmWatchdog);

        const alarmData = JSON.parse(localStorage.getItem('ana-alarm'));
        const mins = alarmData ? alarmData.minutes : 10;

        // Limpiar el contador al disparar la alarma
        this.clearCountdown();
        localStorage.removeItem('ana-alarm');

        // 1. Sonido de anuncio
        this.playAlarmSound();
        // 2. Notte Magica automático (con pequeño retardo para no solapar)
        setTimeout(() => this.playNotteMagica(), 1200);
        // 3. Efecto visual de discoteca
        this.launchDiscoEffect();

        const msg = `¡Es hora de volver! Pasaron tus ${mins} minutos de descanso. ¡A trabajar!`;
        this.addMessage(msg, 'ana');
        setTimeout(() => this.speak(msg), 14500); // Habla después de la melodía

        if (this.anaCharacter) this.anaCharacter.setPose('happy');
    }

    launchDiscoEffect() {
        // Crear el canvas de discoteca
        const canvas = document.createElement('canvas');
        canvas.id = 'discoCanvas';
        canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 9999; pointer-events: none;
        `;
        document.body.appendChild(canvas);

        // Overlay de texto encima del canvas
        const msg = document.createElement('div');
        msg.id = 'discoMsg';
        msg.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 10000; display: flex; flex-direction: column;
            align-items: center; justify-content: center; pointer-events: auto;
        `;
        msg.innerHTML = `
            <div style="font-size: clamp(2rem,6vw,4rem); font-weight:900; letter-spacing:6px;
                        color: #fff; text-shadow: 0 0 30px #ffd700, 0 0 60px #ff6b6b;
                        animation: discoText 0.8s ease-in-out infinite alternate;
                        text-align:center; padding: 20px;">
                ⏰ ¡TIEMPO DE VOLVER!
            </div>
            <div style="font-size:1.2rem; color:rgba(255,255,255,0.8); letter-spacing:3px; margin-top:10px;">
                🎵 Notte Magica • Italia 90
            </div>
            <button onclick="document.getElementById('discoCanvas')?.remove(); document.getElementById('discoMsg')?.remove();"
                style="margin-top: 40px; background: linear-gradient(135deg,#ffd700,#ff6b6b);
                       border:none; padding:14px 44px; border-radius:50px; font-size:1.1rem;
                       font-weight:900; cursor:pointer; color:#000; letter-spacing:2px;
                       box-shadow: 0 0 30px rgba(255,215,0,0.6); transition:0.3s;">
                💪 ¡A TRABAJAR!
            </button>
        `;
        document.body.appendChild(msg);

        // Inyectar keyframe
        if (!document.getElementById('disco-style')) {
            const st = document.createElement('style');
            st.id = 'disco-style';
            st.innerHTML = `
                @keyframes discoText {
                    from { text-shadow: 0 0 20px #ffd700, 0 0 50px #ff6b6b; color: #fff; }
                    to   { text-shadow: 0 0 40px #00d4ff, 0 0 80px #c9a96e; color: #ffd700; }
                }
            `;
            document.head.appendChild(st);
        }

        // Animar el canvas con rayos de discoteca
        const ctx = canvas.getContext('2d');
        let frame = 0;
        const colors = ['#ffd700', '#ff6b6b', '#00d4ff', '#c9a96e', '#ffffff', '#7c4dff', '#4caf50'];

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            if (!document.getElementById('discoCanvas')) return; // Parar si se cerró
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const numRays = 18;
            const speed = frame * 0.025;

            // Fondo suave pulsante
            const alpha = 0.08 + Math.abs(Math.sin(frame * 0.04)) * 0.12;
            ctx.fillStyle = `rgba(0,0,0,${alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Esfera central brillante
            const sphereGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 + Math.sin(frame * 0.05) * 20);
            sphereGrad.addColorStop(0, `rgba(255,255,255,${0.7 + Math.sin(frame * 0.1) * 0.3})`);
            sphereGrad.addColorStop(0.4, colors[frame % colors.length] + 'aa');
            sphereGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, 80 + Math.sin(frame * 0.05) * 20, 0, Math.PI * 2);
            ctx.fillStyle = sphereGrad;
            ctx.fill();

            // Rayos de luz girando
            for (let i = 0; i < numRays; i++) {
                const angle = (i / numRays) * Math.PI * 2 + speed;
                const len = Math.max(canvas.width, canvas.height) * 1.5;
                const color = colors[(i + frame) % colors.length];
                const width = 4 + Math.abs(Math.sin(frame * 0.07 + i)) * 8;

                const grad = ctx.createLinearGradient(cx, cy,
                    cx + Math.cos(angle) * len,
                    cy + Math.sin(angle) * len);
                grad.addColorStop(0, color + 'ff');
                grad.addColorStop(0.3, color + '66');
                grad.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
                ctx.strokeStyle = grad;
                ctx.lineWidth = width;
                ctx.globalAlpha = 0.5 + Math.abs(Math.sin(frame * 0.08 + i * 0.5)) * 0.5;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            frame++;
            requestAnimationFrame(animate);
        };
        animate();

        // Auto-cerrar después de 45 segundos si el usuario no lo cierra
        setTimeout(() => {
            document.getElementById('discoCanvas')?.remove();
            document.getElementById('discoMsg')?.remove();
        }, 45000);
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
            const C4 = 261.63, D4 = 293.66, E4 = 329.63,
                G4 = 392.00, C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99;

            const melody = [
                [E4, 0.35, 0], [D4, 0.2, 0.38], [C4, 0.4, 0.60],
                [D4, 0.2, 1.02], [E4, 0.3, 1.24], [E4, 0.3, 1.56], [E4, 0.5, 1.88],
                [D4, 0.3, 2.42], [D4, 0.3, 2.74], [D4, 0.5, 3.06],
                [E4, 0.3, 3.60], [G4, 0.3, 3.92], [G4, 0.6, 4.24],
                [E4, 0.35, 4.92], [D4, 0.2, 5.30], [C4, 0.4, 5.52],
                [D4, 0.2, 5.94], [E4, 0.3, 6.16], [E4, 0.3, 6.48], [E4, 0.3, 6.80],
                [D4, 0.3, 7.12], [D4, 0.3, 7.44], [E4, 0.2, 7.76], [D4, 0.2, 7.98],
                [C4, 0.8, 8.20],
                [E5, 0.35, 9.10], [D5, 0.2, 9.48], [C5, 0.4, 9.70],
                [D5, 0.2, 10.12], [E5, 0.3, 10.34], [E5, 0.3, 10.66], [E5, 0.5, 10.98],
                [D5, 0.3, 11.52], [D5, 0.3, 11.84], [D5, 0.5, 12.16],
                [E5, 0.3, 12.70], [G5, 0.3, 13.02], [G5, 0.8, 13.34],
            ];

            melody.forEach(([freq, dur, offset]) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
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
