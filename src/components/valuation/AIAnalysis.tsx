import { AlertTriangle, AlertCircle, CheckCircle, Brain } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"
import type { AIFinding } from "@/data/valuationData"

function SeverityIcon({ severity }: { severity: AIFinding["severity"] }) {
  switch (severity) {
    case "critical":
      return <AlertCircle size={14} className="text-red-400 shrink-0" />
    case "warning":
      return <AlertTriangle size={14} className="text-amber-400 shrink-0" />
    case "positive":
      return <CheckCircle size={14} className="text-emerald-400 shrink-0" />
  }
}

function severityBorder(severity: AIFinding["severity"]) {
  switch (severity) {
    case "critical":
      return "border-l-red-500/50"
    case "warning":
      return "border-l-amber-500/50"
    case "positive":
      return "border-l-emerald-500/50"
  }
}

function RiskScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 38
  const progress = (score / 10) * circumference
  const color =
    score >= 7 ? "#ef4444" : score >= 4 ? "#f59e0b" : "#22c55e"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-brik-text">
            {score.toFixed(1)}
          </span>
          <span className="text-[9px] text-brik-muted uppercase tracking-wider">
            / 10
          </span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-brik-muted">
        Risk Score
      </span>
    </div>
  )
}

export default function AIAnalysis() {
  const { aiFindings, aiRiskScore } = useCompanyData()
  const criticalCount = aiFindings.filter(
    (f) => f.severity === "critical"
  ).length
  const warningCount = aiFindings.filter(
    (f) => f.severity === "warning"
  ).length
  const positiveCount = aiFindings.filter(
    (f) => f.severity === "positive"
  ).length

  return (
    <div className="rounded-xl border border-brik-border bg-brik-surface/40 p-5 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-brik-accent/10 border border-brik-accent/20">
          <Brain size={14} className="text-brik-accent" strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          AI Analysis
        </h4>
      </div>

      {/* Risk Score */}
      <div className="flex justify-center mb-5 pb-5 border-b border-brik-border">
        <RiskScoreRing score={aiRiskScore} />
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-brik-border">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">{criticalCount}</p>
          <p className="text-[9px] uppercase tracking-wider text-brik-muted">
            Critical
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">{warningCount}</p>
          <p className="text-[9px] uppercase tracking-wider text-brik-muted">
            Warnings
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">{positiveCount}</p>
          <p className="text-[9px] uppercase tracking-wider text-brik-muted">
            Strengths
          </p>
        </div>
      </div>

      {/* Findings list */}
      <div className="space-y-3">
        {aiFindings.map((finding, i) => (
          <div
            key={i}
            className={`rounded-lg border border-brik-border/50 border-l-2 ${severityBorder(
              finding.severity
            )} bg-brik-dark/40 p-3`}
          >
            <div className="flex items-start gap-2">
              <SeverityIcon severity={finding.severity} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-brik-muted">
                    {finding.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-brik-text mb-1">
                  {finding.title}
                </p>
                <p className="text-[11px] text-brik-muted leading-relaxed">
                  {finding.detail}
                </p>
                {finding.valuationImpact && (
                  <div className="mt-2 pt-1.5 border-t border-brik-border/30">
                    <span className="text-[10px] text-brik-muted">Impact: </span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        finding.valuationImpact.startsWith("+")
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {finding.valuationImpact}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
