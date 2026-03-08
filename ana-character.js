/**
 * AnaCharacter.js - The Visual Component of Ana Evolution
 * Avatar Holográfico Limpio - Sin interrupciones, Zoom Proporcional.
 */

const ANA_SVG_TEMPLATE = `
<style>
/* ══════════════════════════════════════════
   ANA HOLOGRAPHIC IMAGE AVATAR — MAXIMIZED
   ══════════════════════════════════════════ */

.ana-holo-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /* Centrar verticalmente */
  justify-content: center;
  overflow: hidden;
  padding: 10px; /* <--- MARGEN: 10px */
  box-sizing: border-box;
}

.ana-holo-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

/* MAIN IMAGE BASE (Slideshow Layers) */
.ana-holo-img {
  position: absolute; /* Superpuestas perfectamente */
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* ENCUADRE: Contain impide recortes */
  object-position: 50% 50%; /* POSICIÓN INTERNA: Centro */
  
  /* <--- COORDENADAS MAGNÉTICAS ---> */
  transform-origin: 50% 50%;
  /* Aplicamos los valores exactos definidos por testeo manual */
  transform: scale(1) translate(0px, 10px) translateY(var(--ana-anim-y, 0px));
  
  /* Eliminamos saturate y brightness que causan "ruido" o distorsión en la piel */
  filter: drop-shadow(0 0 15px rgba(0, 150, 255, 0.25));
    
  /* Suavizamos la máscara para evitar bordes "sucios" */
  -webkit-mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
  
  pointer-events: none;
  image-rendering: auto; /* Dejar que el navegador maneje el suavizado */

  /* Visibilidad base */
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

/* Base - Ojos Abiertos */
#anaHoloImg { 
  z-index: 1;
}

/* Capa - Ojos Semi-Abiertos */
#anaHalfImg {
  z-index: 2;
  /* El transform se hereda de la clase base porque ana-holographic.png es 1:1 */
}

/* Capa - Ojos Cerrados */
#anaBlinkImg { 
  z-index: 3;
}

.ana-holo-img.active {
  opacity: 1;
}
</style>

<div class="avatar-wrap full-body-mode" id="anaAvatarWrap">
  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <div class="ana-holo-wrap" id="anaAnimContainer">
      <div class="ana-holo-wrap-inner" style="position: relative; width: 100%; height: 100%;">
        <!-- DIAPOSITIVAS: 1(Open), 2(Half), 3(Closed) -->
        <img id="anaHoloImg" class="ana-holo-img" src="./ana-holographic.png" alt="Ana Open" />
        <img id="anaHalfImg" class="ana-holo-img" src="./ana-half.png" alt="Ana Half" /> 
        <img id="anaBlinkImg" class="ana-holo-img" src="./ana-blink.png" alt="Ana Closed" />
      </div>
    </div>
  </div>
</div>
`;

class AnaCharacter {
  constructor(container) {
    this.container = container;
    this.lifeCycleInterval = null;
    this.blinkTimeout = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentSlide = 0; // 0=Open, 1=Half, 2=Closed
    this.currentPose = 'idle';
    this.render();
    this.startBlinking();
    this.startLifeCycle();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.slides = [
      document.getElementById('anaHoloImg'),
      document.getElementById('anaHalfImg'),
      document.getElementById('anaBlinkImg')
    ];

    this.updateSlides();
  }

  /**
   * Helper para esperar pero poder ser interrumpido si se pausa
   */
  async waitIfIdle(ms) {
    const steps = ms / 100;
    for (let i = 0; i < steps; i++) {
      if (this.isPaused) return false; // Interrumpido
      await new Promise(r => setTimeout(r, 100));
    }
    return true; // Completó el tiempo
  }

  /**
   * Secuencia explícita de parpadeo (10s, 2s, 3s)
   */
  startBlinking() {
    const blinkSequence = async () => {
      if (this.isPaused) {
        await new Promise(r => setTimeout(r, 500));
        return blinkSequence();
      }

      // 1. Ojos Abiertos (10 segundos)
      this.currentSlide = 0;
      this.updateSlides();
      let completed = await this.waitIfIdle(10000);
      if (!completed) return blinkSequence();

      // 2. Ojos Semi-Abiertos (2 segundos)
      this.currentSlide = 1;
      this.updateSlides();
      completed = await this.waitIfIdle(2000);
      if (!completed) return blinkSequence();

      // 3. Ojos Cerrados (3 segundos)
      this.currentSlide = 2;
      this.updateSlides();
      completed = await this.waitIfIdle(3000);
      if (!completed) return blinkSequence();

      // Reiniciar ciclo
      blinkSequence();
    };

    blinkSequence();
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      if (slide) {
        if (index === this.currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      }
    });
  }

  /**
   * Ciclo de vida visual: Parpadeo natural, Respiración y Habla
   */
  startLifeCycle() {
    let t = 0;
    let p = 0;

    // Bucle principal de animación (60fps aprox)
    this.lifeCycleInterval = setInterval(() => {
      t += 0.04; // Respiración más pausada y natural
      p += 0.45;

      const breathY = Math.sin(t) * 2; // Menos recorrido para evitar mareo
      let speakY = 0;

      // Si está hablando, calculamos la intensidad del lip-sync
      if (this.isSpeaking) {
        speakY = Math.abs(Math.sin(p)) * -3;
      }

      const totalY = breathY + speakY;

      // Aplicar movimiento a través de variable CSS para no romper el transform base
      if (this.avatarWrap) {
        this.avatarWrap.style.setProperty('--ana-anim-y', `${totalY}px`);

        // Efecto reactivo muy sutil al habla, solo glow, nada de distorsión de color
        const activeSlide = this.slides[this.currentSlide];
        if (this.isSpeaking && activeSlide) {
          const glow = 15 + Math.abs(Math.sin(p)) * 10;
          activeSlide.style.filter = `drop-shadow(0 0 ${glow}px rgba(0, 200, 255, 0.5))`;
        } else if (activeSlide) {
          activeSlide.style.filter = '';
        }
      }
    }, 32);
  }

  performBlink() {
    // This method is no longer used as blinking is handled by the slideshow
  }

  setPose(poseName) {
    this.currentPose = poseName;
    console.log(`[Ana] Cambiando pose a: ${poseName}`);

    // Si la pose no es idle, pausamos el parpadeo normal
    if (poseName !== 'idle') {
      this.isPaused = true;
      // Aquí se podrían inyectar animaciones de emojis o efectos según la pose
    } else {
      this.isPaused = false;
    }
  }

  startSpeaking() {
    this.isSpeaking = true;
    this.isPaused = true; // Pausa el parpadeo mientras habla

    // Forzamos los ojos abiertos mientras habla (opcional, o semi)
    this.currentSlide = 0;
    this.updateSlides();

    if (this.avatarWrap) this.avatarWrap.classList.add('ana-speaking');
  }

  stopSpeaking() {
    this.isSpeaking = false;
    this.isPaused = false; // Reanuda el parpadeo natural
    this.setPose('idle'); // Vuelve a la pose inicial

    if (this.avatarWrap) this.avatarWrap.classList.remove('ana-speaking');
    document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
  }
}
