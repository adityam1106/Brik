import type { NewsArticle } from '@/data/dueDiligenceData'
import SentimentBadge from './SentimentBadge'

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface NewsCardProps {
  article: NewsArticle
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4 hover:border-brik-border-light transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-medium text-brik-text leading-snug flex-1">
          {article.headline}
        </h3>
        <SentimentBadge sentiment={article.sentiment} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-brik-accent font-medium">{article.source}</span>
        <span className="text-[10px] text-brik-muted">·</span>
        <span className="text-[10px] text-brik-muted">{timeAgo(article.timestamp)}</span>
        <span className="text-[10px] text-brik-muted">·</span>
        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brik-surface border border-brik-border text-brik-muted">
          {article.category}
        </span>
      </div>
      <p className="text-[11px] text-brik-muted leading-relaxed line-clamp-2">
        {article.summary}
      </p>
    </div>
  )
}
