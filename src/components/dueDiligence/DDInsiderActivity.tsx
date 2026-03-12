import { motion } from 'framer-motion'
import CollapsibleSection from '@/components/valuation/CollapsibleSection'
import { useFinnhubInsiders } from '@/hooks/useFinnhubInsiders'
import { cn } from '@/lib/utils'

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function fmtShares(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export default function DDInsiderActivity({ ticker }: { ticker: string }) {
  const { data: txns, loading } = useFinnhubInsiders(ticker)

  const buys = txns.filter((t) => t.transactionType === 'buy')
  const sells = txns.filter((t) => t.transactionType === 'sell')
  const totalBuyValue = buys.reduce((s, t) => s + t.value, 0)
  const totalSellValue = sells.reduce((s, t) => s + t.value, 0)
  const netValue = totalBuyValue - totalSellValue

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <CollapsibleSection title="Insider Summary">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-0.5">{buys.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">Total Buys</div>
              <div className="text-[11px] text-brik-muted">{fmt(totalBuyValue)}</div>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-0.5">{sells.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-400/70 mb-1">Total Sells</div>
              <div className="text-[11px] text-brik-muted">{fmt(totalSellValue)}</div>
            </div>
            <div className={cn(
              'rounded-xl border p-4 text-center',
              netValue >= 0
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-red-500/20 bg-red-500/5',
            )}>
              <div className={cn(
                'text-2xl font-bold mb-0.5',
                netValue >= 0 ? 'text-emerald-400' : 'text-red-400',
              )}>
                {netValue >= 0 ? '+' : ''}{fmt(Math.abs(netValue))}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-brik-muted mb-1">Net Value</div>
              <div className="text-[11px] text-brik-muted">{netValue >= 0 ? 'Net Buying' : 'Net Selling'}</div>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <CollapsibleSection title="Transaction Log">
          {loading && (
            <div className="space-y-2 animate-pulse">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 p-2.5 border-b border-brik-border/50">
                  <div className="h-3 w-28 rounded bg-brik-surface/60" />
                  <div className="h-3 w-20 rounded bg-brik-surface/60" />
                  <div className="h-3 w-10 rounded bg-brik-surface/60" />
                  <div className="h-3 w-16 rounded bg-brik-surface/60 ml-auto" />
                </div>
              ))}
            </div>
          )}
          <div className="overflow-x-auto -mx-2">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr>
                  {['Name', 'Title', 'Type', 'Shares', 'Value', 'Date', 'Flag'].map((h) => (
                    <th
                      key={h}
                      className="text-left p-2.5 text-[10px] uppercase tracking-wider text-brik-muted border-b border-brik-border font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr
                    key={i}
                    className={cn(
                      'border-b border-brik-border/50 hover:bg-brik-surface/30 transition-colors',
                    )}
                  >
                    <td className="p-2.5 text-brik-text font-medium">{t.name}</td>
                    <td className="p-2.5 text-brik-muted">{t.title}</td>
                    <td className="p-2.5">
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium',
                          t.transactionType === 'buy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400',
                        )}
                      >
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-brik-text">{fmtShares(t.shares)}</td>
                    <td className="p-2.5 font-mono text-brik-text">
                      {t.value > 0 ? fmt(t.value) : '—'}
                    </td>
                    <td className="p-2.5 font-mono text-brik-muted">{t.date}</td>
                    <td className="p-2.5">
                      {t.isUnusual && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                          Unusual
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      </motion.div>
    </div>
  )
}
