import { motion } from "framer-motion"
import { ArrowLeft, Layers, Activity, Zap } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"
import CompanyOverview from "./CompanyOverview"
import AIAnalysis from "./AIAnalysis"
import ValuationSummary from "./ValuationSummary"
import FootballFieldChart from "./FootballFieldChart"
import DCFCalculator from "./DCFCalculator"
import ForecastTable from "./ForecastTable"
import EVBridge from "./EVBridge"
import ComparableCompanies from "./ComparableCompanies"
import PrecedentTransactions from "./PrecedentTransactions"
import CollapsibleSection from "./CollapsibleSection"

const sectionVariants = (index: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.5 + index * 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
})

interface ValuationPageProps {
  onBack: () => void
}

export default function ValuationPage({ onBack }: ValuationPageProps) {
  const { targetCompany } = useCompanyData()
  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto bg-brik-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="min-h-screen px-6 py-8 md:px-12 lg:px-20">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-brik-border hover:border-brik-border-light hover:bg-brik-surface/50 transition-all mr-2"
            >
              <ArrowLeft size={14} className="text-brik-muted" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-brik-accent/10 border border-brik-accent/20 flex items-center justify-center">
              <Layers size={16} className="text-brik-accent" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-light tracking-[0.12em] text-brik-text">
              Brik
            </span>
            <span className="text-xs text-brik-muted ml-2 hidden md:inline">
              / Valuation
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-brik-surface/60 border border-brik-border">
              <Activity size={12} className="text-emerald-500" />
              <span className="text-xs text-brik-muted">Systems Online</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brik-surface border border-brik-border flex items-center justify-center cursor-pointer hover:border-brik-border-light transition-colors">
              <Zap size={14} className="text-brik-muted" strokeWidth={1.5} />
            </div>
          </div>
        </motion.header>

        {/* Two-column layout: Main content + AI Sidebar */}
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Company Overview */}
            <motion.div {...sectionVariants(0)}>
              <CollapsibleSection title="Company Overview">
                <CompanyOverview />
              </CollapsibleSection>
            </motion.div>

            {/* Valuation Summary */}
            <motion.div {...sectionVariants(1)}>
              <CollapsibleSection title="Valuation Summary">
                <ValuationSummary />
              </CollapsibleSection>
            </motion.div>

            {/* Football Field */}
            <motion.div {...sectionVariants(2)}>
              <CollapsibleSection title="Football Field Chart">
                <FootballFieldChart />
              </CollapsibleSection>
            </motion.div>

            {/* DCF Calculator */}
            <motion.div key={targetCompany.ticker} {...sectionVariants(3)}>
              <CollapsibleSection title="DCF Analysis">
                <DCFCalculator />
                {/* Forecast Table */}
                <div className="mt-8 pt-6 border-t border-brik-border/50">
                  <ForecastTable />
                </div>
                {/* EV Bridge */}
                <div className="mt-8 pt-6 border-t border-brik-border/50">
                  <EVBridge />
                </div>
              </CollapsibleSection>
            </motion.div>

            {/* Comparable Companies */}
            <motion.div {...sectionVariants(4)}>
              <CollapsibleSection title="Comparable Companies">
                <ComparableCompanies />
              </CollapsibleSection>
            </motion.div>

            {/* Precedent Transactions */}
            <motion.div {...sectionVariants(5)}>
              <CollapsibleSection title="Precedent Transactions">
                <PrecedentTransactions />
              </CollapsibleSection>
            </motion.div>
          </div>

          {/* AI Analysis Sidebar */}
          <motion.div
            className="hidden lg:block w-80 shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AIAnalysis />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="flex items-center justify-between py-6 mt-8 border-t border-brik-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <p className="text-xs text-brik-muted/50 tracking-wide">
            Brik Systems &mdash; Confidential
          </p>
          <p className="text-xs text-brik-muted/50 tracking-wide">v0.1.0</p>
        </motion.footer>
      </div>
    </motion.div>
  )
}
