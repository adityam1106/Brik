import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import CollapsibleSection from '@/components/valuation/CollapsibleSection'
import { usePerigonIntel } from '@/hooks/usePerigonIntel'
import { cn } from '@/lib/utils'
import type { MarketIntelItem } from '@/data/dueDiligenceData'

function TrendIcon({ trend }: { trend: MarketIntelItem['trend'] }) {
  if (trend === 'positive') return <TrendingUp size={12} className="text-emerald-400" />
  if (trend === 'negative') return <TrendingDown size={12} className="text-red-400" />
  return <Minus size={12} className="text-amber-400" />
}

const impactBadge: Record<MarketIntelItem['impact'], string> = {
  high: 'bg-red-500/10 border-red-500/20 text-red-400',
  medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
}

const trendBg: Record<MarketIntelItem['trend'], string> = {
  positive: 'border-emerald-500/20 bg-emerald-500/5',
  negative: 'border-red-500/20 bg-red-500/5',
  neutral: 'border-amber-500/20 bg-amber-500/5',
}

export default function DDMarketIntel() {
  const { data: items, loading } = usePerigonIntel('Acme Technologies')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <CollapsibleSection title="Market Intelligence">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-brik-border p-4 space-y-3 animate-pulse">
                <div className="flex gap-2">
                  <div className="h-4 w-20 rounded bg-brik-surface/60" />
                  <div className="h-4 w-16 rounded bg-brik-surface/60" />
                </div>
                <div className="h-3 w-full rounded bg-brik-surface/60" />
                <div className="h-3 w-4/5 rounded bg-brik-surface/60" />
                <div className="h-3 w-3/5 rounded bg-brik-surface/60" />
                <div className="h-2.5 w-32 rounded bg-brik-surface/60" />
              </div>
            ))}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-[12px] text-brik-text">No market intelligence available</p>
            <p className="text-[10px] text-brik-muted">Data will appear when the Perigon API is connected</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={cn('rounded-xl border p-4', trendBg[item.trend])}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brik-surface border border-brik-border text-brik-muted">
                  {item.category}
                </span>
                <TrendIcon trend={item.trend} />
                <span className={cn('text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border', impactBadge[item.impact])}>
                  {item.impact} impact
                </span>
              </div>
              <p className="text-[12px] text-brik-text leading-relaxed mb-3">{item.insight}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brik-accent">{item.source}</span>
                <span className="text-[10px] text-brik-muted">·</span>
                <span className="text-[10px] text-brik-muted">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </motion.div>
  )
}
