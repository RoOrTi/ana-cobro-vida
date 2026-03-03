/**
 * AssistantBrain.js - The "Brain" (Intelligence) of Avatar Assistant
 * Powered by Gemini Intelligence with Screen Context
 */

class AssistantBrain {
    constructor(core) {
        this.core = core;
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
                "Qué pregunta tan interesante. Aunque no tengo toda la información del mundo, haré mi mejor esfuerzo para ayudarte. ¿Podrías darme más detalles o contexto?",
                "Entiendo tu pregunta. Déjame pensar en la mejor manera de responderte... Cada conversación me ayuda a aprender y mejorar. ¿Qué más te gustaría saber?",
                "Eso es algo fascinante sobre lo que reflexionar. Mi perspectiva es que la mejor manera de abordar esto es con curiosidad y mente abierta. ¿Qué piensas tú?",
            ]
        };
    }

    async think(userInput) {
        const input = userInput.toLowerCase().trim();
        let response = "";

        if (input.match(/hola|hi|hey|buenos|buenas|saludos|qué tal/)) response = this.pick(this.knowledge.greeting);
        else if (input.match(/quién eres|tu nombre|quien eres|cómo te llamas/)) response = this.pick(this.knowledge.identity);
        else if (input.match(/qué puedes|qué haces|qué sabes|capacidades|ayúdame/)) response = this.pick(this.knowledge.capabilities);
        else if (input.match(/chiste|broma|humor|gracioso|reír/)) response = this.pick(this.knowledge.jokes);
        else if (input.match(/ia|inteligencia artificial|llm|gpt/)) response = this.pick(this.knowledge.ai_info);
        else if (input.match(/adiós|adios|chau|bye|nos vemos|hasta luego/)) response = this.pick(this.knowledge.farewells);
        else if (input.match(/gracias|thanks|agradezco/)) response = this.pick(this.knowledge.thanks);
        else {
            response = this.pick(this.knowledge.default);
        }

        // Simulate thinking delay
        if (this.core) {
            this.core.showTypingIndicator();
            setTimeout(() => {
                this.core.hideTypingIndicator();
                this.core.speak(response);
                this.core.addMessage(response, 'ana');
            }, 1000 + Math.random() * 1000);
        }
    }

    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
}
