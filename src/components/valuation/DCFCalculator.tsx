import { useMemo, useState } from "react"
import { Calculator, DollarSign, Target, TrendingUp } from "lucide-react"
import { useCompanyData } from "@/contexts/CompanyContext"

interface DCFInputs {
  revenue: number
  ebitda: number
  revenueGrowthRate: number
  wacc: number
  terminalGrowthRate: number
  exitMultiple: number
  projectionPeriod: number
}

interface DCFOutputs {
  enterpriseValue: number
  equityValue: number
  impliedSharePrice: number
  terminalValue: number
  pvCashFlows: number
  pvTerminal: number
}

const FCF_CONVERSION = 0.65

function computeDCF(
  inputs: DCFInputs,
  tvMethod: "perpetuity" | "exit",
  targetCompany: { netDebt: number; sharesOutstanding: number }
): DCFOutputs {
  const { ebitda, revenueGrowthRate, wacc, terminalGrowthRate, exitMultiple, projectionPeriod } = inputs

  if (tvMethod === "perpetuity" && wacc <= terminalGrowthRate) {
    return { enterpriseValue: 0, equityValue: 0, impliedSharePrice: 0, terminalValue: 0, pvCashFlows: 0, pvTerminal: 0 }
  }

  let pvCashFlows = 0
  let currentEbitda = ebitda

  for (let year = 1; year <= projectionPeriod; year++) {
    currentEbitda *= 1 + revenueGrowthRate / 100
    const fcf = currentEbitda * FCF_CONVERSION
    pvCashFlows += fcf / Math.pow(1 + wacc / 100, year)
  }

  let terminalValue: number
  if (tvMethod === "perpetuity") {
    const terminalFcf = currentEbitda * (1 + terminalGrowthRate / 100) * FCF_CONVERSION
    terminalValue = terminalFcf / ((wacc - terminalGrowthRate) / 100)
  } else {
    terminalValue = currentEbitda * exitMultiple
  }

  const pvTerminal = terminalValue / Math.pow(1 + wacc / 100, projectionPeriod)

  const enterpriseValue = Math.round(pvCashFlows + pvTerminal)
  const equityValue = enterpriseValue - targetCompany.netDebt
  const impliedSharePrice =
    Math.round((equityValue / targetCompany.sharesOutstanding) * 100) / 100

  return { enterpriseValue, equityValue, impliedSharePrice, terminalValue: Math.round(terminalValue), pvCashFlows: Math.round(pvCashFlows), pvTerminal: Math.round(pvTerminal) }
}

const WACC_VALUES = [8.0, 9.0, 10.0, 11.0, 12.0]
const TGR_VALUES = [1.5, 2.0, 2.5, 3.0, 3.5]

function InputField({
  label,
  value,
  suffix,
  step,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  suffix: string
  step: number
  min?: number
  max?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="block text-[11px] text-brik-muted mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) onChange(v)
          }}
          className="w-full bg-brik-dark border border-brik-border rounded-lg px-3 py-2 text-sm font-mono text-brik-text focus:border-brik-accent focus:outline-none transition-colors appearance-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-brik-muted">
          {suffix}
        </span>
      </div>
    </div>
  )
}

export default function DCFCalculator() {
  const { dcfDefaults, targetCompany } = useCompanyData()
  const [tvMethod, setTvMethod] = useState<"perpetuity" | "exit">("perpetuity")
  const [inputs, setInputs] = useState<DCFInputs>({
    revenue: dcfDefaults.revenue,
    ebitda: dcfDefaults.ebitda,
    revenueGrowthRate: dcfDefaults.revenueGrowthRate,
    wacc: dcfDefaults.wacc,
    terminalGrowthRate: dcfDefaults.terminalGrowthRate,
    exitMultiple: 12.0,
    projectionPeriod: dcfDefaults.projectionPeriod,
  })

  const outputs = useMemo(() => computeDCF(inputs, tvMethod, targetCompany), [inputs, tvMethod, targetCompany])

  const sensitivityMatrix = useMemo(() => {
    return WACC_VALUES.map((wacc) =>
      TGR_VALUES.map((tgr) =>
        computeDCF({ ...inputs, wacc, terminalGrowthRate: tgr }, tvMethod, targetCompany).impliedSharePrice
      )
    )
  }, [inputs, tvMethod, targetCompany])

  const update = (field: keyof DCFInputs, value: number) =>
    setInputs((prev) => ({ ...prev, [field]: value }))

  const invalidWacc = tvMethod === "perpetuity" && inputs.wacc <= inputs.terminalGrowthRate
  const tvPct = outputs.enterpriseValue > 0
    ? ((outputs.pvTerminal / outputs.enterpriseValue) * 100).toFixed(1)
    : "—"

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-brik-accent/10 border border-brik-accent/20">
          <Calculator size={14} className="text-brik-accent" strokeWidth={1.5} />
        </div>
        <h4 className="text-xs font-medium tracking-wider uppercase text-brik-muted">
          DCF Analysis
        </h4>
      </div>

      {/* Terminal Value Method Toggle */}
      <div className="mb-6 p-4 rounded-xl border border-brik-border bg-brik-dark/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider text-brik-muted font-medium">
            Terminal Value Method
          </span>
          <div className="flex gap-1">
            {(["perpetuity", "exit"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTvMethod(m)}
                className={`px-3 py-1 rounded text-[10px] font-medium transition-colors ${
                  tvMethod === m
                    ? "bg-brik-accent/20 border border-brik-accent/40 text-brik-accent"
                    : "border border-brik-border text-brik-muted hover:border-brik-border-light"
                }`}
              >
                {m === "perpetuity" ? "Perpetuity Growth" : "Exit Multiple"}
              </button>
            ))}
          </div>
        </div>

        {tvMethod === "perpetuity" ? (
          <div className="text-[11px] text-brik-muted leading-relaxed">
            <span className="font-mono text-brik-text/80">TV = FCF × (1 + g) / (WACC − g)</span>
            <span className="ml-3 text-brik-muted/60">
              where g = terminal growth rate, WACC = discount rate
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-brik-muted leading-relaxed">
            <span className="font-mono text-brik-text/80">TV = EBITDA<sub>n</sub> × Exit Multiple</span>
            <span className="ml-3 text-brik-muted/60">
              applies multiple to Year {inputs.projectionPeriod} EBITDA
            </span>
          </div>
        )}
      </div>

      {/* Inputs + Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Inputs */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            label="Revenue"
            value={inputs.revenue}
            suffix="$M"
            step={100}
            onChange={(v) => update("revenue", v)}
          />
          <InputField
            label="EBITDA"
            value={inputs.ebitda}
            suffix="$M"
            step={50}
            onChange={(v) => update("ebitda", v)}
          />
          <InputField
            label="Growth Rate"
            value={inputs.revenueGrowthRate}
            suffix="%"
            step={0.5}
            onChange={(v) => update("revenueGrowthRate", v)}
          />
          <InputField
            label="WACC"
            value={inputs.wacc}
            suffix="%"
            step={0.5}
            min={0.5}
            onChange={(v) => update("wacc", v)}
          />
          {tvMethod === "perpetuity" ? (
            <InputField
              label="Terminal Growth"
              value={inputs.terminalGrowthRate}
              suffix="%"
              step={0.5}
              onChange={(v) => update("terminalGrowthRate", v)}
            />
          ) : (
            <InputField
              label="Exit Multiple"
              value={inputs.exitMultiple}
              suffix="x"
              step={0.5}
              min={4}
              max={40}
              onChange={(v) => update("exitMultiple", v)}
            />
          )}
          <InputField
            label="Projection Period"
            value={inputs.projectionPeriod}
            suffix="yrs"
            step={1}
            min={3}
            max={10}
            onChange={(v) => update("projectionPeriod", v)}
          />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {invalidWacc && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
              WACC must exceed Terminal Growth Rate
            </div>
          )}
          <div className="rounded-xl border border-brik-border bg-brik-dark/50 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={14} className="text-brik-accent shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brik-muted">
                  Enterprise Value
                </p>
                <p className="text-lg font-mono font-medium text-brik-text">
                  ${(outputs.enterpriseValue / 1000).toFixed(1)}B
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign size={14} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brik-muted">
                  Equity Value
                </p>
                <p className="text-lg font-mono font-medium text-brik-text">
                  ${(outputs.equityValue / 1000).toFixed(1)}B
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target size={14} className="text-brik-gold shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brik-muted">
                  Implied Share Price
                </p>
                <p className="text-lg font-mono font-bold text-brik-gold">
                  ${outputs.impliedSharePrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* TV breakdown */}
            <div className="pt-3 border-t border-brik-border/30 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-brik-muted">PV of Cash Flows</span>
                <span className="font-mono text-brik-text">${(outputs.pvCashFlows / 1000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-brik-muted">PV of Terminal Value</span>
                <span className="font-mono text-brik-text">${(outputs.pvTerminal / 1000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-brik-muted">TV as % of EV</span>
                <span className="font-mono text-amber-400">{tvPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Table */}
      <div>
        <h5 className="text-[11px] uppercase tracking-wider text-brik-muted mb-3">
          Sensitivity Analysis — Implied Share Price ($) &nbsp;·&nbsp;
          <span className="text-brik-muted/60 normal-case">WACC vs Terminal Growth Rate</span>
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-brik-border">
                <th className="p-2.5 text-left text-brik-muted font-medium">
                  WACC \ TGR
                </th>
                {TGR_VALUES.map((tgr) => (
                  <th
                    key={tgr}
                    className="p-2.5 text-center text-brik-muted font-medium"
                  >
                    {tgr.toFixed(1)}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WACC_VALUES.map((wacc, ri) => (
                <tr
                  key={wacc}
                  className="border-b border-brik-border/30 hover:bg-brik-surface/50 transition-colors"
                >
                  <td className="p-2.5 text-brik-muted font-medium font-mono">
                    {wacc.toFixed(1)}%
                  </td>
                  {TGR_VALUES.map((tgr, ci) => {
                    const val = sensitivityMatrix[ri][ci]
                    const isActive =
                      wacc === inputs.wacc &&
                      tgr === inputs.terminalGrowthRate
                    const isAbove = val >= targetCompany.currentPrice

                    return (
                      <td
                        key={tgr}
                        className={`p-2.5 text-center font-mono transition-colors ${
                          isActive
                            ? "bg-brik-accent/15 border border-brik-accent/40 font-bold text-brik-text"
                            : isAbove
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {val > 0 ? `$${val.toFixed(1)}` : "N/A"}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
