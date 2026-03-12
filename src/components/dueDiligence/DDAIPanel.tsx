import { Brain, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { ddRiskScore, mockRiskFlags } from '@/data/dueDiligenceData'
import { cn } from '@/lib/utils'

function RiskScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 38
  const progress = (score / 10) * circumference
  const color = score >= 7 ? '#ef4444' : score >= 4 ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-brik-text">{score.toFixed(1)}</span>
          <span className="text-[9px] text-brik-muted uppercase tracking-wider">/ 10</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-brik-muted">Risk Score</span>
    </div>
  )
}

const top5 = mockRiskFlags.slice(0, 5)

export default function DDAIPanel() {
  const criticalCount = mockRiskFlags.filter((f) => f.severity === 'critical').length
  const warningCount = mockRiskFlags.filter((f) => f.severity === 'warning').length
  const infoCount = mockRiskFlags.filter((f) => f.severity === 'informational').length

  return (
    <aside className="w-72 shrink-0 sticky top-8 h-fit">
      <div className="rounded-xl border border-brik-border bg-brik-surface/40 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-brik-accent/10 border border-brik-accent/20">
            <Brain size={14} className="text-brik-accent" strokeWidth={1.5} />
          </div>
          <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">AI Insights</h4>
        </div>

        {/* Risk Score */}
        <div className="flex justify-center mb-5 pb-5 border-b border-brik-border">
          <RiskScoreRing score={ddRiskScore} />
        </div>

        {/* Counts */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-brik-border">
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-brik-muted">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-400">{warningCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-brik-muted">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{infoCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-brik-muted">Info</div>
          </div>
        </div>

        {/* Top Findings */}
        <div>
          <p className="text-[9px] uppercase tracking-widest text-brik-muted mb-3 font-medium">
            Top Findings
          </p>
          <div className="space-y-2.5">
            {top5.map((flag, i) => {
              const borderColor =
                flag.severity === 'critical'
                  ? 'border-l-red-500/50'
                  : flag.severity === 'warning'
                  ? 'border-l-amber-500/50'
                  : 'border-l-blue-500/50'

              const Icon =
                flag.severity === 'critical'
                  ? AlertCircle
                  : flag.severity === 'warning'
                  ? AlertTriangle
                  : Info

              const iconColor =
                flag.severity === 'critical'
                  ? 'text-red-400'
                  : flag.severity === 'warning'
                  ? 'text-amber-400'
                  : 'text-blue-400'

              return (
                <div
                  key={i}
                  className={cn('border-l-2 pl-3 py-1.5 rounded-r-lg bg-brik-dark/40', borderColor)}
                >
                  <div className="flex items-start gap-2">
                    <Icon size={11} className={cn('shrink-0 mt-0.5', iconColor)} />
                    <div>
                      <p className="text-[11px] font-medium text-brik-text leading-snug">
                        {flag.title}
                      </p>
                      <p className="text-[10px] text-brik-muted mt-0.5">{flag.category}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
