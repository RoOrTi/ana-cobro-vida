/**
 * AnaCharacter.js - The Visual Component of Ana Evolution
 * Holographic Image-Based Avatar — Cortana Style
 */

const ANA_SVG_TEMPLATE = `
<style>
/* ══════════════════════════════════════════
   ANA HOLOGRAPHIC IMAGE AVATAR — CORTANA STYLE
   ══════════════════════════════════════════ */

.ana-holo-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: visible;
}

/* BASE IMAGE */
.ana-holo-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter:
    drop-shadow(0 0 18px rgba(0, 200, 255, 0.70))
    drop-shadow(0 0 40px rgba(100, 60, 255, 0.45))
    drop-shadow(0 0 80px rgba(0, 180, 255, 0.25))
    saturate(1.15) brightness(1.08);
  animation: ana-float 5s ease-in-out infinite;
  z-index: 2;
}

@keyframes ana-float {
  0%, 100% { transform: translateY(0px) scale(1);      }
  50%       { transform: translateY(-10px) scale(1.01); }
}

/* SCAN LINE OVERLAY */
.ana-holo-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 220, 255, 0.028) 3px,
    rgba(0, 220, 255, 0.028) 4px
  );
  pointer-events: none;
  z-index: 3;
  border-radius: 8px;
}

/* SWEEP SCAN LINE */
.ana-holo-scan {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0, 229, 255, 0.6) 30%,
    rgba(124, 77, 255, 0.8) 50%,
    rgba(0, 229, 255, 0.6) 70%,
    transparent 100%
  );
  filter: blur(1px);
  animation: scan-sweep 4s linear infinite;
  z-index: 5;
  pointer-events: none;
}

@keyframes scan-sweep {
  0%   { top: -2px;  opacity: 0; }
  5%   {             opacity: 1; }
  95%  {             opacity: 1; }
  100% { top: 100%;  opacity: 0; }
}

/* EDGE ENERGY GLOW RING */
.ana-holo-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50% 50% 40% 40%;
  background: transparent;
  box-shadow:
    0 0 30px 8px  rgba(0, 200, 255, 0.25),
    0 0 60px 16px rgba(100, 60, 255, 0.15),
    inset 0 0 25px rgba(0, 200, 255, 0.08);
  animation: glow-pulse 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 30px 8px rgba(0,200,255,0.25), 0 0 60px 16px rgba(100,60,255,0.15);
  }
  50% {
    box-shadow: 0 0 45px 14px rgba(0,200,255,0.42), 0 0 90px 24px rgba(100,60,255,0.28);
  }
}

/* BOTTOM PLATFORM LIGHT */
.ana-holo-platform {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 18px;
  background: radial-gradient(ellipse, rgba(0,229,255,0.55) 0%, rgba(100,60,255,0.20) 50%, transparent 75%);
  filter: blur(4px);
  animation: platform-pulse 3s ease-in-out infinite;
  z-index: 4;
  pointer-events: none;
}

@keyframes platform-pulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1);    }
  50%       { opacity: 1.0; transform: translateX(-50%) scaleX(1.12); }
}

/* FLOATING ENERGY PARTICLES */
.ana-holo-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  overflow: hidden;
}

.holo-particle {
  position: absolute;
  border-radius: 50%;
  animation: particle-float linear infinite;
  filter: blur(0.5px);
}

@keyframes particle-float {
  0%   { transform: translateY(0) scale(1);      opacity: 0; }
  10%  { opacity: 1;                                          }
  90%  { opacity: 1;                                          }
  100% { transform: translateY(-320px) scale(0.4); opacity: 0; }
}

/* SPEAKING STATE — enhanced glow */
.ana-speaking .ana-holo-img {
  filter:
    drop-shadow(0 0 25px rgba(0, 220, 255, 0.90))
    drop-shadow(0 0 55px rgba(180, 100, 255, 0.60))
    saturate(1.4) brightness(1.20);
}

.ana-speaking .ana-holo-glow {
  animation: glow-pulse 0.9s ease-in-out infinite;
}

/* POSE ANIMATIONS applied to the whole image wrapper */
.pose-dance    .ana-holo-img { animation: ana-float 5s ease-in-out infinite, ana-dance 0.8s ease-in-out infinite; }
.pose-runway   .ana-holo-img { animation: ana-float 5s ease-in-out infinite, ana-sway 1.2s ease-in-out infinite;  }
.pose-hypnotic .ana-holo-wrap { animation: hypnotic-holo 4s ease-in-out infinite; }

@keyframes ana-dance {
  0%, 100% { transform: translateX(0)    translateY(0)    rotate(0deg);   }
  25%       { transform: translateX(-8px) translateY(-5px) rotate(-3deg);  }
  75%       { transform: translateX(8px)  translateY(-5px) rotate(3deg);   }
}

@keyframes ana-sway {
  0%, 100% { transform: rotate(-1deg) scale(1);    }
  50%       { transform: rotate(1deg)  scale(1.02); }
}

@keyframes hypnotic-holo {
  0%, 100% { filter: hue-rotate(0deg);    }
  50%       { filter: hue-rotate(30deg);   }
}
</style>

<div class="avatar-wrap full-body-mode" id="anaAvatarWrap">
  <div class="avatar-aura" id="anaAvatarAura"></div>
  <div class="particle-container" id="anaParticleContainer"></div>

  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <div class="ana-holo-wrap">

      <!-- Glow halo behind image -->
      <div class="ana-holo-glow"></div>

      <!-- ✦ MAIN HOLOGRAPHIC IMAGE ✦ -->
      <img
        id="anaHoloImg"
        class="ana-holo-img"
        src="./ana-holographic.png"
        alt="Ana Holographic Avatar"
      />

      <!-- Sweep scan line -->
      <div class="ana-holo-scan"></div>

      <!-- Ground platform glow -->
      <div class="ana-holo-platform"></div>

      <!-- Floating energy particles -->
      <div class="ana-holo-particles" id="anaHoloParticles">
        <div class="holo-particle" style="width:3px;height:3px;background:#00e5ff;left:20%;bottom:10%;animation-duration:4.2s;animation-delay:0s;"></div>
        <div class="holo-particle" style="width:2px;height:2px;background:#7c4dff;left:35%;bottom:5%;animation-duration:3.8s;animation-delay:0.8s;"></div>
        <div class="holo-particle" style="width:3px;height:3px;background:#00c8ff;left:55%;bottom:15%;animation-duration:5.1s;animation-delay:1.5s;"></div>
        <div class="holo-particle" style="width:2px;height:2px;background:#a040ff;left:70%;bottom:8%;animation-duration:4.6s;animation-delay:0.3s;"></div>
        <div class="holo-particle" style="width:2px;height:2px;background:#00e5ff;left:80%;bottom:22%;animation-duration:3.5s;animation-delay:2.1s;"></div>
        <div class="holo-particle" style="width:3px;height:3px;background:#60d0ff;left:12%;bottom:30%;animation-duration:6.0s;animation-delay:1.0s;"></div>
        <div class="holo-particle" style="width:2px;height:2px;background:#ff60d8;left:88%;bottom:40%;animation-duration:5.5s;animation-delay:3.0s;"></div>
        <div class="holo-particle" style="width:2px;height:2px;background:#00e5ff;left:45%;bottom:2%;animation-duration:4.0s;animation-delay:1.8s;"></div>
      </div>

    </div>

    <!-- HIDDEN SVG: preserves all JS animation hooks (blink, lip-sync, poses) -->
    <svg width="0" height="0" style="position:absolute;pointer-events:none;visibility:hidden;" id="anaSvg">
      <g id="bodyGroup">
        <g id="legsGroup"><g id="legL"></g><g id="legR"></g></g>
        <g id="torsoGroup"></g>
        <g id="armsGroup"><g id="armL"></g><g id="armR"></g></g>
        <g id="headGroup">
          <g id="eyesGroup">
            <rect id="leftLid"   x="0" y="0" width="0" height="0"/>
            <rect id="rightLid"  x="0" y="0" width="0" height="0"/>
            <circle id="leftPupil"  cx="0" cy="0" r="0"/>
            <circle id="rightPupil" cx="0" cy="0" r="0"/>
          </g>
          <g id="mouthGroup">
            <path    id="upperLip"  d=""/>
            <path    id="lowerLip"  d=""/>
            <ellipse id="mouthInner" cx="0" cy="0" rx="0" ry="0"/>
            <rect    id="teethTop"   x="0" y="0" width="0" height="0"/>
          </g>
        </g>
      </g>
    </svg>
  </div>
</div>

<div class="voice-viz" id="anaVoiceViz">
  <div class="voice-bar" style="height: 10px;"></div>
  <div class="voice-bar" style="height: 20px;"></div>
  <div class="voice-bar" style="height: 30px;"></div>
  <div class="voice-bar" style="height: 25px;"></div>
  <div class="voice-bar" style="height: 15px;"></div>
</div>
`;

class AnaCharacter {
  constructor(container) {
    this.container = container;
    this.anim = "idle";
    this.frame = 0;
    this.isAuto = true;
    this.lipSyncInterval = null;
    this.blinkTimeout = null;
    this.autoCycleInterval = null;
    this.frameInterval = null;
    this.isSpeaking = false;

    this.animations = ["idle", "smile", "dance", "runway", "wink", "bow"];

    this.render();
    this.initExpressiveness();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;

    // Main wrapper
    this.avatarWrap = document.getElementById('anaAvatarWrap');
    // Hidden SVG hooks (for blink / lip-sync compatibility)
    this.head = document.getElementById('headGroup');
    this.body = document.getElementById('bodyGroup');
    this.armL = document.getElementById('armL');
    this.armR = document.getElementById('armR');
    this.legs = document.getElementById('legsGroup');
    this.mouthInner = document.getElementById('mouthInner');
    this.teethTop = document.getElementById('teethTop');
    this.lowerLip = document.getElementById('lowerLip');
    this.leftLid = document.getElementById('leftLid');
    this.rightLid = document.getElementById('rightLid');
    this.particleContainer = document.getElementById('anaParticleContainer');
    this.voiceViz = document.getElementById('anaVoiceViz');
    // Image reference for glitch effects
    this.holoImg = document.getElementById('anaHoloImg');
  }

  initExpressiveness() {
    this.scheduleBlink();

    // Auto cycle animations
    this.autoCycleInterval = setInterval(() => {
      if (this.isAuto && !this.isSpeaking) {
        const next = this.animations[Math.floor(Math.random() * this.animations.length)];
        this.setAnim(next);
      }
    }, 5000);

    // Main animation loop (drives pose + particles)
    this.frameInterval = setInterval(() => {
      this.frame = (this.frame + 1) % 120;
      this.updateFrame();
    }, 40);
  }

  setAnim(a) {
    this.anim = a;
    this.setPose(a);
  }

  updateFrame() {
    const t = this.frame / 120;
    const pi2 = Math.PI * 2;
    const s = Math.sin(t * pi2);
    const absS = Math.abs(s);

    // Spawn emoji particles for expressive poses
    switch (this.anim) {
      case "smile":
        if (this.frame % 40 === 0) this.spawnEmoji("✨");
        break;
      case "dance":
        if (this.frame % 20 === 0) this.spawnEmoji(this.frame % 40 < 20 ? "🎵" : "🎶");
        break;
      case "runway":
        if (this.frame % 30 === 0) this.spawnEmoji("👠");
        break;
      case "wink":
        if (this.frame === 0) { this.spawnEmoji("😉"); this.triggerGlitch(); }
        break;
    }

    // Apply gentle floating offset to the holo wrap for image-based poses
    if (this.holoImg) {
      if (this.anim === "bow") {
        this.holoImg.style.transform = `translateY(${absS * 12}px) rotate(${absS * 3}deg)`;
      } else {
        this.holoImg.style.transform = '';
      }
    }
  }

  triggerGlitch() {
    if (!this.holoImg) return;
    this.holoImg.classList.add('glitch');
    setTimeout(() => this.holoImg.classList.remove('glitch'), 200);
  }

  spawnEmoji(char) {
    if (!this.particleContainer) return;
    const el = document.createElement('div');
    el.className = 'particle-emoji';
    el.innerText = char;
    el.style.left = `${Math.random() * 80 + 10}%`;
    el.style.top = `20%`;
    this.particleContainer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  scheduleBlink() {
    const next = 2500 + Math.random() * 5000;
    this.blinkTimeout = setTimeout(() => {
      this.blink();
      this.scheduleBlink();
    }, next);
  }

  blink() {
    // For image avatar: trigger a quick opacity flicker on the image
    if (this.holoImg) {
      this.holoImg.style.opacity = '0.6';
      setTimeout(() => { if (this.holoImg) this.holoImg.style.opacity = ''; }, 90);
    }
    // Keep SVG lid hooks working if they ever reference real elements
    if (this.leftLid) this.leftLid.setAttribute('height', '0');
    if (this.rightLid) this.rightLid.setAttribute('height', '0');
  }

  setPose(pose) {
    if (!this.avatarWrap) return;
    const poses = ['thinking', 'happy', 'serious', 'presenter', 'hypnotic', 'idle', 'smile', 'dance', 'runway', 'wink', 'bow'];
    poses.forEach(p => this.avatarWrap.classList.remove(`pose-${p}`));
    this.avatarWrap.classList.add(`pose-${pose}`);
  }

  startSpeaking() {
    this.isSpeaking = true;
    if (this.avatarWrap) this.avatarWrap.classList.add('ana-speaking');
    if (this.voiceViz) this.voiceViz.classList.add('active');
    this.startLipSync();
    this.setAnim("smile");
  }

  stopSpeaking() {
    this.isSpeaking = false;
    if (this.avatarWrap) this.avatarWrap.classList.remove('ana-speaking');
    if (this.voiceViz) this.voiceViz.classList.remove('active');
    this.stopLipSync();
    document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
  }

  startLipSync() {
    if (this.lipSyncInterval) clearInterval(this.lipSyncInterval);
    let p = 0;
    this.lipSyncInterval = setInterval(() => {
      p++;
      const open = Math.abs(Math.sin(p * 0.45)) * 0.8 + Math.abs(Math.sin(p * 0.1)) * 0.2;

      // For image-based: animate glow intensity to simulate talking
      if (this.holoImg) {
        const glow = 18 + open * 22;
        const glow2 = 40 + open * 30;
        this.holoImg.style.filter = `
          drop-shadow(0 0 ${glow}px rgba(0,220,255,${0.7 + open * 0.3}))
          drop-shadow(0 0 ${glow2}px rgba(180,100,255,${0.4 + open * 0.3}))
          saturate(${1.15 + open * 0.25}) brightness(${1.08 + open * 0.15})
        `;
      }

      // SVG hooks (kept for compatibility)
      if (this.mouthInner) {
        this.mouthInner.setAttribute('rx', (open * 18).toFixed(1));
        this.mouthInner.setAttribute('ry', (open * 15).toFixed(1));
      }
      if (this.teethTop) this.teethTop.setAttribute('height', open > 0.3 ? (open * 8).toFixed(1) : "0");
      if (this.lowerLip) this.lowerLip.setAttribute('d', `M 134 195 Q 150 ${210 + open * 12} 166 195 Q 150 ${198 + open * 6} 134 195 Z`);
    }, 60);
  }

  stopLipSync() {
    if (this.lipSyncInterval) { clearInterval(this.lipSyncInterval); this.lipSyncInterval = null; }
    if (this.holoImg) this.holoImg.style.filter = '';
    if (this.mouthInner) { this.mouthInner.setAttribute('rx', '0'); this.mouthInner.setAttribute('ry', '0'); }
    if (this.teethTop) this.teethTop.setAttribute('height', '0');
    if (this.lowerLip) this.lowerLip.setAttribute('d', 'M 134 195 Q 150 210 166 195 Q 150 198 134 195 Z');
  }
}
