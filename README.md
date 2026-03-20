# ⏱️ CHRONO — Plasma Clock

> A visually immersive digital clock built with pure HTML, CSS, and JavaScript. No frameworks, no dependencies — just living neon animations, a plasma background, and fluid digit morphing that makes telling time feel cinematic.

![CHRONO Clock Preview](https://img.shields.io/badge/HTML-CSS-JS-neon?style=for-the-badge&color=00f5d4)
![License](https://img.shields.io/badge/license-MIT-pink?style=for-the-badge&color=f72585)
![Responsive](https://img.shields.io/badge/responsive-all%20devices-blue?style=for-the-badge&color=00b4d8)

---

## ✨ Features

### 🌊 Living Plasma Background
A real-time animated plasma field rendered on an HTML5 Canvas using layered sine-wave mathematics. The background shifts and breathes continuously with a deep neon color palette — no GIFs, no videos, pure code.

### 💧 Liquid Digit Morphing
Every digit change triggers a fluid morph animation — digits melt upward with blur, scale easing, and a chromatic glitch burst. It feels like mercury flowing through glass, not a basic flip clock.

### 🌟 Reactive Particle System
80 glowing neon sparks float upward across the screen at all times. When a digit changes, a burst of particles erupts from that exact digit's location, tying the visual system directly to the clock's rhythm.

### 🔮 Rotating Conic-Gradient Border
The clock card is framed by a continuously rotating rainbow neon border built with `conic-gradient` and CSS `@property` animation — cycling through cyan, pink, purple, and yellow.

### 🖱️ 3D Mouse Parallax
Move your cursor and the entire clock card tilts in 3D space using CSS `perspective` transforms, tracking your mouse in real time for a holographic depth effect.

### ⏱️ Seconds Progress Bar
A glowing SVG line beneath the clock fills up second by second, shifting color from cyan → blue → pink as the minute progresses.

### 🎯 Custom Neon Cursor
A dual-layer custom cursor: a sharp dot that snaps to position instantly, and a ring that lags behind with smooth lerp interpolation for a premium feel.

### 📱 Touch Ripple (Mobile)
Tapping anywhere on a touch screen creates an expanding neon ripple from the touch point.

### 💓 Pulse Rings & Glowing Colons
Expanding pulse rings emanate from behind the clock. The colon dots flash pink on every new minute to mark the hour's rhythm.

---

## 📁 File Structure

```
chrono-clock/
├── index.html    # Markup — clock structure, canvas, info bar
├── style.css     # All styling — animations, layout, responsive rules
├── script.js     # Logic — plasma engine, particle system, time loop, parallax
└── README.md     # You are here
```

---

## 🚀 Getting Started

No build tools. No npm. No config. Just open and run.

**Option 1 — Direct open:**
Download all three files into the same folder and open `index.html` in any modern browser.

**Option 2 — Live Server (VS Code):**
Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html`, and select **Open with Live Server**.

**Option 3 — GitHub Pages:**
Push the repo to GitHub and enable Pages under `Settings → Pages → Deploy from branch (main / root)`. Your clock will be live at `https://yourusername.github.io/repo-name`.

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome 89+ | ✅ Full |
| Edge 89+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 15.4+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

> **Note:** The rotating conic-gradient border uses CSS `@property` which requires Chrome 89+ / Edge 89+ / Safari 15.4+. On older browsers it degrades gracefully — the clock still works, just without the spinning border.

---

## 📐 Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| 1400px+ | Large desktop — maximum digit size (9rem × 13rem) |
| 900px–1400px | Standard desktop / laptop — fluid scaling |
| 480px–900px | Tablet — scaled-down digits, adjusted gaps |
| 360px–480px | Mobile portrait — compact layout, wrapped info bar |
| < 360px | Very small phones — minimum sizes enforced |
| Landscape / short height | Reduced digit height, tighter gaps |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--neon-cyan` | `#00f5d4` | Primary digits, glow, cursor |
| `--neon-blue` | `#00b4d8` | Progress bar mid-state |
| `--neon-pink` | `#f72585` | Accent, border rotation, minute flash |
| `--neon-yellow` | `#f8e44a` | AM/PM display |
| `--neon-purple` | `#7b2fff` | Border rotation, orb-3 |
| `--bg-deep` | `#03020f` | Page background |
| `--digit-font` | Orbitron | Clock digits |
| `--ui-font` | Exo 2 | Labels, date, info bar |

---

## ⚙️ Customization

**Change clock to 24-hour format:**
In `script.js`, replace the `h12` line:
```js
// Replace this:
const h12 = h24 % 12 || 12;
// With this:
const h12 = h24;
```
And remove or hide the `#ampm-display` element.

**Change the color palette:**
Edit the CSS variables at the top of `style.css` inside `:root { }`. All colors, glows, and shadows cascade from those six variables.

**Adjust particle count:**
In `script.js`, find this line and change the numbers:
```js
const PARTICLE_COUNT = window.innerWidth < 480 ? 40 : 80;
```

**Slow down or speed up the plasma:**
In `script.js`, find the plasma animation loop and change the speed increment:
```js
t += 0.012; // increase for faster, decrease for slower
```

---

## ♿ Accessibility

Respects `prefers-reduced-motion`. When the user has reduced motion enabled in their OS settings, all animations (digit morphing, colons, orbs, pulse rings, rotating border) are disabled and the clock displays statically with no visual distraction.

---

## 📜 License

MIT License — free to use, modify, and distribute for personal and commercial projects. Attribution appreciated but not required.

---

## 🙌 Credits

- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron) & [Exo 2](https://fonts.google.com/specimen/Exo+2) via Google Fonts
- Built entirely with vanilla HTML, CSS, and JavaScript — zero dependencies

---

<div align="center">
  <strong>Made with ❤️ and lots of ☕ by Shashank Baxi</strong>
</div>
