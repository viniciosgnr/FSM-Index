"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Ship,
  ClipboardList,
  Settings,
  FileUp,
  AlertTriangle,
  ChevronRight,
  Activity,
} from "lucide-react";

const navItems = [
  {
    group: "Main",
    items: [
      { href: "/dashboard",        label: "Dashboard",   icon: LayoutDashboard },
      { href: "/dashboard/analytics", label: "Analytics", icon: Activity },
      { href: "/dashboard/fpsos",  label: "By FPSO",     icon: Ship },
      { href: "/dashboard/trends", label: "Trends",      icon: BarChart3 },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/dashboard/work-orders", label: "Work Orders",   icon: ClipboardList },
      { href: "/dashboard/faas",        label: "FAAs",          icon: AlertTriangle },
      { href: "/dashboard/upload",      label: "Import Data",   icon: FileUp },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 shrink-0 flex flex-col h-screen"
      style={{ backgroundColor: "var(--sbm-navy)", borderRight: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* ── Logo ───────────────────────────────────────────── */}
      <div
        className="px-4 py-3 flex items-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* White pill background so the logo reads well on dark navy */}
        <div className="bg-white rounded-md px-3 py-1.5 inline-flex">
          <Image
            src="/images/sbm_logo.png"
            alt="SBM Offshore"
            width={160}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />
        </div>
      </div>

      {/* ── Extraction badge ────────────────────────────────── */}
      <div
        className="mx-4 mt-3 mb-1 px-3 py-2 rounded-md"
        style={{
          backgroundColor: "rgba(242,101,34,0.12)",
          border: "1px solid rgba(242,101,34,0.25)",
        }}
      >
        <p
          className="text-[0.6rem] uppercase tracking-wider font-semibold mb-0.5"
          style={{ color: "#F26522" }}
        >
          Last Extraction
        </p>
        <p className="text-xs font-semibold" style={{ color: "#E8ECF4" }}>
          05/04/2026
        </p>
        <p className="text-[0.6rem]" style={{ color: "rgba(232,236,244,0.5)" }}>
          Jan/2025 → Apr/2026
        </p>
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navItems.map((group) => (
          <div key={group.group}>
            <p
              className="px-2 mb-1 text-[0.58rem] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(232,236,244,0.4)" }}
            >
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all group"
                      style={
                        active
                          ? {
                              backgroundColor: "#F26522",
                              color: "#FFFFFF",
                              fontWeight: 600,
                            }
                          : {
                              color: "rgba(232,236,244,0.7)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            "rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            "rgba(232,236,244,0.7)";
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{label}</span>
                      {active && <ChevronRight className="w-3 h-3 opacity-70" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User footer ─────────────────────────────────────── */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "#F26522" }}
          >
            CM
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "#E8ECF4" }}
            >
              Change Management
            </p>
            <p
              className="text-[0.6rem] truncate"
              style={{ color: "rgba(232,236,244,0.5)" }}
            >
              SBM Offshore
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
