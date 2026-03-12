import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Layers, Activity, Search,
  LayoutDashboard, Newspaper, Calendar, Shield, Globe, BarChart3, Users,
  type LucideIcon,
} from 'lucide-react'
import type { DDPage } from './DDSidebar'
import { useCompanyData } from '@/contexts/CompanyContext'
import DDOverview from './DDOverview'
import DDNewsFeed from './DDNewsFeed'
import DDKeyEvents from './DDKeyEvents'
import DDRiskGovernance from './DDRiskGovernance'
import DDMarketIntel from './DDMarketIntel'
import DDCompetitorAnalysis from './DDCompetitorAnalysis'
import DDInsiderActivity from './DDInsiderActivity'
import DDAIPanel from './DDAIPanel'
import { cn } from '@/lib/utils'

const NAV_TABS: { id: DDPage; label: string; icon: LucideIcon }[] = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'news',        label: 'News',        icon: Newspaper       },
  { id: 'events',      label: 'Events',      icon: Calendar        },
  { id: 'risk',        label: 'Risk',        icon: Shield          },
  { id: 'market',      label: 'Market',      icon: Globe           },
  { id: 'competitors', label: 'Competitors', icon: BarChart3       },
  { id: 'insiders',    label: 'Insiders',    icon: Users           },
]

interface DueDiligencePageProps {
  onBack: () => void
}

function PageContent({ page, onNavigate, ticker }: { page: DDPage; onNavigate: (p: DDPage) => void; ticker: string }) {
  switch (page) {
    case 'overview':    return <DDOverview onNavigate={onNavigate} />
    case 'news':        return <DDNewsFeed onNavigate={onNavigate} ticker={ticker} />
    case 'events':      return <DDKeyEvents />
    case 'risk':        return <DDRiskGovernance />
    case 'market':      return <DDMarketIntel ticker={ticker} />
    case 'competitors': return <DDCompetitorAnalysis />
    case 'insiders':    return <DDInsiderActivity ticker={ticker} />
  }
}

export default function DueDiligencePage({ onBack }: DueDiligencePageProps) {
  const [activePage, setActivePage] = useState<DDPage>('overview')
  const { targetCompany } = useCompanyData()

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto bg-brik-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-brik-border sticky top-0 z-20 bg-brik-black/95 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-brik-border hover:border-brik-border-light hover:bg-brik-surface/50 transition-all shrink-0"
          >
            <ArrowLeft size={14} className="text-brik-muted" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-brik-accent/10 border border-brik-accent/20 flex items-center justify-center shrink-0">
            <Layers size={14} className="text-brik-accent" strokeWidth={1.5} />
          </div>
          <span className="text-base md:text-lg font-light tracking-[0.12em] text-brik-text">Brik</span>
          <span className="text-xs text-brik-muted hidden md:inline">/ Due Diligence</span>
          <div className="hidden md:flex items-center gap-1.5 ml-1 px-2 py-1 rounded-lg bg-brik-surface border border-brik-border">
            <Search size={11} className="text-brik-muted" />
            <span className="text-[11px] text-brik-muted">{targetCompany.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brik-accent/10 border border-brik-accent/20 text-brik-accent ml-1">{targetCompany.ticker}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brik-surface/60 border border-brik-border">
            <Activity size={11} className="text-emerald-500" />
            <span className="text-xs text-brik-muted hidden md:inline">Systems Online</span>
          </div>
        </div>
      </motion.header>

      {/* Horizontal tab nav */}
      <div className="sticky top-[53px] z-10 bg-brik-black/95 backdrop-blur-sm border-b border-brik-border px-4 md:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          {NAV_TABS.map(({ id, label, icon: Icon }) => {
            const active = activePage === id
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium uppercase tracking-wider whitespace-nowrap transition-all shrink-0',
                  active
                    ? 'bg-brik-accent/10 border border-brik-accent/20 text-brik-accent'
                    : 'border border-transparent text-brik-muted hover:text-brik-text hover:bg-brik-surface/50',
                )}
              >
                <Icon size={12} strokeWidth={active ? 2 : 1.5} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[calc(100vh-105px)]">
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
          <PageContent page={activePage} onNavigate={setActivePage} ticker={targetCompany.ticker} />
        </main>
        <div className="hidden lg:block px-4 py-8">
          <DDAIPanel />
        </div>
      </div>
    </motion.div>
  )
}
