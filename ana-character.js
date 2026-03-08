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
  object-fit: cover; /* RECORTAR: Cover llena el espacio */
  object-position: left center; /* ANCLAJE: Mantiene a Ana a la izquierda y oculta el residuo derecho */
  
  /* <--- COORDENADAS MAGNÉTICAS ---> */
  transform-origin: 50% 50%;
  /* Aplicamos los valores exactos definidos por testeo manual */
  /* Usamos variables CSS para que los gestos no rompan la alineación base */
  transform: 
    scale(var(--ana-g-scale, 1)) 
    translate(var(--ana-g-x, 0px), calc(10px + var(--ana-g-y, 0px))) 
    translateY(var(--ana-anim-y, 0px));
  
  /* Eliminamos saturate y brightness que causan "ruido" o distorsión en la piel */
  filter: drop-shadow(0 0 15px rgba(0, 150, 255, 0.25));
    
  /* Suavizamos la máscara para dar más espacio a las expresiones */
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  
  pointer-events: none;
  image-rendering: auto; /* Dejar que el navegador maneje el suavizado */

  /* Visibilidad base */
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

/* Ajustes específicos para LABIOS durante el habla: Anclaje ultra-estable */
#anaTalkOpen, #anaTalkHalf, #anaTalkClosed {
  transform: 
    scale(var(--ana-mouth-s, 1)) 
    translate(0px, calc(10px + var(--ana-mouth-y, 0px))) 
    translateY(var(--ana-anim-y, 0px)) !important;
  transition: none !important;
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

/* --- LAS POSES AHORA SOLO CAMBIAN VARIABLES PARA EVITAR JITTER --- */
#anaAvatarWrap.pose-happy {
  --ana-g-scale: 1.02;
  --ana-mouth-s: 0.95;
  --ana-mouth-y: 2px;
}

#anaAvatarWrap.pose-serious {
  --ana-g-y: -2px;
  --ana-g-scale: 0.98;
}

#anaAvatarWrap.pose-thinking {
  --ana-g-scale: 1.01;
  --ana-g-x: -5px;
}
</style>

<div class="avatar-wrap full-body-mode" id="anaAvatarWrap">
  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <div class="ana-holo-wrap" id="anaAnimContainer">
      <div class="ana-holo-wrap-inner" style="position: relative; width: 100%; height: 100%;">
        <!-- DIAPOSITIVAS -->
        <img id="anaHoloImg" class="ana-holo-img active" src="./Parpadeo.gif" alt="Ana Idle" />
        <img id="anaStaticImg" class="ana-holo-img" src="./ana-holographic.png" alt="Ana Action" />
        <!-- LABIOS PARA HABLA (Frame Based) -->
        <img id="anaTalkOpen" class="ana-holo-img" src="./labioabierto.png" alt="Ana Talk Open" />
        <img id="anaTalkHalf" class="ana-holo-img" src="./labiosemiabierto.png" alt="Ana Talk Half" />
        <img id="anaTalkClosed" class="ana-holo-img" src="./labiocerrado.png" alt="Ana Talk Closed" />
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
    this.currentSlide = 0; // 0=Idle(GIF), 1=Action(Static)
    this.currentPose = 'idle';
    this.render();
    this.startLifeCycle();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.slides = [
      document.getElementById('anaHoloImg'),
      document.getElementById('anaStaticImg'),
      document.getElementById('anaTalkOpen'),
      document.getElementById('anaTalkHalf'),
      document.getElementById('anaTalkClosed')
    ];

    this.updateSlides();
  }
  // El bucle manual de parpadeo ha sido reemplazado por Parpadeo.gif en el HTML

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

    this.lifeCycleInterval = setInterval(() => {
      t += (this.poseSpeed || 0.02);
      p += 0.15;

      const totalY = Math.sin(t) * 2;

      // Si está hablando, controlamos el frame del lip-sync (procedimiento de 3 imágenes)
      if (this.isSpeaking) {
        // En lugar de ciclo aleatorio, usamos el targetFrame definido por AssistantCore
        // El targetFrame se actualiza en tiempo real según el texto hablado
        if (this.targetMouthFrame !== undefined) {
          this.currentSlide = this.targetMouthFrame;
        } else {
          // Fallback a ciclo suave si no hay target directo
          const frameCycle = Math.floor(p * 1.2) % 3;
          this.currentSlide = 2 + frameCycle;
        }
        this.updateSlides();
      }

      // Aplicar movimiento de respiración
      if (this.avatarWrap) {
        this.avatarWrap.style.setProperty('--ana-anim-y', `${totalY}px`);

        // Efecto reactivo muy sutil al habla, solo glow, nada de distorsión de color
        const activeSlide = this.slides[this.currentSlide];
        if (activeSlide) {
          const glowColor = this.poseGlow || "rgba(0, 200, 255, 0.5)";
          const baseGlow = this.isSpeaking ? 15 : 10;
          const glow = baseGlow + Math.abs(Math.sin(p)) * 10;
          activeSlide.style.filter = `drop-shadow(0 0 ${glow}px ${glowColor})`;
        }
      }
    }, 32);
  }

  performBlink() {
    // This method is no longer used as blinking is handled by the slideshow
  }

  /**
   * Aplica un gesto basado en el formato JSON proporcionado
   */
  applyGesture(data) {
    if (!this.avatarWrap || !data.parametros) return;

    const p = data.parametros;
    const root = this.avatarWrap;

    // Mapeo selectivo de parámetros a variables CSS
    if (p.boca) {
      if (p.boca.apertura) root.style.setProperty('--ana-mouth-s', p.boca.apertura.escala);
      if (p.boca.curvatura) root.style.setProperty('--ana-mouth-y', `${p.boca.curvatura.escala * 10}px`);
    }

    if (p.mejillas && p.mejillas.elevacion) {
      root.style.setProperty('--ana-g-y', `-${p.mejillas.elevacion.escala * 5}px`);
    }

    if (p.ojos && p.ojos.cierre_parcial) {
      // Simular entrecerrar ojos mediante escala leve
      root.style.setProperty('--ana-g-scale', 1 + (p.ojos.cierre_parcial.escala * 0.05));
    }

    console.log(`[Ana] Gesto aplicado: ${data.gesto}`);

    // Si tiene duración, resetear después
    if (data.duracion) {
      const ms = parseFloat(data.duracion) * 1000;
      setTimeout(() => this.resetGestures(), ms);
    }
  }

  resetGestures() {
    if (!this.avatarWrap) return;
    const vars = ['--ana-g-scale', '--ana-g-x', '--ana-g-y', '--ana-mouth-s', '--ana-mouth-y'];
    vars.forEach(v => this.avatarWrap.style.removeProperty(v));
  }

  setPose(poseName) {
    this.currentPose = poseName;
    console.log(`[Ana] Cambiando pose a: ${poseName}`);

    // Limpiar clases de pose anteriores
    const poseClasses = ['pose-happy', 'pose-thinking', 'pose-serious'];
    if (this.avatarWrap) {
      this.avatarWrap.classList.remove(...poseClasses);
      this.resetGestures(); // Limpiar gestos dinámicos al cambiar de pose
      if (poseName !== 'idle') this.avatarWrap.classList.add(`pose-${poseName}`);
    }

    if (poseName === 'happy') {
      this.poseGlow = "rgba(255, 215, 0, 0.6)";
      this.poseSpeed = 0.04;
    } else if (poseName === 'thinking') {
      this.poseGlow = "rgba(0, 255, 255, 0.4)";
      this.poseSpeed = 0.01;
    } else if (poseName === 'serious') {
      this.poseGlow = "rgba(255, 60, 0, 0.6)";
      this.poseSpeed = 0.05;
    }

    // Si la pose no es idle, pasamos a la imagen estática
    if (poseName !== 'idle') {
      this.isPaused = true;
      this.currentSlide = 1;
    } else {
      this.isPaused = false;
      this.currentSlide = 0; // Vuelve al GIF
    }
    this.updateSlides();
  }

  setMouthShape(char) {
    if (!this.isSpeaking) return;
    const c = char.toLowerCase();
    // Mapeo pro: Vocales abiertas -> Open, Vocales cerradas -> Half, Otros -> Closed
    if (/[aeoáéó]/.test(c)) {
      this.targetMouthFrame = 2; // Open
    } else if (/[iuíú]/.test(c)) {
      this.targetMouthFrame = 3; // Half
    } else {
      this.targetMouthFrame = 4; // Closed
    }
  }

  startSpeaking() {
    this.isSpeaking = true;
    this.isPaused = true;
    this.targetMouthFrame = 4; // Empezamos cerrada

    if (this.avatarWrap) this.avatarWrap.classList.add('ana-speaking');
  }

  stopSpeaking() {
    this.isSpeaking = false;
    this.isPaused = false;
    this.targetMouthFrame = 4;

    // Limpiar clases visuales al callar
    if (this.avatarWrap) {
      this.avatarWrap.classList.remove('ana-speaking', 'pose-happy', 'pose-thinking', 'pose-serious');
    }
    this.setPose('idle');

    document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
  }
}
