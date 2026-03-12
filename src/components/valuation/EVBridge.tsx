import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

export default function EVBridge() {
  const { evBridgeData, targetCompany } = useCompanyData()
  // Compute running totals for waterfall
  let running = 0
  const items = evBridgeData.map((item) => {
    if (item.type === "start") {
      running = item.value
      return { ...item, barStart: 0, barEnd: item.value }
    }
    if (item.type === "total") {
      const computedTotal = evBridgeData
        .filter((d) => d.type !== "total")
        .reduce((acc, d) => acc + d.value, 0)
      return { ...item, barStart: 0, barEnd: computedTotal, value: computedTotal }
    }
    const prevRunning = running
    running += item.value
    return {
      ...item,
      barStart: Math.min(prevRunning, running),
      barEnd: Math.max(prevRunning, running),
    }
  })

  const maxVal = Math.max(...items.map((i) => Math.max(i.barStart ?? 0, i.barEnd ?? 0)))

  const scale = (val: number) => (val / maxVal) * 100

  const impliedPerShare = (items[items.length - 1].barEnd ?? 0) / targetCompany.sharesOutstanding

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg border" style={{ borderColor: "#8b5cf630", background: "#8b5cf610" }}>
          <ArrowDown size={14} className="text-violet-400" strokeWidth={1.5} />
        </div>
        <h5 className="text-[11px] font-medium tracking-wider uppercase text-brik-muted">
          Enterprise Value to Equity Bridge
        </h5>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isTotal = item.type === "total"
          const isStart = item.type === "start"
          const isPositive = item.value >= 0
          const barLeft = scale(item.barStart ?? 0)
          const rawWidth = scale((item.barEnd ?? 0) - (item.barStart ?? 0))
          // Skip zero-value items visually (show label only)
          const barWidth = rawWidth

          return (
            <div key={item.label} className="flex items-center gap-0">
              {/* Label */}
              <div className="w-40 shrink-0 text-right pr-4">
                <span
                  className={`text-[11px] ${
                    isTotal
                      ? "text-brik-accent font-semibold"
                      : isStart
                      ? "text-brik-text font-medium"
                      : "text-brik-muted"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Bar track */}
              <div className="flex-1 relative h-7">
                {/* Background track line */}
                <div className="absolute top-3 left-0 right-0 h-px bg-brik-border/20" />

                {item.value !== 0 && (
                  <motion.div
                    className="absolute h-5 top-1 rounded-sm"
                    style={{
                      left: `${barLeft}%`,
                      backgroundColor: isTotal
                        ? "#6366f140"
                        : isStart
                        ? "#3b82f640"
                        : isPositive
                        ? "#22c55e30"
                        : "#ef444430",
                      border: `1px solid ${
                        isTotal
                          ? "#6366f180"
                          : isStart
                          ? "#3b82f680"
                          : isPositive
                          ? "#22c55e60"
                          : "#ef444460"
                      }`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(barWidth, 0.5)}%` }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}

                {/* Value label — positioned after bar end */}
                <span
                  className={`absolute top-0.5 text-[10px] font-mono ${
                    isTotal
                      ? "text-brik-accent font-semibold"
                      : isStart
                      ? "text-brik-text font-medium"
                      : isPositive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                  style={{ left: `${barLeft + barWidth + 1}%` }}
                >
                  {item.value === 0
                    ? "—"
                    : isStart || isTotal
                    ? `$${(Math.abs(item.value) / 1000).toFixed(1)}B`
                    : `${isPositive ? "+" : ""}$${(item.value / 1000).toFixed(1)}B`}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Implied per share */}
      <div className="mt-4 pt-3 border-t border-brik-border flex items-center justify-between">
        <span className="text-[11px] text-brik-muted">
          Implied Equity Value Per Share ({targetCompany.sharesOutstanding}M shares)
        </span>
        <span className="text-sm font-mono font-bold text-brik-gold">
          ${impliedPerShare.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
