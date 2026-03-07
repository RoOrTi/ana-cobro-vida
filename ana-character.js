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
  
  /* <--- COORDENADAS MAGNÉTICAS FIJAS ---> */
  transform-origin: 50% 50%;
  transform: scale(2.5) translate(0px, 30px);
  
  filter:
    drop-shadow(0 0 18px rgba(0, 200, 255, 0.30))
    saturate(1.15) brightness(1.08); /* Colores radiantes, cero interferencias */
    
  /* Recorte suave del contorno para fundir la silueta mágicamente con el panel oscuro */
  -webkit-mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 75% 85% at 50% 50%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%);
  
  pointer-events: none;
}

/* Base siempre visible */
#anaHoloImg {
  opacity: 1; 
}

/* Capa de ojos cerrados que transiciona encima */
#anaBlinkImg {
  opacity: 0;
  transition: opacity 1s ease-in-out; /* Transición muy suave hacia la 2da imagen */
}

#anaBlinkImg.active {
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
        <img id="anaHoloImg" class="ana-holo-img active" src="./ana-holographic.png" alt="Ana Holographic Avatar" />
        <!-- BLINK LAYER: Ojos Cerrados -->
        <img id="anaBlinkImg" class="ana-holo-img" src="./ana-blink.png" alt="Ana Blinking" />
      </div>
    </div>
  </div>
</div>
`;

class AnaCharacter {
  constructor(container) {
    this.container = container;
    this.lipSyncInterval = null;
    this.slideshowInterval = null;
    this.isSpeaking = false;
    this.render();
    this.startSlideshow();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.holoImgWrap = document.getElementById('anaImgWrap');
    this.holoImg = document.getElementById('anaHoloImg'); // Ojos Abiertos
    this.blinkImg = document.getElementById('anaBlinkImg'); // Ojos Cerrados
  }

  startSlideshow() {
    // La imagen de ojos abiertos (holoImg) SIEMPRE está ahí. Su opacidad no cambia.
    // Nosotros simplemente mostramos suavemente la de "ojos cerrados" por encima de ella.
    let showClosedEyes = false;

    // Inicia asegurando que la capa blinkImg está oculta (transparente)
    if (this.blinkImg) this.blinkImg.classList.remove('active');

    this.slideshowInterval = setInterval(() => {
      showClosedEyes = !showClosedEyes;

      if (showClosedEyes) {
        if (this.blinkImg) this.blinkImg.classList.add('active');
      } else {
        if (this.blinkImg) this.blinkImg.classList.remove('active');
      }
    }, 5000);
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
