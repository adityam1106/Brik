import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  targetCompany as defaultTargetCompany,
  marketData as defaultMarketData,
  valuationMultiples as defaultValuationMultiples,
  profitabilityMargins as defaultProfitabilityMargins,
  growthMetrics as defaultGrowthMetrics,
  leverageCredit as defaultLeverageCredit,
  liquidityData as defaultLiquidityData,
  aiFindings as defaultAiFindings,
  aiRiskScore as defaultAiRiskScore,
  footballFieldData as defaultFootballFieldData,
  dcfDefaults as defaultDcfDefaults,
  forecastData as defaultForecastData,
  evBridgeData as defaultEvBridgeData,
  valuationSummary as defaultValuationSummary,
  comparableCompanies as defaultComparableCompanies,
  precedentTransactions as defaultPrecedentTransactions,
} from '@/data/valuationData'
import type {
  AIFinding,
  ValuationRange,
  ForecastYear,
  EVBridgeItem,
  ValuationMethodSummary,
  CompanyComp,
  PrecedentDeal,
} from '@/data/valuationData'
import {
  ddAIMemo as defaultDdAIMemo,
  ddRiskScore as defaultDdRiskScore,
  ddKeyDevelopments as defaultDdKeyDevelopments,
  mockRiskFlags as defaultMockRiskFlags,
  mockCorporateEvents as defaultMockCorporateEvents,
  mockCompetitors as defaultMockCompetitors,
  mockMarketIntel as defaultMockMarketIntel,
} from '@/data/dueDiligenceData'
import type {
  AIMemo,
  RiskFlag,
  CorporateEvent,
  Competitor,
  MarketIntelItem,
} from '@/data/dueDiligenceData'

export interface CompanyData {
  targetCompany: typeof defaultTargetCompany
  marketData: typeof defaultMarketData
  valuationMultiples: typeof defaultValuationMultiples
  profitabilityMargins: typeof defaultProfitabilityMargins
  growthMetrics: typeof defaultGrowthMetrics
  leverageCredit: typeof defaultLeverageCredit
  liquidityData: typeof defaultLiquidityData
  aiFindings: AIFinding[]
  aiRiskScore: number
  footballFieldData: ValuationRange[]
  dcfDefaults: typeof defaultDcfDefaults
  forecastData: ForecastYear[]
  evBridgeData: EVBridgeItem[]
  valuationSummary: ValuationMethodSummary[]
  comparableCompanies: CompanyComp[]
  precedentTransactions: PrecedentDeal[]
  ddAIMemo: AIMemo
  ddRiskScore: number
  ddKeyDevelopments: typeof defaultDdKeyDevelopments
  mockRiskFlags: RiskFlag[]
  mockCorporateEvents: CorporateEvent[]
  mockCompetitors: Competitor[]
  mockMarketIntel: MarketIntelItem[]
}

const DEFAULT_DATA: CompanyData = {
  targetCompany: defaultTargetCompany,
  marketData: defaultMarketData,
  valuationMultiples: defaultValuationMultiples,
  profitabilityMargins: defaultProfitabilityMargins,
  growthMetrics: defaultGrowthMetrics,
  leverageCredit: defaultLeverageCredit,
  liquidityData: defaultLiquidityData,
  aiFindings: defaultAiFindings,
  aiRiskScore: defaultAiRiskScore,
  footballFieldData: defaultFootballFieldData,
  dcfDefaults: defaultDcfDefaults,
  forecastData: defaultForecastData,
  evBridgeData: defaultEvBridgeData,
  valuationSummary: defaultValuationSummary,
  comparableCompanies: defaultComparableCompanies,
  precedentTransactions: defaultPrecedentTransactions,
  ddAIMemo: defaultDdAIMemo,
  ddRiskScore: defaultDdRiskScore,
  ddKeyDevelopments: defaultDdKeyDevelopments,
  mockRiskFlags: defaultMockRiskFlags,
  mockCorporateEvents: defaultMockCorporateEvents,
  mockCompetitors: defaultMockCompetitors,
  mockMarketIntel: defaultMockMarketIntel,
}

interface CompanyContextValue {
  data: CompanyData
  setData: (data: CompanyData) => void
}

const CompanyContext = createContext<CompanyContextValue>({
  data: DEFAULT_DATA,
  setData: () => {},
})

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CompanyData>(DEFAULT_DATA)
  return (
    <CompanyContext.Provider value={{ data, setData }}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompanyData(): CompanyData {
  return useContext(CompanyContext).data
}

export function useSetCompanyData(): (data: CompanyData) => void {
  return useContext(CompanyContext).setData
}
