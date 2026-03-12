import { useRef, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CUBE_COUNT = 60
const PARTICLE_COUNT = 200

interface FloatingCubesProps {
  transitionProgress: number
}

function FloatingCubes({ transitionProgress }: FloatingCubesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const cubeData = useMemo(() => {
    return Array.from({ length: CUBE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10 - 2
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.08 + Math.random() * 0.25,
      speed: 0.1 + Math.random() * 0.3,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      floatOffset: Math.random() * Math.PI * 2,
      originalPos: new THREE.Vector3(),
    }))
  }, [])

  useMemo(() => {
    cubeData.forEach((c) => c.originalPos.copy(c.position))
  }, [cubeData])

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    },
    []
  )

  useMemo(() => {
    window.addEventListener('mousemove', handlePointerMove)
    return () => window.removeEventListener('mousemove', handlePointerMove)
  }, [handlePointerMove])

  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const mouseX = mouseRef.current.x * viewport.width * 0.5
    const mouseY = mouseRef.current.y * viewport.height * 0.5

    cubeData.forEach((cube, i) => {
      const floatY = Math.sin(time * cube.speed + cube.floatOffset) * 0.3
      const floatX = Math.cos(time * cube.speed * 0.7 + cube.floatOffset) * 0.15

      const dx = mouseX - cube.position.x
      const dy = mouseY - cube.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / 5) * 0.6

      // During transition, cubes converge toward center
      const convergeFactor = transitionProgress
      const targetX = cube.originalPos.x * (1 - convergeFactor * 0.9) + floatX + dx * influence * 0.05
      const targetY = cube.originalPos.y * (1 - convergeFactor * 0.9) + floatY + dy * influence * 0.05
      const targetZ = cube.originalPos.z * (1 - convergeFactor * 0.8) - convergeFactor * 8

      cube.position.x += (targetX - cube.position.x) * 0.02
      cube.position.y += (targetY - cube.position.y) * 0.02
      cube.position.z += (targetZ - cube.position.z) * 0.02

      cube.rotation.x += cube.rotSpeed * (1 + convergeFactor * 3)
      cube.rotation.y += cube.rotSpeed * 0.7 * (1 + convergeFactor * 3)

      const scaleMultiplier = 1 - convergeFactor * 0.7
      tempObject.position.copy(cube.position)
      tempObject.rotation.copy(cube.rotation)
      tempObject.scale.setScalar(cube.scale * scaleMultiplier)
      tempObject.updateMatrix()

      meshRef.current!.setMatrixAt(i, tempObject.matrix)

      // Color: subtle blue-white, brighten near mouse
      const brightness = 0.08 + influence * 0.15 + convergeFactor * 0.2
      tempColor.setRGB(brightness * 0.7, brightness * 0.8, brightness)
      meshRef.current!.setColorAt(i, tempColor)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CUBE_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.6} wireframe />
    </instancedMesh>
  )
}

function Particles({ transitionProgress }: { transitionProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const { positions, velocities, originalPositions } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const origPos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 24
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 8 - 3
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      origPos[i * 3] = x
      origPos[i * 3 + 1] = y
      origPos[i * 3 + 2] = z
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = 0
    }
    return { positions: pos, velocities: vel, originalPositions: origPos }
  }, [])

  useMemo(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry
    const posAttr = geometry.attributes.position as THREE.BufferAttribute

    const mouseX = mouseRef.current.x * viewport.width * 0.5
    const mouseY = mouseRef.current.y * viewport.height * 0.5

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      const dx = mouseX - positions[ix]
      const dy = mouseY - positions[iy]
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Gentle repulsion from cursor
      if (dist < 3) {
        const force = (1 - dist / 3) * 0.01
        velocities[ix] -= (dx / dist) * force
        velocities[iy] -= (dy / dist) * force
      }

      // Slow return to original position
      velocities[ix] += (originalPositions[ix] - positions[ix]) * 0.0005
      velocities[iy] += (originalPositions[iy] - positions[iy]) * 0.0005

      // Damping
      velocities[ix] *= 0.98
      velocities[iy] *= 0.98

      // During transition, converge to center
      const convergeFactor = transitionProgress
      const centerPullX = (0 - positions[ix]) * convergeFactor * 0.02
      const centerPullY = (0 - positions[iy]) * convergeFactor * 0.02
      const centerPullZ = (-10 - positions[iz]) * convergeFactor * 0.01

      positions[ix] += velocities[ix] + centerPullX
      positions[iy] += velocities[iy] + centerPullY
      positions[iz] += velocities[iz] + centerPullZ

      posAttr.setXYZ(i, positions[ix], positions[iy], positions[iz])
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function GridLines() {
  const linesRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    const lineData: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
    const spread = 16
    const count = 20
    const step = (spread * 2) / count

    for (let i = 0; i <= count; i++) {
      const pos = -spread + i * step
      // Horizontal lines
      lineData.push({
        start: new THREE.Vector3(-spread, pos, -6),
        end: new THREE.Vector3(spread, pos, -6),
      })
      // Vertical lines
      lineData.push({
        start: new THREE.Vector3(pos, -spread, -6),
        end: new THREE.Vector3(pos, spread, -6),
      })
    }
    return lineData
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
    linesRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.03) * 0.02
  })

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => {
        const points = [line.start, line.end]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        return (
          <lineSegments key={i} geometry={geometry}>
            <lineBasicMaterial color="#1a1a1a" transparent opacity={0.3} />
          </lineSegments>
        )
      })}
    </group>
  )
}

export default function ParticleField({
  transitionProgress,
}: {
  transitionProgress: number
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <FloatingCubes transitionProgress={transitionProgress} />
      <Particles transitionProgress={transitionProgress} />
      <GridLines />
    </>
  )
}
