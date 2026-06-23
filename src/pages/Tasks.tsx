import { useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { PageHeader } from "../components/Card";
import { StatusBadge, PriorityBadge, TypeBadge } from "../components/StatusBadge";
import { useData } from "../hooks/useData";
import type { ApiTask } from "../types";

type FilterTab = "all" | "client" | "vellum" | "completed";

export function Tasks() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const { data: tasks, loading, error } = useData<ApiTask[]>("/api/tasks");

  const allTasks = tasks ?? [];

  const filtered = allTasks.filter((t) => {
    if (filter === "completed") return t.status === "Completed";
    if (filter === "client") return t.taskType === "Client" && t.status !== "Completed";
    if (filter === "vellum") return t.taskType === "Vellum" && t.status !== "Completed";
    return t.status !== "Completed";
  });

  const clientPending = allTasks.filter(
    (t) => t.taskType === "Client" && t.status !== "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Track open tasks, client actions, and completed work." />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 border border-zinc-800 rounded-lg p-1 bg-zinc-900 w-fit">
        {(
          [
            { key: "all", label: "Open" },
            { key: "client", label: `Your Tasks${clientPending > 0 ? ` (${clientPending})` : ""}` },
            { key: "vellum", label: "Vellum Tasks" },
            { key: "completed", label: "Completed" },
          ] as { key: FilterTab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === key ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <LoadingSkeleton rows={4} />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No tasks in this category.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => <TaskRow key={task.id} task={task} />)}
          </div>
        )
      )}
    </div>
  );
}

function TaskRow({ task }: { task: ApiTask }) {
  const isCompleted = task.status === "Completed";

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
        isCompleted
          ? "border-zinc-800/50 bg-zinc-900/50 opacity-60"
          : task.taskType === "Client" && task.status !== "Completed"
          ? "border-amber-400/20 bg-amber-400/5"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : task.status === "In Progress" ? (
          <Clock className="w-5 h-5 text-blue-400" />
        ) : (
          <Circle className="w-5 h-5 text-zinc-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className={`text-sm font-medium ${isCompleted ? "text-zinc-500 line-through" : "text-zinc-100"}`}>
            {task.name}
          </p>
          <TypeBadge type={task.taskType} />
          <PriorityBadge priority={task.priority} />
        </div>
        {task.description && (
          <p className="text-xs text-zinc-400 leading-relaxed mb-2">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={task.status} />
          {task.dueDate && (
            <span className="text-xs text-zinc-500">Due: {formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse" />
      ))}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
      <p className="text-sm text-red-400">Failed to load tasks: {message}</p>
    </div>
  );
}
