import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Target, Zap } from "lucide-react";
import { Card, PageHeader, StatCard } from "../components/Card";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { useClient } from "../context/ClientContext";
import { useData } from "../hooks/useData";
import type { ApiTask, ApiReport } from "../types";

export function Dashboard() {
  const { client, loading: clientLoading } = useClient();
  const { data: tasks } = useData<ApiTask[]>("/api/tasks");
  const { data: reports } = useData<ApiReport[]>("/api/reports");

  const latestReport = reports?.[0] ?? null;
  const urgentClientTasks = (tasks ?? []).filter(
    (t) => t.taskType === "Client" && t.status !== "Completed"
  );

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400 text-sm">Could not load your profile. Please refresh or contact Vellum Labs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Welcome back, " + client.name}
        subtitle={"Here is your project overview for " + client.currentPhase}
      />

      {/* Status bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <StatusBadge status={client.status} />
        {client.healthStatus && <StatusBadge status={client.healthStatus} />}
        <span className="text-xs text-zinc-500">{client.currentPhase}</span>
      </div>

      {/* Main goal */}
      {client.mainGoal && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-violet-400 uppercase tracking-wider font-medium mb-1">
                Current Goal
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed">{client.mainGoal}</p>
            </div>
          </div>
        </div>
      )}

      {/* Latest summary */}
      {client.latestSummary && (
        <Card>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-zinc-100">Latest Update</h2>
            <p className="text-xs text-zinc-500 mt-0.5">From your Vellum Labs team</p>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{client.latestSummary}</p>
          {client.nextSteps && (
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-3">
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Next Steps</p>
              <p className="text-sm text-zinc-300">{client.nextSteps}</p>
            </div>
          )}
        </Card>
      )}

      {/* Stats from latest report */}
      {latestReport && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300">Latest Report Snapshot</h2>
            <Link
              to="/reports"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Full report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Ad Spend" value={latestReport.spend != null ? "$" + latestReport.spend.toLocaleString() : "—"} sub={latestReport.period} />
            <StatCard label="Leads" value={latestReport.leads ?? "—"} sub={latestReport.cpl != null ? "CPL $" + latestReport.cpl.toFixed(2) : undefined} accent />
            <StatCard label="Booked Calls" value={latestReport.bookedCalls ?? "—"} />
            <StatCard label="Booking Rate" value={latestReport.conversionRate != null ? latestReport.conversionRate + "%" : "—"} />
          </div>
        </div>
      )}

      {/* Urgent client tasks */}
      {urgentClientTasks.length > 0 && (
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Action Required</h2>
              <p className="text-xs text-zinc-500 mt-0.5">These tasks need your attention</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors ml-4 shrink-0"
            >
              All tasks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {urgentClientTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-amber-400/5 border border-amber-400/15"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-zinc-200">{task.name}</p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-xs text-zinc-500 mt-1">Due: {formatDate(task.dueDate)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickLink
          to="/tasks"
          icon={Zap}
          label="View All Tasks"
          count={(tasks ?? []).filter((t) => t.status !== "Completed").length}
        />
        <QuickLink to="/reports" icon={ArrowRight} label="Latest Report" />
        <QuickLink to="/request" icon={ArrowRight} label="Request Update" highlight />
      </div>
    </div>
  );
}

function QuickLink({
  to, icon: Icon, label, count, highlight,
}: {
  to: string; icon: React.ElementType; label: string; count?: number; highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all " +
        (highlight
          ? "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100")
      }
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">{count}</span>
        )}
        <Icon className="w-4 h-4 opacity-50" />
      </div>
    </Link>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
