import { ExternalLink, FolderOpen, Globe, Image, FileText, Wrench, BarChart2 } from "lucide-react";
import { PageHeader } from "../components/Card";
import { useData } from "../hooks/useData";
import type { ApiLink } from "../types";

const TYPE_ICONS: Record<string, React.ElementType> = {
  "Google Drive": FolderOpen,
  "Analytics Dashboard": BarChart2,
  "Landing Page": Globe,
  "Ad Creative": Image,
  "Report": FileText,
  "Tool": Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  "Google Drive": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Analytics Dashboard": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Landing Page": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Ad Creative": "text-violet-400 bg-violet-400/10 border-violet-400/20",
  "Report": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Tool": "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

export function Links() {
  const { data: links, loading, error } = useData<ApiLink[]>("/api/links");

  const grouped = (links ?? []).reduce<Record<string, ApiLink[]>>((acc, link) => {
    if (!acc[link.type]) acc[link.type] = [];
    acc[link.type].push(link);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Links & Assets" subtitle="All important links, files, and resources for your project." />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
          <p className="text-sm text-red-400">Failed to load links: {error}</p>
        </div>
      )}

      {!loading && !error && Object.keys(grouped).length === 0 && (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No links or assets added yet.
        </div>
      )}

      {!loading && !error && Object.entries(grouped).map(([type, items]) => {
        const Icon = TYPE_ICONS[type] ?? ExternalLink;
        const colorClass = TYPE_COLORS[type] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                <Icon className="w-3 h-3" />
                {type}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((link) => <LinkCard key={link.id} link={link} Icon={Icon} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LinkCard({ link, Icon }: { link: ApiLink; Icon: React.ElementType }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/70 hover:border-zinc-700 transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 group-hover:border-zinc-600 transition-colors">
        <Icon className="w-4 h-4 text-zinc-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
            {link.name}
          </p>
          <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {link.description && (
          <p className="text-xs text-z