import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Search,
  FileText,
  BarChart3,
  GitMerge,
  Upload,
  CheckCircle,
  Loader2,
  Layers,
  Activity,
  Zap,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import type { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { useSetCompanyData } from "@/contexts/CompanyContext";
import type { CompanyData } from "@/contexts/CompanyContext";

type UploadState = "idle" | "dragging" | "uploading" | "processed" | "error";

const ibTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Valuation",
    date: "DCF & Comps",
    content:
      "Automated DCF, comparable company analysis, and precedent transactions. AI-driven sensitivity analysis with real-time market data.",
    category: "Valuation",
    icon: TrendingUp,
    relatedIds: [2, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "Due Diligence",
    date: "Research & Analysis",
    content:
      "Comprehensive research synthesis across SEC filings, earnings transcripts, and proprietary datasets with source attribution.",
    category: "Research",
    icon: Search,
    relatedIds: [1, 3],
    status: "completed",
    energy: 88,
  },
  {
    id: 3,
    title: "Pitch Book",
    date: "Generation",
    content:
      "Bank-quality pitch books assembled from structured data, formatted to your institution's standards. PPTX export ready.",
    category: "Output",
    icon: FileText,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 72,
  },
  {
    id: 4,
    title: "Financial Model",
    date: "Models & Projections",
    content:
      "Three-statement models, LBO analysis, and merger models with automated assumptions and scenario planning.",
    category: "Modeling",
    icon: BarChart3,
    relatedIds: [1, 5],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 5,
    title: "Deal Pipeline",
    date: "M&A Advisory",
    content:
      "Track active deals, manage pipeline stages, and monitor transaction progress with AI-powered deal scoring.",
    category: "Pipeline",
    icon: GitMerge,
    relatedIds: [2, 4],
    status: "pending",
    energy: 40,
  },
];

interface OrbitalDashboardProps {
  onBack?: () => void;
  onNavigateToValuation?: () => void;
  onNavigateToDueDiligence?: () => void;
}

export default function OrbitalDashboard({ onBack, onNavigateToValuation, onNavigateToDueDiligence }: OrbitalDashboardProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setCompanyData = useSetCompanyData();
  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setUploadState("uploading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = API_URL ? `${API_URL}/api/upload` : '/api/upload';
      const res = await fetch(url, { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || "Upload failed");
      }

      const result: CompanyData = await res.json();
      setCompanyData(result);
      setUploadState("processed");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, [API_URL, setCompanyData]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setUploadState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState("dragging");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState("idle");
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleNodeNavigate = useCallback((item: TimelineItem) => {
    if (item.id === 1 && onNavigateToValuation) {
      onNavigateToValuation();
    } else if (item.id === 2 && onNavigateToDueDiligence) {
      onNavigateToDueDiligence();
    } else {
      console.log(`Navigating to: ${item.title} (${item.category})`);
    }
  }, [onNavigateToValuation, onNavigateToDueDiligence]);

  const centerUploadZone = (
    <div
      className="relative flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={(e) => {
        e.stopPropagation();
        fileInputRef.current?.click();
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
        onChange={handleInputChange}
      />

      {/* Outer glow rings */}
      <div className="absolute w-28 h-28 rounded-full border border-white/10 animate-ping opacity-30" />
      <div
        className="absolute w-32 h-32 rounded-full border border-white/5 animate-ping opacity-20"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Main upload circle */}
      <div
        className={`
        w-24 h-24 rounded-full cursor-pointer
        flex flex-col items-center justify-center
        transition-all duration-500
        ${
          uploadState === "dragging"
            ? "bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 scale-110 shadow-lg shadow-blue-500/30"
            : uploadState === "uploading"
            ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 animate-pulse"
            : uploadState === "processed"
            ? "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"
            : uploadState === "error"
            ? "bg-gradient-to-br from-red-600 via-red-500 to-orange-500"
            : "bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500"
        }
        border border-white/20
      `}
      >
        <div className="flex flex-col items-center justify-center text-white">
          {uploadState === "idle" && (
            <>
              <Upload size={20} className="mb-1" />
              <span className="text-[8px] font-semibold tracking-wider uppercase">
                Upload
              </span>
              <span className="text-[7px] opacity-70">Company Data</span>
            </>
          )}
          {uploadState === "dragging" && (
            <>
              <Upload size={20} className="mb-1 animate-bounce" />
              <span className="text-[8px] font-semibold tracking-wider">
                DROP HERE
              </span>
            </>
          )}
          {uploadState === "uploading" && (
            <>
              <Loader2 size={20} className="mb-1 animate-spin" />
              <span className="text-[8px] font-semibold tracking-wider">
                PROCESSING
              </span>
              <span className="text-[7px] opacity-70 truncate max-w-[70px]">
                {fileName}
              </span>
            </>
          )}
          {uploadState === "processed" && (
            <>
              <CheckCircle size={20} className="mb-1" />
              <span className="text-[8px] font-semibold tracking-wider">
                READY
              </span>
              <span className="text-[7px] opacity-70 truncate max-w-[70px]">
                {fileName}
              </span>
            </>
          )}
          {uploadState === "error" && (
            <>
              <AlertCircle size={20} className="mb-1" />
              <span className="text-[8px] font-semibold tracking-wider">ERROR</span>
              <span className="text-[7px] opacity-70 truncate max-w-[70px]">
                {errorMsg.slice(0, 20)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-10 bg-brik-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg border border-brik-border hover:border-brik-border-light hover:bg-brik-surface/50 transition-all mr-2"
            >
              <ArrowLeft size={14} className="text-brik-muted" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-brik-accent/10 border border-brik-accent/20 flex items-center justify-center">
            <Layers size={16} className="text-brik-accent" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-light tracking-[0.12em] text-brik-text">
            Brik
          </span>
          <span className="text-xs text-brik-muted ml-2 hidden md:inline">
            / Command Center
          </span>
        </div>

        <div className="flex items-center gap-4">
          {uploadState === "processed" && (
            <motion.div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-400">Data Loaded</span>
            </motion.div>
          )}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-brik-surface/60 border border-brik-border">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-xs text-brik-muted">Systems Online</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brik-surface border border-brik-border flex items-center justify-center cursor-pointer hover:border-brik-border-light transition-colors">
            <Zap size={14} className="text-brik-muted" strokeWidth={1.5} />
          </div>
        </div>
      </motion.header>

      {/* Instruction text */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-50 text-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <p className="text-xs text-brik-muted tracking-wider">
          {uploadState === "processed"
            ? "Select a workflow node to begin analysis"
            : "Upload company data to activate AI workflows"}
        </p>
      </motion.div>

      {/* Orbital Timeline */}
      <RadialOrbitalTimeline
        timelineData={ibTimelineData}
        onNodeNavigate={handleNodeNavigate}
        centerContent={centerUploadZone}
      />
    </motion.div>
  );
}
