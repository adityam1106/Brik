import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Droplets,
} from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

interface StatItem {
  label: string
  value: string
  highlight?: boolean
}

function StatGroup({
  title,
  icon: Icon,
  stats,
  accentColor,
}: {
  title: string
  icon: React.ComponentType<{ size: number; className?: string; strokeWidth?: number }>
  stats: StatItem[]
  accentColor: string
}) {
  return (
    <div className="rounded-xl border border-brik-border bg-brik-surface/40 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="p-1.5 rounded-lg border"
          style={{
            borderColor: `${accentColor}30`,
            background: `${accentColor}10`,
          }}
        >
          <Icon
            size={14}
            className="opacity-80"
            strokeWidth={1.5}
          />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          {title}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-baseline">
            <span className="text-[11px] text-brik-muted">{stat.label}</span>
            <span
              className={`text-xs font-mono ${
                stat.highlight ? "text-brik-accent" : "text-brik-text"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CompanyOverview() {
  const {
    targetCompany,
    marketData,
    valuationMultiples,
    profitabilityMargins,
    growthMetrics,
    leverageCredit,
    liquidityData,
  } = useCompanyData()

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <h3 className="text-lg font-medium text-brik-text">
          {targetCompany.name}
        </h3>
        <span className="text-sm font-mono text-brik-accent">
          {targetCompany.ticker}
        </span>
        <span className="text-xs text-brik-muted">
          {targetCompany.sector}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatGroup
          title="Market Data"
          icon={TrendingUp}
          accentColor="#3b82f6"
          stats={[
            { label: "Market Cap", value: `$${marketData.marketCap}B`, highlight: true },
            { label: "Enterprise Value", value: `$${marketData.enterpriseValue}B`, highlight: true },
            { label: "52W High", value: `$${marketData.fiftyTwoWeekHigh.toFixed(2)}` },
            { label: "52W Low", value: `$${marketData.fiftyTwoWeekLow.toFixed(2)}` },
            { label: "Beta", value: marketData.beta.toFixed(2) },
            { label: "Avg Volume", value: marketData.avgDailyVolume },
          ]}
        />

        <StatGroup
          title="Valuation Multiples"
          icon={BarChart3}
          accentColor="#6366f1"
          stats={[
            { label: "EV/EBITDA", value: `${valuationMultiples.evEbitda}x` },
            { label: "EV/Revenue", value: `${valuationMultiples.evRevenue}x` },
            { label: "P/E", value: `${valuationMultiples.pe}x` },
            { label: "P/B", value: `${valuationMultiples.pb}x` },
            { label: "P/FCF", value: `${valuationMultiples.pFcf}x` },
            { label: "PEG Ratio", value: valuationMultiples.pegRatio.toFixed(2) },
          ]}
        />

        <StatGroup
          title="Profitability"
          icon={PieChart}
          accentColor="#14b8a6"
          stats={[
            { label: "Gross Margin", value: `${profitabilityMargins.grossMargin}%` },
            { label: "EBITDA Margin", value: `${profitabilityMargins.ebitdaMargin}%` },
            { label: "Net Margin", value: `${profitabilityMargins.netMargin}%` },
            { label: "ROE", value: `${profitabilityMargins.roe}%` },
            { label: "ROA", value: `${profitabilityMargins.roa}%` },
            { label: "ROIC", value: `${profitabilityMargins.roic}%` },
          ]}
        />

        <StatGroup
          title="Growth"
          icon={Activity}
          accentColor="#c9a84c"
          stats={[
            { label: "Revenue (1Y)", value: `${growthMetrics.revenueGrowth1Y}%` },
            { label: "Revenue (3Y)", value: `${growthMetrics.revenueGrowth3Y}%` },
            { label: "EBITDA (1Y)", value: `${growthMetrics.ebitdaGrowth1Y}%` },
            { label: "EBITDA (3Y)", value: `${growthMetrics.ebitdaGrowth3Y}%` },
            { label: "EPS (1Y)", value: `${growthMetrics.epsGrowth1Y}%` },
            { label: "EPS (3Y)", value: `${growthMetrics.epsGrowth3Y}%` },
          ]}
        />

        <StatGroup
          title="Leverage & Credit"
          icon={Shield}
          accentColor="#ef4444"
          stats={[
            { label: "Debt/EBITDA", value: `${leverageCredit.totalDebtEbitda}x` },
            { label: "Net Debt/EBITDA", value: `${leverageCredit.netDebtEbitda}x` },
            { label: "Debt/Equity", value: `${leverageCredit.debtEquity}x` },
            { label: "Interest Coverage", value: `${leverageCredit.interestCoverage}x` },
            { label: "Altman Z-Score", value: leverageCredit.altmanZScore.toFixed(1) },
            { label: "Dividend Yield", value: `${marketData.dividendYield}%` },
          ]}
        />

        <StatGroup
          title="Liquidity"
          icon={Droplets}
          accentColor="#8b5cf6"
          stats={[
            { label: "Current Ratio", value: `${liquidityData.currentRatio}x` },
            { label: "Quick Ratio", value: `${liquidityData.quickRatio}x` },
            { label: "Cash & Equiv.", value: `$${(liquidityData.cashEquivalents / 1000).toFixed(1)}B` },
            { label: "FCF Yield", value: `${liquidityData.fcfYield}%` },
            { label: "Shares Out.", value: marketData.sharesOutstanding },
            { label: "Current Price", value: `$${targetCompany.currentPrice}` },
          ]}
        />
      </div>
    </div>
  )
}
