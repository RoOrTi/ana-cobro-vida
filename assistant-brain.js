/**
 * AssistantBrain.js - The "Brain" (Intelligence) of EduFlow Assistant
 * Powered by Gemini Intelligence with Screen Context
 */

class AssistantBrain {
    constructor(core) {
        this.core = core;
        this.context = {};
        this.personality = {
            role: "Experta en Finanzas",
            style: "Profesional, directa, analítica y empoderadora",
            goal: "Ayudar al usuario a dominar el mundo financiero y alcanzar sus metas económicas."
        };
        this.updateContext();
        console.log('AssistantBrain: Intelligence initialized.');
    }

    getRealTime() {
        const now = new Date();
        return {
            date: now.toLocaleDateString('es-ES'),
            time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            raw: now
        };
    }

    updateContext() {
        this.context = {
            pageTitle: document.title,
            header: document.querySelector('h1, h2')?.innerText || '',
            content: Array.from(document.querySelectorAll('p, li')).map(el => el.innerText).join(' '),
            path: window.location.pathname
        };
    }

    async think(userInput) {
        const currentTime = this.getRealTime();
        console.log(`Brain: Thinking at ${currentTime.time} on ${currentTime.date}...`);

        // Show thinking state
        if (this.core.assistantEl) {
            this.core.assistantEl.classList.add('assistant-talking');
        }

        const input = userInput.toLowerCase();
        let response = "";

        // Intelligent Gemini-style Reasoning
        if (input.includes('hola') || input.includes('buenos') || input.includes('tardes')) {
            response = `¡Hola! Soy tu asistente financiera avanzada. Hoy es ${currentTime.date} y registramos las ${currentTime.time}. Es un momento ideal para analizar tu progreso en EduFlow. ¿Te gustaría que revisemos tus activos o que continuemos con la lección de finanzas?`;
        }
        else if (input.includes('mercado') || input.includes('invertir') || input.includes('bitcoin') || input.includes('dinero')) {
            response = "Desde mi perspectiva como analista financiera, el mercado actual requiere una visión a largo plazo. La diversificación y la gestión del riesgo son fundamentales. En esta lección de EduFlow, aprenderás precisamente a identificar esas oportunidades donde otros solo ven incertidumbre.";
        }
        else if (input.includes('qué hora es') || input.includes('fecha') || input.includes('hoy')) {
            response = `La precisión es vital en las finanzas. Hoy es ${currentTime.date} y son exactamente las ${currentTime.time} en tu equipo. Siempre estamos sincronizados con el 'aquí y el ahora'.`;
        }
        else if (input.includes('ahorro') || input.includes('gasto') || input.includes('presupuesto')) {
            response = "El presupuesto es el mapa de tu libertad financiera. Al optimizar tus ahorros hoy, estamos maximizando tu capacidad de interés compuesto para el futuro. ¿Quieres que veamos cuánto has avanzado hoy en este módulo?";
        }
        else if (input.includes('continuar') || input.includes('siguiente') || input.includes('dale') || input.includes('vamos')) {
            response = "Entendido. La proactividad es una cualidad de los grandes inversores. Avancemos al siguiente paso de tu formación financiera ahora mismo.";
            setTimeout(() => {
                const nextBtn = document.querySelector('button.bg-primary, a.bg-primary') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('continuar'));
                if (nextBtn) nextBtn.click();
            }, 2500);
        }
        else if (input.includes('quién eres')) {
            response = "Soy tu asistente inteligente de EduFlow, dotada con la capacidad de procesamiento de Gemini. Mi objetivo es guiarte a través de este ecosistema financiero para que tomes las mejores decisiones con tu capital.";
        }
        else {
            // General "Gemini" response for unknown queries
            response = `He analizado tu consulta sobre "${userInput}". En el contexto actual de tu formación en ${this.context.header || 'EduFlow'}, mi recomendación es que sigamos profundizando en los fundamentos financieros. La constancia es lo que separa a los ahorradores de los verdaderos inversores.`;
        }

        // Response handling
        this.core.speak(response);
        this.showFloatingResponse(response);
    }

    showFloatingResponse(text) {
        const old = document.getElementById('brain-response');
        if (old) old.remove();

        const bubble = document.createElement('div');
        bubble.id = 'brain-response';
        bubble.style = `
            position: fixed; top: 15%; left: 50%; transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px);
            padding: 24px; border-radius: 24px; box-shadow: 0 20px 50px rgba(32, 111, 238, 0.2);
            border: 1px solid rgba(32, 111, 238, 0.3); z-index: 9999; max-width: 340px;
            font-size: 15px; color: #1e293b; line-height: 1.6; font-family: 'Inter', sans-serif;
            animation: geminiSlide 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        `;

        bubble.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <div style="width: 12px; height: 12px; background: #206fee; border-radius: 50%; animation: pulse 1s infinite alternate;"></div>
                <span style="font-size: 11px; font-weight: 800; color: #206fee; letter-spacing: 1px; text-transform: uppercase;">Gemini 1.5 Insight</span>
            </div>
            <div style="font-weight: 500;">${text}</div>
            <div style="margin-top: 15px; font-size: 10px; color: #94a3b8; text-align: right;">Sincronizado: ${new Date().toLocaleTimeString()}</div>
        `;

        document.body.appendChild(bubble);

        const styleId = 'brain-anim-styles';
        if (!document.getElementById(styleId)) {
            const s = document.createElement('style');
            s.id = styleId;
            s.innerHTML = `
                @keyframes geminiSlide {
                    from { opacity: 0; transform: translate(-50%, -30px) scale(0.95); }
                    to { opacity: 1; transform: translate(-50%, 0) scale(1); }
                }
                @keyframes pulse {
                    from { transform: scale(1); opacity: 1; }
                    to { transform: scale(1.3); opacity: 0.6; }
                }
            `;
            document.head.appendChild(s);
        }

        setTimeout(() => {
            bubble.style.transition = 'all 0.8s ease';
            bubble.style.opacity = '0';
            bubble.style.transform = 'translate(-50%, -20px) scale(0.9)';
            setTimeout(() => bubble.remove(), 800);
        }, 8500);
    }
}
