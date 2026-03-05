/**
 * AnaCharacter.js - The Visual Component of Ana Evolution
 * Features the Premium "Evolution" SVG and Enhanced Animation Logic
 */

const ANA_SVG_TEMPLATE = `
<div class="avatar-wrap full-body-mode" id="anaAvatarWrap">
  <div class="avatar-aura" id="anaAvatarAura"></div>
  <div class="particle-container" id="anaParticleContainer"></div>
  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <svg viewBox="0 0 300 700" xmlns="http://www.w3.org/2000/svg" id="anaSvg" style="overflow:visible;">
      <defs>
        <!-- Skin Realism -->
        <radialGradient id="grad-skin" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff1e0" />
          <stop offset="45%" stop-color="#f5d0b0" />
          <stop offset="85%" stop-color="#d9966a" />
          <stop offset="100%" stop-color="#bf7a50" />
        </radialGradient>

        <!-- Silk Fabric -->
        <linearGradient id="grad-dress" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e0a3d" />
          <stop offset="50%" stop-color="#0f051a" />
          <stop offset="100%" stop-color="#050208" />
        </linearGradient>

        <linearGradient id="grad-dress-hl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#b06aff" stop-opacity="0.2" />
          <stop offset="50%" stop-color="#b06aff" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#b06aff" stop-opacity="0.1" />
        </linearGradient>

        <!-- Hair Details -->
        <linearGradient id="grad-hair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2b1408" />
          <stop offset="40%" stop-color="#1a0a04" />
          <stop offset="100%" stop-color="#0d0401" />
        </linearGradient>

        <filter id="rim-light">
          <feMorphology operator="dilate" radius="0.5" in="SourceAlpha" result="dilated" />
          <feGaussianBlur stdDeviation="3" in="dilated" result="blurred" />
          <feFlood flood-color="#b06aff" flood-opacity="0.4" />
          <feComposite in2="blurred" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>

      <!-- RENDER GROUP -->
      <g id="bodyGroup" filter="url(#rim-light)">
        
        <!-- Legs -->
        <g id="legsGroup">
          <g id="legL">
            <path d="M 115 450 Q 100 520 108 580 Q 115 640 112 660 L 132 660 Q 138 640 142 580 Q 148 520 140 450 Z" fill="url(#grad-skin)" />
            <ellipse cx="122" cy="580" rx="9" ry="5" fill="#c88060" opacity="0.2" />
          </g>
          <g id="legR">
            <path d="M 160 450 Q 175 520 168 580 Q 160 640 162 660 L 180 660 Q 185 640 190 580 Q 200 520 185 450 Z" fill="url(#grad-skin)" />
            <ellipse cx="178" cy="580" rx="9" ry="5" fill="#c88060" opacity="0.15" />
          </g>
        </g>

        <!-- Torso -->
        <g id="torsoGroup">
          <path d="M 100 250 C 85 300 95 400 100 450 L 200 450 C 205 400 215 300 200 250 C 190 200 110 200 100 250 Z" fill="url(#grad-dress)" />
          <path d="M 115 260 C 105 320 110 400 120 440" fill="none" stroke="url(#grad-dress-hl)" stroke-width="2.5" opacity="0.4" />
          <path d="M 185 260 C 195 320 190 400 180 440" fill="none" stroke="url(#grad-dress-hl)" stroke-width="2.5" opacity="0.4" />
          <path d="M 120 220 Q 150 270 180 220 L 180 200 Q 150 215 120 200 Z" fill="url(#grad-skin)" />
          <path d="M 150 218 L 150 245" stroke="#bf7a50" stroke-width="1.5" opacity="0.3" />
        </g>

        <!-- Arms -->
        <g id="armsGroup">
          <g id="armL">
              <path d="M 115 210 Q 80 225 65 300 Q 55 380 70 420" fill="none" stroke="url(#grad-skin)" stroke-width="12" stroke-linecap="round" />
              <path d="M 70 420 C 65 425 68 445 75 445 C 82 445 85 425 80 420 Z" fill="url(#grad-skin)" />
          </g>
          <g id="armR">
              <path d="M 185 210 Q 220 225 235 300 Q 245 380 230 420" fill="none" stroke="url(#grad-skin)" stroke-width="12" stroke-linecap="round" />
              <path d="M 230 420 C 235 425 232 445 225 445 C 218 445 215 425 220 420 Z" fill="url(#grad-skin)"/>
          </g>
        </g>

        <!-- Head & Hair -->
        <g id="headGroup">
          <rect x="138" y="175" width="24" height="45" rx="12" fill="url(#grad-skin)" />
          <path d="M 138 210 Q 150 225 162 210" fill="none" stroke="#bf7a50" stroke-width="2" opacity="0.2" />
          <path d="M 70 120 Q 70 30 150 25 Q 230 30 230 120 Q 225 180 210 220 L 90 220 Q 75 180 70 120 Z" fill="url(#grad-hair)" />
          <path d="M 105 100 Q 100 160 115 195 Q 130 225 150 225 Q 170 225 185 195 Q 200 160 195 100 Q 180 70 150 70 Q 120 70 105 100 Z" fill="url(#grad-skin)" />
          <g id="faceShading">
              <ellipse cx="125" cy="140" rx="18" ry="14" fill="#603010" opacity="0.08" />
              <ellipse cx="175" cy="140" rx="18" ry="14" fill="#603010" opacity="0.08" />
              <path d="M 148 140 Q 145 165 150 170 Q 155 165 152 140" fill="#603010" opacity="0.1" />
          </g>
          <g id="eyesGroup">
            <path d="M 112 135 Q 128 125 144 135" fill="none" stroke="#602040" stroke-width="6" opacity="0.1" />
            <path d="M 156 135 Q 172 125 188 135" fill="none" stroke="#602040" stroke-width="6" opacity="0.1" />
            <circle cx="128" cy="145" r="13" fill="#fff" />
            <circle cx="128" cy="145" r="8" fill="#7a5ce0" id="leftIris" /> 
            <circle cx="128" cy="145" r="4" fill="#000" id="leftPupil" />
            <circle cx="132" cy="141" r="2" fill="#fff" opacity="0.9" id="leftGlint" />
            <circle cx="172" cy="145" r="13" fill="#fff" />
            <circle cx="172" cy="145" r="8" fill="#7a5ce0" id="rightIris" />
            <circle cx="172" cy="145" r="4" fill="#000" id="rightPupil" />
            <circle cx="176" cy="141" r="2" fill="#fff" opacity="0.9" id="rightGlint" />
            <path d="M 112 138 Q 128 125 144 138" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" id="leftLash" />
            <path d="M 156 138 Q 172 125 188 138" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" id="rightLash" />
            <path d="M 112 125 Q 128 115 144 125" fill="none" stroke="#2b1408" stroke-width="4.5" stroke-linecap="round" id="leftBrow" />
            <path d="M 156 125 Q 172 115 188 125" fill="none" stroke="#2b1408" stroke-width="4.5" stroke-linecap="round" id="rightBrow" />
            <rect id="leftLid" x="110" y="130" width="36" height="0" fill="url(#grad-skin)" />
            <rect id="rightLid" x="154" y="130" width="36" height="0" fill="url(#grad-skin)" />
          </g>
          <g id="mouthGroup">
            <path id="upperLip" d="M 135 195 Q 150 188 165 195 Q 150 202 135 195 Z" fill="#d03060" />
            <path id="lowerLip" d="M 134 195 Q 150 210 166 195 Q 150 198 134 195 Z" fill="#b02048" />
            <ellipse id="mouthInner" cx="150" cy="200" rx="0" ry="0" fill="#2a0510" opacity="0.9"/>
            <rect id="teethTop" x="140" y="196" width="20" height="0" rx="2" fill="white" opacity="0.95"/>
            <ellipse cx="150" cy="202" rx="10" ry="3" fill="#fff" opacity="0.3" id="lipGloss" />
          </g>
          <!-- Hair Strands (short, reveals shoulders) -->
          <path d="M 105 100 Q 95 180 85 220" fill="none" stroke="url(#grad-hair)" stroke-width="4" opacity="0.8" />
          <path d="M 195 100 Q 205 180 215 220" fill="none" stroke="url(#grad-hair)" stroke-width="4" opacity="0.8" />
          <path d="M 150 70 Q 140 100 130 150" fill="none" stroke="#4a2a18" stroke-width="1.5" opacity="0.3" />
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

    // Elements
    this.avatarWrap = document.getElementById('anaAvatarWrap');
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

    // Main animation loop
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
    const c = Math.cos(t * pi2);
    const s2 = Math.sin(t * pi2 * 2);
    const absS = Math.abs(s);

    let headT = "";
    let bodyT = "";
    let armLT = "";
    let armRT = "";
    let legsT = "";

    // Reset origins
    this.head.style.transformOrigin = "150px 180px";
    this.body.style.transformOrigin = "150px 350px";
    this.armL.style.transformOrigin = "115px 210px";
    this.armR.style.transformOrigin = "185px 210px";
    this.legs.style.transformOrigin = "150px 450px";

    switch (this.anim) {
      case "idle":
        headT = `translateY(${s * 3}px) rotate(${s * 1}deg)`;
        bodyT = `translateY(${c * 1}px)`;
        armLT = `rotate(${s * 2}deg)`;
        armRT = `rotate(${-s * 2}deg)`;
        break;
      case "smile":
        headT = `scale(${1 + absS * 0.02}) translateY(${s * 2}px)`;
        bodyT = `rotate(${s * 0.5}deg)`;
        if (this.frame % 40 === 0) this.spawnEmoji("✨");
        break;
      case "dance":
        bodyT = `translateX(${s * 15}px) rotate(${s * 6}deg) translateY(${absS * -5}px)`;
        headT = `rotate(${-s * 3}deg) translateX(${-s * 5}px)`;
        armLT = `rotate(${s * 25 - 10}deg)`;
        armRT = `rotate(${-s * 25 + 10}deg)`;
        legsT = `skewX(${s * 8}deg)`;
        if (this.frame % 20 === 0) this.spawnEmoji(this.frame % 40 < 20 ? "🎵" : "🎶");
        break;
      case "runway":
        headT = `rotate(${s * 3}deg) translateY(${absS * -2}px)`;
        bodyT = `scale(${1 + absS * 0.015})`;
        armRT = `rotate(${-15 + s * 10}deg) translateX(${s * 2}px)`;
        armLT = `rotate(${10 + s * 5}deg)`;
        if (this.frame % 30 === 0) this.spawnEmoji("👠");
        break;
      case "wink":
        headT = `rotate(${s * 4}deg) scale(1.02)`;
        if (this.frame === 0) { this.spawnEmoji("😉"); this.blink(); }
        break;
      case "bow":
        bodyT = `scaleY(${1 - absS * 0.05}) translateY(${absS * 10}px)`;
        headT = `translateY(${absS * 15}px) rotate(${absS * 8}deg)`;
        break;
    }

    if (headT) this.head.style.transform = headT;
    if (bodyT) this.body.style.transform = bodyT;
    if (armLT) this.armL.style.transform = armLT;
    if (armRT) this.armR.style.transform = armRT;
    if (legsT) this.legs.style.transform = legsT;
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
    if (!this.leftLid || !this.rightLid) return;
    this.leftLid.setAttribute('height', '20');
    this.rightLid.setAttribute('height', '20');
    setTimeout(() => {
      this.leftLid.setAttribute('height', '0');
      this.rightLid.setAttribute('height', '0');
    }, 120);
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

    // Trigger Fluid Communication event
    document.dispatchEvent(new CustomEvent('anaFinishedSpeaking'));
  }

  startLipSync() {
    if (this.lipSyncInterval) clearInterval(this.lipSyncInterval);
    let p = 0;
    this.lipSyncInterval = setInterval(() => {
      p++;
      const open = Math.abs(Math.sin(p * 0.45)) * 0.8 + Math.abs(Math.sin(p * 0.1)) * 0.2;
      const rx = open * 18;
      const ry = open * 15;
      const tH = open * 8;
      const dropY = open * 12;

      if (this.mouthInner) {
        this.mouthInner.setAttribute('rx', rx.toFixed(1));
        this.mouthInner.setAttribute('ry', ry.toFixed(1));
        this.mouthInner.setAttribute('cy', (200 + dropY / 4).toFixed(1));
      }

      if (this.teethTop) {
        this.teethTop.setAttribute('height', open > 0.3 ? tH.toFixed(1) : "0");
        this.teethTop.setAttribute('width', (rx * 1.8).toFixed(1));
        this.teethTop.setAttribute('x', (150 - rx * 0.9).toFixed(1));
      }

      if (this.lowerLip) {
        this.lowerLip.setAttribute('d', `M 134 195 Q 150 ${210 + dropY} 166 195 Q 150 ${198 + dropY / 2} 134 195 Z`);
      }
    }, 60);
  }

  stopLipSync() {
    if (this.lipSyncInterval) { clearInterval(this.lipSyncInterval); this.lipSyncInterval = null; }
    if (this.mouthInner) { this.mouthInner.setAttribute('rx', '0'); this.mouthInner.setAttribute('ry', '0'); }
    if (this.teethTop) this.teethTop.setAttribute('height', '0');
    if (this.lowerLip) this.lowerLip.setAttribute('d', 'M 134 195 Q 150 210 166 195 Q 150 198 134 195 Z');
  }
}
