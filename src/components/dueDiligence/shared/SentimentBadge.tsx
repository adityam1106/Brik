import { cn } from '@/lib/utils'

interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative'
}

export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium border',
        sentiment === 'positive' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        sentiment === 'neutral' && 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        sentiment === 'negative' && 'bg-red-500/10 border-red-500/20 text-red-400',
      )}
    >
      {sentiment}
    </span>
  )
}
