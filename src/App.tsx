import { useState, useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence } from 'framer-motion'
import ParticleField from './components/ParticleField'
import LandingScreen from './components/LandingScreen'
import OrbitalDashboard from './components/OrbitalDashboard'
import ValuationPage from './components/valuation/ValuationPage'
import DueDiligencePage from './components/dueDiligence/DueDiligencePage'
import { CompanyProvider } from './contexts/CompanyContext'
import './App.css'

type AppState = 'landing' | 'transitioning' | 'dashboard' | 'valuation' | 'dueDiligence'

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [showPrompt, setShowPrompt] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const animationRef = useRef<number>(0)

  // Show "click anywhere" after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Animate transition progress
  useEffect(() => {
    if (appState !== 'transitioning') return

    const startTime = performance.now()
    const duration = 1800

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing: ease-in-out cubic
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      setTransitionProgress(eased)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAppState('dashboard')
      }
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [appState])

  const handleTransition = useCallback(() => {
    if (appState !== 'landing') return
    setAppState('transitioning')
  }, [appState])

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <CompanyProvider>
    <div className="w-full h-full bg-brik-black relative overflow-hidden">
      {/* Three.js Canvas Background */}
      {!prefersReducedMotion && (
        <div
          className="fixed inset-0 z-0 transition-opacity duration-1000"
          style={{
            opacity: appState === 'dashboard' || appState === 'valuation' || appState === 'dueDiligence' ? 0.15 : 1,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ParticleField transitionProgress={transitionProgress} />
          </Canvas>
        </div>
      )}

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, #050505 75%)',
          opacity: 0.5,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Landing Screen */}
      <LandingScreen
        showPrompt={showPrompt}
        visible={appState === 'landing' || appState === 'transitioning'}
        onTransition={handleTransition}
      />

      {/* Pages */}
      <AnimatePresence mode="wait">
        {appState === 'dashboard' && (
          <OrbitalDashboard
            key="dashboard"
            onNavigateToValuation={() => setAppState('valuation')}
            onNavigateToDueDiligence={() => setAppState('dueDiligence')}
          />
        )}
        {appState === 'valuation' && (
          <ValuationPage
            key="valuation"
            onBack={() => setAppState('dashboard')}
          />
        )}
        {appState === 'dueDiligence' && (
          <DueDiligencePage
            key="dueDiligence"
            onBack={() => setAppState('dashboard')}
          />
        )}
      </AnimatePresence>
    </div>
    </CompanyProvider>
  )
}
