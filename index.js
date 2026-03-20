/* ════════════════════════════════════════════
   CHRONO — PLASMA CLOCK  |  script.js
   ════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. PLASMA CANVAS BACKGROUND
   ────────────────────────────────────────── */
const canvas = document.getElementById('plasma-canvas');
const ctx    = canvas.getContext('2d');
let   W, H, t = 0;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Palette for plasma */
function plasmaColor(val) {
  // val 0..1
  const r = Math.sin(val * Math.PI * 2 + 0.0) * 0.5 + 0.5;
  const g = Math.sin(val * Math.PI * 2 + 2.1) * 0.5 + 0.5;
  const b = Math.sin(val * Math.PI * 2 + 4.2) * 0.5 + 0.5;
  // Map to neon palette: cyan/pink/purple
  const rr = Math.round((r * 0.3 + b * 0.2) * 60);
  const gg = Math.round(r * 80 + g * 50);
  const bb = Math.round(g * 0.3 * 60 + b * 150 + r * 30);
  return `rgb(${rr},${gg},${bb})`;
}

function drawPlasma() {
  const cols = 80, rows = 50;
  const cellW = W / cols, cellH = H / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = x / cols, cy = y / rows;

      const v1 = Math.sin(cx * 6 + t * 0.4);
      const v2 = Math.sin(cy * 5 - t * 0.3);
      const v3 = Math.sin((cx + cy) * 4 + t * 0.5);
      const v4 = Math.sin(Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2) * 12 - t * 0.6);
      const v  = (v1 + v2 + v3 + v4 + 4) / 8;

      ctx.fillStyle = plasmaColor(v);
      ctx.fillRect(x * cellW, y * cellH, cellW + 1, cellH + 1);
    }
  }

  // Overlay to keep it dark & subtle
  ctx.fillStyle = 'rgba(3,2,15,0.88)';
  ctx.fillRect(0, 0, W, H);

  t += 0.012;
  requestAnimationFrame(drawPlasma);
}
drawPlasma();


/* ──────────────────────────────────────────
   2. PARTICLE SPARK SYSTEM
   ────────────────────────────────────────── */
class Particle {
  constructor() { this.reset(true); }

  reset(random = false) {
    this.x  = Math.random() * W;
    this.y  = random ? Math.random() * H : H + 10;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.8 + 0.2);
    this.life   = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.size    = Math.random() * 2 + 0.4;
    const palette = ['#00f5d4','#00b4d8','#f72585','#7b2fff','#f8e44a'];
    this.color   = palette[Math.floor(Math.random() * palette.length)];
    this.alpha   = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    this.alpha = 1 - (this.life / this.maxLife);
    if (this.life >= this.maxLife || this.y < -10) this.reset();
  }

  draw(c) {
    c.save();
    c.globalAlpha = this.alpha * 0.7;
    c.shadowBlur  = 8;
    c.shadowColor = this.color;
    c.fillStyle   = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

// Second canvas for particles (on top of plasma)
const pCanvas = document.createElement('canvas');
pCanvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;';
document.body.insertBefore(pCanvas, document.body.firstChild);
const pCtx = pCanvas.getContext('2d');

function resizeParticleCanvas() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

const PARTICLE_COUNT = window.innerWidth < 480 ? 40 : 80;
const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (const p of particles) {
    p.update();
    p.draw(pCtx);
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ──────────────────────────────────────────
   3. CUSTOM CURSOR
   ────────────────────────────────────────── */
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');

cursorDot.style.cssText = `
  position:fixed;width:6px;height:6px;background:#00f5d4;
  border-radius:50%;pointer-events:none;z-index:9999;
  transform:translate(-50%,-50%);transition:transform .1s;
  box-shadow:0 0 8px #00f5d4,0 0 20px rgba(0,245,212,.6);
  mix-blend-mode:screen;
`;
cursorRing.style.cssText = `
  position:fixed;width:28px;height:28px;border:1px solid rgba(0,245,212,.5);
  border-radius:50%;pointer-events:none;z-index:9998;
  transform:translate(-50%,-50%);transition:transform .18s ease,width .3s,height .3s;
`;
document.body.append(cursorDot, cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left  = mx + 'px';
  cursorDot.style.top   = my + 'px';
});

(function animateCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();


/* ──────────────────────────────────────────
   4. DIGIT FLIP ENGINE
   ────────────────────────────────────────── */
const slots = {
  h1: document.getElementById('h1'),
  h2: document.getElementById('h2'),
  m1: document.getElementById('m1'),
  m2: document.getElementById('m2'),
  s1: document.getElementById('s1'),
  s2: document.getElementById('s2'),
};

// Track current displayed values
const displayed = { h1: -1, h2: -1, m1: -1, m2: -1, s1: -1, s2: -1 };

function getSlotParts(slot) {
  return {
    prev: slot.querySelector('.digit-prev'),
    curr: slot.querySelector('.digit-curr'),
  };
}

function setDigit(slotId, newVal) {
  if (displayed[slotId] === newVal) return;

  const slot  = slots[slotId];
  const parts = getSlotParts(slot);

  // Stage new value as invisible curr
  parts.curr.textContent = newVal;
  parts.prev.textContent = displayed[slotId] < 0 ? newVal : displayed[slotId];

  // Reset in case previous animation still running
  slot.classList.remove('morphing');
  // Force reflow
  void slot.offsetWidth;

  // Trigger morph
  slot.classList.add('morphing');

  slot.addEventListener('animationend', function handler() {
    parts.prev.textContent = newVal;
    parts.prev.style.transform  = '';
    parts.prev.style.opacity    = '';
    parts.curr.style.transform  = 'translateY(100%)';
    parts.curr.style.opacity    = '0';
    slot.classList.remove('morphing');
    slot.removeEventListener('animationend', handler);
  }, { once: true });

  // Emit a burst of sparks on digit change
  burstSparks(slot);

  displayed[slotId] = newVal;
}

/* Emit sparks near a digit slot when it changes */
function burstSparks(slotEl) {
  const rect   = slotEl.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const count  = 6;

  for (let i = 0; i < count; i++) {
    const p    = particles[Math.floor(Math.random() * particles.length)];
    p.x        = cx + (Math.random() - 0.5) * rect.width;
    p.y        = cy + (Math.random() - 0.5) * rect.height * 0.5;
    p.vx       = (Math.random() - 0.5) * 2.5;
    p.vy       = -(Math.random() * 2.5 + 1);
    p.life     = 0;
    p.maxLife  = 60 + Math.random() * 40;
    p.size     = Math.random() * 2.5 + 1;
  }
}


/* ──────────────────────────────────────────
   5. SECONDS PROGRESS BAR
   ────────────────────────────────────────── */
const progressLine = document.getElementById('seconds-progress');
const TRACK_LEN    = 400;

function updateProgress(seconds) {
  const ratio  = seconds / 59;
  const offset = TRACK_LEN * (1 - ratio);
  progressLine.style.strokeDashoffset = offset;

  // Change color as seconds progress
  if (ratio < 0.33) {
    progressLine.style.stroke = '#00f5d4';
    progressLine.style.filter = 'drop-shadow(0 0 4px #00f5d4) drop-shadow(0 0 10px rgba(0,245,212,.5))';
  } else if (ratio < 0.66) {
    progressLine.style.stroke = '#00b4d8';
    progressLine.style.filter = 'drop-shadow(0 0 4px #00b4d8) drop-shadow(0 0 10px rgba(0,180,216,.5))';
  } else {
    progressLine.style.stroke = '#f72585';
    progressLine.style.filter = 'drop-shadow(0 0 4px #f72585) drop-shadow(0 0 10px rgba(247,37,133,.5))';
  }
}


/* ──────────────────────────────────────────
   6. DATE & TIME UPDATE LOOP
   ────────────────────────────────────────── */
const dateDisplay = document.getElementById('date-display');
const tzDisplay   = document.getElementById('tz-display');
const ampmDisplay = document.getElementById('ampm-display');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function pad(n)  { return String(n).padStart(2, '0'); }
function d1(n)   { return Math.floor(n / 10); }
function d2(n)   { return n % 10; }

let lastSec = -1;

function tick() {
  const now  = new Date();
  const h24  = now.getHours();
  const min  = now.getMinutes();
  const sec  = now.getSeconds();
  const ms   = now.getMilliseconds();

  if (sec === lastSec) {
    requestAnimationFrame(tick);
    return;
  }
  lastSec = sec;

  // 12-hour
  const h12  = h24 % 12 || 12;
  const ampm = h24 < 12 ? 'AM' : 'PM';

  // Update digits
  setDigit('h1', d1(h12));
  setDigit('h2', d2(h12));
  setDigit('m1', d1(min));
  setDigit('m2', d2(min));
  setDigit('s1', d1(sec));
  setDigit('s2', d2(sec));

  // Progress
  updateProgress(sec);

  // Date info
  const day  = DAYS[now.getDay()];
  const date = now.getDate();
  const mon  = MONTHS[now.getMonth()];
  const yr   = now.getFullYear();
  dateDisplay.textContent = `${day}, ${mon} ${date} ${yr}`;

  // Timezone
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  tzDisplay.textContent   = tzName.replace('_', ' ');
  ampmDisplay.textContent = ampm;

  requestAnimationFrame(tick);
}
tick();


/* ──────────────────────────────────────────
   7. COLON GLOW SYNC (extra beat feel)
   ────────────────────────────────────────── */
// Already handled by CSS animation, but we flash them pink on each minute
const colon1 = document.getElementById('colon1');
const colon2 = document.getElementById('colon2');
let lastMin   = -1;

setInterval(() => {
  const m = new Date().getMinutes();
  if (m !== lastMin) {
    lastMin = m;
    [colon1, colon2].forEach(c => {
      c.querySelectorAll('.colon-dot').forEach(d => {
        d.style.background  = '#f72585';
        d.style.boxShadow   = '0 0 12px #f72585, 0 0 40px rgba(247,37,133,.5)';
        setTimeout(() => {
          d.style.background  = '';
          d.style.boxShadow   = '';
        }, 800);
      });
    });
  }
}, 1000);


/* ──────────────────────────────────────────
   8. CLOCK CARD MOUSE PARALLAX
   ────────────────────────────────────────── */
const clockShell = document.querySelector('.clock-shell');

document.addEventListener('mousemove', e => {
  if (window.innerWidth < 768) return; // skip on mobile
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;  // -1 to 1
  const dy = (e.clientY - cy) / cy;

  const rx2 = dy * -8;
  const ry2 = dx *  8;
  clockShell.style.transform = `perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  clockShell.style.transition = 'transform 0.12s ease-out';
});

document.addEventListener('mouseleave', () => {
  clockShell.style.transform  = 'perspective(900px) rotateX(0) rotateY(0)';
  clockShell.style.transition = 'transform 0.6s ease-out';
});


/* ──────────────────────────────────────────
   9. RESIZE — re-count particles
   ────────────────────────────────────────── */
window.addEventListener('resize', () => {
  // Adjust particle count based on screen size
  const target = window.innerWidth < 480 ? 40 : 80;
  while (particles.length < target) particles.push(new Particle());
});


/* ──────────────────────────────────────────
   10. TOUCH RIPPLE for mobile
   ────────────────────────────────────────── */
document.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;
    left:${touch.clientX}px;
    top:${touch.clientY}px;
    width:8px;height:8px;
    background:transparent;
    border:1.5px solid rgba(0,245,212,0.7);
    border-radius:50%;
    transform:translate(-50%,-50%) scale(1);
    pointer-events:none;
    z-index:9999;
    animation:touchRipple .7s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}, { passive: true });

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes touchRipple {
    from { transform:translate(-50%,-50%) scale(1); opacity:.8; }
    to   { transform:translate(-50%,-50%) scale(8); opacity:0; }
  }
`;
document.head.appendChild(style);