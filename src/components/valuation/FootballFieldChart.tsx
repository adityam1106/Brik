import { motion } from "framer-motion"
import { footballFieldData, targetCompany } from "@/data/valuationData"

export default function FootballFieldChart() {
  const allValues = footballFieldData.flatMap((d) => [d.low, d.high])
  const globalMin = Math.floor((Math.min(...allValues) - 15) / 10) * 10
  const globalMax = Math.ceil((Math.max(...allValues) + 15) / 10) * 10
  const range = globalMax - globalMin

  const scale = (value: number) => ((value - globalMin) / range) * 100

  const currentPricePos = scale(targetCompany.currentPrice)

  // Axis tick marks every $20
  const ticks: number[] = []
  for (let t = globalMin; t <= globalMax; t += 20) {
    ticks.push(t)
  }

  // Label column must match the label div width
  const LABEL_CLS = "w-44"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          Valuation Range — Implied Share Price ($/share)
        </h4>
        <div className="flex items-center gap-1.5">
          <div className="w-px h-3 border-l-2 border-dashed border-brik-gold/60" />
          <span className="text-[10px] text-brik-muted">
            Current: ${targetCompany.currentPrice}
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3 mb-1">
        {footballFieldData.map((d, i) => {
          const leftPos = scale(d.low)
          const barWidth = scale(d.high) - scale(d.low)
          const midPos = scale(d.mid)

          return (
            <div key={d.methodology} className="flex items-center gap-0 group">
              {/* Label */}
              <div className={`${LABEL_CLS} shrink-0 text-right pr-4`}>
                <span className="text-[11px] text-brik-muted group-hover:text-brik-text transition-colors">
                  {d.methodology}
                </span>
              </div>

              {/* Bar area */}
              <div className="flex-1 relative h-12">
                {/* Per-row current price dashed line */}
                <div
                  className="absolute top-0 bottom-0 w-px z-10 pointer-events-none"
                  style={{ left: `${currentPricePos}%` }}
                >
                  <div className="w-full h-full border-l-2 border-dashed border-brik-gold/30" />
                </div>

                {/* Range bar */}
                <motion.div
                  className="absolute h-8 top-2 rounded-md group-hover:brightness-125 transition-all cursor-default"
                  style={{
                    left: `${leftPos}%`,
                    backgroundColor: `${d.color}20`,
                    border: `1px solid ${d.color}45`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{
                    duration: 0.9,
                    delay: 0.3 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Gradient fill */}
                  <div
                    className="absolute inset-0 rounded-md opacity-40"
                    style={{
                      background: `linear-gradient(90deg, ${d.color}10, ${d.color}40, ${d.color}10)`,
                    }}
                  />
                </motion.div>

                {/* Mid marker */}
                <motion.div
                  className="absolute top-1.5 h-9 w-0.5 rounded-full z-[1]"
                  style={{ left: `${midPos}%`, backgroundColor: d.color }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                />

                {/* Mid value — above bar */}
                <motion.span
                  className="absolute text-[9px] font-mono font-semibold -translate-x-1/2 z-[2] top-0"
                  style={{ left: `${midPos}%`, color: d.color }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  ${d.mid.toFixed(0)}
                </motion.span>

                {/* Low label */}
                <span
                  className="absolute bottom-0 text-[9px] font-mono text-brik-muted/70 -translate-x-1/2"
                  style={{ left: `${leftPos}%` }}
                >
                  ${d.low.toFixed(0)}
                </span>

                {/* High label */}
                <span
                  className="absolute bottom-0 text-[9px] font-mono text-brik-muted/70 -translate-x-1/2"
                  style={{ left: `${leftPos + barWidth}%` }}
                >
                  ${d.high.toFixed(0)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* X-axis ticks — aligned with the chart area (same flex layout as rows) */}
      <div className="flex items-start">
        <div className={`${LABEL_CLS} shrink-0`} />
        <div className="flex-1 relative h-7 border-t border-brik-border/30">
          {/* Current price axis marker */}
          <div
            className="absolute -top-px flex flex-col items-center"
            style={{ left: `${currentPricePos}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-px h-2 bg-brik-gold/60" />
            <span className="text-[9px] font-mono text-brik-gold font-semibold whitespace-nowrap mt-0.5">
              ${targetCompany.currentPrice}
            </span>
          </div>

          {/* Scale ticks */}
          {ticks.map((t) => {
            const pos = scale(t)
            if (pos < 0 || pos > 100) return null
            return (
              <div
                key={t}
                className="absolute -top-px flex flex-col items-center"
                style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-px h-1.5 bg-brik-border/50" />
                <span className="text-[8px] font-mono text-brik-muted/40 mt-0.5">
                  ${t}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
