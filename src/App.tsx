import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './components/Scene'

function App() {
  return (
    <>
      {/* 3D Viewport Layer */}
      <div className="canvas-container">
        <Canvas 
          shadows 
          camera={{ position: [0, 2, 6], fov: 45 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#0a0a0f']} />
          
          <Scene />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={false} // Turned off auto-rotate for direct focused stable viewing
          />
        </Canvas>
      </div>

      {/* Web/UI HTML Layer */}
      <div className="overlay">
        <header>
          <h1>Antigravity</h1>
          <p className="subtitle">High-fidelity 3D space featuring a physical GLTF asset engine.</p>
          <div className="tech-stack">
            <span className="badge highlight">React 19</span>
            <span className="badge highlight">GLTF Asset</span>
            <span className="badge">Rapier</span>
            <span className="badge">Three.js</span>
          </div>
        </header>
        
        <div className="controls-hint">
          <span className="dot"></span>
          <span>Left click + drag to orbit • Scroll to zoom</span>
        </div>
      </div>
    </>
  )
}

export default App
