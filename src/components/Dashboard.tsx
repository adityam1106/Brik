import { motion } from 'framer-motion'
import {
  TrendingUp,
  Search,
  FileText,
  Activity,
  BarChart3,
  Database,
  Layers,
  Zap,
  ArrowUpRight,
} from 'lucide-react'

const workflows = [
  {
    title: 'Valuation',
    subtitle: 'DCF, Comps & Precedents',
    description:
      'Automated financial modeling with AI-driven sensitivity analysis and real-time market data integration.',
    icon: TrendingUp,
    accent: '#3b82f6',
    stats: [
      { label: 'Models', value: '12' },
      { label: 'Accuracy', value: '99.2%' },
      { label: 'Speed', value: '< 4min' },
    ],
    sparkline: [20, 35, 28, 45, 40, 55, 48, 62, 58, 70, 65, 78],
  },
  {
    title: 'Research & Diligence',
    subtitle: 'Deep Market Intelligence',
    description:
      'Comprehensive research synthesis across filings, transcripts, and proprietary datasets with source attribution.',
    icon: Search,
    accent: '#c9a84c',
    stats: [
      { label: 'Sources', value: '2.4M+' },
      { label: 'Coverage', value: 'Global' },
      { label: 'Refresh', value: 'Live' },
    ],
    sparkline: [30, 25, 40, 35, 50, 45, 55, 60, 52, 68, 72, 80],
  },
  {
    title: 'Pitch-Book Generation',
    subtitle: 'Institutional-Grade Output',
    description:
      'Bank-quality pitch books assembled from structured data, formatted to your institution\'s standards.',
    icon: FileText,
    accent: '#6366f1',
    stats: [
      { label: 'Templates', value: '48' },
      { label: 'Pages/min', value: '120' },
      { label: 'Format', value: 'PPTX' },
    ],
    sparkline: [15, 22, 30, 28, 42, 38, 50, 55, 48, 60, 72, 85],
  },
]

function MiniSparkline({
  data,
  color,
}: {
  data: number[]
  color: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const height = 32
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-40"
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${color})`}
      />
    </svg>
  )
}

function WorkflowCard({
  workflow,
  index,
}: {
  workflow: (typeof workflows)[0]
  index: number
}) {
  const Icon = workflow.icon

  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.3 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-brik-border bg-brik-surface/50 backdrop-blur-sm p-8 h-full transition-all duration-500 hover:border-brik-border-light hover:bg-brik-surface/80"
        style={{
          boxShadow: `0 0 0 0 ${workflow.accent}00`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 40px -10px ${workflow.accent}20`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 0 ${workflow.accent}00`
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="p-3 rounded-xl border transition-colors duration-300"
            style={{
              borderColor: `${workflow.accent}20`,
              background: `${workflow.accent}08`,
            }}
          >
            <Icon
              size={22}
              style={{ color: workflow.accent }}
              strokeWidth={1.5}
            />
          </div>
          <ArrowUpRight
            size={18}
            className="text-brik-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-medium text-brik-text mb-1 tracking-tight">
          {workflow.title}
        </h3>
        <p
          className="text-xs font-medium tracking-wider uppercase mb-4"
          style={{ color: workflow.accent, opacity: 0.7 }}
        >
          {workflow.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-brik-muted leading-relaxed mb-6">
          {workflow.description}
        </p>

        {/* Sparkline */}
        <div className="mb-6">
          <MiniSparkline data={workflow.sparkline} color={workflow.accent} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brik-border">
          {workflow.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-medium text-brik-text">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-brik-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Hover gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${workflow.accent}06, transparent 40%)`,
          }}
        />
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="min-h-screen px-6 py-8 md:px-12 lg:px-20">
        {/* Top bar */}
        <motion.header
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brik-accent/10 border border-brik-accent/20 flex items-center justify-center">
              <Layers size={16} className="text-brik-accent" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-light tracking-[0.12em] text-brik-text">
              Brik
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-brik-surface/60 border border-brik-border">
              <Activity size={12} className="text-emerald-500" />
              <span className="text-xs text-brik-muted">Systems Online</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brik-surface border border-brik-border flex items-center justify-center cursor-pointer hover:border-brik-border-light transition-colors">
              <Zap size={14} className="text-brik-muted" strokeWidth={1.5} />
            </div>
          </div>
        </motion.header>

        {/* Hero section */}
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-brik-text tracking-tight leading-tight mb-4">
            AI-Powered
            <br />
            <span className="text-brik-muted">Investment Banking</span>
          </h2>
          <p className="text-base text-brik-muted max-w-xl leading-relaxed">
            Three deep workflows. Institutional precision. Built for the analysts
            and associates shaping the next generation of dealmaking.
          </p>
        </motion.div>

        {/* Workflow cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {workflows.map((workflow, i) => (
            <WorkflowCard key={workflow.title} workflow={workflow} index={i} />
          ))}
        </div>

        {/* Bottom metrics bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            { icon: BarChart3, label: 'Active Models', value: '1,247' },
            { icon: Database, label: 'Data Points', value: '48.2B' },
            { icon: Activity, label: 'Uptime', value: '99.99%' },
            { icon: Zap, label: 'Avg. Response', value: '1.2s' },
          ].map((metric) => {
            const MetricIcon = metric.icon
            return (
              <div
                key={metric.label}
                className="flex items-center gap-4 px-5 py-4 rounded-xl bg-brik-surface/30 border border-brik-border"
              >
                <MetricIcon
                  size={16}
                  className="text-brik-muted"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-medium text-brik-text">
                    {metric.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-brik-muted">
                    {metric.label}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="flex items-center justify-between py-6 border-t border-brik-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
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
