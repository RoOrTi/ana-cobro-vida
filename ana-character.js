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

/* ✦ RESPIRACIÓN VOLUMÉTRICA EN CSS (Secuencia 1-2-3-2-1) ✦ */
.ana-holo-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ana-sequence-breathe 4s ease-in-out infinite; 
  transform-origin: 50% 50%; /* <--- CENTRO ORIGEN (X=50% Y=50%) */
  z-index: 2;
}

@keyframes ana-sequence-breathe {
  /* <--- COORDENADAS MAGNÉTICAS ---> 
     scale(2.5) = Zoom Base (2.5x)
     translate(0px, 30px) = Eje(X, Y). Valores Positivos en Y bajan la imagen, Negativos la suben.
  */
  0%, 100% { transform: scale(2.5) translate(0px, 30px) scaleY(1)    scaleX(1);    } 
  25%, 75% { transform: scale(2.5) translate(0px, 30px) scaleY(1.015) scaleX(1.005); } 
  50%      { transform: scale(2.5) translate(0px, 30px) scaleY(1.03)  scaleX(1.015);  } 
}

/* MAIN IMAGE BASE */
.ana-holo-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain; /* <--- ENCUADRE: Contain impide recortes, Cover rellena ignorando bordes */
  object-position: 50% 50%; /* <--- POSICIÓN INTERNA: (X=50% Y=50%) */
  filter:
    drop-shadow(0 0 18px rgba(0, 200, 255, 0.30))
    saturate(1.15) brightness(1.08); /* Colores radiantes, cero interferencias */
    
  /* Recorte suave del contorno para fundir la silueta mágicamente con el panel oscuro */
  -webkit-mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  
  transition: opacity 0.1s ease-out, filter 0.1s ease-out, transform 0.1s ease-out;
}

/* BLINK LAYER OVERLAY */
.ana-blink-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  opacity: 0;
  transition: opacity 0.05s ease-in-out !important; /* Más rápido para parpadeo vivo */
  pointer-events: none;
}
.ana-blink-layer.active {
  opacity: 1;
}

/* SPEAKING STATE */
.ana-speaking .ana-holo-img {
  filter:
    drop-shadow(0 0 35px rgba(0, 220, 255, 0.60))
    saturate(1.3) brightness(1.20);
}
</style>

<div class="avatar-wrap full-body-mode" id="anaAvatarWrap">
  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <div class="ana-holo-wrap">
      <div class="ana-holo-img-wrap" id="anaImgWrap">
        <!-- BASE: Ojos Abiertos -->
        <img id="anaHoloImg" class="ana-holo-img" src="./ana-holographic.png" alt="Ana Holographic Avatar" />
        <!-- BLINK LAYER: Ojos Cerrados (Mismo ajuste) -->
        <img id="anaBlinkImg" class="ana-holo-img ana-blink-layer" src="./ana-blink.png" alt="Ana Blinking" />
      </div>
    </div>
  </div>
</div>
`;

class AnaCharacter {
  constructor(container) {
    this.container = container;
    this.lipSyncInterval = null;
    this.blinkTimeout = null;
    this.isSpeaking = false;
    this.render();
    this.scheduleBlink();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.holoImgWrap = document.getElementById('anaImgWrap');
    this.holoImg = document.getElementById('anaHoloImg');
    this.blinkImg = document.getElementById('anaBlinkImg');
  }

  scheduleBlink() {
    // Frecuencia natural: parpadeo entre 2.5s y 7.5s
    const next = 2500 + Math.random() * 5000;
    this.blinkTimeout = setTimeout(() => {
      this.blink();
      this.scheduleBlink();
    }, next);
  }

  blink() {
    if (this.blinkImg) {
      // Activa capa de ojos cerrados
      this.blinkImg.classList.add('active');
      // La desactiva rápidamente (150ms equivale a un parpadeo de humano descansado)
      setTimeout(() => this.blinkImg.classList.remove('active'), 150);
    }
  }

  startSpeaking() {
    this.isSpeaking = true;
    if (this.avatarWrap) this.avatarWrap.classList.add('ana-speaking');
    this.startLipSync();
  }

  stopSpeaking() {
    this.isSpeaking = false;
    if (this.avatarWrap) this.avatarWrap.classList.remove('ana-speaking');
    this.stopLipSync();
    document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
  }

  startLipSync() {
    if (this.lipSyncInterval) clearInterval(this.lipSyncInterval);
    let p = 0;
    this.lipSyncInterval = setInterval(() => {
      p++;
      const open = Math.abs(Math.sin(p * 0.45)) * 0.8 + Math.abs(Math.sin(p * 0.1)) * 0.2;
      if (this.holoImg) {
        // Resonancia biológica del habla sin perturbar el rostro
        this.holoImg.style.filter = `
          drop-shadow(0 0 ${20 + open * 20}px rgba(0, 220, 255, 0.70))
          saturate(${1.15 + open * 0.4}) brightness(${1.08 + open * 0.2})
        `;
        this.holoImg.style.transform = `translateY(${open * -2}px)`;
      }
    }, 60);
  }

  stopLipSync() {
    if (this.lipSyncInterval) { clearInterval(this.lipSyncInterval); this.lipSyncInterval = null; }
    if (this.holoImg) {
      this.holoImg.style.filter = '';
      this.holoImg.style.transform = '';
    }
  }
}
