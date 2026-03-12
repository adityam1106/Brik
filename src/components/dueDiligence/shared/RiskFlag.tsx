import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RiskFlag as RiskFlagType } from '@/data/dueDiligenceData'

interface RiskFlagProps {
  flag: RiskFlagType
}

export default function RiskFlag({ flag }: RiskFlagProps) {
  const borderColor =
    flag.severity === 'critical'
      ? 'border-l-red-500'
      : flag.severity === 'warning'
      ? 'border-l-amber-500'
      : 'border-l-blue-500'

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

  const badgeStyle =
    flag.severity === 'critical'
      ? 'bg-red-500/10 border-red-500/20 text-red-400'
      : flag.severity === 'warning'
      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'

  return (
    <div
      className={cn(
        'border-l-2 rounded-lg bg-brik-dark/40 p-3',
        borderColor,
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon size={14} className={cn('shrink-0 mt-0.5', iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={cn('text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-medium', badgeStyle)}>
              {flag.severity}
            </span>
            <span className="text-[10px] text-brik-muted uppercase tracking-wider">
              {flag.category}
            </span>
          </div>
          <p className="text-[12px] font-medium text-brik-text mb-1">{flag.title}</p>
          <p className="text-[11px] text-brik-muted leading-relaxed">{flag.detail}</p>
          <p className="text-[10px] text-brik-muted mt-1.5 opacity-60">Detected {flag.detectedDate}</p>
        </div>
      </div>
    </div>
  )
}
