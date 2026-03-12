import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import CollapsibleSection from '@/components/valuation/CollapsibleSection'
import { mockCompetitors } from '@/data/dueDiligenceData'
import type { Competitor } from '@/data/dueDiligenceData'
import { cn } from '@/lib/utils'

function TrendBadge({ trend }: { trend: Competitor['trend'] }) {
  if (trend === 'gaining')
    return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
        <TrendingUp size={11} /> Gaining
      </span>
    )
  if (trend === 'losing')
    return (
      <span className="flex items-center gap-1 text-[10px] text-red-400">
        <TrendingDown size={11} /> Losing
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-[10px] text-amber-400">
      <Minus size={11} /> Stable
    </span>
  )
}

export default function DDCompetitorAnalysis() {
  return (
    <div className="space-y-6">
      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <CollapsibleSection title="Competitor Summary">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  {['Company', 'Ticker', 'Market Share', 'Trend', 'Recent Activity'].map((h) => (
                    <th
                      key={h}
                      className="text-left p-2.5 text-[10px] uppercase tracking-wider text-brik-muted border-b border-brik-border font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCompetitors.map((c) => (
                  <tr key={c.ticker} className="border-b border-brik-border/50 hover:bg-brik-surface/30 transition-colors">
                    <td className="p-2.5 text-brik-text font-medium">{c.name}</td>
                    <td className="p-2.5 font-mono text-brik-accent">{c.ticker}</td>
                    <td className="p-2.5 text-brik-text">{c.marketShare.toFixed(1)}%</td>
                    <td className="p-2.5">
                      <TrendBadge trend={c.trend} />
                    </td>
                    <td className="p-2.5 text-brik-muted max-w-[200px] truncate">{c.recentActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Competitor Cards */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <CollapsibleSection title="Competitor Profiles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCompetitors.map((c) => (
              <div
                key={c.ticker}
                className="rounded-xl border border-brik-border bg-brik-dark/50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[12px] font-medium text-brik-text">{c.name}</span>
                    <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-brik-surface border border-brik-border text-brik-accent">
                      {c.ticker}
                    </span>
                  </div>
                  <TrendBadge trend={c.trend} />
                </div>

                {/* Market Share Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-brik-muted mb-1">
                    <span>Market Share</span>
                    <span>{c.marketShare.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-brik-surface border border-brik-border overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        c.trend === 'gaining'
                          ? 'bg-emerald-500'
                          : c.trend === 'losing'
                          ? 'bg-red-500'
                          : 'bg-amber-500',
                      )}
                      style={{ width: `${Math.min(c.marketShare * 2.5, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Developments */}
                <ul className="space-y-1">
                  {c.recentDevelopments.map((dev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brik-muted/50 mt-1.5 shrink-0" />
                      <span className="text-[11px] text-brik-muted leading-snug">{dev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </motion.div>
    </div>
  )
}
