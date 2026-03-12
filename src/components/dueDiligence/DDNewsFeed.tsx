import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Shield,
  Globe,
  BarChart3,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { useFinnhubNews } from '@/hooks/useFinnhubNews'
import type { NewsArticle } from '@/data/dueDiligenceData'
import type { DDPage } from './DDSidebar'

// ── Unsplash image map by category ────────────────────────────────────────────
const CATEGORY_IMAGE: Record<string, string> = {
  Earnings:
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=75&fit=crop',
  Regulatory:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=75&fit=crop',
  'Insider Activity':
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=75&fit=crop',
  Partnership:
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=75&fit=crop',
  Product:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75&fit=crop',
  'Corporate Action':
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=75&fit=crop',
  'Capital Allocation':
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=600&q=75&fit=crop',
  'Analyst Coverage':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&fit=crop',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=75&fit=crop'

function imgFor(category: string) {
  return CATEGORY_IMAGE[category] ?? FALLBACK_IMAGE
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60_000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const SENTIMENT_EMOJI: Record<string, string> = {
  positive: '🟢',
  neutral:  '🟡',
  negative: '🔴',
}

const SENTIMENT_COLOR: Record<string, string> = {
  positive: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  neutral:  'bg-amber-500/20 border-amber-500/30 text-amber-300',
  negative: 'bg-red-500/20 border-red-500/30 text-red-300',
}

// ── Priority score ─────────────────────────────────────────────────────────────
function priorityScore(a: NewsArticle) {
  const s = a.sentiment === 'negative' ? 1.0 : a.sentiment === 'positive' ? 0.7 : 0.5
  const r = Math.max(0, 1 - (Date.now() - a.timestamp) / (7 * 24 * 3_600_000))
  const v = Math.abs(a.sentimentScore - 0.5) * 2
  return ((s + r + v) / 3) * 10
}

// ── Navigation cards config ───────────────────────────────────────────────────
const NAV_CARDS: {
  page: DDPage
  icon: LucideIcon
  label: string
  description: string
  accent: string
}[] = [
  {
    page: 'overview',
    icon: LayoutDashboard,
    label: 'Overview',
    description: 'AI-generated DD summary and risk score',
    accent: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    page: 'events',
    icon: Calendar,
    label: 'Key Events',
    description: 'Corporate milestones and strategic history',
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    page: 'risk',
    icon: Shield,
    label: 'Risk & Governance',
    description: 'Regulatory flags and governance signals',
    accent: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  {
    page: 'market',
    icon: Globe,
    label: 'Market Intelligence',
    description: 'Industry trends and macro context',
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    page: 'competitors',
    icon: BarChart3,
    label: 'Competitor Analysis',
    description: 'Market share and competitive landscape',
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    page: 'insiders',
    icon: Users,
    label: 'Insider Activity',
    description: 'Executive and director trading patterns',
    accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
]

// ── Article cards ─────────────────────────────────────────────────────────────
function HeroCard({ article }: { article: NewsArticle }) {
  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden group cursor-pointer">
      <img
        src={imgFor(article.category)}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-transparent" />

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full font-semibold backdrop-blur-sm border ${SENTIMENT_COLOR[article.sentiment]}`}>
          {SENTIMENT_EMOJI[article.sentiment]} {article.sentiment}
        </span>
        <span className="text-[9px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/40 border border-white/10 text-white/60 backdrop-blur-sm">
          {article.category}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[9px] uppercase tracking-widest text-brik-accent font-medium mb-1.5">
          Top Story
        </p>
        <h2 className="text-lg font-bold text-white leading-snug line-clamp-2 mb-2">
          {article.headline}
        </h2>
        <p className="text-[11px] text-white/60 line-clamp-2 mb-3 leading-relaxed">
          {article.summary}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <span className="font-medium text-brik-accent">{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.timestamp)}</span>
          <span>·</span>
          <span>Score {priorityScore(article).toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

function MediumCard({ article }: { article: NewsArticle }) {
  return (
    <div className="group cursor-pointer rounded-xl border border-brik-border bg-brik-dark/60 overflow-hidden hover:border-brik-border-light transition-colors">
      <div className="relative h-36 overflow-hidden">
        <img
          src={imgFor(article.category)}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <span className={`absolute top-2 right-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm border ${SENTIMENT_COLOR[article.sentiment]}`}>
          {SENTIMENT_EMOJI[article.sentiment]}
        </span>
      </div>
      <div className="p-3.5">
        <p className="text-[11px] font-medium text-brik-text line-clamp-2 leading-snug mb-2">
          {article.headline}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-brik-muted">
          <span className="text-brik-accent font-medium">{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

function CompactCard({ article }: { article: NewsArticle }) {
  return (
    <div className="group cursor-pointer rounded-xl border border-brik-border bg-brik-dark/60 overflow-hidden hover:border-brik-border-light transition-colors flex gap-3 p-3">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
        <img
          src={imgFor(article.category)}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-brik-text line-clamp-2 leading-snug mb-1">
          {article.headline}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-brik-muted">
          <span className="text-[9px]">{SENTIMENT_EMOJI[article.sentiment]}</span>
          <span className="text-brik-accent font-medium">{article.source}</span>
          <span>·</span>
          <span>{timeAgo(article.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Nav card ──────────────────────────────────────────────────────────────────
function NavCard({
  page,
  icon: Icon,
  label,
  description,
  accent,
  onNavigate,
  index,
}: (typeof NAV_CARDS)[0] & { onNavigate: (p: DDPage) => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 * index }}
      onClick={() => onNavigate(page)}
      className="group w-full text-left rounded-xl border border-brik-border bg-brik-dark/60 p-4 hover:border-brik-border-light hover:bg-brik-surface/40 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${accent}`}>
          <Icon size={14} strokeWidth={1.5} />
        </div>
        <ArrowRight
          size={13}
          className="text-brik-muted group-hover:text-brik-text group-hover:translate-x-0.5 transition-all duration-200 mt-0.5 shrink-0"
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-3 text-[12px] font-semibold text-brik-text">{label}</p>
      <p className="mt-0.5 text-[10px] text-brik-muted leading-relaxed">{description}</p>
    </motion.button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface DDNewsFeedProps {
  onNavigate: (page: DDPage) => void
}

export default function DDNewsFeed({ onNavigate }: DDNewsFeedProps) {
  const { data: articles, loading } = useFinnhubNews('ACME')

  const sorted = useMemo(
    () => [...articles].sort((a, b) => priorityScore(b) - priorityScore(a)),
    [articles],
  )

  const hero   = sorted[0]
  const midRow = sorted.slice(1, 3)
  const botRow = sorted.slice(3, 6)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[11px] text-brik-muted">Loading news…</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Article grid */}
      {hero && <HeroCard article={hero} />}

      {midRow.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {midRow.map((a) => <MediumCard key={a.id} article={a} />)}
        </div>
      )}

      {botRow.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {botRow.map((a) => <CompactCard key={a.id} article={a} />)}
        </div>
      )}

      {/* Divider + section label */}
      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-brik-border" />
        <span className="text-[9px] uppercase tracking-widest text-brik-muted font-medium">
          Explore Analysis
        </span>
        <div className="h-px flex-1 bg-brik-border" />
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-3 gap-3">
        {NAV_CARDS.map((card, i) => (
          <NavCard key={card.page} {...card} onNavigate={onNavigate} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
