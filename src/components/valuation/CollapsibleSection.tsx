import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface CollapsibleSectionProps {
  children: React.ReactNode
  defaultOpen?: boolean
  title?: string
}

export default function CollapsibleSection({
  children,
  defaultOpen = true,
  title,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-2xl border border-brik-border bg-brik-surface/50 backdrop-blur-sm overflow-hidden">
      {/* Collapse toggle */}
      {title && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-8 py-3 border-b border-brik-border/50 hover:bg-brik-surface/80 transition-colors"
        >
          <span className="text-[10px] uppercase tracking-widest text-brik-muted font-medium">
            {title}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-brik-muted" />
          </motion.div>
        </button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
