import { useEffect, Suspense } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function LockedBox() {
  // Load the locally hosted chest model downloaded into public directory
  const { scene } = useGLTF('/chest.glb')

  useEffect(() => {
    // Iterate through meshes in GLTF tree to enable realistic shadows and reflections
    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        
        // Clean up materials for stable reflection
        const mesh = node as THREE.Mesh
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.envMapIntensity = 0.8
          mat.roughness = Math.max(mat.roughness, 0.2) // Keep a stable roughness
        }
      }
    })
  }, [scene])

  return (
    <RigidBody 
      colliders="cuboid" 
      position={[0, 5, 0]}
      rotation={[0.4, 0.3, 0.1]} // Initial rotation to make it tumble realistically
      restitution={0.35} // Nice heavy chest landing
      friction={0.7}
    >
      {/* Scaled optimally for the physics world */}
      <primitive object={scene} scale={45} />
    </RigidBody>
  )
}

function Floor() {
  return (
    <RigidBody type="fixed" friction={0.9} restitution={0.3}>
      {/* Floor Mesh */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#08080d" 
          roughness={0.5} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Decorative bounding frame */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.48, 0]} receiveShadow>
        <ringGeometry args={[7.8, 8, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
      </mesh>
    </RigidBody>
  )
}

export default function Scene() {
  return (
    <>
      {/* STABLE CONSTANT LIGHTING: Non-animated, balanced values */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[12, 15, 8]} 
        intensity={1.8} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        // Setting appropriate bias stops shadow flickering (shadow acne)
        shadow-bias={-0.0005}
      />
      <pointLight position={[-8, 3, -8]} intensity={0.5} color="#818cf8" />

      {/* Static background reflection profile */}
      <Environment preset="city" />

      {/* Real-time Physics World */}
      <Physics gravity={[0, -9.81, 0]}>
        <Floor />
        <Suspense fallback={null}>
          <LockedBox />
        </Suspense>
      </Physics>
      
      {/* Ground shadow casting for depth */}
      <ContactShadows
        position={[0, -2.49, 0]}
        opacity={0.5}
        scale={20}
        blur={2.5}
        far={8}
      />
    </>
  )
}

// Preload assets for rapid React Suspense hydration
useGLTF.preload('/chest.glb')
