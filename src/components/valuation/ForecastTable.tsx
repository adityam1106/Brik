import { TrendingUp } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

export default function ForecastTable() {
  const { forecastData } = useCompanyData()
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg border" style={{ borderColor: "#14b8a630", background: "#14b8a610" }}>
          <TrendingUp size={14} className="text-teal-400" strokeWidth={1.5} />
        </div>
        <h5 className="text-[11px] font-medium tracking-wider uppercase text-brik-muted">
          5-Year Financial Forecast
        </h5>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brik-border">
              <th className="p-2.5 text-left text-brik-muted font-medium">Metric</th>
              {forecastData.map((fy) => (
                <th key={fy.year} className="p-2.5 text-right text-brik-muted font-medium">
                  <span className={fy.year.endsWith("A") ? "text-brik-text" : ""}>
                    {fy.year}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Revenue */}
            <tr className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors">
              <td className="p-2.5 text-brik-text font-medium">Revenue ($M)</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-brik-text">
                  {fy.revenue.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Revenue Growth */}
            <tr className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors bg-brik-dark/20">
              <td className="p-2.5 text-brik-muted pl-6">Growth %</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-brik-muted">
                  {fy.revenueGrowth.toFixed(1)}%
                </td>
              ))}
            </tr>

            {/* EBITDA */}
            <tr className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors">
              <td className="p-2.5 text-brik-text font-medium">EBITDA ($M)</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-brik-text">
                  {fy.ebitda.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* EBITDA Margin */}
            <tr className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors bg-brik-dark/20">
              <td className="p-2.5 text-brik-muted pl-6">Margin %</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-brik-muted">
                  {fy.ebitdaMargin.toFixed(1)}%
                </td>
              ))}
            </tr>

            {/* CapEx */}
            <tr className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors">
              <td className="p-2.5 text-brik-text font-medium">CapEx ($M)</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-red-400/80">
                  ({fy.capex.toLocaleString()})
                </td>
              ))}
            </tr>

            {/* FCF */}
            <tr className="border-t-2 border-brik-border bg-brik-surface/40">
              <td className="p-2.5 text-brik-accent font-semibold">Free Cash Flow ($M)</td>
              {forecastData.map((fy) => (
                <td key={fy.year} className="p-2.5 text-right font-mono text-brik-accent font-semibold">
                  {fy.fcf.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
