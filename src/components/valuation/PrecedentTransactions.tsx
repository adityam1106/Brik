import { GitMerge } from "lucide-react"
import { precedentTransactions } from "@/data/valuationData"

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

export default function PrecedentTransactions() {
  const validPremiums = precedentTransactions
    .map((d) => d.premium)
    .filter((v) => v > 0)

  const stats = {
    dealValue: {
      median: median(precedentTransactions.map((d) => d.dealValue)),
      mean: mean(precedentTransactions.map((d) => d.dealValue)),
    },
    evEbitda: {
      median: median(precedentTransactions.map((d) => d.evEbitda)),
      mean: mean(precedentTransactions.map((d) => d.evEbitda)),
    },
    premium: {
      median: median(validPremiums),
      mean: mean(validPremiums),
    },
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg border" style={{ borderColor: "#c9a84c30", background: "#c9a84c10" }}>
          <GitMerge size={14} className="text-brik-gold" strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          Precedent Transactions
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brik-border">
              <th className="p-2.5 text-left text-brik-muted font-medium">Date</th>
              <th className="p-2.5 text-left text-brik-muted font-medium">Target</th>
              <th className="p-2.5 text-left text-brik-muted font-medium">Acquirer</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Deal ($B)</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">EV/EBITDA</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Premium</th>
            </tr>
          </thead>
          <tbody>
            {precedentTransactions.map((d, i) => (
              <tr
                key={d.target}
                className={`border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors ${
                  i % 2 === 0 ? "bg-brik-dark/20" : ""
                }`}
              >
                <td className="p-2.5 text-brik-muted font-mono">{d.date}</td>
                <td className="p-2.5 text-brik-text font-medium">{d.target}</td>
                <td className="p-2.5 text-brik-text">{d.acquirer}</td>
                <td className="p-2.5 text-right font-mono text-brik-text">
                  ${d.dealValue.toFixed(1)}
                </td>
                <td className="p-2.5 text-right font-mono text-brik-text">
                  {d.evEbitda.toFixed(1)}x
                </td>
                <td className="p-2.5 text-right font-mono">
                  {d.premium > 0 ? (
                    <span className="text-emerald-400">{d.premium.toFixed(1)}%</span>
                  ) : (
                    <span className="text-brik-muted">N/A</span>
                  )}
                </td>
              </tr>
            ))}

            {/* Median */}
            <tr className="border-t-2 border-brik-border bg-brik-surface/40">
              <td className="p-2.5" colSpan={3}>
                <span className="text-brik-accent font-semibold">Median</span>
              </td>
              <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">
                ${stats.dealValue.median.toFixed(1)}
              </td>
              <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">
                {stats.evEbitda.median.toFixed(1)}x
              </td>
              <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">
                {stats.premium.median.toFixed(1)}%
              </td>
            </tr>

            {/* Mean */}
            <tr className="bg-brik-surface/40">
              <td className="p-2.5" colSpan={3}>
                <span className="text-brik-muted font-semibold">Mean</span>
              </td>
              <td className="p-2.5 text-right font-mono text-brik-muted">
                ${stats.dealValue.mean.toFixed(1)}
              </td>
              <td className="p-2.5 text-right font-mono text-brik-muted">
                {stats.evEbitda.mean.toFixed(1)}x
              </td>
              <td className="p-2.5 text-right font-mono text-brik-muted">
                {stats.premium.mean.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
