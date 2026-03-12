import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Layers, Activity, Zap, Search,
  LayoutDashboard, Newspaper, Calendar, Shield, Globe, BarChart3, Users,
  type LucideIcon,
} from 'lucide-react'
import type { DDPage } from './DDSidebar'
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
  { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
  { id: 'news',         label: 'News',          icon: Newspaper       },
  { id: 'events',       label: 'Events',        icon: Calendar        },
  { id: 'risk',         label: 'Risk',          icon: Shield          },
  { id: 'market',       label: 'Market',        icon: Globe           },
  { id: 'competitors',  label: 'Competitors',   icon: BarChart3       },
  { id: 'insiders',     label: 'Insiders',      icon: Users           },
]

interface DueDiligencePageProps {
  onBack: () => void
}

function PageContent({ page, onNavigate }: { page: DDPage; onNavigate: (p: DDPage) => void }) {
  switch (page) {
    case 'overview':    return <DDOverview />
    case 'news':        return <DDNewsFeed onNavigate={onNavigate} />
    case 'events':      return <DDKeyEvents />
    case 'risk':        return <DDRiskGovernance />
    case 'market':      return <DDMarketIntel />
    case 'competitors': return <DDCompetitorAnalysis />
    case 'insiders':    return <DDInsiderActivity />
  }
}

export default function DueDiligencePage({ onBack }: DueDiligencePageProps) {
  const [activePage, setActivePage] = useState<DDPage>('overview')

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
        className="flex items-center justify-between px-6 py-4 md:px-8 border-b border-brik-border sticky top-0 z-20 bg-brik-black/95 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-brik-border hover:border-brik-border-light hover:bg-brik-surface/50 transition-all mr-1"
          >
            <ArrowLeft size={14} className="text-brik-muted" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-brik-accent/10 border border-brik-accent/20 flex items-center justify-center">
            <Layers size={16} className="text-brik-accent" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-light tracking-[0.12em] text-brik-text">Brik</span>
          <span className="text-xs text-brik-muted ml-1 hidden md:inline">/ Due Diligence</span>
          <div className="hidden md:flex items-center gap-1.5 ml-2 px-2 py-1 rounded-lg bg-brik-surface border border-brik-border">
            <Search size={11} className="text-brik-muted" />
            <span className="text-[11px] text-brik-muted">Acme Technologies Inc.</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brik-accent/10 border border-brik-accent/20 text-brik-accent ml-1">ACME</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-brik-surface/60 border border-brik-border">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-xs text-brik-muted">Systems Online</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brik-surface border border-brik-border flex items-center justify-center cursor-pointer hover:border-brik-border-light transition-colors">
            <Zap size={14} className="text-brik-muted" strokeWidth={1.5} />
          </div>
        </div>
      </motion.header>

      {/* Horizontal tab nav */}
      <div className="sticky top-[57px] z-10 bg-brik-black/95 backdrop-blur-sm border-b border-brik-border px-8">
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
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[calc(100vh-105px)]">
        <main className="flex-1 min-w-0 px-8 py-8">
          <PageContent page={activePage} onNavigate={setActivePage} />
        </main>
        <div className="hidden lg:block px-4 py-8">
          <DDAIPanel />
        </div>
      </div>
    </motion.div>
  )
}
