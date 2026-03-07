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
  padding: 80px; /* Margen de 80px en todos los lados */
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
  transform-origin: bottom center;
  z-index: 2;
}

@keyframes ana-sequence-breathe {
  /* Escala 1 para ver el cuerpo entero proporcionalmente */
  0%, 100% { transform: scale(1) scaleY(1)    scaleX(1);    } 
  25%, 75% { transform: scale(1) scaleY(1.015) scaleX(1.005); } 
  50%      { transform: scale(1) scaleY(1.03)  scaleX(1.015);  } 
}

/* MAIN IMAGE BASE */
.ana-holo-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain; /* Contain asegura que nunca se recorte la cabeza ni los bordes */
  object-position: center; /* Centrado perfecto */
  filter:
    drop-shadow(0 0 18px rgba(0, 200, 255, 0.30))
    saturate(1.15) brightness(1.08); /* Colores radiantes, cero interferencias */
    
  /* Recorte suave del contorno para fundir la silueta mágicamente con el panel oscuro */
  -webkit-mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  
  transition: opacity 0.1s ease-out, filter 0.1s ease-out, transform 0.1s ease-out;
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
        <img id="anaHoloImg" class="ana-holo-img" src="./ana-holographic.png" alt="Ana Holographic Avatar" />
      </div>
    </div>
  </div>
</div>
`;

class AnaCharacter {
  constructor(container) {
    this.container = container;
    this.lipSyncInterval = null;
    this.isSpeaking = false;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.holoImgWrap = document.getElementById('anaImgWrap');
    this.holoImg = document.getElementById('anaHoloImg');
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
