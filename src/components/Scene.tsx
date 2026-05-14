import { useEffect, useLayoutEffect, Suspense, useRef, useState } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'
import { ContactShadows, Environment, useTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function BigButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const [hovered, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  
  // References to animate meshes smoothly in useFrame
  const buttonCapRef = useRef<THREE.Mesh>(null)
  const buttonMaterialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Change cursor icon when hovering the button
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  // Smoothly animate position and emissive intensity 60 times a second (no state lag!)
  useFrame((_state, delta) => {
    if (!buttonCapRef.current || !buttonMaterialRef.current) return

    // Target values based on interaction states
    const targetY = pressed ? -1.9 : -1.7   // Sinks down when pressed
    const targetGlow = hovered ? 2.5 : 0.8 // Glows brighter on hover
    
    // 1. Smoothly transition position (lerp)
    buttonCapRef.current.position.y = THREE.MathUtils.lerp(
      buttonCapRef.current.position.y, 
      targetY, 
      1 - Math.exp(-15 * delta) // Framerate-independent lerp
    )

    // 2. Smoothly transition material glow intensity
    buttonMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      buttonMaterialRef.current.emissiveIntensity,
      targetGlow,
      1 - Math.exp(-10 * delta)
    )
  })

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={[0, -0.5, 0]}>
        
        {/* 1. Button Base (Heavy metallic ring) */}
        <mesh position={[0, -2.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.4, 2.6, 0.8, 32]} />
          <meshStandardMaterial 
            color="#1f2937" 
            roughness={0.1} 
            metalness={0.9} 
          />
        </mesh>

        {/* 2. Interactive Button Cap (Animated, Glows) */}
        <mesh
          ref={buttonCapRef}
          position={[0, -1.7, 0]} // Starts extended upwards
          castShadow
          receiveShadow
          onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
          onPointerOut={(e) => { e.stopPropagation(); setHover(false); setPressed(false) }}
          onPointerDown={(e) => { e.stopPropagation(); setPressed(true) }}
          onPointerUp={(e) => { 
            e.stopPropagation()
            setPressed(false)
            onClick() // Fire toggle function passed from Scene!
          }}
        >
          <cylinderGeometry args={[2.0, 2.0, 0.6, 32]} />
          <meshStandardMaterial
            ref={buttonMaterialRef}
            color={active ? "#10b981" : "#ef4444"}          // Emerald Green when Active, Ruby Red when Inactive
            emissive={active ? "#6ee7b7" : "#fca5a5"}       // Glowing color match
            emissiveIntensity={0.8}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* 3. Floating Text Indicator above the button */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.35}
          color={active ? "#6ee7b7" : "#fca5a5"}
          anchorX="center"
          anchorY="middle"
        >
          {hovered 
            ? (active ? "DEACTIVATE" : "ACTIVATE!") 
            : (active ? "SPOTLIGHT ON" : "SPOTLIGHT OFF")}
        </Text>
      </group>
    </RigidBody>
  )
}

function Floor() {
  // 1. Load the textures from the public folder (using the actual JPG images)
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/herringbone_brick/textures/herringbone_brick_03_diff_1k.jpg',
    '/herringbone_brick/textures/herringbone_brick_03_nor_gl_1k.jpg',
    '/herringbone_brick/textures/herringbone_brick_03_arm_1k.jpg'
  ])

  // 2. Make the textures repeat/tile nicely without crashing
  useLayoutEffect(() => {
    [colorMap, normalMap, roughnessMap].forEach((t) => {
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.RepeatWrapping
      t.repeat.set(12, 12) // Tile 12x12
      t.needsUpdate = true // Inform Three.js to re-process the wrapping mode
    })
  }, [colorMap, normalMap, roughnessMap])

  return (
    <RigidBody type="fixed" friction={0.9} restitution={0.3}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          map={colorMap}          // The brick colors
          normalMap={normalMap}  // The 3D bumpiness
          aoMap={roughnessMap}   // Deep shadow detail
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}

export default function Scene() {
  const [spotlightOn, setSpotlightOn] = useState(false)

  return (
    <>
      {/* STABLE CONSTANT LIGHTING: Non-animated, balanced values */}
      <ambientLight intensity={spotlightOn ? 0.3 : 0.7} /> {/* Dim room slightly when spotlight is on */}
      
      <directionalLight
        position={[12, 15, 8]}
        intensity={spotlightOn ? 0.8 : 1.8} // Make main light dimmer for dramatic effect
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-8, 3, -8]} intensity={0.5} color="#818cf8" />

      {/* Dramatic top-down Spotlight that triggers when active */}
      {spotlightOn && (
        <spotLight
          position={[0, 10, 0]} // Up in the sky, directly centered above button
          angle={0.45}           // Semi-tight cone
          penumbra={0.6}        // Soft, natural beam dispersion
          intensity={350}       // Intense theatrical luminance
          castShadow
          color="#60a5fa"       // Deep cool Blue-Cyan vibe
          distance={25}
          decay={2}
          shadow-bias={-0.0001}
        />
      )}

      {/* Static background reflection profile */}
      <Environment preset="city" />

      {/* Real-time Physics World */}
      <Physics gravity={[0, -9.81, 0]}>
        <Suspense fallback={null}>
          <Floor />
          <BigButton active={spotlightOn} onClick={() => setSpotlightOn(prev => !prev)} />
        </Suspense>
      </Physics>

      {/* Ground shadow casting for depth */}
      <ContactShadows
        position={[0, -2.49, 0]}
        opacity={spotlightOn ? 0.8 : 0.5} // Enhance shadow opacity when spotlighted
        scale={20}
        blur={2.5}
        far={8}
      />
    </>
  )
}


