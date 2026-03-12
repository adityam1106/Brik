import { motion, AnimatePresence } from 'framer-motion'

interface LandingScreenProps {
  showPrompt: boolean
  visible: boolean
  onTransition: () => void
}

export default function LandingScreen({
  showPrompt,
  visible,
  onTransition,
}: LandingScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-20 flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={onTransition}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Title */}
          <motion.h1
            className="text-[8rem] md:text-[12rem] font-light tracking-[0.15em] text-brik-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textShadow: '0 0 80px rgba(59, 130, 246, 0.08)',
            }}
          >
            Brik
          </motion.h1>

          {/* Subtitle prompt */}
          <AnimatePresence>
            {showPrompt && (
              <motion.div
                className="mt-4 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <motion.p
                  className="text-sm tracking-[0.4em] uppercase text-brik-muted font-light"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  click anywhere
                </motion.p>
                <motion.div
                  className="mt-6 w-6 h-[1px] bg-brik-accent"
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
