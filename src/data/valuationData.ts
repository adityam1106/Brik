// ============================================
// Target Company
// ============================================
export const targetCompany = {
  name: "Acme Technologies Inc.",
  ticker: "ACME",
  sector: "Enterprise Software",
  sharesOutstanding: 185.4, // millions
  netDebt: 1_250, // $M
  currentPrice: 142.5, // $/share
}

// ============================================
// Bloomberg-style Company Overview Stats
// ============================================
export const marketData = {
  marketCap: 26.42, // $B
  enterpriseValue: 27.67, // $B
  fiftyTwoWeekHigh: 165.0,
  fiftyTwoWeekLow: 118.5,
  beta: 1.32,
  avgDailyVolume: "4.2M",
  dividendYield: 0.0, // %
  sharesOutstanding: "185.4M",
}

export const valuationMultiples = {
  evEbitda: 9.6, // x
  evRevenue: 3.3, // x
  pe: 28.4, // x
  pb: 5.8, // x
  pFcf: 22.1, // x
  pegRatio: 2.27,
}

export const profitabilityMargins = {
  grossMargin: 72.4, // %
  ebitdaMargin: 34.0, // %
  netMargin: 14.8, // %
  roe: 21.2, // %
  roa: 8.6, // %
  roic: 15.4, // %
}

export const growthMetrics = {
  revenueGrowth1Y: 12.5, // %
  revenueGrowth3Y: 18.2, // % CAGR
  ebitdaGrowth1Y: 8.1, // %
  ebitdaGrowth3Y: 15.6, // % CAGR
  epsGrowth1Y: 10.3, // %
  epsGrowth3Y: 16.8, // % CAGR
}

export const leverageCredit = {
  totalDebtEbitda: 3.2, // x
  netDebtEbitda: 2.8, // x
  debtEquity: 1.45, // x
  interestCoverage: 6.8, // x
  altmanZScore: 2.9,
}

export const liquidityData = {
  currentRatio: 1.8,
  quickRatio: 1.4,
  cashEquivalents: 2_150, // $M
  fcfYield: 4.5, // %
}

// ============================================
// AI Analysis — Red Flags & Strengths
// ============================================
export interface AIFinding {
  severity: "critical" | "warning" | "positive"
  category: string
  title: string
  detail: string
  valuationImpact?: string // e.g. "-$8–12/share" or "+$5–8/share"
}

export const aiFindings: AIFinding[] = [
  {
    severity: "critical",
    category: "Leverage",
    title: "High Debt Load",
    detail:
      "Net Debt/EBITDA of 2.8x exceeds peer median of 1.8x. Interest coverage at 6.8x leaves limited cushion for margin compression.",
    valuationImpact: "-$8–12/share",
  },
  {
    severity: "critical",
    category: "Margins",
    title: "EBITDA Margin Declining",
    detail:
      "EBITDA margin dropped 340bps YoY from 37.4% to 34.0%, driven by rising S&M spend and cloud migration costs.",
    valuationImpact: "-$10–15/share",
  },
  {
    severity: "warning",
    category: "Growth",
    title: "Revenue Growth Decelerating",
    detail:
      "Revenue growth slowed to 12.5% from 18.2% 3Y CAGR. New bookings pipeline suggests further deceleration to ~10%.",
    valuationImpact: "-$5–8/share",
  },
  {
    severity: "warning",
    category: "Concentration",
    title: "Customer Concentration Risk",
    detail:
      "Top 3 clients represent 38% of total revenue. Loss of any major client could materially impact financials.",
    valuationImpact: "-$3–6/share",
  },
  {
    severity: "warning",
    category: "Governance",
    title: "Insider Selling Activity",
    detail:
      "CFO sold 45,000 shares ($6.4M) in the last 90 days. Two board members also reduced positions.",
    valuationImpact: "-$2–4/share",
  },
  {
    severity: "positive",
    category: "Cash Flow",
    title: "Strong FCF Conversion",
    detail:
      "65% EBITDA-to-FCF conversion rate, above peer median of 55%. Supports debt servicing and potential buybacks.",
    valuationImpact: "+$5–8/share",
  },
  {
    severity: "positive",
    category: "Market Position",
    title: "Market Leadership",
    detail:
      "#2 position in a $45B TAM with 12% market share. Strong competitive moat via switching costs and network effects.",
    valuationImpact: "+$8–12/share",
  },
  {
    severity: "positive",
    category: "Revenue Quality",
    title: "High Recurring Revenue",
    detail:
      "87% of revenue is subscription-based with 118% net dollar retention rate. Low churn at 5.2% annually.",
    valuationImpact: "+$6–10/share",
  },
]

export const aiRiskScore = 6.2 // out of 10

// ============================================
// Football Field — Valuation Ranges
// ============================================
export interface ValuationRange {
  methodology: string
  low: number
  mid: number
  high: number
  color: string
}

export const footballFieldData: ValuationRange[] = [
  {
    methodology: "DCF Analysis",
    low: 152.0,
    mid: 168.5,
    high: 189.0,
    color: "#3b82f6",
  },
  {
    methodology: "Comparable Companies",
    low: 145.0,
    mid: 162.0,
    high: 178.5,
    color: "#6366f1",
  },
  {
    methodology: "Precedent Transactions",
    low: 158.0,
    mid: 175.0,
    high: 198.0,
    color: "#c9a84c",
  },
  {
    methodology: "52-Week Trading Range",
    low: 118.5,
    mid: 142.5,
    high: 165.0,
    color: "#14b8a6",
  },
  {
    methodology: "Analyst Price Targets",
    low: 140.0,
    mid: 160.0,
    high: 185.0,
    color: "#ec4899",
  },
]

// ============================================
// DCF Calculator Defaults
// ============================================
export const dcfDefaults = {
  revenue: 8_450,
  ebitda: 2_870,
  revenueGrowthRate: 12.5,
  wacc: 10.0,
  terminalGrowthRate: 2.5,
  projectionPeriod: 5,
}

// ============================================
// Comparable Companies
// ============================================
export interface CompanyComp {
  company: string
  evEbitda: number
  pe: number // -1 = N/A
  evRevenue: number
  marketCap: number // $B
  revenueGrowth: number // %
  ebitdaMargin: number // %
  ticker: string
}

export const comparableCompanies: CompanyComp[] = [
  { company: "Datadog Inc.", ticker: "DDOG", evEbitda: 62.3, pe: 78.5, evRevenue: 18.2, marketCap: 42.1, revenueGrowth: 25.2, ebitdaMargin: 29.2 },
  { company: "CrowdStrike Holdings", ticker: "CRWD", evEbitda: 55.8, pe: 65.2, evRevenue: 15.8, marketCap: 68.5, revenueGrowth: 33.1, ebitdaMargin: 28.4 },
  { company: "Snowflake Inc.", ticker: "SNOW", evEbitda: 198.5, pe: -1, evRevenue: 22.4, marketCap: 55.3, revenueGrowth: 36.0, ebitdaMargin: 11.3 },
  { company: "Palo Alto Networks", ticker: "PANW", evEbitda: 42.1, pe: 48.3, evRevenue: 12.6, marketCap: 112.8, revenueGrowth: 16.2, ebitdaMargin: 30.0 },
  { company: "ServiceNow Inc.", ticker: "NOW", evEbitda: 38.5, pe: 55.7, evRevenue: 14.2, marketCap: 148.2, revenueGrowth: 22.8, ebitdaMargin: 36.8 },
  { company: "Zscaler Inc.", ticker: "ZS", evEbitda: 72.4, pe: 89.1, evRevenue: 20.8, marketCap: 28.9, revenueGrowth: 34.5, ebitdaMargin: 28.8 },
  { company: "Fortinet Inc.", ticker: "FTNT", evEbitda: 28.6, pe: 38.2, evRevenue: 9.8, marketCap: 58.7, revenueGrowth: 20.1, ebitdaMargin: 34.2 },
  { company: "Okta Inc.", ticker: "OKTA", evEbitda: 85.2, pe: 112.4, evRevenue: 11.5, marketCap: 14.2, revenueGrowth: 18.6, ebitdaMargin: 13.5 },
]

// ============================================
// Precedent Transactions
// ============================================
export interface PrecedentDeal {
  date: string
  target: string
  acquirer: string
  dealValue: number // $B
  evEbitda: number // x
  premium: number // %
}

export const precedentTransactions: PrecedentDeal[] = [
  { date: "Oct 2024", target: "Ansys Inc.", acquirer: "Synopsys", dealValue: 35.0, evEbitda: 36.2, premium: 29.0 },
  { date: "Mar 2024", target: "HashiCorp", acquirer: "IBM", dealValue: 6.4, evEbitda: 45.8, premium: 42.5 },
  { date: "Dec 2023", target: "Splunk Inc.", acquirer: "Cisco", dealValue: 28.0, evEbitda: 32.5, premium: 31.0 },
  { date: "Sep 2023", target: "Alteryx", acquirer: "Clearlake Capital", dealValue: 4.4, evEbitda: 28.1, premium: 52.0 },
  { date: "May 2023", target: "VMware Inc.", acquirer: "Broadcom", dealValue: 69.0, evEbitda: 25.4, premium: 44.0 },
  { date: "Jan 2023", target: "Coupa Software", acquirer: "Thoma Bravo", dealValue: 8.0, evEbitda: 38.7, premium: 77.0 },
  { date: "Sep 2022", target: "Figma", acquirer: "Adobe", dealValue: 20.0, evEbitda: 100.0, premium: 0.0 },
]

// ============================================
// 5-Year Forecast Data
// ============================================
export interface ForecastYear {
  year: string
  revenue: number    // $M
  revenueGrowth: number // %
  ebitda: number     // $M
  ebitdaMargin: number // %
  fcf: number        // $M
  capex: number      // $M
}

export const forecastData: ForecastYear[] = [
  { year: "2024A", revenue: 8_450, revenueGrowth: 12.5, ebitda: 2_870, ebitdaMargin: 34.0, fcf: 1_866, capex: 423 },
  { year: "2025E", revenue: 9_507, revenueGrowth: 12.5, ebitda: 3_232, ebitdaMargin: 34.0, fcf: 2_101, capex: 475 },
  { year: "2026E", revenue: 10_570, revenueGrowth: 11.2, ebitda: 3_593, ebitdaMargin: 34.0, fcf: 2_335, capex: 529 },
  { year: "2027E", revenue: 11_627, revenueGrowth: 10.0, ebitda: 3_953, ebitdaMargin: 34.0, fcf: 2_570, capex: 581 },
  { year: "2028E", revenue: 12_558, revenueGrowth: 8.0, ebitda: 4_270, ebitdaMargin: 34.0, fcf: 2_776, capex: 628 },
  { year: "2029E", revenue: 13_437, revenueGrowth: 7.0, ebitda: 4_569, ebitdaMargin: 34.0, fcf: 2_970, capex: 672 },
]

// ============================================
// EV Bridge Data (waterfall)
// ============================================
export interface EVBridgeItem {
  label: string
  value: number // $M — positive adds, negative subtracts
  type: "start" | "add" | "subtract" | "total"
}

export const evBridgeData: EVBridgeItem[] = [
  { label: "Enterprise Value", value: 27_670, type: "start" },
  { label: "Less: Total Debt", value: -3_400, type: "subtract" },
  { label: "Plus: Cash & Equiv.", value: 2_150, type: "add" },
  { label: "Less: Minority Int.", value: -180, type: "subtract" },
  { label: "Less: Pref. Equity", value: 0, type: "subtract" },
  { label: "Equity Value", value: 26_240, type: "total" },
]

// ============================================
// Valuation Summary (composite view)
// ============================================
export interface ValuationMethodSummary {
  method: string
  impliedLow: number
  impliedMid: number
  impliedHigh: number
  weight: number // portfolio weight %
  color: string
}

export const valuationSummary: ValuationMethodSummary[] = [
  { method: "DCF Analysis", impliedLow: 152.0, impliedMid: 168.5, impliedHigh: 189.0, weight: 35, color: "#3b82f6" },
  { method: "Comparable Companies", impliedLow: 145.0, impliedMid: 162.0, impliedHigh: 178.5, weight: 25, color: "#6366f1" },
  { method: "Precedent Transactions", impliedLow: 158.0, impliedMid: 175.0, impliedHigh: 198.0, weight: 20, color: "#c9a84c" },
  { method: "52-Week Range", impliedLow: 118.5, impliedMid: 142.5, impliedHigh: 165.0, weight: 10, color: "#14b8a6" },
  { method: "Analyst Targets", impliedLow: 140.0, impliedMid: 160.0, impliedHigh: 185.0, weight: 10, color: "#ec4899" },
]
