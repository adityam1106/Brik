import { useState } from "react"
import { BarChart3, Filter } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

type MarketCapFilter = "all" | "small" | "mid" | "large"
type GrowthFilter = "all" | "high" | "medium" | "low"

const marketCapLabel: Record<MarketCapFilter, string> = {
  all: "All",
  small: "< $30B",
  mid: "$30–80B",
  large: "> $80B",
}

const growthLabel: Record<GrowthFilter, string> = {
  all: "All",
  high: "> 30%",
  medium: "15–30%",
  low: "< 15%",
}

export default function ComparableCompanies() {
  const { comparableCompanies } = useCompanyData()
  const [mcFilter, setMcFilter] = useState<MarketCapFilter>("all")
  const [growthFilter, setGrowthFilter] = useState<GrowthFilter>("all")

  const filtered = comparableCompanies.filter((c) => {
    const mcOk =
      mcFilter === "all" ||
      (mcFilter === "small" && c.marketCap < 30) ||
      (mcFilter === "mid" && c.marketCap >= 30 && c.marketCap <= 80) ||
      (mcFilter === "large" && c.marketCap > 80)

    const growOk =
      growthFilter === "all" ||
      (growthFilter === "high" && c.revenueGrowth > 30) ||
      (growthFilter === "medium" && c.revenueGrowth >= 15 && c.revenueGrowth <= 30) ||
      (growthFilter === "low" && c.revenueGrowth < 15)

    return mcOk && growOk
  })

  const validPe = filtered.map((c) => c.pe).filter((v) => v > 0)

  const stats =
    filtered.length > 0
      ? {
          evEbitda: { median: median(filtered.map((c) => c.evEbitda)), mean: mean(filtered.map((c) => c.evEbitda)) },
          pe: validPe.length > 0 ? { median: median(validPe), mean: mean(validPe) } : null,
          evRevenue: { median: median(filtered.map((c) => c.evRevenue)), mean: mean(filtered.map((c) => c.evRevenue)) },
          marketCap: { median: median(filtered.map((c) => c.marketCap)), mean: mean(filtered.map((c) => c.marketCap)) },
          revenueGrowth: { median: median(filtered.map((c) => c.revenueGrowth)), mean: mean(filtered.map((c) => c.revenueGrowth)) },
          ebitdaMargin: { median: median(filtered.map((c) => c.ebitdaMargin)), mean: mean(filtered.map((c) => c.ebitdaMargin)) },
        }
      : null

  function FilterPill<T extends string>({
    options,
    labels,
    value,
    onChange,
  }: {
    options: T[]
    labels: Record<T, string>
    value: T
    onChange: (v: T) => void
  }) {
    return (
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              value === opt
                ? "bg-brik-accent/20 border border-brik-accent/40 text-brik-accent"
                : "border border-brik-border text-brik-muted hover:border-brik-border-light hover:text-brik-text"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg border" style={{ borderColor: "#6366f130", background: "#6366f110" }}>
          <BarChart3 size={14} className="text-indigo-400" strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          Comparable Companies
        </h4>
        <span className="ml-auto text-[10px] text-brik-muted/60">{filtered.length} companies</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-lg bg-brik-dark/40 border border-brik-border/40">
        <div className="flex items-center gap-2">
          <Filter size={11} className="text-brik-muted/60" />
          <span className="text-[10px] uppercase tracking-wider text-brik-muted/60">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-brik-muted">Mkt Cap</span>
          <FilterPill
            options={["all", "small", "mid", "large"] as MarketCapFilter[]}
            labels={marketCapLabel}
            value={mcFilter}
            onChange={setMcFilter}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-brik-muted">Rev Growth</span>
          <FilterPill
            options={["all", "high", "medium", "low"] as GrowthFilter[]}
            labels={growthLabel}
            value={growthFilter}
            onChange={setGrowthFilter}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brik-border">
              <th className="p-2.5 text-left text-brik-muted font-medium">Company</th>
              <th className="p-2.5 text-left text-brik-muted font-medium">Ticker</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">EV/EBITDA</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">P/E</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">EV/Rev</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Rev Growth</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">EBITDA Mgn</th>
              <th className="p-2.5 text-right text-brik-muted font-medium">Mkt Cap ($B)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-brik-muted/60 text-[11px]">
                  No companies match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.company}
                  className={`border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors ${
                    i % 2 === 0 ? "bg-brik-dark/20" : ""
                  }`}
                >
                  <td className="p-2.5 text-brik-text font-medium">{c.company}</td>
                  <td className="p-2.5 text-brik-accent font-mono text-[10px]">{c.ticker}</td>
                  <td className="p-2.5 text-right font-mono text-brik-text">{c.evEbitda.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-brik-text">
                    {c.pe > 0 ? `${c.pe.toFixed(1)}x` : <span className="text-brik-muted">N/A</span>}
                  </td>
                  <td className="p-2.5 text-right font-mono text-brik-text">{c.evRevenue.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-emerald-400/80">{c.revenueGrowth.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-text">{c.ebitdaMargin.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-text">${c.marketCap.toFixed(1)}</td>
                </tr>
              ))
            )}

            {stats && filtered.length > 0 && (
              <>
                {/* Median row */}
                <tr className="border-t-2 border-brik-border bg-brik-surface/40">
                  <td className="p-2.5 text-brik-accent font-semibold">Median</td>
                  <td className="p-2.5" />
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">{stats.evEbitda.median.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">
                    {stats.pe ? `${stats.pe.median.toFixed(1)}x` : "N/A"}
                  </td>
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">{stats.evRevenue.median.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">{stats.revenueGrowth.median.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">{stats.ebitdaMargin.median.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-accent font-semibold">${stats.marketCap.median.toFixed(1)}</td>
                </tr>

                {/* Mean row */}
                <tr className="bg-brik-surface/40">
                  <td className="p-2.5 text-brik-muted font-semibold">Mean</td>
                  <td className="p-2.5" />
                  <td className="p-2.5 text-right font-mono text-brik-muted">{stats.evEbitda.mean.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-brik-muted">
                    {stats.pe ? `${stats.pe.mean.toFixed(1)}x` : "N/A"}
                  </td>
                  <td className="p-2.5 text-right font-mono text-brik-muted">{stats.evRevenue.mean.toFixed(1)}x</td>
                  <td className="p-2.5 text-right font-mono text-brik-muted">{stats.revenueGrowth.mean.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-muted">{stats.ebitdaMargin.mean.toFixed(1)}%</td>
                  <td className="p-2.5 text-right font-mono text-brik-muted">${stats.marketCap.mean.toFixed(1)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
