import { cn } from '@/lib/utils'
import type { CorporateEvent } from '@/data/dueDiligenceData'

const typeColors: Record<CorporateEvent['type'], string> = {
  acquisition: '#3b82f6',
  management: '#f59e0b',
  regulatory: '#ef4444',
  product: '#14b8a6',
  fundraising: '#c9a84c',
  partnership: '#6366f1',
}

const impactBadge: Record<CorporateEvent['impact'], string> = {
  high: 'bg-red-500/10 border-red-500/20 text-red-400',
  medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
}

interface EventTimelineItemProps {
  event: CorporateEvent
  isLast?: boolean
}

export default function EventTimelineItem({ event, isLast }: EventTimelineItemProps) {
  const dotColor = typeColors[event.type]

  return (
    <div className="flex gap-4">
      {/* Date column */}
      <div className="w-20 shrink-0 text-right">
        <span className="text-[10px] font-mono text-brik-muted leading-none pt-3 block">
          {event.date}
        </span>
      </div>

      {/* Timeline column */}
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full border-2 border-brik-black mt-2.5 shrink-0 z-10"
          style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}60` }}
        />
        {!isLast && <div className="w-px flex-1 bg-brik-border mt-1" />}
      </div>

      {/* Content card */}
      <div className={cn('flex-1 rounded-xl border border-brik-border bg-brik-dark/50 p-3.5', isLast ? 'mb-0' : 'mb-4')}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-[12px] font-medium text-brik-text leading-snug">{event.title}</h4>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
              style={{
                color: dotColor,
                backgroundColor: `${dotColor}18`,
                borderColor: `${dotColor}40`,
              }}
            >
              {event.type}
            </span>
            <span className={cn('text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-medium', impactBadge[event.impact])}>
              {event.impact}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-brik-muted leading-relaxed">{event.description}</p>
      </div>
    </div>
  )
}
