import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Shield,
  Globe,
  BarChart3,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type DDPage =
  | 'overview'
  | 'news'
  | 'events'
  | 'risk'
  | 'market'
  | 'competitors'
  | 'insiders'

const navItems: { id: DDPage; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'news', label: 'News Feed', icon: Newspaper },
  { id: 'events', label: 'Key Events', icon: Calendar },
  { id: 'risk', label: 'Risk & Governance', icon: Shield },
  { id: 'market', label: 'Market Intelligence', icon: Globe },
  { id: 'competitors', label: 'Competitor Analysis', icon: BarChart3 },
  { id: 'insiders', label: 'Insider Activity', icon: Users },
]

interface DDSidebarProps {
  activePage: DDPage
  onNavigate: (page: DDPage) => void
}

export default function DDSidebar({ activePage, onNavigate }: DDSidebarProps) {
  return (
    <aside className="w-52 shrink-0 sticky top-0 h-screen bg-brik-dark border-r border-brik-border flex flex-col pt-6 pb-8 px-3">
      <p className="text-[9px] uppercase tracking-widest text-brik-muted px-2 mb-3 font-medium">
        Analysis
      </p>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all',
                active
                  ? 'bg-brik-accent/10 border border-brik-accent/20 text-brik-accent'
                  : 'border border-transparent text-brik-muted hover:text-brik-text hover:bg-brik-surface/50',
              )}
            >
              <Icon size={13} strokeWidth={active ? 2 : 1.5} className="shrink-0" />
              <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
