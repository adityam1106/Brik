import { Target, TrendingUp } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

export default function ValuationSummary() {
  const { valuationSummary, targetCompany } = useCompanyData()
  // Weighted average implied share price
  const weightedMid =
    valuationSummary.reduce((acc, m) => acc + m.impliedMid * m.weight, 0) /
    valuationSummary.reduce((acc, m) => acc + m.weight, 0)

  const weightedLow =
    valuationSummary.reduce((acc, m) => acc + m.impliedLow * m.weight, 0) /
    valuationSummary.reduce((acc, m) => acc + m.weight, 0)

  const weightedHigh =
    valuationSummary.reduce((acc, m) => acc + m.impliedHigh * m.weight, 0) /
    valuationSummary.reduce((acc, m) => acc + m.weight, 0)

  const upside = ((weightedMid - targetCompany.currentPrice) / targetCompany.currentPrice) * 100

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-brik-gold/10 border border-brik-gold/20">
          <Target size={14} className="text-brik-gold" strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          Valuation Summary
        </h4>
      </div>

      {/* Top row: key price targets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-brik-muted mb-1">
            Current Price
          </p>
          <p className="text-xl font-mono font-bold text-brik-text">
            ${targetCompany.currentPrice.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-brik-gold/30 bg-brik-gold/5 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-brik-muted mb-1">
            Weighted Target
          </p>
          <p className="text-xl font-mono font-bold text-brik-gold">
            ${weightedMid.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-brik-muted mb-1">
            Target Range
          </p>
          <p className="text-lg font-mono font-medium text-brik-text">
            ${weightedLow.toFixed(0)}–${weightedHigh.toFixed(0)}
          </p>
        </div>
        <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-brik-muted mb-1">
            Upside / Downside
          </p>
          <p
            className={`text-xl font-mono font-bold ${
              upside >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {upside >= 0 ? "+" : ""}
            {upside.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Method breakdown */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brik-border">
              <th className="p-2.5 text-left text-brik-muted font-medium">Methodology</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Low</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Mid</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">High</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Weight</th>
            </tr>
          </thead>
          <tbody>
            {valuationSummary.map((m) => (
              <tr
                key={m.method}
                className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors"
              >
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-brik-text font-medium">{m.method}</span>
                  </div>
                </td>
                <td className="p-2.5 text-right font-mono text-brik-text">
                  ${m.impliedLow.toFixed(1)}
                </td>
                <td className="p-2.5 text-right font-mono text-brik-text font-semibold">
                  ${m.impliedMid.toFixed(1)}
                </td>
                <td className="p-2.5 text-right font-mono text-brik-text">
                  ${m.impliedHigh.toFixed(1)}
                </td>
                <td className="p-2.5 text-right">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-brik-surface border border-brik-border text-brik-muted font-mono text-[10px]">
                    {m.weight}%
                  </span>
                </td>
              </tr>
            ))}
            {/* Weighted row */}
            <tr className="border-t-2 border-brik-border bg-brik-surface/40">
              <td className="p-2.5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-brik-gold" />
                  <span className="text-brik-gold font-semibold">Weighted Average</span>
                </div>
              </td>
              <td className="p-2.5 text-right font-mono text-brik-gold font-semibold">
                ${weightedLow.toFixed(1)}
              </td>
              <td className="p-2.5 text-right font-mono text-brik-gold font-bold">
                ${weightedMid.toFixed(1)}
              </td>
              <td className="p-2.5 text-right font-mono text-brik-gold font-semibold">
                ${weightedHigh.toFixed(1)}
              </td>
              <td className="p-2.5 text-right font-mono text-brik-gold font-semibold">
                100%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
