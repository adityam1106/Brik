// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface NewsArticle {
  id: string
  headline: string
  source: string
  url: string
  timestamp: number           // unix ms
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number      // 0–1
  summary: string
  category: string
}

export interface CorporateEvent {
  date: string
  type: 'acquisition' | 'partnership' | 'management' | 'fundraising' | 'product' | 'regulatory'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

export interface InsiderTransaction {
  name: string
  title: string
  transactionType: 'buy' | 'sell'
  shares: number
  value: number               // USD
  date: string
  isUnusual: boolean
}

export interface RiskFlag {
  severity: 'critical' | 'warning' | 'informational'
  category: string
  title: string
  detail: string
  detectedDate: string
}

export interface Competitor {
  name: string
  ticker: string
  marketShare: number         // %
  recentDevelopments: string[]
  recentActivity: string
  trend: 'gaining' | 'losing' | 'stable'
}

export interface MarketIntelItem {
  category: string
  insight: string
  trend: 'positive' | 'negative' | 'neutral'
  source: string
  date: string
  impact: 'high' | 'medium' | 'low'
}

export interface AIMemoCategoryItem {
  heading: string
  points: string[]
}

export interface AIMemo {
  opportunities: AIMemoCategoryItem
  risks: AIMemoCategoryItem
  strategicDevelopments: AIMemoCategoryItem
  financialImplications: AIMemoCategoryItem
}

// ─── Risk Score ───────────────────────────────────────────────────────────────

export const ddRiskScore = 5.8

// ─── Key Developments ─────────────────────────────────────────────────────────

export const ddKeyDevelopments: Record<'7d' | '30d' | '90d', string[]> = {
  '7d': [
    'CEO James Wheeler sold 42,000 shares ($6.3M) — largest single disposal in 24 months',
    'Regulatory inquiry from FTC regarding cloud pricing practices disclosed in 8-K filing',
    'Q3 earnings beat consensus by 4.2% on revenue; gross margin contracted 180 bps YoY',
    'Acme AI assistant reached 1 million active enterprise seats ahead of schedule',
  ],
  '30d': [
    'Signed 5-year infrastructure partnership with NovaTech Systems valued at $420M',
    'CFO Maria Chen received stock option grant of 85,000 shares at $145 strike',
    'Cloud division revenue grew 38% YoY, now 41% of total company revenue',
    'Announced workforce restructuring — 6% headcount reduction in legacy hardware unit',
    'Board approved $500M share buyback extension through Q4 2026',
    'Two patent infringement suits filed against competitor ZenixCorp dismissed',
  ],
  '90d': [
    'Acquired DataStream Analytics for $310M — expands real-time data pipeline capability',
    'Former COO David Patel resigned; promoted SVP Operations Priya Shah as replacement',
    'Launched ACME Cloud v4.0 — 40% performance uplift over prior generation',
    'Entered Memorandum of Understanding with EuroTech AG for EU market expansion',
    'Independent board director Sarah Kim appointed; brings Fortune 100 CFO experience',
    'Filed for 14 new AI-related patents across natural language processing and forecasting',
    'Quarterly dividend maintained at $0.32/share; payout ratio at 18% of free cash flow',
    'ESG report released: 35% renewable energy usage, targeting 80% by 2028',
  ],
}

// ─── AI Due Diligence Memo ────────────────────────────────────────────────────

export const ddAIMemo: AIMemo = {
  opportunities: {
    heading: 'Opportunities',
    points: [
      'Cloud division at 38% growth provides durable compounding tailwind; addressable market expands $12B by 2027.',
      'DataStream acquisition creates cross-sell opportunity with 2,400+ enterprise accounts currently using legacy ETL.',
      'EU expansion via EuroTech MOU could add $180–250M incremental revenue over 36 months.',
      'AI assistant traction (1M seats) ahead of plan — pricing power opportunity if usage metrics sustain.',
    ],
  },
  risks: {
    heading: 'Risks',
    points: [
      'FTC inquiry into cloud pricing practices represents material regulatory overhang; potential remedies could constrain bundling strategy.',
      'CEO insider sale at multi-year high volume is anomalous signal requiring monitoring; pattern inconsistent with prior grant-and-hold behavior.',
      'Gross margin compression (−180 bps) driven by DataStream integration costs; timeline to accretion uncertain.',
      'Legacy hardware restructuring (6% RIF) creates short-term productivity drag and potential litigation exposure.',
    ],
  },
  strategicDevelopments: {
    heading: 'Strategic Developments',
    points: [
      'NovaTech partnership locks in $420M infrastructure pipeline — strategic moat in hybrid-cloud deployments.',
      'ACME Cloud v4.0 performance leadership creates 12–18 month competitive window before peers can respond.',
      'COO transition managed internally (Priya Shah promotion) reduces disruption risk vs. external hire.',
      'Board refreshment (Sarah Kim) improves financial governance credentials ahead of potential credit facility renewal.',
    ],
  },
  financialImplications: {
    heading: 'Financial Implications',
    points: [
      'EV/EBITDA implied at 21.4x on forward estimates — 8% premium to peer median; justified if cloud growth sustains above 30%.',
      '$500M buyback extension signals management confidence; reduces float by ~3.2% at current prices.',
      'DataStream earn-out ($75M contingent) may pressure FCF conversion in FY2025; model sensitivity warranted.',
      'Dividend payout ratio (18%) leaves ample room for capital returns; S&P upgrade catalyst possible if leverage declines to <1.5x.',
    ],
  },
}

// ─── Mock News Articles ───────────────────────────────────────────────────────

export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'n1',
    headline: 'Acme Technologies Reports Record Q3 Revenue, Beats Consensus Estimates by 4.2%',
    source: 'Bloomberg',
    url: '#',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    sentiment: 'positive',
    sentimentScore: 0.82,
    summary: 'Acme Technologies delivered Q3 revenue of $2.14B, ahead of consensus by $86M, driven by exceptional cloud division performance. Cloud revenue grew 38% year-over-year to $877M. Gross margin contracted 180 basis points to 61.2% due to DataStream acquisition integration costs.',
    category: 'Earnings',
  },
  {
    id: 'n2',
    headline: 'FTC Opens Inquiry Into Acme Cloud Pricing Practices',
    source: 'Reuters',
    url: '#',
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    sentiment: 'negative',
    sentimentScore: 0.14,
    summary: 'The Federal Trade Commission has opened a preliminary inquiry into Acme Technologies\' cloud platform pricing and bundling practices. The company disclosed the inquiry in an 8-K filing. Analysts note this represents a material overhang for the stock pending resolution.',
    category: 'Regulatory',
  },
  {
    id: 'n3',
    headline: 'CEO James Wheeler Sells $6.3M in ACME Stock — Largest Disposal in Two Years',
    source: 'MarketWatch',
    url: '#',
    timestamp: Date.now() - 18 * 60 * 60 * 1000,
    sentiment: 'negative',
    sentimentScore: 0.22,
    summary: 'Acme Technologies CEO James Wheeler sold 42,000 shares worth approximately $6.3 million, the largest insider disposal since 2022. While Wheeler retains significant equity, the timing and scale of the transaction ahead of the FTC inquiry disclosure has drawn analyst scrutiny.',
    category: 'Insider Activity',
  },
  {
    id: 'n4',
    headline: 'Acme Technologies Signs $420M Infrastructure Partnership with NovaTech Systems',
    source: 'WSJ',
    url: '#',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    sentiment: 'positive',
    sentimentScore: 0.88,
    summary: 'Acme Technologies and NovaTech Systems announced a five-year strategic infrastructure partnership valued at $420 million. The deal creates a hybrid-cloud deployment capability targeting enterprise customers in financial services and healthcare verticals.',
    category: 'Partnership',
  },
  {
    id: 'n5',
    headline: 'Acme AI Assistant Reaches 1 Million Enterprise Seats Ahead of Schedule',
    source: 'TechCrunch',
    url: '#',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    sentiment: 'positive',
    sentimentScore: 0.91,
    summary: 'Acme Technologies\' enterprise AI assistant has surpassed 1 million active seats, achieving its 12-month target in just 9 months. The milestone represents $180M in annualised recurring revenue and signals strong enterprise adoption of generative AI tooling.',
    category: 'Product',
  },
  {
    id: 'n6',
    headline: 'Acme Technologies Announces 6% Workforce Reduction in Legacy Hardware Unit',
    source: 'CNBC',
    url: '#',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    sentiment: 'neutral',
    sentimentScore: 0.48,
    summary: 'Acme Technologies will reduce headcount in its legacy hardware division by approximately 6%, affecting 1,200 employees globally. Management cited structural decline in on-premise hardware demand and plans to redeploy capital toward cloud infrastructure and AI development.',
    category: 'Corporate Action',
  },
  {
    id: 'n7',
    headline: 'Board Approves $500M Share Buyback Extension Through Q4 2026',
    source: 'PR Newswire',
    url: '#',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    sentiment: 'positive',
    sentimentScore: 0.74,
    summary: 'Acme Technologies\' board of directors approved a $500 million extension to the company\'s existing share repurchase program, extending through Q4 2026. The buyback authorization is expected to reduce the float by approximately 3.2% at current market prices.',
    category: 'Capital Allocation',
  },
  {
    id: 'n8',
    headline: 'Analysts Mixed on Acme After Q3: Street Raises Target Prices But Notes Margin Concerns',
    source: 'Barron\'s',
    url: '#',
    timestamp: Date.now() - 9 * 24 * 60 * 60 * 1000,
    sentiment: 'neutral',
    sentimentScore: 0.52,
    summary: 'Following Q3 earnings, seven analysts raised price targets on ACME stock while noting persistent gross margin pressure. Goldman Sachs moved to Buy from Neutral with a $175 target, while Bernstein maintained Underperform, citing FTC risk and integration drag from DataStream.',
    category: 'Analyst Coverage',
  },
]

// ─── Mock Corporate Events ────────────────────────────────────────────────────

export const mockCorporateEvents: CorporateEvent[] = [
  {
    date: 'Mar 2026',
    type: 'regulatory',
    title: 'FTC Pricing Inquiry Disclosed',
    description: 'FTC opened preliminary inquiry into cloud pricing and bundling practices. Disclosed via 8-K filing. Company engaged outside counsel.',
    impact: 'high',
  },
  {
    date: 'Feb 2026',
    type: 'partnership',
    title: 'NovaTech $420M Infrastructure Partnership',
    description: '5-year strategic partnership with NovaTech Systems for hybrid-cloud infrastructure. Targets financial services and healthcare verticals.',
    impact: 'high',
  },
  {
    date: 'Jan 2026',
    type: 'product',
    title: 'ACME Cloud v4.0 General Availability',
    description: 'Fourth-generation cloud platform launched with 40% performance improvement over v3.x. Introduces native AI orchestration and zero-trust security framework.',
    impact: 'medium',
  },
  {
    date: 'Dec 2025',
    type: 'management',
    title: 'COO David Patel Resignation; Priya Shah Appointed',
    description: 'Chief Operating Officer David Patel resigned after 6 years. SVP Operations Priya Shah promoted internally to COO role.',
    impact: 'medium',
  },
  {
    date: 'Oct 2025',
    type: 'acquisition',
    title: 'DataStream Analytics Acquired for $310M',
    description: 'Acme acquired DataStream Analytics, a real-time data pipeline SaaS company. Adds 2,400 enterprise accounts and expands into financial data infrastructure.',
    impact: 'high',
  },
  {
    date: 'Sep 2025',
    type: 'fundraising',
    title: '$500M Senior Notes Offering',
    description: 'Completed offering of $500M in 4.875% senior unsecured notes due 2032 to partially fund DataStream acquisition and general corporate purposes.',
    impact: 'medium',
  },
]

// ─── Mock Risk Flags ──────────────────────────────────────────────────────────

export const mockRiskFlags: RiskFlag[] = [
  {
    severity: 'critical',
    category: 'Regulatory',
    title: 'FTC Pricing Inquiry — Active',
    detail: 'FTC preliminary inquiry into cloud pricing and bundling practices. Potential remedies could restrict go-to-market strategy. Estimated resolution timeline: 12–18 months. No monetary penalty disclosed.',
    detectedDate: 'Mar 12, 2026',
  },
  {
    severity: 'critical',
    category: 'Insider Activity',
    title: 'Anomalous CEO Insider Sale',
    detail: 'CEO disposed of 42,000 shares ($6.3M) — largest single transaction in 24 months, 3.1 standard deviations above trailing mean. Timing correlates with FTC inquiry disclosure period.',
    detectedDate: 'Mar 10, 2026',
  },
  {
    severity: 'warning',
    category: 'Financial',
    title: 'Gross Margin Compression (−180 bps)',
    detail: 'Gross margin declined from 62.9% to 61.1% YoY, driven by DataStream integration costs and hardware mix shift. Management guided to full recovery by Q2 2026; analyst consensus is less certain.',
    detectedDate: 'Feb 28, 2026',
  },
  {
    severity: 'warning',
    category: 'Operational',
    title: 'Workforce Restructuring — Execution Risk',
    detail: 'Announced 6% RIF in legacy hardware unit (1,200 employees). WARN Act notices filed in 3 states. Potential for wrongful termination litigation and productivity disruption during transition.',
    detectedDate: 'Feb 14, 2026',
  },
  {
    severity: 'warning',
    category: 'M&A Integration',
    title: 'DataStream Earn-Out Uncertainty',
    detail: '$75M contingent earn-out tied to DataStream revenue targets through Dec 2025. If targets are missed, accounting treatment reversal could create one-time income statement benefit but signal integration issues.',
    detectedDate: 'Jan 15, 2026',
  },
  {
    severity: 'informational',
    category: 'Capital Structure',
    title: 'Leverage Slightly Above Target Range',
    detail: 'Net debt/EBITDA at 2.1x following senior notes offering; company target range is 1.5–2.0x. Credit rating stable but S&P placed on Negative Outlook. Expected to normalize by Q3 2026.',
    detectedDate: 'Nov 5, 2025',
  },
]

// ─── Mock Competitors ─────────────────────────────────────────────────────────

export const mockCompetitors: Competitor[] = [
  {
    name: 'CloudNexus Corp',
    ticker: 'CLNX',
    marketShare: 28.4,
    recentDevelopments: [
      'Launched CloudNexus AI Pro — direct competitor to ACME AI assistant',
      'Won $850M DoD contract for classified cloud infrastructure',
      'Raised guidance for FY2026 on public sector momentum',
    ],
    recentActivity: 'Aggressive enterprise AI pricing war initiated',
    trend: 'gaining',
  },
  {
    name: 'ZenixCorp Technologies',
    ticker: 'ZNX',
    marketShare: 18.7,
    recentDevelopments: [
      'Patent infringement suits against Acme dismissed — removes overhang',
      'Hired former Acme cloud engineering VP',
      'Revenue growth decelerated to 14% from 22% prior year',
    ],
    recentActivity: 'Talent acquisition strategy targeting Acme engineers',
    trend: 'losing',
  },
  {
    name: 'Vertex Data Systems',
    ticker: 'VRTX',
    marketShare: 15.2,
    recentDevelopments: [
      'Completed $1.2B acquisition of InfraStack for on-premise expansion',
      'Announced strategic review of legacy hardware segment',
      'CFO departure announced; interim CFO appointed',
    ],
    recentActivity: 'Undergoing leadership transition; acquisition integration',
    trend: 'stable',
  },
  {
    name: 'PrismCloud Inc',
    ticker: 'PRMC',
    marketShare: 12.1,
    recentDevelopments: [
      'Received $200M Series D at $2.8B valuation — now pre-IPO',
      'Focused exclusively on financial services vertical',
      'NPS score surpassed Acme in independent survey for second consecutive quarter',
    ],
    recentActivity: 'Niche vertical focus creating customer satisfaction advantage',
    trend: 'gaining',
  },
  {
    name: 'NovaScale Technologies',
    ticker: 'NVSC',
    marketShare: 9.8,
    recentDevelopments: [
      'Announced intent to exit cloud infrastructure segment by Q4 2026',
      'Pivoting to managed services and consulting',
      'Sold data center assets to real estate investment trust for $380M',
    ],
    recentActivity: 'Strategic exit from direct competition — Acme beneficiary',
    trend: 'losing',
  },
]

// ─── Mock Market Intelligence ─────────────────────────────────────────────────

export const mockMarketIntel: MarketIntelItem[] = [
  {
    category: 'Industry Trend',
    insight: 'Enterprise AI adoption accelerating: 67% of Fortune 500 companies now have active generative AI pilots, up from 31% in 2024. Cloud-native AI platforms are preferred over on-premise deployment by 4:1 margin.',
    trend: 'positive',
    source: 'Gartner Enterprise Survey 2026',
    date: 'Mar 2026',
    impact: 'high',
  },
  {
    category: 'Pricing Environment',
    insight: 'Cloud infrastructure pricing under pressure as hyperscalers compete aggressively on compute costs. Average cloud contract ACV declined 8% YoY for commodity workloads; premium AI-native offerings command 35%+ premium.',
    trend: 'negative',
    source: 'IDC Cloud Tracker Q4 2025',
    date: 'Feb 2026',
    impact: 'high',
  },
  {
    category: 'Regulatory Climate',
    insight: 'FTC and DOJ increasing scrutiny of cloud market concentration following Congressional hearings. Three active investigations across major cloud providers. Bundling and lock-in practices highlighted as primary concerns.',
    trend: 'negative',
    source: 'Reuters Technology Policy Desk',
    date: 'Mar 2026',
    impact: 'high',
  },
  {
    category: 'Talent Market',
    insight: 'AI engineering talent remains severely constrained despite tech layoffs. Compensation for senior ML engineers at cloud companies up 22% YoY. Acme\'s recent WARN Act filings in hardware may accelerate talent availability.',
    trend: 'neutral',
    source: 'LinkedIn Workforce Report Q1 2026',
    date: 'Feb 2026',
    impact: 'medium',
  },
  {
    category: 'M&A Activity',
    insight: 'Cloud-adjacent M&A volumes up 34% YoY in Q1 2026 with average acquisition multiples at 7.2x revenue. Data infrastructure and AI orchestration targets commanding highest premiums. Acme\'s DataStream acquisition positioned ahead of trend.',
    trend: 'positive',
    source: 'PitchBook Cloud M&A Monitor',
    date: 'Mar 2026',
    impact: 'medium',
  },
  {
    category: 'Customer Sentiment',
    insight: 'Enterprise cloud customer churn rates stabilizing at 4.2% annually after 2024 spike. Customers citing AI feature differentiation as primary retention driver. Multi-cloud strategies adopted by 71% of enterprise buyers.',
    trend: 'positive',
    source: 'Forrester Cloud Decision-Maker Survey',
    date: 'Jan 2026',
    impact: 'medium',
  },
]

// ─── Mock Insider Transactions ────────────────────────────────────────────────

export const mockInsiderTransactions: InsiderTransaction[] = [
  {
    name: 'James Wheeler',
    title: 'Chief Executive Officer',
    transactionType: 'sell',
    shares: 42000,
    value: 6321000,
    date: 'Mar 10, 2026',
    isUnusual: true,
  },
  {
    name: 'Maria Chen',
    title: 'Chief Financial Officer',
    transactionType: 'buy',
    shares: 85000,
    value: 0,
    date: 'Feb 22, 2026',
    isUnusual: false,
  },
  {
    name: 'Robert Kline',
    title: 'Chief Revenue Officer',
    transactionType: 'sell',
    shares: 12500,
    value: 1875000,
    date: 'Feb 18, 2026',
    isUnusual: false,
  },
  {
    name: 'Sarah Kim',
    title: 'Independent Director',
    transactionType: 'buy',
    shares: 5000,
    value: 752500,
    date: 'Feb 5, 2026',
    isUnusual: false,
  },
  {
    name: 'Priya Shah',
    title: 'Chief Operating Officer',
    transactionType: 'buy',
    shares: 8000,
    value: 1204000,
    date: 'Jan 28, 2026',
    isUnusual: false,
  },
  {
    name: 'Thomas Reed',
    title: 'EVP, Cloud Division',
    transactionType: 'sell',
    shares: 31000,
    value: 4650000,
    date: 'Jan 15, 2026',
    isUnusual: true,
  },
  {
    name: 'Angela Moss',
    title: 'Independent Director',
    transactionType: 'buy',
    shares: 3500,
    value: 525000,
    date: 'Dec 20, 2025',
    isUnusual: false,
  },
  {
    name: 'Kevin Park',
    title: 'General Counsel',
    transactionType: 'sell',
    shares: 9200,
    value: 1380000,
    date: 'Dec 5, 2025',
    isUnusual: false,
  },
]
