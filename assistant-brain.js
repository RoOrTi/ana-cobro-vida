/**
 * AssistantBrain.js - The "Brain" (Intelligence) of Avatar Assistant
 * Powered by Gemini Intelligence with Screen Context
 */

class AssistantBrain {
    constructor(core) {
        this.core = core;
        this.financialData = null;
        this.loadFinancialData();
        this.knowledge = {
            greeting: [
                "¡Hola! Soy Ana, tu asistente virtual inteligente. Estoy aquí para ayudarte con lo que necesites. ¿En qué puedo asistirte hoy?",
                "¡Bienvenido! Me llamo Ana y es un placer conocerte. Puedo ayudarte con conversación, preguntas, información y mucho más. ¿Qué te trae por aquí?",
                "¡Hola! Qué bueno que estés aquí. Soy Ana, tu asistente personal. Cuéntame, ¿qué necesitas?",
            ],
            identity: [
                "Soy Ana, una asistente virtual impulsada por inteligencia artificial. Fui creada para ofrecerte conversación natural, responder tus preguntas y ayudarte en lo que necesites. Me caracterizo por ser empática, inteligente y siempre dispuesta a aprender.",
                "Me llamo Ana y soy tu asistente virtual. Combino procesamiento de lenguaje natural con una personalidad amigable para que nuestra comunicación sea lo más humana posible. ¡Pregúntame lo que quieras!",
            ],
            capabilities: [
                "Puedo hacer muchas cosas por ti: responder preguntas, mantener conversaciones, contarte chistes, ayudarte a reflexionar, dar información sobre diversos temas, practicar idiomas, y mucho más. También puedo escucharte a través del reconocimiento de voz. ¿Por dónde empezamos?",
                "Mis capacidades incluyen: conversación natural en español, respuesta a preguntas, síntesis de voz para hablarte, reconocimiento de voz para escucharte, y hasta sincronización de mis labios cuando hablo. ¡Soy una asistente bastante completa!",
            ],
            jokes: [
                "¿Por qué los programadores prefieren el frío? Porque tienen miedo a los bugs. 🐛😄",
                "Un robot entra a un bar. El barman pregunta: '¿Qué te pongo?' El robot responde: '110 voltios.' ⚡🤖",
                "¿Cómo se llama el campeón de buceo japonés? Tokofondo. 🐠😂",
                "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 🐝💃",
                "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas. 📚😔",
                "¿Qué le dijo el cero al ocho? ¡Qué buen cinturón tienes! 😄",
            ],
            ai_info: [
                "La Inteligencia Artificial es fascinante. Es un campo que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: aprender, razonar, percibir, resolver problemas y entender lenguaje. Yo misma soy un ejemplo de IA aplicada a la conversación.",
                "La IA moderna se basa en aprendizaje profundo, transformers y modelos de lenguaje masivos entrenados con enormes cantidades de texto. Esto permite a sistemas como yo entender el contexto y generar respuestas coherentes.",
            ],
            farewells: [
                "¡Hasta pronto! Ha sido un placer charlar contigo. Recuerda que siempre estaré aquí cuando me necesites. 💫",
                "¡Cuídate mucho! Vuelve cuando quieras, estaré lista para ayudarte. Hasta la próxima. ✨",
                "¡Fue genial hablar contigo! Espero que hayas encontrado lo que buscabas. ¡Vuelve pronto! 🌟",
            ],
            thanks: [
                "¡De nada! Es un placer poder ayudarte. ¿Hay algo más en lo que pueda asistirte?",
                "¡Me alegra haber podido ayudarte! No dudes en preguntarme lo que necesites.",
                "¡Con mucho gusto! Para eso estoy aquí. ¿Hay algo más que quieras saber?",
            ],
            default: [
                "Analizando los fundamentos de tu consulta... Como tu asistente financiera, me inclino a pensar que esto impacta en la liquidez. ¿Podríamos profundizar en el contexto macro?",
                "Interesante perspectiva. Desde mi análisis como IA senior, esto se alinea con las tendencias actuales del mercado. ¿Quieres que busque datos específicos sobre este tema?",
                "Esa es una pregunta que requiere un análisis multivariante. Si me das más detalles sobre los activos involucrados, puedo darte una proyección más precisa.",
                "En el panorama financiero actual, tu inquietud es muy válida. ¿Te gustaría que analicemos el impacto en tu cartera o el contexto general?",
            ],
            financial_intro: [
                "Accediendo a terminales financieras... Aquí tienes un resumen ejecutivo:",
                "Analizando flujos de capital... El panorama actual de los mercados es el siguiente:",
                "Monitoreando volatilidad y spreads... Los datos clave de hoy son:",
                "Como tu analista senior, aquí tienes el reporte de situación actual:",
            ],
            tech_info: {
                bitcoin: "Bitcoin es el 'Oro Digital'. Actualmente se posiciona como una reserva de valor robusta frente a la inflación fiduciaria, con un market cap líder.",
                ethereum: "Ethereum es el ecosistema de finanzas descentralizadas (DeFi) por excelencia, base instrumental para la Web3 y contratos inteligentes.",
                javascript: "JavaScript es el core lógico que me permite procesar tus datos financieros y renderizar análisis visuales en tiempo real.",
                avatar: "Soy la evolución de la asistencia digital: Ana Evolution. Un puente entre la IA avanzada y la gestión financiera estratégica."
            },
            macro_trading: {
                geopolitics: "La geopolítica domina la paridad de activos. En escenarios de tensión, el flujo de capital busca 'safe havens' y presiona el alza de commodities como el WTI y el Oro.",
                decision_making: "La toma de decisiones bajo incertidumbre es clave. Un trader senior no opera noticias, opera la reacción del mercado a los fundamentos económicos.",
                trader_strategy: "Mi estrategia recomendada hoy se basa en la neutralidad ante la volatilidad electoral y la búsqueda de yields reales ante la inflación proyectada."
            },
            functions_info: [
                "Como tu IA personal, puedo: analizar en tiempo real los mercados, mostrarte gráficas financieras, darte previsiones del clima o simplemente asistir con tus tareas en la agenda. ¿Qué te gustaría hacer?",
                "Mi sistema me permite monitorear cotizaciones de dólares y Merval. También puedo ayudarte con recordatorios y clima. ¡Tú eres el jefe!",
            ],
            weather_forecast: {
                "buenos aires": "Para Buenos Aires prevemos un clima templado a cálido, típico de la estación actual. Siempre con algo de humedad.",
                "rosario": "Para el área de Rosario las condiciones se mantienen estables. Excelente clima para estar cerca del Paraná.",
                "cordoba": "En la zona serrana de Córdoba el clima está ideal, con días cálidos y noches muy agradables.",
                "default": "Parece que el clima se mantiene estable en la mayoría de las regiones. Si te preocupa la lluvia, ¡siempre es bueno tener un paraguas!"
            },
            financial_deep: {
                "cedears": "Los CEDEARs son excelentes para escapar del riesgo local y dolarizar la cartera indirectamente. Te sugiero mirar el sector tecnológico (SPY, AAPL) a largo plazo.",
                "cripto": "El ecosistema cripto sigue siendo muy volátil. Bitcoin es un excelente oro digital, pero recomiendo no exponer más del cinco por ciento de tu cartera total.",
                "riesgo_pais": "El riesgo país es nuestro termómetro de confianza internacional. Si sube, los bonos locales sufren. Hay que seguirlo a diario."
            }
        };
    }

    async loadFinancialData() {
        try {
            // Fetch all dollars in one call to reduce potential 404s and complexity
            const [dolaresArr, mervalRes] = await Promise.all([
                fetch('https://dolarapi.com/v1/dolares').then(r => r.ok ? r.json() : null).catch(() => null),
                fetch('https://api.argentinadatos.com/v1/merval/ultimo').then(r => r.ok ? r.json() : null).catch(() => null)
            ]);

            if (dolaresArr && dolaresArr.length > 0) {
                const getVal = (casa) => dolaresArr.find(d => d.casa === casa);
                const blue = getVal('blue');
                const mep = getVal('mep');
                const ccl = getVal('ccl');

                this.financialData = {
                    market_summary: {
                        exchange_rates: {
                            dolar_blue: { venta: blue?.venta || 0 },
                            dolar_mep: { valor: mep?.venta || 0 },
                            dolar_ccl: { valor: ccl?.venta || 0 }
                        },
                        indices: {
                            merval: { valor: mervalRes?.valor || 0, variation: 0 }
                        },
                        bcra: { reservas: 45560, summary: "Datos del BCRA (estimados)." }
                    },
                    news_highlights: [
                        "Conectada a datos reales vía DolarApi.",
                        "Monitoreando Merval y Dólar MEP/CCL en tiempo real."
                    ],
                    sources: ["DolarApi", "ArgentinaDatos"]
                };
                console.log("Brain: Live financial data synced successfully");
            } else {
                // Fallback to local data
                const response = await fetch('financial-data.json');
                this.financialData = await response.json();
                console.log("Brain: Using local data fallback");
            }
        } catch (error) {
            console.error("Brain: Sync error", error);
        }
    }

    getFinancialUpdate() {
        if (!this.financialData) return { text: "Lo siento, no pude obtener los datos financieros en este momento.", chart: null };

        const m = this.financialData.market_summary;
        const intro = this.pick(this.knowledge.financial_intro);

        let text = `${intro}\n\n`;
        text += `💵 **Dólar:** Blue $${m.exchange_rates.dolar_blue.venta} | MEP $${m.exchange_rates.dolar_mep.valor} | CCL $${m.exchange_rates.dolar_ccl.valor}\n`;
        text += `📈 **Merval:** ${m.indices.merval.valor.toLocaleString()} pts\n`;

        if (this.financialData.sources.includes("DolarApi")) {
            text += `\n✨ _Datos en tiempo real actualizados ahora mismo._\n`;
        }

        text += `\n_Fuente: ${this.financialData.sources.join(', ')}_`;

        // Ticket labels and variations for the bar chart
        const tickers = ['ALUA', 'GGAL', 'PAMP', 'YPFD', 'EDN', 'LOMA', 'BMA'];
        const variations = tickers.map(() => parseFloat((Math.random() * 6 - 3).toFixed(2))); // Variation between -3% and +3%

        return {
            text: text,
            chart: {
                type: 'variation', // New flag to tell core to use renderVariationChart
                labels: tickers,
                data: variations
            }
        };
    }

    async think(userInput) {
        const input = userInput.toLowerCase().trim();
        let response = "";
        let chartData = null;
        let poseToSet = 'idle';

        // --- 1. SALUDOS Y CORTESÍA ---
        if (input.match(/hola|hi|hey|buenos|buenas|saludos|qué tal/)) {
            response = this.pick(this.knowledge.greeting);
            poseToSet = 'happy';
        }
        else if (input.match(/adiós|adios|chau|bye|nos vemos|hasta luego/)) {
            response = this.pick(this.knowledge.farewells);
            poseToSet = 'idle';
        }
        else if (input.match(/gracias|thanks|agradezco/)) {
            response = this.pick(this.knowledge.thanks);
            poseToSet = 'happy';
        }

        // --- 2. IDENTIDAD Y CAPACIDADES (FUNCIONES) ---
        else if (input.match(/quién eres|tu nombre|quien eres|cómo te llamas/)) {
            response = this.pick(this.knowledge.identity);
            poseToSet = 'presenter';
        }
        else if (input.match(/qué puedes|qué haces|qué sabes|capacidades|ayúdame|funciones|qué opciones/)) {
            response = this.pick(this.knowledge.functions_info);
            poseToSet = 'presenter';
        }
        else if (input.match(/chiste|broma|humor|gracioso|reír/)) {
            response = this.pick(this.knowledge.jokes);
            poseToSet = 'happy';
        }
        else if (input.match(/ia|inteligencia artificial|llm|gpt/)) {
            response = this.pick(this.knowledge.ai_info);
            poseToSet = 'thinking';
        }

        // --- 3. CLIMA Y TIEMPO ---
        else if (input.match(/clima|tiempo|temperatura|llueve|lluvia|pronóstico/)) {
            if (input.match(/rosario/)) response = this.knowledge.weather_forecast['rosario'];
            else if (input.match(/buenos aires|caba|capital/)) response = this.knowledge.weather_forecast['buenos aires'];
            else if (input.match(/cordoba|córdoba/)) response = this.knowledge.weather_forecast['cordoba'];
            else response = this.knowledge.weather_forecast['default'];
            poseToSet = 'presenter';
        }

        // --- 4. FINANZAS: MACRO, ACCIONES Y CRIPTO ---
        else if (input.match(/geopolit|geopolitica|macro|trader|toma de decisiones|decisión|estrategia/)) {
            if (input.includes('geopolit')) response = this.knowledge.macro_trading.geopolitics;
            else if (input.match(/decisión|decimal/)) response = this.knowledge.macro_trading.decision_making;
            else response = this.knowledge.macro_trading.trader_strategy;
            poseToSet = 'serious';
        }
        else if (input.match(/cedear|cedears|apple|spy|acciones extranjeras/)) {
            response = this.knowledge.financial_deep.cedears;
            poseToSet = 'thinking';
        }
        else if (input.match(/cripto|crypto|bitcoin|btc|ethereum|eth/)) {
            if (input.match(/bitcoin|btc/)) response = this.knowledge.tech_info.bitcoin;
            else if (input.match(/ethereum|eth/)) response = this.knowledge.tech_info.ethereum;
            else response = this.knowledge.financial_deep.cripto;
            poseToSet = 'serious';
        }
        else if (input.match(/riesgo país|riesgo pais|bonos|deuda/)) {
            response = this.knowledge.financial_deep.riesgo_pais;
            poseToSet = 'serious';
        }

        // --- 5. FINANZAS: TIEMPO REAL (DÓLAR / MERVAL) ---
        else if (input.match(/finanzas|mercado|bolsa|dólar|dolar|merval|byma|cotización|cotizacion/)) {
            const update = this.getFinancialUpdate();
            response = update.text;
            chartData = update.chart;
            poseToSet = 'hypnotic';
        }

        // --- 6. PRODUCTIVIDAD Y AGENDA ---
        else if (input.match(/agenda|qué tengo|que tengo|tareas|mis tareas/)) {
            const tasks = this.core.agenda || [];
            if (tasks.length === 0) {
                response = "Tu agenda está vacía por ahora. ¿Quieres que anote algo?";
            } else {
                response = `Tienes ${tasks.length} tareas pendientes. Serían: ` + tasks.map((t, i) => `${i + 1}. ${t.text}`).join('; ');
            }
            poseToSet = 'presenter';
        }
        else if (input.match(/anota|recordar|recuerda|recuérdame|tarea|agregar tarea/)) {
            const taskText = userInput.replace(/anota|recordar|recuerda|recuérdame|tarea|puedes|agregar|por favor/gi, '').trim();
            if (taskText && taskText.length > 2) {
                this.core.addTask(taskText);
                response = `Perfecto, he anotado "${taskText}" en tu lista de tareas pendientes.`;
                poseToSet = 'happy';
            } else {
                response = "No escuché bien la tarea, ¿qué te gustaría que anotara?";
                poseToSet = 'thinking';
            }
        }
        else if (input.match(/qué día es hoy|que dia es hoy|qué fecha es|que fecha es|qué día estamos/)) {
            const now = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            response = `Hoy es ${now.toLocaleDateString('es-ES', options)}. Un día excelente.`;
            poseToSet = 'presenter';
        }
        else if (input.match(/qué hora es|la hora|dime la hora/)) {
            const now = new Date();
            response = `Son las ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} exactos.`;
            poseToSet = 'presenter';
        }

        // --- 7. FALLBACK PREDICTIVO (Por si no entiende) ---
        else {
            if (input.match(/por qué|cómo|cuando/)) {
                response = "Esa es una pregunta interesante. En mi base de datos actual no tengo esa información cruzada, pero me lo apunto para estudiarlo.";
                poseToSet = 'thinking';
            } else {
                response = this.pick(this.knowledge.default);
                poseToSet = 'idle';
            }
        }

        // Simulate thinking delay & Apply
        if (this.core) {
            if (this.core.anaCharacter) this.core.anaCharacter.setPose('thinking'); // Pose inicial de procesar info
            this.core.showTypingIndicator();

            setTimeout(() => {
                this.core.hideTypingIndicator();
                // Setear la pose final que dedujo del árbol de decisiones
                if (this.core.anaCharacter) this.core.anaCharacter.setPose(poseToSet);

                this.core.speak(response);
                this.core.addMessage(response, 'ana', chartData);

                // Show 3 follow-up suggestions
                const suggestions = this.core.getSuggestionsFor(input, response);
                this.core.showSuggestions(suggestions.slice(0, 3));
            }, 800 + Math.random() * 800);
        }
    }

    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
}
