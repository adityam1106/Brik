import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users2 } from 'lucide-react'
import CollapsibleSection from '@/components/valuation/CollapsibleSection'
import RiskFlag from './shared/RiskFlag'
import { useCompanyData } from '@/contexts/CompanyContext'
import type { RiskFlag as RiskFlagType } from '@/data/dueDiligenceData'

type SeverityFilter = 'all' | RiskFlagType['severity']

export default function DDRiskGovernance() {
  const { mockRiskFlags } = useCompanyData()
  const [filter, setFilter] = useState<SeverityFilter>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return mockRiskFlags
    return mockRiskFlags.filter((f) => f.severity === filter)
  }, [filter, mockRiskFlags])

  return (
    <div className="space-y-6">
      {/* Risk Flags */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <CollapsibleSection title="Risk Flags">
          <div className="flex gap-1 mb-5 flex-wrap">
            {(['all', 'critical', 'warning', 'informational'] as SeverityFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? 'px-2.5 py-1 rounded text-[10px] uppercase tracking-wider bg-brik-accent/10 border border-brik-accent/20 text-brik-accent'
                    : 'px-2.5 py-1 rounded text-[10px] uppercase tracking-wider text-brik-muted hover:text-brik-text border border-brik-border hover:border-brik-border-light transition-colors'
                }
              >
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((flag, i) => (
              <RiskFlag key={i} flag={flag} />
            ))}
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Governance */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <CollapsibleSection title="Governance">
          <div className="flex items-center gap-2 mb-5">
            <Users2 size={14} className="text-brik-accent" strokeWidth={1.5} />
            <span className="text-xs text-brik-muted uppercase tracking-wider">Board & Executive</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Board Composition */}
            <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4">
              <p className="text-[10px] uppercase tracking-widest text-brik-muted mb-3 font-medium">
                Board Composition
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Members', value: '7', color: 'text-brik-text' },
                  { label: '% Independent', value: '71%', color: 'text-emerald-400' },
                  { label: '% Female', value: '29%', color: 'text-blue-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</div>
                    <div className="text-[9px] uppercase tracking-wider text-brik-muted">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-brik-border">
                <p className="text-[10px] text-brik-muted">
                  Most recent addition: Sarah Kim (former Fortune 100 CFO), appointed Feb 2026.
                  Board meets quarterly; two standing committees — Audit and Compensation.
                </p>
              </div>
            </div>

            {/* Executive Changes */}
            <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4">
              <p className="text-[10px] uppercase tracking-widest text-brik-muted mb-3 font-medium">
                Executive Changes (12 months)
              </p>
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-amber-400 mb-0.5">2</div>
                <div className="text-[9px] uppercase tracking-wider text-brik-muted">Changes</div>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: 'David Patel',
                    role: 'COO (departed)',
                    date: 'Dec 2025',
                    color: 'text-red-400',
                  },
                  {
                    name: 'Priya Shah',
                    role: 'COO (promoted)',
                    date: 'Dec 2025',
                    color: 'text-emerald-400',
                  },
                ].map(({ name, role, date, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-brik-text font-medium">{name}</span>
                      <span className={`text-[10px] ml-2 ${color}`}>{role}</span>
                    </div>
                    <span className="text-[10px] text-brik-muted font-mono">{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>
    </div>
  )
}
