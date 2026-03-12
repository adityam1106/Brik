import { motion } from 'framer-motion'
import CollapsibleSection from '@/components/valuation/CollapsibleSection'
import EventTimelineItem from './shared/EventTimelineItem'
import { useCompanyData } from '@/contexts/CompanyContext'

export default function DDKeyEvents() {
  const { mockCorporateEvents } = useCompanyData()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <CollapsibleSection title="Key Events">
        <div className="space-y-0">
          {mockCorporateEvents.map((event, i) => (
            <EventTimelineItem
              key={i}
              event={event}
              isLast={i === mockCorporateEvents.length - 1}
            />
          ))}
        </div>
      </CollapsibleSection>
    </motion.div>
  )
}
