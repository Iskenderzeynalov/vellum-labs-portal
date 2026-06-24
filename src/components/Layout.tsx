import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Users,
  Link2,
  FileText,
  MessageSquarePlus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useClient } from "../context/ClientContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/reports", label: "Reports", icon: BarChart2 },
  { to: "/meetings", label: "Meetings", icon: Users },
  { to: "/links", label: "Links & Assets", icon: Link2 },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/request", label: "Request Update", icon: MessageSquarePlus },
];

function NavItem({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
          isActive
            ? "bg-zinc-800 text-zinc-100 font-medium"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </NavLink>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleNavClick = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-zinc-800 bg-zinc-900/50">
        <SidebarContent onNavClick={handleNavClick} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-72 h-full border-r border-zinc-800 bg-zinc-900">
            <SidebarContent onNavClick={handleNavClick} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <VellumLogo size="sm" />
            <span className="text-sm font-semibold text-zinc-100">Vellum Labs</span>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavClick }: { onNavClick: () => void }) {
  const { client, loading } = useClient();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-800">
        <VellumLogo />
        <div>
          <p className="text-sm font-semibold text-zinc-100 leading-tight">Vellum Labs</p>
          <p className="text-xs text-zinc-500 leading-tight">Client Portal</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Logged in as</p>
        {loading ? (
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mt-1" />
        ) : (
          <>
            <p className="text-sm font-medium text-zinc-200">{client?.name ?? "—"}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{client?.status ?? ""}</p>
          </>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavClick} />
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600">
          {"©"} 2026 Vellum Labs
          <br />
          All data is confidential.
        </p>
      </div>
    </div>
  );
}

function VellumLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  return (
    <div className={clsx(s, "rounded-lg bg-violet-600 flex items-center justify-center shrink-0")}>
      <span className={clsx("font-bold text-white", size === "sm" ? "text-xs" : "text-sm")}>
        V
      </span>
    </div>
  );
}
