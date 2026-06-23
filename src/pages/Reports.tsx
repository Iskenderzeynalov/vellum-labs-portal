import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageHeader, StatCard } from "../components/Card";
import { useData } from "../hooks/useData";
import type { ApiReport } from "../types";

export function Reports() {
  const { data: reports, loading, error } = useData<ApiReport[]>("/api/reports");

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Your weekly and monthly performance results." />

      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
          <p className="text-sm text-red-400">Failed to load reports: {error}</p>
        </div>
      )}

      {!loading && !error && (!reports || reports.length === 0) && (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No reports yet. Your first report will appear here.
        </div>
      )}

      {!loading && !error && reports && reports.length > 0 && (
        <ReportsContent reports={reports} />
      )}
    </div>
  );
}

function ReportsContent({ reports }: { reports: ApiReport[] }) {
  const latest = reports[0];

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-300">Latest: {latest.period}</h2>
          {latest.reportLink && (
            <a
              href={latest.reportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Full Report <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Ad Spend" value={latest.spend != null ? "$" + latest.spend.toLocaleString() : "—"} />
          <StatCard label="Leads" value={latest.leads ?? "—"} accent />
          <StatCard label="Cost Per Lead" value={latest.cpl != null ? "$" + latest.cpl.toFixed(2) : "—"} />
          <StatCard label="Booked Calls" value={latest.bookedCalls ?? "—"} sub={latest.conversionRate != null ? latest.conversionRate + "% booking rate" : undefined} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <HighlightCard icon="win" title="Wins" text={latest.wins} />
          <HighlightCard icon="problem" title="Challenges" text={latest.problems} />
          <HighlightCard icon="next" title="Next Steps" text={latest.nextSteps} />
        </div>
      </div>

      {reports.length > 1 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">Previous Reports</h2>
          <div className="space-y-3">
            {reports.slice(1).map((report) => (
              <PreviousReportRow key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function HighlightCard({ icon, title, text }: { icon: "win" | "problem" | "next"; title: string; text: string }) {
  const styles = {
    win: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    problem: "border-red-500/20 bg-red-500/5 text-red-400",
    next: "border-blue-500/20 bg-blue-500/5 text-blue-400",
  };
  const icons = {
    win: <TrendingUp className="w-4 h-4" />,
    problem: <TrendingDown className="w-4 h-4" />,
    next: <Minus className="w-4 h-4" />,
  };
  return (
    <div className={"rounded-xl border p-4 " + styles[icon]}>
      <div className="flex items-center gap-2 mb-2">
        {icons[icon]}
        <p className="text-xs font-semibold uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-xs text-zinc-300 leading-relaxed">{text || "—"}</p>
    </div>
  );
}

function PreviousReportRow({ report }: { report: ApiReport }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
      <div>
        <p className="text-sm font-medium text-zinc-200">{report.period}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {report.leads ?? "—"} leads
          {report.cpl != null ? " · CPL $" + report.cpl.toFixed(2) : ""}
          {report.bookedCalls != null ? " · " + report.bookedCalls + " calls" : ""}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-zinc-200">
            {report.spend != null ? "$" + report.spend.toLocaleString() : "—"}
          </p>
          <p className="text-xs text-zinc-500">spend</p>
        </div>
        {report.reportLink && (
          <a
            href={report.reportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 transition-all"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
