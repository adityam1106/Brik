import { motion, AnimatePresence } from 'framer-motion'

interface LandingScreenProps {
  showPrompt: boolean
  visible: boolean
  onTransition: () => void
}

const FEATURES = ['Due Diligence', 'Valuation', 'Market Intelligence']

export default function LandingScreen({
  showPrompt,
  visible,
  onTransition,
}: LandingScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-20 flex flex-col items-center justify-center cursor-pointer select-none px-6"
          onClick={onTransition}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Title */}
          <motion.h1
            className="text-[6rem] sm:text-[8rem] md:text-[12rem] font-light tracking-[0.15em] text-brik-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textShadow: '0 0 80px rgba(59, 130, 246, 0.08)' }}
          >
            Brik
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-sm md:text-base tracking-[0.25em] uppercase text-brik-muted font-light text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            AI-powered due diligence for institutional investors
          </motion.p>

          {/* Feature pills */}
          <motion.div
            className="flex items-center gap-3 mt-5 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.0 }}
          >
            {FEATURES.map((f, i) => (
              <motion.span
                key={f}
                className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-brik-border text-brik-muted"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 + i * 0.1 }}
              >
                {f}
              </motion.span>
            ))}
          </motion.div>

          {/* Click prompt */}
          <AnimatePresence>
            {showPrompt && (
              <motion.div
                className="mt-12 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <motion.p
                  className="text-xs tracking-[0.4em] uppercase text-brik-muted font-light"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  click anywhere to begin
                </motion.p>
                <motion.div
                  className="mt-4 w-6 h-[1px] bg-brik-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  style={{ opacity: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
