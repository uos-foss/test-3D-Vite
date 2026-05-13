# Antigravity 3D Engine Showcase

A high-fidelity 3D physics playground featuring real-time rigid-body dynamics, static studio-grade lighting, and dynamic GLTF asset integration. Built on **React 19** and leveraging the GPU-driven **@react-three/fiber** stack with the high-performance **Rapier** physics core.

---

## ✨ Core Features

- **🎮 High-Fidelity Physics Engine**: Harnesses `@react-three/rapier` to drive real-world mass, friction, gravity, and restitution dynamics. Watch the chest tumble naturally and settle with realistic weight.
- **📦 GLTF / GLB Pipeline**: Fully modular 3D loading pipeline utilizing React 19 native `<Suspense>` wrapping. Assets are streamed locally from `/public` avoiding external network latency.
- **💡 Rock-Solid Studio Lighting**: Calibrated `directionalLight` mapping with static env-presets and specialized negative shadow-bias (`-0.0005`) configuration to eliminate shadow acne and flicker artifacts.
- **🎭 Premium Glassmorphism UX**: Dark-mode HUD with ultra-sharp typography (Outfit font), backdrop-filter blurs, ambient glowing borders, and integrated active tech badges.
- **🎥 Free-Roam Orbit Controls**: Intuitively pivot, pan, and zoom to explore details of the settled mesh from any angle.

---

## 🛠 Tech Stack

| Component | Library / Tool |
| :--- | :--- |
| **Framework** | React 19.0.0 |
| **Tooling & Bundler** | Vite |
| **3D Render Wrapper** | `@react-three/fiber` v9.6.1 |
| **3D Abstraction Utilities** | `@react-three/drei` v10.7.7 |
| **Physics Core** | `@react-three/rapier` v2.2.0 |
| **3D Library Underlying** | `three` |
| **Styling** | Modern Vanilla CSS3 (Flexbox, Variables, Glassmorphism) |

---

## 🚀 Getting Started

### 1. Installation

Clone the project and install the locked dependencies using Node Package Manager:

```bash
npm install
```

### 2. Development Server

Spin up the instantaneous local HMR (Hot Module Replacement) server:

```bash
npm run dev
```
The application will render locally at [http://localhost:5173/](http://localhost:5173/).

### 3. Production Bundle

Build the highly optimized and minified distribution bundle:

```bash
npm run build
```

---

## 📂 Code Architecture

The project is organized cleanly to separate the DOM layer from the 3D Canvas layer:

- **[`src/App.tsx`](file:///Users/hadriancawthorne/Documents/test-3D-Vite/src/App.tsx)**: Core entry component initializing the WebGL `<Canvas>`, global environment variables, `OrbitControls`, and absolute-positioned HTML Dashboard layer overlays.
- **[`src/components/Scene.tsx`](file:///Users/hadriancawthorne/Documents/test-3D-Vite/src/components/Scene.tsx)**: Holds the complete 3D world description. Manages dynamic `<Physics>` bounds, static ambient lighting, `<Floor />` geometry, and `<LockedBox />` GLTF loader component.
- **[`src/index.css`](file:///Users/hadriancawthorne/Documents/test-3D-Vite/src/index.css)**: The design tokens and styling engine. Handles full-bleed canvas initialization, pointer event configurations, and custom keyframes.
- **[`public/chest.glb`](file:///Users/hadriancawthorne/Documents/test-3D-Vite/public/chest.glb)**: The localized 3D geometry asset representing the physical locked chest.

---

Developed with 💜 using Antigravity.
