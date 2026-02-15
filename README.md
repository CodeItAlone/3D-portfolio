<p align="center">
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</p>

# 🌌 3D Interactive Developer Portfolio

A stunning, immersive developer portfolio built with **Three.js** — featuring a Milky Way galaxy, an orbiting solar system, glassmorphism UI, and scroll-driven camera navigation that takes you on a journey through space.

> **[Live Demo →](https://portfolio.subratokundu.in/)** · **[Report Bug →](https://github.com/CodeItAlone/PORTFOLIO/issues)** · **[Request Feature →](https://github.com/CodeItAlone/PORTFOLIO/issues)**

---

## ✨ Highlights

| Feature | Description |
|---------|-------------|
| 🌀 **Milky Way Galaxy** | Procedurally generated spiral galaxy with 19,000+ particles — warm central bulge, logarithmic spiral arms, disk haze, and core glow |
| ☀️ **Solar System** | Full solar system behind the About section — Sun with pulsating glow, 8 orbiting planets (with Saturn's ring!), faint orbit trails, and an asteroid belt |
| 🚀 **Deep-Space Scroll** | Section-snapped scroll navigation that flies the camera through the solar system, creating an immersive "going deeper into space" experience |
| 🔮 **Glassmorphism UI** | Frosted-glass overlay cards with backdrop-filter blur, semi-transparent backgrounds, and subtle border glow effects |
| 🎯 **Adaptive Quality** | Auto-detects device capability and scales particle counts, antialiasing, and pixel ratio for optimal performance across devices |
| ♿ **Accessibility** | Full keyboard navigation, reduced-motion toggle, semantic HTML, ARIA attributes, and `prefers-reduced-motion` support |

---

## 🏗️ Architecture

```
PORTFOLIO/
├── index.html              # Entry point — all HTML structure, import maps, section overlays
├── js/
│   ├── main.js             # Three.js scene, 3D objects, camera system, animation loop, UI logic
│   └── data.js             # Skills & projects data (single source of truth)
├── styles/
│   ├── index.css           # Design tokens, reset, canvas, loader, utilities
│   ├── overlay.css         # Section overlays, glass cards, hero, about, skills, projects, contact
│   └── ui.css              # Navbar, section indicators, project modal, responsive breakpoints
└── README.md
```

### Design Decisions

- **Zero build step.** The entire app runs with native ES modules via `importmap` — no bundler, no transpiler, no `node_modules`. Three.js and GSAP are loaded from CDN.
- **Section-snapped camera.** Instead of scrolling DOM, the camera lerps between predefined z-positions. Each scroll event advances one section, with a cooldown to prevent over-scrolling.
- **Layered rendering.** 3D objects live in the Three.js canvas (z-index: 0); glassmorphism HTML overlays sit on top (z-index: 10); navigation chrome floats above everything (z-index: 100).

---

## 🚀 Getting Started

### Prerequisites

A modern browser with WebGL support (Chrome, Firefox, Edge, Safari 15+). No Node.js required.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/CodeItAlone/PORTFOLIO.git
cd PORTFOLIO

# Serve with any static server — pick one:
npx -y serve .                    # Node.js
python -m http.server 3000        # Python 3
```

Open **http://localhost:3000** in your browser.

> **Note:** Opening `index.html` directly via `file://` will not work due to ES module CORS restrictions. You must use a local HTTP server.

---

## 🎮 Navigation

| Input | Action |
|-------|--------|
| **Scroll** (mouse wheel) | Navigate between sections |
| **Swipe** (touch) | Navigate on mobile |
| **Arrow keys** / **Page Up/Down** | Keyboard navigation |
| **Home** / **End** | Jump to first / last section |
| **1–5** keys | Jump to specific section |
| **Nav links** | Click to navigate |
| **Right-side dots** | Section indicators (hover for labels) |
| ⚡ **Motion toggle** | Disable all 3D animations for accessibility |

---

## 🌍 Sections

### 1. Home — Milky Way Galaxy
Procedurally generated spiral galaxy with:
- **4 logarithmic spiral arms** with color gradients (warm core → cool blue outer)
- **Central bulge** with oblate spheroid distribution
- **Diffuse disk haze** between arms
- **Core glow** with dual-layered mesh

### 2. About — Solar System
Full solar system visible behind the glassmorphism about card:
- **Sun** with 3-layer additive glow and pulsation animation
- **8 planets** orbiting at different speeds, each with emissive glow
- **Saturn's ring** — tilted `RingGeometry` with double-sided material
- **Asteroid belt** — particle system between Mars and Jupiter
- **Orbit trails** — faint ring geometry for each planet

### 3. Skills — Floating Orbs
Color-coded skill orbs orbiting a central dodecahedron:
- 🟣 Frontend (purple) · 🟢 Backend (green) · 🟡 Tools (yellow)
- Hover any skill tag for level tooltip

### 4. Projects — Interactive Cards
3D floating card planes + glassmorphism HTML cards:
- Click any card to open the detail modal with tech stack, GitHub link, and live demo

### 5. Contact — Particle Grid
Pulsating dot grid with contact links (GitHub, LinkedIn, Email).

---

## ⚡ Performance

The app auto-detects device capability and scales accordingly:

| Tier | Cores | Galaxy Particles | Asteroid Belt | DPR | Antialiasing |
|------|-------|------------------|---------------|-----|-------------|
| **High** | 5+ | 19,000 | 600 | native (≤2) | ✅ |
| **Medium** | 3–4 | 11,000 | 300 | native (≤2) | ✅ |
| **Low** | ≤2 / mobile | 5,500 | 150 | 1 | ❌ |

### Optimization Techniques
- `AdditiveBlending` with `depthWrite: false` for all particle systems
- `sizeAttenuation` for distance-based particle scaling
- Exponential fog (`FogExp2`) to cull distant geometry
- `will-change: opacity, transform` on overlay transitions
- Scroll cooldown and transition locking to prevent input flooding

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Three.js](https://threejs.org/) v0.160 | 3D rendering, scene graph, materials, particle systems |
| [GSAP](https://greensock.com/gsap/) v3.12 | (Available for future animation enhancements) |
| Vanilla JavaScript | ES modules, event handling, DOM manipulation |
| CSS3 | Glassmorphism, responsive layout, custom properties, keyframe animations |
| HTML5 | Semantic markup, ARIA accessibility, `importmap` for module resolution |

---

## 📝 Customization

### Adding/Editing Projects & Skills

All content lives in [`js/data.js`](js/data.js) — edit the exported arrays:

```javascript
// Add a new project
export const projects = [
  {
    title: 'My New Project',
    description: 'A brief description of the project.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/...',
    liveUrl: 'https://...',    // set to null if no live demo
  },
  // ...existing projects
];
```

### Adjusting 3D Scene

Key constants in `js/main.js`:

```javascript
const CAMERA_POSITIONS = [...]     // Camera z-positions per section
const LERP_SPEED = 0.04;           // Camera transition smoothness
const GALAXY = { ... };            // Galaxy particle counts, arm count, radius
const planetData = [ ... ];        // Planet sizes, colors, orbit speeds
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/CodeItAlone/PORTFOLIO/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ☕ and <a href="https://threejs.org">Three.js</a> by <strong>Subrato Kundu</strong>
</p>
