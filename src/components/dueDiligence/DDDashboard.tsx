import { Card, CardContent } from '@/components/ui/card'
import {
  Shield,
  Newspaper,
  Calendar,
  AlertTriangle,
  Globe,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
} from 'lucide-react'
import { mockRiskFlags, mockInsiderTransactions, ddRiskScore } from '@/data/dueDiligenceData'
import type { DDPage } from './DDSidebar'

interface DDDashboardProps {
  onNavigate: (page: DDPage) => void
}

// ── Shared label row ──────────────────────────────────────────────────────────
function CardLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-brik-muted font-medium">
          {label}
        </span>
      </div>
      <ArrowRight size={11} className="text-brik-border group-hover:text-brik-muted group-hover:translate-x-0.5 transition-all duration-200 shrink-0" strokeWidth={1.5} />
    </div>
  )
}

// ── Clickable card wrapper ────────────────────────────────────────────────────
function ClickCard({
  page,
  onNavigate,
  className,
  children,
}: {
  page: DDPage
  onNavigate: (p: DDPage) => void
  className: string
  children: React.ReactNode
}) {
  return (
    <Card
      onClick={() => onNavigate(page)}
      className={`group cursor-pointer border-brik-border bg-brik-dark/80 text-brik-text hover:border-brik-border-light hover:bg-brik-surface/20 transition-all duration-200 ${className}`}
    >
      {children}
    </Card>
  )
}

// ── Risk score ring ───────────────────────────────────────────────────────────
function RiskRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 28
  const progress = (score / 10) * circumference
  const color = score >= 7 ? '#ef4444' : score >= 4 ? '#f59e0b' : '#22c55e'
  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        <circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${progress} ${circumference}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-brik-text leading-none">{score.toFixed(1)}</span>
        <span className="text-[8px] text-brik-muted leading-none mt-0.5">/10</span>
      </div>
    </div>
  )
}

// ── 1. Overview Card ──────────────────────────────────────────────────────────
function OverviewCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  const criticalCount = mockRiskFlags.filter((f) => f.severity === 'critical').length
  const warningCount  = mockRiskFlags.filter((f) => f.severity === 'warning').length
  const infoCount     = mockRiskFlags.filter((f) => f.severity === 'informational').length

  return (
    <ClickCard page="overview" onNavigate={onNavigate} className="col-span-full lg:col-span-2">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<Shield size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Overview" />
        <div className="flex flex-col items-center gap-3">
          <RiskRing score={ddRiskScore} />
          <div className="flex items-center gap-3 text-[10px] font-medium flex-wrap justify-center">
            <span className="text-red-400">{criticalCount} Critical</span>
            <span className="text-brik-border">·</span>
            <span className="text-amber-400">{warningCount} Warnings</span>
            <span className="text-brik-border">·</span>
            <span className="text-blue-400">{infoCount} Info</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-brik-muted leading-relaxed">
          AI-generated due diligence summary for Acme Technologies Inc.
        </p>
      </CardContent>
    </ClickCard>
  )
}

// ── 2. News Feed Card ─────────────────────────────────────────────────────────
const newsTiles = [
  { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&q=70&fit=crop', headline: 'ACME Q3 Earnings Beat Estimates — Revenue Up 12% YoY', source: 'Bloomberg', time: '2h ago' },
  { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&q=70&fit=crop', headline: 'FTC Opens Formal Pricing Inquiry Into Cloud Providers', source: 'Reuters', time: '5h ago' },
  { img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&q=70&fit=crop', headline: 'NovaTech Strategic Partnership Valued at $420M Announced', source: 'WSJ', time: '1d ago' },
]

function NewsFeedCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  return (
    <ClickCard page="news" onNavigate={onNavigate} className="col-span-full lg:col-span-4">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<Newspaper size={12} className="text-brik-accent" strokeWidth={1.5} />} label="News Feed" />
        <div className="space-y-3">
          {newsTiles.map((tile, i) => (
            <div key={i} className="flex items-start gap-3">
              <img src={tile.img} alt="" className="w-14 h-14 rounded object-cover shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-brik-text line-clamp-2 leading-snug">{tile.headline}</p>
                <p className="mt-1 text-[10px] text-brik-muted">{tile.source} · {tile.time}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Live news with AI sentiment scoring</p>
      </CardContent>
    </ClickCard>
  )
}

// ── 3. Key Events Card ────────────────────────────────────────────────────────
const keyEvents = [
  { dot: 'bg-red-500',    date: 'Mar 2026', title: 'FTC Pricing Inquiry Disclosed' },
  { dot: 'bg-indigo-500', date: 'Feb 2026', title: 'NovaTech $420M Partnership' },
  { dot: 'bg-blue-500',   date: 'Oct 2025', title: 'DataStream Acquisition $310M' },
]

function KeyEventsCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  return (
    <ClickCard page="events" onNavigate={onNavigate} className="col-span-full sm:col-span-3">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<Calendar size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Key Events" />
        <div className="space-y-2.5">
          {keyEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${ev.dot}`} />
              <span className="font-mono text-[10px] text-brik-muted w-16 shrink-0">{ev.date}</span>
              <span className="text-[11px] text-brik-text truncate">{ev.title}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Corporate event history and strategic milestones</p>
      </CardContent>
    </ClickCard>
  )
}

// ── 4. Risk & Governance Card ─────────────────────────────────────────────────
const riskSignals = [
  { border: 'border-red-500',   badge: 'bg-red-500/20 text-red-400',   severity: 'Critical', title: 'FTC Pricing Inquiry — Active' },
  { border: 'border-red-500',   badge: 'bg-red-500/20 text-red-400',   severity: 'Critical', title: 'Anomalous CEO Insider Sale' },
  { border: 'border-amber-500', badge: 'bg-amber-500/20 text-amber-400', severity: 'Warning', title: 'Gross Margin Compression −180bps' },
  { border: 'border-amber-500', badge: 'bg-amber-500/20 text-amber-400', severity: 'Warning', title: 'Workforce Restructuring Risk' },
]

function RiskGovernanceCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  return (
    <ClickCard page="risk" onNavigate={onNavigate} className="col-span-full sm:col-span-3">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<AlertTriangle size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Risk & Governance" />
        <div className="space-y-2">
          {riskSignals.map((sig, i) => (
            <div key={i} className={`border-l-2 ${sig.border} pl-2.5 py-1 flex items-center gap-2`}>
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium shrink-0 ${sig.badge}`}>{sig.severity}</span>
              <span className="text-[11px] text-brik-text truncate">{sig.title}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Regulatory, governance, and operational risk signals</p>
      </CardContent>
    </ClickCard>
  )
}

// ── 5. Market Intelligence Card ───────────────────────────────────────────────
const marketInsights = [
  { trend: 'up' as const,   text: 'AI infrastructure spending growing 18% annually' },
  { trend: 'down' as const, text: 'FTC/DOJ scrutiny of cloud pricing intensifying' },
]

function MarketIntelCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  return (
    <ClickCard page="market" onNavigate={onNavigate} className="col-span-full sm:col-span-2">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<Globe size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Market Intelligence" />
        <div className="space-y-3">
          {marketInsights.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              {item.trend === 'up'
                ? <TrendingUp size={14} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                : <TrendingDown size={14} className="text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />}
              <p className="text-[11px] text-brik-text line-clamp-2 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Industry trends via Perigon intelligence</p>
      </CardContent>
    </ClickCard>
  )
}

// ── 6. Competitor Analysis Card ───────────────────────────────────────────────
const competitors = [
  { ticker: 'CLNX', name: 'CloudNexus',  share: 28.4, trend: 'up' as const },
  { ticker: 'ZNX',  name: 'ZenixCorp',   share: 18.7, trend: 'down' as const },
  { ticker: 'VRTX', name: 'Vertex Data', share: 15.2, trend: 'neutral' as const },
]

function CompetitorCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  return (
    <ClickCard page="competitors" onNavigate={onNavigate} className="col-span-full sm:col-span-2">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<BarChart3 size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Competitor Analysis" />
        <div className="space-y-3">
          {competitors.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[9px] font-mono bg-brik-border/30 text-brik-muted px-1.5 py-0.5 rounded shrink-0 w-10 text-center">{c.ticker}</span>
              <span className="text-[11px] text-brik-text w-20 shrink-0 truncate">{c.name}</span>
              <div className="flex-1 bg-brik-border/30 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-brik-accent/70 rounded-full" style={{ width: `${(c.share / 35) * 100}%` }} />
              </div>
              <span className="text-[10px] text-brik-muted shrink-0 w-10 text-right">{c.share}%</span>
              {c.trend === 'up'      && <TrendingUp size={12} className="text-emerald-400 shrink-0" strokeWidth={1.5} />}
              {c.trend === 'down'    && <TrendingDown size={12} className="text-red-400 shrink-0" strokeWidth={1.5} />}
              {c.trend === 'neutral' && <Minus size={12} className="text-brik-muted shrink-0" strokeWidth={1.5} />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Competitive landscape and market share</p>
      </CardContent>
    </ClickCard>
  )
}

// ── 7. Insider Activity Card ──────────────────────────────────────────────────
function InsiderCard({ onNavigate }: { onNavigate: (p: DDPage) => void }) {
  const transactions = mockInsiderTransactions.slice(0, 3)
  return (
    <ClickCard page="insiders" onNavigate={onNavigate} className="col-span-full sm:col-span-2">
      <CardContent className="p-5 pt-5">
        <CardLabel icon={<Users size={12} className="text-brik-accent" strokeWidth={1.5} />} label="Insider Activity" />
        <div className="space-y-2.5">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] uppercase font-medium px-1.5 py-0.5 rounded shrink-0 ${tx.transactionType === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {tx.transactionType}
              </span>
              <span className="text-[11px] text-brik-text truncate flex-1 min-w-0">
                {tx.name} <span className="text-brik-muted">{tx.title}</span>
              </span>
              <span className="text-[11px] text-brik-text shrink-0">${(tx.value / 1_000_000).toFixed(1)}M</span>
              {tx.isUnusual && (
                <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded shrink-0">⚠ Unusual</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-brik-muted">Executive and director trading activity</p>
      </CardContent>
    </ClickCard>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DDDashboard({ onNavigate }: DDDashboardProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      <OverviewCard     onNavigate={onNavigate} />
      <NewsFeedCard     onNavigate={onNavigate} />
      <KeyEventsCard    onNavigate={onNavigate} />
      <RiskGovernanceCard onNavigate={onNavigate} />
      <MarketIntelCard  onNavigate={onNavigate} />
      <CompetitorCard   onNavigate={onNavigate} />
      <InsiderCard      onNavigate={onNavigate} />
    </div>
  )
}
