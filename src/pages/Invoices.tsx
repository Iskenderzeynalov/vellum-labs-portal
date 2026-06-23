import { ExternalLink, Receipt } from "lucide-react";
import { PageHeader, StatCard } from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { useData } from "../hooks/useData";
import type { ApiInvoice } from "../types";

export function Invoices() {
  const { data: invoices, loading, error } = useData<ApiInvoice[]>("/api/invoices");
  const allInvoices = invoices ?? [];

  // Notion status values: "Sent" | "Processing" | "Payed"
  const totalPaid = allInvoices
    .filter((inv) => inv.status === "Payed")
    .reduce((sum, inv) => sum + (inv.amount ?? 0), 0);

  const outstanding = allInvoices
    .filter((inv) => inv.status !== "Payed")
    .reduce((sum, inv) => sum + (inv.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" subtitle="Your billing history and payment status." />

      {/* Summary stats — show skeleton while loading */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse" />
          ))
        ) : (
          <>
            <StatCard label="Total Paid" value={`€${totalPaid.toLocaleString()}`} sub="All time" />
            <StatCard
              label="Outstanding"
              value={`€${outstanding.toLocaleString()}`}
              sub={outstanding > 0 ? "Due soon" : "Nothing due"}
              accent={outstanding > 0}
            />
            <StatCard
              label="Invoices"
              value={allInvoices.length}
              sub={`${allInvoices.filter((i) => i.status === "Payed").length} paid`}
            />
          </>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
          <p className="text-sm text-red-400">Failed to load invoices: {error}</p>
        </div>
      )}

      {!loading && !error && allInvoices.length === 0 && (
        <div className="py-12 text-center text-zinc-500 text-sm">No invoices yet.</div>
      )}

      {!loading && !error && allInvoices.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 px-5 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <span>Invoice</span>
            <span>Amount</span>
            <span>Due Date</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-zinc-800">
            {allInvoices.map((invoice) => <InvoiceRow key={invoice.id} invoice={invoice} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: ApiInvoice }) {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-5 items-start sm:items-center gap-2 sm:gap-0 px-5 py-4 hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-2">
        <Receipt className="w-4 h-4 text-zinc-500 shrink-0" />
        <span className="text-sm font-medium text-zinc-200">{invoice.invoiceNumber}</span>
      </div>
      <div>
        <span className="text-sm font-semibold text-zinc-100">
          {invoice.amount != null ? `€${invoice.amount.toLocaleString()}` : "—"}
        </span>
      </div>
      <div>
        <span className="text-sm text-zinc-400">
          {invoice.dueDate ? formatDate(invoice.dueDate) : "—"}
        </span>
      </div>
      <div>
        <StatusBadge status={invoice.status} />
      </div>
      <div className="flex justify-end">
        {invoice.pdfLink ? (
          <a
            href={invoice.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20 hover:bg-violet-500/10 transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            PDF
          </a>
        ) : (
          <span className="text-xs text-zinc-600">No PDF yet</span>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "