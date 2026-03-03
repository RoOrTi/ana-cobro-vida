/**
 * AnaCharacter.js - The Visual Component of Ana
 * Includes the SVG Avatar and LipSync Logic
 */

const ANA_SVG_TEMPLATE = `
<div class="avatar-wrap" id="anaAvatarWrap">
  <div class="avatar-aura" id="anaAvatarAura"></div>
  <div class="avatar-ring"></div>
  <div class="avatar-svg-wrap" id="anaAvatarSvg">
    <svg viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" id="anaSvg">
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#f5d5b0"/>
          <stop offset="100%" stop-color="#e8b88a"/>
        </radialGradient>
        <radialGradient id="hairGrad" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stop-color="#f0d060"/>
          <stop offset="50%" stop-color="#d4a830"/>
          <stop offset="100%" stop-color="#b8860b"/>
        </radialGradient>
        <radialGradient id="eyeGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#5aa0d8"/>
          <stop offset="100%" stop-color="#2a6090"/>
        </radialGradient>
        <radialGradient id="bgAvatarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1a1a3e"/>
          <stop offset="100%" stop-color="#0a0a1a"/>
        </radialGradient>
        <radialGradient id="lipGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#e88098"/>
          <stop offset="100%" stop-color="#c05070"/>
        </radialGradient>
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="shadow-filter">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="280" height="340" fill="url(#bgAvatarGrad)"/>
      <g id="bodyGroup">
        <rect x="118" y="240" width="44" height="50" rx="10" fill="url(#skinGrad)"/>
        <ellipse cx="140" cy="310" rx="110" ry="50" fill="#1a1030"/>
        <path d="M 60 305 Q 90 260 118 255 L 118 275 Q 100 280 80 340 Z" fill="#2a1a4a"/>
        <path d="M 220 305 Q 190 260 162 255 L 162 275 Q 180 280 200 340 Z" fill="#2a1a4a"/>
        <path d="M 80 340 Q 100 290 118 275 L 162 275 Q 180 290 200 340 Z" fill="#2a1a4a"/>
        <ellipse cx="140" cy="258" rx="18" ry="3" fill="none" stroke="#c9a96e" stroke-width="1.5" opacity="0.8"/>
        <circle cx="140" cy="258" r="3" fill="#c9a96e"/>
      </g>
      <g id="headGroup">
        <ellipse cx="140" cy="130" rx="90" ry="105" fill="url(#hairGrad)" opacity="0.9"/>
        <ellipse cx="140" cy="165" rx="78" ry="92" fill="url(#skinGrad)" id="faceBase"/>
        <path d="M 62 130 Q 50 80 62 50 Q 80 20 110 18 Q 140 14 170 18 Q 200 20 218 50 Q 230 80 218 130 Q 200 100 180 95 Q 160 90 140 92 Q 120 90 100 95 Q 80 100 62 130 Z" fill="url(#hairGrad)"/>
        <path d="M 70 80 Q 140 60 210 80" fill="none" stroke="url(#hairHighlight)" stroke-width="4" opacity="0.4" stroke-linecap="round"/>
        <path d="M 62 130 Q 45 160 48 200 Q 52 230 60 255 Q 70 220 68 190 Q 66 165 72 148 Z" fill="url(#hairGrad)"/>
        <path d="M 218 130 Q 235 160 232 200 Q 228 230 220 255 Q 210 220 212 190 Q 214 165 208 148 Z" fill="url(#hairGrad)"/>
        <path d="M 100 138 Q 115 130 128 134" stroke="#c8900a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 152 134 Q 165 130 180 138" stroke="#c8900a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        
        <g id="eyesWrap">
          <g id="leftEye">
            <ellipse cx="114" cy="158" rx="14" ry="10" fill="white" filter="url(#shadow-filter)"/>
            <circle cx="114" cy="158" r="8" fill="url(#eyeGrad)"/>
            <circle cx="115" cy="159" r="5" fill="#0a1520" id="leftPupil"/>
            <circle cx="116" cy="156" r="2.5" fill="white" opacity="0.8"/>
            <circle cx="113" cy="160" r="1" fill="white" opacity="0.4"/>
            <rect id="leftLid" x="100" y="148" width="28" height="0" fill="url(#skinGrad)"/>
          </g>
          <g id="rightEye">
            <ellipse cx="166" cy="158" rx="14" ry="10" fill="white" filter="url(#shadow-filter)"/>
            <circle cx="166" cy="158" r="8" fill="url(#eyeGrad)"/>
            <circle cx="167" cy="159" r="5" fill="#0a1520" id="rightPupil"/>
            <circle cx="168" cy="156" r="2.5" fill="white" opacity="0.8"/>
            <circle cx="165" cy="160" r="1" fill="white" opacity="0.4"/>
            <rect id="rightLid" x="152" y="148" width="28" height="0" fill="url(#skinGrad)"/>
          </g>
        </g>

        <g id="mouthGroup">
          <path id="upperLip" d="M 118 213 Q 127 208 140 210 Q 153 208 162 213 Q 153 215 140 215 Q 127 215 118 213 Z" fill="url(#lipGrad)"/>
          <path id="lowerLip" d="M 118 213 Q 127 222 140 224 Q 153 222 162 213 Q 153 216 140 217 Q 127 216 118 213 Z" fill="url(#lipGrad)"/>
          <path id="mouthLine" d="M 118 213 Q 130 215 140 214 Q 150 215 162 213" stroke="#a04060" stroke-width="1" fill="none" opacity="0.7"/>
          <ellipse id="mouthInner" cx="140" cy="217" rx="0" ry="0" fill="#1a0510" opacity="0.8"/>
          <rect id="teethTop" x="128" y="214" width="24" height="0" rx="2" fill="white" opacity="0.9"/>
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
    this.lipSyncInterval = null;
    this.blinkTimeout = null;
    this.render();
    this.initIdleAnimations();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = ANA_SVG_TEMPLATE;
    this.mouthInner = document.getElementById('mouthInner');
    this.teethTop = document.getElementById('teethTop');
    this.lowerLip = document.getElementById('lowerLip');
    this.voiceViz = document.getElementById('anaVoiceViz');
    this.avatarWrap = document.getElementById('anaAvatarWrap');
    this.leftLid = document.getElementById('leftLid');
    this.rightLid = document.getElementById('rightLid');
    this.head = document.getElementById('headGroup');
    this.body = document.getElementById('bodyGroup');
  }

  initIdleAnimations() {
    this.scheduleBlink();
    this.startBreathing();
  }

  scheduleBlink() {
    const nextBlink = 2000 + Math.random() * 4000;
    this.blinkTimeout = setTimeout(() => {
      this.blink();
      this.scheduleBlink();
    }, nextBlink);
  }

  blink() {
    if (!this.leftLid || !this.rightLid) return;
    this.leftLid.setAttribute('height', '12');
    this.rightLid.setAttribute('height', '12');
    setTimeout(() => {
      this.leftLid.setAttribute('height', '0');
      this.rightLid.setAttribute('height', '0');
    }, 150);
  }

  startBreathing() {
    // Add breathing animation to head and body via CSS
    if (this.head) this.head.style.transition = 'transform 3s ease-in-out';
    if (this.body) this.body.style.transition = 'transform 3s ease-in-out';

    let up = true;
    setInterval(() => {
      const ty = up ? -2 : 0;
      const sy = up ? 1.01 : 1;
      if (this.head) this.head.style.transform = `translateY(${ty}px)`;
      if (this.body) this.body.style.transform = `scaleY(${sy})`;
      up = !up;
    }, 3000);
  }

  setPose(pose) {
    if (!this.avatarWrap) return;
    this.avatarWrap.classList.remove('pose-thinking', 'pose-happy', 'pose-serious');
    if (pose) this.avatarWrap.classList.add(`pose-${pose}`);
  }

  startSpeaking() {
    this.avatarWrap.classList.add('emotion-talking');
    this.voiceViz.classList.add('active');
    this.startLipSync();
  }

  stopSpeaking() {
    this.avatarWrap.classList.remove('emotion-talking');
    this.voiceViz.classList.remove('active');
    this.stopLipSync();
  }

  startLipSync() {
    if (this.lipSyncInterval) clearInterval(this.lipSyncInterval);
    let phase = 0;
    this.lipSyncInterval = setInterval(() => {
      phase += 1;
      const openAmount = Math.abs(Math.sin(phase * 0.4)) * 0.7 + Math.abs(Math.sin(phase * 0.7)) * 0.3;
      const rx = openAmount * 14;
      const ry = openAmount * 8;
      const teethH = openAmount * 5;

      if (this.mouthInner) {
        this.mouthInner.setAttribute('rx', rx.toFixed(1));
        this.mouthInner.setAttribute('ry', ry.toFixed(1));
      }

      if (this.teethTop && openAmount > 0.2) {
        this.teethTop.setAttribute('height', (teethH).toFixed(1));
        this.teethTop.setAttribute('x', (140 - rx + 2).toFixed(1));
        this.teethTop.setAttribute('width', ((rx * 2) - 4).toFixed(1));
      } else if (this.teethTop) {
        this.teethTop.setAttribute('height', '0');
      }

      if (this.lowerLip && openAmount > 0.1) {
        const dropY = openAmount * 6;
        this.lowerLip.setAttribute('d', `M 118 213 Q 127 ${222 + dropY} 140 ${224 + dropY} Q 153 ${222 + dropY} 162 213 Q 153 216 140 217 Q 127 216 118 213 Z`);
      }
    }, 80);
  }

  stopLipSync() {
    if (this.lipSyncInterval) {
      clearInterval(this.lipSyncInterval);
      this.lipSyncInterval = null;
    }
    if (this.mouthInner) { this.mouthInner.setAttribute('rx', '0'); this.mouthInner.setAttribute('ry', '0'); }
    if (this.teethTop) { this.teethTop.setAttribute('height', '0'); }
    if (this.lowerLip) { this.lowerLip.setAttribute('d', 'M 118 213 Q 127 222 140 224 Q 153 222 162 213 Q 153 216 140 217 Q 127 216 118 213 Z'); }
  }
}
