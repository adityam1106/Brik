import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  BarChart2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Black neumorphism design tokens ──────────────────────────────────────────
// Base: #111111   Shadow dark: #000000   Shadow light: #1c1c1c
// These are baked into Tailwind arbitrary values below.

const NEU_OUTER =
  "shadow-[6px_6px_14px_#000000,-6px_-6px_14px_#1c1c1c]";
const NEU_OUTER_LG =
  "shadow-[12px_12px_24px_#000000,-12px_-12px_24px_#1c1c1c]";
const NEU_INSET =
  "shadow-[inset_6px_6px_14px_#000000,inset_-6px_-6px_14px_#1c1c1c]";
const NEU_INSET_SM =
  "shadow-[inset_3px_3px_8px_#000000,inset_-3px_-3px_8px_#1c1c1c]";
const NEU_HOVER =
  "hover:shadow-[8px_8px_18px_#000000,-8px_-8px_18px_#1c1c1c]";

const BASE = "bg-[#111111]";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "projects", icon: FolderOpen, label: "Projects" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
  { id: "team", icon: Users, label: "Team" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const Component = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("min-h-screen flex", BASE)}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out p-4 shrink-0",
          BASE,
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={cn(
            "h-full rounded-3xl p-5 flex flex-col",
            BASE,
            NEU_OUTER_LG
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && (
              <div className={cn("px-3 py-1.5 rounded-xl", BASE, NEU_INSET_SM)}>
                <h1 className="text-sm font-bold text-[#e0e0e0] tracking-wide">
                  Template
                </h1>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 text-[#888888] hover:text-[#e0e0e0]",
                BASE,
                NEU_OUTER,
                NEU_HOVER,
                "active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1c1c1c]",
                isCollapsed && "mx-auto"
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={14} strokeWidth={1.5} />
              ) : (
                <ChevronLeft size={14} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-2.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
                    BASE,
                    isActive
                      ? cn(
                          NEU_INSET,
                          "text-blue-400"
                        )
                      : cn(
                          NEU_OUTER,
                          NEU_HOVER,
                          "text-[#888888] hover:text-[#c0c0c0]",
                          "active:shadow-[inset_4px_4px_8px_#000000,inset_-4px_-4px_8px_#1c1c1c]"
                        ),
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={isActive ? "text-blue-400" : undefined}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="mt-6 pt-5 border-t border-[#1e1e1e]">
            <div
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl",
                BASE,
                NEU_INSET_SM,
                isCollapsed && "justify-center"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  BASE,
                  NEU_OUTER
                )}
              >
                <Users size={14} strokeWidth={1.5} className="text-[#888888]" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#e0e0e0] truncate">
                    DalexDev
                  </p>
                  <p className="text-[10px] text-[#555555] truncate">
                    byDalexDev@exm.com
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Online indicator */}
          <div className="mt-3">
            <div
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg",
                BASE,
                NEU_INSET_SM,
                isCollapsed && "justify-center"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] shrink-0" />
              {!isCollapsed && (
                <span className="text-[10px] text-[#555555]">Online</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 p-6">
        <div
          className={cn(
            "h-full rounded-3xl p-6 flex flex-col",
            BASE,
            NEU_INSET
          )}
        >
          {/* Page heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#e0e0e0] tracking-tight">
              {menuItems.find((i) => i.id === activeItem)?.label}
            </h2>
            <p className="mt-1 text-xs text-[#555555]">
              You selected{" "}
              <span className="text-[#888888]">
                {menuItems.find((i) => i.id === activeItem)?.label}
              </span>
              . This is the main content area where the corresponding
              information would be displayed.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(
              [
                { label: "Projects", value: "24", accent: "text-blue-400" },
                { label: "Tasks", value: "138", accent: "text-purple-400" },
                { label: "Team", value: "12", accent: "text-emerald-400" },
                { label: "Done", value: "89%", accent: "text-amber-400" },
              ] as const
            ).map((card) => (
              <div
                key={card.label}
                className={cn(
                  "rounded-2xl p-5 flex flex-col gap-1 transition-all duration-200",
                  BASE,
                  NEU_OUTER,
                  NEU_HOVER
                )}
              >
                <span className={cn("text-2xl font-bold", card.accent)}>
                  {card.value}
                </span>
                <span className="text-[11px] text-[#555555] uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
            ))}
          </div>

          {/* Recent activity section */}
          <div className="mt-6 flex-1">
            <div
              className={cn(
                "h-full rounded-2xl p-5",
                BASE,
                NEU_OUTER
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-[#444444] mb-4 font-medium">
                Recent Activity
              </p>
              <div className="space-y-3">
                {[
                  { dot: "bg-blue-500", text: "Dashboard metrics updated", time: "2m ago" },
                  { dot: "bg-purple-500", text: "New project created", time: "15m ago" },
                  { dot: "bg-emerald-500", text: "Task #42 completed", time: "1h ago" },
                  { dot: "bg-amber-500", text: "Team member joined", time: "3h ago" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-150",
                      BASE,
                      NEU_INSET_SM
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        item.dot
                      )}
                    />
                    <span className="text-xs text-[#c0c0c0] flex-1">
                      {item.text}
                    </span>
                    <span className="text-[10px] text-[#444444] shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
