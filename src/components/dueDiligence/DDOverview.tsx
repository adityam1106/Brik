import DDDashboard from './DDDashboard'
import type { DDPage } from './DDSidebar'

interface DDOverviewProps {
  onNavigate: (page: DDPage) => void
}

export default function DDOverview({ onNavigate }: DDOverviewProps) {
  return <DDDashboard onNavigate={onNavigate} />
}
